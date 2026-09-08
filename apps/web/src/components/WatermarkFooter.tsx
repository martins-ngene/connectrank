import React from 'react';
import { Heart, ShieldCheck, ExternalLink } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { ConnectRankLogo } from './ConnectRankLogo';

interface WatermarkFooterProps {
  onOpenUpload: () => void;
  onOpenTerms: () => void;
  onScrollToRecommender: () => void;
}

export const WatermarkFooter: React.FC<WatermarkFooterProps> = ({
  onOpenUpload,
  onOpenTerms,
  onScrollToRecommender,
}) => {
  return (
    <footer className="relative border-t border-slate-200/80 dark:border-slate-800/80 pt-16 pb-12 overflow-hidden bg-slate-100/60 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <ConnectRankLogo size={32} withBackground />
              <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Connect<span className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">Rank</span>
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Open Source
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              An open-source, privacy-first semantic recommendation engine that turns raw LinkedIn connection archives into high-probability cold outreach conversations with hiring decision-makers.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/martins-ngene/connectrank"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Application
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={onScrollToRecommender}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Interactive ConnectRank Hub
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenUpload}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Upload Connections.csv
                </button>
              </li>
              <li>
                <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  AI Capabilities Matrix
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Privacy & Open Source */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Privacy &amp; Compliance
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>GDPR Article 17 Policy &amp; Terms</span>
                </button>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-500">
                  Strict Zero-Persistence RAM Architecture
                </span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-500">
                  MIT License • 100% Free for Developers
                </span>
              </li>
              <li>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  Independent developer utility. Not affiliated with LinkedIn Corp.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 ConnectRank. Open source and built for high-impact professional outreach.</p>
          <p className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 inline" /> for modern job seekers &amp; consultants.
          </p>
        </div>
      </div>

      {/* Giant Futuristic Watermark Typography */}
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
