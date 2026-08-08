import React, { useState } from 'react';
import { useCanonical } from '@/lib/useCanonical';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { useLanguage } from '@/lib/LanguageContext';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { loadRazorpayScript } from '@/lib/loadRazorpay';
import { isRunningInTWA } from '@/lib/isTWA';
import LifetimeBanner from '@/components/landing/LifetimeBanner';
import FoundingSection from '@/components/landing/FoundingSection';

const glass = {
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(30,64,175,0.15)',
  boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
  borderRadius: 16,
  padding: '28px 24px',
};

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    badge: 'Free forever',
    badgeBg: '#F0F4FF',
    badgeColor: '#1E40AF',
    monthlyPrice: '₹0',
    monthlyStrike: null,
    annualPrice: '₹0',
    annualStrike: null,
    annualSub: 'Always free',
    discount: null,
    highlight: false,
    btnLabel: 'Get Started Free',
    btnBg: '#4B5563',
    subtext: null,
    features: [
      { text: 'Lesson 1 — Introduction to Vedic Maths (Beginner)', included: true },
      { text: 'Daily Quiz every day', included: true },
      { text: 'View-only Leaderboard', included: true },
      { text: 'Aptitude: 5 questions/month', included: true },
      { text: 'AI Tutor: 1 question/day', included: true },
      { text: 'All 40 lessons', included: false },
      { text: 'Weekly Exam', included: false },
      { text: 'Battle Mode participation', included: false },
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    badge: '67% off launch price',
    badgeBg: '#ECFDF5',
    badgeColor: '#065F46',
    monthlyPrice: '₹499',
    monthlyStrike: '₹1,500',
    annualPrice: '₹3,999',
    annualStrike: '₹5,988',
    annualSub: '= ₹333/month · Save ₹1,989/year',
    discount: '67% off',
    monthlyPaise: 49900,
    annualPaise: 399900,
    usdMonthly: '$9',
    usdMonthlyStrike: '$19',
    usdAnnual: '$39',
    usdAnnualStrike: '$180',
    highlight: false,
    btnLabel: 'Start Basic',
    btnBg: '#0A1628',
    subtext: null,
    features: [
      { text: 'All 40 lessons', included: true },
      { text: 'Daily Quiz every day', included: true },
      { text: 'AI Tutor — 5× more than Free', included: true },
      { text: 'Aptitude: 30 questions/month', included: true },
      { text: 'Class Leaderboard', included: true },
      { text: 'Battle Mode', included: true },
      { text: 'Olympiad (₹19/entry)', included: true },
      { text: 'Hindi/Multilingual (Pro only)', included: false },
      { text: 'Global Leaderboard (Pro only)', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: '67% off launch price',
    badgeBg: '#ECFDF5',
    badgeColor: '#065F46',
    monthlyPrice: '₹999',
    monthlyStrike: '₹3,000',
    annualPrice: '₹7,999',
    annualStrike: '₹11,988',
    annualSub: '= ₹666/month · Save ₹3,989/year',
    discount: '67% off',
    monthlyPaise: 99900,
    annualPaise: 799900,
    usdMonthly: '$15',
    usdMonthlyStrike: '$29',
    usdAnnual: '$79',
    usdAnnualStrike: '$348',
    highlight: true,
    btnLabel: 'Start Pro',
    btnBg: '#3B82F6',
    subtext: null,
    features: [
      { text: 'Everything in Basic', included: true },
      { text: 'AI Tutor — 4× more than Basic', included: true },
      { text: 'Aptitude Module (unlimited)', included: true },
      { text: 'Class + School + Global Leaderboard', included: true },
      { text: 'Weekly Report Card', included: true },
      { text: 'Multilingual (Hindi, Tamil, Marathi)', included: true },
      { text: 'Priority Support', included: true },
    ],
  },
  {
    id: 'family',
    name: 'Family',
    badge: '70% off launch price',
    badgeBg: '#ECFDF5',
    badgeColor: '#065F46',
    monthlyPrice: '₹1,499',
    monthlyStrike: '₹5,000',
    annualPrice: '₹14,990',
    annualStrike: '₹60,000',
    annualSub: '= ₹1,249/month · 2 months FREE',
    discount: '70% off',
    monthlyPaise: 149900,
    annualPaise: 1499000,
    usdMonthly: '$23',
    usdMonthlyStrike: '$39',
    usdAnnual: '$219',
    usdAnnualStrike: '$468',
    highlight: false,
    btnLabel: 'Start Family Plan',
    btnBg: '#0A1628',
    subtext: 'For up to 3 family members',
    features: [
      { text: 'Pro plan for 3 members', included: true },
      { text: 'Parent dashboard', included: true },
      { text: 'Individual progress per child', included: true },
      { text: 'One subscription, whole family', included: true },
    ],
  },
];

const PLAN_DISPLAY_NAMES = {
  basic: 'Basic', pro: 'Pro', family: 'Family',
  basic_annual: 'Basic (Annual)', pro_annual: 'Pro (Annual)', family_annual: 'Family (Annual)',
};

function PlanCard({
  plan, isAnnual, showUSD, onPay, isCurrent, isFree, disablePurchase }) {
  const { t } = useLanguage();
  const mainPrice = showUSD
    ? (isAnnual ? plan.usdAnnual : plan.usdMonthly) || (isAnnual ? plan.annualPrice : plan.monthlyPrice)
    : (isAnnual ? plan.annualPrice : plan.monthlyPrice);
  const strikePrice = showUSD
    ? (isAnnual ? plan.usdAnnualStrike : plan.usdMonthlyStrike)
    : (isAnnual ? plan.annualStrike : plan.monthlyStrike);
  const perLabel = isAnnual ? t('perYear') : t('perMonth');
  const altPrice = showUSD ? (isAnnual ? plan.annualPrice : plan.monthlyPrice) : (isAnnual ? plan.usdAnnual : plan.usdMonthly);
  return (
    <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 320 }}>
      {plan.highlight && !isCurrent && (
        <div style={{
          position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
          background: '#3B82F6', color: 'white', borderRadius: 99, padding: '4px 14px',
          fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', zIndex: 2,
        }}>{t('mostPopular')}</div>
      )}
      {isCurrent && (
        <div style={{
          position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
          background: '#10B981', color: 'white', borderRadius: 99, padding: '4px 14px',
          fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', zIndex: 2,
        }}>Your Plan ✓</div>
      )}

      <div style={{
        ...glass,
        border: isCurrent ? '2px solid #10B981' : plan.highlight ? '2px solid #3B82F6' : '1px solid rgba(30,64,175,0.15)',
        display: 'flex', flexDirection: 'column', height: '100%',
      }}>
        {/* Plan name + badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            {plan.name}
          </div>
          {plan.badge && (
            <span style={{ background: plan.badgeBg, color: plan.badgeColor, borderRadius: 99, padding: '2px 10px', fontSize: 10, fontFamily: 'var(--font-body)', fontWeight: 700 }}>
              {plan.badge}
            </span>
          )}
        </div>

        {/* Price */}
        <div style={{ marginBottom: 4 }}>
            {strikePrice && (
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#9CA3AF', textDecoration: 'line-through' }}>{strikePrice}{isAnnual ? '/year' : '/month'}</div>
            )}
            <span className="font-heading" style={{ fontSize: isAnnual ? 32 : 40, fontWeight: 700, color: '#0A1628' }}>{mainPrice || (plan.id === 'free' ? (showUSD ? '$0' : '₹0') : '—')}</span>
            {mainPrice && <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}>{perLabel}</span>}
            {isAnnual && !showUSD && plan.annualSub && (
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#10B981', fontWeight: 600, marginTop: 4 }}>{plan.annualSub}</div>
            )}
            {isAnnual && showUSD && plan.usdAnnual && (
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#10B981', fontWeight: 600, marginTop: 4 }}>= {plan.usdMonthly}/month · 2 months FREE</div>
            )}
            {altPrice && plan.id !== 'free' && (
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
                ≈ {altPrice} {showUSD ? 'INR' : 'USD'} · {showUSD ? 'charged in INR, bank converts' : 'for international cards'}
              </div>
            )}
          </div>

          {plan.subtext && (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B7280', marginBottom: 8 }}>{plan.subtext}</div>
          )}

        <div style={{ height: 1, background: 'rgba(30,64,175,0.08)', margin: '16px 0' }} />

        <div style={{ flex: 1, marginBottom: 24 }}>
          {plan.features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{f.included ? '✅' : '❌'}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.4, color: f.included ? '#0A1628' : '#9CA3AF' }}>
                {f.text}
              </span>
            </div>
          ))}
        </div>

        {disablePurchase && !isCurrent && !isFree ? (
          <div style={{
            width: '100%', borderRadius: 12, padding: '12px 14px',
            background: 'rgba(30,64,175,0.06)', border: '1px solid rgba(30,64,175,0.15)',
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#0A1628', marginBottom: 2 }}>
              Subscribe on our website
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#6B7280' }}>
              Visit vedicmindai.in in your browser to upgrade
            </div>
          </div>
        ) : (
          <button
            onClick={() => !isCurrent && !isFree && onPay()}
            disabled={isCurrent}
            style={{
              width: '100%', height: 48, border: 'none', borderRadius: 12,
              background: isCurrent ? '#10B981' : plan.btnBg,
              color: 'white', fontFamily: 'var(--font-body)',
              fontSize: 15, fontWeight: 500, cursor: isCurrent ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            {isCurrent ? 'Current Plan ✓' : plan.btnLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default function PricingPage() {
  useCanonical('/pricing');
  const { t } = useLanguage();
  const { user } = useVedicAuth();
  const [isAnnual, setIsAnnual] = useState(false);
  const [showUSD, setShowUSD] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();
  const inTWA = isRunningInTWA();

  const plan = JSON.parse(localStorage.getItem('vedicmind_plan') || '{}');
  const isPaid = ['basic', 'pro', 'family', 'basic_annual', 'pro_annual', 'family_annual'].includes(plan.planStatus);
  const currentPlanName = PLAN_DISPLAY_NAMES[plan.planStatus] || '';

  function isCurrentPlan(planName) {
    if (!isPaid) return false;
    return plan.planStatus === planName.toLowerCase() || plan.planStatus === planName.toLowerCase() + '_annual';
  }

  // Real Razorpay Checkout SDK driven by a server-created order — this is
  // the secure flow: the amount is decided server-side in
  // /api/create-razorpay-order (never trusted from the browser), and the
  // payment is cryptographically verified server-side in
  // /api/verify-razorpay-payment before Supabase is updated. Replaces the
  // earlier client-only flow where the amount and "success" state were
  // both just trusted from the browser with no server confirmation.
  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

  async function initiatePayment(planObj) {
    if (!user?.id) {
      alert('Please sign in again before subscribing.');
      navigate('/auth');
      return;
    }
    const razorpayReady = await loadRazorpayScript();
    if (!razorpayReady || !window.Razorpay) {
      alert('Payment system failed to load. Please check your connection and try again.');
      return;
    }

    const planId = planObj.id === 'basic_lifetime' ? 'basic_lifetime' : (isAnnual ? `${planObj.id}_annual` : planObj.id);
    const planLabel = planObj.id === 'basic_lifetime' ? 'Basic (Lifetime)' : (isAnnual ? `${planObj.name} (Annual)` : planObj.name);

    setPaymentLoading(true);
    try {
      // Step 1 — server creates the order with the correct amount
      const orderRes = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, userId: user.id }),
      });
      let orderData;
      try {
        orderData = await orderRes.json();
      } catch (parseErr) {
        console.error('create-razorpay-order returned non-JSON response:', parseErr);
        throw new Error(`Payment server returned an unexpected response (status ${orderRes.status}). This usually means a server-side configuration issue — check Vercel function logs.`);
      }
      if (!orderRes.ok) {
        console.error('create-razorpay-order failed:', orderData);
        throw new Error(orderData.error || `Could not start payment (status ${orderRes.status}). Check Vercel function logs for the exact cause.`);
      }

      // Step 2 — open Checkout against that specific order
      const discountApplied = orderData.discountApplied || 0;
      const planDescription = discountApplied > 0
        ? `${planLabel} Plan — ${discountApplied}% Knowledge Points discount applied! 🎉`
        : `${planLabel} Plan Subscription`;

      const options = {
        key: RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'VedicMindAI',
        description: planDescription,
        image: 'https://vedicmindai.in/logo.png',
        theme: { color: '#1E40AF' },
        handler: async function (response) {
          // Step 3 — server verifies the signature and activates the plan
          try {
            const verifyRes = await fetch('/api/verify-razorpay-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: planId,
                userId: user.id,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment verification failed.');

            // Step 4 — only navigate to success after server confirms
            window.location.href = `/payment-success?plan=${planId}&razorpay_payment_id=${response.razorpay_payment_id}`;
          } catch (err) {
            alert(`Payment succeeded but activation failed: ${err.message}\n\nPlease contact support with payment ID: ${response.razorpay_payment_id}`);
          }
        },
        modal: {
          ondismiss: function () {
            // User closed the Razorpay modal without paying — no action
            // needed, they simply stay on the Pricing page.
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.message || 'Could not start payment. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <DashboardNavbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 16px 80px' }}>

        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#1E40AF', fontFamily: 'var(--font-body)',
            fontSize: 14, fontWeight: 500, padding: '8px 0',
            marginBottom: 16, minHeight: 44,
          }}
        >
          ← Back to Dashboard
        </button>

        {isPaid && (
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '16px 20px', marginBottom: 24 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#065F46', fontWeight: 500 }}>
              ✅ You are currently on the {currentPlanName} Plan
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#065F46', marginTop: 2 }}>
              Your plan is active. You can upgrade anytime.
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 className="font-heading" style={{ fontSize: 'clamp(26px,5vw,36px)', fontWeight: 700, color: '#0A1628', marginBottom: 10 }}>
            Choose Your Plan
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#4B5563', margin: 0 }}>
            Start free. Upgrade when you're ready.
          </p>
        </div>

        {/* Billing toggle + Currency toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 48, flexWrap: 'wrap' }}>
          <div style={{ display: 'inline-flex', border: '1px solid rgba(30,64,175,0.15)', borderRadius: 99, padding: 4, background: 'rgba(255,255,255,0.6)' }}>
            {[{ label: 'Monthly', value: false }, { label: 'Annual · Best Value', value: true }].map(opt => (
              <button
                key={String(opt.value)}
                onClick={() => setIsAnnual(opt.value)}
                style={{
                  padding: '8px 20px', borderRadius: 99, border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
                  background: isAnnual === opt.value ? '#0A1628' : 'transparent',
                  color: isAnnual === opt.value ? 'white' : '#4B5563',
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}
              >{opt.label}</button>
            ))}
          </div>
          {/* Currency toggle */}
          <div style={{ display: 'inline-flex', border: '1px solid rgba(30,64,175,0.15)', borderRadius: 99, padding: 4, background: 'rgba(255,255,255,0.6)' }}>
            {[{ label: '🇮🇳 INR ₹', value: false }, { label: '🌍 USD $', value: true }].map(opt => (
              <button
                key={String(opt.value)}
                onClick={() => setShowUSD(opt.value)}
                style={{
                  padding: '8px 18px', borderRadius: 99, border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                  background: showUSD === opt.value ? '#1E40AF' : 'transparent',
                  color: showUSD === opt.value ? 'white' : '#4B5563',
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}
              >{opt.label}</button>
            ))}
          </div>
        </div>

        {/* International early adopter banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #1E40AF 100%)',
          borderRadius: 14, padding: '14px 20px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 24 }}>🌍</span>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: '#FFFFFF', marginBottom: 2 }}>
              Launch Offer — First 100 International Subscribers Per Country
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#93C5FD', lineHeight: 1.5 }}>
              Lock in today's price forever. Early adopters get exclusive bonuses &amp; special practice content coming soon.
              International cards accepted · Billed in INR · Your bank converts automatically.
            </div>
          </div>
          <div style={{
            background: '#FBBF24', color: '#0A1628', borderRadius: 99,
            padding: '4px 14px', fontSize: 11, fontWeight: 700,
            fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
          }}>
            🔒 Early Adopter Price
          </div>
        </div>

        {/* Plan cards */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'stretch', justifyContent: 'center', flexWrap: 'wrap' }}>
          {PLANS.map(p => (
            <PlanCard
              key={p.id}
              plan={p}
              isAnnual={isAnnual}
              showUSD={showUSD}
              onPay={() => initiatePayment(p)}
              isCurrent={isCurrentPlan(p.name)}
              isFree={p.id === 'free'}
              disablePurchase={inTWA}
            />
          ))}
        </div>

        <FoundingSection
          onJoin={() => initiatePayment({ id: 'basic_founding', name: 'Founding 500' })}
          currentUser={user}
        />
        <LifetimeBanner showUSD={showUSD} onBuy={() => initiatePayment({ id: 'basic_lifetime', name: 'Basic Lifetime', highlight: false })} />
        {/* Value comparison footer */}
        <div style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 16, padding: '24px 28px', marginTop: 40, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#0A1628', fontWeight: 500, marginBottom: 6 }}>
            Cancel anytime. No hidden charges.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', margin: 0 }}>
            Offline Vedic Maths courses charge ₹30,000–₹40,000. VedicMind gives you more, for less.
          </p>
        </div>

        {/* Trust signals */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '16px 32px', marginTop: 32 }}>
          {[
            { icon: '🔒', text: 'Secure Payment via Razorpay' },
            { icon: '↩️', text: 'Cancel anytime' },
            { icon: '🇮🇳', text: 'Made in India' },
          ].map(item => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563' }}>{item.text}</span>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}