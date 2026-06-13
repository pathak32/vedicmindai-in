import React from 'react';

export default function LessonLockOverlay() {
  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0,
      width: '100%', height: '100%',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      borderRadius: 16,
      textAlign: 'center',
      padding: '32px 24px',
    }}>
      <div style={{ fontSize: 32, marginBottom: 16 }}>🔒</div>
      <h2 className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>
        Upgrade to Continue
      </h2>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', maxWidth: 300, lineHeight: 1.6, marginBottom: 20 }}>
        This lesson is part of the paid plan. Upgrade to unlock all 40 lessons.
      </p>
      <button
        onClick={() => window.open('https://rzp.io/rzp/vRD8R2lw', '_blank')}
        style={{
          background: '#0A1628',
          color: 'white',
          border: 'none',
          borderRadius: 12,
          height: 44,
          width: 200,
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
          fontSize: 15,
          cursor: 'pointer',
        }}
      >
        See Plans →
      </button>
    </div>
  );
}