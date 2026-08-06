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
      {/* ── Brain vs AI — two-column challenge ── */}
      <div style={{ background: '#0A1628' }}>
        <div style={{ textAlign: 'center', padding: '48px 20px 0', background: 'linear-gradient(to bottom, #0A1628, #0D1E3D)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 30, padding: '6px 16px', marginBottom: 14 }}>
            <span style={{ fontSize: 14 }}>⚡</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', letterSpacing: '0.5px', textTransform: 'uppercase' }}>The Challenge</span>
          </div>
          <h2 style={{ fontSize: 'clamp(22px,4vw,34px)', fontWeight: 800, color: 'white', margin: '0 0 10px' }}>
            Brain vs AI — Who Solves It Faster?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', maxWidth: 500, margin: '0 auto' }}>
            Test your mental speed on the left. Then watch Vedic AI break down the same problem on the right.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          <MindCheckSection />
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
            <VedicAITutorWidget />
          </div>
        </div>
      </div>
      <PurposeSection />
      <FeaturesSection />
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