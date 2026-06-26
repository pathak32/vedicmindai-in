// Vercel Serverless Function — AI Tutor proxy
// Prevents CORS issue when calling Anthropic API from browser.
// NOW INCLUDES: server-side daily rate limiting backed by Supabase.
// This is the ONLY source of truth for AI Tutor limits going forward --
// src/lib/planEngine.js's getAITutorLimit() and src/lib/aiLimits.js are
// retired; do not use them for enforcement (UI display only, if at all).

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Daily limits by plan. Update here ONLY -- single source of truth.
const DAILY_LIMITS = {
  free: 1,
  basic: 5,
  pro: 20,
  family: 20,
  demo: 20,
  admin: 9999,
};

function getLimitForPlan(plan) {
  return DAILY_LIMITS[(plan || 'free').toLowerCase()] ?? 1;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, system, userId, plan } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const limit = getLimitForPlan(plan);

    const { data: usageResult, error: usageError } = await supabase
      .rpc('increment_ai_tutor_usage', { p_user_id: userId, p_limit: limit })
      .single();

    if (usageError) {
      console.error('Supabase usage RPC error:', usageError);
      return res.status(500).json({ error: 'Failed to check usage' });
    }

    if (!usageResult.was_allowed) {
      return res.status(429).json({
        error: 'DAILY_LIMIT_REACHED',
        limit,
        used: usageResult.new_count,
        message: `You've used all ${limit} AI Tutor question${limit === 1 ? '' : 's'} for today. Come back tomorrow, or upgrade for more.`,
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({
      ...data,
      _usage: { used: usageResult.new_count, limit, remaining: Math.max(0, limit - usageResult.new_count) },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
