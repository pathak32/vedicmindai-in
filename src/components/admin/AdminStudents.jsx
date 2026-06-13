import React, { useState, useMemo } from 'react';
import { generateLeaderboard } from '@/lib/leaderboardEngine';

const glass = {
  background: 'rgba(255,255,255,0.85)',
  border: '1px solid rgba(30,64,175,0.12)',
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(10,22,40,0.06)',
};

// Generate mock student list from leaderboard engine + any local storage data
function buildStudentList() {
  const profile  = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_profile')) || {}; } catch { return {}; } })();
  const progress = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_progress')) || {}; } catch { return {}; } })();
  const auth     = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_auth')) || {}; } catch { return {}; } })();

  const board = generateLeaderboard(profile, progress, 'global');

  return board.map((entry, i) => ({
    id: entry.id,
    name: entry.isAnonymous ? 'Anonymous' : entry.name,
    email: entry.isCurrentUser ? (auth.email || '—') : `student${i + 1}@school.edu`,
    grade: entry.grade || '—',
    school: entry.school || 'DPS School',
    quizAttempts: entry.isCurrentUser ? (progress.dailyQuizHistory?.length || 0) : Math.floor(Math.random() * 30),
    joinDate: entry.isCurrentUser
      ? new Date(Date.now() - 30 * 24 * 3600000).toLocaleDateString()
      : new Date(Date.now() - Math.random() * 90 * 24 * 3600000).toLocaleDateString(),
    xp: entry.score,
    isCurrentUser: entry.isCurrentUser,
  }));
}

export default function AdminStudents() {
  const [search, setSearch] = useState('');
  const students = useMemo(() => buildStudentList(), []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return students;
    return students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.school.toLowerCase().includes(q) ||
      s.grade.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    );
  }, [search, students]);

  return (
    <div>
      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: '👥 Total Students', value: students.length },
          { label: '✅ Quiz Completed', value: students.filter(s => s.quizAttempts > 0).length },
          { label: '⭐ Avg XP', value: Math.round(students.reduce((a, s) => a + s.xp, 0) / students.length) },
        ].map((s, i) => (
          <div key={i} style={{ ...glass, padding: '16px 20px' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, color: '#0A1628' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ ...glass, padding: 16, marginBottom: 16 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by name, school, class, or email..."
          style={{
            width: '100%', border: '1.5px solid rgba(30,64,175,0.15)', borderRadius: 10,
            padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 14,
            color: '#0A1628', background: '#F8FAFF', outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Table */}
      <div style={{ ...glass, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#F0F4FF', borderBottom: '1px solid rgba(30,64,175,0.1)' }}>
                {['Name', 'Class', 'School', 'Email', 'Quiz Attempts', 'XP', 'Join Date'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#4B5563', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(30,64,175,0.06)', background: s.isCurrentUser ? 'rgba(59,130,246,0.04)' : i % 2 === 0 ? 'white' : '#FAFBFF' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0A1628', whiteSpace: 'nowrap' }}>
                    {s.name}
                    {s.isCurrentUser && <span style={{ marginLeft: 6, background: '#DBEAFE', color: '#1E40AF', borderRadius: 100, padding: '1px 8px', fontSize: 11, fontWeight: 700 }}>You</span>}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#4B5563' }}>{s.grade}</td>
                  <td style={{ padding: '12px 16px', color: '#4B5563', whiteSpace: 'nowrap' }}>{s.school}</td>
                  <td style={{ padding: '12px 16px', color: '#4B5563' }}>{s.email}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: '#0A1628', textAlign: 'center' }}>{s.quizAttempts}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: '#F59E0B', fontWeight: 700 }}>{s.xp}</td>
                  <td style={{ padding: '12px 16px', color: '#9CA3AF', whiteSpace: 'nowrap' }}>{s.joinDate}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(30,64,175,0.08)', fontFamily: 'var(--font-body)', fontSize: 13, color: '#9CA3AF' }}>
          Showing {filtered.length} of {students.length} students
        </div>
      </div>
    </div>
  );
}