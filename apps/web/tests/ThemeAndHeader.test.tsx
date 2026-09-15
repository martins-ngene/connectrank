import React from 'react';
import { render, screen, fireEvent, renderHook, act, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Header } from '../src/components/Header';
import { WatermarkFooter } from '../src/components/WatermarkFooter';
import { useTheme } from '../src/hooks/useTheme';

describe('useTheme hook', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('defaults to dark theme and sets class on documentElement', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('connectrank-theme')).toBe('dark');
  });

  it('toggles from dark to light mode and updates localStorage and documentElement', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('connectrank-theme')).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('connectrank-theme')).toBe('dark');
  });

  it('reads pre-existing theme from localStorage', () => {
    localStorage.setItem('connectrank-theme', 'light');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });
});

describe('Header Component', () => {
  it('renders brand without version badge, renders GitHub link, and omits upload and privacy buttons', () => {
    render(
      <Header
        sessionId={null}
        profileCount={0}
        isDark={true}
        onToggleTheme={vi.fn()}
        onPurgeSession={vi.fn()}
        isPurging={false}
      />
    );

    // Brand name is present
    expect(screen.getByText('Connect')).toBeInTheDocument();
    expect(screen.getByText('Rank')).toBeInTheDocument();

    // Version badge 'v1.0' should not exist
    expect(screen.queryByText('v1.0')).toBeNull();

    // GitHub repository link is in the navbar
    const githubLink = screen.getByRole('link', { name: /GitHub Repository/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/martins-ngene/connectrank');
    expect(githubLink).toHaveAttribute('target', '_blank');

    // Upload CSV and Privacy should not exist in Header
    expect(screen.queryByRole('button', { name: /Upload CSV/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Privacy/i })).toBeNull();

    // Responsive sub-bar (Zero-Persistence RAM / Ready for Upload) should not exist
    expect(screen.queryByText(/Zero-Persistence RAM/i)).toBeNull();
    expect(screen.queryByText(/Ready for Upload/i)).toBeNull();
  });

  it('calls onToggleTheme when the theme toggle button is clicked', () => {
    const handleToggle = vi.fn();
    render(
      <Header
        sessionId={null}
        profileCount={0}
        isDark={true}
        onToggleTheme={handleToggle}
        onPurgeSession={vi.fn()}
        isPurging={false}
      />
    );

    const toggleBtn = screen.getByRole('button', { name: /Toggle Color Theme/i });
    fireEvent.click(toggleBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('toggles mobile hamburger navigation drawer when hamburger button is clicked', () => {
    render(
      <Header
        sessionId={null}
        profileCount={0}
        isDark={true}
        onToggleTheme={vi.fn()}
        onPurgeSession={vi.fn()}
        isPurging={false}
      />
    );

    // Initial state: drawer is not rendered
    expect(screen.queryByTestId('mobile-nav-drawer')).toBeNull();

    // Click hamburger button
    const hamburgerBtn = screen.getByRole('button', { name: /Toggle mobile navigation menu/i });
    expect(hamburgerBtn).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(hamburgerBtn);
    expect(hamburgerBtn).toHaveAttribute('aria-expanded', 'true');
    const drawer = screen.getByTestId('mobile-nav-drawer');
    expect(drawer).toBeInTheDocument();

    // Click navigation item inside drawer to close
    const featuresLink = within(drawer).getByRole('link', { name: /Features/i });
    fireEvent.click(featuresLink);
    expect(screen.queryByTestId('mobile-nav-drawer')).toBeNull();
    expect(hamburgerBtn).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('WatermarkFooter Component', () => {
  it('renders GitHub repository link and Privacy & Terms button in footer, but omits upload button', () => {
    const handleOpenTerms = vi.fn();
    const handleScroll = vi.fn();

    render(
      <WatermarkFooter
        onOpenTerms={handleOpenTerms}
        onScrollToRecommender={handleScroll}
      />
    );

    // GitHub repository link
    const repoLink = screen.getByRole('link', { name: /GitHub Repository/i });
    expect(repoLink).toHaveAttribute('href', 'https://github.com/martins-ngene/connectrank');
    expect(repoLink).toHaveAttribute('target', '_blank');

    // Privacy & Terms button
    const privacyBtn = screen.getByRole('button', { name: /Privacy & Terms/i });
    expect(privacyBtn).toBeInTheDocument();
    fireEvent.click(privacyBtn);
    expect(handleOpenTerms).toHaveBeenCalledTimes(1);

    // Upload Connections.csv button should not exist in footer
    expect(screen.queryByRole('button', { name: /Upload Connections\.csv/i })).toBeNull();
  });
});
