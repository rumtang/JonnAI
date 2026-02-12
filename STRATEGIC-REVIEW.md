# Strategic Review: Agentic Platform

**Reviewer posture:** Skeptical Managing Director seeing this for the first time.
**Evaluation scope:** All five modes, architecture, positioning, UX, code quality, strategic coherence.

---

## EXECUTIVE SUMMARY

Agentic is an ambitious, technically accomplished interactive visualization that tries to do five things at once for five different audiences. The 3D graph rendering, the ROI engine, and the campaign simulator each represent real engineering depth. The core thesis — infrastructure compounds, agents commoditize — is sharp and defensible.

The problem is structural: the application doesn't know what it is. It oscillates between a sales demo, a thought leadership artifact, a financial modeling tool, a training simulator, and an interactive whitepaper. That identity crisis manifests in every mode, every transition, and every piece of copy. A skeptical CMO would be impressed for 90 seconds and then lost. A CFO would never reach the ROI simulator. A CTO would wonder why the 3D graph exists.

What follows is the mode-by-mode teardown, followed by the macro-level structural fixes that would make this phenomenal.

---

## MODE-BY-MODE CRITIQUE

### 1. GUIDED TOUR — The strongest mode, but narratively incomplete

**What works:** The pipeline-to-graph reveal is genuinely effective. Starting with the clean 6-stage lifecycle that every marketing team draws on a whiteboard, then exploding it into the real complexity underneath — that's a moment. The flying agent badges on the slide 3→4 transition are a nice cinematic touch. The camera choreography between steps is smooth.

**Where it falls apart:**

The narration copy is thin. Every narration card reads like a slide subtitle, not a story being told. "Every team tells the same story: a clean, linear pipeline. But what does the process really look like?" — that's a decent opener, but then the narration never develops the tension. It stays at the altitude of "here are agents" and "here are gates" without ever landing the *so what*.

The guided tour is 7 steps. That's not enough. The reveal from linear to full graph happens too fast — the audience hasn't had time to feel the pain of the linear model before it's gone. There's no beat where someone looks at the simple pipeline and thinks "this seems manageable," only to have the rug pulled. Narrative pacing needs work.

The end-of-tour CTA ("Explore the Graph" / "Impact Per Role") dumps the user into explore mode with no bridge. After a guided, hand-held experience, suddenly the user is alone in a 3D space with no instructions beyond a 6-second tooltip. That's a cliff, not a handoff.

**Specific fixes:**
- Expand to 10-12 steps. Add a "this is what most teams think" beat, a "here's what actually happens" beat, and a "here's what breaks" beat before revealing agents and infrastructure.
- Rewrite every narration card to follow tension-insight-implication. Each card should end with a statement that creates forward momentum.
- Add an intermediate state between guided and explore — a prompted exploration where the user is given 2-3 things to look for, not dropped into the void.
- The presentation-steps.json data is too skeletal. The narrations are one sentence each. A guided tour for executives needs at least 3-4 sentences per step, building an argument, not labeling a visual.

---

### 2. EXPLORE MODE — Technically solid, strategically purposeless

**What works:** The 3D rendering is genuinely impressive. Crystalline materials with MeshPhysicalMaterial and clearcoat, glow sprites with additive blending, smooth camera transitions — this is not amateur Three.js work. The progressive reveal (starting with core nodes, expanding on click) is a smart UX choice that reduces cognitive overload. Node detail panel with connected nodes and breadcrumb navigation is well thought out.

**Where it falls apart:**

Explore mode has no objective. The user can spin a beautiful 3D graph and click on nodes, but there's no reason to do so. No questions to answer. No patterns to discover. No insights to unlock. It's a sandbox with no toys.

The role-based visualization (5 roles with 675 narratives across 3 AI maturity stages) is buried behind a bottom-bar button. This is arguably the most strategically valuable feature in the entire application — it shows a Content Director, Brand Manager, or Analytics Lead exactly how their job changes as AI adoption matures — and it's the hardest feature to find.

