'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import ForceGraph3D from './ForceGraph3DWrapper';
import { useGraphStore } from '@/lib/store/graph-store';
import { usePresentationStore } from '@/lib/store/presentation-store';
import { useCampaignStore } from '@/lib/store/campaign-store';
import { useUIStore } from '@/lib/store/ui-store';
import { NODE_STYLES } from '@/lib/graph/node-styles';
import { LINK_STYLES, getLinkColor } from '@/lib/graph/link-styles';
import { getNeighborIds, applyFilters } from '@/lib/graph/filters';
import { setGraphRef } from '@/lib/graph/graph-ref';
import { GraphNode, GraphLink, StepMeta } from '@/lib/graph/types';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
// @ts-expect-error -- d3-force-3d has no type declarations
import { forceCenter } from 'd3-force-3d';

// Memoized caches to avoid re-creating GPU resources per render
const colorCache = new Map<string, THREE.Color>();
const glowTextureCache = new Map<string, THREE.Texture>();
function getCachedColor(hex: string): THREE.Color {
  let c = colorCache.get(hex);
  if (!c) {
    c = new THREE.Color(hex);
    colorCache.set(hex, c);
  }
  return c;
}

function getCachedGlowTexture(color: string): THREE.Texture {
  let tex = glowTextureCache.get(color);
  if (!tex) {
    tex = createGlowTexture(color);
    glowTextureCache.set(color, tex);
  }
  return tex;
}

