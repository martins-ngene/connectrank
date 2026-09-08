import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, ExternalLink } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'How does the Zero-Persistence RAM architecture guarantee my data privacy?',
    a: 'When you upload Connections.csv, your file is parsed and vectorized strictly in volatile RAM. No Personally Identifiable Information (PII) like names, companies, or contact links is ever written to disk, database, or object storage. Sessions are automatically garbage-collected after 30 minutes, or you can purge them immediately with a single click via our GDPR Article 17 Right-to-Erasure endpoint.',
  },
  {
    q: 'How does the Remote / Worldwide company filter work without a location column in LinkedIn exports?',
    a: 'LinkedIn CSV exports omit workplace type attributes (Remote vs. On-site). We engineered a 3-tier heuristic classification engine: 1) exact matching against a curated database of 70+ established remote-first employers (GitLab, Automattic, Deel, Supabase, etc.), 2) regex token parsing for distributed company names, and 3) regex detection on role titles matching tokens like "(Remote)", "Worldwide", "Global", or "WFA".',
  },
  {
    q: 'Is ConnectRank affiliated with or authorized by LinkedIn Corporation?',
    a: 'No. ConnectRank is an independent, open-source developer utility and is not affiliated with, sponsored by, or endorsed by LinkedIn Corporation or Microsoft. It relies solely on your official, user-requested data export archive, requiring zero scraping, zero automated bots, and zero third-party credential access.',
  },
  {
    q: 'How are the Semantic Match and Hiring Authority scores calculated?',
    a: 'We generate 384-dimensional dense semantic vector embeddings using sentence-transformers/all-MiniLM-L6-v2 to evaluate conceptual role similarity. Simultaneously, a seniority heuristic inspects position titles to assign authority weights (1.0 for Founders/CTOs/VPs, 0.7 for Engineering Leads, and 0.4 for Senior Engineers). You can dynamically tune the balance between semantic accuracy and authority rank using the interactive slider.',
  },
  {
    q: 'Can I customize the generated Cold DM message drafts?',
    a: 'Yes! The Cold DM Generator provides 3 tailored strategies: Direct Decision Maker Pitch, Peer/Referral Inquiry, and Consulting/Gig Offer. All drafts are rendered in an editable textarea before copying, allowing you to add personal touches, portfolio links, or custom notes before reaching out on LinkedIn.',
  },
  {
    q: 'How do I download my Connections.csv archive from LinkedIn?',
    a: "Navigate to LinkedIn → Settings & Privacy → Data Privacy → 'Get a copy of your data'. Check the 'Connections' box and request your archive. LinkedIn will email a secure download link containing Connections.csv within 5 to 10 minutes.",
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Heading & Callout */}
          <div className="lg:col-span-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3 border border-indigo-500/20">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Questions &amp; Answers</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Everything you need to know about our privacy-first vector ranking architecture, remote detection, and outreach ethics.
            </p>

            <div className="mt-6 p-4 rounded-xl glass-panel border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Client &amp; RAM Safety</span>
              </div>
              <p>
                Have questions about your data security? Read our detailed{' '}
                <a href="#terms" className="text-indigo-600 dark:text-indigo-400 font-semibold underline">
                  Zero-Persistence Policy
                </a>.
              </p>
            </div>
          </div>

          {/* Right Column: Accordion Items */}
          <div className="lg:col-span-8 space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.q}
                  className={`rounded-2xl border transition-all glass-panel overflow-hidden ${
                    isOpen
                      ? 'border-indigo-500/50 bg-white dark:bg-slate-900/90 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-indigo-500' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
