'use client';

// PDF report generator for the ROI simulator.
// Uses @react-pdf/renderer for client-side PDF generation — no server needed.
// Produces a branded leave-behind artifact that internal champions can
// forward to CFOs, procurement, and the broader buying committee.

import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';
import { AGENT_INTENSITY_LEVELS, type OrganizationProfile, type BaselineOutputs, type RoiOutputs, type AgentIntensity } from '@/lib/roi/engine';

// ─── Types ────────────────────────────────────────────────────────────
interface ReportData {
  org: OrganizationProfile;
  baseline: BaselineOutputs;
  outputs: RoiOutputs;
  viewMode: 'marketing' | 'cfo';
  agentIntensity?: AgentIntensity;
}

// ─── Format Helpers ───────────────────────────────────────────────────
function fmt(v: number): string {
  if (Math.abs(v) >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${Math.round(v).toLocaleString()}`;
}

function pct(v: number, total: number): string {
  if (total === 0) return '–';
  return `${((v / total) * 100).toFixed(1)}%`;
}

// ─── Styles ───────────────────────────────────────────────────────────
const colors = {
  teal: '#14B8A6',
  gold: '#C9A04E',
  blue: '#5B9ECF',
  purple: '#9B7ACC',
  orange: '#E88D67',
  red: '#ef4444',
  green: '#4CAF50',
  muted: '#6b7280',
  light: '#f3f4f6',
  dark: '#111827',
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: colors.dark,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.teal,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: colors.dark,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 10,
    color: colors.muted,
  },
  preparedFor: {
    fontSize: 11,
    color: colors.teal,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: colors.dark,
    marginBottom: 8,
    marginTop: 16,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  metricsRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 12,
    gap: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.light,
    borderRadius: 6,
    padding: 10,
    alignItems: 'center' as const,
  },
  metricLabel: {
    fontSize: 7,
    color: colors.muted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
  },
  tableRow: {
    flexDirection: 'row' as const,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 4,
  },
  tableCell: {
    flex: 1,
    fontSize: 8,
  },
  tableCellRight: {
    flex: 1,
    fontSize: 8,
    textAlign: 'right' as const,
  },
  tableHeader: {
    fontFamily: 'Helvetica-Bold',
    color: colors.muted,
    fontSize: 7,
    textTransform: 'uppercase' as const,
  },
  recommendation: {
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.teal,
    paddingLeft: 12,
    paddingVertical: 8,
    backgroundColor: '#f0fdfa',
    borderRadius: 4,
  },
  recHeadline: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  recBody: {
    fontSize: 9,
    color: colors.muted,
    lineHeight: 1.5,
  },
  costOfInaction: {
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.red,
    paddingLeft: 12,
    paddingVertical: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 4,
  },
  footer: {
    position: 'absolute' as const,
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    borderTopWidth: 0.5,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    fontSize: 7,
    color: colors.muted,
  },
  methodology: {
    marginTop: 12,
    padding: 10,
    backgroundColor: colors.light,
    borderRadius: 4,
    fontSize: 7,
    color: colors.muted,
    lineHeight: 1.5,
  },
});

// ─── PDF Document Component ───────────────────────────────────────────
function RoiReportDocument({ org, baseline, outputs, viewMode, agentIntensity = 'medium' }: ReportData) {
  const companyName = org.companyName?.trim() || '';
  const vs = outputs.valueStreams;
  const { doNothing, irr } = outputs;
  const intensityLabel = AGENT_INTENSITY_LEVELS[agentIntensity].label;

  const title = companyName
    ? `Investment Case for ${companyName}`
    : 'Investment Case — Organizational Intelligence Infrastructure';

  const budgetLabel = fmt(baseline.derived.totalMarketingBudget);

  // Recommendation
  let recEmoji = '';
  let recHeadline = '';
  let recBody = '';
  const roi = outputs.threeYearRoi;
  const context = `Based on your ${budgetLabel} marketing budget, ${org.marketingHeadcount.toLocaleString()}-person ${org.industry ?? 'B2B Average'} team`;

  if (roi >= 300) {
    recEmoji = 'STRONG'; recHeadline = 'Strong Investment Case';
    recBody = `${context}, the ROI strongly supports proceeding. The knowledge graph investment pays for itself multiple times over, with compounding returns.`;
  } else if (roi >= 150) {
    recEmoji = 'POSITIVE'; recHeadline = 'Positive Investment Case';
    recBody = `${context}, the ROI supports a phased approach. Start with the highest-value workflows and expand as early results validate the model.`;
  } else if (roi >= 50) {
    recEmoji = 'MODERATE'; recHeadline = 'Moderate Investment Case';
    recBody = `${context}, the ROI is positive but moderate. Focus on the pain points with the highest cost impact.`;
  } else {
    recEmoji = 'REVIEW'; recHeadline = 'Review Assumptions';
    recBody = `${context}, the current inputs suggest the investment may need more justification.`;
  }

  const streams = [
    { label: 'ROAS Improvement', value: vs.roasImprovement, type: 'Revenue' },
    { label: 'Personalization Lift', value: vs.personalizationLift, type: 'Revenue' },
    { label: 'Campaign Throughput', value: vs.campaignSpeed, type: 'Savings' },
    { label: 'Martech Optimization', value: vs.martechOptimization, type: 'Savings' },
    { label: 'Content Velocity', value: vs.contentVelocity, type: 'Savings' },
    { label: 'Operational Efficiency', value: vs.operationalEfficiency, type: 'Savings' },
    { label: 'Attribution Improvement', value: vs.attributionImprovement, type: 'Savings' },
  ].filter(s => s.value > 0);

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {companyName ? (
            <Text style={styles.preparedFor}>Prepared for {companyName}</Text>
          ) : null}
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>
            {org.industry ?? 'B2B Average'} | {fmt(org.annualRevenue)} Revenue | {org.marketingHeadcount.toLocaleString()} Marketing FTEs | {intensityLabel} Intensity | {today}
          </Text>
        </View>

        {/* Key Metrics */}
        <Text style={styles.sectionTitle}>Financial Summary</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>3-Year ROI</Text>
            <Text style={[styles.metricValue, { color: colors.teal }]}>
              {Math.round(outputs.threeYearRoi)}%
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Payback Period</Text>
            <Text style={[styles.metricValue, { color: colors.teal }]}>
              {outputs.paybackMonths} mo
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Net Present Value</Text>
            <Text style={[styles.metricValue, { color: colors.purple }]}>
              {fmt(outputs.netPresentValue)}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>IRR</Text>
            <Text style={[styles.metricValue, { color: colors.teal }]}>
              {isNaN(irr) ? 'N/A' : `${Math.round(irr)}%`}
            </Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Investment</Text>
            <Text style={[styles.metricValue, { color: colors.orange }]}>
              {fmt(outputs.totalInvestment)}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Ongoing Annual Cost</Text>
            <Text style={[styles.metricValue, { color: colors.orange }]}>
              {fmt(outputs.annualOpEx)}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Annual Value (Full Ramp)</Text>
            <Text style={[styles.metricValue, { color: colors.gold }]}>
              {fmt(outputs.totalAnnualValue)}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Current ROAS</Text>
            <Text style={[styles.metricValue, { color: colors.orange }]}>
              {outputs.roas.currentRoas.toFixed(1)}:1
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Projected ROAS</Text>
            <Text style={[styles.metricValue, { color: colors.teal }]}>
              {outputs.roas.projectedRoas.toFixed(1)}:1
            </Text>
          </View>
        </View>

        {/* Value Breakdown Table */}
        <Text style={styles.sectionTitle}>Value Stream Breakdown</Text>
        <View style={[styles.tableRow, { borderBottomWidth: 1 }]}>
          <Text style={[styles.tableCell, styles.tableHeader]}>Value Stream</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>Type</Text>
          <Text style={[styles.tableCellRight, styles.tableHeader]}>Annual Value</Text>
          <Text style={[styles.tableCellRight, styles.tableHeader]}>% of Total</Text>
        </View>
        {streams.map((s) => (
          <View key={s.label} style={styles.tableRow}>
            <Text style={styles.tableCell}>{s.label}</Text>
            <Text style={styles.tableCell}>{s.type}</Text>
            <Text style={styles.tableCellRight}>{fmt(s.value)}</Text>
            <Text style={styles.tableCellRight}>{pct(s.value, outputs.totalAnnualValue)}</Text>
          </View>
        ))}
        <View style={[styles.tableRow, { borderTopWidth: 1.5, borderTopColor: colors.dark }]}>
          <Text style={[styles.tableCell, { fontFamily: 'Helvetica-Bold' }]}>Total Annual Value</Text>
          <Text style={styles.tableCell}></Text>
          <Text style={[styles.tableCellRight, { fontFamily: 'Helvetica-Bold', color: colors.teal }]}>
            {fmt(outputs.totalAnnualValue)}
          </Text>
          <Text style={[styles.tableCellRight, { fontFamily: 'Helvetica-Bold' }]}>100%</Text>
        </View>

        {/* Recommendation */}
        <View style={styles.recommendation}>
          <Text style={styles.recHeadline}>[{recEmoji}] {recHeadline}</Text>
          <Text style={styles.recBody}>{recBody}</Text>
        </View>

        {/* Cost of Inaction */}
        <View style={styles.costOfInaction}>
          <Text style={[styles.recHeadline, { color: colors.red }]}>Competitive Exposure — Cost of Inaction</Text>
          <Text style={styles.recBody}>
            Year 1: {fmt(doNothing.year1Loss)} (-{doNothing.year1ErosionPct}%)  |  Year 2: {fmt(doNothing.year2Loss)} (-{doNothing.year2ErosionPct}%)  |  Year 3: {fmt(doNothing.year3Loss)} (-{doNothing.year3ErosionPct}%)
          </Text>
          <Text style={[styles.recBody, { marginTop: 4, fontSize: 7 }]}>
            Organizations delaying knowledge infrastructure by 12+ months face compounding disadvantages as AI-native competitors encode operational knowledge faster.
          </Text>
        </View>

        {/* Methodology footnote */}
        <View style={styles.methodology}>
          <Text style={{ fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>Methodology</Text>
          <Text>
            Revenue-anchored model using {intensityLabel} agentification intensity assumptions. Benchmarks sourced from Gartner 2025 CMO Spend Survey,
            McKinsey Personalization Analysis, Salesforce State of Marketing 2025, Forrester, and HubSpot.
            Revenue streams (ROAS, Personalization) apply a 20% contribution margin — only profit on incremental revenue is counted.
            Labor savings capped at 40% of team cost to prevent double-counting. Ongoing operational costs (20% of initial
            investment per year) cover LLM tokens, infrastructure, and maintenance. NPV discounted at 10% annual rate.
            IRR computed via Newton-Raphson on monthly cash flows net of ongoing OpEx.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by the Organizational Intelligence ROI Simulator{companyName ? ` for ${companyName}` : ''}</Text>
          <Text>{today}</Text>
        </View>
      </Page>
    </Document>
  );
}

// ─── Public API: generate and download PDF ────────────────────────────
export async function downloadRoiReport(data: ReportData): Promise<void> {
  const blob = await pdf(<RoiReportDocument {...data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const name = data.org.companyName?.trim()
    ? `${data.org.companyName.trim().replace(/\s+/g, '-')}-Investment-Case.pdf`
    : 'Investment-Case-Report.pdf';
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
