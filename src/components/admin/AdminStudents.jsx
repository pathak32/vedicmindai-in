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
  const [deletingId, setDeletingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
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

  async function handleDelete(u) {
    const confirmed = window.confirm(
      `Delete "${u.full_name || u.mobile || u.id}" permanently?\n\nThis removes the account and all their progress/quiz data from Supabase. This cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(u.id);
    try {
      const res = await fetch('/api/admin-delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: u.id }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Delete failed');

      if (result.tableErrors && result.tableErrors.length) {
        console.warn('Some related rows may not have been cleaned up:', result.tableErrors);
      }
      setUsers(prev => prev.filter(x => x.id !== u.id));
    } catch (e) {
      console.error('Delete user failed:', e);
      alert(`Could not delete user: ${e.message}`);
    } finally {
      setDeletingId(null);
    }
  }

  async function deleteOneSilently(userId) {
    try {
      const res = await fetch('/api/admin-delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Delete failed');
      if (result.tableErrors && result.tableErrors.length) {
        console.warn(`tableErrors for ${userId}:`, result.tableErrors);
      }
      return { userId, ok: true };
    } catch (e) {
      console.error(`Delete failed for ${userId}:`, e);
      return { userId, ok: false, error: e.message };
    }
  }

  async function handleBulkDelete() {
    if (selectedIds.length === 0) return;
    const confirmed = window.confirm(
      `Delete ${selectedIds.length} selected user${selectedIds.length > 1 ? 's' : ''} permanently?\n\nThis removes their accounts and all progress/quiz data from Supabase. This cannot be undone.`
    );
    if (!confirmed) return;

    setBulkDeleting(true);
    const results = [];
    for (const id of selectedIds) {
      const result = await deleteOneSilently(id);
      results.push(result);
    }

    const succeeded = results.filter(r => r.ok).map(r => r.userId);
    const failed = results.filter(r => !r.ok);

    setUsers(prev => prev.filter(u => !succeeded.includes(u.id)));
    setSelectedIds([]);
    setBulkDeleting(false);

    if (failed.length > 0) {
      alert(`Deleted ${succeeded.length} of ${results.length}. ${failed.length} failed — check console for details.`);
    }
  }

  function toggleSelect(id) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function toggleSelectAll(filteredUsers) {
    const allSelected = filteredUsers.length > 0 && filteredUsers.every(u => selectedIds.includes(u.id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !filteredUsers.some(u => u.id === id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...filteredUsers.map(u => u.id)])]);
    }
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
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                style={{ padding:'6px 14px', borderRadius:8, background:'#DC2626', color:'#fff', border:'none', cursor: bulkDeleting ? 'default' : 'pointer', fontSize:13, opacity: bulkDeleting ? 0.6 : 1 }}
              >
                {bulkDeleting ? 'Deleting...' : `🗑️ Delete Selected (${selectedIds.length})`}
              </button>
            )}
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
                  <th style={{ padding:'10px 14px', textAlign:'left', borderBottom:'1px solid #E5E7EB' }}>
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && filtered.every(u => selectedIds.includes(u.id))}
                      onChange={() => toggleSelectAll(filtered)}
                    />
                  </th>
                  {['Name','Mobile','Plan','XP','Lessons','Joined',''].map(h => (
                    <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontWeight:600, color:'#374151', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u,i) => (
                  <tr key={u.id} style={{ background: selectedIds.includes(u.id) ? '#FEF2F2' : (i%2===0?'#fff':'#F9FAFB') }}>
                    <td style={{ padding:'10px 14px', borderBottom:'1px solid #F3F4F6' }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(u.id)}
                        onChange={() => toggleSelect(u.id)}
                      />
                    </td>
                    <td style={{ padding:'10px 14px', borderBottom:'1px solid #F3F4F6' }}>{u.full_name || '—'}</td>
                    <td style={{ padding:'10px 14px', borderBottom:'1px solid #F3F4F6', fontFamily:'monospace' }}>{u.mobile || '—'}</td>
                    <td style={{ padding:'10px 14px', borderBottom:'1px solid #F3F4F6' }}><span style={tag(u.plan||'free')}>{u.plan||'Free'}</span></td>
                    <td style={{ padding:'10px 14px', borderBottom:'1px solid #F3F4F6', fontWeight:600, color:'#7C3AED' }}>{u.xp||0}</td>
                    <td style={{ padding:'10px 14px', borderBottom:'1px solid #F3F4F6' }}>{u.lessons_completed||0}/40</td>
                    <td style={{ padding:'10px 14px', borderBottom:'1px solid #F3F4F6', color:'#6B7280' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '—'}</td>
                    <td style={{ padding:'10px 14px', borderBottom:'1px solid #F3F4F6', textAlign:'center' }}>
                      <button
                        onClick={() => handleDelete(u)}
                        disabled={deletingId === u.id}
                        title="Delete this user permanently"
                        style={{
                          border:'none',
                          background:'transparent',
                          cursor: deletingId === u.id ? 'default' : 'pointer',
                          fontSize:15,
                          opacity: deletingId === u.id ? 0.4 : 1,
                          padding:4,
                        }}
                      >
                        {deletingId === u.id ? '⏳' : '🗑️'}
                      </button>
                    </td>
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
