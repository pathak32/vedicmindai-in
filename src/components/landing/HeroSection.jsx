import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import FloatingMathBackground from './FloatingMathBackground';

const tricks = [
  { calc: '98 × 97 = 9506', label: 'Nikhilam Method — 3 seconds' },
  { calc: '75² = 5625', label: 'Ekadhikena — instantly' },
  { calc: '√5329 = 73', label: 'Pattern Method — 2 seconds' },
];

export default function HeroSection() {
  const { t } = useLanguage();
  const [currentTrick, setCurrentTrick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrick(prev => (prev + 1) % tricks.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0D2252] to-[#0A1628]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1E40AF]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#3B82F6]/15 rounded-full blur-3xl" />
      </div>
      <FloatingMathBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[56px] font-bold text-white leading-tight">
              {t('heroHeading')}
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px,2.5vw,18px)', color: '#CBD5E1', marginTop: 12, lineHeight: 1.6, maxWidth: 560 }}>
              {t('heroSubtitle')}
            </p>
            <p className="mt-6 text-lg sm:text-xl text-blue-200 font-body leading-relaxed max-w-lg">
              {t('heroDesc')}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 h-12 px-7 rounded-xl bg-[#3B82F6] text-white font-semibold hover:bg-[#2563EB] transition-colors"
              >
                {t('startLearningFree')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://play.google.com/store/apps/details?id=in.vedicmindai.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-12 px-5 rounded-xl border-[1.5px] border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
                style={{ textDecoration: 'none' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.82a1.5 1.5 0 0 0 2.07.56l11.04-6.38-2.9-2.9-10.21 8.72zm17.04-12.74L17.5 9.36 14.6 12.25l2.9 2.9 2.72-1.57a1.5 1.5 0 0 0 0-2.6zM2.5.56A1.5 1.5 0 0 0 .5 2v20a1.5 1.5 0 0 0 2 1.44V.5a1.5 1.5 0 0 0 0-.07zM5.25.62L16.17 7 13.27 9.9 2.87.93 5.25.62z"/></svg>
                {t('downloadOnAndroid')}
              </a>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 h-12 px-7 rounded-xl border-[1.5px] border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                {t('seeHowItWorks')}
              </button>
            </div>

            <div className="mt-12 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['P', 'R', 'A', 'S'].map((letter, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-[#1E40AF] border-2 border-[#0A1628] flex items-center justify-center text-white text-xs font-bold">
                    {letter}
                  </div>
                ))}
              </div>
              <p className="text-sm text-blue-200">
                Trusted by <span className="text-white font-semibold">1,000+</span> students across CBSE, ICSE, UP Board &amp; State Boards
              </p>
            </div>
          </motion.div>

          {/* Right - floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex flex-col items-center justify-center relative"
          >
            <div className="relative w-full max-w-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTrick}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="glass-card p-8 text-center"
                  style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  <p className="font-mono text-3xl font-bold text-white tracking-wide">
                    {tricks[currentTrick].calc}
                  </p>
                  <p className="mt-3 text-sm text-blue-200 font-body">
                    {tricks[currentTrick].label}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Decorative dots */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-[#3B82F6]/20 rounded-full animate-float" />
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-[#1E40AF]/20 rounded-full animate-float-delayed" />
            </div>

            {/* Small trick previews */}
            <div className="flex gap-3 mt-6">
              {tricks.map((trick, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTrick(i)}
                  aria-label={`Show trick: ${trick.label}`}
                  aria-current={i === currentTrick ? 'true' : undefined}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentTrick ? 'bg-[#3B82F6] scale-125' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="w-6 h-6 text-white/40" />
      </motion.div>
    </section>
  );
}