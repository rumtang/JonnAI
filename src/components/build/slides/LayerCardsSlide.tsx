'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import BuildCard from '../BuildCard';
import type { BuildStep } from '@/data/build-steps';

interface LayerCardsSlideProps {
  step: BuildStep;
  expandedCards: Set<string>;
  onToggleCard: (id: string) => void;
}

export default function LayerCardsSlide({ step, expandedCards, onToggleCard }: LayerCardsSlideProps) {
  const { content, themeColor } = step;
  const cards = content.cards ?? [];
  const processIssues = content.processIssues;

  const actionColors: Record<string, string> = {
    'fix-first': '#D4856A',
    'encode-as-is': '#5B9ECF',
    'must-add': '#C9A04E',
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
      {/* Layer header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-2"
      >
        <div>
          <p className="text-xs text-muted-foreground">{content.layerDescription}</p>
        </div>
        {content.priorityBadge && (
          <span
            className="flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
          >
            {content.priorityBadge}
          </span>
        )}
      </motion.div>

      {/* Callout box */}
      {content.callout && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 glass-panel rounded-xl p-4"
          style={{ borderLeft: `3px solid ${themeColor}` }}
        >
          <div className="flex items-start gap-3">
            {content.callout.icon && <span className="text-xl flex-shrink-0">{content.callout.icon}</span>}
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">{content.callout.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{content.callout.body}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Process optimization table (only on process layer slide) */}
      {processIssues && processIssues.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            Process Optimization Assessment
          </h3>
          <div className="space-y-2">
            {processIssues.map((issue) => (
              <div key={issue.issue} className="glass-panel rounded-lg p-3 flex items-start gap-3">
                <span
                  className="flex-shrink-0 px-2 py-0.5 rounded text-[9px] font-bold uppercase mt-0.5"
                  style={{
                    backgroundColor: `${actionColors[issue.actionType]}20`,
                    color: actionColors[issue.actionType],
                  }}
                >
                  {issue.action}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground">{issue.issue}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{issue.rationale}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
          >
            <BuildCard
              id={card.id}
              icon={card.icon}
              title={card.title}
              summary={card.whatToExtract[0]}
              source={card.typicalSource.split(',')[0]}
              expanded={expandedCards.has(card.id)}
              onToggle={() => onToggleCard(card.id)}
              themeColor={themeColor}
            >
              {/* Expanded: full extraction points */}
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    What to Extract
                  </p>
                  <ul className="space-y-1">
                    {card.whatToExtract.map((point) => (
                      <li key={point} className="text-xs text-foreground/80 flex items-start gap-2">
                        <span className="text-muted-foreground/50 mt-0.5 flex-shrink-0">&bull;</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Typical Source
                  </p>
                  <p className="text-xs text-foreground/70">{card.typicalSource}</p>
                </div>

                {/* Quality gate warning */}
                <div className="rounded-lg p-2.5" style={{ backgroundColor: `${themeColor}08` }}>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: themeColor }} />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: themeColor }}>
                        Quality Gate
                      </p>
                      <p className="text-[11px] text-foreground/70">{card.qualityGate}</p>
                    </div>
                  </div>
                </div>

                {/* KG layer tag */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">Feeds:</span>
                  <span
                    className="px-2 py-0.5 rounded text-[9px] font-mono"
                    style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                  >
                    {card.feedsLayer}
                  </span>
                </div>
              </div>
            </BuildCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
