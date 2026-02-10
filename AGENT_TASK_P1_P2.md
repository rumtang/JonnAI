# Agent Task: Priority 1 (Quick Wins) + Priority 2 (Code Quality) Improvements

## Mission
Apply codebase quality improvements across two priority tiers. This task is designed
for autonomous execution in `--dangerously-skip-permissions` mode.

## Important Context
- Project root: `/Users/jonatkin/Documents/Agentic/AgenticAI/Agentic`
- Stack: Next.js 16.1.6 + React 19 + TypeScript 5 + Zustand 5 + Three.js + react-force-graph-3d
- All source code is currently UNTRACKED in git (only one initial empty commit exists)
- The project builds and runs successfully as-is — do NOT break it

## Safety Rules
- Run `npm run build` after completing ALL changes to verify no TypeScript errors
- Run `npm run lint` after build to verify no ESLint violations
- If build or lint fails, fix the issues before committing
- Do NOT modify any Three.js rendering logic, graph algorithms, or store mutation logic
- Do NOT delete any files except those explicitly listed
- Do NOT install new dependencies unless explicitly stated
- Commit at the END after verifying everything works

---

## Task 1.1: Update Root Layout Metadata

**File:** `src/app/layout.tsx`

Find the existing metadata export (around line 21-24):
```typescript
export const metadata: Metadata = {
  title: "Organizational Intelligence Layer",
  description: "Interactive 3D visualization of why semantic knowledge layers matter more than linear AI agent deployment",
};
```

Replace with:
```typescript
export const metadata: Metadata = {
  title: "Agentic — Knowledge Graph Visualization",
  description: "Interactive 3D visualization of AI-powered content production workflows with human-in-the-loop gates",
  openGraph: {
    title: "Agentic — Knowledge Graph Visualization",
    description: "Interactive 3D visualization of AI-powered content production workflows",
    type: "website",
  },
};
```

---

## Task 1.2: Add Graph Page Metadata

**File:** `src/app/graph/layout.tsx`

Current file is just:
```typescript
export default function GraphLayout({ children }: { children: React.ReactNode }) {
  return <div className="w-screen h-screen overflow-hidden relative">{children}</div>;
}
```

Add metadata import and export BEFORE the component:
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Graph Explorer — Agentic",
};

export default function GraphLayout({ children }: { children: React.ReactNode }) {
  return <div className="w-screen h-screen overflow-hidden relative">{children}</div>;
}
```

---

## Task 1.5: Create .env.example

**Create new file:** `.env.example`

Content:
```
# Agentic Knowledge Graph Visualization
# Copy this file to .env.local and fill in values as needed

# No environment variables required for local development
# Future API integrations will be configured here
```

---

## Task 2.1: Zustand `useShallow` Optimization (LARGEST TASK)

**Why:** Destructuring entire stores (`const { a, b, c } = useStore()`) causes re-renders
on ANY store change. The `useShallow` wrapper from Zustand only re-renders when selected
values actually change (shallow comparison).

**Pattern to apply:**

For STATE values (data that changes), wrap with useShallow:
```typescript
import { useShallow } from 'zustand/react/shallow';

// Group state values in useShallow
const { selectedNode, hoveredNode, graphData } = useGraphStore(
  useShallow((s) => ({
    selectedNode: s.selectedNode,
    hoveredNode: s.hoveredNode,
    graphData: s.graphData,
  }))
);
```

For ACTION functions (setters/dispatchers that never change), use individual selectors:
```typescript
const selectNode = useGraphStore(s => s.selectNode);
const hoverNode = useGraphStore(s => s.hoverNode);
```

### File-by-file instructions:

#### 2.1.1 — `src/components/graph/GraphScene.tsx`

Find (around lines 44-61):
```typescript
const {
    graphData,
    selectedNode,
    hoveredNode,
    highlightedNodeIds,
    selectNode,
    hoverNode,
    setHighlightedNodeIds,
    clearHighlights,
    visibleNodeTypes,
    visibleLinkTypes,
    searchQuery,
    flashingLinkKey,
    highlightedLinkTypes,
    revealedNodeIds,
    progressiveReveal,
    expandNode,
  } = useGraphStore();
