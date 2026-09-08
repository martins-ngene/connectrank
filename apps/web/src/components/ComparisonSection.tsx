import React from 'react';
import { Check, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

interface ComparisonSectionProps {
  onScrollToRecommender: () => void;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({ onScrollToRecommender }) => {
  return (
    <section className="py-16 sm:py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3 border border-indigo-500/20">
            <span>Open Source vs Commercial SaaS</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            Transparent Open-Source Model{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
              No Hidden Fees
            </span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Unlike commercial sales CRMs that charge hundreds of dollars per seat while harvesting your connections, ConnectRank is 100% free and privacy-preserving.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: ACTIVE / REAL FREE OPEN SOURCE */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl border-2 border-indigo-500/50 dark:border-indigo-500/60 shadow-xl shadow-indigo-500/10 flex flex-col justify-between relative bg-white/90 dark:bg-slate-900/90">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Active &amp; 100% Free
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
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
              className="mt-8 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Use Free ConnectRank Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: CONCEPTUAL PLACEHOLDER 1 */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[9px] font-bold uppercase tracking-wider">
              [Placeholder Tier]
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                <span>Managed Cloud Vault</span>
                <span title="Placeholder concept for future cloud exploration">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                </span>
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-3xl sm:text-4xl font-display font-extrabold text-slate-400 dark:text-slate-500">$19</span>
                <span className="text-xs text-slate-400 font-medium">/ mo (Placeholder)</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                <em>Indicated placeholder concept:</em> Hosted serverless cloud instance with client-side encrypted session backups.
              </p>

              <div className="space-y-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Everything in Community Free</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Browser-encrypted multi-device sync (Placeholder)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Pre-warmed vector embedding microservice (Placeholder)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Automated monthly archive change diffing (Placeholder)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Concept Placeholder Only
              </span>
            </div>
          </div>

          {/* Card 3: CONCEPTUAL PLACEHOLDER 2 */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[9px] font-bold uppercase tracking-wider">
              [Placeholder Tier]
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                <span>Enterprise Team Hub</span>
                <span title="Placeholder concept for organization deployments">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                </span>
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-3xl sm:text-4xl font-display font-extrabold text-slate-400 dark:text-slate-500">Custom</span>
                <span className="text-xs text-slate-400 font-medium">(Placeholder)</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                <em>Indicated placeholder concept:</em> Dedicated on-premises deployment for agencies and executive search firms.
              </p>

              <div className="space-y-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Multi-team shared talent pools (Placeholder)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>SAML / Okta Single Sign-On (Placeholder)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Custom private model fine-tuning (Placeholder)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>SOC2 Type II isolation guarantee (Placeholder)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Concept Placeholder Only
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
