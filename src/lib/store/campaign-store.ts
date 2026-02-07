import { create } from 'zustand';
import { GraphNode, GraphLink, StepMeta, GateMeta } from '../graph/types';

// The main workflow path (flows-to chain) — used to determine "next node"
const MAIN_WORKFLOW_ORDER = [
  'receive-request',
  'research-insights',
  'write-brief',
  'brief-approval',
  'draft-content',
  'seo-optimization',
  'quality-check',
  'brand-compliance',
  'brand-review',
  'final-edit',
  'stakeholder-signoff',
  'schedule-publish',
  'distribute',
  'track-performance',
  'generate-report',
  'performance-review',
  'optimize',
];

export interface CampaignLogEntry {
  nodeId: string;
  nodeLabel: string;
  nodeType: 'step' | 'gate' | 'agent' | 'input';
  action: string;         // e.g. "Completed", "Decision: Approve", "Returned to"
  estimatedTime: string;
  owner: string;          // "Human", "AI: Research Agent", "Shared"
  timestamp: number;
  icon: string;           // emoji for the log entry
}

export interface CampaignDecision {
  gateId: string;
  decision: string;
  timestamp: number;
}

interface CampaignState {
  isActive: boolean;
  campaignName: string;
  currentNodeId: string;
  visitedNodes: string[];
  decisions: CampaignDecision[];
  revisionCount: number;
  escalationCount: number;
  totalEstimatedMinutes: number;
  stepCount: number;
  log: CampaignLogEntry[];
  isComplete: boolean;

  // Actions
  startCampaign: () => void;
  endCampaign: () => void;
  setCampaignName: (name: string) => void;
  advanceToNext: (graphData: { nodes: GraphNode[]; links: GraphLink[] }) => GraphNode | null;
  makeGateDecision: (
    decision: string,
    graphData: { nodes: GraphNode[]; links: GraphLink[] }
  ) => GraphNode | null;
  resetCampaign: () => void;
}

// Parse "30 min", "15 min", "10 min", "Continuous" into minutes
function parseEstimatedMinutes(time?: string): number {
  if (!time) return 0;
  const match = time.match(/(\d+)\s*min/i);
  if (match) return parseInt(match[1], 10);
  if (time.toLowerCase() === 'continuous') return 5; // estimate for continuous tasks
  return 0;
}

