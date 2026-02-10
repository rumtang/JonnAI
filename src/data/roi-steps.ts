// ─── ROI Simulator Step Definitions ──────────────────────────────────
// 7 slides across 5 acts. Enterprise-grade financial model for S&P 100+.

export type RoiLayout =
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

export const ROI_STEPS: RoiStep[] = [
  // ─── ACT 1: Your Marketing Machine Today ──────────────────────────
  {
    id: 'org-budget-profile',
    act: 1,
    actLabel: 'Your Marketing Machine',
    title: 'Organization & Budget Profile',
    subtitle: 'Revenue, team size, and transformation investment',
    layout: 'org-budget-profile',
    themeColor: '#14B8A6',
    content: {
      tagline: 'Every enterprise marketing machine runs on revenue. This is where your model starts.',
    },
  },

  // ─── ACT 2: Where the Money Goes ──────────────────────────────────
  {
    id: 'martech-media',
    act: 2,
    actLabel: 'Where the Money Goes',
    title: 'Martech & Media Spend',
    subtitle: 'Stack utilization, tool sprawl, and paid media efficiency',
    layout: 'martech-media',
    themeColor: '#14B8A6',
    content: {
      tagline: 'Enterprise martech stacks average 120+ tools — but only 33% of their capability is utilized.',
    },
  },
  {
    id: 'ops-content',
    act: 2,
    actLabel: 'Where the Money Goes',
    title: 'Operations & Content',
    subtitle: 'Campaign volume, content velocity, and operational pain',
    layout: 'ops-content',
    themeColor: '#14B8A6',
    content: {
      tagline: 'Most enterprise teams spend 60% of their time on administrative work that could be automated — if the context existed.',
    },
  },

  // ─── ACT 3: The Transformation Timeline ───────────────────────────
  {
    id: 'transformation',
    act: 3,
    actLabel: 'The Transformation',
    title: 'The Transformation Timeline',
    subtitle: 'Investment vs. cumulative value over 3 years',
    layout: 'timeline-dual',
    themeColor: '#14B8A6',
    content: {
      tagline: 'The knowledge graph pays for itself. The question is when, not if.',
    },
  },

  // ─── ACT 3b: The Transformation Playbook ──────────────────────────
  {
    id: 'transformation-playbook',
    act: 3,
    actLabel: 'The Transformation',
    title: 'The Transformation Playbook',
    subtitle: 'Seven actions that deliver the ROI — what you build, how it changes operations, and what it unlocks',
    layout: 'playbook',
    themeColor: '#14B8A6',
    content: {
      tagline: 'Every dollar in the model traces back to a concrete change in how your team works.',
    },
  },

  // ─── ACT 4: The Before & After ────────────────────────────────────
  {
    id: 'before-after',
    act: 4,
    actLabel: 'Before & After',
    title: 'The Before & After',
    subtitle: 'How key workflows transform with an organizational intelligence layer',
    layout: 'before-after',
    themeColor: '#14B8A6',
    content: {
      tagline: 'Speed without sacrificing governance. Automation without losing control.',
    },
  },

  // ─── ACT 5: Your Investment Case ──────────────────────────────────
  {
    id: 'executive-summary',
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
