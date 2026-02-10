'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { useRoiStore } from '@/lib/store/roi-store';
import { INDUSTRY_BUDGET_RATIOS, SOURCE_ATTRIBUTION } from '@/lib/roi/engine';
import WaterfallChart from '../charts/WaterfallChart';
import AnimatedNumber from '../charts/AnimatedNumber';
import SourceTooltip from '../shared/SourceTooltip';
import type { RoiStep } from '@/data/roi-steps';

interface BaselineInputsSlideProps {
  step: RoiStep;
}

// ─── Format Helpers ──────────────────────────────────────────────────
function formatCurrency(v: number): string {
  if (Math.abs(v) >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `$${Math.round(v / 1_000).toLocaleString()}K`;
  return `$${Math.round(v).toLocaleString()}`;
}

function formatWithCommas(v: number): string {
  return v.toLocaleString('en-US');
}

// ─── Log-Scale Utilities ─────────────────────────────────────────────
// Maps a linear slider (0-STEPS) to a logarithmic value range.
// This lets a single slider cover $100M to $750B without being
// unusable at the low end (where most companies live).
const LOG_STEPS = 1000;

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

// Snap to nice round numbers at each magnitude
function snapRevenue(v: number): number {
  if (v < 500_000_000)     return Math.round(v / 25_000_000) * 25_000_000;       // nearest $25M
  if (v < 5_000_000_000)   return Math.round(v / 100_000_000) * 100_000_000;     // nearest $100M
  if (v < 50_000_000_000)  return Math.round(v / 500_000_000) * 500_000_000;     // nearest $500M
  if (v < 200_000_000_000) return Math.round(v / 5_000_000_000) * 5_000_000_000; // nearest $5B
  return Math.round(v / 25_000_000_000) * 25_000_000_000;                         // nearest $25B
}

function snapInvestment(v: number): number {
  if (v < 1_000_000)  return Math.round(v / 25_000) * 25_000;      // nearest $25K
  if (v < 5_000_000)  return Math.round(v / 100_000) * 100_000;    // nearest $100K
  if (v < 25_000_000) return Math.round(v / 500_000) * 500_000;    // nearest $500K
  return Math.round(v / 1_000_000) * 1_000_000;                     // nearest $1M
}

// Revenue range: covers mid-market ($100M) through top of S&P ($750B)
const REVENUE_MIN = 100_000_000;
const REVENUE_MAX = 750_000_000_000;
// Investment range: small pilot ($250K) through mega-enterprise ($100M)
const INVESTMENT_MIN = 250_000;
const INVESTMENT_MAX = 100_000_000;

// ─── Slider Row with Benchmark ───────────────────────────────────────
interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
  color?: string;
  benchmark?: React.ReactNode;
}

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  format,
  onChange,
  color = '#14B8A6',
  benchmark,
}: SliderRowProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-muted-foreground">{label}</span>
        <span className="text-[10px] font-semibold" style={{ color }}>
          {format ? format(value) : value.toLocaleString()}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        className="[&_[data-slot=slider-range]]:bg-[#14B8A6] [&_[data-slot=slider-thumb]]:border-[#14B8A6]"
      />
      {benchmark && (
        <div className="text-[8px] text-muted-foreground/50 italic">{benchmark}</div>
      )}
    </div>
  );
}

// ─── Log-Scale Slider Row ────────────────────────────────────────────
// Uses logarithmic mapping so both $100M and $500B are equally easy to select.
interface LogSliderRowProps {
  label: string;
  value: number;
  logMin: number;
  logMax: number;
  snapFn: (v: number) => number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
  color?: string;
  benchmark?: React.ReactNode;
}

function LogSliderRow({
  label,
  value,
  logMin,
  logMax,
  snapFn,
  format,
  onChange,
  color = '#14B8A6',
  benchmark,
}: LogSliderRowProps) {
  const position = useMemo(
    () => logToPosition(logMin, logMax, value),
    [logMin, logMax, value],
  );

  const handleChange = useCallback(
    ([pos]: number[]) => {
      const raw = positionToLog(logMin, logMax, pos);
      onChange(snapFn(raw));
    },
    [logMin, logMax, snapFn, onChange],
  );

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-muted-foreground">{label}</span>
        <span className="text-[10px] font-semibold" style={{ color }}>
          {format ? format(value) : value.toLocaleString()}
        </span>
      </div>
      <Slider
        value={[position]}
        min={0}
        max={LOG_STEPS}
        step={1}
        onValueChange={handleChange}
        className="[&_[data-slot=slider-range]]:bg-[#14B8A6] [&_[data-slot=slider-thumb]]:border-[#14B8A6]"
      />
      {benchmark && (
        <div className="text-[8px] text-muted-foreground/50 italic">{benchmark}</div>
      )}
    </div>
  );
}

