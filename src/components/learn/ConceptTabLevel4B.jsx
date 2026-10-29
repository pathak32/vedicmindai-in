import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';

// Text fields may be plain strings (English only) or { en, hi } objects.
function tr(field, language) {
  if (field == null) return field;
  if (typeof field === 'string') return field;
  return field[language] ?? field.en ?? '';
}

// For inline text inside constant JSX, which cannot call useLanguage() itself.
function BiText({ en, hi }) {
  const { language } = useLanguage();
  return language === 'hi' ? hi : en;
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
  return (
    <div style={{
      background: '#F0F4FF', borderLeft: '4px solid #3B82F6',
      borderRadius: '0 8px 8px 0', padding: '12px 16px', marginBottom: 10,
    }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628' }}>
        <span style={{ fontWeight: 700, marginRight: 8 }}>{language === 'hi' ? 'चरण' : 'Step'} {number}:</span>{tr(text, language)}
      </div>
      {example && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1E40AF', marginTop: 6 }}>{tr(example, language)}</div>
      )}
    </div>
  );
}

function ExampleCard({ title, lines, result }) {
  const { language } = useLanguage();
  return (
    <div style={{ background: '#F0F4FF', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 8 }}>{tr(title, language)}</div>
      {lines.map((l, i) => (
        <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#4B5563', marginBottom: 4 }}>{tr(l, language)}</div>
      ))}
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

// ── L4_05 — Calendar Calculations ─────────────────────────────────────────────

export const L4_05_CONTENT = (
  <>
    <SutraBox sutra="Vilokanam" meaning={{ en: 'Mere Observation', hi: 'केवल अवलोकन' }} />

    <SectionTitle>{{ en: 'Advanced Calendar Calculations', hi: 'उन्नत कैलेंडर गणनाएँ' }}</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      <BiText en="Build on the Level 2 calendar formula for any century, including edge cases like leap years and cross-century dates." hi="किसी भी शताब्दी के लिए स्तर 2 के कैलेंडर सूत्र पर आधारित, जिसमें लीप वर्ष और शताब्दी-पार तिथियों जैसे विशेष मामले शामिल हैं।" />
    </p>

    <div style={{ background: '#0A1628', borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'white', marginBottom: 8, textAlign: 'center' }}>
        Day = (d + m + y + ⌊y÷4⌋ + c) mod 7
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 2, textAlign: 'left', display: 'inline-block' }}>
        <div><BiText en="c = century code: 1700s→4, 1800s→2, 1900s→0, 2000s→6" hi="c = शताब्दी कोड: 1700→4, 1800→2, 1900→0, 2000→6" /></div>
        <div><BiText en="0=Sun · 1=Mon · 2=Tue · 3=Wed · 4=Thu · 5=Fri · 6=Sat" hi="0=रवि · 1=सोम · 2=मंगल · 3=बुध · 4=गुरु · 5=शुक्र · 6=शनि" /></div>
        <div><BiText en="Leap year Jan/Feb: subtract 1 from month code" hi="लीप वर्ष जन/फ़र: माह कोड में से 1 घटाएँ" /></div>
      </div>
    </div>

    <SectionTitle>{{ en: 'Month Codes (Advanced Reference)', hi: 'माह कोड (उन्नत संदर्भ)' }}</SectionTitle>
    <div style={{ background: 'white', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: 16, marginBottom: 20, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
        <tbody>
          <tr>
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
              <td key={m} style={{ padding: '8px 8px', textAlign: 'center', background: '#F0F4FF', fontFamily: 'var(--font-body)', fontWeight: 600, color: '#0A1628', border: '1px solid rgba(30,64,175,0.08)', whiteSpace: 'nowrap', fontSize: 12 }}>{m}</td>
            ))}
          </tr>
          <tr>
            {['1','4','4','0','2','5','0','3','6','1','4','6'].map((c, i) => (
              <td key={i} style={{ padding: '8px 8px', textAlign: 'center', color: '#1E40AF', fontWeight: 700, border: '1px solid rgba(30,64,175,0.08)' }}>{c}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>

    <SectionTitle>{{ en: 'Worked Examples', hi: 'हल किए गए उदाहरण' }}</SectionTitle>
    <ExampleCard
      title={{ en: 'Example 1: 15 August 1947', hi: 'उदाहरण 1: 15 अगस्त 1947' }}
      lines={[
        { en: 'd=15, m(Aug)=3, y=47, ⌊47÷4⌋=11, c(1900s)=0', hi: 'd=15, m(अगस्त)=3, y=47, ⌊47÷4⌋=11, c(1900 का दशक)=0' },
        { en: 'Total: 15+3+47+11+0 = 76', hi: 'कुल: 15+3+47+11+0 = 76' },
        { en: '76 mod 7 = 6 = Saturday', hi: '76 mod 7 = 6 = शनिवार' },
      ]}
      result={{ en: '15 Aug 1947 = Saturday ✓', hi: '15 अग 1947 = शनिवार ✓' }}
    />
    <ExampleCard
      title={{ en: 'Example 2: 1 January 2000 (leap year Jan)', hi: 'उदाहरण 2: 1 जनवरी 2000 (लीप वर्ष, जन)' }}
      lines={[
        { en: 'd=1, m(Jan leap)=1−1=0, y=00, ⌊0÷4⌋=0, c(2000s)=6', hi: 'd=1, m(जन, लीप)=1−1=0, y=00, ⌊0÷4⌋=0, c(2000 का दशक)=6' },
        { en: 'Total: 1+0+0+0+6 = 7', hi: 'कुल: 1+0+0+0+6 = 7' },
        { en: '7 mod 7 = 0 = Saturday', hi: '7 mod 7 = 0 = शनिवार' },
      ]}
      result={{ en: '1 Jan 2000 = Saturday ✓', hi: '1 जन 2000 = शनिवार ✓' }}
    />
    <ExampleCard
      title={{ en: 'Example 3: 4 July 1776 (1700s)', hi: 'उदाहरण 3: 4 जुलाई 1776 (1700 का दशक)' }}
      lines={[
        { en: 'd=4, m(Jul)=0, y=76, ⌊76÷4⌋=19, c(1700s)=4', hi: 'd=4, m(जुल)=0, y=76, ⌊76÷4⌋=19, c(1700 का दशक)=4' },
        { en: 'Total: 4+0+76+19+4 = 103', hi: 'कुल: 4+0+76+19+4 = 103' },
        { en: '103 mod 7 = 5 = Thursday', hi: '103 mod 7 = 5 = गुरुवार' },
      ]}
      result={{ en: '4 Jul 1776 = Thursday ✓', hi: '4 जुल 1776 = गुरुवार ✓' }}
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0 }}>
        💡 <BiText en="Always handle the leap-year Jan/Feb correction before computing the total. Century codes are the most common source of errors — memorise 1900s=0, 2000s=6." hi="कुल निकालने से पहले हमेशा लीप-वर्ष वाला जन/फ़र सुधार करें। शताब्दी कोड सबसे आम गलती का स्रोत हैं — 1900 का दशक=0, 2000 का दशक=6 याद रखें।" />
      </p>
    </div>
  </>
);

