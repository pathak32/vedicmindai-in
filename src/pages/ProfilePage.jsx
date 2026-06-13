import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// navigate already imported above
import { motion, AnimatePresence } from 'framer-motion';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import BadgeGrid from '@/components/profile/BadgeGrid';
import EditProfileForm from '@/components/profile/EditProfileForm';
import ResetConfirmModal from '@/components/profile/ResetConfirmModal';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { saveUserProfile, getUserProfile, getUserProgress } from '@/lib/supabaseDataService';

function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * p * (3 - 2 * p) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return val;
}

const glass = {
  background: 'rgba(255,255,255,0.75)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(30,64,175,0.15)',
  boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
  borderRadius: 16,
};

const INITIAL_PROGRESS = {
  currentLevel: 1, currentLesson: 'l1_01', completedLessons: [],
  lessonScores: {}, totalXP: 0, streak: 0, lastStudyDate: null,
  studyDates: [], badges: [], practiceHistory: [], dailyQuizHistory: [],
  aptitudeProgress: {}, leaderboardOptOut: false,
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [dangerOpen, setDangerOpen] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [toast, setToast] = useState('');

  const { user: auth, loading, signOut } = useVedicAuth();
  const [profile,  setProfile]  = useState(JSON.parse(localStorage.getItem('vedicmind_profile')  || '{}'));
  const [progress, setProgress] = useState(JSON.parse(localStorage.getItem('vedicmind_progress') || '{}'));

  useEffect(() => {
    if (!loading && !auth) navigate('/auth');
  }, [loading, auth]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const name = profile.name || auth?.user_metadata?.name || 'Student';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const memberSince = auth?.created_at
    ? new Date(auth.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'May 2025';

  const roleTag = profile.grade && profile.board
    ? `${profile.grade} — ${profile.board}`
    : profile.exam
      ? profile.exam
      : profile.role || 'Learner';

  const scores = progress.lessonScores || {};
  const scoreVals = Object.values(scores);
  const avgAccuracy = scoreVals.length
    ? Math.round(scoreVals.reduce((a, b) => a + b, 0) / scoreVals.length)
    : null;

  const completed = progress.completedLessons || [];
  const xpVal = useCountUp(progress.totalXP || 0);

  // Load from Supabase on mount
  useEffect(() => {
    if (!auth?.id) return;
    (async () => {
      try {
        const [sp, sprog] = await Promise.all([getUserProfile(auth.id), getUserProgress(auth.id)]);
        if (sp && Object.keys(sp).length > 0) { setProfile(sp); localStorage.setItem('vedicmind_profile', JSON.stringify(sp)); }
        if (sprog && Object.keys(sprog).length > 0) {
          const mapped = { ...sprog, completedLessons: sprog.completed_lessons || [], lessonScores: sprog.lesson_scores || {}, totalXP: sprog.total_xp || 0 };
          setProgress(mapped); localStorage.setItem('vedicmind_progress', JSON.stringify(mapped));
        }
      } catch(e) { /* silent */ }
    })();
  }, [auth?.id]);

  const handleSave = async (updatedProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('vedicmind_profile', JSON.stringify(updatedProfile));
    try {
      if (auth?.id) await saveUserProfile(auth.id, { name: updatedProfile.name, goal: updatedProfile.goal, ai_analysis: updatedProfile.aiAnalysis || {} });
    } catch(e) { /* silent */ }
    setEditOpen(false);
    showToast('Profile updated! ✅');
  };

  const handleReset = () => {
    localStorage.setItem('vedicmind_progress', JSON.stringify(INITIAL_PROGRESS));
    setProgress(INITIAL_PROGRESS);
    setResetModal(false);
    showToast('Progress reset.');
    setTimeout(() => navigate('/dashboard'), 1200);
  };

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem('vedicmind_profile');
    localStorage.removeItem('vedicmind_progress');
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    await signOut();
    localStorage.removeItem('vedicmind_profile');
    localStorage.removeItem('vedicmind_progress');
    localStorage.removeItem('vedicmind_plan');
    navigate('/');
  };

  const practiceHistory = (progress.practiceHistory || []).slice().reverse();
  const [showAllHistory, setShowAllHistory] = useState(false);
  const visibleHistory = showAllHistory ? practiceHistory : practiceHistory.slice(0, 10);

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <DashboardNavbar />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px 60px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* ── HEADER CARD ── */}
          <div style={{ ...glass, padding: 28, marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 80 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="font-heading" style={{ fontSize: 28, fontWeight: 700, color: 'white' }}>{initials}</span>
              </div>
              <span style={{ background: '#DBEAFE', color: '#1E40AF', borderRadius: 100, padding: '4px 12px', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
                Level {progress.currentLevel || 1}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <h1 className="font-heading" style={{ fontSize: 26, fontWeight: 700, color: '#0A1628', marginBottom: 4 }}>{name}</h1>
                  <p style={{ fontSize: 14, color: '#4B5563', fontFamily: 'var(--font-body)', marginBottom: 4 }}>{auth?.email || '—'}</p>
                  <p style={{ fontSize: 13, color: '#4B5563', fontFamily: 'var(--font-body)', marginBottom: 6 }}>Member since {memberSince}</p>
                  <span style={{ background: '#F0F4FF', borderRadius: 100, padding: '4px 12px', fontSize: 13, fontFamily: 'var(--font-body)', color: '#0A1628' }}>
                    {roleTag}
                  </span>
                </div>
                <button
                  onClick={() => setEditOpen(o => !o)}
                  style={{ minHeight: 44, padding: '0 20px', background: 'transparent', color: '#0A1628', border: '1.5px solid rgba(30,64,175,0.2)', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                >
                  {editOpen ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>

          {/* ── EDIT FORM ── */}
          <AnimatePresence>
            {editOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', marginBottom: 20 }}
              >
                <EditProfileForm profile={profile} onSave={handleSave} onCancel={() => setEditOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── STATS GRID ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { emoji: '⭐', label: 'Total XP', value: xpVal, mono: true },
              { emoji: '🔥', label: 'Day Streak', value: `${progress.streak || 0}`, sub: 'days', mono: true },
              { emoji: '📚', label: 'Lessons Done', value: `${completed.length}/40`, mono: true },
              { emoji: '🎯', label: 'Avg Accuracy', value: avgAccuracy !== null ? `${avgAccuracy}%` : '—', mono: true },
              { emoji: '🔥', label: 'Quiz Streak', value: `${progress.dailyQuizStreak || 0}`, sub: 'days', mono: true },
            ].map((s) => (
              <div key={s.label} style={{ ...glass, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.emoji}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 30, fontWeight: 700, color: '#0A1628' }}>{s.value}</div>
                {s.sub && <div style={{ fontSize: 12, color: '#4B5563', fontFamily: 'var(--font-body)' }}>{s.sub}</div>}
                <div style={{ fontSize: 13, color: '#4B5563', fontFamily: 'var(--font-body)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── LEADERBOARD PRIVACY ── */}
          <div style={{
            background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(30,64,175,0.15)',
            borderRadius: 16, padding: 20, marginBottom: 20,
          }}>
            <h2 className="font-heading" style={{ fontSize: 18, fontWeight: 700, color: '#0A1628', marginBottom: 16 }}>
              Leaderboard Privacy
            </h2>

            {/* Toggle 1 — Anonymous */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, minHeight: 56, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#0A1628' }}>Appear as Anonymous</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563', marginTop: 3, lineHeight: 1.5 }}>
                  Your name shows as "Anonymous 🎭" on all leaderboards. Your rank and score are still visible.
                </div>
              </div>
              <div
                onClick={() => {
                  if (progress.leaderboardOptOut) return; // opt-out takes priority
                  const val = !progress.leaderboardAnonymous;
                  const updated = { ...progress, leaderboardAnonymous: val };
                  setProgress(updated);
                  localStorage.setItem('vedicmind_progress', JSON.stringify(updated));
                  showToast(val ? "You'll appear as Anonymous on leaderboards" : 'Your name is now visible on leaderboards');
                }}
                style={{
                  width: 44, height: 24, borderRadius: 99, cursor: progress.leaderboardOptOut ? 'not-allowed' : 'pointer', flexShrink: 0, marginTop: 2,
                  background: progress.leaderboardAnonymous && !progress.leaderboardOptOut ? '#0A1628' : '#D1D5DB',
                  position: 'relative', transition: 'background 0.2s', opacity: progress.leaderboardOptOut ? 0.4 : 1,
                }}
              >
                <div style={{
                  position: 'absolute', top: 3,
                  left: progress.leaderboardAnonymous && !progress.leaderboardOptOut ? 23 : 3,
                  width: 18, height: 18, borderRadius: '50%', background: 'white',
                  transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }} />
              </div>
            </div>

            {/* Toggle 2 — Opt-out */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, minHeight: 56, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#0A1628' }}>Hide me from leaderboards</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563', marginTop: 3, lineHeight: 1.5 }}>
                  You won't appear in any leaderboard. You can still view rankings but others won't see you.
                </div>
              </div>
              <div
                onClick={() => {
                  const val = !progress.leaderboardOptOut;
                  const updated = { ...progress, leaderboardOptOut: val, ...(val ? { leaderboardAnonymous: false } : {}) };
                  setProgress(updated);
                  localStorage.setItem('vedicmind_progress', JSON.stringify(updated));
                  showToast(val ? "You're now hidden from all leaderboards" : "You're visible on leaderboards again");
                }}
                style={{
                  width: 44, height: 24, borderRadius: 99, cursor: 'pointer', flexShrink: 0, marginTop: 2,
                  background: progress.leaderboardOptOut ? '#0A1628' : '#D1D5DB',
                  position: 'relative', transition: 'background 0.2s',
                }}
              >
                <div style={{
                  position: 'absolute', top: 3,
                  left: progress.leaderboardOptOut ? 23 : 3,
                  width: 18, height: 18, borderRadius: '50%', background: 'white',
                  transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }} />
              </div>
            </div>

            {/* Info note */}
            <div style={{ background: '#F0F4FF', border: '1px solid rgba(30,64,175,0.15)', borderRadius: 8, padding: 12, marginTop: 4 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563', lineHeight: 1.5 }}>
                Your name always appears as First + Last Initial (e.g. Priya S.) to protect your privacy. Full names are never shown to other students.
              </span>
            </div>
          </div>

          {/* ── BADGES ── */}
          <div style={{ ...glass, padding: 24, marginBottom: 20 }}>
            <h2 className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 20 }}>All Badges</h2>
            <BadgeGrid badges={progress.badges || []} />
          </div>

          {/* ── PRACTICE HISTORY ── */}
          <div style={{ ...glass, padding: 24, marginBottom: 20 }}>
            <h2 className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 16 }}>Practice History</h2>
            {practiceHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <p style={{ fontSize: 15, color: '#4B5563', fontFamily: 'var(--font-body)', marginBottom: 16 }}>
                  No practice sessions yet. Head to Practice to get started! ⚡
                </p>
                <Link to="/practice">
                  <button style={{ minHeight: 44, padding: '0 24px', background: '#0A1628', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    Go to Practice →
                  </button>
                </Link>
              </div>
            ) : (
              <>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 14 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(30,64,175,0.1)' }}>
                        {['Date', 'Mode', 'Score', 'Accuracy', 'XP'].map(h => (
                          <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#4B5563', fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleHistory.map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(30,64,175,0.03)', borderBottom: '1px solid rgba(30,64,175,0.05)' }}>
                          <td style={{ padding: '10px 12px', color: '#4B5563' }}>{row.date}</td>
                          <td style={{ padding: '10px 12px', color: '#0A1628', fontWeight: 600, textTransform: 'capitalize' }}>{row.mode}</td>
                          <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: '#0A1628' }}>{row.score}</td>
                          <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: '#10B981' }}>{row.accuracy}%</td>
                          <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: '#F59E0B' }}>+{row.xpEarned}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {practiceHistory.length > 10 && !showAllHistory && (
                  <button onClick={() => setShowAllHistory(true)} style={{ marginTop: 12, background: 'none', border: 'none', color: '#3B82F6', fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    Show More ({practiceHistory.length - 10} more)
                  </button>
                )}
              </>
            )}
          </div>

          {/* ── SHARE STORY + REPORT CARD ── */}
          <div style={{ ...glass, padding: 20, marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <button
              onClick={() => navigate('/reviews')}
              style={{ flex: 1, minHeight: 44, minWidth: 160, background: '#0A1628', color: 'white', border: 'none', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              💬 Share Your Story
            </button>
            <button
              onClick={() => navigate('/report-card')}
              style={{ flex: 1, minHeight: 44, minWidth: 160, background: 'transparent', color: '#0A1628', border: '1.5px solid rgba(30,64,175,0.2)', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              📊 Weekly Report Card
            </button>
          </div>

          {/* ── DANGER ZONE ── */}
          <div style={{ ...glass, padding: 24 }}>
            <button onClick={() => setDangerOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#9CA3AF', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 6 }}>
              ⚠️ Reset & Account Settings {dangerOpen ? '▲' : '▼'}
            </button>
            <AnimatePresence>
              {dangerOpen && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ paddingTop: 20, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    <button
                      onClick={() => setResetModal(true)}
                      style={{ minHeight: 44, padding: '0 24px', background: '#FEF2F2', color: '#EF4444', border: '1.5px solid #EF4444', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                    >
                      Reset All Progress
                    </button>
                    <button
                      onClick={handleSignOut}
                      style={{ minHeight: 44, padding: '0 24px', background: '#0A1628', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                    >
                      Sign Out
                    </button>
                    <button
                      onClick={() => setDeleteModal(true)}
                      style={{ minHeight: 44, padding: '0 24px', background: '#7F1D1D', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                    >
                      🗑️ Delete Account
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      </main>

      {/* Reset Confirmation Modal */}
      {resetModal && <ResetConfirmModal onConfirm={handleReset} onCancel={() => setResetModal(false)} />}

      {/* Delete Account Modal */}
      {deleteModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={() => setDeleteModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(10,22,40,0.6)' }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ position: 'relative', background: 'white', borderRadius: 16, padding: 32, maxWidth: 400, width: '100%', boxShadow: '0 20px 60px rgba(10,22,40,0.3)', textAlign: 'center' }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
            <h2 className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#7F1D1D', marginBottom: 12 }}>Delete Account?</h2>
            <p style={{ fontSize: 14, color: '#4B5563', fontFamily: 'var(--font-body)', lineHeight: 1.6, marginBottom: 24 }}>
              This will permanently delete your account and all data — XP, streaks, progress, and badges. <strong>This cannot be undone.</strong>
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleDeleteAccount}
                style={{ minHeight: 44, padding: '0 24px', background: '#7F1D1D', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              >
                Yes, Delete My Account
              </button>
              <button
                onClick={() => setDeleteModal(false)}
                style={{ minHeight: 44, padding: '0 24px', background: 'transparent', color: '#0A1628', border: '1.5px solid rgba(30,64,175,0.2)', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* In-page toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            style={{
              position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
              background: 'white', borderLeft: '4px solid #10B981',
              borderRadius: 12, padding: '12px 20px', fontSize: 14,
              fontFamily: 'var(--font-body)', color: '#0A1628',
              boxShadow: '0 4px 20px rgba(10,22,40,0.15)', minWidth: 200,
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}