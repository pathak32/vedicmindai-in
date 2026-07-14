import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, CheckCircle2, Sprout, Layers3, Flame, Crown, ChevronDown, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { RA_LEVEL1_CHAPTERS } from '@/data/reasoningAptitudeLevel1Content';
import { RA_LEVEL2_CHAPTERS } from '@/data/reasoningAptitudeLevel2Content';
import { getReasoningScores, isReasoningChapterUnlocked, isLevel2Unlocked, isLevel2ChapterUnlocked, REASONING_PASS_THRESHOLD } from '@/lib/reasoningProgress';

const tr = (field, language) => field?.[language] ?? field?.en ?? '';

const LOCKED_LEVELS = [
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

  const l1Chapters = [...RA_LEVEL1_CHAPTERS].sort((a, b) => a.order - b.order);
  const l1Ids = l1Chapters.map((c) => c.id);
  const l2Chapters = [...RA_LEVEL2_CHAPTERS].sort((a, b) => a.order - b.order);
  const l2Ids = l2Chapters.map((c) => c.id);

  const scores = getReasoningScores();
  const l2Unlocked = isLevel2Unlocked(l1Ids);

  function renderChapterList(chapters, ids, isL2 = false) {
    return chapters.map((c) => {
      const isActive = activeChapterId === c.id;
      const isDone = (scores[c.id] ?? 0) >= REASONING_PASS_THRESHOLD;
      const unlocked = isL2
        ? isLevel2ChapterUnlocked(c.id, ids, l1Ids)
        : isReasoningChapterUnlocked(c.id, ids);

      const rowStyle = {
        display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 12px',
        borderRadius: 8, textDecoration: 'none', marginBottom: 2,
        background: isActive ? 'rgba(167,139,250,0.18)' : 'transparent',
        opacity: unlocked ? 1 : 0.45,
      };
      const inner = (
        <>
          {isDone ? (
            <CheckCircle2 size={14} color="#34D399" style={{ flexShrink: 0 }} />
          ) : unlocked ? (
            <span style={{ fontSize: 12, color: isActive ? '#C4B5FD' : '#8B85AD', flexShrink: 0, width: 14, textAlign: 'center' }}>{c.order}</span>
          ) : (
            <Lock size={12} color="#6B6590" style={{ flexShrink: 0 }} />
          )}
          <span style={{
            flex: 1, fontSize: 13, fontFamily: 'var(--font-body)',
            fontWeight: isActive ? 600 : 400,
            color: isActive ? '#F5F3FF' : unlocked ? '#B8B2D6' : '#6B6590',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {tr(c.title, language)}
          </span>
          {isDone && (
            <span style={{ fontSize: 10, color: '#34D399', fontFamily: 'var(--font-body)', flexShrink: 0 }}>{scores[c.id]}%</span>
          )}
        </>
      );
      if (!unlocked) {
        return <div key={c.id} style={{ ...rowStyle, cursor: 'not-allowed' }}>{inner}</div>;
      }
      return (
        <Link key={c.id} to={`/reasoning/${c.id}`} onClick={onClose} style={rowStyle}>
          {inner}
        </Link>
      );
    });
  }

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

        {/* ── Level 1: Beginner ── */}
        <div style={{ marginBottom: 8 }}>
          <button onClick={() => toggle('beginner')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 8px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', textAlign: 'left' }}>
            <Sprout size={16} color="#A78BFA" />
            <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: '#F5F3FF' }}>
              {language === 'hi' ? 'शुरुआती (स्तर 1)' : 'Beginner (Level 1)'}
            </span>
            <span style={{ fontSize: 11, color: '#8B85AD', fontFamily: 'var(--font-body)', marginRight: 4 }}>
              {l1Chapters.filter((c) => (scores[c.id] ?? 0) >= REASONING_PASS_THRESHOLD).length}/{l1Chapters.length}
            </span>
            {collapsed.beginner ? <ChevronRight size={14} color="#8B85AD" /> : <ChevronDown size={14} color="#8B85AD" />}
          </button>
          {!collapsed.beginner && (
            <div style={{ paddingLeft: 4 }}>
              {renderChapterList(l1Chapters, l1Ids, false)}
            </div>
          )}
        </div>

        {/* ── Level 2: Intermediate ── */}
        <div style={{ marginBottom: 8 }}>
          <button onClick={() => toggle('intermediate')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 8px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', textAlign: 'left' }}>
            <Layers3 size={16} color={l2Unlocked ? '#A78BFA' : '#6B6590'} />
            <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: l2Unlocked ? '#F5F3FF' : '#8B85AD' }}>
              {language === 'hi' ? 'मध्यम (स्तर 2)' : 'Intermediate (Level 2)'}
            </span>
            {!l2Unlocked && <Lock size={11} color="#6B6590" />}
            {l2Unlocked && (
              <span style={{ fontSize: 11, color: '#8B85AD', fontFamily: 'var(--font-body)', marginRight: 4 }}>
                {l2Chapters.filter((c) => (scores[c.id] ?? 0) >= REASONING_PASS_THRESHOLD).length}/{l2Chapters.length}
              </span>
            )}
            {collapsed.intermediate ? <ChevronRight size={14} color="#8B85AD" /> : <ChevronDown size={14} color="#8B85AD" />}
          </button>
          {!collapsed.intermediate && (
            <div style={{ paddingLeft: 4 }}>
              {l2Unlocked ? (
                renderChapterList(l2Chapters, l2Ids, true)
              ) : (
                <div style={{ padding: '8px 12px' }}>
                  <p style={{ fontSize: 12, color: '#6B6590', fontFamily: 'var(--font-body)', margin: 0 }}>
                    {language === 'hi'
                      ? '🔒 सभी स्तर 1 अध्याय पूरे करने पर अनलॉक होगा'
                      : '🔒 Complete all Level 1 chapters to unlock'}
                  </p>
                  <div style={{ marginTop: 8 }}>
                    {l2Chapters.map((c, i) => (
                      <div key={c.id} style={{ fontSize: 12, color: '#6B6590', fontFamily: 'var(--font-body)', padding: '3px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Lock size={10} color="#6B6590" />
                        {tr(c.title, language)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Locked future levels ── */}
        {LOCKED_LEVELS.map((lvl) => {
          const Icon = lvl.icon;
          const isOpen = !collapsed[lvl.id];
          return (
            <div key={lvl.id} style={{ marginBottom: 8 }}>
              <button onClick={() => toggle(lvl.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 8px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', textAlign: 'left' }}>
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
