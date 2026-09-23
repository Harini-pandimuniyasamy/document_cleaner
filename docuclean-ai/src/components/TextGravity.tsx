import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TextGravityProps {
  phase?: 'READING' | 'ANALYZING' | 'CLEANING' | 'NORMALIZING' | 'RECONSTRUCTING' | 'COMPLETE';
  intensity?: number;
}

interface TextToken {
  id: string;
  label: string;
  category: 'ocr' | 'structure' | 'cleaning' | 'data';
  initialAngle: number;
  orbitRadius: number;
  targetOffset: { x: number; y: number };
}

const TOKENS: TextToken[] = [
  { id: 't1', label: 'OCR', category: 'ocr', initialAngle: 0, orbitRadius: 210, targetOffset: { x: -70, y: -90 } },
  { id: 't2', label: 'TEXT', category: 'data', initialAngle: 50, orbitRadius: 190, targetOffset: { x: 30, y: -60 } },
  { id: 't3', label: 'DATA', category: 'data', initialAngle: 110, orbitRadius: 230, targetOffset: { x: 70, y: 40 } },
  { id: 't4', label: 'FORMAT', category: 'structure', initialAngle: 170, orbitRadius: 200, targetOffset: { x: -60, y: 70 } },
  { id: 't5', label: 'SPACE', category: 'cleaning', initialAngle: 220, orbitRadius: 240, targetOffset: { x: 50, y: -10 } },
  { id: 't6', label: 'SCAN', category: 'ocr', initialAngle: 280, orbitRadius: 180, targetOffset: { x: -30, y: -40 } },
  { id: 't7', label: 'AI', category: 'structure', initialAngle: 330, orbitRadius: 220, targetOffset: { x: 20, y: 80 } },
];

export const TextGravity: React.FC<TextGravityProps> = ({
  phase = 'READING',
}) => {
  const [tokens] = useState<TextToken[]>(TOKENS);

  // Determine transform state per phase
  // Phase mapping:
  // READING: wide float
  // ANALYZING: orbit attracted closer
  // CLEANING: high-speed orbital alignment
  // NORMALIZING: aligning on coordinate lines
  // RECONSTRUCTING: snapping into document matrix
  // COMPLETE: absorbed / calm inside paper

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center preserve-3d overflow-visible">
      <AnimatePresence>
        {tokens.map((token, index) => {
          let x = Math.cos((token.initialAngle * Math.PI) / 180) * token.orbitRadius;
          let y = Math.sin((token.initialAngle * Math.PI) / 180) * token.orbitRadius * 0.75;
          let z = (index % 3) * 15;
          let scale = 1;
          let opacity = 0.85;

          if (phase === 'ANALYZING') {
            // Drawn closer towards document
            x *= 0.75;
            y *= 0.75;
            z += 25;
            scale = 1.05;
          } else if (phase === 'CLEANING') {
            // Actively aligning
            x = token.targetOffset.x * 1.6;
            y = token.targetOffset.y * 1.6;
            z = 40;
            scale = 1.1;
          } else if (phase === 'NORMALIZING') {
            // Snapping into line positions
            x = token.targetOffset.x * 1.1;
            y = token.targetOffset.y * 1.1;
            z = 20;
            scale = 0.95;
          } else if (phase === 'RECONSTRUCTING') {
            // Snapped directly into document body
            x = token.targetOffset.x;
            y = token.targetOffset.y;
            z = 5;
            scale = 0.8;
            opacity = 0.4;
          } else if (phase === 'COMPLETE') {
            // Fully integrated / absorbed
            x = token.targetOffset.x;
            y = token.targetOffset.y;
            z = 0;
            scale = 0;
            opacity = 0;
          }

          const categoryStyle =
            token.category === 'ocr'
              ? 'border-cyan-400 bg-cyan-50/90 text-cyan-800'
              : token.category === 'structure'
              ? 'border-indigo-400 bg-indigo-50/90 text-[#1f108e]'
              : token.category === 'cleaning'
              ? 'border-violet-400 bg-violet-50/90 text-[#6d28d9]'
              : 'border-blue-400 bg-blue-50/90 text-[#2563eb]';

          return (
            <motion.div
              key={token.id}
              initial={{ x, y, z, scale: 0.8, opacity: 0 }}
              animate={{
                x,
                y,
                z,
                scale,
                opacity,
              }}
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 70,
                mass: 0.8,
              }}
              className={`absolute px-2 py-0.5 rounded-md font-mono text-[9px] font-bold border shadow-md backdrop-blur-sm select-none ${categoryStyle}`}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-pulse" />
                <span>{token.label}</span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
