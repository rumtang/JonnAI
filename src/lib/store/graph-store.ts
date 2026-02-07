import { create } from 'zustand';
import { GraphData, GraphNode, GraphLink, NodeType, LinkType, PersonMeta, ParsedContact } from '../graph/types';
import { getNeighborIds } from '../graph/filters';
import { v4 as uuid } from 'uuid';

// All NodeType values for default visibility
const ALL_NODE_TYPES: NodeType[] = [
  'person', 'task', 'data-source', 'decision', 'agent',
  'knowledge-artifact', 'external-touchpoint', 'process-step',
];

const ALL_LINK_TYPES: LinkType[] = [
  'reports-to', 'collaborates-with', 'depends-on', 'feeds-into',
  'escalates-to', 'informed-by', 'monitors', 'manages',
  'produces', 'consumes', 'linear-flow',
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
  addPersonNode: (contact: ParsedContact, role: string, department: string, humanRoleEvolution?: string) => void;
  loadLinearView: () => void;
  loadFullGraph: () => void;
  highlightByType: (type: NodeType) => void;
  highlightLinksByType: (linkType: LinkType) => void;
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
      // Compute neighbors so highlights update automatically
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

  addPersonNode: (contact, role, department, humanRoleEvolution) => {
    const state = get();
    const newNode: GraphNode = {
      id: `contact-${uuid()}`,
      type: 'person',
      label: contact.name,
      description: `${role} — ${department}`,
      group: department,
      val: 5,
      meta: {
        role,
        department,
        email: contact.email,
        phone: contact.phone,
        isContact: true,
        humanRoleEvolution,
      } as PersonMeta,
    };
    const updatedData = {
      nodes: [...state.graphData.nodes, newNode],
      links: [...state.graphData.links],
    };
    set({ graphData: updatedData });
    if (state.fullGraphData) {
      set({
        fullGraphData: {
          nodes: [...state.fullGraphData.nodes, newNode],
          links: [...state.fullGraphData.links],
        },
      });
    }
  },

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

  highlightLinksByType: (linkType) => {
    const state = get();
    const indices = new Set<number>();
    state.graphData.links.forEach((link, i) => {
      if (link.type === linkType) indices.add(i);
    });
    set({ highlightedLinkIndices: indices });
  },
}));
