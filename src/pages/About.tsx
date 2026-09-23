import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Cpu, Sparkles, FileText, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';

export const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto pt-4 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF8ED] border border-[#6B315E]/20 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#C65D45]" />
          <span className="text-xs font-semibold tracking-wider text-[#6B315E] uppercase font-mono">
            About DocuClean AI
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#24162F] tracking-tight font-heading">
          Architected for Precision Document Intelligence
        </h1>
        <p className="text-base text-[#6F6670] leading-relaxed font-body">
          DocuClean AI bridges the gap between imperfect analog scans and pristine,
          digitally-native documents through non-destructive contextual AI.
        </p>
      </div>

      {/* Main Feature Story Card */}
      <div className="p-8 sm:p-12 rounded-3xl border border-[#6B315E]/20 bg-[#FFF8ED]/90 backdrop-blur-md shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Text Story */}
        <div className="lg:col-span-7 space-y-5">
          <h2 className="text-2xl font-extrabold text-[#24162F] leading-snug font-heading">
            Restoring Document Fidelity Without Compromising Authenticity
          </h2>
          <p className="text-sm text-[#6F6670] leading-relaxed font-body">
            Every business day, millions of critical legal, financial, and medical documents suffer
            from degraded readability: scanner artifacts, broken mid-sentence line wraps, OCR
            character confusion, and heavy skewing.
          </p>
          <p className="text-sm text-[#6F6670] leading-relaxed font-body">
            DocuClean AI was developed as an enterprise-grade document restoration engine that
            analyzes typography glyphs and semantic structure simultaneously. It eliminates digital
            noise while rigorously preserving the original author's intent and legal validity.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/upload')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto h-12"
            >
              Upload Document Now
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/how-it-works')}
              className="w-full sm:w-auto h-12"
            >
              Explore Workflow
            </Button>
          </div>
        </div>

        {/* Animated Visual: Document Illustration + AI Nodes + Shield */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="w-full max-w-sm aspect-square bg-[#EADCC8]/40 rounded-3xl p-6 border border-[#6B315E]/20 flex flex-col items-center justify-center relative shadow-inner">
            {/* Ambient Background Glow */}
            <div className="absolute inset-4 bg-gradient-to-tr from-[#6B315E]/10 via-[#C65D45]/10 to-[#3C8D87]/15 rounded-full blur-2xl" />

            {/* Central Shield Graphic */}
            <div className="relative z-10 w-24 h-24 rounded-3xl bg-[#FFF8ED] shadow-xl border border-[#6B315E]/20 flex items-center justify-center text-[#24162F] mb-4">
              <ShieldCheck className="w-12 h-12 text-[#3C8D87]" />
            </div>

            {/* Orbiting AI Nodes */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF8ED] shadow-xs border border-[#6B315E]/20 text-xs font-bold text-[#24162F]">
                <Cpu className="w-3.5 h-3.5 text-[#C65D45]" />
                <span>Neural Core</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF8ED] shadow-xs border border-[#3C8D87]/30 text-xs font-bold text-[#3C8D87]">
                <Lock className="w-3.5 h-3.5 text-[#3C8D87]" />
                <span>Zero-Retention</span>
              </div>
            </div>

            <p className="relative z-10 text-[11px] text-[#6F6670] font-medium mt-4 text-center font-mono">
              Ephemeral in-memory document cleaning pipeline
            </p>
          </div>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl border border-[#6B315E]/20 bg-[#FFF8ED]/80 backdrop-blur-md space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#EADCC8]/60 text-[#24162F] flex items-center justify-center">
            <Cpu className="w-5 h-5 text-[#C65D45]" />
          </div>
          <h3 className="font-bold text-base text-[#24162F] font-heading">Contextual Understanding</h3>
          <p className="text-xs text-[#6F6670] leading-relaxed">
            Distinguishes between intentional abbreviations and OCR character mistakes (such as 'rn' vs 'm' or '1' vs 'I').
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-[#6B315E]/20 bg-[#FFF8ED]/80 backdrop-blur-md space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#A8D5C2]/30 text-[#3C8D87] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#24162F] font-heading">Privacy &amp; Sovereign Data</h3>
          <p className="text-xs text-[#6F6670] leading-relaxed">
            Compliant with enterprise data protection standards. Your documents are never stored or used to train open models.
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-[#6B315E]/20 bg-[#FFF8ED]/80 backdrop-blur-md space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#EADCC8]/60 text-[#6B315E] flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#24162F] font-heading">Lossless Formatting</h3>
          <p className="text-xs text-[#6F6670] leading-relaxed">
            Preserves tabular hierarchies, margin offsets, headers, and footer notes while cleaning visual artifacts.
          </p>
        </div>
      </div>
    </div>
  );
};
