import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useGraphStore } from './graph-store';
import { GraphNode, GraphLink, NodeType, LinkType } from '../graph/types';

// --- Test fixtures ---

const stepNode = (id: string): GraphNode => ({
  id,
  type: 'step',
  label: `Step ${id}`,
  description: `Description of ${id}`,
});

const gateNode = (id: string): GraphNode => ({
  id,
  type: 'gate',
  label: `Gate ${id}`,
  description: `Description of ${id}`,
});

const agentNode = (id: string): GraphNode => ({
  id,
  type: 'agent',
  label: `Agent ${id}`,
  description: `Description of ${id}`,
});

const inputNode = (id: string): GraphNode => ({
  id,
  type: 'input',
  label: `Input ${id}`,
  description: `Description of ${id}`,
});

const link = (source: string, target: string, type: LinkType): GraphLink => ({
  source,
  target,
  type,
});

const ALL_NODE_TYPES: NodeType[] = ['step', 'gate', 'agent', 'input'];
const ALL_LINK_TYPES: LinkType[] = [
  'flows-to', 'reviews', 'escalates-to', 'uses', 'performs', 'returns-to', 'linear-flow',
];

// Build a small graph for testing
const testNodes: GraphNode[] = [
  stepNode('s1'),
  stepNode('s2'),
  gateNode('g1'),
  agentNode('a1'),
  inputNode('i1'),
];

const testLinks: GraphLink[] = [
  link('s1', 's2', 'flows-to'),
  link('s1', 'g1', 'flows-to'),
  link('a1', 's1', 'performs'),
  link('s2', 'i1', 'uses'),
];

const testGraphData = { nodes: testNodes, links: testLinks };

// --- Initial state for resetting ---

const initialState = {
  graphData: { nodes: [] as GraphNode[], links: [] as GraphLink[] },
  fullGraphData: null,
  linearGraphData: null,
  viewMode: 'linear' as const,
  selectedNode: null,
  hoveredNode: null,
  highlightedNodeIds: new Set<string>(),
  highlightedLinkIndices: new Set<number>(),
  highlightedLinkTypes: new Set<LinkType>(),
  navigationHistory: [] as GraphNode[],
  flashingLinkKey: null,
  visibleNodeTypes: new Set<NodeType>(ALL_NODE_TYPES),
  visibleLinkTypes: new Set<LinkType>(ALL_LINK_TYPES),
  searchQuery: '',
  revealedNodeIds: new Set<string>(),
  coreNodeIds: new Set<string>(),
  progressiveReveal: false,
};

