import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WeightSliders } from '../src/components/WeightSliders';

describe('WeightSliders', () => {
  it('renders slider and remote toggle correctly', () => {
    const handleChangeWeights = vi.fn();
    const handleChangeTopK = vi.fn();
    const handleChangeMinAuthority = vi.fn();
    const handleChangeRemoteOnly = vi.fn();
    const handleReset = vi.fn();

    render(
      <WeightSliders
        semanticWeight={0.6}
        authorityWeight={0.4}
        topK={15}
        minAuthority={undefined}
        remoteOnly={false}
        onChangeWeights={handleChangeWeights}
        onChangeTopK={handleChangeTopK}
        onChangeMinAuthority={handleChangeMinAuthority}
        onChangeRemoteOnly={handleChangeRemoteOnly}
        onReset={handleReset}
      />
    );

    expect(screen.getByText('Ranking Formula & Authority Tuner')).toBeInTheDocument();
    expect(screen.getByText(/Remote \/ Anywhere \/ Worldwide Only/i)).toBeInTheDocument();

    // Click toggle
    const toggle = screen.getByRole('switch', { name: /toggle remote/i });
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(toggle);
    expect(handleChangeRemoteOnly).toHaveBeenCalledWith(true);
  });
});
