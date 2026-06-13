import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabase } from './supabaseClient';
import { migrateLocalStorageToSupabase } from './supabaseDataService';

const AuthContext = createContext(null);

export function VedicAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription;
    (async () => {
      const supabase = await getSupabase();

      // Listener first — loading only becomes false here
      const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);

        // Migrate localStorage data on first login
        if (currentUser && (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED')) {
          migrateLocalStorageToSupabase(currentUser.id);
        }
      });
      subscription = data.subscription;

      // Trigger current session check
      const { data: { session } } = await supabase.auth.getSession();
      // If no session and no auth state change fired yet, set loading false
      if (!session) {
        setLoading(false);
      }
    })();

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = async (phone) => {
    const supabase = await getSupabase();
    return await supabase.auth.signInWithOtp({ phone });
  };

  const signUpWithEmail = async (email, password) => {
    const supabase = await getSupabase();
    const result = await supabase.auth.signUp({ email, password });
    if (result.data?.session) {
      setUser(result.data.session.user);
      setLoading(false);
    }
    return result;
  };

  const signIn = async (phone, email, password) => {
    const supabase = await getSupabase();
    if (email && password) {
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.data?.session) {
        setUser(result.data.session.user);
        setLoading(false);
      }
      return result;
    }
    return await supabase.auth.signInWithOtp({ phone });
  };

  const verifyOtp = async (phone, token) => {
    const supabase = await getSupabase();
    const result = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
    // Immediately update user state so DashboardPage doesn't redirect back
    if (result.data?.session?.user) {
      setUser(result.data.session.user);
      setLoading(false);
    }
    return result;
  };

  const signOut = async () => {
    const supabase = await getSupabase();
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signUpWithEmail, verifyOtp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useVedicAuth = () => useContext(AuthContext);
