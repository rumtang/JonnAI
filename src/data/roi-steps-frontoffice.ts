// ─── ROI Simulator Step Definitions ──────────────────────────────────
// 8 slides across 5 acts. Enterprise-grade financial model for front office
// (marketing + sales + service + customer success).

export type RoiLayout =
  | 'quick-calc'
  | 'org-budget-profile'
  | 'martech-media'
  | 'ops-content'
  | 'timeline-dual'
  | 'playbook'
  | 'before-after'
  | 'executive-card';

export interface RoiStep {
  id: string;
  act: number;
  actLabel: string;
  title: string;
  subtitle: string;
  layout: RoiLayout;
  themeColor: string;
  content: {
    tagline?: string;
    headline?: string;
  };
}

export const ROI_STEPS_FRONTOFFICE: RoiStep[] = [
  // ─── Quick Calc (index 0) ─────────────────────────────────────────
  {
    id: 'quick-calc-frontoffice',
    act: 0,
    actLabel: 'Quick Estimate',
    title: 'Quick Front Office Business Case',
    subtitle: 'Three inputs. Instant projection.',
    layout: 'quick-calc',
    themeColor: '#14B8A6',
    content: {
      tagline: 'Start with what you know. Refine later.',
    },
  },

  // ─── ACT 1: Your Revenue Machine Today ────────────────────────────
  {
    id: 'org-budget-profile-frontoffice',
    act: 1,
    actLabel: 'Your Revenue Machine',
    title: 'Organization & Revenue Profile',
    subtitle: 'Revenue, front office headcount, and transformation investment',
    layout: 'org-budget-profile',
    themeColor: '#14B8A6',
    content: {
      tagline: 'Every enterprise front office runs on revenue. This is where your model starts.',
    },
  },

  // ─── ACT 2: Where the Money Goes ──────────────────────────────────
  {
    id: 'revtech-crm-spend',
    act: 2,
    actLabel: 'Where the Money Goes',
    title: 'RevTech & CRM Spend',
    subtitle: 'Platform utilization, tool sprawl, and cross-functional integration pain',
    layout: 'martech-media',
    themeColor: '#14B8A6',
    content: {
      tagline: 'Enterprise RevTech stacks average 40+ tools across marketing, sales, service, and CS — but only 30% of their capability is utilized.',
    },
  },
  {
    id: 'handoff-operations',
    act: 2,
    actLabel: 'Where the Money Goes',
    title: 'Operations & Handoffs',
    subtitle: 'Cross-functional handoff failures and revenue leakage',
    layout: 'ops-content',
    themeColor: '#14B8A6',
    content: {
      tagline: 'Enterprise front offices lose 87% of MQLs and 70% of prospects to inadequate follow-up between functions — the revenue leak is the model.',
    },
  },

  // ─── ACT 3: The Transformation Timeline ───────────────────────────
  {
    id: 'transformation-frontoffice',
    act: 3,
    actLabel: 'The Transformation',
    title: 'The Transformation Timeline',
    subtitle: 'Investment vs. cumulative value over 3 years',
    layout: 'timeline-dual',
    themeColor: '#14B8A6',
    content: {
      tagline: 'Cumulative value typically exceeds investment within 12–18 months.',
    },
  },

  // ─── ACT 3b: The Transformation Playbook ──────────────────────────
  {
    id: 'transformation-playbook-frontoffice',
    act: 3,
    actLabel: 'The Transformation',
    title: 'The Transformation Playbook',
    subtitle: 'Seven actions that deliver the ROI — what you build, how it changes operations, and what it unlocks',
    layout: 'playbook',
    themeColor: '#14B8A6',
    content: {
      tagline: 'Every dollar in the model traces back to a concrete change in how your front office functions together.',
    },
  },

  // ─── ACT 4: The Before & After ────────────────────────────────────
  {
    id: 'before-after-frontoffice',
    act: 4,
    actLabel: 'Before & After',
    title: 'The Before & After',
    subtitle: 'How key cross-functional workflows transform with an organizational intelligence layer',
    layout: 'before-after',
    themeColor: '#14B8A6',
    content: {
      tagline: 'Context flows across departments. Handoffs become automatic. Revenue accelerates.',
    },
  },

  // ─── ACT 5: Your Investment Case ──────────────────────────────────
  {
    id: 'executive-summary-frontoffice',
    act: 5,
    actLabel: 'Your Investment Case',
    title: 'Your Investment Case',
    subtitle: 'Executive summary based on your inputs',
    layout: 'executive-card',
    themeColor: '#14B8A6',
    content: {
      tagline: 'The numbers tell the story. Share this with your leadership team.',
    },
  },
];
