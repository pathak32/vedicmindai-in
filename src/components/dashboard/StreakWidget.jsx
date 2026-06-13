import React from 'react';
import { motion } from 'framer-motion';
import { getTodayString } from '@/utils/helpers';

function getWeekDays() {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    const dayOfWeek = d.getDay();
    const diff = i - ((dayOfWeek + 7 - 0) % 7); // start from Sunday
    const date = new Date(d);
    date.setDate(d.getDate() - (dayOfWeek - i));
    const dateStr =
      date.getFullYear() +
      '-' +
      String(date.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(date.getDate()).padStart(2, '0');
    return { label: days[i], dateStr, isToday: i === dayOfWeek };
  });
}

export default function StreakWidget({ progress }) {
  const today = getTodayString();
  const studiedToday = (progress.studyDates || []).includes(today);
  const weekDays = getWeekDays();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-[20px] p-6 text-white"
      style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0D2252 100%)' }}
    >
      <div className="text-center mb-5">
        <motion.span
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-5xl block mb-3"
          style={{ filter: 'drop-shadow(0 0 12px rgba(249,115,22,0.7))' }}
        >
          🔥
        </motion.span>
        <h2 className="font-heading text-3xl font-bold text-white">
          {progress.streak || 0} Day Streak!
        </h2>
      </div>

      {/* 7-day mini calendar */}
      <div className="flex justify-between mb-4">
        {weekDays.map(({ label, dateStr, isToday }) => {
          const studied = (progress.studyDates || []).includes(dateStr);
          return (
            <div key={dateStr} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-blue-300">{label}</span>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                isToday && studied
                  ? 'bg-[#3B82F6]'
                  : isToday && !studied
                  ? 'border-2 border-dashed border-blue-300'
                  : studied
                  ? 'bg-white/20'
                  : 'border border-white/20'
              }`}>
                {studied && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-blue-200 leading-relaxed">
        {studiedToday
          ? 'Great job! You studied today! ✅'
          : 'Keep it up! Study today to maintain your streak'}
      </p>
    </motion.div>
  );
}