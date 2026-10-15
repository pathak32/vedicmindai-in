import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { checkLoginPhone, sendLoginOtp, verifyLoginOtp, verifyLoginPin, setLoginPin, redeemLoginSession } from '@/lib/phoneAuth';

// Phone-first login. Steps:
//   phone  → enter number
//   pin    → returning user with a PIN: enter it (no WhatsApp message sent)
//   otp    → WhatsApp code (first login, new device, forgot PIN, or no PIN yet)
//   setPin → choose a 4-digit PIN after an OTP login that needs one
// Password login stays available on the main sign-in form for existing accounts.

const RESEND_SECONDS = 30;

const lbl = { display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:4 };
const Err = ({ children }) => <p style={{ color:'#EF4444', fontSize:12, margin:'6px 0 0' }}>{children}</p>;
const inp = {
  height:48, width:'100%', padding:'0 14px', borderRadius:12,
  border:'1.5px solid rgba(30,64,175,0.2)', fontSize:18, outline:'none',
  fontFamily:'var(--font-mono)', letterSpacing:4, textAlign:'center',
  color:'#0A1628', background:'white', boxSizing:'border-box',
};
const primaryBtn = (busy) => ({
  width:'100%', height:46, background: busy ? '#6B7280' : '#0A1628', color:'white', border:'none',
  borderRadius:12, fontSize:15, fontWeight:700, cursor: busy ? 'not-allowed' : 'pointer',
});
const linkBtn = {
  background:'none', border:'none', cursor:'pointer', fontSize:13, color:'#3B82F6', fontWeight:600, padding:0,
};

const onlyDigits = (v, max) => v.replace(/\D/g, '').slice(0, max);

