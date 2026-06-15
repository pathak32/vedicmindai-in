import React, { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/lib/LanguageContext';

const card = { background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(30,64,175,0.1)', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' };
const tag = (color) => ({ display:'inline-block', padding:'2px 10px', borderRadius:20, fontSize:12, fontWeight:600, background: color==='pro'?'#EEF2FF':color==='basic'?'#ECFDF5':'#F3F4F6', color: color==='pro'?'#4338CA':color==='basic'?'#059669':'#6B7280' });

export default function AdminStudents() {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
  const { t } = useLanguage();
    setLoading(true);
    try {
      const sb = await getSupabase();
      const { data, error } = await sb
        .from('profiles')
        .select('id, full_name, mobile, created_at, grade, plan, trial_end_date, xp, lessons_completed')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch(e) {
      console.error('AdminStudents:', e);
      setUsers([]);
    } finally { setLoading(false); }
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return !q || (u.full_name||'').toLowerCase().includes(q) || (u.mobile||'').includes(q);
  });

  const stats = [
    { label: '👥 Total Users', value: users.length },
    { label: '⭐ Pro Users', value: users.filter(u=>u.plan==='pro').length },
    { label: '📚 Basic Users', value: users.filter(u=>u.plan==='basic').length },
    { label: '🆓 Free / Trial', value: users.filter(u=>!u.plan||u.plan==='free'||u.plan==='trial').length },
  ];

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12, marginBottom:20 }}>
        {stats.map((s,i) => (
          <div key={i} style={card}>
            <div style={{ fontSize:12, color:'#6B7280', marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:28, fontWeight:700, color:'#0A1628' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h3 style={{ fontSize:16, fontWeight:600, margin:0 }}>All Users</h3>
          <div style={{ display:'flex', gap:8 }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name / mobile..." style={{ padding:'6px 12px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13, width:220 }}/>
            <button onClick={loadUsers} style={{ padding:'6px 14px', borderRadius:8, background:'#1e40af', color:'#fff', border:'none', cursor:'pointer', fontSize:13 }}>{t('refresh')}</button>
          </div>
        </div>

        {loading ? <p style={{ color:'#6B7280', textAlign:'center', padding:40 }}>Loading users from Supabase...</p> :
          filtered.length === 0 ? <p style={{ color:'#6B7280', textAlign:'center', padding:40 }}>No users found</p> : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:'#F9FAFB' }}>
                  {['Name','Mobile','Plan','XP','Lessons','Joined'].map(h => (
                    <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontWeight:600, color:'#374151', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u,i) => (
                  <tr key={u.id} style={{ background: i%2===0?'#fff':'#F9FAFB' }}>
                    <td style={{ padding:'10px 14px', borderBottom:'1px solid #F3F4F6' }}>{u.full_name || '—'}</td>
                    <td style={{ padding:'10px 14px', borderBottom:'1px solid #F3F4F6', fontFamily:'monospace' }}>{u.mobile || '—'}</td>
                    <td style={{ padding:'10px 14px', borderBottom:'1px solid #F3F4F6' }}><span style={tag(u.plan||'free')}>{u.plan||'Free'}</span></td>
                    <td style={{ padding:'10px 14px', borderBottom:'1px solid #F3F4F6', fontWeight:600, color:'#7C3AED' }}>{u.xp||0}</td>
                    <td style={{ padding:'10px 14px', borderBottom:'1px solid #F3F4F6' }}>{u.lessons_completed||0}/40</td>
                    <td style={{ padding:'10px 14px', borderBottom:'1px solid #F3F4F6', color:'#6B7280' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
