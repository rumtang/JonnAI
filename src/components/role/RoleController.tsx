'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Compass, RefreshCw, Users } from 'lucide-react';
import { useRoleInsightStore } from '@/lib/store/role-insight-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { usePresentationStore } from '@/lib/store/presentation-store';
import { useRoleInsight } from '@/lib/roles/use-role-insight';
import { useIsMobile } from '@/lib/hooks/use-is-mobile';
import RoleSlide from './RoleSlide';

// 4 fixed slides with labels and theme colors
const SLIDE_META = [
  { label: 'Overview',        color: '' },   // uses role accent (filled dynamically)
  { label: 'Before AI',       color: '#94a3b8' },
  { label: 'With AI Agents',  color: '#6BAED6' },
  { label: 'Agentic System',  color: '#4CAF50' },
] as const;

interface RoleControllerProps {
  onChangeRole: () => void;
}

export default function RoleController({ onChangeRole }: RoleControllerProps) {
  const selectedRole = useRoleInsightStore(s => s.selectedRole);
  const orderedNodeIds = useRoleInsightStore(s => s.orderedNodeIds);
  const currentSlideIndex = useRoleInsightStore(s => s.currentSlideIndex);
  const graphData = useGraphStore(s => s.graphData);

  const { goToNextSlide, goToPrevSlide, goToSlide } = useRoleInsight();

  const setMode = usePresentationStore(s => s.setMode);
  const loadFullGraph = useGraphStore(s => s.loadFullGraph);
  const clearHighlights = useGraphStore(s => s.clearHighlights);
  const resetFilters = useGraphStore(s => s.resetFilters);

  const isMobile = useIsMobile();

  const isFirst = currentSlideIndex === 0;
  const isLast = currentSlideIndex === 3;

  // Keyboard navigation — left/right arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide]);

  // Exit to explore mode
  const exitToExplore = useCallback(() => {
    clearHighlights();
    resetFilters();
    useRoleInsightStore.getState().clearRole();
    setMode('explore');
    loadFullGraph();
  }, [clearHighlights, resetFilters, setMode, loadFullGraph]);

  // Current slide label for header
  const currentSlideName = SLIDE_META[currentSlideIndex]?.label ?? '';

  return (
    <>
      {/* --- Full-screen Scrim --- always visible in role mode */}
      <motion.div
        className="fixed inset-0 z-[45] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-background backdrop-blur-sm" />
      </motion.div>

      {/* --- Slide Content --- only when a role is selected */}
      {selectedRole && (
        <div className="fixed inset-0 z-[46] pointer-events-auto overflow-hidden flex flex-col">
          {/* Header: role name + current slide label */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 px-6 pt-4 pb-2"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#5B9ECF]/20 shrink-0">
              <Users className="w-4 h-4 text-[#5B9ECF]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{selectedRole.title}</h2>
              <p className="text-xs text-[#5B9ECF]">{currentSlideName}</p>
            </div>
          </motion.div>

          {/* Slide body */}
          <div className="flex-1 overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlideIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full"
              >
                <RoleSlide
                  slideIndex={currentSlideIndex}
                  role={selectedRole}
                  graphData={graphData}
                  orderedNodeIds={orderedNodeIds}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* --- Bottom Navigation --- */}
      {selectedRole && (
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
            onClick={goToPrevSlide}
            disabled={isFirst}
            className="p-2 rounded-full glass-panel text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
          </button>

          {/* 4 progress dots — color-coded by slide type */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full glass-panel`}>
            {SLIDE_META.map((meta, i) => {
              const isCurrent = i === currentSlideIndex;
              const isVisited = i < currentSlideIndex;
              const dotColor = i === 0 ? selectedRole.accentColor : meta.color;
              return (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  title={meta.label}
                  className={`shrink-0 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'w-6 h-3 ring-2 ring-white/20'
                      : 'w-3 h-3 hover:scale-125'
                  } ${isVisited || isCurrent ? 'opacity-100' : 'opacity-40'}`}
                  style={{ backgroundColor: dotColor }}
                />
              );
            })}
          </div>

          {/* Next */}
          <button
            onClick={goToNextSlide}
            disabled={isLast}
            className="p-2 rounded-full glass-panel text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
          </button>

          {/* Change Role */}
          <button
            onClick={onChangeRole}
            className={`flex items-center gap-1.5 rounded-full glass-panel text-muted-foreground hover:text-[#5B9ECF] transition-all font-medium ${
              isMobile ? 'px-2 py-1.5 text-[10px]' : 'px-3 py-2 text-xs'
            }`}
            title="Choose a different role"
          >
            <RefreshCw className={isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
            {!isMobile && 'Change Role'}
          </button>

          {/* Explore Graph */}
          <button
            onClick={exitToExplore}
            className={`flex items-center gap-1.5 rounded-full glass-panel text-muted-foreground hover:text-[#9B7ACC] transition-all font-medium ${
              isMobile ? 'px-2 py-1.5 text-[10px]' : 'px-3 py-2 text-xs'
            }`}
            title="Exit to free explore mode"
          >
            <Compass className={isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
            {!isMobile && 'Explore Graph'}
          </button>
        </motion.div>
      )}
    </>
  );
}
