import { NodeType, NodeStyleConfig } from './types';

export const NODE_STYLES: Record<NodeType, NodeStyleConfig> = {
  step:  { color: '#5B9ECF', geometry: 'octahedron',    baseSize: 5, emoji: '▶' },
  gate:  { color: '#D4856A', geometry: 'dodecahedron',  baseSize: 6, emoji: '!' },
  agent: { color: '#9B7ACC', geometry: 'torus',         baseSize: 5, emoji: '✦' },
  input: { color: '#C9A04E', geometry: 'box',           baseSize: 4, emoji: 'i' },
};

export function getNodeColor(type: NodeType): string {
  return NODE_STYLES[type]?.color ?? '#6b7280';
}

export function getNodeSize(type: NodeType, val?: number): number {
  const base = NODE_STYLES[type]?.baseSize ?? 4;
  return val ? base * (val / 5) : base;
}
