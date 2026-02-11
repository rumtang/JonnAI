'use client';

import { motion } from 'framer-motion';
import { useRoiStore } from '@/lib/store/roi-store';
import PieChart from '../charts/PieChart';
import AnimatedNumber from '../charts/AnimatedNumber';
import type { RoiStep } from '@/data/roi-steps';
import type { WorkflowComparison } from '@/lib/roi/engine';

interface BeforeAfterSlideProps {
  step: RoiStep;
}

// ─── Format Helpers ─────────────────────────────────────────────────
function formatCompact(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${Math.round(v).toLocaleString()}`;
}

// ─── Workflow Comparison Card ───────────────────────────────────────
function WorkflowCard({ wf, index }: { wf: WorkflowComparison; index: number }) {
  const delay = 0.2 + index * 0.1;

  // Normalize bar widths: "before" is always 100%, "after" is proportional
  const afterPct =
    wf.afterUnit === 'days'
      ? Math.max(5, (wf.afterValue / wf.beforeDays) * 100)
      : wf.afterUnit === 'hours'
      ? Math.max(5, ((wf.afterValue / 8) / wf.beforeDays) * 100)
      : Math.max(5, ((wf.afterValue / 60 / 8) / wf.beforeDays) * 100); // minutes

  // Unit label helpers
  const afterLabel =
    wf.afterUnit === 'days'
      ? wf.afterValue === 1 ? 'day' : 'days'
      : wf.afterUnit === 'hours'
      ? wf.afterValue === 1 ? 'hour' : 'hours'
      : wf.afterValue === 1 ? 'minute' : 'minutes';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-panel rounded-lg p-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{wf.icon}</span>
        <h4 className="text-[11px] font-semibold text-foreground leading-tight">{wf.name}</h4>
        <span
          className="ml-auto px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0"
          style={{ backgroundColor: '#4CAF5020', color: '#4CAF50' }}
        >
          -{wf.savingsPct}%
        </span>
      </div>

      {/* Before bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[8px] text-muted-foreground uppercase tracking-wider">Before</span>
          <span className="text-[9px] font-semibold text-[#D4856A]">
            {wf.beforeDays} {wf.beforeDays === 1 ? 'day' : 'days'}
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-muted-foreground/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: '#D4856A' }}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: delay + 0.2, duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* After bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[8px] text-muted-foreground uppercase tracking-wider">After</span>
          <span className="text-[9px] font-semibold text-[#14B8A6]">
            {wf.afterValue} {afterLabel}
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-muted-foreground/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: '#14B8A6' }}
            initial={{ width: 0 }}
            animate={{ width: `${afterPct}%` }}
            transition={{ delay: delay + 0.4, duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Slide ────────────────────────────────────────────────────
export default function BeforeAfterSlide({ step }: BeforeAfterSlideProps) {
  const outputs = useRoiStore(s => s.outputs);
  const { workflows, currentAllocation, futureAllocation, roas } = outputs;

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

      {/* Workflow Comparison Cards — 2 rows x 3 cols */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {workflows.map((wf, i) => (
          <WorkflowCard key={wf.name} wf={wf} index={i} />
        ))}
      </div>

      {/* ─── ROAS Comparison Section ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-panel rounded-lg p-4 mb-6"
      >
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center mb-3">
          ROAS Impact
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-lg bg-muted-foreground/5">
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">Current ROAS</p>
            <p className="text-lg font-bold text-[#D4856A]">
              {roas.currentRoas.toFixed(1)}:1
            </p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted-foreground/5">
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">Projected ROAS</p>
            <p className="text-lg font-bold text-[#14B8A6]">
              {roas.projectedRoas.toFixed(1)}:1
            </p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted-foreground/5">
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">Incremental Revenue</p>
            <span className="text-[#9B7ACC]">
              <AnimatedNumber
                value={roas.incrementalRevenue}
                format="currency"
                className="text-lg font-bold"
              />
            </span>
          </div>
        </div>
      </motion.div>

      {/* ─── Competitive Context Callout ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="glass-panel rounded-lg p-4 mb-6"
        style={{ borderLeft: '3px solid #ef4444' }}
      >
        <div className="flex items-start gap-3">
          <span className="text-lg shrink-0">&#x26A0;&#xFE0F;</span>
          <div>
            <h4 className="text-[10px] font-semibold text-[#ef4444] uppercase tracking-wider mb-1">
              Meanwhile, Your Competitors...
            </h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Organizations that delay knowledge infrastructure by 12+ months face compounding disadvantages
              as AI-native competitors encode operational knowledge faster. The efficiency gaps shown above
              widen each quarter — what is a 60% speed advantage today becomes a structural moat within 18 months.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ─── Allocation Shift Section ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-panel rounded-lg p-6"
      >
        <h3 className="text-sm font-semibold text-center text-foreground mb-1">
          Team Time Allocation Shift
        </h3>
        <p className="text-[10px] text-muted-foreground text-center mb-6">
          How your team&apos;s work distribution transforms with the organizational intelligence layer
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Current allocation pie */}
          <div className="flex flex-col items-center">
            <PieChart
              slices={currentAllocation}
              size={140}
              strokeWidth={20}
              delay={0.8}
              label="Current State"
            />
          </div>

          {/* Future allocation pie */}
          <div className="flex flex-col items-center">
            <PieChart
              slices={futureAllocation}
              size={140}
              strokeWidth={20}
              delay={1.0}
              label="With Knowledge Graph"
            />
          </div>
        </div>

        {/* Key insight callout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#14B8A6]/10">
            <span className="text-xs text-[#14B8A6] font-semibold">
              Innovation time increases from{' '}
              <AnimatedNumber
                value={currentAllocation.find(a => a.label === 'Innovation')?.pct ?? 0}
                format="percent"
                className="font-bold"
              />
              {' '}to{' '}
              <AnimatedNumber
                value={futureAllocation.find(a => a.label === 'Innovation')?.pct ?? 0}
                format="percent"
                className="font-bold"
              />
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
