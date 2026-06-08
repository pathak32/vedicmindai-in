import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Check } from 'lucide-react';
import { toast } from 'sonner';
import { initTrial } from '@/lib/trialEngine';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hashPassword(pw) {
  return btoa(pw + 'vedicmind_salt');
}

function validateMobile(m) {
  return /^[6-9]\d{9}$/.test(m);
}

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function getPasswordStrength(pw) {
  if (!pw) return { label: '', color: '', width: '0%' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/`~]/.test(pw)) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw)) score++;
  const levels = [
    { label: 'Weak', color: '#EF4444', width: '25%' },
    { label: 'Fair', color: '#F59E0B', width: '50%' },
    { label: 'Strong', color: '#3B82F6', width: '75%' },
    { label: 'Very Strong', color: '#10B981', width: '100%' },
  ];
  return levels[Math.min(score, 3)];
}

function seedTestAccounts() {
  if (localStorage.getItem('vedicmind_test_seeded')) return;
  const accounts = [
    { mobile: '9999900001', name: 'Priya Sharma', passwordHash: hashPassword('test1234'), createdAt: '2025-01-01T00:00:00.000Z', isNewUser: false, email: 'priya@test.com' },
    { mobile: '9999900002', name: 'Rahul Verma',  passwordHash: hashPassword('test1234'), createdAt: '2025-01-01T00:00:00.000Z', isNewUser: false, email: 'rahul@test.com' },
    { mobile: '9999900003', name: 'Demo User',    passwordHash: hashPassword('test1234'), createdAt: '2025-01-01T00:00:00.000Z', isNewUser: false, email: '' },
  ];
  accounts.forEach(acc => localStorage.setItem('vedicmind_user_' + acc.mobile, JSON.stringify(acc)));
  localStorage.setItem('vedicmind_test_seeded', 'true');
}

// ─── OTP Input ────────────────────────────────────────────────────────────────

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

// ─── Resend Timer ─────────────────────────────────────────────────────────────

function ResendTimer({ onResend }) {
  const [secs, setSecs] = useState(30);
  useEffect(() => {
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

// ─── Forgot Password ──────────────────────────────────────────────────────────

function ForgotPasswordLink() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1); // 1=mobile, 2=otp, 3=new-password
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [otpShake, setOtpShake] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [resendSecs, setResendSecs] = useState(30);

  // Resend timer
  useEffect(() => {
    if (step !== 2 || resendSecs <= 0) return;
    const t = setTimeout(() => setResendSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, resendSecs]);

  const close = () => { setShow(false); setStep(1); setMobile(''); setOtpValue(''); setErrors({}); };
  const sendOTP = () => {
    const e = {};
    if (!validateMobile(mobile)) e.mobile = 'Enter a valid 10-digit mobile number';
    const existing = localStorage.getItem('vedicmind_user_' + mobile);
    if (!existing) e.mobile = 'No account found with this number';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    const code = generateOTP();
    setOtp(code);
    setGeneratedOTP(code);
    setOtpValue('');
    setOtpError('');
    setResendSecs(30);
    setStep(2);
    toast(`Your OTP is: ${code} — enter it below`, { duration: 30000, style: { background: '#DBEAFE', borderLeft: '4px solid #3B82F6', color: '#1E40AF', fontFamily: 'var(--font-body)', fontSize: 15 } });
  };
  const verifyOTP = () => {
    if (otpValue !== otp) { setOtpShake(true); setOtpError('Invalid OTP'); setOtpValue(''); setTimeout(() => setOtpShake(false), 400); return; }
    setStep(3);
  };
  const resendOTP = () => {
    const code = generateOTP();
    setOtp(code);
    setGeneratedOTP(code);
    setOtpValue('');
    setOtpError('');
    setResendSecs(30);
    toast(`Your OTP is: ${code} — enter it below`, { duration: 30000, style: { background: '#DBEAFE', borderLeft: '4px solid #3B82F6', color: '#1E40AF', fontFamily: 'var(--font-body)', fontSize: 15 } });
  };
  const resetPassword = () => {
    const e = {};
    if (newPw.length < 8) e.newPw = 'Password must be at least 8 characters';
    if (newPw !== confirmPw) e.confirmPw = 'Passwords do not match';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    const raw = localStorage.getItem('vedicmind_user_' + mobile);
    const user = JSON.parse(raw);
    user.passwordHash = hashPassword(newPw);
    localStorage.setItem('vedicmind_user_' + mobile, JSON.stringify(user));
    toast.success('Password reset! Please sign in.');
    close();
  };

  return (
    <div style={{ marginTop: 6 }}>
      <button type="button" onClick={() => { setShow(s => !s); if (show) close(); }}
        style={{ display: 'block', marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, color: '#3B82F6', padding: 0 }}>
        Forgot Password?
      </button>
      {show && (
        <div className="glass-card" style={{ marginTop: 16, padding: '24px 20px' }}>
          <h3 className="font-heading" style={{ fontSize: 20, fontWeight: 700, color: '#0A1628', marginBottom: 16, textAlign: 'center' }}>Reset Password</h3>

          {step === 1 && (
            <div className="space-y-4">
              <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${errors.mobile ? '#EF4444' : 'rgba(30,64,175,0.15)'}`, borderRadius: 12, overflow: 'hidden', background: 'white', height: 44 }}>
                <span style={{ padding: '0 10px 0 14px', fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', borderRight: '1px solid rgba(30,64,175,0.15)', whiteSpace: 'nowrap', lineHeight: '44px', flexShrink: 0 }}>+91</span>
                <input type="tel" inputMode="numeric" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" style={{ flex: 1, padding: '0 14px', border: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 16, color: '#0A1628', background: 'transparent' }} />
              </div>
              {errors.mobile && <p className="text-[#EF4444] text-xs mt-1">{errors.mobile}</p>}
              <button type="button" onClick={sendOTP} className="w-full h-11 rounded-xl bg-[#0A1628] text-white font-semibold text-sm hover:bg-[#0D2252] transition-colors">Send OTP →</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', margin: 0 }}>We sent a 6-digit code to +91 {mobile}</p>
              <div style={{ background: '#DBEAFE', border: '2px solid #3B82F6', borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#1E40AF', margin: '0 0 4px 0' }}>Your OTP</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: '#0A1628', letterSpacing: 6, margin: 0 }}>{generatedOTP}</p>
              </div>
              <OTPInput value={otpValue} onChange={setOtpValue} shake={otpShake} />
              {otpError && <p style={{ textAlign: 'center', color: '#EF4444', fontFamily: 'var(--font-body)', fontSize: 13, margin: 0 }}>{otpError}</p>}
              <button type="button" onClick={verifyOTP} disabled={otpValue.length < 6} className="w-full h-11 rounded-xl bg-[#0A1628] text-white font-semibold text-sm hover:bg-[#0D2252] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Verify OTP →</button>
              {resendSecs > 0 ? <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 14, color: '#9CA3AF', margin: 0 }}>Resend in {resendSecs}s</p> : <button type="button" onClick={resendOTP} style={{ display: 'block', margin: '0 auto', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, color: '#3B82F6' }}>Resend OTP</button>}
              <button type="button" onClick={() => setStep(1)} style={{ display: 'block', margin: '0 auto', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, color: '#9CA3AF' }}>← Back</button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-[#0A1628] mb-1.5">New Password</label>
                <div className="relative">
                  <input type={showNewPw ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min 8 characters" style={{ fontSize: 16 }}
                    className={`w-full h-11 px-4 pr-10 rounded-xl border bg-white text-[#0A1628] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] ${errors.newPw ? 'border-[#EF4444]' : 'border-[rgba(30,64,175,0.15)]'}`} />
                  <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563]">{showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
                {errors.newPw && <p className="text-[#EF4444] text-xs mt-1">{errors.newPw}</p>}
              </div>
              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-[#0A1628] mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input type={showConfirmPw ? 'text' : 'password'} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Re-enter password" style={{ fontSize: 16 }}
                    className={`w-full h-11 px-4 pr-10 rounded-xl border bg-white text-[#0A1628] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] ${errors.confirmPw ? 'border-[#EF4444]' : 'border-[rgba(30,64,175,0.15)]'}`} />
                  <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563]">{showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
                {errors.confirmPw && <p className="text-[#EF4444] text-xs mt-1">{errors.confirmPw}</p>}
              </div>
              <button type="button" onClick={resetPassword} className="w-full h-11 rounded-xl bg-[#0A1628] text-white font-semibold text-sm hover:bg-[#0D2252] transition-colors">Reset Password →</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sign Up Form ─────────────────────────────────────────────────────────────

const SignUpForm = React.memo(function SignUpForm({ onSwitchTab }) {
  const navigate = useNavigate();
  const [screen, setScreen] = useState('form'); // 'form' | 'otp'
  const [form, setForm] = useState({ name: '', mobile: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [otpShake, setOtpShake] = useState(false);
  const [otpError, setOtpError] = useState('');

  const strength = getPasswordStrength(form.password);

  const handleSendOTP = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!validateMobile(form.mobile)) e.mobile = 'Enter a valid 10-digit mobile number starting with 6–9';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    if (localStorage.getItem('vedicmind_user_' + form.mobile)) {
      setErrors({ mobile: 'This mobile number is already registered. Please sign in.' });
      return;
    }

    const code = generateOTP();
    setOtp(code);
    setGeneratedOTP(code);
    setOtpValue('');
    setOtpError('');
    setScreen('otp');
    toast(`Your OTP is: ${code} — enter it below`, {
      duration: 30000,
      style: { background: '#DBEAFE', borderLeft: '4px solid #3B82F6', color: '#1E40AF', fontFamily: 'var(--font-body)', fontSize: 15 },
    });
  };

  const handleVerifyOTP = () => {
    if (otpValue !== otp) {
      setOtpShake(true);
      setOtpError('Incorrect OTP. Please try again.');
      setOtpValue('');
      setTimeout(() => setOtpShake(false), 400);
      return;
    }
    const userData = {
      mobile: form.mobile,
      name: form.name.trim(),
      email: form.email || '',
      passwordHash: hashPassword(form.password),
      createdAt: new Date().toISOString(),
      isNewUser: true,
    };
    localStorage.setItem('vedicmind_user_' + form.mobile, JSON.stringify(userData));
    localStorage.setItem('vedicmind_auth', JSON.stringify(userData));
    initTrial();
    localStorage.setItem('vedicmind_profile', JSON.stringify({
      name: form.name.trim(), role: null, age: null, gender: null, grade: null,
      board: null, goal: null, timeCommitment: null, learningStyle: null, language: 'en', aiAnalysis: null,
    }));
    toast.success('Account created! Welcome to VedicMind 🎉');
    navigate('/onboarding');
  };

  const handleResendOTP = () => {
    const code = generateOTP();
    setOtp(code);
    setGeneratedOTP(code);
    setOtpValue('');
    setOtpError('');
    toast(`Your OTP is: ${code} — enter it below`, {
      duration: 30000,
      style: { background: '#DBEAFE', borderLeft: '4px solid #3B82F6', color: '#1E40AF', fontFamily: 'var(--font-body)', fontSize: 15 },
    });
  };

  if (screen === 'otp') {
    return (
      <div className="space-y-5">
        <div style={{ textAlign: 'center' }}>
          <h3 className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 6 }}>Enter OTP</h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', margin: 0 }}>
            We sent a 6-digit code to +91 {form.mobile}
          </p>
        </div>
        {generatedOTP && (
          <div style={{ background: '#DBEAFE', border: '2px solid #3B82F6', borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#1E40AF', margin: '0 0 8px 0' }}>🔐 Your OTP (for testing)</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color: '#0A1628', letterSpacing: 8, margin: 0 }}>{generatedOTP}</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#4B5563', margin: '8px 0 0 0' }}>This box only appears during testing.</p>
          </div>
        )}
        <OTPInput value={otpValue} onChange={setOtpValue} shake={otpShake} />
        {otpError && <p style={{ textAlign: 'center', color: '#EF4444', fontFamily: 'var(--font-body)', fontSize: 13, margin: 0 }}>{otpError}</p>}
        <button type="button" onClick={handleVerifyOTP} disabled={otpValue.length < 6}
          className="w-full h-11 rounded-xl bg-[#0A1628] text-white font-semibold text-sm hover:bg-[#0D2252] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          Verify OTP
        </button>
        <ResendTimer key={generatedOTP} onResend={handleResendOTP} />
        <button type="button" onClick={() => { setScreen('form'); setOtpValue(''); setOtpError(''); }}
          style={{ display: 'block', margin: '0 auto', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, color: '#9CA3AF' }}>
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-[#0A1628] mb-1.5">Full Name</label>
        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Your full name" autoComplete="name" style={{ fontSize: 16 }}
          className={`w-full h-11 px-4 rounded-xl border bg-white text-[#0A1628] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] ${errors.name ? 'border-[#EF4444]' : 'border-[rgba(30,64,175,0.15)]'}`}
        />
        {errors.name && <p className="text-[#EF4444] text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Mobile */}
      <div>
        <label className="block text-sm font-medium text-[#0A1628] mb-1.5">Mobile Number</label>
        <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${errors.mobile ? '#EF4444' : 'rgba(30,64,175,0.15)'}`, borderRadius: 12, overflow: 'hidden', background: 'white', height: 44 }}>
          <span style={{ padding: '0 10px 0 14px', fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', borderRight: '1px solid rgba(30,64,175,0.15)', whiteSpace: 'nowrap', lineHeight: '44px', flexShrink: 0 }}>+91</span>
          <input type="tel" inputMode="numeric" autoComplete="tel" value={form.mobile}
            onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
            placeholder="10-digit mobile number"
            style={{ flex: 1, padding: '0 14px', border: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 16, color: '#0A1628', background: 'transparent' }}
          />
        </div>
        {errors.mobile && <p className="text-[#EF4444] text-xs mt-1">{errors.mobile}</p>}
      </div>

      {/* Email (optional) */}
      <div>
        <label className="block text-sm font-medium text-[#0A1628] mb-1.5">
          Email <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(Optional)</span>
        </label>
        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          placeholder="Email (optional)" autoComplete="email" style={{ fontSize: 16 }}
          className="w-full h-11 px-4 rounded-xl border border-[rgba(30,64,175,0.15)] bg-white text-[#0A1628] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-[#0A1628] mb-1.5">Create Password</label>
        <div className="relative">
          <input type={showPw ? 'text' : 'password'} value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder="Min 8 characters" autoComplete="new-password" style={{ fontSize: 16 }}
            className={`w-full h-11 px-4 pr-10 rounded-xl border bg-white text-[#0A1628] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] ${errors.password ? 'border-[#EF4444]' : 'border-[rgba(30,64,175,0.15)]'}`}
          />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563]">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-[#EF4444] text-xs mt-1">{errors.password}</p>}
        {form.password && (
          <div className="mt-2">
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: strength.width, background: strength.color }} />
            </div>
            <p className="text-xs mt-1" style={{ color: strength.color }}>{strength.label}</p>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-[#0A1628] mb-1.5">Confirm Password</label>
        <div className="relative">
          <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword}
            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder="Re-enter password" autoComplete="new-password" style={{ fontSize: 16 }}
            className={`w-full h-11 px-4 pr-10 rounded-xl border bg-white text-[#0A1628] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] ${errors.confirmPassword ? 'border-[#EF4444]' : 'border-[rgba(30,64,175,0.15)]'}`}
          />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563]">
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {form.confirmPassword && form.password === form.confirmPassword && (
            <Check className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-[#10B981]" />
          )}
        </div>
        {errors.confirmPassword && <p className="text-[#EF4444] text-xs mt-1">{errors.confirmPassword}</p>}
      </div>

      <button type="button" onClick={handleSendOTP}
        className="w-full h-11 rounded-xl bg-[#0A1628] text-white font-semibold text-sm hover:bg-[#0D2252] transition-colors">
        Send OTP →
      </button>
    </div>
  );
});

// ─── Sign In Form ─────────────────────────────────────────────────────────────

const SignInForm = React.memo(function SignInForm({ onSwitchTab }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ mobile: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);

  const handleSignIn = () => {
    const e = {};
    if (!form.mobile.trim()) e.mobile = 'Please enter your mobile number';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const raw = localStorage.getItem('vedicmind_user_' + form.mobile.trim());
    const user = raw ? JSON.parse(raw) : null;

    if (!user || hashPassword(form.password) !== user.passwordHash) {
      toast.error('Incorrect mobile number or password');
      return;
    }
    user.isNewUser = false;
    localStorage.setItem('vedicmind_auth', JSON.stringify(user));
    const profile = localStorage.getItem('vedicmind_profile');
    const progress = localStorage.getItem('vedicmind_progress');
    navigate(profile && progress ? '/dashboard' : '/onboarding');
  };

  return (
    <div className="space-y-4">
      {/* Mobile */}
      <div>
        <label className="block text-sm font-medium text-[#0A1628] mb-1.5">Mobile Number</label>
        <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${errors.mobile ? '#EF4444' : 'rgba(30,64,175,0.15)'}`, borderRadius: 12, overflow: 'hidden', background: 'white', height: 44 }}>
          <span style={{ padding: '0 10px 0 14px', fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', borderRight: '1px solid rgba(30,64,175,0.15)', whiteSpace: 'nowrap', lineHeight: '44px', flexShrink: 0 }}>+91</span>
          <input type="tel" inputMode="numeric" autoComplete="tel" value={form.mobile}
            onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
            placeholder="10-digit mobile number"
            style={{ flex: 1, padding: '0 14px', border: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 16, color: '#0A1628', background: 'transparent' }}
          />
        </div>
        {errors.mobile && <p className="text-[#EF4444] text-xs mt-1">{errors.mobile}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-[#0A1628] mb-1.5">Password</label>
        <div className="relative">
          <input type={showPw ? 'text' : 'password'} value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder="Enter your password" autoComplete="current-password" style={{ fontSize: 16 }}
            className={`w-full h-11 px-4 pr-10 rounded-xl border bg-white text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] ${errors.password ? 'border-[#EF4444]' : 'border-[rgba(30,64,175,0.15)]'}`}
          />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563]">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-[#EF4444] text-xs mt-1">{errors.password}</p>}
        <ForgotPasswordLink />
      </div>

      <button type="button" onClick={handleSignIn}
        style={{
          width: '100%', minHeight: 44, background: '#0A1628', color: 'white',
          border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600,
          fontFamily: 'var(--font-body)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        Sign In →
      </button>
    </div>
  );
});

// ─── Auth Page ────────────────────────────────────────────────────────────────

export default function AuthPage() {
  const [tab, setTab] = useState('signup');

  useEffect(() => { seedTestAccounts(); }, []);

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

      {/* ── Left branding panel ── */}
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

      {/* ── Right form panel ── */}
      <div className="auth-right" style={{ width: '50%', background: 'white', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 24px', minHeight: '100vh', boxSizing: 'border-box' }}>
        <div className="w-full max-w-md" style={{ animation: 'authFadeIn 0.2s ease-out' }}>
        <style>{`@keyframes authFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
          <div className="glass-card auth-card" style={{ padding: '32px 28px' }}>

            {/* Tab buttons */}
            <div style={{ display: 'flex', background: '#F0F4FF', borderRadius: 12, padding: 4, marginBottom: 32 }}>
              <button type="button" style={tabBtn('signup')} onClick={() => setTab('signup')}>
                Sign Up
              </button>
              <button type="button" style={tabBtn('signin')} onClick={() => setTab('signin')}>
                Sign In
              </button>
            </div>

            {/* Forms */}
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