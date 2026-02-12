'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRoiStore } from '@/lib/store/roi-store';
import {
  SCENARIO_MULTIPLIERS,
  ONGOING_OPEX_PCT,
  DO_NOTHING_EROSION,
  PROJECTION_MONTHS,
  computeSensitivity,
} from '@/lib/roi/engine';
import AnimatedNumber from '../charts/AnimatedNumber';
import type { RoiStep } from '@/data/roi-steps';

interface CfoSummarySlideProps {
  step: RoiStep;
}

function formatCompact(v: number): string {
  if (Math.abs(v) >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${Math.round(v).toLocaleString()}`;
}

export default function CfoSummarySlide({ step }: CfoSummarySlideProps) {
  const outputs = useRoiStore(s => s.outputs);
  const org = useRoiStore(s => s.org);
  const martech = useRoiStore(s => s.martech);
  const ops = useRoiStore(s => s.ops);
  const pain = useRoiStore(s => s.pain);
  const investment = useRoiStore(s => s.investment);
  const assumptions = useRoiStore(s => s.assumptions);
  const disabledStreams = useRoiStore(s => s.disabledStreams);

  const { totalInvestment, annualOpEx, timeline, irr } = outputs;
  const tco3yr = totalInvestment + annualOpEx * 3;

  // Compute per-scenario payback from timeline data
  const scenarioReturns = useMemo(() => {
    const consPayback = timeline.findIndex(t => t.valueConservative >= t.investmentCumulative);
    const aggPayback = timeline.findIndex(t => t.valueAggressive >= t.investmentCumulative);

    // Approximate scenario NPVs by scaling value portion
    const netValue = outputs.netPresentValue + totalInvestment;
    const consNpv = netValue * SCENARIO_MULTIPLIERS.conservative - totalInvestment;
    const aggNpv = netValue * SCENARIO_MULTIPLIERS.aggressive - totalInvestment;

    return {
      conservative: {
        payback: consPayback > 0 ? consPayback : PROJECTION_MONTHS,
        npv: consNpv,
        irr: isNaN(irr) ? NaN : irr * SCENARIO_MULTIPLIERS.conservative,
      },
      expected: {
        payback: outputs.paybackMonths,
        npv: outputs.netPresentValue,
        irr,
      },
      aggressive: {
        payback: aggPayback > 0 ? aggPayback : 1,
        npv: aggNpv,
        irr: isNaN(irr) ? NaN : irr * SCENARIO_MULTIPLIERS.aggressive,
      },
    };
  }, [timeline, outputs.netPresentValue, outputs.paybackMonths, totalInvestment, irr]);

  // Sensitivity analysis: vary content time savings and ROAS lift ±25%
  const sensitivity = useMemo(
    () => computeSensitivity(org, martech, ops, pain, investment, assumptions, disabledStreams),
    [org, martech, ops, pain, investment, assumptions, disabledStreams]
  );

  // Opportunity cost of delay
  const marketingBudget = org.annualRevenue * (org.marketingBudgetPct / 100);
  const quarterlyErosion = marketingBudget * (DO_NOTHING_EROSION.quarterlyPct / 100);
  const year1Erosion = outputs.doNothing.year1Loss;

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

      {/* ─── 1. Investment Summary Table ────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel rounded-lg p-4 mb-4"
      >
        <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Investment Summary
        </h4>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-muted-foreground/10">
              <td className="py-2 text-muted-foreground">Total Capital Investment</td>
              <td className="py-2 text-right font-semibold text-foreground">
                <AnimatedNumber value={totalInvestment} format="currency" className="font-semibold" />
              </td>
            </tr>
            <tr className="border-b border-muted-foreground/10">
              <td className="py-2 text-muted-foreground">
                Annual Operating Cost ({ONGOING_OPEX_PCT}%)
              </td>
              <td className="py-2 text-right font-semibold text-foreground">
                <AnimatedNumber value={annualOpEx} format="currency" className="font-semibold" />
              </td>
            </tr>
            <tr>
              <td className="py-2 font-semibold text-foreground">3-Year Total Cost of Ownership</td>
              <td className="py-2 text-right font-bold text-[#D4856A]">
                <AnimatedNumber value={tco3yr} format="currency" className="font-bold" />
              </td>
            </tr>
          </tbody>
        </table>
      </motion.div>

      {/* ─── 2. Returns Table (3 scenarios) ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-panel rounded-lg p-4 mb-4"
      >
        <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Scenario Returns
        </h4>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-muted-foreground/10">
              <th className="text-left py-2 text-muted-foreground font-medium">Metric</th>
              <th className="text-center py-2 text-[#f59e0b] font-medium">Conservative</th>
              <th className="text-center py-2 text-[#14B8A6] font-medium">Expected</th>
              <th className="text-center py-2 text-[#4CAF50] font-medium">Aggressive</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-muted-foreground/5">
              <td className="py-2 text-muted-foreground">Payback Period</td>
              <td className="py-2 text-center font-semibold text-[#f59e0b]">
                {scenarioReturns.conservative.payback}mo
              </td>
              <td className="py-2 text-center font-semibold text-[#14B8A6]">
                {scenarioReturns.expected.payback}mo
              </td>
              <td className="py-2 text-center font-semibold text-[#4CAF50]">
                {scenarioReturns.aggressive.payback}mo
              </td>
            </tr>
            <tr className="border-b border-muted-foreground/5">
              <td className="py-2 text-muted-foreground">3-Year NPV</td>
              <td className="py-2 text-center font-semibold text-[#f59e0b]">
                {formatCompact(scenarioReturns.conservative.npv)}
              </td>
              <td className="py-2 text-center font-semibold text-[#14B8A6]">
                {formatCompact(scenarioReturns.expected.npv)}
              </td>
              <td className="py-2 text-center font-semibold text-[#4CAF50]">
                {formatCompact(scenarioReturns.aggressive.npv)}
              </td>
            </tr>
            <tr>
              <td className="py-2 text-muted-foreground">IRR</td>
              <td className="py-2 text-center font-semibold text-[#f59e0b]">
                {isNaN(scenarioReturns.conservative.irr) ? 'N/A' : `${Math.round(scenarioReturns.conservative.irr)}%`}
              </td>
              <td className="py-2 text-center font-semibold text-[#14B8A6]">
                {isNaN(scenarioReturns.expected.irr) ? 'N/A' : `${Math.round(scenarioReturns.expected.irr)}%`}
              </td>
              <td className="py-2 text-center font-semibold text-[#4CAF50]">
                {isNaN(scenarioReturns.aggressive.irr) ? 'N/A' : `${Math.round(scenarioReturns.aggressive.irr)}%`}
              </td>
            </tr>
          </tbody>
        </table>
      </motion.div>

      {/* ─── 3. Sensitivity Analysis ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-panel rounded-lg p-4 mb-4"
      >
        <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          Sensitivity Analysis — Payback Period (months)
        </h4>
        <p className="text-[9px] text-muted-foreground/60 mb-3">
          Varies the two most impactful assumptions by ±25%
        </p>
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left py-1.5 text-[9px] text-muted-foreground/60" />
              {sensitivity.colValues.map((label, i) => (
                <th
                  key={label}
                  className={`text-center py-1.5 text-[9px] font-medium ${
                    i === 1 ? 'text-[#14B8A6]' : 'text-muted-foreground'
                  }`}
                >
                  {sensitivity.colLabel} {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sensitivity.rowValues.map((rowLabel, ri) => (
              <tr key={rowLabel} className="border-t border-muted-foreground/5">
                <td className={`py-2 text-[9px] font-medium ${
                  ri === 1 ? 'text-[#14B8A6]' : 'text-muted-foreground'
                }`}>
                  {sensitivity.rowLabel} {rowLabel}
                </td>
                {sensitivity.paybacks[ri].map((payback, ci) => {
                  const isBase = ri === 1 && ci === 1;
                  return (
                    <td
                      key={ci}
                      className={`py-2 text-center font-semibold ${
                        isBase
                          ? 'text-[#14B8A6] bg-[#14B8A6]/5 rounded'
                          : payback <= outputs.paybackMonths
                          ? 'text-[#4CAF50]'
                          : 'text-[#f59e0b]'
                      }`}
                    >
                      {payback}mo
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* ─── 4. Opportunity Cost of Delay ───────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="glass-panel rounded-lg p-4 mb-4"
        style={{ borderLeft: '4px solid #ef4444' }}
      >
        <h4 className="text-[10px] font-semibold text-[#ef4444] uppercase tracking-wider mb-3">
          Opportunity Cost of Delay
        </h4>
        <p className="text-sm text-foreground leading-relaxed mb-4">
          Each quarter of delay compounds a {DO_NOTHING_EROSION.quarterlyPct}% competitive gap
          ({formatCompact(quarterlyErosion)}/quarter). After 12 months, the estimated marketing
          budget at risk is{' '}
          <span className="font-bold text-[#ef4444]">{formatCompact(year1Erosion)}</span>.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Year 1', pct: outputs.doNothing.year1ErosionPct, loss: outputs.doNothing.year1Loss },
            { label: 'Year 2', pct: outputs.doNothing.year2ErosionPct, loss: outputs.doNothing.year2Loss },
            { label: 'Year 3', pct: outputs.doNothing.year3ErosionPct, loss: outputs.doNothing.year3Loss },
          ].map(({ label, pct, loss }) => (
            <div key={label} className="text-center p-2 rounded-lg bg-[#ef4444]/5">
              <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
              <p className="text-lg font-bold text-[#ef4444]">-{pct}%</p>
              <p className="text-[9px] text-muted-foreground">{formatCompact(loss)}</p>
            </div>
          ))}
        </div>
        <p className="text-[8px] text-muted-foreground/50 mt-3 leading-relaxed italic">
          Based on quarterly competitive erosion model. Organizations that delay knowledge
          infrastructure face compounding disadvantages as AI-native competitors encode
          operational knowledge faster.
        </p>
      </motion.div>
    </div>
  );
}
