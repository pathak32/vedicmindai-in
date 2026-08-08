export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const problem = (req.body?.problem || '').trim();
  if (!problem || problem.length < 3) return res.status(400).json({ error: 'Please enter a valid math problem.' });

  const MATH_ONLY = /^[\dxX+\-×÷*/^%√().\s]+$/;
  if (!MATH_ONLY.test(problem)) {
    return res.status(400).json({ error: 'Please enter only numbers and math symbols (+ - × ÷ ^ %).' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key missing', keyPresent: false });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 700,
        system: 'You are a Vedic Maths expert. TOPIC-TO-SUTRA RULES (use exactly, never guess or mismatch): Multiplication where both numbers have the SAME tens digit AND units digits sum to 10 -> Ekadhikena Purvena (this special case takes priority over Nikhilam/Urdhva below). Multiplication, both numbers close to the SAME power-of-10 base (10/100/1000) -> Nikhilam Sutra (the base must be exactly 10, 100, or 1000 -- never invent a different base like 50 or 70). Multiplication, no shared base and no special case above applies -> Urdhva Tiryagbhyam (no base/deviation involved) -- this is the safe DEFAULT when nothing else fits. Squaring a number ending in 5 -> Ekadhikena Purvena. Squaring, number close to a power-of-10 base -> Yavadunam. Cubing a 2-digit number -> Anurupyena. x5/x25/x125 shortcuts -> Ekadhikena Purvena (halving-doubling variant). Division, 2-digit divisor 11-19 -> Paravartya Yojayet. Division, 2-digit divisor 21-99 -> Dhvajanka (Straight Division). Square root of a perfect square -> Vilokanam. Cube root of a perfect cube -> Vilokanam (cube variant). GENERAL RULES: (1) Pick the sutra that actually matches your steps, never mismatch. (2) NEVER invent a base -- Nikhilam only works with base 10, 100, or 1000, nothing else; if the numbers do not sit near one of those, do not use Nikhilam. (3) Never state two different/contradictory bases for the same problem. (4) Verify your own arithmetic before answering, the final answer must be exactly correct. (5) If the problem can also be solved by another valid sutra, mention it in alternate_methods. Respond ONLY with valid JSON no markdown: {"sutra":"name","sutra_meaning":"meaning","why":"one sentence","steps":["step1","step2"],"answer":1234,"alternate_methods":[{"sutra":"name","note":"one sentence"}],"speed_note":"one sentence"}',
        messages: [{ role: 'user', content: 'Solve with Vedic Maths: ' + problem }] }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(502).json({ error: 'Anthropic error', status: response.status, detail: data });
    const raw = (data.content?.[0]?.text || '').replace(/```json|```/g, '').trim();
    try { return res.status(200).json(JSON.parse(raw)); }
    catch { return res.status(200).json({ raw }); }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
