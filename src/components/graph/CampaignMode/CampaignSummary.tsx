'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCampaignStore } from '@/lib/store/campaign-store';
import { usePresentationStore } from '@/lib/store/presentation-store';
import { useGraphStore } from '@/lib/store/graph-store';

export default function CampaignSummary() {
  const {
    isComplete,
    stepCount,
    totalEstimatedMinutes,
    decisions,
    revisionCount,
    escalationCount,
    visitedNodes,
    resetCampaign,
    startCampaign,
  } = useCampaignStore();
  const { setMode } = usePresentationStore();
  const { loadFullGraph, selectNode, clearHighlights } = useGraphStore();

  const gatesPassed = decisions.filter(d => {
    const dl = d.decision.toLowerCase();
    return dl === 'approve' || dl === 'pass' || dl === 'archive';
  }).length;

  const hours = Math.floor(totalEstimatedMinutes / 60);
  const mins = totalEstimatedMinutes % 60;
  const timeLabel = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const handleRunAgain = () => {
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
            <h2 className="text-2xl font-bold text-foreground mb-2">Campaign Complete</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Here&apos;s a summary of your content campaign walkthrough.
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

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleRunAgain}
                className="flex-1 px-4 py-3 rounded-xl bg-[#4CAF50]/20 hover:bg-[#4CAF50]/30
                           border border-[#4CAF50]/30 text-[#4CAF50] font-semibold text-sm
                           transition-all duration-200"
              >
                {'\uD83D\uDD04'} Run Again
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
