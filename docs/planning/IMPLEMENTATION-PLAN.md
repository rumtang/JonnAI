# Implementation Plan: Agentic Platform Improvements

> **For Claude Code execution.** Each task is self-contained with specific files, changes, and acceptance criteria. Execute in order within each tier. Each task should be a single commit.

---

## CONTEXT

Agentic is a Next.js 16 / React 19 / Three.js interactive knowledge graph visualization with 5 modes: Guided Tour, Explore, Campaign, Build It, ROI Simulator. State management uses Zustand 5 with 7 stores. The 3D graph is the centerpiece and must be preserved — no 2D replacement. All improvements build on the existing architecture.

**Tech stack:** Next.js 16, React 19, TypeScript 5, Zustand 5, Three.js + react-force-graph-3d, Framer Motion, Tailwind CSS 4, shadcn/ui.

**Key files to understand before starting:**
- `src/app/page.tsx` — Landing page with 5 mode buttons
- `src/app/graph/page.tsx` — Main orchestration hub, loads data, renders mode controllers
- `src/lib/store/*.ts` — 7 Zustand stores (graph, presentation, campaign, build, roi, role-insight, ui)
- `src/components/graph/GraphScene.tsx` — Three.js 3D rendering
- `src/components/presentation/PresentationController.tsx` — Guided tour (7 steps)
- `src/components/graph/CampaignMode/` — Campaign panel, summary, node cards
- `src/components/build/BuildController.tsx` — Build mode (10 slides)
- `src/components/roi/RoiController.tsx` — ROI simulator (7 slides)
- `src/components/graph/RoleMode/` — Role picker, insight panel, selector button
- `src/lib/roi/engine.ts` — Pure-function financial modeling engine
- `src/data/seed-graph.json` — Full knowledge graph data (~45 nodes, ~80 links)
- `src/lib/roles/role-definitions.ts` — 675 role narratives (11,085 lines)

---

## TIER 1: HIGHEST IMPACT

### Task 1.1: Elevate Role-Based Narratives to a Primary Mode

**Problem:** The role narrative system (675 narratives, 11K lines, 5 roles x 45 nodes x 3 maturity stages) is the most strategically differentiating content in the app. It's buried behind a small button at the bottom of Explore mode. Most users never find it.

**Changes:**

1. **`src/app/page.tsx`** — Add a 6th mode card to the landing page:
   ```
   {
     key: 'role' as const,
     label: 'Your Role + AI',
     description: 'See how AI transforms your specific role across the workflow',
     color: '#5B9ECF',
     badge: 'For Practitioners',
   }
   ```
   Position it second in the array (after Guided Tour). Update the `handleStart` type to include `'role'`.

2. **`src/lib/store/presentation-store.ts`** — Add `'role'` to the `AppMode` type union.

3. **`src/app/graph/page.tsx`** — Handle the `role` mode:
   - When `activeMode === 'role'`, load full graph data (same as explore).
   - In the render block, when `mode === 'role'`, show the `RolePicker` modal immediately (open by default) plus `GraphScene`, `ZoomControls`, and `RoleInsightPanel`.
   - After a role is selected, the graph should filter to the role's subgraph and the `RoleInsightPanel` should appear.

4. **`src/components/graph/RoleMode/RolePicker.tsx`** — When opened in role mode (not explore mode), add a header: "Choose the role closest to yours" and make the modal non-dismissable until a role is selected (no backdrop close, no X button in role mode).

**Acceptance criteria:**
- Landing page shows 6 mode cards.
- Clicking "Your Role + AI" loads graph and immediately opens role picker.
- Selecting a role filters graph and opens the RoleInsightPanel with full walkthrough.
- All existing explore-mode role functionality still works.

---

### Task 1.2: ROI Quick Calc Mode

**Problem:** The ROI simulator requires 25+ inputs across 7 slides before showing a single result. A CFO won't fill out all of that. Need a fast path.

**Changes:**

1. **`src/lib/store/roi-store.ts`** — Add a `quickCalcMode: boolean` field (default `true`). Add a `setQuickCalcMode` action. When `quickCalcMode` is true, `currentStepIndex` starts at 0 (quick calc slide). When toggled to false, jump to step index 1 (first detailed input slide).

2. **`src/data/roi-steps.ts`** — Insert a new step at index 0:
   ```typescript
   {
     id: 'quick-calc',
     title: 'Quick Business Case',
     act: 0,
     actTitle: 'Quick Estimate',
     description: 'Three inputs. Instant projection.',
   }
   ```
   Shift all existing step indices by 1.

