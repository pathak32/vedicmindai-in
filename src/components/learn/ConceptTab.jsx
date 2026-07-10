import React, { useState, useEffect } from 'react';
import { L4_05_CONTENT, L4_06_CONTENT, L4_07_CONTENT, L4_08_CONTENT } from './ConceptTabLevel4B.jsx';
import VideoButton from './VideoButton';
import { useLanguage } from '@/lib/LanguageContext';

// ── Shared helpers ────────────────────────────────────────────────────────────

// Resolves a field that may be either a plain string (older, English-only
// lessons — left untouched) or a { en, hi, ... } bilingual object (new
// lessons). Always falls back to English if the active language is missing,
// so a partially-translated lesson never renders blank text.
function tr(field, language) {
  if (field == null) return field;
  if (typeof field === 'string') return field; // legacy plain-string usage
  return field[language] ?? field.en ?? '';
}

function SutraBox({ sutra, meaning }) {
  const { language } = useLanguage();
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0A1628, #1E40AF)',
      borderRadius: 12, padding: '16px 20px', marginBottom: 24,
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: '#93C5FD', marginBottom: 4 }}>{sutra}</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>"{tr(meaning, language)}"</div>
    </div>
  );
}

function StepBox({ number, text, example }) {
  const { language } = useLanguage();
  const stepLabel = language === 'hi' ? 'चरण' : 'Step';
  return (
    <div style={{
      background: '#F0F4FF', borderLeft: '4px solid #3B82F6',
      borderRadius: '0 8px 8px 0', padding: '12px 16px', marginBottom: 10,
    }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628' }}>
        <span style={{ fontWeight: 700, marginRight: 8 }}>{stepLabel} {number}:</span>{tr(text, language)}
      </div>
      {example && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1E40AF', marginTop: 6 }}>{tr(example, language)}</div>
      )}
    </div>
  );
}

function DigitBreakdown({ digits }) {
  const { language } = useLanguage();
  if (!digits || digits.length === 0) return null;
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10, marginBottom: 10 }}>
      {digits.map((d, i) => (
        <div key={i} style={{
          background: '#0A1628', borderRadius: 10, padding: '8px 14px', textAlign: 'center', minWidth: 64,
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 20, color: '#FBBF24' }}>{tr(d.value, language)}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>{tr(d.label, language)}</div>
        </div>
      ))}
    </div>
  );
}

function ExampleCard({ title, lines, result, breakdown }) {
  const { language } = useLanguage();
  return (
    <div style={{ background: '#F0F4FF', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 8 }}>{tr(title, language)}</div>
      {lines.map((l, i) => (
        <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#4B5563', marginBottom: 4 }}>{tr(l, language)}</div>
      ))}
      {breakdown && (
        <>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#6B7280', fontWeight: 600, marginTop: 10, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            {language === 'hi' ? 'तो उत्तर बनता है' : 'So the answer is built from'}
          </div>
          <DigitBreakdown digits={breakdown} />
        </>
      )}
      {result && (
        <div style={{ marginTop: 10, background: '#DBEAFE', borderRadius: 8, padding: '8px 14px', display: 'inline-block' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: '#0A1628' }}>{tr(result, language)}</span>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  const { language } = useLanguage();
  return (
    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: '#0A1628', marginBottom: 14, marginTop: 24 }}>
      {tr(children, language)}
    </h3>
  );
}

// ── Deep-content components (Origin / Why It Works / Common Mistake / Real World) ──
// These four give every lesson the same "why, not just how" depth: where the
// technique comes from, why it mathematically works, what students typically
// get wrong, and where they'd actually use it outside the app.

function OriginBox({ text }) {
  const { language } = useLanguage();
  const label = language === 'hi' ? '📜 यह कहाँ से आया?' : '📜 Where does this come from?';
  return (
    <div style={{ background: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: 12, padding: '14px 18px', marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#6B21A8', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', lineHeight: 1.7 }}>{tr(text, language)}</div>
    </div>
  );
}

function WhyItWorksBox({ text }) {
  const { language } = useLanguage();
  const label = language === 'hi' ? '💡 यह क्यों काम करता है?' : '💡 Why does this work?';
  return (
    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: '14px 18px', marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', lineHeight: 1.7 }}>{tr(text, language)}</div>
    </div>
  );
}

function CommonMistakeBox({ text }) {
  const { language } = useLanguage();
  const label = language === 'hi' ? '⚠️ आम गलती' : '⚠️ Common Mistake';
  return (
    <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '14px 18px', marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#92400E', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', lineHeight: 1.7 }}>{tr(text, language)}</div>
    </div>
  );
}

function RealWorldBox({ text }) {
  const { language } = useLanguage();
  const label = language === 'hi' ? '🌍 असल जिंदगी में उपयोग' : '🌍 Where you\'d actually use this';
  return (
    <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '14px 18px', marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#065F46', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#065F46', lineHeight: 1.7 }}>{tr(text, language)}</div>
    </div>
  );
}

// Exported so other pages (e.g. the new Reasoning & Aptitude curriculum)
// can reuse this exact same "why, not just how" template.
export { SutraBox, StepBox, ExampleCard, SectionTitle, OriginBox, WhyItWorksBox, CommonMistakeBox, RealWorldBox };

// ── L1_01 ─────────────────────────────────────────────────────────────────────

// L1_01 — bilingual data. Structure: every text field is { en, hi } so a
// future database migration is just "one row per key", not a rewrite.
// To add a 3rd language later: add a `ta:` (or `gu:`) key next to `hi:` here
// — no other code changes needed, t() below already falls back to `en`.
const L1_01_DATA = {
  heading1: { en: 'What is Vedic Mathematics?', hi: 'वैदिक गणित क्या है?' },
  intro: {
    en: 'Vedic Mathematics is a collection of 16 Sutras (formulae) and 13 Sub-Sutras rediscovered by Swami Bharati Krishna Tirthaji from ancient Vedic texts. These techniques simplify arithmetic, algebra, geometry, calculus and more.',
    hi: 'वैदिक गणित 16 सूत्रों (फॉर्मूलों) और 13 उप-सूत्रों का संग्रह है, जिन्हें स्वामी भारती कृष्ण तीर्थजी ने प्राचीन वैदिक ग्रंथों से पुनः खोजा। ये तकनीकें अंकगणित, बीजगणित, ज्यामिति, कैलकुलस और अन्य विषयों को सरल बनाती हैं।',
  },
  heading2: { en: 'The 16 Sutras at a Glance', hi: '16 सूत्र एक नज़र में' },
  sutras: [
    {
      name: 'Ekadhikena Purvena',
      meaning: { en: 'By one more than the previous one', hi: 'पिछले से एक अधिक' },
      use: { en: 'Squaring numbers ending in 5', hi: '5 पर समाप्त होने वाली संख्याओं का वर्ग' },
    },
    {
      name: 'Nikhilam',
      meaning: { en: 'All from 9 and the last from 10', hi: 'सब 9 से और अंतिम 10 से' },
      use: { en: 'Multiplication near bases (10, 100, 1000)', hi: 'आधार के निकट गुणन (10, 100, 1000)' },
    },
    {
      name: 'Urdhva-Tiryagbhyam',
      meaning: { en: 'Vertically and crosswise', hi: 'ऊर्ध्वाधर और तिरछा' },
      use: { en: 'General multiplication', hi: 'सामान्य गुणन' },
    },
  ],
  heading3: { en: 'Example — 25² using Ekadhikena Purvena', hi: 'उदाहरण — एकाधिकेन पूर्वेण से 25²' },
  usedFor: { en: 'Used for', hi: 'उपयोग' },
  steps: [
    { en: 'The number ends in 5, so we use Ekadhikena Purvena', hi: 'संख्या 5 पर समाप्त होती है, इसलिए हम एकाधिकेन पूर्वेण का उपयोग करते हैं' },
    { en: "Take the digit before 5: that's 2", hi: '5 से पहले के अंक को लें: वह है 2' },
    { en: 'Multiply by one more: 2 × 3 = 6', hi: 'एक अधिक से गुणा करें: 2 × 3 = 6' },
    { en: 'Append 25: Answer = 625', hi: '25 जोड़ें: उत्तर = 625' },
  ],
  stepLabel: { en: 'Step', hi: 'चरण' },
  resultLine: { en: '25² = 625 ✓', hi: '25² = 625 ✓' }, // numbers/symbols never translate
};

// Generic bilingual renderer for L1_01 — reads current language via
// useLanguage(), falls back to English if a Hindi string is ever missing
// (e.g. partially-translated future lesson), so nothing breaks mid-rollout.
function L1_01_Renderer() {
  const { language } = useLanguage();
  const tr = (field) => field?.[language] || field?.en || '';
  const d = L1_01_DATA;

  return (
    <>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: '#0A1628', marginBottom: 12 }}>
        {tr(d.heading1)}
      </h3>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#4B5563', lineHeight: 1.7, marginBottom: 24 }}>
        {tr(d.intro)}
      </p>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: '#0A1628', marginBottom: 16 }}>
        {tr(d.heading2)}
      </h3>
      <div style={{ display: 'grid', gap: 12, marginBottom: 28 }}>
        {d.sutras.map((s) => (
          <div key={s.name} style={{ background: '#F0F4FF', border: '1px solid rgba(30,64,175,0.15)', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: '#1E40AF', marginBottom: 4 }}>{s.name}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', fontStyle: 'italic', marginBottom: 6 }}>"{tr(s.meaning)}"</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#0A1628' }}>{tr(d.usedFor)}: {tr(s.use)}</div>
          </div>
        ))}
      </div>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: '#0A1628', marginBottom: 16 }}>
        {tr(d.heading3)}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {d.steps.map((step, i) => (
          <div key={i} style={{ background: '#F0F4FF', borderLeft: '4px solid #3B82F6', borderRadius: '0 8px 8px 0', padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628' }}>
            <span style={{ fontWeight: 700, marginRight: 8 }}>{tr(d.stepLabel)} {i + 1}:</span>{tr(step)}
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', background: '#DBEAFE', borderRadius: 12, padding: '20px 24px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: '#0A1628' }}>{tr(d.resultLine)}</span>
      </div>
    </>
  );
}

const L1_01_CONTENT = <L1_01_Renderer />;

// ── L1_02 ─────────────────────────────────────────────────────────────────────

const L1_02_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Ekadhikena Purvena</div>
      <L1_02_MeaningLine />
    </div>

    <SectionTitle>{{ en: 'The Technique', hi: 'तकनीक' }}</SectionTitle>
    <StepBox number={1}
      text={{ en: 'Identify the digit BEFORE the 5', hi: '5 से पहले वाला अंक पहचानें' }}
      example={{ en: 'For 35² → the digit before 5 is 3', hi: '35² के लिए → 5 से पहले का अंक 3 है' }} />
    <StepBox number={2}
      text={{ en: 'Multiply that digit by ONE MORE than itself', hi: 'उस अंक को अपने से एक अधिक से गुणा करें' }}
      example="3 × (3+1) = 3 × 4 = 12" />
    <StepBox number={3}
      text={{ en: 'Write the result, then append 25', hi: 'परिणाम लिखें, फिर 25 जोड़ें' }}
      example={{ en: '12 → append 25 → Answer: 1225', hi: '12 → 25 जोड़ें → उत्तर: 1225' }} />

    <SectionTitle>{{ en: 'Worked Examples', hi: 'हल किए गए उदाहरण' }}</SectionTitle>

    <ExampleCard title={{ en: 'Example 1: 35²', hi: 'उदाहरण 1: 35²' }} lines={['3 × 4 = 12', { en: 'Append 25 → 1225', hi: '25 जोड़ें → 1225' }]} result="35² = 1225 ✓" />
    <ExampleCard title={{ en: 'Example 2: 75²', hi: 'उदाहरण 2: 75²' }} lines={['7 × 8 = 56', { en: 'Append 25 → 5625', hi: '25 जोड़ें → 5625' }]} result="75² = 5625 ✓" />
    <ExampleCard title={{ en: 'Example 3: 95²', hi: 'उदाहरण 3: 95²' }} lines={['9 × 10 = 90', { en: 'Append 25 → 9025', hi: '25 जोड़ें → 9025' }]} result="95² = 9025 ✓" />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <L1_02_WhyNote />
    </div>
  </>
);

function L1_02_MeaningLine() {
  const { language } = useLanguage();
  return (
    <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}>
      {language === 'hi' ? 'पिछले से एक अधिक' : 'By one more than the previous one'}
    </div>
  );
}

function L1_02_WhyNote() {
  const { language } = useLanguage();
  if (language === 'hi') {
    return (
      <>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 6 }}>💡 यह क्यों काम करता है?</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', lineHeight: 1.7 }}>
          5 पर समाप्त होने वाली कोई भी संख्या (10n+5) के रूप में लिखी जा सकती है।<br />
          (10n+5)² = 100n(n+1) + 25.<br />
          n×(n+1) वाला भाग प्रीफ़िक्स देता है, और 25 हमेशा सफ़िक्स होता है।
        </div>
      </>
    );
  }
  return (
    <>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 6 }}>💡 Why does this work?</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', lineHeight: 1.7 }}>
        Any number ending in 5 can be written as (10n+5).<br />
        (10n+5)² = 100n(n+1) + 25.<br />
        The n×(n+1) part gives the prefix, and 25 is always the suffix.
      </div>
    </>
  );
}

// ── L1_03 ─────────────────────────────────────────────────────────────────────

function L1_03_RunningExampleNote() {
  const { language } = useLanguage();
  return (
    <div style={{
      background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 10,
      padding: '10px 16px', marginBottom: 16, fontFamily: 'var(--font-body)',
      fontSize: 13, color: '#92400E', fontWeight: 600,
    }}>
      {language === 'hi'
        ? '👇 आइए इन 4 चरणों में 8 × 7 को हल करते हैं (हर चरण नीचे इसी उदाहरण को आगे बढ़ाता है):'
        : "👇 Let's solve 8 × 7 together using these 4 steps (each step below continues this same example):"}
    </div>
  );
}

function L1_03_RunningExampleResult() {
  const { language } = useLanguage();
  return (
    <div style={{
      background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 10,
      padding: '10px 16px', marginTop: 4, marginBottom: 20, fontFamily: 'var(--font-body)',
      fontSize: 13, color: '#065F46', fontWeight: 600,
    }}>
      {language === 'hi'
        ? '✅ तो 8 × 7 = 56 — ऊपर के सभी 4 चरण इसी एक उदाहरण के हैं।'
        : "✅ So 8 × 7 = 56 — all 4 steps above were for this one example."}
    </div>
  );
}

