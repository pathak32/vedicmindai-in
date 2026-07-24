import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

const card = { background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(30,64,175,0.1)', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' };

const LIVE_WINDOW_MINUTES = 3; // a session counts as "live" if it pinged within this window

function todayStartISO() {
  return new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
}

export default function AdminVisitorStats() {
  const [stats, setStats] = useState(null);
  const [topPages, setTopPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef(null);

  const loadData = useCallback(async () => {
    try {
      const sb = await getSupabase();
      const liveThreshold = new Date(Date.now() - LIVE_WINDOW_MINUTES * 60_000).toISOString();

      const [liveRes, todayRes] = await Promise.all([
        sb.from('site_visits').select('session_id').gte('last_seen_at', liveThreshold),
        sb.from('site_visits').select('session_id, page_path, first_seen_at').gte('first_seen_at', todayStartISO()),
      ]);

      const live = liveRes.data || [];
      const today = todayRes.data || [];

      // Top pages visited today
      const pageCounts = {};
      today.forEach((v) => {
        const p = v.page_path || '(unknown)';
        pageCounts[p] = (pageCounts[p] || 0) + 1;
      });
      const sortedPages = Object.entries(pageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

      setStats({
        liveNow: live.length,
        todayVisitors: today.length,
      });
      setTopPages(sortedPages);
      setLastUpdated(new Date());
    } catch (e) {
      console.error('AdminVisitorStats:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(loadData, 20000);
    }
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, loadData]);

  if (loading && !stats) return <p style={{ color: '#6B7280', textAlign: 'center', padding: 60 }}>Loading visitor stats from Supabase...</p>;

  const metrics = [
    { label: '🟢 Live Now', value: stats?.liveNow ?? 0, color: '#059669' },
    { label: '👥 Visitors Today', value: stats?.todayVisitors ?? 0, color: '#1e40af' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#0A1628' }}>Website Visitor Traffic</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>
            Anonymous site visits (logged in or not) — separate from registered accounts. {lastUpdated && `Last updated ${lastUpdated.toLocaleTimeString('en-IN')}.`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4B5563', cursor: 'pointer' }}>
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
            Auto-refresh every 20s
          </label>
          <button onClick={loadData} style={{ padding: '6px 14px', borderRadius: 8, background: '#1e40af', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            ↻ Refresh Now
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 20 }}>
        {metrics.map((m, i) => (
          <div key={i} style={card}>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={{ ...card, marginBottom: 16 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0A1628' }}>Top Pages Today</h4>
        {topPages.length === 0 ? (
          <p style={{ color: '#9CA3AF', fontSize: 13, padding: '12px 0' }}>No visits recorded yet today.</p>
        ) : (
          <div>
            {topPages.map(([path, count], i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 4px', borderBottom: i < topPages.length - 1 ? '1px solid #F3F4F6' : 'none', fontSize: 13,
              }}>
                <span style={{ color: '#374151', fontFamily: 'monospace' }}>{path}</span>
                <span style={{ color: '#1e40af', fontWeight: 700, fontSize: 13 }}>{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ ...card, background: 'rgba(30,64,175,0.05)', border: '1px solid rgba(30,64,175,0.15)' }}>
        <p style={{ fontSize: 12, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
          <strong>Note:</strong> App download counts live in Google Play Console, not here — that data isn't accessible via API without separate setup. This panel tracks website visits only (vedicmindai.in). Admin panel visits are excluded from these counts.
        </p>
      </div>
    </div>
  );
}
