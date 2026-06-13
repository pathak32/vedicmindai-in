import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { getSupabase } from '@/lib/supabaseClient';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import AdminStudents from '@/components/admin/AdminStudents';
import AdminLessons from '@/components/admin/AdminLessons';
import AdminQuizManager from '@/components/admin/AdminQuizManager';
import AdminAptitudeManager from '@/components/admin/AdminAptitudeManager';
import AdminAnalytics from '@/components/admin/AdminAnalytics';

const TABS = [
  { id: 'students',  label: '👥 Students' },
  { id: 'lessons',   label: '📚 Lessons' },
  { id: 'quiz',      label: '❓ Quiz Manager' },
  { id: 'aptitude',  label: '🎯 Aptitude Manager' },
  { id: 'analytics', label: '📊 Analytics' },
];

// Admin check: email OR mobile-derived email
function isAdmin(user) {
  if (!user) return false;
  const email = (user.email || '').toLowerCase();
  const ADMIN_EMAILS = [
    'test1@vedicmindai.in',
    'hitesh@vedicmindai.in',
    'admin@vedicmindai.in',
    'pathak32032@gmail.com',
    '918573000191@vedicmindai.in',
    '918382999038@vedicmindai.in',
  ];
  // Check direct email match
  if (ADMIN_EMAILS.includes(email)) return true;
  // Check if it's any @vedicmindai.in email (owner emails)
  if (email.endsWith('@vedicmindai.in') && email.startsWith('91857300')) return true;
  return false;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, loading } = useVedicAuth();
  const [activeTab, setActiveTab] = useState('students');
  const [ready, setReady] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      navigate('/auth');
      return;
    }
    // Debug: log user info
    const email = user.email || user?.user_metadata?.email || '';
    console.log('[AdminPanel] user:', user);
    console.log('[AdminPanel] email:', email);
    setDebugInfo(email);

    if (!isAdmin(user)) {
      console.warn('[AdminPanel] Not admin, email was:', email);
      navigate('/dashboard');
    }
  }, [ready, user]);

  if (!ready || loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F0F4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#4B5563' }}>Loading Admin Panel...</p>
        {debugInfo && <p style={{ fontSize: 12, color: '#9CA3AF' }}>Checking: {debugInfo}</p>}
      </div>
    );
  }

  if (!user || !isAdmin(user)) return null;

  const email = user.email || '';

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <DashboardNavbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px 60px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* Header */}
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h1 className="font-heading" style={{ fontSize: 32, fontWeight: 700, color: '#0A1628', marginBottom: 4 }}>
                🛡️ Admin Panel
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#6B7280', margin: 0 }}>
                Logged in as: <strong>{email}</strong>
              </p>
            </div>
          </div>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', background: 'white', borderRadius: 14, padding: 4, border: '1px solid rgba(30,64,175,0.12)', marginBottom: 24 }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
                  background: activeTab === tab.id ? '#1e40af' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : '#4B5563',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'students'  && <AdminStudents />}
          {activeTab === 'lessons'   && <AdminLessons />}
          {activeTab === 'quiz'      && <AdminQuizManager />}
          {activeTab === 'aptitude'  && <AdminAptitudeManager />}
          {activeTab === 'analytics' && <AdminAnalytics />}

        </motion.div>
      </main>
    </div>
  );
}
