'use client';

import { useCampaignStore, CampaignLogEntry } from '@/lib/store/campaign-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { usePresentationStore } from '@/lib/store/presentation-store';
import { navigateToNode } from '@/lib/utils/camera-navigation';

export default function CampaignLog() {
  const log = useCampaignStore(s => s.log);
  const graphData = useGraphStore(s => s.graphData);
  const selectNode = useGraphStore(s => s.selectNode);
  const lens = usePresentationStore(s => s.lens);

  if (log.length === 0) return null;

  const handleLogClick = (entry: CampaignLogEntry) => {
    const node = graphData.nodes.find(n => n.id === entry.nodeId);
    if (node) {
      selectNode(node);
      navigateToNode(node, { distance: 120, duration: 800 });
    }
  };

  return (
    <div className="mt-4 border-t border-border pt-3">
      <h4 className="text-xs font-semibold text-muted-foreground mb-2">
        {lens === 'frontoffice' ? 'Activity Log' : 'Campaign Log'}
      </h4>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {log.map((entry, i) => (
          <button
            key={i}
            onClick={() => handleLogClick(entry)}
            className="w-full flex items-start gap-2 p-2 rounded-lg text-left
                       hover:bg-accent/10 transition-colors text-xs"
          >
            <span className="text-sm leading-none shrink-0 mt-0.5">{entry.icon}</span>
            <div className="min-w-0">
              <span className="text-foreground font-medium">
                {entry.nodeType === 'gate' ? 'Gate' : `Step ${log.length - i}`}:
              </span>{' '}
              <span className="text-foreground">{entry.nodeLabel}</span>
              {entry.estimatedTime && (
                <span className="text-muted-foreground"> — {entry.estimatedTime}</span>
              )}
              {entry.owner && (
                <span className="text-muted-foreground"> — {entry.owner}</span>
              )}
              <br />
              <span className="text-muted-foreground/70">{entry.action}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
