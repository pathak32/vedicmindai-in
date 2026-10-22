// Generates the monthly screenless (offline) mock test booklets for Classes 6-10.
// Every arithmetic answer is computed here, not typed by hand, so the keys match the questions.
// Run from the project root: node scripts/generate-screenless.mjs
import { jsPDF } from 'jspdf';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'screenless');

const CLASSES = [6, 7, 8, 9, 10];
const MONTHS = [
  { file: 'October2026', label: 'October 2026', focus: 'Vedic multiplication shortcuts, squares and near-base numbers', seed: 1010, shift: 0 },
  { file: 'November2026', label: 'November 2026', focus: 'Vedic speed checks, ratios, series and reasoning patterns', seed: 1111, shift: 1 },
];

const SUTRA = {
  x11: 'Ekadhikena Purvena (multiplication by 11)',
  sq5: 'Ekadhikena Purvena (squaring numbers ending in 5)',
  x9: 'Nikhilam Navatashcaramam Dashatah (multiplication by 9)',
  nik: 'Nikhilam Navatashcaramam Dashatah (base 100)',
  urd: 'Urdhva-Tiryagbhyam (vertical and crosswise multiplication)',
  x99: 'Nikhilam Navatashcaramam Dashatah (multiplication by 99 and 999)',
  sankalana: 'Sankalana-Vyavakalanabhyam (sum and difference)',
  nik1000: 'Nikhilam Navatashcaramam Dashatah (base 1000)',
  duplex: 'Duplex (squaring by the duplex method)',
};

// Vedic categories per class. The three categories rotate across the Vedic questions.
const VEDIC_POOL = {
  6: ['x11', 'sq5', 'x9'],
  7: ['x11', 'nik', 'sq5'],
  8: ['nik', 'urd', 'x99'],
  9: ['sankalana', 'urd', 'x99'],
  10: ['nik1000', 'duplex', 'sankalana'],
};

// Aptitude and reasoning templates per class. Four are drawn for each test.
const APTITUDE_POOL = {
  6: ['arith', 'percent', 'oddSquare', 'squareSeries', 'discount'],
  7: ['arith', 'percent', 'coding', 'speed', 'discount'],
  8: ['geom', 'discount', 'speed', 'timeWork', 'direction', 'coding'],
  9: ['squareSeries', 'timeWork', 'clock', 'ratio', 'direction', 'discount'],
  10: ['geom', 'ratio', 'clock', 'timeWork', 'direction', 'speed'],
};

