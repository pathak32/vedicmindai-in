import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { communityQAData } from '@/data/communityQAData';

export default function CommunitySection() {
  const { t } = useLanguage();

  return (
    <section id="community" style={{ background: '#F0F4FF', padding: '80px 0' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {t('communityLabel')}
          </p>
          <h2 className="font-heading" style={{ fontSize: 'clamp(26px,4vw,34px)', fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>
            {t('communityTitle')}
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#4B5563', margin: 0 }}>
            {t('communitySubtitle')}
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
          {communityQAData.map((qa) => (
            <motion.div
              key={qa.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                background: 'white', borderRadius: 16, padding: 22,
                boxShadow: '0 4px 16px rgba(10,22,40,0.05)',
              }}
            >
              <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', background: '#DBEAFE',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <MessageCircle size={16} color="#1E40AF" />
                </div>
                <div>
                  <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: '#0A1628', lineHeight: 1.5 }}>
                    {qa.question}
                  </p>
                  <p style={{ margin: '4px 0 0', fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF' }}>
                    {qa.askedBy}
                  </p>
                </div>
              </div>
              <div style={{ paddingLeft: 42 }}>
                <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.6 }}>
                  {qa.answer}
                </p>
                <p style={{ margin: '6px 0 0', fontFamily: 'var(--font-body)', fontSize: 11, color: '#3B82F6', fontWeight: 600 }}>
                  {t('communityAnsweredBy')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              display: 'inline-block', padding: '12px 28px', background: '#0A1628',
              color: 'white', borderRadius: 12, textDecoration: 'none',
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
            }}
          >
            {t('communityAskBtn')}
          </a>
        </div>
      </div>
    </section>
  );
}
