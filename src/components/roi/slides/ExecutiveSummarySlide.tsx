'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, TrendingUp, Clock, DollarSign, BarChart3, Shield } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useRoiStore } from '@/lib/store/roi-store';
import { SCENARIO_MULTIPLIERS, CFO_FRAMEWORK } from '@/lib/roi/engine';
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
  const viewMode = useRoiStore(s => s.viewMode);
  const setViewMode = useRoiStore(s => s.setViewMode);
  const [copied, setCopied] = useState(false);

  const recommendation = getRecommendation(outputs.threeYearRoi);
  const vs = outputs.valueStreams;
  const { roas, enterpriseModel, doNothing, irr } = outputs;

  // Risk-adjusted values (conservative scenario)
  const conservativeMultiplier = SCENARIO_MULTIPLIERS.conservative;
  const riskAdjustedNpv = outputs.netPresentValue * conservativeMultiplier;
  const riskAdjustedAnnualValue = outputs.totalAnnualValue * conservativeMultiplier;

  // Build plain-text summary for clipboard — changes based on view mode
  const buildClipboardText = useCallback(() => {
    if (viewMode === 'cfo') {
      const lines = [
        'INVESTMENT ANALYSIS - Organizational Intelligence Infrastructure',
        '='.repeat(60),
        '',
        'FINANCIAL SUMMARY',
        `  Net Present Value (NPV): ${formatCompact(outputs.netPresentValue)}`,
        `  Internal Rate of Return (IRR): ${isNaN(irr) ? 'N/A' : `${Math.round(irr * 100)}%`}`,
        `  Payback Period: ${outputs.paybackMonths} months`,
        `  Total Capital Required: ${formatCompact(outputs.totalInvestment)}`,
        '',
        'RISK-ADJUSTED RETURNS (Conservative)',
        `  Risk-Adjusted NPV: ${formatCompact(riskAdjustedNpv)}`,
        `  Risk-Adjusted Annual Value: ${formatCompact(riskAdjustedAnnualValue)}`,
        `  Hurdle Rate: ${CFO_FRAMEWORK.hurdle_rate}%`,
        '',
        'ENTERPRISE VALUE CREATION',
        `  Cost Avoidance (Waste Recovery): ${formatCompact(enterpriseModel.aiRecoveryPotential)}`,
        `  Incremental Revenue (Content): ${formatCompact(enterpriseModel.contentSavings)}`,
        `  Headcount Efficiency: ${formatCompact(enterpriseModel.headcountSavings)}`,
        `  Total Enterprise Value: ${formatCompact(enterpriseModel.totalEnterpriseValue)}`,
        '',
        'COST OF INACTION',
        `  Year 1 Revenue at Risk: ${formatCompact(doNothing.year1Loss)} (-${doNothing.year1ErosionPct}%)`,
        `  Year 2 Revenue at Risk: ${formatCompact(doNothing.year2Loss)} (-${doNothing.year2ErosionPct}%)`,
        `  Year 3 Revenue at Risk: ${formatCompact(doNothing.year3Loss)} (-${doNothing.year3ErosionPct}%)`,
        '',
        '-'.repeat(60),
        'Generated by the Organizational Intelligence ROI Simulator',
      ];
      return lines.join('\n');
    }

    const lines = [
      'ROI EXECUTIVE SUMMARY - Knowledge Graph Infrastructure',
      '='.repeat(55),
      '',
      `3-Year ROI: ${Math.round(outputs.threeYearRoi)}%`,
      `Payback Period: ${outputs.paybackMonths} months`,
      `Total Investment: ${formatCompact(outputs.totalInvestment)}`,
      `Net Present Value: ${formatCompact(outputs.netPresentValue)}`,
      `IRR: ${isNaN(irr) ? 'N/A' : `${Math.round(irr * 100)}%`}`,
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
  }, [outputs, baseline, recommendation, vs, roas, viewMode, irr, enterpriseModel, doNothing, riskAdjustedNpv, riskAdjustedAnnualValue]);

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
          className="text-xs text-muted-foreground text-center mb-4 max-w-3xl mx-auto italic"
        >
          &ldquo;{step.content.tagline}&rdquo;
        </motion.p>
      )}

      {/* ─── Hero Metric ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
        className="text-center mb-4"
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

      {/* ─── View Mode Tabs ──────────────────────────────────── */}
      <Tabs
        value={viewMode}
        onValueChange={(v) => setViewMode(v as 'marketing' | 'cfo')}
        className="mb-4"
      >
        <TabsList className="mx-auto">
          <TabsTrigger value="marketing" className="text-xs">Marketing View</TabsTrigger>
          <TabsTrigger value="cfo" className="text-xs">CFO View</TabsTrigger>
        </TabsList>

        {/* ═══ MARKETING VIEW ═══════════════════════════════════ */}
        <TabsContent value="marketing">
          {/* Supporting Metrics Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4"
          >
            {[
              { icon: Clock, label: 'Payback Period', value: outputs.paybackMonths, format: 'months' as const, color: '#14B8A6' },
              { icon: DollarSign, label: 'Total Investment', value: outputs.totalInvestment, format: 'currency' as const, color: '#D4856A' },
              { icon: BarChart3, label: 'Net Present Value', value: outputs.netPresentValue, format: 'currency' as const, color: '#9B7ACC' },
              { icon: TrendingUp, label: 'Annual Value', value: outputs.totalAnnualValue, format: 'currency' as const, color: '#C9A04E' },
              { icon: Shield, label: 'IRR', value: isNaN(irr) ? 0 : irr * 100, format: 'percent' as const, color: '#14B8A6' },
            ].map(({ icon: Icon, label, value, format, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="glass-panel rounded-lg p-3 text-center"
                style={{ borderTop: `3px solid ${color}` }}
              >
                <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
                <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                <span style={{ color }}>
                  {label === 'IRR' && isNaN(irr)
                    ? <span className="text-lg font-bold">N/A</span>
                    : <AnimatedNumber value={value} format={format} className="text-lg font-bold" />
                  }
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Value Breakdown Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="glass-panel rounded-lg p-4 mb-4"
          >
            <ValueBreakdownBar outputs={outputs} />
          </motion.div>

          {/* ROAS Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-panel rounded-lg p-4 mb-4"
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

          {/* Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-panel rounded-lg p-4 mb-4"
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

          {/* Do-nothing callout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="glass-panel rounded-lg p-3 mb-4"
            style={{ borderLeft: '4px solid #ef4444' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-muted-foreground">Cost of inaction (3-year revenue at risk):</span>
              <span className="text-sm font-bold text-[#ef4444]">
                {formatCompact(doNothing.year3Loss)} (-{doNothing.year3ErosionPct}%)
              </span>
            </div>
          </motion.div>
        </TabsContent>

        {/* ═══ CFO VIEW ═════════════════════════════════════════ */}
        <TabsContent value="cfo">
          {/* Core Financial Metrics — NPV, IRR, Payback */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4"
          >
            {[
              { label: 'Net Present Value', value: outputs.netPresentValue, format: 'currency' as const, color: '#9B7ACC' },
              { label: 'Internal Rate of Return', value: isNaN(irr) ? 0 : irr * 100, format: 'percent' as const, color: '#14B8A6' },
              { label: 'Payback Period', value: outputs.paybackMonths, format: 'months' as const, color: '#C9A04E' },
              { label: 'Capital Required', value: outputs.totalInvestment, format: 'currency' as const, color: '#D4856A' },
            ].map(({ label, value, format, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="glass-panel rounded-lg p-3 text-center"
                style={{ borderTop: `3px solid ${color}` }}
              >
                <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                <span style={{ color }}>
                  {label === 'Internal Rate of Return' && isNaN(irr)
                    ? <span className="text-lg font-bold">N/A</span>
                    : <AnimatedNumber value={value} format={format} className="text-lg font-bold" />
                  }
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Risk-Adjusted Returns */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-panel rounded-lg p-4 mb-4"
            style={{ borderLeft: '3px solid #f59e0b' }}
          >
            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Risk-Adjusted Returns (Conservative Scenario)
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 rounded-lg bg-muted-foreground/5">
                <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">Risk-Adjusted NPV</p>
                <span className="text-[#f59e0b]">
                  <AnimatedNumber value={riskAdjustedNpv} format="currency" className="text-lg font-bold" />
                </span>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted-foreground/5">
                <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">Annual Value (Conservative)</p>
                <span className="text-[#f59e0b]">
                  <AnimatedNumber value={riskAdjustedAnnualValue} format="currency" className="text-lg font-bold" />
                </span>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted-foreground/5">
                <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">Hurdle Rate</p>
                <p className="text-lg font-bold text-[#f59e0b]">{CFO_FRAMEWORK.hurdle_rate}%</p>
              </div>
            </div>
          </motion.div>

          {/* Enterprise Value Creation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-panel rounded-lg p-4 mb-4"
          >
            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Enterprise Value Creation
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Cost Avoidance', value: enterpriseModel.aiRecoveryPotential, color: '#14B8A6' },
                { label: 'Incremental Revenue', value: enterpriseModel.contentSavings, color: '#5B9ECF' },
                { label: 'Headcount Efficiency', value: enterpriseModel.headcountSavings, color: '#9B7ACC' },
                { label: 'Total Enterprise Value', value: enterpriseModel.totalEnterpriseValue, color: '#C9A04E' },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center p-2 rounded-lg bg-muted-foreground/5">
                  <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                  <span style={{ color }}>
                    <AnimatedNumber value={value} format="currency" className="text-sm font-bold" />
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Cost of Inaction */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-panel rounded-lg p-4 mb-4"
            style={{ borderLeft: '4px solid #ef4444' }}
          >
            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Cost of Inaction
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Year 1', pct: doNothing.year1ErosionPct, loss: doNothing.year1Loss },
                { label: 'Year 2', pct: doNothing.year2ErosionPct, loss: doNothing.year2Loss },
                { label: 'Year 3', pct: doNothing.year3ErosionPct, loss: doNothing.year3Loss },
              ].map(({ label, pct, loss }) => (
                <div key={label} className="text-center p-2 rounded-lg bg-[#ef4444]/5">
                  <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">{label} Revenue at Risk</p>
                  <p className="text-lg font-bold text-[#ef4444]">-{pct}%</p>
                  <p className="text-[9px] text-muted-foreground">{formatCompact(loss)}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Capital Efficiency Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="glass-panel rounded-lg p-4 mb-4"
            style={{ borderLeft: '4px solid #14B8A6' }}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">📈</span>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Capital Efficiency Assessment</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {!isNaN(irr) && irr * 100 > CFO_FRAMEWORK.hurdle_rate
                    ? `IRR of ${Math.round(irr * 100)}% exceeds the ${CFO_FRAMEWORK.hurdle_rate}% hurdle rate. Payback within ${outputs.paybackMonths} months demonstrates strong capital efficiency with ${formatCompact(riskAdjustedNpv)} in risk-adjusted net present value.`
                    : `Investment shows a payback period of ${outputs.paybackMonths} months with ${formatCompact(outputs.netPresentValue)} in NPV. Consider phased deployment to optimize capital allocation against the ${CFO_FRAMEWORK.hurdle_rate}% hurdle rate.`
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* ─── Copy to Clipboard ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
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
              Copy {viewMode === 'cfo' ? 'Investment Analysis' : 'Executive Summary'}
            </>
          )}
        </button>
        <p className="text-[9px] text-muted-foreground/40 mt-2">
          {viewMode === 'cfo'
            ? 'Board-ready investment analysis'
            : 'Share this summary with your leadership team'
          }
        </p>
      </motion.div>
    </div>
  );
}
