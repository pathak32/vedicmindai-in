import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

// ── Constants ────────────────────────────────────────────────────────────────
const S = '#F59E0B', N = '#0A1628', W = '#FFFFFF';
const CTA_A = '#6D28D9', CTA_B = '#DB2777';
const CATS = ['All','Vedic Maths','Vedic vs Abacus','Reasoning','Aptitude'];
const SITE = 'https://www.vedicmindai.in/blog';

// ── Auto-extract hook + bullets from title/content ───────────────────────────
function extractCarouselData(post) {
  const sentences = (post.content || '').replace(/\n+/g,' ').split(/[.!?]+/).map(s=>s.trim()).filter(s=>s.length>20);
  const hook = post.title.length < 60 ? post.title : sentences[0] || post.title;
  const hookSub = sentences.find(s=>s.includes('second')||s.includes('faster')||s.includes('%')||s.includes('times')||s.includes('vs')) || sentences[1] || '';
  const bullets = sentences.filter(s=>
    s.includes(':')||s.match(/\d/)||s.toLowerCase().includes('vedic')||s.toLowerCase().includes('faster')||s.toLowerCase().includes('exam')
  ).slice(0,3).map((s,i) => ({ icon: ['⚡','✅','🎯'][i], text: s.slice(0,55)+(s.length>55?'…':'') }));
  if (bullets.length < 3) { ['Key benefit','Learn faster','Try for free'].forEach((t,i)=>{ if(!bullets[i]) bullets[i]={icon:'💡',text:t}; }); }
  return { hook: hook.slice(0,60)+(hook.length>60?'…':''), hookSub: hookSub.slice(0,70), bullets: bullets.slice(0,3) };
}

// ── Hashtag generator (preserved from original) ──────────────────────────────
function genHashtags(post) {
  const tags = new Set(['#VedicMindAI','#MathTricks','#EdTech','#StudyMotivation']);
  const c = post.category||''; const sub = (post.subcategory||'').toLowerCase(); const aud = '';
  if(c==='Vedic Maths'||sub.includes('vedic')) { tags.add('#VedicMaths'); tags.add('#MentalMath'); tags.add('#SpeedMaths'); }
  if(c==='Reasoning') { tags.add('#Reasoning'); tags.add('#LogicalReasoning'); }
  if(c==='Aptitude') { tags.add('#Aptitude'); tags.add('#QuantAptitude'); }
  if(sub.includes('abacus')) { tags.add('#AbacusVsVedic'); tags.add('#MentalCalculation'); }
  if(aud.includes('jee')) { tags.add('#JEEPrep'); tags.add('#JEEMain'); }
  if(aud.includes('ssc')) { tags.add('#SSCCGL'); }
  if(aud.includes('cat')) { tags.add('#CATExam'); }
  tags.add('#VedicMathematics'); tags.add('#IndianMaths'); tags.add('#CBSEMaths');
  return [...tags].slice(0,14).join(' ');
}

// ── Platform copy ────────────────────────────────────────────────────────────
function getPlatformCopy(post, d) {
  const tags = genHashtags(post);
  const link = `${SITE}/${post.slug}`;
  const bul = d.bullets.map(b=>`${b.icon} ${b.text}`).join('\n');
  return [
    { key:'instagram', label:'Instagram', color:'#E1306C',
      text:`${d.hook} 🤯\n\n${d.hookSub}\n\n${bul}\n\n👉 FREE demo → Link in bio\n.\n.\n.\n${tags}` },
    { key:'facebook', label:'Facebook', color:'#1877F2',
      text:`${post.title}\n\n${d.hookSub}\n\n${bul}\n\n🚀 Try FREE: vedicmindai.in/demo\n\n${tags}` },
    { key:'whatsapp', label:'WhatsApp', color:'#25D366',
      text:`*${d.hook}*\n_${d.hookSub}_\n\n${bul}\n\n🔗 Free demo: vedicmindai.in/demo` },
    { key:'twitter', label:'Twitter/X', color:'#1DA1F2',
      text:`${d.hook}\n\n${d.bullets.slice(0,2).map(b=>`${b.icon} ${b.text}`).join(' | ')}\n\nFREE → vedicmindai.in/demo\n#VedicMaths #SpeedMaths` },
  ];
}

