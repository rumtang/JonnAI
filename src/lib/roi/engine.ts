// ─── Enterprise ROI Economic Calculation Engine ─────────────────────
// Revenue-anchored model for S&P 100+ marketing organizations.
// Pure functions — no side effects, fully testable.
// All monetary values in USD. All time values in months unless noted.
//
// Benchmark sources: Gartner 2025 CMO Spend Survey, McKinsey
// Personalization Analysis, Salesforce State of Marketing,
// Forrester, HubSpot State of Marketing 2025.

// ─── Constants ───────────────────────────────────────────────────────
export const DISCOUNT_RATE = 0.10;        // 10% annual for NPV
export const PROJECTION_MONTHS = 36;      // 3-year model
export const HOURS_PER_YEAR = 2080;       // 40hr × 52wk

export const SCENARIO_MULTIPLIERS = {
  conservative: 0.6,
  expected: 1.0,
  aggressive: 1.4,
} as const;

export type Scenario = keyof typeof SCENARIO_MULTIPLIERS;

// ─── Industry Benchmark Constants ──────────────────────────────────
// Source: Gartner 2025 CMO Spend Survey, Deloitte CMO Survey, industry analyses

export const INDUSTRY_BUDGET_RATIOS: Record<string, number> = {
  'B2B Average': 6.7,
  'B2C Average': 9.6,
  'Technology': 8.5,
  'Financial Services': 8.0,
  'Healthcare / Pharma': 7.2,
  'Consumer Packaged Goods': 10.9,
  'Retail': 8.3,
  'Media / Entertainment': 9.1,
  'Telecom': 5.3,
  'Energy / Industrial': 3.1,
  'Professional Services': 7.8,
};

export const CHANNEL_ROAS_BENCHMARKS: Record<string, { current: number; aiOptimized: number }> = {
  'Google Search': { current: 8.0, aiOptimized: 9.6 },
  'Google Shopping': { current: 5.5, aiOptimized: 6.8 },
  'Meta (Facebook/Instagram)': { current: 3.5, aiOptimized: 4.3 },
  'LinkedIn': { current: 2.1, aiOptimized: 2.7 },
  'Programmatic Display': { current: 1.8, aiOptimized: 2.3 },
  'TikTok': { current: 2.4, aiOptimized: 3.1 },
  'YouTube': { current: 2.0, aiOptimized: 2.6 },
  'Connected TV': { current: 1.5, aiOptimized: 2.0 },
};

export const AI_IMPACT_BENCHMARKS = {
  contentCostReduction: 65,     // % reduction in content production cost
  headcountSavings: 20,         // % headcount reduction through automation
  wasteRecovery: 50,            // % of identified waste recoverable via AI
  personalizationLift: 12,      // % revenue lift from AI personalization (McKinsey)
  roasImprovement: 20,          // % ROAS lift (Meta 22%, Google 17% → blended 20%)
  agenticSpeedMultiplier: 3,    // 3x faster campaign execution
  agenticCostReduction: 40,     // 40% cost reduction in campaign ops
} as const;

export const DO_NOTHING_EROSION = {
  quarterlyPct: 2,     // 2% erosion per quarter from competitive gap
  year1Pct: 16,        // cumulative after year 1 (compound)
  year2Pct: 25,        // cumulative after year 2
  year3Pct: 34,        // cumulative after year 3
} as const;

export const COST_INFLATION = {
  googleCpcYoY: 13,       // % annual CPC inflation
  metaCpmYoY: 19.2,       // % annual CPM inflation
  laborCostYoY: 4.5,      // % annual salary inflation for marketing roles
} as const;

// Only profit margin on incremental revenue counts as value — not gross revenue
export const CONTRIBUTION_MARGIN_PCT = 20;

// Industry-standard software maintenance ratio: covers LLM API tokens,
// cloud infrastructure, knowledge graph maintenance, DevOps staffing
export const ONGOING_OPEX_PCT = 20;

export const CFO_FRAMEWORK = {
  wacc: 10,               // weighted average cost of capital %
  hurdle_rate: 15,        // minimum IRR for investment approval %
  paybackExpectationMonths: 24,
  doNothingErosionYear1: 16,   // % revenue at risk from inaction
  riskAdjustmentPct: 20,       // haircut for conservative scenario
} as const;

export const CONFIDENCE_LEVELS = {
  high: { label: 'High', color: '#4CAF50', description: 'Multiple corroborating sources, large samples' },
  medium: { label: 'Medium', color: '#f59e0b', description: 'Single authoritative source or moderate sample' },
  emerging: { label: 'Emerging', color: '#9B7ACC', description: 'Early data, directionally correct' },
} as const;

export type ConfidenceLevel = keyof typeof CONFIDENCE_LEVELS;

export const SOURCE_ATTRIBUTION: Record<string, { source: string; confidence: ConfidenceLevel; sampleSize?: string }> = {
  marketingBudgetPct: { source: 'Gartner 2025 CMO Spend Survey', confidence: 'high', sampleSize: '400+ CMOs' },
  martechUtilization: { source: 'Gartner 2024 Martech Survey', confidence: 'high', sampleSize: '400+ enterprises' },
  toolCount: { source: 'ChiefMartec / MartechMap 2024', confidence: 'medium' },
  paidMediaPct: { source: 'Gartner 2025 CMO Spend Survey', confidence: 'high', sampleSize: '400+ CMOs' },
  blendedRoas: { source: 'Google/Nielsen Cross-Channel Study (blended estimate)', confidence: 'emerging' },
  adminTimePct: { source: 'Salesforce State of Marketing 2025', confidence: 'high', sampleSize: '4,800+ marketers' },
  contentTimeSavings: { source: 'HubSpot State of Marketing 2025 (first-draft text only)', confidence: 'medium', sampleSize: '1,400+ marketers' },
  personalizationLift: { source: 'McKinsey Personalization Analysis 2023 (top quartile)', confidence: 'high' },
  roasLift: { source: 'Platform vendor case studies (Meta, Google) — not independently verified', confidence: 'emerging' },
  reworkRate: { source: 'Lucidpress Brand Consistency Report', confidence: 'medium' },
  marketingWaste: { source: 'Rakuten/ANA Programmatic Study', confidence: 'medium', sampleSize: '1,000+ advertisers' },
  doNothingErosion: { source: 'PwC/ANA Digital Maturity Study (illustrative erosion model)', confidence: 'emerging' },
  contributionMargin: { source: 'Industry average marketing contribution margin (20% of incremental revenue)', confidence: 'medium' },
  ongoingOpEx: { source: 'Industry-standard software maintenance ratio (20% of capital cost per year)', confidence: 'high' },
};

