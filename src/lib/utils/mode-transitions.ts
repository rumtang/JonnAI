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
import { navigateToOverview } from '@/lib/utils/camera-navigation';

export function switchMode(newMode: AppMode, options?: { force?: boolean }) {
  const currentMode = usePresentationStore.getState().mode;
  if (newMode === currentMode && !options?.force) return;

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
  // Camera calls gracefully no-op if graphRef isn't ready (e.g. page init)
  if (newMode === 'guided') {
    usePresentationStore.getState().reset();
    useGraphStore.getState().loadLinearView();
    navigateToOverview({ z: 800, duration: 1500 });
  } else if (newMode === 'explore') {
    useGraphStore.getState().loadFullGraph();
    navigateToOverview({ z: 520, duration: 1500 });
  } else if (newMode === 'campaign') {
    useGraphStore.getState().loadFullGraph();
    useCampaignStore.getState().startCampaign();
    navigateToOverview({ z: 520, duration: 1200 });
  } else if (newMode === 'build') {
    useGraphStore.getState().loadFullGraph();
    navigateToOverview({ z: 520, duration: 1500 });
  } else if (newMode === 'roi') {
    useGraphStore.getState().loadLinearView();
    navigateToOverview({ z: 800, duration: 1500 });
  } else if (newMode === 'role') {
    useGraphStore.getState().loadFullGraph();
    // No camera fly — role mode covers graph with a scrim
  }
}
