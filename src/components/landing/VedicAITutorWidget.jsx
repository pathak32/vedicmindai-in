import React, { useState } from 'react';

const SAFFRON   = '#F59E0B';
const DARK_BLUE = '#0A1628';
const EXAMPLES = {
  "97 × 96": {
    "sutra": "Nikhilam Navatashcaramam Dashatah",
    "sutra_meaning": "All from 9, last from 10",
    "why": "Both numbers close to 100 — base-100 complement method is ideal.",
    "steps": [
      "Base=100. Deficits: 97→-3, 96→-4",
      "Left: 97-4=93",
      "Right: 3×4=12",
      "Answer: 93|12 = 9312"
    ],
    "answer": 9312,
    "speed_note": "Traditional: 12 steps. Nikhilam: 4 mental steps."
  },
  "104 × 108": {
    "sutra": "Nikhilam Navatashcaramam Dashatah",
    "sutra_meaning": "All from 9, last from 10",
    "why": "Both exceed 100 — surpluses above base of 100.",
    "steps": [
      "Base=100. Surpluses: 104→+4, 108→+8",
      "Left: 104+8=112",
      "Right: 4×8=32",
      "Answer: 112|32 = 11232"
    ],
    "answer": 11232,
    "speed_note": "Same sutra works above 100 too!"
  },
  "998 × 997": {
    "sutra": "Nikhilam Navatashcaramam Dashatah",
    "sutra_meaning": "All from 9, last from 10",
    "why": "Both close to 1000 — use base 1000 with 3-digit right parts.",
    "steps": [
      "Base=1000. Deficits: 998→-2, 997→-3",
      "Left: 998-3=995",
      "Right: 2×3=006 (3 digits)",
      "Answer: 995|006 = 995006"
    ],
    "answer": 995006,
    "speed_note": "A 6-digit multiplication in 3 mental steps."
  },
  "43 × 47": {
    "sutra": "Ekadhikena Purvena",
    "sutra_meaning": "By one more than the previous one",
    "why": "Same tens digit (4), units sum to 10 (3+7=10).",
    "steps": [
      "Check: same tens? ✓ Units sum=10? ✓",
      "Right: 3×7=21",
      "Left: 4×(4+1)=4×5=20",
      "Answer: 20|21 = 2021"
    ],
    "answer": 2021,
    "speed_note": "Any pair with same tens & units summing to 10 — 2 seconds!"
  },
  "112 × 108": {
    "sutra": "Nikhilam Navatashcaramam Dashatah",
    "sutra_meaning": "All from 9, last from 10",
    "why": "Both near 100 with small surpluses.",
    "steps": [
      "Base=100. Surpluses: +12, +8",
      "Left: 112+8=120",
      "Right: 12×8=96",
      "Answer: 120|96 = 12096"
    ],
    "answer": 12096,
    "speed_note": "Traditional: 6 steps. Vedic: 3 mental steps."
  }
};
const EXAMPLE_KEYS = Object.keys(EXAMPLES);

