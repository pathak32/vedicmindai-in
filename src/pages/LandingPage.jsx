import React from 'react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import TryItSection from '@/components/landing/TryItSection';
import PurposeSection from '@/components/landing/PurposeSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import FamiliesReviewsSection from '@/components/landing/FamiliesReviewsSection';
import ComparisonSection from '@/components/landing/ComparisonSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <HeroSection />
      <TryItSection />
      <PurposeSection />
      <FeaturesSection />
      <FamiliesReviewsSection />
      <ComparisonSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}