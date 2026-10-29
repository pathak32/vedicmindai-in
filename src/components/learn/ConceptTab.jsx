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

// Inline English/Hindi text for constant JSX that cannot call useLanguage() directly.
function BiText({ en, hi }) {
  const { language } = useLanguage();
  return language === 'hi' ? hi : en;
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
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 6 }}>{language === 'hi' ? '💡 यह क्यों काम करता है?' : '💡 Why does this work?'}</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', lineHeight: 1.7 }}>
        {language === 'hi' ? (
          <>
            अंत में 5 वाली कोई भी संख्या (10n+5) के रूप में लिखी जा सकती है।<br />
            (10n+5)² = 100n(n+1) + 25.<br />
            n×(n+1) वाला भाग प्रीफ़िक्स देता है, और 25 हमेशा सफ़िक्स होता है।
          </>
        ) : (
          <>
            Any number ending in 5 can be written as (10n+5).<br />
            (10n+5)² = 100n(n+1) + 25.<br />
            The n×(n+1) part gives the prefix, and 25 is always the suffix.
          </>
        )}
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
      lines={[{ en: 'Deficits: 2, 3', hi: 'कमियाँ: 2, 3' }, { en: 'Cross: 98 − 3 = 95', hi: 'तिरछा: 98 − 3 = 95' }, { en: 'Product: 2 × 3 = 6', hi: 'गुणनफल: 2 × 3 = 6' }, { en: 'Right part needs 2 digits for base 100, so 6 is written as 06', hi: 'आधार 100 के लिए दायें भाग में 2 अंक चाहिए, इसलिए 6 को 06 लिखा जाता है' }]}
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
      ⚠️ {language === 'hi' ? (
        <>
          <strong>दाहिना भाग हमेशा 2 अंकों का होना चाहिए</strong> (क्योंकि आधार = 100)।<br />
          अगर विचलनों का गुणनफल &lt; 10 है, तो आगे एक शून्य लगाएँ! उदाहरण: 3 × 2 = 6 → इसे <strong>06</strong> लिखें।
        </>
      ) : (
        <>
          <strong>The RIGHT part must always have 2 digits</strong> (since base = 100).<br />
          If product of deficits &lt; 10, pad with a zero! Example: 3 × 2 = 6 → write as <strong>06</strong>.
        </>
      )}
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
      ⚠️ {language === 'hi' ? (
        <>
          <strong>दाहिना भाग हमेशा 3 अंकों का होना चाहिए!</strong><br />
          शून्य लगाकर भरें: 6 → 006 · 24 → 024 · 100 या उससे अधिक हो तो बायें भाग में जुड़ जाता है।
        </>
      ) : (
        <>
          <strong>The RIGHT part must always have 3 digits!</strong><br />
          Pad with zeros: 6 → 006 · 24 → 024 · 100+ carries over to left part.
        </>
      )}
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
      ⚠️ {language === 'hi' ? (
        <>
          <strong>ज़रूरी:</strong> अंकों के योग की जाँच ज़्यादातर गलतियाँ पकड़ती है, सभी नहीं। जो उत्तर बहुत आसान लगें, उन्हें हमेशा दोबारा जाँचें।
          (सही उत्तर: 47 × 32 = 1504, 1513 नहीं।)
        </>
      ) : (
        <>
          <strong>Important:</strong> The digit sum check catches most errors but not all. Always double-check answers that seem too clean.
          (Actual answer: 47 × 32 = 1504, not 1513.)
        </>
      )}
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
        <strong>{language === 'hi' ? 'नियम:' : 'Rule:'}</strong> n × 9 = n × (10−1) = n×10 − n
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 20 }}>
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
      <div className="rev-row" style={{ display: 'flex', gap: 10, marginBottom: 4, overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 4 }}>
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
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="Transpose and apply" hi="परिवर्तित करें और लागू करें" /></div>
    </div>

    <SectionTitle>{{ en: "The Technique", hi: "तकनीक" }}</SectionTitle>
    <StepBox number={1} text={{ en: "Write the divisor. Transpose (flip sign of) all digits except the first", hi: "भाजक लिखें। पहले अंक को छोड़कर बाकी सभी अंकों का चिह्न बदलें (ऋणात्मक बनाएँ)" }} example={{ en: "Divisor 11 → first digit 1, transpose 1 → becomes −1  |  Divisor 12 → first digit 1, transpose 2 → becomes −2", hi: "भाजक 11 → पहला अंक 1, परिवर्तित मान −1 | भाजक 12 → पहला अंक 1, परिवर्तित मान −2" }} />
    <StepBox number={2} text={{ en: "Write the dividend. Draw a vertical line separating the last digit (remainder section)", hi: "भाज्य लिखें। अंतिम अंक को शेषफल वाले भाग से ऊर्ध्वाधर रेखा द्वारा अलग करें" }} />
    <StepBox number={3} text={{ en: "Bring down the first digit of the dividend as the first quotient digit", hi: "भाज्य का पहला अंक नीचे लाएँ और उसे पहला भागफल अंक मानें" }} />
    <StepBox number={4} text={{ en: "Multiply that quotient digit by the transposed digits and add to the next dividend digit", hi: "इस भागफल अंक को परिवर्तित अंकों से गुणा करें और अगले भाज्य अंक में जोड़ें" }} />
    <StepBox number={5} text={{ en: "Repeat until you reach the remainder section", hi: "शेषफल वाले भाग तक दोहराएँ" }} />

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 121 ÷ 11", hi: "उदाहरण 1: 121 ÷ 11" }}
      lines={[{ en: 'Divisor 11: transposed digit = −1', hi: 'भाजक 11: परिवर्तित अंक = −1' }, { en: 'Dividend: 12 | 1', hi: 'भाज्य: 12 | 1' }, { en: 'Bring down 1 → Q digit = 1', hi: '1 नीचे लाएँ → भागफल अंक = 1' }, { en: '1 × (−1) = −1 → 2 + (−1) = 1 → next Q digit = 1', hi: '1 × (−1) = −1 → 2 + (−1) = 1 → अगला भागफल अंक = 1' }, { en: 'Remainder: 1 × (−1) = −1 → 1 + (−1) = 0', hi: 'शेषफल: 1 × (−1) = −1 → 1 + (−1) = 0' }]}
      result="121 ÷ 11 = 11 ✓"
    />
    <ExampleCard
      title={{ en: "Example 2: 234 ÷ 12", hi: "उदाहरण 2: 234 ÷ 12" }}
      lines={[{ en: 'Divisor 12: transposed digit = −2', hi: 'भाजक 12: परिवर्तित अंक = −2' }, { en: 'Bring down 2 → Q digit = 1', hi: '2 नीचे लाएँ → भागफल अंक = 1' }, { en: '1 × (−2) = −2 → 3 + (−2) = 1 → next digit... ', hi: '1 × (−2) = −2 → 3 + (−2) = 1 → अगला अंक... ' }, { en: 'Net result: 12 × 19 = 228, remainder = 234 − 228 = 6', hi: 'कुल परिणाम: 12 × 19 = 228, शेषफल = 234 − 228 = 6' }]}
      result="234 ÷ 12 = 19 remainder 6 ✓"
    />
    <ExampleCard
      title={{ en: "Example 3: 156 ÷ 13", hi: "उदाहरण 3: 156 ÷ 13" }}
      lines={[{ en: 'Divisor 13: transposed digit = −3', hi: 'भाजक 13: परिवर्तित अंक = −3' }, { en: '13 × 12 = 156 → no remainder', hi: '13 × 12 = 156 → कोई शेषफल नहीं' }]}
      result="156 ÷ 13 = 12 ✓"
    />

    <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '14px 16px', marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
        💡 <BiText en="Paravartya works best when the divisor is close to a power of 10 (like 11, 12, 13, 21, 99, 101). For exam purposes, focus on divisors 11–19 where it's fastest." hi="पारावर्त्य तब सबसे अच्छा काम करता है जब भाजक 10 की किसी घात के पास हो (जैसे 11, 12, 13, 21, 99, 101)। परीक्षा के लिए 11–19 भाजकों पर ध्यान दें, वहाँ यह सबसे तेज़ है।" />
      </p>
    </div>
  </>
);

// ── L2_02 ─────────────────────────────────────────────────────────────────────

const L2_02_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Urdhva-Tiryagbhyam</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="Vertically and Crosswise" hi="ऊर्ध्वाधर और तिर्यक रूप से" /></div>
    </div>

    <SectionTitle>{{ en: "Technique — ABC × DEF (3-digit × 3-digit)", hi: "तकनीक — ABC × DEF (3-अंकीय × 3-अंकीय)" }}</SectionTitle>
    <StepBox number={1} text={{ en: "Units: C × F", hi: "इकाई: C × F" }} example={{ en: "Write units digit, carry tens", hi: "इकाई अंक लिखें, दहाई हासिल आगे ले जाएँ" }} />
    <StepBox number={2} text={{ en: "Tens: B×F + C×E", hi: "दहाई: B×F + C×E" }} example={{ en: "Add carry from Step 1. Write units digit, carry rest", hi: "चरण 1 का हासिल जोड़ें। इकाई अंक लिखें, शेष हासिल आगे ले जाएँ" }} />
    <StepBox number={3} text={{ en: "Hundreds: A×F + B×E + C×D", hi: "सैकड़ा: A×F + B×E + C×D" }} example={{ en: "Add carry from Step 2. Write units digit, carry rest", hi: "चरण 2 का हासिल जोड़ें। इकाई अंक लिखें, शेष हासिल आगे ले जाएँ" }} />
    <StepBox number={4} text={{ en: "Thousands: A×E + B×D", hi: "हज़ार: A×E + B×D" }} example={{ en: "Add carry from Step 3. Write units digit, carry rest", hi: "चरण 3 का हासिल जोड़ें। इकाई अंक लिखें, शेष हासिल आगे ले जाएँ" }} />
    <StepBox number={5} text={{ en: "Ten-thousands: A×D", hi: "दस-हज़ार: A×D" }} example={{ en: "Add carry from Step 4", hi: "चरण 4 का हासिल जोड़ें" }} />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#0A1628', lineHeight: 2.2 }}>
        <div>Step 1: · · C  ×  · · F</div>
        <div>Step 2: · B C  ×  · E F</div>
        <div>Step 3: A B C  ×  D E F</div>
        <div>Step 4: A B ·  ×  D E ·</div>
        <div>Step 5: A · ·  ×  D · ·</div>
      </div>
    </div>

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 112 × 111", hi: "उदाहरण 1: 112 × 111" }}
      lines={[{ en: 'Step 1: 2×1 = 2', hi: 'चरण 1: 2×1 = 2' }, { en: 'Step 2: 1×1 + 2×1 = 3', hi: 'चरण 2: 1×1 + 2×1 = 3' }, { en: 'Step 3: 1×1 + 1×1 + 2×1 = 4', hi: 'चरण 3: 1×1 + 1×1 + 2×1 = 4' }, { en: 'Step 4: 1×1 + 1×1 = 2', hi: 'चरण 4: 1×1 + 1×1 = 2' }, { en: 'Step 5: 1×1 = 1', hi: 'चरण 5: 1×1 = 1' }]}
      result="112 × 111 = 12432 ✓"
    />
    <ExampleCard
      title={{ en: "Example 2: 123 × 321", hi: "उदाहरण 2: 123 × 321" }}
      lines={[{ en: 'Step 1: 3×1 = 3', hi: 'चरण 1: 3×1 = 3' }, { en: 'Step 2: 2×1 + 3×2 = 8', hi: 'चरण 2: 2×1 + 3×2 = 8' }, { en: 'Step 3: 1×1 + 2×2 + 3×3 = 14 → write 4, carry 1', hi: 'चरण 3: 1×1 + 2×2 + 3×3 = 14 → 4 लिखें, 1 हासिल' }, { en: 'Step 4: 1×2 + 2×3 = 8 + carry 1 = 9', hi: 'चरण 4: 1×2 + 2×3 = 8 + हासिल 1 = 9' }, { en: 'Step 5: 1×3 = 3', hi: 'चरण 5: 1×3 = 3' }]}
      result="123 × 321 = 39483 ✓"
    />
    <ExampleCard
      title={{ en: "Example 3: 204 × 103", hi: "उदाहरण 3: 204 × 103" }}
      lines={[{ en: 'Step 1: 4×3 = 12 → write 2, carry 1', hi: 'चरण 1: 4×3 = 12 → 2 लिखें, 1 हासिल' }, { en: 'Step 2: 0×3 + 4×0 = 0 + carry 1 = 1', hi: 'चरण 2: 0×3 + 4×0 = 0 + हासिल 1 = 1' }, { en: 'Step 3: 2×3 + 0×0 + 4×1 = 10 → write 0, carry 1', hi: 'चरण 3: 2×3 + 0×0 + 4×1 = 10 → 0 लिखें, 1 हासिल' }, { en: 'Step 4: 2×0 + 0×1 = 0 + carry 1 = 1', hi: 'चरण 4: 2×0 + 0×1 = 0 + हासिल 1 = 1' }, { en: 'Step 5: 2×1 = 2', hi: 'चरण 5: 2×1 = 2' }]}
      result="204 × 103 = 21012 ✓"
    />
  </>
);

// ── L2_03 ─────────────────────────────────────────────────────────────────────

