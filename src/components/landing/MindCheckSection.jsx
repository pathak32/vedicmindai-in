import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { MIND_CHECK_QUESTIONS, shuffleArray } from '@/data/mindCheckQuestions';

const ROUND_SIZE = 3;
const TIMER_SECONDS = 5;

const CATEGORY_LABEL = {
  sutra: 'Vedic Maths',
  aptitude: 'Aptitude',
  reasoning: 'Reasoning',
};

const CATEGORY_COLOR = {
  sutra: '#3B82F6',
  aptitude: '#F59E0B',
  reasoning: '#10B981',
};

export default function MindCheckSection() {
  const { t } = useLanguage();

  // 'intro' | 'active' | 'roundEnd'
  const [phase, setPhase] = useState('intro');
  const [queue, setQueue] = useState([]); // remaining question ids, shuffled
  const [round, setRound] = useState([]); // current 3 questions
  const [qIndex, setQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('active'); // active | correct | wrong | timeout
  const [roundScore, setRoundScore] = useState(0);
  const timerRef = useRef(null);

  const currentQ = round[qIndex];

  const drawRound = useCallback((sourceQueue) => {
    let q = sourceQueue;
    if (q.length < ROUND_SIZE) {
      q = [...q, ...shuffleArray(MIND_CHECK_QUESTIONS.map((x) => x.id))];
    }
    const picked = q.slice(0, ROUND_SIZE);
    const rest = q.slice(ROUND_SIZE);
    setQueue(rest);
    setRound(picked.map((id) => MIND_CHECK_QUESTIONS.find((x) => x.id === id)));
    setQIndex(0);
    setRoundScore(0);
  }, []);

  const startChallenge = () => {
    const initial = shuffleArray(MIND_CHECK_QUESTIONS.map((x) => x.id));
    drawRound(initial);
    setPhase('active');
    setStatus('active');
    setSelected(null);
    setTimeLeft(TIMER_SECONDS);
  };

  // Countdown effect — runs whenever a fresh question is active
  useEffect(() => {
    if (phase !== 'active' || status !== 'active') return undefined;
    if (timeLeft <= 0) {
      setStatus('timeout');
      return undefined;
    }
    timerRef.current = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [phase, status, timeLeft]);

  const goNext = useCallback(() => {
    if (qIndex < ROUND_SIZE - 1) {
      setQIndex((i) => i + 1);
      setSelected(null);
      setStatus('active');
      setTimeLeft(TIMER_SECONDS);
    } else {
      setPhase('roundEnd');
    }
  }, [qIndex]);

  // Auto-advance after showing feedback
  useEffect(() => {
    if (status === 'correct' || status === 'wrong' || status === 'timeout') {
      const t2 = setTimeout(goNext, 1600);
      return () => clearTimeout(t2);
    }
    return undefined;
  }, [status, goNext]);

  const handlePick = (opt) => {
    if (status !== 'active') return;
    clearTimeout(timerRef.current);
    setSelected(opt);
    const correct = opt === currentQ.answer;
    if (correct) setRoundScore((s) => s + 1);
    setStatus(correct ? 'correct' : 'wrong');
  };

  const handleTryMore = () => {
    drawRound(queue);
    setPhase('active');
    setStatus('active');
    setSelected(null);
    setTimeLeft(TIMER_SECONDS);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-[#0A1628] via-[#0D2252] to-[#0A1628] relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <p className="text-sm font-semibold text-[#93C5FD] uppercase tracking-wider mb-3">
          {t('mindCheckEyebrow')}
        </p>
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
          {t('mindCheckHeading')}
        </h2>
        <p className="text-blue-200 mb-10">{t('mindCheckSubheading')}</p>

        <div
          className="glass-card mx-auto max-w-md p-8"
          style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.15)', minHeight: 320 }}
        >
          <AnimatePresence mode="wait">
            {phase === 'intro' && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Clock className="w-10 h-10 text-[#3B82F6] mx-auto mb-4" />
                <p className="text-xl font-bold text-white mb-2">{t('mindCheckIntroTitle')}</p>
                <p className="text-blue-200 mb-8">{t('mindCheckIntroDesc')}</p>
                <button
                  onClick={startChallenge}
                  className="inline-flex items-center gap-2 h-12 px-7 rounded-xl bg-[#3B82F6] text-white font-semibold hover:bg-[#2563EB] transition-colors"
                >
                  {t('mindCheckStart')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {phase === 'active' && currentQ && (
              <motion.div
                key={`${currentQ.id}-${qIndex}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: `${CATEGORY_COLOR[currentQ.category]}22`, color: CATEGORY_COLOR[currentQ.category] }}
                  >
                    {CATEGORY_LABEL[currentQ.category]} · {currentQ.tag}
                  </span>
                  <span
                    className="font-mono text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      color: timeLeft <= 2 ? '#FCA5A5' : '#93C5FD',
                      border: `2px solid ${timeLeft <= 2 ? '#FCA5A5' : '#3B82F6'}`,
                    }}
                  >
                    {status === 'active' ? timeLeft : '⏱'}
                  </span>
                </div>

                <p className="font-mono text-2xl sm:text-3xl font-bold text-white mb-8 leading-snug">
                  {currentQ.prompt}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentQ.options.map((opt) => {
                    const showState = status !== 'active';
                    const isThisCorrect = opt === currentQ.answer;
                    const isThisSelected = opt === selected;
                    let bg = 'rgba(255,255,255,0.1)';
                    if (showState && isThisCorrect) bg = 'rgba(16,185,129,0.9)';
                    else if (showState && isThisSelected && !isThisCorrect) bg = 'rgba(239,68,68,0.9)';
                    return (
                      <button
                        key={opt}
                        onClick={() => handlePick(opt)}
                        disabled={showState}
                        className="rounded-xl py-3.5 font-mono text-base font-semibold text-white transition-colors"
                        style={{ background: bg, border: '1px solid rgba(255,255,255,0.2)' }}
                      >
                        {opt}
                        {showState && isThisCorrect && <Check className="inline w-4 h-4 ml-1.5" />}
                        {showState && isThisSelected && !isThisCorrect && <X className="inline w-4 h-4 ml-1.5" />}
                      </button>
                    );
                  })}
                </div>

                {status !== 'active' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-5 text-sm font-medium"
                    style={{ color: status === 'correct' ? '#6EE7B7' : '#FCA5A5' }}
                  >
                    {status === 'correct'
                      ? t('mindCheckCorrect')
                      : status === 'timeout'
                      ? `${t('mindCheckTimeout')} ${currentQ.answer}`
                      : `${t('mindCheckWrong')} ${currentQ.answer}`}
                  </motion.p>
                )}

                <div className="flex justify-center gap-2 mt-8">
                  {round.map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full" style={{ background: i <= qIndex ? '#3B82F6' : 'rgba(255,255,255,0.2)' }} />
                  ))}
                </div>
              </motion.div>
            )}

            {phase === 'roundEnd' && (
              <motion.div key="end" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                <Sparkles className="w-10 h-10 text-[#3B82F6] mx-auto mb-4" />
                <p className="text-xl font-bold text-white mb-2">
                  {roundScore}/{ROUND_SIZE} {t('mindCheckScoreLabel')}
                </p>
                <p className="text-blue-200 mb-8">{t('mindCheckEndDesc')}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleTryMore}
                    className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl border-[1.5px] border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
                  >
                    {t('mindCheckTryMore')}
                  </button>
                  <Link
                    to="/auth"
                    className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-[#3B82F6] text-white font-semibold hover:bg-[#2563EB] transition-colors"
                  >
                    {t('tryItCta')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
