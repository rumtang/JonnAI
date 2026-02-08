'use client';

import { useEffect } from 'react';
import GraphScene from '@/components/graph/GraphScene';
import NodeDetailPanel from '@/components/graph/NodeDetailPanel';
import GraphControls from '@/components/graph/GraphControls';
import LegendPanel from '@/components/graph/LegendPanel';
import SearchBar from '@/components/graph/SearchBar';
import ZoomControls from '@/components/graph/ZoomControls';
import PresentationController from '@/components/presentation/PresentationController';
import ModeToggle from '@/components/graph/ModeToggle';
import CampaignPanel from '@/components/graph/CampaignMode/CampaignPanel';
import CampaignSummary from '@/components/graph/CampaignMode/CampaignSummary';

import { useGraphStore } from '@/lib/store/graph-store';
import { usePresentationStore } from '@/lib/store/presentation-store';
import { useCampaignStore } from '@/lib/store/campaign-store';
import { navigateToNode } from '@/lib/utils/camera-navigation';
import seedGraphData from '@/data/seed-graph.json';
import linearProcessData from '@/data/linear-process.json';
import presentationStepsData from '@/data/presentation-steps.json';
import { GraphData, GraphNode, GraphLink, PresentationStep } from '@/lib/graph/types';

function buildLinearGraphData(): GraphData {
  const nodes: GraphNode[] = linearProcessData.steps.map((step) => ({
    id: step.id,
    type: 'step' as const,
    label: step.label,
    description: step.description,
    group: 'Content Lifecycle',
    val: 8,
    fx: step.x,
    fy: 0,
    fz: 0,
  }));

  const links: GraphLink[] = [];
  for (let i = 0; i < linearProcessData.steps.length - 1; i++) {
    links.push({
      source: linearProcessData.steps[i].id,
      target: linearProcessData.steps[i + 1].id,
      type: 'linear-flow' as const,
      particles: 5,
      particleSpeed: 0.008,
    });
  }

  return { nodes, links };
}

export default function GraphPage() {
  // Use selectors to avoid re-rendering on every store change (e.g. flashingLinkKey, navigationHistory)
  const setGraphData = useGraphStore(s => s.setGraphData);
  const setFullGraphData = useGraphStore(s => s.setFullGraphData);
  const setLinearGraphData = useGraphStore(s => s.setLinearGraphData);
  const selectNode = useGraphStore(s => s.selectNode);
  const { setSteps, mode, setMode } = usePresentationStore();
  const campaignActive = useCampaignStore(s => s.isActive);
  const currentNodeId = useCampaignStore(s => s.currentNodeId);
  const startCampaign = useCampaignStore(s => s.startCampaign);

  useEffect(() => {
    // Read initial mode from sessionStorage (set by landing page)
    const savedMode = typeof window !== 'undefined'
      ? sessionStorage.getItem('initialMode') as 'guided' | 'explore' | 'campaign' | null
      : null;

    if (savedMode) {
      setMode(savedMode);
      sessionStorage.removeItem('initialMode');
    }

    const activeMode = savedMode || mode;

    // Load all data
    const fullData = seedGraphData as unknown as GraphData;
    const linearData = buildLinearGraphData();

    setFullGraphData(fullData);
    setLinearGraphData(linearData);
    setSteps(presentationStepsData as PresentationStep[]);

    // Start with linear view in guided mode, full graph in explore/campaign mode
    if (activeMode === 'guided') {
      setGraphData(linearData);
    } else {
      setGraphData(fullData);
      if (activeMode === 'campaign') {
        startCampaign();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navigate camera to current campaign node when campaign starts or node changes
  useEffect(() => {
    if (!campaignActive || !currentNodeId) return;
    const { graphData } = useGraphStore.getState();
    const node = graphData.nodes.find(n => n.id === currentNodeId);
    if (node) {
      selectNode(node);
      // Small delay to allow graph to settle before camera move
      const timer = setTimeout(() => {
        navigateToNode(node, { distance: 120, duration: 800 });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [campaignActive, currentNodeId, selectNode]);

  // Floating "Run a Campaign" CTA for explore mode
  const handleStartCampaign = () => {
    setMode('campaign');
    const { loadFullGraph } = useGraphStore.getState();
    loadFullGraph();
    startCampaign();
  };

  return (
    <>
      {/* Main 3D Graph — fills the layout, sits above crystalline bg */}
      <div className="absolute inset-0 z-10">
        <GraphScene />
      </div>

      {/* UI Overlays */}
      <ModeToggle />

      {mode === 'guided' ? (
        <PresentationController />
      ) : mode === 'campaign' ? (
        <>
          <CampaignPanel />
          <CampaignSummary />
          <ZoomControls />
        </>
      ) : (
        <>
          <GraphControls />
          <SearchBar />
          <LegendPanel />
          <ZoomControls />
          <NodeDetailPanel />

          {/* Floating CTA to start a campaign */}
          <button
            onClick={handleStartCampaign}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50
                       px-6 py-3 rounded-2xl glass-panel
                       hover:shadow-lg hover:shadow-[#4CAF50]/10
                       transition-all duration-300 group"
          >
            <div className="text-center">
              <p className="text-sm font-semibold text-[#4CAF50] group-hover:text-[#66BB6A] transition-colors">
                {'\u25B6'} Run a Campaign
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Walk through the workflow step by step
              </p>
            </div>
          </button>
        </>
      )}
    </>
  );
}
