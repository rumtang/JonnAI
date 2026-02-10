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
  // ── Slide: ROI Title ──────────────────────────────────────────────
  {
    slideId: 'roi-title',
    overview: 'Model overview: 7 value streams, key assumptions, scenario framework.',
    sections: [
      {
        id: 'model-overview',
        title: 'Model Architecture',
        description:
          'Revenue-anchored enterprise model with 7 independent value streams. All projections use a 36-month horizon, 10% annual discount rate, and S-curve ramp function for realistic value realization.',
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
        id: 'scenario-multipliers',
        title: 'Scenario Multipliers',
        description:
          'Three scenarios let you stress-test the model. Conservative applies a 0.6× haircut, Expected uses 1.0×, and Aggressive scales to 1.4×.',
        formula: 'Scenario Value = Base Value × Multiplier',
        variables: [
          { name: 'Conservative', storeKey: '_constant.scenarioConservative', format: 'multiplier' },
          { name: 'Expected', storeKey: '_constant.scenarioExpected', format: 'multiplier' },
          { name: 'Aggressive', storeKey: '_constant.scenarioAggressive', format: 'multiplier' },
        ],
        resultLabel: 'Total Annual Value',
        resultKey: 'outputs.totalAnnualValue',
        resultFormat: 'currency',
        sourceKey: 'marketingBudgetPct',
        confidence: 'high',
      },
    ],
  },

  // ── Slide: Baseline Inputs ────────────────────────────────────────
  {
    slideId: 'org-budget-profile',
    overview: 'How we derive your marketing cost structure from revenue and team inputs.',
    sections: [
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
          'Value recovered by closing the utilization gap (33% → 60%) and consolidating redundant tools (30% overlap). Only 50% of the gap is considered recoverable due to license minimums.',
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
          'Incremental ad revenue from AI-optimized campaigns. Meta Advantage+ shows 22% lift, Google PMax 17% — we use a conservative blended 20%.',
        formula: 'ROAS Lift = Media Spend × (Projected ROAS − Current ROAS)',
        variables: [
          { name: 'Paid Media Spend', storeKey: 'baseline.derived.annualPaidMediaSpend', format: 'currency' },
          { name: 'Current ROAS', storeKey: 'martech.currentBlendedRoas', format: 'multiplier' },
          { name: 'ROAS Lift %', storeKey: 'assumptions.roasLiftPct', format: 'percent' },
        ],
        resultLabel: 'ROAS Improvement',
        resultKey: 'outputs.valueStreams.roasImprovement',
        resultFormat: 'currency',
        sourceKey: 'roasLift',
        confidence: 'medium',
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
        confidence: 'medium',
      },
    ],
  },

  // ── Slide: Ops & Content ──────────────────────────────────────────
  {
    slideId: 'ops-content',
    overview: 'Content velocity, campaign speed, operational efficiency, and attribution.',
    sections: [
      {
        id: 'content-velocity',
        title: 'Content Velocity Savings',
        description:
          'Time savings on content production from AI-assisted creation. HubSpot documents 75-80% savings; we use a conservative 65%.',
        formula: 'Savings = Content Team Cost × Time Savings %',
        variables: [
          { name: 'Content Team Cost', storeKey: 'baseline.derived.contentTeamCost', format: 'currency' },
          { name: 'Time Savings %', storeKey: 'assumptions.contentTimeSavingsPct', format: 'percent' },
        ],
        resultLabel: 'Content Velocity Savings',
        resultKey: 'outputs.valueStreams.contentVelocity',
        resultFormat: 'currency',
        sourceKey: 'contentTimeSavings',
        confidence: 'high',
      },
      {
        id: 'campaign-speed',
        title: 'Campaign Speed Value',
        description:
          'Revenue captured earlier by reducing campaign cycle times. Each day saved per campaign translates to incremental daily marketing-attributed revenue.',
        formula: 'Value = Campaigns/yr × Days Saved × Daily Revenue × 1%',
        variables: [
          { name: 'Monthly Campaigns', storeKey: 'ops.monthlyCampaigns', format: 'number' },
          { name: 'Avg Cycle (weeks)', storeKey: 'ops.avgCampaignCycleWeeks', format: 'weeks' },
          { name: 'Cycle Reduction %', storeKey: 'assumptions.cycleTimeReductionPct', format: 'percent' },
          { name: 'Daily Campaign Revenue', storeKey: 'baseline.derived.dailyCampaignRevenue', format: 'currency' },
        ],
        resultLabel: 'Campaign Speed Value',
        resultKey: 'outputs.valueStreams.campaignSpeed',
        resultFormat: 'currency',
        sourceKey: 'adminTimePct',
        confidence: 'medium',
      },
      {
        id: 'operational-efficiency',
        title: 'Operational Efficiency',
        description:
          'Combined value of shifting admin time to strategic work (50% of admin overhead) plus reducing rework (70% reduction at maturity).',
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
          'Reduced media waste from better attribution. Manual attribution affects a portion of media spend; AI improves allocation accuracy.',
        formula: 'Value = Media Spend × Manual Attribution % × Improvement %',
        variables: [
          { name: 'Paid Media Spend', storeKey: 'baseline.derived.annualPaidMediaSpend', format: 'currency' },
          { name: 'Manual Attribution %', storeKey: 'pain.manualAttributionPct', format: 'percent' },
          { name: 'Improvement %', storeKey: 'assumptions.attributionImprovementPct', format: 'percent' },
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
        title: 'S-Curve Ramp Factor',
        description:
          'Value doesn\'t start at 100%. The S-curve models realistic adoption: 0-30% in months 1-7 (foundation), 30-70% months 7-12 (adoption), 70-90% months 12-18 (optimization), 90-100% months 18-36 (maturity).',
        formula: 'Monthly Value = (Annual Value / 12) × Ramp(month) × Year Multiplier',
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
        confidence: 'high',
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

  // ── Slide: Do Nothing ─────────────────────────────────────────────
  {
    slideId: 'do-nothing',
    overview: 'The compounding cost of not investing in organizational intelligence.',
    sections: [
      {
        id: 'quarterly-erosion',
        title: 'Quarterly Erosion',
        description:
          'Competitors adopting AI create a widening performance gap. Each quarter of inaction compounds at 2% erosion on marketing effectiveness.',
        formula: 'Quarter Loss = Budget × 2% × Quarter Number (compounding)',
        variables: [
          { name: 'Annual Revenue', storeKey: 'org.annualRevenue', format: 'currency' },
          { name: 'Marketing Budget %', storeKey: 'org.marketingBudgetPct', format: 'percent' },
        ],
        resultLabel: 'Year 1 Loss',
        resultKey: 'outputs.doNothing.year1Loss',
        resultFormat: 'currency',
        sourceKey: 'doNothingErosion',
        confidence: 'medium',
      },
      {
        id: 'multi-year-loss',
        title: 'Multi-Year Revenue Loss',
        description:
          'Cumulative revenue at risk grows from 16% in Year 1 to 25% in Year 2 and 34% by Year 3. Based on PwC/ANA Digital Maturity Study.',
        formula: 'Year N Loss = Revenue × Erosion % (16% / 25% / 34%)',
        variables: [
          { name: 'Annual Revenue', storeKey: 'org.annualRevenue', format: 'currency' },
          { name: 'Year 1 Erosion', storeKey: '_constant.doNothingYear1Pct', format: 'percent' },
          { name: 'Year 2 Erosion', storeKey: '_constant.doNothingYear2Pct', format: 'percent' },
          { name: 'Year 3 Erosion', storeKey: '_constant.doNothingYear3Pct', format: 'percent' },
        ],
        resultLabel: 'Year 3 Loss',
        resultKey: 'outputs.doNothing.year3Loss',
        resultFormat: 'currency',
        sourceKey: 'doNothingErosion',
        confidence: 'medium',
      },
      {
        id: 'cost-inflation',
        title: 'Cost Inflation Context',
        description:
          'Digital advertising costs are rising independently: Google CPC +13% YoY, Meta CPM +19.2% YoY, marketing labor +4.5% YoY. Inaction means paying more for the same results.',
        formula: 'Compounding cost pressure on existing spend',
        variables: [
          { name: 'Google CPC Inflation', storeKey: '_constant.googleCpcYoY', format: 'percent' },
          { name: 'Meta CPM Inflation', storeKey: '_constant.metaCpmYoY', format: 'percent' },
          { name: 'Labor Cost Inflation', storeKey: '_constant.laborCostYoY', format: 'percent' },
        ],
        resultLabel: 'Combined Pressure',
        resultKey: '_constant.combinedInflation',
        resultFormat: 'percent',
        sourceKey: 'doNothingErosion',
        confidence: 'medium',
      },
    ],
  },

  // ── Slide: Executive Summary ──────────────────────────────────────
  {
    slideId: 'executive-summary',
    overview: 'Final investment case: ROI, risk-adjusted returns, and CFO framework.',
    sections: [
      {
        id: 'three-year-roi',
        title: '3-Year ROI',
        description:
          'Total return on investment over the 36-month projection period. Includes S-curve ramp and year-over-year knowledge compound premiums (5% Year 2, 10% Year 3).',
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
        id: 'enterprise-value',
        title: 'Enterprise Value Creation',
        description:
          'Top-down enterprise model: AI waste recovery (50% of identified waste), content cost reduction (65%), and headcount optimization (20% through automation).',
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
