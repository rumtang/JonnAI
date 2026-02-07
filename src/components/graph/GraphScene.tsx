'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import ForceGraph3D from './ForceGraph3DWrapper';
import { useGraphStore } from '@/lib/store/graph-store';
import { usePresentationStore } from '@/lib/store/presentation-store';
import { useUIStore } from '@/lib/store/ui-store';
import { NODE_STYLES, getNodeColor } from '@/lib/graph/node-styles';
import { LINK_STYLES, getLinkColor } from '@/lib/graph/link-styles';
import { getNeighborIds, applyFilters } from '@/lib/graph/filters';
import { setGraphRef } from '@/lib/graph/graph-ref';
import { GraphNode, GraphLink, NodeType } from '@/lib/graph/types';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';

export default function GraphScene() {
  const fgRef = useRef<any>(null);

  const {
    graphData,
    selectedNode,
    hoveredNode,
    highlightedNodeIds,
    highlightedLinkIndices,
    selectNode,
    hoverNode,
    setHighlightedNodeIds,
    setHighlightedLinkIndices,
    clearHighlights,
    visibleNodeTypes,
    visibleLinkTypes,
    searchQuery,
  } = useGraphStore();

  const { mode } = usePresentationStore();
  const { setDetailPanelOpen } = useUIStore();

  // Apply node/link type filters and search query
  const filteredGraphData = useMemo(
    () => applyFilters(graphData, visibleNodeTypes, visibleLinkTypes, searchQuery),
    [graphData, visibleNodeTypes, visibleLinkTypes, searchQuery]
  );

  // Compute neighbor sets for hover highlighting
  const neighborSet = useMemo(() => {
    if (!hoveredNode) return new Set<string>();
    return getNeighborIds(hoveredNode.id, graphData.links);
  }, [hoveredNode, graphData.links]);

  const hasHighlights = highlightedNodeIds.size > 0 || hoveredNode !== null;

  // Create geometries once
  const geometries = useMemo(() => ({
    sphere: new THREE.SphereGeometry(1, 16, 12),
    octahedron: new THREE.OctahedronGeometry(1),
    box: new THREE.BoxGeometry(1.4, 1.4, 1.4),
    dodecahedron: new THREE.DodecahedronGeometry(1),
    torus: new THREE.TorusGeometry(0.8, 0.3, 12, 24),
    icosahedron: new THREE.IcosahedronGeometry(1),
    cone: new THREE.ConeGeometry(0.8, 1.6, 12),
    cylinder: new THREE.CylinderGeometry(0.8, 0.8, 1.2, 16),
  }), []);

  // Setup bloom post-processing on mount and share graph ref for zoom controls
  useEffect(() => {
    if (!fgRef.current) return;

    const fg = fgRef.current;
    setGraphRef(fg);

    // Try to configure renderer (may fail if renderer not ready)
    const timer = setTimeout(() => {
      try {
        const renderer = fg.renderer?.();
        if (renderer) {
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1.2;
        }
      } catch (e) {
        // Renderer not available yet, that's ok
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      setGraphRef(null);
    };
  }, []);

  // Custom node rendering
  const nodeThreeObject = useCallback((node: GraphNode) => {
    const group = new THREE.Group();
    const style = NODE_STYLES[node.type] || NODE_STYLES.task;
    const size = (node.val || style.baseSize) * 0.8;

    // Determine if this node should be highlighted or dimmed
    const isSelected = selectedNode && selectedNode.id === node.id;
    const isHighlighted = highlightedNodeIds.has(node.id) ||
                          (hoveredNode && neighborSet.has(node.id));
    const isDimmed = hasHighlights && !isHighlighted && !isSelected &&
                     !(hoveredNode && hoveredNode.id === node.id);

    // Get geometry
    const geometry = geometries[style.geometry] || geometries.sphere;

    // Create material with glow
    const color = new THREE.Color(style.color);
    const material = new THREE.MeshLambertMaterial({
      color: color,
      transparent: true,
      opacity: isDimmed ? 0.25 : 0.9,
      emissive: color,
      emissiveIntensity: isHighlighted ? 0.8 : 0.25,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.setScalar(size);
    group.add(mesh);

    // Add outer glow sprite
    const spriteMaterial = new THREE.SpriteMaterial({
      map: createGlowTexture(style.color),
      transparent: true,
      opacity: isDimmed ? 0.05 : (isHighlighted ? 0.5 : 0.15),
      depthWrite: false,
    });
    const glowSprite = new THREE.Sprite(spriteMaterial);
    glowSprite.scale.setScalar(size * 4);
    group.add(glowSprite);

    // Add text label
    const sprite = new SpriteText(node.label);
    sprite.color = isDimmed ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.85)';
    sprite.textHeight = Math.max(2, size * 0.6);
    sprite.position.y = -(size + 3);
    sprite.fontFace = 'system-ui, -apple-system, sans-serif';
    sprite.fontWeight = '500';
    sprite.backgroundColor = isDimmed ? 'rgba(5,5,16,0.3)' : 'rgba(5,5,16,0.6)';
    sprite.padding = 1;
    sprite.borderRadius = 2;
    group.add(sprite);

    return group;
  }, [hoveredNode, selectedNode, highlightedNodeIds, neighborSet, hasHighlights, geometries]);

  // Handle node click - fly camera to node
  const handleNodeClick = useCallback((node: GraphNode) => {
    selectNode(node);
    setDetailPanelOpen(true);

    if (fgRef.current && node.x !== undefined && node.y !== undefined && node.z !== undefined) {
      const distance = 80;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z || 1);
      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        2000
      );
    }
  }, [selectNode, setDetailPanelOpen]);

  // Handle node hover - highlight neighbors (but don't override selection)
  const handleNodeHover = useCallback((node: GraphNode | null) => {
    if (selectedNode) return; // Selection owns highlights — ignore hover
    hoverNode(node || null);
    if (node) {
      const neighbors = getNeighborIds(node.id, graphData.links);
      setHighlightedNodeIds(neighbors);
    } else {
      clearHighlights();
    }
  }, [hoverNode, graphData.links, setHighlightedNodeIds, clearHighlights, selectedNode]);

  // Handle background click - deselect
  const handleBackgroundClick = useCallback(() => {
    selectNode(null);
    setDetailPanelOpen(false);
    clearHighlights();
  }, [selectNode, setDetailPanelOpen, clearHighlights]);

  // Link color accessor
  const linkColor = useCallback((link: GraphLink) => {
    const linkType = link.type;
    const baseColor = getLinkColor(linkType);
    if (!hasHighlights) return baseColor;

    const sourceId = typeof link.source === 'object' ? (link.source as GraphNode).id : link.source;
    const targetId = typeof link.target === 'object' ? (link.target as GraphNode).id : link.target;

    if (hoveredNode) {
      if (neighborSet.has(sourceId) && neighborSet.has(targetId)) return baseColor;
      return 'rgba(255,255,255,0.06)';
    }

    if (highlightedNodeIds.has(sourceId) || highlightedNodeIds.has(targetId)) {
      return baseColor;
    }

    return 'rgba(255,255,255,0.06)';
  }, [hasHighlights, hoveredNode, neighborSet, highlightedNodeIds]);

  // Link width accessor
  const linkWidth = useCallback((link: GraphLink) => {
    const style = LINK_STYLES[link.type];
    const base = style?.width ?? 0.5;

    if (!hasHighlights) return base;

    const sourceId = typeof link.source === 'object' ? (link.source as GraphNode).id : link.source;
    const targetId = typeof link.target === 'object' ? (link.target as GraphNode).id : link.target;

    if (hoveredNode && neighborSet.has(sourceId) && neighborSet.has(targetId)) {
      return base * 2.5;
    }

    return base * 0.3;
  }, [hasHighlights, hoveredNode, neighborSet]);

  // Link particles
  const linkParticles = useCallback((link: GraphLink) => {
    const style = LINK_STYLES[link.type];
    return style?.particles ?? 0;
  }, []);

  if (!filteredGraphData || filteredGraphData.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-[#050510]">
        <p className="text-slate-500 font-mono text-sm">No data loaded</p>
      </div>
    );
  }

  // Cast accessors to any to satisfy react-force-graph-3d's generic constraints.
  // The library's internal NodeObject/LinkObject types don't align with our strict
  // GraphNode/GraphLink interfaces, but runtime behavior is identical.
  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={filteredGraphData as any}
      backgroundColor="#050510"
      nodeThreeObject={nodeThreeObject as any}
      nodeThreeObjectExtend={false}
      nodeVal={((node: any) => node.val || 4) as any}
      linkColor={linkColor as any}
      linkWidth={linkWidth as any}
      linkOpacity={0.4}
      linkCurvature={0.1}
      linkCurveRotation={0}
      linkDirectionalParticles={linkParticles as any}
      linkDirectionalParticleSpeed={0.005}
      linkDirectionalParticleWidth={1.5}
      linkDirectionalParticleColor={((link: any) => getLinkColor(link.type)) as any}
      onNodeClick={handleNodeClick as any}
      onNodeHover={handleNodeHover as any}
      onBackgroundClick={handleBackgroundClick}
      d3VelocityDecay={0.3}
      d3AlphaDecay={0.02}
      warmupTicks={100}
      cooldownTicks={300}
      enableNodeDrag={mode === 'explore'}
      showNavInfo={false}
    />
  );
}

// Helper to create a glow texture
function createGlowTexture(color: string): THREE.Texture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.4, color + '40');
  gradient.addColorStop(1, 'transparent');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
