import React, { useState } from 'react';

const GOALS = [
  { value: 'Faster Mental Calculation',    emoji: '⚡', sub: 'Calculate in seconds without a calculator' },
  { value: 'Better Exam Scores',           emoji: '🏆', sub: 'JEE, CAT, boards — ace the math section' },
  { value: 'Understand Number Patterns',   emoji: '🔢', sub: 'See the elegance behind every number' },
  { value: 'Help My Child / Student',      emoji: '👨‍👩‍👧', sub: 'Teach Vedic Maths to others' },
  { value: 'Professional Edge',            emoji: '💼', sub: 'Impress in meetings, faster analysis' },
  { value: 'Pure Intellectual Interest',   emoji: '🧠', sub: 'Math as a beautiful mental discipline' },
];

const CHALLENGES = ['Multiplication', 'Large Numbers', 'Division', 'Fractions & Decimals', 'Algebra', 'Geometry'];

const cardBase = {
  background: 'rgba(255,255,255,0.06)',
  border: '1.5px solid rgba(255,255,255,0.15)',
  borderRadius: 14,
  padding: 16,
  cursor: 'pointer',
  minHeight: 80,
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  textAlign: 'left',
  transition: 'all 0.2s',
  width: '100%',
};

export default function Step4Goals({ data, onUpdate, onSubmit, onBack }) {
  const goals = data.goals || [];
  const challenge = data.biggestChallenge || '';
  const maxReached = goals.length >= 3;

  const toggleGoal = (val) => {
    if (goals.includes(val)) {
      onUpdate({ goals: goals.filter(g => g !== val) });
    } else if (!maxReached) {
      onUpdate({ goals: [...goals, val] });
    }
  };

  const canSubmit = goals.length >= 1 && !!challenge;

  return (
    <div>
      <h2 className="font-heading mb-1" style={{ fontSize: 26, fontWeight: 700, color: 'white' }}>
        What do you want to achieve?
      </h2>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>
        Select up to 3 goals. We'll build your plan around them.
      </p>

      {/* Goal Cards */}
      <div className="goal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 28 }}>
        {GOALS.map(g => {
          const selected = goals.includes(g.value);
          const disabled = !selected && maxReached;
          return (
            <button
              key={g.value}
              onClick={() => toggleGoal(g.value)}
              disabled={disabled}
              style={{
                ...cardBase,
                ...(selected ? {
                  background: 'rgba(59,130,246,0.2)',
                  border: '2px solid #3B82F6',
                  boxShadow: '0 0 0 3px rgba(59,130,246,0.15)',
                } : {}),
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            >
              <span style={{ fontSize: 26, flexShrink: 0 }}>{g.emoji}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'white', fontFamily: 'var(--font-body)', lineHeight: 1.3 }}>{g.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 3 }}>{g.sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Challenge Pills */}
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 12, marginTop: 28 }}>
        Your biggest math challenge right now:
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        {CHALLENGES.map(ch => {
          const sel = challenge === ch;
          return (
            <button
              key={ch}
              onClick={() => onUpdate({ biggestChallenge: ch })}
              style={{
                background: sel ? '#F59E0B' : 'rgba(255,255,255,0.06)',
                border: `1.5px solid ${sel ? '#F59E0B' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: 100,
                padding: '10px 20px',
                minHeight: 44,
                color: sel ? '#0A1628' : 'white',
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.18s',
                fontFamily: 'var(--font-body)',
                fontWeight: sel ? 600 : 400,
              }}
            >
              {ch}
            </button>
          );
        })}
      </div>

      {/* Submit */}
      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        style={{
          marginTop: 32,
          width: '100%',
          minHeight: 52,
          background: canSubmit ? 'linear-gradient(135deg, #3B82F6, #1E40AF)' : 'rgba(59,130,246,0.3)',
          border: 'none',
          borderRadius: 14,
          color: 'white',
          fontSize: 17,
          fontWeight: 700,
          cursor: canSubmit ? 'pointer' : 'not-allowed',
          opacity: canSubmit ? 1 : 0.4,
          boxShadow: canSubmit ? '0 4px 20px rgba(59,130,246,0.4)' : 'none',
          transition: 'all 0.2s',
          fontFamily: 'var(--font-body)',
        }}
      >
        ✨ Analyze My Profile →
      </button>

      {/* Back */}
      <button
        onClick={onBack}
        style={{
          marginTop: 12,
          width: '100%',
          minHeight: 44,
          background: 'transparent',
          border: '1.5px solid rgba(255,255,255,0.3)',
          borderRadius: 12,
          color: 'white',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
        }}
      >
        ← Back
      </button>

      <style>{`
        @media (max-width: 480px) {
          .goal-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}