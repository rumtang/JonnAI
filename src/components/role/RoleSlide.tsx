'use client';

import { motion } from 'framer-motion';
import { Eye, Lightbulb, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { NODE_STYLES } from '@/lib/graph/node-styles';
import { computeRoleStats } from '@/lib/roles/role-definitions';
import type { GraphData, GraphNode, NodeType } from '@/lib/graph/types';
import type { RoleDefinition, JourneyStage } from '@/lib/roles/role-definitions';

// Stage config: label, subtitle, color, icon
const STAGE_CONFIG = {
  preAI:     { label: 'Before AI',       subtitle: 'Manual processes and bottlenecks',   color: '#94a3b8' },
  aiAgents:  { label: 'With AI Agents',  subtitle: 'AI augments your decisions',         color: '#6BAED6' },
  aiAgentic: { label: 'Agentic System',  subtitle: 'Orchestrated intelligence at scale', color: '#4CAF50' },
} as const;

type StageName = keyof typeof STAGE_CONFIG;

// Pipeline phases in display order
const PHASE_ORDER = ['Plan', 'Create', 'Review', 'Publish', 'Measure', 'Optimize'] as const;

interface RoleSlideProps {
  slideIndex: number;
  role: RoleDefinition;
  graphData: GraphData;
  orderedNodeIds: string[];
}

export default function RoleSlide({ slideIndex, role, graphData, orderedNodeIds }: RoleSlideProps) {
  switch (slideIndex) {
    case 0:
      return <RoleIntroSlide role={role} graphData={graphData} orderedNodeIds={orderedNodeIds} />;
    case 1:
      return <RoleStageSlide stage="preAI" role={role} graphData={graphData} orderedNodeIds={orderedNodeIds} />;
    case 2:
      return <RoleStageSlide stage="aiAgents" role={role} graphData={graphData} orderedNodeIds={orderedNodeIds} />;
    case 3:
      return <RoleStageSlide stage="aiAgentic" role={role} graphData={graphData} orderedNodeIds={orderedNodeIds} showKeyInsight />;
    default:
      return null;
  }
}

// ─── Slide 0: Role Intro ─────────────────────────────────────

interface IntroSlideProps {
  role: RoleDefinition;
  graphData: GraphData;
  orderedNodeIds: string[];
}

function RoleIntroSlide({ role, graphData, orderedNodeIds }: IntroSlideProps) {
  const stats = computeRoleStats(role, graphData.nodes.length);
  const nodeMap = new Map(graphData.nodes.map(n => [n.id, n]));

  // Group pipeline nodes (owned steps + reviewed gates) by phase
  const pipelineIds = new Set([...role.ownedSteps, ...role.reviewedGates]);
  const pipelineNodes = orderedNodeIds
    .filter(id => pipelineIds.has(id))
    .map(id => nodeMap.get(id))
    .filter(Boolean) as GraphNode[];

  const byPhase = groupByPhase(pipelineNodes);

  // Agents and inputs
  const agentNodes = role.relatedAgents.map(id => nodeMap.get(id)).filter(Boolean) as GraphNode[];
  const inputNodes = role.relatedInputs.map(id => nodeMap.get(id)).filter(Boolean) as GraphNode[];

  return (
    <div className="max-w-3xl mx-auto w-full px-4">
      <div className="glass-panel rounded-2xl p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Role header */}
        <div className="text-center mb-6">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: role.accentColor + '20' }}
          >
            <Users className="w-7 h-7" style={{ color: role.accentColor }} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">{role.title}</h2>
          <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
          <p className="text-xs italic" style={{ color: role.accentColor }}>{role.tagline}</p>
        </div>

        {/* Coverage stat */}
        <div className="flex justify-center mb-6">
          <Badge
            variant="outline"
            className="text-xs px-3 py-1"
            style={{ borderColor: role.accentColor + '40', color: role.accentColor }}
          >
            {stats.total} nodes &middot; {stats.coveragePct}% of graph
          </Badge>
        </div>

        {/* What You Own — grouped by phase */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 mb-3">
            What You Own
          </h3>
          <div className="space-y-3">
            {PHASE_ORDER.map(phase => {
              const nodes = byPhase.get(phase);
              if (!nodes || nodes.length === 0) return null;
              return (
                <div key={phase}>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-1.5">{phase}</p>
                  <div className="space-y-1">
                    {nodes.map(node => {
                      const style = NODE_STYLES[node.type as NodeType] || NODE_STYLES.step;
                      const relation = role.ownedSteps.includes(node.id)
                        ? 'step' : 'gate';
                      return (
                        <div key={node.id} className="flex items-center gap-2.5 py-1">
                          <span className="text-sm shrink-0">{style.emoji}</span>
                          <span className="text-sm text-foreground">{node.label}</span>
                          <Badge
                            variant="outline"
                            className="text-[10px] ml-auto"
                            style={{ borderColor: (style.color) + '40', color: style.color }}
                          >
                            {relation}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Your Support System */}
        {(agentNodes.length > 0 || inputNodes.length > 0) && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 mb-3">
              Your Support System
            </h3>
            <div className="space-y-1">
              {agentNodes.map(node => {
                const style = NODE_STYLES.agent;
                return (
                  <div key={node.id} className="flex items-center gap-2.5 py-1">
                    <span className="text-sm shrink-0">{style.emoji}</span>
                    <span className="text-sm text-foreground">{node.label}</span>
                    <Badge variant="outline" className="text-[10px] ml-auto border-[#9B7ACC]/40 text-[#9B7ACC]">
                      agent
                    </Badge>
                  </div>
                );
              })}
              {inputNodes.map(node => {
                const style = NODE_STYLES.input;
                return (
                  <div key={node.id} className="flex items-center gap-2.5 py-1">
                    <span className="text-sm shrink-0">{style.emoji}</span>
                    <span className="text-sm text-foreground">{node.label}</span>
                    <Badge variant="outline" className="text-[10px] ml-auto border-[#C9A04E]/40 text-[#C9A04E]">
                      input
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Slides 1–3: Stage Slide ─────────────────────────────────

interface StageSlideProps {
  stage: StageName;
  role: RoleDefinition;
  graphData: GraphData;
  orderedNodeIds: string[];
  showKeyInsight?: boolean;
}

function RoleStageSlide({ stage, role, graphData, orderedNodeIds, showKeyInsight }: StageSlideProps) {
  const config = STAGE_CONFIG[stage];
  const nodeMap = new Map(graphData.nodes.map(n => [n.id, n]));

  // Separate pipeline nodes from support nodes
  const pipelineIds = new Set([...role.ownedSteps, ...role.reviewedGates]);
  const pipelineNodes = orderedNodeIds
    .filter(id => pipelineIds.has(id))
    .map(id => nodeMap.get(id))
    .filter(Boolean) as GraphNode[];
  const byPhase = groupByPhase(pipelineNodes);

  // Support nodes (agents + inputs) that have journey data
  const supportIds = [...role.relatedAgents, ...role.relatedInputs];
  const supportNodes = supportIds
    .map(id => nodeMap.get(id))
    .filter(Boolean) as GraphNode[];

  return (
    <div className="max-w-3xl mx-auto w-full px-4">
      <div className="glass-panel rounded-2xl p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Stage header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-3 h-10 rounded-full shrink-0"
            style={{ backgroundColor: config.color }}
          />
          <div>
            <h2 className="text-xl font-bold text-foreground">{config.label}</h2>
            <p className="text-xs text-muted-foreground">{config.subtitle}</p>
          </div>
        </div>

        {/* Pipeline nodes grouped by phase */}
        <div className="space-y-5">
          {PHASE_ORDER.map(phase => {
            const nodes = byPhase.get(phase);
            if (!nodes || nodes.length === 0) return null;
            return (
              <div key={phase}>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-2">{phase}</p>
                <div className="space-y-3">
                  {nodes.map(node => (
                    <NodeStageCard
                      key={node.id}
                      node={node}
                      role={role}
                      stage={stage}
                      stageColor={config.color}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Supporting agents/inputs */}
        {supportNodes.length > 0 && (
          <div className="mt-6">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-2">
              Supporting Your Work
            </p>
            <div className="space-y-3">
              {supportNodes.map(node => {
                const journey = role.narrative.nodeJourneys[node.id];
                if (!journey) return null;
                return (
                  <NodeStageCard
                    key={node.id}
                    node={node}
                    role={role}
                    stage={stage}
                    stageColor={config.color}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Key Insight — slide 3 only */}
        {showKeyInsight && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-5 rounded-xl bg-[#4CAF50]/10 border border-[#4CAF50]/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-[#4CAF50]" />
              <h4 className="text-xs font-bold text-[#4CAF50]">Key Insight</h4>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{role.narrative.keyInsight}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Node Card for a Single Stage ────────────────────────────

interface NodeStageCardProps {
  node: GraphNode;
  role: RoleDefinition;
  stage: StageName;
  stageColor: string;
}

function NodeStageCard({ node, role, stage, stageColor }: NodeStageCardProps) {
  const style = NODE_STYLES[node.type as NodeType] || NODE_STYLES.step;
  const journey = role.narrative.nodeJourneys[node.id];
  const stageData: JourneyStage | undefined = journey?.[stage];

  // Relationship label
  const relation = role.ownedSteps.includes(node.id)
    ? 'You own this step'
    : role.reviewedGates.includes(node.id)
      ? 'You review this gate'
      : role.relatedAgents.includes(node.id)
        ? 'AI agent supporting you'
        : role.relatedInputs.includes(node.id)
          ? 'Input you depend on'
          : '';

  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: stageColor + '25', borderLeftWidth: 3, borderLeftColor: stageColor }}
    >
      {/* Node header */}
      <div className="flex items-center gap-2.5 mb-2">
        <span className="text-sm shrink-0">{style.emoji}</span>
        <span className="text-sm font-semibold text-foreground">{node.label}</span>
        <Badge
          variant="outline"
          className="text-[10px] ml-auto"
          style={{ borderColor: style.color + '40', color: style.color }}
        >
          {node.type}
        </Badge>
      </div>

      {/* Relationship badge */}
      {relation && (
        <p className="text-[10px] text-muted-foreground/60 mb-2 flex items-center gap-1">
          <Eye className="w-3 h-3 inline" />
          {relation}
        </p>
      )}

      {/* Journey text */}
      {stageData ? (
        <>
          <p className="text-sm font-medium text-foreground/90 mb-1">{stageData.summary}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{stageData.detail}</p>
        </>
      ) : (
        <p className="text-xs text-muted-foreground/40 italic">No journey data for this stage</p>
      )}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────

// Group nodes by their pipeline phase (from node.group field)
function groupByPhase(nodes: GraphNode[]): Map<string, GraphNode[]> {
  const map = new Map<string, GraphNode[]>();
  for (const node of nodes) {
    const phase = node.group || 'Other';
    const arr = map.get(phase) || [];
    arr.push(node);
    map.set(phase, arr);
  }
  return map;
}
