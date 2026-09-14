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
import { HeroSection } from './components/HeroSection';
import { FeatureGrid } from './components/FeatureGrid';
import { HowItWorks } from './components/HowItWorks';
import { ComparisonSection } from './components/ComparisonSection';
import { FAQSection } from './components/FAQSection';
import { WatermarkFooter } from './components/WatermarkFooter';
import { useTheme } from './hooks/useTheme';
import { Candidate, UploadResponse } from './types';
import { fetchHealth, fetchRecommendations, purgeSessionData } from './services/api';
import { Sparkles, AlertCircle, RefreshCw, ShieldCheck, Upload } from 'lucide-react';
import * as Sentry from '@sentry/react';

const PAGE_SIZE = 6;

export function App() {
  const { theme, toggleTheme, isDark } = useTheme();
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

  const scrollToRecommender = () => {
    const el = document.getElementById('recommender');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      if (import.meta.env.VITE_SENTRY_DSN) {
        Sentry.captureException(err);
      }
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
    // Smooth scroll down to the recommender results section
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
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white transition-colors duration-200">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none hero-glow-light dark:hero-glow-dark -z-10" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-500/40 text-slate-900 dark:text-blue-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-5">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        sessionId={sessionId}
        profileCount={totalIndexed}
        onOpenUpload={() => setIsUploadOpen(true)}
        onPurgeSession={handlePurgeSession}
        onOpenTerms={() => setIsTermsOpen(true)}
        isPurging={isPurging}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Landing Page Hero Section */}
      <HeroSection
        onOpenUpload={() => setIsUploadOpen(true)}
        onScrollToRecommender={scrollToRecommender}
      />

      {/* Interactive Recommender Hub: 100vh Split 2-Column Workspace */}
      <section
        id="recommender"
        className="scroll-mt-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 w-full lg:h-[calc(100dvh-4rem)] lg:min-h-[720px] flex flex-col justify-between"
      >
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
              Candidate Search &amp; Ranking
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Search target roles or skills. Profiles are scored by semantic match and hiring authority in session RAM.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload CSV</span>
            </button>
          </div>
        </div>

        {/* 2-Section Workspace Body */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch overflow-hidden pb-1">
          {/* Left Column: Filters & Tuning */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-2 lg:overflow-y-auto pr-1 pb-2">
            {/* Pitch Search Bar */}
            <PitchBar
              onSearch={(p) => {
                setPitch(p);
                executeSearch(p);
              }}
              isLoading={isLoading}
              initialValue={pitch}
            />

            {/* Analytics & Session Status */}
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
          </div>

          {/* Right Column: Recommended Connections */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col min-h-0 h-full glass-panel rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
            {/* Results Header */}
            <div id="results-section" className="flex items-center justify-between gap-2.5 pb-3 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Recommended Connections
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {candidates.length} {candidates.length === 1 ? 'match' : 'matches'}
                </span>
                {Math.ceil(candidates.length / PAGE_SIZE) > 1 && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-medium">
                    Page {currentPage} of {Math.ceil(candidates.length / PAGE_SIZE)}
                  </span>
                )}
              </div>

              <button
                onClick={() => executeSearch(pitch)}
                disabled={isLoading}
                className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh Ranking</span>
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2 my-2 shrink-0">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Scrollable Cards Area */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-2 py-3">
              {/* Loading Skeleton */}
              {isLoading && candidates.length === 0 && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="glass-card rounded-xl p-4 animate-pulse h-40 bg-slate-200/50 dark:bg-slate-900/40" />
                  ))}
                </div>
              )}

              {/* Candidate Cards Grid */}
              {candidates.length > 0 && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5">
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
              )}

              {/* Awaiting Upload State */}
              {!isLoading && candidates.length === 0 && !sessionId && totalIndexed === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 sm:p-10 my-auto">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 dark:bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-4">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-slate-900 dark:text-white text-base sm:text-lg">Upload Your LinkedIn Network</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                    Upload your exported <code className="text-blue-600 dark:text-blue-300 font-mono">Connections.csv</code> to begin ranking contacts by skill relevance and hiring authority. Your data is analyzed strictly in volatile RAM with zero disk persistence.
                  </p>
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-600/25 transition-all active:scale-95 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Connections.csv</span>
                  </button>
                </div>
              )}

              {/* Empty Search Results State */}
              {!isLoading && candidates.length === 0 && (sessionId || totalIndexed > 0) && !error && (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 sm:p-10 my-auto">
                  <Sparkles className="w-7 h-7 text-blue-500 dark:text-blue-400 mx-auto mb-2.5" />
                  <h3 className="font-display font-semibold text-slate-900 dark:text-white text-sm sm:text-base">No matching connections found</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm">
                    Try adjusting your pitch query or relaxing the minimum authority filter.
                  </p>
                </div>
              )}
            </div>

            {/* Docked Pagination Bar */}
            {candidates.length > PAGE_SIZE && (
              <div className="pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80 mt-auto shrink-0">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(candidates.length / PAGE_SIZE)}
                  totalItems={candidates.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    const el = document.getElementById('results-section');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works: 3-Step Pipeline */}
      <HowItWorks onOpenUpload={() => setIsUploadOpen(true)} />

      {/* Feature Grid: Capabilities Matrix */}
      <FeatureGrid />

      {/* Transparent Comparison / Pricing Section */}
      <ComparisonSection onScrollToRecommender={scrollToRecommender} />

      {/* FAQ Section */}
      <FAQSection />

      {/* Watermark Footer */}
      <WatermarkFooter
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
        onScrollToRecommender={scrollToRecommender}
      />

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
