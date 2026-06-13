import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LEVELS_CONFIG = [
  { emoji: '🌱', label: 'Beginner', total: 10, ids: Array.from({ length: 10 }, (_, i) => `l1_${i + 1}`) },
  { emoji: '📈', label: 'Intermediate', total: 12, ids: Array.from({ length: 12 }, (_, i) => `l2_${i + 1}`) },
  { emoji: '🔥', label: 'Advanced', total: 10, ids: Array.from({ length: 10 }, (_, i) => `l3_${i + 1}`) },
  { emoji: '👑', label: 'Master', total: 8, ids: Array.from({ length: 8 }, (_, i) => `l4_${i + 1}`) },
];

const TOTAL = 40;

function CircularRing({ percent }) {
  const [animPct, setAnimPct] = useState(0);
  const size = 160;
  const r = 68;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ - (animPct / 100) * circ;

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const target = percent;
      const interval = setInterval(() => {
        start = Math.min(start + target / 60, target);
        setAnimPct(start);
        if (start >= target) clearInterval(interval);
      }, 25);
      return () => clearInterval(interval);
    }, 200);
    return () => clearTimeout(timer);
  }, [percent]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0A1628" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth="10" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.04s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-3xl font-bold text-[#0A1628]">{Math.round(animPct)}%</span>
      </div>
    </div>
  );
}

export default function OverallProgress({ progress }) {
  const completed = progress.completedLessons?.length || 0;
  const percent = Math.round((completed / TOTAL) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-[20px] p-6 border border-[#F0F4FF]"
      style={{ boxShadow: '0 4px 24px rgba(10,22,40,0.06)' }}
    >
      <h2 className="font-heading text-lg font-bold text-[#0A1628] mb-5">Overall Progress</h2>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="flex flex-col items-center">
          <CircularRing percent={percent} />
          <p className="text-xs text-[#4B5563] mt-2 text-center">{completed} of {TOTAL} lessons completed</p>
        </div>

        <div className="flex-1 w-full space-y-4">
          {LEVELS_CONFIG.map((lv) => {
            const done = lv.ids.filter(id => progress.completedLessons?.includes(id)).length;
            const pct = Math.round((done / lv.total) * 100);
            return (
              <div key={lv.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-[#0A1628]">{lv.emoji} {lv.label}</span>
                  <span className="text-xs text-[#4B5563] font-mono">{done}/{lv.total}</span>
                </div>
                <div className="h-2 bg-[#F0F4FF] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                    className="h-full rounded-full bg-[#0A1628]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}