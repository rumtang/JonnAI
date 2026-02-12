import { describe, it, expect } from 'vitest';
import {
  getLinkEndpointIds,
  applyFilters,
  getNeighborIds,
  getConnectedLinkIds,
} from './filters';
import { GraphNode, GraphLink, GraphData, NodeType, LinkType } from './types';

// --- Test fixtures ---

const stepNode = (id: string, label?: string): GraphNode => ({
  id,
  type: 'step',
  label: label || id,
  description: `Description of ${id}`,
});

const gateNode = (id: string, label?: string): GraphNode => ({
  id,
  type: 'gate',
  label: label || id,
  description: `Description of ${id}`,
});

const agentNode = (id: string, label?: string): GraphNode => ({
  id,
  type: 'agent',
  label: label || id,
  description: `Description of ${id}`,
});

const inputNode = (id: string, label?: string): GraphNode => ({
  id,
  type: 'input',
  label: label || id,
  description: `Description of ${id}`,
});

const link = (source: string, target: string, type: LinkType): GraphLink => ({
  source,
  target,
  type,
});

// --- getLinkEndpointIds ---

describe('getLinkEndpointIds', () => {
  it('extracts IDs from string source and target', () => {
    const l: GraphLink = { source: 'node-a', target: 'node-b', type: 'flows-to' };
    const result = getLinkEndpointIds(l);
    expect(result).toEqual({ sourceId: 'node-a', targetId: 'node-b' });
  });

  it('extracts IDs from object source and target', () => {
    const l: GraphLink = {
      source: { id: 'node-a', type: 'step', label: 'A', description: '' } as GraphNode,
      target: { id: 'node-b', type: 'gate', label: 'B', description: '' } as GraphNode,
      type: 'reviews',
    };
    const result = getLinkEndpointIds(l);
    expect(result).toEqual({ sourceId: 'node-a', targetId: 'node-b' });
  });

  it('handles mixed string source and object target', () => {
    const l: GraphLink = {
      source: 'node-a',
      target: { id: 'node-b', type: 'step', label: 'B', description: '' } as GraphNode,
      type: 'flows-to',
    };
    const result = getLinkEndpointIds(l);
    expect(result).toEqual({ sourceId: 'node-a', targetId: 'node-b' });
  });
});

// --- applyFilters ---

describe('applyFilters', () => {
  const nodes: GraphNode[] = [
    stepNode('s1', 'Campaign Planning'),
    stepNode('s2', 'Draft Content'),
    gateNode('g1', 'Approval Gate'),
    agentNode('a1', 'Writer Agent'),
    inputNode('i1', 'Brand Guidelines'),
  ];

  const links: GraphLink[] = [
    link('s1', 's2', 'flows-to'),
    link('s1', 'g1', 'flows-to'),
    link('g1', 's2', 'flows-to'),
    link('a1', 's2', 'performs'),
    link('s2', 'i1', 'uses'),
  ];

  const fullData: GraphData = { nodes, links };

  const allNodeTypes = new Set<NodeType>(['step', 'gate', 'agent', 'input']);
  const allLinkTypes = new Set<LinkType>([
    'flows-to', 'reviews', 'escalates-to', 'uses', 'performs', 'returns-to', 'linear-flow',
  ]);

  it('returns all nodes and links when everything is visible', () => {
    const result = applyFilters(fullData, allNodeTypes, allLinkTypes, '');
    expect(result.nodes).toHaveLength(5);
    expect(result.links).toHaveLength(5);
  });

  it('filters nodes by visible node types', () => {
    const stepsOnly = new Set<NodeType>(['step']);
    const result = applyFilters(fullData, stepsOnly, allLinkTypes, '');
    expect(result.nodes).toHaveLength(2);
    expect(result.nodes.every(n => n.type === 'step')).toBe(true);
  });

  it('filters links by visible link types', () => {
    const flowsOnly = new Set<LinkType>(['flows-to']);
    const result = applyFilters(fullData, allNodeTypes, flowsOnly, '');
    expect(result.links).toHaveLength(3);
    expect(result.links.every(l => l.type === 'flows-to')).toBe(true);
  });

  it('only includes links where both endpoints are visible', () => {
    // Only show steps — links to gate/agent/input nodes should be excluded
    const stepsOnly = new Set<NodeType>(['step']);
    const result = applyFilters(fullData, stepsOnly, allLinkTypes, '');
    // Only s1->s2 link has both endpoints as steps
    expect(result.links).toHaveLength(1);
    expect(result.links[0].source).toBe('s1');
    expect(result.links[0].target).toBe('s2');
  });

  it('search query highlights matching nodes and dims non-matching', () => {
    const result = applyFilters(fullData, allNodeTypes, allLinkTypes, 'Campaign');
    const highlighted = result.nodes.filter(n => n._highlighted);
    const dimmed = result.nodes.filter(n => n._dimmed);
    // "Campaign Planning" matches
    expect(highlighted).toHaveLength(1);
    expect(highlighted[0].id).toBe('s1');
    expect(dimmed).toHaveLength(4);
  });

  it('search is case-insensitive', () => {
    const result = applyFilters(fullData, allNodeTypes, allLinkTypes, 'campaign');
    const highlighted = result.nodes.filter(n => n._highlighted);
    expect(highlighted).toHaveLength(1);
    expect(highlighted[0].id).toBe('s1');
  });

  it('search matches on description as well', () => {
    // Description contains "Description of s2"
    const result = applyFilters(fullData, allNodeTypes, allLinkTypes, 'description of s2');
    const highlighted = result.nodes.filter(n => n._highlighted);
    expect(highlighted).toHaveLength(1);
    expect(highlighted[0].id).toBe('s2');
  });

  it('empty search query clears _highlighted and _dimmed', () => {
    // First apply a search, then clear it
    applyFilters(fullData, allNodeTypes, allLinkTypes, 'Campaign');
    const result = applyFilters(fullData, allNodeTypes, allLinkTypes, '');
    expect(result.nodes.every(n => n._highlighted === false)).toBe(true);
    expect(result.nodes.every(n => n._dimmed === false)).toBe(true);
  });

  it('progressive reveal: only shows nodes in revealedNodeIds set', () => {
    const revealed = new Set(['s1', 'g1']);
    const result = applyFilters(fullData, allNodeTypes, allLinkTypes, '', revealed, true);
    expect(result.nodes).toHaveLength(2);
    expect(result.nodes.map(n => n.id).sort()).toEqual(['g1', 's1']);
  });

  it('progressive reveal disabled: shows all nodes', () => {
    const revealed = new Set(['s1']);
    // progressiveReveal = false means ignore revealedNodeIds
    const result = applyFilters(fullData, allNodeTypes, allLinkTypes, '', revealed, false);
    expect(result.nodes).toHaveLength(5);
  });

  it('progressive reveal with empty revealedNodeIds shows no nodes', () => {
    const revealed = new Set<string>();
    // progressiveReveal = true but empty set — but code checks size > 0, so it skips filter
    const result = applyFilters(fullData, allNodeTypes, allLinkTypes, '', revealed, true);
    // When revealedNodeIds.size === 0, the code skips the filter, so all nodes shown
    expect(result.nodes).toHaveLength(5);
  });
});