```

Replace with:
```typescript
  // State values — re-render only when these change
  const {
    graphData,
    selectedNode,
    hoveredNode,
    highlightedNodeIds,
    visibleNodeTypes,
    visibleLinkTypes,
    searchQuery,
    flashingLinkKey,
    highlightedLinkTypes,
    revealedNodeIds,
    progressiveReveal,
  } = useGraphStore(
    useShallow((s) => ({
      graphData: s.graphData,
      selectedNode: s.selectedNode,
      hoveredNode: s.hoveredNode,
      highlightedNodeIds: s.highlightedNodeIds,
      visibleNodeTypes: s.visibleNodeTypes,
      visibleLinkTypes: s.visibleLinkTypes,
      searchQuery: s.searchQuery,
      flashingLinkKey: s.flashingLinkKey,
      highlightedLinkTypes: s.highlightedLinkTypes,
      revealedNodeIds: s.revealedNodeIds,
      progressiveReveal: s.progressiveReveal,
    }))
  );

  // Actions — stable references, no useShallow needed
  const selectNode = useGraphStore(s => s.selectNode);
  const hoverNode = useGraphStore(s => s.hoverNode);
  const setHighlightedNodeIds = useGraphStore(s => s.setHighlightedNodeIds);
  const clearHighlights = useGraphStore(s => s.clearHighlights);
  const expandNode = useGraphStore(s => s.expandNode);
```

Also change the presentation store usage:
```typescript
  const { mode } = usePresentationStore();
```
Replace with:
```typescript
  const mode = usePresentationStore(s => s.mode);
```

Also change the UI store usage:
```typescript
  const { setDetailPanelOpen } = useUIStore();
```
Replace with:
```typescript
  const setDetailPanelOpen = useUIStore(s => s.setDetailPanelOpen);
```

Add import at top of file:
```typescript
import { useShallow } from 'zustand/react/shallow';
```

#### 2.1.2 — `src/components/presentation/PresentationController.tsx`

Find the store destructuring blocks (around lines 85-108). Read the file first to find
the exact lines. Apply the same pattern: state values in `useShallow`, actions as individual selectors.

Add import:
```typescript
import { useShallow } from 'zustand/react/shallow';
```

#### 2.1.3 — `src/components/graph/ModeToggle.tsx`

Find (around lines 14-16):
```typescript
  const { mode, setMode, reset } = usePresentationStore();
  const { loadFullGraph, loadLinearView, resetFilters, clearHighlights, clearNavigation, selectNode, initCoreNodes, fullGraphData } = useGraphStore();
  const { startCampaign, resetCampaign } = useCampaignStore();
```

Replace with:
```typescript
  import { useShallow } from 'zustand/react/shallow';

  const { mode } = usePresentationStore(useShallow((s) => ({ mode: s.mode })));
  const setMode = usePresentationStore(s => s.setMode);
  const reset = usePresentationStore(s => s.reset);

  const { fullGraphData } = useGraphStore(useShallow((s) => ({ fullGraphData: s.fullGraphData })));
  const loadFullGraph = useGraphStore(s => s.loadFullGraph);
  const loadLinearView = useGraphStore(s => s.loadLinearView);
  const resetFilters = useGraphStore(s => s.resetFilters);
  const clearHighlights = useGraphStore(s => s.clearHighlights);
  const clearNavigation = useGraphStore(s => s.clearNavigation);
  const selectNode = useGraphStore(s => s.selectNode);
  const initCoreNodes = useGraphStore(s => s.initCoreNodes);

  const startCampaign = useCampaignStore(s => s.startCampaign);
  const resetCampaign = useCampaignStore(s => s.resetCampaign);
```

(Add the `useShallow` import at top of file)

#### 2.1.4 — `src/components/graph/NodeDetailPanel.tsx`

Read the file first to find the exact destructuring. Apply the same pattern: state in useShallow, actions as individual selectors. Add import.

#### 2.1.5 — `src/components/graph/GraphControls.tsx`

Find (around line 22):
```typescript
  const { visibleNodeTypes, toggleNodeTypeVisibility, resetFilters, clearHighlights, progressiveReveal, showAllNodes, resetToCore } = useGraphStore();
