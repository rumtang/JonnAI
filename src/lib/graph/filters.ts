import { GraphData, GraphNode, GraphLink, NodeType, LinkType } from './types';

// Extract source and target IDs from a link, handling both string and object forms.
// This pattern was duplicated across NodeDetailPanel, GraphScene, and filters —
// centralizing it here prevents drift.
export function getLinkEndpointIds(link: GraphLink): { sourceId: string; targetId: string } {
  const sourceId = typeof link.source === 'object' ? (link.source as GraphNode).id : link.source;
  const targetId = typeof link.target === 'object' ? (link.target as GraphNode).id : link.target;
  return { sourceId, targetId };
}

export function applyFilters(
  fullData: GraphData,
  visibleNodeTypes: Set<NodeType>,
  visibleLinkTypes: Set<LinkType>,
  searchQuery: string
): GraphData {
  const visibleNodes = fullData.nodes.filter(n => visibleNodeTypes.has(n.type));
  const visibleNodeIds = new Set(visibleNodes.map(n => n.id));

  const visibleLinks = fullData.links.filter(l => {
    const sourceId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
    const targetId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
    return (
      visibleLinkTypes.has(l.type) &&
      visibleNodeIds.has(sourceId) &&
      visibleNodeIds.has(targetId)
    );
  });

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    visibleNodes.forEach(n => {
      const matches = n.label.toLowerCase().includes(query) ||
                      n.description.toLowerCase().includes(query);
      n._highlighted = matches;
      n._dimmed = !matches;
    });
  } else {
    visibleNodes.forEach(n => {
      n._highlighted = false;
      n._dimmed = false;
    });
  }

  return { nodes: visibleNodes, links: visibleLinks };
}

export function getNeighborIds(nodeId: string, links: GraphLink[]): Set<string> {
  const neighbors = new Set<string>();
  neighbors.add(nodeId);
  links.forEach(link => {
    const sourceId = typeof link.source === 'object' ? (link.source as GraphNode).id : link.source;
    const targetId = typeof link.target === 'object' ? (link.target as GraphNode).id : link.target;
    if (sourceId === nodeId) neighbors.add(targetId);
    if (targetId === nodeId) neighbors.add(sourceId);
  });
  return neighbors;
}

export function getConnectedLinkIds(nodeId: string, links: GraphLink[]): Set<number> {
  const connected = new Set<number>();
  links.forEach((link, index) => {
    const sourceId = typeof link.source === 'object' ? (link.source as GraphNode).id : link.source;
    const targetId = typeof link.target === 'object' ? (link.target as GraphNode).id : link.target;
    if (sourceId === nodeId || targetId === nodeId) {
      connected.add(index);
    }
  });
  return connected;
}
