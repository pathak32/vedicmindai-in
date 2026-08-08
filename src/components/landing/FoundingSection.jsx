import React, { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

const SAFFRON = '#F59E0B';
const DARK = '#0A1628';
const BLUE = '#1E40AF';

const STEPS = [
  { month: 'Month 1', pay: 'Pay ₹125', full: 'Get full month access', sub: 'No XP check — just explore' },
  { month: 'Month 2', pay: 'Pay ₹125', full: 'Get full month access', sub: 'No XP check — get hooked' },
  { month: 'Month 3+', pay: '₹250/month', full: 'If XP ≥ 200 previous month', sub: 'Else regular ₹499 applies' },
];

export default function FoundingSection({ onJoin, currentUser }) {
  const [seatsLeft, setSeatsLeft] = useState(499);
  const [isFounder, setIsFounder] = useState(false);
  const [founderMonth, setFounderMonth] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const sb = await getSupabase();
        // Get seats remaining via RPC
        const { data: seats } = await sb.rpc('founding_seats_remaining');
        if (seats !== null) setSeatsLeft(seats);

        // Check if current user is already a founding member
        if (currentUser?.id) {
          const { data: member } = await sb
            .from('founding_members')
            .select('billing_month, is_active')
            .eq('user_id', currentUser.id)
            .maybeSingle();
          if (member?.is_active) {
            setIsFounder(true);
            setFounderMonth(member.billing_month);
          }
        }
      } catch (e) {}
      setLoading(false);
    }
    fetch();
  }, [currentUser?.id]);

  const pct = Math.min(100, Math.round(((500 - seatsLeft) / 500) * 100));
  const barColor = pct > 80 ? '#EF4444' : pct > 50 ? '#F59E0B' : '#22C55E';
  const isSoldOut = seatsLeft === 0;

  return (
    <div style={{ marginTop: 40, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 30, padding: '5px 16px', marginBottom: 12 }}>
          <span style={{ fontSize: 14 }}>🔥</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: SAFFRON, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Founding 500 — Early Bird
          </span>
        </div>
        <h2 style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, color: DARK, margin: '0 0 8px' }}>
          Pay for 1 Week. Get the Whole Month.
        </h2>
        <p style={{ fontSize: 14, color: '#6B7280', maxWidth: 480, margin: '0 auto' }}>
          First 500 students only. First two months at ₹125 each — that's 1 week's cost for a full month of access.
        </p>
      </div>

      {/* Scarcity counter */}
      <div style={{ background: 'white', borderRadius: 16, padding: '16px 20px',
        border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(10,22,40,0.06)', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>
            {loading ? 'Checking seats...' : isSoldOut ? 'All 500 seats claimed' : `${500 - seatsLeft} of 500 seats claimed`}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: isSoldOut ? '#9CA3AF' : '#EF4444' }}>
            {isSoldOut ? 'Sold Out' : `Only ${seatsLeft} left!`}
          </span>
        </div>
        <div style={{ background: '#F3F4F6', borderRadius: 99, height: 8 }}>
          <div style={{ height: 8, borderRadius: 99, background: barColor, width: pct + '%', transition: 'width 0.6s ease' }} />
        </div>
      </div>

      {/* 3-step pricing */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 20 }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{
            background: i < 2 ? `linear-gradient(135deg,${DARK},${BLUE})` : 'white',
            border: i < 2 ? 'none' : '1px solid #E5E7EB',
            borderRadius: 16, padding: '18px 16px', textAlign: 'center',
            color: i < 2 ? 'white' : DARK,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
              color: i < 2 ? 'rgba(255,255,255,0.6)' : '#9CA3AF', marginBottom: 6 }}>{s.month}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: i < 2 ? SAFFRON : BLUE, marginBottom: 2 }}>{s.pay}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: i < 2 ? 'white' : DARK, marginBottom: 4 }}>{s.full}</div>
            <div style={{ fontSize: 11, color: i < 2 ? 'rgba(255,255,255,0.55)' : '#9CA3AF' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      {isFounder ? (
        <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: 14,
          padding: '16px 20px', textAlign: 'center' }}>
          <span style={{ fontSize: 16 }}>🎉</span>
          <span style={{ fontWeight: 700, color: '#065F46', marginLeft: 8, fontSize: 14 }}>
            You are a Founding Member! (Month {founderMonth})
          </span>
          <p style={{ fontSize: 12, color: '#047857', margin: '4px 0 0' }}>
            {founderMonth < 2
              ? 'Month 2 will also be ₹125. Keep earning XP!'
              : 'Keep your XP above 200/month to maintain ₹250 rate.'}
          </p>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <button
            disabled={isSoldOut}
            onClick={() => !isSoldOut && onJoin && onJoin()}
            style={{
              background: isSoldOut ? '#D1D5DB' : SAFFRON,
              color: isSoldOut ? '#9CA3AF' : DARK,
              border: 'none', borderRadius: 14,
              padding: '14px 40px', fontWeight: 800,
              fontSize: 16, cursor: isSoldOut ? 'not-allowed' : 'pointer',
              boxShadow: isSoldOut ? 'none' : '0 4px 16px rgba(245,158,11,0.35)',
            }}>
            {isSoldOut ? 'Sold Out' : 'Join Founding 500 — ₹125 First Month →'}
          </button>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 8 }}>
            No auto-renewal trap. You control every payment.
          </p>
        </div>
      )}
    </div>
  );
}