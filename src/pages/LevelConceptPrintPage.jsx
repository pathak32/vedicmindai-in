import React, { Suspense, useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { CURRICULUM } from '@/components/learn/curriculumData';
import { LESSON_CONTENT } from '@/components/learn/ConceptTab';
import { LanguageContext, translations } from '@/lib/LanguageContext';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { hasDirectPdfAccess, getPdfRequestStatus, requestPdfAccess } from '@/lib/pdfAccess';

const page = { maxWidth: 520, margin: '0 auto', padding: 24, fontFamily: 'var(--font-body)', color: '#0A1628' };
const primaryBtn = { padding: '10px 18px', borderRadius: 10, border: 'none', background: '#0A1628', color: 'white', fontWeight: 600, cursor: 'pointer' };

// Asks a student without premium access to request the level PDF; the admin approves or rejects.
function RequestAccess({ user, level, lv }) {
  const [status, setStatus] = useState(null); // null while loading
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let live = true;
    getPdfRequestStatus(user.id, Number(level)).then((r) => { if (live) setStatus(r.status); });
    return () => { live = false; };
  }, [user.id, level]);

  const request = async () => {
    setBusy(true); setError('');
    try { setStatus(await requestPdfAccess(user.id, Number(level), status)); }
    catch { setError('Could not send the request. Please try again.'); }
    setBusy(false);
  };

  return (
    <div style={page}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, marginBottom: 8 }}>
        Level {lv.level} — {lv.name}
      </h1>
      <p style={{ color: '#4B5563', marginBottom: 20 }}>
        The concept PDFs (English and Hindi) are available to premium plans. You can request access to this level and the admin will review it.
      </p>
      {status === null && <p style={{ color: '#6B7280' }}>Checking your access…</p>}
      {status === 'unavailable' && <p style={{ color: '#991B1B' }}>Requests are not available right now. Please try again later.</p>}
      {(status === 'none' || status === 'rejected') && (
        <>
          {status === 'rejected' && <p style={{ color: '#991B1B', marginBottom: 12 }}>Your last request was not approved. You can ask again.</p>}
          <button onClick={request} disabled={busy} style={{ ...primaryBtn, opacity: busy ? 0.6 : 1 }}>
            {busy ? 'Sending…' : status === 'rejected' ? 'Request again' : 'Request PDF access'}
          </button>
        </>
      )}
      {status === 'pending' && (
        <p style={{ background: '#FEF3C7', color: '#92400E', padding: 12, borderRadius: 10 }}>
          Request sent. You will be able to open this PDF here once the admin approves it.
        </p>
      )}
      {error && <p style={{ color: '#991B1B', marginTop: 12 }}>{error}</p>}
      <p style={{ marginTop: 24 }}><Link to="/learn" style={{ color: '#1E40AF' }}>← Back to Learn</Link></p>
    </div>
  );
}

// Print-friendly view of every concept in one level. Opened in a new tab from the
// curriculum sidebar; ?lang=hi or ?lang=en picks the language for this view only,
// so the learner's saved language setting is not changed.
function PrintBody({ lv, lang }) {
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

export default function LevelConceptPrintPage() {
  const { level } = useParams();
  const [params] = useSearchParams();
  const { user, loading } = useVedicAuth();
  const lang = params.get('lang') === 'hi' ? 'hi' : 'en';
  const lv = CURRICULUM.find((x) => String(x.level) === level);
  const direct = hasDirectPdfAccess(user);
  const [approved, setApproved] = useState(null); // null = not checked yet

  // Not premium: an admin-approved request for this level also opens the PDF.
  useEffect(() => {
    if (!user || direct) return;
    let live = true;
    getPdfRequestStatus(user.id, Number(level)).then((r) => { if (live) setApproved(r.status === 'approved'); });
    return () => { live = false; };
  }, [user?.id, direct, level]);

  if (!lv) return <div style={{ padding: 24 }}>Level not found.</div>;
  if (loading) return null;
  if (!user) {
    return (
      <div style={page}>
        <p>Please sign in to open the concept PDFs.</p>
        <Link to="/auth" style={{ color: '#1E40AF' }}>Sign in</Link>
      </div>
    );
  }
  if (direct || approved) return <PrintBody lv={lv} lang={lang} />;
  if (approved === null) return null;
  return <RequestAccess user={user} level={level} lv={lv} />;
}
