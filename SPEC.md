# SPEC: Simplified Content Production Graph

## Problem

The current graph has 8 node types, 72+ nodes, and 11 link types. It models an entire marketing
org (people, departments, reporting lines, external touchpoints, knowledge artifacts). This is
too complex for the intended purpose: **demonstrating to clients/stakeholders how AI agents fit
into a content production workflow with clear human-in-the-loop escalation points.**

Stakeholders don't need an org chart. They need to see:
- What steps happen in the content lifecycle
- Which steps an agent handles vs a human
- When and why work escalates to a human
- How data flows through the process

## New Model: 4 Node Types

### 1. `step` (was: task, process-step)
A concrete action in the content production lifecycle. The core building block.

```
{
  id: "draft-content",
  type: "step",
  label: "Draft Content",
  description: "Write first draft based on the brief and brand voice guidelines",
  group: "Creation",
  val: 5,
  meta: {
    phase: "Creation",          // which lifecycle phase this belongs to
    owner: "agent" | "human" | "shared",  // who does this work
    agentName?: "Content Writer Agent",    // if agent-owned, which agent
    estimatedTime?: "15 min",              // optional: how long this typically takes
    inputs: ["Approved Brief", "Brand Voice Guide"],   // what this step needs
    outputs: ["Draft Article"]             // what this step produces
  }
}
```

### 2. `gate` (was: decision)
A checkpoint where work is reviewed, approved, or sent back. This is where
human-in-the-loop happens. Gates are the key visual element for stakeholders.

```
{
  id: "brand-check",
  type: "gate",
  label: "Brand Review",
  description: "Check content against brand guidelines. Agent flags issues, human approves exceptions.",
  group: "Review",
  val: 6,
  meta: {
    gateType: "approval" | "quality-check" | "escalation",
    reviewer: "Brand Manager",         // who reviews at this gate
    autoPassCriteria?: "Score > 85%",  // when the agent can auto-pass
    escalationTrigger: "Brand score below 70% or new tone requested",
    decisions: ["Approve", "Revise", "Escalate"]  // possible outcomes
  }
}
```

### 3. `agent` (stays, but simplified)
An AI agent that performs work. Fewer agents, more focused on the content lifecycle.

```
{
  id: "writer-agent",
  type: "agent",
  label: "Content Writer",
  description: "Drafts blog posts, social copy, and email content based on briefs",
  group: "AI Agents",
  val: 5,
  meta: {
    capability: "Generates marketing content from briefs",
    autonomy: "supervised",     // simplified from autonomyLevel
    tools: ["Brand voice checker", "SEO scorer", "Readability analyzer"]
  }
}
```

### 4. `input` (was: data-source, knowledge-artifact, combined)
Something that feeds into the process. Could be data, a document, or a tool.
Stakeholders don't care about the distinction between "data source" and
"knowledge artifact" - they care about what goes in.

```
{
  id: "brand-guide",
  type: "input",
  label: "Brand Voice Guide",
  description: "Rules for tone, style, and messaging across all content",
  group: "Reference",
  val: 4,
  meta: {
    inputType: "reference" | "data" | "tool",  // loose categorization
    source?: "Internal documentation",
    refreshRate?: "Quarterly"
  }
}
```

## What Gets Cut

| Old Type | Action | Reason |
|----------|--------|--------|
| `person` (15 nodes) | **Removed** | Agents don't need org charts. People appear as `reviewer` on gates. |
| `external-touchpoint` (6 nodes) | **Removed** | Customers, media, etc. are implied by the process, not nodes. |
| `knowledge-artifact` (9 nodes) | **Merged into `input`** | Stakeholders see "Brand Guide" not "Knowledge Artifact". |
| `data-source` (9 nodes) | **Merged into `input`** | Same simplification. "Analytics Data" not "Data Source". |
| `process-step` (5 nodes) | **Merged into `step`** | One unified step concept. |

## New Link Types (6, down from 11)

| Link Type | Meaning | Visual |
|-----------|---------|--------|
| `flows-to` | Step A leads to Step B | Solid arrow, animated particles |
| `reviews` | Gate checks the output of a step | Red dashed arrow |
| `escalates-to` | Gate sends work to a human reviewer | Thick red arrow, fast particles |
| `uses` | Step or Agent uses an input | Thin dotted line |
| `performs` | Agent performs a step | Purple solid arrow |
| `returns-to` | Gate sends work back for revision | Orange arrow, reverse direction |

## What Gets Cut (Links)