The search and filter controls are functional but don't guide discovery. Filtering by node type tells an architect something; it tells a CMO nothing. Where are the business-question-driven filters? "Show me where humans still have veto power." "Show me the bottlenecks." "Show me what breaks when the brand guide is outdated."

Progressive reveal is well-implemented technically (revealedNodeIds tracking, expandNode on click), but the initial "core nodes" set is just the step nodes. That's the least interesting subset — it's the linear pipeline again without the context that makes it meaningful.

**Specific fixes:**
- Add guided discovery prompts: "Click any gate node to see where humans maintain control" or "Agents are purple — find the one closest to your role."
- Elevate the role-based view. It should be the *primary* explore experience, not a hidden secondary feature. When explore mode loads, the first thing shown should be "Choose your role" — not a blank graph.
- Replace node-type filters with business-logic filters: "Show bottlenecks," "Show AI-owned steps," "Show human checkpoints," "Show knowledge dependencies."
- The 675 role narratives across pre-AI/AI agents/AI agentic stages are a goldmine. Surface them as a toggle *within* explore mode, not as a separate panel that replaces the node detail panel.

---

### 3. CAMPAIGN WALKTHROUGH — Best concept, worst execution

**What works:** The concept is excellent. Walking through a marketing campaign step by step, making decisions at gate nodes (Approve / Revise / Escalate), building an audit trail, and seeing metrics at the end — this is the feature that would make a room full of CMOs lean forward. It makes the abstract concrete.

**Where it falls apart:**

The campaign is on rails. The MAIN_WORKFLOW_ORDER is a hardcoded 37-step array. There's no branching. When the user hits "Revise" at a gate, the revision count increments but the workflow doesn't actually loop back. When they hit "Escalate," the escalation count increments but nothing changes. The gate decisions are cosmetic — they don't affect the path.

This is the single biggest credibility risk in the application. The moment a sophisticated user (and the target audience is sophisticated) realizes the decisions don't matter, the entire simulation loses trust. It feels like a demo, not a tool.

The campaign panel UI (left sidebar with node list) is cramped and doesn't communicate progress well. The "current node" indicator competes with visited nodes for visual attention. The audit log at the bottom is a flat list — no structure, no summary, no pattern recognition.

The campaign summary at the end calculates metrics (steps, revisions, escalations, estimated time) but doesn't compare them to anything. "8 revisions" means nothing without context. Is that good? Bad? Expected? How does that compare to the same campaign without AI agents? Without the knowledge graph infrastructure?

**Specific fixes:**
- Make gate decisions real. When "Revise" is selected, the campaign should actually loop back to the previous step and require re-traversal. When "Escalate" is selected, a human-review step should be injected. This is the difference between a toy and a tool.
- Add branching scenarios. Let the user run the same campaign with different configurations: "with AI agents," "without AI agents," "with knowledge graph," "without knowledge graph." Show the delta.
- Redesign the summary to compare against a baseline. "Your campaign: 14 steps, 3 revisions, 2.5 hours. Without AI: 22 steps, 8 revisions, 11 hours." That's the insight.
- Add a "What if?" mode to the summary: "What if the brand guide had been outdated? +4 revisions, +6 hours."

---

### 4. BUILD IT — Solid content trapped in a slideshow

**What works:** The implementation content itself is good. The 4-phase, 16-week (expanded to 28-week) rollout plan is specific and grounded. The team role definitions, the 5-layer architecture (Structural → Process → Rules → Metrics → Context), the resistance points and mitigation strategies — this reads like real consulting deliverable content. The Gantt visualization and hub-spoke dependency diagram are useful.

**Where it falls apart:**

The entire mode is a static slideshow. Ten slides, forward and back buttons, no interactivity. After the 3D graph and the campaign simulator, this feels like falling off a cliff into a PowerPoint deck that someone embedded in a web app. The production value drop is jarring.

