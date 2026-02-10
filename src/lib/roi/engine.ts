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

export const BUDGET_ALLOCATION = {
  paidMedia: 30.6,
  martech: 22.4,
  labor: 21.9,
  agencies: 20.7,
  other: 4.4,
} as const;

export const MARTECH_WASTE_BENCHMARKS = {
  avgUtilization: 33,       // Gartner: 33% of capability used
  wasteRangeLow: 26,        // % of budget wasted (low estimate)
  wasteRangeHigh: 47,       // % of budget wasted (high estimate)
  toolOverlapPct: 30,       // average redundancy across stack
} as const;

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

export const EFFICIENCY_METRICS = {
  merTarget: 5.0,             // marketing efficiency ratio target
  cacByIndustry: {
    'B2B Average': 536,
    'B2C Average': 148,
    'Technology': 395,
    'Financial Services': 644,
    'Healthcare / Pharma': 580,
    'Consumer Packaged Goods': 98,
    'Retail': 120,
  } as Record<string, number>,
  ltvCacRatioTarget: 3.0,     // healthy LTV:CAC
  pipelineContributionPct: 40, // marketing-sourced pipeline %
} as const;

export const OPERATING_COSTS = {
  fteRanges: {
    'Content Strategist': { low: 85_000, high: 140_000 },
    'Marketing Ops': { low: 95_000, high: 160_000 },
    'Paid Media Manager': { low: 90_000, high: 150_000 },
    'Data Analyst': { low: 100_000, high: 170_000 },
    'Creative Director': { low: 130_000, high: 220_000 },
    'Campaign Manager': { low: 80_000, high: 130_000 },
  } as Record<string, { low: number; high: number }>,
  headcountPer100M: 10,        // ~10 FTEs per $100M budget
  contentTeamPct: 25,          // % of marketing headcount
  opsTeamPct: 20,              // % of marketing headcount
} as const;

export const COMPLIANCE_COSTS = {
  financialServicesReviewCostPerAsset: 2_500,
  pharmaReviewCostPerAsset: 3_500,
  avgReviewDelayDays: 14,
  aiReviewReductionPct: 60,
} as const;

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
  blendedRoas: { source: 'Google/Nielsen Cross-Channel Study', confidence: 'medium' },
  adminTimePct: { source: 'Salesforce State of Marketing 2025', confidence: 'high', sampleSize: '4,800+ marketers' },
  contentTimeSavings: { source: 'HubSpot State of Marketing 2025', confidence: 'high', sampleSize: '1,400+ marketers' },
  personalizationLift: { source: 'McKinsey Personalization Analysis 2023', confidence: 'high' },
  roasLift: { source: 'Meta Advantage+ / Google PMax results 2024', confidence: 'medium' },
  reworkRate: { source: 'Lucidpress Brand Consistency Report', confidence: 'medium' },
  marketingWaste: { source: 'Rakuten/ANA Programmatic Study', confidence: 'medium', sampleSize: '1,000+ advertisers' },
  doNothingErosion: { source: 'PwC/ANA Digital Maturity Study', confidence: 'medium' },
};

// ─── Input Types ─────────────────────────────────────────────────────

/** Revenue-anchored org profile. Everything cascades from annualRevenue. */
export interface OrganizationProfile {
  annualRevenue: number;              // $500M – $50B+
  marketingBudgetPct: number;         // % of revenue (Gartner 2025: 7.7%)
  marketingHeadcount: number;         // 50–2000+
  avgLoadedFteCost: number;           // $100K–$400K fully loaded
  industry?: string;                  // Industry vertical for benchmark defaults
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
  monthlyCampaigns: number;           // 10–500
  monthlyContentAssets: number;       // 50–2000
  avgCampaignCycleWeeks: number;      // 2–12
  channelCount: number;               // 3–20
  agencyPctOfBudget: number;          // 5–30%
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
  totalInvestmentAmount: number;      // $500K – $25M, default ~$3M
  implementationWeeks: number;        // 12–52, default 28
}

