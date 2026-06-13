import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { saveUserProfile } from '@/lib/supabaseDataService';

function validateMobile(m) {
  return /^[6-9]\d{9}$/.test(m);
}

function OTPInput({ value, onChange, shake }) {
  const refs = useRef([]);
  const digits = value.split('');

  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...digits];
      if (next[i]) { next[i] = ''; onChange(next.join('')); }
      else if (i > 0) { next[i - 1] = ''; onChange(next.join('')); refs.current[i - 1]?.focus(); }
    }
  };

  const handleChange = (i, e) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = char;
    onChange(next.join(''));
    if (char && i < 5) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6));
    refs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <motion.input
          key={i}
          ref={el => refs.current[i] = el}
          type="tel" inputMode="numeric" maxLength={1}
          value={digits[i] || ''}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          animate={shake ? { x: [-6, 6, -6, 6, 0] } : {}}
          transition={{ duration: 0.3 }}
          style={{
            width: 44, height: 52, textAlign: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 24, color: '#0A1628',
            border: `1.5px solid ${digits[i] ? '#3B82F6' : 'rgba(30,64,175,0.15)'}`,
            borderRadius: 10, outline: 'none', background: 'white',
          }}
        />
      ))}
    </div>
  );
}

function ResendTimer({ onResend }) {
  const [secs, setSecs] = useState(30);
  React.useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  if (secs > 0) return (
    <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 14, color: '#9CA3AF', margin: 0 }}>
      Resend in {secs}s
    </p>
  );
  return (
    <button type="button" onClick={() => { setSecs(30); onResend(); }}
      style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, color: '#3B82F6', display: 'block', margin: '0 auto' }}>
      Resend OTP
    </button>
  );
}

