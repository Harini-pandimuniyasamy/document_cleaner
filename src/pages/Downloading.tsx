import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocument } from '../context/DocumentContext';
import { useAuth } from '../context/AuthContext';
import { downloadCleanedDocument } from '../services/downloadService';
import { saveUserDocument } from '../services/documentStorage';
import { MaterializationAnimation } from '../components/MaterializationAnimation';
import { ProgressStepper } from '../components/ProgressStepper';

export const Downloading: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    uploadedFile,
    processedDocument,
    selectedDownloadFormat,
    triggerDownloadSuccess,
  } = useDocument();

  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStage, setDownloadStage] = useState('Packaging document layers into digital object');
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const stages = [
      { progress: 25, stage: 'Compressing typography matrices into object', delay: 450 },
      { progress: 55, stage: `Morphing format layers into .${selectedDownloadFormat.toUpperCase()}`, delay: 550 },
      { progress: 85, stage: 'Streaming object through volumetric data tunnel', delay: 500 },
      { progress: 100, stage: 'Materializing inside local device storage', delay: 450 },
    ];

    let index = 0;
    const executeNext = () => {
      if (index < stages.length) {
        const item = stages[index];
        setDownloadProgress(item.progress);
        setDownloadStage(item.stage);
        index++;
        setTimeout(executeNext, item.delay);
      } else {
        // Trigger file download
        if (processedDocument) {
          downloadCleanedDocument(
            processedDocument,
            selectedDownloadFormat,
            uploadedFile?.name || `${processedDocument.title}.${selectedDownloadFormat}`
          ).then(() => {
            triggerDownloadSuccess();

            // Record in user document history if logged in
            if (user?.email) {
              saveUserDocument(user.email, {
                fileName: uploadedFile?.name || `${processedDocument.title}.${selectedDownloadFormat}`,
                fileType: selectedDownloadFormat.toUpperCase(),
                fileSize: uploadedFile?.formattedSize || 'Cleaned',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: 'Cleaned',
              });
            }
          }).catch((err) => {
            console.error('Download error:', err);
          });
        }

          setTimeout(() => {
            navigate('/success');
          }, 600);
        }
      };

    executeNext();
  }, [navigate, processedDocument, selectedDownloadFormat, uploadedFile, user]);

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto pt-2 pb-12 items-center text-center animate-in fade-in duration-300 select-none">
      {/* Stepper */}
      <ProgressStepper />

      {/* Main Materialization Animation Through Data Tunnel */}
      <div className="w-full p-6 sm:p-8 rounded-3xl border border-[#6B315E]/20 bg-[#FFF8ED]/95 shadow-2xl flex flex-col items-center relative overflow-hidden preserve-3d">
        <MaterializationAnimation
          format={selectedDownloadFormat}
          progress={downloadProgress}
          stageName={downloadStage}
        />
      </div>
    </div>
  );
};
