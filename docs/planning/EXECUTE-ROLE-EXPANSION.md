# Execute: Role Tab Content Expansion

## Context

The role tab in this Next.js app shows a 4-slide walkthrough per role (Overview, Before AI, With AI Agents, Agentic System). The data layer has been expanded with 8-12x richer content per rendered node. Your job is to swap in the expanded data file and upgrade the component to render the new fields — making each slide substantive, interesting, and worth reading.

## What Already Exists

### Expanded Data File (READY)

`src/lib/roles/role-definitions-expanded.ts` — a drop-in replacement for `role-definitions.ts` with:

- **Same exports**: `ROLE_DEFINITIONS`, `ROLE_MAP`, `getRoleNodeIds`, `computeRoleStats`
- **Same interfaces** (backward compatible) with NEW optional fields on `JourneyStage`:
  - `painPoints?: string[]` — 2-4 specific challenges at this maturity stage
  - `benchmarks?: string[]` — industry data points with source attribution
  - `outcomes?: string[]` — measurable results or expected changes
  - `roleEvolution?: string` — how the person's day-to-day work shifts
  - `antiPatterns?: string[]` — common mistakes or failure modes
- **New `StageOverview` interface** on `RoleNarrative`:
  - `stageOverviews?.preAI / aiAgents / aiAgentic` each with `narrative`, `timeAllocation`, `criticalMetrics`, `strategicOpportunity`
- **17 roles total**: 5 deeply expanded (Content Director, Brand Manager, Editor, VP Marketing, Analytics Lead), 12 preserved from original
- **Compiles cleanly** — already verified with `npx tsc --noEmit`

### Current Component Architecture

- `RoleController.tsx` — Navigation wrapper. 4 fixed slides. Keyboard nav. No content logic. **Do not modify unless adding slides.**
- `RoleSlide.tsx` — Renders all 4 slides. **This is the primary file to modify.**
  - Slide 0 (`RoleIntroSlide`): Shows role title, description, tagline, key insight
  - Slides 1-3 (`RoleStageSlide`): Shows "Your Work" and "What Supports You" bullet lists
  - `collectSummaries()` helper: Currently pulls ONLY `summary` from each node's `JourneyStage` — the `detail` field and all new fields are dead data until you render them
- `role-insight-store.ts` — Zustand store. Imports from `role-definitions`. Manages slide index and ordered node IDs.
- `role-subgraph.ts` — Computes role subgraph for 3D visualization. Imports from `role-definitions`.

### Import Chain (all files that import from `role-definitions`)

```
src/lib/store/role-insight-store.ts
src/components/role/RoleSlide.tsx
src/components/graph/CampaignMode/CampaignNodeCard.tsx
src/lib/roles/role-subgraph.ts
src/lib/roles/role-icons.ts (comment reference only)
src/components/graph/RoleMode/RolePicker.tsx
```

## Tasks

### Task 1: Swap the Data File

1. Rename `role-definitions.ts` to `role-definitions.original.ts` (backup)
2. Rename `role-definitions-expanded.ts` to `role-definitions.ts`
3. Verify `npx tsc --noEmit` still passes with no errors
4. Verify the app builds: `npm run build` (or `next build`)

No import changes needed — the filename stays the same after rename.

### Task 2: Upgrade RoleSlide.tsx to Render Rich Content

The current `RoleStageSlide` component renders bare bullet points from `summary` only. Redesign it to render the expanded content. Here is the current rendering logic and what needs to change:

**Current "Your Work" section** (lines 141-158 in RoleSlide.tsx):
- Renders `summary` as plain bullet points
- `detail`, `painPoints`, `benchmarks`, `outcomes`, `roleEvolution` are all available in the data but not rendered

**Current "What Supports You" section** (lines 161-178):
- Same pattern — summary bullets only

**What to build — the slide should feel like a strategic briefing, not a bulleted list:**

For each node in "Your Work" and "What Supports You":

