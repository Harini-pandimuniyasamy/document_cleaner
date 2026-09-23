import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { useDocument } from '../context/DocumentContext';
import { TimeSplitPreview } from '../components/TimeSplitPreview';
import { Button } from '../components/Button';
import { ProgressStepper } from '../components/ProgressStepper';

export const Preview: React.FC = () => {
  const navigate = useNavigate();
  const { uploadedFile, processedDocument } = useDocument();

  // Redirect if no document available
  useEffect(() => {
    if (!uploadedFile && !processedDocument) {
      navigate('/upload');
    }
  }, [uploadedFile, processedDocument, navigate]);

  const docTitle =
    processedDocument?.title ||
    uploadedFile?.name ||
    'Uploaded_Document';

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pt-2 pb-12 animate-in fade-in duration-300">
      {/* Progress Stepper */}
      <ProgressStepper />

      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-1 mb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8ED] border border-[#6B315E]/20 text-[#3C8D87] text-xs font-mono font-bold uppercase tracking-wider mb-1 shadow-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#3C8D87]" />
          Volumetric Time Split
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C2830] tracking-tight font-heading">
          Review Cleaned Document
        </h1>
        <p className="text-sm text-[#6F6670]">
          Drag the laser boundary horizontally across the 3D document to witness the real-time AI transformation.
        </p>
      </div>

      {/* 3D Time Split Comparison Preview */}
      <TimeSplitPreview
        fileName={docTitle}
        originalText={processedDocument?.originalText}
        cleanedText={processedDocument?.cleanedText}
        artifactsCount={processedDocument?.artifactsRemoved}
        qualityBefore={processedDocument?.readabilityScoreBefore}
        qualityAfter={processedDocument?.readabilityScoreAfter}
      />

      {/* Required Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#EADCC8]">
        <button
          type="button"
          onClick={() => navigate('/choose-options')}
          className="secondary-btn w-full sm:w-auto h-12 px-6 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Options
        </button>

        <Button
          onClick={() => navigate('/download-options')}
          size="lg"
          rightIcon={<ArrowRight className="w-5 h-5 ml-1" />}
          className="w-full sm:w-auto h-12"
        >
          Next: Choose Export Format
        </Button>
      </div>
    </div>
  );
};
