import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabase } from './supabaseClient';

const VedicAuthContext = createContext(null);
export const useVedicAuth = () => useContext(VedicAuthContext);

// ─── Helpers ─────────────────────────────────────────────────────────────────
// We use mobile as the Supabase email field: +919839320911 → "919839320911@vedicmindai.in"
const mobileToEmail = (mobile) => {
  const digits = mobile.replace(/\D/g, '');
  return `${digits}@vedicmindai.in`;
};

// ─── Provider ────────────────────────────────────────────────────────────────
export function VedicAuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sub;
    (async () => {
      const supabase = await getSupabase();
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) await loadProfile(session.user.id);
      setLoading(false);

      // Listen for auth changes
      const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) await loadProfile(session.user.id);
        else setProfile(null);
      });
      sub = data.subscription;
    })();
    return () => sub?.unsubscribe();
  }, []);

  const loadProfile = async (userId) => {
    try {
      const supabase = await getSupabase();
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      setProfile(data);
    } catch (_) {}
  };

  // ── Sign Up ────────────────────────────────────────────────────────────────
  const signUpWithPassword = async ({
    name, mobile, dob, email, password,
    securityQuestion, securityAnswer,
    whatsapp, passwordHint,
  }) => {
    const supabase = await getSupabase();
    const fakeEmail = mobileToEmail(mobile);

    // 1. Create Supabase auth user (no email confirmation needed)
    const { data, error } = await supabase.auth.signUp({
      email: fakeEmail,
      password,
      options: {
        emailRedirectTo: undefined,
        data: { name, mobile },
      }
    });
    if (error) throw new Error(error.message);

    // If user already exists, try signing in instead
    let userId = data.user?.id;
    
    if (!userId) {
      // Try sign in (user might already exist)
      const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
        email: fakeEmail, password
      });
      if (signInErr) throw new Error('Account creation failed. Try signing in.');
      userId = signInData.user?.id;
    }
    
    if (!userId) throw new Error('User creation failed');

    // 2. Save profile to profiles table
    const { error: profileErr } = await supabase.from('profiles').upsert({
      id: userId,
      full_name: name,
      name: name,
      mobile,
      dob,
      email: email || null,
      whatsapp,
      password_hint: passwordHint,
      security_question: securityQuestion,
      security_answer: securityAnswer,
      plan: 'trial',
      subscription_status: 'trial',
      trial_start_date: new Date().toISOString(),
      trial_end_date: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
      created_at: new Date().toISOString(),
    }, { onConflict: 'id', ignoreDuplicates: false });
    if (profileErr) console.error('Profile save error:', profileErr.message);

    return data;
  };

  // ── Sign In ────────────────────────────────────────────────────────────────
  const signInWithPassword = async ({ mobile, password }) => {
    const supabase = await getSupabase();
    const fakeEmail = mobileToEmail(mobile);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password,
    });
    if (error) {
      if (error.message.includes('Invalid login') || error.message.includes('invalid_credentials')) {
        throw new Error('Mobile number or password is incorrect. Please check and try again.');
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Account not verified. Please sign up again.');
      }
      throw new Error(error.message);
    }
    return data;
  };

  // ── Sign Out ───────────────────────────────────────────────────────────────
  const signOut = async () => {
    const supabase = await getSupabase();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // ── Forgot Password — get hint ─────────────────────────────────────────────
  const getPasswordHint = async (mobile) => {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .select('password_hint, security_question, name')
      .eq('mobile', `+91${mobile}`)
      .single();
    if (error || !data) throw new Error('Mobile number not registered');
    return data;
  };

  // ── Forgot Password — verify security answer ───────────────────────────────
  const verifySecurityAnswer = async (mobile, answer) => {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .select('security_answer, password_hint')
      .eq('mobile', `+91${mobile}`)
      .single();
    if (error || !data) throw new Error('Account not found');
    if (data.security_answer !== answer.trim().toLowerCase()) {
      throw new Error('Incorrect answer');
    }
    return data.password_hint;
  };

  // ── Reset Password ─────────────────────────────────────────────────────────
  const resetPassword = async (mobile, newPassword) => {
    const supabase = await getSupabase();
    const fakeEmail = mobileToEmail(`+91${mobile}`);
    // Sign in via admin is not possible from client — use update after re-auth
    // Instead we use password reset via email (fakeEmail)
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
    // Update hint too
    const parts = newPassword.match(/^([A-Z]{1,2})(\d{2})@(\d{4})$/);
    await supabase.from('profiles').update({ password_hint: newPassword }).eq('mobile', `+91${mobile}`);
  };

  return (
    <VedicAuthContext.Provider value={{
      user, profile, loading,
      signUpWithPassword,
      signInWithPassword,
      signOut,
      getPasswordHint,
      verifySecurityAnswer,
      resetPassword,
    }}>
      {children}
    </VedicAuthContext.Provider>
  );
}
