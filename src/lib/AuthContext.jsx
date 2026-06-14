import React, { createContext, useState, useContext, useEffect } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]                               = useState(null);
  const [isAuthenticated, setIsAuthenticated]         = useState(false);
  const [isLoadingAuth, setIsLoadingAuth]             = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError]                     = useState(null);
  const [authChecked, setAuthChecked]                 = useState(false);
  const [appPublicSettings]                           = useState({ app: { name: 'VedicMindAI' } });

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const supabase = await getSupabase();
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
      setAuthChecked(true);

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      });
    } catch (err) {
      console.error('AuthContext init error:', err);
      setIsAuthenticated(false);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const logout = async () => {
    const supabase = await getSupabase();
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  const navigateToLogin = () => {
    window.location.href = '/auth';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
