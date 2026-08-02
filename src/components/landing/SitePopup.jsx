import React, { useState, useEffect } from 'react';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { isRunningInTWA } from '@/lib/isTWA';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=in.vedicmindai.app';
const STORAGE_KEY = 'vedicmind_site_popup_dismissed';
const RATING_KEY  = 'vedicmind_site_rating_dismissed';
const DELAY_MS    = 10000; // 10 seconds

// Website popup — shown to public visitors after 10 seconds.
// Two variants:
//   - Logged-out visitor → "Get the app free on Google Play"
//   - Logged-in user who hasn't been asked to rate → "Rate us on Play Store"
// Rules:
//   - Never shown inside the Android TWA (they already have the app)
//   - Never shown again once dismissed (localStorage, per variant)
//   - Logged-out dismiss stored for 7 days; logged-in dismiss is permanent

export default function SitePopup() {
  const { user } = useVedicAuth();
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState(null); // 'download' | 'rate'

  useEffect(() => {
    // Never show inside the installed Android app
    if (isRunningInTWA()) return;

    const v = pickVariant(!!user);
    if (!v) return;

    setVariant(v);
    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, [user]);

  function pickVariant(isLoggedIn) {
    if (isLoggedIn) {
      // Only show rating ask once ever
      if (localStorage.getItem(RATING_KEY)) return null;
      return 'rate';
    } else {
      // Show download ask, but not again for 7 days after dismiss
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 3600 * 1000) return null;
      return 'download';
    }
  }

  function dismiss() {
    setVisible(false);
    if (variant === 'download') localStorage.setItem(STORAGE_KEY, Date.now().toString());
    if (variant === 'rate')     localStorage.setItem(RATING_KEY, '1');
  }

  function handleCTA() {
    window.open(PLAY_STORE_URL, '_blank', 'noopener noreferrer');
    dismiss();
  }

  if (!visible || !variant) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          zIndex: 9998, backdropFilter: 'blur(2px)',
        }}
      />

      {/* Card */}
      <div style={{
        position: 'fixed', bottom: 24, left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(420px, calc(100vw - 32px))',
        background: 'white', borderRadius: 20,
        boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
        zIndex: 9999, overflow: 'hidden',
        animation: 'slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <style>{`@keyframes slideUp{from{transform:translateX(-50%) translateY(40px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}`}</style>

        {/* Top gradient bar */}
        <div style={{ height: 4, background: 'linear-gradient(90deg, #6366F1, #3B82F6, #06B6D4)' }} />

        <div style={{ padding: '22px 22px 18px' }}>
          {/* Close */}
          <button
            onClick={dismiss}
            style={{
              position: 'absolute', top: 12, right: 14,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#9CA3AF', fontSize: 20, lineHeight: 1, padding: 4,
            }}
          >✕</button>

          {variant === 'download' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <img src="/icons/icon-192.png" alt="VedicMindAI" style={{ width: 52, height: 52, borderRadius: 12, flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: '#0A1628', lineHeight: 1.2 }}>
                    Take VedicMindAI with you
                  </div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3 }}>
                    Free on Google Play · No sign-up needed to explore
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 18 }}>
                {['40 Vedic Maths lessons, 4 levels', 'Daily Quiz + Battle Mode', 'AI Personal Tutor'].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#374151' }}>
                    <span style={{ color: '#10B981', flexShrink: 0 }}>✓</span>{f}
                  </div>
                ))}
              </div>

              <button onClick={handleCTA} style={{
                width: '100%', height: 46, background: '#0A1628', color: 'white',
                border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 10, fontFamily: 'var(--font-body)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M3.18 23.82a1.5 1.5 0 0 0 2.07.56l11.04-6.38-2.9-2.9-10.21 8.72zm17.04-12.74L17.5 9.36 14.6 12.25l2.9 2.9 2.72-1.57a1.5 1.5 0 0 0 0-2.6zM2.5.56A1.5 1.5 0 0 0 .5 2v20a1.5 1.5 0 0 0 2 1.44V.5a1.5 1.5 0 0 0 0-.07zM5.25.62L16.17 7 13.27 9.9 2.87.93 5.25.62z"/></svg>
                Download Free on Google Play
              </button>
              <div onClick={dismiss} style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: '#9CA3AF', cursor: 'pointer' }}>
                Not now
              </div>
            </>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>⭐⭐⭐⭐⭐</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: '#0A1628', marginBottom: 6 }}>
                  Enjoying VedicMindAI?
                </div>
                <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.55 }}>
                  A quick rating on Google Play helps more students discover Vedic Mathematics.
                  It takes just 30 seconds. 🙏
                </div>
              </div>

              <button onClick={handleCTA} style={{
                width: '100%', height: 46, background: '#FBBF24', color: '#0A1628',
                border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}>
                ⭐ Rate on Google Play
              </button>
              <div onClick={dismiss} style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: '#9CA3AF', cursor: 'pointer' }}>
                Maybe later
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
