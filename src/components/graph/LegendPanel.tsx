'use client';

import { motion } from 'framer-motion';
import { useUIStore } from '@/lib/store/ui-store';
import { NODE_STYLES } from '@/lib/graph/node-styles';
import { NodeType } from '@/lib/graph/types';

const LEGEND_ITEMS: { type: NodeType; label: string }[] = [
  { type: 'step',  label: 'Steps' },
  { type: 'gate',  label: 'Gates' },
  { type: 'agent', label: 'AI Agents' },
  { type: 'input', label: 'Inputs' },
];

export default function LegendPanel() {
  const { legendVisible, toggleLegend } = useUIStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="fixed bottom-4 left-4 z-50"
    >
      {legendVisible ? (
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
          <button
            onClick={toggleLegend}
            className="text-xs text-slate-500 hover:text-slate-300 mb-2 transition-colors"
          >
            Hide Legend
          </button>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            {LEGEND_ITEMS.map(item => (
              <div key={item.type} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: NODE_STYLES[item.type]?.color }}
                />
                <span className="text-xs text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={toggleLegend}
          className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-xl border border-white/10 text-xs text-slate-400 hover:text-white transition-all"
        >
          Legend
        </button>
      )}
    </motion.div>
  );
}
