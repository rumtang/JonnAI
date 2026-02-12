'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { Home } from 'lucide-react';
import { useIsMobile } from '@/lib/hooks/use-is-mobile';
import GraphScene from '@/components/graph/GraphScene';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import NodeDetailPanel from '@/components/graph/NodeDetailPanel';
import GraphControls from '@/components/graph/GraphControls';

import SearchBar from '@/components/graph/SearchBar';
import ZoomControls from '@/components/graph/ZoomControls';
import PresentationController from '@/components/presentation/PresentationController';
import BuildController from '@/components/build/BuildController';
import RoiController from '@/components/roi/RoiController';
import ModeToggle from '@/components/graph/ModeToggle';
import CampaignPanel from '@/components/graph/CampaignMode/CampaignPanel';
import CampaignSummary from '@/components/graph/CampaignMode/CampaignSummary';
import RoleController from '@/components/role/RoleController';
import RolePicker from '@/components/graph/RoleMode/RolePicker';
import ExplorePrompts from '@/components/graph/ExplorePrompts';
import FpsCounter from '@/components/graph/FpsCounter';

import { useGraphStore } from '@/lib/store/graph-store';
import { useSessionStore } from '@/lib/store/session-store';
import { useRoiStore } from '@/lib/store/roi-store';
import { usePresentationStore, type AppMode, type LensType } from '@/lib/store/presentation-store';
import { useCampaignStore } from '@/lib/store/campaign-store';
import { navigateToNode } from '@/lib/utils/camera-navigation';
import { decodeRoiConfig } from '@/lib/utils/roi-share';
import seedGraphData from '@/data/seed-graph.json';
import seedGraphFrontofficeData from '@/data/seed-graph-frontoffice.json';
import linearProcessData from '@/data/linear-process.json';
import linearProcessFrontofficeData from '@/data/linear-process-frontoffice.json';
import presentationStepsData from '@/data/presentation-steps.json';
import presentationStepsFrontofficeData from '@/data/presentation-steps-frontoffice.json';
import { GraphData, GraphNode, GraphLink, PresentationStep } from '@/lib/graph/types';

