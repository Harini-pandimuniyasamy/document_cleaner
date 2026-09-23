import React from 'react';
import { motion } from 'motion/react';
import { getPhaseFromProgress } from '../hooks/useProcessingState';
import { DocumentCore } from './DocumentCore';
import { NeuralOrbits } from './NeuralOrbits';
import { OCRScanner } from './OCRScanner';
import { TextGravity } from './TextGravity';
import { DocumentGravityField } from './DocumentGravityField';
import { DocumentDisassembly } from './DocumentDisassembly';
import { AICharacter, CharacterAction } from './AICharacter';
import { Zap, Sparkles } from 'lucide-react';

interface ProcessingSceneProps {
  progress: number;
  stageName: string;
  fileName?: string;
}

export const ProcessingScene: React.FC<ProcessingSceneProps> = ({
  progress,
  stageName,
  fileName = 'Quarterly_Audit_Report_2024.pdf',
}) => {
  const phaseMeta = getPhaseFromProgress(progress);
  const isComplete = progress >= 100;

  // Determine the AI Character's Worker Mode action
  let characterAction: CharacterAction = 'worker_reading';
  if (phaseMeta.phase === 'READING') characterAction = 'worker_reading';
  else if (phaseMeta.phase === 'ANALYZING') characterAction = 'worker_analyzing';
  else if (phaseMeta.phase === 'CLEANING') characterAction = 'worker_cleaning';
  else if (phaseMeta.phase === 'NORMALIZING') characterAction = 'worker_normalizing';
  else if (phaseMeta.phase === 'RECONSTRUCTING') characterAction = 'worker_reconstructing';
  else if (isComplete || phaseMeta.phase === 'COMPLETE') characterAction = 'celebrating';

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[640px] select-none preserve-3d py-4">
      {/* 1. DOCUMENT GRAVITY FIELD BACKGROUND CANVAS */}
      <DocumentGravityField
        activityState={
          isComplete
            ? 'calm'
            : phaseMeta.particleActivity === 'disperse'
            ? 'accelerate'
            : phaseMeta.particleActivity === 'snap'
            ? 'snap'
            : 'orbit'
        }
        className="inset-[-15%]"
      />

      {/* 2. 5 NEURAL ORBITAL RINGS */}
      <NeuralOrbits
        activeOrbitIndex={phaseMeta.activeOrbitIndex}
        isComplete={isComplete}
      />

      {/* 3. TEXT GRAVITY FLOATING PARTICLES */}
      <TextGravity phase={phaseMeta.phase} />

      {/* 4. MAIN HERO 3D DIGITAL WORKSPACE WITH DOCUMENT + AI ROBOT WORKER */}
      <div className="relative z-20 flex flex-col lg:flex-row items-center justify-center gap-8 preserve-3d">
        {/* Active AI Robot Companion in Worker Mode */}
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3.5,
            ease: 'easeInOut',
          }}
          className="relative z-30 flex flex-col items-center"
        >
          <AICharacter
            action={characterAction}
            size="md"
            className="drop-shadow-xl"
          />
          <div className="mt-1 px-3 py-1 rounded-full bg-[#FFF8ED]/90 border border-[#6B315E]/20 text-[10px] font-mono font-bold text-[#C65D45] backdrop-blur-md shadow-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C65D45] animate-ping" />
            <span>WORKER: {characterAction.replace('worker_', '').toUpperCase()}</span>
          </div>
        </motion.div>

        {/* 3D Main Document Core */}
        <div className="relative flex items-center justify-center preserve-3d">
          <DocumentCore
            title={fileName}
            isCleaned={progress > 60}
            separationFactor={phaseMeta.layerSeparation}
            showOCRBoxes={progress > 10 && progress < 90}
            showMetadataFragments={true}
            activeScanLinePercent={isComplete ? null : (progress * 1.5) % 100}
          />

          {/* 5. VOLUMETRIC SCANNING BEAM */}
          {!isComplete && <OCRScanner isActive={true} speed={2.8} />}

          {/* 6. DOCUMENT DISASSEMBLY & REASSEMBLY STAGES */}
          <DocumentDisassembly
            phase={phaseMeta.phase}
            separationFactor={phaseMeta.layerSeparation}
          />
        </div>
      </div>

      {/* 7. CINEMATIC HEADS-UP DISPLAY (HUD) IN WARM INTELLIGENCE THEME */}
      <div className="relative z-30 mt-10 w-full max-w-xl px-4 flex flex-col items-center text-center">
        {/* State Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8ED]/90 backdrop-blur-md border border-[#6B315E]/20 shadow-md text-xs font-mono font-extrabold text-[#2C2830] mb-2">
          <span className="w-2 h-2 rounded-full bg-[#3C8D87] animate-ping" />
          <span>PHASE: {phaseMeta.phase}</span>
          <span className="text-[#978D91]">|</span>
          <span className="text-[#C65D45]">{progress}%</span>
        </div>

        {/* Narrative Title & Subtitle */}
        <h2 className="text-xl sm:text-2xl font-black text-[#2C2830] tracking-tight mb-1 font-heading">
          {phaseMeta.title}
        </h2>
        <p className="text-xs sm:text-sm text-[#6F6670] max-w-md mb-4 leading-relaxed">
          {phaseMeta.subtitle}
        </p>

        {/* Real-Time Processing Terminal Bar */}
        <div className="w-full bg-[#24162F]/95 backdrop-blur-md rounded-2xl p-3 border border-[#6B315E]/40 text-left font-mono text-[10px] text-[#A8D5C2] shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <Zap className="w-3.5 h-3.5 text-[#D9A441] flex-shrink-0 animate-bounce" />
            <span className="truncate">{phaseMeta.narrativeText}</span>
          </div>
          <span className="text-[#E98268] font-bold flex-shrink-0 ml-3">
            [DOCUBOT_CORE_ACTIVE]
          </span>
        </div>
      </div>
    </div>
  );
};
