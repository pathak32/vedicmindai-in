import React, { useState, useEffect } from 'react';
import { isRunningInTWA } from '@/lib/isTWA';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=in.vedicmindai.app';
const DONE_KEY       = 'vedicmind_rated_app';
const SKIPPED_KEY    = 'vedicmind_rate_skipped_at';
const SKIP_DELAY_MS  = 7 * 24 * 3600 * 1000; // 7 days after skipping

// In-app rating prompt — shown only inside the Android TWA (installed app).
// Triggers once a user has shown real engagement:
//   - At least 2 lessons completed AND at least 3 daily quizzes taken
// Rules:
//   - "Done / Already rated" → never shown again (permanent)
//   - "Maybe later" → shown again after 7 days
//   - Never shown to users who haven't shown meaningful engagement

export default function InAppRatingPrompt({ lessonsCompleted = 0, quizzesTaken = 0 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show inside the installed Android app
    if (!isRunningInTWA()) return;

    // Already rated
    if (localStorage.getItem(DONE_KEY)) return;

    // Skipped recently — wait 7 days
    const skippedAt = localStorage.getItem(SKIPPED_KEY);
    if (skippedAt && Date.now() - parseInt(skippedAt) < SKIP_DELAY_MS) return;

    // Engagement threshold: 2+ lessons completed AND 3+ quizzes
    if (lessonsCompleted < 2 || quizzesTaken < 3) return;

    // Show with a short delay so it doesn't pop the moment the
    // dashboard loads — feels less intrusive after a beat
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, [lessonsCompleted, quizzesTaken]);

  function handleRate() {
    window.open(PLAY_STORE_URL, '_blank', 'noopener noreferrer');
    localStorage.setItem(DONE_KEY, '1');
    setVisible(false);
  }

  function handleAlreadyRated() {
    localStorage.setItem(DONE_KEY, '1');
    setVisible(false);
  }

  function handleSkip() {
    localStorage.setItem(SKIPPED_KEY, Date.now().toString());
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleSkip}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 9998, backdropFilter: 'blur(3px)',
        }}
      />

      {/* Card */}
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        background: '#0F172A',
        borderRadius: '20px 20px 0 0',
        border: '1px solid rgba(255,255,255,0.12)',
        borderBottom: 'none',
        zIndex: 9999,
        padding: '8px 0 0',
        animation: 'slideUpSheet 0.35s cubic-bezier(0.34,1.2,0.64,1)',
      }}>
        <style>{`@keyframes slideUpSheet{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>

        {/* Drag handle */}
        <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, margin: '0 auto 20px' }} />

        <div style={{ padding: '0 24px 32px' }}>
          {/* Stars */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 44, letterSpacing: 4, marginBottom: 12 }}>⭐⭐⭐⭐⭐</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: '#F5F3FF', marginBottom: 8 }}>
              How are you finding VedicMindAI?
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.55 }}>
              You've completed {lessonsCompleted} lesson{lessonsCompleted !== 1 ? 's' : ''} and taken {quizzesTaken} daily quiz{quizzesTaken !== 1 ? 'zes' : ''}.
              If you're enjoying it, a quick rating on Google Play helps more students discover Vedic Mathematics. 🙏
            </div>
          </div>

          {/* Primary CTA */}
          <button onClick={handleRate} style={{
            width: '100%', height: 50, background: '#FBBF24',
            color: '#0A1628', border: 'none', borderRadius: 14,
            fontSize: 15, fontWeight: 800, cursor: 'pointer',
            fontFamily: 'var(--font-body)', marginBottom: 10,
          }}>
            ⭐ Rate VedicMindAI on Play Store
          </button>

          {/* Secondary CTAs */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleAlreadyRated} style={{
              flex: 1, height: 42,
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 12, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-body)',
            }}>
              Already rated ✓
            </button>
            <button onClick={handleSkip} style={{
              flex: 1, height: 42,
              background: 'transparent',
              color: 'rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-body)',
            }}>
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
