import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TemplateLibrary } from '../src/components/TemplateLibrary';

describe('TemplateLibrary', () => {
  const defaultProps = {
    onSelectTemplate: vi.fn(),
    activeTemplateId: null,
  };

  it('renders without crash', () => {
    render(<TemplateLibrary {...defaultProps} />);
    expect(screen.getByText(/template library/i)).toBeInTheDocument();
  });

  it('displays at least 5 template cards with name, description, and category tag', () => {
    render(<TemplateLibrary {...defaultProps} />);
    const cards = screen.getAllByTestId('template-card');
    expect(cards.length).toBeGreaterThanOrEqual(5);
    // Check first card has required elements
    expect(cards[0]).toHaveAttribute('data-name');
    expect(screen.getAllByText(/category:/i).length).toBeGreaterThanOrEqual(5);
  });

  it('filters templates by category when a filter chip is selected', async () => {
    render(<TemplateLibrary {...defaultProps} />);
    const referralChip = screen.getByTestId('filter-chip-referral');
    expect(referralChip).toBeInTheDocument();
    await userEvent.click(referralChip);
    const cards = screen.getAllByTestId('template-card');
    // Should show only referral templates
    cards.forEach((card) => {
      expect(card.getAttribute('data-category')).toBe('referral');
    });
  });

  it('loads selected template into SnippetGenerator when "Use Template" is clicked', async () => {
    const onSelectTemplate = vi.fn();
    render(
      <TemplateLibrary {...defaultProps} onSelectTemplate={onSelectTemplate} />
    );
    const useButtons = screen.getAllByRole('button', { name: /use template/i });
    await userEvent.click(useButtons[0]);
    expect(onSelectTemplate).toHaveBeenCalled();
  });

  it('highlights the currently active template', () => {
    render(
      <TemplateLibrary {...defaultProps} activeTemplateId="referral-link" />
    );
    const activeCard = document.getElementById('template-card-referral-link');
    expect(activeCard).toHaveClass('ring-2');
  });
});