| Old Link Type | Action | Reason |
|---------------|--------|--------|
| `reports-to` | **Removed** | Org hierarchy, not process |
| `collaborates-with` | **Removed** | Org relationships |
| `depends-on` | **Replaced by `flows-to`** | Simpler language |
| `feeds-into` | **Replaced by `flows-to`** | Same concept |
| `informed-by` | **Replaced by `uses`** | Simpler language |
| `monitors` | **Removed** | Too abstract for stakeholders |
| `manages` | **Replaced by `performs`** | Clearer verb |
| `produces` | **Implied by `flows-to`** | Redundant |
| `consumes` | **Replaced by `uses`** | Simpler language |

## The Content Production Lifecycle

The graph will model this specific workflow (agency-side content production):

```
Phase 1: BRIEF
  [Client Request] --> [Research & Insights] --> [Write Brief] --> {Brief Approval Gate}

Phase 2: CREATION
  {Brief Approval} --> [Draft Content] --> [SEO Optimization] --> {Quality Gate}

Phase 3: REVIEW
  {Quality Gate} --> [Brand Compliance Check] --> {Brand Gate} --> [Final Edit]

Phase 4: PUBLISH
  [Final Edit] --> {Stakeholder Sign-off} --> [Schedule & Publish] --> [Distribute]

Phase 5: MEASURE
  [Distribute] --> [Track Performance] --> [Generate Report] --> {Performance Gate}
  {Performance Gate} --> [Optimize] (loops back to Creation if needed)
```

### Node Count Estimate

| Type | Count | Examples |
|------|-------|---------|
| `step` | ~15 | Research, Write Brief, Draft, SEO, Edit, Publish, Distribute, Track, Report, Optimize |
| `gate` | ~5 | Brief Approval, Quality Check, Brand Review, Stakeholder Sign-off, Performance Review |
| `agent` | ~4 | Research Agent, Content Writer, SEO Optimizer, Performance Analyst |
| `input` | ~5 | Brand Guide, Content Strategy, Analytics Data, Audience Personas, SEO Tools |
| **Total** | **~29** | Down from 72+ (60% reduction) |

## Node Style Updates

| Type | Color | Shape | Emoji | Rationale |
|------|-------|-------|-------|-----------|
| `step` | `#3b82f6` blue | sphere | `>` | Neutral, action-oriented |
| `gate` | `#ef4444` red | dodecahedron | `!` | Attention-grabbing, "stop and check" |
| `agent` | `#8b5cf6` purple | torus | `*` | Distinct, recognizable from current |
| `input` | `#f59e0b` amber | box | `i` | Information/resource feel |

## Language Rules

All labels and descriptions should follow these rules for stakeholder clarity:
- **Use verbs for steps**: "Draft Content" not "Content Drafting"
- **Use plain nouns for gates**: "Brand Review" not "Brand Voice Exception Evaluation"
- **No jargon in descriptions**: "Check if content matches brand rules" not "Ensure adherence to established brand identity parameters"
- **Agent names should be job titles**: "Content Writer" not "Content Generation Agent"
- **Inputs should be what they are**: "Brand Guide" not "Brand Guidelines Knowledge Artifact"

## Files That Change

1. **`src/lib/graph/types.ts`** - New NodeType, LinkType, meta interfaces
2. **`src/data/seed-graph.json`** - Completely rewritten with new nodes/links
3. **`src/lib/graph/node-styles.ts`** - 4 styles instead of 8
4. **`src/lib/graph/link-styles.ts`** - 6 styles instead of 11
5. **`src/lib/graph/filters.ts`** - Works unchanged (generic), but filter UI will show fewer types
6. **`src/components/graph/LegendPanel.tsx`** - Updated to reflect 4 types
7. **`src/components/graph/NodeDetailPanel.tsx`** - Updated meta display
8. **`src/data/linear-process.json`** - Updated or removed (phases baked into step.meta.phase)

## Build Order

1. Update `types.ts` with new types
2. Rewrite `seed-graph.json` with content lifecycle data
3. Update `node-styles.ts` and `link-styles.ts`
4. Update UI components (Legend, NodeDetail)
5. Test the graph renders correctly
6. Update linear-process.json if it still exists

## What Success Looks Like

A stakeholder looks at this graph and can immediately answer:
- "Where does the AI do the work?"
- "Where does a human check the work?"
- "What happens when something fails a review?"
- "What information does the AI use to do its job?"

Without needing to understand org charts, data architectures, or knowledge management.
