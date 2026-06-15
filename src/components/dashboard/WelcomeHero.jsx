import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

function useCountUp(target, duration = 1200) {
  const { t } = useLanguage();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setValue(Math.floor(start));
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return value;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Good morning';
  if (h >= 12 && h < 18) return 'Good afternoon';
  return 'Good evening';
}

const LEVEL_INFO = {
  1: { label: 'Beginner', emoji: '🌱' },
  2: { label: 'Intermediate', emoji: '📈' },
  3: { label: 'Advanced', emoji: '🔥' },
  4: { label: 'Master', emoji: '👑' },
};

export default function WelcomeHero({ user, progress }) {
  const lessonsCount = useCountUp(progress.completedLessons?.length || 0);
  const streakCount = useCountUp(progress.streak || 0);
  const xpCount = useCountUp(progress.totalXP || 0);

  const name = user?.name?.split(' ')[0] || 'Learner';
  const level = LEVEL_INFO[progress.currentLevel] || LEVEL_INFO[1];

  const daysSince = user?.createdAt
    ? Math.max(1, Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000))
    : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[20px] p-6 sm:p-8 text-white"
      style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0D2252 60%, #1E40AF 100%)' }}
    >
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold">
            {getGreeting()}, {name}! 🌟
          </h1>
          <p className="text-blue-200 text-sm mt-1">Day {daysSince} of your Vedic Maths journey</p>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-white/15 text-white text-sm font-semibold border border-white/20">
          {level.emoji} {level.label}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: '📚', label: 'Lessons', value: lessonsCount },
          { icon: '🔥', label: 'Day Streak', value: streakCount },
          { icon: '⚡', label: 'Total XP', value: xpCount },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-3 text-center">
            <span className="text-xl">{stat.icon}</span>
            <p className="font-mono text-xl font-bold text-white mt-1">{stat.value}</p>
            <p className="text-blue-200 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      <Link
        to="/learn"
        className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-white text-[#0A1628] font-semibold text-sm hover:bg-blue-50 transition-colors"
      >
        Continue Learning →
      </Link>
    </motion.div>
  );
}