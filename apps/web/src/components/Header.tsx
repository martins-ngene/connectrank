import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Sun, Moon, Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { GithubIcon } from './GithubIcon';
import { ConnectRankLogo } from './ConnectRankLogo';

interface HeaderProps {
  sessionId: string | null;
  profileCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenUpload?: () => void;
  onPurgeSession: () => void;
  onOpenTerms?: () => void;
  isPurging: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  sessionId,
  profileCount,
  isDark,
  onToggleTheme,
  onPurgeSession,
  isPurging,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const hamburgerIconRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const isTestEnv = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    if (isTestEnv || prefersReducedMotion) return;

    if (hamburgerIconRef.current) {
      gsap.fromTo(
        hamburgerIconRef.current,
        { rotate: isMobileMenuOpen ? -90 : 90, scale: 0.75 },
        { rotate: 0, scale: 1, duration: 0.22, ease: 'back.out(2)' }
      );
    }

    if (isMobileMenuOpen) {
      if (drawerRef.current) {
        gsap.fromTo(
          drawerRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
        );
      }
      if (linksRef.current?.children) {
        gsap.fromTo(
          linksRef.current.children,
          { opacity: 0, x: -8 },
          { opacity: 1, x: 0, duration: 0.2, stagger: 0.035, ease: 'power2.out' }
        );
      }
    }
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full max-w-full overflow-x-clip glass-panel border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-blue-500/20">
            <ConnectRankLogo size={36} withBackground />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                Connect<span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">Rank</span>
              </span>
            </div>
          </div>
        </a>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-300">
          <a href="#recommender" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
            <span>Workspace</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </a>
          <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            How It Works
          </a>
          <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Features
          </a>
          <a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* GitHub Repo Button (Desktop/Tablet) */}
          <a
            href="https://github.com/martins-ngene/connectrank"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white p-2 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
            title="View ConnectRank Source Code on GitHub"
            aria-label="GitHub Repository"
          >
            <GithubIcon className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline font-medium">GitHub</span>
          </a>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Color Theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600" />
            )}
          </button>

          {/* Session Purge / Status */}
          {sessionId ? (
            <button
              onClick={onPurgeSession}
              disabled={isPurging}
              className="flex items-center gap-1 sm:gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-2 sm:px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow-sm cursor-pointer shrink-0"
              title="Purge session data immediately from memory (GDPR Right to Erasure)"
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{isPurging ? 'Purging...' : 'Purge Data'}</span>
              <span className="sm:hidden">{isPurging ? '...' : 'Purge'}</span>
            </button>
          ) : (
            <div
              className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 px-2.5 py-1.5 rounded-lg cursor-help"
              title="No custom data in memory. This button activates when you upload a Connections.csv."
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
              <span>Purge (Idle)</span>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
            aria-label="Toggle mobile navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div ref={hamburgerIconRef} className="flex items-center justify-center">
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {isMobileMenuOpen && (
        <div
          ref={drawerRef}
          className="lg:hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 py-3 space-y-2.5 shadow-xl"
          data-testid="mobile-nav-drawer"
        >
          <div ref={linksRef} className="flex flex-col space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
            <a
              href="#recommender"
              onClick={closeMenu}
              className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-500/15 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>Workspace</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-xs text-blue-400">Live</span>
            </a>
            <a
              href="#how-it-works"
              onClick={closeMenu}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center justify-between"
            >
              <span>How It Works</span>
              <span className="text-xs text-slate-400">&rarr;</span>
            </a>
            <a
              href="#features"
              onClick={closeMenu}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center justify-between"
            >
              <span>Features</span>
              <span className="text-xs text-slate-400">&rarr;</span>
            </a>
            <a
              href="#pricing"
              onClick={closeMenu}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center justify-between"
            >
              <span>Pricing</span>
              <span className="text-xs text-slate-400">&rarr;</span>
            </a>
            <a
              href="#faq"
              onClick={closeMenu}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center justify-between"
            >
              <span>Frequently Asked Questions</span>
              <span className="text-xs text-slate-400">&rarr;</span>
            </a>
            <a
              href="https://github.com/martins-ngene/connectrank"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <GithubIcon className="w-4 h-4 shrink-0" />
                <span>GitHub Repository</span>
              </div>
              <span className="text-xs text-slate-400">&nearr;</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
