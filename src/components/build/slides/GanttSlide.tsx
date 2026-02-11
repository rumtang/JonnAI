'use client';

import { motion } from 'framer-motion';
import { useSessionStore } from '@/lib/store/session-store';
import type { BuildStep } from '@/data/build-steps';

interface GanttSlideProps {
  step: BuildStep;
}

const PHASE_COLORS = ['#E88D67', '#5B9ECF', '#9B7ACC', '#C9A04E', '#4CAF50', '#D4856A', '#5B9ECF'];

// Owner badge colors for prerequisites
const OWNER_COLORS: Record<string, string> = {
  Client: '#D4856A',
  Joint: '#5B9ECF',
  Consultant: '#E88D67',
};

export default function GanttSlide({ step }: GanttSlideProps) {
  const { content } = step;
  const phases = content.phases ?? [];
  const teamRoles = content.teamRoles ?? [];
  const maturityLevels = content.maturityLevels ?? [];
  const prerequisites = content.prerequisites ?? [];
  const assumptions = content.assumptions ?? [];

  // Team size recommendation based on org profile from session store
  const orgProfile = useSessionStore(s => s.orgProfile);
  const teamRecommendation = orgProfile
    ? orgProfile.marketingHeadcount >= 200
      ? 'Enterprise team (10-15 people, 28 weeks)'
      : orgProfile.marketingHeadcount >= 50
        ? 'Standard team (6-10 people, 20 weeks)'
        : 'Lean team (3-5 people, 16 weeks)'
    : null;

  // Dynamically determine total weeks from phase data
  const maxWeek = phases.reduce((max, p) => Math.max(max, p.endWeek), 0);
  const totalWeeks = Math.max(maxWeek, 28);
  const tierDividerWeek = 16; // Tier 1 / Tier 2 divider

  return (
    <div className="max-w-6xl mx-auto px-6 py-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
      {/* Tagline */}
      {content.tagline && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground text-center mb-2 max-w-3xl mx-auto italic"
        >
          &ldquo;{content.tagline}&rdquo;
        </motion.p>
      )}

      {/* Team size recommendation from session org profile */}
      {teamRecommendation && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-[10px] text-center mb-4 text-[#5B9ECF]"
        >
          Recommended for {orgProfile?.companyName || 'your org'} ({orgProfile?.marketingHeadcount} headcount): {teamRecommendation}
        </motion.p>
      )}

      {/* Gantt chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        {/* Week headers */}
        <div className="flex items-end mb-2 relative">
          <div className="w-48 flex-shrink-0" />
          <div className="flex-1 flex relative">
            {Array.from({ length: totalWeeks }, (_, i) => (
              <div key={i} className="flex-1 text-center">
                <span className={`text-[7px] ${
                  i + 1 === tierDividerWeek
                    ? 'text-[#E88D67] font-bold'
                    : 'text-muted-foreground/50'
                }`}>
                  {/* Show every 2nd week label to avoid crowding */}
                  {(i + 1) % 2 === 0 || i === 0 ? i + 1 : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Phase bars */}
        <div className="space-y-1.5 relative">
          {/* Tier 1 / Tier 2 divider — positioned proportionally within the bar area */}
          <div
            className="absolute top-0 bottom-0 z-10 pointer-events-none"
            style={{
              left: `calc(12rem + ((100% - 12rem) * ${(tierDividerWeek - 0.5) / totalWeeks}))`,
            }}
          >
            <div className="border-l-2 border-dashed border-[#E88D67]/40 h-full" />
            <div className="absolute -top-5 -translate-x-1/2 whitespace-nowrap">
              <span className="text-[8px] font-semibold text-[#E88D67]/70 bg-background/80 px-1 rounded">
                Tier 1 ← → Tier 2
              </span>
            </div>
          </div>

          {phases.map((phase, i) => {
            const startPct = ((phase.startWeek - 1) / totalWeeks) * 100;
            const widthPct = ((phase.endWeek - phase.startWeek + 1) / totalWeeks) * 100;
            const color = PHASE_COLORS[i % PHASE_COLORS.length];
            const isMilestone = phase.weeks.includes('★');

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                className="flex items-center"
              >
                {/* Phase label */}
                <div className="w-48 flex-shrink-0 pr-3 text-right">
                  <p className="text-[10px] font-semibold text-foreground truncate">
                    {isMilestone && <span className="text-[#C9A04E] mr-1">★</span>}
                    {phase.name}
                  </p>
                  <p className="text-[8px] text-muted-foreground">{phase.weeks.replace(' ★', '')}</p>
                </div>
                {/* Bar track */}
                <div className="flex-1 relative h-7 rounded-md bg-white/3">
                  <div
                    className="absolute top-0 bottom-0 rounded-md flex items-center px-2 overflow-hidden"
                    style={{
                      left: `${startPct}%`,
                      width: `${widthPct}%`,
                      backgroundColor: `${color}25`,
                      borderLeft: `3px solid ${color}`,
                    }}
                  >
                    <span className="text-[8px] font-medium truncate" style={{ color }}>
                      {phase.deliverables[0]}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Prerequisites & Assumptions row */}
      {(prerequisites.length > 0 || assumptions.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6"
        >
          {/* Prerequisites */}
          {prerequisites.length > 0 && (
            <div className="glass-panel rounded-lg p-4" style={{ borderLeft: '3px solid #D4856A' }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-2">
                <span>⚠️</span> Engagement Prerequisites
              </h3>
              <div className="space-y-2">
                {prerequisites.map((p) => (
                  <div key={p.item} className="flex items-start gap-2">
                    <span
                      className="flex-shrink-0 px-1.5 py-0.5 rounded text-[8px] font-semibold mt-0.5"
                      style={{
                        backgroundColor: `${OWNER_COLORS[p.owner] ?? '#94a3b8'}20`,
                        color: OWNER_COLORS[p.owner] ?? '#94a3b8',
                      }}
                    >
                      {p.owner}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] text-foreground/80">{p.item}</p>
                      <p className="text-[8px] text-muted-foreground/60">{p.leadTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assumptions */}
          {assumptions.length > 0 && (
            <div className="glass-panel rounded-lg p-4" style={{ borderLeft: '3px solid #C9A04E' }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-2">
                <span>📋</span> Critical Assumptions
              </h3>
              <ul className="space-y-1.5">
                {assumptions.map((a) => (
                  <li key={a} className="text-[10px] text-foreground/70 flex items-start gap-2">
                    <span className="text-[#C9A04E] flex-shrink-0 mt-0.5">•</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

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
          <div className="space-y-2.5">
            {phases.map((phase, i) => {
              const color = PHASE_COLORS[i % PHASE_COLORS.length];
              const isMilestone = phase.weeks.includes('★');
              return (
                <div
                  key={phase.id}
                  className={`glass-panel rounded-lg p-3 ${isMilestone ? 'ring-1 ring-[#C9A04E]/30' : ''}`}
                  style={{ borderLeft: `3px solid ${color}` }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="text-[10px] font-semibold text-foreground">{phase.name}</p>
                    {isMilestone && (
                      <span className="text-[8px] font-bold text-[#C9A04E] bg-[#C9A04E]/10 px-1.5 py-0.5 rounded-full">
                        ★ MILESTONE
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Activities</p>
                      <ul className="space-y-0.5">
                        {phase.activities.map((a) => (
                          <li key={a} className="text-[9px] text-foreground/70 flex items-start gap-1.5">
                            <span className="text-muted-foreground/40 flex-shrink-0">&bull;</span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Deliverables</p>
                      <ul className="space-y-0.5">
                        {phase.deliverables.map((d) => (
                          <li key={d} className="text-[9px] text-foreground/70 flex items-start gap-1.5">
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
                  <p className="text-[10px] font-semibold text-foreground">{r.role}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{r.responsibility}</p>
                  <p className="text-[9px] text-[#E88D67] font-medium mt-1">{r.allocation}</p>
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
                        <p className="text-[10px] font-semibold text-foreground">{level.name}</p>
                        <span className="text-[8px] text-muted-foreground">{level.timeline}</span>
                      </div>
                      <p className="text-[9px] text-foreground/70">{level.agentCapability}</p>
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
