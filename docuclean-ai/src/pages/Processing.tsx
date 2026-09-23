import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocument } from '../context/DocumentContext';
import { ProcessingScene } from '../components/ProcessingScene';
import { ProgressStepper } from '../components/ProgressStepper';

export const Processing: React.FC = () => {
  const navigate = useNavigate();
  const {
    uploadedFile,
    processingProgress,
    processingStage,
    startProcessingSimulation,
  } = useDocument();

  const startedRef = useRef(false);

  useEffect(() => {
    // If user lands here directly without a file, redirect to upload
    if (!uploadedFile) {
      navigate('/upload');
      return;
    }

    if (!startedRef.current) {
      startedRef.current = true;
      startProcessingSimulation(() => {
        // At 100%, show brief completion then auto-navigate to /preview
        setTimeout(() => {
          navigate('/preview');
        }, 1100);
      });
    }
  }, [uploadedFile, navigate, startProcessingSimulation]);

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto pt-2 pb-12 animate-in fade-in duration-300">
      {/* Stepper */}
      <ProgressStepper />

      {/* Main 3D AI Processing World Scene */}
      <ProcessingScene
        progress={processingProgress}
        stageName={processingStage}
        fileName={uploadedFile?.name}
      />
    </div>
  );
};
