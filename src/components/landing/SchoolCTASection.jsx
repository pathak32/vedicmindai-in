import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';

// Prominent B2B call-to-action section on the homepage.
// Drives school principals and coaching center owners to the
// Collaborate page, which already has a full lead capture form.
// Placed just before the Contact section — at the bottom of the page
// where decision-makers who've read everything are most ready to act.

export default function SchoolCTASection() {
  const { t } = useLanguage();
  return (
    <section style={{ padding: '48px 16px', background: '#F0F4FF' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #0D2252 100%)',
          borderRadius: 20,
          padding: '40px 40px',
          display: 'flex', gap: 32, alignItems: 'center',
          flexWrap: 'wrap',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative circle */}
          <div style={{
            position: 'absolute', right: -40, top: -40,
            width: 200, height: 200, borderRadius: '50%',
            background: 'rgba(99,102,241,0.15)',
          }} />

          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(99,102,241,0.25)', borderRadius: 100,
              padding: '4px 14px', marginBottom: 14,
            }}>
              <span style={{ fontSize: 14 }}>🏫</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#A5B4FC', letterSpacing: 0.5 }}>
                FOR SCHOOLS & COACHING CENTERS
              </span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px,3vw,28px)',
              fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 12,
            }}>
              Bring Vedic Maths to Your Entire Classroom
            </h2>

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 15,
              color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 20,
            }}>
              Join schools and coaching institutes using VedicMindAI to give every
              student a personalised AI maths companion. Free pilot available —
              no upfront commitment.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
              {[
                'Free 4-week pilot for your class',
                'School-level progress dashboard for teachers',
                'Bulk access pricing for 50+ students',
              ].map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ color: '#34D399', fontSize: 14, flexShrink: 0 }}>✓</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>{f}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link
                to="/collaborate"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#6366F1', color: 'white', textDecoration: 'none',
                  padding: '12px 24px', borderRadius: 12,
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
                }}
              >
                🏫 Apply for Free Pilot →
              </Link>
              <a
                href="mailto:admin@vedicmindai.in"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white', textDecoration: 'none',
                  padding: '12px 24px', borderRadius: 12,
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14,
                }}
              >
                ✉️ Email Us
              </a>
            </div>
          </div>

          {/* Right stats */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 14,
            flexShrink: 0, position: 'relative',
          }}>
            {[
              { icon: '🏆', value: '40+', label: 'Vedic Maths Lessons' },
              { icon: '🧠', value: 'AI', label: 'Personalised Tutor' },
              { icon: '📊', label: 'Class Progress Dashboard', value: 'Live' },
            ].map(({ icon, value, label }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12, padding: '12px 18px',
                display: 'flex', alignItems: 'center', gap: 12,
                minWidth: 200,
              }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'white', lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
