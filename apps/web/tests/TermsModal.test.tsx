import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TermsModal } from '../src/components/TermsModal';

describe('TermsModal', () => {
  it('renders terms and privacy information', () => {
    render(<TermsModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(/Terms of Service & GDPR Privacy Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Zero-Persistence Privacy Policy/i)).toBeInTheDocument();
  });

  it('always renders the purge button even in demo mode', () => {
    const handlePurge = vi.fn();
    render(
      <TermsModal
        isOpen={true}
        onClose={vi.fn()}
        sessionId={null}
        onPurgeSession={handlePurge}
      />
    );

    const purgeBtn = screen.getByRole('button', { name: /Purge My Data/i });
    expect(purgeBtn).toBeInTheDocument();
    fireEvent.click(purgeBtn);
    expect(handlePurge).toHaveBeenCalled();
  });

  it('renders active session state and button when session exists', () => {
    const handlePurge = vi.fn();
    render(
      <TermsModal
        isOpen={true}
        onClose={vi.fn()}
        sessionId="test-session-123"
        onPurgeSession={handlePurge}
      />
    );

    expect(screen.getByText(/Active Custom Session/i)).toBeInTheDocument();
    const purgeBtn = screen.getByRole('button', { name: /Purge My Data Now/i });
    expect(purgeBtn).toBeInTheDocument();
    fireEvent.click(purgeBtn);
    expect(handlePurge).toHaveBeenCalled();
  });
});
