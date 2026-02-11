'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useRoiStore } from '@/lib/store/roi-store';
import {
  TRANSFORMATION_ACTIONS,
  VALUE_STREAM_LABELS,
  VALUE_STREAM_COLORS,
  type TransformationAction,
} from '@/data/roi-actions';
import type { RoiStep } from '@/data/roi-steps';

interface PlaybookSlideProps {
  step: RoiStep;
}

// ─── Format Helpers ─────────────────────────────────────────────────
function formatCompact(v: number): string {
  if (Math.abs(v) >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${Math.round(v).toLocaleString()}`;
}

// ─── Action Card ────────────────────────────────────────────────────
function ActionCard({
  action,
  valueStreams,
  streamPrimaryCounts,
  delay,
}: {
  action: TransformationAction;
  valueStreams: Record<string, number>;
  streamPrimaryCounts: Record<string, number>;
  delay: number;
}) {
  const [expanded, setExpanded] = useState(false);

  // Compute this action's proportional share of its primary streams
  // (split evenly among all actions that claim the same stream as primary)
  const primaryTotal = action.valueStreams
    .filter(vs => vs.contribution === 'primary')
    .reduce((sum, vs) => {
      const count = streamPrimaryCounts[vs.streamKey] ?? 1;
      return sum + (valueStreams[vs.streamKey] ?? 0) / count;
    }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="glass-panel rounded-lg overflow-hidden"
      style={{ borderLeft: `3px solid ${action.color}` }}
    >
      {/* Card Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-3 hover:bg-muted-foreground/5 transition-colors"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg flex-shrink-0">{action.icon}</span>
            <div className="min-w-0">
              <h4 className="text-[11px] font-semibold text-foreground leading-tight">
                {action.title}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-muted-foreground/10 text-muted-foreground">
                  {action.kgLayer}
                </span>
                <span className="text-[8px] text-muted-foreground/50">
                  {action.buildWeeks}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {primaryTotal > 0 && (
              <span className="text-[10px] font-bold" style={{ color: action.color }}>
                {formatCompact(primaryTotal)}
              </span>
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 text-muted-foreground/40 transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </div>
        </div>

        {/* Brief summary */}
        <p className="text-[9px] text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
          {action.whatYouBuild}
        </p>

        {/* Before → After */}
        <div className="mt-2 flex items-start gap-1.5 text-[8px]">
          <span className="text-[#ef4444] font-medium flex-shrink-0">Before:</span>
          <span className="text-muted-foreground/70 line-clamp-1">{action.before}</span>
        </div>
        <div className="flex items-start gap-1.5 text-[8px] mt-0.5">
          <span className="text-[#14B8A6] font-medium flex-shrink-0">After:</span>
          <span className="text-muted-foreground/70 line-clamp-1">{action.after}</span>
        </div>

        {/* Value stream pills */}
        <div className="flex flex-wrap gap-1 mt-2">
          {action.valueStreams.map(vs => (
            <span
              key={vs.streamKey}
              className="text-[7px] px-1.5 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: `${VALUE_STREAM_COLORS[vs.streamKey]}15`,
                color: VALUE_STREAM_COLORS[vs.streamKey],
                opacity: vs.contribution === 'primary' ? 1 : 0.6,
              }}
            >
              {VALUE_STREAM_LABELS[vs.streamKey]}
              {vs.contribution === 'primary' && valueStreams[vs.streamKey] > 0
                ? ` · ${formatCompact(valueStreams[vs.streamKey] / (streamPrimaryCounts[vs.streamKey] ?? 1))}`
                : ''}
            </span>
          ))}
        </div>
      </button>

      {/* Expanded Detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1 border-t border-muted-foreground/10 space-y-2">
              {/* Deliverables */}
              <div>
                <p className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  What Gets Built
                </p>
                <ul className="space-y-0.5">
                  {action.deliverables.map((d, i) => (
                    <li key={i} className="text-[8px] text-muted-foreground/80 flex items-start gap-1.5">
                      <span className="text-[6px] mt-0.5" style={{ color: action.color }}>●</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mechanism */}
              <div>
                <p className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  How It Works
                </p>
                <p className="text-[8px] text-muted-foreground/80 leading-relaxed italic">
                  {action.mechanism}
                </p>
              </div>

              {/* Per-stream breakdown */}
              <div>
                <p className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Value Stream Impact
                </p>
                <div className="space-y-1">
                  {action.valueStreams.map(vs => (
                    <div key={vs.streamKey} className="flex items-start gap-2 text-[8px]">
                      <span
                        className="font-semibold flex-shrink-0 min-w-[60px]"
                        style={{ color: VALUE_STREAM_COLORS[vs.streamKey] }}
                      >
                        {VALUE_STREAM_LABELS[vs.streamKey]}
                      </span>
                      <span className="text-muted-foreground/70">{vs.mechanism}</span>
                      {valueStreams[vs.streamKey] > 0 && (
                        <span
                          className="flex-shrink-0 font-semibold ml-auto"
                          style={{ color: VALUE_STREAM_COLORS[vs.streamKey] }}
                        >
                          {vs.contribution === 'primary'
                            ? formatCompact(valueStreams[vs.streamKey] / (streamPrimaryCounts[vs.streamKey] ?? 1))
                            : formatCompact(valueStreams[vs.streamKey])}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Slide ─────────────────────────────────────────────────────
export default function PlaybookSlide({ step }: PlaybookSlideProps) {
  const vs = useRoiStore(s => s.outputs.valueStreams);
  const totalAnnualValue = useRoiStore(s => s.outputs.totalAnnualValue);

  // Flatten value streams into a plain record for easy lookup
  const vsRecord: Record<string, number> = {
    roasImprovement: vs.roasImprovement,
    personalizationLift: vs.personalizationLift,
    campaignSpeed: vs.campaignSpeed,
    martechOptimization: vs.martechOptimization,
    contentVelocity: vs.contentVelocity,
    operationalEfficiency: vs.operationalEfficiency,
    attributionImprovement: vs.attributionImprovement,
  };

  // Count how many actions claim each stream as primary so we can split evenly
  const streamPrimaryCounts: Record<string, number> = {};
  for (const action of TRANSFORMATION_ACTIONS) {
    for (const avs of action.valueStreams) {
      if (avs.contribution === 'primary') {
        streamPrimaryCounts[avs.streamKey] = (streamPrimaryCounts[avs.streamKey] ?? 0) + 1;
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
      {/* Tagline */}
      {step.content.tagline && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground text-center mb-3 max-w-3xl mx-auto italic"
        >
          &ldquo;{step.content.tagline}&rdquo;
        </motion.p>
      )}

      {/* Total value callout */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-4"
      >
        <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
          These 7 actions unlock
        </p>
        <p className="text-2xl font-bold text-[#14B8A6]">
          {formatCompact(totalAnnualValue)}<span className="text-sm font-normal text-muted-foreground">/year</span>
        </p>
      </motion.div>

      {/* Action cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {TRANSFORMATION_ACTIONS.map((action, i) => (
          <ActionCard
            key={action.id}
            action={action}
            valueStreams={vsRecord}
            streamPrimaryCounts={streamPrimaryCounts}
            delay={0.15 + i * 0.08}
          />
        ))}
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap justify-center gap-3 mt-4 text-[8px] text-muted-foreground/50"
      >
        <span>Click any card to see full details</span>
        <span>·</span>
        <span>Dollar values update as you change inputs</span>
        <span>·</span>
        <span>Weeks reference the Build It implementation timeline</span>
      </motion.div>
    </div>
  );
}
