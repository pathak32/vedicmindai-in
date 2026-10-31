import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import AdminStudents from '@/components/admin/AdminStudents';
import AdminLessons from '@/components/admin/AdminLessons';
import AdminQuizManager from '@/components/admin/AdminQuizManager';
import AdminBlogManager from '@/components/admin/AdminBlogManager';
import AdminSocialExport from '@/components/admin/AdminSocialExport';
import AdminAptitudeManager from '@/components/admin/AdminAptitudeManager';
import AdminDemoLogin from '@/components/admin/AdminDemoLogin';
import AdminReviewerAccess from '@/components/admin/AdminReviewerAccess';
import AdminReviewerActivity from '@/components/admin/AdminReviewerActivity';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import AdminLiveActivity from '@/components/admin/AdminLiveActivity';
import AdminVisitorStats from '@/components/admin/AdminVisitorStats';
import AdminQuestionReview from '@/components/admin/AdminQuestionReview';
import AdminFoundingCircleTracker from '@/components/admin/AdminFoundingCircleTracker';
import AdminLiveClasses from '@/components/admin/AdminLiveClasses';
import AdminDataRecovery from '@/components/admin/AdminDataRecovery';
import AdminSchoolAnalytics from '@/components/admin/AdminSchoolAnalytics';
import AdminAnnouncements from '@/components/admin/AdminAnnouncements';
import AdminReferrals from '@/components/admin/AdminReferrals';

const TABS = [
  { id: 'live',      label: '🟢 Live Today' },
  { id: 'traffic',   label: '🌐 Visitor Traffic' },
  { id: 'qreview',   label: '🧩 Question Review' },
  { id: 'circle',    label: '🎯 Founding Circle' },
  { id: 'liveclass', label: '🔴 Live Classes' },
  { id: 'analytics', label: '📊 Analytics' },
  { id: 'students',  label: '👥 Students'  },
  { id: 'quiz',      label: '⚡ Quiz Engine'},
  { id: 'blog',      label: '📰 Blog Manager' },
  { id: 'social',    label: '📲 Social Export' },
  { id: 'lessons',   label: '📚 Lessons'   },
  { id: 'aptitude',  label: '🎯 Aptitude'  },
  { id: 'demo',      label: '🏫 Demo Logins' },
  { id: 'reviewer',  label: '🧑‍🏫 Reviewer Access' },
  { id: 'reviewerActivity', label: '👀 Reviewer Activity' },
  { id: 'recovery', label: '🩺 Data Recovery' },
  { id: 'school', label: '🏫 School Analytics' },
  { id: 'announcements', label: '📣 Announcements' },
  { id: 'referrals', label: '🎁 Referrals' },
];

// ─── Admin Dashboard ─────────────────────────────────────────────────────────
function AdminDashboard() {
  const { signOut } = useVedicAuth();
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
        <button type="button" onClick={async () => { await signOut(); window.location.href = '/auth'; }}
          style={{ background:'transparent', color:'white', border:'1px solid rgba(255,255,255,0.35)', borderRadius:8, padding:'6px 14px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
          Sign out
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
            {activeTab === 'traffic'   && <AdminVisitorStats />}
            {activeTab === 'qreview'   && <AdminQuestionReview />}
            {activeTab === 'circle'    && <AdminFoundingCircleTracker />}
            {activeTab === 'liveclass' && <AdminLiveClasses />}
            {activeTab === 'analytics' && <AdminAnalytics />}
            {activeTab === 'students'  && <AdminStudents />}
            {activeTab === 'quiz'      && <AdminQuizManager />}
            {activeTab === 'blog'      && <AdminBlogManager />}
            {activeTab === 'social'    && <AdminSocialExport />}
            {activeTab === 'lessons'   && <AdminLessons />}
            {activeTab === 'aptitude'  && <AdminAptitudeManager />}
          {activeTab === 'demo'      && <AdminDemoLogin />}
          {activeTab === 'reviewer'  && <AdminReviewerAccess />}
          {activeTab === 'reviewerActivity' && <AdminReviewerActivity />}
          {activeTab === 'recovery' && <AdminDataRecovery />}
          {activeTab === 'school' && <AdminSchoolAnalytics />}
          {activeTab === 'announcements' && <AdminAnnouncements />}
          {activeTab === 'referrals' && <AdminReferrals />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// ─── Main AdminPanel ─────────────────────────────────────────────────────────
export default function AdminPanel() {
  const { user, loading: authLoading, signOut } = useVedicAuth();

  // Real admin check: is the logged-in Supabase account flagged
  // role: 'admin' in app_metadata. Only the server (service role / SQL) can set
  // app_metadata, so users cannot grant it to themselves. user_metadata is editable
  // by the user and must not be used for authorization.
  // Same check DashboardNavbar uses to show the admin nav link.
  const isRealAdmin = !authLoading && user?.app_metadata?.role === 'admin';

  if (authLoading) return null;

  if (!isRealAdmin) {
    return (
      <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0A1628,#0D2252,#1E40AF)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
        <div style={{ background:'rgba(255,255,255,0.06)', backdropFilter:'blur(20px)', borderRadius:24, padding:'36px 28px', width:'100%', maxWidth:340, border:'1px solid rgba(255,255,255,0.12)', textAlign:'center' }}>
          <div style={{ fontSize:40, marginBottom:8 }}>🔒</div>
          <h2 style={{ color:'white', fontSize:22, fontWeight:700, marginBottom:4 }}>Admin Access Only</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13 }}>
            This account isn't authorized for the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}
