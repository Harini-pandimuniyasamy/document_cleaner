import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { UploadCloud, CheckCircle2, Loader2, Sparkles, FileText, ArrowUpCircle } from 'lucide-react';
import { useMouseParallax } from '../hooks/useMouseParallax';
import { DocumentCore } from './DocumentCore';
import { AICharacter, CharacterAction } from './AICharacter';

interface DocumentChamberProps {
  onFileAccepted: (file: File) => void;
  isStagedFile: boolean;
  fileName?: string;
  fileSize?: string;
  onClear?: () => void;
  onValidationError?: (error: string | null) => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'txt'];

export const DocumentChamber: React.FC<DocumentChamberProps> = ({
  onFileAccepted,
  isStagedFile,
  fileName,
  fileSize,
  onClear,
  onValidationError,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [characterAction, setCharacterAction] = useState<CharacterAction>(
    isStagedFile ? 'complete' : 'idle'
  );
  const [chamberStage, setChamberStage] = useState<'IDLE' | 'ENTERING' | 'MATERIALIZING' | 'SCANNING' | 'READY'>(
    isStagedFile ? 'READY' : 'IDLE'
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const parallax = useMouseParallax(10, 0.06);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
    if (!isStagedFile && chamberStage === 'IDLE') {
      setCharacterAction('file_detected');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (!isStagedFile && chamberStage === 'IDLE') {
      setCharacterAction('idle');
    }
  };

  const validateAndProcessFile = (file: File) => {
    setIsDragOver(false);

    // Client-side file size check
    if (file.size > MAX_FILE_SIZE) {
      if (onValidationError) {
        onValidationError('File size exceeds the supported limit');
      }
      setCharacterAction('error');
      setChamberStage('IDLE');
      return;
    }

    // Client-side extension check
    const parts = file.name.split('.');
    const ext = parts.length > 1 ? parts.pop()!.toLowerCase() : '';
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      if (onValidationError) {
        onValidationError('Unsupported document format');
      }
      setCharacterAction('error');
      setChamberStage('IDLE');
      return;
    }

    // Clear any previous validation errors
    if (onValidationError) {
      onValidationError(null);
    }

    // Trigger AI Robot + Chamber Physical Ingestion Choreography
    setCharacterAction('carrying_document');
    setChamberStage('ENTERING');

    // Sequence: CHARACTER CARRIES -> INSERTS INTO CHAMBER -> CHAMBER SCANS -> MATERIALIZES -> READY
    setTimeout(() => {
      setCharacterAction('inserting_chamber');
      setChamberStage('MATERIALIZING');

      setTimeout(() => {
        setCharacterAction('worker_reading');
        setChamberStage('SCANNING');

        setTimeout(() => {
          setCharacterAction('complete');
          setChamberStage('READY');
          onFileAccepted(file);
        }, 1100);
      }, 850);
    }, 750);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleManualSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const triggerBrowse = () => {
    inputRef.current?.click();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative w-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-4 p-2 sm:p-4 select-none preserve-3d"
      style={{ perspective: '1100px' }}
    >
      {/* Real accessible HTML5 file input */}
      <input
        ref={inputRef}
        id="document-chamber-file-input"
        type="file"
        accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
        onChange={handleManualSelect}
        className="sr-only"
        aria-label="Upload document: click to browse or drag and drop files"
      />

      {/* ========================================================================= */}
      {/* 1. TOP: 3D AI ASSISTANT CHARACTER COMPANION                              */}
      {/* ========================================================================= */}
      <div className="flex flex-col items-center justify-center animate-in fade-in duration-400 z-20">
        <AICharacter
          action={characterAction}
          size="md"
          hasDocument={chamberStage === 'ENTERING' || isStagedFile}
        />
        <div className="mt-2 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8ED]/90 border border-[#6B315E]/20 text-[11px] font-mono text-[#6F6670] shadow-xs backdrop-blur-sm">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                chamberStage === 'SCANNING' || chamberStage === 'ENTERING'
                  ? 'bg-[#C65D45] animate-ping'
                  : isStagedFile || chamberStage === 'READY'
                  ? 'bg-[#3C8D87]'
                  : 'bg-[#6B315E]'
              }`}
            />
            <span className="font-semibold">
              {characterAction === 'idle' && 'Docu-Bot: Monitoring Chamber'}
              {characterAction === 'file_detected' && 'Docu-Bot: Target File Detected'}
              {characterAction === 'carrying_document' && 'Docu-Bot: Transporting Document'}
              {characterAction === 'inserting_chamber' && 'Docu-Bot: Ingesting into Chamber'}
              {characterAction === 'worker_reading' && 'Docu-Bot: Optical Calibration'}
              {characterAction === 'complete' && 'Docu-Bot: Materialization Ready'}
              {characterAction === 'error' && 'Docu-Bot: Inspection Alert'}
            </span>
          </div>
        </div>

        {/* Optical Sensor Conduit Beam pointing from Bot toward Chamber */}
        <div className="w-[1.5px] h-4 bg-gradient-to-b from-[#6B315E]/40 via-[#C65D45]/40 to-[#3C8D87]/40 my-0.5" />
      </div>

      {/* ========================================================================= */}
      {/* 2. MIDDLE: 3D ENTRY CHAMBER FRAME                                        */}
      {/* ========================================================================= */}
      <div
        className={`relative w-full min-h-[300px] sm:min-h-[340px] rounded-3xl transition-all duration-500 flex flex-col items-center justify-center preserve-3d p-4 sm:p-6 ${
          isDragOver
            ? 'bg-[#FFF8ED]/95 border-2 border-[#E98268] shadow-[0_0_50px_rgba(233,130,104,0.35),0_20px_40px_rgba(36,22,47,0.15)] scale-[1.01]'
            : isStagedFile || chamberStage === 'READY'
            ? 'bg-[#FFF8ED]/90 border border-[#A8D5C2] shadow-xl'
            : 'bg-[#FFF8ED]/75 border-2 border-dashed border-[#6B315E]/30 hover:border-[#C65D45] hover:bg-[#FFF8ED]/90 shadow-lg'
        }`}
        style={{
          transform: `rotateX(${parallax.rotateX * 0.6}deg) rotateY(${parallax.rotateY * 0.6}deg)`,
        }}
      >
        {/* FOUR EXPANDABLE FUTURISTIC 3D SCANNING CORNERS */}
        <motion.div
          animate={{
            x: isDragOver ? -8 : 0,
            y: isDragOver ? -8 : 0,
            scale: isDragOver ? 1.15 : 1,
          }}
          className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 rounded-tl-xl pointer-events-none transition-colors duration-300"
          style={{ borderColor: isDragOver ? '#E98268' : '#6B315E' }}
        />
        <motion.div
          animate={{
            x: isDragOver ? 8 : 0,
            y: isDragOver ? -8 : 0,
            scale: isDragOver ? 1.15 : 1,
          }}
          className="absolute -top-3 -right-3 w-8 h-8 border-t-4 border-r-4 rounded-tr-xl pointer-events-none transition-colors duration-300"
          style={{ borderColor: isDragOver ? '#E98268' : '#6B315E' }}
        />
        <motion.div
          animate={{
            x: isDragOver ? -8 : 0,
            y: isDragOver ? 8 : 0,
            scale: isDragOver ? 1.15 : 1,
          }}
          className="absolute -bottom-3 -left-3 w-8 h-8 border-b-4 border-l-4 rounded-bl-xl pointer-events-none transition-colors duration-300"
          style={{ borderColor: isDragOver ? '#E98268' : '#6B315E' }}
        />
        <motion.div
          animate={{
            x: isDragOver ? 8 : 0,
            y: isDragOver ? 8 : 0,
            scale: isDragOver ? 1.15 : 1,
          }}
          className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 rounded-br-xl pointer-events-none transition-colors duration-300"
          style={{ borderColor: isDragOver ? '#E98268' : '#6B315E' }}
        />

        {/* ========================================================================= */}
        {/* STATE A: IDLE DROP-ZONE & UPLOAD DOCUMENT CTA                             */}
        {/* ========================================================================= */}
        {chamberStage === 'IDLE' && !isStagedFile && (
          <div
            id="chamber-upload-dropzone"
            onClick={triggerBrowse}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerBrowse();
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Upload Document: click to browse or drag and drop your document"
            className="w-full flex flex-col items-center text-center p-4 sm:p-6 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3C8D87] rounded-2xl transition-all duration-200 group"
          >
            {/* 3D Blueprint Document Wireframe & Animated Upload Icon */}
            <div
              className={`w-24 h-28 sm:w-28 sm:h-32 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center mb-4 relative shadow-sm group-hover:scale-105 ${
                isDragOver
                  ? 'border-[#E98268] bg-[#E98268]/15 shadow-[0_0_30px_rgba(233,130,104,0.3)]'
                  : 'border-dashed border-[#6B315E]/30 bg-[#EADCC8]/40 group-hover:border-[#C65D45] group-hover:bg-[#EADCC8]/60'
              }`}
            >
              <UploadCloud
                className={`w-10 h-10 transition-all duration-300 ${
                  isDragOver
                    ? 'text-[#C65D45] scale-115 animate-bounce'
                    : 'text-[#6B315E] group-hover:text-[#C65D45] group-hover:-translate-y-1'
                }`}
              />
              <span className="text-[9px] font-mono font-bold text-[#3C8D87] mt-1.5 uppercase tracking-wider">
                {isDragOver ? 'DROP TO INGEST' : 'CHAMBER READY'}
              </span>
            </div>

            {/* Clear, Clickable Interactive Headline & Subtitle */}
            <h2 className="text-xl sm:text-2xl font-black text-[#24162F] mb-1 tracking-tight font-heading group-hover:text-[#6B315E] transition-colors">
              UPLOAD DOCUMENT
            </h2>
            <p className="text-xs sm:text-sm text-[#6F6670] max-w-sm mb-4 leading-relaxed font-body">
              <span className="font-semibold text-[#2C2830]">Click to browse</span> or drag &amp; drop
            </p>

            {/* Tactile Action Button Inside Dropzone */}
            <div className="mb-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#24162F] via-[#6B315E] to-[#C65D45] text-[#FFF8ED] text-xs font-bold shadow-md group-hover:shadow-lg group-hover:scale-[1.02] active:scale-[0.98] transition-all">
              <ArrowUpCircle className="w-4 h-4 text-[#A8D5C2]" />
              <span>Select Document</span>
            </div>

            {/* Supported Document Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#FFF8ED] border border-[#6B315E]/20 text-[#6B315E]">
                PDF
              </span>
              <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#FFF8ED] border border-[#6B315E]/20 text-[#6B315E]">
                DOC
              </span>
              <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#FFF8ED] border border-[#6B315E]/20 text-[#6B315E]">
                DOCX
              </span>
              <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#FFF8ED] border border-[#6B315E]/20 text-[#6B315E]">
                TXT
              </span>
              <span className="text-[11px] text-[#978D91] font-semibold ml-1">
                • Max 50MB
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATE B: MATERIALIZING / SCANNING SEQUENCE                                */}
        {/* ========================================================================= */}
        {(chamberStage === 'ENTERING' ||
          chamberStage === 'MATERIALIZING' ||
          chamberStage === 'SCANNING') && (
          <div className="flex flex-col items-center text-center p-6 animate-in fade-in">
            <div className="relative w-36 h-48 mb-4 preserve-3d">
              <div className="absolute inset-0 rounded-2xl bg-[#FFF8ED] border-2 border-[#3C8D87] shadow-[0_0_35px_rgba(60,141,135,0.35)] flex flex-col items-center justify-center p-4">
                <Loader2 className="w-8 h-8 text-[#C65D45] animate-spin mb-2" />
                <span className="text-[10px] font-mono font-bold text-[#24162F] uppercase">
                  {chamberStage === 'ENTERING' && 'RECEIVING DOCUMENT...'}
                  {chamberStage === 'MATERIALIZING' && 'STRUCTURING MATRIX...'}
                  {chamberStage === 'SCANNING' && 'VOLUMETRIC OPTICAL SCAN...'}
                </span>
                <span className="text-[9px] font-mono text-[#3C8D87] mt-1">
                  OPTICAL SENSORS ACTIVE
                </span>
              </div>
              {chamberStage === 'SCANNING' && (
                <div className="absolute inset-x-0 h-1 bg-[#3C8D87] shadow-[0_0_15px_#3C8D87] animate-scan-3d" />
              )}
            </div>
            <span className="text-xs font-mono font-bold text-[#C65D45]">
              AI CHAMBER: CALIBRATING GEOMETRY &amp; OCR
            </span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATE C: STAGED & READY STATE                                             */}
        {/* ========================================================================= */}
        {(chamberStage === 'READY' || isStagedFile) && (
          <div className="flex flex-col items-center text-center p-4 sm:p-6 animate-in zoom-in-95 duration-300 w-full">
            {/* 3D Mini Document Preview Core */}
            <div className="scale-75 sm:scale-90 mb-[-25px]">
              <DocumentCore
                title={fileName || 'Quarterly_Audit_Report_2024.pdf'}
                customWidth="w-[280px]"
                customHeight="h-[360px]"
                separationFactor={0.1}
                showOCRBoxes={true}
              />
            </div>

            {/* Staged File Details Card */}
            <div className="w-full max-w-md mt-6 p-3.5 rounded-2xl bg-[#FFF8ED] border border-[#3C8D87]/40 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-8 h-8 rounded-lg bg-[#A8D5C2]/30 flex items-center justify-center flex-shrink-0 text-[#3C8D87]">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-left truncate">
                  <span className="text-xs font-bold text-[#24162F] block truncate">
                    {fileName || 'Quarterly_Audit_Report_2024.pdf'}
                  </span>
                  <span className="text-[10px] font-mono text-[#6F6670]">
                    {fileSize || '2.45 MB'} • Ingestion Verified
                  </span>
                </div>
              </div>

              {onClear && (
                <button
                  onClick={onClear}
                  type="button"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#6B315E] hover:text-[#C65D45] hover:bg-[#EADCC8]/50 transition-colors flex-shrink-0 cursor-pointer"
                >
                  Change File
                </button>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs font-bold text-[#3C8D87]">
              <CheckCircle2 className="w-4 h-4 text-[#3C8D87]" />
              <span>Document Positioned &amp; Ready for Optimization</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
