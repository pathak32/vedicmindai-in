import React, { useState, useMemo } from 'react';
import { useCanonical } from '@/lib/useCanonical';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LandingNavbar from '@/components/landing/LandingNavbar';
import { useLanguage } from '@/lib/LanguageContext';
import { pickDemoQuestions, SUBJECTS, QUESTION_COUNTS } from '@/data/demoQuestions';

const DIFFICULTY_LABELS = { All: 'All Levels', easy: 'Easy', medium: 'Medium', hard: 'Hard' };
const DIFFICULTY_COLORS = { easy: '#10B981', medium: '#F59E0B', hard: '#EF4444', All: '#6366F1' };
const SUBJECT_EMOJI = { 'Vedic Maths': '🧮', 'Reasoning': '🧠', 'Aptitude': '📊', 'Vedic Science': '🔬', 'Mixed': '⚡' };

function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => i);
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
      {pieces.map(i => (
        <motion.div key={i}
          initial={{ y: -20, x: Math.random() * window.innerWidth, opacity: 1, rotate: 0 }}
          animate={{ y: window.innerHeight + 20, opacity: 0, rotate: 360 * (Math.random() > 0.5 ? 1 : -1) }}
          transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5, ease: 'linear' }}
          style={{ position: 'absolute', width: 8, height: 8, borderRadius: Math.random() > 0.5 ? '50%' : 2, background: colors[i % colors.length] }}
        />
      ))}
    </div>
  );
}

