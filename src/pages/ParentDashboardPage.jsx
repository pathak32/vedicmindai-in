import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { useLanguage } from '@/lib/LanguageContext';
import { getSupabase } from '@/lib/supabaseClient';
import { getUserProgress } from '@/lib/supabaseDataService';
import { RA_LEVEL1_CHAPTERS } from '@/data/reasoningAptitudeLevel1Content';

const card = { background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(10,22,40,0.06)', marginBottom: 16 };

function todayString() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// This is the parent-facing view Hitesh flagged as the top gap vs competitors
// (Cuemath/Prodigy/Vedantu all lead with parent reporting; VedicMindAI tracked
// the data but had no dedicated view for a parent to actually see it). Same
// underlying data as the student Dashboard, deliberately reframed: report
// language ("completed this week") instead of gamified language (XP, streaks
// as the primary framing) — a parent wants to know "is this working," not
// "what's my child's score."
export default function ParentDashboardPage() {
  const { user } = useVedicAuth();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const sb = await getSupabase();
        const [progressRes, dailyQuizRes, weeklyExamRes, reasoningRes, battleRes] = await Promise.all([
          getUserProgress(user.id),
          sb.from('daily_quiz_results').select('quiz_date, score, total_possible').eq('user_id', user.id).order('quiz_date', { ascending: false }).limit(14),
          sb.from('weekly_exam_results').select('score, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(4),
          sb.from('reasoning_progress').select('chapter_id, best_score, completed').eq('user_id', user.id),
          sb.from('battle_rooms').select('id, status, creator_id, opponent_id, match_winner_id').or(`creator_id.eq.${user.id},opponent_id.eq.${user.id}`),
        ]);

        const progress = progressRes || {};
        const dailyQuizzes = dailyQuizRes.data || [];
        const weeklyExams = weeklyExamRes.data || [];
        const reasoningRows = reasoningRes.data || [];
        const battles = battleRes.data || [];

        const today = todayString();
        const last7 = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        });
        const quizzesThisWeek = dailyQuizzes.filter(q => last7.includes(q.quiz_date));

        const totalReasoningChapters = RA_LEVEL1_CHAPTERS.length;
        const reasoningCompleted = reasoningRows.filter(r => r.completed).length;

        const battlesWon = battles.filter(b => b.status === 'completed' && b.match_winner_id === user.id).length;
        const battlesPlayed = battles.filter(b => b.status === 'completed').length;

        setData({
          totalXP: progress.total_xp || 0,
          lessonsCompleted: (progress.completed_lessons || []).length,
          streak: progress.daily_quiz_streak || 0,
          lastActive: progress.last_activity_date,
          quizzesThisWeek: quizzesThisWeek.length,
          quizAvgThisWeek: quizzesThisWeek.length
            ? Math.round(quizzesThisWeek.reduce((sum, q) => sum + (q.score / (q.total_possible || 110)) * 100, 0) / quizzesThisWeek.length)
            : null,
          weeklyExams,
          reasoningCompleted,
          totalReasoningChapters,
          battlesWon,
          battlesPlayed,
        });
      } catch (e) {
        console.error('ParentDashboard load error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  const T = (en, hi) => (language === 'hi' ? hi : en);

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <DashboardNavbar />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 60px' }}>
        <Link to="/dashboard" style={{ color: '#6B7280', fontSize: 14, textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}>
          ← {T('Back to Dashboard', 'डैशबोर्ड पर वापस')}
        </Link>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 700, color: '#0A1628', marginBottom: 4 }}>
          {T("Your Child's Progress", 'आपके बच्चे की प्रगति')}
        </h1>
        <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24, fontFamily: 'var(--font-body)' }}>
          {T('A weekly summary — updated automatically as they learn.', 'साप्ताहिक सारांश — सीखते ही अपने आप अपडेट होता है।')}
        </p>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#6B7280', padding: 40 }}>{T('Loading...', 'लोड हो रहा है...')}</p>
        ) : !data ? (
          <p style={{ textAlign: 'center', color: '#6B7280', padding: 40 }}>{T('No activity yet.', 'अभी तक कोई गतिविधि नहीं।')}</p>
        ) : (
          <>
            <div style={card}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0A1628', marginBottom: 16, fontFamily: 'var(--font-heading)' }}>
                {T('This Week at a Glance', 'इस सप्ताह की झलक')}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 16 }}>
                <Stat label={T('Daily Quizzes Taken', 'दैनिक क्विज़')} value={data.quizzesThisWeek} suffix="/7" />
                <Stat label={T('Average Score', 'औसत स्कोर')} value={data.quizAvgThisWeek != null ? `${data.quizAvgThisWeek}%` : '—'} />
                <Stat label={T('Current Streak', 'मौजूदा स्ट्रीक')} value={data.streak} suffix={T(' days', ' दिन')} />
                <Stat label={T('Last Active', 'आखिरी सक्रिय')} value={data.lastActive === todayString() ? T('Today', 'आज') : (data.lastActive || T('Not yet', 'अभी नहीं'))} />
              </div>
            </div>

            <div style={card}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0A1628', marginBottom: 16, fontFamily: 'var(--font-heading)' }}>
                {T('Vedic Maths Progress', 'वैदिक गणित प्रगति')}
              </h3>
              <ProgressBar label={T('Lessons Completed (of 36)', 'पूर्ण पाठ (36 में से)')} value={data.lessonsCompleted} total={36} color="#3B82F6" />
              <p style={{ fontSize: 13, color: '#6B7280', marginTop: 8, fontFamily: 'var(--font-body)' }}>
                {T('Total XP earned:', 'कुल अर्जित XP:')} <strong>{data.totalXP}</strong>
              </p>
            </div>

            <div style={card}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0A1628', marginBottom: 16, fontFamily: 'var(--font-heading)' }}>
                {T('Intelligent Reasoning Progress', 'बौद्धिक तर्क प्रगति')}
              </h3>
              <ProgressBar label={T('Chapters Completed', 'पूर्ण अध्याय')} value={data.reasoningCompleted} total={data.totalReasoningChapters} color="#7C3AED" />
            </div>

            <div style={card}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0A1628', marginBottom: 16, fontFamily: 'var(--font-heading)' }}>
                {T('Weekly Exams', 'साप्ताहिक परीक्षा')}
              </h3>
              {data.weeklyExams.length === 0 ? (
                <p style={{ color: '#9CA3AF', fontSize: 13, fontFamily: 'var(--font-body)' }}>{T('No weekly exams taken yet.', 'अभी तक कोई साप्ताहिक परीक्षा नहीं दी गई।')}</p>
              ) : (
                data.weeklyExams.map((e, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < data.weeklyExams.length - 1 ? '1px solid #F3F4F6' : 'none', fontFamily: 'var(--font-body)', fontSize: 14 }}>
                    <span style={{ color: '#6B7280' }}>{new Date(e.created_at).toLocaleDateString()}</span>
                    <strong style={{ color: '#0A1628' }}>{e.score}%</strong>
                  </div>
                ))
              )}
            </div>

            {data.battlesPlayed > 0 && (
              <div style={card}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0A1628', marginBottom: 12, fontFamily: 'var(--font-heading)' }}>
                  {T('Battle Mode', 'बैटल मोड')}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}>
                  {T(`Played ${data.battlesPlayed} battles, won ${data.battlesWon}.`, `${data.battlesPlayed} मुकाबले खेले, ${data.battlesWon} जीते।`)}
                </p>
              </div>
            )}

            <div style={{ ...card, background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <p style={{ fontSize: 13, color: '#166534', margin: 0, fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
                💡 {T(
                  'This summary updates automatically — no need to ask your child how they\'re doing, just check back here.',
                  'यह सारांश अपने आप अपडेट होता है — अपने बच्चे से पूछने की ज़रूरत नहीं, बस यहाँ देख लीजिए।'
                )}
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value, suffix = '' }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: '#0A1628' }}>{value}{suffix}</div>
      <div style={{ fontSize: 12, color: '#6B7280', fontFamily: 'var(--font-body)' }}>{label}</div>
    </div>
  );
}

function ProgressBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#4B5563', marginBottom: 6, fontFamily: 'var(--font-body)' }}>
        <span>{label}</span>
        <span>{value}/{total} ({pct}%)</span>
      </div>
      <div style={{ height: 10, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.3s' }} />
      </div>
    </div>
  );
}
