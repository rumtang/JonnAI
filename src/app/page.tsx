'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { AppMode } from '@/lib/store/presentation-store';

// ─── Direct access modes ─────────────────────────────────────
const DIRECT_MODES: { key: AppMode; label: string; color: string }[] = [
  { key: 'guided',   label: 'Guided Tour',    color: '#C9A04E' },
  { key: 'explore',  label: 'Explore',         color: '#9B7ACC' },
  { key: 'campaign', label: 'Campaign',        color: '#4CAF50' },
  { key: 'build',    label: 'Build It',        color: '#E88D67' },
  { key: 'roi',      label: 'ROI Simulator',   color: '#14B8A6' },
  { key: 'role',     label: 'Your Role + AI',  color: '#5B9ECF' },
];

export default function Home() {
  const router = useRouter();

  const handleStart = (mode: AppMode) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('initialMode', mode);
      sessionStorage.removeItem('journeySequence');
    }
    router.push('/graph');
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-4xl px-6"
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
          <span className="text-foreground">The</span>
          <br />
          <span className="bg-gradient-to-r from-[#C9A04E] via-[#5B9ECF] to-[#9B7ACC] bg-clip-text text-transparent">
            Organizational Intelligence Layer
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Agents will commoditize. The intelligence underneath them won&apos;t. Explore how
          organizational knowledge graphs, human-in-the-loop governance, and AI agents work
          together in enterprise content production.
        </motion.p>

        {/* Mode buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider mb-3">
            Choose your experience
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {DIRECT_MODES.map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => handleStart(key)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium glass-panel
                           text-muted-foreground hover:text-foreground transition-all duration-200"
                style={{ borderColor: `${color}20` }}
              >
                <span style={{ color }}>{label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
