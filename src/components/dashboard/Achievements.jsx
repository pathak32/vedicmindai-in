import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BADGE_DEFS } from '@/utils/helpers';

export default function Achievements({ progress }) {
  const [hovered, setHovered] = useState(null);
  const earned = new Set(progress.badges || []);
  const display = BADGE_DEFS.slice(0, 9);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-[20px] p-6 border border-[#F0F4FF]"
      style={{ boxShadow: '0 4px 24px rgba(10,22,40,0.06)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-bold text-[#0A1628]">Your Badges</h2>
        <span className="text-xs text-[#3B82F6] font-medium cursor-pointer hover:underline">View all →</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {display.map((badge) => {
          const isEarned = earned.has(badge.id);
          return (
            <div
              key={badge.id}
              className="relative flex flex-col items-center"
              onMouseEnter={() => setHovered(badge.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${
                isEarned ? 'bg-[#F0F4FF]' : 'bg-[#F9FAFB] grayscale opacity-40'
              }`}>
                {badge.emoji}
              </div>
              {!isEarned && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs">🔒</span>
                </div>
              )}
              {hovered === badge.id && (
                <div className="absolute bottom-full mb-1 z-10 bg-[#0A1628] text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                  {badge.name}
                </div>
              )}
              <p className="text-[10px] text-[#4B5563] mt-1 text-center leading-tight">{badge.name}</p>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[#9CA3AF] mt-4 text-center">
        {earned.size} / {BADGE_DEFS.length} badges earned
      </p>
    </motion.div>
  );
}