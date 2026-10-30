// Builds printable review documents (concept, questions and answers) for the three sections,
// each in English and Hindi, as HTML, then prints them to PDF with headless Edge.
//   node scripts/build-review-pdfs.mjs
// Output: docs/review/*.pdf  (HTML copies are written next to them and kept out of git)
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, statSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const OUT = resolve('docs/review');
mkdirSync(OUT, { recursive: true });
const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
if (!EDGE) throw new Error('Edge not found');

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent', optimizeDeps: { noDiscovery: true } });
const load = (p) => server.ssrLoadModule(p);

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const gaps = {}; // per-document list of Hindi fields that fell back to English

// ── text helpers ───────────────────────────────────────────────────────────
function pick(v, lang, where, doc) {
  if (v == null) return '';
  if (typeof v === 'string') {
    if (lang === 'hi' && /[A-Za-z]{3,}/.test(v) && !/[\u0900-\u097F]/.test(v)) (gaps[doc] ??= []).push(where);
    return v;
  }
  if (lang === 'hi' && !v.hi) (gaps[doc] ??= []).push(where);
  return v[lang] ?? v.en ?? '';
}

const LABELS = {
  en: { origin: 'Origin', steps: 'Steps', why: 'Why it works', example: 'Worked example', mistake: 'Common mistake', real: 'Real-world use', concept: 'Concept', practice: 'Practice questions', quiz: 'Quiz questions', questions: 'Questions', answers: 'Answers and explanations', remarks: 'Reviewer remarks', correct: 'Correct', difficulty: { easy: 'Easy', medium: 'Medium', hard: 'Hard' }, level: 'Level', sign: 'Reviewer sign-off', name: 'Name', date: 'Date', signature: 'Signature', verdict: 'Content verdict', ok: 'Correct as written', changes: 'Needs changes', ch: 'Chapter', lesson: 'Lesson', contents: 'Contents' },
  hi: { origin: 'उत्पत्ति', steps: 'चरण', why: 'यह क्यों काम करता है', example: 'हल किया हुआ उदाहरण', mistake: 'आम गलती', real: 'वास्तविक जीवन में उपयोग', concept: 'अवधारणा', practice: 'अभ्यास प्रश्न', quiz: 'क्विज़ प्रश्न', questions: 'प्रश्न', answers: 'उत्तर और व्याख्या', remarks: 'समीक्षक की टिप्पणी', correct: 'सही उत्तर', difficulty: { easy: 'आसान', medium: 'मध्यम', hard: 'कठिन' }, level: 'स्तर', sign: 'समीक्षक के हस्ताक्षर', name: 'नाम', date: 'दिनांक', signature: 'हस्ताक्षर', verdict: 'सामग्री का निर्णय', ok: 'जैसा लिखा है वैसा सही है', changes: 'बदलाव चाहिए', ch: 'अध्याय', lesson: 'पाठ', contents: 'विषय-सूची' },
};

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

// ── question renderers ─────────────────────────────────────────────────────
function normVedic(q, lang, where, doc) {
  return {
    prompt: pick(q.q ?? q.prompt, lang, where + ' question', doc),
    options: (q.options || []).map((o) => pick(o, lang, where + ' option', doc)),
    answer: q.correct,
    exp: pick(q.exp, lang, where + ' explanation', doc),
    difficulty: q.difficulty,
  };
}

function questionsHtml(items, lang) {
  const L = LABELS[lang];
  const qs = items.map((q, i) => `<li><div class="qt">${esc(q.prompt)}${q.difficulty ? ` <span class="tag ${q.difficulty}">${esc(L.difficulty[q.difficulty])}</span>` : ''}</div>${
    q.options.length ? `<ol class="opts">${q.options.map((o, k) => `<li><b>${LETTERS[k]}.</b> ${esc(o)}</li>`).join('')}</ol>` : ''}</li>`).join('');
  const as = items.map((q, i) => `<li><b>${L.correct}: ${LETTERS[q.answer] ?? '?'}</b>${q.options[q.answer] != null ? ` — ${esc(q.options[q.answer])}` : ''}${q.exp ? `<div class="ex">${esc(q.exp)}</div>` : ''}</li>`).join('');
  return `<ol class="qs">${qs}</ol><h4>${L.answers}</h4><ol class="as">${as}</ol>`;
}

