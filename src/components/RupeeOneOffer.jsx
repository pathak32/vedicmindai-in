import React, { useState, useEffect } from 'react';
import { useVedicAuth } from '@/lib/VedicAuthContext';

export default function RupeeOneOffer({ quizStreak = 0 }) {
  const { user } = useVedicAuth();
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  const RAZORPAY_KEY = 'rzp_live_qPmcpAFZ0WxauJ';
  const eligible = quizStreak >= 7;

  useEffect(() => {
    const d = localStorage.getItem('vm_1rupee_dismissed');
    if (d) setDismissed(true);
  }, []);

  if (!eligible || dismissed) return null;

  function handleClaim() {
    setLoading(true);
    const options = {
      key: RAZORPAY_KEY,
      amount: 100, // ₹1 in paise
      currency: 'INR',
      name: 'VedicMindAI',
      description: 'Pro Plan — 1 Month (Star Student Offer)',
      image: 'https://vedicmindai.in/logo.png',
      prefill: { email: user?.email || '', name: user?.user_metadata?.name || '' },
      theme: { color: '#1E40AF' },
      handler: function(response) {
        localStorage.setItem('vm_1rupee_dismissed', '1');
        setDismissed(true);
        alert('🎉 Payment successful! Your Pro access is being activated. Payment ID: ' + response.razorpay_payment_id);
      },
      modal: { ondismiss: () => setLoading(false) }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #7C3AED, #4338CA)', borderRadius: 16, padding: 20, color: 'white', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
      {/* Badge */}
      <div style={{ position: 'absolute', top: 12, right: 12, background: '#F59E0B', color: '#78350F', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
        ⭐ STAR STUDENT OFFER
      </div>

      <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px' }}>You've unlocked Pro at ₹1!</h3>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: '0 0 16px' }}>
        7 days of 80%+ daily quiz scores — you're a Vedic Math star!<br/>
        Get 1 month of Pro access for just ₹1.
      </p>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleClaim} disabled={loading} style={{ flex: 1, background: '#F59E0B', border: 'none', borderRadius: 10, padding: '12px', color: '#78350F', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
          {loading ? 'Opening...' : '🎁 Claim for ₹1'}
        </button>
        <button onClick={() => { localStorage.setItem('vm_1rupee_dismissed', '1'); setDismissed(true); }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 10, padding: '12px 14px', color: 'white', cursor: 'pointer', fontSize: 13 }}>
          Later
        </button>
      </div>
    </div>
  );
}
