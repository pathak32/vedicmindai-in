import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { sutra, difficulty, exam_type, count } = req.body;
  if (!sutra || !difficulty || !exam_type || !count) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `Generate ${count} multiple-choice Vedic Mathematics questions for the sutra "${sutra}".
Difficulty level: ${difficulty}/5 (${difficulty<=2?'Easy':difficulty<=3?'Medium':difficulty<=4?'Hard':'Expert'}).
Exam type: ${exam_type.toUpperCase()}.

Return ONLY a valid JSON array, no markdown, no explanation. Format:
[{"question_text":"...","option_a":"...","option_b":"...","option_c":"...","option_d":"...","correct_answer":"a","explanation":"..."}]

Rules:
- Questions must involve actual numbers and calculations using the ${sutra} sutra method
- Each question must have exactly 4 options (a,b,c,d)
- correct_answer must be exactly one of: "a","b","c", or "d"
- Explanation must show the Vedic method step by step
- Difficulty ${difficulty}: ${difficulty<=2?'simple 2-digit numbers':difficulty<=3?'3-digit numbers':difficulty<=4?'4-digit and complex':'multi-step expert problems'}`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].text;
    const clean = text.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(clean);

    res.status(200).json({ questions });
  } catch (error) {
    console.error("Generate questions error:", error);
    res.status(500).json({ error: error.message });
  }
}