const L1_03_CONTENT = (
  <>
    <SutraBox sutra="Nikhilam Navatashcaramam Dashatah" meaning={{ en: 'All from 9 and the last from 10', hi: 'सब 9 से और अंतिम 10 से' }} />

    <OriginBox text={{
      en: 'This sutra comes from a collection of 16 Vedic Maths formulae compiled by Swami Bharati Krishna Tirthaji in the early 20th century, who described them as rediscovered from ancient Sanskrit texts. Nikhilam solves a very old, practical problem: multiplying two numbers that are both close to a "round" number like 10, 100, or 1000 — something merchants and scholars needed to do quickly, long before calculators existed.',
      hi: 'यह सूत्र स्वामी भारती कृष्ण तीर्थजी द्वारा 20वीं सदी की शुरुआत में संकलित 16 वैदिक गणित सूत्रों में से एक है, जिन्हें उन्होंने प्राचीन संस्कृत ग्रंथों से पुनः खोजा हुआ बताया। निखिलम् एक बहुत पुरानी, व्यावहारिक समस्या हल करता है: दो ऐसी संख्याओं को गुणा करना जो दोनों किसी "गोल" संख्या जैसे 10, 100, या 1000 के निकट हों — यह काम व्यापारियों और विद्वानों को कैलकुलेटर के आविष्कार से बहुत पहले तेज़ी से करना पड़ता था।',
    }} />

    <SectionTitle>{{ en: 'The Technique — Near Base 10', hi: 'तकनीक — आधार 10 के निकट' }}</SectionTitle>
    <L1_03_RunningExampleNote />
    <StepBox number={1}
      text={{ en: 'Find the deficit of each number from the base (10)', hi: 'प्रत्येक संख्या की आधार (10) से कमी ज्ञात करें' }}
      example="8 → deficit = 10−8 = 2  |  7 → deficit = 10−7 = 3" />
    <StepBox number={2}
      text={{ en: "Cross subtract: take either number minus the other's deficit", hi: 'तिरछा घटाव: किसी एक संख्या से दूसरे की कमी घटाएं' }}
      example={{ en: '8 − 3 = 5  (or 7 − 2 = 5, both give same answer!) → LEFT part', hi: '8 − 3 = 5  (या 7 − 2 = 5, दोनों का उत्तर समान!) → बायां भाग' }} />
    <StepBox number={3}
      text={{ en: 'Multiply the two deficits', hi: 'दोनों कमियों को गुणा करें' }}
      example={{ en: '2 × 3 = 6 → RIGHT part (single digit since base is 10)', hi: '2 × 3 = 6 → दायां भाग (आधार 10 होने से एक अंक)' }} />
    <StepBox number={4}
      text={{ en: 'Combine: LEFT part | RIGHT part', hi: 'जोड़ें: बायां भाग | दायां भाग' }}
      example={{ en: '5 | 6 → Answer: 56', hi: '5 | 6 → उत्तर: 56' }} />
    <L1_03_RunningExampleResult />

    <WhyItWorksBox text={{
      en: 'Say the two numbers are (10−x) and (10−y) — that\'s just a formal way of saying "x and y less than 10". Multiplying them out: (10−x)(10−y) = 100 − 10x − 10y + xy = 10×(10−x−y) + xy. Look closely: "10−x−y" is exactly the cross-subtraction step (e.g. 8−3), and "xy" is exactly the deficit product step (e.g. 2×3). The trick isn\'t magic — it\'s regular algebra, just rearranged into steps that are fast to do in your head.',
      hi: 'मान लीजिए दो संख्याएं (10−x) और (10−y) हैं — यह सिर्फ यह कहने का औपचारिक तरीका है कि x और y दोनों 10 से कम हैं। इन्हें गुणा करने पर: (10−x)(10−y) = 100 − 10x − 10y + xy = 10×(10−x−y) + xy। ध्यान से देखें: "10−x−y" ठीक वही तिरछा घटाव चरण है (जैसे 8−3), और "xy" ठीक वही कमी का गुणनफल चरण है (जैसे 2×3)। यह तरकीब जादू नहीं है — यह साधारण बीजगणित ही है, बस ऐसे चरणों में व्यवस्थित किया गया है जो दिमाग में तेज़ी से किए जा सकें।',
    }} />

    <SectionTitle>{{ en: 'Worked Examples', hi: 'हल किए गए उदाहरण' }}</SectionTitle>
    <ExampleCard
      title={{ en: 'Example 1: 8 × 7', hi: 'उदाहरण 1: 8 × 7' }}
      lines={[
        { en: 'Deficits: 2 and 3', hi: 'कमियाँ: 2 और 3' },
        { en: 'Cross: 8 − 3 = 5', hi: 'तिरछा: 8 − 3 = 5' },
        { en: 'Product: 2 × 3 = 6', hi: 'गुणनफल: 2 × 3 = 6' },
      ]}
      breakdown={[{ label: { en: 'Left', hi: 'बायां' }, value: '5' }, { label: { en: 'Right', hi: 'दायां' }, value: '6' }]}
      result="8 × 7 = 56 ✓"
    />
    <ExampleCard
      title={{ en: 'Example 2: 9 × 6', hi: 'उदाहरण 2: 9 × 6' }}
      lines={[
        { en: 'Deficits: 1 and 4', hi: 'कमियाँ: 1 और 4' },
        { en: 'Cross: 9 − 4 = 5', hi: 'तिरछा: 9 − 4 = 5' },
        { en: 'Product: 1 × 4 = 4', hi: 'गुणनफल: 1 × 4 = 4' },
      ]}
      breakdown={[{ label: { en: 'Left', hi: 'बायां' }, value: '5' }, { label: { en: 'Right', hi: 'दायां' }, value: '4' }]}
      result="9 × 6 = 54 ✓"
    />
    <ExampleCard
      title={{ en: 'Example 3: 7 × 6', hi: 'उदाहरण 3: 7 × 6' }}
      lines={[
        { en: 'Deficits: 3 and 4', hi: 'कमियाँ: 3 और 4' },
        { en: 'Cross: 7 − 4 = 3', hi: 'तिरछा: 7 − 4 = 3' },
        { en: 'Product: 3 × 4 = 12 → carry 1 → left = 3+1 = 4   ← this becomes the LEFT digit (not the original 3!)', hi: 'गुणनफल: 3 × 4 = 12 → 1 आगे ले जाएं → बायां = 3+1 = 4   ← यह बायां अंक बनता है (मूल 3 नहीं!)' },
        { en: 'right = 2   ← this is the RIGHT digit', hi: 'दायां = 2   ← यह दायां अंक है' },
      ]}
      breakdown={[{ label: { en: 'Left', hi: 'बायां' }, value: '4' }, { label: { en: 'Right', hi: 'दायां' }, value: '2' }]}
      result="7 × 6 = 42 ✓"
    />

    <CommonMistakeBox text={{
      en: 'Two mistakes trip up most students: (1) forgetting to carry when the deficit product is 2 digits or more (see Example 3 above), and (2) thinking this only works for single-digit numbers under 10. It actually works for ANY two numbers close to the same base — 8×7 uses base 10, but 97×96 uses base 100 with the exact same 4 steps (you\'ll see this in the next lesson).',
      hi: 'ज़्यादातर छात्र दो गलतियाँ करते हैं: (1) जब कमियों का गुणनफल 2 अंकों या अधिक का हो तो आगे ले जाना भूल जाना (ऊपर उदाहरण 3 देखें), और (2) यह सोचना कि यह केवल 10 से कम की एक-अंकीय संख्याओं के लिए काम करता है। यह वास्तव में किन्हीं भी दो संख्याओं के लिए काम करता है जो एक ही आधार के निकट हों — 8×7 आधार 10 का उपयोग करता है, लेकिन 97×96 आधार 100 का उपयोग करता है, बिल्कुल उन्हीं 4 चरणों के साथ (आप इसे अगले पाठ में देखेंगे)।',
    }} />

    <RealWorldBox text={{
      en: 'Any time you\'re estimating quickly without a calculator — checking if a shopkeeper gave the right change, splitting a bill between friends, or double-checking a calculator answer during an exam (calculators occasionally get mis-typed inputs, but your mental check won\'t). This exact method is also a favorite shortcut among students preparing for competitive exams like SSC, where speed matters as much as accuracy.',
      hi: 'जब भी आप बिना कैलकुलेटर के जल्दी अनुमान लगा रहे हों — यह जांचना कि दुकानदार ने सही बकाया दिया या नहीं, दोस्तों के बीच बिल बांटना, या परीक्षा के दौरान कैलकुलेटर के उत्तर की दोबारा जांच करना (कैलकुलेटर में कभी-कभी गलत इनपुट टाइप हो जाता है, लेकिन आपकी मानसिक जांच नहीं चूकेगी)। यह ठीक यही तरीका SSC जैसी प्रतियोगी परीक्षाओं की तैयारी करने वाले छात्रों के बीच एक पसंदीदा शॉर्टकट भी है, जहां गति उतनी ही मायने रखती है जितनी सटीकता।',
    }} />
  </>
);

function L1_03_Warning() {
  const { language } = useLanguage();
  return (
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', margin: 0 }}>
      {language === 'hi'
        ? '⚠️ जब कमियों का गुणनफल 2 अंकों का हो, तो दहाई का अंक आगे ले जाएं!'
        : '⚠️ When the product of deficits is 2 digits, carry the tens digit!'}
    </p>
  );
}

// ── L1_04 ─────────────────────────────────────────────────────────────────────

const L1_04_CONTENT = (
  <>
    <SutraBox sutra="Nikhilam Navatashcaramam Dashatah" meaning={{ en: 'All from 9 and the last from 10', hi: 'सब 9 से और अंतिम 10 से' }} />

    <SectionTitle>{{ en: 'The Technique — Near Base 100', hi: 'तकनीक — आधार 100 के निकट' }}</SectionTitle>
    <StepBox number={1}
      text={{ en: 'Find the deficit of each number from 100', hi: 'प्रत्येक संख्या की 100 से कमी ज्ञात करें' }}
      example="97 → deficit = 100−97 = 3  |  96 → deficit = 100−96 = 4" />
    <StepBox number={2}
      text={{ en: 'Cross subtract (either way gives same result)', hi: 'तिरछा घटाव (किसी भी तरह से समान परिणाम)' }}
      example={{ en: '97 − 4 = 93 → LEFT part', hi: '97 − 4 = 93 → बायां भाग' }} />
    <StepBox number={3}
      text={{ en: 'Multiply the deficits', hi: 'कमियों को गुणा करें' }}
      example={{ en: '3 × 4 = 12 → RIGHT part (must be 2 digits)', hi: '3 × 4 = 12 → दायां भाग (2 अंकों का होना चाहिए)' }} />
    <StepBox number={4}
      text={{ en: 'Combine LEFT | RIGHT', hi: 'बायां | दायां जोड़ें' }}
      example={{ en: '93 | 12 → Answer: 9312', hi: '93 | 12 → उत्तर: 9312' }} />

    <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '14px 16px', marginBottom: 20 }}>
      <L1_04_Warning />
    </div>

    <SectionTitle>{{ en: 'Worked Examples', hi: 'हल किए गए उदाहरण' }}</SectionTitle>
    <ExampleCard
      title={{ en: 'Example 1: 97 × 96', hi: 'उदाहरण 1: 97 × 96' }}
      lines={[{ en: 'Deficits: 3, 4', hi: 'कमियाँ: 3, 4' }, { en: 'Cross: 97 − 4 = 93', hi: 'तिरछा: 97 − 4 = 93' }, { en: 'Product: 3 × 4 = 12', hi: 'गुणनफल: 3 × 4 = 12' }]}
      breakdown={[{ label: { en: 'Left', hi: 'बायां' }, value: '93' }, { label: { en: 'Right', hi: 'दायां' }, value: '12' }]}
      result="97 × 96 = 9312 ✓"
    />
    <ExampleCard
      title={{ en: 'Example 2: 98 × 97', hi: 'उदाहरण 2: 98 × 97' }}
      lines={[{ en: 'Deficits: 2, 3', hi: 'कमियाँ: 2, 3' }, { en: 'Cross: 98 − 3 = 95', hi: 'तिरछा: 98 − 3 = 95' }, { en: 'Product: 2 × 3 = 06 (pad zero!)', hi: 'गुणनफल: 2 × 3 = 06 (शून्य लगाएं!)' }]}
      breakdown={[{ label: { en: 'Left', hi: 'बायां' }, value: '95' }, { label: { en: 'Right', hi: 'दायां' }, value: '06' }]}
      result="98 × 97 = 9506 ✓"
    />
    <ExampleCard
      title={{ en: 'Example 3: 95 × 94', hi: 'उदाहरण 3: 95 × 94' }}
      lines={[{ en: 'Deficits: 5, 6', hi: 'कमियाँ: 5, 6' }, { en: 'Cross: 95 − 6 = 89', hi: 'तिरछा: 95 − 6 = 89' }, { en: 'Product: 5 × 6 = 30', hi: 'गुणनफल: 5 × 6 = 30' }]}
      breakdown={[{ label: { en: 'Left', hi: 'बायां' }, value: '89' }, { label: { en: 'Right', hi: 'दायां' }, value: '30' }]}
      result="95 × 94 = 8930 ✓"
    />
  </>
);

function L1_04_Warning() {
  const { language } = useLanguage();
  if (language === 'hi') {
    return (
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
        ⚠️ <strong>दायां भाग हमेशा 2 अंकों का होना चाहिए</strong> (क्योंकि आधार = 100)।<br />
        यदि कमियों का गुणनफल 10 से कम है, तो शून्य लगाएं! उदाहरण: 3 × 2 = 6 → लिखें <strong>06</strong>.
      </p>
    );
  }
  return (
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
      ⚠️ <strong>The RIGHT part must always have 2 digits</strong> (since base = 100).<br />
      If product of deficits &lt; 10, pad with a zero! Example: 3 × 2 = 6 → write as <strong>06</strong>.
    </p>
  );
}

// ── L1_05 ─────────────────────────────────────────────────────────────────────

const L1_05_CONTENT = (
  <>
    <SutraBox sutra="Nikhilam Navatashcaramam Dashatah" meaning={{ en: 'All from 9 and the last from 10', hi: 'सब 9 से और अंतिम 10 से' }} />

    <SectionTitle>{{ en: 'The Technique — Near Base 1000', hi: 'तकनीक — आधार 1000 के निकट' }}</SectionTitle>
    <StepBox number={1}
      text={{ en: 'Find the deficit of each number from 1000', hi: 'प्रत्येक संख्या की 1000 से कमी ज्ञात करें' }}
      example="998 → deficit = 2  |  997 → deficit = 3" />
    <StepBox number={2}
      text={{ en: 'Cross subtract', hi: 'तिरछा घटाव' }}
      example={{ en: '998 − 3 = 995 → LEFT part', hi: '998 − 3 = 995 → बायां भाग' }} />
    <StepBox number={3}
      text={{ en: 'Multiply the deficits — RIGHT part must be 3 digits', hi: 'कमियों को गुणा करें — दायां भाग 3 अंकों का होना चाहिए' }}
      example={{ en: '2 × 3 = 6 → write as 006', hi: '2 × 3 = 6 → 006 लिखें' }} />
    <StepBox number={4}
      text={{ en: 'Combine LEFT | RIGHT', hi: 'बायां | दायां जोड़ें' }}
      example={{ en: '995 | 006 → Answer: 995006', hi: '995 | 006 → उत्तर: 995006' }} />

    <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '14px 16px', marginBottom: 20 }}>
      <L1_05_Warning />
    </div>

    <SectionTitle>{{ en: 'Worked Examples', hi: 'हल किए गए उदाहरण' }}</SectionTitle>
    <ExampleCard
      title={{ en: 'Example 1: 998 × 997', hi: 'उदाहरण 1: 998 × 997' }}
      lines={[{ en: 'Deficits: 2, 3', hi: 'कमियाँ: 2, 3' }, { en: 'Cross: 998 − 3 = 995', hi: 'तिरछा: 998 − 3 = 995' }, { en: 'Product: 2 × 3 = 6 → 006', hi: 'गुणनफल: 2 × 3 = 6 → 006' }]}
      breakdown={[{ label: { en: 'Left', hi: 'बायां' }, value: '995' }, { label: { en: 'Right', hi: 'दायां' }, value: '006' }]}
      result="998 × 997 = 995006 ✓"
    />
    <ExampleCard
      title={{ en: 'Example 2: 996 × 994', hi: 'उदाहरण 2: 996 × 994' }}
      lines={[{ en: 'Deficits: 4, 6', hi: 'कमियाँ: 4, 6' }, { en: 'Cross: 996 − 6 = 990', hi: 'तिरछा: 996 − 6 = 990' }, { en: 'Product: 4 × 6 = 24 → 024', hi: 'गुणनफल: 4 × 6 = 24 → 024' }]}
      breakdown={[{ label: { en: 'Left', hi: 'बायां' }, value: '990' }, { label: { en: 'Right', hi: 'दायां' }, value: '024' }]}
      result="996 × 994 = 990024 ✓"
    />
    <ExampleCard
      title={{ en: 'Example 3: 999 × 998', hi: 'उदाहरण 3: 999 × 998' }}
      lines={[{ en: 'Deficits: 1, 2', hi: 'कमियाँ: 1, 2' }, { en: 'Cross: 999 − 2 = 997', hi: 'तिरछा: 999 − 2 = 997' }, { en: 'Product: 1 × 2 = 2 → 002', hi: 'गुणनफल: 1 × 2 = 2 → 002' }]}
      breakdown={[{ label: { en: 'Left', hi: 'बायां' }, value: '997' }, { label: { en: 'Right', hi: 'दायां' }, value: '002' }]}
      result="999 × 998 = 997002 ✓"
    />

    <SectionTitle>{{ en: 'Comparison Across All Bases', hi: 'सभी आधारों की तुलना' }}</SectionTitle>
    <L1_05_ComparisonTable />
  </>
);

