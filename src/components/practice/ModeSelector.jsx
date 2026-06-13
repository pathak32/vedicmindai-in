import React from 'react';
import { TOPIC_OPTIONS } from './questionGenerator';

const glass = {
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(30,64,175,0.15)',
  boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
  borderRadius: 20,
};

function StatPill({ children }) {
  return (
    <span style={{ fontSize: 13, color: '#4B5563', fontFamily: 'var(--font-body)' }}>{children}</span>
  );
}

export default function ModeSelector({ selectedTopic, onTopicChange, onStart }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>

      {/* Speed Drill */}
      <div style={{ ...glass, padding: 28, borderLeft: '4px solid #3B82F6' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 16 }}>⚡</div>
        <h2 className="font-heading" style={{ fontSize: 24, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>Speed Drill</h2>
        <p style={{ fontSize: 14, color: '#4B5563', fontFamily: 'var(--font-body)', marginBottom: 16, lineHeight: 1.6 }}>
          2-minute sprint. Answer as many as you can.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          <StatPill>⏱️ 2 minutes</StatPill>
          <StatPill>♾️ Unlimited questions</StatPill>
          <StatPill>⭐ +10 XP each</StatPill>
        </div>
        <button
          onClick={() => onStart('speed')}
          style={{
            width: '100%', minHeight: 48, background: '#0A1628', color: 'white',
            border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}
        >
          Start Speed Drill →
        </button>
      </div>

      {/* Topic Practice */}
      <div style={{ ...glass, padding: 28, borderLeft: '4px solid #10B981' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 16 }}>📚</div>
        <h2 className="font-heading" style={{ fontSize: 24, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>Topic Practice</h2>
        <p style={{ fontSize: 14, color: '#4B5563', fontFamily: 'var(--font-body)', marginBottom: 16, lineHeight: 1.6 }}>
          10 focused questions on a sutra of your choice.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
          <StatPill>📝 10 questions</StatPill>
          <StatPill>🎯 Choose your topic</StatPill>
          <StatPill>⭐ +10 XP each</StatPill>
        </div>
        <select
          value={selectedTopic}
          onChange={e => onTopicChange(e.target.value)}
          style={{
            width: '100%', background: 'white', border: '1.5px solid rgba(30,64,175,0.15)',
            borderRadius: 10, padding: '10px 14px', minHeight: 44, fontSize: 16,
            fontFamily: 'var(--font-body)', color: '#0A1628', marginBottom: 16, outline: 'none',
          }}
        >
          {TOPIC_OPTIONS.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <button
          onClick={() => onStart('topic')}
          style={{
            width: '100%', minHeight: 48, background: '#10B981', color: 'white',
            border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}
        >
          Start Topic Practice →
        </button>
      </div>

      {/* Challenge Mode */}
      <div style={{ ...glass, padding: 28, borderLeft: '4px solid #F59E0B' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 16 }}>🏆</div>
        <h2 className="font-heading" style={{ fontSize: 24, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>Challenge Mode</h2>
        <p style={{ fontSize: 14, color: '#4B5563', fontFamily: 'var(--font-body)', marginBottom: 16, lineHeight: 1.6 }}>
          15 mixed questions. Harder problems. Higher stakes.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
          <StatPill>🔥 15 questions</StatPill>
          <StatPill>🎲 Mixed topics</StatPill>
          <StatPill>⭐ +15 XP | ❌ -5 XP</StatPill>
        </div>
        <div style={{ display: 'inline-flex', marginBottom: 20 }}>
          <span style={{ background: '#FEF3C7', color: '#92400E', borderRadius: 100, padding: '4px 12px', fontSize: 13, fontFamily: 'var(--font-body)' }}>
            ⚠️ Wrong answers cost XP!
          </span>
        </div>
        <button
          onClick={() => onStart('challenge')}
          style={{
            width: '100%', minHeight: 48, background: '#F59E0B', color: '#0A1628',
            border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}
        >
          Accept Challenge →
        </button>
      </div>

    </div>
  );
}