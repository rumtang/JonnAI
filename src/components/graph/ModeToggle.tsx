'use client';

import { useShallow } from 'zustand/react/shallow';
import { usePresentationStore, type AppMode } from '@/lib/store/presentation-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { useCampaignStore } from '@/lib/store/campaign-store';
import { useRoleInsightStore } from '@/lib/store/role-insight-store';
import { useBuildStore } from '@/lib/store/build-store';
import { useRoiStore } from '@/lib/store/roi-store';
import { getGraphRef } from '@/lib/graph/graph-ref';
import { useIsMobile } from '@/lib/hooks/use-is-mobile';
import { motion } from 'framer-motion';

export default function ModeToggle() {
  const isMobile = useIsMobile();
  const { mode } = usePresentationStore(useShallow((s) => ({ mode: s.mode })));
  const setMode = usePresentationStore(s => s.setMode);
  const reset = usePresentationStore(s => s.reset);

  const { fullGraphData } = useGraphStore(useShallow((s) => ({ fullGraphData: s.fullGraphData })));
  const loadFullGraph = useGraphStore(s => s.loadFullGraph);
  const loadLinearView = useGraphStore(s => s.loadLinearView);
  const resetFilters = useGraphStore(s => s.resetFilters);
  const clearHighlights = useGraphStore(s => s.clearHighlights);
  const clearNavigation = useGraphStore(s => s.clearNavigation);
  const selectNode = useGraphStore(s => s.selectNode);
  const initCoreNodes = useGraphStore(s => s.initCoreNodes);

  const startCampaign = useCampaignStore(s => s.startCampaign);
  const resetCampaign = useCampaignStore(s => s.resetCampaign);

  const resetBuild = useBuildStore(s => s.reset);
  const resetRoi = useRoiStore(s => s.reset);

  const handleModeChange = (newMode: AppMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    selectNode(null);
    clearHighlights();
    resetFilters();
    clearNavigation();
    useRoleInsightStore.getState().clearRole();

    // Fly camera to a sensible default for each mode so the user
    // always gets a clean, re-centered view on tab switch.
    const fg = getGraphRef();
    const origin = { x: 0, y: 0, z: 0 };

    if (newMode === 'guided') {
      resetCampaign();
      resetBuild();
      resetRoi();
      reset();
      loadLinearView();
      useGraphStore.setState({ progressiveReveal: false });
      // Title slide position — PresentationController will refine on step execute
      fg?.cameraPosition({ x: 0, y: 0, z: 800 }, origin, 1500);
    } else if (newMode === 'explore') {
      resetCampaign();
      resetBuild();
      resetRoi();
      loadFullGraph();
      if (fullGraphData) initCoreNodes(fullGraphData);
      // Centered overview of full graph
      fg?.cameraPosition({ x: 0, y: 0, z: 520 }, origin, 1500);
    } else if (newMode === 'campaign') {
      resetCampaign();
      resetBuild();
      resetRoi();
      loadFullGraph();
      startCampaign();
      useGraphStore.setState({ progressiveReveal: false });
      // Brief overview before the campaign useEffect flies to the first node
      fg?.cameraPosition({ x: 0, y: 0, z: 520 }, origin, 1200);
    } else if (newMode === 'build') {
      resetCampaign();
      resetBuild();
      resetRoi();
      loadFullGraph();
      useGraphStore.setState({ progressiveReveal: false });
      // Full graph behind scrim — "View in Graph" needs full node data
      fg?.cameraPosition({ x: 0, y: 0, z: 520 }, origin, 1500);
    } else if (newMode === 'roi') {
      resetCampaign();
      resetBuild();
      resetRoi();
      loadLinearView();
      useGraphStore.setState({ progressiveReveal: false });
      fg?.cameraPosition({ x: 0, y: 0, z: 800 }, origin, 1500);
    } else if (newMode === 'role') {
      resetCampaign();
      resetBuild();
      resetRoi();
      loadFullGraph();
      useGraphStore.setState({ progressiveReveal: false });
      fg?.cameraPosition({ x: 0, y: 0, z: 520 }, origin, 1500);
    }
  };

  const modes: { key: AppMode; label: string; shortLabel: string; activeColor: string; activeBg: string }[] = [
    {
      key: 'guided',
      label: 'Guided Tour',
      shortLabel: 'Tour',
      activeColor: '#C9A04E',
      activeBg: 'bg-[#C9A04E]/20',
    },
    {
      key: 'role',
      label: 'Your Role',
      shortLabel: 'Role',
      activeColor: '#5B9ECF',
      activeBg: 'bg-[#5B9ECF]/20',
    },
    {
      key: 'explore',
      label: 'Explore',
      shortLabel: 'Explore',
      activeColor: '#9B7ACC',
      activeBg: 'bg-[#9B7ACC]/20',
    },
    {
      key: 'campaign',
      label: 'Campaign',
      shortLabel: 'Run',
      activeColor: '#4CAF50',
      activeBg: 'bg-[#4CAF50]/20',
    },
    {
      key: 'build',
      label: 'Build It',
      shortLabel: 'Build',
      activeColor: '#E88D67',
      activeBg: 'bg-[#E88D67]/20',
    },
    {
      key: 'roi',
      label: 'ROI',
      shortLabel: 'ROI',
      activeColor: '#14B8A6',
      activeBg: 'bg-[#14B8A6]/20',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed top-4 right-4 z-50 flex items-center gap-1 p-1 rounded-full glass-panel"
    >
      {modes.map(({ key, label, shortLabel, activeColor, activeBg }) => (
        <button
          key={key}
          onClick={() => handleModeChange(key)}
          className={`rounded-full font-medium transition-all duration-300 ${
            isMobile ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-2 text-sm'
          } ${
            mode === key
              ? `${activeBg} shadow-lg`
              : 'text-muted-foreground hover:text-foreground'
          }`}
          style={mode === key ? { color: activeColor, boxShadow: `0 4px 12px ${activeColor}15` } : undefined}
        >
          {isMobile ? shortLabel : label}
        </button>
      ))}
    </motion.div>
  );
}
