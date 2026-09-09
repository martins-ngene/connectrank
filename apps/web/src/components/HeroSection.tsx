import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Globe, MessageSquare, Terminal } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

interface HeroSectionProps {
  onOpenUpload: () => void;
  onScrollToRecommender: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenUpload,
  onScrollToRecommender,
}) => {
  return (
    <section className="relative pt-6 sm:pt-12 pb-12 sm:pb-16 overflow-hidden">
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-gradient-to-tr from-indigo-500/15 via-violet-500/15 to-fuchsia-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />

      <div className="max-w-4xl mx-auto text-center px-4">
        {/* Top Glow Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-sm shadow-indigo-500/10 backdrop-blur-md animate-fade-in-up">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
          <span>Open-Source AI Semantic Search & Authority Ranker</span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.15] text-slate-900 dark:text-white animate-fade-in-up animate-delay-100">
          Supercharge Your Network with{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
            Smart Outreach AI
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-4 sm:mt-6 text-slate-600 dark:text-slate-300 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal animate-fade-in-up animate-delay-200">
          Rank your personal LinkedIn connections by fusing <strong>dense semantic relevance</strong> (what they do) with <strong>hiring authority</strong> (CTOs, Founders, Tech Leads). 100% ephemeral in-memory processing with strict zero-persistence privacy.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 animate-fade-in-up animate-delay-300">
          <button
            onClick={onScrollToRecommender}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span>Launch ConnectRank Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenUpload}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-500 text-sm font-semibold transition-all hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span>Upload Connections.csv</span>
          </button>

          <a
            href="https://github.com/martins-ngene/connectrank"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-slate-300 dark:hover:border-slate-800 transition-all text-sm font-medium hover:scale-[1.02]"
          >
            <GithubIcon className="w-4 h-4" />
            <span>Star on GitHub</span>
          </a>
        </div>

        {/* Proof & Invariant Metrics Bar */}
        <div className="mt-12 p-3 sm:p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 text-left animate-fade-in-up animate-delay-400">
          <div className="flex items-start gap-2 sm:gap-3 hover:-translate-y-0.5 transition-transform duration-200 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-2xl font-display font-bold text-slate-900 dark:text-white truncate">100%</div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight">Zero-Persistence RAM</div>
            </div>
          </div>

          <div className="flex items-start gap-2 sm:gap-3 hover:-translate-y-0.5 transition-transform duration-200 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-2xl font-display font-bold text-slate-900 dark:text-white truncate">&lt;120ms</div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight">Vector Cosine Latency</div>
            </div>
          </div>

          <div className="flex items-start gap-2 sm:gap-3 hover:-translate-y-0.5 transition-transform duration-200 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-2xl font-display font-bold text-slate-900 dark:text-white truncate">70+</div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight">Remote-First Registry</div>
            </div>
          </div>

          <div className="flex items-start gap-2 sm:gap-3 hover:-translate-y-0.5 transition-transform duration-200 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-xl bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 shrink-0">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-2xl font-display font-bold text-slate-900 dark:text-white truncate">3 Modes</div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight">Bespoke DM Strategies</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
