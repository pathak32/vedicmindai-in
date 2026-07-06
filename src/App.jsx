import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { VedicAuthProvider } from '@/lib/VedicAuthContext';
import { ProgressProvider } from '@/lib/ProgressContext';
import { ProfileProvider } from '@/lib/ProfileContext';
import ScrollToTop from '@/lib/ScrollToTop';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LanguageProvider } from "@/lib/LanguageContext";
import { Toaster } from "sonner";
import LandingPage from '@/pages/LandingPage';
import AuthPage from '@/pages/AuthPage';
import OnboardingPage from '@/pages/OnboardingPage';
import DashboardPage from '@/pages/DashboardPage';
import LearnPage from '@/pages/LearnPage';
import PracticePage from '@/pages/PracticePage';
import ProfilePage from '@/pages/ProfilePage';
import NotFoundPage from '@/pages/NotFoundPage';
import DemoPage from '@/pages/DemoPage';
import CurriculumPage from '@/pages/CurriculumPage';
import DailyQuizPage from '@/pages/DailyQuizPage';
import DailyQuizResultsPage from '@/pages/DailyQuizResultsPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import AptitudeZonePage from '@/pages/AptitudeZonePage';
import AdminPanel from '@/pages/AdminPanel';
import PricingPage from '@/pages/PricingPage';
import WeeklyExamPage from '@/pages/WeeklyExamPage';
import WeeklyExamResultsPage from '@/pages/WeeklyExamResultsPage';
import OlympiadPage from '@/pages/OlympiadPage';
import OlympiadResultsPage from '@/pages/OlympiadResultsPage';
import BattleModePage from '@/pages/BattleModePage';
import PaymentSuccessPage from '@/pages/PaymentSuccessPage';
import ReviewsPage from '@/pages/ReviewsPage';
import ScreenlessLearningPage from '@/pages/ScreenlessLearningPage';
import ReportCardPage from '@/pages/ReportCardPage';
import ForgotPassword from '@/pages/ForgotPassword';
import TermsPage from '@/pages/TermsPage';
import CollaboratePage from '@/pages/CollaboratePage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import MobileBottomNav from '@/components/MobileLayout';
import MobileAppHeader from '@/components/MobileAppHeader';

function DarkModeSync() {
  useEffect(() => {
    const apply = (e) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    apply(mq);
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return null;
}

const PERSISTENT_TABS = ['/learn', '/practice'];

function RouteTransition() {
  const location = useLocation();
  const isPersistentTab = PERSISTENT_TABS.includes(location.pathname);

  // Only mount a persistent tab's component once the user has actually
  // navigated to it at least once. Mounting them unconditionally on every
  // route (including the public landing page, before anyone is logged in)
  // caused their own auth guards to fire and redirect the whole app to
  // /auth a moment after any page loaded.
  const [visitedTabs, setVisitedTabs] = useState(() =>
    new Set(isPersistentTab ? [location.pathname] : [])
  );

  useEffect(() => {
    if (PERSISTENT_TABS.includes(location.pathname)) {
      setVisitedTabs(prev => (prev.has(location.pathname) ? prev : new Set(prev).add(location.pathname)));
    }
  }, [location.pathname]);

  return (
    <>
      {PERSISTENT_TABS.filter(path => visitedTabs.has(path)).map(path => (
        <div
          key={path}
          style={{ display: location.pathname === path ? 'block' : 'none' }}
          aria-hidden={location.pathname !== path}
        >
          {path === '/learn' && <LearnPage />}
          {path === '/practice' && <PracticePage />}
        </div>
      ))}

      {!isPersistentTab && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            style={{ width: '100%' }}
          >
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/curriculum" element={<CurriculumPage />} />
              <Route path="/daily-quiz" element={<DailyQuizPage />} />
              <Route path="/daily-quiz/results" element={<DailyQuizResultsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/aptitude" element={<AptitudeZonePage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/weekly-exam" element={<WeeklyExamPage />} />
              <Route path="/weekly-exam/results" element={<WeeklyExamResultsPage />} />
              <Route path="/olympiad" element={<OlympiadPage />} />
              <Route path="/olympiad/results" element={<OlympiadResultsPage />} />
              <Route path="/battle" element={<BattleModePage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/screenless" element={<ScreenlessLearningPage />} />
              <Route path="/report-card" element={<ReportCardPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/collaborate" element={<CollaboratePage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Toaster position="top-right" richColors closeButton />
      <VedicAuthProvider>
        <ProfileProvider>
          <ProgressProvider>
            <QueryClientProvider client={queryClientInstance}>
              <Router>
                <DarkModeSync />
                <ScrollToTop />
                <Routes>
                  <Route path="/admin-panel" element={<AdminPanel />} />
                  <Route path="*" element={
                    <>
                      <MobileAppHeader />
                      <MobileBottomNav />
                      <RouteTransition />
                    </>
                  } />
                </Routes>
              </Router>
            </QueryClientProvider>
          </ProgressProvider>
        </ProfileProvider>
      </VedicAuthProvider>
    </LanguageProvider>
  )
}

export default App
