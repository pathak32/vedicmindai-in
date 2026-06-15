import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

export default function ResetConfirmModal({onConfirm, onCancel }) {
  const { t } = useLanguage();
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={onCancel} style={{ position: 'absolute', inset: 0, background: 'rgba(10,22,40,0.5)' }} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          position: 'relative', background: 'white', borderRadius: 16, padding: 32,
          maxWidth: 400, width: '100%', boxShadow: '0 20px 60px rgba(10,22,40,0.3)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h2 className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 12 }}>Reset All Progress?</h2>
        <p style={{ fontSize: 14, color: '#4B5563', fontFamily: 'var(--font-body)', lineHeight: 1.6, marginBottom: 24 }}>
          This will erase all your XP, streaks, completed lessons, and badges. This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onConfirm}
            style={{ minHeight: 44, padding: '0 24px', background: '#EF4444', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >
            Yes, Reset Everything
          </button>
          <button
            onClick={onCancel}
            style={{ minHeight: 44, padding: '0 24px', background: 'transparent', color: '#0A1628', border: '1.5px solid rgba(30,64,175,0.2)', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >
            {t('cancel')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}