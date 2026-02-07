'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationStore } from '@/lib/store/presentation-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { getGraphRef } from '@/lib/graph/graph-ref';
import { ChevronLeft, ChevronRight, Play, Pause, Compass } from 'lucide-react';
import { GraphNode, GraphLink, StepMeta } from '@/lib/graph/types';

// ─── Process Chart Layout ────────────────────────────────────
// Positions 12 step nodes in 5 phase columns for a traditional
// left-to-right process chart feel on slides 2-3.
const PROCESS_CHART_LAYOUT: Record<string, { fx: number; fy: number; fz: number }> = {
  // Brief column (x = -400)
  'receive-request':   { fx: -400, fy:  80, fz: 0 },
  'research-insights': { fx: -400, fy:   0, fz: 0 },
  'write-brief':       { fx: -400, fy: -80, fz: 0 },
  // Creation column (x = -200)
  'draft-content':     { fx: -200, fy:  40, fz: 0 },
  'seo-optimization':  { fx: -200, fy: -40, fz: 0 },
  // Review column (x = 0)
  'brand-compliance':  { fx:    0, fy:  40, fz: 0 },
  'final-edit':        { fx:    0, fy: -40, fz: 0 },
  // Publish column (x = 200)
  'schedule-publish':  { fx:  200, fy:  40, fz: 0 },
  'distribute':        { fx:  200, fy: -40, fz: 0 },
  // Measure column (x = 400)
  'track-performance': { fx:  400, fy:  80, fz: 0 },
  'generate-report':   { fx:  400, fy:   0, fz: 0 },
  'optimize':          { fx:  400, fy: -80, fz: 0 },
};

// Sequential step-to-step flows (no gates, no feedback loops)
const PROCESS_CHART_LINKS: Array<[string, string]> = [
  ['receive-request',   'research-insights'],
  ['research-insights', 'write-brief'],
  ['write-brief',       'draft-content'],
  ['draft-content',     'seo-optimization'],
  ['seo-optimization',  'brand-compliance'],
  ['brand-compliance',  'final-edit'],
  ['final-edit',        'schedule-publish'],
  ['schedule-publish',  'distribute'],
  ['distribute',        'track-performance'],
  ['track-performance', 'generate-report'],
  ['generate-report',   'optimize'],
];

// Agent positions below their primary phase column
const AGENT_CHART_POSITIONS: Record<string, { fx: number; fy: number; fz: number }> = {
  'research-agent':    { fx: -400, fy: -180, fz: 0 },
  'writer-agent':      { fx: -250, fy: -180, fz: 0 },
  'seo-agent':         { fx: -150, fy: -180, fz: 0 },
  'performance-agent': { fx:  400, fy: -180, fz: 0 },
};

// One primary performs link per agent
const AGENT_PRIMARY_LINKS: Array<[string, string]> = [
  ['research-agent',    'research-insights'],
  ['writer-agent',      'draft-content'],
  ['seo-agent',         'seo-optimization'],
  ['performance-agent', 'track-performance'],
];

