import { create } from 'zustand';
import { ROI_STEPS } from '@/data/roi-steps';
import { useSessionStore } from './session-store';
import type { RoiShareConfig } from '@/lib/utils/roi-share';
import {
  computeBaseline,
  computeRoi,
  computeWeightedCycleWeeks,
  INTENSITY_PRESETS,
  type OrganizationProfile,
  type MartechAndMedia,
  type ContentAndCampaignOps,
  type OperationalPain,
  type TransformationInvestment,
  type ImprovementAssumptions,
  type Scenario,
  type AgentIntensity,
  type BaselineOutputs,
  type RoiOutputs,
  type ValueStreamKey,
} from '@/lib/roi/engine';

// ─── Enterprise Default Input Values ────────────────────────────────
// Benchmarks: Gartner 2025 CMO Spend Survey, McKinsey, Salesforce,
// Forrester, HubSpot State of Marketing 2025.

const DEFAULT_ORG: OrganizationProfile = {
  annualRevenue: 2_000_000_000,          // $2B — mid-range S&P 100
  marketingBudgetPct: 7.7,               // Gartner 2025: 7.7% of revenue
  marketingHeadcount: 200,               // ~10 FTEs per $100M budget
  avgLoadedFteCost: 180_000,             // Enterprise fully loaded
  industry: 'B2B Average',              // Default industry vertical
  companyName: '',                       // Optional — personalizes outputs
};

const DEFAULT_MARTECH: MartechAndMedia = {
  martechPctOfBudget: 23.8,             // Gartner 2024: 23.8% of mktg budget
  martechToolCount: 120,                 // Industry average tool sprawl
  martechUtilizationPct: 33,             // Gartner: only 33% of capability used
  paidMediaPctOfBudget: 30.6,           // Gartner 2025: 30.6% of mktg budget
  currentBlendedRoas: 2.5,              // Cross-channel blended average
};

const DEFAULT_OPS: ContentAndCampaignOps = {
  monthlyCampaigns: 80,                 // Enterprise scale
  monthlyContentAssets: 500,             // Enterprise content framework
  avgCampaignCycleWeeks: 6,             // Computed from distribution below
  channelCount: 10,                      // Enterprise omnichannel
  agencyPctOfBudget: 15,                // Industry standard
  // Campaign lifecycle distribution defaults (enterprise benchmarks)
  campaignCycleShortPct: 55,            // Quick-turn: email, social, digital promos
  campaignCycleMediumPct: 30,           // Integrated: product launch, seasonal, events
  campaignCycleLongPct: 15,             // Annual: brand campaigns, always-on programs
};

const DEFAULT_PAIN: OperationalPain = {
  reworkRatePct: 20,                     // Brand consistency research
  approvalCycleDays: 7,                  // Enterprise with compliance gates
  adminTimePct: 60,                      // Salesforce: 60% on admin tasks
  marketingWasteRatePct: 30,             // Mid-range of 26–60% estimates
  manualAttributionPct: 33,              // Salesforce: 33% rely on manual
};

const DEFAULT_INVESTMENT: TransformationInvestment = {
  totalInvestmentAmount: 20_000_000,     // $20M over 2 years — user-configurable
  implementationWeeks: 28,               // ~7 months default
};

// Improvement assumptions — independently-verified conservative levels
const DEFAULT_ASSUMPTIONS: ImprovementAssumptions = {
  roasLiftPct: 12,                       // Independent studies 10-15% (vendor claims stripped)
  contentTimeSavingsPct: 40,             // Full production (not just first-draft text)
  personalizationRevLiftPct: 8,          // McKinsey 10-15% is top quartile; median is lower
  cycleTimeReductionPct: 25,             // Achievable with AI-assisted steps (not full automation)
  reworkReductionPct: 40,                // Realistic for Year 1-2 (not full maturity 70%)
  adminToStrategicShiftPct: 30,          // 60% admin → ~42% (not aspirational 30%)
  attributionImprovementPct: 10,         // Conservative; attribution is hard to fix even with AI
  martechUtilizationTargetPct: 50,       // 33% → 50% is achievable (not aspirational 60%)
  martechToolConsolidationPct: 20,       // License contracts + inertia limit consolidation
};

