import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { CURRICULUM, TOTAL_VEDIC_LESSONS } from '@/components/learn/curriculumData';

const ALL_BADGES = [
  { id: 'first_lesson',     emoji: '🥇', name: 'First Lesson',         condition: 'Complete your first lesson' },
  { id: 'five_lessons',     emoji: '📚', name: '5 Lessons Done',        condition: 'Complete 5 lessons' },
  { id: 'ten_lessons',      emoji: '🎓', name: '10 Lessons Done',       condition: 'Complete 10 lessons' },
  { id: 'twenty_lessons',   emoji: '💡', name: '20 Lessons Done',       condition: 'Complete 20 lessons' },
  { id: 'all_beginner',     emoji: '🌱', name: 'Beginner Complete',     condition: 'Complete all Level 1 lessons' },
  { id: 'all_intermediate', emoji: '📈', name: 'Intermediate Complete', condition: 'Complete all Level 2 lessons' },
  { id: 'all_advanced',     emoji: '⚡', name: 'Advanced Complete',     condition: 'Complete all Level 3 lessons' },
  { id: 'master_complete',  emoji: '👑', name: 'Master',                condition: `Complete all ${TOTAL_VEDIC_LESSONS} lessons` },
  { id: 'streak_3',         emoji: '🔥', name: '3-Day Streak',          condition: 'Study 3 days in a row' },
  { id: 'streak_7',         emoji: '💪', name: '7-Day Streak',          condition: 'Study 7 days in a row' },
  { id: 'streak_14',        emoji: '🏅', name: '2-Week Streak',         condition: 'Study 14 days in a row' },
  { id: 'streak_30',        emoji: '🌟', name: '30-Day Streak',         condition: 'Study 30 days in a row' },
  { id: 'perfect_score',    emoji: '⭐', name: 'Perfect Score',         condition: 'Score 100% on any quiz' },
  { id: 'xp_500',           emoji: '✨', name: '500 XP',                condition: 'Earn 500 total XP' },
  { id: 'xp_1000',          emoji: '💎', name: '1000 XP',               condition: 'Earn 1000 total XP' },
  { id: 'xp_5000',          emoji: '🏆', name: '5000 XP',               condition: 'Earn 5000 total XP' },
  { id: 'speed_demon',      emoji: '⚡', name: 'Speed Demon',           condition: 'Score 200+ XP in Speed Drill' },
  { id: 'challenger',       emoji: '🎯', name: 'Challenger',             condition: 'Complete Challenge Mode' },
  { id: 'quiz_streak_7',    emoji: '📅', name: 'Quiz Week',             condition: 'Coming in Phase 2' },
  { id: 'top_10_class',     emoji: '🏅', name: 'Top 10',                condition: 'Coming in Phase 2' },
];

// A badge counts as earned if it was stored, or if the progress itself meets it.
// The stored list can lag behind the real progress, which made completed students
// see "First Lesson" earned but "5 Lessons" locked.
function isEarned(id, badges, progress) {
  if (badges.includes(id)) return true;
  const done = (progress?.completedLessons || []).length;
  const xp = progress?.totalXP || 0;
  const level = (lvl) => CURRICULUM.find((lv) => lv.level === lvl)?.lessons || [];
  const levelDone = (lvl) => level(lvl).every((l) => (progress?.completedLessons || []).includes(l.id));
  switch (id) {
    case 'first_lesson': return done >= 1;
    case 'five_lessons': return done >= 5;
    case 'ten_lessons': return done >= 10;
    case 'twenty_lessons': return done >= 20;
    case 'all_beginner': return levelDone(1);
    case 'all_intermediate': return levelDone(2);
    case 'all_advanced': return levelDone(3);
    case 'master_complete': return done >= TOTAL_VEDIC_LESSONS;
    case 'xp_500': return xp >= 500;
    case 'xp_1000': return xp >= 1000;
    case 'xp_5000': return xp >= 5000;
    default: return false;
  }
}

export default function BadgeGrid({ badges = [], progress = {} }) {
  const [tooltip, setTooltip] = useState(null);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 16 }}>
      {ALL_BADGES.map((b) => {
        const earned = isEarned(b.id, badges, progress);
        return (
          <div
            key={b.id}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', position: 'relative' }}
            onMouseEnter={() => setTooltip(b.id)}
            onMouseLeave={() => setTooltip(null)}
          >
            <div style={{
              width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32,
              background: earned ? 'linear-gradient(135deg, #DBEAFE, #EDE9FE)' : '#F0F4FF',
              border: earned ? '2px solid rgba(59,130,246,0.3)' : '2px solid rgba(30,64,175,0.08)',
              filter: earned ? 'none' : 'grayscale(1)',
              opacity: earned ? 1 : 0.5,
              position: 'relative',
            }}>
              {earned ? b.emoji : '🔒'}
            </div>
            <span style={{ fontSize: 11, color: '#0A1628', fontFamily: 'var(--font-body)', textAlign: 'center', lineHeight: 1.3 }}>
              {b.name}
            </span>
            {tooltip === b.id && !earned && (
              <div style={{
                position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                background: '#0A1628', color: 'white', fontSize: 11, fontFamily: 'var(--font-body)',
                borderRadius: 8, padding: '6px 10px', whiteSpace: 'nowrap', zIndex: 100,
                marginBottom: 6, pointerEvents: 'none',
                boxShadow: '0 4px 12px rgba(10,22,40,0.3)',
              }}>
                {b.condition}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}