import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/lib/LanguageContext';

export default function LandingNavbar() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem('playBannerDismissed') === '1'
  );
  const dismissBanner = () => {
    setBannerDismissed(true);
    localStorage.setItem('playBannerDismissed', '1');
  };
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fixed: previously this only did document.getElementById(id) directly,
  // which silently did nothing on any page other than the homepage since
  // those section IDs only exist there. Now it navigates home first (with
  // the target section passed via router state) if we're elsewhere.
  const scrollTo = (id) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm' : 'bg-white/70 backdrop-blur-xl'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 min-w-0 flex-1 mr-2">
            <img src="/icons/icon-64.png" alt="VedicMindAI logo" className="w-8 h-8 rounded-lg flex-shrink-0" />
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
            <Link to="/blog" className="text-sm font-medium text-[#4B5563] hover:text-[#0A1628] transition-colors">
              {t('blogNavLabel')}
            </Link>
            <Link to="/demo" className="text-sm font-medium text-[#0A1628] border border-[#0A1628] rounded-xl px-4 py-1.5 hover:bg-[#0A1628] hover:text-white transition-colors" style={{ borderWidth: '1.5px' }}>
              {t('tryFreeDemo')}
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <LanguageToggle size="xs" />

            <a
              href="https://play.google.com/store/apps/details?id=in.vedicmindai.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 h-9 px-3 rounded-xl border border-[#0A1628]/20 hover:border-[#0A1628]/50 hover:bg-[#F0F4FF] transition-colors flex-shrink-0"
              title="Get VedicMindAI on Google Play"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.18 23.76c.3.17.64.24.99.2L14.9 12 11.1 8.2 3.18 23.76z" fill="#EA4335"/>
                <path d="M20.64 10.35l-2.86-1.64L14.9 12l2.88 2.89 2.86-1.64a1.7 1.7 0 000-2.9z" fill="#FBBC04"/>
                <path d="M3.18.24A1.7 1.7 0 001.5 2v20a1.7 1.7 0 001.68 1.76L14.9 12 3.18.24z" fill="#4285F4"/>
                <path d="M3.18 23.76L14.9 12 11.1 8.2 3.18.24 14.9 12 3.18 23.76z" fill="#34A853"/>
              </svg>
              <div className="flex flex-col leading-none">
                <span style={{fontSize:'8px',color:'#6B7280',letterSpacing:'0.3px',textTransform:'uppercase'}}>GET IT ON</span>
                <span style={{fontSize:'11px',fontWeight:'700',color:'#0A1628'}}>Google Play</span>
              </div>
            </a>
            <Link
              to="/auth"
              className="hidden md:inline-flex items-center justify-center h-11 px-6 rounded-xl bg-[#0A1628] text-white text-sm font-semibold hover:bg-[#0D2252] transition-colors"
            >
              {t('signIn')}
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-[#0A1628]"
              aria-label="Open menu"
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
                <img src="/icons/icon-64.png" alt="VedicMindAI logo" className="w-7 h-7 rounded-lg" />
                <span className="font-heading text-xl font-bold text-[#0A1628]">VedicMindAI™</span>
              </span>
              <button onClick={() => setMobileOpen(false)} className="p-2" aria-label="Close menu">
                <X className="w-6 h-6 text-[#0A1628]" />
              </button>
            </div>
            <div className="flex flex-col px-6 py-8 gap-2">
              <button onClick={() => scrollTo('about')} className="text-left py-4 text-lg font-medium text-[#0A1628] border-b border-[#F0F4FF]">{t('purposeNavLabel')}</button>
              <button onClick={() => scrollTo('features')} className="text-left py-4 text-lg font-medium text-[#0A1628] border-b border-[#F0F4FF]">{t('features')}</button>
              <Link to="/curriculum" onClick={() => setMobileOpen(false)} className="text-left py-4 text-lg font-medium text-[#0A1628] border-b border-[#F0F4FF]" style={{ textDecoration: 'none' }}>{t('curriculum')}</Link>
              <Link to="/reviews" onClick={() => setMobileOpen(false)} className="text-left py-4 text-lg font-medium text-[#0A1628] border-b border-[#F0F4FF]" style={{ textDecoration: 'none' }}>{t('reviews')}</Link>
              <button onClick={() => scrollTo('faq')} className="text-left py-4 text-lg font-medium text-[#0A1628] border-b border-[#F0F4FF]">{t('faqSectionLabel')}</button>
              <Link to="/blog" onClick={() => setMobileOpen(false)} className="text-left py-4 text-lg font-medium text-[#0A1628] border-b border-[#F0F4FF]" style={{ textDecoration: 'none' }}>{t('blogNavLabel')}</Link>
              <Link to="/about" onClick={() => setMobileOpen(false)} className="text-left py-4 text-lg font-medium text-[#0A1628] border-b border-[#F0F4FF]" style={{ textDecoration: 'none' }}>About</Link>
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

      {/* Mobile sticky Play Store banner — patch-navbar-applied */}
      {!bannerDismissed && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[90] bg-white border-t border-[#E5E7EB] shadow-lg px-4 py-3 flex items-center gap-3">
          <img src="/icons/icon-64.png" alt="VedicMindAI" className="w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div style={{fontSize:'13px',fontWeight:'700',color:'#0A1628'}}>Learn 10× faster on the App</div>
            <div style={{fontSize:'11px',color:'#6B7280'}}>Free download · Vedic Maths + Reasoning</div>
          </div>
          <a
            href="https://play.google.com/store/apps/details?id=in.vedicmindai.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 h-9 px-4 rounded-xl bg-[#0A1628] text-white flex items-center"
            style={{fontSize:'13px',fontWeight:'700',textDecoration:'none'}}
          >
            Install
          </a>
          <button
            onClick={dismissBanner}
            className="flex-shrink-0 p-1 text-[#9CA3AF] hover:text-[#374151]"
            aria-label="Dismiss"
            style={{fontSize:'18px',lineHeight:1}}
          >×</button>
        </div>
      )}
  );
}