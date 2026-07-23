import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import MindCheckSection from '@/components/landing/MindCheckSection';
import PurposeSection from '@/components/landing/PurposeSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import FamiliesReviewsSection from '@/components/landing/FamiliesReviewsSection';
import ComparisonSection from '@/components/landing/ComparisonSection';
import FeaturesShowcaseSection from '@/components/landing/FeaturesShowcaseSection';
import VideoLibrarySection from '@/components/landing/VideoLibrarySection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CommunitySection from '@/components/landing/CommunitySection';
import BlogTeaserSection from '@/components/landing/BlogTeaserSection';
import FAQSection from '@/components/landing/FAQSection';
import ContactSection from '@/components/landing/ContactSection';
import Footer from '@/components/landing/Footer';

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
      <LandingNavbar />
      <HeroSection />
      <MindCheckSection />
      <PurposeSection />
      <FeaturesSection />
      <FamiliesReviewsSection />
      <ComparisonSection />
      <FeaturesShowcaseSection />
      <VideoLibrarySection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CommunitySection />
      <BlogTeaserSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
}