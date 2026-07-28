import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUserProfile, saveUserProgress } from '@/lib/supabaseDataService';
import { getSupabase } from '@/lib/supabaseClient';
import { AnimatePresence, motion } from 'framer-motion';

import Step1Role from '@/components/onboarding/Step1Role';
import Step2Details from '@/components/onboarding/Step2Details';
import Step3Preferences from '@/components/onboarding/Step3Preferences';
import Step4Goals from '@/components/onboarding/Step4Goals';
import LoadingScreen from '@/components/onboarding/LoadingScreen';
import ResultsCard from '@/components/onboarding/ResultsCard';
import { useLanguage } from '@/lib/LanguageContext';

const STEP_NAMES = ['Who Are You?', 'About You', 'Learning Preferences', 'Your Goals'];
const STEP_FILLS = ['25%', '50%', '75%', '100%'];

const slideVariants = {
  enterFromRight: { x: '100%', opacity: 0 },
  enterFromLeft:  { x: '-100%', opacity: 0 },
  center:         { x: 0, opacity: 1 },
  exitToLeft:     { x: '-100%', opacity: 0 },
  exitToRight:    { x: '100%', opacity: 0 },
};

export default function OnboardingPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [userName, setUserName] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [apiDone, setApiDone] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  const FALLBACK_ANALYSIS = {
    greeting: "Welcome to VedicMind! Your personalized Vedic Maths journey starts now.",
    whyVedicMaths: "Vedic Mathematics transforms the way you think about numbers. These ancient techniques will help you calculate faster, understand patterns deeper, and build lasting mathematical confidence.",
    startingLevel: "Beginner",
    startingLevelReason: "We recommend starting from the foundation to build strong Vedic Maths intuition.",
    estimatedWeeks: 8,
    dailyLessons: 2,
    topFocusAreas: ["Mental Multiplication", "Speed Addition", "Vedic Division"],
    firstLessonTitle: "Introduction to Vedic Mathematics",
    motivationalQuote: "Mathematics is not about numbers, equations, or algorithms — it is about understanding.",
    personalizedTip: "Practice each technique for 5 minutes daily before moving on. Consistency beats intensity."
  };

  const [onboardingData, setOnboardingData] = useState({
    role: '',
    grade: '',
    board: '',
    exam: '',
    examStage: '',
    purpose: '',
    age: '',
    gender: '',
    timeCommitment: '',
    learningStyle: '',
    language: 'English',
    goals: [],
    biggestChallenge: '',
  });

  useEffect(() => {
    const auth = localStorage.getItem('vedicmind_auth');
    if (!auth) {
      navigate('/auth');
      return;
    }
    // If onboarding already completed, skip to dashboard
    const profile = localStorage.getItem('vedicmind_profile');
    const progress = localStorage.getItem('vedicmind_progress');
    if (profile && progress) {
      navigate('/dashboard');
      return;
    }
    const parsed = JSON.parse(auth);
    setUserName(parsed.name || 'Learner');
  }, []);

  // Reveal ResultsCard 0.4s after API completes (progress bar jumps to 100% first)
  useEffect(() => {
    if (apiDone && apiResult) {
      const t = setTimeout(() => setAiAnalysis(apiResult), 400);
      return () => clearTimeout(t);
    }
  }, [apiDone, apiResult]);

  const update = (patch) => setOnboardingData(prev => ({ ...prev, ...patch }));

  const goNext = () => {
    setDirection(1);
    setStep(s => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  const handleStep3Next = () => {
    setDirection(1);
    setStep(4);
  };

  function safeParseJSON(text) {
    try {
      const cleaned = text
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.error('JSON parse failed:', e, 'Raw text:', text);
      return null;
    }
  }

  const callClaudeAPI = async (data) => {
    const auth = JSON.parse(localStorage.getItem('vedicmind_auth') || '{}');
    const response = await fetch('/api/personalize-onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, authName: auth.name }),
    });
    const result = await response.json();
    const parsed = safeParseJSON(result.content[0].text);
    if (!parsed) throw new Error('Failed to parse Claude response');
    return parsed;
  };

  const handleStep4Submit = () => {
    setShowLoading(true);
    callClaudeAPI(onboardingData)
      .then(analysis => {
        setApiResult(analysis);
      })
      .catch(err => {
        console.error('VedicMind AI Analysis failed:', err);
        setApiResult(FALLBACK_ANALYSIS);
      })
      .finally(() => {
        setApiDone(true);
      });
  };

  const handleStartJourney = () => {
    const auth = JSON.parse(localStorage.getItem('vedicmind_auth') || '{}');
    auth.isNewUser = false;
    // Ensure name is synced: prefer whatever name is already in auth
    const resolvedName = auth.name || userName || 'Student';
    auth.name = resolvedName;
    localStorage.setItem('vedicmind_auth', JSON.stringify(auth));

    const analysis = aiAnalysis || FALLBACK_ANALYSIS;
    const profileObject = {
      role: onboardingData.role,
      name: resolvedName,
      age: onboardingData.age,
      gender: onboardingData.gender,
      grade: onboardingData.grade || '',
      board: onboardingData.board || '',
      exam: onboardingData.exam || '',
      examStage: onboardingData.examStage || '',
      purpose: onboardingData.purpose || '',
      goals: onboardingData.goals,
      biggestChallenge: onboardingData.biggestChallenge,
      timeCommitment: onboardingData.timeCommitment,
      learningStyle: onboardingData.learningStyle,
      language: onboardingData.language,
      aiAnalysis: {
        greeting: analysis.greeting,
        whyVedicMaths: analysis.whyVedicMaths,
        startingLevel: analysis.startingLevel,
        startingLevelReason: analysis.startingLevelReason,
        estimatedWeeks: analysis.estimatedWeeks,
        dailyLessons: analysis.dailyLessons,
        topFocusAreas: analysis.topFocusAreas,
        firstLessonTitle: analysis.firstLessonTitle,
        motivationalQuote: analysis.motivationalQuote,
        personalizedTip: analysis.personalizedTip,
      },
    };
    localStorage.setItem('vedicmind_profile', JSON.stringify(profileObject));

    // Save profile to Supabase async
    (async () => {
      try {
        const supabase = await getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          await saveUserProfile(session.user.id, {
            name: profileObject.name,
            goal: Array.isArray(profileObject.goals) ? profileObject.goals.join(',') : (profileObject.goals || ''),
            class_group: 'class_a',
            subscription_status: 'trial',
            trial_start_date: new Date().toISOString(),
            ai_analysis: profileObject.aiAnalysis || {},
          });
        }
      } catch(e) { console.warn('Profile save failed:', e); }
    })();

    const freshProgress = {
      currentLevel: 1,
      currentLesson: 'l1_01',
      completedLessons: [],
      lessonScores: {},
      totalXP: 0,
      streak: 0,
      lastStudyDate: null,
      studyDates: [],
      badges: [],
      practiceHistory: [],
      dailyQuizHistory: [],
      aptitudeProgress: {},
      leaderboardOptOut: false,
    };
    localStorage.setItem('vedicmind_progress', JSON.stringify(freshProgress));

    // Save progress to Supabase async
    (async () => {
      try {
        const supabase = await getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) await saveUserProgress(session.user.id, freshProgress);
      } catch(e) { console.warn('Progress save failed:', e); }
    })();

    navigate('/dashboard');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: '100vh',
      padding: 'clamp(16px, 4vw, 40px) 16px',
      background: 'linear-gradient(135deg, #0A1628 0%, #0D2252 60%, #1E40AF 100%)',
      boxSizing: 'border-box',
      overflowX: 'hidden',
    }}>
      {/* Progress Bar */}
      <div style={{ width: '100%', maxWidth: 600, margin: '0 auto 8px auto', height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3 }}>
        <motion.div
          animate={{ width: STEP_FILLS[step - 1] }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{ height: '100%', background: '#3B82F6', borderRadius: '3px' }}
        />
      </div>
      <p style={{ width: '100%', maxWidth: 600, textAlign: 'center', marginBottom: 20, color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: 'var(--font-body)' }}>
        Step {Math.min(step, 4)} of 4 — {STEP_NAMES[Math.min(step, 4) - 1]}
      </p>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 600, margin: '0 auto', boxSizing: 'border-box' }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={direction > 0 ? 'enterFromRight' : 'enterFromLeft'}
              animate="center"
              exit={direction > 0 ? 'exitToLeft' : 'exitToRight'}
              variants={slideVariants}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 20,
                padding: 'clamp(20px, 5vw, 40px)',
                color: 'white',
                boxSizing: 'border-box',
                width: '100%',
              }}
            >
              {step === 1 && (
                <Step1Role
                  data={onboardingData}
                  userName={userName}
                  onUpdate={update}
                  onNext={goNext}
                />
              )}
              {step === 2 && (
                <Step2Details
                  data={onboardingData}
                  onUpdate={update}
                  onNext={goNext}
                  onBack={goBack}
                />
              )}
              {step === 3 && (
                <Step3Preferences
                  data={onboardingData}
                  onUpdate={update}
                  onNext={handleStep3Next}
                  onBack={goBack}
                />
              )}
              {step === 4 && !showLoading && (
                <Step4Goals
                  data={onboardingData}
                  onUpdate={update}
                  onSubmit={handleStep4Submit}
                  onBack={goBack}
                />
              )}
              {step === 4 && showLoading && !aiAnalysis && (
                <LoadingScreen apiDone={apiDone} />
              )}
              {step === 4 && showLoading && aiAnalysis && (
                <ResultsCard aiAnalysis={aiAnalysis} onStart={handleStartJourney} />
              )}
            </motion.div>
          </AnimatePresence>
      </div>
    </div>
  );
}