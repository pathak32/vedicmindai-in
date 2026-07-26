import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { APTITUDE_CHAPTERS, getAptitudeChaptersByLevel } from '@/data/aptitudeContent';

const tr = (field, language) => field?.[language] ?? field?.en ?? '';

const LEVELS = [
  { id: 'PRE_K', label: { en: 'Little Learners', hi: 'छोटे शिक्षार्थी' } },
  { id: 'PRIMARY', label: { en: 'Primary (1-5)', hi: 'प्राइमरी (1-5)' } },
  { id: 'MIDDLE', label: { en: 'Middle (6-8)', hi: 'मिडिल (6-8)' } },
  { id: 'SECONDARY', label: { en: 'Secondary (9-10)', hi: 'सेकेंडरी (9-10)' } },
  { id: 'INTERMEDIATE', label: { en: 'Intermediate (11-12)', hi: 'इंटरमीडिएट (11-12)' } },
];

export default function AptitudeSidebar({ activeChapterId, onClose, showClose }) {
  const { language } = useLanguage();

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '16px 12px', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
      {showClose && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#B8B2D6', cursor: 'pointer' }}><X size={18} /></button>
        </div>
      )}
      {LEVELS.map((level) => {
        const chapters = getAptitudeChaptersByLevel(level.id);
        if (chapters.length === 0) return null; // Secondary/Intermediate not built yet — hidden until ready
        return (
          <div key={level.id} style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#8B85AD', textTransform: 'uppercase', letterSpacing: 0.5, padding: '0 8px', marginBottom: 6 }}>
              {tr(level.label, language)}
            </p>
            {chapters.map((ch) => {
              const active = ch.id === activeChapterId;
              return (
                <Link
                  key={ch.id}
                  to={`/aptitude/${ch.id}`}
                  onClick={onClose}
                  style={{
                    display: 'block', padding: '9px 12px', borderRadius: 8, marginBottom: 2,
                    fontSize: 13.5, textDecoration: 'none',
                    background: active ? 'rgba(16,185,129,0.15)' : 'transparent',
                    color: active ? '#6EE7B7' : '#B8B2D6', fontWeight: active ? 700 : 400,
                  }}
                >
                  {tr(ch.title, language)}
                </Link>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
