import React from 'react';
import { Check } from 'lucide-react';

const STEPS = ['Who Are You', 'Your Details', 'Academic Profile', 'Your Goals'];

export default function StepProgress({ currentStep }) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between relative">
        {/* connecting line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#E5E7EB] z-0" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-[#0A1628] z-0 transition-all duration-500"
          style={{ width: `${(Math.max(0, currentStep - 1) / 3) * 100}%` }}
        />
        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const done = currentStep > stepNum;
          const active = currentStep === stepNum;
          return (
            <div key={i} className="flex flex-col items-center z-10">
              <div className={`relative w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                done ? 'bg-[#0A1628] border-[#0A1628]' :
                active ? 'bg-[#0A1628] border-[#0A1628]' :
                'bg-white border-[#D1D5DB]'
              }`}>
                {done ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className={`text-xs font-bold font-mono ${active ? 'text-white' : 'text-[#9CA3AF]'}`}>
                    {stepNum}
                  </span>
                )}
                {active && (
                  <span className="absolute inset-0 rounded-full border-2 border-[#0A1628] animate-ping opacity-40" />
                )}
              </div>
              <span className={`mt-2 text-[10px] sm:text-xs font-medium text-center max-w-[60px] sm:max-w-[80px] leading-tight ${
                active ? 'text-[#0A1628]' : done ? 'text-[#4B5563]' : 'text-[#9CA3AF]'
              }`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}