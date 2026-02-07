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
