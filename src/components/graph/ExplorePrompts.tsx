'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronRight, X } from 'lucide-react';

const DISCOVERY_PROMPTS = [
  'Find a gate node (coral dodecahedrons). Click one to see where humans maintain control.',
  'Purple torus shapes are AI agents. Click one to see what it does and what tools it uses.',
  'Click any step to see its inputs. These knowledge dependencies are the organizational intelligence layer.',
  'Use the filters (top-left) to show only gates \u2014 see every human checkpoint in the workflow.',
];

export default function ExplorePrompts() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || currentIndex >= DISCOVERY_PROMPTS.length) return null;

  const handleNext = () => {
    if (currentIndex < DISCOVERY_PROMPTS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setDismissed(true);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[55] max-w-md w-full mx-4"
      >
        <div className="glass-panel rounded-2xl p-4 shadow-2xl border border-white/10">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C9A04E]/15 flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4 text-[#C9A04E]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-1">
                Discovery tip {currentIndex + 1}/{DISCOVERY_PROMPTS.length}
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {DISCOVERY_PROMPTS[currentIndex]}
              </p>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded-full text-muted-foreground/40 hover:text-foreground hover:bg-white/5 transition-all shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 mt-3">
            <button
              onClick={() => setDismissed(true)}
              className="text-[10px] text-muted-foreground/50 hover:text-foreground transition-colors px-2 py-1"
            >
              Dismiss all
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 text-xs font-medium text-[#C9A04E] hover:text-[#C9A04E]/80 transition-colors px-2 py-1"
            >
              {currentIndex < DISCOVERY_PROMPTS.length - 1 ? 'Next tip' : 'Got it'}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
