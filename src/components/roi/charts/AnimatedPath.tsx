'use client';

import { motion } from 'framer-motion';

interface AnimatedPathProps {
  d: string;
  stroke: string;
  strokeWidth?: number;
  fill?: string;
  fillOpacity?: number;
  delay?: number;
  duration?: number;
  dashed?: boolean;
}

export default function AnimatedPath({
  d, stroke, strokeWidth = 2, fill = 'none', fillOpacity = 1,
  delay = 0, duration = 1.2, dashed = false,
}: AnimatedPathProps) {
  return (
    <motion.path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      fillOpacity={fillOpacity}
      strokeLinecap="round"
      strokeDasharray={dashed ? '6 4' : undefined}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay, duration, ease: 'easeInOut' }}
    />
  );
}
