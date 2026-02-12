# SPEC: Front Office Operating System Expansion

**Status:** Draft — awaiting review
**Author:** Claude (strategic planning)
**Date:** 2026-02-12
**Scope:** Expand jonn.ai from marketing-focused knowledge graph to full front office operating system

---

## 1. Strategic Framing

### The Thesis Gets Stronger at Scale

The current jonn.ai demonstrates "agents commoditize, infrastructure compounds" within marketing content production. That's a strong argument for a CMO audience. But the thesis becomes significantly more powerful when the knowledge graph spans the entire front office — marketing, sales, service, and customer success — because the cross-domain dependencies are where the real complexity lives and where isolated agent deployments fail hardest.

A marketing agent that doesn't know a product is backordered is a nuisance. A sales agent that doesn't know the customer has three open support tickets is a liability. A service agent that doesn't know the customer is in a renewal cycle is a missed opportunity. The front office operating system argument is that the organizational intelligence layer isn't departmental infrastructure — it's the connective tissue between departments.

### What Changes

The marketing version tells a vertical story: depth within one function. The front office version tells a horizontal story: breadth across functions, connected by shared knowledge and cross-domain handoffs. Both converge on the same conclusion — build the graph first, agents scale on top — but from different angles.

### Target Audience Shift

| | Marketing Lens | Front Office Lens |
|---|---|---|
| **Primary buyer** | CMO, VP Marketing Ops | CRO, COO, VP Revenue Operations |
| **Pain point** | Content production bottlenecks, brand inconsistency | Cross-functional handoff failures, revenue leakage |
| **Proof point** | "Look how complex content production really is" | "Look how many departments touch a single customer" |
| **Deal size implication** | Marketing ops transformation ($500K-$2M) | Enterprise front office transformation ($2M-$10M) |
| **Credibility anchor** | Deloitte Digital marketing technology | Deloitte enterprise transformation |

### What Stays the Same

The visualization engine, the mode system, the interaction patterns, the node/link type taxonomy (step, gate, agent, input), the 7 link types, the GraphScene performance tuning, the camera system — all unchanged. This is a data and narrative layer, not an engine rewrite.

---

## 2. Landing Page Architecture

### The Toggle Concept

The landing page adds a "lens" selector above the mode buttons. Two options:

- **Marketing Operations** — "How AI agents, governance, and organizational knowledge work together in enterprise content production." (current)
- **Front Office** — "How the organizational intelligence layer connects marketing, sales, service, and customer success into a single operating system."

### Design

```
                    The
        Organizational Intelligence Layer

  [  Marketing Operations  |  Front Office  ]    <-- toggle, pill-style
                                                       Front Office is the default/left position
                                                       if we want to lead with the bigger story

  Agents will commoditize. The intelligence underneath
  them won't. Explore how organizational knowledge graphs
  connect [marketing, sales, service, and customer success /
  enterprise content production — dynamic based on toggle].

  Choose your experience
  [Guided Tour] [Explore] [Campaign] [Build It] [ROI] [Your Role + AI]
```

### URL Behavior

Option A (recommended): Query parameter — `jonn.ai?lens=marketing` / `jonn.ai?lens=frontoffice`
Option B: Subpath — `jonn.ai/marketing` / `jonn.ai/frontoffice`

Recommend Option A because it keeps a single landing page and stores the lens choice in session state. The `/graph` page loads the appropriate data set based on the active lens.

### Store Change

Add `lens: 'marketing' | 'frontoffice'` to the presentation store (or a new top-level store). The lens determines which data files load for every mode.

---

## 3. Front Office Graph Data Model

### Organizing Principle: Domain Clusters

The marketing graph organizes by lifecycle phase (Plan → Create → Review → Publish → Measure → Optimize). The front office graph organizes by functional domain, with cross-domain handoff nodes connecting them.

**Five domain clusters:**

| Cluster | Group Label | Color Treatment | Node Count Target |
|---------|-------------|-----------------|-------------------|
| Marketing | "Marketing" | Existing amber/gold family | ~12-14 steps + gates |
| Sales | "Sales" | Green family | ~12-14 steps + gates |
| Service | "Service" | Teal/cyan family | ~10-12 steps + gates |
| Customer Success | "Customer Success" | Blue family | ~8-10 steps + gates |
| Cross-Domain | "Handoffs" | Red/coral (same as gates) | ~6-8 handoff nodes |

