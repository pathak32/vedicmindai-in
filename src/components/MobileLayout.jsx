import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TABS = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/learn',     label: 'Learn',      icon: '📖' },
  { path: '/practice',  label: 'Practice',   icon: '⚡' },
  { path: '/leaderboard', label: 'Ranks',    icon: '🏆' },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Only show on tab pages
  const showNav = TABS.some(t => location.pathname === t.path);
  if (!showNav) return null;

  return (
    <>
      {/* Spacer so page content isn't hidden behind the nav */}
      <div
        style={{ height: 'calc(60px + env(safe-area-inset-bottom, 0px))' }}
        className="mobile-bottom-nav-spacer"
      />

      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(30,64,175,0.12)',
          // Correct Android gesture-bar clearance
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          boxShadow: '0 -2px 12px rgba(10,22,40,0.08)',
          display: 'none', // shown via CSS media query below
        }}
        className="mobile-bottom-nav"
      >
        <div style={{ display: 'flex', height: 60 }}>
          {TABS.map(tab => {
            const active = location.pathname === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  // Full 60px hit target (inherits nav height)
                  minHeight: 60,
                  padding: '6px 0',
                  position: 'relative',
                  userSelect: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                }}
                aria-label={tab.label}
                aria-current={active ? 'page' : undefined}
              >
                <span style={{ fontSize: 20, lineHeight: 1 }}>{tab.icon}</span>
                <span style={{
                  fontSize: 10,
                  fontFamily: 'var(--font-body)',
                  fontWeight: active ? 700 : 400,
                  color: active ? '#3B82F6' : '#6B7280',
                  letterSpacing: '0.02em',
                }}>
                  {tab.label}
                </span>
                {active && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 32,
                    height: 3,
                    borderRadius: '0 0 4px 4px',
                    background: '#3B82F6',
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <style>{`
        @media (max-width: 1023px) {
          .mobile-bottom-nav { display: block !important; }
          .mobile-bottom-nav-spacer { display: block !important; }
        }
        @media (min-width: 1024px) {
          .mobile-bottom-nav-spacer { display: none !important; }
        }
      `}</style>
    </>
  );
}