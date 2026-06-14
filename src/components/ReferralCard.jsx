import React, { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import { useVedicAuth } from '@/lib/VedicAuthContext';

function generateCode(userId) {
  // Generate deterministic 8-char code from userId
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'VM';
  const seed = userId.replace(/-/g, '').substring(0, 8);
  for (let i = 0; i < 6; i++) {
    code += chars[parseInt(seed[i] || '0', 16) % chars.length];
  }
  return code;
}

export default function ReferralCard() {
  const { user } = useVedicAuth();
  const [stats, setStats] = useState({ referrals: 0, converted: 0 });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const referralCode = user ? generateCode(user.id) : '';
  const shareText = `🧮 Join VedicMind — India's AI-powered Vedic Mathematics app!\nLearn ancient math tricks that make calculations 10x faster.\n\nUse my referral code: *${referralCode}* to get 7 days free trial.\n\n👉 vedicmindai.in`;

  useEffect(() => {
    if (!user) return;
    loadStats();
    // Save referral code to Supabase
    saveReferralCode();
  }, [user]);

  async function saveReferralCode() {
    try {
      const sb = await getSupabase();
      await sb.from('referrals').upsert({
        user_id: user.id,
        referral_code: referralCode,
        created_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    } catch(e) { /* silent */ }
  }

  async function loadStats() {
    setLoading(true);
    try {
      const sb = await getSupabase();
      const { data } = await sb
        .from('referrals')
        .select('referral_count, converted_count')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) setStats({ referrals: data.referral_count || 0, converted: data.converted_count || 0 });
    } catch(e) { /* silent */ }
    setLoading(false);
  }

  function copyCode() {
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function shareWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  }

  const progress = Math.min((stats.converted / 5) * 100, 100);
  const remaining = Math.max(5 - stats.converted, 0);

  return (
    <div style={{ background: 'linear-gradient(135deg, #0A1628, #1E40AF)', borderRadius: 16, padding: 20, color: 'white', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 28 }}>🎁</span>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Refer & Earn 1 Month Free!</h3>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0 }}>Get 5 friends to subscribe → 1 month Pro free</p>
        </div>
      </div>

      {/* Referral Code */}
      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, border: '1px solid rgba(255,255,255,0.2)' }}>
        <div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>YOUR REFERRAL CODE</div>
          <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 700, letterSpacing: 3 }}>{referralCode}</div>
        </div>
        <button onClick={copyCode} style={{ background: copied ? '#059669' : 'white', color: copied ? 'white' : '#0A1628', border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
          <span>{stats.converted} of 5 subscribed</span>
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>{remaining} more to go!</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 20, height: 8, overflow: 'hidden' }}>
          <div style={{ background: '#10B981', height: '100%', width: `${progress}%`, borderRadius: 20, transition: 'width 0.5s' }} />
        </div>
      </div>

      {/* Share buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={shareWhatsApp} style={{ flex: 1, background: '#25D366', border: 'none', borderRadius: 10, padding: '10px', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          📱 Share on WhatsApp
        </button>
        <button onClick={() => { navigator.share ? navigator.share({ title: 'VedicMind', text: shareText }) : copyCode(); }} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10, padding: '10px 14px', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          ↗ Share
        </button>
      </div>

      {stats.converted >= 5 && (
        <div style={{ marginTop: 12, background: '#059669', borderRadius: 10, padding: '10px 14px', textAlign: 'center', fontWeight: 700 }}>
          🎉 You have earned 1 month Pro free! Contact us to claim.
        </div>
      )}
    </div>
  );
}
