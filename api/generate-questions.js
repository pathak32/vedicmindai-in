import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // service role bypasses RLS
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { sutra, difficulty, exam_type, count, lesson_id } = req.body;
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
- Difficulty ${difficulty}: ${difficulty<=2?'simple 2-digit numbers':difficulty<=3?'3-digit numbers':difficulty<=4?'4-digit and complex':'multi-step expert problems'}
VedicMind house convention for DIGIT SUM questions (apply this strictly if the question involves a digit sum, "casting out 9s", or digit sum verification):
- A digit sum is reduced repeatedly to a single digit (e.g. 4567 -> 4+5+6+7=22 -> 2+2=4).
- IMPORTANT: whenever the reduced digit sum would be 9, the correct answer is "0", not "9". Always offer "0" as one of the four options in that case, and never offer "9" as the correct answer for a digit-sum question.
- This 9->0 rule applies ONLY to digit-sum questions. Do not apply it to any other type of question.`;
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });
    const text = message.content[0].text;
    const clean = text.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(clean);

    // Insert into Supabase using service role (bypasses RLS)
    const rows = questions.map(q => ({
      ...q,
      sutra,
      difficulty: parseInt(difficulty),
      exam_type,
      lesson_id: lesson_id || null,
    }));
    const { error: dbError } = await supabase.from("questions").insert(rows);
    if (dbError) throw new Error(dbError.message);

    res.status(200).json({ questions });
  } catch (error) {
    console.error("Generate questions error:", error);
    res.status(500).json({ error: error.message });
  }
}