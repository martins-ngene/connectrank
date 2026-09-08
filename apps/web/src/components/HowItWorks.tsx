import React from 'react';
import { Download, Cpu, Send, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onOpenUpload: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenUpload }) => {
  const steps = [
    {
      num: '01',
      title: 'Export Your Data from LinkedIn',
      desc: 'Request your free archive under Settings & Privacy → Data Privacy. LinkedIn emails your Connections.csv in minutes.',
      icon: Download,
      action: 'Click to upload your CSV',
      isInteractive: true,
    },
    {
      num: '02',
      title: 'Tune Semantic vs. Authority Weights',
      desc: 'Our RAM-only engine generates 384-dimensional dense embeddings and blends skill similarity with hiring seniority in milliseconds.',
      icon: Cpu,
      action: 'Real-time in volatile RAM',
      isInteractive: false,
    },
    {
      num: '03',
      title: 'Dispatch High-Converting Cold DMs',
      desc: 'Select strategic templates tailored for Founders, Engineering Leads, or contract work. Copy with 1 click and message directly.',
      icon: Send,
      action: 'Land warm responses',
      isInteractive: false,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold mb-3 border border-violet-500/20">
            <span>Simple 3-Step Workflow</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            How ConnectRank{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-purple-300 bg-clip-text text-transparent">
              Transforms Outreach
            </span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            No scraping, no browser extensions that violate LinkedIn's terms of service, and no sensitive credentials shared.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between relative group hover:border-indigo-500/50 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl sm:text-3xl font-display font-black text-indigo-600/30 dark:text-indigo-400/30 group-hover:text-indigo-500/50 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
                  {step.isInteractive ? (
                    <button
                      onClick={onOpenUpload}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer"
                    >
                      <span>{step.action}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>{step.action}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
