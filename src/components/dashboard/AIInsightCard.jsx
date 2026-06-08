import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const TIPS = [
  'Practice each Vedic sutra for 5 minutes daily before moving on — repetition builds speed.',
  'Teach what you learn to someone else. Explaining Vedic tricks cements your own understanding.',
  'Start with numbers close to a base (10, 100, 1000) when practicing Nikhilam — it builds intuition fast.',
  'Don\'t rush past the basics. A strong foundation in Ekadhikena will unlock 3x faster learning later.',
  'Track your daily practice streaks — even 10 minutes a day beats 2-hour weekend sessions.',
];

export default function AIInsightCard({ profile }) {
  const [tipIdx, setTipIdx] = useState(0);

  const tip = profile?.personalizedTip || TIPS[tipIdx % TIPS.length];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-[20px] p-6 border border-[#DBEAFE]"
      style={{ background: '#F0F4FF' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">💡</span>
          <span className="text-xs font-semibold text-[#1E40AF] uppercase tracking-wider">Your AI Insight</span>
        </div>
        <button
          onClick={() => setTipIdx(i => i + 1)}
          className="p-1.5 rounded-lg hover:bg-[#DBEAFE] transition-colors"
          title="Refresh tip"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#3B82F6]" />
        </button>
      </div>
      <p className="text-sm text-[#1E40AF] leading-relaxed">{tip}</p>
    </motion.div>
  );
}