function buildLinearGraphData(
  data: typeof linearProcessData = linearProcessData,
  groupLabel = 'Content Lifecycle',
): GraphData {
  const nodes: GraphNode[] = data.steps.map((step) => ({
    id: step.id,
    type: 'step' as const,
    label: step.label,
    description: step.description,
    group: groupLabel,
    val: 8,
    fx: step.x,
    fy: 0,
    fz: 0,
  }));

  const links: GraphLink[] = [];
  for (let i = 0; i < data.steps.length - 1; i++) {
    links.push({
      source: data.steps[i].id,
      target: data.steps[i + 1].id,
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
  const { setSteps, mode, setMode, lens } = usePresentationStore();
  const campaignActive = useCampaignStore(s => s.isActive);
  const [rolePickerOpen, setRolePickerOpen] = useState(false);
  const prevModeRef = useRef(mode);
  const isMobile = useIsMobile();

  // Journey sequence tracking
  const journeyRef = useRef<string[] | null>(null);
  const [journeyIndex, setJourneyIndex] = useState(0);
  const currentNodeId = useCampaignStore(s => s.currentNodeId);
  const startCampaign = useCampaignStore(s => s.startCampaign);

  useEffect(() => {
    // Read initial mode from sessionStorage (set by landing page)
    let savedMode: 'guided' | 'explore' | 'campaign' | 'build' | 'roi' | 'role' | null = null;
    let savedLens: LensType = 'marketing';
    try {
      if (typeof window !== 'undefined') {
        savedMode = sessionStorage.getItem('initialMode') as typeof savedMode;
        const lensVal = sessionStorage.getItem('lens');
        if (lensVal === 'frontoffice') savedLens = 'frontoffice';
      }
    } catch {
      // sessionStorage may be disabled (e.g. private browsing, security policy)
    }

    // Read journey sequence if present
    try {
      if (typeof window !== 'undefined') {
        const journeyRaw = sessionStorage.getItem('journeySequence');
        if (journeyRaw) {
          journeyRef.current = JSON.parse(journeyRaw);
          sessionStorage.removeItem('journeySequence');
        }
      }
    } catch { /* ignore */ }

    // Check for ?roi= query parameter (shared ROI URL)
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const roiParam = params.get('roi');
        if (roiParam) {
          const config = decodeRoiConfig(roiParam);
          if (config) {
            savedMode = 'roi';
            useRoiStore.getState().importConfig(config);
            // Clean URL without reloading
            window.history.replaceState({}, '', window.location.pathname);
          }
        }
      }
    } catch { /* ignore invalid roi param */ }

    if (savedMode) {
      setMode(savedMode);
      try { sessionStorage.removeItem('initialMode'); } catch { /* ignore */ }
    }
    // Persist lens to store
    usePresentationStore.getState().setLens(savedLens);

    const activeMode = savedMode || mode;

    // Select graph + presentation data based on lens
    const fullData = savedLens === 'frontoffice'
      ? (seedGraphFrontofficeData as unknown as GraphData)
      : (seedGraphData as unknown as GraphData);
    const linearData = savedLens === 'frontoffice'
      ? buildLinearGraphData(linearProcessFrontofficeData, 'Customer Journey')
      : buildLinearGraphData();
    const steps = savedLens === 'frontoffice'
      ? (presentationStepsFrontofficeData as PresentationStep[])
      : (presentationStepsData as PresentationStep[]);

    setFullGraphData(fullData);
    setLinearGraphData(linearData);
    setSteps(steps);

    // Start with linear view in guided/roi mode, full graph in explore/campaign/build/role mode
    if (activeMode === 'guided' || activeMode === 'roi') {
      setGraphData(linearData);
    } else {
      setGraphData(fullData);
      if (activeMode === 'campaign') {
        startCampaign();
      }
      if (activeMode === 'role') {
        setRolePickerOpen(true);
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

  // Open role picker when entering role mode (ModeToggle clears the role,
  // so the picker must open for the user to select one)
  useEffect(() => {
    if (mode === 'role') {
      setRolePickerOpen(true);
    }
  }, [mode]);

  // Track previous mode for journey transitions
  useEffect(() => {
    prevModeRef.current = mode;
  }, [mode]);

  // Advance to next mode in the audience journey
  const advanceJourney = () => {
    const journey = journeyRef.current;
    if (!journey) return;
    const nextIdx = journeyIndex + 1;
    if (nextIdx < journey.length) {
      setJourneyIndex(nextIdx);
      // Use ModeToggle's logic by directly changing mode via presentation store
      // The ModeToggle handleModeChange takes care of camera/graph resets
      // But we need to trigger it — simplest approach: set mode and let the mode effect handle it
      const nextMode = journey[nextIdx] as AppMode;
      setMode(nextMode);
    } else {
      // Journey complete — clear it
      journeyRef.current = null;
    }
  };

  // Floating "Run a Campaign" CTA for explore mode
  const handleStartCampaign = () => {
    setMode('campaign');
    const { loadFullGraph } = useGraphStore.getState();
    loadFullGraph();
    startCampaign();
  };

  return (
    <div className="graph-page relative w-screen h-screen overflow-hidden">
      {/* Main 3D Graph — fills the layout, sits above crystalline bg */}
      <div className="absolute inset-0 z-10">
        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center h-screen gap-4">
              <div className="w-10 h-10 border-2 border-muted-foreground/20 border-t-primary rounded-full animate-spin" />
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-foreground/70">Preparing visualization...</p>
                <p className="text-xs text-muted-foreground/50">Loading 3D engine and graph data</p>
              </div>
            </div>
          }>
            <GraphScene />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* UI Overlays */}

      {/* Home button — back to jonn.ai */}
      <a
        href="https://jonn.ai"
        className="fixed top-4 left-4 z-50 p-2 rounded-full glass-panel text-muted-foreground hover:text-foreground transition-all"
        title="Back to jonn.ai"
      >
        <Home className="w-4 h-4" />
      </a>

      <ModeToggle />

      {/* Journey progress indicator + Next button */}
      {journeyRef.current && journeyRef.current.length > 1 && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[51] flex items-center gap-3 px-4 py-2 rounded-full glass-panel">
          <span className="text-[10px] text-muted-foreground/60">
            Journey: Step {journeyIndex + 1} of {journeyRef.current.length}
          </span>
          {journeyIndex < journeyRef.current.length - 1 && (
            <button
              onClick={advanceJourney}
              className="text-xs font-semibold text-[#14B8A6] hover:text-[#14B8A6]/80 transition-colors"
            >
              Next &rarr;
            </button>
          )}
        </div>
      )}

      {mode === 'guided' ? (
        <PresentationController />
      ) : mode === 'build' ? (
        <BuildController />
      ) : mode === 'roi' ? (
        <RoiController />
      ) : mode === 'campaign' ? (
        <>
          <CampaignPanel />
          <CampaignSummary />
          <ZoomControls />
        </>
      ) : mode === 'role' ? (
        <>
          <RoleController onChangeRole={() => setRolePickerOpen(true)} />
          <RolePicker
            open={rolePickerOpen}
            onClose={() => setRolePickerOpen(false)}
            isRoleMode
          />
        </>
      ) : (
        <>
          <GraphControls />
          <SearchBar />
          <ZoomControls />

          <NodeDetailPanel />

          {/* Discovery prompts — shown for first-time explorers */}
          {!useSessionStore.getState().guidedTourCompleted && (
            <ExplorePrompts />
          )}

          {/* Bottom CTA — Campaign */}
          <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 ${
            isMobile ? 'flex flex-col items-stretch gap-2 w-[calc(100%-2rem)]' : 'flex items-center gap-3'
          }`}>
            <button
              onClick={handleStartCampaign}
              className={`rounded-2xl glass-panel hover:shadow-lg hover:shadow-[#4CAF50]/10
                         transition-all duration-300 group ${isMobile ? 'px-4 py-2' : 'px-6 py-3'}`}
            >
              <div className="text-center">
                <p className={`font-semibold text-[#4CAF50] group-hover:text-[#66BB6A] transition-colors ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {'\u25B6'} {lens === 'frontoffice' ? 'Start a Journey' : 'Run a Campaign'}
                </p>
                {!isMobile && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {lens === 'frontoffice' ? 'Walk the customer journey end to end' : 'Walk through the workflow step by step'}
                  </p>
                )}
              </div>
            </button>
          </div>
        </>
      )}

      <FpsCounter />
    </div>
  );
}
