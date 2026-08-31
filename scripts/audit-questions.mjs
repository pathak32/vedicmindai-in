#!/usr/bin/env node
/**
 * Question-bank audit.
 *
 * Runs as part of `npm run build`, so a question with a wrong answer key can't
 * reach students. Exits non-zero on ERRORS; WARNINGS are printed but allowed.
 *
 *   npm run audit:questions
 *
 * ERRORS (fail the build)
 *   - a question with no answer key
 *   - a key that names an option that doesn't exist, or an index out of range
 *   - two identical option strings in one question (no single right answer)
 *   - a keyed answer that disagrees with the computed arithmetic
 *
 * WARNINGS (printed only — these need a human to judge)
 *   - the same question text appearing twice
 *   - an explanation that names an option other than the keyed one
 *
 * Adding a bank: add its path and export name to BANKS below.
 */

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const BANKS = [
  ['src/data/demoQuestions.js', 'DEMO_QUESTIONS'],
  ['src/data/aptitudeQuizBank.js', 'APTITUDE_QUESTIONS'],
  ['src/data/battleQuestions.js', 'BATTLE_QUESTIONS'],
  ['src/data/mindCheckQuestions.js', 'MIND_CHECK_QUESTIONS'],
  ['src/lib/olympiadQuestionBanks.js', 'OLYMPIAD_BANKS'],
  ['src/lib/weeklyQuestionBanks.js', 'QUESTION_BANKS'],
  ['src/data/reasoningAptitudeLevel1.js', 'RA_LEVEL1_QUESTIONS'],
  ['src/data/reasoningAptitudeLevel2.js', 'RA_LEVEL2_QUESTIONS'],
];

// ── shape handling ───────────────────────────────────────────────────────────
// Banks are variously a flat array, an object of arrays, or nested groups.
// Walk whatever comes back and pull out anything that looks like a question.
function collect(node, out = []) {
  if (Array.isArray(node)) { node.forEach(n => collect(n, out)); return out; }
  if (node && typeof node === 'object') {
    if ((node.prompt || node.question || node.q) && Array.isArray(node.options)) { out.push(node); return out; }
    Object.values(node).forEach(v => collect(v, out));
  }
  return out;
}

// Options are sometimes {image, label} rather than a bare string.
const label = (o) => (o && typeof o === 'object') ? (o.label ?? o.text ?? JSON.stringify(o)) : String(o);

// Banks disagree on how the key is stored: an index (`correct`, `correctIndex`)
// or the answer text itself (`answer`).
function readKey(q, opts) {
  if (typeof q.correct === 'number') return { how: 'index', idx: q.correct, val: opts[q.correct] };
  if (typeof q.correctIndex === 'number') return { how: 'index', idx: q.correctIndex, val: opts[q.correctIndex] };
  if (q.answer !== undefined) return { how: 'text', idx: opts.indexOf(String(q.answer)), val: String(q.answer) };
  return { how: 'none', idx: -1, val: undefined };
}

// ── arithmetic ───────────────────────────────────────────────────────────────
// Reduce a prompt to a bare expression, or bail out if words remain.
function toExpression(raw) {
  return raw
    .replace(/^(what is|calculate|compute|find|solve|evaluate)\s+/i, '')
    .replace(/\([^)]*\)/g, '')              // "(use 34³ trick)", "(base 100)"
    .replace(/\busing\b.*$/i, '')            // "using Nikhilam"
    .replace(/\bwith\b\s+[A-Za-z].*$/i, '')
    .replace(/\bby\b\s+[A-Za-z].*$/i, '')
    .replace(/\s*=\s*\?\s*$/, '')
    .replace(/[=?]+\s*$/g, '')
    .trim();
}

function compute(raw) {
  let s = toExpression(raw);
  if (/[a-z]{2,}/i.test(s)) return null;    // still prose — not arithmetic

  s = s.replace(/×/g, '*').replace(/÷/g, '/').replace(/[−–—]/g, '-').replace(/,/g, '');
  s = s.replace(/(\d+)²/g, '($1**2)').replace(/(\d+)³/g, '($1**3)');
  s = s.replace(/∛\s*(\d+)/g, 'Math.cbrt($1)').replace(/√\s*(\d+)/g, 'Math.sqrt($1)');
  if (!/^[\d\s+\-*/().]|Math\./.test(s)) return null;
  if (/[^\d\s+\-*/().Mathcbrtsq]/.test(s)) return null;
  try {
    const v = Function(`"use strict";return (${s})`)();
    if (typeof v !== 'number' || !isFinite(v)) return null;
    return Math.abs(v - Math.round(v)) < 1e-9 ? Math.round(v) : v;
  } catch { return null; }
}