The content doesn't connect back to the graph. The build mode talks about "7 knowledge domains" and "autonomy tiers," but these aren't mapped to the actual nodes and gates the user just explored. The user should be able to click on "Brand Voice" in the build plan and see the graph nodes that depend on it light up. Instead, it's a completely separate, disconnected experience.

The Gantt slide uses hardcoded pixel positions for timeline bars. On smaller screens or different aspect ratios, this will break or become unreadable.

There's no personalization. The build plan is identical whether the audience is a 50-person agency or a 5,000-person enterprise. The implementation timeline, team allocation, and resistance points should scale with the organization profile — which is already captured in the ROI simulator's inputs.

**Specific fixes:**
- Connect build mode to the graph. Each build phase should light up the graph nodes it affects. "Phase 1: Brand Infrastructure" should highlight brand-voice-guide, brand-compliance, and brand-check nodes.
- Make the build plan responsive to organization profile. If the user has already gone through the ROI simulator, pull their org size, industry, and investment amount to customize the timeline, team size, and phase durations.
- Replace the slideshow format with an interactive timeline. The Gantt chart should be the primary navigation, with detail panels expanding on click.
- Add dependencies between build phases and ROI milestones. "Phase 2 completion enables the content velocity gains modeled in the ROI simulator."

---

### 5. ROI SIMULATOR — The crown jewel, but too complex and not credible enough

**What works:** The ROI engine (`roi/engine.ts`) is the most sophisticated component in the codebase. Pure functions, benchmark-sourced constants with explicit source attribution and confidence levels, scenario multipliers, agent intensity levels, contribution margin calculations, NPV/IRR projections — this is legitimate financial modeling, not hand-waving.

The source attribution system (Gartner, McKinsey, Salesforce, Forrester) with confidence levels (high/medium/emerging) is exactly right for a CFO audience. The "do nothing" erosion model that compounds competitive disadvantage over 3 years is a smart forcing function.

**Where it falls apart:**

The input UX is overwhelming. Seven slides of sliders, toggles, and input fields before a single result appears. A CFO won't fill out 25+ inputs to see a projection. The ROI simulator needs to work with 3-5 inputs and deliver a credible result, with the option to refine further.

The default values are anchored to a $2B S&P 100 company. That's a narrow audience. A $500M mid-market company or a $50B conglomerate will see default numbers that feel wrong for their context, which immediately undermines trust in the model.

Several benchmarks are vendor-sourced and flagged as "emerging" confidence. The ROAS improvement figure (20%) cites "Platform vendor case studies (Meta, Google) — not independently verified." Presenting vendor case studies alongside Gartner CMO surveys without clear visual differentiation is dangerous. A sharp CFO will spot the uneven evidence quality and question the entire model.

The waterfall chart, sankey diagram, and donut charts are well-crafted, but there are too many of them. The user gets results across 4 different visualization types with 15+ individual metrics. Information overload. The key numbers — payback period, 3-year NPV, IRR — should be the hero, not buried among secondary metrics.

The "Marketing View" vs. "CFO View" toggle is a good concept but the differentiation is superficial. Both views show essentially the same numbers with slightly different framing. A genuine CFO view would strip out marketing jargon entirely and present pure financial returns: invested capital, risk-adjusted returns, payback timeline, opportunity cost of delay.

**Specific fixes:**
- Implement a "quick calc" mode: revenue, marketing budget %, and industry vertical. Three inputs, instant result. Then offer "Refine your model" for the full input set.
- Visually separate high-confidence benchmarks from emerging ones. Use the confidence level system that's already built into the engine but not surfaced prominently enough in the UI.
- Reduce the results to one hero summary card: payback months, 3-year NPV, IRR. Everything else is drill-down detail.
- Make the CFO view genuinely different: DCF table, sensitivity analysis on 2-3 key assumptions, risk-adjusted scenario overlay. Right now it's the same dashboard with a different label.
- Add a "Do Nothing" scenario that runs alongside the investment scenario. The cost of inaction is the most powerful selling point in the engine — make it visceral.