export default function PresentationController() {
  const {
    currentStepIndex,
    steps,
    isPlaying,
    mode,
    setMode,
    nextStep,
    prevStep,
    goToStep,
    toggleAutoPlay,
    setTransitioning,
  } = usePresentationStore();

  const {
    setGraphData,
    fullGraphData,
    linearGraphData,
    highlightByTypes,
    highlightLinksByTypes,
    clearHighlights,
    resetFilters,
    loadFullGraph,
    setHighlightedNodeIds,
  } = useGraphStore();

  const currentStep = steps[currentStepIndex];

  const exitToExplore = useCallback(() => {
    clearHighlights();
    resetFilters();
    setMode('explore');
    loadFullGraph();
  }, [clearHighlights, resetFilters, setMode, loadFullGraph]);

  // Fly camera to the position defined in the current presentation step
  const moveCamera = useCallback((step: typeof currentStep) => {
    if (!step?.cameraPosition) return;
    const fg = getGraphRef();
    if (!fg) return;

    const pos = step.cameraPosition;
    const lookAt = step.cameraLookAt ?? undefined;
    const ms = step.cameraTransitionMs || 2000;

    fg.cameraPosition(pos, lookAt, ms);
  }, []);

  const executeStepAction = useCallback((action?: string) => {
    if (!action) return;
    if (mode !== 'guided') return;

    switch (action) {
      case 'show-linear': {
        if (linearGraphData) {
          setGraphData({ ...linearGraphData });
        }
        break;
      }

      case 'show-process-chart': {
        if (!fullGraphData) break;
        // Filter to step nodes only, pin them in process chart columns
        const stepNodes: GraphNode[] = fullGraphData.nodes
          .filter(n => n.type === 'step')
          .map(n => {
            const pos = PROCESS_CHART_LAYOUT[n.id];
            if (!pos) return { ...n };
            return { ...n, fx: pos.fx, fy: pos.fy, fz: pos.fz };
          });
        // Build sequential step-to-step links (no gates)
        const stepLinks: GraphLink[] = PROCESS_CHART_LINKS.map(([src, tgt]) => ({
          source: src,
          target: tgt,
          type: 'flows-to' as const,
          particles: 2,
        }));
        setGraphData({ nodes: stepNodes, links: stepLinks });
        break;
      }

      case 'show-process-with-agents': {
        if (!fullGraphData) break;
        // Step nodes pinned in process chart columns
        const pcStepNodes: GraphNode[] = fullGraphData.nodes
          .filter(n => n.type === 'step')
          .map(n => {
            const pos = PROCESS_CHART_LAYOUT[n.id];
            if (!pos) return { ...n };
            return { ...n, fx: pos.fx, fy: pos.fy, fz: pos.fz };
          });
        // Agent nodes pinned below their phase columns
        const pcAgentNodes: GraphNode[] = fullGraphData.nodes
          .filter(n => n.type === 'agent')
          .map(n => {
            const pos = AGENT_CHART_POSITIONS[n.id];
            if (!pos) return { ...n };
            return { ...n, fx: pos.fx, fy: pos.fy, fz: pos.fz };
          });
        // Step-to-step links
        const pcStepLinks: GraphLink[] = PROCESS_CHART_LINKS.map(([src, tgt]) => ({
          source: src,
          target: tgt,
          type: 'flows-to' as const,
          particles: 2,
        }));
        // Agent performs links
        const pcAgentLinks: GraphLink[] = AGENT_PRIMARY_LINKS.map(([src, tgt]) => ({
          source: src,
          target: tgt,
          type: 'performs' as const,
          particles: 2,
        }));
        setGraphData({
          nodes: [...pcStepNodes, ...pcAgentNodes],
          links: [...pcStepLinks, ...pcAgentLinks],
        });
        break;
      }

      case 'explode': {
        clearHighlights();
        resetFilters();
        if (fullGraphData) {
          setGraphData({
            nodes: fullGraphData.nodes.map(n => ({ ...n, fx: undefined, fy: undefined, fz: undefined })),
            links: [...fullGraphData.links],
          });
        }
        break;
      }

      case 'highlight-knowledge-layer':
        clearHighlights();
        highlightByTypes(['gate']);
        highlightLinksByTypes(['reviews', 'escalates-to', 'returns-to']);
        break;

      case 'show-agents-grounded':
        clearHighlights();
        highlightByTypes(['agent', 'input']);
        highlightLinksByTypes(['uses']);
        break;

      case 'show-human-roles':
        clearHighlights();
        highlightByTypes(['gate', 'step']);
        highlightLinksByTypes(['returns-to', 'escalates-to']);
        break;

      case 'full-reveal':
        clearHighlights();
        resetFilters();
        break;

      case 'show-role-overview': {
        // Highlight step nodes with human or shared ownership, dim agent-only steps
        clearHighlights();
        if (!fullGraphData) break;
        const humanStepIds = new Set(
          fullGraphData.nodes
            .filter(n => {
              if (n.type !== 'step') return false;
              const meta = n.meta as StepMeta | undefined;
              return meta?.owner === 'human' || meta?.owner === 'shared';
            })
            .map(n => n.id)
        );
        setHighlightedNodeIds(humanStepIds);
        break;
      }

      case 'show-team-connections': {
        // Highlight gates and human review/escalation connections
        clearHighlights();
        highlightByTypes(['gate', 'step']);
        highlightLinksByTypes(['reviews', 'returns-to', 'escalates-to']);
        break;
      }
    }
  }, [mode, linearGraphData, fullGraphData, setGraphData, clearHighlights, resetFilters, highlightByTypes, highlightLinksByTypes, setHighlightedNodeIds]);

  // Execute step action + camera when step changes
  useEffect(() => {
    if (!currentStep) return;
    if (mode !== 'guided') return;
    executeStepAction(currentStep.action);
    moveCamera(currentStep);

    const timer = setTimeout(() => {
      setTransitioning(false);
    }, currentStep.cameraTransitionMs || 2000);

    return () => clearTimeout(timer);
  }, [currentStepIndex, currentStep, mode, executeStepAction, moveCamera, setTransitioning]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextStep, prevStep]);

  // Auto-play
  useEffect(() => {
    if (!isPlaying || !currentStep) return;
    const duration = currentStep.duration || 6000;
    const timer = setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        nextStep();
      } else {
        toggleAutoPlay();
      }
    }, duration);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, currentStep, steps.length, nextStep, toggleAutoPlay]);

  if (!currentStep) return null;

  return (
    <>
      {/* Narration Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="glass-panel rounded-2xl p-6 shadow-2xl"
          >
            <h2 className="text-lg font-semibold text-primary mb-2 font-[family-name:var(--font-playfair)]">
              {currentStep.title}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {currentStep.narration}
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Navigation Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4"
      >
        {/* Previous */}
        <button
          onClick={prevStep}
          disabled={currentStepIndex === 0}
          className="p-2 rounded-full glass-panel text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Step dots */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel">
          {steps.map((step, i) => (
            <button
              key={step.id}
              onClick={() => goToStep(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentStepIndex
                  ? 'w-6 bg-[#C9A04E]'
                  : i < currentStepIndex
                  ? 'bg-[#C9A04E]/50'
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        {/* Play/Pause */}
        <button
          onClick={toggleAutoPlay}
          className="p-2 rounded-full glass-panel text-muted-foreground hover:text-foreground transition-all"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        {/* Next */}
        <button
          onClick={nextStep}
          disabled={currentStepIndex === steps.length - 1}
          className="p-2 rounded-full glass-panel text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Exit to Explore */}
        <button
          onClick={exitToExplore}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full glass-panel text-muted-foreground hover:text-[#9B7ACC] transition-all text-xs font-medium"
          title="Exit to free explore mode"
        >
          <Compass className="w-4 h-4" />
          <span>Explore</span>
        </button>
      </motion.div>

      {/* Step counter */}
      <div className="fixed bottom-6 right-4 z-50 text-xs text-muted-foreground font-mono">
        {currentStepIndex + 1} / {steps.length}
      </div>
    </>
  );
}
