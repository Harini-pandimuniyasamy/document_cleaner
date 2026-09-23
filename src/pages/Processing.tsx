import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useDocument } from '../context/DocumentContext';
import { ProcessingScene } from '../components/ProcessingScene';
import { ProgressStepper } from '../components/ProgressStepper';
import { Button } from '../components/Button';

export const Processing: React.FC = () => {
  const navigate = useNavigate();
  const {
    uploadedFile,
    processingProgress,
    processingStage,
    uploadError,
    startProcessingSimulation,
  } = useDocument();

  const startedRef = useRef(false);

  useEffect(() => {
    // If user lands here directly without a file, redirect to upload
    if (!uploadedFile) {
      navigate('/upload');
      return;
    }

    if (!startedRef.current && !uploadError) {
      startedRef.current = true;
      startProcessingSimulation(() => {
        // At 100%, show brief completion then auto-navigate to /preview
        setTimeout(() => {
          navigate('/preview');
        }, 1100);
      });
    }
  }, [uploadedFile, uploadError, navigate, startProcessingSimulation]);

  const handleRetry = () => {
    startedRef.current = false;
    startProcessingSimulation(() => {
      setTimeout(() => {
        navigate('/preview');
      }, 1100);
    });
  };

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto pt-2 pb-12 animate-in fade-in duration-300">
      {/* Stepper */}
      <ProgressStepper />

      {uploadError ? (
        <div className="bg-[#FFF8ED] border-2 border-red-200 rounded-3xl p-8 max-w-xl mx-auto text-center space-y-5 shadow-md">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shadow-xs">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#2C2830] font-heading">
              Document Restoration Alert
            </h2>
            <p className="text-sm text-[#6F6670] leading-relaxed">
              {uploadError}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => navigate('/upload')}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Chamber
            </Button>
            <Button
              variant="primary"
              onClick={handleRetry}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Retry Cleaning
            </Button>
          </div>
        </div>
      ) : (
        /* Main 3D AI Processing World Scene */
        <ProcessingScene
          progress={processingProgress}
          stageName={processingStage}
          fileName={uploadedFile?.name}
        />
      )}
    </div>
  );
};

