import React, { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import { getUserProgress, getDailyQuizHistory, getQuizResultsByUser, getWeeklyExamResultsByUser } from '@/lib/supabaseDataService';

// ─── Reviewer Activity ────────────────────────────────────────────────────────
// Shows what a reviewer has actually DONE in the app, using only data the
// app already records: lessons completed, XP/level/streak, and every quiz
// attempt (daily, general, weekly exam) with scores and timestamps.
//
// What this does NOT show, because the app doesn't track it anywhere:
// which screens they opened, how long they stayed on a page, or click-by-
// click navigation order. That would need new event-tracking code added
// across the app — this view only surfaces what already exists in
// progress / quiz_results / daily_quiz_results / weekly_exam_results.

const card = { background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(30,64,175,0.1)', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 16 };
const inp = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13, outline: 'none' };
const btn = (c = '#1e40af') => ({ padding: '9px 20px', borderRadius: 9, background: c, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 });

export default function AdminReviewerActivity() {
  const [reviewers, setReviewers] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activity, setActivity] = useState(null);

  useEffect(() => { loadReviewers(); }, []);

  async function loadReviewers() {
    const sb = await getSupabase();
    const { data, error } = await sb.from('reviewer_accounts').select('*').order('created_at', { ascending: false });
    if (error) { setError('Could not load reviewer list: ' + error.message); return; }
    setReviewers(data || []);
  }

  async function loadActivity(userId) {
    setSelectedId(userId);
    setActivity(null);
    setError('');
    if (!userId) return;
    setLoading(true);
    try {
      const [progress, dailyQuiz, quizResults, weeklyExam] = await Promise.all([
        getUserProgress(userId),
        getDailyQuizHistory(userId),
        getQuizResultsByUser(userId),
        getWeeklyExamResultsByUser(userId),
      ]);
      setActivity({ progress, dailyQuiz, quizResults, weeklyExam });
    } catch (e) {
      setError('Could not load activity: ' + e.message);
    }
    setLoading(false);
  }

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const fmtDateTime = (d) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

  const completedLessons = activity?.progress?.completed_lessons || [];
  const lessonScores = activity?.progress?.lesson_scores || {};

  return (
    <div>
      <div style={card}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>👀 Reviewer Activity</h3>
        <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>
          What they've actually done: lessons completed, XP/streak, and every quiz/exam attempt with scores.
        </p>
        <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 16, fontStyle: 'italic' }}>
          Note: this doesn't show page-by-page navigation or time spent per screen — the app doesn't track that yet, only lesson/quiz completion.
        </p>

        {error && (
          <div style={{ marginBottom: 14, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 14, color: '#B91C1C', fontSize: 13 }}>
            ⚠️ {error}
          </div>
        )}

        <label style={{ fontSize: 12, color: '#6B7280', display: 'block', marginBottom: 4 }}>Select a reviewer</label>
        <select
          style={inp}
          value={selectedId}
          onChange={e => loadActivity(e.target.value)}
        >
          <option value="">— Choose a reviewer —</option>
          {reviewers.map(r => (
            <option key={r.user_id} value={r.user_id}>{r.name} ({r.mobile})</option>
          ))}
        </select>
        {reviewers.length === 0 && (
          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 8 }}>No reviewer accounts found yet — create one in the Reviewer Access tab first.</p>
        )}
      </div>

      {loading && <p style={{ color: '#6B7280', textAlign: 'center', padding: 30 }}>Loading activity…</p>}

      {activity && (
        <>
          <div style={card}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>📊 Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { label: 'Lessons Completed', value: completedLessons.length },
                { label: 'Total XP', value: activity.progress.total_xp || 0 },
                { label: 'Current Level', value: activity.progress.current_level || 1 },
                { label: 'Streak (days)', value: activity.progress.streak || 0 },
              ].map(m => (
                <div key={m.label} style={{ background: '#F9FAFB', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#1e40af' }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: '#6B7280', marginTop: 12 }}>
              Last activity: <strong>{fmtDate(activity.progress.last_activity_date)}</strong>
              {' · '}Account created: <strong>{fmtDate(activity.progress.created_at)}</strong>
            </p>
          </div>

          <div style={card}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>📚 Lessons Completed ({completedLessons.length})</h3>
            {completedLessons.length === 0 ? (
              <p style={{ color: '#9CA3AF', fontSize: 13 }}>No lessons completed yet.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {completedLessons.map(id => (
                  <span key={id} style={{ background: '#EEF2FF', color: '#1e40af', fontSize: 12, padding: '6px 12px', borderRadius: 20, fontWeight: 600 }}>
                    {id}{lessonScores[id] != null ? ` — ${lessonScores[id]}%` : ''}
                  </span>
                ))}
              </div>
            )}
          </div>

          <ActivityTable
            title="🧮 Lesson Quizzes"
            rows={activity.quizResults}
            empty="No lesson/Tier quizzes taken yet."
            columns={[
              { header: 'Type', render: r => r.quiz_type || '—' },
              { header: 'Score', render: r => `${r.score ?? '—'} / ${r.total ?? '—'}` },
              { header: 'Time taken', render: r => r.time_taken_sec ? `${r.time_taken_sec}s` : '—' },
              { header: 'Date', render: r => fmtDateTime(r.created_at) },
            ]}
          />

          <ActivityTable
            title="⚡ Daily Quizzes"
            rows={activity.dailyQuiz}
            empty="No daily quizzes taken yet."
            columns={[
              { header: 'Date', render: r => fmtDate(r.quiz_date) },
              { header: 'Score', render: r => `${r.score ?? '—'} / ${r.total_possible ?? '—'}` },
              { header: 'Rank', render: r => r.rank ?? '—' },
              { header: 'Time taken', render: r => r.time_taken ? `${r.time_taken}s` : '—' },
            ]}
          />

          <ActivityTable
            title="📝 Weekly Exams"
            rows={activity.weeklyExam}
            empty="No weekly exams taken yet."
            columns={[
              { header: 'Week of', render: r => fmtDate(r.week_start) },
              { header: 'Score', render: r => `${r.score ?? '—'} / ${r.total_possible ?? '—'}` },
              { header: 'Taken on', render: r => fmtDateTime(r.created_at) },
            ]}
          />
        </>
      )}
    </div>
  );
}

function ActivityTable({ title, rows, empty, columns }) {
  return (
    <div style={card}>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>{title} ({rows.length})</h3>
      {rows.length === 0 ? (
        <p style={{ color: '#9CA3AF', fontSize: 13 }}>{empty}</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {columns.map(c => (
                  <th key={c.header} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>{c.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id || i} style={{ background: i % 2 === 0 ? '#fff' : '#F9FAFB' }}>
                  {columns.map(c => (
                    <td key={c.header} style={{ padding: '8px 12px', borderBottom: '1px solid #F3F4F6' }}>{c.render(r)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
