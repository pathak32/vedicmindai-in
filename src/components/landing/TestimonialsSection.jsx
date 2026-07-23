import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function TestimonialsSection() {
  const { t } = useLanguage();

  const testimonials = [
    { text: t('testimonial1Text'), name: 'Priya Sharma', role: t('testimonial1Role') },
    { text: t('testimonial2Text'), name: 'Rohan Mehta', role: t('testimonial2Role') },
    { text: t('testimonial3Text'), name: 'Sunita Gupta', role: t('testimonial3Role') },
  ];

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-[#3B82F6] uppercase tracking-wider mb-3">{t('testimonialsLabel')}</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0A1628]">
            {t('testimonialsTitle')}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card-solid p-8 relative"
            >
              <Quote className="w-8 h-8 text-[#3B82F6]/20 absolute top-6 right-6" />
              <p className="text-[#0A1628] text-lg leading-relaxed mb-6 font-medium">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0A1628] text-white flex items-center justify-center text-sm font-bold">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-[#0A1628] text-sm">{t.name}</p>
                  <p className="text-xs text-[#4B5563]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}