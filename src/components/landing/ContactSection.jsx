import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" style={{ background: 'white', padding: '80px 0' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {t('contactSectionLabel')}
          </p>
          <h2 className="font-heading" style={{ fontSize: 'clamp(26px,4vw,34px)', fontWeight: 700, color: '#0A1628', marginBottom: 10 }}>
            {t('contactSectionTitle')}
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#4B5563', margin: 0 }}>
            {t('contactSectionSubtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}
        >
          {/* Support email */}
          <a href="mailto:support@vedicmindai.in" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            background: '#F0F4FF', borderRadius: 16, padding: '28px 20px', textDecoration: 'none',
          }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Mail size={22} color="#1E40AF" />
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', marginBottom: 4 }}>{t('contactSupportLabel')}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: '#0A1628' }}>support@vedicmindai.in</div>
          </a>

          {/* Admin / business email */}
          <a href="mailto:admin@vedicmindai.in" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            background: '#F0F4FF', borderRadius: 16, padding: '28px 20px', textDecoration: 'none',
          }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Mail size={22} color="#1E40AF" />
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', marginBottom: 4 }}>{t('contactAdminLabel')}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: '#0A1628' }}>admin@vedicmindai.in</div>
          </a>

          {/* Address */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            background: '#F0F4FF', borderRadius: 16, padding: '28px 20px',
          }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <MapPin size={22} color="#1E40AF" />
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', marginBottom: 4 }}>{t('contactAddressLabel')}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', lineHeight: 1.5 }}>{t('contactAddressValue')}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
