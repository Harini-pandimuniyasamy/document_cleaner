import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface OCRScannerProps {
  isActive?: boolean;
  speed?: number; // duration in seconds
  onScanCycle?: (progress: number) => void;
}

export const OCRScanner: React.FC<OCRScannerProps> = ({
  isActive = true,
  speed = 3.2,
}) => {
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    let animId: number;
    const start = performance.now();
    const durationMs = speed * 1000;

    const tick = (now: number) => {
      const elapsed = (now - start) % durationMs;
      const progress = elapsed / durationMs; // 0 to 1
      setScanProgress(progress);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isActive, speed]);

  if (!isActive) return null;

  const topPercent = scanProgress * 100;

  return (
    <div className="absolute inset-x-[-15%] inset-y-0 pointer-events-none preserve-3d z-30 overflow-visible">
      {/* 3D Volumetric Scanning Slab / Laser Sheet */}
      <motion.div
        className="absolute left-0 right-0 h-10 -translate-y-1/2 preserve-3d"
        style={{
          top: `${topPercent}%`,
          transformStyle: 'preserve-3d',
          transform: 'translateZ(28px) rotateX(15deg)',
        }}
      >
        {/* Upper Volumetric Teal/Mint Light Curtain */}
        <div className="absolute -top-12 inset-x-0 h-12 bg-gradient-to-t from-[#3C8D87]/25 via-[#A8D5C2]/10 to-transparent pointer-events-none" />

        {/* Central Intense Optical Beam */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2.5px] bg-gradient-to-r from-transparent via-[#3C8D87] via-[#FFF8ED] to-transparent shadow-[0_0_18px_rgba(60,141,135,0.8),0_0_35px_rgba(168,213,194,0.5)]" />

        {/* Lower Volumetric Teal Dispersion */}
        <div className="absolute top-1/2 inset-x-0 h-14 bg-gradient-to-b from-[#3C8D87]/25 via-[#6B315E]/10 to-transparent pointer-events-none" />

        {/* Lateral Scanning Emitter Nodes on Left & Right */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#3C8D87] shadow-[0_0_12px_#3C8D87] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FFF8ED] animate-ping" />
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#3C8D87] shadow-[0_0_12px_#3C8D87] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FFF8ED] animate-ping" />
        </div>

        {/* Floating Realtime Scanner HUD Coordinate Readout */}
        <div className="absolute -top-5 right-6 px-2 py-0.5 rounded bg-slate-900/85 border border-cyan-400/60 text-[8px] font-mono text-cyan-300 shadow-md flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>SLICE: Z+28mm // Y: {Math.round(topPercent * 2.97)}mm</span>
        </div>
      </motion.div>
    </div>
  );
};
