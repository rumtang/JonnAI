'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Users } from 'lucide-react';
import type { GraphData } from '@/lib/graph/types';
import type { RoleDefinition, JourneyStage } from '@/lib/roles/role-definitions';

// Stage config: label, subtitle, color
const STAGE_CONFIG = {
  preAI:     { label: 'Before AI',       subtitle: 'Manual processes and bottlenecks',   color: '#94a3b8' },
  aiAgents:  { label: 'With AI Agents',  subtitle: 'AI augments your decisions',         color: '#6BAED6' },
  aiAgentic: { label: 'Agentic System',  subtitle: 'Orchestrated intelligence at scale', color: '#4CAF50' },
} as const;

type StageName = keyof typeof STAGE_CONFIG;

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
      return <RoleStageSlide stage="preAI" role={role} orderedNodeIds={orderedNodeIds} />;
    case 2:
      return <RoleStageSlide stage="aiAgents" role={role} orderedNodeIds={orderedNodeIds} />;
    case 3:
      return <RoleStageSlide stage="aiAgentic" role={role} orderedNodeIds={orderedNodeIds} showKeyInsight />;
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
  // Derive which phases this role spans from the group field on owned/reviewed nodes
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

        {/* Key Insight — framing quote for the narrative */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
  orderedNodeIds: string[];
  showKeyInsight?: boolean;
}

function RoleStageSlide({ stage, role, orderedNodeIds, showKeyInsight }: StageSlideProps) {
  const config = STAGE_CONFIG[stage];

  // Collect summary bullets for pipeline nodes (owned steps + reviewed gates)
  const pipelineIds = new Set([...role.ownedSteps, ...role.reviewedGates]);
  const workBullets = collectSummaries(orderedNodeIds, pipelineIds, role, stage);

  // Collect summary bullets for support nodes (agents + inputs)
  const supportIds = new Set([...role.relatedAgents, ...role.relatedInputs]);
  const supportBullets = collectSummaries(
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

        {/* Your Work */}
        {workBullets.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 mb-3">
              Your Work
            </h3>
            <ul className="space-y-2.5">
              {workBullets.map((text, i) => (
                <li key={i} className="flex gap-2.5">
                  <span
                    className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-sm text-foreground leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* What Supports You */}
        {supportBullets.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 mb-3">
              What Supports You
            </h3>
            <ul className="space-y-2.5">
              {supportBullets.map((text, i) => (
                <li key={i} className="flex gap-2.5">
                  <span
                    className="mt-2 w-1.5 h-1.5 rounded-full shrink-0 opacity-60"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
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

// ─── Helpers ─────────────────────────────────────────────────

// Pull the summary string from each node's journey for the given stage,
// preserving the order of orderedNodeIds and skipping nodes without journey data.
function collectSummaries(
  ids: string[] | Iterable<string>,
  filterSet: Set<string>,
  role: RoleDefinition,
  stage: StageName,
): string[] {
  const bullets: string[] = [];
  for (const id of ids) {
    if (!filterSet.has(id)) continue;
    const journey = role.narrative.nodeJourneys[id];
    const stageData: JourneyStage | undefined = journey?.[stage];
    if (stageData?.summary) {
      bullets.push(stageData.summary);
    }
  }
  return bullets;
}
