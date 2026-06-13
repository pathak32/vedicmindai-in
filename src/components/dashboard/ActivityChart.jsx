import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      label: d.toLocaleDateString('en', { weekday: 'short' }),
      dateStr:
        d.getFullYear() +
        '-' +
        String(d.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(d.getDate()).padStart(2, '0'),
    };
  });
}

export default function ActivityChart({ progress }) {
  const days = getLast7Days();

  const data = useMemo(() => {
    return days.map(({ label, dateStr }) => {
      // Count lessons completed on this day using practiceHistory dates
      const practiceCount = (progress.practiceHistory || []).filter((r) => {
        const d = r.date ? r.date.slice(0, 10) : '';
        return d === dateStr && r.correct;
      }).length;

      const studyCount = (progress.studyDates || []).includes(dateStr) ? Math.max(1, practiceCount) : 0;
      return { day: label, lessons: studyCount };
    });
  }, [progress]);

  const hasData = data.some((d) => d.lessons > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-[20px] p-6 border border-[#F0F4FF]"
      style={{ boxShadow: '0 4px 24px rgba(10,22,40,0.06)' }}
    >
      <h2 className="font-heading text-lg font-bold text-[#0A1628] mb-4">Your Activity — Last 7 Days</h2>

      {hasData ? (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A1628" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0A1628" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid #F0F4FF', borderRadius: 12, fontSize: 12 }}
              itemStyle={{ color: '#0A1628' }}
            />
            <Area
              type="monotone" dataKey="lessons" stroke="#3B82F6" strokeWidth={2}
              fill="url(#areaGrad)" dot={false} activeDot={{ r: 4, fill: '#3B82F6' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-center">
          <div>
            <span className="text-4xl block mb-3">📈</span>
            <p className="text-[#9CA3AF] text-sm">Start learning to see your progress here</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}