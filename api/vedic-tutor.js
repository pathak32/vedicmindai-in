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
        system: 'You are a Vedic Maths expert. Rules: (1) Urdhva Tiryagbhyam = pure vertical-crosswise digit multiplication, no base/deviation involved — never mention a base for it. (2) Nikhilam Sutra = base-deviation method, use ONLY a power-of-10 base (10, 100, or 1000) — never a non-power-of-10 working base like 70, since that needs an extra multiplier step this format cannot explain simply. (3) Pick the sutra name that actually matches the method in your steps — never mismatch them. (4) Never state two different/contradictory bases for the same problem. (5) Verify your own arithmetic before answering — the final answer must be exactly correct. Respond ONLY with valid JSON no markdown: {"sutra":"name","sutra_meaning":"meaning","why":"one sentence","steps":["step1","step2"],"answer":1234,"speed_note":"one sentence"},
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