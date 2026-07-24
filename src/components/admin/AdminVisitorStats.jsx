import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

const card = { background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(30,64,175,0.1)', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' };

const LIVE_WINDOW_MINUTES = 3; // a session counts as "live" if it pinged within this window
const TRACKING_START_DATE = '2026-07-24'; // day site_visits tracking went live — earlier dates will always show 0

function dateKey(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function startOfDay(d) {
  return new Date(new Date(d).setHours(0, 0, 0, 0));
}

function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

// Range presets. 'today'/'yesterday' are single-day views (show Live Now +
// keep the old detail layout); 'week'/'month'/'custom' are multi-day
// ranges (show a totals summary + per-day breakdown table instead).
const PRESETS = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'week', label: 'Last 7 Days' },
  { id: 'month', label: 'Last 30 Days' },
  { id: 'custom', label: 'Custom Range…' },
];

function resolveRange(preset, customFrom, customTo) {
  const today = startOfDay(new Date());
  if (preset === 'today') {
    return { start: today, end: addDays(today, 1), isSingleDay: true, isToday: true, label: 'Today' };
  }
  if (preset === 'yesterday') {
    const y = addDays(today, -1);
    return { start: y, end: today, isSingleDay: true, isToday: false, label: 'Yesterday' };
  }
  if (preset === 'week') {
    return { start: addDays(today, -6), end: addDays(today, 1), isSingleDay: false, isToday: false, label: 'Last 7 Days' };
  }
  if (preset === 'month') {
    return { start: addDays(today, -29), end: addDays(today, 1), isSingleDay: false, isToday: false, label: 'Last 30 Days' };
  }
  // custom
  if (!customFrom || !customTo) {
    return { start: today, end: addDays(today, 1), isSingleDay: true, isToday: true, label: 'Today' };
  }
  const start = startOfDay(new Date(customFrom));
  const end = addDays(startOfDay(new Date(customTo)), 1); // inclusive of the "to" day
  const spanDays = Math.round((end - start) / 86400000);
  return { start, end, isSingleDay: spanDays === 1, isToday: spanDays === 1 && dateKey(start) === dateKey(today), label: `${customFrom} → ${customTo}` };
}