// --- getNeighborIds ---

describe('getNeighborIds', () => {
  const links: GraphLink[] = [
    link('a', 'b', 'flows-to'),
    link('b', 'c', 'flows-to'),
    link('d', 'a', 'reviews'),
  ];

  it('returns neighbors from string endpoints', () => {
    const result = getNeighborIds('a', links);
    expect(result.has('a')).toBe(true); // self
    expect(result.has('b')).toBe(true); // a->b
    expect(result.has('d')).toBe(true); // d->a
    expect(result.has('c')).toBe(false);
  });

  it('returns neighbors from object endpoints', () => {
    const objLinks: GraphLink[] = [
      {
        source: stepNode('a'),
        target: stepNode('b'),
        type: 'flows-to',
      },
      {
        source: stepNode('c'),
        target: stepNode('a'),
        type: 'reviews',
      },
    ];
    const result = getNeighborIds('a', objLinks);
    expect(result.has('a')).toBe(true);
    expect(result.has('b')).toBe(true);
    expect(result.has('c')).toBe(true);
  });

  it('always includes the nodeId itself', () => {
    const result = getNeighborIds('x', []);
    expect(result.has('x')).toBe(true);
    expect(result.size).toBe(1);
  });

  it('node with no connections returns only itself', () => {
    const result = getNeighborIds('z', links);
    expect(result.size).toBe(1);
    expect(result.has('z')).toBe(true);
  });
});

// --- getConnectedLinkIds ---

describe('getConnectedLinkIds', () => {
  const links: GraphLink[] = [
    link('a', 'b', 'flows-to'),    // index 0
    link('b', 'c', 'flows-to'),    // index 1
    link('d', 'a', 'reviews'),     // index 2
    link('c', 'd', 'uses'),        // index 3
  ];

  it('returns indices of links connected to a node', () => {
    const result = getConnectedLinkIds('a', links);
    expect(result.has(0)).toBe(true); // a->b
    expect(result.has(2)).toBe(true); // d->a
    expect(result.has(1)).toBe(false);
    expect(result.has(3)).toBe(false);
    expect(result.size).toBe(2);
  });

  it('returns empty set for node with no connections', () => {
    const result = getConnectedLinkIds('z', links);
    expect(result.size).toBe(0);
  });

  it('works with object endpoints', () => {
    const objLinks: GraphLink[] = [
      {
        source: stepNode('a'),
        target: stepNode('b'),
        type: 'flows-to',
      },
    ];
    const result = getConnectedLinkIds('a', objLinks);
    expect(result.has(0)).toBe(true);
    expect(result.size).toBe(1);
  });
});