const L2_03_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Yavadunam</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="Whatever the extent of deficiency" hi="कमी चाहे जितनी हो" /></div>
    </div>

    <SectionTitle>{{ en: "Method 1 — Near Base 50", hi: "विधि 1 — आधार 50 के पास" }}</SectionTitle>
    <StepBox number={1} text={{ en: "Find difference from 50: d = n − 50", hi: "50 से अंतर ज्ञात करें: d = n − 50" }} />
    <StepBox number={2} text={{ en: "First part: 25 + d", hi: "पहला भाग: 25 + d" }} />
    <StepBox number={3} text={{ en: "Second part: d² (must be 2 digits — pad if needed)", hi: "दूसरा भाग: d² (2 अंकों का होना चाहिए — ज़रूरत हो तो शून्य लगाएँ)" }} />
    <StepBox number={4} text={{ en: "Combine first part | second part", hi: "पहला भाग | दूसरा भाग जोड़ें" }} />

    <SectionTitle>{{ en: "Method 2 — Duplex (any 2-digit number AB)", hi: "विधि 2 — डुप्लेक्स (कोई भी 2-अंकीय संख्या AB)" }}</SectionTitle>
    <StepBox number={1} text="(AB)² = A² | 2×A×B | B²" example={{ en: "Compute each piece, then add with carries right to left", hi: "हर भाग निकालें, फिर दाईं से बाईं ओर हासिल के साथ जोड़ें" }} />

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 47² (near 50)", hi: "उदाहरण 1: 47² (50 के पास)" }}
      lines={['d = 47 − 50 = −3', { en: 'First part: 25 + (−3) = 22', hi: 'पहला भाग: 25 + (−3) = 22' }, { en: 'Second part: (−3)² = 9 → 09', hi: 'दूसरा भाग: (−3)² = 9 → 09' }]}
      result="47² = 2209 ✓"
    />
    <ExampleCard
      title={{ en: "Example 2: 53² (near 50)", hi: "उदाहरण 2: 53² (50 के पास)" }}
      lines={['d = 53 − 50 = 3', { en: 'First part: 25 + 3 = 28', hi: 'पहला भाग: 25 + 3 = 28' }, { en: 'Second part: 3² = 9 → 09', hi: 'दूसरा भाग: 3² = 9 → 09' }]}
      result="53² = 2809 ✓"
    />
    <ExampleCard
      title={{ en: "Example 3: 38² (duplex method)", hi: "उदाहरण 3: 38² (डुप्लेक्स विधि)" }}
      lines={['3² | 2×3×8 | 8²', '9 | 48 | 64', { en: '64 → write 4, carry 6', hi: '64 → 4 लिखें, 6 हासिल' }, { en: '48 + 6 = 54 → write 4, carry 5', hi: '48 + 6 = 54 → 4 लिखें, 5 हासिल' }, '9 + 5 = 14']}
      result="38² = 1444 ✓"
    />

    <SectionTitle>{{ en: "Which Method to Use?", hi: "कौन-सी विधि उपयोग करें?" }}</SectionTitle>
    <div style={{ background: 'white', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: 16, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#F0F4FF' }}>
            {[{ en: 'Range', hi: 'श्रेणी' }, { en: 'Best Method', hi: 'सर्वोत्तम विधि' }].map(h => (
              <th key={h.en} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#0A1628' }}><BiText en={h.en} hi={h.hi} /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { range: { en: 'Near 50 (40–60)', hi: 'आधार 50 के पास (40–60)' }, method: { en: 'Base-50 method', hi: 'आधार-50 विधि' } },
            { range: { en: 'Near 100 (90–99)', hi: '100 के पास (90–99)' }, method: { en: 'Nikhilam (Level 1)', hi: 'निखिलम (स्तर 1)' } },
            { range: { en: 'Ends in 5', hi: 'अंत में 5' }, method: { en: 'Ekadhikena (Level 1)', hi: 'एकाधिकेन (स्तर 1)' } },
            { range: { en: 'Any 2-digit', hi: 'कोई भी 2-अंकीय' }, method: { en: 'Duplex: A²|2AB|B²', hi: 'डुप्लेक्स: A²|2AB|B²' } },
          ].map((r, i) => (
            <tr key=<BiText en={r.range.en} hi={r.range.hi} /> style={{ borderTop: '1px solid rgba(30,64,175,0.08)', background: i % 2 ? 'rgba(30,64,175,0.02)' : 'white' }}>
              <td style={{ padding: '10px 12px', color: '#4B5563' }}><BiText en={r.range.en} hi={r.range.hi} /></td>
              <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: '#0A1628' }}><BiText en={r.method.en} hi={r.method.hi} /></td>
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
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="Proportionality" hi="अनुपातिकता" /></div>
    </div>

    <SectionTitle>{{ en: "The Technique — Cubing AB", hi: "तकनीक — AB का घन" }}</SectionTitle>
    <StepBox number={1} text={{ en: "Write A³ (cube of first digit)", hi: "A³ लिखें (पहले अंक का घन)" }} />
    <StepBox number={2} text={{ en: "Write 3 × A² × B", hi: "3 × A² × B लिखें" }} />
    <StepBox number={3} text={{ en: "Write 3 × A × B²", hi: "3 × A × B² लिखें" }} />
    <StepBox number={4} text={{ en: "Write B³", hi: "B³ लिखें" }} />
    <StepBox number={5} text={{ en: "Add with carries from right to left", hi: "दाईं से बाईं ओर हासिल के साथ जोड़ें" }} example={{ en: "Pattern: a³ | 3a²b | 3ab² | b³  (same as (a+b)³ expansion)", hi: "पैटर्न: a³ | 3a²b | 3ab² | b³ ((a+b)³ के विस्तार जैसा ही)" }} />

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 12³", hi: "उदाहरण 1: 12³" }}
      lines={['a=1, b=2', { en: 'Row: 1 | 3×1×2=6 | 3×1×4=12 | 8', hi: 'पंक्ति: 1 | 3×1×2=6 | 3×1×4=12 | 8' }, '8 → 8', { en: '12 → write 2, carry 1', hi: '12 → 2 लिखें, 1 हासिल' }, '6 + 1 = 7', { en: '1 stays', hi: '1 वैसे ही रहता है' }]}
      result="12³ = 1728 ✓"
    />
    <ExampleCard
      title={{ en: "Example 2: 23³", hi: "उदाहरण 2: 23³" }}
      lines={['a=2, b=3', { en: 'Row: 8 | 3×4×3=36 | 3×2×9=54 | 27', hi: 'पंक्ति: 8 | 3×4×3=36 | 3×2×9=54 | 27' }, { en: '27 → write 7, carry 2', hi: '27 → 7 लिखें, 2 हासिल' }, { en: '54 + 2 = 56 → write 6, carry 5', hi: '54 + 2 = 56 → 6 लिखें, 5 हासिल' }, { en: '36 + 5 = 41 → write 1, carry 4', hi: '36 + 5 = 41 → 1 लिखें, 4 हासिल' }, '8 + 4 = 12']}
      result="23³ = 12167 ✓"
    />
    <ExampleCard
      title={{ en: "Example 3: 11³", hi: "उदाहरण 3: 11³" }}
      lines={['a=1, b=1', { en: 'Row: 1 | 3 | 3 | 1', hi: 'पंक्ति: 1 | 3 | 3 | 1' }, { en: 'No carries needed', hi: 'कोई हासिल नहीं चाहिए' }]}
      result="11³ = 1331 ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0, lineHeight: 1.7 }}>
        💡 <BiText en="The pattern" hi="पैटर्न" /> <strong>a³ | 3a²b | 3ab² | b³</strong> <BiText en="comes directly from the algebraic expansion of (a+b)³. Vedic Maths uses the same algebra — just faster!" hi="यह सीधे (a+b)³ के बीजीय विस्तार से आता है। वैदिक गणित वही बीजगणित उपयोग करता है — बस तेज़ी से!" />
      </p>
    </div>
  </>
);

// ── L2_05 ─────────────────────────────────────────────────────────────────────

const L2_05_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Vilokanam</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="Mere observation" hi="केवल अवलोकन" /></div>
    </div>

    <SectionTitle>{{ en: "The Technique — Perfect Square Roots", hi: "तकनीक — पूर्ण वर्गमूल" }}</SectionTitle>
    <StepBox number={1} text={{ en: "Split the number into pairs from the RIGHT", hi: "संख्या को दाईं ओर से जोड़ों में बाँटें" }} example="1764 → 17 | 64" />
    <StepBox number={2} text={{ en: "Find the largest integer whose square ≤ the left pair", hi: "वह सबसे बड़ा पूर्णांक ज्ञात करें जिसका वर्ग बायें जोड़े से कम या बराबर हो" }} example={{ en: "17: largest n where n² ≤ 17 → n=4 (4²=16). This is the FIRST digit.", hi: "17: वह सबसे बड़ा n जहाँ n² ≤ 17 → n=4 (4²=16)। यह पहला अंक है।" }} />
    <StepBox number={3} text={{ en: "Look at the LAST digit of the number to find possible last digits of the answer", hi: "संख्या का अंतिम अंक देखकर उत्तर के संभावित अंतिम अंक ज्ञात करें" }} />
    <StepBox number={4} text={{ en: "Check which option is correct by squaring", hi: "वर्ग करके जाँचें कि कौन-सा विकल्प सही है" }} example={{ en: "For 1764: first digit=4, last digit 4 → ends in 2 or 8. Test 42: 42²=1764 ✓", hi: "1764 के लिए: पहला अंक=4, अंतिम अंक 4 → उत्तर 2 या 8 पर समाप्त। जाँच 42: 42²=1764 ✓" }} />

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: √1764", hi: "उदाहरण 1: √1764" }}
      lines={[{ en: 'Pairs: 17 | 64', hi: 'जोड़े: 17 | 64' }, { en: 'First digit: 4 (4²=16 ≤ 17)', hi: 'पहला अंक: 4 (4²=16 ≤ 17)' }, { en: 'Last digit of 1764 = 4 → answer ends in 2 or 8', hi: '1764 का अंतिम अंक = 4 → उत्तर 2 या 8 पर समाप्त' }, { en: 'Test 42: 42² = 1764 ✓', hi: 'जाँच 42: 42² = 1764 ✓' }]}
      result="√1764 = 42 ✓"
    />
    <ExampleCard
      title={{ en: "Example 2: √5625", hi: "उदाहरण 2: √5625" }}
      lines={[{ en: 'Pairs: 56 | 25', hi: 'जोड़े: 56 | 25' }, { en: 'First digit: 7 (7²=49 ≤ 56, 8²=64 > 56)', hi: 'पहला अंक: 7 (7²=49 ≤ 56, 8²=64 > 56)' }, { en: 'Last digit 5 → answer ends in 5', hi: 'अंतिम अंक 5 → उत्तर 5 पर समाप्त' }, { en: 'Answer: 75 → 75² = 5625 ✓', hi: 'उत्तर: 75 → 75² = 5625 ✓' }]}
      result="√5625 = 75 ✓"
    />
    <ExampleCard
      title={{ en: "Example 3: √9801", hi: "उदाहरण 3: √9801" }}
      lines={[{ en: 'Pairs: 98 | 01', hi: 'जोड़े: 98 | 01' }, { en: 'First digit: 9 (9²=81 ≤ 98)', hi: 'पहला अंक: 9 (9²=81 ≤ 98)' }, { en: 'Last digit 1 → ends in 1 or 9', hi: 'अंतिम अंक 1 → 1 या 9 पर समाप्त' }, { en: 'Test 99: 99² = 9801 ✓', hi: 'जाँच 99: 99² = 9801 ✓' }]}
      result="√9801 = 99 ✓"
    />

    <SectionTitle>{{ en: "Last Digit Reference Table", hi: "अंतिम अंक संदर्भ तालिका" }}</SectionTitle>
    <div style={{ background: 'white', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: 16 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#F0F4FF' }}>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#0A1628' }}><BiText en="Number ends in" hi="संख्या का अंतिम अंक" /></th>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#0A1628' }}><BiText en="Square root ends in" hi="वर्गमूल का अंतिम अंक" /></th>
          </tr>
        </thead>
        <tbody>
          {[
            ['0', '0'], ['1', '1 or 9'], ['4', '2 or 8'],
            ['5', '5'], ['6', '4 or 6'], ['9', '3 or 7'],
          ].map(([num, root], i) => (
            <tr key={num} style={{ borderTop: '1px solid rgba(30,64,175,0.08)', background: i % 2 ? 'rgba(30,64,175,0.02)' : 'white' }}>
              <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#1E40AF' }}>{num}</td>
              <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: '#0A1628' }}>{root}</td>
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
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="Mere observation" hi="केवल अवलोकन" /></div>
    </div>

    <SectionTitle>{{ en: "The Technique — Perfect Cube Roots", hi: "तकनीक — पूर्ण घनमूल" }}</SectionTitle>
    <StepBox number={1} text={{ en: "Split into groups of 3 from the RIGHT", hi: "दाईं ओर से 3-3 अंकों के समूह बनाएँ" }} example="17576 → 17 | 576" />
    <StepBox number={2} text={{ en: "Find cube root of the LEFT group", hi: "बायें समूह का घनमूल ज्ञात करें" }} example={{ en: "17: 2³=8, 3³=27. Since 8 ≤ 17 < 27, first digit = 2", hi: "17: 2³=8, 3³=27। चूँकि 8 ≤ 17 < 27, पहला अंक = 2" }} />
    <StepBox number={3} text={{ en: "Look at the LAST digit of the number to find the cube root's last digit (unique — no ambiguity!)", hi: "संख्या का अंतिम अंक देखकर घनमूल का अंतिम अंक ज्ञात करें (हर अंक अलग है — कोई भ्रम नहीं!)" }} />
    <StepBox number={4} text={{ en: "Combine: first digit + last digit = answer", hi: "जोड़ें: पहला अंक + अंतिम अंक = उत्तर" }} />

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: ∛17576", hi: "उदाहरण 1: ∛17576" }}
      lines={[{ en: 'Groups: 17 | 576', hi: 'समूह: 17 | 576' }, { en: 'First digit: 2 (2³=8 ≤ 17 < 27=3³)', hi: 'पहला अंक: 2 (2³=8 ≤ 17 < 27=3³)' }, { en: 'Last digit of 17576 = 6 → cube root ends in 6', hi: '17576 का अंतिम अंक = 6 → घनमूल 6 पर समाप्त' }, { en: 'Answer: 26 → 26³ = 17576 ✓', hi: 'उत्तर: 26 → 26³ = 17576 ✓' }]}
      result="∛17576 = 26 ✓"
    />
    <ExampleCard
      title={{ en: "Example 2: ∛74088", hi: "उदाहरण 2: ∛74088" }}
      lines={[{ en: 'Groups: 74 | 088', hi: 'समूह: 74 | 088' }, { en: 'First digit: 4 (4³=64 ≤ 74 < 125=5³)', hi: 'पहला अंक: 4 (4³=64 ≤ 74 < 125=5³)' }, { en: 'Last digit 8 → cube root ends in 2', hi: 'अंतिम अंक 8 → घनमूल 2 पर समाप्त' }, { en: 'Answer: 42 → 42³ = 74088 ✓', hi: 'उत्तर: 42 → 42³ = 74088 ✓' }]}
      result="∛74088 = 42 ✓"
    />
    <ExampleCard
      title={{ en: "Example 3: ∛19683", hi: "उदाहरण 3: ∛19683" }}
      lines={[{ en: 'Groups: 19 | 683', hi: 'समूह: 19 | 683' }, { en: 'First digit: 2 (2³=8 ≤ 19 < 27=3³)', hi: 'पहला अंक: 2 (2³=8 ≤ 19 < 27=3³)' }, { en: 'Last digit 3 → cube root ends in 7', hi: 'अंतिम अंक 3 → घनमूल 7 पर समाप्त' }, { en: 'Answer: 27 → 27³ = 19683 ✓', hi: 'उत्तर: 27 → 27³ = 19683 ✓' }]}
      result="∛19683 = 27 ✓"
    />

    <SectionTitle>{{ en: "Cube Last Digit Reference Table", hi: "घन का अंतिम अंक संदर्भ तालिका" }}</SectionTitle>
    <div style={{ background: 'white', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: 16 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#F0F4FF' }}>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#0A1628' }}><BiText en="Number ends in" hi="संख्या का अंतिम अंक" /></th>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#0A1628' }}><BiText en="Cube root ends in" hi="घनमूल का अंतिम अंक" /></th>
          </tr>
        </thead>
        <tbody>
          {[
            ['1','1'],['2','8'],['3','7'],['4','4'],['5','5'],
            ['6','6'],['7','3'],['8','2'],['9','9'],['0','0'],
          ].map(([num, root], i) => (
            <tr key={num} style={{ borderTop: '1px solid rgba(30,64,175,0.08)', background: i % 2 ? 'rgba(30,64,175,0.02)' : 'white' }}>
              <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#1E40AF' }}>{num}</td>
              <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: '#0A1628' }}>{root}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', marginTop: 12, marginBottom: 0, fontStyle: 'italic' }}>
        <BiText en="Unlike square roots, each cube root last digit is" hi="वर्गमूल के विपरीत, घनमूल का हर अंतिम अंक अलग होता है" /> <strong><BiText en="unique" hi="अलग" /></strong> <BiText en="— no ambiguity! This makes cube roots even faster." hi="— कोई भ्रम नहीं! इससे घनमूल और भी तेज़ निकलते हैं।" />
      </p>
    </div>
  </>
);

// ── L2_07 ─────────────────────────────────────────────────────────────────────

const L2_07_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Gunita Samuchyah</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="The product of the sum equals the sum of the product" hi="योग का गुणनफल, गुणनफलों के योग के बराबर होता है" /></div>
    </div>

    <SectionTitle>{{ en: "The Technique — Digit Sum Verification", hi: "तकनीक — अंकयोग सत्यापन" }}</SectionTitle>
    <StepBox number={1} text={{ en: "Find digit sum of each input number", hi: "हर इनपुट संख्या का अंकयोग ज्ञात करें" }} example={{ en: "Keep adding digits until single digit", hi: "एक अंक आने तक अंक जोड़ते रहें" }} />
    <StepBox number={2} text={{ en: "Perform the same operation on the digit sums", hi: "अंकयोग पर भी वही क्रिया करें" }} />
    <StepBox number={3} text={{ en: "Find digit sum of your answer", hi: "अपने उत्तर का अंकयोग ज्ञात करें" }} />
    <StepBox number={4} text={{ en: "If they match — answer is probably correct! If they don't match — answer is definitely wrong!", hi: "अगर दोनों मेल खाएँ — उत्तर शायद सही है! अगर न मेल खाएँ — उत्तर निश्चित रूप से गलत है!" }} />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 8 }}><BiText en="Special Rules" hi="विशेष नियम" /></div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', lineHeight: 1.8 }}>
        • If digit sum is 9, treat as 0 for multiplication (9 × anything = 9, but use 0 for verification)<br />
        • This method catches ~89% of errors instantly<br />
        • Cannot catch transposition errors (e.g. 1234 vs 1243 have same digit sum)
      </div>
    </div>

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: Verify 236 × 47 = 11092", hi: "उदाहरण 1: 236 × 47 = 11092 की जाँच" }}
      lines={['DS(236) = 2+3+6 = 11 → 2', 'DS(47) = 4+7 = 11 → 2', '2 × 2 = 4', 'DS(11092) = 1+1+0+9+2 = 13 → 4 ✓']}
      result={{ en: "Answer is likely correct ✓", hi: "उत्तर संभवतः सही है ✓" }}
    />
    <ExampleCard
      title={{ en: "Example 2: Spot error: 158 × 43 = 6784 (wrong!)", hi: "उदाहरण 2: त्रुटि पहचानें: 158 × 43 = 6784 (गलत!)" }}
      lines={['DS(158) = 14 → 5', 'DS(43) = 7', '5 × 7 = 35 → 8', 'DS(6784) = 25 → 7', { en: '8 ≠ 7 → Answer is WRONG! Correct: 158 × 43 = 6794', hi: '8 ≠ 7 → उत्तर गलत है! सही: 158 × 43 = 6794' }]}
      result={{ en: "Error detected! ✗", hi: "त्रुटि मिली! ✗" }}
    />
    <ExampleCard
      title={{ en: "Example 3: Verify 4567 + 3891 = 8458", hi: "उदाहरण 3: 4567 + 3891 = 8458 की जाँच" }}
      lines={['DS(4567) = 22 → 4', 'DS(3891) = 21 → 3', '4 + 3 = 7', 'DS(8458) = 25 → 7 ✓']}
      result={{ en: "Addition verified ✓", hi: "जोड़ सत्यापित ✓" }}
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 8 }}><BiText en="When to use digit sum verification:" hi="अंकयोग सत्यापन कब उपयोग करें:" /></div>
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
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="Proportionality" hi="अनुपातिकता" /></div>
    </div>

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 8 }}><BiText en="The Core Insight" hi="मुख्य विचार" /></div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1E40AF', lineHeight: 2 }}>
        <div><BiText en="5 = 10÷2 → ×5 = ×10 then ÷2" hi="5 = 10÷2 → ×5 = ×10 फिर ÷2" /></div>
        <div><BiText en="25 = 100÷4 → ×25 = ×100 then ÷4" hi="25 = 100÷4 → ×25 = ×100 फिर ÷4" /></div>
        <div><BiText en="125 = 1000÷8 → ×125 = ×1000 then ÷8" hi="125 = 1000÷8 → ×125 = ×1000 फिर ÷8" /></div>
      </div>
    </div>

    <SectionTitle>{{ en: "Multiply by 5", hi: "5 से गुणा" }}</SectionTitle>
    <StepBox number={1} text={{ en: "If number is EVEN: halve it, then append 0", hi: "संख्या सम हो: उसे आधा करें, फिर 0 लगाएँ" }} example={{ en: "48 × 5 → 48÷2=24 → append 0 → 240", hi: "48 × 5 → 48÷2=24 → 0 लगाएँ → 240" }} />
    <StepBox number={2} text={{ en: "If number is ODD: subtract 1, halve, append 5", hi: "संख्या विषम हो: 1 घटाएँ, आधा करें, 5 लगाएँ" }} example={{ en: "47 × 5 → 46÷2=23 → append 5 → 235", hi: "47 × 5 → 46÷2=23 → 5 लगाएँ → 235" }} />

    <SectionTitle>{{ en: "Multiply by 25", hi: "25 से गुणा" }}</SectionTitle>
    <StepBox number={1} text={{ en: "Divide by 4 (divide by 2 twice)", hi: "4 से भाग दें (2 से दो बार भाग दें)" }} />
    <StepBox number={2} text={{ en: "Append 00. For remainders: rem 1→25, rem 2→50, rem 3→75", hi: "00 लगाएँ। शेषफल के लिए: शेष 1→25, शेष 2→50, शेष 3→75" }} example={{ en: "46 × 25: 46÷4=11 rem 2 → 11|50 → 1150", hi: "46 × 25: 46÷4=11 शेष 2 → 11|50 → 1150" }} />

    <SectionTitle>{{ en: "Multiply by 125", hi: "125 से गुणा" }}</SectionTitle>
    <StepBox number={1} text={{ en: "Divide by 8", hi: "8 से भाग दें" }} />
    <StepBox number={2} text={{ en: "Append 000", hi: "000 लगाएँ" }} example="56 × 125 → 56÷8=7 → 7000" />

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard title={{ en: "Example 1: 84 × 5", hi: "उदाहरण 1: 84 × 5" }} lines={['84 ÷ 2 = 42', { en: 'Append 0 → 420', hi: '0 लगाएँ → 420' }]} result="84 × 5 = 420 ✓" />
    <ExampleCard title={{ en: "Example 2: 68 × 25", hi: "उदाहरण 2: 68 × 25" }} lines={['68 ÷ 4 = 17', { en: 'Append 00 → 1700', hi: '00 लगाएँ → 1700' }]} result="68 × 25 = 1700 ✓" />
    <ExampleCard title={{ en: "Example 3: 96 × 125", hi: "उदाहरण 3: 96 × 125" }} lines={['96 ÷ 8 = 12', { en: 'Append 000 → 12000', hi: '000 लगाएँ → 12000' }]} result="96 × 125 = 12000 ✓" />

    <SectionTitle>{{ en: "Speed Reference Table", hi: "गति संदर्भ तालिका" }}</SectionTitle>
    <div style={{ background: 'white', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: 16, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#F0F4FF' }}>
            {[{ en: 'Multiplier', hi: 'गुणक' }, { en: 'Operation', hi: 'संक्रिया' }, { en: 'Example', hi: 'उदाहरण' }].map(h => (
              <th key={h.en} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#0A1628' }}><BiText en={h.en} hi={h.hi} /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ['×5', { en: '÷2 then ×10', hi: '÷2, फिर ×10' }, '46×5 = 230'],
            ['×25', { en: '÷4 then ×100', hi: '÷4, फिर ×100' }, '44×25 = 1100'],
            ['×125', { en: '÷8 then ×1000', hi: '÷8, फिर ×1000' }, '48×125 = 6000'],
            ['×50', { en: '÷2 then ×100', hi: '÷2, फिर ×100' }, '46×50 = 2300'],
            ['×250', { en: '÷4 then ×1000', hi: '÷4, फिर ×1000' }, '44×250 = 11000'],
          ].map(([mul, op, ex], i) => (
            <tr key={mul} style={{ borderTop: '1px solid rgba(30,64,175,0.08)', background: i % 2 ? 'rgba(30,64,175,0.02)' : 'white' }}>
              <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#1E40AF' }}>{mul}</td>
              <td style={{ padding: '10px 12px', color: '#4B5563' }}><BiText en={op.en} hi={op.hi} /></td>
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
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="Transpose and apply" hi="परिवर्तित करें और लागू करें" /></div>
    </div>

    <SectionTitle>{{ en: "The Technique — 2-Digit Divisors (11–19)", hi: "तकनीक — 2-अंकीय भाजक (11–19)" }}</SectionTitle>
    <StepBox number={1} text={{ en: "Flag digit = all digits of divisor after first digit, with signs flipped", hi: "फ़्लैग अंक = भाजक के पहले अंक के बाद के सभी अंक, चिह्न बदलकर" }} example={{ en: "Divisor 13: flag = −3  |  Divisor 17: flag = −7", hi: "भाजक 13: फ़्लैग = −3  |  भाजक 17: फ़्लैग = −7" }} />
    <StepBox number={2} text={{ en: "Set up: write dividend digits, mark last digit as remainder zone", hi: "व्यवस्थित करें: भाज्य के अंक लिखें, अंतिम अंक को शेषफल क्षेत्र मानें" }} />
    <StepBox number={3} text={{ en: "Bring first dividend digit down as first quotient digit", hi: "भाज्य का पहला अंक नीचे लाएँ और उसे पहला भागफल अंक मानें" }} />
    <StepBox number={4} text={{ en: "Multiply quotient digit by flag, add to next dividend digit to get next quotient digit", hi: "भागफल अंक को फ़्लैग से गुणा करें और अगले भाज्य अंक में जोड़ें, अगला भागफल अंक पाने के लिए" }} />
    <StepBox number={5} text={{ en: "Last calculation gives the remainder", hi: "अंतिम गणना शेषफल देती है" }} />
    <StepBox number={6} text={{ en: "If a value goes negative or the remainder is ≥ the divisor: work right to left, carrying/borrowing between columns until every digit is valid", hi: "अगर कोई मान ऋणात्मक हो या शेषफल भाजक से बड़ा या बराबर हो: दाईं से बाईं ओर काम करें, स्तंभों के बीच हासिल/उधार लेते हुए जब तक हर अंक मान्य न हो जाए" }} example={{ en: "Remainder 13 with divisor 13 → carry 1 left, remainder becomes 0", hi: "शेषफल 13, भाजक 13 → 1 बायें हासिल, शेषफल 0 हो जाता है" }} />

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 156 ÷ 13 (clean, no fix-up needed)", hi: "उदाहरण 1: 156 ÷ 13 (सीधा, फिक्स-अप की ज़रूरत नहीं)" }}
      lines={[
        { en: 'Flag = −3 (divisor 13 = 10+3)', hi: 'फ़्लैग = −3 (भाजक 13 = 10+3)' },
        { en: 'Q1 = first digit = 1   ← this is the TENS digit of the answer', hi: 'Q1 = पहला अंक = 1   ← यह उत्तर का दहाई अंक है' },
        { en: 'Next: 5 + (1 × −3) = 2   ← this is the UNITS digit of the answer', hi: 'अगला: 5 + (1 × −3) = 2   ← यह उत्तर का इकाई अंक है' },
        { en: 'Remainder: 6 + (2 × −3) = 0', hi: 'शेषफल: 6 + (2 × −3) = 0' },
      ]}
      breakdown={[{ label: { en: 'Tens', hi: 'दहाई' }, value: '1' }, { label: { en: 'Units', hi: 'इकाई' }, value: '2' }, { label: { en: 'Remainder', hi: 'शेषफल' }, value: '0' }]}
      result={{ en: "156 ÷ 13 = 12, remainder 0 ✓", hi: "156 ÷ 13 = 12, शेषफल 0 ✓" }}
    />
    <ExampleCard
      title={{ en: "Example 2: 247 ÷ 13 (needs the fix-up step)", hi: "उदाहरण 2: 247 ÷ 13 (फिक्स-अप चरण चाहिए)" }}
      lines={[
        { en: 'Flag = −3 (divisor 13 = 10+3)', hi: 'फ़्लैग = −3 (भाजक 13 = 10+3)' },
        'Q1 = first digit = 2',
        { en: 'Next: 4 + (2 × −3) = −2', hi: 'अगला: 4 + (2 × −3) = −2' },
        { en: 'Remainder (raw): 7 + (−2 × −3) = 13', hi: 'शेषफल (कच्चा): 7 + (−2 × −3) = 13' },
        { en: 'Fix-up: 13 ≥ 13 → carry 1 left, remainder → 0', hi: 'फिक्स-अप: 13 ≥ 13 → 1 बायें हासिल, शेषफल → 0' },
        { en: 'Last digit: −2 + 1 = −1 → still negative, borrow: −1 + 10 = 9   ← this is the UNITS digit of the answer', hi: 'अंतिम अंक: −2 + 1 = −1 → अभी भी ऋणात्मक, उधार: −1 + 10 = 9   ← यह उत्तर का इकाई अंक है' },
        { en: 'First digit: 2 − 1 = 1   ← this is the TENS digit of the answer', hi: 'पहला अंक: 2 − 1 = 1   ← यह उत्तर का दहाई अंक है' },
      ]}
      breakdown={[{ label: { en: 'Tens', hi: 'दहाई' }, value: '1' }, { label: { en: 'Units', hi: 'इकाई' }, value: '9' }, { label: { en: 'Remainder', hi: 'शेषफल' }, value: '0' }]}
      result={{ en: "247 ÷ 13 = 19, remainder 0 ✓", hi: "247 ÷ 13 = 19, शेषफल 0 ✓" }}
    />
    <ExampleCard
      title={{ en: "Example 3: 391 ÷ 17 (needs the fix-up step)", hi: "उदाहरण 3: 391 ÷ 17 (फिक्स-अप चरण चाहिए)" }}
      lines={[
        { en: 'Flag = −7 (divisor 17 = 10+7)', hi: 'फ़्लैग = −7 (भाजक 17 = 10+7)' },
        { en: 'Q1 = first digit = 3', hi: 'Q1 = पहला अंक = 3' },
        { en: 'Next: 9 + (3 × −7) = −12', hi: 'अगला: 9 + (3 × −7) = −12' },
        { en: 'Remainder (raw): 1 + (−12 × −7) = 85', hi: 'शेषफल (कच्चा): 1 + (−12 × −7) = 85' },
        { en: 'Fix-up: 85 ÷ 17 = 5 remainder 0 → carry 5 left, remainder → 0', hi: 'फिक्स-अप: 85 ÷ 17 = 5 शेषफल 0 → 5 बायें हासिल, शेषफल → 0' },
        { en: 'Last digit: −12 + 5 = −7 → still negative, borrow: −7 + 10 = 3   ← this is the UNITS digit of the answer', hi: 'अंतिम अंक: −12 + 5 = −7 → अभी भी ऋणात्मक, उधार: −7 + 10 = 3   ← यह उत्तर का इकाई अंक है' },
        { en: 'First digit: 3 − 1 = 2   ← this is the TENS digit of the answer', hi: 'पहला अंक: 3 − 1 = 2   ← यह उत्तर का दहाई अंक है' },
      ]}
      breakdown={[{ label: { en: 'Tens', hi: 'दहाई' }, value: '2' }, { label: { en: 'Units', hi: 'इकाई' }, value: '3' }, { label: { en: 'Remainder', hi: 'शेषफल' }, value: '0' }]}
      result={{ en: "391 ÷ 17 = 23, remainder 0 ✓", hi: "391 ÷ 17 = 23, शेषफल 0 ✓" }}
    />

    <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '14px 16px', marginTop: 8, marginBottom: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
        💡 <strong><BiText en="Why the fix-up step exists:" hi="फिक्स-अप चरण क्यों है:" /></strong> <BiText en="the flag-multiply step can produce a value that's negative or too large to be a single digit. Don't panic — work right to left, borrowing 1 from the column to the left (adding 10 here) or carrying extra into the column to the left, until every digit is valid. Example 1 didn't need this; Examples 2 and 3 both did — you'll get both types of questions, so it's worth being comfortable with each." hi="फ़्लैग-गुणा चरण ऐसा मान दे सकता है जो ऋणात्मक हो या एक अंक के लिए बहुत बड़ा हो। घबराएँ नहीं — दाईं से बाईं ओर काम करें, बायीं स्तंभ से 1 उधार लेते हुए (यहाँ 10 जोड़ें) या बायीं स्तंभ में अतिरिक्त हासिल ले जाते हुए, जब तक हर अंक मान्य न हो जाए। उदाहरण 1 को इसकी ज़रूरत नहीं थी; उदाहरण 2 और 3 को थी — आपको दोनों तरह के प्रश्न मिलेंगे, इसलिए दोनों में सहज होना उपयोगी है।" />
      </p>
    </div>

    <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '14px 16px', marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
        💡 <strong><BiText en="Exam Tip:" hi="परीक्षा सुझाव:" /></strong> <BiText en="Paravartya division is fastest for divisors 11–19. For larger divisors, estimate using multiples and subtract. Practice these examples until you can solve each in 20 seconds." hi="11–19 भाजकों के लिए पारावर्त्य भाग सबसे तेज़ है। बड़े भाजकों के लिए गुणजों से अनुमान लगाकर घटाएँ। इन उदाहरणों का अभ्यास करें जब तक हर एक 20 सेकंड में हल न हो जाए।" />
      </p>
    </div>
  </>
);

// ── L2_10 ─────────────────────────────────────────────────────────────────────

const L2_10_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Anurupyena</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="Proportionality" hi="अनुपातिकता" /></div>
    </div>

    <SectionTitle>{{ en: "Vedic Fraction Addition", hi: "वैदिक भिन्न योग" }}</SectionTitle>
    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: '#1E40AF', textAlign: 'center', marginBottom: 8 }}>a/b + c/d = (a×d + b×c) / (b×d)</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563' }}><BiText en="Cross-multiply numerators, multiply denominators — done in one step!" hi="अंश क्रॉस-गुणा करें, हर गुणा करें — एक ही चरण में!" /></div>
    </div>

    <SectionTitle>{{ en: "Addition Steps", hi: "योग के चरण" }}</SectionTitle>
    <StepBox number={1} text={{ en: "Cross multiply: top-left × bottom-right + bottom-left × top-right", hi: "क्रॉस गुणा करें: ऊपर-बायाँ × नीचे-दायाँ + नीचे-बायाँ × ऊपर-दायाँ" }} example={{ en: "Numerator = a×d + b×c", hi: "अंश = a×d + b×c" }} />
    <StepBox number={2} text={{ en: "Multiply denominators for the new denominator", hi: "नया हर पाने के लिए हरों को गुणा करें" }} example={{ en: "Denominator = b×d", hi: "हर = b×d" }} />
    <StepBox number={3} text={{ en: "Simplify if needed", hi: "ज़रूरत हो तो सरल करें" }} />

    <SectionTitle>{{ en: "Subtraction", hi: "घटाव" }}</SectionTitle>
    <StepBox number={1} text={{ en: "Same process but subtract in Step 1", hi: "वही प्रक्रिया, पर चरण 1 में घटाएँ" }} example="a/b − c/d = (a×d − b×c) / (b×d)" />

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 1/3 + 1/4", hi: "उदाहरण 1: 1/3 + 1/4" }}
      lines={[{ en: 'Numerator: 1×4 + 3×1 = 7', hi: 'अंश: 1×4 + 3×1 = 7' }, { en: 'Denominator: 3×4 = 12', hi: 'हर: 3×4 = 12' }]}
      result="1/3 + 1/4 = 7/12 ✓"
    />
    <ExampleCard
      title={{ en: "Example 2: 2/5 + 3/7", hi: "उदाहरण 2: 2/5 + 3/7" }}
      lines={[{ en: 'Numerator: 2×7 + 5×3 = 14+15 = 29', hi: 'अंश: 2×7 + 5×3 = 14+15 = 29' }, { en: 'Denominator: 5×7 = 35', hi: 'हर: 5×7 = 35' }]}
      result="2/5 + 3/7 = 29/35 ✓"
    />
    <ExampleCard
      title={{ en: "Example 3: 3/4 − 1/6", hi: "उदाहरण 3: 3/4 − 1/6" }}
      lines={[{ en: 'Numerator: 3×6 − 4×1 = 18−4 = 14', hi: 'अंश: 3×6 − 4×1 = 18−4 = 14' }, { en: 'Denominator: 4×6 = 24', hi: 'हर: 4×6 = 24' }, { en: 'Simplify: 14/24 = 7/12', hi: 'सरल करें: 14/24 = 7/12' }]}
      result="3/4 − 1/6 = 7/12 ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 8 }}><BiText en="Vedic vs Traditional" hi="वैदिक बनाम पारंपरिक" /></div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', lineHeight: 1.8 }}>
        <div><BiText en="Traditional: find LCM → convert → add → simplify" hi="पारंपरिक: LCM ज्ञात करें → बदलें → जोड़ें → सरल करें" /></div>
        <div><BiText en="Vedic: cross-multiply → done! (simplify at end)" hi="वैदिक: क्रॉस-गुणा → हो गया! (अंत में सरल करें)" /></div>
        <div style={{ marginTop: 8, color: '#1E40AF', fontWeight: 600 }}><BiText en="For 2 fractions, Vedic is ALWAYS faster. For 3+ fractions, combine two at a time." hi="2 भिन्नों के लिए वैदिक विधि हमेशा तेज़ है। 3 या अधिक भिन्नों के लिए एक बार में दो को जोड़ें।" /></div>
      </div>
    </div>
  </>
);

// ── L2_11 — Antyayor Dashakepi ───────────────────────────────────────────────

const L2_11_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Antyayor Dashakepi</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="When the last digits (antyayo) add up to ten (dasha)" hi="जब अंतिम अंक (अंत्यो) मिलकर दस (दशा) बनें" /></div>
    </div>

    <SectionTitle>{{ en: "When to Use This Sutra", hi: "इस सूत्र का उपयोग कब करें" }}</SectionTitle>
    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#0A1628', margin: '0 0 10px 0', lineHeight: 1.7 }}>
        <BiText en="Use Antyayor Dashakepi when" hi="अंत्ययोर्दशकेपि का उपयोग तब करें जब" /> <strong><BiText en="two numbers share the same tens digit" hi="दो संख्याओं का दहाई अंक समान हो" /></strong> <BiText en="and their" hi="और उनके" /> <strong><BiText en="units digits add to 10" hi="इकाई अंकों का योग 10 हो" /></strong>.
      </p>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: '#1E40AF' }}>
        <div><BiText en="63 × 67 → tens: 6 = 6 ✓ and 3+7=10 ✓" hi="63 × 67 → दहाई: 6 = 6 ✓ और 3+7=10 ✓" /></div>
        <div style={{ marginTop: 6 }}><BiText en="24 × 26 → tens: 2 = 2 ✓ and 4+6=10 ✓" hi="24 × 26 → दहाई: 2 = 2 ✓ और 4+6=10 ✓" /></div>
      </div>
    </div>

    <SectionTitle>{{ en: "The Formula", hi: "सूत्र" }}</SectionTitle>
    <div style={{ background: '#0A1628', borderRadius: 12, padding: 20, marginBottom: 20, textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: '#D9A441', marginBottom: 12 }}>
        (T × (T+1)) | (A × B)
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, textAlign: 'left', display: 'inline-block' }}>
        <div><BiText en="T = tens digit (same for both numbers)" hi="T = दहाई अंक (दोनों संख्याओं का समान)" /></div>
        <div><BiText en="A = units digit of first number" hi="A = पहली संख्या का इकाई अंक" /></div>
        <div><BiText en="B = units digit of second number (A+B=10)" hi="B = दूसरी संख्या का इकाई अंक (A+B=10)" /></div>
        <div><BiText en="| = join the two parts (right part: always 2 digits)" hi="| = दोनों भागों को जोड़ें (दायाँ भाग: हमेशा 2 अंक)" /></div>
      </div>
    </div>

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 63 × 67", hi: "उदाहरण 1: 63 × 67" }}
      lines={[{ en: 'Same tens digit: 6', hi: 'समान दहाई अंक: 6' }, { en: 'Units: 3 + 7 = 10 ✓', hi: 'इकाई: 3 + 7 = 10 ✓' }, { en: 'Left part: 6 × (6+1) = 6 × 7 = 42', hi: 'बायाँ भाग: 6 × (6+1) = 6 × 7 = 42' }, { en: 'Right part: 3 × 7 = 21', hi: 'दायाँ भाग: 3 × 7 = 21' }, { en: 'Join: 42|21 = 4221', hi: 'जोड़: 42|21 = 4221' }]}
      result="63 × 67 = 4221 ✓"
    />
    <ExampleCard
      title={{ en: "Example 2: 24 × 26", hi: "उदाहरण 2: 24 × 26" }}
      lines={[{ en: 'Same tens digit: 2', hi: 'समान दहाई अंक: 2' }, { en: 'Units: 4 + 6 = 10 ✓', hi: 'इकाई: 4 + 6 = 10 ✓' }, { en: 'Left part: 2 × 3 = 6', hi: 'बायाँ भाग: 2 × 3 = 6' }, { en: 'Right part: 4 × 6 = 24', hi: 'दायाँ भाग: 4 × 6 = 24' }, { en: 'Join: 6|24 = 624', hi: 'जोड़: 6|24 = 624' }]}
      result="24 × 26 = 624 ✓"
    />
    <ExampleCard
      title={{ en: "Example 3: 89 × 81", hi: "उदाहरण 3: 89 × 81" }}
      lines={[{ en: 'Same tens digit: 8', hi: 'समान दहाई अंक: 8' }, { en: 'Units: 9 + 1 = 10 ✓', hi: 'इकाई: 9 + 1 = 10 ✓' }, { en: 'Left part: 8 × 9 = 72', hi: 'बायाँ भाग: 8 × 9 = 72' }, { en: 'Right part: 9 × 1 = 09 (pad to 2 digits!)', hi: 'दायाँ भाग: 9 × 1 = 09 (2 अंकों में लिखें!)' }, { en: 'Join: 72|09 = 7209', hi: 'जोड़: 72|09 = 7209' }]}
      result="89 × 81 = 7209 ✓"
    />

    <SectionTitle>{{ en: "⚠️ Common Mistake", hi: "⚠️ सामान्य गलती" }}</SectionTitle>
    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#B91C1C', margin: '0 0 8px 0', fontWeight: 600 }}>
        <BiText en="Always write the right part as 2 digits." hi="हमेशा दायाँ भाग 2 अंकों में लिखें।" />
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#374151', margin: 0 }}>
        <BiText en="For 89 × 81: right part = 9×1 = 9 → write as 09, not 9." hi="89 × 81 के लिए: दायाँ भाग = 9×1 = 9 → 09 लिखें, 9 नहीं।" /><br />
        <BiText en="Without padding: 7209. If you write 729, that's completely wrong." hi="शून्य लगाए बिना: 7209। अगर आप 729 लिखें, तो यह पूरी तरह गलत है।" />
      </p>
    </div>

    <SectionTitle>{{ en: "Why It Works", hi: "यह कैसे काम करता है" }}</SectionTitle>
    <div style={{ background: '#F0FDF4', borderRadius: 12, padding: 16, marginBottom: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#065F46', margin: 0, lineHeight: 1.7 }}>
        <BiText en="This is the algebraic identity" hi="यह बीजीय सर्वसमिका है" /> <strong>(10T + A)(10T + B)</strong> <BiText en="where A+B=10." hi="जहाँ A+B=10।" /><br />
        <BiText en="Expanding: 100T² + 10T(A+B) + AB = 100T² + 100T + AB = 100T(T+1) + AB." hi="विस्तार: 100T² + 10T(A+B) + AB = 100T² + 100T + AB = 100T(T+1) + AB।" /><br />
        <BiText en="That's exactly T×(T+1) in the hundreds + AB in the units — what the formula gives you." hi="यह ठीक सैकड़ों में T×(T+1) और इकाई में AB है — यही सूत्र देता है।" />
      </p>
    </div>
  </>
);

// ── L3_11 — Shunyam Saamyasamuccaye ────────────────────────────────────────

const L3_11_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Shunyam Saamyasamuccaye</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="When the sums are the same, that sum is zero" hi="जब योग समान हों, तो वह योग शून्य होता है" /></div>
    </div>

    <SectionTitle>{{ en: "When to Use This Sutra", hi: "इस सूत्र का उपयोग कब करें" }}</SectionTitle>
    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#0A1628', margin: 0, lineHeight: 1.7 }}>
        <BiText en="Use it when two fractions have the same numerator and the equation is 1/A + 1/B = 0." hi="इसका उपयोग तब करें जब दो भिन्नों के अंश समान हों और समीकरण 1/A + 1/B = 0 हो।" />
      </p>
    </div>

    <SectionTitle>{{ en: "The Method", hi: "विधि" }}</SectionTitle>
    <div style={{ background: '#0A1628', borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.9 }}>
        <div><BiText en="1. Combine: 1/A + 1/B = (A + B) / (AB)." hi="1. संयोजित करें: 1/A + 1/B = (A + B) / (AB)।" /></div>
        <div><BiText en="2. The fraction is zero only when its numerator is zero, so A + B = 0." hi="2. भिन्न तभी शून्य होता है जब उसका अंश शून्य हो, इसलिए A + B = 0।" /></div>
        <div><BiText en="3. Solve the simple equation A + B = 0." hi="3. सरल समीकरण A + B = 0 हल करें।" /></div>
      </div>
    </div>

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 1/(x + 1) + 1/(x + 3) = 0", hi: "उदाहरण 1: 1/(x + 1) + 1/(x + 3) = 0" }}
      lines={[{ en: 'Add the denominators: (x + 1) + (x + 3) = 2x + 4', hi: 'हर जोड़ें: (x + 1) + (x + 3) = 2x + 4' }, { en: 'Set to zero: 2x + 4 = 0', hi: 'शून्य के बराबर रखें: 2x + 4 = 0' }, 'x = −2', { en: 'Check: 1/(−1) + 1/1 = 0 ✓', hi: 'जाँच: 1/(−1) + 1/1 = 0 ✓' }]}
      result="x = −2"
    />
    <ExampleCard
      title={{ en: "Example 2: 1/(3x − 1) + 1/(4x − 1) = 0", hi: "उदाहरण 2: 1/(3x − 1) + 1/(4x − 1) = 0" }}
      lines={[{ en: 'Add the denominators: 7x − 2 = 0', hi: 'हर जोड़ें: 7x − 2 = 0' }, 'x = 2/7', { en: 'Check: 3x − 1 = −1/7 gives −7; 4x − 1 = 1/7 gives 7; sum 0 ✓', hi: 'जाँच: 3x − 1 = −1/7 से −7; 4x − 1 = 1/7 से 7; योग 0 ✓' }]}
      result="x = 2/7"
    />

    <SectionTitle>{{ en: "⚠️ Common Mistake", hi: "⚠️ सामान्य गलती" }}</SectionTitle>
    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#B91C1C', margin: '0 0 8px 0', fontWeight: 600 }}>
        <BiText en="Add the denominators, not the numerators." hi="अंश नहीं, हर जोड़ें।" />
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#374151', margin: 0 }}>
        <BiText en="1 + 1 = 2 is not zero. The equation is about the denominators summing to zero." hi="1 + 1 = 2 शून्य नहीं है। यह समीकरण हरों के योग के शून्य होने के बारे में है।" />
      </p>
    </div>

    <SectionTitle>{{ en: "Why It Works", hi: "यह कैसे काम करता है" }}</SectionTitle>
    <div style={{ background: '#F0FDF4', borderRadius: 12, padding: 16, marginBottom: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#065F46', margin: 0, lineHeight: 1.7 }}>
        <BiText en="A fraction (A + B)/(AB) equals zero only when A + B = 0, as long as AB is not zero." hi="भिन्न (A + B)/(AB) तभी शून्य होता है जब A + B = 0 हो, बशर्ते AB शून्य न हो।" />
      </p>
    </div>
  </>
);

// ── L3_12 — Shesanyankena Charamena ────────────────────────────────────────

const L3_12_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Shesanyankena Charamena</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="The remainders, by the last digit" hi="शेषफल, अंतिम अंक के अनुसार" /></div>
    </div>

    <SectionTitle>{{ en: "The Remainder Method for 1/7", hi: "1/7 के लिए शेषफल विधि" }}</SectionTitle>
    <div style={{ background: '#0A1628', borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.9 }}>
        <div><BiText en="1. Start with remainder 1. Multiply the remainder by 10 and divide by 7." hi="1. शेषफल 1 से शुरू करें। शेषफल को 10 से गुणा करें और 7 से भाग दें।" /></div>
        <div><BiText en="2. The quotient digit is the next decimal digit. The new remainder carries on." hi="2. भागफल का अंक अगला दशमलव अंक है। नया शेषफल आगे चलता है।" /></div>
        <div><BiText en="3. Repeat until the remainder returns to 1." hi="3. तब तक दोहराएँ जब तक शेषफल फिर से 1 न हो जाए।" /></div>
      </div>
    </div>

    <SectionTitle>{{ en: "Worked Example", hi: "हल किया गया उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "1/7 step by step", hi: "1/7 चरण दर चरण" }}
      lines={[{ en: '10 ÷ 7 = 1 remainder 3 → digit 1', hi: '10 ÷ 7 = 1 शेषफल 3 → अंक 1' }, { en: '30 ÷ 7 = 4 remainder 2 → digit 4', hi: '30 ÷ 7 = 4 शेषफल 2 → अंक 4' }, { en: '20 ÷ 7 = 2 remainder 6 → digit 2', hi: '20 ÷ 7 = 2 शेषफल 6 → अंक 2' }, { en: '60 ÷ 7 = 8 remainder 4 → digit 8', hi: '60 ÷ 7 = 8 शेषफल 4 → अंक 8' }, { en: '40 ÷ 7 = 5 remainder 5 → digit 5', hi: '40 ÷ 7 = 5 शेषफल 5 → अंक 5' }, { en: '50 ÷ 7 = 7 remainder 1 → digit 7', hi: '50 ÷ 7 = 7 शेषफल 1 → अंक 7' }]}
      result={{ en: "1/7 = 0.142857… (repeats every 6 digits)", hi: "1/7 = 0.142857… (हर 6 अंकों पर दोहराता है)" }}
    />

    <SectionTitle>{{ en: "⚠️ Common Mistake", hi: "⚠️ सामान्य गलती" }}</SectionTitle>
    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#B91C1C', margin: '0 0 8px 0', fontWeight: 600 }}>
        <BiText en="Multiply the remainder by 10 before dividing." hi="भाग से पहले शेषफल को 10 से गुणा करें।" />
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#374151', margin: 0 }}>
        <BiText en="Dividing 1 by 7 directly gives the wrong digit. The decimal digits come from the remainders." hi="1 को सीधे 7 से भाग देने पर गलत अंक आता है। दशमलव अंक शेषफलों से आते हैं।" />
      </p>
    </div>
  </>
);

// ── L3_13 — Puranapuranabhyam ─────────────────────────────────────────────

const L3_13_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Puranapuranabhyam</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="By the completion or non-completion" hi="पूर्ण या अपूर्ण होने से" /></div>
    </div>

    <SectionTitle>{{ en: "The Method", hi: "विधि" }}</SectionTitle>
    <div style={{ background: '#0A1628', borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.9 }}>
        <div><BiText en="1. Take half of the x coefficient and square it: (4 ÷ 2)² = 4." hi="1. x के गुणांक का आधा लें और उसका वर्ग करें: (4 ÷ 2)² = 4।" /></div>
        <div><BiText en="2. Add and subtract that value so the quadratic becomes a perfect square minus a number." hi="2. वह मान जोड़ें और घटाएँ, ताकि द्विघात एक पूर्ण वर्ग में से एक संख्या घटाने जैसा बन जाए।" /></div>
        <div><BiText en="3. Solve the square equals a number, then find x." hi="3. वर्ग बराबर संख्या हल करें, फिर x ज्ञात करें।" /></div>
      </div>
    </div>

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: x² + 4x + 3 = 0", hi: "उदाहरण 1: x² + 4x + 3 = 0" }}
      lines={['x² + 4x + 4 − 1 = 0', '(x + 2)² = 1', 'x + 2 = ±1', { en: 'x = −1 or x = −3', hi: 'x = −1 या x = −3' }]}
      result={{ en: "Roots: −1 and −3", hi: "मूल: −1 और −3" }}
    />
    <ExampleCard
      title={{ en: "Example 2: x² − 4x − 5 = 0", hi: "उदाहरण 2: x² − 4x − 5 = 0" }}
      lines={['x² − 4x + 4 − 9 = 0', '(x − 2)² = 9', 'x − 2 = ±3', { en: 'x = 5 or x = −1', hi: 'x = 5 या x = −1' }]}
      result={{ en: "Roots: 5 and −1", hi: "मूल: 5 और −1" }}
    />

    <SectionTitle>{{ en: "⚠️ Common Mistake", hi: "⚠️ सामान्य गलती" }}</SectionTitle>
    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#B91C1C', margin: '0 0 8px 0', fontWeight: 600 }}>
        <BiText en="When you add a number, you must also subtract it." hi="कोई संख्या जोड़ें तो उसे घटाना भी होगा।" />
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#374151', margin: 0 }}>
        <BiText en="Adding 4 to x² + 4x + 3 changes its value. Adding 4 and subtracting 4 keeps the equation the same." hi="x² + 4x + 3 में 4 जोड़ने से उसका मान बदल जाता है। 4 जोड़ें और 4 घटाएँ, तो समीकरण वही रहता है।" />
      </p>
    </div>
  </>
);

// ── L3_14 — Gunakasamuccayah ─────────────────────────────────────────────

const L3_14_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Gunakasamuccayah</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="The factors of the sum" hi="योग के गुणनखंड" /></div>
    </div>

    <SectionTitle>{{ en: "The Check", hi: "जाँच" }}</SectionTitle>
    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#0A1628', margin: 0, lineHeight: 1.7 }}>
        The sum of the coefficients of a product equals the product of the sums of the coefficients of its factors. For a polynomial p(x), this sum is p(1).
      </p>
    </div>

    <SectionTitle>{{ en: "Worked Example", hi: "हल किया गया उदाहरण" }}</SectionTitle>
    <ExampleCard
      title="x² + 5x + 6"
      lines={[{ en: 'Find factors with product 6 and sum 5: 2 and 3', hi: 'गुणनफल 6 और योग 5 वाले गुणनखंड ज्ञात करें: 2 और 3' }, { en: 'Factorised: (x + 2)(x + 3)', hi: 'गुणनखंड: (x + 2)(x + 3)' }, { en: 'Check: sum of coefficients of x² + 5x + 6 = 12', hi: 'जाँच: x² + 5x + 6 के गुणांकों का योग = 12' }, { en: 'Factor sums: (1 + 2)(1 + 3) = 3 × 4 = 12 ✓', hi: 'गुणनखंडों के योग: (1 + 2)(1 + 3) = 3 × 4 = 12 ✓' }]}
      result="x² + 5x + 6 = (x + 2)(x + 3)"
    />

    <SectionTitle>{{ en: "⚠️ Common Mistake", hi: "⚠️ सामान्य गलती" }}</SectionTitle>
    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#B91C1C', margin: '0 0 8px 0', fontWeight: 600 }}>
        <BiText en="Check the factors before you finish." hi="पूरा करने से पहले गुणनखंड जाँचें।" />
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#374151', margin: 0 }}>
        <BiText en="If the check fails, the factors are wrong. Recheck the product and the sum." hi="अगर जाँच विफल हो, तो गुणनखंड गलत हैं। गुणनफल और योग दोबारा जाँचें।" />
      </p>
    </div>
  </>
);

// ── L2_15 — Yavadunam ─────────────────────────────────────────────────────

const L2_15_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Yavadunam</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="Whatever the extent of its deficiency, lessen it that much" hi="कमी जितनी भी हो, उतनी ही घटाएँ" /></div>
    </div>

    <SectionTitle>{{ en: "The Method", hi: "विधि" }}</SectionTitle>
    <div style={{ background: '#0A1628', borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.9 }}>
        <div><BiText en="1. Find how far the number is from the base (10, 100, 1000): the deficiency d." hi="1. संख्या आधार (10, 100, 1000) से कितनी दूर है, यह ज्ञात करें: कमी d।" /></div>
        <div><BiText en="2. Left part: the number minus d (or plus d if it is above the base)." hi="2. बायाँ भाग: संख्या में से d घटाएँ (अगर आधार से ऊपर हो तो d जोड़ें)।" /></div>
        <div><BiText en="3. Right part: d squared, padded to the same number of digits as the base's zeros." hi="3. दायाँ भाग: d का वर्ग, आधार के शून्यों के बराबर अंकों में लिखें।" /></div>
      </div>
    </div>

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 8² (base 10, deficiency 2)", hi: "उदाहरण 1: 8² (आधार 10, कमी 2)" }}
      lines={[{ en: 'Left: 8 − 2 = 6', hi: 'बायाँ: 8 − 2 = 6' }, { en: 'Right: 2² = 4', hi: 'दायाँ: 2² = 4' }, { en: 'Join: 6|4', hi: 'जोड़: 6|4' }]}
      result="8² = 64"
    />
    <ExampleCard
      title={{ en: "Example 2: 96² (base 100, deficiency 4)", hi: "उदाहरण 2: 96² (आधार 100, कमी 4)" }}
      lines={[{ en: 'Left: 96 − 4 = 92', hi: 'बायाँ: 96 − 4 = 92' }, { en: 'Right: 4² = 16', hi: 'दायाँ: 4² = 16' }, { en: 'Join: 92|16', hi: 'जोड़: 92|16' }]}
      result="96² = 9216"
    />
    <ExampleCard
      title={{ en: "Example 3: 103² (base 100, surplus 3)", hi: "उदाहरण 3: 103² (आधार 100, अधिकता 3)" }}
      lines={[{ en: 'Left: 103 + 3 = 106', hi: 'बायाँ: 103 + 3 = 106' }, { en: 'Right: 3² = 9, padded to 09', hi: 'दायाँ: 3² = 9, 09 लिखें' }, { en: 'Join: 106|09', hi: 'जोड़: 106|09' }]}
      result="103² = 10609"
    />

    <SectionTitle>{{ en: "⚠️ Common Mistake", hi: "⚠️ सामान्य गलती" }}</SectionTitle>
    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#B91C1C', margin: '0 0 8px 0', fontWeight: 600 }}>
        <BiText en="Pad the right part to the number of zeros in the base." hi="दायें भाग को आधार के शून्यों की संख्या तक भरें।" />
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#374151', margin: 0 }}>
        <BiText en="For 98² (deficiency 2): the right part is 2² = 4, written as 04, so 98² = 9604, not 964." hi="98² के लिए (कमी 2): दायाँ भाग 2² = 4 है, जिसे 04 लिखा जाएगा, इसलिए 98² = 9604, 964 नहीं।" />
      </p>
    </div>
  </>
);

