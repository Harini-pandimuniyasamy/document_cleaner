import React, { useState } from 'react';
import { ScanText, X, Shield, FileText, LifeBuoy, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | 'support' | 'api' | null>(null);

  const closeModal = () => setModalType(null);

  return (
    <>
      <footer className="bg-white/70 backdrop-blur-md text-xs w-full py-12 border-t border-white/50 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 sm:px-10 gap-8 max-w-[1440px] mx-auto">
          {/* Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-1.5">
            <div className="text-base font-bold text-[#1f108e] flex items-center gap-2">
              <ScanText className="w-5 h-5 text-[#712ae2]" />
              <span>DocuClean AI</span>
            </div>
            <p className="text-slate-500">© 2026 DocuClean AI. Premium Document Intelligence.</p>
          </div>

          {/* Footer Interactive Links */}
          <nav className="flex flex-wrap justify-center gap-6 text-slate-500">
            <button
              onClick={() => setModalType('privacy')}
              className="hover:text-[#712ae2] underline decoration-[#712ae2]/30 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setModalType('terms')}
              className="hover:text-[#712ae2] underline decoration-[#712ae2]/30 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setModalType('support')}
              className="hover:text-[#712ae2] underline decoration-[#712ae2]/30 transition-colors cursor-pointer"
            >
              Contact Support
            </button>
            <button
              onClick={() => setModalType('api')}
              className="hover:text-[#712ae2] underline decoration-[#712ae2]/30 transition-colors cursor-pointer"
            >
              API Documentation
            </button>
          </nav>
        </div>
      </footer>

      {/* Footer Info Modals to guarantee all links work */}
      {modalType && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="glass-panel-elevated w-full max-w-lg p-6 sm:p-8 rounded-3xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {modalType === 'privacy' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#1f108e]">
                  <Shield className="w-6 h-6 text-[#712ae2]" />
                  <h3 className="text-lg font-bold">Privacy Policy</h3>
                </div>
                <p className="text-xs text-slate-500">Last updated: August 2026</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  DocuClean AI enforces strict zero-retention policies for uploaded documents.
                  Your documents are processed in-memory, cleaned contextually via secure algorithms,
                  and purged immediately upon session completion. We never store, resell, or train
                  public models on your sensitive proprietary files.
                </p>
                <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900">
                  ✓ Enterprise SOC2 Type II Certified<br />
                  ✓ End-to-End TLS 1.3 Transport Encryption<br />
                  ✓ Client-Side Zero Storage Option Enabled
                </div>
              </div>
            )}

            {modalType === 'terms' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#1f108e]">
                  <FileText className="w-6 h-6 text-[#712ae2]" />
                  <h3 className="text-lg font-bold">Terms of Service</h3>
                </div>
                <p className="text-xs text-slate-500">Enterprise Service Agreement</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  By utilizing DocuClean AI, you retain 100% intellectual ownership of all source
                  files and generated cleaned artifacts. Our service provides algorithmic noise
                  reduction, OCR reconstruction, and typography realignment under standard commercial
                  licensing.
                </p>
              </div>
            )}

            {modalType === 'support' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#1f108e]">
                  <LifeBuoy className="w-6 h-6 text-[#712ae2]" />
                  <h3 className="text-lg font-bold">Contact Support</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Our dedicated engineering and document intelligence support team is available 24/7.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="p-3 bg-white rounded-xl border border-indigo-100 text-xs text-slate-700">
                    <strong>Email:</strong> support@docuclean.ai
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-indigo-100 text-xs text-slate-700">
                    <strong>Priority SLA:</strong> Within 15 minutes for enterprise tier
                  </div>
                </div>
              </div>
            )}

            {modalType === 'api' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#1f108e]">
                  <Terminal className="w-6 h-6 text-[#712ae2]" />
                  <h3 className="text-lg font-bold">DocuClean REST & Python API</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Automate high-volume document cleaning directly within your CI/CD pipelines and ingestion services.
                </p>
                <pre className="bg-slate-900 text-slate-100 p-3 rounded-xl text-xs overflow-x-auto font-mono">
{`curl -X POST https://api.docuclean.ai/v1/clean \\
  -H "Authorization: Bearer docu_sec_..." \\
  -F "file=@contract.pdf" \\
  -F "options=remove_spaces,fix_line_breaks,correct_ocr"`}
                </pre>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="secondary-btn px-5 py-2 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
