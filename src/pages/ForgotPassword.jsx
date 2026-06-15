import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { useLanguage } from '@/lib/LanguageContext';

const lbl = { display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:4 };
const Err = ({ children }) => <p style={{ color:'#EF4444', fontSize:12, margin:'3px 0 0' }}>{children}</p>;

const inp = (err) => ({
  height:44, width:'100%', padding:'0 14px', borderRadius:12,
  border:`1.5px solid ${err?'#EF4444':'rgba(30,64,175,0.2)'}`,
  fontSize:15, outline:'none', fontFamily:'var(--font-body)',
  color:'#0A1628', background:'white', boxSizing:'border-box',
});

export default function ForgotPassword() {
  const { t } = useLanguage();
  const { getPasswordHint, verifySecurityAnswer } = useVedicAuth();
  const navigate = useNavigate();

  const [step, setStep]     = useState(1); // 1=mobile, 2=hint+question, 3=answer
  const [mobile, setMobile] = useState('');
  const [hint, setHint]     = useState('');
  const [secQ, setSecQ]     = useState('');
  const [answer, setAnswer] = useState('');
  const [revealedHint, setRevealedHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  // Step 1 — enter mobile
  const handleGetHint = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) { setError('Enter valid 10-digit number'); return; }
    setError('');
    setLoading(true);
    try {
      const data = await getPasswordHint(mobile);
      setHint(data.password_hint);
      setSecQ(data.security_question);
      setStep(2);
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  // Step 2 — show hint, ask if they want security question
  // Step 3 — verify security answer → reveal password hint fully
  const handleVerify = async () => {
    if (!answer.trim()) { setError('Please enter your answer'); return; }
    setError('');
    setLoading(true);
    try {
      const fullHint = await verifySecurityAnswer(mobile, answer);
      setRevealedHint(fullHint);
      setStep(4);
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  const card = {
    maxWidth:420, margin:'60px auto', background:'white', borderRadius:20,
    padding:'32px 28px', boxShadow:'0 4px 24px rgba(10,22,40,0.10)',
  };

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFF', padding:'20px 16px' }}>
      <div style={card}>
        <button onClick={() => navigate('/auth')}
          style={{ background:'none', border:'none', cursor:'pointer', color:'#6B7280', fontSize:13, marginBottom:20, padding:0 }}>
          ← Back to Login
        </button>

        <h2 style={{ fontFamily:'var(--font-heading)', fontSize:24, fontWeight:700, color:'#0A1628', marginBottom:6 }}>
          {t('forgotPassword')}
        </h2>
        <p style={{ fontSize:13, color:'#6B7280', marginBottom:24 }}>
          No worries — we'll help you recover it without OTP.
        </p>

        {/* Step 1 — Mobile */}
        {step === 1 && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <label style={lbl}>Registered Mobile Number</label>
              <div style={{ display:'flex', border:`1.5px solid ${error?'#EF4444':'rgba(30,64,175,0.2)'}`, borderRadius:12, overflow:'hidden', height:44, background:'white' }}>
                <span style={{ padding:'0 10px 0 14px', fontSize:14, color:'#4B5563', borderRight:'1px solid rgba(30,64,175,0.15)', lineHeight:'44px', flexShrink:0 }}>+91</span>
                <input type="tel" inputMode="numeric" value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/g,'').slice(0,10))}
                  placeholder="10-digit number"
                  style={{ flex:1, padding:'0 12px', border:'none', outline:'none', fontSize:15, color:'#0A1628', background:'transparent' }} />
              </div>
              {error && <Err>{error}</Err>}
            </div>
            <button onClick={handleGetHint} disabled={loading}
              style={{ height:44, background:'#0A1628', color:'white', border:'none', borderRadius:12, fontSize:15, fontWeight:700, cursor:loading?'not-allowed':'pointer' }}>
              {loading ? 'Checking…' : 'Get Password Hint →'}
            </button>
          </div>
        )}

        {/* Step 2 — Show hint */}
        {step === 2 && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ background:'#F0F4FF', borderRadius:12, padding:'16px', border:'1px solid rgba(59,130,246,0.2)' }}>
              <p style={{ fontSize:13, color:'#374151', margin:'0 0 6px', fontWeight:600 }}>Your Password Hint:</p>
              <p style={{ fontSize:20, fontFamily:'var(--font-mono)', color:'#0A1628', margin:0, fontWeight:700 }}>{hint}</p>
              <p style={{ fontSize:11, color:'#9CA3AF', margin:'6px 0 0' }}>Format: Name initials + Day + @ + Year of birth</p>
            </div>
            <p style={{ fontSize:13, color:'#6B7280', textAlign:'center', margin:0 }}>
              Remembered it?{' '}
              <button onClick={() => navigate('/auth')}
                style={{ background:'none', border:'none', cursor:'pointer', color:'#3B82F6', fontWeight:700, fontSize:13 }}>
                Go to Login
              </button>
            </p>
            <div style={{ borderTop:'1px solid #E5E7EB', paddingTop:16 }}>
              <p style={{ fontSize:13, color:'#374151', marginBottom:12, textAlign:'center' }}>
                Still can't remember? Answer your security question:
              </p>
              <p style={{ fontSize:14, fontWeight:600, color:'#0A1628', background:'#F9FAFB', padding:'10px 14px', borderRadius:10, marginBottom:12 }}>
                {secQ}
              </p>
              <button onClick={() => setStep(3)}
                style={{ width:'100%', height:42, background:'transparent', color:'#0A1628', border:'2px solid #0A1628', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer' }}>
                Answer Security Question →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Answer security question */}
        {step === 3 && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ background:'#F9FAFB', borderRadius:12, padding:'12px 14px' }}>
              <p style={{ fontSize:13, color:'#6B7280', margin:'0 0 4px' }}>Security Question:</p>
              <p style={{ fontSize:14, fontWeight:600, color:'#0A1628', margin:0 }}>{secQ}</p>
            </div>
            <div>
              <label style={lbl}>Your Answer</label>
              <input value={answer} onChange={e => setAnswer(e.target.value)}
                placeholder="Case-insensitive" style={inp(!!error)} />
              {error && <Err>{error}</Err>}
            </div>
            <button onClick={handleVerify} disabled={loading}
              style={{ height:44, background:'#0A1628', color:'white', border:'none', borderRadius:12, fontSize:15, fontWeight:700, cursor:loading?'not-allowed':'pointer' }}>
              {loading ? 'Verifying…' : 'Verify Answer →'}
            </button>
          </div>
        )}

        {/* Step 4 — Reveal */}
        {step === 4 && (
          <div style={{ display:'flex', flexDirection:'column', gap:16, textAlign:'center' }}>
            <div style={{ fontSize:48 }}>🎉</div>
            <p style={{ fontSize:14, color:'#374151' }}>Identity verified! Your password is:</p>
            <div style={{ background:'#F0FDF4', border:'2px solid #22C55E', borderRadius:12, padding:'16px' }}>
              <p style={{ fontSize:24, fontFamily:'var(--font-mono)', color:'#15803D', fontWeight:700, margin:0, letterSpacing:2 }}>
                {revealedHint}
              </p>
            </div>
            <p style={{ fontSize:12, color:'#9CA3AF' }}>Please change your password after logging in.</p>
            <button onClick={() => navigate('/auth')}
              style={{ height:44, background:'#0A1628', color:'white', border:'none', borderRadius:12, fontSize:15, fontWeight:700, cursor:'pointer' }}>
              Go to Login →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
