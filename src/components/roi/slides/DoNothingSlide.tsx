'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useRoiStore } from '@/lib/store/roi-store';
import AnimatedNumber from '../charts/AnimatedNumber';
import type { RoiStep } from '@/data/roi-steps';

interface DoNothingSlideProps {
  step: RoiStep;
}

// ─── Format Helpers ──────────────────────────────────────────────────
function formatCurrency(v: number): string {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

// ─── Animated Counter ────────────────────────────────────────────────
// Ticks up from 0 to target value over ~3 seconds
function AnimatedCounter({ target, className }: { target: number; className?: string }) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const duration = 3000; // ms

  useEffect(() => {
    startTimeRef.current = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return <span className={className}>{formatCurrency(value)}</span>;
}

// ─── Main Slide ──────────────────────────────────────────────────────
export default function DoNothingSlide({ step }: DoNothingSlideProps) {
  const outputs = useRoiStore(s => s.outputs);
  const { doNothing } = outputs;

  // 8-quarter data for timeline bars
  const maxLoss = doNothing.quarterlyLosses[7] ?? 1;

  return (
    <div className="max-w-5xl mx-auto px-6 py-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
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

      {/* ─── Hero: Animated Cumulative Erosion Counter ──────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
        className="text-center mb-6"
      >
        <p className="text-[10px] text-[#ef4444] uppercase tracking-wider mb-1 font-semibold">
          3-Year Revenue at Risk
        </p>
        <AnimatedCounter
          target={doNothing.year3Loss}
          className="text-5xl md:text-6xl font-bold text-[#ef4444]"
        />
      </motion.div>

      {/* ─── 8-Quarter Erosion Timeline ────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel rounded-lg p-4 mb-6"
      >
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 text-center">
          Quarterly Cumulative Revenue Erosion
        </h4>
        <div className="flex items-end gap-2 h-32">
          {doNothing.quarterlyLosses.map((loss, i) => {
            const heightPct = maxLoss > 0 ? (loss / maxLoss) * 100 : 0;
            return (
              <motion.div
                key={i}
                className="flex-1 flex flex-col items-center gap-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
              >
                <span className="text-[7px] text-[#ef4444] font-semibold">
                  {formatCurrency(loss)}
                </span>
                <div className="w-full relative" style={{ height: '80px' }}>
                  <motion.div
                    className="absolute bottom-0 w-full rounded-t"
                    style={{ backgroundColor: '#ef4444' }}
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ delay: 0.6 + i * 0.08, duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-[8px] text-muted-foreground">Q{i + 1}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ─── Year Milestone Cards ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        {[
          { label: 'After 1 Year', erosion: doNothing.year1ErosionPct, loss: doNothing.year1Loss },
          { label: 'After 2 Years', erosion: doNothing.year2ErosionPct, loss: doNothing.year2Loss },
          { label: 'After 3 Years', erosion: doNothing.year3ErosionPct, loss: doNothing.year3Loss },
        ].map(({ label, erosion, loss }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + i * 0.1 }}
            className="glass-panel rounded-lg p-3 text-center"
            style={{ borderTop: '3px solid #ef4444' }}
          >
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
            <p className="text-lg font-bold text-[#ef4444]">-{erosion}%</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">
              <AnimatedNumber value={loss} format="currency" className="font-semibold text-[#ef4444]" />
              {' '}at risk
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* ─── Bottom Stat ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="glass-panel rounded-lg p-4 text-center"
        style={{ borderLeft: '4px solid #ef4444' }}
      >
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Organizations that adopt AI-driven marketing </span>
          deliver <span className="text-[#14B8A6] font-bold">79% greater shareholder value</span> than
          those that delay.
        </p>
        <p className="text-[8px] text-muted-foreground/50 mt-1 italic">
          Source: PwC / ANA Digital Maturity Study
        </p>
      </motion.div>
    </div>
  );
}
