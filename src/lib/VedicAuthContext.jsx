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
    name, mobile, countryCode, countryName, dob, email, password, referralCode,
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
    // NOTE: trial_start_date does not exist as a column on profiles (only
    // trial_end_date does) — using it here silently failed every signup's
    // profile save, leaving an auth user with no matching profile row.
    const { error: profileErr } = await supabase.from('profiles').upsert({
      id: userId,
      full_name: name,
      name: name,
      mobile,
      country_code: countryCode,
      country_name: countryName,
      dob,
      date_of_birth: dob,
      email: email || null,
      whatsapp,
      password_hint: passwordHint,
      security_question: securityQuestion,
      security_answer: securityAnswer,
      plan: 'trial',
      plan_type: 'trial',
      subscription_status: 'trial',
      trial_end_date: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id', ignoreDuplicates: false });

    // Surface the failure instead of silently swallowing it — without this,
    // the user gets a "successful" signup with no profile row, and later
    // can't sign in, recover their password, or be found by mobile number.
    if (profileErr) {
      console.error('Profile save error:', profileErr.message);
      throw new Error('Account created but profile setup failed. Please contact support — do not try signing up again with this number.');
    }

    // Attribute this signup to an affiliate, if a referral code was
    // provided. Fails silently (never blocks signup) if the code is
    console.log('DEBUG referralCode value:', JSON.stringify(referralCode));
    // invalid, mistyped, or belongs to an inactive affiliate.
    if (referralCode && referralCode.trim()) {
      const { error: referralErr } = await supabase.rpc('attribute_referral_signup', {
        p_subscriber_id: userId,
        p_referral_code: referralCode.trim(),
      });
      if (referralErr) {
        console.error('Referral attribution error (non-blocking):', referralErr.message);
      }
    }

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
  const getPasswordHint = async (mobile, countryCode = '+91') => {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .select('password_hint, security_question, name')
      .eq('mobile', `${countryCode}${mobile}`)
      .single();
    if (error || !data) throw new Error('Mobile number not registered');
    return data;
  };
  // ── Forgot Password — verify security answer ───────────────────────────────
  const verifySecurityAnswer = async (mobile, answer, countryCode = '+91') => {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .select('security_answer, password_hint')
      .eq('mobile', `${countryCode}${mobile}`)
      .single();
    if (error || !data) throw new Error('Account not found');
    if (data.security_answer !== answer.trim().toLowerCase()) {
      throw new Error('Incorrect answer');
    }
    return data.password_hint;
  };
  // ── Reset Password ─────────────────────────────────────────────────────────
  const resetPassword = async (mobile, newPassword, countryCode = '+91') => {
    const supabase = await getSupabase();
    const fakeEmail = mobileToEmail(`${countryCode}${mobile}`);
    // Sign in via admin is not possible from client — use update after re-auth
    // Instead we use password reset via email (fakeEmail)
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
    // Update hint too
    const parts = newPassword.match(/^([A-Z]{1,2})(\d{2})@(\d{4})$/);
    await supabase.from('profiles').update({ password_hint: newPassword }).eq('mobile', `${countryCode}${mobile}`);
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