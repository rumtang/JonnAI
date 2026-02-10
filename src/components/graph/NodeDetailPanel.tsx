'use client';

import { useShallow } from 'zustand/react/shallow';
import { motion, AnimatePresence } from 'framer-motion';
import { useGraphStore } from '@/lib/store/graph-store';
import { useUIStore } from '@/lib/store/ui-store';
import { useIsMobile } from '@/lib/hooks/use-is-mobile';
import { navigateToNode } from '@/lib/utils/camera-navigation';
import { NODE_STYLES } from '@/lib/graph/node-styles';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight } from 'lucide-react';
import { GraphNode, StepMeta, GateMeta, AgentMeta, InputMeta } from '@/lib/graph/types';
import NavigationBreadcrumb from './NavigationBreadcrumb';

export default function NodeDetailPanel() {
  const {
    selectedNode,
    graphData,
    fullGraphData,
    revealedNodeIds,
    progressiveReveal,
  } = useGraphStore(
    useShallow((s) => ({
      selectedNode: s.selectedNode,
      graphData: s.graphData,
      fullGraphData: s.fullGraphData,
      revealedNodeIds: s.revealedNodeIds,
      progressiveReveal: s.progressiveReveal,
    }))
  );
  const selectNode = useGraphStore(s => s.selectNode);
  const pushNavigation = useGraphStore(s => s.pushNavigation);
  const flashLink = useGraphStore(s => s.flashLink);
  const expandNode = useGraphStore(s => s.expandNode);

  const { detailPanelOpen } = useUIStore(useShallow((s) => ({ detailPanelOpen: s.detailPanelOpen })));
  const setDetailPanelOpen = useUIStore(s => s.setDetailPanelOpen);
  const isMobile = useIsMobile();

  const handleClose = () => {
    selectNode(null);
    setDetailPanelOpen(false);
    useGraphStore.getState().clearNavigation();
  };

  // Navigate to a connected node — camera + panel + breadcrumb
  const handleConnectionClick = (targetNode: GraphNode) => {
    if (!selectedNode) return;

    // Push current node to breadcrumb trail (if not already there)
    pushNavigation(selectedNode);

    // Flash the link between current and target
    flashLink(selectedNode.id, targetNode.id);

    // Push target node to trail
    pushNavigation(targetNode);

    // Update selection (triggers highlight recalc in store)
    selectNode(targetNode);

    // Animate camera to target node
    navigateToNode(targetNode, { distance: 120, duration: 1000 });
  };

  // Find connected nodes (from the currently visible graph data)
  const connectedNodes = selectedNode ? graphData.links
    .filter(l => {
      const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
      const tId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
      return sId === selectedNode.id || tId === selectedNode.id;
    })
    .map(l => {
      const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
      const tId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
      const otherId = sId === selectedNode.id ? tId : sId;
      const otherNode = graphData.nodes.find(n => n.id === otherId);
      return { node: otherNode, linkType: l.type, direction: sId === selectedNode.id ? 'outgoing' : 'incoming' };
    })
    .filter(c => c.node) : [];

  // Count hidden connections (only relevant in progressive reveal mode)
  const hiddenCount = (progressiveReveal && selectedNode && fullGraphData) ? (() => {
    let count = 0;
    for (const link of fullGraphData.links) {
      const sId = typeof link.source === 'object' ? (link.source as GraphNode).id : link.source;
      const tId = typeof link.target === 'object' ? (link.target as GraphNode).id : link.target;
      if (sId === selectedNode.id || tId === selectedNode.id) {
        const otherId = sId === selectedNode.id ? tId : sId;
        if (!revealedNodeIds.has(otherId)) count++;
      }
    }
    return count;
  })() : 0;

  return (
    <AnimatePresence>
      {detailPanelOpen && selectedNode && (
        <motion.div
          initial={isMobile ? { y: '100%', opacity: 0 } : { x: 400, opacity: 0 }}
          animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
          exit={isMobile ? { y: '100%', opacity: 0 } : { x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className={
            isMobile
              ? 'fixed bottom-0 left-0 right-0 h-[50vh] z-50 glass-panel rounded-t-2xl overflow-y-auto'
              : 'fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-96 z-50 glass-panel rounded-l-2xl overflow-y-auto'
          }
        >
          {/* Drag handle on mobile */}
          {isMobile && (
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
          )}
          <div className={isMobile ? 'p-4' : 'p-6'}>
            {/* Breadcrumb navigation */}
            <NavigationBreadcrumb />

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  style={{ backgroundColor: NODE_STYLES[selectedNode.type]?.color + '20' }}
                >
                  {NODE_STYLES[selectedNode.type]?.emoji}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{selectedNode.label}</h2>
                  <Badge variant="outline" className="text-xs mt-1" style={{ borderColor: NODE_STYLES[selectedNode.type]?.color + '60', color: NODE_STYLES[selectedNode.type]?.color }}>
                    {selectedNode.type}
                  </Badge>
                </div>
              </div>
              <button onClick={handleClose} className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-6">{selectedNode.description}</p>

            {/* Type-specific metadata */}
            <div className="space-y-4 mb-6">
              {selectedNode.type === 'step' && renderStepMeta(selectedNode.meta as StepMeta)}
              {selectedNode.type === 'gate' && renderGateMeta(selectedNode.meta as GateMeta)}
              {selectedNode.type === 'agent' && renderAgentMeta(selectedNode.meta as AgentMeta)}
              {selectedNode.type === 'input' && renderInputMeta(selectedNode.meta as InputMeta)}
            </div>

            {/* Connections */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Connections ({connectedNodes.length})
              </h3>
              <div className="space-y-2">
                {connectedNodes.map((conn, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (conn.node) {
                        handleConnectionClick(conn.node);
                      }
                    }}
                    className="group w-full flex items-center gap-3 p-2 rounded-lg
                               hover:bg-accent/20 transition-all duration-200 text-left
                               border border-transparent hover:border-white/10"
                  >
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-xs"
                      style={{ backgroundColor: NODE_STYLES[conn.node!.type]?.color + '20' }}
                    >
                      {NODE_STYLES[conn.node!.type]?.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{conn.node!.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {conn.direction === 'outgoing' ? '\u2192' : '\u2190'} {conn.linkType.replace(/-/g, ' ')}
                      </p>
                    </div>
                    {/* Arrow icon appears on hover */}
                    <ArrowRight className="w-4 h-4 text-muted-foreground/0 group-hover:text-muted-foreground
                                           transition-all duration-200 shrink-0" />
                  </button>
                ))}

                {/* Hidden connections badge — progressive reveal */}
                {hiddenCount > 0 && selectedNode && (
                  <button
                    onClick={() => expandNode(selectedNode.id)}
                    className="w-full mt-2 p-2 rounded-lg border border-dashed border-white/15
                               hover:border-white/30 hover:bg-accent/10 transition-all text-center"
                  >
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">+{hiddenCount} hidden connection{hiddenCount > 1 ? 's' : ''}</span>
                      {' '}&mdash; click to reveal
                    </p>
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MetaRow({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs text-foreground">{value}</span>
    </div>
  );
}

function renderStepMeta(meta?: StepMeta) {
  if (!meta) return null;

  const ownerColors: Record<string, string> = {
    agent: 'text-[#9B7ACC] border-[#9B7ACC]/30',
    human: 'text-[#5B9ECF] border-[#5B9ECF]/30',
    shared: 'text-[#C9A04E] border-[#C9A04E]/30',
  };

  return (
    <>
      <MetaRow label="Phase" value={meta.phase} />
      <div className="flex items-center justify-between py-1.5 border-b border-border">
        <span className="text-xs text-muted-foreground">Owner</span>
        <Badge variant="outline" className={`text-xs ${ownerColors[meta.owner] || ''}`}>
          {meta.owner === 'agent' ? `AI: ${meta.agentName || 'Agent'}` : meta.owner === 'human' ? 'Human' : 'Shared'}
        </Badge>
      </div>
      <MetaRow label="Est. Time" value={meta.estimatedTime} />
      {meta.inputs && meta.inputs.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-1">Inputs:</p>
          <div className="flex flex-wrap gap-1">
            {meta.inputs.map(inp => (
              <Badge key={inp} variant="outline" className="text-xs border-[#5B9ECF]/30 text-[#5B9ECF]">
                {inp}
              </Badge>
            ))}
          </div>
        </div>
      )}
      {meta.outputs && meta.outputs.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-1">Outputs:</p>
          <div className="flex flex-wrap gap-1">
            {meta.outputs.map(out => (
              <Badge key={out} variant="outline" className="text-xs border-[#6B9E6B]/30 text-[#6B9E6B]">
                {out}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function getDecisionIcon(decision: string): string {
  const d = decision.toLowerCase();
  if (d === 'approve' || d === 'pass' || d === 'archive') return '\u2705';
  if (d === 'revise') return '\u21A9\uFE0F';
  if (d.startsWith('escalate')) return '\uD83D\uDEA8';
  if (d === 'hold') return '\u23F8\uFE0F';
  if (d === 'optimize' || d === 'iterate') return '\uD83D\uDD04';
  return '\u26AA';
}

function getDecisionStyle(decision: string): string {
  const d = decision.toLowerCase();
  if (d === 'approve' || d === 'pass' || d === 'archive') return 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400';
  if (d === 'revise') return 'border-amber-500/30 bg-amber-500/5 text-amber-400';
  if (d.startsWith('escalate')) return 'border-red-500/30 bg-red-500/5 text-red-400';
  if (d === 'hold') return 'border-slate-400/30 bg-slate-400/5 text-slate-400';
  if (d === 'optimize' || d === 'iterate') return 'border-sky-500/30 bg-sky-500/5 text-sky-400';
  return 'border-white/10 bg-white/5 text-slate-300';
}

function renderGateMeta(meta?: GateMeta) {
  if (!meta) return null;
  return (
    <>
      {/* Reviewer — prominent at top */}
      <div className="p-3 rounded-lg bg-white/5 border border-white/10 mb-3">
        <p className="text-xs text-muted-foreground mb-1">Reviewed by</p>
        <p className="text-sm font-semibold text-foreground">{meta.reviewer}</p>
      </div>

      <MetaRow label="Gate Type" value={meta.gateType.replace(/-/g, ' ')} />

      {/* Auto-pass criteria */}
      {meta.autoPassCriteria && (
        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 mt-3">
          <p className="text-xs text-emerald-400 font-semibold mb-1">{'\u2705'} Auto-pass Criteria</p>
          <p className="text-sm text-slate-200">{meta.autoPassCriteria}</p>
        </div>
      )}

      {/* Decision paths */}
      {meta.decisions && meta.decisions.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Decision Paths</p>
          <div className="space-y-1.5">
            {meta.decisions.map(d => (
              <div
                key={d}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border ${getDecisionStyle(d)}`}
              >
                <span className="text-base leading-none">{getDecisionIcon(d)}</span>
                <span className="text-sm font-medium">{d}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Escalation trigger — warning box */}
      <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
        <p className="text-xs text-red-400 font-semibold mb-1">{'\uD83D\uDEA8'} Escalation Trigger</p>
        <p className="text-sm text-slate-200">{meta.escalationTrigger}</p>
      </div>
    </>
  );
}

function renderAgentMeta(meta?: AgentMeta) {
  if (!meta) return null;
  return (
    <>
      <MetaRow label="Capability" value={meta.capability} />
      <MetaRow label="Autonomy" value={meta.autonomy} />
      {meta.tools && meta.tools.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-1">Tools:</p>
          <div className="flex flex-wrap gap-1">
            {meta.tools.map(tool => (
              <Badge key={tool} variant="outline" className="text-xs border-[#9B7ACC]/30 text-[#9B7ACC]">
                {tool}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function renderInputMeta(meta?: InputMeta) {
  if (!meta) return null;
  return (
    <>
      <MetaRow label="Type" value={meta.inputType} />
      <MetaRow label="Source" value={meta.source} />
      <MetaRow label="Refresh Rate" value={meta.refreshRate} />
    </>
  );
}
