import { useMemo } from 'react';
import type { AnalyticsData } from '../types';

interface KFactorDashboardProps {
  data: AnalyticsData;
}

function MetricCard({
  label,
  value,
  testId,
  accent,
}: {
  label: string;
  value: string;
  testId: string;
  accent?: boolean;
}) {
  return (
    <div className="metric-card group" data-testid={testId}>
      <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-2">
        {label}
      </p>
      <p
        className={`text-2xl font-bold font-mono tracking-tight ${
          accent ? 'text-brand-400' : 'text-white'
        }`}
      >
        {value}
      </p>
      {accent && (
        <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 opacity-60 group-hover:opacity-100 transition-opacity" />
      )}
    </div>
  );
}

function TrendChart({ data }: { data: AnalyticsData['trend'] }) {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;
  const chartHeight = 120;
  const chartWidth = data.length * 20;

  const points = data
    .map((d, i) => {
      const x = i * 20 + 10;
      const y = chartHeight - ((d.value - minValue) / range) * (chartHeight - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `10,${chartHeight} ${points} ${(data.length - 1) * 20 + 10},${chartHeight}`;

  return (
    <div data-testid="trend-chart" className="mt-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-300">
          30-Day K-Factor Trend
        </h3>
        <span className="text-[11px] text-gray-500 font-medium">Last 30 days</span>
      </div>
      <div className="bg-gray-900/60 rounded-xl border border-gray-800/60 p-4 overflow-x-auto">
        <svg
          width={chartWidth}
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full"
          role="img"
          aria-label="K-Factor trend chart over 30 days"
        >
          {/* K=1 reference line */}
          {(() => {
            const k1Y =
              chartHeight -
              ((1 - minValue) / range) * (chartHeight - 20) -
              10;
            if (k1Y > 0 && k1Y < chartHeight) {
              return (
                <line
                  x1="0"
                  y1={k1Y}
                  x2={chartWidth}
                  y2={k1Y}
                  stroke="#EF4444"
                  strokeDasharray="4,4"
                  opacity="0.4"
                />
              );
            }
            return null;
          })()}
          {/* Area fill */}
          <polygon
            points={areaPoints}
            fill="url(#areaGradient)"
            opacity="0.3"
          />
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="flex justify-between text-[11px] text-gray-600 mt-2 font-mono">
          <span>{data[0]?.date}</span>
          <span>{data[data.length - 1]?.date}</span>
        </div>
      </div>
    </div>
  );
}

export function KFactorDashboard({ data }: KFactorDashboardProps) {
  const isEmpty = data.trend.length === 0 && data.kFactor === 0;

  const formattedData = useMemo(
    () => ({
      kFactor: data.kFactor.toFixed(2),
      inviteCount: data.inviteCount.toLocaleString(),
      conversionRate: `${Math.round(data.conversionRate * 100)}%`,
      activeParticipants: data.activeParticipants.toLocaleString(),
    }),
    [data]
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-white tracking-tight">K-Factor Analytics</h2>
        <p className="text-xs text-gray-500 mt-0.5">Track your viral growth metrics in real time</p>
      </div>

      {isEmpty ? (
        <div className="metric-card text-center py-16 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800/50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">No data yet</p>
          <p className="text-xs text-gray-600 mt-1">
            Analytics will appear once your viral loop is live
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <MetricCard
              label="K-Factor"
              value={formattedData.kFactor}
              testId="kfactor-value"
              accent
            />
            <MetricCard
              label="Total Invites"
              value={formattedData.inviteCount}
              testId="invite-count"
            />
            <MetricCard
              label="Conversion Rate"
              value={formattedData.conversionRate}
              testId="conversion-rate"
            />
            <MetricCard
              label="Active Participants"
              value={formattedData.activeParticipants}
              testId="active-participants"
            />
          </div>

          <TrendChart data={data.trend} />

          <div className="flex items-center gap-2.5 text-xs text-gray-500 mt-1">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-brand-500/40 rounded-full" style={{ borderTop: '2px dashed rgba(239,68,68,0.4)' }} />
            </div>
            <span>K = 1 — exponential growth threshold</span>
          </div>
        </>
      )}
    </div>
  );
}