// Seeded random generator (mulberry32), so each booklet is reproducible.
function rngFrom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const between = (rng, lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
function shuffle(rng, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function vedicItem(cat, rng) {
  switch (cat) {
    case 'x11': {
      const n = between(rng, 11, 99);
      return { text: `Find ${n} x 11 using the Vedic shortcut (show your steps).`, answer: n * 11 };
    }
    case 'sq5': {
      const n = between(rng, 1, 9) * 10 + 5;
      return { text: `Find ${n}^2 using the Vedic shortcut.`, answer: n * n };
    }
    case 'x9': {
      const n = between(rng, 12, 99);
      return { text: `Find ${n} x 9 using the Nikhilam shortcut (n x 10 - n).`, answer: n * 9 };
    }
    case 'nik': {
      const pickNear = () => (rng() < 0.5 ? between(rng, 90, 99) : between(rng, 101, 110));
      const x = pickNear();
      const y = pickNear();
      return { text: `Find ${x} x ${y} using Nikhilam (base 100).`, answer: x * y };
    }
    case 'urd': {
      const a = between(rng, 11, 99);
      const b = between(rng, 11, 99);
      return { text: `Find ${a} x ${b} using the Urdhva method (vertical and crosswise).`, answer: a * b };
    }
    case 'x99': {
      const n = between(rng, 11, 99);
      const m = rng() < 0.5 ? 99 : 999;
      return { text: `Find ${n} x ${m} using the Vedic shortcut.`, answer: n * m };
    }
    case 'sankalana': {
      const a = between(rng, 20, 80);
      const d = between(rng, 1, 9);
      return { text: `Find (${a} + ${d}) x (${a} - ${d}) using the sum and difference method.`, answer: a * a - d * d };
    }
    case 'nik1000': {
      const x = 1000 - between(rng, 1, 30);
      const y = 1000 - between(rng, 1, 30);
      return { text: `Find ${x} x ${y} using Nikhilam (base 1000).`, answer: x * y };
    }
    case 'duplex': {
      const n = between(rng, 31, 99);
      return { text: `Find ${n}^2 using the duplex method.`, answer: n * n };
    }
    default:
      throw new Error(`Unknown Vedic category: ${cat}`);
  }
}

const isSquare = (n) => Number.isInteger(Math.sqrt(n));
const WORDS = ['CAT', 'DOG', 'SUN', 'BIRD', 'MAP', 'TREE', 'LAMP'];
const encode = (word, k) =>
  [...word].map((c) => String.fromCharCode(((c.charCodeAt(0) - 65 + k) % 26) + 65)).join('');

const APTITUDE = {
  arith: (rng) => {
    const a = between(rng, 1, 20);
    const d = between(rng, 2, 9);
    return { text: `Complete the series: ${a}, ${a + d}, ${a + 2 * d}, ${a + 3 * d}, ___`, answer: a + 4 * d };
  },
  geom: (rng) => {
    const a = between(rng, 1, 5);
    const r = between(rng, 2, 3);
    return { text: `Complete the series: ${a}, ${a * r}, ${a * r * r}, ${a * r ** 3}, ___`, answer: a * r ** 4 };
  },
  squareSeries: (rng) => {
    const s = between(rng, 1, 6);
    return { text: `Complete the series: ${s * s}, ${(s + 1) ** 2}, ${(s + 2) ** 2}, ${(s + 3) ** 2}, ___`, answer: (s + 4) ** 2 };
  },
  oddSquare: (rng) => {
    const ks = new Set();
    while (ks.size < 3) ks.add(between(rng, 2, 12));
    let odd = between(rng, 10, 150);
    while (isSquare(odd)) odd = between(rng, 10, 150);
    const list = shuffle(rng, [...[...ks].map((k) => k * k), odd]);
    return { text: `Find the odd one out: ${list.join(', ')}`, answer: odd };
  },
  percent: (rng) => {
    const p = pick(rng, [10, 20, 25, 50, 75]);
    const n = 100 * between(rng, 1, 9);
    return { text: `Find ${p}% of ${n}.`, answer: (p * n) / 100 };
  },
  discount: (rng) => {
    const m = 100 * between(rng, 3, 20);
    const p = pick(rng, [10, 20, 25, 50]);
    return {
      text: `A shopkeeper marks an item at Rs. ${m} and gives a ${p}% discount. Find the selling price (in Rs.).`,
      answer: (m * (100 - p)) / 100,
    };
  },
  speed: (rng) => {
    const k = between(rng, 5, 30);
    const t = between(rng, 2, 20);
    return { text: `A train ${k * t} m long crosses a pole in ${t} seconds. Find its speed in m/s.`, answer: k };
  },
  timeWork: (rng) => {
    const a = between(rng, 2, 12);
    let b = between(rng, 2, 12);
    while (b === a) b = between(rng, 2, 12);
    const k = between(rng, 2, 6);
    return {
      text: `${a} workers build a wall in ${b * k} days. How many days will ${b} workers take at the same rate?`,
      answer: a * k,
    };
  },
  clock: (rng) => {
    const h = between(rng, 1, 11);
    const m = pick(rng, [0, 30]);
    let angle = Math.abs(30 * h - 5.5 * m);
    if (angle > 180) angle = 360 - angle;
    return {
      text: `A clock shows ${h}:${String(m).padStart(2, '0')}. What is the angle between the hour and minute hands (in degrees)?`,
      answer: angle,
    };
  },
  direction: (rng) => {
    const [a, b, c] = pick(rng, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]]);
    return {
      text: `A person walks ${a} km North and then ${b} km East. How far is the person from the starting point (in km)?`,
      answer: c,
    };
  },
  ratio: (rng) => {
    const [a, b] = pick(rng, [[2, 3], [3, 5], [4, 5], [5, 7]]);
    const k = between(rng, 2, 12);
    return {
      text: `Two partners share Rs. ${(a + b) * k} in the ratio ${a}:${b}. How much does the larger share get (in Rs.)?`,
      answer: Math.max(a, b) * k,
    };
  },
  coding: (rng) => {
    const k = between(rng, 1, 3);
    const word = pick(rng, WORDS);
    let other = pick(rng, WORDS);
    while (other === word) other = pick(rng, WORDS);
    return {
      text: `Each letter is moved ${k} place(s) forward in the alphabet. If ${word} is coded as ${encode(word, k)}, how is ${other} coded?`,
      answer: encode(other, k),
    };
  },
};

function buildBooklet(cls, month) {
  const rng = rngFrom(month.seed + cls * 97);
  const tests = [];
  for (let t = 0; t < 5; t++) {
    const vedic = [0, 1, 2].map((i) => {
      const cat = VEDIC_POOL[cls][(t * 3 + i + month.shift) % 3];
      return { cat, ...vedicItem(cat, rng) };
    });
    const names = shuffle(rng, APTITUDE_POOL[cls]).slice(0, 4);
    const reasoning = names.map((name) => APTITUDE[name](rng));
    tests.push({ sutra: SUTRA[vedic[0].cat], vedic, reasoning });
  }
  return tests;
}

