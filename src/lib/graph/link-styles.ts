import { LinkType, LinkStyleConfig } from './types';

export const LINK_STYLES: Record<LinkType, LinkStyleConfig> = {
  'flows-to':     { color: '#5B9ECF', particles: 4, width: 1.2, dashed: false },
  'reviews':      { color: '#D4856A', particles: 3, width: 1.0, dashed: true  },
  'escalates-to': { color: '#D4856A', particles: 5, width: 2.0, dashed: false },
  'uses':         { color: '#C9A04E', particles: 2, width: 0.4, dashed: true  },
  'performs':      { color: '#9B7ACC', particles: 3, width: 1.2, dashed: false },
  'returns-to':   { color: '#D4856A', particles: 4, width: 1.0, dashed: false },
  'linear-flow':  { color: '#C9A04E', particles: 6, width: 3.0, dashed: false },
};

export function getLinkColor(type: LinkType): string {
  return LINK_STYLES[type]?.color ?? '#8B8578';
}

export function getLinkParticles(type: LinkType): number {
  return LINK_STYLES[type]?.particles ?? 0;
}

export function getLinkWidth(type: LinkType, highlighted?: boolean): number {
  const base = LINK_STYLES[type]?.width ?? 0.5;
  return highlighted ? base * 3 : base;
}
