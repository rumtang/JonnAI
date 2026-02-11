'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Compass, Network } from 'lucide-react';
import { useBuildStore } from '@/lib/store/build-store';
import { usePresentationStore } from '@/lib/store/presentation-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { useIsMobile } from '@/lib/hooks/use-is-mobile';
import { BUILD_STEPS } from '@/data/build-steps';
import { getGraphRef } from '@/lib/graph/graph-ref';
import TitleSlide from './slides/TitleSlide';
import TimelineSlide from './slides/TimelineSlide';
import LayerCardsSlide from './slides/LayerCardsSlide';
import HubSpokeSlide from './slides/HubSpokeSlide';
import TierStackSlide from './slides/TierStackSlide';
import GanttSlide from './slides/GanttSlide';

// ─── Act Definitions ────────────────────────────────────────
// Group slides by act for the navigation bar
const ACTS = [
  { label: 'The Vision', slides: [0, 1] },
  { label: 'What to Gather', slides: [2, 3, 4, 5, 6] },
  { label: 'The Architecture', slides: [7, 8] },
  { label: 'The Build', slides: [9] },
];

export default function BuildController() {
  const currentStepIndex = useBuildStore(s => s.currentStepIndex);
  const expandedCards = useBuildStore(s => s.expandedCards);
  const expandedDomain = useBuildStore(s => s.expandedDomain);
  const nextStep = useBuildStore(s => s.nextStep);
  const prevStep = useBuildStore(s => s.prevStep);
  const goToStep = useBuildStore(s => s.goToStep);
  const toggleCard = useBuildStore(s => s.toggleCard);
  const setExpandedDomain = useBuildStore(s => s.setExpandedDomain);

  const setMode = usePresentationStore(s => s.setMode);
  const loadFullGraph = useGraphStore(s => s.loadFullGraph);
  const setHighlightedNodeIds = useGraphStore(s => s.setHighlightedNodeIds);
  const clearHighlights = useGraphStore(s => s.clearHighlights);
  const resetFilters = useGraphStore(s => s.resetFilters);

  const isMobile = useIsMobile();
  const [graphPeek, setGraphPeek] = useState(false);
  const step = BUILD_STEPS[currentStepIndex];

  // Highlight related graph nodes when build step changes
  useEffect(() => {
    const currentStep = BUILD_STEPS[currentStepIndex];
    if (currentStep?.relatedNodeIds?.length) {
      setHighlightedNodeIds(new Set(currentStep.relatedNodeIds));
    } else {
      clearHighlights();
    }
    return () => clearHighlights();
  }, [currentStepIndex, setHighlightedNodeIds, clearHighlights]);

  // Reset graph peek when step changes
  useEffect(() => {
    setGraphPeek(false);
  }, [currentStepIndex]);

  // Fly camera to centroid of highlighted nodes when peeking
  useEffect(() => {
    if (!graphPeek) return;

    // Ensure full graph is loaded — build mode may have started with linear view
    useGraphStore.getState().loadFullGraph();

    const graphInstance = getGraphRef();
    if (!graphInstance) return;

    const currentStep = BUILD_STEPS[currentStepIndex];
    if (!currentStep?.relatedNodeIds?.length) return;

    const { graphData } = useGraphStore.getState();
    const relatedNodes = graphData.nodes.filter(n =>
      currentStep.relatedNodeIds!.includes(n.id)
    );

    // Compute centroid of highlighted nodes
    let cx = 0, cy = 0, cz = 0, count = 0;
    for (const node of relatedNodes) {
      if (node.x !== undefined && node.y !== undefined && node.z !== undefined) {
        cx += node.x;
        cy += node.y;
        cz += node.z;
        count++;
      }
    }
    if (count === 0) return;
    cx /= count;
    cy /= count;
    cz /= count;

    // Fly camera to show highlighted nodes
    const lookAt = { x: cx, y: cy, z: cz };
    const cameraPos = { x: cx, y: cy + 40, z: cz + 220 };
    graphInstance.cameraPosition(cameraPos, lookAt, 800);
  }, [graphPeek, currentStepIndex]);

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

  // Exit to explore mode
  const exitToExplore = useCallback(() => {
    clearHighlights();
    resetFilters();
    setMode('explore');
    loadFullGraph();
  }, [clearHighlights, resetFilters, setMode, loadFullGraph]);

  if (!step) return null;

  // Which act are we in?
  const currentAct = ACTS.find(a => a.slides.includes(currentStepIndex));

  // ─── Slide Router ──────────────────────────────────────────
  const renderSlide = () => {
    switch (step.layout) {
      case 'title':
        return <TitleSlide step={step} />;
      case 'timeline':
        return <TimelineSlide step={step} />;
      case 'layer-cards':
        return (
          <LayerCardsSlide
            step={step}
            expandedCards={expandedCards}
            onToggleCard={toggleCard}
          />
        );
      case 'hub-spoke':
        return (
          <HubSpokeSlide
            step={step}
            expandedDomain={expandedDomain}
            onSelectDomain={setExpandedDomain}
          />
        );
      case 'tier-stack':
        return <TierStackSlide step={step} />;
      case 'gantt':
        return <GanttSlide step={step} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* ─── Full-screen Scrim — nearly transparent when peeking at graph ─ */}
      <motion.div
        className="fixed inset-0 z-[45] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: graphPeek ? 0.1 : step.layout === 'title' ? 0.85 : 0.75 }}
        transition={{ duration: 0.4 }}
      >
        <div className={`absolute inset-0 bg-background ${graphPeek ? '' : 'backdrop-blur-sm'}`} />
      </motion.div>

      {/* ─── Slide Content ──────────────────────────────────── */}
      <div className={`fixed inset-0 z-[46] overflow-hidden flex flex-col transition-all duration-300 ${
        graphPeek ? 'pointer-events-none opacity-0' : 'pointer-events-auto'
      }`}>
        {/* Act indicator + slide title bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 px-6 pt-4 pb-2"
        >
          {/* Act badge */}
          {currentAct && (
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: `${step.themeColor}20`,
                color: step.themeColor,
              }}
            >
              Act {step.act}: {step.actLabel}
            </span>
          )}

          {/* Slide counter */}
          <span className="text-xs text-muted-foreground/50">
            {currentStepIndex + 1} / {BUILD_STEPS.length}
          </span>
        </motion.div>

        {/* Slide title (non-title slides) */}
        {step.layout !== 'title' && (
          <motion.div
            key={`title-${step.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="px-6 pb-2"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
              {step.title}
            </h2>
            {step.subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{step.subtitle}</p>
            )}
          </motion.div>
        )}

        {/* Slide body */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="h-full"
            >
              {renderSlide()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Bottom Navigation ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[47] flex items-center ${
          isMobile ? 'gap-2' : 'gap-4'
        }`}
      >
        {/* Previous */}
        <button
          onClick={prevStep}
          disabled={currentStepIndex === 0}
          className="p-2 rounded-full glass-panel text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
        </button>

        {/* Step dots with act grouping */}
        <div className={`flex items-center gap-1.5 px-3 py-2 rounded-full glass-panel ${
          isMobile ? 'max-w-[200px] overflow-x-auto' : ''
        }`}>
          {ACTS.map((act, actIndex) => (
            <div key={act.label} className="flex items-center gap-1">
              {/* Act separator */}
              {actIndex > 0 && (
                <div className="w-px h-3 bg-muted-foreground/20 mx-0.5" />
              )}
              {act.slides.map((slideIndex) => {
                const isCurrent = slideIndex === currentStepIndex;
                const isVisited = slideIndex < currentStepIndex;
                return (
                  <button
                    key={slideIndex}
                    onClick={() => goToStep(slideIndex)}
                    className={`rounded-full transition-all duration-300 ${
                      isCurrent ? 'w-5 h-2' : 'w-2 h-2'
                    } ${!isCurrent && !isVisited ? 'bg-muted-foreground/30' : ''}`}
                    style={
                      isCurrent
                        ? { backgroundColor: step.themeColor }
                        : isVisited
                        ? { backgroundColor: `${BUILD_STEPS[slideIndex].themeColor}80` }
                        : undefined
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={nextStep}
          disabled={currentStepIndex === BUILD_STEPS.length - 1}
          className="p-2 rounded-full glass-panel text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
        </button>

        {/* View in Graph — only shown for slides with related nodes */}
        {step.relatedNodeIds && step.relatedNodeIds.length > 0 && (
          <button
            onClick={() => setGraphPeek(p => !p)}
            className={`flex items-center gap-1.5 rounded-full glass-panel transition-all font-medium ${
              graphPeek
                ? 'text-[#5B9ECF] border border-[#5B9ECF]/30 pointer-events-auto'
                : 'text-muted-foreground hover:text-[#5B9ECF]'
            } ${isMobile ? 'px-2 py-1.5 text-[10px]' : 'px-3 py-2 text-xs'}`}
            title="Toggle graph view to see highlighted nodes"
          >
            <Network className={isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
            {!isMobile && (graphPeek ? 'Back to Slide' : 'View in Graph')}
          </button>
        )}

        {/* Exit to Explore */}
        <button
          onClick={exitToExplore}
          className={`flex items-center gap-1.5 rounded-full glass-panel text-muted-foreground hover:text-[#9B7ACC] transition-all font-medium ${
            isMobile ? 'px-2 py-1.5 text-[10px]' : 'px-3 py-2 text-xs'
          }`}
          title="Exit to free explore mode"
        >
          <Compass className={isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          {!isMobile && 'Explore'}
        </button>
      </motion.div>
    </>
  );
}