// ─── Input Types ─────────────────────────────────────────────────────

/** Revenue-anchored org profile. Everything cascades from annualRevenue. */
export interface OrganizationProfile {
  annualRevenue: number;              // $100M – $750B (log-scale slider)
  marketingBudgetPct: number;         // % of revenue (Gartner 2025: 7.7%)
  marketingHeadcount: number;         // 10–5,000
  avgLoadedFteCost: number;           // $80K–$400K fully loaded
  industry?: string;                  // Industry vertical for benchmark defaults
  companyName?: string;               // Optional — personalizes outputs and PDF report
}

/** Martech stack and paid media spend — drives optimization + ROAS streams. */
export interface MartechAndMedia {
  martechPctOfBudget: number;         // % of mktg budget (Gartner: 23.8%)
  martechToolCount: number;           // number of tools (avg: 120)
  martechUtilizationPct: number;      // % of capability used (Gartner: 33%)
  paidMediaPctOfBudget: number;       // % of mktg budget (Gartner: 30.6%)
  currentBlendedRoas: number;         // ROAS ratio (cross-channel avg: 2.5)
}

/** Campaign and content volume at enterprise scale. */
export interface ContentAndCampaignOps {
  monthlyCampaigns: number;           // 10–2,000
  monthlyContentAssets: number;       // 50–10,000
  avgCampaignCycleWeeks: number;      // Derived from distribution below
  channelCount: number;               // 3–20
  agencyPctOfBudget: number;          // 5–30%
  // Campaign lifecycle distribution — % of campaigns in each duration bucket
  campaignCycleShortPct: number;      // % at 1-10 weeks (quick-turn digital/social)
  campaignCycleMediumPct: number;     // % at 11-25 weeks (integrated/seasonal)
  campaignCycleLongPct: number;       // % at 25-52 weeks (brand/annual programs)
}

// Midpoints for campaign cycle distribution buckets
export const CAMPAIGN_CYCLE_MIDPOINTS = {
  short: 5.5,    // midpoint of 1-10 weeks
  medium: 18,    // midpoint of 11-25 weeks
  long: 38.5,    // midpoint of 25-52 weeks
} as const;

/** Compute weighted average campaign cycle from distribution percentages. */
export function computeWeightedCycleWeeks(shortPct: number, mediumPct: number, longPct: number): number {
  const total = shortPct + mediumPct + longPct;
  if (total === 0) return 6; // fallback
  return (
    (shortPct * CAMPAIGN_CYCLE_MIDPOINTS.short +
     mediumPct * CAMPAIGN_CYCLE_MIDPOINTS.medium +
     longPct * CAMPAIGN_CYCLE_MIDPOINTS.long) / total
  );
}

/** Quantified operational inefficiencies. */
export interface OperationalPain {
  reworkRatePct: number;              // 5–40% (brand consistency research: 20%)
  approvalCycleDays: number;          // 1–20 (enterprise w/ compliance: 7)
  adminTimePct: number;               // 30–80% (Salesforce: 60%)
  marketingWasteRatePct: number;      // 10–50% (mid-range: 30%)
  manualAttributionPct: number;       // 10–60% (Salesforce: 33%)
}

/** User-configurable investment — no longer hardcoded. */
export interface TransformationInvestment {
  totalInvestmentAmount: number;      // $250K – $100M (log-scale slider), default ~$3M
  implementationWeeks: number;        // 8–156 (~2–36 months), default 28
}

/** Improvement assumptions — independently-verified conservative levels, not UI-exposed. */
export interface ImprovementAssumptions {
  roasLiftPct: number;               // Independent studies: 10-15% → default 12%
  contentTimeSavingsPct: number;      // Full production savings → default 40%
  personalizationRevLiftPct: number;  // McKinsey median (not top quartile) → default 8%
  cycleTimeReductionPct: number;      // AI-assisted (not full automation) → default 25%
  reworkReductionPct: number;         // Year 1-2 realistic → default 40%
  adminToStrategicShiftPct: number;   // Achievable shift → default 30%
  attributionImprovementPct: number;  // Conservative → default 10%
  martechUtilizationTargetPct: number;// Achievable: 33% → 50%
  martechToolConsolidationPct: number;// Realistic consolidation: 20%
}

// ─── Agent Intensity ─────────────────────────────────────────────────
// Three-level selector for how deeply an organization adopts AI agents.
// Orthogonal to the scenario multiplier (conservative/expected/aggressive).
// Medium = current defaults — zero change for existing users.

export type AgentIntensity = 'low' | 'medium' | 'high';

export const AGENT_INTENSITY_LEVELS: Record<AgentIntensity, {
  label: string;
  shortDescription: string;
  description: string;
  benchmarkNote: string;
}> = {
  low: {
    label: 'Co-Pilot',
    shortDescription: 'Humans lead, AI assists',
    description: 'AI augments existing workflows — content drafting, report generation, basic optimization. Humans remain primary decision-makers with AI as a productivity tool.',
    benchmarkNote: '~Half of industry-median improvement assumptions. Appropriate for organizations early in AI adoption.',
  },
  medium: {
    label: 'Agentic',
    shortDescription: 'AI executes, humans supervise',
    description: 'AI agents handle end-to-end workflow execution — campaign optimization, content production, attribution analysis — with human oversight at key decision points.',
    benchmarkNote: 'Aligned with 2026 industry medians: 88% of orgs have integrated AI, 60% of marketing roles partially automated.',
  },
  high: {
    label: 'Autonomous',
    shortDescription: 'AI drives, humans steer strategy',
    description: 'Fully autonomous AI operations across the marketing function — real-time optimization, self-healing campaigns, predictive resource allocation. Humans focus on strategy and creative direction.',
    benchmarkNote: 'Aligned with top-quartile benchmarks: 65% content cost reduction, 20% ROAS lift, 79% customer journey automation.',
  },
};

