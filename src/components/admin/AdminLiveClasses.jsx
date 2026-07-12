import React, { useState, useEffect, useCallback } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

const card = { background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(30,64,175,0.1)', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' };
const inputStyle = { width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13 };

export default function AdminLiveClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ topic: '', tutor_name: '', tutor_bio: '', scheduled_at: '', duration_minutes: 45, youtube_live_url: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const sb = await getSupabase();
      const { data, error: err } = await sb.from('live_classes').select('*').order('scheduled_at', { ascending: false });
      if (err) throw err;
      setClasses(data || []);
    } catch (e) {
      setError(e.message || 'Failed to load. Have you run supabase/live_class_schema.sql yet?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function createClass() {
    if (!form.topic.trim() || !form.tutor_name.trim() || !form.scheduled_at) {
      setError('Topic, tutor name, and date/time are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const sb = await getSupabase();
      const { error: err } = await sb.from('live_classes').insert({
        topic: form.topic.trim(),
        tutor_name: form.tutor_name.trim(),
        tutor_bio: form.tutor_bio.trim() || null,
        scheduled_at: new Date(form.scheduled_at).toISOString(),
        duration_minutes: Number(form.duration_minutes) || 45,
        youtube_live_url: form.youtube_live_url.trim() || null,
        status: 'upcoming',
      });
      if (err) throw err;
      setForm({ topic: '', tutor_name: '', tutor_bio: '', scheduled_at: '', duration_minutes: 45, youtube_live_url: '' });
      await load();
    } catch (e) {
      setError(e.message || 'Failed to create class');
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      const sb = await getSupabase();
      await sb.from('live_classes').update({ status }).eq('id', id);
      await load();
    } catch (e) { console.error(e); }
  }

  async function updateReplayUrl(id, url) {
    try {
      const sb = await getSupabase();
      await sb.from('live_classes').update({ youtube_replay_url: url, status: 'ended' }).eq('id', id);
      await load();
    } catch (e) { console.error(e); }
  }

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#0A1628' }}>Weekly Live Classes</h3>

      {error && (
        <div style={{ ...card, marginBottom: 16, background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: 13 }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ ...card, marginBottom: 20 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Schedule a New Class</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div>
            <label style={{ fontSize: 11, color: '#6B7280', display: 'block', marginBottom: 4 }}>Topic</label>
            <input style={inputStyle} value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="e.g. Vedic Long Division for Competitive Exams" />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#6B7280', display: 'block', marginBottom: 4 }}>Tutor Name</label>
            <input style={inputStyle} value={form.tutor_name} onChange={e => setForm({ ...form, tutor_name: e.target.value })} placeholder="e.g. Mr. Ray Kailash" />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#6B7280', display: 'block', marginBottom: 4 }}>Date & Time</label>
            <input type="datetime-local" style={inputStyle} value={form.scheduled_at} onChange={e => setForm({ ...form, scheduled_at: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#6B7280', display: 'block', marginBottom: 4 }}>Duration (minutes)</label>
            <input type="number" style={inputStyle} value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: e.target.value })} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 11, color: '#6B7280', display: 'block', marginBottom: 4 }}>Tutor Bio (shown on the class page)</label>
            <input style={inputStyle} value={form.tutor_bio} onChange={e => setForm({ ...form, tutor_bio: e.target.value })} placeholder="e.g. Vedic Maths teacher, Tokyo — 10+ years experience" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 11, color: '#6B7280', display: 'block', marginBottom: 4 }}>YouTube Live URL (add closer to session time)</label>
            <input style={inputStyle} value={form.youtube_live_url} onChange={e => setForm({ ...form, youtube_live_url: e.target.value })} placeholder="https://youtube.com/live/..." />
          </div>
        </div>
        <button onClick={createClass} disabled={saving} style={{ padding: '8px 20px', borderRadius: 8, background: '#059669', color: 'white', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, opacity: saving ? 0.6 : 1 }}>
          + Schedule Class
        </button>
      </div>

      <div style={card}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>All Classes</h4>
        {loading ? <p style={{ color: '#6B7280' }}>Loading...</p> : classes.length === 0 ? (
          <p style={{ color: '#9CA3AF', fontSize: 13 }}>No classes scheduled yet.</p>
        ) : (
          classes.map(c => (
            <div key={c.id} style={{ padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#0A1628' }}>{c.topic}</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>
                    {c.tutor_name} · {new Date(c.scheduled_at).toLocaleString()} · {c.duration_minutes} min
                  </div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                  background: c.status === 'live' ? '#FEE2E2' : c.status === 'ended' ? '#F3F4F6' : '#DBEAFE',
                  color: c.status === 'live' ? '#DC2626' : c.status === 'ended' ? '#6B7280' : '#1E40AF',
                }}>
                  {c.status.toUpperCase()}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                {c.status === 'upcoming' && (
                  <button onClick={() => updateStatus(c.id, 'live')} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 6, background: '#DC2626', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Mark as LIVE now
                  </button>
                )}
                {c.status === 'live' && (
                  <button
                    onClick={() => { const url = prompt('Paste the YouTube replay/VOD URL:'); if (url) updateReplayUrl(c.id, url); }}
                    style={{ fontSize: 12, padding: '4px 12px', borderRadius: 6, background: '#0A1628', color: 'white', border: 'none', cursor: 'pointer' }}
                  >
                    End & Add Replay Link
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
