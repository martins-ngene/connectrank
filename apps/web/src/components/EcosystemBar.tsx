import React from 'react';
import { Cpu, Database, Layers, ShieldCheck, Sparkles, Terminal, Code2 } from 'lucide-react';

export const EcosystemBar: React.FC = () => {
  const technologies = [
    { label: 'LinkedIn Data Export', desc: 'Standard CSV Archives', icon: Database },
    { label: 'FastAPI 0.115', desc: 'Asynchronous Python Core', icon: Terminal },
    { label: 'SentenceTransformers', desc: 'MiniLM-L6-v2 Embeddings', icon: Sparkles },
    { label: 'PyTorch & NumPy', desc: 'RAM-Only Vector Similarity', icon: Cpu },
    { label: 'React 19 & Vite', desc: 'High-Performance UI', icon: Code2 },
    { label: 'Radix UI & Tailwind v4', desc: 'Accessible Design System', icon: Layers },
  ];

  return (
    <section className="py-6 border-y border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-xs uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500 mb-4">
          Powered By Modern Open-Source Intelligence & Zero-Persistence Architecture
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 items-center justify-center">
          {technologies.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.label}
                className="flex flex-col items-center p-3 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/60 shadow-xs hover:border-indigo-500/40 transition-colors"
              >
                <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-1.5" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{t.label}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{t.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
