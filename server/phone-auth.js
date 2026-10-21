// server/phone-auth.js — WhatsApp OTP login and 4-digit PIN for returning users.
// Routed by ?action=: send-otp | verify-otp | set-pin | verify-pin
//
// Not a Vercel function itself. api/personalize-onboarding.js imports the
// handler and dispatches to it when ?action= is present. Vercel's Hobby plan
// caps deployments at 12 functions, so this shares one.
//
// Login flow:
//   - First login, new device, or after too many wrong PINs: WhatsApp OTP.
//   - verify-otp and verify-pin both return a one-time token_hash. The browser
//     redeems it with supabase.auth.verifyOtp, which starts the normal session.
//   - Existing accounts only. A phone with no profile gets { newUser: true } and
//     no session, so the client sends the person to signup.
//
// Required env vars (Vercel): SUPABASE_SERVICE_ROLE_KEY, VITE_SUPABASE_URL,
// WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, and optionally
// WHATSAPP_TEMPLATE_NAME (default "auth_login"), WHATSAPP_TEMPLATE_LANG
// (default "en"), WHATSAPP_TEMPLATE_BUTTON_TYPE (NONE | COPY_CODE).

import { createClient } from '@supabase/supabase-js';
import { createHash, randomBytes, randomInt, scryptSync, timingSafeEqual } from 'crypto';

// Created on first use, not at import time. This file is loaded by
// personalize-onboarding too, so a missing env var must not crash that function.
let adminClient = null;
function db() {
  if (!adminClient) {
    adminClient = createClient(
      process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }
  return adminClient;
}

const ALLOWED_ORIGINS = ['https://www.vedicmindai.in', 'https://vedicmindai.in'];
const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_MS = 30 * 1000;
const OTP_MAX_SENDS_PER_HOUR = 3;
const PIN_MAX_FAILURES = 5;
const WA_API_VERSION = process.env.WHATSAPP_API_VERSION || 'v20.0';
const WA_TEMPLATE = process.env.WHATSAPP_TEMPLATE_NAME || 'auth_login';
const WA_LANG = process.env.WHATSAPP_TEMPLATE_LANG || 'en';
const WA_BUTTON = (process.env.WHATSAPP_TEMPLATE_BUTTON_TYPE || 'NONE').toUpperCase();

const INDIAN_MOBILE = /^[6-9]\d{9}$/;
// PINs that are too easy to guess. Four digits is already a small space.
const WEAK_PINS = new Set(['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '1234', '4321', '1212', '2580']);

// ── helpers ──────────────────────────────────────────────────────────────────

const send = (res, status, body) => res.status(status).json(body);

// Same mapping as mobileToEmail in src/lib/VedicAuthContext.jsx: "+91XXXXXXXXXX"
// becomes "91XXXXXXXXXX@vedicmindai.in". Existing accounts were created this way,
// so this must not change.
const authEmailFor = (phone) => `91${phone}@vedicmindai.in`;
const e164 = (phone) => `+91${phone}`;

// Accepts "9876543210", "+919876543210", or "919876543210". Returns the 10-digit
// number, or null if it isn't a valid Indian mobile.
function normalizePhone(raw) {
  let digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  return INDIAN_MOBILE.test(digits) ? digits : null;
}

const hashOtp = (code, phone) => createHash('sha256').update(`${phone}:${code}`).digest('hex');

function safeEqualHex(a, b) {
  const x = Buffer.from(String(a), 'utf8');
  const y = Buffer.from(String(b), 'utf8');
  return x.length === y.length && timingSafeEqual(x, y);
}

function hashPin(pin) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(pin, salt, 32).toString('hex')}`;
}

function pinMatches(pin, stored) {
  const [salt, hash] = String(stored).split(':');
  if (!salt || !hash) return false;
  return safeEqualHex(scryptSync(pin, salt, 32).toString('hex'), hash);
}

async function findProfileByPhone(phone) {
  const { data } = await db().from('profiles').select('id').eq('mobile', e164(phone)).maybeSingle();
  return data || null;
}

async function userFromBearer(req) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const { data, error } = await db().auth.getUser(token);
  return error ? null : data.user;
}

// ── WhatsApp delivery (Meta Cloud API, same provider VedicNeev uses) ─────────

async function sendWhatsAppCode(phone, code) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    return { ok: false, error: 'WhatsApp login is not configured yet.' };
  }

  const components = [{ type: 'body', parameters: [{ type: 'text', text: code }] }];
  // Only for templates created with a "Copy code" button. Meta sends authentication
  // "Copy code" buttons as URL-type buttons whose parameter is the code itself.
  // Meta's error for the other shape: "Button at index 0 must be of type Url".
  if (WA_BUTTON === 'COPY_CODE') {
    components.push({
      type: 'button',
      sub_type: 'url',
      index: '0',
      parameters: [{ type: 'text', text: code }],
    });
  }

  const response = await fetch(`https://graph.facebook.com/${WA_API_VERSION}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: e164(phone),
      type: 'template',
      template: { name: WA_TEMPLATE, language: { code: WA_LANG }, components },
    }),
  });

  if (!response.ok) {
    // Logged for Vercel's runtime logs. Never returned to the client.
    console.error('[phone-auth] WhatsApp send failed:', response.status, await response.text());
    return { ok: false, error: 'Could not send the code on WhatsApp. Please try again.' };
  }
  return { ok: true };
}

