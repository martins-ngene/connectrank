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
    <div className="w-full glass-panel p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-2">
      {/* Title & Reset */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-900 dark:text-white">
          <Sliders className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>Ranking Formula &amp; Authority Tuner</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
          title="Reset to 60/40 defaults"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Composite Ratio Slider */}
      <div>
        <div className="flex justify-between text-[10px] mb-1">
          <span className="flex items-center gap-1 text-blue-700 dark:text-blue-300 font-medium">
            <Brain className="w-2.5 h-2.5" />
            Semantic: {semPercent}%
          </span>
          <span className="flex items-center gap-1 text-amber-700 dark:text-amber-300 font-medium">
            <Crown className="w-2.5 h-2.5" />
            Authority: {authPercent}%
          </span>
        </div>

        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-3 cursor-pointer"
          value={[semPercent]}
          max={100}
          min={0}
          step={5}
          onValueChange={handleSliderChange}
        >
          <Slider.Track className="bg-slate-200 dark:bg-slate-800 relative grow rounded-full h-1 overflow-hidden">
            <Slider.Range className="absolute bg-gradient-to-r from-blue-600 via-sky-500 to-amber-500 h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-3.5 h-3.5 bg-white shadow-sm ring-2 ring-blue-500 rounded-full hover:scale-110 focus:outline-none transition-transform"
            aria-label="Composite ratio"
          />
        </Slider.Root>
        <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
          Slide right for authority; slide left for skill match.
        </p>
      </div>

      {/* Seniority Filter & Show Count */}
      <div className="pt-1.5 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Seniority Tier:</label>
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-slate-400">Show:</span>
            <select
              value={topK}
              onChange={(e) => onChangeTopK(Number(e.target.value))}
              className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-[9px] rounded px-1 py-0.5 outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value={10}>Top 10</option>
              <option value={15}>Top 15</option>
              <option value={25}>Top 25</option>
              <option value={50}>Top 50</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1 text-[10px]">
          {[
            { label: 'All', val: undefined },
            { label: 'Senior (0.4+)', val: 0.4 },
            { label: 'Leads (0.7+)', val: 0.7 },
            { label: 'Founders/CTOs (1.0)', val: 1.0 },
          ].map((tier) => (
            <button
              key={tier.label}
              onClick={() => onChangeMinAuthority(tier.val)}
              className={`px-1.5 py-0.5 rounded border text-center transition-all cursor-pointer text-[10px] ${
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

      {/* Remote Filter Toggle */}
      <div className="pt-1.5 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0 pr-1">
          <div className={`p-0.5 rounded shrink-0 transition-colors ${
            remoteOnly ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}>
            <Globe className="w-3 h-3" />
          </div>
          <span className="text-[10px] font-semibold text-slate-900 dark:text-white truncate">
            Remote / Anywhere / Worldwide Only
          </span>
          {remoteOnly && (
            <span className="text-[8px] uppercase font-bold px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shrink-0">
              On
            </span>
          )}
        </div>

        <button
          type="button"
          role="switch"
          id="remote-worldwide-toggle"
          aria-checked={remoteOnly}
          onClick={() => onChangeRemoteOnly(!remoteOnly)}
          className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            remoteOnly ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'
          }`}
          title="Toggle Remote / Worldwide / Global Company filter"
        >
          <span
            className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              remoteOnly ? 'translate-x-3' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
