import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminStudents from '@/components/admin/AdminStudents';
import AdminLessons from '@/components/admin/AdminLessons';
import AdminQuizManager from '@/components/admin/AdminQuizManager';
import AdminAptitudeManager from '@/components/admin/AdminAptitudeManager';
import AdminDemoLogin from '@/components/admin/AdminDemoLogin';
import AdminReviewerAccess from '@/components/admin/AdminReviewerAccess';
import AdminReviewerActivity from '@/components/admin/AdminReviewerActivity';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import AdminLiveActivity from '@/components/admin/AdminLiveActivity';
import AdminFoundingCircleTracker from '@/components/admin/AdminFoundingCircleTracker';

const ADMIN_KEY = 'VM@Admin2026';
const ADMIN_PIN = '271187';
const SESSION_KEY = 'vm_admin_session';

const TABS = [
  { id: 'live',      label: '🟢 Live Today' },
  { id: 'circle',    label: '🎯 Founding Circle' },
  { id: 'analytics', label: '📊 Analytics' },
  { id: 'students',  label: '👥 Students'  },
  { id: 'quiz',      label: '⚡ Quiz Engine'},
  { id: 'lessons',   label: '📚 Lessons'   },
  { id: 'aptitude',  label: '🎯 Aptitude'  },
  { id: 'demo',      label: '🏫 Demo Logins' },
  { id: 'reviewer',  label: '🧑‍🏫 Reviewer Access' },
  { id: 'reviewerActivity', label: '👀 Reviewer Activity' },
];

// ─── PIN Screen ──────────────────────────────────────────────────────────────
function PinScreen({ onSuccess }) {
  const [pin, setPin]       = useState('');
  const [shake, setShake]   = useState(false);
  const [error, setError]   = useState('');

  const handleDigit = (d) => {
    if (pin.length >= 6) return;
    const next = pin + d;
    setPin(next);
    if (next.length === 6) {
      setTimeout(() => {
        if (next === ADMIN_PIN) {
          onSuccess();
        } else {
          setShake(true);
          setError('Wrong PIN. Try again.');
          setTimeout(() => { setPin(''); setShake(false); setError(''); }, 900);
        }
      }, 120);
    }
  };

  const digits = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0A1628,#0D2252,#1E40AF)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <motion.div
        animate={shake ? { x:[-12,12,-10,10,-6,6,0] } : { x:0 }}
        transition={{ duration:0.5 }}
        style={{ background:'rgba(255,255,255,0.06)', backdropFilter:'blur(20px)', borderRadius:24, padding:'36px 28px', width:'100%', maxWidth:340, border:'1px solid rgba(255,255,255,0.12)', textAlign:'center' }}
      >
        <div style={{ fontSize:40, marginBottom:8 }}>🛡️</div>
        <h2 style={{ color:'white', fontSize:22, fontWeight:700, marginBottom:4 }}>Admin Access</h2>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:28 }}>Enter your 6-digit PIN</p>

        {/* PIN dots */}
        <div style={{ display:'flex', justifyContent:'center', gap:12, marginBottom:32 }}>
          {[0,1,2,3,4,5].map(i => (
            <div key={i} style={{
              width:14, height:14, borderRadius:'50%',
              background: i < pin.length ? 'white' : 'rgba(255,255,255,0.2)',
              transition:'background 0.15s',
              boxShadow: i < pin.length ? '0 0 8px rgba(255,255,255,0.6)' : 'none'
            }} />
          ))}
        </div>

        {/* Numpad */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {digits.map((d, i) => (
            <button key={i} onClick={() => {
              if (d === '⌫') setPin(p => p.slice(0,-1));
              else if (d !== '') handleDigit(d);
            }}
              style={{
                height:56, borderRadius:14, border:'1px solid rgba(255,255,255,0.1)',
                background: d==='' ? 'transparent' : 'rgba(255,255,255,0.08)',
                color:'white', fontSize:20, fontWeight:600, cursor: d==='' ? 'default' : 'pointer',
                transition:'all 0.1s',
                visibility: d==='' ? 'hidden' : 'visible',
              }}
              onMouseDown={e => e.currentTarget.style.background='rgba(255,255,255,0.18)'}
              onMouseUp={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
            >
              {d}
            </button>
          ))}
        </div>

        {error && <p style={{ color:'#FCA5A5', fontSize:13, marginTop:16 }}>{error}</p>}
        <p style={{ color:'rgba(255,255,255,0.25)', fontSize:11, marginTop:20 }}>
          Tip: You can also use the secret URL to skip PIN
        </p>
      </motion.div>
    </div>
  );
}

// ─── Admin Dashboard ─────────────────────────────────────────────────────────
function AdminDashboard({ onLock }) {
  const [activeTab, setActiveTab] = useState('live');

  return (
    <div style={{ minHeight:'100vh', background:'#F0F4FF' }}>
      {/* Top bar */}
      <div style={{ background:'#0A1628', padding:'0 24px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:20 }}>🛡️</span>
          <span style={{ color:'white', fontWeight:700, fontSize:16 }}>VedicMind Admin</span>
          <span style={{ background:'#1E40AF', color:'white', fontSize:11, padding:'2px 8px', borderRadius:20, fontWeight:600 }}>LIVE</span>
        </div>
        <button onClick={onLock}
          style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'white', padding:'6px 14px', borderRadius:8, cursor:'pointer', fontSize:13 }}>
          🔒 Lock
        </button>
      </div>

      <main style={{ maxWidth:1200, margin:'0 auto', padding:'24px 16px 80px' }}>
        {/* Tabs */}
        <div style={{ display:'flex', gap:4, flexWrap:'wrap', background:'white', borderRadius:14, padding:4, border:'1px solid rgba(30,64,175,0.12)', marginBottom:24, boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding:'9px 18px', borderRadius:10, border:'none', cursor:'pointer', fontSize:13, fontWeight:600,
                background: activeTab===tab.id ? '#0A1628' : 'transparent',
                color: activeTab===tab.id ? 'white' : '#4B5563',
                transition:'all 0.15s' }}>
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>
            {activeTab === 'live'      && <AdminLiveActivity />}
            {activeTab === 'circle'    && <AdminFoundingCircleTracker />}
            {activeTab === 'analytics' && <AdminAnalytics />}
            {activeTab === 'students'  && <AdminStudents />}
            {activeTab === 'quiz'      && <AdminQuizManager />}
            {activeTab === 'lessons'   && <AdminLessons />}
            {activeTab === 'aptitude'  && <AdminAptitudeManager />}
          {activeTab === 'demo'      && <AdminDemoLogin />}
          {activeTab === 'reviewer'  && <AdminReviewerAccess />}
          {activeTab === 'reviewerActivity' && <AdminReviewerActivity />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// ─── Main AdminPanel ─────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [searchParams] = useSearchParams();
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    // Check 1: Secret URL key
    const urlKey = searchParams.get('key');
    if (urlKey === ADMIN_KEY) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setGranted(true);
      return;
    }
    // Check 2: Session already active (PIN entered earlier this session)
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      setGranted(true);
      return;
    }
    // Else: show PIN screen
  }, []);

  const handlePinSuccess = () => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setGranted(true);
  };

  const handleLock = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setGranted(false);
  };

  if (!granted) return <PinScreen onSuccess={handlePinSuccess} />;
  return <AdminDashboard onLock={handleLock} />;
}