function remarksBox(lang) {
  const L = LABELS[lang];
  return `<div class="remarks"><b>${L.remarks}</b><div class="lines"></div><div class="verdict">☐ ${L.ok} &nbsp;&nbsp; ☐ ${L.changes}</div></div>`;
}

// ── concept renderer for Reasoning / Aptitude ──────────────────────────────
function conceptHtml(c, lang, doc) {
  const L = LABELS[lang];
  const w = (f) => `${c.id} ${f}`;
  const p = (v, f) => pick(v, lang, w(f), doc);
  let h = '';
  if (c.origin) h += `<h4>${L.origin}</h4><p>${esc(p(c.origin, 'origin'))}</p>`;
  if (c.steps?.length) {
    h += `<h4>${L.steps}</h4><ol class="steps">${c.steps.map((s, i) => `<li>${esc(p(s.text, 'step ' + (i + 1)))}${s.example ? `<div class="eg">${esc(p(s.example, 'step example ' + (i + 1)))}</div>` : ''}</li>`).join('')}</ol>`;
  }
  if (c.whyItWorks) h += `<h4>${L.why}</h4><p>${esc(p(c.whyItWorks, 'why it works'))}</p>`;
  if (c.example) {
    h += `<h4>${L.example}</h4><div class="box"><b>${esc(p(c.example.title, 'example title'))}</b>${(c.example.lines || []).map((l, i) => `<div>${esc(p(l, 'example line ' + (i + 1)))}</div>`).join('')}${c.example.result ? `<div class="res">${esc(p(c.example.result, 'example result'))}</div>` : ''}</div>`;
  }
  if (c.commonMistake) h += `<h4>${L.mistake}</h4><p>${esc(p(c.commonMistake, 'common mistake'))}</p>`;
  if (c.realWorld) h += `<h4>${L.real}</h4><p>${esc(p(c.realWorld, 'real world'))}</p>`;
  return h;
}

// ── document shell ─────────────────────────────────────────────────────────
const CSS = `
:root{--font-heading:'Segoe UI','Nirmala UI',sans-serif;--font-body:'Segoe UI','Nirmala UI',sans-serif}
@page{size:A4;margin:16mm 14mm 18mm;@bottom-center{content:counter(page);font:9pt 'Segoe UI',sans-serif;color:#6b7280}}
*{box-sizing:border-box}
body{font-family:'Segoe UI','Nirmala UI',sans-serif;font-size:10.5pt;line-height:1.45;color:#0a1628;margin:0}
h1{font-size:24pt;margin:0 0 6pt} h2{font-size:16pt;margin:0 0 4pt;color:#1e40af} h3{font-size:13pt;margin:14pt 0 4pt;color:#0a1628;border-bottom:1px solid #d1d5db;padding-bottom:3pt}
h4{font-size:11pt;margin:10pt 0 3pt;color:#0a1628} p{margin:3pt 0}
.cover{height:240mm;display:flex;flex-direction:column;justify-content:center} .cover .sub{color:#4b5563;font-size:12pt;margin-bottom:18pt}
.cover table{border-collapse:collapse;margin-top:14pt} .cover td{border:1px solid #d1d5db;padding:5pt 12pt}
.note{background:#fef3c7;border-left:3px solid #d97706;padding:6pt 10pt;margin:10pt 0;font-size:9.5pt}
.chap{break-before:page} .toc{break-after:page} .toc li{margin:2pt 0}
.qs>li{margin:7pt 0;break-inside:avoid} .qt{font-weight:600}
.opts{list-style:none;margin:2pt 0 0 14pt;padding:0} .opts li{margin:1pt 0}
.as{margin-top:2pt} .as>li{margin:4pt 0;break-inside:avoid} .ex{color:#374151;font-size:9.5pt;margin-top:1pt}
.tag{font-size:8pt;font-weight:600;padding:1pt 6pt;border-radius:8pt;margin-left:4pt;vertical-align:middle}
.tag.easy{background:#dcfce7;color:#166534}.tag.medium{background:#fef9c3;color:#854d0e}.tag.hard{background:#fee2e2;color:#991b1b}
.box{background:#f0f4ff;border-left:4px solid #3b82f6;padding:7pt 10pt;margin:4pt 0} .box .res{font-weight:700;margin-top:3pt}
.eg{color:#374151;font-size:9.5pt;margin-top:1pt} .steps>li{margin:3pt 0}
.remarks{border:1px solid #9ca3af;padding:8pt 10pt;margin-top:14pt;break-inside:avoid} .remarks .lines{height:46pt;background:repeating-linear-gradient(transparent,transparent 17pt,#d1d5db 18pt)} .remarks .verdict{margin-top:6pt}
.vedic-concept{margin-top:4pt}
`;

