import React from 'react';
import { FileText, FileCode, Sparkles } from 'lucide-react';
import { DownloadFormat } from '../types';

interface FormatOption {
  id: DownloadFormat;
  title: string;
  badge: string;
  tag: string;
  description: string;
  features: string[];
}

const FORMAT_OPTIONS: FormatOption[] = [
  {
    id: 'pdf',
    title: 'Portable Document Format (.pdf)',
    badge: 'Standard & Archival',
    tag: 'OCR Text Layer',
    description: 'Crisp vector typography, preserved layout geometry, searchable text layer, and universal print readiness.',
    features: ['High-fidelity vector layout', 'Searchable OCR text overlay', 'Universal PDF/A compliant'],
  },
  {
    id: 'docx',
    title: 'Microsoft Word Document (.docx)',
    badge: 'Fully Editable',
    tag: 'Formatted Text',
    description: 'Formatted editable text with native tables, headings, styles, and document margins ready for Word and Google Docs.',
    features: ['Fully editable headings & text', 'Dynamic table preservation', 'MS Word & Google Docs native'],
  },
  {
    id: 'txt',
    title: 'Plain Text File (.txt)',
    badge: 'Raw & Lightweight',
    tag: 'Clean Raw Text',
    description: 'Pure UTF-8 plaintext with zero formatting overhead, ideal for NLP pipelines, LLM ingestion, and code editors.',
    features: ['100% UTF-8 clean encoding', 'Normalized line endings', 'Immediate LLM/API ingestion'],
  },
];

interface DownloadCardProps {
  selectedFormat: DownloadFormat;
  onSelectFormat: (format: DownloadFormat) => void;
}

export const DownloadCard: React.FC<DownloadCardProps> = ({
  selectedFormat,
  onSelectFormat,
}) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full preserve-3d"
      style={{ perspective: '1000px' }}
    >
      {FORMAT_OPTIONS.map((item) => {
        const isSelected = selectedFormat === item.id;

        return (
          <div
            key={item.id}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            onClick={() => onSelectFormat(item.id)}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onSelectFormat(item.id);
              }
            }}
            className={`p-6 rounded-3xl cursor-pointer select-none transition-all duration-300 relative flex flex-col justify-between border preserve-3d ${
              isSelected
                ? 'bg-[#FFF8ED] border-[#C65D45] shadow-[0_25px_50px_-10px_rgba(198,93,69,0.25),0_0_20px_rgba(60,141,135,0.12)] ring-2 ring-[#C65D45]/20'
                : 'bg-[#FFF8ED]/75 border-[#6B315E]/20 hover:border-[#C65D45] hover:bg-[#FFF8ED] shadow-xs'
            }`}
            style={{
              transform: isSelected
                ? 'translateZ(16px) translateY(-6px)'
                : 'translateZ(0px)',
            }}
          >
            {/* Top scanning highlight if selected */}
            {isSelected && (
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E98268] to-[#3C8D87] shadow-[0_0_10px_#E98268]" />
            )}

            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#24162F] via-[#6B315E] to-[#C65D45] text-[#FFF8ED] shadow-lg scale-105'
                      : 'bg-[#EADCC8]/60 text-[#6B315E]'
                  }`}
                >
                  {item.id === 'txt' ? (
                    <FileCode className="w-6 h-6" />
                  ) : (
                    <FileText className="w-6 h-6" />
                  )}
                </div>

                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-[#C65D45] bg-[#C65D45] text-white shadow-md'
                      : 'border-[#978D91]/40 bg-white'
                  }`}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white animate-in zoom-in-50" />}
                </div>
              </div>

              {/* Title & Floating Badges */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EADCC8] text-[#6B315E]">
                  {item.badge}
                </span>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#A8D5C2]/30 text-[#3C8D87] border border-[#3C8D87]/40 shadow-xs flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  {item.tag}
                </span>
              </div>

              <h3 className="font-extrabold text-[#2C2830] text-base mb-1.5 tracking-tight font-heading">
                {item.title}
              </h3>
              <p className="text-xs text-[#6F6670] leading-relaxed mb-4">
                {item.description}
              </p>

              {/* Feature Checklist */}
              <ul className="space-y-1.5 pt-3 border-t border-[#EADCC8] text-xs text-[#6F6670]">
                {item.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3C8D87]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Selection State */}
            <div className="mt-5 pt-3 border-t border-[#EADCC8] flex items-center justify-between text-xs font-bold">
              <span className={isSelected ? 'text-[#C65D45]' : 'text-[#978D91]'}>
                {isSelected ? 'Ready for Packaging' : 'Click to select'}
              </span>
              <span className="text-xs font-mono text-[#3C8D87]">
                .{item.id.toUpperCase()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
