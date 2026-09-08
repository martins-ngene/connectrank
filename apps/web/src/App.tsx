import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { PitchBar } from './components/PitchBar';
import { WeightSliders } from './components/WeightSliders';
import { CandidateCard } from './components/CandidateCard';
import { Pagination } from './components/Pagination';
import { DMModal } from './components/DMModal';
import { CSVUploadModal } from './components/CSVUploadModal';
import { TermsModal } from './components/TermsModal';
import { StatBanner } from './components/StatBanner';
import { Candidate, UploadResponse } from './types';
import { fetchHealth, fetchRecommendations, purgeSessionData } from './services/api';
import { Sparkles, AlertCircle, RefreshCw, ShieldCheck, Heart, Upload } from 'lucide-react';

const PAGE_SIZE = 15;

export function App() {
  const [pitch, setPitch] = useState('Senior Backend Engineer Python AWS');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Filter & Weighting State
  const [semanticWeight, setSemanticWeight] = useState(0.6);
  const [authorityWeight, setAuthorityWeight] = useState(0.4);
  const [topK, setTopK] = useState(15);
  const [minAuthority, setMinAuthority] = useState<number | undefined>(undefined);
  const [remoteOnly, setRemoteOnly] = useState(false);

  // Session & Modal State
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [totalIndexed, setTotalIndexed] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [selectedCandidateForDM, setSelectedCandidateForDM] = useState<Candidate | null>(null);
  const [isPurging, setIsPurging] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show transient toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Initial health check & demo profile count
  useEffect(() => {
    fetchHealth()
      .then((h) => {
        if (!sessionId) {
          const count = h.demo_profiles_indexed || 0;
          setTotalIndexed(count);
          if (count > 0) {
            executeSearch(pitch);
          }
        }
      })
      .catch((e) => {
        console.warn('Backend health check error:', e);
      });
  }, [sessionId]);

  // 2. Fetch recommendations
  const executeSearch = useCallback(async (
    searchPitch: string,
    overrideRemoteOnly?: boolean,
    overrideSessionId?: string | null
  ) => {
    if (!searchPitch.trim()) return;
    setIsLoading(true);
    setError(null);
    const activeRemoteOnly = overrideRemoteOnly !== undefined ? overrideRemoteOnly : remoteOnly;
    const activeSessionId = overrideSessionId !== undefined ? overrideSessionId : sessionId;

    try {
      const results = await fetchRecommendations({
        pitch: searchPitch,
        top_k: topK,
        semantic_weight: semanticWeight,
        authority_weight: authorityWeight,
        session_id: activeSessionId,
        min_authority: minAuthority,
        remote_only: activeRemoteOnly,
      });
      setCandidates(results);
      setCurrentPage(1);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch recommendations. Please verify the API server is running.');
    } finally {
      setIsLoading(false);
    }
  }, [topK, semanticWeight, authorityWeight, sessionId, minAuthority, remoteOnly]);

  // Session timer countdown
  useEffect(() => {
    if (!secondsRemaining || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev && prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsRemaining]);

  // Handle successful upload
  const handleUploadSuccess = async (res: UploadResponse) => {
    setSessionId(res.session_id);
    setTotalIndexed(res.profiles_indexed);
    setSecondsRemaining(res.seconds_until_expiry);
    showToast(`Uploaded & indexed ${res.profiles_indexed} profiles in RAM session!`);
    // Automatically query and render recommendations using the new session ID immediately
    await executeSearch(pitch, remoteOnly, res.session_id);
    // Smooth scroll down to the recommended connections section
    setTimeout(() => {
      const el = document.getElementById('results-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  // Handle GDPR purge
  const handlePurgeSession = async () => {
    if (!sessionId) {
      showToast('No custom data to purge — you are browsing the anonymized demo dataset.');
      return;
    }
    setIsPurging(true);
    try {
      await purgeSessionData(sessionId);
      setSessionId(null);
      setSecondsRemaining(null);
      showToast('All session data and vector indices were purged from RAM.');
      // Refetch demo health
      const h = await fetchHealth();
      setTotalIndexed(h.demo_profiles_indexed);
      if (h.demo_profiles_indexed > 0) {
        executeSearch(pitch, remoteOnly, null);
      } else {
        setCandidates([]);
      }
    } catch (e: any) {
      showToast('Session already expired or purged.');
      setSessionId(null);
      setCandidates([]);
    } finally {
      setIsPurging(false);
    }
  };

  const handleResetWeights = () => {
    setSemanticWeight(0.6);
    setAuthorityWeight(0.4);
    setMinAuthority(undefined);
    setTopK(15);
    setRemoteOnly(false);
  };

  const handleToggleRemoteOnly = (enabled: boolean) => {
    setRemoteOnly(enabled);
    executeSearch(pitch, enabled);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 bg-slate-900 border border-indigo-500/40 text-indigo-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        sessionId={sessionId}
        profileCount={totalIndexed}
        onOpenUpload={() => setIsUploadOpen(true)}
        onPurgeSession={handlePurgeSession}
        onOpenTerms={() => setIsTermsOpen(true)}
        isPurging={isPurging}
      />

      {/* Hero Section */}
      <main className="grow max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-12 sm:pb-16 w-full">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] sm:text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>AI Vector Search + Seniority Decision Engine</span>
          </div>

          <h1 className="font-display font-extrabold text-2xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            Turn Your LinkedIn Network Into{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-300 bg-clip-text text-transparent">
              High-Yield Cold Outreach
            </span>
          </h1>

          <p className="mt-2.5 sm:mt-3 text-slate-400 text-xs sm:text-base leading-relaxed">
            Rank connections by combining <strong>dense semantic relevance</strong> (what they do) with{' '}
            <strong>hiring authority</strong> (CTOs, Founders, Engineering Leads). 100% private, zero disk persistence.
          </p>
        </div>

        {/* Pitch Search Bar */}
        <div className="mb-6">
          <PitchBar
            onSearch={(p) => {
              setPitch(p);
              executeSearch(p);
            }}
            isLoading={isLoading}
            initialValue={pitch}
          />
        </div>

        {/* Analytics Banner */}
        <StatBanner
          candidates={candidates}
          totalIndexed={totalIndexed}
          sessionId={sessionId}
          secondsRemaining={secondsRemaining}
        />

        {/* Weighting & Filter Controls */}
        <WeightSliders
          semanticWeight={semanticWeight}
          authorityWeight={authorityWeight}
          topK={topK}
          minAuthority={minAuthority}
          remoteOnly={remoteOnly}
          onChangeWeights={(sem, auth) => {
            setSemanticWeight(sem);
            setAuthorityWeight(auth);
          }}
          onChangeTopK={setTopK}
          onChangeMinAuthority={setMinAuthority}
          onChangeRemoteOnly={handleToggleRemoteOnly}
          onReset={handleResetWeights}
        />

        {/* Results Grid Header */}
        <div id="results-section" className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 scroll-mt-6">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display font-bold text-base sm:text-lg text-white">
              Recommended Connections
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
              {candidates.length} {candidates.length === 1 ? 'match' : 'matches'}
            </span>
            {Math.ceil(candidates.length / PAGE_SIZE) > 1 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                Page {currentPage} of {Math.ceil(candidates.length / PAGE_SIZE)}
              </span>
            )}
          </div>

          <button
            onClick={() => executeSearch(pitch)}
            disabled={isLoading}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Ranking</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && candidates.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="glass-card rounded-2xl p-5 animate-pulse h-48 bg-slate-900/40" />
            ))}
          </div>
        )}

        {/* Candidate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates
            .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
            .map((candidate, idx) => {
              const globalRank = (currentPage - 1) * PAGE_SIZE + idx + 1;
              return (
                <CandidateCard
                  key={`${candidate.name}-${globalRank}`}
                  candidate={candidate}
                  rank={globalRank}
                  onDraftDM={(c) => setSelectedCandidateForDM(c)}
                />
              );
            })}
        </div>

        {/* Pagination Bar */}
        {candidates.length > PAGE_SIZE && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(candidates.length / PAGE_SIZE)}
              totalItems={candidates.length}
              pageSize={PAGE_SIZE}
              onPageChange={(page) => {
                setCurrentPage(page);
                const el = document.getElementById('results-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            />
          </div>
        )}

        {/* Awaiting Upload State */}
        {!isLoading && candidates.length === 0 && !sessionId && totalIndexed === 0 && (
          <div className="glass-panel rounded-2xl p-6 sm:p-10 text-center max-w-lg mx-auto border border-indigo-500/30 shadow-2xl shadow-indigo-500/10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-4">
              <Upload className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-display font-bold text-white text-lg sm:text-xl">Upload Your LinkedIn Network</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Upload your exported <code className="text-indigo-300 font-mono">Connections.csv</code> to begin ranking contacts by skill relevance and hiring authority. Your data is analyzed strictly in volatile RAM with zero disk persistence.
            </p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="mt-5 inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Connections.csv</span>
            </button>
          </div>
        )}

        {/* Empty Search Results State */}
        {!isLoading && candidates.length === 0 && (sessionId || totalIndexed > 0) && !error && (
          <div className="glass-panel rounded-2xl p-6 sm:p-12 text-center max-w-md mx-auto">
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-white text-base">No matching connections found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your pitch query or relaxing the minimum authority filter.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-6 sm:py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 space-y-2">
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 flex-wrap text-slate-400">
            <button
              onClick={() => setIsTermsOpen(true)}
              className="hover:text-indigo-400 transition-colors"
            >
              Terms of Service & GDPR Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="hover:text-indigo-400 transition-colors"
            >
              Upload Connections.csv
            </button>
            <span>•</span>
            <span>Zero-Persistence RAM Architecture</span>
          </div>
          <p className="flex items-center justify-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 inline" /> for high-impact professional outreach.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <DMModal
        candidate={selectedCandidateForDM}
        pitch={pitch}
        isOpen={!!selectedCandidateForDM}
        onClose={() => setSelectedCandidateForDM(null)}
      />

      <CSVUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        sessionId={sessionId}
        onPurgeSession={handlePurgeSession}
        isPurging={isPurging}
      />
    </div>
  );
}
