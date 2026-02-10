'use client';

import { useState } from 'react';
import { useCampaignStore } from '@/lib/store/campaign-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { navigateToNode } from '@/lib/utils/camera-navigation';
import { NODE_STYLES } from '@/lib/graph/node-styles';
import { ROLE_MAP, NodeJourney } from '@/lib/roles/role-definitions';
import { STEP_NARRATIVES, ContentBlock } from '@/data/step-narratives';
import { Badge } from '@/components/ui/badge';
import { GraphNode, StepMeta, GateMeta, AgentMeta, InputMeta } from '@/lib/graph/types';
import {
  ArrowRight, BookOpen, Database, Wrench, ChevronDown, ChevronUp,
  Lightbulb, AlertTriangle, ArrowRightLeft, BarChart3, GitFork,
  Zap, MessageSquareQuote, Eye,
} from 'lucide-react';

export default function CampaignNodeCard() {
  const currentNodeId = useCampaignStore(s => s.currentNodeId);
  const advanceToNext = useCampaignStore(s => s.advanceToNext);
  const makeGateDecision = useCampaignStore(s => s.makeGateDecision);
  const graphData = useGraphStore(s => s.graphData);
  const selectNode = useGraphStore(s => s.selectNode);
  const [showDetails, setShowDetails] = useState(false);

  const currentNode = graphData.nodes.find(n => n.id === currentNodeId);
  if (!currentNode) return null;

  const style = NODE_STYLES[currentNode.type];
  const narrative = STEP_NARRATIVES[currentNode.id];
  const role = narrative ? ROLE_MAP.get(narrative.roleId) : undefined;
  const journey = role?.narrative.nodeJourneys[currentNode.id];

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

  // Nodes without narratives render the original layout unchanged
  if (!narrative) {
    return (
      <FallbackCard
        currentNode={currentNode}
        style={style}
        connectedAgents={connectedAgents}
        connectedInputs={connectedInputs}
        onAdvance={handleAdvance}
        onDecision={handleDecision}
      />
    );
  }

  return (
    <div>
      {/* ── Tier 1: Narrative content ─────────────────── */}

      {/* Node header with narrative headline */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
          style={{ backgroundColor: style?.color + '20' }}
        >
          {style?.emoji}
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-foreground leading-tight">{narrative.headline}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="outline" className="text-xs" style={{ borderColor: style?.color + '60', color: style?.color }}>
              {currentNode.type}
            </Badge>
            <span className="text-xs text-muted-foreground truncate">{currentNode.label}</span>
          </div>
        </div>
      </div>

      {/* Step owner — prominent badge */}
      {currentNode.type === 'step' && (currentNode.meta as StepMeta)?.owner && (
        <div className="mb-3">
          <OwnerBadge
            owner={(currentNode.meta as StepMeta).owner}
            agentName={(currentNode.meta as StepMeta).agentName}
          />
        </div>
      )}

      {/* Lede — replaces the dry description */}
      <p className="text-sm text-foreground/80 mb-4 leading-relaxed">{narrative.lede}</p>

      {/* Content blocks — each type gets distinct visual styling */}
      <div className="space-y-3 mb-4">
        {narrative.blocks.map((block, i) => (
          <NarrativeBlock key={i} block={block} />
        ))}
      </div>

      {/* ── Journey breakdown — before/during/after AI ── */}
      {journey && <JourneyBreakdown journey={journey} />}

      {/* ── Tier 2: Collapsible context ────────────────── */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg
                   bg-white/5 hover:bg-white/8 border border-white/10
                   text-xs text-muted-foreground transition-colors duration-150 mb-3"
      >
        <span>More context</span>
        {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {showDetails && (
        <div className="space-y-3 mb-4 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Role perspective */}
          {role && (
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs font-semibold text-muted-foreground mb-1.5">
                {role.title} perspective
              </p>
              <p className="text-sm text-foreground/70 italic leading-relaxed">
                {role.narrative.keyInsight}
              </p>
            </div>
          )}

          {/* Connected agents */}
          {connectedAgents.length > 0 && (
            <div className="p-3 rounded-lg bg-[#9B7ACC]/10 border border-[#9B7ACC]/20">
              <p className="text-xs font-semibold text-[#9B7ACC] mb-1">
                {'\uD83E\uDD16'} AI Agent performing this step
              </p>
              {connectedAgents.map(a => (
                <p key={a.id} className="text-sm text-foreground">{a.label}</p>
              ))}
            </div>
          )}

          {/* Reference documents / inputs */}
          {connectedInputs.length > 0 && (
            <InputContextGroups inputs={connectedInputs} />
          )}

          {/* Metadata */}
          <p className="text-xs text-muted-foreground italic mb-1">{currentNode.description}</p>
          {currentNode.type === 'step' && <StepDetail meta={currentNode.meta as StepMeta} />}
          {currentNode.type === 'gate' && <GateDetail meta={currentNode.meta as GateMeta} />}
          {currentNode.type === 'agent' && <AgentDetail meta={currentNode.meta as AgentMeta} />}
          {currentNode.type === 'input' && <InputDetail meta={currentNode.meta as InputMeta} />}
        </div>
      )}

      {/* ── Action buttons ────────────────────────────── */}
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

/* ── Owner badge — prominent step ownership indicator ──── */

const OWNER_CONFIG: Record<string, { label: string; icon: string; bg: string; border: string; text: string }> = {
  agent:  { label: 'AI Agent',    icon: '\uD83E\uDD16', bg: 'bg-[#9B7ACC]/15', border: 'border-[#9B7ACC]/30', text: 'text-[#9B7ACC]' },
  human:  { label: 'Human',       icon: '\uD83D\uDC64', bg: 'bg-[#5B9ECF]/15', border: 'border-[#5B9ECF]/30', text: 'text-[#5B9ECF]' },
  shared: { label: 'Human + AI',  icon: '\uD83E\uDD1D', bg: 'bg-[#C9A04E]/15', border: 'border-[#C9A04E]/30', text: 'text-[#C9A04E]' },
};

function OwnerBadge({ owner, agentName }: { owner: string; agentName?: string }) {
  const c = OWNER_CONFIG[owner] || OWNER_CONFIG.shared;
  const label = owner === 'agent' && agentName ? agentName : c.label;
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${c.bg} border ${c.border}`}>
      <span className="text-sm">{c.icon}</span>
      <span className={`text-xs font-semibold ${c.text}`}>{label}</span>
    </div>
  );
}

/* ── Journey breakdown — 3-stage AI evolution ──────────── */

const JOURNEY_STAGES = [
  { key: 'preAI' as const, label: 'Before AI', icon: '\uD83D\uDCCB', bg: 'bg-orange-500/8', border: 'border-orange-500/20', accent: 'text-orange-400' },
  { key: 'aiAgents' as const, label: 'AI Agents', icon: '\uD83E\uDD16', bg: 'bg-violet-500/8', border: 'border-violet-500/20', accent: 'text-violet-400' },
  { key: 'aiAgentic' as const, label: 'Agentic AI', icon: '\u26A1', bg: 'bg-emerald-500/8', border: 'border-emerald-500/20', accent: 'text-emerald-400' },
];

function JourneyBreakdown({ journey }: { journey: NodeJourney }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-muted-foreground mb-2">How involvement in this step evolves</p>
      <div className="space-y-2">
        {JOURNEY_STAGES.map(({ key, label, icon, bg, border, accent }) => (
          <div key={key} className={`p-2.5 rounded-lg ${bg} border ${border}`}>
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${accent} mb-1`}>
              <span>{icon}</span>
              {label}
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed">{journey[key].summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Block type visual styles ─────────────────────────── */

const BLOCK_CONFIG: Record<string, {
  Icon: typeof Lightbulb;
  label: string;
  bg: string;
  border: string;
  accent: string;
}> = {
  narrative:      { Icon: BookOpen,          label: '',                     bg: 'bg-transparent',      border: 'border-transparent', accent: 'text-foreground/70' },
  scenario:       { Icon: Eye,               label: 'Scenario',             bg: 'bg-indigo-500/8',     border: 'border-indigo-500/20', accent: 'text-indigo-400' },
  tension:        { Icon: AlertTriangle,     label: 'Why This Matters',     bg: 'bg-amber-500/8',      border: 'border-amber-500/20',  accent: 'text-amber-400' },
  'ai-handoff':   { Icon: ArrowRightLeft,    label: 'AI + Human Handoff',   bg: 'bg-violet-500/8',     border: 'border-violet-500/20', accent: 'text-violet-400' },
  metric:         { Icon: BarChart3,          label: 'Key Metric',           bg: 'bg-emerald-500/8',    border: 'border-emerald-500/20', accent: 'text-emerald-400' },
  'before-after': { Icon: ArrowRightLeft,    label: 'Before & After',       bg: 'bg-sky-500/8',        border: 'border-sky-500/20',    accent: 'text-sky-400' },
  'decision-tree':{ Icon: GitFork,           label: 'Decision Paths',       bg: 'bg-orange-500/8',     border: 'border-orange-500/20', accent: 'text-orange-400' },
  'domino-effect':{ Icon: Zap,               label: 'Downstream Impact',    bg: 'bg-red-500/8',        border: 'border-red-500/20',    accent: 'text-red-400' },
  tip:            { Icon: Lightbulb,          label: 'Tip',                  bg: 'bg-cyan-500/8',       border: 'border-cyan-500/20',   accent: 'text-cyan-400' },
  quote:          { Icon: MessageSquareQuote, label: '',                     bg: 'bg-white/5',          border: 'border-white/10',      accent: 'text-foreground/60' },
};

function NarrativeBlock({ block }: { block: ContentBlock }) {
  const config = BLOCK_CONFIG[block.type] || BLOCK_CONFIG.narrative;
  const { Icon } = config;

  // Narrative blocks render as plain prose
  if (block.type === 'narrative') {
    return (
      <p className="text-sm text-foreground/70 leading-relaxed">{block.content}</p>
    );
  }

  // Quote blocks render as styled blockquote
  if (block.type === 'quote') {
    return (
      <div className={`p-3 rounded-lg ${config.bg} border ${config.border} border-l-2 border-l-white/20`}>
        <p className="text-sm text-foreground/60 italic leading-relaxed">{block.content}</p>
      </div>
    );
  }

  // Before-after and decision-tree blocks have two sections
  if ((block.type === 'before-after' || block.type === 'decision-tree') && block.alt) {
    return (
      <div className={`p-3 rounded-lg ${config.bg} border ${config.border}`}>
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${config.accent} mb-2`}>
          <Icon className="w-3.5 h-3.5" />
          {config.label}
        </div>
        <p className="text-sm text-foreground/70 leading-relaxed mb-2">{block.content}</p>
        <div className="border-t border-white/10 pt-2">
          <p className="text-sm text-foreground/70 leading-relaxed">{block.alt}</p>
        </div>
      </div>
    );
  }

  // All other block types: labeled card with icon
  return (
    <div className={`p-3 rounded-lg ${config.bg} border ${config.border}`}>
      {config.label && (
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${config.accent} mb-1.5`}>
          <Icon className="w-3.5 h-3.5" />
          {config.label}
        </div>
      )}
      <p className="text-sm text-foreground/70 leading-relaxed">{block.content}</p>
    </div>
  );
}

/* ── Fallback: original layout for nodes without narratives ── */

function FallbackCard({
  currentNode, style, connectedAgents, connectedInputs, onAdvance, onDecision,
}: {
  currentNode: GraphNode;
  style: { color: string; emoji: string } | undefined;
  connectedAgents: GraphNode[];
  connectedInputs: GraphNode[];
  onAdvance: () => void;
  onDecision: (d: string) => void;
}) {
  return (
    <div>
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

      {/* Step owner — prominent badge */}
      {currentNode.type === 'step' && (currentNode.meta as StepMeta)?.owner && (
        <div className="mb-3">
          <OwnerBadge
            owner={(currentNode.meta as StepMeta).owner}
            agentName={(currentNode.meta as StepMeta).agentName}
          />
        </div>
      )}

      <p className="text-sm text-muted-foreground mb-4">{currentNode.description}</p>

      <div className="space-y-3 mb-4">
        {currentNode.type === 'step' && <StepDetail meta={currentNode.meta as StepMeta} />}
        {currentNode.type === 'gate' && <GateDetail meta={currentNode.meta as GateMeta} />}
        {currentNode.type === 'agent' && <AgentDetail meta={currentNode.meta as AgentMeta} />}
        {currentNode.type === 'input' && <InputDetail meta={currentNode.meta as InputMeta} />}
      </div>

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
        <InputContextGroups inputs={connectedInputs} />
      )}

      {currentNode.type === 'step' && (
        <button
          onClick={onAdvance}
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
              onClick={() => onDecision(decision)}
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

/* ── Shared sub-components (unchanged from original) ────── */

const INPUT_TYPE_CONFIG: Record<string, { label: string; Icon: typeof BookOpen; color: string; bg: string; border: string }> = {
  reference: { label: 'Reference Documents', Icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  data:      { label: 'Data Feeds',          Icon: Database, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  tool:      { label: 'Tools & Platforms',    Icon: Wrench,   color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
};

function InputContextGroups({ inputs }: { inputs: GraphNode[] }) {
  const groups: Record<string, GraphNode[]> = {};
  for (const inp of inputs) {
    const meta = inp.meta as InputMeta | undefined;
    const type = meta?.inputType || 'reference';
    if (!groups[type]) groups[type] = [];
    groups[type].push(inp);
  }

  return (
    <div className="mb-4 space-y-2">
      {(['reference', 'data', 'tool'] as const).map(type => {
        const items = groups[type];
        if (!items || items.length === 0) return null;
        const config = INPUT_TYPE_CONFIG[type];
        const { Icon } = config;
        return (
          <div key={type} className={`p-3 rounded-lg ${config.bg} border ${config.border}`}>
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${config.color} mb-2`}>
              <Icon className="w-3.5 h-3.5" />
              {config.label}
            </div>
            <div className="space-y-1.5">
              {items.map(inp => {
                const meta = inp.meta as InputMeta | undefined;
                return (
                  <div key={inp.id}>
                    <p className="text-sm text-foreground">{inp.label}</p>
                    {meta?.source && (
                      <p className="text-xs text-muted-foreground">{meta.source}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
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