export default function GraphScene() {
  const fgRef = useRef<any>(null);
  const rotationRef = useRef<number | null>(null);

  // State values — re-render only when these change
  const {
    graphData,
    selectedNode,
    hoveredNode,
    highlightedNodeIds,
    visibleNodeTypes,
    visibleLinkTypes,
    searchQuery,
    flashingLinkKey,
    highlightedLinkTypes,
    revealedNodeIds,
    progressiveReveal,
  } = useGraphStore(
    useShallow((s) => ({
      graphData: s.graphData,
      selectedNode: s.selectedNode,
      hoveredNode: s.hoveredNode,
      highlightedNodeIds: s.highlightedNodeIds,
      visibleNodeTypes: s.visibleNodeTypes,
      visibleLinkTypes: s.visibleLinkTypes,
      searchQuery: s.searchQuery,
      flashingLinkKey: s.flashingLinkKey,
      highlightedLinkTypes: s.highlightedLinkTypes,
      revealedNodeIds: s.revealedNodeIds,
      progressiveReveal: s.progressiveReveal,
    }))
  );

  // Actions — stable references, no useShallow needed
  const selectNode = useGraphStore(s => s.selectNode);
  const hoverNode = useGraphStore(s => s.hoverNode);
  const setHighlightedNodeIds = useGraphStore(s => s.setHighlightedNodeIds);
  const clearHighlights = useGraphStore(s => s.clearHighlights);
  const expandNode = useGraphStore(s => s.expandNode);

  const mode = usePresentationStore(s => s.mode);
  // Use individual selectors to avoid re-rendering on every campaign store change
  const campaignActive = useCampaignStore(s => s.isActive);
  const campaignNodeId = useCampaignStore(s => s.currentNodeId);
  const campaignVisited = useCampaignStore(s => s.visitedNodes);
  const setDetailPanelOpen = useUIStore(s => s.setDetailPanelOpen);

  // In campaign mode, build sets for highlighting
  const campaignVisitedSet = useMemo(
    () => new Set(campaignActive ? campaignVisited : []),
    [campaignActive, campaignVisited]
  );
  // Neighbors of the current campaign node (agents, inputs connected to it)
  const campaignNeighborSet = useMemo(() => {
    if (!campaignActive) return new Set<string>();
    return getNeighborIds(campaignNodeId, graphData.links);
  }, [campaignActive, campaignNodeId, graphData.links]);

  // Apply node/link type filters, search query, and progressive reveal
  const filteredGraphData = useMemo(
    () => applyFilters(graphData, visibleNodeTypes, visibleLinkTypes, searchQuery, revealedNodeIds, progressiveReveal),
    [graphData, visibleNodeTypes, visibleLinkTypes, searchQuery, revealedNodeIds, progressiveReveal]
  );

  // Compute neighbor sets for hover highlighting
  const neighborSet = useMemo(() => {
    if (!hoveredNode) return new Set<string>();
    return getNeighborIds(hoveredNode.id, graphData.links);
  }, [hoveredNode, graphData.links]);

  const hasHighlights = highlightedNodeIds.size > 0 || hoveredNode !== null || highlightedLinkTypes.size > 0;

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

  // Setup renderer, lighting, and slow rotation on mount
  useEffect(() => {
    if (!fgRef.current) return;

    const fg = fgRef.current;
    setGraphRef(fg);

    // Add a center force so nodes stay anchored near the origin
    // Without this, the graph drifts off-screen over time in explore mode
    fg.d3Force('center', forceCenter(0, 0, 0).strength(0.05));
    fg.d3Force('charge')?.strength(-80);

    const lights: THREE.Light[] = [];

    const timer = setTimeout(() => {
      try {
        const renderer = fg.renderer?.();
        if (renderer) {
          // Transparent canvas so CSS animated background shows through
          renderer.setClearColor(0x000000, 0);
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1.0;
        }

        const scene = fg.scene?.();
        if (scene) {
          // Warm key light from top-right
          const keyLight = new THREE.DirectionalLight(0xfff5e6, 0.8);
          keyLight.position.set(100, 150, 100);
          scene.add(keyLight);
          lights.push(keyLight);

          // Cool fill light from bottom-left
          const fillLight = new THREE.DirectionalLight(0xe6f2ff, 0.4);
          fillLight.position.set(-100, -80, -50);
          scene.add(fillLight);
          lights.push(fillLight);

          // Base ambient illumination
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
          scene.add(ambientLight);
          lights.push(ambientLight);

          // Inner glow point light
          const pointLight = new THREE.PointLight(0xffeaa7, 0.3, 200);
          pointLight.position.set(0, 0, 0);
          scene.add(pointLight);
          lights.push(pointLight);
        }
      } catch {
        // Renderer/scene not available yet
      }
    }, 500);

    // Slow scene rotation when no node is hovered/selected
    const animate = () => {
      rotationRef.current = requestAnimationFrame(animate);
      try {
        const scene = fg.scene?.();
        if (scene) {
          scene.rotation.y += 0.0002;
        }
      } catch {
        // Scene not ready
      }
    };
    rotationRef.current = requestAnimationFrame(animate);

    return () => {
      clearTimeout(timer);
      if (rotationRef.current !== null) {
        cancelAnimationFrame(rotationRef.current);
      }
      // Remove lights from scene on unmount (prevents accumulation during HMR)
      try {
        const scene = fg.scene?.();
        if (scene) {
          lights.forEach(light => {
            scene.remove(light);
            light.dispose();
          });
        }
      } catch { /* scene may already be destroyed */ }
      setGraphRef(null);
    };
  }, []);

  // Custom node rendering with crystalline materials
  const nodeThreeObject = useCallback((node: GraphNode) => {
    const group = new THREE.Group();
    const style = NODE_STYLES[node.type] || NODE_STYLES.step;
    const size = (node.val || style.baseSize) * 0.8;

    // Campaign mode visual state
    const isCampaignCurrent = campaignActive && node.id === campaignNodeId;
    const isCampaignVisited = campaignActive && campaignVisitedSet.has(node.id);
    const isCampaignNeighbor = campaignActive && campaignNeighborSet.has(node.id);

    const isSelected = selectedNode && selectedNode.id === node.id;
    const isHighlighted = highlightedNodeIds.has(node.id) ||
                          (hoveredNode && neighborSet.has(node.id)) ||
                          isCampaignCurrent || isCampaignVisited || isCampaignNeighbor;
    const isDimmed = campaignActive
      ? (!isCampaignCurrent && !isCampaignVisited && !isCampaignNeighbor)
      : (hasHighlights && !isHighlighted && !isSelected &&
         !(hoveredNode && hoveredNode.id === node.id));

    const geometry = geometries[style.geometry] || geometries.icosahedron;

    // Crystalline MeshPhysicalMaterial with clearcoat
    const color = getCachedColor(style.color);
    const material = new THREE.MeshPhysicalMaterial({
      color: color,
      metalness: 0.3,
      roughness: 0.15,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: isDimmed ? 0.35 : 0.95,
      emissive: isHighlighted ? color : new THREE.Color(0x000000),
      emissiveIntensity: isHighlighted ? 0.3 : 0,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.setScalar(size);
    group.add(mesh);

    // Soft glow sprite with additive blending
    const spriteMaterial = new THREE.SpriteMaterial({
      map: getCachedGlowTexture(isCampaignCurrent ? '#4CAF50' : style.color),
      transparent: true,
      opacity: isDimmed ? 0.04 : (isCampaignCurrent ? 0.45 : isHighlighted ? 0.30 : 0.12),
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const glowSprite = new THREE.Sprite(spriteMaterial);
    glowSprite.scale.setScalar(isCampaignCurrent ? size * 6 : size * 4);
    group.add(glowSprite);

    // Campaign current-node ring indicator
    if (isCampaignCurrent) {
      const ringGeom = new THREE.RingGeometry(size * 1.3, size * 1.6, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x4CAF50,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      group.add(ring);
    }

    // Campaign visited node — subtle green tint on glow
    if (isCampaignVisited && !isCampaignCurrent) {
      const visitedGlow = new THREE.SpriteMaterial({
        map: getCachedGlowTexture('#4CAF50'),
        transparent: true,
        opacity: 0.15,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const visitedSprite = new THREE.Sprite(visitedGlow);
      visitedSprite.scale.setScalar(size * 3);
      group.add(visitedSprite);
    }

    // Text label — dark charcoal on warm cream pill
    const sprite = new SpriteText(node.label);
    sprite.color = isDimmed ? 'rgba(40,40,50,0.35)' : 'rgba(40,40,50,0.90)';
    sprite.textHeight = Math.max(2, size * 0.6);
    sprite.position.y = -(size + 3);
    sprite.fontFace = 'system-ui, -apple-system, sans-serif';
    sprite.fontWeight = '600';
    sprite.backgroundColor = isDimmed ? 'rgba(250,248,245,0.3)' : 'rgba(250,248,245,0.85)';
    sprite.padding = 1;
    sprite.borderRadius = 2;
    group.add(sprite);

    // Owner badge for step nodes (AI / Human / Shared)
    if (node.type === 'step' && node.meta) {
      const stepMeta = node.meta as StepMeta;
      const ownerLabels: Record<string, string> = {
        agent: '\uD83E\uDD16 AI',
        human: '\uD83D\uDC64 Human',
        shared: '\uD83E\uDD1D Shared',
      };
      const ownerColors: Record<string, string> = {
        agent: 'rgba(155,122,204,0.85)',
        human: 'rgba(91,158,207,0.85)',
        shared: 'rgba(201,160,78,0.85)',
      };
      const ownerText = ownerLabels[stepMeta.owner];
      if (ownerText) {
        const ownerSprite = new SpriteText(ownerText);
        ownerSprite.color = isDimmed ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.9)';
        ownerSprite.textHeight = Math.max(1.5, size * 0.4);
        ownerSprite.position.y = -(size + 3 + Math.max(2, size * 0.6) + 1.5);
        ownerSprite.fontFace = 'system-ui, -apple-system, sans-serif';
        ownerSprite.fontWeight = '500';
        ownerSprite.backgroundColor = isDimmed ? 'rgba(0,0,0,0.15)' : (ownerColors[stepMeta.owner] || 'rgba(0,0,0,0.4)');
        ownerSprite.padding = 0.8;
        ownerSprite.borderRadius = 1.5;
        group.add(ownerSprite);
      }
    }

    return group;
  }, [hoveredNode, selectedNode, highlightedNodeIds, neighborSet, hasHighlights, geometries, campaignActive, campaignNodeId, campaignVisitedSet, campaignNeighborSet]);

  // Handle node click - fly camera to node (cinematic 2500ms)
  // Breadcrumbs only track connection navigation in NodeDetailPanel, not direct clicks.
  const handleNodeClick = useCallback((node: GraphNode) => {
    // Reveal neighbors when progressive reveal is active
    if (progressiveReveal) expandNode(node.id);
    selectNode(node);
    setDetailPanelOpen(true);

    if (fgRef.current && node.x !== undefined && node.y !== undefined && node.z !== undefined) {
      // Fixed offset from the node — avoids the ratio-based calculation that
      // sends the camera to infinity when a node is near the origin
      const distance = 120;
      fgRef.current.cameraPosition(
        { x: node.x, y: node.y, z: node.z + distance },
        { x: node.x, y: node.y, z: node.z },
        2500
      );
    }
  }, [selectNode, setDetailPanelOpen, progressiveReveal, expandNode]);

  // Handle node hover
  const handleNodeHover = useCallback((node: GraphNode | null) => {
    // Block hover highlight when a node is manually selected (not in campaign mode)
    if (selectedNode && !campaignActive) return;
    hoverNode(node || null);
    if (node) {
      const neighbors = getNeighborIds(node.id, graphData.links);
      setHighlightedNodeIds(neighbors);
    } else {
      clearHighlights();
    }
  }, [hoverNode, graphData.links, setHighlightedNodeIds, clearHighlights, selectedNode, campaignActive]);

  // Handle background click - deselect
  const handleBackgroundClick = useCallback(() => {
    selectNode(null);
    setDetailPanelOpen(false);
    clearHighlights();
  }, [selectNode, setDetailPanelOpen, clearHighlights]);

  // Link color accessor — warm gray for dimmed links, bright white for flashing links
  const linkColor = useCallback((link: GraphLink) => {
    const linkType = link.type;
    const baseColor = getLinkColor(linkType);

    const sourceId = typeof link.source === 'object' ? (link.source as GraphNode).id : link.source;
    const targetId = typeof link.target === 'object' ? (link.target as GraphNode).id : link.target;

    // Flash effect — bright highlight on the link being navigated
    if (flashingLinkKey) {
      const fwd = `${sourceId}--${targetId}`;
      const rev = `${targetId}--${sourceId}`;
      if (flashingLinkKey === fwd || flashingLinkKey === rev) {
        return '#ffffff';
      }
    }

    // Campaign mode — highlight traversed flows-to links in green
    if (campaignActive) {
      const bothVisited = campaignVisitedSet.has(sourceId) && campaignVisitedSet.has(targetId);
      if (bothVisited && linkType === 'flows-to') return '#4CAF50';
      // Links to/from campaign neighbors (agents, inputs) stay visible
      if (campaignNeighborSet.has(sourceId) && campaignNeighborSet.has(targetId)) return baseColor;
      return 'rgba(160,150,140,0.08)';
    }

    if (!hasHighlights) return baseColor;

    if (hoveredNode) {
      if (neighborSet.has(sourceId) && neighborSet.has(targetId)) return baseColor;
      return 'rgba(160,150,140,0.15)';
    }

    // Link type highlighting (from presentation actions)
    if (highlightedLinkTypes.size > 0) {
      if (highlightedLinkTypes.has(link.type)) return baseColor;
      // If only link types are highlighted (no node highlights), dim non-matching links
      if (highlightedNodeIds.size === 0) return 'rgba(160,150,140,0.15)';
    }

    if (highlightedNodeIds.has(sourceId) || highlightedNodeIds.has(targetId)) {
      // If link types are also active, only show matching link types for highlighted nodes
      if (highlightedLinkTypes.size > 0 && !highlightedLinkTypes.has(link.type)) {
        return 'rgba(160,150,140,0.15)';
      }
      return baseColor;
    }

    return 'rgba(160,150,140,0.15)';
  }, [hasHighlights, hoveredNode, neighborSet, highlightedNodeIds, highlightedLinkTypes, flashingLinkKey, campaignActive, campaignVisitedSet, campaignNeighborSet]);

  // Link width accessor
  const linkWidth = useCallback((link: GraphLink) => {
    const style = LINK_STYLES[link.type];
    const base = style?.width ?? 0.5;

    // Widen the flashing link during connection navigation
    if (flashingLinkKey) {
      const sourceId = typeof link.source === 'object' ? (link.source as GraphNode).id : link.source;
      const targetId = typeof link.target === 'object' ? (link.target as GraphNode).id : link.target;
      const fwd = `${sourceId}--${targetId}`;
      const rev = `${targetId}--${sourceId}`;
      if (flashingLinkKey === fwd || flashingLinkKey === rev) {
        return base * 3;
      }
    }

    if (!hasHighlights) return base;

    const sourceId = typeof link.source === 'object' ? (link.source as GraphNode).id : link.source;
    const targetId = typeof link.target === 'object' ? (link.target as GraphNode).id : link.target;

    if (hoveredNode && neighborSet.has(sourceId) && neighborSet.has(targetId)) {
      return base * 2.5;
    }

    // Widen highlighted link types (presentation mode)
    if (highlightedLinkTypes.size > 0 && highlightedLinkTypes.has(link.type)) {
      return base * 1.8;
    }

    return base * 0.3;
  }, [hasHighlights, hoveredNode, neighborSet, highlightedLinkTypes, flashingLinkKey]);

  // Link particles
  const linkParticles = useCallback((link: GraphLink) => {
    const style = LINK_STYLES[link.type];
    return style?.particles ?? 0;
  }, []);

  if (!filteredGraphData || filteredGraphData.nodes.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-muted-foreground font-mono text-sm">No data loaded</p>
      </div>
    );
  }

  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={filteredGraphData as any}
      backgroundColor="rgba(0,0,0,0)"
      nodeThreeObject={nodeThreeObject as any}
      nodeThreeObjectExtend={false}
      nodeVal={((node: any) => node.val || 4) as any}
      linkColor={linkColor as any}
      linkWidth={linkWidth as any}
      linkOpacity={0.6}
      linkCurvature={0.1}
      linkCurveRotation={0}
      linkDirectionalParticles={linkParticles as any}
      linkDirectionalParticleSpeed={0.003}
      linkDirectionalParticleWidth={2.0}
      linkDirectionalParticleColor={((link: any) => getLinkColor(link.type)) as any}
      onNodeClick={handleNodeClick as any}
      onNodeHover={handleNodeHover as any}
      onBackgroundClick={handleBackgroundClick}
      d3VelocityDecay={0.5}
      d3AlphaDecay={0.03}
      warmupTicks={100}
      cooldownTicks={300}
      enableNodeDrag={mode === 'explore' && !campaignActive}
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
