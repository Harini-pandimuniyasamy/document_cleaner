import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  SlidersHorizontal,
  Cpu,
  Eye,
  Download,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  FileText,
} from 'lucide-react';
import { Button } from '../components/Button';

export const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const workflowSteps = [
    {
      title: '1. Ingest & Upload',
      shortName: 'Upload',
      subtitle: 'Upload any raw or legacy document',
      description:
        'Securely drop scanned receipts, historical records, multi-page PDFs, or contracts up to 50MB. DocuClean instantly calculates cryptographic checksums and validates container integrity.',
      icon: UploadCloud,
      color: '#6B315E',
    },
    {
      title: '2. Select Cleaning Rules',
      shortName: 'Choose Options',
      subtitle: 'Precision controls tailored to your scan defects',
      description:
        'Select from 8 modular cleaning engines: eliminate erratic whitespaces, repair line breaks, correct OCR substitutions, deskew tilted scans, or generate searchable layers.',
      icon: SlidersHorizontal,
      color: '#C65D45',
    },
    {
      title: '3. Neural AI Processing',
      shortName: 'AI Processing',
      subtitle: 'Fast, context-aware digital restoration',
      description:
        'Our lightweight machine learning engines analyze token contexts, reconstruct damaged punctuation, and digitally bleach scanner grain without altering semantic content.',
      icon: Cpu,
      color: '#3C8D87',
    },
    {
      title: '4. Side-by-Side Preview',
      shortName: 'Preview',
      subtitle: 'Audit every single correction before finalizing',
      description:
        'Examine original raw scans versus restored documents with interactive diff highlights, clarity metrics, and character-level change auditing.',
      icon: Eye,
      color: '#A8D5C2',
    },
    {
      title: '5. Instant Multi-Format Export',
      shortName: 'Download',
      subtitle: 'Export pristine files ready for enterprise pipelines',
      description:
        'Download cleanly converted Word DOCX, searchable PDF/A, or raw UTF-8 text ready for ERP systems, LLM ingestion, or archival storage.',
      icon: Download,
      color: '#24162F',
    },
  ];

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto pt-4 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF8ED] border border-[#6B315E]/20 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#C65D45]" />
          <span className="text-xs font-semibold tracking-wider text-[#6B315E] uppercase font-mono">
            Restoration Pipeline
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#24162F] tracking-tight font-heading">
          How DocuClean AI Works
        </h1>
        <p className="text-base text-[#6F6670] font-body">
          From degraded scan to pristine typography in five seamless, automated stages.
        </p>
      </div>

      {/* Step Tabs Navigation with Connected 3D Data Stream Line */}
      <div className="relative">
        {/* Glowing Data Flow Line connecting steps */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-[#6B315E]/30 via-[#C65D45]/30 to-[#3C8D87]/30 -translate-y-1/2 hidden md:block" />

        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 px-2 relative z-10">
          {workflowSteps.map((step, idx) => {
            const isActive = activeStep === idx;
            const Icon = step.icon;
            return (
              <button
                key={step.title}
                onClick={() => setActiveStep(idx)}
                className={`flex-1 min-w-[140px] p-3 sm:p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer preserve-3d ${
                  isActive
                    ? 'bg-[#FFF8ED] border-[#C65D45] shadow-lg -translate-y-1 ring-2 ring-[#C65D45]/20'
                    : 'bg-[#FFF8ED]/70 border-[#6B315E]/15 hover:bg-[#FFF8ED] text-[#6F6670] hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform ${
                      isActive
                        ? 'bg-gradient-to-tr from-[#24162F] to-[#6B315E] text-[#FFF8ED] shadow-sm scale-105'
                        : 'bg-[#EADCC8]/50 text-[#6B315E]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-xs font-mono font-bold ${
                      isActive ? 'text-[#C65D45]' : 'text-[#978D91]'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                </div>
                <h4
                  className={`text-xs sm:text-sm font-bold truncate ${
                    isActive ? 'text-[#24162F]' : 'text-[#6F6670]'
                  }`}
                >
                  {step.shortName}
                </h4>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Animated Demo Stage Card */}
      <div className="p-6 sm:p-10 rounded-3xl border border-[#6B315E]/20 bg-[#FFF8ED]/95 shadow-xl relative overflow-hidden preserve-3d">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Description */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#6B315E] bg-[#EADCC8]/50 px-2.5 py-1 rounded-md border border-[#6B315E]/20 inline-block">
              Stage 0{activeStep + 1} of 05
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24162F] font-heading">
              {workflowSteps[activeStep].title}
            </h2>
            <p className="text-base font-semibold text-[#6B315E]">
              {workflowSteps[activeStep].subtitle}
            </p>
            <p className="text-sm text-[#6F6670] leading-relaxed font-body">
              {workflowSteps[activeStep].description}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Button
                size="md"
                onClick={() => navigate('/upload')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="h-11"
              >
                Try It Now
              </Button>
              {activeStep < workflowSteps.length - 1 && (
                <button
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="secondary-btn h-11 px-5 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Next Stage →
                </button>
              )}
            </div>
          </div>

          {/* 3D Interactive Demo Stage Illustration Panel */}
          <div
            className="lg:col-span-6 bg-[#EADCC8]/35 p-6 sm:p-8 rounded-2xl border border-[#6B315E]/15 shadow-inner flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden preserve-3d"
            style={{ perspective: '1000px' }}
          >
            {/* STAGE 0: Ingest & Upload 3D Document Chamber */}
            {activeStep === 0 && (
              <div className="w-full max-w-xs flex flex-col items-center gap-4 text-center animate-in zoom-in-95 duration-400 preserve-3d">
                {/* 3D Floating Document Sheet Dropping in */}
                <div
                  className="w-28 h-36 rounded-xl bg-[#FFF8ED] border border-[#6B315E]/20 shadow-xl p-3 flex flex-col justify-between transform -rotate-6 hover:rotate-0 transition-transform duration-500 animate-float-tilt-1"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="flex items-center justify-between border-b border-[#EADCC8] pb-1.5">
                    <div className="w-4 h-4 rounded bg-[#24162F] flex items-center justify-center text-[#FFF8ED]">
                      <FileText className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-[8px] font-mono text-[#6B315E]">PDF</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 bg-[#EADCC8] rounded w-full" />
                    <div className="h-1.5 bg-[#EADCC8]/70 rounded w-4/5" />
                    <div className="h-1.5 bg-[#EADCC8]/50 rounded w-3/4" />
                  </div>
                  <div className="text-[7px] font-mono text-[#3C8D87] font-bold">CHECKSUM_OK</div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#24162F]">Drag &amp; Drop Documents</h4>
                  <p className="text-xs text-[#6F6670] mt-1">
                    Instant drag-and-drop ingestion with automatic MIME validation
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#FFF8ED] text-[11px] font-bold text-[#6B315E] border border-[#6B315E]/20 shadow-xs">
                    PDF
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#FFF8ED] text-[11px] font-bold text-[#C65D45] border border-[#C65D45]/20 shadow-xs">
                    DOCX
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#FFF8ED] text-[11px] font-bold text-[#3C8D87] border border-[#3C8D87]/20 shadow-xs">
                    TXT
                  </span>
                </div>
              </div>
            )}

            {/* STAGE 1: Cleaning Rules 3D Modules */}
            {activeStep === 1 && (
              <div className="w-full max-w-sm space-y-3 animate-in zoom-in-95 duration-400 preserve-3d">
                <div className="p-3 bg-[#FFF8ED] rounded-xl shadow-xs border border-[#6B315E]/20 flex items-center justify-between transform hover:translate-x-1 transition-transform">
                  <span className="text-xs font-bold text-[#24162F] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3C8D87]" />
                    Remove Extra Spaces
                  </span>
                  <span className="text-[10px] font-mono bg-[#A8D5C2]/30 text-[#3C8D87] px-2 py-0.5 rounded border border-[#3C8D87]/30 font-bold">
                    ACTIVE
                  </span>
                </div>
                <div className="p-3 bg-[#FFF8ED] rounded-xl shadow-xs border border-[#6B315E]/20 flex items-center justify-between transform hover:translate-x-1 transition-transform">
                  <span className="text-xs font-bold text-[#24162F] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3C8D87]" />
                    Fix Line Breaks
                  </span>
                  <span className="text-[10px] font-mono bg-[#A8D5C2]/30 text-[#3C8D87] px-2 py-0.5 rounded border border-[#3C8D87]/30 font-bold">
                    ACTIVE
                  </span>
                </div>
                <div className="p-3 bg-[#FFF8ED] rounded-xl shadow-xs border border-[#6B315E]/20 flex items-center justify-between transform hover:translate-x-1 transition-transform">
                  <span className="text-xs font-bold text-[#24162F] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3C8D87]" />
                    Correct OCR Errors
                  </span>
                  <span className="text-[10px] font-mono bg-[#A8D5C2]/30 text-[#3C8D87] px-2 py-0.5 rounded border border-[#3C8D87]/30 font-bold">
                    ACTIVE
                  </span>
                </div>
              </div>
            )}

            {/* STAGE 2: Neural AI Processing 3D Chamber */}
            {activeStep === 2 && (
              <div className="w-full max-w-xs flex flex-col items-center gap-4 text-center animate-in zoom-in-95 duration-400">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  {/* Rotating 3D Rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-[#EADCC8] border-t-[#C65D45] animate-spin" />
                  <div
                    className="absolute inset-2 rounded-full border-2 border-dashed border-[#6B315E]/30 border-r-[#3C8D87] animate-spin"
                    style={{ animationDirection: 'reverse', animationDuration: '6s' }}
                  />
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#24162F] to-[#6B315E] flex items-center justify-center text-[#FFF8ED] shadow-lg">
                    <Cpu className="w-7 h-7 animate-pulse text-[#A8D5C2]" />
                  </div>
                </div>
                <div>
                  <span className="text-xs font-extrabold text-[#24162F] block">
                    Neural Processing In Progress...
                  </span>
                  <span className="text-[10px] font-mono text-[#3C8D87]">
                    SCAN_LINE: 0x4B // BLEACHING NOISE
                  </span>
                </div>
                <div className="w-full bg-[#EADCC8] h-2 rounded-full overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-[#6B315E] via-[#C65D45] to-[#3C8D87] h-full w-4/5 animate-pulse" />
                </div>
              </div>
            )}

            {/* STAGE 3: Side-by-Side 3D Document Comparison */}
            {activeStep === 3 && (
              <div className="w-full max-w-sm grid grid-cols-2 gap-3 text-left animate-in zoom-in-95 duration-400">
                <div className="p-3.5 bg-[#FFF8ED] rounded-xl border border-[#C65D45]/30 text-[11px] font-mono shadow-xs">
                  <div className="font-bold text-[#C65D45] mb-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C65D45]" />
                    Raw Scan:
                  </div>
                  <div className="text-[#6F6670] line-through decoration-[#C65D45]/50">
                    T0tal scanned p4ges: 12,480
                  </div>
                </div>
                <div className="p-3.5 bg-[#FFF8ED] rounded-xl border border-[#3C8D87]/40 text-[11px] font-mono shadow-sm">
                  <div className="font-bold text-[#3C8D87] mb-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3C8D87]" />
                    Cleaned:
                  </div>
                  <div className="text-[#24162F] font-semibold">
                    Total scanned pages: 12,480
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 4: Multi-Format Export 3D Cartridges */}
            {activeStep === 4 && (
              <div className="w-full max-w-xs flex flex-col items-center gap-4 text-center animate-in zoom-in-95 duration-400">
                <div className="w-16 h-16 rounded-2xl bg-[#A8D5C2]/30 border border-[#3C8D87]/40 text-[#3C8D87] flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#24162F]">Restoration Complete</h4>
                  <p className="text-xs text-[#6F6670] mt-0.5 font-body">
                    Ready to download in PDF, DOCX, or TXT
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-lg bg-[#FFF8ED] text-xs font-mono font-bold text-[#6B315E] border border-[#6B315E]/20 shadow-xs">
                    .PDF
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#FFF8ED] text-xs font-mono font-bold text-[#C65D45] border border-[#C65D45]/20 shadow-xs">
                    .DOCX
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#FFF8ED] text-xs font-mono font-bold text-[#3C8D87] border border-[#3C8D87]/20 shadow-xs">
                    .TXT
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
