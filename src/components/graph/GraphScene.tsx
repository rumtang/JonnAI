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

// Material caches — prevent recreating identical GPU resources per render
const physicalMaterialCache = new Map<string, THREE.MeshPhysicalMaterial>();
function getCachedPhysicalMaterial(colorHex: string, opacity: number, emissive: boolean): THREE.MeshPhysicalMaterial {
  const cacheKey = `${colorHex}-${opacity.toFixed(2)}-${emissive ? 1 : 0}`;
  let mat = physicalMaterialCache.get(cacheKey);
  if (!mat) {
    const color = getCachedColor(colorHex);
    mat = new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.3,
      roughness: 0.15,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity,
      emissive: emissive ? color : new THREE.Color(0x000000),
      emissiveIntensity: emissive ? 0.3 : 0,
    });
    physicalMaterialCache.set(cacheKey, mat);
  }
  return mat;
}

const spriteMaterialCache = new Map<string, THREE.SpriteMaterial>();
function getCachedSpriteMaterial(glowColor: string, opacity: number): THREE.SpriteMaterial {
  const cacheKey = `${glowColor}-${opacity.toFixed(2)}`;
  let mat = spriteMaterialCache.get(cacheKey);
  if (!mat) {
    mat = new THREE.SpriteMaterial({
      map: getCachedGlowTexture(glowColor),
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    spriteMaterialCache.set(cacheKey, mat);
  }
  return mat;
}

// Ring geometry cache — avoids creating new RingGeometry on every campaign node update
const ringGeometryCache = new Map<string, THREE.RingGeometry>();
function getCachedRingGeometry(innerRadius: number, outerRadius: number): THREE.RingGeometry {
  const key = `${innerRadius.toFixed(2)}-${outerRadius.toFixed(2)}`;
  let geom = ringGeometryCache.get(key);
  if (!geom) {
    geom = new THREE.RingGeometry(innerRadius, outerRadius, 32);
    ringGeometryCache.set(key, geom);
  }
  return geom;
}

const ringMaterialCache = new Map<string, THREE.MeshBasicMaterial>();
function getCachedRingMaterial(color: number, opacity: number): THREE.MeshBasicMaterial {
  const cacheKey = `${color}-${opacity}`;
  let mat = ringMaterialCache.get(cacheKey);
  if (!mat) {
    mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
    });
    ringMaterialCache.set(cacheKey, mat);
  }
  return mat;
}

// Node THREE.Group object cache — avoids recreating meshes/sprites on every hover
// Each entry stores the group and references to mutable children for fast updates
interface CachedNodeGroup {
  group: THREE.Group;
  mesh: THREE.Mesh;
  glowSprite: THREE.Sprite;
  labelSprite: SpriteText;
  ownerSprite?: SpriteText;
  campaignRing?: THREE.Mesh;
  visitedSprite?: THREE.Sprite;
}
const nodeGroupCache = new Map<string, CachedNodeGroup>();

