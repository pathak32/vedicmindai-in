import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { useLanguage } from '@/lib/LanguageContext';
import { validateMobileForCountry, validateCustomCountryCode, resolveCountryInfo, DEFAULT_COUNTRY } from '@/lib/countryCodes';
import MobileNumberInput from '@/components/MobileNumberInput';

// ─── Helpers ────────────────────────────────────────────────────────────────
function validateMobile(m, countryCode) {
  return validateMobileForCountry(m, countryCode || DEFAULT_COUNTRY.code);
}
function validateDOB(d) { return /^\d{2}\/\d{2}\/\d{4}$/.test(d); }

function generatePasswordHint(name, dob) {
  // hint: DDMM + first 4 UPPERCASE letters of name (e.g. 0506HITE)
  const namePart = name.trim().split("").filter(c => /[a-zA-Z]/.test(c)).slice(0, 4).join("").toUpperCase();
  const parts = dob.split("/");
  const dd = (parts[0] || "").padStart(2, "0");
  const mm = (parts[1] || "").padStart(2, "0");
  return dd + mm + namePart;
}

// ─── Sign Up Form ────────────────────────────────────────────────────────────
function SignUpForm({ onSwitchTab }) {
  const { t } = useLanguage();
  const { signUpWithPassword } = useVedicAuth();
  const navigate = useNavigate();
  const [step, setStep]       = useState(1); // 1 = essentials, 2 = recovery info
  const [name, setName]       = useState('');
  const [mobile, setMobile]   = useState('');
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY.code);
  const [customCountryCode, setCustomCountryCode] = useState("");
  const [whatsappCountryCode, setWhatsappCountryCode] = useState(DEFAULT_COUNTRY.code);
  const [whatsappCustomCountryCode, setWhatsappCustomCountryCode] = useState("");
  const [dob, setDob]         = useState('');
  const [email, setEmail]     = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [password, setPassword] = useState('');
  const [secQ, setSecQ]       = useState('');
  const [secA, setSecA]       = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameNum, setSameNum] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [userType, setUserType] = useState(''); // 'student' or 'parent'
  const [grade, setGrade] = useState('');
  const [customGrade, setCustomGrade] = useState('');
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  // Auto-fill password hint (needs name + dob, so only kicks in once Step 2 is reached)
  const hint = name && dob && validateDOB(dob) ? generatePasswordHint(name, dob) : '';
  useEffect(() => { if (hint && !password) setPassword(hint); }, [hint]);

  const validateStep1 = () => {
    const e = {};
    if (!name.trim())            e.name     = 'Name required';
    if (!userType)               e.userType = 'Please select Student or Parent';
    if (!grade)                  e.grade    = userType === 'parent' ? "Child's class required" : 'Your class required';
    if (grade === 'other' && !customGrade.trim()) e.grade = 'Please specify the class';
    if (!validateMobile(mobile, countryCode)) e.mobile = 'Please enter a valid mobile number for the selected country';
    if (countryCode === 'OTHER' && !validateCustomCountryCode(customCountryCode)) e.mobile = 'Please enter a valid country code, e.g. +33';
    if (!password || password.length < 8) e.password = 'Min 8 characters';
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (!validateDOB(dob))      e.dob    = 'Format: DD/MM/YYYY';
    if (!secQ.trim())           e.secQ   = 'Security question required';
    if (!secA.trim())           e.secA   = 'Security answer required';
    if (!sameNum && !validateMobile(whatsapp, whatsappCountryCode)) e.whatsapp = 'Please enter a valid WhatsApp number for the selected country';
    if (!sameNum && whatsappCountryCode === 'OTHER' && !validateCustomCountryCode(whatsappCustomCountryCode)) e.whatsapp = 'Please enter a valid country code, e.g. +33';
    return e;
  };

  const handleContinue = () => {
    const e = validateStep1();
    setErrors(e);
    if (Object.keys(e).length) return;
    setErrors({});
    setStep(2);
  };

  const handleSignUp = async () => {
    const e = validateStep2();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    try {
      const mobileCountryInfo = resolveCountryInfo(countryCode, customCountryCode);
      const whatsappCountryInfo = sameNum
        ? mobileCountryInfo
        : resolveCountryInfo(whatsappCountryCode, whatsappCustomCountryCode);
      await signUpWithPassword({
        name: name.trim(),
        mobile: `${mobileCountryInfo.code}${mobile}`,
        countryCode: mobileCountryInfo.code,
        countryName: mobileCountryInfo.name,
        dob,
        email: email.trim() || null,
        referralCode: referralCode.trim() || null,
        password,
        securityQuestion: secQ.trim(),
        securityAnswer: secA.trim().toLowerCase(),
        whatsapp: sameNum ? `${mobileCountryInfo.code}${mobile}` : `${whatsappCountryInfo.code}${whatsapp}`,
        passwordHint: hint,
        userType,
        grade: grade === 'other' ? customGrade.trim() : grade,
      });
      toast.success('Account created! Welcome to VedicMindAI™ 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Sign up failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp = (err) => ({
    height: 44, width: '100%', padding: '0 14px', borderRadius: 12,
    border: `1.5px solid ${err ? '#EF4444' : 'rgba(30,64,175,0.2)'}`,
    fontSize: 15, outline: 'none', fontFamily: 'var(--font-body)',
    color: '#0A1628', background: 'white', boxSizing: 'border-box',
  });

  // ─── Step indicator (2 dots) — tells the user there's just one more short step
  const StepDots = () => (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, flex:1 }}>
        <div style={{ width:24, height:24, borderRadius:'50%', background:'#0A1628', color:'white', fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>1</div>
        <span style={{ fontSize:12, fontWeight:600, color:'#0A1628' }}>Your basics</span>
      </div>
      <div style={{ flex:1, height:2, background: step >= 2 ? '#0A1628' : 'rgba(30,64,175,0.15)', borderRadius:1 }} />
      <div style={{ display:'flex', alignItems:'center', gap:6, flex:1 }}>
        <div style={{ width:24, height:24, borderRadius:'50%', background: step >= 2 ? '#0A1628' : 'rgba(30,64,175,0.15)', color: step >= 2 ? 'white' : '#9CA3AF', fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>2</div>
        <span style={{ fontSize:12, fontWeight:600, color: step >= 2 ? '#0A1628' : '#9CA3AF' }}>Account recovery</span>
      </div>
    </div>
  );

  if (step === 1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <StepDots />

        {/* Name */}
        <div>
          <label style={lbl}>Full Name *</label>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="Hitesh Pathak" style={inp(errors.name)} autoFocus />
          {errors.name && <Err>{errors.name}</Err>}
        </div>

        {/* Student or Parent */}
        <div>
          <label style={lbl}>I am a *</label>
          <div style={{ display:'flex', gap:10 }}>
            {['student','parent'].map(type => (
              <button key={type} type="button"
                onClick={() => { setUserType(type); setGrade(''); }}
                style={{
                  flex:1, height:44, borderRadius:12, border: userType===type ? '2px solid #0A1628' : '1.5px solid rgba(30,64,175,0.2)',
                  background: userType===type ? '#0A1628' : 'white',
                  color: userType===type ? 'white' : '#4B5563',
                  fontFamily:'var(--font-body)', fontSize:14, fontWeight:600, cursor:'pointer',
                }}>
                {type === 'student' ? '🎓 Student' : '👨‍👩‍👧 Parent'}
              </button>
            ))}
          </div>
          {errors.userType && <Err>{errors.userType}</Err>}
        </div>

        {/* Grade — shown only after user type is selected */}
        {userType && (
          <div>
            <label style={lbl}>
              {userType === 'parent' ? "Child's Class *" : 'Your Class *'}
            </label>
            <select value={grade} onChange={e => { setGrade(e.target.value); setCustomGrade(''); }}
              style={{ ...inp(errors.grade), appearance:'none', cursor:'pointer' }}>
              <option value="">-- Select Class --</option>
              <option disabled style={{ color:'#9CA3AF', fontSize:12 }}>── Early Years ──</option>
              <option value="Nursery">Nursery / LKG / UKG</option>
              <option value="1">Class 1</option>
              <option value="2">Class 2</option>
              <option disabled style={{ color:'#9CA3AF', fontSize:12 }}>── Primary (App Supported) ──</option>
              {['3','4','5','6','7','8','9','10'].map(g => (
                <option key={g} value={g}>Class {g}</option>
              ))}
              <option disabled style={{ color:'#9CA3AF', fontSize:12 }}>── Senior Secondary ──</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
              <option disabled style={{ color:'#9CA3AF', fontSize:12 }}>── Competitive Prep ──</option>
              <option value="JEE">JEE Preparation</option>
              <option value="NEET">NEET Preparation</option>
              <option value="SSC">SSC / Government Exams</option>
              <option value="other">Other (specify below)</option>
            </select>
            {grade === 'other' && (
              <input
                value={customGrade}
                onChange={e => setCustomGrade(e.target.value)}
                placeholder="e.g. Adult learner, A-Levels, Class 13..."
                style={{ ...inp(false), marginTop: 8 }}
                autoFocus
              />
            )}
            {errors.grade && <Err>{errors.grade}</Err>}
          </div>
        )}

        {/* Mobile */}
        <div>
          <label style={lbl}>Mobile Number *</label>
          <MobileNumberInput
            countryCode={countryCode}
            onCountryCodeChange={setCountryCode}
            customCountryCode={customCountryCode}
            onCustomCountryCodeChange={setCustomCountryCode}
            mobile={mobile}
            onMobileChange={setMobile}
            placeholder="Mobile number"
            hasError={!!errors.mobile}
          />
          {errors.mobile && <Err>{errors.mobile}</Err>}
        </div>

        {/* Password */}
        <div>
          <label style={lbl}>Password *</label>
          <div style={{ position:'relative' }}>
            <input type={showPass?'text':'password'} value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              style={{ ...inp(errors.password), paddingRight:44 }} />
            <button type="button" onClick={() => setShowPass(!showPass)}
              style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:16, color:'#6B7280' }}>
              {showPass ? '🙈' : '👁'}
            </button>
          </div>
          {errors.password && <Err>{errors.password}</Err>}
        </div>

        <button type="button" onClick={handleContinue}
          style={{ width:'100%', height:46, background:'#0A1628', color:'white', border:'none', borderRadius:12, fontSize:15, fontWeight:700, cursor:'pointer', marginTop:4 }}>
          Continue →
        </button>
        <p style={{ textAlign:'center', fontSize:12, color:'#9CA3AF', margin:0 }}>
          One more short step — just account recovery info
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <StepDots />

      {/* WhatsApp same? */}
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" id="sameNum" checked={sameNum} onChange={e => setSameNum(e.target.checked)}
          style={{ width:16, height:16, cursor:'pointer' }} />
        <label htmlFor="sameNum" style={{ fontSize:13, color:'#4B5563', cursor:'pointer' }}>
          WhatsApp number is same as mobile
        </label>
      </div>
      {!sameNum && (
        <div>
          <label style={lbl}>WhatsApp Number *</label>
          <MobileNumberInput
            countryCode={whatsappCountryCode}
            onCountryCodeChange={setWhatsappCountryCode}
            customCountryCode={whatsappCustomCountryCode}
            onCustomCountryCodeChange={setWhatsappCustomCountryCode}
            mobile={whatsapp}
            onMobileChange={setWhatsapp}
            placeholder="WhatsApp number"
            hasError={!!errors.whatsapp}
          />
          {errors.whatsapp && <Err>{errors.whatsapp}</Err>}
        </div>
      )}
      {/* DOB */}
      <div>
        <label style={lbl}>Date of Birth * (DD/MM/YYYY)</label>
        <input value={dob}
          onChange={e => {
            const raw = e.target.value.replace(/\D/g,'').slice(0,8);
            let v = raw;
            if (raw.length > 4) v = raw.slice(0,2) + '/' + raw.slice(2,4) + '/' + raw.slice(4);
            else if (raw.length > 2) v = raw.slice(0,2) + '/' + raw.slice(2);
            setDob(v);
          }}
          placeholder="15/06/1985" style={inp(errors.dob)} maxLength={10} autoFocus />
        {errors.dob && <Err>{errors.dob}</Err>}
      </div>

      {/* Email (optional) */}
      <div>
        <label style={lbl}>Email <span style={{ color:'#9CA3AF', fontSize:12 }}>(optional — for password recovery)</span></label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="you@email.com" style={inp(false)} />
      </div>
      {/* Referral Code (optional) */}
      <div>
        <label style={lbl}>Referral Code <span style={{ color:'#9CA3AF', fontSize:12 }}>(optional)</span></label>
        <input type="text" value={referralCode} onChange={e => setReferralCode(e.target.value)}
          placeholder="Enter code if you have one" style={inp(false)} />
      </div>

      {/* Security Question */}
      <div>
        <label style={lbl}>Security Question * <span style={{ color:'#9CA3AF', fontSize:12 }}>(for forgot password)</span></label>
        <select value={secQ} onChange={e => setSecQ(e.target.value)}
          style={{ ...inp(errors.secQ), appearance:'none', cursor:'pointer' }}>
          <option value="">-- Select a question --</option>
          <option>What is your mother's maiden name?</option>
          <option>What was the name of your first pet?</option>
          <option>What city were you born in?</option>
          <option>What is your favourite teacher's name?</option>
          <option>What was the name of your primary school?</option>
        </select>
        {errors.secQ && <Err>{errors.secQ}</Err>}
      </div>

      {/* Security Answer */}
      <div>
        <label style={lbl}>Answer *</label>
        <input value={secA} onChange={e => setSecA(e.target.value)}
          placeholder="Your answer (case-insensitive)" style={inp(errors.secA)} />
        {errors.secA && <Err>{errors.secA}</Err>}
      </div>

      <div style={{ display:'flex', gap:10, marginTop:4 }}>
        <button type="button" onClick={() => setStep(1)}
          style={{ height:46, padding:'0 18px', background:'white', color:'#0A1628', border:'1.5px solid rgba(30,64,175,0.2)', borderRadius:12, fontSize:15, fontWeight:600, cursor:'pointer' }}>
          ← Back
        </button>
        <button type="button" onClick={handleSignUp} disabled={loading}
          style={{ flex:1, height:46, background: loading?'#6B7280':'#0A1628', color:'white', border:'none', borderRadius:12, fontSize:15, fontWeight:700, cursor: loading?'not-allowed':'pointer' }}>
          {loading ? 'Creating Account…' : 'Create Account →'}
        </button>
      </div>
    </div>
  );
}

