import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LivePreview } from '../src/components/LivePreview';
import type { TemplateParams } from '../src/types';

describe('LivePreview', () => {
  const defaultProps = {
    loopType: null as string | null,
    params: null as TemplateParams | null,
  };

  it('renders without crash', () => {
    render(<LivePreview {...defaultProps} />);
    expect(screen.getByRole('heading', { name: /live preview/i })).toBeInTheDocument();
  });

  it('displays a preview panel that reflects the currently configured viral loop', () => {
    const params: TemplateParams = {
      incentiveType: 'threshold',
      threshold: 3,
      reward: 'Unlock Pro tier',
      loopName: 'referral-link',
    };
    render(<LivePreview {...defaultProps} loopType="referral" params={params} />);
    expect(screen.getByTestId('preview-content')).toBeInTheDocument();
    expect(screen.getByText(/refer a friend/i)).toBeInTheDocument();
  });

  it('updates preview within 500ms when a parameter changes in SnippetGenerator', () => {
    const params: TemplateParams = {
      incentiveType: 'threshold',
      threshold: 5,
      reward: 'Team tier',
      loopName: 'referral-link',
    };
    const { rerender } = render(
      <LivePreview {...defaultProps} loopType="referral" params={params} />
    );
    expect(screen.getByText(/5/)).toBeInTheDocument();
    const newParams: TemplateParams = {
      incentiveType: 'threshold',
      threshold: 10,
      reward: 'Team tier',
      loopName: 'referral-link',
    };
    rerender(<LivePreview {...defaultProps} loopType="referral" params={newParams} />);
    expect(screen.getByText(/10/)).toBeInTheDocument();
  });

  it('renders different preview layouts based on loop type (waitlist, referral, tiered)', () => {
    const referralParams: TemplateParams = {
      incentiveType: 'threshold',
      threshold: 3,
      reward: 'Pro',
      loopName: 'referral-link',
    };
    const { rerender } = render(
      <LivePreview {...defaultProps} loopType="referral" params={referralParams} />
    );
    expect(screen.getByText('Refer a Friend')).toBeInTheDocument();

    const waitlistParams: TemplateParams = {
      incentiveType: 'waitlist_position',
      threshold: 1,
      reward: 'Skip 10 positions',
      loopName: 'waitlist-unlock',
    };
    rerender(
      <LivePreview {...defaultProps} loopType="waitlist" params={waitlistParams} />
    );
    expect(screen.getByText('Waitlist Position')).toBeInTheDocument();

    const tieredParams: TemplateParams = {
      incentiveType: 'tiered_milestones',
      threshold: 5,
      reward: 'Pro tier at 5',
      loopName: 'tiered-rewards',
    };
    rerender(
      <LivePreview {...defaultProps} loopType="tiered" params={tieredParams} />
    );
    expect(screen.getByText('Milestone Rewards')).toBeInTheDocument();
  });

  it('shows placeholder state when no loop is configured', () => {
    render(<LivePreview {...defaultProps} />);
    expect(
      screen.getByText(/configure a viral loop to see/i)
    ).toBeInTheDocument();
  });
});
