'use client';

import { CONFIDENCE_LEVELS, SOURCE_ATTRIBUTION } from '@/lib/roi/engine';
import type { FormulaSection } from '@/data/methodology-content';

interface ResolvedVariable {
  name: string;
  value: string;
}

interface FormulaCardProps {
  section: FormulaSection;
  resolvedVariables: ResolvedVariable[];
  resultValue: string;
}

export default function FormulaCard({
  section,
  resolvedVariables,
  resultValue,
}: FormulaCardProps) {
  const confidence = CONFIDENCE_LEVELS[section.confidence];
  const source = SOURCE_ATTRIBUTION[section.sourceKey];

  return (
    <div className="space-y-2.5">
      {/* Title + Confidence badge */}
      <div className="flex items-center gap-2">
        <h4 className="text-[10px] font-semibold text-foreground leading-tight">
          {section.title}
        </h4>
        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-medium"
          style={{
            backgroundColor: `${confidence.color}18`,
            color: confidence.color,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: confidence.color }}
          />
          {confidence.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-[9px] text-muted-foreground leading-relaxed">
        {section.description}
      </p>

      {/* Formula */}
      <div className="px-2 py-1.5 rounded bg-muted/50 border border-border/50">
        <code className="text-[9px] text-foreground/80 font-mono">
          {section.formula}
        </code>
      </div>

      {/* Your Numbers table */}
      {resolvedVariables.length > 0 && (
        <div className="rounded border border-border/50 overflow-hidden">
          <table className="w-full text-[9px]">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-2 py-1 font-medium text-muted-foreground">
                  Variable
                </th>
                <th className="text-right px-2 py-1 font-medium text-muted-foreground">
                  Your Value
                </th>
              </tr>
            </thead>
            <tbody>
              {resolvedVariables.map((v) => (
                <tr key={v.name} className="border-t border-border/30">
                  <td className="px-2 py-1 text-muted-foreground">{v.name}</td>
                  <td className="px-2 py-1 text-right text-foreground font-medium">
                    {v.value}
                  </td>
                </tr>
              ))}
              {/* Result row */}
              <tr className="border-t border-border/50 bg-muted/20">
                <td className="px-2 py-1 font-semibold text-foreground">
                  = {section.resultLabel}
                </td>
                <td className="px-2 py-1 text-right font-bold text-foreground">
                  {resultValue}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Source attribution */}
      {source && (
        <p className="text-[8px] text-muted-foreground/70 italic">
          Source: {source.source}
          {source.sampleSize && ` (${source.sampleSize})`}
        </p>
      )}
    </div>
  );
}
