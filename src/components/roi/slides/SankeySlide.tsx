'use client';

import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { useRoiStore } from '@/lib/store/roi-store';
import SankeyDiagram from '../charts/SankeyDiagram';
import AnimatedNumber from '../charts/AnimatedNumber';
import type { RoiStep } from '@/data/roi-steps';
import type { TimeAllocation } from '@/lib/roi/engine';

interface SankeySlideProps {
  step: RoiStep;
}

const TIERS: { key: keyof TimeAllocation; label: string; color: string; icon: string }[] = [
  { key: 'humanOnlyPct', label: 'Human-Only', color: '#ef4444', icon: '🧑' },
  { key: 'approvalGatedPct', label: 'Approval-Gated', color: '#f59e0b', icon: '✋' },
  { key: 'supervisedPct', label: 'Supervised', color: '#5B9ECF', icon: '👁' },
  { key: 'autonomousPct', label: 'Autonomous', color: '#4CAF50', icon: '🤖' },
];

export default function SankeySlide({ step }: SankeySlideProps) {
  const timeAllocation = useRoiStore(s => s.timeAllocation);
  const setTimeAllocation = useRoiStore(s => s.setTimeAllocation);
  const outputs = useRoiStore(s => s.outputs);

  // When one slider changes, distribute the delta proportionally across others
  const handleSliderChange = (key: keyof TimeAllocation, newValue: number) => {
    const oldValue = timeAllocation[key];
    const delta = newValue - oldValue;
    if (delta === 0) return;

    const otherKeys = TIERS.filter(t => t.key !== key).map(t => t.key);
    const otherTotal = otherKeys.reduce((sum, k) => sum + timeAllocation[k], 0);

    if (otherTotal === 0) return; // Can't redistribute

    const newAllocation = { ...timeAllocation, [key]: newValue };
    let remaining = -delta;

    for (const k of otherKeys) {
      const proportion = timeAllocation[k] / otherTotal;
      const adjustment = Math.round(remaining * proportion);
      newAllocation[k] = Math.max(0, timeAllocation[k] + adjustment);
    }

    // Fix rounding: ensure sum = 100
    const sum = Object.values(newAllocation).reduce((a, b) => a + b, 0);
    if (sum !== 100) {
      // Adjust the largest "other" slider
      const largestOther = otherKeys.reduce((a, b) =>
        newAllocation[a] >= newAllocation[b] ? a : b
      );
      newAllocation[largestOther] += 100 - sum;
    }

    // Clamp all to 0-100
    for (const k of Object.keys(newAllocation) as (keyof TimeAllocation)[]) {
      newAllocation[k] = Math.max(0, Math.min(100, newAllocation[k]));
    }

    setTimeAllocation(newAllocation);
  };

  // Automation opportunity = supervised + autonomous %
  const automationOpportunity = timeAllocation.supervisedPct + timeAllocation.autonomousPct;

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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ─── Sankey Diagram (3 cols) ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 glass-panel rounded-lg p-4"
        >
          <SankeyDiagram allocation={timeAllocation} height={240} />

          {/* Automation Opportunity callout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 flex items-center justify-center gap-3 p-3 rounded-lg"
            style={{ backgroundColor: '#14B8A620' }}
          >
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Automation Opportunity:</span>
            <AnimatedNumber value={automationOpportunity} format="percent" className="text-lg font-bold text-[#14B8A6]" />
            <span className="text-[10px] text-muted-foreground">of team hours could be agent-assisted</span>
          </motion.div>
        </motion.div>

        {/* ─── Sliders (2 cols) ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-4"
        >
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Current Time Allocation
          </h4>
          <p className="text-[9px] text-muted-foreground/70 mb-4">
            How does your team currently spend their time across these autonomy tiers? Adjust the sliders — they always sum to 100%.
          </p>

          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.key}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="glass-panel rounded-lg p-3"
              style={{ borderLeft: `3px solid ${tier.color}` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{tier.icon}</span>
                  <span className="text-[10px] font-semibold" style={{ color: tier.color }}>{tier.label}</span>
                </div>
                <span className="text-xs font-bold" style={{ color: tier.color }}>
                  {timeAllocation[tier.key]}%
                </span>
              </div>
              <Slider
                value={[timeAllocation[tier.key]]}
                min={0}
                max={100}
                step={5}
                onValueChange={([v]) => handleSliderChange(tier.key, v)}
                className={`[&_[data-slot=slider-thumb]]:border-[${tier.color}]`}
                style={{ '--slider-color': tier.color } as React.CSSProperties}
              />
            </motion.div>
          ))}

          {/* Value preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4 p-3 rounded-lg glass-panel text-center"
          >
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">Estimated Annual Time Savings</p>
            <AnimatedNumber value={outputs.timeSavingsAnnual} format="currency" className="text-lg font-bold text-[#14B8A6]" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
