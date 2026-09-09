import React from 'react';
import { render, screen, fireEvent, renderHook, act, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Header } from '../src/components/Header';
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
  it('renders GitHub repository link with exact open source URL', () => {
    render(
      <Header
        sessionId={null}
        profileCount={0}
        isDark={true}
        onToggleTheme={vi.fn()}
        onOpenUpload={vi.fn()}
        onPurgeSession={vi.fn()}
        onOpenTerms={vi.fn()}
        isPurging={false}
      />
    );

    const githubLinks = screen.getAllByRole('link', { name: /GitHub/i });
    const repoLink = githubLinks.find((link) =>
      link.getAttribute('href') === 'https://github.com/martins-ngene/connectrank'
    );
    expect(repoLink).toBeDefined();
    expect(repoLink).toHaveAttribute('target', '_blank');
  });

  it('calls onToggleTheme when the theme toggle button is clicked', () => {
    const handleToggle = vi.fn();
    render(
      <Header
        sessionId={null}
        profileCount={0}
        isDark={true}
        onToggleTheme={handleToggle}
        onOpenUpload={vi.fn()}
        onPurgeSession={vi.fn()}
        onOpenTerms={vi.fn()}
        isPurging={false}
      />
    );

    const toggleBtn = screen.getByRole('button', { name: /Toggle Color Theme/i });
    fireEvent.click(toggleBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('toggles mobile hamburger navigation drawer when hamburger button is clicked', () => {
    const handleOpenTerms = vi.fn();
    render(
      <Header
        sessionId={null}
        profileCount={0}
        isDark={true}
        onToggleTheme={vi.fn()}
        onOpenUpload={vi.fn()}
        onPurgeSession={vi.fn()}
        onOpenTerms={handleOpenTerms}
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

    // Open again and click Terms
    fireEvent.click(hamburgerBtn);
    const newDrawer = screen.getByTestId('mobile-nav-drawer');
    const mobileTermsBtn = within(newDrawer).getByRole('button', { name: /GDPR Privacy & Terms/i });
    fireEvent.click(mobileTermsBtn);
    expect(handleOpenTerms).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('mobile-nav-drawer')).toBeNull();

  });
});

