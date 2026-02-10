'use client';

import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { useRoiStore } from '@/lib/store/roi-store';
import { SOURCE_ATTRIBUTION } from '@/lib/roi/engine';
import WaterfallChart from '../charts/WaterfallChart';
import AnimatedNumber from '../charts/AnimatedNumber';
import ChannelRoasTable from '../charts/ChannelRoasTable';
import SourceTooltip from '../shared/SourceTooltip';
import type { RoiStep } from '@/data/roi-steps';

interface MartechMediaSlideProps {
  step: RoiStep;
}

// ─── Format Helpers ──────────────────────────────────────────────────
function formatCurrency(v: number): string {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

// ─── Utilization color based on health ───────────────────────────────
function utilizationColor(pct: number): string {
  if (pct < 40) return '#ef4444';   // red — critically underutilized
  if (pct <= 60) return '#f59e0b';  // yellow — moderate
  return '#4CAF50';                  // green — healthy
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
        <div className="text-[8px] text-muted-foreground/50 italic">{benchmark}</div>
      )}
    </div>
  );
}

// ─── Main Slide ──────────────────────────────────────────────────────
export default function MartechMediaSlide({ step }: MartechMediaSlideProps) {
  const martech = useRoiStore(s => s.martech);
  const setMartech = useRoiStore(s => s.setMartech);
  const baseline = useRoiStore(s => s.baseline);
  const outputs = useRoiStore(s => s.outputs);

  // Build waste waterfall from baseline cost buckets
  const wasteWaterfall = [
    { label: 'Martech Waste', value: baseline.annualMartechWaste, color: '#E88D67' },
    { label: 'Media Waste', value: baseline.annualMediaWaste, color: '#D4856A' },
    { label: 'Attribution Waste', value: baseline.annualAttributionWaste, color: '#C9A04E' },
  ].filter(s => s.value > 0);

  const utilColor = utilizationColor(martech.martechUtilizationPct);

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
          {/* Card 1: Martech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-lg p-4"
            style={{ borderLeft: '3px solid #E88D67' }}
          >
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <span>🔧</span> Martech Stack
            </h4>
            <div className="space-y-3">
              <SliderRow
                label="Martech (% of Marketing Budget)"
                value={martech.martechPctOfBudget}
                min={10}
                max={40}
                step={0.5}
                format={(v) => `${v.toFixed(1)}%`}
                onChange={(v) => setMartech({ martechPctOfBudget: v })}
                color="#E88D67"
                benchmark={
                  <SourceTooltip source={SOURCE_ATTRIBUTION.martechUtilization.source} confidence={SOURCE_ATTRIBUTION.martechUtilization.confidence} sampleSize={SOURCE_ATTRIBUTION.martechUtilization.sampleSize}>
                    Gartner 2024: 23.8% of marketing budget
                  </SourceTooltip>
                }
              />
              <SliderRow
                label="Number of Martech Tools"
                value={martech.martechToolCount}
                min={20}
                max={300}
                step={5}
                onChange={(v) => setMartech({ martechToolCount: v })}
                color="#E88D67"
                benchmark="Enterprise average: 120 tools"
              />
              {/* Utilization with dynamic color */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground">Stack Utilization</span>
                  <span className="text-[10px] font-semibold" style={{ color: utilColor }}>
                    {martech.martechUtilizationPct}%
                  </span>
                </div>
                <Slider
                  value={[martech.martechUtilizationPct]}
                  min={10}
                  max={80}
                  step={1}
                  onValueChange={([v]) => setMartech({ martechUtilizationPct: v })}
                  className="[&_[data-slot=slider-range]]:bg-[#14B8A6] [&_[data-slot=slider-thumb]]:border-[#14B8A6]"
                />
                <p className="text-[8px] italic" style={{ color: utilColor }}>
                  {martech.martechUtilizationPct < 40
                    ? 'Critical: most capability unused'
                    : martech.martechUtilizationPct <= 60
                    ? 'Moderate: room for optimization'
                    : 'Healthy utilization rate'}
                </p>
                <p className="text-[8px] text-muted-foreground/50 italic">
                  Gartner: only 33% of capability used on average
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Paid Media */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-lg p-4"
            style={{ borderLeft: '3px solid #9B7ACC' }}
          >
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <span>📺</span> Paid Media
            </h4>
            <div className="space-y-3">
              <SliderRow
                label="Paid Media (% of Marketing Budget)"
                value={martech.paidMediaPctOfBudget}
                min={15}
                max={50}
                step={0.5}
                format={(v) => `${v.toFixed(1)}%`}
                onChange={(v) => setMartech({ paidMediaPctOfBudget: v })}
                color="#9B7ACC"
                benchmark={
                  <SourceTooltip source={SOURCE_ATTRIBUTION.paidMediaPct.source} confidence={SOURCE_ATTRIBUTION.paidMediaPct.confidence} sampleSize={SOURCE_ATTRIBUTION.paidMediaPct.sampleSize}>
                    Gartner 2025: 30.6% of marketing budget
                  </SourceTooltip>
                }
              />
              <SliderRow
                label="Current Blended ROAS"
                value={martech.currentBlendedRoas}
                min={1.0}
                max={6.0}
                step={0.1}
                format={(v) => `${v.toFixed(1)}:1`}
                onChange={(v) => setMartech({ currentBlendedRoas: v })}
                color="#9B7ACC"
                benchmark={
                  <SourceTooltip source={SOURCE_ATTRIBUTION.blendedRoas.source} confidence={SOURCE_ATTRIBUTION.blendedRoas.confidence}>
                    Cross-channel blended average: 2.5:1
                  </SourceTooltip>
                }
              />
            </div>
          </motion.div>
        </div>

        {/* ─── Right: Waste Waterfall + Callout ──────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* Waste waterfall chart */}
          <div className="glass-panel rounded-lg p-4">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <span>🔥</span> Annual Waste Breakdown
            </h4>
            <WaterfallChart segments={wasteWaterfall} />

            {/* Waste total */}
            <div className="mt-4 pt-4 border-t border-muted-foreground/10 text-center">
              <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">
                Total Annual Waste
              </p>
              <AnimatedNumber
                value={baseline.annualMartechWaste + baseline.annualMediaWaste + baseline.annualAttributionWaste}
                format="currency"
                className="text-lg font-bold text-[#D4856A]"
              />
            </div>
          </div>

          {/* Utilization gap opportunity callout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="glass-panel rounded-lg p-4"
            style={{ borderLeft: '3px solid #14B8A6' }}
          >
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
              <span>💡</span> Utilization Gap Opportunity
            </h4>
            <p className="text-[9px] text-muted-foreground mb-3">
              The gap between current martech utilization ({martech.martechUtilizationPct}%)
              and target (60%) represents recoverable value locked inside tools you already own.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-muted-foreground">Recoverable Martech Value</span>
              <AnimatedNumber
                value={baseline.annualMartechWaste}
                format="currency"
                className="text-sm font-bold text-[#14B8A6]"
              />
            </div>
          </motion.div>

          {/* Channel ROAS comparison table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-panel rounded-lg p-4"
            style={{ borderLeft: '3px solid #9B7ACC' }}
          >
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <span>📊</span> Channel ROAS: Current vs AI-Optimized
            </h4>
            <ChannelRoasTable channels={outputs.channelRoas} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
