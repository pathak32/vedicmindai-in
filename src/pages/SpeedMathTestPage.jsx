import React from 'react';
import { useCanonical } from '@/lib/useCanonical';
import { Link } from 'react-router-dom';
import MindCheckSection from '@/components/landing/MindCheckSection';

const DARK = '#0A1628'; const BLUE = '#1E40AF'; const SAFFRON = '#F59E0B';

export default function SpeedMathTestPage() {
  useCanonical('/tools/speed-math-test');
  return (
    <div style={{ minHeight:'100vh', fontFamily:'system-ui,sans-serif' }}>
      <div style={{ background:`linear-gradient(135deg,${DARK},${BLUE})`, padding:'48px 20px 40px', textAlign:'center', color:'white' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:30, padding:'5px 14px', marginBottom:14 }}>
          <span style={{fontSize:13,fontWeight:700,color:SAFFRON,textTransform:'uppercase',letterSpacing:'0.5px'}}>Free Online Test</span>
        </div>
        <h1 style={{ fontSize:'clamp(22px,4vw,36px)', fontWeight:800, margin:'0 0 10px', lineHeight:1.2 }}>
          Free Online Speed Maths Test
        </h1>
        <p style={{ fontSize:15, color:'rgba(255,255,255,0.7)', maxWidth:480, margin:'0 auto 16px', lineHeight:1.6 }}>
          3 questions · 5 seconds each · Vedic Maths + Reasoning + Aptitude. No signup. Instant result.
        </p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
          {['CBSE','ICSE','JEE Foundation','SSC CGL','Olympiad','CAT'].map(b=>(
            <span key={b} style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:'rgba(255,255,255,0.10)', color:'rgba(255,255,255,0.8)' }}>{b}</span>
          ))}
        </div>
      </div>
      <MindCheckSection />
      <div style={{ background:'#F0F4FF', padding:'32px 20px', textAlign:'center' }}>
        <div style={{ maxWidth:600, margin:'0 auto', background:'white', borderRadius:16, padding:'24px', border:'1px solid #E5E7EB' }}>
          <h2 style={{ fontSize:16, fontWeight:700, color:DARK, marginBottom:8 }}>Want to improve your speed?</h2>
          <p style={{ fontSize:13, color:'#6B7280', marginBottom:16, lineHeight:1.6 }}>
            VedicMindAI has 1,400+ practice questions across Vedic Maths, Reasoning and Aptitude — with AI that adapts to your level. Free to start.
          </p>
          <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/demo" style={{ background:SAFFRON, color:DARK, padding:'10px 24px', borderRadius:10, fontWeight:700, fontSize:14, textDecoration:'none' }}>Try Full Demo</Link>
            <Link to="/tools/vedic-square-calculator" style={{ background:'#F0F4FF', color:BLUE, border:'1px solid #DBEAFE', padding:'10px 20px', borderRadius:10, fontWeight:600, fontSize:14, textDecoration:'none' }}>Vedic Square Tool</Link>
          </div>
        </div>
      </div>
    </div>
  );
}