import { create } from 'zustand';
import { PresentationStep } from '../graph/types';

interface PresentationState {
  mode: 'guided' | 'explore' | 'campaign';
  currentStepIndex: number;
  steps: PresentationStep[];
  isPlaying: boolean;
  isTransitioning: boolean;

  setMode: (mode: 'guided' | 'explore' | 'campaign') => void;
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
  currentStepIndex: 0,
  steps: [],
  isPlaying: false,
  isTransitioning: false,

  setMode: (mode) => set({ mode }),
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
