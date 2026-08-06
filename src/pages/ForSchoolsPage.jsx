import React from 'react';
import { useCanonical } from '@/lib/useCanonical';
import { Link } from 'react-router-dom';

const SAFFRON   = '#F59E0B';
const DARK_BLUE = '#0A1628';
const MED_BLUE  = '#1E40AF';
const BG        = '#F0F4FF';

const BENEFITS = [
  { icon: '📊', title: 'Track Every Student', desc: 'Real-time mental math speed scores per student, per class. See who needs help before the exam.' },
  { icon: '🎯', title: 'Exam-Aligned Curriculum', desc: '40+ lessons mapped to CBSE, ICSE, IB, and Olympiad syllabi. No extra prep work for teachers.' },
  { icon: '🧠', title: '1,400+ Verified Questions', desc: 'Vedic Maths, Reasoning, and Aptitude — all vetted by subject experts. No unverified content.' },
  { icon: '⚡', title: 'AI-Powered Speed Gains', desc: 'Students calculate 10× faster within weeks. AI adapts difficulty to each student automatically.' },
  { icon: '📱', title: 'Works Everywhere', desc: 'Web app + Android app. No installation headache. Works on school computers and student phones.' },
  { icon: '🏆', title: 'Olympiad & Competitive Prep', desc: 'Dedicated Reasoning and Aptitude tracks built for JEE, SSC, CAT, NTSE, and Math Olympiads.' },
];

const BOARDS = ['CBSE', 'ICSE', 'IB', 'UP Board', 'MP Board', 'RBSE', 'Math Olympiad', 'NTSE', 'JEE Foundation'];

const STATS = [
  { n: '40+', label: 'Structured Lessons' },
  { n: '1,400+', label: 'Verified Questions' },
  { n: '4', label: 'Learning Verticals' },
  { n: '5.0 ★', label: 'Google Play Rating' },
];

const HOW = [
  { step: '01', title: 'Submit Your Inquiry', desc: 'Fill in your school details — takes 2 minutes. Our team responds within 24 hours.' },
  { step: '02', title: 'Get a Custom Demo', desc: 'We walk your principal and maths HOD through a live session tailored to your student profile.' },
  { step: '03', title: 'Pilot for Free', desc: 'Run a 30-day pilot with one section. Zero risk. No payment until you see results.' },
  { step: '04', title: 'School-Wide Rollout', desc: 'Full deployment with teacher training, progress dashboards, and ongoing support.' },
];

export default function ForSchoolsPage() {
  useCanonical('/for-schools');

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* HERO */}
      <div style={{ background: `linear-gradient(135deg, ${DARK_BLUE}, ${MED_BLUE})`, padding: '64px 24px 56px', textAlign: 'center', color: 'white' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 30, padding: '6px 16px', marginBottom: 20 }}>
          <span>🏫</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: SAFFRON, textTransform: 'uppercase', letterSpacing: '0.5px' }}>VedicMindAI for Schools</span>
        </div>
        <h1 style={{ fontSize: 'clamp(26px,5vw,42px)', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.2 }}>
          Give Every Student the Unfair<br />
          <span style={{ color: SAFFRON }}>Mental Maths Advantage</span>
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.65 }}>
          AI-powered Vedic Mathematics, Reasoning &amp; Aptitude for Class 1–12.
          Board-aligned. Teacher-friendly. Results in weeks, not months.
        </p>

        {/* Board chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {BOARDS.map(b => (
            <span key={b} style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.20)', color: 'rgba(255,255,255,0.85)' }}>{b}</span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/collaborate" style={{ background: SAFFRON, color: DARK_BLUE, padding: '14px 32px', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
            Request School Demo →
          </Link>
          <Link to="/curriculum" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', padding: '14px 28px', borderRadius: 12, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
            View Curriculum
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 56 }}>
          {STATS.map(s => (
            <div key={s.n} style={{ background: 'white', borderRadius: 16, padding: '24px 16px', textAlign: 'center', boxShadow: '0 2px 12px rgba(10,22,40,0.07)', border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: MED_BLUE }}>{s.n}</div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* BENEFITS */}
        <h2 style={{ fontSize: 24, fontWeight: 800, color: DARK_BLUE, marginBottom: 6, textAlign: 'center' }}>Why Schools Choose VedicMindAI</h2>
        <p style={{ textAlign: 'center', color: '#6B7280', fontSize: 14, marginBottom: 28 }}>Built for the classroom, not just the living room.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 56 }}>
          {BENEFITS.map(b => (
            <div key={b.title} style={{ background: 'white', borderRadius: 16, padding: '24px', boxShadow: '0 2px 12px rgba(10,22,40,0.06)', border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{b.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: DARK_BLUE, marginBottom: 8 }}>{b.title}</div>
              <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.65, margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>

        {/* HOW IT WORKS */}
        <h2 style={{ fontSize: 22, fontWeight: 800, color: DARK_BLUE, marginBottom: 6, textAlign: 'center' }}>How It Works</h2>
        <p style={{ textAlign: 'center', color: '#6B7280', fontSize: 14, marginBottom: 28 }}>From inquiry to full deployment in 4 simple steps.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 56 }}>
          {HOW.map(h => (
            <div key={h.step} style={{ background: 'white', borderRadius: 16, padding: '24px 20px', boxShadow: '0 2px 12px rgba(10,22,40,0.06)', border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: MED_BLUE, opacity: 0.3, marginBottom: 8 }}>{h.step}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: DARK_BLUE, marginBottom: 6 }}>{h.title}</div>
              <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.65, margin: 0 }}>{h.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: `linear-gradient(135deg, ${DARK_BLUE}, ${MED_BLUE})`, borderRadius: 20, padding: '40px 28px', textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏫</div>
          <h3 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 10px' }}>Ready to Transform Maths at Your School?</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.65 }}>
            30-day free pilot. No upfront payment. Full teacher training included.
          </p>
          <Link to="/collaborate" style={{ display: 'inline-block', background: SAFFRON, color: DARK_BLUE, padding: '14px 36px', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
            Request School Demo →
          </Link>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 12 }}>
            Usually responds within 24 hours · No spam · Unsubscribe anytime
          </p>
        </div>
      </div>
    </div>
  );
}
