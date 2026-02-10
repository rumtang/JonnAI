'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  const handleStart = (mode: 'guided' | 'explore' | 'campaign' | 'build') => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('initialMode', mode);
    }
    router.push('/graph');
  };

  const modes = [
    {
      key: 'guided' as const,
      label: 'Guided Tour',
      description: 'Narrated walkthrough of the content production lifecycle',
      color: '#C9A04E',
    },
    {
      key: 'explore' as const,
      label: 'Explore',
      description: 'Navigate the full 3D knowledge graph freely',
      color: '#9B7ACC',
    },
    {
      key: 'campaign' as const,
      label: 'Campaign',
      description: 'Step through the workflow, making decisions at each gate',
      color: '#4CAF50',
    },
    {
      key: 'build' as const,
      label: 'Build It',
      description: 'See how to build this infrastructure for your team',
      color: '#E88D67',
    },
  ];

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
          Why building a semantic knowledge layer matters at least as much as the agents themselves.
          Explore the deep complexity of marketing campaign workflows.
        </motion.p>

        {/* Mode selection buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
        >
          {modes.map(({ key, label, description, color }) => (
            <button
              key={key}
              onClick={() => handleStart(key)}
              className="group relative px-8 py-4 rounded-2xl glass-panel hover:shadow-lg transition-all duration-300"
            >
              <div className="text-left">
                <p
                  className="text-lg font-semibold transition-colors"
                  style={{ color }}
                >
                  {label}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              </div>
            </button>
          ))}
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
