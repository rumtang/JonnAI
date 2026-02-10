import { create } from 'zustand';
import { GraphData, GraphNode } from '../graph/types';
import { RoleDefinition, ROLE_MAP } from '../roles/role-definitions';
import { RoleSubgraph, computeRoleSubgraph } from '../roles/role-subgraph';

// Complete workflow order — all 45 steps and gates in logical pipeline sequence.
// WHY: Every role walks through the entire pipeline so users can see how each
// step affects their work (preAI / aiAgents / aiAgentic), not just owned nodes.
const FULL_WORKFLOW_ORDER = [
  // Plan phase
  'campaign-planning',
  'journey-mapping',
  'receive-request',
  'content-scoring',
  'social-listening',
  'competitive-response',
  'research-insights',
  'influencer-brief',
  'write-brief',
  'brief-approval',
  // Create phase
  'draft-content',
  'visual-asset-creation',
  'seo-optimization',
  'ab-variant-creation',
  'paid-creative-production',
  'sales-enablement',
  'quality-check',
  // Review phase
  'brand-compliance',
  'brand-review',
  'ugc-moderation',
  'legal-review',
  'legal-compliance-gate',
  'final-edit',
  'accessibility-check',
  'stakeholder-signoff',
  // Publish phase
  'localize-content',
  'localization-quality-gate',
  'segment-mapping',
  'personalization-qa',
  'consent-check',
  'dynamic-assembly',
  'channel-orchestration',
  'content-repurposing',
  'schedule-publish',
  'distribute',
  // Measure phase
  'sentiment-monitoring',
  'track-performance',
  'generate-report',
  'attribution-modeling',
  'executive-reporting',
  'archive-tag',
  'content-governance',
  // Optimize phase
  'performance-review',
  'governance-gate',
  'optimize',
];

// Build the walkthrough path: all 45 workflow nodes in pipeline order.
// Every role walks the full pipeline so journey tiles (preAI/aiAgents/aiAgentic)
// are visible for every step, showing how each step affects this role.
function buildWalkthroughPath(role: RoleDefinition, graphData: GraphData): string[] {
  const existingIds = new Set(graphData.nodes.map(n => n.id));

  // Start with the full workflow in order, filtered to nodes that exist in the graph
  const path = FULL_WORKFLOW_ORDER.filter(id => existingIds.has(id));

  // Safety: add any role-specific nodes not already in the path (agents, inputs, or
  // nodes that might have been missed in FULL_WORKFLOW_ORDER)
  const pathSet = new Set(path);
  const extras = [
    ...role.ownedSteps,
    ...role.reviewedGates,
    ...role.relatedAgents,
    ...role.relatedInputs,
  ].filter(id => existingIds.has(id) && !pathSet.has(id));

  return [...path, ...extras];
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
