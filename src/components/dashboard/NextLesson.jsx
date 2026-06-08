import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ALL_LESSONS = [
  { id: 'l1_1', title: 'Nikhilam Sutra', level: '🌱 Beginner', mins: 15, xp: 100 },
  { id: 'l1_2', title: 'Ekadhikena Purvena', level: '🌱 Beginner', mins: 12, xp: 100 },
  { id: 'l1_3', title: 'Urdhva Tiryagbhyam', level: '🌱 Beginner', mins: 18, xp: 120 },
  { id: 'l1_4', title: 'Paravartya Yojayet', level: '🌱 Beginner', mins: 20, xp: 130 },
  { id: 'l1_5', title: 'Anurupyena', level: '🌱 Beginner', mins: 15, xp: 100 },
  { id: 'l2_1', title: 'Vinculum Numbers', level: '📈 Intermediate', mins: 20, xp: 150 },
  { id: 'l2_2', title: 'Duplex Method', level: '📈 Intermediate', mins: 18, xp: 150 },
  { id: 'l3_1', title: 'Algebraic Division', level: '🔥 Advanced', mins: 25, xp: 200 },
  { id: 'l4_1', title: 'Speed Arithmetic', level: '👑 Master', mins: 30, xp: 250 },
];

export default function NextLesson({ progress }) {
  const completed = new Set(progress.completedLessons || []);
  const next = ALL_LESSONS.find((l) => !completed.has(l.id));
  const allDone = !next;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-[20px] p-6 border border-[#F0F4FF]"
      style={{ boxShadow: '0 4px 24px rgba(10,22,40,0.06)' }}
    >
      {allDone ? (
        <div className="text-center py-4">
          <span className="text-4xl block mb-3">🏆</span>
          <p className="font-heading text-base font-bold text-[#0A1628] mb-3">
            You've completed all lessons!
          </p>
          <Link
            to="/practice"
            className="inline-flex items-center justify-center w-full h-11 rounded-xl bg-[#0A1628] text-white font-semibold text-sm hover:bg-[#0D2252] transition-colors"
          >
            Try Practice Mode →
          </Link>
        </div>
      ) : (
        <>
          <p className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-2">📖 Up Next</p>
          <h3 className="font-heading text-xl font-bold text-[#0A1628] mb-3">{next.title}</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2.5 py-1 rounded-full bg-[#F0F4FF] text-[#0A1628] text-xs font-medium">{next.level}</span>
            <span className="px-2.5 py-1 rounded-full bg-[#F0F4FF] text-[#0A1628] text-xs font-medium">⏱ {next.mins} min</span>
            <span className="px-2.5 py-1 rounded-full bg-[#F0F4FF] text-[#0A1628] text-xs font-medium">⚡ +{next.xp} XP</span>
          </div>
          <Link
            to="/learn"
            className="flex items-center justify-center w-full h-11 rounded-xl bg-[#0A1628] text-white font-semibold text-sm hover:bg-[#0D2252] transition-colors"
          >
            Start Lesson →
          </Link>
        </>
      )}
    </motion.div>
  );
}