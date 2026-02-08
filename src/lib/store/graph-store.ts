import { create } from 'zustand';
import { GraphData, GraphNode, NodeType, LinkType } from '../graph/types';
import { getNeighborIds } from '../graph/filters';

// All NodeType values for default visibility
const ALL_NODE_TYPES: NodeType[] = [
  'step', 'gate', 'agent', 'input',
];

const ALL_LINK_TYPES: LinkType[] = [
  'flows-to', 'reviews', 'escalates-to', 'uses',
  'performs', 'returns-to', 'linear-flow',
];

interface GraphState {
  // Data
  graphData: GraphData;
  fullGraphData: GraphData | null;
  linearGraphData: GraphData | null;

  // View state
  viewMode: 'linear' | 'transition' | 'full-graph';

  // Selection
  selectedNode: GraphNode | null;
  hoveredNode: GraphNode | null;
  highlightedNodeIds: Set<string>;
  highlightedLinkIndices: Set<number>;

  // Navigation history (breadcrumb trail for connection navigation)
  navigationHistory: GraphNode[];

  // Temporarily highlighted link (for connection click animation)
  flashingLinkKey: string | null;

  // Filters
  visibleNodeTypes: Set<NodeType>;
  visibleLinkTypes: Set<LinkType>;
  searchQuery: string;

  // Actions
  setGraphData: (data: GraphData) => void;
  setFullGraphData: (data: GraphData) => void;
  setLinearGraphData: (data: GraphData) => void;
  setViewMode: (mode: 'linear' | 'transition' | 'full-graph') => void;
  selectNode: (node: GraphNode | null) => void;
  hoverNode: (node: GraphNode | null) => void;
  setHighlightedNodeIds: (ids: Set<string>) => void;
  setHighlightedLinkIndices: (indices: Set<number>) => void;
  clearHighlights: () => void;
  toggleNodeTypeVisibility: (type: NodeType) => void;
  toggleLinkTypeVisibility: (type: LinkType) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  loadLinearView: () => void;
  loadFullGraph: () => void;
  highlightByType: (type: NodeType) => void;
  highlightByTypes: (types: NodeType[]) => void;
  highlightLinksByType: (linkType: LinkType) => void;
  highlightLinksByTypes: (linkTypes: LinkType[]) => void;

  // Navigation history actions
  pushNavigation: (node: GraphNode) => void;
  navigateBack: () => GraphNode | null;
  navigateToBreadcrumb: (index: number) => GraphNode | null;
  clearNavigation: () => void;

  // Link flash action
  flashLink: (sourceId: string, targetId: string) => void;
}

