import React, { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

// Phase 1 — School Analytics for the admin panel.
// Allows you to demo a school's class-level progress to a principal
// during a sales visit, by entering their school's code/name.
//
// Phase 2 (planned, after first school pilot signs up):
// Separate teacher login portal where teachers see only their
// own school's students without needing admin access.

const card = {
  background: 'rgba(255,255,255,0.9)',
  border: '1px solid rgba(30,64,175,0.1)',
  borderRadius: 14, padding: 20,
  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
};

const btn = (bg = '#1e40af') => ({
  background: bg, color: 'white', border: 'none',
  borderRadius: 8, padding: '8px 18px', fontWeight: 600,
  fontSize: 13, cursor: 'pointer',
});

const statBox = (accent) => ({
  background: 'white', border: `1px solid ${accent}33`,
  borderRadius: 12, padding: '14px 18px', flex: 1,
  borderLeft: `4px solid ${accent}`,
});

export default function AdminSchoolAnalytics() {
  const [schoolCode, setSchoolCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [students, setStudents] = useState([]);
  const [quizData, setQuizData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortKey, setSortKey] = useState('lessons_completed');
  const [sortDir, setSortDir] = useState('desc');
  const [expandedId, setExpandedId] = useState(null);

  async function handleLoad() {
    const code = inputCode.trim();
    if (!code) return;
    setLoading(true);
    setError('');
    setStudents([]);
    setQuizData({});

    try {
      const sb = await getSupabase();

      // Students are identified by school_code in their profile.
      // If school_code column doesn't exist yet (pre-Phase-2 signup
      // flow), fall back to showing all students for demo purposes
      // with a note.
      const { data: profileData, error: pErr } = await sb
        .from('profiles')
        .select('id, full_name, mobile, grade, plan, xp, lessons_completed, created_at')
        .eq('school_code', code)
        .order('created_at', { ascending: false });

      if (pErr) {
        // Column may not exist yet — show a demo note and load all
        if (pErr.message.includes('column') || pErr.code === '42703') {
          setError(`The "school_code" column doesn't exist yet in profiles. Run the Phase 2 migration to enable real school grouping. Showing all students as a demo view instead.`);
          const { data: all } = await sb
            .from('profiles')
            .select('id, full_name, mobile, grade, plan, xp, lessons_completed, created_at')
            .order('created_at', { ascending: false })
            .limit(50);
          setStudents(all || []);
        } else {
          throw pErr;
        }
      } else {
        setStudents(profileData || []);
      }

      // Fetch daily quiz results for these students
      const ids = (profileData || []).map(p => p.id);
      if (ids.length > 0) {
        const { data: qData } = await sb
          .from('daily_quiz_results')
          .select('user_id, score, total_possible, created_at')
          .in('user_id', ids)
          .order('created_at', { ascending: false });
        // Group by user_id, keep last 7 entries
        const grouped = {};
        (qData || []).forEach(q => {
          if (!grouped[q.user_id]) grouped[q.user_id] = [];
          if (grouped[q.user_id].length < 7) grouped[q.user_id].push(q);
        });
        setQuizData(grouped);
      }
      setSchoolCode(code);
    } catch (e) {
      setError('Failed to load: ' + (e.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const sorted = [...students].sort((a, b) => {
    const av = a[sortKey] ?? 0, bv = b[sortKey] ?? 0;
    return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
  });

  // Class-level aggregates
  const activeThisWeek = students.filter(s => {
    if (!s.created_at) return false;
    const d = new Date(s.created_at);
    return (Date.now() - d) < 7 * 24 * 3600 * 1000;
  }).length;

  const avgLessons = students.length
    ? (students.reduce((s, u) => s + (u.lessons_completed || 0), 0) / students.length).toFixed(1)
    : 0;

  const avgXP = students.length
    ? Math.round(students.reduce((s, u) => s + (u.xp || 0), 0) / students.length)
    : 0;

  const quizParticipants = Object.keys(quizData).length;

  const avgQuizPct = quizParticipants > 0
    ? Math.round(Object.values(quizData).map(qs => {
        const last = qs[0];
        return last ? Math.round(last.score / last.total_possible * 100) : 0;
      }).reduce((a, b) => a + b, 0) / quizParticipants)
    : null;

  function exportCSV() {
    const rows = [
      ['Name', 'Mobile', 'Grade', 'Plan', 'Lessons Completed', 'XP', 'Last Quiz Score %', 'Joined'],
      ...sorted.map(s => {
        const q = quizData[s.id]?.[0];
        const qPct = q ? Math.round(q.score / q.total_possible * 100) + '%' : 'N/A';
        return [
          s.full_name || '(no name)',
          s.mobile || '',
          s.grade || '',
          s.plan || 'free',
          s.lessons_completed || 0,
          s.xp || 0,
          qPct,
          s.created_at ? new Date(s.created_at).toLocaleDateString('en-IN') : '',
        ];
      }),
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schoolCode}_vedicmindai_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, marginBottom: 6 }}>
        🏫 School Analytics
      </h2>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B7280', marginBottom: 20 }}>
        Enter a school's code to view class-level progress. Use this during school sales visits to
        show a principal how their students are performing in real time. Phase 2 (teacher self-login
        portal) will be built after the first school pilot signs up.
      </p>

      {/* Search */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          value={inputCode}
          onChange={e => setInputCode(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLoad()}
          placeholder="School code (e.g. DPS_NOIDA) or type 'ALL' to see everyone…"
          style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 14 }}
        />
        <button onClick={handleLoad} disabled={loading} style={btn()}>
          {loading ? 'Loading…' : 'Load School'}
        </button>
      </div>

      {error && (
        <div style={{ padding: 12, borderRadius: 8, background: '#FEF3C7', border: '1px solid #FDE68A', color: '#92400E', fontSize: 13, marginBottom: 16 }}>
          ⚠️ {error}
        </div>
      )}

      {students.length > 0 && (
        <>
          {/* Class summary stats */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={statBox('#6366F1')}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#0A1628' }}>{students.length}</div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Total Students</div>
            </div>
            <div style={statBox('#10B981')}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#0A1628' }}>{activeThisWeek}</div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Active This Week</div>
            </div>
            <div style={statBox('#F59E0B')}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#0A1628' }}>{avgLessons}</div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Avg Lessons Completed</div>
            </div>
            <div style={statBox('#3B82F6')}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#0A1628' }}>{avgXP}</div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Avg XP Earned</div>
            </div>
            {avgQuizPct !== null && (
              <div style={statBox('#EC4899')}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#0A1628' }}>{avgQuizPct}%</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Avg Last Quiz Score</div>
              </div>
            )}
          </div>

          {/* Progress bar: lessons distribution */}
          <div style={{ ...card, marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
              📊 Lesson Completion Distribution
            </div>
            {[
              { label: '0 lessons', filter: s => (s.lessons_completed || 0) === 0, color: '#EF4444' },
              { label: '1–3 lessons', filter: s => (s.lessons_completed || 0) >= 1 && (s.lessons_completed || 0) <= 3, color: '#F59E0B' },
              { label: '4–9 lessons', filter: s => (s.lessons_completed || 0) >= 4 && (s.lessons_completed || 0) <= 9, color: '#3B82F6' },
              { label: '10+ lessons', filter: s => (s.lessons_completed || 0) >= 10, color: '#10B981' },
            ].map(({ label, filter, color }) => {
              const count = students.filter(filter).length;
              const pct = students.length ? Math.round(count / students.length * 100) : 0;
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{ width: 110, fontSize: 12, color: '#374151', flexShrink: 0 }}>{label}</div>
                  <div style={{ flex: 1, background: '#F3F4F6', borderRadius: 100, height: 10 }}>
                    <div style={{ width: `${pct}%`, background: color, borderRadius: 100, height: 10, transition: 'width 0.4s ease' }} />
                  </div>
                  <div style={{ width: 50, fontSize: 12, color: '#6B7280', textAlign: 'right' }}>{count} ({pct}%)</div>
                </div>
              );
            })}
          </div>

          {/* Student table */}
          <div style={{ ...card, marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14 }}>
                👥 Student Progress ({students.length})
              </div>
              <button onClick={exportCSV} style={btn('#059669')}>
                ⬇ Export CSV Report
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#F9FAFB' }}>
                    {[
                      { key: 'full_name', label: 'Student' },
                      { key: 'grade', label: 'Grade' },
                      { key: 'plan', label: 'Plan' },
                      { key: 'lessons_completed', label: 'Lessons ↕' },
                      { key: 'xp', label: 'XP ↕' },
                      { key: null, label: 'Last Quiz' },
                      { key: null, label: 'Joined' },
                    ].map(col => (
                      <th
                        key={col.label}
                        onClick={col.key ? () => toggleSort(col.key) : undefined}
                        style={{
                          padding: '8px 12px', textAlign: 'left', fontWeight: 600,
                          color: '#374151', cursor: col.key ? 'pointer' : 'default',
                          whiteSpace: 'nowrap', userSelect: 'none',
                          background: sortKey === col.key ? '#EEF2FF' : 'transparent',
                        }}
                      >
                        {col.label}{sortKey === col.key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((s, i) => {
                    const lastQuiz = quizData[s.id]?.[0];
                    const qPct = lastQuiz ? Math.round(lastQuiz.score / lastQuiz.total_possible * 100) : null;
                    const isExpanded = expandedId === s.id;
                    const quizHistory = quizData[s.id] || [];
                    return (
                      <React.Fragment key={s.id}>
                        <tr
                          onClick={() => setExpandedId(isExpanded ? null : s.id)}
                          style={{
                            background: isExpanded ? '#F0F4FF' : i % 2 === 0 ? 'white' : '#FAFAFA',
                            cursor: 'pointer',
                            borderTop: '1px solid #F3F4F6',
                          }}
                        >
                          <td style={{ padding: '9px 12px', fontWeight: 600, color: '#0A1628' }}>
                            {s.full_name || '—'}
                            <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 400 }}>
                              {s.mobile ? `+${s.mobile.replace(/\D/g, '').replace(/^91/, '+91 ')}` : ''}
                            </div>
                          </td>
                          <td style={{ padding: '9px 12px', color: '#374151' }}>{s.grade || '—'}</td>
                          <td style={{ padding: '9px 12px' }}>
                            <span style={{
                              display: 'inline-block', padding: '2px 8px', borderRadius: 100,
                              fontSize: 11, fontWeight: 700,
                              background: s.plan === 'pro' ? '#EEF2FF' : s.plan === 'basic' ? '#ECFDF5' : '#F3F4F6',
                              color: s.plan === 'pro' ? '#4338CA' : s.plan === 'basic' ? '#059669' : '#6B7280',
                            }}>
                              {s.plan || 'free'}
                            </span>
                          </td>
                          <td style={{ padding: '9px 12px', fontWeight: 700, color: '#0A1628', textAlign: 'center' }}>
                            {s.lessons_completed || 0}
                          </td>
                          <td style={{ padding: '9px 12px', color: '#374151', textAlign: 'center' }}>
                            ⭐ {s.xp || 0}
                          </td>
                          <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                            {qPct !== null ? (
                              <span style={{
                                display: 'inline-block', padding: '2px 8px', borderRadius: 100,
                                fontSize: 11, fontWeight: 700,
                                background: qPct >= 80 ? '#ECFDF5' : qPct >= 60 ? '#FEF3C7' : '#FEF2F2',
                                color: qPct >= 80 ? '#059669' : qPct >= 60 ? '#92400E' : '#DC2626',
                              }}>
                                {qPct}%
                              </span>
                            ) : (
                              <span style={{ color: '#D1D5DB', fontSize: 12 }}>No quiz yet</span>
                            )}
                          </td>
                          <td style={{ padding: '9px 12px', fontSize: 12, color: '#9CA3AF' }}>
                            {s.created_at ? new Date(s.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                          </td>
                        </tr>
                        {isExpanded && quizHistory.length > 0 && (
                          <tr style={{ background: '#F0F4FF' }}>
                            <td colSpan={7} style={{ padding: '0 12px 12px 32px' }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                                📊 Last {quizHistory.length} Daily Quiz results:
                              </div>
                              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {quizHistory.map((q, qi) => {
                                  const pct = Math.round(q.score / q.total_possible * 100);
                                  return (
                                    <div key={qi} style={{
                                      background: pct >= 80 ? '#D1FAE5' : pct >= 60 ? '#FEF3C7' : '#FEE2E2',
                                      borderRadius: 8, padding: '4px 10px', fontSize: 12,
                                      color: pct >= 80 ? '#065F46' : pct >= 60 ? '#92400E' : '#991B1B',
                                    }}>
                                      {new Date(q.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — {q.score}/{q.total_possible} ({pct}%)
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!loading && schoolCode && students.length === 0 && !error && (
        <div style={{ padding: 24, textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
          No students found for school code <strong>"{schoolCode}"</strong>.<br />
          Students get a school code assigned during onboarding (Phase 2 feature).
        </div>
      )}

      {/* Phase 2 roadmap note */}
      <div style={{ marginTop: 24, padding: 16, borderRadius: 10, background: '#F0F4FF', border: '1px solid #DBEAFE', fontSize: 13, color: '#374151' }}>
        <strong>📌 Phase 2 (after first school pilot signs up):</strong> Teachers will get their own
        login at <code>vedicmindai.in/school</code>, see only their own students, and get a shareable
        PDF progress report for parent-teacher meetings — without needing admin access.
      </div>
    </div>
  );
}
