import React, { useMemo } from 'react';
import { generateLeaderboard, getTopN } from '@/lib/leaderboardEngine';

const glass = {
  background: 'rgba(255,255,255,0.85)',
  border: '1px solid rgba(30,64,175,0.12)',
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(10,22,40,0.06)',
};

function todayString() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

export default function AdminAnalytics() {
  const profile  = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_profile')) || {}; } catch { return {}; } })();
  const progress = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_progress')) || {}; } catch { return {}; } })();

  const globalBoard = useMemo(() => generateLeaderboard(profile, progress, 'global'), []);
  const top10 = getTopN(globalBoard, 10);

  const totalStudents = globalBoard.length;
  const today = todayString();
  const quizAttemptsToday = (() => {
    try {
      const history = progress.dailyQuizHistory || [];
      return history.filter(h => h.date === today).length;
    } catch { return 0; }
  })();

  const totalXP = globalBoard.reduce((s, e) => s + e.score, 0);
  const avgStreak = Math.round(globalBoard.reduce((s, e) => s + (e.streak || 0), 0) / (globalBoard.length || 1));

  const completedLessons = (progress.completedLessons || []).length;
  const aptitudeAttempts = (progress.aptitudeHistory || []).length;

  const STATS = [
    { label: '👥 Total Students', value: totalStudents, sub: 'on platform' },
    { label: '📅 Quiz Attempts Today', value: quizAttemptsToday, sub: 'daily quiz' },
    { label: '⭐ Total XP (All Users)', value: totalXP.toLocaleString(), sub: 'experience points' },
    { label: '🔥 Avg Streak', value: `${avgStreak}d`, sub: 'across all users' },
    { label: '📚 Your Lessons Done', value: completedLessons, sub: 'of 40 total' },
    { label: '🎯 Aptitude Attempts', value: aptitudeAttempts, sub: 'total quizzes' },
  ];

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div>
      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ ...glass, padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: '#0A1628', lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Top 10 Leaderboard */}
      <div style={{ ...glass, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(30,64,175,0.08)' }}>
          <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: '#0A1628', margin: 0 }}>🏆 Top 10 — Global Leaderboard</h3>
        </div>
        {top10.map((entry, i) => (
          <div key={entry.id} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
            borderBottom: i < top10.length - 1 ? '1px solid rgba(30,64,175,0.06)' : 'none',
            background: entry.isCurrentUser ? 'rgba(59,130,246,0.04)' : 'transparent',
          }}>
            <span style={{ minWidth: 28, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: i < 3 ? '#0A1628' : '#9CA3AF' }}>
              {i < 3 ? medals[i] : `#${i + 1}`}
            </span>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', background: entry.isCurrentUser ? '#0A1628' : '#F0F4FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
              color: entry.isCurrentUser ? 'white' : '#0A1628',
            }}>{entry.name.charAt(0)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: '#0A1628' }}>
                {entry.isAnonymous ? 'Anonymous 🎭' : entry.name}
                {entry.isCurrentUser && <span style={{ marginLeft: 6, color: '#3B82F6' }}>(You)</span>}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF' }}>{entry.grade} · 🔥{entry.streak} streak</div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 16, color: '#F59E0B', flexShrink: 0 }}>{entry.score} pts</div>
          </div>
        ))}
        {top10.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF', fontFamily: 'var(--font-body)' }}>No data yet.</div>}
      </div>
    </div>
  );
}