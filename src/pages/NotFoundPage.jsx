import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const FLOATS = ['∑', '√', 'π', '∞', '×', '÷', '²', '³', '≈', '%', '∫', 'Δ'];

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0A1628 0%, #0D2252 60%, #1E40AF 100%)',
      position: 'relative', overflow: 'hidden', padding: 24,
    }}>
      {/* Floating math bg */}
      {FLOATS.map((sym, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${(i * 8.3) % 100}%`,
          top: `${(i * 13 + 10) % 90}%`,
          fontSize: 32 + (i % 3) * 12,
          color: 'rgba(255,255,255,0.06)',
          fontFamily: 'var(--font-mono)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>{sym}</div>
      ))}

      {/* Large 404 */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'var(--font-mono)', fontSize: 'clamp(80px,20vw,160px)',
        fontWeight: 700, color: 'rgba(255,255,255,0.07)',
        pointerEvents: 'none', userSelect: 'none',
        whiteSpace: 'nowrap',
      }}>404</div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}
      >
        <motion.span
          animate={{ rotate: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          style={{ fontSize: 'clamp(56px,12vw,80px)', display: 'block', marginBottom: 24 }}
        >
          🧮
        </motion.span>

        <h1 className="font-heading" style={{ fontSize: 'clamp(24px,5vw,36px)', fontWeight: 700, color: 'white', marginBottom: 12 }}>
          This page is not in our Sutras
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)', marginBottom: 8, maxWidth: 440 }}>
          Even Vedic Mathematics can't help us find this page.
        </p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)', marginBottom: 36 }}>
          Error 404 — Page Not Found
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ minHeight: 44, padding: '0 28px', background: 'white', color: '#0A1628', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >
            ← Back to Dashboard
          </button>
          <Link to="/">
            <button style={{ minHeight: 44, padding: '0 24px', background: 'transparent', color: 'white', border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Go Home
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}