import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { DocumentCore } from './DocumentCore';
import { AICharacter } from './AICharacter';
import { Check } from 'lucide-react';

interface AISealProps {
  fileName?: string;
}

export const AISeal: React.FC<AISealProps> = ({
  fileName = 'Quarterly_Audit_Report_2024.pdf',
}) => {
  const [sealState, setSealState] = useState<'RING_FORMING' | 'SCANNING' | 'CHECK_FORMING' | 'STABLE'>('RING_FORMING');

  useEffect(() => {
    // Ring forms (0 to 600ms)
    const t1 = setTimeout(() => {
      setSealState('SCANNING');
    }, 600);

    // Scans document once (600ms to 1500ms)
    const t2 = setTimeout(() => {
      setSealState('CHECK_FORMING');
    }, 1500);

    // Creates minimal checkmark and stabilizes (1500ms to 2300ms)
    const t3 = setTimeout(() => {
      setSealState('STABLE');
    }, 2300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-6 preserve-3d select-none">
      {/* 1. CALM ATMOSPHERE AMBIENT HALO */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#3C8D87]/15 via-[#6B315E]/10 to-[#A8D5C2]/20 rounded-full blur-3xl pointer-events-none" />

      {/* 2. COMPANION ROBOT + FLOATING STABLE CLEANED DOCUMENT */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 scale-90 sm:scale-100 mb-6 preserve-3d">
        {/* Docu-Bot in celebrating / approving state */}
        <div className="flex flex-col items-center">
          <AICharacter
            action="celebrating"
            size="md"
            className="drop-shadow-lg"
          />
          <span className="text-[10px] font-mono text-[#3C8D87] font-bold mt-1">
            VERIFICATION SEAL APPROVED
          </span>
        </div>

        {/* The Sealed Document */}
        <div className="relative flex items-center justify-center preserve-3d">
          <DocumentCore
            title={fileName}
            isCleaned={true}
            separationFactor={0}
            showOCRBoxes={false}
            showMetadataFragments={true}
            customWidth="w-[280px] sm:w-[320px]"
            customHeight="h-[380px] sm:h-[420px]"
          />

          {/* 3. THIN CIRCULAR SCANNING RING FORMING AROUND DOCUMENT */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{
              scale: sealState === 'STABLE' ? 1.05 : [1, 1.08, 1],
              opacity: 1,
              rotate: sealState === 'SCANNING' ? 360 : 0,
            }}
            transition={{
              duration: sealState === 'SCANNING' ? 1.2 : 0.8,
              ease: 'easeInOut',
            }}
            className="absolute w-[330px] sm:w-[380px] h-[430px] sm:h-[480px] rounded-[36px] pointer-events-none"
            style={{
              border: '2px solid rgba(60, 141, 135, 0.7)',
              boxShadow: '0 0 25px rgba(60, 141, 135, 0.35), inset 0 0 20px rgba(168, 213, 194, 0.2)',
            }}
          >
            {/* Scanning Node running along the ring */}
            {sealState === 'SCANNING' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: 1, ease: 'linear' }}
                className="absolute inset-0 rounded-[36px]"
              >
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#3C8D87] shadow-[0_0_15px_#3C8D87]" />
              </motion.div>
            )}

            {/* Holographic Verification Stamp */}
            {(sealState === 'CHECK_FORMING' || sealState === 'STABLE') && (
              <motion.div
                initial={{ scale: 0, rotate: -25, opacity: 0 }}
                animate={{ scale: 1, rotate: -8, opacity: 1 }}
                transition={{ type: 'spring', damping: 14, stiffness: 120 }}
                className="absolute -top-4 -right-4 bg-[#FFF8ED] px-3.5 py-2 rounded-2xl border-2 border-[#3C8D87] text-[#3C8D87] shadow-xl flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-[#3C8D87] text-[#FFF8ED] flex items-center justify-center shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div className="text-left font-mono leading-tight">
                  <span className="text-[10px] font-black uppercase tracking-wider block">AI SEALED</span>
                  <span className="text-[8px] text-[#978D91]">AUTHENTICATED</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* 4. CALM & SATISFYING STATUS TYPOGRAPHY */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-center relative z-20"
      >
        <h1 className="text-2xl sm:text-3xl font-black text-[#2C2830] tracking-tight mb-2 font-heading">
          DOCUMENT CLEANED SUCCESSFULLY
        </h1>
        <p className="text-xs sm:text-sm text-[#6F6670] max-w-md mx-auto">
          Typography synthesized, OCR ambiguities disambiguated, and formatting normalized into pristine clarity.
        </p>
      </motion.div>
    </div>
  );
};
