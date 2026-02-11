'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationStore } from '@/lib/store/presentation-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { useSessionStore } from '@/lib/store/session-store';
import { getGraphRef } from '@/lib/graph/graph-ref';
import { ChevronLeft, ChevronRight, Play, Pause, Compass, Mouse, Users, Layers } from 'lucide-react';
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

// Lifecycle stages shown on slides 1-3 as the "map everyone draws"
const PIPELINE_STAGES = [
  { label: 'Plan', icon: '\uD83C\uDFAF' },
  { label: 'Create', icon: '\u270F\uFE0F' },
  { label: 'Review', icon: '\u2714\uFE0F' },
  { label: 'Publish', icon: '\uD83D\uDE80' },
  { label: 'Measure', icon: '\uD83D\uDCCA' },
  { label: 'Optimize', icon: '\uD83D\uDD04' },
];

// Agents mapped to their primary pipeline stage for the 2D overlay on slide 3
const PIPELINE_AGENTS = [
  // Plan
  { id: 'research-agent', label: 'Research', stageIndex: 0 },
  { id: 'social-listening-agent', label: 'Social Listening', stageIndex: 0 },
  { id: 'journey-mapping-agent', label: 'Journey Mapping', stageIndex: 0 },
  // Create
  { id: 'writer-agent', label: 'Writer', stageIndex: 1 },
  { id: 'seo-agent', label: 'SEO', stageIndex: 1 },
  { id: 'visual-assets-agent', label: 'Visual Assets', stageIndex: 1 },
  // Review
  { id: 'legal-screening-agent', label: 'Legal Screening', stageIndex: 2 },
  { id: 'accessibility-agent', label: 'Accessibility', stageIndex: 2 },
  { id: 'privacy-agent', label: 'Privacy', stageIndex: 2 },
  // Publish
  { id: 'publishing-ops-agent', label: 'Publishing Ops', stageIndex: 3 },
  { id: 'localization-agent', label: 'Localization', stageIndex: 3 },
  { id: 'personalization-agent', label: 'Personalization', stageIndex: 3 },
  // Measure
  { id: 'performance-agent', label: 'Performance', stageIndex: 4 },
  { id: 'governance-agent', label: 'Governance', stageIndex: 4 },
  // Optimize
  { id: 'optimization-agent', label: 'Optimization', stageIndex: 5 },
  { id: 'repurposing-agent', label: 'Repurposing', stageIndex: 5 },
];

interface FlyingAgent {
  id: string;
  label: string;
  startX: number; // px from left
  startY: number; // px from top
}

// ─── Flying Agent Badge ───────────────────────────────────
// Pure CSS animation badge that flies from its pipeline position
// to viewport center, shrinking and fading as it converges.
// Uses CSS custom properties for per-badge positioning (no Framer Motion).
function FlyingAgentBadge({
  agent,
  index,
}: {
  agent: { id: string; label: string; startX: number; startY: number };
  index: number;
}) {
  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;

  return (
    <div
      className="flying-agent-badge"
      style={{
        '--start-x': `${agent.startX - 35}px`,
        '--start-y': `${agent.startY - 12}px`,
        '--dx': `${centerX - agent.startX}px`,
        '--dy': `${centerY - agent.startY}px`,
        '--delay': `${index * 0.04}s`,
      } as React.CSSProperties}
    >
      {agent.label}
    </div>
  );
}

