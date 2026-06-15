import React from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Sparkles, Target } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const steps = [
  {
    icon: UserCircle,
    num: '01',
    title: 'Tell us about yourself',
    desc: 'Quick 4-step onboarding to understand your level, board, and learning goals.',
  },
  {
    icon: Sparkles,
    num: '02',
    title: 'Get your AI learning path',
    desc: 'Our AI analyzes your profile and creates a personalized curriculum just for you.',
  },
  {
    icon: Target,
    num: '03',
    title: 'Learn, practice, master',
    desc: 'Daily lessons with Vedic sutras plus speed drills to build unstoppable mental math skills.',
  },
];

export default function HowItWorksSection() {
  const { t } = useLanguage();
  return (
    <section id="how-it-works" className="py-24 bg-[#F8FAFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-[#3B82F6] uppercase tracking-wider mb-3">{t('howItWorks')}</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0A1628]">
            {t('threeStepsHeading')}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-[#F0F4FF] flex items-center justify-center">
                  <s.icon className="w-9 h-9 text-[#1E40AF]" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#0A1628] text-white text-xs font-bold flex items-center justify-center font-mono">
                  {s.num}
                </span>
              </div>
              <h3 className="font-heading text-xl font-bold text-[#0A1628] mb-3">{s.title}</h3>
              <p className="text-[#4B5563] leading-relaxed max-w-xs mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}