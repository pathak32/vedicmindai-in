import React from 'react';
import { motion } from 'framer-motion';
import { Brain, BookOpen, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    { icon: Brain, title: t('feature1Title'), desc: t('feature1Desc') },
    { icon: BookOpen, title: t('feature2Title'), desc: t('feature2Desc') },
    { icon: BarChart3, title: t('feature3Title'), desc: t('feature3Desc') },
    { icon: null, emoji: '🥊', title: t('feature4Title'), desc: t('feature4Desc'), comingSoon: false, isLive: true },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-[#3B82F6] uppercase tracking-wider mb-3">{t('whyVedicMind')}</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0A1628]">
            {t('featuresHeading')}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-8 hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#F0F4FF] flex items-center justify-center mb-6">
                {f.emoji
                  ? <span style={{ fontSize: 28 }}>{f.emoji}</span>
                  : <f.icon className="w-7 h-7 text-[#1E40AF]" />
                }
              </div>
              <h3 className="font-heading text-xl font-bold text-[#0A1628] mb-3">{f.title}</h3>
              <p className="text-[#4B5563] leading-relaxed">{f.desc}</p>
              {f.isLive && (
                <span style={{
                  display: 'inline-block', marginTop: 8,
                  background: '#10B981', color: 'white',
                  borderRadius: 99, padding: '3px 12px',
                  fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                }}>
                  ✅ {t('badgeLive')}
                </span>
              )}
              {f.comingSoon && (
                <span style={{
                  display: 'inline-block', marginTop: 8,
                  background: 'rgba(245,158,11,0.15)', color: '#B45309',
                  border: '1px solid rgba(245,158,11,0.4)',
                  borderRadius: 99, padding: '3px 12px',
                  fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                }}>
                  ⚡ {t('badgeComingSoon')}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}