// ── L3_15 — Adyamadyenantyamantyena ────────────────────────────────────────

const L3_15_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Adyamadyenantyamantyena</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="The first by the first and the last by the last" hi="पहले का पहले से और अंतिम का अंतिम से" /></div>
    </div>

    <SectionTitle>{{ en: "The Method", hi: "विधि" }}</SectionTitle>
    <div style={{ background: '#0A1628', borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.9 }}>
        <div>(ax + b)(cx + d) = ac·x² + (ad + bc)·x + bd</div>
        <div><BiText en="1. First by first: ac, the x² term." hi="1. पहला पहले से: ac, x² पद।" /></div>
        <div><BiText en="2. Cross: ad + bc, the x term." hi="2. क्रॉस: ad + bc, x पद।" /></div>
        <div><BiText en="3. Last by last: bd, the constant." hi="3. अंतिम अंतिम से: bd, अचर पद।" /></div>
      </div>
    </div>

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: (3x + 2)(2x + 5)", hi: "उदाहरण 1: (3x + 2)(2x + 5)" }}
      lines={[{ en: 'First: 3 × 2 = 6x²', hi: 'पहला: 3 × 2 = 6x²' }, { en: 'Cross: 3 × 5 + 2 × 2 = 19x', hi: 'क्रॉस: 3 × 5 + 2 × 2 = 19x' }, { en: 'Last: 2 × 5 = 10', hi: 'अंतिम: 2 × 5 = 10' }]}
      result="6x² + 19x + 10"
    />
    <ExampleCard
      title={{ en: "Example 2: (2x − 1)(x + 3)", hi: "उदाहरण 2: (2x − 1)(x + 3)" }}
      lines={[{ en: 'First: 2 × 1 = 2x²', hi: 'पहला: 2 × 1 = 2x²' }, { en: 'Cross: 2 × 3 + (−1) × 1 = 5x', hi: 'क्रॉस: 2 × 3 + (−1) × 1 = 5x' }, { en: 'Last: (−1) × 3 = −3', hi: 'अंतिम: (−1) × 3 = −3' }]}
      result="2x² + 5x − 3"
    />

    <SectionTitle>{{ en: "⚠️ Common Mistake", hi: "⚠️ सामान्य गलती" }}</SectionTitle>
    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#B91C1C', margin: '0 0 8px 0', fontWeight: 600 }}>
        <BiText en="Keep the sign of the last term." hi="अंतिम पद का चिह्न सही रखें।" />
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#374151', margin: 0 }}>
        <BiText en="In (2x − 1)(x + 3) the last term is −3, not +3." hi="(2x − 1)(x + 3) में अंतिम पद −3 है, +3 नहीं।" />
      </p>
    </div>
  </>
);

