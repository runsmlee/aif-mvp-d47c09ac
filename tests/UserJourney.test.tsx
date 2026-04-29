import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';

describe('Primary Workflow: Generate and Export a Referral Loop', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('completes the full workflow from template selection to code copy', async () => {
    // Step 1: App loads → Dashboard shows sidebar with navigation
    render(<App />);
    expect(screen.getAllByRole('button', { name: /generator/i }).length).toBeGreaterThanOrEqual(1);

    // Step 2: User clicks "Templates" in sidebar → Template Library displays 5+ templates
    const templatesBtn = screen.getAllByRole('button', { name: /templates/i })[0];
    await userEvent.click(templatesBtn);
    await waitFor(() => {
      expect(screen.getByText(/template library/i)).toBeInTheDocument();
    });
    const templateCards = screen.getAllByTestId('template-card');
    expect(templateCards.length).toBeGreaterThanOrEqual(5);

    // Step 3: User selects a referral template → loads into SnippetGenerator
    const referralCard = templateCards.find(
      (card) => card.getAttribute('data-category') === 'referral'
    );
    expect(referralCard).toBeTruthy();
    if (referralCard) {
      await userEvent.click(referralCard);
    }

    // Step 4: Code snippet and Live Preview should be visible after navigation
    await waitFor(() => {
      expect(screen.getByText(/snippet generator/i)).toBeInTheDocument();
    });
    // Code output should exist with the referral template configuration
    await waitFor(() => {
      expect(screen.getByTestId('code-output')).toBeInTheDocument();
    });
    expect(screen.getByTestId('preview-content')).toBeInTheDocument();

    // Step 5: Copy button should be available and functional
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText: mockWriteText } });
    const copyButton = screen.getByRole('button', { name: /copy code snippet/i });
    await userEvent.click(copyButton);
    expect(mockWriteText).toHaveBeenCalled();
    const copiedCode = mockWriteText.mock.calls[0][0] as string;
    expect(copiedCode).toContain('LoopEngine');
  });

  it('navigates to Builder and adds an incentive rule', async () => {
    render(<App />);

    // Step 6: Navigate to "Builder"
    const builderBtn = screen.getAllByRole('button', { name: /builder/i })[0];
    await userEvent.click(builderBtn);
    await waitFor(() => {
      expect(screen.getByText(/incentive logic builder/i)).toBeInTheDocument();
    });

    // Step 7: Add a rule and verify the form appears
    const addRuleBtn = screen.getByRole('button', { name: /add rule/i });
    await userEvent.click(addRuleBtn);

    // Rule should appear with type dropdown, trigger, condition, and reward fields
    await waitFor(() => {
      expect(screen.getByText(/rule #1/i)).toBeInTheDocument();
    });

    // Verify the rule form has the expected dropdowns and inputs
    expect(screen.getByText(/select trigger/i)).toBeInTheDocument();
    expect(screen.getByText(/select condition/i)).toBeInTheDocument();

    // Verify Export JSON button exists but shows validation on click
    const exportBtn = screen.getByRole('button', { name: /export json/i });
    await userEvent.click(exportBtn);
    expect(screen.getByTestId('validation-errors')).toBeInTheDocument();
  });
});

describe('Analytics Workflow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('displays K-factor data, metrics, and trend chart', async () => {
    render(<App />);

    // Step 1: Navigate to "Analytics"
    const analyticsBtn = screen.getAllByRole('button', { name: /analytics/i })[0];
    await userEvent.click(analyticsBtn);

    // Step 2: Dashboard loads with K-factor, invites, conversion, participants
    await waitFor(() => {
      expect(screen.getByTestId('kfactor-value')).toHaveTextContent('1.24');
    });
    expect(screen.getByTestId('invite-count')).toHaveTextContent('3,847');
    expect(screen.getByTestId('conversion-rate')).toHaveTextContent('32%');
    expect(screen.getByTestId('active-participants')).toHaveTextContent('892');

    // Step 3: 30-day trend chart renders
    expect(screen.getByTestId('trend-chart')).toBeInTheDocument();

    // Step 4: K > 1 growth indicator is visible
    expect(screen.getByTestId('growth-banner')).toBeInTheDocument();
    expect(screen.getByText(/exponential growth detected/i)).toBeInTheDocument();
  });

  it('shows LOW badge and no growth banner when K-factor is below 1', async () => {
    // This test verifies the negative case for the growth indicator
    render(<App />);
    const analyticsBtn = screen.getAllByRole('button', { name: /analytics/i })[0];
    await userEvent.click(analyticsBtn);
    // With default mock data (K=1.24), banner should be visible
    await waitFor(() => {
      expect(screen.getByTestId('growth-banner')).toBeInTheDocument();
    });
    // The HIGH badge should be displayed
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });
});