**Plus shared infrastructure:**

| Type | Count Target | Notes |
|------|-------------|-------|
| Shared Agents | ~12-14 | Some domain-specific, some cross-functional |
| Shared Inputs | ~16-18 | Customer 360, Product Catalog, Compliance, etc. |

**Total target: ~85-100 nodes, ~200-250 links**

### Node Types: Unchanged

Same four types, same visual treatment:
- `step` (blue octahedron) — concrete actions
- `gate` (red dodecahedron) — human review/decision points
- `agent` (purple torus) — AI agents
- `input` (amber box) — shared knowledge, data, tools

### Link Types: Unchanged + One Addition

The existing 7 link types work. Add one semantic enhancement:

- `hands-off-to` — Cross-domain handoff. Visually distinct (thicker, orange, animated particles). Represents the critical transition points between functional domains.

This maps to an 8th link type in link-styles.ts but uses the same rendering pipeline.

---

## 4. Front Office Nodes — Detailed Design

### 4a. Marketing Cluster (~13 nodes)

A condensed version of the existing 31-step graph. Represents marketing as one domain within the larger system, not the full operational depth.

**Steps (8):**
- `mktg-campaign-planning` — Define campaign strategy, audience, channels
- `mktg-content-creation` — Draft, design, and produce content assets
- `mktg-brand-compliance` — Check assets against brand and legal standards
- `mktg-seo-optimization` — Optimize for search and discoverability
- `mktg-distribution` — Publish and distribute across channels
- `mktg-performance-tracking` — Monitor campaign KPIs
- `mktg-attribution` — Model channel and touchpoint contribution
- `mktg-optimization` — Adjust spend, creative, and targeting

**Gates (3):**
- `mktg-brief-approval` — Campaign brief sign-off
- `mktg-creative-review` — Brand + legal review gate
- `mktg-budget-gate` — Spend authorization

**Agents (domain-specific, 2):**
- `mktg-content-agent` — Drafts content, generates variants
- `mktg-analytics-agent` — Tracks performance, generates reports

### 4b. Sales Cluster (~14 nodes)

**Steps (8):**
- `sales-lead-intake` — Receive and score inbound/outbound leads
- `sales-qualification` — BANT/MEDDIC qualification against ICP
- `sales-discovery` — Needs analysis, stakeholder mapping
- `sales-proposal` — Solution design, pricing, proposal generation
- `sales-negotiation` — Contract terms, legal review, procurement
- `sales-close` — Final agreement, signature, booking
- `sales-forecast-update` — Pipeline and forecast maintenance
- `sales-account-planning` — Strategic account plans, expansion mapping

**Gates (3):**
- `sales-qualification-gate` — MQL-to-SQL conversion decision
- `sales-deal-review` — Pipeline review / deal desk
- `sales-pricing-gate` — Non-standard pricing approval

**Agents (domain-specific, 2):**
- `sales-sdr-agent` — Lead scoring, outreach sequencing, meeting booking
- `sales-proposal-agent` — Proposal assembly, pricing optimization, competitive positioning

### 4c. Service Cluster (~12 nodes)

**Steps (7):**
- `svc-case-intake` — Receive and log customer issue
- `svc-triage` — Classify severity, route to appropriate queue
- `svc-investigation` — Diagnose root cause, gather context
- `svc-resolution` — Implement fix, provide solution
- `svc-knowledge-capture` — Document resolution for knowledge base
- `svc-follow-up` — Verify customer satisfaction, close loop
- `svc-escalation-management` — Manage P1/P2 escalation workflows

**Gates (3):**
- `svc-severity-gate` — P1/P2 escalation decision
- `svc-resolution-review` — Quality check before customer communication
- `svc-sla-gate` — SLA breach threshold trigger

**Agents (domain-specific, 2):**
- `svc-triage-agent` — Auto-classify, route, suggest solutions from KB
- `svc-resolution-agent` — Draft responses, pull relevant KB articles, suggest next actions

### 4d. Customer Success Cluster (~10 nodes)

**Steps (6):**
- `cs-onboarding` — Implementation planning, training, go-live
- `cs-health-monitoring` — Track adoption metrics, engagement signals
- `cs-qbr-preparation` — Quarterly business review assembly
- `cs-expansion-identification` — Upsell/cross-sell signal detection
- `cs-renewal-management` — Renewal timeline, risk assessment, negotiation
- `cs-advocacy` — Reference programs, case studies, NPS management

