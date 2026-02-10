import { create } from 'zustand';
import { ROI_STEPS } from '@/data/roi-steps';
import {
  computeBaseline,
  computeRoi,
  type OrganizationProfile,
  type MartechAndMedia,
  type ContentAndCampaignOps,
  type OperationalPain,
  type TransformationInvestment,
  type ImprovementAssumptions,
  type Scenario,
  type BaselineOutputs,
  type RoiOutputs,
} from '@/lib/roi/engine';

// ─── Enterprise Default Input Values ────────────────────────────────
// Benchmarks: Gartner 2025 CMO Spend Survey, McKinsey, Salesforce,
// Forrester, HubSpot State of Marketing 2025.

const DEFAULT_ORG: OrganizationProfile = {
  annualRevenue: 2_000_000_000,          // $2B — mid-range S&P 100
  marketingBudgetPct: 7.7,               // Gartner 2025: 7.7% of revenue
  marketingHeadcount: 200,               // ~10 FTEs per $100M budget
  avgLoadedFteCost: 180_000,             // Enterprise fully loaded
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
  avgCampaignCycleWeeks: 6,             // Enterprise average with reviews
  channelCount: 10,                      // Enterprise omnichannel
  agencyPctOfBudget: 15,                // Industry standard
};

const DEFAULT_PAIN: OperationalPain = {
  reworkRatePct: 20,                     // Brand consistency research
  approvalCycleDays: 7,                  // Enterprise with compliance gates
  adminTimePct: 60,                      // Salesforce: 60% on admin tasks
  marketingWasteRatePct: 30,             // Mid-range of 26–60% estimates
  manualAttributionPct: 33,              // Salesforce: 33% rely on manual
};

const DEFAULT_INVESTMENT: TransformationInvestment = {
  totalInvestmentAmount: 3_000_000,      // $3M — user-configurable
  implementationWeeks: 28,               // ~7 months default
};

// Research-backed improvement assumptions — not exposed in UI
const DEFAULT_ASSUMPTIONS: ImprovementAssumptions = {
  roasLiftPct: 20,                       // Meta AI 22%, Google AI 17% → conservative 20%
  contentTimeSavingsPct: 65,             // Documented 75-80% → conservative 65%
  personalizationRevLiftPct: 12,         // McKinsey 10-15% → midpoint 12%
  cycleTimeReductionPct: 40,             // Enterprise documented improvements
  reworkReductionPct: 70,                // At full maturity
  adminToStrategicShiftPct: 50,          // 60% admin → 30% = 50% shift
  attributionImprovementPct: 15,         // Conservative estimate
  martechUtilizationTargetPct: 60,       // From 33% → 60% target
  martechToolConsolidationPct: 30,       // 30% overlap rate
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

  // Input groups
  org: OrganizationProfile;
  martech: MartechAndMedia;
  ops: ContentAndCampaignOps;
  pain: OperationalPain;
  investment: TransformationInvestment;
  assumptions: ImprovementAssumptions;

  // Scenario toggle
  activeScenario: Scenario;

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
  setActiveScenario: (scenario: Scenario) => void;

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
}) {
  return {
    baseline: computeBaseline(state.org, state.martech, state.ops, state.pain),
    outputs: computeRoi(
      state.org, state.martech, state.ops, state.pain,
      state.investment, state.assumptions,
    ),
  };
}

// ─── Store ───────────────────────────────────────────────────────────
export const useRoiStore = create<RoiState>((set, get) => ({
  currentStepIndex: 0,

  org: { ...DEFAULT_ORG },
  martech: { ...DEFAULT_MARTECH },
  ops: { ...DEFAULT_OPS },
  pain: { ...DEFAULT_PAIN },
  investment: { ...DEFAULT_INVESTMENT },
  assumptions: { ...DEFAULT_ASSUMPTIONS },

  activeScenario: 'expected',

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
  },

  setMartech: (partial) => {
    const state = get();
    const martech = { ...state.martech, ...partial };
    set({ martech, ...recalculate({ ...state, martech }) });
  },

  setOps: (partial) => {
    const state = get();
    const ops = { ...state.ops, ...partial };
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

  setActiveScenario: (scenario) => set({ activeScenario: scenario }),

  reset: () => set({
    currentStepIndex: 0,
    org: { ...DEFAULT_ORG },
    martech: { ...DEFAULT_MARTECH },
    ops: { ...DEFAULT_OPS },
    pain: { ...DEFAULT_PAIN },
    investment: { ...DEFAULT_INVESTMENT },
    assumptions: { ...DEFAULT_ASSUMPTIONS },
    activeScenario: 'expected',
    baseline: initialBaseline,
    outputs: initialOutputs,
  }),
}));
