// ─── Transformation Actions ─────────────────────────────────────────
// Front office edition: bridges KG layer work → operational change → financial impact
// across marketing, sales, service, and customer success.

export type ValueStreamKeyFrontOffice =
  | 'revenueLeakage'
  | 'pipelineVelocity'
  | 'serviceEfficiency'
  | 'customerRetention'
  | 'crossSellUpsell'
  | 'revtechOptimization'
  | 'forecastAccuracy';

export const VALUE_STREAM_LABELS_FRONTOFFICE: Record<ValueStreamKeyFrontOffice, string> = {
  revenueLeakage: 'Revenue Leakage Recovery',
  pipelineVelocity: 'Pipeline Velocity',
  serviceEfficiency: 'Service Efficiency',
  customerRetention: 'Customer Retention',
  crossSellUpsell: 'Cross-Sell & Upsell',
  revtechOptimization: 'RevTech Optimization',
  forecastAccuracy: 'Forecast Accuracy',
};

export const VALUE_STREAM_COLORS_FRONTOFFICE: Record<ValueStreamKeyFrontOffice, string> = {
  revenueLeakage: '#EF4444',
  pipelineVelocity: '#14B8A6',
  serviceEfficiency: '#8B5CF6',
  customerRetention: '#F59E0B',
  crossSellUpsell: '#10B981',
  revtechOptimization: '#3B82F6',
  forecastAccuracy: '#EC4899',
};

export interface ValueStreamLinkFrontOffice {
  streamKey: ValueStreamKeyFrontOffice;
  contribution: 'primary' | 'secondary';
  mechanism: string;
}

export interface TransformationActionFrontOffice {
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
  valueStreams: ValueStreamLinkFrontOffice[];
}