// ── L3_16 — Kevalaih Saptakam Gunyat ───────────────────────────────────────

const L3_16_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Kevalaih Saptakam Gunyat</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="For seven, multiply by the combined value" hi="सात के लिए, संयुक्त मान से गुणा करें" /></div>
    </div>

    <SectionTitle>{{ en: "The Pattern", hi: "पैटर्न" }}</SectionTitle>
    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#0A1628', margin: 0, lineHeight: 1.7 }}>
        <BiText en="142857 is the repeating block of 1/7. Its multiples by 1 to 6 are the same six digits in a different order, and 7 × 142857 = 999999." hi="142857, 1/7 का दोहराने वाला खंड है। इसके 1 से 6 गुणज वही छह अंक अलग क्रम में होते हैं, और 7 × 142857 = 999999।" />
      </p>
    </div>

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 5 × 142857", hi: "उदाहरण 1: 5 × 142857" }}
      lines={['142857 × 5 = 714285', { en: 'The digits rotate: 1 4 2 8 5 7 becomes 7 1 4 2 8 5', hi: 'अंक घूमते हैं: 1 4 2 8 5 7 बदलकर 7 1 4 2 8 5 हो जाता है' }]}
      result="714285"
    />
    <ExampleCard
      title={{ en: "Example 2: 7 × 142857", hi: "उदाहरण 2: 7 × 142857" }}
      lines={[{ en: 'Multiply 142857 by 7', hi: '142857 को 7 से गुणा करें' }, { en: 'Every digit is 9', hi: 'हर अंक 9 है' }]}
      result="999999"
    />

    <SectionTitle>{{ en: "⚠️ Common Mistake", hi: "⚠️ सामान्य गलती" }}</SectionTitle>
    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#B91C1C', margin: '0 0 8px 0', fontWeight: 600 }}>
        <BiText en="The rotation works only for 142857." hi="यह घूमने का नियम केवल 142857 के लिए लागू होता है।" />
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#374151', margin: 0 }}>
        <BiText en="Other numbers do not rotate this way. Use this only for multiples of 142857." hi="अन्य संख्याएँ इस तरह नहीं घूमतीं। इसका उपयोग केवल 142857 के गुणजों के लिए करें।" />
      </p>
    </div>
  </>
);

