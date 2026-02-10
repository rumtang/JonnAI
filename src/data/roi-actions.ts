// ─── Transformation Actions ─────────────────────────────────────────
// Bridges the Build It implementation plan to the ROI value streams.
// Each action maps: KG layer work → operational change → financial impact.

export type ValueStreamKey =
  | 'roasImprovement'
  | 'personalizationLift'
  | 'campaignSpeed'
  | 'martechOptimization'
  | 'contentVelocity'
  | 'operationalEfficiency'
  | 'attributionImprovement';

export const VALUE_STREAM_LABELS: Record<ValueStreamKey, string> = {
  roasImprovement: 'ROAS Improvement',
  personalizationLift: 'Personalization Lift',
  campaignSpeed: 'Campaign Speed',
  martechOptimization: 'Martech Optimization',
  contentVelocity: 'Content Velocity',
  operationalEfficiency: 'Ops Efficiency',
  attributionImprovement: 'Attribution',
};

export const VALUE_STREAM_COLORS: Record<ValueStreamKey, string> = {
  roasImprovement: '#9B7ACC',
  personalizationLift: '#4CAF50',
  campaignSpeed: '#C9A04E',
  martechOptimization: '#E88D67',
  contentVelocity: '#5B9ECF',
  operationalEfficiency: '#D4856A',
  attributionImprovement: '#f59e0b',
};

export interface ValueStreamLink {
  streamKey: ValueStreamKey;
  contribution: 'primary' | 'secondary';
  mechanism: string;
}

export interface TransformationAction {
  id: string;
  title: string;
  icon: string;
  kgLayer: string;
  color: string;
  buildWeeks: string;
  // What gets built
  whatYouBuild: string;
  deliverables: string[];
  // How operations change
  before: string;
  after: string;
  mechanism: string;
  // Which value streams this feeds
  valueStreams: ValueStreamLink[];
}

