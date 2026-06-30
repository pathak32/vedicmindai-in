import React from 'react';

function SutraBox({ sutra, meaning }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0A1628, #1E40AF)',
      borderRadius: 12, padding: '16px 20px', marginBottom: 24,
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: '#93C5FD', marginBottom: 4 }}>{sutra}</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>"{meaning}"</div>
    </div>
  );
}

function StepBox({ number, text, example }) {
  return (
    <div style={{
      background: '#F0F4FF', borderLeft: '4px solid #3B82F6',
      borderRadius: '0 8px 8px 0', padding: '12px 16px', marginBottom: 10,
    }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628' }}>
        <span style={{ fontWeight: 700, marginRight: 8 }}>Step {number}:</span>{text}
      </div>
      {example && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1E40AF', marginTop: 6 }}>{example}</div>
      )}
    </div>
  );
}

function ExampleCard({ title, lines, result }) {
  return (
    <div style={{ background: '#F0F4FF', border: '1px solid rgba(30,64,175,0.12)', borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 8 }}>{title}</div>
      {lines.map((l, i) => (
        <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#4B5563', marginBottom: 4 }}>{l}</div>
      ))}
      {result && (
        <div style={{ marginTop: 10, background: '#DBEAFE', borderRadius: 8, padding: '8px 14px', display: 'inline-block' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: '#0A1628' }}>{result}</span>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: '#0A1628', marginBottom: 14, marginTop: 24 }}>
      {children}
    </h3>
  );
}

// ── L4_05 — Calendar Calculations ─────────────────────────────────────────────

export const L4_05_CONTENT = (
  <>
    <SutraBox sutra="Vilokanam" meaning="Mere Observation" />

    <SectionTitle>Advanced Calendar Calculations</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      Build on the Level 2 calendar formula for any century, including edge cases like leap years and cross-century dates.
    </p>

    <div style={{ background: '#0A1628', borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'white', marginBottom: 8, textAlign: 'center' }}>
        Day = (d + m + y + ⌊y÷4⌋ + c) mod 7
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 2, textAlign: 'left', display: 'inline-block' }}>
        <div>c = century code: 1700s→4, 1800s→2, 1900s→0, 2000s→6</div>
        <div>0=Sun · 1=Mon · 2=Tue · 3=Wed · 4=Thu · 5=Fri · 6=Sat</div>
        <div>Leap year Jan/Feb: subtract 1 from month code</div>
      </div>
    </div>

    <SectionTitle>Month Codes (Advanced Reference)</SectionTitle>
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

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1: 15 August 1947"
      lines={['d=15, m(Aug)=3, y=47, ⌊47÷4⌋=11, c(1900s)=0', 'Total: 15+3+47+11+0 = 76', '76 mod 7 = 6 = Saturday']}
      result="15 Aug 1947 = Saturday ✓"
    />
    <ExampleCard
      title="Example 2: 1 January 2000 (leap year Jan)"
      lines={['d=1, m(Jan leap)=1−1=0, y=00, ⌊0÷4⌋=0, c(2000s)=6', 'Total: 1+0+0+0+6 = 7', '7 mod 7 = 0 = Saturday']}
      result="1 Jan 2000 = Saturday ✓"
    />
    <ExampleCard
      title="Example 3: 4 July 1776 (1700s)"
      lines={['d=4, m(Jul)=0, y=76, ⌊76÷4⌋=19, c(1700s)=4', 'Total: 4+0+76+19+4 = 103', '103 mod 7 = 5 = Thursday']}
      result="4 Jul 1776 = Thursday ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0 }}>
        💡 Always handle the leap-year Jan/Feb correction before computing the total. Century codes are the most common source of errors — memorise 1900s=0, 2000s=6.
      </p>
    </div>
  </>
);

// ── L4_06 — Square Roots of Imperfect Squares ─────────────────────────────────

