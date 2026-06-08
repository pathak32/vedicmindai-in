import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    // Allow unauthenticated calls from onboarding page (local auth)
    // but validate request has a body
    const body = await req.json();
    const { profile } = body;

    if (!profile) {
      return Response.json({ error: 'Profile is required' }, { status: 400 });
    }

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: 'You are VedicMind AI, a world-class Vedic Mathematics educationist with 20+ years experience teaching students across India.',
        messages: [
          {
            role: 'user',
            content: `Analyze this student profile and respond in EXACT JSON format only (no markdown, no backticks, no extra text):
Profile: ${JSON.stringify(profile)}
JSON format:
{
  "greeting": "Personalized 2-sentence welcome using their name and mentioning their specific board/grade/goal",
  "whyVedicMaths": "3-4 sentences explaining WHY Vedic Maths is specifically valuable for THIS person. Mention their board, class or profession, and goal.",
  "startingLevel": "Beginner or Intermediate or Advanced",
  "startingLevelReason": "One sentence explaining why they start at this level",
  "estimatedWeeks": 8,
  "dailyLessons": 2,
  "topFocusAreas": ["Fast Multiplication", "Mental Division", "Speed Calculation"],
  "firstLessonTitle": "Introduction to Vedic Maths & The 16 Sutras",
  "motivationalQuote": "A powerful relevant quote about learning, mathematics, or the mind",
  "personalizedTip": "One specific study tip tailored to their profile and goal"
}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return Response.json({ error: `Claude API error: ${err}` }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content[0].text.trim();
    const analysis = JSON.parse(text);

    return Response.json({ analysis });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});