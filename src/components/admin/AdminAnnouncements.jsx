import React, { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

// Manage the announcements that appear in the VedicMindToday feed on
// every user's dashboard. Post a new video, blog, feature update, or
// general announcement from here -- it shows for all users instantly.

const btn = (bg = '#1e40af') => ({
  background: bg, color: 'white', border: 'none',
  borderRadius: 8, padding: '8px 18px', fontWeight: 600,
  fontSize: 13, cursor: 'pointer',
});

const input = {
  width: '100%', padding: '10px 14px', borderRadius: 8,
  border: '1px solid #E5E7EB', fontSize: 14, fontFamily: 'var(--font-body)',
  boxSizing: 'border-box',
};

const TYPES = [
  { value: 'general', label: '📣 General', desc: 'Any announcement' },
  { value: 'video', label: '🎬 New Video', desc: 'YouTube / social media video' },
  { value: 'blog', label: '📝 New Blog', desc: 'Article published' },
  { value: 'feature', label: '✨ New Feature', desc: 'App update or new feature' },
  { value: 'event', label: '🗓️ Event / Class', desc: 'Live class or upcoming event' },
];

export default function AdminAnnouncements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ title: '', body: '', url: '', type: 'general', active: true });
  const [tableExists, setTableExists] = useState(true);

  useEffect(() => { loadItems(); }, []);

  async function loadItems() {
    setLoading(true);
    try {
      const sb = await getSupabase();
      const { data, error } = await sb.from('announcements')
        .select('*').order('created_at', { ascending: false });
      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          setTableExists(false);
        }
        throw error;
      }
      setItems(data || []);
    } catch (e) {
      console.warn('AdminAnnouncements load:', e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePost() {
    if (!form.title.trim()) { setMsg('Title is required.'); return; }
    setSaving(true); setMsg('');
    try {
      const sb = await getSupabase();
      const { error } = await sb.from('announcements').insert({
        title: form.title.trim(),
        body: form.body.trim() || null,
        url: form.url.trim() || null,
        type: form.type,
        active: form.active,
      });
      if (error) throw error;
      setMsg('✅ Posted! Users will see it on their dashboard right away.');
      setForm({ title: '', body: '', url: '', type: 'general', active: true });
      loadItems();
    } catch (e) {
      setMsg('❌ Failed: ' + (e.message || 'unknown error'));
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(item) {
    const sb = await getSupabase();
    await sb.from('announcements').update({ active: !item.active }).eq('id', item.id);
    loadItems();
  }

  async function deleteItem(id) {
    if (!window.confirm('Delete this announcement?')) return;
    const sb = await getSupabase();
    await sb.from('announcements').delete().eq('id', id);
    loadItems();
  }

  if (!tableExists) {
    return (
      <div style={{ maxWidth: 680 }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, marginBottom: 12 }}>📣 Announcements</h2>
        <div style={{ padding: 20, borderRadius: 10, background: '#FEF3C7', border: '1px solid #FDE68A', color: '#92400E', fontSize: 14 }}>
          <strong>The announcements table hasn't been created yet.</strong><br /><br />
          Run this SQL in your Supabase SQL Editor:
          <pre style={{ background: '#FFF7ED', padding: 12, borderRadius: 8, marginTop: 10, fontSize: 12, overflowX: 'auto', color: '#374151' }}>{`CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  url text,
  type text NOT NULL DEFAULT 'general',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon can read announcements" ON announcements FOR SELECT USING (true);`}</pre>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680 }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, marginBottom: 6 }}>📣 Announcements</h2>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B7280', marginBottom: 20 }}>
        Post an announcement that appears in the "VedicMind Today" feed on every user's dashboard.
        Use it for new videos, blog posts, features, or upcoming events. Takes effect immediately.
      </p>

      {/* Post form */}
      <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#0A1628', marginBottom: 14 }}>New Announcement</div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Type</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TYPES.map(t => (
              <button key={t.value} onClick={() => setForm(f => ({ ...f, type: t.value }))} style={{
                padding: '6px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                border: `2px solid ${form.type === t.value ? '#6366F1' : '#E5E7EB'}`,
                background: form.type === t.value ? '#EEF2FF' : 'white',
                color: form.type === t.value ? '#4338CA' : '#6B7280',
              }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Title *</label>
          <input style={input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder={form.type === 'video' ? 'New video: Vedic Maths trick for squaring numbers!' : form.type === 'blog' ? 'New article: 10 SSC shortcuts using Vedic Maths' : 'Announcement title…'} />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Short description (optional)</label>
          <input style={input} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
            placeholder="Brief context — 1-2 sentences max" />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Link (optional)</label>
          <input style={input} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
            placeholder="https://youtube.com/... or https://vedicmindai.in/blog/..." />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <input type="checkbox" id="active-chk" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
          <label htmlFor="active-chk" style={{ fontSize: 13, color: '#374151', cursor: 'pointer' }}>Visible to users immediately</label>
        </div>

        {msg && <div style={{ padding: 10, borderRadius: 8, background: msg.startsWith('✅') ? '#ECFDF5' : '#FEF2F2', color: msg.startsWith('✅') ? '#065F46' : '#991B1B', fontSize: 13, marginBottom: 12 }}>{msg}</div>}

        <button onClick={handlePost} disabled={saving} style={btn(saving ? '#9CA3AF' : '#6366F1')}>
          {saving ? 'Posting…' : '📣 Post Announcement'}
        </button>
      </div>

      {/* Existing announcements */}
      {loading ? <p style={{ color: '#9CA3AF', fontSize: 13 }}>Loading…</p> : (
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 10 }}>
            All Announcements ({items.length})
          </div>
          {items.length === 0 && <p style={{ color: '#9CA3AF', fontSize: 13 }}>No announcements yet.</p>}
          {items.map(item => (
            <div key={item.id} style={{
              background: 'white', border: `1px solid ${item.active ? '#E5E7EB' : '#F3F4F6'}`,
              borderRadius: 12, padding: '14px 16px', marginBottom: 8,
              opacity: item.active ? 1 : 0.55,
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}>
              <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>
                {TYPES.find(t => t.value === item.type)?.label.split(' ')[0] || '📣'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0A1628' }}>{item.title}</div>
                {item.body && <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{item.body}</div>}
                {item.url && <div style={{ fontSize: 11, color: '#6366F1', marginTop: 3 }}>{item.url}</div>}
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                  {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {' · '}
                  <span style={{ color: item.active ? '#059669' : '#9CA3AF', fontWeight: 600 }}>{item.active ? 'Live' : 'Hidden'}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button onClick={() => toggleActive(item)} style={{ ...btn(item.active ? '#F59E0B' : '#059669'), padding: '5px 10px', fontSize: 11 }}>
                  {item.active ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => deleteItem(item.id)} style={{ ...btn('#EF4444'), padding: '5px 10px', fontSize: 11 }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
