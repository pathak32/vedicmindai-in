import React, { useEffect, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import MindCheckSection from '@/components/landing/MindCheckSection';
import SitePopup from '@/components/landing/SitePopup';
import PurposeSection from '@/components/landing/PurposeSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import VedicAITutorWidget from '@/components/landing/VedicAITutorWidget';

// Below-the-fold sections — lazy loaded so the hero and first
// sections render immediately without waiting for the full bundle
const FamiliesReviewsSection  = lazy(() => import('@/components/landing/FamiliesReviewsSection'));
const ComparisonSection       = lazy(() => import('@/components/landing/ComparisonSection'));
const FeaturesShowcaseSection = lazy(() => import('@/components/landing/FeaturesShowcaseSection'));
const VideoLibrarySection     = lazy(() => import('@/components/landing/VideoLibrarySection'));
const HowItWorksSection       = lazy(() => import('@/components/landing/HowItWorksSection'));
const TestimonialsSection     = lazy(() => import('@/components/landing/TestimonialsSection'));
const CommunitySection        = lazy(() => import('@/components/landing/CommunitySection'));
const BlogTeaserSection       = lazy(() => import('@/components/landing/BlogTeaserSection'));
const FAQSection              = lazy(() => import('@/components/landing/FAQSection'));
const SchoolCTASection        = lazy(() => import('@/components/landing/SchoolCTASection'));
const ContactSection          = lazy(() => import('@/components/landing/ContactSection'));
const Footer                  = lazy(() => import('@/components/landing/Footer'));

export default function LandingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Handles arrival from LandingNavbar's scrollTo() when the click happened
  // on a different page (e.g. Curriculum) — it navigates here with the
  // target section id in router state, and this scrolls to it once the
  // page has actually rendered.
  useEffect(() => {
    const targetId = location.state?.scrollTo;
    if (targetId) {
      const timer = setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        navigate(location.pathname, { replace: true, state: {} });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen">
      <SitePopup />
      <LandingNavbar />
      <HeroSection />
      <MindCheckSection />
      <PurposeSection />
      <FeaturesSection />
      <VedicAITutorWidget />
      <Suspense fallback={null}>
        <FamiliesReviewsSection />
        <ComparisonSection />
        <FeaturesShowcaseSection />
        <VideoLibrarySection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CommunitySection />
        <BlogTeaserSection />
        <FAQSection />
        <SchoolCTASection />
        <ContactSection />
        <Footer />
      </Suspense>
    </div>
  );
}