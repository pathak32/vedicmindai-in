import React, { useState } from 'react';
import { useCanonical } from '@/lib/useCanonical';
import { Link } from 'react-router-dom';

const SAFFRON = '#F59E0B'; const DARK = '#0A1628'; const BLUE = '#1E40AF';

function vedicSquare(n) {
  const ans = n * n;
  if (n % 10 === 5) {
    const t = Math.floor(n / 10);
    return { ans, sutra:'Ekadhikena Purvena', meaning:'By one more than the previous one',
      why:`Both cases: number ends in 5 — multiply tens digit by (tens+1), append 25.`,
      steps:[`Tens digit = ${t}. Multiply by one more: ${t} × ${t+1} = ${t*(t+1)}`,
             `Last two digits are always 25`,`Answer: ${t*(t+1)} | 25 = ${t*(t+1)}25`] };
  }
  if (n >= 75 && n <= 130) {
    const d = n - 100;
    const left = n + d; const right = Math.abs(d * d);
    return { ans, sutra:'Nikhilam Navatashcaramam Dashatah', meaning:'All from 9, last from 10',
      why:`${n} is close to base 100 — deviation is only ${d}.`,
      steps:[`Base = 100. Deviation: ${n} - 100 = ${d < 0 ? d : '+'+d}`,
             `Left part: ${n} + (${d}) = ${left}`,
             `Right part: (${d})² = ${right} → write as ${String(right).padStart(2,'0')}`,
             `Answer: ${left} | ${String(right).padStart(2,'0')} = ${ans}`] };
  }
  if (n >= 10 && n <= 99) {
    const a = Math.floor(n/10), b = n%10;
    const s1 = b*b, s2 = 2*a*b, s3 = a*a;
    const c1 = Math.floor(s1/10), r1 = s1%10;
    const s2c = s2 + c1, c2 = Math.floor(s2c/10), r2 = s2c%10;
    const s3c = s3 + c2;
    return { ans, sutra:'Dvandvayoga (Duplex)', meaning:'Sum of cross-products',
      why:`For any 2-digit number: a²|2ab|b² with carries.`,
      steps:[`Split ${n} → tens=${a}, units=${b}`,
             `Units²: ${b}² = ${s1} (write ${r1}, carry ${c1})`,
             `Cross: 2×${a}×${b} = ${s2} + carry ${c1} = ${s2c} (write ${r2}, carry ${c2})`,
             `Tens²: ${a}² = ${s3} + carry ${c2} = ${s3c}`,
             `Combine: ${s3c}${r2}${r1} = ${ans}`] };
  }
  return { ans, sutra:'Vedic Squaring', meaning:'', why:'', steps:[`${n}² = ${ans}`] };
}

const EXAMPLES = [25,47,65,97,108,35,99,112];

