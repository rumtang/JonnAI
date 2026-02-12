'use client';

import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { motion } from 'framer-motion';
import { useGraphStore } from '@/lib/store/graph-store';
import { useUIStore } from '@/lib/store/ui-store';
import { useIsMobile } from '@/lib/hooks/use-is-mobile';
import { NODE_STYLES } from '@/lib/graph/node-styles';
import { NodeType, StepMeta } from '@/lib/graph/types';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Filter, RotateCcw } from 'lucide-react';

// ─── Business-logic filter presets ─────────────────────────
type FilterPreset = 'all' | 'human-checkpoints' | 'ai-owned' | 'knowledge-deps' | 'bottlenecks';

const PRESET_LABELS: Record<FilterPreset, string> = {
  'all':               'All',
  'human-checkpoints': 'Human Checkpoints',
  'ai-owned':          'AI-Owned Steps',
  'knowledge-deps':    'Knowledge Deps',
  'bottlenecks':       'Bottlenecks',
};

const NODE_TYPE_LABELS: Record<NodeType, string> = {
  step:  'Steps',
  gate:  'Gates',
  agent: 'AI Agents',
  input: 'Inputs',
};

export default function GraphControls() {
  const { visibleNodeTypes, graphData } = useGraphStore(
    useShallow((s) => ({ visibleNodeTypes: s.visibleNodeTypes, graphData: s.graphData }))
  );
  const toggleNodeTypeVisibility = useGraphStore(s => s.toggleNodeTypeVisibility);
  const resetFilters = useGraphStore(s => s.resetFilters);
  const clearHighlights = useGraphStore(s => s.clearHighlights);

  // Apply a business-logic filter preset
  const applyPreset = (preset: FilterPreset) => {
    if (preset === 'all') {
      resetFilters();
      clearHighlights();
      return;
    }

    const nodes = graphData.nodes;
    let nodeTypes: Set<NodeType>;
    let highlighted: Set<string>;

    switch (preset) {
      case 'human-checkpoints':
        nodeTypes = new Set<NodeType>(['gate', 'step']);
        highlighted = new Set(
          nodes.filter(n =>
            n.type === 'gate' ||
            (n.type === 'step' && (n.meta as StepMeta)?.owner === 'human')
          ).map(n => n.id)
        );
        break;
      case 'ai-owned':
        nodeTypes = new Set<NodeType>(['step', 'agent']);
        highlighted = new Set(
          nodes.filter(n =>
            n.type === 'agent' ||
            (n.type === 'step' && (n.meta as StepMeta)?.owner === 'agent')
          ).map(n => n.id)
        );
        break;
      case 'knowledge-deps':
        nodeTypes = new Set<NodeType>(['input', 'step']);
        highlighted = new Set(
          nodes.filter(n => n.type === 'input').map(n => n.id)
        );
        break;
      case 'bottlenecks': {
        nodeTypes = new Set<NodeType>(['gate', 'step']);
        highlighted = new Set(
          nodes.filter(n => {
            if (n.type === 'gate') return true;
            if (n.type === 'step') {
              const est = (n.meta as StepMeta)?.estimatedTime || '';
              const match = est.match(/(\d+)\s*min/i);
              return match && parseInt(match[1], 10) > 30;
            }
            return false;
          }).map(n => n.id)
        );
        break;
      }
      default:
        return;
    }

    useGraphStore.setState({
      visibleNodeTypes: nodeTypes,
      highlightedNodeIds: highlighted,
    });
  };
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
          {/* Business-logic filter presets */}
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Quick Views
          </h3>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(Object.keys(PRESET_LABELS) as FilterPreset[]).map(preset => (
              <button
                key={preset}
                onClick={() => applyPreset(preset)}
                className="px-2 py-1 rounded-md text-[10px] font-medium bg-white/5 border border-white/10
                           text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
              >
                {PRESET_LABELS[preset]}
              </button>
            ))}
          </div>

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

          <div className="border-t border-border mt-4 pt-4">
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
