import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import usePullToRefresh from '@/hooks/usePullToRefresh';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import TrialBanner from '@/components/dashboard/TrialBanner';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import ReferralCard from '@/components/ReferralCard';
import RupeeOneOffer from '@/components/RupeeOneOffer';
import { getUserProfile, getUserProgress } from '@/lib/supabaseDataService';
import { getDailyQuizStatus, getTodayString } from '@/lib/dailyQuizEngine';
import { generateLeaderboard, getUserEntry, getTopN, getUserPercentile } from '@/lib/leaderboardEngine';

// ─── helpers ────────────────────────────────────────────────────────────────

function greeting(auth, profile) {
  const h = new Date().getHours();
  const tod = h >= 5 && h < 12 ? 'morning' : h >= 12 && h < 17 ? 'afternoon' : 'evening';
  const displayName = profile.name || auth?.user_metadata?.name || '';
  if (!displayName) return `Good ${tod}! 👋`;
  const firstName = displayName.split(' ')[0];
  return `Good ${tod}, ${firstName}! 👋`;
}

const LEVELS = [
  { id: 1, name: 'Beginner',     icon: '🌱', count: 10, prefix: 'l1_', lockKey: null },
  { id: 2, name: 'Intermediate', icon: '📈', count: 12, prefix: 'l2_', lockKey: 'l1_10' },
  { id: 3, name: 'Advanced',     icon: '⚡', count: 10, prefix: 'l3_', lockKey: 'l2_12' },
  { id: 4, name: 'Master',       icon: '👑', count: 8,  prefix: 'l4_', lockKey: 'l3_10' },
];

const BADGES_DEF = [
  { id: 'first_lesson',  emoji: '🥇', name: 'First Lesson' },
  { id: 'five_lessons',  emoji: '📚', name: '5 Lessons Done' },
  { id: 'streak_3',      emoji: '🔥', name: '3-Day Streak' },
  { id: 'streak_7',      emoji: '💪', name: '7-Day Streak' },
  { id: 'perfect_score', emoji: '⭐', name: 'Perfect Score' },
  { id: 'xp_500',        emoji: '✨', name: '500 XP Club' },
];

const LESSON_META = {
  l1_01: { title: 'Introduction to Vedic Mathematics', desc: 'Discover the power of ancient Vedic sutras and their modern applications.' },
  l1_02: { title: 'The Ekadhikena Purvena Sutra',     desc: 'Master "By one more than the one before" for rapid squaring.' },
  l1_03: { title: 'Nikhilam Multiplication',           desc: 'Multiply large numbers using the base system.' },
  l1_04: { title: 'Anurupyena — Proportionality',      desc: 'Apply proportional reasoning to simplify calculations.' },
  l1_05: { title: 'Vertically & Crosswise Method',     desc: 'Two-digit multiplication using the cross-multiplication sutra.' },
};

const LEVEL_NAMES = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced', 4: 'Master' };

const glass = {
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(30,64,175,0.15)',
  boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
  borderRadius: 16,
};

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay },
});

// ─── Error Boundary ──────────────────────────────────────────────────────────

class DashboardErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ fontFamily: 'DM Sans', fontSize: 16, color: '#EF4444' }}>
            Dashboard failed to load. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 16, padding: '10px 24px', background: '#0A1628', color: 'white', borderRadius: 12, border: 'none', cursor: 'pointer' }}
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── sub-components ─────────────────────────────────────────────────────────

function ProgressRing({ pct }) {
  const r = 80, cx = 100, cy = 100, sw = 14;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={200} height={200} style={{ display: 'block', margin: '0 auto' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(30,64,175,0.1)" strokeWidth={sw} />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke="#3B82F6" strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize={36} fontFamily="var(--font-mono)" fontWeight={700} fill="#0A1628">
        {Math.round(pct)}%
      </text>
      <text x={cx} y={cy + 18} textAnchor="middle" fontSize={13} fontFamily="var(--font-body)" fill="#4B5563">
        Complete
      </text>
    </svg>
  );
}

function LevelBar({ level, completed, total }) {
  const pct = Math.round((completed / total) * 100);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: '#0A1628', fontFamily: 'var(--font-body)' }}>{level}</span>
        <span style={{ fontSize: 13, color: '#4B5563', fontFamily: 'var(--font-mono)' }}>{completed}/{total}</span>
      </div>
      <div style={{ height: 6, background: 'rgba(30,64,175,0.1)', borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#3B82F6', borderRadius: 100 }} />
      </div>
    </div>
  );
}

