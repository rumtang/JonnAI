'use client';

import { useShallow } from 'zustand/react/shallow';
import { useCampaignStore, getPhaseForNode } from '@/lib/store/campaign-store';
import { usePresentationStore } from '@/lib/store/presentation-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { useState } from 'react';

const PHASES_MARKETING = ['Plan', 'Create', 'Review', 'Publish', 'Measure', 'Optimize'];
const PHASES_FRONTOFFICE = ['Marketing', 'Sales', 'Service', 'Customer Success'];

export default function CampaignHeader() {
  const { campaignName, currentNodeId, stepCount, revisionCount, totalEstimatedMinutes } = useCampaignStore(
    useShallow((s) => ({
      campaignName: s.campaignName,
      currentNodeId: s.currentNodeId,
      stepCount: s.stepCount,
      revisionCount: s.revisionCount,
      totalEstimatedMinutes: s.totalEstimatedMinutes,
    }))
  );
  const setCampaignName = useCampaignStore(s => s.setCampaignName);
  const graphData = useGraphStore(s => s.graphData);
  const lens = usePresentationStore(s => s.lens);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(campaignName);

  const isFrontOffice = lens === 'frontoffice';
  const PHASES = isFrontOffice ? PHASES_FRONTOFFICE : PHASES_MARKETING;
  const currentPhase = getPhaseForNode(currentNodeId, graphData.nodes);

  // Format total time
  const hours = Math.floor(totalEstimatedMinutes / 60);
  const mins = totalEstimatedMinutes % 60;
  const timeLabel = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const handleNameSubmit = () => {
    if (editValue.trim()) {
      setCampaignName(editValue.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="mb-4">
      {/* Campaign title */}
      <div className="mb-3">
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
            autoFocus
            className="text-lg font-bold text-foreground bg-transparent border-b border-[#4CAF50]/40
                       outline-none w-full pb-1"
          />
        ) : (
          <button
            onClick={() => { setEditValue(campaignName); setIsEditing(true); }}
            className="text-lg font-bold text-foreground hover:text-[#4CAF50] transition-colors
                       text-left w-full"
            title="Click to rename"
          >
            {campaignName}
          </button>
        )}
      </div>

      {/* Phase progress bar */}
      <div className="flex items-center gap-1 mb-3">
        {PHASES.map((phase, i) => {
          const phaseIndex = PHASES.indexOf(currentPhase);
          const isActive = phase === currentPhase;
          const isPast = phaseIndex >= 0 && i < phaseIndex;
          const isFuture = phaseIndex >= 0 && i > phaseIndex;

          return (
            <div key={phase} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                  isActive
                    ? 'bg-[#4CAF50] shadow-[0_0_8px_rgba(76,175,80,0.4)]'
                    : isPast
                    ? 'bg-[#4CAF50]/50'
                    : isFuture
                    ? 'bg-white/10'
                    : 'bg-white/10'
                }`}
              />
              <span className={`text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#4CAF50]' : isPast ? 'text-foreground/50' : 'text-muted-foreground/40'
              }`}>
                {phase}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>Step {stepCount} of ~{isFrontOffice ? 28 : 31}</span>
        <span className="text-muted-foreground/30">|</span>
        <span>{'\u23F1'} {timeLabel} elapsed</span>
        <span className="text-muted-foreground/30">|</span>
        <span>{'\uD83D\uDD04'} {revisionCount} revision{revisionCount !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}
