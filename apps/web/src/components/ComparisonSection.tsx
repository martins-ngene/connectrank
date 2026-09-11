import React from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

interface ComparisonSectionProps {
  onScrollToRecommender: () => void;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({ onScrollToRecommender }) => {
  return (
    <section className="py-16 sm:py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3 border border-blue-500/20">
            <span>Simple, Honest Model</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            Transparent Pricing{' '}
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 dark:from-blue-400 dark:via-sky-300 dark:to-blue-200 bg-clip-text text-transparent">
              No Hidden Fees
            </span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Unlike commercial sales CRMs that charge hundreds of dollars per seat while harvesting your connections, ConnectRank provides a 100% free local engine with an optional pro cloud tier coming soon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto items-stretch">
          {/* Card 1: ACTIVE / REAL FREE OPEN SOURCE */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl border-2 border-blue-500/50 dark:border-blue-500/60 shadow-xl shadow-blue-500/10 flex flex-col justify-between relative bg-white/90 dark:bg-slate-900/90 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Active &amp; 100% Free
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                Community Open Source
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white">$0</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ Free Forever</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Full-featured local and self-hosted recommendation engine with complete privacy guarantees.
              </p>

              <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>100% Zero-Persistence RAM</strong> (0 disk writes)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Dense Vector MiniLM-L6-v2 Embeddings</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>All 3 Tailored Cold DM Strategies</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Remote / Worldwide 70+ Employer Filter</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Unlimited Searches &amp; 15-Item Pagination</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Immediate GDPR Article 17 Purge</span>
                </div>
              </div>
            </div>

            <button
              onClick={onScrollToRecommender}
              className="mt-8 w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/25 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Use Free ConnectRank Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: CONNECTRANK PRO ($10/mo) - COMING SOON */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl border-2 border-sky-500/40 dark:border-sky-500/40 shadow-xl shadow-sky-500/5 flex flex-col justify-between relative bg-white/90 dark:bg-slate-900/90 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-sky-500/20 transition-all duration-300">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Coming Soon</span>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1 flex items-center gap-1.5">
                <span>ConnectRank Pro</span>
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white">$10</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ month</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Enhanced cloud capabilities for active networkers, job seekers, and recruiters.
              </p>

              <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <span><strong>Everything in Community Free</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <span>Multi-Model AI Semantic Search (MiniLM + BGE-Large)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <span>AI-Enriched Candidate Summaries &amp; Match Highlights</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <span>Zero-Knowledge Encrypted Session Cloud Vault</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <span>Custom Persona Tone &amp; Cold DM Style Tuning</span>
                </div>
              </div>
            </div>

            <div className="mt-8 w-full py-2.5 rounded-xl bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/20 text-sky-600 dark:text-sky-400 font-semibold text-xs flex items-center justify-center gap-1.5 select-none">
              <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
              <span>Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