// ── L4_09 — Ekanyunena Purvena (divisibility by 11) ──────────────────────

const L4_09_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Ekanyunena Purvena</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="By one less than the previous one" hi="पिछले से एक कम से" /></div>
    </div>

    <SectionTitle>{{ en: "The Divisibility Test", hi: "विभाज्यता जाँच" }}</SectionTitle>
    <div style={{ background: '#0A1628', borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.9 }}>
        <div><BiText en="1. Starting from the units digit, alternate + and − across the digits." hi="1. इकाई अंक से शुरू करके अंकों में + और − बारी-बारी से लगाएँ।" /></div>
        <div><BiText en="2. If the result is 0 or a multiple of 11, the number is divisible by 11." hi="2. परिणाम 0 या 11 का गुणज हो, तो संख्या 11 से विभाज्य है।" /></div>
      </div>
    </div>

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 418", hi: "उदाहरण 1: 418" }}
      lines={['8 − 1 + 4 = 11', { en: '11 is a multiple of 11', hi: '11, 11 का गुणज है' }]}
      result={{ en: "418 = 11 × 38, divisible", hi: "418 = 11 × 38, विभाज्य" }}
    />
    <ExampleCard
      title={{ en: "Example 2: 123", hi: "उदाहरण 2: 123" }}
      lines={['3 − 2 + 1 = 2', { en: '2 is not a multiple of 11', hi: '2, 11 का गुणज नहीं है' }]}
      result={{ en: "123 is not divisible by 11", hi: "123, 11 से विभाज्य नहीं है" }}
    />

    <SectionTitle>{{ en: "⚠️ Common Mistake", hi: "⚠️ सामान्य गलती" }}</SectionTitle>
    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#B91C1C', margin: '0 0 8px 0', fontWeight: 600 }}>
        <BiText en="Use alternating signs, not the plain digit sum." hi="सादे अंकयोग के बजाय बारी-बारी से चिह्न लगाएँ।" />
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#374151', margin: 0 }}>
        <BiText en="For 418, the plain sum is 4 + 1 + 8 = 13, which tells you nothing. The alternating sum 8 − 1 + 4 = 11 is the test that matters." hi="418 के लिए सादा योग 4 + 1 + 8 = 13 कुछ नहीं बताता। बारी-बारी का योग 8 − 1 + 4 = 11 ही असली जाँच है।" />
      </p>
    </div>
  </>
);

// ── L2_14 — Sankalana-Vyavakalanabhyam ──────────────────────────────────────

const L2_14_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Sankalana-Vyavakalanabhyam</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="By addition and by subtraction" hi="जोड़ और घटाव से" /></div>
    </div>

    <SectionTitle>{{ en: "When to Use This Sutra", hi: "इस सूत्र का उपयोग कब करें" }}</SectionTitle>
    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#0A1628', margin: 0, lineHeight: 1.7 }}>
        Use it to solve two equations in two unknowns when one variable has the same coefficient in both. Adding the equations removes one variable, subtracting removes the other.
      </p>
    </div>

    <SectionTitle>{{ en: "The Method", hi: "विधि" }}</SectionTitle>
    <div style={{ background: '#0A1628', borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.9 }}>
        <div><BiText en="1. Add the two equations to find the variable whose terms cancel when subtracted." hi="1. दोनों समीकरण जोड़ें — जो चर घटाने पर निरस्त होता है, वह ज्ञात होगा।" /></div>
        <div><BiText en="2. Subtract the two equations to find the variable whose terms cancel when added." hi="2. दोनों समीकरण घटाएँ — जो चर जोड़ने पर निरस्त होता है, वह ज्ञात होगा।" /></div>
        <div><BiText en="3. Substitute the value back into either original equation to check." hi="3. जाँच के लिए मान किसी भी मूल समीकरण में रखें।" /></div>
      </div>
    </div>

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: x + y = 10, x − y = 4", hi: "उदाहरण 1: x + y = 10, x − y = 4" }}
      lines={[{ en: 'Add: 2x = 14, so x = 7', hi: 'जोड़ें: 2x = 14, इसलिए x = 7' }, { en: 'Subtract: 2y = 6, so y = 3', hi: 'घटाएँ: 2y = 6, इसलिए y = 3' }, { en: 'Check: 7 + 3 = 10 ✓, 7 − 3 = 4 ✓', hi: 'जाँच: 7 + 3 = 10 ✓, 7 − 3 = 4 ✓' }]}
      result="x = 7, y = 3"
    />
    <ExampleCard
      title={{ en: "Example 2: 3x + 2y = 16, 3x − 2y = 8", hi: "उदाहरण 2: 3x + 2y = 16, 3x − 2y = 8" }}
      lines={[{ en: 'Add: 6x = 24, so x = 4', hi: 'जोड़ें: 6x = 24, इसलिए x = 4' }, { en: 'Subtract: 4y = 8, so y = 2', hi: 'घटाएँ: 4y = 8, इसलिए y = 2' }, { en: 'Check: 12 + 4 = 16 ✓, 12 − 4 = 8 ✓', hi: 'जाँच: 12 + 4 = 16 ✓, 12 − 4 = 8 ✓' }]}
      result="x = 4, y = 2"
    />

    <SectionTitle>{{ en: "⚠️ Common Mistake", hi: "⚠️ सामान्य गलती" }}</SectionTitle>
    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#B91C1C', margin: '0 0 8px 0', fontWeight: 600 }}>
        <BiText en="Keep the signs when you subtract one equation from the other." hi="एक समीकरण को दूसरे में से घटाते समय चिह्न सही रखें।" />
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#374151', margin: 0 }}>
        <BiText en="For (x + y) − (x − y): the x-terms cancel, and y − (−y) = 2y. Writing it as y − y = 0 is wrong." hi="(x + y) − (x − y) के लिए: x-पद निरस्त हो जाते हैं, और y − (−y) = 2y। इसे y − y = 0 लिखना गलत है।" />
      </p>
    </div>

    <SectionTitle>{{ en: "Why It Works", hi: "यह कैसे काम करता है" }}</SectionTitle>
    <div style={{ background: '#F0FDF4', borderRadius: 12, padding: 16, marginBottom: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#065F46', margin: 0, lineHeight: 1.7 }}>
        <BiText en="Adding equal quantities keeps them equal. Adding (x + y) + (x − y) gives 2x, so 2x = 10 + 4 = 14." hi="बराबर राशियों को जोड़ने से वे बराबर ही रहती हैं। (x + y) + (x − y) जोड़ने पर 2x मिलता है, इसलिए 2x = 10 + 4 = 14।" />
      </p>
    </div>
  </>
);

// ── L2_12 — Calendar Calculations ────────────────────────────────────────────

const L2_12_CONTENT = (
  <>
    <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontStyle: 'italic', color: '#1E40AF', marginBottom: 4 }}>Vilokanam</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563' }}><BiText en="Mere observation" hi="केवल अवलोकन" /></div>
    </div>

    <SectionTitle>{{ en: "The Formula", hi: "सूत्र" }}</SectionTitle>
    <div style={{ background: '#0A1628', borderRadius: 12, padding: 20, marginBottom: 20, textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'white', marginBottom: 12 }}>Day = (d + m + y + ⌊y÷4⌋ + C − 1) mod 7</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, textAlign: 'left', display: 'inline-block' }}>
        <div><BiText en="d = date number" hi="d = तारीख संख्या" /></div>
        <div><BiText en="m = month code (see table)" hi="m = माह कोड (तालिका देखें)" /></div>
        <div><BiText en="y = last 2 digits of year" hi="y = वर्ष के अंतिम 2 अंक" /></div>
        <div><BiText en="⌊y÷4⌋ = floor division" hi="⌊y÷4⌋ = पूर्णांक भाग" /></div>
        <div><BiText en="C = century correction (see table below)" hi="C = शताब्दी सुधार (नीचे की तालिका देखें)" /></div>
        <div><BiText en="Result → 0 (zero) = Sunday, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat" hi="परिणाम → 0 = रविवार, 1 = सोमवार, 2 = मंगलवार, 3 = बुधवार, 4 = गुरुवार, 5 = शुक्रवार, 6 = शनिवार" /></div>
      </div>
    </div>

    <SectionTitle>{{ en: "Month Codes", hi: "माह कोड" }}</SectionTitle>
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
        <BiText en="For Jan/Feb in a leap year, subtract 1 from the month code." hi="लीप वर्ष में जनवरी/फरवरी के लिए माह कोड में से 1 घटाएँ।" />
        <BiText en="Century correction: 1800s +2 · 1900s +0 · 2000s +6" hi="शताब्दी सुधार: 1800 +2 · 1900 +0 · 2000 +6" />
      </p>
    </div>

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 15 August 1947", hi: "उदाहरण 1: 15 अगस्त 1947" }}
      lines={[{ en: 'd=15, m=3 (Aug), y=47, ⌊47÷4⌋=11', hi: 'd=15, m=3 (अगस्त), y=47, ⌊47÷4⌋=11' }, { en: 'C (1900s) = 0', hi: 'C (1900 का दशक) = 0' }, { en: 'Total: 15+3+47+11+0 = 76', hi: 'कुल: 15+3+47+11+0 = 76' }, '76 − 1 = 75', { en: '75 mod 7 = 5 = Friday', hi: '75 mod 7 = 5 = शुक्रवार' }]}
      result="15 Aug 1947 = Friday ✓"
    />
    <ExampleCard
      title={{ en: "Example 2: 26 January 2025", hi: "उदाहरण 2: 26 जनवरी 2025" }}
      lines={[{ en: 'd=26, m=1 (Jan), y=25, ⌊25÷4⌋=6', hi: 'd=26, m=1 (जन), y=25, ⌊25÷4⌋=6' }, { en: 'C (2000s) = 6', hi: 'C (2000 का दशक) = 6' }, { en: 'Total: 26+1+25+6+6 = 64', hi: 'कुल: 26+1+25+6+6 = 64' }, '64 − 1 = 63', { en: '63 mod 7 = 0 (zero) = Sunday', hi: '63 mod 7 = 0 (शून्य) = रविवार' }]}
      result="26 Jan 2025 = Sunday ✓"
    />
    <ExampleCard
      title={{ en: "Example 3: 2 October 1869", hi: "उदाहरण 3: 2 अक्टूबर 1869" }}
      lines={[{ en: 'd=2, m=1 (Oct), y=69, ⌊69÷4⌋=17', hi: 'd=2, m=1 (अक्टू), y=69, ⌊69÷4⌋=17' }, { en: 'C (1800s) = 2', hi: 'C (1800 का दशक) = 2' }, { en: 'Total: 2+1+69+17+2 = 91', hi: 'कुल: 2+1+69+17+2 = 91' }, '91 − 1 = 90', { en: '90 mod 7 = 6 = Saturday', hi: '90 mod 7 = 6 = शनिवार' }]}
      result="2 Oct 1869 = Saturday ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0 }}>
        💡 <BiText en="Try calculating your own birthday! This technique impresses everyone and is asked in UPSC/banking exams." hi="अपना जन्मदिन निकालकर देखें! यह तरकीब सबको प्रभावित करती है और UPSC/बैंकिंग परीक्षाओं में पूछी जाती है।" />
      </p>
    </div>
  </>
);

// ── L2_13 — Level 2 Assessment ───────────────────────────────────────────────

function L2_13_CONTENT({ onSwitchTab }) {
  return (
    <>
      <div style={{ background: 'linear-gradient(135deg, #0A1628, #1E40AF)', borderRadius: 16, padding: 28, marginBottom: 24 }}>
        <h2 className="font-heading" style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 6 }}>🏆 Level 2 Assessment</h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>Test your Intermediate Vedic Maths mastery</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 20 }}>
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
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: 4, paddingBottom: 6 }}>
        <div style={{ display: 'flex', gap: 10, minWidth: 'max-content' }}>
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
      </div>
    </>
  );
}

// ── L3_01 ─────────────────────────────────────────────────────────────────────

const L3_01_CONTENT = (
  <>
    <SutraBox sutra="Urdhva-Tiryagbhyam" meaning={{ en: "Vertically and Crosswise", hi: "ऊर्ध्वाधर और तिर्यक रूप से" }} />

    <SectionTitle>{{ en: "Vertically and Crosswise — 2-Digit General Method", hi: "ऊर्ध्वाधर और तिर्यक रूप से — 2-अंकीय सामान्य विधि" }}</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      For AB × CD, compute three groups — left, middle, right — then combine with carries.
    </p>
    <StepBox number={1} text={{ en: "Left: A × C", hi: "बायाँ: A × C" }} example={{ en: "This gives the hundreds digit (or higher)", hi: "यह सैकड़ा अंक (या उससे ऊपर) देता है" }} />
    <StepBox number={2} text={{ en: "Middle: A×D + B×C — carry if > 9", hi: "मध्य: A×D + B×C — 9 से बड़ा हो तो हासिल" }} example={{ en: "This gives the tens digit", hi: "यह दहाई अंक देता है" }} />
    <StepBox number={3} text={{ en: "Right: B × D — carry if > 9", hi: "दायाँ: B × D — 9 से बड़ा हो तो हासिल" }} example={{ en: "This gives the units digit", hi: "यह इकाई अंक देता है" }} />

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 23 × 41", hi: "उदाहरण 1: 23 × 41" }}
      lines={[{ en: 'Right: 3×1 = 3 → write 3, carry 0', hi: 'दायाँ: 3×1 = 3 → 3 लिखें, हासिल 0' }, { en: 'Middle: 2×1 + 3×4 = 2+12 = 14, +carry 0 = 14 → write 4, carry 1', hi: 'मध्य: 2×1 + 3×4 = 2+12 = 14, +हासिल 0 = 14 → 4 लिखें, हासिल 1' }, { en: 'Left: 2×4 = 8, +carry 1 = 9', hi: 'बायाँ: 2×4 = 8, +हासिल 1 = 9' }, { en: 'Result: 9|4|3 = 943', hi: 'परिणाम: 9|4|3 = 943' }]}
      result="23 × 41 = 943 ✓"
    />
    <ExampleCard
      title={{ en: "Example 2: 34 × 52", hi: "उदाहरण 2: 34 × 52" }}
      lines={[{ en: 'Right: 4×2 = 8 → write 8, carry 0', hi: 'दायाँ: 4×2 = 8 → 8 लिखें, हासिल 0' }, { en: 'Middle: 3×2 + 4×5 = 6+20 = 26, +carry 0 = 26 → write 6, carry 2', hi: 'मध्य: 3×2 + 4×5 = 6+20 = 26, +हासिल 0 = 26 → 6 लिखें, हासिल 2' }, { en: 'Left: 3×5 = 15, +carry 2 = 17', hi: 'बायाँ: 3×5 = 15, +हासिल 2 = 17' }, { en: 'Result: 17|6|8 = 1768', hi: 'परिणाम: 17|6|8 = 1768' }]}
      result="34 × 52 = 1768 ✓"
    />
    <ExampleCard
      title={{ en: "Example 3: 67 × 83", hi: "उदाहरण 3: 67 × 83" }}
      lines={[{ en: 'Right: 7×3 = 21 → write 1, carry 2', hi: 'दायाँ: 7×3 = 21 → 1 लिखें, हासिल 2' }, { en: 'Middle: 6×3 + 7×8 = 18+56 = 74, +carry 2 = 76 → write 6, carry 7', hi: 'मध्य: 6×3 + 7×8 = 18+56 = 74, +हासिल 2 = 76 → 6 लिखें, हासिल 7' }, { en: 'Left: 6×8 = 48, +carry 7 = 55', hi: 'बायाँ: 6×8 = 48, +हासिल 7 = 55' }, { en: 'Result: 55|6|1 = 5561', hi: 'परिणाम: 55|6|1 = 5561' }]}
      result="67 × 83 = 5561 ✓"
    />

    <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '14px 16px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
        ⚠️ <strong><BiText en="Always handle carries from right to left." hi="हासिल हमेशा दाईं से बाईं ओर संभालें।" /></strong> <BiText en="Multiple carries can stack — add them all to the left group." hi="कई हासिल जमा हो सकते हैं — सभी को बायें समूह में जोड़ें।" />
      </p>
    </div>
  </>
);

// ── L3_02 ─────────────────────────────────────────────────────────────────────

