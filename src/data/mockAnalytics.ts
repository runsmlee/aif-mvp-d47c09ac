import type { AnalyticsData } from '../types';

/** Seeded pseudo-random number generator for deterministic trend data. */
function seededRandom(seed: number): () => number {
  let state = seed;
  return (): number => {
    state = (state * 1664525 + 1013904223) & 0xffffffff;
    return (state >>> 0) / 0xffffffff;
  };
}

function generateTrendData(): AnalyticsData['trend'] {
  const random = seededRandom(42);
  const points: AnalyticsData['trend'] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    points.push({
      date: date.toISOString().split('T')[0],
      value: Math.round((0.4 + random() * 0.8) * 100) / 100,
    });
  }
  return points;
}

export const mockAnalyticsData: AnalyticsData = {
  kFactor: 1.24,
  inviteCount: 3847,
  conversionRate: 0.32,
  activeParticipants: 892,
  trend: generateTrendData(),
};

export const emptyAnalyticsData: AnalyticsData = {
  kFactor: 0,
  inviteCount: 0,
  conversionRate: 0,
  activeParticipants: 0,
  trend: [],
};
