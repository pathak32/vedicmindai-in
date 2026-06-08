import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext(null);

const STORAGE_KEY = 'vedicmind_profile';

const defaultProfile = {
  role: '',
  name: '',
  age: '',
  gender: '',
  grade: '',
  board: '',
  goal: '',
  timeCommitment: '',
  learningStyle: '',
  aiAnalysis: '',
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (data) => {
    setProfile(prev => ({ ...prev, ...data }));
  };

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