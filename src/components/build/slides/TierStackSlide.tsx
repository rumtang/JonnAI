'use client';

import { motion } from 'framer-motion';
import type { BuildStep } from '@/data/build-steps';

interface TierStackSlideProps {
  step: BuildStep;
}

export default function TierStackSlide({ step }: TierStackSlideProps) {
  const { content } = step;
  const tiers = content.tiers ?? [];

  // Widths from narrowest (Autonomous, top) to widest (Human-Only, bottom)
  const widths = ['65%', '75%', '88%', '100%'];

  return (
    <div className="max-w-5xl mx-auto px-6 py-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
      {/* Tagline */}
      {content.tagline && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground text-center mb-6 max-w-2xl mx-auto"
        >
          {content.tagline}
        </motion.p>
      )}

      {/* Tier stack — pyramid shape, top to bottom */}
      <div className="flex flex-col items-center gap-3 mb-8">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.tier}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="rounded-xl overflow-hidden glass-panel"
            style={{
              width: widths[i],
              borderLeft: `4px solid ${tier.color}`,
            }}
          >
            <div className="p-4">
              {/* Tier header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{ backgroundColor: `${tier.color}20`, color: tier.color }}
                  >
                    {tier.tier}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">{tier.kgDependency.split('.')[0]}</span>
              </div>

              {/* Behavior */}
              <p className="text-xs text-foreground/80 mb-3">{tier.behavior}</p>

              {/* Examples */}
              <div className="flex flex-wrap gap-1.5">
                {tier.examples.map((ex) => (
                  <span
                    key={ex}
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{ backgroundColor: `${tier.color}10`, color: `${tier.color}cc` }}
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Graduation criteria callout */}
      {content.graduationCriteria && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel rounded-xl p-4 max-w-2xl mx-auto"
          style={{ borderLeft: '3px solid #4CAF50' }}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">🎓</span>
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Earning Autonomy</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{content.graduationCriteria}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
