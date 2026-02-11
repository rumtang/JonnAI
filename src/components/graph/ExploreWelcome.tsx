'use client';

import { motion } from 'framer-motion';
import { Layers, Users, X } from 'lucide-react';

interface ExploreWelcomeProps {
  onExploreGraph: () => void;
  onSelectRole: () => void;
  onDismiss: () => void;
}

export default function ExploreWelcome({
  onExploreGraph,
  onSelectRole,
  onDismiss,
}: ExploreWelcomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[60] flex items-center justify-center"
      onClick={onDismiss}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ delay: 0.15, duration: 0.4, type: 'spring', stiffness: 200, damping: 25 }}
        className="relative z-10 glass-panel rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground/40 hover:text-foreground hover:bg-muted-foreground/10 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground font-[family-name:var(--font-playfair)] mb-2">
            The Organizational Intelligence Layer
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Explore how 45 workflow steps, gates, and AI agents connect — or see how the system transforms your specific role.
          </p>
        </div>

        {/* Two CTA Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Explore the Graph */}
          <button
            onClick={onExploreGraph}
            className="group text-left p-5 rounded-2xl border border-[#9B7ACC]/20 bg-[#9B7ACC]/5
                       hover:bg-[#9B7ACC]/10 hover:border-[#9B7ACC]/40 hover:shadow-lg hover:shadow-[#9B7ACC]/10
                       transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-[#9B7ACC]/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5 text-[#9B7ACC]" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Explore the Graph
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Navigate the full knowledge graph — click nodes, trace connections, and discover the organizational intelligence layer.
            </p>
          </button>

          {/* Impact Per Role */}
          <button
            onClick={onSelectRole}
            className="group text-left p-5 rounded-2xl border border-[#C9A04E]/20 bg-[#C9A04E]/5
                       hover:bg-[#C9A04E]/10 hover:border-[#C9A04E]/40 hover:shadow-lg hover:shadow-[#C9A04E]/10
                       transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-[#C9A04E]/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-[#C9A04E]" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Impact Per Role
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Choose your role and walk through how every step in the workflow changes with AI.
            </p>
          </button>
        </div>

        {/* Subtle dismiss hint */}
        <p className="text-center text-[9px] text-muted-foreground/40 mt-5">
          Click anywhere outside to dismiss
        </p>
      </motion.div>
    </motion.div>
  );
}
