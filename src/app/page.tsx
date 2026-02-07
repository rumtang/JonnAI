'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  const handleStart = (mode: 'guided' | 'explore') => {
    // Store the mode preference, then navigate
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('initialMode', mode);
    }
    router.push('/graph');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050510] relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-3xl" />
      </div>

      {/* Floating particles background (CSS-only) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

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
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Interactive Knowledge Graph Visualization
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
        >
          <span className="text-white">The Organizational</span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Intelligence Layer
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-slate-400 mb-12 max-w-xl mx-auto leading-relaxed"
        >
          Why building a semantic knowledge layer matters more than bolting AI agents onto linear processes.
          Explore the real complexity of content production workflows.
        </motion.p>

        {/* Mode selection buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => handleStart('guided')}
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
          >
            <div className="text-left">
              <p className="text-lg font-semibold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                Guided Presentation
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Step-by-step narrative with animated transitions
              </p>
            </div>
          </button>

          <button
            onClick={() => handleStart('explore')}
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
          >
            <div className="text-left">
              <p className="text-lg font-semibold text-purple-300 group-hover:text-purple-200 transition-colors">
                Free Exploration
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Dive into the 3D knowledge graph directly
              </p>
            </div>
          </button>
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-xs text-slate-600 mt-16"
        >
          Built with Next.js, Three.js, and react-force-graph-3d
        </motion.p>
      </motion.div>
    </div>
  );
}