// onPinSetupChange(true) tells the auth page to stay on this screen while the PIN is set.
// Without it, the page redirects as soon as the session exists, skipping the PIN step.
export default function WhatsAppLogin({ onBack, onPinSetupChange }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [resetting, setResetting] = useState(false); // true when the user came here via "Forgot PIN"
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [noAccount, setNoAccount] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const done = () => {
    onPinSetupChange?.(false);
    toast.success('Welcome back!');
    navigate(redirectTo || '/dashboard');
  };

  // Shared by the phone step and "Forgot PIN": sends the WhatsApp code and moves to the OTP step.
  const requestCode = async (isReset) => {
    const r = await sendLoginOtp(phone);
    if (!r.ok) {
      setError(r.error || 'Could not send the code. Please try again.');
      return false;
    }
    setResetting(isReset);
    setOtp('');
    setError('');
    setCooldown(RESEND_SECONDS);
    setStep('otp');
    return true;
  };

  const handlePhone = async (e) => {
    e?.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) { setError('Enter a valid 10-digit Indian mobile number.'); return; }
    setBusy(true);
    setError('');
    setNoAccount(false);
    try {
      const status = await checkLoginPhone(phone);
      if (!status.ok) { setError(status.error || 'Something went wrong. Please try again.'); return; }
      if (!status.exists) { setNoAccount(true); setError('No account with this number yet.'); return; }
      if (status.hasPin) { setPin(''); setError(''); setStep('pin'); return; }
      await requestCode(false);
    } finally {
      setBusy(false);
    }
  };

  const handlePin = async (e) => {
    e?.preventDefault();
    if (!/^\d{4}$/.test(pin)) { setError('Enter your 4-digit PIN.'); return; }
    setBusy(true);
    setError('');
    try {
      const r = await verifyLoginPin(phone, pin);
      if (r.ok) return done();
      if (r.needsOtp) {
        // Too many wrong PINs. Send a WhatsApp code so they can prove who they are.
        toast.error(r.error);
        await requestCode(true);
        return;
      }
      setError(r.error || 'Incorrect PIN.');
      setPin('');
    } finally {
      setBusy(false);
    }
  };

  const handleOtp = async (e) => {
    e?.preventDefault();
    if (!/^\d{6}$/.test(otp)) { setError('Enter the 6-digit code.'); return; }
    setBusy(true);
    setError('');
    try {
      const r = await verifyLoginOtp(phone, otp);
      if (!r.ok) { setError(r.error || 'Incorrect code.'); return; }
      if (r.newUser) { setError('No account with this number yet. Please sign up first.'); setNoAccount(true); return; }

      // Ask for a PIN if they don't have one yet, or if they are resetting it.
      // Hold the auth page first, then start the session, so the PIN step is not skipped.
      if (resetting || !r.hasPin) {
        onPinSetupChange?.(true);
        const session = await redeemLoginSession(r.tokenHash);
        if (!session.ok) { onPinSetupChange?.(false); setError(session.error); return; }
        setStep('setPin'); setNewPin(''); setConfirmPin('');
        return;
      }

      const session = await redeemLoginSession(r.tokenHash);
      if (!session.ok) { setError(session.error); return; }
      return done();
    } finally {
      setBusy(false);
    }
  };

  const handleSetPin = async (e) => {
    e?.preventDefault();
    if (!/^\d{4}$/.test(newPin)) { setError('PIN must be 4 digits.'); return; }
    if (newPin !== confirmPin) { setError('The two PINs do not match.'); return; }
    setBusy(true);
    setError('');
    try {
      const r = await setLoginPin(newPin);
      if (!r.ok) { setError(r.error || 'Could not save your PIN.'); return; }
      return done();
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    if (cooldown > 0 || busy) return;
    setBusy(true);
    try { await requestCode(resetting); } finally { setBusy(false); }
  };

  const backToPhone = () => { setStep('phone'); setError(''); setOtp(''); setPin(''); setNoAccount(false); };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {step === 'phone' && (
        <form onSubmit={handlePhone} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <label style={lbl}>Mobile number</label>
            <div style={{ display:'flex', gap:8 }}>
              <span style={{ ...inp, width:'auto', letterSpacing:0, fontFamily:'var(--font-body)', display:'flex', alignItems:'center', color:'#6B7280' }}>+91</span>
              <input inputMode="numeric" autoComplete="tel-national" value={phone}
                onChange={(e) => setPhone(onlyDigits(e.target.value, 10))}
                placeholder="10-digit number" style={{ ...inp, letterSpacing:1, textAlign:'left', fontSize:15 }} />
            </div>
          </div>
          {error && <Err>{error}</Err>}
          {noAccount && (
            <button type="button" onClick={() => onBack?.('signup')} style={linkBtn}>Create an account →</button>
          )}
          <button type="submit" disabled={busy} style={primaryBtn(busy)}>
            {busy ? 'Checking…' : 'Continue'}
          </button>
          <button type="button" onClick={onBack} style={{ ...linkBtn, color:'#6B7280' }}>← Use password instead</button>
        </form>
      )}

      {step === 'pin' && (
        <form onSubmit={handlePin} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <label style={lbl}>Enter your 4-digit PIN</label>
            <input inputMode="numeric" type="password" autoComplete="one-time-code" value={pin}
              onChange={(e) => setPin(onlyDigits(e.target.value, 4))} placeholder="••••" style={inp} />
            {error && <Err>{error}</Err>}
          </div>
          <button type="submit" disabled={busy} style={primaryBtn(busy)}>{busy ? 'Checking…' : 'Login'}</button>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <button type="button" onClick={() => requestCode(true)} disabled={busy} style={linkBtn}>Forgot PIN? Send WhatsApp code</button>
            <button type="button" onClick={backToPhone} style={{ ...linkBtn, color:'#6B7280' }}>Change number</button>
          </div>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleOtp} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <p style={{ fontSize:13, color:'#374151', margin:0 }}>
            We sent a 6-digit code on WhatsApp to +91 {phone}.
          </p>
          <div>
            <label style={lbl}>Code</label>
            <input inputMode="numeric" autoComplete="one-time-code" value={otp}
              onChange={(e) => setOtp(onlyDigits(e.target.value, 6))} placeholder="000000" style={inp} />
            {error && <Err>{error}</Err>}
          </div>
          <button type="submit" disabled={busy} style={primaryBtn(busy)}>{busy ? 'Verifying…' : 'Verify and continue'}</button>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <button type="button" onClick={resend} disabled={cooldown > 0 || busy} style={{ ...linkBtn, color: cooldown > 0 ? '#9CA3AF' : '#3B82F6' }}>
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            </button>
            <button type="button" onClick={backToPhone} style={{ ...linkBtn, color:'#6B7280' }}>Change number</button>
          </div>
        </form>
      )}

      {step === 'setPin' && (
        <form onSubmit={handleSetPin} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <p style={{ fontSize:13, color:'#374151', margin:0 }}>
            {resetting ? 'Choose a new 4-digit PIN for quick login.' : 'Set a 4-digit PIN for quick login next time.'}
          </p>
          <div>
            <label style={lbl}>New PIN</label>
            <input inputMode="numeric" type="password" value={newPin}
              onChange={(e) => setNewPin(onlyDigits(e.target.value, 4))} placeholder="••••" style={inp} />
          </div>
          <div>
            <label style={lbl}>Confirm PIN</label>
            <input inputMode="numeric" type="password" value={confirmPin}
              onChange={(e) => setConfirmPin(onlyDigits(e.target.value, 4))} placeholder="••••" style={inp} />
            {error && <Err>{error}</Err>}
          </div>
          <button type="submit" disabled={busy} style={primaryBtn(busy)}>{busy ? 'Saving…' : 'Save PIN and continue'}</button>
        </form>
      )}
    </div>
  );
}
