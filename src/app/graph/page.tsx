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

import { useGraphStore } from '@/lib/store/graph-store';
import { usePresentationStore } from '@/lib/store/presentation-store';
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

function buildLinearWithAgentsData(): GraphData {
  const base = buildLinearGraphData();

  const agentNodes: GraphNode[] = linearProcessData.agents.map(agent => ({
    id: agent.id,
    type: 'agent' as const,
    label: agent.label,
    description: `AI agent for ${agent.parentStep.replace('ls-', '')} phase`,
    group: 'AI Agents',
    val: 5,
    fx: linearProcessData.steps.find(s => s.id === agent.parentStep)?.x ?? 0,
    fy: -60,
    fz: 0,
  }));

  const agentLinks: GraphLink[] = linearProcessData.agents.map(agent => ({
    source: agent.parentStep,
    target: agent.id,
    type: 'performs' as const,
    particles: 2,
  }));

  return {
    nodes: [...base.nodes, ...agentNodes],
    links: [...base.links, ...agentLinks],
  };
}

export default function GraphPage() {
  const { setGraphData, setFullGraphData, setLinearGraphData } = useGraphStore();
  const { setSteps, mode, setMode } = usePresentationStore();

  useEffect(() => {
    // Read initial mode from sessionStorage (set by landing page)
    const savedMode = typeof window !== 'undefined'
      ? sessionStorage.getItem('initialMode') as 'guided' | 'explore' | null
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

    // Start with linear view in guided mode, full graph in explore mode
    if (activeMode === 'guided') {
      setGraphData(linearData);
    } else {
      setGraphData(fullData);
    }
  }, []);

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
      ) : (
        <>
          <GraphControls />
          <SearchBar />
          <LegendPanel />
          <ZoomControls />
        </>
      )}

      <NodeDetailPanel />
    </>
  );
}
