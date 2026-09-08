import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DMModal } from '../src/components/DMModal';
import { Candidate } from '../src/types';

const mockCandidate: Candidate = {
  name: 'Grace Hopper',
  position: 'Director of Research',
  company: 'US Navy Tech',
  url: 'https://linkedin.com/in/grace',
  score: 89.1,
  semantic_match_pct: 82.5,
  authority_weight: 0.7,
  seniority_tier: 'Engineering Lead',
  reason: 'High authority lead match',
};

describe('DMModal', () => {
  it('generates personalized message with candidate name and company', () => {
    render(
      <DMModal
        candidate={mockCandidate}
        pitch="Distributed Systems Architect"
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText(/Personalized Cold DM Generator/i)).toBeInTheDocument();
    expect(screen.getByText(/Target: Grace Hopper/i)).toBeInTheDocument();
    
    // Check generated text contains company and name
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toContain('Grace');
    expect(textarea.value).toContain('US Navy Tech');
  });

  it('allows switching templates dynamically', () => {
    render(
      <DMModal
        candidate={mockCandidate}
        pitch="Distributed Systems Architect"
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const contractTemplateBtn = screen.getByText(/Consulting \/ Gig Offer/i);
    fireEvent.click(contractTemplateBtn);

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toContain('freelance');
  });
});