/** Hidden improvement assumptions — research-backed, not UI-exposed. */
export interface ImprovementAssumptions {
  roasLiftPct: number;               // Meta AI: 22%, Google AI: 17% → default 20%
  contentTimeSavingsPct: number;      // Documented 75-80% → conservative 65%
  personalizationRevLiftPct: number;  // McKinsey 10-15% → default 12%
  cycleTimeReductionPct: number;      // Enterprise documented: 40%
  reworkReductionPct: number;         // 70% at full maturity
  adminToStrategicShiftPct: number;   // 60% admin → 30% = 50% shift
  attributionImprovementPct: number;  // Conservative: 15%
  martechUtilizationTargetPct: number;// From 33% → 60%
  martechToolConsolidationPct: number;// 30% overlap rate
}

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
  dailyCampaignRevenue: number;
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
// S-curve value realization — scale-independent.
export function rampFactor(month: number): number {
  if (month <= 0) return 0;
  if (month <= 7) return (month / 7) * 0.3;
  if (month <= 12) return 0.3 + ((month - 7) / 5) * 0.4;
  if (month <= 18) return 0.7 + ((month - 12) / 6) * 0.2;
  if (month <= 36) return 0.9 + ((month - 18) / 18) * 0.1;
  return 1.0;
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

  // Marketing contribution to revenue: use budget-to-revenue ratio as proxy
  const marketingContribPct = org.marketingBudgetPct / 100;
  const dailyCampaignRevenue = (org.annualRevenue * marketingContribPct) / 365;

  return {
    totalMarketingBudget,
    totalTeamCost,
    annualMartechSpend,
    annualPaidMediaSpend,
    annualAgencySpend,
    currentAdRevenue,
    contentTeamCost,
    hourlyRate,
    dailyCampaignRevenue,
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

  // Approval bottleneck: cost of waiting for approvals per campaign
  const annualCampaignsCount = ops.monthlyCampaigns * 12;
  const teamBlockedPct = 0.3; // ~30% of team blocked during approvals
  const annualApprovalBottleneckCost =
    annualCampaignsCount *
    pain.approvalCycleDays * 8 *
    derived.hourlyRate *
    Math.ceil(org.marketingHeadcount * teamBlockedPct);

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

  // 2. ROAS Improvement — the enterprise "wow" metric
  const projectedRoas =
    martech.currentBlendedRoas * (1 + assumptions.roasLiftPct / 100);
  const roasImprovement =
    d.annualPaidMediaSpend * (projectedRoas - martech.currentBlendedRoas);

  // 3. Content Velocity — time savings on content production
  const contentVelocity =
    d.contentTeamCost * (assumptions.contentTimeSavingsPct / 100);

  // 4. Campaign Speed — faster campaigns = more revenue days captured
  const currentCycleDays = ops.avgCampaignCycleWeeks * 7;
  const daysSaved = currentCycleDays * (assumptions.cycleTimeReductionPct / 100);
  const campaignsPerYear = ops.monthlyCampaigns * 12;
  // Each campaign captures a small fraction of daily company marketing-attributed revenue
  const campaignSpeed = campaignsPerYear * daysSaved * d.dailyCampaignRevenue * 0.01;

  // 5. Operational Efficiency — admin-to-strategic shift + rework reduction
  const adminShiftValue =
    baseline.annualAdminOverheadCost * (assumptions.adminToStrategicShiftPct / 100);
  const reworkReduction =
    baseline.annualReworkCost * (assumptions.reworkReductionPct / 100);
  const operationalEfficiency = adminShiftValue + reworkReduction;

  // 6. Attribution Improvement — reduce waste from better measurement
  const attributionImprovement =
    d.annualPaidMediaSpend *
    (pain.manualAttributionPct / 100) *
    (assumptions.attributionImprovementPct / 100);

  // 7. Personalization Lift — revenue uplift from personalized experiences
  const personalizationLift =
    d.currentAdRevenue * (assumptions.personalizationRevLiftPct / 100);

  return {
    martechOptimization,
    roasImprovement,
    contentVelocity,
    campaignSpeed,
    operationalEfficiency,
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
  const marketingBudget = annualRevenue * (marketingBudgetPct / 100);
  const quarterlyErosionRate = DO_NOTHING_EROSION.quarterlyPct / 100;

  // 8-quarter cumulative losses (compound erosion)
  const quarterlyLosses: number[] = [];
  let cumulative = 0;
  for (let q = 1; q <= 8; q++) {
    cumulative += marketingBudget * quarterlyErosionRate * q;
    quarterlyLosses.push(cumulative);
  }

  const year1Loss = annualRevenue * (DO_NOTHING_EROSION.year1Pct / 100);
  const year2Loss = annualRevenue * (DO_NOTHING_EROSION.year2Pct / 100);
  const year3Loss = annualRevenue * (DO_NOTHING_EROSION.year3Pct / 100);

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

  // ── Timeline (36 months) ──
  const investmentCurve = buildInvestmentCurve(totalInvestment, investment.implementationWeeks);
  const timeline: TimelinePoint[] = [];

  let cumulativeConservative = 0;
  let cumulativeExpected = 0;
  let cumulativeAggressive = 0;

  for (let m = 0; m <= PROJECTION_MONTHS; m++) {
    const ramp = rampFactor(m);

    // Knowledge compound premium in years 2-3
    let yearMultiplier = 1.0;
    if (m > 12 && m <= 24) yearMultiplier = 1.05;
    if (m > 24) yearMultiplier = 1.10;

    const monthlyBaseValue = (totalAnnualValue / 12) * ramp * yearMultiplier;

    cumulativeConservative += monthlyBaseValue * SCENARIO_MULTIPLIERS.conservative;
    cumulativeExpected += monthlyBaseValue * SCENARIO_MULTIPLIERS.expected;
    cumulativeAggressive += monthlyBaseValue * SCENARIO_MULTIPLIERS.aggressive;

    timeline.push({
      month: m,
      investmentCumulative: investmentCurve[m] ?? totalInvestment,
      valueConservative: cumulativeConservative,
      valueExpected: cumulativeExpected,
      valueAggressive: cumulativeAggressive,
      phase: phaseForMonth(m, investment.implementationWeeks),
    });
  }

  // ── Breakeven month ──
  let breakEvenMonth = PROJECTION_MONTHS;
  for (let m = 1; m <= PROJECTION_MONTHS; m++) {
    if (timeline[m].valueExpected >= timeline[m].investmentCumulative) {
      breakEvenMonth = m;
      break;
    }
  }

  // ── 3-Year Summary ──
  const totalValue3yr = cumulativeExpected;
  const threeYearRoi = ((totalValue3yr - totalInvestment) / totalInvestment) * 100;
  const paybackMonths = breakEvenMonth;

  // NPV: discount future value streams at 10% annual
  let npv = -totalInvestment;
  for (let m = 1; m <= PROJECTION_MONTHS; m++) {
    const monthlyValue =
      m > 0 ? timeline[m].valueExpected - timeline[m - 1].valueExpected : 0;
    const discountFactor = 1 / Math.pow(1 + DISCOUNT_RATE / 12, m);
    npv += monthlyValue * discountFactor;
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

  // ── IRR from monthly cash flows ──
  const buildMonths = Math.ceil(investment.implementationWeeks / 4.33);
  const monthlyInvestment = totalInvestment / buildMonths;
  const monthlyCashFlows: number[] = [];
  for (let m = 0; m <= PROJECTION_MONTHS; m++) {
    let cf = 0;
    if (m > 0 && m <= buildMonths) cf -= monthlyInvestment;
    if (m > 0) {
      cf += timeline[m].valueExpected - timeline[m - 1].valueExpected;
    }
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
