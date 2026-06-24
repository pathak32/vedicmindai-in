import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSupabase } from '@/lib/supabaseClient';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { toast } from 'sonner';

const glass = {
  background: 'rgba(255,255,255,0.75)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(30,64,175,0.15)',
  boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
  borderRadius: 16,
};

const CLASSES = [
  { id: '6',  label: 'Class 6',  tagline: 'Foundation Sutras — Squaring & Simple Multiplication' },
  { id: '7',  label: 'Class 7',  tagline: 'Building Speed — Squaring, Near-Base Multiplication & 11s' },
  { id: '8',  label: 'Class 8',  tagline: 'Sharpening Skills — Cross Multiplication & Near-Base Mastery' },
  { id: '9',  label: 'Class 9',  tagline: 'Intermediate Mastery — Cubing, 3-Digit Multiplication & Speed' },
  { id: '10', label: 'Class 10', tagline: 'Exam-Ready Speed — Cubing, Square/Cube Roots, Board Style' },
];

const MONTH_LABEL = 'June 2026';

function ClassCard({ cls, onSelect, selected }) {
  return (
    <button
      onClick={() => onSelect(cls.id)}
      style={{
        ...glass,
        padding: '18px 16px',
        textAlign: 'left',
        cursor: 'pointer',
        border: selected ? '2px solid #3B82F6' : '1px solid rgba(30,64,175,0.15)',
        width: '100%',
      }}
    >
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: '#0A1628', marginBottom: 4 }}>
        {cls.label}
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#6B7280', lineHeight: 1.4 }}>
        {cls.tagline}
      </div>
    </button>
  );
}

function ScoreSubmitForm({ onSubmitted }) {
  const { user } = useVedicAuth();
  const [classId, setClassId] = useState('8');
  const [score, setScore] = useState('');
  const [total, setTotal] = useState('35');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!score || Number(score) < 0 || Number(score) > Number(total)) {
      toast.error('Please enter a valid score (0 to ' + total + ').');
      return;
    }
    setLoading(true);
    try {
      const supabase = await getSupabase();
      const { error } = await supabase.from('screenless_submissions').insert({
        user_id: user?.id || null,
        class_id: classId,
        month_label: MONTH_LABEL,
        score: Number(score),
        total: Number(total),
        submitted_at: new Date().toISOString(),
        status: 'pending_review',
      });
      if (error) throw error;
      toast.success('Score submitted! Our team will review it and apply your discount within 48 hours. 🎉');
      setScore('');
      onSubmitted && onSubmitted();
    } catch (err) {
      console.error('Screenless submission error:', err.message);
      toast.error('Could not submit right now. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    height: 44, width: '100%', padding: '0 14px', borderRadius: 10,
    border: '1.5px solid rgba(30,64,175,0.2)', fontSize: 15, outline: 'none',
    fontFamily: 'var(--font-body)', color: '#0A1628', background: 'white', boxSizing: 'border-box',
  };

  return (
    <div style={{ ...glass, padding: 24 }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: '#0A1628', marginBottom: 6 }}>
        📤 Submit Your Score
      </h3>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B7280', marginBottom: 18, lineHeight: 1.5 }}>
        Completed a mock test offline? Submit your score below — our team reviews submissions and applies a subscription discount within 48 hours.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Class</label>
          <select value={classId} onChange={e => setClassId(e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
            {CLASSES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Total Questions</label>
          <input value={total} onChange={e => setTotal(e.target.value.replace(/\D/g, ''))} style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Your Score (out of {total || '35'})</label>
        <input
          type="number" min="0" max={total || 35} value={score}
          onChange={e => setScore(e.target.value)}
          placeholder="e.g. 28"
          style={inputStyle}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%', height: 46, background: loading ? '#6B7280' : '#0A1628',
          color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)',
        }}
      >
        {loading ? 'Submitting…' : 'Submit Score →'}
      </button>
    </div>
  );
}

export default function ScreenlessLearningPage() {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('8');
  const [submitted, setSubmitted] = useState(false);

  const pdfUrl = `/screenless/VedicMind_Screenless_Class${selectedClass}_June2026.pdf`;

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <DashboardNavbar />
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 16px 80px' }}>

        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#1E40AF', fontFamily: 'var(--font-body)',
            fontSize: 14, fontWeight: 500, padding: '8px 0',
            marginBottom: 16, minHeight: 44,
          }}
        >
          ← Back to Dashboard
        </button>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>📝</span>
          <h1 className="font-heading" style={{ fontSize: 'clamp(26px,5vw,34px)', fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>
            Screenless Teaching
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#4B5563', margin: 0 }}>
            Offline mock tests, fresh every month — pen, paper, and focus.
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 14,
            background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 99,
            padding: '6px 16px', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#065F46',
          }}>
            🎁 Submit your score to unlock a subscription discount
          </div>
        </div>

        {/* Class selector */}
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: '#0A1628', marginBottom: 12 }}>
          Choose your class
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 28 }}>
          {CLASSES.map(c => (
            <ClassCard key={c.id} cls={c} selected={selectedClass === c.id} onSelect={setSelectedClass} />
          ))}
        </div>

        {/* Selected class detail + download */}
        <div style={{ ...glass, padding: 28, marginBottom: 28, textAlign: 'center' }}>
          <div style={{
            display: 'inline-block', background: '#DBEAFE', color: '#1E40AF',
            borderRadius: 99, padding: '4px 14px', fontSize: 12, fontWeight: 700,
            fontFamily: 'var(--font-body)', marginBottom: 10,
          }}>
            {MONTH_LABEL} Set
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 6 }}>
            {CLASSES.find(c => c.id === selectedClass)?.label} — Mock Test Booklet
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#6B7280', marginBottom: 20, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            {CLASSES.find(c => c.id === selectedClass)?.tagline}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px 24px', flexWrap: 'wrap', marginBottom: 22 }}>
            {[
              { icon: '📄', text: '5 Mock Tests' },
              { icon: '🧮', text: '35 Questions' },
              { icon: '⏱️', text: '~20 min/paper' },
              { icon: '💰', text: 'Rs. 49/month' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>

          <motion.a
            key={pdfUrl}
            href={pdfUrl}
            download
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#0A1628', color: 'white', textDecoration: 'none',
              borderRadius: 12, padding: '14px 32px', fontFamily: 'var(--font-body)',
              fontSize: 15, fontWeight: 700, minHeight: 48,
            }}
          >
            ⬇️ Download {CLASSES.find(c => c.id === selectedClass)?.label} PDF
          </motion.a>
        </div>

        {/* Score submission */}
        <ScoreSubmitForm onSubmitted={() => setSubmitted(true)} />

        {/* Footer note */}
        <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF', marginTop: 24 }}>
          A brand-new set drops every month — same price, fresh questions. Available in Hindi soon.
        </p>

      </main>
    </div>
  );
}