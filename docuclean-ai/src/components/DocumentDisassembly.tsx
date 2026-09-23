import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check, Layers, Binary, ShieldAlert } from 'lucide-react';

interface DocumentDisassemblyProps {
  phase: 'READING' | 'ANALYZING' | 'CLEANING' | 'NORMALIZING' | 'RECONSTRUCTING' | 'COMPLETE';
  separationFactor?: number;
}

export const DocumentDisassembly: React.FC<DocumentDisassemblyProps> = ({
  phase,
  separationFactor = 0.5,
}) => {
  // Disassembly items
  const isDisassembled = phase === 'ANALYZING' || phase === 'CLEANING' || phase === 'NORMALIZING';
  const isReconstructing = phase === 'RECONSTRUCTING';

  return (
    <div className="absolute inset-0 pointer-events-none preserve-3d flex items-center justify-center overflow-visible z-20">
      {/* 1. DETACHED TEXT FRAGMENTS LAYER */}
      <motion.div
        animate={{
          z: isDisassembled ? 65 : isReconstructing ? 15 : 0,
          y: isDisassembled ? -25 : 0,
          rotateX: isDisassembled ? -8 : 0,
          opacity: phase === 'COMPLETE' ? 0 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 60 }}
        className="absolute w-64 p-3 rounded-xl bg-white/85 backdrop-blur-md border border-[#4f46e5]/40 shadow-xl preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="flex items-center justify-between pb-1.5 border-b border-indigo-100 text-[9px] font-mono font-bold text-[#1f108e]">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#2563eb]" />
            DISASSEMBLED TEXT MATRIX
          </span>
          <span className="text-cyan-700">Z +65px</span>
        </div>
        <div className="pt-2 space-y-1 text-[8px] font-mono text-slate-700">
          <div className="flex justify-between items-center bg-indigo-50/60 px-1.5 py-0.5 rounded">
            <span>&quot;EXECUTIVE SUMMARY&quot;</span>
            <span className="text-[#2563eb] font-bold">RE-INDEXED</span>
          </div>
          <div className="flex justify-between items-center bg-violet-50/60 px-1.5 py-0.5 rounded">
            <span>PARAGRAPH_TOKENS [142]</span>
            <span className="text-[#6d28d9] font-bold">RE-ALIGNED</span>
          </div>
        </div>
      </motion.div>

      {/* 2. DETACHED OCR BOUNDING STRUCTURE LAYER */}
      <motion.div
        animate={{
          z: isDisassembled ? 100 : isReconstructing ? 25 : 0,
          y: isDisassembled ? 40 : 0,
          rotateY: isDisassembled ? 12 : 0,
          opacity: phase === 'COMPLETE' ? 0 : 0.9,
        }}
        transition={{ type: 'spring', damping: 18, stiffness: 55 }}
        className="absolute w-56 p-3 rounded-xl bg-[#67e8f9]/10 backdrop-blur-md border border-cyan-400/80 shadow-2xl preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="flex items-center justify-between text-[9px] font-mono font-bold text-cyan-900 pb-1 border-b border-cyan-200">
          <span className="flex items-center gap-1">
            <Binary className="w-3 h-3 text-cyan-700" />
            GEOMETRIC BOUNDS
          </span>
          <span className="text-cyan-800">Z +100px</span>
        </div>
        <div className="pt-1.5 grid grid-cols-2 gap-1 text-[8px] font-mono">
          <div className="border border-dashed border-cyan-400 p-1 rounded bg-white/60">
            <span>BBOX [0, 0, 320, 48]</span>
          </div>
          <div className="border border-dashed border-indigo-400 p-1 rounded bg-white/60">
            <span>MARGINS 1.25 IN</span>
          </div>
        </div>
      </motion.div>

      {/* 3. EXPELLED NOISE & WHITESPACE ARTIFACTS (Fly outward and vanish during CLEANING) */}
      {isDisassembled && (
        <>
          <motion.div
            initial={{ x: 0, y: 0, z: 0, opacity: 0.9 }}
            animate={{
              x: phase === 'CLEANING' || phase === 'NORMALIZING' ? 160 : 60,
              y: phase === 'CLEANING' || phase === 'NORMALIZING' ? -110 : -40,
              z: 80,
              opacity: phase === 'NORMALIZING' ? 0 : 0.85,
              scale: phase === 'NORMALIZING' ? 0.3 : 1,
            }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute px-2.5 py-1 rounded-lg bg-red-50/90 border border-red-300 text-red-700 text-[8px] font-mono font-bold shadow-lg flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3 h-3 text-red-500" />
            <span>EXPELLED NOISE: 58 ARTIFACTS</span>
          </motion.div>

          <motion.div
            initial={{ x: 0, y: 0, z: 0, opacity: 0.9 }}
            animate={{
              x: phase === 'CLEANING' || phase === 'NORMALIZING' ? -170 : -70,
              y: phase === 'CLEANING' || phase === 'NORMALIZING' ? 100 : 30,
              z: 75,
              opacity: phase === 'NORMALIZING' ? 0 : 0.85,
              scale: phase === 'NORMALIZING' ? 0.3 : 1,
            }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute px-2.5 py-1 rounded-lg bg-amber-50/90 border border-amber-300 text-amber-800 text-[8px] font-mono font-bold shadow-lg flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>COLLAPSED: 86 EXTRA SPACES</span>
          </motion.div>
        </>
      )}
    </div>
  );
};
