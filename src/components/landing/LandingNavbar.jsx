import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/lib/LanguageContext';

export default function LandingNavbar() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm' : 'bg-white/70 backdrop-blur-xl'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 min-w-0 flex-1 mr-2">
            <img src="/icons/icon-192.png" alt="VedicMindAI logo" className="w-8 h-8 rounded-lg flex-shrink-0" />
            <span className="font-heading text-lg sm:text-xl font-bold text-[#0A1628] truncate">
              VedicMindAI™
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 flex-shrink-0">
            <button onClick={() => scrollTo('about')} className="text-sm font-medium text-[#4B5563] hover:text-[#0A1628] transition-colors">
              {t('purposeNavLabel')}
            </button>
            <button onClick={() => scrollTo('features')} className="text-sm font-medium text-[#4B5563] hover:text-[#0A1628] transition-colors">
              {t('features')}
            </button>
            <Link to="/curriculum" className="text-sm font-medium text-[#4B5563] hover:text-[#0A1628] transition-colors">
              {t('curriculum')}
            </Link>
            <Link to="/reviews" className="text-sm font-medium text-[#4B5563] hover:text-[#0A1628] transition-colors">
              {t('reviews')}
            </Link>
            <button onClick={() => scrollTo('faq')} className="text-sm font-medium text-[#4B5563] hover:text-[#0A1628] transition-colors">
              {t('faqSectionLabel')}
            </button>
            <Link to="/demo" className="text-sm font-medium text-[#0A1628] border border-[#0A1628] rounded-xl px-4 py-1.5 hover:bg-[#0A1628] hover:text-white transition-colors" style={{ borderWidth: '1.5px' }}>
              {t('tryFreeDemo')}
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <LanguageToggle size="xs" />
            <Link
              to="/auth"
              className="hidden md:inline-flex items-center justify-center h-11 px-6 rounded-xl bg-[#0A1628] text-white text-sm font-semibold hover:bg-[#0D2252] transition-colors"
            >
              {t('signIn')}
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-[#0A1628]"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="flex items-center justify-between px-4 h-16">
              <span className="flex items-center gap-2">
                <img src="/icons/icon-192.png" alt="VedicMindAI logo" className="w-7 h-7 rounded-lg" />
                <span className="font-heading text-xl font-bold text-[#0A1628]">VedicMindAI™</span>
              </span>
              <button onClick={() => setMobileOpen(false)} className="p-2">
                <X className="w-6 h-6 text-[#0A1628]" />
              </button>
            </div>
            <div className="flex flex-col px-6 py-8 gap-2">
              <button onClick={() => scrollTo('about')} className="text-left py-4 text-lg font-medium text-[#0A1628] border-b border-[#F0F4FF]">{t('purposeNavLabel')}</button>
              <button onClick={() => scrollTo('features')} className="text-left py-4 text-lg font-medium text-[#0A1628] border-b border-[#F0F4FF]">{t('features')}</button>
              <Link to="/curriculum" onClick={() => setMobileOpen(false)} className="text-left py-4 text-lg font-medium text-[#0A1628] border-b border-[#F0F4FF]" style={{ textDecoration: 'none' }}>{t('curriculum')}</Link>
              <Link to="/reviews" onClick={() => setMobileOpen(false)} className="text-left py-4 text-lg font-medium text-[#0A1628] border-b border-[#F0F4FF]" style={{ textDecoration: 'none' }}>{t('reviews')}</Link>
              <button onClick={() => scrollTo('faq')} className="text-left py-4 text-lg font-medium text-[#0A1628] border-b border-[#F0F4FF]">{t('faqSectionLabel')}</button>
              <Link to="/demo" onClick={() => setMobileOpen(false)} className="text-left py-4 text-lg font-medium text-[#3B82F6] border-b border-[#F0F4FF]" style={{ textDecoration: 'none' }}>{t('tryFreeDemo')}</Link>
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="mt-6 flex items-center justify-center h-14 rounded-xl bg-[#0A1628] text-white text-base font-semibold"
                style={{ textDecoration: 'none' }}
              >
                {t('signIn')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}