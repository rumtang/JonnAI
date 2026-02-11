// Integration hook bridging role-insight-store and graph-store.
// Activating a role computes the subgraph and applies highlights.
// Next/Prev/GoToStep update the walkthrough index in the store.

import { useCallback } from 'react';
import { useGraphStore } from '../store/graph-store';
import { useRoleInsightStore } from '../store/role-insight-store';

export function useRoleInsight() {
  const {
    graphData,
    setHighlightedNodeIds,
    clearHighlights,
  } = useGraphStore();

  const {
    selectedRole,
    roleSubgraph,
    isActive,
    selectRole,
    clearRole,
    walkthroughPath,
    currentStepIndex,
  } = useRoleInsightStore();

  const activateRole = useCallback((roleId: string) => {
    selectRole(roleId, graphData);

    // After selectRole updates the store, read the new subgraph and highlight
    const state = useRoleInsightStore.getState();
    if (state.roleSubgraph) {
      setHighlightedNodeIds(state.roleSubgraph.nodeIds);
    }
  }, [graphData, selectRole, setHighlightedNodeIds]);

  const deactivateRole = useCallback(() => {
    clearRole();
    clearHighlights();
  }, [clearRole, clearHighlights]);

  const goToNextStep = useCallback(() => {
    return useRoleInsightStore.getState().nextStep();
  }, []);

  const goToPrevStep = useCallback(() => {
    return useRoleInsightStore.getState().prevStep();
  }, []);

  const goToStep = useCallback((index: number) => {
    return useRoleInsightStore.getState().goToStep(index);
  }, []);

  return {
    selectedRole,
    roleSubgraph,
    isActive,
    activateRole,
    deactivateRole,
    walkthroughPath,
    currentStepIndex,
    goToNextStep,
    goToPrevStep,
    goToStep,
  };
}