export const TRANSFORMATION_ACTIONS_FRONTOFFICE: TransformationActionFrontOffice[] = [
  {
    id: 'customer-360-kb',
    title: 'Customer 360 Knowledge Base',
    icon: '👤',
    kgLayer: 'Context + Structural Layer',
    color: '#14B8A6',
    buildWeeks: 'Weeks 2–14',
    whatYouBuild: 'Unify customer profile across all front office departments with shared identity, interaction history, and context',
    deliverables: [
      'Map customer identity across marketing (lead), sales (opportunity), service (ticket), and CS (account) systems',
      'Index all interactions: email, calls, web behavior, product usage, support tickets, and contracts',
      'Build context integrations: account hierarchy, industry, CSM owner, renewal date, support tier',
      'Create real-time context API that surfaces customer 360 to every front office application',
    ],
    before: 'Each function owns a separate customer view; context is manual lookup or institutional knowledge',
    after: 'Every employee sees unified customer context; historical interactions available in seconds',
    mechanism: 'Graph resolves customer identity across systems and surfaces interactions + context to any app via API',
    valueStreams: [
      { streamKey: 'revenueLeakage', contribution: 'primary', mechanism: 'Unified view eliminates 70% of lost-to-inadequate-follow-up leakage by surfacing context across handoffs' },
      { streamKey: 'pipelineVelocity', contribution: 'secondary', mechanism: 'Sales reps spend 20% less time gathering customer context; velocity increases' },
      { streamKey: 'customerRetention', contribution: 'primary', mechanism: 'Service teams see customer expansion signals proactively; churn prevention triggered early' },
    ],
  },
  {
    id: 'handoff-orchestration',
    title: 'Handoff Orchestration',
    icon: '🔄',
    kgLayer: 'Process Layer',
    color: '#3B82F6',
    buildWeeks: 'Weeks 6–18',
    whatYouBuild: 'Encode cross-functional handoff workflows with context preservation, SLA enforcement, and escalation logic',
    deliverables: [
      'Map handoff workflows: marketing → sales (MQL qualification), sales → service (onboarding), service → CS (renewal readiness)',
      'Encode SLAs per handoff type with escalation logic and stakeholder notifications',
      'Define context packaging: which information travels with each handoff (customer background, issue state, timeline)',
      'Build routing logic: handoff → correct department/person based on customer attributes + workload',
    ],
    before: 'Handoffs are manual; context is often lost; recipients scramble to re-qualify or re-engage; 87% MQL-to-SQL leakage',
    after: 'Agent packages context and routes automatically; SLA breaches trigger escalations; context never lost',
    mechanism: 'Process layer orchestrates handoff based on workflow rules + customer attributes + availability; context API supplies all needed context',
    valueStreams: [
      { streamKey: 'revenueLeakage', contribution: 'primary', mechanism: 'Automated, context-preserving handoffs recover 25-30% of lost MQLs through proper sequencing' },
      { streamKey: 'pipelineVelocity', contribution: 'primary', mechanism: 'Eliminates 3–5 day delay between stages; pipeline accelerates 15-20%' },
      { streamKey: 'forecastAccuracy', contribution: 'secondary', mechanism: 'Consistent handoff process with SLA tracking provides higher-confidence pipeline data' },
    ],
  },
  {
    id: 'revtech-rationalization',
    title: 'RevTech Rationalization',
    icon: '💻',
    kgLayer: 'Structural Layer',
    color: '#3B82F6',
    buildWeeks: 'Weeks 1–12',
    whatYouBuild: 'Audit entire front office tech stack: platforms, integrations, utilization, and consolidation candidates',
    deliverables: [
      'Inventory all tools across marketing, sales, service, CS: vendor, cost, owner, capabilities, integrations',
      'Map data flows and dependencies (CRM → marketing automation → analytics, etc.)',
      'Measure utilization patterns: licenses purchased vs. active users, features used vs. available',
      'Identify overlap candidates: separate analytics tools, multiple CRMs, redundant communication platforms',
    ],
    before: '40+ point solutions at 30% average utilization; significant waste from overlapping platforms and unmaintained integrations',
    after: 'Consolidated stack at 45%+ utilization; eliminated shadow tools; clear ownership model',
    mechanism: 'Graph reveals redundancies and hidden dependencies; consolidation reduces sprawl and improves integration depth',
    valueStreams: [
      { streamKey: 'revtechOptimization', contribution: 'primary', mechanism: 'Closes utilization gap (30%→45%) and consolidates 12-15% of overlapping tools, saving 20-25% of SaaS spend' },
      { streamKey: 'pipelineVelocity', contribution: 'secondary', mechanism: 'Reduced tool count accelerates handoffs and lowers integration debt' },
    ],
  },
  {
    id: 'pipeline-intelligence',
    title: 'Pipeline Intelligence',
    icon: '📊',
    kgLayer: 'Metrics + Context Layers',
    color: '#EC4899',
    buildWeeks: 'Weeks 10–24',
    whatYouBuild: 'Unify pipeline visibility from lead through renewal with real-time metrics, bottleneck detection, and forecast confidence',
    deliverables: [
      'Connect lead → opportunity → customer → account health in one graph',
      'Encode stage definitions and implicit criteria (when does MQL become SQL, SQL become opportunity)',
      'Build velocity dashboard: time in stage, velocity by segment, bottleneck heatmap',
      'Integrate forecast confidence scoring (based on historical conversion patterns)',
    ],
    before: 'Pipeline visibility is fragmented; forecasts are manager gut-feel; bottleneck analysis is manual; 40-50% forecast accuracy',
    after: 'Real-time bottleneck alerts; forecast confidence scores; velocity drivers visible per segment; 65-70% accuracy',
    mechanism: 'Metrics layer connects stage transitions with customer attributes; agent identifies velocity patterns and predicts conversion risk',
    valueStreams: [
      { streamKey: 'pipelineVelocity', contribution: 'primary', mechanism: 'Bottleneck visibility enables 10-15% velocity lift through targeted unblocking' },
      { streamKey: 'forecastAccuracy', contribution: 'primary', mechanism: 'Historical velocity + customer segment patterns improve forecast confidence 15-20 percentage points' },
      { streamKey: 'revenueLeakage', contribution: 'secondary', mechanism: 'Early churn signals from opportunity metrics trigger proactive intervention' },
    ],
  },
  {
    id: 'service-intelligence',
    title: 'Service Intelligence',
    icon: '🛠️',
    kgLayer: 'Rules + Process Layers',
    color: '#8B5CF6',
    buildWeeks: 'Weeks 8–20',
    whatYouBuild: 'Encode support SLAs, routing logic, escalation rules, and knowledge base indexing for unified service operations',
    deliverables: [
      'Build searchable knowledge base of solutions, FAQs, and common escalation paths',
      'Encode SLA definitions per ticket type/severity and escalation triggers',
      'Map routing logic: ticket classification → assigned team/expert based on skill + availability',
      'Connect to customer 360: issue context + customer history + expansion signals visible to agent',
    ],
    before: 'Support tickets route manually; agents spend 30% of time searching for solutions; MTTR is 48+ hours; expansion signals missed',
    after: 'Auto-routing to expert; suggested solutions in <2 min; MTTR drops to 24 hours; expansion signals surfaced proactively',
    mechanism: 'Rules layer validates SLAs and routes; context API surfaces customer + issue history; knowledge index auto-suggests solutions',
    valueStreams: [
      { streamKey: 'serviceEfficiency', contribution: 'primary', mechanism: 'Automation and knowledge indexing reduce resolution time 40-50%; cost-to-serve drops 25%' },
      { streamKey: 'customerRetention', contribution: 'primary', mechanism: 'Faster resolution + proactive expansion signals reduce churn 10-15%' },
      { streamKey: 'crossSellUpsell', contribution: 'secondary', mechanism: 'Service context reveals customer pain points that indicate upsell opportunities' },
    ],
  },
  {
    id: 'customer-health-system',
    title: 'Customer Health System',
    icon: '❤️',
    kgLayer: 'Metrics + Context Layers',
    color: '#F59E0B',
    buildWeeks: 'Weeks 12–26',
    whatYouBuild: 'Real-time customer health scoring with proactive churn prediction and expansion signal detection',
    deliverables: [
      'Build health model: product usage, support engagement, billing metrics, NPS/sentiment signals',
      'Encode churn risk predictors (behavioral + transactional) with confidence scores',
      'Identify expansion signals: unused features, product expansion requests, team growth indicators',
      'Create alert workflow: at-risk accounts → CSM alert; expansion-ready accounts → AE notification',
    ],
    before: 'Churn discovery happens at renewal; 67% of preventable churn goes undetected until too late; expansion reactive only',
    after: 'Churn alerts 60 days pre-renewal; 67% of at-risk accounts identified for proactive intervention; expansion signals trigger CS outreach',
    mechanism: 'Metrics layer continuously scores health; agent monitors for threshold breaches and triggers alerts to CSM/AE',
    valueStreams: [
      { streamKey: 'customerRetention', contribution: 'primary', mechanism: 'Early churn detection enables proactive retention campaigns, reducing preventable churn by 10-12%' },
      { streamKey: 'crossSellUpsell', contribution: 'primary', mechanism: 'Expansion signal detection drives 5-8% net revenue retention lift' },
      { streamKey: 'forecastAccuracy', contribution: 'secondary', mechanism: 'Health scoring improves renewal forecast accuracy by 15-20%' },
    ],
  },
  {
    id: 'cross-domain-governance',
    title: 'Cross-Domain Governance',
    icon: '🧠',
    kgLayer: 'All Layers',
    color: '#10B981',
    buildWeeks: 'Weeks 18–32',
    whatYouBuild: 'Unified rules, SLAs, and approval matrices that span marketing, sales, service, and CS domains',
    deliverables: [
      'Define unified approval frameworks: budget thresholds, discount authority, contract terms authority across functions',
      'Encode shared SLAs: response times, escalation paths, crisis management protocols',
      'Map cross-domain constraints: budget impacts pipeline, forecast triggers service capacity planning, churn drives marketing campaigns',
      'Create governance dashboard: spend velocity, SLA compliance per function, cross-domain bottlenecks',
    ],
    before: 'Each department optimizes locally; decisions lack context on downstream impacts; governance is siloed; deal cycles bloated by re-approval',
    after: 'Agent checks budget + authority + SLA + customer context before recommendation; cross-domain constraints visible in real-time',
    mechanism: 'Cross-domain query graph validates decision against all constraints and surfaces impacts across functions',
    valueStreams: [
      { streamKey: 'pipelineVelocity', contribution: 'primary', mechanism: 'Unified governance eliminates re-approval cycles; deal cycle compresses 5-10%' },
      { streamKey: 'revenueLeakage', contribution: 'primary', mechanism: 'Coordinated rules prevent decision conflicts that delay deals or lose contexts' },
      { streamKey: 'customerRetention', contribution: 'secondary', mechanism: 'Unified escalation logic ensures retention crises escalate across functions simultaneously' },
      { streamKey: 'forecastAccuracy', contribution: 'secondary', mechanism: 'Cross-domain SLA tracking provides higher-fidelity forecast inputs' },
    ],
  },
];