// ── PHASE 1: Setup screen ─────────────────────────────────────────────────
function SetupScreen({ onStart }) {
  const [subject, setSubject] = useState('Mixed');
  const [difficulty, setDifficulty] = useState('All');
  const [count, setCount] = useState(10);

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, color: '#0A1628', margin: '0 0 8px' }}>
          Try VedicMindAI Free
        </h1>
        <p style={{ color: '#6B7280', fontSize: 15, margin: 0 }}>
          No sign-up needed. Pick your challenge and test yourself.
        </p>
        <div style={{ marginTop: 8, padding: '6px 14px', background: '#EEF2FF', borderRadius: 100, display: 'inline-block', fontSize: 13, color: '#4338CA', fontWeight: 600 }}>
          1,400+ questions in the full platform
        </div>
      </div>

      {/* Subject picker */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Subject</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SUBJECTS.map(s => (
            <button key={s} onClick={() => setSubject(s)} style={{
              padding: '8px 14px', borderRadius: 10, border: `2px solid ${subject === s ? '#0A1628' : '#E5E7EB'}`,
              background: subject === s ? '#0A1628' : 'white', color: subject === s ? 'white' : '#374151',
              fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {SUBJECT_EMOJI[s]} {s}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty picker */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Difficulty</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (
            <button key={k} onClick={() => setDifficulty(k)} style={{
              flex: 1, padding: '8px 0', borderRadius: 10,
              border: `2px solid ${difficulty === k ? DIFFICULTY_COLORS[k] : '#E5E7EB'}`,
              background: difficulty === k ? DIFFICULTY_COLORS[k] + '18' : 'white',
              color: difficulty === k ? DIFFICULTY_COLORS[k] : '#6B7280',
              fontWeight: 700, fontSize: 13, cursor: 'pointer',
            }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Question count */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Number of Questions</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {QUESTION_COUNTS.map(n => (
            <button key={n} onClick={() => setCount(n)} style={{
              flex: 1, padding: '10px 0', borderRadius: 10,
              border: `2px solid ${count === n ? '#0A1628' : '#E5E7EB'}`,
              background: count === n ? '#0A1628' : 'white',
              color: count === n ? 'white' : '#374151',
              fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <button onClick={() => onStart(subject, difficulty, count)} style={{
        width: '100%', height: 52, background: '#0A1628', color: 'white', border: 'none',
        borderRadius: 14, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, cursor: 'pointer',
      }}>
        Start Challenge ⚡
      </button>
      <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 12 }}>
        Free forever · No credit card · No account needed
      </p>
    </div>
  );
}

// ── PHASE 2: Quiz screen ──────────────────────────────────────────────────
function QuizScreen({ questions, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const [answers, setAnswers] = useState([]);

  const q = questions[current];
  const progress = ((current) / questions.length) * 100;
  const diffColor = DIFFICULTY_COLORS[q.difficulty] || '#6366F1';

  function handleSelect(idx) {
    if (selected !== null) return;
    setSelected(idx);
    setShowNext(true);
    setAnswers(prev => [...prev, { correct: idx === q.correct }]);
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      const score = answers.filter(a => a.correct).length + (selected === q.correct ? 1 : 0);
      onFinish(score, questions.length);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowNext(false);
    }
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '16px 16px' }}>
      {/* Progress bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6B7280', marginBottom: 6 }}>
          <span style={{ fontWeight: 700, color: '#0A1628' }}>Question {current + 1} of {questions.length}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: diffColor, fontWeight: 700, fontSize: 11 }}>{q.difficulty?.toUpperCase()}</span>
            · {SUBJECT_EMOJI[q.subject]} {q.subject}
          </span>
        </div>
        <div style={{ background: '#E5E7EB', borderRadius: 100, height: 6 }}>
          <div style={{ width: `${progress}%`, background: '#0A1628', height: 6, borderRadius: 100, transition: 'width 0.3s' }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current}
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}>

          {/* Topic badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: diffColor + '18', borderRadius: 100, padding: '4px 12px', marginBottom: 14, border: `1px solid ${diffColor}44` }}>
            <span style={{ fontSize: 14 }}>{q.emoji}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: diffColor }}>{q.topic}</span>
          </div>

          {/* Question */}
          <div style={{ background: 'white', borderRadius: 16, padding: '24px 20px', marginBottom: 16, border: '1px solid rgba(30,64,175,0.12)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 20, fontWeight: 700, color: '#0A1628', margin: 0, lineHeight: 1.4 }}>
              {q.question}
            </p>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {q.options.map((opt, idx) => {
              let bg = 'white', border = '1.5px solid #E5E7EB', color = '#0A1628';
              if (selected !== null) {
                if (idx === q.correct) { bg = '#ECFDF5'; border = '2px solid #10B981'; color = '#065F46'; }
                else if (idx === selected && idx !== q.correct) { bg = '#FEF2F2'; border = '2px solid #EF4444'; color = '#991B1B'; }
              }
              return (
                <button key={idx} onClick={() => handleSelect(idx)} style={{
                  padding: '14px 18px', borderRadius: 12, border, background: bg, color,
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, textAlign: 'left', cursor: selected !== null ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s',
                }}>
                  <span style={{ width: 26, height: 26, borderRadius: '50%', background: selected !== null && idx === q.correct ? '#10B981' : selected === idx && idx !== q.correct ? '#EF4444' : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: selected !== null && (idx === q.correct || idx === selected) ? 'white' : '#6B7280', flexShrink: 0 }}>
                    {selected !== null && idx === q.correct ? '✓' : selected === idx && idx !== q.correct ? '✗' : String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Hint on reveal */}
          {selected !== null && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 12, padding: '12px 16px', marginBottom: 14 }}>
              <span style={{ fontSize: 13, color: '#92400E', fontWeight: 600 }}>💡 Vedic Trick: </span>
              <span style={{ fontSize: 13, color: '#92400E' }}>{q.hint}</span>
            </motion.div>
          )}

          {showNext && (
            <button onClick={handleNext} style={{
              width: '100%', height: 48, background: '#0A1628', color: 'white', border: 'none',
              borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}>
              {current + 1 >= questions.length ? 'See My Results →' : 'Next Question →'}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── PHASE 3: Results screen ───────────────────────────────────────────────
function ResultsScreen({ score, total, subject, difficulty, onRetry }) {
  const navigate = useNavigate();
  const pct = Math.round((score / total) * 100);
  const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '💪' : pct >= 40 ? '📚' : '🌱';
  const msg = pct >= 80 ? 'Outstanding! You have a natural talent for this.'
    : pct >= 60 ? 'Great effort! A little practice and you\'ll be unstoppable.'
    : pct >= 40 ? 'Good start! The full platform will build this fast.'
    : 'Everyone starts somewhere. The platform is designed exactly for this.';

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px', textAlign: 'center' }}>
      {pct >= 80 && <Confetti />}

      <div style={{ fontSize: 64, marginBottom: 8 }}>{emoji}</div>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, color: '#0A1628', margin: '0 0 6px' }}>
        {score}/{total} Correct
      </h2>
      <div style={{ fontSize: 48, fontWeight: 900, color: pct >= 60 ? '#10B981' : '#F59E0B', margin: '0 0 10px' }}>
        {pct}%
      </div>
      <p style={{ color: '#6B7280', fontSize: 15, margin: '0 0 24px', maxWidth: 380, marginLeft: 'auto', marginRight: 'auto' }}>
        {msg}
      </p>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, justifyContent: 'center' }}>
        {[
          { label: 'Subject', value: SUBJECT_EMOJI[subject] + ' ' + subject },
          { label: 'Difficulty', value: difficulty === 'All' ? 'Mixed' : difficulty },
          { label: 'Questions', value: `${total} attempted` },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: '#F9FAFB', borderRadius: 12, padding: '12px 8px', border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0A1628' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Platform teaser */}
      <div style={{ background: 'linear-gradient(135deg, #0A1628, #1E3A8A)', borderRadius: 16, padding: '20px', marginBottom: 20, color: 'white', textAlign: 'left' }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>🚀 This was just a glimpse</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: 12 }}>
          The full VedicMindAI platform has <strong style={{ color: 'white' }}>1,400+ questions</strong> across 40 Vedic Maths lessons, Reasoning, Aptitude, and Vedic Science — with an AI tutor that explains every answer.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['🧮 40 Vedic Maths Lessons', '🧠 Reasoning Track', '📊 Aptitude Track', '🔬 Vedic Science', '⚡ Daily Quiz', '🤖 AI Tutor'].map(f => (
            <span key={f} style={{ fontSize: 11, background: 'rgba(255,255,255,0.12)', borderRadius: 100, padding: '3px 10px', color: 'rgba(255,255,255,0.85)' }}>{f}</span>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={() => navigate('/auth')} style={{
          height: 52, background: '#0A1628', color: 'white', border: 'none', borderRadius: 14,
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, cursor: 'pointer',
        }}>
          Start Learning Free →
        </button>
        <a href="https://play.google.com/store/apps/details?id=in.vedicmindai.app" target="_blank" rel="noopener noreferrer"
          style={{ height: 52, background: '#10B981', color: 'white', border: 'none', borderRadius: 14, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}>
          📲 Get it on Google Play
        </a>
        <button onClick={onRetry} style={{
          height: 44, background: 'white', color: '#0A1628', border: '1.5px solid #E5E7EB', borderRadius: 12,
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer',
        }}>
          Try Again with Different Settings
        </button>
      </div>

      <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 16 }}>
        Free plan available · No credit card needed · 1,400+ questions waiting
      </p>
    </div>
  );
}

// ── MAIN DEMO PAGE ────────────────────────────────────────────────────────
export default function DemoPage() {
  useCanonical('/demo');
  const [phase, setPhase] = useState('setup'); // setup | quiz | results
  const [config, setConfig] = useState({ subject: 'Mixed', difficulty: 'All', count: 10 });
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState({ score: 0, total: 0 });

  function handleStart(subject, difficulty, count) {
    const qs = pickDemoQuestions(subject, difficulty, count);
    if (qs.length === 0) {
      alert('No questions match that combination. Try a different subject or difficulty.');
      return;
    }
    setConfig({ subject, difficulty, count });
    setQuestions(qs);
    setPhase('quiz');
  }

  function handleFinish(score, total) {
    setResult({ score, total });
    setPhase('results');
  }

  function handleRetry() {
    setPhase('setup');
    setQuestions([]);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <LandingNavbar />
      <div style={{ paddingTop: 24, paddingBottom: 48 }}>
        {phase === 'setup' && <SetupScreen onStart={handleStart} />}
        {phase === 'quiz' && <QuizScreen questions={questions} onFinish={handleFinish} />}
        {phase === 'results' && (
          <ResultsScreen
            score={result.score} total={result.total}
            subject={config.subject} difficulty={config.difficulty}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  );
}
