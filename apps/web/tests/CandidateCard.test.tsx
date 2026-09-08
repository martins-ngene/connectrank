import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CandidateCard } from '../src/components/CandidateCard';
import { Candidate } from '../src/types';

const mockCandidate: Candidate = {
  name: 'Ada Lovelace',
  position: 'Chief Technology Officer',
  company: 'Babbage Analytics',
  url: 'https://linkedin.com/in/ada',
  score: 92.4,
  semantic_match_pct: 88.0,
  authority_weight: 1.0,
  seniority_tier: 'Direct Decision Maker',
  reason: 'Semantic match: 88% | Decision weight: 1.0',
};

describe('CandidateCard', () => {
  it('renders candidate details and scores correctly', () => {
    const handleDraftDM = vi.fn();
    render(
      <CandidateCard
        candidate={mockCandidate}
        rank={1}
        onDraftDM={handleDraftDM}
      />
    );

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('Babbage Analytics')).toBeInTheDocument();
    expect(screen.getByText('Chief Technology Officer')).toBeInTheDocument();
    expect(screen.getByText('92.4')).toBeInTheDocument();
    expect(screen.getByText(/Direct Decision Maker/)).toBeInTheDocument();
  });

  it('triggers onDraftDM callback when Draft Cold DM button is clicked', () => {
    const handleDraftDM = vi.fn();
    render(
      <CandidateCard
        candidate={mockCandidate}
        rank={1}
        onDraftDM={handleDraftDM}
      />
    );

    const button = screen.getByRole('button', { name: /Draft Cold DM/i });
    fireEvent.click(button);
    expect(handleDraftDM).toHaveBeenCalledWith(mockCandidate);
  });

  it('renders remote-friendly badge when candidate is remote friendly', () => {
    const remoteCandidate: Candidate = {
      ...mockCandidate,
      is_remote_friendly: true,
      remote_label: 'Remote-First Organization',
    };
    render(
      <CandidateCard
        candidate={remoteCandidate}
        rank={1}
        onDraftDM={vi.fn()}
      />
    );

    expect(screen.getByText('Remote-First Organization')).toBeInTheDocument();
  });
});
