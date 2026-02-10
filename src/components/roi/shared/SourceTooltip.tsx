'use client';

import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { CONFIDENCE_LEVELS, type ConfidenceLevel } from '@/lib/roi/engine';

interface SourceTooltipProps {
  source: string;
  confidence: ConfidenceLevel;
  sampleSize?: string;
  children: React.ReactNode;
}

// Wraps benchmark labels with an info icon that shows source attribution on hover
export default function SourceTooltip({ source, confidence, sampleSize, children }: SourceTooltipProps) {
  const level = CONFIDENCE_LEVELS[confidence];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-0.5 cursor-help">
            {children}
            <Info className="w-2.5 h-2.5 text-muted-foreground/40 shrink-0" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[220px] text-left">
          <p className="text-[10px] font-semibold mb-0.5">{source}</p>
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: level.color }}
            />
            <span className="text-[9px] opacity-80">{level.label} confidence</span>
          </div>
          {sampleSize && (
            <p className="text-[9px] opacity-60 mt-0.5">Sample: {sampleSize}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
