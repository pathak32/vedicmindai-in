import React, { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

const card = { background:'rgba(255,255,255,0.9)', border:'1px solid rgba(30,64,175,0.1)', borderRadius:14, padding:20, boxShadow:'0 2px 12px rgba(0,0,0,0.05)', marginBottom:16 };
const btn = (color='#1e40af') => ({ padding:'8px 18px', borderRadius:9, background:color, color:'#fff', border:'none', cursor:'pointer', fontSize:13, fontWeight:600 });
const EXAM_TYPES = ['daily','weekly','olympiad','jee','neet','ssc','upsc','general'];
const DIFFICULTIES = [1,2,3,4,5];
const SUTRAS = ['Ekadhikena Purvena','Nikhilam','Anurupyena','Paravartya','Shunyam','Anurupye','Sankalana-Vyavakalanabhyam','Puranapuranabhyam','Calana-Kalanabhyam','Yavadunam','Vyashtisamanstih','Shesanyankena Charamena','Sopaantyadvayamantyam','Ekanyunena Purvena','Gunitasamuchyah','Gunakasamuchyah'];

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
    setGenResult('Generating questions via AI...');
    try {
      const prompt = `Generate ${genConfig.count} multiple-choice Vedic Mathematics questions for the sutra "${genConfig.sutra}".
Difficulty level: ${genConfig.difficulty}/5 (${genConfig.difficulty<=2?'Easy':genConfig.difficulty<=3?'Medium':genConfig.difficulty<=4?'Hard':'Expert'}).
Exam type: ${genConfig.exam_type.toUpperCase()}.

Return ONLY a valid JSON array, no markdown, no explanation. Format:
[{"question_text":"...","option_a":"...","option_b":"...","option_c":"...","option_d":"...","correct_answer":"a","explanation":"..."}]

Rules:
- Questions must involve actual numbers and calculations
- Each question must have exactly 4 options (a,b,c,d)
- correct_answer must be "a","b","c", or "d"
- Explanation must show the Vedic method step by step
- Difficulty ${genConfig.difficulty}: ${genConfig.difficulty<=2?'simple 2-digit numbers':genConfig.difficulty<=3?'3-digit numbers':genConfig.difficulty<=4?'4-digit numbers and fractions':'complex multi-step problems'}`;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'x-api-key':'', 'anthropic-version':'2023-06-01' },
        body: JSON.stringify({ model:'claude-sonnet-4-6', max_tokens:4000, messages:[{ role:'user', content:prompt }] })
      });
      const aiData = await res.json();
      const text = aiData.content?.[0]?.text || '';
      const clean = text.replace(/```json|```/g,'').trim();
      const parsed = JSON.parse(clean);

      const sb = await getSupabase();
      const rows = parsed.map(q => ({
        ...q,
        sutra: genConfig.sutra,
        difficulty: genConfig.difficulty,
        exam_type: genConfig.exam_type,
        topic: genConfig.sutra,
      }));
      const { error } = await sb.from('questions').insert(rows);
      if (error) throw error;

      setGenResult(`✅ ${parsed.length} questions generated and saved to Supabase!`);
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

  return (
    <div>
      {/* Generator */}
      <div style={card}>
        <h3 style={{ fontSize:16, fontWeight:600, marginBottom:16 }}>🤖 AI Question Generator</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:12, marginBottom:14 }}>
          <div>
            <label style={{ fontSize:12, color:'#6B7280', display:'block', marginBottom:4 }}>Sutra</label>
            <select value={genConfig.sutra} onChange={e=>setGenConfig(p=>({...p,sutra:e.target.value}))} style={{ width:'100%', padding:'7px 10px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13 }}>
              {SUTRAS.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, color:'#6B7280', display:'block', marginBottom:4 }}>Difficulty (1-5)</label>
            <select value={genConfig.difficulty} onChange={e=>setGenConfig(p=>({...p,difficulty:parseInt(e.target.value)}))} style={{ width:'100%', padding:'7px 10px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13 }}>
              {DIFFICULTIES.map(d=><option key={d} value={d}>{d} — {d<=2?'Easy':d<=3?'Medium':d<=4?'Hard':'Expert'}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, color:'#6B7280', display:'block', marginBottom:4 }}>Exam Type</label>
            <select value={genConfig.exam_type} onChange={e=>setGenConfig(p=>({...p,exam_type:e.target.value}))} style={{ width:'100%', padding:'7px 10px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13 }}>
              {EXAM_TYPES.map(t=><option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, color:'#6B7280', display:'block', marginBottom:4 }}>Count</label>
            <select value={genConfig.count} onChange={e=>setGenConfig(p=>({...p,count:parseInt(e.target.value)}))} style={{ width:'100%', padding:'7px 10px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13 }}>
              {[5,10,15,20].map(n=><option key={n} value={n}>{n} questions</option>)}
            </select>
          </div>
        </div>
        <button onClick={generateQuestions} disabled={generating} style={btn(generating?'#9CA3AF':'#7C3AED')}>
          {generating ? '⏳ Generating...' : '✨ Generate with AI'}
        </button>
        {genResult && <p style={{ marginTop:12, fontSize:13, color: genResult.startsWith('✅')?'#059669':'#DC2626' }}>{genResult}</p>}
      </div>

      {/* Filters + Table */}
      <div style={card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, flexWrap:'wrap', gap:8 }}>
          <h3 style={{ fontSize:16, fontWeight:600, margin:0 }}>Question Bank ({questions.length})</h3>
          <div style={{ display:'flex', gap:8 }}>
            <select value={filter.exam_type} onChange={e=>{setFilter(p=>({...p,exam_type:e.target.value}));setTimeout(loadQuestions,100);}} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:12 }}>
              <option value="all">All Types</option>
              {EXAM_TYPES.map(t=><option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
            <select value={filter.difficulty} onChange={e=>{setFilter(p=>({...p,difficulty:e.target.value}));setTimeout(loadQuestions,100);}} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:12 }}>
              <option value="all">All Levels</option>
              {DIFFICULTIES.map(d=><option key={d} value={d}>Level {d}</option>)}
            </select>
            <button onClick={loadQuestions} style={btn()}>Refresh</button>
          </div>
        </div>

        {loading ? <p style={{ color:'#6B7280', textAlign:'center', padding:40 }}>Loading...</p> :
         questions.length === 0 ? <p style={{ color:'#6B7280', textAlign:'center', padding:40 }}>No questions yet. Generate some above!</p> : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {questions.map((q,i) => (
              <div key={q.id} style={{ background:'#F9FAFB', borderRadius:10, padding:14, border:'1px solid #F3F4F6' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:6, marginBottom:6 }}>
                      <span style={{ background:'#EEF2FF', color:'#4338CA', fontSize:11, padding:'2px 8px', borderRadius:20, fontWeight:600 }}>{q.exam_type}</span>
                      <span style={{ background:'#FEF3C7', color:'#92400E', fontSize:11, padding:'2px 8px', borderRadius:20, fontWeight:600 }}>L{q.difficulty}</span>
                      <span style={{ background:'#F0FDF4', color:'#166534', fontSize:11, padding:'2px 8px', borderRadius:20 }}>{q.sutra}</span>
                    </div>
                    <p style={{ fontSize:13, fontWeight:600, margin:'0 0 6px', color:'#0A1628' }}>{q.question_text}</p>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4, fontSize:12, color:'#374151' }}>
                      {['a','b','c','d'].map(opt => (
                        <span key={opt} style={{ color: q.correct_answer===opt?'#059669':'inherit', fontWeight: q.correct_answer===opt?700:400 }}>
                          {opt.toUpperCase()}) {q[`option_${opt}`]}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button onClick={()=>deleteQuestion(q.id)} style={{ padding:'4px 10px', borderRadius:6, background:'#FEE2E2', color:'#DC2626', border:'none', cursor:'pointer', fontSize:12, flexShrink:0 }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