**Gates (2):**
- `cs-health-alert` — At-risk account intervention trigger
- `cs-expansion-gate` — Expansion opportunity qualification

**Agents (domain-specific, 2):**
- `cs-health-agent` — Monitors product usage, predicts churn risk
- `cs-expansion-agent` — Identifies upsell signals, generates expansion proposals

### 4e. Cross-Domain Handoff Nodes (~8 nodes)

These are the critical junctions. Each represents a moment where work, data, or accountability transfers between functions.

- `handoff-mql-to-sql` — Marketing → Sales. Lead meets qualification threshold.
- `handoff-deal-to-onboard` — Sales → Service/CS. Closed deal triggers implementation.
- `handoff-service-to-product` — Service → Product/Engineering. Repeated issue escalation.
- `handoff-cs-to-sales` — CS → Sales. Expansion opportunity identified.
- `handoff-service-to-cs` — Service → CS. Support pattern requires CSM intervention.
- `handoff-churn-signal` — CS → Marketing. At-risk account suppression / win-back trigger.
- `handoff-feedback-loop` — Service/CS → Marketing. VOC data feeds content strategy.
- `handoff-revenue-signal` — All → RevOps. Cross-functional revenue impact data.

### 4f. Shared Agents (~6 cross-functional)

- `agent-customer-360` — Assembles unified customer view across all touchpoints
- `agent-compliance-checker` — Validates actions against regulatory and policy constraints
- `agent-forecasting` — Revenue forecasting from pipeline + renewal + expansion signals
- `agent-workflow-orchestrator` — Routes work across domain boundaries
- `agent-knowledge-graph-updater` — Maintains graph currency from system feeds
- `agent-reporting` — Cross-functional dashboards and executive reporting

### 4g. Shared Inputs (~16)

These are the organizational intelligence layer — the knowledge that makes cross-functional agents possible.

- `input-customer-360` — Unified customer profile (demographics, history, engagement)
- `input-product-catalog` — Products, pricing, bundles, feature matrix
- `input-compliance-framework` — Regulatory requirements, policy constraints, consent rules
- `input-brand-voice` — Brand guidelines, messaging pillars, tone rules
- `input-sla-definitions` — Service levels by tier, response times, escalation triggers
- `input-pricing-rules` — Discount authority, bundling logic, competitive pricing
- `input-territory-model` — Account assignments, territory definitions, routing rules
- `input-ideal-customer-profile` — ICP definition, scoring criteria, segment definitions
- `input-competitive-intelligence` — Competitor positioning, battlecards, win/loss data
- `input-product-roadmap` — Upcoming releases, deprecations, beta programs
- `input-org-authority-matrix` — Approval thresholds, escalation paths, delegation rules
- `input-kpi-framework` — Cross-functional metrics, targets, measurement methodology
- `input-customer-journey-map` — End-to-end journey stages, touchpoints, moments of truth
- `input-knowledge-base` — Institutional knowledge, SOPs, playbooks, tribal knowledge
- `input-integration-map` — System connections, data flows, API capabilities
- `input-financial-controls` — Budget allocations, spend authority, fiscal constraints

---

## 5. Front Office Guided Tour — Narrative Arc

### Story Structure (10 steps, ~150 seconds)

The narrative parallels the marketing version's arc but tells a cross-functional story.

**Step 0: Strategic Context (Intro Slide)**
Title: "From Departmental AI to an Operating System"
Narration: "Most organizations have deployed AI across marketing, sales, and service separately. Each function optimizes its own pipeline. But customers don't experience departments — they experience a company. The gap between departmental AI and an operating system is the organizational intelligence layer that connects them."
Graph: Empty / title card
Duration: ~20s

**Step 1: Title Card**
Title: "Every Function Runs Its Own Pipeline"
Graph: Four parallel linear flows (Marketing, Sales, Service, CS)
Duration: ~5s

**Step 2: Departmental Pipelines**
Title: "Familiar Pipelines, Familiar Silos"
Narration: "Marketing plans and publishes. Sales qualifies and closes. Service triages and resolves. Customer success monitors and expands. Each workflow is well-understood within its domain. The problem is between them."
Graph: Four parallel linear flows, color-coded by domain
Camera: Wide view showing all four pipelines
Duration: ~15s

