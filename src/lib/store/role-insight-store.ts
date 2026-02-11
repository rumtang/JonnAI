import { create } from 'zustand';
import { GraphData } from '../graph/types';
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

// Total number of slides: intro + 3 journey stages
const MAX_SLIDE_INDEX = 3;

// Build the ordered node list: only nodes this role owns, reviews, or depends on.
// Pipeline nodes (owned steps + reviewed gates) come first in FULL_WORKFLOW_ORDER
// sequence to preserve logical flow, then agents, then inputs.
function buildOrderedNodeIds(role: RoleDefinition, graphData: GraphData): string[] {
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

  // Ordered node IDs for grouping content across slides
  orderedNodeIds: string[];
  // 4 fixed slides: 0=intro, 1=preAI, 2=aiAgents, 3=aiAgentic
  currentSlideIndex: number;

  selectRole: (roleId: string, graphData: GraphData) => void;
  clearRole: () => void;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
}

export const useRoleInsightStore = create<RoleInsightState>((set, get) => ({
  selectedRoleId: null,
  selectedRole: null,
  roleSubgraph: null,
  isActive: false,
  orderedNodeIds: [],
  currentSlideIndex: 0,

  selectRole: (roleId, graphData) => {
    const role = ROLE_MAP.get(roleId);
    if (!role) return;

    const subgraph = computeRoleSubgraph(role, graphData);
    const nodeIds = buildOrderedNodeIds(role, graphData);

    set({
      selectedRoleId: roleId,
      selectedRole: role,
      roleSubgraph: subgraph,
      isActive: true,
      orderedNodeIds: nodeIds,
      currentSlideIndex: 0,
    });
  },

  clearRole: () => set({
    selectedRoleId: null,
    selectedRole: null,
    roleSubgraph: null,
    isActive: false,
    orderedNodeIds: [],
    currentSlideIndex: 0,
  }),

  nextSlide: () => {
    const { currentSlideIndex } = get();
    if (currentSlideIndex >= MAX_SLIDE_INDEX) return;
    set({ currentSlideIndex: currentSlideIndex + 1 });
  },

  prevSlide: () => {
    const { currentSlideIndex } = get();
    if (currentSlideIndex <= 0) return;
    set({ currentSlideIndex: currentSlideIndex - 1 });
  },

  goToSlide: (index) => {
    if (index < 0 || index > MAX_SLIDE_INDEX) return;
    set({ currentSlideIndex: index });
  },
}));