function L1_05_Warning() {
  const { language } = useLanguage();
  if (language === 'hi') {
    return (
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
        ⚠️ <strong>दायां भाग हमेशा 3 अंकों का होना चाहिए!</strong><br />
        शून्य लगाएं: 6 → 006 · 24 → 024 · 100+ बायें भाग में जुड़ जाता है।
      </p>
    );
  }
  return (
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
      ⚠️ <strong>The RIGHT part must always have 3 digits!</strong><br />
      Pad with zeros: 6 → 006 · 24 → 024 · 100+ carries over to left part.
    </p>
  );
}

function L1_05_ComparisonTable() {
  const { language } = useLanguage();
  const headers = language === 'hi'
    ? ['आधार', 'कमी अंक', 'दायां भाग अंक', 'उदाहरण']
    : ['Base', 'Deficit digits', 'Right part digits', 'Example'];
  const rows = language === 'hi'
    ? [
        { base: '10', def: '1 अंक', right: '1 अंक', ex: '8×7 = 56' },
        { base: '100', def: '2 अंक', right: '2 अंक', ex: '97×96 = 9312' },
        { base: '1000', def: '3 अंक', right: '3 अंक', ex: '998×997 = 995006' },
      ]
    : [
        { base: '10', def: '1 digit', right: '1 digit', ex: '8×7 = 56' },
        { base: '100', def: '2 digits', right: '2 digits', ex: '97×96 = 9312' },
        { base: '1000', def: '3 digits', right: '3 digits', ex: '998×997 = 995006' },
      ];
  return (
    <div style={{ background: 'white', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: 16, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#F0F4FF' }}>
            {headers.map(h => (
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#0A1628', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.base} style={{ borderTop: '1px solid rgba(30,64,175,0.08)', background: i % 2 ? 'rgba(30,64,175,0.02)' : 'white' }}>
              <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#1E40AF' }}>{r.base}</td>
              <td style={{ padding: '10px 12px', color: '#4B5563' }}>{r.def}</td>
              <td style={{ padding: '10px 12px', color: '#4B5563' }}>{r.right}</td>
              <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: '#0A1628' }}>{r.ex}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── L1_06 ─────────────────────────────────────────────────────────────────────

const L1_06_CONTENT = (
  <>
    <SutraBox sutra="Ekadhikena Purvena" meaning={{ en: 'By one more than the previous one', hi: 'पिछले से एक अधिक' }} />

    <SectionTitle>{{ en: 'The Digit Sum Technique', hi: 'अंक योग तकनीक' }}</SectionTitle>
    <StepBox number={1}
      text={{ en: 'Add all digits of a number together', hi: 'किसी संख्या के सभी अंकों को जोड़ें' }}
      example={{ en: '4567 → 4+5+6+7 = 22 → 2+2 = 4  (keep adding until single digit)', hi: '4567 → 4+5+6+7 = 22 → 2+2 = 4  (एक अंक तक जोड़ते रहें)' }} />
    <StepBox number={2} text={{ en: 'By convention, if you get 9, treat the digit sum as 0', hi: 'परंपरा अनुसार, यदि उत्तर 9 आए, तो अंक योग को 0 मानें' }} />
    <StepBox number={3}
      text={{ en: 'Use digit sums to CHECK multiplication', hi: 'गुणन की जांच के लिए अंक योग का उपयोग करें' }}
      example="23 × 14 = 322 → DS(23)=5, DS(14)=5, 5×5=25→7. DS(322)=7 ✓" />

    <SectionTitle>{{ en: 'Worked Examples', hi: 'हल किए गए उदाहरण' }}</SectionTitle>
    <ExampleCard
      title={{ en: 'Example 1: Digit sum of 9999', hi: 'उदाहरण 1: 9999 का अंक योग' }}
      lines={['9+9+9+9 = 36 → 3+6 = 9 → by convention, treat as 0']}
      result={{ en: 'Digit sum = 0 (since 9999 is divisible by 9)', hi: 'अंक योग = 0 (क्योंकि 9999, 9 से विभाज्य है)' }}
    />
    <ExampleCard
      title={{ en: 'Example 2: Verify 37 × 23 = 851', hi: 'उदाहरण 2: 37 × 23 = 851 की जांच करें' }}
      lines={['DS(37) = 10 → 1', 'DS(23) = 5', '1 × 5 = 5', 'DS(851) = 14 → 5 ✓']}
      result={{ en: '37 × 23 = 851 ✓ Correct!', hi: '37 × 23 = 851 ✓ सही!' }}
    />
    <ExampleCard
      title={{ en: 'Example 3: Spot the error: 47 × 32 = 1513', hi: 'उदाहरण 3: त्रुटि पहचानें: 47 × 32 = 1513' }}
      lines={['DS(47) = 11 → 2', 'DS(32) = 5', '2 × 5 = 10 → 1', { en: 'DS(1513) = 10 → 1 ✓ (digit sums match!)', hi: 'DS(1513) = 10 → 1 ✓ (अंक योग मिलते हैं!)' }]}
    />
    <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 12, padding: '14px 18px' }}>
      <L1_06_Warning />
    </div>
  </>
);

function L1_06_Warning() {
  const { language } = useLanguage();
  if (language === 'hi') {
    return (
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
        ⚠️ <strong>महत्वपूर्ण:</strong> अंक योग जांच अधिकतर त्रुटियां पकड़ती है, लेकिन सभी नहीं। हमेशा उन उत्तरों को दोबारा जांचें जो बहुत साफ लगते हों।
        (वास्तविक उत्तर: 47 × 32 = 1504, 1513 नहीं।)
      </p>
    );
  }
  return (
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
      ⚠️ <strong>Important:</strong> The digit sum check catches most errors but not all. Always double-check answers that seem too clean.
      (Actual answer: 47 × 32 = 1504, not 1513.)
    </p>
  );
}

// ── L1_07 ─────────────────────────────────────────────────────────────────────

const L1_07_CONTENT = (
  <>
    <SutraBox sutra="Urdhva-Tiryagbhyam" meaning={{ en: 'Vertically and Crosswise', hi: 'ऊर्ध्वाधर और तिरछा' }} />

    <SectionTitle>{{ en: 'The Method for AB × CD', hi: 'AB × CD के लिए विधि' }}</SectionTitle>
    <StepBox number={1}
      text={{ en: 'Rightmost — Multiply last digits: B × D', hi: 'सबसे दायें — अंतिम अंक गुणा करें: B × D' }}
      example={{ en: 'This gives the UNITS digit (carry if ≥ 10)', hi: 'यह इकाई अंक देता है (≥ 10 हो तो आगे ले जाएं)' }} />
    <StepBox number={2}
      text={{ en: 'Cross — Multiply and add: A×D + B×C, add any carry', hi: 'तिरछा — गुणा और जोड़ें: A×D + B×C, साथ में कोई कैरी' }}
      example={{ en: 'This gives the TENS digit', hi: 'यह दहाई अंक देता है' }} />
    <StepBox number={3}
      text={{ en: 'Leftmost — Multiply first digits: A × C, add any carry', hi: 'सबसे बायें — पहले अंक गुणा करें: A × C, साथ में कोई कैरी' }}
      example={{ en: 'This gives the HUNDREDS digit', hi: 'यह सैंकड़ा अंक देता है' }} />

    {/* Visual diagram */}
    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginBottom: 20, fontFamily: 'var(--font-mono)', fontSize: 14, color: '#1E40AF', lineHeight: 2 }}>
      <div>{'  A  B'}</div>
      <div>{'× C  D'}</div>
      <L1_07_Diagram />
    </div>

    <SectionTitle>{{ en: 'Worked Examples', hi: 'हल किए गए उदाहरण' }}</SectionTitle>
    <ExampleCard
      title={{ en: 'Example 1: 12 × 13', hi: 'उदाहरण 1: 12 × 13' }}
      lines={[
        { en: 'Step 1: 2×3 = 6 (units)', hi: 'चरण 1: 2×3 = 6 (इकाई)' },
        { en: 'Step 2: 1×3 + 2×1 = 3+2 = 5 (tens)', hi: 'चरण 2: 1×3 + 2×1 = 3+2 = 5 (दहाई)' },
        { en: 'Step 3: 1×1 = 1 (hundreds)', hi: 'चरण 3: 1×1 = 1 (सैंकड़ा)' },
      ]}
      breakdown={[{ label: { en: 'Hundreds', hi: 'सैंकड़ा' }, value: '1' }, { label: { en: 'Tens', hi: 'दहाई' }, value: '5' }, { label: { en: 'Units', hi: 'इकाई' }, value: '6' }]}
      result="12 × 13 = 156 ✓"
    />
    <ExampleCard
      title={{ en: 'Example 2: 23 × 32', hi: 'उदाहरण 2: 23 × 32' }}
      lines={[
        { en: 'Step 1: 3×2 = 6 (units)', hi: 'चरण 1: 3×2 = 6 (इकाई)' },
        { en: 'Step 2: 2×2 + 3×3 = 4+9 = 13 → write 3, carry 1 (tens)', hi: 'चरण 2: 2×2 + 3×3 = 4+9 = 13 → 3 लिखें, 1 आगे ले जाएं (दहाई)' },
        { en: 'Step 3: 2×3 = 6 + carry 1 = 7   ← the carry changed this to 7, not 6! (hundreds)', hi: 'चरण 3: 2×3 = 6 + कैरी 1 = 7   ← कैरी ने इसे 7 बना दिया, 6 नहीं! (सैंकड़ा)' },
      ]}
      breakdown={[{ label: { en: 'Hundreds', hi: 'सैंकड़ा' }, value: '7' }, { label: { en: 'Tens', hi: 'दहाई' }, value: '3' }, { label: { en: 'Units', hi: 'इकाई' }, value: '6' }]}
      result="23 × 32 = 736 ✓"
    />
    <ExampleCard
      title={{ en: 'Example 3: 47 × 63', hi: 'उदाहरण 3: 47 × 63' }}
      lines={[
        { en: 'Step 1: 7×3 = 21 → write 1, carry 2 (units)', hi: 'चरण 1: 7×3 = 21 → 1 लिखें, 2 आगे ले जाएं (इकाई)' },
        { en: 'Step 2: 4×3 + 7×6 = 12+42 = 54 + carry 2 = 56 → write 6, carry 5 (tens)', hi: 'चरण 2: 4×3 + 7×6 = 12+42 = 54 + कैरी 2 = 56 → 6 लिखें, 5 आगे ले जाएं (दहाई)' },
        { en: 'Step 3: 4×6 = 24 + carry 5 = 29   ← this multi-digit value IS the hundreds+ part, written as-is', hi: 'चरण 3: 4×6 = 24 + कैरी 5 = 29   ← यह बहु-अंकीय मान ही सैंकड़ा+ भाग है, ऐसे ही लिखें' },
      ]}
      breakdown={[{ label: { en: 'Hundreds+', hi: 'सैंकड़ा+' }, value: '29' }, { label: { en: 'Tens', hi: 'दहाई' }, value: '6' }, { label: { en: 'Units', hi: 'इकाई' }, value: '1' }]}
      result="47 × 63 = 2961 ✓"
    />
  </>
);

function L1_07_Diagram() {
  const { language } = useLanguage();
  if (language === 'hi') {
    return (
      <>
        <div style={{ borderTop: '1px solid #93C5FD', paddingTop: 8, marginTop: 4 }}>{'चरण 1:  B×D   ↕  (इकाई)'}</div>
        <div>{'चरण 2:  A×D + B×C  (दहाई)'}</div>
        <div>{'चरण 3:  A×C   ↕  (सैंकड़ा)'}</div>
      </>
    );
  }
  return (
    <>
      <div style={{ borderTop: '1px solid #93C5FD', paddingTop: 8, marginTop: 4 }}>{'Step 1:  B×D   ↕  (units)'}</div>
      <div>{'Step 2:  A×D + B×C  (tens)'}</div>
      <div>{'Step 3:  A×C   ↕  (hundreds)'}</div>
    </>
  );
}

// ── L1_08 ─────────────────────────────────────────────────────────────────────

const L1_08_CONTENT = (
  <>
    <SutraBox sutra="Urdhva-Tiryagbhyam" meaning={{ en: 'Vertically and Crosswise', hi: 'ऊर्ध्वाधर और तिरछा' }} />

    <SectionTitle>{{ en: 'Multiply by 11 — The Magic Rule', hi: '11 से गुणा करें — जादुई नियम' }}</SectionTitle>
    <StepBox number={1} text={{ en: 'Write the FIRST digit of the number', hi: 'संख्या का पहला अंक लिखें' }} />
    <StepBox number={2} text={{ en: 'Write the SUM of each adjacent pair of digits (carry if sum ≥ 10)', hi: 'प्रत्येक सटे हुए अंकों के जोड़ को लिखें (योग ≥ 10 हो तो आगे ले जाएं)' }} />
    <StepBox number={3} text={{ en: 'Write the LAST digit of the number', hi: 'संख्या का अंतिम अंक लिखें' }} />

    <SectionTitle>{{ en: 'Examples × 11', hi: 'उदाहरण × 11' }}</SectionTitle>
    <ExampleCard
      title={{ en: 'Example 1: 23 × 11', hi: 'उदाहरण 1: 23 × 11' }}
      lines={[{ en: 'First: 2', hi: 'पहला: 2' }, { en: 'Middle: 2+3 = 5', hi: 'मध्य: 2+3 = 5' }, { en: 'Last: 3', hi: 'अंतिम: 3' }]}
      breakdown={[{ label: { en: 'First', hi: 'पहला' }, value: '2' }, { label: { en: 'Middle', hi: 'मध्य' }, value: '5' }, { label: { en: 'Last', hi: 'अंतिम' }, value: '3' }]}
      result="23 × 11 = 253 ✓"
    />
    <ExampleCard
      title={{ en: 'Example 2: 67 × 11', hi: 'उदाहरण 2: 67 × 11' }}
      lines={[
        { en: 'First: 6', hi: 'पहला: 6' },
        { en: 'Middle: 6+7 = 13 → write 3, carry 1 → first digit becomes 6+1=7   ← this changes the FIRST digit!', hi: 'मध्य: 6+7 = 13 → 3 लिखें, 1 आगे ले जाएं → पहला अंक 6+1=7 बनता है   ← इससे पहला अंक बदल जाता है!' },
        { en: 'Last: 7', hi: 'अंतिम: 7' },
      ]}
      breakdown={[{ label: { en: 'First', hi: 'पहला' }, value: '7' }, { label: { en: 'Middle', hi: 'मध्य' }, value: '3' }, { label: { en: 'Last', hi: 'अंतिम' }, value: '7' }]}
      result="67 × 11 = 737 ✓"
    />
    <ExampleCard
      title={{ en: 'Example 3: 346 × 11', hi: 'उदाहरण 3: 346 × 11' }}
      lines={[
        { en: 'First: 3', hi: 'पहला: 3' },
        { en: '3+4 = 7   ← this is the FIRST middle digit (before any later carry)', hi: '3+4 = 7   ← यह पहला मध्य अंक है (आगे किसी कैरी से पहले)' },
        { en: '4+6 = 10 → write 0, carry 1 → previous 7 becomes 8', hi: '4+6 = 10 → 0 लिखें, 1 आगे ले जाएं → पिछला 7, 8 बनता है' },
        { en: 'Last: 6', hi: 'अंतिम: 6' },
      ]}
      breakdown={[{ label: { en: 'First', hi: 'पहला' }, value: '3' }, { label: { en: 'Mid 1', hi: 'मध्य 1' }, value: '8' }, { label: { en: 'Mid 2', hi: 'मध्य 2' }, value: '0' }, { label: { en: 'Last', hi: 'अंतिम' }, value: '6' }]}
      result="346 × 11 = 3806 ✓"
    />

    <SectionTitle>{{ en: 'Multiply by 12', hi: '12 से गुणा करें' }}</SectionTitle>
    <div style={{ background: '#F0F4FF', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
      <L1_08_Rule12 />
    </div>
  </>
);

function L1_08_Rule12() {
  const { language } = useLanguage();
  return (
    <>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', marginBottom: 8 }}>
        <strong>{language === 'hi' ? 'नियम:' : 'Rule:'}</strong>{' '}
        {language === 'hi'
          ? '12 से गुणा = 10 से गुणा, फिर संख्या का दोगुना जोड़ें।'
          : 'Multiplying by 12 = multiply by 10, then add double the number.'}
      </p>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1E40AF' }}>
        34 × 12 = (34 × 10) + (34 × 2) = 340 + 68 = 408
      </div>
    </>
  );
}

// ── L1_09 ─────────────────────────────────────────────────────────────────────

const L1_09_CONTENT = (
  <>
    <SutraBox sutra="Nikhilam Navatashcaramam Dashatah" meaning={{ en: 'All from 9 and the last from 10', hi: 'सब 9 से और अंतिम 10 से' }} />

    <SectionTitle>{{ en: 'Multiply by 9', hi: '9 से गुणा करें' }}</SectionTitle>
    <div style={{ background: '#F0F4FF', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: '16px 20px', marginBottom: 16 }}>
      <L1_09_Rule />
    </div>

    <SectionTitle>{{ en: 'Worked Examples', hi: 'हल किए गए उदाहरण' }}</SectionTitle>
    <ExampleCard
      title={{ en: 'Example 1: 7 × 9', hi: 'उदाहरण 1: 7 × 9' }}
      lines={[{ en: 'First digit = 7−1 = 6', hi: 'पहला अंक = 7−1 = 6' }, { en: 'Second digit = 10−7 = 3', hi: 'दूसरा अंक = 10−7 = 3' }]}
      result="7 × 9 = 63 ✓"
    />
    <ExampleCard
      title={{ en: 'Example 2: 23 × 9', hi: 'उदाहरण 2: 23 × 9' }}
      lines={['23 × 10 = 230', '230 − 23 = 207']}
      result="23 × 9 = 207 ✓"
    />
    <ExampleCard
      title={{ en: 'Example 3: 45 × 99', hi: 'उदाहरण 3: 45 × 99' }}
      lines={['45 × 100 = 4500', '4500 − 45 = 4455']}
      result="45 × 99 = 4455 ✓"
    />
    <ExampleCard
      title={{ en: 'Example 4: 12 × 999', hi: 'उदाहरण 4: 12 × 999' }}
      lines={['12 × 1000 = 12000', '12000 − 12 = 11988']}
      result="12 × 999 = 11988 ✓"
    />

    <SectionTitle>{{ en: 'The Pattern', hi: 'पैटर्न' }}</SectionTitle>
    <div style={{ display: 'grid', gap: 8 }}>
      {[
        { mul: '×9',    rule: 'n×10 − n' },
        { mul: '×99',   rule: 'n×100 − n' },
        { mul: '×999',  rule: 'n×1000 − n' },
        { mul: '×9999', rule: 'n×10000 − n' },
      ].map(r => (
        <div key={r.mul} style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#F0F4FF', borderRadius: 10, padding: '10px 16px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: '#1E40AF', minWidth: 60 }}>{r.mul}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: '#0A1628' }}>{r.rule}</span>
        </div>
      ))}
    </div>
    <L1_09_PatternNote />
  </>
);

function L1_09_Rule() {
  const { language } = useLanguage();
  if (language === 'hi') {
    return (
      <>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', marginBottom: 6 }}>
          <strong>नियम:</strong> n × 9 = n × (10−1) = n×10 − n
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', marginBottom: 0 }}>
          एक अंक की संख्याओं के लिए: n×9 का पहला अंक = (n−1), दूसरा अंक = (10−n)
        </p>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1E40AF', marginTop: 8 }}>
          7×9: पहला = 7−1 = 6, दूसरा = 10−7 = 3 → 63
        </div>
      </>
    );
  }
  return (
    <>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', marginBottom: 6 }}>
        <strong>Rule:</strong> n × 9 = n × (10−1) = n×10 − n
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', marginBottom: 0 }}>
        For single digits: n×9 gives first digit = (n−1), second digit = (10−n)
      </p>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1E40AF', marginTop: 8 }}>
        7×9: first = 7−1 = 6, second = 10−7 = 3 → 63
      </div>
    </>
  );
}

function L1_09_PatternNote() {
  const { language } = useLanguage();
  return (
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', marginTop: 12, fontStyle: 'italic' }}>
      {language === 'hi'
        ? 'पैटर्न: हमेशा 10 की एक घात ऊंची, फिर n घटाएं!'
        : 'Pattern: always one power of 10 higher, then subtract n!'}
    </p>
  );
}

// ── L1_10 ─────────────────────────────────────────────────────────────────────

function L1_10_CONTENT({ onSwitchTab }) {
  const { language } = useLanguage();
  const hi = language === 'hi';

  const checklistItems = hi
    ? ['✓ एकाधिकेन पूर्वेण (5 पर वर्ग)', '✓ निखिलम् (आधार के निकट गुणन)', '✓ ऊर्ध्व-तिर्यग्भ्याम् (2-अंक गुणन)', '✓ 11, 9, 99 से गुणा']
    : ['✓ Ekadhikena Purvena (squaring in 5s)', '✓ Nikhilam (near base multiplication)', '✓ Urdhva-Tiryagbhyam (2-digit multiplication)', '✓ Multiplication by 11, 9, 99'];

  const rulesItems = hi
    ? ['• 5 प्रश्न, बहुविकल्पीय', '• Level 2 अनलॉक करने के लिए 60% या अधिक स्कोर करें', '• आप जितनी बार चाहें दोबारा प्रयास कर सकते हैं', '• आपका सर्वश्रेष्ठ स्कोर सहेजा जाता है']
    : ['• 5 questions, multiple choice', '• Score 60% or above to unlock Level 2', '• You can retake as many times as needed', '• Your best score is saved'];

  const revisionItems = [
    { title: hi ? '5² नियम' : 'n5² rule', rule: 'n×(n+1) | 25' },
    { title: hi ? '×10 आधार' : '×10 base', rule: hi ? 'कमी×कमी=दायां\nतिरछा=बायां' : 'def×def=right\ncross=left' },
    { title: hi ? '×100 आधार' : '×100 base', rule: hi ? 'वही,\nदायां=2 अंक' : 'same,\nright=2 digits' },
    { title: hi ? '×11 नियम' : '×11 rule', rule: hi ? 'पहला | जोड़ | अंतिम' : 'first | sums | last' },
    { title: hi ? '×9 नियम' : '×9 rule', rule: 'n×10 − n' },
  ];

  return (
    <>
      {/* Assessment Info Card */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1628, #1E40AF)',
        borderRadius: 16, padding: 28, marginBottom: 24,
      }}>
        <h2 className="font-heading" style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 6 }}>
          🏆 {hi ? 'Level 1 मूल्यांकन' : 'Level 1 Assessment'}
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>
          {hi ? 'अपनी Beginner वैदिक गणित निपुणता का परीक्षण करें' : 'Test your Beginner Vedic Maths mastery'}
        </p>

        {/* 2×2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {checklistItems.map(t => (
            <div key={t} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>
              {t}
            </div>
          ))}
        </div>

        {/* Rules box */}
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          {rulesItems.map(r => (
            <p key={r} style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: '5px 0' }}>{r}</p>
          ))}
        </div>

        <button
          onClick={() => onSwitchTab && onSwitchTab('quiz')}
          style={{
            width: '100%', minHeight: 48, background: 'white', color: '#0A1628',
            border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)',
            fontWeight: 700, fontSize: 16, cursor: 'pointer',
          }}
        >
          {hi ? 'मूल्यांकन शुरू करें →' : 'Take the Assessment →'}
        </button>
      </div>

      {/* Quick Revision */}
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 14 }}>
        {hi ? 'त्वरित पुनरावृत्ति' : 'Quick Revision'}
      </h3>
      <style>{`@media(max-width:640px){.rev-row{overflow-x:auto!important;-webkit-overflow-scrolling:touch!important;}}`}</style>
      <div className="rev-row" style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
        {revisionItems.map(b => (
          <div key={b.title} style={{
            background: '#F0F4FF', borderRadius: 12, padding: 14, textAlign: 'center',
            minWidth: 140, flexShrink: 0,
          }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: '#0A1628', marginBottom: 6 }}>{b.title}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#3B82F6', whiteSpace: 'pre-line' }}>{b.rule}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── L2_01 ─────────────────────────────────────────────────────────────────────

const L2_01_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Paravartya Yojayet</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}>Transpose and apply</div>
    </div>

    <SectionTitle>The Technique</SectionTitle>
    <StepBox number={1} text="Write the divisor. Transpose (flip sign of) all digits except the first" example="Divisor 11 → first digit 1, transpose 1 → becomes −1  |  Divisor 12 → first digit 1, transpose 2 → becomes −2" />
    <StepBox number={2} text="Write the dividend. Draw a vertical line separating the last digit (remainder section)" />
    <StepBox number={3} text="Bring down the first digit of the dividend as the first quotient digit" />
    <StepBox number={4} text="Multiply that quotient digit by the transposed digits and add to the next dividend digit" />
    <StepBox number={5} text="Repeat until you reach the remainder section" />

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — 121 ÷ 11"
      lines={['Divisor 11: transposed digit = −1', 'Dividend: 12 | 1', 'Bring down 1 → Q digit = 1', '1 × (−1) = −1 → 2 + (−1) = 1 → next Q digit = 1', 'Remainder: 1 × (−1) = −1 → 1 + (−1) = 0']}
      result="121 ÷ 11 = 11 ✓"
    />
    <ExampleCard
      title="Example 2 — 234 ÷ 12"
      lines={['Divisor 12: transposed digit = −2', 'Bring down 2 → Q digit = 1', '1 × (−2) = −2 → 3 + (−2) = 1 → next digit... ', 'Net result: 12 × 19 = 228, remainder = 234 − 228 = 6']}
      result="234 ÷ 12 = 19 remainder 6 ✓"
    />
    <ExampleCard
      title="Example 3 — 156 ÷ 13"
      lines={['Divisor 13: transposed digit = −3', '13 × 12 = 156 → no remainder']}
      result="156 ÷ 13 = 12 ✓"
    />

    <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '14px 16px', marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
        💡 Paravartya works best when the divisor is close to a power of 10 (like 11, 12, 13, 21, 99, 101). For exam purposes, focus on divisors 11–19 where it's fastest.
      </p>
    </div>
  </>
);

