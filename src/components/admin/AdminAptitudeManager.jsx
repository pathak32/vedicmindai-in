import React, { useState } from 'react';
import { QUESTIONS as DEFAULT_QUESTIONS, CLASS_GROUPS } from '@/lib/aptitudeQuestions';

const glass = {
  background: 'rgba(255,255,255,0.85)',
  border: '1px solid rgba(30,64,175,0.12)',
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(10,22,40,0.06)',
};

const INPUT_STYLE = {
  width: '100%', border: '1.5px solid rgba(30,64,175,0.15)', borderRadius: 10,
  padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 14,
  color: '#0A1628', background: '#F8FAFF', outline: 'none',
  boxSizing: 'border-box', marginBottom: 12,
};

const STORAGE_KEY = 'vedicmind_admin_aptitude_questions';
const GROUPS = ['PRIMARY', 'MIDDLE', 'SECONDARY', 'INTERMEDIATE'];
const BLANK_FORM = { question: '', options: ['', '', '', ''], correct: 0, group: 'PRIMARY', topic: '', vedic_sutra: '', vedic_tip: '' };

function loadQuestions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [...DEFAULT_QUESTIONS];
}

export default function AdminAptitudeManager() {
  const [questions, setQuestions] = useState(loadQuestions);
  const [activeGroup, setActiveGroup] = useState('PRIMARY');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  function persist(qs) {
    setQuestions(qs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(qs));
  }

  function startEdit(q) {
    setForm({ ...q, options: [...q.options] });
    setEditing(q.id);
  }

  function startNew() {
    setForm({ ...BLANK_FORM, options: ['', '', '', ''], group: activeGroup, id: `apt_${Date.now()}` });
    setEditing('new');
  }

  function save() {
    if (!form.question.trim()) return;
    if (editing === 'new') {
      persist([...questions, form]);
    } else {
      persist(questions.map(q => q.id === editing ? form : q));
    }
    setEditing(null);
  }

  function deleteQ(id) {
    persist(questions.filter(q => q.id !== id));
    setDeleteConfirm(null);
  }

  const grouped = questions.filter(q => q.group === activeGroup);

  return (
    <div>
      {/* Group tabs */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 20 }}>
        {GROUPS.map(g => {
          const info = CLASS_GROUPS[g];
          const count = questions.filter(q => q.group === g).length;
          return (
            <button key={g} onClick={() => setActiveGroup(g)} style={{
              padding: '8px 16px', minHeight: 44, borderRadius: 10, border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
              background: activeGroup === g ? info.color : '#F0F4FF',
              color: activeGroup === g ? 'white' : '#4B5563', transition: 'all 0.15s',
            }}>{info.label} ({count})</button>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#4B5563' }}>{grouped.length} questions in {CLASS_GROUPS[activeGroup].label}</div>
        <button onClick={startNew} style={{ minHeight: 40, padding: '0 20px', background: '#0A1628', color: 'white', border: 'none', borderRadius: 10, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>+ Add Question</button>
      </div>

      {/* Edit/New form */}
      {editing && (
        <div style={{ ...glass, padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: '#0A1628', marginBottom: 16 }}>
            {editing === 'new' ? 'New Aptitude Question' : 'Edit Question'}
          </h3>
          <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', display: 'block', marginBottom: 4 }}>Class Group</label>
          <select style={{ ...INPUT_STYLE }} value={form.group} onChange={e => setForm(f => ({ ...f, group: e.target.value }))}>
            {GROUPS.map(g => <option key={g} value={g}>{CLASS_GROUPS[g].label}</option>)}
          </select>
          <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', display: 'block', marginBottom: 4 }}>Topic</label>
          <input style={INPUT_STYLE} value={form.topic || ''} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} placeholder="e.g. Addition, Fractions..." />
          <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', display: 'block', marginBottom: 4 }}>Question Text *</label>
          <textarea style={{ ...INPUT_STYLE, height: 72, resize: 'vertical' }} value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} placeholder="Enter the question..." />

          <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', display: 'block', marginBottom: 8 }}>Options (click letter to mark correct)</label>
          {form.options.map((opt, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
              <button
                onClick={() => setForm(f => ({ ...f, correct: i }))}
                style={{
                  width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0,
                  background: form.correct === i ? '#10B981' : '#F0F4FF',
                  color: form.correct === i ? 'white' : '#4B5563',
                  fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13,
                }}
              >{String.fromCharCode(65 + i)}</button>
              <input
                style={{ ...INPUT_STYLE, marginBottom: 0, flex: 1 }}
                value={opt}
                onChange={e => setForm(f => { const opts = [...f.options]; opts[i] = e.target.value; return { ...f, options: opts }; })}
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
              />
            </div>
          ))}

          <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', display: 'block', marginBottom: 4, marginTop: 4 }}>Vedic Sutra</label>
          <input style={INPUT_STYLE} value={form.vedic_sutra || ''} onChange={e => setForm(f => ({ ...f, vedic_sutra: e.target.value }))} placeholder="e.g. Nikhilam" />
          <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', display: 'block', marginBottom: 4 }}>Vedic Tip</label>
          <textarea style={{ ...INPUT_STYLE, height: 72, resize: 'vertical' }} value={form.vedic_tip || ''} onChange={e => setForm(f => ({ ...f, vedic_tip: e.target.value }))} placeholder="Explain the Vedic shortcut..." />

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button onClick={save} style={{ minHeight: 40, padding: '0 24px', background: '#10B981', color: 'white', border: 'none', borderRadius: 10, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Save</button>
            <button onClick={() => setEditing(null)} style={{ minHeight: 40, padding: '0 20px', background: 'transparent', border: '1.5px solid #D1D5DB', color: '#4B5563', borderRadius: 10, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Questions list */}
      <div style={{ ...glass, overflow: 'hidden' }}>
        {grouped.map((q, i) => (
          <div key={q.id} style={{ padding: '14px 16px', borderBottom: i < grouped.length - 1 ? '1px solid rgba(30,64,175,0.06)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#9CA3AF', minWidth: 28, marginTop: 2 }}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                {q.topic && <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: CLASS_GROUPS[q.group]?.color || '#4B5563', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{q.topic}</div>}
                <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: '#0A1628', marginBottom: 6 }}>{q.question}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                  {q.options.map((opt, oi) => (
                    <span key={oi} style={{
                      background: oi === q.correct ? '#D1FAE5' : '#F0F4FF',
                      color: oi === q.correct ? '#065F46' : '#4B5563',
                      borderRadius: 6, padding: '3px 10px', fontSize: 12, fontFamily: 'var(--font-body)',
                      fontWeight: oi === q.correct ? 700 : 400,
                    }}>{String.fromCharCode(65 + oi)}: {opt}</span>
                  ))}
                </div>
                {q.vedic_sutra && <span style={{ background: '#DBEAFE', color: '#1E40AF', borderRadius: 100, padding: '2px 10px', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 600 }}>{q.vedic_sutra}</span>}
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => startEdit(q)} style={{ minHeight: 44, padding: '0 14px', background: '#F0F4FF', color: '#1E40AF', border: 'none', borderRadius: 8, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Edit</button>
                {deleteConfirm === q.id ? (
                  <>
                    <button onClick={() => deleteQ(q.id)} style={{ minHeight: 44, padding: '0 14px', background: '#EF4444', color: 'white', border: 'none', borderRadius: 8, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Confirm</button>
                    <button onClick={() => setDeleteConfirm(null)} style={{ minHeight: 44, padding: '0 10px', background: 'transparent', border: '1px solid #D1D5DB', color: '#4B5563', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 13, cursor: 'pointer' }}>✕</button>
                  </>
                ) : (
                  <button onClick={() => setDeleteConfirm(q.id)} style={{ minHeight: 44, padding: '0 14px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: 8, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Delete</button>
                )}
              </div>
            </div>
          </div>
        ))}
        {grouped.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF', fontFamily: 'var(--font-body)' }}>No questions in this group yet.</div>}
      </div>
    </div>
  );
}