3. **Create `src/components/roi/slides/QuickCalcSlide.tsx`** — New component:
   - Three inputs only: Annual Revenue (log-scale slider, $100M–$750B), Industry Vertical (dropdown from `INDUSTRY_BUDGET_RATIOS` keys), Marketing Budget % (auto-populated from industry, editable).
   - On any input change, immediately compute and display a hero results card below the inputs:
     - **Payback Period** (months)
     - **3-Year NPV** (formatted USD)
     - **Annual Efficiency Gain** (formatted USD)
     - **Do-Nothing Risk** (3-year revenue at risk)
   - These numbers come from the existing `computeRoi` engine using the 3 inputs + all other defaults.
   - Below the hero card, a "Refine Your Model" button that sets `quickCalcMode = false` and advances to the detailed inputs.
   - Also show a "Skip to Full Results" link that jumps to the results slide.

4. **`src/components/roi/RoiController.tsx`** — Render `QuickCalcSlide` when `currentStepIndex === 0` and `quickCalcMode === true`. The "Skip to Results" action from the quick calc should call `goToStep(resultsSlideIndex)`.

**Acceptance criteria:**
- ROI mode opens to a single-screen calculator with 3 inputs.
- Changing any input immediately updates the hero numbers (no submit button).
- "Refine Your Model" navigates to the existing detailed input flow.
- All existing ROI slides continue to work when accessed via refinement.

---

### Task 1.3: Make Campaign Gate Decisions Real

**Problem:** Gate decisions (Revise / Escalate) increment counters but don't change the actual path. "Revise" doesn't loop back. "Escalate" doesn't inject a human step. Sophisticated users will notice immediately.

**Changes:**

1. **`src/data/seed-graph.json`** — Verify that every gate node has `returns-to` links pointing back to the appropriate previous step node. Check these gates and add missing links:
   - `brief-approval` → returns-to → `write-brief`
   - `quality-check` → returns-to → `draft-content`
   - `brand-review` → returns-to → `brand-compliance`
   - `legal-compliance-gate` → returns-to → `legal-review`
   - `localization-quality-gate` → returns-to → `localize-content`
   - `stakeholder-signoff` → returns-to → `final-edit`
   - `performance-review` → returns-to → `optimize`
   - `governance-gate` → returns-to → `content-governance`

   Also verify `escalates-to` links exist for each gate. If a gate has no `escalates-to` link, add one pointing to the next human-owned step in the workflow. The escalation targets should make domain sense (e.g., `brand-review` escalates to `final-edit` which is human-owned, `legal-compliance-gate` escalates to the compliance manager step).

2. **`src/lib/store/campaign-store.ts`** — The `makeGateDecision` function already has logic to follow `returns-to` and `escalates-to` links. Verify it works correctly now that the links exist. The key code (lines 236-260) follows `returns-to` for revise and `escalates-to` for escalate — this should now work if the graph data has the links.

   Add a **revision penalty** to the `makeGateDecision` revise path: when returning to a previous step, add 50% of that step's `estimatedTime` to `totalEstimatedMinutes` (revision takes less time than initial execution but still takes time).

   Add an **escalation time injection**: when escalating, add a flat 60 minutes to `totalEstimatedMinutes` (human review time for escalated items).

3. **`src/components/graph/CampaignMode/CampaignPanel.tsx`** — When a revision occurs (campaign navigates backward), show a brief visual indicator: an amber badge on the node card saying "Revision #N" to make the loop visible.

