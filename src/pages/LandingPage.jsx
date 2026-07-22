import React from 'react';
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
import FAQSection from '@/components/landing/FAQSection';
import ContactSection from '@/components/landing/ContactSection';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
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
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
}