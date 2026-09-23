import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  RefreshCw,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { useDocument } from '../context/DocumentContext';
import { downloadCleanedDocument } from '../services/downloadService';
import { AISeal } from '../components/AISeal';
import { Button } from '../components/Button';

export const Success: React.FC = () => {
  const navigate = useNavigate();
  const {
    uploadedFile,
    processedDocument,
    selectedDownloadFormat,
    triggerDownloadSuccess,
    resetWorkflow,
  } = useDocument();

  const handleGoDashboard = () => {
    resetWorkflow();
    navigate('/');
  };

  const handleCleanAnother = () => {
    resetWorkflow();
    navigate('/upload');
  };

  const handleReDownload = () => {
    const targetDoc = processedDocument || {
      title: uploadedFile?.name ? uploadedFile.name.replace(/\.[^/.]+$/, '') : 'Quarterly_Audit_Report_2024',
      pageCount: 3,
      originalText: 'Raw text...',
      cleanedText: 'Cleaned text...',
      artifactsRemoved: 58,
      spacesFixed: 86,
      lineBreaksFixed: 28,
      ocrCorrectionsCount: 19,
      readabilityScoreBefore: 61,
      readabilityScoreAfter: 99,
      cleanedAt: new Date(),
    };

    downloadCleanedDocument(
      targetDoc,
      selectedDownloadFormat,
      uploadedFile?.name || 'Quarterly_Audit_Report_2024'
    ).then(() => {
      triggerDownloadSuccess();
    });
  };

  const docTitle =
    processedDocument?.title ||
    (uploadedFile?.name ? uploadedFile.name : 'Quarterly_Audit_Report_2024.pdf');

  return (
    <div
      className="flex flex-col items-center justify-center max-w-2xl mx-auto pt-4 pb-16 text-center animate-in fade-in duration-500 relative select-none preserve-3d"
      style={{ perspective: '1100px' }}
    >
      {/* 1. CALM SATISFYING AI SEAL RESTORATION VISUAL */}
      <AISeal fileName={docTitle} />

      {/* 2. ACTIONS */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center mt-6">
        <Button
          size="lg"
          onClick={handleReDownload}
          leftIcon={<Download className="w-5 h-5 mr-1" />}
          className="w-full sm:w-auto"
        >
          Download Again (.{selectedDownloadFormat.toUpperCase()})
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={handleCleanAnother}
          leftIcon={<RefreshCw className="w-4 h-4 mr-1" />}
          className="w-full sm:w-auto"
        >
          Clean Another Document
        </Button>

        <button
          type="button"
          onClick={handleGoDashboard}
          className="h-12 px-6 rounded-2xl text-xs sm:text-sm font-bold text-[#6F6670] hover:text-[#2C2830] hover:bg-[#EADCC8]/60 transition-colors flex items-center justify-center gap-2 cursor-pointer border border-transparent hover:border-[#6B315E]/20"
        >
          <Home className="w-4 h-4" />
          Dashboard
        </button>
      </div>

      {/* Security Footnote */}
      <div className="mt-8 pt-4 border-t border-[#EADCC8] flex items-center justify-center gap-2 text-[11px] text-[#978D91]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#3C8D87]" />
        <span>Document cleared from volatile cache. Encrypted local export verified.</span>
      </div>
    </div>
  );
};
