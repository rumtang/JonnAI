'use client';

import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { motion, AnimatePresence } from 'framer-motion';
import { useCampaignStore } from '@/lib/store/campaign-store';
import { usePresentationStore } from '@/lib/store/presentation-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { useSessionStore } from '@/lib/store/session-store';
import { StepMeta } from '@/lib/graph/types';

export default function CampaignSummary() {
  const {
    isComplete,
    stepCount,
    totalEstimatedMinutes,
    decisions,
    revisionCount,
    escalationCount,
    visitedNodes,
  } = useCampaignStore(
    useShallow((s) => ({
      isComplete: s.isComplete,
      stepCount: s.stepCount,
      totalEstimatedMinutes: s.totalEstimatedMinutes,
      decisions: s.decisions,
      revisionCount: s.revisionCount,
      escalationCount: s.escalationCount,
      visitedNodes: s.visitedNodes,
    }))
  );
  const resetCampaign = useCampaignStore(s => s.resetCampaign);
  const startCampaign = useCampaignStore(s => s.startCampaign);

  const setMode = usePresentationStore(s => s.setMode);
  const lens = usePresentationStore(s => s.lens);
  const isFrontOffice = lens === 'frontoffice';

  const loadFullGraph = useGraphStore(s => s.loadFullGraph);
  const selectNode = useGraphStore(s => s.selectNode);
  const clearHighlights = useGraphStore(s => s.clearHighlights);
  const graphData = useGraphStore(s => s.graphData);

  const orgProfile = useSessionStore(s => s.orgProfile);

  // Compute manual baseline from actual graph data
  const baseline = useMemo(() => {
    const nodes = graphData.nodes;
    // Sum all step estimatedTime values
    let baseMinutes = 0;
    let gateCount = 0;
    for (const node of nodes) {
      if (node.type === 'step') {
        const est = (node.meta as StepMeta)?.estimatedTime || '';
        const match = est.match(/(\d+)\s*min/i);
        if (match) baseMinutes += parseInt(match[1], 10);
      }
      if (node.type === 'gate') gateCount++;
    }
    // Manual execution: 2.5x slower without AI acceleration
    const manualMinutes = Math.round(baseMinutes * 2.5);
    // 60% of gates trigger revision without AI quality checks
    const manualRevisions = Math.round(gateCount * 0.6);
    // 7-day approval cycle per gate
    const manualDays = gateCount * 7;

    const manualHours = Math.floor(manualMinutes / 60);
    const manualMins = manualMinutes % 60;
    const manualTimeLabel = manualHours > 0 ? `${manualHours}h ${manualMins}m` : `${manualMins}m`;

    return { manualTimeLabel, manualRevisions, manualDays };
  }, [graphData.nodes]);

  const gatesPassed = decisions.filter(d => {
    const dl = d.decision.toLowerCase();
    return dl === 'approve' || dl === 'pass' || dl === 'archive';
  }).length;

  const hours = Math.floor(totalEstimatedMinutes / 60);
  const mins = totalEstimatedMinutes % 60;
  const timeLabel = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const handleRunAgain = () => {
    // Preserve current results in session store for comparison on next run
    useSessionStore.getState().setCampaignResults({
      totalSteps: stepCount,
      totalMinutes: totalEstimatedMinutes,
      revisions: revisionCount,
      escalations: escalationCount,
      gatesApproved: gatesPassed,
      completedAt: Date.now(),
    });
    selectNode(null);
    clearHighlights();
    resetCampaign();
    startCampaign();
  };

  const handleExplore = () => {
    selectNode(null);
    clearHighlights();
    resetCampaign();
    setMode('explore');
    loadFullGraph();
  };

  return (
    <AnimatePresence>
      {isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="glass-panel rounded-2xl p-8 max-w-md w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isFrontOffice ? 'Journey Complete' : 'Campaign Complete'}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {isFrontOffice
                ? 'Here\u2019s a summary of your customer journey walkthrough.'
                : 'Here\u2019s a summary of your content campaign walkthrough.'}
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <StatCard
                icon={'\uD83D\uDCCA'}
                label="Steps Taken"
                value={stepCount.toString()}
                detail={`${visitedNodes.length} unique nodes`}
              />
              <StatCard
                icon={'\u23F1'}
                label="Est. Time"
                value={timeLabel}
                detail="cumulative"
              />
              <StatCard
                icon={'\u2705'}
                label="Gates Passed"
                value={gatesPassed.toString()}
                detail={`of ${decisions.length} decisions`}
              />
              <StatCard
                icon={'\uD83D\uDD04'}
                label="Revisions"
                value={revisionCount.toString()}
                detail={`${escalationCount} escalation${escalationCount !== 1 ? 's' : ''}`}
              />
            </div>

            {/* Baseline comparison — manual vs. AI-assisted (computed from graph data) */}
            <div className="mb-6 rounded-xl border border-white/10 overflow-hidden">
              <div className="grid grid-cols-5 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider px-3 py-2 bg-white/5">
                <span />
                <span className="text-center">Time</span>
                <span className="text-center">Revisions</span>
                <span className="text-center">Escalations</span>
                <span className="text-center">Approval</span>
              </div>
              <div className="grid grid-cols-5 text-xs px-3 py-2.5 border-t border-white/5">
                <span className="text-muted-foreground">Manual Est.</span>
                <span className="text-center text-foreground/50">{baseline.manualTimeLabel}</span>
                <span className="text-center text-foreground/50">~{baseline.manualRevisions}</span>
                <span className="text-center text-foreground/50 text-[10px]">N/A</span>
                <span className="text-center text-foreground/50">~{baseline.manualDays}d</span>
              </div>
              <div className="grid grid-cols-5 text-xs px-3 py-2.5 border-t border-white/5 bg-[#4CAF50]/5">
                <span className="text-[#4CAF50] font-semibold">Your Run</span>
                <span className="text-center text-foreground font-semibold">{timeLabel}</span>
                <span className="text-center text-foreground font-semibold">{revisionCount}</span>
                <span className="text-center text-foreground font-semibold">{escalationCount}</span>
                <span className="text-center text-foreground font-semibold text-[10px]">~instant</span>
              </div>
            </div>

            {/* Org profile context — shown when session has org data */}
            {orgProfile && (
              <p className="text-[10px] text-muted-foreground/60 mb-4 leading-relaxed">
                Based on {orgProfile.companyName || 'your organization'}&apos;s profile, this {isFrontOffice ? 'journey' : 'campaign'}
                {' '}represents approximately {totalEstimatedMinutes > 0
                  ? `${Math.round((totalEstimatedMinutes / (orgProfile.marketingHeadcount * 160)) * 100)}%`
                  : '—'
                } of monthly operational capacity.
              </p>
            )}

            {/* Decision summary */}
            {decisions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-muted-foreground mb-2">Decision History</h3>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {decisions.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-border">
                      <span className="text-foreground">{d.gateId.replace(/-/g, ' ')}</span>
                      <span className={`font-medium ${getDecisionColor(d.decision)}`}>{d.decision}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What-if prompt */}
            <p className="text-xs text-muted-foreground/70 mb-3 text-center italic">
              What would happen with different decisions?
            </p>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleRunAgain}
                className="flex-1 px-4 py-3 rounded-xl bg-[#4CAF50]/20 hover:bg-[#4CAF50]/30
                           border border-[#4CAF50]/30 text-[#4CAF50] font-semibold text-sm
                           transition-all duration-200"
              >
                {'\uD83D\uDD04'} Try Different Decisions
              </button>
              <button
                onClick={handleExplore}
                className="flex-1 px-4 py-3 rounded-xl bg-[#9B7ACC]/20 hover:bg-[#9B7ACC]/30
                           border border-[#9B7ACC]/30 text-[#9B7ACC] font-semibold text-sm
                           transition-all duration-200"
              >
                {'\uD83D\uDD0D'} Explore
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatCard({ icon, label, value, detail }: {
  icon: string;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{icon}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground/60">{detail}</p>
    </div>
  );
}

function getDecisionColor(decision: string): string {
  const d = decision.toLowerCase();
  if (d === 'approve' || d === 'pass') return 'text-emerald-400';
  if (d === 'revise' || d === 'flag' || d === 'iterate') return 'text-amber-400';
  if (d.startsWith('escalate')) return 'text-red-400';
  if (d === 'archive') return 'text-slate-400';
  return 'text-foreground';
}