const L3_02_CONTENT = (
  <>
    <SutraBox sutra="Nikhilam Navatashcaramam Dashatah" meaning={{ en: "All from 9 and the last from 10", hi: "सभी 9 से, और अंतिम 10 से" }} />

    <SectionTitle>{{ en: "Nikhilam for Large Numbers — Base 100 & 1000", hi: "बड़ी संख्याओं के लिए निखिलम — आधार 100 और 1000" }}</SectionTitle>
    <StepBox number={1} text={{ en: "Find deficiency of each number from the base", hi: "हर संख्या का आधार से विचलन ज्ञात करें" }} example={{ en: "For base 100: 97 → deficiency = −3, 96 → deficiency = −4", hi: "आधार 100 के लिए: 97 → विचलन = −3, 96 → विचलन = −4" }} />
    <StepBox number={2} text={{ en: "Cross subtract: either number minus the other's deficiency", hi: "क्रॉस घटाव: कोई एक संख्या में से दूसरे का विचलन घटाएँ" }} example={{ en: "97 − 4 = 93 (or 96 − 3 = 93)", hi: "97 − 4 = 93 (या 96 − 3 = 93)" }} />
    <StepBox number={3} text={{ en: "Multiply the deficiencies — right part (pad to base digit count)", hi: "विचलनों को गुणा करें — दायाँ भाग (आधार के अंकों के बराबर लिखें)" }} example={{ en: "3 × 4 = 12 → 2-digit right part for base 100", hi: "3 × 4 = 12 → आधार 100 के लिए 2-अंकीय दायाँ भाग" }} />
    <StepBox number={4} text={{ en: "Combine: cross result | deficiency product", hi: "जोड़ें: क्रॉस परिणाम | विचलन गुणनफल" }} />

    <SectionTitle>{{ en: "Worked Examples — Base 100", hi: "हल किए गए उदाहरण — आधार 100" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 97 × 96", hi: "उदाहरण 1: 97 × 96" }}
      lines={[{ en: 'Deficiencies: −3, −4', hi: 'विचलन: −3, −4' }, { en: 'Cross: 97 − 4 = 93', hi: 'क्रॉस: 97 − 4 = 93' }, { en: 'Product: 3 × 4 = 12', hi: 'गुणनफल: 3 × 4 = 12' }]}
      result="97 × 96 = 9312 ✓"
    />
    <ExampleCard
      title={{ en: "Example 2: 98 × 97", hi: "उदाहरण 2: 98 × 97" }}
      lines={[{ en: 'Deficiencies: −2, −3', hi: 'विचलन: −2, −3' }, { en: 'Cross: 98 − 3 = 95', hi: 'क्रॉस: 98 − 3 = 95' }, { en: 'Product: 2 × 3 = 6', hi: 'गुणनफल: 2 × 3 = 6' }, { en: 'Right part needs 2 digits for base 100, so 6 is written as 06', hi: 'आधार 100 के लिए दायाँ भाग 2 अंकों का चाहिए, इसलिए 6 को 06 लिखा जाएगा' }]}
      result="98 × 97 = 9506 ✓"
    />
    <ExampleCard
      title={{ en: "Example 3: 88 × 92", hi: "उदाहरण 3: 88 × 92" }}
      lines={[{ en: 'Deficiencies: −12, −8', hi: 'विचलन: −12, −8' }, { en: 'Cross: 88 − 8 = 80', hi: 'क्रॉस: 88 − 8 = 80' }, { en: 'Product: 12 × 8 = 96', hi: 'गुणनफल: 12 × 8 = 96' }]}
      result="88 × 92 = 8096 ✓"
    />

    <SectionTitle>{{ en: "Base 1000 Example", hi: "आधार 1000 का उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 4: 997 × 994", hi: "उदाहरण 4: 997 × 994" }}
      lines={['Deficiencies: −3, −6', { en: 'Cross: 997 − 6 = 991', hi: 'क्रॉस: 997 − 6 = 991' }, { en: 'Product: 3 × 6 = 018 (3 digits for base 1000)', hi: 'गुणनफल: 3 × 6 = 018 (आधार 1000 के लिए 3 अंक)' }]}
      result="997 × 994 = 991018 ✓"
    />

    <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '14px 16px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
        ⚠️ <BiText en="Right part digit count = number of zeros in the base. Base 100 → 2 digits. Base 1000 → 3 digits. Always pad!" hi="दायें भाग के अंकों की संख्या = आधार के शून्यों की संख्या। आधार 100 → 2 अंक। आधार 1000 → 3 अंक। हमेशा शून्य लगाएँ!" />
      </p>
    </div>
  </>
);

// ── L3_03 ─────────────────────────────────────────────────────────────────────

const L3_03_CONTENT = (
  <>
    <SutraBox sutra="Anurupye Sunyamanyat" meaning={{ en: "If one is in ratio, the other is zero", hi: "अगर एक अनुपात में है, तो दूसरा शून्य है" }} />

    <SectionTitle>{{ en: "Proportionality — Scaling to a Convenient Base", hi: "अनुपातिकता — सुविधाजनक आधार पर मापन" }}</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      <BiText en="Scale one or both numbers to a round base (like 50 or 200), apply Nikhilam, then scale back." hi="एक या दोनों संख्याओं को किसी गोल आधार (जैसे 50 या 200) पर लाएँ, निखिलम लगाएँ, फिर वापस मापें।" />
    </p>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#1E40AF', fontWeight: 600, marginBottom: 12 }}>
      <BiText en="Example used in the steps below: 45 × 48" hi="नीचे के चरणों में उपयोग किया गया उदाहरण: 45 × 48" />
    </p>
    <StepBox number={1} text={{ en: "Choose a convenient base near your numbers", hi: "अपनी संख्याओं के पास सुविधाजनक आधार चुनें" }} example={{ en: "45 and 48 are both close to 50 → use base 50", hi: "45 और 48 दोनों 50 के पास हैं → आधार 50 लें" }} />
    <StepBox number={2} text={{ en: "Find deficiencies from that base", hi: "उस आधार से विचलन ज्ञात करें" }} example={{ en: "45 from 50: deficiency = −5. 48 from 50: deficiency = −2", hi: "50 से 45: विचलन = −5। 50 से 48: विचलन = −2" }} />
    <StepBox number={3} text={{ en: "Cross subtract and multiply by the base", hi: "क्रॉस घटाएँ और आधार से गुणा करें" }} example={{ en: "Cross = 45 − 2 = 43, then 43 × 50 = 2150", hi: "क्रॉस = 45 − 2 = 43, फिर 43 × 50 = 2150" }} />
    <StepBox number={4} text={{ en: "Add deficiency product", hi: "विचलन गुणनफल जोड़ें" }} example="5 × 2 = 10 → 2150 + 10 = 2160" />

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 48 × 46 (base 50)", hi: "उदाहरण 1: 48 × 46 (आधार 50)" }}
      lines={[{ en: 'Deficiencies: −2, −4', hi: 'विचलन: −2, −4' }, { en: 'Cross: 48 − 4 = 44 → 44 × 50 = 2200', hi: 'क्रॉस: 48 − 4 = 44 → 44 × 50 = 2200' }, { en: 'Product: 2 × 4 = 08', hi: 'गुणनफल: 2 × 4 = 08' }, { en: 'Result: 2200 + 08 = 2208', hi: 'परिणाम: 2200 + 08 = 2208' }]}
      result="48 × 46 = 2208 ✓"
    />
    <ExampleCard
      title={{ en: "Example 2: 45 × 48 (base 50)", hi: "उदाहरण 2: 45 × 48 (आधार 50)" }}
      lines={[{ en: 'Deficiencies: −5, −2', hi: 'विचलन: −5, −2' }, { en: 'Cross: 45 − 2 = 43 → 43 × 50 = 2150', hi: 'क्रॉस: 45 − 2 = 43 → 43 × 50 = 2150' }, { en: 'Product: 5 × 2 = 10', hi: 'गुणनफल: 5 × 2 = 10' }, { en: 'Result: 2150 + 10 = 2160', hi: 'परिणाम: 2150 + 10 = 2160' }]}
      result="45 × 48 = 2160 ✓"
    />
    <ExampleCard
      title={{ en: "Example 3: 196 × 198 (base 200)", hi: "उदाहरण 3: 196 × 198 (आधार 200)" }}
      lines={[{ en: 'Deficiencies: −4, −2', hi: 'विचलन: −4, −2' }, { en: 'Cross: 196 − 2 = 194 → 194 × 200 = 38800', hi: 'क्रॉस: 196 − 2 = 194 → 194 × 200 = 38800' }, { en: 'Product: 4 × 2 = 08', hi: 'गुणनफल: 4 × 2 = 08' }, { en: 'Result: 38800 + 08 = 38808', hi: 'परिणाम: 38800 + 08 = 38808' }]}
      result="196 × 198 = 38808 ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0 }}>
        💡 <BiText en="Choose base 50 for numbers in the 40s–50s, base 200 for numbers near 200. The technique always works — pick the base that makes multiplication easiest!" hi="40–50 की संख्याओं के लिए आधार 50, और 200 के पास की संख्याओं के लिए आधार 200 लें। यह तरीका हमेशा काम करता है — वह आधार चुनें जिससे गुणा सबसे आसान हो!" />
      </p>
    </div>
  </>
);

// ── L3_04 ─────────────────────────────────────────────────────────────────────

const L3_04_CONTENT = (
  <>
    <SutraBox sutra="Nikhilam Navatashcaramam Dashatah" meaning={{ en: "All from 9 and the last from 10", hi: "सभी 9 से, और अंतिम 10 से" }} />

    <SectionTitle>{{ en: "Vinculum — Complement Representation", hi: "विंकुलम — पूरक निरूपण" }}</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      <BiText en="A vinculum converts digits greater than 5 into their complement (10 − d), reducing large-digit arithmetic to small-digit arithmetic. In traditional Vedic Maths, this is called a" hi="विंकुलम 5 से बड़े अंकों को उनके पूरक (10 − d) में बदलता है, जिससे बड़े अंकों का गणित छोटे अंकों के गणित में बदल जाता है। पारंपरिक वैदिक गणित में इसे" /> <strong>"<BiText en="bar number" hi="बार संख्या" />"</strong><BiText en="— the digit is written with a bar (line) over it, e.g. an over-lined 4 means −4. Since a bar over a digit is hard to show in an app, we write the same thing in parentheses instead: (4) means exactly the same as a barred 4." hi="— अंक के ऊपर रेखा (बार) खींचकर लिखा जाता है, जैसे रेखांकित 4 का अर्थ −4 है। चूँकि ऐप में अंक के ऊपर रेखा दिखाना कठिन है, इसलिए हम वही बात कोष्ठक में लिखते हैं: (4) का अर्थ बिल्कुल रेखांकित 4 जैसा है।" />
    </p>
    <StepBox number={1} text={{ en: "For each digit d > 5: replace with (10 − d) and carry +1 to the left", hi: "हर अंक d > 5 के लिए: (10 − d) लिखें और बायें +1 हासिल ले जाएँ" }} example={{ en: "Digit 8 → (2) carry 1 | Digit 7 → (3) carry 1", hi: "अंक 8 → (2) हासिल 1 | अंक 7 → (3) हासिल 1" }} />
    <StepBox number={2} text={{ en: "Rebuild the number with the new digits and carries", hi: "नए अंकों और हासिल के साथ संख्या दोबारा बनाएँ" }} example={{ en: "76 → 6 is (4), carry 1, so 7+1=8 → 8(4) = 80−4 = 76 ✓", hi: "76 → 6 है (4), हासिल 1, इसलिए 7+1=8 → 8(4) = 80−4 = 76 ✓" }} />
    <StepBox number={3} text={{ en: "Multiply the vinculum form, then convert back", hi: "विंकुलम रूप में गुणा करें, फिर वापस बदलें" }} />

    <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '14px 16px', marginBottom: 20 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
        ⚠️ <BiText en="Sometimes the number in parentheses — or the digit to its left — goes above 9. For example, 96 in vinculum is written 10(4), and 9(3) × 5 works out to 45(15). That's not a mistake: the rule hasn't changed, it's just been applied to a bigger chunk of the number. Expand it exactly the same way — 10(4) = 100 − 4 = 96, and 45(15) = 450 − 15 = 435." hi="कभी-कभी कोष्ठक वाली संख्या — या उसके बायें का अंक — 9 से ऊपर चला जाता है। उदाहरण के लिए, विंकुलम में 96 को 10(4) लिखा जाता है, और 9(3) × 5 = 45(15) होता है। यह गलती नहीं है: नियम वही है, बस बड़े हिस्से पर लागू हुआ है। इसे बिल्कुल उसी तरह खोलें — 10(4) = 100 − 4 = 96, और 45(15) = 450 − 15 = 435।" />
      </p>
    </div>

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: Convert 8 to vinculum", hi: "उदाहरण 1: 8 को विंकुलम में बदलें" }}
      lines={[{ en: '8 > 5 → replace with (10−8)=(2), carry 1', hi: '8 > 5 → (10−8)=(2) से बदलें, हासिल 1' }, { en: 'So 18 → 2(2) = 20 − 2 = 18 ✓', hi: 'तो 18 → 2(2) = 20 − 2 = 18 ✓' }]}
      result="8 in vinculum = (2) with carry 1"
    />
    <ExampleCard
      title={{ en: "Example 2: Convert 76 to vinculum", hi: "उदाहरण 2: 76 को विंकुलम में बदलें" }}
      lines={[{ en: 'Units 6 → (4), carry 1', hi: 'इकाई 6 → (4), हासिल 1' }, { en: 'Tens 7 + carry 1 = 8', hi: 'दहाई 7 + हासिल 1 = 8' }, { en: 'Result: 8(4)', hi: 'परिणाम: 8(4)' }]}
      result="76 = 8(4) → 80 − 4 = 76 ✓"
    />
    <ExampleCard
      title={{ en: "Example 3: 68 × 4 using vinculum", hi: "उदाहरण 3: विंकुलम से 68 × 4" }}
      lines={[{ en: 'Convert 68 → 7(2)  (since 8→(2) carry 1, 6+1=7)', hi: 'बदलें 68 → 7(2)  (क्योंकि 8→(2) हासिल 1, 6+1=7)' }, '7(2) × 4 = 28(8)', '28(8) = 280 − 8 = 272']}
      result="68 × 4 = 272 ✓"
    />
    <ExampleCard
      title={{ en: "Example 4: 79 × 6", hi: "उदाहरण 4: 79 × 6" }}
      lines={[{ en: 'Convert 79 → 8(1)  (9→(1) carry 1, 7+1=8)', hi: 'बदलें 79 → 8(1)  (9→(1) हासिल 1, 7+1=8)' }, '8(1) × 6 = 48(6)', '48(6) = 480 − 6 = 474']}
      result="79 × 6 = 474 ✓"
    />
    <ExampleCard
      title={{ en: "Example 5: 87 × 5 (when the part in parentheses goes above 9)", hi: "उदाहरण 5: 87 × 5 (जब कोष्ठक वाला भाग 9 से ऊपर जाए)" }}
      lines={[{ en: 'Convert 87 → 9(3)  (since 7→(3) carry 1, 8+1=9)', hi: 'बदलें 87 → 9(3)  (क्योंकि 7→(3) हासिल 1, 8+1=9)' }, '9(3) × 5 = 45(15)', { en: '15 is two digits here — that\'s fine, expand it the same way: 450 − 15 = 435', hi: '15 यहाँ दो अंक है — ठीक है, इसे उसी तरह खोलें: 450 − 15 = 435' }]}
      result="87 × 5 = 435 ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0, lineHeight: 1.7 }}>
        💡 <strong><BiText en="Why vinculum?" hi="विंकुलम क्यों?" /></strong> <BiText en={'Digits above 5 require "carrying" in standard arithmetic. Converting them to small complements (≤ 5) makes mental multiplication faster and reduces errors!'} hi="5 से बड़े अंकों के लिए सामान्य गणित में हासिल लेना पड़ता है। उन्हें छोटे पूरकों (≤ 5) में बदलने से मन में गुणा तेज़ होता है और गलतियाँ कम होती हैं!" />
      </p>
    </div>
  </>
);

// ── L3_05 ─────────────────────────────────────────────────────────────────────

const L3_05_CONTENT = (
  <>
    <SutraBox sutra="Urdhva-Tiryagbhyam" meaning={{ en: "Vertically and Crosswise", hi: "ऊर्ध्वाधर और तिर्यक रूप से" }} />

    <SectionTitle>{{ en: "Duplex Method — Squaring Any Number", hi: "डुप्लेक्स विधि — किसी भी संख्या का वर्ग" }}</SectionTitle>
    <div style={{ background: '#F0F4FF', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 8 }}><BiText en="Duplex Definition D(n)" hi="डुप्लेक्स परिभाषा D(n)" /></div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1E40AF', lineHeight: 2 }}>
        <div><BiText en="Single digit a:" hi="एकल अंक a:" />     D(a) = a²</div>
        <div><BiText en="Two digits ab:" hi="दो अंक ab:" />      D(ab) = 2 × a × b</div>
        <div><BiText en="Three digits abc:" hi="तीन अंक abc:" />   D(abc) = 2 × a × c + b²</div>
      </div>
    </div>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      <BiText en="To square a number: compute the Duplex of each overlapping group scanning left to right, then combine with carries." hi="किसी संख्या का वर्ग: बायें से दायें हर अतिव्यापी समूह का डुप्लेक्स निकालें, फिर हासिल के साथ जोड़ें।" />
    </p>

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 23²", hi: "उदाहरण 1: 23²" }}
      lines={['D(2) = 4', { en: 'D(23) = 2×2×3 = 12 → write 2, carry 1', hi: 'D(23) = 2×2×3 = 12 → 2 लिखें, हासिल 1' }, 'D(3) = 9', { en: 'Result: (4+1)|2|9 = 529', hi: 'परिणाम: (4+1)|2|9 = 529' }]}
      result="23² = 529 ✓"
    />
    <ExampleCard
      title={{ en: "Example 2: 34²", hi: "उदाहरण 2: 34²" }}
      lines={[{ en: 'D(4) = 16 → write 6, carry 1', hi: 'D(4) = 16 → 6 लिखें, हासिल 1' }, { en: 'D(34) = 2×3×4 = 24, +carry 1 = 25 → write 5, carry 2', hi: 'D(34) = 2×3×4 = 24, +हासिल 1 = 25 → 5 लिखें, हासिल 2' }, { en: 'D(3) = 9, +carry 2 = 11', hi: 'D(3) = 9, +हासिल 2 = 11' }, { en: 'Result: 11|5|6 = 1156', hi: 'परिणाम: 11|5|6 = 1156' }]}
      result="34² = 1156 ✓"
    />
    <ExampleCard
      title={{ en: "Example 3: 123²", hi: "उदाहरण 3: 123²" }}
      lines={[
        { en: 'D(3) = 9 → write 9, carry 0', hi: 'D(3) = 9 → 9 लिखें, हासिल 0' },
        { en: 'D(23) = 2×2×3 = 12, +carry 0 = 12 → write 2, carry 1', hi: 'D(23) = 2×2×3 = 12, +हासिल 0 = 12 → 2 लिखें, हासिल 1' },
        { en: 'D(123) = 2×1×3 + 2² = 6+4 = 10, +carry 1 = 11 → write 1, carry 1', hi: 'D(123) = 2×1×3 + 2² = 6+4 = 10, +हासिल 1 = 11 → 1 लिखें, हासिल 1' },
        { en: 'D(12) = 2×1×2 = 4, +carry 1 = 5 → write 5, carry 0', hi: 'D(12) = 2×1×2 = 4, +हासिल 1 = 5 → 5 लिखें, हासिल 0' },
        { en: 'D(1) = 1, +carry 0 = 1', hi: 'D(1) = 1, +हासिल 0 = 1' },
        { en: 'Result: 1|5|1|2|9 = 15129', hi: 'परिणाम: 1|5|1|2|9 = 15129' },
      ]}
      result="123² = 15129 ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0, lineHeight: 1.7 }}>
        💡 <BiText en="For a 2-digit number, you compute 3 duplexes. For a 3-digit number, 5 duplexes. The Duplex is the core engine behind Vedic squaring — master it and you can square any number mentally!" hi="2-अंकीय संख्या के लिए 3 डुप्लेक्स निकालने होते हैं। 3-अंकीय संख्या के लिए 5। डुप्लेक्स वैदिक वर्ग विधि का मुख्य आधार है — इसमें माहिर हो जाएँ तो कोई भी संख्या मन में वर्ग कर सकते हैं!" />
      </p>
    </div>
  </>
);

// ── L3_06 ─────────────────────────────────────────────────────────────────────

const L3_06_CONTENT = (
  <>
    <SutraBox sutra="Yavadunam" meaning={{ en: "Whatever the extent of deficiency", hi: "कमी जितनी भी हो" }} />

    <SectionTitle>{{ en: "Cube Roots of Perfect Cubes — Instantly!", hi: "पूर्ण घनों के घनमूल — तुरंत!" }}</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      <BiText en="Two simple observations let you find any 2-digit cube root mentally in seconds." hi="दो सरल अवलोकनों से आप किसी भी 2-अंकीय घनमूल को सेकंडों में मन में निकाल सकते हैं।" />
    </p>
    <StepBox number={1} text={{ en: "Find the first digit: remove the last 3 digits, find the largest n where n³ ≤ remaining", hi: "पहला अंक ज्ञात करें: अंतिम 3 अंक हटाएँ, वह सबसे बड़ा n ज्ञात करें जहाँ n³ ≤ बचा हुआ भाग" }} example={{ en: "∛54872 → remove last 3 → 54 → 3³=27 ≤ 54 < 4³=64 → first digit = 3", hi: "∛54872 → अंतिम 3 हटाएँ → 54 → 3³=27 ≤ 54 < 4³=64 → पहला अंक = 3" }} />
    <StepBox number={2} text={{ en: "Find the last digit using the unique last-digit mapping table below", hi: "नीचे की अनूठी अंतिम-अंक तालिका से अंतिम अंक ज्ञात करें" }} example={{ en: "54872 ends in 2 → cube root ends in 8", hi: "54872 का अंतिम अंक 2 है → घनमूल 8 पर समाप्त" }} />
    <StepBox number={3} text={{ en: "Combine first and last digit → instant answer!", hi: "पहला और अंतिम अंक जोड़ें → तुरंत उत्तर!" }} example={{ en: "3 and 8 → Answer: 38", hi: "3 और 8 → उत्तर: 38" }} />

    <SectionTitle>{{ en: "Last Digit Mapping (Unique — no ambiguity!)", hi: "अंतिम अंक मानचित्रण (अनूठा — कोई भ्रम नहीं!)" }}</SectionTitle>
    <div style={{ background: 'white', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#F0F4FF' }}>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#0A1628' }}><BiText en="Cube ends in" hi="घन का अंतिम अंक" /></th>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#0A1628' }}><BiText en="Cube root ends in" hi="घनमूल का अंतिम अंक" /></th>
          </tr>
        </thead>
        <tbody>
          {[['1','1'],['2','8'],['3','7'],['4','4'],['5','5'],['6','6'],['7','3'],['8','2'],['9','9'],['0','0']].map(([n,r],i)=>(
            <tr key={n} style={{ borderTop: '1px solid rgba(30,64,175,0.08)', background: i%2?'rgba(30,64,175,0.02)':'white' }}>
              <td style={{ padding:'10px 12px', fontFamily:'var(--font-mono)', fontWeight:700, color:'#1E40AF' }}>{n}</td>
              <td style={{ padding:'10px 12px', fontFamily:'var(--font-mono)', color:'#0A1628' }}>{r}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: ∛17576", hi: "उदाहरण 1: ∛17576" }}
      lines={[{ en: 'Remove last 3 digits: 17', hi: 'अंतिम 3 अंक हटाएँ: 17' }, { en: 'Largest cube ≤ 17: 2³=8 ✓ → first digit = 2', hi: '17 से छोटा सबसे बड़ा घन ≤ 17: 2³=8 ✓ → पहला अंक = 2' }, { en: 'Last digit of 17576 = 6 → root ends in 6', hi: '17576 का अंतिम अंक = 6 → घनमूल 6 पर समाप्त' }, { en: 'Answer: 26', hi: 'उत्तर: 26' }]}
      result="∛17576 = 26 ✓ (26³=17576)"
    />
    <ExampleCard
      title={{ en: "Example 2: ∛54872", hi: "उदाहरण 2: ∛54872" }}
      lines={[{ en: 'Remove last 3 digits: 54', hi: 'अंतिम 3 अंक हटाएँ: 54' }, { en: '3³=27 ≤ 54 < 4³=64 → first digit = 3', hi: '3³=27 ≤ 54 < 4³=64 → पहला अंक = 3' }, { en: 'Last digit 2 → root ends in 8', hi: 'अंतिम अंक 2 → घनमूल 8 पर समाप्त' }, { en: 'Answer: 38', hi: 'उत्तर: 38' }]}
      result="∛54872 = 38 ✓ (38³=54872)"
    />
    <ExampleCard
      title={{ en: "Example 3: ∛157464", hi: "उदाहरण 3: ∛157464" }}
      lines={[{ en: 'Remove last 3 digits: 157', hi: 'अंतिम 3 अंक हटाएँ: 157' }, { en: '5³=125 ≤ 157 < 6³=216 → first digit = 5', hi: '5³=125 ≤ 157 < 6³=216 → पहला अंक = 5' }, { en: 'Last digit 4 → root ends in 4', hi: 'अंतिम अंक 4 → घनमूल 4 पर समाप्त' }, { en: 'Answer: 54', hi: 'उत्तर: 54' }]}
      result="∛157464 = 54 ✓ (54³=157464)"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0 }}>
        💡 <BiText en="Unlike square roots, every last digit maps to exactly ONE cube root digit — no ambiguity, no testing needed!" hi="वर्गमूल के विपरीत, हर अंतिम अंक ठीक एक घनमूल अंक से जुड़ता है — कोई भ्रम नहीं, जाँचने की ज़रूरत नहीं!" />
      </p>
    </div>
  </>
);

// ── L3_07 ─────────────────────────────────────────────────────────────────────

const L3_07_CONTENT = (
  <>
    <SutraBox sutra="Paravartya Yojayet" meaning={{ en: "Transpose and Apply", hi: "परिवर्तित करें और लागू करें" }} />

    <SectionTitle>{{ en: "Straight Division by 9", hi: "9 से सीधा भाग" }}</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      <BiText en="For division by 9, the complement is 1. Work left to right: carry each partial sum forward." hi="9 से भाग के लिए पूरक 1 है। बायें से दायें काम करें: हर आंशिक योग आगे ले जाएँ।" />
    </p>
    <StepBox number={1} text={{ en: "Bring down the first digit of the dividend as the first quotient digit", hi: "भाज्य का पहला अंक नीचे लाएँ और उसे पहला भागफल अंक मानें" }} />
    <StepBox number={2} text={{ en: "Add it to the next digit to get the next quotient digit", hi: "इसे अगले अंक में जोड़ें, अगला भागफल अंक पाने के लिए" }} example={{ en: "Repeat: running sum = previous quotient digit + next dividend digit", hi: "दोहराएँ: चलता योग = पिछला भागफल अंक + अगला भाज्य अंक" }} />
    <StepBox number={3} text={{ en: "The last sum is the remainder (mod 9 if ≥ 9) — carry the extra 1 back to the previous quotient digit", hi: "अंतिम योग शेषफल है (≥ 9 हो तो mod 9) — अतिरिक्त 1 को पिछले भागफल अंक पर वापस ले जाएँ" }} example={{ en: "If that digit was already 9, it becomes 10 — write 0 and carry 1 again, one digit further back", hi: "अगर वह अंक पहले से 9 था, तो वह 10 हो जाता है — 0 लिखें और 1 फिर से एक अंक और पीछे ले जाएँ" }} />

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 1234 ÷ 9", hi: "उदाहरण 1: 1234 ÷ 9" }}
      lines={[
        { en: 'Bring down 1 → Q=1', hi: 'नीचे लाएँ 1 → Q=1' },
        '1+2=3',
        { en: '3+3=6 → write 6 (for now)', hi: '3+3=6 → 6 लिखें (अभी के लिए)' },
        { en: '6+4=10 → this last sum is the remainder step: since it\'s ≥9, R = 10−9 = 1, and carry 1 back to the last quotient digit', hi: '6+4=10 → यह अंतिम योग शेषफल चरण है: चूँकि यह ≥9 है, R = 10−9 = 1, और 1 को अंतिम भागफल अंक पर वापस ले जाएँ' },
        { en: 'Carry lands on that last digit: 6+1=7', hi: 'हासिल उस अंतिम अंक पर पड़ता है: 6+1=7' },
        { en: 'Final quotient digits: 1, 3, 7', hi: 'अंतिम भागफल अंक: 1, 3, 7' },
      ]}
      result="1234 ÷ 9 = Q:137 R:1 ✓ (9×137+1=1234)"
    />
    <ExampleCard
      title={{ en: "Example 2: 2345 ÷ 9", hi: "उदाहरण 2: 2345 ÷ 9" }}
      lines={[
        { en: 'Bring down 2 → Q=2', hi: 'नीचे लाएँ 2 → Q=2' },
        '2+3=5',
        '5+4=9 → write 9 (for now)',
        { en: '9+5=14 → this last sum is the remainder step: since it\'s ≥9, R = 14−9 = 5, and carry 1 back to the last quotient digit', hi: '9+5=14 → यह अंतिम योग शेषफल चरण है: चूँकि यह ≥9 है, R = 14−9 = 5, और 1 को अंतिम भागफल अंक पर वापस ले जाएँ' },
        { en: 'Carry lands on that last digit: 9+1=10 — that\'s two digits, so write 0 and carry 1 again, one digit further back', hi: 'अंतिम अंक पर हासिल: 9+1=10 — यह दो अंक है, इसलिए 0 लिखें और 1 फिर से एक अंक और पीछे ले जाएँ' },
        { en: 'Second carry lands on the digit before it: 5+1=6', hi: 'दूसरा हासिल उससे पहले वाले अंक पर पड़ता है: 5+1=6' },
        { en: 'Final quotient digits: 2, 6, 0', hi: 'अंतिम भागफल अंक: 2, 6, 0' },
      ]}
      result="2345 ÷ 9 = Q:260 R:5 ✓ (9×260+5=2345)"
    />
    <ExampleCard
      title={{ en: "Example 3: 1111 ÷ 9", hi: "उदाहरण 3: 1111 ÷ 9" }}
      lines={['1 → 1+1=2 → 2+1=3 → 3+1=4', { en: 'No carry needed', hi: 'हासिल की ज़रूरत नहीं' }, 'Q=123, R=4']}
      result="1111 ÷ 9 = Q:123 R:4 ✓ (9×123+4=1111)"
    />

    <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '14px 16px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
        ⚠️ <BiText en="When any running sum ≥ 9 (like 10, 11), write the units digit as the quotient digit and carry 1 to the next position. Final remainder = last running sum mod 9." hi="जब कोई चलता योग ≥ 9 हो (जैसे 10, 11), तो इकाई अंक को भागफल अंक लिखें और 1 अगली स्थिति पर ले जाएँ। अंतिम शेषफल = अंतिम चलता योग mod 9।" />
      </p>
    </div>
  </>
);

// ── L3_08 ─────────────────────────────────────────────────────────────────────

const L3_08_CONTENT = (
  <>
    <SutraBox sutra="Urdhva-Tiryagbhyam" meaning="Vertically and Crosswise" />

    <SectionTitle>{{ en: "Algebraic Multiplication Using Vedic Methods", hi: "वैदिक विधियों से बीजीय गुणन" }}</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      <BiText en="The same Urdhva-Tiryagbhyam method that works for numbers also works for algebraic expressions. Treat coefficients as digits." hi="जो ऊर्ध्वाधर-तिर्यक विधि संख्याओं पर काम करती है, वही बीजीय व्यंजकों पर भी काम करती है। गुणांकों को अंक मानें।" />
    </p>
    <StepBox number={1} text={{ en: "Vertical left: multiply the leading terms", hi: "ऊर्ध्वाधर बायाँ: पहले पदों को गुणा करें" }} example="(x+2)(x+3) → x × x = x²" />
    <StepBox number={2} text={{ en: "Cross: multiply outer × inner and add", hi: "क्रॉस: बाहरी × भीतरी गुणा करें और जोड़ें" }} example="x×3 + 2×x = 3x + 2x = 5x" />
    <StepBox number={3} text={{ en: "Vertical right: multiply the constant terms", hi: "ऊर्ध्वाधर दायाँ: अचर पदों को गुणा करें" }} example="2 × 3 = 6" />

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: (x+2)(x+3)", hi: "उदाहरण 1: (x+2)(x+3)" }}
      lines={[{ en: 'Vertical: x×x = x²', hi: 'ऊर्ध्वाधर: x×x = x²' }, { en: 'Cross: x×3 + 2×x = 5x', hi: 'क्रॉस: x×3 + 2×x = 5x' }, { en: 'Vertical: 2×3 = 6', hi: 'ऊर्ध्वाधर: 2×3 = 6' }]}
      result="(x+2)(x+3) = x² + 5x + 6 ✓"
    />
    <ExampleCard
      title={{ en: "Example 2: (2x+3)(x+4)", hi: "उदाहरण 2: (2x+3)(x+4)" }}
      lines={[{ en: 'Vertical: 2x×x = 2x²', hi: 'ऊर्ध्वाधर: 2x×x = 2x²' }, { en: 'Cross: 2x×4 + 3×x = 8x+3x = 11x', hi: 'क्रॉस: 2x×4 + 3×x = 8x+3x = 11x' }, { en: 'Vertical: 3×4 = 12', hi: 'ऊर्ध्वाधर: 3×4 = 12' }]}
      result="(2x+3)(x+4) = 2x² + 11x + 12 ✓"
    />
    <ExampleCard
      title={{ en: "Example 3: (x+6)(x−2)", hi: "उदाहरण 3: (x+6)(x−2)" }}
      lines={[{ en: 'Vertical: x×x = x²', hi: 'ऊर्ध्वाधर: x×x = x²' }, { en: 'Cross: x×(−2) + 6×x = −2x+6x = 4x', hi: 'क्रॉस: x×(−2) + 6×x = −2x+6x = 4x' }, { en: 'Vertical: 6×(−2) = −12', hi: 'ऊर्ध्वाधर: 6×(−2) = −12' }]}
      result="(x+6)(x−2) = x² + 4x − 12 ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0, lineHeight: 1.7 }}>
        💡 <BiText en="This pattern extends to any degree! For trinomials or higher-degree polynomials, extend the crosswise steps — same sutra, unlimited power." hi="यह पैटर्न किसी भी घात तक बढ़ता है! त्रिपद या उच्च-घात बहुपदों के लिए तिर्यक चरण बढ़ाएँ — वही सूत्र, असीमित शक्ति।" />
      </p>
    </div>
  </>
);

// ── L3_09 ─────────────────────────────────────────────────────────────────────

const L3_09_CONTENT = (
  <>
    <SutraBox sutra="Paravartya Yojayet" meaning={{ en: "Transpose and Apply", hi: "परिवर्तित करें और लागू करें" }} />

    <SectionTitle>{{ en: "Simultaneous Equations — Vedic Cross-Multiplication", hi: "युगपत समीकरण — वैदिक क्रॉस-गुणन" }}</SectionTitle>
    <div style={{ background: '#0A1628', borderRadius: 12, padding: 20, marginBottom: 20, textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}><BiText en="For: ax + by = c   and   dx + ey = f" hi="के लिए: ax + by = c   और   dx + ey = f" /></div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: '#93C5FD', lineHeight: 2.2 }}>
        <div>x = (ce − bf) / (ae − bd)</div>
        <div>y = (af − cd) / (ae − bd)</div>
      </div>
    </div>

    <StepBox number={1} text={{ en: "Identify: a, b, c from equation 1 and d, e, f from equation 2", hi: "पहचानें: समीकरण 1 से a, b, c और समीकरण 2 से d, e, f" }} />
    <StepBox number={2} text={{ en: "Denominator = ae − bd (same for both x and y)", hi: "हर = ae − bd (x और y दोनों के लिए समान)" }} />
    <StepBox number={3} text={{ en: "Numerator of x = ce − bf", hi: "x का अंश = ce − bf" }} example={{ en: "c×e minus b×f", hi: "c×e घटाएँ b×f" }} />
    <StepBox number={4} text={{ en: "Numerator of y = af − cd", hi: "y का अंश = af − cd" }} example={{ en: "a×f minus c×d", hi: "a×f घटाएँ c×d" }} />

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 2x+3y=7, x+2y=4", hi: "उदाहरण 1: 2x+3y=7, x+2y=4" }}
      lines={['a=2,b=3,c=7 | d=1,e=2,f=4', { en: 'Denominator: 2×2 − 3×1 = 4−3 = 1', hi: 'हर: 2×2 − 3×1 = 4−3 = 1' }, 'x = (7×2 − 3×4)/1 = (14−12)/1 = 2', 'y = (2×4 − 7×1)/1 = (8−7)/1 = 1']}
      result="x=2, y=1 ✓ (2×2+3×1=7, 2+2×1=4)"
    />
    <ExampleCard
      title={{ en: "Example 2: 3x+2y=12, x+y=5", hi: "उदाहरण 2: 3x+2y=12, x+y=5" }}
      lines={['a=3,b=2,c=12 | d=1,e=1,f=5', { en: 'Denominator: 3×1 − 2×1 = 1', hi: 'हर: 3×1 − 2×1 = 1' }, 'x = (12×1 − 2×5)/1 = (12−10)/1 = 2', 'y = (3×5 − 12×1)/1 = (15−12)/1 = 3']}
      result="x=2, y=3 ✓ (3×2+2×3=12, 2+3=5)"
    />
    <ExampleCard
      title={{ en: "Example 3: 2x+y=7, x+2y=8", hi: "उदाहरण 3: 2x+y=7, x+2y=8" }}
      lines={['a=2,b=1,c=7 | d=1,e=2,f=8', { en: 'Denominator: 2×2 − 1×1 = 3', hi: 'हर: 2×2 − 1×1 = 3' }, 'x = (7×2 − 1×8)/3 = (14−8)/3 = 6/3 = 2', 'y = (2×8 − 7×1)/3 = (16−7)/3 = 9/3 = 3']}
      result="x=2, y=3 ✓ (2×2+3=7, 2+2×3=8)"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0 }}>
        💡 <strong><BiText en="Exam tip:" hi="परीक्षा सुझाव:" /></strong> <BiText en="Write the formula once and plug in — this method is faster than elimination or substitution for 2×2 systems and impresses examiners!" hi="सूत्र एक बार लिखें और मान रखें — 2×2 प्रणालियों के लिए यह विधि विलोपन या प्रतिस्थापन से तेज़ है और परीक्षकों को प्रभावित करती है!" />
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 20 }}>
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
      <div className="rev-row3" style={{ display: 'flex', gap: 10, marginBottom: 4, overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 4 }}>
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
    <SutraBox sutra="Anurupyena" meaning={{ en: "Proportionality", hi: "अनुपातिकता" }} />

    <SectionTitle>{{ en: "Cubing Any 2-Digit Number", hi: "किसी भी 2-अंकीय संख्या का घन" }}</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      <BiText en="For any number written as a+b (tens digit a, units digit b), expand using the pattern a³|3a²b|3ab²|b³ — identical to (a+b)³ algebraically." hi="किसी भी संख्या को a+b लिखें (दहाई अंक a, इकाई अंक b), फिर पैटर्न a³|3a²b|3ab²|b³ से विस्तार करें — बीजगणित में यह (a+b)³ के समान है।" />
    </p>
    <StepBox number={1} text={{ en: "Write a³", hi: "a³ लिखें" }} example={{ en: "For 23: a=2, b=3 → a³ = 8", hi: "23 के लिए: a=2, b=3 → a³ = 8" }} />
    <StepBox number={2} text={{ en: "Write 3×a²×b", hi: "3×a²×b लिखें" }} example="3×4×3 = 36" />
    <StepBox number={3} text={{ en: "Write 3×a×b²", hi: "3×a×b² लिखें" }} example="3×2×9 = 54" />
    <StepBox number={4} text={{ en: "Write b³", hi: "b³ लिखें" }} example="27" />
    <StepBox number={5} text={{ en: "Handle carries from right to left", hi: "दाईं से बाईं ओर हासिल संभालें" }} example="8|36|54|27 → with carries → 12167" />

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 12³  (a=1, b=2)", hi: "उदाहरण 1: 12³  (a=1, b=2)" }}
      lines={[{ en: 'Row: 1 | 6 | 12 | 8', hi: 'पंक्ति: 1 | 6 | 12 | 8' }, { en: '12 → write 2, carry 1 → 6+1=7', hi: '12 → 2 लिखें, हासिल 1 → 6+1=7' }, { en: 'Result: 1|7|2|8', hi: 'परिणाम: 1|7|2|8' }]}
      result="12³ = 1728 ✓"
    />
    <ExampleCard
      title={{ en: "Example 2: 23³  (a=2, b=3)", hi: "उदाहरण 2: 23³  (a=2, b=3)" }}
      lines={[{ en: 'Row: 8 | 36 | 54 | 27', hi: 'पंक्ति: 8 | 36 | 54 | 27' }, { en: '27 → write 7, carry 2', hi: '27 → 7 लिखें, हासिल 2' }, { en: '54+2=56 → write 6, carry 5', hi: '54+2=56 → 6 लिखें, हासिल 5' }, { en: '36+5=41 → write 1, carry 4', hi: '36+5=41 → 1 लिखें, हासिल 4' }, '8+4=12']}
      result="23³ = 12167 ✓"
    />
    <ExampleCard
      title={{ en: "Example 3: 14³  (a=1, b=4)", hi: "उदाहरण 3: 14³  (a=1, b=4)" }}
      lines={[{ en: 'Row: 1 | 12 | 48 | 64', hi: 'पंक्ति: 1 | 12 | 48 | 64' }, { en: '64 → write 4, carry 6', hi: '64 → 4 लिखें, हासिल 6' }, { en: '48+6=54 → write 4, carry 5', hi: '48+6=54 → 4 लिखें, हासिल 5' }, { en: '12+5=17 → write 7, carry 1', hi: '12+5=17 → 7 लिखें, हासिल 1' }, '1+1=2']}
      result="14³ = 2744 ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0, lineHeight: 1.7 }}>
        💡 <BiText en="The ratio of the 4 terms is always" hi="4 पदों का अनुपात हमेशा" /> <strong>1:3:3:1</strong> <BiText en="— same as Pascal's triangle row 3. Memorise the pattern and you can cube any 2-digit number in under 10 seconds!" hi="होता है — यह पास्कल त्रिकोण की तीसरी पंक्ति जैसा है। पैटर्न याद कर लें तो किसी भी 2-अंकीय संख्या का घन 10 सेकंड से कम में निकाल सकते हैं!" />
      </p>
    </div>
  </>
);

