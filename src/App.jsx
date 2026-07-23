import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { VedicAuthProvider } from '@/lib/VedicAuthContext';
import { ProgressProvider } from '@/lib/ProgressContext';
import { ProfileProvider } from '@/lib/ProfileContext';
import ScrollToTop from '@/lib/ScrollToTop';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, lazy, Suspense } from 'react';
import { LanguageProvider } from "@/lib/LanguageContext";
import { Toaster } from "sonner";
import ProfileCompletionGate from '@/components/ProfileCompletionGate';
import MobileBottomNav from '@/components/MobileLayout';
import MobileAppHeader from '@/components/MobileAppHeader';

// ---------------------------------------------------------------------------
// Lazy-loaded pages — each page's JS is only downloaded when first navigated to.
// This splits the single large bundle into per-route chunks, dramatically
// reducing the initial JS payload that was causing the 6 s mobile LCP.
// ---------------------------------------------------------------------------
const LandingPage            = lazy(() => import('@/pages/LandingPage'));
const BlogListPage           = lazy(() => import('@/pages/BlogListPage'));
const BlogPostPage           = lazy(() => import('@/pages/BlogPostPage'));
const ReasoningPilotPage     = lazy(() => import('@/pages/ReasoningPilotPage'));
const ReasoningChapterPage   = lazy(() => import('@/pages/reasoning/ReasoningChapterPage'));
const MyBattlesPage          = lazy(() => import('@/pages/MyBattlesPage'));
const AuthPage               = lazy(() => import('@/pages/AuthPage'));
const OnboardingPage         = lazy(() => import('@/pages/OnboardingPage'));
const DashboardPage          = lazy(() => import('@/pages/DashboardPage'));
const ParentDashboardPage    = lazy(() => import('@/pages/ParentDashboardPage'));
const LiveClassPage          = lazy(() => import('@/pages/LiveClassPage'));
const LifeSkillsHubPage      = lazy(() => import('@/pages/LifeSkillsHubPage'));
const KnowledgePointsPage    = lazy(() => import('@/pages/KnowledgePointsPage'));
const LifeSkillsTrackPage    = lazy(() => import('@/pages/LifeSkillsTrackPage'));
const LearnPage              = lazy(() => import('@/pages/LearnPage'));
const PracticePage           = lazy(() => import('@/pages/PracticePage'));
const ProfilePage            = lazy(() => import('@/pages/ProfilePage'));
const NotFoundPage           = lazy(() => import('@/pages/NotFoundPage'));
const DemoPage               = lazy(() => import('@/pages/DemoPage'));
const CurriculumPage         = lazy(() => import('@/pages/CurriculumPage'));
const DailyQuizPage          = lazy(() => import('@/pages/DailyQuizPage'));
const DailyQuizResultsPage   = lazy(() => import('@/pages/DailyQuizResultsPage'));
const LeaderboardPage        = lazy(() => import('@/pages/LeaderboardPage'));
const AptitudeZonePage       = lazy(() => import('@/pages/AptitudeZonePage'));
const AptitudeComingSoonPage = lazy(() => import('@/pages/AptitudeComingSoonPage'));
const AdminPanel             = lazy(() => import('@/pages/AdminPanel'));
const PricingPage            = lazy(() => import('@/pages/PricingPage'));
const WeeklyExamPage         = lazy(() => import('@/pages/WeeklyExamPage'));
const WeeklyExamResultsPage  = lazy(() => import('@/pages/WeeklyExamResultsPage'));
const OlympiadPage           = lazy(() => import('@/pages/OlympiadPage'));
const OlympiadResultsPage    = lazy(() => import('@/pages/OlympiadResultsPage'));
const BattleModePage         = lazy(() => import('@/pages/BattleModePage'));
const PaymentSuccessPage     = lazy(() => import('@/pages/PaymentSuccessPage'));
const ReviewsPage            = lazy(() => import('@/pages/ReviewsPage'));
const ScreenlessLearningPage = lazy(() => import('@/pages/ScreenlessLearningPage'));
const ReportCardPage         = lazy(() => import('@/pages/ReportCardPage'));
const ForgotPassword         = lazy(() => import('@/pages/ForgotPassword'));
const TermsPage              = lazy(() => import('@/pages/TermsPage'));
const PrivacyPolicy          = lazy(() => import('@/pages/PrivacyPolicy'));
const CollaboratePage        = lazy(() => import('@/pages/CollaboratePage'));
const ResetPasswordPage      = lazy(() => import('@/pages/ResetPasswordPage'));

