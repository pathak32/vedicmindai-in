import React from 'react';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import LearnPillarSwitcher from '@/components/learn/LearnPillarSwitcher';
import { useLanguage } from '@/lib/LanguageContext';

// Mindful Aptitude is paused (not deleted) while we properly brainstorm its
// phases and how it connects to Vedic Maths + Intelligent Reasoning, per
// Hitesh's call to focus on those two first. The original working section
// still lives at AptitudeZonePage.jsx — swap the route back once ready.
export default function AptitudeComingSoonPage() {
  const { language } = useLanguage();

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <DashboardNavbar />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px 60px' }}>
        <LearnPillarSwitcher active="aptitude" />

        <div style={{
          background: 'white', borderRadius: 20, padding: '56px 32px',
          textAlign: 'center', boxShadow: '0 8px 32px rgba(10,22,40,0.06)', marginTop: 8,
        }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>🎯</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 700, color: '#0A1628', marginBottom: 10 }}>
            {language === 'hi' ? 'माइंडफुल एप्टीट्यूड — जल्द आ रहा है' : 'Mindful Aptitude — Coming Soon'}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', color: '#4B5563', maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>
            {language === 'hi'
              ? 'हम इसे सही तरीके से बनाना चाहते हैं — Vedic गणित और Intelligent Reasoning से जुड़ा हुआ, न कि अलग-थलग। जल्द ही वापस आएं।'
              : "We want to build this properly — connected to Vedic Maths and Intelligent Reasoning, not bolted on separately. Check back soon."}
          </p>
        </div>
      </main>
    </div>
  );
}
