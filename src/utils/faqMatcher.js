// Checks a student's free-text question against faqData.js BEFORE calling
// the AI Tutor. If a good match is found, the calling component should show
// the FAQ answer directly and skip the API call entirely.

import { faqData } from "../data/faqData";

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreMatch(studentText, keywords) {
  const studentWords = new Set(normalize(studentText).split(" "));
  let bestScore = 0;

  for (const phrase of keywords) {
    const phraseWords = normalize(phrase).split(" ").filter(Boolean);
    if (phraseWords.length === 0) continue;

    const matchedWords = phraseWords.filter((w) => studentWords.has(w));
    const fraction = matchedWords.length / phraseWords.length;

    const meaningfulMatch =
      matchedWords.length >= 2 || (phraseWords.length === 1 && fraction === 1);

    if (meaningfulMatch && fraction > bestScore) {
      bestScore = fraction;
    }
  }

  return bestScore;
}

export function findFaqMatch(studentQuestion, threshold = 0.6) {
  if (!studentQuestion || studentQuestion.trim().length === 0) return null;

  let best = null;

  for (const entry of faqData) {
    const score = scoreMatch(studentQuestion, entry.keywords);
    if (score >= threshold && (!best || score > best.score)) {
      best = { entry, score };
    }
  }

  return best;
}

export function hasFaqMatch(studentQuestion, threshold = 0.6) {
  return findFaqMatch(studentQuestion, threshold) !== null;
}
