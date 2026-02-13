import { getGraphRef } from '@/lib/graph/graph-ref';
import { GraphNode } from '@/lib/graph/types';

/**
 * Shared camera navigation — used by connection clicks (Feature 2),
 * campaign step advances (Feature 1), log entry clicks, and breadcrumb clicks.
 */
export function navigateToNode(
  node: GraphNode,
  options?: { distance?: number; duration?: number }
) {
  const graphRef = getGraphRef();
  if (!graphRef || node.x === undefined || node.y === undefined || node.z === undefined) return;

  const distance = options?.distance ?? 120;
  const duration = options?.duration ?? 1000;
  const nodePos = { x: node.x, y: node.y, z: node.z };
  const cameraPos = {
    x: nodePos.x,
    y: nodePos.y,
    z: nodePos.z + distance,
  };

  graphRef.cameraPosition(cameraPos, nodePos, duration);
}

/**
 * Fly camera to a fixed overview position looking at the origin.
 * Used by mode transitions instead of inline cameraPosition calls.
 * No-ops safely if the graph ref isn't ready yet (e.g. during page init).
 */
export function navigateToOverview(options?: { z?: number; duration?: number }) {
  const graphRef = getGraphRef();
  if (!graphRef) return;

  const z = options?.z ?? 520;
  const duration = options?.duration ?? 1500;
  const origin = { x: 0, y: 0, z: 0 };

  graphRef.cameraPosition({ x: 0, y: 0, z }, origin, duration);
}

/**
 * Fly camera to the centroid of a group of nodes.
 * Used by BuildController "View in Graph" peek.
 */
export function navigateToCentroid(
  nodes: GraphNode[],
  options?: { yOffset?: number; zOffset?: number; duration?: number }
) {
  const graphRef = getGraphRef();
  if (!graphRef) return;

  const yOffset = options?.yOffset ?? 40;
  const zOffset = options?.zOffset ?? 220;
  const duration = options?.duration ?? 800;

  // Filter to nodes that have computed positions
  let cx = 0, cy = 0, cz = 0, count = 0;
  for (const node of nodes) {
    if (node.x !== undefined && node.y !== undefined && node.z !== undefined) {
      cx += node.x;
      cy += node.y;
      cz += node.z;
      count++;
    }
  }
  if (count === 0) return;

  cx /= count;
  cy /= count;
  cz /= count;

  const lookAt = { x: cx, y: cy, z: cz };
  const cameraPos = { x: cx, y: cy + yOffset, z: cz + zOffset };
  graphRef.cameraPosition(cameraPos, lookAt, duration);
}