```

Replace with:
```typescript
  const { visibleNodeTypes, progressiveReveal } = useGraphStore(
    useShallow((s) => ({ visibleNodeTypes: s.visibleNodeTypes, progressiveReveal: s.progressiveReveal }))
  );
  const toggleNodeTypeVisibility = useGraphStore(s => s.toggleNodeTypeVisibility);
  const resetFilters = useGraphStore(s => s.resetFilters);
  const clearHighlights = useGraphStore(s => s.clearHighlights);
  const showAllNodes = useGraphStore(s => s.showAllNodes);
  const resetToCore = useGraphStore(s => s.resetToCore);
```

Add import.

#### 2.1.6 — `src/components/graph/SearchBar.tsx`

Find (around line 18):
```typescript
  const { graphData, fullGraphData, setSearchQuery, selectNode, setHighlightedNodeIds, visibleNodeTypes } = useGraphStore();
```

Replace with:
```typescript
  const { graphData, fullGraphData, visibleNodeTypes } = useGraphStore(
    useShallow((s) => ({ graphData: s.graphData, fullGraphData: s.fullGraphData, visibleNodeTypes: s.visibleNodeTypes }))
  );
  const setSearchQuery = useGraphStore(s => s.setSearchQuery);
  const selectNode = useGraphStore(s => s.selectNode);
  const setHighlightedNodeIds = useGraphStore(s => s.setHighlightedNodeIds);
```

Add import.

#### 2.1.7 — `src/components/graph/CampaignMode/CampaignNodeCard.tsx`

Find (around lines 19-20):
```typescript
  const { currentNodeId, advanceToNext, makeGateDecision } = useCampaignStore();
  const { graphData, selectNode } = useGraphStore();
```

Replace with:
```typescript
  const currentNodeId = useCampaignStore(s => s.currentNodeId);
  const advanceToNext = useCampaignStore(s => s.advanceToNext);
  const makeGateDecision = useCampaignStore(s => s.makeGateDecision);
  const graphData = useGraphStore(s => s.graphData);
  const selectNode = useGraphStore(s => s.selectNode);
```

(No useShallow needed here — small number of individual selectors is fine)

#### 2.1.8 — `src/components/graph/CampaignMode/CampaignSummary.tsx`

Find (around lines 19-21). Read the file, apply same pattern.

#### 2.1.9 — `src/components/graph/CampaignMode/CampaignHeader.tsx`

Find (around lines 10-11):
```typescript
  const { campaignName, setCampaignName, currentNodeId, stepCount, revisionCount, totalEstimatedMinutes } = useCampaignStore();
  const { graphData } = useGraphStore();
```

Replace with:
```typescript
  const { campaignName, currentNodeId, stepCount, revisionCount, totalEstimatedMinutes } = useCampaignStore(
    useShallow((s) => ({
      campaignName: s.campaignName,
      currentNodeId: s.currentNodeId,
      stepCount: s.stepCount,
      revisionCount: s.revisionCount,
      totalEstimatedMinutes: s.totalEstimatedMinutes,
    }))
  );
  const setCampaignName = useCampaignStore(s => s.setCampaignName);
  const graphData = useGraphStore(s => s.graphData);
```

Add import.

#### 2.1.10 — `src/components/graph/NavigationBreadcrumb.tsx`

Find (around line 15). Read the file, apply same pattern.

#### 2.1.11 — `src/components/graph/CampaignMode/CampaignLog.tsx`

Find (around lines 8-9):
```typescript
  const { log } = useCampaignStore();
  const { graphData, selectNode } = useGraphStore();
```

Replace with:
```typescript
  const log = useCampaignStore(s => s.log);
  const graphData = useGraphStore(s => s.graphData);
  const selectNode = useGraphStore(s => s.selectNode);
