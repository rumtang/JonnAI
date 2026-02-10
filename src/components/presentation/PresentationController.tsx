'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationStore } from '@/lib/store/presentation-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { getGraphRef } from '@/lib/graph/graph-ref';
import { ChevronLeft, ChevronRight, Play, Pause, Compass } from 'lucide-react';
import { GraphNode, GraphLink, StepMeta } from '@/lib/graph/types';

// ─── Process Chart Layout ────────────────────────────────────
// Positions 12 step nodes in 6 phase columns for a traditional
// left-to-right process chart feel on slides 2-3.
const PROCESS_CHART_LAYOUT: Record<string, { fx: number; fy: number; fz: number }> = {
  // Plan column (x = -500)
  'receive-request':   { fx: -500, fy:  200, fz: 0 },
  'research-insights': { fx: -500, fy:    0, fz: 0 },
  'write-brief':       { fx: -500, fy: -200, fz: 0 },
  // Create column (x = -300)
  'draft-content':     { fx: -300, fy:  100, fz: 0 },
  'seo-optimization':  { fx: -300, fy: -100, fz: 0 },
  // Review column (x = -100)
  'brand-compliance':  { fx: -100, fy:  100, fz: 0 },
  'final-edit':        { fx: -100, fy: -100, fz: 0 },
  // Publish column (x = 100)
  'schedule-publish':  { fx:  100, fy:  100, fz: 0 },
  'distribute':        { fx:  100, fy: -100, fz: 0 },
  // Measure column (x = 300)
  'track-performance': { fx:  300, fy:  100, fz: 0 },
  'generate-report':   { fx:  300, fy: -100, fz: 0 },
  // Optimize column (x = 500)
  'optimize':          { fx:  500, fy:    0, fz: 0 },
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

// Agent positions below their primary phase column — spaced for expanded layout
const AGENT_CHART_POSITIONS: Record<string, { fx: number; fy: number; fz: number }> = {
  'research-agent':    { fx: -500, fy: -350, fz: 0 },
  'writer-agent':      { fx: -350, fy: -350, fz: 0 },
  'seo-agent':         { fx: -250, fy: -350, fz: 0 },
  'performance-agent': { fx:  300, fy: -350, fz: 0 },
};

// One primary performs link per agent
const AGENT_PRIMARY_LINKS: Array<[string, string]> = [
  ['research-agent',    'research-insights'],
  ['writer-agent',      'draft-content'],
  ['seo-agent',         'seo-optimization'],
  ['performance-agent', 'track-performance'],
];

// Lifecycle stages shown on slides 1-3 as the "map everyone draws"
const PIPELINE_STAGES = [
  { label: 'Plan', icon: '\uD83C\uDFAF' },
  { label: 'Create', icon: '\u270F\uFE0F' },
  { label: 'Review', icon: '\u2714\uFE0F' },
  { label: 'Publish', icon: '\uD83D\uDE80' },
  { label: 'Measure', icon: '\uD83D\uDCCA' },
  { label: 'Optimize', icon: '\uD83D\uDD04' },
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
  const isTitleSlide = currentStep?.action === 'show-title-slide';
  const isPipelineSlide = currentStep?.id === 'act1-lifecycle';
  const isTransitionSlide = currentStep?.id === 'act2-agents-and-context';
  const showPipelineOverlay = isTitleSlide || isPipelineSlide || isTransitionSlide;
  // Scrim opacity: fully opaque on title, high on pipeline, medium on transition
  const scrimOpacity = isTitleSlide ? 0.95 : isPipelineSlide ? 0.90 : 0.55;
  // Diagram fades on the transition slide to let the 3D graph emerge
  const diagramOpacity = isTransitionSlide ? 0.4 : 1;

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

  // Helper: build process chart with pinned step nodes + flows-to links
  const buildProcessChart = useCallback(() => {
    if (!fullGraphData) return null;
    const stepNodes: GraphNode[] = fullGraphData.nodes
      .filter(n => n.type === 'step')
      .map(n => {
        const pos = PROCESS_CHART_LAYOUT[n.id];
        if (!pos) return { ...n };
        return { ...n, fx: pos.fx, fy: pos.fy, fz: pos.fz };
      });
    const stepLinks: GraphLink[] = PROCESS_CHART_LINKS.map(([src, tgt]) => ({
      source: src,
      target: tgt,
      type: 'flows-to' as const,
      particles: 2,
    }));
    return { nodes: stepNodes, links: stepLinks };
  }, [fullGraphData]);

  // Helper: build process chart with agents below
  const buildProcessChartWithAgents = useCallback(() => {
    if (!fullGraphData) return null;
    const stepNodes: GraphNode[] = fullGraphData.nodes
      .filter(n => n.type === 'step')
      .map(n => {
        const pos = PROCESS_CHART_LAYOUT[n.id];
        if (!pos) return { ...n };
        return { ...n, fx: pos.fx, fy: pos.fy, fz: pos.fz };
      });
    const agentNodes: GraphNode[] = fullGraphData.nodes
      .filter(n => n.type === 'agent')
      .map(n => {
        const pos = AGENT_CHART_POSITIONS[n.id];
        if (!pos) return { ...n };
        return { ...n, fx: pos.fx, fy: pos.fy, fz: pos.fz };
      });
    const stepLinks: GraphLink[] = PROCESS_CHART_LINKS.map(([src, tgt]) => ({
      source: src,
      target: tgt,
      type: 'flows-to' as const,
      particles: 2,
    }));
    const agentLinks: GraphLink[] = AGENT_PRIMARY_LINKS.map(([src, tgt]) => ({
      source: src,
      target: tgt,
      type: 'performs' as const,
      particles: 2,
    }));
    return {
      nodes: [...stepNodes, ...agentNodes],
      links: [...stepLinks, ...agentLinks],
    };
  }, [fullGraphData]);

  // Helper: load full graph with force-directed layout (unpin all nodes)
  const loadExplodedGraph = useCallback(() => {
    if (!fullGraphData) return;
    setGraphData({
      nodes: fullGraphData.nodes.map(n => ({ ...n, fx: undefined, fy: undefined, fz: undefined })),
      links: [...fullGraphData.links],
    });
  }, [fullGraphData, setGraphData]);

  const executeStepAction = useCallback((action?: string) => {
    if (!action) return;
    if (mode !== 'guided') return;

    switch (action) {
      // ─── Act 1: Linear Pipeline ──────────────────────────────
      case 'show-title-slide': {
        if (linearGraphData) {
          setGraphData({ ...linearGraphData });
        }
        break;
      }

      case 'show-linear':
      case 'show-linear-pipeline': {
        clearHighlights();
        const chart = buildProcessChart();
        if (chart) setGraphData(chart);
        break;
      }

      case 'show-process-chart':
      case 'show-teams-by-phase': {
        clearHighlights();
        const chart = buildProcessChart();
        if (chart) setGraphData(chart);
        highlightLinksByTypes(['flows-to']);
        break;
      }

      case 'show-detailed-steps': {
        clearHighlights();
        const chart = buildProcessChart();
        if (chart) setGraphData(chart);
        break;
      }

      // ─── Act 2: Agents ───────────────────────────────────────
      case 'show-process-with-agents':
      case 'show-agents-on-pipeline': {
        clearHighlights();
        const chartWithAgents = buildProcessChartWithAgents();
        if (chartWithAgents) setGraphData(chartWithAgents);
        highlightByTypes(['agent']);
        highlightLinksByTypes(['performs']);
        break;
      }

      case 'show-agents-grounded':
      case 'show-agent-dependencies': {
        // Show the step pipeline with input nodes floating around it,
        // connected by 'uses' links — the context layer agents depend on
        clearHighlights();
        if (!fullGraphData) break;
        const stepNodesD: GraphNode[] = fullGraphData.nodes
          .filter(n => n.type === 'step')
          .map(n => {
            const pos = PROCESS_CHART_LAYOUT[n.id];
            if (!pos) return { ...n };
            return { ...n, fx: pos.fx, fy: pos.fy, fz: pos.fz };
          });
        const inputNodes: GraphNode[] = fullGraphData.nodes
          .filter(n => n.type === 'input');
        const stepLinks: GraphLink[] = PROCESS_CHART_LINKS.map(([src, tgt]) => ({
          source: src,
          target: tgt,
          type: 'flows-to' as const,
          particles: 2,
        }));
        const usesLinks: GraphLink[] = fullGraphData.links
          .filter(l => l.type === 'uses');
        setGraphData({
          nodes: [...stepNodesD, ...inputNodes],
          links: [...stepLinks, ...usesLinks],
        });
        highlightByTypes(['input']);
        highlightLinksByTypes(['uses']);
        break;
      }

      // ─── Act 3: Full Graph Reveal ────────────────────────────
      case 'explode':
      case 'explode-to-graph': {
        clearHighlights();
        resetFilters();
        loadExplodedGraph();
        break;
      }

      case 'highlight-knowledge-layer':
      case 'highlight-gates': {
        clearHighlights();
        highlightByTypes(['gate']);
        highlightLinksByTypes(['reviews', 'escalates-to', 'returns-to']);
        break;
      }

      case 'show-feedback-loops': {
        clearHighlights();
        highlightLinksByTypes(['returns-to', 'escalates-to', 'flows-to']);
        break;
      }

      // ─── Act 4: Infrastructure ───────────────────────────────
      case 'show-knowledge-layer': {
        clearHighlights();
        highlightByTypes(['input']);
        highlightLinksByTypes(['uses']);
        break;
      }

      case 'show-infrastructure-vs-agents': {
        clearHighlights();
        highlightByTypes(['input', 'agent']);
        highlightLinksByTypes(['uses', 'performs']);
        break;
      }

      case 'show-structured-context': {
        clearHighlights();
        break;
      }

      // ─── Act 5: Human Roles ──────────────────────────────────
      case 'show-human-roles':
      case 'show-human-elevation': {
        clearHighlights();
        highlightByTypes(['gate', 'step']);
        highlightLinksByTypes(['reviews', 'escalates-to']);
        break;
      }

      case 'show-emerging-roles': {
        clearHighlights();
        highlightByTypes(['step', 'gate', 'input']);
        highlightLinksByTypes(['uses', 'reviews']);
        break;
      }

      case 'show-role-overview':
      case 'show-role-explorer': {
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

      // ─── Act 6: Strategic ────────────────────────────────────
      case 'show-investment-thesis': {
        clearHighlights();
        highlightByTypes(['input', 'agent']);
        highlightLinksByTypes(['uses']);
        break;
      }

      case 'show-operating-model':
      case 'full-reveal': {
        clearHighlights();
        resetFilters();
        break;
      }

      case 'full-explore': {
        clearHighlights();
        resetFilters();
        break;
      }

      case 'show-team-connections': {
        clearHighlights();
        highlightByTypes(['gate', 'step']);
        highlightLinksByTypes(['reviews', 'returns-to', 'escalates-to']);
        break;
      }
    }
  }, [mode, linearGraphData, fullGraphData, setGraphData, clearHighlights, resetFilters, highlightByTypes, highlightLinksByTypes, setHighlightedNodeIds, buildProcessChart, buildProcessChartWithAgents, loadExplodedGraph]);

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
      {/* ─── Background Scrim (slides 1-3) ──────────────────── */}
      <AnimatePresence>
        {showPipelineOverlay && (
          <motion.div
            key="scrim"
            className="fixed inset-0 z-[45] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: scrimOpacity }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-background backdrop-blur-sm" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Pipeline Diagram (slides 1-3, persistent layer) ── */}
      <AnimatePresence>
        {showPipelineOverlay && (
          <motion.div
            key="pipeline-diagram"
            className="fixed inset-0 z-[55] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: diagramOpacity,
              y: isTitleSlide ? 30 : -40,
              scale: isTransitionSlide ? 0.85 : 1,
            }}
            exit={{ opacity: 0, scale: 0.9, y: -60 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col items-center">
              {/* Lifecycle stages */}
              <div className="flex items-center justify-center gap-0">
                {PIPELINE_STAGES.map((stage, i, arr) => (
                  <div key={stage.label} className="flex items-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl glass-panel flex items-center justify-center text-xl md:text-2xl">
                        {stage.icon}
                      </div>
                      <span className="text-xs font-medium text-foreground">
                        {stage.label}
                      </span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="mx-1.5 md:mx-3 flex items-center -mt-6">
                        <div className="w-6 md:w-10 h-0.5 bg-gradient-to-r from-[#C9A04E] to-[#5B9ECF]" />
                        <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-[#5B9ECF]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Feedback loop arc: Optimize → Strategy */}
              <svg className="w-[85%] mt-3" height="20" viewBox="0 0 100 20" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="feedback-arc" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#9B7ACC" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#C9A04E" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                <path d="M 88 2 C 88 16, 12 16, 12 2" fill="none" stroke="url(#feedback-arc)" strokeWidth="0.8" strokeDasharray="3 2" />
                <polygon points="12,0 10,4 14,4" fill="#C9A04E" opacity="0.5" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Title Content (slide 1 only) ─────────────────── */}
      <AnimatePresence>
        {isTitleSlide && (
          <motion.div
            key="title-content"
            className="fixed inset-0 z-[60] flex flex-col items-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Title block positioned above the pipeline diagram */}
            <div className="text-center max-w-4xl px-8 mt-[18vh]">
              {/* Pill badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <span className="px-4 py-1.5 rounded-full text-xs font-medium glass-panel text-primary">
                  Guided Presentation
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold mb-4 leading-tight font-[family-name:var(--font-playfair)]"
              >
                <span className="bg-gradient-to-r from-[#C9A04E] via-[#5B9ECF] to-[#9B7ACC] bg-clip-text text-transparent">
                  The Content Production Lifecycle
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
              >
                Every team tells the same story: a clean, linear pipeline.
                But what does the process really look like?
              </motion.p>
            </div>

            {/* Prompt at bottom */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="absolute bottom-32 text-sm text-muted-foreground/60"
            >
              Press {'\u2192'} or click Next to begin
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Narration Card (slides 2+) ───────────────────── */}
      <AnimatePresence mode="wait">
        {!isTitleSlide && (
          <motion.div
            key="narration"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4 }}
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
        )}
      </AnimatePresence>

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