1. **Summary** (existing) — keep as the primary bullet, but now it's 2-3 sentences, so it may need different typography (slightly larger, or as a lead paragraph)
2. **Detail** — render as an expandable/collapsible paragraph below the summary. Use a disclosure triangle or "Read more" toggle. This is a rich paragraph with examples and context.
3. **Pain Points** — if present, render as a compact list with a warning/alert icon. Use muted, smaller text. These should feel like "watch out for this" callouts.
4. **Benchmarks** — if present, render as data callouts with a chart/trending icon. Source attribution should be visible but subtle (parenthetical, smaller text).
5. **Outcomes** — if present, render as a result/impact section with a check or target icon.
6. **Role Evolution** — if present, render as a brief italicized paragraph at the end of each node's section, framing how the person's work changes.

**For the stage-level overview (NEW section at top of each stage slide):**

If `role.narrative.stageOverviews?.[stage]` exists, render BEFORE the "Your Work" section:
- `narrative` — 2-3 sentence framing paragraph for this stage
- `timeAllocation` — render as a compact bar or inline text showing time distribution
- `criticalMetrics` — render as small pills/tags
- `strategicOpportunity` — render as a highlighted callout box

**For the Intro slide (slide 0):**

If `stageOverviews` exists, consider adding a compact preview of how the role evolves across stages — e.g., three small cards showing the time allocation shift from preAI to aiAgentic.

### Design Constraints

- **Keep the existing glass-panel aesthetic**. Use `glass-panel`, `rounded-2xl`, existing color tokens.
- **Use the role's `accentColor`** for all accent elements (icons, borders, backgrounds).
- **Stage colors**: preAI=#94a3b8, aiAgents=#6BAED6, aiAgentic=#4CAF50
- **The panel scrolls** — `max-h-[calc(100vh-200px)] overflow-y-auto` is already set. With richer content, scrolling is expected and fine.
- **Mobile responsive** — content should work on mobile (the app uses `useIsMobile()` hook). Keep text readable, collapse detail sections by default on mobile.
- **Framer Motion** — the app already uses framer-motion for animations. Use `motion.div` for reveals, staggered entry, expand/collapse animations.
- **Lucide icons** — already imported. Use: `AlertTriangle` for pain points, `TrendingUp` for benchmarks, `Target` for outcomes, `UserCog` or `Briefcase` for role evolution.
- **No new dependencies** — use only what's already in the project (React 19, framer-motion, lucide-react, Tailwind CSS 4).

### Task 3: Verify

1. `npm run build` passes
2. Select "Content Director" role — all 4 slides render with expanded content
3. "Your Work" section shows rich content with expandable details
4. "What Supports You" section renders (previously empty because support nodes had no `nodeJourneys` — they do now in the expanded file)
5. Stage overview appears at the top of slides 1-3 for the 5 expanded roles
6. Scrolling works smoothly on desktop and mobile
7. No TypeScript errors, no console warnings

## What NOT to Do

- Do not change the 4-slide structure (Overview, Before AI, With AI Agents, Agentic System)
- Do not change the navigation, keyboard shortcuts, or slide transition animations
- Do not modify `RoleController.tsx` unless absolutely necessary
- Do not modify the 3D graph visualization or any graph-related code
- Do not add new npm dependencies
- Do not rewrite content — the data is already written and researched. Just render it.
- Do not touch the 12 non-expanded roles — they use the same interface and will render fine with the basic summary/detail fields

## File Locations

```
src/lib/roles/role-definitions.ts          ← current data (will become backup)
src/lib/roles/role-definitions-expanded.ts ← expanded data (will become the new role-definitions.ts)
src/components/role/RoleSlide.tsx           ← primary component to modify
src/components/role/RoleController.tsx      ← navigation wrapper (read-only reference)
src/lib/store/role-insight-store.ts         ← store (read-only reference)
```

## Tech Stack

- Next.js 16, React 19, TypeScript
- Zustand 5 (state management)
- Framer Motion (animations)
- Tailwind CSS 4 (styling)
- Lucide React (icons)
- Three.js / React Three Fiber (3D graph — do not touch)
