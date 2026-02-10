'use client';

import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { useRoiStore } from '@/lib/store/roi-store';
import PieChart from '../charts/PieChart';
import AnimatedNumber from '../charts/AnimatedNumber';
import type { RoiStep } from '@/data/roi-steps';

interface SankeySlideProps {
  step: RoiStep;
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
export default function SankeySlide({ step }: SankeySlideProps) {
  const ops = useRoiStore(s => s.ops);
  const pain = useRoiStore(s => s.pain);
  const setOps = useRoiStore(s => s.setOps);
  const setPain = useRoiStore(s => s.setPain);
  const outputs = useRoiStore(s => s.outputs);

  const { currentAllocation } = outputs;

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
        {/* ─── Left: Pie Chart (3 cols) ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 glass-panel rounded-lg p-4"
        >
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 text-center">
            Team Time Allocation
          </h4>

          <div className="flex justify-center">
            <PieChart
              slices={currentAllocation}
              size={200}
              strokeWidth={28}
              delay={0.2}
              label="Current State"
            />
          </div>

          {/* Admin overhead callout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 flex items-center justify-center gap-3 p-3 rounded-lg"
            style={{ backgroundColor: '#ef444420' }}
          >
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Admin Overhead:
            </span>
            <AnimatedNumber
              value={pain.adminTimePct}
              format="percent"
              className="text-lg font-bold text-[#ef4444]"
            />
            <span className="text-[10px] text-muted-foreground">of team time</span>
          </motion.div>

          {/* Allocation legend */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {currentAllocation.map((slice) => (
              <div key={slice.label} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-[9px] text-muted-foreground">
                  {slice.label}: {slice.pct}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── Right: Input Cards (2 cols) ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-4"
        >
          {/* Card 1: Content & Campaign Ops */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-lg p-4"
            style={{ borderLeft: '3px solid #C9A04E' }}
          >
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <span>📊</span> Content & Campaign Ops
            </h4>
            <div className="space-y-3">
              <SliderRow
                label="Monthly Campaigns"
                value={ops.monthlyCampaigns}
                min={10}
                max={500}
                step={10}
                onChange={(v) => setOps({ monthlyCampaigns: v })}
                color="#C9A04E"
                benchmark="Enterprise scale: 50-200/month"
              />
              <SliderRow
                label="Monthly Content Assets"
                value={ops.monthlyContentAssets}
                min={50}
                max={2000}
                step={50}
                onChange={(v) => setOps({ monthlyContentAssets: v })}
                color="#C9A04E"
                benchmark="Enterprise content framework: 200-800"
              />
              <SliderRow
                label="Avg Campaign Cycle (weeks)"
                value={ops.avgCampaignCycleWeeks}
                min={2}
                max={12}
                step={1}
                onChange={(v) => setOps({ avgCampaignCycleWeeks: v })}
                color="#C9A04E"
                benchmark="Enterprise with reviews: 4-8 weeks"
              />
              <SliderRow
                label="Active Channels"
                value={ops.channelCount}
                min={3}
                max={20}
                step={1}
                onChange={(v) => setOps({ channelCount: v })}
                color="#C9A04E"
                benchmark="Enterprise omnichannel: 8-15"
              />
              <SliderRow
                label="Agency Spend (% of Budget)"
                value={ops.agencyPctOfBudget}
                min={5}
                max={30}
                step={1}
                format={(v) => `${v}%`}
                onChange={(v) => setOps({ agencyPctOfBudget: v })}
                color="#C9A04E"
                benchmark="Industry standard: 10-20%"
              />
            </div>
          </motion.div>

          {/* Card 2: Operational Pain */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-lg p-4"
            style={{ borderLeft: '3px solid #D4856A' }}
          >
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <span>⚠️</span> Operational Pain
            </h4>
            <div className="space-y-3">
              <SliderRow
                label="Rework Rate"
                value={pain.reworkRatePct}
                min={5}
                max={40}
                step={1}
                format={(v) => `${v}%`}
                onChange={(v) => setPain({ reworkRatePct: v })}
                color="#D4856A"
                benchmark="Brand consistency research: 20%"
              />
              <SliderRow
                label="Approval Cycle (days)"
                value={pain.approvalCycleDays}
                min={1}
                max={20}
                step={1}
                onChange={(v) => setPain({ approvalCycleDays: v })}
                color="#D4856A"
                benchmark="Enterprise with compliance: 5-10 days"
              />
              <SliderRow
                label="Admin Time"
                value={pain.adminTimePct}
                min={30}
                max={80}
                step={5}
                format={(v) => `${v}%`}
                onChange={(v) => setPain({ adminTimePct: v })}
                color="#D4856A"
                benchmark="Salesforce: 60% on admin tasks"
              />
              <SliderRow
                label="Marketing Waste Rate"
                value={pain.marketingWasteRatePct}
                min={10}
                max={50}
                step={1}
                format={(v) => `${v}%`}
                onChange={(v) => setPain({ marketingWasteRatePct: v })}
                color="#D4856A"
                benchmark="Mid-range of 26-60% estimates"
              />
              <SliderRow
                label="Manual Attribution"
                value={pain.manualAttributionPct}
                min={10}
                max={60}
                step={1}
                format={(v) => `${v}%`}
                onChange={(v) => setPain({ manualAttributionPct: v })}
                color="#D4856A"
                benchmark="Salesforce: 33% rely on manual"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
