'use client';

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, ChevronLeft, ChevronRight, RefreshCw, Eye } from 'lucide-react';
import { useRoleInsightStore } from '@/lib/store/role-insight-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { useRoleInsight } from '@/lib/roles/use-role-insight';
import { NODE_STYLES } from '@/lib/graph/node-styles';
import { Badge } from '@/components/ui/badge';
import { GraphNode, NodeType, StepMeta, GateMeta, AgentMeta, InputMeta } from '@/lib/graph/types';

interface RoleInsightPanelProps {
  onChangeRole: () => void;
}

// Map walkthrough node to a narrative section heading + content
function getNarrativeForStep(
  nodeId: string,
  role: { ownedSteps: string[]; reviewedGates: string[]; relatedAgents: string[]; relatedInputs: string[] },
  narrative: { today: string; future: string; teamSupport: string; keyInsight: string }
): { heading: string; content: string } | null {
  if (role.ownedSteps.includes(nodeId) || role.reviewedGates.includes(nodeId)) {
    return { heading: 'Your Work Today', content: narrative.today };
  }
  if (role.relatedAgents.includes(nodeId)) {
    return { heading: 'Your Future with AI', content: narrative.future };
  }
  if (role.relatedInputs.includes(nodeId)) {
    return { heading: 'How Your Team Supports You', content: narrative.teamSupport };
  }
  return null;
}

