'use client';

import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { NODE_STYLES } from '@/lib/graph/node-styles';
import type { GraphNode, NodeType, StepMeta, GateMeta, AgentMeta, InputMeta } from '@/lib/graph/types';
import type { RoleDefinition, JourneyStage, NodeJourney } from '@/lib/roles/role-definitions';

// Stage config: label, color, and progression indicator
const JOURNEY_STAGES = {
  preAI:     { label: 'Before AI',       color: '#94a3b8', indicator: '\u25CB' },
  aiAgents:  { label: 'With AI Agents',  color: '#6BAED6', indicator: '\u25D0' },
  aiAgentic: { label: 'Agentic System',  color: '#4CAF50', indicator: '\u25CF' },
} as const;

type JourneyStageName = keyof typeof JOURNEY_STAGES;

interface RoleSlideProps {
  node: GraphNode;
  role: RoleDefinition;
  nodeJourney: NodeJourney | undefined;
  isLast: boolean;
}

export default function RoleSlide({ node, role, nodeJourney, isLast }: RoleSlideProps) {
  const style = NODE_STYLES[node.type as NodeType] || NODE_STYLES.step;

  // Classify node's relationship to the role
  const isPrimary = role.ownedSteps.includes(node.id) || role.reviewedGates.includes(node.id);
  const nodeRelation = isPrimary
    ? (role.ownedSteps.includes(node.id) ? 'You own this step' : 'You review this gate')
    : (role.relatedAgents.includes(node.id) ? 'AI agent supporting you'
       : role.relatedInputs.includes(node.id) ? 'Input you depend on'
       : 'How this step affects your work');

  return (
    <div className="max-w-3xl mx-auto w-full px-4">
      <div className="glass-panel rounded-2xl p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Node header */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
            style={{ backgroundColor: (style?.color || '#6b7280') + '20' }}
          >
            {style?.emoji}
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{node.label}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className="text-xs"
                style={{ borderColor: (style?.color || '#6b7280') + '60', color: style?.color }}
              >
                {node.type}
              </Badge>
            </div>
          </div>
        </div>

        {/* Relationship badge */}
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-[#5B9ECF]/5 border border-[#5B9ECF]/20">
          <p className="text-sm font-medium text-[#5B9ECF]">
            <Eye className="w-3.5 h-3.5 inline mr-1.5" />
            {nodeRelation}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">{node.description}</p>

        {/* Type-specific metadata */}
        <div className="space-y-3 mb-5">
          {node.type === 'step' && <StepDetail meta={node.meta as StepMeta} />}
          {node.type === 'gate' && <GateDetail meta={node.meta as GateMeta} />}
          {node.type === 'agent' && <AgentDetail meta={node.meta as AgentMeta} />}
          {node.type === 'input' && <InputDetail meta={node.meta as InputMeta} />}
        </div>

        {/* Journey stages — always expanded */}
        {nodeJourney && (
          <div className="mb-5 space-y-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-2">
              How involvement in this step evolves
            </p>
            <JourneyTile stageName="preAI" stage={nodeJourney.preAI} />
            <JourneyTile stageName="aiAgents" stage={nodeJourney.aiAgents} />
            <JourneyTile stageName="aiAgentic" stage={nodeJourney.aiAgentic} />
          </div>
        )}

        {/* Key insight — last step only */}
        {isLast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-xl bg-[#5B9ECF]/10 border border-[#5B9ECF]/40"
          >
            <h4 className="text-xs font-bold text-[#5B9ECF] mb-2">Key Insight</h4>
            <p className="text-sm text-foreground leading-relaxed">{role.narrative.keyInsight}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// --- Always-expanded journey tile (no collapsing) ---

function JourneyTile({ stageName, stage }: { stageName: JourneyStageName; stage: JourneyStage }) {
  const config = JOURNEY_STAGES[stageName];
  return (
    <div
      className="rounded-xl border"
      style={{ borderColor: config.color + '30', borderLeftWidth: 3, borderLeftColor: config.color }}
    >
      <div className="px-4 py-3">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-sm" style={{ color: config.color }}>{config.indicator}</span>
          <span className="text-xs font-semibold" style={{ color: config.color }}>{config.label}</span>
        </div>
        <p className="text-sm font-medium text-foreground/90 mb-1">{stage.summary}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{stage.detail}</p>
      </div>
    </div>
  );
}

// --- Metadata components (from RoleInsightPanel) ---

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
          <p className="text-xs text-emerald-400 font-semibold mb-1">Auto-pass Criteria</p>
          <p className="text-sm text-slate-200">{meta.autoPassCriteria}</p>
        </div>
      )}
    </>
  );
}

function AgentDetail({ meta }: { meta?: AgentMeta }) {
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
