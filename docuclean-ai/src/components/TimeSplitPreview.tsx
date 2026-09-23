import React, { useState, useRef } from 'react';
import { useMouseParallax } from '../hooks/useMouseParallax';
import { Sparkles, FileText, MoveHorizontal, Check } from 'lucide-react';

interface TimeSplitPreviewProps {
  originalText?: string;
  cleanedText?: string;
  fileName?: string;
}

export const TimeSplitPreview: React.FC<TimeSplitPreviewProps> = ({
  originalText,
  cleanedText,
  fileName = 'Quarterly_Audit_Report_2024.pdf',
}) => {
  const [splitPercent, setSplitPercent] = useState(50);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const parallax = useMouseParallax(10, 0.08);

  const handlePointerDown = () => {
    isDraggingRef.current = true;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clamped = Math.max(10, Math.min(90, (x / rect.width) * 100));
    setSplitPercent(clamped);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="relative w-full max-w-3xl mx-auto select-none preserve-3d my-6"
      style={{ perspective: '1200px' }}
    >
      {/* 3D FLOATING ENCLOSURE */}
      <div
        className="relative w-full h-[540px] sm:h-[600px] rounded-3xl bg-[#FFF8ED] border border-[#6B315E]/20 shadow-[0_30px_70px_-15px_rgba(36,22,47,0.18),0_0_30px_rgba(60,141,135,0.12)] overflow-hidden preserve-3d"
        style={{
          transform: `rotateX(${parallax.rotateX * 0.6}deg) rotateY(${parallax.rotateY * 0.6}deg)`,
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
                <h4 className="text-sm font-bold text-[#2C2830] font-heading">{fileName}</h4>
                <span className="text-[10px] text-[#3C8D87] font-bold uppercase tracking-wider">
                  AI CLEANED &amp; RESTORED (99.4% QUALITY)
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#A8D5C2]/25 text-[#3C8D87] border border-[#3C8D87]/40">
              PRISTINE
            </span>
          </div>

          {/* Cleaned Content */}
          <div className="space-y-4 my-auto text-xs leading-relaxed text-[#2C2830]">
            <div className="p-3 rounded-xl bg-[#A8D5C2]/20 border border-[#3C8D87]/30 font-bold text-[#2C2830]">
              SECTION 1. FINANCIAL AUDIT &amp; REVENUE RECONCILIATION
            </div>
            <p className="text-[#2C2830]">
              During the fourth fiscal quarter of 2024, our independent auditing team conducted an exhaustive forensic analysis of the consolidated balance sheet. All line items have been validated against primary bank ledgers without discrepancies.
            </p>
            <p className="text-[#2C2830]">
              Capital expenditure disbursements totaled $4,285,120, demonstrating an operational variance of less than 0.04% across all departments. All statutory tax filings have been submitted and confirmed by revenue commissioners.
            </p>
            <div className="p-3 rounded-xl bg-[#FFF8ED] border border-[#EADCC8] text-[11px] grid grid-cols-3 gap-2 shadow-xs">
              <div>
                <span className="text-[9px] text-[#978D91] block">TOTAL REVENUE</span>
                <span className="font-bold text-[#2C2830]">$18,420,950</span>
              </div>
              <div>
                <span className="text-[9px] text-[#978D91] block">NET EBITDA</span>
                <span className="font-bold text-[#3C8D87]">$5,820,100</span>
              </div>
              <div>
                <span className="text-[9px] text-[#978D91] block">AUDIT RATING</span>
                <span className="font-bold text-[#6B315E]">AAA COMPLIANT</span>
              </div>
            </div>
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
                <h4 className="text-sm font-bold text-[#C65D45] font-heading">{fileName}</h4>
                <span className="text-[10px] text-[#C65D45] font-bold uppercase tracking-wider">
                  ORIGINAL UNTOUCHED SCAN (61% QUALITY)
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#C65D45]/15 text-[#C65D45] border border-[#C65D45]/30">
              UNPROCESSED
            </span>
          </div>

          {/* Raw Noisy Content */}
          <div className="space-y-4 my-auto text-xs leading-relaxed text-[#6F6670] opacity-90">
            <div className="p-3 rounded-xl bg-[#C65D45]/10 border border-[#C65D45]/25 font-bold text-[#C65D45]">
              SECT1ON   1 .   F1NANCIAL   AUD1T   &amp;   REVENU3   REC0NC1L1AT1ON
            </div>
            <p className="text-[#6F6670] line-through decoration-[#C65D45]">
              Dur1ng   the   f0urth   f1scal   qu4rter   of   2024 ,   our   1ndependent   aud1t1ng   team   conducted   an   exhaust- \nive   forens1c   analys1s...
            </p>
            <p className="text-[#6F6670]">
              Cap1tal   expend1ture   d1sbursements   t0taled   $ 4 , 285 , 120 ,   demonstrat1ng   an   operat1onal   var1ance...
            </p>
            <div className="p-3 rounded-xl bg-[#EADCC8]/40 border border-[#EADCC8] text-[11px] grid grid-cols-3 gap-2">
              <div>
                <span className="text-[9px] text-[#978D91] block">T0TAL REVENU3</span>
                <span className="font-bold text-[#C65D45]">$ 18 , 420 , 950</span>
              </div>
              <div>
                <span className="text-[9px] text-[#978D91] block">N3T EB1TDA</span>
                <span className="font-bold text-[#D9A441]">$ 5 , 820 , 100</span>
              </div>
              <div>
                <span className="text-[9px] text-[#978D91] block">AUD1T RAT1NG</span>
                <span className="font-bold text-[#C65D45]">UNVER1F1ED</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#EADCC8] text-[10px] text-[#C65D45]">
            <span>Raw Analog Scan Document</span>
            <span className="text-[#C65D45] font-bold">58 ARTIFACTS DETECTED</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. DRAGGABLE VERTICAL TRANSFORMATION BOUNDARY (DIVIDER)                   */}
        {/* ========================================================================= */}
        <div
          onPointerDown={handlePointerDown}
          className="absolute top-0 bottom-0 w-1 bg-[#3C8D87] shadow-[0_0_15px_#3C8D87,0_0_30px_#A8D5C2] cursor-ew-resize z-40 flex items-center justify-center -translate-x-1/2 group"
          style={{ left: `${splitPercent}%` }}
        >
          {/* Vertical Laser Aura */}
          <div className="absolute inset-y-0 -left-6 -right-6 bg-gradient-to-r from-transparent via-[#3C8D87]/25 to-transparent pointer-events-none group-hover:via-[#3C8D87]/40 transition-colors" />

          {/* Center Circular Grab Handle */}
          <div className="w-10 h-10 rounded-full bg-[#FFF8ED] border-2 border-[#3C8D87] shadow-[0_0_20px_rgba(60,141,135,0.7),0_10px_20px_rgba(0,0,0,0.15)] flex items-center justify-center text-[#3C8D87] group-hover:scale-110 transition-transform cursor-pointer">
            <MoveHorizontal className="w-5 h-5 text-[#3C8D87]" />
          </div>

          {/* Top Tag Indicator */}
          <div className="absolute top-3 px-2 py-0.5 rounded-full bg-[#24162F] border border-[#3C8D87] text-[8px] font-mono font-bold text-[#A8D5C2] shadow-md whitespace-nowrap">
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