// ─── Compute initial outputs ─────────────────────────────────────────
const initialBaseline = computeBaseline(DEFAULT_ORG, DEFAULT_MARTECH, DEFAULT_OPS, DEFAULT_PAIN);
const initialOutputs = computeRoi(
  DEFAULT_ORG, DEFAULT_MARTECH, DEFAULT_OPS, DEFAULT_PAIN,
  DEFAULT_INVESTMENT, DEFAULT_ASSUMPTIONS,
);

// ─── Store Interface ─────────────────────────────────────────────────
interface RoiState {
  // Navigation
  currentStepIndex: number;
  quickCalcMode: boolean;

  // Input groups
  org: OrganizationProfile;
  martech: MartechAndMedia;
  ops: ContentAndCampaignOps;
  pain: OperationalPain;
  investment: TransformationInvestment;
  assumptions: ImprovementAssumptions;

  // Scenario toggle
  activeScenario: Scenario;

  // Agent intensity level (co-pilot / agentic / autonomous)
  agentIntensity: AgentIntensity;

  // View mode (marketing vs CFO)
  viewMode: 'marketing' | 'cfo';

  // Disabled value streams (toggled off in the UI)
  disabledStreams: Set<ValueStreamKey>;

  // Computed outputs
  baseline: BaselineOutputs;
  outputs: RoiOutputs;

  // Navigation actions
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;

  // Input setters (each triggers recalculate)
  setOrg: (partial: Partial<OrganizationProfile>) => void;
  setMartech: (partial: Partial<MartechAndMedia>) => void;
  setOps: (partial: Partial<ContentAndCampaignOps>) => void;
  setPain: (partial: Partial<OperationalPain>) => void;
  setInvestment: (partial: Partial<TransformationInvestment>) => void;
  setAssumptions: (partial: Partial<ImprovementAssumptions>) => void;
  setAgentIntensity: (level: AgentIntensity) => void;
  setActiveScenario: (scenario: Scenario) => void;
  setViewMode: (mode: 'marketing' | 'cfo') => void;
  setQuickCalcMode: (on: boolean) => void;
  toggleStream: (key: ValueStreamKey) => void;

  // Sharing
  exportConfig: () => RoiShareConfig;
  importConfig: (config: RoiShareConfig) => void;

  // Lifecycle
  reset: () => void;
}

// ─── Helper: recalculate from current state ──────────────────────────
function recalculate(state: {
  org: OrganizationProfile;
  martech: MartechAndMedia;
  ops: ContentAndCampaignOps;
  pain: OperationalPain;
  investment: TransformationInvestment;
  assumptions: ImprovementAssumptions;
  disabledStreams: Set<ValueStreamKey>;
}) {
  return {
    baseline: computeBaseline(state.org, state.martech, state.ops, state.pain),
    outputs: computeRoi(
      state.org, state.martech, state.ops, state.pain,
      state.investment, state.assumptions, state.disabledStreams,
    ),
  };
}

