// ─── ROI Economic Calculation Engine ─────────────────────────────────
// Pure functions — no side effects, fully testable.
// All monetary values in USD. All time values in months unless noted.

// ─── Constants ───────────────────────────────────────────────────────
export const CONSULTING_RATE = 275;       // $/hr blended rate
export const BUILD_WEEKS = 28;            // total engagement
export const FTE_YEARS = 5.2;             // total consultant effort
export const HOURS_PER_YEAR = 2080;       // 40hr × 52wk
export const DISCOUNT_RATE = 0.10;        // 10% annual for NPV
export const PROJECTION_MONTHS = 36;      // 3-year model

export const SCENARIO_MULTIPLIERS = {
  conservative: 0.6,
  expected: 1.0,
  aggressive: 1.4,
} as const;

export type Scenario = keyof typeof SCENARIO_MULTIPLIERS;

// ─── Input Types ─────────────────────────────────────────────────────
export interface TeamProfile {
  headcount: number;
  avgSalary: number;
  managerCount: number;
  specialistCount: number;
  coordinatorCount: number;
}

export interface CampaignVolume {
  monthlyCampaigns: number;
  avgCycleTimeDays: number;
  channelCount: number;
}

export interface CurrentPain {
  reworkRatePct: number;
  approvalBottleneckDays: number;
  complianceReviewHours: number;
}

export interface HiddenCosts {
  monthlyAgencySpend: number;
  toolOverlapCount: number;
  missedDeadlineCostPerMonth: number;
}

export interface TimeAllocation {
  humanOnlyPct: number;
  approvalGatedPct: number;
  supervisedPct: number;
  autonomousPct: number;
}

// ─── Output Types ────────────────────────────────────────────────────
export interface WaterfallSegment {
  label: string;
  value: number;
  color: string;
}

export interface BaselineOutputs {
  annualTeamCost: number;
  annualReworkCost: number;
  annualBottleneckCost: number;
  annualComplianceCost: number;
  annualAgencyCost: number;
  annualToolOverlapCost: number;
  annualMissedDeadlineCost: number;
  totalAnnualCost: number;
  waterfall: WaterfallSegment[];
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
  afterUnit: 'days' | 'hours';
  savingsPct: number;
}

export interface AllocationSlice {
  label: string;
  pct: number;
  color: string;
}

export interface RoiOutputs {
  // Investment
  totalInvestment: number;

  // Annual value streams (at full ramp)
  timeSavingsAnnual: number;
  reworkReductionAnnual: number;
  cycleTimeImprovementAnnual: number;
  knowledgePremiumAnnual: number;
  totalAnnualValue: number;

  // Summary metrics
  threeYearRoi: number;
  paybackMonths: number;
  netPresentValue: number;

  // Timeline data
  timeline: TimelinePoint[];
  breakEvenMonth: number;

  // Workflow comparisons
  workflows: WorkflowComparison[];

  // Allocation shift
  currentAllocation: AllocationSlice[];
  futureAllocation: AllocationSlice[];
}

// ─── Ramp Function ───────────────────────────────────────────────────
// Value doesn't appear instantly — it follows an S-curve as the org
// builds the KG, trains, and learns to trust agents.
export function rampFactor(month: number): number {
  if (month <= 0) return 0;
  if (month <= 7) return (month / 7) * 0.3;              // Build phase: 0-30%
  if (month <= 12) return 0.3 + ((month - 7) / 5) * 0.4; // Supervised: 30-70%
  if (month <= 18) return 0.7 + ((month - 12) / 6) * 0.2; // Graduated: 70-90%
  if (month <= 36) return 0.9 + ((month - 18) / 18) * 0.1; // Maturity: 90-100%
  return 1.0;
}