const SignUpForm = React.memo(function SignUpForm({ onSwitchTab }) {
  const { signUp, verifyOtp, signUpWithEmail } = useVedicAuth();
  const navigate = useNavigate();
  const [screen, setScreen] = useState('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [useEmailSignup, setUseEmailSignup] = useState(false);
  const [emailSignup, setEmailSignup] = useState('');
  const [passwordSignup, setPasswordSignup] = useState('');
  const [errors, setErrors] = useState({});
  const [otpValue, setOtpValue] = useState('');
  const [otpShake, setOtpShake] = useState(false);
  const [otpError, setOtpError] = useState('');

  const handleSignUp = async () => {
    if (useEmailSignup) {
      if (!emailSignup || !passwordSignup) {
        setErrors({ email: 'Email and password required' });
        return;
      }
      try {
        await signUpWithEmail(emailSignup, passwordSignup);
        toast.success('Account created!');
        navigate('/dashboard');
      } catch (err) {
        toast.error(err.message || 'Sign up failed.');
      }
      return;
    }
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!validateMobile(phone)) e.phone = 'Enter a valid 10-digit mobile number';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    try {
      await signUp(`+91${phone}`);
      setOtpValue('');
      setOtpError('');
      setScreen('otp');
      toast.success('OTP sent to your phone!');
    } catch (err) {
      toast.error(err.message || 'Sign up failed. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length < 6) return;
    try {
      const result = await verifyOtp(`+91${phone}`, otpValue);
      const userId = result?.data?.user?.id;
      if (userId && name) {
        await saveUserProfile(userId, {
          name: name.trim(),
          phone: `+91${phone}`,
          subscription_status: 'trial',
          trial_start_date: new Date().toISOString(),
        });
        localStorage.setItem('vedicmind_profile', JSON.stringify({
          name: name.trim(), phone: `+91${phone}`,
          subscriptionStatus: 'trial', trialStartDate: new Date().toISOString(),
        }));
      }
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      setOtpShake(true);
      setOtpError(err.message || 'Invalid OTP. Please try again.');
      setOtpValue('');
      setTimeout(() => setOtpShake(false), 400);
    }
  };

  const handleResendOtp = async () => {
    try {
      await signUp(`+91${phone}`);
      setOtpValue('');
      setOtpError('');
      toast.success('OTP resent!');
    } catch (err) {
      toast.error(err.message || 'Failed to resend OTP.');
    }
  };

  if (screen === 'otp') {
    return (
      <div className="space-y-5">
        <div style={{ textAlign: 'center' }}>
          <h3 className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 6 }}>Verify Phone</h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', margin: 0 }}>
            Enter the 6-digit code sent to +91 {phone}
          </p>
        </div>
        <OTPInput value={otpValue} onChange={setOtpValue} shake={otpShake} />
        {otpError && <p style={{ textAlign: 'center', color: '#EF4444', fontFamily: 'var(--font-body)', fontSize: 13, margin: 0 }}>{otpError}</p>}
        <button type="button" onClick={handleVerifyOtp} disabled={otpValue.length < 6}
          className="w-full h-11 rounded-xl bg-[#0A1628] text-white font-semibold text-sm hover:bg-[#0D2252] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          Verify OTP
        </button>
        <ResendTimer key={phone} onResend={handleResendOtp} />
        <button type="button" onClick={() => { setScreen('form'); setOtpValue(''); setOtpError(''); }}
          style={{ display: 'block', margin: '0 auto', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, color: '#9CA3AF' }}>
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!useEmailSignup && (
        <>
          <div>
            <label className="block text-sm font-medium text-[#0A1628] mb-1.5">Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Your full name" autoComplete="name" style={{ fontSize: 16 }}
              className={`w-full h-11 px-4 rounded-xl border bg-white text-[#0A1628] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] ${errors.name ? 'border-[#EF4444]' : 'border-[rgba(30,64,175,0.15)]'}`}
            />
            {errors.name && <p className="text-[#EF4444] text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A1628] mb-1.5">Mobile Number</label>
            <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${errors.phone ? '#EF4444' : 'rgba(30,64,175,0.15)'}`, borderRadius: 12, overflow: 'hidden', background: 'white', height: 44 }}>
              <span style={{ padding: '0 10px 0 14px', fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', borderRight: '1px solid rgba(30,64,175,0.15)', whiteSpace: 'nowrap', lineHeight: '44px', flexShrink: 0 }}>+91</span>
              <input type="tel" inputMode="numeric" autoComplete="tel" value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit mobile number"
                style={{ flex: 1, padding: '0 14px', border: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 16, color: '#0A1628', background: 'transparent' }}
              />
            </div>
            {errors.phone && <p className="text-[#EF4444] text-xs mt-1">{errors.phone}</p>}
          </div>
        </>
      )}

      {useEmailSignup && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input type="email" value={emailSignup} onChange={e => setEmailSignup(e.target.value)}
            placeholder="your@email.com"
            style={{ height: 44, padding: '0 16px', borderRadius: 12, border: '1px solid rgba(30,64,175,0.15)', fontSize: 16, outline: 'none', fontFamily: 'var(--font-body)', color: '#0A1628' }}
          />
          <input type="password" value={passwordSignup} onChange={e => setPasswordSignup(e.target.value)}
            placeholder="Password (min 6 chars)"
            style={{ height: 44, padding: '0 16px', borderRadius: 12, border: '1px solid rgba(30,64,175,0.15)', fontSize: 16, outline: 'none', fontFamily: 'var(--font-body)', color: '#0A1628' }}
          />
          {errors.email && <p style={{ color: '#EF4444', fontSize: 12, margin: 0 }}>{errors.email}</p>}
        </div>
      )}

      <p style={{ textAlign: 'center', fontSize: 13, color: '#6B7280', margin: '4px 0' }}>
        or{' '}
        <button type="button" onClick={() => setUseEmailSignup(!useEmailSignup)}
          style={{ background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          {useEmailSignup ? 'Use Phone OTP instead' : 'Sign up with Email'}
        </button>
      </p>

      <button type="button" onClick={handleSignUp}
        className="w-full h-11 rounded-xl bg-[#0A1628] text-white font-semibold text-sm hover:bg-[#0D2252] transition-colors">
        {useEmailSignup ? 'Create Account →' : 'Send OTP →'}
      </button>
    </div>
  );
});

const SignInForm = React.memo(function SignInForm({ onSwitchTab }) {
  const { signIn, verifyOtp } = useVedicAuth();
  const navigate = useNavigate();
  const [screen, setScreen] = useState('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [useEmail, setUseEmail] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpValue, setOtpValue] = useState('');
  const [otpShake, setOtpShake] = useState(false);
  const [otpError, setOtpError] = useState('');

  const handleSendOTP = async () => {
    if (useEmail) {
      if (!email || !password) {
        setErrors({ email: 'Email and password required' });
        return;
      }
      try {
        await signIn(null, email, password);
        toast.success('Signed in successfully!');
        navigate('/dashboard');
      } catch (err) {
        toast.error(err.message || 'Login failed.');
      }
      return;
    }
    const e = {};
    if (!validateMobile(phone)) e.phone = 'Enter a valid 10-digit mobile number';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    try {
      await signIn(`+91${phone}`);
      setOtpValue('');
      setOtpError('');
      setScreen('otp');
      toast.success('OTP sent to your phone!');
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async () => {
    if (otpValue.length < 6) return;
    try {
      await verifyOtp(`+91${phone}`, otpValue);
      toast.success('Signed in successfully!');
      navigate('/dashboard');
    } catch (err) {
      setOtpShake(true);
      setOtpError(err.message || 'Invalid OTP. Please try again.');
      setOtpValue('');
      setTimeout(() => setOtpShake(false), 400);
    }
  };

  const handleResendOTP = async () => {
    try {
      await signIn(`+91${phone}`);
      setOtpValue('');
      setOtpError('');
      toast.success('OTP resent!');
    } catch (err) {
      toast.error(err.message || 'Failed to resend OTP.');
    }
  };

  if (screen === 'otp') {
    return (
      <div className="space-y-5">
        <div style={{ textAlign: 'center' }}>
          <h3 className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 6 }}>Enter OTP</h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', margin: 0 }}>
            We sent a 6-digit code to +91 {phone}
          </p>
        </div>
        <OTPInput value={otpValue} onChange={setOtpValue} shake={otpShake} />
        {otpError && <p style={{ textAlign: 'center', color: '#EF4444', fontFamily: 'var(--font-body)', fontSize: 13, margin: 0 }}>{otpError}</p>}
        <button type="button" onClick={handleVerifyOTP} disabled={otpValue.length < 6}
          className="w-full h-11 rounded-xl bg-[#0A1628] text-white font-semibold text-sm hover:bg-[#0D2252] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          Verify OTP
        </button>
        <ResendTimer key={phone} onResend={handleResendOTP} />
        <button type="button" onClick={() => { setScreen('phone'); setOtpValue(''); setOtpError(''); }}
          style={{ display: 'block', margin: '0 auto', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, color: '#9CA3AF' }}>
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#0A1628] mb-1.5">Mobile Number</label>
        <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${errors.phone ? '#EF4444' : 'rgba(30,64,175,0.15)'}`, borderRadius: 12, overflow: 'hidden', background: 'white', height: 44 }}>
          <span style={{ padding: '0 10px 0 14px', fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', borderRight: '1px solid rgba(30,64,175,0.15)', whiteSpace: 'nowrap', lineHeight: '44px', flexShrink: 0 }}>+91</span>
          <input type="tel" inputMode="numeric" autoComplete="tel" value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="10-digit mobile number"
            style={{ flex: 1, padding: '0 14px', border: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 16, color: '#0A1628', background: 'transparent' }}
          />
        </div>
        {errors.phone && <p className="text-[#EF4444] text-xs mt-1">{errors.phone}</p>}
      </div>

      <p style={{ textAlign: 'center', fontSize: 13, color: '#6B7280', margin: '4px 0' }}>
        or{' '}
        <button type="button" onClick={() => setUseEmail(!useEmail)}
          style={{ background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          {useEmail ? 'Use Phone OTP instead' : 'Sign in with Email'}
        </button>
      </p>

      {useEmail && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{ height: 44, padding: '0 16px', borderRadius: 12, border: '1px solid rgba(30,64,175,0.15)', fontSize: 16, outline: 'none', fontFamily: 'var(--font-body)', color: '#0A1628' }}
          />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            style={{ height: 44, padding: '0 16px', borderRadius: 12, border: '1px solid rgba(30,64,175,0.15)', fontSize: 16, outline: 'none', fontFamily: 'var(--font-body)', color: '#0A1628' }}
          />
          {errors.email && <p style={{ color: '#EF4444', fontSize: 12, margin: 0 }}>{errors.email}</p>}
        </div>
      )}

      <button type="button" onClick={handleSendOTP}
        style={{
          width: '100%', minHeight: 44, background: '#0A1628', color: 'white',
          border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600,
          fontFamily: 'var(--font-body)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        {useEmail ? 'Sign In →' : 'Send OTP →'}
      </button>
    </div>
  );
});

export default function AuthPage() {
  const [tab, setTab] = useState('signup');
  const { user, loading } = useVedicAuth();
  const navigate = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading]);

  // Show nothing while checking auth
  if (loading) return null;
  if (user) return null;

  const tabBtn = (t) => ({
    flex: 1, minHeight: 48, border: 'none', cursor: 'pointer',
    borderRadius: 8, padding: '10px 24px',
    fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
    transition: 'all 0.2s',
    background: tab === t ? 'white' : 'transparent',
    color: tab === t ? '#0A1628' : '#4B5563',
    boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <style>{`
        @media (max-width: 640px) {
          .auth-left { display: none !important; }
          .auth-right { width: 100% !important; padding: 24px 16px !important; }
          .auth-card { padding: 24px 16px !important; }
        }
      `}</style>

      <div className="auth-left" style={{
        width: '50%', background: 'linear-gradient(135deg, #0A1628 0%, #0D2252 60%, #1E40AF 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px', position: 'relative', overflow: 'hidden',
      }}>
        {[
          { text: '73×97=7081', style: { top: '15%', left: '10%' } },
          { text: '√1764=42',   style: { top: '55%', right: '8%' } },
          { text: '25²=625',    style: { bottom: '20%', left: '15%' } },
        ].map(({ text, style }) => (
          <span key={text} style={{ position: 'absolute', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'rgba(255,255,255,0.07)', userSelect: 'none', pointerEvents: 'none', ...style }}>{text}</span>
        ))}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 360 }}>
          <span style={{ fontSize: 64, display: 'block', marginBottom: 24 }}>🧮</span>
          <h2 className="font-heading" style={{ fontSize: 36, fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: 24, whiteSpace: 'pre-line' }}>
            {"Ancient Wisdom.\nInfinite Speed."}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
            {['40 Vedic Maths lessons — Beginner to Master', 'AI Tutor available 24/7', 'Daily Quiz, Leaderboard & Aptitude — Live Now! 🎉', '⚡ Battle Mode & Weekly Exam — New Features'].map(point => (
              <div key={point} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, color: 'white' }}>✓</div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'rgba(255,255,255,0.85)' }}>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right" style={{ width: '50%', background: 'white', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 24px', minHeight: '100vh', boxSizing: 'border-box' }}>
        <div className="w-full max-w-md" style={{ animation: 'authFadeIn 0.2s ease-out' }}>
          <style>{`@keyframes authFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
          <div className="glass-card auth-card" style={{ padding: '32px 28px' }}>
            <div style={{ display: 'flex', background: '#F0F4FF', borderRadius: 12, padding: 4, marginBottom: 32 }}>
              <button type="button" style={tabBtn('signup')} onClick={() => setTab('signup')}>Sign Up</button>
              <button type="button" style={tabBtn('signin')} onClick={() => setTab('signin')}>Sign In</button>
            </div>
            {tab === 'signup' ? (
              <SignUpForm onSwitchTab={() => setTab('signin')} />
            ) : (
              <SignInForm onSwitchTab={() => setTab('signup')} />
            )}
          </div>
          <p className="text-center text-sm text-[#4B5563] mt-6">
            {tab === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
            <button type="button"
              onClick={() => setTab(tab === 'signup' ? 'signin' : 'signup')}
              className="text-[#3B82F6] font-semibold hover:underline">
              {tab === 'signup' ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
