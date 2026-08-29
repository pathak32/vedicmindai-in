import React, { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import { useVedicAuth } from '@/lib/VedicAuthContext';

function generateCode(userId) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'VM';
  const seed = userId.replace(/-/g, '').substring(0, 8);
  for (let i = 0; i < 6; i++) {
    code += chars[parseInt(seed[i] || '0', 16) % chars.length];
  }
  return code;
}

const glass = {
  background: 'rgba(255,255,255,0.75)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(30,64,175,0.15)',
  boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
  borderRadius: 16,
};

export default function ReferralSection() {
  const { user } = useVedicAuth();
  const [stats, setStats] = useState({ referral_count: 0, converted_count: 0 });
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const referralCode = user ? generateCode(user.id) : '';
  const referralUrl = `https://www.vedicmindai.in/ref/${referralCode}`;
  const rewardThreshold = 5;
  const progress = Math.min((stats.converted_count / rewardThreshold) * 100, 100);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);
    try {
      const sb = await getSupabase();
      // Get aggregate stats
      const { data: row } = await sb
        .from('referrals')
        .select('referral_count, converted_count')
        .eq('user_id', user.id)
        .maybeSingle();
      if (row) setStats({ referral_count: row.referral_count || 0, converted_count: row.converted_count || 0 });

      // Get individual referred users (profiles where referral_code = this user's code)
      const { data: referred } = await sb
        .from('profiles')
        .select('full_name, mobile, created_at, subscription_status, payment_status')
        .eq('referral_code', referralCode)
        .order('created_at', { ascending: false });
      if (referred) setReferrals(referred);
    } catch(e) { console.error(e); }
    setLoading(false);
  }

  function copyLink() {
    navigator.clipboard.writeText(referralUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function shareWhatsApp() {
    const text = `🧮 Can you solve this in 3 seconds?\n\nTry this free Vedic Maths challenge!\n\n👉 ${referralUrl}\n\nAncient Indian technique that makes calculations 10x faster 🔥`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  function statusBadge(r) {
    const paid = r.subscription_status === 'active' || r.payment_status === 'completed';
    return (
      <span style={{
        background: paid ? '#ECFDF5' : '#F0F4FF',
        color: paid ? '#065F46' : '#1E40AF',
        border: `1px solid ${paid ? '#A7F3D0' : 'rgba(30,64,175,0.2)'}`,
        borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600,
      }}>
        {paid ? '✅ Subscribed' : '⏳ Signed up'}
      </span>
    );
  }

  return (
    <div style={{ ...glass, padding: 24, marginBottom: 20 }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: '#0A1628', marginBottom: 4 }}>
        🎁 Refer &amp; Earn
      </h2>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', marginBottom: 20, margin: '0 0 20px' }}>
        Get 5 friends to subscribe → earn 1 month Pro free
      </p>

      {/* Referral link */}
      <div style={{ background: '#F0F4FF', border: '1px solid rgba(30,64,175,0.15)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 10, color: '#6B7280', fontFamily: 'var(--font-body)', marginBottom: 2, letterSpacing: 1 }}>YOUR REFERRAL LINK</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1E40AF', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{referralUrl}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={copyLink} style={{ background: copied ? '#059669' : '#0A1628', color: 'white', border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 700, fontSize: 12, cursor: 'pointer', minHeight: 36, transition: 'background 0.2s' }}>
            {copied ? '✅ Copied' : '📋 Copy'}
          </button>
          <button onClick={shareWhatsApp} style={{ background: '#25D366', color: 'white', border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 700, fontSize: 12, cursor: 'pointer', minHeight: 36 }}>
            📱 WhatsApp
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: 13, marginBottom: 6 }}>
          <span style={{ fontWeight: 600, color: '#0A1628' }}>{stats.converted_count} of {rewardThreshold} subscribed</span>
          <span style={{ color: '#4B5563' }}>{Math.max(rewardThreshold - stats.converted_count, 0)} more to earn 1 month free</span>
        </div>
        <div style={{ background: '#E5E7EB', borderRadius: 20, height: 10, overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(90deg, #10B981, #059669)', height: '100%', width: `${progress}%`, borderRadius: 20, transition: 'width 0.6s ease' }} />
        </div>
        {stats.converted_count >= rewardThreshold && (
          <div style={{ marginTop: 10, background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 10, padding: '10px 14px', color: '#065F46', fontWeight: 700, fontSize: 13, textAlign: 'center' }}>
            🎉 Reward unlocked! Contact us at support@vedicmindai.in to claim your free month.
          </div>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Link Clicks', value: stats.referral_count, emoji: '👆' },
          { label: 'Signed Up', value: referrals.length, emoji: '👤' },
          { label: 'Subscribed', value: stats.converted_count, emoji: '💳' },
        ].map(s => (
          <div key={s.label} style={{ background: '#F0F4FF', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.emoji}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: '#0A1628' }}>{s.value}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#6B7280', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Referral history table */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: '#0A1628', marginBottom: 12 }}>
          Referral History
        </h3>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#6B7280', fontFamily: 'var(--font-body)', fontSize: 13 }}>Loading...</div>
        ) : referrals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', background: '#F0F4FF', borderRadius: 10 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔗</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}>No referrals yet. Share your link to start earning!</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(30,64,175,0.1)' }}>
                  {['Name', 'Joined', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: '#6B7280', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {referrals.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(30,64,175,0.06)' }}>
                    <td style={{ padding: '10px', color: '#0A1628', fontWeight: 500 }}>
                      {r.full_name || 'User'}
                    </td>
                    <td style={{ padding: '10px', color: '#6B7280' }}>
                      {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '10px' }}>{statusBadge(r)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
