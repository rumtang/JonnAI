'use client';

import { motion } from 'framer-motion';
import { useRoiStore } from '@/lib/store/roi-store';
import AnimatedPath from '../charts/AnimatedPath';
import AnimatedNumber from '../charts/AnimatedNumber';
import type { RoiStep } from '@/data/roi-steps';
import type { Scenario } from '@/lib/roi/engine';

interface TimelineSlideProps {
  step: RoiStep;
}

const SCENARIO_LABELS: Record<Scenario, { label: string; color: string }> = {
  conservative: { label: 'Conservative', color: '#f59e0b' },
  expected: { label: 'Expected', color: '#14B8A6' },
  aggressive: { label: 'Aggressive', color: '#4CAF50' },
};

// Build SVG path data from timeline points
function buildLinePath(
  points: { month: number; value: number }[],
  xScale: (m: number) => number,
  yScale: (v: number) => number,
): string {
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.month)},${yScale(p.value)}`)
    .join(' ');
}

export default function TimelineSlide({ step }: TimelineSlideProps) {
  const outputs = useRoiStore(s => s.outputs);
  const activeScenario = useRoiStore(s => s.activeScenario);
  const setActiveScenario = useRoiStore(s => s.setActiveScenario);

  const { timeline, breakEvenMonth, totalInvestment, implementationWeeks, doNothing } = outputs;

  // Build phase in months — derived from user-configurable implementation weeks
  const buildMonths = Math.ceil(implementationWeeks / 4.33);

  // Chart dimensions
  const svgWidth = 600;
  const svgHeight = 300;
  const margin = { top: 30, right: 40, bottom: 50, left: 60 };
  const chartW = svgWidth - margin.left - margin.right;
  const chartH = svgHeight - margin.top - margin.bottom;

  // Find max value for Y scale
  const maxVal = Math.max(
    totalInvestment,
    ...timeline.map(p => Math.max(p.valueAggressive, p.investmentCumulative))
  ) * 1.1;

  const xScale = (month: number) => margin.left + (month / 36) * chartW;
  const yScale = (value: number) => margin.top + chartH - (value / maxVal) * chartH;

  // Build path data
  const investmentPath = buildLinePath(
    timeline.map(p => ({ month: p.month, value: p.investmentCumulative })),
    xScale, yScale,
  );

  const conservativePath = buildLinePath(
    timeline.map(p => ({ month: p.month, value: p.valueConservative })),
    xScale, yScale,
  );

  const expectedPath = buildLinePath(
    timeline.map(p => ({ month: p.month, value: p.valueExpected })),
    xScale, yScale,
  );

  const aggressivePath = buildLinePath(
    timeline.map(p => ({ month: p.month, value: p.valueAggressive })),
    xScale, yScale,
  );

  // Do-nothing baseline: cumulative quarterly erosion shown as negative/declining line
  // Interpolate the quarterly losses across months for smooth rendering
  const doNothingPoints = timeline.map(p => {
    const quarter = p.month / 3; // fractional quarter
    if (quarter <= 0) return { month: p.month, value: 0 };
    const qFloor = Math.min(Math.floor(quarter) - 1, 7);
    const qCeil = Math.min(qFloor + 1, 7);
    const qFrac = quarter - Math.floor(quarter);
    const floorVal = qFloor >= 0 ? (doNothing.quarterlyLosses[qFloor] ?? 0) : 0;
    const ceilVal = doNothing.quarterlyLosses[qCeil] ?? floorVal;
    return { month: p.month, value: floorVal + (ceilVal - floorVal) * qFrac };
  });

  const doNothingPath = buildLinePath(doNothingPoints, xScale, yScale);

  // Confidence band (area between conservative and aggressive)
  const bandPath =
    timeline.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.month)},${yScale(p.valueAggressive)}`).join(' ') +
    ' ' +
    [...timeline].reverse().map((p, i) => `${i === 0 ? 'L' : 'L'} ${xScale(p.month)},${yScale(p.valueConservative)}`).join(' ') +
    ' Z';

  // Month labels
  const monthLabels = [0, 6, 12, 18, 24, 30, 36];

  // Format for Y axis
  const formatY = (v: number) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
    return `$${v}`;
  };

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

      {/* Scenario toggles */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-2 mb-4"
      >
        {(Object.keys(SCENARIO_LABELS) as Scenario[]).map((s) => {
          const { label, color } = SCENARIO_LABELS[s];
          const isActive = s === activeScenario;
          return (
            <button
              key={s}
              onClick={() => setActiveScenario(s)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all ${
                isActive ? 'shadow-lg' : 'opacity-50 hover:opacity-80'
              }`}
              style={isActive ? { backgroundColor: `${color}20`, color } : { color }}
            >
              {label}
            </button>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ─── Chart (3 cols) ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 glass-panel rounded-lg p-4"
        >
          <svg
            width="100%"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
              const y = margin.top + chartH - pct * chartH;
              return (
                <g key={pct}>
                  <line
                    x1={margin.left} y1={y}
                    x2={margin.left + chartW} y2={y}
                    stroke="currentColor" strokeWidth={0.5}
                    className="text-muted-foreground/10"
                  />
                  <text
                    x={margin.left - 6} y={y + 3}
                    textAnchor="end" fontSize={7}
                    fill="currentColor" className="text-muted-foreground/50"
                  >
                    {formatY(pct * maxVal)}
                  </text>
                </g>
              );
            })}

            {/* Month labels */}
            {monthLabels.map((m) => (
              <text
                key={m}
                x={xScale(m)} y={svgHeight - margin.bottom + 16}
                textAnchor="middle" fontSize={8}
                fill="currentColor" className="text-muted-foreground/60"
              >
                Mo {m}
              </text>
            ))}

            {/* X-axis label */}
            <text
              x={margin.left + chartW / 2} y={svgHeight - 6}
              textAnchor="middle" fontSize={8}
              fill="currentColor" className="text-muted-foreground/40"
            >
              Months
            </text>

            {/* Confidence band */}
            <motion.path
              d={bandPath}
              fill="#14B8A6"
              fillOpacity={0.06}
              stroke="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            />

            {/* Do-nothing baseline (always shown) — cost of inaction */}
            <AnimatedPath d={doNothingPath} stroke="#ef4444" strokeWidth={1.5} delay={0.3} dashed />

            {/* Investment line (always shown) */}
            <AnimatedPath d={investmentPath} stroke="#D4856A" strokeWidth={2.5} delay={0.3} />

            {/* Value lines */}
            {activeScenario === 'conservative' && (
              <AnimatedPath d={conservativePath} stroke="#f59e0b" strokeWidth={2} delay={0.5} />
            )}
            {activeScenario === 'expected' && (
              <AnimatedPath d={expectedPath} stroke="#14B8A6" strokeWidth={2.5} delay={0.5} />
            )}
            {activeScenario === 'aggressive' && (
              <AnimatedPath d={aggressivePath} stroke="#4CAF50" strokeWidth={2} delay={0.5} />
            )}

            {/* Breakeven marker */}
            {breakEvenMonth < 36 && (
              <g>
                <motion.line
                  x1={xScale(breakEvenMonth)} y1={margin.top}
                  x2={xScale(breakEvenMonth)} y2={margin.top + chartH}
                  stroke="#14B8A6" strokeWidth={1.5} strokeDasharray="4 3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 1.2 }}
                />
                <motion.text
                  x={xScale(breakEvenMonth)} y={margin.top - 8}
                  textAnchor="middle" fontSize={8} fontWeight={700} fill="#14B8A6"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                >
                  Breakeven: Month {breakEvenMonth}
                </motion.text>
              </g>
            )}

            {/* Legend */}
            <g transform={`translate(${margin.left + 10}, ${margin.top + 8})`}>
              <rect x={0} y={0} width={8} height={3} rx={1} fill="#D4856A" />
              <text x={12} y={4} fontSize={7} fill="currentColor" className="text-muted-foreground/60">Investment</text>
              <rect x={70} y={0} width={8} height={3} rx={1} fill={SCENARIO_LABELS[activeScenario].color} />
              <text x={82} y={4} fontSize={7} fill="currentColor" className="text-muted-foreground/60">Cumulative Value</text>
              <line x1={170} y1={1.5} x2={178} y2={1.5} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 2" />
              <text x={182} y={4} fontSize={7} fill="currentColor" className="text-muted-foreground/60">Do Nothing (Cost of Inaction)</text>
            </g>

            {/* Build phase marker — uses dynamic implementationWeeks */}
            <motion.rect
              x={xScale(0)} y={margin.top + chartH + 2}
              width={xScale(buildMonths) - xScale(0)} height={4}
              rx={2} fill="#E88D67" fillOpacity={0.3}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              style={{ transformOrigin: `${xScale(0)}px ${margin.top + chartH + 4}px` }}
              transition={{ delay: 0.8, duration: 0.5 }}
            />
            <text
              x={(xScale(0) + xScale(buildMonths)) / 2} y={margin.top + chartH + 14}
              textAnchor="middle" fontSize={6}
              fill="#E88D67" fillOpacity={0.6}
            >
              {implementationWeeks}-Week Build
            </text>
          </svg>
        </motion.div>

        {/* ─── Summary Cards (1 col) ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <div className="glass-panel rounded-lg p-3 text-center" style={{ borderLeft: '3px solid #D4856A' }}>
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">Total Investment</p>
            <AnimatedNumber value={totalInvestment} format="currency" className="text-lg font-bold text-[#D4856A]" />
          </div>

          <div className="glass-panel rounded-lg p-3 text-center" style={{ borderLeft: '3px solid #14B8A6' }}>
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">Breakeven</p>
            <AnimatedNumber value={breakEvenMonth} format="months" className="text-lg font-bold text-[#14B8A6]" />
          </div>

          <div className="glass-panel rounded-lg p-3 text-center" style={{ borderLeft: '3px solid #4CAF50' }}>
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">3-Year ROI</p>
            <AnimatedNumber value={outputs.threeYearRoi} format="percent" className="text-lg font-bold text-[#4CAF50]" />
          </div>

          <div className="glass-panel rounded-lg p-3 text-center" style={{ borderLeft: '3px solid #9B7ACC' }}>
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">Net Present Value</p>
            <AnimatedNumber value={outputs.netPresentValue} format="currency" className="text-lg font-bold text-[#9B7ACC]" />
          </div>

          <div className="glass-panel rounded-lg p-3 text-center" style={{ borderLeft: '3px solid #C9A04E' }}>
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">Annual Value (Full Ramp)</p>
            <AnimatedNumber value={outputs.totalAnnualValue} format="currency" className="text-lg font-bold text-[#C9A04E]" />
          </div>

          {/* IRR card */}
          <div className="glass-panel rounded-lg p-3 text-center" style={{ borderLeft: '3px solid #14B8A6' }}>
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">Internal Rate of Return</p>
            <p className="text-lg font-bold text-[#14B8A6]">
              {isNaN(outputs.irr) ? 'N/A' : `${Math.round(outputs.irr * 100)}%`}
            </p>
          </div>

          {/* ROAS Lift card */}
          <div className="glass-panel rounded-lg p-3 text-center" style={{ borderLeft: '3px solid #E88D67' }}>
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">ROAS Lift</p>
            <p className="text-lg font-bold text-[#E88D67]">
              {outputs.roas.currentRoas.toFixed(1)}:1{' '}
              <span className="text-muted-foreground/60 text-xs font-normal mx-1">&rarr;</span>{' '}
              {outputs.roas.projectedRoas.toFixed(1)}:1
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
