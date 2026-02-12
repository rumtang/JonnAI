'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, TrendingUp, Clock, DollarSign, BarChart3, Shield, Download, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useRoiStore } from '@/lib/store/roi-store';
import { SCENARIO_MULTIPLIERS, CFO_FRAMEWORK, AGENT_INTENSITY_LEVELS } from '@/lib/roi/engine';
import { getPrimaryActionsForStream, type ValueStreamKey } from '@/data/roi-actions';
import AnimatedNumber from '../charts/AnimatedNumber';
import AnimatedBar from '../charts/AnimatedBar';
import type { RoiStep } from '@/data/roi-steps';

interface ExecutiveSummarySlideProps {
  step: RoiStep;
}

// ─── Format Helpers ─────────────────────────────────────────────────
function formatCompact(v: number): string {
  if (Math.abs(v) >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
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
    { label: 'Campaign Throughput', value: vs.campaignSpeed, color: '#C9A04E' },
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
function getRecommendation(
  roi: number,
  budgetLabel: string,
  headcount: number,
  industry: string,
): { emoji: string; headline: string; body: string } {
  // Personalized preamble referencing user's inputs
  const context = `Based on your ${budgetLabel} marketing budget, ${headcount.toLocaleString()}-person ${industry} team`;

  if (roi >= 300) {
    return {
      emoji: '🟢',
      headline: 'Strong Investment Case',
      body: `${context}, the ROI strongly supports proceeding. The knowledge graph investment pays for itself multiple times over, with compounding returns as the organizational intelligence layer matures.`,
    };
  }
  if (roi >= 150) {
    return {
      emoji: '🟡',
      headline: 'Positive Investment Case',
      body: `${context}, the ROI supports a phased approach. Start with the highest-value workflows and expand as early results validate the model. Consider a pilot before full deployment.`,
    };
  }
  if (roi >= 50) {
    return {
      emoji: '🟠',
      headline: 'Moderate Investment Case',
      body: `${context}, the ROI is positive but moderate. Focus on the pain points with the highest cost impact. A targeted pilot can help validate assumptions before committing to the full build.`,
    };
  }
  return {
    emoji: '🔴',
    headline: 'Review Assumptions',
    body: `${context}, the current inputs suggest the investment may need more justification. Consider whether hidden costs or strategic value (brand consistency, speed-to-market) are underweighted.`,
  };
}

// ─── Main Slide ─────────────────────────────────────────────────────
export default function ExecutiveSummarySlide({ step }: ExecutiveSummarySlideProps) {
  const outputs = useRoiStore(s => s.outputs);
  const baseline = useRoiStore(s => s.baseline);
  const org = useRoiStore(s => s.org);
  const agentIntensity = useRoiStore(s => s.agentIntensity);
  const viewMode = useRoiStore(s => s.viewMode);
  const setViewMode = useRoiStore(s => s.setViewMode);
  const disabledStreams = useRoiStore(s => s.disabledStreams);
  const toggleStream = useRoiStore(s => s.toggleStream);
  const [copied, setCopied] = useState(false);

  const companyName = org.companyName?.trim() || '';
  const budgetLabel = formatCompact(baseline.derived.totalMarketingBudget);
  const recommendation = getRecommendation(
    outputs.threeYearRoi,
    budgetLabel,
    org.marketingHeadcount,
    org.industry ?? 'B2B Average',
  );
  const vs = outputs.valueStreams;
  const { roas, enterpriseModel, doNothing, irr } = outputs;

  // Risk-adjusted values (conservative scenario)
  const conservativeMultiplier = SCENARIO_MULTIPLIERS.conservative;
  const riskAdjustedNpv = outputs.netPresentValue * conservativeMultiplier;
  const riskAdjustedAnnualValue = outputs.totalAnnualValue * conservativeMultiplier;

  // Build plain-text summary for clipboard — changes based on view mode
  const buildClipboardText = useCallback(() => {
    if (viewMode === 'cfo') {
      const intensityLabel = AGENT_INTENSITY_LEVELS[agentIntensity].label;
      const lines = [
        companyName
          ? `INVESTMENT ANALYSIS — Prepared for ${companyName}`
          : 'INVESTMENT ANALYSIS - Organizational Intelligence Infrastructure',
        '='.repeat(60),
        '',
        `Agentification Intensity: ${intensityLabel}`,
        '',
        'FINANCIAL SUMMARY',
        `  Net Present Value (NPV): ${formatCompact(outputs.netPresentValue)}`,
        `  Internal Rate of Return (IRR): ${isNaN(irr) ? 'N/A' : `${Math.round(irr)}%`}`,
        `  Payback Period: ${outputs.paybackMonths} months`,
        `  Total Capital Required: ${formatCompact(outputs.totalInvestment)}`,
        `  Ongoing Annual Cost: ${formatCompact(outputs.annualOpEx)}`,
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
        `Generated by the Organizational Intelligence ROI Simulator${companyName ? ` for ${companyName}` : ''}`,
      ];
      return lines.join('\n');
    }

    const pctOf = (v: number) => outputs.totalAnnualValue > 0
      ? `${((v / outputs.totalAnnualValue) * 100).toFixed(1)}%`
      : '–';

    const intensityLabel = AGENT_INTENSITY_LEVELS[agentIntensity].label;
    const lines = [
      companyName
        ? `ROI EXECUTIVE SUMMARY — Prepared for ${companyName}`
        : 'ROI EXECUTIVE SUMMARY - Knowledge Graph Infrastructure',
      '='.repeat(55),
      '',
      `Agentification Intensity: ${intensityLabel}`,
      `3-Year ROI: ${Math.round(outputs.threeYearRoi)}%`,
      `Payback Period: ${outputs.paybackMonths} months`,
      `Total Investment: ${formatCompact(outputs.totalInvestment)}`,
      `Ongoing Annual Cost: ${formatCompact(outputs.annualOpEx)}`,
      `Net Present Value: ${formatCompact(outputs.netPresentValue)}`,
      `IRR: ${isNaN(irr) ? 'N/A' : `${Math.round(irr)}%`}`,
      `Annual Value (Full Ramp): ${formatCompact(outputs.totalAnnualValue)}`,
      '',
      'VALUE BREAKDOWN (Annual — $ and % of total)',
      `  ROAS Improvement: ${formatCompact(vs.roasImprovement)} (${pctOf(vs.roasImprovement)}) [Revenue]`,
      `  Personalization Lift: ${formatCompact(vs.personalizationLift)} (${pctOf(vs.personalizationLift)}) [Revenue]`,
      `  Campaign Throughput: ${formatCompact(vs.campaignSpeed)} (${pctOf(vs.campaignSpeed)}) [Savings]`,
      `  Martech Optimization: ${formatCompact(vs.martechOptimization)} (${pctOf(vs.martechOptimization)}) [Savings]`,
      `  Content Velocity: ${formatCompact(vs.contentVelocity)} (${pctOf(vs.contentVelocity)}) [Savings]`,
      `  Operational Efficiency: ${formatCompact(vs.operationalEfficiency)} (${pctOf(vs.operationalEfficiency)}) [Savings]`,
      `  Attribution Improvement: ${formatCompact(vs.attributionImprovement)} (${pctOf(vs.attributionImprovement)}) [Savings]`,
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
      `Generated by the Organizational Intelligence ROI Simulator${companyName ? ` for ${companyName}` : ''}`,
    ];
    return lines.join('\n');
  }, [outputs, baseline, recommendation, vs, roas, viewMode, irr, enterpriseModel, doNothing, riskAdjustedNpv, riskAdjustedAnnualValue, companyName, agentIntensity]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildClipboardText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: silent fail (clipboard may be blocked in some contexts)
    }
  }, [buildClipboardText]);

  const [downloading, setDownloading] = useState(false);
  const handleDownloadPdf = useCallback(async () => {
    setDownloading(true);
    try {
      // Dynamic import keeps the PDF library out of the main bundle
      const { downloadRoiReport } = await import('../RoiReport');
      await downloadRoiReport({ org, baseline, outputs, viewMode, agentIntensity });
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setDownloading(false);
    }
  }, [org, baseline, outputs, viewMode, agentIntensity]);

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
        {companyName && (
          <p className="text-sm font-semibold text-foreground/80 mb-1">
            Investment Case for {companyName}
          </p>
        )}
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
          3-Year Return on Investment
        </p>
        <AnimatedNumber
          value={outputs.threeYearRoi}
          format="percent"
          className="text-6xl md:text-7xl font-bold text-[#14B8A6]"
          duration={1.2}
        />
        <div className="flex items-center justify-center gap-2 mt-1">
          <p className="text-sm text-muted-foreground">
            {formatCompact(outputs.netPresentValue)} net present value on {formatCompact(outputs.totalInvestment)} invested
          </p>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold"
            style={{
              color: { low: '#5B9ECF', medium: '#14B8A6', high: '#C9A04E' }[agentIntensity],
              backgroundColor: `${{ low: '#5B9ECF', medium: '#14B8A6', high: '#C9A04E' }[agentIntensity]}15`,
              border: `1px solid ${{ low: '#5B9ECF', medium: '#14B8A6', high: '#C9A04E' }[agentIntensity]}40`,
            }}
          >
            {AGENT_INTENSITY_LEVELS[agentIntensity].label} Intensity
          </span>
        </div>
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
            className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4"
          >
            {[
              { icon: Clock, label: 'Payback Period', value: outputs.paybackMonths, format: 'months' as const, color: '#14B8A6' },
              { icon: DollarSign, label: 'Total Investment', value: outputs.totalInvestment, format: 'currency' as const, color: '#D4856A' },
              { icon: RefreshCw, label: 'Ongoing Annual Cost', value: outputs.annualOpEx, format: 'currency' as const, color: '#E88D67' },
              { icon: BarChart3, label: 'Net Present Value', value: outputs.netPresentValue, format: 'currency' as const, color: '#9B7ACC' },
              { icon: TrendingUp, label: 'Annual Value', value: outputs.totalAnnualValue, format: 'currency' as const, color: '#C9A04E' },
              { icon: Shield, label: 'IRR', value: isNaN(irr) ? 0 : irr, format: 'percent' as const, color: '#14B8A6' },
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

          {/* ─── Detailed Savings & Revenue Table ──────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="glass-panel rounded-lg p-4 mb-4"
          >
            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Where the Value Comes From
            </h4>
            <table className="w-full text-[9px]">
              <thead>
                <tr className="border-b border-muted-foreground/10">
                  <th className="w-6 py-1.5" />
                  <th className="text-left py-1.5 text-muted-foreground font-medium">Value Stream</th>
                  <th className="text-left py-1.5 text-muted-foreground font-medium">Enabled By</th>
                  <th className="text-left py-1.5 text-muted-foreground font-medium">Type</th>
                  <th className="text-right py-1.5 text-muted-foreground font-medium">Annual Value</th>
                  <th className="text-right py-1.5 text-muted-foreground font-medium">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'ROAS Improvement', streamKey: 'roasImprovement' as ValueStreamKey, value: vs.roasImprovement, type: 'Revenue', color: '#9B7ACC' },
                  { label: 'Personalization Lift', streamKey: 'personalizationLift' as ValueStreamKey, value: vs.personalizationLift, type: 'Revenue', color: '#4CAF50' },
                  { label: 'Campaign Throughput', streamKey: 'campaignSpeed' as ValueStreamKey, value: vs.campaignSpeed, type: 'Savings', color: '#C9A04E' },
                  { label: 'Martech Optimization', streamKey: 'martechOptimization' as ValueStreamKey, value: vs.martechOptimization, type: 'Savings', color: '#E88D67' },
                  { label: 'Content Velocity', streamKey: 'contentVelocity' as ValueStreamKey, value: vs.contentVelocity, type: 'Savings', color: '#5B9ECF' },
                  { label: 'Operational Efficiency', streamKey: 'operationalEfficiency' as ValueStreamKey, value: vs.operationalEfficiency, type: 'Savings', color: '#D4856A' },
                  { label: 'Attribution Improvement', streamKey: 'attributionImprovement' as ValueStreamKey, value: vs.attributionImprovement, type: 'Savings', color: '#f59e0b' },
                ].map((stream) => {
                  const isDisabled = disabledStreams.has(stream.streamKey);
                  const enablers = getPrimaryActionsForStream(stream.streamKey);
                  return (
                    <tr key={stream.label} className={`border-b border-muted-foreground/5 ${isDisabled ? 'opacity-40' : ''}`}>
                      <td className="py-1.5">
                        <button
                          onClick={() => toggleStream(stream.streamKey)}
                          className="p-0.5 rounded hover:bg-muted-foreground/10 transition-colors"
                          title={isDisabled ? `Include ${stream.label}` : `Exclude ${stream.label}`}
                        >
                          {isDisabled
                            ? <EyeOff className="w-3 h-3 text-muted-foreground/50" />
                            : <Eye className="w-3 h-3 text-muted-foreground" />}
                        </button>
                      </td>
                      <td className="py-1.5 font-medium" style={{ color: stream.color }}>
                        {stream.label}
                        {isDisabled && <span className="ml-1 text-[7px] text-muted-foreground/50">(excluded)</span>}
                      </td>
                      <td className="py-1.5">
                        <span className="flex gap-0.5" title={enablers.map(a => a.title).join(', ')}>
                          {enablers.slice(0, 3).map(a => (
                            <span key={a.id} className="text-[10px]" title={a.title}>{a.icon}</span>
                          ))}
                        </span>
                      </td>
                      <td className="py-1.5 text-muted-foreground">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] ${
                          stream.type === 'Revenue'
                            ? 'bg-[#4CAF50]/10 text-[#4CAF50]'
                            : 'bg-[#5B9ECF]/10 text-[#5B9ECF]'
                        }`}>
                          {stream.type}
                        </span>
                      </td>
                      <td className="py-1.5 text-right font-semibold" style={{ color: stream.color }}>
                        {isDisabled ? '–' : formatCompact(stream.value)}
                      </td>
                      <td className="py-1.5 text-right text-muted-foreground">
                        {isDisabled ? '–' : outputs.totalAnnualValue > 0 ? `${((stream.value / outputs.totalAnnualValue) * 100).toFixed(1)}%` : '–'}
                      </td>
                    </tr>
                  );
                })}
                {/* Total row */}
                <tr className="border-t-2 border-muted-foreground/20">
                  <td></td>
                  <td className="py-2 font-semibold text-foreground">Total Annual Value</td>
                  <td></td>
                  <td></td>
                  <td className="py-2 text-right font-bold text-[#14B8A6]">
                    {formatCompact(outputs.totalAnnualValue)}
                  </td>
                  <td className="py-2 text-right font-semibold text-muted-foreground">100%</td>
                </tr>
              </tbody>
            </table>
            {/* Revenue vs Savings summary */}
            <div className="flex gap-4 mt-3 pt-3 border-t border-muted-foreground/10">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4CAF50]" />
                <span className="text-[8px] text-muted-foreground">
                  Revenue: {formatCompact(vs.roasImprovement + vs.personalizationLift)}
                  {' '}({outputs.totalAnnualValue > 0 ? `${(((vs.roasImprovement + vs.personalizationLift) / outputs.totalAnnualValue) * 100).toFixed(0)}%` : '–'})
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#5B9ECF]" />
                <span className="text-[8px] text-muted-foreground">
                  Savings: {formatCompact(vs.martechOptimization + vs.contentVelocity + vs.campaignSpeed + vs.operationalEfficiency + vs.attributionImprovement)}
                  {' '}({outputs.totalAnnualValue > 0 ? `${(((vs.martechOptimization + vs.contentVelocity + vs.campaignSpeed + vs.operationalEfficiency + vs.attributionImprovement) / outputs.totalAnnualValue) * 100).toFixed(0)}%` : '–'})
                </span>
              </div>
            </div>
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

          {/* Cost of Inaction — expanded panel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="glass-panel rounded-lg p-4 mb-4"
            style={{ borderLeft: '4px solid #ef4444' }}
          >
            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="text-[#ef4444]">Competitive Exposure — Cost of Inaction</span>
            </h4>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[
                { label: 'Year 1', pct: doNothing.year1ErosionPct, loss: doNothing.year1Loss },
                { label: 'Year 2', pct: doNothing.year2ErosionPct, loss: doNothing.year2Loss },
                { label: 'Year 3', pct: doNothing.year3ErosionPct, loss: doNothing.year3Loss },
              ].map(({ label, pct, loss }) => (
                <div key={label} className="text-center p-2 rounded-lg bg-[#ef4444]/5">
                  <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">{label} at Risk</p>
                  <p className="text-lg font-bold text-[#ef4444]">-{pct}%</p>
                  <p className="text-[9px] text-muted-foreground">{formatCompact(loss)}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#ef4444]/10">
              <span className="text-[9px] text-muted-foreground">Cumulative 3-year marketing budget at risk</span>
              <span className="text-sm font-bold text-[#ef4444]">{formatCompact(doNothing.year3Loss)}</span>
            </div>
            <p className="text-[8px] text-muted-foreground/50 mt-2 leading-relaxed italic">
              Based on quarterly competitive erosion model. Organizations that delay knowledge infrastructure face compounding disadvantages as AI-native competitors encode operational knowledge faster.
            </p>
          </motion.div>
        </TabsContent>

        {/* ═══ CFO VIEW ═════════════════════════════════════════ */}
        <TabsContent value="cfo">
          {/* Core Financial Metrics — NPV, IRR, Payback */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4"
          >
            {[
              { label: 'Net Present Value', value: outputs.netPresentValue, format: 'currency' as const, color: '#9B7ACC' },
              { label: 'Internal Rate of Return', value: isNaN(irr) ? 0 : irr, format: 'percent' as const, color: '#14B8A6' },
              { label: 'Payback Period', value: outputs.paybackMonths, format: 'months' as const, color: '#C9A04E' },
              { label: 'Capital Required', value: outputs.totalInvestment, format: 'currency' as const, color: '#D4856A' },
              { label: 'Ongoing Annual Cost', value: outputs.annualOpEx, format: 'currency' as const, color: '#E88D67' },
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
                  {!isNaN(irr) && irr > CFO_FRAMEWORK.hurdle_rate
                    ? `IRR of ${Math.round(irr)}% exceeds the ${CFO_FRAMEWORK.hurdle_rate}% hurdle rate. Payback within ${outputs.paybackMonths} months demonstrates strong capital efficiency with ${formatCompact(riskAdjustedNpv)} in risk-adjusted net present value.`
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
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel text-sm font-semibold transition-all hover:shadow-lg"
            style={{
              color: '#C9A04E',
              backgroundColor: '#C9A04E10',
            }}
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Generating...' : 'Download Your Investment Case'}
          </button>
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
        </div>
        <p className="text-[9px] text-muted-foreground/40 mt-2">
          Download a branded PDF to share with your buying committee, or copy as text
        </p>
      </motion.div>
    </div>
  );
}
