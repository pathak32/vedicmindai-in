import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingNavbar() {
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
        scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="font-heading text-xl font-bold text-[#0A1628]">
            VedicMind
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('features')} className="text-sm font-medium text-[#4B5563] hover:text-[#0A1628] transition-colors">
              Features
            </button>
            <Link to="/curriculum" className="text-sm font-medium text-[#4B5563] hover:text-[#0A1628] transition-colors">
              Curriculum
            </Link>
            <Link to="/reviews" className="text-sm font-medium text-[#4B5563] hover:text-[#0A1628] transition-colors">
              Reviews
            </Link>
            <Link to="/demo" className="text-sm font-medium text-[#0A1628] border border-[#0A1628] rounded-xl px-4 py-1.5 hover:bg-[#0A1628] hover:text-white transition-colors" style={{ borderWidth: '1.5px' }}>
              Try Free Demo
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="hidden md:inline-flex items-center justify-center h-11 px-6 rounded-xl bg-[#0A1628] text-white text-sm font-semibold hover:bg-[#0D2252] transition-colors"
            >
              Sign In
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
              <span className="font-heading text-xl font-bold text-[#0A1628]">VedicMind</span>
              <button onClick={() => setMobileOpen(false)} className="p-2">
                <X className="w-6 h-6 text-[#0A1628]" />
              </button>
            </div>
            <div className="flex flex-col px-6 py-8 gap-2">
              <button onClick={() => scrollTo('features')} className="text-left py-4 text-lg font-medium text-[#0A1628] border-b border-[#F0F4FF]">Features</button>
              <Link to="/curriculum" onClick={() => setMobileOpen(false)} className="text-left py-4 text-lg font-medium text-[#0A1628] border-b border-[#F0F4FF]" style={{ textDecoration: 'none' }}>Curriculum</Link>
              <Link to="/reviews" onClick={() => setMobileOpen(false)} className="text-left py-4 text-lg font-medium text-[#0A1628] border-b border-[#F0F4FF]" style={{ textDecoration: 'none' }}>Reviews</Link>
              <Link to="/demo" onClick={() => setMobileOpen(false)} className="text-left py-4 text-lg font-medium text-[#3B82F6] border-b border-[#F0F4FF]" style={{ textDecoration: 'none' }}>Try Free Demo</Link>
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="mt-6 flex items-center justify-center h-14 rounded-xl bg-[#0A1628] text-white text-base font-semibold"
                style={{ textDecoration: 'none' }}
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}