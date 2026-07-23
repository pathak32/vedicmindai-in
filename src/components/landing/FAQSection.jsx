import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function FAQSection() {
  const { t, language } = useLanguage();
  const [openId, setOpenId] = useState(null);

  const faqs = [
    { id: 1, q: t('faq1Q'), a: t('faq1A') },
    { id: 2, q: t('faq2Q'), a: t('faq2A') },
    { id: '2b', q: t('faq2bQ'), a: t('faq2bA') },
    { id: '2c', q: t('faq2cQ'), a: t('faq2cA') },
    { id: '2d', q: t('faq2dQ'), a: t('faq2dA') },
    { id: '2e', q: t('faq2eQ'), a: t('faq2eA') },
    { id: 3, q: t('faq3Q'), a: t('faq3A') },
    { id: 4, q: t('faq4Q'), a: t('faq4A') },
    { id: 5, q: t('faq5Q'), a: t('faq5A') },
    { id: 6, q: t('faq6Q'), a: t('faq6A') },
    { id: 7, q: t('faq7Q'), a: t('faq7A') },
    { id: 8, q: t('faq8Q'), a: t('faq8A') },
  ];

  // FAQPage structured data — gives Google eligibility to show these
  // Q&As directly in search results, same mechanism as the Article
  // schema already added to blog posts. Mirrors whatever language is
  // currently displayed, matching the visible content.
  useEffect(() => {
    let ld = document.getElementById('faq-section-jsonld');
    if (!ld) {
      ld = document.createElement('script');
      ld.type = 'application/ld+json';
      ld.id = 'faq-section-jsonld';
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    });
    // Only remove on true unmount (route change away from home), not on
    // every language-toggle re-render — the id check above already
    // handles updates in place.
    return () => {
      if (!document.getElementById('faq')) {
        const stale = document.getElementById('faq-section-jsonld');
        if (stale) stale.remove();
      }
    };
  }, [language]);

  return (
    <section id="faq" style={{ background: '#F8FAFF', padding: '80px 0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 16px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {t('faqSectionLabel')}
          </p>
          <h2 className="font-heading" style={{ fontSize: 'clamp(26px,4vw,34px)', fontWeight: 700, color: '#0A1628', margin: 0 }}>
            {t('faqSectionTitle')}
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                  background: 'white',
                  borderRadius: 14,
                  border: '1px solid rgba(30,64,175,0.12)',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, color: '#0A1628', paddingRight: 12 }}>
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ flexShrink: 0, color: '#3B82F6' }}
                  >
                    <ChevronDown size={20} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{
                        margin: 0, padding: '0 20px 18px',
                        fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.65,
                      }}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
