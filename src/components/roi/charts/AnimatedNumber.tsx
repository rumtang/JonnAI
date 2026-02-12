'use client';

import { useEffect, useRef } from 'react';
import { useMotionValue, useTransform, animate, motion } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  format?: 'currency' | 'percent' | 'months' | 'number';
  className?: string;
  duration?: number;
}

// Smooth animated counter that interpolates between values
export default function AnimatedNumber({
  value, format = 'number', className = '', duration = 0.8,
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(0);
  const controlRef = useRef<ReturnType<typeof animate> | null>(null);

  const display = useTransform(motionValue, (v) => {
    switch (format) {
      case 'currency':
        if (Math.abs(v) >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
        if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
        if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
        return `$${Math.round(v).toLocaleString()}`;
      case 'percent':
        return `${Math.abs(v) >= 100 ? Math.round(v).toLocaleString() : v.toFixed(1)}%`;
      case 'months':
        return `${Math.round(v)} mo`;
      case 'number':
      default:
        return Math.round(v).toLocaleString();
    }
  });

  useEffect(() => {
    // Cancel any running animation before starting a new one
    if (controlRef.current) controlRef.current.stop();
    controlRef.current = animate(motionValue, value, { duration, ease: 'easeOut' });
    return () => { if (controlRef.current) controlRef.current.stop(); };
  }, [value, motionValue, duration]);

  return <motion.span className={className}>{display}</motion.span>;
}