export const INTENSITY_PRESETS: Record<AgentIntensity, ImprovementAssumptions> = {
  low: {
    roasLiftPct: 6,
    contentTimeSavingsPct: 20,
    personalizationRevLiftPct: 4,
    cycleTimeReductionPct: 10,
    reworkReductionPct: 20,
    adminToStrategicShiftPct: 15,
    attributionImprovementPct: 5,
    martechUtilizationTargetPct: 40,
    martechToolConsolidationPct: 10,
  },
  medium: {
    roasLiftPct: 12,
    contentTimeSavingsPct: 40,
    personalizationRevLiftPct: 8,
    cycleTimeReductionPct: 25,
    reworkReductionPct: 40,
    adminToStrategicShiftPct: 30,
    attributionImprovementPct: 10,
    martechUtilizationTargetPct: 50,
    martechToolConsolidationPct: 20,
  },
  high: {
    roasLiftPct: 20,
    contentTimeSavingsPct: 65,
    personalizationRevLiftPct: 15,
    cycleTimeReductionPct: 50,
    reworkReductionPct: 60,
    adminToStrategicShiftPct: 55,
    attributionImprovementPct: 20,
    martechUtilizationTargetPct: 65,
    martechToolConsolidationPct: 35,
  },
};

// ─── Output Types ────────────────────────────────────────────────────

/** Computed once from inputs, reused by all value stream calculations. */
export interface DerivedMetrics {
  totalMarketingBudget: number;
  totalTeamCost: number;
  annualMartechSpend: number;
  annualPaidMediaSpend: number;
  annualAgencySpend: number;
  currentAdRevenue: number;
  contentTeamCost: number;
  hourlyRate: number;
  dailyMarketingBudget: number;
}

export interface WaterfallSegment {
  label: string;
  value: number;
  color: string;
}

export interface BaselineOutputs {
  derived: DerivedMetrics;

  annualTeamCost: number;
  annualMartechWaste: number;
  annualMediaWaste: number;
  annualAgencyCost: number;
  annualReworkCost: number;
  annualAdminOverheadCost: number;
  annualApprovalBottleneckCost: number;
  annualAttributionWaste: number;
  totalAnnualCost: number;

  waterfall: WaterfallSegment[];
}

export interface ValueStreams {
  martechOptimization: number;
  roasImprovement: number;
  contentVelocity: number;
  campaignSpeed: number;
  operationalEfficiency: number;
  attributionImprovement: number;
  personalizationLift: number;
}

export interface TimelinePoint {
  month: number;
  investmentCumulative: number;
  valueConservative: number;
  valueExpected: number;
  valueAggressive: number;
  phase: string;
}

export interface WorkflowComparison {
  name: string;
  icon: string;
  beforeDays: number;
  afterValue: number;
  afterUnit: 'days' | 'hours' | 'minutes';
  savingsPct: number;
}

export interface AllocationSlice {
  label: string;
  pct: number;
  color: string;
}

export interface RoasComparison {
  currentRoas: number;
  projectedRoas: number;
  currentAdRevenue: number;
  projectedAdRevenue: number;
  incrementalRevenue: number;
}

export interface ChannelRoasEntry {
  channel: string;
  currentRoas: number;
  aiOptimizedRoas: number;
  liftPct: number;
}

export interface EnterpriseModelOutputs {
  budgetWasteTotal: number;
  aiRecoveryPotential: number;
  contentSavings: number;
  headcountSavings: number;
  merImprovement: number;          // marketing efficiency ratio
  totalEnterpriseValue: number;
}

export interface DoNothingOutputs {
  quarterlyLosses: number[];       // 8 quarters of cumulative loss
  year1Loss: number;
  year2Loss: number;
  year3Loss: number;
  year1ErosionPct: number;
  year2ErosionPct: number;
  year3ErosionPct: number;
}

export interface RoiOutputs {
  totalInvestment: number;
  implementationWeeks: number;
  annualOpEx: number;

  valueStreams: ValueStreams;
  totalAnnualValue: number;

  threeYearRoi: number;
  paybackMonths: number;
  netPresentValue: number;
  irr: number;

  timeline: TimelinePoint[];
  breakEvenMonth: number;

  workflows: WorkflowComparison[];
  roas: RoasComparison;
  channelRoas: ChannelRoasEntry[];

  currentAllocation: AllocationSlice[];
  futureAllocation: AllocationSlice[];

  enterpriseModel: EnterpriseModelOutputs;
  doNothing: DoNothingOutputs;
}

// ─── Ramp Function ───────────────────────────────────────────────────
// Legacy uniform S-curve — kept exported for backward compatibility.
// computeRoi() now uses streamRampFactor() for per-stream adoption curves.
export function rampFactor(month: number): number {
  if (month <= 0) return 0;
  if (month <= 7) return (month / 7) * 0.3;
  if (month <= 12) return 0.3 + ((month - 7) / 5) * 0.4;
  if (month <= 18) return 0.7 + ((month - 12) / 6) * 0.2;
  if (month <= 36) return 0.9 + ((month - 18) / 18) * 0.1;
  return 1.0;
}

// ─── Per-Stream Adoption Parameters ─────────────────────────────────
// Each value stream has its own adoption curve reflecting:
// 1. Tech readiness: which KG layers must complete (scales with build timeline)
// 2. Change management: training, trust, org alignment (fixed duration)
// 3. Cost reduction lag: SaaS renewal cycles, contract terms (savings streams only)

export interface StreamAdoptionParams {
  techReadyWeek: number;           // Week the prerequisite KG layers complete (at 28-week reference build)
  changeManagementMonths: number;  // Fixed months after tech-ready for training/trust/alignment
  costReductionLagMonths: number;  // Additional lag for savings streams — contract cycles
  sCurveK: number;                 // Logistic steepness (0.3–0.8, higher = faster)
  sCurveMidpointOffset: number;    // Months after adoption-start to reach 50%
  maxRealization18mo: number;      // Ceiling cap at month 18 (organizational inertia)
  maxRealization36mo: number;      // Ceiling cap at month 36
}

type ValueStreamKey = keyof ValueStreams;

