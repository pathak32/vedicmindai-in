import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

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

function ReviewCard({ review }) {
  const roleColor = { Student: '#DBEAFE', Parent: '#D1FAE5', Guardian: '#EDE9FE' };
  const roleText  = { Student: '#1E40AF', Parent: '#065F46', Guardian: '#5B21B6' };
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
              {review.role}
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

function SubmitReviewForm({ onSubmit, onClose }) {
  const [form, setForm] = useState({ role: 'Student', name: '', city: '', stars: 0, duration: '', text: '' });
  const [error, setError] = useState('');

  const DURATIONS = ['1 week', '2 weeks', '1 month', '3 months', '6 months+'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Please enter your name.'); return; }
    if (!form.stars) { setError('Please select a star rating.'); return; }
    if (!form.duration) { setError('Please select how long you\'ve been using VedicMind.'); return; }
    if (!form.text.trim()) { setError('Please share your experience.'); return; }
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
        <h2 className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 20 }}>Share Your Story 💬</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Role pills */}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: 8 }}>I am a...</label>
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
                >{r}</button>
              ))}
            </div>
          </div>

          {/* Name + City */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: 6 }}>First Name</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                style={{ width: '100%', height: 44, borderRadius: 10, border: '1.5px solid rgba(30,64,175,0.15)', padding: '0 12px', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: 6 }}>City</label>
              <input
                value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                placeholder="Your city"
                style={{ width: '100%', height: 44, borderRadius: 10, border: '1.5px solid rgba(30,64,175,0.15)', padding: '0 12px', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Star rating */}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: 8 }}>Your Rating</label>
            <StarRating value={form.stars} onChange={s => setForm(f => ({ ...f, stars: s }))} />
          </div>

          {/* Duration */}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: 8 }}>How long have you been using VedicMind?</label>
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
              Your Experience <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(max 300 chars)</span>
            </label>
            <textarea
              value={form.text}
              onChange={e => setForm(f => ({ ...f, text: e.target.value.slice(0, 300) }))}
              placeholder="Tell others about your experience with VedicMind..."
              rows={4}
              style={{ width: '100%', borderRadius: 10, border: '1.5px solid rgba(30,64,175,0.15)', padding: '10px 12px', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.5 }}
            />
            <div style={{ textAlign: 'right', fontSize: 11, color: '#9CA3AF', fontFamily: 'var(--font-body)', marginTop: 2 }}>{form.text.length}/300</div>
          </div>

          {/* Photo upload (UI only) */}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: 6 }}>
              Upload a Photo <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(optional)</span>
            </label>
            <div style={{ border: '2px dashed rgba(30,64,175,0.2)', borderRadius: 10, padding: '16px 20px', textAlign: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: 24 }}>📸</span>
              <p style={{ margin: '4px 0 0', fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF' }}>Tap to add a photo</p>
            </div>
          </div>

          {error && <p style={{ color: '#EF4444', fontFamily: 'var(--font-body)', fontSize: 13, margin: 0 }}>{error}</p>}

          <button
            type="submit"
            style={{ width: '100%', minHeight: 48, background: '#0A1628', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
          >
            Share My Story ✨
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function ReviewsPage() {
  const navigate = useNavigate();
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
        { id: '1', role: 'Parent', name: 'Sunita', city: 'Mumbai', stars: 5, duration: '1 month', text: 'My daughter\'s mental math has improved dramatically! She now calculates faster than her calculator. VedicMind is a gem.', date: '2025-05-10T00:00:00.000Z', approved: true },
        { id: '2', role: 'Student', name: 'Arjun', city: 'Pune', stars: 5, duration: '3 months', text: 'The daily quiz is addictive! I\'ve not missed a single day in 2 months. My maths score in school went from 72% to 94%.', date: '2025-05-18T00:00:00.000Z', approved: true },
        { id: '3', role: 'Parent', name: 'Kavitha', city: 'Chennai', stars: 4, duration: '2 weeks', text: 'Very well structured course. The Vedic methods are explained simply and my son loves the leaderboard competition.', date: '2025-06-01T00:00:00.000Z', approved: true },
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
      <DashboardNavbar />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 className="font-heading" style={{ fontSize: 'clamp(26px,5vw,36px)', fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>
            What Families Say 💬
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#4B5563', marginBottom: 16 }}>
            Real stories from students and parents across India
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 24, color: '#F59E0B' }}>★</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: '#0A1628' }}>{avgRating}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563' }}>· {reviews.length} reviews</span>
            </div>
            <button
              onClick={() => setShowForm(true)}
              style={{ padding: '10px 24px', background: '#0A1628', color: 'white', border: 'none', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, cursor: 'pointer', minHeight: 44 }}
            >
              + Share Your Story
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
              ✅ Thank you! Your review has been shared.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter + Sort */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['All', 'Students', 'Parents'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f === 'Students' ? 'Student' : f === 'Parents' ? 'Parent' : 'All')}
                style={{
                  padding: '6px 16px', borderRadius: 99, border: `1.5px solid ${(filter === 'All' && f === 'All') || filter === f.slice(0, -1) || (f === 'Students' && filter === 'Student') || (f === 'Parents' && filter === 'Parent') ? '#0A1628' : 'rgba(30,64,175,0.2)'}`,
                  background: (filter === 'All' && f === 'All') || (f === 'Students' && filter === 'Student') || (f === 'Parents' && filter === 'Parent') ? '#0A1628' : 'white',
                  color: (filter === 'All' && f === 'All') || (f === 'Students' && filter === 'Student') || (f === 'Parents' && filter === 'Parent') ? 'white' : '#4B5563',
                  fontFamily: 'var(--font-body)', fontSize: 13, cursor: 'pointer', fontWeight: 500,
                }}
              >{f}</button>
            ))}
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{ height: 36, borderRadius: 8, border: '1.5px solid rgba(30,64,175,0.15)', padding: '0 12px', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', background: 'white', color: '#0A1628', cursor: 'pointer' }}
          >
            <option value="Latest">Latest first</option>
            <option value="Highest">Highest rated</option>
          </select>
        </div>

        {/* Review grid */}
        <style>{`
          @media(min-width:640px){ .review-grid{ grid-template-columns: 1fr 1fr !important; } }
        `}</style>
        <div className="review-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          {filtered.map(r => <ReviewCard key={r.id} review={r} />)}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#4B5563', fontFamily: 'var(--font-body)' }}>
              No reviews yet. Be the first to share your story!
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showForm && <SubmitReviewForm onSubmit={handleSubmit} onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  );
}
