import { create } from 'zustand';
import { BUILD_STEPS } from '@/data/build-steps';

interface BuildState {
  currentStepIndex: number;
  expandedCards: Set<string>;
  expandedDomain: string | null;  // for hub-spoke slide

  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  toggleCard: (cardId: string) => void;
  setExpandedDomain: (domainId: string | null) => void;
  reset: () => void;
}

export const useBuildStore = create<BuildState>((set, get) => ({
  currentStepIndex: 0,
  expandedCards: new Set<string>(),
  expandedDomain: null,

  nextStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex < BUILD_STEPS.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1, expandedCards: new Set(), expandedDomain: null });
    }
  },

  prevStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1, expandedCards: new Set(), expandedDomain: null });
    }
  },

  goToStep: (index) => {
    if (index >= 0 && index < BUILD_STEPS.length) {
      set({ currentStepIndex: index, expandedCards: new Set(), expandedDomain: null });
    }
  },

  toggleCard: (cardId) => {
    const { expandedCards } = get();
    const next = new Set(expandedCards);
    if (next.has(cardId)) {
      next.delete(cardId);
    } else {
      next.add(cardId);
    }
    set({ expandedCards: next });
  },

  setExpandedDomain: (domainId) => set({ expandedDomain: domainId }),

  reset: () => set({
    currentStepIndex: 0,
    expandedCards: new Set(),
    expandedDomain: null,
  }),
}));