// ── L2_02 ─────────────────────────────────────────────────────────────────────

const L2_02_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Urdhva-Tiryagbhyam</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}>Vertically and Crosswise</div>
    </div>

    <SectionTitle>Technique — ABC × DEF (3-digit × 3-digit)</SectionTitle>
    <StepBox number={1} text="Units: C × F" example="Write units digit, carry tens" />
    <StepBox number={2} text="Tens: B×F + C×E" example="Add carry from Step 1. Write units digit, carry rest" />
    <StepBox number={3} text="Hundreds: A×F + B×E + C×D" example="Add carry from Step 2. Write units digit, carry rest" />
    <StepBox number={4} text="Thousands: A×E + B×D" example="Add carry from Step 3. Write units digit, carry rest" />
    <StepBox number={5} text="Ten-thousands: A×D" example="Add carry from Step 4" />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#0A1628', lineHeight: 2.2 }}>
        <div>Step 1: · · C  ×  · · F</div>
        <div>Step 2: · B C  ×  · E F</div>
        <div>Step 3: A B C  ×  D E F</div>
        <div>Step 4: A B ·  ×  D E ·</div>
        <div>Step 5: A · ·  ×  D · ·</div>
      </div>
    </div>

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — 112 × 111"
      lines={['Step 1: 2×1 = 2', 'Step 2: 1×1 + 2×1 = 3', 'Step 3: 1×1 + 1×1 + 2×1 = 4', 'Step 4: 1×1 + 1×1 = 2', 'Step 5: 1×1 = 1']}
      result="112 × 111 = 12432 ✓"
    />
    <ExampleCard
      title="Example 2 — 123 × 321"
      lines={['Step 1: 3×1 = 3', 'Step 2: 2×1 + 3×2 = 8', 'Step 3: 1×1 + 2×2 + 3×3 = 14 → write 4, carry 1', 'Step 4: 1×2 + 2×3 = 8 + carry 1 = 9', 'Step 5: 1×3 = 3']}
      result="123 × 321 = 39483 ✓"
    />
    <ExampleCard
      title="Example 3 — 204 × 103"
      lines={['Step 1: 4×3 = 12 → write 2, carry 1', 'Step 2: 0×3 + 4×0 = 0 + carry 1 = 1', 'Step 3: 2×3 + 0×0 + 4×1 = 10 → write 0, carry 1', 'Step 4: 2×0 + 0×1 = 0 + carry 1 = 1', 'Step 5: 2×1 = 2']}
      result="204 × 103 = 21012 ✓"
    />
  </>
);

// ── L2_03 ─────────────────────────────────────────────────────────────────────

