import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrialStatus, getDaysRemaining, getTrialEndDate } from '@/lib/trialEngine';
import { getUserPlan } from '@/lib/planEngine';

const PLAN_LABELS = {
  basic: 'Basic',
  pro: 'Pro',
  family: 'Family',
};

export default function TrialBanner() {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = React.useState(false);
  if (dismissed) return null;

  // Check paid plan first (vedicmind_progress.plan)
  const paidPlan = getUserPlan();
  if (paidPlan && paidPlan !== 'free') {
    const label = PLAN_LABELS[paidPlan] || paidPlan;
    return (
      <div style={{
        background: '#ECFDF5',
        border: '1px solid #A7F3D0',
        borderRadius: 12,
        padding: '10px 16px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
      }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#065F46', fontWeight: 600 }}>
          ✅ {label} Plan Active
        </div>
        <button
          onClick={() => navigate('/pricing')}
          style={{
            background: 'transparent', color: '#065F46',
            border: '1px solid #A7F3D0', borderRadius: 8,
            height: 32, padding: '0 12px',
            fontFamily: 'var(--font-body)', fontSize: 12,
            fontWeight: 500, cursor: 'pointer',
          }}
        >
          Manage Plan
        </button>
      </div>
    );
  }

  // Free plan — show trial/upgrade banner
  const status = getTrialStatus();
  const days = getDaysRemaining();
  const endDate = getTrialEndDate();

  if (status !== 'trial' && status !== 'expired') return null;

  const isUrgent = status === 'expired' || days <= 2;
  const bg = isUrgent ? '#EF4444' : 'linear-gradient(135deg, #0A1628, #0D2252)';

  const formattedEnd = endDate
    ? endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '7 days from signup';

  let heading, subtext, btnLabel;
  if (status === 'expired') {
    heading = '⚠️ Your trial has ended';
    subtext = 'Upgrade to continue learning';
    btnLabel = 'Choose a Plan →';
  } else if (days <= 2) {
    heading = `⚠️ Trial expires in ${days} day${days === 1 ? '' : 's'}!`;
    subtext = `Full access until ${formattedEnd}. Upgrade to keep learning.`;
    btnLabel = 'Upgrade Now';
  } else {
    heading = `🎁 Free Trial — ${days} days remaining`;
    subtext = `Full access to all features until ${formattedEnd}`;
    btnLabel = 'Upgrade Now';
  }

  return (
    <div style={{
      background: bg,
      borderRadius: 12,
      padding: '14px 20px',
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap',
    }}>
      <style>{`
        @media(max-width:480px){
          .trial-banner-inner { flex-direction: column !important; align-items: flex-start !important; }
          .trial-banner-btn { width: 100% !important; text-align: center !important; }
        }
      `}</style>
      <div className="trial-banner-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'white', fontWeight: 500 }}>
            {heading}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
            {subtext}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button
            className="trial-banner-btn"
            onClick={() => navigate('/pricing')}
            style={{
              background: '#3B82F6', color: 'white', border: 'none',
              borderRadius: 8, height: 36, padding: '0 16px',
              fontFamily: 'var(--font-body)', fontSize: 13,
              fontWeight: 500, cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {btnLabel}
          </button>
          <button
            onClick={() => setDismissed(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: 18, lineHeight: 1, padding: '0 4px', flexShrink: 0 }}
            aria-label="Dismiss"
          >✕</button>
        </div>
      </div>
    </div>
  );
}