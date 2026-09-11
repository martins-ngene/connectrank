import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { App } from './App';
import './index.css';

if (import.meta.env.VITE_SENTRY_DSN) {
  const sentryEnv = import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE;
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: sentryEnv,
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    tracesSampleRate: 0.1,
  });
  console.log(`[+] Sentry monitoring active on frontend (environment: ${sentryEnv})`);
} else {
  console.warn('[!] VITE_SENTRY_DSN not detected.');
}

function RootErrorFallback({ error, resetError }: { error?: unknown; resetError?: () => void }) {
  const errorMessage = error instanceof Error ? error.message : String(error || 'An unexpected error occurred');
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-blue-500/30">
      <div className="max-w-md w-full bg-slate-900/95 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-6 shadow-2xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-100">Application Rendering Error</h2>
        <p className="text-sm text-slate-400">
          An unexpected component crash occurred. This incident has been logged to Sentry for review.
        </p>
        <div className="p-3 bg-slate-950/80 rounded-lg text-xs font-mono text-rose-300 break-words text-left border border-rose-950/50">
          {errorMessage}
        </div>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-blue-600/20"
          >
            Reload Page
          </button>
          {resetError && (
            <button
              onClick={resetError}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors border border-slate-700"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={RootErrorFallback}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
);