export const STREAM_ADOPTION_PARAMS: Record<ValueStreamKey, StreamAdoptionParams> = {
  // Martech audit completes early (week 12), but SaaS licenses are annual contracts.
  // You identify the redundant tool in month 3 but can't cancel until the next renewal.
  // Average wait = 6 months, discounted to 4 for overlapping renewals.
  martechOptimization: {
    techReadyWeek: 12,
    changeManagementMonths: 2,
    costReductionLagMonths: 4,
    sCurveK: 0.6,
    sCurveMidpointOffset: 5,
    maxRealization18mo: 0.75,
    maxRealization36mo: 1.0,
  },
  // Campaign speed improves once process + brand layers are built (week 16).
  // Requires significant team retraining on new workflows.
  campaignSpeed: {
    techReadyWeek: 16,
    changeManagementMonths: 4,
    costReductionLagMonths: 0,
    sCurveK: 0.45,
    sCurveMidpointOffset: 7,
    maxRealization18mo: 0.65,
    maxRealization36mo: 0.95,
  },
  // Content intelligence + audience layers complete around week 22.
  // Agency contracts are typically quarterly — reducing scope requires renegotiation.
  contentVelocity: {
    techReadyWeek: 22,
    changeManagementMonths: 3,
    costReductionLagMonths: 2,
    sCurveK: 0.5,
    sCurveMidpointOffset: 6,
    maxRealization18mo: 0.70,
    maxRealization36mo: 0.95,
  },
  // Cross-domain integration completes last (week 28).
  // Largest change management burden — retraining hundreds of people takes quarters.
  operationalEfficiency: {
    techReadyWeek: 28,
    changeManagementMonths: 6,
    costReductionLagMonths: 0,
    sCurveK: 0.35,
    sCurveMidpointOffset: 9,
    maxRealization18mo: 0.50,
    maxRealization36mo: 0.85,
  },
  // ROAS improvement depends on attribution + audience layers (week 22).
  // Revenue-type stream — value flows once adopted, no contract lag.
  roasImprovement: {
    techReadyWeek: 22,
    changeManagementMonths: 4,
    costReductionLagMonths: 0,
    sCurveK: 0.45,
    sCurveMidpointOffset: 7,
    maxRealization18mo: 0.70,
    maxRealization36mo: 0.95,
  },
  // Attribution depends on metrics layer (week 22).
  // Requires trust-building — teams resist changing measurement approaches.
  attributionImprovement: {
    techReadyWeek: 22,
    changeManagementMonths: 5,
    costReductionLagMonths: 0,
    sCurveK: 0.4,
    sCurveMidpointOffset: 8,
    maxRealization18mo: 0.55,
    maxRealization36mo: 0.90,
  },
  // Personalization depends on audience + context layers (week 22).
  // Requires trust-building and cross-team coordination.
  personalizationLift: {
    techReadyWeek: 22,
    changeManagementMonths: 5,
    costReductionLagMonths: 0,
    sCurveK: 0.5,
    sCurveMidpointOffset: 7,
    maxRealization18mo: 0.60,
    maxRealization36mo: 0.95,
  },
};

/**
 * Per-stream adoption ramp factor.
 * adoptionStart = techReadyMonth + changeManagement + costReductionLag
 * techReadyMonth scales with build timeline; change mgmt and cost lag are fixed.
 * Returns 0–ceiling based on logistic S-curve with organizational inertia caps.
 */
export function streamRampFactor(
  month: number,
  streamKey: ValueStreamKey,
  implementationWeeks: number,
): number {
  const params = STREAM_ADOPTION_PARAMS[streamKey];
  // Tech readiness scales proportionally with the build timeline
  const scaleFactor = implementationWeeks / 28;
  const techReadyMonth = (params.techReadyWeek * scaleFactor) / 4.33;
  // Change management and contract lag are people-time — fixed duration
  const adoptionStart = techReadyMonth + params.changeManagementMonths + params.costReductionLagMonths;

  const t = month - adoptionStart;
  if (t <= 0) return 0;

  // Normalized logistic S-curve starting from 0 at t=0
  const raw = 1 / (1 + Math.exp(-params.sCurveK * (t - params.sCurveMidpointOffset)));
  const atZero = 1 / (1 + Math.exp(-params.sCurveK * (0 - params.sCurveMidpointOffset)));
  const normalized = (raw - atZero) / (1 - atZero);

  // Apply realization ceiling — linear interpolation between 18mo and 36mo caps
  const ceiling = month <= 18
    ? params.maxRealization18mo
    : params.maxRealization18mo +
      (params.maxRealization36mo - params.maxRealization18mo) *
      Math.min(1, (month - 18) / 18);

  return Math.min(Math.max(0, normalized), ceiling);
}

// ─── Derived Metrics ─────────────────────────────────────────────────
// Computed once, reused by baseline + value streams.
function computeDerived(
  org: OrganizationProfile,
  martech: MartechAndMedia,
  ops: ContentAndCampaignOps,
): DerivedMetrics {
  const totalMarketingBudget = org.annualRevenue * (org.marketingBudgetPct / 100);
  const totalTeamCost = org.marketingHeadcount * org.avgLoadedFteCost;
  const annualMartechSpend = totalMarketingBudget * (martech.martechPctOfBudget / 100);
  const annualPaidMediaSpend = totalMarketingBudget * (martech.paidMediaPctOfBudget / 100);
  const annualAgencySpend = totalMarketingBudget * (ops.agencyPctOfBudget / 100);
  const currentAdRevenue = annualPaidMediaSpend * martech.currentBlendedRoas;
  const hourlyRate = org.avgLoadedFteCost / HOURS_PER_YEAR;

  // Content team is roughly 25% of marketing headcount
  const contentTeamCost = totalTeamCost * 0.25;

  // Daily marketing budget (used for campaign speed value calculation)
  const dailyMarketingBudget = totalMarketingBudget / 365;

  return {
    totalMarketingBudget,
    totalTeamCost,
    annualMartechSpend,
    annualPaidMediaSpend,
    annualAgencySpend,
    currentAdRevenue,
    contentTeamCost,
    hourlyRate,
    dailyMarketingBudget,
  };
}

