'use client';

import { motion } from 'framer-motion';
import type { RoiStep } from '@/data/roi-steps';

interface RoiTitleSlideProps {
  step: RoiStep;
}

export default function RoiTitleSlide({ step }: RoiTitleSlideProps) {
  const { content } = step;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      {/* Tagline */}
      {content.tagline && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-[#14B8A6] font-medium italic max-w-2xl mb-8"
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
        <span className="bg-gradient-to-r from-[#14B8A6] via-[#5B9ECF] to-[#9B7ACC] bg-clip-text text-transparent">
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

      {/* Animated teal pulse indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12 flex items-center gap-2 text-[#14B8A6]/60"
      >
        <span className="text-xs">Navigate with arrow keys or click next</span>
        <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          &rarr;
        </motion.span>
      </motion.div>
    </div>
  );
}