// ── L4_02 ─────────────────────────────────────────────────────────────────────

const L4_02_CONTENT = (
  <>
    <SutraBox sutra="Urdhva-Tiryagbhyam" meaning="Vertically and Crosswise" />

    <SectionTitle>{{ en: "Squaring 3-Digit Numbers — Duplex Method", hi: "3-अंकीय संख्याओं का वर्ग — डुप्लेक्स विधि" }}</SectionTitle>
    <div style={{ background: '#F0F4FF', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 8 }}><BiText en="Duplex Formulas" hi="डुप्लेक्स सूत्र" /></div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1E40AF', lineHeight: 2 }}>
        <div>D(a)    = a²</div>
        <div>D(ab)   = 2ab</div>
        <div>D(abc)  = 2ac + b²</div>
        <div>D(abcd) = 2ad + 2bc</div>
      </div>
    </div>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      <BiText en="For 3-digit number abc: compute 5 duplexes — D(a) | D(ab) | D(abc) | D(bc) | D(c) — then add carries right to left." hi="3-अंकीय संख्या abc के लिए: 5 डुप्लेक्स निकालें — D(a) | D(ab) | D(abc) | D(bc) | D(c) — फिर दाईं से बाईं ओर हासिल जोड़ें।" />
    </p>

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 213²", hi: "उदाहरण 1: 213²" }}
      lines={['D(2)=4, D(21)=2×2×1=4, D(213)=2×2×3+1²=13', 'D(13)=2×1×3=6, D(3)=9', { en: 'Row: 4|4|13|6|9', hi: 'पंक्ति: 4|4|13|6|9' }, { en: '13→3 carry 1 → 4+1=5', hi: '13→3 हासिल 1 → 4+1=5' }, { en: 'Result: 45369', hi: 'परिणाम: 45369' }]}
      result="213² = 45369 ✓"
    />
    <ExampleCard
      title={{ en: "Example 2: 111²", hi: "उदाहरण 2: 111²" }}
      lines={['D(1)=1, D(11)=2, D(111)=2+1=3, D(11)=2, D(1)=1', { en: 'Row: 1|2|3|2|1 — no carries!', hi: 'पंक्ति: 1|2|3|2|1 — कोई हासिल नहीं!' }]}
      result="111² = 12321 ✓"
    />
    <ExampleCard
      title={{ en: "Example 3: 122²", hi: "उदाहरण 3: 122²" }}
      lines={['D(1)=1, D(12)=4, D(122)=2×1×2+4=8, D(22)=8, D(2)=4', { en: 'Row: 1|4|8|8|4 — no carries!', hi: 'पंक्ति: 1|4|8|8|4 — कोई हासिल नहीं!' }, { en: 'Result: 14884', hi: 'परिणाम: 14884' }]}
      result="122² = 14884 ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0 }}>
        💡 <BiText en="Always write out the full duplex row first, then do all carries in one pass from right to left. Rushing the carries is the most common source of errors!" hi="पहले पूरी डुप्लेक्स पंक्ति लिखें, फिर सभी हासिल एक ही बार में दाईं से बाईं ओर करें। जल्दबाज़ी में हासिल करना गलतियों का सबसे आम कारण है!" />
      </p>
    </div>
  </>
);

