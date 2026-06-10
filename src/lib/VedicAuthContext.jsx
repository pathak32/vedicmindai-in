import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const VedicAuthContext = createContext(null);

// Convert mobile to fake email for Supabase Auth
const mobileToEmail = (mobile) => `${mobile.replace(/\D/g, '')}@vedicmind.in`;

export function VedicAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        // Ensure localStorage is in sync
        ensureLocalStorageSync(session.user);
      } else {
        // Check if localStorage has valid session
        const localAuth = getLocalAuth();
        if (localAuth?.mobile) {
          // User was logged in via localStorage — restore state
          setUser({ email: mobileToEmail(localAuth.mobile), localOnly: true });
        }
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          ensureLocalStorageSync(session.user);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const getLocalAuth = () => {
    try {
      return JSON.parse(localStorage.getItem('vedicmind_auth') || 'null');
    } catch { return null; }
  };

  const ensureLocalStorageSync = (supabaseUser) => {
    try {
      const localAuth = getLocalAuth();
      if (localAuth) {
        // Already exists — just add supabaseId if missing
        if (!localAuth.supabaseId) {
          localStorage.setItem('vedicmind_auth', JSON.stringify({
            ...localAuth,
            supabaseId: supabaseUser.id,
          }));
        }
      }
    } catch (e) {}
  };

  // ─── SIGN UP ───────────────────────────────────────────────
  const signUp = async ({ mobile, password, name, email, dateOfBirth }) => {
    const fakeEmail = mobileToEmail(mobile);
    const passwordHash = btoa(password + 'vedicmind_salt');

    // 1. Create Supabase Auth user
    const { data, error } = await supabase.auth.signUp({
      email: fakeEmail,
      password,
      options: {
        data: { name, mobile, date_of_birth: dateOfBirth, real_email: email || '' }
      }
    });

    if (error) {
      // If already exists, try sign in instead
      if (error.message.includes('already registered')) {
        throw new Error('This mobile number is already registered. Please sign in.');
      }
      throw error;
    }

    // 2. Save to localStorage (existing app format — unchanged)
    localStorage.setItem('vedicmind_auth', JSON.stringify({
      mobile,
      name,
      email: email || fakeEmail,
      dateOfBirth,
      passwordHash,
      supabaseId: data.user?.id,
      createdAt: new Date().toISOString(),
      isNewUser: true,
    }));

    // 3. Save to Supabase profiles (non-blocking)
    if (data.user) {
      supabase.from('profiles').upsert({
        id: data.user.id,
        email: fakeEmail,
        real_email: email || null,
        name,
        mobile,
        date_of_birth: dateOfBirth,
      }).then(() => {});
    }

    setUser(data.user);
    return data;
  };

  // ─── SIGN IN ───────────────────────────────────────────────
  const signIn = async ({ mobile, password }) => {
    const fakeEmail = mobileToEmail(mobile);
    const passwordHash = btoa(password + 'vedicmind_salt');

    // Try Supabase first
    const { data, error } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password,
    });

    if (!error && data?.user) {
      // Supabase login success
      ensureLocalStorageSync(data.user);

      // Update localStorage mobile/name if missing
      const localAuth = getLocalAuth();
      if (!localAuth) {
        // Fetch profile from Supabase
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        localStorage.setItem('vedicmind_auth', JSON.stringify({
          mobile: profile?.mobile || mobile,
          name: profile?.name || data.user.user_metadata?.name || mobile,
          email: fakeEmail,
          dateOfBirth: profile?.date_of_birth || '',
          passwordHash,
          supabaseId: data.user.id,
          createdAt: data.user.created_at,
          isNewUser: false,
        }));
      } else {
        localStorage.setItem('vedicmind_auth', JSON.stringify({
          ...localAuth,
          isNewUser: false,
          supabaseId: data.user.id,
        }));
      }

      setUser(data.user);
      return data;
    }

    // Fallback: localStorage auth (for users not yet migrated)
    const localAuth = getLocalAuth();
    if (localAuth?.mobile === mobile && localAuth?.passwordHash === passwordHash) {
      // Local auth success — also create Supabase account for them
      try {
        const { data: signUpData } = await supabase.auth.signUp({
          email: fakeEmail,
          password,
          options: { data: { name: localAuth.name, mobile } }
        });
        if (signUpData?.user) {
          setUser(signUpData.user);
          localStorage.setItem('vedicmind_auth', JSON.stringify({
            ...localAuth,
            supabaseId: signUpData.user.id,
            isNewUser: false,
          }));
        }
      } catch (e) {}

      setUser({ email: fakeEmail, localOnly: true });
      localStorage.setItem('vedicmind_auth', JSON.stringify({
        ...localAuth,
        isNewUser: false,
      }));
      return { user: localAuth, localFallback: true };
    }

    throw new Error('Invalid mobile number or password');
  };

  // ─── SIGN OUT ──────────────────────────────────────────────
  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('vedicmind_auth');
    localStorage.removeItem('vedicmind_profile');
    localStorage.removeItem('vedicmind_progress');
    localStorage.removeItem('vedicmind_plan');
    setUser(null);
  };

  // ─── RESET PASSWORD (DOB-based) ────────────────────────────
  const resetPassword = async ({ mobile, dateOfBirth, newPassword }) => {
    const localAuth = getLocalAuth();

    // Check localStorage
    if (localAuth?.mobile === mobile && localAuth?.dateOfBirth === dateOfBirth) {
      const newHash = btoa(newPassword + 'vedicmind_salt');
      localStorage.setItem('vedicmind_auth', JSON.stringify({
        ...localAuth,
        passwordHash: newHash,
      }));

      // Also update Supabase password
      try {
        const fakeEmail = mobileToEmail(mobile);
        await supabase.auth.resetPasswordForEmail(fakeEmail);
      } catch (e) {}

      return true;
    }

    // Check Supabase profiles
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('mobile', mobile)
      .eq('date_of_birth', dateOfBirth)
      .single();

    if (error || !data) throw new Error('Mobile number ya Date of Birth sahi nahi hai.');

    await supabase.auth.resetPasswordForEmail(mobileToEmail(mobile));
    return true;
  };

  // ─── CONTEXT VALUE ─────────────────────────────────────────
  const localAuth = getLocalAuth();

  const value = {
    user,
    supabase,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isAuthenticated: !!user || !!localAuth,
    isNewUser: localAuth?.isNewUser === true,
    currentUser: localAuth,
    profile: (() => {
      try { return JSON.parse(localStorage.getItem('vedicmind_profile') || 'null'); }
      catch { return null; }
    })(),
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
