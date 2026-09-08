import React from 'react';
import { ExternalLink, MessageSquare, Award, Sparkles, Building, Briefcase, Globe } from 'lucide-react';
import { Candidate } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  rank: number;
  onDraftDM: (candidate: Candidate) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  rank,
  onDraftDM,
}) => {
  const isTopMatch = rank === 1;

  // Seniority badge colors
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Direct Decision Maker':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'Engineering Lead':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
      case 'Senior Peer Referral':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className={`glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between border border-slate-200 dark:border-slate-800/80 animate-fade-in-up hover:-translate-y-1 transition-all duration-300 ${
      isTopMatch ? 'ring-2 ring-indigo-500/50 shadow-xl shadow-indigo-500/10' : ''
    }`}>
      {/* Top Banner for Rank #1 */}
      {isTopMatch && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-600 to-violet-600 text-white text-[10px] font-bold px-2.5 sm:px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1 shadow-sm">
          <Award className="w-3 h-3" />
          <span>#1 Top Recommendation</span>
        </div>
      )}

      <div>
        {/* Header: Rank + Name + Score */}
        <div className="flex items-start justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-xs sm:text-sm shrink-0 ${
              isTopMatch
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              #{rank}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors truncate">
                {candidate.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                <Building className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                <span className="truncate">{candidate.company}</span>
              </div>
            </div>
          </div>

          {/* Composite Score Pill */}
          <div className="text-right shrink-0">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold font-display">
              <Sparkles className="w-3 h-3 shrink-0" />
              <span>{candidate.score}</span>
            </div>
          </div>
        </div>

        {/* Position Title */}
        <div className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300 mb-3 bg-slate-100/70 dark:bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/60">
          <Briefcase className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 mt-0.5 shrink-0" />
          <span className="font-medium line-clamp-2">{candidate.position}</span>
        </div>

        {/* Match Metrics Chips */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-4">
          <span className={`text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-md border ${getTierColor(candidate.seniority_tier)}`}>
            {candidate.seniority_tier} (Weight {candidate.authority_weight})
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
            Semantic Match: {candidate.semantic_match_pct}%
          </span>
          {candidate.is_remote_friendly && (
            <span
              className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
              title={candidate.remote_label || "Remote / Worldwide Friendly"}
            >
              <Globe className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{candidate.remote_label || "Remote / Worldwide"}</span>
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
        {candidate.url ? (
          <a
            href={candidate.url.startsWith('http') ? candidate.url : `https://${candidate.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors py-1"
          >
            <span>View Profile</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500 py-1">No profile link</span>
        )}

        <button
          onClick={() => onDraftDM(candidate)}
          className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg bg-indigo-600/10 dark:bg-indigo-600/20 hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-medium transition-all active:scale-95 cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Draft Cold DM</span>
        </button>
      </div>
    </div>
  );
};
