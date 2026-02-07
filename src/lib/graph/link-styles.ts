import { LinkType, LinkStyleConfig } from './types';

export const LINK_STYLES: Record<LinkType, LinkStyleConfig> = {
  'flows-to':     { color: '#3b82f6', particles: 3, width: 1.2, dashed: false },
  'reviews':      { color: '#ef4444', particles: 2, width: 1.0, dashed: true  },
  'escalates-to': { color: '#ef4444', particles: 4, width: 2.0, dashed: false },
  'uses':         { color: '#f59e0b', particles: 1, width: 0.4, dashed: true  },
  'performs':      { color: '#8b5cf6', particles: 2, width: 1.2, dashed: false },
  'returns-to':   { color: '#f97316', particles: 3, width: 1.0, dashed: false },
  'linear-flow':  { color: '#ffffff', particles: 5, width: 3.0, dashed: false },
};

export function getLinkColor(type: LinkType): string {
  return LINK_STYLES[type]?.color ?? '#4b5563';
}

export function getLinkParticles(type: LinkType): number {
  return LINK_STYLES[type]?.particles ?? 0;
}

export function getLinkWidth(type: LinkType, highlighted?: boolean): number {
  const base = LINK_STYLES[type]?.width ?? 0.5;
  return highlighted ? base * 3 : base;
}
