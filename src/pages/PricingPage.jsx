import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

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
      { text: 'All 40 lessons', included: false },
      { text: 'AI Tutor', included: false },
      { text: 'Weekly Exam', included: false },
      { text: 'Battle Mode participation', included: false },
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    badge: '80% off launch price',
    badgeBg: '#ECFDF5',
    badgeColor: '#065F46',
    monthlyPrice: '₹299',
    monthlyStrike: '₹1,500',
    annualPrice: '₹2,990',
    annualStrike: '₹18,000',
    annualSub: '= ₹249/month · 2 months FREE',
    discount: '80% off',
    monthlyPaise: 29900,
    annualPaise: 299000,
    highlight: false,
    btnLabel: 'Start Basic',
    btnBg: '#0A1628',
    subtext: null,
    features: [
      { text: 'All 40 lessons', included: true },
      { text: 'Daily Quiz every day', included: true },
      { text: 'AI Tutor (20 msgs/day)', included: true },
      { text: 'Class Leaderboard', included: true },
      { text: 'Battle Mode', included: true },
      { text: 'Olympiad (₹19/entry)', included: true },
      { text: 'Aptitude Module (Pro only)', included: false },
      { text: 'Hindi/Multilingual (Pro only)', included: false },
      { text: 'Global Leaderboard (Pro only)', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: '80% off launch price',
    badgeBg: '#ECFDF5',
    badgeColor: '#065F46',
    monthlyPrice: '₹599',
    monthlyStrike: '₹3,000',
    annualPrice: '₹5,990',
    annualStrike: '₹36,000',
    annualSub: '= ₹499/month · 2 months FREE',
    discount: '80% off',
    monthlyPaise: 59900,
    annualPaise: 599000,
    highlight: true,
    btnLabel: 'Start Pro',
    btnBg: '#3B82F6',
    subtext: null,
    features: [
      { text: 'Everything in Basic', included: true },
      { text: 'Unlimited AI Tutor', included: true },
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
    badge: '82% off launch price',
    badgeBg: '#ECFDF5',
    badgeColor: '#065F46',
    monthlyPrice: '₹899',
    monthlyStrike: '₹5,000',
    annualPrice: '₹8,990',
    annualStrike: '₹60,000',
    annualSub: '= ₹749/month · 2 months FREE',
    discount: '82% off',
    monthlyPaise: 89900,
    annualPaise: 899000,
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

function PlanCard({ plan, isAnnual, onPay, isCurrent, isFree }) {
  return (
    <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 320 }}>
      {plan.highlight && !isCurrent && (
        <div style={{
          position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
          background: '#3B82F6', color: 'white', borderRadius: 99, padding: '4px 14px',
          fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', zIndex: 2,
        }}>Most Popular</div>
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
        {isAnnual ? (
          <div style={{ marginBottom: 4 }}>
            {plan.annualStrike && (
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#9CA3AF', textDecoration: 'line-through' }}>{plan.annualStrike}/year</div>
            )}
            <span className="font-heading" style={{ fontSize: 32, fontWeight: 700, color: '#0A1628' }}>{plan.annualPrice}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}>/year</span>
            {plan.annualSub && (
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#10B981', fontWeight: 600, marginTop: 4 }}>{plan.annualSub}</div>
            )}
          </div>
        ) : (
          <div style={{ marginBottom: 4 }}>
            {plan.monthlyStrike && (
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#9CA3AF', textDecoration: 'line-through' }}>{plan.monthlyStrike}/month</div>
            )}
            <span className="font-heading" style={{ fontSize: 40, fontWeight: 700, color: '#0A1628' }}>{plan.monthlyPrice}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}>/month</span>
          </div>
        )}

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
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();

  const plan = JSON.parse(localStorage.getItem('vedicmind_plan') || '{}');
  const isPaid = ['basic', 'pro', 'family', 'basic_annual', 'pro_annual', 'family_annual'].includes(plan.planStatus);
  const currentPlanName = PLAN_DISPLAY_NAMES[plan.planStatus] || '';

  function isCurrentPlan(planName) {
    if (!isPaid) return false;
    return plan.planStatus === planName.toLowerCase() || plan.planStatus === planName.toLowerCase() + '_annual';
  }

  function initiatePayment() {
    window.open('https://rzp.io/rzp/vRD8R2lw', '_blank');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <DashboardNavbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 16px 80px' }}>

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

        {/* Billing toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
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
        </div>

        {/* Plan cards */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'stretch', justifyContent: 'center', flexWrap: 'wrap' }}>
          {PLANS.map(p => (
            <PlanCard
              key={p.id}
              plan={p}
              isAnnual={isAnnual}
              onPay={initiatePayment}
              isCurrent={isCurrentPlan(p.name)}
              isFree={p.id === 'free'}
            />
          ))}
        </div>

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
