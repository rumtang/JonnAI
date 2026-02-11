// Integration hook bridging role-insight-store and graph-store.
// Activating a role computes the subgraph and applies highlights.
// Next/Prev/GoToSlide update the slide index in the store.

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
    orderedNodeIds,
    currentSlideIndex,
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

  const goToNextSlide = useCallback(() => {
    useRoleInsightStore.getState().nextSlide();
  }, []);

  const goToPrevSlide = useCallback(() => {
    useRoleInsightStore.getState().prevSlide();
  }, []);

  const goToSlide = useCallback((index: number) => {
    useRoleInsightStore.getState().goToSlide(index);
  }, []);

  return {
    selectedRole,
    roleSubgraph,
    isActive,
    activateRole,
    deactivateRole,
    orderedNodeIds,
    currentSlideIndex,
    goToNextSlide,
    goToPrevSlide,
    goToSlide,
  };
}
