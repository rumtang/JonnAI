'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Compass, RefreshCw, Users } from 'lucide-react';
import { useRoleInsightStore } from '@/lib/store/role-insight-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { usePresentationStore } from '@/lib/store/presentation-store';
import { useRoleInsight } from '@/lib/roles/use-role-insight';
import { NODE_STYLES } from '@/lib/graph/node-styles';
import { useIsMobile } from '@/lib/hooks/use-is-mobile';
import type { NodeType } from '@/lib/graph/types';
import type { NodeJourney } from '@/lib/roles/role-definitions';
import RoleSlide from './RoleSlide';

interface RoleControllerProps {
  onChangeRole: () => void;
}

export default function RoleController({ onChangeRole }: RoleControllerProps) {
  const selectedRole = useRoleInsightStore(s => s.selectedRole);
  const walkthroughPath = useRoleInsightStore(s => s.walkthroughPath);
  const currentStepIndex = useRoleInsightStore(s => s.currentStepIndex);
  const graphData = useGraphStore(s => s.graphData);

  const { goToNextStep, goToPrevStep, goToStep } = useRoleInsight();

  const setMode = usePresentationStore(s => s.setMode);
  const loadFullGraph = useGraphStore(s => s.loadFullGraph);
  const clearHighlights = useGraphStore(s => s.clearHighlights);
  const resetFilters = useGraphStore(s => s.resetFilters);

  const isMobile = useIsMobile();

  // Keyboard navigation — left/right arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNextStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevStep();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextStep, goToPrevStep]);

  // Exit to explore mode
  const exitToExplore = useCallback(() => {
    clearHighlights();
    resetFilters();
    useRoleInsightStore.getState().clearRole();
    setMode('explore');
    loadFullGraph();
  }, [clearHighlights, resetFilters, setMode, loadFullGraph]);

  // Current node for the slide
  const currentNodeId = walkthroughPath[currentStepIndex];
  const currentNode = currentNodeId
    ? graphData.nodes.find(n => n.id === currentNodeId)
    : undefined;

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === walkthroughPath.length - 1;

  // Per-node journey data
  const nodeJourney: NodeJourney | undefined = selectedRole?.narrative.nodeJourneys[currentNodeId];

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

      {/* --- Slide Content --- only when a role is selected and we have a valid node */}
      {selectedRole && currentNode && (
        <div className="fixed inset-0 z-[46] pointer-events-auto overflow-hidden flex flex-col">
          {/* Header: role name + step counter */}
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
              <p className="text-xs text-[#5B9ECF]">
                Step {currentStepIndex + 1} of {walkthroughPath.length}
              </p>
            </div>
          </motion.div>

          {/* Slide body */}
          <div className="flex-1 overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentNodeId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full"
              >
                <RoleSlide
                  node={currentNode}
                  role={selectedRole}
                  nodeJourney={nodeJourney}
                  isLast={isLast}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* --- Bottom Navigation --- */}
      {selectedRole && walkthroughPath.length > 0 && (
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
            onClick={goToPrevStep}
            disabled={isFirst}
            className="p-2 rounded-full glass-panel text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
          </button>

          {/* Progress dots — color-coded by node type, owned nodes bigger */}
          <div className={`flex items-center gap-[3px] px-3 py-2 rounded-full glass-panel ${
            isMobile ? 'max-w-[200px] overflow-x-auto' : 'max-w-[400px] overflow-x-auto'
          }`}>
            {walkthroughPath.map((nodeId, i) => {
              const node = graphData.nodes.find(n => n.id === nodeId);
              const nodeStyle = node ? (NODE_STYLES[node.type as NodeType] || NODE_STYLES.step) : NODE_STYLES.step;
              const isCurrent = i === currentStepIndex;
              const isVisited = i < currentStepIndex;
              const isOwned = selectedRole.ownedSteps.includes(nodeId) || selectedRole.reviewedGates.includes(nodeId);
              return (
                <button
                  key={nodeId}
                  onClick={() => goToStep(i)}
                  title={node?.label || nodeId}
                  className={`shrink-0 transition-all duration-300 ${
                    isCurrent
                      ? 'w-5 h-2.5 rounded-full ring-2 ring-[#5B9ECF]/50'
                      : isOwned
                        ? 'w-2.5 h-2.5 rounded-full hover:scale-125'
                        : 'w-2 h-2 rounded-full hover:scale-125'
                  } ${isVisited ? 'opacity-100' : 'opacity-30'}`}
                  style={{
                    backgroundColor: isCurrent
                      ? '#5B9ECF'
                      : isOwned
                        ? '#5B9ECF' + (isVisited ? '' : '80')
                        : (nodeStyle?.color || '#6b7280') + (isVisited ? '60' : '40'),
                  }}
                />
              );
            })}
          </div>

          {/* Next */}
          <button
            onClick={goToNextStep}
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