export default function PresentationController() {
  const {
    currentStepIndex,
    steps,
    isPlaying,
    mode,
  } = usePresentationStore(
    useShallow((s) => ({
      currentStepIndex: s.currentStepIndex,
      steps: s.steps,
      isPlaying: s.isPlaying,
      mode: s.mode,
    }))
  );
  const setMode = usePresentationStore(s => s.setMode);
  const nextStep = usePresentationStore(s => s.nextStep);
  const prevStep = usePresentationStore(s => s.prevStep);
  const goToStep = usePresentationStore(s => s.goToStep);
  const toggleAutoPlay = usePresentationStore(s => s.toggleAutoPlay);
  const setTransitioning = usePresentationStore(s => s.setTransitioning);

  const {
    fullGraphData,
    linearGraphData,
  } = useGraphStore(
    useShallow((s) => ({
      fullGraphData: s.fullGraphData,
      linearGraphData: s.linearGraphData,
    }))
  );
  const setGraphData = useGraphStore(s => s.setGraphData);
  const highlightByTypes = useGraphStore(s => s.highlightByTypes);
  const highlightLinksByTypes = useGraphStore(s => s.highlightLinksByTypes);
  const clearHighlights = useGraphStore(s => s.clearHighlights);
  const resetFilters = useGraphStore(s => s.resetFilters);
  const loadFullGraph = useGraphStore(s => s.loadFullGraph);
  const setHighlightedNodeIds = useGraphStore(s => s.setHighlightedNodeIds);

  const currentStep = steps[currentStepIndex];
  const isTitleSlide = currentStep?.action === 'show-title-slide';
  const isPipelineSlide = currentStep?.id === 'act1-lifecycle' || currentStep?.id === 'act1-pain-points';
  const isTransitionSlide = currentStep?.id === 'act2-agents-and-context';
  const showPipelineOverlay = isTitleSlide || isPipelineSlide || isTransitionSlide;
  // Scrim stays high on slides 1-3 so the 2D overlay is the primary visual
  const scrimOpacity = isTitleSlide ? 0.95 : 0.90;
  const diagramOpacity = 1;

  // ─── Flying Agent Transition (slide 3→4) ─────────────────
  // When agents exit the pipeline overlay, spawn independent clones
  // that fly from their 2D column positions toward viewport center.
  const [flyingAgents, setFlyingAgents] = useState<FlyingAgent[] | null>(null);
  const prevStepIdRef = useRef<string | null>(null);

  // Track whether the full graph has been exploded already so
  // back-navigation doesn't restart the force simulation and scatter nodes.
  const hasExplodedRef = useRef(false);

  // Show interaction hint once when entering full-graph view
  const hintShownRef = useRef(false);
  const [showInteractionHint, setShowInteractionHint] = useState(false);
  useEffect(() => {
    if (!showPipelineOverlay && currentStepIndex > 0 && !hintShownRef.current) {
      hintShownRef.current = true;
      setShowInteractionHint(true);
      const timer = setTimeout(() => setShowInteractionHint(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [showPipelineOverlay, currentStepIndex]);

  // Detect slide 3→4 transition and spawn flying agent badges
  useEffect(() => {
    const prev = prevStepIdRef.current;
    prevStepIdRef.current = currentStep?.id ?? null;

    if (
      prev === 'act1-pain-points' &&
      currentStep?.id === 'act3-graph-reveal' &&
      !flyingAgents
    ) {
      // Calculate approximate screen position for each agent badge.
      // The pipeline is a centered flex row of 6 stage columns.
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Each stage column is ~80px wide (w-16 md:w-20) + gap spacer (~24px)
      // Total width ≈ 6 * 80 + 5 * 24 = 600px, centered
      const colWidth = vw < 768 ? 64 : 80;
      const gapWidth = vw < 768 ? 12 : 24;
      const totalWidth = 6 * colWidth + 5 * gapWidth;
      const startX = (vw - totalWidth) / 2;

      // The pipeline sits roughly at vertical center minus the y-offset
      // from the animate transform (y: -40 on slide 3). Agent badges are
      // below the stage boxes: ~64px (box) + ~20px (label) + ~20px (margin)
      // + connector line + stacked badges.
      const pipelineCenterY = vh / 2 - 40;
      const badgeStartY = pipelineCenterY + 70; // below stage label

      const agents: FlyingAgent[] = PIPELINE_AGENTS.map((agent) => {
        const stageAgentsBefore = PIPELINE_AGENTS.filter(
          (a) => a.stageIndex === agent.stageIndex
        );
        const indexInStack = stageAgentsBefore.indexOf(agent);

        // Column center x for this stage
        const colCenterX =
          startX + agent.stageIndex * (colWidth + gapWidth) + colWidth / 2;

        // Vertical offset: connector (16px) + each badge ~28px apart
        const y = badgeStartY + 16 + indexInStack * 28;

        return {
          id: agent.id,
          label: agent.label,
          startX: colCenterX,
          startY: y,
        };
      });

      setFlyingAgents(agents);

      // Clear after cascade (16 * 40ms = 640ms) + animation (1400ms) completes
      const clearTimer = setTimeout(() => {
        setFlyingAgents(null);
      }, 2100);

      return () => clearTimeout(clearTimer);
    }
  }, [currentStep?.id, flyingAgents]);

  const exitToExplore = useCallback(() => {
    clearHighlights();
    resetFilters();
    setMode('explore');
    loadFullGraph();
    useSessionStore.getState().setGuidedTourCompleted();
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
        // Going back to pipeline slides means next forward visit should re-explode
        hasExplodedRef.current = false;
        if (linearGraphData) {
          setGraphData({ ...linearGraphData });
        }
        break;
      }

      case 'show-process-chart':
      case 'show-teams-by-phase': {
        // Going back to pipeline slides means next forward visit should re-explode
        hasExplodedRef.current = false;
        clearHighlights();
        const chart = buildProcessChart();
        if (chart) setGraphData(chart);
        highlightLinksByTypes(['flows-to']);
        break;
      }

      // ─── Act 3: Full Graph Reveal ────────────────────────────
      case 'explode-to-graph': {
        clearHighlights();
        resetFilters();
        // Only explode on first visit — revisits keep settled node positions
        if (!hasExplodedRef.current) {
          loadExplodedGraph();
          hasExplodedRef.current = true;
        }
        break;
      }

      // ─── Act 4: Intelligence Layer ──────────────────────────
      case 'show-intelligence-vs-agents': {
        clearHighlights();
        highlightByTypes(['input', 'agent']);
        highlightLinksByTypes(['uses', 'performs']);
        break;
      }

      // ─── Act 5: Human Roles ──────────────────────────────────
      case 'show-human-roles': {
        clearHighlights();
        highlightByTypes(['gate', 'step']);
        highlightLinksByTypes(['reviews', 'escalates-to']);
        break;
      }

      case 'show-role-overview': {
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
      case 'show-operating-model': {
        clearHighlights();
        resetFilters();
        break;
      }
    }
  }, [mode, linearGraphData, fullGraphData, setGraphData, clearHighlights, resetFilters, highlightByTypes, highlightLinksByTypes, setHighlightedNodeIds, buildProcessChart, loadExplodedGraph]);

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
      {/* ─── Background Scrim + Pipeline Diagram (slides 1-3) ─ */}
      <AnimatePresence>
        {showPipelineOverlay && (
          <>
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

            <motion.div
              key="pipeline-diagram"
              className="fixed inset-0 z-[55] flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: diagramOpacity,
                y: isTitleSlide ? 30 : isTransitionSlide ? -80 : -40,
                scale: 1,
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
              {/* Agent badges below pipeline (slide 3 — "bolt agents on") */}
              <AnimatePresence>
                {isTransitionSlide && (
                  <motion.div
                    key="agent-badges"
                    className="flex items-start justify-center gap-0 mt-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {PIPELINE_STAGES.map((_, i, arr) => {
                      const stageAgents = PIPELINE_AGENTS.filter(a => a.stageIndex === i);
                      return (
                        <div key={`ac-${i}`} className="flex items-start">
                          <div className="w-16 md:w-20 flex flex-col items-center overflow-visible">
                            {stageAgents.length > 0 ? (
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-px h-2 bg-[#5B9ECF]/40" />
                                {stageAgents.map((agent, j) => (
                                  <motion.div
                                    key={agent.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + j * 0.15 }}
                                    className="px-1.5 py-0.5 rounded-md bg-[#5B9ECF]/10 border border-[#5B9ECF]/25 text-[9px] font-medium text-[#5B9ECF] whitespace-nowrap"
                                  >
                                    {agent.label}
                                  </motion.div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                          {i < arr.length - 1 && (
                            <div className="mx-1 md:mx-2 w-4 md:w-6 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
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
          </>
        )}
      </AnimatePresence>

      {/* ─── Flying Agent Badges (slide 3→4 transition) ─────── */}
      {/* z-[60] so badges render above the exiting pipeline (z-[55]) */}
      {flyingAgents && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          {flyingAgents.map((agent, i) => (
            <FlyingAgentBadge key={agent.id} agent={agent} index={i} />
          ))}
        </div>
      )}

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
                  The Marketing Campaign Lifecycle
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
              >
                Understanding the organizational intelligence layer to unlock agentic capabilities
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
      {/* Single AnimatePresence keyed on step id — flattened from nested wrappers */}
      <AnimatePresence mode="wait">
        {!isTitleSlide && (
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className={`fixed left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 ${
              showPipelineOverlay ? 'bottom-20' : 'bottom-24'
            }`}
          >
            <div className="glass-panel rounded-2xl p-6 shadow-2xl">
              <h2 className="text-lg font-semibold text-primary mb-2 font-[family-name:var(--font-playfair)]">
                {currentStep.title}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {currentStep.narration}
              </p>

              {/* End-of-tour CTA — only on last slide */}
              {currentStepIndex === steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="mt-4 pt-4 border-t border-muted-foreground/10"
                >
                  <p className="text-xs text-muted-foreground/70 mb-3">
                    Explore the organizational intelligence layer and see the impact per role
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={exitToExplore}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all hover:shadow-lg bg-[#9B7ACC]/10 text-[#9B7ACC] hover:bg-[#9B7ACC]/20"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      Explore the Graph
                    </button>
                    <button
                      onClick={exitToExplore}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all hover:shadow-lg bg-[#C9A04E]/10 text-[#C9A04E] hover:bg-[#C9A04E]/20"
                    >
                      <Users className="w-3.5 h-3.5" />
                      Impact Per Role
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interaction hint — appears once on first full-graph slide */}
      <AnimatePresence>
        {showInteractionHint && (
          <motion.div
            key="interaction-hint"
            className="fixed top-16 right-6 z-[60] flex items-center gap-3 px-4 py-2.5 rounded-full glass-panel pointer-events-none"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: 3, duration: 1.2, ease: 'easeInOut' }}
            >
              <Mouse className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <span className="text-xs text-muted-foreground">
              Scroll to zoom · Drag to rotate
            </span>
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
