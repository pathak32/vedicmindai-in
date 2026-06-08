import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('students');

  useEffect(() => {
    const auth = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_auth')); } catch { return null; } })();
    if (!auth || auth.role !== 'admin') navigate('/');
  }, []);

  const auth = (() => { try { return JSON.parse(localStorage.getItem('vedicmind_auth')); } catch { return null; } })();
  if (!auth || auth.role !== 'admin') return null;

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <DashboardNavbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px 60px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h1 className="font-heading" style={{ fontSize: 32, fontWeight: 700, color: '#0A1628', marginBottom: 4 }}>
              🛡️ Admin Panel
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#4B5563', margin: 0 }}>
              Manage students, lessons, quizzes, and view analytics.
            </p>
          </div>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', background: 'white', borderRadius: 14, padding: 4, border: '1px solid rgba(30,64,175,0.12)', marginBottom: 24 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                padding: '8px 18px', minHeight: 40, borderRadius: 10, border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14,
                background: activeTab === t.id ? '#0A1628' : 'transparent',
                color: activeTab === t.id ? 'white' : '#4B5563',
                transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}>{t.label}</button>
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