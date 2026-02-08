// Integration hook bridging role-insight-store and graph-store.
// Activating a role computes the subgraph, applies highlights, and flies
// the camera to the first node. Next/Prev step through the walkthrough path.
//
// IMPORTANT: Camera navigation must read nodes from getState() at call time,
// not from the hook closure. The force-graph engine mutates node objects to
// add x/y/z positions — a stale closure may have nodes without positions.

import { useCallback } from 'react';
import { useGraphStore } from '../store/graph-store';
import { useRoleInsightStore } from '../store/role-insight-store';
import { navigateToNode } from '../utils/camera-navigation';

// Camera distance for role walkthrough — close enough to feel immersive
const ROLE_CAM_DISTANCE = 60;

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

  // Helper: find a node by ID from the LIVE store (not closure) and fly camera to it
  const flyToNodeId = useCallback((nodeId: string) => {
    // Read from getState() to get force-graph-mutated nodes with x/y/z positions
    const liveNodes = useGraphStore.getState().graphData.nodes;
    const node = liveNodes.find(n => n.id === nodeId);
    if (node) {
      navigateToNode(node, { distance: ROLE_CAM_DISTANCE, duration: 1000 });
    }
  }, []);

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
      // Small delay so the graph highlights settle before camera moves
      setTimeout(() => {
        // Read live nodes at fly time, not from closure
        const liveNodes = useGraphStore.getState().graphData.nodes;
        const firstNode = liveNodes.find(n => n.id === firstNodeId);
        if (firstNode) {
          navigateToNode(firstNode, { distance: ROLE_CAM_DISTANCE, duration: 1200 });
        }
      }, 300);
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