function shell(title, lang, body) {
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${CSS}</style></head><body>${body}</body></html>`;
}

function cover(title, subtitle, lang, facts, note) {
  const L = LABELS[lang];
  return `<div class="cover"><h1>${esc(title)}</h1><div class="sub">${esc(subtitle)}</div>
  <table>${facts.map(([a, b]) => `<tr><td><b>${esc(a)}</b></td><td>${esc(b)}</td></tr>`).join('')}</table>
  ${note ? `<div class="note">${esc(note)}</div>` : ''}
  <table style="margin-top:30pt"><tr><td>${L.sign}</td><td style="width:280pt"></td></tr><tr><td>${L.name}</td><td>&nbsp;</td></tr><tr><td>${L.date}</td><td>&nbsp;</td></tr><tr><td>${L.signature}</td><td style="height:40pt">&nbsp;</td></tr></table></div>`;
}

async function toPdf(htmlPath, pdfPath) {
  if (existsSync(pdfPath)) unlinkSync(pdfPath);
  execFileSync(EDGE, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${pdfPath}`, pathToFileURL(htmlPath).href], { stdio: 'ignore', timeout: 600000 });
  // Edge can return before the file is fully written: wait until the size stops changing.
  let last = -1;
  for (let i = 0; i < 300; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    if (!existsSync(pdfPath)) continue;
    const size = statSync(pdfPath).size;
    if (size > 0 && size === last) return;
    last = size;
  }
  throw new Error('PDF not written: ' + pdfPath);
}

async function emit(name, title, lang, html) {
  const htmlPath = resolve(OUT, `${name}.html`);
  const pdfPath = resolve(OUT, `${name}.pdf`);
  writeFileSync(htmlPath, shell(title, lang, html), 'utf8');
  await toPdf(htmlPath, pdfPath);
  console.log('wrote', pdfPath);
}

// ═══ data ══════════════════════════════════════════════════════════════════
const { CURRICULUM } = await load('/src/components/learn/curriculumData.jsx');
const { LESSON_CONTENT } = await load('/src/components/learn/ConceptTab.jsx');
const { LESSON_PROBLEMS } = await load('/src/components/learn/PracticeTab.jsx');
const { LESSON_QUESTIONS } = await load('/src/components/learn/QuizTab.jsx');
const { LanguageContext, translations } = await load('/src/lib/LanguageContext.jsx');
const { RA_LEVEL1_CHAPTERS } = await load('/src/data/reasoningAptitudeLevel1Content.js');
const { RA_LEVEL2_CHAPTERS } = await load('/src/data/reasoningAptitudeLevel2Content.js');
const { APTITUDE_CHAPTERS } = await load('/src/data/aptitudeContent.js');
const { RA_LEVEL1_QUESTIONS } = await load('/src/data/reasoningAptitudeLevel1.js');
const { RA_LEVEL2_QUESTIONS } = await load('/src/data/reasoningAptitudeLevel2.js');
const { APTITUDE_QUESTIONS } = await load('/src/data/aptitudeQuizBank.js');
const { tx, optKey, optLabel } = await load('/src/lib/bilingual.js');

const PREK = ['match-the-picture', 'what-doesnt-belong', 'count-the-objects', 'big-or-small', 'what-comes-next'];

