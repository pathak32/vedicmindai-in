import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

const COMING_SOON_MSG = `🚀 AI Tutor is being upgraded!

We're building a more powerful AI Tutor experience for you. This feature will be live very soon with:
✅ Real-time Vedic Maths explanations
✅ Step-by-step problem solving
✅ Personalized learning guidance

Stay tuned! 🙏 — Team VedicMind`;

export default function AITutorPanel({lesson, onClose }) {
  const { t } = useLanguage();
  const lessonTitle = lesson?.title || 'Vedic Mathematics';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        style={{
          position: 'absolute', right: 0, top: 0, bottom: 0,
          width: '100%', maxWidth: 380,
          background: 'white', display: 'flex', flexDirection: 'column',
          boxShadow: '-4px 0 32px rgba(10,22,40,0.12)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(30,64,175,0.1)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>🤖</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: '#0A1628' }}>{t('aiTutor')}</div>
              <span style={{
                background: '#F59E0B', color: 'white',
                borderRadius: 99, padding: '2px 8px',
                fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>{t('comingSoon')}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
              {lessonTitle}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={20} color="#4B5563" />
          </button>
        </div>

        {/* Message */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              maxWidth: '82%',
              background: '#F0F4FF',
              color: '#0A1628',
              borderRadius: '16px 16px 16px 4px',
              padding: '12px 16px',
              fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}>
              {COMING_SOON_MSG}
            </div>
          </div>
        </div>

        {/* Input — disabled */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(30,64,175,0.1)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <textarea
            disabled
            placeholder="Available soon..."
            rows={1}
            style={{
              flex: 1, minHeight: 44, fontSize: 15, padding: '10px 14px',
              border: '1.5px solid rgba(30,64,175,0.1)', borderRadius: 12,
              fontFamily: 'var(--font-body)', resize: 'none', outline: 'none',
              lineHeight: 1.5, background: '#F3F4F6', color: '#9CA3AF', cursor: 'not-allowed',
            }}
          />
          <button
            disabled
            style={{
              minWidth: 44, minHeight: 44, background: '#9CA3AF', color: 'white',
              border: 'none', borderRadius: 10, cursor: 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0.5,
            }}
          >
            ➤
          </button>
        </div>
      </motion.div>
    </div>
  );
}