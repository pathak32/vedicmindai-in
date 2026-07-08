import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

const card = { background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(30,64,175,0.1)', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' };

function todayString() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function timeAgo(iso) {
  if (!iso) return '—';
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(iso).toLocaleDateString('en-IN');
}

export default function AdminLiveActivity() {
  const [stats, setStats] = useState(null);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef(null);

  const loadData = useCallback(async () => {
    try {
      const sb = await getSupabase();
      const today = todayString();
      const todayStartISO = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

      const [profilesRes, progressRes, dailyQuizRes, lessonQuizRes] = await Promise.all([
        sb.from('profiles').select('id, full_name, mobile, created_at'),
        sb.from('progress').select('user_id, completed_lessons, last_activity_date, updated_at, daily_quiz_streak'),
        sb.from('daily_quiz_results').select('user_id, quiz_date, score, total_possible, created_at').eq('quiz_date', today),
        sb.from('quiz_results').select('user_id, score, created_at').gte('created_at', todayStartISO),
      ]);

      const profiles = profilesRes.data || [];
      const progress = progressRes.data || [];
      const dailyQuiz = dailyQuizRes.data || [];
      const lessonQuiz = lessonQuizRes.data || [];

      const nameById = {};
      profiles.forEach((p) => { nameById[p.id] = p.full_name || p.mobile || p.id?.slice(0, 8); });

      const newSignupsToday = profiles.filter((p) => p.created_at && new Date(p.created_at).toDateString() === new Date().toDateString());
      const activeProgressToday = progress.filter((p) => p.last_activity_date === today);

      // Active users today = union of anyone with a signal today
      const activeUserIds = new Set([
        ...newSignupsToday.map((p) => p.id),
        ...activeProgressToday.map((p) => p.user_id),
        ...dailyQuiz.map((q) => q.user_id),
        ...lessonQuiz.map((q) => q.user_id),
      ]);

      setStats({
        activeToday: activeUserIds.size,
        newSignupsToday: newSignupsToday.length,
        dailyQuizzesToday: dailyQuiz.length,
        lessonActivityToday: activeProgressToday.length,
        totalUsers: profiles.length,
      });

      // Build a merged, time-sorted feed of "what happened today"
      const events = [
        ...newSignupsToday.map((p) => ({
          type: 'signup', time: p.created_at, label: `🆕 ${nameById[p.id] || 'Someone'} signed up`,
        })),
        ...dailyQuiz.map((q) => ({
          type: 'dailyquiz', time: q.created_at, label: `🎯 ${nameById[q.user_id] || 'Someone'} completed Daily Quiz — ${q.score}/${q.total_possible}`,
        })),
        ...lessonQuiz.map((q) => ({
          type: 'lessonquiz', time: q.created_at, label: `📖 ${nameById[q.user_id] || 'Someone'} scored ${q.score}% on a lesson quiz`,
        })),
      ].filter((e) => e.time).sort((a, b) => new Date(b.time) - new Date(a.time));

      setFeed(events.slice(0, 30));
      setLastUpdated(new Date());
    } catch (e) {
      console.error('AdminLiveActivity:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(loadData, 30000);
    }
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, loadData]);

  if (loading && !stats) return <p style={{ color: '#6B7280', textAlign: 'center', padding: 60 }}>Loading today's activity from Supabase...</p>;

  const metrics = [
    { label: '🟢 Active Today', value: stats?.activeToday ?? 0, color: '#059669' },
    { label: '🆕 New Signups Today', value: stats?.newSignupsToday ?? 0, color: '#1e40af' },
    { label: '🎯 Daily Quizzes Today', value: stats?.dailyQuizzesToday ?? 0, color: '#D97706' },
    { label: '📖 Lesson Activity Today', value: stats?.lessonActivityToday ?? 0, color: '#7C3AED' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#0A1628' }}>Today's Real Engagement</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>
            Pulled live from Supabase — not Play Console's lagged 28-day graph. {lastUpdated && `Last updated ${lastUpdated.toLocaleTimeString('en-IN')}.`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4B5563', cursor: 'pointer' }}>
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
            Auto-refresh every 30s
          </label>
          <button onClick={loadData} style={{ padding: '6px 14px', borderRadius: 8, background: '#1e40af', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            ↻ Refresh Now
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 20 }}>
        {metrics.map((m, i) => (
          <div key={i} style={card}>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={{ ...card, marginBottom: 0 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0A1628' }}>Live Activity Feed (today)</h4>
        {feed.length === 0 ? (
          <p style={{ color: '#9CA3AF', fontSize: 13, padding: '12px 0' }}>No activity yet today — check back once testers start using the app.</p>
        ) : (
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            {feed.map((e, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 4px', borderBottom: i < feed.length - 1 ? '1px solid #F3F4F6' : 'none', fontSize: 13,
              }}>
                <span style={{ color: '#374151' }}>{e.label}</span>
                <span style={{ color: '#9CA3AF', fontSize: 12, flexShrink: 0, marginLeft: 12 }}>{timeAgo(e.time)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
