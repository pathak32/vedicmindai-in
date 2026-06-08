import React, { useState } from 'react';

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

const STORAGE_KEY = 'vedicmind_admin_quiz_questions';

function loadQuestions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  // Default seed questions
  return [
    { id: 'q1', question: 'What is 15²?', options: ['125','215','225','235'], correct: 2, sutra: 'Ekadhikena Purvena', tip: 'For any number ending in 5: multiply the tens digit by one more, then append 25.' },
    { id: 'q2', question: 'What is 99 × 99?', options: ['9700','9801','9900','9999'], correct: 1, sutra: 'Nikhilam', tip: 'Deficit from 100 is 1. Cross: 99-1=98. Product of deficits: 01 → 9801.' },
    { id: 'q3', question: 'What is 1000 − 437?', options: ['553','563','573','663'], correct: 1, sutra: 'Nikhilam Navatashcaramam Dashatah', tip: 'All from 9, last from 10: 9-4=5, 9-3=6, 10-7=3 → 563.' },
    { id: 'q4', question: 'What is 23 × 11?', options: ['243','253','263','273'], correct: 1, sutra: 'Anurupyena', tip: 'Multiply by 11: write 2, middle digit 2+3=5, write 3 → 253.' },
    { id: 'q5', question: 'What is 75²?', options: ['5525','5625','5725','5825'], correct: 1, sutra: 'Ekadhikena Purvena', tip: '7×8=56, append 25 → 5625.' },
  ];
}

const BLANK_FORM = { question: '', options: ['', '', '', ''], correct: 0, sutra: '', tip: '' };

export default function AdminQuizManager() {
  const [questions, setQuestions] = useState(loadQuestions);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [search, setSearch] = useState('');
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
    setForm({ ...BLANK_FORM, options: ['', '', '', ''], id: `q_${Date.now()}` });
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

  const filtered = questions.filter(q =>
    !search || q.question.toLowerCase().includes(search.toLowerCase()) || q.sutra?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#4B5563' }}>{questions.length} quiz questions</div>
        <button onClick={startNew} style={{ minHeight: 40, padding: '0 20px', background: '#0A1628', color: 'white', border: 'none', borderRadius: 10, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>+ Add Question</button>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="🔍 Search questions..."
        style={{ ...INPUT_STYLE, marginBottom: 16 }}
      />

      {/* Edit/New form */}
      {editing && (
        <div style={{ ...glass, padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: '#0A1628', marginBottom: 16 }}>
            {editing === 'new' ? 'New Question' : 'Edit Question'}
          </h3>
          <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', display: 'block', marginBottom: 4 }}>Question Text *</label>
          <textarea style={{ ...INPUT_STYLE, height: 72, resize: 'vertical' }} value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} placeholder="Enter the question..." />

          <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', display: 'block', marginBottom: 8 }}>Options (select correct answer)</label>
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
          <input style={INPUT_STYLE} value={form.sutra || ''} onChange={e => setForm(f => ({ ...f, sutra: e.target.value }))} placeholder="e.g. Nikhilam" />
          <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', display: 'block', marginBottom: 4 }}>Vedic Tip / Explanation</label>
          <textarea style={{ ...INPUT_STYLE, height: 72, resize: 'vertical' }} value={form.tip || ''} onChange={e => setForm(f => ({ ...f, tip: e.target.value }))} placeholder="Explain the Vedic trick..." />

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button onClick={save} style={{ minHeight: 40, padding: '0 24px', background: '#10B981', color: 'white', border: 'none', borderRadius: 10, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Save</button>
            <button onClick={() => setEditing(null)} style={{ minHeight: 40, padding: '0 20px', background: 'transparent', border: '1.5px solid #D1D5DB', color: '#4B5563', borderRadius: 10, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Questions list */}
      <div style={{ ...glass, overflow: 'hidden' }}>
        {filtered.map((q, i) => (
          <div key={q.id} style={{ padding: '14px 16px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(30,64,175,0.06)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#9CA3AF', minWidth: 28, marginTop: 2 }}>Q{i + 1}</span>
              <div style={{ flex: 1 }}>
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
                {q.sutra && <span style={{ background: '#DBEAFE', color: '#1E40AF', borderRadius: 100, padding: '2px 10px', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 600 }}>{q.sutra}</span>}
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
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF', fontFamily: 'var(--font-body)' }}>No questions found.</div>}
      </div>
    </div>
  );
}