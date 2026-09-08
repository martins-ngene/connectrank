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
    <div className="w-full max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {/* Stat 1: Profiles Analyzed */}
      <div className="glass-panel p-3.5 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span>Network Indexed</span>
        </div>
        <div className="text-xl font-display font-bold text-white">
          {totalIndexed.toLocaleString()} <span className="text-xs font-normal text-slate-500">profiles</span>
        </div>
      </div>

      {/* Stat 2: Decision Makers in Results */}
      <div className="glass-panel p-3.5 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>Decision Makers</span>
        </div>
        <div className="text-xl font-display font-bold text-amber-300">
          {decisionMakersCount} <span className="text-xs font-normal text-slate-500">in top results</span>
        </div>
      </div>

      {/* Stat 3: Privacy Mode */}
      <div className="glass-panel p-3.5 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Data Storage</span>
        </div>
        <div className="text-sm font-semibold text-emerald-300 truncate">
          0-Persistence RAM
        </div>
      </div>

      {/* Stat 4: Session TTL / Mode */}
      <div className="glass-panel p-3.5 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Session State</span>
        </div>
        <div className="text-sm font-semibold text-cyan-300 truncate">
          {sessionId && secondsRemaining ? formatMinutes(secondsRemaining) : totalIndexed > 0 ? 'Preloaded Demo' : 'Awaiting Upload'}
        </div>
      </div>
    </div>
  );
};
