import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const LOADING_MESSAGES = [
  'Analyzing your profile...',
  'Mapping your learning path...',
  'Calculating your starting level...',
  'Crafting your personalized curriculum...',
];

const DEFAULT_ANALYSIS = {
  greeting: "Welcome to VedicMind! We're thrilled to have you on this incredible learning journey through the ancient art of Vedic Mathematics.",
  whyVedicMaths: "Vedic Mathematics is a collection of techniques that make calculations lightning-fast and intuitive. These 2500-year-old sutras have been proven to improve mental agility, boost confidence, and dramatically speed up arithmetic — skills that help in every exam and career.",
  startingLevel: 'Beginner',
  startingLevelReason: 'We start everyone at the foundation to ensure strong conceptual clarity before advancing.',
  estimatedWeeks: 8,
  dailyLessons: 2,
  topFocusAreas: ['Fast Multiplication', 'Mental Addition', 'Speed Division'],
  firstLessonTitle: 'Introduction to Vedic Maths & The 16 Sutras',
  motivationalQuote: '"The mind is everything. What you think, you become." — Buddha',
  personalizedTip: 'Consistency beats intensity. Even 15 minutes of daily practice will compound into extraordinary skill over weeks.',
};

const LEVEL_COLORS = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-blue-100 text-blue-800',
  Advanced: 'bg-purple-100 text-purple-800',
};

export default function AIAnalysisScreen({ profile, onComplete }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Cycle loading messages
    const msgTimer = setInterval(() => {
      setMsgIdx(i => Math.min(i + 1, LOADING_MESSAGES.length - 1));
    }, 1500);

    // Fill progress bar over 5s
    const progressTimer = setInterval(() => {
      setProgress(p => Math.min(p + 2, 95));
    }, 100);

    let finished = false;

    const minDelay = new Promise(res => setTimeout(res, 3000));
    const apiCall = base44.functions.invoke('analyzeProfile', { profile })
      .then(res => res.data?.analysis || DEFAULT_ANALYSIS)
      .catch(() => DEFAULT_ANALYSIS);

    Promise.all([minDelay, apiCall]).then(([, result]) => {
      finished = true;
      clearInterval(msgTimer);
      clearInterval(progressTimer);
      setProgress(100);
      setTimeout(() => {
        setAnalysis(result);
        setLoading(false);
      }, 400);
    });

    return () => {
      clearInterval(msgTimer);
      clearInterval(progressTimer);
    };
  }, []);

  const handleBegin = () => {
    onComplete(analysis);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-7xl select-none"
        >
          🧠
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.p
            key={msgIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="font-heading text-xl font-semibold text-[#0A1628] text-center"
          >
            {LOADING_MESSAGES[msgIdx]}
          </motion.p>
        </AnimatePresence>

        <div className="w-full max-w-sm">
          <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#0A1628] rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5 pb-8"
    >
      <h2 className="font-heading text-3xl font-bold text-[#0A1628] leading-tight">
        {analysis.greeting}
      </h2>

      {/* Why section */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
        <h3 className="font-heading text-lg font-bold text-[#0A1628] mb-3">
          Why Vedic Maths is Perfect for You
        </h3>
        <p className="text-[#4B5563] leading-relaxed text-sm">{analysis.whyVedicMaths}</p>
      </div>

      {/* Level + weeks */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${LEVEL_COLORS[analysis.startingLevel] || LEVEL_COLORS.Beginner}`}>
          {analysis.startingLevel}
        </span>
        <span className="text-sm text-[#4B5563]">{analysis.startingLevelReason}</span>
      </div>

      <div className="text-sm text-[#0A1628] font-medium">
        📅 Ready in approximately <span className="font-bold">{analysis.estimatedWeeks} weeks</span> • {analysis.dailyLessons} lessons/day
      </div>

      {/* Focus areas */}
      <div>
        <p className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-2">Top Focus Areas</p>
        <div className="flex flex-wrap gap-2">
          {(analysis.topFocusAreas || []).map((area, i) => (
            <span key={i} className="px-3 py-1.5 rounded-xl bg-[#0A1628] text-white text-xs font-semibold">
              ⚡ {area}
            </span>
          ))}
        </div>
      </div>

      {/* First lesson */}
      <div className="bg-[#F8FAFF] rounded-2xl p-5 border border-[#E5E7EB]">
        <p className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1">Your First Lesson</p>
        <p className="font-heading text-base font-bold text-[#0A1628]">{analysis.firstLessonTitle}</p>
      </div>

      {/* Quote */}
      <blockquote className="border-l-4 border-[#0A1628] bg-[#F0F4FF] pl-5 pr-4 py-4 rounded-r-2xl">
        <p className="italic text-[#0A1628] text-sm leading-relaxed">{analysis.motivationalQuote}</p>
      </blockquote>

      {/* Tip */}
      <div className="bg-blue-50 rounded-2xl p-5 flex gap-3">
        <span className="text-xl">💡</span>
        <p className="text-sm text-[#1E40AF] leading-relaxed">{analysis.personalizedTip}</p>
      </div>

      {/* CTA */}
      <button
        onClick={handleBegin}
        className="w-full h-14 rounded-2xl bg-[#0A1628] text-white font-heading text-lg font-bold hover:bg-[#0D2252] transition-colors"
      >
        Begin My Journey →
      </button>
    </motion.div>
  );
}