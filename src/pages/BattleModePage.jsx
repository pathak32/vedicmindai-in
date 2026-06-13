import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

export default function BattleModePage() {
  const navigate = useNavigate();
  const auth = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_auth') || '{}'); } catch { return {}; } })();
  const firstName = (auth.name || 'You').split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase();

  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const waitlist = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_battle_waitlist') || '[]'); } catch { return []; } })();

  const handleNotify = () => {
    const cleaned = mobile.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setError('Enter a valid 10-digit number');
      return;
    }
    setError('');
    const list = [...waitlist, { mobile: cleaned, name: auth.name || '', savedAt: new Date().toISOString() }];
    localStorage.setItem('vedicmind_battle_waitlist', JSON.stringify(list));
    setSubmitted(true);
  };

  const currentCount = submitted ? waitlist.length + 1 : waitlist.length;

  const steps = [
    'Challenge a friend via WhatsApp link',
    'Both solve the same Vedic Maths question simultaneously',
    'First correct answer wins the round',
    'Win 5 rounds to become the Battle Champion 🏆',
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A1628 0%, #1a0533 100%)' }}>
      <DashboardNavbar />

      <style>{`
        @keyframes gloveFloat {
          from { transform: translateY(0px); }
          to   { transform: translateY(-8px); }
        }
        @media (max-width: 480px) {
          .battle-heading { font-size: 28px !important; }
          .battle-subheading { font-size: 15px !important; }
          .battle-vs-row { flex-direction: row !important; }
          .battle-notify-row { flex-direction: column !important; }
          .battle-notify-row input,
          .battle-notify-row button { width: 100% !important; }
        }
      `}</style>

      <main style={{ padding: '48px 24px 64px', textAlign: 'center' }}>

        {/* Hero */}
        <div>
          <span style={{ fontSize: 64, display: 'inline-block', animation: 'gloveFloat 1s ease-in-out infinite alternate' }}>
            🥊
          </span>

          <h1 className="font-heading battle-heading" style={{ fontSize: 40, fontWeight: 700, color: 'white', marginTop: 16, marginBottom: 0 }}>
            Live Battle Mode
          </h1>

          <p className="battle-subheading" style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'rgba(255,255,255,0.7)', maxWidth: 480, margin: '12px auto 0', lineHeight: 1.6 }}>
            Challenge your classmates to real-time Vedic Maths battles
          </p>

          <div style={{
            display: 'inline-block', marginTop: 20,
            background: 'rgba(245,158,11,0.2)',
            border: '1px solid rgba(245,158,11,0.5)',
            color: '#F59E0B',
            borderRadius: 99, padding: '8px 20px',
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
          }}>
            ⚡ Coming in Phase 2
          </div>
        </div>

        {/* How it works card */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 20, padding: '28px 24px',
          maxWidth: 480, margin: '32px auto',
          textAlign: 'left',
        }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16, marginTop: 0 }}>
            How it works
          </p>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: i < steps.length - 1 ? 14 : 0 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(245,158,11,0.2)',
                border: '1px solid rgba(245,158,11,0.4)',
                color: '#F59E0B',
                fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {i + 1}
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'white', lineHeight: 1.5, margin: 0 }}>
                {step}
              </p>
            </div>
          ))}
        </div>

        {/* VS Row */}
        <div style={{ maxWidth: 400, margin: '24px auto 0' }}>
          <div className="battle-vs-row" style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center' }}>
            {/* You */}
            <div style={{
              background: 'rgba(59,130,246,0.15)',
              border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: 12, padding: 16, textAlign: 'center', flex: 1,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%', background: '#3B82F6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-body)', fontSize: 20, color: 'white', fontWeight: 700,
                margin: '0 auto',
              }}>
                {initial}
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'white', margin: '8px 0 2px' }}>{firstName}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: 0 }}>You</p>
            </div>

            {/* VS */}
            <span className="font-heading" style={{ fontSize: 28, fontWeight: 700, color: '#F59E0B', flexShrink: 0 }}>VS</span>

            {/* Opponent */}
            <div style={{
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 12, padding: 16, textAlign: 'center', flex: 1,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%', background: '#EF4444',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-body)', fontSize: 20, color: 'white', fontWeight: 700,
                margin: '0 auto',
              }}>
                ?
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'white', margin: '8px 0 2px' }}>???</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: 0 }}>Opponent</p>
            </div>
          </div>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 8 }}>
            Your opponent could be your classmate, friend, or anyone from your class group!
          </p>
        </div>

        {/* Notify Me */}
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'white', fontWeight: 600, margin: '0 0 12px' }}>
            Get notified when it launches
          </h2>

          {submitted ? (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#10B981', textAlign: 'center' }}>
              ✅ You're on the list! We'll WhatsApp you when Battle Mode launches 🥊
            </p>
          ) : (
            <>
              <div className="battle-notify-row" style={{ display: 'flex', gap: 8, maxWidth: 400, margin: '0 auto' }}>
                <input
                  type="tel"
                  placeholder="Your WhatsApp number"
                  value={mobile}
                  onChange={e => { setMobile(e.target.value); setError(''); }}
                  style={{
                    flex: 1, height: 48, borderRadius: 12, padding: '0 16px',
                    background: 'rgba(255,255,255,0.08)',
                    border: `1px solid ${error ? '#EF4444' : 'rgba(255,255,255,0.2)'}`,
                    color: 'white', fontFamily: 'var(--font-body)', fontSize: 16,
                    outline: 'none', minWidth: 0,
                  }}
                  onFocus={e => { e.target.style.borderColor = '#3B82F6'; e.target.style.background = 'rgba(255,255,255,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = error ? '#EF4444' : 'rgba(255,255,255,0.2)'; e.target.style.background = 'rgba(255,255,255,0.08)'; }}
                />
                <button
                  onClick={handleNotify}
                  style={{
                    height: 48, borderRadius: 12, padding: '0 20px',
                    background: '#F59E0B', color: '#0A1628',
                    border: 'none', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                  }}
                >
                  Notify Me 🔔
                </button>
              </div>
              {error && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#EF4444', marginTop: 6, textAlign: 'center' }}>
                  {error}
                </p>
              )}
            </>
          )}

          {currentCount > 0 && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 12 }}>
              🔥 {currentCount} student{currentCount !== 1 ? 's' : ''} already waiting
            </p>
          )}
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'block', margin: '32px auto 0',
            width: 200, height: 44, borderRadius: 12,
            background: 'transparent',
            border: '1.5px solid rgba(255,255,255,0.3)',
            color: 'white', fontFamily: 'var(--font-body)', fontSize: 14,
            fontWeight: 500, cursor: 'pointer',
          }}
        >
          ← Back to Dashboard
        </button>
      </main>
    </div>
  );
}