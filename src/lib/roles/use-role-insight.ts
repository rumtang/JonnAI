// Integration hook bridging role-insight-store and graph-store.
// Activating a role computes the subgraph, applies highlights, and flies
// the camera to the first node. Next/Prev step through the walkthrough path.

import { useCallback } from 'react';
import { useGraphStore } from '../store/graph-store';
import { useRoleInsightStore } from '../store/role-insight-store';
import { navigateToNode } from '../utils/camera-navigation';

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

  // Helper: find a node by ID and fly camera to it
  const flyToNodeId = useCallback((nodeId: string) => {
    const node = graphData.nodes.find(n => n.id === nodeId);
    if (node) {
      navigateToNode(node, { distance: 120, duration: 1000 });
    }
  }, [graphData.nodes]);

  const activateRole = useCallback((roleId: string) => {
    selectRole(roleId, graphData);

    // After selectRole updates the store, read the new subgraph and highlight
    const state = useRoleInsightStore.getState();
    if (state.roleSubgraph) {
      setHighlightedNodeIds(state.roleSubgraph.nodeIds);
    }

    // Fly camera to the first node in the walkthrough
    if (state.walkthroughPath.length > 0) {
      const firstNodeId = state.walkthroughPath[0];
      const firstNode = graphData.nodes.find(n => n.id === firstNodeId);
      if (firstNode) {
        // Small delay so the graph highlights settle before camera moves
        setTimeout(() => {
          navigateToNode(firstNode, { distance: 120, duration: 1200 });
        }, 200);
      }
    }
  }, [graphData, selectRole, setHighlightedNodeIds]);

  const deactivateRole = useCallback(() => {
    clearRole();
    clearHighlights();
  }, [clearRole, clearHighlights]);

  const goToNextStep = useCallback(() => {
    const nextId = useRoleInsightStore.getState().nextStep();
    if (nextId) {
      flyToNodeId(nextId);
    }
    return nextId;
  }, [flyToNodeId]);

  const goToPrevStep = useCallback(() => {
    const prevId = useRoleInsightStore.getState().prevStep();
    if (prevId) {
      flyToNodeId(prevId);
    }
    return prevId;
  }, [flyToNodeId]);

  const goToStep = useCallback((index: number) => {
    const nodeId = useRoleInsightStore.getState().goToStep(index);
    if (nodeId) {
      flyToNodeId(nodeId);
    }
    return nodeId;
  }, [flyToNodeId]);

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
