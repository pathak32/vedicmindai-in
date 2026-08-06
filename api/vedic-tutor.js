// api/vedic-tutor.js — Vercel Serverless Function
// Proxies Claude API for the homepage AI Tutor Demo widget.
// ANTHROPIC_API_KEY must be set in Vercel → Settings → Environment Variables.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { problem } = req.body || {};
  if (!problem || typeof problem !== 'string' || problem.trim().length < 3) {
    return res.status(400).json({ error: 'Please enter a valid math problem.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured.' });
  }

  const systemPrompt = `You are a Vedic Mathematics expert tutor. Given a math problem, identify the single best Vedic sutra and show the working step by step.

Respond ONLY with valid JSON — no markdown, no extra text, no backticks. Use this exact format:
{
  "sutra": "Nikhilam Navatashcaramam Dashatah",
  "sutra_meaning": "All from 9, last from 10",
  "why": "One sentence: why this sutra fits this problem",
  "steps": ["Step 1 description", "Step 2 description", "...up to 6 steps max"],
  "answer": 9312,
  "speed_note": "One short sentence on how fast this is vs traditional method"
}

Keep steps concise and clear. Use × for multiplication. Numbers only in "answer" field.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 700,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Solve using Vedic Maths: ${problem.trim()}` }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return res.status(502).json({ error: 'AI service error. Please try again.' });
    }

    const data = await response.json();
    const raw = data.content?.[0]?.text || '';

    let parsed;
    try {
      // Strip accidental markdown fences if any
      const clean = raw.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(clean);
    } catch {
      return res.status(502).json({ error: 'Could not parse AI response. Try a simpler problem.' });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('vedic-tutor error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