// ─── Baseline Computation ────────────────────────────────────────────
// Current annual cost structure from user inputs.
export function computeBaseline(
  org: OrganizationProfile,
  martech: MartechAndMedia,
  ops: ContentAndCampaignOps,
  pain: OperationalPain,
): BaselineOutputs {
  const derived = computeDerived(org, martech, ops);

  const annualTeamCost = derived.totalTeamCost;

  // Martech waste: spend on tools that aren't being utilized
  const annualMartechWaste =
    derived.annualMartechSpend * (1 - martech.martechUtilizationPct / 100);

  // Media waste: portion of paid media wasted due to poor targeting/attribution
  const annualMediaWaste =
    derived.annualPaidMediaSpend * (pain.marketingWasteRatePct / 100);

  const annualAgencyCost = derived.annualAgencySpend;

  // Rework: % of team cost wasted redoing off-brand/incorrect work
  const annualReworkCost = annualTeamCost * (pain.reworkRatePct / 100);

  // Admin overhead: the opportunity cost of admin time (subset of team cost)
  const annualAdminOverheadCost = annualTeamCost * (pain.adminTimePct / 100);

  // Approval bottleneck: cost of waiting for approvals, capped at available person-hours
  const annualCampaignsCount = ops.monthlyCampaigns * 12;
  const blockedFTEs = Math.ceil(org.marketingHeadcount * 0.3); // ~30% of team blocked
  const availableBlockedHours = blockedFTEs * HOURS_PER_YEAR;
  const rawBottleneckHours = annualCampaignsCount * pain.approvalCycleDays * 8;
  const actualBlockedHours = Math.min(rawBottleneckHours, availableBlockedHours);
  const annualApprovalBottleneckCost = actualBlockedHours * derived.hourlyRate;

  // Attribution waste: cost of poor attribution decisions on media spend
  const annualAttributionWaste =
    derived.annualPaidMediaSpend * (pain.manualAttributionPct / 100) * 0.15;

  // Total: team + waste categories (admin is subset of team, not additive)
  const totalAnnualCost =
    annualTeamCost +
    annualMartechWaste +
    annualMediaWaste +
    annualAgencyCost +
    annualReworkCost +
    annualApprovalBottleneckCost +
    annualAttributionWaste;

  const waterfall: WaterfallSegment[] = [
    { label: 'Team Salaries', value: annualTeamCost, color: '#5B9ECF' },
    { label: 'Martech Waste', value: annualMartechWaste, color: '#E88D67' },
    { label: 'Media Waste', value: annualMediaWaste, color: '#D4856A' },
    { label: 'Agency Spend', value: annualAgencyCost, color: '#9B7ACC' },
    { label: 'Rework', value: annualReworkCost, color: '#ef4444' },
    { label: 'Approval Delays', value: annualApprovalBottleneckCost, color: '#f59e0b' },
    { label: 'Attribution Waste', value: annualAttributionWaste, color: '#C9A04E' },
  ].filter(s => s.value > 0);

  return {
    derived,
    annualTeamCost,
    annualMartechWaste,
    annualMediaWaste,
    annualAgencyCost,
    annualReworkCost,
    annualAdminOverheadCost,
    annualApprovalBottleneckCost,
    annualAttributionWaste,
    totalAnnualCost,
    waterfall,
  };
}

// ─── Value Stream Computations ───────────────────────────────────────
// The core of the enterprise model — 7 distinct value streams.
function computeValueStreams(
  baseline: BaselineOutputs,
  martech: MartechAndMedia,
  ops: ContentAndCampaignOps,
  pain: OperationalPain,
  assumptions: ImprovementAssumptions,
): ValueStreams {
  const d = baseline.derived;

  // 1. Martech Optimization — close utilization gap + consolidate overlapping tools
  const utilizationGainPct =
    (assumptions.martechUtilizationTargetPct - martech.martechUtilizationPct) / 100;
  // Not all unused spend is recoverable (license minimums, etc.)
  const recoverableValue = d.annualMartechSpend * Math.max(0, utilizationGainPct) * 0.5;
  const consolidationSavings =
    d.annualMartechSpend * (assumptions.martechToolConsolidationPct / 100) * 0.3;
  const martechOptimization = recoverableValue + consolidationSavings;

  // 2. ROAS Improvement — incremental *profit contribution*, not gross revenue
  const projectedRoas =
    martech.currentBlendedRoas * (1 + assumptions.roasLiftPct / 100);
  const roasImprovement =
    d.annualPaidMediaSpend * (projectedRoas - martech.currentBlendedRoas) *
    (CONTRIBUTION_MARGIN_PCT / 100);

  // 3. Content Velocity — time savings on content production
  const contentVelocity =
    d.contentTeamCost * (assumptions.contentTimeSavingsPct / 100);

  // 4. Campaign Throughput — labor efficiency from faster campaign cycles
  // Faster campaigns → days saved per campaign × active FTE fraction × hourly rate
  const currentCycleDays = ops.avgCampaignCycleWeeks * 7;
  const daysSaved = currentCycleDays * (assumptions.cycleTimeReductionPct / 100);
  const campaignsPerYear = ops.monthlyCampaigns * 12;
  const activeFteFraction = 0.30; // 30% of team actively working on campaign ops
  const hoursPerDay = 8;
  const rawCampaignSpeed =
    campaignsPerYear * daysSaved * activeFteFraction * hoursPerDay * d.hourlyRate;
  // Cap at 10% of total team cost
  const campaignSpeed = Math.min(rawCampaignSpeed, d.totalTeamCost * 0.10);

  // 5. Operational Efficiency — admin-to-strategic shift + rework reduction
  const adminShiftValue =
    baseline.annualAdminOverheadCost * (assumptions.adminToStrategicShiftPct / 100);
  const reworkReduction =
    baseline.annualReworkCost * (assumptions.reworkReductionPct / 100);
  const operationalEfficiency = adminShiftValue + reworkReduction;

  // 6. Attribution Improvement — reduce waste from better measurement
  // Discount by ROAS lift % to avoid double-counting with ROAS Improvement stream
  const attributionImprovement =
    d.annualPaidMediaSpend *
    (pain.manualAttributionPct / 100) *
    (assumptions.attributionImprovementPct / 100) *
    (1 - assumptions.roasLiftPct / 100);

  // 7. Personalization Lift — profit contribution from personalized experiences
  const personalizationLift =
    d.currentAdRevenue * (assumptions.personalizationRevLiftPct / 100) *
    (CONTRIBUTION_MARGIN_PCT / 100);

  // ── Double-count guardrail: cap labor-related savings at 40% of team cost ──
  // Content velocity, campaign throughput, and operational efficiency all draw from team cost;
  // a person can't have all their content time, campaign time, admin time, and rework time saved simultaneously.
  const maxLaborSavings = d.totalTeamCost * 0.40;
  const rawLaborSavings = contentVelocity + campaignSpeed + operationalEfficiency;
  let finalContentVelocity = contentVelocity;
  let finalCampaignSpeed = campaignSpeed;
  let finalOperationalEfficiency = operationalEfficiency;
  if (rawLaborSavings > maxLaborSavings && rawLaborSavings > 0) {
    const scaleFactor = maxLaborSavings / rawLaborSavings;
    finalContentVelocity = contentVelocity * scaleFactor;
    finalCampaignSpeed = campaignSpeed * scaleFactor;
    finalOperationalEfficiency = operationalEfficiency * scaleFactor;
  }

  return {
    martechOptimization,
    roasImprovement,
    contentVelocity: finalContentVelocity,
    campaignSpeed: finalCampaignSpeed,
    operationalEfficiency: finalOperationalEfficiency,
    attributionImprovement,
    personalizationLift,
  };
}

