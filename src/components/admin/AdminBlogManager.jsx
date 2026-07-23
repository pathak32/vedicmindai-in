import React, { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

const card = { background:'rgba(255,255,255,0.9)', border:'1px solid rgba(30,64,175,0.1)', borderRadius:14, padding:20, boxShadow:'0 2px 12px rgba(0,0,0,0.05)', marginBottom:16 };
const btn = (color='#1e40af') => ({ padding:'8px 18px', borderRadius:9, background:color, color:'#fff', border:'none', cursor:'pointer', fontSize:13, fontWeight:600 });
const input = { width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid rgba(30,64,175,0.2)', fontSize:14, boxSizing:'border-box' };
const label = { fontSize:12, fontWeight:600, color:'#4B5563', marginBottom:4, display:'block' };
const CATEGORIES = ['Vedic Maths', 'Reasoning', 'Aptitude'];

function slugify(title) {
  return title.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function AdminBlogManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('submit'); // submit | drafts | published

  const [form, setForm] = useState({
    title: '', category: CATEGORIES[0], subcategory: '',
    target_keyword: '', target_audience: '', content: '',
  });

  useEffect(() => { loadPosts(); }, []);

  async function loadPosts() {
    setLoading(true);
    try {
      const sb = await getSupabase();
      const { data, error } = await sb.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (e) {
      setStatusMsg('Could not load posts — has the blog_posts table been created in Supabase yet? (supabase/blog_posts_schema.sql)');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setStatusMsg('Title and content are both required.');
      return;
    }
    setSaving(true);
    setStatusMsg('');
    try {
      const sb = await getSupabase();
      const slug = slugify(form.title);
      const { error } = await sb.from('blog_posts').insert({
        title: form.title.trim(),
        slug,
        category: form.category,
        subcategory: form.subcategory.trim() || null,
        target_keyword: form.target_keyword.trim() || null,
        target_audience: form.target_audience.trim() || null,
        content: form.content.trim(),
        status: 'draft',
      });
      if (error) throw error;
      setStatusMsg('✅ Saved as draft. Review it in the Drafts tab, then Publish when ready.');
      setForm({ title: '', category: CATEGORIES[0], subcategory: '', target_keyword: '', target_audience: '', content: '' });
      loadPosts();
    } catch (err) {
      setStatusMsg('❌ ' + (err.message || 'Something went wrong saving this post.'));
    } finally {
      setSaving(false);
    }
  }

  async function publishPost(id) {
    const sb = await getSupabase();
    await sb.from('blog_posts').update({ status: 'published', published_at: new Date().toISOString() }).eq('id', id);
    loadPosts();
  }
  async function unpublishPost(id) {
    const sb = await getSupabase();
    await sb.from('blog_posts').update({ status: 'draft' }).eq('id', id);
    loadPosts();
  }
  async function deletePost(id) {
    if (!confirm('Delete this post permanently?')) return;
    const sb = await getSupabase();
    await sb.from('blog_posts').delete().eq('id', id);
    loadPosts();
  }

  const drafts = posts.filter(p => p.status === 'draft');
  const published = posts.filter(p => p.status === 'published');

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          { id: 'submit', label: '✍️ Submit New Article' },
          { id: 'drafts', label: `📝 Drafts (${drafts.length})` },
          { id: 'published', label: `✅ Published (${published.length})` },
        ].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={btn(view === v.id ? '#1e40af' : '#9CA3AF')}>
            {v.label}
          </button>
        ))}
      </div>

      {statusMsg && (
        <div style={{ ...card, background: statusMsg.startsWith('❌') ? '#FEE2E2' : '#ECFDF5', marginBottom: 16 }}>
          {statusMsg}
        </div>
      )}

      {view === 'submit' && (
        <form onSubmit={handleSubmit} style={card}>
          <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>
            Paste your article here. It saves as a <strong>draft</strong> — nothing goes live until you (or Claude, if you ask in chat) review it and hit Publish.
          </p>
          <div style={{ marginBottom: 14 }}>
            <label style={label}>Title *</label>
            <input style={input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Ekadhikena Purvena: The Vedic Trick to Square Any Number Ending in 5" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={label}>Category *</label>
              <select style={{ ...input, cursor: 'pointer' }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Subcategory</label>
              <input style={input} value={form.subcategory} onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))} placeholder="e.g. 16 Sutras" />
            </div>
            <div>
              <label style={label}>Target Keyword</label>
              <input style={input} value={form.target_keyword} onChange={e => setForm(f => ({ ...f, target_keyword: e.target.value }))} placeholder="e.g. vedic maths squaring numbers ending in 5" />
            </div>
            <div>
              <label style={label}>Target Audience</label>
              <input style={input} value={form.target_audience} onChange={e => setForm(f => ({ ...f, target_audience: e.target.value }))} placeholder="e.g. Class 6-10 students" />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={label}>Article Content * (paste the full article — leave a blank line between paragraphs)</label>
            <textarea
              style={{ ...input, minHeight: 280, fontFamily: 'monospace', fontSize: 13, resize: 'vertical' }}
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Paste the full article text here..."
            />
          </div>
          <button type="submit" disabled={saving} style={btn('#10B981')}>
            {saving ? 'Saving…' : 'Save as Draft'}
          </button>
        </form>
      )}

      {(view === 'drafts' || view === 'published') && (
        <div>
          {loading && <p style={{ color: '#6B7280' }}>Loading…</p>}
          {!loading && (view === 'drafts' ? drafts : published).length === 0 && (
            <p style={{ color: '#9CA3AF' }}>Nothing here yet.</p>
          )}
          {(view === 'drafts' ? drafts : published).map(post => (
            <div key={post.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#0A1628' }}>{post.title}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                    {post.category}{post.subcategory ? ` · ${post.subcategory}` : ''} · /blog/{post.slug}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  {view === 'drafts' && <button onClick={() => publishPost(post.id)} style={btn('#10B981')}>Publish</button>}
                  {view === 'published' && <button onClick={() => unpublishPost(post.id)} style={btn('#F59E0B')}>Unpublish</button>}
                  <button onClick={() => deletePost(post.id)} style={btn('#EF4444')}>Delete</button>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#4B5563', margin: 0, maxHeight: 60, overflow: 'hidden' }}>
                {post.content.slice(0, 220)}{post.content.length > 220 ? '…' : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
