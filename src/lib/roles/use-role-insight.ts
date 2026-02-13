// Integration hook bridging role-insight-store and graph-store.
// Activating a role computes the subgraph and applies highlights.
// Next/Prev/GoToSlide update the slide index in the store.

import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useGraphStore } from '../store/graph-store';
import { useRoleInsightStore } from '../store/role-insight-store';

export function useRoleInsight() {
  // graph-store: individual selectors (actions are stable refs)
  const graphData = useGraphStore(s => s.graphData);
  const setHighlightedNodeIds = useGraphStore(s => s.setHighlightedNodeIds);
  const clearHighlights = useGraphStore(s => s.clearHighlights);

  // role-insight-store: useShallow for state, individual for actions
  const { selectedRole, roleSubgraph, isActive, orderedNodeIds, currentSlideIndex } =
    useRoleInsightStore(useShallow(s => ({
      selectedRole: s.selectedRole,
      roleSubgraph: s.roleSubgraph,
      isActive: s.isActive,
      orderedNodeIds: s.orderedNodeIds,
      currentSlideIndex: s.currentSlideIndex,
    })));
  const selectRole = useRoleInsightStore(s => s.selectRole);
  const clearRole = useRoleInsightStore(s => s.clearRole);

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