// ─── Investment Timeline ─────────────────────────────────────────────
function buildInvestmentCurve(
  totalInvestment: number,
  implementationWeeks: number,
): number[] {
  const buildMonths = Math.ceil(implementationWeeks / 4.33);
  const monthlyInvestment = totalInvestment / buildMonths;

  const curve: number[] = [];
  let cumulative = 0;
  for (let m = 0; m <= PROJECTION_MONTHS; m++) {
    if (m > 0 && m <= buildMonths) {
      cumulative += monthlyInvestment;
    }
    curve.push(Math.min(cumulative, totalInvestment));
  }
  return curve;
}

// ─── Phase Labels ────────────────────────────────────────────────────
function phaseForMonth(month: number, implWeeks: number): string {
  const buildMonths = Math.ceil(implWeeks / 4.33);
  const phaseLength = buildMonths / 5; // 5 build phases

  if (month <= phaseLength) return 'Discovery';
  if (month <= phaseLength * 2) return 'Ontology';
  if (month <= phaseLength * 3) return 'KG Population';
  if (month <= phaseLength * 4) return 'Digital Twin';
  if (month <= buildMonths) return 'Validation';
  if (month <= buildMonths + 5) return 'Supervised Launch';
  if (month <= buildMonths + 10) return 'Graduated Autonomy';
  return 'Operational Maturity';
}

// ─── IRR Calculation (Newton-Raphson) ────────────────────────────────
// Computes Internal Rate of Return from monthly cash flows.
// Returns annualized rate. Falls back to NaN if no convergence.
export function calculateIRR(cashFlows: number[], maxIterations = 100, tolerance = 1e-7): number {
  let rate = 0.1; // initial guess: 10%
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      const factor = Math.pow(1 + rate, t);
      npv += cashFlows[t] / factor;
      if (t > 0) dnpv -= (t * cashFlows[t]) / Math.pow(1 + rate, t + 1);
    }
    if (Math.abs(dnpv) < 1e-12) return NaN;
    const newRate = rate - npv / dnpv;
    if (Math.abs(newRate - rate) < tolerance) {
      // Convert monthly rate to annualized
      return Math.pow(1 + newRate, 12) - 1;
    }
    rate = newRate;
  }
  return NaN;
}

// ─── Enterprise Top-Down Model ──────────────────────────────────────
export function calculateEnterpriseROI(
  baseline: BaselineOutputs,
  assumptions: ImprovementAssumptions,
  org: OrganizationProfile,
): EnterpriseModelOutputs {
  const totalBudget = baseline.derived.totalMarketingBudget;
  const teamCost = baseline.derived.totalTeamCost;

  // Budget waste: martech + media + attribution waste combined
  const budgetWasteTotal =
    baseline.annualMartechWaste + baseline.annualMediaWaste + baseline.annualAttributionWaste;

  // AI can recover a portion of identified waste
  const aiRecoveryPotential = budgetWasteTotal * (AI_IMPACT_BENCHMARKS.wasteRecovery / 100);

  // Content savings: content team + agency content share × AI reduction
  const agencyContentShare = baseline.derived.annualAgencySpend * 0.4; // ~40% of agency is content
  const contentSavings =
    (baseline.derived.contentTeamCost + agencyContentShare) *
    (AI_IMPACT_BENCHMARKS.contentCostReduction / 100);

  // Headcount savings: automation of operational roles
  const headcountSavings = teamCost * (AI_IMPACT_BENCHMARKS.headcountSavings / 100);

  // MER improvement: same revenue, reduced total spend
  const currentMer = org.annualRevenue / totalBudget;
  const reducedBudget = totalBudget - aiRecoveryPotential - contentSavings * 0.5;
  const merImprovement = reducedBudget > 0 ? org.annualRevenue / reducedBudget : currentMer;

  const totalEnterpriseValue = aiRecoveryPotential + contentSavings + headcountSavings;

  return {
    budgetWasteTotal,
    aiRecoveryPotential,
    contentSavings,
    headcountSavings,
    merImprovement,
    totalEnterpriseValue,
  };
}

// ─── "Do Nothing" Cost of Inaction ──────────────────────────────────
export function computeDoNothingCost(
  annualRevenue: number,
  marketingBudgetPct: number,
): DoNothingOutputs {
  // Apply erosion to marketing-attributable revenue (budget), not total company revenue
  const marketingBudget = annualRevenue * (marketingBudgetPct / 100);
  const quarterlyErosionRate = DO_NOTHING_EROSION.quarterlyPct / 100;

  // 8-quarter cumulative losses (compound erosion on marketing budget)
  const quarterlyLosses: number[] = [];
  let cumulative = 0;
  for (let q = 1; q <= 8; q++) {
    cumulative += marketingBudget * quarterlyErosionRate * q;
    quarterlyLosses.push(cumulative);
  }

  // Yearly losses derived from the quarterly compound model for consistency
  // Year 1 = sum of Q1-Q4 quarterly erosion, Year 2 = sum of Q1-Q8, etc.
  const year1Loss = quarterlyLosses[3]; // end of Q4
  const year2Loss = quarterlyLosses[7]; // end of Q8
  // Year 3: extrapolate compound model for Q9-Q12
  let year3Cumulative = cumulative;
  for (let q = 9; q <= 12; q++) {
    year3Cumulative += marketingBudget * quarterlyErosionRate * q;
  }
  const year3Loss = year3Cumulative;

  return {
    quarterlyLosses,
    year1Loss,
    year2Loss,
    year3Loss,
    year1ErosionPct: DO_NOTHING_EROSION.year1Pct,
    year2ErosionPct: DO_NOTHING_EROSION.year2Pct,
    year3ErosionPct: DO_NOTHING_EROSION.year3Pct,
  };
}

