import React, { useState, useEffect, useCallback } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

const card = { background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(30,64,175,0.1)', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 16 };
const btn = (color = '#1e40af') => ({ padding: '8px 18px', borderRadius: 9, background: color, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 });

const VERTICALS = ['All', 'Vedic Maths', 'Reasoning', 'Aptitude'];

export default function AdminQuestionReview() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [view, setView] = useState('pending'); // pending | approved | rejected
  const [verticalFilter, setVerticalFilter] = useState('All');

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

  const filtered = questions
    .filter((q) => q.status === view)
    .filter((q) => verticalFilter === 'All' || q.vertical === verticalFilter);

  const counts = {
    pending: questions.filter((q) => q.status === 'pending').length,
    approved: questions.filter((q) => q.status === 'approved').length,
    rejected: questions.filter((q) => q.status === 'rejected').length,
  };

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
        <select value={verticalFilter} onChange={(e) => setVerticalFilter(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(30,64,175,0.2)', fontSize: 12, fontWeight: 600, cursor: 'pointer', marginLeft: 'auto' }}>
          {VERTICALS.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      {statusMsg && <div style={{ ...card, background: '#FEE2E2' }}>{statusMsg}</div>}
      {loading && <p style={{ color: '#6B7280' }}>Loading…</p>}
      {!loading && filtered.length === 0 && <p style={{ color: '#9CA3AF' }}>Nothing here yet.</p>}

      {filtered.map((q) => (
        <div key={q.id} style={card}>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 6, fontWeight: 600 }}>
            {q.vertical} · {q.chapter_title} · Level {q.level}
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0A1628', marginBottom: 12 }}>{q.question_en}</div>
          <div style={{ display: 'grid', gap: 6, marginBottom: 12 }}>
            {(q.options || []).map((opt, i) => (
              <div key={i} style={{
                padding: '8px 12px', borderRadius: 8, fontSize: 13,
                background: i === q.correct_index ? '#ECFDF5' : '#F9FAFB',
                border: i === q.correct_index ? '1px solid #10B981' : '1px solid #E5E7EB',
                color: i === q.correct_index ? '#065F46' : '#374151',
                fontWeight: i === q.correct_index ? 700 : 400,
              }}>
                {String.fromCharCode(65 + i)}. {opt} {i === q.correct_index ? '✓' : ''}
              </div>
            ))}
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