```

(Individual selectors, no useShallow needed for single values)

---

## Task 2.2: Add React Error Boundary

**Create new file:** `src/components/ErrorBoundary.tsx`

```typescript
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center h-screen gap-4 text-foreground">
          <div className="glass-panel p-8 rounded-xl max-w-md text-center space-y-4">
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p className="text-sm opacity-70">
              The 3D visualization encountered an error. This is usually caused by a WebGL issue.
            </p>
            {this.state.error && (
              <pre className="text-xs opacity-50 overflow-auto max-h-24 text-left bg-black/20 p-2 rounded">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Modify:** `src/app/graph/page.tsx`

Add import:
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';
```

Find where `<GraphScene />` is rendered and wrap it:
```typescript
<ErrorBoundary>
  <GraphScene />
</ErrorBoundary>
```

---

## Task 2.3: Fix Presentation Step Durations

**File:** `src/data/presentation-steps.json`

For each step object, update the `"duration"` value:

- `"id": "act1-title"` → `"duration": 5000`
- `"id": "act1-lifecycle"` → `"duration": 15000`
- `"id": "act2-agents-and-context"` → `"duration": 25000`
- `"id": "act3-graph-reveal"` → `"duration": 12000`
- `"id": "act4-intelligence-layer"` → `"duration": 25000`
- `"id": "act6-close"` → `"duration": 15000`

---

## Task 2.4: Add Suspense Boundary

**File:** `src/app/graph/page.tsx`

Add import:
```typescript
import { Suspense } from 'react';
```

Find where `<GraphScene />` (inside the ErrorBoundary) is rendered and wrap:
```typescript
<ErrorBoundary>
  <Suspense fallback={
    <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse text-foreground/50">Loading visualization...</div>
    </div>
  }>
    <GraphScene />
  </Suspense>
</ErrorBoundary>
```

---

## Task 1.4: Update README.md

**Replace entire file content with:**

```markdown
# Agentic — Knowledge Graph Visualization

Interactive 3D visualization of AI-powered content production workflows. Built to demonstrate
how AI agents, human-in-the-loop gates, and knowledge inputs work together in a marketing
content lifecycle.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Modes

- **Guided Presentation** — Narrated walkthrough of the content production lifecycle,
  from linear pipeline to full knowledge graph
- **Free Exploration** — Interactive 3D graph with search, filtering, and node inspection
- **Campaign Walkthrough** — Step through a workflow node-by-node, making gate decisions
  at each checkpoint

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5
- **3D Visualization:** react-force-graph-3d + Three.js + three-spritetext
- **State Management:** Zustand 5
- **UI:** shadcn/ui + Tailwind CSS 4 + Framer Motion
- **Icons:** Lucide React

## Project Structure

```
src/
├── app/            # Next.js pages and API routes
├── components/     # React components (graph, presentation, campaign, UI)
├── lib/            # Stores, graph utilities, types, styling configs
└── data/           # Graph data (seed-graph.json), presentation steps
```

## Data Model

- **4 Node Types:** step (actions), gate (checkpoints), agent (AI), input (data/references)
- **7 Link Types:** flows-to, reviews, escalates-to, uses, performs, returns-to, linear-flow
- **5 Lifecycle Phases:** Brief → Creation → Review → Publish → Measure

## Development

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
```
```

---

## Task 1.3: Git Commit

After ALL tasks above are complete AND `npm run build` AND `npm run lint` both pass:

```bash
git add -A
git commit -m "chore: apply P1+P2 codebase improvements

- Update metadata for SEO and link sharing
- Add .env.example template
- Add React Error Boundary around 3D graph
- Optimize Zustand store consumers with useShallow (10 files)
- Fix presentation step durations for auto-play
- Add Suspense boundary around GraphScene
- Replace boilerplate README with project documentation

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Final Verification Checklist

After committing, verify:
- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run dev` starts successfully
- [ ] Landing page loads at http://localhost:3000
- [ ] "Guided Presentation" mode works (all 6 steps, camera transitions, narration)
- [ ] "Free Exploration" mode works (search, filters, node selection, zoom)
- [ ] Campaign mode works (step advancement, gate decisions)
- [ ] No console errors in browser DevTools
