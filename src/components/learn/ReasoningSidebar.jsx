import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Sprout, Layers3, Flame, Crown, ChevronDown, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { RA_LEVEL1_CHAPTERS } from '@/data/reasoningAptitudeLevel1Content';

const tr = (field, language) => field?.[language] ?? field?.en ?? '';

const LOCKED_LEVELS = [
  {
    id: 'intermediate', icon: Layers3, label: { en: 'Intermediate', hi: 'मध्यम' },
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
    id: 'advanced', icon: Flame, label: { en: 'Advanced', hi: 'उन्नत' },
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
    id: 'master', icon: Crown, label: { en: 'Master', hi: 'मास्टर' },
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

export { LOCKED_LEVELS };

export default function ReasoningSidebar({ activeChapterId, onClose, showClose }) {
  const { language } = useLanguage();
  const [collapsed, setCollapsed] = useState({});
  const toggle = (id) => setCollapsed((p) => ({ ...p, [id]: !p[id] }));
  const chapters = [...RA_LEVEL1_CHAPTERS].sort((a, b) => a.order - b.order);

  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 12 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: '#F5F3FF' }}>
          🧭 {language === 'hi' ? 'पाठ्यक्रम' : 'Curriculum'}
        </span>
        {showClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={20} color="#A5A0C4" />
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Beginner — unlocked */}
        <div style={{ marginBottom: 8 }}>
          <button
            onClick={() => toggle('beginner')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 8px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', textAlign: 'left' }}
          >
            <Sprout size={16} color="#A78BFA" />
            <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: '#F5F3FF' }}>
              {language === 'hi' ? 'शुरुआती' : 'Beginner'}
            </span>
            <span style={{ fontSize: 11, color: '#8B85AD', fontFamily: 'var(--font-body)', marginRight: 4 }}>{chapters.length}</span>
            {collapsed.beginner ? <ChevronRight size={14} color="#8B85AD" /> : <ChevronDown size={14} color="#8B85AD" />}
          </button>

          {!collapsed.beginner && (
            <div style={{ paddingLeft: 4 }}>
              {chapters.map((c) => {
                const isActive = activeChapterId === c.id;
                return (
                  <Link
                    key={c.id}
                    to={`/reasoning/${c.id}`}
                    onClick={onClose}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 12px',
                      borderRadius: 8, textDecoration: 'none', marginBottom: 2,
                      background: isActive ? 'rgba(167,139,250,0.18)' : 'transparent',
                    }}
                  >
                    <span style={{ fontSize: 12, color: isActive ? '#C4B5FD' : '#8B85AD', flexShrink: 0, width: 16 }}>{c.order}</span>
                    <span style={{
                      flex: 1, fontSize: 13, fontFamily: 'var(--font-body)',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#F5F3FF' : '#B8B2D6',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {tr(c.title, language)}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Locked levels */}
        {LOCKED_LEVELS.map((lvl) => {
          const Icon = lvl.icon;
          const isOpen = !collapsed[lvl.id];
          return (
            <div key={lvl.id} style={{ marginBottom: 8 }}>
              <button
                onClick={() => toggle(lvl.id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 8px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', textAlign: 'left' }}
              >
                <Icon size={16} color="#6B6590" />
                <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: '#8B85AD' }}>
                  {tr(lvl.label, language)}
                </span>
                <Lock size={11} color="#6B6590" />
                {isOpen ? <ChevronDown size={14} color="#6B6590" /> : <ChevronRight size={14} color="#6B6590" />}
              </button>
              {isOpen && (
                <div style={{ padding: '4px 12px 8px' }}>
                  {lvl.topics.map((t, i) => (
                    <div key={i} style={{ fontSize: 12.5, color: '#6B6590', fontFamily: 'var(--font-body)', padding: '4px 0' }}>
                      {tr(t, language)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