// ── L4_06 — Square Roots of Imperfect Squares ─────────────────────────────────

export const L4_06_CONTENT = (
  <>
    <SutraBox sutra="Vilokanam" meaning={{ en: 'Mere Observation', hi: 'केवल अवलोकन' }} />

    <SectionTitle>{{ en: 'Square Roots of Non-Perfect Squares', hi: 'अपूर्ण वर्गों के वर्गमूल' }}</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      <BiText en="Use the Vedic iterative method (similar to long division for square roots) to find √n to any desired decimal precision." hi="वैदिक पुनरावृत्ति विधि (वर्गमूल के लिए दीर्घ भाग जैसी) से इच्छित दशमलव सटीकता तक √n ज्ञात करें।" />
    </p>

    <StepBox number={1} text={{ en: 'Group the digits of the number in pairs from the decimal point outward', hi: 'दशमलव बिंदु से बाहर की ओर संख्या के अंकों के जोड़े बनाएँ' }} example={{ en: '√2: treat as √2.00 00 00 → groups: 2 | 00 | 00 | 00', hi: '√2: इसे √2.00 00 00 मानें → समूह: 2 | 00 | 00 | 00' }} />
    <StepBox number={2} text={{ en: 'Find the largest integer whose square ≤ the first group', hi: 'वह सबसे बड़ा पूर्णांक ज्ञात करें जिसका वर्ग पहले समूह से कम या बराबर हो' }} example={{ en: '1² = 1 ≤ 2 < 4 = 2². First digit = 1, remainder = 2 − 1 = 1', hi: '1² = 1 ≤ 2 < 4 = 2²। पहला अंक = 1, शेषफल = 2 − 1 = 1' }} />
    <StepBox number={3} text={{ en: 'Bring down next pair; double the current answer for the divisor prefix', hi: 'अगला जोड़ा नीचे लाएँ; भाजक उपसर्ग के लिए वर्तमान उत्तर को दोगुना करें' }} example={{ en: 'Bring down 00 → 100. Double of 1 = 2. Find d such that (20+d)×d ≤ 100', hi: '00 नीचे लाएँ → 100। 1 का दोगुना = 2। ऐसा d ज्ञात करें कि (20+d)×d ≤ 100' }} />
    <StepBox number={4} text={{ en: 'Choose the largest d; append to answer; subtract and repeat', hi: 'सबसे बड़ा d चुनें; उत्तर में जोड़ें; घटाएँ और दोहराएँ' }} example={{ en: 'd=4 → (24)×4=96 ≤ 100 → next digit = 4, remainder = 4', hi: 'd=4 → (24)×4=96 ≤ 100 → अगला अंक = 4, शेषफल = 4' }} />

    <SectionTitle>{{ en: 'Worked Examples', hi: 'हल किए गए उदाहरण' }}</SectionTitle>
    <ExampleCard
      title={{ en: 'Example 1: √2 to 4 decimal places', hi: 'उदाहरण 1: √2 को 4 दशमलव स्थानों तक' }}
      lines={[
        { en: 'Step 1: 1² ≤ 2 → digit = 1, remainder = 1', hi: 'चरण 1: 1² ≤ 2 → अंक = 1, शेषफल = 1' },
        { en: 'Bring 00 → 100. Divisor prefix = 2. (24)×4=96 → digit 4, rem 4', hi: '00 लाएँ → 100। भाजक उपसर्ग = 2। (24)×4=96 → अंक 4, शेषफल 4' },
        { en: 'Bring 00 → 400. Prefix = 28. (281)×1=281 → digit 1, rem 119', hi: '00 लाएँ → 400। उपसर्ग = 28। (281)×1=281 → अंक 1, शेषफल 119' },
        { en: 'Bring 00 → 11900. Prefix = 282. (2824)×4=11296 → digit 4, rem 604', hi: '00 लाएँ → 11900। उपसर्ग = 282। (2824)×4=11296 → अंक 4, शेषफल 604' },
      ]}
      result="√2 ≈ 1.4142 ✓"
    />
    <ExampleCard
      title={{ en: 'Example 2: √5 to 3 decimal places', hi: 'उदाहरण 2: √5 को 3 दशमलव स्थानों तक' }}
      lines={[
        { en: '2² = 4 ≤ 5 → digit 2, remainder 1', hi: '2² = 4 ≤ 5 → अंक 2, शेषफल 1' },
        { en: 'Bring 00 → 100. Prefix 4. (42)×2=84 → digit 2, rem 16', hi: '00 लाएँ → 100। उपसर्ग 4। (42)×2=84 → अंक 2, शेषफल 16' },
        { en: 'Bring 00 → 1600. Prefix 44. (442)×2=884 → digit 2, rem 132', hi: '00 लाएँ → 1600। उपसर्ग 44। (442)×2=884 → अंक 2, शेषफल 132' },
        { en: 'Bring 00 → 13200. Prefix 444. (4472)×2=8944... → digit 2', hi: '00 लाएँ → 13200। उपसर्ग 444। (4472)×2=8944... → अंक 2' },
      ]}
      result="√5 ≈ 2.236 ✓"
    />
    <ExampleCard
      title={{ en: 'Example 3: √17', hi: 'उदाहरण 3: √17' }}
      lines={[
        { en: '4² = 16 ≤ 17 → digit 4, remainder 1', hi: '4² = 16 ≤ 17 → अंक 4, शेषफल 1' },
        { en: 'Bring 00 → 100. Prefix 8. (81)×1=81 → digit 1, rem 19', hi: '00 लाएँ → 100। उपसर्ग 8। (81)×1=81 → अंक 1, शेषफल 19' },
        { en: 'Bring 00 → 1900. Prefix 82. (822)×2=1644 → digit 2, rem 256', hi: '00 लाएँ → 1900। उपसर्ग 82। (822)×2=1644 → अंक 2, शेषफल 256' },
      ]}
      result="√17 ≈ 4.12... ✓"
    />

    <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '14px 16px', marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
        ⚠️ <BiText en="The key is always: double the current answer to form the divisor prefix, then find the largest digit d such that (prefix_d) × d fits in the remainder. This method yields correct digits one at a time." hi="मुख्य नियम हमेशा यह है: भाजक उपसर्ग बनाने के लिए वर्तमान उत्तर को दोगुना करें, फिर वह सबसे बड़ा अंक d ज्ञात करें जिसके लिए (उपसर्ग_d) × d शेषफल में समाए। इस विधि से एक-एक करके सही अंक मिलते हैं।" />
      </p>
    </div>
  </>
);

