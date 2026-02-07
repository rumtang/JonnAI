// Pure functions for computing the subgraph relevant to a specific role.
// No store dependency — these take data in and return results out.

import { GraphData, GraphLink } from '../graph/types';
import { getLinkEndpointIds } from '../graph/filters';
import { RoleDefinition, ROLE_DEFINITIONS, getRoleNodeIds } from './role-definitions';

export interface RoleSubgraph {
  nodeIds: Set<string>;
  linkIndices: Set<number>;
  primaryNodeIds: Set<string>;   // Steps + gates the role directly owns/reviews
  supportNodeIds: Set<string>;   // Agents + inputs that support the role
}

export interface TeamConnection {
  roleId: string;
  roleTitle: string;
  sharedNodeIds: string[];
}

// Find all links where both endpoints are within a given node set
export function findConnectingLinks(
  nodeIds: Set<string>,
  links: GraphLink[]
): Set<number> {
  const indices = new Set<number>();
  links.forEach((link, i) => {
    const { sourceId, targetId } = getLinkEndpointIds(link);
    if (nodeIds.has(sourceId) && nodeIds.has(targetId)) {
      indices.add(i);
    }
  });
  return indices;
}

// BFS to find flows-to paths between primary nodes (max depth to avoid runaway)
function traceFlowPaths(
  primaryIds: Set<string>,
  links: GraphLink[],
  maxHops: number = 4
): Set<string> {
  const visited = new Set<string>();
  const queue: Array<{ id: string; depth: number }> = [];

  // Start BFS from each primary node
  for (const startId of primaryIds) {
    queue.push({ id: startId, depth: 0 });
  }

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);

    if (depth >= maxHops) continue;

    // Follow flows-to links from this node
    for (const link of links) {
      if (link.type !== 'flows-to') continue;
      const { sourceId, targetId } = getLinkEndpointIds(link);
      if (sourceId === id && primaryIds.has(targetId) && !visited.has(targetId)) {
        queue.push({ id: targetId, depth: depth + 1 });
      }
    }
  }

  return visited;
}

// Compute the subgraph for a given role
export function computeRoleSubgraph(
  role: RoleDefinition,
  graphData: GraphData
): RoleSubgraph {
  const primaryNodeIds = new Set([
    ...role.ownedSteps,
    ...role.reviewedGates,
  ]);

  const supportNodeIds = new Set([
    ...role.relatedAgents,
    ...role.relatedInputs,
  ]);

  // Trace flow paths between primary nodes to include intermediate steps
  const flowPathIds = traceFlowPaths(primaryNodeIds, graphData.links);

  // Combine all node IDs
  const nodeIds = new Set([
    ...primaryNodeIds,
    ...supportNodeIds,
    ...flowPathIds,
  ]);

  // Find links connecting any nodes in the subgraph
  const linkIndices = findConnectingLinks(nodeIds, graphData.links);

  return { nodeIds, linkIndices, primaryNodeIds, supportNodeIds };
}

// Find how other roles overlap with this one (shared nodes)
export function getTeamConnections(
  role: RoleDefinition,
  graphData: GraphData
): TeamConnection[] {
  const myNodeIds = new Set(getRoleNodeIds(role));
  const connections: TeamConnection[] = [];

  for (const otherRole of ROLE_DEFINITIONS) {
    if (otherRole.id === role.id) continue;

    const otherNodeIds = getRoleNodeIds(otherRole);
    const shared = otherNodeIds.filter(id => myNodeIds.has(id));

    if (shared.length > 0) {
      connections.push({
        roleId: otherRole.id,
        roleTitle: otherRole.title,
        sharedNodeIds: shared,
      });
    }
  }

  // Also check for links that cross between this role's nodes and another's
  const myNodes = myNodeIds;
  for (const otherRole of ROLE_DEFINITIONS) {
    if (otherRole.id === role.id) continue;
    const existing = connections.find(c => c.roleId === otherRole.id);
    if (existing) continue; // Already found shared nodes

    const otherNodes = new Set(getRoleNodeIds(otherRole));
    // Check if any link connects a node from this role to a node in the other
    const hasLink = graphData.links.some(link => {
      const { sourceId, targetId } = getLinkEndpointIds(link);
      return (myNodes.has(sourceId) && otherNodes.has(targetId)) ||
             (myNodes.has(targetId) && otherNodes.has(sourceId));
    });

    if (hasLink) {
      connections.push({
        roleId: otherRole.id,
        roleTitle: otherRole.title,
        sharedNodeIds: [],
      });
    }
  }

  return connections;
}
