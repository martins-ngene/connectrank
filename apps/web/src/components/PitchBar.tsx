import React, { useState } from 'react';
import { Search, Sparkles, X } from 'lucide-react';

interface PitchBarProps {
  onSearch: (pitch: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

const PRESET_PITCHES = [
  'Senior Backend Engineer (Python / AWS)',
  'Technical Recruiter / Talent Lead',
  'CEO / Founder',
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
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-2.5 text-slate-400 pointer-events-none">
            <Search className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          </div>

          <input
            type="text"
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            placeholder="Search role or skills (e.g. 'Backend Engineer')..."
            className="w-full pl-8 pr-16 py-1.5 sm:py-2 bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/70 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs shadow-sm backdrop-blur-md outline-none transition-all"
          />

          {pitch && (
            <button
              type="button"
              onClick={() => setPitch('')}
              className="absolute right-14 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full cursor-pointer"
              aria-label="Clear pitch"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !pitch.trim()}
            className="absolute right-1 px-2.5 py-1 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 disabled:opacity-50 text-white font-medium rounded-md text-[11px] transition-all shadow-sm active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Chips */}
      <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[10px]">
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium shrink-0">Quick:</span>
        {PRESET_PITCHES.map((preset) => (
          <button
            key={preset}
            onClick={() => handleSelectPreset(preset)}
            className="whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-100 hover:bg-blue-50 dark:bg-slate-800/80 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700/60 hover:border-blue-500/30 transition-all text-[10px] cursor-pointer"
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
};
