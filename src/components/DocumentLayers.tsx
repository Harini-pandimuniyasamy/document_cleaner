import React, { useState } from 'react';

interface DocumentLayersProps {
  children?: React.ReactNode;
  interactive?: boolean;
  className?: string;
  isHoveredOverride?: boolean;
}

export const DocumentLayers: React.FC<DocumentLayersProps> = ({
  children,
  interactive = true,
  className = '',
  isHoveredOverride,
}) => {
  const [internalHover, setInternalHover] = useState(false);
  const isSeparated = isHoveredOverride !== undefined ? isHoveredOverride : internalHover;

  return (
    <div
      className={`relative preserve-3d transition-transform duration-500 ${className}`}
      onMouseEnter={() => interactive && setInternalHover(true)}
      onMouseLeave={() => interactive && setInternalHover(false)}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Layer 0: Deep Shadow Grounding Layer */}
      <div
        className="absolute inset-0 rounded-2xl bg-indigo-950/10 blur-xl pointer-events-none transition-all duration-500"
        style={{
          transform: isSeparated
            ? 'translateZ(-40px) translateY(18px) scale(0.92)'
            : 'translateZ(-10px) translateY(8px) scale(0.96)',
        }}
      />

      {/* Layer 1: Base Document Layer (Raw Paper) */}
      <div
        className="absolute inset-0 rounded-2xl bg-white/60 backdrop-blur-md border border-indigo-100/70 shadow-sm pointer-events-none transition-all duration-500 ease-out"
        style={{
          transform: isSeparated
            ? 'translateZ(-24px) rotateX(4deg) rotateY(-4deg) scale(0.94)'
            : 'translateZ(-6px) scale(0.98)',
        }}
      >
        <div className="absolute top-3 left-4 text-[9px] font-mono font-bold text-indigo-300 opacity-60">
          RAW_BUFFER
        </div>
      </div>

      {/* Layer 2: OCR Extraction Layer */}
      <div
        className="absolute inset-0 rounded-2xl bg-indigo-50/50 backdrop-blur-md border border-indigo-200/60 shadow-sm pointer-events-none transition-all duration-500 ease-out"
        style={{
          transform: isSeparated
            ? 'translateZ(-12px) rotateX(2deg) rotateY(-2deg) scale(0.97)'
            : 'translateZ(-3px) scale(0.99)',
        }}
      >
        <div className="absolute top-3 right-4 text-[9px] font-mono font-bold text-cyan-600/70 opacity-70">
          OCR_MATRIX
        </div>
      </div>

      {/* Layer 3: Neural Cleaning Filter Layer */}
      <div
        className="absolute inset-0 rounded-2xl bg-violet-50/40 backdrop-blur-md border border-violet-200/60 shadow-sm pointer-events-none transition-all duration-500 ease-out"
        style={{
          transform: isSeparated
            ? 'translateZ(6px) rotateX(-1deg) rotateY(1deg) scale(1.005)'
            : 'translateZ(0px)',
        }}
      >
        {isSeparated && (
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-[#712ae2] shadow-[0_0_10px_#67e8f9] animate-scan-3d" />
        )}
      </div>

      {/* Layer 4: Top Pristine Document (Contains the Main UI / Content) */}
      <div
        className="relative z-10 rounded-2xl preserve-3d transition-all duration-500 ease-out"
        style={{
          transform: isSeparated
            ? 'translateZ(24px) rotateX(-2deg) rotateY(2deg) scale(1.02)'
            : 'translateZ(0px)',
        }}
      >
        {children}
      </div>
    </div>
  );
};
