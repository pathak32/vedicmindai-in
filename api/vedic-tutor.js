// api/vedic-tutor.js — Edge Function (Vercel Edge Runtime)
export const config = { runtime: 'edge' };

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' },
    });
  }

  let problem;
  try {
    const body = await request.json();
    problem = (body.problem || '').trim();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!problem || problem.length < 3) {
    return new Response(JSON.stringify({ error: 'Please enter a valid math problem.' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured.' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  const systemPrompt = `You are a Vedic Mathematics expert tutor. Given a math problem, identify the single best Vedic sutra and show step-by-step working.
Respond ONLY with valid JSON — no markdown, no extra text, no backticks:
{"sutra":"Nikhilam Navatashcaramam Dashatah","sutra_meaning":"All from 9, last from 10","why":"One sentence why this sutra fits","steps":["Step 1","Step 2","up to 6 steps"],"answer":9312,"speed_note":"One short sentence on speed vs traditional method"}
Keep steps concise. Use x for multiplication. Numbers only in answer field.`;

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
        messages: [{ role: 'user', content: 'Solve using Vedic Maths: ' + problem }],
      }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'AI service error. Please try again.' }), {
        status: 502, headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const raw = (data.content?.[0]?.text || '').replace(/```json|```/g, '').trim();

    let parsed;
    try { parsed = JSON.parse(raw); }
    catch { return new Response(JSON.stringify({ error: 'Could not parse AI response.' }), {
      status: 502, headers: { 'Content-Type': 'application/json' },
    }); }

    return new Response(JSON.stringify(parsed), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}