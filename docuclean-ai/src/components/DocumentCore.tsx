import React from 'react';
import { useMouseParallax } from '../hooks/useMouseParallax';
import { useDocumentPhysics } from '../hooks/useDocumentPhysics';
import { FileText, CheckCircle2, ShieldCheck, Sparkles, Cpu } from 'lucide-react';

export interface DocumentCoreProps {
  title?: string;
  isCleaned?: boolean;
  separationFactor?: number; // 0 (flat single sheet) to 1 (exploded 3D inspection)
  showOCRBoxes?: boolean;
  showMetadataFragments?: boolean;
  customWidth?: string;
  customHeight?: string;
  interactiveMouse?: boolean;
  activeScanLinePercent?: number | null; // 0 to 100 or null
}

export const DocumentCore: React.FC<DocumentCoreProps> = ({
  title = 'LEGAL_AUDIT_EXECUTIVE_SUMMARY.PDF',
  isCleaned = false,
  separationFactor = 0,
  showOCRBoxes = true,
  showMetadataFragments = true,
  customWidth = 'w-[320px] sm:w-[370px]',
  customHeight = 'h-[440px] sm:h-[500px]',
  interactiveMouse = true,
  activeScanLinePercent = null,
}) => {
  const parallax = useMouseParallax(14, 0.08);
  const physics = useDocumentPhysics({
    separationFactor,
    floatingAmp: 6,
    breathingAmp: 3,
  });

  // Calculate composite rotation
  const rotX = interactiveMouse ? parallax.rotateX : 0;
  const rotY = interactiveMouse ? parallax.rotateY : 0;

  // Layer separation distance based on factor
  const layerZ = separationFactor * 32;

  return (
    <div
      className={`relative ${customWidth} ${customHeight} select-none preserve-3d transition-transform duration-300`}
      style={{
        perspective: '1200px',
        transform: `translate3d(0, ${physics.floatY}px, ${physics.floatZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
      }}
    >
      {/* Soft Ambient Depth Shadow Behind Document */}
      <div
        className="absolute inset-x-4 -bottom-8 h-12 bg-[#24162F]/12 rounded-full blur-2xl pointer-events-none transition-transform duration-500"
        style={{
          transform: `translateZ(-60px) scale(${1 - separationFactor * 0.15})`,
        }}
      />

      {/* ========================================================================= */}
      {/* LAYER 1: BASE CARRIER / UNDER BED (Z: -16px - layerZ)                     */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#EADCC8] to-[#FFF8ED] border border-[#6B315E]/20 shadow-sm pointer-events-none transition-transform duration-500 ease-out"
        style={{
          transform: `translateZ(${-16 - layerZ * 1.2}px)`,
        }}
      >
        <div className="absolute top-3 left-4 font-mono text-[9px] tracking-widest text-[#6B315E]/60">
          DOC_MATRIX // 0x4D_BASE_BED
        </div>
        <div className="absolute bottom-3 right-4 font-mono text-[9px] text-[#3C8D87]/70 font-bold">
          CHAMBER_SECURE
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 2: CLEANING DATA / SUBSTRATE THICKNESS (Z: -8px - layerZ * 0.7)     */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-1 rounded-2xl bg-[#FFF8ED]/80 backdrop-blur-md border border-[#EADCC8] pointer-events-none transition-transform duration-500 ease-out"
        style={{
          transform: `translateZ(${-8 - layerZ * 0.7}px)`,
        }}
      >
        {separationFactor > 0.2 && (
          <div className="absolute inset-4 border border-dashed border-[#3C8D87]/35 rounded-xl p-3 flex flex-col justify-between">
            <span className="font-mono text-[8px] text-[#3C8D87] font-bold">
              [SUBSTRATE: NORMALIZING VECTORS]
            </span>
            <div className="grid grid-cols-4 gap-2 opacity-60">
              <div className="h-1 bg-[#3C8D87]/50 rounded" />
              <div className="h-1 bg-[#6B315E]/50 rounded" />
              <div className="h-1 bg-[#C65D45]/50 rounded" />
              <div className="h-1 bg-[#D9A441]/50 rounded" />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* LAYER 3: REALISTIC WARM IVORY PAPER SURFACE (Z: 0px)                      */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 rounded-2xl bg-[#FFF8ED] backdrop-blur-xl border border-[#EADCC8] shadow-[0_20px_50px_-10px_rgba(36,22,47,0.14),0_0_20px_rgba(60,141,135,0.08)] p-6 sm:p-7 flex flex-col justify-between overflow-hidden preserve-3d transition-all duration-500"
        style={{
          transform: 'translateZ(0px)',
        }}
      >
        {/* Paper Top Header */}
        <div className="relative z-10 flex items-center justify-between pb-3.5 border-b border-[#EADCC8]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#24162F] to-[#6B315E] flex items-center justify-center text-[#FFF8ED] shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-extrabold text-[#2C2830] tracking-tight truncate max-w-[170px] sm:max-w-[210px]">
                {title}
              </h4>
              <span className="text-[10px] text-[#978D91] font-mono block">PAGE 01 / 03</span>
            </div>
          </div>

          <span
            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
              isCleaned
                ? 'bg-[#A8D5C2]/25 text-[#3C8D87] border-[#3C8D87]/40'
                : 'bg-[#C65D45]/15 text-[#C65D45] border-[#C65D45]/30'
            }`}
          >
            {isCleaned ? 'PRISTINE 99.4%' : 'SOURCE SCAN'}
          </span>
        </div>

        {/* Text-Line Geometry Body Content */}
        <div className="relative z-10 my-auto py-2 space-y-3 font-mono text-[11px] leading-relaxed">
          {/* Section 1: Title */}
          <div>
            {isCleaned ? (
              <div className="font-bold text-[#2C2830] bg-[#A8D5C2]/20 p-1.5 rounded border border-[#A8D5C2]/40 flex items-center justify-between">
                <span>1. EXECUTIVE SUMMARY & AUDIT FINDINGS</span>
                <span className="text-[#3C8D87] font-bold text-[9px]">PASSED</span>
              </div>
            ) : (
              <div className="text-[#C65D45] bg-[#C65D45]/10 p-1.5 rounded border border-[#C65D45]/25">
                1.  EXECUT1VE   SUMM4RY  &  AUD1T  F1NDINGS
              </div>
            )}
          </div>

          {/* Section 2: Paragraph text line geometry */}
          <div className="space-y-1.5 text-[10.5px]">
            {isCleaned ? (
              <>
                <p className="text-[#2C2830]">
                  During our operational review, all 12,480 digitized pages were checked.
                </p>
                <p className="text-[#2C2830]">
                  Typography baselines and optical text structures remain validated.
                </p>
              </>
            ) : (
              <>
                <p className="text-[#6F6670] line-through decoration-[#C65D45]">
                  Dur1ng   our   operat1onal   rev1ew ,  all   12,480  d1g1tized...
                </p>
                <p className="text-[#6F6670]">
                  Typ0graphy   basel1nes   and  opt1cal  text   struc- \ntures...
                </p>
              </>
            )}
          </div>

          {/* Section 3: Data Table Mini-Matrix */}
          <div className="p-2.5 rounded-xl bg-[#EADCC8]/30 border border-[#EADCC8] text-[10px]">
            <div className="flex justify-between font-bold text-[#2C2830] pb-1 border-b border-[#EADCC8]">
              <span>PARAMETER</span>
              <span>MEASUREMENT</span>
            </div>
            <div className="flex justify-between text-[#6F6670] pt-1">
              <span>Character Noise:</span>
              <span className={isCleaned ? 'text-[#3C8D87] font-bold' : 'text-[#C65D45]'}>
                {isCleaned ? '0.00% (Clean)' : '38.6% (Detected)'}
              </span>
            </div>
            <div className="flex justify-between text-[#6F6670]">
              <span>Alignment Skew:</span>
              <span className={isCleaned ? 'text-[#3C8D87] font-bold' : 'text-[#D9A441]'}>
                {isCleaned ? '0.00° (Level)' : '+3.42° (Rotated)'}
              </span>
            </div>
          </div>
        </div>

        {/* Paper Footer */}
        <div className="relative z-10 flex items-center justify-between pt-3 border-t border-[#EADCC8] text-[10px] text-[#978D91] font-mono">
          <span>DocuClean Optical Engine</span>
          <span className="text-[#3C8D87] font-bold">CHECKSUM: 0xA49F</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 4: OCR STRUCTURE & BOUNDING BOXES (Z: +18px + layerZ * 0.8)         */}
      {/* ========================================================================= */}
      {showOCRBoxes && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none p-6 sm:p-7 flex flex-col justify-between preserve-3d transition-transform duration-500 ease-out"
          style={{
            transform: `translateZ(${18 + layerZ * 0.8}px)`,
          }}
        >
          {/* Header Bounding Box */}
          <div className="h-9 rounded-lg border border-dashed border-[#3C8D87]/60 bg-[#3C8D87]/5 flex items-center justify-between px-2">
            <span className="font-mono text-[8px] text-[#3C8D87] font-bold">
              OCR_BLOCK_01 [H1]
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#A8D5C2] animate-ping" />
          </div>

          {/* Body Bounding Boxes */}
          <div className="space-y-3 my-auto py-2">
            <div className="h-6 rounded border border-dashed border-[#6B315E]/50 bg-[#6B315E]/5 flex items-center px-2">
              <span className="font-mono text-[7px] text-[#6B315E]">TOKEN_SPAN: &quot;EXECUTIVE SUMMARY&quot;</span>
            </div>
            <div className="h-10 rounded border border-dashed border-[#C65D45]/50 bg-[#C65D45]/5 flex items-center px-2">
              <span className="font-mono text-[7px] text-[#C65D45]">PARAGRAPH_BOX: CONFIDENCE 99.8%</span>
            </div>
            <div className="h-14 rounded border border-dashed border-[#3C8D87]/60 bg-[#3C8D87]/5 flex items-center px-2">
              <span className="font-mono text-[7px] text-cyan-800">MATRIX_GRID: 2x2 TABULAR REGION</span>
            </div>
          </div>

          <div className="h-5 rounded border border-dashed border-indigo-400/40" />
        </div>
      )}

      {/* ========================================================================= */}
      {/* LAYER 5: TEXT LAYER & GLYPH TOKENS (Z: +34px + layerZ * 1.5)              */}
      {/* ========================================================================= */}
      {separationFactor > 0.2 && (
        <div
          className="absolute inset-2 rounded-2xl pointer-events-none p-5 flex flex-col justify-center items-center preserve-3d transition-transform duration-500"
          style={{
            transform: `translateZ(${34 + layerZ * 1.5}px)`,
          }}
        >
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-400 text-[#1f108e] text-[10px] font-mono font-bold shadow-lg flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-spin" />
            <span>EXTRACTED GLYPH LAYER (Z +{Math.round(34 + layerZ * 1.5)}px)</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ACTIVE SCANNING BEAM ON TOP OF DOCUMENT                                    */}
      {/* ========================================================================= */}
      {activeScanLinePercent !== null && (
        <div
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#67E8F9] to-[#2563EB] shadow-[0_0_16px_#67E8F9,0_0_24px_#2563EB] z-40 pointer-events-none transition-all duration-150"
          style={{
            top: `${activeScanLinePercent}%`,
            transform: `translateZ(${25 + layerZ}px)`,
          }}
        >
          <div className="absolute -top-10 left-0 right-0 h-10 bg-gradient-to-t from-[#67E8F9]/20 via-[#4F46E5]/10 to-transparent pointer-events-none" />
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING METADATA SATELLITE FRAGMENTS                                    */}
      {/* ========================================================================= */}
      {showMetadataFragments && (
        <>
          {/* Top-Right Fragment */}
          <div
            className="absolute -top-4 -right-4 sm:-right-8 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-indigo-200 text-[10px] font-mono font-bold text-[#1f108e] shadow-md pointer-events-none transition-transform duration-500"
            style={{
              transform: `translateZ(${40 + layerZ}px) rotateZ(3deg)`,
            }}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping mr-1" />
            300 DPI // 24-BIT
          </div>

          {/* Bottom-Left Fragment */}
          <div
            className="absolute -bottom-4 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-indigo-200 text-[10px] font-mono font-bold text-slate-700 shadow-md pointer-events-none transition-transform duration-500"
            style={{
              transform: `translateZ(${35 + layerZ}px) rotateZ(-3deg)`,
            }}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-600 inline mr-1" />
            SHA-256 PASS
          </div>
        </>
      )}
    </div>
  );
};
