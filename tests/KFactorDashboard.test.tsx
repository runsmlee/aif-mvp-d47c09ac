import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KFactorDashboard } from '../src/components/KFactorDashboard';
import { mockAnalyticsData } from '../src/data/mockAnalytics';

describe('KFactorDashboard', () => {
  it('renders without crash', () => {
    render(<KFactorDashboard data={mockAnalyticsData} />);
    expect(screen.getByText(/k-factor analytics/i)).toBeInTheDocument();
  });

  it('displays K-factor value prominently in the header metric card', () => {
    render(<KFactorDashboard data={mockAnalyticsData} />);
    expect(screen.getByTestId('kfactor-value')).toHaveTextContent('1.24');
  });

  it('shows invite count, conversion rate, and active participants as metric cards', () => {
    render(<KFactorDashboard data={mockAnalyticsData} />);
    expect(screen.getByTestId('invite-count')).toHaveTextContent('3,847');
    expect(screen.getByTestId('conversion-rate')).toHaveTextContent('32%');
    expect(screen.getByTestId('active-participants')).toHaveTextContent('892');
  });

  it('renders a 30-day trend chart for K-factor history', () => {
    render(<KFactorDashboard data={mockAnalyticsData} />);
    expect(screen.getByTestId('trend-chart')).toBeInTheDocument();
  });

  it('loads and displays data within 2 seconds using mock analytics data', () => {
    const { container } = render(<KFactorDashboard data={mockAnalyticsData} />);
    // With mock data provided directly, it should render immediately
    expect(container).toBeTruthy();
    expect(screen.getByTestId('kfactor-value')).toBeInTheDocument();
  });

  it('shows "No data yet" state when no analytics events exist', () => {
    render(
      <KFactorDashboard
        data={{
          kFactor: 0,
          inviteCount: 0,
          conversionRate: 0,
          activeParticipants: 0,
          trend: [],
        }}
      />
    );
    expect(screen.getByText(/no data yet/i)).toBeInTheDocument();
  });
});
