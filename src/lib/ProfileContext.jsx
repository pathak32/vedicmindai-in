import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabase } from './supabaseClient';
import { getUserProfile, saveUserProfile } from './supabaseDataService';

const ProfileContext = createContext(null);
const STORAGE_KEY = 'vedicmind_profile';

const defaultProfile = {
  role: '', name: '', age: '', gender: '', grade: '',
  board: '', goal: '', timeCommitment: '', learningStyle: '', aiAnalysis: '',
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultProfile; } catch { return defaultProfile; }
  });

  // Sync to localStorage + Supabase on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    // Save to Supabase async (non-blocking)
    (async () => {
      try {
        const supabase = await getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          await saveUserProfile(session.user.id, {
            name: profile.name,
            goal: profile.goal,
            class_group: profile.classGroup || 'class_a',
            subscription_status: profile.subscriptionStatus || 'trial',
            payment_status: profile.paymentStatus,
            ai_analysis: profile.aiAnalysis ? (typeof profile.aiAnalysis === 'string' ? { note: profile.aiAnalysis } : profile.aiAnalysis) : {},
          });
        }
      } catch (e) { /* silent fail */ }
    })();
  }, [profile]);

  const updateProfile = (data) => setProfile(prev => ({ ...prev, ...data }));

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
