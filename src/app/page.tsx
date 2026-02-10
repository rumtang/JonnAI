'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  const handleStart = (mode: 'guided' | 'explore' | 'campaign' | 'build' | 'roi') => {
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
      badge: 'Start Here',
    },
    {
      key: 'roi' as const,
      label: 'ROI Simulator',
      description: 'Model the financial case for knowledge graph infrastructure',
      color: '#14B8A6',
      badge: 'For Finance',
    },
    {
      key: 'campaign' as const,
      label: 'Campaign',
      description: 'Step through the workflow, making decisions at each gate',
      color: '#4CAF50',
      badge: null,
    },
    {
      key: 'build' as const,
      label: 'Build It',
      description: 'See how to build this infrastructure for your team',
      color: '#E88D67',
      badge: null,
    },
    {
      key: 'explore' as const,
      label: 'Explore',
      description: 'Navigate the full 3D knowledge graph freely',
      color: '#9B7ACC',
      badge: null,
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
          className="text-lg text-muted-foreground mb-4 max-w-xl mx-auto leading-relaxed"
        >
          Why building a semantic knowledge layer matters at least as much as the agents themselves.
          Explore the deep complexity of marketing campaign workflows.
        </motion.p>

        {/* Value proposition */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
          className="text-sm text-muted-foreground/70 mb-3 max-w-2xl mx-auto leading-relaxed"
        >
          Enterprise marketing teams using organizational intelligence layers see 2-5x faster campaign cycles
          and 150-250% ROI on their infrastructure investment.
        </motion.p>

        {/* Credibility signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-12"
        >
          <span className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">
            Built for S&P 500 marketing operations
          </span>
          <span className="text-muted-foreground/20">|</span>
          <span className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">
            Benchmarked against Gartner, McKinsey &amp; Forrester data
          </span>
          <span className="text-muted-foreground/20">|</span>
          <span className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">
            11 verticals, $100M–$750B revenue
          </span>
        </motion.div>

        {/* Mode selection buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto"
        >
          {modes.map(({ key, label, description, color, badge }) => (
            <button
              key={key}
              onClick={() => handleStart(key)}
              className={`group relative px-4 py-2.5 rounded-xl glass-panel hover:shadow-lg transition-all duration-300 w-full sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)] ${
                badge === 'Start Here' ? 'ring-1 ring-[#C9A04E]/30' : ''
              }`}
            >
              {badge && (
                <span
                  className="absolute -top-2 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {badge}
                </span>
              )}
              <div className="text-left">
                <p
                  className="text-sm font-semibold transition-colors"
                  style={{ color }}
                >
                  {label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
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
          All benchmarks sourced from Gartner 2025, McKinsey, Salesforce, and Forrester research
        </motion.p>
      </motion.div>
    </div>
  );
}
