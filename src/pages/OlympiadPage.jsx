import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// base44 removed
import {
  getOlympiadLevel,
  getOlympiadLevelLabel,
  getOlympiadStatus,
  getNextOlympiadDate,
  formatOlympiadDate,
  getDaysUntil,
  getQuarterId,
  getCachedQuestions,
  setCachedQuestions,
  saveOlympiadResult,
} from '@/lib/olympiadEngine';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTodayStr() {
  const now = new Date();
  return (
    now.getFullYear() +
    '-' +
    String(now.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(now.getDate()).padStart(2, '0')
  );
}

const LEVEL_OPTIONS = [
  { value: 'junior', label: 'Junior (Class 1–7)' },
  { value: 'senior', label: 'Senior (Class 8–12)' },
  { value: 'open', label: 'Open (Adults)' },
];

const DARK_BG = { background: 'linear-gradient(135deg, #0A1628 0%, #0D2252 100%)', minHeight: '100vh' };

// ─── Countdown Clock ─────────────────────────────────────────────────────────

function useCountdown(targetHour) {
  const [str, setStr] = useState('');
  useEffect(() => {
    function calc() {
      const now = new Date();
      const target = new Date();
      target.setHours(targetHour, 0, 0, 0);
      const diff = Math.max(0, target - now);
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setStr(`${h}:${m}:${s}`);
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetHour]);
  return str;
}

// ─── Exam Timer ──────────────────────────────────────────────────────────────

function useExamTimer(running) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  return elapsed;
}

// ─── Level Selector ──────────────────────────────────────────────────────────

function LevelSelector({ level, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: '#F59E0B', color: '#0A1628',
          border: 'none', borderRadius: 99, padding: '8px 18px',
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        {getOlympiadLevelLabel(level)} ✏️
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '110%', left: 0, zIndex: 10,
          background: '#0D2252', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 12, overflow: 'hidden', minWidth: 200,
        }}>
          {LEVEL_OPTIONS.map(opt => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                padding: '12px 16px', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 14,
                color: level === opt.value ? '#F59E0B' : 'white',
                background: level === opt.value ? 'rgba(245,158,11,0.15)' : 'transparent',
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Rules Modal ─────────────────────────────────────────────────────────────

function RulesModal({ onStart }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{
        background: '#0D2252', border: '1px solid rgba(245,158,11,0.4)',
        borderRadius: 20, padding: 32, maxWidth: 400, width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <div className="font-heading" style={{ fontSize: 22, color: 'white', fontWeight: 700, marginBottom: 20 }}>
          Olympiad Rules
        </div>
        {[
          { icon: '✅', text: 'Correct answer: +5 points' },
          { icon: '❌', text: 'Wrong answer: −1 point' },
          { icon: '⬜', text: 'Unanswered: 0 points' },
        ].map(r => (
          <div key={r.text} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.06)', borderRadius: 10,
            padding: '10px 14px', marginBottom: 10, textAlign: 'left',
          }}>
            <span style={{ fontSize: 18 }}>{r.icon}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'white' }}>{r.text}</span>
          </div>
        ))}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '16px 0 20px' }}>
          Think carefully before answering!
        </p>
        <button
          onClick={onStart}
          style={{
            width: '100%', height: 48, background: '#F59E0B', color: '#0A1628',
            border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}
        >
          I Understand — Start Exam
        </button>
      </div>
    </div>
  );
}

// ─── Upcoming / Today Waiting State ──────────────────────────────────────────

