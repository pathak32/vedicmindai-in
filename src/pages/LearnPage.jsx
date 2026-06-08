import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import LearnSidebar from '@/components/learn/LearnSidebar';
import LessonViewer from '@/components/learn/LessonViewer';
import AITutorPanel from '@/components/learn/AITutorPanel';
import { CURRICULUM } from '@/components/learn/curriculumData';

export default function LearnPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [progressVersion, setProgressVersion] = useState(0);

  const profile = JSON.parse(localStorage.getItem('vedicmind_profile') || '{}');

  // Re-read progress reactively whenever progressVersion changes
  const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');

  useEffect(() => {
    if (!localStorage.getItem('vedicmind_auth')) navigate('/auth');
  }, []);

  // Determine current lesson
  const allIds = CURRICULUM.flatMap(lv => lv.lessons.map(l => l.id));
  const savedCurrent = progress.currentLesson || 'l1_01';
  const defaultLesson = allIds.includes(savedCurrent) ? savedCurrent : 'l1_01';
  const [activeLessonId, setActiveLessonId] = useState(defaultLesson);

  const activeLesson = CURRICULUM.flatMap(lv => lv.lessons).find(l => l.id === activeLessonId);

  const handleSelectLesson = (id) => {
    setActiveLessonId(id);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF', display: 'flex', flexDirection: 'column', paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <DashboardNavbar />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Desktop sidebar */}
        <div className="learn-sidebar-desktop">
          <LearnSidebar
            activeLessonId={activeLessonId}
            onSelect={handleSelectLesson}
            progress={progress}
            onClose={() => setSidebarOpen(false)}
            key={progressVersion}
          />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
            <div onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 300, background: 'white', zIndex: 201 }}>
              <LearnSidebar
                activeLessonId={activeLessonId}
                onSelect={handleSelectLesson}
                progress={progress}
                onClose={() => setSidebarOpen(false)}
                showClose
                key={progressVersion}
              />
            </div>
          </div>
        )}

        {/* Main lesson area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px 100px', minWidth: 0 }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {activeLesson && (
              <LessonViewer
                lesson={activeLesson}
                progress={progress}
                allLessonIds={allIds}
                onNavigateToLesson={(id) => { setActiveLessonId(id); window.scrollTo(0, 0); }}
                onLessonComplete={(lessonId, xp, score) => {
                  const p = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
                  if (!p.completedLessons) p.completedLessons = [];
                  if (!p.completedLessons.includes(lessonId)) p.completedLessons.push(lessonId);
                  if (!p.lessonScores) p.lessonScores = {};
                  p.lessonScores[lessonId] = score;
                  p.totalXP = (p.totalXP || 0) + xp;
                  // badge checks
                  if (!p.badges) p.badges = [];
                  if (p.completedLessons.length >= 1 && !p.badges.includes('first_lesson')) p.badges.push('first_lesson');
                  if (p.completedLessons.length >= 5 && !p.badges.includes('five_lessons')) p.badges.push('five_lessons');
                  if (p.totalXP >= 500 && !p.badges.includes('xp_500')) p.badges.push('xp_500');
                  if (score === 100 && !p.badges.includes('perfect_score')) p.badges.push('perfect_score');
                  // advance current lesson pointer (does NOT navigate)
                  const nextId = allIds[allIds.indexOf(lessonId) + 1];
                  if (nextId) p.currentLesson = nextId;
                  // study date
                  const today = new Date().toISOString().split('T')[0];
                  if (!p.studyDates) p.studyDates = [];
                  if (!p.studyDates.includes(today)) p.studyDates.push(today);
                  localStorage.setItem('vedicmind_progress', JSON.stringify(p));
                  // trigger sidebar re-render with fresh progress
                  setProgressVersion(v => v + 1);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="learn-sidebar-btn"
        style={{
          position: 'fixed', bottom: 80, left: 16, zIndex: 100,
          background: '#0A1628', color: 'white', border: 'none',
          borderRadius: 100, padding: '12px 20px', minHeight: 44,
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          boxShadow: '0 4px 20px rgba(10,22,40,0.3)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        <Menu size={16} /> Curriculum
      </button>

      {/* AI Tutor button */}
      <button
        onClick={() => setAiOpen(true)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 100,
          background: '#0A1628', color: 'white', border: 'none',
          borderRadius: 100, padding: '12px 20px', minHeight: 44,
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          boxShadow: '0 4px 20px rgba(10,22,40,0.3)',
        }}
      >
        🤖 Ask AI Tutor{' '}
        <span style={{
          marginLeft: 6, background: '#F59E0B', color: 'white',
          borderRadius: 99, padding: '2px 7px',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
          verticalAlign: 'middle',
        }}>SOON</span>
      </button>

      {aiOpen && (
        <AITutorPanel
          lesson={activeLesson}
          onClose={() => setAiOpen(false)}
        />
      )}

      <style>{`
        .learn-sidebar-desktop {
          width: 280px;
          flex-shrink: 0;
          height: calc(100vh - 64px);
          position: sticky;
          top: 64px;
          overflow-y: auto;
          border-right: 1px solid rgba(30,64,175,0.12);
          background: white;
          /* Prevent desktop sidebar from capturing mobile touch swipes */
          touch-action: pan-y;
          overscroll-behavior: contain;
        }
        .learn-sidebar-btn { display: none !important; }
        @media (max-width: 768px) {
          .learn-sidebar-desktop { display: none !important; touch-action: none; }
          .learn-sidebar-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}