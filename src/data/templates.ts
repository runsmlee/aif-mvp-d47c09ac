import type { ViralTemplate } from '../types';

export const templates: ViralTemplate[] = [
  {
    id: 'waitlist-unlock',
    name: 'Waitlist Unlock',
    description:
      'Users advance on a waitlist by referring friends. Each referral moves them closer to early access.',
    category: 'waitlist',
    kFactorImpact: '0.3 – 0.5',
    defaultParams: {
      incentiveType: 'waitlist_position',
      threshold: 1,
      reward: 'Skip 10 positions on waitlist',
      loopName: 'waitlist-unlock',
    },
  },
  {
    id: 'referral-link',
    name: 'Referral Link',
    description:
      'Classic referral link sharing. Users get a unique link and earn rewards when friends sign up.',
    category: 'referral',
    kFactorImpact: '0.4 – 0.8',
    defaultParams: {
      incentiveType: 'threshold',
      threshold: 3,
      reward: 'Unlock Pro tier',
      loopName: 'referral-link',
    },
  },
  {
    id: 'tiered-rewards',
    name: 'Tiered Rewards',
    description:
      'Milestone-based incentives with escalating rewards at 1, 5, and 10 referrals.',
    category: 'tiered',
    kFactorImpact: '0.6 – 1.2',
    defaultParams: {
      incentiveType: 'tiered_milestones',
      threshold: 5,
      reward: 'Pro tier at 5, Team tier at 10',
      loopName: 'tiered-rewards',
    },
  },
  {
    id: 'team-invite',
    name: 'Team Invites',
    description:
      'Users invite teammates to collaborate. The more teammates, the more features unlock.',
    category: 'team',
    kFactorImpact: '0.5 – 0.9',
    defaultParams: {
      incentiveType: 'threshold',
      threshold: 3,
      reward: 'Unlock team workspace',
      loopName: 'team-invite',
    },
  },
  {
    id: 'freemium-gate',
    name: 'Freemium Gate',
    description:
      'Free users hit a usage cap and can unlock more by inviting friends to the platform.',
    category: 'freemium',
    kFactorImpact: '0.3 – 0.6',
    defaultParams: {
      incentiveType: 'threshold',
      threshold: 2,
      reward: 'Double free tier limits',
      loopName: 'freemium-gate',
    },
  },
  {
    id: 'early-access',
    name: 'Early Access',
    description:
      'Give users early access to new features in exchange for sharing with their network.',
    category: 'waitlist',
    kFactorImpact: '0.2 – 0.4',
    defaultParams: {
      incentiveType: 'waitlist_position',
      threshold: 2,
      reward: 'Early access to beta features',
      loopName: 'early-access',
    },
  },
];
