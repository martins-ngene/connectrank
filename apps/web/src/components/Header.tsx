import React from 'react';
import { ShieldCheck, Upload, Trash2, FileText, Sparkles } from 'lucide-react';

interface HeaderProps {
  sessionId: string | null;
  profileCount: number;
  onOpenUpload: () => void;
  onPurgeSession: () => void;
  onOpenTerms: () => void;
  isPurging: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  sessionId,
  profileCount,
  onOpenUpload,
  onPurgeSession,
  onOpenTerms,
  isPurging,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20 shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-display font-bold text-base sm:text-lg text-white tracking-tight">
                Opportunity<span className="text-indigo-400">Match</span>
              </span>
              <span className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">LinkedIn Network Cold DM Recommender</p>
          </div>
        </div>

        {/* Center: Privacy & Session Pill (Desktop) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-Persistence RAM</span>
          </div>
          <span className="text-slate-600">•</span>
          {sessionId ? (
            <span className="text-indigo-300 font-medium">
              Private Session: {profileCount} Profiles
            </span>
          ) : profileCount > 0 ? (
            <span className="text-slate-400">
              Demo Dataset ({profileCount} Profiles)
            </span>
          ) : (
            <span className="text-amber-400/90 font-medium">
              Ready for Upload
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            onClick={onOpenTerms}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 p-2 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="View GDPR Privacy Policy & Terms"
            aria-label="Privacy & Terms"
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span className="hidden lg:inline">Privacy & Terms</span>
          </button>

          {sessionId ? (
            <button
              onClick={onPurgeSession}
              disabled={isPurging}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow-sm shadow-rose-950 cursor-pointer shrink-0"
              title="Purge session data immediately from memory (GDPR Right to Erasure)"
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" />
              <span>{isPurging ? 'Purging...' : 'Purge Data'}</span>
            </button>
          ) : (
            <div
              className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-900/60 border border-slate-800/80 px-2.5 py-1.5 rounded-lg cursor-help"
              title="No custom data in memory. This button activates when you upload a Connections.csv."
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>Purge (Idle)</span>
            </div>
          )}

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-2.5 sm:px-3.5 py-1.5 rounded-lg shadow-sm shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Upload CSV</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-bar: Privacy & Status */}
      <div className="md:hidden flex items-center justify-between px-4 py-1 bg-slate-900/90 border-t border-slate-800/60 text-[11px]">
        <div className="flex items-center gap-1 text-emerald-400 font-medium">
          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>Zero-Persistence RAM</span>
        </div>
        <div className="text-slate-400 truncate max-w-[190px]">
          {sessionId ? (
            <span className="text-indigo-300 font-medium">Session: {profileCount} profiles</span>
          ) : profileCount > 0 ? (
            <span>Demo: {profileCount} profiles</span>
          ) : (
            <span className="text-amber-400">Ready for Upload</span>
          )}
        </div>
      </div>
    </header>
  );
};
