import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const VedicAuthContext = createContext(null);

// ============================================================
// HYBRID APPROACH:
// - Auth (login/signup/session) → Supabase
// - Profile/Progress data → localStorage (unchanged)
// - Background sync → Supabase (optional, non-blocking)
// ============================================================

export function VedicAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        // Sync localStorage auth with Supabase user
        syncLocalStorageWithSupabase(session.user);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          syncLocalStorageWithSupabase(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Keep localStorage in sync with Supabase user
  const syncLocalStorageWithSupabase = (supabaseUser) => {
    try {
      const existingAuth = JSON.parse(localStorage.getItem('vedicmind_auth') || '{}');
      // Only update if email matches or no existing auth
      if (!existingAuth.email || existingAuth.email === supabaseUser.email) {
        const updatedAuth = {
          ...existingAuth,
          email: supabaseUser.email,
          name: existingAuth.name || supabaseUser.user_metadata?.name || supabaseUser.email.split('@')[0],
          supabaseId: supabaseUser.id,
          isNewUser: existingAuth.isNewUser !== undefined ? existingAuth.isNewUser : true,
          createdAt: existingAuth.createdAt || new Date().toISOString(),
        };
        localStorage.setItem('vedicmind_auth', JSON.stringify(updatedAuth));
      }
    } catch (e) {
      console.error('Sync error:', e);
    }
  };

  // SIGN UP — Creates Supabase account + localStorage entry
  const signUp = async ({ email, password, name, mobile, dateOfBirth }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, mobile, date_of_birth: dateOfBirth }
      }
    });

    if (error) throw error;

    // Set localStorage as the app expects (existing format preserved)
    const passwordHash = btoa(password + 'vedicmind_salt');
    localStorage.setItem('vedicmind_auth', JSON.stringify({
      email,
      name,
      mobile,
      dateOfBirth,
      passwordHash,
      supabaseId: data.user?.id,
      createdAt: new Date().toISOString(),
      isNewUser: true,
    }));

    // Save to Supabase profiles table (non-blocking)
    if (data.user) {
      supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        name,
        mobile,
        date_of_birth: dateOfBirth,
      }).then(() => {});
    }

    return data;
  };

  // SIGN IN — Authenticates via Supabase
  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      // Fallback: try localStorage auth for existing users
      const localAuth = JSON.parse(localStorage.getItem('vedicmind_auth') || '{}');
      const passwordHash = btoa(password + 'vedicmind_salt');
      if (localAuth.email === email && localAuth.passwordHash === passwordHash) {
        // Local auth success - user exists locally but not in Supabase yet
        // Try to create Supabase account for them
        try {
          const { data: signUpData } = await supabase.auth.signUp({ email, password });
          if (signUpData?.user) {
            setUser(signUpData.user);
            syncLocalStorageWithSupabase(signUpData.user);
          }
        } catch (e) {}
        return { user: { email }, localFallback: true };
      }
      throw error;
    }

    // Update localStorage to reflect successful Supabase login
    syncLocalStorageWithSupabase(data.user);
    return data;
  };

  // SIGN OUT — Clears both Supabase session and localStorage
  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('vedicmind_auth');
    localStorage.removeItem('vedicmind_profile');
    localStorage.removeItem('vedicmind_progress');
    localStorage.removeItem('vedicmind_plan');
    setUser(null);
  };

  // RESET PASSWORD — DOB-based verification using localStorage + Supabase email reset
  const resetPassword = async ({ mobile, dateOfBirth, newPassword }) => {
    // Check localStorage first
    const localAuth = JSON.parse(localStorage.getItem('vedicmind_auth') || '{}');
    if (localAuth.mobile === mobile && localAuth.dateOfBirth === dateOfBirth) {
      // Update password in localStorage
      const newHash = btoa(newPassword + 'vedicmind_salt');
      localStorage.setItem('vedicmind_auth', JSON.stringify({
        ...localAuth,
        passwordHash: newHash,
      }));
      // Also update in Supabase if user exists there
      if (localAuth.email) {
        try {
          await supabase.auth.resetPasswordForEmail(localAuth.email);
        } catch (e) {}
      }
      return true;
    }

    // Check Supabase profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('mobile', mobile)
      .eq('date_of_birth', dateOfBirth)
      .single();

    if (error || !data) throw new Error('User not found. Check mobile number and date of birth.');

    await supabase.auth.resetPasswordForEmail(data.email);
    return true;
  };

  // Get current user from localStorage (existing app pattern)
  const getLocalUser = () => {
    try {
      return JSON.parse(localStorage.getItem('vedicmind_auth') || 'null');
    } catch {
      return null;
    }
  };

  const localUser = getLocalUser();

  const value = {
    // Supabase user
    user,
    supabaseUser: user,
    loading,

    // Auth methods
    signUp,
    signIn,
    signOut,
    resetPassword,
    supabase,

    // Computed auth state — checks BOTH Supabase AND localStorage
    isAuthenticated: !!user || !!localUser,
    isNewUser: localUser?.isNewUser === true,

    // Profile from localStorage (existing app pattern unchanged)
    profile: (() => {
      try {
        return JSON.parse(localStorage.getItem('vedicmind_profile') || 'null');
      } catch { return null; }
    })(),

    // Current user name/email (from localStorage or Supabase)
    currentUser: localUser || (user ? { email: user.email, name: user.user_metadata?.name } : null),
  };

  return (
    <VedicAuthContext.Provider value={value}>
      {children}
    </VedicAuthContext.Provider>
  );
}

export const useVedicAuth = () => {
  const context = useContext(VedicAuthContext);
  if (!context) throw new Error('useVedicAuth must be used within VedicAuthProvider');
  return context;
};

export default VedicAuthContext;
