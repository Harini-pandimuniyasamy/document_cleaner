import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useMouseParallax } from '../hooks/useMouseParallax';
import { Sparkles, FileText, MoveHorizontal, Check } from 'lucide-react';

interface TimeSplitPreviewProps {
  originalText?: string;
  cleanedText?: string;
  fileName?: string;
  artifactsCount?: number;
  qualityBefore?: number;
  qualityAfter?: number;
}

export const TimeSplitPreview: React.FC<TimeSplitPreviewProps> = ({
  originalText,
  cleanedText,
  fileName = 'Document',
  artifactsCount,
  qualityBefore = 61,
  qualityAfter = 99,
}) => {
  const [splitPercent, setSplitPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const parallax = useMouseParallax(10, 0.08);

  // Position calculation across width of preview
  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const x = clientX - rect.left;
    const clamped = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setSplitPercent(clamped);
  }, []);

  // Initiates drag on mouse down or touch
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  // Global listeners allow continuous, smooth drag across the entire viewport for as long as desired
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      updatePosition(e.clientX);
    };

    const handleGlobalPointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
      }
    };

    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true });
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [updatePosition]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-3xl mx-auto select-none preserve-3d my-6 touch-none"
      style={{ perspective: '1200px' }}
    >
      {/* 3D FLOATING ENCLOSURE */}
      <div
        className="relative w-full h-[540px] sm:h-[600px] rounded-3xl bg-[#FFF8ED] border border-[#6B315E]/20 shadow-[0_30px_70px_-15px_rgba(36,22,47,0.18),0_0_30px_rgba(60,141,135,0.12)] overflow-hidden preserve-3d"
        style={{
          transform: isDragging
            ? 'none'
            : `rotateX(${parallax.rotateX * 0.6}deg) rotateY(${parallax.rotateY * 0.6}deg)`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {/* ========================================================================= */}
        {/* 1. LAYER UNDERNEATH: CLEANED PRISTINE DOCUMENT (RIGHT SIDE / FULL UNDER)  */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-between font-mono bg-[#FFF8ED]">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#EADCC8]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3C8D87] to-[#A8D5C2] text-[#FFF8ED] flex items-center justify-center shadow-xs">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#2C2830] font-heading truncate max-w-[260px] sm:max-w-md">{fileName}</h4>
                <span className="text-[10px] text-[#3C8D87] font-bold uppercase tracking-wider">
                  AI CLEANED &amp; RESTORED ({qualityAfter}% QUALITY)
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#A8D5C2]/25 text-[#3C8D87] border border-[#3C8D87]/40">
              PRISTINE
            </span>
          </div>

          {/* Cleaned Content */}
          <div className="my-auto py-2 overflow-y-auto max-h-[380px] sm:max-h-[410px] pr-2 space-y-3 text-xs leading-relaxed text-[#2C2830]">
            {cleanedText ? (
              <div className="whitespace-pre-wrap break-words font-mono">
                {cleanedText}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#A8D5C2]/15 border border-[#3C8D87]/30 text-[#6F6670] text-center italic">
                Cleaned document content will appear here.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#EADCC8] text-[10px] text-[#978D91]">
            <span>DocuClean Optical Engine // Finalized</span>
            <span className="text-[#3C8D87] font-bold">ZERO DEFECTS</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. LAYER ON TOP: ORIGINAL RAW SCAN (CLIPPED TO LEFT OF SPLITPERCENT)       */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-between font-mono bg-gradient-to-br from-[#EADCC8]/60 via-[#FFF8ED] to-[#EADCC8]/40 pointer-events-none"
          style={{
            clipPath: `polygon(0 0, ${splitPercent}% 0, ${splitPercent}% 100%, 0 100%)`,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#C65D45]/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#C65D45] text-white flex items-center justify-center shadow-xs">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#C65D45] font-heading truncate max-w-[260px] sm:max-w-md">{fileName}</h4>
                <span className="text-[10px] text-[#C65D45] font-bold uppercase tracking-wider">
                  ORIGINAL UNTOUCHED SOURCE ({qualityBefore}% QUALITY)
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#C65D45]/15 text-[#C65D45] border border-[#C65D45]/30">
              UNPROCESSED
            </span>
          </div>

          {/* Raw Original Content */}
          <div className="my-auto py-2 overflow-y-auto max-h-[380px] sm:max-h-[410px] pr-2 space-y-3 text-xs leading-relaxed text-[#6F6670]">
            {originalText ? (
              <div className="whitespace-pre-wrap break-words font-mono opacity-90">
                {originalText}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#C65D45]/10 border border-[#C65D45]/25 text-[#6F6670] text-center italic">
                Original document content will appear here.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#EADCC8] text-[10px] text-[#C65D45]">
            <span>Raw Document Source</span>
            <span className="text-[#C65D45] font-bold">
              {artifactsCount !== undefined ? `${artifactsCount} ARTIFACTS RESOLVED` : 'ARTIFACTS RESOLVED'}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. DRAGGABLE VERTICAL TRANSFORMATION BOUNDARY (DIVIDER)                   */}
        {/* ========================================================================= */}
        <div
          onPointerDown={handlePointerDown}
          className="absolute top-0 bottom-0 w-8 z-40 flex items-center justify-center -translate-x-1/2 cursor-ew-resize select-none touch-none group"
          style={{ left: `${splitPercent}%` }}
        >
          {/* Vertical Laser Center Line */}
          <div className="w-1 h-full bg-[#3C8D87] shadow-[0_0_15px_#3C8D87,0_0_30px_#A8D5C2]" />

          {/* Vertical Laser Aura */}
          <div className="absolute inset-y-0 -left-6 -right-6 bg-gradient-to-r from-transparent via-[#3C8D87]/25 to-transparent pointer-events-none group-hover:via-[#3C8D87]/40 transition-colors" />

          {/* Center Circular Grab Handle */}
          <div className={`absolute w-11 h-11 rounded-full bg-[#FFF8ED] border-2 border-[#3C8D87] shadow-[0_0_20px_rgba(60,141,135,0.7),0_10px_20px_rgba(0,0,0,0.15)] flex items-center justify-center text-[#3C8D87] transition-all cursor-ew-resize select-none touch-none ${isDragging ? 'scale-120 ring-4 ring-[#3C8D87]/30' : 'group-hover:scale-110'}`}>
            <MoveHorizontal className="w-5 h-5 text-[#3C8D87]" />
          </div>

          {/* Top Tag Indicator */}
          <div className="absolute top-3 px-2 py-0.5 rounded-full bg-[#24162F] border border-[#3C8D87] text-[8px] font-mono font-bold text-[#A8D5C2] shadow-md whitespace-nowrap pointer-events-none">
            TIME SPLIT // {Math.round(splitPercent)}%
          </div>
        </div>
      </div>

      {/* Helper Legend Underneath */}
      <div className="flex items-center justify-between mt-4 px-3 text-xs font-mono text-[#6F6670]">
        <span className="flex items-center gap-1.5 text-[#C65D45] font-bold">
          ← Drag to reveal RAW SOURCE
        </span>
        <span className="text-[#978D91]">Interactive Volumetric Split Boundary</span>
        <span className="flex items-center gap-1.5 text-[#3C8D87] font-bold">
          Drag to reveal AI PRISTINE →
        </span>
      </div>
    </div>
  );
};
