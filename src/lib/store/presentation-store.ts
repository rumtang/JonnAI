import { create } from 'zustand';
import { PresentationStep } from '../graph/types';

export type AppMode = 'guided' | 'explore' | 'campaign' | 'build' | 'roi' | 'role';
export type LensType = 'marketing' | 'frontoffice';

interface PresentationState {
  mode: AppMode;
  lens: LensType;
  currentStepIndex: number;
  steps: PresentationStep[];
  isPlaying: boolean;
  isTransitioning: boolean;

  setMode: (mode: AppMode) => void;
  setLens: (lens: LensType) => void;
  setSteps: (steps: PresentationStep[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  toggleAutoPlay: () => void;
  setTransitioning: (val: boolean) => void;
  reset: () => void;
}

export const usePresentationStore = create<PresentationState>((set, get) => ({
  mode: 'guided',
  lens: 'marketing',
  currentStepIndex: 0,
  steps: [],
  isPlaying: false,
  isTransitioning: false,

  setMode: (mode) => set({ mode, currentStepIndex: 0, isPlaying: false, isTransitioning: false }),
  setLens: (lens) => set({ lens }),
  setSteps: (steps) => set({ steps }),

  nextStep: () => {
    const state = get();
    if (state.currentStepIndex < state.steps.length - 1) {
      set({ currentStepIndex: state.currentStepIndex + 1, isTransitioning: true });
    }
  },

  prevStep: () => {
    const state = get();
    if (state.currentStepIndex > 0) {
      set({ currentStepIndex: state.currentStepIndex - 1, isTransitioning: true });
    }
  },

  goToStep: (index) => {
    const state = get();
    if (index >= 0 && index < state.steps.length) {
      set({ currentStepIndex: index, isTransitioning: true });
    }
  },

  toggleAutoPlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setTransitioning: (val) => set({ isTransitioning: val }),

  reset: () => set({
    currentStepIndex: 0,
    isPlaying: false,
    isTransitioning: false,
  }),
}));
