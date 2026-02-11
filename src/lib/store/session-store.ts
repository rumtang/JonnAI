import { create } from 'zustand';

interface SessionState {
  // From ROI Simulator
  orgProfile: {
    annualRevenue: number;
    industry: string;
    marketingHeadcount: number;
    companyName: string;
  } | null;

  // From Campaign Walkthrough
  lastCampaignResults: {
    totalSteps: number;
    totalMinutes: number;
    revisions: number;
    escalations: number;
    gatesApproved: number;
    completedAt: number;
  } | null;

  // From Guided Tour
  guidedTourCompleted: boolean;

  // From Role Selection
  selectedRoleId: string | null;

  // Actions
  setOrgProfile: (profile: SessionState['orgProfile']) => void;
  setCampaignResults: (results: SessionState['lastCampaignResults']) => void;
  setGuidedTourCompleted: () => void;
  setSelectedRoleId: (id: string | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  orgProfile: null,
  lastCampaignResults: null,
  guidedTourCompleted: false,
  selectedRoleId: null,

  setOrgProfile: (profile) => set({ orgProfile: profile }),
  setCampaignResults: (results) => set({ lastCampaignResults: results }),
  setGuidedTourCompleted: () => set({ guidedTourCompleted: true }),
  setSelectedRoleId: (id) => set({ selectedRoleId: id }),
}));
