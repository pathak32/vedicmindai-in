import React from 'react';

// Lifetime seats counter — updates when Razorpay lifetime flow is built
// Starting display: 199 seats available
const LIFETIME_SEATS_LEFT = 199;
const LIFETIME_TOTAL = 200;

export default function LifetimeBanner({ showUSD, onBuy }) {
  const seatsLeft = LIFETIME_SEATS_LEFT;
  const pct = Math.round(((LIFETIME_TOTAL - seatsLeft) / LIFETIME_TOTAL) * 100);
  const bar = pct > 80 ? '#EF4444' : pct > 50 ? '#F59E0B' : '#22C55E';

  return (
    <div style={{ marginTop: 32, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto', background: 'linear-gradient(135deg, #0A1628, #1E3A5F)', borderRadius: 20, padding: '28px 28px', border: '1px solid rgba(245,158,11,0.35)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            <span style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lifetime Access</span>
            {seatsLeft > 0 && <span style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700, color: '#FCA5A5' }}>Only {seatsLeft} seats left</span>}
            {seatsLeft === 0 && <span style={{ background: 'rgba(107,114,128,0.2)', borderRadius: 20, padding: '3px 12px', fontSize: 11, color: '#9CA3AF' }}>Sold Out</span>}
          </div>
          <h3 style={{ color: 'white', fontSize: 18, fontWeight: 800, margin: '0 0 6px' }}>Pay once. Learn Vedic Maths forever.</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: '0 0 14px', lineHeight: 1.55 }}>One-time payment. No monthly charges. Basic features permanently. Limited to 200 founding members only.</p>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{LIFETIME_TOTAL - seatsLeft} of {LIFETIME_TOTAL} seats claimed</span>
              <span style={{ fontSize: 11, color: '#FCA5A5', fontWeight: 600 }}>{seatsLeft} remaining</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 99, height: 6 }}>
              <div style={{ height: 6, borderRadius: 99, background: bar, width: pct + '%' }} />
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, textDecoration: 'line-through', marginBottom: 2 }}>{showUSD ? 'Worth $108/year' : 'Worth Rs.5,988/year'}</div>
          <div style={{ color: '#F59E0B', fontSize: 34, fontWeight: 800, lineHeight: 1 }}>{showUSD ? '$499' : 'Rs.9,999'}</div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginBottom: 14 }}>one-time payment</div>
          <button
            onClick={onBuy}
            style={{ background: '#F59E0B', color: '#0A1628', border: 'none', borderRadius: 10, padding: '11px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            Get Lifetime Access
          </button>
        </div>
      </div>
    </div>
  );
}