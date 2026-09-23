import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Eye,
  Activity,
  ShieldCheck,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Minimize2,
  Maximize2,
  AlertCircle,
  ScanLine,
} from 'lucide-react';
import { AICharacter, CharacterAction } from './AICharacter';
import { useDocument } from '../context/DocumentContext';

export const AIRobotAssistant: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    uploadedFile,
    isProcessing,
    processingStage,
    processingProgress,
    processedDocument,
    isStagedFile,
  } = useDocument();

  const [isMinimized, setIsMinimized] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(true);
  const [diagnosticTick, setDiagnosticTick] = useState(0);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);

  // Derive the active Robot Action based on page route & document lifecycle
  const getDerivedAction = (): CharacterAction => {
    const path = location.pathname;

    if (path === '/processing') {
      if (processingProgress < 25) return 'scanning';
      if (processingProgress < 60) return 'analyzing';
      return 'cleaning';
    }

    if (path === '/upload') {
      if (isStagedFile || uploadedFile) return 'upload';
      return 'inspecting';
    }

    if (path === '/choose-options') {
      return 'analyzing';
    }

    if (path === '/preview') {
      return 'before_after';
    }

    if (path === '/download-options' || path === '/downloading') {
      return 'download';
    }

    if (path === '/success') {
      return 'celebrating';
    }

    if (path === '/documents') {
      return 'worker_reading';
    }

    if (path === '/how-it-works') {
      return 'analyzing';
    }

    if (path === '/signin' || path === '/signup' || path === '/login' || path === '/register') {
      return 'idle';
    }

    if (path === '/about') {
      return 'idle';
    }

    // Default Dashboard
    return 'idle';
  };

  const currentAction = getDerivedAction();

  // Contextual Assistant Insights
  const getContextualInsight = (): { title: string; subtitle: string; tag: string } => {
    const path = location.pathname;

    if (path === '/processing') {
      if (processingProgress < 25) {
        return {
          title: 'Optical Surface Sweep',
          subtitle: 'Scanning typographical layers & skew angles...',
          tag: 'SCANNING',
        };
      }
      if (processingProgress < 60) {
        return {
          title: 'Deep OCR Synthesis',
          subtitle: 'Evaluating formatting fractures & artifacts...',
          tag: 'ANALYZING',
        };
      }
      return {
        title: 'Heuristic Reconstruction',
        subtitle: 'Re-aligning spaces & cleaning background grain...',
        tag: 'CLEANING',
      };
    }

    if (path === '/upload') {
      if (isStagedFile || uploadedFile) {
        return {
          title: 'Document Acquired',
          subtitle: `${uploadedFile?.name || 'File'} secured in buffer chamber.`,
          tag: 'READY',
        };
      }
      return {
        title: 'Sensor Grid Ready',
        subtitle: 'Drop any PDF, DOCX, or scan to begin.',
        tag: 'STANDBY',
      };
    }

    if (path === '/choose-options') {
      return {
        title: 'Filter Configuration',
        subtitle: 'Configure de-skew, OCR de-noise, and margin restoration.',
        tag: 'CONFIG',
      };
    }

    if (path === '/preview') {
      return {
        title: 'Verification Stage',
        subtitle: 'Observe side-by-side comparison before exporting.',
        tag: 'COMPARE',
      };
    }

    if (path === '/download-options' || path === '/downloading') {
      return {
        title: 'Assembly & Export',
        subtitle: 'Packaging clean vector document for download.',
        tag: 'PACKAGING',
      };
    }

    if (path === '/success') {
      return {
        title: 'Restoration Verified',
        subtitle: '100% typography repaired with verified OCR.',
        tag: 'VERIFIED',
      };
    }

    if (path === '/documents') {
      return {
        title: 'Archive Manager',
        subtitle: 'Indexing your processed historical documents.',
        tag: 'DOCUMENTS',
      };
    }

    // Home / Default
    return {
      title: 'AI Cleaning Unit // Active',
      subtitle: 'Click me anytime for a real-time diagnostic scan.',
      tag: 'ONLINE',
    };
  };

  const insight = getContextualInsight();

  const handleRobotClick = () => {
    setDiagnosticTick((prev) => prev + 1);
    const messages = [
      'Sensor calibration: 100% nominal.',
      'OCR accuracy model operating at 99.4%.',
      'Optical skew correction ready.',
      'Document memory buffer is clear.',
      'Typography neural weights stabilized.',
    ];
    const chosen = messages[diagnosticTick % messages.length];
    setSpeechBubble(chosen);
    setTimeout(() => setSpeechBubble(null), 3000);
  };

  // On pages with huge central heroes like /processing, keep assistant discreet
  const isDedicatedScreen = location.pathname === '/processing';

  return (
    <div
      id="ai-robot-assistant-dock"
      className="fixed bottom-5 right-5 z-40 select-none print:hidden flex flex-col items-end"
    >
      <AnimatePresence>
        {!isMinimized ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className={`flex flex-col items-end gap-2 ${
              isDedicatedScreen ? 'opacity-85 hover:opacity-100 transition-opacity' : ''
            }`}
          >
            {/* Speech / Telemetry Bubble */}
            <AnimatePresence>
              {(speechBubble || showTelemetry) && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="bg-[#FFF8ED]/95 backdrop-blur-xl border border-[#6B315E]/20 rounded-2xl p-3.5 shadow-2xl max-w-xs text-right mb-1"
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-[#3C8D87]/15 text-[#3C8D87] text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3C8D87] animate-pulse" />
                      {insight.tag}
                    </span>
                    <span className="text-[10px] font-mono text-[#6F6670] flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-[#6B315E]" />
                      DOCU-BOT
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#24162F] font-heading">
                    {speechBubble ? 'Diagnostic Telemetry' : insight.title}
                  </h4>
                  <p className="text-[11px] text-[#6F6670] mt-0.5 leading-snug font-sans">
                    {speechBubble || insight.subtitle}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Robot Container Card */}
            <div className="bg-[#FFF8ED]/90 backdrop-blur-2xl border border-[#6B315E]/20 rounded-3xl p-2 shadow-2xl flex items-center gap-2 relative group hover:border-[#6B315E]/40 transition-all">
              {/* Quick action controls overlay */}
              <div className="absolute top-2 left-2 flex items-center gap-1 z-20">
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  title="Minimize AI Assistant"
                  className="w-5 h-5 rounded-full bg-[#EADCC8]/60 hover:bg-[#EADCC8] text-[#6F6670] hover:text-[#24162F] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Minimize2 className="w-2.5 h-2.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowTelemetry(!showTelemetry)}
                  title={showTelemetry ? 'Hide Telemetry' : 'Show Telemetry'}
                  className="w-5 h-5 rounded-full bg-[#EADCC8]/60 hover:bg-[#EADCC8] text-[#6F6670] hover:text-[#24162F] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ScanLine className="w-2.5 h-2.5" />
                </button>
              </div>

              {/* 3D Interactive AI Character */}
              <div className="relative">
                <AICharacter
                  action={currentAction}
                  size="sm"
                  interactive={true}
                  showStatusBadge={false}
                  onClick={handleRobotClick}
                  className="filter drop-shadow-md"
                />

                {/* Subtitle click hint on hover */}
                <span className="text-[9px] font-mono text-[#978D91] text-center block -mt-2 group-hover:text-[#3C8D87] transition-colors">
                  CLICK TO SCAN
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Minimized Floating Pill / Orb */
          <motion.button
            type="button"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsMinimized(false)}
            className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#FFF8ED]/95 backdrop-blur-xl border border-[#6B315E]/25 shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:border-[#3C8D87]"
            title="Open Docu-Bot AI Assistant"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#24162F] via-[#6B315E] to-[#C65D45] flex items-center justify-center text-[#FFF8ED] shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-3.5 h-3.5 text-[#A8D5C2]" />
            </div>

            <div className="flex flex-col text-left">
              <span className="text-[11px] font-extrabold text-[#24162F] font-heading leading-tight flex items-center gap-1">
                <span>Docu-Bot</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#3C8D87] animate-ping" />
              </span>
              <span className="text-[9px] font-mono text-[#6F6670] uppercase">
                {insight.tag}
              </span>
            </div>

            <Maximize2 className="w-3 h-3 text-[#978D91] group-hover:text-[#24162F] ml-1 transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
