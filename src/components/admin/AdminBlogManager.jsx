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
  const [view, setView] = useState('submit'); // submit | drafts | published | comments
  const [editingId, setEditingId] = useState(null); // null = creating new; set = editing an existing post
  const [editingSlug, setEditingSlug] = useState(null); // preserve the original slug/URL when editing
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  const [form, setForm] = useState({
    title: '', category: CATEGORIES[0], subcategory: '',
    target_keyword: '', target_audience: '', content: '',
    title_hi: '', content_hi: '',
  });

  useEffect(() => { loadPosts(); loadComments(); }, []);

  async function loadComments() {
    setCommentsLoading(true);
    try {
      const sb = await getSupabase();
      // Join in the post title/slug so the moderation view can show which
      // article each comment belongs to without a second lookup per row.
      const { data, error } = await sb.from('blog_comments')
        .select('*, blog_posts(title, slug)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setComments(data || []);
    } catch (e) {
      // Table may not exist yet if the migration hasn't been run —
      // fail quietly here, same pattern as loadPosts below.
    } finally {
      setCommentsLoading(false);
    }
  }

  async function moderateComment(id, status) {
    const sb = await getSupabase();
    await sb.from('blog_comments').update({ status }).eq('id', id);
    loadComments();
  }

  async function deleteComment(id) {
    if (!confirm('Delete this comment permanently?')) return;
    const sb = await getSupabase();
    await sb.from('blog_comments').delete().eq('id', id);
    loadComments();
  }

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

  function startEdit(post) {
    setEditingId(post.id);
    setEditingSlug(post.slug);
    setForm({
      title: post.title || '',
      category: post.category || CATEGORIES[0],
      subcategory: post.subcategory || '',
      target_keyword: post.target_keyword || '',
      target_audience: post.target_audience || '',
      content: post.content || '',
      title_hi: post.title_hi || '',
      content_hi: post.content_hi || '',
    });
    setStatusMsg('');
    setView('submit');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingSlug(null);
    setForm({ title: '', category: CATEGORIES[0], subcategory: '', target_keyword: '', target_audience: '', content: '', title_hi: '', content_hi: '' });
    setStatusMsg('');
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

      if (editingId) {
        // Editing an existing post — keep its original slug and status
        // (a published article stays published; a draft stays a draft)
        // untouched. Only the content fields below change.
        const { error } = await sb.from('blog_posts').update({
          title: form.title.trim(),
          category: form.category,
          subcategory: form.subcategory.trim() || null,
          target_keyword: form.target_keyword.trim() || null,
          target_audience: form.target_audience.trim() || null,
          content: form.content.trim(),
          title_hi: form.title_hi.trim() || null,
          content_hi: form.content_hi.trim() || null,
        }).eq('id', editingId);
        if (error) throw error;
        setStatusMsg('✅ Changes saved.');
        cancelEdit();
        loadPosts();
        return;
      }

      const slug = slugify(form.title);
      const { error } = await sb.from('blog_posts').insert({
        title: form.title.trim(),
        slug,
        category: form.category,
        subcategory: form.subcategory.trim() || null,
        target_keyword: form.target_keyword.trim() || null,
        target_audience: form.target_audience.trim() || null,
        content: form.content.trim(),
        title_hi: form.title_hi.trim() || null,
        content_hi: form.content_hi.trim() || null,
        status: 'draft',
      });
      if (error) throw error;
      setStatusMsg('✅ Saved as draft. Review it in the Drafts tab, then Publish when ready.');
      setForm({ title: '', category: CATEGORIES[0], subcategory: '', target_keyword: '', target_audience: '', content: '', title_hi: '', content_hi: '' });
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
  const pendingComments = comments.filter(c => c.status === 'pending');

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { id: 'submit', label: editingId ? '✏️ Editing Article' : '✍️ Submit New Article' },
          { id: 'drafts', label: `📝 Drafts (${drafts.length})` },
          { id: 'published', label: `✅ Published (${published.length})` },
          { id: 'comments', label: `💬 Comments${pendingComments.length > 0 ? ` (${pendingComments.length} pending)` : ''}` },
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
            {editingId
              ? <>Editing <strong>{editingSlug}</strong> — changes save immediately to this same article; its status and URL stay unchanged.</>
              : <>Paste your article here. It saves as a <strong>draft</strong> — nothing goes live until you (or Claude, if you ask in chat) review it and hit Publish.</>}
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
          <div style={{ marginBottom: 16, padding: 16, borderRadius: 10, background: '#F9FAFB', border: '1px dashed #D1D5DB' }}>
            <p style={{ fontSize: 12, color: '#6B7280', marginTop: 0, marginBottom: 12 }}>
              Optional — Hindi version. Leave both blank and readers with Hindi selected will automatically see the English version above instead.
            </p>
            <label style={label}>Hindi Title (हिंदी शीर्षक)</label>
            <input style={{ ...input, marginBottom: 12 }} value={form.title_hi} onChange={e => setForm(f => ({ ...f, title_hi: e.target.value }))} placeholder="हिंदी में शीर्षक (वैकल्पिक)" />
            <label style={label}>Hindi Content (हिंदी लेख)</label>
            <textarea
              style={{ ...input, minHeight: 200, fontFamily: 'monospace', fontSize: 13, resize: 'vertical' }}
              value={form.content_hi}
              onChange={e => setForm(f => ({ ...f, content_hi: e.target.value }))}
              placeholder="हिंदी में पूरा लेख यहाँ पेस्ट करें (वैकल्पिक)..."
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" disabled={saving} style={btn(editingId ? '#6366F1' : '#10B981')}>
              {saving ? 'Saving…' : (editingId ? 'Save Changes' : 'Save as Draft')}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} style={btn('#9CA3AF')}>Cancel</button>
            )}
          </div>
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
                  <button onClick={() => startEdit(post)} style={btn('#6366F1')}>Edit</button>
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
      {view === 'comments' && (
        <div>
          {commentsLoading && <p style={{ color: '#6B7280' }}>Loading…</p>}
          {!commentsLoading && comments.length === 0 && (
            <p style={{ color: '#9CA3AF' }}>No comments yet — has supabase-migrations/002-blog-likes-and-comments.sql been run?</p>
          )}
          {comments.map(c => (
            <div key={c.id} style={{
              ...card,
              borderLeft: c.status === 'pending' ? '4px solid #F59E0B' : c.status === 'approved' ? '4px solid #10B981' : '4px solid #EF4444',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#0A1628' }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                    on {c.blog_posts?.title || '(deleted post)'} · {new Date(c.created_at).toLocaleString()} · {c.status}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  {c.status !== 'approved' && <button onClick={() => moderateComment(c.id, 'approved')} style={btn('#10B981')}>Approve</button>}
                  {c.status !== 'rejected' && <button onClick={() => moderateComment(c.id, 'rejected')} style={btn('#F59E0B')}>Reject</button>}
                  <button onClick={() => deleteComment(c.id)} style={btn('#EF4444')}>Delete</button>
                </div>
              </div>
              <p style={{ fontSize: 14, color: '#374151', margin: 0 }}>{c.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
