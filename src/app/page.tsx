'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { AppMode } from '@/lib/store/presentation-store';

// ─── Audience journey paths ──────────────────────────────────
const AUDIENCE_PATHS = [
  {
    title: 'Marketing Leader',
    description: 'Understand the workflow, see how AI transforms your team, test it with a campaign, then model the ROI.',
    journey: ['guided', 'role', 'campaign', 'roi'] as AppMode[],
    steps: '4 modes',
    time: '~20 min',
    color: '#C9A04E',
    icon: '\uD83C\uDFAF',
  },
  {
    title: 'Finance / Business Case',
    description: 'Start with a quick business case projection, then see the build timeline and investment structure.',
    journey: ['roi', 'build'] as AppMode[],
    steps: '2 modes',
    time: '~10 min',
    color: '#14B8A6',
    icon: '\uD83D\uDCCA',
  },
  {
    title: 'Implementation / Technical',
    description: 'Explore the full knowledge graph, see how to build it, then model the financial case for stakeholders.',
    journey: ['explore', 'build', 'roi'] as AppMode[],
    steps: '3 modes',
    time: '~15 min',
    color: '#E88D67',
    icon: '\u2699\uFE0F',
  },
];

// ─── Direct access modes ─────────────────────────────────────
const DIRECT_MODES: { key: AppMode; label: string; color: string }[] = [
  { key: 'guided',   label: 'Guided Tour',    color: '#C9A04E' },
  { key: 'role',     label: 'Your Role + AI',  color: '#5B9ECF' },
  { key: 'roi',      label: 'ROI Simulator',   color: '#14B8A6' },
  { key: 'campaign', label: 'Campaign',        color: '#4CAF50' },
  { key: 'build',    label: 'Build It',        color: '#E88D67' },
  { key: 'explore',  label: 'Explore',         color: '#9B7ACC' },
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

  const handleJourney = (journey: AppMode[]) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('initialMode', journey[0]);
      sessionStorage.setItem('journeySequence', JSON.stringify(journey));
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
            Infrastructure Layer
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-lg text-muted-foreground mb-4 max-w-xl mx-auto leading-relaxed"
        >
          Agents will commoditize. The infrastructure underneath them won&apos;t. Explore how
          organizational knowledge graphs, human-in-the-loop governance, and AI agents work
          together in enterprise content production.
        </motion.p>

        {/* Value proposition */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
          className="text-sm text-muted-foreground/70 mb-3 max-w-2xl mx-auto leading-relaxed"
        >
          An interactive model of the marketing campaign lifecycle — from brief to measurement —
          showing where AI handles volume, where humans maintain judgment, and where the knowledge
          layer makes both effective.
        </motion.p>

        {/* Credibility signals */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-muted-foreground/50 mb-10 max-w-2xl mx-auto"
        >
          Financial model benchmarks sourced from Gartner 2025, McKinsey, Salesforce, and Forrester
          research. Model your organization&apos;s specific business case in the ROI Simulator.
        </motion.p>

        {/* Section A: Audience Paths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8"
        >
          {AUDIENCE_PATHS.map((path, i) => (
            <button
              key={path.title}
              onClick={() => handleJourney(path.journey)}
              className="group text-left p-5 rounded-2xl glass-panel hover:shadow-lg transition-all duration-300 border border-white/5 hover:border-white/15"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{path.icon}</span>
                <h3 className="text-sm font-bold" style={{ color: path.color }}>
                  {path.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                {path.description}
              </p>

              {/* Journey steps preview */}
              <div className="flex items-center gap-1 mb-3 flex-wrap">
                {path.journey.map((mode, j) => {
                  const dm = DIRECT_MODES.find(m => m.key === mode);
                  return (
                    <span key={mode} className="flex items-center gap-1">
                      <span
                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: `${dm?.color || '#fff'}15`, color: dm?.color }}
                      >
                        {dm?.label}
                      </span>
                      {j < path.journey.length - 1 && (
                        <ArrowRight className="w-2.5 h-2.5 text-muted-foreground/30" />
                      )}
                    </span>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground/50">
                <span>{path.steps} &middot; {path.time}</span>
                <span className="group-hover:translate-x-0.5 transition-transform" style={{ color: path.color }}>
                  Start &rarr;
                </span>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Section B: Direct Access */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider mb-3">
            Or jump directly to
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