// ─── Sign In Form ────────────────────────────────────────────────────────────
function SignInForm({ onSwitchTab }) {
  const { t } = useLanguage();
  const { signInWithPassword } = useVedicAuth();
  const navigate = useNavigate();
  const [mobile, setMobile]   = useState('');
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY.code);
  const [customCountryCode, setCustomCountryCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const handleSignIn = async () => {
    const e = {};
    if (!validateMobile(mobile, countryCode)) e.mobile = 'Please enter a valid mobile number for the selected country';
    if (countryCode === 'OTHER' && !validateCustomCountryCode(customCountryCode)) e.mobile = 'Please enter a valid country code, e.g. +33';
    if (!password)               e.password = 'Password required';
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    try {
      const countryInfo = resolveCountryInfo(countryCode, customCountryCode);
      await signInWithPassword({ mobile: `${countryInfo.code}${mobile}`, password });
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed. Check your number & password.');
    } finally {
      setLoading(false);
    }
  };
  const inp = (err) => ({
    height:44, width:'100%', padding:'0 14px', borderRadius:12,
    border:`1.5px solid ${err?'#EF4444':'rgba(30,64,175,0.2)'}`,
    fontSize:15, outline:'none', fontFamily:'var(--font-body)',
    color:'#0A1628', background:'white', boxSizing:'border-box',
  });
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div>
        <label style={lbl}>Mobile Number *</label>
        <MobileNumberInput
          countryCode={countryCode}
          onCountryCodeChange={setCountryCode}
          customCountryCode={customCountryCode}
          onCustomCountryCodeChange={setCustomCountryCode}
          mobile={mobile}
          onMobileChange={setMobile}
          placeholder="Mobile number"
          hasError={!!errors.mobile}
        />
        {errors.mobile && <Err>{errors.mobile}</Err>}
      </div>
      <div>
        <label style={lbl}>Password *</label>
        <div style={{ position:'relative' }}>
          <input type={showPass?'text':'password'} value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Your password"
            style={{ ...inp(errors.password), paddingRight:44 }} />
          <button type="button" onClick={() => setShowPass(!showPass)}
            style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:16, color:'#6B7280' }}>
            {showPass ? '🙈' : '👁'}
          </button>
        </div>
        {errors.password && <Err>{errors.password}</Err>}
      </div>
      <div style={{ textAlign:'right' }}>
        <button type="button" onClick={() => navigate('/forgot-password')}
          style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, color:'#3B82F6', fontWeight:600 }}>
          {t('forgotPassword')}
        </button>
      </div>
      <button type="button" onClick={handleSignIn} disabled={loading}
        style={{ width:'100%', height:46, background: loading?'#6B7280':'#0A1628', color:'white', border:'none', borderRadius:12, fontSize:15, fontWeight:700, cursor: loading?'not-allowed':'pointer' }}>
        {loading ? 'Signing In…' : 'Sign In →'}
      </button>
    </div>
  );
}
// ─── Shared styles ───────────────────────────────────────────────────────────
const lbl = { display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:4 };
const Err = ({ children }) => <p style={{ color:'#EF4444', fontSize:12, margin:'3px 0 0' }}>{children}</p>;

