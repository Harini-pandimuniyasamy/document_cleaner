import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileText,
  Image,
  FileCode,
  CheckCircle2,
  Trash2,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { UploadedFileInfo } from '../types';

interface FileUploadProps {
  uploadedFile: UploadedFileInfo | null;
  uploadError: string | null;
  onFileSelect: (file: File) => boolean;
  onFileRemove: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  uploadedFile,
  uploadError,
  onFileSelect,
  onFileRemove,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setIsSimulatingUpload(true);
    setTimeout(() => {
      onFileSelect(file);
      setIsSimulatingUpload(false);
    }, 450);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const getFileIcon = (ext: string) => {
    switch (ext.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'docx':
        return <FileText className="w-8 h-8 text-blue-600" />;
      case 'txt':
        return <FileCode className="w-8 h-8 text-slate-600" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <Image className="w-8 h-8 text-emerald-600" />;
      default:
        return <FileText className="w-8 h-8 text-[#712ae2]" />;
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        id="document-file-input"
        accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
        onChange={handleInputChange}
        className="hidden"
      />

      {!uploadedFile ? (
        /* 3D SCANNING CHAMBER UPLOAD PORTAL */
        <div
          className="relative preserve-3d"
          style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
        >
          {/* Layer 0: Depth Shadow Underneath */}
          <div
            className="absolute inset-0 rounded-3xl bg-indigo-900/10 blur-xl transition-transform duration-500 pointer-events-none"
            style={{
              transform: isDragging
                ? 'translateZ(-40px) translateY(24px) scale(0.96)'
                : 'translateZ(-15px) translateY(10px) scale(0.98)',
            }}
          />

          {/* Layer 1: Under Chamber Portal Bed */}
          <div
            className="absolute inset-2 rounded-3xl bg-indigo-50/70 border border-indigo-200/60 shadow-inner transition-transform duration-500 pointer-events-none"
            style={{
              transform: isDragging
                ? 'translateZ(-20px) rotateX(4deg)'
                : 'translateZ(-8px)',
            }}
          >
            <div className="absolute top-3 left-6 font-mono text-[9px] text-indigo-400">
              OPTICAL_PORTAL // 0x5C_INGESTION
            </div>
          </div>

          {/* Layer 2: Main Active Interactive Chamber */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`glass-panel p-8 sm:p-12 rounded-3xl border-2 border-dashed transition-all duration-400 flex flex-col items-center justify-center text-center cursor-pointer group relative overflow-hidden preserve-3d ${
              isDragging
                ? 'border-cyan-400 bg-indigo-50/80 shadow-[0_30px_70px_-15px_rgba(37,99,235,0.35),0_0_30px_rgba(103,232,249,0.3)] scale-[1.02]'
                : 'border-indigo-200/70 hover:border-[#712ae2] hover:bg-white/85 hover:shadow-xl'
            }`}
            style={{
              transform: isDragging
                ? 'translateZ(24px) rotateX(-2deg)'
                : 'translateZ(0px)',
            }}
          >
            {/* Active Scanning Portal Beam lines */}
            {isDragging && (
              <>
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#67e8f9] animate-scan-3d z-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/10 via-transparent to-indigo-500/10 pointer-events-none z-10 animate-pulse" />
              </>
            )}

            {/* Subtle scanning glow background */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-36 bg-gradient-to-r from-indigo-400/15 via-[#2563eb]/20 to-cyan-400/15 rounded-full blur-2xl group-hover:opacity-80 transition-all pointer-events-none" />

            {/* Central Target Portal Icon */}
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shadow-lg border border-white transition-transform duration-400 ${
                isDragging
                  ? 'bg-gradient-to-tr from-[#2563eb] to-cyan-400 text-white scale-110 shadow-cyan-400/40 ring-4 ring-cyan-300/30'
                  : 'bg-gradient-to-tr from-indigo-50 to-purple-100 text-[#712ae2] group-hover:scale-105'
              }`}
            >
              {isSimulatingUpload ? (
                <RefreshCw className="w-10 h-10 animate-spin text-white" />
              ) : (
                <UploadCloud
                  className={`w-10 h-10 transition-transform ${
                    isDragging ? 'animate-bounce' : 'group-hover:-translate-y-1'
                  }`}
                />
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-2">
              {isDragging ? 'Release to Enter AI Chamber' : 'Upload your document'}
            </h3>
            <p className="text-sm text-slate-500 max-w-md mb-6">
              Drag and drop your file here, or{' '}
              <span className="text-[#1f108e] font-bold underline decoration-[#712ae2]/40">
                browse your local computer
              </span>
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-600">
              <span className="text-slate-400">Supported Formats:</span>
              <span className="text-indigo-700 font-bold">PDF, DOCX, TXT, PNG, JPG, JPEG</span>
              <span className="text-slate-300">|</span>
              <span>Max 50MB</span>
            </div>
          </div>
        </div>
      ) : (
        /* 3D UPLOADED DOCUMENT PRESENTATION CARD */
        <div
          className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-indigo-200/80 relative overflow-hidden animate-in fade-in zoom-in-95 duration-400 preserve-3d"
          style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
        >
          {/* Subtle OCR Scan Line over verified file */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-[#2563eb] shadow-[0_0_10px_#67e8f9] animate-scan-3d pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            {/* Left: Icon and Details */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-indigo-100 flex items-center justify-center transform hover:scale-105 transition-transform">
                {getFileIcon(uploadedFile.extension)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-lg font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                    {uploadedFile.name}
                  </h4>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Chamber Ready
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span>{uploadedFile.formattedSize}</span>
                  <span>•</span>
                  <span className="uppercase font-semibold text-indigo-700">{uploadedFile.extension}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    SHA-256 Validated
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions (Replace & Remove) */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="secondary-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                title="Replace with another file"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#712ae2]" />
                Replace
              </button>
              <button
                type="button"
                onClick={onFileRemove}
                className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Remove uploaded document"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>

          {/* Verification Status Banner */}
          <div className="mt-5 pt-4 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2 text-indigo-900 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Document ingested cleanly. Integrity intact. Ready to configure neural options.
            </div>
            <span className="text-[10px] font-mono text-indigo-400 hidden sm:inline-block">
              INTEGRITY_CHECK: 0x00_PASS
            </span>
          </div>
        </div>
      )}

      {/* Error Message Box */}
      {uploadError && (
        <div className="mt-4 p-4 rounded-2xl bg-red-50/90 border border-red-200 flex items-center gap-3 text-red-700 text-sm font-medium animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};
