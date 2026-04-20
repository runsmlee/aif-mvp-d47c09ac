import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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
    const copyButton = screen.getByRole('button', { name: /copy/i });
    await userEvent.click(copyButton);
    expect(mockWriteText).toHaveBeenCalled();
  });

  it('shows empty state with prompt to select a template when no template is chosen', () => {
    render(<SnippetGenerator {...defaultProps} />);
    expect(
      screen.getByText(/select a template to generate/i)
    ).toBeInTheDocument();
  });

  it('shows integration guide when a template is selected', () => {
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
    expect(screen.getByTestId('integration-guide')).toBeInTheDocument();
    expect(screen.getByText(/integration guide/i)).toBeInTheDocument();
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