// ─── Channel ROAS Computation ───────────────────────────────────────
export function computeChannelRoas(roasLiftPct: number): ChannelRoasEntry[] {
  return Object.entries(CHANNEL_ROAS_BENCHMARKS).map(([channel, bench]) => {
    const aiOptimizedRoas = bench.current * (1 + roasLiftPct / 100);
    return {
      channel,
      currentRoas: bench.current,
      aiOptimizedRoas: Math.round(aiOptimizedRoas * 10) / 10,
      liftPct: Math.round(((aiOptimizedRoas - bench.current) / bench.current) * 100),
    };
  });
}

// ─── Sensitivity Analysis ────────────────────────────────────
// Varies two key assumptions by ±25% and returns a 3x3 matrix of payback months.
export interface SensitivityMatrix {
  rowLabel: string;       // "Content Time Savings"
  colLabel: string;       // "ROAS Lift"
  rowValues: string[];    // labels for -25%, base, +25%
  colValues: string[];    // labels for -25%, base, +25%
  paybacks: number[][];   // [row][col] payback months
}

export function computeSensitivity(
  org: OrganizationProfile,
  martech: MartechAndMedia,
  ops: ContentAndCampaignOps,
  pain: OperationalPain,
  investment: TransformationInvestment,
  baseAssumptions: ImprovementAssumptions,
): SensitivityMatrix {
  const offsets = [-0.25, 0, 0.25];
  const baseContent = baseAssumptions.contentTimeSavingsPct;
  const baseRoas = baseAssumptions.roasLiftPct;

  const rowValues = offsets.map(o => {
    const v = Math.round(baseContent * (1 + o));
    return o === 0 ? `${v}%` : `${v}%`;
  });
  const colValues = offsets.map(o => {
    const v = Math.round(baseRoas * (1 + o));
    return o === 0 ? `${v}%` : `${v}%`;
  });

  const paybacks = offsets.map(contentOff => {
    return offsets.map(roasOff => {
      const modified: ImprovementAssumptions = {
        ...baseAssumptions,
        contentTimeSavingsPct: baseContent * (1 + contentOff),
        roasLiftPct: baseRoas * (1 + roasOff),
      };
      const result = computeRoi(org, martech, ops, pain, investment, modified);
      return result.paybackMonths;
    });
  });

  return {
    rowLabel: 'Content Time Savings',
    colLabel: 'ROAS Lift',
    rowValues,
    colValues,
    paybacks,
  };
}

