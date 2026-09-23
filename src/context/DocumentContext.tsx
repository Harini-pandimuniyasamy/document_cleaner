import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { DocumentContextType, DownloadFormat, ProcessedDocumentData, UploadedFileInfo } from '../types';
import { processDocument, PROCESSING_STEPS } from '../services/documentService';

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'txt', 'png', 'jpg', 'jpeg'];

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [uploadedFile, setUploadedFileState] = useState<UploadedFileInfo | null>(null);

  const [selectedOptions, setSelectedOptions] = useState<string[]>(() => {
    const saved = sessionStorage.getItem('docclean_options');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ['remove-spaces', 'fix-line-breaks', 'correct-ocr'];
      }
    }
    return ['remove-spaces', 'fix-line-breaks', 'correct-ocr'];
  });

  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [processingStage, setProcessingStage] = useState<string>('Ready');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedDownloadFormat, setSelectedDownloadFormat] = useState<DownloadFormat>('pdf');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState<boolean>(false);
  const downloadTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerDownloadSuccess = () => {
    if (downloadTimerRef.current) {
      clearTimeout(downloadTimerRef.current);
    }
    setShowDownloadSuccess(true);
    downloadTimerRef.current = setTimeout(() => {
      setShowDownloadSuccess(false);
    }, 1800);
  };

  const [processedDocument, setProcessedDocument] = useState<ProcessedDocumentData | null>(() => {
    const saved = sessionStorage.getItem('docclean_processed');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Clear any legacy docclean_file from sessionStorage
  useEffect(() => {
    sessionStorage.removeItem('docclean_file');
  }, []);

  useEffect(() => {
    sessionStorage.setItem('docclean_options', JSON.stringify(selectedOptions));
  }, [selectedOptions]);

  useEffect(() => {
    if (processedDocument) {
      sessionStorage.setItem('docclean_processed', JSON.stringify(processedDocument));
    } else {
      sessionStorage.removeItem('docclean_processed');
    }
  }, [processedDocument]);

  const setUploadedFile = (file: File | null): boolean => {
    setUploadError(null);
    if (!file) {
      setUploadedFileState(null);
      return false;
    }

    // Size validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError('File size exceeds the supported limit');
      return false;
    }

    // Extension validation
    const parts = file.name.split('.');
    const ext = parts.length > 1 ? parts.pop()!.toLowerCase() : '';

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setUploadError('Unsupported document format');
      return false;
    }

    // Format size
    const sizeInKb = file.size / 1024;
    const formattedSize =
      sizeInKb >= 1024
        ? `${(sizeInKb / 1024).toFixed(2)} MB`
        : `${Math.round(sizeInKb)} KB`;

    const fileInfo: UploadedFileInfo = {
      name: file.name,
      size: file.size,
      formattedSize,
      type: file.type || `application/${ext}`,
      extension: ext,
      rawFile: file,
      uploadedAt: new Date(),
    };

    setUploadedFileState(fileInfo);
    setUploadError(null);
    return true;
  };

  const removeUploadedFile = () => {
    setUploadedFileState(null);
    setUploadError(null);
    setProcessedDocument(null);
    setProcessingProgress(0);
    setProcessingStage('Ready');
    sessionStorage.removeItem('docclean_file');
    sessionStorage.removeItem('docclean_processed');
  };

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const startProcessingSimulation = (onComplete?: () => void) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setUploadError(null);
    setProcessingProgress(15);
    setProcessingStage(PROCESSING_STEPS[0].label);

    if (!uploadedFile) {
      setIsProcessing(false);
      setUploadError('No document file was detected. Please upload a document to proceed.');
      return;
    }

    const steps = [
      { progress: 30, stage: PROCESSING_STEPS[0].label, duration: 500 },
      { progress: 50, stage: PROCESSING_STEPS[1].label, duration: 800 },
      { progress: 75, stage: PROCESSING_STEPS[2].label, duration: 1000 },
      { progress: 90, stage: PROCESSING_STEPS[3].label, duration: 800 },
      { progress: 96, stage: PROCESSING_STEPS[4].label, duration: 500 },
    ];

    let currentStep = 0;
    let timerId: any = null;

    const advanceProgress = () => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        setProcessingProgress(step.progress);
        setProcessingStage(step.stage);
        currentStep++;
        timerId = setTimeout(advanceProgress, step.duration);
      }
    };

    advanceProgress();

    // Trigger real API upload and AI cleaning pipeline immediately
    processDocument(uploadedFile, selectedOptions)
      .then((result) => {
        if (timerId) clearTimeout(timerId);
        setProcessingProgress(100);
        setProcessingStage('Document cleaned and restored successfully.');
        setProcessedDocument(result);
        setIsProcessing(false);
        if (onComplete) {
          onComplete();
        }
      })
      .catch((err: any) => {
        if (timerId) clearTimeout(timerId);
        console.error('Document processing error:', err);
        setUploadError(err.message || 'Document cleaning failed. Please verify your file.');
        setProcessingStage('Processing failed');
        setIsProcessing(false);
      });
  };

  const resetWorkflow = () => {
    setUploadedFileState(null);
    setProcessedDocument(null);
    setProcessingProgress(0);
    setProcessingStage('Ready');
    setSelectedDownloadFormat('pdf');
    setUploadError(null);
    sessionStorage.clear();
  };

  return (
    <DocumentContext.Provider
      value={{
        uploadedFile,
        selectedOptions,
        processingProgress,
        processingStage,
        selectedDownloadFormat,
        processedDocument,
        isProcessing,
        uploadError,
        showDownloadSuccess,
        triggerDownloadSuccess,
        setUploadedFile,
        removeUploadedFile,
        toggleOption,
        setSelectedOptions,
        setSelectedDownloadFormat,
        startProcessingSimulation,
        resetWorkflow,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};