// ─── Per-Stream Adoption Rationale ──────────────────────────────────
// Explains WHY each stream ramps at a different rate — for methodology
// panel and Playbook slide tooltips.
export const STREAM_ADOPTION_RATIONALE_FRONTOFFICE: Record<ValueStreamKeyFrontOffice, {
  adoptionSpeed: 'Quick Win' | 'Medium' | 'Slow';
  techDependency: string;
  changeBarrier: string;
  costReductionNote?: string;
}> = {
  revtechOptimization: {
    adoptionSpeed: 'Quick Win',
    techDependency: 'Structural Layer (martech audit, weeks 1–12)',
    changeBarrier: 'Low — tool rationalization is centralized, IT-driven',
    costReductionNote: 'SaaS licenses are annual contracts. Savings start at next renewal cycle. Average lag: 4 months after tech readiness.',
  },
  pipelineVelocity: {
    adoptionSpeed: 'Medium',
    techDependency: 'Process + Metrics Layers (weeks 6–24)',
    changeBarrier: 'Medium — sales and marketing teams need retraining on new handoff workflows and pipeline metrics',
  },
  revenueLeakage: {
    adoptionSpeed: 'Medium',
    techDependency: 'Context + Process Layers (weeks 2–18)',
    changeBarrier: 'Medium — requires cross-functional alignment on handoff standards and context packaging',
    costReductionNote: 'Revenue recovery compounds over 3-6 months as handoff quality improves and team adoption deepens.',
  },
  serviceEfficiency: {
    adoptionSpeed: 'Medium',
    techDependency: 'Rules + Process Layers (weeks 8–20)',
    changeBarrier: 'Medium — service teams need confidence in routing logic and knowledge base quality',
  },
  forecastAccuracy: {
    adoptionSpeed: 'Slow',
    techDependency: 'Metrics + Pipeline Layers (weeks 10–24)',
    changeBarrier: 'High — finance and sales teams resist changing forecast models that justify existing resource allocation. Trust-building takes time.',
  },
  customerRetention: {
    adoptionSpeed: 'Slow',
    techDependency: 'Context + Metrics + Service Layers (weeks 8–26)',
    changeBarrier: 'High — requires cross-team coordination (service, CS, sales) and organizational process change to respond to churn signals',
  },
  crossSellUpsell: {
    adoptionSpeed: 'Slow',
    techDependency: 'Context + Metrics Layers (weeks 12–26)',
    changeBarrier: 'High — requires sales and CS teams to adopt new workflows and trust AI-generated expansion signals',
  },
};

/** Get all actions that feed a specific value stream */
export function getActionsForStreamFrontOffice(streamKey: ValueStreamKeyFrontOffice): TransformationActionFrontOffice[] {
  return TRANSFORMATION_ACTIONS_FRONTOFFICE.filter(a =>
    a.valueStreams.some(vs => vs.streamKey === streamKey)
  );
}

/** Get primary actions only (major contributors) for a value stream */
export function getPrimaryActionsForStreamFrontOffice(streamKey: ValueStreamKeyFrontOffice): TransformationActionFrontOffice[] {
  return TRANSFORMATION_ACTIONS_FRONTOFFICE.filter(a =>
    a.valueStreams.some(vs => vs.streamKey === streamKey && vs.contribution === 'primary')
  );
}
