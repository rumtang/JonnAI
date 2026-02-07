'use client';

import { usePresentationStore } from '@/lib/store/presentation-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { motion } from 'framer-motion';

export default function ModeToggle() {
  const { mode, setMode, reset } = usePresentationStore();
  const { loadFullGraph, loadLinearView, resetFilters, clearHighlights } = useGraphStore();

  const handleModeChange = (newMode: 'guided' | 'explore') => {
    if (newMode === mode) return;
    setMode(newMode);
    clearHighlights();
    resetFilters();

    if (newMode === 'guided') {
      reset();
      loadLinearView();
    } else {
      loadFullGraph();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed top-4 right-4 z-50 flex items-center gap-1 p-1 rounded-full bg-black/60 backdrop-blur-xl border border-white/10"
    >
      <button
        onClick={() => handleModeChange('guided')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
          mode === 'guided'
            ? 'bg-cyan-500/20 text-cyan-300 shadow-lg shadow-cyan-500/10'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        Guided Tour
      </button>
      <button
        onClick={() => handleModeChange('explore')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
          mode === 'explore'
            ? 'bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/10'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        Explore
      </button>
    </motion.div>
  );
}
