import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Real Vedic Maths sutras (Sanskrit) paired with the calculations they solve
const PARTICLES_SOURCE = [
  { text: 'निखिलम् नवतश्चरमं दशतः', type: 'sutra' },
  { text: '98 × 97 = 9506', type: 'calc' },
  { text: 'ऊर्ध्वतिर्यग्भ्याम्', type: 'sutra' },
  { text: '75² = 5625', type: 'calc' },
  { text: 'एकाधिकेन पूर्वेण', type: 'sutra' },
  { text: '√5329 = 73', type: 'calc' },
  { text: 'आनुरूप्येण', type: 'sutra' },
  { text: '123 × 11 = 1353', type: 'calc' },
  { text: 'परावर्त्य योजयेत्', type: 'sutra' },
  { text: '48 × 52 = 2496', type: 'calc' },
  { text: 'शून्यं साम्यसमुच्चये', type: 'sutra' },
  { text: '999 × 999 = 998001', type: 'calc' },
  { text: 'सङ्कलनव्यवकलनाभ्याम्', type: 'sutra' },
  { text: '87 + 13 = 100', type: 'calc' },
];

export default function FloatingMathBackground() {
  const shouldReduceMotion = useReducedMotion();

  // Randomize position/timing once per mount, not on every render
  const particles = useMemo(
    () =>
      PARTICLES_SOURCE.map((item, i) => ({
        ...item,
        id: i,
        left: 4 + ((i * 37) % 92), // deterministic-ish spread, avoids edge clustering
        delay: (i * 1.7) % 10,
        duration: 16 + ((i * 5) % 12),
      })),
    []
  );

  if (shouldReduceMotion) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute whitespace-nowrap px-3 py-1.5 rounded-full font-mono"
          style={{
            left: `${p.left}%`,
            fontSize: p.type === 'sutra' ? 13 : 15,
            background: p.type === 'sutra' ? 'rgba(59,130,246,0.10)' : 'rgba(255,255,255,0.06)',
            color: p.type === 'sutra' ? '#93C5FD' : '#CBD5E1',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          initial={{ y: '115%', opacity: 0 }}
          animate={{ y: '-25%', opacity: [0, 1, 1, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {p.text}
        </motion.div>
      ))}
    </div>
  );
}
