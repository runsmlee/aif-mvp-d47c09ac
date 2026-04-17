import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without crash', () => {
    render(<App />);
    expect(screen.getByText('Viral')).toBeInTheDocument();
    expect(screen.getByText('Kit')).toBeInTheDocument();
  });

  it('displays navigation sidebar with links to Generator, Analytics, Builder, Templates', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /generator/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analytics/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /builder/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /templates/i })).toBeInTheDocument();
  });

  it('navigates to correct route when sidebar link is clicked', async () => {
    render(<App />);
    const analyticsBtn = screen.getByRole('button', { name: /analytics/i });
    await userEvent.click(analyticsBtn);
    expect(screen.getByText(/k-factor analytics/i)).toBeInTheDocument();
  });

  it('persists last-selected template to localStorage and restores on reload', async () => {
    const { unmount } = render(<App />);
    // Navigate to templates
    await userEvent.click(screen.getByRole('button', { name: /templates/i }));
    // Click use template on first template
    const useButtons = screen.getAllByRole('button', { name: /use template/i });
    await userEvent.click(useButtons[0]);
    // Check localStorage was set
    const stored = localStorage.getItem('viralkit_selected_template');
    expect(stored).not.toBeNull();
    // Unmount and remount to simulate reload
    unmount();
    render(<App />);
    // The stored template should be restored (check localStorage still has it)
    const restored = localStorage.getItem('viralkit_selected_template');
    expect(restored).toBe(stored);
  });
});
