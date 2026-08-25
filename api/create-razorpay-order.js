// Vercel Serverless Function — Create Razorpay Order
// Creates a real Razorpay order with the amount looked up server-side,
// based on the plan name sent from the browser. This is the critical
// security property: the amount is NEVER taken from the browser request,
// only the plan identifier and userId are — otherwise someone could open
// dev tools and change the amount before it reaches Razorpay.
//
// Knowledge Points discount is also applied server-side here — same
// principle: never trust a discount value sent from the browser.
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

const razorpay = new Razorpay({
  key_id: process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Supabase admin client — only used server-side, never exposed to the browser.
// Uses the service role key so it can read the user's discount eligibility
// even if row-level security would otherwise block it.
function getSupabaseAdmin() {
  return createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

const PLAN_AMOUNTS = {
  basic: 49900,            // ₹499/month
  basic_annual: 399900,    // ₹3,999/year
  pro: 99900,              // ₹999/month
  pro_annual: 799900,      // ₹7,999/year
  basic_lifetime: 999900,    // ₹9,999 one-time
  basic_founding: 12500,       // ₹125 — Founding 500 early bird (months 1 & 2)
  basic_founding_reduced: 25000, // ₹250 — Founding member loyalty (XP >= 200)

};

// Maximum discount allowed — 50%. Even if a user has earned 50% in the
// Knowledge Points system, they always pay at least half the plan price.
const MAX_DISCOUNT_PCT = 50;

// Look up the user's earned discount percentage from Supabase server-side.
// Returns 0 if the user hasn't earned a discount, or if anything goes wrong
// (fail-open: charge full price rather than accidentally blocking a payment).
async function getEarnedDiscountPct(userId, isAnnual) {
  if (!userId || userId === 'unknown') return 0;
  try {
    const sb = getSupabaseAdmin();
    if (isAnnual) {
      const { data } = await sb
        .from('knowledge_points_annual_lock')
        .select('locked_discount_pct, redeemed_at_renewal')
        .eq('user_id', userId)
        .order('subscription_start_date', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!data || data.redeemed_at_renewal) return 0;
      return Math.min(data.locked_discount_pct || 0, MAX_DISCOUNT_PCT);
    } else {
      const monthYear = new Date().toISOString().slice(0, 7); // YYYY-MM
      const { data } = await sb
        .from('knowledge_points_monthly')
        .select('discount_pct, criteria_met, redeemed')
        .eq('user_id', userId)
        .eq('month_year', monthYear)
        .maybeSingle();
      if (!data || !data.criteria_met || data.redeemed) return 0;
      return Math.min(data.discount_pct || 0, MAX_DISCOUNT_PCT);
    }
  } catch (e) {
    console.warn('getEarnedDiscountPct failed (applying 0 discount):', e.message);
    return 0;
  }
}

// Mark the discount as redeemed so it can't be used twice.
// Called only after the order is successfully created with a discounted amount.
async function markDiscountRedeemed(userId, isAnnual) {
  try {
    const sb = getSupabaseAdmin();
    if (isAnnual) {
      await sb
        .from('knowledge_points_annual_lock')
        .update({ redeemed_at_renewal: true, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .order('subscription_start_date', { ascending: false })
        .limit(1);
    } else {
      const monthYear = new Date().toISOString().slice(0, 7);
      await sb
        .from('knowledge_points_monthly')
        .update({ redeemed: true, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('month_year', monthYear);
    }
  } catch (e) {
    // Non-critical — log it but don't fail the payment
    console.warn('markDiscountRedeemed failed (non-critical):', e.message);
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { plan, userId } = req.body;
    if (!plan) {
      return res.status(400).json({ error: 'Missing required field: plan' });
    }

    const baseAmount = PLAN_AMOUNTS[plan];
    if (!baseAmount) {
      return res.status(400).json({ error: `Unknown plan: ${plan}` });
    }

    // Look up Knowledge Points discount — server-side only, never from browser
    const isAnnual = plan.includes('_annual');
    const isFounding = plan.startsWith('basic_founding');
    const discountPct = await getEarnedDiscountPct(userId, isAnnual);
    const discountedAmount = discountPct > 0
      ? Math.round(baseAmount * (1 - discountPct / 100))
      : baseAmount;

    const order = await razorpay.orders.create({
      amount: discountedAmount,
      currency: 'INR',
      receipt: `vm_${plan}_${Date.now()}`.slice(0, 40),
      notes: {
        plan,
        userId: userId || 'unknown',
        knowledgePointsDiscount: discountPct > 0 ? `${discountPct}%` : 'none',
        originalAmount: baseAmount,
      },
    });

    // Only mark redeemed once the order is successfully created
    if (discountPct > 0) {
      await markDiscountRedeemed(userId, isAnnual);
    }

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan,
      discountApplied: discountPct,
      originalAmount: baseAmount,
    });
  } catch (error) {
    console.error('create-razorpay-order error:', error);
    return res.status(500).json({
      error: error.message || "Unknown error",
      errorDetail: typeof error === "object" ? JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))) : String(error),
    });
  }
}
