'use client';

import { motion } from 'framer-motion';
import type { BuildStep } from '@/data/build-steps';

interface GanttSlideProps {
  step: BuildStep;
}

const PHASE_COLORS = ['#E88D67', '#5B9ECF', '#9B7ACC', '#C9A04E', '#4CAF50'];

export default function GanttSlide({ step }: GanttSlideProps) {
  const { content } = step;
  const phases = content.phases ?? [];
  const teamRoles = content.teamRoles ?? [];
  const maturityLevels = content.maturityLevels ?? [];
  const totalWeeks = 16;

  return (
    <div className="max-w-6xl mx-auto px-6 py-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
      {/* Tagline */}
      {content.tagline && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground text-center mb-6 max-w-2xl mx-auto italic"
        >
          &ldquo;{content.tagline}&rdquo;
        </motion.p>
      )}

      {/* Gantt chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        {/* Week headers */}
        <div className="flex items-end mb-2">
          <div className="w-40 flex-shrink-0" />
          <div className="flex-1 flex">
            {Array.from({ length: totalWeeks }, (_, i) => (
              <div key={i} className="flex-1 text-center">
                <span className="text-[8px] text-muted-foreground/50">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phase bars */}
        <div className="space-y-2">
          {phases.map((phase, i) => {
            const startPct = ((phase.startWeek - 1) / totalWeeks) * 100;
            const widthPct = ((phase.endWeek - phase.startWeek + 1) / totalWeeks) * 100;
            const color = PHASE_COLORS[i % PHASE_COLORS.length];

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex items-center"
              >
                {/* Phase label */}
                <div className="w-40 flex-shrink-0 pr-3 text-right">
                  <p className="text-xs font-semibold text-foreground truncate">{phase.name}</p>
                  <p className="text-[9px] text-muted-foreground">{phase.weeks}</p>
                </div>
                {/* Bar track */}
                <div className="flex-1 relative h-8 rounded-md bg-white/3">
                  <div
                    className="absolute top-0 bottom-0 rounded-md flex items-center px-2 overflow-hidden"
                    style={{
                      left: `${startPct}%`,
                      width: `${widthPct}%`,
                      backgroundColor: `${color}25`,
                      borderLeft: `3px solid ${color}`,
                    }}
                  >
                    <span className="text-[9px] font-medium truncate" style={{ color }}>
                      {phase.deliverables[0]}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phase details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Phase Details
          </h3>
          <div className="space-y-3">
            {phases.map((phase, i) => {
              const color = PHASE_COLORS[i % PHASE_COLORS.length];
              return (
                <div key={phase.id} className="glass-panel rounded-lg p-3" style={{ borderLeft: `3px solid ${color}` }}>
                  <p className="text-xs font-semibold text-foreground mb-1.5">{phase.name}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Activities</p>
                      <ul className="space-y-0.5">
                        {phase.activities.map((a) => (
                          <li key={a} className="text-[10px] text-foreground/70 flex items-start gap-1.5">
                            <span className="text-muted-foreground/40 flex-shrink-0">&bull;</span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Deliverables</p>
                      <ul className="space-y-0.5">
                        {phase.deliverables.map((d) => (
                          <li key={d} className="text-[10px] text-foreground/70 flex items-start gap-1.5">
                            <span className="text-muted-foreground/40 flex-shrink-0">&bull;</span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Team + Maturity */}
        <div className="space-y-6">
          {/* Team composition */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Team Composition
            </h3>
            <div className="space-y-2">
              {teamRoles.map((r) => (
                <div key={r.role} className="glass-panel rounded-lg p-3">
                  <p className="text-xs font-semibold text-foreground">{r.role}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{r.responsibility}</p>
                  <p className="text-[10px] text-[#E88D67] font-medium mt-1">{r.allocation}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Maturity model */}
          {maturityLevels.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Context Engineering Maturity
              </h3>
              <div className="space-y-2">
                {maturityLevels.map((level) => (
                  <div
                    key={level.level}
                    className="glass-panel rounded-lg p-3 flex items-start gap-3"
                    style={{ borderLeft: `3px solid ${level.color}` }}
                  >
                    <span
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: `${level.color}20`, color: level.color }}
                    >
                      {level.level}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xs font-semibold text-foreground">{level.name}</p>
                        <span className="text-[9px] text-muted-foreground">{level.timeline}</span>
                      </div>
                      <p className="text-[10px] text-foreground/70">{level.agentCapability}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