function UpcomingView({ level, onLevelChange, status }) {
  const next = getNextOlympiadDate();
  const days = getDaysUntil(next);
  const countdown = useCountdown(10);
  const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
  const history = progress.olympiadHistory || [];
  const lastResult = history.length > 0 ? history[history.length - 1] : null;

  return (
    <div style={{ ...DARK_BG, padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: 500, width: '100%', textAlign: 'center' }}>
        <LevelSelector level={level} onChange={onLevelChange} />

        <div style={{
          fontSize: 56,
          animation: status === 'today_waiting' ? 'olympiadPulse 1.5s ease-in-out infinite' : 'none',
          marginBottom: 12,
        }}>🏆</div>

        <h1 className="font-heading" style={{ fontSize: 32, fontWeight: 700, color: 'white', margin: '0 0 8px' }}>
          VedicMind Olympiad
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: '0 0 24px' }}>
          {getOlympiadLevelLabel(level)}
        </p>

        {/* Date card */}
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 16, padding: '20px 24px', marginBottom: 24,
        }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            {status === 'today_waiting' ? '🌟 Olympiad Day!' : 'Next Olympiad'}
          </div>
          <div className="font-heading" style={{ fontSize: 22, color: 'white', marginBottom: 8 }}>
            {status === 'today_waiting' ? 'Begins at 10:00 AM sharp' : formatOlympiadDate(next)}
          </div>
          {status === 'today_waiting' ? (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color: '#F59E0B' }}>
              Starts in {countdown}
            </div>
          ) : (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color: '#F59E0B' }}>
              {days} day{days !== 1 ? 's' : ''} away
            </div>
          )}
        </div>

        {/* Info pills */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
          {['📝 30 Questions', '⏱ 60 Minutes', '🏅 Win Certificates'].map(t => (
            <span key={t} style={{
              background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)',
              color: '#F59E0B', borderRadius: 99, padding: '8px 16px',
              fontFamily: 'var(--font-body)', fontSize: 12,
            }}>{t}</span>
          ))}
        </div>

        {/* Prizes */}
        <div style={{ textAlign: 'left', marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'white', fontWeight: 600, marginBottom: 12 }}>
            What You Can Win 🥇
          </div>
          {[
            { icon: '🥇', text: '1st Place — Gold Certificate + Champion Badge + 500 XP' },
            { icon: '🥈', text: '2nd Place — Silver Certificate + Elite Badge + 300 XP' },
            { icon: '🥉', text: '3rd Place — Bronze Certificate + Achiever Badge + 200 XP' },
            { icon: '🏅', text: 'All Participants — Participation Certificate + 50 XP' },
          ].map(item => (
            <div key={item.icon} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12, padding: 12, marginBottom: 8,
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'white' }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Past result */}
        {lastResult && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
            Your last Olympiad: {lastResult.score}/{lastResult.totalPossible} — {lastResult.medal || '🏅 Participant'}
          </p>
        )}
      </div>

      <style>{`@keyframes olympiadPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}`}</style>
    </div>
  );
}

// ─── Exam Interface ───────────────────────────────────────────────────────────

