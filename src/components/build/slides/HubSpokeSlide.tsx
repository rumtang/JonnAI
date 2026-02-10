'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { BuildStep, DomainCard } from '@/data/build-steps';

interface HubSpokeSlideProps {
  step: BuildStep;
  expandedDomain: string | null;
  onSelectDomain: (id: string | null) => void;
}

const DEPENDENCY_COLORS: Record<string, string> = {
  blocking: '#D4856A',
  governing: '#C9A04E',
  constraining: '#5B9ECF',
  informing: '#94a3b8',
  enabling: '#4CAF50',
};

const DEPENDENCY_LABELS: Record<string, string> = {
  blocking: 'Blocking',
  governing: 'Governing',
  constraining: 'Constraining',
  informing: 'Informing',
  enabling: 'Enabling',
};

// Position 7 domains in a circle around center
function getDomainPosition(index: number, total: number, radius: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

export default function HubSpokeSlide({ step, expandedDomain, onSelectDomain }: HubSpokeSlideProps) {
  const { content } = step;
  const domains = content.domains ?? [];
  const selectedDomain = domains.find(d => d.id === expandedDomain);

  const svgSize = 500;
  const center = svgSize / 2;
  const radius = 180;

  return (
    <div className="max-w-6xl mx-auto px-6 py-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
      {/* Tagline */}
      {content.tagline && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground text-center mb-4 max-w-2xl mx-auto"
        >
          {content.tagline}
        </motion.p>
      )}

      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* SVG hub-and-spoke diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-shrink-0 mx-auto lg:mx-0"
        >
          <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="w-[340px] h-[340px] md:w-[420px] md:h-[420px]">
            {/* Connection lines */}
            {domains.map((domain, i) => {
              const pos = getDomainPosition(i, domains.length, radius);
              const color = DEPENDENCY_COLORS[domain.dependencyType];
              return (
                <line
                  key={`line-${domain.id}`}
                  x1={center}
                  y1={center}
                  x2={center + pos.x}
                  y2={center + pos.y}
                  stroke={color}
                  strokeWidth={domain.dependencyType === 'blocking' ? 2.5 : 1.5}
                  strokeOpacity={expandedDomain && expandedDomain !== domain.id ? 0.15 : 0.6}
                  strokeDasharray={domain.dependencyType === 'informing' ? '4 3' : undefined}
                />
              );
            })}

            {/* Center node: Marketing */}
            <circle cx={center} cy={center} r={36} fill="#5B9ECF" fillOpacity={0.15} stroke="#5B9ECF" strokeWidth={2} />
            <text x={center} y={center - 6} textAnchor="middle" className="fill-foreground text-[11px] font-semibold">Marketing</text>
            <text x={center} y={center + 10} textAnchor="middle" className="fill-muted-foreground text-[9px]">(Center)</text>

            {/* Domain nodes */}
            {domains.map((domain, i) => {
              const pos = getDomainPosition(i, domains.length, radius);
              const color = DEPENDENCY_COLORS[domain.dependencyType];
              const isSelected = expandedDomain === domain.id;
              const isDimmed = expandedDomain && !isSelected;

              return (
                <g
                  key={domain.id}
                  onClick={() => onSelectDomain(isSelected ? null : domain.id)}
                  className="cursor-pointer"
                  opacity={isDimmed ? 0.3 : 1}
                >
                  <circle
                    cx={center + pos.x}
                    cy={center + pos.y}
                    r={28}
                    fill={`${color}15`}
                    stroke={color}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                  />
                  <text
                    x={center + pos.x}
                    y={center + pos.y - 4}
                    textAnchor="middle"
                    className="fill-foreground text-[10px] font-medium pointer-events-none"
                  >
                    {domain.icon}
                  </text>
                  <text
                    x={center + pos.x}
                    y={center + pos.y + 10}
                    textAnchor="middle"
                    className="fill-foreground text-[8px] font-medium pointer-events-none"
                  >
                    {domain.name.length > 12 ? domain.name.split('/')[0].trim() : domain.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>

        {/* Detail panel / Legend */}
        <div className="flex-1 min-w-0">
          {/* Dependency type legend */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(DEPENDENCY_LABELS).map(([type, label]) => (
              <span
                key={type}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium"
                style={{ backgroundColor: `${DEPENDENCY_COLORS[type]}15`, color: DEPENDENCY_COLORS[type] }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DEPENDENCY_COLORS[type] }} />
                {label}
              </span>
            ))}
          </div>

          {/* Domain detail panel */}
          <AnimatePresence mode="wait">
            {selectedDomain ? (
              <motion.div
                key={selectedDomain.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-panel rounded-xl p-4"
                style={{ borderLeft: `3px solid ${DEPENDENCY_COLORS[selectedDomain.dependencyType]}` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{selectedDomain.icon}</span>
                  <h3 className="text-sm font-semibold text-foreground">{selectedDomain.name}</h3>
                  <span
                    className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase"
                    style={{
                      backgroundColor: `${DEPENDENCY_COLORS[selectedDomain.dependencyType]}20`,
                      color: DEPENDENCY_COLORS[selectedDomain.dependencyType],
                    }}
                  >
                    {selectedDomain.dependencyType}
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      What It Provides to Marketing
                    </p>
                    <p className="text-xs text-foreground/80 leading-relaxed">{selectedDomain.provides}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Autonomy Impact
                    </p>
                    <p className="text-xs text-foreground/80 font-medium">{selectedDomain.autonomyImpact}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel rounded-xl p-4"
              >
                <p className="text-sm text-muted-foreground text-center py-8">
                  Click a domain to see its details
                </p>
                {/* List all domains compactly */}
                <div className="space-y-2">
                  {domains.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => onSelectDomain(d.id)}
                      className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <span>{d.icon}</span>
                      <span className="text-xs text-foreground flex-1">{d.name}</span>
                      <span
                        className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase"
                        style={{
                          backgroundColor: `${DEPENDENCY_COLORS[d.dependencyType]}15`,
                          color: DEPENDENCY_COLORS[d.dependencyType],
                        }}
                      >
                        {d.dependencyType}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
