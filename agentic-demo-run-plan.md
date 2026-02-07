# Agentic Demo — Claude Code CLI Execution Plan

## Context

This is a Next.js 16 + React 19 + TypeScript 5 project that renders a 3D knowledge graph visualization using react-force-graph-3d and Three.js. It was recently refactored from a generic org-complexity demo to a focused content production lifecycle demo with 4 node types (step, gate, agent, input) and human-in-the-loop escalation patterns.

The project lives in the `Agentic/` directory (wherever your local clone is).

## Step 1: Verify & Install

```bash
cd ~/path/to/Agentic  # adjust to your actual path
node -v               # should be 18+ (ideally 20+)
npm install
```

## Step 2: Type Check

```bash
npx tsc --noEmit
```

Should return zero errors. If you see errors in `ContactImporter.tsx`, it means the cleanup from the last session didn't persist — the fix is:
- Line 39: replace `const { addPersonNode } = useGraphStore()` with `const _graphStore = useGraphStore()`
- Lines 72-77: comment out the `selected.forEach(c => { addPersonNode(...) })` block

## Step 3: Run Dev Server

```bash
npm run dev
```

Open `http://localhost:3000` (or whatever port Next.js assigns). The landing page should show two mode options: **Guided** (presentation walkthrough) and **Explore** (free-roam 3D graph).

## Step 4: Validate the Demo Flow

### Guided Mode (the demo path)
Click through all 8 presentation steps and verify:

1. **The Content Production Lifecycle** — fade-in title card
2. **The Linear View** — 5 nodes in a horizontal line: Brief → Creation → Review → Publish → Measure, connected by white `linear-flow` links with particles
3. **Where AI Agents Fit** — 4 agent nodes (purple tori) appear below their parent steps, connected by `performs` links
4. **The Real Complexity** — full graph explodes into 3D with all 24 nodes and 49 links
5. **Human-in-the-Loop Gates** — 5 red dodecahedron gate nodes highlight (brief-approval, quality-check, brand-review, stakeholder-signoff, performance-review)
6. **What Agents Are Grounded In** — agent and input nodes highlight, showing `uses` links
7. **When Work Escalates** — escalation paths and return-to links highlight
8. **Explore the Full Picture** — full reveal, all nodes/links visible

### Explore Mode
Switch to explore and verify:
- Legend shows 4 types with correct colors (blue steps, red gates, purple agents, amber inputs)
- Node type filters work (toggle each on/off)
- Clicking a node opens the detail panel with the correct meta renderer (StepMeta, GateMeta, AgentMeta, InputMeta)
- Search finds nodes by label

## Step 5: Known Issues to Watch For

1. **SWC binary**: If `next dev` fails downloading `@next/swc-*`, run `npm install @next/swc-linux-x64-gnu` (or the appropriate platform binary) explicitly.

2. **Force graph SSR**: `react-force-graph-3d` doesn't support SSR. The project uses a dynamic import wrapper (`ForceGraph3DWrapper.tsx`) with `ssr: false`. If you see hydration errors, verify that wrapper is intact.

3. **Camera positions**: Steps 5-7 use `cameraLookAt: null` which won't re-center the camera on highlighted subgraphs. If the demo feels spatially disorienting during those steps, set explicit lookAt coordinates in `presentation-steps.json`.

4. **Presentation step durations**: All steps have `duration: 0` meaning no auto-advance. Fine for manual click-through, but if you want unattended kiosk mode later, set 8-10s per step.

## File Reference

Key files if Claude Code needs to make fixes:

| File | Purpose |
|------|---------|
| `src/lib/graph/types.ts` | Core type definitions (NodeType, LinkType, meta interfaces) |
| `src/data/seed-graph.json` | All 24 nodes and 49 links |
| `src/data/linear-process.json` | 5-phase linear view + 4 agent positions |
| `src/data/presentation-steps.json` | 8-step guided narrative |
| `src/lib/graph/node-styles.ts` | Visual config per node type |
| `src/lib/graph/link-styles.ts` | Visual config per link type |
| `src/lib/store/graph-store.ts` | Zustand graph state |
| `src/components/graph/GraphScene.tsx` | Main 3D render component |
| `src/components/presentation/PresentationController.tsx` | Guided mode step execution |
| `src/components/graph/NodeDetailPanel.tsx` | Click-to-inspect detail panel |
| `src/app/graph/page.tsx` | Graph page entry point |
