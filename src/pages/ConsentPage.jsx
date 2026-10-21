import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { sendParentConsentCode, verifyParentConsentCode } from '@/lib/phoneAuth';

// Shown to accounts of users under 18 until a parent or guardian confirms consent
// with a one-time WhatsApp code sent to the parent's mobile saved at signup.
export default function ConsentPage() {
  const { user, profile, loading } = useVedicAuth();
  const [step, setStep] = useState('intro');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!profile?.consent_required || profile?.parental_consent_at) return <Navigate to="/dashboard" replace />;

  const run = async (fn, next) => {
    setBusy(true);
    setError('');
    const r = await fn();
    setBusy(false);
    if (!r.ok) { setError(r.error || 'Something went wrong. Please try again.'); return; }
    if (next) next();
  };

  const card = { maxWidth: 440, margin: '60px auto', background: 'white', borderRadius: 20, padding: '32px 28px', boxShadow: '0 4px 24px rgba(10,22,40,0.10)' };
  const btn = { height: 46, width: '100%', background: '#0A1628', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: busy ? 'not-allowed' : 'pointer' };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFF', padding: '20px 16px' }}>
      <div style={card}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>Parent or guardian approval</h2>
        <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6, marginBottom: 20 }}>
          VedicMind is for students under 18, so a parent or guardian must confirm this account. We will send a one-time code on WhatsApp to the parent's mobile number saved at signup.
        </p>

        {step === 'intro' && (
          <button type="button" disabled={busy} style={btn} onClick={() => run(sendParentConsentCode, () => setStep('code'))}>
            {busy ? 'Sending…' : 'Send code to parent on WhatsApp'}
          </button>
        )}

        {step === 'code' && (
          <form onSubmit={(e) => { e.preventDefault(); run(() => verifyParentConsentCode(code), () => { window.location.href = '/dashboard'; }); }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Code sent to the parent's WhatsApp</label>
            <input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000" style={{ height: 48, width: '100%', borderRadius: 12, border: '1.5px solid rgba(30,64,175,0.2)', fontSize: 18, textAlign: 'center', letterSpacing: 4, marginBottom: 14, boxSizing: 'border-box' }} />
            <button type="submit" disabled={busy || code.length !== 6} style={btn}>{busy ? 'Verifying…' : 'Confirm parent approval'}</button>
            <button type="button" disabled={busy} onClick={() => run(sendParentConsentCode)} style={{ marginTop: 12, background: 'none', border: 'none', color: '#3B82F6', fontWeight: 600, cursor: 'pointer' }}>Resend code</button>
          </form>
        )}

        {error && <p style={{ color: '#EF4444', fontSize: 13, marginTop: 12 }}>{error}</p>}
      </div>
    </div>
  );
}
