import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IncentiveBuilder } from '../src/components/IncentiveBuilder';

describe('IncentiveBuilder', () => {
  const defaultProps = {
    rules: [],
    onRulesChange: vi.fn(),
    initialRule: undefined,
  };

  it('renders without crash', () => {
    render(<IncentiveBuilder {...defaultProps} />);
    expect(screen.getByText(/incentive logic builder/i)).toBeInTheDocument();
  });

  it('adds a new incentive rule when "Add Rule" button is clicked', async () => {
    const onRulesChange = vi.fn();
    render(<IncentiveBuilder {...defaultProps} onRulesChange={onRulesChange} />);
    const addButton = screen.getByRole('button', { name: /add rule/i });
    await userEvent.click(addButton);
    expect(onRulesChange).toHaveBeenCalled();
  });

  it('validates that trigger, condition, and reward fields are all filled before enabling export', async () => {
    const rules = [
      {
        id: 'rule-1',
        trigger: '',
        condition: '',
        reward: '',
        type: 'threshold' as const,
      },
    ];
    render(<IncentiveBuilder {...defaultProps} rules={rules} />);
    const exportButton = screen.getByRole('button', { name: /export json/i });
    // Button is not disabled (only disabled when no rules), but clicking shows errors
    expect(exportButton).not.toBeDisabled();
    await userEvent.click(exportButton);
    expect(screen.getByTestId('validation-errors')).toBeInTheDocument();
  });

  it('outputs a valid JSON config object matching the defined rule structure', async () => {
    const rules = [
      {
        id: 'rule-1',
        trigger: 'user.referral.completed',
        condition: 'count >= 3',
        reward: 'unlock_pro_tier',
        type: 'threshold' as const,
      },
    ];
    render(<IncentiveBuilder {...defaultProps} rules={rules} />);
    const exportButton = screen.getByRole('button', { name: /export json/i });
    expect(exportButton).not.toBeDisabled();
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText: mockWriteText } });
    await userEvent.click(exportButton);
    expect(mockWriteText).toHaveBeenCalled();
    const exported = JSON.parse(mockWriteText.mock.calls[0][0] as string);
    expect(exported).toHaveProperty('rules');
    expect(exported.rules[0]).toHaveProperty('trigger', 'user.referral.completed');
  });

  it('supports threshold-based reward type (N referrals → reward)', () => {
    const rules = [
      {
        id: 'rule-1',
        trigger: 'user.referral.completed',
        condition: 'count >= 5',
        reward: 'unlock_team_tier',
        type: 'threshold' as const,
      },
    ];
    render(<IncentiveBuilder {...defaultProps} rules={rules} />);
    expect(screen.getByDisplayValue(/user\.referral\.completed/)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/count >= 5/)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/unlock_team_tier/)).toBeInTheDocument();
  });

  it('supports waitlist position mechanics reward type', () => {
    const rules = [
      {
        id: 'rule-2',
        trigger: 'user.referral.completed',
        condition: 'waitlist_position > 0',
        reward: 'advance_waitlist_10_positions',
        type: 'waitlist_position' as const,
      },
    ];
    render(<IncentiveBuilder {...defaultProps} rules={rules} />);
    expect(screen.getByDisplayValue(/waitlist_position/)).toBeInTheDocument();
  });

  it('supports tiered milestone rewards (multiple thresholds)', () => {
    const rules = [
      {
        id: 'rule-3',
        trigger: 'user.referral.milestone',
        condition: 'milestone_reached',
        reward: 'tier_upgrade',
        type: 'tiered_milestones' as const,
        thresholds: [1, 5, 10],
      },
    ];
    render(<IncentiveBuilder {...defaultProps} rules={rules} />);
    expect(screen.getByDisplayValue(/milestone_reached/)).toBeInTheDocument();
  });

  it('removes an incentive rule when delete action is triggered', async () => {
    const onRulesChange = vi.fn();
    const rules = [
      {
        id: 'rule-1',
        trigger: 'user.referral.completed',
        condition: 'count >= 3',
        reward: 'unlock_pro',
        type: 'threshold' as const,
      },
    ];
    render(
      <IncentiveBuilder {...defaultProps} rules={rules} onRulesChange={onRulesChange} />
    );
    const deleteButton = screen.getByRole('button', { name: /delete rule/i });
    await userEvent.click(deleteButton);
    expect(onRulesChange).toHaveBeenCalledWith([]);
  });

  it('shows validation error if reward field is empty on export attempt', async () => {
    const rules = [
      {
        id: 'rule-1',
        trigger: 'user.referral.completed',
        condition: 'count >= 3',
        reward: '',
        type: 'threshold' as const,
      },
    ];
    render(<IncentiveBuilder {...defaultProps} rules={rules} />);
    const exportButton = screen.getByRole('button', { name: /export json/i });
    // Clicking export with missing reward triggers validation
    await userEvent.click(exportButton);
    expect(screen.getByTestId('validation-errors')).toBeInTheDocument();
    expect(screen.getByText(/missing required fields/i)).toBeInTheDocument();
  });

  it('shows validation error messages when export is attempted with incomplete rules', async () => {
    const rules = [
      {
        id: 'rule-1',
        trigger: '',
        condition: '',
        reward: '',
        type: 'threshold' as const,
      },
    ];
    render(<IncentiveBuilder {...defaultProps} rules={rules} />);
    // Click the export button to trigger validation display
    const exportButton = screen.getByRole('button', { name: /export json/i });
    await userEvent.click(exportButton);
    // Should show validation errors
    expect(screen.getByTestId('validation-errors')).toBeInTheDocument();
  });
});
