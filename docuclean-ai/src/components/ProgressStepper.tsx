import React from 'react';
import { useLocation } from 'react-router-dom';
import { UploadCloud, SlidersHorizontal, Cpu, Eye, Download, Check } from 'lucide-react';

interface Step {
  id: string;
  name: string;
  path: string;
  icon: React.ElementType;
}

const STEPS: Step[] = [
  { id: 'upload', name: 'Upload', path: '/upload', icon: UploadCloud },
  { id: 'choose-options', name: 'Options', path: '/choose-options', icon: SlidersHorizontal },
  { id: 'processing', name: 'Processing', path: '/processing', icon: Cpu },
  { id: 'preview', name: 'Preview', path: '/preview', icon: Eye },
  { id: 'download', name: 'Download', path: '/download-options', icon: Download },
];

export const ProgressStepper: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getStepIndex = (path: string): number => {
    if (path === '/upload') return 0;
    if (path === '/choose-options') return 1;
    if (path === '/processing') return 2;
    if (path === '/preview') return 3;
    if (path === '/download-options' || path === '/downloading' || path === '/success') return 4;
    return -1;
  };

  const currentIndex = getStepIndex(currentPath);

  // Only display stepper on workflow pages
  if (currentIndex === -1) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-4">
      <div className="p-3 sm:p-4 rounded-2xl flex items-center justify-between relative overflow-hidden bg-[#FFF8ED]/90 border border-[#6B315E]/20 shadow-xs backdrop-blur-md">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <React.Fragment key={step.id}>
              {/* Step item */}
              <div className="flex flex-col items-center gap-1 relative z-10">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-[#24162F] to-[#6B315E] text-[#FFF8ED] shadow-md scale-105 ring-2 ring-[#C65D45]/40'
                      : isCompleted
                      ? 'bg-[#A8D5C2]/40 text-[#3C8D87] font-bold'
                      : 'bg-[#FFF8ED] text-[#978D91] border border-[#EADCC8]'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-semibold ${
                    isCurrent ? 'text-[#2C2830] font-bold font-heading' : isCompleted ? 'text-[#3C8D87]' : 'text-[#978D91]'
                  }`}
                >
                  {step.name}
                </span>
              </div>

              {/* Connecting line */}
              {idx < STEPS.length - 1 && (
                <div className="flex-1 h-[2px] mx-2 bg-[#EADCC8] relative overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      idx < currentIndex ? 'bg-gradient-to-r from-[#6B315E] to-[#3C8D87] w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
