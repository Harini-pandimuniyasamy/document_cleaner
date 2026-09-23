import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { useDocument } from '../context/DocumentContext';
import { DocumentChamber } from '../components/DocumentChamber';
import { Button } from '../components/Button';
import { ProgressStepper } from '../components/ProgressStepper';

export const Upload: React.FC = () => {
  const navigate = useNavigate();
  const { uploadedFile, uploadError, setUploadedFile, removeUploadedFile } = useDocument();
  const [localValidationMessage, setLocalValidationMessage] = useState<string | null>(null);

  const handleFileAccepted = (file: File) => {
    setLocalValidationMessage(null);
    setUploadedFile(file);
  };

  const handleNext = () => {
    if (!uploadedFile) {
      setLocalValidationMessage('Please introduce a document into the chamber first.');
      return;
    }
    setLocalValidationMessage(null);
    navigate('/choose-options');
  };

  const loadSampleDocument = () => {
    const sampleContent = 'DOCUCLEAN SAMPLE DOCUMENT - QUARTERLY AUDIT';
    const blob = new Blob([sampleContent], { type: 'application/pdf' });
    const sampleFile = new File([blob], 'Quarterly_Audit_Report_2024.pdf', {
      type: 'application/pdf',
      lastModified: Date.now(),
    });
    setLocalValidationMessage(null);
    setUploadedFile(sampleFile);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pt-2 pb-12 animate-in fade-in duration-300">
      {/* Progress Stepper */}
      <ProgressStepper />

      {/* Page Title & Intro */}
      <div className="text-center max-w-xl mx-auto space-y-2 mb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8ED] border border-[#6B315E]/20 text-[#3C8D87] text-xs font-mono font-bold uppercase tracking-wider shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#3C8D87] animate-pulse" />
          Document Entry Chamber
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C2830] tracking-tight font-heading">
          Ingest Document Into Machine
        </h1>
        <p className="text-sm text-[#6F6670]">
          Position your document inside the chamber. Docu-Bot and optical sensors will scan and materialize your file in real time.
        </p>
      </div>

      {/* 3D Scanning Chamber */}
      <DocumentChamber
        onFileAccepted={handleFileAccepted}
        isStagedFile={!!uploadedFile}
        fileName={uploadedFile?.name}
        fileSize={uploadedFile?.formattedSize}
        onClear={removeUploadedFile}
        onValidationError={setLocalValidationMessage}
      />

      {/* Sample Document Demo Ingestion */}
      {!uploadedFile && (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-[#FFF8ED]/85 border border-[#6B315E]/20 text-xs text-[#2C2830] gap-3 max-w-xl mx-auto w-full shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C65D45] flex-shrink-0" />
            <span>Don&apos;t have a file ready? Materialize our sample audit report into the chamber.</span>
          </div>
          <button
            type="button"
            onClick={loadSampleDocument}
            className="secondary-btn px-4 py-2 rounded-xl font-bold text-xs flex-shrink-0 cursor-pointer shadow-xs hover:bg-[#FFF8ED]"
          >
            Materialize Sample
          </button>
        </div>
      )}

      {/* Local Validation Error Banner */}
      {(localValidationMessage || uploadError) && (
        <div className="p-3.5 rounded-2xl bg-[#FFF8ED] border border-[#E98268]/60 flex items-center justify-center gap-2.5 text-[#C65D45] text-xs sm:text-sm font-bold shadow-xs animate-in fade-in duration-200 max-w-xl mx-auto w-full text-center">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#C65D45]" />
          <span>{localValidationMessage || uploadError}</span>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#EADCC8] max-w-xl mx-auto w-full">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="secondary-btn w-full sm:w-auto h-11 px-5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <Button
          onClick={handleNext}
          rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
          size="md"
          className="w-full sm:w-auto h-11"
        >
          Next: Choose Options
        </Button>
      </div>
    </div>
  );
};
