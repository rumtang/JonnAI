import { create } from 'zustand';
import { GraphData, GraphNode } from '../graph/types';
import { RoleDefinition, ROLE_MAP } from '../roles/role-definitions';
import { RoleSubgraph, computeRoleSubgraph } from '../roles/role-subgraph';

// Complete workflow order — all pipeline steps and gates in logical sequence.
// WHY: Used as an ordering reference so role-specific walkthrough paths
// preserve the pipeline's logical flow (even though each role only visits
// its own subset of nodes).
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

// Build the walkthrough path: only nodes this role owns, reviews, or depends on.
// Pipeline nodes (owned steps + reviewed gates) come first in FULL_WORKFLOW_ORDER
// sequence to preserve logical flow, then agents, then inputs.
function buildWalkthroughPath(role: RoleDefinition, graphData: GraphData): string[] {
  const existingIds = new Set(graphData.nodes.map(n => n.id));

  // Collect the role's pipeline nodes (steps + gates)
  const pipelineSet = new Set([...role.ownedSteps, ...role.reviewedGates]);

  // Keep pipeline nodes in workflow order for logical narrative flow
  const pipelineNodes = FULL_WORKFLOW_ORDER.filter(
    id => pipelineSet.has(id) && existingIds.has(id)
  );

  // Append agents then inputs — order within each group matches role definition
  const agents = role.relatedAgents.filter(id => existingIds.has(id));
  const inputs = role.relatedInputs.filter(id => existingIds.has(id));

  // Deduplicate in case any agent/input ID overlaps with pipeline
  const seen = new Set(pipelineNodes);
  const uniqueAgents = agents.filter(id => !seen.has(id));
  uniqueAgents.forEach(id => seen.add(id));
  const uniqueInputs = inputs.filter(id => !seen.has(id));

  return [...pipelineNodes, ...uniqueAgents, ...uniqueInputs];
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
