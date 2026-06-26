// Vercel Serverless Function — Onboarding Personalization proxy
// Mirrors api/ai-tutor.js exactly: keeps ANTHROPIC_API_KEY server-side only.
// Replaces the OLD insecure direct-from-browser fetch() in src/pages/OnboardingPage.jsx
// that exposed the key via VITE_ANTHROPIC_API_KEY (bundled into public JS by Vite).

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { data, authName } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Missing data in request body' });
    }

    const name = data.name || authName;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system:
          'You are VedicMind AI, a world-class Vedic Mathematics educationist with 20+ years experience teaching students across India. You help personalize learning journeys for students.',
        messages: [
          {
            role: 'user',
            content: `Analyze this student profile and respond with ONLY a raw JSON object.
No markdown, no code blocks, no backticks, no explanation before or after.
Start your response with { and end with }.

Student Profile:
- Name: ${name}
- Role: ${data.role}
- Grade: ${data.grade || 'N/A'}
- Board: ${data.board || 'N/A'}
- Age: ${data.age}
- Goals: ${(data.goals || []).join(', ')}
- Time commitment: ${data.timeCommitment}
- Learning style: ${data.learningStyle}
- Biggest challenge: ${data.biggestChallenge}

Respond with exactly this JSON structure:
{"greeting":"2 sentences welcoming ${name} by name, referencing their ${data.grade || 'learning'} goals","whyVedicMaths":"3-4 sentences specific to their profile","startingLevel":"Beginner","startingLevelReason":"1 sentence","estimatedWeeks":8,"dailyLessons":2,"topFocusAreas":["area1","area2","area3"],"firstLessonTitle":"Introduction to Vedic Mathematics","motivationalQuote":"inspiring quote","personalizedTip":"one specific tip for their exact profile"}`,
          },
        ],
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: responseData });
    }

    return res.status(200).json(responseData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
