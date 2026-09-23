import React from 'react';
import { motion } from 'motion/react';

interface CinematicTransitionProps {
  children: React.ReactNode;
  pageKey: string;
}

export const CinematicTransition: React.FC<CinematicTransitionProps> = ({
  children,
  pageKey,
}) => {
  return (
    <div className="w-full relative preserve-3d" style={{ perspective: '1200px' }}>
      {/* Sweeping Digital Paper Light Plane during navigation */}
      <motion.div
        key={`sweep-${pageKey}`}
        initial={{ x: '-100%', opacity: 0.7 }}
        animate={{ x: '100%', opacity: 0 }}
        transition={{ duration: 0.65, ease: 'easeInOut' }}
        className="fixed inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#67e8f9]/20 to-transparent pointer-events-none z-50 transform -skew-x-12"
      />

      {/* 3D Page Entrance */}
      <motion.div
        key={pageKey}
        initial={{ opacity: 0, scale: 0.96, rotateX: 4, y: 15 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, rotateX: -4, y: -15 }}
        transition={{
          duration: 0.45,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full preserve-3d"
      >
        {children}
      </motion.div>
    </div>
  );
};
