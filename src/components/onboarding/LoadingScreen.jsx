import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  'Understanding your learning style...',
  'Calculating your optimal starting level...',
  'Personalizing your 40-lesson curriculum...',
  'Generating your AI learning plan...',
];

const STEP_DELAYS = [300, 1100, 1900, 2700]; // ms when each lights up

export default function LoadingScreen({ apiDone }) {
  const [activeStep, setActiveStep] = useState(-1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timers = STEP_DELAYS.map((delay, i) =>
      setTimeout(() => setActiveStep(i), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Animate progress bar 0 → 85% over 3.2s
  useEffect(() => {
    const start = Date.now();
    const duration = 3200;
    const target = 85;
    const frame = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * target, target);
      setProgress(pct);
      if (pct < target) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, []);

  // Jump to 100% when API done
  useEffect(() => {
    if (apiDone) setProgress(100);
  }, [apiDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ textAlign: 'center', padding: '16px 0' }}
    >
      {/* Brain pulse */}
      <motion.span
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        style={{ fontSize: 64, display: 'block', lineHeight: 1 }}
      >
        🧠
      </motion.span>

      <h2 className="font-heading" style={{ fontSize: 24, fontWeight: 700, color: 'white', marginTop: 16, textAlign: 'center' }}>
        Analyzing your profile...
      </h2>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 32 }}>
        Your personalized Vedic Maths plan is being crafted
      </p>

      {/* Loading steps */}
      <div style={{ textAlign: 'left', padding: '0 8px' }}>
        {STEPS.map((text, i) => {
          const isActive = activeStep === i;
          const isDone = activeStep > i;
          return (
            <motion.div
              key={i}
              animate={{
                opacity: activeStep >= i ? 1 : 0.3,
              }}
              transition={{ duration: 0.4 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 14,
                fontSize: 14,
                fontFamily: 'var(--font-body)',
                color: isDone ? '#10B981' : 'white',
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0, transition: 'color 0.3s' }}>
                {isDone ? '✓' : '✦'}
              </span>
              <span>{text}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 28, background: 'rgba(255,255,255,0.1)', borderRadius: 100, height: 6, overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
          style={{ height: '100%', background: '#3B82F6', borderRadius: 100 }}
        />
      </div>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 10, textAlign: 'center' }}>
        This usually takes 5–10 seconds
      </p>
    </motion.div>
  );
}