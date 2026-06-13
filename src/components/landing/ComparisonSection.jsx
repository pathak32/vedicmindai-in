import React from 'react';
import { motion } from 'framer-motion';

const rows = [
  { feature: 'Structured 40-Lesson Curriculum', us: '✅', them: '❌', usSub: null },
  { feature: 'AI Personal Tutor',               us: '✅', them: '❌', usSub: null },
  { feature: 'Class-based Competitions',         us: '✅', them: '❌', usSub: null },
  { feature: 'Daily Quiz + Olympiad',            us: '✅', them: '❌', usSub: null },
  { feature: 'Progress Tracking + XP',           us: '✅', them: '⚠️', usSub: null, themSub: 'partial' },
  { feature: 'Hindi + Regional Languages',       us: '✅', them: '❌', usSub: 'Coming Soon' },
  { feature: 'Free Trial — Full Access',         us: '✅', them: '⚠️', usSub: '7 Days', themSub: 'Limited' },
];

export default function ComparisonSection() {
  return (
    <section style={{ background: '#F8FAFF', padding: '80px 0' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 16px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 32 }}
        >
          <h2 className="font-heading" style={{ fontSize: 'clamp(24px,4vw,32px)', fontWeight: 700, color: '#0A1628', margin: '0 0 10px' }}>
            Why VedicMind is Different
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#4B5563', margin: 0 }}>
            Not just tricks — a complete AI-powered learning system
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{
            border: '1px solid rgba(30,64,175,0.12)',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(10,22,40,0.06)',
          }}
        >
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(140px,1fr) 90px 90px' }}>
            <div style={{ padding: '12px 20px', background: '#F3F4F6' }} />
            <div style={{
              padding: '12px 8px', background: '#0A1628',
              textAlign: 'center',
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'white',
            }}>
              VedicMind 🧮
            </div>
            <div style={{
              padding: '12px 8px', background: '#F3F4F6',
              textAlign: 'center',
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#4B5563',
            }}>
              Other Apps
            </div>
          </div>

          {/* Data rows */}
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(140px,1fr) 90px 90px',
                background: i % 2 === 0 ? 'white' : '#F8FAFF',
                borderTop: '1px solid rgba(30,64,175,0.07)',
              }}
            >
              {/* Feature name */}
              <div style={{ padding: '14px 20px', fontFamily: 'var(--font-body)', fontSize: 'clamp(12px,2vw,14px)', color: '#0A1628', display: 'flex', alignItems: 'center' }}>
                {row.feature}
              </div>

              {/* VedicMind col */}
              <div style={{ padding: '14px 8px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <span style={{ fontSize: 18 }}>{row.us}</span>
                {row.usSub && (
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#10B981', fontWeight: 600 }}>
                    {row.usSub}
                  </span>
                )}
              </div>

              {/* Others col */}
              <div style={{ padding: '14px 8px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <span style={{ fontSize: 18, color: row.them === '⚠️' ? '#F59E0B' : row.them === '❌' ? '#EF4444' : 'inherit' }}>
                  {row.them}
                </span>
                {row.themSub && (
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>
                    {row.themSub}
                  </span>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}