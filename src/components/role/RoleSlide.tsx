'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb, Users, AlertTriangle, TrendingUp, Target,
  UserCog, ChevronDown, Clock, Sparkles,
} from 'lucide-react';
import { useIsMobile } from '@/lib/hooks/use-is-mobile';
import type { GraphData } from '@/lib/graph/types';
import type { RoleDefinition, JourneyStage, StageOverview } from '@/lib/roles/role-definitions';

// Stage config: label, subtitle, color
const STAGE_CONFIG = {
  preAI:     { label: 'Before AI',       subtitle: 'Manual processes and bottlenecks',   color: '#94a3b8' },
  aiAgents:  { label: 'With AI Agents',  subtitle: 'AI augments your decisions',         color: '#6BAED6' },
  aiAgentic: { label: 'Agentic System',  subtitle: 'Orchestrated intelligence at scale', color: '#4CAF50' },
} as const;

type StageName = keyof typeof STAGE_CONFIG;

// Stage key used for stageOverviews lookup
const STAGE_KEY_MAP: Record<StageName, 'preAI' | 'aiAgents' | 'aiAgentic'> = {
  preAI: 'preAI',
  aiAgents: 'aiAgents',
  aiAgentic: 'aiAgentic',
};

interface RoleSlideProps {
  slideIndex: number;
  role: RoleDefinition;
  graphData: GraphData;
  orderedNodeIds: string[];
}