// ── L4_03 ─────────────────────────────────────────────────────────────────────

const L4_03_CONTENT = (
  <>
    <SutraBox sutra="Ekadhikena Purvena" meaning="By one more than the previous one" />

    <SectionTitle>{{ en: "Osculators — Divisibility Testing", hi: "ऑस्कुलेटर — विभाज्यता जाँच" }}</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      <BiText en="An osculator is a multiplier that helps test divisibility without long division." hi="ऑस्कुलेटर एक गुणक है जो लंबे भाग के बिना विभाज्यता जाँचने में मदद करता है।" />
    </p>

    <div style={{ background: '#F0F4FF', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 8 }}><BiText en="Osculator Reference" hi="ऑस्कुलेटर संदर्भ" /></div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', lineHeight: 2 }}>
        <div><strong><BiText en="Positive P" hi="धनात्मक P" /></strong> <BiText en="(divisors ending near 9): 19→P=2, 29→P=3, 39→P=4" hi="(भाजक जो 9 के पास समाप्त होते हैं): 19→P=2, 29→P=3, 39→P=4" /></div>
        <div><strong><BiText en="Negative Q" hi="ऋणात्मक Q" /></strong> <BiText en="(divisors ending in 1): 11→Q=1, 21→Q=2, 31→Q=3" hi="(भाजक जो 1 पर समाप्त होते हैं): 11→Q=1, 21→Q=2, 31→Q=3" /></div>
      </div>
    </div>

    <StepBox number={1} text={{ en: "Detach the last digit of the number", hi: "संख्या का अंतिम अंक अलग करें" }} />
    <StepBox number={2} text={{ en: "For positive P: multiply last digit by P and ADD to remaining number", hi: "धनात्मक P के लिए: अंतिम अंक को P से गुणा करें और बाकी संख्या में जोड़ें" }} />
    <StepBox number={3} text={{ en: "For negative Q: multiply last digit by Q and SUBTRACT from remaining number", hi: "ऋणात्मक Q के लिए: अंतिम अंक को Q से गुणा करें और बाकी संख्या में से घटाएँ" }} />
    <StepBox number={4} text={{ en: "Repeat until you reach a recognisable number; if divisible → Yes!", hi: "तब तक दोहराएँ जब तक पहचानने योग्य संख्या न मिल जाए; अगर विभाज्य हो → हाँ!" }} />

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: Is 399 divisible by 19? (P=2)", hi: "उदाहरण 1: क्या 399, 19 से विभाज्य है? (P=2)" }}
      lines={[{ en: '399 → detach 9: 39 + 9×2 = 39+18 = 57', hi: '399 → 9 अलग करें: 39 + 9×2 = 39+18 = 57' }, { en: '57 → detach 7: 5 + 7×2 = 5+14 = 19', hi: '57 → 7 अलग करें: 5 + 7×2 = 5+14 = 19' }, { en: '19 is divisible by 19 → YES', hi: '19, 19 से विभाज्य है → हाँ' }]}
      result="399 ÷ 19 = 21 ✓"
    />
    <ExampleCard
      title={{ en: "Example 2: Is 572 divisible by 11? (Q=1)", hi: "उदाहरण 2: क्या 572, 11 से विभाज्य है? (Q=1)" }}
      lines={[{ en: '572 → detach 2: 57 − 2×1 = 55', hi: '572 → 2 अलग करें: 57 − 2×1 = 55' }, { en: '55 → detach 5: 5 − 5×1 = 0', hi: '55 → 5 अलग करें: 5 − 5×1 = 0' }, { en: '0 is divisible by 11 → YES', hi: '0, 11 से विभाज्य है → हाँ' }]}
      result="572 ÷ 11 = 52 ✓"
    />
    <ExampleCard
      title={{ en: "Example 3: Is 253 divisible by 11? (Q=1)", hi: "उदाहरण 3: क्या 253, 11 से विभाज्य है? (Q=1)" }}
      lines={[{ en: '253 → detach 3: 25 − 3 = 22', hi: '253 → 3 अलग करें: 25 − 3 = 22' }, { en: '22 → detach 2: 2 − 2 = 0 → YES', hi: '22 → 2 अलग करें: 2 − 2 = 0 → हाँ' }]}
      result="253 ÷ 11 = 23 ✓"
    />
    <ExampleCard
      title={{ en: "Example 4: Is 646 divisible by 19? (P=2)", hi: "उदाहरण 4: क्या 646, 19 से विभाज्य है? (P=2)" }}
      lines={[{ en: '646 → detach 6: 64 + 6×2 = 64+12 = 76', hi: '646 → 6 अलग करें: 64 + 6×2 = 64+12 = 76' }, { en: '76 → detach 6: 7 + 6×2 = 7+12 = 19 → YES', hi: '76 → 6 अलग करें: 7 + 6×2 = 7+12 = 19 → हाँ' }]}
      result="646 ÷ 19 = 34 ✓"
    />
  </>
);

// ── L4_04 ─────────────────────────────────────────────────────────────────────

const L4_04_CONTENT = (
  <>
    <SutraBox sutra="Ekadhikena Purvena" meaning="By one more than the previous one" />

    <SectionTitle>{{ en: "Auxiliary Fractions — Instant Decimal Conversion", hi: "सहायक भिन्न — तुरंत दशमलव रूपांतरण" }}</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      <BiText en="For fractions whose denominator ends in 9, use Ekadhikena (one more than previous) to convert to decimals by progressive division." hi="जिन भिन्नों का हर 9 पर समाप्त होता है, उनके लिए एकाधिकेन (पिछले से एक अधिक) का उपयोग करके क्रमिक भाग से दशमलव बनाएँ।" />
    </p>
    <StepBox number={1} text={{ en: "Find the Ekadhikena: one more than the digit before 9", hi: "एकाधिकेन ज्ञात करें: 9 से पहले के अंक से एक अधिक" }} example={{ en: "For 1/19: digit before 9 is 1, Ekadhikena = 2", hi: "1/19 के लिए: 9 से पहले का अंक 1 है, एकाधिकेन = 2" }} />
    <StepBox number={2} text={{ en: "Divide the numerator by the Ekadhikena, carry any remainder forward", hi: "अंश को एकाधिकेन से भाग दें, शेषफल आगे ले जाएँ" }} example={{ en: "1÷2=0 rem 1 → write 0", hi: "1÷2=0 शेषफल 1 → 0 लिखें" }} />
    <StepBox number={3} text={{ en: "Next: new number = (remainder × 10 + 0) ÷ Ekadhikena, continue...", hi: "अगला: नई संख्या = (शेषफल × 10 + 0) ÷ एकाधिकेन, जारी रखें..." }} example={{ en: "10÷2=5 rem 0 → write 5; 5÷2=2 rem 1 → write 2; 12÷2=6...", hi: "10÷2=5 शेषफल 0 → 5 लिखें; 5÷2=2 शेषफल 1 → 2 लिखें; 12÷2=6..." }} />
    <StepBox number={4} text={{ en: "The decimal repeats with period = denominator − 1", hi: "दशमलव का दोहराव = हर − 1 की अवधि पर होता है" }} />

    <SectionTitle>{{ en: "Worked Examples", hi: "हल किए गए उदाहरण" }}</SectionTitle>
    <ExampleCard
      title={{ en: "Example 1: 1/19  (Ekadhikena = 2)", hi: "उदाहरण 1: 1/19  (एकाधिकेन = 2)" }}
      lines={[{ en: '1÷2=0 r1 → .0', hi: '1÷2=0 शेषफल 1 → .0' }, { en: '10÷2=5 r0 → .05', hi: '10÷2=5 शेषफल 0 → .05' }, { en: '5÷2=2 r1 → .052', hi: '5÷2=2 शेषफल 1 → .052' }, { en: '12÷2=6 r0 → .0526', hi: '12÷2=6 शेषफल 0 → .0526' }, { en: '6÷2=3 r0 → .05263...', hi: '6÷2=3 शेषफल 0 → .05263...' }]}
      result={{ en: "1/19 = 0.052631578947368421... (repeating)", hi: "1/19 = 0.052631578947368421... (दोहराने वाला)" }}
    />
    <ExampleCard
      title={{ en: "Example 2: 1/29  (Ekadhikena = 3)", hi: "उदाहरण 2: 1/29  (एकाधिकेन = 3)" }}
      lines={[{ en: '1÷3=0 r1 → .0', hi: '1÷3=0 शेषफल 1 → .0' }, { en: '10÷3=3 r1 → .03', hi: '10÷3=3 शेषफल 1 → .03' }, { en: '13÷3=4 r1 → .034', hi: '13÷3=4 शेषफल 1 → .034' }, { en: '14÷3=4 r2 → .0344...', hi: '14÷3=4 शेषफल 2 → .0344...' }]}
      result={{ en: "1/29 = 0.0344827... (repeating)", hi: "1/29 = 0.0344827... (दोहराने वाला)" }}
    />

    <SectionTitle>{{ en: "The 1/9 Family Shortcut", hi: "1/9 परिवार का शॉर्टकट" }}</SectionTitle>
    <div style={{ background: 'white', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: 16 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#F0F4FF' }}>
            {[{ en: 'Fraction', hi: 'भिन्न' },{ en: 'Decimal', hi: 'दशमलव' },{ en: 'Pattern', hi: 'पैटर्न' }].map(h=>(
              <th key={h.en} style={{ padding:'10px 12px', textAlign:'left', fontWeight:600, color:'#0A1628', fontFamily:'var(--font-body)' }}><BiText en={h.en} hi={h.hi} /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ['1/9','0.111...',{ en: 'Single digit repeat', hi: 'एक अंक का दोहराव' }],
            ['1/99','0.010101...',{ en: '2-digit cycle', hi: '2-अंकीय चक्र' }],
            ['1/999','0.001001001...',{ en: '3-digit cycle', hi: '3-अंकीय चक्र' }],
            ['1/19','0.052631...',{ en: '18-digit cycle', hi: '18-अंकीय चक्र' }],
          ].map(([f,d,p],i)=>(
            <tr key={f} style={{ borderTop:'1px solid rgba(30,64,175,0.08)', background:i%2?'rgba(30,64,175,0.02)':'white' }}>
              <td style={{ padding:'10px 12px', color:'#1E40AF', fontWeight:700 }}>{f}</td>
              <td style={{ padding:'10px 12px', color:'#0A1628' }}>{d}</td>
              <td style={{ padding:'10px 12px', color:'#4B5563', fontFamily:'var(--font-body)' }}><BiText en={p.en} hi={p.hi} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

// ── LESSON CONTENT MAP ────────────────────────────────────────────────────────

export const LESSON_CONTENT = {
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
  l2_14: () => L2_14_CONTENT,
  l3_11: () => L3_11_CONTENT,
  l3_12: () => L3_12_CONTENT,
  l3_13: () => L3_13_CONTENT,
  l3_14: () => L3_14_CONTENT,
  l2_15: () => L2_15_CONTENT,
  l3_15: () => L3_15_CONTENT,
  l3_16: () => L3_16_CONTENT,
  l4_09: () => L4_09_CONTENT,
  l2_12: () => L2_12_CONTENT,
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
    if (lesson.id === 'l2_13') return <L2_13_CONTENT onSwitchTab={onSwitchTab} />;
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