// ── actions ──────────────────────────────────────────────────────────────────

// Tells the login screen whether to ask for a PIN or send a WhatsApp code.
// Reveals whether a number has an account, which sendOtp also does.
async function status(res, phone) {
  const profile = await findProfileByPhone(phone);
  if (!profile) return send(res, 200, { success: true, exists: false, hasPin: false });
  const { data: pin } = await db().from('user_pins').select('user_id').eq('user_id', profile.id).maybeSingle();
  return send(res, 200, { success: true, exists: true, hasPin: !!pin });
}

async function sendOtp(res, phone) {
  // Never send WhatsApp messages to numbers with no account. Otherwise anyone
  // could use this endpoint to message random numbers at your cost.
  if (!(await findProfileByPhone(phone))) {
    return send(res, 404, { success: false, error: 'No account with this number. Please sign up first.' });
  }

  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { data: recent } = await db()
    .from('phone_otps')
    .select('created_at')
    .eq('phone', phone)
    .gte('created_at', since)
    .order('created_at', { ascending: false });

  if (recent?.length) {
    if (Date.now() - new Date(recent[0].created_at).getTime() < OTP_RESEND_COOLDOWN_MS) {
      return send(res, 429, { success: false, error: 'Please wait a moment before requesting another code.' });
    }
    if (recent.length >= OTP_MAX_SENDS_PER_HOUR) {
      return send(res, 429, { success: false, error: 'Too many codes requested. Please try again in an hour.' });
    }
  }

  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  const { error } = await db().from('phone_otps').insert({
    phone,
    code_hash: hashOtp(code, phone),
    expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString(),
  });
  if (error) return send(res, 500, { success: false, error: 'Could not create a code. Please try again.' });

  const sent = await sendWhatsAppCode(phone, code);
  if (!sent.ok) return send(res, 502, { success: false, error: sent.error });
  return send(res, 200, { success: true });
}

// Returns a one-time token for the browser to redeem. Only for existing accounts.
async function issueSession(res, phone, profileId) {
  const { data: link, error } = await db().auth.admin.generateLink({
    type: 'magiclink',
    email: authEmailFor(phone),
  });
  if (error || !link?.properties?.hashed_token) {
    console.error('[phone-auth] generateLink failed:', error?.message);
    return send(res, 500, { success: false, error: 'Could not sign you in. Please try again.' });
  }

  const { data: pin } = await db().from('user_pins').select('user_id').eq('user_id', profileId).maybeSingle();
  return send(res, 200, {
    success: true,
    token_hash: link.properties.hashed_token,
    hasPin: !!pin,
  });
}

