import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import ModeSelector from '@/components/practice/ModeSelector';
import SpeedDrill from '@/components/practice/SpeedDrill';
import TopicPractice from '@/components/practice/TopicPractice';
import ChallengeMode from '@/components/practice/ChallengeMode';

export default function PracticePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null); // null | 'speed' | 'topic' | 'challenge'
  const [selectedTopic, setSelectedTopic] = useState('ekadhikena');

  useEffect(() => {
    if (!localStorage.getItem('vedicmind_auth')) navigate('/auth');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF', paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <DashboardNavbar />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {!mode && (
            <>
              <h1 className="font-heading" style={{ fontSize: 'clamp(24px,5vw,32px)', fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>
                ⚡ Practice Arena
              </h1>
              <p style={{ fontSize: 16, color: '#4B5563', fontFamily: 'var(--font-body)', marginBottom: 32 }}>
                Sharpen your Vedic Maths speed with targeted practice
              </p>
              <ModeSelector
                selectedTopic={selectedTopic}
                onTopicChange={setSelectedTopic}
                onStart={(m) => setMode(m)}
              />
            </>
          )}
          {mode === 'speed' && (
            <SpeedDrill onExit={() => setMode(null)} />
          )}
          {mode === 'topic' && (
            <TopicPractice topic={selectedTopic} onExit={() => setMode(null)} onChangeTopic={() => setMode(null)} />
          )}
          {mode === 'challenge' && (
            <ChallengeMode onExit={() => setMode(null)} />
          )}
        </motion.div>
      </main>
    </div>
  );
}