import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { useDocument } from '../context/DocumentContext';
import { useAuth } from '../context/AuthContext';
import { DocumentChamber } from '../components/DocumentChamber';

const SAMPLE_TEXT_CONTENT = `CONFIDENTIAL  QUARTERLY  AUDIT   REP0RT  --  2O26
DocuClean  Enterpr1se   Soluti0ns   Group

1.  EXECUTIVE   SUMMARY
Dur1ng  the  prev1ous   operat1onal  quarter ,  our   mult1-reg1onal
fac1lities  encountered   substant1al  bottlenecks  in  the   ingest1on
of   uncategor1zed   analog   cop1es . Scanned   mater1als   frequently
exh1bited   art1facts   such  as :
-  scanner   speckle   no1se  and  skewed   b0rders
-  errat1c   hard   breaks  in
the  middle  of   statut0ry  c1tations
-  degraded   contrast   lead1ng  to  OCR   m1sreadings   like  'rn'   read  as  'm'

2.  QUANTITAT1VE   ANALYS1S
T0tal  scanned   pages:  12,480   docurnents
Average   clar1ty   index:  61.4%   (Sub-opt1mal)
Corrective   act1on   requ1red:  Immed1ate   AI  restorat1on`;

export const Upload: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { uploadedFile, uploadError, setUploadedFile, removeUploadedFile } = useDocument();

  const [localValidationMessage, setLocalValidationMessage] = useState<string | null>(null);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: '/upload' } });
    }
  }, [isAuthenticated, navigate]);

  const handleFileAccepted = (file: File) => {
    setLocalValidationMessage(null);
    setUploadedFile(file);
  };

  const handleNext = () => {
    if (!uploadedFile) {
      setLocalValidationMessage('Please select or upload a document first.');
      return;
    }
    setLocalValidationMessage(null);
    navigate('/choose-options');
  };

  const loadSampleDocument = () => {
    const blob = new Blob([SAMPLE_TEXT_CONTENT], { type: 'text/plain;charset=utf-8' });
    const sampleFile = new File([blob], 'Sample_Uncleaned_Audit_2026.txt', {
      type: 'text/plain',
      lastModified: Date.now(),
    });
    setLocalValidationMessage(null);
    setUploadedFile(sampleFile);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 max-w-3xl mx-auto pt-1 sm:pt-4 pb-12 animate-in fade-in duration-300 w-full">
      {/* 3D Scanning Chamber */}
      <DocumentChamber
        onFileAccepted={handleFileAccepted}
        isStagedFile={!!uploadedFile}
        fileName={uploadedFile?.name}
        fileSize={uploadedFile?.formattedSize}
        fileType={uploadedFile?.extension}
        onClear={removeUploadedFile}
        onValidationError={setLocalValidationMessage}
      />

      {/* Sample Document Demo Ingestion Card */}
      {!uploadedFile && (
        <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#FFF8ED]/85 border border-[#6B315E]/20 text-xs text-[#2C2830] gap-3 max-w-xl sm:max-w-2xl mx-auto w-full shadow-xs backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C65D45] flex-shrink-0" />
            <span>Don&apos;t have a file ready? Materialize our sample audit report into the chamber.</span>
          </div>
          <button
            type="button"
            onClick={loadSampleDocument}
            className="px-4 py-2 rounded-xl font-bold text-xs flex-shrink-0 cursor-pointer border border-[#6B315E]/20 bg-[#FFF8ED] hover:bg-[#EADCC8]/40 text-[#2C2830] transition-colors"
          >
            Materialize Sample
          </button>
        </div>
      )}

      {/* Local Validation Error Banner */}
      {(localValidationMessage || uploadError) && (
        <div className="p-3.5 rounded-2xl bg-[#FFF8ED] border border-[#E98268]/60 flex items-center justify-center gap-2.5 text-[#C65D45] text-xs sm:text-sm font-bold shadow-xs animate-in fade-in duration-200 max-w-xl sm:max-w-2xl mx-auto w-full text-center">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#C65D45]" />
          <span>{localValidationMessage || uploadError}</span>
        </div>
      )}

      {/* Bottom Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-xl sm:max-w-2xl mx-auto w-full mt-1">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#6B315E]/20 bg-[#FFF8ED] text-[#2C2830] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs hover:bg-[#EADCC8]/40 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#24162F] via-[#6B315E] to-[#C65D45] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <span>Next: Choose Options</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