describe('useGraphStore', () => {
  beforeEach(() => {
    useGraphStore.setState({
      ...initialState,
      // Ensure fresh Set instances each test
      highlightedNodeIds: new Set<string>(),
      highlightedLinkIndices: new Set<number>(),
      highlightedLinkTypes: new Set<LinkType>(),
      visibleNodeTypes: new Set<NodeType>(ALL_NODE_TYPES),
      visibleLinkTypes: new Set<LinkType>(ALL_LINK_TYPES),
      revealedNodeIds: new Set<string>(),
      coreNodeIds: new Set<string>(),
      navigationHistory: [],
    });
  });

  describe('selectNode', () => {
    it('sets selectedNode and computes neighbor highlights', () => {
      // Load graph data so getNeighborIds has links to work with
      useGraphStore.setState({ graphData: testGraphData });

      useGraphStore.getState().selectNode(testNodes[0]); // s1

      const state = useGraphStore.getState();
      expect(state.selectedNode?.id).toBe('s1');
      // s1 neighbors: s1 (self), s2 (s1->s2), g1 (s1->g1), a1 (a1->s1)
      expect(state.highlightedNodeIds.has('s1')).toBe(true);
      expect(state.highlightedNodeIds.has('s2')).toBe(true);
      expect(state.highlightedNodeIds.has('g1')).toBe(true);
      expect(state.highlightedNodeIds.has('a1')).toBe(true);
    });

    it('selectNode(null) clears selection and highlights', () => {
      useGraphStore.setState({
        graphData: testGraphData,
        selectedNode: testNodes[0],
        highlightedNodeIds: new Set(['s1', 's2']),
        highlightedLinkIndices: new Set([0, 1]),
        navigationHistory: [testNodes[0]],
      });

      useGraphStore.getState().selectNode(null);

      const state = useGraphStore.getState();
      expect(state.selectedNode).toBeNull();
      expect(state.highlightedNodeIds.size).toBe(0);
      expect(state.highlightedLinkIndices.size).toBe(0);
      expect(state.navigationHistory).toEqual([]);
    });
  });

  describe('pushNavigation', () => {
    it('adds to history', () => {
      useGraphStore.getState().pushNavigation(stepNode('a'));
      useGraphStore.getState().pushNavigation(stepNode('b'));

      expect(useGraphStore.getState().navigationHistory).toHaveLength(2);
      expect(useGraphStore.getState().navigationHistory[0].id).toBe('a');
      expect(useGraphStore.getState().navigationHistory[1].id).toBe('b');
    });

    it('caps history at 8 entries', () => {
      for (let i = 0; i < 10; i++) {
        useGraphStore.getState().pushNavigation(stepNode(`n${i}`));
      }

      const history = useGraphStore.getState().navigationHistory;
      expect(history).toHaveLength(8);
      // First two should have been shifted out
      expect(history[0].id).toBe('n2');
      expect(history[7].id).toBe('n9');
    });

    it('ignores duplicate of last entry', () => {
      const node = stepNode('dup');
      useGraphStore.getState().pushNavigation(node);
      useGraphStore.getState().pushNavigation(node);

      expect(useGraphStore.getState().navigationHistory).toHaveLength(1);
    });
  });

  describe('flashLink', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('sets flashingLinkKey', () => {
      useGraphStore.getState().flashLink('s1', 's2');

      expect(useGraphStore.getState().flashingLinkKey).toBe('s1--s2');
    });

    it('clears flashingLinkKey after 1500ms', () => {
      useGraphStore.getState().flashLink('s1', 's2');

      expect(useGraphStore.getState().flashingLinkKey).toBe('s1--s2');

      vi.advanceTimersByTime(1500);

      expect(useGraphStore.getState().flashingLinkKey).toBeNull();
    });

    it('does not clear if a newer flash replaced it', () => {
      useGraphStore.getState().flashLink('s1', 's2');

      vi.advanceTimersByTime(500);

      // A new flash replaces the first one
      useGraphStore.getState().flashLink('a1', 's1');

      // Advance past the first timeout
      vi.advanceTimersByTime(1000);

      // The second flash should still be active
      expect(useGraphStore.getState().flashingLinkKey).toBe('a1--s1');

      // Advance past the second timeout
      vi.advanceTimersByTime(500);

      expect(useGraphStore.getState().flashingLinkKey).toBeNull();
    });
  });

  describe('toggleNodeTypeVisibility', () => {
    it('removes a type that is visible', () => {
      useGraphStore.getState().toggleNodeTypeVisibility('agent');

      const types = useGraphStore.getState().visibleNodeTypes;
      expect(types.has('agent')).toBe(false);
      expect(types.has('step')).toBe(true);
    });

    it('adds a type that is not visible', () => {
      // First remove it
      useGraphStore.getState().toggleNodeTypeVisibility('agent');
      expect(useGraphStore.getState().visibleNodeTypes.has('agent')).toBe(false);

      // Then add it back
      useGraphStore.getState().toggleNodeTypeVisibility('agent');
      expect(useGraphStore.getState().visibleNodeTypes.has('agent')).toBe(true);
    });
  });

  describe('resetFilters', () => {
    it('restores all node and link types', () => {
      // Dirty the filters
      useGraphStore.setState({
        visibleNodeTypes: new Set<NodeType>(['step']),
        visibleLinkTypes: new Set<LinkType>(['flows-to']),
        searchQuery: 'something',
        highlightedNodeIds: new Set(['s1']),
        highlightedLinkIndices: new Set([0]),
        highlightedLinkTypes: new Set<LinkType>(['flows-to']),
      });

      useGraphStore.getState().resetFilters();

      const state = useGraphStore.getState();
      expect(state.visibleNodeTypes.size).toBe(4);
      expect(state.visibleNodeTypes.has('step')).toBe(true);
      expect(state.visibleNodeTypes.has('gate')).toBe(true);
      expect(state.visibleNodeTypes.has('agent')).toBe(true);
      expect(state.visibleNodeTypes.has('input')).toBe(true);

      expect(state.visibleLinkTypes.size).toBe(7);
      expect(state.searchQuery).toBe('');
      expect(state.highlightedNodeIds.size).toBe(0);
      expect(state.highlightedLinkIndices.size).toBe(0);
      expect(state.highlightedLinkTypes.size).toBe(0);
    });
  });
});
