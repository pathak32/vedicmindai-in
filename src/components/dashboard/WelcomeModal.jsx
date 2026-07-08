import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'vedicmind_welcome_seen';

// Returns true if this user has already dismissed the welcome modal
export function hasSeenWelcome() {
  try { return !!localStorage.getItem(STORAGE_KEY); } catch { return true; }
}

export function markWelcomeSeen() {
  try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
}

const STEPS_FREE = [
  {
    emoji: '📖',
    title: 'Start with Lesson 1',
    desc: 'Learn the first Vedic Maths sutra — Ekadhikena Purvena. Watch the concept, then practise.',
    action: 'Go to Lessons',
    path: '/learn',
  },
  {
    emoji: '🏆',
    title: 'Climb the Leaderboard',
    desc: 'Earn XP by completing lessons and quizzes — including the Daily Quiz waiting for you on your dashboard. See how you rank against students across India.',
    action: 'See Leaderboard',
    path: '/leaderboard',
  },
];

const STEPS_PAID = [
  {
    emoji: '📖',
    title: 'All 40 Lessons Unlocked',
    desc: 'Go at your own pace. Start from Lesson 1 or jump to any sutra. Each lesson has concept + practice.',
    action: 'Start Learning',
    path: '/learn',
  },
  {
    emoji: '🤖',
    title: 'Your AI Tutor is Ready',
    desc: 'Stuck on a concept? Ask the AI Tutor anything about Vedic Maths. Available 24/7, personalised to you.',
    action: 'Try AI Tutor',
    path: '/ai-tutor',
  },
  {
    emoji: '📊',
    title: 'Weekly Exam',
    desc: 'Test yourself across everything you\'ve learnt so far. Your Daily Quiz is already live on the dashboard — the Weekly Exam goes deeper.',
    action: 'Take Weekly Exam',
    path: '/weekly-exam',
  },
];

export default function WelcomeModal({ profile, progress, onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const isPaid = ['basic','pro','family','basic_annual','pro_annual','family_annual'].includes(progress?.plan);
  const steps = isPaid ? STEPS_PAID : STEPS_FREE;
  const firstName = (profile?.full_name || profile?.name || 'there').split(' ')[0];
  const current = steps[step];
  const isLast = step === steps.length - 1;

  function handleAction() {
    markWelcomeSeen();
    onClose();
    navigate(current.path);
  }

  function handleNext() {
    if (isLast) {
      markWelcomeSeen();
      onClose();
    } else {
      setStep(s => s + 1);
    }
  }

  function handleSkip() {
    markWelcomeSeen();
    onClose();
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(10,22,40,0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: 20,
        padding: '32px 28px',
        maxWidth: 440,
        width: '100%',
        boxShadow: '0 24px 60px rgba(10,22,40,0.18)',
        position: 'relative',
      }}>
        {/* Skip */}
        <button onClick={handleSkip} style={{
          position: 'absolute', top: 16, right: 16,
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, color: '#9CA3AF', fontFamily: 'var(--font-body)',
        }}>
          Skip →
        </button>

        {/* Step dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, justifyContent: 'center' }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 8, height: 8, borderRadius: 99,
              background: i === step ? '#0A1628' : '#E5E7EB',
              transition: 'all 0.2s',
            }} />
          ))}
        </div>

        {/* Welcome heading — only on step 0 */}
        {step === 0 && (
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🙏</div>
            <h2 className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#0A1628', margin: 0 }}>
              Welcome, {firstName}!
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#6B7280', marginTop: 6, marginBottom: 0 }}>
              {isPaid
                ? 'Your subscription is active. Here\'s how to get the most out of VedicMindAI.'
                : 'You\'re on a 7-day free trial. Here\'s how to get started.'}
            </p>
          </div>
        )}

        {/* Step card */}
        <div style={{
          background: '#F0F4FF',
          borderRadius: 14,
          padding: '20px 18px',
          marginBottom: 20,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>{current.emoji}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>
            {current.title}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.6 }}>
            {current.desc}
          </div>
        </div>

        {/* Buttons */}
        <button onClick={handleAction} style={{
          width: '100%', height: 46, background: '#0A1628',
          color: 'white', border: 'none', borderRadius: 12,
          fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700,
          cursor: 'pointer', marginBottom: 10,
        }}>
          {current.action} →
        </button>

        <button onClick={handleNext} style={{
          width: '100%', height: 40, background: 'transparent',
          color: '#6B7280', border: '1.5px solid #E5E7EB', borderRadius: 12,
          fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
          cursor: 'pointer',
        }}>
          {isLast ? 'Go to Dashboard' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