---

## MACRO-LEVEL STRUCTURAL ISSUES

### 1. The App Doesn't Know Its Audience

The landing page presents 5 modes as equal-weight options. That forces the user to self-select into a path before understanding what any of them contain. This is a product design failure.

Different stakeholders need different journeys: a CMO needs Guided Tour → Role View → Campaign → ROI. A CFO needs ROI (quick) → Build (timeline and cost). A CTO needs Explore → Build (architecture). A practitioner needs Campaign → Role View → Explore.

The fix is audience-based entry points, not feature-based ones. "I'm a marketing leader," "I'm evaluating the business case," "I'm planning implementation." Then orchestrate the right sequence of modes automatically.

### 2. The Modes Are Silos, Not a Journey

The five modes share the same graph data but almost nothing else. There's no continuity between them. Completing the Guided Tour doesn't carry context into Explore. Running the ROI simulator doesn't customize the Build plan. Making campaign decisions doesn't affect the ROI projections. Each mode is a dead end.

This is the single highest-leverage fix: connect the modes into a coherent narrative flow with persistent state. The user's organization profile from the ROI simulator should customize the Build timeline. The campaign simulation results should feed into the ROI comparison. The role-based insights should reference the specific nodes encountered in the guided tour.

### 3. The Landing Page Copy Undermines Credibility

"Enterprise marketing teams using organizational intelligence layers see 2-5x faster campaign cycles and 150-250% ROI on their infrastructure investment." This is on the front page. There's no source citation. It's a bold claim with zero grounding. A skeptical executive reads this and immediately discounts everything that follows.

"Built for S&P 500 marketing operations" — this is positioning language, not a credibility signal. It's aspirational unless backed by named implementations. "Benchmarked against Gartner, McKinsey & Forrester data" — the ROI engine genuinely uses these sources, but presenting them as credibility badges on the landing page cheapens them. Show, don't tell.

The landing page should state the thesis directly: "Agents are commoditizing. The organizations that compound advantage are building the infrastructure layer underneath." Then let the experience prove it.

### 4. Performance and GPU Concerns

The GraphScene component creates new THREE.Mesh, THREE.MeshPhysicalMaterial, THREE.SpriteMaterial, and SpriteText objects on every render cycle via the nodeThreeObject callback. The color and glow texture caches help, but material creation is not cached. For 45 nodes, this is manageable. For the "full graph" at scale, it's a problem.

The nodeThreeObject callback has 10 dependencies in its useCallback array, including campaignVisitedSet and campaignNeighborSet which change frequently during campaign mode. Every campaign step change recreates every node's Three.js group. This should be optimized to only update affected nodes.

The continuous scene rotation (`scene.rotation.y += 0.0002` in requestAnimationFrame) runs indefinitely, even when the user is interacting. It should pause during interaction and resume after idle.

### 5. The Role Narratives Are Underutilized

The role-definitions.ts file is 11,085 lines — over 25% of the total codebase. It contains 675 narratives (5 roles x 45 nodes x 3 maturity stages) describing how each role's relationship to each workflow node changes across pre-AI, AI agent, and agentic maturity levels. This is extraordinary content.

It's buried behind a small button at the bottom of explore mode. Most users will never find it.

This should be a primary mode, not a feature within explore mode. "See how AI changes your role" — that's a headline that makes people click. It should be on the landing page, potentially as the recommended starting point for practitioners.

### 6. Mobile Experience

The app is technically responsive (useIsMobile hook, mobile-specific layouts), but a 3D force-directed graph with hover states and camera animations is fundamentally not a mobile experience. Rather than trying to make the same thing work on mobile, consider a fundamentally different mobile presentation — perhaps the role narratives as a swipeable card deck, or the campaign walkthrough as a vertical timeline.

### 7. No Persistence, No Shareability

