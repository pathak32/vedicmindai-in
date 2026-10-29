import React, { Suspense } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { CURRICULUM } from '@/components/learn/curriculumData';
import { LESSON_CONTENT } from '@/components/learn/ConceptTab';
import { LanguageContext, translations } from '@/lib/LanguageContext';

// Print-friendly view of every concept in one level. Opened in a new tab from the
// curriculum sidebar; ?lang=hi or ?lang=en picks the language for this view only,
// so the learner's saved language setting is not changed.
export default function LevelConceptPrintPage() {
  const { level } = useParams();
  const [params] = useSearchParams();
  const lang = params.get('lang') === 'hi' ? 'hi' : 'en';
  const lv = CURRICULUM.find((x) => String(x.level) === level);

  if (!lv) return <div style={{ padding: 24 }}>Level not found.</div>;

  const lessons = lv.lessons.filter((l) => !l.isAssessment && LESSON_CONTENT[l.id]);
  const value = {
    language: lang,
    setLanguage: () => {},
    toggleLanguage: () => {},
    t: (key) => translations[lang]?.[key] || translations.en?.[key] || key,
  };

  return (
    <LanguageContext.Provider value={value}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .lesson-section { break-before: page; }
          button { display: none !important; }
        }
      `}</style>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24, fontFamily: 'var(--font-body)', color: '#0A1628' }}>
        <div className="no-print" style={{ marginBottom: 16 }}>
          <button onClick={() => window.print()} style={{ padding: '8px 14px', borderRadius: 8, cursor: 'pointer' }}>
            Print / Save as PDF
          </button>
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, marginBottom: 4 }}>
          Level {lv.level} — {lv.name} ({lang === 'hi' ? 'हिन्दी' : 'English'})
        </h1>
        {lessons.map((l) => (
          <section key={l.id} className="lesson-section" style={{ marginTop: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, borderBottom: '1px solid #E5E7EB', paddingBottom: 6 }}>
              {l.title}
            </h2>
            <Suspense fallback={null}>{LESSON_CONTENT[l.id]()}</Suspense>
          </section>
        ))}
      </div>
    </LanguageContext.Provider>
  );
}
