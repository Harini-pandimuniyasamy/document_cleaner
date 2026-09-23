import React from 'react';
import { motion } from 'motion/react';

interface NeuralOrbitsProps {
  activeOrbitIndex?: number; // 0 to 4, or -1 when complete
  isComplete?: boolean;
}

interface OrbitRingData {
  id: string;
  name: string;
  radiusX: number;
  radiusY: number;
  tiltDeg: number;
  baseDuration: number;
  color: string;
  particleCount: number;
}

const ORBIT_RINGS: OrbitRingData[] = [
  { id: 'ocr', name: 'OCR', radiusX: 190, radiusY: 90, tiltDeg: 25, baseDuration: 14, color: '#3C8D87', particleCount: 6 },
  { id: 'struct', name: 'STRUCTURE', radiusX: 230, radiusY: 110, tiltDeg: -30, baseDuration: 18, color: '#6B315E', particleCount: 7 },
  { id: 'format', name: 'FORMATTING', radiusX: 270, radiusY: 130, tiltDeg: 45, baseDuration: 22, color: '#C65D45', particleCount: 8 },
  { id: 'clean', name: 'CLEANING', radiusX: 310, radiusY: 150, tiltDeg: -55, baseDuration: 26, color: '#E98268', particleCount: 9 },
  { id: 'read', name: 'READABILITY', radiusX: 350, radiusY: 170, tiltDeg: 15, baseDuration: 30, color: '#D9A441', particleCount: 10 },
];

export const NeuralOrbits: React.FC<NeuralOrbitsProps> = ({
  activeOrbitIndex = 0,
  isComplete = false,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center preserve-3d overflow-visible">
      {ORBIT_RINGS.map((ring, idx) => {
        const isActive = activeOrbitIndex === idx;
        const isPast = activeOrbitIndex > idx;
        // Speed multiplier: active orbits accelerate 3x
        const duration = isComplete ? 0.6 : isActive ? ring.baseDuration * 0.35 : ring.baseDuration;

        // Size collapse on completion
        const currentRadiusX = isComplete ? ring.radiusX * 0.15 : ring.radiusX;
        const currentRadiusY = isComplete ? ring.radiusY * 0.15 : ring.radiusY;
        const opacity = isComplete ? 0.15 : isActive ? 1 : isPast ? 0.5 : 0.35;

        return (
          <motion.div
            key={ring.id}
            initial={false}
            animate={{
              width: currentRadiusX * 2,
              height: currentRadiusY * 2,
              opacity,
              scale: isComplete ? 0.2 : 1,
            }}
            transition={{
              duration: isComplete ? 0.7 : 0.4,
              ease: 'easeInOut',
            }}
            className="absolute rounded-full pointer-events-none preserve-3d flex items-center justify-center"
            style={{
              border: `1.5px ${isActive ? 'solid' : 'dashed'} ${ring.color}`,
              boxShadow: isActive ? `0 0 25px ${ring.color}80, inset 0 0 15px ${ring.color}40` : 'none',
              transform: `rotateX(65deg) rotateZ(${ring.tiltDeg}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Spinning Carrier Container */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute inset-0 rounded-full"
            >
              {/* Active Ring Name Tag */}
              {isActive && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full font-mono text-[8px] font-extrabold uppercase shadow-lg border"
                  style={{
                    backgroundColor: '#ffffff',
                    color: ring.color,
                    borderColor: ring.color,
                    boxShadow: `0 0 12px ${ring.color}`,
                  }}
                >
                  ORBIT {idx + 1}: {ring.name}
                </div>
              )}

              {/* Orbital Particles */}
              {Array.from({ length: ring.particleCount }).map((_, pIdx) => {
                const angle = (pIdx / ring.particleCount) * (Math.PI * 2);
                const px = Math.cos(angle) * currentRadiusX;
                const py = Math.sin(angle) * currentRadiusY;

                return (
                  <div
                    key={pIdx}
                    className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `calc(50% + ${px}px)`,
                      top: `calc(50% + ${py}px)`,
                      backgroundColor: ring.color,
                      boxShadow: `0 0 10px ${ring.color}`,
                    }}
                  />
                );
              })}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};
