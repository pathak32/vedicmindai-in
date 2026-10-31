import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import {
  getWeekId, getWeeklyExamStatus, getDaysUntilSunday,
  getSecondsUntilSunday10AM, getSecondsUntil10AM,
  formatCountdown, formatMMSS, getThisWeekResult,
  saveExamResult, getClassGroup, getClassGroupLabel, getGradeForGroup,
  buildWeeklyExam, scoreExam, loadAttempt, saveAttempt, clearAttempt,
  EXAM_QUESTION_COUNT, EXAM_TIME_SECONDS, EXAM_SECONDS_PER_Q, EXAM_MAX_SCORE,
} from '@/lib/weeklyExamEngine';
import { tx, optLabel } from '@/lib/bilingual';
import { getSupabase } from '@/lib/supabaseClient';
import { saveUserProgress } from '@/lib/supabaseDataService';
import { useLanguage } from '@/lib/LanguageContext';

const glass = {
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(30,64,175,0.15)',
  borderRadius: 16,
};

const GROUPS = ['junior', 'middle', 'senior', 'higher', 'open'];

// ─── Upcoming / Today Waiting State ──────────────────────────────────────────

function UpcomingState({
  classGroup, setClassGroup, status, weeklyHistory }) {
  const { t } = useLanguage();
  const isWaiting = status === 'today_waiting';
  const [seconds, setSeconds] = useState(
    isWaiting ? getSecondsUntil10AM() : getSecondsUntilSunday10AM()
  );
  const [showGroupPicker, setShowGroupPicker] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleGroupChange = (g) => {
    setClassGroup(g);
    setShowGroupPicker(false);
    const profile = JSON.parse(localStorage.getItem('vedicmind_profile') || '{}');
    profile.grade = getGradeForGroup(g);
    localStorage.setItem('vedicmind_profile', JSON.stringify(profile));
    showToast(`Exam group updated to ${getClassGroupLabel(g)}`);
  };

  const handleReminder = () => {
    localStorage.setItem('weeklyReminder', 'true');
    showToast('Reminder set for Sunday 10 AM 🔔');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <DashboardNavbar />
      <main style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px' }}>

        {/* Class Group Selector */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Your Exam Group
          </div>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => setShowGroupPicker(p => !p)}
              style={{
                background: '#0A1628', color: 'white', border: 'none',
                borderRadius: 99, padding: '6px 16px',
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {getClassGroupLabel(classGroup)} ✏️
            </button>
            {showGroupPicker && (
              <div style={{
                position: 'absolute', top: 40, left: 0, zIndex: 50,
                background: 'white', borderRadius: 12, padding: 8,
                boxShadow: '0 8px 32px rgba(10,22,40,0.15)',
                border: '1px solid rgba(30,64,175,0.12)',
                minWidth: 220,
              }}>
                {GROUPS.map(g => (
                  <button
                    key={g}
                    onClick={() => handleGroupChange(g)}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '10px 14px', border: 'none', borderRadius: 8,
                      background: g === classGroup ? '#F0F4FF' : 'transparent',
                      fontFamily: 'var(--font-body)', fontSize: 13,
                      color: g === classGroup ? '#0A1628' : '#4B5563',
                      cursor: 'pointer', fontWeight: g === classGroup ? 600 : 400,
                    }}
                  >
                    {getClassGroupLabel(g)}
                    {g === classGroup && ' ✓'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hero Card */}
        <div style={{ ...glass, padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{isWaiting ? '⏳' : '🏆'}</div>
          <h1 className="font-heading" style={{ fontSize: 28, fontWeight: 700, color: '#0A1628', margin: '0 0 6px' }}>
            {isWaiting ? 'Exam Starts Today!' : 'Weekly Vedic Maths Exam'}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', margin: '0 0 24px' }}>
            {isWaiting ? 'Stay ready — drops at 10:00 AM sharp' : 'Every Sunday at 10:00 AM'}
          </p>

          {/* Countdown */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              {isWaiting ? 'Starts in' : 'Next exam in'}
            </div>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700,
              color: isWaiting ? '#EF4444' : '#0A1628',
              background: '#F0F4FF', borderRadius: 12,
              padding: '12px 24px', display: 'inline-block',
            }}>
              {formatCountdown(seconds)}
            </span>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(30,64,175,0.12)', margin: '0 0 20px' }} />

          {/* Info Pills */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            {['📝 30 Questions', '⏱ 60 Minutes',
              isWaiting ? '🔴 Today' : `🎯 ${getClassGroupLabel(classGroup)}`
            ].map(p => (
              <span key={p} style={{
                background: '#F0F4FF', border: '1px solid rgba(30,64,175,0.15)',
                borderRadius: 99, padding: '6px 14px',
                fontFamily: 'var(--font-body)', fontSize: 12, color: '#0A1628',
              }}>{p}</span>
            ))}
          </div>

          {/* CTA Button */}
          {isWaiting ? (
            <button disabled style={{
              width: 220, height: 44, background: '#9CA3AF', color: 'white',
              border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)',
              fontSize: 14, fontWeight: 500, cursor: 'not-allowed',
            }}>
              Opens at 10:00 AM
            </button>
          ) : (
            <button onClick={handleReminder} style={{
              width: 220, height: 44, background: 'transparent',
              border: '1.5px solid #0A1628', color: '#0A1628',
              borderRadius: 12, fontFamily: 'var(--font-body)',
              fontSize: 14, fontWeight: 500, cursor: 'pointer',
            }}>
              Notify Me on Sunday 🔔
            </button>
          )}
        </div>

        {/* Previous Results */}
        <div style={{ marginTop: 32 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: '#0A1628', marginBottom: 12 }}>
            Your History
          </div>
          {weeklyHistory.length > 0 ? (
            weeklyHistory.slice(-3).reverse().map((entry, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: 8, padding: '10px 14px',
                marginBottom: 8, display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', flexWrap: 'wrap', gap: 8,
                border: '1px solid rgba(30,64,175,0.08)',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#4B5563' }}>{entry.weekId}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#0A1628' }}>{getClassGroupLabel(entry.classGroup)}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: '#0A1628' }}>{entry.score}/{entry.totalPossible}</span>
                {entry.rank && <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#10B981' }}>Rank #{entry.rank}</span>}
              </div>
            ))
          ) : (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', textAlign: 'center', fontStyle: 'italic' }}>
              No exams taken yet. Your first one is on Sunday!
            </p>
          )}
        </div>
      </main>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          background: '#0A1628', color: 'white', borderRadius: 12,
          padding: '12px 24px', fontFamily: 'var(--font-body)', fontSize: 14,
          fontWeight: 500, zIndex: 9999, boxShadow: '0 4px 20px rgba(10,22,40,0.3)',
          whiteSpace: 'nowrap', maxWidth: '90vw', textAlign: 'center',
        }}>{toast}</div>
      )}
    </div>
  );
}

// ─── Completed State ──────────────────────────────────────────────────────────

function CompletedState({ result, classGroup }) {
  const navigate = useNavigate();
  const { user, loading } = useVedicAuth();
  const daysLeft = getDaysUntilSunday();
  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <DashboardNavbar />
      <main style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ ...glass, padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <h1 className="font-heading" style={{ fontSize: 24, fontWeight: 700, color: '#0A1628', margin: '0 0 12px' }}>
            Exam Complete This Week!
          </h1>
          <div className="font-heading" style={{ fontSize: 44, fontWeight: 700, color: '#0A1628', lineHeight: 1 }}>
            {result.score}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: '#4B5563', marginBottom: 4 }}>
            / {result.totalPossible}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Your Score
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', marginBottom: result.rank ? 8 : 16 }}>
            Group: {getClassGroupLabel(result.classGroup || classGroup)}
          </div>
          {result.rank && (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: '#10B981', marginBottom: 16 }}>
              🏆 Rank #{result.rank} in your group this week
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/weekly-exam/results')}
              style={{
                flex: 1, minWidth: 140, height: 44, background: '#0A1628', color: 'white',
                border: 'none', borderRadius: 12,
                fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
              }}
            >
              View My Answers →
            </button>
            <button
              onClick={() => navigate('/leaderboard')}
              style={{
                flex: 1, minWidth: 140, height: 44, background: 'transparent',
                border: '1.5px solid #0A1628', color: '#0A1628', borderRadius: 12,
                fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
              }}
            >
              View Leaderboard →
            </button>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563' }}>
            Next exam in {daysLeft} days
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Exam Interface (Live State) ──────────────────────────────────────────────

const TYPE_TINT = {
  vedic: { background: '#EFF6FF', color: '#1D4ED8' },
  reasoning: { background: '#F5F3FF', color: '#6D28D9' },
  aptitude: { background: '#FFF7ED', color: '#C2410C' },
};

// testMode (admin only, /weekly-exam?test=1) runs the exam any day and saves nothing.
function ExamInterface({ classGroup, testMode = false }) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const weekId = testMode ? `test-${getWeekId()}` : getWeekId();

  const [questions, setQuestions] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(EXAM_QUESTION_COUNT).fill(null));
  const [globalTime, setGlobalTime] = useState(EXAM_TIME_SECONDS);
  const [perQTime, setPerQTime] = useState(EXAM_SECONDS_PER_Q);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // The timer and the submit handler run long after the first render, so they read these refs.
  const questionsRef = useRef(null);
  const answersRef = useRef(answers);
  const startedAtRef = useRef(Date.now());
  const questionShownAtRef = useRef(Date.now());
  const submittedRef = useRef(false);

  // Start the exam, or resume the one already started this week (answers and clock survive a refresh).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const saved = loadAttempt(weekId, classGroup);
        const qs = saved?.questions || await buildWeeklyExam(classGroup, weekId);
        if (cancelled) return;
        if (saved) {
          startedAtRef.current = saved.startedAt;
          answersRef.current = saved.answers;
          setAnswers(saved.answers);
          const firstOpen = saved.answers.findIndex(a => a === null);
          setCurrent(firstOpen === -1 ? qs.length - 1 : firstOpen);
        } else {
          startedAtRef.current = Date.now();
          saveAttempt({ weekId, classGroup, startedAt: startedAtRef.current, questions: qs, answers: answersRef.current });
        }
        questionsRef.current = qs;
        setQuestions(qs);
      } catch (e) {
        console.error('Weekly exam load failed:', e);
        if (!cancelled) setLoadError(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = () => {
    if (submittedRef.current || !questionsRef.current) return;
    submittedRef.current = true;
    const qs = questionsRef.current;
    const { score, details } = scoreExam(qs, answersRef.current);
    if (testMode) {
      clearAttempt();
      window.alert(`Test exam finished: ${score} / ${EXAM_MAX_SCORE}. Nothing was saved.`);
      navigate('/weekly-exam');
      return;
    }
    const result = {
      weekId,
      classGroup,
      score,
      totalPossible: EXAM_MAX_SCORE,
      timeTaken: Math.min(EXAM_TIME_SECONDS, Math.round((Date.now() - startedAtRef.current) / 1000)),
      answers: details,
      questions: qs,
      completedAt: new Date().toISOString(),
      rank: null,
    };

    saveExamResult(result);
    clearAttempt();

    // Also save to Supabase
    (async () => {
      try {
        const supabase = await getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          const weekStartStr = weekStart.getFullYear() + '-' + String(weekStart.getMonth() + 1).padStart(2, '0') + '-' + String(weekStart.getDate()).padStart(2, '0');
          const payload = {
            user_id: session.user.id,
            week_start: weekStartStr,
            score: result.score,
            total_possible: result.totalPossible,
            answers: result.answers,
          };
          // Select-then-write works whether or not the table has a unique key on (user_id, week_start).
          const { data: existing } = await supabase.from('weekly_exam_results').select('id')
            .eq('user_id', session.user.id).eq('week_start', weekStartStr).maybeSingle();
          const { error } = existing
            ? await supabase.from('weekly_exam_results').update(payload).eq('id', existing.id)
            : await supabase.from('weekly_exam_results').insert(payload);
          if (error) console.warn('Weekly exam Supabase save failed:', error);
        }
      } catch (e) { console.warn('Weekly exam Supabase save failed:', e); }
    })();

    navigate('/weekly-exam/results');
  };

  // The clock counts down to a fixed end time; at zero the answers given so far are submitted.
  useEffect(() => {
    if (!questions) return undefined;
    const tick = () => {
      const left = Math.max(0, EXAM_TIME_SECONDS - Math.floor((Date.now() - startedAtRef.current) / 1000));
      setGlobalTime(left);
      if (left <= 0) handleSubmit();
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [questions]);

  // Per-question timer (visual only)
  useEffect(() => {
    setPerQTime(EXAM_SECONDS_PER_Q);
    questionShownAtRef.current = Date.now();
    const timer = setInterval(() => setPerQTime(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(timer);
  }, [current]);

  const handleSelect = (idx) => {
    if (answersRef.current[current]) return; // locked once answered
    const timeTaken = Math.floor((Date.now() - questionShownAtRef.current) / 1000);
    const newAnswers = [...answersRef.current];
    newAnswers[current] = { selectedOption: idx, timeTaken };
    answersRef.current = newAnswers;
    setAnswers(newAnswers);
    saveAttempt({ weekId, classGroup, startedAt: startedAtRef.current, questions: questionsRef.current, answers: newAnswers });

    // Move on shortly after answering. Right or wrong is not shown until the exam is submitted.
    const from = current;
    setTimeout(() => {
      setCurrent(c => (c === from && c < EXAM_QUESTION_COUNT - 1 ? c + 1 : c));
    }, 500);
  };

  if (loadError) {
    return (
      <div style={{ minHeight: '100vh', background: '#F0F4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-body)', color: '#4B5563', marginBottom: 16 }}>The exam could not be loaded. Please refresh.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 24px', background: '#0A1628', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer' }}>Refresh</button>
        </div>
      </div>
    );
  }
  if (!questions) return <div style={{ minHeight: '100vh', background: '#F0F4FF' }} />;

  const last = questions.length - 1;
  const answeredCount = answers.filter(a => a !== null).length;
  const q = questions[current];
  const timerColor = globalTime <= 60 ? '#EF4444' : globalTime <= 300 ? '#F59E0B' : '#0A1628';
  const perQPct = (perQTime / EXAM_SECONDS_PER_Q) * 100;
  const perQColor = perQTime < 10 ? '#EF4444' : perQTime < 30 ? '#F59E0B' : '#3B82F6';
  const LABELS = ['A', 'B', 'C', 'D'];
  const chosen = answers[current]?.selectedOption;

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF', paddingBottom: 80 }}>
      {/* Sticky Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50, background: 'white',
        borderBottom: '1px solid rgba(30,64,175,0.12)',
        boxShadow: '0 2px 8px rgba(10,22,40,0.06)',
        height: 56, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 16px',
      }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#0A1628' }}>
          {t('weeklyExam')}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#4B5563' }}>
          Q{current + 1} / {questions.length}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color: timerColor,
          ...(globalTime <= 60 ? { background: '#FEF2F2', borderRadius: 6, padding: '2px 8px' } : {}),
        }}>
          {formatMMSS(globalTime)}
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ height: 4, background: '#E5E7EB' }}>
        <div style={{
          height: '100%', background: '#3B82F6',
          width: `${(answeredCount / questions.length) * 100}%`,
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Question Card */}
      <div style={{ maxWidth: 640, margin: '16px auto', padding: '0 16px' }}>
        <div style={{ ...glass, padding: 20 }}>
          {/* Top row badges */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              background: '#0A1628', color: 'white',
              fontFamily: 'var(--font-mono)', fontSize: 11,
              borderRadius: 6, padding: '3px 8px',
            }}>Q{current + 1}</span>
            <span style={{
              ...(TYPE_TINT[q.type] || TYPE_TINT.vedic),
              fontFamily: 'var(--font-body)', fontSize: 10,
              borderRadius: 99, padding: '2px 10px', flex: 1, textAlign: 'center',
            }}>{tx(q.topic, language)}</span>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: 10, borderRadius: 99, padding: '2px 10px',
              ...(q.difficulty === 'easy'
                ? { background: '#ECFDF5', color: '#065F46' }
                : q.difficulty === 'medium'
                ? { background: '#FFFBEB', color: '#92400E' }
                : { background: '#FEF2F2', color: '#991B1B' }),
            }}>{q.difficulty}</span>
          </div>

          {/* Per-question timer bar */}
          <div style={{ height: 3, background: '#E5E7EB', borderRadius: 99, marginBottom: 14, overflow: 'hidden' }}>
            <div style={{
              height: '100%', background: perQColor,
              width: `${perQPct}%`,
              transition: 'width 1s linear, background 0.3s',
            }} />
          </div>

          {/* Question text */}
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 500, color: '#0A1628', lineHeight: 1.6, margin: '0 0 16px', whiteSpace: 'pre-line' }}>
            {tx(q.q, language)}
          </p>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.options.map((opt, i) => {
              const picked = chosen === i;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  style={{
                    border: picked ? '2px solid #0A1628' : '1.5px solid rgba(30,64,175,0.12)',
                    borderRadius: 12, padding: '14px 16px',
                    background: picked ? '#F0F4FF' : 'white', minHeight: 52,
                    display: 'flex', alignItems: 'center', gap: 12,
                    cursor: answers[current] ? 'default' : 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left', width: '100%',
                  }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: picked ? '#0A1628' : '#F0F4FF', color: picked ? 'white' : '#0A1628',
                    fontFamily: 'var(--font-mono)', fontSize: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all 0.15s',
                  }}>{LABELS[i]}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#0A1628' }}>{optLabel(opt, language)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Nav */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 16, gap: 16,
        }}>
          <button
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
            style={{
              height: 44, minWidth: 80, background: 'transparent',
              border: '1.5px solid rgba(30,64,175,0.2)', borderRadius: 12,
              fontFamily: 'var(--font-body)', fontSize: 14, cursor: current === 0 ? 'default' : 'pointer',
              opacity: current === 0 ? 0.4 : 1, color: '#0A1628',
            }}
          >← Prev</button>

          {/* Dots */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            {questions.map((_, i) => (
              <div key={i} onClick={() => setCurrent(i)}
                style={{
                  width: i === current ? 10 : 8,
                  height: i === current ? 10 : 8,
                  borderRadius: '50%', cursor: 'pointer',
                  background: answers[i] !== null ? '#3B82F6' : i === current ? '#0A1628' : '#E5E7EB',
                  transition: 'all 0.15s',
                }} />
            ))}
          </div>

          <button
            onClick={() => current === last ? setShowSubmitModal(true) : setCurrent(c => c + 1)}
            style={{
              height: 44, minWidth: 80, background: '#0A1628', color: 'white',
              border: 'none', borderRadius: 12,
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
            }}
          >
            {current === last ? 'Submit Exam' : 'Next →'}
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <button onClick={() => setShowSubmitModal(true)} style={{ background: 'none', border: 'none', color: '#3B82F6', fontFamily: 'var(--font-body)', fontSize: 13, cursor: 'pointer' }}>
            Submit exam
          </button>
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: 16,
        }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 24, maxWidth: 320, width: '100%' }}>
            <h2 className="font-heading" style={{ fontSize: 20, fontWeight: 700, color: '#0A1628', marginBottom: 12 }}>
              Submit Your Exam?
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', marginBottom: 4 }}>
              Answered: {answeredCount} / {questions.length} questions
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', marginBottom: answeredCount < questions.length ? 8 : 16 }}>
              Unanswered: {questions.length - answeredCount} questions
            </p>
            {answeredCount < questions.length && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#F59E0B', marginBottom: 16 }}>
                ⚠️ {questions.length - answeredCount} questions will be marked wrong
              </p>
            )}
            <button
              onClick={() => handleSubmit()}
              style={{
                width: '100%', height: 44, background: '#0A1628', color: 'white',
                border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)',
                fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 8,
              }}
            >Submit Now</button>
            <button
              onClick={() => setShowSubmitModal(false)}
              style={{
                width: '100%', height: 44, background: 'transparent',
                border: '1.5px solid rgba(30,64,175,0.2)', color: '#0A1628',
                borderRadius: 12, fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer',
              }}
            >Go Back</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WeeklyExamPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, loading } = useVedicAuth();
  const profile = JSON.parse(localStorage.getItem('vedicmind_profile') || '{}');
  const [classGroup, setClassGroup] = useState(getClassGroup(profile.grade));
  const [status, setStatus] = useState(getWeeklyExamStatus());

  useEffect(() => {
    if (!loading && !user) { navigate('/auth'); return; }
  }, []);

  // Re-check status every 30s
  useEffect(() => {
    const t = setInterval(() => setStatus(getWeeklyExamStatus()), 30000);
    return () => clearInterval(t);
  }, []);

  const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
  const weeklyHistory = progress.weeklyExamHistory || [];

  const adminTest = new URLSearchParams(window.location.search).get('test') === '1' && user?.app_metadata?.role === 'admin';
  if (adminTest) return <ExamInterface classGroup={classGroup} testMode />;
  if (status === 'live') return <ExamInterface classGroup={classGroup} />;
  if (status === 'completed') {
    const result = getThisWeekResult();
    return <CompletedState result={result} classGroup={classGroup} />;
  }
  return (
    <UpcomingState
      classGroup={classGroup}
      setClassGroup={setClassGroup}
      status={status}
      weeklyHistory={weeklyHistory}
    />
  );
}