import { NodeType, NodeStyleConfig } from './types';

export const NODE_STYLES: Record<NodeType, NodeStyleConfig> = {
  step:  { color: '#3b82f6', geometry: 'sphere',       baseSize: 5, emoji: '▶' },
  gate:  { color: '#ef4444', geometry: 'dodecahedron', baseSize: 6, emoji: '!' },
  agent: { color: '#8b5cf6', geometry: 'torus',        baseSize: 5, emoji: '✦' },
  input: { color: '#f59e0b', geometry: 'box',          baseSize: 4, emoji: 'i' },
};

export function getNodeColor(type: NodeType): string {
  return NODE_STYLES[type]?.color ?? '#6b7280';
}

export function getNodeSize(type: NodeType, val?: number): number {
  const base = NODE_STYLES[type]?.baseSize ?? 4;
  return val ? base * (val / 5) : base;
}
