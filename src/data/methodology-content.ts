// ─── Methodology Content ─────────────────────────────────────────────
// Static data mapping each slide ID to its formula breakdowns.
// The MethodologyPanel resolves live values from the store at render time.

import type { ConfidenceLevel } from '@/lib/roi/engine';

export interface FormulaVariable {
  name: string;
  /** Key path into resolved store values, e.g. 'org.annualRevenue' */
  storeKey: string;
  format: 'currency' | 'percent' | 'number' | 'multiplier' | 'months' | 'weeks';
}

export interface FormulaSection {
  id: string;
  title: string;
  description: string;
  formula: string;
  variables: FormulaVariable[];
  resultLabel: string;
  resultKey: string;
  resultFormat: 'currency' | 'percent' | 'number' | 'multiplier' | 'months';
  sourceKey: string;
  confidence: ConfidenceLevel;
}

export interface SlideMethodology {
  slideId: string;
  overview: string;
  sections: FormulaSection[];
}

export const METHODOLOGY: SlideMethodology[] = [
  // ── Slide: Baseline Inputs ────────────────────────────────────────
  {
    slideId: 'org-budget-profile',
    overview: 'How we derive your marketing cost structure from revenue and team inputs.',
    sections: [
      {
        id: 'model-overview',
        title: 'Model Architecture',
        description:
          'Revenue-anchored enterprise model with 7 independent value streams. All projections use a 36-month horizon, 10% annual discount rate, and per-stream adoption curves for realistic value realization. Each stream ramps independently based on tech readiness, change management lag, and (for savings streams) contract renewal cycles. Labor-related savings are capped at 40% of team cost to prevent double-counting.',
        formula: 'Total Annual Value = Σ (7 Value Streams)',
        variables: [
          { name: 'Projection Period', storeKey: '_constant.projectionMonths', format: 'months' },
          { name: 'Discount Rate', storeKey: '_constant.discountRate', format: 'percent' },
          { name: 'Annual Revenue', storeKey: 'org.annualRevenue', format: 'currency' },
        ],
        resultLabel: 'Total Annual Value',
        resultKey: 'outputs.totalAnnualValue',
        resultFormat: 'currency',
        sourceKey: 'marketingBudgetPct',
        confidence: 'high',
      },
      {
        id: 'marketing-budget',
        title: 'Marketing Budget',
        description:
          'Your total marketing budget is derived from annual revenue multiplied by the marketing budget percentage. Gartner 2025 benchmark is 7.7% of revenue.',
        formula: 'Marketing Budget = Revenue × Budget %',
        variables: [
          { name: 'Annual Revenue', storeKey: 'org.annualRevenue', format: 'currency' },
          { name: 'Marketing Budget %', storeKey: 'org.marketingBudgetPct', format: 'percent' },
        ],
        resultLabel: 'Marketing Budget',
        resultKey: 'baseline.derived.totalMarketingBudget',
        resultFormat: 'currency',
        sourceKey: 'marketingBudgetPct',
        confidence: 'high',
      },
      {
        id: 'team-cost',
        title: 'Team Cost',
        description:
          'Total annual people cost based on headcount and fully-loaded FTE cost (salary + benefits + overhead).',
        formula: 'Team Cost = Headcount × Loaded FTE Cost',
        variables: [
          { name: 'Headcount', storeKey: 'org.marketingHeadcount', format: 'number' },
          { name: 'Loaded FTE Cost', storeKey: 'org.avgLoadedFteCost', format: 'currency' },
        ],
        resultLabel: 'Annual Team Cost',
        resultKey: 'baseline.annualTeamCost',
        resultFormat: 'currency',
        sourceKey: 'adminTimePct',
        confidence: 'high',
      },
      {
        id: 'martech-waste',
        title: 'Martech Waste',
        description:
          'Spend on martech tools not being utilized. If only 33% of capability is used, 67% of spend is partially wasted.',
        formula: 'Martech Waste = Martech Spend × (1 − Utilization %)',
        variables: [
          { name: 'Martech Spend', storeKey: 'baseline.derived.annualMartechSpend', format: 'currency' },
          { name: 'Utilization Rate', storeKey: 'martech.martechUtilizationPct', format: 'percent' },
        ],
        resultLabel: 'Annual Martech Waste',
        resultKey: 'baseline.annualMartechWaste',
        resultFormat: 'currency',
        sourceKey: 'martechUtilization',
        confidence: 'high',
      },
      {
        id: 'media-waste',
        title: 'Media Waste',
        description:
          'Portion of paid media spend wasted due to poor targeting, attribution gaps, and ad fraud.',
        formula: 'Media Waste = Paid Media Spend × Waste Rate %',
        variables: [
          { name: 'Paid Media Spend', storeKey: 'baseline.derived.annualPaidMediaSpend', format: 'currency' },
          { name: 'Waste Rate', storeKey: 'pain.marketingWasteRatePct', format: 'percent' },
        ],
        resultLabel: 'Annual Media Waste',
        resultKey: 'baseline.annualMediaWaste',
        resultFormat: 'currency',
        sourceKey: 'marketingWaste',
        confidence: 'medium',
      },
      {
        id: 'approval-bottleneck',
        title: 'Approval Bottleneck',
        description:
          'Cost of team members blocked during approval cycles. Capped at available person-hours: 30% of headcount × 2,080 hours/year. Raw bottleneck hours cannot exceed what blocked FTEs can physically contribute.',
        formula: 'Cost = min(Campaigns/yr × Days × 8hr, Blocked FTEs × 2080) × Hourly Rate',
        variables: [
          { name: 'Headcount', storeKey: 'org.marketingHeadcount', format: 'number' },
          { name: 'Approval Days', storeKey: 'pain.approvalCycleDays', format: 'number' },
          { name: 'Hourly Rate', storeKey: 'baseline.derived.hourlyRate', format: 'currency' },
        ],
        resultLabel: 'Annual Approval Bottleneck',
        resultKey: 'baseline.annualApprovalBottleneckCost',
        resultFormat: 'currency',
        sourceKey: 'adminTimePct',
        confidence: 'medium',
      },
      {
        id: 'rework-cost',
        title: 'Rework Cost',
        description:
          'Cost of redoing work due to brand inconsistency, miscommunication, or missing context.',
        formula: 'Rework Cost = Team Cost × Rework Rate %',
        variables: [
          { name: 'Team Cost', storeKey: 'baseline.annualTeamCost', format: 'currency' },
          { name: 'Rework Rate', storeKey: 'pain.reworkRatePct', format: 'percent' },
        ],
        resultLabel: 'Annual Rework Cost',
        resultKey: 'baseline.annualReworkCost',
        resultFormat: 'currency',
        sourceKey: 'reworkRate',
        confidence: 'medium',
      },
      {
        id: 'admin-overhead',
        title: 'Admin Overhead',
        description:
          'Opportunity cost of team time spent on administrative tasks instead of strategic work. Salesforce research shows 60% of marketing time is admin.',
        formula: 'Admin Overhead = Team Cost × Admin Time %',
        variables: [
          { name: 'Team Cost', storeKey: 'baseline.annualTeamCost', format: 'currency' },
          { name: 'Admin Time %', storeKey: 'pain.adminTimePct', format: 'percent' },
        ],
        resultLabel: 'Annual Admin Overhead',
        resultKey: 'baseline.annualAdminOverheadCost',
        resultFormat: 'currency',
        sourceKey: 'adminTimePct',
        confidence: 'high',
      },
      {
        id: 'agentification-intensity',
        title: 'Agentification Intensity',
        description:
          'Three-level preset that adjusts all 9 improvement assumptions at once, reflecting how deeply an organization adopts AI agents. Co-Pilot (Low): humans lead with AI assists — ~half of industry medians. Agentic (Medium): AI executes with human supervision — aligned with 2026 industry medians (88% of orgs integrated AI, 60% of roles partially automated). Autonomous (High): AI drives operations, humans steer strategy — aligned with top-quartile benchmarks (65% content cost reduction, 20% ROAS lift, 79% journey automation). The intensity selector is orthogonal to the scenario multiplier (conservative 0.6x / expected 1.0x / aggressive 1.4x), which models confidence in the numbers rather than depth of adoption.',
        formula: 'Assumptions = INTENSITY_PRESETS[selected level]',
        variables: [
          { name: 'ROAS Lift (Low/Med/High)', storeKey: 'assumptions.roasLiftPct', format: 'percent' },
          { name: 'Content Savings (Low/Med/High)', storeKey: 'assumptions.contentTimeSavingsPct', format: 'percent' },
          { name: 'Cycle Time Reduction (Low/Med/High)', storeKey: 'assumptions.cycleTimeReductionPct', format: 'percent' },
        ],
        resultLabel: 'Total Annual Value',
        resultKey: 'outputs.totalAnnualValue',
        resultFormat: 'currency',
        sourceKey: 'marketingBudgetPct',
        confidence: 'medium',
      },
    ],
  },

  // ── Slide: Martech & Media ────────────────────────────────────────
  {
    slideId: 'martech-media',
    overview: 'Martech stack optimization and ROAS improvement formulas.',
    sections: [
      {
        id: 'martech-optimization',
        title: 'Martech Optimization Value',
        description:
          'Value recovered by closing the utilization gap (33% → 50%) and consolidating redundant tools (20% overlap). Only 50% of the gap is considered recoverable due to license minimums.',
        formula: 'Value = (Spend × Utilization Gap × 50%) + (Spend × Consolidation % × 30%)',
        variables: [
          { name: 'Martech Spend', storeKey: 'baseline.derived.annualMartechSpend', format: 'currency' },
          { name: 'Current Utilization', storeKey: 'martech.martechUtilizationPct', format: 'percent' },
          { name: 'Target Utilization', storeKey: 'assumptions.martechUtilizationTargetPct', format: 'percent' },
          { name: 'Tool Consolidation %', storeKey: 'assumptions.martechToolConsolidationPct', format: 'percent' },
        ],
        resultLabel: 'Martech Optimization',
        resultKey: 'outputs.valueStreams.martechOptimization',
        resultFormat: 'currency',
        sourceKey: 'martechUtilization',
        confidence: 'high',
      },
      {
        id: 'roas-improvement',
        title: 'ROAS Improvement',
        description:
          'Incremental profit contribution from AI-optimized campaigns. A 20% contribution margin is applied — only the profit on incremental revenue counts, not gross revenue. Based on platform vendor case studies (Meta, Google) — not independently verified. Default assumes 12% lift.',
        formula: 'ROAS Lift = Media Spend × (Projected ROAS − Current ROAS) × 20% Margin',
        variables: [
          { name: 'Paid Media Spend', storeKey: 'baseline.derived.annualPaidMediaSpend', format: 'currency' },
          { name: 'Current ROAS', storeKey: 'martech.currentBlendedRoas', format: 'multiplier' },
          { name: 'ROAS Lift %', storeKey: 'assumptions.roasLiftPct', format: 'percent' },
        ],
        resultLabel: 'ROAS Improvement',
        resultKey: 'outputs.valueStreams.roasImprovement',
        resultFormat: 'currency',
        sourceKey: 'roasLift',
        confidence: 'emerging',
      },
      {
        id: 'personalization-lift',
        title: 'Personalization Lift',
        description:
          'Profit contribution from personalized customer experiences. McKinsey research shows 8% median revenue lift from personalization at scale. A 20% contribution margin is applied — only the profit on incremental revenue counts.',
        formula: 'Value = Ad Revenue × Personalization Lift % × 20% Margin',
        variables: [
          { name: 'Current Ad Revenue', storeKey: 'baseline.derived.currentAdRevenue', format: 'currency' },
          { name: 'Personalization Lift %', storeKey: 'assumptions.personalizationRevLiftPct', format: 'percent' },
        ],
        resultLabel: 'Personalization Lift',
        resultKey: 'outputs.valueStreams.personalizationLift',
        resultFormat: 'currency',
        sourceKey: 'personalizationLift',
        confidence: 'high',
      },
      {
        id: 'channel-roas',
        title: 'Channel ROAS Benchmarks',
        description:
          'Per-channel ROAS benchmarks from Google/Nielsen studies. AI optimization lifts each channel by the configured ROAS improvement percentage.',
        formula: 'AI ROAS = Current ROAS × (1 + Lift %)',
        variables: [
          { name: 'ROAS Lift %', storeKey: 'assumptions.roasLiftPct', format: 'percent' },
        ],
        resultLabel: 'Blended ROAS Lift',
        resultKey: 'outputs.roas.projectedRoas',
        resultFormat: 'multiplier',
        sourceKey: 'blendedRoas',
        confidence: 'emerging',
      },
    ],
  },

  // ── Slide: Ops & Content ──────────────────────────────────────────
  {
    slideId: 'ops-content',
    overview: 'Content velocity, campaign speed, operational efficiency, and attribution. Labor-related savings are capped at 40% of team cost.',
    sections: [
      {
        id: 'content-velocity',
        title: 'Content Velocity Savings',
        description:
          'Time savings on content production from AI-assisted creation. HubSpot documents savings for first-draft text; full production (strategy, review, design, distribution) saves less. Default 40%.',
        formula: 'Savings = Content Team Cost × Time Savings %',
        variables: [
          { name: 'Content Team Cost', storeKey: 'baseline.derived.contentTeamCost', format: 'currency' },
          { name: 'Time Savings %', storeKey: 'assumptions.contentTimeSavingsPct', format: 'percent' },
        ],
        resultLabel: 'Content Velocity Savings',
        resultKey: 'outputs.valueStreams.contentVelocity',
        resultFormat: 'currency',
        sourceKey: 'contentTimeSavings',
        confidence: 'medium',
      },
      {
        id: 'campaign-speed',
        title: 'Campaign Throughput Savings',
        description:
          'Labor efficiency from faster campaign cycles. Days saved per campaign free up the 30% of the team actively working on campaign ops. Capped at 10% of total team cost, then included in the 40% labor savings cap alongside Content Velocity and Ops Efficiency.',
        formula: 'Value = min(Campaigns/yr × Days Saved × 30% FTE × 8hr × Hourly Rate, 10% of Team Cost)',
        variables: [
          { name: 'Monthly Campaigns', storeKey: 'ops.monthlyCampaigns', format: 'number' },
          { name: 'Avg Cycle (weeks)', storeKey: 'ops.avgCampaignCycleWeeks', format: 'weeks' },
          { name: 'Cycle Reduction %', storeKey: 'assumptions.cycleTimeReductionPct', format: 'percent' },
          { name: 'Hourly Rate', storeKey: 'baseline.derived.hourlyRate', format: 'currency' },
        ],
        resultLabel: 'Campaign Throughput Savings',
        resultKey: 'outputs.valueStreams.campaignSpeed',
        resultFormat: 'currency',
        sourceKey: 'adminTimePct',
        confidence: 'medium',
      },
      {
        id: 'operational-efficiency',
        title: 'Operational Efficiency',
        description:
          'Combined value of shifting admin time to strategic work (30% of admin overhead) plus reducing rework (40% reduction). Total labor savings are capped at 40% of team cost to prevent double-counting with content velocity.',
        formula: 'Value = (Admin Overhead × Shift %) + (Rework Cost × Reduction %)',
        variables: [
          { name: 'Admin Overhead', storeKey: 'baseline.annualAdminOverheadCost', format: 'currency' },
          { name: 'Admin Shift %', storeKey: 'assumptions.adminToStrategicShiftPct', format: 'percent' },
          { name: 'Rework Cost', storeKey: 'baseline.annualReworkCost', format: 'currency' },
          { name: 'Rework Reduction %', storeKey: 'assumptions.reworkReductionPct', format: 'percent' },
        ],
        resultLabel: 'Operational Efficiency',
        resultKey: 'outputs.valueStreams.operationalEfficiency',
        resultFormat: 'currency',
        sourceKey: 'adminTimePct',
        confidence: 'high',
      },
      {
        id: 'attribution-improvement',
        title: 'Attribution Improvement',
        description:
          'Reduced media waste from better attribution. Discounted by ROAS lift percentage to avoid double-counting with the ROAS Improvement stream.',
        formula: 'Value = Media Spend × Manual % × Improvement % × (1 − ROAS Lift %)',
        variables: [
          { name: 'Paid Media Spend', storeKey: 'baseline.derived.annualPaidMediaSpend', format: 'currency' },
          { name: 'Manual Attribution %', storeKey: 'pain.manualAttributionPct', format: 'percent' },
          { name: 'Improvement %', storeKey: 'assumptions.attributionImprovementPct', format: 'percent' },
          { name: 'ROAS Lift %', storeKey: 'assumptions.roasLiftPct', format: 'percent' },
        ],
        resultLabel: 'Attribution Improvement',
        resultKey: 'outputs.valueStreams.attributionImprovement',
        resultFormat: 'currency',
        sourceKey: 'marketingWaste',
        confidence: 'medium',
      },
    ],
  },

  // ── Slide: Timeline ───────────────────────────────────────────────
  {
    slideId: 'transformation',
    overview: 'How we project value realization over 36 months using S-curve ramp, NPV, and IRR.',
    sections: [
      {
        id: 'ramp-factor',
        title: 'Per-Stream Adoption Curves',
        description:
          'Each of the 7 value streams has its own adoption S-curve reflecting three real-world delays: (1) Tech Readiness — which KG layers must complete, scaling proportionally with the build timeline; (2) Change Management — fixed months for training, trust-building, and organizational alignment (2–6 months depending on stream); (3) Cost Reduction Lag — SaaS renewal cycles and contract terms that delay savings realization (martech +4 months, content +2 months). Each stream also has realization ceilings (50–75% at month 18, 85–100% at month 36) reflecting organizational inertia — you can\'t retrain 500 people in 6 months. The result is a more conservative but credible model: breakeven shifts later, but a CFO is more likely to trust the numbers.',
        formula: 'Monthly Value = Σ (Stream Value / 12) × streamRamp(month, stream, buildWeeks)',
        variables: [
          { name: 'Total Annual Value', storeKey: 'outputs.totalAnnualValue', format: 'currency' },
          { name: 'Implementation Weeks', storeKey: 'investment.implementationWeeks', format: 'weeks' },
        ],
        resultLabel: 'Breakeven Month',
        resultKey: 'outputs.breakEvenMonth',
        resultFormat: 'months',
        sourceKey: 'marketingBudgetPct',
        confidence: 'high',
      },
      {
        id: 'npv-calculation',
        title: 'Net Present Value (NPV)',
        description:
          'Future value streams are discounted back to today\'s dollars at 10% annual (industry standard WACC). NPV > 0 means the investment creates value beyond the cost of capital.',
        formula: 'NPV = −Investment + Σ (Monthly Value / (1 + r/12)^month)',
        variables: [
          { name: 'Total Investment', storeKey: 'investment.totalInvestmentAmount', format: 'currency' },
          { name: 'Discount Rate', storeKey: '_constant.discountRate', format: 'percent' },
        ],
        resultLabel: 'Net Present Value',
        resultKey: 'outputs.netPresentValue',
        resultFormat: 'currency',
        sourceKey: 'marketingBudgetPct',
        confidence: 'high',
      },
      {
        id: 'irr-calculation',
        title: 'Internal Rate of Return (IRR)',
        description:
          'The annualized return rate that makes NPV = 0. Computed using Newton-Raphson iteration on monthly cash flows then annualized. CFOs typically require 15%+ hurdle rate.',
        formula: 'Find r where Σ (Cash Flow_t / (1+r)^t) = 0, then annualize',
        variables: [
          { name: 'Total Investment', storeKey: 'investment.totalInvestmentAmount', format: 'currency' },
          { name: 'Total Annual Value', storeKey: 'outputs.totalAnnualValue', format: 'currency' },
        ],
        resultLabel: 'IRR (Annualized)',
        resultKey: 'outputs.irr',
        resultFormat: 'percent',
        sourceKey: 'marketingBudgetPct',
        confidence: 'high',
      },
    ],
  },

  // ── Slide: Before & After ─────────────────────────────────────────
  {
    slideId: 'before-after',
    overview: 'How each workflow transforms with organizational intelligence.',
    sections: [
      {
        id: 'campaign-launch',
        title: 'Campaign Launch',
        description:
          'Campaign cycle time is reduced by 60% through automated brief generation, asset production, and approval routing via knowledge graph context.',
        formula: 'After = Cycle Days × 40% (60% reduction)',
        variables: [
          { name: 'Avg Cycle (weeks)', storeKey: 'ops.avgCampaignCycleWeeks', format: 'weeks' },
        ],
        resultLabel: 'Reduction',
        resultKey: '_workflow.0.savingsPct',
        resultFormat: 'percent',
        sourceKey: 'adminTimePct',
        confidence: 'medium',
      },
      {
        id: 'content-production',
        title: 'Content Production',
        description:
          'AI-assisted content creation with brand knowledge context reduces production from 14 days to ~5 days (65% savings).',
        formula: 'After = 14 days × 35%',
        variables: [],
        resultLabel: 'Reduction',
        resultKey: '_workflow.1.savingsPct',
        resultFormat: 'percent',
        sourceKey: 'contentTimeSavings',
        confidence: 'medium',
      },
      {
        id: 'budget-reallocation',
        title: 'Budget Reallocation',
        description:
          'Real-time performance data and AI recommendations reduce budget reallocation from days to hours.',
        formula: 'After = 2 hours (from multiple days)',
        variables: [
          { name: 'Approval Cycle Days', storeKey: 'pain.approvalCycleDays', format: 'number' },
        ],
        resultLabel: 'Reduction',
        resultKey: '_workflow.2.savingsPct',
        resultFormat: 'percent',
        sourceKey: 'adminTimePct',
        confidence: 'medium',
      },
      {
        id: 'compliance-review',
        title: 'Compliance Review',
        description:
          'Knowledge-graph-powered compliance checks against brand guidelines, legal requirements, and regulatory frameworks reduce review cycles by 75%.',
        formula: 'After = Approval Days × 25%',
        variables: [
          { name: 'Approval Cycle Days', storeKey: 'pain.approvalCycleDays', format: 'number' },
        ],
        resultLabel: 'Reduction',
        resultKey: '_workflow.3.savingsPct',
        resultFormat: 'percent',
        sourceKey: 'reworkRate',
        confidence: 'medium',
      },
      {
        id: 'personalization-deploy',
        title: 'Personalization Deploy',
        description:
          'Automated audience segmentation and content personalization reduces deployment from 21 days to 3 days (86% savings).',
        formula: 'After = 3 days (from 21 days)',
        variables: [],
        resultLabel: 'Reduction',
        resultKey: '_workflow.4.savingsPct',
        resultFormat: 'percent',
        sourceKey: 'personalizationLift',
        confidence: 'emerging',
      },
      {
        id: 'attribution-report',
        title: 'Attribution Report',
        description:
          'Real-time attribution dashboards replace manual reporting. From 5-day cycles to 30-minute automated reports.',
        formula: 'After = 30 minutes (from 5 days)',
        variables: [],
        resultLabel: 'Reduction',
        resultKey: '_workflow.5.savingsPct',
        resultFormat: 'percent',
        sourceKey: 'marketingWaste',
        confidence: 'medium',
      },
    ],
  },

  // ── Slide: Executive Summary ──────────────────────────────────────
  {
    slideId: 'executive-summary',
    overview: 'Final investment case: ROI, risk-adjusted returns, cost of inaction, and CFO framework.',
    sections: [
      {
        id: 'three-year-roi',
        title: '3-Year ROI',
        description:
          'Total return on investment over the 36-month projection period. Uses S-curve ramp for realistic adoption. No artificial year multipliers are applied.',
        formula: 'ROI = ((3-Year Value − Investment) / Investment) × 100',
        variables: [
          { name: 'Total Investment', storeKey: 'investment.totalInvestmentAmount', format: 'currency' },
          { name: 'Total Annual Value', storeKey: 'outputs.totalAnnualValue', format: 'currency' },
        ],
        resultLabel: '3-Year ROI',
        resultKey: 'outputs.threeYearRoi',
        resultFormat: 'percent',
        sourceKey: 'marketingBudgetPct',
        confidence: 'high',
      },
      {
        id: 'do-nothing-cost',
        title: 'Cost of Inaction',
        description:
          'Illustrative erosion model: competitors adopting AI create a widening performance gap. Erosion is applied to marketing-attributable revenue (budget), not total company revenue. The quarterly compound model (2% per quarter, escalating) drives all year-over-year figures.',
        formula: 'Year N Loss = Σ quarterly(Marketing Budget × 2% × Quarter#)',
        variables: [
          { name: 'Marketing Budget', storeKey: 'baseline.derived.totalMarketingBudget', format: 'currency' },
        ],
        resultLabel: 'Year 1 Loss',
        resultKey: 'outputs.doNothing.year1Loss',
        resultFormat: 'currency',
        sourceKey: 'doNothingErosion',
        confidence: 'emerging',
      },
      {
        id: 'enterprise-value',
        title: 'Enterprise Value Creation',
        description:
          'Top-down enterprise model: AI waste recovery (50% of identified waste), content cost reduction, and headcount optimization (20% through automation).',
        formula: 'Value = Waste Recovery + Content Savings + Headcount Savings',
        variables: [
          { name: 'Budget Waste Total', storeKey: 'outputs.enterpriseModel.budgetWasteTotal', format: 'currency' },
          { name: 'AI Recovery Potential', storeKey: 'outputs.enterpriseModel.aiRecoveryPotential', format: 'currency' },
          { name: 'Content Savings', storeKey: 'outputs.enterpriseModel.contentSavings', format: 'currency' },
        ],
        resultLabel: 'Enterprise Value',
        resultKey: 'outputs.enterpriseModel.totalEnterpriseValue',
        resultFormat: 'currency',
        sourceKey: 'marketingWaste',
        confidence: 'medium',
      },
      {
        id: 'risk-adjusted',
        title: 'Risk-Adjusted Returns',
        description:
          'Conservative scenario applies a 0.6× multiplier to all value streams. This represents a 40% haircut — suitable for CFO-level risk modeling.',
        formula: 'Conservative Value = Expected Value × 0.6',
        variables: [
          { name: 'Expected Annual Value', storeKey: 'outputs.totalAnnualValue', format: 'currency' },
          { name: 'Conservative Multiplier', storeKey: '_constant.scenarioConservative', format: 'multiplier' },
        ],
        resultLabel: 'Conservative Annual Value',
        resultKey: '_computed.conservativeAnnualValue',
        resultFormat: 'currency',
        sourceKey: 'marketingBudgetPct',
        confidence: 'high',
      },
      {
        id: 'ongoing-opex',
        title: 'Ongoing Operational Costs',
        description:
          'Annual operational expenditure for running the AI infrastructure: LLM API tokens (content generation, compliance checks, optimization), cloud infrastructure (knowledge graph DB, compute, storage), and maintenance/DevOps staffing. Industry standard is 20% of initial capital investment per year. OpEx begins after the build phase completes and is subtracted from monthly cash flows in NPV, IRR, and payback calculations.',
        formula: 'Annual OpEx = Total Investment × 20%',
        variables: [
          { name: 'Total Investment', storeKey: 'investment.totalInvestmentAmount', format: 'currency' },
        ],
        resultLabel: 'Annual Ongoing Cost',
        resultKey: 'outputs.annualOpEx',
        resultFormat: 'currency',
        sourceKey: 'ongoingOpEx',
        confidence: 'high',
      },
      {
        id: 'cfo-framework',
        title: 'CFO Framework Thresholds',
        description:
          'Investment evaluation against standard CFO hurdles: 10% WACC, 15% IRR minimum, 24-month payback expectation, and 20% risk adjustment.',
        formula: 'Pass/Fail: IRR > 15%, Payback < 24mo, NPV > 0',
        variables: [
          { name: 'IRR', storeKey: 'outputs.irr', format: 'percent' },
          { name: 'Payback Months', storeKey: 'outputs.paybackMonths', format: 'months' },
          { name: 'NPV', storeKey: 'outputs.netPresentValue', format: 'currency' },
        ],
        resultLabel: 'NPV',
        resultKey: 'outputs.netPresentValue',
        resultFormat: 'currency',
        sourceKey: 'marketingBudgetPct',
        confidence: 'high',
      },
    ],
  },
];