// ── L4_07 — Vedic Sutras in Algebra — Factorisation ───────────────────────────

export const L4_07_CONTENT = (
  <>
    <SutraBox sutra="Anurupye Sunyamanyat" meaning={{ en: 'If one is in ratio, the other is zero', hi: 'अगर एक अनुपात में है, तो दूसरा शून्य है' }} />

    <SectionTitle>{{ en: 'Factorisation Using Vedic Sutras', hi: 'वैदिक सूत्रों से गुणनखंडन' }}</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      <BiText en="Vedic methods provide elegant shortcuts for factorising quadratics and higher-degree polynomials by working with the structure of coefficients." hi="वैदिक विधियाँ गुणांकों की संरचना देखकर द्विघात और उच्च-घात बहुपदों के गुणनखंडन के सरल शॉर्टकट देती हैं।" />
    </p>

    <SectionTitle>{{ en: 'Method 1 — Anurupye (Proportionality) for Quadratics', hi: 'विधि 1 — द्विघातों के लिए अनुरूप्ये (अनुपातिकता)' }}</SectionTitle>
    <StepBox number={1} text={{ en: 'For ax² + bx + c, find two numbers p, q such that p×q = a×c and p+q = b', hi: 'ax² + bx + c के लिए दो संख्याएँ p, q ज्ञात करें जहाँ p×q = a×c और p+q = b' }} example={{ en: 'For 2x² + 7x + 3: a×c = 6, p+q = 7 → p=6, q=1', hi: '2x² + 7x + 3 के लिए: a×c = 6, p+q = 7 → p=6, q=1' }} />
    <StepBox number={2} text={{ en: 'Split the middle term and factor by grouping', hi: 'बीच के पद को बाँटें और समूह बनाकर गुणनखंड करें' }} example="2x² + 6x + x + 3 = 2x(x+3) + 1(x+3) = (2x+1)(x+3)" />

    <SectionTitle>{{ en: 'Method 2 — Sunyam for Special Cases', hi: 'विधि 2 — विशेष स्थितियों के लिए शून्यम' }}</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      <BiText en="When the sum of all coefficients = 0, then (x−1) is a factor. When alternating coefficient sum = 0, then (x+1) is a factor." hi="जब सभी गुणांकों का योग = 0 हो, तो (x−1) गुणनखंड है। जब एकांतर गुणांक योग = 0 हो, तो (x+1) गुणनखंड है।" />
    </p>
    <ExampleCard
      title={{ en: 'Sum of coefficients = 0', hi: 'गुणांकों का योग = 0' }}
      lines={[
        { en: 'x² − 3x + 2: 1 − 3 + 2 = 0 → (x−1) is a factor', hi: 'x² − 3x + 2: 1 − 3 + 2 = 0 → (x−1) गुणनखंड है' },
        { en: 'Divide: x² − 3x + 2 = (x−1)(x−2)', hi: 'भाग दें: x² − 3x + 2 = (x−1)(x−2)' },
      ]}
      result="x² − 3x + 2 = (x−1)(x−2) ✓"
    />
    <ExampleCard
      title={{ en: 'Alternating sum = 0', hi: 'एकांतर योग = 0' }}
      lines={[
        { en: 'x³ + 2x² − x − 2: coefficients 1,2,−1,−2 → (1−2)+(−1+2)... alternating sum=0', hi: 'x³ + 2x² − x − 2: गुणांक 1,2,−1,−2 → (1−2)+(−1+2)... एकांतर योग = 0' },
        { en: '(x+1) is a factor', hi: '(x+1) गुणनखंड है' },
        'x³ + 2x² − x − 2 = (x+1)(x²+x−2) = (x+1)(x+2)(x−1)',
      ]}
      result="(x+1)(x+2)(x−1) ✓"
    />

    <SectionTitle>{{ en: 'Method 3 — Urdhva for Direct Expansion (and Reverse)', hi: 'विधि 3 — सीधे विस्तार (और उलटे) के लिए ऊर्ध्व' }}</SectionTitle>
    <ExampleCard
      title={{ en: 'Example — Factor 6x² + 11x + 3', hi: 'उदाहरण — 6x² + 11x + 3 के गुणनखंड' }}
      lines={[
        { en: 'a×c = 18, b = 11 → split: 9×2 = 18, 9+2 = 11', hi: 'a×c = 18, b = 11 → बाँटें: 9×2 = 18, 9+2 = 11' },
        '6x² + 9x + 2x + 3',
        '3x(2x+3) + 1(2x+3) = (3x+1)(2x+3)',
      ]}
      result="6x² + 11x + 3 = (3x+1)(2x+3) ✓"
    />
    <ExampleCard
      title={{ en: 'Example — Factor x² − 9', hi: 'उदाहरण — x² − 9 के गुणनखंड' }}
      lines={[
        { en: 'Difference of squares: a² − b² = (a−b)(a+b)', hi: 'वर्गों का अंतर: a² − b² = (a−b)(a+b)' },
        'x² − 9 = x² − 3²',
      ]}
      result="x² − 9 = (x−3)(x+3) ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0, lineHeight: 1.7 }}>
        💡 <BiText en="The Vedic approach to factorisation recognises patterns in the coefficients rather than trial-and-error. Check sum-of-coefficients and alternating-sum shortcuts first — they save the most time in exams!" hi="वैदिक गुणनखंडन में अंदाज़े के बजाय गुणांकों के पैटर्न पहचाने जाते हैं। पहले गुणांक-योग और एकांतर-योग के शॉर्टकट जाँचें — परीक्षा में सबसे ज़्यादा समय बचाते हैं!" />
      </p>
    </div>
  </>
);

