// ─── ROI Config Sharing ──────────────────────────────────────
// Encodes/decodes ROI simulator inputs for shareable URLs.
// Uses base64url encoding to keep URLs clean.

import type { AgentIntensity, Scenario } from '@/lib/roi/engine';

export interface RoiShareConfig {
  // Org profile (quick calc inputs)
  rev: number;        // annualRevenue
  ind: string;        // industry
  name: string;       // companyName
  hc: number;         // marketingHeadcount
  budPct: number;     // marketingBudgetPct
  fteCost: number;    // avgLoadedFteCost
  // Agent intensity + scenario
  intensity: AgentIntensity;
  scenario: Scenario;
  // Investment
  invest: number;     // totalInvestmentAmount
  weeks: number;      // implementationWeeks
  ds?: string[];      // disabled ValueStreamKey[] (backward-compatible)
}

export function encodeRoiConfig(config: RoiShareConfig): string {
  const json = JSON.stringify(config);
  // btoa with unicode safety
  const encoded = btoa(unescape(encodeURIComponent(json)));
  // Make URL-safe: replace + with -, / with _, strip trailing =
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeRoiConfig(encoded: string): RoiShareConfig | null {
  try {
    // Reverse URL-safe encoding
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    // Re-add padding
    while (base64.length % 4) base64 += '=';
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json) as RoiShareConfig;
  } catch {
    return null;
  }
}

export function buildShareUrl(config: RoiShareConfig): string {
  const encoded = encodeRoiConfig(config);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/graph?roi=${encoded}`;
}