// ─── Main ROI Computation ────────────────────────────────────────────
export function computeRoi(
  org: OrganizationProfile,
  martech: MartechAndMedia,
  ops: ContentAndCampaignOps,
  pain: OperationalPain,
  investment: TransformationInvestment,
  assumptions: ImprovementAssumptions,
): RoiOutputs {
  const baseline = computeBaseline(org, martech, ops, pain);
  const vs = computeValueStreams(baseline, martech, ops, pain, assumptions);

  const totalInvestment = investment.totalInvestmentAmount;
  const totalAnnualValue =
    vs.martechOptimization +
    vs.roasImprovement +
    vs.contentVelocity +
    vs.campaignSpeed +
    vs.operationalEfficiency +
    vs.attributionImprovement +
    vs.personalizationLift;

  // ── Ongoing operational costs (LLM tokens, infra, maintenance) ──
  const annualOpEx = totalInvestment * (ONGOING_OPEX_PCT / 100);
  const monthlyOpEx = annualOpEx / 12;
  const buildMonthsForOpEx = Math.ceil(investment.implementationWeeks / 4.33);

  // ── Timeline (36 months) ──
  const investmentCurve = buildInvestmentCurve(totalInvestment, investment.implementationWeeks);
  const timeline: TimelinePoint[] = [];

  let cumulativeConservative = 0;
  let cumulativeExpected = 0;
  let cumulativeAggressive = 0;
  let cumulativeOpEx = 0;

  const implWeeks = investment.implementationWeeks;

  for (let m = 0; m <= PROJECTION_MONTHS; m++) {
    // Per-stream ramp: each value stream has its own adoption curve
    const monthlyBaseValue =
      (vs.martechOptimization / 12) * streamRampFactor(m, 'martechOptimization', implWeeks) +
      (vs.roasImprovement / 12) * streamRampFactor(m, 'roasImprovement', implWeeks) +
      (vs.contentVelocity / 12) * streamRampFactor(m, 'contentVelocity', implWeeks) +
      (vs.campaignSpeed / 12) * streamRampFactor(m, 'campaignSpeed', implWeeks) +
      (vs.operationalEfficiency / 12) * streamRampFactor(m, 'operationalEfficiency', implWeeks) +
      (vs.attributionImprovement / 12) * streamRampFactor(m, 'attributionImprovement', implWeeks) +
      (vs.personalizationLift / 12) * streamRampFactor(m, 'personalizationLift', implWeeks);

    // OpEx starts after the build phase completes
    if (m > buildMonthsForOpEx) {
      cumulativeOpEx += monthlyOpEx;
    }

    cumulativeConservative += monthlyBaseValue * SCENARIO_MULTIPLIERS.conservative;
    cumulativeExpected += monthlyBaseValue * SCENARIO_MULTIPLIERS.expected;
    cumulativeAggressive += monthlyBaseValue * SCENARIO_MULTIPLIERS.aggressive;

    timeline.push({
      month: m,
      investmentCumulative: (investmentCurve[m] ?? totalInvestment) + cumulativeOpEx,
      valueConservative: cumulativeConservative,
      valueExpected: cumulativeExpected,
      valueAggressive: cumulativeAggressive,
      phase: phaseForMonth(m, investment.implementationWeeks),
    });
  }

  // ── Breakeven month (cumulative value must exceed cumulative investment + cumulative OpEx) ──
  let breakEvenMonth = PROJECTION_MONTHS;
  for (let m = 1; m <= PROJECTION_MONTHS; m++) {
    if (timeline[m].valueExpected >= timeline[m].investmentCumulative) {
      breakEvenMonth = m;
      break;
    }
  }

  // ── 3-Year Summary ──
  const totalValue3yr = cumulativeExpected;
  const totalCost3yr = totalInvestment + cumulativeOpEx;
  const threeYearRoi = ((totalValue3yr - totalCost3yr) / totalCost3yr) * 100;
  const paybackMonths = breakEvenMonth;

  // NPV: discount future net cash flows (value minus OpEx) at 10% annual
  let npv = -totalInvestment;
  for (let m = 1; m <= PROJECTION_MONTHS; m++) {
    const monthlyValue =
      m > 0 ? timeline[m].valueExpected - timeline[m - 1].valueExpected : 0;
    const opExThisMonth = m > buildMonthsForOpEx ? monthlyOpEx : 0;
    const discountFactor = 1 / Math.pow(1 + DISCOUNT_RATE / 12, m);
    npv += (monthlyValue - opExThisMonth) * discountFactor;
  }

  // ── ROAS Comparison ──
  const projectedRoas =
    martech.currentBlendedRoas * (1 + assumptions.roasLiftPct / 100);
  const roas: RoasComparison = {
    currentRoas: martech.currentBlendedRoas,
    projectedRoas,
    currentAdRevenue: baseline.derived.currentAdRevenue,
    projectedAdRevenue: baseline.derived.annualPaidMediaSpend * projectedRoas,
    incrementalRevenue: vs.roasImprovement,
  };

  // ── Workflow Comparisons (6 enterprise workflows) ──
  const cycleDays = ops.avgCampaignCycleWeeks * 7;
  const workflows: WorkflowComparison[] = [
    {
      name: 'Campaign Launch',
      icon: '🚀',
      beforeDays: cycleDays,
      afterValue: Math.max(3, Math.round(cycleDays * 0.4)),
      afterUnit: 'days',
      savingsPct: 60,
    },
    {
      name: 'Content Production',
      icon: '📝',
      beforeDays: 14,
      afterValue: Math.max(4, Math.round(14 * 24 * 0.35 / 24)),
      afterUnit: 'days',
      savingsPct: 65,
    },
    {
      name: 'Budget Reallocation',
      icon: '💰',
      beforeDays: pain.approvalCycleDays + 3,
      afterValue: 2,
      afterUnit: 'hours',
      savingsPct: 90,
    },
    {
      name: 'Compliance Review',
      icon: '🛡️',
      beforeDays: pain.approvalCycleDays,
      afterValue: Math.max(2, Math.round(pain.approvalCycleDays * 24 * 0.25)),
      afterUnit: 'hours',
      savingsPct: 75,
    },
    {
      name: 'Personalization Deploy',
      icon: '🎯',
      beforeDays: 21,
      afterValue: 3,
      afterUnit: 'days',
      savingsPct: 86,
    },
    {
      name: 'Attribution Report',
      icon: '📊',
      beforeDays: 5,
      afterValue: 30,
      afterUnit: 'minutes',
      savingsPct: 96,
    },
  ];

  // ── Allocation Shift ──
  const approvalPct = Math.round((100 - pain.adminTimePct) * 0.5);
  const strategicPct = Math.round((100 - pain.adminTimePct) * 0.3);
  const innovationPct = 100 - pain.adminTimePct - approvalPct - strategicPct;

  const currentAllocation: AllocationSlice[] = [
    { label: 'Admin/Manual', pct: pain.adminTimePct, color: '#ef4444' },
    { label: 'Approval-Gated', pct: approvalPct, color: '#f59e0b' },
    { label: 'Strategic Work', pct: strategicPct, color: '#5B9ECF' },
    { label: 'Innovation', pct: Math.max(0, innovationPct), color: '#4CAF50' },
  ];

  const futureAdminPct = Math.max(10, Math.round(pain.adminTimePct * 0.35));
  const futureApprovalPct = Math.round(approvalPct * 0.5);
  const futureStrategicPct = 40;
  const futureInnovationPct = 100 - futureAdminPct - futureApprovalPct - futureStrategicPct;

  const futureAllocation: AllocationSlice[] = [
    { label: 'Admin/Manual', pct: futureAdminPct, color: '#ef4444' },
    { label: 'Approval-Gated', pct: futureApprovalPct, color: '#f59e0b' },
    { label: 'Strategic Work', pct: futureStrategicPct, color: '#5B9ECF' },
    { label: 'Innovation', pct: Math.max(0, futureInnovationPct), color: '#4CAF50' },
  ];

  // ── IRR from monthly cash flows (includes OpEx) ──
  const buildMonths = Math.ceil(investment.implementationWeeks / 4.33);
  const monthlyInvestment = totalInvestment / buildMonths;
  const monthlyCashFlows: number[] = [];
  for (let m = 0; m <= PROJECTION_MONTHS; m++) {
    let cf = 0;
    if (m > 0 && m <= buildMonths) cf -= monthlyInvestment;
    if (m > 0) {
      cf += timeline[m].valueExpected - timeline[m - 1].valueExpected;
    }
    // Subtract ongoing OpEx after build phase
    if (m > buildMonthsForOpEx) cf -= monthlyOpEx;
    monthlyCashFlows.push(cf);
  }
  const irr = calculateIRR(monthlyCashFlows);

  // ── Enterprise model ──
  const enterpriseModel = calculateEnterpriseROI(baseline, assumptions, org);

  // ── Do-nothing cost ──
  const doNothing = computeDoNothingCost(org.annualRevenue, org.marketingBudgetPct);

  // ── Channel ROAS ──
  const channelRoas = computeChannelRoas(assumptions.roasLiftPct);

  return {
    totalInvestment,
    implementationWeeks: investment.implementationWeeks,
    annualOpEx,
    valueStreams: vs,
    totalAnnualValue,
    threeYearRoi,
    paybackMonths,
    netPresentValue: npv,
    irr,
    timeline,
    breakEvenMonth,
    workflows,
    roas,
    channelRoas,
    currentAllocation,
    futureAllocation,
    enterpriseModel,
    doNothing,
  };
}