async function verifyOtp(res, phone, code) {
  if (!/^\d{6}$/.test(String(code || ''))) {
    return send(res, 400, { success: false, error: 'Enter the 6-digit code.' });
  }

  const { data: pending } = await db()
    .from('phone_otps')
    .select('*')
    .eq('phone', phone)
    .is('consumed_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!pending) return send(res, 400, { success: false, error: 'No pending code for this number. Request a new one.' });
  if (new Date(pending.expires_at) < new Date()) {
    return send(res, 400, { success: false, error: 'This code has expired. Request a new one.' });
  }
  if (pending.attempts >= OTP_MAX_ATTEMPTS) {
    return send(res, 429, { success: false, error: 'Too many incorrect attempts. Request a new code.' });
  }

  if (!safeEqualHex(hashOtp(code, phone), pending.code_hash)) {
    await db().from('phone_otps').update({ attempts: pending.attempts + 1 }).eq('id', pending.id);
    return send(res, 400, { success: false, error: 'Incorrect code.' });
  }

  // Consume the code only if nobody else has. Stops two simultaneous requests
  // from both using one code.
  const { data: consumed } = await db()
    .from('phone_otps')
    .update({ consumed_at: new Date().toISOString() })
    .eq('id', pending.id)
    .is('consumed_at', null)
    .select('id');
  if (!consumed?.length) return send(res, 400, { success: false, error: 'This code was already used. Request a new one.' });

  const profile = await findProfileByPhone(phone);
  if (!profile) return send(res, 200, { success: true, newUser: true });

  // A correct OTP also clears the wrong-PIN counter, so the user can set a new PIN.
  await db().from('user_pins').update({ failed_attempts: 0 }).eq('user_id', profile.id);
  return issueSession(res, phone, profile.id);
}

async function setPin(req, res, pin) {
  const user = await userFromBearer(req);
  if (!user) return send(res, 401, { success: false, error: 'Please sign in again.' });
  if (!/^\d{4}$/.test(String(pin || ''))) return send(res, 400, { success: false, error: 'PIN must be 4 digits.' });
  if (WEAK_PINS.has(pin)) return send(res, 400, { success: false, error: 'Choose a less obvious PIN.' });

  const { error } = await db().from('user_pins').upsert({
    user_id: user.id,
    pin_hash: hashPin(pin),
    failed_attempts: 0,
    updated_at: new Date().toISOString(),
  });
  if (error) return send(res, 500, { success: false, error: 'Could not save your PIN. Please try again.' });
  return send(res, 200, { success: true });
}

async function verifyPin(res, phone, pin) {
  if (!/^\d{4}$/.test(String(pin || ''))) return send(res, 400, { success: false, error: 'Enter your 4-digit PIN.' });

  const profile = await findProfileByPhone(phone);
  const genericError = { success: false, error: 'Incorrect number or PIN.' };
  if (!profile) return send(res, 401, genericError);

  const { data: row } = await db()
    .from('user_pins')
    .select('pin_hash, failed_attempts')
    .eq('user_id', profile.id)
    .maybeSingle();
  if (!row) return send(res, 404, { success: false, error: 'No PIN set yet. Log in with WhatsApp.', needsOtp: true });

  if (row.failed_attempts >= PIN_MAX_FAILURES) {
    return send(res, 423, { success: false, error: 'Too many wrong PINs. Log in with WhatsApp to continue.', needsOtp: true });
  }

  if (!pinMatches(pin, row.pin_hash)) {
    const failed = row.failed_attempts + 1;
    await db().from('user_pins').update({ failed_attempts: failed }).eq('user_id', profile.id);
    const left = PIN_MAX_FAILURES - failed;
    if (left <= 0) {
      return send(res, 423, { success: false, error: 'Too many wrong PINs. Log in with WhatsApp to continue.', needsOtp: true });
    }
    return send(res, 401, { ...genericError, error: `Incorrect PIN. ${left} attempt${left === 1 ? '' : 's'} left.` });
  }

  await db().from('user_pins').update({ failed_attempts: 0 }).eq('user_id', profile.id);
  return issueSession(res, phone, profile.id);
}

// Signup duplicate check. Accepts the full number with country code, so it works
// for non-Indian numbers too. Returns only exists: true/false.
async function mobileExists(res, raw) {
  const m = String(raw || '').trim();
  if (!/^\+?\d{8,15}$/.test(m)) return send(res, 400, { success: false, error: 'Invalid mobile number.' });
  const { data } = await db().from('profiles').select('id').eq('mobile', m).maybeSingle();
  return send(res, 200, { success: true, exists: !!data });
}

// Returns the security question and display name for the forgot-password screen.
// Only these two fields are sent, never the answer.
async function securityQuestion(res, phone) {
  const { data } = await db()
    .from('profiles')
    .select('name, security_question')
    .eq('mobile', e164(phone))
    .maybeSingle();
  if (!data) return send(res, 404, { success: false, error: 'Mobile number not registered' });
  return send(res, 200, { success: true, name: data.name || null, security_question: data.security_question || null });
}

// Checks a forgot-password security answer on the server. The stored answer is
// never sent to the browser. Answers are compared case-insensitively.
async function verifySecurityAnswer(res, phone, answer) {
  if (!answer || !String(answer).trim()) return send(res, 400, { success: false, error: 'Please enter your answer.' });

  const profile = await findProfileByPhone(phone);
  if (!profile) return send(res, 404, { success: false, error: 'Account not found.' });

  const { data } = await db().from('profiles').select('security_answer').eq('id', profile.id).maybeSingle();
  const stored = (data?.security_answer || '').trim().toLowerCase();
  if (!stored || stored !== String(answer).trim().toLowerCase()) {
    return send(res, 401, { success: false, error: 'Incorrect answer' });
  }
  return send(res, 200, { success: true });
}

// ── parental consent (accounts for users under 18) ───────────────────────────

// Sends a consent code to the parent's number. Same cooldown and hourly cap as
// login codes, but it does not need an account for that number.
async function sendParentCode(res, parentPhone) {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { data: recent } = await db()
    .from('phone_otps')
    .select('created_at')
    .eq('phone', parentPhone)
    .gte('created_at', since)
    .order('created_at', { ascending: false });
  if (recent?.length) {
    if (Date.now() - new Date(recent[0].created_at).getTime() < OTP_RESEND_COOLDOWN_MS) {
      return send(res, 429, { success: false, error: 'Please wait a moment before requesting another code.' });
    }
    if (recent.length >= OTP_MAX_SENDS_PER_HOUR) {
      return send(res, 429, { success: false, error: 'Too many codes requested. Please try again in an hour.' });
    }
  }
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  const { error } = await db().from('phone_otps').insert({
    phone: parentPhone,
    code_hash: hashOtp(code, parentPhone),
    expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString(),
  });
  if (error) return send(res, 500, { success: false, error: 'Could not create a code. Please try again.' });
  const sent = await sendWhatsAppCode(parentPhone, code);
  if (!sent.ok) return send(res, 502, { success: false, error: sent.error });
  return send(res, 200, { success: true });
}

async function consentSend(req, res) {
  const user = await userFromBearer(req);
  if (!user) return send(res, 401, { success: false, error: 'Please sign in again.' });
  const { data: profile } = await db()
    .from('profiles')
    .select('parent_mobile, consent_required, parental_consent_at')
    .eq('id', user.id)
    .maybeSingle();
  if (profile?.parental_consent_at) {
    return send(res, 200, { success: true, notRequired: true });
  }
  const parent = normalizePhone(profile.parent_mobile);
  if (!parent) return send(res, 400, { success: false, error: 'No parent mobile number is saved on this account.' });
  return sendParentCode(res, parent);
}

async function consentVerify(req, res, code) {
  const user = await userFromBearer(req);
  if (!user) return send(res, 401, { success: false, error: 'Please sign in again.' });
  if (!/^\d{6}$/.test(String(code || ''))) return send(res, 400, { success: false, error: 'Enter the 6-digit code.' });

  const { data: profile } = await db()
    .from('profiles')
    .select('parent_mobile, consent_required, parental_consent_at')
    .eq('id', user.id)
    .maybeSingle();
  if (profile?.parental_consent_at) {
    return send(res, 200, { success: true, notRequired: true });
  }
  const parent = normalizePhone(profile.parent_mobile);
  if (!parent) return send(res, 400, { success: false, error: 'No parent mobile number is saved on this account.' });

  const { data: pending } = await db()
    .from('phone_otps')
    .select('*')
    .eq('phone', parent)
    .is('consumed_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!pending) return send(res, 400, { success: false, error: 'No pending code. Request a new one.' });
  if (new Date(pending.expires_at) < new Date()) return send(res, 400, { success: false, error: 'This code has expired. Request a new one.' });
  if (pending.attempts >= OTP_MAX_ATTEMPTS) return send(res, 429, { success: false, error: 'Too many incorrect attempts. Request a new code.' });

  if (!safeEqualHex(hashOtp(code, parent), pending.code_hash)) {
    await db().from('phone_otps').update({ attempts: pending.attempts + 1 }).eq('id', pending.id);
    return send(res, 400, { success: false, error: 'Incorrect code.' });
  }

  const { data: consumed } = await db()
    .from('phone_otps')
    .update({ consumed_at: new Date().toISOString() })
    .eq('id', pending.id)
    .is('consumed_at', null)
    .select('id');
  if (!consumed?.length) return send(res, 400, { success: false, error: 'This code was already used. Request a new one.' });

  const { error } = await db()
    .from('profiles')
    .update({ parental_consent_at: new Date().toISOString() })
    .eq('id', user.id);
  if (error) return send(res, 500, { success: false, error: 'Could not record consent. Please try again.' });
  return send(res, 200, { success: true });
}

// ── entry point ──────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return send(res, 405, { success: false, error: 'Method not allowed' });

  const action = req.query.action;
  const body = req.body || {};

  try {
    if (action === 'set-pin') return await setPin(req, res, body.pin);
    if (action === 'mobile-exists') return await mobileExists(res, body.mobile);

    if (action === 'consent-send') {
      // Optional: the parent's number can be saved here for accounts that don't have one yet.
      if (body.parentMobile !== undefined) {
        const user = await userFromBearer(req);
        if (!user) return send(res, 401, { success: false, error: 'Please sign in again.' });
        const parent = normalizePhone(body.parentMobile);
        if (!parent) return send(res, 400, { success: false, error: 'Enter a valid 10-digit parent or guardian mobile number.' });
        const { error } = await db().from('profiles').update({ parent_mobile: parent }).eq('id', user.id);
        if (error) return send(res, 500, { success: false, error: 'Could not save the parent number. Please try again.' });
      }
      return await consentSend(req, res);
    }
    if (action === 'consent-verify') return await consentVerify(req, res, body.code);

    const phone = normalizePhone(body.phone);
    if (!phone) return send(res, 400, { success: false, error: 'Enter a valid 10-digit Indian mobile number.' });

    if (action === 'status') return await status(res, phone);
    if (action === 'verify-security') return await verifySecurityAnswer(res, phone, body.answer);
    if (action === 'security-question') return await securityQuestion(res, phone);
    if (action === 'send-otp') return await sendOtp(res, phone);
    if (action === 'verify-otp') return await verifyOtp(res, phone, body.code);
    if (action === 'verify-pin') return await verifyPin(res, phone, body.pin);

    return send(res, 400, { success: false, error: 'Unknown action.' });
  } catch (err) {
    console.error('[phone-auth]', action, err);
    return send(res, 500, { success: false, error: 'Something went wrong. Please try again.' });
  }
}
