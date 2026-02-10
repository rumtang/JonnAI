'use client';

import { motion } from 'framer-motion';
import type { BuildStep } from '@/data/build-steps';

interface TimelineSlideProps {
  step: BuildStep;
}

export default function TimelineSlide({ step }: TimelineSlideProps) {
  const { content } = step;
  const timeline = content.adoptionTimeline ?? [];
  const columns = content.columns ?? [];
  const patterns = content.resistancePatterns ?? [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
      {/* Tagline */}
      {content.tagline && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-[#E88D67] font-medium italic text-center mb-6"
        >
          &ldquo;{content.tagline}&rdquo;
        </motion.p>
      )}

      {/* Adoption Timeline — horizontal bar chart */}
      {timeline.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Adoption Timeline
          </h3>
          <div className="space-y-3">
            {timeline.map((phase, i) => (
              <motion.div
                key={phase.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex items-stretch gap-3"
              >
                {/* Phase bar */}
                <div
                  className="flex-shrink-0 w-40 rounded-lg px-3 py-2 flex flex-col justify-center"
                  style={{ backgroundColor: `${phase.color}20`, borderLeft: `3px solid ${phase.color}` }}
                >
                  <p className="text-sm font-semibold" style={{ color: phase.color }}>{phase.name}</p>
                  <p className="text-[10px] text-muted-foreground">{phase.duration}</p>
                </div>
                {/* Description */}
                <div className="glass-panel rounded-lg px-3 py-2 flex-1 min-w-0">
                  <p className="text-xs text-foreground/80 leading-relaxed">{phase.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{phase.humanRole}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Three columns: Stays Human / Agents Handle / Graph Enables */}
      {columns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Division of Labor
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {columns.map((col) => (
              <div key={col.title} className="glass-panel rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{col.icon}</span>
                  <p className="text-sm font-semibold text-foreground">{col.title}</p>
                </div>
                <ul className="space-y-1.5">
                  {col.items.map((item) => (
                    <li key={item} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-muted-foreground/40 mt-0.5 flex-shrink-0">&bull;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Resistance patterns */}
      {patterns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Resistance Patterns You Will Face
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {patterns.map((p) => (
              <div key={p.name} className="glass-panel rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{p.icon}</span>
                  <p className="text-xs font-semibold text-foreground">{p.name}</p>
                </div>
                <p className="text-[10px] text-[#E88D67] font-medium mb-1">{p.says}</p>
                <p className="text-[10px] text-muted-foreground italic mb-2">Means: {p.means}</p>
                <p className="text-[10px] text-foreground/70">{p.address}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
