import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

function timeAgo(isoDate) {
  const diff = (Date.now() - new Date(isoDate).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 172800) return 'Yesterday';
  return `${Math.floor(diff / 86400)} days ago`;
}

export default function RecentActivity({ progress }) {
  // Build activity from practiceHistory (most recent 5)
  const items = [...(progress.practiceHistory || [])]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-[20px] p-6 border border-[#F0F4FF]"
      style={{ boxShadow: '0 4px 24px rgba(10,22,40,0.06)' }}
    >
      <h2 className="font-heading text-lg font-bold text-[#0A1628] mb-4">Recent Activity</h2>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <span className="text-4xl block mb-3">🚀</span>
          <p className="text-[#9CA3AF] text-sm">No activity yet. Start your first lesson!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0F4FF] flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-[#1E40AF]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0A1628] truncate">
                  {item.correct ? '✅' : '❌'} Practice round — {item.difficulty || 'easy'} mode
                </p>
                <p className="text-xs text-[#9CA3AF]">{timeAgo(item.date)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}