function ExamInterface({ level, questions }) {
  const navigate = useNavigate();
  const [showRules, setShowRules] = useState(true);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [qElapsed, setQElapsed] = useState(0);
  const elapsed = useExamTimer(started && !showSubmitModal);
  const qTimerRef = useRef(null);

  const TOTAL_TIME = 60 * 60;
  const Q_TIME = 120;

  // Per-question timer
  useEffect(() => {
    if (!started) return;
    setQElapsed(0);
    qTimerRef.current = setInterval(() => setQElapsed(e => e + 1), 1000);
    return () => clearInterval(qTimerRef.current);
  }, [current, started]);

  // Auto-submit when time up
  useEffect(() => {
    if (started && elapsed >= TOTAL_TIME) submitExam();
  }, [elapsed, started]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const timeLeft = Math.max(0, TOTAL_TIME - elapsed);
  const qTimeLeft = Math.max(0, Q_TIME - qElapsed);
  const timerColor = timeLeft < 300 ? '#EF4444' : '#F59E0B';

  const handleSelect = (opt) => {
    if (selected !== null || answers[current] !== undefined) return;
    setSelected(opt);
    clearInterval(qTimerRef.current);
    const speedBonus = qElapsed < 20 ? 1 : 0;
    setAnswers(prev => ({
      ...prev,
      [current]: { chosen: opt, speedBonus, timeSpent: qElapsed },
    }));
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
        setSelected(null);
      } else {
        setShowSubmitModal(true);
      }
    }, 700);
  };

  const submitExam = () => {
    let correct = 0, wrong = 0, speedBonus = 0;
    questions.forEach((q, i) => {
      const ans = answers[i];
      if (!ans) return;
      if (ans.chosen === q.answer) { correct++; speedBonus += ans.speedBonus || 0; }
      else wrong++;
    });
    const rawScore = correct * 5 - wrong * 1 + speedBonus;
    const score = Math.max(0, rawScore);

    const todayStr = getTodayStr();
    let medal = null;
    if (score >= 150) medal = '🥇 Gold';
    else if (score >= 120) medal = '🥈 Silver';
    else if (score >= 90) medal = '🥉 Bronze';

    const result = {
      date: todayStr,
      quarter: getQuarterId(),
      level,
      score,
      totalPossible: 180,
      correct,
      wrong,
      timeTaken: elapsed,
      completedAt: new Date().toISOString(),
      rank: null,
      medal,
    };
    saveOlympiadResult(result);
    navigate('/olympiad/results');
  };

  const q = questions[current];
  const answered = answers[current];
  const qPct = ((current) / questions.length) * 100;
  const qTimePct = (qTimeLeft / Q_TIME) * 100;
  const qTimerColor = qTimeLeft < 30 ? '#EF4444' : '#F59E0B';

  return (
    <>
      {showRules && <RulesModal onStart={() => { setShowRules(false); setStarted(true); }} />}

      <div style={{ ...DARK_BG, display: 'flex', flexDirection: 'column' }}>
        {/* Sticky Header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(245,158,11,0.2)',
          padding: '12px 16px',
        }}>
          <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#F59E0B', whiteSpace: 'nowrap' }}>
              🏅 VedicMind Olympiad
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
              Q{current + 1} of {questions.length}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700,
              color: timerColor, background: 'rgba(255,255,255,0.08)',
              borderRadius: 8, padding: '4px 10px',
            }}>
              {formatTime(timeLeft)}
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ maxWidth: 700, margin: '8px auto 0', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 99 }}>
            <div style={{ height: '100%', width: `${qPct}%`, background: '#F59E0B', borderRadius: 99, transition: 'width 0.3s' }} />
          </div>
          {/* Dot nav */}
          <div style={{ maxWidth: 700, margin: '8px auto 0', display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {questions.map((_, i) => {
              const a = answers[i];
              const isCorrect = a && a.chosen === questions[i].answer;
              const bg = i === current ? '#F59E0B' : a ? (isCorrect ? '#10B981' : '#EF4444') : 'rgba(255,255,255,0.2)';
              return <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: bg, flexShrink: 0 }} />;
            })}
          </div>
        </div>

        {/* Question */}
        <div style={{ flex: 1, padding: '24px 16px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: 700, width: '100%' }}>
            {/* Q badge + per-question timer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{
                background: '#F59E0B', color: '#0A1628',
                borderRadius: 8, padding: '4px 12px',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
              }}>
                Q{current + 1}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 80, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 99 }}>
                  <div style={{ height: '100%', width: `${qTimePct}%`, background: qTimerColor, borderRadius: 99, transition: 'width 1s linear' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: qTimerColor }}>{qTimeLeft}s</span>
              </div>
            </div>

            {/* Question text */}
            <div style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: 16, padding: '20px 20px 24px',
            }}>
              {q.sutra && (
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                  {q.topic} · {q.sutra}
                </div>
              )}
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, color: 'white', fontWeight: 500, lineHeight: 1.6, margin: 0 }}>
                {q.question}
              </p>
            </div>

            {/* Options */}
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(q.options || []).map((opt, i) => {
                const isChosen = answered?.chosen === opt;
                const isCorrect = q.answer === opt;
                let border = '1px solid rgba(255,255,255,0.12)';
                let bg = 'rgba(255,255,255,0.04)';
                let color = 'rgba(255,255,255,0.9)';
                if (answered) {
                  if (isChosen && isCorrect) { border = '2px solid #10B981'; bg = 'rgba(16,185,129,0.15)'; color = '#10B981'; }
                  else if (isChosen && !isCorrect) { border = '2px solid #EF4444'; bg = 'rgba(239,68,68,0.15)'; color = '#EF4444'; }
                  else if (isCorrect) { border = '2px solid #10B981'; bg = 'rgba(16,185,129,0.1)'; }
                } else if (selected === opt) {
                  border = '2px solid #F59E0B'; bg = 'rgba(245,158,11,0.15)'; color = '#F59E0B';
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(opt)}
                    disabled={!!answered}
                    style={{
                      width: '100%', minHeight: 48, textAlign: 'left',
                      background: bg, border, borderRadius: 12,
                      padding: '12px 16px', cursor: answered ? 'default' : 'pointer',
                      fontFamily: 'var(--font-body)', fontSize: 14, color,
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 24, height: 24, background: 'rgba(255,255,255,0.1)',
                      borderRadius: '50%', fontSize: 12, fontWeight: 700, marginRight: 10, flexShrink: 0,
                    }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Hint */}
            {answered && q.hint && (
              <div style={{
                marginTop: 12, background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, padding: 12,
              }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#F59E0B' }}>💡 {q.hint}</span>
              </div>
            )}

            {/* Nav buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {current > 0 && (
                <button
                  onClick={() => { setCurrent(c => c - 1); setSelected(answers[current - 1]?.chosen || null); }}
                  style={{
                    flex: 1, height: 44, background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10,
                    color: 'white', fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer',
                  }}
                >
                  ← Previous
                </button>
              )}
              {current < questions.length - 1 ? (
                <button
                  onClick={() => { setCurrent(c => c + 1); setSelected(answers[current + 1]?.chosen || null); }}
                  style={{
                    flex: 1, height: 44, background: '#F59E0B', color: '#0A1628',
                    border: 'none', borderRadius: 10,
                    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  }}
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  style={{
                    flex: 1, height: 44, background: '#10B981', color: 'white',
                    border: 'none', borderRadius: 10,
                    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  }}
                >
                  Submit Exam ✓
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit confirmation modal */}
      {showSubmitModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div style={{
            background: '#0D2252', border: '1px solid rgba(245,158,11,0.4)',
            borderRadius: 20, padding: 28, maxWidth: 360, width: '100%', textAlign: 'center',
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏅</div>
            <div className="font-heading" style={{ fontSize: 20, color: 'white', fontWeight: 700, marginBottom: 8 }}>
              Submit Olympiad?
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>
              Answered: {Object.keys(answers).length} / {questions.length} · Time left: {formatTime(timeLeft)}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowSubmitModal(false)}
                style={{
                  flex: 1, height: 44, background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10,
                  color: 'white', fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer',
                }}
              >
                Continue
              </button>
              <button
                onClick={submitExam}
                style={{
                  flex: 1, height: 44, background: '#F59E0B', color: '#0A1628',
                  border: 'none', borderRadius: 10,
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Completed View ───────────────────────────────────────────────────────────

function CompletedView() {
  const navigate = useNavigate();
  const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
  const history = progress.olympiadHistory || [];
  const last = history[history.length - 1];

  return (
    <div style={{ ...DARK_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🏅</div>
        <h1 className="font-heading" style={{ fontSize: 28, color: 'white', fontWeight: 700, marginBottom: 8 }}>
          You've Competed!
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>
          {last ? `Score: ${last.score}/${last.totalPossible} · ${last.medal || '🏅 Participant'}` : 'Great effort this quarter!'}
        </p>
        <button
          onClick={() => navigate('/olympiad/results')}
          style={{
            width: '100%', height: 48, background: '#F59E0B', color: '#0A1628',
            border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)',
            fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 12,
          }}
        >
          View Results →
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            width: '100%', height: 44, background: 'transparent',
            border: '1px solid rgba(255,255,255,0.3)', borderRadius: 12,
            color: 'white', fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer',
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

// ─── Question Loader ─────────────────────────────────────────────────────────

const PROMPTS = {
  junior: `Generate 30 Vedic Mathematics Olympiad MCQ questions for Class 1-7 students. Mix of difficulty: 12 easy, 12 medium, 6 hard. Topics: all Level 1-2 sutras. Include visual/pattern questions where possible. Each: question, options (array of 4 strings), answer (exact string matching one option), hint, difficulty, topic, sutra. Return a JSON array only, no markdown.`,
  senior: `Generate 30 Vedic Mathematics Olympiad MCQ questions for Class 8-12 students. Mix: 8 medium, 14 hard, 8 very hard. Topics: all Level 1-3 sutras, algebraic applications, divisibility. Each: question, options (array of 4 strings), answer (exact string matching one option), hint, difficulty, topic, sutra. Return a JSON array only, no markdown.`,
  open: `Generate 30 Vedic Mathematics Olympiad MCQ questions for adults and competitive exam aspirants. All hard to very hard. Topics: all 16 sutras, calendar, auxiliary fractions, osculators, speed arithmetic, mental calculation tricks. Timed pressure questions. Each: question, options (array of 4 strings), answer (exact string matching one option), hint, difficulty, topic, sutra. Return a JSON array only, no markdown.`,
};

function LoadingScreen({ level }) {
  return (
    <div style={{ ...DARK_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
        <div className="font-heading" style={{ fontSize: 24, color: 'white', fontWeight: 700, marginBottom: 8 }}>
          Preparing Your Olympiad
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>
          Generating {getOlympiadLevelLabel(level)} questions...
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%', background: '#F59E0B',
              animation: `loadDot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
        <style>{`@keyframes loadDot{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OlympiadPage() {
  const profile = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_profile') || '{}'); } catch { return {}; } })();
  const [level, setLevel] = useState(() => getOlympiadLevel(profile.grade));
  const [status, setStatus] = useState(getOlympiadStatus());
  const [questions, setQuestions] = useState(null);
  const [loadingQ, setLoadingQ] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Refresh status every 30s
  useEffect(() => {
    const id = setInterval(() => setStatus(getOlympiadStatus()), 30000);
    return () => clearInterval(id);
  }, []);

  // Load questions when live
  useEffect(() => {
    if (status !== 'live') return;
    const cached = getCachedQuestions(level);
    if (cached) { setQuestions(cached); return; }
    setLoadingQ(true);
    setLoadError(null);
    base44.integrations.Core.InvokeLLM({
      prompt: PROMPTS[level],
      response_json_schema: {
        type: 'object',
        properties: {
          questions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                question: { type: 'string' },
                options: { type: 'array', items: { type: 'string' } },
                answer: { type: 'string' },
                hint: { type: 'string' },
                difficulty: { type: 'string' },
                topic: { type: 'string' },
                sutra: { type: 'string' },
              },
            },
          },
        },
      },
    })
      .then(res => {
        const qs = res.questions || res;
        const arr = Array.isArray(qs) ? qs : [];
        setCachedQuestions(level, arr);
        setQuestions(arr);
        setLoadingQ(false);
      })
      .catch(err => {
        setLoadError(err.message || 'Failed to load questions');
        setLoadingQ(false);
      });
  }, [status, level]);

  if (status === 'live') {
    if (loadingQ) return <LoadingScreen level={level} />;
    if (loadError) return (
      <div style={{ ...DARK_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
          <p style={{ color: 'white', fontFamily: 'var(--font-body)', marginBottom: 16 }}>{loadError}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 24px', background: '#F59E0B', color: '#0A1628', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700 }}>Retry</button>
        </div>
      </div>
    );
    if (questions) return <ExamInterface level={level} questions={questions} />;
    return null;
  }

  if (status === 'completed') return <CompletedView />;

  return <UpcomingView level={level} onLevelChange={setLevel} status={status} />;
}