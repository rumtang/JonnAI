'use client';

import { useShallow } from 'zustand/react/shallow';
import { usePresentationStore } from '@/lib/store/presentation-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { useCampaignStore } from '@/lib/store/campaign-store';
import { useRoleInsightStore } from '@/lib/store/role-insight-store';
import { useIsMobile } from '@/lib/hooks/use-is-mobile';
import { motion } from 'framer-motion';

type Mode = 'guided' | 'explore' | 'campaign';

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

  const handleModeChange = (newMode: Mode) => {
    if (newMode === mode) return;
    setMode(newMode);
    selectNode(null);
    clearHighlights();
    resetFilters();
    clearNavigation();
    useRoleInsightStore.getState().clearRole();

    if (newMode === 'guided') {
      resetCampaign();
      reset();
      loadLinearView();
      // Disable progressive reveal in guided mode
      useGraphStore.setState({ progressiveReveal: false });
    } else if (newMode === 'explore') {
      resetCampaign();
      loadFullGraph();
      // Re-init progressive reveal with core nodes
      if (fullGraphData) initCoreNodes(fullGraphData);
    } else if (newMode === 'campaign') {
      resetCampaign();
      loadFullGraph();
      startCampaign();
      // Disable progressive reveal — campaign needs all nodes visible
      useGraphStore.setState({ progressiveReveal: false });
    }
  };

  const modes: { key: Mode; label: string; shortLabel: string; activeColor: string; activeBg: string }[] = [
    {
      key: 'guided',
      label: 'Guided Tour',
      shortLabel: 'Tour',
      activeColor: '#C9A04E',
      activeBg: 'bg-[#C9A04E]/20',
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
