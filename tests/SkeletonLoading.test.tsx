import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkeletonCard, SkeletonCodeBlock, SkeletonForm } from '../src/components/Skeleton';

describe('Skeleton Loading States', () => {
  it('renders SkeletonCard with appropriate ARIA attributes', () => {
    render(<SkeletonCard />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-label', 'Loading');
  });

  it('renders SkeletonCodeBlock for code panel placeholder', () => {
    render(<SkeletonCodeBlock />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    // Should have multiple animated lines
    const skeleton = screen.getByRole('status');
    expect(skeleton.querySelectorAll('[data-testid="skeleton-line"]').length).toBeGreaterThan(0);
  });

  it('renders SkeletonForm for form placeholder', () => {
    render(<SkeletonForm />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    const skeleton = screen.getByRole('status');
    expect(skeleton.querySelectorAll('[data-testid="skeleton-line"]').length).toBeGreaterThan(0);
  });

  it('SkeletonCard uses pulse animation class', () => {
    render(<SkeletonCard />);
    const skeleton = screen.getByRole('status');
    expect(skeleton.querySelector('.animate-pulse')).toBeTruthy();
  });

  it('SkeletonCodeBlock has accessible label for screen readers', () => {
    render(<SkeletonCodeBlock />);
    expect(screen.getByText('Loading code snippet...')).toHaveClass('sr-only');
  });
});