export default function AdminVisitorStats() {
  const [preset, setPreset] = useState('today');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [stats, setStats] = useState(null);
  const [dailyBreakdown, setDailyBreakdown] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef(null);

  const range = resolveRange(preset, customFrom, customTo);

  const loadData = useCallback(async () => {
    try {
      const sb = await getSupabase();
      const queries = [
        sb.from('site_visits')
          .select('session_id, page_path, platform, first_seen_at')
          .gte('first_seen_at', range.start.toISOString())
          .lt('first_seen_at', range.end.toISOString()),
      ];
      if (range.isToday) {
        const liveThreshold = new Date(Date.now() - LIVE_WINDOW_MINUTES * 60_000).toISOString();
        queries.push(sb.from('site_visits').select('session_id, platform').gte('last_seen_at', liveThreshold));
      }

      const results = await Promise.all(queries);
      const visits = results[0].data || [];
      const live = range.isToday ? (results[1].data || []) : [];

      const webVisits = visits.filter((v) => v.platform !== 'app');
      const appVisits = visits.filter((v) => v.platform === 'app');
      const liveWeb = live.filter((v) => v.platform !== 'app');
      const liveApp = live.filter((v) => v.platform === 'app');

      // Top pages across the whole selected range
      const pageCounts = {};
      visits.forEach((v) => {
        const p = v.page_path || '(unknown)';
        pageCounts[p] = (pageCounts[p] || 0) + 1;
      });
      const sortedPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

      // Per-day breakdown (only meaningful/shown for multi-day ranges)
      const byDay = {};
      visits.forEach((v) => {
        const k = dateKey(new Date(v.first_seen_at));
        if (!byDay[k]) byDay[k] = { web: 0, app: 0 };
        if (v.platform === 'app') byDay[k].app += 1; else byDay[k].web += 1;
      });
      const breakdown = Object.entries(byDay)
        .map(([date, counts]) => ({ date, ...counts, total: counts.web + counts.app }))
        .sort((a, b) => (a.date < b.date ? 1 : -1));

      setStats({
        liveWeb: liveWeb.length,
        liveApp: liveApp.length,
        webTotal: webVisits.length,
        appTotal: appVisits.length,
        grandTotal: visits.length,
      });
      setDailyBreakdown(breakdown);
      setTopPages(sortedPages);
      setLastUpdated(new Date());
    } catch (e) {
      console.error('AdminVisitorStats:', e);
    } finally {
      setLoading(false);
    }
  }, [range.start.getTime(), range.end.getTime(), range.isToday]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (autoRefresh && range.isToday) {
      intervalRef.current = setInterval(loadData, 20000);
    }
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, loadData, range.isToday]);

  if (loading && !stats) return <p style={{ color: '#6B7280', textAlign: 'center', padding: 60 }}>Loading visitor stats from Supabase...</p>;

  const metrics = range.isToday
    ? [
        { label: '🟢 Live Now — Web', value: stats?.liveWeb ?? 0, color: '#059669' },
        { label: '🟢 Live Now — App', value: stats?.liveApp ?? 0, color: '#059669' },
        { label: '💻 Web Visitors Today', value: stats?.webTotal ?? 0, color: '#1e40af' },
        { label: '📱 App Visitors Today', value: stats?.appTotal ?? 0, color: '#7C3AED' },
      ]
    : [
        { label: '💻 Web Visitors', value: stats?.webTotal ?? 0, color: '#1e40af' },
        { label: '📱 App Visitors', value: stats?.appTotal ?? 0, color: '#7C3AED' },
        { label: '👥 Total Visitors', value: stats?.grandTotal ?? 0, color: '#059669' },
      ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#0A1628' }}>Website Visitor Traffic</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>
            Anonymous visits, split by web browser vs the Android app — separate from registered accounts. {lastUpdated && `Last updated ${lastUpdated.toLocaleTimeString('en-IN')}.`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(30,64,175,0.2)', fontSize: 12, fontWeight: 600, color: '#0A1628', background: '#fff', cursor: 'pointer' }}
          >
            {PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          {preset === 'custom' && (
            <>
              <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)}
                style={{ padding: '5px 8px', borderRadius: 8, border: '1px solid rgba(30,64,175,0.2)', fontSize: 12 }} />
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>to</span>
              <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)}
                style={{ padding: '5px 8px', borderRadius: 8, border: '1px solid rgba(30,64,175,0.2)', fontSize: 12 }} />
            </>
          )}
          {range.isToday && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4B5563', cursor: 'pointer' }}>
              <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
              Auto-refresh every 20s
            </label>
          )}
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

      {!range.isSingleDay && (
        <div style={{ ...card, marginBottom: 16 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0A1628' }}>Day-by-Day Breakdown — {range.label}</h4>
          {dailyBreakdown.length === 0 ? (
            <p style={{ color: '#9CA3AF', fontSize: 13, padding: '12px 0' }}>No visits recorded in this range.</p>
          ) : (
            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', padding: '4px', borderBottom: '1px solid #E5E7EB', marginBottom: 4 }}>
                <span>Date</span><span style={{ textAlign: 'right' }}>Web</span><span style={{ textAlign: 'right' }}>App</span><span style={{ textAlign: 'right' }}>Total</span>
              </div>
              {dailyBreakdown.map((d, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px', fontSize: 13, padding: '8px 4px', borderBottom: i < dailyBreakdown.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                  <span style={{ color: '#374151' }}>{d.date}</span>
                  <span style={{ textAlign: 'right', color: '#1e40af' }}>{d.web}</span>
                  <span style={{ textAlign: 'right', color: '#7C3AED' }}>{d.app}</span>
                  <span style={{ textAlign: 'right', fontWeight: 700, color: '#0A1628' }}>{d.total}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ ...card, marginBottom: 16 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0A1628' }}>Top Pages — {range.label}</h4>
        {topPages.length === 0 ? (
          <p style={{ color: '#9CA3AF', fontSize: 13, padding: '12px 0' }}>
            {dateKey(range.start) < TRACKING_START_DATE
              ? `No data — visitor tracking started ${TRACKING_START_DATE}, before this range.`
              : 'No visits recorded in this range.'}
          </p>
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
          <strong>Note:</strong> App download counts (installs) still live in Google Play Console, not here. "App Visitors" above means sessions opened through the installed Android app (in.vedicmindai.app), detected automatically — separate from someone browsing vedicmindai.in in a regular mobile or desktop browser. Tracking started {TRACKING_START_DATE}. Admin panel visits are excluded from all counts.
        </p>
      </div>
    </div>
  );
}
