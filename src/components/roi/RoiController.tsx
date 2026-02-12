'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Compass, BookOpen, FastForward, Link2, Check } from 'lucide-react';
import MethodologyPanel from './MethodologyPanel';
import { useRoiStore } from '@/lib/store/roi-store';
import { buildShareUrl } from '@/lib/utils/roi-share';
import { usePresentationStore } from '@/lib/store/presentation-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { switchMode } from '@/lib/utils/mode-transitions';
import { useIsMobile } from '@/lib/hooks/use-is-mobile';
import { ROI_STEPS } from '@/data/roi-steps';
import { ROI_STEPS_FRONTOFFICE } from '@/data/roi-steps-frontoffice';
import QuickCalcSlide from './slides/QuickCalcSlide';
import BaselineInputsSlide from './slides/BaselineInputsSlide';
import MartechMediaSlide from './slides/MartechMediaSlide';
import OpsContentSlide from './slides/OpsContentSlide';
import TimelineSlide from './slides/TimelineSlide';
import PlaybookSlide from './slides/PlaybookSlide';
import BeforeAfterSlide from './slides/BeforeAfterSlide';
import ExecutiveSummarySlide from './slides/ExecutiveSummarySlide';
import CfoSummarySlide from './slides/CfoSummarySlide';

// ─── Act Definitions (lens-aware) ──────────────────────────────────
const ACTS_MARKETING = [
  { label: 'Quick Estimate', slides: [0] },
  { label: 'Your Marketing Machine', slides: [1] },
  { label: 'Where the Money Goes', slides: [2, 3] },
  { label: 'The Transformation', slides: [4, 5] },
  { label: 'Before & After', slides: [6] },
  { label: 'Your Investment Case', slides: [7] },
];
const ACTS_FRONTOFFICE = [
  { label: 'Quick Estimate', slides: [0] },
  { label: 'Your Front Office', slides: [1] },
  { label: 'Where Revenue Leaks', slides: [2, 3] },
  { label: 'The Transformation', slides: [4, 5] },
  { label: 'Before & After', slides: [6] },
  { label: 'Your Investment Case', slides: [7] },
];

// Input slides are indices 1, 2, 3 — show "Skip to Results" on these (not quick calc)
const INPUT_SLIDE_INDICES = [1, 2, 3];
// The timeline slide is the first results slide
const TIMELINE_SLIDE_INDEX = 4;

export default function RoiController() {
  const currentStepIndex = useRoiStore(s => s.currentStepIndex);
  const nextStep = useRoiStore(s => s.nextStep);
  const prevStep = useRoiStore(s => s.prevStep);
  const goToStep = useRoiStore(s => s.goToStep);


  const exportConfig = useRoiStore(s => s.exportConfig);
  const viewMode = useRoiStore(s => s.viewMode);

  const lens = usePresentationStore(s => s.lens);
  const roiSteps = lens === 'frontoffice' ? ROI_STEPS_FRONTOFFICE : ROI_STEPS;
  const ACTS = lens === 'frontoffice' ? ACTS_FRONTOFFICE : ACTS_MARKETING;

  const isMobile = useIsMobile();
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const step = roiSteps[currentStepIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture arrow keys when user is interacting with sliders
      const target = e.target as HTMLElement;
      if (target.closest('[data-slot="slider"]') || target.closest('input')) return;

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
    switchMode('explore');
  }, []);

  if (!step) return null;

  const currentAct = ACTS.find(a => a.slides.includes(currentStepIndex));
  const isInputSlide = INPUT_SLIDE_INDICES.includes(currentStepIndex);

  // ─── Slide Router ──────────────────────────────────────────────
  const renderSlide = () => {
    switch (step.layout) {
      case 'quick-calc':
        return <QuickCalcSlide step={step} />;
      case 'org-budget-profile':
        return <BaselineInputsSlide step={step} />;
      case 'martech-media':
        return <MartechMediaSlide step={step} />;
      case 'ops-content':
        return <OpsContentSlide step={step} />;
      case 'timeline-dual':
        return <TimelineSlide step={step} />;
      case 'playbook':
        return <PlaybookSlide step={step} />;
      case 'before-after':
        return <BeforeAfterSlide step={step} />;
      case 'executive-card':
        return viewMode === 'cfo'
          ? <CfoSummarySlide step={step} />
          : <ExecutiveSummarySlide step={step} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* ─── Full-screen Scrim ──────────────────────────────── */}
      <motion.div
        className="fixed inset-0 z-[45] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-background backdrop-blur-sm" />
      </motion.div>

      {/* ─── Slide Content ──────────────────────────────────── */}
      <div className="fixed inset-0 z-[46] pointer-events-auto overflow-hidden flex flex-col">
        {/* Act indicator + slide counter */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 px-6 pt-4 pb-2"
        >
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
          <span className="text-xs text-muted-foreground/50">
            {currentStepIndex + 1} / {roiSteps.length}
          </span>

          {/* Skip to Results — shown only on input slides */}
          {isInputSlide && (
            <button
              onClick={() => goToStep(TIMELINE_SLIDE_INDEX)}
              className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground/60 hover:text-[#14B8A6] transition-colors"
            >
              <FastForward className="w-3 h-3" />
              Skip to Results
            </button>
          )}
        </motion.div>

        {/* Slide title */}
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
                        ? { backgroundColor: `${roiSteps[slideIndex].themeColor}80` }
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
          disabled={currentStepIndex === roiSteps.length - 1}
          className="p-2 rounded-full glass-panel text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
        </button>

        {/* How We Calculate */}
        <button
          onClick={() => setMethodologyOpen(true)}
          className={`flex items-center gap-1.5 rounded-full glass-panel text-muted-foreground hover:text-[#14B8A6] transition-all font-medium ${
            isMobile ? 'px-2 py-1.5 text-[10px]' : 'px-3 py-2 text-xs'
          }`}
          title="How we calculate these numbers"
        >
          <BookOpen className={isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          {!isMobile && 'How We Calculate'}
        </button>

        {/* Share This Model — shown on results slides (index >= 4) */}
        {currentStepIndex >= 4 && (
          <button
            onClick={() => {
              const config = exportConfig();
              const url = buildShareUrl(config);
              navigator.clipboard.writeText(url).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              });
            }}
            className={`flex items-center gap-1.5 rounded-full glass-panel transition-all font-medium ${
              copied ? 'text-[#4CAF50]' : 'text-muted-foreground hover:text-[#14B8A6]'
            } ${isMobile ? 'px-2 py-1.5 text-[10px]' : 'px-3 py-2 text-xs'}`}
            title="Copy shareable URL to clipboard"
          >
            {copied ? (
              <Check className={isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
            ) : (
              <Link2 className={isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
            )}
            {!isMobile && (copied ? 'Copied!' : 'Share')}
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

      {/* Methodology Panel */}
      <MethodologyPanel open={methodologyOpen} onOpenChange={setMethodologyOpen} />
    </>
  );
}
