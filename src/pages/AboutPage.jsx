import React, { useState } from 'react';
import { useCanonical } from '@/lib/useCanonical';
import { Link } from 'react-router-dom';

const SAFFRON   = '#F59E0B';
const DARK_BLUE = '#0A1628';
const MED_BLUE  = '#1E40AF';
const BG        = '#F0F4FF';
const CARD_BG   = '#FFFFFF';
const TEXT      = '#374151';
const TEXT_DIM  = '#6B7280';

export default function AboutPage() {
  useCanonical('/about');
  const [videoLoaded, setVideoLoaded] = useState(false);

  const credentials = [
    { icon: '🏛️', label: 'MSME Registered',    sub: 'Govt. of India' },
    { icon: '™️',  label: 'Trademark Filed',     sub: 'VedicMindAI™' },
    { icon: '📱', label: 'Play Store Live',      sub: 'Android App' },
    { icon: '📚', label: '1,400+ Questions',     sub: 'Verified Content' },
    { icon: '📝', label: '200+ Blog Articles',   sub: 'Vedic Maths & Aptitude' },
    { icon: '🧠', label: 'AI-Powered Learning',  sub: 'Adaptive Practice' },
  ];

  const pillars = [
    {
      icon: '🕉️',
      title: 'Ancient Wisdom',
      desc: 'Vedic Mathematics is 2,500+ years old. We bring it into the modern classroom with the rigor it deserves — no shortcuts in content quality.',
    },
    {
      icon: '🤖',
      title: 'Modern AI',
      desc: 'Adaptive practice, AI-generated explanations, performance analytics — every feature is built to make learning faster and more personal.',
    },
    {
      icon: '🎯',
      title: 'Exam-Ready',
      desc: 'Whether it\'s Class 6 homework or JEE/SSC/CAT preparation — the curriculum maps to what students actually need to score.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── HERO ── */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK_BLUE}, ${MED_BLUE})`,
        padding: '56px 24px 48px',
        textAlign: 'center',
        color: 'white',
      }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🙏</div>
        <h1 style={{ fontSize: 'clamp(24px,5vw,36px)', fontWeight: 800, marginBottom: 10, lineHeight: 1.25 }}>
          Founder se Seedha
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
          Why a telecom engineer left his career to build India's first AI-powered Vedic Mathematics platform — in his own words.
        </p>
        <div style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 30, padding: '7px 18px', fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
          <span>🎙️</span> Video in Hindi — with English subtitles
        </div>
      </div>

      {/* ── MAIN VIDEO ── */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '36px 16px 0' }}>
        <div style={{
          background: CARD_BG,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 4px 32px rgba(10,22,40,0.10)',
          border: '1px solid #E5E7EB',
        }}>
          {/* Video label */}
          <div style={{
            padding: '18px 24px 14px',
            borderBottom: '1px solid #F3F4F6',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              background: SAFFRON, borderRadius: 8,
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
            }}>🎬</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: DARK_BLUE }}>
                Maine VedicMindAI Kyun Banaya?
              </div>
              <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 1 }}>
                Hitesh Pathak — Founder & CEO, VedicMindAI
              </div>
            </div>
          </div>

          {/* Responsive 16:9 YouTube embed */}
          <div style={{ position: 'relative', paddingTop: '56.25%', background: DARK_BLUE }}>
            <iframe
              src="https://www.youtube.com/embed/Tm-D-Zge3z8?rel=0&modestbranding=1"
              title="Maine VedicMindAI Kyun Banaya — Hitesh Pathak"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setVideoLoaded(true)}
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
                border: 'none',
              }}
            />
          </div>
        </div>

        {/* ── FOUNDER BIO ── */}
        <div style={{
          background: CARD_BG, borderRadius: 20, padding: '28px 28px',
          marginTop: 20, boxShadow: '0 2px 16px rgba(10,22,40,0.07)',
          border: '1px solid #E5E7EB',
          display: 'flex', gap: 20, alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}>
          {/* Avatar initial */}
          <div style={{
            width: 64, height: 64, borderRadius: 16, flexShrink: 0,
            background: `linear-gradient(135deg, ${SAFFRON}, #F97316)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: 'white',
          }}>H</div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: DARK_BLUE }}>Hitesh Pathak</div>
            <div style={{ fontSize: 13, color: SAFFRON, fontWeight: 600, marginBottom: 10 }}>
              Founder & CEO — VedicMindAI
            </div>
            <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.7, margin: 0 }}>
              A telecom engineer by training and a government infrastructure professional by career,
              Hitesh built VedicMindAI from scratch — with no prior coding experience — driven by one
              simple belief: that Vedic Mathematics is one of India's most powerful and most underused
              cognitive tools. After not finding a platform that treated the subject with the depth
              and rigour it deserved, he decided to build one. VedicMindAI is the result.
            </p>
            <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['Telecom Engineering', 'Govt. Infrastructure', 'EdTech Founder', 'Lucknow, India'].map(tag => (
                <span key={tag} style={{
                  fontSize: 12, fontWeight: 500, padding: '4px 10px',
                  background: '#EFF6FF', color: MED_BLUE,
                  borderRadius: 20, border: '1px solid #DBEAFE',
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── PILLARS ── */}
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: DARK_BLUE, marginBottom: 4, textAlign: 'center' }}>
            What We Stand For
          </h2>
          <p style={{ textAlign: 'center', color: TEXT_DIM, fontSize: 14, marginBottom: 20 }}>
            Three principles that guide every decision at VedicMindAI.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {pillars.map(p => (
              <div key={p.title} style={{
                background: CARD_BG, borderRadius: 16, padding: '22px 20px',
                boxShadow: '0 2px 12px rgba(10,22,40,0.07)', border: '1px solid #E5E7EB',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{p.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: DARK_BLUE, marginBottom: 8 }}>{p.title}</div>
                <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── MORE VIDEOS (placeholder) ── */}
        <div style={{
          marginTop: 28, background: CARD_BG, borderRadius: 20, padding: '24px 24px',
          boxShadow: '0 2px 12px rgba(10,22,40,0.07)', border: '1px solid #E5E7EB',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 22 }}>🎥</span>
            <div style={{ fontWeight: 700, fontSize: 15, color: DARK_BLUE }}>More from Hitesh — Coming Soon</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {[
              { title: 'A Message to Parents', icon: '👨‍👩‍👧' },
              { title: 'How We Built the AI', icon: '🤖' },
              { title: 'Vedic Maths — The Real Story', icon: '📖' },
            ].map(v => (
              <div key={v.title} style={{
                background: '#F9FAFB', borderRadius: 12, padding: '18px 14px',
                border: '1.5px dashed #D1D5DB', textAlign: 'center', opacity: 0.7,
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{v.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 4 }}>{v.title}</div>
                <div style={{ fontSize: 11, color: TEXT_DIM }}>Uploading soon</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CREDENTIALS ── */}
        <div style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: DARK_BLUE, marginBottom: 16, textAlign: 'center' }}>
            Built with Accountability
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            {credentials.map(c => (
              <div key={c.label} style={{
                background: CARD_BG, borderRadius: 14, padding: '16px 12px',
                boxShadow: '0 2px 8px rgba(10,22,40,0.06)', border: '1px solid #E5E7EB',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{c.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: DARK_BLUE, marginBottom: 2 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: TEXT_DIM }}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{
          marginTop: 32, marginBottom: 48,
          background: `linear-gradient(135deg, ${DARK_BLUE}, ${MED_BLUE})`,
          borderRadius: 20, padding: '32px 24px', textAlign: 'center', color: 'white',
        }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🚀</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
            Ready to experience it yourself?
          </h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 20, maxWidth: 380, margin: '0 auto 20px' }}>
            Start free — no credit card, no commitment. See why Vedic Mathematics changes the way students think about numbers.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/demo" style={{
              background: SAFFRON, color: DARK_BLUE,
              padding: '12px 28px', borderRadius: 12,
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
            }}>Try Free Demo</Link>
            <Link to="/curriculum" style={{
              background: 'rgba(255,255,255,0.12)', color: 'white',
              border: '1px solid rgba(255,255,255,0.25)',
              padding: '12px 28px', borderRadius: 12,
              fontWeight: 600, fontSize: 15, textDecoration: 'none',
            }}>View Curriculum</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
