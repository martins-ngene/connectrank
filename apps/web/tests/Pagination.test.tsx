import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Pagination } from '../src/components/Pagination';

describe('Pagination', () => {
  it('returns null when totalPages <= 1', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        totalItems={10}
        pageSize={15}
        onPageChange={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders pagination controls and range text when results > 15', () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        totalItems={42}
        pageSize={15}
        onPageChange={handlePageChange}
      />
    );

    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 3' })).toBeInTheDocument();
    expect(screen.getByText(/Showing/)).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();

    // Click next page
    const nextBtn = screen.getByRole('button', { name: /Go to next page/i });
    fireEvent.click(nextBtn);
    expect(handlePageChange).toHaveBeenCalledWith(2);

    // Click direct page 3
    const page3Btn = screen.getByRole('button', { name: 'Page 3' });
    fireEvent.click(page3Btn);
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it('disables previous and first buttons on page 1', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={2}
        totalItems={25}
        pageSize={15}
        onPageChange={vi.fn()}
      />
    );

    const prevBtn = screen.getByRole('button', { name: /Go to previous page/i });
    expect(prevBtn).toBeDisabled();
    const firstBtn = screen.getByRole('button', { name: /Go to first page/i });
    expect(firstBtn).toBeDisabled();
  });

  it('disables next and last buttons on the final page', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={2}
        totalItems={25}
        pageSize={15}
        onPageChange={vi.fn()}
      />
    );

    const nextBtn = screen.getByRole('button', { name: /Go to next page/i });
    expect(nextBtn).toBeDisabled();
    const lastBtn = screen.getByRole('button', { name: /Go to last page/i });
    expect(lastBtn).toBeDisabled();
  });
});
