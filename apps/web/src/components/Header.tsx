import React from 'react';
import { ShieldCheck, Upload, Trash2, FileText, Sun, Moon } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { ConnectRankLogo } from './ConnectRankLogo';

interface HeaderProps {
  sessionId: string | null;
  profileCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenUpload: () => void;
  onPurgeSession: () => void;
  onOpenTerms: () => void;
  isPurging: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  sessionId,
  profileCount,
  isDark,
  onToggleTheme,
  onOpenUpload,
  onPurgeSession,
  onOpenTerms,
  isPurging,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-indigo-500/20">
            <ConnectRankLogo size={36} withBackground />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                Connect<span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">Rank</span>
              </span>
              <span className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden xl:block">AI Semantic Search &amp; Authority Ranker</p>
          </div>
        </a>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            How It Works
          </a>
          <a href="#recommender" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
            <span>ConnectRank</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </a>
          <a href="#personas" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Use Cases
          </a>
          <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* GitHub Repo Button */}
          <a
            href="https://github.com/martins-ngene/connectrank"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white p-2 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
            title="View ConnectRank Source Code on GitHub"
            aria-label="GitHub Repository"
          >
            <GithubIcon className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline font-medium">GitHub</span>
          </a>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Color Theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Privacy & Terms */}
          <button
            onClick={onOpenTerms}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-2 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="View GDPR Privacy Policy & Terms"
            aria-label="Privacy & Terms"
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span className="hidden xl:inline">Privacy</span>
          </button>

          {/* Session Purge / Status */}
          {sessionId ? (
            <button
              onClick={onPurgeSession}
              disabled={isPurging}
              className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow-sm cursor-pointer shrink-0"
              title="Purge session data immediately from memory (GDPR Right to Erasure)"
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" />
              <span>{isPurging ? 'Purging...' : 'Purge Data'}</span>
            </button>
          ) : (
            <div
              className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 px-2.5 py-1.5 rounded-lg cursor-help"
              title="No custom data in memory. This button activates when you upload a Connections.csv."
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
              <span>Purge (Idle)</span>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 px-2.5 sm:px-3.5 py-1.5 rounded-lg shadow-md shadow-indigo-600/25 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Upload CSV</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-bar: Privacy & Status */}
      <div className="md:hidden flex items-center justify-between px-3 py-1 bg-slate-100 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800/60 text-[11px]">
        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
          <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
          <span>Zero-Persistence RAM</span>
        </div>
        <div className="text-slate-500 dark:text-slate-400 truncate max-w-[190px]">
          {sessionId ? (
            <span className="text-indigo-600 dark:text-indigo-300 font-medium">Session: {profileCount} profiles</span>
          ) : profileCount > 0 ? (
            <span>Demo: {profileCount} profiles</span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400">Ready for Upload</span>
          )}
        </div>
      </div>
    </header>
  );
};
