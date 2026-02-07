'use client';

import { usePresentationStore } from '@/lib/store/presentation-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { useCampaignStore } from '@/lib/store/campaign-store';
import { motion } from 'framer-motion';

type Mode = 'guided' | 'explore' | 'campaign';

export default function ModeToggle() {
  const { mode, setMode, reset } = usePresentationStore();
  const { loadFullGraph, loadLinearView, resetFilters, clearHighlights, clearNavigation } = useGraphStore();
  const { startCampaign, endCampaign, resetCampaign } = useCampaignStore();

  const handleModeChange = (newMode: Mode) => {
    if (newMode === mode) return;
    setMode(newMode);
    clearHighlights();
    resetFilters();
    clearNavigation();

    if (newMode === 'guided') {
      endCampaign();
      reset();
      loadLinearView();
    } else if (newMode === 'explore') {
      endCampaign();
      loadFullGraph();
    } else if (newMode === 'campaign') {
      resetCampaign();
      loadFullGraph();
      startCampaign();
    }
  };

  const modes: { key: Mode; label: string; activeColor: string; activeBg: string }[] = [
    {
      key: 'guided',
      label: 'Guided Tour',
      activeColor: '#C9A04E',
      activeBg: 'bg-[#C9A04E]/20',
    },
    {
      key: 'explore',
      label: 'Explore',
      activeColor: '#9B7ACC',
      activeBg: 'bg-[#9B7ACC]/20',
    },
    {
      key: 'campaign',
      label: 'Campaign',
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
      {modes.map(({ key, label, activeColor, activeBg }) => (
        <button
          key={key}
          onClick={() => handleModeChange(key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            mode === key
              ? `${activeBg} shadow-lg`
              : 'text-muted-foreground hover:text-foreground'
          }`}
          style={mode === key ? { color: activeColor, boxShadow: `0 4px 12px ${activeColor}15` } : undefined}
        >
          {label}
        </button>
      ))}
    </motion.div>
  );
}
