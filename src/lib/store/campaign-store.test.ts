import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock session-store before importing campaign-store, since it calls useSessionStore.getState()
const mockSetCampaignResults = vi.fn();
vi.mock('./session-store', () => ({
  useSessionStore: {
    getState: () => ({
      setCampaignResults: mockSetCampaignResults,
    }),
  },
}));

import { useCampaignStore } from './campaign-store';
import { GraphNode, GraphLink, StepMeta, GateMeta } from '../graph/types';

// --- Test fixtures ---

const mockNodes: GraphNode[] = [
  {
    id: 'campaign-planning',
    type: 'step',
    label: 'Campaign Planning',
    description: 'Plan the campaign',
    meta: {
      phase: 'Plan',
      owner: 'human',
      inputs: [],
      outputs: [],
      estimatedTime: '30 min',
    } as StepMeta,
  },
  {
    id: 'journey-mapping',
    type: 'step',
    label: 'Journey Mapping',
    description: 'Map the journey',
    meta: {
      phase: 'Plan',
      owner: 'agent',
      agentName: 'Journey Agent',
      inputs: [],
      outputs: [],
      estimatedTime: '15 min',
    } as StepMeta,
  },
  {
    id: 'brief-approval',
    type: 'gate',
    label: 'Brief Approval',
    description: 'Approve the brief',
    meta: {
      gateType: 'approval',
      reviewer: 'Content Director',
      escalationTrigger: 'fail',
      decisions: ['Approve', 'Revise', 'Escalate'],
    } as GateMeta,
  },
  {
    id: 'draft-content',
    type: 'step',
    label: 'Draft Content',
    description: 'Draft the content',
    meta: {
      phase: 'Create',
      owner: 'agent',
      agentName: 'Writer Agent',
      inputs: [],
      outputs: [],
      estimatedTime: '20 min',
    } as StepMeta,
  },
  {
    id: 'escalation-target',
    type: 'step',
    label: 'Escalation Target',
    description: 'Handle escalated items',
    meta: {
      phase: 'Review',
      owner: 'human',
      inputs: [],
      outputs: [],
    } as StepMeta,
  },
];

const mockLinks: GraphLink[] = [
  { source: 'campaign-planning', target: 'journey-mapping', type: 'flows-to' },
  { source: 'journey-mapping', target: 'brief-approval', type: 'flows-to' },
  { source: 'brief-approval', target: 'draft-content', type: 'flows-to' },
  { source: 'brief-approval', target: 'campaign-planning', type: 'returns-to' },
  { source: 'brief-approval', target: 'escalation-target', type: 'escalates-to' },
];

const mockGraphData = { nodes: mockNodes, links: mockLinks };

// --- Initial state for resetting ---

const initialState = {
  isActive: false,
  campaignName: 'Content Campaign',
  currentNodeId: 'campaign-planning',
  visitedNodes: [] as string[],
  decisions: [] as { gateId: string; decision: string; timestamp: number }[],
  revisionCount: 0,
  escalationCount: 0,
  totalEstimatedMinutes: 0,
  stepCount: 0,
  log: [] as any[],
  isComplete: false,
};

