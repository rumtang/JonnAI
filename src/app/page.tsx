'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  const handleStart = (mode: 'guided' | 'explore') => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('initialMode', mode);
    }
    router.push('/graph');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-3xl px-6"
      >
        {/* Pre-title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <span className="px-4 py-1.5 rounded-full text-xs font-medium glass-panel text-primary">
            Interactive Knowledge Graph Visualization
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-6 leading-tight font-[family-name:var(--font-playfair)]"
        >
          <span className="text-foreground">The Organizational</span>
          <br />
          <span className="bg-gradient-to-r from-[#C9A04E] via-[#5B9ECF] to-[#9B7ACC] bg-clip-text text-transparent">
            Intelligence Layer
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto leading-relaxed"
        >
          Why building a semantic knowledge layer matters more than bolting AI agents onto linear processes.
          Explore the real complexity of marketing campaign workflows.
        </motion.p>

        {/* Mode selection buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => handleStart('guided')}
            className="group relative px-8 py-4 rounded-2xl glass-panel hover:shadow-lg transition-all duration-300"
          >
            <div className="text-left">
              <p className="text-lg font-semibold text-primary group-hover:text-primary/80 transition-colors">
                Guided Presentation
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Step-by-step narrative with animated transitions
              </p>
            </div>
          </button>

          <button
            onClick={() => handleStart('explore')}
            className="group relative px-8 py-4 rounded-2xl glass-panel hover:shadow-lg transition-all duration-300"
          >
            <div className="text-left">
              <p className="text-lg font-semibold text-secondary group-hover:text-secondary/80 transition-colors">
                Free Exploration
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Dive into the 3D knowledge graph directly
              </p>
            </div>
          </button>
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-muted-foreground/50 mt-16"
        >
          Built with Next.js, Three.js, and react-force-graph-3d
        </motion.p>
      </motion.div>
    </div>
  );
}
