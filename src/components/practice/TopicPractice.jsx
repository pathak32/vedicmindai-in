import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateQuestion, TOPIC_OPTIONS, saveProgress } from './questionGenerator';

const TOTAL_Q = 10;
const glass = {
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(30,64,175,0.15)',
  boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
  borderRadius: 20,
};

const HINTS = {
  ekadhikena: 'Use Ekadhikena Purvena: digit before 5 × (digit+1), append 25',
  nikhilam_100: 'Use Nikhilam: find deficiency from 100, cross-subtract, multiply deficiencies',
  multiply_11: 'Multiply by 11: write first digit, add adjacent digits, write last digit',
  multiply_9: 'Multiply by 9: (n-1) | (10 - last digit of n)',
  multiply_99: 'Multiply by 99: n×100 - n',
  digit_sum: 'Cast out 9s: keep summing digits until single digit',
};

export default function TopicPractice({ topic, onExit, onChangeTopic }) {
  const questions = useMemo(() => Array.from({ length: TOTAL_Q }, () => generateQuestion(topic)), [topic]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [xp, setXP] = useState(0);
  const [done, setDone] = useState(false);

  const topicLabel = TOPIC_OPTIONS.find(t => t.value === topic)?.label || topic;
  const q = questions[current];

  const handleSelect = (idx) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    const isCorrect = idx === q.correctIndex;
    setAnswers(prev => [...prev, isCorrect]);
    setXP(prev => Math.max(0, prev + (isCorrect ? 10 : -2)));

    setTimeout(() => {
      if (current < TOTAL_Q - 1) {
        setCurrent(c => c + 1);
        setSelected(null);
        setRevealed(false);
      } else {
        setDone(true);
      }
    }, 800);
  };

  if (done) {
    const correctCount = answers.filter(Boolean).length;
    const accuracy = Math.round((correctCount / TOTAL_Q) * 100);
    saveProgress({ xpEarned: xp, mode: 'topic', score: correctCount, accuracy });
    const mastered = correctCount >= 8;
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ ...glass, padding: 40, textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{mastered ? '🎯' : '📚'}</div>
        <h2 className="font-heading" style={{ fontSize: 26, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>
          {mastered ? '🎯 Topic Mastered!' : 'Keep Practicing!'}
        </h2>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 48, fontWeight: 700, color: '#0A1628', marginBottom: 4 }}>{correctCount}/{TOTAL_Q}</div>
        <div style={{ fontSize: 14, color: '#4B5563', fontFamily: 'var(--font-body)', marginBottom: 24 }}>{accuracy}% accuracy</div>
        <div style={{ background: '#FEF3C7', borderRadius: 12, padding: '16px', marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: '#92400E' }}>+{xp} XP ⭐</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => { setCurrent(0); setSelected(null); setRevealed(false); setAnswers([]); setXP(0); setDone(false); }}
            style={{ minHeight: 48, background: '#0A1628', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Practice Again
          </button>
          <button onClick={onChangeTopic}
            style={{ minHeight: 48, background: '#10B981', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Try Different Topic
          </button>
          <button onClick={onExit}
            style={{ minHeight: 48, background: 'transparent', color: '#0A1628', border: '1.5px solid rgba(30,64,175,0.2)', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Back to Modes
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: 540, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: '#0A1628' }}>{topicLabel}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563' }}>Question {current + 1} of {TOTAL_Q}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* progress dots */}
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: TOTAL_Q }, (_, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: i < answers.length ? (answers[i] ? '#10B981' : '#EF4444') : i === current ? '#3B82F6' : 'rgba(30,64,175,0.15)',
              }} />
            ))}
          </div>
          <button onClick={onExit}
            style={{ minHeight: 44, padding: '0 12px', background: 'transparent', color: '#4B5563', border: '1px solid rgba(30,64,175,0.2)', borderRadius: 10, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            ✕ Exit
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          style={{ ...glass, padding: 28 }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(18px,4vw,22px)', fontWeight: 700, color: '#0A1628', textAlign: 'center', marginBottom: 28 }}>
            {q.question}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.options.map((opt, i) => {
              let bg = 'white';
              let border = '1.5px solid rgba(30,64,175,0.15)';
              if (revealed) {
                if (i === q.correctIndex) { bg = '#D1FAE5'; border = '1.5px solid #10B981'; }
                else if (i === selected && i !== q.correctIndex) { bg = '#FEE2E2'; border = '1.5px solid #EF4444'; }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  style={{
                    width: '100%', minHeight: 52, padding: '0 20px',
                    background: bg, border, borderRadius: 12,
                    fontSize: 15, fontWeight: 600,
                    fontFamily: 'var(--font-mono)', color: '#0A1628',
                    cursor: revealed ? 'default' : 'pointer', textAlign: 'left',
                    transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <span><span style={{ fontFamily: 'var(--font-body)', marginRight: 8 }}>{String.fromCharCode(65 + i)}.</span>{opt}</span>
                  {revealed && i === q.correctIndex && <span>✅</span>}
                  {revealed && i === selected && i !== q.correctIndex && <span>❌</span>}
                </button>
              );
            })}
          </div>

          {revealed && selected !== q.correctIndex && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 16, background: '#FEF3C7', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#92400E', fontFamily: 'var(--font-body)' }}>
              💡 Hint: {HINTS[topic] || 'Review the lesson concept and try again.'}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={{ marginTop: 12, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 14, color: '#0A1628' }}>
        XP: <span style={{ color: xp >= 0 ? '#10B981' : '#EF4444', fontWeight: 700 }}>+{xp}</span>
      </div>
    </div>
  );
}