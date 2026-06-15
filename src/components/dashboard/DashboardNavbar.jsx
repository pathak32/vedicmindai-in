import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { hasCompletedTodayQuiz } from '@/lib/dailyQuizEngine';
import { generateLeaderboard, getUserEntry } from '@/lib/leaderboardEngine';
import { getWeeklyExamStatus } from '@/lib/weeklyExamEngine';
import { getOlympiadStatus } from '@/lib/olympiadEngine';
import { useLanguage } from '@/lib/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';

const REGULAR_LINKS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Learn',     path: '/learn' },
];
const AFTER_QUIZ_LINKS = [
  { label: 'Practice',    path: '/practice' },
  { label: '⚔️ Battle',  path: '/battle', badge: 'NEW' },
  { label: 'Aptitude',    path: '/aptitude' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Reviews',     path: '/reviews' },
  { label: 'Profile',     path: '/profile' },
];

function AdminNavLink({
  mobile, onClick }) {
  const { user } = useVedicAuth();
  if (!user || user.user_metadata?.role !== 'admin') return null;
  const active = window.location.pathname === '/admin';
  if (mobile) {
    return (
      <Link to="/admin" onClick={onClick} style={{
        padding: '16px 0', fontSize: 18, fontWeight: 500,
        borderBottom: '1px solid #F0F4FF', textDecoration: 'none',
        color: active ? '#3B82F6' : '#7C3AED',
        fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', minHeight: 44, gap: 6,
      }}>🛡️ Admin Panel</Link>
    );
  }
  return (
    <Link to="/admin" style={{
      padding: '6px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, minHeight: 44,
      display: 'flex', alignItems: 'center', gap: 4,
      background: active ? '#EDE9FE' : 'transparent',
      color: active ? '#7C3AED' : '#7C3AED',
      textDecoration: 'none',
      border: '1.5px solid rgba(124,58,237,0.25)',
      fontFamily: 'var(--font-body)', transition: 'background 0.15s',
    }}>🛡️ Admin</Link>
  );
}

function useQuizState() {
  const hour = new Date().getHours();
  const completed = hasCompletedTodayQuiz();
  const isAvailable = hour >= 8;
  const weeklyStatus = getWeeklyExamStatus();
  const weeklyLive = weeklyStatus === 'live';
  const olympiadLive = getOlympiadStatus() === 'live';
  return { completed, isAvailable, weeklyLive, olympiadLive };
}

function QuizNavLink({ active, onClick, completed, isAvailable, mobile }) {
  const baseStyle = mobile
    ? { padding: '16px 0', fontSize: 18, fontWeight: 500, borderBottom: '1px solid #F0F4FF', textDecoration: 'none', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', minHeight: 44 }
    : { padding: '6px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-body)', transition: 'color 0.15s', display: 'flex', alignItems: 'center', minHeight: 44 };

  let color = '#4B5563';
  let dot = null;

  if (active) {
    color = '#3B82F6';
  } else if (isAvailable && !completed) {
    color = '#EF4444';
    dot = (
      <span style={{
        display: 'inline-block', width: 8, height: 8,
        borderRadius: '50%', background: '#EF4444',
        marginRight: 6, flexShrink: 0,
        animation: 'quizPulse 1.5s ease-in-out infinite',
      }} />
    );
  } else if (completed) {
    color = '#10B981';
  }

  return (
    <Link to="/daily-quiz" onClick={onClick} style={{ ...baseStyle, color, textDecoration: active && !mobile ? 'underline' : 'none', textUnderlineOffset: 4 }}>
      {dot}Daily Quiz{completed && !active ? ' ✅' : ''}
    </Link>
  );
}

function WeeklyExamNavLink({ active, onClick, weeklyLive, mobile }) {
  const baseStyle = mobile
    ? { padding: '16px 0', fontSize: 18, fontWeight: 500, borderBottom: '1px solid #F0F4FF', textDecoration: 'none', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', minHeight: 44 }
    : { padding: '6px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-body)', transition: 'color 0.15s', display: 'flex', alignItems: 'center', minHeight: 44 };

  const color = active ? '#3B82F6' : weeklyLive ? '#EF4444' : '#4B5563';
  const dot = weeklyLive && !active ? (
    <span style={{
      display: 'inline-block', width: 8, height: 8,
      borderRadius: '50%', background: '#EF4444',
      marginRight: 6, flexShrink: 0,
      animation: 'quizPulse 1.5s ease-in-out infinite',
    }} />
  ) : null;

  return (
    <Link to="/weekly-exam" onClick={onClick} style={{ ...baseStyle, color, textDecoration: active && !mobile ? 'underline' : 'none', textUnderlineOffset: 4 }}>
      {dot}Weekly Exam{weeklyLive && !active ? ' 🔴' : ''}
    </Link>
  );
}

function OlympiadNavLink({ active, onClick, olympiadLive, mobile }) {
  const baseStyle = mobile
    ? { padding: '16px 0', fontSize: 18, fontWeight: 500, borderBottom: '1px solid #F0F4FF', textDecoration: 'none', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', minHeight: 44 }
    : { padding: '6px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-body)', transition: 'color 0.15s', display: 'flex', alignItems: 'center', minHeight: 44 };

  const color = active ? '#3B82F6' : olympiadLive ? '#F59E0B' : '#4B5563';
  const dot = olympiadLive && !active ? (
    <span style={{
      display: 'inline-block', width: 8, height: 8,
      borderRadius: '50%', background: '#F59E0B',
      marginRight: 6, flexShrink: 0,
      animation: 'quizPulse 1.5s ease-in-out infinite',
    }} />
  ) : null;

  return (
    <Link to="/olympiad" onClick={onClick} style={{ ...baseStyle, color, textDecoration: active && !mobile ? 'underline' : 'none', textUnderlineOffset: 4 }}>
      {dot}Olympiad 🏅{olympiadLive && !active ? ' 🟡' : ''}
    </Link>
  );
}

function AnnouncementBar() {
  const { completed, isAvailable } = useQuizState();
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  if (!isAvailable || completed || dismissed) return null;

  return (
    <div style={{
      position: 'sticky', top: 64, zIndex: 49,
      background: 'linear-gradient(90deg, #0A1628, #1E40AF)',
      height: 'auto', minHeight: 40,
    }}>
      <style>{`
        @keyframes quizPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media(max-width:640px){
          .ann-bar-inner{flex-direction:column!important;gap:8px!important;padding:10px 16px!important;align-items:flex-start!important;}
          .ann-bar-text{font-size:12px!important;}
          .ann-bar-take{width:100%!important;text-align:center!important;border:1px solid rgba(255,255,255,0.4)!important;border-radius:8px!important;padding:6px 0!important;}
        }
      `}</style>
      <div className="ann-bar-inner" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, minHeight: 40 }}>
        <p className="ann-bar-text" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'white', margin: 0, flex: 1, textAlign: 'center' }}>
          🔴 Today's Daily Quiz is live! Answer in under 10 seconds for maximum XP · Expires at midnight
        </p>
        <button
          className="ann-bar-take"
          onClick={() => navigate('/daily-quiz')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, textDecoration: 'underline', whiteSpace: 'nowrap', padding: 0 }}
        >
          Take Quiz →
        </button>
        <button
          onClick={() => setDismissed(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: 16, padding: '0 4px', flexShrink: 0 }}
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function RankBadge({ rank }) {
  if (!rank || rank > 10) return null;
  const bg = rank === 1 ? '#F59E0B' : rank <= 3 ? '#9CA3AF' : '#DBEAFE';
  const color = rank <= 3 ? 'white' : '#1E40AF';
  return (
    <span style={{ marginLeft: 4, background: bg, color, borderRadius: 100, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, padding: '1px 7px' }}>
      #{rank}
    </span>
  );
}

export default function DashboardNavbar() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { completed, isAvailable, weeklyLive, olympiadLive } = useQuizState();

  const lbRank = useMemo(() => {
    try {
      const profile  = JSON.parse(localStorage.getItem('vedicmind_profile') || '{}');
      const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
      const board = generateLeaderboard(profile, progress, 'class');
      return getUserEntry(board)?.rank || 0;
    } catch { return 0; }
  }, []);

  const { user, signOut } = useVedicAuth();

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem('vedicmind_profile');
    localStorage.removeItem('vedicmind_progress');
    navigate('/');
  };

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e) => {
      if (!e.target.closest('.mobile-menu-container') && !e.target.closest('.hamburger-btn')) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [mobileOpen]);

  const allRegularLinks = [...REGULAR_LINKS, ...AFTER_QUIZ_LINKS];

  return (
    <>
      <style>{`
        @keyframes quizPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes navSlideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width: 1023px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 1024px) {
          .show-mobile { display: none !important; }
        }
      `}</style>

      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(30,64,175,0.12)',
        height: 64,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <span className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#0A1628' }}>🧮 VedicMindAI™</span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
            {REGULAR_LINKS.map(link => {
              const active = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path} style={{
                  padding: '6px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, minHeight: 44,
                  display: 'flex', alignItems: 'center',
                  color: active ? '#3B82F6' : '#4B5563',
                  textDecoration: active ? 'underline' : 'none',
                  textUnderlineOffset: 4,
                  fontFamily: 'var(--font-body)', transition: 'color 0.15s',
                }}>
                  {link.label}
                </Link>
              );
            })}

            {/* Daily Quiz special link */}
            <QuizNavLink
              active={location.pathname === '/daily-quiz'}
              completed={completed}
              isAvailable={isAvailable}
            />

            {/* Weekly Exam link */}
            <WeeklyExamNavLink
              active={location.pathname === '/weekly-exam'}
              weeklyLive={weeklyLive}
            />

            {/* Olympiad link */}
            <OlympiadNavLink
              active={location.pathname === '/olympiad'}
              olympiadLive={olympiadLive}
            />

            {AFTER_QUIZ_LINKS.map(link => {
              const active = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path} style={{
                  padding: '6px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, minHeight: 44,
                  display: 'flex', alignItems: 'center', position: 'relative',
                  color: active ? '#3B82F6' : '#4B5563',
                  textDecoration: active ? 'underline' : 'none',
                  textUnderlineOffset: 4,
                  fontFamily: 'var(--font-body)', transition: 'color 0.15s',
                }}>
                  {link.label}
                  {link.badge && (
                    <span style={{
                      marginLeft: 4,
                      background: '#F59E0B', color: 'white',
                      borderRadius: 99, padding: '1px 6px',
                      fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700,
                      lineHeight: 1.4,
                    }}>{link.badge}</span>
                  )}
                  {link.path === '/leaderboard' && <RankBadge rank={lbRank} />}
                </Link>
              );
            })}

            <AdminNavLink />

            <LanguageToggle size="sm" />

            <button onClick={handleSignOut} style={{
              marginLeft: 8, padding: '6px 16px', borderRadius: 8, fontSize: 14,
              fontWeight: 500, color: '#EF4444', background: 'transparent',
              border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer',
              fontFamily: 'var(--font-body)', transition: 'background 0.15s',
            }}>
              Sign Out
            </button>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(prev => !prev)} className="show-mobile hamburger-btn" style={{ width: 48, height: 48, padding: 12, background: 'none', border: 'none', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}>
            {mobileOpen ? <X size={24} color="#0A1628" /> : <Menu size={24} color="#0A1628" />}
          </button>
        </div>
      </nav>

      {/* Announcement bar */}
      <AnnouncementBar />

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="mobile-menu-container" style={{ position: 'fixed', top: 56, left: 0, width: '100vw', background: '#0A1628', zIndex: 999, animation: 'navSlideDown 0.2s ease-out', maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          {[
            ...REGULAR_LINKS,
            { label: 'Daily Quiz', path: '/daily-quiz' },
            { label: 'Weekly Exam', path: '/weekly-exam' },
            { label: 'Olympiad 🏅', path: '/olympiad' },
            ...AFTER_QUIZ_LINKS,
          ].map(link => {
            const active = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} style={{
                display: 'flex', alignItems: 'center', height: 56, padding: '0 16px',
                fontSize: 15, fontFamily: 'var(--font-body)', fontWeight: active ? 600 : 400,
                color: '#FFFFFF', textDecoration: 'none',
                borderLeft: active ? '3px solid #3B82F6' : '3px solid transparent',
                background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}>
                {link.label}
                {link.badge && (
                  <span style={{ marginLeft: 6, background: '#F59E0B', color: 'white', borderRadius: 99, padding: '1px 6px', fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, lineHeight: 1.4 }}>{link.badge}</span>
                )}
                {link.path === '/leaderboard' && <RankBadge rank={lbRank} />}
              </Link>
            );
          })}
          {(() => { if (user && user.user_metadata?.role === 'admin') { return (
            <Link to="/admin" onClick={() => setMobileOpen(false)} style={{
              display: 'flex', alignItems: 'center', height: 56, padding: '0 16px',
              fontSize: 15, fontFamily: 'var(--font-body)',
              color: '#FFFFFF', textDecoration: 'none',
              borderLeft: location.pathname === '/admin' ? '3px solid #3B82F6' : '3px solid transparent',
              background: location.pathname === '/admin' ? 'rgba(255,255,255,0.08)' : 'transparent',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}>🛡️ Admin Panel</Link>
          ); } return null; })()}
          <button onClick={() => { setMobileOpen(false); handleSignOut(); }} style={{
            display: 'flex', alignItems: 'center', width: '100%', height: 56, padding: '0 16px',
            fontSize: 15, fontFamily: 'var(--font-body)', fontWeight: 500,
            color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer',
            textAlign: 'left',
          }}>
            Sign Out
          </button>
          {/* Language Toggle in mobile menu */}
          <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <LanguageToggle size="md" />
          </div>
        </div>
      )}
    </>
  );
}