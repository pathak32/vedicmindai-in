export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const problem = (req.body?.problem || '').trim();
  if (!problem || problem.length < 3) return res.status(400).json({ error: 'Please enter a valid math problem.' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key missing', keyPresent: false });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 700,
        system: 'You are a Vedic Maths expert. Respond ONLY with valid JSON no markdown: {"sutra":"name","sutra_meaning":"meaning","why":"one sentence","steps":["step1","step2"],"answer":1234,"speed_note":"one sentence"}',
        messages: [{ role: 'user', content: 'Solve with Vedic Maths: ' + problem }] }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(502).json({ error: 'Anthropic error', status: response.status, detail: data });
    const raw = (data.content?.[0]?.text || '').replace(/\`\`\`json|\`\`\`/g, '').trim();
    try { return res.status(200).json(JSON.parse(raw)); }
    catch { return res.status(200).json({ raw }); }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}