function vedicConcept(id, lang) {
  const value = { language: lang, setLanguage() {}, toggleLanguage() {}, t: (k) => translations[lang]?.[k] || translations.en?.[k] || k };
  try {
    return renderToStaticMarkup(React.createElement(LanguageContext.Provider, { value }, LESSON_CONTENT[id]()));
  } catch (e) {
    return `<p class="note">Concept could not be rendered: ${esc(e.message)}</p>`;
  }
}

function bankQuestions(bank, chapterId, lang, doc) {
  return bank.filter((q) => q.chapter === chapterId).map((q, i) => {
    const keys = q.options.map(optKey);
    return {
      prompt: pick(q.prompt, lang, `${chapterId} q${i + 1}`, doc),
      options: q.options.map((o) => optLabel(o, lang)),
      answer: keys.indexOf(q.answer),
      exp: pick(q.exp, lang, `${chapterId} q${i + 1} explanation`, doc),
      difficulty: q.difficulty,
    };
  });
}

// ═══ Vedic Maths ═══════════════════════════════════════════════════════════
async function buildVedic(lang) {
  const L = LABELS[lang];
  const doc = `vedic-${lang}`;
  let body = '';
  const toc = [];
  let nq = 0;
  for (const lv of CURRICULUM) {
    for (const les of lv.lessons) {
      const practice = (LESSON_PROBLEMS[les.id] || []).map((q, i) => normVedic(q, lang, `${les.id} practice ${i + 1}`, doc));
      const quiz = (LESSON_QUESTIONS[les.id] || []).map((q, i) => normVedic(q, lang, `${les.id} quiz ${i + 1}`, doc));
      const hasConcept = !les.isAssessment && LESSON_CONTENT[les.id];
      if (!hasConcept && !practice.length && !quiz.length) continue;
      nq += practice.length + quiz.length;
      toc.push(`${L.level} ${lv.level} — ${les.title}`);
      body += `<section class="chap"><h2>${L.level} ${lv.level} (${esc(lv.name)})</h2><h3>${esc(les.title)}</h3>`;
      if (hasConcept) body += `<h4>${L.concept}</h4><div class="vedic-concept">${vedicConcept(les.id, lang)}</div>`;
      if (practice.length) body += `<h3>${L.practice} (${practice.length})</h3>${questionsHtml(practice, lang)}`;
      if (quiz.length) body += `<h3>${L.quiz} (${quiz.length})</h3>${questionsHtml(quiz, lang)}`;
      body += remarksBox(lang) + '</section>';
    }
  }
  const title = lang === 'hi' ? 'वैदिक गणित — समीक्षा दस्तावेज़' : 'Vedic Mathematics — Review Document';
  const front = cover(title, lang === 'hi' ? 'हर पाठ की अवधारणा, अभ्यास प्रश्न, क्विज़ प्रश्न और उत्तर' : 'Concept, practice questions, quiz questions and answers for every lesson',
    lang, [[L.lesson, String(toc.length)], [L.questions, String(nq)], [lang === 'hi' ? 'भाषा' : 'Language', lang === 'hi' ? 'हिन्दी' : 'English']],
    lang === 'hi' ? 'पाठों के शीर्षक अभी केवल अंग्रेज़ी में हैं। जहाँ किसी प्रश्न या व्याख्या का हिंदी पाठ उपलब्ध नहीं है, वहाँ अंग्रेज़ी पाठ दिखाया गया है।' : 'Each lesson ends with a remarks box for the reviewer.');
  const tocHtml = `<div class="toc"><h2>${L.contents}</h2><ol>${toc.map((t) => `<li>${esc(t)}</li>`).join('')}</ol></div>`;
  await emit(`Vedic_Maths_Review_${lang.toUpperCase()}`, title, lang, front + tocHtml + body);
}

