// ─── ROI Simulator Step Definitions ──────────────────────────────────
// 6 slides across 5 acts. Each slide is interactive and data-dense.

export type RoiLayout =
  | 'roi-title'
  | 'baseline-inputs'
  | 'sankey'
  | 'timeline-dual'
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
    id: 'roi-title',
    act: 1,
    actLabel: 'Your Marketing Machine',
    title: 'The ROI of Organizational Intelligence',
    subtitle: 'Model the financial case for knowledge graph infrastructure',
    layout: 'roi-title',
    themeColor: '#14B8A6',
    content: {
      tagline: 'The cost of not knowing what your organization knows compounds every single day.',
      headline: 'This simulator builds a financial model based on your team size, campaign volume, and current pain points. Adjust the inputs to match your reality — the math speaks for itself.',
    },
  },
  {
    id: 'baseline-inputs',
    act: 1,
    actLabel: 'Your Marketing Machine',
    title: 'Your Current Cost Structure',
    subtitle: 'Adjust the sliders to match your team and operations',
    layout: 'baseline-inputs',
    themeColor: '#14B8A6',
    content: {
      tagline: 'Every enterprise has hidden costs buried in rework, bottlenecks, and coordination overhead.',
    },
  },

  // ─── ACT 2: Where the Time Actually Goes ──────────────────────────
  {
    id: 'time-allocation',
    act: 2,
    actLabel: 'Where Time Goes',
    title: 'Where the Time Actually Goes',
    subtitle: 'How your team hours flow across decision autonomy tiers',
    layout: 'sankey',
    themeColor: '#14B8A6',
    content: {
      tagline: 'Most teams spend 70% of their time on work that could be supervised or automated — if the context existed.',
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