function getOwnerLabel(node: GraphNode): string {
  if (node.type === 'step') {
    const meta = node.meta as StepMeta;
    if (meta?.owner === 'agent') return `AI: ${meta.agentName || 'Agent'}`;
    if (meta?.owner === 'human') return 'Human';
    return 'Shared';
  }
  if (node.type === 'gate') {
    const meta = node.meta as GateMeta;
    return meta?.reviewer || 'Reviewer';
  }
  return '';
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
  isActive: false,
  campaignName: 'Content Campaign',
  currentNodeId: 'receive-request',
  visitedNodes: [],
  decisions: [],
  revisionCount: 0,
  escalationCount: 0,
  totalEstimatedMinutes: 0,
  stepCount: 0,
  log: [],
  isComplete: false,

  startCampaign: () => {
    set({
      isActive: true,
      currentNodeId: 'receive-request',
      visitedNodes: ['receive-request'],
      decisions: [],
      revisionCount: 0,
      escalationCount: 0,
      totalEstimatedMinutes: 0,
      stepCount: 1,
      log: [],
      isComplete: false,
    });
  },

  endCampaign: () => set({ isActive: false }),

  setCampaignName: (name) => set({ campaignName: name }),

  // For step nodes — advance along the flows-to chain
  advanceToNext: (graphData) => {
    const state = get();
    const currentId = state.currentNodeId;
    const currentNode = graphData.nodes.find(n => n.id === currentId);
    if (!currentNode) return null;

    // Log the completed step
    const estTime = currentNode.type === 'step'
      ? (currentNode.meta as StepMeta)?.estimatedTime || ''
      : '';
    const minutes = parseEstimatedMinutes(estTime);

    const logEntry: CampaignLogEntry = {
      nodeId: currentId,
      nodeLabel: currentNode.label,
      nodeType: currentNode.type,
      action: 'Completed',
      estimatedTime: estTime,
      owner: getOwnerLabel(currentNode),
      timestamp: Date.now(),
      icon: '\u2705',
    };

    // Find the next node via flows-to
    const flowsToLink = graphData.links.find(l => {
      const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
      return sId === currentId && l.type === 'flows-to';
    });

    if (!flowsToLink) return null;

    const nextId = typeof flowsToLink.target === 'object'
      ? (flowsToLink.target as GraphNode).id
      : flowsToLink.target;
    const nextNode = graphData.nodes.find(n => n.id === nextId);
    if (!nextNode) return null;

    set({
      currentNodeId: nextId,
      visitedNodes: [...state.visitedNodes, nextId],
      totalEstimatedMinutes: state.totalEstimatedMinutes + minutes,
      stepCount: state.stepCount + 1,
      log: [logEntry, ...state.log],
    });

    return nextNode;
  },

  // For gate nodes — handle decision branching
  makeGateDecision: (decision, graphData) => {
    const state = get();
    const currentId = state.currentNodeId;
    const currentNode = graphData.nodes.find(n => n.id === currentId);
    if (!currentNode) return null;

    const d = decision.toLowerCase();
    let targetNode: GraphNode | null = null;
    let icon = '\u2696\uFE0F';
    let action = `Decision: ${decision}`;
    let revisionInc = 0;
    let escalationInc = 0;

    if (d === 'approve' || d === 'pass') {
      // Advance via flows-to
      const link = graphData.links.find(l => {
        const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
        return sId === currentId && l.type === 'flows-to';
      });
      if (link) {
        const tId = typeof link.target === 'object' ? (link.target as GraphNode).id : link.target;
        targetNode = graphData.nodes.find(n => n.id === tId) || null;
      }
      icon = '\u2705';
      action = `Decision: ${decision} \u2713`;
    } else if (d === 'revise' || d === 'flag' || d === 'iterate') {
      // Follow returns-to link
      const link = graphData.links.find(l => {
        const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
        return sId === currentId && l.type === 'returns-to';
      });
      if (link) {
        const tId = typeof link.target === 'object' ? (link.target as GraphNode).id : link.target;
        targetNode = graphData.nodes.find(n => n.id === tId) || null;
      }
      icon = '\uD83D\uDD04';
      action = `Decision: ${decision} \u21A9`;
      revisionInc = 1;
    } else if (d.startsWith('escalate')) {
      // Follow escalates-to link
      const link = graphData.links.find(l => {
        const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
        return sId === currentId && l.type === 'escalates-to';
      });
      if (link) {
        const tId = typeof link.target === 'object' ? (link.target as GraphNode).id : link.target;
        targetNode = graphData.nodes.find(n => n.id === tId) || null;
      }
      icon = '\uD83D\uDEA8';
      action = `Decision: ${decision} \u26A0`;
      escalationInc = 1;
    } else if (d === 'optimize') {
      // Follow flows-to link (optimize leads to draft-content)
      const link = graphData.links.find(l => {
        const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
        return sId === currentId && l.type === 'flows-to';
      });
      if (link) {
        const tId = typeof link.target === 'object' ? (link.target as GraphNode).id : link.target;
        targetNode = graphData.nodes.find(n => n.id === tId) || null;
      }
      icon = '\uD83D\uDD04';
      action = `Decision: ${decision}`;
    } else if (d === 'archive') {
      // End the campaign
      icon = '\uD83D\uDCE6';
      action = `Decision: ${decision} — Campaign Complete`;
    } else if (d === 'hold') {
      // End the campaign (hold = paused)
      icon = '\u23F8\uFE0F';
      action = `Decision: ${decision} — Campaign Paused`;
    }

    const logEntry: CampaignLogEntry = {
      nodeId: currentId,
      nodeLabel: currentNode.label,
      nodeType: 'gate',
      action,
      estimatedTime: '',
      owner: getOwnerLabel(currentNode),
      timestamp: Date.now(),
      icon,
    };

    // Archive or Hold ends the campaign
    if (d === 'archive' || d === 'hold') {
      set({
        decisions: [...state.decisions, { gateId: currentId, decision, timestamp: Date.now() }],
        log: [logEntry, ...state.log],
        isComplete: true,
        revisionCount: state.revisionCount + revisionInc,
        escalationCount: state.escalationCount + escalationInc,
      });
      return null;
    }

    if (!targetNode) return null;

    // Log revision return if applicable
    const logEntries = [logEntry];
    if (revisionInc > 0 && targetNode) {
      logEntries.unshift({
        nodeId: targetNode.id,
        nodeLabel: targetNode.label,
        nodeType: targetNode.type,
        action: `Returned to (revision ${state.revisionCount + revisionInc})`,
        estimatedTime: '',
        owner: '',
        timestamp: Date.now(),
        icon: '\uD83D\uDD04',
      });
    }

    set({
      currentNodeId: targetNode.id,
      visitedNodes: [...state.visitedNodes, targetNode.id],
      decisions: [...state.decisions, { gateId: currentId, decision, timestamp: Date.now() }],
      revisionCount: state.revisionCount + revisionInc,
      escalationCount: state.escalationCount + escalationInc,
      stepCount: state.stepCount + 1,
      log: [...logEntries.reverse(), ...state.log],
    });

    return targetNode;
  },

  resetCampaign: () => set({
    isActive: false,
    campaignName: 'Content Campaign',
    currentNodeId: 'receive-request',
    visitedNodes: [],
    decisions: [],
    revisionCount: 0,
    escalationCount: 0,
    totalEstimatedMinutes: 0,
    stepCount: 0,
    log: [],
    isComplete: false,
  }),
}));

/**
 * Get the current phase from a node ID, looking up the node in the graph data.
 */
export function getPhaseForNode(nodeId: string, nodes: GraphNode[]): string {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return '';
  if (node.type === 'step') return (node.meta as StepMeta)?.phase || node.group || '';
  // For gates, use the group field which maps to the phase
  return node.group || '';
}

export { MAIN_WORKFLOW_ORDER };
