import React from 'react';
import { useCanonical } from '@/lib/useCanonical';
import { Link } from 'react-router-dom';

const SAFFRON='#F59E0B',DARK='#0A1628',BLUE='#1E40AF';

const TRICKS=[
  { q:'1998 × 1997 = ?', vedic:'Base 2000: deficits -2,-3 → Left: 1998-3=1995, Right: 2×3=006 → 1995006', time:'3 sec', sat:'No-Calculator Grid-In' },
  { q:'97² = ?', vedic:'Base 100: deficit -3 → Left: 97-3=94, Right: 3²=09 → 9409', time:'2 sec', sat:'Multiple Choice' },
  { q:'45 × 45 = ?', vedic:'Ends in 5: 4×5|25 = 2025', time:'1 sec', sat:'No-Calculator Section' },
  { q:'998 + 997 + 996 = ?', vedic:'3×1000 - (2+3+4) = 3000-9 = 2991', time:'2 sec', sat:'Heart of Algebra' },
];

const COUNTRIES=[
  {flag:'🇺🇸',name:'United States',exam:'SAT / ACT',note:'No-calculator section'},
  {flag:'🇬🇧',name:'United Kingdom',exam:'GCSE / A-Level',note:'Mental maths required'},
  {flag:'🇦🇪',name:'UAE / Middle East',exam:'SAT / CBSE abroad',note:'NRI diaspora'},
  {flag:'🇸🇬',name:'Singapore',exam:'PSLE / O-Level',note:'Speed maths culture'},
  {flag:'🇨🇦',name:'Canada',exam:'SAT / Provincial',note:'Math enrichment'},
  {flag:'🇦🇺',name:'Australia',exam:'NAPLAN / ATAR',note:'Competitive entry'},
];

