// Vercel Serverless Function — Razorpay Webhook Handler
//
// WHY THIS EXISTS (and why it's different from verify-razorpay-payment.js):
// The browser-side flow works like this:
//   1. User pays in the Razorpay checkout widget
//   2. Razorpay calls our JS handler with a signature
//   3. Browser POSTs to /api/verify-razorpay-payment
//   4. We verify the signature and activate the plan
//
// The problem: if the user's browser closes, crashes, loses connectivity,
// or they navigate away immediately after paying — step 3 never happens.
// Razorpay received the money, but the plan is never activated. The user
// is charged but can't access what they paid for.
//
// Webhooks fix this: Razorpay also sends an event directly to THIS endpoint
// from their servers, bypassing the browser entirely. Even if the browser
// flow fails, this handler catches the payment and activates the plan.
//
// SIGNATURE VERIFICATION:
// Webhook signatures use a separate RAZORPAY_WEBHOOK_SECRET (set in both
// the Razorpay dashboard when creating the webhook AND in Vercel env vars).
// This is different from RAZORPAY_KEY_SECRET — don't mix them up.
//
// IDEMPOTENCY:
// Both the browser flow and this webhook might activate the same payment
// (normal race condition if both succeed). The upsert below handles this
// safely — the second write just overwrites with identical data.

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Razorpay sends the raw body as-is for webhook signature verification.
// Vercel parses the body by default, which breaks HMAC verification.
// We need the raw body string, exactly as Razorpay sent it.
export const config = {
  api: {
    bodyParser: false,
  },
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function getSupabaseAdmin() {
  return createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Plan period in milliseconds
function getPeriodMs(planStatus) {
  return planStatus?.includes('_annual') ? 365 * 86400000 : 30 * 86400000;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Step 1 — Read raw body (needed for HMAC verification)
  let rawBody;
  try {
    rawBody = await getRawBody(req);
  } catch (e) {
    console.error('razorpay-webhook: failed to read raw body:', e.message);
    return res.status(400).json({ error: 'Could not read request body' });
  }

  // Step 2 — Verify the webhook signature
  // Razorpay sends X-Razorpay-Signature in the request headers.
  // We recompute the HMAC-SHA256 of the raw body using our webhook secret
  // and compare. If they don't match, this request didn't come from Razorpay.
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('razorpay-webhook: RAZORPAY_WEBHOOK_SECRET is not set');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  const receivedSignature = req.headers['x-razorpay-signature'];
  if (!receivedSignature) {
    console.error('razorpay-webhook: missing X-Razorpay-Signature header');
    return res.status(400).json({ error: 'Missing signature header' });
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  if (expectedSignature !== receivedSignature) {
    console.error('razorpay-webhook: signature mismatch — request rejected');
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  // Step 3 — Parse the verified event
  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (e) {
    console.error('razorpay-webhook: failed to parse JSON:', e.message);
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const eventType = event.event;
  const payment = event.payload?.payment?.entity;

  console.log(`razorpay-webhook: received event '${eventType}'`);

  // Step 4 — Handle the events we care about
  if (eventType === 'payment.captured') {
    // Payment successfully captured — activate the plan
    // The notes field on the Razorpay order contains plan + userId,
    // set when we created the order in create-razorpay-order.js
    const notes = payment?.notes || {};
    const userId = notes.userId;
    const plan = notes.plan;
    const paymentId = payment?.id;
    const orderId = payment?.order_id;

    if (!userId || !plan || userId === 'unknown') {
      // This can happen if the order was created without userId (e.g. a manual
      // test payment from the Razorpay dashboard). Log it but don't error.
      console.warn('razorpay-webhook: payment.captured missing userId or plan in notes', notes);
      return res.status(200).json({ received: true, action: 'skipped — missing userId or plan' });
    }

    try {
      const sb = getSupabaseAdmin();
      const basePlan = plan.replace('_annual', '');
      const isAnnual = plan.includes('_annual');
      const periodMs = getPeriodMs(plan);
      const expiresAt = new Date(Date.now() + periodMs).toISOString();

      const { error } = await sb
        .from('profiles')
        .update({
          plan: basePlan,
          plan_status: plan,
          plan_expires_at: expiresAt,
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
        })
        .eq('id', userId);

      if (error) {
        console.error('razorpay-webhook: profile update failed:', error);
        // Return 500 so Razorpay retries (they retry failed webhooks)
        return res.status(500).json({ error: 'Plan activation failed — will retry' });
      }

      // Seed the annual lock record if this is an annual plan
      // (so Knowledge Points accumulation can start from this subscription date)
      if (isAnnual) {
        await sb
          .from('knowledge_points_annual_lock')
          .upsert({
            user_id: userId,
            subscription_start_date: new Date().toISOString().slice(0, 10),
            locked_tier: 0,
            locked_discount_pct: 0,
            redeemed_at_renewal: false,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id,subscription_start_date' });
      }

      console.log(`razorpay-webhook: plan '${plan}' activated for user ${userId}`);
      return res.status(200).json({ received: true, action: 'plan_activated', plan, userId });

    } catch (e) {
      console.error('razorpay-webhook: unexpected error during activation:', e.message);
      return res.status(500).json({ error: e.message });
    }

  } else if (eventType === 'payment.failed') {
    // Payment failed — log it; no plan activation, no user action needed here.
    // The Razorpay checkout widget already shows the user an error message.
    const notes = payment?.notes || {};
    console.log(`razorpay-webhook: payment failed for user ${notes.userId}, plan ${notes.plan}`);
    return res.status(200).json({ received: true, action: 'logged_failure' });

  } else {
    // Other event types (refunds, disputes, etc.) — acknowledge receipt
    // but take no action. Razorpay expects a 200 from all webhook calls
    // or it will keep retrying.
    console.log(`razorpay-webhook: unhandled event type '${eventType}' — acknowledged`);
    return res.status(200).json({ received: true, action: 'unhandled_event' });
  }
}