export default function VedicSquareCalculatorPage() {
  useCanonical('/tools/vedic-square-calculator');
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [err, setErr] = useState('');

  const calc = (val) => {
    const n = parseInt(val || input);
    if (!n || n < 2 || n > 9999) { setErr('Enter a number between 2 and 9999'); return; }
    setErr(''); setInput(String(n)); setResult(vedicSquare(n));
  };

  return (
    <div style={{ minHeight:'100vh', background:'#F0F4FF', fontFamily:'system-ui,sans-serif' }}>
      <div style={{ background:`linear-gradient(135deg,${DARK},${BLUE})`, padding:'48px 20px 40px', textAlign:'center', color:'white' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:30, padding:'5px 14px', marginBottom:14 }}>
          <span style={{fontSize:13,fontWeight:700,color:SAFFRON,textTransform:'uppercase',letterSpacing:'0.5px'}}>Free Tool</span>
        </div>
        <h1 style={{ fontSize:'clamp(22px,4vw,36px)', fontWeight:800, margin:'0 0 10px', lineHeight:1.2 }}>
          Vedic Square Calculator
        </h1>
        <p style={{ fontSize:15, color:'rgba(255,255,255,0.7)', maxWidth:480, margin:'0 auto', lineHeight:1.6 }}>
          Square any number instantly using Vedic Maths. See the exact sutra and step-by-step working — no calculator needed.
        </p>
      </div>

      <div style={{ maxWidth:640, margin:'0 auto', padding:'32px 16px 64px' }}>
        <div style={{ background:'white', borderRadius:20, padding:24, boxShadow:'0 4px 24px rgba(10,22,40,0.08)', border:'1px solid #E5E7EB', marginBottom:16 }}>
          <div style={{ marginBottom:14 }}>
            <span style={{ fontSize:11, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px' }}>Try an example:</span>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:8 }}>
              {EXAMPLES.map(e => (
                <button key={e} onClick={() => calc(e)}
                  style={{ background:'#F0F4FF', border:'1px solid #DBEAFE', borderRadius:8, padding:'4px 12px', color:BLUE, fontSize:13, fontWeight:600, cursor:'pointer' }}>{e}</button>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&calc()} placeholder="Enter any number (e.g. 47)"
              style={{ flex:1, border:'1.5px solid #E5E7EB', borderRadius:12, padding:'12px 16px', fontSize:18, fontWeight:600, color:DARK, outline:'none' }} />
            <button onClick={()=>calc()} style={{ background:SAFFRON, color:DARK, border:'none', borderRadius:12, padding:'12px 24px', fontWeight:700, fontSize:15, cursor:'pointer' }}>
              ⚡ Square It
            </button>
          </div>
          {err && <p style={{ color:'#EF4444', fontSize:13, marginTop:8 }}>{err}</p>}
        </div>

        {result && (
          <div style={{ background:'white', borderRadius:20, padding:24, boxShadow:'0 4px 24px rgba(10,22,40,0.08)', border:'1px solid #E5E7EB', marginBottom:16 }}>
            <div style={{ display:'inline-flex', flexDirection:'column', background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:12, padding:'10px 16px', marginBottom:16 }}>
              <span style={{ fontSize:11, color:'rgba(245,158,11,0.8)', textTransform:'uppercase', letterSpacing:'0.5px' }}>Sutra Applied</span>
              <span style={{ fontSize:16, fontWeight:800, color:SAFFRON }}>{result.sutra}</span>
              {result.meaning && <span style={{ fontSize:12, color:'#6B7280' }}>"{result.meaning}"</span>}
            </div>
            {result.why && <p style={{ fontSize:13, color:'#6B7280', marginBottom:16 }}>{result.why}</p>}
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:18 }}>
              {result.steps.map((s,i) => (
                <div key={i} style={{ display:'flex', gap:12 }}>
                  <div style={{ width:26, height:26, borderRadius:8, flexShrink:0, background:'rgba(245,158,11,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:SAFFRON }}>{i+1}</div>
                  <p style={{ fontSize:14, color:'#374151', margin:0, paddingTop:3 }}>{s}</p>
                </div>
              ))}
            </div>
            <div style={{ background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:12, padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:14, color:'#374151' }}>{input}² =</span>
              <span style={{ fontSize:28, fontWeight:800, color:'#16A34A' }}>{result.ans.toLocaleString()}</span>
            </div>
          </div>
        )}

        <div style={{ background:`linear-gradient(135deg,${DARK},${BLUE})`, borderRadius:20, padding:'28px 24px', textAlign:'center', color:'white' }}>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.7)', marginBottom:16 }}>
            Want to learn 40+ Vedic techniques like this? VedicMindAI teaches them step-by-step — free to start.
          </p>
          <Link to="/demo" style={{ display:'inline-block', background:SAFFRON, color:DARK, padding:'11px 28px', borderRadius:12, fontWeight:700, fontSize:14, textDecoration:'none' }}>
            Try Free Demo →
          </Link>
        </div>

        <div style={{ marginTop:32, background:'white', borderRadius:16, padding:'20px 24px', border:'1px solid #E5E7EB' }}>
          <h2 style={{ fontSize:16, fontWeight:700, color:DARK, marginBottom:12 }}>How Vedic Squaring Works</h2>
          <p style={{ fontSize:13, color:'#6B7280', lineHeight:1.7, margin:0 }}>
            Vedic Mathematics offers multiple sutras for squaring numbers — each suited to a different number type.
            <strong> Ekadhikena Purvena</strong> works for numbers ending in 5.
            <strong> Nikhilam</strong> works for numbers near 100.
            <strong> Dvandvayoga (Duplex)</strong> is the general method for any 2-digit number.
            All methods give the exact answer — just much faster than traditional long multiplication.
          </p>
        </div>
      </div>
    </div>
  );
}