const L2_03_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Yavadunam</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}>Whatever the extent of deficiency</div>
    </div>

    <SectionTitle>Method 1 — Near Base 50</SectionTitle>
    <StepBox number={1} text="Find difference from 50: d = n − 50" />
    <StepBox number={2} text="First part: 25 + d" />
    <StepBox number={3} text="Second part: d² (must be 2 digits — pad if needed)" />
    <StepBox number={4} text="Combine first part | second part" />

    <SectionTitle>Method 2 — Duplex (any 2-digit number AB)</SectionTitle>
    <StepBox number={1} text="(AB)² = A² | 2×A×B | B²" example="Compute each piece, then add with carries right to left" />

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — 47² (near 50)"
      lines={['d = 47 − 50 = −3', 'First part: 25 + (−3) = 22', 'Second part: (−3)² = 9 → 09']}
      result="47² = 2209 ✓"
    />
    <ExampleCard
      title="Example 2 — 53² (near 50)"
      lines={['d = 53 − 50 = 3', 'First part: 25 + 3 = 28', 'Second part: 3² = 9 → 09']}
      result="53² = 2809 ✓"
    />
    <ExampleCard
      title="Example 3 — 38² (duplex method)"
      lines={['3² | 2×3×8 | 8²', '9 | 48 | 64', '64 → write 4, carry 6', '48 + 6 = 54 → write 4, carry 5', '9 + 5 = 14']}
      result="38² = 1444 ✓"
    />

    <SectionTitle>Which Method to Use?</SectionTitle>
    <div style={{ background: 'white', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: 16, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#F0F4FF' }}>
            {['Range', 'Best Method'].map(h => (
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#0A1628' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { range: 'Near 50 (40–60)', method: 'Base-50 method' },
            { range: 'Near 100 (90–99)', method: 'Nikhilam (Level 1)' },
            { range: 'Ends in 5', method: 'Ekadhikena (Level 1)' },
            { range: 'Any 2-digit', method: 'Duplex: A²|2AB|B²' },
          ].map((r, i) => (
            <tr key={r.range} style={{ borderTop: '1px solid rgba(30,64,175,0.08)', background: i % 2 ? 'rgba(30,64,175,0.02)' : 'white' }}>
              <td style={{ padding: '10px 12px', color: '#4B5563' }}>{r.range}</td>
              <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: '#0A1628' }}>{r.method}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

// ── L2_04 ─────────────────────────────────────────────────────────────────────

const L2_04_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Anurupyena</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}>Proportionality</div>
    </div>

    <SectionTitle>The Technique — Cubing AB</SectionTitle>
    <StepBox number={1} text="Write A³ (cube of first digit)" />
    <StepBox number={2} text="Write 3 × A² × B" />
    <StepBox number={3} text="Write 3 × A × B²" />
    <StepBox number={4} text="Write B³" />
    <StepBox number={5} text="Add with carries from right to left" example="Pattern: a³ | 3a²b | 3ab² | b³  (same as (a+b)³ expansion)" />

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — 12³"
      lines={['a=1, b=2', 'Row: 1 | 3×1×2=6 | 3×1×4=12 | 8', '8 → 8', '12 → write 2, carry 1', '6 + 1 = 7', '1 stays']}
      result="12³ = 1728 ✓"
    />
    <ExampleCard
      title="Example 2 — 23³"
      lines={['a=2, b=3', 'Row: 8 | 3×4×3=36 | 3×2×9=54 | 27', '27 → write 7, carry 2', '54 + 2 = 56 → write 6, carry 5', '36 + 5 = 41 → write 1, carry 4', '8 + 4 = 12']}
      result="23³ = 12167 ✓"
    />
    <ExampleCard
      title="Example 3 — 11³"
      lines={['a=1, b=1', 'Row: 1 | 3 | 3 | 1', 'No carries needed']}
      result="11³ = 1331 ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0, lineHeight: 1.7 }}>
        💡 The pattern <strong>a³ | 3a²b | 3ab² | b³</strong> comes directly from the algebraic expansion of (a+b)³. Vedic Maths uses the same algebra — just faster!
      </p>
    </div>
  </>
);

// ── L2_05 ─────────────────────────────────────────────────────────────────────

const L2_05_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Vilokanam</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}>Mere observation</div>
    </div>

    <SectionTitle>The Technique — Perfect Square Roots</SectionTitle>
    <StepBox number={1} text="Split the number into pairs from the RIGHT" example="1764 → 17 | 64" />
    <StepBox number={2} text="Find the largest integer whose square ≤ the left pair" example="17: largest n where n² ≤ 17 → n=4 (4²=16). This is the FIRST digit." />
    <StepBox number={3} text="Look at the LAST digit of the number to find possible last digits of the answer" />
    <StepBox number={4} text="Check which option is correct by squaring" example="For 1764: first digit=4, last digit 4 → ends in 2 or 8. Test 42: 42²=1764 ✓" />

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — √1764"
      lines={['Pairs: 17 | 64', 'First digit: 4 (4²=16 ≤ 17)', 'Last digit of 1764 = 4 → answer ends in 2 or 8', 'Test 42: 42² = 1764 ✓']}
      result="√1764 = 42 ✓"
    />
    <ExampleCard
      title="Example 2 — √5625"
      lines={['Pairs: 56 | 25', 'First digit: 7 (7²=49 ≤ 56, 8²=64 > 56)', 'Last digit 5 → answer ends in 5', 'Answer: 75 → 75² = 5625 ✓']}
      result="√5625 = 75 ✓"
    />
    <ExampleCard
      title="Example 3 — √9801"
      lines={['Pairs: 98 | 01', 'First digit: 9 (9²=81 ≤ 98)', 'Last digit 1 → ends in 1 or 9', 'Test 99: 99² = 9801 ✓']}
      result="√9801 = 99 ✓"
    />

    <SectionTitle>Last Digit Reference Table</SectionTitle>
    <div style={{ background: 'white', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: 16 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#F0F4FF' }}>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#0A1628' }}>Number ends in</th>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#0A1628' }}>Square root ends in</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['0', '0'], ['1', '1 or 9'], ['4', '2 or 8'],
            ['5', '5'], ['6', '4 or 6'], ['9', '3 or 7'],
          ].map(([num, root], i) => (
            <tr key={num} style={{ borderTop: '1px solid rgba(30,64,175,0.08)', background: i % 2 ? 'rgba(30,64,175,0.02)' : 'white' }}>
              <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#1E40AF' }}>{num}</td>
              <td style={{ padding: '10px 12px', color: '#0A1628' }}>{root}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

// ── L2_06 ─────────────────────────────────────────────────────────────────────

const L2_06_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Vilokanam</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}>Mere observation</div>
    </div>

    <SectionTitle>The Technique — Perfect Cube Roots</SectionTitle>
    <StepBox number={1} text="Split into groups of 3 from the RIGHT" example="17576 → 17 | 576" />
    <StepBox number={2} text="Find cube root of the LEFT group" example="17: 2³=8, 3³=27. Since 8 ≤ 17 < 27, first digit = 2" />
    <StepBox number={3} text="Look at the LAST digit of the number to find the cube root's last digit (unique — no ambiguity!)" />
    <StepBox number={4} text="Combine: first digit + last digit = answer" />

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — ∛17576"
      lines={['Groups: 17 | 576', 'First digit: 2 (2³=8 ≤ 17 < 27=3³)', 'Last digit of 17576 = 6 → cube root ends in 6', 'Answer: 26 → 26³ = 17576 ✓']}
      result="∛17576 = 26 ✓"
    />
    <ExampleCard
      title="Example 2 — ∛74088"
      lines={['Groups: 74 | 088', 'First digit: 4 (4³=64 ≤ 74 < 125=5³)', 'Last digit 8 → cube root ends in 2', 'Answer: 42 → 42³ = 74088 ✓']}
      result="∛74088 = 42 ✓"
    />
    <ExampleCard
      title="Example 3 — ∛19683"
      lines={['Groups: 19 | 683', 'First digit: 2 (2³=8 ≤ 19 < 27=3³)', 'Last digit 3 → cube root ends in 7', 'Answer: 27 → 27³ = 19683 ✓']}
      result="∛19683 = 27 ✓"
    />

    <SectionTitle>Cube Last Digit Reference Table</SectionTitle>
    <div style={{ background: 'white', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: 16 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#F0F4FF' }}>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#0A1628' }}>Number ends in</th>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#0A1628' }}>Cube root ends in</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['1','1'],['2','8'],['3','7'],['4','4'],['5','5'],
            ['6','6'],['7','3'],['8','2'],['9','9'],['0','0'],
          ].map(([num, root], i) => (
            <tr key={num} style={{ borderTop: '1px solid rgba(30,64,175,0.08)', background: i % 2 ? 'rgba(30,64,175,0.02)' : 'white' }}>
              <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#1E40AF' }}>{num}</td>
              <td style={{ padding: '10px 12px', color: '#0A1628' }}>{root}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', marginTop: 12, marginBottom: 0, fontStyle: 'italic' }}>
        Unlike square roots, each cube root last digit is <strong>unique</strong> — no ambiguity! This makes cube roots even faster.
      </p>
    </div>
  </>
);

// ── L2_07 ─────────────────────────────────────────────────────────────────────

const L2_07_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Gunita Samuchyah</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}>The product of the sum equals the sum of the product</div>
    </div>

    <SectionTitle>The Technique — Digit Sum Verification</SectionTitle>
    <StepBox number={1} text="Find digit sum of each input number" example="Keep adding digits until single digit" />
    <StepBox number={2} text="Perform the same operation on the digit sums" />
    <StepBox number={3} text="Find digit sum of your answer" />
    <StepBox number={4} text="If they match — answer is probably correct! If they don't match — answer is definitely wrong!" />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 8 }}>Special Rules</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', lineHeight: 1.8 }}>
        • If digit sum is 9, treat as 0 for multiplication (9 × anything = 9, but use 0 for verification)<br />
        • This method catches ~89% of errors instantly<br />
        • Cannot catch transposition errors (e.g. 1234 vs 1243 have same digit sum)
      </div>
    </div>

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — Verify 236 × 47 = 11092"
      lines={['DS(236) = 2+3+6 = 11 → 2', 'DS(47) = 4+7 = 11 → 2', '2 × 2 = 4', 'DS(11092) = 1+1+0+9+2 = 13 → 4 ✓']}
      result="Answer is likely correct ✓"
    />
    <ExampleCard
      title="Example 2 — Spot error: 158 × 43 = 6784 (wrong!)"
      lines={['DS(158) = 14 → 5', 'DS(43) = 7', '5 × 7 = 35 → 8', 'DS(6784) = 25 → 7', '8 ≠ 7 → Answer is WRONG! Correct: 158 × 43 = 6794']}
      result="Error detected! ✗"
    />
    <ExampleCard
      title="Example 3 — Verify 4567 + 3891 = 8458"
      lines={['DS(4567) = 22 → 4', 'DS(3891) = 21 → 3', '4 + 3 = 7', 'DS(8458) = 25 → 7 ✓']}
      result="Addition verified ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 8 }}>When to use digit sum verification:</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', lineHeight: 1.8 }}>
        • After any multiplication in exams — takes 5 seconds<br />
        • Checking addition of long columns<br />
        • Verifying division: dividend = quotient × divisor + remainder
      </div>
    </div>
  </>
);

// ── L2_08 ─────────────────────────────────────────────────────────────────────

const L2_08_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Anurupyena</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}>Proportionality</div>
    </div>

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 8 }}>The Core Insight</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1E40AF', lineHeight: 2 }}>
        <div>5 = 10÷2 → ×5 = ×10 then ÷2</div>
        <div>25 = 100÷4 → ×25 = ×100 then ÷4</div>
        <div>125 = 1000÷8 → ×125 = ×1000 then ÷8</div>
      </div>
    </div>

    <SectionTitle>Multiply by 5</SectionTitle>
    <StepBox number={1} text="If number is EVEN: halve it, then append 0" example="48 × 5 → 48÷2=24 → append 0 → 240" />
    <StepBox number={2} text="If number is ODD: subtract 1, halve, append 5" example="47 × 5 → 46÷2=23 → append 5 → 235" />

    <SectionTitle>Multiply by 25</SectionTitle>
    <StepBox number={1} text="Divide by 4 (divide by 2 twice)" />
    <StepBox number={2} text="Append 00. For remainders: rem 1→25, rem 2→50, rem 3→75" example="46 × 25: 46÷4=11 rem 2 → 11|50 → 1150" />

    <SectionTitle>Multiply by 125</SectionTitle>
    <StepBox number={1} text="Divide by 8" />
    <StepBox number={2} text="Append 000" example="56 × 125 → 56÷8=7 → 7000" />

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard title="Example 1 — 84 × 5" lines={['84 ÷ 2 = 42', 'Append 0 → 420']} result="84 × 5 = 420 ✓" />
    <ExampleCard title="Example 2 — 68 × 25" lines={['68 ÷ 4 = 17', 'Append 00 → 1700']} result="68 × 25 = 1700 ✓" />
    <ExampleCard title="Example 3 — 96 × 125" lines={['96 ÷ 8 = 12', 'Append 000 → 12000']} result="96 × 125 = 12000 ✓" />

    <SectionTitle>Speed Reference Table</SectionTitle>
    <div style={{ background: 'white', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: 16, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#F0F4FF' }}>
            {['Multiplier', 'Operation', 'Example'].map(h => (
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#0A1628' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ['×5', '÷2 then ×10', '46×5 = 230'],
            ['×25', '÷4 then ×100', '44×25 = 1100'],
            ['×125', '÷8 then ×1000', '48×125 = 6000'],
            ['×50', '÷2 then ×100', '46×50 = 2300'],
            ['×250', '÷4 then ×1000', '44×250 = 11000'],
          ].map(([mul, op, ex], i) => (
            <tr key={mul} style={{ borderTop: '1px solid rgba(30,64,175,0.08)', background: i % 2 ? 'rgba(30,64,175,0.02)' : 'white' }}>
              <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#1E40AF' }}>{mul}</td>
              <td style={{ padding: '10px 12px', color: '#4B5563' }}>{op}</td>
              <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: '#0A1628' }}>{ex}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

// ── L2_09 ─────────────────────────────────────────────────────────────────────

const L2_09_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Paravartya Yojayet</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}>Transpose and apply</div>
    </div>

    <SectionTitle>The Technique — 2-Digit Divisors (11–19)</SectionTitle>
    <StepBox number={1} text="Flag digit = all digits of divisor after first digit, with signs flipped" example="Divisor 13: flag = −3  |  Divisor 17: flag = −7" />
    <StepBox number={2} text="Set up: write dividend digits, mark last digit as remainder zone" />
    <StepBox number={3} text="Bring first dividend digit down as first quotient digit" />
    <StepBox number={4} text="Multiply quotient digit by flag, add to next dividend digit to get next quotient digit" />
    <StepBox number={5} text="Last calculation gives the remainder" />
    <StepBox number={6} text="If a value goes negative or the remainder is ≥ the divisor: work right to left, carrying/borrowing between columns until every digit is valid" example="Remainder 13 with divisor 13 → carry 1 left, remainder becomes 0" />

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — 156 ÷ 13 (clean, no fix-up needed)"
      lines={[
        'Flag = −3 (divisor 13 = 10+3)',
        'Q1 = first digit = 1   ← this is the TENS digit of the answer',
        'Next: 5 + (1 × −3) = 2   ← this is the UNITS digit of the answer',
        'Remainder: 6 + (2 × −3) = 0',
      ]}
      breakdown={[{ label: 'Tens', value: '1' }, { label: 'Units', value: '2' }, { label: 'Remainder', value: '0' }]}
      result="156 ÷ 13 = 12, remainder 0 ✓"
    />
    <ExampleCard
      title="Example 2 — 247 ÷ 13 (needs the fix-up step)"
      lines={[
        'Flag = −3 (divisor 13 = 10+3)',
        'Q1 = first digit = 2',
        'Next: 4 + (2 × −3) = −2',
        'Remainder (raw): 7 + (−2 × −3) = 13',
        'Fix-up: 13 ≥ 13 → carry 1 left, remainder → 0',
        'Last digit: −2 + 1 = −1 → still negative, borrow: −1 + 10 = 9   ← this is the UNITS digit of the answer',
        'First digit: 2 − 1 = 1   ← this is the TENS digit of the answer',
      ]}
      breakdown={[{ label: 'Tens', value: '1' }, { label: 'Units', value: '9' }, { label: 'Remainder', value: '0' }]}
      result="247 ÷ 13 = 19, remainder 0 ✓"
    />
    <ExampleCard
      title="Example 3 — 391 ÷ 17 (needs the fix-up step)"
      lines={[
        'Flag = −7 (divisor 17 = 10+7)',
        'Q1 = first digit = 3',
        'Next: 9 + (3 × −7) = −12',
        'Remainder (raw): 1 + (−12 × −7) = 85',
        'Fix-up: 85 ÷ 17 = 5 remainder 0 → carry 5 left, remainder → 0',
        'Last digit: −12 + 5 = −7 → still negative, borrow: −7 + 10 = 3   ← this is the UNITS digit of the answer',
        'First digit: 3 − 1 = 2   ← this is the TENS digit of the answer',
      ]}
      breakdown={[{ label: 'Tens', value: '2' }, { label: 'Units', value: '3' }, { label: 'Remainder', value: '0' }]}
      result="391 ÷ 17 = 23, remainder 0 ✓"
    />

    <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '14px 16px', marginTop: 8, marginBottom: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
        💡 <strong>Why the fix-up step exists:</strong> the flag-multiply step can produce a value that's negative or too large to be a single digit. Don't panic — work right to left, borrowing 1 from the column to the left (adding 10 here) or carrying extra into the column to the left, until every digit is valid. Example 1 didn't need this; Examples 2 and 3 both did — you'll get both types of questions, so it's worth being comfortable with each.
      </p>
    </div>

    <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '14px 16px', marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
        💡 <strong>Exam Tip:</strong> Paravartya division is fastest for divisors 11–19. For larger divisors, estimate using multiples and subtract. Practice these examples until you can solve each in 20 seconds.
      </p>
    </div>
  </>
);

// ── L2_10 ─────────────────────────────────────────────────────────────────────

const L2_10_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Anurupyena</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}>Proportionality</div>
    </div>

    <SectionTitle>Vedic Fraction Addition</SectionTitle>
    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: '#1E40AF', textAlign: 'center', marginBottom: 8 }}>a/b + c/d = (a×d + b×c) / (b×d)</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563' }}>Cross-multiply numerators, multiply denominators — done in one step!</div>
    </div>

    <SectionTitle>Addition Steps</SectionTitle>
    <StepBox number={1} text="Cross multiply: top-left × bottom-right + bottom-left × top-right" example="Numerator = a×d + b×c" />
    <StepBox number={2} text="Multiply denominators for the new denominator" example="Denominator = b×d" />
    <StepBox number={3} text="Simplify if needed" />

    <SectionTitle>Subtraction</SectionTitle>
    <StepBox number={1} text="Same process but subtract in Step 1" example="a/b − c/d = (a×d − b×c) / (b×d)" />

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — 1/3 + 1/4"
      lines={['Numerator: 1×4 + 3×1 = 7', 'Denominator: 3×4 = 12']}
      result="1/3 + 1/4 = 7/12 ✓"
    />
    <ExampleCard
      title="Example 2 — 2/5 + 3/7"
      lines={['Numerator: 2×7 + 5×3 = 14+15 = 29', 'Denominator: 5×7 = 35']}
      result="2/5 + 3/7 = 29/35 ✓"
    />
    <ExampleCard
      title="Example 3 — 3/4 − 1/6"
      lines={['Numerator: 3×6 − 4×1 = 18−4 = 14', 'Denominator: 4×6 = 24', 'Simplify: 14/24 = 7/12']}
      result="3/4 − 1/6 = 7/12 ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 8 }}>Vedic vs Traditional</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', lineHeight: 1.8 }}>
        <div>Traditional: find LCM → convert → add → simplify</div>
        <div>Vedic: cross-multiply → done! (simplify at end)</div>
        <div style={{ marginTop: 8, color: '#1E40AF', fontWeight: 600 }}>For 2 fractions, Vedic is ALWAYS faster. For 3+ fractions, combine two at a time.</div>
      </div>
    </div>
  </>
);

