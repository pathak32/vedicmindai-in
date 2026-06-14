import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getDailyQuestions,
  getDailyQuizStatus,
  getTodayString,
  getTodayQuizResult,
} from '@/lib/dailyQuizEngine';
import { saveDailyQuizResult, saveUserProgress } from '@/lib/supabaseDataService';
import { getSupabase } from '@/lib/supabaseClient';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { speakExplanation, buildExplanation } from '@/lib/voiceExplanation';

// ─── Constants ────────────────────────────────────────────────────────────────

const BG = { minHeight: '100vh', background: '#0A1628' };
const TIMER_TOTAL = 30;
const LETTERS = ['A', 'B', 'C', 'D'];

function calcPoints(timeUsedMs) {
  const secs = timeUsedMs / 1000;
  if (secs < 10) return 20;
  if (secs < 20) return 15;
  return 10;
}

function getTodayString_local() {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

function timeUntil8AM() {
  const now = new Date();
  const next = new Date();
  next.setHours(8, 0, 0, 0);
  if (now.getHours() >= 8) next.setDate(now.getDate() + 1);
  const diff = Math.max(0, next - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// ─── Circular Timer SVG ───────────────────────────────────────────────────────

function CircularTimer({ fraction, seconds }) {
  const R = 28, CX = 36, CY = 36, SW = 5;
  const circ = 2 * Math.PI * R;
  const dashOffset = circ * (1 - fraction);
  const color = seconds <= 10 ? '#EF4444' : seconds <= 20 ? '#F59E0B' : '#3B82F6';
  return (
    <svg width={72} height={72} style={{ display: 'block', flexShrink: 0 }}>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={SW} />
      <circle
        cx={CX} cy={CY} r={R} fill="none"
        stroke={color} strokeWidth={SW} strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${CX} ${CY})`}
        style={{ transition: 'stroke 0.3s' }}
      />
      <text x={CX} y={CY + 6} textAnchor="middle"
        fontFamily="var(--font-mono)" fontSize={16} fontWeight={700} fill={color}>
        {seconds}
      </text>
    </svg>
  );
}

// ─── Waiting Screen ───────────────────────────────────────────────────────────

function WaitingScreen() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(timeUntil8AM());
  useEffect(() => {
    const iv = setInterval(() => setCountdown(timeUntil8AM()), 1000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ ...BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', minHeight: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 40, maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🕗</div>
        <h2 className="font-heading" style={{ fontSize: 26, fontWeight: 700, color: 'white', marginBottom: 8 }}>
          Next quiz drops at 8:00 AM
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>
          Come back in the morning for today's challenge
        </p>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 700, color: '#3B82F6', marginBottom: 28, letterSpacing: 2 }}>
          {countdown}
        </div>
        <button onClick={() => navigate('/dashboard')} style={{
          width: '100%', minHeight: 48, background: 'white', color: '#0A1628',
          border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)',
          fontWeight: 700, fontSize: 16, cursor: 'pointer',
        }}>
          ← Back to Dashboard
        </button>
      </motion.div>
    </div>
  );
}

// ─── Countdown Intro (3…2…1…GO!) ─────────────────────────────────────────────

function CountdownIntro({ onDone }) {
  const [count, setCount] = useState(3);
  useEffect(() => {
    if (count === 0) { onDone(); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);
  const label = count === 0 ? 'GO!' : String(count);
  return (
    <div style={{ ...BG, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={label}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(80px,25vw,140px)', fontWeight: 800, color: count === 0 ? '#10B981' : 'white', textAlign: 'center' }}
        >
          {label}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Quiz Screen ──────────────────────────────────────────────────────────────

function QuizScreen({ questions, onComplete }) {
  const [qIndex, setQIndex] = useState(0);
  const [fraction, setFraction] = useState(1); // 1 = full, 0 = empty
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [timedOut, setTimedOut] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const answersRef = useRef([]);

  const startMsRef = useRef(null);
  const rafRef = useRef(null);
  const nextRef = useRef(null);
  const isLastQ = qIndex === questions.length - 1;
  const q = questions[qIndex];

  const secondsLeft = Math.ceil(fraction * TIMER_TOTAL);

  // Start/reset RAF timer for each question
  const startTimer = useCallback(() => {
    startMsRef.current = performance.now();
    const tick = (now) => {
      const elapsed = (now - startMsRef.current) / 1000;
      const newFrac = Math.max(0, 1 - elapsed / TIMER_TOTAL);
      setFraction(newFrac);
      if (newFrac <= 0) {
        handleTimeout();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [qIndex]);

  useEffect(() => {
    setAnswered(false);
    setSelected(null);
    setTimedOut(false);
    setFraction(1);
    startTimer();
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(nextRef.current);
    };
  }, [qIndex]);

  function handleTimeout() {
    cancelAnimationFrame(rafRef.current);
    setFraction(0);
    setTimedOut(true);
    setAnswered(true);
    answersRef.current.push({ questionId: q.id, selectedIndex: -1, correct: false, timeMs: TIMER_TOTAL * 1000 });
    nextRef.current = setTimeout(advance, 800);
  }

  function handleSelect(idx) {
    if (answered) return;
    cancelAnimationFrame(rafRef.current);
    const elapsed = performance.now() - startMsRef.current;
    const isCorrect = idx === q.correctIndex;
    const pts = isCorrect ? calcPoints(elapsed) : 0;
    setSelected(idx);
    setAnswered(true);
    if (isCorrect) setTotalScore(s => s + pts);
    answersRef.current.push({ questionId: q.id, selectedIndex: idx, correct: isCorrect, timeMs: Math.round(elapsed), pts });
    nextRef.current = setTimeout(advance, 800);
  }

  function advance() {
    if (isLastQ) {
      const allAnswers = answersRef.current;
      const score = allAnswers.reduce((s, a) => s + (a.pts || 0), 0);
      const allCorrect = allAnswers.every(a => a.correct);
      const finalScore = score + (allCorrect ? 10 : 0);
      onComplete(allAnswers, finalScore);
    } else {
      setQIndex(i => i + 1);
    }
  }

  function getOptionStyle(idx) {
    const base = {
      width: '100%', minHeight: 56, borderRadius: 14, padding: '14px 20px',
      fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 16,
      color: 'white', textAlign: 'left', cursor: answered ? 'default' : 'pointer',
      display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10,
      border: '1.5px solid rgba(255,255,255,0.15)',
      background: 'rgba(255,255,255,0.06)',
      transition: 'background 0.2s, border-color 0.2s',
    };
    if (!answered) return base;
    if (idx === q.correctIndex) return { ...base, background: 'rgba(16,185,129,0.2)', borderColor: '#10B981' };
    if (idx === selected) return { ...base, background: 'rgba(239,68,68,0.2)', borderColor: '#EF4444' };
    return { ...base, opacity: 0.5 };
  }

  return (
    <div style={{ ...BG, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top bar */}
      <div style={{ padding: '20px 16px 0', maxWidth: 640, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
            Q{qIndex + 1} <span style={{ color: 'rgba(255,255,255,0.3)' }}>of {questions.length}</span>
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: '#F59E0B' }}>
            ⭐ {totalScore} pts
          </span>
          <CircularTimer fraction={fraction} seconds={secondsLeft} />
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 100, marginBottom: 4 }}>
          <div style={{ height: '100%', width: `${((qIndex) / questions.length) * 100}%`, background: '#3B82F6', borderRadius: 100, transition: 'width 0.3s' }} />
        </div>

        {/* Q dots */}
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          {questions.map((_, i) => {
            const ans = answersRef.current[i];
            const bg = i < qIndex
              ? (ans?.correct ? '#10B981' : '#EF4444')
              : i === qIndex ? '#3B82F6' : 'rgba(255,255,255,0.2)';
            return <div key={i} style={{ flex: 1, height: 4, borderRadius: 100, background: bg, transition: 'background 0.3s' }} />;
          })}
        </div>
      </div>

      {/* Question + Options */}
      <div style={{ flex: 1, padding: '20px 16px 24px', maxWidth: 640, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <motion.div key={qIndex}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            style={{ flex: 1 }}
          >
            {/* Sutra badge */}
            {q.sutra && (
              <div style={{ marginBottom: 12 }}>
                <span style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)', color: '#93C5FD', borderRadius: 100, padding: '4px 14px', fontFamily: 'var(--font-body)', fontSize: 12 }}>
                  {q.sutra}
                </span>
              </div>
            )}

            {/* Question text */}
            <p className="font-heading" style={{ fontSize: 'clamp(18px,4vw,22px)', fontWeight: 700, color: 'white', lineHeight: 1.45, marginBottom: 28 }}>
              {q.question}
            </p>

            {/* Options */}
            {q.options.map((opt, idx) => (
              <button key={idx} onClick={() => handleSelect(idx)} style={getOptionStyle(idx)}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'rgba(255,255,255,0.4)', minWidth: 18 }}>
                  {LETTERS[idx]}
                </span>
                <span style={{ flex: 1 }}>{opt}</span>
                {answered && idx === q.correctIndex && <span style={{ color: '#10B981', fontSize: 18 }}>✓</span>}
                {answered && idx === selected && idx !== q.correctIndex && <span style={{ color: '#EF4444', fontSize: 18 }}>✗</span>}
              </button>
            ))}

            {/* Timed out message */}
            {timedOut && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#F59E0B', marginTop: 4 }}>⏰ Time's up!</p>
            )}

            {/* Explanation on answer */}
            {answered && q.explanation && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '12px 16px', marginTop: 12 }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.6 }}>
                  💡 {q.explanation}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Skip button */}
        {!answered && (
          <button onClick={() => handleSelect(-1)} style={{
            minHeight: 44, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 10, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)',
            fontSize: 15, cursor: 'pointer', marginTop: 16,
          }}>
            Skip →
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Save logic ───────────────────────────────────────────────────────────────

function checkQuizStreakBadges(streak) {
  const progress = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_progress') || '{}'); } catch { return {}; } })();
  const badges = progress.badges || [];
  const toAward = [];
  if (streak >= 7  && !badges.includes('quiz_streak_7'))  toAward.push('quiz_streak_7');
  if (streak >= 30 && !badges.includes('quiz_streak_30')) toAward.push('quiz_streak_30');
  if (toAward.length > 0) {
    progress.badges = [...badges, ...toAward];
    localStorage.setItem('vedicmind_progress', JSON.stringify(progress));
  }
}

function updateQuizStreak() {
  const progress = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_progress') || '{}'); } catch { return {}; } })();
  const today = getTodayString_local();
  const last = progress.lastQuizDate || null;
  const d = new Date(); d.setDate(d.getDate() - 1);
  const yesterday = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

  let newStreak = progress.dailyQuizStreak || 0;
  if (last === today) {
    // already counted — no-op
  } else if (last === yesterday) {
    newStreak = newStreak + 1;
  } else if (last === null) {
    newStreak = 1;
  } else {
    newStreak = 1;
  }

  progress.dailyQuizStreak = newStreak;
  progress.lastQuizDate = today;
  localStorage.setItem('vedicmind_progress', JSON.stringify(progress));
  checkQuizStreakBadges(newStreak);
}

function saveQuizResult(answers, totalScore) {
  const progress = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_progress') || '{}'); } catch { return {}; } })();
  const today = getTodayString_local();

  // Don't save twice
  if (!progress.dailyQuizHistory) progress.dailyQuizHistory = [];
  if (progress.dailyQuizHistory.some(h => h.date === today)) return;

  progress.dailyQuizHistory.push({
    date: today,
    score: totalScore,
    maxScore: 110,
    answers: answers,
    completedAt: Date.now(),
  });

  // Add XP
  progress.totalXP = (progress.totalXP || 0) + Math.round(totalScore * 0.5);

  // Update learning streak
  const yesterday = (() => {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  })();
  const lastEntry = progress.dailyQuizHistory[progress.dailyQuizHistory.length - 2];
  if (lastEntry?.date === yesterday) {
    progress.streak = (progress.streak || 0) + 1;
  } else {
    progress.streak = 1;
  }

  localStorage.setItem('vedicmind_progress', JSON.stringify(progress));

  // Also save to Supabase (async, non-blocking)
  (async () => {
    try {
      const supabase = await getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        await saveDailyQuizResult(session.user.id, {
          score: totalScore, totalPossible: 110, answers: answers, timeTaken: 0,
        });
        await saveUserProgress(session.user.id, progress);
      }
    } catch (e) { console.warn('Supabase quiz save failed (non-critical):', e); }
  })();

  // Update independent quiz streak
  updateQuizStreak();
}

// ─── Error Boundary ───────────────────────────────────────────────────────────

class QuizErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ ...BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 40, textAlign: 'center' }}>
          <span style={{ fontSize: 48 }}>⚠️</span>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'white' }}>Something went wrong. Please refresh.</p>
          <button onClick={() => window.location.reload()} style={{ minHeight: 48, padding: '0 32px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Refresh</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function DailyQuizPageInner() {
  const navigate = useNavigate();
  const { user, loading } = useVedicAuth();
  const [screen, setScreen] = useState('loading'); // loading | waiting | countdown | quiz | done
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate('/auth'); return; }

    const progress = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_progress') || '{}'); } catch { return {}; } })();
    const status = getDailyQuizStatus(progress);

    if (status === 'completed') {
      navigate('/daily-quiz/results', { replace: true });
      return;
    }
    if (status === 'waiting') {
      setScreen('waiting');
      return;
    }
    // pending — load questions and show countdown
    const profile = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_profile') || '{}'); } catch { return {}; } })();
    const qs = getDailyQuestions(profile.grade);
    setQuestions(qs);
    setScreen('countdown');
  }, [loading, user]);

  function handleQuizComplete(answers, totalScore) {
    saveQuizResult(answers, totalScore);
    navigate('/daily-quiz/results', { replace: true });
  }

  if (screen === 'loading') return <div style={{ ...BG, minHeight: '100vh' }} />;
  if (screen === 'waiting') return <WaitingScreen />;
  if (screen === 'countdown') return <CountdownIntro onDone={() => setScreen('quiz')} />;
  if (screen === 'quiz') return <QuizScreen questions={questions} onComplete={handleQuizComplete} />;
  return null;
}

export default function DailyQuizPage() {
  return (
    <QuizErrorBoundary>
      <DailyQuizPageInner />
    </QuizErrorBoundary>
  );
}