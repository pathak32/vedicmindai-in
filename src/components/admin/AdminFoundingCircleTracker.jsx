import React, { useState, useEffect, useCallback } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

const card = { background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(30,64,175,0.1)', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' };

function todayString() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function Flag({ ok }) {
  return (
    <span style={{
      width: 26, height: 26, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: ok ? '#D1FAE5' : '#F3F4F6', color: ok ? '#059669' : '#9CA3AF', fontSize: 13, fontWeight: 700,
    }}>
      {ok ? '✓' : '–'}
    </span>
  );
}

export default function AdminFoundingCircleTracker() {
  const [roster, setRoster] = useState([]);
  const [activity, setActivity] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [newName, setNewName] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [debugProfileCount, setDebugProfileCount] = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const sb = await getSupabase();
      const today = todayString();
      const todayStartISO = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

      const { data: testers, error: rosterErr } = await sb
        .from('founding_circle_testers')
        .select('*')
        .order('added_at', { ascending: true });
      if (rosterErr) throw rosterErr;
      setRoster(testers || []);

      if (!testers || testers.length === 0) { setLoading(false); return; }

      const mobiles = testers.map((t) => t.mobile).filter(Boolean);
      const normalize = (m) => (m || '').replace(/\D/g, '').slice(-10); // last 10 digits, ignore +91/spaces/dashes

      const [profilesRes, progressRes, dailyQuizRes, lessonQuizRes, weeklyExamRes, battlesRes, reasoningRes] = await Promise.all([
        sb.from('profiles').select('id, mobile, full_name'), // fetch all — normalized matching happens client-side below
        sb.from('progress').select('user_id, completed_lessons, last_activity_date'),
        sb.from('daily_quiz_results').select('user_id').eq('quiz_date', today),
        sb.from('quiz_results').select('user_id').gte('created_at', todayStartISO),
        sb.from('weekly_exam_results').select('user_id').gte('created_at', todayStartISO),
        sb.from('battle_rooms').select('creator_id, opponent_id, status').gte('created_at', todayStartISO),
        sb.from('reasoning_progress').select('user_id, chapter_id, completed'),
      ]);

      const profiles = profilesRes.data || [];
      const queryErrors = [];
      if (profilesRes.error) queryErrors.push(`profiles: ${profilesRes.error.message}`);
      if (progressRes.error) queryErrors.push(`progress: ${progressRes.error.message}`);
      if (dailyQuizRes.error) queryErrors.push(`daily_quiz_results: ${dailyQuizRes.error.message}`);
      if (lessonQuizRes.error) queryErrors.push(`quiz_results: ${lessonQuizRes.error.message}`);
      if (weeklyExamRes.error) queryErrors.push(`weekly_exam_results: ${weeklyExamRes.error.message}`);
      if (battlesRes.error) queryErrors.push(`battle_rooms: ${battlesRes.error.message}`);
      if (reasoningRes.error) queryErrors.push(`reasoning_progress: ${reasoningRes.error.message} (have you run supabase/reasoning_progress_schema.sql yet?)`);
      if (queryErrors.length > 0) {
        setError(`Database query errors — this is why data may be missing or wrong: ${queryErrors.join(' | ')}`);
      }
      const progress = progressRes.data || [];
      const dailyQuizUserIds = new Set((dailyQuizRes.data || []).map((r) => r.user_id));
      const lessonQuizUserIds = new Set((lessonQuizRes.data || []).map((r) => r.user_id));
      const weeklyExamUserIds = new Set((weeklyExamRes.data || []).map((r) => r.user_id));
      const battleUserIds = new Set();
      (battlesRes.data || []).forEach((b) => {
        if (b.creator_id) battleUserIds.add(b.creator_id);
        if (b.opponent_id) battleUserIds.add(b.opponent_id);
      });
      const reasoningCompletedByUser = {};
      (reasoningRes.data || []).forEach((r) => {
        if (!r.completed) return;
        reasoningCompletedByUser[r.user_id] = (reasoningCompletedByUser[r.user_id] || 0) + 1;
      });

      const progressByUser = {};
      progress.forEach((p) => { progressByUser[p.user_id] = p; });

      const mobileToProfile = {};
      profiles.forEach((p) => { mobileToProfile[normalize(p.mobile)] = p; });

      const activityMap = {};
      testers.forEach((t) => {
        const profile = t.mobile ? mobileToProfile[normalize(t.mobile)] : null;
        if (!profile) {
          activityMap[t.id] = { matched: false };
          return;
        }
        const uid = profile.id;
        const p = progressByUser[uid];
        activityMap[t.id] = {
          matched: true,
          appOpenToday: p?.last_activity_date === today,
          dailyQuiz: dailyQuizUserIds.has(uid),
          lessonQuiz: lessonQuizUserIds.has(uid),
          weeklyExam: weeklyExamUserIds.has(uid),
          battle: battleUserIds.has(uid),
          totalLessonsCompleted: (p?.completed_lessons || []).length,
          reasoningChaptersDone: reasoningCompletedByUser[uid] || 0,
        };
      });

      setActivity(activityMap);
      setLastUpdated(new Date());
      setDebugProfileCount(profiles.length);
    } catch (e) {
      console.error('AdminFoundingCircleTracker:', e);
      setError(e.message || 'Failed to load. Have you run supabase/founding_circle_schema.sql yet?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  async function addTester() {
    if (!newName.trim()) return;
    let digits = newMobile.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2); // country code included
    if (digits && (digits.length !== 10 || digits.startsWith('0'))) {
      setError('Mobile number must be exactly 10 digits and cannot start with 0.');
      return;
    }
    setAdding(true);
    try {
      const sb = await getSupabase();
      const { error: insertErr } = await sb.from('founding_circle_testers').insert({
        name: newName.trim(),
        mobile: newMobile.trim() || null,
      });
      if (insertErr) throw insertErr;
      setNewName('');
      setNewMobile('');
      await loadAll();
    } catch (e) {
      setError(e.message || 'Failed to add tester');
    } finally {
      setAdding(false);
    }
  }

  async function removeTester(id) {
    try {
      const sb = await getSupabase();
      await sb.from('founding_circle_testers').delete().eq('id', id);
      await loadAll();
    } catch (e) {
      console.error(e);
    }
  }

  const [showNumbers, setShowNumbers] = useState(false);
  const [sortKey, setSortKey] = useState('lessons');
  const [sortDir, setSortDir] = useState('desc');

  const matchedCount = Object.values(activity).filter((a) => a.matched).length;

  function scoreFor(t) {
    const a = activity[t.id] || {};
    if (!a.matched) return -1; // unmatched always sorts last
    // Simple weighted performance score: lessons matter most, then today's signals.
    return (a.totalLessonsCompleted || 0) * 10 + (a.reasoningChaptersDone || 0) * 10
      + (a.appOpenToday ? 1 : 0) + (a.dailyQuiz ? 1 : 0) + (a.lessonQuiz ? 1 : 0)
      + (a.weeklyExam ? 1 : 0) + (a.battle ? 1 : 0);
  }

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sortedRoster = [...roster].sort((a, b) => {
    let av, bv;
    if (sortKey === 'name') { av = a.name.toLowerCase(); bv = b.name.toLowerCase(); }
    else if (sortKey === 'lessons') { av = scoreFor(a); bv = scoreFor(b); }
    else if (sortKey === 'reasoningChaptersDone') { av = activity[a.id]?.reasoningChaptersDone || 0; bv = activity[b.id]?.reasoningChaptersDone || 0; }
    else { av = (activity[a.id]?.[sortKey]) ? 1 : 0; bv = (activity[b.id]?.[sortKey]) ? 1 : 0; }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  function SortHeader({ label, sortField }) {
    const active = sortKey === sortField;
    return (
      <th
        onClick={() => toggleSort(sortField)}
        style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, color: active ? '#1e40af' : '#374151', borderBottom: '1px solid #E5E7EB', cursor: 'pointer', userSelect: 'none' }}
      >
        {label} {active ? (sortDir === 'desc' ? '▼' : '▲') : ''}
      </th>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#0A1628' }}>Founding Circle Tracker</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>
            {roster.length} testers on roster, {matchedCount} matched to real accounts.
            {debugProfileCount !== null && ` (${debugProfileCount} total profiles fetched from database.)`}
            {lastUpdated && ` Last updated ${lastUpdated.toLocaleTimeString('en-IN')}.`}
          </p>
        </div>
        <button onClick={loadAll} style={{ padding: '6px 14px', borderRadius: 8, background: '#1e40af', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div style={{ ...card, marginBottom: 16, background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: 13 }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ ...card, marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 180px' }}>
          <label style={{ fontSize: 11, color: '#6B7280', display: 'block', marginBottom: 4 }}>Name</label>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Mr. Raju"
            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13 }} />
        </div>
        <div style={{ flex: '1 1 180px' }}>
          <label style={{ fontSize: 11, color: '#6B7280', display: 'block', marginBottom: 4 }}>Mobile (must match their login)</label>
          <input value={newMobile} onChange={(e) => setNewMobile(e.target.value)} placeholder="+919565524546"
            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13 }} />
        </div>
        <button onClick={addTester} disabled={adding || !newName.trim()}
          style={{ padding: '8px 20px', borderRadius: 8, background: '#059669', color: 'white', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, opacity: adding ? 0.6 : 1 }}>
          + Add
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4B5563', cursor: 'pointer' }}>
          <input type="checkbox" checked={showNumbers} onChange={(e) => setShowNumbers(e.target.checked)} />
          Show mobile numbers (hide before sharing a screenshot with the group)
        </label>
      </div>

      <div style={card}>
        {loading ? (
          <p style={{ color: '#6B7280', textAlign: 'center', padding: 30 }}>Loading roster...</p>
        ) : roster.length === 0 ? (
          <p style={{ color: '#9CA3AF', fontSize: 13, padding: '12px 0' }}>No testers added yet — add your first one above.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  <th onClick={() => toggleSort('name')} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: sortKey === 'name' ? '#1e40af' : '#374151', borderBottom: '1px solid #E5E7EB', cursor: 'pointer', userSelect: 'none' }}>
                    Tester {sortKey === 'name' ? (sortDir === 'desc' ? '▼' : '▲') : ''}
                  </th>
                  <SortHeader label="App Today" sortField="appOpenToday" />
                  <SortHeader label="Daily Quiz" sortField="dailyQuiz" />
                  <SortHeader label="Lesson Quiz" sortField="lessonQuiz" />
                  <SortHeader label="Weekly Exam" sortField="weeklyExam" />
                  <SortHeader label="Battle" sortField="battle" />
                  <SortHeader label="Lessons Done (total)" sortField="lessons" />
                  <SortHeader label="Reasoning Chapters" sortField="reasoningChaptersDone" />
                  <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}></th>
                </tr>
              </thead>
              <tbody>
                {sortedRoster.map((t, i) => {
                  const a = activity[t.id] || {};
                  return (
                    <tr key={t.id} style={{ background: i % 2 === 0 ? '#fff' : '#F9FAFB' }}>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #F3F4F6' }}>
                        <div style={{ fontWeight: 600, color: '#0A1628' }}>{t.name}</div>
                        {showNumbers && <div style={{ fontSize: 11, color: '#9CA3AF' }}>{t.mobile || 'no mobile on file'}</div>}
                        {!a.matched && <div style={{ fontSize: 11, color: '#D97706', marginTop: 2 }}>⚠️ not matched to an account yet</div>}
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #F3F4F6', textAlign: 'center' }}><Flag ok={a.appOpenToday} /></td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #F3F4F6', textAlign: 'center' }}><Flag ok={a.dailyQuiz} /></td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #F3F4F6', textAlign: 'center' }}><Flag ok={a.lessonQuiz} /></td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #F3F4F6', textAlign: 'center' }}><Flag ok={a.weeklyExam} /></td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #F3F4F6', textAlign: 'center' }}><Flag ok={a.battle} /></td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #F3F4F6', textAlign: 'center', fontWeight: 700, color: '#1e40af' }}>{a.matched ? a.totalLessonsCompleted : '—'}</td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #F3F4F6', textAlign: 'center', fontWeight: 700, color: '#7C3AED' }}>{a.matched ? `${a.reasoningChaptersDone || 0}/10` : '—'}</td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #F3F4F6', textAlign: 'center' }}>
                        <button onClick={() => removeTester(t.id)} style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: 12 }}>Remove</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ ...card, marginTop: 16, background: '#FFFBEB', border: '1px solid #FDE68A' }}>
        <p style={{ fontSize: 12, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
          ⚠️ <strong>Note:</strong> Reasoning chapter completion is now tracked (added after Hitesh flagged the gap). Aptitude still isn't — that section is paused pending redesign, so nothing to track there yet.
          <br />
          Matching works by mobile number — a tester only shows real data once their mobile here matches the number they actually log in with.
        </p>
      </div>
    </div>
  );
}
