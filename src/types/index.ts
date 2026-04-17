export interface ViralTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  kFactorImpact: string;
  defaultParams: TemplateParams;
}

export type TemplateCategory =
  | 'waitlist'
  | 'referral'
  | 'tiered'
  | 'team'
  | 'freemium';

export interface TemplateParams {
  incentiveType: IncentiveType;
  threshold: number;
  reward: string;
  loopName: string;
}

export type IncentiveType =
  | 'threshold'
  | 'waitlist_position'
  | 'tiered_milestones';

export interface IncentiveRule {
  id: string;
  trigger: string;
  condition: string;
  reward: string;
  type: IncentiveType;
  thresholds?: number[];
}

export interface AnalyticsData {
  kFactor: number;
  inviteCount: number;
  conversionRate: number;
  activeParticipants: number;
  trend: TrendPoint[];
}

export interface TrendPoint {
  date: string;
  value: number;
}

export type AppView = 'generator' | 'analytics' | 'builder' | 'templates';
