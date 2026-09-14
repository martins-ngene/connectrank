import React from 'react';
import { ExternalLink } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { ConnectRankLogo } from './ConnectRankLogo';

interface WatermarkFooterProps {
  onOpenUpload: () => void;
  onOpenTerms?: () => void;
  onScrollToRecommender: () => void;
}

export const WatermarkFooter: React.FC<WatermarkFooterProps> = ({
  onOpenUpload,
  onScrollToRecommender,
}) => {
  return (
    <footer className="relative border-t border-slate-200/80 dark:border-slate-800/80 pt-16 pb-12 bg-slate-100/50 dark:bg-slate-950 overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {/* Brand Identity Group */}
        <div className="flex items-center justify-center gap-2.5 mb-3">
          <ConnectRankLogo size={28} withBackground />
          <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
            Connect<span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">Rank</span>
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Open Source
          </span>
        </div>

        {/* Brand Tagline */}
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto mb-6">
          An open-source, privacy-first tool to discover and rank relevant decision-makers in your LinkedIn network for warm outreach.
        </p>

        {/* Nicely Grouped Navigation & Repo Links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium mb-8">
          <button
            onClick={onScrollToRecommender}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            Workspace
          </button>
          <button
            onClick={onOpenUpload}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            Upload Connections.csv
          </button>
          <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            How It Works
          </a>
          <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Features
          </a>
          <a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Pricing
          </a>
          <a
            href="https://github.com/martins-ngene/connectrank"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-white transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </nav>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 ConnectRank. Released under the MIT License.</p>
        </div>
      </div>

      {/* Giant Background Watermark Typography */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 select-none pointer-events-none text-center w-full overflow-hidden opacity-5 dark:opacity-[0.035] -z-0"
        aria-hidden="true"
      >
        <span className="text-[16vw] font-display font-black tracking-tighter text-slate-900 dark:text-white leading-none whitespace-nowrap block">
          ConnectRank
        </span>
      </div>
    </footer>
  );
};
