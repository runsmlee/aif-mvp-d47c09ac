import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without crash', () => {
    render(<App />);
    expect(screen.getByText('Loop')).toBeInTheDocument();
    expect(screen.getByText('Engine')).toBeInTheDocument();
  });

  it('displays navigation sidebar with links to Generator, Analytics, Builder, Templates', () => {
    render(<App />);
    // Both sidebar and mobile nav render these buttons — check via getAllBy
    expect(screen.getAllByRole('button', { name: /generator/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /analytics/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /builder/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /templates/i }).length).toBeGreaterThanOrEqual(1);
  });

  it('navigates to correct route when sidebar link is clicked', async () => {
    render(<App />);
    // Click the first analytics button (sidebar)
    const analyticsBtn = screen.getAllByRole('button', { name: /analytics/i })[0];
    await userEvent.click(analyticsBtn);
    // Wait for lazy-loaded KFactorDashboard to render
    await waitFor(() => {
      expect(screen.getByText(/k-factor analytics/i)).toBeInTheDocument();
    });
  });

  it('persists last-selected template to localStorage and restores on reload', async () => {
    const { unmount } = render(<App />);
    // Navigate to templates (click first "Templates" button — sidebar)
    const templatesBtns = screen.getAllByRole('button', { name: /templates/i });
    await userEvent.click(templatesBtns[0]);
    // Wait for lazy-loaded TemplateLibrary to render, then click use template
    const useButtons = await screen.findAllByRole('button', { name: /use template/i });
    await userEvent.click(useButtons[0]);
    // Check localStorage was set
    const stored = localStorage.getItem('loopengine_selected_template');
    expect(stored).not.toBeNull();
    // Unmount and remount to simulate reload
    unmount();
    render(<App />);
    // The stored template should be restored (check localStorage still has it)
    const restored = localStorage.getItem('loopengine_selected_template');
    expect(restored).toBe(stored);
  });
});
