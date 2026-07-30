import React, { useState, useEffect } from 'react';
import { useCanonical } from '@/lib/useCanonical';
import { useNavigate } from 'react-router-dom';
import { getSupabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import LandingNavbar from '@/components/landing/LandingNavbar';
import { useLanguage } from '@/lib/LanguageContext';

const glass = {
  background: 'rgba(255,255,255,0.75)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(30,64,175,0.15)',
  boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
  borderRadius: 16,
};

function StarRating({ value, onChange, readOnly }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && onChange && onChange(star)}
          style={{
            background: 'none', border: 'none', cursor: readOnly ? 'default' : 'pointer',
            fontSize: readOnly ? 16 : 28, padding: 0,
            color: star <= value ? '#F59E0B' : '#D1D5DB',
            lineHeight: 1,
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review, t }) {
  const roleColor = { Student: '#DBEAFE', Parent: '#D1FAE5', Guardian: '#EDE9FE' };
  const roleText  = { Student: '#1E40AF', Parent: '#065F46', Guardian: '#5B21B6' };
  const roleLabel = { Student: t('roleStudent'), Parent: t('roleParent'), Guardian: t('roleGuardian') };
  return (
    <div style={{ ...glass, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, color: '#0A1628' }}>
            {review.name}
            {review.city && <span style={{ fontWeight: 400, color: '#6B7280', fontSize: 13 }}> · {review.city}</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
            <StarRating value={review.stars} readOnly />
            <span style={{
              background: roleColor[review.role] || '#F0F4FF',
              color: roleText[review.role] || '#4B5563',
              borderRadius: 99, padding: '2px 10px', fontSize: 11,
              fontFamily: 'var(--font-body)', fontWeight: 600,
            }}>
              {roleLabel[review.role] || review.role}
            </span>
            <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'var(--font-body)' }}>{review.duration}</span>
          </div>
        </div>
        <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'var(--font-body)', flexShrink: 0 }}>
          {new Date(review.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#374151', lineHeight: 1.65, margin: 0 }}>
        "{review.text}"
      </p>
    </div>
  );
}