const computePercent = (raw) => {
  const m = raw.match(/([\d.]+)\s*%\s*of\s*([\d,]+)/i);
  return m ? (parseFloat(m[1]) / 100) * parseFloat(m[2].replace(/,/g, '')) : null;
};

// An explanation that names a different option than the key usually means the
// prose reasoned correctly and the key drifted. Advisory: explanations often
// mention wrong options legitimately ("B is not symmetric, so...").
function namesOtherOption(q, opts, keyVal) {
  const exp = String(q.exp || q.explanation || q.hint || '');
  if (!exp || keyVal === undefined) return null;
  const named = opts.filter(o => {
    const t = String(o).trim();
    if (t.length < 3) return false;                    // 'A', '5' match everywhere
    return new RegExp(`(^|[^a-z0-9])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`, 'i').test(exp);
  });
  if (named.some(o => String(o) === String(keyVal))) return null;
  return named.length === 1 ? named[0] : null;
}

// ── run ──────────────────────────────────────────────────────────────────────
const errors = [];
const warnings = [];
let total = 0;
let arithmeticChecked = 0;

for (const [file, exportName] of BANKS) {
  let mod;
  try {
    mod = await import(resolve(ROOT, file));
  } catch (e) {
    errors.push(`${file}: could not be imported — ${e.message}`);
    continue;
  }
  if (mod[exportName] === undefined) {
    errors.push(`${file}: expected export '${exportName}' not found (was it renamed?)`);
    continue;
  }

  const items = collect(mod[exportName]);
  const seen = new Map();
  total += items.length;

  items.forEach((q, i) => {
    const text = String(q.prompt || q.question || q.q);
    const opts = q.options.map(label);
    const key = readKey(q, opts);
    const at = `${file}[${i}] "${text.slice(0, 72)}"`;

    if (key.how === 'none') errors.push(`${at}\n    no answer key on this question`);
    else if (key.val === undefined) errors.push(`${at}\n    key index ${key.idx} is out of range (${opts.length} options)`);
    else if (key.idx < 0) errors.push(`${at}\n    key '${key.val}' is not one of the options: ${opts.join(' | ')}`);

    if (new Set(opts).size !== opts.length) errors.push(`${at}\n    duplicate options: ${opts.join(' | ')}`);

    const fingerprint = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seen.has(fingerprint)) warnings.push(`${at}\n    same question text as index ${seen.get(fingerprint)}`);
    else seen.set(fingerprint, i);

    const other = namesOtherOption(q, opts, key.val);
    if (other) warnings.push(`${at}\n    keyed '${key.val}' but the explanation names '${other}'`);

    // Arithmetic. "0.0101..." and friends are notation, not a number to compare.
    if (key.val !== undefined && !String(key.val).includes('...')) {
      const expected = compute(text) ?? computePercent(text);
      if (expected !== null) {
        const remainder = String(key.val).match(/^\s*(\d+)\s*rem\s*(\d+)\s*$/i);
        const division = toExpression(text).match(/^\s*(\d+)\s*[÷/]\s*(\d+)\s*$/);
        if (remainder && division) {
          arithmeticChecked++;
          const a = +division[1], b = +division[2];
          if (Math.floor(a / b) !== +remainder[1] || a % b !== +remainder[2]) {
            errors.push(`${at}\n    keyed ${key.val}, but ${a} ÷ ${b} = ${Math.floor(a / b)} rem ${a % b}`);
          }
        } else {
          const keyNum = parseFloat(String(key.val).replace(/[₹,\s]/g, ''));
          if (!isNaN(keyNum)) {
            arithmeticChecked++;
            if (Math.abs(keyNum - expected) > 1e-6) {
              errors.push(`${at}\n    keyed ${key.val}, but the expression evaluates to ${expected}\n    options: ${opts.join(' | ')}`);
            }
          }
        }
      }
    }
  });
}

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

console.log(`Question audit: ${plural(total, 'question')} across ${plural(BANKS.length, 'bank')}, ${plural(arithmeticChecked, 'arithmetic answer')} verified.`);

if (warnings.length) {
  console.log(`\n${plural(warnings.length, 'warning')} (not blocking — worth a look):`);
  warnings.forEach(w => console.log(`  • ${w}`));
}

if (errors.length) {
  console.error(`\n${plural(errors.length, 'ERROR')} — these would ship a question no student can answer correctly:`);
  errors.forEach(e => console.error(`  ✗ ${e}`));
  console.error('\nFix the questions above, or run `npm run audit:questions` to re-check.');
  process.exit(1);
}

console.log('\nNo errors. Every answer key points at a real, unique option.');
