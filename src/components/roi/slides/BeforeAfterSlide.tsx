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

// ─── Workflow Comparison Card ───────────────────────────────────────
function WorkflowCard({ wf, index }: { wf: WorkflowComparison; index: number }) {
  const delay = 0.2 + index * 0.15;

  // Normalize bar widths: "before" is always 100%, "after" is proportional
  const afterPct = wf.afterUnit === 'days'
    ? Math.max(5, (wf.afterValue / wf.beforeDays) * 100)
    : Math.max(5, ((wf.afterValue / 8) / wf.beforeDays) * 100); // convert hours to days for comparison

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-panel rounded-lg p-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{wf.icon}</span>
        <h4 className="text-sm font-semibold text-foreground">{wf.name}</h4>
        <span
          className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{ backgroundColor: '#4CAF5020', color: '#4CAF50' }}
        >
          -{wf.savingsPct}%
        </span>
      </div>

      {/* Before bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Before</span>
          <span className="text-[10px] font-semibold text-[#D4856A]">
            {wf.beforeDays} {wf.beforeDays === 1 ? 'day' : 'days'}
          </span>
        </div>
        <div className="h-3 rounded-full bg-muted-foreground/10 overflow-hidden">
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
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">After</span>
          <span className="text-[10px] font-semibold text-[#14B8A6]">
            {wf.afterValue} {wf.afterUnit === 'days' ? (wf.afterValue === 1 ? 'day' : 'days') : (wf.afterValue === 1 ? 'hour' : 'hours')}
          </span>
        </div>
        <div className="h-3 rounded-full bg-muted-foreground/10 overflow-hidden">
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
  const { workflows, currentAllocation, futureAllocation } = outputs;

  return (
    <div className="max-w-6xl mx-auto px-6 py-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
      {/* Tagline */}
      {step.content.tagline && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground text-center mb-6 max-w-3xl mx-auto italic"
        >
          &ldquo;{step.content.tagline}&rdquo;
        </motion.p>
      )}

      {/* Workflow Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {workflows.map((wf, i) => (
          <WorkflowCard key={wf.name} wf={wf} index={i} />
        ))}
      </div>

      {/* Allocation Shift Section */}
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
          How your team&apos;s work distribution transforms with the intelligence layer
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
              Autonomous work increases from{' '}
              <AnimatedNumber
                value={currentAllocation.find(a => a.label === 'Autonomous')?.pct ?? 0}
                format="percent"
                className="font-bold"
              />
              {' → '}
              <AnimatedNumber
                value={futureAllocation.find(a => a.label === 'Autonomous')?.pct ?? 0}
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
