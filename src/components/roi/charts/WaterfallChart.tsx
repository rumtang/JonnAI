'use client';

import { motion } from 'framer-motion';
import AnimatedBar from './AnimatedBar';
import AnimatedNumber from './AnimatedNumber';
import type { WaterfallSegment } from '@/lib/roi/engine';

interface WaterfallChartProps {
  segments: WaterfallSegment[];
  totalLabel?: string;
  height?: number;
}

// Waterfall chart: stacked cost breakdown with running total connector
export default function WaterfallChart({
  segments, totalLabel = 'Total Annual Cost', height = 260,
}: WaterfallChartProps) {
  if (segments.length === 0) return null;

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const maxValue = Math.max(total, ...segments.map(s => s.value));

  // Layout constants
  const marginLeft = 10;
  const marginRight = 10;
  const marginTop = 30;
  const marginBottom = 50;
  const chartWidth = 440;
  const chartHeight = height - marginTop - marginBottom;
  const svgWidth = chartWidth + marginLeft + marginRight;

  // Include total bar at end
  const allBars = [...segments, { label: totalLabel, value: total, color: '#14B8A6' }];
  const barCount = allBars.length;
  const barWidth = Math.min(40, (chartWidth - 20) / barCount - 8);
  const gap = (chartWidth - barWidth * barCount) / (barCount + 1);

  // Running total for waterfall connector
  let runningTotal = 0;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width="100%"
        viewBox={`0 0 ${svgWidth} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Axis line */}
        <line
          x1={marginLeft} y1={marginTop + chartHeight}
          x2={marginLeft + chartWidth} y2={marginTop + chartHeight}
          stroke="currentColor" strokeWidth={0.5} className="text-muted-foreground/20"
        />

        {allBars.map((bar, i) => {
          const isTotal = i === allBars.length - 1;
          const barHeight = (bar.value / maxValue) * chartHeight * 0.85;
          const x = marginLeft + gap + i * (barWidth + gap);
          const y = marginTop + chartHeight - barHeight;

          // Connector line from previous bar to this one
          const prevTotal = runningTotal;
          if (!isTotal) runningTotal += bar.value;

          return (
            <g key={bar.label}>
              <AnimatedBar
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                color={bar.color}
                delay={0.1 + i * 0.08}
                rx={3}
              />
              {/* Value label */}
              <motion.text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize={8}
                fontWeight={700}
                fill={bar.color}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                {bar.value >= 1_000_000
                  ? `$${(bar.value / 1_000_000).toFixed(1)}M`
                  : bar.value >= 1_000
                  ? `$${(bar.value / 1_000).toFixed(0)}K`
                  : `$${bar.value}`}
              </motion.text>
              {/* Label */}
              <motion.text
                x={x + barWidth / 2}
                y={marginTop + chartHeight + 12}
                textAnchor="middle"
                fontSize={7}
                fill="currentColor"
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.08 }}
              >
                {bar.label.length > 10 ? bar.label.slice(0, 10) + '...' : bar.label}
              </motion.text>
              {/* Connector line between bars (not for first or total) */}
              {i > 0 && !isTotal && (
                <motion.line
                  x1={x - gap / 2}
                  y1={marginTop + chartHeight - (prevTotal / maxValue) * chartHeight * 0.85}
                  x2={x}
                  y2={marginTop + chartHeight - (prevTotal / maxValue) * chartHeight * 0.85}
                  stroke="currentColor"
                  strokeWidth={0.5}
                  strokeDasharray="3 2"
                  className="text-muted-foreground/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Total summary below */}
      <div className="flex items-center justify-center gap-2 mt-2">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Annual Cost:</span>
        <AnimatedNumber value={total} format="currency" className="text-sm font-bold text-[#14B8A6]" />
      </div>
    </div>
  );
}