// ── L4_08 — Master Assessment ─────────────────────────────────────────────────

export function L4_08_CONTENT({ onSwitchTab }) {
  return (
    <>
      <div style={{ background: 'linear-gradient(135deg, #0A1628, #7C3AED)', borderRadius: 16, padding: 28, marginBottom: 24 }}>
        <h2 className="font-heading" style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 6 }}>
          👑 Master Assessment
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'rgba(255,255,255,0.85)', marginBottom: 20 }}>
          The ultimate test of Vedic Mathematics mastery — all 40 lessons
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 20 }}>
          {[
            '✓ All Level 1 Beginner techniques',
            '✓ All Level 2 Intermediate methods',
            '✓ All Level 3 Advanced sutras',
            '✓ Cubing & General Squaring',
            '✓ Osculators & Auxiliary Fractions',
            '✓ Calendar, Square Roots & Algebra',
          ].map(t => (
            <div key={t} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>
              {t}
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          {[
            '• 10 challenging questions spanning all levels',
            '• Score 60% or above to earn the Master Badge',
            '• Your achievement will be celebrated!',
          ].map(r => (
            <p key={r} style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: '5px 0' }}>{r}</p>
          ))}
        </div>

        <button
          onClick={() => onSwitchTab && onSwitchTab('quiz')}
          style={{ width: '100%', minHeight: 48, background: 'white', color: '#0A1628', border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
        >
          Take the Master Assessment →
        </button>
      </div>

      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 14 }}>All 16 Sutras Mastered</h3>
      <style>{`@media(max-width:640px){.rev-row4{overflow-x:auto!important;-webkit-overflow-scrolling:touch!important;}}`}</style>
      <div className="rev-row4" style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
        {[
          { title: 'Nikhilam', rule: 'cross | def²' },
          { title: 'Urdhva', rule: 'vert × cross' },
          { title: 'Paravartya', rule: 'transpose & apply' },
          { title: 'Ekadhikena', rule: 'n×(n+1)|25' },
          { title: 'Duplex', rule: 'D(a)|D(ab)|...' },
          { title: 'Anurupyena', rule: 'proportion\nscaling' },
        ].map(b => (
          <div key={b.title} style={{ background: '#F0F4FF', borderRadius: 12, padding: 14, textAlign: 'center', minWidth: 140, flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: '#0A1628', marginBottom: 6 }}>{b.title}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#7C3AED', whiteSpace: 'pre-line' }}>{b.rule}</div>
          </div>
        ))}
      </div>
    </>
  );
}