**Step 3: Agents Per Department**
Title: "Each Department Adds Its Own AI"
Narration: "SDR agents in sales. Chatbots in service. Content generators in marketing. Health-score models in customer success. Each agent accelerates its own function. None of them share context. The sales agent doesn't know about the open support ticket. The marketing agent keeps targeting a churning account."
Graph: Agents appear around each pipeline
Duration: ~20s

**Step 4: The Handoff Problem**
Title: "The Customer Doesn't Experience Departments"
Narration: "A lead that marketing qualified gets ignored by sales because the scoring criteria don't match. A deal closes but service has no context on what was promised. A customer escalates through support while their CSM doesn't know. Every handoff between functions is a potential failure point — and most organizations have no system to govern them."
Graph: Show broken/highlighted handoff points between pipelines
Duration: ~15s

**Step 5: Full Graph Reveal**
Title: "This Is What the Front Office Actually Navigates"
Narration: "Four departments. Dozens of agents. Hundreds of knowledge dependencies. Cross-functional gates where human judgment determines whether a lead becomes a customer, a complaint becomes an escalation, or a renewal becomes an expansion. The complexity isn't accidental. It reflects how enterprise revenue actually works."
Graph: Explode to full cross-functional graph
Camera: Pull back to reveal full network
Duration: ~12s

**Step 6: The Intelligence Layer**
Title: "Shared Knowledge Connects Everything"
Narration: "Customer 360 profiles. Product catalogs. Compliance frameworks. Pricing rules. Territory models. These shared inputs feed agents across every function. A service agent that knows the customer's purchase history. A sales agent that knows the open support cases. A marketing agent that suppresses at-risk accounts. The intelligence layer is what turns departmental agents into a coordinated system."
Graph: Highlight shared inputs and their connections to all domain clusters
Camera: Focus on the central shared infrastructure
Duration: ~20s

**Step 7: Cross-Functional Gates**
Title: "Human Judgment at the Boundaries"
Narration: "Agents handle volume and velocity within departments. Humans add the most value at the boundaries — where a marketing-qualified lead becomes a sales opportunity, where a closed deal becomes a service engagement, where a support pattern triggers a CSM intervention. These cross-functional gates are where organizational judgment matters most."
Graph: Highlight gates and cross-domain handoff nodes
Duration: ~12s

**Step 8: Operating Model**
Title: "Roles Shift from Execution to Orchestration"
Narration: "Revenue operations moves from reporting to orchestrating. Sales ops moves from CRM administration to pipeline intelligence. Marketing ops moves from campaign execution to demand system design. The operating model doesn't eliminate roles — it elevates them from departmental execution to cross-functional orchestration."
Graph: Show role associations across domains
Duration: ~10s

**Step 9: Close**
Title: "Build the Operating System, Then Let Agents Perform"
Narration: "Map the domains. Build the knowledge graph. Connect the handoffs. Then let agents operate with shared context and human governance at the gates that matter. Better models keep arriving. They work best when they have better knowledge to draw on — and when that knowledge spans the entire front office."
Graph: Full graph, slowly rotating
Duration: ~12s

---

## 6. Mode Adaptations for Front Office Lens

### Guided Tour
Fully new: 10-step front office narrative (defined above). New `presentation-steps-frontoffice.json`.

### Explore Mode
Loads `seed-graph-frontoffice.json` instead of `seed-graph.json`. Filter panel groups by domain cluster instead of lifecycle phase. Search works identically.

### Campaign Mode → "Customer Journey" Mode
Rename to "Customer Journey" when in front office lens. Instead of walking through a content production campaign, walk through a customer's lifecycle:
1. Marketing sees the signal → creates campaign
2. Lead generated → handoff to sales
3. Sales qualifies, proposes, closes → handoff to service/CS
4. Service onboards, supports → CS monitors health
5. Expansion signal → handoff back to sales
6. Feedback loop → back to marketing

At each node: same interaction (who owns it, agent vs. human, estimated time, inputs/outputs). At each gate: same decision pattern (approve, revise, escalate). At handoffs: new decision — accept handoff, request more context, redirect.

### Build It Mode
Same playbook structure (Act 1: Vision, Act 2: What to Gather, Act 3: Architecture, Act 4: Build). Content adjusts:
- Act 2 input cards expand beyond marketing to include sales ops data, service management data, CS health metrics
- Act 3 cross-domain dependencies expand from "7 domains feeding marketing" to "all domains feeding each other"
- Act 4 build timeline remains similar (same team, same phases, bigger scope)