function SubmitReviewForm({ onSubmit, onClose, t }) {
  const [form, setForm] = useState({ role: 'Student', name: '', city: '', stars: 0, duration: '', text: '' });
  const [error, setError] = useState('');

  const DURATIONS = [t('reviewsDur1Week'), t('reviewsDur2Weeks'), t('reviewsDur1Month'), t('reviewsDur3Months'), t('reviewsDur6MonthsPlus')];
  const roleLabel = { Student: t('roleStudent'), Parent: t('roleParent'), Guardian: t('roleGuardian') };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError(t('reviewsErrName')); return; }
    if (!form.stars) { setError(t('reviewsErrStars')); return; }
    if (!form.duration) { setError(t('reviewsErrDuration')); return; }
    if (!form.text.trim()) { setError(t('reviewsErrText')); return; }
    setError('');
    const review = {
      id: Date.now().toString(),
      ...form,
      name: form.name.trim(),
      city: form.city.trim(),
      text: form.text.trim(),
      date: new Date().toISOString(),
      approved: true,
    };
    const existing = JSON.parse(localStorage.getItem('vedicmind_reviews') || '[]');
    localStorage.setItem('vedicmind_reviews', JSON.stringify([...existing, review]));

    // Save to Supabase
    (async () => {
      try {
        const supabase = await getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        await supabase.from('reviews').insert({
          user_id: session?.user?.id || null,
          name: review.name,
          rating: review.stars || 5,
          message: review.text,
          approved: true,
        });
      } catch(e) { console.warn('Review Supabase save failed:', e); }
    })();

    onSubmit(review);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(10,22,40,0.5)' }} />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26 }}
        style={{
          position: 'relative', background: 'white', borderRadius: '20px 20px 0 0',
          padding: '28px 20px', width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto',
          zIndex: 1,
        }}
      >
        <h2 className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 20 }}>{t('reviewsFormTitle')}</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Role pills */}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: 8 }}>{t('reviewsIAmA')}</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Student', 'Parent', 'Guardian'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, role: r }))}
                  style={{
                    padding: '8px 16px', borderRadius: 99, border: `1.5px solid ${form.role === r ? '#0A1628' : 'rgba(30,64,175,0.2)'}`,
                    background: form.role === r ? '#0A1628' : 'white',
                    color: form.role === r ? 'white' : '#4B5563',
                    fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  }}
                >{roleLabel[r]}</button>
              ))}
            </div>
          </div>

          {/* Name + City */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: 6 }}>{t('reviewsFirstName')}</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder={t('reviewsNamePlaceholder')}
                style={{ width: '100%', height: 44, borderRadius: 10, border: '1.5px solid rgba(30,64,175,0.15)', padding: '0 12px', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: 6 }}>{t('reviewsCity')}</label>
              <input
                value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                placeholder={t('reviewsCityPlaceholder')}
                style={{ width: '100%', height: 44, borderRadius: 10, border: '1.5px solid rgba(30,64,175,0.15)', padding: '0 12px', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Star rating */}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: 8 }}>{t('reviewsYourRating')}</label>
            <StarRating value={form.stars} onChange={s => setForm(f => ({ ...f, stars: s }))} />
          </div>

          {/* Duration */}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: 8 }}>{t('reviewsHowLong')}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {DURATIONS.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, duration: d }))}
                  style={{
                    padding: '6px 14px', borderRadius: 99, border: `1.5px solid ${form.duration === d ? '#3B82F6' : 'rgba(30,64,175,0.2)'}`,
                    background: form.duration === d ? '#DBEAFE' : 'white',
                    color: form.duration === d ? '#1E40AF' : '#4B5563',
                    fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  }}
                >{d}</button>
              ))}
            </div>
          </div>

          {/* Experience textarea */}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: 6 }}>
              {t('reviewsExperienceLabel')} <span style={{ fontWeight: 400, color: '#9CA3AF' }}>{t('reviewsMaxChars')}</span>
            </label>
            <textarea
              value={form.text}
              onChange={e => setForm(f => ({ ...f, text: e.target.value.slice(0, 300) }))}
              placeholder={t('reviewsExperiencePlaceholder')}
              rows={4}
              style={{ width: '100%', borderRadius: 10, border: '1.5px solid rgba(30,64,175,0.15)', padding: '10px 12px', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.5 }}
            />
            <div style={{ textAlign: 'right', fontSize: 11, color: '#9CA3AF', fontFamily: 'var(--font-body)', marginTop: 2 }}>{form.text.length}/300</div>
          </div>

          {/* Photo upload (UI only) */}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: 6 }}>
              {t('reviewsUploadPhoto')} <span style={{ fontWeight: 400, color: '#9CA3AF' }}>{t('authOptional')}</span>
            </label>
            <div style={{ border: '2px dashed rgba(30,64,175,0.2)', borderRadius: 10, padding: '16px 20px', textAlign: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: 24 }}>📸</span>
              <p style={{ margin: '4px 0 0', fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF' }}>{t('reviewsTapToAddPhoto')}</p>
            </div>
          </div>

          {error && <p style={{ color: '#EF4444', fontFamily: 'var(--font-body)', fontSize: 13, margin: 0 }}>{error}</p>}

          <button
            type="submit"
            style={{ width: '100%', minHeight: 48, background: '#0A1628', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
          >
            {t('reviewsShareMyStoryBtn')}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function ReviewsPage() {
  useCanonical('/reviews');
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Latest');
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('vedicmind_reviews') || '[]');
    // Seed some sample reviews if empty
    if (stored.length === 0) {
      const samples = [
        { id: '1', role: 'Parent', name: 'Sunita', city: 'Mumbai', stars: 5, duration: t('durationMonth1'), text: t('familiesReview1Text'), date: '2025-05-10T00:00:00.000Z', approved: true },
        { id: '2', role: 'Student', name: 'Arjun', city: 'Pune', stars: 5, duration: t('durationMonths3'), text: t('familiesReview2Text'), date: '2025-05-18T00:00:00.000Z', approved: true },
        { id: '3', role: 'Parent', name: 'Kavitha', city: 'Chennai', stars: 4, duration: t('durationWeeks2'), text: t('familiesReview3Text'), date: '2025-06-01T00:00:00.000Z', approved: true },
      ];
      localStorage.setItem('vedicmind_reviews', JSON.stringify(samples));
      setReviews(samples);
    } else {
      setReviews(stored.filter(r => r.approved));
    }
  }, []);

  const filtered = reviews
    .filter(r => filter === 'All' || r.role === filter)
    .sort((a, b) => sort === 'Latest'
      ? new Date(b.date) - new Date(a.date)
      : b.stars - a.stars
    );

  const handleSubmit = (review) => {
    setReviews(prev => [...prev, review]);
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1) : '—';

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <LandingNavbar />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 className="font-heading" style={{ fontSize: 'clamp(26px,5vw,36px)', fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>
            {t('reviewsPageTitle')}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#4B5563', marginBottom: 16 }}>
            {t('reviewsPageSubtitle')}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 24, color: '#F59E0B' }}>★</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: '#0A1628' }}>{avgRating}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563' }}>· {reviews.length} {t('reviewsCount')}</span>
            </div>
            <button
              onClick={() => setShowForm(true)}
              style={{ padding: '10px 24px', background: '#0A1628', color: 'white', border: 'none', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, cursor: 'pointer', minHeight: 44 }}
            >
              {t('reviewsShareStoryBtn')}
            </button>
          </div>
        </div>

        {/* Success toast */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '14px 20px', marginBottom: 20, fontFamily: 'var(--font-body)', fontSize: 14, color: '#065F46', textAlign: 'center' }}
            >
              {t('reviewsThankYou')}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter + Sort */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { key: 'All', label: t('filterAll'), value: 'All' },
              { key: 'Students', label: t('filterStudents'), value: 'Student' },
              { key: 'Parents', label: t('filterParents'), value: 'Parent' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.value)}
                style={{
                  padding: '6px 16px', borderRadius: 99, border: `1.5px solid ${filter === f.value ? '#0A1628' : 'rgba(30,64,175,0.2)'}`,
                  background: filter === f.value ? '#0A1628' : 'white',
                  color: filter === f.value ? 'white' : '#4B5563',
                  fontFamily: 'var(--font-body)', fontSize: 13, cursor: 'pointer', fontWeight: 500,
                }}
              >{f.label}</button>
            ))}
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{ height: 36, borderRadius: 8, border: '1.5px solid rgba(30,64,175,0.15)', padding: '0 12px', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', background: 'white', color: '#0A1628', cursor: 'pointer' }}
          >
            <option value="Latest">{t('sortLatest')}</option>
            <option value="Highest">{t('sortHighest')}</option>
          </select>
        </div>

        {/* Review grid */}
        <style>{`
          @media(min-width:640px){ .review-grid{ grid-template-columns: 1fr 1fr !important; } }
        `}</style>
        <div className="review-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          {filtered.map(r => <ReviewCard key={r.id} review={r} t={t} />)}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#4B5563', fontFamily: 'var(--font-body)' }}>
              {t('reviewsNoReviews')}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showForm && <SubmitReviewForm onSubmit={handleSubmit} onClose={() => setShowForm(false)} t={t} />}
      </AnimatePresence>
    </div>
  );
}
