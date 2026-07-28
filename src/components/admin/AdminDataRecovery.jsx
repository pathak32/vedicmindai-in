import React, { useState } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import { reconcileProgressFromLedger } from '@/lib/supabaseDataService';

// Turns the manual multi-table Supabase digging Hitesh and Claude did on
// 28-Jul-2026 (tracing a lost-progress report through profiles → progress →
// reasoning_progress → knowledge_points_ledger) into a repeatable one-click
// tool, so future "my progress disappeared" reports don't need a full
// investigation session every time.
export default function AdminDataRecovery() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [recovering, setRecovering] = useState(false);
  const [recoverMsg, setRecoverMsg] = useState('');

  async function handleSearch() {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError('');
    setResult(null);
    setRecoverMsg('');
    try {
      const supabase = await getSupabase();

      // Look up by mobile number or full name (same fields AdminStudents
      // already searches by, same table).
      const { data: matches, error: searchErr } = await supabase
        .from('profiles')
        .select('id, full_name, mobile, plan')
        .or(`mobile.ilike.%${q}%,full_name.ilike.%${q}%`)
        .limit(5);
      if (searchErr) throw searchErr;
      if (!matches || matches.length === 0) {
        setError('No matching user found by that name or mobile number.');
        setLoading(false);
        return;
      }
      // Use the first/best match — good enough for a support tool where a
      // human reviews the result before acting.
      const user = matches[0];

      const [progressRes, ledgerRes, reasoningRes, aptitudeRes] = await Promise.all([
        supabase.from('progress').select('completed_lessons, current_level').eq('user_id', user.id).maybeSingle(),
        supabase.from('knowledge_points_ledger').select('reference_id')
          .eq('user_id', user.id).eq('source', 'lesson_completion'),
        supabase.from('reasoning_progress').select('chapter_id, completed').eq('user_id', user.id),
        supabase.from('aptitude_progress').select('chapter_id, completed').eq('user_id', user.id),
      ]);

      const completedLessons = progressRes.data?.completed_lessons || [];
      const ledgerLessonIds = [...new Set((ledgerRes.data || []).map(r => r.reference_id).filter(Boolean))];
      const missingFromProgress = ledgerLessonIds.filter(id => !completedLessons.includes(id));

      const reasoningCompleted = (reasoningRes.data || []).filter(r => r.completed).length;
      const aptitudeCompleted = (aptitudeRes.data || []).filter(r => r.completed).length;

      setResult({
        user,
        completedLessons,
        ledgerLessonIds,
        missingFromProgress,
        reasoningCompleted,
        aptitudeCompleted,
        reasoningRows: reasoningRes.data?.length || 0,
        aptitudeRows: aptitudeRes.data?.length || 0,
      });
    } catch (e) {
      setError(e.message || 'Search failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRecover() {
    if (!result?.user?.id) return;
    setRecovering(true);
    setRecoverMsg('');
    try {
      const healed = await reconcileProgressFromLedger(result.user.id);
      if (healed) {
        setRecoverMsg(`✅ Recovered — progress rebuilt from the ledger, now ${healed.length} completed lesson(s).`);
        setResult(r => ({ ...r, completedLessons: healed, missingFromProgress: [] }));
      } else {
        setRecoverMsg('Nothing to recover — the ledger and progress record were already consistent.');
      }
    } catch (e) {
      setRecoverMsg('Recovery failed: ' + (e.message || 'unknown error'));
    } finally {
      setRecovering(false);
    }
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, marginBottom: 6 }}>🩺 Data Recovery</h2>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B7280', marginBottom: 16 }}>
        Search a student by name or mobile number to check whether their Vedic Maths progress record
        matches their permanent point-earning history. If it's fallen behind (the exact incident this
        tool was built for, 28-Jul-2026), you can rebuild it here in one click.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Mobile number or name..."
          style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 14 }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#1E40AF', color: 'white', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && (
        <div style={{ padding: 12, borderRadius: 8, background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
            {result.user.full_name || '(no name)'} — {result.user.mobile}
          </div>
          <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 16 }}>
            Plan: {result.user.plan || 'free'} · User ID: {result.user.id}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ padding: 12, borderRadius: 8, background: '#F9FAFB' }}>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Vedic Maths — progress record</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{result.completedLessons.length} lessons</div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: '#F9FAFB' }}>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Vedic Maths — ledger history (real)</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{result.ledgerLessonIds.length} lessons</div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: '#F9FAFB' }}>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Reasoning</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{result.reasoningCompleted} / {result.reasoningRows} completed</div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: '#F9FAFB' }}>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Aptitude</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{result.aptitudeCompleted} / {result.aptitudeRows} completed</div>
            </div>
          </div>

          {result.missingFromProgress.length > 0 ? (
            <div style={{ padding: 14, borderRadius: 8, background: '#FFFBEB', border: '1px solid #FDE68A', marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#92400E', marginBottom: 4 }}>
                ⚠️ Mismatch found — {result.missingFromProgress.length} lesson(s) in the permanent ledger aren't
                reflected in the progress record.
              </div>
              <div style={{ fontSize: 12, color: '#92400E', fontFamily: 'monospace' }}>
                {result.missingFromProgress.join(', ')}
              </div>
            </div>
          ) : (
            <div style={{ padding: 14, borderRadius: 8, background: '#ECFDF5', border: '1px solid #A7F3D0', marginBottom: 12, fontSize: 13, color: '#065F46', fontWeight: 600 }}>
              ✅ Consistent — no mismatch detected between the ledger and the progress record.
            </div>
          )}

          {result.missingFromProgress.length > 0 && (
            <button
              onClick={handleRecover}
              disabled={recovering}
              style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#059669', color: 'white', fontWeight: 600, cursor: recovering ? 'not-allowed' : 'pointer' }}
            >
              {recovering ? 'Recovering...' : `Recover ${result.missingFromProgress.length} lesson(s) from ledger`}
            </button>
          )}
          {recoverMsg && (
            <div style={{ marginTop: 10, fontSize: 13, color: '#374151' }}>{recoverMsg}</div>
          )}
        </div>
      )}
    </div>
  );
}
