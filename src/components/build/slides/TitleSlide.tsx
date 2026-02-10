'use client';

import { motion } from 'framer-motion';
import type { BuildStep } from '@/data/build-steps';

interface TitleSlideProps {
  step: BuildStep;
}

export default function TitleSlide({ step }: TitleSlideProps) {
  const { content } = step;
  const stages = content.pipelineStages ?? [];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      {/* Tagline */}
      {content.tagline && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-[#E88D67] font-medium italic max-w-2xl mb-8"
        >
          &ldquo;{content.tagline}&rdquo;
        </motion.p>
      )}

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-[family-name:var(--font-playfair)] max-w-4xl"
      >
        <span className="text-foreground">{step.title.split(' ').slice(0, 2).join(' ')}</span>
        <br />
        <span className="bg-gradient-to-r from-[#E88D67] via-[#5B9ECF] to-[#9B7ACC] bg-clip-text text-transparent">
          {step.title.split(' ').slice(2).join(' ')}
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-muted-foreground mt-4 max-w-xl"
      >
        {step.subtitle}
      </motion.p>

      {/* Pipeline diagram */}
      {stages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-2"
        >
          {stages.map((stage, i) => (
            <div key={stage.label} className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel">
                <span className="text-lg">{stage.icon}</span>
                <span className="text-sm font-medium text-foreground">{stage.label}</span>
              </div>
              {i < stages.length - 1 && (
                <span className="text-muted-foreground/40 text-lg">&rarr;</span>
              )}
            </div>
          ))}
        </motion.div>
      )}

      {/* Headline */}
      {content.headline && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-muted-foreground/70 mt-10 max-w-2xl leading-relaxed"
        >
          {content.headline}
        </motion.p>
      )}
    </div>
  );
}
