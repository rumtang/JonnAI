import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the graph-ref module before importing the module under test
const mockCameraPosition = vi.fn();
vi.mock('@/lib/graph/graph-ref', () => ({
  getGraphRef: vi.fn(),
}));

import { navigateToNode } from './camera-navigation';
import { getGraphRef } from '@/lib/graph/graph-ref';
import { GraphNode } from '@/lib/graph/types';

const mockedGetGraphRef = vi.mocked(getGraphRef);

describe('navigateToNode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCameraPosition.mockClear();
  });

  const makeNode = (overrides?: Partial<GraphNode>): GraphNode => ({
    id: 'test-node',
    type: 'step',
    label: 'Test Node',
    description: 'A test node',
    x: 10,
    y: 20,
    z: 30,
    ...overrides,
  });

  it('calls cameraPosition with correct default distance (120) and duration (1000)', () => {
    mockedGetGraphRef.mockReturnValue({ cameraPosition: mockCameraPosition });
    const node = makeNode();

    navigateToNode(node);

    expect(mockCameraPosition).toHaveBeenCalledTimes(1);
    expect(mockCameraPosition).toHaveBeenCalledWith(
      { x: 10, y: 20, z: 150 }, // z = 30 + 120
      { x: 10, y: 20, z: 30 },  // lookAt = node position
      1000                        // default duration
    );
  });

  it('uses custom distance and duration options', () => {
    mockedGetGraphRef.mockReturnValue({ cameraPosition: mockCameraPosition });
    const node = makeNode();

    navigateToNode(node, { distance: 200, duration: 2000 });

    expect(mockCameraPosition).toHaveBeenCalledWith(
      { x: 10, y: 20, z: 230 }, // z = 30 + 200
      { x: 10, y: 20, z: 30 },
      2000
    );
  });

  it('positions camera z = node.z + distance', () => {
    mockedGetGraphRef.mockReturnValue({ cameraPosition: mockCameraPosition });
    const node = makeNode({ z: -50 });

    navigateToNode(node, { distance: 80 });

    const cameraPos = mockCameraPosition.mock.calls[0][0];
    expect(cameraPos.z).toBe(30); // -50 + 80
  });

  it('no-op when getGraphRef returns null', () => {
    mockedGetGraphRef.mockReturnValue(null);
    const node = makeNode();

    navigateToNode(node);

    expect(mockCameraPosition).not.toHaveBeenCalled();
  });

  it('no-op when node has undefined x coordinate', () => {
    mockedGetGraphRef.mockReturnValue({ cameraPosition: mockCameraPosition });
    const node = makeNode({ x: undefined });

    navigateToNode(node);

    expect(mockCameraPosition).not.toHaveBeenCalled();
  });

  it('no-op when node has undefined y coordinate', () => {
    mockedGetGraphRef.mockReturnValue({ cameraPosition: mockCameraPosition });
    const node = makeNode({ y: undefined });

    navigateToNode(node);

    expect(mockCameraPosition).not.toHaveBeenCalled();
  });

  it('no-op when node has undefined z coordinate', () => {
    mockedGetGraphRef.mockReturnValue({ cameraPosition: mockCameraPosition });
    const node = makeNode({ z: undefined });

    navigateToNode(node);

    expect(mockCameraPosition).not.toHaveBeenCalled();
  });
});
