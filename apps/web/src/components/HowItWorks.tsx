import React from 'react';
import { Download, Sliders, Send, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onOpenUpload: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenUpload }) => {
  const steps = [
    {
      num: '01',
      title: 'Export your LinkedIn connections',
      desc: 'Download your Connections.csv archive directly from LinkedIn (Settings & Privacy → Data Privacy). It takes just a couple of minutes.',
      icon: Download,
      action: 'Upload Connections.csv',
      isInteractive: true,
    },
    {
      num: '02',
      title: 'Balance relevance & seniority',
      desc: 'Adjust weights to prioritize either exact technical skill alignment or executive decision-maker authority.',
      icon: Sliders,
      action: 'Instant in-session ranking',
      isInteractive: false,
    },
    {
      num: '03',
      title: 'Reach out with tailored drafts',
      desc: 'Generate thoughtful outreach messages crafted specifically for hiring managers, peer referrals, or consulting proposals.',
      icon: Send,
      action: 'Copy and message directly',
      isInteractive: false,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            How ConnectRank{' '}
            <span className="bg-gradient-to-r from-blue-600 to-sky-600 dark:from-blue-400 dark:to-sky-300 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            No web scraping, no credential sharing, and no invasive browser extensions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between relative group hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl sm:text-3xl font-display font-bold text-blue-600/30 dark:text-blue-400/30">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
                  {step.isInteractive ? (
                    <button
                      onClick={onOpenUpload}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
                    >
                      <span>{step.action}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
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
