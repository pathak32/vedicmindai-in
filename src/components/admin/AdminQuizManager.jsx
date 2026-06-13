import React, { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

const card = { background:'rgba(255,255,255,0.9)', border:'1px solid rgba(30,64,175,0.1)', borderRadius:14, padding:20, boxShadow:'0 2px 12px rgba(0,0,0,0.05)', marginBottom:16 };
const btn = (color='#1e40af') => ({ padding:'8px 18px', borderRadius:9, background:color, color:'#fff', border:'none', cursor:'pointer', fontSize:13, fontWeight:600 });
const EXAM_TYPES = ['daily','weekly','olympiad','jee','neet','ssc','upsc','general'];
const DIFFICULTIES = [1,2,3,4,5];
const SUTRAS = ['Ekadhikena Purvena','Nikhilam Navatashcaramam Dashatah','Anurupyena','Paravartya Yojayet','Shunyam Saamyasamuccaye','Anurupye Shunyamanyat','Sankalana-Vyavakalanabhyam','Puranapuranabhyam','Chalana-Kalanabhyam','Yavadunam','Vyashtisamanstih','Shesanyankena Charamena','Sopaantyadvayamantyam','Ekanyunena Purvena','Gunitasamuchyah','Gunakasamuchyah'];

export default function AdminQuizManager() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter] = useState({ exam_type:'all', difficulty:'all' });
  const [genConfig, setGenConfig] = useState({ sutra: SUTRAS[0], difficulty:3, exam_type:'daily', count:10 });
  const [genResult, setGenResult] = useState('');

  useEffect(() => { loadQuestions(); }, []);

  async function loadQuestions() {
    setLoading(true);
    try {
      const sb = await getSupabase();
      let q = sb.from('questions').select('*').order('created_at', { ascending:false }).limit(100);
      if (filter.exam_type !== 'all') q = q.eq('exam_type', filter.exam_type);
      if (filter.difficulty !== 'all') q = q.eq('difficulty', parseInt(filter.difficulty));
      const { data, error } = await q;
      if (error) throw error;
      setQuestions(data || []);
    } catch(e) { console.error(e); setQuestions([]); }
    finally { setLoading(false); }
  }

  async function generateQuestions() {
    setGenerating(true);
    setGenResult('🤖 Generating questions via AI...');
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(genConfig)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API error');

      const sb = await getSupabase();
      const rows = data.questions.map(q => ({
        ...q,
        sutra: genConfig.sutra,
        difficulty: genConfig.difficulty,
        exam_type: genConfig.exam_type,
        topic: genConfig.sutra,
        is_active: true,
      }));
      const { error } = await sb.from('questions').insert(rows);
      if (error) throw error;

      setGenResult(`✅ ${data.questions.length} questions generated and saved!`);
      loadQuestions();
    } catch(e) {
      setGenResult(`❌ Error: ${e.message}`);
    } finally { setGenerating(false); }
  }

  async function deleteQuestion(id) {
    const sb = await getSupabase();
    await sb.from('questions').delete().eq('id', id);
    loadQuestions();
  }

  async function applyFilter() {
    await loadQuestions();
  }

  return (
    <div>
      {/* Generator */}
      <div style={card}>
        <h3 style={{ fontSize:16, fontWeight:600, marginBottom:4 }}>🤖 AI Question Generator</h3>
        <p style={{ fontSize:12, color:'#6B7280', marginBottom:16 }}>Select sutra, difficulty and exam type — AI will generate ready-to-use questions instantly.</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:12, marginBottom:14 }}>
          <div>
            <label style={{ fontSize:12, color:'#6B7280', display:'block', marginBottom:4 }}>Sutra</label>
            <select value={genConfig.sutra} onChange={e=>setGenConfig(p=>({...p,sutra:e.target.value}))} style={{ width:'100%', padding:'7px 10px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:12 }}>
              {SUTRAS.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, color:'#6B7280', display:'block', marginBottom:4 }}>Difficulty</label>
            <select value={genConfig.difficulty} onChange={e=>setGenConfig(p=>({...p,difficulty:parseInt(e.target.value)}))} style={{ width:'100%', padding:'7px 10px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:12 }}>
              {DIFFICULTIES.map(d=><option key={d} value={d}>{d} — {d<=2?'Easy':d<=3?'Medium':d<=4?'Hard':'Expert'}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, color:'#6B7280', display:'block', marginBottom:4 }}>Exam Type</label>
            <select value={genConfig.exam_type} onChange={e=>setGenConfig(p=>({...p,exam_type:e.target.value}))} style={{ width:'100%', padding:'7px 10px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:12 }}>
              {EXAM_TYPES.map(t=><option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, color:'#6B7280', display:'block', marginBottom:4 }}>Count</label>
            <select value={genConfig.count} onChange={e=>setGenConfig(p=>({...p,count:parseInt(e.target.value)}))} style={{ width:'100%', padding:'7px 10px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:12 }}>
              {[5,10,15,20].map(n=><option key={n} value={n}>{n} questions</option>)}
            </select>
          </div>
        </div>
        <button onClick={generateQuestions} disabled={generating} style={btn(generating?'#9CA3AF':'#7C3AED')}>
          {generating ? '⏳ Generating...' : '✨ Generate with AI'}
        </button>
        {genResult && <p style={{ marginTop:12, fontSize:13, color: genResult.startsWith('✅')?'#059669':genResult.startsWith('🤖')?'#1e40af':'#DC2626', fontWeight:500 }}>{genResult}</p>}
      </div>

      {/* Filters + Table */}
      <div style={card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, flexWrap:'wrap', gap:8 }}>
          <h3 style={{ fontSize:16, fontWeight:600, margin:0 }}>📚 Question Bank ({questions.length})</h3>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <select value={filter.exam_type} onChange={e=>setFilter(p=>({...p,exam_type:e.target.value}))} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:12 }}>
              <option value="all">All Types</option>
              {EXAM_TYPES.map(t=><option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
            <select value={filter.difficulty} onChange={e=>setFilter(p=>({...p,difficulty:e.target.value}))} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:12 }}>
              <option value="all">All Levels</option>
              {DIFFICULTIES.map(d=><option key={d} value={d}>Level {d}</option>)}
            </select>
            <button onClick={applyFilter} style={btn()}>Apply</button>
            <button onClick={loadQuestions} style={btn('#059669')}>Refresh</button>
          </div>
        </div>

        {loading ? (
          <p style={{ color:'#6B7280', textAlign:'center', padding:40 }}>Loading questions...</p>
        ) : questions.length === 0 ? (
          <div style={{ textAlign:'center', padding:40 }}>
            <p style={{ fontSize:32, marginBottom:8 }}>🤖</p>
            <p style={{ color:'#6B7280', marginBottom:4 }}>No questions yet.</p>
            <p style={{ color:'#9CA3AF', fontSize:12 }}>Use the AI Generator above to create your first batch!</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {questions.map((q) => (
              <div key={q.id} style={{ background:'#F9FAFB', borderRadius:10, padding:14, border:'1px solid #F3F4F6' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:6, marginBottom:6, flexWrap:'wrap' }}>
                      <span style={{ background:'#EEF2FF', color:'#4338CA', fontSize:11, padding:'2px 8px', borderRadius:20, fontWeight:600 }}>{q.exam_type?.toUpperCase()}</span>
                      <span style={{ background:'#FEF3C7', color:'#92400E', fontSize:11, padding:'2px 8px', borderRadius:20, fontWeight:600 }}>L{q.difficulty}</span>
                      <span style={{ background:'#F0FDF4', color:'#166534', fontSize:11, padding:'2px 8px', borderRadius:20 }}>{q.sutra}</span>
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
                  <button onClick={()=>deleteQuestion(q.id)} style={{ padding:'4px 10px', borderRadius:6, background:'#FEE2E2', color:'#DC2626', border:'none', cursor:'pointer', fontSize:12, flexShrink:0 }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
