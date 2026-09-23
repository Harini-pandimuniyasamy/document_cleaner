import React from 'react';
import {
  Cpu,
  CheckCircle2,
  Loader2,
  Sparkles,
  FileText,
  Zap,
  Layers,
  Wand2,
  ShieldCheck,
  SpellCheck,
} from 'lucide-react';
import { CLEANING_OPTIONS } from '../services/documentService';

interface ProcessingAnimationProps {
  progress: number;
  stage: string;
  selectedOptionIds: string[];
}

const PIPELINE_STAGES = [
  { label: 'Reading document', desc: 'Ingesting raw binary stream and container bounds' },
  { label: 'Analyzing text structure', desc: 'Tokenizing characters and semantic paragraphs' },
  { label: 'Detecting formatting issues', desc: 'Locating irregular tabs, margin skews, and line slips' },
  { label: 'Correcting OCR patterns', desc: 'Disambiguating alphanumeric character substitutions' },
  { label: 'Removing noise', desc: 'Bleaching scanner dust, speckles, and background stains' },
  { label: 'Normalizing structure', desc: 'Realigning column geometry, headers, and spacing' },
  { label: 'Enhancing readability', desc: 'Optimizing typography contrast and character crispness' },
  { label: 'Finalizing cleaned document', desc: 'Packaging verified pristine document container' },
];

