import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateMixed, saveProgress } from './questionGenerator';
import { useLanguage } from '@/lib/LanguageContext';

const TOTAL_Q = 15;
const glass = {
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '2px solid rgba(245,158,11,0.3)',
  boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
  borderRadius: 20,
};

export default function ChallengeMode({onExit }) {
  const { t } = useLanguage();
  const questions = useMemo(() => Array.from({ length: TOTAL_Q }, () => generateMixed()), []);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [xp, setXP] = useState(0);
  const [xpAnim, setXpAnim] = useState(null); // 'up' | 'down'
  const [done, setDone] = useState(false);

  const q = questions[current];

  const handleSelect = (idx) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    const isCorrect = idx === q.correctIndex;
    setAnswers(prev => [...prev, isCorrect]);
    const delta = isCorrect ? 15 : -5;
    setXP(prev => Math.max(0, prev + delta));
    setXpAnim(isCorrect ? 'up' : 'down');
    setTimeout(() => setXpAnim(null), 500);

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
    saveProgress({ xpEarned: xp, mode: 'challenge', score: correctCount, accuracy });
    const elite = accuracy >= 80;
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ ...glass, padding: 40, textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🏆</div>
        <h2 className="font-heading" style={{ fontSize: 26, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>
          Challenge Complete!
          {elite && <span style={{ display: 'block', fontSize: 18, color: '#F59E0B', marginTop: 4 }}>Elite Challenger! 🔥</span>}
        </h2>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 56, fontWeight: 700, color: '#0A1628', marginBottom: 4 }}>{correctCount}/{TOTAL_Q}</div>
        <div style={{ fontSize: 14, color: '#4B5563', fontFamily: 'var(--font-body)', marginBottom: 24 }}>{accuracy}% accuracy</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <div style={{ background: '#FEF3C7', borderRadius: 12, padding: '16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: '#92400E' }}>+{xp}</div>
            <div style={{ fontSize: 12, color: '#92400E', fontFamily: 'var(--font-body)' }}>{t('totalXP')}</div>
          </div>
          <div style={{ background: '#D1FAE5', borderRadius: 12, padding: '16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: '#065F46' }}>{correctCount}</div>
            <div style={{ fontSize: 12, color: '#065F46', fontFamily: 'var(--font-body)' }}>Correct</div>
          </div>
        </div>
        {!elite && <p style={{ fontSize: 14, color: '#4B5563', fontFamily: 'var(--font-body)', marginBottom: 20 }}>Score 80%+ to become an Elite Challenger!</p>}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => { setCurrent(0); setSelected(null); setRevealed(false); setAnswers([]); setXP(0); setDone(false); }}
            style={{ flex: 1, minHeight: 48, background: '#F59E0B', color: '#0A1628', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Challenge Again
          </button>
          <button onClick={onExit}
            style={{ flex: 1, minHeight: 48, background: 'transparent', color: '#0A1628', border: '1.5px solid rgba(30,64,175,0.2)', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
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
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: '#0A1628' }}>🏆 Challenge Mode</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}>Q {current + 1} of {TOTAL_Q}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <motion.span
            animate={xpAnim === 'up' ? { color: ['#0A1628', '#10B981', '#0A1628'] } : xpAnim === 'down' ? { color: ['#0A1628', '#EF4444', '#0A1628'] } : {}}
            transition={{ duration: 0.5 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: '#0A1628' }}
          >
            ⭐ {xp} XP
          </motion.span>
          <button onClick={onExit}
            style={{ minHeight: 44, padding: '0 12px', background: 'transparent', color: '#4B5563', border: '1px solid rgba(30,64,175,0.2)', borderRadius: 10, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            ✕
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, background: 'rgba(245,158,11,0.2)', borderRadius: 100, marginBottom: 20 }}>
        <div style={{ height: '100%', width: `${((current) / TOTAL_Q) * 100}%`, background: '#F59E0B', borderRadius: 100, transition: 'width 0.3s' }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          style={glass}
        >
          <div style={{ padding: 28 }}>
            <div style={{ fontSize: 13, color: '#F59E0B', fontFamily: 'var(--font-body)', marginBottom: 8, fontWeight: 600 }}>
              🔥 Challenge Question
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(18px,4vw,24px)', fontWeight: 700, color: '#0A1628', textAlign: 'center', marginBottom: 28 }}>
              {q.question}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map((opt, i) => {
                let bg = 'white';
                let border = '1.5px solid rgba(30,64,175,0.15)';
                let icon = '';
                if (revealed) {
                  if (i === q.correctIndex) { bg = '#D1FAE5'; border = '1.5px solid #10B981'; icon = '✅'; }
                  else if (i === selected && i !== q.correctIndex) { bg = '#FEE2E2'; border = '1.5px solid #EF4444'; icon = '❌'; }
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
                    {icon && <span>{icon}</span>}
                  </button>
                );
              })}
            </div>

            {revealed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 14, textAlign: 'center' }}>
                {selected === q.correctIndex
                  ? <span style={{ color: '#10B981', fontFamily: 'var(--font-body)', fontWeight: 600 }}>🔥 +15 XP</span>
                  : <span style={{ color: '#EF4444', fontFamily: 'var(--font-body)', fontWeight: 600 }}>💥 -5 XP</span>
                }
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}