// ── L2_11 ─────────────────────────────────────────────────────────────────────

const L2_11_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Vilokanam</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}>Mere observation</div>
    </div>

    <SectionTitle>The Formula</SectionTitle>
    <div style={{ background: '#0A1628', borderRadius: 12, padding: 20, marginBottom: 20, textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'white', marginBottom: 12 }}>Day = (d + m + y + ⌊y÷4⌋ − 1) mod 7</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, textAlign: 'left', display: 'inline-block' }}>
        <div>d = date number</div>
        <div>m = month code (see table)</div>
        <div>y = last 2 digits of year</div>
        <div>⌊y÷4⌋ = floor division</div>
        <div>0=Sun · 1=Mon · 2=Tue · 3=Wed · 4=Thu · 5=Fri · 6=Sat</div>
      </div>
    </div>

    <SectionTitle>Month Codes</SectionTitle>
    <div style={{ background: 'white', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: 16, marginBottom: 16, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
        <tbody>
          <tr>
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
              <td key={m} style={{ padding: '8px 10px', textAlign: 'center', background: '#F0F4FF', fontFamily: 'var(--font-body)', fontWeight: 600, color: '#0A1628', border: '1px solid rgba(30,64,175,0.08)', whiteSpace: 'nowrap' }}>{m}</td>
            ))}
          </tr>
          <tr>
            {['1','4','4','0','2','5','0','3','6','1','4','6'].map((c, i) => (
              <td key={i} style={{ padding: '8px 10px', textAlign: 'center', color: '#1E40AF', fontWeight: 700, border: '1px solid rgba(30,64,175,0.08)' }}>{c}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF', margin: '10px 0 0 0' }}>
        For Jan/Feb in a leap year, subtract 1 from the month code.
        Century correction: 1800s +2 · 1900s +0 · 2000s +6
      </p>
    </div>

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — 15 August 1947"
      lines={['d=15, m=3 (Aug), y=47, ⌊47÷4⌋=11', 'Century (1900s) = 0', 'Total: 15+3+47+11+0 = 76', '76 − 1 = 75', '75 mod 7 = 5 = Friday']}
      result="15 Aug 1947 = Friday ✓"
    />
    <ExampleCard
      title="Example 2 — 26 January 2025"
      lines={['d=26, m=1 (Jan), y=25, ⌊25÷4⌋=6', 'Century (2000s) = 6', 'Total: 26+1+25+6+6 = 64', '64 − 1 = 63', '63 mod 7 = 0 = Sunday']}
      result="26 Jan 2025 = Sunday ✓"
    />
    <ExampleCard
      title="Example 3 — 2 October 1869"
      lines={['d=2, m=1 (Oct), y=69, ⌊69÷4⌋=17', 'Century (1800s) = 2', 'Total: 2+1+69+17+2 = 91', '91 − 1 = 90', '90 mod 7 = 6 = Saturday']}
      result="2 Oct 1869 = Saturday ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0 }}>
        💡 Try calculating your own birthday! This technique impresses everyone and is asked in UPSC/banking exams.
      </p>
    </div>
  </>
);

// ── L2_12 ─────────────────────────────────────────────────────────────────────

function L2_12_CONTENT({ onSwitchTab }) {
  return (
    <>
      <div style={{ background: 'linear-gradient(135deg, #0A1628, #1E40AF)', borderRadius: 16, padding: 28, marginBottom: 24 }}>
        <h2 className="font-heading" style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 6 }}>🏆 Level 2 Assessment</h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>Test your Intermediate Vedic Maths mastery</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            '✓ Paravartya Division',
            '✓ 3-Digit Urdhva Multiplication',
            '✓ Squaring & Cubing shortcuts',
            '✓ Square & Cube roots',
            '✓ Digit sum verification',
            '✓ Multiplication by 5, 25, 125',
          ].map(t => (
            <div key={t} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>
              {t}
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          {['• 5 questions, multiple choice', '• Score 60% or above to unlock Level 3', '• Best score saved automatically'].map(r => (
            <p key={r} style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: '5px 0' }}>{r}</p>
          ))}
        </div>

        <button onClick={() => onSwitchTab && onSwitchTab('quiz')} style={{ width: '100%', minHeight: 48, background: 'white', color: '#0A1628', border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
          Take the Assessment →
        </button>
      </div>

      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 14 }}>Quick Revision</h3>
      <style>{`@media(max-width:640px){.rev-row2{overflow-x:auto!important;-webkit-overflow-scrolling:touch!important;}}`}</style>
      <div className="rev-row2" style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
        {[
          { title: 'Paravartya', rule: 'Transpose divisor\ndigits, apply' },
          { title: '3×3 Urdhva', rule: '5-step\ncrosswise' },
          { title: 'Square near 50', rule: '25±d | d²' },
          { title: '√ shortcut', rule: 'pairs | first +\nlast digit table' },
          { title: '∛ shortcut', rule: 'groups of 3\nunique last digit' },
          { title: '×25 shortcut', rule: '÷4 then ×100' },
        ].map(b => (
          <div key={b.title} style={{ background: '#F0F4FF', borderRadius: 12, padding: 14, textAlign: 'center', minWidth: 150, flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: '#0A1628', marginBottom: 6 }}>{b.title}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#3B82F6', whiteSpace: 'pre-line' }}>{b.rule}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── L3_01 ─────────────────────────────────────────────────────────────────────

const L3_01_CONTENT = (
  <>
    <SutraBox sutra="Urdhva-Tiryagbhyam" meaning="Vertically and Crosswise" />

    <SectionTitle>Vertically and Crosswise — 2-Digit General Method</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      For AB × CD, compute three groups — left, middle, right — then combine with carries.
    </p>
    <StepBox number={1} text="Left: A × C" example="This gives the hundreds digit (or higher)" />
    <StepBox number={2} text="Middle: A×D + B×C — carry if > 9" example="This gives the tens digit" />
    <StepBox number={3} text="Right: B × D — carry if > 9" example="This gives the units digit" />

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — 23 × 41"
      lines={['Right: 3×1 = 3 → write 3, carry 0', 'Middle: 2×1 + 3×4 = 2+12 = 14, +carry 0 = 14 → write 4, carry 1', 'Left: 2×4 = 8, +carry 1 = 9', 'Result: 9|4|3 = 943']}
      result="23 × 41 = 943 ✓"
    />
    <ExampleCard
      title="Example 2 — 34 × 52"
      lines={['Right: 4×2 = 8 → write 8, carry 0', 'Middle: 3×2 + 4×5 = 6+20 = 26, +carry 0 = 26 → write 6, carry 2', 'Left: 3×5 = 15, +carry 2 = 17', 'Result: 17|6|8 = 1768']}
      result="34 × 52 = 1768 ✓"
    />
    <ExampleCard
      title="Example 3 — 67 × 83"
      lines={['Right: 7×3 = 21 → write 1, carry 2', 'Middle: 6×3 + 7×8 = 18+56 = 74, +carry 2 = 76 → write 6, carry 7', 'Left: 6×8 = 48, +carry 7 = 55', 'Result: 55|6|1 = 5561']}
      result="67 × 83 = 5561 ✓"
    />

    <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '14px 16px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
        ⚠️ <strong>Always handle carries from right to left.</strong> Multiple carries can stack — add them all to the left group.
      </p>
    </div>
  </>
);

// ── L3_02 ─────────────────────────────────────────────────────────────────────

const L3_02_CONTENT = (
  <>
    <SutraBox sutra="Nikhilam Navatashcaramam Dashatah" meaning="All from 9 and the last from 10" />

    <SectionTitle>Nikhilam for Large Numbers — Base 100 & 1000</SectionTitle>
    <StepBox number={1} text="Find deficiency of each number from the base" example="For base 100: 97 → deficiency = −3, 96 → deficiency = −4" />
    <StepBox number={2} text="Cross subtract: either number minus the other's deficiency" example="97 − 4 = 93 (or 96 − 3 = 93)" />
    <StepBox number={3} text="Multiply the deficiencies — right part (pad to base digit count)" example="3 × 4 = 12 → 2-digit right part for base 100" />
    <StepBox number={4} text="Combine: cross result | deficiency product" />

    <SectionTitle>Worked Examples — Base 100</SectionTitle>
    <ExampleCard
      title="Example 1 — 97 × 96"
      lines={['Deficiencies: −3, −4', 'Cross: 97 − 4 = 93', 'Product: 3 × 4 = 12']}
      result="97 × 96 = 9312 ✓"
    />
    <ExampleCard
      title="Example 2 — 98 × 97"
      lines={['Deficiencies: −2, −3', 'Cross: 98 − 3 = 95', 'Product: 2 × 3 = 06 (pad!)']}
      result="98 × 97 = 9506 ✓"
    />
    <ExampleCard
      title="Example 3 — 88 × 92"
      lines={['Deficiencies: −12, −8', 'Cross: 88 − 8 = 80', 'Product: 12 × 8 = 96']}
      result="88 × 92 = 8096 ✓"
    />

    <SectionTitle>Base 1000 Example</SectionTitle>
    <ExampleCard
      title="Example 4 — 997 × 994"
      lines={['Deficiencies: −3, −6', 'Cross: 997 − 6 = 991', 'Product: 3 × 6 = 018 (3 digits for base 1000)']}
      result="997 × 994 = 991018 ✓"
    />

    <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '14px 16px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
        ⚠️ Right part digit count = number of zeros in the base. Base 100 → 2 digits. Base 1000 → 3 digits. Always pad!
      </p>
    </div>
  </>
);

// ── L3_03 ─────────────────────────────────────────────────────────────────────

const L3_03_CONTENT = (
  <>
    <SutraBox sutra="Anurupye Sunyamanyat" meaning="If one is in ratio, the other is zero" />

    <SectionTitle>Proportionality — Scaling to a Convenient Base</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      Scale one or both numbers to a round base (like 50 or 200), apply Nikhilam, then scale back.
    </p>
    <StepBox number={1} text="Choose a convenient base near your numbers" example="For numbers near 45–50: use base 50" />
    <StepBox number={2} text="Find deficiencies from that base" example="48 from 50: deficiency = −2" />
    <StepBox number={3} text="Cross subtract and multiply by the base" example="Cross = 43, then 43 × 50 = 2150" />
    <StepBox number={4} text="Add deficiency product" example="5 × 2 = 10 → 2150 + 10 = 2160" />

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — 48 × 46 (base 50)"
      lines={['Deficiencies: −2, −4', 'Cross: 48 − 4 = 44 → 44 × 50 = 2200', 'Product: 2 × 4 = 08', 'Result: 2200 + 08 = 2208']}
      result="48 × 46 = 2208 ✓"
    />
    <ExampleCard
      title="Example 2 — 45 × 48 (base 50)"
      lines={['Deficiencies: −5, −2', 'Cross: 45 − 2 = 43 → 43 × 50 = 2150', 'Product: 5 × 2 = 10', 'Result: 2150 + 10 = 2160']}
      result="45 × 48 = 2160 ✓"
    />
    <ExampleCard
      title="Example 3 — 196 × 198 (base 200)"
      lines={['Deficiencies: −4, −2', 'Cross: 196 − 2 = 194 → 194 × 200 = 38800', 'Product: 4 × 2 = 08', 'Result: 38800 + 08 = 38808']}
      result="196 × 198 = 38808 ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0 }}>
        💡 Choose base 50 for numbers in the 40s–50s, base 200 for numbers near 200. The technique always works — pick the base that makes multiplication easiest!
      </p>
    </div>
  </>
);

// ── L3_04 ─────────────────────────────────────────────────────────────────────

const L3_04_CONTENT = (
  <>
    <SutraBox sutra="Nikhilam Navatashcaramam Dashatah" meaning="All from 9 and the last from 10" />

    <SectionTitle>Vinculum — Complement Representation</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      A vinculum converts digits greater than 5 into their complement (10 − d), reducing large-digit arithmetic to small-digit arithmetic. We show vinculum digits in parentheses: (d).
    </p>
    <StepBox number={1} text="For each digit d > 5: replace with (10 − d) and carry +1 to the left" example="Digit 8 → (2) carry 1 | Digit 7 → (3) carry 1" />
    <StepBox number={2} text="Rebuild the number with the new digits and carries" example="76 → 6 is (4), carry 1, so 7+1=8 → 8(4) = 80−4 = 76 ✓" />
    <StepBox number={3} text="Multiply the vinculum form, then convert back" />

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — Convert 8 to vinculum"
      lines={['8 > 5 → replace with (10−8)=(2), carry 1', 'So 18 → 2(2) = 20 − 2 = 18 ✓']}
      result="8 in vinculum = (2) with carry 1"
    />
    <ExampleCard
      title="Example 2 — Convert 76 to vinculum"
      lines={['Units 6 → (4), carry 1', 'Tens 7 + carry 1 = 8', 'Result: 8(4)']}
      result="76 = 8(4) → 80 − 4 = 76 ✓"
    />
    <ExampleCard
      title="Example 3 — 68 × 4 using vinculum"
      lines={['Convert 68 → 7(2)  (since 8→(2) carry 1, 6+1=7)', '7(2) × 4 = 28(8)', '28(8) = 280 − 8 = 272']}
      result="68 × 4 = 272 ✓"
    />
    <ExampleCard
      title="Example 4 — 79 × 6"
      lines={['Convert 79 → 8(1)  (9→(1) carry 1, 7+1=8)', '8(1) × 6 = 48(6)', '48(6) = 480 − 6 = 474']}
      result="79 × 6 = 474 ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0, lineHeight: 1.7 }}>
        💡 <strong>Why vinculum?</strong> Digits above 5 require "carrying" in standard arithmetic. Converting them to small complements (≤ 5) makes mental multiplication faster and reduces errors!
      </p>
    </div>
  </>
);

// ── L3_05 ─────────────────────────────────────────────────────────────────────

const L3_05_CONTENT = (
  <>
    <SutraBox sutra="Urdhva-Tiryagbhyam" meaning="Vertically and Crosswise" />

    <SectionTitle>Duplex Method — Squaring Any Number</SectionTitle>
    <div style={{ background: '#F0F4FF', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 8 }}>Duplex Definition D(n)</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1E40AF', lineHeight: 2 }}>
        <div>Single digit a:     D(a) = a²</div>
        <div>Two digits ab:      D(ab) = 2 × a × b</div>
        <div>Three digits abc:   D(abc) = 2 × a × c + b²</div>
      </div>
    </div>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      To square a number: compute the Duplex of each overlapping group scanning left to right, then combine with carries.
    </p>

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — 23²"
      lines={['D(2) = 4', 'D(23) = 2×2×3 = 12 → write 2, carry 1', 'D(3) = 9', 'Result: (4+1)|2|9 = 529']}
      result="23² = 529 ✓"
    />
    <ExampleCard
      title="Example 2 — 34²"
      lines={['D(4) = 16 → write 6, carry 1', 'D(34) = 2×3×4 = 24, +carry 1 = 25 → write 5, carry 2', 'D(3) = 9, +carry 2 = 11', 'Result: 11|5|6 = 1156']}
      result="34² = 1156 ✓"
    />
    <ExampleCard
      title="Example 3 — 123²"
      lines={[
        'D(3) = 9 → write 9, carry 0',
        'D(23) = 2×2×3 = 12, +carry 0 = 12 → write 2, carry 1',
        'D(123) = 2×1×3 + 2² = 6+4 = 10, +carry 1 = 11 → write 1, carry 1',
        'D(12) = 2×1×2 = 4, +carry 1 = 5 → write 5, carry 0',
        'D(1) = 1, +carry 0 = 1',
        'Result: 1|5|1|2|9 = 15129',
      ]}
      result="123² = 15129 ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0, lineHeight: 1.7 }}>
        💡 For a 2-digit number, you compute 3 duplexes. For a 3-digit number, 5 duplexes. The Duplex is the core engine behind Vedic squaring — master it and you can square any number mentally!
      </p>
    </div>
  </>
);

// ── L3_06 ─────────────────────────────────────────────────────────────────────

const L3_06_CONTENT = (
  <>
    <SutraBox sutra="Yavadunam" meaning="Whatever the extent of deficiency" />

    <SectionTitle>Cube Roots of Perfect Cubes — Instantly!</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      Two simple observations let you find any 2-digit cube root mentally in seconds.
    </p>
    <StepBox number={1} text="Find the first digit: remove the last 3 digits, find the largest n where n³ ≤ remaining" example="∛54872 → remove last 3 → 54 → 3³=27 ≤ 54 < 4³=64 → first digit = 3" />
    <StepBox number={2} text="Find the last digit using the unique last-digit mapping table below" example="54872 ends in 2 → cube root ends in 8" />
    <StepBox number={3} text="Combine first and last digit → instant answer!" example="3 and 8 → Answer: 38" />

    <SectionTitle>Last Digit Mapping (Unique — no ambiguity!)</SectionTitle>
    <div style={{ background: 'white', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#F0F4FF' }}>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#0A1628' }}>Cube ends in</th>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#0A1628' }}>Cube root ends in</th>
          </tr>
        </thead>
        <tbody>
          {[['1','1'],['2','8'],['3','7'],['4','4'],['5','5'],['6','6'],['7','3'],['8','2'],['9','9'],['0','0']].map(([n,r],i)=>(
            <tr key={n} style={{ borderTop: '1px solid rgba(30,64,175,0.08)', background: i%2?'rgba(30,64,175,0.02)':'white' }}>
              <td style={{ padding:'10px 12px', fontFamily:'var(--font-mono)', fontWeight:700, color:'#1E40AF' }}>{n}</td>
              <td style={{ padding:'10px 12px', color:'#0A1628' }}>{r}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — ∛17576"
      lines={['Remove last 3 digits: 17', 'Largest cube ≤ 17: 2³=8 ✓ → first digit = 2', 'Last digit of 17576 = 6 → root ends in 6', 'Answer: 26']}
      result="∛17576 = 26 ✓ (26³=17576)"
    />
    <ExampleCard
      title="Example 2 — ∛54872"
      lines={['Remove last 3 digits: 54', '3³=27 ≤ 54 < 4³=64 → first digit = 3', 'Last digit 2 → root ends in 8', 'Answer: 38']}
      result="∛54872 = 38 ✓ (38³=54872)"
    />
    <ExampleCard
      title="Example 3 — ∛157464"
      lines={['Remove last 3 digits: 157', '5³=125 ≤ 157 < 6³=216 → first digit = 5', 'Last digit 4 → root ends in 4', 'Answer: 54']}
      result="∛157464 = 54 ✓ (54³=157464)"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0 }}>
        💡 Unlike square roots, every last digit maps to exactly ONE cube root digit — no ambiguity, no testing needed!
      </p>
    </div>
  </>
);

// ── L3_07 ─────────────────────────────────────────────────────────────────────

const L3_07_CONTENT = (
  <>
    <SutraBox sutra="Paravartya Yojayet" meaning="Transpose and Apply" />

    <SectionTitle>Straight Division by 9</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      For division by 9, the complement is 1. Work left to right: carry each partial sum forward.
    </p>
    <StepBox number={1} text="Bring down the first digit of the dividend as the first quotient digit" />
    <StepBox number={2} text="Add it to the next digit to get the next quotient digit" example="Repeat: running sum = previous quotient digit + next dividend digit" />
    <StepBox number={3} text="The last sum is the remainder (mod 9 if ≥ 9)" />

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — 1234 ÷ 9"
      lines={['Bring down 1 → Q=1', '1+2=3 → Q=3', '3+3=6 → Q=6', '6+4=10 → Q digit = 10 (adjust: Q adds 1 extra, R=1)', 'Q=137, R=1']}
      result="1234 ÷ 9 = Q:137 R:1 ✓ (9×137+1=1234)"
    />
    <ExampleCard
      title="Example 2 — 2345 ÷ 9"
      lines={['Bring down 2 → Q=2', '2+3=5', '5+4=9 → write 9', '9+5=14 → adjust: +1 to quotient, R=5', 'Q=260, R=5']}
      result="2345 ÷ 9 = Q:260 R:5 ✓ (9×260+5=2345)"
    />
    <ExampleCard
      title="Example 3 — 1111 ÷ 9"
      lines={['1 → 1+1=2 → 2+1=3 → 3+1=4', 'No carry needed', 'Q=123, R=4']}
      result="1111 ÷ 9 = Q:123 R:4 ✓ (9×123+4=1111)"
    />

    <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '14px 16px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
        ⚠️ When any running sum ≥ 9 (like 10, 11), write the units digit as the quotient digit and carry 1 to the next position. Final remainder = last running sum mod 9.
      </p>
    </div>
  </>
);

// ── L3_08 ─────────────────────────────────────────────────────────────────────

const L3_08_CONTENT = (
  <>
    <SutraBox sutra="Urdhva-Tiryagbhyam" meaning="Vertically and Crosswise" />

    <SectionTitle>Algebraic Multiplication Using Vedic Methods</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      The same Urdhva-Tiryagbhyam method that works for numbers also works for algebraic expressions. Treat coefficients as digits.
    </p>
    <StepBox number={1} text="Vertical left: multiply the leading terms" example="(x+2)(x+3) → x × x = x²" />
    <StepBox number={2} text="Cross: multiply outer × inner and add" example="x×3 + 2×x = 3x + 2x = 5x" />
    <StepBox number={3} text="Vertical right: multiply the constant terms" example="2 × 3 = 6" />

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — (x+2)(x+3)"
      lines={['Vertical: x×x = x²', 'Cross: x×3 + 2×x = 5x', 'Vertical: 2×3 = 6']}
      result="(x+2)(x+3) = x² + 5x + 6 ✓"
    />
    <ExampleCard
      title="Example 2 — (2x+3)(x+4)"
      lines={['Vertical: 2x×x = 2x²', 'Cross: 2x×4 + 3×x = 8x+3x = 11x', 'Vertical: 3×4 = 12']}
      result="(2x+3)(x+4) = 2x² + 11x + 12 ✓"
    />
    <ExampleCard
      title="Example 3 — (x+6)(x−2)"
      lines={['Vertical: x×x = x²', 'Cross: x×(−2) + 6×x = −2x+6x = 4x', 'Vertical: 6×(−2) = −12']}
      result="(x+6)(x−2) = x² + 4x − 12 ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0, lineHeight: 1.7 }}>
        💡 This pattern extends to any degree! For trinomials or higher-degree polynomials, extend the crosswise steps — same sutra, unlimited power.
      </p>
    </div>
  </>
);

// ── L3_09 ─────────────────────────────────────────────────────────────────────

const L3_09_CONTENT = (
  <>
    <SutraBox sutra="Paravartya Yojayet" meaning="Transpose and Apply" />

    <SectionTitle>Simultaneous Equations — Vedic Cross-Multiplication</SectionTitle>
    <div style={{ background: '#0A1628', borderRadius: 12, padding: 20, marginBottom: 20, textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>For: ax + by = c   and   dx + ey = f</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: '#93C5FD', lineHeight: 2.2 }}>
        <div>x = (ce − bf) / (ae − bd)</div>
        <div>y = (af − cd) / (ae − bd)</div>
      </div>
    </div>

    <StepBox number={1} text="Identify: a, b, c from equation 1 and d, e, f from equation 2" />
    <StepBox number={2} text="Denominator = ae − bd (same for both x and y)" />
    <StepBox number={3} text="Numerator of x = ce − bf" example="c×e minus b×f" />
    <StepBox number={4} text="Numerator of y = af − cd" example="a×f minus c×d" />

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — 2x+3y=7, x+2y=4"
      lines={['a=2,b=3,c=7 | d=1,e=2,f=4', 'Denominator: 2×2 − 3×1 = 4−3 = 1', 'x = (7×2 − 3×4)/1 = (14−12)/1 = 2', 'y = (2×4 − 7×1)/1 = (8−7)/1 = 1']}
      result="x=2, y=1 ✓ (2×2+3×1=7, 2+2×1=4)"
    />
    <ExampleCard
      title="Example 2 — 3x+2y=12, x+y=5"
      lines={['a=3,b=2,c=12 | d=1,e=1,f=5', 'Denominator: 3×1 − 2×1 = 1', 'x = (12×1 − 2×5)/1 = (12−10)/1 = 2', 'y = (3×5 − 12×1)/1 = (15−12)/1 = 3']}
      result="x=2, y=3 ✓ (3×2+2×3=12, 2+3=5)"
    />
    <ExampleCard
      title="Example 3 — 2x+y=7, x+2y=8"
      lines={['a=2,b=1,c=7 | d=1,e=2,f=8', 'Denominator: 2×2 − 1×1 = 3', 'x = (7×2 − 1×8)/3 = (14−8)/3 = 6/3 = 2', 'y = (2×8 − 7×1)/3 = (16−7)/3 = 9/3 = 3']}
      result="x=2, y=3 ✓ (2×2+3=7, 2+2×3=8)"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0 }}>
        💡 <strong>Exam tip:</strong> Write the formula once and plug in — this method is faster than elimination or substitution for 2×2 systems and impresses examiners!
      </p>
    </div>
  </>
);

// ── L3_10 — ASSESSMENT ────────────────────────────────────────────────────────

function L3_10_CONTENT({ onSwitchTab }) {
  return (
    <>
      <div style={{ background: 'linear-gradient(135deg, #0A1628, #1E40AF)', borderRadius: 16, padding: 28, marginBottom: 24 }}>
        <h2 className="font-heading" style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 6 }}>🏆 Level 3 Assessment</h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>Test your Advanced Vedic Maths mastery</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            '✓ Urdhva-Tiryagbhyam (general)',
            '✓ Nikhilam for large bases',
            '✓ Cube roots & duplex squaring',
            '✓ Vinculum & Anurupyena',
            '✓ Straight division by 9',
            '✓ Algebra & simultaneous equations',
          ].map(t => (
            <div key={t} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>{t}</div>
          ))}
        </div>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          {['• 10 questions, multiple choice', '• Score 60% or above to unlock Level 4', '• Best score saved automatically'].map(r => (
            <p key={r} style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: '5px 0' }}>{r}</p>
          ))}
        </div>
        <button onClick={() => onSwitchTab && onSwitchTab('quiz')} style={{ width: '100%', minHeight: 48, background: 'white', color: '#0A1628', border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
          Take the Assessment →
        </button>
      </div>

      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 14 }}>Quick Revision</h3>
      <style>{`@media(max-width:640px){.rev-row3{overflow-x:auto!important;-webkit-overflow-scrolling:touch!important;}}`}</style>
      <div className="rev-row3" style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
        {[
          { title: 'Urdhva 2×2', rule: 'AC|AD+BC|BD' },
          { title: 'Nikhilam', rule: 'cross | def×def' },
          { title: '∛ method', rule: 'last 3 + last digit table' },
          { title: 'Duplex', rule: 'D(a)|D(ab)|D(abc)...' },
          { title: 'Sim. Eqns', rule: 'x=(ce−bf)/(ae−bd)' },
          { title: 'Div by 9', rule: 'running sum left→right' },
        ].map(b => (
          <div key={b.title} style={{ background: '#F0F4FF', borderRadius: 12, padding: 14, textAlign: 'center', minWidth: 150, flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: '#0A1628', marginBottom: 6 }}>{b.title}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#3B82F6', whiteSpace: 'pre-line' }}>{b.rule}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── L4_01 ─────────────────────────────────────────────────────────────────────

const L4_01_CONTENT = (
  <>
    <SutraBox sutra="Anurupyena" meaning="Proportionality" />

    <SectionTitle>Cubing Any 2-Digit Number</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      For any number written as a+b (tens digit a, units digit b), expand using the pattern a³|3a²b|3ab²|b³ — identical to (a+b)³ algebraically.
    </p>
    <StepBox number={1} text="Write a³" example="For 23: a=2, b=3 → a³ = 8" />
    <StepBox number={2} text="Write 3×a²×b" example="3×4×3 = 36" />
    <StepBox number={3} text="Write 3×a×b²" example="3×2×9 = 54" />
    <StepBox number={4} text="Write b³" example="27" />
    <StepBox number={5} text="Handle carries from right to left" example="8|36|54|27 → with carries → 12167" />

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — 12³  (a=1, b=2)"
      lines={['Row: 1 | 6 | 12 | 8', '12 → write 2, carry 1 → 6+1=7', 'Result: 1|7|2|8']}
      result="12³ = 1728 ✓"
    />
    <ExampleCard
      title="Example 2 — 23³  (a=2, b=3)"
      lines={['Row: 8 | 36 | 54 | 27', '27 → write 7, carry 2', '54+2=56 → write 6, carry 5', '36+5=41 → write 1, carry 4', '8+4=12']}
      result="23³ = 12167 ✓"
    />
    <ExampleCard
      title="Example 3 — 14³  (a=1, b=4)"
      lines={['Row: 1 | 12 | 48 | 64', '64 → write 4, carry 6', '48+6=54 → write 4, carry 5', '12+5=17 → write 7, carry 1', '1+1=2']}
      result="14³ = 2744 ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0, lineHeight: 1.7 }}>
        💡 The ratio of the 4 terms is always <strong>1:3:3:1</strong> — same as Pascal's triangle row 3. Memorise the pattern and you can cube any 2-digit number in under 10 seconds!
      </p>
    </div>
  </>
);

// ── L4_02 ─────────────────────────────────────────────────────────────────────

const L4_02_CONTENT = (
  <>
    <SutraBox sutra="Urdhva-Tiryagbhyam" meaning="Vertically and Crosswise" />

    <SectionTitle>Squaring 3-Digit Numbers — Duplex Method</SectionTitle>
    <div style={{ background: '#F0F4FF', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 8 }}>Duplex Formulas</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1E40AF', lineHeight: 2 }}>
        <div>D(a)    = a²</div>
        <div>D(ab)   = 2ab</div>
        <div>D(abc)  = 2ac + b²</div>
        <div>D(abcd) = 2ad + 2bc</div>
      </div>
    </div>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      For 3-digit number abc: compute 5 duplexes — D(a) | D(ab) | D(abc) | D(bc) | D(c) — then add carries right to left.
    </p>

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — 213²"
      lines={['D(2)=4, D(21)=2×2×1=4, D(213)=2×2×3+1²=13', 'D(13)=2×1×3=6, D(3)=9', 'Row: 4|4|13|6|9', '13→3 carry 1 → 4+1=5', 'Result: 45369']}
      result="213² = 45369 ✓"
    />
    <ExampleCard
      title="Example 2 — 111²"
      lines={['D(1)=1, D(11)=2, D(111)=2+1=3, D(11)=2, D(1)=1', 'Row: 1|2|3|2|1 — no carries!']}
      result="111² = 12321 ✓"
    />
    <ExampleCard
      title="Example 3 — 122²"
      lines={['D(1)=1, D(12)=4, D(122)=2×1×2+4=8, D(22)=8, D(2)=4', 'Row: 1|4|8|8|4 — no carries!', 'Result: 14884']}
      result="122² = 14884 ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0 }}>
        💡 Always write out the full duplex row first, then do all carries in one pass from right to left. Rushing the carries is the most common source of errors!
      </p>
    </div>
  </>
);

// ── L4_03 ─────────────────────────────────────────────────────────────────────

const L4_03_CONTENT = (
  <>
    <SutraBox sutra="Ekadhikena Purvena" meaning="By one more than the previous one" />

    <SectionTitle>Osculators — Divisibility Testing</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      An osculator is a multiplier that helps test divisibility without long division.
    </p>

    <div style={{ background: '#F0F4FF', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 8 }}>Osculator Reference</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', lineHeight: 2 }}>
        <div><strong>Positive P</strong> (divisors ending near 9): 19→P=2, 29→P=3, 39→P=4</div>
        <div><strong>Negative Q</strong> (divisors ending in 1): 11→Q=1, 21→Q=2, 31→Q=3</div>
      </div>
    </div>

    <StepBox number={1} text="Detach the last digit of the number" />
    <StepBox number={2} text="For positive P: multiply last digit by P and ADD to remaining number" />
    <StepBox number={3} text="For negative Q: multiply last digit by Q and SUBTRACT from remaining number" />
    <StepBox number={4} text="Repeat until you reach a recognisable number; if divisible → Yes!" />

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — Is 399 divisible by 19? (P=2)"
      lines={['399 → detach 9: 39 + 9×2 = 39+18 = 57', '57 → detach 7: 5 + 7×2 = 5+14 = 19', '19 is divisible by 19 → YES']}
      result="399 ÷ 19 = 21 ✓"
    />
    <ExampleCard
      title="Example 2 — Is 572 divisible by 11? (Q=1)"
      lines={['572 → detach 2: 57 − 2×1 = 55', '55 → detach 5: 5 − 5×1 = 0', '0 is divisible by 11 → YES']}
      result="572 ÷ 11 = 52 ✓"
    />
    <ExampleCard
      title="Example 3 — Is 253 divisible by 11? (Q=1)"
      lines={['253 → detach 3: 25 − 3 = 22', '22 → detach 2: 2 − 2 = 0 → YES']}
      result="253 ÷ 11 = 23 ✓"
    />
    <ExampleCard
      title="Example 4 — Is 646 divisible by 19? (P=2)"
      lines={['646 → detach 6: 64 + 6×2 = 64+12 = 76', '76 → detach 6: 7 + 6×2 = 7+12 = 19 → YES']}
      result="646 ÷ 19 = 34 ✓"
    />
  </>
);

// ── L4_04 ─────────────────────────────────────────────────────────────────────

const L4_04_CONTENT = (
  <>
    <SutraBox sutra="Ekadhikena Purvena" meaning="By one more than the previous one" />

    <SectionTitle>Auxiliary Fractions — Instant Decimal Conversion</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      For fractions whose denominator ends in 9, use Ekadhikena (one more than previous) to convert to decimals by progressive division.
    </p>
    <StepBox number={1} text="Find the Ekadhikena: one more than the digit before 9" example="For 1/19: digit before 9 is 1, Ekadhikena = 2" />
    <StepBox number={2} text="Divide the numerator by the Ekadhikena, carry any remainder forward" example="1÷2=0 rem 1 → write 0" />
    <StepBox number={3} text="Next: new number = (remainder × 10 + 0) ÷ Ekadhikena, continue..." example="10÷2=5 rem 0 → write 5; 5÷2=2 rem 1 → write 2; 12÷2=6..." />
    <StepBox number={4} text="The decimal repeats with period = denominator − 1" />

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1 — 1/19  (Ekadhikena = 2)"
      lines={['1÷2=0 r1 → .0', '10÷2=5 r0 → .05', '5÷2=2 r1 → .052', '12÷2=6 r0 → .0526', '6÷2=3 r0 → .05263...']}
      result="1/19 = 0.052631578947368421... (repeating)"
    />
    <ExampleCard
      title="Example 2 — 1/29  (Ekadhikena = 3)"
      lines={['1÷3=0 r1 → .0', '10÷3=3 r1 → .03', '13÷3=4 r1 → .034', '14÷3=4 r2 → .0344...']}
      result="1/29 = 0.0344827... (repeating)"
    />

    <SectionTitle>The 1/9 Family Shortcut</SectionTitle>
    <div style={{ background: 'white', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: 16 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#F0F4FF' }}>
            {['Fraction','Decimal','Pattern'].map(h=>(
              <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontWeight:600, color:'#0A1628', fontFamily:'var(--font-body)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ['1/9','0.111...','Single digit repeat'],
            ['1/99','0.010101...','2-digit cycle'],
            ['1/999','0.001001001...','3-digit cycle'],
            ['1/19','0.052631...','18-digit cycle'],
          ].map(([f,d,p],i)=>(
            <tr key={f} style={{ borderTop:'1px solid rgba(30,64,175,0.08)', background:i%2?'rgba(30,64,175,0.02)':'white' }}>
              <td style={{ padding:'10px 12px', color:'#1E40AF', fontWeight:700 }}>{f}</td>
              <td style={{ padding:'10px 12px', color:'#0A1628' }}>{d}</td>
              <td style={{ padding:'10px 12px', color:'#4B5563', fontFamily:'var(--font-body)' }}>{p}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

// ── LESSON CONTENT MAP ────────────────────────────────────────────────────────

const LESSON_CONTENT = {
  l1_01: () => L1_01_CONTENT,
  l1_02: () => L1_02_CONTENT,
  l1_03: () => L1_03_CONTENT,
  l1_04: () => L1_04_CONTENT,
  l1_05: () => L1_05_CONTENT,
  l1_06: () => L1_06_CONTENT,
  l1_07: () => L1_07_CONTENT,
  l1_08: () => L1_08_CONTENT,
  l1_09: () => L1_09_CONTENT,
  l2_01: () => L2_01_CONTENT,
  l2_02: () => L2_02_CONTENT,
  l2_03: () => L2_03_CONTENT,
  l2_04: () => L2_04_CONTENT,
  l2_05: () => L2_05_CONTENT,
  l2_06: () => L2_06_CONTENT,
  l2_07: () => L2_07_CONTENT,
  l2_08: () => L2_08_CONTENT,
  l2_09: () => L2_09_CONTENT,
  l2_10: () => L2_10_CONTENT,
  l2_11: () => L2_11_CONTENT,
  l3_01: () => L3_01_CONTENT,
  l3_02: () => L3_02_CONTENT,
  l3_03: () => L3_03_CONTENT,
  l3_04: () => L3_04_CONTENT,
  l3_05: () => L3_05_CONTENT,
  l3_06: () => L3_06_CONTENT,
  l3_07: () => L3_07_CONTENT,
  l3_08: () => L3_08_CONTENT,
  l3_09: () => L3_09_CONTENT,
  l4_01: () => L4_01_CONTENT,
  l4_02: () => L4_02_CONTENT,
  l4_03: () => L4_03_CONTENT,
  l4_04: () => L4_04_CONTENT,
  l4_05: () => L4_05_CONTENT,
  l4_06: () => L4_06_CONTENT,
  l4_07: () => L4_07_CONTENT,
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function ConceptTab({ lesson, glass, progress, onSwitchTab, onConceptComplete }) {
  // Was this lesson's concept already marked complete before? Previously
  // this only lived in local component state (useState(false)) with no
  // check against saved progress — so revisiting a lesson reset the button
  // to "Mark Concept Complete" every time, AND clicking it again handed out
  // another +20 XP for a lesson already credited. Both fixed by tracking a
  // real per-lesson flag instead of just blindly adding XP on every click.
  const alreadyDone = (() => {
    try {
      const p = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
      return !!(p.conceptCompletedLessons || []).includes(lesson.id);
    } catch { return false; }
  })();
  const [conceptDone, setConceptDone] = useState(alreadyDone);

  const saveXP = () => {
    const p = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
    if (!Array.isArray(p.conceptCompletedLessons)) p.conceptCompletedLessons = [];
    if (p.conceptCompletedLessons.includes(lesson.id)) {
      // Already credited previously — just reflect the completed UI state,
      // don't award XP again.
      setConceptDone(true);
      return;
    }
    p.conceptCompletedLessons.push(lesson.id);
    p.totalXP = (p.totalXP || 0) + 20;
    localStorage.setItem('vedicmind_progress', JSON.stringify(p));
    setConceptDone(true);
    if (onConceptComplete) onConceptComplete();
  };

  const renderContent = () => {
    if (lesson.id === 'l1_10') return <L1_10_CONTENT onSwitchTab={onSwitchTab} />;
    if (lesson.id === 'l2_12') return <L2_12_CONTENT onSwitchTab={onSwitchTab} />;
    if (lesson.id === 'l3_10') return <L3_10_CONTENT onSwitchTab={onSwitchTab} />;
    if (lesson.id === 'l4_08') return <L4_08_CONTENT onSwitchTab={onSwitchTab} />;
    const factory = LESSON_CONTENT[lesson.id];
    if (factory) return factory();
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📖</div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: '#0A1628', marginBottom: 12 }}>
          {lesson.title}
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 16px' }}>
          This lesson covers the core technique with step-by-step examples, visual aids, and worked problems.
          Work through the concept carefully before attempting Practice and Quiz.
        </p>
        <div style={{ background: '#F0F4FF', borderLeft: '4px solid #3B82F6', borderRadius: '0 12px 12px 0', padding: '16px 20px', textAlign: 'left', maxWidth: 480, margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0, lineHeight: 1.65, fontStyle: 'italic' }}>
            💡 <strong>Tip:</strong> Read through the concept, then proceed to Practice to reinforce understanding through problems.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <VideoButton lesson={lesson} />
      <div style={{ ...glass, padding: 28, marginBottom: 24 }}>
        {renderContent()}
      </div>

      <button
        onClick={saveXP}
        disabled={conceptDone}
        style={{
          minHeight: 44, maxWidth: 300, width: '100%',
          background: conceptDone ? '#10B981' : '#0A1628',
          color: 'white', border: 'none', borderRadius: 12,
          fontSize: 15, fontWeight: 600, cursor: conceptDone ? 'default' : 'pointer',
          fontFamily: 'var(--font-body)', transition: 'background 0.3s',
        }}
      >
        {conceptDone ? '✅ Concept Complete' : 'Mark Concept Complete →'}
      </button>
      {conceptDone && (
        <p style={{ marginTop: 8, fontSize: 13, color: '#10B981', fontFamily: 'var(--font-body)' }}>
          +20 XP earned! ⭐ Now try the Practice tab.
        </p>
      )}
    </div>
  );
}