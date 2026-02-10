'use client';

import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { useRoiStore } from '@/lib/store/roi-store';
import WaterfallChart from '../charts/WaterfallChart';
import AnimatedNumber from '../charts/AnimatedNumber';
import type { RoiStep } from '@/data/roi-steps';

interface BaselineInputsSlideProps {
  step: RoiStep;
}

// Formatted display for slider values
function formatCurrency(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
  color?: string;
}

function SliderRow({ label, value, min, max, step = 1, format, onChange, color = '#14B8A6' }: SliderRowProps) {
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
    </div>
  );
}

export default function BaselineInputsSlide({ step }: BaselineInputsSlideProps) {
  const team = useRoiStore(s => s.team);
  const volume = useRoiStore(s => s.volume);
  const pain = useRoiStore(s => s.pain);
  const hidden = useRoiStore(s => s.hidden);
  const baseline = useRoiStore(s => s.baseline);
  const setTeam = useRoiStore(s => s.setTeam);
  const setVolume = useRoiStore(s => s.setVolume);
  const setPain = useRoiStore(s => s.setPain);
  const setHidden = useRoiStore(s => s.setHidden);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Team Profile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-lg p-4"
            style={{ borderLeft: '3px solid #5B9ECF' }}
          >
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <span>👥</span> Team Profile
            </h4>
            <div className="space-y-3">
              <SliderRow label="Headcount" value={team.headcount} min={5} max={50} onChange={(v) => setTeam({ headcount: v })} color="#5B9ECF" />
              <SliderRow label="Avg Salary" value={team.avgSalary} min={60000} max={250000} step={5000} format={formatCurrency} onChange={(v) => setTeam({ avgSalary: v })} color="#5B9ECF" />
              <SliderRow label="Managers" value={team.managerCount} min={1} max={10} onChange={(v) => setTeam({ managerCount: v })} color="#5B9ECF" />
              <SliderRow label="Specialists" value={team.specialistCount} min={1} max={20} onChange={(v) => setTeam({ specialistCount: v })} color="#5B9ECF" />
            </div>
          </motion.div>

          {/* Campaign Volume */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-lg p-4"
            style={{ borderLeft: '3px solid #C9A04E' }}
          >
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <span>📊</span> Campaign Volume
            </h4>
            <div className="space-y-3">
              <SliderRow label="Monthly Campaigns" value={volume.monthlyCampaigns} min={1} max={50} onChange={(v) => setVolume({ monthlyCampaigns: v })} color="#C9A04E" />
              <SliderRow label="Avg Cycle (days)" value={volume.avgCycleTimeDays} min={5} max={60} onChange={(v) => setVolume({ avgCycleTimeDays: v })} color="#C9A04E" />
              <SliderRow label="Channels" value={volume.channelCount} min={1} max={12} onChange={(v) => setVolume({ channelCount: v })} color="#C9A04E" />
            </div>
          </motion.div>

          {/* Current Pain */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-lg p-4"
            style={{ borderLeft: '3px solid #D4856A' }}
          >
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <span>⚠️</span> Current Pain Points
            </h4>
            <div className="space-y-3">
              <SliderRow label="Rework Rate" value={pain.reworkRatePct} min={0} max={50} format={(v) => `${v}%`} onChange={(v) => setPain({ reworkRatePct: v })} color="#D4856A" />
              <SliderRow label="Approval Bottleneck (days)" value={pain.approvalBottleneckDays} min={0} max={14} onChange={(v) => setPain({ approvalBottleneckDays: v })} color="#D4856A" />
              <SliderRow label="Compliance Review (hrs)" value={pain.complianceReviewHours} min={0} max={40} onChange={(v) => setPain({ complianceReviewHours: v })} color="#D4856A" />
            </div>
          </motion.div>

          {/* Hidden Costs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel rounded-lg p-4"
            style={{ borderLeft: '3px solid #9B7ACC' }}
          >
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <span>💸</span> Hidden Costs
            </h4>
            <div className="space-y-3">
              <SliderRow label="Agency Spend / mo" value={hidden.monthlyAgencySpend} min={0} max={200000} step={5000} format={formatCurrency} onChange={(v) => setHidden({ monthlyAgencySpend: v })} color="#9B7ACC" />
              <SliderRow label="Overlapping Tools" value={hidden.toolOverlapCount} min={0} max={10} onChange={(v) => setHidden({ toolOverlapCount: v })} color="#9B7ACC" />
              <SliderRow label="Missed Deadline Cost / mo" value={hidden.missedDeadlineCostPerMonth} min={0} max={100000} step={1000} format={formatCurrency} onChange={(v) => setHidden({ missedDeadlineCostPerMonth: v })} color="#9B7ACC" />
            </div>
          </motion.div>
        </div>

        {/* ─── Right: Waterfall Chart ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-lg p-4"
        >
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <span>📈</span> Where Your Money Goes
          </h4>
          <WaterfallChart segments={baseline.waterfall} />

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-muted-foreground/10">
            <div className="text-center">
              <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Team Cost</p>
              <AnimatedNumber value={baseline.annualTeamCost} format="currency" className="text-sm font-bold text-[#5B9ECF]" />
            </div>
            <div className="text-center">
              <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Waste</p>
              <AnimatedNumber
                value={baseline.annualReworkCost + baseline.annualBottleneckCost + baseline.annualMissedDeadlineCost}
                format="currency"
                className="text-sm font-bold text-[#D4856A]"
              />
            </div>
            <div className="text-center">
              <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Total</p>
              <AnimatedNumber value={baseline.totalAnnualCost} format="currency" className="text-sm font-bold text-[#14B8A6]" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