// ─── Baseline Computation ────────────────────────────────────────────
// Calculates current annual cost structure from user inputs.
export function computeBaseline(
  team: TeamProfile,
  volume: CampaignVolume,
  pain: CurrentPain,
  hidden: HiddenCosts,
): BaselineOutputs {
  const annualTeamCost = team.headcount * team.avgSalary;

  // Rework = % of team cost wasted redoing work
  const annualReworkCost = annualTeamCost * (pain.reworkRatePct / 100);

  // Bottleneck = cost of idle time while waiting for approvals
  // Each campaign loses X days × hourly rate × team members blocked
  const hourlyRate = team.avgSalary / HOURS_PER_YEAR;
  const annualBottleneckCost =
    volume.monthlyCampaigns * 12 *
    pain.approvalBottleneckDays * 8 *    // 8 hrs/day blocked
    hourlyRate * Math.ceil(team.headcount * 0.3); // ~30% of team blocked

  // Compliance review = direct time cost
  const annualComplianceCost =
    volume.monthlyCampaigns * 12 *
    pain.complianceReviewHours *
    hourlyRate * 2; // 2 people typically involved

  const annualAgencyCost = hidden.monthlyAgencySpend * 12;

  // Tool overlap: estimated $2K/month per overlapping tool
  const annualToolOverlapCost = hidden.toolOverlapCount * 24000;

  const annualMissedDeadlineCost = hidden.missedDeadlineCostPerMonth * 12;

  const totalAnnualCost =
    annualTeamCost +
    annualReworkCost +
    annualBottleneckCost +
    annualComplianceCost +
    annualAgencyCost +
    annualToolOverlapCost +
    annualMissedDeadlineCost;

  const waterfall: WaterfallSegment[] = [
    { label: 'Team Salaries', value: annualTeamCost, color: '#5B9ECF' },
    { label: 'Rework', value: annualReworkCost, color: '#D4856A' },
    { label: 'Approval Bottleneck', value: annualBottleneckCost, color: '#E88D67' },
    { label: 'Compliance Review', value: annualComplianceCost, color: '#C9A04E' },
    { label: 'Agency Spend', value: annualAgencyCost, color: '#9B7ACC' },
    { label: 'Tool Overlap', value: annualToolOverlapCost, color: '#4CAF50' },
    { label: 'Missed Deadlines', value: annualMissedDeadlineCost, color: '#D4856A' },
  ];

  return {
    annualTeamCost,
    annualReworkCost,
    annualBottleneckCost,
    annualComplianceCost,
    annualAgencyCost,
    annualToolOverlapCost,
    annualMissedDeadlineCost,
    totalAnnualCost,
    waterfall: waterfall.filter(s => s.value > 0),
  };
}

