import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { Sliders, RotateCcw, Brain, Crown, Globe } from 'lucide-react';

interface WeightSlidersProps {
  semanticWeight: number; // 0.0 to 1.0
  authorityWeight: number; // 0.0 to 1.0
  topK: number;
  minAuthority: number | undefined;
  remoteOnly: boolean;
  onChangeWeights: (sem: number, auth: number) => void;
  onChangeTopK: (topK: number) => void;
  onChangeMinAuthority: (minAuth: number | undefined) => void;
  onChangeRemoteOnly: (enabled: boolean) => void;
  onReset: () => void;
}

export const WeightSliders: React.FC<WeightSlidersProps> = ({
  semanticWeight,
  authorityWeight,
  topK,
  minAuthority,
  remoteOnly,
  onChangeWeights,
  onChangeTopK,
  onChangeMinAuthority,
  onChangeRemoteOnly,
  onReset,
}) => {
  const semPercent = Math.round(semanticWeight * 100);
  const authPercent = Math.round(authorityWeight * 100);

  const handleSliderChange = (value: number[]) => {
    const sem = value[0] / 100;
    const auth = Number((1 - sem).toFixed(2));
    onChangeWeights(sem, auth);
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 mb-6 sm:mb-8">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
          <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>Ranking Formula &amp; Authority Tuner</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
          title="Reset to 60/40 defaults"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-center">
        {/* Composite Ratio Slider */}
        <div>
          <div className="flex justify-between text-[11px] sm:text-xs mb-2">
            <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-medium">
              <Brain className="w-3.5 h-3.5" />
              Semantic Match: {semPercent}%
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-medium">
              <Crown className="w-3.5 h-3.5" />
              Authority Weight: {authPercent}%
            </span>
          </div>

          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
            value={[semPercent]}
            max={100}
            min={0}
            step={5}
            onValueChange={handleSliderChange}
          >
            <Slider.Track className="bg-slate-200 dark:bg-slate-800 relative grow rounded-full h-2 overflow-hidden">
              <Slider.Range className="absolute bg-gradient-to-r from-blue-600 via-sky-500 to-amber-500 h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 bg-white shadow-lg ring-2 ring-blue-500 rounded-full hover:scale-110 focus:outline-none transition-transform"
              aria-label="Composite ratio"
            />
          </Slider.Root>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Slide right to prioritize hiring authority; slide left to prioritize exact skill match.
          </p>
        </div>

        {/* Filter Chips & Top K */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Seniority Filter */}
          <div className="w-full sm:w-auto">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1.5">Minimum Seniority:</label>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 text-xs">
              {[
                { label: 'All', val: undefined },
                { label: 'Senior (0.4+)', val: 0.4 },
                { label: 'Leads (0.7+)', val: 0.7 },
                { label: 'Founders/CTOs (1.0)', val: 1.0 },
              ].map((tier) => (
                <button
                  key={tier.label}
                  onClick={() => onChangeMinAuthority(tier.val)}
                  className={`px-2 py-1.5 sm:px-2.5 sm:py-1 rounded-lg border text-center transition-all cursor-pointer text-xs ${
                    minAuthority === tier.val
                      ? 'bg-blue-600/15 dark:bg-blue-600/30 text-blue-700 dark:text-blue-300 border-blue-500/50 font-medium'
                      : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-300'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Top K Selector */}
          <div className="w-full sm:w-auto">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1.5">Show Candidates:</label>
            <select
              value={topK}
              onChange={(e) => onChangeTopK(Number(e.target.value))}
              className="w-full sm:w-auto bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value={10}>Top 10</option>
              <option value={15}>Top 15</option>
              <option value={25}>Top 25</option>
              <option value={50}>Top 50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Remote / Worldwide / Global Company Filter Toggle */}
      <div className="mt-5 pt-3.5 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${
            remoteOnly ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}>
            <Globe className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                Remote / Anywhere / Worldwide Only
              </span>
              {remoteOnly && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  Active
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block line-clamp-1 sm:line-clamp-none">
              Filter for connections in companies hiring for remote, worldwide, or global roles
            </span>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          id="remote-worldwide-toggle"
          aria-checked={remoteOnly}
          onClick={() => onChangeRemoteOnly(!remoteOnly)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
            remoteOnly ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'
          }`}
          title="Toggle Remote / Worldwide / Global Company filter"
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              remoteOnly ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
