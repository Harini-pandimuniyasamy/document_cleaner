import React, { useEffect, useState } from 'react';

interface AIPulseProps {
  intervalMs?: number;
  active?: boolean;
}

export const AIPulse: React.FC<AIPulseProps> = ({
  intervalMs = 6000,
  active = true,
}) => {
  const [pulseStage, setPulseStage] = useState<number>(-1);

  useEffect(() => {
    if (!active) return;

    const runPulseSequence = () => {
      // 0: Far space
      setPulseStage(0);
      setTimeout(() => setPulseStage(1), 800); // 1: Document constellation
      setTimeout(() => setPulseStage(2), 1600); // 2: OCR structures
      setTimeout(() => setPulseStage(3), 2400); // 3: Mid space
      setTimeout(() => setPulseStage(4), 3200); // 4: Around application
      setTimeout(() => setPulseStage(-1), 4400); // Reset
    };

    runPulseSequence();
    const interval = setInterval(runPulseSequence, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, active]);

  if (pulseStage === -1) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Far Space Atmospheric Expansion (Warm Mulberry / Deep Plum) */}
      <div
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full transition-all duration-1000 ease-out pointer-events-none ${
          pulseStage === 0
            ? 'opacity-30 scale-100 bg-radial from-[#6B315E]/20 via-[#24162F]/5 to-transparent'
            : 'opacity-0 scale-125'
        }`}
      />

      {/* 2. Document Constellation Wave (Teal & Amber) */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[550px] rounded-full border border-[#3C8D87]/20 transition-all duration-1000 ease-out pointer-events-none ${
          pulseStage === 1
            ? 'opacity-40 scale-100 shadow-[0_0_50px_rgba(60,141,135,0.15)]'
            : pulseStage > 1
            ? 'opacity-0 scale-115'
            : 'opacity-0 scale-90'
        }`}
      />

      {/* 3. OCR Structures Scan Wave (Terracotta / Coral) */}
      <div
        className={`absolute inset-x-0 top-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#C65D45]/30 to-transparent transition-all duration-800 ease-in-out pointer-events-none ${
          pulseStage === 2
            ? 'opacity-60 translate-y-12'
            : 'opacity-0 -translate-y-4'
        }`}
      />

      {/* 4. Around Machine / Foreground Glow (Warm Ivory & Mint Halo) */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[650px] rounded-3xl border border-[#A8D5C2]/30 transition-all duration-1200 ease-out pointer-events-none ${
          pulseStage === 4
            ? 'opacity-50 scale-100 shadow-[0_0_40px_rgba(168,213,194,0.2)]'
            : 'opacity-0 scale-105'
        }`}
      />
    </div>
  );
};