**Decision point:** Do we create fully separate build-steps for front office, or parameterize the existing ones? Recommend separate file (`build-steps-frontoffice.ts`) for clean separation.

### ROI Simulator
Expand from marketing cost savings to front office revenue impact:
- Add: Revenue leakage from handoff failures (quantifiable)
- Add: Sales velocity improvement from shared context
- Add: Service efficiency from agent-assisted resolution
- Add: Renewal rate improvement from proactive CS
- Keep: Marketing production cost reduction (subset of total)

New `roi-steps-frontoffice.ts` with adjusted financial models.

### Role Mode
New role set (~16-20 roles) spanning all four functions:

**Marketing (4):**
- VP Marketing / CMO — Strategic oversight
- Marketing Ops Manager — System orchestration
- Content Director — Creative direction
- Demand Gen Manager — Pipeline contribution

**Sales (4):**
- VP Sales / CRO — Revenue accountability
- Sales Ops Manager — Pipeline intelligence
- Account Executive — Deal execution
- Sales Development Rep — Pipeline generation

**Service (4):**
- VP Service — Customer satisfaction
- Service Ops Manager — Queue optimization
- Support Engineer — Technical resolution
- Knowledge Manager — Institutional capture

**Customer Success (3):**
- VP Customer Success — Retention & expansion
- Customer Success Manager — Account health
- Onboarding Specialist — Implementation

**Cross-Functional (3):**
- Revenue Operations Lead — Cross-functional orchestration
- Data / Analytics Lead — Unified measurement
- Compliance Officer — Cross-domain governance

New `role-definitions-frontoffice.ts` with domain-specific narratives, owned steps, reviewed gates, and maturity evolution.

---

## 7. Implementation Plan

### Phase 1: Data Model (Week 1)
- Define `seed-graph-frontoffice.json` — all nodes, all links, all metadata
- Add `hands-off-to` link type to `link-styles.ts`
- Validate node count, link density, and visual balance in ForceGraph3D
- Test force simulation convergence with domain clustering

### Phase 2: Landing Page Toggle (Week 1)
- Add `lens` to presentation store
- Add toggle component to landing page
- Pass lens to `/graph` via session storage (same pattern as mode)
- Graph page loads appropriate data file based on lens

### Phase 3: Guided Tour (Week 2)
- Write `presentation-steps-frontoffice.json` (10 steps)
- Implement linear-process equivalent for front office (4 parallel pipelines)
- New `show-departmental-pipelines` action in PresentationController
- New `show-handoff-problem` action
- Test full autoplay flow

### Phase 4: Explore + Campaign (Week 2-3)
- Explore: add domain-cluster grouping to filter panel
- Campaign → Customer Journey: new journey sequence, handoff decision UI
- New `step-narratives-frontoffice.ts` for all front office nodes

### Phase 5: Build + ROI (Week 3)
- `build-steps-frontoffice.ts` — adapted playbook
- `roi-steps-frontoffice.ts` — expanded financial model
- Test both modes end-to-end

### Phase 6: Roles (Week 3-4)
- `role-definitions-frontoffice.ts` — 18 roles across 5 categories
- Role subgraph filtering for cross-functional roles
- Role narrative deep-dives with industry benchmarks

### Phase 7: Polish (Week 4)
- Cross-test both lenses, all modes
- Narration tone review (pragmatic, understated)
- Performance validation (particle budget, frame rate)
- Mobile responsiveness for landing page toggle

---

## 8. What We Don't Touch

These are settled and must not change:

- **GraphScene.tsx** — Visualization engine, node caching, material caching
- **Force simulation parameters** — d3AlphaDecay values by mode
- **Camera navigation** — `navigateToNode()` with fixed 120-unit offset
- **Performance constraints** — Particle budget <200, no backdrop-filter blur, nodeGroupCache
- **Node/link visual styles** — Same 4 node types, same geometry/color mapping
- **Store architecture** — Zustand stores, granular selectors
- **Mode system** — Same 6 modes (relabeled in UI where needed, not restructured)
- **Narration tone** — Pragmatic, understated, practitioner-grade

---

## 9. Open Decision Points

These need your input before implementation:

