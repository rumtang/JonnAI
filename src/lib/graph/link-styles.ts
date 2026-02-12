import { LinkType, LinkStyleConfig } from './types';

// Particle counts tuned for ~200 total across the full graph (was ~768).
// High-value links (flows-to, escalates-to) keep visual flow.
// Low-value links (uses, performs) reduced to minimize GPU sprite updates per frame.
export const LINK_STYLES: Record<LinkType, LinkStyleConfig> = {
  'flows-to':     { color: '#5B9ECF', particles: 2, width: 1.2, dashed: false },
  'reviews':      { color: '#D4856A', particles: 1, width: 1.0, dashed: true  },
  'escalates-to': { color: '#D4856A', particles: 2, width: 2.0, dashed: false },
  'uses':         { color: '#C9A04E', particles: 0, width: 0.4, dashed: true  },
  'performs':      { color: '#9B7ACC', particles: 1, width: 1.2, dashed: false },
  'returns-to':   { color: '#D4856A', particles: 2, width: 1.0, dashed: false },
  'linear-flow':  { color: '#C9A04E', particles: 3, width: 3.0, dashed: false },
  'hands-off-to': { color: '#E88D67', particles: 2, width: 2.5, dashed: false },  // Cross-domain handoff — orange, thick, animated
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
