'use client';

import { motion } from 'framer-motion';

interface AnimatedBarProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  delay?: number;
  label?: string;
  labelColor?: string;
  rx?: number;
}

export default function AnimatedBar({
  x, y, width, height, color, delay = 0, label, labelColor, rx = 4,
}: AnimatedBarProps) {
  return (
    <g>
      <motion.rect
        x={x}
        y={y + height}
        width={width}
        rx={rx}
        fill={color}
        initial={{ height: 0, y: y + height }}
        animate={{ height, y }}
        transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      />
      {label && (
        <motion.text
          x={x + width / 2}
          y={y - 6}
          textAnchor="middle"
          fill={labelColor ?? color}
          fontSize={9}
          fontWeight={600}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.4 }}
        >
          {label}
        </motion.text>
      )}
    </g>
  );
}
