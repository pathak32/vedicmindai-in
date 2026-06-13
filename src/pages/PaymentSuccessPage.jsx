import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const PLAN_FEATURES = {
  basic: ['All 40 lessons', 'Daily Quiz', 'AI Tutor'],
  basic_annual: ['All 40 lessons', 'Daily Quiz', 'AI Tutor'],
  pro: ['Everything in Basic', 'Aptitude Module', 'All Leaderboards'],
  pro_annual: ['Everything in Basic', 'Aptitude Module', 'All Leaderboards'],
  family: ['Pro for 3 members', 'Parent Dashboard', 'Individual Progress Tracking'],
  family_annual: ['Pro for 3 members', 'Parent Dashboard', 'Individual Progress Tracking'],
};

const PLAN_DISPLAY = {
  basic: 'Basic',
  basic_annual: 'Basic (Annual)',
  pro: 'Pro',
  pro_annual: 'Pro (Annual)',
  family: 'Family',
  family_annual: 'Family (Annual)',
};

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const autoRedirected = useRef(false);

  // Determine plan from URL params or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const paymentId = urlParams.get('payment_id') || urlParams.get('razorpay_payment_id');
  const urlPlan = urlParams.get('plan');

  const plan = JSON.parse(localStorage.getItem('vedicmind_plan') || '{}');
  const planStatus = urlPlan || plan.planStatus || 'basic';
  const planName = PLAN_DISPLAY[planStatus] || planStatus;
  const features = PLAN_FEATURES[planStatus] || PLAN_FEATURES['basic'];

  // On mount: activate plan and set up auto-redirect
  useEffect(() => {
    const basePlan = planStatus.replace('_annual', '');

    // Update vedicmind_plan with payment info
    try {
      const updatedPlan = {
        ...plan,
        planStatus: planStatus,
        trialEndDate: null,
        razorpayPaymentId: paymentId || plan.razorpayPaymentId || null,
      };
      localStorage.setItem('vedicmind_plan', JSON.stringify(updatedPlan));
    } catch {}

    // Update vedicmind_progress for feature gates
    try {
      const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
      progress.plan = basePlan;
      localStorage.setItem('vedicmind_progress', JSON.stringify(progress));
    } catch {}

    // Update vedicmind_profile for trial banner hiding
    try {
      const profile = JSON.parse(localStorage.getItem('vedicmind_profile') || '{}');
      profile.subscriptionStatus = 'active';
      profile.planType = basePlan;
      localStorage.setItem('vedicmind_profile', JSON.stringify(profile));
    } catch {}

    // Auto-redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      if (!autoRedirected.current) {
        autoRedirected.current = true;
        navigate('/dashboard');
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <style>{`
        @keyframes popIn {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1);   opacity: 1; }
        }
      `}</style>

      <div style={{
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(30,64,175,0.15)',
        boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
        borderRadius: 20,
        padding: '40px 32px',
        maxWidth: 480,
        width: '100%',
        textAlign: 'center',
      }}>
        {/* Animated checkmark */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: '#10B981',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40, color: 'white',
          margin: '0 auto',
          animation: 'popIn 0.6s ease-out forwards',
        }}>
          ✓
        </div>

        <h1 className="font-heading" style={{ fontSize: 28, fontWeight: 700, color: '#0A1628', marginTop: 20, marginBottom: 0 }}>
          Payment Successful! 🎉
        </h1>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#4B5563', marginTop: 8 }}>
          You are now on the <strong>{planName}</strong> Plan
        </p>

        {/* What's unlocked */}
        <div style={{ marginTop: 16, textAlign: 'left' }}>
          {features.map((f, i) => (
            <div key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#10B981', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>✅</span> {f}
            </div>
          ))}
        </div>

        {/* Payment ID */}
        {plan.razorpayPaymentId && (
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 11, color: '#9CA3AF',
            marginTop: 12, wordBreak: 'break-all',
          }}>
            Payment ID: {plan.razorpayPaymentId}
          </p>
        )}

        {/* CTA */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            width: '100%', height: 48, border: 'none',
            borderRadius: 12, background: '#0A1628',
            color: 'white', fontFamily: 'var(--font-body)',
            fontSize: 15, fontWeight: 600,
            cursor: 'pointer', marginTop: 24,
          }}
        >
          Start Learning Now →
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          style={{
            width: '100%', height: 44, border: '1.5px solid rgba(30,64,175,0.2)',
            borderRadius: 12, background: 'transparent',
            color: '#0A1628', fontFamily: 'var(--font-body)',
            fontSize: 14, fontWeight: 500,
            cursor: 'pointer', marginTop: 10,
          }}
        >
          ← Return to VedicMind
        </button>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563', marginTop: 12 }}>
          A confirmation has been sent to your email
        </p>
      </div>
    </div>
  );
}
