import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { getClassGroup, CLASS_GROUPS, TOPICS, getQuestions } from '@/lib/aptitudeQuestions';

const TIMER_SEC = 90;
const glass = {
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(30,64,175,0.15)',
  boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
  borderRadius: 16,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function saveAptitudeScore(group, score, sutras) {
  const progress = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_progress') || '{}'); } catch { return {}; } })();
  if (!progress.aptitudeHistory) progress.aptitudeHistory = [];
  progress.aptitudeHistory.push({ date: new Date().toISOString(), group, score, sutras });
  // Update best aptitude score for leaderboard
  progress.aptitudeScore = Math.max(progress.aptitudeScore || 0, score);
  localStorage.setItem('vedicmind_progress', JSON.stringify(progress));
}

// ─── Class Selector Screen ────────────────────────────────────────────────────

function ClassSelector({ onSelect }) {
  const [selectedClass, setSelectedClass] = useState(null);

  const handleConfirm = () => {
    if (!selectedClass) return;
    const profile = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_profile') || '{}'); } catch { return {}; } })();
    profile.aptitudeClass = selectedClass;
    localStorage.setItem('vedicmind_profile', JSON.stringify(profile));
    onSelect(selectedClass);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
        <h2 className="font-heading" style={{ fontSize: 28, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>
          Select Your Class
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#4B5563', margin: 0 }}>
          Questions will be filtered to match your level
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
        {[...Array(12)].map((_, i) => {
          const cls = i + 1;
          const group = getClassGroup(cls);
          const meta = CLASS_GROUPS[group];
          const active = selectedClass === cls;
          return (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              style={{
                minHeight: 64, borderRadius: 12, border: active ? `2px solid ${meta.color}` : '1px solid rgba(30,64,175,0.15)',
                background: active ? meta.bg : 'white', color: active ? meta.color : '#4B5563',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 20,
                cursor: 'pointer', transition: 'all 0.15s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
              }}
            >
              <span>{cls}</span>
              <span style={{ fontSize: 9, fontWeight: 400, opacity: 0.7, letterSpacing: '0.04em' }}>CLASS</span>
            </button>
          );
        })}
      </div>

      {selectedClass && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          {(() => {
            const group = getClassGroup(selectedClass);
            const meta = CLASS_GROUPS[group];
            return (
              <div style={{ ...glass, padding: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🎓</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, color: '#0A1628' }}>
                    Class {selectedClass} — {meta.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563' }}>
                    Topics: {TOPICS[group].join(', ')}
                  </div>
                </div>
              </div>
            );
          })()}
          <button
            onClick={handleConfirm}
            style={{
              width: '100%', minHeight: 52, background: '#0A1628', color: 'white',
              border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)',
              fontWeight: 700, fontSize: 16, cursor: 'pointer',
            }}
          >
            Start Aptitude Zone →
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Topic Selector ───────────────────────────────────────────────────────────

function TopicSelector({ classNum, onStart, onChangeClass }) {
  const group = getClassGroup(classNum);
  const meta = CLASS_GROUPS[group];
  const topics = TOPICS[group];
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: 560, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ ...glass, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🎓</div>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: '#0A1628' }}>Class {classNum}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: meta.color }}>{meta.label}</div>
          </div>
        </div>
        <button onClick={onChangeClass} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, color: '#3B82F6', fontWeight: 600 }}>
          Change Class
        </button>
      </div>

      <h3 className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 16 }}>
        Choose a Topic
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {/* All Topics option */}
        <button
          onClick={() => setSelectedTopic('all')}
          style={{
            minHeight: 56, padding: '0 20px', borderRadius: 12,
            border: selectedTopic === 'all' ? `2px solid ${meta.color}` : '1px solid rgba(30,64,175,0.15)',
            background: selectedTopic === 'all' ? meta.bg : 'white',
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 22 }}>🎲</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, color: '#0A1628' }}>Mixed — All Topics</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563' }}>Random questions across all topics</div>
          </div>
        </button>

        {topics.map(topic => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            style={{
              minHeight: 52, padding: '0 20px', borderRadius: 12,
              border: selectedTopic === topic ? `2px solid ${meta.color}` : '1px solid rgba(30,64,175,0.15)',
              background: selectedTopic === topic ? meta.bg : 'white',
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 18 }}>📚</span>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, color: '#0A1628' }}>{topic}</div>
          </button>
        ))}
      </div>

      {selectedTopic && (
        <button
          onClick={() => onStart(selectedTopic === 'all' ? null : selectedTopic)}
          style={{
            width: '100%', minHeight: 52, background: '#0A1628', color: 'white',
            border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)',
            fontWeight: 700, fontSize: 16, cursor: 'pointer',
          }}
        >
          Start Quiz →
        </button>
      )}
    </motion.div>
  );
}

