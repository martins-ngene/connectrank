import React from 'react';
import { Users, Crown, ShieldCheck, Clock } from 'lucide-react';
import { Candidate } from '../types';

interface StatBannerProps {
  candidates: Candidate[];
  totalIndexed: number;
  sessionId: string | null;
  secondsRemaining: number | null;
}

export const StatBanner: React.FC<StatBannerProps> = ({
  candidates,
  totalIndexed,
  sessionId,
  secondsRemaining,
}) => {
  const decisionMakersCount = candidates.filter(
    (c) => c.seniority_tier === 'Direct Decision Maker' || c.seniority_tier === 'Engineering Lead'
  ).length;

  const formatMinutes = (sec: number) => {
    const mins = Math.floor(sec / 60);
    return `${mins}m left`;
  };

  return (
    <div className="w-full grid grid-cols-2 gap-1.5">
      {/* Stat 1: Profiles Analyzed */}
      <div className="glass-panel p-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
          <Users className="w-3 h-3 text-blue-500 dark:text-blue-400 shrink-0" />
          <span className="truncate">Indexed</span>
        </div>
        <div className="text-xs font-bold text-slate-900 dark:text-white">
          {totalIndexed.toLocaleString()}
        </div>
      </div>

      {/* Stat 2: Decision Makers in Results */}
      <div className="glass-panel p-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
          <Crown className="w-3 h-3 text-amber-500 dark:text-amber-400 shrink-0" />
          <span className="truncate">Decision Makers</span>
        </div>
        <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
          {decisionMakersCount}
        </div>
      </div>

      {/* Stat 3: Privacy Mode */}
      <div className="glass-panel p-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
          <ShieldCheck className="w-3 h-3 text-emerald-500 dark:text-emerald-400 shrink-0" />
          <span className="truncate">Storage</span>
        </div>
        <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-300 truncate">
          0-RAM
        </div>
      </div>

      {/* Stat 4: Session TTL / Mode */}
      <div className="glass-panel p-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
          <Clock className="w-3 h-3 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <span className="truncate">Session</span>
        </div>
        <div className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-300 truncate">
          {sessionId && secondsRemaining ? formatMinutes(secondsRemaining) : totalIndexed > 0 ? 'Demo' : 'Empty'}
        </div>
      </div>
    </div>
  );
};