export default function RoleInsightPanel({ onChangeRole }: RoleInsightPanelProps) {
  const selectedRole = useRoleInsightStore(s => s.selectedRole);
  const roleSubgraph = useRoleInsightStore(s => s.roleSubgraph);
  const isActive = useRoleInsightStore(s => s.isActive);
  const walkthroughPath = useRoleInsightStore(s => s.walkthroughPath);
  const currentStepIndex = useRoleInsightStore(s => s.currentStepIndex);
  const graphData = useGraphStore(s => s.graphData);
  const {
    deactivateRole,
    goToNextStep,
    goToPrevStep,
    goToStep,
  } = useRoleInsight();

  // Prevent rapid clicks from launching multiple camera animations
  const isNavigatingRef = useRef(false);
  const guardedNav = (fn: () => void) => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    fn();
    setTimeout(() => { isNavigatingRef.current = false; }, 1000);
  };

  if (!selectedRole || !roleSubgraph || walkthroughPath.length === 0) return null;

  const currentNodeId = walkthroughPath[currentStepIndex];
  const currentNode = graphData.nodes.find(n => n.id === currentNodeId);
  if (!currentNode) return null;

  const style = NODE_STYLES[currentNode.type as NodeType] || NODE_STYLES.step;
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === walkthroughPath.length - 1;
  const narrativeBlock = getNarrativeForStep(currentNodeId, selectedRole, selectedRole.narrative);

  // Classify the current node for the user
  const isPrimary = selectedRole.ownedSteps.includes(currentNodeId) || selectedRole.reviewedGates.includes(currentNodeId);
  const nodeRelation = isPrimary
    ? (selectedRole.ownedSteps.includes(currentNodeId) ? 'You own this step' : 'You review this gate')
    : (selectedRole.relatedAgents.includes(currentNodeId) ? 'AI agent supporting you' : 'Input you depend on');

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onWheel={(e) => e.stopPropagation()}
          className="fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-96 z-50 glass-panel rounded-l-2xl flex flex-col"
        >
          <div className="flex flex-col h-full p-6 overflow-hidden">
            {/* Role header — fixed */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#C9A04E]/20 shrink-0">
                  <Users className="w-4 h-4 text-[#C9A04E]" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-foreground truncate">{selectedRole.title}</h2>
                  <p className="text-xs text-[#C9A04E]">
                    Step {currentStepIndex + 1} of {walkthroughPath.length}
                  </p>
                </div>
              </div>
              <button
                onClick={deactivateRole}
                className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1">
              {walkthroughPath.map((nodeId, i) => {
                const node = graphData.nodes.find(n => n.id === nodeId);
                const nodeStyle = node ? (NODE_STYLES[node.type as NodeType] || NODE_STYLES.step) : NODE_STYLES.step;
                const isCurrent = i === currentStepIndex;
                const isVisited = i < currentStepIndex;
                return (
                  <button
                    key={nodeId}
                    onClick={() => guardedNav(() => goToStep(i))}
                    title={node?.label || nodeId}
                    className={`shrink-0 rounded-full transition-all duration-300 ${
                      isCurrent
                        ? 'w-6 h-3 ring-2 ring-[#C9A04E]/50'
                        : 'w-3 h-3 hover:scale-125'
                    } ${isVisited ? 'opacity-100' : 'opacity-40'}`}
                    style={{
                      backgroundColor: isCurrent
                        ? '#C9A04E'
                        : (nodeStyle?.color || '#6b7280') + (isVisited ? '' : '80'),
                    }}
                  />
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-border mb-4" />

            {/* Scrollable content — current node details */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {/* Current node card */}
              <motion.div
                key={currentNodeId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Node header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: (style?.color || '#6b7280') + '20' }}
                  >
                    {style?.emoji}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{currentNode.label}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: (style?.color || '#6b7280') + '60', color: style?.color }}
                      >
                        {currentNode.type}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Relationship to role */}
                <div className="mb-3 px-3 py-2 rounded-lg bg-[#C9A04E]/5 border border-[#C9A04E]/20">
                  <p className="text-xs font-medium text-[#C9A04E]">
                    <Eye className="w-3 h-3 inline mr-1" />
                    {nodeRelation}
                  </p>
                </div>

                {/* Node description */}
                <p className="text-sm text-muted-foreground mb-4">{currentNode.description}</p>

                {/* Type-specific metadata */}
                <div className="space-y-3 mb-4">
                  {currentNode.type === 'step' && <StepDetail meta={currentNode.meta as StepMeta} />}
                  {currentNode.type === 'gate' && <GateDetail meta={currentNode.meta as GateMeta} />}
                  {currentNode.type === 'agent' && <AgentDetail meta={currentNode.meta as AgentMeta} />}
                  {currentNode.type === 'input' && <InputDetail meta={currentNode.meta as InputMeta} />}
                </div>

                {/* Narrative insight for this step */}
                {narrativeBlock && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="p-4 rounded-xl bg-[#C9A04E]/5 border border-[#C9A04E]/30 mb-4"
                  >
                    <h4 className="text-xs font-semibold text-[#C9A04E] mb-2">{narrativeBlock.heading}</h4>
                    <p className="text-sm text-foreground/90 leading-relaxed">{narrativeBlock.content}</p>
                  </motion.div>
                )}

                {/* Key insight — shown on the last step */}
                {isLast && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 rounded-xl bg-[#C9A04E]/10 border border-[#C9A04E]/40 mb-4"
                  >
                    <h4 className="text-xs font-bold text-[#C9A04E] mb-2">Key Insight</h4>
                    <p className="text-sm text-foreground leading-relaxed">{selectedRole.narrative.keyInsight}</p>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Fixed bottom — navigation + actions */}
            <div className="pt-4 border-t border-border space-y-3">
              {/* Prev / Next navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => guardedNav(goToPrevStep)}
                  disabled={isFirst}
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl
                             border text-sm font-medium transition-all duration-200
                             ${isFirst
                               ? 'border-white/5 text-muted-foreground/30 cursor-not-allowed'
                               : 'border-white/10 text-foreground hover:bg-white/5'}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>
                <button
                  onClick={() => guardedNav(goToNextStep)}
                  disabled={isLast}
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl
                             border text-sm font-semibold transition-all duration-200
                             ${isLast
                               ? 'border-white/5 text-muted-foreground/30 cursor-not-allowed'
                               : 'border-[#C9A04E]/30 bg-[#C9A04E]/20 text-[#C9A04E] hover:bg-[#C9A04E]/30'}`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Change role / clear */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onChangeRole}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl
                             text-xs text-muted-foreground hover:text-foreground
                             border border-white/10 hover:bg-white/5 transition-all duration-200"
                >
                  <RefreshCw className="w-3 h-3" />
                  Change Role
                </button>
                <button
                  onClick={deactivateRole}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl
                             text-xs text-muted-foreground hover:text-foreground
                             border border-white/10 hover:bg-white/5 transition-all duration-200"
                >
                  Clear View
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Metadata components (match CampaignNodeCard patterns) ---

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
