'use client';

import { motion } from 'framer-motion';

// Generic allocation interface — decoupled from engine types
interface AllocationEntry {
  label: string;
  pct: number;
  color: string;
}

interface SankeyDiagramProps {
  allocation: AllocationEntry[];
  height?: number;
}

// Simplified Sankey: single source bar → N destination bars with bezier paths
export default function SankeyDiagram({ allocation, height = 220 }: SankeyDiagramProps) {
  const svgWidth = 500;
  const marginX = 20;
  const sourceX = marginX;
  const destX = svgWidth - marginX - 80;
  const barWidth = 24;
  const usableHeight = height - 40;
  const topMargin = 20;

  // Source bar
  const sourceHeight = usableHeight;
  const sourceY = topMargin;

  // Filter out zero-pct entries
  const entries = allocation.filter(e => e.pct > 0);

  // Destination bars — sized proportionally
  let destCumulative = 0;
  const destBars = entries.map((entry) => {
    const barH = Math.max(4, (entry.pct / 100) * usableHeight);
    const y = topMargin + destCumulative;
    destCumulative += barH + 4;
    return { ...entry, y, height: barH };
  });

  // Scale destination bars to fit
  const totalDestHeight = destBars.reduce((sum, b) => sum + b.height + 4, 0) - 4;
  const scale = usableHeight / totalDestHeight;
  let scaledCum = 0;
  const scaledBars = destBars.map((b) => {
    const h = b.height * scale;
    const y = topMargin + scaledCum;
    scaledCum += h + 4 * scale;
    return { ...b, y, height: h };
  });

  // Bezier paths from source to each destination
  let sourceCum = 0;
  const paths = scaledBars.map((bar) => {
    const sourceH = (bar.pct / 100) * sourceHeight;
    const sourceStartY = sourceY + sourceCum;
    sourceCum += sourceH;

    const x1 = sourceX + barWidth;
    const x2 = destX;
    const midX = (x1 + x2) / 2;

    // Top edge path
    const topPath = `M ${x1},${sourceStartY} C ${midX},${sourceStartY} ${midX},${bar.y} ${x2},${bar.y}`;
    // Combined filled path
    const d = `${topPath} L ${x2},${bar.y + bar.height} C ${midX},${bar.y + bar.height} ${midX},${sourceStartY + sourceH} ${x1},${sourceStartY + sourceH} Z`;

    return { ...bar, d };
  });

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${svgWidth} ${height}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Source bar */}
      <motion.rect
        x={sourceX} y={sourceY}
        width={barWidth} height={sourceHeight}
        rx={4}
        fill="#14B8A6"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        style={{ transformOrigin: `${sourceX + barWidth / 2}px ${sourceY}px` }}
        transition={{ duration: 0.5 }}
      />
      <motion.text
        x={sourceX + barWidth / 2} y={sourceY - 6}
        textAnchor="middle" fontSize={9} fontWeight={700} fill="#14B8A6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Team Hours
      </motion.text>

      {/* Flow paths */}
      {paths.map((p, i) => (
        <motion.path
          key={p.label}
          d={p.d}
          fill={p.color}
          fillOpacity={0.15}
          stroke={p.color}
          strokeWidth={1}
          strokeOpacity={0.4}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
        />
      ))}

      {/* Destination bars + labels */}
      {scaledBars.map((bar, i) => (
        <g key={bar.label}>
          <motion.rect
            x={destX} y={bar.y}
            width={barWidth} height={Math.max(4, bar.height)}
            rx={4}
            fill={bar.color}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            style={{ transformOrigin: `${destX}px ${bar.y + bar.height / 2}px` }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
          />
          <motion.text
            x={destX + barWidth + 8}
            y={bar.y + bar.height / 2 + 3}
            fontSize={9}
            fontWeight={600}
            fill={bar.color}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
          >
            {bar.label}
          </motion.text>
          <motion.text
            x={destX + barWidth + 8}
            y={bar.y + bar.height / 2 + 14}
            fontSize={8}
            fill="currentColor"
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 + i * 0.1 }}
          >
            {bar.pct}%
          </motion.text>
        </g>
      ))}
    </svg>
  );
}