export const L4_06_CONTENT = (
  <>
    <SutraBox sutra="Vilokanam" meaning="Mere Observation" />

    <SectionTitle>Square Roots of Non-Perfect Squares</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      Use the Vedic iterative method (similar to long division for square roots) to find √n to any desired decimal precision.
    </p>

    <StepBox number={1} text="Group the digits of the number in pairs from the decimal point outward" example="√2: treat as √2.00 00 00 → groups: 2 | 00 | 00 | 00" />
    <StepBox number={2} text="Find the largest integer whose square ≤ the first group" example="1² = 1 ≤ 2 < 4 = 2². First digit = 1, remainder = 2 − 1 = 1" />
    <StepBox number={3} text="Bring down next pair; double the current answer for the divisor prefix" example="Bring down 00 → 100. Double of 1 = 2. Find d such that (20+d)×d ≤ 100" />
    <StepBox number={4} text="Choose the largest d; append to answer; subtract and repeat" example="d=4 → (24)×4=96 ≤ 100 → next digit = 4, remainder = 4" />

    <SectionTitle>Worked Examples</SectionTitle>
    <ExampleCard
      title="Example 1: √2 to 4 decimal places"
      lines={['Step 1: 1² ≤ 2 → digit = 1, remainder = 1', 'Bring 00 → 100. Divisor prefix = 2. (24)×4=96 → digit 4, rem 4', 'Bring 00 → 400. Prefix = 28. (281)×1=281 → digit 1, rem 119', 'Bring 00 → 11900. Prefix = 282. (2824)×4=11296 → digit 4, rem 604']}
      result="√2 ≈ 1.4142 ✓"
    />
    <ExampleCard
      title="Example 2: √5 to 3 decimal places"
      lines={['2² = 4 ≤ 5 → digit 2, remainder 1', 'Bring 00 → 100. Prefix 4. (42)×2=84 → digit 2, rem 16', 'Bring 00 → 1600. Prefix 44. (442)×2=884 → digit 2, rem 132', 'Bring 00 → 13200. Prefix 444. (4472)×2=8944... → digit 2']}
      result="√5 ≈ 2.236 ✓"
    />
    <ExampleCard
      title="Example 3: √17"
      lines={['4² = 16 ≤ 17 → digit 4, remainder 1', 'Bring 00 → 100. Prefix 8. (81)×1=81 → digit 1, rem 19', 'Bring 00 → 1900. Prefix 82. (822)×2=1644 → digit 2, rem 256']}
      result="√17 ≈ 4.12... ✓"
    />

    <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '14px 16px', marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
        ⚠️ The key is always: double the current answer to form the divisor prefix, then find the largest digit d such that (prefix_d) × d fits in the remainder. This method yields correct digits one at a time.
      </p>
    </div>
  </>
);

// ── L4_07 — Vedic Sutras in Algebra — Factorisation ───────────────────────────

export const L4_07_CONTENT = (
  <>
    <SutraBox sutra="Anurupye Sunyamanyat" meaning="If one is in ratio, the other is zero" />

    <SectionTitle>Factorisation Using Vedic Sutras</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      Vedic methods provide elegant shortcuts for factorising quadratics and higher-degree polynomials by working with the structure of coefficients.
    </p>

    <SectionTitle>Method 1 — Anurupye (Proportionality) for Quadratics</SectionTitle>
    <StepBox number={1} text="For ax² + bx + c, find two numbers p, q such that p×q = a×c and p+q = b" example="For 2x² + 7x + 3: a×c = 6, p+q = 7 → p=6, q=1" />
    <StepBox number={2} text="Split the middle term and factor by grouping" example="2x² + 6x + x + 3 = 2x(x+3) + 1(x+3) = (2x+1)(x+3)" />

    <SectionTitle>Method 2 — Sunyam for Special Cases</SectionTitle>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 16 }}>
      When the sum of all coefficients = 0, then (x−1) is a factor. When alternating coefficient sum = 0, then (x+1) is a factor.
    </p>
    <ExampleCard
      title="Sum of coefficients = 0"
      lines={['x² − 3x + 2: 1 − 3 + 2 = 0 → (x−1) is a factor', 'Divide: x² − 3x + 2 = (x−1)(x−2)']}
      result="x² − 3x + 2 = (x−1)(x−2) ✓"
    />
    <ExampleCard
      title="Alternating sum = 0"
      lines={['x³ + 2x² − x − 2: coefficients 1,2,−1,−2 → (1−2)+(−1+2)... alternating sum=0', '(x+1) is a factor', 'x³ + 2x² − x − 2 = (x+1)(x²+x−2) = (x+1)(x+2)(x−1)']}
      result="(x+1)(x+2)(x−1) ✓"
    />

    <SectionTitle>Method 3 — Urdhva for Direct Expansion (and Reverse)</SectionTitle>
    <ExampleCard
      title="Example — Factor 6x² + 11x + 3"
      lines={['a×c = 18, b = 11 → split: 9×2 = 18, 9+2 = 11', '6x² + 9x + 2x + 3', '3x(2x+3) + 1(2x+3) = (3x+1)(2x+3)']}
      result="6x² + 11x + 3 = (3x+1)(2x+3) ✓"
    />
    <ExampleCard
      title="Example — Factor x² − 9"
      lines={['Difference of squares: a² − b² = (a−b)(a+b)', 'x² − 9 = x² − 3²']}
      result="x² − 9 = (x−3)(x+3) ✓"
    />

    <div style={{ background: '#F0F4FF', borderRadius: 12, padding: 16, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0, lineHeight: 1.7 }}>
        💡 The Vedic approach to factorisation recognises patterns in the coefficients rather than trial-and-error. Check sum-of-coefficients and alternating-sum shortcuts first — they save the most time in exams!
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
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