export const useGraphStore = create<GraphState>((set, get) => ({
  graphData: { nodes: [], links: [] },
  fullGraphData: null,
  linearGraphData: null,
  viewMode: 'linear',
  selectedNode: null,
  hoveredNode: null,
  highlightedNodeIds: new Set(),
  highlightedLinkIndices: new Set(),
  navigationHistory: [],
  flashingLinkKey: null,
  visibleNodeTypes: new Set(ALL_NODE_TYPES),
  visibleLinkTypes: new Set(ALL_LINK_TYPES),
  searchQuery: '',

  setGraphData: (data) => set({ graphData: data }),
  setFullGraphData: (data) => set({ fullGraphData: data }),
  setLinearGraphData: (data) => set({ linearGraphData: data }),
  setViewMode: (mode) => set({ viewMode: mode }),

  selectNode: (node) => {
    if (node) {
      const { graphData } = get();
      const neighborIds = getNeighborIds(node.id, graphData.links);
      set({
        selectedNode: node,
        highlightedNodeIds: neighborIds,
        hoveredNode: null,
      });
    } else {
      set({
        selectedNode: null,
        highlightedNodeIds: new Set(),
        highlightedLinkIndices: new Set(),
        hoveredNode: null,
        navigationHistory: [],
      });
    }
  },
  hoverNode: (node) => set({ hoveredNode: node }),

  setHighlightedNodeIds: (ids) => set({ highlightedNodeIds: ids }),
  setHighlightedLinkIndices: (indices) => set({ highlightedLinkIndices: indices }),

  clearHighlights: () => set({
    highlightedNodeIds: new Set(),
    highlightedLinkIndices: new Set(),
    hoveredNode: null,
  }),

  toggleNodeTypeVisibility: (type) => set((state) => {
    const next = new Set(state.visibleNodeTypes);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    return { visibleNodeTypes: next };
  }),

  toggleLinkTypeVisibility: (type) => set((state) => {
    const next = new Set(state.visibleLinkTypes);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    return { visibleLinkTypes: next };
  }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  resetFilters: () => set({
    visibleNodeTypes: new Set(ALL_NODE_TYPES),
    visibleLinkTypes: new Set(ALL_LINK_TYPES),
    searchQuery: '',
    highlightedNodeIds: new Set(),
    highlightedLinkIndices: new Set(),
  }),

  loadLinearView: () => {
    const state = get();
    if (state.linearGraphData) {
      set({ graphData: { ...state.linearGraphData }, viewMode: 'linear' });
    }
  },

  loadFullGraph: () => {
    const state = get();
    if (state.fullGraphData) {
      set({ graphData: { ...state.fullGraphData }, viewMode: 'full-graph' });
    }
  },

  highlightByType: (type) => {
    const state = get();
    const ids = new Set(
      state.graphData.nodes
        .filter(n => n.type === type)
        .map(n => n.id)
    );
    set({ highlightedNodeIds: ids });
  },

  // Highlight nodes matching any of the given types (no overwrite race)
  highlightByTypes: (types) => {
    const state = get();
    const ids = new Set(
      state.graphData.nodes
        .filter(n => types.includes(n.type))
        .map(n => n.id)
    );
    set({ highlightedNodeIds: ids });
  },

  highlightLinksByType: (linkType) => {
    const state = get();
    const indices = new Set<number>();
    state.graphData.links.forEach((link, i) => {
      if (link.type === linkType) indices.add(i);
    });
    set({ highlightedLinkIndices: indices });
  },

  // Highlight links matching any of the given types
  highlightLinksByTypes: (linkTypes) => {
    const state = get();
    const indices = new Set<number>();
    state.graphData.links.forEach((link, i) => {
      if (linkTypes.includes(link.type)) indices.add(i);
    });
    set({ highlightedLinkIndices: indices });
  },

  // Navigation history — breadcrumb trail for connection clicks
  pushNavigation: (node) => {
    const state = get();
    const history = [...state.navigationHistory];
    // Don't push if it's the same as the last node
    if (history.length > 0 && history[history.length - 1].id === node.id) return;
    history.push(node);
    // Keep only the last 8 entries
    if (history.length > 8) history.shift();
    set({ navigationHistory: history });
  },

  navigateBack: () => {
    const state = get();
    if (state.navigationHistory.length < 2) return null;
    const history = [...state.navigationHistory];
    history.pop(); // Remove current
    const previousNode = history[history.length - 1];
    set({ navigationHistory: history });
    return previousNode;
  },

  navigateToBreadcrumb: (index) => {
    const state = get();
    if (index < 0 || index >= state.navigationHistory.length) return null;
    const targetNode = state.navigationHistory[index];
    // Truncate history to that point
    const history = state.navigationHistory.slice(0, index + 1);
    set({ navigationHistory: history });
    return targetNode;
  },

  clearNavigation: () => set({ navigationHistory: [] }),

  // Briefly highlight a link between two nodes (for connection click animation)
  flashLink: (sourceId, targetId) => {
    const key = `${sourceId}--${targetId}`;
    set({ flashingLinkKey: key });
    setTimeout(() => {
      // Only clear if it's still the same flash
      const current = get().flashingLinkKey;
      if (current === key) set({ flashingLinkKey: null });
    }, 1500);
  },
}));
