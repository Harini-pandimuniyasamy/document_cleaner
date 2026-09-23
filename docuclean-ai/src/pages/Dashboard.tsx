import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  Sparkles,
  Wand2,
  SpellCheck,
  ArrowUpDown,
  Rocket,
  Image as ImageIcon,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { Button } from '../components/Button';
import { AICharacter } from '../components/AICharacter';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isActionHovered, setIsActionHovered] = useState(false);

  return (
    <div className="flex flex-col gap-16 lg:gap-24">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center gap-12 pt-6 lg:pt-14">
        {/* Left: Text Content */}
        <div className="flex-1 flex flex-col items-start gap-6 z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF8ED] border border-[#6B315E]/20 shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#C65D45] animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-[#6B315E] uppercase font-mono">
              Intelligent Document Laboratory
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#24162F] leading-[1.1] tracking-tight font-heading">
            Physical Document Processing <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#6B315E] via-[#C65D45] to-[#3C8D87] bg-clip-text text-transparent">
              Powered by AI Architecture
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#6F6670] leading-relaxed max-w-2xl font-body">
            <strong className="text-[#2C2830] font-bold">Scan. Disassemble. Restore. Materialize.</strong>{' '}
            Watch your documents enter a living digital machine where typography is rebuilt, OCR noise is repaired, and layers are reassembled with optical perfection.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto">
            <div
              onMouseEnter={() => setIsActionHovered(true)}
              onMouseLeave={() => setIsActionHovered(false)}
            >
              <Button
                size="lg"
                onClick={() => navigate('/upload')}
                leftIcon={<UploadCloud className="w-5 h-5" />}
                className="w-full sm:w-auto"
              >
                Upload Document
              </Button>
            </div>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/how-it-works')}
              className="w-full sm:w-auto"
            >
              How It Works
            </Button>
          </div>

          {/* Trust points */}
          <div className="flex items-center gap-6 pt-3 text-xs text-[#6F6670] font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#3C8D87]" />
              <span>Zero server retention</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#3C8D87]" />
              <span>Real-time OCR audit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#3C8D87]" />
              <span>Volumetric split review</span>
            </div>
          </div>
        </div>

        {/* Right: Visual 3D AI Processing View Card with Docu-Bot + Layered Document Stack */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative aspect-square lg:aspect-auto lg:h-[520px] z-10 flex justify-center items-center">
          <div
            className="w-full h-full rounded-3xl overflow-hidden relative shadow-2xl flex justify-center items-center border border-[#6B315E]/20 bg-[#FFF8ED]/85 backdrop-blur-md p-6 sm:p-8 preserve-3d"
            style={{ perspective: '1200px' }}
            onMouseEnter={() => setIsActionHovered(true)}
            onMouseLeave={() => setIsActionHovered(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#6B315E]/5 via-[#C65D45]/5 to-[#3C8D87]/10 z-0 pointer-events-none" />

            <span className="text-[#6B315E] text-xs font-bold uppercase tracking-wider absolute top-5 left-6 z-20 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#C65D45] animate-ping" />
              Machine Chamber // Active
            </span>

            {/* Depth Hint Tag */}
            <span className="text-[10px] font-mono text-[#3C8D87] font-semibold absolute top-5 right-6 z-20 hidden sm:inline-block">
              {isActionHovered ? 'DEPTH: SEPARATED (40px)' : 'DEPTH: COHESIVE'}
            </span>

            {/* Docu-Bot companion positioned beside the stack */}
            <div className="absolute bottom-6 left-6 z-30 hidden sm:block">
              <AICharacter
                action={isActionHovered ? 'scanning_beam' : 'idle'}
                size="sm"
                className="drop-shadow-md"
              />
            </div>

            {/* 3D DOCUMENT STACK WRAPPER */}
            <div
              className="relative w-full max-w-sm sm:max-w-md h-[360px] flex items-center justify-center preserve-3d transition-transform duration-700 ease-out"
              style={{
                transform: isActionHovered
                  ? 'rotateX(14deg) rotateY(-16deg) scale(1.03)'
                  : 'rotateX(8deg) rotateY(-8deg) scale(1)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* STACK LAYER 1: Grounding Shadow Sheet */}
              <div
                className="absolute inset-x-6 top-10 h-64 rounded-2xl bg-[#24162F]/15 blur-xl transition-all duration-500 ease-out pointer-events-none"
                style={{
                  transform: isActionHovered
                    ? 'translateZ(-50px) translateY(28px)'
                    : 'translateZ(-15px) translateY(12px)',
                }}
              />

              {/* STACK LAYER 2: Underlying Raw Document Layer */}
              <div
                className="absolute inset-x-4 top-5 h-72 rounded-2xl bg-[#FFF8ED]/65 backdrop-blur-md border border-[#C65D45]/30 shadow-md transition-all duration-500 ease-out p-5 flex flex-col justify-between"
                style={{
                  transform: isActionHovered
                    ? 'translateZ(-30px) rotateX(4deg) rotateY(-6deg) translateY(10px)'
                    : 'translateZ(-10px) translateY(4px)',
                }}
              >
                <div className="flex items-center justify-between border-b border-[#EADCC8] pb-2">
                  <div className="h-3 w-20 bg-[#C65D45]/30 rounded-full" />
                  <span className="text-[8px] font-mono text-[#C65D45]">LAYER 01: RAW ANALOG BUFFER</span>
                </div>
                <div className="space-y-2 opacity-50">
                  <div className="h-2 w-full bg-[#6B315E]/20 rounded-full" />
                  <div className="h-2 w-4/5 bg-[#6B315E]/20 rounded-full" />
                  <div className="h-2 w-2/3 bg-[#6B315E]/20 rounded-full" />
                </div>
                <div className="text-[8px] font-mono text-[#978D91]">INGESTION_READY</div>
              </div>

              {/* STACK LAYER 3: OCR Neural Recognition Layer */}
              <div
                className="absolute inset-x-2 top-2 h-76 rounded-2xl bg-[#FFF8ED]/85 backdrop-blur-md border border-[#3C8D87]/40 shadow-md transition-all duration-500 ease-out p-5 flex flex-col justify-between"
                style={{
                  transform: isActionHovered
                    ? 'translateZ(-15px) rotateX(2deg) rotateY(-3deg) translateY(4px)'
                    : 'translateZ(-4px)',
                }}
              >
                <div className="flex items-center justify-between border-b border-[#EADCC8] pb-2">
                  <div className="h-3 w-24 bg-[#3C8D87]/30 rounded-full" />
                  <span className="text-[8px] font-mono text-[#3C8D87] font-bold">
                    LAYER 02: OCR MATRIX
                  </span>
                </div>
                <div className="space-y-2 opacity-60">
                  <div className="h-2 w-full bg-[#3C8D87]/20 rounded-full" />
                  <div className="h-2 w-5/6 bg-[#3C8D87]/20 rounded-full" />
                </div>
                <div className="text-[8px] font-mono text-[#3C8D87]">GLYPH_RESTORATION</div>
              </div>

              {/* STACK LAYER 4: TOP FOREGROUND DOCUMENT (Active Scanning Sheet) */}
              <div
                className="w-full bg-[#FFF8ED] rounded-2xl border border-[#EADCC8] shadow-2xl flex flex-col p-6 gap-4 relative overflow-hidden transition-all duration-500 ease-out z-10"
                style={{
                  transform: isActionHovered
                    ? 'translateZ(36px) rotateX(-2deg) rotateY(3deg) scale(1.02)'
                    : 'translateZ(0px)',
                  boxShadow: isActionHovered
                    ? '0 30px 60px -15px rgba(36,22,47,0.2), 0 0 30px rgba(60,141,135,0.2)'
                    : '0 20px 40px -12px rgba(36,22,47,0.1)',
                }}
              >
                {/* 3D OCR Laser Beam Traveling Across Document */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#3C8D87] to-[#A8D5C2] shadow-[0_0_14px_4px_rgba(60,141,135,0.7)] animate-scan-3d z-30 pointer-events-none" />

                {/* Trailing scan aura */}
                <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#3C8D87]/15 to-transparent pointer-events-none animate-scan-3d z-20" />

                {/* Document Header */}
                <div className="flex items-center justify-between border-b border-[#EADCC8] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#24162F] to-[#6B315E] flex items-center justify-center text-[#FFF8ED]">
                      <FileText className="w-3 h-3" />
                    </div>
                    <div className="h-4 bg-[#EADCC8] rounded-md w-28" />
                  </div>
                  <div className="h-4 px-2 bg-[#A8D5C2]/30 rounded-full text-[9px] font-mono font-bold text-[#3C8D87] flex items-center">
                    CLEANED
                  </div>
                </div>

                {/* Paragraph Skeletons */}
                <div className="space-y-2">
                  <div className="h-3 bg-[#EADCC8]/80 rounded w-full" />
                  <div className="h-3 bg-[#EADCC8]/70 rounded w-5/6" />
                  <div className="h-3 bg-[#EADCC8]/60 rounded w-4/6" />
                </div>

                {/* Middle Media & Text Block */}
                <div className="mt-1 flex gap-3 p-3 bg-[#EADCC8]/40 rounded-xl border border-[#EADCC8]">
                  <div className="h-12 w-12 bg-[#6B315E]/10 rounded-lg flex justify-center items-center text-[#6B315E] flex-shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 flex flex-col gap-2 justify-center">
                    <div className="h-2.5 bg-[#6B315E]/20 rounded w-full" />
                    <div className="h-2.5 bg-[#6B315E]/15 rounded w-3/4" />
                  </div>
                </div>

                {/* Real-time cleaning status tag */}
                <div className="mt-1 pt-2 border-t border-[#EADCC8] flex items-center justify-between text-[11px] font-semibold text-[#6B315E]">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C65D45]" />
                    Artifacts Removed: 48
                  </span>
                  <span className="text-[#3C8D87] font-bold">Pristine 99.8%</span>
                </div>
              </div>

              {/* Floating AI Particles Gathering around the stack on hover */}
              {isActionHovered && (
                <div className="absolute inset-0 pointer-events-none z-40">
                  <span className="absolute top-2 left-4 w-2 h-2 rounded-full bg-[#3C8D87] shadow-[0_0_10px_#3C8D87] animate-ping" />
                  <span className="absolute top-1/2 -right-3 w-2.5 h-2.5 rounded-full bg-[#C65D45] shadow-[0_0_12px_#C65D45] animate-bounce" />
                  <span className="absolute -bottom-2 left-1/3 w-2 h-2 rounded-full bg-[#A8D5C2] shadow-[0_0_10px_#A8D5C2] animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="flex flex-col gap-8 z-10">
        <div className="text-center max-w-2xl mx-auto mb-2">
          <h2 className="text-2xl sm:text-3xl font-black text-[#24162F] mb-2 tracking-tight font-heading">
            Intelligent Document Laboratory Engines
          </h2>
          <p className="text-sm sm:text-base text-[#6F6670] font-body">
            Four specialized engines working in harmony to restore and enhance your files.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1: AI Cleaning */}
          <div className="bg-[#FFF8ED]/85 backdrop-blur-md p-8 rounded-3xl flex flex-col gap-4 group hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(107,49,94,0.18)] transition-all duration-300 relative overflow-hidden border border-[#6B315E]/20">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#6B315E]/10 rounded-full blur-xl group-hover:bg-[#6B315E]/20 transition-all" />
            <div className="w-12 h-12 rounded-2xl bg-[#EADCC8]/60 flex justify-center items-center text-[#6B315E] group-hover:bg-[#6B315E] group-hover:text-[#FFF8ED] transition-colors duration-300 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-[#2C2830] font-heading">AI Cleaning</h3>
            <p className="text-sm text-[#6F6670] leading-relaxed">
              Automatically detect and remove stains, creases, shadows, and digital artifacts from scanned images.
            </p>
            <div className="mt-auto pt-2 flex items-center gap-1.5 text-xs font-mono font-bold text-[#6B315E] opacity-80">
              <span>SCANNER_DESPECKLE</span>
            </div>
          </div>

          {/* Feature 2: Format Fixer */}
          <div className="bg-[#FFF8ED]/85 backdrop-blur-md p-8 rounded-3xl flex flex-col gap-4 group hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(198,93,69,0.18)] transition-all duration-300 relative overflow-hidden border border-[#6B315E]/20">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#C65D45]/10 rounded-full blur-xl group-hover:bg-[#C65D45]/20 transition-all" />
            <div className="w-12 h-12 rounded-2xl bg-[#EADCC8]/60 flex justify-center items-center text-[#C65D45] group-hover:bg-[#C65D45] group-hover:text-[#FFF8ED] transition-colors duration-300 shadow-sm">
              <Wand2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-[#2C2830] font-heading">Format Fixer</h3>
            <p className="text-sm text-[#6F6670] leading-relaxed">
              Reconstruct tables, align skewed paragraphs, and restore original document margins with precision.
            </p>
            <div className="mt-auto pt-2 flex items-center gap-1.5 text-xs font-mono font-bold text-[#C65D45] opacity-80">
              <span>MARGIN_NORMALIZER</span>
            </div>
          </div>

          {/* Feature 3: OCR Correction */}
          <div className="bg-[#FFF8ED]/85 backdrop-blur-md p-8 rounded-3xl flex flex-col gap-4 group hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(60,141,135,0.18)] transition-all duration-300 relative overflow-hidden border border-[#6B315E]/20">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#3C8D87]/10 rounded-full blur-xl group-hover:bg-[#3C8D87]/20 transition-all" />
            <div className="w-12 h-12 rounded-2xl bg-[#EADCC8]/60 flex justify-center items-center text-[#3C8D87] group-hover:bg-[#3C8D87] group-hover:text-[#FFF8ED] transition-colors duration-300 shadow-sm">
              <SpellCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-[#2C2830] font-heading">OCR Correction</h3>
            <p className="text-sm text-[#6F6670] leading-relaxed">
              Context-aware AI fixes common OCR misreadings, ensuring your extracted text is 99.9% accurate.
            </p>
            <div className="mt-auto pt-2 flex items-center gap-1.5 text-xs font-mono font-bold text-[#3C8D87] opacity-80">
              <span>GLYPH_DISAMBIGUATION</span>
            </div>
          </div>

          {/* Feature 4: Export Anywhere */}
          <div className="bg-[#FFF8ED]/85 backdrop-blur-md p-8 rounded-3xl flex flex-col gap-4 group hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(36,22,47,0.18)] transition-all duration-300 relative overflow-hidden border border-[#6B315E]/20">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#24162F]/10 rounded-full blur-xl group-hover:bg-[#24162F]/20 transition-all" />
            <div className="w-12 h-12 rounded-2xl bg-[#EADCC8]/60 flex justify-center items-center text-[#24162F] group-hover:bg-[#24162F] group-hover:text-[#FFF8ED] transition-colors duration-300 shadow-sm">
              <ArrowUpDown className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-[#2C2830] font-heading">Export Anywhere</h3>
            <p className="text-sm text-[#6F6670] leading-relaxed">
              Export your pristine documents instantly to Word, PDF, Excel, or direct API integration.
            </p>
            <div className="mt-auto pt-2 flex items-center gap-1.5 text-xs font-mono font-bold text-[#24162F] opacity-80">
              <span>PDF_DOCX_TXT_SYNC</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="mt-4 z-10">
        <div className="rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden flex flex-col items-center gap-6 border border-[#6B315E]/20 bg-[#FFF8ED]/95 shadow-xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C65D45]/15 rounded-full blur-[90px]" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#3C8D87]/15 rounded-full blur-[90px]" />

          <h2 className="text-3xl sm:text-4xl font-black text-[#24162F] relative z-10 tracking-tight font-heading">
            Ready for Pristine Documents?
          </h2>
          <p className="text-base sm:text-lg text-[#6F6670] max-w-xl relative z-10 font-body">
            Join thousands of professionals relying on DocuClean AI to restore clarity to their workflow.
          </p>

          <Button
            size="lg"
            onClick={() => navigate('/upload')}
            rightIcon={<Rocket className="w-5 h-5 ml-1" />}
            className="relative z-10 mt-2"
          >
            Start Cleaning Now
          </Button>
        </div>
      </section>
    </div>
  );
};
