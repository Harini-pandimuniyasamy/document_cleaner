import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Cpu, Sparkles, Layers } from 'lucide-react';

interface AIPipelineProps {
  selectedOptions: string[];
}

interface StepMeta {
  id: string;
  name: string;
  code: string;
  color: string;
}

const PIPELINE_STEPS: Record<string, StepMeta> = {
  'remove-spaces': { id: 'remove-spaces', name: 'Whitespace Collapse', code: 'W-01', color: '#3C8D87' },
  'remove-blank-lines': { id: 'remove-blank-lines', name: 'Line-Gap Normalizer', code: 'L-02', color: '#6B315E' },
  'fix-line-breaks': { id: 'fix-line-breaks', name: 'Wrap Synthesizer', code: 'S-03', color: '#C65D45' },
  'correct-ocr': { id: 'correct-ocr', name: 'OCR Glyphs Re-index', code: 'O-04', color: '#E98268' },
  'remove-noise': { id: 'remove-noise', name: 'Salt & Pepper Bleach', code: 'N-05', color: '#24162F' },
  'readability': { id: 'readability', name: 'Typography Grid Match', code: 'T-06', color: '#D9A441' },
};

export const AIPipeline: React.FC<AIPipelineProps> = ({ selectedOptions }) => {
  return (
    <div className="w-full rounded-2xl bg-[#FFF8ED]/90 backdrop-blur-xl border border-[#6B315E]/20 p-5 shadow-lg preserve-3d">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EADCC8] text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#24162F] to-[#6B315E] flex items-center justify-center text-[#FFF8ED]">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-extrabold text-[#2C2830] tracking-tight font-heading">Active AI Restoration Pipeline</h4>
            <span className="text-[10px] text-[#978D91] font-mono">
              DYNAMIC COMPILATION GRAPH • {selectedOptions.length} STAGES ACTIVE
            </span>
          </div>
        </div>

        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A8D5C2]/30 text-[#3C8D87] border border-[#3C8D87]/40">
          SERIAL GRAPH READY
        </span>
      </div>

      {selectedOptions.length === 0 ? (
        <div className="py-4 text-center text-xs font-mono text-[#978D91]">
          No pipeline stages selected. Choose modules from the AI Toolbox below.
        </div>
      ) : (
        <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
          <div className="flex-shrink-0 px-2.5 py-1.5 rounded-xl bg-[#EADCC8]/50 border border-[#EADCC8] font-mono text-[10px] font-bold text-[#6F6670] flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-[#6B315E]" />
            <span>RAW_SOURCE</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-[#978D91] flex-shrink-0" />

          <AnimatePresence>
            {selectedOptions.map((optId, idx) => {
              const meta = PIPELINE_STEPS[optId] || {
                id: optId,
                name: optId,
                code: `OP-${idx + 1}`,
                color: '#C65D45',
              };

              return (
                <React.Fragment key={optId}>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: -8 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 8 }}
                    className="flex-shrink-0 px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold text-[#2C2830] border shadow-xs flex items-center gap-2"
                    style={{
                      borderColor: `${meta.color}60`,
                      backgroundColor: `${meta.color}15`,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: meta.color }}
                    />
                    <span>{meta.name}</span>
                    <span className="text-[8px] opacity-70">[{meta.code}]</span>
                  </motion.div>

                  {idx < selectedOptions.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-[#6B315E]/40 flex-shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </AnimatePresence>

          <ArrowRight className="w-3.5 h-3.5 text-[#978D91] flex-shrink-0" />

          <div className="flex-shrink-0 px-2.5 py-1.5 rounded-xl bg-[#A8D5C2]/25 border border-[#3C8D87]/40 font-mono text-[10px] font-bold text-[#3C8D87] flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#3C8D87]" />
            <span>PRISTINE_DOC</span>
          </div>
        </div>
      )}
    </div>
  );
};
