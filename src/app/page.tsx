'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppMode } from '@/lib/store/presentation-store';
import type { LensType } from '@/lib/store/presentation-store';

// ─── Direct access modes (campaign label swapped per lens) ───
const BASE_MODES: { key: AppMode; label: string; foLabel?: string; color: string }[] = [
  { key: 'guided',   label: 'Guided Tour',    color: '#C9A04E' },
  { key: 'explore',  label: 'Explore',         color: '#9B7ACC' },
  { key: 'campaign', label: 'Campaign',        foLabel: 'Manage', color: '#4CAF50' },
  { key: 'build',    label: 'Build It',        color: '#E88D67' },
  { key: 'roi',      label: 'ROI Simulator',   color: '#14B8A6' },
  { key: 'role',     label: 'Your Role + AI',  color: '#5B9ECF' },
];

const LENS_CONFIG: Record<LensType, { label: string; subtitle: string }> = {
  marketing: {
    label: 'Marketing Operations',
    subtitle: 'Six production stages. Sixteen AI agents. Twenty-two shared knowledge sources. See how an organizational intelligence layer turns enterprise content production into a governed operating system.',
  },
  frontoffice: {
    label: 'Front Office',
    subtitle: 'Four departments. Fourteen AI agents. Sixteen shared knowledge sources. See how an organizational intelligence layer connects marketing, sales, service, and customer success into a single operating system.',
  },
};

/* ── Hand-drawn curved arrow (SVG path) ───────────────────── */
function HandDrawnArrow() {
  return (
    <svg
      width="80"
      height="60"
      viewBox="0 0 80 60"
      fill="none"
      className="absolute"
      style={{ bottom: -52, left: '50%', transform: 'translateX(-50%)' }}
    >
      {/* Curved body */}
      <motion.path
        d="M40 2 C38 12, 30 22, 28 32 C26 40, 30 46, 38 50"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6, ease: 'easeOut' }}
      />
      {/* Arrow head */}
      <motion.path
        d="M32 44 L38 50 L30 52"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.3 }}
      />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const [lens, setLens] = useState<LensType>('marketing');

  const handleStart = (mode: AppMode) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('initialMode', mode);
      sessionStorage.setItem('lens', lens);
      sessionStorage.removeItem('journeySequence');
    }
    router.push('/graph');
  };

  const lensConf = LENS_CONFIG[lens];
  const modes = BASE_MODES
    .filter(m => !(lens === 'frontoffice' && m.key === 'roi'))
    .map(m => ({
      ...m,
      label: lens === 'frontoffice' && m.foLabel ? m.foLabel : m.label,
    }));

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
            For Revenue &amp; Operations Leaders
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

        {/* Lens Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex rounded-lg glass-panel p-0.5 gap-0.5">
            {(Object.keys(LENS_CONFIG) as LensType[]).map((l) => (
              <button
                key={l}
                onClick={() => setLens(l)}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  lens === l
                    ? 'bg-[#C9A04E]/20 text-[#C9A04E] border border-[#C9A04E]/40'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {LENS_CONFIG[l].label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Subtitle — dynamic per lens */}
        <AnimatePresence mode="wait">
          <motion.p
            key={lens}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Agents will commoditize. The intelligence underneath them won&apos;t.{' '}
            {lensConf.subtitle}
          </motion.p>
        </AnimatePresence>

        {/* Mode buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="max-w-3xl mx-auto mt-10"
        >
          <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider mb-3">
            How do you want to explore?
          </p>
          <div className="flex flex-wrap justify-center gap-2 relative">
            {modes.map(({ key, label, color }) => {
              const isGuided = key === 'guided';
              return (
                <div key={key} className={isGuided ? 'relative' : ''}>
                  {/* "start here" annotation anchored above Guided Tour */}
                  {isGuided && (
                    <motion.div
                      initial={{ opacity: 0, rotate: -3 }}
                      animate={{ opacity: 1, rotate: -3 }}
                      transition={{ delay: 1.0, duration: 0.5 }}
                      className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    >
                      <span
                        className="text-[#D4AF37] text-lg font-[family-name:var(--font-caveat)]"
                        style={{ fontWeight: 600 }}
                      >
                        start here
                      </span>
                      <HandDrawnArrow />
                    </motion.div>
                  )}
                  <button
                    onClick={() => handleStart(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                      ${isGuided
                        ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37]/60 text-[#D4AF37] hover:bg-[#D4AF37]/30 hover:border-[#D4AF37]/80 shadow-[0_0_20px_rgba(212,175,55,0.25)] scale-110'
                        : 'glass-panel text-muted-foreground hover:text-foreground'
                      }`}
                    style={isGuided ? undefined : { borderColor: `${color}20` }}
                  >
                    <span style={isGuided ? undefined : { color }}>{label}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
