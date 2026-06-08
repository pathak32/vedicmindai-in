import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isLevelUnlocked } from '@/utils/helpers';

const LEVELS = [
  { num: 1, emoji: '🌱', label: 'Beginner', total: 10, prefix: 'l1_' },
  { num: 2, emoji: '📈', label: 'Intermediate', total: 12, prefix: 'l2_' },
  { num: 3, emoji: '🔥', label: 'Advanced', total: 10, prefix: 'l3_' },
  { num: 4, emoji: '👑', label: 'Master', total: 8, prefix: 'l4_' },
];

export default function LevelCards({ progress }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-[20px] p-6 border border-[#F0F4FF]"
      style={{ boxShadow: '0 4px 24px rgba(10,22,40,0.06)' }}
    >
      <h2 className="font-heading text-lg font-bold text-[#0A1628] mb-4">Levels</h2>
      <div className="grid grid-cols-2 gap-4">
        {LEVELS.map((lv) => {
          const unlocked = isLevelUnlocked(lv.num, progress);
          const ids = Array.from({ length: lv.total }, (_, i) => `${lv.prefix}${i + 1}`);
          const done = ids.filter(id => progress.completedLessons?.includes(id)).length;
          const pct = Math.round((done / lv.total) * 100);
          const allDone = done === lv.total;
          const inProgress = done > 0 && !allDone;
          const notStarted = done === 0;

          return (
            <div
              key={lv.num}
              className={`rounded-2xl p-4 border transition-all ${
                !unlocked ? 'bg-[#F9FAFB] border-[#E5E7EB] opacity-60' : 'bg-white border-[#F0F4FF] hover:border-[#0A1628]/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{unlocked ? lv.emoji : '🔒'}</span>
                <span className="font-heading text-sm font-bold text-[#0A1628]">{lv.label}</span>
              </div>

              <div className="h-1.5 bg-[#F0F4FF] rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: unlocked ? `${pct}%` : '0%' }}
                  transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                  className="h-full bg-[#0A1628] rounded-full"
                />
              </div>

              <p className="text-xs text-[#4B5563] font-mono mb-3">{done}/{lv.total} lessons</p>

              {!unlocked && (
                <p className="text-[10px] text-[#9CA3AF] leading-tight">
                  Complete Level {lv.num - 1} Assessment to unlock
                </p>
              )}

              {unlocked && allDone && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
                  ✅ Completed
                </span>
              )}

              {unlocked && inProgress && (
                <Link
                  to="/learn"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 text-xs font-semibold hover:bg-blue-100 transition-colors"
                >
                  ▶️ Continue →
                </Link>
              )}

              {unlocked && notStarted && (
                <Link
                  to="/learn"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0A1628] text-white text-xs font-semibold hover:bg-[#0D2252] transition-colors"
                >
                  Start
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}