// ─── Main AuthPage ───────────────────────────────────────────────────────────
export default function AuthPage() {
  const { t } = useLanguage();
  const [tab, setTab] = useState('signin');
  const { user, loading } = useVedicAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate('/dashboard', { replace: true });
  }, [user, loading]);

  if (loading) return null;
  if (user) return null;

  const tabBtn = (t) => ({
    flex:1, minHeight:44, border:'none', cursor:'pointer', borderRadius:8, padding:'10px 16px',
    fontFamily:'var(--font-body)', fontSize:14, fontWeight:600, transition:'all 0.2s',
    background: tab===t ? 'white' : 'transparent',
    color: tab===t ? '#0A1628' : '#4B5563',
    boxShadow: tab===t ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
  });

  return (
    <div style={{ display:'flex', flexDirection:'row', minHeight:'100vh', width:'100%', overflowX:'hidden' }}>
      <style>{`
        @media (max-width: 640px) {
          .auth-left { display: none !important; }
          .auth-right { width: 100% !important; padding: 16px !important; }
          .auth-card { padding: 20px 16px !important; }
        }
      `}</style>

      {/* Left panel */}
      <div className="auth-left" style={{
        width:'50%', background:'linear-gradient(135deg, #0A1628 0%, #0D2252 60%, #1E40AF 100%)',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:'48px 40px', position:'relative', overflow:'hidden',
      }}>
        {[
          { text:'73×97=7081', style:{ top:'15%', left:'10%' } },
          { text:'√1764=42',   style:{ top:'55%', right:'8%' } },
          { text:'25²=625',    style:{ bottom:'20%', left:'15%' } },
        ].map(({ text, style }) => (
          <span key={text} style={{ position:'absolute', fontFamily:'var(--font-mono)', fontSize:13, color:'rgba(255,255,255,0.07)', userSelect:'none', pointerEvents:'none', ...style }}>{text}</span>
        ))}
        <div style={{ position:'relative', zIndex:2, textAlign:'center', maxWidth:360 }}>
          <span style={{ fontSize:64, display:'block', marginBottom:24 }}>🧮</span>
          <h2 className="font-heading" style={{ fontSize:34, fontWeight:700, color:'white', lineHeight:1.2, marginBottom:24, whiteSpace:'pre-line' }}>
            {"Ancient Wisdom.\nInfinite Speed."}
          </h2>
          <div style={{ display:'flex', flexDirection:'column', gap:14, textAlign:'left' }}>
            {[
              '40 Vedic Maths lessons — Beginner to Master',
              'AI Tutor available 24/7',
              'Daily Quiz, Leaderboard & Aptitude 🎉',
              '⚡ Battle Mode & Weekly Exam — Live!',
              '🔒 No OTP needed — Simple Password Login',
            ].map(point => (
              <div key={point} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:20, height:20, borderRadius:'50%', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:11, color:'white' }}>✓</div>
                <span style={{ fontFamily:'var(--font-body)', fontSize:14, color:'rgba(255,255,255,0.85)' }}>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right" style={{ width:'50%', background:'white', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'32px 24px', minHeight:'100vh', boxSizing:'border-box', overflowY:'auto' }}>
        <div className="w-full max-w-md">
          <div className="glass-card auth-card" style={{ padding:'28px 24px' }}>
            {/* Tabs */}
            <div style={{ display:'flex', background:'#F0F4FF', borderRadius:12, padding:4, marginBottom:24 }}>
              <button type="button" style={tabBtn('signin')} onClick={() => setTab('signin')}>{t('signIn')}</button>
              <button type="button" style={tabBtn('signup')} onClick={() => setTab('signup')}>{t('signUp')}</button>
            </div>

            {tab === 'signin'
              ? <SignInForm onSwitchTab={() => setTab('signup')} />
              : <SignUpForm onSwitchTab={() => setTab('signin')} />
            }
          </div>

          <p style={{ textAlign:'center', fontSize:13, color:'#6B7280', marginTop:16 }}>
            {tab === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={() => setTab(tab==='signin'?'signup':'signin')}
              style={{ background:'none', border:'none', cursor:'pointer', color:'#3B82F6', fontWeight:700, fontSize:13 }}>
              {tab === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}