// ═══ Reasoning & Aptitude (shared) ═════════════════════════════════════════
async function buildBank(name, titleEn, titleHi, subEn, subHi, groups, lang) {
  const L = LABELS[lang];
  const doc = `${name}-${lang}`;
  let body = '';
  const toc = [];
  let nq = 0;
  for (const g of groups) {
    for (const c of g.chapters) {
      const qs = bankQuestions(g.bank, c.id, lang, doc);
      if (!qs.length) continue;
      nq += qs.length;
      toc.push(`${g.label[lang]} — ${pick(c.title, lang, c.id + ' title', doc)}`);
      body += `<section class="chap"><h2>${esc(g.label[lang])}</h2><h3>${L.ch} ${c.order}: ${esc(pick(c.title, lang, c.id + ' title', doc))} <small>(${esc(pick(c.subtitle, lang, c.id + ' subtitle', doc))})</small></h3>`;
      body += `<h4 style="font-size:12pt">${L.concept}</h4>${conceptHtml(c, lang, doc)}`;
      body += `<h3>${L.questions} (${qs.length})</h3>${questionsHtml(qs, lang)}${remarksBox(lang)}</section>`;
    }
  }
  const title = lang === 'hi' ? titleHi : titleEn;
  const front = cover(title, lang === 'hi' ? subHi : subEn, lang, [[L.ch, String(toc.length)], [L.questions, String(nq)], [lang === 'hi' ? 'भाषा' : 'Language', lang === 'hi' ? 'हिन्दी' : 'English']],
    name === 'Aptitude' ? (lang === 'hi' ? 'प्री-के अध्याय (5) इस दस्तावेज़ में शामिल नहीं हैं; वे अभी रोके गए हैं।' : 'The five Pre-K chapters are not included; they are on hold.') : '');
  const tocHtml = `<div class="toc"><h2>${L.contents}</h2><ol>${toc.map((t) => `<li>${esc(t)}</li>`).join('')}</ol></div>`;
  await emit(`${name}_Review_${lang.toUpperCase()}`, title, lang, front + tocHtml + body);
}

const reasoningGroups = [
  { label: { en: 'Level 1 (Beginner)', hi: 'स्तर 1 (प्रारंभिक)' }, chapters: RA_LEVEL1_CHAPTERS, bank: RA_LEVEL1_QUESTIONS },
  { label: { en: 'Level 2 (Intermediate)', hi: 'स्तर 2 (मध्यम)' }, chapters: RA_LEVEL2_CHAPTERS, bank: RA_LEVEL2_QUESTIONS },
];
const aptLevels = [['PRIMARY', 'Primary', 'प्राथमिक'], ['MIDDLE', 'Middle', 'मध्य'], ['SECONDARY', 'Secondary', 'माध्यमिक'], ['INTERMEDIATE', 'Intermediate', 'उच्च माध्यमिक']];
const aptitudeGroups = aptLevels.map(([k, en, hi]) => ({ label: { en, hi }, chapters: APTITUDE_CHAPTERS.filter((c) => c.level === k && !PREK.includes(c.id)), bank: APTITUDE_QUESTIONS }));

const only = process.argv[2];
try {
  for (const lang of ['en', 'hi']) {
    if (!only || only === 'vedic') await buildVedic(lang);
    if (!only || only === 'reasoning') await buildBank('Reasoning', 'Reasoning — Review Document', 'रीज़निंग — समीक्षा दस्तावेज़', 'Concept, questions and answers for every chapter, Level 1 and Level 2', 'हर अध्याय की अवधारणा, प्रश्न और उत्तर — स्तर 1 और स्तर 2', reasoningGroups, lang);
    if (!only || only === 'aptitude') await buildBank('Aptitude', 'Aptitude — Review Document', 'एप्टीट्यूड — समीक्षा दस्तावेज़', 'Concept, questions and answers for every chapter', 'हर अध्याय की अवधारणा, प्रश्न और उत्तर', aptitudeGroups, lang);
  }
  writeFileSync(resolve(OUT, 'hindi-gaps.json'), JSON.stringify(Object.fromEntries(Object.entries(gaps).map(([k, v]) => [k, { count: v.length, sample: v.slice(0, 15) }])), null, 2));
  console.log('Hindi fallbacks:', Object.fromEntries(Object.entries(gaps).map(([k, v]) => [k, v.length])));
} finally {
  await server.close();
}
