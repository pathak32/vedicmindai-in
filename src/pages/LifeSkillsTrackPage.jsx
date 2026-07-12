import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { useLanguage } from '@/lib/LanguageContext';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { LIFE_SKILLS_TRACKS, getModuleContent, mapGradeToTier } from '@/data/lifeSkillsContent';
import { getLifeSkillsState, startModule, submitReflection, isModuleUnlocked, daysUntilUnlock, UNLOCK_DAYS } from '@/lib/lifeSkillsProgress';

const TRACK_META = {
  parent: { emoji: '🌱', color: '#B45309', bg: '#FFFBEB', border: '#FDE68A' },
  student: { emoji: '🧭', color: '#0F766E', bg: '#F0FDFA', border: '#99F6E4' },
  teacher: { emoji: '📖', color: '#4C1D95', bg: '#F5F3FF', border: '#DDD6FE' },
};

export default function LifeSkillsTrackPage() {
  const { trackId } = useParams();
  const { language } = useLanguage();
  const { user } = useVedicAuth();
  const T = (en, hi) => (language === 'hi' ? hi : en);

  const track = LIFE_SKILLS_TRACKS[trackId];
  const meta = TRACK_META[trackId];
  const [activeModuleId, setActiveModuleId] = useState(track?.modules[0]?.id);
  const [ageTier, setAgeTier] = useState('secondary');
  const [tab, setTab] = useState('concept');
  const [reflectionDraft, setReflectionDraft] = useState('');
  const [answers, setAnswers] = useState({});
  const [, forceRerender] = useState(0);

  useEffect(() => {
    // Auto-select age tier from the user's own profile grade if available, defaulting to secondary
    try {
      const p = JSON.parse(localStorage.getItem('vedicmind_profile') || '{}');
      if (p.grade) setAgeTier(mapGradeToTier(p.grade));
    } catch { /* keep default */ }
  }, []);

  if (!track) return <div style={{ minHeight: '100vh', background: '#FFFDF7' }}><DashboardNavbar /><p style={{ textAlign: 'center', padding: 60 }}>Track not found.</p></div>;

  const activeModule = track.modules.find((m) => m.id === activeModuleId);
  const content = getModuleContent(trackId, activeModuleId, ageTier);
  const state = getLifeSkillsState(trackId, activeModuleId);
  const unlocked = isModuleUnlocked(trackId, activeModule.order, track.modules);

  function handleStart() {
    startModule(trackId, activeModuleId);
    forceRerender((n) => n + 1);
  }

  function handleSubmitReflection() {
    if (!reflectionDraft.trim()) return;
    submitReflection(trackId, activeModuleId, reflectionDraft.trim());
    forceRerender((n) => n + 1);
  }

  function handleTestAnswer(qIdx, optIdx) {
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  }

  function handleSubmitTest() {
    // Test completion also marks the module done — same reflection-gated
    // unlock mechanic, using the test attempt itself as the "engagement" proof.
    submitReflection(trackId, activeModuleId, `Completed test — ${Object.keys(answers).length} question(s) answered.`);
    forceRerender((n) => n + 1);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFFDF7' }}>
      <DashboardNavbar />
      <main style={{ maxWidth: 780, margin: '0 auto', padding: '24px 20px 60px' }}>
        <Link to="/life-skills" style={{ color: '#78716C', fontSize: 14, textDecoration: 'none', display: 'inline-block', marginBottom: 12 }}>
          ← {T('All Tracks', 'सभी ट्रैक')}
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 28 }}>{meta.emoji}</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, color: meta.color, margin: 0 }}>
            {track.label[language] || track.label.en}
          </h1>
        </div>

        {track.tiered && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {['primary', 'secondary', 'teen'].map((tier) => (
              <button
                key={tier}
                onClick={() => setAgeTier(tier)}
                style={{
                  padding: '6px 16px', borderRadius: 99, border: `1px solid ${ageTier === tier ? meta.color : '#E7E5E4'}`,
                  background: ageTier === tier ? meta.color : 'white', color: ageTier === tier ? 'white' : '#78716C',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)',
                }}
              >
                {tier === 'primary' ? T('Class 1-5', 'कक्षा 1-5') : tier === 'secondary' ? T('Class 6-9', 'कक्षा 6-9') : T('Class 10-12', 'कक्षा 10-12')}
              </button>
            ))}
          </div>
        )}

        {/* Module list */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 20 }}>
          {track.modules.map((m) => {
            const mUnlocked = isModuleUnlocked(trackId, m.order, track.modules);
            const mState = getLifeSkillsState(trackId, m.id);
            const isDone = !!mState?.completedAt;
            return (
              <button
                key={m.id}
                onClick={() => mUnlocked && setActiveModuleId(m.id)}
                disabled={!mUnlocked}
                style={{
                  flexShrink: 0, padding: '8px 14px', borderRadius: 10,
                  border: `1.5px solid ${activeModuleId === m.id ? meta.color : '#E7E5E4'}`,
                  background: activeModuleId === m.id ? meta.bg : 'white',
                  cursor: mUnlocked ? 'pointer' : 'not-allowed', opacity: mUnlocked ? 1 : 0.5,
                  fontSize: 12, fontFamily: 'var(--font-body)', color: '#44403C', whiteSpace: 'nowrap',
                }}
              >
                {isDone ? '✓ ' : mUnlocked ? '' : '🔒 '}{m.order}. {(m.title[language] || m.title.en).slice(0, 24)}
              </button>
            );
          })}
        </div>

        {!unlocked ? (
          <div style={{ background: 'white', borderRadius: 16, padding: 40, textAlign: 'center', border: `1.5px solid ${meta.border}` }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
            <p style={{ fontFamily: 'var(--font-body)', color: '#78716C' }}>
              {T(`This module unlocks ${daysUntilUnlock(trackId, activeModule.order, track.modules)} day(s) after finishing the previous one — real practice needs real time.`,
                 `यह मॉड्यूल पिछले वाले को पूरा करने के ${daysUntilUnlock(trackId, activeModule.order, track.modules)} दिन बाद अनलॉक होता है — असली अभ्यास के लिए असली समय चाहिए।`)}
            </p>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: 16, padding: 28, border: `1.5px solid ${meta.border}` }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: '#292524', marginBottom: 16 }}>
              {content.title[language] || content.title.en}
            </h2>

            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
              {['concept', 'steps', 'practice', track.tiered ? 'test' : 'reflection'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: tab === t ? meta.color : '#F5F5F4', color: tab === t ? 'white' : '#78716C',
                    fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)', textTransform: 'capitalize',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === 'concept' && (
              <>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#44403C', lineHeight: 1.8 }}>
                  {content.concept[language] || content.concept.en}
                </p>
                {!state && (
                  <button onClick={handleStart} style={{ marginTop: 20, padding: '12px 24px', borderRadius: 10, background: meta.color, color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    {T('Start This Module →', 'यह मॉड्यूल शुरू करें →')}
                  </button>
                )}
              </>
            )}

            {tab === 'steps' && (
              <div>
                {content.steps.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: meta.bg, color: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#44403C', lineHeight: 1.7, margin: 0 }}>{s[language] || s.en}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === 'practice' && (
              <div>
                {content.practiceSet.map((q, qi) => (
                  <div key={qi} style={{ marginBottom: 20 }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: '#292524', marginBottom: 10 }}>{q.q[language] || q.q.en}</p>
                    {q.options.map((opt, oi) => (
                      <div key={oi} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #E7E5E4', marginBottom: 6, fontSize: 13, fontFamily: 'var(--font-body)', background: oi === q.correct ? '#F0FDF4' : 'white' }}>
                        {opt[language] || opt.en}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {tab === 'test' && track.tiered && (
              <div>
                {content.test.map((q, qi) => (
                  <div key={qi} style={{ marginBottom: 20 }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: '#292524', marginBottom: 10 }}>{q.q[language] || q.q.en}</p>
                    {q.options.map((opt, oi) => {
                      const selected = answers[qi] === oi;
                      const revealed = answers[qi] !== undefined;
                      let bg = 'white';
                      if (revealed && oi === q.correct) bg = '#F0FDF4';
                      else if (revealed && selected && oi !== q.correct) bg = '#FEF2F2';
                      return (
                        <button
                          key={oi}
                          onClick={() => handleTestAnswer(qi, oi)}
                          disabled={revealed}
                          style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: 8, border: '1px solid #E7E5E4', marginBottom: 6, fontSize: 13, fontFamily: 'var(--font-body)', background: bg, cursor: revealed ? 'default' : 'pointer' }}
                        >
                          {opt[language] || opt.en}
                        </button>
                      );
                    })}
                  </div>
                ))}
                {!state?.completedAt && Object.keys(answers).length === content.test.length && (
                  <button onClick={handleSubmitTest} style={{ padding: '12px 24px', borderRadius: 10, background: meta.color, color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    {T('Complete Module →', 'मॉड्यूल पूरा करें →')}
                  </button>
                )}
                {state?.completedAt && (
                  <p style={{ color: '#059669', fontFamily: 'var(--font-body)', fontWeight: 600 }}>✓ {T(`Completed. Next module unlocks in ${UNLOCK_DAYS} days.`, `पूरा हुआ। अगला मॉड्यूल ${UNLOCK_DAYS} दिनों में अनलॉक होगा।`)}</p>
                )}
              </div>
            )}

            {tab === 'reflection' && !track.tiered && (
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#78716C', marginBottom: 12 }}>
                  {T('A real situation from your week — what did you try, what happened?', 'आपके हफ्ते की एक असली स्थिति — आपने क्या कोशिश की, क्या हुआ?')}
                </p>
                {state?.completedAt ? (
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#44403C', fontStyle: 'italic', padding: 14, background: '#F5F5F4', borderRadius: 10 }}>
                      "{state.reflection}"
                    </p>
                    <p style={{ color: '#059669', fontFamily: 'var(--font-body)', fontWeight: 600, marginTop: 12 }}>✓ {T(`Completed. Next module unlocks in ${UNLOCK_DAYS} days.`, `पूरा हुआ। अगला मॉड्यूल ${UNLOCK_DAYS} दिनों में अनलॉक होगा।`)}</p>
                  </div>
                ) : (
                  <>
                    <textarea
                      value={reflectionDraft}
                      onChange={(e) => setReflectionDraft(e.target.value)}
                      rows={5}
                      style={{ width: '100%', padding: 14, borderRadius: 10, border: '1px solid #E7E5E4', fontFamily: 'var(--font-body)', fontSize: 14, resize: 'vertical' }}
                      placeholder={T('Write a few honest sentences...', 'कुछ ईमानदार वाक्य लिखें...')}
                    />
                    <button onClick={handleSubmitReflection} disabled={!reflectionDraft.trim()} style={{ marginTop: 12, padding: '12px 24px', borderRadius: 10, background: meta.color, color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', opacity: reflectionDraft.trim() ? 1 : 0.5 }}>
                      {T('Submit Reflection →', 'चिंतन जमा करें →')}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
