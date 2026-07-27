import React, { useState, useEffect, useMemo } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

const card = { background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(30,64,175,0.1)', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 16 };
const btn = (color = '#1e40af') => ({ padding: '9px 20px', borderRadius: 9, background: color, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 });
const input = { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(30,64,175,0.2)', fontSize: 14, boxSizing: 'border-box' };

const SITE_URL = 'https://www.vedicmindai.in/blog';

// Auto-generates relevant hashtags from a post's category/subcategory/audience/
// keyword fields — works for any of the 210 calendar topics without needing a
// hardcoded list per article, since it pattern-matches against the text.
function generateHashtags(post) {
  const tags = new Set(['#VedicMindAI']);

  const categoryMap = {
    'Vedic Maths': ['#VedicMaths', '#VedicMathematics', '#MentalMath'],
    'Reasoning': ['#Reasoning', '#LogicalReasoning', '#CriticalThinking'],
    'Aptitude': ['#Aptitude', '#QuantAptitude', '#MathSkills'],
  };
  (categoryMap[post.category] || []).forEach((t) => tags.add(t));

  const subcatText = (post.subcategory || '').toLowerCase();
  if (subcatText.includes('sutra')) tags.add('#VedicSutras');
  if (subcatText.includes('exam prep')) tags.add('#ExamPrep');
  if (subcatText.includes('speed')) tags.add('#SpeedMaths');
  if (subcatText.includes('divisibility')) tags.add('#NumberTricks');
  if (subcatText.includes('calendar')) tags.add('#MathTricks');
  if (subcatText.includes('algebra')) tags.add('#Algebra');
  if (subcatText.includes('ratio')) tags.add('#RatioAndProportion');
  if (subcatText.includes('pattern')) tags.add('#NumberPatterns');

  const audienceText = (post.target_audience || '').toLowerCase();
  if (audienceText.includes('jee')) tags.add('#JEEPreparation').add('#JEEMain');
  if (audienceText.includes('cat') && audienceText.includes('mba')) tags.add('#CATExam').add('#MBAPrep');
  if (audienceText.includes('ssc')) tags.add('#SSCCGL').add('#SSCPreparation');
  if (audienceText.includes('bank')) tags.add('#BankPO').add('#BankingExam');
  if (audienceText.includes('class')) tags.add('#StudyTips').add('#MathsForKids');
  if (audienceText.includes('neet')) tags.add('#NEETPreparation');

  tags.add('#MathTricks').add('#StudyMotivation').add('#EdTech');

  return Array.from(tags).slice(0, 12); // keep it reasonable, not a wall of hashtags
}

function buildSocialText(post) {
  const hashtags = generateHashtags(post).join(' ');
  const link = `${SITE_URL}/${post.slug}`;
  return `${post.title}\n\n${post.content}\n\n🔗 Read the full breakdown: ${link}\n\n${hashtags}`;
}

export default function AdminSocialExport() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { loadPosts(); }, []);

  async function loadPosts() {
    setLoading(true);
    try {
      const sb = await getSupabase();
      const { data, error } = await sb.from('blog_posts').select('*').eq('status', 'published').order('published_at', { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (e) {
      setStatusMsg('Could not load posts.');
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return posts;
    const q = search.toLowerCase();
    return posts.filter((p) => p.title.toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q));
  }, [posts, search]);

  const selected = posts.find((p) => p.id === selectedId);
  const socialText = selected ? buildSocialText(selected) : '';

  async function handleCopy() {
    await navigator.clipboard.writeText(socialText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([socialText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selected.slug}-social-post.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>
      {/* Left: searchable post list */}
      <div>
        <input
          style={{ ...input, marginBottom: 12 }}
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {statusMsg && <div style={{ ...card, background: '#FEE2E2' }}>{statusMsg}</div>}
        {loading && <p style={{ color: '#6B7280' }}>Loading…</p>}
        <div style={{ maxHeight: 600, overflowY: 'auto' }}>
          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              style={{
                padding: '12px 14px', borderRadius: 10, marginBottom: 8, cursor: 'pointer',
                background: selectedId === p.id ? 'rgba(30,64,175,0.1)' : 'rgba(255,255,255,0.8)',
                border: selectedId === p.id ? '1px solid #1e40af' : '1px solid rgba(30,64,175,0.1)',
              }}
            >
              <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginBottom: 4 }}>{p.category} · {p.subcategory}</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0A1628' }}>{p.title}</div>
            </div>
          ))}
          {!loading && filtered.length === 0 && <p style={{ color: '#9CA3AF', fontSize: 13 }}>No posts match your search.</p>}
        </div>
      </div>

      {/* Right: preview + export */}
      <div>
        {!selected && (
          <div style={{ ...card, textAlign: 'center', color: '#9CA3AF', padding: 60 }}>
            Select a blog post on the left to preview its social media post.
          </div>
        )}
        {selected && (
          <div style={card}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <button onClick={handleCopy} style={btn(copied ? '#10B981' : '#1e40af')}>
                {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
              </button>
              <button onClick={handleDownload} style={btn('#4B5563')}>⬇ Download as .txt</button>
            </div>
            <div style={{
              whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13.5, lineHeight: 1.6,
              background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, padding: 18,
              maxHeight: 560, overflowY: 'auto', color: '#1F2937',
            }}>
              {socialText}
            </div>
          </div>
        )}
        <div style={{ ...card, background: 'rgba(30,64,175,0.05)', border: '1px solid rgba(30,64,175,0.15)' }}>
          <p style={{ fontSize: 12, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
            <strong>Note:</strong> Hashtags are auto-generated from the post's category, subcategory, and target audience — review before posting, and feel free to trim or add platform-specific tags (Instagram vs. LinkedIn audiences often want different hashtag sets).
          </p>
        </div>
      </div>
    </div>
  );
}
