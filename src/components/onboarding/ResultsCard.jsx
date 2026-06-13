import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function ResultsCard({ aiAnalysis, onStart }) {
  useEffect(() => {
    // 3 confetti bursts
    const colors = ['#0A1628', '#3B82F6', '#F59E0B', '#10B981', '#FFFFFF'];
    confetti({ origin: { x: 0.2, y: 0.6 }, angle: 60,  spread: 70, particleCount: 80, colors });
    confetti({ origin: { x: 0.8, y: 0.6 }, angle: 120, spread: 70, particleCount: 80, colors });
    confetti({ origin: { x: 0.5, y: 0.5 }, angle: 90,  spread: 100, particleCount: 80, colors });
  }, []);

  const stats = [
    { emoji: '📊', label: 'Starting Level',   value: aiAnalysis.startingLevel },
    { emoji: '⏱️', label: 'Est. Completion',  value: `${aiAnalysis.estimatedWeeks} weeks` },
    { emoji: '📅', label: 'Daily Lessons',    value: `${aiAnalysis.dailyLessons} lessons` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ color: 'white', fontFamily: 'var(--font-body)' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 36 }}>✨</span>
        <h2 className="font-heading" style={{ fontSize: 24, fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
          Your VedicMind Plan is Ready!
        </h2>
      </div>

      {/* Greeting */}
      <div style={{
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 12,
        padding: 16,
        margin: '16px 0',
      }}>
        <p style={{ fontSize: 15, fontStyle: 'italic', color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.6 }}>
          {aiAnalysis.greeting}
        </p>
      </div>

      {/* Stat Badges */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        {stats.map(s => (
          <div
            key={s.label}
            style={{
              flex: '1 1 100px',
              background: 'rgba(59,130,246,0.15)',
              border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: 12,
              padding: '12px 16px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.emoji}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Why Vedic Maths */}
      <div style={{ marginTop: 20 }}>
        <p style={{ fontSize: 13, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
          Why Vedic Maths for you:
        </p>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.65, margin: 0 }}>
          {aiAnalysis.whyVedicMaths}
        </p>
      </div>

      {/* Focus Areas */}
      <div style={{ marginTop: 20 }}>
        <p style={{ fontSize: 13, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
          Your Top Focus Areas:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(aiAnalysis.topFocusAreas || []).slice(0, 3).map((area, i) => (
            <span
              key={i}
              style={{
                background: 'rgba(16,185,129,0.15)',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 100,
                padding: '6px 16px',
                fontSize: 13,
                color: '#10B981',
              }}
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Motivational Quote */}
      <div style={{ marginTop: 20, borderLeft: '3px solid #F59E0B', paddingLeft: 16 }}>
        <p className="font-heading" style={{ fontSize: 16, fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.6 }}>
          "{aiAnalysis.motivationalQuote}"
        </p>
      </div>

      {/* Personalized Tip */}
      <div style={{
        marginTop: 16,
        background: 'rgba(245,158,11,0.1)',
        border: '1px solid rgba(245,158,11,0.2)',
        borderRadius: 12,
        padding: '14px 16px',
      }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.6 }}>
          💡 {aiAnalysis.personalizedTip}
        </p>
      </div>

      {/* Start Button */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 4px 20px rgba(16,185,129,0.35); }
          50%       { box-shadow: 0 4px 32px rgba(16,185,129,0.6); }
        }
      `}</style>
      <button
        onClick={onStart}
        style={{
          marginTop: 28,
          width: '100%',
          minHeight: 52,
          background: 'linear-gradient(135deg, #10B981, #059669)',
          color: 'white',
          border: 'none',
          borderRadius: 14,
          fontSize: 17,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          animation: 'pulse-glow 2s ease-in-out infinite',
        }}
      >
        🚀 Start My Journey →
      </button>
    </motion.div>
  );
}