function renderBooklet(cls, month, tests) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210;
  const H = 297;
  const M = 20;
  const CW = W - 2 * M;
  let y = 0;

  const header = () => {
    doc.setFillColor(10, 22, 40);
    doc.rect(0, 0, W, 24, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text('VedicMindAI', M, 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(147, 197, 253);
    doc.text('Screenless Teaching by VedicMindAI', M, 16);
    doc.setFontSize(10);
    doc.setTextColor(251, 191, 36);
    doc.text(`Class ${cls} | ${month.label}`, W - M, 10, { align: 'right' });
    doc.setFontSize(8);
    doc.setTextColor(200, 210, 230);
    doc.text('vedicmindai.in', W - M, 16, { align: 'right' });
    y = 36;
  };

  const newPage = () => {
    doc.addPage();
    header();
  };

  const ensure = (h) => {
    if (y + h > H - 22) newPage();
  };

  const para = (text, { size = 10.5, style = 'normal', color = [17, 24, 39], gap = 2, indent = 0 } = {}) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, CW - indent);
    const lineH = size * 0.42 + 1.2;
    ensure(lines.length * lineH + gap);
    doc.text(lines, M + indent, y + 4);
    y += lines.length * lineH + gap;
  };

  const sectionHead = (text) => {
    ensure(14);
    y += 3;
    para(text, { size: 11.5, style: 'bold', color: [37, 99, 235], gap: 3 });
  };

  const banner = (text) => {
    ensure(18);
    doc.setFillColor(59, 130, 246);
    doc.rect(M, y, CW, 12, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(text, W / 2, y + 8, { align: 'center' });
    y += 17;
  };

  const footer = () => {
    const total = doc.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(107, 114, 128);
      doc.text(
        `(c) 2026 VedicMindAI - Ancient Wisdom. Infinite Speed.  |  Free trial: vedicmindai.in  |  Page ${i} of ${total}`,
        W / 2,
        H - 10,
        { align: 'center' },
      );
    }
  };

  // Cover
  header();
  y = 60;
  para('Screenless Teaching', { size: 26, style: 'bold', color: [10, 22, 40], gap: 2 });
  para('by VedicMindAI', { size: 12, color: [107, 114, 128], gap: 10 });
  para(`Class ${cls}   |   5 Mock Tests   |   35 Questions   |   Rs. 49 / month`, {
    size: 11,
    style: 'bold',
    color: [30, 64, 175],
    gap: 10,
  });
  para(`${month.label} focus: ${month.focus}`, { size: 11, gap: 6 });
  [
    '5 fresh mock test papers: Vedic Maths sutras plus Aptitude & Reasoning',
    'Designed for offline, screen-free practice: pen, paper and focus',
    'Each paper takes about 20 minutes, for daily practice or weekend revision',
    'Submit your scores in the app to unlock a subscription discount',
    'Answer key at the end of the booklet, for parents and teachers',
  ].forEach((line) => para(`- ${line}`, { size: 10.5, gap: 3, indent: 2 }));

  tests.forEach((test, idx) => {
    newPage();
    banner(`Mock Test ${idx + 1} of 5`);
    para(`Sutra Focus: ${test.sutra}`, { size: 10.5, style: 'bold', gap: 3 });
    para(
      'Instructions: Solve each question using the Vedic method taught in your VedicMindAI lessons. Show your working where indicated. Time: 20 minutes.',
      { size: 9, color: [107, 114, 128], gap: 4 },
    );

    sectionHead('Section A - Vedic Maths (3 Questions)');
    test.vedic.forEach((q, i) => para(`A${i + 1}. ${q.text}`, { gap: 5 }));

    sectionHead('Section B - Aptitude & Reasoning (4 Questions)');
    test.reasoning.forEach((q, i) => para(`B${i + 1}. ${q.text}`, { gap: 5 }));

    ensure(22);
    y += 4;
    doc.setDrawColor(156, 163, 175);
    doc.rect(M, y, CW, 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(17, 24, 39);
    doc.text('Score: _____ / 7', M + 4, y + 7.5);
    doc.text('Time Taken: _____ min', M + 70, y + 7.5);
    doc.text('Parent Signature: ______________', M + 120, y + 7.5);
    y += 16;
  });

  newPage();
  banner('Answer Key - All 5 Papers');
  para(
    'Submit your completed papers\' scores on the VedicMindAI app (Profile -> Share Your Story) to unlock a subscription discount.',
    { size: 9.5, color: [75, 85, 99], gap: 6 },
  );
  tests.forEach((test, idx) => {
    sectionHead(`Mock Test ${idx + 1} - ${test.sutra}`);
    test.vedic.forEach((q, i) => para(`A${i + 1}   ${q.answer}`, { size: 10, gap: 1.5, indent: 2 }));
    test.reasoning.forEach((q, i) => para(`B${i + 1}   ${q.answer}`, { size: 10, gap: 1.5, indent: 2 }));
  });

  footer();
  return doc;
}

mkdirSync(OUT_DIR, { recursive: true });
for (const month of MONTHS) {
  for (const cls of CLASSES) {
    const tests = buildBooklet(cls, month);
    const doc = renderBooklet(cls, month, tests);
    const file = join(OUT_DIR, `VedicMind_Screenless_Class${cls}_${month.file}.pdf`);
    writeFileSync(file, Buffer.from(doc.output('arraybuffer')));
    console.log('wrote', file);
  }
}
