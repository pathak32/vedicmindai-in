import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';

function hashPassword(pw) {
  return btoa(pw + 'vedicmind_salt');
}

function validateMobile(m) {
  return /^[6-9]\d{9}$/.test(m);
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: mobile+dob, 2: new password
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleVerify = () => {
    const e = {};
    if (!validateMobile(mobile)) e.mobile = 'Enter valid 10-digit mobile number';
    if (!dob) e.dob = 'Date of birth is required';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const userData = JSON.parse(localStorage.getItem('vedicmind_user_' + mobile) || 'null');
    if (!userData) {
      setErrors({ mobile: 'No account found with this mobile number' });
      return;
    }
    if (!userData.dob) {
      setErrors({ dob: 'This account was created before DOB feature. Please contact support.' });
      return;
    }
    if (userData.dob !== dob) {
      setErrors({ dob: 'Date of birth does not match our records' });
      return;
    }
    setStep(2);
  };

  const handleReset = () => {
    const e = {};
    if (password.length < 8) e.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const userData = JSON.parse(localStorage.getItem('vedicmind_user_' + mobile));
    userData.passwordHash = hashPassword(password);
    localStorage.setItem('vedicmind_user_' + mobile, JSON.stringify(userData));
    setSuccess(true);
    toast.success('Password reset successful! Please sign in.');
    setTimeout(() => navigate('/auth'), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A1628 0%, #0D2252 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
      >
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Link to="/auth" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#4B5563', fontSize: 14, textDecoration: 'none', marginBottom: 16 }}>
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, color: '#0A1628', margin: 0 }}>
            Reset Password
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', marginTop: 4 }}>
            {step === 1 ? 'Enter your mobile number and date of birth to verify your identity' : 'Create a new password for your account'}
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Check size={28} color="#10B981" />
            </div>
            <p style={{ fontFamily: 'var(--font-body)', color: '#0A1628', fontWeight: 600 }}>Password reset successful!</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', marginTop: 4 }}>Redirecting to sign in...</p>
          </div>
        ) : step === 1 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Mobile */}
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#0A1628', marginBottom: 6 }}>Mobile Number</label>
              <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${errors.mobile ? '#EF4444' : 'rgba(30,64,175,0.15)'}`, borderRadius: 12, overflow: 'hidden', background: 'white', height: 44 }}>
                <span style={{ padding: '0 10px 0 14px', fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', borderRight: '1px solid rgba(30,64,175,0.15)', whiteSpace: 'nowrap', lineHeight: '44px' }}>+91</span>
                <input type="tel" inputMode="numeric" value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                  style={{ flex: 1, padding: '0 14px', border: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 16, color: '#0A1628', background: 'transparent' }}
                />
              </div>
              {errors.mobile && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.mobile}</p>}
            </div>

            {/* DOB */}
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#0A1628', marginBottom: 6 }}>Date of Birth</label>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                style={{ width: '100%', height: 44, padding: '0 16px', border: `1px solid ${errors.dob ? '#EF4444' : 'rgba(30,64,175,0.15)'}`, borderRadius: 12, fontFamily: 'var(--font-body)', fontSize: 16, color: '#0A1628', outline: 'none', boxSizing: 'border-box' }}
              />
              {errors.dob && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.dob}</p>}
            </div>

            <button onClick={handleVerify}
              style={{ width: '100%', height: 48, background: '#0A1628', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>
              Verify Identity →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* New Password */}
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#0A1628', marginBottom: 6 }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  style={{ width: '100%', height: 44, padding: '0 44px 0 16px', border: `1px solid ${errors.password ? '#EF4444' : 'rgba(30,64,175,0.15)'}`, borderRadius: 12, fontFamily: 'var(--font-body)', fontSize: 16, color: '#0A1628', outline: 'none', boxSizing: 'border-box' }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#4B5563' }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#0A1628', marginBottom: 6 }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showConfirm ? 'text' : 'password'} value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  style={{ width: '100%', height: 44, padding: '0 44px 0 16px', border: `1px solid ${errors.confirmPassword ? '#EF4444' : 'rgba(30,64,175,0.15)'}`, borderRadius: 12, fontFamily: 'var(--font-body)', fontSize: 16, color: '#0A1628', outline: 'none', boxSizing: 'border-box' }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#4B5563' }}>
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.confirmPassword}</p>}
            </div>

            <button onClick={handleReset}
              style={{ width: '100%', height: 48, background: '#10B981', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>
              Reset Password ✓
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
