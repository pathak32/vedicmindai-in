// api/vedic-tutor.js — Corrected Vercel Serverless Function
// Fix: Added proper Vedic sutra detection for addition and subtraction

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { problem } = req.body;
  if (!problem || typeof problem !== "string") {
    return res.status(400).json({ error: "Invalid problem" });
  }

  // ── Step 1: Try to classify locally ──
  const local = classifyLocally(problem.trim());
  if (local) return res.status(200).json(local);

  // ── Step 2: Fall back to AI with a comprehensive, corrected prompt ──
  const aiResponse = await callAI(problem);
  return res.status(200).json(aiResponse);
}

// ─────────────────────────────────────────────────────────────────
// Helper: find the nearest "round" base just above n
// e.g. 297 → 300, 498 → 500, 198 → 200, 9 → 10
// ─────────────────────────────────────────────────────────────────
function nearestRoundBase(n) {
  for (const magnitude of [10, 100, 1000, 10000]) {
    const rounded = Math.ceil(n / magnitude) * magnitude;
    if (rounded !== n && (rounded - n) <= magnitude * 0.15) {
      return rounded;
    }
  }
  return null;
}

function isPowerOf10(n) {
  return /^10+$/.test(String(n));
}

// ─────────────────────────────────────────────────────────────────
// Local classifier — handles addition & subtraction without AI
// ─────────────────────────────────────────────────────────────────
function classifyLocally(problem) {

  // ── SUBTRACTION ──────────────────────────────────────────────
  const subMatch = problem.match(/^(\d+)\s*[-−]\s*(\d+)$/);
  if (subMatch) {
    const a = parseInt(subMatch[1]), b = parseInt(subMatch[2]);
    const answer = a - b;

    // Nikhilam: subtracting from a power of 10 (10, 100, 1000…)
    if (isPowerOf10(a) && b < a) {
      const numDigits = String(a - 1).length;
      const bDigits = String(b).padStart(numDigits, "0").split("").map(Number);
      const result = bDigits.map((d, i) =>
        i === bDigits.length - 1 ? 10 - d : 9 - d
      );
      return {
        sutra: "Nikhilam Navatashcaramam Dashatah",
        sutra_meaning: "All from 9 and the last from 10",
        why: `${a} is a power of 10 — subtract each digit of ${b} from 9 (last digit from 10). No borrowing needed.`,
        steps: [
          `Base = ${a}`,
          ...bDigits.map((d, i) =>
            i === bDigits.length - 1
              ? `Last digit: 10 − ${d} = ${result[i]}`
              : `Digit ${d}: 9 − ${d} = ${result[i]}`
          ),
          `Answer: ${result.join("")} = ${answer}`,
        ],
        answer,
        alternate_methods: [
          { sutra: "Standard Arithmetic", note: `Direct: ${a} − ${b} = ${answer}` },
        ],
        speed_note: "Nikhilam: pure digit complement, no borrowing — 2 seconds flat.",
      };
    }

    // Puranapuranabhyam: round the subtrahend to a nearby base
    const roundedB = nearestRoundBase(b);
    if (roundedB) {
      const excess = roundedB - b;
      return {
        sutra: "Puranapuranabhyam",
        sutra_meaning: "By completion or non-completion",
        why: `${b} is close to ${roundedB} — round up, subtract the round number, then add back the difference.`,
        steps: [
          `Round ${b} → ${roundedB} (difference = ${excess})`,
          `${a} − ${roundedB} = ${a - roundedB}`,
          `Add back: ${a - roundedB} + ${excess} = ${answer}`,
        ],
        answer,
        alternate_methods: [
          { sutra: "Standard Arithmetic", note: `Column subtraction: ${a} − ${b} = ${answer}` },
        ],
        speed_note: `Rounding trick: 2 mental steps vs column borrowing.`,
      };
    }

    return null; // Let AI handle complex subtraction
  }

  // ── ADDITION ─────────────────────────────────────────────────
  const addMatch = problem.match(/^(\d+)\s*[+]\s*(\d+)$/);
  if (addMatch) {
    const a = parseInt(addMatch[1]), b = parseInt(addMatch[2]);
    const answer = a + b;

    // Puranapuranabhyam: one or both numbers are near a round base
    const roundedA = nearestRoundBase(a);
    const roundedB = nearestRoundBase(b);

    if (roundedA || roundedB) {
      const rA = roundedA || a, rB = roundedB || b;
      const excessA = rA - a, excessB = rB - b;
      const steps = [];
      if (roundedA && roundedB) {
        steps.push(`Round both: ${a} → ${rA} (−${excessA}), ${b} → ${rB} (−${excessB})`);
        steps.push(`Sum of rounded values: ${rA} + ${rB} = ${rA + rB}`);
        steps.push(`Subtract total excess: ${rA + rB} − ${excessA + excessB} = ${answer}`);
      } else if (roundedA) {
        steps.push(`Round ${a} → ${rA} (−${excessA})`);
        steps.push(`${rA} + ${b} = ${rA + b}`);
        steps.push(`Subtract excess: ${rA + b} − ${excessA} = ${answer}`);
      } else {
        steps.push(`Round ${b} → ${rB} (−${excessB})`);
        steps.push(`${a} + ${rB} = ${a + rB}`);
        steps.push(`Subtract excess: ${a + rB} − ${excessB} = ${answer}`);
      }
      return {
        sutra: "Puranapuranabhyam",
        sutra_meaning: "By completion or non-completion",
        why: `${roundedA ? a + " is close to " + rA : ""}${roundedA && roundedB ? " and " : ""}${roundedB ? b + " is close to " + rB : ""} — round up, add, subtract the excess.`,
        steps,
        answer,
        alternate_methods: [
          { sutra: "Sankalana-Vyavakalanabhyam", note: "Column addition right-to-left also applies." },
        ],
        speed_note: `${rA}+${rB}−${excessA + excessB} = ${answer} in one mental step — faster than column addition.`,
      };
    }

    // Sankalana-Vyavakalanabhyam: standard column addition
    const aStr = String(a), bStr = String(b);
    const len = Math.max(aStr.length, bStr.length);
    const aDigits = aStr.padStart(len, "0").split("").map(Number);
    const bDigits = bStr.padStart(len, "0").split("").map(Number);
    const places = ["units", "tens", "hundreds", "thousands", "ten-thousands", "hundred-thousands", "millions"];
    const steps = [`Align vertically: ${a} + ${b}`];
    let carry = 0;
    for (let i = len - 1; i >= 0; i--) {
      const sum = aDigits[i] + bDigits[i] + carry;
      carry = Math.floor(sum / 10);
      const digit = sum % 10;
      const label = places[len - 1 - i] || `place-${len - 1 - i}`;
      if (sum >= 10) {
        steps.push(`${label}: ${aDigits[i]}+${bDigits[i]}${carry > 0 ? `+carry` : ""}=${sum} → write ${digit}, carry ${Math.floor(sum / 10)}`);
      } else {
        steps.push(`${label}: ${aDigits[i]}+${bDigits[i]}=${digit}`);
      }
    }
    if (carry) steps.push(`Final carry: 1`);
    steps.push(`Answer: ${answer}`);

    return {
      sutra: "Sankalana-Vyavakalanabhyam",
      sutra_meaning: "By addition and subtraction",
      why: "This sutra governs structured column-wise addition — processing each digit place with carry-forward.",
      steps,
      answer,
      alternate_methods: [
        { sutra: "Puranapuranabhyam", note: "If numbers are near round bases, rounding is faster." },
      ],
      speed_note: "Add left-to-right for running totals — faster for mental math than right-to-left.",
    };
  }

  return null; // Let AI handle multiplication, squares, roots, etc.
}

