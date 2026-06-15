import React, { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/lib/LanguageContext';

const card = { background:'rgba(255,255,255,0.9)', border:'1px solid rgba(30,64,175,0.1)', borderRadius:14, padding:20, boxShadow:'0 2px 12px rgba(0,0,0,0.05)', marginBottom:16 };

export default function AdminAnalytics() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizResults, setQuizResults] = useState([]);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
  const { t } = useLanguage();
    setLoading(true);
    try {
      const sb = await getSupabase();

      const [usersRes, progressRes, quizRes] = await Promise.all([
        sb.from('profiles').select('id, plan, created_at, xp', { count:'exact' }),
        sb.from('progress').select('lesson_id, completed, user_id'),
        sb.from('quiz_results').select('score, user_id, created_at').order('created_at', { ascending:false }).limit(50),
      ]);

      const users = usersRes.data || [];
      const progress = progressRes.data || [];
      const quiz = quizRes.data || [];

      const totalXP = users.reduce((a,u)=>a+(u.xp||0), 0);
      const completedLessons = progress.filter(p=>p.completed).length;
      const avgScore = quiz.length > 0 ? Math.round(quiz.reduce((a,q)=>a+(q.score||0),0)/quiz.length) : 0;

      setStats({
        totalUsers: users.length,
        proUsers: users.filter(u=>u.plan==='pro').length,
        basicUsers: users.filter(u=>u.plan==='basic').length,
        totalXP,
        completedLessons,
        avgQuizScore: avgScore,
        totalQuizAttempts: quiz.length,
        newToday: users.filter(u => {
          const d = new Date(u.created_at);
          const today = new Date();
          return d.toDateString() === today.toDateString();
        }).length,
      });
      setQuizResults(quiz.slice(0,10));
    } catch(e) {
      console.error('AdminAnalytics:', e);
    } finally { setLoading(false); }
  }

  if (loading) return <p style={{ color:'#6B7280', textAlign:'center', padding:60 }}>Loading analytics from Supabase...</p>;
  if (!stats) return <p style={{ color:'#E11D48', textAlign:'center', padding:60 }}>Failed to load analytics</p>;

  const metrics = [
    { label:'👥 Total Users', value: stats.totalUsers, color:'#1e40af' },
    { label:'🆕 Joined Today', value: stats.newToday, color:'#059669' },
    { label:'⭐ Pro Subscribers', value: stats.proUsers, color:'#7C3AED' },
    { label:'📚 Basic Subscribers', value: stats.basicUsers, color:'#D97706' },
    { label:'⚡ Total XP Earned', value: stats.totalXP.toLocaleString(), color:'#DC2626' },
    { label:'📖 Lessons Completed', value: stats.completedLessons, color:'#0891B2' },
    { label:'🧠 Quiz Attempts', value: stats.totalQuizAttempts, color:'#7C3AED' },
    { label:'📊 Avg Quiz Score', value: `${stats.avgQuizScore}%`, color:'#059669' },
  ];

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:12, marginBottom:20 }}>
        {metrics.map((m,i) => (
          <div key={i} style={card}>
            <div style={{ fontSize:12, color:'#6B7280', marginBottom:4 }}>{m.label}</div>
            <div style={{ fontSize:26, fontWeight:700, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <h3 style={{ fontSize:16, fontWeight:600, margin:0 }}>Recent Quiz Attempts</h3>
          <button onClick={loadData} style={{ padding:'5px 12px', borderRadius:8, background:'#1e40af', color:'#fff', border:'none', cursor:'pointer', fontSize:12 }}>{t('refresh')}</button>
        </div>
        {quizResults.length === 0 ? <p style={{ color:'#6B7280' }}>No quiz data yet</p> : (
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ background:'#F9FAFB' }}>
                {['User ID','Score','Date'].map(h=>(
                  <th key={h} style={{ padding:'8px 12px', textAlign:'left', fontWeight:600, color:'#374151', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quizResults.map((q,i)=>(
                <tr key={i} style={{ background:i%2===0?'#fff':'#F9FAFB' }}>
                  <td style={{ padding:'8px 12px', borderBottom:'1px solid #F3F4F6', fontFamily:'monospace', fontSize:11, color:'#6B7280' }}>{q.user_id?.slice(0,8)}...</td>
                  <td style={{ padding:'8px 12px', borderBottom:'1px solid #F3F4F6', fontWeight:700, color: q.score>=80?'#059669':q.score>=50?'#D97706':'#DC2626' }}>{q.score}%</td>
                  <td style={{ padding:'8px 12px', borderBottom:'1px solid #F3F4F6', color:'#6B7280' }}>{new Date(q.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
