// Vercel Serverless Function — Create Razorpay Order
// Creates a real Razorpay order with the amount looked up server-side,
// based on the plan name sent from the frontend. This is the critical
// security property: the amount is NEVER taken from the browser request,
// only the plan identifier is — otherwise someone could open dev tools and
// change the amount before it reaches Razorpay, paying ₹1 for a Family plan.
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Source of truth for pricing — amounts in paise (Razorpay's smallest unit).
// Keep this in sync with the prices displayed in PricingPage.jsx.
const PLAN_AMOUNTS = {
  basic: 29900,           // ₹299/month
  basic_annual: 299000,   // ₹2,990/year
  pro: 59900,             // ₹599/month
  pro_annual: 599000,     // ₹5,990/year
  family: 89900,          // ₹899/month
  family_annual: 899000,  // ₹8,990/year
};

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

    const amount = PLAN_AMOUNTS[plan];
    if (!amount) {
      return res.status(400).json({ error: `Unknown plan: ${plan}` });
    }

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `vm_${plan}_${Date.now()}`.slice(0, 40),
      notes: {
        plan,
        userId: userId || 'unknown',
      },
    });

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan,
    });
  } catch (error) {
    console.error('create-razorpay-order error:', error);
    return res.status(500).json({ error: error.message });
  }
}
