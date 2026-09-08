import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HeroSection } from '../src/components/HeroSection';
import { ComparisonSection } from '../src/components/ComparisonSection';
import { FAQSection } from '../src/components/FAQSection';

describe('HeroSection Component', () => {
  it('renders CTAs and triggers appropriate callbacks', () => {
    const handleOpenUpload = vi.fn();
    const handleScrollToRecommender = vi.fn();

    render(
      <HeroSection
        onOpenUpload={handleOpenUpload}
        onScrollToRecommender={handleScrollToRecommender}
      />
    );

    expect(
      screen.getByRole('heading', { name: /Supercharge Your Network with/i })
    ).toBeInTheDocument();

    const launchBtn = screen.getByRole('button', { name: /Launch ConnectRank Workspace/i });
    fireEvent.click(launchBtn);
    expect(handleScrollToRecommender).toHaveBeenCalledTimes(1);

    const uploadBtn = screen.getByRole('button', { name: /Upload Connections.csv/i });
    fireEvent.click(uploadBtn);
    expect(handleOpenUpload).toHaveBeenCalledTimes(1);

    const githubLink = screen.getByRole('link', { name: /Star on GitHub/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/martins-ngene/connectrank');
  });
});

describe('ComparisonSection Component', () => {
  it('honestly displays the $0 free tier alongside clearly marked placeholder tiers', () => {
    const handleScroll = vi.fn();
    render(<ComparisonSection onScrollToRecommender={handleScroll} />);

    // Active tier
    expect(screen.getByText('Active & 100% Free')).toBeInTheDocument();
    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('Community Open Source')).toBeInTheDocument();

    // Explicit placeholder tiers
    const placeholderBadges = screen.getAllByText('[Placeholder Tier]');
    expect(placeholderBadges.length).toBe(2);

    expect(screen.getByText('Managed Cloud Vault')).toBeInTheDocument();
    expect(screen.getByText('Enterprise Team Hub')).toBeInTheDocument();
  });
});

describe('FAQSection Component', () => {
  it('renders and toggles FAQ questions and answers', () => {
    render(<FAQSection />);

    // First question is open by default
    expect(screen.getByText(/Zero-Persistence RAM architecture guarantee/i)).toBeInTheDocument();
    expect(screen.getByText(/personally identifiable information/i)).toBeInTheDocument();

    // Click another question to expand it
    const remoteQ = screen.getByText(/How does the Remote \/ Worldwide company filter work/i);
    fireEvent.click(remoteQ);

    expect(
      screen.getByText(/3-tier heuristic classification engine/i)
    ).toBeInTheDocument();
  });
});