Nothing is saved. The ROI model with 25+ carefully tuned inputs disappears on page refresh. Campaign decisions vanish. There's no way to share a configured ROI scenario with a CFO, or send someone a link to a specific point in the guided tour. For an enterprise tool, this is a significant gap.

### 8. The 3D Graph Is Beautiful But Strategically Optional

Here's the hardest truth: the 3D force-directed graph is the most technically impressive component and the least strategically necessary one. The core value proposition — showing how AI agents, human gates, and knowledge infrastructure work together in a marketing workflow — could be communicated more clearly with a 2D interactive diagram.

The 3D graph creates "wow" factor in the first 15 seconds. Then it becomes a navigation obstacle. Users struggle to find nodes in 3D space. The camera controls (scroll to zoom, drag to rotate) are unintuitive for non-technical audiences. Nodes occlude each other. Labels are hard to read at certain camera angles.

This doesn't mean removing the 3D graph. It means adding a 2D mode as the default, with the 3D graph as an optional "immersive view." The 2D pipeline diagrams already built into the Guided Tour's early slides prove this — they communicate the workflow more clearly than the 3D graph does.

---

## PRIORITIZED RECOMMENDATIONS

### Tier 1: Do These First (highest impact, directly fixable)

1. **Connect the modes.** Add persistent state that flows between modes. ROI inputs customize the Build plan. Campaign results feed the ROI comparison. Guided tour context carries into explore.

2. **Elevate role-based narratives to a primary mode.** Rename, reposition on landing page, make it the recommended entry for practitioners.

3. **Add "quick calc" to ROI.** 3 inputs → instant result → "refine your model." The full 7-slide input flow becomes the advanced path.

4. **Make campaign decisions real.** Revisions loop back. Escalations inject steps. Decisions change outcomes. This is the difference between a demo and a tool.

5. **Rewrite all narration copy.** Every narration card in the Guided Tour should follow tension → insight → implication. Current copy reads like slide labels.

### Tier 2: Do These Next (structural improvements)

6. **Audience-based entry points.** Replace the 5-mode selector with 3 audience paths that orchestrate the right sequence of modes.

7. **Add a 2D default view.** Interactive 2D diagram as the primary visualization, 3D as the immersive option. This dramatically improves accessibility and readability.

8. **Clean up the landing page.** Remove unsourced claims. State the thesis directly. Let the experience prove credibility.

9. **Add persistence.** Save ROI configurations. Enable shareable URLs for configured scenarios. Store campaign decisions for comparison.

10. **Fix campaign summary.** Compare results against a baseline. Show the "with vs. without" delta. Add "What if?" scenarios.

### Tier 3: Polish (quality and production)

11. **Optimize Three.js rendering.** Cache materials, not just colors. Diff-update node objects instead of recreating. Pause rotation during interaction.

12. **Mobile-first redesign.** Role narratives as card deck, campaign as vertical timeline. Don't force the 3D graph onto small screens.

13. **Connect Build mode to the graph.** Each build phase lights up the nodes it affects. Requires graph-build store integration.

14. **Deepen CFO view.** DCF table, sensitivity analysis, risk-adjusted overlays. Genuine financial modeling presentation, not relabeled marketing metrics.

---

## THE BOTTOM LINE

The engineering is strong. The thesis is right. The content (especially the role narratives and the ROI engine) has real substance. But the application is trying to be everything at once, and the result is that no single audience gets a complete, coherent experience.

The highest-leverage move is not adding features — it's connecting the ones that already exist into audience-driven journeys where each mode builds on the last. That structural change would turn a collection of impressive demos into a genuinely persuasive strategic tool.

The second highest-leverage move is making the interactive elements actually interactive. Campaign decisions that don't matter, an ROI model that requires 25 inputs before showing results, build plans that don't connect to the graph — these are places where the app promises interactivity and delivers a slideshow.

Fix the journey. Fix the interactivity. The rest is polish.
