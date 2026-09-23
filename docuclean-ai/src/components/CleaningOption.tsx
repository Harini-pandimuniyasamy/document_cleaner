import React from 'react';
import {
  Space,
  WrapText,
  SpellCheck,
  Sparkles,
  AlignLeft,
  BookOpen,
  FileSearch,
  Maximize2,
  Check,
} from 'lucide-react';
import { CleaningOptionItem } from '../types';

interface CleaningOptionProps {
  option: CleaningOptionItem;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const getOptionIcon = (id: string) => {
  switch (id) {
    case 'remove-spaces':
      return Space;
    case 'fix-line-breaks':
      return WrapText;
    case 'correct-ocr':
      return SpellCheck;
    case 'remove-noise':
      return Sparkles;
    case 'normalize-formatting':
      return AlignLeft;
    case 'enhance-readability':
      return BookOpen;
    case 'searchable-pdf':
      return FileSearch;
    case 'deskew-document':
      return Maximize2;
    default:
      return Sparkles;
  }
};

// Micro-interaction previews per feature
const renderMicroPreview = (id: string, isSelected: boolean) => {
  switch (id) {
    case 'remove-spaces':
      return (
        <div className="font-mono text-[10px] p-1.5 rounded bg-slate-100/80 flex items-center justify-between text-slate-700">
          <span className="line-through text-red-400">DATA&nbsp;&nbsp;&nbsp;&nbsp;CORE</span>
          <span className="text-emerald-700 font-bold">DATA CORE</span>
        </div>
      );
    case 'fix-line-breaks':
      return (
        <div className="font-mono text-[10px] p-1.5 rounded bg-slate-100/80 flex items-center justify-between text-slate-700">
          <span className="text-red-400">cove- \nnant</span>
          <span className="text-emerald-700 font-bold">covenant</span>
        </div>
      );
    case 'correct-ocr':
      return (
        <div className="font-mono text-[10px] p-1.5 rounded bg-slate-100/80 flex items-center justify-between text-slate-700">
          <span className="text-red-400">thls&nbsp;p4ge</span>
          <span className="text-emerald-700 font-bold">this page</span>
        </div>
      );
    case 'remove-noise':
      return (
        <div className="font-mono text-[10px] p-1.5 rounded bg-slate-100/80 flex items-center justify-between text-slate-700">
          <span className="text-slate-400">• • • : :</span>
          <span className="text-cyan-700 font-bold">Bleached Clean</span>
        </div>
      );
    case 'normalize-formatting':
      return (
        <div className="font-mono text-[10px] p-1.5 rounded bg-slate-100/80 flex items-center justify-between text-slate-700">
          <span className="text-slate-400">|= &nbsp;&nbsp;=|</span>
          <span className="text-indigo-700 font-bold">Squared 100%</span>
        </div>
      );
    case 'deskew-document':
      return (
        <div className="font-mono text-[10px] p-1.5 rounded bg-slate-100/80 flex items-center justify-between text-slate-700">
          <span className="text-amber-500">Skew: +3.4°</span>
          <span className="text-emerald-700 font-bold">0.00° Aligned</span>
        </div>
      );
    case 'searchable-pdf':
      return (
        <div className="font-mono text-[10px] p-1.5 rounded bg-slate-100/80 flex items-center justify-between text-slate-700">
          <span className="text-slate-400">Bitmap Scan</span>
          <span className="text-[#2563eb] font-bold">Text Selectable</span>
        </div>
      );
    default:
      return (
        <div className="font-mono text-[10px] p-1.5 rounded bg-slate-100/80 flex items-center justify-between text-slate-700">
          <span className="text-slate-400">Contrast: 65%</span>
          <span className="text-emerald-700 font-bold">Enhanced 98%</span>
        </div>
      );
  }
};

export const CleaningOption: React.FC<CleaningOptionProps> = ({
  option,
  isSelected,
  onToggle,
}) => {
  const IconComponent = getOptionIcon(option.id);

  return (
    <div
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={() => onToggle(option.id)}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onToggle(option.id);
        }
      }}
      className={`glass-card-interactive p-5 sm:p-6 rounded-2xl cursor-pointer select-none transition-all duration-300 relative border flex flex-col justify-between preserve-3d ${
        isSelected
          ? 'bg-gradient-to-b from-[#eef2ff] to-white/95 border-[#712ae2] shadow-[0_20px_40px_-10px_rgba(79,70,229,0.25),0_0_20px_rgba(103,232,249,0.15)] ring-2 ring-indigo-500/20'
          : 'bg-white/70 border-white/70 hover:border-indigo-200 hover:bg-white/90 shadow-sm'
      }`}
      style={{
        transform: isSelected
          ? 'translateZ(14px) translateY(-4px)'
          : 'translateZ(0px)',
      }}
    >
      <div>
        {/* Top Header: Icon & Checkbox */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isSelected
                ? 'bg-gradient-to-br from-[#1f108e] via-[#4f46e5] to-[#712ae2] text-white shadow-md shadow-indigo-900/25 scale-105'
                : 'bg-indigo-50 text-[#712ae2]'
            }`}
          >
            <IconComponent className="w-5 h-5" />
          </div>

          {/* Animated Custom Checkbox with Particle Pop */}
          <div className="relative">
            <div
              className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-tr from-[#1f108e] to-[#712ae2] border-[#712ae2] text-white shadow-md shadow-indigo-600/30 scale-105'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {isSelected && (
                <Check className="w-4 h-4 stroke-[3] animate-in zoom-in-50 duration-150" />
              )}
            </div>
            {isSelected && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#67e8f9] animate-ping" />
            )}
          </div>
        </div>

        {/* Title & Badge */}
        <div className="flex items-center gap-2 mb-1.5">
          <h4 className="font-bold text-slate-900 text-base leading-snug">{option.title}</h4>
          {option.recommended && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-[#1f108e]">
              Recommended
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 leading-relaxed mb-3">{option.description}</p>

        {/* Micro-Interaction Preview */}
        {renderMicroPreview(option.id, isSelected)}
      </div>

      {/* Selected Indicator Bar */}
      {isSelected && (
        <div className="mt-4 pt-2.5 border-t border-indigo-200/60 flex items-center justify-between text-[11px] font-semibold text-[#1f108e]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Module Active
          </span>
          <span className="text-[#712ae2] font-mono text-[10px]">READY</span>
        </div>
      )}
    </div>
  );
};
