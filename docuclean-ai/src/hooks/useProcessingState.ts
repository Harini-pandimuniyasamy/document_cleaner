import { useMemo } from 'react';

export type ProcessingStatePhase =
  | 'READING'
  | 'ANALYZING'
  | 'CLEANING'
  | 'NORMALIZING'
  | 'RECONSTRUCTING'
  | 'COMPLETE';

export interface PhaseMetadata {
  phase: ProcessingStatePhase;
  title: string;
  subtitle: string;
  activeOrbitIndex: number;
  scannerSpeed: number; // multiplier
  layerSeparation: number; // 0 to 1
  particleActivity: 'attract' | 'orbit' | 'disperse' | 'snap' | 'calm';
  narrativeText: string;
}

export function getPhaseFromProgress(progress: number): PhaseMetadata {
  if (progress < 18) {
    return {
      phase: 'READING',
      title: 'Phase 1: Ingesting Binary & Volumetric Scanning',
      subtitle: 'Volumetric plane passing through document layers to digitize raw geometry',
      activeOrbitIndex: 0,
      scannerSpeed: 1.0,
      layerSeparation: 0.15,
      particleActivity: 'attract',
      narrativeText: 'Optical recognition engine detects character bounding primitives...',
    };
  }
  if (progress < 38) {
    return {
      phase: 'ANALYZING',
      title: 'Phase 2: Semantic Analysis & Layer Extraction',
      subtitle: 'Disassembling typographical structures into tokenized coordinate tensors',
      activeOrbitIndex: 1,
      scannerSpeed: 1.5,
      layerSeparation: 0.5,
      particleActivity: 'orbit',
      narrativeText: 'Detecting irregular line wraps, OCR typos, and skewed paragraph margins...',
    };
  }
  if (progress < 62) {
    return {
      phase: 'CLEANING',
      title: 'Phase 3: Digital Noise Bleaching & Space Correction',
      subtitle: 'Erasing scanner salt-and-pepper grain, collapsing excess spacing',
      activeOrbitIndex: 2,
      scannerSpeed: 1.8,
      layerSeparation: 0.85,
      particleActivity: 'disperse',
      narrativeText: 'Expelling 58 scanner artifact clusters, disambiguating alphanumeric homoglyphs...',
    };
  }
  if (progress < 82) {
    return {
      phase: 'NORMALIZING',
      title: 'Phase 4: Structural Geometry & Baseline Alignment',
      subtitle: 'Realigning typographical grids, squaring margins, fixing hard line-wraps',
      activeOrbitIndex: 3,
      scannerSpeed: 1.2,
      layerSeparation: 0.45,
      particleActivity: 'orbit',
      narrativeText: 'Enforcing uniform baseline grids, unifying punctuation and unicode quotes...',
    };
  }
  if (progress < 98) {
    return {
      phase: 'RECONSTRUCTING',
      title: 'Phase 5: Matrix Reassembly & Token Snapping',
      subtitle: 'Magnetic snap of pristine glyphs and normalized layers back into document core',
      activeOrbitIndex: 4,
      scannerSpeed: 0.8,
      layerSeparation: 0.1,
      particleActivity: 'snap',
      narrativeText: 'Fused 12,480 character nodes into high-contrast vector document container...',
    };
  }
  return {
    phase: 'COMPLETE',
    title: 'Phase 6: AI Sealed & Validated',
    subtitle: 'High-contrast cryptographic checksum verified; document materialized',
    activeOrbitIndex: -1,
    scannerSpeed: 0,
    layerSeparation: 0,
    particleActivity: 'calm',
    narrativeText: 'Document pristine. 99.4% clarity rating authenticated.',
  };
}

export function useProcessingState(progress: number): PhaseMetadata {
  return useMemo(() => getPhaseFromProgress(progress), [progress]);
}

