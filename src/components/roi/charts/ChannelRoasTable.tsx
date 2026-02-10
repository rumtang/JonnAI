'use client';

import { motion } from 'framer-motion';
import type { ChannelRoasEntry } from '@/lib/roi/engine';

interface ChannelRoasTableProps {
  channels: ChannelRoasEntry[];
}

export default function ChannelRoasTable({ channels }: ChannelRoasTableProps) {
  // Find max ROAS to scale the bars
  const maxRoas = Math.max(...channels.map(c => Math.max(c.currentRoas, c.aiOptimizedRoas)));

  return (
    <div className="space-y-1.5">
      {/* Header row */}
      <div className="grid grid-cols-[1fr_60px_60px_80px] gap-2 text-[8px] text-muted-foreground uppercase tracking-wider px-1">
        <span>Channel</span>
        <span className="text-right">Current</span>
        <span className="text-right">AI-Optimized</span>
        <span className="text-right">Lift</span>
      </div>

      {/* Channel rows */}
      {channels.map((ch, i) => {
        const barWidthCurrent = maxRoas > 0 ? (ch.currentRoas / maxRoas) * 100 : 0;
        const barWidthAi = maxRoas > 0 ? (ch.aiOptimizedRoas / maxRoas) * 100 : 0;

        return (
          <motion.div
            key={ch.channel}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="grid grid-cols-[1fr_60px_60px_80px] gap-2 items-center px-1 py-1 rounded hover:bg-muted-foreground/5 transition-colors"
          >
            <span className="text-[9px] text-foreground truncate">{ch.channel}</span>

            <span className="text-[9px] text-right font-semibold text-muted-foreground">
              {ch.currentRoas.toFixed(1)}x
            </span>

            <span className="text-[9px] text-right font-semibold text-[#14B8A6]">
              {ch.aiOptimizedRoas.toFixed(1)}x
            </span>

            <div className="flex items-center gap-1.5 justify-end">
              {/* Mini bar showing lift */}
              <div className="w-10 h-2 rounded-full bg-muted-foreground/10 overflow-hidden relative">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundColor: '#D4856A' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidthCurrent}%` }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
                />
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundColor: '#14B8A6', opacity: 0.7 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidthAi}%` }}
                  transition={{ delay: 0.35 + i * 0.05, duration: 0.3 }}
                />
              </div>
              <span className="text-[8px] font-semibold text-[#4CAF50]">
                +{ch.liftPct}%
              </span>
            </div>
          </motion.div>
        );
      })}

      {/* Attribution note */}
      <p className="text-[7px] text-muted-foreground/40 italic px-1 pt-1">
        Note: Platform-reported ROAS typically inflated 20-40% due to attribution overlap
      </p>
    </div>
  );
}
