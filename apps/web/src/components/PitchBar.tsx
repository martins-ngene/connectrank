import React, { useState } from 'react';
import { Search, Sparkles, X } from 'lucide-react';

interface PitchBarProps {
  onSearch: (pitch: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

const PRESET_PITCHES = [
  'Senior Backend Engineer Python AWS',
  'Founding Engineer Distributed Systems',
  'Technical Recruiter / Talent Lead',
  'Staff Platform Architect Kubernetes',
  'VP of Engineering & Head of Tech',
];

export const PitchBar: React.FC<PitchBarProps> = ({
  onSearch,
  isLoading,
  initialValue = 'Senior Backend Engineer Python AWS',
}) => {
  const [pitch, setPitch] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pitch.trim()) {
      onSearch(pitch.trim());
    }
  };

  const handleSelectPreset = (preset: string) => {
    setPitch(preset);
    onSearch(preset);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 sm:left-4 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
          </div>

          <input
            type="text"
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            placeholder="Describe your ideal role or pitch (e.g. 'Senior Backend Engineer')..."
            className="w-full pl-10 sm:pl-12 pr-22 sm:pr-28 py-3.5 sm:py-4 bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base shadow-xl backdrop-blur-md outline-none transition-all"
          />

          {pitch && (
            <button
              type="button"
              onClick={() => setPitch('')}
              className="absolute right-20 sm:right-24 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full"
              aria-label="Clear pitch"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !pitch.trim()}
            className="absolute right-1.5 sm:right-2.5 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 disabled:opacity-50 text-white font-medium rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-indigo-600/30 active:scale-95 flex items-center gap-1 sm:gap-1.5 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Chips */}
      <div className="mt-3 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:flex-wrap text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Quick Pitches:</span>
        {PRESET_PITCHES.map((preset) => (
          <button
            key={preset}
            onClick={() => handleSelectPreset(preset)}
            className="shrink-0 whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800/80 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500/30 transition-all cursor-pointer"
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
};
