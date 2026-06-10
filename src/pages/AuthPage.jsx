import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useVedicAuth } from '@/lib/VedicAuthContext';

// ── Helpers ──────────────────────────────────────────────────
function getPasswordStrength(pw) {
  if (!pw) return { label: '', color: '', width: '0%' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(pw)) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw)) score++;
  const levels = [
    { label: 'Weak',      color: '#EF4444', width: '25%' },
    { label: 'Fair',      color: '#F59E0B', width: '50%' },
    { label: 'Strong',    color: '#3B82F6', width: '75%' },
    { label: 'Very Strong', color: '#10B981', width: '100%' },
  ];
  return levels[Math.min(score, 3)];
}

// ── Sign Up Form ──────────────────────────────────────────────
function SignUpForm() {
  const { signUp } = useVedicAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', dob: '', mobile: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name required';
    if (!form.dob) e.dob = 'Date of birth required';
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = 'Enter valid 10-digit mobile number';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await signUp({
        mobile: form.mobile,
        password: form.password,
        name: form.name,
        email: form.email,
        dateOfBirth: form.dob,
      });
      toast.success('Account created! Welcome to VedicMind 🎉');
      navigate('/onboarding');
    } catch (err) {
      toast.error(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pw = getPasswordStrength(form.password);
  const set = (k) => (e) => { setForm(p => ({ ...p, [k]: e.target.value })); setErrors(p => ({ ...p, [k]: '' })); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Full Name */}
      <div>
        <label style={labelStyle}>Full Name *</label>
        <input value={form.name} onChange={set('name')} placeholder="Your full name" style={inputStyle(errors.name)} />
        {errors.name && <p style={errStyle}>{errors.name}</p>}
      </div>

      {/* Date of Birth */}
      <div>
        <label style={labelStyle}>Date of Birth <span style={{ color: '#6B7280', fontSize: 12 }}>(used for password recovery)</span></label>
        <input type="date" value={form.dob} onChange={set('dob')} style={inputStyle(errors.dob)} />
        {errors.dob && <p style={errStyle}>{errors.dob}</p>}
      </div>

      {/* Mobile */}
      <div>
        <label style={labelStyle}>Mobile Number *</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ ...inputStyle(), width: 60, textAlign: 'center', flexShrink: 0 }}>+91</div>
          <input value={form.mobile} onChange={set('mobile')} placeholder="10-digit mobile number" maxLength={10} style={{ ...inputStyle(errors.mobile), flex: 1 }} />
        </div>
        {errors.mobile && <p style={errStyle}>{errors.mobile}</p>}
      </div>

      {/* Email (optional) */}
      <div>
        <label style={labelStyle}>Email <span style={{ color: '#6B7280', fontSize: 12 }}>(Optional)</span></label>
        <input type="email" value={form.email} onChange={set('email')} placeholder="Email (optional)" style={inputStyle()} />
      </div>

      {/* Password */}
      <div>
        <label style={labelStyle}>Create Password *</label>
        <div style={{ position: 'relative' }}>
          <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min 8 characters" style={{ ...inputStyle(errors.password), paddingRight: 44 }} />
          <button onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {form.password && (
          <div style={{ marginTop: 6 }}>
            <div style={{ height: 4, background: '#E5E7EB', borderRadius: 2 }}>
              <div style={{ height: '100%', width: pw.width, background: pw.color, borderRadius: 2, transition: 'width 0.3s' }} />
            </div>
            <p style={{ fontSize: 11, color: pw.color, marginTop: 2 }}>{pw.label}</p>
          </div>
        )}
        {errors.password && <p style={errStyle}>{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label style={labelStyle}>Confirm Password *</label>
        <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Re-enter password" style={inputStyle(errors.confirm)} />
        {errors.confirm && <p style={errStyle}>{errors.confirm}</p>}
      </div>

      {/* Submit */}
      <button onClick={handleSubmit} disabled={loading} style={btnStyle(loading)}>
        {loading ? 'Creating Account...' : 'Create Account →'}
      </button>
    </div>
  );
}

