# Execution Brief for Claude Code

> **What this is:** A directive for a Claude Code session to implement improvements to the Agentic platform. The full specification is in `IMPLEMENTATION-PLAN.md`. This file tells you how to work through it.

---

## YOUR ROLE

You are executing a pre-approved implementation plan. The spec has been reviewed and approved. Do not interview me, do not write a new SPEC.md, do not ask clarifying questions unless something is genuinely ambiguous or contradicts existing code. Just build.

Override the CLAUDE.md instruction to "interview me before coding" — that step is done. The plan is in `IMPLEMENTATION-PLAN.md`. Read it fully before writing any code.

## HOW TO WORK

1. **Read `IMPLEMENTATION-PLAN.md` completely before starting.** Understand all 13 tasks, their dependencies, and the build order notes at the bottom.

2. **Execute one task at a time, in order within each tier.** Tier 1 first (Tasks 1.1 through 1.5), then Tier 2 (Tasks 2.1 through 2.5), then Tier 3 (Tasks 3.1 through 3.3). Respect the dependency chain documented in the "Build Order" section.

3. **For each task:**
   - Read the task specification including all file paths and code snippets.
   - Read the actual source files referenced before modifying them (the codebase may have evolved).
   - Implement the changes described. The spec includes exact file paths, code patterns, and component names. Follow them.
   - Run `npm run build` after each task to verify no TypeScript errors.
   - If the build fails, fix the errors before moving on.
   - Git commit with the format specified in the plan: `feat(scope): description`.

4. **Do not refactor unrelated code.** Each task is scoped. Stay in scope.

5. **Do not add dependencies** unless absolutely necessary. The existing stack (Next.js 16, React 19, Zustand 5, Three.js, Framer Motion, Tailwind 4, shadcn/ui, Lucide icons) covers everything in the plan.

6. **When the spec says "create a new component,"** follow the existing patterns:
   - `'use client'` directive at the top of all components.
   - Zustand selectors use `useShallow` for objects, direct selectors for single values and actions.
   - Framer Motion for all animations.
   - `glass-panel` CSS class for frosted-glass UI surfaces.
   - Tailwind for all styling. No CSS modules or inline style objects unless Three.js requires it.
   - Lucide React for icons.

7. **When the spec says "add to an existing file,"** preserve the existing code structure, naming conventions, and comment style. Don't reorganize imports or reformat code you didn't change.

8. **After each tier is complete,** do a full walkthrough:
   - Land on the home page.
   - Click through each mode and verify it loads, navigates, and functions.
   - Test the specific acceptance criteria listed in each task.
   - If anything is broken, fix it before starting the next tier.

## TASK EXECUTION ORDER

```
TIER 1 — Do these first, in this order:
  1.1  Elevate Role Narratives to Primary Mode
  1.4  Rewrite Guided Tour Narrations (independent — can parallel with 1.1)
  1.2  ROI Quick Calc Mode
  1.3  Make Campaign Gate Decisions Real
  1.5  Cross-Mode Session Store (depends on 1.2 for QuickCalcSlide reference)
  → Full walkthrough after Tier 1

TIER 2 — Do these next:
  2.3  Landing Page Copy Cleanup (independent, quick)
  2.2  Guided Discovery in Explore Mode (independent)
  2.1  Audience-Based Landing Page (depends on 1.1 for role mode)
  2.4  Campaign Summary Baseline Comparison
  2.5  Connect Build Mode to Graph (depends partially on 1.5)
  → Full walkthrough after Tier 2

TIER 3 — Polish:
  3.1  Three.js Performance Optimization
  3.2  Shareable ROI URLs
  3.3  Deepen CFO View
  → Final walkthrough
```

## KEY FILES REFERENCE

Before you start, familiarize yourself with these files — they're the ones you'll modify most:

| File | What it does |
|------|-------------|
| `src/app/page.tsx` | Landing page, mode selector buttons |
| `src/app/graph/page.tsx` | Main orchestration — loads data, renders mode controllers |
| `src/lib/store/presentation-store.ts` | AppMode type, guided tour state |
| `src/lib/store/campaign-store.ts` | Campaign workflow state, gate decisions |
| `src/lib/store/roi-store.ts` | ROI input groups, recalculation logic |
| `src/lib/store/graph-store.ts` | Graph data, highlights, filters, progressive reveal |
| `src/lib/store/ui-store.ts` | Sidebar, detail panel, legend visibility |
| `src/data/presentation-steps.json` | Guided tour step definitions (narrations, actions, cameras) |
| `src/data/seed-graph.json` | Full knowledge graph (~45 nodes, ~80 links) |
| `src/data/build-steps.ts` | Build mode slide content |
| `src/data/roi-steps.ts` | ROI slide definitions |
| `src/lib/roi/engine.ts` | Pure-function financial engine |
| `src/components/graph/GraphScene.tsx` | Three.js 3D rendering |
| `src/components/presentation/PresentationController.tsx` | Guided tour controller |
| `src/components/build/BuildController.tsx` | Build mode controller |
| `src/components/roi/RoiController.tsx` | ROI simulator controller |
| `src/components/graph/CampaignMode/CampaignPanel.tsx` | Campaign workflow panel |
| `src/components/graph/CampaignMode/CampaignSummary.tsx` | Campaign completion modal |
| `src/components/graph/RoleMode/RolePicker.tsx` | Role selection modal |
| `src/components/graph/RoleMode/RoleInsightPanel.tsx` | Role walkthrough panel |
| `src/lib/roles/role-definitions.ts` | 675 role narratives (11K lines, read-only reference) |

## WHAT DONE LOOKS LIKE

After all 13 tasks:
- Landing page has audience-based entry points and direct mode access.
- Six modes available: Guided Tour, Your Role + AI, Campaign, Build It, ROI Simulator, Explore.
- Guided tour tells a 10-step narrative story, not a feature tour.
- Campaign decisions cause real branching (revise loops back, escalate injects steps).
- Campaign summary compares results against a manual baseline.
- ROI opens to a 3-input quick calculator with instant projections.
- CFO view shows sensitivity analysis and cost-of-delay modeling.
- ROI configs are shareable via URL.
- Build mode highlights graph nodes per phase.
- Explore mode shows discovery prompts and business-logic filter presets.
- Session state flows between modes (ROI inputs customize Build timeline, etc.).
- Three.js materials are cached, rotation pauses on interaction.
- All copy follows the voice guide: authoritative, measured, no unsourced claims.
- The 3D graph is preserved and enhanced, not replaced.
