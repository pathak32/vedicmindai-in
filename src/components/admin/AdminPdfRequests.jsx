import React, { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

// Students without a premium plan ask for a level's concept PDF here. Approve or reject each
// request; approval opens that level's English and Hindi PDF for that student.

const LEVEL_NAMES = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced', 4: 'Master' };
const STATUS_STYLE = {
  pending: { background: '#FEF3C7', color: '#92400E' },
  approved: { background: '#ECFDF5', color: '#065F46' },
  rejected: { background: '#FEF2F2', color: '#991B1B' },
};
const btn = (bg) => ({ background: bg, color: 'white', border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 600, fontSize: 12, cursor: 'pointer' });

export default function AdminPdfRequests() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [missingTable, setMissingTable] = useState(false);
  const [filter, setFilter] = useState('pending');
  const [msg, setMsg] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const sb = await getSupabase();
      const { data, error } = await sb.from('pdf_download_requests')
        .select('id, user_id, level, status, created_at, decided_at, profiles(full_name, mobile)')
        .order('created_at', { ascending: false });
      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist')) setMissingTable(true);
        throw error;
      }
      setRows(data || []);
    } catch (e) {
      console.warn('AdminPdfRequests load:', e.message);
    } finally {
      setLoading(false);
    }
  }

  async function decide(row, status) {
    setMsg('');
    const sb = await getSupabase();
    const { error } = await sb.from('pdf_download_requests')
      .update({ status, decided_at: new Date().toISOString() }).eq('id', row.id);
    setMsg(error ? `❌ Could not update: ${error.message}` : `✅ ${status === 'approved' ? 'Approved' : 'Rejected'}`);
    load();
  }

  if (missingTable) {
    return (
      <div style={{ padding: 20, borderRadius: 10, background: '#FEF3C7', border: '1px solid #FDE68A', color: '#92400E', fontSize: 14, maxWidth: 680 }}>
        <strong>The PDF requests table hasn't been created yet.</strong><br /><br />
        Run <code>supabase/pdf_download_requests.sql</code> in the Supabase SQL Editor, then reload this tab.
      </div>
    );
  }

  const shown = rows.filter((r) => filter === 'all' || r.status === filter);
  const pendingCount = rows.filter((r) => r.status === 'pending').length;

  return (
    <div style={{ maxWidth: 760 }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, marginBottom: 6 }}>📄 PDF Requests</h2>
      <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>
        Premium (Pro and Family) plans download the level PDFs directly. Everyone else requests access here. Approving opens that level in English and Hindi for the student.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {['pending', 'approved', 'rejected', 'all'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            border: `2px solid ${filter === f ? '#6366F1' : '#E5E7EB'}`,
            background: filter === f ? '#EEF2FF' : 'white', color: filter === f ? '#4338CA' : '#6B7280',
          }}>
            {f[0].toUpperCase() + f.slice(1)}{f === 'pending' ? ` (${pendingCount})` : ''}
          </button>
        ))}
        <button onClick={load} style={{ ...btn('#1e40af'), marginLeft: 'auto' }}>Refresh</button>
      </div>

      {msg && <div style={{ padding: 10, borderRadius: 8, background: msg.startsWith('✅') ? '#ECFDF5' : '#FEF2F2', fontSize: 13, marginBottom: 12 }}>{msg}</div>}

      {loading ? <p style={{ color: '#9CA3AF', fontSize: 13 }}>Loading…</p> : shown.length === 0 ? (
        <p style={{ color: '#9CA3AF', fontSize: 13 }}>No {filter === 'all' ? '' : filter} requests.</p>
      ) : shown.map((r) => (
        <div key={r.id} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 700, color: '#0A1628', fontSize: 14 }}>{r.profiles?.full_name || 'Unnamed student'}</div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>
              {r.profiles?.mobile || '—'} · Level {r.level} ({LEVEL_NAMES[r.level]}) · {new Date(r.created_at).toLocaleDateString('en-IN')}
            </div>
          </div>
          <span style={{ ...STATUS_STYLE[r.status], borderRadius: 100, padding: '3px 12px', fontSize: 12, fontWeight: 600 }}>{r.status}</span>
          {r.status !== 'approved' && <button onClick={() => decide(r, 'approved')} style={btn('#059669')}>Approve</button>}
          {r.status !== 'rejected' && <button onClick={() => decide(r, 'rejected')} style={btn('#DC2626')}>Reject</button>}
        </div>
      ))}
    </div>
  );
}
