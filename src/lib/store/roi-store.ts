import { create } from 'zustand';
import { ROI_STEPS } from '@/data/roi-steps';
import {
  computeBaseline,
  computeRoi,
  type TeamProfile,
  type CampaignVolume,
  type CurrentPain,
  type HiddenCosts,
  type TimeAllocation,
  type Scenario,
  type BaselineOutputs,
  type RoiOutputs,
} from '@/lib/roi/engine';

// ─── Default Input Values ────────────────────────────────────────────
const DEFAULT_TEAM: TeamProfile = {
  headcount: 12,
  avgSalary: 120000,
  managerCount: 3,
  specialistCount: 6,
  coordinatorCount: 3,
};

const DEFAULT_VOLUME: CampaignVolume = {
  monthlyCampaigns: 8,
  avgCycleTimeDays: 21,
  channelCount: 5,
};

const DEFAULT_PAIN: CurrentPain = {
  reworkRatePct: 15,
  approvalBottleneckDays: 3,
  complianceReviewHours: 12,
};

const DEFAULT_HIDDEN: HiddenCosts = {
  monthlyAgencySpend: 25000,
  toolOverlapCount: 3,
  missedDeadlineCostPerMonth: 8000,
};

const DEFAULT_TIME_ALLOCATION: TimeAllocation = {
  humanOnlyPct: 40,
  approvalGatedPct: 30,
  supervisedPct: 20,
  autonomousPct: 10,
};

// ─── Compute initial outputs ─────────────────────────────────────────
const initialBaseline = computeBaseline(DEFAULT_TEAM, DEFAULT_VOLUME, DEFAULT_PAIN, DEFAULT_HIDDEN);
const initialOutputs = computeRoi(DEFAULT_TEAM, DEFAULT_VOLUME, DEFAULT_PAIN, DEFAULT_HIDDEN, DEFAULT_TIME_ALLOCATION);

// ─── Store Interface ─────────────────────────────────────────────────
interface RoiState {
  // Navigation
  currentStepIndex: number;

  // Act 1 inputs
  team: TeamProfile;
  volume: CampaignVolume;
  pain: CurrentPain;
  hidden: HiddenCosts;

  // Act 2 inputs
  timeAllocation: TimeAllocation;

  // Act 3 controls
  activeScenario: Scenario;

  // Computed outputs
  baseline: BaselineOutputs;
  outputs: RoiOutputs;

  // Navigation actions
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;

  // Input setters (each triggers recalculate)
  setTeam: (partial: Partial<TeamProfile>) => void;
  setVolume: (partial: Partial<CampaignVolume>) => void;
  setPain: (partial: Partial<CurrentPain>) => void;
  setHidden: (partial: Partial<HiddenCosts>) => void;
  setTimeAllocation: (partial: Partial<TimeAllocation>) => void;
  setActiveScenario: (scenario: Scenario) => void;

  // Lifecycle
  reset: () => void;
}

// ─── Helper: recalculate from current state ──────────────────────────
function recalculate(state: {
  team: TeamProfile;
  volume: CampaignVolume;
  pain: CurrentPain;
  hidden: HiddenCosts;
  timeAllocation: TimeAllocation;
}) {
  return {
    baseline: computeBaseline(state.team, state.volume, state.pain, state.hidden),
    outputs: computeRoi(state.team, state.volume, state.pain, state.hidden, state.timeAllocation),
  };
}

// ─── Store ───────────────────────────────────────────────────────────
export const useRoiStore = create<RoiState>((set, get) => ({
  currentStepIndex: 0,

  team: { ...DEFAULT_TEAM },
  volume: { ...DEFAULT_VOLUME },
  pain: { ...DEFAULT_PAIN },
  hidden: { ...DEFAULT_HIDDEN },
  timeAllocation: { ...DEFAULT_TIME_ALLOCATION },

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

  setTeam: (partial) => {
    const state = get();
    const team = { ...state.team, ...partial };
    set({ team, ...recalculate({ ...state, team }) });
  },

  setVolume: (partial) => {
    const state = get();
    const volume = { ...state.volume, ...partial };
    set({ volume, ...recalculate({ ...state, volume }) });
  },

  setPain: (partial) => {
    const state = get();
    const pain = { ...state.pain, ...partial };
    set({ pain, ...recalculate({ ...state, pain }) });
  },

  setHidden: (partial) => {
    const state = get();
    const hidden = { ...state.hidden, ...partial };
    set({ hidden, ...recalculate({ ...state, hidden }) });
  },

  setTimeAllocation: (partial) => {
    const state = get();
    const timeAllocation = { ...state.timeAllocation, ...partial };
    set({ timeAllocation, ...recalculate({ ...state, timeAllocation }) });
  },

  setActiveScenario: (scenario) => set({ activeScenario: scenario }),

  reset: () => set({
    currentStepIndex: 0,
    team: { ...DEFAULT_TEAM },
    volume: { ...DEFAULT_VOLUME },
    pain: { ...DEFAULT_PAIN },
    hidden: { ...DEFAULT_HIDDEN },
    timeAllocation: { ...DEFAULT_TIME_ALLOCATION },
    activeScenario: 'expected',
    baseline: initialBaseline,
    outputs: initialOutputs,
  }),
}));
