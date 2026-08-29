import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserPlan } from '@/lib/planEngine';
import { useLanguage } from '@/lib/LanguageContext';

const PLAN_LABELS = {
  basic: 'Basic',
  pro: 'Pro',
  family: 'Family',
};

export default function TrialBanner() {
  const { t } = useLanguage();
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
            fontWeight: 700, cursor: 'pointer',
          }}
        >
          Manage Plan
        </button>
      </div>
    );
  }

    return (
    <div style={{
      background: 'linear-gradient(135deg, #78350F, #92400E)',
      borderRadius: 12,
      padding: '14px 20px',
      marginBottom: 16,
      border: '1px solid rgba(251,191,36,0.4)',
      boxShadow: '0 4px 20px rgba(251,191,36,0.15)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🔥</span>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#FDE68A', fontWeight: 700 }}>
              Founding 500 — First Month Only ₹125
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(253,230,138,0.8)', marginTop: 2 }}>
              Limited seats left · Lock in your price forever
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => navigate('/pricing')}
            style={{
              background: '#F59E0B', color: '#1C1917', border: 'none',
              borderRadius: 8, height: 36, padding: '0 16px',
              fontFamily: 'var(--font-body)', fontSize: 13,
              fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            Claim Your Seat →
          </button>
          <button
            onClick={() => setDismissed(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(253,230,138,0.7)', fontSize: 18, lineHeight: 1, padding: '0 4px' }}
            aria-label="Dismiss"
          >✕</button>
        </div>
      </div>
    </div>
  );
}