// ─── Daily Quiz Card ─────────────────────────────────────────────────────────

function getDQTodayString() {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

function getMinutesUntil8AM() {
  const now = new Date();
  const next8 = new Date();
  next8.setHours(8, 0, 0, 0);
  if (now >= next8) next8.setDate(next8.getDate() + 1);
  const diff = next8 - now;
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return { hours, minutes };
}

function DailyQuizCard() {
  const navigate = useNavigate();

  const progress = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_progress') || '{}'); } catch { return {}; } })();
  const today = getDQTodayString();
  const todayEntry = (progress.dailyQuizHistory || []).find(q => q.date === today) || null;
  const quizDoneToday = !!todayEntry;
  const hour = new Date().getHours();

  // Countdown state for State C (updates every 60s)
  const [countdown, setCountdown] = useState(getMinutesUntil8AM());
  useEffect(() => {
    if (quizDoneToday || hour >= 8) return;
    const interval = setInterval(() => setCountdown(getMinutesUntil8AM()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Determine state (first match wins)
  let state;
  if (quizDoneToday) {
    state = 'B'; // completed
  } else if (hour < 8) {
    state = 'C'; // before 8 AM
  } else if (hour >= 22) {
    state = 'D'; // expiring soon
  } else {
    state = 'A'; // live
  }

  const cardBase = {
    background: 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  };

  const accentColors = { A: '#3B82F6', B: '#10B981', C: '#6B7280', D: '#F59E0B' };
  const accent = accentColors[state];

  const cardStyle = {
    ...cardBase,
    border: `1px solid rgba(30,64,175,0.15)`,
    borderLeft: `3px solid ${accent}`,
  };

  const headerIcons = { A: '🔴', B: '✅', C: '⏳', D: '⚠️' };
  const pills = {
    A: { label: 'LIVE',     bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
    B: { label: 'DONE',     bg: '#ECFDF5', color: '#065F46', border: '#A7F3D0' },
    C: { label: 'SOON',     bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' },
    D: { label: 'EXPIRING', bg: '#FFFBEB', color: '#92400E', border: '#FCD34D' },
  };
  const pill = pills[state];

  const btnStyle = {
    width: '100%', minHeight: 44, border: 'none', borderRadius: 12,
    fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14,
    cursor: 'pointer', color: 'white',
  };

  return (
    <div style={cardStyle}>
      <style>{`
        @keyframes dqPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }
        @media(max-width:375px){ .dq-card-inner{ padding: 16px !important; } }
      `}</style>

      <div className="dq-card-inner" style={{ padding: 20 }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{
              fontSize: 14,
              ...(state === 'A' ? { animation: 'dqPulse 1.5s ease-in-out infinite', display: 'inline-block' } : {}),
            }}>
              {headerIcons[state]}
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Daily Quiz
            </span>
          </div>
          <span style={{
            background: pill.bg, color: pill.color,
            border: `1px solid ${pill.border}`,
            borderRadius: 99, padding: '2px 10px', fontSize: 11,
            fontFamily: 'var(--font-body)', fontWeight: 600,
          }}>
            {pill.label}
          </span>
        </div>

        {/* ── Streak indicator (all states except C) ── */}
        {state !== 'C' && (
          <div style={{ margin: '4px 0 12px' }}>
            {(progress.dailyQuizStreak >= 1) ? (
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: '#F59E0B', whiteSpace: 'nowrap' }}>
                🔥 {progress.dailyQuizStreak} day quiz streak
              </span>
            ) : (
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563', whiteSpace: 'nowrap' }}>
                Start your quiz streak today!
              </span>
            )}
          </div>
        )}

        {/* ── STATE A: LIVE ── */}
        {state === 'A' && (
          <>
            <h2 className="font-heading" style={{ fontSize: 18, fontWeight: 600, color: '#0A1628', margin: '0 0 4px' }}>
              Today's Quiz is waiting!
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', margin: '0 0 16px' }}>
              5 questions · 30 seconds each · Compete with your class
            </p>
            <button onClick={() => navigate('/daily-quiz')} style={{ ...btnStyle, background: '#0A1628' }}>
              Take Quiz Now →
            </button>
          </>
        )}

        {/* ── STATE B: COMPLETED ── */}
        {state === 'B' && todayEntry && (
          <>
            <div style={{ marginBottom: 4 }}>
              <span className="font-heading" style={{ fontSize: 28, fontWeight: 700, color: '#0A1628' }}>
                {todayEntry.score ?? 0}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#9CA3AF', marginLeft: 4 }}>
                / {todayEntry.totalPossible ?? 110}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563', marginBottom: todayEntry.rank ? 8 : 12 }}>
              Today's Score
            </div>
            {todayEntry.rank && (
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: '#10B981', marginBottom: 12 }}>
                🏆 Rank #{todayEntry.rank} in your class
              </div>
            )}
            <div
              onClick={() => navigate('/leaderboard')}
              style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#3B82F6', cursor: 'pointer', marginTop: 4 }}
            >
              View Leaderboard →
            </div>
          </>
        )}

        {/* ── STATE C: BEFORE 8 AM ── */}
        {state === 'C' && (
          <>
            <h2 className="font-heading" style={{ fontSize: 18, fontWeight: 600, color: '#0A1628', margin: '0 0 8px' }}>
              Next quiz drops at 8:00 AM
            </h2>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 600, color: '#0A1628',
                background: '#F0F4FF', borderRadius: 8, padding: '8px 16px',
                display: 'inline-block',
              }}>
                In {countdown.hours}h {countdown.minutes}m
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', margin: '8px 0 0' }}>
              Come back then to compete with your class
            </p>
          </>
        )}

        {/* ── STATE D: EXPIRING SOON ── */}
        {state === 'D' && (
          <>
            <h2 className="font-heading" style={{ fontSize: 18, fontWeight: 600, color: '#0A1628', margin: '0 0 4px' }}>
              Quiz expires at midnight!
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', margin: '0 0 16px' }}>
              Only a few hours left. Don't miss today's quiz and break your streak.
            </p>
            <button onClick={() => navigate('/daily-quiz')} style={{ ...btnStyle, background: '#F59E0B' }}>
              Take Quiz Before It Expires →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Leaderboard Preview Card ─────────────────────────────────────────────────

function LeaderboardPreviewCard({ profile, progress }) {
  const navigate = useNavigate();
  const classBoard = generateLeaderboard(profile, progress, 'class');
  const userEntry = getUserEntry(classBoard);
  const top3 = getTopN(classBoard, 3);
  const percentile = getUserPercentile(classBoard);

  const medals = ['🥇', '🥈', '🥉'];
  const avatarBg = ['#FEF3C7', '#F3F4F6', '#FEF9EE'];

  return (
    <div style={{ ...glass, padding: 24, marginBottom: 24 }}>
      <style>{`
        @media(max-width:400px){.lb-rank-box{flex-direction:column!important;gap:12px!important;}}
        @media(max-width:640px){.lb-header{flex-direction:column!important;align-items:flex-start!important;gap:8px!important;} .lb-view-btn-desktop{display:none!important;} .lb-view-btn-mobile{display:flex!important;}}
        @media(min-width:641px){.lb-view-btn-mobile{display:none!important;}}
      `}</style>

      {/* Header */}
      <div className="lb-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: '#0A1628' }}>
            🏆 Class Leaderboard
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563', marginTop: 2 }}>
            Updated daily · {classBoard.length} students in your class
          </div>
        </div>
        <button
          className="lb-view-btn-desktop"
          onClick={() => navigate('/leaderboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, color: '#3B82F6', fontWeight: 500, padding: 0 }}
        >
          View Full →
        </button>
      </div>

      {/* User Rank Box */}
      {userEntry && (
        <div className="lb-rank-box" style={{
          marginTop: 16, background: 'linear-gradient(135deg, #0A1628, #1E40AF)',
          borderRadius: 12, padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Left */}
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
              Your Rank
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color: 'white', lineHeight: 1 }}>
              #{userEntry.rank}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
              of {classBoard.length} students
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.2)', margin: '0 16px', flexShrink: 0 }} />

          {/* Right */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: '#10B981', marginBottom: 4 }}>
              ↑{userEntry.movementAmount} since yesterday
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: 'white' }}>
              Top {100 - percentile}%
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
              of your class
            </div>
          </div>
        </div>
      )}

      {/* Top 3 List */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Top Students
        </div>
        {top3.map((entry, index) => (
          <div key={entry.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '6px 0',
            borderBottom: index < top3.length - 1 ? '1px solid rgba(30,64,175,0.06)' : 'none',
            minHeight: 44,
          }}>
            <span style={{ fontSize: 16 }}>{medals[index]}</span>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              background: entry.isCurrentUser ? '#0A1628' : avatarBg[index],
              color: entry.isCurrentUser ? 'white' : '#0A1628',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11,
            }}>
              {entry.name.charAt(0)}
            </div>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
              color: '#0A1628', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {entry.isAnonymous ? 'Anonymous 🎭' : entry.name.slice(0, 18) + (entry.name.length > 18 ? '…' : '')}
              {entry.isCurrentUser && <span style={{ color: '#3B82F6' }}> (You)</span>}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 13, color: '#4B5563', flexShrink: 0 }}>
              {entry.score}
            </span>
          </div>
        ))}

        {/* User row if outside top 3 */}
        {userEntry && userEntry.rank > 3 && (
          <>
            <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 13, padding: '4px 0', letterSpacing: 2 }}>···</div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '6px 0', minHeight: 44,
            }}>
              <span style={{ fontSize: 16, minWidth: 20 }}></span>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                background: '#0A1628', color: 'white',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11,
              }}>
                {userEntry.name.charAt(0)}
              </div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: '#0A1628', flex: 1 }}>
                {userEntry.name}<span style={{ color: '#3B82F6' }}> (You)</span>
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 13, color: '#3B82F6', flexShrink: 0 }}>
                #{userEntry.rank}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Mobile View Full button */}
      <button
        className="lb-view-btn-mobile"
        onClick={() => navigate('/leaderboard')}
        style={{
          display: 'none', width: '100%', minHeight: 40, marginTop: 12,
          background: 'transparent', border: '1.5px solid #0A1628',
          color: '#0A1628', borderRadius: 10, fontFamily: 'var(--font-body)',
          fontWeight: 600, fontSize: 14, cursor: 'pointer',
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        View Full Leaderboard →
      </button>
    </div>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

function DashboardPage() {
  const navigate = useNavigate();

  const { user: auth, loading } = useVedicAuth();
  const ADMIN_EMAILS = ['test1@vedicmindai.in', 'pathak32032@gmail.com'];
  const isAdmin = ADMIN_EMAILS.includes(auth?.email);

  // Supabase data state
  const [profile, setProfile] = useState(() => { try { return JSON.parse(localStorage.getItem('vedicmind_profile')) || {}; } catch(e) { return {}; } });
  const [progress, setProgress] = useState(() => { try { return JSON.parse(localStorage.getItem('vedicmind_progress')) || {}; } catch(e) { return {}; } });
  const [dataLoading, setDataLoading] = useState(true);

  const hasActivePlan = profile?.subscriptionStatus === 'active' || profile?.subscription_status === 'active' || profile?.paymentStatus === 'completed' || profile?.payment_status === 'completed';
  const signupDate = new Date(auth?.created_at || Date.now());
  const daysSinceSignup = Math.floor((Date.now() - signupDate) / (1000 * 60 * 60 * 24));

  // Give auth state time to settle before redirecting
  useEffect(() => {
    if (loading) return; // Still loading — wait
    if (auth) return;    // Logged in — stay
    // Not logged in — but wait a moment to let onAuthStateChange fire
    const timer = setTimeout(() => {
      // Double-check auth state hasn't changed
      if (!loading && !user) { navigate('/auth'); return; }
    }, 1500);
    return () => clearTimeout(timer);
  }, [loading, auth]);

  // Load data from Supabase
  useEffect(() => {
    if (!auth?.id) return;
    (async () => {
      try {
        const [supaProfile, supaProgress] = await Promise.all([
          getUserProfile(auth.id),
          getUserProgress(auth.id),
        ]);
        if (supaProfile && Object.keys(supaProfile).length > 0) {
          setProfile(supaProfile);
          localStorage.setItem('vedicmind_profile', JSON.stringify(supaProfile));
        }
        if (supaProgress && Object.keys(supaProgress).length > 0) {
          // Map Supabase column names to app's expected keys
          const mappedProgress = {
            ...supaProgress,
            completedLessons: supaProgress.completed_lessons || [],
            lessonScores: supaProgress.lesson_scores || {},
            totalXP: supaProgress.total_xp || 0,
            currentLevel: supaProgress.current_level || 1,
            dailyQuizStreak: supaProgress.daily_quiz_streak || 0,
          };
          setProgress(mappedProgress);
          localStorage.setItem('vedicmind_progress', JSON.stringify(mappedProgress));
        }
      } catch (e) {
        console.error('Dashboard data load error:', e);
      } finally {
        setDataLoading(false);
      }
    })();
  }, [auth?.id]);

  const { pulling, pullDistance } = usePullToRefresh(() => window.location.reload());

  const completed  = Array.isArray(progress.completedLessons) ? progress.completedLessons : [];
  const scores     = progress.lessonScores || {};
  const totalXP    = progress.totalXP ?? 0;
  const streak     = progress.streak ?? 0;
  const badges     = Array.isArray(progress.badges) ? progress.badges : [];
  const aiAnalysis = profile.aiAnalysis || {};
  const levelName  = LEVEL_NAMES[progress.currentLevel ?? 1];

  const overallPct = Math.round((completed.length / 40) * 100);

  const allLessonIds = [
    'l1_01','l1_02','l1_03','l1_04','l1_05','l1_06','l1_07','l1_08','l1_09','l1_10',
    'l2_01','l2_02','l2_03','l2_04','l2_05','l2_06','l2_07','l2_08','l2_09','l2_10','l2_11','l2_12',
    'l3_01','l3_02','l3_03','l3_04','l3_05','l3_06','l3_07','l3_08','l3_09','l3_10',
    'l4_01','l4_02','l4_03','l4_04','l4_05','l4_06','l4_07','l4_08',
  ];
  // (10 + 12 + 10 + 8 = 40 total lessons)
  const nextLessonId = allLessonIds.find(id => !completed.includes(id)) || allLessonIds[0];
  const nextMeta = LESSON_META[nextLessonId] || { title: 'Introduction to Vedic Mathematics', desc: 'Begin your Vedic Maths journey.' };
  const nextLevel = LEVELS.find(l => nextLessonId.startsWith(l.prefix.slice(0, 2)));

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF', paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <DashboardNavbar />

      {pulling && (
        <div style={{ textAlign: 'center', padding: '8px 0', fontSize: 13, color: '#3B82F6', fontFamily: 'var(--font-body)', transform: `translateY(${pullDistance * 0.4}px)`, transition: 'transform 0.1s' }}>
          {pullDistance >= 80 ? '↑ Release to refresh' : '↓ Pull to refresh'}
        </div>
      )}

      <main className="px-4 sm:px-6 lg:px-8" style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 24, paddingBottom: 24 }}>

        {/* ── TRIAL BANNER ── */}
        {!hasActivePlan && <TrialBanner />}

        {/* ── DAILY QUIZ CARD — most prominent, full width, top ── */}
        <DailyQuizCard />

        {/* ── ROW 1: WELCOME ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="font-heading" style={{ fontSize: 'clamp(24px,5vw,32px)', fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>
              {greeting(auth, profile)}
            </h1>
            {aiAnalysis.personalizedTip && (
              <p style={{ fontSize: 15, color: '#4B5563', maxWidth: 500, fontFamily: 'var(--font-body)', lineHeight: 1.6, margin: 0 }}>
                {aiAnalysis.personalizedTip}
              </p>
            )}
          </div>
          <div style={{ ...glass, padding: '14px 20px', textAlign: 'right', minWidth: 160 }}>
            <div style={{ fontSize: 14, color: '#4B5563', fontFamily: 'var(--font-body)', marginBottom: 4 }}>{today}</div>
            {streak > 0 && <div style={{ fontSize: 13, color: '#F59E0B', fontFamily: 'var(--font-body)' }}>🔥 Keep your streak alive!</div>}
          </div>
        </div>

        {/* ── ROW 2: STATS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          {/* 1. Total XP */}
          <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(30,64,175,0.15)', boxShadow: '0 8px 32px rgba(10,22,40,0.08)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>⭐</div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>Total XP</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color: '#0A1628', lineHeight: 1 }}>{totalXP}</span>
          </div>
          {/* 2. Day Streak */}
          <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(30,64,175,0.15)', boxShadow: '0 8px 32px rgba(10,22,40,0.08)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🔥</div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>Day Streak</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color: '#0A1628', lineHeight: 1 }}>{streak}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563' }}>days in a row</span>
          </div>
          {/* 3. Lessons Completed */}
          <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(30,64,175,0.15)', boxShadow: '0 8px 32px rgba(10,22,40,0.08)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📚</div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>Lessons Completed</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: '#0A1628', lineHeight: 1 }}>{completed.length} / 40</span>
          </div>
          {/* 4. Current Level */}
          <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(30,64,175,0.15)', boxShadow: '0 8px 32px rgba(10,22,40,0.08)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🏆</div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>Current Level</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: '#0A1628', lineHeight: 1 }}>Level {progress.currentLevel ?? 1}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563' }}>{levelName}</span>
          </div>
        </div>

        {/* ── ADMIN PANEL BUTTON ── */}
        {isAdmin && (
          <div style={{ marginBottom: 24 }}>
            <button onClick={() => navigate('/admin-panel')} style={{
              width: '100%', minHeight: 48, background: '#7C3AED',
              color: 'white', border: 'none', borderRadius: 12,
              fontSize: 16, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}>🛡️ Admin Panel →</button>
          </div>
        )}

        {/* ── LEADERBOARD PREVIEW CARD ── */}
        <LeaderboardPreviewCard profile={profile} progress={progress} />

        {/* ── ROW 3: PROGRESS RING + NEXT LESSON ── */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">

          {/* Progress Ring */}
          <div className="md:w-3/5" style={{ ...glass, padding: 28 }}>
            <h2 className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 20 }}>Your Progress</h2>
            <ProgressRing pct={overallPct} />
            <div style={{ marginTop: 24 }}>
              {LEVELS.map(lv => {
                const lvCompleted = completed.filter(id => id.startsWith(lv.prefix.slice(0, 2))).length;
                return <LevelBar key={lv.id} level={`${lv.icon} ${lv.name}`} completed={lvCompleted} total={lv.count} />;
              })}
            </div>
          </div>

          {/* Next Lesson */}
          <div className="md:w-2/5" style={{ ...glass, padding: 24 }}>
            <h2 className="font-heading" style={{ fontSize: 20, fontWeight: 700, color: '#0A1628', marginBottom: 16 }}>Continue Learning</h2>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 18, color: '#0A1628', marginBottom: 8 }}>
              {nextMeta.title}
            </div>
            <div style={{ fontSize: 14, color: '#4B5563', fontFamily: 'var(--font-body)', lineHeight: 1.5, marginBottom: 14,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {nextMeta.desc}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {nextLevel && (
                <span style={{ background: '#DBEAFE', color: '#1E40AF', borderRadius: 100, padding: '4px 12px', fontSize: 13, fontFamily: 'var(--font-body)' }}>
                  Level {nextLevel.id} — {nextLevel.name}
                </span>
              )}
              <span style={{ background: '#FEF3C7', color: '#92400E', borderRadius: 100, padding: '4px 12px', fontSize: 13, fontFamily: 'var(--font-body)' }}>
                ⭐ +100 XP
              </span>
            </div>
            <Link to="/learn">
              <button style={{
                width: '100%', minHeight: 44, background: '#0A1628', color: 'white',
                border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}>
                Continue Lesson →
              </button>
            </Link>
            {(progress.currentLevel ?? 1) === 1 && completed.length < 10 && (
              <p style={{ fontSize: 12, color: '#4B5563', fontFamily: 'var(--font-body)', marginTop: 12, textAlign: 'center' }}>
                🔒 Next level unlocks after completing Level 1 assessment
              </p>
            )}
          </div>
        </div>

        {/* ── ROW 4: AI INSIGHT + CHART PLACEHOLDER ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>

          {/* AI Insight */}
          <div style={{ ...glass, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 20 }}>🤖</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#0A1628', fontFamily: 'var(--font-body)' }}>AI Insight</span>
              <span style={{ fontSize: 16 }}>✨</span>
            </div>
            {aiAnalysis.whyVedicMaths && (
              <div style={{ background: '#F0F4FF', borderLeft: '4px solid #3B82F6', borderRadius: '0 12px 12px 0', padding: 16, marginBottom: 16 }}>
                <p style={{ fontSize: 14, color: '#0A1628', fontStyle: 'italic', fontFamily: 'var(--font-body)', lineHeight: 1.65, margin: 0 }}>
                  {aiAnalysis.whyVedicMaths}
                </p>
              </div>
            )}
            {Array.isArray(aiAnalysis.topFocusAreas) && aiAnalysis.topFocusAreas.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {aiAnalysis.topFocusAreas.slice(0, 3).map((area, i) => (
                  <span key={i} style={{ background: '#DBEAFE', color: '#1E40AF', borderRadius: 100, padding: '6px 14px', fontSize: 13, fontFamily: 'var(--font-body)' }}>
                    {area}
                  </span>
                ))}
              </div>
            )}
            {aiAnalysis.motivationalQuote && (
              <p className="font-heading" style={{ fontSize: 14, fontStyle: 'italic', color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
                — {aiAnalysis.motivationalQuote}
              </p>
            )}
          </div>

          {/* XP Chart Placeholder */}
          <div style={{ ...glass, padding: 24 }}>
            <h2 className="font-heading" style={{ fontSize: 20, fontWeight: 700, color: '#0A1628', marginBottom: 2 }}>XP Over Time</h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', marginBottom: 16, marginTop: 0 }}>Last 7 days</p>
            <div style={{
              background: '#F0F4FF', borderRadius: 12, padding: '24px',
              textAlign: 'center', display: 'flex',
              flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 40 }}>📊</span>
              <p style={{ fontFamily: 'DM Sans', fontSize: 14, color: '#4B5563', margin: 0 }}>
                Your XP chart appears after your first study session
              </p>
            </div>
          </div>
        </div>

        {/* ── ROW 5: LEVEL CARDS ── */}
        <div className="mb-6">
          <h2 className="font-heading" style={{ fontSize: 24, fontWeight: 700, color: '#0A1628', marginBottom: 16 }}>Your Learning Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {LEVELS.map(lv => {
              const lvCompleted = completed.filter(id => id.startsWith(lv.prefix.slice(0, 2))).length;
              const isLocked = lv.lockKey ? (scores[lv.lockKey] || 0) < 60 : false;
              const isDone = lvCompleted >= lv.count;
              return (
                <div key={lv.id} style={{
                  ...glass, padding: 20,
                  filter: isLocked ? 'grayscale(0.6)' : 'none',
                  opacity: isLocked ? 0.85 : 1,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 28 }}>{isLocked ? '🔒' : lv.icon}</span>
                    <span style={{
                      background: isDone ? '#D1FAE5' : isLocked ? '#F0F4FF' : '#DBEAFE',
                      color: isDone ? '#065F46' : isLocked ? '#4B5563' : '#1E40AF',
                      borderRadius: 100, padding: '3px 10px', fontSize: 11, fontFamily: 'var(--font-body)',
                    }}>
                      {isDone ? 'Completed' : isLocked ? 'Locked' : 'In Progress'}
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#0A1628', fontFamily: 'var(--font-body)', marginBottom: 4 }}>
                    Level {lv.id} — {lv.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#4B5563', fontFamily: 'var(--font-body)', marginBottom: 12 }}>
                    {lv.count} lessons
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: '#4B5563', fontFamily: 'var(--font-body)' }}>{lvCompleted}/{lv.count}</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(30,64,175,0.1)', borderRadius: 100 }}>
                      <div style={{ height: '100%', width: `${(lvCompleted / lv.count) * 100}%`, background: '#10B981', borderRadius: 100 }} />
                    </div>
                  </div>
                  {isLocked ? (
                    <div style={{ fontSize: 11, color: '#4B5563', fontFamily: 'var(--font-body)', textAlign: 'center', padding: '8px 0' }}>
                      Unlocks after Level {lv.id - 1} Assessment (60%+)
                    </div>
                  ) : (
                    <Link to="/learn">
                      <button style={{
                        width: '100%', minHeight: 40, background: '#0A1628', color: 'white',
                        border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'var(--font-body)',
                      }}>
                        {isDone ? 'Review →' : 'Start →'}
                      </button>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SHARE YOUR STORY BANNER ── */}
        <div style={{ ...glass, padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, color: '#0A1628', marginBottom: 2 }}>💬 Share Your VedicMind Story</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563' }}>Help other students and parents by sharing your experience</div>
          </div>
          <button
            onClick={() => navigate('/reviews')}
            style={{ padding: '10px 20px', background: '#0A1628', color: 'white', border: 'none', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, cursor: 'pointer', minHeight: 44, whiteSpace: 'nowrap' }}
          >
            Share My Story →
          </button>
        </div>

        {/* ── ROW 6: BADGES ── */}
        <div style={{ ...glass, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 className="font-heading" style={{ fontSize: 24, fontWeight: 700, color: '#0A1628' }}>Badges Earned</h2>
            <Link to="/profile" style={{ fontSize: 14, color: '#3B82F6', fontFamily: 'var(--font-body)', textDecoration: 'none' }}>
              View All Badges →
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {BADGES_DEF.map(b => {
              const earned = badges.includes(b.id);
              return (
                <div key={b.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 60 }}>
                  <div style={{
                    width: 'min(72px, 15vw)', height: 'min(72px, 15vw)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: earned ? 'linear-gradient(135deg, #DBEAFE, #EDE9FE)' : '#F0F4FF',
                    fontSize: 'min(36px, 7vw)',
                    filter: earned ? 'none' : 'grayscale(1)',
                    opacity: earned ? 1 : 0.5,
                    border: earned ? '2px solid rgba(59,130,246,0.3)' : '2px solid rgba(30,64,175,0.1)',
                  }}>
                    {earned ? b.emoji : '🔒'}
                  </div>
                  <span style={{ fontSize: 12, color: '#0A1628', fontFamily: 'var(--font-body)', textAlign: 'center', lineHeight: 1.3 }}>
                    {b.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}

export default function DashboardPageWrapped() {
  return (
    <DashboardErrorBoundary>
      <DashboardPage />
    </DashboardErrorBoundary>
  );
}