// ── Slide components ─────────────────────────────────────────────────────────
function HookSlide({ hook, hookSub, category, compact:c }) {
  const fs = c ? { p:'12px 10px', t:7, h:c?18:36, s:8, d:14 } : { p:'28px 24px', t:10, h:36, s:14, d:22 };
  return (
    <div style={{ width:'100%', height:'100%', background:`linear-gradient(150deg,${N},#1E3A5F)`,
      display:'flex', flexDirection:'column', justifyContent:'space-between', padding:fs.p, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', right:-8, top:-8, fontSize:c?70:140, opacity:0.04, color:W, fontWeight:900, lineHeight:1 }}>ॐ</div>
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <span style={{ background:'rgba(245,158,11,0.18)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:20,
          padding:c?'2px 7px':'4px 11px', fontSize:fs.t, fontWeight:700, color:S, textTransform:'uppercase', letterSpacing:'0.5px' }}>{category||'Vedic Maths'}</span>
        <span style={{ fontSize:c?6:9, color:'rgba(255,255,255,0.28)', fontWeight:600 }}>1/3</span>
      </div>
      <div style={{ textAlign:'center' }}>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:c?6:10, fontWeight:600, margin:`0 0 ${c?4:8}px`, textTransform:'uppercase', letterSpacing:'0.5px' }}>Did you know?</p>
        <h2 style={{ color:S, fontSize:c?16:34, fontWeight:900, margin:`0 0 ${c?4:8}px`, lineHeight:1.15 }}>{hook}</h2>
        {hookSub && <p style={{ color:'rgba(255,255,255,0.7)', fontSize:c?7:13, fontWeight:600, margin:0, lineHeight:1.3 }}>{hookSub}</p>}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:5, justifyContent:'center' }}>
        <div style={{ width:fs.d, height:fs.d, borderRadius:'50%', background:S, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:c?7:11, fontWeight:800, color:N }}>V</span>
        </div>
        <span style={{ fontSize:c?6:10, color:'rgba(255,255,255,0.3)', fontWeight:600 }}>VedicMindAI</span>
      </div>
    </div>
  );
}

function ProofSlide({ bullets, category, compact:c }) {
  const fs = c ? { p:'12px 10px', t:7, h:11, i:8, d:14 } : { p:'28px 24px', t:10, h:18, i:13, d:22 };
  return (
    <div style={{ width:'100%', height:'100%', background:'#F8F6F0',
      display:'flex', flexDirection:'column', justifyContent:'space-between', padding:fs.p }}>
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <span style={{ background:N, borderRadius:20, padding:c?'2px 7px':'4px 11px', fontSize:fs.t, fontWeight:700, color:S, textTransform:'uppercase', letterSpacing:'0.5px' }}>{category||'Vedic Maths'}</span>
        <span style={{ fontSize:c?6:9, color:'#9CA3AF', fontWeight:600 }}>2/3</span>
      </div>
      <div>
        <h2 style={{ color:N, fontSize:fs.h, fontWeight:800, margin:`0 0 ${c?6:12}px`, lineHeight:1.2 }}>Here's the truth</h2>
        {bullets.map((b,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap:c?6:10,
            background:W, borderRadius:c?7:11, padding:c?'5px 7px':'11px 13px',
            marginBottom:c?3:7, border:'1px solid #E5E7EB', boxShadow:'0 1px 5px rgba(10,22,40,0.05)' }}>
            <span style={{ fontSize:c?12:19 }}>{b.icon}</span>
            <span style={{ color:N, fontWeight:700, fontSize:fs.i, lineHeight:1.3 }}>{b.text}</span>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:5 }}>
        <div style={{ width:fs.d, height:fs.d, borderRadius:'50%', background:N, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:c?7:11, fontWeight:800, color:S }}>V</span>
        </div>
        <span style={{ fontSize:c?6:10, color:'#9CA3AF', fontWeight:600 }}>VedicMindAI</span>
      </div>
    </div>
  );
}