export default function GraphScene() {
  const fgRef = useRef<any>(null);
  const rotationRef = useRef<number | null>(null);
  const isInteracting = useRef(false);
  const interactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rotationStopped = useRef(false);

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

  // Dispose shared GPU resources on unmount (prevents leaks during HMR / navigation)
  useEffect(() => {
    return () => {
      Object.values(geometries).forEach(g => g.dispose());
      for (const geom of ringGeometryCache.values()) geom.dispose();
      ringGeometryCache.clear();
      nodeGroupCache.clear();
    };
  }, [geometries]);

  // Setup renderer, lighting, and slow rotation on mount
  useEffect(() => {
    if (!fgRef.current) return;

    const fg = fgRef.current;
    setGraphRef(fg);

    // Force settings tuned for 83-node graph (expanded from original 25 nodes).
    // Center force anchors graph near origin; charge pushes nodes apart;
    // link distance controls minimum spacing between connected nodes.
    fg.d3Force('center', forceCenter(0, 0, 0).strength(0.01));
    fg.d3Force('charge')?.strength(-600);
    fg.d3Force('link')?.distance(50);

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

    // Slow scene rotation — pauses during interaction, stops entirely after 30s idle
    // to let the GPU enter low-power state (important for MacBook presentations)
    const animate = () => {
      rotationRef.current = requestAnimationFrame(animate);
      if (isInteracting.current) return;
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
    rotationStopped.current = false;

    // Auto-stop rotation after 30s to save GPU when idle
    idleTimer.current = setTimeout(() => {
      if (rotationRef.current !== null) {
        cancelAnimationFrame(rotationRef.current);
        rotationRef.current = null;
        rotationStopped.current = true;
      }
    }, 30000);

    return () => {
      clearTimeout(timer);
      if (idleTimer.current) clearTimeout(idleTimer.current);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clean up stale cache entries when the visible node set changes
  useEffect(() => {
    const visibleIds = new Set(filteredGraphData.nodes.map(n => n.id));
    for (const [id] of nodeGroupCache) {
      if (!visibleIds.has(id)) {
        // Ring geometries and sprite geometries are shared/cached — no per-node dispose needed
        nodeGroupCache.delete(id);
      }
    }
  }, [filteredGraphData]);

  // Custom node rendering with crystalline materials — uses object cache
  // to avoid recreating THREE.Group/Mesh/Sprite on every hover change
  const nodeThreeObject = useCallback((node: GraphNode) => {
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

    const cached = nodeGroupCache.get(node.id);

    if (cached) {
      // ── Update path: mutate existing objects instead of recreating ──
      const { group, mesh, glowSprite, labelSprite, ownerSprite } = cached;

      // Swap material (cheap pointer reassignment to cached material)
      mesh.material = getCachedPhysicalMaterial(style.color, isDimmed ? 0.35 : 0.95, !!isHighlighted);

      // Update glow
      const glowColor = isCampaignCurrent ? '#4CAF50' : style.color;
      const glowOpacity = isDimmed ? 0.04 : (isCampaignCurrent ? 0.45 : isHighlighted ? 0.30 : 0.12);
      glowSprite.material = getCachedSpriteMaterial(glowColor, glowOpacity);
      glowSprite.scale.setScalar(isCampaignCurrent ? size * 6 : size * 4);

      // Update label colors
      labelSprite.color = isDimmed ? 'rgba(40,40,50,0.35)' : 'rgba(40,40,50,0.90)';
      labelSprite.backgroundColor = isDimmed ? 'rgba(250,248,245,0.3)' : 'rgba(250,248,245,0.85)';

      // Update owner badge colors
      if (ownerSprite) {
        const ownerColors: Record<string, string> = {
          agent: 'rgba(155,122,204,0.85)',
          human: 'rgba(91,158,207,0.85)',
          shared: 'rgba(201,160,78,0.85)',
        };
        const stepMeta = node.meta as StepMeta;
        ownerSprite.color = isDimmed ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.9)';
        ownerSprite.backgroundColor = isDimmed ? 'rgba(0,0,0,0.15)' : (ownerColors[stepMeta.owner] || 'rgba(0,0,0,0.4)');
      }

      // Campaign ring: add/remove dynamically (geometry is cached, not disposed per-node)
      if (isCampaignCurrent && !cached.campaignRing) {
        const ring = new THREE.Mesh(getCachedRingGeometry(size * 1.3, size * 1.6), getCachedRingMaterial(0x4CAF50, 0.7));
        group.add(ring);
        cached.campaignRing = ring;
      } else if (!isCampaignCurrent && cached.campaignRing) {
        group.remove(cached.campaignRing);
        cached.campaignRing = undefined;
      }

      // Campaign visited sprite: add/remove dynamically
      if (isCampaignVisited && !isCampaignCurrent && !cached.visitedSprite) {
        const vs = new THREE.Sprite(getCachedSpriteMaterial('#4CAF50', 0.15));
        vs.scale.setScalar(size * 3);
        group.add(vs);
        cached.visitedSprite = vs;
      } else if ((!isCampaignVisited || isCampaignCurrent) && cached.visitedSprite) {
        group.remove(cached.visitedSprite);
        cached.visitedSprite.geometry.dispose();
        cached.visitedSprite = undefined;
      }

      return group;
    }

    // ── Create path: build new Group for this node ──
    const group = new THREE.Group();
    const geometry = geometries[style.geometry] || geometries.icosahedron;

    const material = getCachedPhysicalMaterial(style.color, isDimmed ? 0.35 : 0.95, !!isHighlighted);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.setScalar(size);
    group.add(mesh);

    const glowColor = isCampaignCurrent ? '#4CAF50' : style.color;
    const glowOpacity = isDimmed ? 0.04 : (isCampaignCurrent ? 0.45 : isHighlighted ? 0.30 : 0.12);
    const glowSprite = new THREE.Sprite(getCachedSpriteMaterial(glowColor, glowOpacity));
    glowSprite.scale.setScalar(isCampaignCurrent ? size * 6 : size * 4);
    group.add(glowSprite);

    let campaignRing: THREE.Mesh | undefined;
    if (isCampaignCurrent) {
      campaignRing = new THREE.Mesh(getCachedRingGeometry(size * 1.3, size * 1.6), getCachedRingMaterial(0x4CAF50, 0.7));
      group.add(campaignRing);
    }

    let visitedSprite: THREE.Sprite | undefined;
    if (isCampaignVisited && !isCampaignCurrent) {
      visitedSprite = new THREE.Sprite(getCachedSpriteMaterial('#4CAF50', 0.15));
      visitedSprite.scale.setScalar(size * 3);
      group.add(visitedSprite);
    }

    // Text label
    const labelSprite = new SpriteText(node.label);
    labelSprite.color = isDimmed ? 'rgba(40,40,50,0.35)' : 'rgba(40,40,50,0.90)';
    labelSprite.textHeight = Math.max(2, size * 0.6);
    labelSprite.position.y = -(size + 3);
    labelSprite.fontFace = 'system-ui, -apple-system, sans-serif';
    labelSprite.fontWeight = '600';
    labelSprite.backgroundColor = isDimmed ? 'rgba(250,248,245,0.3)' : 'rgba(250,248,245,0.85)';
    labelSprite.padding = 1;
    labelSprite.borderRadius = 2;
    group.add(labelSprite);

    // Owner badge for step nodes
    let ownerSprite: SpriteText | undefined;
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
        ownerSprite = new SpriteText(ownerText);
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

    // Store in cache
    nodeGroupCache.set(node.id, {
      group,
      mesh,
      glowSprite,
      labelSprite,
      ownerSprite,
      campaignRing,
      visitedSprite,
    });

    return group;
  }, [hoveredNode, selectedNode, highlightedNodeIds, neighborSet, hasHighlights, geometries, campaignActive, campaignNodeId, campaignVisitedSet, campaignNeighborSet, filteredGraphData]);

  // Pause rotation on interaction, resume after 3s idle.
  // Restart the RAF loop if it was stopped by the 30s idle timeout.
  const markInteracting = useCallback(() => {
    isInteracting.current = true;
    if (interactionTimer.current) clearTimeout(interactionTimer.current);
    interactionTimer.current = setTimeout(() => {
      isInteracting.current = false;
    }, 3000);

    // Restart rotation loop if it was stopped by idle timeout
    if (rotationStopped.current && fgRef.current) {
      rotationStopped.current = false;
      const fg = fgRef.current;
      const animate = () => {
        rotationRef.current = requestAnimationFrame(animate);
        if (isInteracting.current) return;
        try {
          const scene = fg.scene?.();
          if (scene) scene.rotation.y += 0.0002;
        } catch { /* scene not ready */ }
      };
      rotationRef.current = requestAnimationFrame(animate);
    }

    // Reset idle auto-stop timer
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      if (rotationRef.current !== null) {
        cancelAnimationFrame(rotationRef.current);
        rotationRef.current = null;
        rotationStopped.current = true;
      }
    }, 30000);
  }, []);

  // Handle node click - fly camera to node (cinematic 2500ms)
  // Breadcrumbs only track connection navigation in NodeDetailPanel, not direct clicks.
  const handleNodeClick = useCallback((node: GraphNode) => {
    markInteracting();
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
  }, [selectNode, setDetailPanelOpen, progressiveReveal, expandNode, markInteracting]);

  // Handle node hover
  const handleNodeHover = useCallback((node: GraphNode | null) => {
    if (node) markInteracting();
    // Block hover highlight when a node is manually selected (not in campaign mode)
    if (selectedNode && !campaignActive) return;
    hoverNode(node || null);
    if (node) {
      const neighbors = getNeighborIds(node.id, graphData.links);
      setHighlightedNodeIds(neighbors);
    } else {
      clearHighlights();
    }
  }, [hoverNode, graphData.links, setHighlightedNodeIds, clearHighlights, selectedNode, campaignActive, markInteracting]);

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
      d3AlphaDecay={(mode === 'explore' || mode === 'guided') ? 0.08 : 0.5}
      warmupTicks={100}
      cooldownTicks={150}
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
