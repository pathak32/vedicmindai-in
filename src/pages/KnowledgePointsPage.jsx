import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { useLanguage } from '@/lib/LanguageContext';
import { getSupabase } from '@/lib/supabaseClient';
import { recalculateMonthlyStatus, TIERS, pointsToNextTier } from '@/lib/knowledgePoints';

const card = { background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(10,22,40,0.06)', marginBottom: 16 };

export default function KnowledgePointsPage() {
  const { user } = useVedicAuth();
  const { language } = useLanguage();
  const [status, setStatus] = useState(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [annualLock, setAnnualLock] = useState(null);
  const [loading, setLoading] = useState(true);
  const T = (en, hi) => (language === 'hi' ? hi : en);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const result = await recalculateMonthlyStatus(user.id);
        setStatus(result);

        const sb = await getSupabase();
        const { data: profile } = await sb.from('profiles').select('plan').eq('id', user.id).maybeSingle();
        const annual = !!profile?.plan?.includes('_annual');
        setIsAnnual(annual);
        if (annual) {
          const { data: lock } = await sb.from('knowledge_points_annual_lock')
            .select('*').eq('user_id', user.id).order('subscription_start_date', { ascending: false }).limit(1).maybeSingle();
          setAnnualLock(lock);
        }
      } catch (e) {
        console.error('KnowledgePointsPage load error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  const next = status ? pointsToNextTier(status.totalPoints) : null;

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <DashboardNavbar />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 60px' }}>
        <Link to="/dashboard" style={{ color: '#6B7280', fontSize: 14, textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}>
          ← {T('Back to Dashboard', 'डैशबोर्ड पर वापस')}
        </Link>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: '#0A1628', marginBottom: 4 }}>
          🎯 {T('Knowledge Points', 'नॉलेज पॉइंट्स')}
        </h1>
        <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24, fontFamily: 'var(--font-body)' }}>
          {T('Earn points through real learning — redeem them for a real discount on your next subscription.',
             'असली सीखने से पॉइंट्स कमाएं — अपनी अगली सब्सक्रिप्शन पर असली छूट के लिए इस्तेमाल करें।')}
        </p>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#6B7280', padding: 40 }}>{T('Loading...', 'लोड हो रहा है...')}</p>
        ) : (
          <>
            {/* Current points + progress to next tier */}
            <div style={{ ...card, background: 'linear-gradient(135deg, #0A1628, #1E3A8A)', color: 'white' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 800 }}>
                {status?.totalPoints || 0}
              </div>
              <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>{T('Knowledge Points this month', 'इस महीने के नॉलेज पॉइंट्स')}</div>

              {next ? (
                <>
                  <div style={{ height: 10, background: 'rgba(255,255,255,0.2)', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ width: `${Math.min(100, (status.totalPoints / next.tier.points) * 100)}%`, height: '100%', background: '#FBBF24', borderRadius: 99 }} />
                  </div>
                  <p style={{ fontSize: 14, margin: 0 }}>
                    {T(`${next.pointsNeeded} points to unlock ${next.tier.discountPct}% off!`,
                       `${next.pointsNeeded} पॉइंट्स और चाहिए ${next.tier.discountPct}% छूट के लिए!`)}
                  </p>
                </>
              ) : (
                <p style={{ fontSize: 14, margin: 0, color: '#FBBF24', fontWeight: 700 }}>
                  🎉 {T('Maximum tier reached — 50% off unlocked!', 'अधिकतम स्तर हासिल — 50% छूट अनलॉक!')}
                </p>
              )}
            </div>

            {/* Tier ladder */}
            <div style={card}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0A1628', marginBottom: 16 }}>{T('Reward Tiers', 'रिवॉर्ड स्तर')}</h3>
              {[...TIERS].reverse().map((tier) => {
                const reached = (status?.totalPoints || 0) >= tier.points;
                return (
                  <div key={tier.points} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 16px', borderRadius: 10, marginBottom: 8,
                    background: reached ? '#F0FDF4' : '#F9FAFB', border: `1px solid ${reached ? '#BBF7D0' : '#E5E7EB'}`,
                  }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: reached ? '#059669' : '#6B7280' }}>
                      {reached ? '✅' : '🔒'} {tier.points} {T('points', 'पॉइंट्स')}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: reached ? '#059669' : '#9CA3AF' }}>
                      {tier.discountPct}% {T('off', 'छूट')}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Criteria checklist */}
            <div style={card}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0A1628', marginBottom: 6 }}>{T('This Month\'s Requirements', 'इस महीने की शर्तें')}</h3>
              <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>
                {T('All three must be met to redeem — points alone aren\'t enough.', 'रिडीम करने के लिए तीनों पूरी होनी चाहिए — सिर्फ पॉइंट्स काफी नहीं।')}
              </p>
              <CriteriaRow
                done={(status?.dailyQuizPct || 0) >= 50}
                label={T('Attempt at least 50% of Daily Quizzes', 'कम से कम 50% डेली क्विज़ करें')}
                sub={`${Math.round(status?.dailyQuizPct || 0)}%`}
              />
              <CriteriaRow
                done={!!status?.allWeeklyExamsGiven}
                label={T('Give every Weekly Exam this month', 'इस महीने की सभी साप्ताहिक परीक्षा दें')}
              />
              <CriteriaRow
                done={(status?.reasoningLessonsThisMonth || 0) >= 5 && (status?.mathsLessonsCompleted || 0) >= 5}
                label={T('Complete 5 Reasoning + 5 Vedic Maths lessons', '5 रीज़निंग + 5 वैदिक गणित पाठ पूरे करें')}
                sub={`${status?.reasoningLessonsThisMonth || 0}/5, ${status?.mathsLessonsCompleted || 0}/5`}
              />
            </div>

            {isAnnual && (
              <div style={{ ...card, background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#92400E', marginBottom: 8 }}>
                  🔒 {T('Your Annual Locked Discount', 'आपकी वार्षिक लॉक्ड छूट')}
                </h3>
                <p style={{ fontSize: 14, color: '#78350F', margin: 0 }}>
                  {annualLock?.locked_discount_pct
                    ? T(`You've locked in ${annualLock.locked_discount_pct}% off your renewal — your best month always wins, even if a later month is missed.`,
                        `आपने अपने नवीनीकरण पर ${annualLock.locked_discount_pct}% छूट लॉक कर ली है — आपका सबसे अच्छा महीना हमेशा जीतता है, भले ही बाद का कोई महीना छूट जाए।`)
                    : T('No tier locked in yet — meet all 3 criteria and reach 1000+ points in any month to lock in your first discount.',
                        'अभी तक कोई स्तर लॉक नहीं हुआ — पहली छूट लॉक करने के लिए किसी भी महीने में सभी 3 शर्तें पूरी करें और 1000+ पॉइंट्स तक पहुंचें।')}
                </p>
              </div>
            )}

            {/* Full explanation */}
            <div style={card}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0A1628', marginBottom: 16 }}>
                📖 {T('How Knowledge Points Work', 'नॉलेज पॉइंट्स कैसे काम करते हैं')}
              </h3>

              <ExplainSection title={T('How you earn them', 'कैसे कमाएं')}>
                {T('+1 point for every question you answer correctly, −1 for a wrong answer, +5 for finishing a Daily Quiz, +5 for completing a lesson (Vedic Maths or Reasoning). Wrong answers do cost you — this rewards genuine effort, not guessing.',
                   'हर सही जवाब पर +1 पॉइंट, गलत जवाब पर −1, डेली क्विज़ पूरी करने पर +5, कोई भी पाठ (वैदिक गणित या रीज़निंग) पूरा करने पर +5। गलत जवाबों पर पॉइंट्स कटते हैं — यह असली मेहनत को इनाम देता है, अंदाज़े को नहीं।')}
              </ExplainSection>

              <ExplainSection title={T('How to redeem', 'कैसे रिडीम करें')}>
                {T('Meet all 3 monthly requirements above, then your points unlock a discount tier: 1000 points = 30% off, 1500 = 40% off, 2000 = 50% off (the maximum). The discount applies to your next subscription renewal.',
                   'ऊपर दी गई सभी 3 शर्तें पूरी करें, फिर आपके पॉइंट्स एक छूट स्तर अनलॉक करते हैं: 1000 पॉइंट्स = 30% छूट, 1500 = 40% छूट, 2000 = 50% छूट (अधिकतम)। यह छूट आपकी अगली सब्सक्रिप्शन पर लागू होती है।')}
              </ExplainSection>

              <ExplainSection title={T('Monthly plans', 'मासिक योजना')}>
                {T('Points reset to zero at the start of each new month if not redeemed — they don\'t carry forward. Each month is a fresh chance to earn a discount on the next one.',
                   'हर नए महीने की शुरुआत में अगर रिडीम नहीं किया गया तो पॉइंट्स शून्य हो जाते हैं — वे आगे नहीं बढ़ते। हर महीना अगले महीने पर छूट कमाने का एक नया मौका है।')}
              </ExplainSection>

              <ExplainSection title={T('Annual plans', 'वार्षिक योजना')}>
                {T('Your best month wins, and it\'s locked in for the whole year. If you reach a discount tier in any month (with all 3 criteria met), that becomes your guaranteed minimum discount at renewal — even if a later month is missed. A stronger month later in the year can only upgrade your locked tier, never lower it.',
                   'आपका सबसे अच्छा महीना जीतता है, और वह पूरे साल के लिए लॉक हो जाता है। अगर आप किसी भी महीने में एक छूट स्तर तक पहुंचते हैं (सभी 3 शर्तों के साथ), तो वह नवीनीकरण पर आपकी गारंटीशुदा न्यूनतम छूट बन जाती है — भले ही बाद का कोई महीना छूट जाए। साल में बाद का कोई मज़बूत महीना आपके लॉक्ड स्तर को केवल बेहतर कर सकता है, कभी कम नहीं।')}
              </ExplainSection>

              <div style={{ background: '#F9FAFB', borderRadius: 10, padding: '12px 16px', marginTop: 8 }}>
                <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
                  {T('Available on Basic, Pro, and Family subscription plans — Reasoning, Vedic Maths, and Aptitude lessons all count toward your points.',
                     'बेसिक, प्रो और फैमिली सब्सक्रिप्शन योजनाओं पर उपलब्ध — रीज़निंग, वैदिक गणित और एप्टीट्यूड सभी पाठ आपके पॉइंट्स में गिने जाते हैं।')}
                </p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function CriteriaRow({ done, label, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
      <span style={{ fontSize: 18 }}>{done ? '✅' : '⬜'}</span>
      <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: 14, color: done ? '#059669' : '#374151' }}>{label}</span>
      {sub && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#6B7280' }}>{sub}</span>}
    </div>
  );
}

function ExplainSection({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1E40AF', marginBottom: 4, fontFamily: 'var(--font-body)' }}>{title}</h4>
      <p style={{ fontSize: 13, color: '#4B5563', margin: 0, lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>{children}</p>
    </div>
  );
}
