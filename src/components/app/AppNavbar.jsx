import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, ChevronDown, User, LogOut } from 'lucide-react';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { useProgress } from '@/lib/ProgressContext';
import { AnimatePresence, motion } from 'framer-motion';

const navLinks = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Learn', path: '/learn' },
  { label: 'Practice', path: '/practice' },
];

export default function AppNavbar() {
  const { user, signOut } = useVedicAuth();
  const { progress } = useProgress();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[rgba(30,64,175,0.08)] h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Link to="/dashboard" className="font-heading text-xl font-bold text-[#0A1628]">
            VedicMind
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors relative ${
                  location.pathname === link.path
                    ? 'text-[#0A1628]'
                    : 'text-[#4B5563] hover:text-[#0A1628]'
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#0A1628] rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F0F4FF] text-[#0A1628]">
              <Zap className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span className="text-xs font-bold font-mono">{progress.totalXP} XP</span>
            </div>

            {/* Avatar dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-9 h-9 rounded-full bg-[#0A1628] text-white text-xs font-bold flex items-center justify-center hover:bg-[#0D2252] transition-colors"
              >
                {initials}
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-12 w-48 glass-card p-2 z-50"
                    style={{ background: 'white' }}
                  >
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#0A1628] rounded-lg hover:bg-[#F0F4FF] transition-colors"
                    >
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-[#EF4444] rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 text-[#0A1628]">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="flex items-center justify-between px-4 h-16 border-b border-[#F0F4FF]">
              <span className="font-heading text-xl font-bold text-[#0A1628]">VedicMind</span>
              <button onClick={() => setMobileOpen(false)} className="p-2">
                <X className="w-6 h-6 text-[#0A1628]" />
              </button>
            </div>
            <div className="flex flex-col px-6 py-6 gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`py-4 text-lg font-medium border-b border-[#F0F4FF] ${
                    location.pathname === link.path ? 'text-[#0A1628]' : 'text-[#4B5563]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="py-4 text-lg font-medium border-b border-[#F0F4FF] text-[#4B5563]"
              >
                Profile
              </Link>
              <button
                onClick={() => { setMobileOpen(false); handleSignOut(); }}
                className="py-4 text-lg font-medium text-[#EF4444] text-left"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}