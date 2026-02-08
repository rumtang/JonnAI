import { create } from 'zustand';
import { GraphData, GraphNode } from '../graph/types';
import { RoleDefinition, ROLE_MAP } from '../roles/role-definitions';
import { RoleSubgraph, computeRoleSubgraph } from '../roles/role-subgraph';
import { MAIN_WORKFLOW_ORDER } from '../store/campaign-store';

// Build an ordered walkthrough path for a role using the main workflow order.
// Primary nodes (owned steps + reviewed gates) come first in workflow order,
// then support nodes (agents + inputs) are appended at the end.
function buildWalkthroughPath(role: RoleDefinition, graphData: GraphData): string[] {
  const primaryIds = new Set([...role.ownedSteps, ...role.reviewedGates]);
  const supportIds = new Set([...role.relatedAgents, ...role.relatedInputs]);

  // Order primary nodes by their position in the main workflow
  const orderedPrimary = MAIN_WORKFLOW_ORDER.filter(id => primaryIds.has(id));
  // Add any primary IDs not in the main workflow (shouldn't happen, but safety)
  for (const id of primaryIds) {
    if (!orderedPrimary.includes(id)) orderedPrimary.push(id);
  }

  // Filter to only nodes that actually exist in the graph
  const existingIds = new Set(graphData.nodes.map(n => n.id));
  const primary = orderedPrimary.filter(id => existingIds.has(id));
  const support = [...supportIds].filter(id => existingIds.has(id));

  return [...primary, ...support];
}

interface RoleInsightState {
  selectedRoleId: string | null;
  selectedRole: RoleDefinition | null;
  roleSubgraph: RoleSubgraph | null;
  isActive: boolean;

  // Walkthrough state — step-by-step camera journey through the role's nodes
  walkthroughPath: string[];  // ordered node IDs
  currentStepIndex: number;

  selectRole: (roleId: string, graphData: GraphData) => void;
  clearRole: () => void;
  nextStep: () => string | null;   // returns next node ID or null if at end
  prevStep: () => string | null;   // returns prev node ID or null if at start
  goToStep: (index: number) => string | null;
}

export const useRoleInsightStore = create<RoleInsightState>((set, get) => ({
  selectedRoleId: null,
  selectedRole: null,
  roleSubgraph: null,
  isActive: false,
  walkthroughPath: [],
  currentStepIndex: 0,

  selectRole: (roleId, graphData) => {
    const role = ROLE_MAP.get(roleId);
    if (!role) return;

    const subgraph = computeRoleSubgraph(role, graphData);
    const path = buildWalkthroughPath(role, graphData);

    set({
      selectedRoleId: roleId,
      selectedRole: role,
      roleSubgraph: subgraph,
      isActive: true,
      walkthroughPath: path,
      currentStepIndex: 0,
    });
  },

  clearRole: () => set({
    selectedRoleId: null,
    selectedRole: null,
    roleSubgraph: null,
    isActive: false,
    walkthroughPath: [],
    currentStepIndex: 0,
  }),

  nextStep: () => {
    const { walkthroughPath, currentStepIndex } = get();
    if (currentStepIndex >= walkthroughPath.length - 1) return null;
    const nextIndex = currentStepIndex + 1;
    set({ currentStepIndex: nextIndex });
    return walkthroughPath[nextIndex];
  },

  prevStep: () => {
    const { walkthroughPath, currentStepIndex } = get();
    if (currentStepIndex <= 0) return null;
    const prevIndex = currentStepIndex - 1;
    set({ currentStepIndex: prevIndex });
    return walkthroughPath[prevIndex];
  },

  goToStep: (index) => {
    const { walkthroughPath } = get();
    if (index < 0 || index >= walkthroughPath.length) return null;
    set({ currentStepIndex: index });
    return walkthroughPath[index];
  },
}));