// ─────────────────────────────────────────────────────────────────
// AI fallback — with a comprehensive system prompt
// Replace the callAI body with your actual AI provider
// ─────────────────────────────────────────────────────────────────
async function callAI(problem) {
  const systemPrompt = `You are an expert Vedic Mathematics tutor. Identify the correct Vedic sutra 
for the given arithmetic problem and explain the step-by-step solution.

IMPORTANT: Vedic Maths has sutras for ALL four operations:
- Addition → Sankalana-Vyavakalanabhyam OR Puranapuranabhyam (rounding trick)
- Subtraction → Nikhilam (from power of 10) OR Puranapuranabhyam (rounding)
- Multiplication → Nikhilam, Ekadhikena, Urdhva-Tiryagbyham, Anurupyena
- Squaring/Cubing → Ekadhikena, Yavadunam
- Division/Roots → various sutras

NEVER say "Not Applicable" for addition or subtraction.

Respond with valid JSON only:
{
  "sutra": "<Sanskrit sutra name>",
  "sutra_meaning": "<English translation>",
  "why": "<one sentence: why this sutra applies>",
  "steps": ["<step 1>", "<step 2>", ...],
  "answer": <number>,
  "alternate_methods": [{"sutra": "<name>", "note": "<brief note>"}],
  "speed_note": "<Vedic vs traditional speed comparison>"
}`;

  // ── Replace below with your actual AI provider call ──
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Solve using Vedic Maths: ${problem}` },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    }),
  });
  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}