4. **`src/components/graph/CampaignMode/CampaignSummary.tsx`** — Add a baseline comparison section. Below the campaign stats, add a row:
   ```
   Without AI Agents | ~37 steps | ~22.5 hrs | Est. 12 revisions
   Your Campaign     | {steps}   | {time}    | {revisions} revisions
   ```
   The "without AI" baseline is computed from the graph data: sum all step `estimatedTime` values and multiply by 2.5x for the manual baseline (no agent acceleration), assume a 30% rework rate (industry baseline from the ROI engine's `DEFAULT_PAIN.reworkRatePct`).

**Acceptance criteria:**
- Clicking "Revise" at a gate navigates back to the earlier step. The user must re-traverse forward from there.
- Clicking "Escalate" navigates to the escalation target (a human-owned step).
- Revision and escalation add realistic time to the total.
- Campaign summary shows a "without AI" baseline comparison.
- The graph camera flies to the revision/escalation target node (this should already work via the existing `useEffect` in `graph/page.tsx` that watches `currentNodeId`).

---

### Task 1.4: Rewrite Guided Tour Narrations

**Problem:** Narration cards are one sentence each. They label what's on screen instead of telling a story. A guided tour for executives needs tension → insight → implication structure.

**Changes:**

1. **`src/data/presentation-steps.json`** — Rewrite every step's `narration` field. Keep `title`, `action`, `cameraPosition`, etc. unchanged. Only rewrite the narration text.

   Here are the narrative rewrites per step. Preserve the existing step IDs, titles, and actions exactly:

   **Step 1 (title slide):** Keep narration as-is (it's the title card).

   **Step 2 (linear lifecycle / "act1-lifecycle"):**
   > "Every marketing team draws this on a whiteboard — the clean, linear pipeline from brief to publish. In reality, this map is a lie of omission. It hides the 60% of time spent on rework, the approval cycles that kill velocity, and the tribal knowledge that walks out the door every time someone leaves. The question isn't whether the process works. It's how much it costs when it breaks."

   **Step 3 (agents on pipeline / "act2-agents-and-context"):**
   > "The first instinct is to bolt AI agents onto the existing pipeline — an agent for research, another for drafting, one for SEO. This gets results fast: first-draft generation drops from hours to minutes. But it also creates a new problem. Without shared context, each agent operates in isolation. The research agent doesn't know what the brand guide says. The SEO agent doesn't know what the compliance team flagged last quarter. Speed without coherence just produces more content to fix."

   **Step 4 (full graph reveal / "act3-graph-reveal"):**
   > "This is what the process actually looks like. Not a pipeline — a network. Every step connects to review gates, knowledge inputs, agent capabilities, and feedback loops. The complexity isn't a bug; it's the reality of enterprise content production at scale. The organizations that perform aren't the ones that simplify this away. They're the ones that build infrastructure to navigate it."

   **Step 5 (knowledge layer / inputs):**
   > "The infrastructure layer is what separates agents that hallucinate from agents that perform. Brand voice guides, audience personas, compliance rules, performance data — these aren't nice-to-have context. They're the operational substrate that every agent depends on for every decision. When this layer is incomplete or stale, agent output degrades. When it's well-maintained, it compounds — every new piece of organizational knowledge makes every agent more capable."

   **Step 6 (human roles / gates):**
   > "Human-in-the-loop isn't a safety net — it's a design principle. Every gate in this graph represents a point where human judgment is irreplaceable: brand exceptions that require taste, legal ambiguities that require interpretation, strategic pivots that require context no model has. The pattern that works isn't AI replacing humans or humans supervising AI. It's a clear contract: agents handle volume and velocity, humans handle judgment and accountability."

   **Step 7 (strategic vision / full reveal):**
   > "The thesis is simple. Agents will commoditize — the cost of generating content, optimizing media, and scoring performance will approach zero. What won't commoditize is the organizational intelligence that makes those agents effective: the knowledge graph, the governance rules, the feedback loops, the escalation logic. The organizations building that infrastructure now are creating a compounding advantage. The ones waiting for agents to get smarter are renting capability they'll never own."

2. **Also in `presentation-steps.json`** — Add 3 new steps to expand the tour from 7 to 10 steps. Insert them as follows:

   **New step after step 2 (insert at index 2), ID: "act1-pain-points":**
   ```json
   {
     "id": "act1-pain-points",
     "title": "Where the Pipeline Breaks",
     "narration": "At enterprise scale, this pipeline breaks in predictable ways. Twenty percent of content gets reworked because the brief was ambiguous. Approval cycles average seven business days because reviewers lack context. Sixty percent of marketer time goes to administrative coordination, not strategic work. These aren't efficiency problems — they're structural failures baked into a linear model that doesn't match how work actually flows.",
     "action": "show-process-chart",
     "cameraPosition": { "x": 0, "y": 200, "z": 800 },
     "cameraTransitionMs": 2000,
     "duration": 8000
   }
   ```

   **New step after the current step 4 (full graph reveal), ID: "act3-feedback-loops":**
   ```json
   {
     "id": "act3-feedback-loops",
     "title": "Feedback Loops and Revision Cycles",
     "narration": "The arrows flowing backward are the real story. Every review gate can send work back for revision. Every escalation pulls a human into the loop. Every performance measurement feeds forward into the next campaign's planning. These feedback loops are where quality happens — and where most organizations lose time. The difference between a 2-week campaign cycle and a 6-week one is almost entirely determined by how many times content loops through revision.",
     "action": "show-feedback-loops",
     "cameraPosition": { "x": -50, "y": 100, "z": 500 },
     "cameraTransitionMs": 2500,
     "duration": 8000
   }
   ```

   **New step after the human roles step, ID: "act5-operating-model":**
   ```json
   {
     "id": "act5-operating-model",
     "title": "The Operating Model Shift",
     "narration": "The shift isn't from manual to automated. It's from a team of specialists executing tasks to a team of orchestrators directing systems. Content directors become workflow architects. Brand managers become governance designers. Analytics leads become feedback loop engineers. Every role in the graph transforms — not by doing less, but by operating at a higher altitude. The organizations that understand this are already redesigning their operating models around the graph, not around the org chart.",
     "action": "show-role-overview",
     "cameraPosition": { "x": 100, "y": -50, "z": 600 },
     "cameraTransitionMs": 2000,
     "duration": 8000
   }
   ```

3. **`src/components/presentation/PresentationController.tsx`** — No changes needed to the controller itself. The new steps will be loaded from the JSON. However, verify that the `executeStepAction` switch statement handles the actions used by the new steps (`show-process-chart`, `show-feedback-loops`, `show-role-overview` — all three already exist in the switch statement).

**Acceptance criteria:**
- Guided tour now has 10 steps.
- Each narration is 3-5 sentences with tension-insight-implication structure.
- Navigation (dots, arrows, keyboard) works across all 10 steps.
- Camera positions and graph actions execute correctly for new steps.
- Auto-play timing uses the new `duration` values.

---

### Task 1.5: Connect Modes via Shared State (Cross-Mode Persistence)

**Problem:** The 5 modes are silos. ROI inputs don't customize the Build plan. Campaign results don't appear in ROI. No state flows between modes.

**Changes:**

1. **Create `src/lib/store/session-store.ts`** — New Zustand store that holds cross-mode state:
   ```typescript
   import { create } from 'zustand';

   interface SessionState {
     // From ROI Simulator
     orgProfile: {
       annualRevenue: number;
       industry: string;
       marketingHeadcount: number;
       companyName: string;
     } | null;

     // From Campaign Walkthrough
     lastCampaignResults: {
       totalSteps: number;
       totalMinutes: number;
       revisions: number;
       escalations: number;
       gatesApproved: number;
       completedAt: number;
     } | null;

     // From Guided Tour
     guidedTourCompleted: boolean;

     // From Role Selection
     selectedRoleId: string | null;

     // Actions
     setOrgProfile: (profile: SessionState['orgProfile']) => void;
     setCampaignResults: (results: SessionState['lastCampaignResults']) => void;
     setGuidedTourCompleted: () => void;
     setSelectedRoleId: (id: string | null) => void;
   }

   export const useSessionStore = create<SessionState>((set) => ({
     orgProfile: null,
     lastCampaignResults: null,
     guidedTourCompleted: false,
     selectedRoleId: null,

     setOrgProfile: (profile) => set({ orgProfile: profile }),
     setCampaignResults: (results) => set({ lastCampaignResults: results }),
     setGuidedTourCompleted: () => set({ guidedTourCompleted: true }),
     setSelectedRoleId: (id) => set({ selectedRoleId: id }),
   }));
   ```

2. **`src/lib/store/roi-store.ts`** — In the `setOrg` action, after updating the org state, also update the session store:
   ```typescript
   import { useSessionStore } from './session-store';
   // Inside setOrg:
   useSessionStore.getState().setOrgProfile({
     annualRevenue: org.annualRevenue,
     industry: org.industry || '',
     marketingHeadcount: org.marketingHeadcount,
     companyName: org.companyName || '',
   });
   ```

3. **`src/lib/store/campaign-store.ts`** — When campaign completes (in `makeGateDecision` where `isComplete` is set to true, and in the end of `advanceToNext` when there's no next node), save results to session store:
   ```typescript
   import { useSessionStore } from './session-store';
   // When campaign completes:
   useSessionStore.getState().setCampaignResults({
     totalSteps: state.stepCount,
     totalMinutes: state.totalEstimatedMinutes,
     revisions: state.revisionCount + revisionInc,
     escalations: state.escalationCount + escalationInc,
     gatesApproved: state.decisions.filter(d => d.decision.toLowerCase() === 'approve').length,
     completedAt: Date.now(),
   });
   ```

4. **`src/components/presentation/PresentationController.tsx`** — When the guided tour ends (user clicks "Explore the Graph" or advances past the last step), call `useSessionStore.getState().setGuidedTourCompleted()`.

5. **`src/components/roi/slides/QuickCalcSlide.tsx`** (from Task 1.2) — On mount, check `useSessionStore.getState().orgProfile`. If it exists (user already filled in org data elsewhere), pre-populate the quick calc inputs from it.

6. **`src/components/graph/CampaignMode/CampaignSummary.tsx`** — If `useSessionStore.getState().orgProfile` exists, include a line in the summary: "Based on {companyName || 'your organization'}'s profile, this campaign represents approximately {campaignMinutes / totalAnnualMinutes * 100}% of monthly operational capacity."

7. **`src/components/build/BuildController.tsx`** — On the timeline/Gantt slide, if `useSessionStore.getState().orgProfile` exists, adjust the displayed team size recommendation based on `marketingHeadcount`:
   - < 50 headcount: "Lean team (3-5 people, 16 weeks)"
   - 50-200: "Standard team (6-10 people, 20 weeks)"
   - 200+: "Enterprise team (10-15 people, 28 weeks)"
   Display this as a subtitle on the Gantt slide.

**Acceptance criteria:**
- Session store persists across mode switches (within the same browser session).
- ROI inputs auto-populate if the user has already configured them.
- Campaign results are captured and available to other modes.
- Build mode timeline adapts to org size when available.
- No crashes or regressions when session store is empty (all fields nullable).

---

## TIER 2: STRUCTURAL IMPROVEMENTS

### Task 2.1: Audience-Based Landing Page

**Problem:** The landing page presents 6 mode buttons (after Task 1.1) as equal-weight options. Users must self-select without understanding the content. Different audiences need different journeys.

**Changes:**

1. **`src/app/page.tsx`** — Redesign the landing page. Replace the flat mode grid with two sections:

   **Section A: Audience Paths** (3 cards, prominent):
   ```
   Marketing Leader → Guided Tour → Role View → Campaign → ROI
   Finance / Business Case → ROI Quick Calc → Build Timeline
   Implementation / Technical → Explore → Build It → ROI (detailed)
   ```
   Each card shows the journey sequence (e.g., "4 steps, ~15 min"). Clicking a card stores the full journey sequence in sessionStorage (as a JSON array of mode keys) and navigates to `/graph` starting at the first mode in the sequence.

   **Section B: Direct Access** (small row below):
   Keep the existing mode buttons as a secondary row labeled "Or jump directly to:" with smaller styling. Same functionality as current.

2. **`src/app/graph/page.tsx`** — Read the journey sequence from sessionStorage. Store it in a `useRef`. At each mode transition point (end of guided tour, end of campaign, etc.), check if there's a next mode in the sequence and auto-navigate to it. Add a small "Journey: Step 2 of 4" indicator in the top-right corner when a journey is active.

3. **Create a `ModeToggle` update** — When a journey sequence is active, the mode toggle should show "Next: {next mode name}" as a prominent button in addition to the existing mode switcher. Clicking it advances to the next journey step.

**Acceptance criteria:**
- Landing page shows 3 audience paths prominently, with direct access below.
- Clicking an audience path starts a multi-mode journey.
- Journey progress indicator appears during a journey.
- Each mode in the journey transitions smoothly to the next.
- Direct access buttons still work independently.

---

### Task 2.2: Guided Discovery in Explore Mode

**Problem:** Explore mode has no objective. Users can spin the graph but there's nothing to find or learn.

**Changes:**

1. **Create `src/components/graph/ExplorePrompts.tsx`** — A floating card that appears in explore mode (replacing the simple welcome overlay). Shows contextual discovery prompts:
   ```
   Discovery prompts (cycle through these, one at a time):
   - "Find a gate node (coral dodecahedrons). Click one to see where humans maintain control."
   - "Purple torus shapes are AI agents. Click one to see what it does and what tools it uses."
   - "Click any step to see its inputs. These knowledge dependencies are the infrastructure layer."
   - "Use the filters above to show only gates — see every human checkpoint in the workflow."
   ```
   Show one prompt at a time with a "Got it" dismiss and "Next tip" button. Track dismissed prompts in local component state. After all are dismissed, don't show again.

2. **`src/components/graph/GraphControls.tsx`** — Add business-logic filter presets as a dropdown/segmented control above the existing type toggles:
   - "All" (default)
   - "Human Checkpoints" (show only gates + steps with owner=human)
   - "AI-Owned Steps" (show only steps with owner=agent + agent nodes)
   - "Knowledge Dependencies" (show only input nodes + uses links)
   - "Bottlenecks" (show gates + steps with estimatedTime > 30 min)

   Each preset sets the appropriate `visibleNodeTypes`, `visibleLinkTypes`, and `highlightedNodeIds` via the graph store.

3. **`src/app/graph/page.tsx`** — In explore mode, render `ExplorePrompts` instead of the current `ExploreWelcome` component (or integrate into it). Show prompts only if `guidedTourCompleted` is false in the session store (first-time explorers need guidance, returning users don't).

**Acceptance criteria:**
- Explore mode shows contextual prompts for first-time users.
- Business-logic filter presets work and produce meaningful views.
- Prompts can be dismissed and don't return within the session.
- Existing explore functionality (search, filters, node detail) unchanged.

---

### Task 2.3: Landing Page Copy Cleanup

**Problem:** The landing page contains unsourced claims ("2-5x faster campaign cycles", "150-250% ROI") and positioning language that reads as sales copy rather than executive-grade thought leadership.

**Changes:**

1. **`src/app/page.tsx`** — Replace the current subtitle and credibility section:

   **Current subtitle:**
   > "Why building a semantic knowledge layer matters at least as much as the agents themselves. Explore the deep complexity of marketing campaign workflows."

   **New subtitle:**
   > "Agents will commoditize. The infrastructure underneath them won't. Explore how organizational knowledge graphs, human-in-the-loop governance, and AI agents work together in enterprise content production."

   **Current value proposition (remove entirely):**
   > "Enterprise marketing teams using organizational intelligence layers see 2-5x faster campaign cycles and 150-250% ROI on their infrastructure investment."

   **Replace with:**
   > "An interactive model of the marketing campaign lifecycle — from brief to measurement — showing where AI handles volume, where humans maintain judgment, and where the knowledge layer makes both effective."

   **Current credibility signals (remove the "Built for S&P 500" / "Benchmarked against" / "11 verticals" row entirely).** Replace with:
   > "Financial model benchmarks sourced from Gartner 2025, McKinsey, Salesforce, and Forrester research. Model your organization's specific business case in the ROI Simulator."

   **Remove the bottom "All benchmarks sourced from..." note** — it's redundant with the new credibility line.

2. **Also in `page.tsx`** — Update the page title:

   **Current:** "The Organizational Intelligence Layer"

   **New:** "The Infrastructure Layer" — this is more direct and aligns with the thesis.

**Acceptance criteria:**
- No unsourced statistical claims on the landing page.
- Thesis statement is direct and specific.
- Credibility signals reference the ROI Simulator (driving users into the app).
- Tone matches the voice guide: authoritative, measured, practitioner-credible.

---

### Task 2.4: Campaign Summary with Baseline Comparison and What-If

**Problem:** Campaign summary shows metrics without context. "8 revisions" means nothing without a comparison.

**Changes:**

1. **`src/components/graph/CampaignMode/CampaignSummary.tsx`** — Add a comparison table after the existing stats:

   **Baseline computation** (add to `campaign-store.ts` or compute inline):
   - Sum all step `estimatedTime` values from the graph data = `baseMinutes`
   - Multiply by 2.5 for manual execution baseline (no agent acceleration) = `manualMinutes`
   - Apply default 20% rework rate = `manualRevisions = Math.round(gateCount * 0.6)` (60% of gates trigger revision without AI quality)
   - Apply default 7-day approval cycles = `manualDays = gateCount * 7`

   Display:
   ```
   ┌─────────────────────┬──────────────┬─────────────┐
   │                     │ Your Campaign│ Manual Est.  │
   ├─────────────────────┼──────────────┼─────────────┤
   │ Total Time          │ {time}       │ {manualTime} │
   │ Revisions           │ {revisions}  │ {manualRevs} │
   │ Escalations         │ {escalations}│ N/A (no AI)  │
   │ Approval Cycle Days │ ~instant     │ {manualDays} │
   └─────────────────────┴──────────────┴─────────────┘
   ```

2. **Add a "Run Again" variant** — Below the comparison, add a prompt: "What would happen with different decisions?" with a button that resets the campaign but preserves the previous results in session store for comparison.

3. **Style** — Use the existing glass-panel styling. The comparison table should use a two-column layout with the user's results highlighted in green/teal and the manual baseline in muted gray.

**Acceptance criteria:**
- Campaign summary shows a clear before/after comparison.
- Baseline numbers are computed from actual graph data (not hardcoded).
- "Run Again" preserves previous results for comparison.

---

### Task 2.5: Connect Build Mode to the Graph

**Problem:** Build mode is a disconnected slideshow. Build phases mention knowledge domains but don't map to graph nodes.

**Changes:**

1. **`src/data/build-steps.ts`** — Add a `relatedNodeIds: string[]` field to each build step. Map them:
   - Phase 1 (Brand/Voice): `['brand-voice-guide', 'brand-compliance', 'brand-review', 'writer-agent']`
   - Phase 2 (Content Ops): `['draft-content', 'seo-optimization', 'quality-check', 'seo-agent', 'writer-agent']`
   - Phase 3 (Governance): `['legal-review', 'legal-compliance-gate', 'accessibility-check', 'governance-gate', 'content-governance']`
   - Phase 4 (Measurement): `['track-performance', 'generate-report', 'performance-review', 'performance-agent', 'analytics-data']`

2. **`src/components/build/BuildController.tsx`** — When a build step is active, highlight the related nodes in the graph:
   ```typescript
   useEffect(() => {
     const step = BUILD_STEPS[currentStepIndex];
     if (step?.relatedNodeIds) {
       const ids = new Set(step.relatedNodeIds);
       useGraphStore.getState().setHighlightedNodeIds(ids);
     } else {
       useGraphStore.getState().clearHighlights();
     }
     return () => useGraphStore.getState().clearHighlights();
   }, [currentStepIndex]);
   ```

3. **`src/app/graph/page.tsx`** — When build mode is active, load the full graph data (not linear). This means changing the initialization logic:
   ```typescript
   // Before: build mode loads linear data
   // After: build mode loads full graph data
   if (activeMode === 'guided' || activeMode === 'roi') {
     setGraphData(linearData);
   } else {
     setGraphData(fullData);
     // ...
   }
   ```
   The graph should be visible behind the build overlay with the highlighted nodes glowing.

4. **`src/components/build/BuildController.tsx`** — Reduce the scrim/overlay opacity on non-title slides from fully opaque to semi-transparent (opacity 0.85) so the highlighted graph nodes are faintly visible behind the content. Add a "View in Graph" button on each content slide that temporarily minimizes the build overlay (reduces it to a small bottom bar) to show the graph with highlighted nodes.

**Acceptance criteria:**
- Each build phase highlights relevant nodes in the 3D graph.
- The graph is visible (dimly) behind the build content.
- "View in Graph" button minimizes the overlay to reveal the full graph.
- Clicking "Back to Build" restores the overlay.

---

## TIER 3: POLISH

### Task 3.1: Three.js Performance Optimization

**Problem:** `nodeThreeObject` callback recreates all Three.js materials on every render. Material creation is expensive. The callback has 10 dependencies that change frequently.

**Changes:**

1. **`src/components/graph/GraphScene.tsx`** — Add a material cache alongside the existing color and glow texture caches:
   ```typescript
   const materialCache = new Map<string, THREE.MeshPhysicalMaterial>();
   function getCachedMaterial(key: string, color: THREE.Color, opacity: number, emissive: boolean): THREE.MeshPhysicalMaterial {
     const cacheKey = `${key}-${opacity.toFixed(2)}-${emissive}`;
     let mat = materialCache.get(cacheKey);
     if (!mat) {
       mat = new THREE.MeshPhysicalMaterial({
         color,
         metalness: 0.3,
         roughness: 0.15,
         clearcoat: 0.8,
         clearcoatRoughness: 0.1,
         transparent: true,
         opacity,
         emissive: emissive ? color : new THREE.Color(0x000000),
         emissiveIntensity: emissive ? 0.3 : 0,
       });
       materialCache.set(cacheKey, mat);
     }
     return mat;
   }
   ```
   Use `getCachedMaterial` inside `nodeThreeObject` instead of creating new materials each time.

2. **Also in GraphScene.tsx** — Pause the scene rotation during interaction:
   ```typescript
   const isInteracting = useRef(false);
   // In the animate loop:
   if (!isInteracting.current) {
     scene.rotation.y += 0.0002;
   }
   // Set isInteracting = true on nodeHover/nodeClick, reset after 3s idle
   ```

3. **Also in GraphScene.tsx** — Split `nodeThreeObject` into two categories: static properties (geometry, base color) that only change when the graph data changes, and dynamic properties (opacity, glow, highlights) that change on interaction. Use the existing `__threeObj` property on the node object to update materials in place rather than recreating the entire group.

**Acceptance criteria:**
- Material cache reduces GPU object creation by >80%.
- Scene rotation pauses during hover and resumes after idle.
- No visual regressions in node appearance, highlighting, or campaign indicators.

---

### Task 3.2: Shareable ROI URLs

**Problem:** ROI configurations vanish on page refresh. No way to share a scenario with a colleague.

**Changes:**

1. **`src/lib/store/roi-store.ts`** — Add `exportConfig()` and `importConfig(config)` actions:
   - `exportConfig` returns a JSON-serializable object with all input groups + scenario + intensity.
   - `importConfig` sets all stores from the object and triggers recalculate.

2. **Create `src/lib/utils/roi-share.ts`** — Helper functions:
   - `encodeRoiConfig(config): string` — JSON.stringify → base64 encode → URL-safe string.
   - `decodeRoiConfig(encoded): config` — Reverse.
   - `buildShareUrl(config): string` — `window.location.origin + '/graph?roi=' + encodeRoiConfig(config)`.

3. **`src/app/graph/page.tsx`** — On mount, check for `?roi=` query parameter. If present, decode it, import into the ROI store, and set mode to 'roi'.

4. **`src/components/roi/RoiController.tsx`** — Add a "Share This Model" button (link icon) on the results slides. Clicking it copies the shareable URL to clipboard and shows a brief "Copied!" toast.

**Acceptance criteria:**
- "Share This Model" generates a URL with encoded ROI configuration.
- Opening the URL loads the ROI simulator with all inputs pre-filled.
- The URL is reasonably short (base64 of the essential inputs only, not the full store).

---

### Task 3.3: Deepen CFO View in ROI

**Problem:** The "CFO View" toggle relabels metrics but doesn't fundamentally change the presentation. A real CFO view needs different content.

**Changes:**

1. **Create `src/components/roi/slides/CfoSummarySlide.tsx`** — New slide rendered when `viewMode === 'cfo'` on the results step:
   - **Investment Summary Table:**
     | Item | Amount |
     |------|--------|
     | Total Capital Investment | ${investment} |
     | Annual Operating Cost (20%) | ${opex} |
     | 3-Year Total Cost of Ownership | ${tco} |

   - **Returns Table:**
     | Metric | Conservative | Expected | Aggressive |
     |--------|-------------|----------|------------|
     | Payback Period | Xmo | Xmo | Xmo |
     | 3-Year NPV | $X | $X | $X |
     | IRR | X% | X% | X% |

   - **Sensitivity Analysis:** Show how payback period changes if the two most impactful assumptions (content time savings, ROAS lift) vary by ±25%. Display as a 3x3 grid.

   - **Opportunity Cost of Delay:** Show the `DO_NOTHING_EROSION` model: "Each quarter of delay compounds a 2% competitive gap. After 12 months, the estimated revenue at risk is ${year1erosion}."

2. **`src/components/roi/RoiController.tsx`** — When `viewMode === 'cfo'`, swap the results slide for `CfoSummarySlide`. Keep all other slides the same.

3. **`src/lib/roi/engine.ts`** — Add a `computeSensitivity` function that takes the base inputs and varies two assumptions by ±25%, returning a 3x3 matrix of payback periods. This is a pure function, no store changes needed.

**Acceptance criteria:**
- CFO view shows a fundamentally different results layout.
- Sensitivity analysis is computed live from current inputs.
- Opportunity cost of delay is prominently displayed.
- Switching between Marketing and CFO views is instant (no re-computation needed for the base case).

---

## EXECUTION NOTES

### Build Order

Tasks within each tier can be executed in parallel except where noted:
- **Task 1.2** (Quick Calc) must be done before **Task 1.5** (Session Store), since 1.5 references the QuickCalcSlide component.
- **Task 1.4** (Narrations) is independent of all other tasks.
- **Task 2.1** (Audience Landing) depends on **Task 1.1** (Role Mode) being complete.
- **Task 2.5** (Build + Graph) partially depends on **Task 1.5** (Session Store) for org profile integration.
- **Tier 3** tasks are fully independent of each other.

### Testing Strategy

After each task:
1. Verify no TypeScript compilation errors (`npm run build`).
2. Verify no console errors in browser during happy-path walkthrough.
3. Verify all 5 (now 6) modes are reachable from the landing page.
4. Verify mode switching works (ModeToggle component).
5. For campaign tasks: run a full campaign, testing at least one Approve, one Revise, and one Escalate decision.
6. For ROI tasks: verify quick calc produces reasonable numbers and that detailed mode still works.

### Git Commit Strategy

One commit per task. Commit message format:
```
feat(mode): brief description

- specific change 1
- specific change 2
```

Example:
```
feat(roi): add quick calc mode with 3-input instant projections

- New QuickCalcSlide component with revenue, industry, budget inputs
- Hero results card with payback, NPV, efficiency gain, do-nothing risk
- Quick calc mode flag in roi-store with toggle to detailed flow
```
