import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Lock, Sprout, Layers3, Flame, Crown } from 'lucide-react';
import LearnPillarSwitcher from '@/components/learn/LearnPillarSwitcher';
import { useLanguage } from '@/lib/LanguageContext';
import { RA_LEVEL1_CHAPTERS } from '@/data/reasoningAptitudeLevel1Content';

const tr = (field, language) => field?.[language] ?? field?.en ?? '';

// Levels 2-4 aren't built yet — shown as a locked preview path so students
// can see how far the mastery road goes (curriculum doc: "31 more chapters
// to Competitive Mastery" as a motivating, honest long-term hook).
const LOCKED_LEVELS = [
  {
    id: 'intermediate',
    icon: Layers3,
    label: { en: 'Intermediate', hi: 'मध्यम' },
    tagline: { en: 'Building Blocks · Class 5–7', hi: 'नींव मज़बूत करें · कक्षा 5–7' },
    topics: [
      { en: 'Number Series (Advanced)', hi: 'संख्या श्रृंखला (उन्नत)' },
      { en: 'Coding-Decoding (Word & Number)', hi: 'कोडिंग-डिकोडिंग (शब्द व संख्या)' },
      { en: 'Blood Relations (Extended Family)', hi: 'रक्त संबंध (विस्तृत परिवार)' },
      { en: 'Clock Problems', hi: 'घड़ी संबंधी प्रश्न' },
      { en: 'Ratio & Proportion', hi: 'अनुपात व समानुपात' },
      { en: 'Percentage Basics', hi: 'प्रतिशत की मूल बातें' },
      { en: 'Average', hi: 'औसत' },
      { en: 'Profit & Loss (Basic)', hi: 'लाभ व हानि (मूल)' },
      { en: 'Simple Interest', hi: 'साधारण ब्याज' },
      { en: 'Venn Diagrams (Basic Set Logic)', hi: 'वेन आरेख (मूल सेट तर्क)' },
    ],
  },
  {
    id: 'advanced',
    icon: Flame,
    label: { en: 'Advanced', hi: 'उन्नत' },
    tagline: { en: 'Real Depth · Class 7–9', hi: 'असली गहराई · कक्षा 7–9' },
    topics: [
      { en: 'Time, Speed & Distance', hi: 'समय, गति व दूरी' },
      { en: 'Time & Work', hi: 'समय व कार्य' },
      { en: 'Compound Interest', hi: 'चक्रवृद्धि ब्याज' },
      { en: 'Mixture & Alligation', hi: 'मिश्रण व एलीगेशन' },
      { en: 'HCF & LCM Applications', hi: 'म.स.प. व ल.स.प. अनुप्रयोग' },
      { en: 'Syllogisms (Basic)', hi: 'न्याय-वाक्य (मूल)' },
      { en: 'Seating Arrangement (Linear)', hi: 'बैठक व्यवस्था (रैखिक)' },
      { en: 'Data Interpretation (Bar/Pie Basics)', hi: 'डेटा विश्लेषण (बार/पाई मूल)' },
      { en: 'Number System (Divisibility, Remainders)', hi: 'संख्या पद्धति (विभाज्यता, शेषफल)' },
      { en: 'Statement & Conclusion', hi: 'कथन व निष्कर्ष' },
    ],
  },
  {
    id: 'master',
    icon: Crown,
    label: { en: 'Master', hi: 'मास्टर' },
    tagline: { en: 'Competitive Mastery · Class 9–10+', hi: 'प्रतियोगी निपुणता · कक्षा 9–10+' },
    topics: [
      { en: 'Seating Arrangement (Circular & Complex)', hi: 'बैठक व्यवस्था (वृत्ताकार व जटिल)' },
      { en: 'Puzzles (Multi-Variable)', hi: 'पहेलियाँ (बहु-चर)' },
      { en: 'Permutation & Combination (Basics)', hi: 'क्रमचय व संचय (मूल)' },
      { en: 'Probability (Basics)', hi: 'प्रायिकता (मूल)' },
      { en: 'Advanced Data Interpretation', hi: 'उन्नत डेटा विश्लेषण' },
      { en: 'Syllogisms (Advanced)', hi: 'न्याय-वाक्य (उन्नत)' },
      { en: 'Cause & Effect / Critical Reasoning', hi: 'कारण-प्रभाव / आलोचनात्मक तर्क' },
      { en: 'Mensuration (Applied)', hi: 'क्षेत्रमिति (व्यावहारिक)' },
      { en: 'Algebra-Based Reasoning', hi: 'बीजगणित-आधारित तर्क' },
      { en: 'Mixed Competitive Aptitude (Capstone)', hi: 'मिश्रित प्रतियोगी योग्यता (समापन)' },
    ],
  },
];

