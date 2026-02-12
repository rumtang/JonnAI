'use client';

import { useShallow } from 'zustand/react/shallow';
import { usePresentationStore, type AppMode } from '@/lib/store/presentation-store';
import { switchMode } from '@/lib/utils/mode-transitions';
import { useIsMobile } from '@/lib/hooks/use-is-mobile';
import { motion } from 'framer-motion';

export default function ModeToggle() {
  const isMobile = useIsMobile();
  const { mode, lens } = usePresentationStore(useShallow((s) => ({ mode: s.mode, lens: s.lens })));

  const modes: { key: AppMode; label: string; shortLabel: string; activeColor: string; activeBg: string }[] = [
    {
      key: 'guided',
      label: 'Guided Tour',
      shortLabel: 'Tour',
      activeColor: '#C9A04E',
      activeBg: 'bg-[#C9A04E]/20',
    },
    {
      key: 'explore',
      label: 'Explore',
      shortLabel: 'Explore',
      activeColor: '#9B7ACC',
      activeBg: 'bg-[#9B7ACC]/20',
    },
    {
      key: 'campaign',
      label: lens === 'frontoffice' ? 'Manage' : 'Campaign',
      shortLabel: lens === 'frontoffice' ? 'Manage' : 'Run',
      activeColor: '#4CAF50',
      activeBg: 'bg-[#4CAF50]/20',
    },
    {
      key: 'build',
      label: 'Build It',
      shortLabel: 'Build',
      activeColor: '#E88D67',
      activeBg: 'bg-[#E88D67]/20',
    },
    {
      key: 'roi',
      label: 'ROI',
      shortLabel: 'ROI',
      activeColor: '#14B8A6',
      activeBg: 'bg-[#14B8A6]/20',
    },
    {
      key: 'role',
      label: 'Your Role',
      shortLabel: 'Role',
      activeColor: '#5B9ECF',
      activeBg: 'bg-[#5B9ECF]/20',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed top-4 right-4 z-50 flex items-center gap-1 p-1 rounded-full glass-panel"
    >
      {modes.filter(m => !(lens === 'frontoffice' && m.key === 'roi')).map(({ key, label, shortLabel, activeColor, activeBg }) => (
        <button
          key={key}
          onClick={() => switchMode(key)}
          className={`rounded-full font-medium transition-all duration-300 ${
            isMobile ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-2 text-sm'
          } ${
            mode === key
              ? `${activeBg} shadow-lg`
              : 'text-muted-foreground hover:text-foreground'
          }`}
          style={mode === key ? { color: activeColor, boxShadow: `0 4px 12px ${activeColor}15` } : undefined}
        >
          {isMobile ? shortLabel : label}
        </button>
      ))}
    </motion.div>
  );
}
