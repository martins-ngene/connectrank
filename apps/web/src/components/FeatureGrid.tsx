import React from 'react';
import { Search, Crown, Globe, MessageSquare, ShieldCheck, Code } from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: Search,
      title: 'Semantic Skill Matching',
      badge: 'MiniLM-L6-v2',
      description:
        'Understands technical roles and domains, surfacing relevant connections even when their exact title phrasing varies.',
    },
    {
      icon: Crown,
      title: 'Decision-Maker Priority',
      badge: '0.1 – 1.0 Multiplier',
      description:
        'Surfaces founders, CTOs, and engineering leads who have direct hiring authority, boosting response rates.',
    },
    {
      icon: Globe,
      title: 'Remote-First Filter',
      badge: '70+ Verified Companies',
      description:
        'Instantly filter your network for connections at verified distributed and remote-first organizations.',
    },
    {
      icon: MessageSquare,
      title: 'Personalized Outreach Drafts',
      badge: '3 Frameworks',
      description:
        'Pre-built, customizable outreach templates tailored for decision-makers, peer referrals, and consulting proposals.',
    },
    {
      icon: ShieldCheck,
      title: 'Zero-Persistence Privacy',
      badge: 'RAM Only',
      description:
        'Your connection data lives strictly in temporary session memory. Nothing is ever written to a database or disk.',
    },
    {
      icon: Code,
      title: 'Open Source & Transparent',
      badge: 'MIT License',
      description:
        'Fully open source with no third-party tracking, ads, or hidden data sales. Inspect the code or run it locally.',
    },
  ];

  return (
    <section
      id="features"
      className="scroll-mt-16 min-h-[calc(100dvh-4rem)] flex flex-col justify-center py-20 sm:py-28 relative border-t border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            Key{' '}
            <span className="bg-gradient-to-r from-blue-600 to-sky-500 dark:from-blue-400 dark:to-sky-300 bg-clip-text text-transparent">
              Capabilities
            </span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Everything you need to turn raw connections into warm conversations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between border border-slate-200 dark:border-slate-800/80 group hover:border-blue-500/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2">
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
