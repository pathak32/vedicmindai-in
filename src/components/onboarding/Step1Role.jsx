import React from 'react';

const ROLES = [
  { value: 'Student',              emoji: '🎓', title: 'Student',               sub: 'Class 1–12' },
  { value: 'Exam Aspirant',        emoji: '📚', title: 'Exam Aspirant',          sub: 'JEE / CAT / UPSC / SSC / Banking' },
  { value: 'Working Professional', emoji: '💼', title: 'Working Professional',   sub: 'Skill building & mental agility' },
  { value: 'Parent',               emoji: '👨‍👩‍👧', title: 'Parent',                sub: 'Setting up for my child' },
];

export default function Step1Role({ data, userName, onUpdate, onNext }) {
  const { role } = data;

  return (
    <div>
      <h1 className="font-heading mb-2" style={{ fontSize: 30, fontWeight: 700, color: 'white' }}>
        Welcome, {userName}! 👋
      </h1>
      <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 28 }}>
        Let's personalize your Vedic Maths journey. Takes 2 minutes.
      </p>

      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>I am a...</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }} className="role-grid">
        {ROLES.map((r) => {
          const selected = role === r.value;
          return (
            <button
              key={r.value}
              onClick={() => onUpdate({ role: r.value })}
              style={{
                background: selected ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.06)',
                border: selected ? '2px solid #3B82F6' : '1.5px solid rgba(255,255,255,0.15)',
                boxShadow: selected ? '0 0 0 3px rgba(59,130,246,0.15)' : 'none',
                borderRadius: 14,
                padding: 16,
                cursor: 'pointer',
                minHeight: 80,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 28, flexShrink: 0 }}>{r.emoji}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16, color: 'white', fontFamily: 'var(--font-body)' }}>{r.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{r.sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!role}
        style={{
          marginTop: 28,
          width: '100%',
          minHeight: 44,
          background: '#3B82F6',
          color: 'white',
          border: 'none',
          borderRadius: 12,
          fontSize: 16,
          fontWeight: 600,
          cursor: role ? 'pointer' : 'not-allowed',
          opacity: role ? 1 : 0.4,
          transition: 'opacity 0.2s',
          fontFamily: 'var(--font-body)',
        }}
      >
        Next →
      </button>

      <style>{`
        @media (max-width: 480px) {
          .role-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}