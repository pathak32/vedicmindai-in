import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import AdminStudents from '@/components/admin/AdminStudents';
import AdminLessons from '@/components/admin/AdminLessons';
import AdminQuizManager from '@/components/admin/AdminQuizManager';
import AdminAptitudeManager from '@/components/admin/AdminAptitudeManager';
import AdminAnalytics from '@/components/admin/AdminAnalytics';

const TABS = [
  { id: 'analytics', label: '📊 Analytics' },
  { id: 'students',  label: '👥 Students' },
  { id: 'quiz',      label: '❓ Quiz Manager' },
  { id: 'lessons',   label: '📚 Lessons' },
  { id: 'aptitude',  label: '🎯 Aptitude' },
];

const ADMIN_MOBILES = ['8573000191', '8382999038'];
const ADMIN_EMAILS  = [
  '918573000191@vedicmindai.in',
  '918382999038@vedicmindai.in',
  'hitesh@vedicmindai.in',
  'test1@vedicmindai.in',
  'admin@vedicmindai.in',
];

function isAdmin(user) {
  if (!user) return false;
  const email = (user.email || '').toLowerCase().trim();
  if (ADMIN_EMAILS.includes(email)) return true;
  // Also check user_metadata
  const metaEmail = (user.user_metadata?.email || '').toLowerCase().trim();
  if (ADMIN_EMAILS.includes(metaEmail)) return true;
  return false;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, loading } = useVedicAuth();
  const [activeTab, setActiveTab] = useState('analytics');
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Wait for auth to fully load before checking
    if (loading) return;
    setAuthChecked(true);
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!isAdmin(user)) {
      console.warn('[AdminPanel] Not admin. Email:', user.email);
      navigate('/dashboard');
    }
  }, [user, loading]);

  // Still loading auth
  if (loading || !authChecked) {
    return (
      <div style={{ minHeight:'100vh', background:'#F0F4FF', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}>
        <div style={{ fontSize:32 }}>🛡️</div>
        <p style={{ color:'#4B5563', fontSize:16 }}>Verifying admin access...</p>
      </div>
    );
  }

  if (!user || !isAdmin(user)) return null;

  return (
    <div style={{ minHeight:'100vh', background:'#F0F4FF' }}>
      <DashboardNavbar />
      <main style={{ maxWidth:1200, margin:'0 auto', padding:'24px 16px 80px' }}>
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }}>

          <div style={{ marginBottom:20 }}>
            <h1 style={{ fontSize:28, fontWeight:700, color:'#0A1628', marginBottom:2 }}>🛡️ Admin Panel</h1>
            <p style={{ fontSize:13, color:'#6B7280' }}>Logged in as: <strong>{user.email}</strong></p>
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', gap:4, flexWrap:'wrap', background:'white', borderRadius:14, padding:4, border:'1px solid rgba(30,64,175,0.12)', marginBottom:24 }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ padding:'8px 16px', borderRadius:10, border:'none', cursor:'pointer', fontSize:13, fontWeight:500,
                  background: activeTab===tab.id ? '#1e40af' : 'transparent',
                  color: activeTab===tab.id ? '#fff' : '#4B5563',
                  transition:'all 0.15s' }}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'analytics' && <AdminAnalytics />}
          {activeTab === 'students'  && <AdminStudents />}
          {activeTab === 'quiz'      && <AdminQuizManager />}
          {activeTab === 'lessons'   && <AdminLessons />}
          {activeTab === 'aptitude'  && <AdminAptitudeManager />}

        </motion.div>
      </main>
    </div>
  );
}
