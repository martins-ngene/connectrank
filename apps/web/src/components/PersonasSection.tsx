import React from 'react';
import { Code, Briefcase, Globe2, Users, CheckCircle2 } from 'lucide-react';

export const PersonasSection: React.FC = () => {
  const personas = [
    {
      title: 'Software Engineers & Architects',
      tag: 'Skip ATS Black Holes',
      icon: Code,
      accent: 'border-blue-500/30 text-blue-500',
      description: 'Stop submitting resumes into opaque job portals. Connect directly with technical hiring managers and senior peers in your 1st-degree network to secure internal referrals.',
      points: [
        'Prioritize Founders, CTOs, and Engineering Leads',
        'Semantic match for niche technical stacks (Python, AWS, K8s)',
        'Peer referral template with casual engineering etiquette',
      ],
    },
    {
      title: 'Freelancers & Tech Consultants',
      tag: 'Win High-Ticket Advisory Deals',
      icon: Briefcase,
      accent: 'border-sky-500/30 text-sky-500',
      description: 'Re-activate dormant professional connections who hold budget-approving authority. Pitch targeted fractional bandwidth without full-time onboarding lag.',
      points: [
        'Consulting / Gig Offer cold message strategy',
        'Direct identification of executive budget decision-makers',
        'Zero spam, authentic 1-on-1 networking',
      ],
    },
    {
      title: 'Digital Nomads & Global Seekers',
      tag: 'Isolate Worldwide-First Roles',
      icon: Globe2,
      accent: 'border-emerald-500/30 text-emerald-500',
      description: 'Filter your entire network instantly for connections employed by verified work-from-anywhere companies (GitLab, Automattic, Deel, Supabase, etc.).',
      points: [
        '70+ verified remote employer classification',
        'Automated title regex matching for global & distributed roles',
        'One-click remote-only results toggle',
      ],
    },
    {
      title: 'Startup Founders & Talent Leads',
      tag: 'Mine Warm 1st-Degree Talent',
      icon: Users,
      accent: 'border-blue-500/30 text-blue-500',
      description: 'Avoid paying high monthly seat fees for commercial recruiter tools when your personal network already holds senior advisors, co-founders, and specialists.',
      points: [
        'Fine-grained seniority filters (0.4+ to 1.0 CTOs)',
        'Rapid 15-item candidate pagination',
        'Completely private with zero data persistence',
      ],
    },
  ];

  return (
    <section id="personas" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3 border border-blue-500/20">
            <span>Tailored Use Cases</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            Purpose-Driven Outreach for{' '}
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 dark:from-blue-400 dark:via-sky-300 dark:to-blue-200 bg-clip-text text-transparent">
              Every Professional Path
            </span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Whether landing a dream engineering role, filling an advisory sprint, or hiring your first team members.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personas.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center border ${p.accent}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                          {p.title}
                        </h3>
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                          {p.tag}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-normal">
                    {p.description}
                  </p>

                  <div className="space-y-2.5">
                    {p.points.map((pt) => (
                      <div key={pt} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