export default function VedicAITutorWidget() {
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState('');

  const solve = async (problem) => {
    const q = (problem || input).trim();
    if (!q) return;
    setInput(q); setLoading(true); setResult(null); setError('');
    const pre = EXAMPLES[q] || Object.entries(EXAMPLES).find(([k]) => k.replace(/\s/g,'') === q.replace(/\s/g,''))?.[1];
    if (pre) { setTimeout(() => { setResult(pre); setLoading(false); }, 400); return; }
    try {
      const res = await fetch('/api/vedic-tutor', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ problem: q }) });
      const data = await res.json();
      if (data.sutra) setResult(data);
      else setError('Try one of the example problems above!');
    } catch { setError('Try one of the example problems above!'); }
    finally { setLoading(false); }
  };

  return (
    <section style={{ background:'linear-gradient(135deg,#0A1628 0%,#1E3A5F 100%)', padding:'56px 20px' }}>
      <div style={{ maxWidth:700, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:30, padding:'6px 16px', marginBottom:14 }}>
            <span style={{fontSize:16}}>🤖</span>
            <span style={{ fontSize:12, fontWeight:700, color:SAFFRON, letterSpacing:'0.5px', textTransform:'uppercase' }}>Live AI Tutor Demo — No Signup</span>
          </div>
          <h2 style={{ fontSize:'clamp(22px,4vw,32px)', fontWeight:800, color:'white', margin:'0 0 10px', lineHeight:1.2 }}>
            Watch AI Solve Any Multiplication<br/><span style={{color:SAFFRON}}>the Vedic Way</span>
          </h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.65)', margin:0 }}>Click an example or type your own problem.</p>
        </div>
        <div style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:20, padding:'24px' }}>
          <div style={{ marginBottom:14 }}>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.45)', textTransform:'uppercase' }}>Try an example:</span>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:8 }}>
              {EXAMPLE_KEYS.map(ex => (
                <button key={ex} onClick={() => solve(ex)} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, padding:'5px 12px', color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:600, cursor:'pointer' }}>{ex}</button>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <input value={input} onChange={e=>{const v=e.target.value; if(/^[\dxX+\-×÷*/^%√().\s]*$/.test(v)) setInput(v);}} onKeyDown={e=>e.key==='Enter'&&solve()} placeholder='e.g. 97 x 96 or type your own...' style={{ flex:1, background:'rgba(255,255,255,0.08)', border:'1.5px solid rgba(255,255,255,0.18)', borderRadius:12, padding:'12px 16px', color:'white', fontSize:16, outline:'none' }} />
            <button onClick={()=>solve()} disabled={loading||!input.trim()} style={{ background:loading?'rgba(245,158,11,0.4)':SAFFRON, color:DARK_BLUE, border:'none', borderRadius:12, padding:'12px 22px', fontWeight:700, fontSize:14, cursor:loading?'not-allowed':'pointer' }}>
              {loading ? '✨ Solving…' : '⚡ Solve'}
            </button>
          </div>
        </div>
        {error && <div style={{ marginTop:16, background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:12, padding:'12px 16px', color:'#FCD34D', fontSize:14, textAlign:'center' }}>💡 {error}</div>}
        {result && !loading && (
          <div style={{ marginTop:16, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:20, padding:'24px' }}>
            <div style={{ marginBottom:18 }}>
              <div style={{ display:'inline-flex', flexDirection:'column', background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.25)', borderRadius:12, padding:'10px 16px' }}>
                <span style={{ fontSize:11, color:'rgba(245,158,11,0.7)', textTransform:'uppercase' }}>Vedic Sutra Applied</span>
                <span style={{ fontSize:16, fontWeight:800, color:SAFFRON }}>{result.sutra}</span>
                {result.sutra_meaning && <span style={{ fontSize:12, color:'rgba(255,255,255,0.55)' }}>'{result.sutra_meaning}'</span>}
              </div>
              {result.why && <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', margin:'10px 0 0' }}>{result.why}</p>}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:18 }}>
              {(result.steps||[]).map((step,i) => (
                <div key={i} style={{ display:'flex', gap:12 }}>
                  <div style={{ width:26, height:26, borderRadius:8, flexShrink:0, background:'rgba(245,158,11,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:SAFFRON }}>{i+1}</div>
                  <p style={{ fontSize:14, color:'rgba(255,255,255,0.85)', margin:0, paddingTop:3 }}>{step}</p>
                </div>
              ))}
            </div>
            {result.answer !== undefined && (
              <div style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.25)', borderRadius:12, padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:14, color:'rgba(255,255,255,0.7)' }}>Answer</span>
                <span style={{ fontSize:24, fontWeight:800, color:'#4ADE80' }}>{result.answer.toLocaleString()}</span>
              </div>
            )}
            {result.speed_note && <p style={{ fontSize:13, color:'rgba(255,255,255,0.45)', margin:'10px 0 0', fontStyle:'italic' }}>⚡ {result.speed_note}</p>}
          </div>
        )}
        <div style={{ textAlign:'center', marginTop:24 }}>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.45)', margin:'0 0 12px' }}>Liked it? 40+ sutras waiting inside.</p>
          <a href='/auth' style={{ display:'inline-flex', alignItems:'center', background:'white', color:DARK_BLUE, padding:'12px 28px', borderRadius:12, fontWeight:700, fontSize:14, textDecoration:'none' }}>Start Learning Free 🚀</a>
        </div>
      </div>
    </section>
  );
}