import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { getClassGroupLabel, formatMMSS } from '@/lib/weeklyExamEngine';
import { QUESTION_BANKS } from '@/lib/weeklyQuestionBanks';
import { useLanguage } from '@/lib/LanguageContext';

const glass = {
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(30,64,175,0.15)',
  borderRadius: 16,
};

function useCountUp(target, duration = 1200) {
  const { t } = useLanguage();
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

function QuestionRow({ q, ans, index }) {
  const [expanded, setExpanded] = useState(false);
  const LABELS = ['A', 'B', 'C', 'D'];
  const isCorrect = ans?.correct;
  const pts = isCorrect ? (ans.timeTaken < 30 ? 6 : 5) : 0;

  return (
    <div style={{
      borderLeft: `3px solid ${isCorrect ? '#10B981' : '#EF4444'}`,
      background: 'white', borderRadius: '0 12px 12px 0',
      marginBottom: 8, overflow: 'hidden',
    }}>
      <button
        onClick={() => setExpanded(p => !p)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          gap: 10, padding: '12px 14px', background: 'none',
          border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'white',
          background: '#0A1628', borderRadius: 6, padding: '2px 7px', flexShrink: 0,
        }}>Q{index + 1}</span>
        <span style={{ fontSize: 14 }}>{isCorrect ? '✅' : '❌'}</span>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 13, color: '#0A1628',
          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{q.q}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#4B5563', flexShrink: 0 }}>
          +{pts}pts · {ans ? ans.timeTaken + 's' : '—'}
        </span>
      </button>

      {expanded && (
        <div style={{ padding: '0 14px 14px' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', marginBottom: 10 }}>{q.q}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
            {q.options.map((opt, i) => {
              let bg = 'transparent'; let border = '1px solid rgba(30,64,175,0.12)'; let color = '#4B5563';
              if (i === q.correct) { bg = '#ECFDF5'; border = '1px solid #10B981'; color = '#065F46'; }
              else if (ans && i === ans.selectedOption && i !== q.correct) {
                bg = '#FEF2F2'; border = '1px solid #EF4444'; color = '#991B1B';
              }
              return (
                <div key={i} style={{ background: bg, border, borderRadius: 8, padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color, fontWeight: 700 }}>{LABELS[i]}.</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color }}>{opt}</span>
                </div>
              );
            })}
          </div>
          {q.hint && (
            <div style={{ background: '#F0F4FF', borderRadius: 8, padding: '8px 12px' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563' }}>💡 {q.hint}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function WeeklyExamResultsPage() {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
  const history = progress.weeklyExamHistory || [];
  const result = history[history.length - 1];

  const animatedScore = useCountUp(result?.score || 0, 1200);

  if (!result) {
    return (
      <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
        <DashboardNavbar />
        <div style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-body)', color: '#4B5563' }}>No exam results found.</p>
          <button onClick={() => navigate('/weekly-exam')} style={{ marginTop: 16, padding: '10px 24px', background: '#0A1628', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Go to Weekly Exam
          </button>
        </div>
      </div>
    );
  }

  const { score, totalPossible, timeTaken, classGroup, answers = [], weekId } = result;
  const questions = QUESTION_BANKS[classGroup] || QUESTION_BANKS.middle;
  const correctCount = answers.filter(a => a?.correct).length;
  const accuracy = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;
  const xpEarned = Math.floor(score / 2);
  const groupLabel = getClassGroupLabel(classGroup);

  let perfMsg = '', perfColor = '';
  const pct = (score / totalPossible) * 100;
  if (pct >= 90) { perfMsg = 'Outstanding! 🌟 Top of your group!'; perfColor = '#10B981'; }
  else if (pct >= 70) { perfMsg = 'Excellent work! 🎯 Keep it up!'; perfColor = '#3B82F6'; }
  else if (pct >= 50) { perfMsg = 'Good effort! 💪 Practice more this week.'; perfColor = '#F59E0B'; }
  else { perfMsg = 'Keep going! 🧮 Every attempt builds skill.'; perfColor = '#EF4444'; }

  const whatsappMsg = encodeURIComponent(
    `I scored ${score}/120 on VedicMind's Weekly Vedic Maths Exam this Sunday! 🧮🏆\nGroup: ${groupLabel}\nCan you beat my score? Challenge accepted?\nTry FREE at vedicmindai.in`
  );

  const visibleCount = showAll ? questions.length : 5;

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF', paddingBottom: 40 }}>
      <DashboardNavbar />
      <main style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px' }}>

        {/* Score Hero */}
        <div style={{ ...glass, padding: '32px 24px', textAlign: 'center', marginBottom: 16 }}>
          <div className="font-heading" style={{ fontSize: 52, fontWeight: 700, color: '#0A1628', lineHeight: 1 }}>
            {animatedScore}
          </div>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 24, color: '#4B5563' }}>/{totalPossible}</span>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4, marginBottom: 12 }}>
            This Week's Score
          </div>
          <span style={{
            background: '#0A1628', color: 'white', borderRadius: 99,
            fontFamily: 'var(--font-body)', fontSize: 11, padding: '4px 12px',
          }}>{groupLabel}</span>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: perfColor, marginTop: 12, marginBottom: 4 }}>
            {perfMsg}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563', margin: 0 }}>
            Completed in {formatMMSS(timeTaken)}
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { icon: '✅', value: `${correctCount}/20`, label: 'Correct' },
            { icon: '🎯', value: `${accuracy}%`, label: 'Accuracy' },
            { icon: '⭐', value: `+${xpEarned}`, label: 'XP Earned' },
          ].map(({ icon, value, label }) => (
            <div key={label} style={{
              background: 'white', borderRadius: 12, padding: '16px 8px',
              textAlign: 'center', border: '1px solid rgba(30,64,175,0.08)',
            }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
              <div className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#0A1628' }}>{value}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#4B5563' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Question Review */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: '#0A1628', marginBottom: 10 }}>
            Question Review
          </div>
          {questions.slice(0, visibleCount).map((q, i) => (
            <QuestionRow key={i} q={q} ans={answers[i]} index={i} />
          ))}
          <button
            onClick={() => setShowAll(p => !p)}
            style={{
              width: '100%', height: 40, background: 'transparent',
              border: '1px solid rgba(30,64,175,0.15)', borderRadius: 10,
              fontFamily: 'var(--font-body)', fontSize: 13, color: '#3B82F6',
              cursor: 'pointer', marginTop: 4,
            }}
          >
            {showAll ? 'Hide All ↑' : `Show All ${questions.length} Questions ↓`}
          </button>
        </div>

        {/* Share Card */}
        <div style={{ background: '#0A1628', borderRadius: 16, padding: 20, marginBottom: 16, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'white', margin: '0 0 4px', fontWeight: 600 }}>
            I scored {score}/120 on VedicMind's Weekly Exam! 🧮
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '0 0 16px' }}>
            Group: {groupLabel} · Can you beat me? Try at vedicmindai.in
          </p>
          <a
            href={`https://wa.me/?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block', background: '#25D366', color: 'white',
              borderRadius: 12, padding: '12px 24px',
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Share on WhatsApp 📱
          </a>
        </div>

        {/* Bottom Buttons */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            width: '100%', height: 44, background: '#0A1628', color: 'white',
            border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)',
            fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 10,
          }}
        >{t('backToDashboard')}</button>
        <button
          onClick={() => navigate('/leaderboard')}
          style={{
            width: '100%', height: 44, background: 'transparent',
            border: '1.5px solid rgba(30,64,175,0.2)', color: '#0A1628',
            borderRadius: 12, fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer',
          }}
        >View Leaderboard →</button>
      </main>
    </div>
  );
}