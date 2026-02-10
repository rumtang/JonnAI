'use client';

import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { motion } from 'framer-motion';
import { useGraphStore } from '@/lib/store/graph-store';
import { useUIStore } from '@/lib/store/ui-store';
import { useIsMobile } from '@/lib/hooks/use-is-mobile';
import { NODE_STYLES } from '@/lib/graph/node-styles';
import { NodeType } from '@/lib/graph/types';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Filter, RotateCcw, Eye, Focus } from 'lucide-react';

const NODE_TYPE_LABELS: Record<NodeType, string> = {
  step:  'Steps',
  gate:  'Gates',
  agent: 'AI Agents',
  input: 'Inputs',
};

export default function GraphControls() {
  const { visibleNodeTypes, progressiveReveal } = useGraphStore(
    useShallow((s) => ({ visibleNodeTypes: s.visibleNodeTypes, progressiveReveal: s.progressiveReveal }))
  );
  const toggleNodeTypeVisibility = useGraphStore(s => s.toggleNodeTypeVisibility);
  const resetFilters = useGraphStore(s => s.resetFilters);
  const clearHighlights = useGraphStore(s => s.clearHighlights);
  const showAllNodes = useGraphStore(s => s.showAllNodes);
  const resetToCore = useGraphStore(s => s.resetToCore);
  const { controlsVisible, toggleControls } = useUIStore();
  const isMobile = useIsMobile();
  const didCollapse = useRef(false);

  // Auto-collapse controls on mobile (once on mount)
  useEffect(() => {
    if (isMobile && !didCollapse.current && controlsVisible) {
      didCollapse.current = true;
      toggleControls();
    }
  }, [isMobile, controlsVisible, toggleControls]);

  const nodeTypes: NodeType[] = ['step', 'gate', 'agent', 'input'];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="fixed top-4 left-4 z-50"
    >
      {/* Toggle button */}
      <button
        onClick={toggleControls}
        className="p-2.5 rounded-xl glass-panel text-muted-foreground hover:text-foreground mb-2 transition-all"
      >
        <Filter className="w-4 h-4" />
      </button>

      {controlsVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="glass-panel rounded-xl p-4 w-64 shadow-2xl"
        >
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Node Filters
          </h3>

          <div className="space-y-2.5">
            {nodeTypes.map(type => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: NODE_STYLES[type]?.color }}
                  />
                  <span className="text-sm text-foreground">{NODE_TYPE_LABELS[type]}</span>
                </div>
                <Switch
                  checked={visibleNodeTypes.has(type)}
                  onCheckedChange={() => toggleNodeTypeVisibility(type)}
                  className="scale-75"
                />
              </div>
            ))}
          </div>

          <div className="border-t border-border mt-4 pt-4 space-y-2">
            {/* Progressive reveal toggle */}
            {progressiveReveal ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={showAllNodes}
                className="w-full justify-start text-muted-foreground hover:text-foreground text-xs"
              >
                <Eye className="w-3 h-3 mr-2" />
                Show All Nodes
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetToCore}
                className="w-full justify-start text-muted-foreground hover:text-foreground text-xs"
              >
                <Focus className="w-3 h-3 mr-2" />
                Focus View
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { resetFilters(); clearHighlights(); }}
              className="w-full justify-start text-muted-foreground hover:text-foreground text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-2" />
              Reset All Filters
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
