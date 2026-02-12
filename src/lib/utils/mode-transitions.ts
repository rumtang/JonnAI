/**
 * Canonical mode transition logic.
 *
 * Every UI element that switches modes (ModeToggle, "Explore" CTAs, campaign
 * summary buttons, etc.) MUST call switchMode() instead of calling setMode()
 * directly. This prevents the recurring bug where different code paths do
 * different amounts of cleanup, leaving stale state that breaks the graph.
 *
 * See CLAUDE.md "Mode System" guardrails for context.
 */

import { type AppMode, usePresentationStore } from '@/lib/store/presentation-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { useCampaignStore } from '@/lib/store/campaign-store';
import { useBuildStore } from '@/lib/store/build-store';
import { useRoiStore } from '@/lib/store/roi-store';
import { useRoleInsightStore } from '@/lib/store/role-insight-store';
import { getGraphRef } from '@/lib/graph/graph-ref';

export function switchMode(newMode: AppMode) {
  const currentMode = usePresentationStore.getState().mode;
  if (newMode === currentMode) return;

  // ── Common cleanup (every mode transition) ──
  usePresentationStore.getState().setMode(newMode);
  useGraphStore.getState().selectNode(null);
  useGraphStore.getState().clearHighlights();
  useGraphStore.getState().resetFilters();
  useGraphStore.getState().clearNavigation();
  useRoleInsightStore.getState().clearRole();
  useCampaignStore.getState().resetCampaign();
  useBuildStore.getState().reset();
  useRoiStore.getState().reset();
  useGraphStore.setState({ progressiveReveal: false });

  // ── Per-mode setup ──
  const fg = getGraphRef();
  const origin = { x: 0, y: 0, z: 0 };

  if (newMode === 'guided') {
    usePresentationStore.getState().reset();
    useGraphStore.getState().loadLinearView();
    fg?.cameraPosition({ x: 0, y: 0, z: 800 }, origin, 1500);
  } else if (newMode === 'explore') {
    useGraphStore.getState().loadFullGraph();
    fg?.cameraPosition({ x: 0, y: 0, z: 520 }, origin, 1500);
  } else if (newMode === 'campaign') {
    useGraphStore.getState().loadFullGraph();
    useCampaignStore.getState().startCampaign();
    fg?.cameraPosition({ x: 0, y: 0, z: 520 }, origin, 1200);
  } else if (newMode === 'build') {
    useGraphStore.getState().loadFullGraph();
    fg?.cameraPosition({ x: 0, y: 0, z: 520 }, origin, 1500);
  } else if (newMode === 'roi') {
    useGraphStore.getState().loadLinearView();
    fg?.cameraPosition({ x: 0, y: 0, z: 800 }, origin, 1500);
  } else if (newMode === 'role') {
    useGraphStore.getState().loadFullGraph();
    // No camera fly — role mode covers graph with a scrim
  }
}
