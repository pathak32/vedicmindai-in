import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Heart } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function PurposeSection() {
  const { t } = useLanguage();

  const pillars = [
    { icon: Sparkles, title: t('purposeWhatTitle'), desc: t('purposeWhatDesc') },
    { icon: Target, title: t('purposeWhyTitle'), desc: t('purposeWhyDesc') },
    { icon: Heart, title: t('purposeMissionTitle'), desc: t('purposeMissionDesc') },
  ];

  return (
    <section id="about" className="py-24 bg-[#F8FAFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <p className="text-sm font-semibold text-[#3B82F6] uppercase tracking-wider mb-3">
            {t('purposeEyebrow')}
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0A1628] mb-4">
            {t('purposeHeading')}
          </h2>
          <p className="text-[#4B5563] leading-relaxed text-lg">
            {t('purposeIntro')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-8 bg-white"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#F0F4FF] flex items-center justify-center mb-6">
                <p.icon className="w-7 h-7 text-[#1E40AF]" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#0A1628] mb-3">{p.title}</h3>
              <p className="text-[#4B5563] leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
