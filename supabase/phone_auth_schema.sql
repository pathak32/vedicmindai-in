-- WhatsApp OTP login + 4-digit PIN for returning users.
-- Run once in Supabase Dashboard → SQL Editor.
-- Both tables are written only by the server (api/phone-auth.js) using the
-- service-role key. RLS is enabled with no policies, so the browser (anon key)
-- can never read or write them.

-- One row per issued WhatsApp code. Only a salted hash of the code is stored.
create table if not exists phone_otps (
  id uuid primary key default gen_random_uuid(),
  phone text not null,              -- 10-digit Indian mobile, no country code
  code_hash text not null,          -- sha256("<phone>:<code>")
  expires_at timestamptz not null,
  attempts int not null default 0,  -- wrong guesses against this code
  consumed_at timestamptz,          -- set once the code is used
  created_at timestamptz not null default now()
);
create index if not exists phone_otps_phone_created_idx on phone_otps (phone, created_at desc);

-- One PIN per user. Stores an scrypt hash ("salt:hash"), never the PIN itself.
create table if not exists user_pins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  pin_hash text not null,
  failed_attempts int not null default 0,  -- wrong PINs since last success or OTP
  updated_at timestamptz not null default now()
);

alter table phone_otps enable row level security;
alter table user_pins enable row level security;
