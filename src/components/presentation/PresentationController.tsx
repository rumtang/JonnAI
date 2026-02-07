'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationStore } from '@/lib/store/presentation-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { getGraphRef } from '@/lib/graph/graph-ref';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import linearProcessData from '@/data/linear-process.json';
import { GraphNode, GraphLink } from '@/lib/graph/types';

export default function PresentationController() {
  const {
    currentStepIndex,
    steps,
    isPlaying,
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
  } = useGraphStore();

  const currentStep = steps[currentStepIndex];

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

  // Execute step action + camera when step changes
  useEffect(() => {
    if (!currentStep) return;
    executeStepAction(currentStep.action);
    moveCamera(currentStep);

    const timer = setTimeout(() => {
      setTransitioning(false);
    }, currentStep.cameraTransitionMs || 2000);

    return () => clearTimeout(timer);
  }, [currentStepIndex, currentStep]);

  const executeStepAction = useCallback((action?: string) => {
    if (!action) return;

    switch (action) {
      case 'fade-in':
        if (linearGraphData) {
          setGraphData({ nodes: [], links: [] });
        }
        break;

      case 'show-linear': {
        if (linearGraphData) {
          setGraphData({ ...linearGraphData });
        }
        break;
      }

      case 'show-agents': {
        // Add agents below the linear steps
        if (!linearGraphData) break;
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
        setGraphData({
          nodes: [...(linearGraphData.nodes), ...agentNodes],
          links: [...(linearGraphData.links), ...agentLinks],
        });
        break;
      }

      case 'show-cross-links': {
        // Show the linear view with cross-connections (feedback loops)
        if (!linearGraphData) break;
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
        }));
        // Cross-connections showing feedback loops
        const crossLinks: GraphLink[] = [
          { source: 'ls-measure', target: 'ls-brief', type: 'returns-to' as const, particles: 3 },
          { source: 'ls-measure', target: 'ls-creation', type: 'flows-to' as const, particles: 3 },
          { source: 'ls-review', target: 'ls-creation', type: 'returns-to' as const, particles: 2 },
        ];
        setGraphData({
          nodes: [...linearGraphData.nodes, ...agentNodes],
          links: [...linearGraphData.links, ...agentLinks, ...crossLinks],
        });
        break;
      }

      case 'explode': {
        // Load the full graph
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
    }
  }, [linearGraphData, fullGraphData, setGraphData, clearHighlights, resetFilters, highlightByTypes, highlightLinksByTypes]);

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
            className="bg-black/70 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl"
          >
            <h2 className="text-lg font-semibold text-cyan-300 mb-2">
              {currentStep.title}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
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
          className="p-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Step dots */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10">
          {steps.map((step, i) => (
            <button
              key={step.id}
              onClick={() => goToStep(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentStepIndex
                  ? 'w-6 bg-cyan-400'
                  : i < currentStepIndex
                  ? 'bg-cyan-400/50'
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Play/Pause */}
        <button
          onClick={toggleAutoPlay}
          className="p-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-slate-300 hover:text-white transition-all"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        {/* Next */}
        <button
          onClick={nextStep}
          disabled={currentStepIndex === steps.length - 1}
          className="p-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Step counter */}
      <div className="fixed bottom-6 right-4 z-50 text-xs text-slate-500 font-mono">
        {currentStepIndex + 1} / {steps.length}
      </div>
    </>
  );
}
