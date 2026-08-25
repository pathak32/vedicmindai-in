// Vercel Serverless Function — Verify Razorpay Payment
// Razorpay sends back razorpay_order_id, razorpay_payment_id, and
// razorpay_signature after a successful Checkout payment. This endpoint
// recomputes the expected signature server-side using the key secret and
// compares it to what was received. Only if they match do we know the
// payment is genuine and untampered — only then do we activate the plan
// in Supabase.
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
      userId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature — payment could not be verified' });
    }

    const basePlan = plan.replace('_annual', '').replace('_lifetime', '').replace('_founding', '');
    const isAnnual = plan.includes('_annual');
    const isLifetime = plan.includes('_lifetime');
    const isLifetime = plan.includes('_annual');
    const periodMs = isAnnual ? 365 * 86400000 : 30 * 86400000;
    const expiresAt = isLifetime
      ? new Date('2099-12-31T23:59:59.000Z').toISOString()
      : new Date(Date.now() + periodMs).toISOString();

    const { error: profileErr } = await supabase
      .from('profiles')
      .update({
        plan: basePlan,
        plan_status: plan,
        plan_expires_at: expiresAt,
        razorpay_payment_id,
        razorpay_order_id,
      })
      .eq('id', userId);

    if (profileErr) {
      console.error('verify-razorpay-payment: profile update failed after verified payment:', profileErr);
      return res.status(500).json({
        error: 'Payment verified but plan activation failed — contact support with your payment ID.',
        razorpay_payment_id,
        verified: true,
      });
    }

    // ── Referral crediting (same logic as webhook) ─────────────────────
    try {
      const { data: profile } = await supabase.from('profiles').select('referral_code').eq('id', userId).maybeSingle();
      if (profile?.referral_code) {
        const { data: referrer } = await supabase.from('referrals').select('user_id, converted_count, referral_count').eq('referral_code', profile.referral_code).maybeSingle();
        if (referrer && referrer.user_id !== userId) {
          const newConverted = (referrer.converted_count || 0) + 1;
          await supabase.from('referrals').update({ converted_count: newConverted, referral_count: (referrer.referral_count || 0) + 1 }).eq('user_id', referrer.user_id);
          if (newConverted >= 5 && newConverted % 5 === 0) {
            const { data: rp } = await supabase.from('profiles').select('plan, plan_expires_at').eq('id', referrer.user_id).maybeSingle();
            if (rp?.plan && rp.plan !== 'free') {
              const newExpiry = new Date(Math.max(new Date(rp.plan_expires_at || 0).getTime(), Date.now()) + 30 * 86400000);
              await supabase.from('profiles').update({ plan_expires_at: newExpiry.toISOString() }).eq('id', referrer.user_id);
            }
          }
        }
      }
    } catch (_) { /* non-critical */ }
    // ── End referral crediting ──────────────────────────────────────────

    return res.status(200).json({
      success: true,
      plan: basePlan,
      planStatus: plan,
      expiresAt,
      razorpay_payment_id,
    });
  } catch (error) {
    console.error('verify-razorpay-payment error:', error);
    return res.status(500).json({ error: error.message });
  }
}
