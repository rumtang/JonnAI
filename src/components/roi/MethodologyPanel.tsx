'use client';

import { useMemo } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { useRoiStore } from '@/lib/store/roi-store';
import { ROI_STEPS } from '@/data/roi-steps';
import {
  DISCOUNT_RATE,
  PROJECTION_MONTHS,
  SCENARIO_MULTIPLIERS,
} from '@/lib/roi/engine';
import { METHODOLOGY } from '@/data/methodology-content';
import type { FormulaVariable } from '@/data/methodology-content';
import FormulaCard from './methodology/FormulaCard';

interface MethodologyPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Value formatting helpers ──────────────────────────────────────
function formatValue(value: number, format: FormulaVariable['format']): string {
  if (value == null || isNaN(value)) return '—';
  switch (format) {
    case 'currency':
      if (Math.abs(value) >= 1_000_000_000)
        return `$${(value / 1_000_000_000).toFixed(1)}B`;
      if (Math.abs(value) >= 1_000_000)
        return `$${(value / 1_000_000).toFixed(1)}M`;
      if (Math.abs(value) >= 1_000)
        return `$${(value / 1_000).toFixed(0)}K`;
      return `$${value.toFixed(0)}`;
    case 'percent':
      // Values stored as whole numbers (e.g. 7.7 for 7.7%) vs decimals (0.10 for 10%)
      if (Math.abs(value) < 1 && value !== 0)
        return `${(value * 100).toFixed(1)}%`;
      return `${value.toFixed(1)}%`;
    case 'number':
      return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
    case 'multiplier':
      return `${value.toFixed(1)}×`;
    case 'months':
      return `${Math.round(value)} months`;
    case 'weeks':
      return `${value.toFixed(1)} weeks`;
    default:
      return String(value);
  }
}

// ─── Resolve a store key path to a numeric value ───────────────────
function resolveStoreKey(
  key: string,
  store: Record<string, unknown>,
): number | undefined {
  // Handle constants that aren't in the store
  if (key.startsWith('_constant.')) {
    const constant = key.split('.')[1];
    const CONSTANTS: Record<string, number> = {
      projectionMonths: PROJECTION_MONTHS,
      discountRate: DISCOUNT_RATE,
      scenarioConservative: SCENARIO_MULTIPLIERS.conservative,
      scenarioExpected: SCENARIO_MULTIPLIERS.expected,
      scenarioAggressive: SCENARIO_MULTIPLIERS.aggressive,
    };
    return CONSTANTS[constant];
  }

  // Handle computed values
  if (key.startsWith('_computed.')) {
    const computed = key.split('.')[1];
    if (computed === 'conservativeAnnualValue') {
      const totalAnnualValue = resolveStoreKey('outputs.totalAnnualValue', store);
      return totalAnnualValue != null
        ? totalAnnualValue * SCENARIO_MULTIPLIERS.conservative
        : undefined;
    }
    return undefined;
  }

  // Handle workflow references like _workflow.0.savingsPct
  if (key.startsWith('_workflow.')) {
    const parts = key.split('.');
    const idx = parseInt(parts[1], 10);
    const field = parts[2];
    const workflows = resolveStoreKey('outputs.workflows', store) as unknown;
    if (Array.isArray(workflows) && workflows[idx]) {
      return workflows[idx][field] as number;
    }
    return undefined;
  }

  // Walk the dot path
  const parts = key.split('.');
  let current: unknown = store;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'number' ? current : undefined;
}

export default function MethodologyPanel({
  open,
  onOpenChange,
}: MethodologyPanelProps) {
  const currentStepIndex = useRoiStore((s) => s.currentStepIndex);
  const org = useRoiStore((s) => s.org);
  const martech = useRoiStore((s) => s.martech);
  const ops = useRoiStore((s) => s.ops);
  const pain = useRoiStore((s) => s.pain);
  const investment = useRoiStore((s) => s.investment);
  const assumptions = useRoiStore((s) => s.assumptions);
  const baseline = useRoiStore((s) => s.baseline);
  const outputs = useRoiStore((s) => s.outputs);

  const step = ROI_STEPS[currentStepIndex];

  // Build a flat object for key resolution
  const storeMap = useMemo(
    () =>
      ({
        org,
        martech,
        ops,
        pain,
        investment,
        assumptions,
        baseline,
        outputs,
      }) as unknown as Record<string, unknown>,
    [org, martech, ops, pain, investment, assumptions, baseline, outputs],
  );

  // Find methodology for current slide
  const slideMethodology = useMemo(
    () => METHODOLOGY.find((m) => m.slideId === step?.id),
    [step?.id],
  );

  // Build all section keys for accordion default-open
  const allSectionIds = useMemo(
    () => slideMethodology?.sections.map((s) => s.id) ?? [],
    [slideMethodology],
  );

  if (!step) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[420px] max-w-[85vw] flex flex-col p-0"
        showCloseButton
      >
        <SheetHeader className="px-4 pt-4 pb-2 border-b border-border/50">
          <SheetTitle className="text-sm font-bold">
            How We Calculate
          </SheetTitle>
          <SheetDescription className="text-[10px] text-muted-foreground leading-relaxed">
            {slideMethodology
              ? slideMethodology.overview
              : 'Formula breakdowns for the current slide.'}
          </SheetDescription>
          {/* Current slide indicator */}
          <div
            className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-medium w-fit"
            style={{
              backgroundColor: `${step.themeColor}18`,
              color: step.themeColor,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: step.themeColor }}
            />
            {step.title}
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-hidden">
          <div className="px-4 py-3">
            {slideMethodology ? (
              <Accordion
                type="multiple"
                defaultValue={allSectionIds}
                className="w-full"
              >
                {slideMethodology.sections.map((section) => {
                  // Resolve variables for this formula
                  const resolvedVariables = section.variables.map((v) => {
                    const raw = resolveStoreKey(v.storeKey, storeMap);
                    return {
                      name: v.name,
                      value: raw != null ? formatValue(raw, v.format) : '—',
                    };
                  });

                  // Resolve result value
                  const rawResult = resolveStoreKey(
                    section.resultKey,
                    storeMap,
                  );
                  const resultValue =
                    rawResult != null
                      ? formatValue(rawResult, section.resultFormat)
                      : '—';

                  return (
                    <AccordionItem key={section.id} value={section.id}>
                      <AccordionTrigger className="text-[10px] hover:no-underline">
                        {section.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <FormulaCard
                          section={section}
                          resolvedVariables={resolvedVariables}
                          resultValue={resultValue}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              <div className="text-center py-8">
                <p className="text-[10px] text-muted-foreground">
                  No methodology breakdown available for this slide.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
