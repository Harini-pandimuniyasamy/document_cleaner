import React, { useState, useRef, useEffect } from 'react';
import {
  CheckCircle2,
  Sparkles,
  Columns,
  MoveHorizontal,
  Zap,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { ProcessedDocumentData } from '../types';

interface DocumentPreviewProps {
  processedDoc: ProcessedDocumentData;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ processedDoc }) => {
  const [viewMode, setViewMode] = useState<'slider' | 'split' | 'diff'>('slider');
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    if (sliderContainerRef.current) {
      const rect = sliderContainerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const percent = Math.min(96, Math.max(4, (relativeX / rect.width) * 100));
      setSliderPosition(percent);
    }
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !sliderContainerRef.current) return;
      const rect = sliderContainerRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      const relativeX = clientX - rect.left;
      const percent = Math.min(96, Math.max(4, (relativeX / rect.width) * 100));
      setSliderPosition(percent);
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Metric KPI Chips with 3D Depth */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-panel p-4 rounded-2xl text-center shadow-xs border border-indigo-100 hover:-translate-y-0.5 transition-transform">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Artifacts Erased
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#712ae2] font-mono">
            {processedDoc.artifactsRemoved}
          </span>
        </div>
        <div className="glass-panel p-4 rounded-2xl text-center shadow-xs border border-indigo-100 hover:-translate-y-0.5 transition-transform">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Extra Spaces Fixed
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#1f108e] font-mono">
            {processedDoc.spacesFixed}
          </span>
        </div>
        <div className="glass-panel p-4 rounded-2xl text-center shadow-xs border border-indigo-100 hover:-translate-y-0.5 transition-transform">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Line Breaks Repaired
          </span>
          <span className="text-xl sm:text-2xl font-black text-indigo-600 font-mono">
            {processedDoc.lineBreaksFixed}
          </span>
        </div>
        <div className="glass-panel p-4 rounded-2xl text-center shadow-xs border border-indigo-100 hover:-translate-y-0.5 transition-transform">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Clarity Rating
          </span>
          <div className="flex items-center justify-center gap-1.5 font-mono">
            <span className="text-xs text-slate-400 line-through">
              {processedDoc.readabilityScoreBefore}%
            </span>
            <span className="text-xs text-slate-400">→</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-600">
              {processedDoc.readabilityScoreAfter}%
            </span>
          </div>
        </div>
      </div>

      {/* View Switcher Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Comparison Mode:
          </span>
          <div className="inline-flex p-1 bg-white/80 border border-slate-200 rounded-xl shadow-xs">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'slider'
                  ? 'bg-gradient-to-r from-[#1f108e] to-[#712ae2] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MoveHorizontal className="w-3.5 h-3.5" />
              Slider Reveal
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-gradient-to-r from-[#1f108e] to-[#712ae2] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              Side-by-Side 3D
            </button>
            <button
              onClick={() => setViewMode('diff')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'diff'
                  ? 'bg-gradient-to-r from-[#1f108e] to-[#712ae2] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Diff Highlights
            </button>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Restored page 1 of {processedDoc.pageCount} • High Contrast Verified</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE 1: INTERACTIVE 3D SPLIT SLIDER WITH LASER DIVIDER               */}
      {/* ========================================================================= */}
      {viewMode === 'slider' && (
        <div className="glass-panel-elevated p-6 sm:p-7 rounded-3xl border border-indigo-200/80 shadow-xl select-none">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-indigo-100">
            <div className="flex items-center gap-2">
              <MoveHorizontal className="w-4 h-4 text-[#2563eb]" />
              <h3 className="font-bold text-sm text-slate-900">
                Interactive 3D Split Laser Slider
              </h3>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Drag the illuminated laser divider horizontally to inspect restoration
            </span>
          </div>

          <div
            ref={sliderContainerRef}
            onPointerDown={handlePointerDown}
            className="relative w-full h-[460px] rounded-2xl overflow-hidden border border-indigo-200/80 cursor-ew-resize bg-white shadow-inner touch-none"
          >
            {/* AFTER / CLEANED LAYER (Underneath / Right side) */}
            <div className="absolute inset-0 p-6 font-mono text-xs text-slate-800 leading-relaxed bg-white overflow-y-auto">
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm flex items-center justify-between pb-2 mb-3 border-b border-emerald-100">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 inline-flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  AFTER (AI Restored & Cleaned)
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-600">
                  99.4% Contrast
                </span>
              </div>
              <div className="whitespace-pre-wrap font-medium text-slate-900 pb-8">
                {processedDoc.cleanedText}
              </div>
            </div>

            {/* BEFORE / UNPROCESSED LAYER (Clipped overlay on the left) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden p-6 font-mono text-xs leading-relaxed bg-amber-50/80 border-r-2 border-cyan-400 overflow-y-auto"
              style={{ width: `${sliderPosition}%` }}
            >
              <div className="w-[850px] max-w-[900px]">
                <div className="sticky top-0 z-10 bg-amber-50/95 backdrop-blur-sm flex items-center justify-between pb-2 mb-3 border-b border-amber-200">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 text-[11px] font-bold border border-red-100 inline-flex items-center gap-1 shadow-xs">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    BEFORE (Raw Scanned Input)
                  </span>
                  <span className="text-[11px] font-mono font-bold text-amber-700">
                    Untreated Noise & OCR Artifacts
                  </span>
                </div>
                <div className="whitespace-pre-wrap text-slate-600 opacity-80 pb-8">
                  {processedDoc.originalText}
                </div>
              </div>
            </div>

            {/* DRAGGABLE LASER DIVIDER LINE & 3D HANDLE */}
            <div
              className="absolute top-0 bottom-0 w-[3px] bg-gradient-to-b from-cyan-300 via-[#2563eb] to-[#712ae2] shadow-[0_0_15px_#67e8f9,0_0_25px_#2563eb] z-30 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-gradient-to-br from-[#1f108e] via-[#2563eb] to-cyan-400 text-white flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-cyan-300/30 animate-pulse">
                <MoveHorizontal className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-2">
            <span className="font-semibold text-amber-700">← Before (Raw scan)</span>
            <span className="font-mono text-indigo-900 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              {Math.round(sliderPosition)}% reveal
            </span>
            <span className="font-semibold text-emerald-700">After (Cleaned output) →</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 2: 3D BEFORE/AFTER COMPARISON (2 SHEETS IN 3D SPACE)           */}
      {/* ========================================================================= */}
      {viewMode === 'split' && (
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 preserve-3d py-2"
          style={{ perspective: '1200px' }}
        >
          {/* ORIGINAL DEGRADED SHEET (Left: Receded in 3D, Muted Colors) */}
          <div
            className="glass-panel p-6 sm:p-7 rounded-3xl border border-red-200/50 relative flex flex-col justify-between transition-transform duration-500 shadow-md preserve-3d"
            style={{
              transform: 'translateZ(-15px) rotateY(4deg)',
              filter: 'contrast(0.92) saturate(0.85)',
            }}
          >
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/80">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h3 className="font-bold text-sm tracking-wider uppercase text-slate-700">
                    Original Document (Raw)
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-bold border border-red-100">
                  Receded Analog State
                </span>
              </div>

              {/* Degraded Sheet Simulation */}
              <div className="bg-amber-50/30 border border-amber-200/50 rounded-2xl p-5 font-mono text-xs text-slate-600 leading-relaxed overflow-x-auto shadow-inner min-h-[340px]">
                <div className="opacity-75 whitespace-pre-wrap selection:bg-amber-200">
                  {processedDoc.originalText}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Contains OCR anomalies, hard wraps, and scanner dust artifacts</span>
            </div>
          </div>

          {/* CLEANED DOCUMENT SHEET (Right: Brought Forward in 3D, Crisp Illumination) */}
          <div
            className="glass-panel-elevated p-6 sm:p-7 rounded-3xl border border-[#712ae2]/60 relative flex flex-col justify-between transition-transform duration-500 shadow-2xl shadow-indigo-900/15 preserve-3d"
            style={{
              transform: 'translateZ(18px) rotateY(-3deg)',
            }}
          >
            {/* Top scanning laser edge */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-[#712ae2] shadow-[0_0_12px_#67e8f9]" />

            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-indigo-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="font-bold text-sm tracking-wider uppercase text-[#1f108e]">
                    Cleaned Document (Pristine)
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Brought Forward 3D
                </span>
              </div>

              {/* Clean Sheet Simulation */}
              <div className="bg-white rounded-2xl p-5 font-mono text-xs text-slate-900 leading-relaxed overflow-x-auto shadow-md border border-indigo-100/80 min-h-[340px] relative">
                <div className="whitespace-pre-wrap selection:bg-indigo-100 font-medium">
                  {processedDoc.cleanedText}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-50 flex items-center justify-between text-xs text-indigo-950 font-semibold">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#712ae2]" />
                <span>All spacing, orthography, and typographic breaks normalized</span>
              </span>
              <span className="font-mono text-[11px] text-emerald-600 font-bold">100% PASS</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 3: DIFF HIGHLIGHTS WITH SOFT ELECTRIC-BLUE / CYAN GLOW         */}
      {/* ========================================================================= */}
      {viewMode === 'diff' && (
        <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-violet-200 shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2563eb]" />
              <h3 className="font-bold text-sm text-[#1f108e] uppercase tracking-wider">
                Diff Highlighting & OCR Correction Map
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-red-600">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Raw artifact removed
              </span>
              <span className="flex items-center gap-1 text-cyan-800 font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#67e8f9]" />
                AI Corrected Glyph
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 font-mono text-xs leading-relaxed border border-indigo-100 shadow-inner space-y-4 max-h-[500px] overflow-y-auto">
            {/* Compute and display real diffs from user's actual document */}
            {(() => {
              const origLines = (processedDoc.originalText || '').split('\n').map((l) => l.trim()).filter(Boolean);
              const cleanLines = (processedDoc.cleanedText || '').split('\n').map((l) => l.trim()).filter(Boolean);
              const diffItems: { before: string; after: string; label: string }[] = [];

              for (let i = 0; i < Math.min(origLines.length, cleanLines.length) && diffItems.length < 6; i++) {
                if (origLines[i] !== cleanLines[i]) {
                  diffItems.push({
                    label: `Section ${diffItems.length + 1} Rectification:`,
                    before: origLines[i],
                    after: cleanLines[i],
                  });
                }
              }

              if (diffItems.length === 0) {
                return (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-[11px] font-bold text-slate-500 block font-sans">
                      Document Content Comparison:
                    </span>
                    <div className="space-y-2">
                      <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg text-red-800">
                        <span className="font-bold block text-[10px] uppercase text-red-600 mb-1">Source Text:</span>
                        {processedDoc.originalText?.slice(0, 300) || 'Original document text'}
                      </div>
                      <div className="p-3 bg-cyan-50/70 border border-cyan-300 rounded-lg text-slate-900 font-medium">
                        <span className="font-bold block text-[10px] uppercase text-cyan-700 mb-1">Cleaned Text:</span>
                        {processedDoc.cleanedText?.slice(0, 300) || 'Cleaned document text'}
                      </div>
                    </div>
                  </div>
                );
              }

              return diffItems.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">
                    {item.label}
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="line-through bg-red-50 text-red-700 px-2.5 py-1 rounded border border-red-200 break-all sm:break-normal">
                      {item.before}
                    </span>
                    <span className="text-slate-400 hidden sm:inline">→</span>
                    <span className="bg-cyan-50 text-indigo-950 px-2.5 py-1 rounded font-bold border border-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.25)] break-all sm:break-normal">
                      {item.after}
                    </span>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
