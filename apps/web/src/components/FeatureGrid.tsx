import React from 'react';
import { Brain, Crown, Globe, MessageSquare, ShieldCheck, Cpu } from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'Dense Vector Semantic Search',
      badge: 'MiniLM-L6-v2',
      description:
        'Encodes roles and pitches into 384-dimensional dense embeddings to surface relevant domain experts regardless of keyword variances.',
    },
    {
      icon: Crown,
      title: 'Hiring Authority Heuristic Scoring',
      badge: '0.0 – 1.0 Multiplier',
      description:
        'Dynamically boosts technical decision-makers (CTOs, Founders, VPs, Leads) over generic connections to maximize response rates.',
    },
    {
      icon: Globe,
      title: '3-Tier Remote & Global Classifier',
      badge: '70+ Verified Companies',
      description:
        'Heuristic engine cross-references employers with verified remote-first registries and distributed role tokens across unstructured titles.',
    },
    {
      icon: MessageSquare,
      title: 'Personalized Cold DM Strategies',
      badge: '3 Tailored Frameworks',
      description:
        'Instant customizable drafts: High-impact decision-maker pitches, casual peer referral inquiries, and fractional consulting bandwidth offers.',
    },
    {
      icon: ShieldCheck,
      title: 'GDPR Zero-Persistence RAM Invariant',
      badge: '0 Disk Writes',
      description:
        'Your network data exists purely in volatile server RAM. No user accounts, zero database persistence, and immediate Right-to-Erasure purging.',
    },
    {
      icon: Cpu,
      title: '100% Open Source & Self-Hostable',
      badge: 'MIT Licensed',
      description:
        'Full transparency with no closed proprietary models or external cloud API keys. Run locally on your laptop or deploy via Docker.',
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3 border border-indigo-500/20">
            <span>Engineered Capabilities</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            AI-Powered Solutions for{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
              High-Yield Network Outreach
            </span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Eliminate hours of manual spreadsheet auditing. Discover the highest-leverage opportunities hiding in your 1st-degree connections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between border border-slate-200 dark:border-slate-800/80 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/15 via-violet-500/15 to-fuchsia-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