function CTASlide({ category, compact:c }) {
  const fs = c ? { p:'12px 10px', t:7, h:12, u:8, d:14 } : { p:'28px 24px', t:10, h:22, u:12, d:22 };
  return (
    <div style={{ width:'100%', height:'100%', background:`linear-gradient(140deg,${CTA_A},${CTA_B})`,
      display:'flex', flexDirection:'column', justifyContent:'space-between', padding:fs.p, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', right:-20, top:'-15%', width:c?70:140, height:c?70:140,
        borderRadius:'50%', background:'rgba(255,255,255,0.07)', pointerEvents:'none' }}/>
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <span style={{ background:'rgba(255,255,255,0.17)', borderRadius:20, padding:c?'2px 7px':'4px 11px',
          fontSize:fs.t, fontWeight:700, color:W, textTransform:'uppercase', letterSpacing:'0.5px' }}>{category||'Vedic Maths'}</span>
        <span style={{ fontSize:c?6:9, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>3/3</span>
      </div>
      <div style={{ textAlign:'center' }}>
        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:c?6:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.7px', margin:`0 0 ${c?5:10}px` }}>Try it yourself →</p>
        <h2 style={{ color:W, fontSize:fs.h, fontWeight:900, lineHeight:1.15, margin:`0 0 ${c?8:16}px` }}>
          Ancient wisdom.<br/><span style={{ color:'#FDE68A' }}>Modern speed.</span>
        </h2>
        <div style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(6px)',
          border:'1px solid rgba(255,255,255,0.22)', borderRadius:c?8:12,
          padding:c?'7px 9px':'13px 16px', display:'inline-block' }}>
          <p style={{ color:W, fontSize:c?10:17, fontWeight:900, margin:0 }}>🚀 FREE Demo</p>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:fs.u, margin:c?'2px 0 0':'4px 0 0', fontWeight:600 }}>vedicmindai.in/demo</p>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:5, justifyContent:'center' }}>
        <div style={{ width:fs.d, height:fs.d, borderRadius:'50%', background:'rgba(255,255,255,0.18)',
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:c?7:11, fontWeight:800, color:W }}>V</span>
        </div>
        <span style={{ fontSize:c?6:10, color:'rgba(255,255,255,0.45)', fontWeight:600 }}>@vedicmindai</span>
      </div>
    </div>
  );
}

// ── 10-second video ──────────────────────────────────────────────────────────
function VideoPlayer({ cd, category }) {
  const [t, setT] = useState(0), [playing, setPlaying] = useState(false);
  const raf = useRef(null), t0 = useRef(null);
  const tick = (ts) => {
    if (!t0.current) t0.current = ts;
    const e = (ts - t0.current) / 1000;
    if (e >= 10) { setT(9.99); setPlaying(false); return; }
    setT(e); raf.current = requestAnimationFrame(tick);
  };
  const play = () => { t0.current=null; setT(0); setPlaying(true); raf.current=requestAnimationFrame(tick); };
  const stop = () => { if(raf.current) cancelAnimationFrame(raf.current); setT(0); setPlaying(false); t0.current=null; };
  useEffect(()=>()=>{ if(raf.current) cancelAnimationFrame(raf.current); },[]);
  const slide = t<3?0:t<5?1:2; const pct=(t/10)*100;
  return (
    <div>
      <div style={{ background:'#0D1117', borderRadius:16, overflow:'hidden', border:'2px solid #2D3748' }}>
        <div style={{ aspectRatio:'9/16', maxWidth:180, margin:'0 auto' }}>
          {slide===0&&<HookSlide hook={cd.hook} hookSub={cd.hookSub} category={category} compact={false}/>}
          {slide===1&&<ProofSlide bullets={cd.bullets} category={category} compact={false}/>}
          {slide===2&&<CTASlide category={category} compact={false}/>}
        </div>
        <div style={{ background:'#1C2333', padding:'9px 13px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
            <div style={{ display:'flex', gap:4 }}>
              {[{l:'Hook',s:3},{l:'Proof',s:2},{l:'CTA',s:5}].map((x,i)=>(
                <span key={i} style={{ fontSize:9, padding:'2px 6px', borderRadius:7, fontWeight:700,
                  background:slide===i?S:'rgba(255,255,255,0.07)', color:slide===i?N:'rgba(255,255,255,0.3)' }}>{x.l} {x.s}s</span>
              ))}
            </div>
            <span style={{ fontSize:10, color:'#6B7280' }}>{Math.max(0,10-t).toFixed(1)}s</span>
          </div>
          <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:99, height:3 }}>
            <div style={{ height:3, borderRadius:99, background:`linear-gradient(90deg,${CTA_A},${CTA_B})`, width:`${pct}%`, transition:'width 0.1s linear' }}/>
          </div>
        </div>
      </div>
      <div style={{ display:'flex', gap:7, marginTop:9 }}>
        <button onClick={playing?stop:play}
          style={{ flex:1, padding:'8px', borderRadius:8, border:'none', cursor:'pointer',
            background:playing?'#374151':`linear-gradient(135deg,${CTA_A},${CTA_B})`, color:W, fontWeight:700, fontSize:12 }}>
          {playing?'⏹ Stop':t>0?'🔄 Replay':'▶ Play 10s'}
        </button>
      </div>
      <p style={{ color:'#4B5563', fontSize:10, textAlign:'center', margin:'5px 0 0' }}>Screen-record → post as Reel/Story</p>
    </div>
  );
}