### Decision 1: Default Lens
Should the landing page default to "Front Office" (bigger story, bigger deal) or "Marketing Operations" (proven, specific, current depth)?

**Recommendation:** Default to Front Office. Lead with the bigger story. Marketing becomes the "go deeper" option.

### Decision 2: Campaign Mode Naming
In front office lens, rename "Campaign" to "Customer Journey"? Or keep "Campaign" and change the workflow content?

**Recommendation:** Rename to "Customer Journey" — it accurately describes the cross-functional walkthrough and avoids confusion with the marketing-specific meaning of "campaign."

### Decision 3: Linear Process Visualization
The marketing guided tour starts with a single linear pipeline. The front office version needs to show 4 parallel pipelines (or a single cross-functional pipeline). Which approach?

**Recommendation:** Start with 4 parallel pipelines (one per domain). This is the "departmental silos" view. Then collapse them into a single integrated flow when showing the "operating system" view. The visual transition from 4 separate → 1 connected is the "aha moment."

### Decision 4: Marketing Depth in Front Office Graph
In the front office graph, marketing is condensed to ~13 nodes. The full marketing graph (75 nodes) remains available in the marketing lens. Should the front office graph allow "drill into marketing" to show the full depth? Or keep the two lenses completely separate?

**Recommendation:** Keep them separate. The front office graph is about breadth and connections. The marketing graph is about depth. Trying to do both in one graph creates a mess. A subtle "See the full Marketing Operations graph →" link at the bottom of the marketing cluster detail panel is sufficient.

### Decision 5: Graph Clustering
Should the front office graph use explicit force-directed clustering (nodes grouped by domain) or let the force simulation find natural positions?

**Recommendation:** Use explicit clustering via `group` field on nodes (already supported by ForceGraph3D). Each domain cluster naturally coalesces, with cross-domain handoff nodes in the interstitial space and shared inputs in the center. This produces a legible visual without manual positioning.

### Decision 6: Build Mode Content
Create fully separate build-steps-frontoffice.ts, or add a "front office extension" to the existing build content?

**Recommendation:** Separate file. The build mode content is deeply specific (input cards, domain dependencies, team roles). Trying to parameterize it creates conditional complexity that's harder to maintain than two clean files. The front office build content will reference the same knowledge graph layers (Structural, Process, Rules, Metrics, Context) but with cross-functional examples.

---

## 10. Risk Assessment

### Execution Risk: Content Volume
The front office version requires ~90 new nodes with metadata, ~50+ step narratives, 10 guided tour narrations, 18 role definitions with maturity journeys, new build mode content, and new ROI calculations. This is 3-4 weeks of content creation beyond the code work.

**Mitigation:** Phase the content. Ship with guided tour + explore + campaign first. Build, ROI, and Role modes follow as v2.

### Strategic Risk: Credibility Breadth
The marketing version has practitioner-grade depth (31 steps, 16 roles, specific SOPs). If the front office version feels shallow across domains, it undermines the "operating system" claim.

**Mitigation:** Each domain needs at least 10-12 nodes with real metadata (inputs, outputs, owners, estimated times). The narrative tone should acknowledge this is an architecture view, not a domain-specific playbook. "The marketing lens shows the operational depth. This view shows how it connects."

### UX Risk: Toggle Confusion
Two "products" behind one URL. First-time visitors may not understand the choice.

**Mitigation:** Default to Front Office with clear subtitle. Position Marketing as "deep dive into one domain." Consider making the toggle available only after the guided tour completes (or as a prominent option within the graph page's mode toggle).

### Performance Risk: Graph Density
~90-100 nodes is 20-30% more than the current 75. With cross-domain links, total links could reach 250+.

**Mitigation:** Keep the same particle budget. Cross-domain handoff links get 2 particles each (8 links = 16 particles). Shared input `uses` links get 0 particles (same as current). Total should stay under 200.

---

## 11. Success Criteria

1. A first-time visitor understands the "front office operating system" concept within the first 3 slides of the guided tour
2. The graph reveal (Step 5) produces a visible "holy shit" moment — four distinct domain clusters connected by handoffs and shared knowledge
3. The Customer Journey walkthrough demonstrates a complete lead-to-renewal lifecycle with cross-functional handoffs
4. The marketing lens remains fully intact and independently compelling
5. Performance stays within budget on a MacBook running a screen share
6. The narration tone remains pragmatic and practitioner-grade throughout