// ─── Main Slide ──────────────────────────────────────────────────────
export default function BaselineInputsSlide({ step }: BaselineInputsSlideProps) {
  const org = useRoiStore(s => s.org);
  const setOrg = useRoiStore(s => s.setOrg);
  const ops = useRoiStore(s => s.ops);
  const setOps = useRoiStore(s => s.setOps);
  const investment = useRoiStore(s => s.investment);
  const setInvestment = useRoiStore(s => s.setInvestment);
  const baseline = useRoiStore(s => s.baseline);

  // Local state for the investment text input — enables bidirectional sync
  const [investmentText, setInvestmentText] = useState(
    formatWithCommas(investment.totalInvestmentAmount)
  );

  // Handle log slider change → update text field
  const handleInvestmentSlider = useCallback((v: number) => {
    setInvestment({ totalInvestmentAmount: v });
    setInvestmentText(formatWithCommas(v));
  }, [setInvestment]);

  // Handle text input change → update slider
  const handleInvestmentInput = useCallback((raw: string) => {
    setInvestmentText(raw);
    // Strip commas and non-digits to parse
    const parsed = parseInt(raw.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsed) && parsed >= INVESTMENT_MIN && parsed <= INVESTMENT_MAX) {
      setInvestment({ totalInvestmentAmount: parsed });
    }
  }, [setInvestment]);

  // On blur, snap text to current store value with commas
  const handleInvestmentBlur = useCallback(() => {
    setInvestmentText(formatWithCommas(investment.totalInvestmentAmount));
  }, [investment.totalInvestmentAmount]);

  // Derived metrics
  const totalMarketingBudget = org.annualRevenue * (org.marketingBudgetPct / 100);
  const perFteCost = org.marketingHeadcount > 0
    ? totalMarketingBudget / org.marketingHeadcount
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
      {/* Tagline */}
      {step.content.tagline && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground text-center mb-4 max-w-3xl mx-auto italic"
        >
          &ldquo;{step.content.tagline}&rdquo;
        </motion.p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─── Left: Input Cards ─────────────────────────────── */}
        <div className="space-y-4">
          {/* Card 1: Organization Profile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-lg p-4"
            style={{ borderLeft: '3px solid #5B9ECF' }}
          >
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <span>🏢</span> Organization Profile
            </h4>
            <div className="space-y-3">
              {/* Company name — optional, personalizes outputs */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground">Company Name <span className="text-muted-foreground/40">(optional)</span></span>
                </div>
                <input
                  type="text"
                  value={org.companyName ?? ''}
                  onChange={(e) => setOrg({ companyName: e.target.value })}
                  placeholder="e.g. Acme Corp"
                  className="w-full text-[10px] font-semibold bg-white/5 border border-muted-foreground/20 rounded px-2 py-1.5 backdrop-blur-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#5B9ECF]/50 placeholder:text-muted-foreground/30"
                />
                <p className="text-[8px] text-muted-foreground/50 italic">
                  Personalizes your investment case and downloadable report
                </p>
              </div>

              {/* Industry selector — cascades budget % */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground">Industry Vertical</span>
                </div>
                <select
                  value={org.industry ?? 'B2B Average'}
                  onChange={(e) => {
                    const industry = e.target.value;
                    const budgetPct = INDUSTRY_BUDGET_RATIOS[industry] ?? 7.7;
                    setOrg({ industry, marketingBudgetPct: budgetPct });
                  }}
                  className="w-full text-[10px] font-semibold bg-white/5 border border-muted-foreground/20 rounded px-2 py-1.5 backdrop-blur-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#5B9ECF]/50"
                >
                  {Object.keys(INDUSTRY_BUDGET_RATIOS).map((ind) => (
                    <option key={ind} value={ind} className="bg-background text-foreground">
                      {ind} ({INDUSTRY_BUDGET_RATIOS[ind]}%)
                    </option>
                  ))}
                </select>
                <p className="text-[8px] text-muted-foreground/50 italic">
                  Selects industry-typical marketing budget %
                </p>
              </div>

              <LogSliderRow
                label="Annual Revenue"
                value={org.annualRevenue}
                logMin={REVENUE_MIN}
                logMax={REVENUE_MAX}
                snapFn={snapRevenue}
                format={formatCurrency}
                onChange={(v) => setOrg({ annualRevenue: v })}
                color="#5B9ECF"
                benchmark="Log scale: $100M to $750B (full S&P 500 range)"
              />
              <SliderRow
                label="Marketing Budget (% of Revenue)"
                value={org.marketingBudgetPct}
                min={3}
                max={15}
                step={0.1}
                format={(v) => `${v.toFixed(1)}%`}
                onChange={(v) => setOrg({ marketingBudgetPct: v })}
                color="#5B9ECF"
                benchmark={
                  <SourceTooltip source={SOURCE_ATTRIBUTION.marketingBudgetPct.source} confidence={SOURCE_ATTRIBUTION.marketingBudgetPct.confidence} sampleSize={SOURCE_ATTRIBUTION.marketingBudgetPct.sampleSize}>
                    Gartner 2025: 7.7% average
                  </SourceTooltip>
                }
              />
              <SliderRow
                label="Marketing Headcount"
                value={org.marketingHeadcount}
                min={10}
                max={5000}
                step={10}
                format={(v) => v.toLocaleString()}
                onChange={(v) => setOrg({ marketingHeadcount: v })}
                color="#5B9ECF"
                benchmark="~10 FTEs per $100M budget (declines at mega-scale)"
              />
              <SliderRow
                label="Avg Loaded FTE Cost"
                value={org.avgLoadedFteCost}
                min={80_000}
                max={400_000}
                step={5_000}
                format={formatCurrency}
                onChange={(v) => setOrg({ avgLoadedFteCost: v })}
                color="#5B9ECF"
                benchmark="Enterprise fully-loaded: $150K-$250K"
              />
            </div>
          </motion.div>

          {/* Card 2: Transformation Investment */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-lg p-4"
            style={{ borderLeft: '3px solid #14B8A6' }}
          >
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <span>💎</span> Transformation Investment
            </h4>
            <div className="space-y-3">
              {/* Investment amount: log slider + text input side by side */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground">Total Investment</span>
                  <input
                    type="text"
                    value={investmentText}
                    onChange={(e) => handleInvestmentInput(e.target.value)}
                    onBlur={handleInvestmentBlur}
                    className="w-32 text-right text-[10px] font-semibold text-[#14B8A6] bg-white/5 border border-muted-foreground/20 rounded px-2 py-0.5 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-[#14B8A6]/50"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  />
                </div>
                <LogSliderRow
                  label=""
                  value={investment.totalInvestmentAmount}
                  logMin={INVESTMENT_MIN}
                  logMax={INVESTMENT_MAX}
                  snapFn={snapInvestment}
                  format={formatCurrency}
                  onChange={handleInvestmentSlider}
                  color="#14B8A6"
                  benchmark="Log scale: $250K to $100M"
                />
              </div>

              <SliderRow
                label="Implementation Timeline"
                value={investment.implementationWeeks}
                min={8}
                max={156}
                step={4}
                format={(v) => `${Math.round(v / 4.33)} months (${v} weeks)`}
                onChange={(v) => setInvestment({ implementationWeeks: v })}
                color="#14B8A6"
                benchmark="Enterprise phased build: 6-24 months typical"
              />
            </div>
          </motion.div>

          {/* Card 3: Campaign Lifecycle Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-lg p-4"
            style={{ borderLeft: '3px solid #C9A04E' }}
          >
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <span>📅</span> Campaign Lifecycle Distribution
            </h4>
            <p className="text-[8px] text-muted-foreground/60 mb-3 leading-relaxed">
              What % of your campaigns fall into each duration bucket? (Must total 100%)
            </p>
            <div className="space-y-3">
              <SliderRow
                label="Short (1-10 weeks)"
                value={ops.campaignCycleShortPct}
                min={0}
                max={100}
                step={5}
                format={(v) => `${v}%`}
                onChange={(v) => {
                  const remaining = 100 - v;
                  const medRatio = ops.campaignCycleMediumPct / Math.max(1, ops.campaignCycleMediumPct + ops.campaignCycleLongPct);
                  setOps({
                    campaignCycleShortPct: v,
                    campaignCycleMediumPct: Math.round(remaining * medRatio),
                    campaignCycleLongPct: Math.round(remaining * (1 - medRatio)),
                  });
                }}
                color="#C9A04E"
                benchmark="Email, social, digital promos, quick sprints"
              />
              <SliderRow
                label="Medium (11-25 weeks)"
                value={ops.campaignCycleMediumPct}
                min={0}
                max={100}
                step={5}
                format={(v) => `${v}%`}
                onChange={(v) => {
                  const remaining = 100 - v;
                  const shortRatio = ops.campaignCycleShortPct / Math.max(1, ops.campaignCycleShortPct + ops.campaignCycleLongPct);
                  setOps({
                    campaignCycleMediumPct: v,
                    campaignCycleShortPct: Math.round(remaining * shortRatio),
                    campaignCycleLongPct: Math.round(remaining * (1 - shortRatio)),
                  });
                }}
                color="#C9A04E"
                benchmark="Product launches, seasonal, integrated campaigns"
              />
              <SliderRow
                label="Long (25-52 weeks)"
                value={ops.campaignCycleLongPct}
                min={0}
                max={100}
                step={5}
                format={(v) => `${v}%`}
                onChange={(v) => {
                  const remaining = 100 - v;
                  const shortRatio = ops.campaignCycleShortPct / Math.max(1, ops.campaignCycleShortPct + ops.campaignCycleMediumPct);
                  setOps({
                    campaignCycleLongPct: v,
                    campaignCycleShortPct: Math.round(remaining * shortRatio),
                    campaignCycleMediumPct: Math.round(remaining * (1 - shortRatio)),
                  });
                }}
                color="#C9A04E"
                benchmark="Brand campaigns, annual programs, always-on"
              />
              {/* Computed weighted average */}
              <div className="pt-2 border-t border-muted-foreground/10 flex items-center justify-between">
                <span className="text-[8px] text-muted-foreground">Weighted Average Cycle</span>
                <span className="text-[10px] font-semibold text-[#C9A04E]">
                  {ops.avgCampaignCycleWeeks.toFixed(1)} weeks (~{Math.round(ops.avgCampaignCycleWeeks / 4.33)} months)
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Right: Waterfall Chart + Derived Metrics ─────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* Derived metrics panel */}
          <div className="glass-panel rounded-lg p-4">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Derived Metrics
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 rounded-lg bg-muted-foreground/5">
                <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">
                  Total Marketing Budget
                </p>
                <AnimatedNumber
                  value={totalMarketingBudget}
                  format="currency"
                  className="text-sm font-bold text-[#5B9ECF]"
                />
              </div>
              <div className="text-center p-2 rounded-lg bg-muted-foreground/5">
                <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">
                  Budget per FTE
                </p>
                <AnimatedNumber
                  value={perFteCost}
                  format="currency"
                  className="text-sm font-bold text-[#9B7ACC]"
                />
              </div>
            </div>
          </div>

          {/* Waterfall chart */}
          <div className="glass-panel rounded-lg p-4">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <span>📈</span> Where Your Money Goes
            </h4>
            <WaterfallChart segments={baseline.waterfall} />

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-muted-foreground/10">
              <div className="text-center">
                <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Team Cost</p>
                <AnimatedNumber
                  value={baseline.annualTeamCost}
                  format="currency"
                  className="text-sm font-bold text-[#5B9ECF]"
                />
              </div>
              <div className="text-center">
                <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Martech+Media</p>
                <AnimatedNumber
                  value={baseline.annualMartechWaste + baseline.annualMediaWaste}
                  format="currency"
                  className="text-sm font-bold text-[#E88D67]"
                />
              </div>
              <div className="text-center">
                <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Total</p>
                <AnimatedNumber
                  value={baseline.totalAnnualCost}
                  format="currency"
                  className="text-sm font-bold text-[#14B8A6]"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