export default function RoleSlide({ slideIndex, role, graphData, orderedNodeIds }: RoleSlideProps) {
  switch (slideIndex) {
    case 0:
      return <RoleIntroSlide role={role} graphData={graphData} />;
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
}

function RoleIntroSlide({ role, graphData }: IntroSlideProps) {
  const isMobile = useIsMobile();
  const nodeMap = new Map(graphData.nodes.map(n => [n.id, n]));
  const pipelineIds = [...role.ownedSteps, ...role.reviewedGates];
  const phases = [
    ...new Set(
      pipelineIds
        .map(id => nodeMap.get(id)?.group)
        .filter((g): g is string => Boolean(g))
    ),
  ];
  const scopeLine = phases.length > 0
    ? `Spans ${phases.join(', ')} phases`
    : undefined;

  const overviews = role.narrative.stageOverviews;

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

        {/* Scope line */}
        {scopeLine && (
          <p className="text-center text-xs text-muted-foreground/70 mb-6">{scopeLine}</p>
        )}

        {/* Evolution Preview — shows time allocation shift across stages */}
        {overviews && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 mb-3 text-center">
              How Your Role Evolves
            </h3>
            <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
              {(['preAI', 'aiAgents', 'aiAgentic'] as const).map((stage, i) => {
                const overview = overviews[stage];
                const config = STAGE_CONFIG[stage];
                return (
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="rounded-xl p-3 border"
                    style={{
                      backgroundColor: config.color + '08',
                      borderColor: config.color + '25',
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: config.color }}
                      />
                      <span className="text-[10px] font-semibold" style={{ color: config.color }}>
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Clock className="w-3 h-3 mt-0.5 shrink-0 text-muted-foreground/50" />
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        {overview.timeAllocation}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Key Insight */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: overviews ? 0.5 : 0.2 }}
          className="p-5 rounded-xl border"
          style={{ backgroundColor: role.accentColor + '08', borderColor: role.accentColor + '30' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4" style={{ color: role.accentColor }} />
            <h4 className="text-xs font-bold" style={{ color: role.accentColor }}>Key Insight</h4>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{role.narrative.keyInsight}</p>
        </motion.div>
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
  const isMobile = useIsMobile();
  const nodeMap = new Map(graphData.nodes.map(n => [n.id, n]));

  // Get stage overview if available
  const stageKey = STAGE_KEY_MAP[stage];
  const overview = role.narrative.stageOverviews?.[stageKey];

  // Collect full node data for pipeline nodes (owned steps + reviewed gates)
  const pipelineIds = new Set([...role.ownedSteps, ...role.reviewedGates]);
  const workNodes = collectNodeData(orderedNodeIds, pipelineIds, role, stage);

  // Collect full node data for support nodes (agents + inputs)
  const supportIds = new Set([...role.relatedAgents, ...role.relatedInputs]);
  const supportNodes = collectNodeData(
    [...role.relatedAgents, ...role.relatedInputs],
    supportIds,
    role,
    stage,
  );

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

        {/* Stage Overview — framing section at top */}
        {overview && (
          <StageOverviewSection overview={overview} stageColor={config.color} isMobile={isMobile} />
        )}

        {/* Your Work */}
        {workNodes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 mb-3">
              Your Work
            </h3>
            <div className="space-y-4">
              {workNodes.map((node, i) => (
                <RichNodeSection
                  key={node.id}
                  nodeId={node.id}
                  label={nodeMap.get(node.id)?.label}
                  stageData={node.stage}
                  stageColor={config.color}
                  accentColor={role.accentColor}
                  index={i}
                  isMobile={isMobile}
                />
              ))}
            </div>
          </div>
        )}

        {/* What Supports You */}
        {supportNodes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 mb-3">
              What Supports You
            </h3>
            <div className="space-y-4">
              {supportNodes.map((node, i) => (
                <RichNodeSection
                  key={node.id}
                  nodeId={node.id}
                  label={nodeMap.get(node.id)?.label}
                  stageData={node.stage}
                  stageColor={config.color}
                  accentColor={role.accentColor}
                  index={i}
                  isMobile={isMobile}
                  muted
                />
              ))}
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

// ─── Stage Overview Section ──────────────────────────────────

interface StageOverviewProps {
  overview: StageOverview;
  stageColor: string;
  isMobile: boolean;
}

function StageOverviewSection({ overview, stageColor, isMobile }: StageOverviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-6 space-y-3"
    >
      {/* Narrative */}
      <p className="text-sm text-foreground/90 leading-relaxed">
        {overview.narrative}
      </p>

      {/* Time allocation */}
      <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
        <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: stageColor }} />
        <span>{overview.timeAllocation}</span>
      </div>

      {/* Critical metrics as pills */}
      <div className={`flex flex-wrap gap-1.5 ${isMobile ? '' : 'mt-1'}`}>
        {overview.criticalMetrics.map((metric, i) => (
          <span
            key={i}
            className="px-2 py-0.5 rounded-md text-[10px] font-medium border"
            style={{
              backgroundColor: stageColor + '10',
              borderColor: stageColor + '25',
              color: stageColor,
            }}
          >
            {metric}
          </span>
        ))}
      </div>

      {/* Strategic opportunity callout */}
      <div
        className="p-3 rounded-lg border"
        style={{ backgroundColor: stageColor + '08', borderColor: stageColor + '20' }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="w-3 h-3" style={{ color: stageColor }} />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: stageColor }}>
            Strategic Opportunity
          </span>
        </div>
        <p className="text-xs text-foreground/80 leading-relaxed">
          {overview.strategicOpportunity}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Rich Node Section ───────────────────────────────────────

interface RichNodeSectionProps {
  nodeId: string;
  label?: string;
  stageData: JourneyStage;
  stageColor: string;
  accentColor: string;
  index: number;
  isMobile: boolean;
  muted?: boolean;
}

function RichNodeSection({
  nodeId,
  label,
  stageData,
  stageColor,
  accentColor,
  index,
  isMobile,
  muted,
}: RichNodeSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const hasRichContent = stageData.detail || stageData.painPoints || stageData.benchmarks ||
                          stageData.outcomes || stageData.roleEvolution;

  // Format node ID into readable label if no graph label available
  const displayLabel = label || nodeId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
      className={`rounded-xl p-3 border ${muted ? 'opacity-80' : ''}`}
      style={{
        backgroundColor: stageColor + '05',
        borderColor: stageColor + '15',
      }}
    >
      {/* Node label */}
      <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: accentColor + 'aa' }}>
        {displayLabel}
      </p>

      {/* Summary — lead text */}
      <p className={`text-sm leading-relaxed ${muted ? 'text-muted-foreground' : 'text-foreground'}`}>
        {stageData.summary}
      </p>

      {/* Expand/collapse toggle for rich content */}
      {hasRichContent && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mt-2 text-[11px] font-medium transition-colors"
          style={{ color: stageColor }}
        >
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-3 h-3" />
          </motion.span>
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {/* Expandable rich content */}
      <AnimatePresence>
        {expanded && hasRichContent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3 border-t pt-3" style={{ borderColor: stageColor + '15' }}>
              {/* Detail paragraph */}
              {stageData.detail && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {stageData.detail}
                </p>
              )}

              {/* Pain Points */}
              {stageData.painPoints && stageData.painPoints.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <AlertTriangle className="w-3 h-3 text-amber-500/70" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-500/70">
                      Watch Out For
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {stageData.painPoints.map((point, i) => (
                      <li key={i} className="flex gap-2 text-[11px] text-muted-foreground/80 leading-relaxed">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-500/40 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benchmarks */}
              {stageData.benchmarks && stageData.benchmarks.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <TrendingUp className="w-3 h-3" style={{ color: stageColor }} />
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: stageColor }}>
                      Industry Data
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {stageData.benchmarks.map((bench, i) => (
                      <li key={i} className="flex gap-2 text-[11px] text-muted-foreground/80 leading-relaxed">
                        <span
                          className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                          style={{ backgroundColor: stageColor + '60' }}
                        />
                        {bench}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Outcomes */}
              {stageData.outcomes && stageData.outcomes.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Target className="w-3 h-3 text-emerald-500/70" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500/70">
                      Expected Outcomes
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {stageData.outcomes.map((outcome, i) => (
                      <li key={i} className="flex gap-2 text-[11px] text-muted-foreground/80 leading-relaxed">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500/40 shrink-0" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Role Evolution */}
              {stageData.roleEvolution && (
                <div className="flex items-start gap-2 pt-1">
                  <UserCog className="w-3 h-3 mt-0.5 shrink-0 text-muted-foreground/50" />
                  <p className="text-[11px] italic text-muted-foreground/70 leading-relaxed">
                    {stageData.roleEvolution}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────

// Pull full JourneyStage data from each node's journey for the given stage,
// preserving the order of ids and skipping nodes without journey data.
function collectNodeData(
  ids: string[] | Iterable<string>,
  filterSet: Set<string>,
  role: RoleDefinition,
  stage: StageName,
): { id: string; stage: JourneyStage }[] {
  const results: { id: string; stage: JourneyStage }[] = [];
  for (const id of ids) {
    if (!filterSet.has(id)) continue;
    const journey = role.narrative.nodeJourneys[id];
    const stageData: JourneyStage | undefined = journey?.[stage];
    if (stageData?.summary) {
      results.push({ id, stage: stageData });
    }
  }
  return results;
}
