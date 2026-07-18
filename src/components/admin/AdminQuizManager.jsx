import React, { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/lib/LanguageContext';
import { CURRICULUM } from '@/components/learn/curriculumData';

const card = { background:'rgba(255,255,255,0.9)', border:'1px solid rgba(30,64,175,0.1)', borderRadius:14, padding:20, boxShadow:'0 2px 12px rgba(0,0,0,0.05)', marginBottom:16 };
const btn = (color='#1e40af') => ({ padding:'8px 18px', borderRadius:9, background:color, color:'#fff', border:'none', cursor:'pointer', fontSize:13, fontWeight:600 });
const EXAM_TYPES = ['daily','weekly','olympiad','jee','neet','ssc','upsc','general'];
const DIFFICULTIES = [1,2,3,4,5];

function bandForDifficulty(d) {
  return d <= 2 ? 'easy' : d <= 3 ? 'medium' : 'hard';
}

function flattenLessonsForPicker() {
  return CURRICULUM.flatMap(level => level.lessons.map(l => ({ id: l.id, label: `${l.id} — ${l.title || l.name || ''}`.trim() })));
}
const LESSON_OPTIONS = flattenLessonsForPicker();

export default function AdminQuizManager() {
  const { t } = useLanguage();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ exam_type:'all', difficulty:'all' });
  const [promoting, setPromoting] = useState({});
  const [statusMsg, setStatusMsg] = useState('');
  const [selectedLesson, setSelectedLesson] = useState(LESSON_OPTIONS[0]?.id || '');

  // Manual question entry state
  const [manualQ, setManualQ] = useState({
    lesson_id: LESSON_OPTIONS[0]?.id || '',
    question_text: '', option_a: '', option_b: '', option_c: '', option_d: '',
    correct_answer: 'a', explanation: '', difficulty: 3, exam_type: 'daily',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadQuestions(); }, []);

  async function loadQuestions() {
    setLoading(true);
    try {
      const sb = await getSupabase();
      let q = sb.from('questions').select('*').order('created_at', { ascending:false }).limit(200);
      if (filter.exam_type !== 'all') q = q.eq('exam_type', filter.exam_type);
      if (filter.difficulty !== 'all') q = q.eq('difficulty', parseInt(filter.difficulty));
      const { data, error } = await q;
      if (error) throw error;
      setQuestions(data || []);
    } catch(e) { console.error(e); setQuestions([]); }
    finally { setLoading(false); }
  }

  async function saveManualQuestion() {
    if (!manualQ.question_text.trim() || !manualQ.option_a || !manualQ.option_b || !manualQ.option_c || !manualQ.option_d) {
      setStatusMsg('❌ Please fill in the question and all four options.'); return;
    }
    setSaving(true);
    setStatusMsg('💾 Saving...');
    try {
      const sb = await getSupabase();
      const { error } = await sb.from('questions').insert({
        ...manualQ,
        difficulty: parseInt(manualQ.difficulty),
        is_active: false, // pending review by default
        source: 'manual',
      });
      if (error) throw error;
      setStatusMsg('✅ Question saved — review it below and promote when ready.');
      setManualQ({ ...manualQ, question_text:'', option_a:'', option_b:'', option_c:'', option_d:'', explanation:'' });
      loadQuestions();
    } catch(e) {
      setStatusMsg(`❌ Error: ${e.message}`);
    } finally { setSaving(false); }
  }

  async function deleteQuestion(id) {
    const sb = await getSupabase();
    await sb.from('questions').delete().eq('id', id);
    setStatusMsg('🗑️ Question deleted.');
    loadQuestions();
  }

  async function promoteQuestion(q) {
    setPromoting(p => ({ ...p, [q.id]: true }));
    try {
      const sb = await getSupabase();
      const lessonId = q.lesson_id || selectedLesson;
      if (!lessonId) throw new Error('No lesson selected — cannot promote without a lesson_id.');
      const { error } = await sb.from('quiz_questions').insert({
        lesson_id: lessonId,
        question_text: q.question_text,
        option_a: q.option_a, option_b: q.option_b, option_c: q.option_c, option_d: q.option_d,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        difficulty: bandForDifficulty(q.difficulty),
        quiz_type: 'daily',
        status: 'approved',
        source: q.source || 'manual',
        used_count: 0,
      });
      if (error) throw error;
      // Mark as active in staging table too
      await sb.from('questions').update({ is_active: true }).eq('id', q.id);
      setStatusMsg(`✅ Promoted "${q.question_text.slice(0, 50)}..." to live quiz.`);
      loadQuestions();
    } catch (e) {
      setStatusMsg(`❌ Promote failed: ${e.message}`);
    } finally {
      setPromoting(p => ({ ...p, [q.id]: false }));
    }
  }

  const inputStyle = { width:'100%', padding:'7px 10px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13, boxSizing:'border-box' };
  const labelStyle = { fontSize:12, color:'#6B7280', display:'block', marginBottom:4, fontWeight:500 };

  return (
    <div>
      {/* Manual question entry */}
      <div style={card}>
        <h3 style={{ fontSize:16, fontWeight:700, marginBottom:4, color:'#0A1628' }}>✏️ Add New Question</h3>
        <p style={{ fontSize:12, color:'#6B7280', marginBottom:16 }}>
          Enter a verified question — it goes into a staging bank first, then you promote it to the live quiz when ready.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:12, marginBottom:12 }}>
          <div>
            <label style={labelStyle}>Lesson</label>
            <select value={manualQ.lesson_id} onChange={e=>setManualQ(p=>({...p,lesson_id:e.target.value}))} style={inputStyle}>
              {LESSON_OPTIONS.map(l=><option key={l.id} value={l.id}>{l.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Exam Type</label>
            <select value={manualQ.exam_type} onChange={e=>setManualQ(p=>({...p,exam_type:e.target.value}))} style={inputStyle}>
              {EXAM_TYPES.map(t=><option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Difficulty</label>
            <select value={manualQ.difficulty} onChange={e=>setManualQ(p=>({...p,difficulty:parseInt(e.target.value)}))} style={inputStyle}>
              {DIFFICULTIES.map(d=><option key={d} value={d}>{d} — {d<=2?'Easy':d<=3?'Medium':d<=4?'Hard':'Expert'}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Correct Answer</label>
            <select value={manualQ.correct_answer} onChange={e=>setManualQ(p=>({...p,correct_answer:e.target.value}))} style={inputStyle}>
              {['a','b','c','d'].map(o=><option key={o} value={o}>Option {o.toUpperCase()}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom:10 }}>
          <label style={labelStyle}>Question Text</label>
          <textarea value={manualQ.question_text} onChange={e=>setManualQ(p=>({...p,question_text:e.target.value}))} rows={2} style={{ ...inputStyle, resize:'vertical' }} placeholder="e.g. Calculate 97 × 94 using Nikhilam Sutra" />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
          {['a','b','c','d'].map(opt=>(
            <div key={opt}>
              <label style={{ ...labelStyle, color: manualQ.correct_answer===opt ? '#059669' : '#6B7280' }}>
                Option {opt.toUpperCase()} {manualQ.correct_answer===opt ? '✅ (correct)' : ''}
              </label>
              <input value={manualQ[`option_${opt}`]} onChange={e=>setManualQ(p=>({...p,[`option_${opt}`]:e.target.value}))} style={{ ...inputStyle, borderColor: manualQ.correct_answer===opt ? '#059669' : '#E5E7EB' }} placeholder={`Option ${opt.toUpperCase()}`} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={labelStyle}>Explanation (optional but recommended)</label>
          <textarea value={manualQ.explanation} onChange={e=>setManualQ(p=>({...p,explanation:e.target.value}))} rows={2} style={{ ...inputStyle, resize:'vertical' }} placeholder="Step-by-step explanation of the Vedic method used..." />
        </div>
        <button onClick={saveManualQuestion} disabled={saving} style={btn(saving?'#9CA3AF':'#059669')}>
          {saving ? '⏳ Saving...' : '💾 Save to Staging Bank'}
        </button>
        {statusMsg && <p style={{ marginTop:12, fontSize:13, color: statusMsg.startsWith('✅')?'#059669':statusMsg.startsWith('❌')?'#DC2626':'#1e40af', fontWeight:500 }}>{statusMsg}</p>}
      </div>

      {/* Question bank browser */}
      <div style={card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, flexWrap:'wrap', gap:8 }}>
          <h3 style={{ fontSize:16, fontWeight:700, margin:0, color:'#0A1628' }}>📚 Staging Bank ({questions.length})</h3>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <select value={filter.exam_type} onChange={e=>setFilter(p=>({...p,exam_type:e.target.value}))} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:12 }}>
              <option value="all">All Types</option>
              {EXAM_TYPES.map(type=><option key={type} value={type}>{type.toUpperCase()}</option>)}
            </select>
            <select value={filter.difficulty} onChange={e=>setFilter(p=>({...p,difficulty:e.target.value}))} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:12 }}>
              <option value="all">All Levels</option>
              {DIFFICULTIES.map(d=><option key={d} value={d}>Level {d}</option>)}
            </select>
            <button onClick={loadQuestions} style={btn()}>Refresh</button>
          </div>
        </div>

        {loading ? (
          <p style={{ color:'#6B7280', textAlign:'center', padding:40 }}>Loading...</p>
        ) : questions.length === 0 ? (
          <div style={{ textAlign:'center', padding:40 }}>
            <p style={{ fontSize:32, marginBottom:8 }}>✏️</p>
            <p style={{ color:'#6B7280' }}>No questions in staging yet.</p>
            <p style={{ color:'#9CA3AF', fontSize:12 }}>Add questions above — they'll appear here for review before going live.</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {questions.map((q) => (
              <div key={q.id} style={{ background: q.is_active ? '#F0FDF4' : '#F9FAFB', borderRadius:10, padding:14, border:`1px solid ${q.is_active ? '#BBF7D0' : '#F3F4F6'}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:6, marginBottom:6, flexWrap:'wrap' }}>
                      <span style={{ background:'#EEF2FF', color:'#4338CA', fontSize:11, padding:'2px 8px', borderRadius:20, fontWeight:600 }}>{q.exam_type?.toUpperCase()}</span>
                      <span style={{ background:'#FEF3C7', color:'#92400E', fontSize:11, padding:'2px 8px', borderRadius:20, fontWeight:600 }}>L{q.difficulty}</span>
                      {q.lesson_id && <span style={{ background:'#EFF6FF', color:'#1D4ED8', fontSize:11, padding:'2px 8px', borderRadius:20, fontWeight:600 }}>{q.lesson_id}</span>}
                      {q.is_active && <span style={{ background:'#D1FAE5', color:'#065F46', fontSize:11, padding:'2px 8px', borderRadius:20, fontWeight:700 }}>✅ LIVE</span>}
                    </div>
                    <p style={{ fontSize:13, fontWeight:600, margin:'0 0 8px', color:'#0A1628' }}>{q.question_text}</p>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4, fontSize:12 }}>
                      {['a','b','c','d'].map(opt => (
                        <span key={opt} style={{ color: q.correct_answer===opt?'#059669':'#374151', fontWeight: q.correct_answer===opt?700:400, background: q.correct_answer===opt?'#F0FDF4':'transparent', padding:'2px 6px', borderRadius:4 }}>
                          {opt.toUpperCase()}) {q[`option_${opt}`]}
                        </span>
                      ))}
                    </div>
                    {q.explanation && <p style={{ fontSize:11, color:'#6B7280', marginTop:8, fontStyle:'italic' }}>💡 {q.explanation}</p>}
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:6, flexShrink:0 }}>
                    {!q.is_active && (
                      <button onClick={()=>promoteQuestion(q)} disabled={promoting[q.id]} style={{ padding:'5px 12px', borderRadius:6, background: promoting[q.id]?'#D1D5DB':'#DCFCE7', color:'#166534', border:'none', cursor:'pointer', fontSize:12, fontWeight:700 }}>
                        {promoting[q.id] ? '⏳' : '✅ Promote'}
                      </button>
                    )}
                    <button onClick={()=>deleteQuestion(q.id)} style={{ padding:'5px 12px', borderRadius:6, background:'#FEE2E2', color:'#DC2626', border:'none', cursor:'pointer', fontSize:12 }}>🗑️ Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
