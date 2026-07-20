import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateQuestion, generateMixed, saveProgress } from './questionGenerator';
import { useLanguage } from '@/lib/LanguageContext';
import { awardPoints, POINTS } from '@/lib/knowledgePoints';
import { useVedicAuth } from '@/lib/VedicAuthContext';

const TOTAL_SECS = 120;
const glass = {
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(30,64,175,0.15)',
  boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
  borderRadius: 20,
};

function XPToast({
  text, isPos }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
        background: isPos ? '#0A1628' : '#EF4444', color: 'white',
        borderRadius: 100, padding: '8px 20px', fontSize: 14,
        fontFamily: 'var(--font-body)', fontWeight: 600, zIndex: 999,
        pointerEvents: 'none',
      }}
    >{text}</motion.div>
  );
}

export default function SpeedDrill({onExit }) {
  const { t } = useLanguage();
  const { user } = useVedicAuth();
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECS);
  const [running, setRunning] = useState(true);
  const [question, setQuestion] = useState(() => generateMixed());
  const [qCount, setQCount] = useState(1);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [flash, setFlash] = useState(null); // 'correct' | 'wrong'
  const [toast, setToast] = useState(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [done, setDone] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setRunning(false); setDone(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running]);

  // Award Knowledge Points when drill completes
  useEffect(() => {
    if (!done || !user?.id) return;
    const pts = correct * POINTS.QUESTION_CORRECT + wrong * POINTS.QUESTION_WRONG;
    if (pts !== 0) awardPoints(user.id, pts, 'speed_drill', new Date().toISOString().slice(0, 10));
  }, [done]);

  const nextQ = useCallback(() => {
    setQuestion(generateMixed());
    setQCount(c => c + 1);
    setFlash(null);
  }, []);

  const showToast = (text, isPos) => {
    setToast({ text, isPos });
    setTimeout(() => setToast(null), 1000);
  };

  const handleAnswer = (idx) => {
    if (!running || flash) return;
    const isCorrect = idx === question.correctIndex;
    setFlash(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setCorrect(c => c + 1);
      setStreak(s => { const ns = s + 1; if (ns > bestStreak) setBestStreak(ns); return ns; });
      showToast('+2 KP ⭐', true);
    } else {
      setWrong(w => w + 1);
      setStreak(0);
      showToast('-1 KP', false);
    }
    setTimeout(nextQ, 300);
  };

  const mins = String(Math.floor(timeLeft / 60)).padStart(1, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const timerColor = timeLeft < 30 ? '#EF4444' : '#0A1628';

  if (done) {
    const xpEarned = Math.max(0, correct * POINTS.QUESTION_CORRECT + wrong * POINTS.QUESTION_WRONG);
    const accuracy = qCount > 1 ? Math.round((correct / (correct + wrong)) * 100) : 0;
    saveProgress({ xpEarned, mode: 'speed', score: correct, accuracy });
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ ...glass, padding: 40, textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>⚡</div>
        <h2 className="font-heading" style={{ fontSize: 28, fontWeight: 700, color: '#0A1628', marginBottom: 24 }}>Drill Complete!</h2>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 56, fontWeight: 700, color: '#0A1628', marginBottom: 4 }}>{accuracy}%</div>
        <div style={{ fontSize: 14, color: '#4B5563', fontFamily: 'var(--font-body)', marginBottom: 24 }}>{t('accuracy')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {[['Answered', correct + wrong], ['Correct', correct], ['Wrong', wrong]].map(([l, v]) => (
            <div key={l} style={{ background: '#F0F4FF', borderRadius: 12, padding: '12px 8px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: '#0A1628' }}>{v}</div>
              <div style={{ fontSize: 12, color: '#4B5563', fontFamily: 'var(--font-body)' }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div style={{ background: '#FEF3C7', borderRadius: 12, padding: '12px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: '#92400E' }}>+{xpEarned} KP</div>
            <div style={{ fontSize: 12, color: '#92400E', fontFamily: 'var(--font-body)' }}>KP Earned</div>
          </div>
          <div style={{ background: '#DBEAFE', borderRadius: 12, padding: '12px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: '#1E40AF' }}>{bestStreak}🔥</div>
            <div style={{ fontSize: 12, color: '#1E40AF', fontFamily: 'var(--font-body)' }}>Best Streak</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => { setTimeLeft(TOTAL_SECS); setCorrect(0); setWrong(0); setQCount(1); setStreak(0); setBestStreak(0); setDone(false); setRunning(true); setQuestion(generateMixed()); }}
            style={{ flex: 1, minHeight: 48, background: '#0A1628', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            {t('retry')}
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
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 18, color: '#0A1628' }}>⚡ Speed Drill</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 700, color: timerColor }}>{mins}:{secs}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 16, color: '#0A1628' }}>Score: {correct}</span>
          <button onClick={() => { setDone(true); clearInterval(timerRef.current); }}
            style={{ minHeight: 44, padding: '0 16px', background: 'transparent', color: '#4B5563', border: '1px solid rgba(30,64,175,0.2)', borderRadius: 10, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            ✕ End
          </button>
        </div>
      </div>

      {/* Timer bar */}
      <div style={{ height: 8, background: 'rgba(30,64,175,0.1)', borderRadius: 100, marginBottom: 24, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(timeLeft / TOTAL_SECS) * 100}%`, background: timeLeft < 30 ? '#EF4444' : '#3B82F6', borderRadius: 100, transition: 'width 1s linear' }} />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={qCount}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.15 }}
          style={{
            ...glass,
            padding: 28,
            border: flash === 'correct' ? '2px solid #10B981' : flash === 'wrong' ? '2px solid #EF4444' : '1px solid rgba(30,64,175,0.15)',
            transition: 'border-color 0.2s',
          }}
        >
          <div style={{ fontSize: 13, color: '#4B5563', fontFamily: 'var(--font-body)', marginBottom: 16 }}>Question {qCount}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(18px,5vw,26px)', fontWeight: 700, color: '#0A1628', textAlign: 'center', marginBottom: 28 }}>
            {question.question}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                style={{
                  width: '100%', minHeight: 52, padding: '0 20px',
                  background: 'white', border: '1.5px solid rgba(30,64,175,0.15)',
                  borderRadius: 12, fontSize: 16, fontWeight: 600,
                  fontFamily: 'var(--font-mono)', color: '#0A1628',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.background = '#F0F4FF'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(30,64,175,0.15)'; e.currentTarget.style.background = 'white'; }}
              >
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>{toast && <XPToast text={toast.text} isPos={toast.isPos} />}</AnimatePresence>
    </div>
  );
}