import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import usePullToRefresh from '@/hooks/usePullToRefresh';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import {
  generateLeaderboard, getUserEntry, getTopN,
  getUserPercentile, filterByPeriod,
} from '@/lib/leaderboardEngine';

const glass = {
  background: 'rgba(255,255,255,0.75)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(30,64,175,0.15)',
  boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
  borderRadius: 16,
};

const avatarColors = { 0: '#FEF3C7', 1: '#F3F4F6', 2: '#FEF9EE' };
const scoreColors  = { 0: '#F59E0B', 1: '#6B7280', 2: '#D97706' };
const baseHeights  = { 0: 100, 1: 70, 2: 50 };
const medals = ['🥇', '🥈', '🥉'];

function Toggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 100, cursor: 'pointer',
        background: value ? '#10B981' : '#D1D5DB',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 2, left: value ? 22 : 2,
        width: 20, height: 20, borderRadius: '50%', background: 'white',
        transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </div>
  );
}

export default function LeaderboardPage() {
  const navigate = useNavigate();

  const auth     = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_auth')) || null; } catch { return null; } })();
  const profile  = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_profile')) || {}; } catch { return {}; } })();
  const [progress, setProgress] = useState(() => { try { return JSON.parse(localStorage.getItem('vedicmind_progress')) || {}; } catch { return {}; } });

  React.useEffect(() => {
    if (!auth) navigate('/auth');
  }, []);

  const classBoard  = useMemo(() => generateLeaderboard(profile, progress, 'class'),  []);
  const schoolBoard = useMemo(() => generateLeaderboard(profile, progress, 'school'), []);
  const globalBoard = useMemo(() => generateLeaderboard(profile, progress, 'global'), []);

  const [activeTab, setActiveTab]       = useState('vedic'); // vedic | aptitude
  const [activeScope, setActiveScope]   = useState('class');
  const [activePeriod, setActivePeriod] = useState('alltime');
  const [visibleCount, setVisibleCount] = useState(20);

  const base = activeScope === 'class' ? classBoard : activeScope === 'school' ? schoolBoard : globalBoard;
  const activeBoard = useMemo(() => filterByPeriod(base, activePeriod), [base, activePeriod]);

  const userEntry   = getUserEntry(activeBoard);
  const top3        = getTopN(activeBoard, 3);
  const percentile  = getUserPercentile(activeBoard);
  const tableRows   = activeBoard.slice(3, visibleCount + 3);
  const remaining   = activeBoard.length - 3 - visibleCount;
  const userVisible = userEntry && (userEntry.rank <= 3 || (userEntry.rank - 3) <= visibleCount);

  const { pulling, pullDistance } = usePullToRefresh(() => window.location.reload());

  const handleOptOut = (val) => {
    const updated = { ...progress, leaderboardOptOut: !val };
    setProgress(updated);
    localStorage.setItem('vedicmind_progress', JSON.stringify(updated));
    window.location.reload(); // re-generate leaderboard with new opt-out state
  };

  const SCOPES = [
    { id: 'class',  label: `📚 Class · ${classBoard.length} students` },
    { id: 'school', label: `🏫 School · ${schoolBoard.length} students` },
    { id: 'global', label: `🌍 Global · ${globalBoard.length} students` },
  ];
  const PERIODS = [
    { id: 'daily',   label: 'Daily' },
    { id: 'weekly',  label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'alltime', label: 'All Time' },
  ];

  const podiumOrder = [1, 0, 2]; // silver, gold, bronze

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <DashboardNavbar />
      <style>{`
        @media(max-width:640px){
          .lb-header-row{flex-direction:column!important;gap:16px!important;}
          .lb-rank-card{width:100%!important;text-align:left!important;display:flex!important;align-items:center!important;gap:24px!important;}
          .lb-scope-scroll{overflow-x:auto!important;-webkit-overflow-scrolling:touch!important;}
          .lb-scope-scroll::-webkit-scrollbar{display:none!important;}
          .lb-podium-card{padding:8px!important;}
          .lb-podium-avatar{width:40px!important;height:40px!important;font-size:14px!important;}
          .lb-hide-mobile{display:none!important;}
          .lb-stats-grid{grid-template-columns:1fr!important;}
          .lb-table-cols{grid-template-columns:40px 1fr 80px 60px!important;}
        }
        @media(min-width:641px){
          .lb-table-cols{grid-template-columns:40px 1fr 80px 90px 60px 60px;}
        }
      `}</style>

      {pulling && (
        <div style={{ textAlign: 'center', padding: '8px 0', fontSize: 13, color: '#3B82F6', fontFamily: 'var(--font-body)', transform: `translateY(${pullDistance * 0.4}px)`, transition: 'transform 0.1s' }}>
          {pullDistance >= 80 ? '↑ Release to refresh' : '↓ Pull to refresh'}
        </div>
      )}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 60px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* ── MODE TABS ── */}
          <div style={{ display: 'flex', gap: 4, background: 'white', borderRadius: 14, padding: 4, border: '1px solid rgba(30,64,175,0.12)', marginBottom: 24, width: 'fit-content' }}>
            {[{ id: 'vedic', label: '🧮 Vedic Maths' }, { id: 'aptitude', label: '🎯 Aptitude Zone' }].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                padding: '8px 20px', minHeight: 40, borderRadius: 10, border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14,
                background: activeTab === t.id ? '#0A1628' : 'transparent',
                color: activeTab === t.id ? 'white' : '#4B5563', transition: 'all 0.15s',
              }}>{t.label}</button>
            ))}
          </div>

          {/* ── PAGE HEADER ── */}
          <div className="lb-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <h1 className="font-heading" style={{ fontSize: 32, fontWeight: 700, color: '#0A1628', marginBottom: 6 }}>🏆 Leaderboard</h1>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#4B5563', margin: '0 0 8px' }}>See how you rank against other students</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563' }}>🔒 Names shown as First + Last Initial only</span>
                <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12, color: '#3B82F6', padding: 0 }}>
                  Change privacy settings →
                </button>
              </div>
            </div>
            {userEntry && (
              <div className="lb-rank-card" style={{ ...glass, padding: '12px 20px', textAlign: 'center', minWidth: 140 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Your Rank</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 700, color: '#0A1628', lineHeight: 1 }}>#{userEntry.rank}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#4B5563', marginTop: 2 }}>of {activeBoard.length} students</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#10B981', marginTop: 4 }}>↑{userEntry.movementAmount}</div>
                </div>
              </div>
            )}
          </div>

          {/* ── APTITUDE TAB CONTENT ── */}
          {activeTab === 'aptitude' && (() => {
            const history = progress.aptitudeHistory || [];
            const classGroup = profile.aptitudeClass ? (() => {
              const n = parseInt(profile.aptitudeClass);
              if (n <= 5) return 'Primary (1–5)';
              if (n <= 8) return 'Middle (6–8)';
              if (n <= 10) return 'Secondary (9–10)';
              return 'Intermediate (11–12)';
            })() : null;
            const bestScore = progress.aptitudeScore || 0;
            const totalAttempts = history.length;
            const allSutras = [...new Set(history.flatMap(h => h.sutras || []))];
            return (
              <div>
                {totalAttempts === 0 ? (
                  <div style={{ ...glass, padding: 40, textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
                    <h3 className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>No Aptitude Attempts Yet</h3>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#4B5563', marginBottom: 20 }}>
                      Complete some Aptitude Zone quizzes to see your stats here.
                    </p>
                    <button onClick={() => navigate('/aptitude')} style={{ minHeight: 48, padding: '0 28px', background: '#0A1628', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                      Go to Aptitude Zone →
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
                      {[
                        { label: '🏆 Best Score', value: bestScore, unit: 'pts' },
                        { label: '📝 Attempts', value: totalAttempts, unit: 'quizzes' },
                        { label: '⚡ Sutras Used', value: allSutras.length, unit: 'sutras' },
                        ...(classGroup ? [{ label: '🎓 Your Group', value: classGroup, unit: '' }] : []),
                      ].map((s, i) => (
                        <div key={i} style={{ ...glass, padding: 20, textAlign: 'center' }}>
                          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', marginBottom: 6 }}>{s.label}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: typeof s.value === 'string' ? 14 : 28, fontWeight: 700, color: '#0A1628' }}>{s.value}</div>
                          {s.unit && <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF' }}>{s.unit}</div>}
                        </div>
                      ))}
                    </div>
                    {allSutras.length > 0 && (
                      <div style={{ ...glass, padding: 20, marginBottom: 20 }}>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: '#0A1628', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Vedic Sutras Mastered</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {allSutras.map(s => (
                            <span key={s} style={{ background: '#DBEAFE', color: '#1E40AF', borderRadius: 100, padding: '5px 14px', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600 }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ ...glass, padding: 20 }}>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: '#0A1628', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recent History</div>
                      {history.slice(-5).reverse().map((h, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < Math.min(4, history.length - 1) ? '1px solid rgba(30,64,175,0.07)' : 'none' }}>
                          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563' }}>{new Date(h.date).toLocaleDateString()}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: '#0A1628' }}>{h.score} pts</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── VEDIC LEADERBOARD ── */}
          {activeTab === 'vedic' && <>
          {/* ── SCOPE TABS ── */}
          <div className="lb-scope-scroll" style={{ marginBottom: 12 }}>
            <div style={{ display: 'inline-flex', gap: 4, background: 'white', borderRadius: 14, padding: 4, border: '1px solid rgba(30,64,175,0.12)', whiteSpace: 'nowrap' }}>
              {SCOPES.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setActiveScope(s.id); setVisibleCount(20); }}
                  style={{
                    padding: '8px 20px', minHeight: 40, borderRadius: 10, border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14,
                    background: activeScope === s.id ? '#0A1628' : 'transparent',
                    color: activeScope === s.id ? 'white' : '#4B5563',
                    transition: 'all 0.15s',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── PERIOD PILLS ── */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {PERIODS.map(p => (
              <button
                key={p.id}
                onClick={() => setActivePeriod(p.id)}
                style={{
                  padding: '6px 16px', minHeight: 36, borderRadius: 100, cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: 13, border: '1px solid',
                  background: activePeriod === p.id ? '#DBEAFE' : 'white',
                  color: activePeriod === p.id ? '#1E40AF' : '#4B5563',
                  borderColor: activePeriod === p.id ? '#1E40AF' : 'rgba(30,64,175,0.12)',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* ── TOP 3 PODIUM ── */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
            {podiumOrder.map(idx => {
              const entry = top3[idx];
              if (!entry) return null;
              return (
                <div key={entry.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: 200 }}>
                  {/* Card */}
                  <div className="lb-podium-card" style={{
                    background: 'white', borderRadius: '16px 16px 0 0', padding: 16,
                    textAlign: 'center', boxShadow: '0 -4px 20px rgba(10,22,40,0.08)', width: '100%',
                  }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{medals[idx]}</div>
                    <div
                      className="lb-podium-avatar"
                      style={{
                        width: 52, height: 52, borderRadius: '50%',
                        background: avatarColors[idx],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: '#0A1628',
                        border: entry.isCurrentUser ? '3px solid #3B82F6' : 'none',
                      }}
                    >
                      {entry.name.charAt(0)}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: '#0A1628', marginTop: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                      {entry.isAnonymous ? 'Anonymous 🎭' : entry.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#4B5563' }}>{entry.grade}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 18, color: scoreColors[idx], marginTop: 4 }}>{entry.score}</div>
                  </div>
                  {/* Base */}
                  <div style={{
                    background: avatarColors[idx], width: '100%',
                    height: baseHeights[idx],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 24, color: scoreColors[idx] }}>
                      {idx + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── TABLE HEADER ── */}
          <div className="lb-table-cols" style={{ display: 'grid', padding: '8px 16px', gap: 8, marginBottom: 6 }}>
            {['RANK', 'STUDENT', <span key="g" className="lb-hide-mobile">GRADE</span>, 'SCORE', <span key="str" className="lb-hide-mobile">STREAK</span>, 'CHANGE'].map((h, i) => (
              <div key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
            ))}
          </div>

          {/* ── TABLE ROWS (rank 4+) ── */}
          {tableRows.map(entry => {
            const isUser = entry.isCurrentUser;
            return (
              <div
                key={entry.id}
                className="lb-table-cols"
                style={{
                  display: 'grid', gap: 8, alignItems: 'center',
                  background: isUser ? 'rgba(59,130,246,0.06)' : 'white',
                  border: isUser ? '1.5px solid rgba(59,130,246,0.25)' : '1px solid transparent',
                  borderRadius: 12, marginBottom: 6, padding: '10px 16px',
                }}
              >
                {/* Rank */}
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: entry.rank <= 10 ? '#0A1628' : '#9CA3AF' }}>
                  {entry.rank}
                </div>
                {/* Student */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: isUser ? '#0A1628' : '#F0F4FF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
                    color: isUser ? 'white' : '#0A1628',
                  }}>
                    {entry.name.charAt(0)}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: '#0A1628', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entry.isAnonymous ? 'Anonymous 🎭' : entry.name.slice(0, 20) + (entry.name.length > 20 ? '…' : '')}
                      {isUser && <span style={{ color: '#3B82F6' }}> (You)</span>}
                    </div>
                  </div>
                </div>
                {/* Grade */}
                <div className="lb-hide-mobile" style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563' }}>{entry.grade}</div>
                {/* Score */}
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 16, color: '#0A1628' }}>{entry.score}</div>
                {/* Streak */}
                <div className="lb-hide-mobile" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#F59E0B' }}>🔥{entry.streak}</div>
                {/* Change */}
                <div style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
                  color: entry.movement === 'up' ? '#10B981' : entry.movement === 'down' ? '#EF4444' : '#9CA3AF',
                }}>
                  {entry.movement === 'up' ? `↑${entry.movementAmount}` : entry.movement === 'down' ? `↓${entry.movementAmount}` : '─'}
                </div>
              </div>
            );
          })}

          {/* Show more */}
          {remaining > 0 && (
            <button
              onClick={() => setVisibleCount(c => c + 20)}
              style={{
                width: '100%', minHeight: 44, background: 'white',
                border: '1px solid rgba(30,64,175,0.15)', borderRadius: 10,
                padding: 10, fontFamily: 'var(--font-body)', fontSize: 14,
                color: '#4B5563', textAlign: 'center', cursor: 'pointer', marginBottom: 8,
              }}
            >
              Show more ({remaining} more students)
            </button>
          )}

          {/* Pinned user row if not visible */}
          {!userVisible && userEntry && (
            <>
              <div style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF', margin: '8px 0' }}>─── Your position ───</div>
              {userEntry.isOptedOut ? (
                <div style={{ background: 'rgba(30,64,175,0.04)', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: '12px 16px' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', fontStyle: 'italic' }}>
                    You are hidden from the leaderboard
                  </span>
                </div>
              ) : (
                <div
                  className="lb-table-cols"
                  style={{
                    display: 'grid', gap: 8, alignItems: 'center',
                    background: 'rgba(59,130,246,0.08)', border: '1.5px solid #3B82F6',
                    borderRadius: 12, padding: '10px 16px',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: '#3B82F6' }}>{userEntry.rank}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, color: 'white' }}>
                      {userEntry.name.charAt(0)}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: '#0A1628' }}>
                      {userEntry.name}<span style={{ color: '#3B82F6' }}> (You)</span>
                    </div>
                  </div>
                  <div className="lb-hide-mobile" style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563' }}>{userEntry.grade}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 16, color: '#0A1628' }}>{userEntry.score}</div>
                  <div className="lb-hide-mobile" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#F59E0B' }}>🔥{userEntry.streak}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: '#10B981' }}>↑{userEntry.movementAmount}</div>
                </div>
              )}
            </>
          )}

          {/* ── USER STATS FOOTER ── */}
          <div style={{ ...glass, padding: 20, marginTop: 16 }}>
            <div className="lb-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 16 }}>
              {/* Percentile */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', marginBottom: 6 }}>📊 Your Percentile</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 28, color: percentile >= 75 ? '#10B981' : percentile >= 50 ? '#F59E0B' : '#4B5563' }}>
                  {percentile}%
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF' }}>of {activeScope} students</div>
              </div>
              {/* Score */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', marginBottom: 6 }}>⭐ Performance Score</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 28, color: '#0A1628' }}>{userEntry?.score ?? 0} pts</div>
              </div>
              {/* Rank */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', marginBottom: 6 }}>🏆 Your Rank</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 28, color: '#0A1628' }}>#{userEntry?.rank ?? '—'}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(30,64,175,0.1)', paddingTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', fontWeight: 500 }}>Show me on leaderboard</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563', marginTop: 2 }}>Off = you appear as Anonymous 🎭</div>
                </div>
                <Toggle value={!progress.leaderboardOptOut} onChange={handleOptOut} />
              </div>
            </div>
          </div>

          </>}

        </motion.div>
      </main>
    </div>
  );
}