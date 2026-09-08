import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ShieldCheck, Scale, AlertTriangle, Lock, Trash2, Info } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId?: string | null;
  onPurgeSession?: () => void;
  isPurging?: boolean;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  sessionId,
  onPurgeSession,
  isPurging,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94vw] max-w-2xl max-h-[88vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-4 sm:p-6 z-50 text-white outline-none animate-in zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
                <Scale className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <Dialog.Title className="font-display font-semibold text-base sm:text-lg text-white truncate">
                  Terms of Service & GDPR Privacy Policy
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-400 truncate">
                  Last Updated: September 2026 • Privacy-by-Design Specification
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-4 sm:mt-5 space-y-5 sm:space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {/* Section 1: GDPR Privacy */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>1. Zero-Persistence Privacy Policy (GDPR Compliant)</span>
              </div>
              <p>
                We are committed to absolute data privacy. This application is engineered with a strict <strong>zero-persistence architecture</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li><strong>No User Accounts:</strong> You do not need to register, log in, or provide personal credentials.</li>
                <li><strong>Volatile RAM Processing Only:</strong> When you upload a LinkedIn <code className="text-indigo-300">Connections.csv</code>, all profile parsing and vector embedding calculations occur purely in server RAM. No Personally Identifiable Information (PII) is ever written to disk, databases, or persistent object storage.</li>
                <li><strong>Automatic Expiration (TTL):</strong> Inactive sessions are automatically destroyed and garbage-collected from server memory after 30 minutes.</li>
                <li><strong>Right to Erasure (GDPR Article 17):</strong> You retain complete control over your data. Clicking the <strong>'Purge My Data'</strong> button located in the top navigation bar (or directly below) immediately and irreversibly purges your session and all vector indices from server memory.</li>
                <li><strong>No Third-Party AI Data Sharing:</strong> Embeddings are computed locally using open-source SentenceTransformers. Your LinkedIn network data is never sent to OpenAI, Anthropic, or external model providers.</li>
              </ul>

              {/* Direct Action Box inside the Modal */}
              <div className="mt-3 p-3 sm:p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs min-w-0">
                  <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                  {sessionId ? (
                    <span className="text-slate-200">
                      <strong>Active Custom Session:</strong> Your uploaded profile data is currently resident in RAM.
                    </span>
                  ) : (
                    <span className="text-slate-300">
                      <strong>Current Mode: Demo Network</strong> (No personal data or uploaded CSV exists in memory).
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    onPurgeSession?.();
                    onClose();
                  }}
                  disabled={isPurging}
                  className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    sessionId
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/40 active:scale-95'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600'
                  }`}
                  title="Purge session data from server RAM"
                >
                  <Trash2 className={`w-3.5 h-3.5 ${sessionId ? 'text-white' : 'text-slate-400'}`} />
                  <span>
                    {isPurging
                      ? 'Purging...'
                      : sessionId
                      ? 'Purge My Data Now'
                      : 'Purge My Data (Demo Mode)'}
                  </span>
                </button>
              </div>
            </div>

            {/* Section 2: Terms of Service */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                <Lock className="w-4 h-4" />
                <span>2. Acceptable Use & Outreach Etiquette</span>
              </div>
              <p>
                By using this tool to generate cold message recommendations:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>You agree to use message drafts strictly for authentic professional networking, contract discovery, and career referral inquiries.</li>
                <li>You agree NOT to use this service for unsolicited bulk marketing, spamming, harassment, or violating LinkedIn's Professional Community Policies.</li>
                <li>You are solely responsible for reviewing and editing all message copy before sending it to your connections.</li>
              </ul>
            </div>

            {/* Section 3: Disclaimer & Trademarks */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>3. Non-Affiliation Disclaimer</span>
              </div>
              <p className="text-slate-400">
                This project is an independent developer utility and is <strong>not affiliated with, sponsored by, authorized by, or endorsed by LinkedIn Corporation, Microsoft Corporation, or any of their subsidiaries</strong>. The term "LinkedIn" and associated marks are registered trademarks of LinkedIn Corporation.
              </p>
              <p className="text-slate-400">
                The software is provided "AS IS", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
            >
              I Understand & Agree
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
