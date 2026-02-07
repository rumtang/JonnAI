'use client';

import { useCampaignStore } from '@/lib/store/campaign-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { navigateToNode } from '@/lib/utils/camera-navigation';
import { NODE_STYLES } from '@/lib/graph/node-styles';
import { Badge } from '@/components/ui/badge';
import { GraphNode, StepMeta, GateMeta, AgentMeta, InputMeta } from '@/lib/graph/types';
import { ArrowRight } from 'lucide-react';

export default function CampaignNodeCard() {
  const { currentNodeId, advanceToNext, makeGateDecision } = useCampaignStore();
  const { graphData, selectNode } = useGraphStore();

  const currentNode = graphData.nodes.find(n => n.id === currentNodeId);
  if (!currentNode) return null;

  const style = NODE_STYLES[currentNode.type];

  // Find connected agents and inputs for step nodes
  const connectedAgents = currentNode.type === 'step'
    ? graphData.links
        .filter(l => {
          const tId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
          return tId === currentNode.id && l.type === 'performs';
        })
        .map(l => {
          const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
          return graphData.nodes.find(n => n.id === sId);
        })
        .filter(Boolean) as GraphNode[]
    : [];

  const connectedInputs = currentNode.type === 'step'
    ? graphData.links
        .filter(l => {
          const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
          return sId === currentNode.id && l.type === 'uses';
        })
        .map(l => {
          const tId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
          return graphData.nodes.find(n => n.id === tId);
        })
        .filter(Boolean) as GraphNode[]
    : [];

  const handleAdvance = () => {
    const nextNode = advanceToNext(graphData);
    if (nextNode) {
      selectNode(nextNode);
      navigateToNode(nextNode, { distance: 120, duration: 800 });
    }
  };

  const handleDecision = (decision: string) => {
    const nextNode = makeGateDecision(decision, graphData);
    if (nextNode) {
      selectNode(nextNode);
      navigateToNode(nextNode, { distance: 120, duration: 800 });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Node header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
          style={{ backgroundColor: style?.color + '20' }}
        >
          {style?.emoji}
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">{currentNode.label}</h3>
          <Badge variant="outline" className="text-xs mt-0.5" style={{ borderColor: style?.color + '60', color: style?.color }}>
            {currentNode.type}
          </Badge>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4">{currentNode.description}</p>

      {/* Type-specific metadata */}
      <div className="space-y-3 mb-4">
        {currentNode.type === 'step' && <StepDetail meta={currentNode.meta as StepMeta} />}
        {currentNode.type === 'gate' && <GateDetail meta={currentNode.meta as GateMeta} />}
        {currentNode.type === 'agent' && <AgentDetail meta={currentNode.meta as AgentMeta} />}
        {currentNode.type === 'input' && <InputDetail meta={currentNode.meta as InputMeta} />}
      </div>

      {/* Connected agents and inputs (for step nodes) */}
      {connectedAgents.length > 0 && (
        <div className="mb-3 p-3 rounded-lg bg-[#9B7ACC]/10 border border-[#9B7ACC]/20">
          <p className="text-xs font-semibold text-[#9B7ACC] mb-1">
            {'\uD83E\uDD16'} AI Agent performing this step
          </p>
          {connectedAgents.map(a => (
            <p key={a.id} className="text-sm text-foreground">{a.label}</p>
          ))}
        </div>
      )}

      {connectedInputs.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-[#C9A04E]/10 border border-[#C9A04E]/20">
          <p className="text-xs font-semibold text-[#C9A04E] mb-1">
            {'\uD83D\uDCC4'} Using
          </p>
          <div className="flex flex-wrap gap-1">
            {connectedInputs.map(inp => (
              <Badge key={inp.id} variant="outline" className="text-xs border-[#C9A04E]/30 text-[#C9A04E]">
                {inp.label}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      {currentNode.type === 'step' && (
        <button
          onClick={handleAdvance}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                     bg-[#4CAF50]/20 hover:bg-[#4CAF50]/30 border border-[#4CAF50]/30
                     text-[#4CAF50] font-semibold text-sm transition-all duration-200"
        >
          Advance
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {currentNode.type === 'gate' && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Make a decision:</p>
          {((currentNode.meta as GateMeta)?.decisions || []).map(decision => (
            <button
              key={decision}
              onClick={() => handleDecision(decision)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border
                         font-medium text-sm transition-all duration-200 ${getDecisionButtonStyle(decision)}`}
            >
              <span className="text-base">{getDecisionButtonIcon(decision)}</span>
              {decision}
            </button>
          ))}
        </div>
      )}
    </div>
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

function StepDetail({ meta }: { meta?: StepMeta }) {
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
              <Badge key={inp} variant="outline" className="text-xs border-[#5B9ECF]/30 text-[#5B9ECF]">{inp}</Badge>
            ))}
          </div>
        </div>
      )}
      {meta.outputs && meta.outputs.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-1">Outputs:</p>
          <div className="flex flex-wrap gap-1">
            {meta.outputs.map(out => (
              <Badge key={out} variant="outline" className="text-xs border-[#6B9E6B]/30 text-[#6B9E6B]">{out}</Badge>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function GateDetail({ meta }: { meta?: GateMeta }) {
  if (!meta) return null;
  return (
    <>
      <div className="p-3 rounded-lg bg-white/5 border border-white/10 mb-2">
        <p className="text-xs text-muted-foreground mb-1">Reviewed by</p>
        <p className="text-sm font-semibold text-foreground">{meta.reviewer}</p>
      </div>
      <MetaRow label="Gate Type" value={meta.gateType.replace(/-/g, ' ')} />
      {meta.autoPassCriteria && (
        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 mt-2">
          <p className="text-xs text-emerald-400 font-semibold mb-1">{'\u2705'} Auto-pass Criteria</p>
          <p className="text-sm text-slate-200">{meta.autoPassCriteria}</p>
        </div>
      )}
      <div className="mt-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
        <p className="text-xs text-red-400 font-semibold mb-1">{'\uD83D\uDEA8'} Escalation Trigger</p>
        <p className="text-sm text-slate-200">{meta.escalationTrigger}</p>
      </div>
    </>
  );
}

function AgentDetail({ meta }: { meta?: AgentMeta }) {
  if (!meta) return null;
  return (
    <>
      <MetaRow label="Capability" value={meta.capability} />
      <MetaRow label="Autonomy" value={meta.autonomy} />
    </>
  );
}

function InputDetail({ meta }: { meta?: InputMeta }) {
  if (!meta) return null;
  return (
    <>
      <MetaRow label="Type" value={meta.inputType} />
      <MetaRow label="Source" value={meta.source} />
      <MetaRow label="Refresh Rate" value={meta.refreshRate} />
    </>
  );
}

function getDecisionButtonStyle(decision: string): string {
  const d = decision.toLowerCase();
  if (d === 'approve' || d === 'pass')
    return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20';
  if (d === 'revise' || d === 'flag' || d === 'iterate')
    return 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20';
  if (d.startsWith('escalate'))
    return 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20';
  if (d === 'optimize')
    return 'bg-sky-500/10 border-sky-500/30 text-sky-400 hover:bg-sky-500/20';
  if (d === 'archive')
    return 'bg-slate-400/10 border-slate-400/30 text-slate-400 hover:bg-slate-400/20';
  if (d === 'hold')
    return 'bg-slate-400/10 border-slate-400/30 text-slate-400 hover:bg-slate-400/20';
  return 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10';
}

function getDecisionButtonIcon(decision: string): string {
  const d = decision.toLowerCase();
  if (d === 'approve' || d === 'pass') return '\u2705';
  if (d === 'revise' || d === 'flag') return '\u21A9\uFE0F';
  if (d.startsWith('escalate')) return '\uD83D\uDEA8';
  if (d === 'optimize' || d === 'iterate') return '\uD83D\uDD04';
  if (d === 'archive') return '\uD83D\uDCE6';
  if (d === 'hold') return '\u23F8\uFE0F';
  return '\u26AA';
}
