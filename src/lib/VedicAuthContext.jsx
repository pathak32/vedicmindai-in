import React, { createContext, useContext, useState, useEffect } from 'react';

const VedicAuthContext = createContext(null);

const STORAGE_KEY = 'vedicmind_auth';

export function VedicAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const hashPassword = (password) => btoa(password + 'vedicmind_salt');

  const signUp = ({ name, email, password }) => {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) {
      const parsed = JSON.parse(existing);
      if (parsed.email === email) {
        throw new Error('An account with this email already exists.');
      }
    }
    const userData = {
      email,
      name,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
      isNewUser: true,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const signIn = ({ email, password }) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) throw new Error('No account found. Please sign up first.');
    const parsed = JSON.parse(stored);
    if (parsed.email !== email) throw new Error('No account found with this email.');
    if (parsed.passwordHash !== hashPassword(password)) throw new Error('Incorrect password.');
    setUser(parsed);
    return parsed;
  };

  const signOut = () => {
    setUser(null);
  };

  const completeOnboarding = () => {
    const updated = { ...user, isNewUser: false };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <VedicAuthContext.Provider value={{ user, loading, signUp, signIn, signOut, completeOnboarding }}>
      {children}
    </VedicAuthContext.Provider>
  );
}

export function useVedicAuth() {
  const ctx = useContext(VedicAuthContext);
  if (!ctx) throw new Error('useVedicAuth must be used within VedicAuthProvider');
  return ctx;
}