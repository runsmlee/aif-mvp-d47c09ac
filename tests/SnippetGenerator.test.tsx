import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SnippetGenerator } from '../src/components/SnippetGenerator';
import { templates } from '../src/data/templates';

describe('SnippetGenerator', () => {
  const defaultProps = {
    selectedTemplate: null,
    params: null,
    onParamsChange: vi.fn(),
    onTemplateSelect: vi.fn(),
  };

  it('renders without crash', () => {
    render(<SnippetGenerator {...defaultProps} />);
    expect(screen.getByText(/snippet generator/i)).toBeInTheDocument();
  });

  it('displays template selection dropdown with at least 5 viral loop templates', () => {
    render(<SnippetGenerator {...defaultProps} />);
    const select = screen.getByLabelText(/select a template/i);
    expect(select).toBeInTheDocument();
    // Options: placeholder + at least 5 templates
    const options = select.querySelectorAll('option');
    expect(options.length).toBeGreaterThanOrEqual(6);
  });

  it('generates code snippet when a template is selected', async () => {
    const onTemplateSelect = vi.fn();
    render(
      <SnippetGenerator {...defaultProps} onTemplateSelect={onTemplateSelect} />
    );
    const select = screen.getByLabelText(/select a template/i);
    await userEvent.selectOptions(select, 'referral-link');
    expect(onTemplateSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'referral-link' })
    );
  });

  it('updates code output in real-time when parameters change (no "Generate" button)', async () => {
    const params = {
      incentiveType: 'threshold' as const,
      threshold: 3,
      reward: 'Unlock Pro tier',
      loopName: 'referral-link',
    };
    render(
      <SnippetGenerator
        {...defaultProps}
        selectedTemplate={templates[1]}
        params={params}
      />
    );
    // Verify code output area exists
    expect(screen.getByTestId('code-output')).toBeInTheDocument();
    // Verify no Generate button exists
    expect(screen.queryByRole('button', { name: /generate/i })).not.toBeInTheDocument();
  });

  it('copies snippet to clipboard when "Copy" button is clicked', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: mockWriteText },
    });
    const params = {
      incentiveType: 'threshold' as const,
      threshold: 3,
      reward: 'Unlock Pro tier',
      loopName: 'referral-link',
    };
    render(
      <SnippetGenerator
        {...defaultProps}
        selectedTemplate={templates[1]}
        params={params}
      />
    );
    const copyButton = screen.getByRole('button', { name: /copy code snippet/i });
    await userEvent.click(copyButton);
    expect(mockWriteText).toHaveBeenCalled();
  });

  it('shows interactive K-factor calculator hero when no template is chosen', () => {
    render(<SnippetGenerator {...defaultProps} />);
    // The hero calculator panel should be visible
    expect(screen.getByTestId('hero-code-panel')).toBeInTheDocument();
    // K-factor result should be displayed
    expect(screen.getByTestId('hero-kfactor')).toBeInTheDocument();
    // Sliders should be present
    expect(screen.getByLabelText(/average invites per user/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/invite conversion rate percentage/i)).toBeInTheDocument();
  });

  it('computes K-factor = i × c in real-time as sliders change', async () => {
    render(<SnippetGenerator {...defaultProps} />);

    // Default values: invites=4, conversion=25% → K = 4 × 0.25 = 1.00
    const kDisplay = screen.getByTestId('hero-kfactor');
    expect(kDisplay.textContent).toBe('1.00');

    // Change invites slider to 5 → K = 5 × 0.25 = 1.25
    const invitesSlider = screen.getByLabelText(/average invites per user/i);
    await userEvent.tab(); // focus first interactive element
    invitesSlider.focus();
    fireEvent.change(invitesSlider, { target: { value: '5' } });

    expect(kDisplay.textContent).toBe('1.25');

    // Change conversion slider to 40% → K = 5 × 0.40 = 2.00
    const conversionSlider = screen.getByLabelText(/invite conversion rate percentage/i);
    fireEvent.change(conversionSlider, { target: { value: '40' } });

    expect(kDisplay.textContent).toBe('2.00');
  });

  it('renders hero with split layout (calculator panel + copy section)', () => {
    render(<SnippetGenerator {...defaultProps} />);
    // The hero wrapper should exist
    const heroPanel = screen.getByTestId('hero-code-panel');
    expect(heroPanel).toBeInTheDocument();
    // The parent wrapper should have the split layout
    const heroWrapper = heroPanel.closest('[data-testid="hero-wrapper"]');
    expect(heroWrapper).toBeInTheDocument();
    // Value prop copy section should exist
    expect(screen.getByTestId('hero-copy-section')).toBeInTheDocument();
  });

  it('renders primary CTA button in the copy section', () => {
    render(<SnippetGenerator {...defaultProps} />);
    const ctaButton = screen.getByTestId('hero-cta-button');
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton.tagName).toBe('BUTTON');
  });

  it('CTA button focuses template selector when clicked', async () => {
    render(<SnippetGenerator {...defaultProps} />);
    const ctaButton = screen.getByTestId('hero-cta-button');
    await userEvent.click(ctaButton);
    const templateSelect = screen.getByLabelText(/select a template/i);
    expect(templateSelect).toHaveFocus();
  });

  it('generates code referencing LoopEngine SDK', () => {
    const params = {
      incentiveType: 'threshold' as const,
      threshold: 3,
      reward: 'Unlock Pro tier',
      loopName: 'referral-link',
    };
    render(
      <SnippetGenerator
        {...defaultProps}
        selectedTemplate={templates[1]}
        params={params}
      />
    );
    const codeOutput = screen.getByTestId('code-output');
    expect(codeOutput.textContent).toContain('LoopEngine');
    expect(codeOutput.textContent).toContain('@loopengine/sdk');
  });

  it('shows growth status text when K-factor is above 1', async () => {
    render(<SnippetGenerator {...defaultProps} />);
    // Default: invites=4, conversion=25% → K=1.00 — not above 1
    // Change conversion to 30% → K = 4 × 0.30 = 1.20
    const conversionSlider = screen.getByLabelText(/invite conversion rate percentage/i);
    fireEvent.change(conversionSlider, { target: { value: '30' } });

    const status = screen.getByTestId('hero-status');
    expect(status.textContent).toMatch(/exponential growth/i);
  });

  it('shows decay status text when K-factor is well below 1', async () => {
    render(<SnippetGenerator {...defaultProps} />);
    // Set invites=2, conversion=10% → K = 0.20
    const invitesSlider = screen.getByLabelText(/average invites per user/i);
    fireEvent.change(invitesSlider, { target: { value: '2' } });
    const conversionSlider = screen.getByLabelText(/invite conversion rate percentage/i);
    fireEvent.change(conversionSlider, { target: { value: '10' } });

    const status = screen.getByTestId('hero-status');
    expect(status.textContent).toContain('not self-sustaining');
  });
});
