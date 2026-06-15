import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#0A1628] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-heading text-xl font-bold text-white">VedicMindAI™</span>
            <p className="text-blue-300 text-sm mt-1">{t('ancientWisdom')}</p>
          </div>
          <div className="flex gap-6 text-sm text-blue-300">
            <a href="#" className="hover:text-white transition-colors">{t('privacy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('terms')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('contact')}</a>
          </div>
          <p className="text-sm text-blue-400">© {new Date().getFullYear()} VedicMindAI™. All rights reserved.</p>
          <p className="text-xs text-blue-500 mt-1">
            VedicMindAI™ — Trademark application pending | Classes 9, 41 &amp; 42 | App. Nos. 7785746, 7785747, 7785748 | Govt. of India
          </p>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 24, paddingTop: 16, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            © 2026 VedicMindAI™ | vedicmindai.in | Ancient Wisdom. Infinite Speed.
          </p>
        </div>
      </div>
    </footer>
  );
}