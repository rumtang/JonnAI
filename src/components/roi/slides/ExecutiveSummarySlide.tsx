'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, TrendingUp, Clock, DollarSign, BarChart3 } from 'lucide-react';
import { useRoiStore } from '@/lib/store/roi-store';
import AnimatedNumber from '../charts/AnimatedNumber';
import AnimatedBar from '../charts/AnimatedBar';
import type { RoiStep } from '@/data/roi-steps';

interface ExecutiveSummarySlideProps {
  step: RoiStep;
}

// ─── Format Helpers ─────────────────────────────────────────────────
function formatCompact(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${Math.round(v).toLocaleString()}`;
}

// ─── Value Breakdown Bar (7 streams) ────────────────────────────────
function ValueBreakdownBar({ outputs }: { outputs: ReturnType<typeof useRoiStore.getState>['outputs'] }) {
  const vs = outputs.valueStreams;

  const streams = [
    { label: 'ROAS Improvement', value: vs.roasImprovement, color: '#9B7ACC' },
    { label: 'Martech Optimization', value: vs.martechOptimization, color: '#E88D67' },
    { label: 'Content Velocity', value: vs.contentVelocity, color: '#5B9ECF' },
    { label: 'Campaign Speed', value: vs.campaignSpeed, color: '#C9A04E' },
    { label: 'Ops Efficiency', value: vs.operationalEfficiency, color: '#D4856A' },
    { label: 'Attribution', value: vs.attributionImprovement, color: '#f59e0b' },
    { label: 'Personalization', value: vs.personalizationLift, color: '#4CAF50' },
  ];

  const total = streams.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return null;

  // SVG horizontal stacked bar
  const barHeight = 28;
  const svgWidth = 500;
  const svgHeight = 80;

  let xOffset = 0;
  const segments = streams.filter(s => s.value > 0).map((stream) => {
    const width = (stream.value / total) * svgWidth;
    const seg = { ...stream, x: xOffset, width };
    xOffset += width;
    return seg;
  });

  return (
    <div>
      <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-center mb-2">
        Annual Value Breakdown (at Full Ramp)
      </h4>
      <svg
        width="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background */}
        <rect x={0} y={10} width={svgWidth} height={barHeight} rx={6} fill="currentColor" className="text-muted-foreground/10" />

        {/* Segments */}
        {segments.map((seg, i) => (
          <AnimatedBar
            key={seg.label}
            x={seg.x}
            y={10}
            width={seg.width}
            height={barHeight}
            color={seg.color}
            delay={0.8 + i * 0.08}
            rx={i === 0 ? 6 : i === segments.length - 1 ? 6 : 0}
          />
        ))}

        {/* Legend below bar — only show labels that have enough width */}
        {segments.map((seg) => {
          const centerX = seg.x + seg.width / 2;
          // Only render label if segment is wide enough to be readable
          if (seg.width < 30) return null;
          return (
            <g key={`legend-${seg.label}`}>
              <rect
                x={centerX - 4} y={barHeight + 16}
                width={8} height={4} rx={1}
                fill={seg.color}
              />
              <text
                x={centerX} y={barHeight + 30}
                textAnchor="middle" fontSize={5}
                fill="currentColor" className="text-muted-foreground/60"
              >
                {seg.label}
              </text>
              <text
                x={centerX} y={barHeight + 38}
                textAnchor="middle" fontSize={6} fontWeight={600}
                fill={seg.color}
              >
                {formatCompact(seg.value)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Recommendation Logic ───────────────────────────────────────────
function getRecommendation(roi: number): { emoji: string; headline: string; body: string } {
  if (roi >= 300) {
    return {
      emoji: '🟢',
      headline: 'Strong Investment Case',
      body: 'The ROI strongly supports proceeding. The knowledge graph investment pays for itself multiple times over, with compounding returns as the organizational intelligence layer matures.',
    };
  }
  if (roi >= 150) {
    return {
      emoji: '🟡',
      headline: 'Positive Investment Case',
      body: 'The ROI supports a phased approach. Start with the highest-value workflows and expand as early results validate the model. Consider a pilot before full deployment.',
    };
  }
  if (roi >= 50) {
    return {
      emoji: '🟠',
      headline: 'Moderate Investment Case',
      body: 'The ROI is positive but moderate. Focus on the pain points with the highest cost impact. A targeted pilot can help validate assumptions before committing to the full build.',
    };
  }
  return {
    emoji: '🔴',
    headline: 'Review Assumptions',
    body: 'The current inputs suggest the investment may need more justification. Consider whether hidden costs or strategic value (brand consistency, speed-to-market) are underweighted.',
  };
}

// ─── Main Slide ─────────────────────────────────────────────────────
export default function ExecutiveSummarySlide({ step }: ExecutiveSummarySlideProps) {
  const outputs = useRoiStore(s => s.outputs);
  const baseline = useRoiStore(s => s.baseline);
  const [copied, setCopied] = useState(false);

  const recommendation = getRecommendation(outputs.threeYearRoi);
  const vs = outputs.valueStreams;
  const { roas } = outputs;

  // Build plain-text summary for clipboard
  const buildClipboardText = useCallback(() => {
    const lines = [
      'ROI EXECUTIVE SUMMARY - Knowledge Graph Infrastructure',
      '='.repeat(55),
      '',
      `3-Year ROI: ${Math.round(outputs.threeYearRoi)}%`,
      `Payback Period: ${outputs.paybackMonths} months`,
      `Total Investment: ${formatCompact(outputs.totalInvestment)}`,
      `Net Present Value: ${formatCompact(outputs.netPresentValue)}`,
      `Annual Value (Full Ramp): ${formatCompact(outputs.totalAnnualValue)}`,
      '',
      'VALUE BREAKDOWN (Annual)',
      `  ROAS Improvement: ${formatCompact(vs.roasImprovement)}`,
      `  Martech Optimization: ${formatCompact(vs.martechOptimization)}`,
      `  Content Velocity: ${formatCompact(vs.contentVelocity)}`,
      `  Campaign Speed: ${formatCompact(vs.campaignSpeed)}`,
      `  Operational Efficiency: ${formatCompact(vs.operationalEfficiency)}`,
      `  Attribution Improvement: ${formatCompact(vs.attributionImprovement)}`,
      `  Personalization Lift: ${formatCompact(vs.personalizationLift)}`,
      '',
      'ROAS IMPACT',
      `  Current ROAS: ${roas.currentRoas.toFixed(1)}:1`,
      `  Projected ROAS: ${roas.projectedRoas.toFixed(1)}:1`,
      `  Incremental Revenue: ${formatCompact(roas.incrementalRevenue)}`,
      '',
      `CURRENT ANNUAL COST: ${formatCompact(baseline.totalAnnualCost)}`,
      '',
      `RECOMMENDATION: ${recommendation.headline}`,
      recommendation.body,
      '',
      '-'.repeat(55),
      'Generated by the Organizational Intelligence ROI Simulator',
    ];
    return lines.join('\n');
  }, [outputs, baseline, recommendation, vs, roas]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildClipboardText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: silent fail (clipboard may be blocked in some contexts)
    }
  }, [buildClipboardText]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
      {/* Tagline */}
      {step.content.tagline && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground text-center mb-6 max-w-3xl mx-auto italic"
        >
          &ldquo;{step.content.tagline}&rdquo;
        </motion.p>
      )}

      {/* ─── Hero Metric ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
        className="text-center mb-6"
      >
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
          3-Year Return on Investment
        </p>
        <AnimatedNumber
          value={outputs.threeYearRoi}
          format="percent"
          className="text-6xl md:text-7xl font-bold text-[#14B8A6]"
          duration={1.2}
        />
      </motion.div>

      {/* ─── Supporting Metrics Row ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
      >
        {[
          { icon: Clock, label: 'Payback Period', value: outputs.paybackMonths, format: 'months' as const, color: '#14B8A6' },
          { icon: DollarSign, label: 'Total Investment', value: outputs.totalInvestment, format: 'currency' as const, color: '#D4856A' },
          { icon: BarChart3, label: 'Net Present Value', value: outputs.netPresentValue, format: 'currency' as const, color: '#9B7ACC' },
          { icon: TrendingUp, label: 'Annual Value', value: outputs.totalAnnualValue, format: 'currency' as const, color: '#C9A04E' },
        ].map(({ icon: Icon, label, value, format, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="glass-panel rounded-lg p-3 text-center"
            style={{ borderTop: `3px solid ${color}` }}
          >
            <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
            <span style={{ color }}>
              <AnimatedNumber value={value} format={format} className="text-lg font-bold" />
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* ─── Value Breakdown Bar ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="glass-panel rounded-lg p-4 mb-6"
      >
        <ValueBreakdownBar outputs={outputs} />
      </motion.div>

      {/* ─── ROAS Metrics ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="glass-panel rounded-lg p-4 mb-6"
      >
        <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-center mb-3">
          ROAS Impact
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-lg bg-muted-foreground/5">
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">Current ROAS</p>
            <p className="text-lg font-bold text-[#D4856A]">
              {roas.currentRoas.toFixed(1)}:1
            </p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted-foreground/5">
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">Projected ROAS</p>
            <p className="text-lg font-bold text-[#14B8A6]">
              {roas.projectedRoas.toFixed(1)}:1
            </p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted-foreground/5">
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">Incremental Revenue</p>
            <span className="text-[#9B7ACC]">
              <AnimatedNumber
                value={roas.incrementalRevenue}
                format="currency"
                className="text-lg font-bold"
              />
            </span>
          </div>
        </div>
      </motion.div>

      {/* ─── Recommendation ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="glass-panel rounded-lg p-4 mb-6"
        style={{ borderLeft: '4px solid #14B8A6' }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">{recommendation.emoji}</span>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">{recommendation.headline}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{recommendation.body}</p>
          </div>
        </div>
      </motion.div>

      {/* ─── Copy to Clipboard ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center"
      >
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel text-sm font-semibold transition-all hover:shadow-lg"
          style={{
            color: copied ? '#4CAF50' : '#14B8A6',
            backgroundColor: copied ? '#4CAF5010' : '#14B8A610',
          }}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied to Clipboard
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Executive Summary
            </>
          )}
        </button>
        <p className="text-[9px] text-muted-foreground/40 mt-2">
          Share this summary with your leadership team
        </p>
      </motion.div>
    </div>
  );
}
