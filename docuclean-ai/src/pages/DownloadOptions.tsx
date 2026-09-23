import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Sparkles, FileCheck, CheckCircle2 } from 'lucide-react';
import { useDocument } from '../context/DocumentContext';
import { DownloadCard } from '../components/DownloadCard';
import { Button } from '../components/Button';
import { ProgressStepper } from '../components/ProgressStepper';

export const DownloadOptions: React.FC = () => {
  const navigate = useNavigate();
  const {
    uploadedFile,
    selectedDownloadFormat,
    setSelectedDownloadFormat,
    processedDocument,
  } = useDocument();

  const handleStartDownload = () => {
    navigate('/downloading');
  };

  const docTitle = processedDocument?.title || uploadedFile?.name || 'Quarterly_Audit_Report_2024';

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pt-2 pb-12 animate-in fade-in duration-300">
      {/* Stepper */}
      <ProgressStepper />

      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2 mb-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A8D5C2]/25 border border-[#3C8D87]/40 text-[#3C8D87] text-xs font-bold shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Restoration Approved &amp; Ready</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C2830] tracking-tight font-heading">
          Select Download Format
        </h1>
        <p className="text-sm text-[#6F6670]">
          Choose your target output format. All formatting, structural boundaries, and typography are optimized for the selected file type.
        </p>
      </div>

      {/* Target Document Header Banner */}
      <div className="p-4 rounded-2xl flex items-center justify-between border border-[#6B315E]/20 bg-[#FFF8ED]/90 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#24162F] to-[#6B315E] text-[#FFF8ED] flex items-center justify-center font-bold">
            <FileCheck className="w-5 h-5 text-[#FFF8ED]" />
          </div>
          <div>
            <span className="text-xs text-[#978D91] block font-semibold">Document:</span>
            <span className="text-sm font-bold text-[#2C2830] font-heading">{docTitle}</span>
          </div>
        </div>

        <div className="text-xs font-bold text-[#C65D45] bg-[#C65D45]/10 px-3 py-1.5 rounded-xl border border-[#C65D45]/25">
          Target: <span className="uppercase font-mono">{selectedDownloadFormat}</span>
        </div>
      </div>

      {/* Format Selection Cards (PDF, DOCX, TXT) */}
      <DownloadCard
        selectedFormat={selectedDownloadFormat}
        onSelectFormat={setSelectedDownloadFormat}
      />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#EADCC8]">
        <button
          type="button"
          onClick={() => navigate('/preview')}
          className="secondary-btn w-full sm:w-auto h-12 px-6 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Preview
        </button>

        <Button
          onClick={handleStartDownload}
          size="lg"
          rightIcon={<Download className="w-5 h-5 ml-1 animate-bounce" />}
          className="w-full sm:w-auto h-12"
        >
          Download
        </Button>
      </div>
    </div>
  );
};
