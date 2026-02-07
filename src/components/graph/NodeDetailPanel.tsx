'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGraphStore } from '@/lib/store/graph-store';
import { useUIStore } from '@/lib/store/ui-store';
import { NODE_STYLES } from '@/lib/graph/node-styles';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { GraphNode, StepMeta, GateMeta, AgentMeta, InputMeta } from '@/lib/graph/types';

export default function NodeDetailPanel() {
  const { selectedNode, graphData, selectNode } = useGraphStore();
  const { detailPanelOpen, setDetailPanelOpen } = useUIStore();

  const handleClose = () => {
    selectNode(null);
    setDetailPanelOpen(false);
  };

  // Find connected nodes
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

  return (
    <AnimatePresence>
      {detailPanelOpen && selectedNode && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onWheel={(e) => e.stopPropagation()}
          className="fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-96 z-50 glass-panel rounded-l-2xl overflow-y-auto"
        >
          <div className="p-6">
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
                        selectNode(conn.node);
                      }
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent/10 transition-colors text-left"
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
                  </button>
                ))}
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

function renderGateMeta(meta?: GateMeta) {
  if (!meta) return null;
  return (
    <>
      <MetaRow label="Gate Type" value={meta.gateType.replace(/-/g, ' ')} />
      <MetaRow label="Reviewer" value={meta.reviewer} />
      {meta.autoPassCriteria && <MetaRow label="Auto-pass" value={meta.autoPassCriteria} />}
      <div className="mt-3 p-3 rounded-lg bg-[#D4856A]/10 border border-[#D4856A]/20">
        <p className="text-xs text-[#D4856A] font-semibold mb-1">Escalation Trigger</p>
        <p className="text-sm text-foreground">{meta.escalationTrigger}</p>
      </div>
      {meta.decisions && meta.decisions.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-1">Possible Decisions:</p>
          <div className="flex flex-wrap gap-1">
            {meta.decisions.map(d => (
              <Badge key={d} variant="outline" className="text-xs border-[#D4856A]/30 text-[#D4856A]">
                {d}
              </Badge>
            ))}
          </div>
        </div>
      )}
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
