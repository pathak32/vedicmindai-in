import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupabase } from '@/lib/supabaseClient';

// Mirrors the Daily Quiz AnnouncementBar visual language (same pulse dot,
// same dark gradient, same dismiss pattern) — reusing a proven pattern
// rather than inventing a new visual language for this feature.
export default function LiveClassBanner() {
  const [liveClass, setLiveClass] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const sb = await getSupabase();
        const now = new Date().toISOString();
        // Prefer a currently-live class; otherwise the next upcoming one within 7 days
        const { data: liveNow } = await sb.from('live_classes').select('*').eq('status', 'live').limit(1).maybeSingle();
        if (liveNow) { setLiveClass({ ...liveNow, isLiveNow: true }); return; }

        const sevenDaysOut = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const { data: upcoming } = await sb.from('live_classes')
          .select('*').eq('status', 'upcoming')
          .gte('scheduled_at', now).lte('scheduled_at', sevenDaysOut)
          .order('scheduled_at', { ascending: true }).limit(1).maybeSingle();
        if (upcoming) setLiveClass({ ...upcoming, isLiveNow: false });
      } catch (e) { console.warn('LiveClassBanner load failed:', e); }
    })();
  }, []);

  if (!liveClass || dismissed) return null;

  const dateLabel = new Date(liveClass.scheduled_at).toLocaleString('en-IN', { weekday: 'long', hour: 'numeric', minute: '2-digit' });

  return (
    <div style={{
      position: 'sticky', top: 64, zIndex: 49,
      background: liveClass.isLiveNow ? 'linear-gradient(90deg, #7F1D1D, #DC2626)' : 'linear-gradient(90deg, #0A1628, #1E40AF)',
      minHeight: 40,
    }}>
      <style>{`@keyframes liveClassPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', animation: 'liveClassPulse 1.5s ease-in-out infinite', flexShrink: 0 }} />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'white', margin: 0, flex: 1, textAlign: 'center', minWidth: 200 }}>
          {liveClass.isLiveNow
            ? `🔴 LIVE NOW — ${liveClass.topic} with ${liveClass.tutor_name}`
            : `This ${dateLabel} — ${liveClass.topic} with ${liveClass.tutor_name}`}
        </p>
        <button
          onClick={() => navigate(`/live-class/${liveClass.id}`)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, textDecoration: 'underline', whiteSpace: 'nowrap' }}
        >
          {liveClass.isLiveNow ? 'Join Now →' : 'Register Free →'}
        </button>
        <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: 16, padding: '0 4px' }} aria-label="Dismiss">✕</button>
      </div>
    </div>
  );
}
