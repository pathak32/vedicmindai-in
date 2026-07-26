import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

const card = { background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(30,64,175,0.1)', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 16 };
const btn = (color = '#1e40af') => ({ padding: '8px 18px', borderRadius: 9, background: color, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 });

// Pre-K / picture-based content (emoji options) needs to render much larger than
// normal text — small emoji are genuinely hard for young children to see and
// distinguish. Detects options that are mostly emoji/symbols vs normal words.
function isVisualOption(opt) {
  if (typeof opt !== 'string') return false; // image-object options are never "visual emoji" style
  const stripped = opt.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]/gu, '');
  return stripped.length <= 2; // little or no regular text left after stripping emoji
}

const VERTICALS = ['All', 'Vedic Maths', 'Reasoning', 'Aptitude'];

export default function AdminQuestionReview() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [view, setView] = useState('pending'); // pending | approved | rejected
  const [verticalFilter, setVerticalFilter] = useState('All');
  const [chapterFilter, setChapterFilter] = useState('All');

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const sb = await getSupabase();
      const { data, error } = await sb.from('pending_questions').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setQuestions(data || []);
    } catch (e) {
      setStatusMsg('Could not load questions — has pending_questions_schema.sql been run in Supabase yet?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  async function setStatus(id, status) {
    const sb = await getSupabase();
    await sb.from('pending_questions').update({ status, reviewed_at: new Date().toISOString() }).eq('id', id);
    loadQuestions();
  }

  async function deleteQuestion(id) {
    if (!confirm('Delete this question permanently?')) return;
    const sb = await getSupabase();
    await sb.from('pending_questions').delete().eq('id', id);
    loadQuestions();
  }

  async function bulkApproveChapter() {
    if (chapterFilter === 'All') return;
    const idsToApprove = questions.filter((q) => q.status === 'pending' && `${q.chapter_id}|${q.level}` === chapterFilter).map((q) => q.id);
    if (idsToApprove.length === 0) return;
    if (!confirm(`Approve all ${idsToApprove.length} pending questions in this chapter?`)) return;
    const sb = await getSupabase();
    await sb.from('pending_questions').update({ status: 'approved', reviewed_at: new Date().toISOString() }).in('id', idsToApprove);
    loadQuestions();
  }

  // Build the chapter dropdown options from whatever chapters actually exist in
  // the currently vertical-filtered data — grouped by chapter_id+level so L1 and
  // L2 versions of the same chapter name show as separate entries.
  const chapterOptions = useMemo(() => {
    const scoped = verticalFilter === 'All' ? questions : questions.filter((q) => q.vertical === verticalFilter);
    const seen = new Map();
    scoped.forEach((q) => {
      const key = `${q.chapter_id}|${q.level}`;
      if (!seen.has(key)) {
        seen.set(key, { key, label: `${q.chapter_title} (Level ${q.level})`, chapter_id: q.chapter_id, level: q.level });
      }
    });
    return Array.from(seen.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [questions, verticalFilter]);

  // Reset chapter filter if it no longer applies after switching vertical
  useEffect(() => {
    if (chapterFilter !== 'All' && !chapterOptions.some((c) => c.key === chapterFilter)) {
      setChapterFilter('All');
    }
  }, [chapterOptions, chapterFilter]);

  const filtered = questions
    .filter((q) => q.status === view)
    .filter((q) => verticalFilter === 'All' || q.vertical === verticalFilter)
    .filter((q) => chapterFilter === 'All' || `${q.chapter_id}|${q.level}` === chapterFilter);

  const counts = {
    pending: questions.filter((q) => q.status === 'pending').length,
    approved: questions.filter((q) => q.status === 'approved').length,
    rejected: questions.filter((q) => q.status === 'rejected').length,
  };

  const chapterPendingCount = chapterFilter === 'All' ? 0 : questions.filter((q) => q.status === 'pending' && `${q.chapter_id}|${q.level}` === chapterFilter).length;

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {[
          { id: 'pending', label: `🕒 Pending (${counts.pending})` },
          { id: 'approved', label: `✅ Approved (${counts.approved})` },
          { id: 'rejected', label: `❌ Rejected (${counts.rejected})` },
        ].map((v) => (
          <button key={v.id} onClick={() => setView(v.id)} style={btn(view === v.id ? '#1e40af' : '#9CA3AF')}>{v.label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={verticalFilter} onChange={(e) => setVerticalFilter(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(30,64,175,0.2)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          {VERTICALS.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>

        <select value={chapterFilter} onChange={(e) => setChapterFilter(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(30,64,175,0.2)', fontSize: 12, fontWeight: 600, cursor: 'pointer', minWidth: 220 }}>
          <option value="All">All Chapters ({chapterOptions.length} available)</option>
          {chapterOptions.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>

        {chapterFilter !== 'All' && view === 'pending' && chapterPendingCount > 0 && (
          <button onClick={bulkApproveChapter} style={btn('#10B981')}>
            ✅ Approve all {chapterPendingCount} in this chapter
          </button>
        )}
      </div>

      {statusMsg && <div style={{ ...card, background: '#FEE2E2' }}>{statusMsg}</div>}
      {loading && <p style={{ color: '#6B7280' }}>Loading…</p>}
      {!loading && filtered.length === 0 && <p style={{ color: '#9CA3AF' }}>Nothing here yet.</p>}

      {filtered.map((q) => (
        <div key={q.id} style={card}>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 6, fontWeight: 600 }}>
            {q.vertical} · {q.chapter_title} · Level {q.level} · <span style={{
              color: q.difficulty === 'hard' ? '#DC2626' : q.difficulty === 'easy' ? '#059669' : '#D97706',
              fontWeight: 700, textTransform: 'uppercase',
            }}>{q.difficulty || 'medium'}</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0A1628', marginBottom: 12 }}>{q.question_en}</div>
          {q.display_image && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {Array.from({ length: q.display_count || 1 }).map((_, i) => (
                <img key={i} src={q.display_image} alt="" style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8, border: '1px solid #E5E7EB' }} />
              ))}
            </div>
          )}
          <div style={{ display: 'grid', gap: 6, marginBottom: 12 }}>
            {(q.options || []).map((opt, i) => {
              const isImageOption = opt && typeof opt === 'object' && opt.image;
              const visual = !isImageOption && isVisualOption(opt);
              return (
                <div key={i} style={{
                  padding: isImageOption ? '10px 12px' : (visual ? '16px 12px' : '8px 12px'), borderRadius: 8,
                  fontSize: visual ? 40 : 13,
                  background: i === q.correct_index ? '#ECFDF5' : '#F9FAFB',
                  border: i === q.correct_index ? '1px solid #10B981' : '1px solid #E5E7EB',
                  color: i === q.correct_index ? '#065F46' : '#374151',
                  fontWeight: i === q.correct_index ? 700 : 400,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700, opacity: 0.6 }}>{String.fromCharCode(65 + i)}.</span>
                  {isImageOption ? (
                    <>
                      <img src={opt.image} alt={opt.label} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }} />
                      <span style={{ fontSize: 14 }}>{opt.label}</span>
                    </>
                  ) : (
                    <span>{opt}</span>
                  )}
                  {i === q.correct_index && <span style={{ fontSize: 16 }}>✓</span>}
                </div>
              );

            })}
          </div>
          <div style={{ fontSize: 13, color: '#4B5563', background: '#F9FAFB', borderRadius: 8, padding: '10px 12px', marginBottom: 14 }}>
            <strong>Explanation:</strong> {q.explanation}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {view !== 'approved' && <button onClick={() => setStatus(q.id, 'approved')} style={btn('#10B981')}>Approve</button>}
            {view !== 'rejected' && <button onClick={() => setStatus(q.id, 'rejected')} style={btn('#F59E0B')}>Reject</button>}
            {view !== 'pending' && <button onClick={() => setStatus(q.id, 'pending')} style={btn('#6366F1')}>Back to Pending</button>}
            <button onClick={() => deleteQuestion(q.id)} style={btn('#EF4444')}>Delete</button>
          </div>
        </div>
      ))}

      <div style={{ ...card, background: 'rgba(30,64,175,0.05)', border: '1px solid rgba(30,64,175,0.15)' }}>
        <p style={{ fontSize: 12, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
          <strong>Note:</strong> Approving a question here marks it ready — it doesn't yet automatically appear in the live app quiz. Once you've approved a batch, ask Claude in chat to merge the approved set into the real chapter's question bank.
        </p>
      </div>
    </div>
  );
}