// ── Sign In Form ──────────────────────────────────────────────
function SignInForm() {
  const { signIn } = useVedicAuth();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!mobile || !password) { setError('Please enter mobile number and password'); return; }
    setLoading(true);
    setError('');
    try {
      await signIn({ mobile, password });
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid mobile number or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Mobile */}
      <div>
        <label style={labelStyle}>Mobile Number</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ ...inputStyle(), width: 60, textAlign: 'center', flexShrink: 0 }}>+91</div>
          <input value={mobile} onChange={e => { setMobile(e.target.value); setError(''); }} placeholder="10-digit mobile number" maxLength={10} style={{ ...inputStyle(error), flex: 1 }} />
        </div>
      </div>

      {/* Password */}
      <div>
        <label style={labelStyle}>Password</label>
        <div style={{ position: 'relative' }}>
          <input type={showPw ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder="Your password" style={{ ...inputStyle(error), paddingRight: 44 }} />
          <button onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {error && <p style={errStyle}>{error}</p>}
      </div>

      {/* Forgot Password */}
      <div style={{ textAlign: 'right', marginTop: -8 }}>
        <Link to="/forgot-password" style={{ fontSize: 13, color: '#3B82F6', textDecoration: 'none' }}>Forgot Password?</Link>
      </div>

      {/* Submit */}
      <button onClick={handleSubmit} disabled={loading} style={btnStyle(loading)}>
        {loading ? 'Signing In...' : 'Sign In →'}
      </button>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, fontFamily: 'var(--font-body)' };
const inputStyle = (err) => ({
  width: '100%', padding: '10px 14px', border: `1.5px solid ${err ? '#EF4444' : 'rgba(30,64,175,0.2)'}`,
  borderRadius: 10, fontSize: 15, fontFamily: 'var(--font-body)', background: '#fff',
  color: '#0A1628', outline: 'none', boxSizing: 'border-box', minHeight: 44,
});
const errStyle = { fontSize: 12, color: '#EF4444', marginTop: 4 };
const btnStyle = (loading) => ({
  width: '100%', padding: '13px', background: loading ? '#6B7280' : '#0A1628',
  color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600,
  cursor: loading ? 'not-allowed' : 'pointer', minHeight: 44, fontFamily: 'var(--font-body)',
  marginTop: 4,
});

// ── Main AuthPage ─────────────────────────────────────────────
export default function AuthPage() {
  const [tab, setTab] = useState('signup');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'var(--font-body)' }}>
      {/* Left Panel */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #0A1628 0%, #0D2252 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 48px', color: '#fff' }} className="auth-left-panel">
        <div style={{ maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🧮</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 36, marginBottom: 12, lineHeight: 1.2 }}>Ancient Wisdom.<br />Infinite Speed.</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>India's only AI-powered Vedic Mathematics platform. Learn 40 ancient techniques to calculate 10× faster.</p>
          {['40 Vedic Maths lessons — Beginner to Master', 'AI Tutor available 24/7', 'Daily Quiz, Leaderboard & Aptitude — Live Now! 🎉', '⚡ Battle Mode & Weekly Exam — New Features'].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 20, height: 20, background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontSize: 12 }}>✓</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: '#F8FAFF', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', background: '#E5E7EB', borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {['signup', 'signin'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '10px', border: 'none', cursor: 'pointer', borderRadius: 10, fontSize: 14, fontWeight: 600,
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? '#0A1628' : '#6B7280',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s', fontFamily: 'var(--font-body)',
              }}>
                {t === 'signup' ? 'Sign Up' : 'Sign In'}
              </button>
            ))}
          </div>

          {/* Form Card */}
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{ background: '#fff', borderRadius: 20, padding: '32px 28px', boxShadow: '0 4px 24px rgba(10,22,40,0.08)', border: '1px solid rgba(30,64,175,0.1)' }}
          >
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, color: '#0A1628', marginBottom: 6 }}>
              {tab === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24 }}>
              {tab === 'signup' ? 'Start your Vedic Mathematics journey today' : 'Sign in to continue learning'}
            </p>
            {tab === 'signup' ? <SignUpForm /> : <SignInForm />}
          </motion.div>

          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#6B7280' }}>
            {tab === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
            <button onClick={() => setTab(tab === 'signup' ? 'signin' : 'signup')} style={{ background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
              {tab === 'signup' ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
