import { getSupabase } from './supabaseClient';

// Browser side of server/phone-auth.js, served through api/personalize-onboarding.js.
// Every call resolves to { ok, error?, needsOtp?, newUser?, hasPin? } and never throws.

async function post(action, body, { token } = {}) {
  let res;
  let data = {};
  try {
    res = await fetch(`/api/personalize-onboarding?action=${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    data = await res.json().catch(() => ({}));
  } catch {
    return { ok: false, error: 'Network error. Please check your connection.' };
  }
  return {
    ok: res.ok && data.success === true,
    error: data.error,
    needsOtp: !!data.needsOtp,
    newUser: !!data.newUser,
    hasPin: !!data.hasPin,
    exists: !!data.exists,
    tokenHash: data.token_hash,
    name: data.name || null,
    securityQuestion: data.security_question || null,
  };
}

// Signup pre-check: is this full mobile number (with country code) already registered?
export async function checkMobileRegistered(mobile) {
  const r = await post('mobile-exists', { mobile });
  return r.ok ? { ok: true, exists: r.exists } : { ok: false, error: r.error };
}

// Forgot-password step 1: the question and name only. The answer is never returned.
export async function getSecurityQuestion(phone) {
  const r = await post('security-question', { phone });
  return r.ok ? { ok: true, name: r.name, securityQuestion: r.securityQuestion } : { ok: false, error: r.error };
}

// Forgot-password check. The server compares the answer; the stored answer is never returned.
export async function checkSecurityAnswer(phone, answer) {
  const r = await post('verify-security', { phone, answer });
  return r.ok ? { ok: true } : { ok: false, error: r.error || 'Incorrect answer' };
}

// First step of the login screen: decides between PIN entry and a WhatsApp code.
export function checkLoginPhone(phone) {
  return post('status', { phone });
}

// Redeems the one-time token from the server and starts the normal Supabase session.
export async function redeemLoginSession(tokenHash) {
  const supabase = await getSupabase();
  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'magiclink' });
  if (error) return { ok: false, error: 'Could not sign you in. Please try again.' };
  return { ok: true };
}

async function startSession(result) {
  if (!result.ok || result.newUser) return result;
  const session = await redeemLoginSession(result.tokenHash);
  if (!session.ok) return session;
  return { ok: true, hasPin: result.hasPin };
}

export function sendLoginOtp(phone) {
  return post('send-otp', { phone });
}

// Verifies the code but does NOT start the session yet. The caller decides when to
// redeem it, so the PIN setup step can be shown before the auth page redirects.
export function verifyLoginOtp(phone, code) {
  return post('verify-otp', { phone, code });
}

export async function verifyLoginPin(phone, pin) {
  return startSession(await post('verify-pin', { phone, pin }));
}

// Call right after a successful login, when the user has no PIN yet or chose to reset it.
export async function setLoginPin(pin) {
  const supabase = await getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return { ok: false, error: 'Please sign in again.' };
  return post('set-pin', { pin }, { token: session.access_token });
}

// Parental consent for accounts of users under 18. The code goes to the parent's
// number saved at signup. The request must come from the signed-in child's account.
export async function sendParentConsentCode() {
  const supabase = await getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return { ok: false, error: 'Please sign in again.' };
  return post('consent-send', {}, { token: session.access_token });
}

export async function verifyParentConsentCode(code) {
  const supabase = await getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return { ok: false, error: 'Please sign in again.' };
  return post('consent-verify', { code }, { token: session.access_token });
}
