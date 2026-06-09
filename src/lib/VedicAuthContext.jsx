import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const VedicAuthContext = createContext(null);

export function VedicAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setProfile(data);
  };

  const signUp = async ({ email, password, name, mobile, dateOfBirth }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, mobile, date_of_birth: dateOfBirth }
      }
    });
    if (error) throw error;

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        name,
        mobile,
        date_of_birth: dateOfBirth
      });
    }
    return data;
  };

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    if (!error) {
      setProfile(prev => ({ ...prev, ...updates }));
    }
  };

  const resetPassword = async ({ mobile, dateOfBirth, newPassword }) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('mobile', mobile)
      .eq('date_of_birth', dateOfBirth)
      .single();

    if (error || !data) throw new Error('User not found. Check mobile number and date of birth.');

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email);
    if (resetError) throw resetError;
    return true;
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    supabase,
    isAuthenticated: !!user,
    isNewUser: profile && !profile.role
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