// ─── Circular Timer ───────────────────────────────────────────────────────────

function CircularTimer({ fraction, seconds }) {
  const R = 26, CX = 34, CY = 34, SW = 5;
  const circ = 2 * Math.PI * R;
  const dashOffset = circ * (1 - fraction);
  const color = seconds <= 15 ? '#EF4444' : seconds <= 30 ? '#F59E0B' : '#3B82F6';
  return (
    <svg width={68} height={68} style={{ flexShrink: 0 }}>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(30,64,175,0.1)" strokeWidth={SW} />
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={color} strokeWidth={SW} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${CX} ${CY})`}
        style={{ transition: 'stroke 0.3s' }} />
      <text x={CX} y={CY + 6} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={15} fontWeight={700} fill={color}>
        {seconds}
      </text>
    </svg>
  );
}

// ─── Quiz Screen ──────────────────────────────────────────────────────────────

function QuizScreen({ questions, group, onComplete }) {
  const [qIndex, setQIndex] = useState(0);
  const [fraction, setFraction] = useState(1);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [sutras, setSutras] = useState(new Set());
  const answersRef = useRef([]);
  const startMsRef = useRef(null);
  const rafRef = useRef(null);
  const nextRef = useRef(null);

  const meta = CLASS_GROUPS[group];
  const q = questions[qIndex];
  const isLast = qIndex === questions.length - 1;
  const secondsLeft = Math.max(0, Math.ceil(fraction * TIMER_SEC));

  const startTimer = useCallback(() => {
    startMsRef.current = performance.now();
    const tick = (now) => {
      const elapsed = (now - startMsRef.current) / 1000;
      const f = Math.max(0, 1 - elapsed / TIMER_SEC);
      setFraction(f);
      if (f <= 0) { handleTimeout(); return; }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [qIndex]);

  useEffect(() => {
    setAnswered(false);
    setSelected(null);
    setFraction(1);
    startTimer();
    return () => { cancelAnimationFrame(rafRef.current); clearTimeout(nextRef.current); };
  }, [qIndex]);

  function handleTimeout() {
    cancelAnimationFrame(rafRef.current);
    setFraction(0); setAnswered(true); setSelected(-1);
    answersRef.current.push({ correct: false, pts: 0 });
    nextRef.current = setTimeout(advance, 1200);
  }

  function handleSelect(idx) {
    if (answered) return;
    cancelAnimationFrame(rafRef.current);
    const correct = idx === q.correct;
    const pts = correct ? 4 : -1;
    setSelected(idx); setAnswered(true);
    if (correct) {
      setTotalScore(s => s + 4);
      setSutras(prev => new Set([...prev, q.vedic_sutra]));
    } else {
      setTotalScore(s => Math.max(0, s - 1));
    }
    answersRef.current.push({ correct, pts });
    nextRef.current = setTimeout(advance, 1400);
  }

  function advance() {
    if (isLast) {
      const finalScore = totalScore + (answersRef.current.filter(a => a.correct).length === questions.length ? 10 : 0);
      onComplete(finalScore, Array.from(sutras));
    } else {
      setQIndex(i => i + 1);
    }
  }

  const LETTERS = ['A', 'B', 'C', 'D'];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: '#4B5563' }}>
            Q{qIndex + 1} <span style={{ color: '#9CA3AF' }}>of {questions.length}</span>
          </span>
          <span style={{ marginLeft: 12, fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: '#F59E0B' }}>
            ⭐ {totalScore} pts
          </span>
        </div>
        <CircularTimer fraction={fraction} seconds={secondsLeft} />
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {questions.map((_, i) => {
          const ans = answersRef.current[i];
          const bg = i < qIndex ? (ans?.correct ? '#10B981' : '#EF4444') : i === qIndex ? meta.color : 'rgba(30,64,175,0.12)';
          return <div key={i} style={{ flex: 1, height: 4, borderRadius: 100, background: bg, transition: 'background 0.3s' }} />;
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={qIndex} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.2 }}>
          {/* Topic badge */}
          <div style={{ marginBottom: 10 }}>
            <span style={{ background: meta.bg, color: meta.color, borderRadius: 100, padding: '4px 12px', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600 }}>
              {q.topic}
            </span>
          </div>

          {/* Question */}
          <div style={{ ...glass, padding: 20, marginBottom: 14 }}>
            <p className="font-heading" style={{ fontSize: 'clamp(16px,3vw,20px)', fontWeight: 700, color: '#0A1628', lineHeight: 1.45, margin: 0 }}>
              {q.question}
            </p>
          </div>

          {/* Options */}
          {q.options.map((opt, idx) => {
            let bg = 'white';
            let border = '1.5px solid rgba(30,64,175,0.15)';
            let color = '#0A1628';
            if (answered) {
              if (idx === q.correct) { bg = '#D1FAE5'; border = '1.5px solid #10B981'; }
              else if (idx === selected) { bg = '#FEE2E2'; border = '1.5px solid #EF4444'; color = '#6B7280'; }
              else { color = '#9CA3AF'; }
            }
            return (
              <button key={idx} onClick={() => handleSelect(idx)} style={{
                width: '100%', minHeight: 52, padding: '12px 16px', marginBottom: 8,
                borderRadius: 12, border, background: bg, color,
                fontFamily: 'var(--font-body)', fontSize: 15,
                textAlign: 'left', cursor: answered ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#9CA3AF', minWidth: 18 }}>{LETTERS[idx]}.</span>
                <span>{opt}</span>
                {answered && idx === q.correct && <span style={{ marginLeft: 'auto', color: '#10B981', fontSize: 18 }}>✓</span>}
                {answered && idx === selected && idx !== q.correct && <span style={{ marginLeft: 'auto', color: '#EF4444', fontSize: 18 }}>✗</span>}
              </button>
            );
          })}

          {/* Vedic tip */}
          {answered && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              style={{ ...glass, padding: '12px 16px', marginTop: 6 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: meta.color, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ⚡ Vedic Sutra Used
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 4 }}>
                {q.vedic_sutra}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', lineHeight: 1.6 }}>
                💡 {q.vedic_tip}
              </div>
            </motion.div>
          )}

          {selected === -1 && answered && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#F59E0B', marginTop: 8 }}>⏰ Time's up! Moving on...</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({ score, questions, sutras, group, onRetry, onHome }) {
  const meta = CLASS_GROUPS[group];
  const total = questions.length;
  const maxScore = total * 4;
  const accuracy = Math.round((score / maxScore) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: 520, margin: '0 auto' }}>

      {/* Score card */}
      <div style={{ ...glass, padding: 32, textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>{accuracy >= 70 ? '🎉' : accuracy >= 40 ? '📚' : '💪'}</div>
        <h2 className="font-heading" style={{ fontSize: 26, fontWeight: 700, color: '#0A1628', marginBottom: 16 }}>
          Quiz Complete!
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF', marginBottom: 4, textTransform: 'uppercase' }}>Score</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 800, color: '#0A1628', lineHeight: 1 }}>{score}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#9CA3AF' }}>/ {maxScore}</div>
          </div>
          <div style={{ width: 1, background: 'rgba(30,64,175,0.1)' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF', marginBottom: 4, textTransform: 'uppercase' }}>Accuracy</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 800, color: accuracy >= 70 ? '#10B981' : '#F59E0B', lineHeight: 1 }}>{accuracy}%</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ background: '#F0F4FF', borderRadius: 100, padding: '4px 12px', fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563' }}>
            +4 per correct
          </span>
          <span style={{ background: '#FEF2F2', borderRadius: 100, padding: '4px 12px', fontFamily: 'var(--font-body)', fontSize: 13, color: '#EF4444' }}>
            −1 per wrong
          </span>
        </div>
      </div>

      {/* Sutras practiced */}
      {sutras.length > 0 && (
        <div style={{ ...glass, padding: 20, marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: '#0A1628', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            ⚡ Vedic Sutras Practiced Today
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {sutras.map(s => (
              <span key={s} style={{ background: meta.bg, color: meta.color, borderRadius: 100, padding: '6px 14px', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600 }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onRetry} style={{
          flex: 1, minHeight: 48, background: '#0A1628', color: 'white',
          border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, cursor: 'pointer',
        }}>
          Try Again 🔄
        </button>
        <button onClick={onHome} style={{
          flex: 1, minHeight: 48, background: 'transparent',
          border: '1.5px solid rgba(30,64,175,0.2)', color: '#0A1628',
          borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, cursor: 'pointer',
        }}>
          Choose Topic
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AptitudeZonePage() {
  const navigate = useNavigate();

  const auth = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_auth')); } catch { return null; } })();
  const profile = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_profile') || '{}'); } catch { return {}; } })();

  const savedClass = profile.aptitudeClass;
  const [screen, setScreen] = useState(savedClass ? 'topic' : 'class'); // class | topic | quiz | results
  const [classNum, setClassNum] = useState(savedClass || null);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!auth) navigate('/auth');
  }, []);

  const handleClassSelect = (cls) => {
    setClassNum(cls);
    setScreen('topic');
  };

  const handleTopicStart = (topic) => {
    const group = getClassGroup(classNum);
    const qs = getQuestions(group, topic);
    setQuestions(qs);
    setScreen('quiz');
  };

  const handleComplete = (score, sutras) => {
    const group = getClassGroup(classNum);
    saveAptitudeScore(group, score, sutras);
    setResults({ score, sutras, questions });
    setScreen('results');
  };

  const group = classNum ? getClassGroup(classNum) : 'MIDDLE';
  const meta = CLASS_GROUPS[group];

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <DashboardNavbar />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px 60px' }}>

        {/* Page Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: classNum ? meta.bg : '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
              🎯
            </div>
            <div>
              <h1 className="font-heading" style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, color: '#0A1628', marginBottom: 4 }}>
                Aptitude Zone
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', margin: 0 }}>
                Class-wise MCQ practice · +4/−1 scoring · Vedic Sutra tips after every answer
              </p>
            </div>
          </div>
        </div>

        {/* Screens */}
        <AnimatePresence mode="wait">
          {screen === 'class' && (
            <motion.div key="class" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ClassSelector onSelect={handleClassSelect} />
            </motion.div>
          )}

          {screen === 'topic' && (
            <motion.div key="topic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TopicSelector
                classNum={classNum}
                onStart={handleTopicStart}
                onChangeClass={() => setScreen('class')}
              />
            </motion.div>
          )}

          {screen === 'quiz' && questions.length > 0 && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuizScreen
                questions={questions}
                group={group}
                onComplete={handleComplete}
              />
            </motion.div>
          )}

          {screen === 'results' && results && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ResultsScreen
                score={results.score}
                questions={results.questions}
                sutras={results.sutras}
                group={group}
                onRetry={() => { handleTopicStart(null); }}
                onHome={() => setScreen('topic')}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
