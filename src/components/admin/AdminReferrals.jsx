import React, { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

export default function AdminReferrals() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | converted | pending

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const sb = await getSupabase();
      // Get all referral rows joined with referrer profile
      const { data } = await sb
        .from('referrals')
        .select('referral_code, referral_count, converted_count, created_at, user_id, profiles(full_name, mobile)')
        .order('converted_count', { ascending: false });
      if (data) setRows(data);
    } catch(e) { console.error(e); }
    setLoading(false);
  }

  const filtered = rows.filter(r => {
    const name = r.profiles?.full_name || '';
    const mobile = r.profiles?.mobile || '';
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || mobile.includes(search) || r.referral_code.includes(search.toUpperCase());
    if (filter === 'converted') return matchSearch && r.converted_count > 0;
    if (filter === 'pending')   return matchSearch && r.converted_count === 0;
    return matchSearch;
  });

  const totalReferrers = rows.length;
  const totalSignups   = rows.reduce((a, r) => a + (r.referral_count || 0), 0);
  const totalConverted = rows.reduce((a, r) => a + (r.converted_count || 0), 0);
  const rewardsDue     = rows.filter(r => r.converted_count >= 5).length;

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 4 }}>
        🎁 Referral Program
      </h2>
      <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>All users who have a referral code and their conversion stats</p>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Referrers', value: totalReferrers, emoji: '👥', color: '#0A1628' },
          { label: 'Total Signups',   value: totalSignups,   emoji: '👆', color: '#1E40AF' },
          { label: 'Conversions',     value: totalConverted, emoji: '💳', color: '#059669' },
          { label: 'Rewards Due',     value: rewardsDue,     emoji: '🏆', color: '#D97706' },
        ].map(s => (
          <div key={s.label} style={{ background: '#F0F4FF', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.emoji}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, mobile, or code..."
          style={{ flex: 1, minWidth: 200, padding: '8px 14px', border: '1px solid rgba(30,64,175,0.2)', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none' }}
        />
        {['all', 'converted', 'pending'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            background: filter === f ? '#0A1628' : '#F0F4FF',
            color: filter === f ? 'white' : '#4B5563',
            border: '1px solid rgba(30,64,175,0.15)',
          }}>
            {f === 'all' ? 'All' : f === 'converted' ? '✅ Has Conversions' : '⏳ No Conversions'}
          </button>
        ))}
        <button onClick={loadData} style={{ padding: '8px 14px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          🔄 Refresh
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto', background: 'white', borderRadius: 12, border: '1px solid rgba(30,64,175,0.12)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F0F4FF', borderBottom: '2px solid rgba(30,64,175,0.1)' }}>
                {['Referrer', 'Mobile', 'Code', 'Link Clicks', 'Subscribed', 'Reward', 'Joined'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: '#6B7280', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#6B7280' }}>No referrers found</td></tr>
              ) : filtered.map((r, i) => {
                const rewardDue = r.converted_count >= 5;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(30,64,175,0.06)', background: rewardDue ? '#FFFBEB' : 'white' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0A1628' }}>{r.profiles?.full_name || '—'}</td>
                    <td style={{ padding: '10px 14px', color: '#4B5563' }}>{r.profiles?.mobile || '—'}</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#1E40AF', fontWeight: 700 }}>{r.referral_code}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{r.referral_count || 0}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      <span style={{ background: r.converted_count > 0 ? '#ECFDF5' : '#F3F4F6', color: r.converted_count > 0 ? '#065F46' : '#6B7280', padding: '2px 10px', borderRadius: 6, fontWeight: 700, fontSize: 12 }}>
                        {r.converted_count || 0}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      {rewardDue
                        ? <span style={{ background: '#FEF3C7', color: '#92400E', padding: '3px 10px', borderRadius: 6, fontWeight: 700, fontSize: 11 }}>🏆 Due</span>
                        : <span style={{ color: '#9CA3AF', fontSize: 11 }}>{r.converted_count}/5</span>
                      }
                    </td>
                    <td style={{ padding: '10px 14px', color: '#6B7280', fontSize: 12 }}>
                      {r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
