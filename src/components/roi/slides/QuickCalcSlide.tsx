'use client';

import { useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, Calculator } from 'lucide-react';
import { useRoiStore } from '@/lib/store/roi-store';
import { useSessionStore } from '@/lib/store/session-store';
import {
  INDUSTRY_BUDGET_RATIOS,
  computeRoi,
  computeBaseline,
  type OrganizationProfile,
  type MartechAndMedia,
  type ContentAndCampaignOps,
  type OperationalPain,
  type TransformationInvestment,
  type ImprovementAssumptions,
} from '@/lib/roi/engine';
import { ROI_STEPS } from '@/data/roi-steps';
import type { RoiStep } from '@/data/roi-steps';

// ─── Format Helpers ──────────────────────────────────────────────────
function formatCurrency(v: number): string {
  if (Math.abs(v) >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `$${Math.round(v / 1_000).toLocaleString()}K`;
  return `$${Math.round(v).toLocaleString()}`;
}

// ─── Log-Scale Utilities ─────────────────────────────────────────────
const LOG_STEPS = 1000;
const REVENUE_MIN = 100_000_000;
const REVENUE_MAX = 750_000_000_000;

function logToPosition(min: number, max: number, value: number): number {
  const clamped = Math.max(min, Math.min(max, value));
  const logMin = Math.log(min);
  const logMax = Math.log(max);
  return Math.round(((Math.log(clamped) - logMin) / (logMax - logMin)) * LOG_STEPS);
}

function positionToLog(min: number, max: number, position: number): number {
  const logMin = Math.log(min);
  const logMax = Math.log(max);
  return Math.exp(logMin + (position / LOG_STEPS) * (logMax - logMin));
}

function snapRevenue(v: number): number {
  if (v < 500_000_000)     return Math.round(v / 25_000_000) * 25_000_000;
  if (v < 5_000_000_000)   return Math.round(v / 100_000_000) * 100_000_000;
  if (v < 50_000_000_000)  return Math.round(v / 500_000_000) * 500_000_000;
  if (v < 200_000_000_000) return Math.round(v / 5_000_000_000) * 5_000_000_000;
  return Math.round(v / 25_000_000_000) * 25_000_000_000;
}

const industries = Object.keys(INDUSTRY_BUDGET_RATIOS);

interface QuickCalcSlideProps {
  step: RoiStep;
}

export default function QuickCalcSlide({ step }: QuickCalcSlideProps) {
  const org = useRoiStore(s => s.org);
  const setOrg = useRoiStore(s => s.setOrg);
  const setQuickCalcMode = useRoiStore(s => s.setQuickCalcMode);
  const goToStep = useRoiStore(s => s.goToStep);

  // Pre-populate from session store if user already configured org data in another mode
  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current) return;
    const sessionOrg = useSessionStore.getState().orgProfile;
    if (sessionOrg) {
      hydrated.current = true;
      setOrg({
        annualRevenue: sessionOrg.annualRevenue,
        industry: sessionOrg.industry,
        companyName: sessionOrg.companyName,
      });
    }
  }, [setOrg]);

  // Defaults for non-quick-calc fields
  const defaults = useMemo(() => ({
    martech: {
      martechPctOfBudget: 23.8,
      martechToolCount: 120,
      martechUtilizationPct: 33,
      paidMediaPctOfBudget: 30.6,
      currentBlendedRoas: 2.5,
    } as MartechAndMedia,
    ops: {
      monthlyCampaigns: 80,
      monthlyContentAssets: 500,
      avgCampaignCycleWeeks: 6,
      channelCount: 10,
      agencyPctOfBudget: 15,
      campaignCycleShortPct: 55,
      campaignCycleMediumPct: 30,
      campaignCycleLongPct: 15,
    } as ContentAndCampaignOps,
    pain: {
      reworkRatePct: 20,
      approvalCycleDays: 7,
      adminTimePct: 60,
      marketingWasteRatePct: 30,
      manualAttributionPct: 33,
    } as OperationalPain,
    investment: {
      totalInvestmentAmount: 3_000_000,
      implementationWeeks: 28,
    } as TransformationInvestment,
    assumptions: {
      roasLiftPct: 12,
      contentTimeSavingsPct: 40,
      personalizationRevLiftPct: 8,
      cycleTimeReductionPct: 25,
      reworkReductionPct: 40,
      adminToStrategicShiftPct: 30,
      attributionImprovementPct: 10,
      martechUtilizationTargetPct: 50,
      martechToolConsolidationPct: 20,
    } as ImprovementAssumptions,
  }), []);

  // Compute quick results using 3 inputs + defaults
  const results = useMemo(() => {
    const quickOrg: OrganizationProfile = {
      annualRevenue: org.annualRevenue,
      marketingBudgetPct: org.marketingBudgetPct,
      marketingHeadcount: Math.round(org.annualRevenue * (org.marketingBudgetPct / 100) / 180_000 * 0.065),
      avgLoadedFteCost: 180_000,
      industry: org.industry,
      companyName: org.companyName,
    };

    const roi = computeRoi(
      quickOrg,
      defaults.martech,
      defaults.ops,
      defaults.pain,
      defaults.investment,
      defaults.assumptions,
    );

    const baseline = computeBaseline(quickOrg, defaults.martech, defaults.ops, defaults.pain);
    const annualEfficiency = roi.totalAnnualValue;
    const doNothingRisk = roi.doNothing.year3Loss;

    return {
      paybackMonths: roi.paybackMonths,
      threeYearNpv: roi.netPresentValue,
      annualEfficiency,
      doNothingRisk,
    };
  }, [org.annualRevenue, org.marketingBudgetPct, org.industry, org.companyName, defaults]);

  const handleIndustryChange = (industry: string) => {
    const budgetPct = INDUSTRY_BUDGET_RATIOS[industry] ?? 7.7;
    setOrg({ industry, marketingBudgetPct: budgetPct });
  };

  const handleRevenueChange = (position: number[]) => {
    const raw = positionToLog(REVENUE_MIN, REVENUE_MAX, position[0]);
    setOrg({ annualRevenue: snapRevenue(raw) });
  };

  const handleBudgetPctChange = (val: number[]) => {
    setOrg({ marketingBudgetPct: val[0] });
  };

  const handleRefine = () => {
    setQuickCalcMode(false);
  };

  // Find the results slide index (executive-summary)
  const resultsIndex = ROI_STEPS.findIndex(s => s.id === 'executive-summary');

  const handleSkipToResults = () => {
    if (resultsIndex >= 0) goToStep(resultsIndex);
  };

  // Suppress unused var warning for step prop
  void step;

  return (
    <div className="h-full overflow-y-auto px-6 pb-24">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* Left: Inputs */}
        <div className="space-y-6">
          {/* Annual Revenue */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Annual Revenue</label>
              <span className="text-sm font-bold text-[#14B8A6]">
                {formatCurrency(org.annualRevenue)}
              </span>
            </div>
            <Slider
              value={[logToPosition(REVENUE_MIN, REVENUE_MAX, org.annualRevenue)]}
              min={0}
              max={LOG_STEPS}
              step={1}
              onValueChange={handleRevenueChange}
              className="[&_[data-slot=range]]:bg-[#14B8A6]"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground/50">
              <span>$100M</span>
              <span>$750B</span>
            </div>
          </div>

          {/* Industry Vertical */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Industry Vertical</label>
            <select
              value={org.industry || 'B2B Average'}
              onChange={(e) => handleIndustryChange(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#14B8A6]/50"
            >
              {industries.map(ind => (
                <option key={ind} value={ind} className="bg-background text-foreground">
                  {ind} ({INDUSTRY_BUDGET_RATIOS[ind]}%)
                </option>
              ))}
            </select>
          </div>

          {/* Marketing Budget % */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Marketing Budget %</label>
              <span className="text-sm font-bold text-[#14B8A6]">
                {org.marketingBudgetPct.toFixed(1)}%
              </span>
            </div>
            <Slider
              value={[org.marketingBudgetPct]}
              min={0.01}
              max={20}
              step={0.1}
              onValueChange={handleBudgetPctChange}
              className="[&_[data-slot=range]]:bg-[#14B8A6]"
            />
            <p className="text-[10px] text-muted-foreground/50">
              Auto-populated from industry benchmark. Adjust to match your organization.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleRefine}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#14B8A6]/10 hover:bg-[#14B8A6]/20 border border-[#14B8A6]/20 text-[#14B8A6] text-sm font-semibold transition-all"
            >
              <Calculator className="w-4 h-4" />
              Refine Your Model
            </button>
            <button
              onClick={handleSkipToResults}
              className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-[#14B8A6] transition-colors"
            >
              Skip to Full Results
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right: Hero Results Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Instant Projection
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              label="Payback Period"
              value={`${results.paybackMonths}`}
              unit="months"
              color="#4CAF50"
            />
            <ResultCard
              label="3-Year NPV"
              value={formatCurrency(results.threeYearNpv)}
              color="#14B8A6"
            />
            <ResultCard
              label="Annual Efficiency Gain"
              value={formatCurrency(results.annualEfficiency)}
              color="#5B9ECF"
            />
            <ResultCard
              label="Do-Nothing Risk"
              value={formatCurrency(results.doNothingRisk)}
              unit="3yr at risk"
              color="#ef4444"
            />
          </div>

          <p className="text-[10px] text-muted-foreground/50 leading-relaxed pt-2">
            Based on {formatCurrency(org.annualRevenue)} revenue, {org.industry || 'B2B Average'} vertical,
            {' '}{org.marketingBudgetPct.toFixed(1)}% marketing budget. Uses $3M default investment with
            industry-median improvement assumptions. Refine these inputs for a precise model.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function ResultCard({ label, value, unit, color }: {
  label: string;
  value: string;
  unit?: string;
  color: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
      {unit && (
        <p className="text-[10px] text-muted-foreground/60 mt-0.5">{unit}</p>
      )}
    </div>
  );
}
