import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Sparkles,
  Layers,
  Wand2,
  Cpu,
} from 'lucide-react';
import { useDocument } from '../context/DocumentContext';
import { AIToolbox, TOOLBOX_MODULES } from '../components/AIToolbox';
import { AIPipeline } from '../components/AIPipeline';
import { Button } from '../components/Button';
import { ProgressStepper } from '../components/ProgressStepper';

export const ChooseOptions: React.FC = () => {
  const navigate = useNavigate();
  const {
    uploadedFile,
    selectedOptions,
    toggleOption,
    setSelectedOptions,
  } = useDocument();

  const [isPreparing, setIsPreparing] = useState(false);

  // If no file uploaded, redirect gracefully to /upload
  useEffect(() => {
    if (!uploadedFile) {
      navigate('/upload');
    }
  }, [uploadedFile, navigate]);

  const handleSelectAll = () => {
    setSelectedOptions(TOOLBOX_MODULES.map((opt) => opt.id));
  };

  const handleClearAll = () => {
    setSelectedOptions([]);
  };

  const handleConfirmAndProcess = () => {
    setIsPreparing(true);
    // Short preparation transition per approved UI specification
    setTimeout(() => {
      navigate('/processing');
    }, 650);
  };

  if (!uploadedFile) return null;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pt-2 pb-12 animate-in fade-in duration-300">
      {/* Progress Stepper */}
      <ProgressStepper />

      {/* Top File Summary Banner */}
      <div className="p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFF8ED]/90 border border-[#6B315E]/20 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#24162F] to-[#6B315E] text-[#FFF8ED] flex items-center justify-center font-bold shadow-md">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#2C2830] truncate max-w-sm font-heading">
              {uploadedFile.name}
            </h3>
            <p className="text-xs text-[#6F6670]">
              {uploadedFile.formattedSize} • {uploadedFile.extension.toUpperCase()} • Staged in Chamber
            </p>
          </div>
        </div>

        {/* Quick Batch Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSelectAll}
            className="px-3.5 py-1.5 rounded-lg bg-[#FFF8ED] hover:bg-[#EADCC8]/50 border border-[#6B315E]/30 text-xs font-bold text-[#6B315E] transition-all cursor-pointer shadow-xs"
          >
            Engage All
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="px-3.5 py-1.5 rounded-lg bg-[#FFF8ED] hover:bg-[#EADCC8]/50 border border-[#978D91]/30 text-xs font-semibold text-[#6F6670] transition-all cursor-pointer shadow-xs"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Title & Instructions */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8ED] border border-[#6B315E]/20 text-[#3C8D87] text-xs font-mono font-bold uppercase tracking-wider mb-2 shadow-xs">
          <Cpu className="w-3.5 h-3.5 text-[#3C8D87]" />
          Interactive AI Toolbox
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C2830] tracking-tight mb-2 font-heading">
          Choose Cleaning Options
        </h1>
        <p className="text-sm text-[#6F6670]">
          Select AI restoration modules to assemble your document cleaning pipeline. Each module previews its physical transformation.
        </p>
      </div>

      {/* DYNAMIC VISUAL PIPELINE */}
      <AIPipeline selectedOptions={selectedOptions} />

      {/* INTERACTIVE AI TOOLBOX GRID */}
      <AIToolbox
        selectedOptions={selectedOptions}
        onToggle={toggleOption}
      />

      {/* Bottom Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#EADCC8]">
        <button
          type="button"
          onClick={() => navigate('/upload')}
          disabled={isPreparing}
          className="secondary-btn w-full sm:w-auto h-12 px-6 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Upload
        </button>

        <Button
          onClick={handleConfirmAndProcess}
          size="lg"
          isLoading={isPreparing}
          rightIcon={<ArrowRight className="w-5 h-5 ml-1" />}
          className="w-full sm:w-auto h-12"
        >
          {isPreparing ? 'Synthesizing Pipeline...' : 'Confirm & Process Document →'}
        </Button>
      </div>
    </div>
  );
};
