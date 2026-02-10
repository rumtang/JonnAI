'use client';

import { motion } from 'framer-motion';

interface Slice {
  label: string;
  pct: number;
  color: string;
}

interface PieChartProps {
  slices: Slice[];
  size?: number;
  strokeWidth?: number;
  delay?: number;
  label?: string;
}

// SVG donut chart using stroke-dasharray technique
export default function PieChart({
  slices, size = 100, strokeWidth = 16, delay = 0, label,
}: PieChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Build cumulative offsets
  let cumulative = 0;
  const segments = slices.filter(s => s.pct > 0).map((slice) => {
    const dashLength = (slice.pct / 100) * circumference;
    const gapLength = circumference - dashLength;
    const offset = -(cumulative / 100) * circumference;
    cumulative += slice.pct;
    return { ...slice, dashLength, gapLength, offset };
  });

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background track */}
        <circle
          cx={center} cy={center} r={radius}
          fill="none" stroke="currentColor" strokeWidth={strokeWidth}
          className="text-muted-foreground/10"
        />
        {/* Segments */}
        {segments.map((seg, i) => (
          <motion.circle
            key={seg.label}
            cx={center} cy={center} r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${seg.dashLength} ${seg.gapLength}`}
            strokeDashoffset={seg.offset}
            transform={`rotate(-90 ${center} ${center})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + i * 0.1, duration: 0.5 }}
          />
        ))}
      </svg>
      {label && (
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      )}
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
        {slices.filter(s => s.pct > 0).map((s) => (
          <div key={s.label} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-[8px] text-muted-foreground">{s.label} {s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
