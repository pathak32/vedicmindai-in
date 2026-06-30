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

    const basePlan = plan.replace('_annual', '');
    const isAnnual = plan.includes('_annual');
    const periodMs = isAnnual ? 365 * 86400000 : 30 * 86400000;
    const expiresAt = new Date(Date.now() + periodMs).toISOString();

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
