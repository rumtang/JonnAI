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

// ─── Input Types ─────────────────────────────────────────────────────

/** Revenue-anchored org profile. Everything cascades from annualRevenue. */
export interface OrganizationProfile {
  annualRevenue: number;              // $500M – $50B+
  marketingBudgetPct: number;         // % of revenue (Gartner 2025: 7.7%)
  marketingHeadcount: number;         // 50–2000+
  avgLoadedFteCost: number;           // $100K–$400K fully loaded
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

export interface RoiOutputs {
  totalInvestment: number;
  implementationWeeks: number;

  valueStreams: ValueStreams;
  totalAnnualValue: number;

  threeYearRoi: number;
  paybackMonths: number;
  netPresentValue: number;

  timeline: TimelinePoint[];
  breakEvenMonth: number;

  workflows: WorkflowComparison[];
  roas: RoasComparison;

  currentAllocation: AllocationSlice[];
  futureAllocation: AllocationSlice[];
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

  return {
    totalInvestment,
    implementationWeeks: investment.implementationWeeks,
    valueStreams: vs,
    totalAnnualValue,
    threeYearRoi,
    paybackMonths,
    netPresentValue: npv,
    timeline,
    breakEvenMonth,
    workflows,
    roas,
    currentAllocation,
    futureAllocation,
  };
}
