import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { getSupabase } from '@/lib/supabaseClient';

const PAID_PLANS = ['basic', 'pro', 'family']; // any paying tier gets replay free, per the pricing plan

export default function LiveClassPage() {
  const { classId } = useParams();
  const { user } = useVedicAuth();
  const [liveClass, setLiveClass] = useState(null);
  const [userPlan, setUserPlan] = useState('free');
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const sb = await getSupabase();
        const { data: cls } = await sb.from('live_classes').select('*').eq('id', classId).maybeSingle();
        setLiveClass(cls);

        if (user?.id) {
          const { data: profile } = await sb.from('profiles').select('plan').eq('id', user.id).maybeSingle();
          setUserPlan(profile?.plan || 'free');

          const { data: attendance } = await sb.from('live_class_attendance').select('*').eq('live_class_id', classId).eq('user_id', user.id).maybeSingle();
          setRegistered(!!attendance);
        }
      } catch (e) {
        console.error('LiveClassPage load error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [classId, user?.id]);

  async function register() {
    if (!user?.id) return;
    try {
      const sb = await getSupabase();
      await sb.from('live_class_attendance').upsert({ live_class_id: classId, user_id: user.id, registered: true }, { onConflict: 'live_class_id,user_id' });
      setRegistered(true);
    } catch (e) { console.error(e); }
  }

  if (loading) return <div style={{ minHeight: '100vh', background: '#F0F4FF' }}><DashboardNavbar /><p style={{ textAlign: 'center', padding: 60, color: '#6B7280' }}>Loading...</p></div>;
  if (!liveClass) return <div style={{ minHeight: '100vh', background: '#F0F4FF' }}><DashboardNavbar /><p style={{ textAlign: 'center', padding: 60, color: '#6B7280' }}>Class not found.</p></div>;

  const isLive = liveClass.status === 'live';
  const isEnded = liveClass.status === 'ended';
  const hasReplayAccess = PAID_PLANS.includes(userPlan); // paid tiers get replay free; free tier needs the small unlock (payment flow to be wired to existing Razorpay checkout)

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <DashboardNavbar />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 60px' }}>
        <Link to="/dashboard" style={{ color: '#6B7280', fontSize: 14, textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}>← Back to Dashboard</Link>

        <div style={{ display: 'inline-block', background: isLive ? '#FEE2E2' : isEnded ? '#F3F4F6' : '#DBEAFE', color: isLive ? '#DC2626' : isEnded ? '#6B7280' : '#1E40AF', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99, marginBottom: 12 }}>
          {isLive ? '🔴 LIVE NOW' : isEnded ? 'REPLAY AVAILABLE' : 'UPCOMING — FREE TO ATTEND'}
        </div>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>{liveClass.topic}</h1>
        <p style={{ color: '#4B5563', fontFamily: 'var(--font-body)', marginBottom: 4 }}>with <strong>{liveClass.tutor_name}</strong></p>
        {liveClass.tutor_bio && <p style={{ color: '#9CA3AF', fontFamily: 'var(--font-body)', fontSize: 13, marginBottom: 16 }}>{liveClass.tutor_bio}</p>}
        <p style={{ color: '#6B7280', fontFamily: 'var(--font-body)', fontSize: 14, marginBottom: 24 }}>
          {new Date(liveClass.scheduled_at).toLocaleString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' })} · {liveClass.duration_minutes} minutes
        </p>

        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(10,22,40,0.06)' }}>
          {isLive && liveClass.youtube_live_url && (
            <>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', marginBottom: 12, fontWeight: 600 }}>🔴 Live now — free for everyone:</p>
              <a href={liveClass.youtube_live_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', padding: '14px', background: '#DC2626', color: 'white', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>
                Join Live Class →
              </a>
            </>
          )}

          {!isLive && !isEnded && (
            <>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', marginBottom: 16 }}>
                Live attendance is always free. Register so we can remind you before it starts.
              </p>
              <button
                onClick={register}
                disabled={registered}
                style={{ width: '100%', padding: '14px', background: registered ? '#D1FAE5' : '#0A1628', color: registered ? '#059669' : 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: registered ? 'default' : 'pointer' }}
              >
                {registered ? '✓ Registered — we\'ll remind you' : 'Register Free →'}
              </button>
            </>
          )}

          {isEnded && (
            hasReplayAccess ? (
              liveClass.youtube_replay_url ? (
                <a href={liveClass.youtube_replay_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', padding: '14px', background: '#0A1628', color: 'white', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>
                  ▶ Watch Replay (included in your plan)
                </a>
              ) : (
                <p style={{ color: '#9CA3AF', fontFamily: 'var(--font-body)', fontSize: 14 }}>Replay is being processed — check back soon.</p>
              )
            ) : (
              <>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', marginBottom: 16 }}>
                  Replay access is included free on Basic, Pro, and Family plans. On the Free plan, unlock this replay for a small one-time fee.
                </p>
                <Link to="/pricing" style={{ display: 'block', textAlign: 'center', padding: '14px', background: '#3B82F6', color: 'white', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>
                  Unlock Replay / View Plans →
                </Link>
              </>
            )
          )}
        </div>
      </main>
    </div>
  );
}
