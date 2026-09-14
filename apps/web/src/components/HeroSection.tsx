import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
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
    <section className="relative min-h-[calc(100dvh-4rem)] flex flex-col justify-between items-center pt-8 sm:pt-12 pb-6 sm:pb-8 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-gradient-to-tr from-blue-500/10 via-sky-500/8 to-blue-400/8 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Empty spacer for balanced flex-col justify-between */}
      <div className="hidden sm:block h-2" aria-hidden="true" />

      {/* Main Center Content */}
      <div className="max-w-4xl mx-auto text-center px-4 my-auto">
        {/* Hero Headline */}
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.15] text-slate-900 dark:text-white animate-fade-in-up">
          Supercharge Your Network with{' '}
          <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 dark:from-blue-400 dark:via-sky-300 dark:to-blue-200 bg-clip-text text-transparent">
            Smart Outreach
          </span>
        </h1>

        {/* Human-focused Sub-headline */}
        <p className="mt-4 sm:mt-5 text-slate-600 dark:text-slate-300 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal animate-fade-in-up animate-delay-100">
          Find the right decision-makers, engineering leads, and peers in your LinkedIn network. Ranked by skill relevance and role seniority — processed privately in your browser session.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 animate-fade-in-up animate-delay-200">
          <button
            onClick={onScrollToRecommender}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-semibold text-sm shadow-md shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span>Launch ConnectRank Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenUpload}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-500 text-sm font-semibold transition-all hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span>Upload Connections.csv</span>
          </button>

          <a
            href="https://github.com/martins-ngene/connectrank"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-slate-300 dark:border-slate-800 transition-all text-sm font-medium hover:scale-[1.02]"
          >
            <GithubIcon className="w-4 h-4" />
            <span>Star on GitHub</span>
          </a>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="pt-6 animate-fade-in-up animate-delay-300">
        <button
          onClick={onScrollToRecommender}
          className="inline-flex flex-col items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors cursor-pointer group"
          aria-label="Scroll to workspace"
        >
          <span className="text-[11px] font-medium tracking-wide uppercase opacity-70 group-hover:opacity-100">
            Explore Workspace
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-blue-500/80 group-hover:text-blue-500" />
        </button>
      </div>
    </section>
  );
};