export const TRANSFORMATION_ACTIONS: TransformationAction[] = [
  {
    id: 'brand-compliance-kb',
    title: 'Brand & Compliance KB',
    icon: '🎨',
    kgLayer: 'Rules Layer',
    color: '#9B7ACC',
    buildWeeks: 'Weeks 4–16',
    whatYouBuild: 'Encode brand guidelines, regulatory docs, and consent frameworks as machine-readable rules',
    deliverables: [
      'Decompose brand PDFs into testable rules (tone, terminology, visual specs)',
      'Map regulatory requirements (GDPR, CCPA, industry) to workflows',
      'Encode consent frameworks with geographic variations',
      'Create claim substantiation database linked to product catalog',
    ],
    before: 'Brand review takes 3-7 days; 20% of creative requires rework',
    after: 'Pre-flight checks in <30 seconds; pre-approved templates eliminate 70% of reviews',
    mechanism: 'Agent validates every asset against brand rules + regulatory constraints before human review',
    valueStreams: [
      { streamKey: 'campaignSpeed', contribution: 'primary', mechanism: 'Reduces approval cycle from days to hours for compliant campaigns' },
      { streamKey: 'operationalEfficiency', contribution: 'primary', mechanism: 'Cuts rework from 20% to 8% by catching issues pre-production' },
      { streamKey: 'contentVelocity', contribution: 'secondary', mechanism: 'Pre-approved templates accelerate 60% of asset production' },
    ],
  },
  {
    id: 'process-automation',
    title: 'Workflow Automation',
    icon: '⚙️',
    kgLayer: 'Process Layer',
    color: '#5B9ECF',
    buildWeeks: 'Weeks 4–14',
    whatYouBuild: 'Map and encode workflows, approval chains, and orchestration rules',
    deliverables: [
      'Extract and encode 40+ marketing workflows with decision points',
      'Map approval matrices to org hierarchy (budget thresholds, authorities)',
      'Encode SOPs and playbooks as executable decision trees',
      'Build routing engine for handoffs and dependencies',
    ],
    before: 'Campaigns stuck in approval queues (avg 7 days); 60% admin overhead',
    after: 'Auto-routing to correct approver; parallel approvals where possible',
    mechanism: 'Agent orchestrates workflow based on encoded process logic + approval authority matrix',
    valueStreams: [
      { streamKey: 'campaignSpeed', contribution: 'primary', mechanism: 'Cuts cycle time 25% through parallel approvals and smart routing' },
      { streamKey: 'operationalEfficiency', contribution: 'primary', mechanism: 'Shifts 30% of admin time to strategic work via automation' },
      { streamKey: 'contentVelocity', contribution: 'secondary', mechanism: 'Self-service briefs eliminate 2-3 day wait for brief approval' },
    ],
  },
  {
    id: 'martech-rationalization',
    title: 'Martech Rationalization',
    icon: '💻',
    kgLayer: 'Structural Layer',
    color: '#E88D67',
    buildWeeks: 'Weeks 1–12',
    whatYouBuild: 'Map tech stack, integrations, usage patterns, and consolidation opportunities',
    deliverables: [
      'Inventory all tools with vendor, cost, owner, capabilities, API availability',
      'Map data flows and integration points between systems',
      'Analyze utilization patterns (license vs. actual usage)',
      'Identify overlapping capabilities and consolidation candidates',
    ],
    before: '120 tools at 33% utilization; significant waste from redundancy',
    after: 'Consolidated stack at 50% utilization; eliminated shadow tools',
    mechanism: 'Graph reveals redundancies; better tool-to-workflow mapping increases utilization',
    valueStreams: [
      { streamKey: 'martechOptimization', contribution: 'primary', mechanism: 'Closes utilization gap (33%→50%) + consolidates 20% of overlapping tools' },
    ],
  },
  {
    id: 'attribution-measurement',
    title: 'Attribution & Measurement',
    icon: '📊',
    kgLayer: 'Metrics Layer',
    color: '#C9A04E',
    buildWeeks: 'Weeks 10–22',
    whatYouBuild: 'Integrate KPI frameworks, attribution models, and dashboards into unified measurement layer',
    deliverables: [
      'Encode KPI definitions with explicit formulas (resolve "ROAS means 3 things" problem)',
      'Map attribution models (first-touch, multi-touch) with confidence levels',
      'Connect dashboards to canonical KPI definitions',
      'Integrate MMM results and incrementality tests as decision inputs',
    ],
    before: 'Attribution is 33% manual; budget decisions lag by weeks',
    after: 'Real-time multi-touch attribution feeds auto-reallocation recommendations',
    mechanism: 'Agent queries unified measurement layer for attribution + performance + incrementality data',
    valueStreams: [
      { streamKey: 'attributionImprovement', contribution: 'primary', mechanism: 'Improves attribution accuracy 10% through unified measurement' },
      { streamKey: 'roasImprovement', contribution: 'primary', mechanism: 'Real-time ROAS monitoring enables faster optimization cycles' },
    ],
  },
  {
    id: 'content-intelligence',
    title: 'Content Intelligence',
    icon: '📝',
    kgLayer: 'Context + Process',
    color: '#4CAF50',
    buildWeeks: 'Weeks 10–22',
    whatYouBuild: 'Index content assets, map creation workflows, and encode quality standards',
    deliverables: [
      'Build content asset index with metadata, performance, and reuse history',
      'Map content production workflows from brief → draft → review → publish',
      'Encode quality standards (readability, SEO, accessibility)',
      'Create template library with brand-compliant starting points',
    ],
    before: 'Content production is a 14-day cycle; no asset reuse; agency bills for repetitive work',
    after: 'AI drafts with brand context in 30 min; 40% of assets reused; agency focuses on strategy',
    mechanism: 'Agent generates first drafts using indexed best-performers + brand rules; suggests reusable assets',
    valueStreams: [
      { streamKey: 'contentVelocity', contribution: 'primary', mechanism: 'Reduces content production cost 40% through AI drafting + asset reuse' },
      { streamKey: 'operationalEfficiency', contribution: 'secondary', mechanism: 'Content team shifts from production to strategy' },
    ],
  },
  {
    id: 'audience-personalization',
    title: 'Audience & Personalization',
    icon: '🎯',
    kgLayer: 'Context + Metrics',
    color: '#14B8A6',
    buildWeeks: 'Weeks 10–22',
    whatYouBuild: 'Connect audience segments, behavioral data, preference models, and journey maps',
    deliverables: [
      'Encode persona definitions with behavioral attributes from CDP/CRM',
      'Map customer journey stages with content preferences per stage',
      'Integrate segmentation models with real-time behavioral signals',
      'Build personalization rules (segment → creative variant → channel)',
    ],
    before: 'One-size-fits-all campaigns; personalization is manual and time-intensive',
    after: 'Dynamic creative per segment; AI-optimized messaging based on behavior',
    mechanism: 'Agent queries audience graph for segment attributes + journey stage → selects optimal creative',
    valueStreams: [
      { streamKey: 'personalizationLift', contribution: 'primary', mechanism: '8% revenue lift through personalized experiences at scale' },
      { streamKey: 'roasImprovement', contribution: 'primary', mechanism: 'Better targeting improves ROAS through audience-creative matching' },
    ],
  },
  {
    id: 'cross-domain-intelligence',
    title: 'Cross-Domain Network',
    icon: '🧠',
    kgLayer: 'All Layers',
    color: '#D4856A',
    buildWeeks: 'Weeks 17–28',
    whatYouBuild: 'Connect Legal, Finance, Strategy, Product, and IT domains to marketing graph',
    deliverables: [
      'Integrate Finance: budget allocations, approval thresholds, spend velocity',
      'Integrate Legal: approved messaging, regulatory constraints by jurisdiction',
      'Integrate Strategy: OKRs, priorities, competitive positioning',
      'Integrate Product: roadmaps, pricing, feature specs, launch timelines',
    ],
    before: 'Each approval requires manual coordination across 3-5 departments',
    after: 'Agent checks budget + legal + inventory + capacity constraints in parallel',
    mechanism: 'Cross-domain queries traverse graph to validate decisions against all blocking dependencies',
    valueStreams: [
      { streamKey: 'campaignSpeed', contribution: 'primary', mechanism: 'Parallel constraint checking eliminates cross-department bottlenecks' },
      { streamKey: 'operationalEfficiency', contribution: 'primary', mechanism: 'Eliminates coordination overhead across organizational silos' },
    ],
  },
];

/** Get all actions that feed a specific value stream */
export function getActionsForStream(streamKey: ValueStreamKey): TransformationAction[] {
  return TRANSFORMATION_ACTIONS.filter(a =>
    a.valueStreams.some(vs => vs.streamKey === streamKey)
  );
}

/** Get primary actions only (major contributors) for a value stream */
export function getPrimaryActionsForStream(streamKey: ValueStreamKey): TransformationAction[] {
  return TRANSFORMATION_ACTIONS.filter(a =>
    a.valueStreams.some(vs => vs.streamKey === streamKey && vs.contribution === 'primary')
  );
}