export const ProcessingAnimation: React.FC<ProcessingAnimationProps> = ({
  progress,
  stage,
  selectedOptionIds,
}) => {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const isComplete = progress >= 100;

  // Staged message selector
  const getDetailedProgressMessage = () => {
    if (progress < 15) return 'Reading document structure & byte streams...';
    if (progress < 30) return 'Analyzing text structure & token contexts...';
    if (progress < 45) return 'Detecting formatting defects & OCR substitutions...';
    if (progress < 60) return 'Correcting OCR patterns (number-letter disambiguation)...';
    if (progress < 75) return 'Bleaching scanner noise & salt-and-pepper grain...';
    if (progress < 88) return 'Normalizing paragraph geometry & column alignments...';
    if (progress < 98) return 'Enhancing character contrast & optical crispness...';
    return 'Finalizing pristine output & validating checksum...';
  };

  // 4 Core AI Module Statuses
  const ocrActive = progress >= 25;
  const layoutActive = progress >= 40;
  const noiseActive = progress >= 55;
  const formatActive = progress >= 70;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center select-none">
      {/* ========================================================================= */}
      {/* 3D DOCUMENT PROCESSING MACHINE (HERO 3D VIEWPORT)                        */}
      {/* ========================================================================= */}
      <div
        className="w-full py-6 relative flex justify-center items-center preserve-3d"
        style={{ perspective: '1200px' }}
      >
        {/* Shockwave Energy Wave at 100% */}
        {isComplete && (
          <div className="absolute w-[420px] h-[420px] rounded-full border-2 border-cyan-400 bg-cyan-400/15 animate-ping duration-1000 pointer-events-none z-30" />
        )}

        {/* 3D CIRCULAR AI SCANNING RINGS ROTATING IN 3D SPACE */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
          {/* Ring 1: Outer Inclined Planetary Ring */}
          <div
            className="w-[360px] h-[360px] rounded-full border border-indigo-400/30 border-t-cyan-400/80 animate-orbit-spin"
            style={{
              transform: 'rotateX(65deg) rotateY(15deg)',
              transformStyle: 'preserve-3d',
            }}
          />

          {/* Ring 2: Counter-Rotating Dashed Orbital Ring */}
          <div
            className="w-[310px] h-[310px] rounded-full border border-dashed border-violet-400/40 border-r-[#2563eb] animate-orbit-spin"
            style={{
              transform: 'rotateX(50deg) rotateY(-35deg)',
              animationDirection: 'reverse',
              animationDuration: '14s',
            }}
          />

          {/* Ring 3: Deep Atmosphere Glow */}
          <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-[#2563eb]/15 via-[#6d28d9]/15 to-[#67e8f9]/20 blur-2xl animate-pulse-glow" />
        </div>

        {/* FLOATING AI MODULE BADGES (SURROUNDING 3D CHAMBER) */}
        <div className="absolute top-2 left-2 sm:left-6 z-20 transition-all duration-300">
          <div
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-md backdrop-blur-md transition-all ${
              ocrActive
                ? 'bg-white/90 border-[#2563eb] text-[#1f108e] shadow-indigo-900/15 scale-105 ring-1 ring-blue-400/40'
                : 'bg-white/50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                ocrActive ? 'bg-[#2563eb] animate-ping' : 'bg-slate-300'
              }`}
            />
            <SpellCheck className="w-3.5 h-3.5" />
            <span>[OCR Engine: {ocrActive ? 'ACTIVE' : 'READY'}]</span>
          </div>
        </div>

        <div className="absolute top-2 right-2 sm:right-6 z-20 transition-all duration-300">
          <div
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-md backdrop-blur-md transition-all ${
              layoutActive
                ? 'bg-white/90 border-[#712ae2] text-[#712ae2] shadow-indigo-900/15 scale-105 ring-1 ring-violet-400/40'
                : 'bg-white/50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                layoutActive ? 'bg-[#712ae2] animate-ping' : 'bg-slate-300'
              }`}
            />
            <Layers className="w-3.5 h-3.5" />
            <span>[Layout Stabilizer: {layoutActive ? 'ACTIVE' : 'QUEUED'}]</span>
          </div>
        </div>

        <div className="absolute bottom-2 left-2 sm:left-6 z-20 transition-all duration-300">
          <div
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-md backdrop-blur-md transition-all ${
              noiseActive
                ? 'bg-white/90 border-cyan-400 text-cyan-800 shadow-cyan-500/20 scale-105 ring-1 ring-cyan-300/40'
                : 'bg-white/50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                noiseActive ? 'bg-cyan-400 animate-ping' : 'bg-slate-300'
              }`}
            />
            <Sparkles className="w-3.5 h-3.5" />
            <span>[Noise Bleach: {noiseActive ? 'ACTIVE' : 'QUEUED'}]</span>
          </div>
        </div>

        <div className="absolute bottom-2 right-2 sm:right-6 z-20 transition-all duration-300">
          <div
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-md backdrop-blur-md transition-all ${
              formatActive
                ? 'bg-white/90 border-emerald-500 text-emerald-800 shadow-emerald-500/20 scale-105 ring-1 ring-emerald-400/40'
                : 'bg-white/50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                formatActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
              }`}
            />
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>[Format Restorer: {formatActive ? 'ACTIVE' : 'QUEUED'}]</span>
          </div>
        </div>

        {/* 3D FLOATING DOCUMENT IN PERSPECTIVE */}
        <div
          className="relative w-72 sm:w-80 h-96 rounded-2xl bg-white/95 backdrop-blur-xl border border-white shadow-2xl p-6 overflow-hidden flex flex-col justify-between transition-all duration-700 ease-out z-10 preserve-3d"
          style={{
            transform: isComplete
              ? 'rotateX(0deg) rotateY(0deg) translateZ(24px) scale(1.03)'
              : 'rotateX(10deg) rotateY(-8deg) translateZ(0px)',
            boxShadow: isComplete
              ? '0 35px 70px -15px rgba(37,99,235,0.35), 0 0 35px rgba(103,232,249,0.3)'
              : '0 25px 50px -12px rgba(79,70,229,0.22)',
          }}
        >
          {/* Subtle Document Grid Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/20 via-white to-violet-50/20 pointer-events-none" />

          {/* Document Header */}
          <div className="flex items-center justify-between pb-3 border-b border-indigo-100 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-[#1f108e] to-[#712ae2] flex items-center justify-center text-white">
                <FileText className="w-3 h-3" />
              </div>
              <span className="text-xs font-mono font-extrabold text-slate-900">
                {isComplete ? 'AUDIT_RESTORED.DOC' : 'AUDIT_STREAM.RAW'}
              </span>
            </div>
            <span
              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                isComplete
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-indigo-100 text-indigo-700 animate-pulse'
              }`}
            >
              {isComplete ? 'PRISTINE 99.9%' : 'SCANNING'}
            </span>
          </div>

          {/* DYNAMIC TEXT LINES (Messy below laser beam -> Crisp above laser beam) */}
          <div className="space-y-3.5 my-2 relative z-10 font-mono text-[11px]">
            {/* Line 1: Title Line */}
            <div className="transition-colors duration-300">
              {progress > 15 ? (
                <div className="font-bold text-slate-900 flex items-center justify-between bg-emerald-50/60 px-2 py-1 rounded">
                  <span>CONFIDENTIAL AUDIT REPORT — 2024</span>
                  <span className="text-[9px] text-emerald-600 font-bold">✓</span>
                </div>
              ) : (
                <div className="text-amber-700 line-through decoration-red-400 bg-amber-50/50 px-2 py-1 rounded">
                  C0NF1DENT1AL  AUD1T  REP0RT  --  2O24
                </div>
              )}
            </div>

            {/* Line 2: Paragraph text line */}
            <div className="transition-colors duration-300">
              {progress > 40 ? (
                <div className="text-slate-800 bg-emerald-50/40 px-2 py-1 rounded flex items-center justify-between">
                  <span>1. EXECUTIVE SUMMARY</span>
                  <span className="text-[9px] text-emerald-600 font-bold">✓</span>
                </div>
              ) : (
                <div className="text-slate-500 bg-slate-100/60 px-2 py-1 rounded">
                  1.  EXECUT1VE   SUMM4RY
                </div>
              )}
            </div>

            {/* Line 3: Multi-character restoration */}
            <div className="transition-colors duration-300">
              {progress > 65 ? (
                <div className="text-slate-800 bg-emerald-50/40 px-2 py-1 rounded flex items-center justify-between">
                  <span>During operational review, all 12,480 pages...</span>
                  <span className="text-[9px] text-emerald-600 font-bold">✓</span>
                </div>
              ) : (
                <div className="text-red-500/80 bg-red-50/40 px-2 py-1 rounded">
                  Dur1ng  operat1onal  rev1ew ,  all  12,480  p4ges...
                </div>
              )}
            </div>

            {/* Line 4: Cleaned Metrics */}
            <div className="transition-colors duration-300">
              {progress > 85 ? (
                <div className="text-slate-900 font-bold bg-indigo-50/70 p-2 rounded-xl border border-indigo-200/80 flex items-center justify-between">
                  <span>Clarity Index: 99.4% (Pristine)</span>
                  <span className="text-emerald-600">AUTHENTICATED</span>
                </div>
              ) : (
                <div className="text-slate-400 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  Clar1ty  Index:  61.4%  (Sub-opt1mal)
                </div>
              )}
            </div>
          </div>

          {/* DYNAMIC ELECTRIC-BLUE LASER BEAM */}
          {!isComplete && (
            <div
              className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-300 to-[#2563eb] shadow-[0_0_16px_4px_rgba(103,232,249,0.8),0_0_28px_rgba(37,99,235,0.6)] pointer-events-none transition-all duration-300 z-30"
              style={{ top: `${Math.min(93, Math.max(7, progress))}%` }}
            >
              {/* Trailing scan gradient aura */}
              <div className="absolute -top-12 left-0 right-0 h-12 bg-gradient-to-t from-cyan-400/25 via-indigo-500/10 to-transparent pointer-events-none" />
            </div>
          )}

          {/* Document Sheet Footer */}
          <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 text-[10px] text-slate-400 font-mono relative z-10">
            <span>DocuClean AI Core</span>
            <span className="text-[#2563eb] font-bold">PAGE 01/01</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CIRCULAR PROGRESS RING & PERCENT DISPLAY                                 */}
      {/* ========================================================================= */}
      <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center my-4">
        {/* Outer Glow */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#1f108e]/20 via-[#712ae2]/25 to-[#67e8f9]/25 blur-xl animate-pulse-glow" />

        {/* SVG Circular Progress Track */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="104"
            cy="104"
            r={radius}
            stroke="#e0e7ff"
            strokeWidth="10"
            fill="transparent"
            className="opacity-70"
          />
          <circle
            cx="104"
            cy="104"
            r={radius}
            stroke="url(#heroProgressGradient)"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-300 ease-out"
          />
          <defs>
            <linearGradient id="heroProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1f108e" />
              <stop offset="35%" stopColor="#4f46e5" />
              <stop offset="70%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#67e8f9" />
            </linearGradient>
          </defs>
        </svg>

        {/* Central Counter */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#712ae2] flex items-center justify-center mb-1 shadow-sm">
            {isComplete ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 animate-in zoom-in-50" />
            ) : (
              <Cpu className="w-6 h-6 text-[#2563eb] animate-pulse" />
            )}
          </div>
          <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
            {progress}%
          </span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
            {isComplete ? 'Restoration Complete' : 'Cleaning Document'}
          </span>
        </div>
      </div>

      {/* DYNAMIC STAGED PROGRESS MESSAGE */}
      <div className="text-center mb-6 px-4">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1.5 flex items-center justify-center gap-2">
          {!isComplete && <Loader2 className="w-4 h-4 animate-spin text-[#2563eb]" />}
          <span>{stage}</span>
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-indigo-900 bg-indigo-50/90 px-4 py-1.5 rounded-full border border-indigo-200/80 inline-flex items-center gap-2 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#2563eb]" />
          <span>{getDetailedProgressMessage()}</span>
        </p>
      </div>

      {/* 8 STANDARDIZED PIPELINE STEPS */}
      <div className="w-full glass-panel p-5 sm:p-6 rounded-3xl mb-6 space-y-2 border border-indigo-100/80 shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-indigo-50">
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#712ae2]" />
            Restoration Pipeline Steps
          </span>
          <span className="text-[11px] font-mono font-bold text-indigo-700">
            {Math.min(8, Math.floor((progress / 100) * 8) + 1)} of 8 Stages
          </span>
        </div>

        {PIPELINE_STAGES.map((step, idx) => {
          const stepPercentThreshold = ((idx + 1) / PIPELINE_STAGES.length) * 100;
          const isDone = progress >= stepPercentThreshold;
          const isCurrent = progress >= (idx / PIPELINE_STAGES.length) * 100 && !isDone;

          return (
            <div
              key={step.label}
              className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl text-xs transition-all duration-200 ${
                isDone
                  ? 'bg-emerald-50/70 text-emerald-950 font-semibold border border-emerald-100'
                  : isCurrent
                  ? 'bg-indigo-50/90 text-[#1f108e] font-bold border border-indigo-200 shadow-sm scale-[1.01]'
                  : 'text-slate-400 bg-white/40'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-in zoom-in-50" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-[#2563eb] animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
                )}
                <div>
                  <div className="font-bold text-slate-900">{step.label}</div>
                  <div className="text-[10px] text-slate-500 font-normal">{step.desc}</div>
                </div>
              </div>
              <span
                className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md ${
                  isDone
                    ? 'bg-emerald-100 text-emerald-700'
                    : isCurrent
                    ? 'bg-indigo-100 text-indigo-700 animate-pulse'
                    : 'text-slate-400'
                }`}
              >
                {isDone ? 'Completed' : isCurrent ? 'Running' : 'Pending'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