describe('useCampaignStore', () => {
  beforeEach(() => {
    useCampaignStore.setState(initialState);
    vi.clearAllMocks();
  });

  describe('startCampaign', () => {
    it('initializes state correctly', () => {
      useCampaignStore.getState().startCampaign();

      const state = useCampaignStore.getState();
      expect(state.isActive).toBe(true);
      expect(state.currentNodeId).toBe('campaign-planning');
      expect(state.visitedNodes).toEqual(['campaign-planning']);
      expect(state.decisions).toEqual([]);
      expect(state.revisionCount).toBe(0);
      expect(state.escalationCount).toBe(0);
      expect(state.totalEstimatedMinutes).toBe(0);
      expect(state.stepCount).toBe(1);
      expect(state.log).toEqual([]);
      expect(state.isComplete).toBe(false);
    });
  });

  describe('advanceToNext', () => {
    beforeEach(() => {
      useCampaignStore.getState().startCampaign();
    });

    it('follows flows-to links', () => {
      const nextNode = useCampaignStore.getState().advanceToNext(mockGraphData);

      expect(nextNode).not.toBeNull();
      expect(nextNode!.id).toBe('journey-mapping');
      expect(useCampaignStore.getState().currentNodeId).toBe('journey-mapping');
    });

    it('adds the new node to visitedNodes', () => {
      useCampaignStore.getState().advanceToNext(mockGraphData);

      expect(useCampaignStore.getState().visitedNodes).toContain('journey-mapping');
    });

    it('logs the completed step with correct time estimate', () => {
      // Start at campaign-planning (30 min)
      useCampaignStore.getState().advanceToNext(mockGraphData);

      const state = useCampaignStore.getState();
      expect(state.log).toHaveLength(1);
      expect(state.log[0].nodeId).toBe('campaign-planning');
      expect(state.log[0].action).toBe('Completed');
      expect(state.log[0].estimatedTime).toBe('30 min');
      expect(state.totalEstimatedMinutes).toBe(30);
    });

    it('increments stepCount', () => {
      // stepCount starts at 1 from startCampaign
      useCampaignStore.getState().advanceToNext(mockGraphData);

      expect(useCampaignStore.getState().stepCount).toBe(2);
    });

    it('returns null when no flows-to link exists', () => {
      // Move to a node with no outgoing flows-to
      useCampaignStore.setState({ currentNodeId: 'escalation-target' });

      const result = useCampaignStore.getState().advanceToNext(mockGraphData);

      expect(result).toBeNull();
    });

    it('returns null when current node not found in data', () => {
      useCampaignStore.setState({ currentNodeId: 'nonexistent' });

      const result = useCampaignStore.getState().advanceToNext(mockGraphData);

      expect(result).toBeNull();
    });
  });

  describe('makeGateDecision', () => {
    beforeEach(() => {
      // Set up state so we're at the brief-approval gate
      useCampaignStore.setState({
        isActive: true,
        currentNodeId: 'brief-approval',
        visitedNodes: ['campaign-planning', 'journey-mapping', 'brief-approval'],
        stepCount: 3,
        totalEstimatedMinutes: 45,
        revisionCount: 0,
        escalationCount: 0,
        decisions: [],
        log: [],
        isComplete: false,
      });
    });

    it('approve follows flows-to', () => {
      const nextNode = useCampaignStore.getState().makeGateDecision('Approve', mockGraphData);

      expect(nextNode).not.toBeNull();
      expect(nextNode!.id).toBe('draft-content');
      expect(useCampaignStore.getState().currentNodeId).toBe('draft-content');
    });

    it('approve records the decision', () => {
      useCampaignStore.getState().makeGateDecision('Approve', mockGraphData);

      const state = useCampaignStore.getState();
      expect(state.decisions).toHaveLength(1);
      expect(state.decisions[0].gateId).toBe('brief-approval');
      expect(state.decisions[0].decision).toBe('Approve');
    });

    it('revise follows returns-to and increments revisionCount', () => {
      const nextNode = useCampaignStore.getState().makeGateDecision('Revise', mockGraphData);

      expect(nextNode).not.toBeNull();
      expect(nextNode!.id).toBe('campaign-planning');
      expect(useCampaignStore.getState().currentNodeId).toBe('campaign-planning');
      expect(useCampaignStore.getState().revisionCount).toBe(1);
    });

    it('revise adds 50% penalty of target step time', () => {
      // campaign-planning has estimatedTime "30 min" => penalty = 15
      useCampaignStore.getState().makeGateDecision('Revise', mockGraphData);

      // Started at 45 min, penalty = Math.round(30 * 0.5) = 15
      expect(useCampaignStore.getState().totalEstimatedMinutes).toBe(60);
    });

    it('escalate follows escalates-to and adds 60min penalty', () => {
      const nextNode = useCampaignStore.getState().makeGateDecision('Escalate', mockGraphData);

      expect(nextNode).not.toBeNull();
      expect(nextNode!.id).toBe('escalation-target');
      expect(useCampaignStore.getState().currentNodeId).toBe('escalation-target');
      expect(useCampaignStore.getState().escalationCount).toBe(1);
      expect(useCampaignStore.getState().totalEstimatedMinutes).toBe(105); // 45 + 60
    });

    it('archive ends campaign (isComplete = true)', () => {
      const result = useCampaignStore.getState().makeGateDecision('Archive', mockGraphData);

      expect(result).toBeNull(); // archive returns null
      expect(useCampaignStore.getState().isComplete).toBe(true);
    });

    it('archive calls setCampaignResults on session store', () => {
      useCampaignStore.getState().makeGateDecision('Archive', mockGraphData);

      expect(mockSetCampaignResults).toHaveBeenCalledTimes(1);
      const results = mockSetCampaignResults.mock.calls[0][0];
      expect(results.totalSteps).toBe(3);
      expect(results.totalMinutes).toBe(45);
    });

    it('adds log entries for decisions', () => {
      useCampaignStore.getState().makeGateDecision('Approve', mockGraphData);

      const state = useCampaignStore.getState();
      expect(state.log.length).toBeGreaterThanOrEqual(1);
      // The gate decision log entry should reference brief-approval
      const gateLog = state.log.find(e => e.nodeId === 'brief-approval');
      expect(gateLog).toBeDefined();
      expect(gateLog!.action).toContain('Approve');
    });

    it('revise creates a "Returned to" log entry', () => {
      useCampaignStore.getState().makeGateDecision('Revise', mockGraphData);

      const state = useCampaignStore.getState();
      const returnLog = state.log.find(e => e.action.startsWith('Returned to'));
      expect(returnLog).toBeDefined();
      expect(returnLog!.nodeId).toBe('campaign-planning');
    });
  });

  describe('resetCampaign', () => {
    it('restores all state', () => {
      // Dirty the state
      useCampaignStore.setState({
        isActive: true,
        campaignName: 'Custom Campaign',
        currentNodeId: 'draft-content',
        visitedNodes: ['campaign-planning', 'draft-content'],
        decisions: [{ gateId: 'g1', decision: 'approve', timestamp: 1234 }],
        revisionCount: 3,
        escalationCount: 1,
        totalEstimatedMinutes: 120,
        stepCount: 5,
        log: [{ nodeId: 'x', nodeLabel: 'X', nodeType: 'step', action: 'Completed', estimatedTime: '', owner: '', timestamp: 1, icon: '' }],
        isComplete: true,
      });

      useCampaignStore.getState().resetCampaign();

      const state = useCampaignStore.getState();
      expect(state.isActive).toBe(false);
      expect(state.campaignName).toBe('Content Campaign');
      expect(state.currentNodeId).toBe('campaign-planning');
      expect(state.visitedNodes).toEqual([]);
      expect(state.decisions).toEqual([]);
      expect(state.revisionCount).toBe(0);
      expect(state.escalationCount).toBe(0);
      expect(state.totalEstimatedMinutes).toBe(0);
      expect(state.stepCount).toBe(0);
      expect(state.log).toEqual([]);
      expect(state.isComplete).toBe(false);
    });
  });
});