// ── POSTED KEY for localStorage ──────────────────────────────────────────────
const POSTED_KEY = 'vedicmind_social_posted_ids';
function getPostedIds() { try { return new Set(JSON.parse(localStorage.getItem(POSTED_KEY)||'[]')); } catch { return new Set(); } }
function savePostedId(id) { const s=getPostedIds(); s.add(id); localStorage.setItem(POSTED_KEY,JSON.stringify([...s])); }

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function AdminSocialExport() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [cat, setCat]         = useState('All');
  const [filter, setFilter]   = useState('all');
  const [selId, setSelId]     = useState(null);
  const [slide, setSlide]     = useState(0);
  const [tab, setTab]         = useState('carousel');
  const [copied, setCopied]   = useState(null);
  const [postedIds, setPostedIds] = useState(getPostedIds);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const sb = await getSupabase();
        const { data, error } = await sb.from('blog_posts')
          .select('id,title,slug,category,subcategory,content,status,published_at')
          .order('published_at', { ascending: false });
        if (error) throw error;
        setPosts(data || []);
        if (data?.length) setSelId(data[0].id);
      } catch (e) { setStatusMsg('Could not load posts.'); }
      finally { setLoading(false); }
    })();
  }, []);

  const markPosted = (id) => {
    savePostedId(id);
    setPostedIds(new Set([...postedIds, id]));
    setStatusMsg('✓ Marked as posted!');
    setTimeout(() => setStatusMsg(''), 2000);
  };

  const copy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(()=>setCopied(null),2000); });
  };

  const filtered = useMemo(() => posts.filter(p => {
    const mSearch = !search.trim() || p.title.toLowerCase().includes(search.toLowerCase()) || (p.category||'').toLowerCase().includes(search.toLowerCase());
    const mCat = cat==='All' || (cat==='Vedic vs Abacus' ? (p.subcategory||'')===cat : p.category===cat && (p.subcategory||'')!=='Vedic vs Abacus');
    const isPosted = postedIds.has(p.id);
    const mFilter = filter==='all'?true:filter==='posted'?isPosted:!isPosted;
    return mSearch && mCat && mFilter;
  }), [posts, search, cat, filter, postedIds]);

  const sel = posts.find(p=>p.id===selId);
  const cd = sel ? extractCarouselData(sel) : null;
  const isPosted = sel ? postedIds.has(sel.id) : false;
  const totalPosted = postedIds.size;
  const totalLeft = posts.filter(p=>!postedIds.has(p.id)).length;

  if (loading) return <div style={{ padding:40, textAlign:'center', color:'#6B7280' }}>Loading posts…</div>;

  return (
    <div style={{ minHeight:'100vh', background:'#0D1117', fontFamily:'system-ui,sans-serif', padding:'18px 14px' }}>

      {/* Header */}
      <div style={{ maxWidth:980, margin:'0 auto 16px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
        <div>
          <h1 style={{ color:W, fontSize:17, fontWeight:800, margin:'0 0 2px' }}>📲 Social Export</h1>
          <p style={{ color:'#4B5563', fontSize:11, margin:0 }}>Blog Manager · {posts.length} articles</p>
        </div>
        <div style={{ display:'flex', gap:7, alignItems:'center', flexWrap:'wrap' }}>
          {statusMsg && <span style={{ color:'#4ADE80', fontSize:12, fontWeight:600 }}>{statusMsg}</span>}
          <span style={{ padding:'4px 11px', borderRadius:20, fontSize:11, fontWeight:700,
            background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', color:'#4ADE80' }}>✓ {totalPosted} Posted</span>
          <span style={{ padding:'4px 11px', borderRadius:20, fontSize:11, fontWeight:700,
            background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)', color:S }}>◉ {totalLeft} Remaining</span>
        </div>
      </div>

      <div style={{ maxWidth:980, margin:'0 auto', display:'flex', gap:13, flexWrap:'wrap' }}>

        {/* ── SIDEBAR ────────────────────────────────────────────────────── */}
        <div style={{ width:225, flexShrink:0 }}>
          {/* Search */}
          <div style={{ position:'relative', marginBottom:7 }}>
            <span style={{ position:'absolute', left:9, top:'50%', transform:'translateY(-50%)', fontSize:12, color:'#6B7280' }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search articles…"
              style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:9, padding:'8px 8px 8px 28px', color:W, fontSize:12, outline:'none', boxSizing:'border-box' }}/>
          </div>
          {/* Category dropdown */}
          <select value={cat} onChange={e=>setCat(e.target.value)}
            style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:9, padding:'7px 9px', color:W, fontSize:12, marginBottom:7, cursor:'pointer', outline:'none' }}>
            {CATS.map(c=><option key={c} value={c} style={{ background:'#1F2937' }}>{c}</option>)}
          </select>
          {/* Filter pills */}
          <div style={{ display:'flex', gap:4, marginBottom:11 }}>
            {[['all','All'],['unposted','Not Posted'],['posted','Posted']].map(([k,l])=>(
              <button key={k} onClick={()=>setFilter(k)}
                style={{ flex:1, padding:'5px 3px', borderRadius:7, border:'none', cursor:'pointer', fontSize:9, fontWeight:700,
                  background:filter===k?S:'rgba(255,255,255,0.06)', color:filter===k?N:'rgba(255,255,255,0.4)' }}>{l}</button>
            ))}
          </div>
          {/* List */}
          <div style={{ maxHeight:480, overflowY:'auto' }}>
            {filtered.length===0&&<p style={{ color:'#4B5563', fontSize:12, textAlign:'center', padding:'16px 0' }}>No articles found</p>}
            {filtered.map(p=>{
              const done = postedIds.has(p.id);
              return (
                <div key={p.id} onClick={()=>{ setSelId(p.id); setSlide(0); }}
                  style={{ padding:'8px 9px', borderRadius:9, cursor:'pointer', marginBottom:4, position:'relative',
                    background:selId===p.id?'rgba(245,158,11,0.10)':'rgba(255,255,255,0.03)',
                    border:selId===p.id?`1px solid rgba(245,158,11,0.3)`:'1px solid rgba(255,255,255,0.05)' }}>
                  {done&&<span style={{ position:'absolute', top:5, right:5, background:'rgba(34,197,94,0.15)',
                    border:'1px solid rgba(34,197,94,0.3)', borderRadius:5, padding:'1px 5px',
                    fontSize:8, fontWeight:700, color:'#4ADE80' }}>✓</span>}
                  <p style={{ color:selId===p.id?S:W, fontWeight:600, fontSize:11, margin:'0 0 2px',
                    lineHeight:1.3, paddingRight:done?28:0 }}>{p.title}</p>
                  <p style={{ color:'#6B7280', fontSize:9, margin:0 }}>{p.category||'—'}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MAIN PANEL ─────────────────────────────────────────────────── */}
        {sel && cd && (
          <div style={{ flex:1, minWidth:280 }}>
            {/* Article bar */}
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
              borderRadius:11, padding:'11px 13px', marginBottom:11, display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:8 }}>
              <div style={{ flex:1 }}>
                <span style={{ fontSize:10, fontWeight:700, color:S, textTransform:'uppercase', letterSpacing:'0.5px' }}>{sel.category}</span>
                <p style={{ color:W, fontWeight:700, fontSize:12, margin:'2px 0 0', lineHeight:1.3 }}>{sel.title}</p>
              </div>
              <button onClick={()=>markPosted(sel.id)} disabled={isPosted}
                style={{ padding:'6px 12px', borderRadius:8, border:'none', cursor:isPosted?'default':'pointer', fontSize:11, fontWeight:700, flexShrink:0,
                  background:isPosted?'rgba(34,197,94,0.12)':`linear-gradient(135deg,#22C55E,#16A34A)`,
                  color:isPosted?'#4ADE80':W }}>
                {isPosted?'✓ Posted':'Mark as Posted'}
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display:'flex', gap:4, marginBottom:13, background:'rgba(255,255,255,0.04)',
              padding:3, borderRadius:10, border:'1px solid rgba(255,255,255,0.06)' }}>
              {[['carousel','📱 Slides'],['video','🎬 10s Video'],['copy','📋 Copy']].map(([k,l])=>(
                <button key={k} onClick={()=>setTab(k)}
                  style={{ flex:1, padding:'7px 5px', borderRadius:8, border:'none', cursor:'pointer', fontWeight:700, fontSize:11,
                    background:tab===k?S:'transparent', color:tab===k?N:'rgba(255,255,255,0.4)' }}>{l}</button>
              ))}
            </div>

            {/* CAROUSEL */}
            {tab==='carousel'&&(
              <div style={{ display:'flex', gap:13, flexWrap:'wrap' }}>
                <div style={{ flex:'0 0 175px' }}>
                  <div style={{ background:'#1C2333', borderRadius:26, padding:'8px 7px', border:'2px solid #2D3748' }}>
                    <div style={{ width:46, height:4, background:'#2D3748', borderRadius:2, margin:'0 auto 6px' }}/>
                    <div style={{ borderRadius:18, overflow:'hidden', aspectRatio:'9/16' }}>
                      {slide===0&&<HookSlide hook={cd.hook} hookSub={cd.hookSub} category={sel.category} compact={false}/>}
                      {slide===1&&<ProofSlide bullets={cd.bullets} category={sel.category} compact={false}/>}
                      {slide===2&&<CTASlide category={sel.category} compact={false}/>}
                    </div>
                    <div style={{ width:34, height:3, background:'#2D3748', borderRadius:2, margin:'6px auto 0' }}/>
                  </div>
                  <div style={{ display:'flex', gap:6, justifyContent:'center', marginTop:9 }}>
                    {[0,1,2].map(i=>(
                      <button key={i} onClick={()=>setSlide(i)}
                        style={{ width:i===slide?20:7, height:7, borderRadius:4, border:'none', cursor:'pointer',
                          background:i===slide?S:'rgba(255,255,255,0.18)', transition:'all 0.2s' }}/>
                    ))}
                  </div>
                  <p style={{ textAlign:'center', color:'#6B7280', fontSize:10, marginTop:6 }}>{['Hook','Proof','CTA'][slide]}</p>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ color:'#6B7280', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:7 }}>All 3 Slides</p>
                  <div style={{ display:'flex', gap:6, marginBottom:13 }}>
                    {[0,1,2].map(i=>(
                      <div key={i} onClick={()=>setSlide(i)}
                        style={{ flex:1, aspectRatio:'9/16', borderRadius:8, overflow:'hidden', cursor:'pointer',
                          border:i===slide?`2px solid ${S}`:'2px solid transparent',
                          boxShadow:i===slide?`0 0 10px rgba(245,158,11,0.18)`:'none' }}>
                        {i===0&&<HookSlide hook={cd.hook} hookSub={cd.hookSub} category={sel.category} compact={true}/>}
                        {i===1&&<ProofSlide bullets={cd.bullets} category={sel.category} compact={true}/>}
                        {i===2&&<CTASlide category={sel.category} compact={true}/>}
                      </div>
                    ))}
                  </div>
                  <div style={{ background:'rgba(109,40,217,0.07)', border:'1px solid rgba(109,40,217,0.18)', borderRadius:9, padding:'10px 12px' }}>
                    <p style={{ color:'#A78BFA', fontSize:11, fontWeight:700, margin:'0 0 3px' }}>CTA: Purple → Pink gradient</p>
                    <p style={{ color:'#6B7280', fontSize:11, margin:0, lineHeight:1.5 }}>High contrast white text. Scroll-stopper on Instagram. Proven Gen-Z colour for social media.</p>
                  </div>
                </div>
              </div>
            )}

            {/* VIDEO */}
            {tab==='video'&&(
              <div style={{ display:'flex', gap:13, flexWrap:'wrap' }}>
                <div style={{ flex:'0 0 190px' }}><VideoPlayer cd={cd} category={sel.category}/></div>
                <div style={{ flex:1 }}>
                  <div style={{ background:'rgba(34,197,94,0.07)', border:'1px solid rgba(34,197,94,0.18)', borderRadius:9, padding:'12px 12px', marginBottom:12 }}>
                    <p style={{ color:'#4ADE80', fontSize:12, fontWeight:700, margin:'0 0 8px' }}>🎬 How to Export 10s Video</p>
                    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                      {[
                        {step:'1', text:'Click ▶ Play — video starts automatically'},
                        {step:'2', text:'Windows: Press Win+Alt+R to start screen recording'},
                        {step:'3', text:'Let the 10s play fully → Win+Alt+R again to stop'},
                        {step:'4', text:'File saves to Videos folder → upload to Instagram Reels / WhatsApp Status'},
                      ].map(s=>(
                        <div key={s.step} style={{ display:'flex', gap:8 }}>
                          <span style={{ width:18, height:18, borderRadius:'50%', background:'rgba(34,197,94,0.2)', color:'#4ADE80', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{s.step}</span>
                          <span style={{ color:'#9CA3AF', fontSize:11, lineHeight:1.4 }}>{s.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {[{t:'Format',v:'9:16 · Reels/Stories/Shorts'},{t:'Duration',v:'10 seconds'},{t:'Slide 1',v:'0–3s · Hook · Navy'},{t:'Slide 2',v:'3–5s · Proof · Cream'},{t:'Slide 3',v:'5–10s · CTA · Purple-Pink'},{t:'Transition',v:'Fade 0.15s'}].map(r=>(
                    <div key={r.t} style={{ display:'flex', gap:9, padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color:'#6B7280', fontSize:11, width:80, flexShrink:0 }}>{r.t}</span>
                      <span style={{ color:W, fontSize:11 }}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COPY */}
            {tab==='copy'&&(
              <div>
                {!isPosted&&(
                  <div style={{ background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.15)',
                    borderRadius:9, padding:'9px 12px', marginBottom:11, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
                    <p style={{ color:S, fontSize:12, fontWeight:600, margin:0 }}>After posting → mark done to avoid repeats</p>
                    <button onClick={()=>markPosted(sel.id)}
                      style={{ padding:'5px 11px', borderRadius:7, border:'none', cursor:'pointer',
                        background:'linear-gradient(135deg,#22C55E,#16A34A)', color:W, fontWeight:700, fontSize:11 }}>Mark Posted ✓</button>
                  </div>
                )}
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {getPlatformCopy(sel,cd).map(p=>(
                    <div key={p.key} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, overflow:'hidden' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                        padding:'8px 12px', background:'rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ color:W, fontSize:12, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
                          <span style={{ width:8, height:8, borderRadius:'50%', background:p.color, display:'inline-block' }}/>
                          {p.label}
                        </span>
                        <button onClick={()=>copy(p.text,p.key)}
                          style={{ padding:'4px 11px', borderRadius:7, border:'none', cursor:'pointer', fontSize:11, fontWeight:700,
                            background:copied===p.key?'rgba(34,197,94,0.2)':'rgba(255,255,255,0.08)',
                            color:copied===p.key?'#4ADE80':'rgba(255,255,255,0.55)' }}>
                          {copied===p.key?'✓ Copied!':'Copy'}
                        </button>
                      </div>
                      <pre style={{ margin:0, padding:'9px 12px', color:'#9CA3AF', fontSize:11, lineHeight:1.65,
                        whiteSpace:'pre-wrap', wordBreak:'break-word', fontFamily:'inherit', maxHeight:120, overflowY:'auto' }}>
                        {p.text}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
