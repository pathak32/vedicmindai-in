import React, { useState } from 'react';

const TIME_OPTIONS = [
  { value: '10-15 min', emoji: '⏱️', title: '10–15 min', sub: 'Casual learner' },
  { value: '20-30 min', emoji: '⏰', title: '20–30 min', sub: 'Serious learner' },
  { value: '45-60 min', emoji: '🔥', title: '45–60 min', sub: 'Dedicated' },
  { value: '1+ hours',  emoji: '⚡', title: '1+ hours',  sub: 'Intensive' },
];

const STYLE_OPTIONS = [
  { value: 'Visual',         emoji: '👁️', title: 'Visual',         sub: 'Diagrams and patterns' },
  { value: 'Step-by-Step',   emoji: '📖', title: 'Step-by-Step',   sub: 'Detailed explanations' },
  { value: 'Practice-First', emoji: '🎯', title: 'Practice-First', sub: 'Learn by doing' },
];

const LANGUAGES = ['English', 'हिंदी', 'தமிழ்', 'मराठी'];

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

const cardSelected = {
  background: 'rgba(59,130,246,0.2)',
  border: '2px solid #3B82F6',
  boxShadow: '0 0 0 3px rgba(59,130,246,0.15)',
};

const sectionLabel = {
  fontSize: 14,
  color: 'rgba(255,255,255,0.7)',
  marginBottom: 12,
  display: 'block',
  fontFamily: 'var(--font-body)',
};

export default function Step3Preferences({ data, onUpdate, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const { timeCommitment, learningStyle, language } = data;

  const handleNext = () => {
    const e = {};
    if (!timeCommitment) e.time = 'Please select your daily time commitment.';
    if (!learningStyle) e.style = 'Please select your learning style.';
    setErrors(e);
    if (Object.keys(e).length === 0) onNext();
  };

  return (
    <div>
      <h2 className="font-heading mb-1" style={{ fontSize: 26, fontWeight: 700, color: 'white' }}>
        How do you learn best?
      </h2>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 28 }}>
        This helps us tune your lesson pacing and style.
      </p>

      {/* Daily Time */}
      <span style={sectionLabel}>How much time can you give daily?</span>
      <div className="pref-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: errors.time ? 4 : 24 }}>
        {TIME_OPTIONS.map(opt => {
          const sel = timeCommitment === opt.value;
          return (
            <button key={opt.value} onClick={() => onUpdate({ timeCommitment: opt.value })}
              style={{ ...cardBase, ...(sel ? cardSelected : {}) }}>
              <span style={{ fontSize: 26, flexShrink: 0 }}>{opt.emoji}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'white', fontFamily: 'var(--font-body)' }}>{opt.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{opt.sub}</div>
              </div>
            </button>
          );
        })}
      </div>
      {errors.time && <p style={{ color: '#EF4444', fontSize: 12, marginBottom: 16 }}>{errors.time}</p>}

      {/* Learning Style */}
      <span style={{ ...sectionLabel, marginTop: 24 }}>Your learning style:</span>
      <div className="pref-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: errors.style ? 4 : 24 }}>
        {STYLE_OPTIONS.map(opt => {
          const sel = learningStyle === opt.value;
          return (
            <button key={opt.value} onClick={() => onUpdate({ learningStyle: opt.value })}
              style={{ ...cardBase, ...(sel ? cardSelected : {}), flexDirection: 'column', gap: 8, minHeight: 90, alignItems: 'flex-start', padding: '14px 16px' }}>
              <span style={{ fontSize: 24 }}>{opt.emoji}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'white', fontFamily: 'var(--font-body)' }}>{opt.title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{opt.sub}</div>
              </div>
            </button>
          );
        })}
      </div>
      {errors.style && <p style={{ color: '#EF4444', fontSize: 12, marginBottom: 16 }}>{errors.style}</p>}

      {/* Language */}
      <span style={{ ...sectionLabel, marginTop: 24 }}>Preferred language:</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
        {LANGUAGES.map(lang => {
          const sel = (language || 'English') === lang;
          return (
            <button
              key={lang}
              onClick={() => onUpdate({ language: lang })}
              style={{
                background: sel ? '#3B82F6' : 'rgba(255,255,255,0.06)',
                border: `1.5px solid ${sel ? '#3B82F6' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: 100,
                padding: '10px 20px',
                minHeight: 44,
                color: 'white',
                fontSize: 15,
                cursor: 'pointer',
                transition: 'all 0.18s',
                fontFamily: 'var(--font-body)',
              }}
            >
              {lang}
            </button>
          );
        })}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={onBack}
          style={{
            flex: 1,
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
        <button
          onClick={handleNext}
          style={{
            flex: 2,
            minHeight: 44,
            background: '#3B82F6',
            border: 'none',
            borderRadius: 12,
            color: 'white',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
          }}
        >
          Next →
        </button>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .pref-grid-2 { grid-template-columns: 1fr !important; }
          .pref-grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}