import React from 'react';
import { Link } from 'react-router-dom';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { useLanguage } from '@/lib/LanguageContext';
import { LIFE_SKILLS_TRACKS } from '@/data/lifeSkillsContent';

const TRACK_META = {
  parent: { emoji: '🌱', color: '#B45309', bg: '#FFFBEB', border: '#FDE68A' },
  student: { emoji: '🧭', color: '#0F766E', bg: '#F0FDFA', border: '#99F6E4' },
  teacher: { emoji: '📖', color: '#4C1D95', bg: '#F5F3FF', border: '#DDD6FE' },
};

export default function LifeSkillsHubPage() {
  const { language } = useLanguage();
  const T = (en, hi) => (language === 'hi' ? hi : en);

  return (
    <div style={{ minHeight: '100vh', background: '#FFFDF7' }}>
      <DashboardNavbar />
      <main style={{ maxWidth: 780, margin: '0 auto', padding: '32px 20px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 30, fontWeight: 700, color: '#292524', marginBottom: 10 }}>
            {T('Life Skills', 'जीवन कौशल')}
          </h1>
          <p style={{ color: '#78716C', fontFamily: 'var(--font-body)', fontSize: 15, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            {T(
              'Guidance for the three people who shape a child\'s education — not just curriculum. Rooted in real research, honest practical wisdom, and where relevant, faithfully cited ancient teaching.',
              'बच्चे की शिक्षा को आकार देने वाले तीन लोगों के लिए मार्गदर्शन — सिर्फ पाठ्यक्रम नहीं। असली शोध, ईमानदार व्यावहारिक ज्ञान, और जहां प्रासंगिक हो, सही उद्धृत प्राचीन शिक्षा पर आधारित।'
            )}
          </p>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          {Object.entries(LIFE_SKILLS_TRACKS).map(([trackId, track]) => {
            const meta = TRACK_META[trackId];
            return (
              <Link
                key={trackId}
                to={`/life-skills/${trackId}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px',
                  background: meta.bg, border: `1.5px solid ${meta.border}`, borderRadius: 16,
                  textDecoration: 'none',
                }}
              >
                <div style={{ fontSize: 36, flexShrink: 0 }}>{meta.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: meta.color }}>
                    {track.label[language] || track.label.en}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#78716C', marginTop: 2 }}>
                    {track.modules.length} {T('modules', 'मॉड्यूल')} · {T('one new module every week', 'हर हफ्ते एक नया मॉड्यूल')}
                  </div>
                </div>
                <span style={{ color: '#A8A29E', fontSize: 20 }}>›</span>
              </Link>
            );
          })}
        </div>

        <div style={{ marginTop: 32, padding: '16px 20px', background: '#F5F5F4', borderRadius: 12, fontSize: 13, color: '#78716C', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
          💡 {T(
            'This is general guidance and mindset support, not therapy or diagnosis. If something feels like more than everyday pressure, a real counselor is always worth talking to.',
            'यह सामान्य मार्गदर्शन और मानसिकता सहायता है, चिकित्सा या निदान नहीं। यदि कुछ रोज़मर्रा के दबाव से ज़्यादा महसूस हो, तो एक असली परामर्शदाता से बात करना हमेशा उचित है।'
          )}
        </div>
      </main>
    </div>
  );
}
