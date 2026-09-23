import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface DownloadSuccessPopupProps {
  isVisible: boolean;
  onClose?: () => void;
}

export const DownloadSuccessPopup: React.FC<DownloadSuccessPopupProps> = ({
  isVisible,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className="fixed top-24 sm:top-28 left-1/2 -translate-x-1/2 z-[100] pointer-events-none select-none"
          role="status"
          aria-live="polite"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -4 }}
            transition={{
              duration: 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#FFF8ED]/95 backdrop-blur-md border border-[#3C8D87]/40 shadow-[0_12px_28px_-6px_rgba(36,22,47,0.18),0_4px_12px_rgba(60,141,135,0.15)] flex items-center gap-2.5 overflow-visible"
          >
            {/* Subtle soft micro-particles floating near the badge */}
            <motion.span
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0], y: -10, x: -4 }}
              transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
              className="absolute -top-1 left-2 w-1.5 h-1.5 rounded-full bg-[#3C8D87]"
            />
            <motion.span
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0], y: -8, x: 6 }}
              transition={{ duration: 1.3, delay: 0.2, ease: 'easeOut' }}
              className="absolute -top-1.5 right-6 w-1 h-1 rounded-full bg-[#A8D5C2]"
            />
            <motion.span
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0], y: 6, x: 4 }}
              transition={{ duration: 1.4, delay: 0.25, ease: 'easeOut' }}
              className="absolute -bottom-1 left-8 w-1 h-1 rounded-full bg-[#D9A441]"
            />

            {/* Checkmark Icon with Drawing Animation and Tiny Ring Completion */}
            <div className="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
              {/* Background soft tint */}
              <div className="absolute inset-0 rounded-full bg-[#A8D5C2]/25" />

              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 overflow-visible text-[#3C8D87]"
                fill="none"
              >
                {/* Tiny Ring Completion Animation */}
                <motion.circle
                  cx="12"
                  cy="12"
                  r="9.5"
                  stroke="#3C8D87"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, rotate: -90 }}
                  animate={{ pathLength: 1, rotate: -90 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                />

                {/* Checkmark Drawing Animation */}
                <motion.path
                  d="M7.5 12.2L10.5 15.2L16.5 9"
                  stroke="#3C8D87"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' }}
                />
              </svg>
            </div>

            {/* Heading text */}
            <h2 className="text-xs sm:text-sm font-bold text-[#24162F] tracking-tight font-heading whitespace-nowrap">
              ✓ Download Successful
            </h2>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