export default function SATMathTricksPage() {
  useCanonical('/sat-math-tricks');
  return (
    <div style={{minHeight:'100vh',background:'#F0F4FF',fontFamily:'system-ui,sans-serif'}}>

      <div style={{background:`linear-gradient(135deg,${DARK},${BLUE})`,padding:'56px 20px 48px',textAlign:'center',color:'white'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(245,158,11,0.15)',border:'1px solid rgba(245,158,11,0.3)',borderRadius:30,padding:'5px 14px',marginBottom:16}}>
          <span style={{fontSize:12,fontWeight:700,color:SAFFRON,textTransform:'uppercase',letterSpacing:'0.5px'}}>SAT · ACT · GRE · GCSE</span>
        </div>
        <h1 style={{fontSize:'clamp(24px,4vw,40px)',fontWeight:800,margin:'0 0 14px',lineHeight:1.2}}>
          Master the No-Calculator Section<br/><span style={{color:SAFFRON}}>with Vedic Mathematics</span>
        </h1>
        <p style={{fontSize:16,color:'rgba(255,255,255,0.75)',maxWidth:520,margin:'0 auto 24px',lineHeight:1.65}}>
          Ancient Indian speed-math techniques used by toppers worldwide. Calculate 10× faster than conventional methods — no calculator, no abacus needed.
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <Link to="/demo" style={{background:SAFFRON,color:DARK,padding:'13px 30px',borderRadius:12,fontWeight:700,fontSize:15,textDecoration:'none'}}>Try Free Demo →</Link>
          <Link to="/tools/vedic-square-calculator" style={{background:'rgba(255,255,255,0.12)',color:'white',border:'1px solid rgba(255,255,255,0.25)',padding:'13px 24px',borderRadius:12,fontWeight:600,fontSize:15,textDecoration:'none'}}>Square Calculator</Link>
        </div>
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:'48px 20px 80px'}}>

        <h2 style={{fontSize:22,fontWeight:800,color:DARK,textAlign:'center',marginBottom:6}}>Real SAT Problems — Vedic Speed</h2>
        <p style={{textAlign:'center',color:'#6B7280',fontSize:14,marginBottom:28}}>See how Vedic Maths solves actual exam-style problems in under 3 seconds.</p>
        <div style={{display:'flex',flexDirection:'column',gap:14,marginBottom:56}}>
          {TRICKS.map((t,i)=>(
            <div key={i} style={{background:'white',borderRadius:16,padding:'20px 24px',boxShadow:'0 2px 12px rgba(10,22,40,0.07)',border:'1px solid #E5E7EB',display:'grid',gridTemplateColumns:'auto 1fr auto',gap:16,alignItems:'center',flexWrap:'wrap'}}>
              <div style={{fontSize:18,fontWeight:800,color:BLUE,minWidth:160}}>{t.q}</div>
              <div>
                <div style={{fontSize:11,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.4px',marginBottom:4}}>{t.sat}</div>
                <div style={{fontSize:14,color:'#374151',fontWeight:500}}>{t.vedic}</div>
              </div>
              <div style={{background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.2)',borderRadius:10,padding:'6px 14px',textAlign:'center',flexShrink:0}}>
                <div style={{fontSize:16,fontWeight:800,color:'#16A34A'}}>⚡ {t.time}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{fontSize:20,fontWeight:800,color:DARK,textAlign:'center',marginBottom:6}}>Used by Students Across 6 Countries</h2>
        <p style={{textAlign:'center',color:'#6B7280',fontSize:14,marginBottom:24}}>Vedic Maths has no language barrier — it's pure calculation speed.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:12,marginBottom:56}}>
          {COUNTRIES.map(c=>(
            <div key={c.name} style={{background:'white',borderRadius:14,padding:'16px 18px',border:'1px solid #E5E7EB',display:'flex',gap:12,alignItems:'center'}}>
              <span style={{fontSize:28}}>{c.flag}</span>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:DARK}}>{c.name}</div>
                <div style={{fontSize:12,color:BLUE,fontWeight:600}}>{c.exam}</div>
                <div style={{fontSize:11,color:'#9CA3AF'}}>{c.note}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{background:'white',borderRadius:20,padding:'32px 28px',border:'1px solid #E5E7EB',boxShadow:'0 2px 16px rgba(10,22,40,0.07)',marginBottom:24}}>
          <h2 style={{fontSize:18,fontWeight:800,color:DARK,marginBottom:16}}>Why Vedic Maths Works for SAT/ACT</h2>
          {[
            ['No Calculator Needed','The SAT Math No-Calculator section tests pure mental speed. Vedic techniques were designed for exactly this — no tools, pure mental arithmetic.'],
            ['Works for ALL Number Types','Multiplication, division, squares, square roots, fractions — every SAT math operation has a Vedic shortcut.'],
            ['Scientifically Structured','Not tricks or hacks — these are systematic algorithms from ancient Indian mathematical tradition, proven over thousands of years.'],
            ['Faster than Conventional Methods','A student using conventional long multiplication for 997 × 998 takes ~45 seconds. Vedic method: 8 seconds.'],
          ].map(([title,desc])=>(
            <div key={title} style={{display:'flex',gap:12,marginBottom:14}}>
              <div style={{color:SAFFRON,fontSize:18,flexShrink:0,marginTop:2}}>✓</div>
              <div><strong style={{color:DARK,fontSize:14}}>{title}</strong><p style={{fontSize:13,color:'#6B7280',margin:'3px 0 0',lineHeight:1.6}}>{desc}</p></div>
            </div>
          ))}
        </div>

        <div style={{background:`linear-gradient(135deg,${DARK},${BLUE})`,borderRadius:20,padding:'36px 28px',textAlign:'center',color:'white'}}>
          <h3 style={{fontSize:20,fontWeight:800,margin:'0 0 10px'}}>Start Calculating 10× Faster — Free</h3>
          <p style={{color:'rgba(255,255,255,0.7)',fontSize:14,maxWidth:420,margin:'0 auto 20px',lineHeight:1.65}}>
            Full curriculum: Vedic Maths + Reasoning + Aptitude. Works on any device. No abacus, no hardware.
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/demo" style={{background:SAFFRON,color:DARK,padding:'12px 28px',borderRadius:12,fontWeight:700,fontSize:14,textDecoration:'none'}}>Try Free Demo →</Link>
            <Link to="/pricing" style={{background:'rgba(255,255,255,0.12)',color:'white',border:'1px solid rgba(255,255,255,0.25)',padding:'12px 22px',borderRadius:12,fontWeight:600,fontSize:14,textDecoration:'none'}}>View Pricing</Link>
          </div>
        </div>
      </div>
    </div>
  );
}