// ─── Investment Timeline ─────────────────────────────────────────────
// Monthly investment accumulation during the 28-week build.
function buildInvestmentCurve(): number[] {
  const totalInvestment = FTE_YEARS * HOURS_PER_YEAR * CONSULTING_RATE;
  const buildMonths = Math.ceil(BUILD_WEEKS / 4.33); // ~6.5 months
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
function phaseForMonth(month: number): string {
  if (month <= 1) return 'Discovery';
  if (month <= 2) return 'Ontology';
  if (month <= 3) return 'KG Population';
  if (month <= 4) return 'Digital Twin';
  if (month <= 5) return 'Tier 1 Validation';
  if (month <= 6) return 'Domain Expansion';
  if (month <= 7) return 'Full Validation';
  if (month <= 10) return 'Supervised Launch';
  if (month <= 15) return 'Graduated Autonomy';
  return 'Operational Maturity';
}

// ─── Main ROI Computation ────────────────────────────────────────────
export function computeRoi(
  team: TeamProfile,
  volume: CampaignVolume,
  pain: CurrentPain,
  hidden: HiddenCosts,
  timeAllocation: TimeAllocation,
): RoiOutputs {
  const baseline = computeBaseline(team, volume, pain, hidden);
  const totalInvestment = FTE_YEARS * HOURS_PER_YEAR * CONSULTING_RATE;

  // ── Value Streams (annual, at full ramp) ──

  // Time savings: hours freed in supervised + autonomous tiers
  const automableHoursPct = (timeAllocation.supervisedPct + timeAllocation.autonomousPct) / 100;
  const hourlyRate = team.avgSalary / HOURS_PER_YEAR;
  const totalTeamHoursPerYear = team.headcount * HOURS_PER_YEAR;
  // At full autonomy, save ~60% of automable hours (agents handle, humans supervise)
  const timeSavingsAnnual = totalTeamHoursPerYear * automableHoursPct * 0.6 * hourlyRate;

  // Rework reduction: KG-powered agents catch errors before they compound
  // Reduces rework by ~70% at full maturity
  const reworkReductionAnnual = baseline.annualReworkCost * 0.7;

  // Cycle time improvement: campaigns launch faster
  // Value = more campaigns per year × revenue per campaign
  const currentCyclesPerYear = volume.monthlyCampaigns * 12;
  const avgDailyCampaignValue = (baseline.annualTeamCost / currentCyclesPerYear) / volume.avgCycleTimeDays;
  // Save ~50% of cycle time at full maturity
  const daysSaved = volume.avgCycleTimeDays * 0.5;
  const cycleTimeImprovementAnnual = currentCyclesPerYear * daysSaved * avgDailyCampaignValue;

  // Knowledge compound premium: value grows as KG gets richer
  // 5% uplift in year 2, 10% in year 3
  const knowledgePremiumAnnual = (timeSavingsAnnual + reworkReductionAnnual + cycleTimeImprovementAnnual) * 0.05;

  const totalAnnualValue = timeSavingsAnnual + reworkReductionAnnual + cycleTimeImprovementAnnual + knowledgePremiumAnnual;

  // ── Timeline (36 months) ──

  const investmentCurve = buildInvestmentCurve();
  const timeline: TimelinePoint[] = [];

  let cumulativeConservative = 0;
  let cumulativeExpected = 0;
  let cumulativeAggressive = 0;

  for (let m = 0; m <= PROJECTION_MONTHS; m++) {
    const ramp = rampFactor(m);

    // Apply knowledge compound premium in years 2-3
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
      phase: phaseForMonth(m),
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

  // ── Workflow Comparisons ──
  const cycleReduction = Math.max(0.5, 1 - rampFactor(18));
  const workflows: WorkflowComparison[] = [
    {
      name: 'Campaign Launch',
      icon: '\uD83D\uDE80',
      beforeDays: Math.round(volume.avgCycleTimeDays),
      afterValue: Math.max(1, Math.round(volume.avgCycleTimeDays * 0.21)),
      afterUnit: 'days',
      savingsPct: 79,
    },
    {
      name: 'Budget Reallocation',
      icon: '\uD83D\uDCB0',
      beforeDays: Math.round(pain.approvalBottleneckDays + 2),
      afterValue: 2,
      afterUnit: 'hours',
      savingsPct: 92,
    },
    {
      name: 'Compliance Review',
      icon: '\uD83D\uDEE1\uFE0F',
      beforeDays: Math.max(1, Math.round(pain.complianceReviewHours / 8)),
      afterValue: Math.max(1, Math.round(pain.complianceReviewHours * 0.33)),
      afterUnit: 'hours',
      savingsPct: 67,
    },
  ];

  // ── Allocation Shift ──
  const currentAllocation: AllocationSlice[] = [
    { label: 'Human-Only', pct: timeAllocation.humanOnlyPct, color: '#ef4444' },
    { label: 'Approval-Gated', pct: timeAllocation.approvalGatedPct, color: '#f59e0b' },
    { label: 'Supervised', pct: timeAllocation.supervisedPct, color: '#5B9ECF' },
    { label: 'Autonomous', pct: timeAllocation.autonomousPct, color: '#4CAF50' },
  ];

  // Future state: shift towards supervised and autonomous
  const futureAllocation: AllocationSlice[] = [
    { label: 'Human-Only', pct: Math.max(5, Math.round(timeAllocation.humanOnlyPct * 0.4)), color: '#ef4444' },
    { label: 'Approval-Gated', pct: Math.round(timeAllocation.approvalGatedPct * 0.6), color: '#f59e0b' },
    { label: 'Supervised', pct: Math.min(45, Math.round(timeAllocation.supervisedPct * 1.5 + 10)), color: '#5B9ECF' },
    { label: 'Autonomous', pct: 0, color: '#4CAF50' }, // filled below
  ];
  // Ensure sums to 100
  futureAllocation[3].pct = 100 - futureAllocation[0].pct - futureAllocation[1].pct - futureAllocation[2].pct;

  return {
    totalInvestment,
    timeSavingsAnnual,
    reworkReductionAnnual,
    cycleTimeImprovementAnnual,
    knowledgePremiumAnnual,
    totalAnnualValue,
    threeYearRoi,
    paybackMonths,
    netPresentValue: npv,
    timeline,
    breakEvenMonth,
    workflows,
    currentAllocation,
    futureAllocation,
  };
}
