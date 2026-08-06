// api/vedic-tutor.js — Vercel Serverless Function
// AI-powered Vedic Maths step-by-step solver for the homepage demo widget.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const problem = (req.body?.problem || '').trim();
  if (!problem || problem.length < 3) return res.status(400).json({ error: 'Please enter a valid math problem.' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured.' });

  const systemPrompt = 'You are a Vedic Mathematics expert. Respond ONLY with valid JSON, no markdown: {"sutra":"name","sutra_meaning":"meaning","why":"one sentence","steps":["step1","step2"],"answer":1234,"speed_note":"one sentence"}';

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 700, system: systemPrompt, messages: [{ role: 'user', content: 'Solve with Vedic Maths: ' + problem }] }),
    });
    if (!response.ok) return res.status(502).json({ error: 'AI service error. Try again.' });
    const data = await response.json();
    const raw = (data.content?.[0]?.text || '').replace(/```json|```/g, '').trim();
    try { return res.status(200).json(JSON.parse(raw)); }
    catch { return res.status(502).json({ error: 'Could not parse AI response.' }); }
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong. Try again.' });
  }
}