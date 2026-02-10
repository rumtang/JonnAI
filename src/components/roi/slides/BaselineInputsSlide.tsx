'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { useRoiStore } from '@/lib/store/roi-store';
import WaterfallChart from '../charts/WaterfallChart';
import AnimatedNumber from '../charts/AnimatedNumber';
import type { RoiStep } from '@/data/roi-steps';

interface BaselineInputsSlideProps {
  step: RoiStep;
}

// ─── Format Helpers ──────────────────────────────────────────────────
function formatCurrency(v: number): string {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

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
  benchmark?: string;
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
          {format ? format(value) : value}
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
        <p className="text-[8px] text-muted-foreground/50 italic">{benchmark}</p>
      )}
    </div>
  );
}

// ─── Main Slide ──────────────────────────────────────────────────────
export default function BaselineInputsSlide({ step }: BaselineInputsSlideProps) {
  const org = useRoiStore(s => s.org);
  const setOrg = useRoiStore(s => s.setOrg);
  const investment = useRoiStore(s => s.investment);
  const setInvestment = useRoiStore(s => s.setInvestment);
  const baseline = useRoiStore(s => s.baseline);

  // Local state for the investment text input — enables bidirectional sync
  const [investmentText, setInvestmentText] = useState(
    String(investment.totalInvestmentAmount)
  );

  // Handle slider change → update text field
  const handleInvestmentSlider = useCallback((v: number) => {
    setInvestment({ totalInvestmentAmount: v });
    setInvestmentText(String(v));
  }, [setInvestment]);

  // Handle text input change → update slider
  const handleInvestmentInput = useCallback((raw: string) => {
    // Allow the user to type freely
    setInvestmentText(raw);

    // Parse and clamp to valid range
    const parsed = parseInt(raw.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsed) && parsed >= 500_000 && parsed <= 25_000_000) {
      setInvestment({ totalInvestmentAmount: parsed });
    }
  }, [setInvestment]);

  // On blur, snap text to current store value
  const handleInvestmentBlur = useCallback(() => {
    setInvestmentText(String(investment.totalInvestmentAmount));
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
              <SliderRow
                label="Annual Revenue"
                value={org.annualRevenue}
                min={500_000_000}
                max={50_000_000_000}
                step={100_000_000}
                format={formatCurrency}
                onChange={(v) => setOrg({ annualRevenue: v })}
                color="#5B9ECF"
                benchmark="Gartner: median S&P 500 = $15B"
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
                benchmark="Gartner 2025: 7.7% average"
              />
              <SliderRow
                label="Marketing Headcount"
                value={org.marketingHeadcount}
                min={50}
                max={2000}
                step={10}
                onChange={(v) => setOrg({ marketingHeadcount: v })}
                color="#5B9ECF"
                benchmark="~10 FTEs per $100M budget"
              />
              <SliderRow
                label="Avg Loaded FTE Cost"
                value={org.avgLoadedFteCost}
                min={100_000}
                max={400_000}
                step={10_000}
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
              {/* Investment amount: slider + text input side by side */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground">Total Investment</span>
                  <input
                    type="text"
                    value={investmentText}
                    onChange={(e) => handleInvestmentInput(e.target.value)}
                    onBlur={handleInvestmentBlur}
                    className="w-28 text-right text-[10px] font-semibold text-[#14B8A6] bg-white/5 border border-muted-foreground/20 rounded px-2 py-0.5 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-[#14B8A6]/50"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  />
                </div>
                <Slider
                  value={[investment.totalInvestmentAmount]}
                  min={500_000}
                  max={25_000_000}
                  step={100_000}
                  onValueChange={([v]) => handleInvestmentSlider(v)}
                  className="[&_[data-slot=slider-range]]:bg-[#14B8A6] [&_[data-slot=slider-thumb]]:border-[#14B8A6]"
                />
                <p className="text-[8px] text-muted-foreground/50 italic">
                  Enterprise range: $1M-$10M typical
                </p>
              </div>

              <SliderRow
                label="Implementation Timeline (weeks)"
                value={investment.implementationWeeks}
                min={12}
                max={52}
                step={2}
                format={(v) => `${v} weeks (~${Math.round(v / 4.33)} months)`}
                onChange={(v) => setInvestment({ implementationWeeks: v })}
                color="#14B8A6"
                benchmark="Phased enterprise build: 20-36 weeks typical"
              />
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
