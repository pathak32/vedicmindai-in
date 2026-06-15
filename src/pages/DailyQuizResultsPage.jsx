import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { getTodayString, getDailyQuestions } from '@/lib/dailyQuizEngine';
import { useLanguage } from '@/lib/LanguageContext';

// ─── Countdown to midnight ────────────────────────────────────────────────────

function useMidnightCountdown() {
  const { t } = useLanguage();
  const [display, setDisplay] = useState('');
  useEffect(() => {
    const update = () => {
      const t = new Date(); t.setDate(t.getDate() + 1); t.setHours(0, 0, 0, 0);
      const diff = Math.max(0, t - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setDisplay(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);
  return display;
}

// ─── Animated count-up ────────────────────────────────────────────────────────

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({ pct, animatedScore, maxScore }) {
  const R = 70, CX = 90, CY = 90, SW = 10;
  const circ = 2 * Math.PI * R;
  const [dashOffset, setDashOffset] = useState(circ);

  useEffect(() => {
    const t = setTimeout(() => setDashOffset(circ * (1 - pct / 100)), 100);
    return () => clearTimeout(t);
  }, [pct, circ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={180} height={180}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(30,64,175,0.1)" strokeWidth={SW} />
        <circle
          cx={CX} cy={CY} r={R} fill="none"
          stroke="#3B82F6" strokeWidth={SW} strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${CX} ${CY})`}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.33,1,0.68,1)' }}
        />
        <text x={CX} y={CY - 10} textAnchor="middle"
          fontFamily="var(--font-heading)" fontSize={38} fontWeight={800} fill="#0A1628">
          {animatedScore}
        </text>
        <text x={CX} y={CY + 14} textAnchor="middle"
          fontFamily="var(--font-body)" fontSize={14} fill="#9CA3AF">
          / {maxScore}
        </text>
        <text x={CX} y={CY + 32} textAnchor="middle"
          fontFamily="var(--font-body)" fontSize={11} fill="#4B5563" fontWeight={600}
          style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
          TODAY'S SCORE
        </text>
      </svg>
    </div>
  );
}

// ─── Question Row ─────────────────────────────────────────────────────────────

function QuestionRow({ index, answer, question, expanded, onToggle }) {
  const correct = answer?.correct;
  const timeS = answer?.timeMs != null ? (answer.timeMs / 1000).toFixed(1) : '—';
  const pts = answer?.pts || 0;
  const timedOut = answer?.selectedIndex === -1;

  return (
    <div
      onClick={onToggle}
      style={{
        borderLeft: `4px solid ${correct ? '#10B981' : '#EF4444'}`,
        borderRadius: '0 12px 12px 0',
        background: correct ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.05)',
        marginBottom: 8,
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'background 0.15s',
      }}
    >
      {/* Main row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', minHeight: 52,
      }}>
        {/* Q number */}
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
          color: '#9CA3AF', minWidth: 24, flexShrink: 0,
        }}>Q{index + 1}</span>

        {/* Question text */}
        <span style={{
          flex: 1, fontFamily: 'var(--font-body)', fontSize: 15, color: '#0A1628',
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: expanded ? 'none' : 1,
          WebkitBoxOrient: 'vertical',
        }}>
          {question?.question || (correct ? 'Correct' : timedOut ? 'Timed out' : 'Wrong')}
        </span>

        {/* Time */}
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 13, color: '#9CA3AF',
          flexShrink: 0, minWidth: 36, textAlign: 'right',
        }}>{timeS}s</span>

        {/* Points */}
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700,
          color: pts > 0 ? '#F59E0B' : '#9CA3AF',
          flexShrink: 0, minWidth: 32, textAlign: 'right',
        }}>+{pts}</span>

        {/* Status */}
        <span style={{ fontSize: 18, flexShrink: 0 }}>{correct ? '✅' : '❌'}</span>
      </div>

      {/* Expanded explanation */}
      <AnimatePresence>
        {expanded && question?.explanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 16px 14px 52px',
              fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563',
              lineHeight: 1.65,
            }}>
              {question.sutra && (
                <span style={{
                  display: 'inline-block', marginBottom: 6,
                  background: '#DBEAFE', color: '#1E40AF',
                  borderRadius: 100, padding: '2px 10px', fontSize: 12,
                }}>
                  {question.sutra}
                </span>
              )}
              <p style={{ margin: 0 }}>💡 {question.explanation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Share Modal ──────────────────────────────────────────────────────────────

function ShareModal({ score, onClose }) {
  const [copied, setCopied] = useState(false);
  const shareText = `I scored ${score}/110 on VedicMind's Daily Quiz today! 🧮⚡ Can you beat me?\n👉 Join FREE: https://vedicmindai.in\n#VedicMind #VedicMaths #MentalMath`;
  const encodedText = encodeURIComponent(shareText);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const btnStyle = (bg) => ({
    background: bg, color: 'white', border: 'none', borderRadius: 12,
    cursor: 'pointer', minHeight: 80, padding: '12px 8px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
    width: '100%', WebkitTapHighlightColor: 'transparent',
    textDecoration: 'none',
  });

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(10,22,40,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 16, padding: 24,
          maxWidth: 400, width: '100%',
          boxShadow: '0 20px 60px rgba(10,22,40,0.25)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: '#0A1628', margin: 0 }}>Share Your Score 🎉</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B7280', margin: '4px 0 0 0' }}>Challenge your friends!</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: '#F0F4FF', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 16, color: '#4B5563', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >✕</button>
        </div>

        {/* 2x2 grid of share buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {/* WhatsApp */}
          <a href={`https://wa.me/?text=${encodedText}`} target="_blank" rel="noopener noreferrer" style={btnStyle('#25D366')}>
            <span style={{ fontSize: 28 }}>💬</span>
            WhatsApp
          </a>

          {/* Telegram */}
          <a href={`https://t.me/share/url?url=https://vedicmindai.in&text=${encodedText}`} target="_blank" rel="noopener noreferrer" style={btnStyle('#0088cc')}>
            <span style={{ fontSize: 28 }}>✈️</span>
            Telegram
          </a>

          {/* Twitter/X */}
          <a href={`https://twitter.com/intent/tweet?text=${encodedText}`} target="_blank" rel="noopener noreferrer" style={btnStyle('#000000')}>
            <span style={{ fontSize: 28 }}>🐦</span>
            Twitter / X
          </a>

          {/* Copy Text */}
          <button onClick={handleCopy} style={btnStyle(copied ? '#10B981' : '#6B7280')}>
            <span style={{ fontSize: 28 }}>📋</span>
            {copied ? 'Copied! ✓' : 'Copy Text'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DailyQuizResultsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const midnight = useMidnightCountdown();

  const [expandedRows, setExpandedRows] = useState({});
  const [allExpanded, setAllExpanded] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Load data
  const progress = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_progress') || '{}'); } catch { return {}; } })();
  const today = getTodayString();
  const result = progress.dailyQuizHistory?.find(h => h.date === today) || null;

  // Quiz streak info
  const quizStreak = progress.dailyQuizStreak || 0;
  const lastQuizDate = progress.lastQuizDate || null;
  // Determine streak message
  let streakMsg = null;
  let streakColor = '#F59E0B';
  if (result) {
    if (quizStreak === 1 && lastQuizDate === today && (progress.dailyQuizHistory || []).length === 1) {
      streakMsg = '🎉 You started your quiz streak!';
      streakColor = '#10B981';
    } else if (quizStreak === 1) {
      streakMsg = 'Streak reset — start fresh from today 💪';
    } else if (quizStreak > 1) {
      streakMsg = `🔥 ${quizStreak} day streak! Keep it going.`;
    }
  }

  // Re-generate today's questions to get text/explanation (deterministic, same seed)
  const profile = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_profile') || '{}'); } catch { return {}; } })();
  const questions = getDailyQuestions(profile.grade);

  const score = result?.score || 0;
  const maxScore = result?.maxScore || 110;
  const answers = result?.answers || [];
  const correctCount = answers.filter(a => a.correct).length;
  const allCorrect = correctCount === 5;
  const pct = Math.round((score / maxScore) * 100);

  const animatedScore = useCountUp(score, 1200);

  // Confetti on high score
  useEffect(() => {
    if (!result) return;
    if (pct >= 50) {
      setTimeout(() => {
        try { confetti({ particleCount: 100, spread: 100, origin: { x: 0.5, y: 0.4 } }); } catch {}
      }, 600);
    }
  }, []);

  // Toggle row
  const toggleRow = (i) => {
    setExpandedRows(prev => ({ ...prev, [i]: !prev[i] }));
  };

  // Expand / collapse all
  const handleToggleAll = () => {
    if (allExpanded) {
      setExpandedRows({});
      setAllExpanded(false);
    } else {
      const all = {};
      answers.forEach((_, i) => { all[i] = true; });
      setExpandedRows(all);
      setAllExpanded(true);
    }
  };



  // ── No result state ──
  if (!result) {
    return (
      <div style={{
        minHeight: '100vh', background: '#F0F4FF',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '40px 16px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(30,64,175,0.15)',
            boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
            borderRadius: 16, padding: 40, maxWidth: 400, width: '100%', textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 56, marginBottom: 16 }}>📋</div>
          <h2 className="font-heading" style={{ fontSize: 24, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>
            No quiz taken yet!
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#4B5563', marginBottom: 28, lineHeight: 1.6 }}>
            You haven't taken today's quiz yet!
          </p>
          <button
            onClick={() => navigate('/daily-quiz')}
            style={{
              width: '100%', minHeight: 48, background: '#0A1628', color: 'white',
              border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)',
              fontWeight: 700, fontSize: 16, cursor: 'pointer',
            }}
          >
            Take Today's Quiz →
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Results state ──
  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF', padding: '24px 16px 48px' }}>
      <style>{`
        @media(max-width:640px){
          .rp-hero{flex-direction:column!important;text-align:center!important;}
          .rp-hero-text{align-items:center!important;}
        }
      `}</style>

      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 24 }}
        >
          <h1 className="font-heading" style={{ fontSize: 28, fontWeight: 700, color: '#0A1628', marginBottom: 4 }}>
            Quiz Complete! 🎉
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#4B5563', margin: 0 }}>
            Next quiz in {midnight}
          </p>
        </motion.div>

        {/* ── Score Hero Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{
            background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(30,64,175,0.15)',
            boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
            borderRadius: 16, padding: '28px 24px', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 24,
          }}
          className="rp-hero"
        >
          {/* Ring */}
          <ScoreRing pct={pct} animatedScore={animatedScore} maxScore={maxScore} />

          {/* Stats */}
          <div className="rp-hero-text" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Large score */}
            <div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>{t('score')}</div>
              <span className="font-heading" style={{ fontSize: 48, fontWeight: 700, color: '#0A1628', lineHeight: 1 }}>
                {animatedScore}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: '#9CA3AF', marginLeft: 6 }}>
                / {maxScore}
              </span>
            </div>

            {/* Accuracy */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Correct</div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: '#10B981' }}>{correctCount}/5</span>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{t('accuracy')}</div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: '#3B82F6' }}>{pct}%</span>
              </div>
            </div>

            {/* Perfect bonus badge */}
            {allCorrect && (
              <div style={{
                background: '#FEF3C7', border: '1px solid #F59E0B',
                borderRadius: 8, padding: '6px 12px', display: 'inline-flex',
                alignItems: 'center', gap: 6,
              }}>
                <span style={{ fontSize: 16 }}>🏆</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', fontWeight: 600 }}>Perfect Score! +10 bonus pts</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Streak Celebration ── */}
        {streakMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            style={{ textAlign: 'center', marginBottom: 16, marginTop: 0 }}
          >
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: 14,
              color: streakColor, fontWeight: quizStreak > 1 ? 600 : 400,
            }}>
              {streakMsg}
            </span>
          </motion.div>
        )}

        {/* ── Question Breakdown ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{
            background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(30,64,175,0.15)',
            boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
            borderRadius: 16, padding: '20px 20px', marginBottom: 16,
          }}
        >
          {/* Section header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700, color: '#0A1628', margin: 0 }}>
              Question Breakdown
            </h2>
            <button
              onClick={handleToggleAll}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 13, color: '#3B82F6',
                fontWeight: 600, padding: '4px 8px', minHeight: 32,
              }}
            >
              {allExpanded ? 'Collapse All' : 'View Full Explanation'}
            </button>
          </div>

          {/* Rows */}
          {answers.slice(0, 5).map((answer, i) => (
            <QuestionRow
              key={i}
              index={i}
              answer={answer}
              question={questions[i] || null}
              expanded={!!expandedRows[i]}
              onToggle={() => toggleRow(i)}
            />
          ))}
        </motion.div>

        {/* ── Actions ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          {/* Primary: Back to Dashboard */}
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              width: '100%', minHeight: 52, background: '#0A1628', color: 'white',
              border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)',
              fontWeight: 700, fontSize: 16, cursor: 'pointer',
            }}
          >
            ← Back to Dashboard
          </button>

          {/* Share button */}
          <button
            onClick={() => setShowShareModal(true)}
            style={{
              width: '100%', minHeight: 48,
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(30,64,175,0.2)',
              color: '#0A1628',
              borderRadius: 12, fontFamily: 'var(--font-body)',
              fontWeight: 600, fontSize: 15, cursor: 'pointer',
            }}
          >
            📤 Share My Score
          </button>
        </motion.div>

        {/* Share Modal */}
        {showShareModal && (
          <ShareModal score={score} onClose={() => setShowShareModal(false)} />
        )}

      </div>
    </div>
  );
}