const TOTAL_CHAPTERS = RA_LEVEL1_CHAPTERS.length + LOCKED_LEVELS.reduce((n, l) => n + l.topics.length, 0);

export default function ReasoningIndexPage() {
  const { language } = useLanguage();
  const [expanded, setExpanded] = useState('beginner');
  const chapters = [...RA_LEVEL1_CHAPTERS].sort((a, b) => a.order - b.order);
  const toggle = (id) => setExpanded((cur) => (cur === id ? null : id));

  return (
    <div style={{ minHeight: '100vh', background: '#100B22', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .ra-grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(167,139,250,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(167,139,250,0.06) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%);
        }
        .ra-level-panel { transition: border-color 0.2s ease, box-shadow 0.2s ease; }
        .ra-chapter-card { transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease; }
        .ra-chapter-card:hover { transform: translateY(-3px); border-color: rgba(167,139,250,0.6) !important; box-shadow: 0 12px 28px rgba(109,40,217,0.25); }
        .ra-chevron { transition: transform 0.25s ease; }
        @media (prefers-reduced-motion: reduce) {
          .ra-chapter-card, .ra-level-panel, .ra-chevron { transition: none !important; }
        }
        @media (max-width: 720px) {
          .ra-chapters-grid { grid-template-columns: 1fr !important; }
          .ra-hero-title { font-size: 40px !important; }
        }
      `}</style>

      <div className="ra-grid-bg" />

      <div style={{ position: 'relative', maxWidth: 1160, margin: '0 auto', padding: '56px 24px 80px' }}>
        <LearnPillarSwitcher active="reasoning" dark />

        {/* Hero */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.35)', color: '#C4B5FD', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', padding: '6px 14px', borderRadius: 99, marginBottom: 24, fontFamily: 'var(--font-body)', textTransform: 'uppercase' }}>
          {language === 'hi' ? `${TOTAL_CHAPTERS} अध्यायों की निपुणता यात्रा` : `A ${TOTAL_CHAPTERS}-Chapter Mastery Path`}
        </div>

        <h1 className="ra-hero-title" style={{ fontFamily: 'var(--font-heading)', fontSize: 56, lineHeight: 1.08, fontWeight: 700, color: '#F5F3FF', marginBottom: 18, maxWidth: 760 }}>
          {language === 'hi' ? 'रीज़निंग व एप्टीट्यूड' : 'Reasoning & Aptitude'}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, color: '#A5A0C4', maxWidth: 640, lineHeight: 1.7, marginBottom: 48 }}>
          {language === 'hi'
            ? 'सूत्र गिने-चुने हैं, पर तर्क की गहराई अनंत है। वर्गीकरण से लेकर प्रतियोगी-स्तर के तर्क तक — हर अध्याय पिछले से बनता है।'
            : 'Sutras are finite. Reasoning depth isn\u2019t. From simple classification to competitive-exam logic — every chapter builds on the last.'}
        </p>

        {/* Mastery spine + level panels */}
        <div style={{ position: 'relative', paddingLeft: 8 }}>
          <div style={{ position: 'absolute', left: 27, top: 28, bottom: 28, width: 2, background: 'linear-gradient(to bottom, #A78BFA 0%, #A78BFA 25%, rgba(167,139,250,0.15) 25%, rgba(167,139,250,0.15) 100%)' }} />

          <LevelPanel
            icon={Sprout}
            active
            label={{ en: 'Beginner', hi: 'शुरुआती' }}
            tagline={{ en: 'Foundations · Class 3–5', hi: 'नींव · कक्षा 3–5' }}
            count={chapters.length}
            expanded={expanded === 'beginner'}
            onToggle={() => toggle('beginner')}
            language={language}
          >
            <div className="ra-chapters-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 20 }}>
              {chapters.map((c) => (
                <Link
                  key={c.id}
                  to={`/reasoning/${c.id}`}
                  className="ra-chapter-card"
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14, padding: '16px 18px', textDecoration: 'none',
                  }}
                >
                  <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(167,139,250,0.18)', color: '#C4B5FD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, fontFamily: 'var(--font-body)' }}>
                    {c.order}
                  </span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: '#F5F3FF', marginBottom: 3 }}>
                      {tr(c.title, language)}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: '#8B85AD' }}>
                      {tr(c.subtitle, language)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </LevelPanel>

          {LOCKED_LEVELS.map((lvl) => (
            <LevelPanel
              key={lvl.id}
              icon={lvl.icon}
              locked
              label={lvl.label}
              tagline={lvl.tagline}
              count={lvl.topics.length}
              expanded={expanded === lvl.id}
              onToggle={() => toggle(lvl.id)}
              language={language}
            >
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#8B85AD', margin: '16px 0 14px' }}>
                {language === 'hi' ? 'शुरुआती स्तर पूरा करने के बाद अनलॉक होगा' : 'Unlocks after completing Beginner'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {lvl.topics.map((t, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-block', fontFamily: 'var(--font-body)', fontSize: 13,
                      color: '#7A7496', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 99, padding: '7px 14px',
                    }}
                  >
                    {tr(t, language)}
                  </span>
                ))}
              </div>
            </LevelPanel>
          ))}
        </div>
      </div>
    </div>
  );
}

function LevelPanel({ icon: Icon, label, tagline, count, expanded, onToggle, children, active, locked, language }) {
  return (
    <div style={{ position: 'relative', marginBottom: 16 }}>
      <div
        className="ra-level-panel"
        style={{
          background: active ? 'linear-gradient(135deg, rgba(167,139,250,0.10), rgba(255,255,255,0.03))' : 'rgba(255,255,255,0.02)',
          border: `1px solid ${expanded ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 20, padding: '20px 24px 22px',
          boxShadow: expanded ? '0 16px 40px rgba(109,40,217,0.18)' : 'none',
        }}
      >
        <button
          onClick={onToggle}
          style={{ all: 'unset', display: 'flex', alignItems: 'center', width: '100%', cursor: 'pointer', gap: 16 }}
        >
          <span style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: active ? '#A78BFA' : 'rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: active ? '0 0 0 6px rgba(167,139,250,0.14)' : 'none',
          }}>
            <Icon size={20} color={active ? '#1E0B4B' : '#6B6590'} strokeWidth={2.25} />
          </span>

          <span style={{ flex: 1, textAlign: 'left' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: active ? '#F5F3FF' : '#B8B2D6' }}>
                {tr(label, language)}
              </span>
              {locked && <Lock size={14} color="#6B6590" />}
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 13, color: '#8B85AD', marginTop: 2 }}>
              {tr(tagline, language)} · {count} {language === 'hi' ? 'अध्याय' : 'chapters'}
            </span>
          </span>

          <ChevronDown className="ra-chevron" size={22} color="#8B85AD" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </button>

        {expanded && children}
      </div>
    </div>
  );
}
