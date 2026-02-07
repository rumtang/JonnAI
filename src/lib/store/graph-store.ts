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
}));
