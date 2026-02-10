'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface BuildCardProps {
  id: string;
  icon: string;
  title: string;
  summary: string;
  source: string;
  expanded: boolean;
  onToggle: () => void;
  themeColor: string;
  children?: React.ReactNode;
}

export default function BuildCard({
  icon, title, summary, source, expanded, onToggle, themeColor, children,
}: BuildCardProps) {
  return (
    <motion.button
      layout
      onClick={onToggle}
      className="w-full text-left glass-panel rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-lg cursor-pointer"
      style={{ borderLeft: `3px solid ${themeColor}` }}
    >
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm leading-snug">{title}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{summary}</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 mt-1"
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </div>

        {/* Source badge */}
        <div className="mt-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-muted-foreground">
            Source: {source}
          </span>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-white/5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
