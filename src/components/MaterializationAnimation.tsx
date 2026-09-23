import React from 'react';
import { motion } from 'motion/react';
import { DownloadFormat } from '../types';
import { FileText, FileCode, CheckCircle2, Sparkles } from 'lucide-react';

interface MaterializationAnimationProps {
  format: DownloadFormat;
  progress: number;
  stageName: string;
}

export const MaterializationAnimation: React.FC<MaterializationAnimationProps> = ({
  format,
  progress,
  stageName,
}) => {
  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-center p-8 preserve-3d select-none">
      {/* 1. CINEMATIC DATA TUNNEL STREAM */}
      <div className="relative w-64 h-64 flex items-center justify-center preserve-3d mb-6">
        {/* Concentric Tunnel Rings in 3D perspective */}
        {[0, 1, 2, 3].map((ringIdx) => (
          <motion.div
            key={ringIdx}
            animate={{
              rotateZ: ringIdx % 2 === 0 ? 360 : -360,
              scale: [0.8, 1.05, 0.8],
            }}
            transition={{
              duration: 8 + ringIdx * 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute rounded-full border pointer-events-none"
            style={{
              width: 140 + ringIdx * 35,
              height: 140 + ringIdx * 35,
              borderColor: ringIdx % 2 === 0 ? 'rgba(60, 141, 135, 0.35)' : 'rgba(107, 49, 94, 0.25)',
              borderDasharray: '4 4',
              transform: `translateZ(${-ringIdx * 30}px) rotateX(55deg)`,
            }}
          />
        ))}

        {/* Ambient Glow Chamber */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6B315E]/15 via-[#C65D45]/15 to-[#3C8D87]/20 blur-2xl animate-pulse" />

        {/* ========================================================================= */}
        {/* 2. THE COMPRESSED DIGITAL OBJECT ACCORDING TO FORMAT                      */}
        {/* ========================================================================= */}
        <motion.div
          animate={{
            y: progress < 90 ? [0, -12, 0] : 0,
            scale: progress < 70 ? 1 : progress < 95 ? 0.9 : 1.05,
            rotateX: progress < 70 ? 15 : 0,
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-20 w-32 h-40 rounded-2xl bg-[#FFF8ED] border border-[#EADCC8] shadow-[0_20px_45px_rgba(36,22,47,0.18),0_0_25px_rgba(60,141,135,0.2)] flex flex-col items-center justify-between p-4 preserve-3d"
        >
          {/* Top Format Badge */}
          <div className="w-full flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#24162F] to-[#6B315E] text-[#FFF8ED] flex items-center justify-center shadow-xs">
              {format === 'txt' ? <FileCode className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <span className="font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#EADCC8] text-[#6B315E] border border-[#6B315E]/20">
              .{format}
            </span>
          </div>

          {/* Center Format Morphic State */}
          <div className="flex flex-col items-center my-auto text-center">
            {format === 'pdf' && (
              <div className="space-y-1">
                <div className="w-20 h-1.5 bg-[#3C8D87]/40 rounded-full" />
                <div className="w-16 h-1.5 bg-[#6B315E]/40 rounded-full mx-auto" />
                <div className="w-18 h-1.5 bg-[#C65D45]/40 rounded-full mx-auto" />
                <span className="text-[8px] font-mono text-[#3C8D87] block mt-1">COMPRESSED VECTOR</span>
              </div>
            )}

            {format === 'docx' && (
              <div className="space-y-1.5">
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-8 h-3 bg-[#EADCC8] rounded" />
                  <div className="w-8 h-3 bg-[#A8D5C2]/40 rounded" />
                </div>
                <span className="text-[8px] font-mono text-[#6B315E] block">EDITABLE STYLES</span>
              </div>
            )}

            {format === 'txt' && (
              <div className="space-y-0.5 font-mono text-[7px] text-[#6F6670]">
                <div>01000100</div>
                <div>UTF-8_RAW</div>
                <span className="text-[8px] font-mono text-[#2C2830] font-bold block mt-1">PLAIN TEXT</span>
              </div>
            )}
          </div>

          {/* Bottom Verification Seal */}
          <div className="w-full flex items-center justify-center gap-1 text-[8px] font-mono font-bold text-[#3C8D87] border-t border-[#EADCC8] pt-2">
            <CheckCircle2 className="w-3 h-3 text-[#3C8D87]" />
            <span>ENCRYPTED READY</span>
          </div>
        </motion.div>

        {/* Downward Data Stream Tunnel Vectors */}
        <div className="absolute -bottom-8 w-1 h-14 bg-gradient-to-b from-[#3C8D87] via-[#A8D5C2] to-transparent shadow-[0_0_12px_#3C8D87] animate-bounce" />
      </div>

      {/* 3. STAGE NARRATIVE */}
      <h3 className="text-xl sm:text-2xl font-black text-[#2C2830] tracking-tight mb-1 text-center font-heading">
        Materializing .{format.toUpperCase()} Artifact
      </h3>
      <p className="text-xs sm:text-sm text-[#6F6670] mb-6 text-center max-w-sm">
        {stageName}
      </p>

      {/* 4. PROGRESS BAR */}
      <div className="w-full bg-[#EADCC8]/60 h-3 rounded-full overflow-hidden p-0.5 border border-[#EADCC8] mb-3 shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#24162F] via-[#6B315E] via-[#C65D45] to-[#3C8D87] transition-all duration-300 ease-out shadow-[0_0_14px_rgba(60,141,135,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between w-full font-mono text-xs text-[#6F6670]">
        <span className="font-bold text-[#6B315E] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#C65D45] animate-spin" />
          Packaging &amp; Transfer
        </span>
        <span className="font-bold text-[#2C2830]">{progress}%</span>
      </div>
    </div>
  );
};
