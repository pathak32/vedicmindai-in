import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { getUserPlan } from '@/lib/planEngine';
import { useLanguage } from '@/lib/LanguageContext';

const glass = {
  background: 'rgba(255,255,255,0.75)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(30,64,175,0.15)',
  boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
  borderRadius: 16,
};

function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const mon = new Date(now); mon.setDate(now.getDate() - ((day + 6) % 7));
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  const fmt = d => d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  return `${fmt(mon)} – ${fmt(sun)}, ${sun.getFullYear()}`;
}

function getWeeklyStats(progress) {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  weekStart.setHours(0, 0, 0, 0);

  const history = progress.practiceHistory || [];
  const thisWeek = history.filter(h => h.date && new Date(h.date) >= weekStart);

  // XP this week: rough estimate from practice sessions
  const xpThisWeek = thisWeek.reduce((s, h) => s + (h.xpEarned || 0), 0);

  // Daily quiz scores this week
  const quizHistory = progress.dailyQuizHistory || [];
  const weekQuizzes = quizHistory.filter(q => q.date && new Date(q.date) >= weekStart);
  const avgQuizScore = weekQuizzes.length
    ? Math.round(weekQuizzes.reduce((s, q) => s + (q.score || 0), 0) / weekQuizzes.length)
    : null;

  // Lessons completed this week (approximate from completedLessons count)
  const lessonsThisWeek = Math.min(thisWeek.length, (progress.completedLessons || []).length);

  return { xpThisWeek, avgQuizScore, lessonsThisWeek };
}

function MetricCard({ icon, label, value, sub, color }) {
  return (
    <div style={{ ...glass, padding: 20, textAlign: 'center' }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: color || '#0A1628', lineHeight: 1 }}>{value ?? '—'}</div>
      {sub && <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563', marginTop: 2 }}>{sub}</div>}
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF', marginTop: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  );
}

export default function ReportCardPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const plan = getUserPlan();
  const auth = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_auth') || '{}'); } catch { return {}; } })();
  const profile = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_profile') || '{}'); } catch { return {}; } })();
  const progress = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_progress') || '{}'); } catch { return {}; } })();

  const name = profile.name || auth.name || t('defaultStudentName');
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const { xpThisWeek, avgQuizScore, lessonsThisWeek } = getWeeklyStats(progress);

  // If not Pro/Family, show upgrade wall
  if (plan !== 'pro' && plan !== 'family') {
    return (
      <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
        <DashboardNavbar />
        <main style={{ maxWidth: 540, margin: '60px auto', padding: '0 16px' }}>
          <div style={{ ...glass, padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📊</div>
            <h1 className="font-heading" style={{ fontSize: 24, fontWeight: 700, color: '#0A1628', marginBottom: 10 }}>{t('rcUpgradeTitle')}</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#4B5563', lineHeight: 1.6, marginBottom: 24 }}>
              {t('rcUpgradeDesc')}
            </p>
            <button
              onClick={() => navigate('/pricing')}
              style={{ padding: '12px 32px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, cursor: 'pointer', minHeight: 48 }}
            >
              {t('rcUpgradeBtn')}
            </button>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF', marginTop: 16 }}>{t('rcProFrom')}</p>
          </div>
        </main>
      </div>
    );
  }

  const metrics = [
    { icon: '📚', label: t('rcLessonsThisWeek'), value: lessonsThisWeek, color: '#3B82F6' },
    { icon: '🎯', label: t('rcQuizAvgScore'), value: avgQuizScore !== null ? `${avgQuizScore}` : '—', sub: t('rcPoints'), color: '#F59E0B' },
    { icon: '🔥', label: t('rcCurrentStreak'), value: progress.streak || 0, sub: t('rcDays'), color: '#EF4444' },
    { icon: '⭐', label: t('rcXpThisWeek'), value: `+${xpThisWeek}`, color: '#10B981' },
    { icon: '🧮', label: t('rcAptitudeQs'), value: '—', color: '#8B5CF6' },
    { icon: '🏆', label: t('rcRankMovement'), value: '—', sub: t('rcVsLastWeek'), color: '#F59E0B' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <DashboardNavbar />
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <div style={{ ...glass, padding: 28, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="font-heading" style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>{initials}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
                  {t('rcUpgradeTitle')}
                </div>
                <h1 className="font-heading" style={{ fontSize: 24, fontWeight: 700, color: '#0A1628', marginBottom: 4 }}>{name}</h1>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}>{t('rcWeekOf')} {getWeekRange()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ background: '#DBEAFE', color: '#1E40AF', borderRadius: 99, padding: '4px 14px', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                  {t('rcLevel')} {progress.currentLevel || 1}
                </span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: '#0A1628', marginTop: 8 }}>
                  {progress.totalXP || 0} XP
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#9CA3AF' }}>{t('rcTotalXpLabel')}</div>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <style>{`@media(min-width:480px){.rc-grid{grid-template-columns:repeat(3,1fr)!important;}}`}</style>
          <div className="rc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14, marginBottom: 24 }}>
            {metrics.map((m, i) => <MetricCard key={i} {...m} />)}
          </div>

          {/* Performance Summary */}
          <div style={{ ...glass, padding: 24, marginBottom: 24 }}>
            <h2 className="font-heading" style={{ fontSize: 20, fontWeight: 700, color: '#0A1628', marginBottom: 16 }}>{t('rcPerformanceSummary')}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div style={{ background: '#ECFDF5', borderRadius: 12, padding: 16 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#065F46', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{t('rcStrongestTopic')}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628' }}>{t('rcStrongestTopicValue')}</div>
              </div>
              <div style={{ background: '#FEF2F2', borderRadius: 12, padding: 16 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#991B1B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{t('rcNeedsPractice')}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628' }}>{t('rcNeedsPracticeValue')}</div>
              </div>
            </div>
            <div style={{ background: '#F0F4FF', borderLeft: '4px solid #3B82F6', borderRadius: '0 12px 12px 0', padding: '14px 16px' }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#1E40AF', fontWeight: 600, marginBottom: 4 }}>{t('rcAiTip')}</div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', lineHeight: 1.6, margin: 0 }}>
                {progress.totalXP > 200 ? t('rcAiTipHigh') : t('rcAiTipLow')}
              </p>
            </div>
          </div>

          {/* Share Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: t('rcShareTitle'), text: `I earned ${xpThisWeek} XP this week on VedicMind! 🧮 Check out the app.`, url: 'https://vedicmindai.in' });
                } else {
                  navigator.clipboard.writeText(`My VedicMind Week: ${xpThisWeek} XP earned, ${lessonsThisWeek} lessons done! 🧮 vedicmindai.in`);
                  alert(t('rcShareCopied'));
                }
              }}
              style={{ padding: '12px 32px', background: '#0A1628', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, cursor: 'pointer', minHeight: 48 }}
            >
              {t('rcShareBtn')}
            </button>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF', marginTop: 8 }}>{t('rcShareHint')}</p>
          </div>

        </motion.div>
      </main>
    </div>
  );
}
