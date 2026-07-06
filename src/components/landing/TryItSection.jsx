import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const QUESTIONS = [
  {
    calc: '98 × 97',
    options: ['9406', '9506', '9606'],
    answer: '9506',
    sutra: 'Nikhilam Sutra',
  },
  {
    calc: '75²',
    options: ['5625', '5525', '5725'],
    answer: '5625',
    sutra: 'Ekadhikena Purvena',
  },
  {
    calc: '123 × 11',
    options: ['1353', '1343', '1453'],
    answer: '1353',
    sutra: 'Ekanyunena Purvena',
  },
];

export default function TryItSection() {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[step];

  const handlePick = (opt) => {
    if (selected) return;
    setSelected(opt);
    setTimeout(() => {
      if (step < QUESTIONS.length - 1) {
        setStep((s) => s + 1);
        setSelected(null);
      } else {
        setDone(true);
      }
    }, 1100);
  };

  const isCorrect = selected === q?.answer;

  return (
    <section className="py-24 bg-gradient-to-br from-[#0A1628] via-[#0D2252] to-[#0A1628] relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <p className="text-sm font-semibold text-[#93C5FD] uppercase tracking-wider mb-3">
          {t('tryItEyebrow')}
        </p>
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
          {t('tryItHeading')}
        </h2>
        <p className="text-blue-200 mb-10">{t('tryItSubheading')}</p>

        <div className="glass-card mx-auto max-w-md p-8" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-xs text-blue-300 mb-2">{q.sutra}</p>
                <p className="font-mono text-4xl font-bold text-white mb-8">{q.calc} = ?</p>
                <div className="grid grid-cols-3 gap-3">
                  {q.options.map((opt) => {
                    const showState = selected !== null;
                    const isThisCorrect = opt === q.answer;
                    const isThisSelected = opt === selected;
                    let bg = 'rgba(255,255,255,0.1)';
                    if (showState && isThisCorrect) bg = 'rgba(16,185,129,0.9)';
                    else if (showState && isThisSelected && !isThisCorrect) bg = 'rgba(239,68,68,0.9)';
                    return (
                      <button
                        key={opt}
                        onClick={() => handlePick(opt)}
                        disabled={showState}
                        className="rounded-xl py-4 font-mono text-lg font-semibold text-white transition-colors"
                        style={{ background: bg, border: '1px solid rgba(255,255,255,0.2)' }}
                      >
                        {opt}
                        {showState && isThisCorrect && <Check className="inline w-4 h-4 ml-1.5" />}
                        {showState && isThisSelected && !isThisCorrect && <X className="inline w-4 h-4 ml-1.5" />}
                      </button>
                    );
                  })}
                </div>
                {selected && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-5 text-sm font-medium"
                    style={{ color: isCorrect ? '#6EE7B7' : '#FCA5A5' }}
                  >
                    {isCorrect ? t('tryItCorrect') : `${t('tryItWrong')} ${q.answer}`}
                  </motion.p>
                )}
                <div className="flex justify-center gap-2 mt-8">
                  {QUESTIONS.map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ background: i <= step ? '#3B82F6' : 'rgba(255,255,255,0.2)' }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Sparkles className="w-10 h-10 text-[#3B82F6] mx-auto mb-4" />
                <p className="text-xl font-bold text-white mb-2">{t('tryItDoneHeading')}</p>
                <p className="text-blue-200 mb-6">{t('tryItDoneSubheading')}</p>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 h-12 px-7 rounded-xl bg-[#3B82F6] text-white font-semibold hover:bg-[#2563EB] transition-colors"
                >
                  {t('tryItCta')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
