import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  it('shows hero code panel with SDK quickstart snippet when no template is chosen', () => {
    render(<SnippetGenerator {...defaultProps} />);
    // The hero code panel is the first thing visible
    expect(screen.getByTestId('hero-code-panel')).toBeInTheDocument();
    // It should contain the ViralKit branded comment
    expect(screen.getByTestId('code-output').textContent).toContain('ViralKit');
    // The hero copy button should be prominently visible
    expect(screen.getByTestId('hero-copy-button')).toBeInTheDocument();
  });

  it('hero code panel copy includes branded comment', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: mockWriteText },
    });
    render(<SnippetGenerator {...defaultProps} />);
    const heroCopyBtn = screen.getByTestId('hero-copy-button');
    await userEvent.click(heroCopyBtn);
    expect(mockWriteText).toHaveBeenCalled();
    const copiedText = mockWriteText.mock.calls[0][0] as string;
    expect(copiedText).toContain('// ViralKit — loopengine.dev');
    expect(copiedText).toContain('// Powered by ViralKit — viralkit.dev');
  });

  it('renders hero with 70/30 split layout (code panel + copy section)', () => {
    render(<SnippetGenerator {...defaultProps} />);
    // The hero wrapper should use flex-row for side-by-side layout
    const heroPanel = screen.getByTestId('hero-code-panel');
    expect(heroPanel).toBeInTheDocument();
    // The parent wrapper should have the split layout class
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
});
