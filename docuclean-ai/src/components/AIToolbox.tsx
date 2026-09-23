import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

export interface ToolModule {
  id: string;
  title: string;
  description: string;
  category: string;
  recommended?: boolean;
  beforePreview: string;
  afterPreview: string;
}

export const TOOLBOX_MODULES: ToolModule[] = [
  {
    id: 'remove-spaces',
    title: 'Remove Extra Spaces',
    description: 'Compresses accidental double, triple, and irregular whitespace between words into clean single typography spaces.',
    category: 'Whitespace',
    recommended: true,
    beforePreview: 'TEXT     TEXT',
    afterPreview: 'TEXT TEXT',
  },
  {
    id: 'remove-blank-lines',
    title: 'Remove Blank Lines',
    description: 'Eliminates rogue orphan line-gaps and ghost paragraph breaks caused by scanner margin overflows.',
    category: 'Layout',
    beforePreview: 'LINE 1\n\n\nLINE 2',
    afterPreview: 'LINE 1\nLINE 2',
  },
  {
    id: 'fix-line-breaks',
    title: 'Fix Broken Lines',
    description: 'Recombines hyphenated word wraps and premature column breaks into continuous, natural sentences.',
    category: 'Typography',
    recommended: true,
    beforePreview: 'docu-\nment',
    afterPreview: 'document',
  },
  {
    id: 'correct-ocr',
    title: 'Normalize Formatting & OCR',
    description: 'Disambiguates optical character confusions like 0 vs O, 1 vs l, and unifies standard curly quotes.',
    category: 'Optical Correction',
    recommended: true,
    beforePreview: '1nvo1ce_2O24',
    afterPreview: 'invoice_2024',
  },
  {
    id: 'remove-noise',
    title: 'Remove Noise & Artifacts',
    description: 'Digital bleaching filters eradicate scanner salt-and-pepper dust, hole-punch marks, and staple shadows.',
    category: 'Restoration',
    beforePreview: '•.· TEXT ·:•',
    afterPreview: 'TEXT',
  },
  {
    id: 'readability',
    title: 'Improve Readability & Flow',
    description: 'Aligns baseline tracking, balances font hierarchies, and standardizes spacing across headings and tables.',
    category: 'Enhancement',
    beforePreview: 'TITLE  .  .  98%',
    afterPreview: 'TITLE 99.4%',
  },
];

interface AIToolboxProps {
  selectedOptions: string[];
  onToggle: (id: string) => void;
}

export const AIToolbox: React.FC<AIToolboxProps> = ({
  selectedOptions,
  onToggle,
}) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full preserve-3d"
      style={{ perspective: '1100px' }}
    >
      {TOOLBOX_MODULES.map((module) => {
        const isSelected = selectedOptions.includes(module.id);

        return (
          <div
            key={module.id}
            role="checkbox"
            aria-checked={isSelected}
            tabIndex={0}
            onClick={() => onToggle(module.id)}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onToggle(module.id);
              }
            }}
            className={`p-6 rounded-3xl cursor-pointer select-none transition-all duration-300 relative flex flex-col justify-between border preserve-3d ${
              isSelected
                ? 'bg-[#FFF8ED] border-[#C65D45] shadow-[0_20px_45px_-10px_rgba(198,93,69,0.22),0_0_20px_rgba(60,141,135,0.15)] ring-2 ring-[#C65D45]/20'
                : 'bg-[#FFF8ED]/75 border-[#6B315E]/20 hover:border-[#C65D45] hover:bg-[#FFF8ED] shadow-xs'
            }`}
            style={{
              transform: isSelected
                ? 'translateZ(18px) translateY(-5px)'
                : 'translateZ(0px)',
            }}
          >
            {/* Top scanning accent line if selected */}
            {isSelected && (
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E98268] to-[#3C8D87] shadow-[0_0_10px_#E98268]" />
            )}

            <div>
              {/* Module Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-[10px] font-bold uppercase font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-[#EADCC8] text-[#6B315E]">
                  {module.category}
                </span>

                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-[#C65D45] bg-[#C65D45] text-[#FFF8ED] shadow-md'
                      : 'border-[#978D91]/50 bg-white'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-4 h-4 animate-in zoom-in-50" />}
                </div>
              </div>

              <h4 className="font-extrabold text-[#2C2830] text-base mb-1 tracking-tight font-heading">
                {module.title}
              </h4>
              <p className="text-xs text-[#6F6670] leading-relaxed mb-4">
                {module.description}
              </p>

              {/* ============================================================= */}
              {/* MINIATURE DOCUMENT VISUALIZATION WITH PHYSICAL TRANSFORMATION */}
              {/* ============================================================= */}
              <div
                className="w-full rounded-2xl bg-[#24162F] p-3.5 border border-[#6B315E]/40 text-[#FFF8ED] font-mono text-[11px] relative overflow-hidden preserve-3d transition-transform duration-300"
                style={{
                  transform: isSelected ? 'translateZ(10px) rotateX(4deg)' : 'none',
                }}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#6B315E]/40 text-[9px] text-[#978D91]">
                  <span className="flex items-center gap-1 text-[#3C8D87]">
                    <Cpu className="w-3 h-3" />
                    MICRO_VIEWPORT
                  </span>
                  <span className={isSelected ? 'text-[#A8D5C2] font-bold' : 'text-[#978D91]'}>
                    {isSelected ? 'ACTIVE // AFTER' : 'INACTIVE // BEFORE'}
                  </span>
                </div>

                <div className="min-h-[42px] flex items-center justify-center text-center">
                  <motion.div
                    key={isSelected ? 'after' : 'before'}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="w-full"
                  >
                    {isSelected ? (
                      <div className="text-[#A8D5C2] font-bold bg-[#3C8D87]/20 p-2 rounded border border-[#3C8D87]/40 shadow-xs whitespace-pre-line">
                        {module.afterPreview}
                      </div>
                    ) : (
                      <div className="text-[#D9A441] opacity-90 bg-[#D9A441]/15 p-2 rounded border border-[#D9A441]/30 whitespace-pre-line">
                        {module.beforePreview}
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Bottom Status Tag */}
            <div className="mt-4 pt-3 border-t border-[#EADCC8] flex items-center justify-between text-xs">
              <span className={`font-bold flex items-center gap-1.5 ${isSelected ? 'text-[#C65D45]' : 'text-[#978D91]'}`}>
                {isSelected ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3C8D87] animate-pulse" />
                    Engaged in Pipeline
                  </>
                ) : (
                  'Click module to engage'
                )}
              </span>

              {module.recommended && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#D9A441]/20 text-[#D9A441] border border-[#D9A441]/40">
                  Recommended
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
