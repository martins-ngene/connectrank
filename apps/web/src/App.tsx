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
import { EcosystemBar } from './components/EcosystemBar';
import { FeatureGrid } from './components/FeatureGrid';
import { HowItWorks } from './components/HowItWorks';
import { PersonasSection } from './components/PersonasSection';
import { ComparisonSection } from './components/ComparisonSection';
import { FAQSection } from './components/FAQSection';
import { WatermarkFooter } from './components/WatermarkFooter';
import { useTheme } from './hooks/useTheme';
import { Candidate, UploadResponse } from './types';
import { fetchHealth, fetchRecommendations, purgeSessionData } from './services/api';
import { Sparkles, AlertCircle, RefreshCw, ShieldCheck, Upload } from 'lucide-react';

const PAGE_SIZE = 15;

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none hero-glow-light dark:hero-glow-dark -z-10" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/40 text-slate-900 dark:text-indigo-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-5">
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

      {/* Real Open-Source Tech Ecosystem Bar */}
      <EcosystemBar />

      {/* Interactive Recommender Hub */}
      <section
        id="recommender"
        className="scroll-mt-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 w-full"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold mb-2 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive ConnectRank Hub</span>
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
              Personalized Candidate Ranking Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Search your network by target skills or job description. Our RAM engine calculates dense semantic cosine similarity alongside position seniority.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload CSV</span>
            </button>
          </div>
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
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              Recommended Connections
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              {candidates.length} {candidates.length === 1 ? 'match' : 'matches'}
            </span>
            {Math.ceil(candidates.length / PAGE_SIZE) > 1 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 font-medium">
                Page {currentPage} of {Math.ceil(candidates.length / PAGE_SIZE)}
              </span>
            )}
          </div>

          <button
            onClick={() => executeSearch(pitch)}
            disabled={isLoading}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Ranking</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2.5 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && candidates.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="glass-card rounded-2xl p-5 animate-pulse h-48 bg-slate-200/50 dark:bg-slate-900/40" />
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
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-600/10 dark:bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
              <Upload className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg sm:text-xl">Upload Your LinkedIn Network</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Upload your exported <code className="text-indigo-600 dark:text-indigo-300 font-mono">Connections.csv</code> to begin ranking contacts by skill relevance and hiring authority. Your data is analyzed strictly in volatile RAM with zero disk persistence.
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
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-500 dark:text-indigo-400 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-slate-900 dark:text-white text-base">No matching connections found</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Try adjusting your pitch query or relaxing the minimum authority filter.
            </p>
          </div>
        )}
      </section>

      {/* Feature Grid: Capabilities Matrix */}
      <FeatureGrid />

      {/* How It Works: 3-Step Pipeline */}
      <HowItWorks onOpenUpload={() => setIsUploadOpen(true)} />

      {/* Personas / Use Cases Section */}
      <PersonasSection />

      {/* Transparent Comparison / Pricing Section with Explicit Placeholders */}
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