// ─── Store ───────────────────────────────────────────────────────────
export const useRoiStore = create<RoiState>((set, get) => ({
  currentStepIndex: 0,
  quickCalcMode: true,

  org: { ...DEFAULT_ORG },
  martech: { ...DEFAULT_MARTECH },
  ops: { ...DEFAULT_OPS },
  pain: { ...DEFAULT_PAIN },
  investment: { ...DEFAULT_INVESTMENT },
  assumptions: { ...DEFAULT_ASSUMPTIONS },

  activeScenario: 'expected',
  agentIntensity: 'medium',
  viewMode: 'marketing',
  disabledStreams: new Set<ValueStreamKey>(),

  baseline: initialBaseline,
  outputs: initialOutputs,

  nextStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex < ROI_STEPS.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    }
  },

  prevStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },

  goToStep: (index) => {
    if (index >= 0 && index < ROI_STEPS.length) {
      set({ currentStepIndex: index });
    }
  },

  setOrg: (partial) => {
    const state = get();
    const org = { ...state.org, ...partial };
    set({ org, ...recalculate({ ...state, org }) });
    // Sync to cross-mode session store
    useSessionStore.getState().setOrgProfile({
      annualRevenue: org.annualRevenue,
      industry: org.industry || '',
      marketingHeadcount: org.marketingHeadcount,
      companyName: org.companyName || '',
    });
  },

  setMartech: (partial) => {
    const state = get();
    const martech = { ...state.martech, ...partial };
    set({ martech, ...recalculate({ ...state, martech }) });
  },

  setOps: (partial) => {
    const state = get();
    const ops = { ...state.ops, ...partial };
    // Auto-compute weighted average cycle from distribution
    if ('campaignCycleShortPct' in partial || 'campaignCycleMediumPct' in partial || 'campaignCycleLongPct' in partial) {
      ops.avgCampaignCycleWeeks = computeWeightedCycleWeeks(
        ops.campaignCycleShortPct, ops.campaignCycleMediumPct, ops.campaignCycleLongPct,
      );
    }
    set({ ops, ...recalculate({ ...state, ops }) });
  },

  setPain: (partial) => {
    const state = get();
    const pain = { ...state.pain, ...partial };
    set({ pain, ...recalculate({ ...state, pain }) });
  },

  setInvestment: (partial) => {
    const state = get();
    const investment = { ...state.investment, ...partial };
    set({ investment, ...recalculate({ ...state, investment }) });
  },

  setAssumptions: (partial) => {
    const state = get();
    const assumptions = { ...state.assumptions, ...partial };
    set({ assumptions, ...recalculate({ ...state, assumptions }) });
  },

  setAgentIntensity: (level) => {
    const state = get();
    const assumptions = { ...INTENSITY_PRESETS[level] };
    set({ agentIntensity: level, assumptions, ...recalculate({ ...state, assumptions }) });
  },

  setActiveScenario: (scenario) => set({ activeScenario: scenario }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setQuickCalcMode: (on) => set({ quickCalcMode: on, currentStepIndex: on ? 0 : 1 }),

  toggleStream: (key) => {
    const state = get();
    const next = new Set(state.disabledStreams);
    if (next.has(key)) next.delete(key); else next.add(key);
    set({ disabledStreams: next, ...recalculate({ ...state, disabledStreams: next }) });
  },

  exportConfig: () => {
    const { org, investment, agentIntensity, activeScenario, disabledStreams } = get();
    const config: RoiShareConfig = {
      rev: org.annualRevenue,
      ind: org.industry || '',
      name: org.companyName || '',
      hc: org.marketingHeadcount,
      budPct: org.marketingBudgetPct,
      fteCost: org.avgLoadedFteCost,
      intensity: agentIntensity,
      scenario: activeScenario,
      invest: investment.totalInvestmentAmount,
      weeks: investment.implementationWeeks,
    };
    if (disabledStreams.size > 0) {
      config.ds = [...disabledStreams];
    }
    return config;
  },

  importConfig: (config) => {
    const state = get();
    const org = {
      ...state.org,
      annualRevenue: config.rev,
      industry: config.ind,
      companyName: config.name,
      marketingHeadcount: config.hc,
      marketingBudgetPct: config.budPct,
      avgLoadedFteCost: config.fteCost,
    };
    const investment = {
      ...state.investment,
      totalInvestmentAmount: config.invest,
      implementationWeeks: config.weeks,
    };
    const assumptions = { ...INTENSITY_PRESETS[config.intensity] };
    const disabledStreams = new Set<ValueStreamKey>((config.ds ?? []) as ValueStreamKey[]);
    set({
      org,
      investment,
      agentIntensity: config.intensity,
      activeScenario: config.scenario,
      assumptions,
      disabledStreams,
      quickCalcMode: false,
      currentStepIndex: 0,
      ...recalculate({ ...state, org, investment, assumptions, disabledStreams }),
    });
  },

  reset: () => set({
    currentStepIndex: 0,
    quickCalcMode: true,
    org: { ...DEFAULT_ORG },
    martech: { ...DEFAULT_MARTECH },
    ops: { ...DEFAULT_OPS },
    pain: { ...DEFAULT_PAIN },
    investment: { ...DEFAULT_INVESTMENT },
    assumptions: { ...DEFAULT_ASSUMPTIONS },
    activeScenario: 'expected',
    agentIntensity: 'medium',
    viewMode: 'marketing',
    disabledStreams: new Set<ValueStreamKey>(),
    baseline: initialBaseline,
    outputs: initialOutputs,
  }),
}));
