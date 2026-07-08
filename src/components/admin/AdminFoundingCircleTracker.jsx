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

      const [profilesRes, progressRes, dailyQuizRes, lessonQuizRes, weeklyExamRes, battlesRes] = await Promise.all([
        sb.from('profiles').select('id, mobile, full_name'), // fetch all — normalized matching happens client-side below
        sb.from('progress').select('user_id, completed_lessons, last_activity_date'),
        sb.from('daily_quiz_results').select('user_id').eq('quiz_date', today),
        sb.from('quiz_results').select('user_id').gte('created_at', todayStartISO),
        sb.from('weekly_exam_results').select('user_id').gte('created_at', todayStartISO),
        sb.from('battle_rooms').select('creator_id, opponent_id, status').gte('created_at', todayStartISO),
      ]);

      const profiles = profilesRes.data || [];
      const progress = progressRes.data || [];
      const dailyQuizUserIds = new Set((dailyQuizRes.data || []).map((r) => r.user_id));
      const lessonQuizUserIds = new Set((lessonQuizRes.data || []).map((r) => r.user_id));
      const weeklyExamUserIds = new Set((weeklyExamRes.data || []).map((r) => r.user_id));
      const battleUserIds = new Set();
      (battlesRes.data || []).forEach((b) => {
        if (b.creator_id) battleUserIds.add(b.creator_id);
        if (b.opponent_id) battleUserIds.add(b.opponent_id);
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
        };
      });

      setActivity(activityMap);
      setLastUpdated(new Date());
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

  const matchedCount = Object.values(activity).filter((a) => a.matched).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#0A1628' }}>Founding Circle Tracker</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>
            {roster.length} testers on roster, {matchedCount} matched to real accounts.
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
                  <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Tester</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>App Today</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Daily Quiz</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Lesson Quiz</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Weekly Exam</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Battle</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Lessons Done (total)</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}></th>
                </tr>
              </thead>
              <tbody>
                {roster.map((t, i) => {
                  const a = activity[t.id] || {};
                  return (
                    <tr key={t.id} style={{ background: i % 2 === 0 ? '#fff' : '#F9FAFB' }}>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #F3F4F6' }}>
                        <div style={{ fontWeight: 600, color: '#0A1628' }}>{t.name}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>{t.mobile || 'no mobile on file'}</div>
                        {!a.matched && <div style={{ fontSize: 11, color: '#D97706', marginTop: 2 }}>⚠️ not matched to an account yet</div>}
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #F3F4F6', textAlign: 'center' }}><Flag ok={a.appOpenToday} /></td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #F3F4F6', textAlign: 'center' }}><Flag ok={a.dailyQuiz} /></td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #F3F4F6', textAlign: 'center' }}><Flag ok={a.lessonQuiz} /></td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #F3F4F6', textAlign: 'center' }}><Flag ok={a.weeklyExam} /></td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #F3F4F6', textAlign: 'center' }}><Flag ok={a.battle} /></td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #F3F4F6', textAlign: 'center', fontWeight: 700, color: '#1e40af' }}>{a.matched ? a.totalLessonsCompleted : '—'}</td>
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
          ⚠️ <strong>Honest limitation:</strong> Reasoning and Aptitude chapter completion aren't saved to the server yet — those sections don't persist progress anywhere, so I can't show them here truthfully. Happy to build that tracking next if you want it included.
          <br />
          Matching works by mobile number — a tester only shows real data once their mobile here matches the number they actually log in with.
        </p>
      </div>
    </div>
  );
}