// ---------------------------------------------------------------------------
// Minimal spinner shown while a lazy chunk is downloading (typically <300 ms
// on a real connection — just prevents a blank flash).
// ---------------------------------------------------------------------------
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: '3px solid rgba(139, 92, 246, 0.2)',
        borderTopColor: '#8b5cf6',
        borderRadius: '50%',
        animation: 'vm-spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes vm-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Syncs Tailwind dark-mode class with the OS preference
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// /learn and /practice stay mounted after first visit so tab-switching is
// instant. All other routes use AnimatePresence for the slide transition.
// ---------------------------------------------------------------------------
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
          <Suspense fallback={<PageLoader />}>
            {path === '/learn'    && <LearnPage />}
            {path === '/practice' && <PracticePage />}
          </Suspense>
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
            <Suspense fallback={<PageLoader />}>
              <Routes location={location}>
                <Route path="/"                    element={<LandingPage />} />
                <Route path="/blog"                element={<BlogListPage />} />
                <Route path="/blog/:slug"          element={<BlogPostPage />} />
                <Route path="/reasoning-pilot"     element={<ReasoningPilotPage />} />
                <Route path="/reasoning"           element={<ReasoningChapterPage />} />
                <Route path="/reasoning/:chapterId" element={<ReasoningChapterPage />} />
                <Route path="/my-battles"          element={<MyBattlesPage />} />
                <Route path="/auth"                element={<AuthPage />} />
                <Route path="/onboarding"          element={<OnboardingPage />} />
                <Route path="/dashboard"           element={<DashboardPage />} />
                <Route path="/progress-report"     element={<ParentDashboardPage />} />
                <Route path="/live-class/:classId" element={<LiveClassPage />} />
                <Route path="/life-skills"         element={<LifeSkillsHubPage />} />
                <Route path="/life-skills/:trackId" element={<LifeSkillsTrackPage />} />
                <Route path="/knowledge-points"    element={<KnowledgePointsPage />} />
                <Route path="/profile"             element={<ProfilePage />} />
                <Route path="/demo"                element={<DemoPage />} />
                <Route path="/curriculum"          element={<CurriculumPage />} />
                <Route path="/daily-quiz"          element={<ProfileCompletionGate><DailyQuizPage /></ProfileCompletionGate>} />
                <Route path="/daily-quiz/results"  element={<DailyQuizResultsPage />} />
                <Route path="/leaderboard"         element={<LeaderboardPage />} />
                <Route path="/aptitude"            element={<AptitudeComingSoonPage />} />
                <Route path="/pricing"             element={<PricingPage />} />
                <Route path="/weekly-exam"         element={<ProfileCompletionGate><WeeklyExamPage /></ProfileCompletionGate>} />
                <Route path="/weekly-exam/results" element={<WeeklyExamResultsPage />} />
                <Route path="/olympiad"            element={<ProfileCompletionGate><OlympiadPage /></ProfileCompletionGate>} />
                <Route path="/olympiad/results"    element={<OlympiadResultsPage />} />
                <Route path="/battle"              element={<ProfileCompletionGate><BattleModePage /></ProfileCompletionGate>} />
                <Route path="/payment-success"     element={<PaymentSuccessPage />} />
                <Route path="/reviews"             element={<ReviewsPage />} />
                <Route path="/screenless"          element={<ScreenlessLearningPage />} />
                <Route path="/report-card"         element={<ReportCardPage />} />
                <Route path="/forgot-password"     element={<ForgotPassword />} />
                <Route path="/terms"               element={<TermsPage />} />
                <Route path="/terms-of-service"    element={<TermsPage />} />
                <Route path="/privacy"             element={<PrivacyPolicy />} />
                <Route path="/privacy-policy"      element={<PrivacyPolicy />} />
                <Route path="/collaborate"         element={<CollaboratePage />} />
                <Route path="/reset-password"      element={<ResetPasswordPage />} />
                <Route path="*"                    element={<NotFoundPage />} />
              </Routes>
            </Suspense>
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
                  <Route path="/admin-panel" element={
                    <Suspense fallback={<PageLoader />}>
                      <AdminPanel />
                    </Suspense>
                  } />
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
