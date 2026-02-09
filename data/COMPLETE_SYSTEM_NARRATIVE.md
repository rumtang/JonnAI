# Complete System Narrative — Agentic Content Production Graph

> **Purpose of this document:** This is the single source of truth for every piece of text, narrative, relationship, and structural metadata in the Agentic project. It is designed so that Claude Opus 4.6 (or any LLM) can read this one file and fully understand: what the system is, how every piece connects, what the narrative says, and why each design decision was made.

> **How to use this document:** Read it top-to-bottom for full context, or jump to a section by ID. Every node, link, role, and narrative block is here. Cross-references use `[node-id]` notation so you can search for any ID and find everywhere it appears.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [The Core Thesis](#2-the-core-thesis)
3. [The 6-Phase Model](#3-the-6-phase-model)
4. [Node Types and Visual Language](#4-node-types-and-visual-language)
5. [Link Types and What They Mean](#5-link-types-and-what-they-mean)
6. [Main Workflow Path (31 Steps)](#6-main-workflow-path)
7. [All 75 Nodes — Complete Reference](#7-all-75-nodes)
   - 7a. Steps (31 nodes)
   - 7b. Gates (9 nodes)
   - 7c. Agents (11 nodes)
   - 7d. Inputs (24 nodes)
8. [All Links — Complete Relationship Map](#8-all-links)
9. [Step Narratives (Deep Storytelling)](#9-step-narratives)
10. [Role Definitions (16 Roles)](#10-role-definitions)
11. [Presentation Walkthrough (18 Slides)](#11-presentation-walkthrough)
12. [Side Branches and Parallel Paths](#12-side-branches)
13. [Feedback Loops and Escalation Paths](#13-feedback-loops)
14. [The Knowledge Graph Layer](#14-knowledge-graph-layer)
15. [Design Decisions and Architecture](#15-design-decisions)

---

## 1. System Overview

This project is a **3D interactive visualization** of a complete content production operating system for enterprise marketing. It renders 75 nodes and 150+ directed links as a force-directed 3D graph using Three.js and react-force-graph-3d inside a Next.js 16 application.

The visualization serves two audiences:
- **CMOs and marketing leaders** who need to see how AI agents fit into their content workflow
- **Marketing practitioners** who need to understand how their role changes when AI handles production tasks

The system models the complete lifecycle of content — from campaign planning through governance of live assets — showing every step, every quality gate, every AI agent, and every reference input that makes the system work.

**What makes this different from a process diagram:** This is not a pipeline. It is a graph with feedback loops, branching paths, escalation routes, and a knowledge layer (the input nodes) that connects to multiple steps and agents simultaneously. The central narrative argument is that this graph structure — not the individual AI agents — is what creates competitive advantage.

---

## 2. The Core Thesis

The presentation builds to a single strategic argument:

> **Agents commoditize. Infrastructure compounds.**

The AI agents (Research Agent, Content Writer, SEO Optimizer, etc.) are interchangeable execution components. You can swap them for better models next quarter. They improve one step at a time.

The knowledge graph — the 24 input nodes containing brand guides, legal guidelines, audience personas, scoring matrices, orchestration rules — is what compounds. Every time you refine a persona, every agent that references it gets better simultaneously. Every time you update a legal guideline, every compliance check across the system becomes more accurate.

This asymmetry (linear improvement from agents vs. multiplicative improvement from infrastructure) is the strategic insight the presentation delivers.

**The implication for organizations:** Stop thinking about AI as a collection of productivity tools (each person gets faster). Start thinking about it as an operating system that requires structured context, governance, and a new role — the Context Engineer — to maintain the knowledge infrastructure that makes everything work.

---

## 3. The 6-Phase Model

The content production lifecycle has 6 phases. These map to the `group` field on every step and gate node.

| Phase | What Happens | Key Question |
|-------|-------------|--------------|
| **Strategy** | Campaign planning, journey mapping, request intake, scoring, research, brief writing | What should we create and why? |
| **Create** | Drafting, SEO optimization, visual assets, A/B variants, paid creative, sales enablement | How do we produce it? |
| **Review** | Brand compliance, legal review, accessibility check, final edit, UGC moderation | Is it good enough and safe to publish? |
| **Publish** | Localization, segment mapping, consent check, dynamic assembly, orchestration, scheduling, distribution | How do we get it to the right people? |
| **Measure** | Performance tracking, report generation, attribution modeling, executive reporting, sentiment monitoring, archive & tag | How did it perform? |
| **Optimize** | Performance review, optimization, content repurposing, governance, governance gate | What do we do next? |

The linear process view (shown in presentation slides 1-3) presents these as a simple left-to-right pipeline:
- Strategy → Create → Review → Publish → Measure → Optimize

The full graph (revealed in slide 7) shows that this is a fiction — the real structure has feedback loops, branching paths, and a knowledge layer that connects everything.

### Linear Process Display Data

Used for the simplified "pipeline everyone draws" view in early presentation slides:

| ID | Label | Description | Position |
|----|-------|-------------|----------|
| ls-strategy | Strategy | Define scope, research audience, and write the content brief | x: -500 |
| ls-create | Create | Draft content, optimize for SEO, and produce assets | x: -300 |
| ls-review | Review | Check brand compliance, edit, and approve for publication | x: -100 |
| ls-publish | Publish | Schedule, publish, and distribute across channels | x: 100 |
| ls-measure | Measure | Track performance and generate reports | x: 300 |
| ls-optimize | Optimize | Review results, optimize content, and govern live assets | x: 500 |

Agent overlay on linear view:
| ID | Label | Parent Phase |
|----|-------|-------------|
| la-research | Research Agent | Strategy |
| la-writer | Content Writer | Create |
| la-seo | SEO Optimizer | Create |
| la-performance | Performance Analyst | Measure |

---

## 4. Node Types and Visual Language

| Type | Count | Color | Shape | Emoji | Purpose |
|------|-------|-------|-------|-------|---------|
| `step` | 31 | Blue #3b82f6 | Sphere | > | A concrete action in the workflow |
| `gate` | 9 | Red #ef4444 | Dodecahedron | ! | A human review checkpoint |
| `agent` | 11 | Purple #8b5cf6 | Torus | * | An AI agent that performs work |
| `input` | 24 | Amber #f59e0b | Box | i | Reference data, tools, or documents |

**Design rationale:** Stakeholders need to immediately see: where AI does work (purple), where humans check work (red), what the workflow is (blue), and what information feeds the system (amber). Four types, four colors, instantly parseable.

---

## 5. Link Types and What They Mean

| Link Type | Visual | Meaning | Example |
|-----------|--------|---------|---------|
| `flows-to` | Solid arrow, animated particles | Work sequence — step A leads to step B | draft-content → seo-optimization |
| `performs` | Purple solid arrow | Agent executes this step | writer-agent → draft-content |
| `uses` | Thin dotted line | Step or agent consumes this input | draft-content → brand-guide |
| `reviews` | Red dashed arrow | Gate checks the output of a step | quality-check → seo-optimization |
| `returns-to` | Orange arrow, reverse direction | Gate sends work back for revision | brand-review → brand-compliance |
| `escalates-to` | Thick red arrow, fast particles | Gate escalates to a higher authority | brand-review → stakeholder-signoff |

---

## 6. Main Workflow Path

This is the primary 31-step spine that the campaign walkthrough follows. Side branches diverge from this path but are not the main flow.

```
campaign-planning → journey-mapping → receive-request → content-scoring →
research-insights → write-brief → brief-approval → draft-content →
visual-asset-creation → seo-optimization → quality-check →
brand-compliance → brand-review → legal-review → legal-compliance-gate →
final-edit → accessibility-check → stakeholder-signoff →
localize-content → localization-quality-gate → schedule-publish →
distribute → track-performance → generate-report → attribution-modeling →
executive-reporting → performance-review → optimize → archive-tag →
content-governance → governance-gate
```

### Why this order matters

Each step feeds the next. The order encodes dependencies:
- You cannot score content without a campaign plan
- You cannot write a brief without research
- You cannot draft without an approved brief
- You cannot distribute without legal clearance and stakeholder sign-off
- You cannot optimize without performance data
- Governance loops back to the beginning — making this a cycle, not a line

---

## 7. All 75 Nodes — Complete Reference

### 7a. Steps (31 nodes)

#### STRATEGY PHASE

**[campaign-planning]** — Campaign Planning
- Description: Define campaign objectives, audience targets, channel mix, budget allocation, timeline, and success KPIs before any content requests are generated.
- Owner: human | Est. Time: 2 hours
- Inputs: Content Strategy, Analytics Data, Channel Benchmarks, CDP Profiles, Budget Allocation
- Outputs: Campaign plan, Budget breakdown, Channel allocation, KPI targets
- Connected agents: none (human-owned)
- Uses inputs: [content-strategy], [analytics-data], [channel-benchmarks], [cdp-profiles], [budget-allocation]
- Flows to: [journey-mapping], [receive-request], [influencer-brief]

**[journey-mapping]** — Journey Stage Mapping
- Description: Map content assets to customer journey stages (awareness, consideration, decision, retention, advocacy) using CDP lifecycle data and content taxonomy.
- Owner: shared | Est. Time: 20 min
- Inputs: CDP Profiles, Content Taxonomy, Content Strategy, Audience Personas
- Outputs: Journey-content map, Gap analysis by stage, Priority content requests
- Uses inputs: [cdp-profiles], [content-taxonomy], [content-strategy], [audience-personas]
- Flows to: [receive-request]

**[receive-request]** — Receive Request
- Description: Intake client or stakeholder content request and define initial scope.
- Owner: human | Est. Time: 30 min
- Inputs: Client brief, Campaign objectives
- Outputs: Scoped request
- Uses inputs: [approval-matrix]
- Flows to: [content-scoring], [social-listening]

**[content-scoring]** — Content Scoring & Prioritization
- Description: Score and rank incoming content requests against strategic priority, audience demand, resource availability, and expected ROI. Triage the production queue.
- Owner: shared | Agent: Research Agent | Est. Time: 10 min
- Inputs: Campaign plan, Content Strategy, Scoring Matrix, Analytics Data, Budget Allocation
- Outputs: Prioritized request queue, Resource allocation plan, Deferred request log
- Uses inputs: [content-strategy], [scoring-matrix], [analytics-data], [budget-allocation]
- Performed by: [research-agent]
- Flows to: [research-insights]

**[research-insights]** — Research & Insights
- Description: Gather audience data, competitive intel, and trending topics to inform the brief.
- Owner: agent | Agent: Research Agent | Est. Time: 15 min
- Inputs: Audience Personas, Analytics Data, Content Strategy
- Outputs: Research summary, Keyword opportunities, Competitive gaps
- Uses inputs: [analytics-data], [audience-personas], [content-strategy], [competitor-library]
- Performed by: [research-agent]
- Flows to: [write-brief]

**[write-brief]** — Write Brief
- Description: Create a structured content brief with objectives, audience, key messages, and format.
- Owner: shared | Agent: Content Writer | Est. Time: 20 min
- Inputs: Research summary, Content Strategy, Brand Voice Guide
- Outputs: Content brief
- Uses inputs: [content-strategy], [brand-guide]
- Performed by: [writer-agent]
- Flows to: [brief-approval]

**[social-listening]** — Social Listening (SIDE BRANCH)
- Description: Monitor social platforms, forums, and news for trending topics, audience sentiment, and competitive activity to inform the brief.
- Owner: agent | Agent: Social Listening Agent | Est. Time: 10 min
- Inputs: Analytics Data, Audience Personas, Competitor Library
- Outputs: Trending topics, Sentiment snapshot, Competitive signals
- Uses inputs: [analytics-data], [audience-personas], [competitor-library]
- Performed by: [social-listening-agent]
- Flows to: [research-insights], [competitive-response]

**[competitive-response]** — Competitive Response (SIDE BRANCH)
- Description: Rapid-turn content creation triggered by competitive signals: counter-messaging, reactive thought leadership, or opportunistic content responding to competitor moves or market shifts.
- Owner: shared | Agent: Research Agent | Est. Time: 30 min
- Inputs: Competitor Library, Social listening signals, Content Strategy, Brand Voice Guide
- Outputs: Competitive response brief, Priority flag, Fast-track approval request
- Uses inputs: [competitor-library], [content-strategy], [brand-guide]
- Performed by: [research-agent]
- Flows to: [draft-content]

#### CREATE PHASE

**[draft-content]** — Draft Content
- Description: Write the first draft based on the approved brief and brand voice guidelines.
- Owner: agent | Agent: Content Writer | Est. Time: 15 min
- Inputs: Approved brief, Brand Voice Guide, Audience Personas
- Outputs: Draft article
- Uses inputs: [brand-guide], [audience-personas]
- Performed by: [writer-agent]
- Flows to: [visual-asset-creation], [seo-optimization]

**[visual-asset-creation]** — Create Visual Assets
- Description: Design or source supporting imagery, graphics, infographics, and video thumbnails aligned with the content brief and brand guidelines.
- Owner: shared | Est. Time: 45 min
- Inputs: Approved brief, Brand Voice Guide, Asset Library
- Outputs: Hero image, Supporting graphics, Alt text
- Uses inputs: [brand-guide], [asset-library]
- Flows to: [quality-check]

**[seo-optimization]** — SEO Optimization
- Description: Optimize draft for search: keywords, meta descriptions, headings, internal links.
- Owner: agent | Agent: SEO Optimizer | Est. Time: 10 min
- Inputs: Draft article, SEO Tools, Analytics Data
- Outputs: SEO-optimized draft
- Uses inputs: [seo-tools], [analytics-data]
- Performed by: [seo-agent]
- Flows to: [quality-check]

**[ab-variant-creation]** — A/B Variant Creation (SIDE BRANCH)
- Description: Generate test variants for headlines, CTAs, subject lines, and imagery based on channel benchmarks and historical performance data.
- Owner: agent | Agent: Repurposing Agent | Est. Time: 10 min
- Inputs: Final content, Channel Benchmarks, Analytics Data
- Outputs: Variant set, Test plan, Hypothesis documentation
- Uses inputs: [channel-benchmarks], [analytics-data]
- Performed by: [repurposing-agent]
- Flows to: [schedule-publish], [segment-mapping]

**[paid-creative-production]** — Paid Media Creative (SIDE BRANCH)
- Description: Produce ad creative, landing page variants, and sponsored content versions derived from the approved organic content, tailored to platform specs and audience targeting.
- Owner: shared | Agent: Repurposing Agent | Est. Time: 30 min
- Inputs: Final content, Channel Benchmarks, CDP Profiles, Brand Voice Guide, Budget Allocation
- Outputs: Ad creative set, Landing page variants, Platform-specific specs
- Uses inputs: [channel-benchmarks], [cdp-profiles], [brand-guide], [budget-allocation], [media-plan]
- Performed by: [repurposing-agent]
- Flows to: [segment-mapping]

**[sales-enablement]** — Sales Enablement Content (SIDE BRANCH)
- Description: Produce sales-facing content derived from marketing assets: battle cards, case studies, ROI calculators, objection handlers, competitive one-pagers, and pitch decks.
- Owner: shared | Agent: Repurposing Agent | Est. Time: 30 min
- Inputs: Final content, Competitor Library, Audience Personas, Sales Feedback Log, CDP Profiles
- Outputs: Battle cards, Case study drafts, ROI calculator, Competitive one-pagers
- Uses inputs: [competitor-library], [audience-personas], [sales-feedback-log], [cdp-profiles], [brand-guide]
- Performed by: [repurposing-agent]
- Flows to: [segment-mapping]

#### REVIEW PHASE

**[brand-compliance]** — Check Brand Compliance
- Description: Validate content against brand guidelines for tone, terminology, and messaging.
- Owner: agent | Agent: Content Writer | Est. Time: 5 min
- Inputs: SEO-optimized draft, Brand Voice Guide
- Outputs: Compliance report, Flagged issues
- Uses inputs: [brand-guide]
- Performed by: [writer-agent]
- Flows to: [brand-review]

**[legal-review]** — Legal Review
- Description: Screen content for regulatory compliance, IP risk, disclosure requirements, and claims substantiation before publication.
- Owner: shared | Agent: Legal Screening Agent | Est. Time: 15 min
- Inputs: Brand-approved draft, Legal Guidelines, Approval Matrix
- Outputs: Legal clearance memo, Flagged claims, Required disclosures
- Uses inputs: [legal-guidelines], [approval-matrix]
- Performed by: [legal-screening-agent]
- Flows to: [legal-compliance-gate]

**[accessibility-check]** — Accessibility Check
- Description: Verify content meets WCAG standards, inclusive language guidelines, and alt-text requirements for all visual assets.
- Owner: agent | Agent: Accessibility Agent | Est. Time: 5 min
- Inputs: Final content, Accessibility Standards, Visual assets
- Outputs: Accessibility report, Remediation list
- Uses inputs: [accessibility-standards]
- Performed by: [accessibility-agent]
- Flows to: [stakeholder-signoff]

**[final-edit]** — Final Edit
- Description: Human editor refines content for narrative flow, nuance, and final polish.
- Owner: human | Est. Time: 30 min
- Inputs: Brand-approved draft, Compliance report
- Outputs: Final content
- Flows to: [accessibility-check], [stakeholder-signoff], [ab-variant-creation], [paid-creative-production], [sales-enablement]

**[ugc-moderation]** — UGC Moderation & Curation (SIDE BRANCH)
- Description: Review, moderate, and curate user-generated and influencer-created content for brand safety, quality, rights clearance, and strategic alignment before amplification.
- Owner: shared | Agent: Content Writer | Est. Time: 20 min
- Inputs: UGC submissions, Brand Voice Guide, Legal Guidelines, Influencer Database
- Outputs: Approved UGC, Rights-cleared assets, Moderation log
- Uses inputs: [brand-guide], [legal-guidelines], [influencer-database]
- Performed by: [writer-agent]
- Flows to: [brand-review]

#### PUBLISH PHASE

**[localize-content]** — Localize Content
- Description: Adapt approved content for target markets including translation, cultural adaptation, local regulatory compliance, and region-specific imagery.
- Owner: shared | Agent: Localization Agent | Est. Time: 30 min
- Inputs: Final content, Localization Guides, Legal Guidelines
- Outputs: Localized content variants, Market-specific assets
- Uses inputs: [localization-guides], [legal-guidelines]
- Performed by: [localization-agent]
- Flows to: [localization-quality-gate]

**[segment-mapping]** — Segment-Variant Mapping (SIDE BRANCH)
- Description: Map approved content variants and A/B test variants to CDP audience segments using personalization rules, propensity scores, and channel affinity data.
- Owner: shared | Agent: Personalization Agent | Est. Time: 15 min
- Inputs: Final content, A/B variants, CDP Profiles, Personalization Rules, Channel Benchmarks
- Outputs: Segment-variant matrix, Coverage report, Suppression list
- Uses inputs: [cdp-profiles], [personalization-rules], [channel-benchmarks]
- Performed by: [personalization-agent]
- Flows to: [personalization-qa]

**[consent-check]** — Consent & Privacy Check (SIDE BRANCH)
- Description: Validate that all personalization, targeting, and data usage complies with GDPR, CCPA, and other applicable privacy regulations.
- Owner: agent | Agent: Privacy Compliance Agent | Est. Time: 3 min
- Inputs: Segment-variant matrix, CDP Profiles, Privacy Regulations
- Outputs: Consent validation report, Suppression list updates
- Uses inputs: [cdp-profiles], [privacy-regulations]
- Performed by: [privacy-agent]
- Flows to: [dynamic-assembly]

**[dynamic-assembly]** — Dynamic Content Assembly (SIDE BRANCH)
- Description: Construct the delivered experience per segment: select hero image, headline variant, CTA, and layout based on segment-variant matrix and real-time behavioral signals.
- Owner: agent | Agent: Personalization Agent | Est. Time: 5 min
- Inputs: Segment-variant matrix, CDP Profiles, Asset Library, Brand Voice Guide
- Outputs: Assembled content experiences, Preview renders per segment
- Uses inputs: [cdp-profiles], [asset-library], [brand-guide]
- Performed by: [personalization-agent]
- Flows to: [channel-orchestration], [schedule-publish]

**[channel-orchestration]** — Cross-Channel Orchestration (SIDE BRANCH)
- Description: Define distribution sequencing, channel-specific timing rules, and cross-channel coordination logic.
- Owner: shared | Agent: Personalization Agent | Est. Time: 15 min
- Inputs: Segment-variant matrix, Channel Benchmarks, Orchestration Rules, Media Plan, CDP Profiles
- Outputs: Distribution sequence, Channel-specific launch times, Cross-channel coordination plan
- Uses inputs: [channel-benchmarks], [orchestration-rules], [media-plan], [cdp-profiles]
- Performed by: [personalization-agent]
- Flows to: [schedule-publish]

**[schedule-publish]** — Schedule & Publish
- Description: Set publication date, configure CMS, and push content live.
- Owner: shared | Est. Time: 10 min
- Inputs: Final content, Content calendar
- Outputs: Published content
- Uses inputs: [approval-matrix], [orchestration-rules]
- Flows to: [distribute]

**[distribute]** — Distribute Content
- Description: Push content across channels: social, email, syndication, paid amplification.
- Owner: shared | Est. Time: 15 min
- Inputs: Published content, Channel strategy
- Outputs: Distribution confirmations
- Uses inputs: [channel-benchmarks], [orchestration-rules], [media-plan]
- Flows to: [track-performance], [content-repurposing], [sentiment-monitoring]

**[content-repurposing]** — Repurpose Content (SIDE BRANCH)
- Description: Derive secondary assets from the primary content piece: social posts, email snippets, video scripts, carousel decks, and pull quotes.
- Owner: agent | Agent: Repurposing Agent | Est. Time: 15 min
- Inputs: Published content, Content Strategy, Channel Benchmarks, Brand Voice Guide
- Outputs: Social posts, Email copy, Video script, Carousel deck
- Uses inputs: [brand-guide], [channel-benchmarks], [content-strategy]
- Performed by: [repurposing-agent]
- Flows to: [track-performance]

#### MEASURE PHASE

**[track-performance]** — Track Performance
- Description: Monitor engagement, traffic, conversions, and social signals in real time.
- Owner: agent | Agent: Performance Analyst | Est. Time: Continuous
- Inputs: Analytics Data, Published content
- Outputs: Performance metrics
- Uses inputs: [analytics-data], [cdp-profiles], [channel-benchmarks]
- Performed by: [performance-agent]
- Flows to: [generate-report]

**[generate-report]** — Generate Report
- Description: Compile performance data into an actionable report with recommendations.
- Owner: agent | Agent: Performance Analyst | Est. Time: 10 min
- Inputs: Performance metrics, Analytics Data, Content Strategy
- Outputs: Performance report
- Uses inputs: [analytics-data], [content-strategy], [budget-allocation]
- Performed by: [performance-agent]
- Flows to: [attribution-modeling], [performance-review]

**[attribution-modeling]** — Attribution & ROI Analysis
- Description: Run multi-touch attribution models, calculate content ROI by channel and segment, and generate spend efficiency analysis.
- Owner: agent | Agent: Performance Analyst | Est. Time: 15 min
- Inputs: Performance metrics, CDP Profiles, Budget Allocation, Channel Benchmarks
- Outputs: Attribution report, ROI by channel, Spend efficiency scorecard, Budget reallocation recommendations
- Uses inputs: [cdp-profiles], [budget-allocation], [channel-benchmarks]
- Performed by: [performance-agent]
- Flows to: [executive-reporting], [performance-review]

**[executive-reporting]** — Executive Reporting
- Description: Synthesize performance data, attribution results, and budget utilization into an executive-level dashboard with strategic recommendations.
- Owner: shared | Agent: Performance Analyst | Est. Time: 20 min
- Inputs: Attribution report, Performance report, Budget Allocation, Content Strategy, Campaign plan
- Outputs: CMO dashboard, Strategic recommendations, Budget reallocation proposal
- Uses inputs: [content-strategy], [budget-allocation]
- Performed by: [performance-agent]
- Flows to: [campaign-planning] (MAJOR FEEDBACK LOOP)

**[sentiment-monitoring]** — Sentiment Monitoring (SIDE BRANCH)
- Description: Real-time monitoring of audience sentiment, brand mention tone, and content reception signals across social, reviews, and support channels.
- Owner: agent | Agent: Social Listening Agent | Est. Time: Continuous
- Inputs: Analytics Data, CDP Profiles, Competitor Library
- Outputs: Sentiment alerts, Brand health score, Escalation triggers
- Uses inputs: [analytics-data], [cdp-profiles], [competitor-library]
- Performed by: [social-listening-agent]
- Flows to: [track-performance], [competitive-response]

**[archive-tag]** — Archive & Tag
- Description: Classify, tag, and archive content into the content taxonomy for future discovery, reuse, and governance reporting.
- Owner: shared | Est. Time: 5 min
- Inputs: Performance report, Content Taxonomy, Published content
- Outputs: Archived content record, Taxonomy tags, Reuse metadata
- Uses inputs: [content-taxonomy]
- Flows to: [content-governance]

#### OPTIMIZE PHASE

**[optimize]** — Optimize Content
- Description: Update headlines, CTAs, distribution mix, or repurpose based on performance data.
- Owner: shared | Est. Time: 20 min
- Inputs: Performance report, Original content
- Outputs: Optimized content, Iteration brief
- Uses inputs: [channel-benchmarks], [analytics-data]
- Flows to: [content-repurposing], [competitive-response], [receive-request], [archive-tag]

**[content-governance]** — Content Governance Review
- Description: Periodic review of live content for accuracy, regulatory currency, brand alignment drift, and performance decay.
- Owner: shared | Est. Time: 30 min
- Inputs: Content Taxonomy, Performance report, Legal Guidelines, Brand Voice Guide
- Outputs: Governance audit report, Refresh queue, Retirement list, Compliance exceptions
- Uses inputs: [content-taxonomy], [legal-guidelines], [brand-guide]
- Flows to: [governance-gate]

**[influencer-brief]** — Influencer & Creator Brief (SIDE BRANCH from Strategy)
- Description: Develop briefs for influencer collaborations, UGC campaigns, and co-created content.
- Owner: human | Est. Time: 45 min
- Inputs: Content Strategy, Brand Voice Guide, Audience Personas, CDP Profiles, Influencer Database, Budget Allocation
- Outputs: Influencer brief, Creator guidelines, UGC parameters, Collaboration terms
- Uses inputs: [content-strategy], [brand-guide], [audience-personas], [cdp-profiles], [influencer-database], [budget-allocation]
- Flows to: [ugc-moderation]

---

### 7b. Gates (9 nodes)

**[brief-approval]** — Brief Approval
- Description: Content lead reviews the brief for clarity, feasibility, and strategic alignment.
- Gate type: approval | Reviewer: Content Director
- Auto-pass: All required fields complete and strategy score above 80%
- Escalation trigger: Brief requires new audience segment or unplanned budget
- Decisions: Approve, Revise, Escalate
- Reviews: [write-brief] | Returns to: [write-brief]
- Flows to: [draft-content]

**[quality-check]** — Quality Check
- Description: Automated quality gate checking readability, factual accuracy, and SEO score.
- Gate type: quality-check | Reviewer: Content Writer Agent + Content Lead
- Auto-pass: Readability score > 70, SEO score > 85, no factual flags
- Escalation trigger: Factual claim flagged or readability below 50
- Decisions: Pass, Revise, Escalate to Editor
- Reviews: [seo-optimization] | Returns to: [draft-content] | Escalates to: [brand-review]
- Flows to: [brand-compliance]

**[brand-review]** — Brand Review
- Description: Check content against brand guidelines; agent flags issues, human approves exceptions.
- Gate type: quality-check | Reviewer: Brand Manager
- Auto-pass: Brand compliance score above 90%
- Escalation trigger: Brand score below 70% or new tone requested
- Decisions: Approve, Revise, Escalate
- Reviews: [brand-compliance] | Returns to: [brand-compliance] | Escalates to: [stakeholder-signoff]
- Flows to: [legal-review]

**[legal-compliance-gate]** — Legal Compliance Gate
- Description: Legal sign-off confirming content is clear of regulatory risk, IP issues, and disclosure requirements.
- Gate type: approval | Reviewer: Legal Counsel
- Auto-pass: No flagged claims, no regulated terms, disclosure checklist complete
- Escalation trigger: Regulated industry claim, competitor mention, or unsubstantiated performance data
- Decisions: Approve, Revise, Escalate, Hold
- Reviews: [legal-review] | Returns to: [brand-compliance] | Escalates to: [stakeholder-signoff]
- Flows to: [final-edit]

**[stakeholder-signoff]** — Stakeholder Sign-off
- Description: Final human approval before publication, checking strategic alignment and legal compliance.
- Gate type: approval | Reviewer: VP Marketing or Client
- Auto-pass: All upstream gates passed, content sensitivity score below threshold, no legal flags
- Escalation trigger: Sensitive topic, legal risk, or executive-visibility content
- Decisions: Approve, Revise, Hold, Escalate
- Reviews: [final-edit] | Returns to: [final-edit]
- Flows to: [localize-content], [schedule-publish]

**[localization-quality-gate]** — Localization Quality Gate
- Description: Quality check on localized content for translation accuracy, cultural appropriateness, and local regulatory compliance.
- Gate type: quality-check | Reviewer: Localization Manager
- Auto-pass: Translation confidence score above 90%, no cultural flags, local legal checklist passed
- Escalation trigger: Cultural sensitivity flag, legal divergence across markets, or translation confidence below 75%
- Decisions: Approve, Revise, Escalate
- Reviews: [localize-content] | Returns to: [localize-content] | Escalates to: [legal-compliance-gate]
- Flows to: [schedule-publish]

**[personalization-qa]** — Personalization QA Gate (SIDE BRANCH)
- Description: Validate segment-variant matrix for coverage gaps, suppression conflicts, frequency cap violations, and consent compliance.
- Gate type: quality-check | Reviewer: Growth Lead + Privacy Officer
- Auto-pass: All segments have assigned variants, no suppression conflicts, frequency caps within limits, consent flags validated
- Escalation trigger: Segment with no variant, consent flag missing, or frequency cap exceeded
- Decisions: Pass, Revise, Escalate
- Reviews: [segment-mapping] | Returns to: [segment-mapping] | Escalates to: [stakeholder-signoff]
- Flows to: [consent-check], [dynamic-assembly]

**[performance-review]** — Performance Review
- Description: Evaluate content performance against KPIs; decide whether to optimize, iterate, or archive.
- Gate type: quality-check | Reviewer: Analytics Lead
- Auto-pass: Meets 80% of target KPIs within first 7 days
- Escalation trigger: Performance below 50% of target or negative sentiment detected
- Decisions: Archive, Optimize, Iterate, Escalate
- Reviews: [generate-report] | Returns to: [optimize] | Escalates to: [receive-request]
- Flows to: [optimize], [archive-tag]

**[governance-gate]** — Governance Gate
- Description: Periodic checkpoint validating that all live content remains current, compliant, and brand-aligned.
- Gate type: quality-check | Reviewer: Content Director + Legal Counsel
- Auto-pass: Content less than 90 days old, no regulatory changes in category, performance above decay threshold
- Escalation trigger: Regulatory change affecting live content, brand guideline update, or content older than 180 days with declining performance
- Decisions: Maintain, Refresh, Retire, Escalate
- Reviews: [content-governance] | Returns to: [receive-request], [archive-tag] | Escalates to: [stakeholder-signoff]

---

### 7c. Agents (11 nodes)

**[research-agent]** — Research Agent
- Capability: Synthesizes market research, audience insights, and competitive data into actionable briefs
- Autonomy: supervised
- Tools: Audience analytics, Competitive tracker, Trend monitor, Keyword explorer
- Performs: [research-insights], [content-scoring], [competitive-response]
- Uses: [analytics-data], [audience-personas], [competitor-library], [scoring-matrix]

**[writer-agent]** — Content Writer
- Capability: Generates marketing content from structured briefs while maintaining brand voice consistency
- Autonomy: supervised
- Tools: Brand voice checker, Readability analyzer, Plagiarism detector, Tone calibrator
- Performs: [write-brief], [draft-content], [brand-compliance], [ugc-moderation]
- Uses: [brand-guide], [content-strategy]

**[seo-agent]** — SEO Optimizer
- Capability: Applies SEO best practices to maximize organic visibility without compromising readability
- Autonomy: supervised
- Tools: SEO scorer, Keyword density analyzer, SERP simulator, Internal link mapper
- Performs: [seo-optimization]
- Uses: [seo-tools], [analytics-data]

**[performance-agent]** — Performance Analyst
- Capability: Monitors content KPIs in real time and produces data-driven optimization recommendations
- Autonomy: supervised
- Tools: Analytics dashboard, Attribution modeler, A/B test analyzer, Sentiment tracker
- Performs: [track-performance], [generate-report], [attribution-modeling], [executive-reporting]
- Uses: [analytics-data], [cdp-profiles], [channel-benchmarks]

**[social-listening-agent]** — Social Listening Agent
- Capability: Synthesizes real-time social signals, trending topics, and sentiment data into actionable pre-brief intelligence
- Autonomy: supervised
- Tools: Social API monitor, Sentiment analyzer, Trend detector, Competitive tracker
- Performs: [social-listening], [sentiment-monitoring]
- Uses: [analytics-data], [audience-personas], [competitor-library]

**[legal-screening-agent]** — Legal Screening Agent
- Capability: Scans content against legal guidelines and regulatory databases to flag compliance risks before human legal review
- Autonomy: supervised
- Tools: Regulatory term scanner, Claims substantiation checker, Disclosure template matcher, IP risk flagger
- Performs: [legal-review]
- Uses: [legal-guidelines], [approval-matrix]

**[localization-agent]** — Localization Agent
- Capability: Translates and culturally adapts content across markets while preserving brand voice and complying with local regulations
- Autonomy: supervised
- Tools: Translation engine, Cultural sensitivity checker, Local compliance validator, Brand voice adapter
- Performs: [localize-content]
- Uses: [localization-guides], [legal-guidelines], [brand-guide]

**[repurposing-agent]** — Repurposing Agent
- Capability: Generates multi-format derivative content and A/B test variants from a single approved asset while maintaining brand and message consistency
- Autonomy: supervised
- Tools: Format adapter, Headline generator, CTA optimizer, Channel-specific formatter
- Performs: [ab-variant-creation], [content-repurposing], [paid-creative-production], [sales-enablement]
- Uses: [brand-guide], [channel-benchmarks], [content-strategy], [sales-feedback-log]

**[accessibility-agent]** — Accessibility Agent
- Capability: Evaluates content and visual assets for accessibility compliance and inclusive language, generating remediation recommendations
- Autonomy: autonomous
- Tools: WCAG scanner, Alt-text generator, Readability analyzer, Inclusive language checker
- Performs: [accessibility-check]
- Uses: [accessibility-standards]

**[personalization-agent]** — Personalization Agent
- Capability: Maps content variants to customer segments using behavioral signals and personalization logic, then assembles the delivered experience per segment in real time
- Autonomy: supervised
- Tools: Segment matcher, Variant selector, Coverage analyzer, Frequency cap checker, Consent validator
- Performs: [segment-mapping], [dynamic-assembly], [channel-orchestration]
- Uses: [cdp-profiles], [personalization-rules], [channel-benchmarks], [orchestration-rules]

**[privacy-agent]** — Privacy Compliance Agent
- Capability: Automatically validates consent status for targeted segments and flags privacy violations before content delivery
- Autonomy: autonomous
- Tools: Consent validator, Jurisdiction mapper, Suppression enforcer, Privacy audit logger
- Performs: [consent-check]
- Uses: [cdp-profiles], [privacy-regulations]

---

### 7d. Inputs (24 nodes)

#### Reference Documents (inputType: "reference")

| ID | Label | Description | Source | Refresh |
|----|-------|-------------|--------|---------|
| [brand-guide] | Brand Voice Guide | Rules for tone, style, terminology, and messaging across all content | Brand team — internal documentation | Quarterly |
| [content-strategy] | Content Strategy | Editorial calendar, topic pillars, audience priorities, and channel mix | Content Director — strategic planning | Monthly |
| [audience-personas] | Audience Personas | Detailed profiles of target audience segments with needs, behaviors, and preferences | Product Marketing — customer research | Quarterly |
| [legal-guidelines] | Legal Guidelines | Regulatory compliance policies, disclosure requirements, IP guidelines, and claims substantiation rules | Legal team — compliance documentation | Quarterly |
| [content-taxonomy] | Content Taxonomy | Hierarchical tagging schema covering content types, topics, audiences, funnel stages, and lifecycle states | Content Ops — taxonomy governance | Monthly |
| [approval-matrix] | Approval Matrix | Routing rules that define who approves what based on content type, sensitivity, market, and budget | Marketing Ops — governance framework | Quarterly |
| [accessibility-standards] | Accessibility Standards | WCAG 2.1 AA guidelines, inclusive language reference, alt-text requirements, and accessible design patterns | Accessibility team — compliance documentation | Semi-annual |
| [localization-guides] | Localization Style Guides | Market-specific style guides covering translation preferences, cultural taboos, local regulatory nuances | Localization team — regional marketing leads | Quarterly |
| [personalization-rules] | Personalization Rules | Decisioning logic that maps content variants to audience segments, including suppression rules and frequency caps | Growth team — personalization strategy | Monthly |
| [orchestration-rules] | Orchestration Rules | Cross-channel sequencing logic including channel priority order, timing offsets, trigger conditions | Marketing Ops — channel strategy | Monthly |
| [scoring-matrix] | Content Scoring Matrix | Weighted scoring framework for content requests incorporating strategic alignment, audience demand, competitive urgency | Content Director — governance framework | Quarterly |
| [media-plan] | Media Plan | Channel-level media buy strategy including platform targeting parameters, bid strategies, flight dates | Media team — planning platform | Weekly |
| [privacy-regulations] | Privacy Regulations | Current consent requirements, data processing rules, and opt-out handling procedures by jurisdiction | Legal/Privacy team — regulatory documentation | Quarterly |

#### Data Feeds (inputType: "data")

| ID | Label | Description | Source | Refresh |
|----|-------|-------------|--------|---------|
| [analytics-data] | Analytics Data | Traffic, engagement, conversion, and attribution data from GA4, HubSpot, and social APIs | GA4, HubSpot, Social APIs | Real-time |
| [cdp-profiles] | Customer Data Platform | Unified customer profiles including behavioral signals, segment membership, propensity scores | CDP platform (Segment, Tealium, Adobe RT-CDP) | Real-time |
| [competitor-library] | Competitor Content Library | Indexed repository of competitor content, messaging themes, channel strategies | Competitive intelligence platform, Manual curation | Weekly |
| [channel-benchmarks] | Channel Performance Benchmarks | Historical and industry benchmarks for engagement rates, CTR, conversion, cost-per-action | Analytics team, Industry benchmark reports | Monthly |
| [budget-allocation] | Budget Allocation | Campaign and channel-level budget constraints, spend pacing rules, and ROI thresholds | Finance team — marketing budget model | Monthly |
| [sales-feedback-log] | Sales Feedback Log | Structured feedback from sales teams on content effectiveness, objection patterns, win/loss themes | CRM integration — sales team feedback | Weekly |
| [influencer-database] | Influencer Database | Vetted influencer and creator profiles with audience demographics, brand affinity scores, performance data | Partnerships team — influencer management platform | Weekly |

#### Tools & Platforms (inputType: "tool")

| ID | Label | Description | Source | Refresh |
|----|-------|-------------|--------|---------|
| [seo-tools] | SEO Tools | Keyword data, SERP analysis, backlink profiles, and technical audit tools | SEMrush, Ahrefs, Google Search Console | Daily |
| [asset-library] | Asset Library (DAM) | Digital asset management system containing approved images, templates, brand elements, video clips | Creative team — DAM platform | Real-time |

---

## 8. All Links — Complete Relationship Map

### flows-to (Work Sequence)

Main spine:
- campaign-planning → journey-mapping
- campaign-planning → receive-request
- journey-mapping → receive-request
- receive-request → content-scoring
- receive-request → social-listening
- content-scoring → research-insights
- research-insights → write-brief
- write-brief → brief-approval
- brief-approval → draft-content
- draft-content → visual-asset-creation
- draft-content → seo-optimization
- visual-asset-creation → quality-check
- seo-optimization → quality-check
- quality-check → brand-compliance
- brand-compliance → brand-review
- brand-review → legal-review
- legal-review → legal-compliance-gate
- legal-compliance-gate → final-edit
- final-edit → accessibility-check
- final-edit → stakeholder-signoff
- final-edit → ab-variant-creation
- final-edit → paid-creative-production
- final-edit → sales-enablement
- accessibility-check → stakeholder-signoff
- stakeholder-signoff → localize-content
- stakeholder-signoff → schedule-publish
- localize-content → localization-quality-gate
- localization-quality-gate → schedule-publish
- schedule-publish → distribute
- distribute → track-performance
- distribute → content-repurposing
- distribute → sentiment-monitoring
- content-repurposing → track-performance
- track-performance → generate-report
- generate-report → attribution-modeling
- generate-report → performance-review
- attribution-modeling → executive-reporting
- attribution-modeling → performance-review
- executive-reporting → campaign-planning (MAJOR FEEDBACK LOOP)
- performance-review → optimize
- performance-review → archive-tag
- optimize → content-repurposing
- optimize → competitive-response
- optimize → receive-request
- archive-tag → content-governance
- content-governance → governance-gate

Side branches:
- social-listening → research-insights
- social-listening → competitive-response
- competitive-response → draft-content
- ab-variant-creation → schedule-publish
- ab-variant-creation → segment-mapping
- paid-creative-production → segment-mapping
- sales-enablement → segment-mapping
- segment-mapping → personalization-qa
- personalization-qa → consent-check
- personalization-qa → dynamic-assembly
- consent-check → dynamic-assembly
- dynamic-assembly → channel-orchestration
- dynamic-assembly → schedule-publish
- channel-orchestration → schedule-publish
- sentiment-monitoring → track-performance
- sentiment-monitoring → competitive-response
- campaign-planning → influencer-brief
- influencer-brief → ugc-moderation
- ugc-moderation → brand-review

### performs (Agent → Step)

- research-agent → research-insights
- research-agent → content-scoring
- research-agent → competitive-response
- writer-agent → write-brief
- writer-agent → draft-content
- writer-agent → brand-compliance
- writer-agent → ugc-moderation
- seo-agent → seo-optimization
- performance-agent → track-performance
- performance-agent → generate-report
- performance-agent → attribution-modeling
- performance-agent → executive-reporting
- social-listening-agent → social-listening
- social-listening-agent → sentiment-monitoring
- legal-screening-agent → legal-review
- localization-agent → localize-content
- repurposing-agent → ab-variant-creation
- repurposing-agent → content-repurposing
- repurposing-agent → paid-creative-production
- repurposing-agent → sales-enablement
- accessibility-agent → accessibility-check
- personalization-agent → segment-mapping
- personalization-agent → dynamic-assembly
- personalization-agent → channel-orchestration
- privacy-agent → consent-check

### reviews (Gate → Step)

- brief-approval → write-brief
- quality-check → seo-optimization
- brand-review → brand-compliance
- stakeholder-signoff → final-edit
- performance-review → generate-report
- legal-compliance-gate → legal-review
- localization-quality-gate → localize-content
- personalization-qa → segment-mapping
- governance-gate → content-governance

### returns-to (Revision Loops)

- brief-approval → write-brief
- quality-check → draft-content
- brand-review → brand-compliance
- stakeholder-signoff → final-edit
- performance-review → optimize
- legal-compliance-gate → brand-compliance
- localization-quality-gate → localize-content
- personalization-qa → segment-mapping
- governance-gate → receive-request
- governance-gate → archive-tag

### escalates-to (Escalation Paths)

- brand-review → stakeholder-signoff
- quality-check → brand-review
- performance-review → receive-request
- legal-compliance-gate → stakeholder-signoff
- localization-quality-gate → legal-compliance-gate
- personalization-qa → stakeholder-signoff
- governance-gate → stakeholder-signoff

### uses (Step/Agent → Input)

This is the most numerous link type. Every "uses" link connects a step or agent to a reference document, data feed, or tool. See individual node entries in Section 7 for the complete list.

Key patterns:
- **[brand-guide]** is the most connected input — used by 10+ steps and agents
- **[analytics-data]** is the second most connected — feeds research, SEO, performance, and monitoring
- **[cdp-profiles]** connects the personalization and measurement layers
- **[content-strategy]** grounds every strategic decision
- **[channel-benchmarks]** informs all distribution and optimization decisions

---

## 9. Step Narratives (Deep Storytelling)

Each of the 31 main workflow steps has a narrative entry with a headline, lede, and 2-4 storytelling blocks. Block types are:

| Block Type | Purpose |
|------------|---------|
| `narrative` | Descriptive explanation of what happens and why |
| `scenario` | "Picture this..." — a concrete example |
| `tension` | The problem if this step is skipped or done poorly |
| `ai-handoff` | How AI and human divide the work at this step |
| `metric` | A data point about impact or improvement |
| `before-after` | Comparison showing how the step changes things |
| `decision-tree` | Gate decision options and criteria |
| `domino-effect` | Cascading consequences of failure |
| `tip` | Best practice advice |
| `quote` | Attributed perspective from a role |

### Step 1: campaign-planning
**Headline:** Where Revenue Targets Meet Content Strategy
**Lede:** Every content operation begins here — translating business objectives into a campaign architecture with defined audiences, channels, budgets, and KPIs.
**Primary role:** campaign-manager

- **[scenario]** Picture this: Q3 pipeline is 20% below target. The CMO needs a demand-gen campaign in four weeks. Without a structured planning step, the team scrambles — random assets, no journey logic, budget spread thin. With it, every downstream node inherits clear objectives.
- **[metric]** Teams with documented campaign plans produce 3x more pipeline-attributed content than those running ad hoc requests.
- **[tip]** Define your primary KPI before choosing channels. The channel mix should serve the metric, not the other way around.

### Step 2: journey-mapping
**Headline:** Mapping Content to the Buyer's Path
**Lede:** Content that ignores journey stage talks to everyone and persuades no one. This step maps each asset to awareness, consideration, decision, retention, or advocacy.
**Primary role:** campaign-manager

- **[narrative]** Journey mapping connects CDP lifecycle data with your content taxonomy. The output is a coverage matrix showing where you have strong content, where gaps exist, and which journey stages are over-served with redundant assets.
- **[before-after]** Before: A blog post is published and promoted identically to cold prospects and existing customers. | After: The same topic spawns three assets — a thought-leadership piece for awareness, a comparison guide for consideration, and a case study for decision.

### Step 3: receive-request
**Headline:** The Front Door of the Content Pipeline
**Lede:** Every piece of content starts as a request. This step captures who wants it, why, for whom, and by when — preventing the chaos of undocumented asks.
**Primary role:** content-director

- **[tension]** Without a structured intake, requests arrive via Slack, email, hallway conversations, and shared docs — each with different levels of detail. The production team becomes a translation layer, spending more time clarifying scope than creating content.
- **[ai-handoff]** AI pre-fills request fields from historical patterns and similar past briefs. The human reviews and adjusts — turning a 30-minute scoping call into a 5-minute confirmation.

### Step 4: content-scoring
**Headline:** Not All Requests Deserve Resources
**Lede:** Content scoring ranks every incoming request against strategic priority, audience demand, resource cost, and expected ROI — triaging the production queue before work begins.
**Primary role:** content-director

- **[scenario]** Picture this: Twelve requests land in the same sprint. Three are strategic priorities, four are "nice to have," and five are repeats of content that already exists. Without scoring, the loudest stakeholder wins. With it, data decides.
- **[domino-effect]** Skip scoring and low-impact content consumes the same resources as high-impact content. The result: your best writers spend cycles on a partner one-pager while a revenue-critical product launch brief waits in the queue.
- **[metric]** Organizations using content scoring report 40% fewer "wasted" assets — content produced but never activated or measured.

### Step 5: research-insights
**Headline:** Grounding Every Brief in Evidence
**Lede:** Research turns assumptions into data. The Research Agent synthesizes audience signals, competitive intelligence, and trending topics into brief-ready insights.
**Primary role:** content-strategist

- **[ai-handoff]** The AI scans social listening feeds, SEO keyword trends, and competitor content in minutes. The human strategist interprets what the data means for positioning — which angle is differentiated, not just which keyword has volume.
- **[quote]** "Every brief that skips research is a bet placed without looking at the odds." — Content Strategist perspective

### Step 6: write-brief
**Headline:** The Blueprint That Governs Everything Downstream
**Lede:** A brief is not paperwork — it is the single document that aligns writers, designers, reviewers, and agents on what "done" looks like.
**Primary role:** content-director

- **[narrative]** The brief captures objectives, target audience, key messages, format, distribution channels, and success metrics. Every downstream node — from drafting to performance review — references this document. A vague brief creates revision cycles. A sharp brief creates velocity.
- **[tension]** The most expensive content failures trace back to briefs, not drafts. A well-written draft against a misaligned brief is still a failure — it just takes longer to discover.
- **[tip]** Include a "this piece is NOT about" section in every brief. Defining scope exclusions prevents the most common cause of revision: stakeholders expecting content the brief never promised.

### Step 7: brief-approval
**Headline:** The Highest-Leverage Decision in the System
**Lede:** Approving a brief commits the entire pipeline to an objective. This gate exists because changing direction after drafting costs 5x more than refining the brief.
**Primary role:** content-director

- **[decision-tree]** Approve: Strategy score above 80%, required fields complete, audience clearly defined, and success metrics are measurable. | Revise: Missing audience specificity, unclear differentiation from existing content, or KPIs that cannot be tracked with current tooling.
- **[before-after]** Before: Briefs are approved in hallway conversations. Writers discover misalignment at the draft stage. Average revision cycles: 3.2 per piece. | After: Structured brief approval catches 80% of alignment issues before a single word is written. Revision cycles drop to 1.1.

### Step 8: draft-content
**Headline:** Where the Blank Page Becomes a First Draft
**Lede:** The Content Writer agent transforms an approved brief into a structured first draft — following brand voice, hitting key messages, and maintaining the narrative arc the brief defined.
**Primary role:** creative-director

- **[ai-handoff]** The AI generates the initial draft from the brief, brand guide, and audience persona. The human editor will later refine what no algorithm reliably produces: narrative judgment, emotional nuance, and whether the piece says something genuinely worth reading.
- **[scenario]** Picture this: The brief calls for a technical explainer targeting engineering leaders. The agent drafts 1,200 words in 90 seconds, pulling from the brand voice guide and research insights. Without the agent, a writer spends two hours on the same draft. The quality difference? Marginal for technical content. The time savings? Transformative for throughput.

### Step 9: visual-asset-creation
**Headline:** Design That Runs Parallel, Not Sequential
**Lede:** Visual assets are created alongside the draft — not bolted on at the end. This parallel workflow means imagery is ready when copy is ready.
**Primary role:** creative-director

- **[narrative]** The Creative Director commissions hero images, infographics, social graphics, and video thumbnails based on the content brief. Each asset is designed for its target channel: dimensions, accessibility requirements, and brand visual language are baked in from the start.
- **[tension]** When visual creation is sequential — waiting until after the draft is approved — it becomes the bottleneck. Last-minute design requests produce generic stock-photo solutions instead of purposeful visual storytelling.
- **[quote]** "The difference between visually compliant and visually compelling is the difference between content people scroll past and content they stop for." — Creative Director perspective

### Step 10: seo-optimization
**Headline:** Search Visibility Built In, Not Bolted On
**Lede:** The SEO Optimizer agent handles keywords, meta descriptions, heading structure, and internal linking — ensuring the content is discoverable without sacrificing readability.
**Primary role:** editor

- **[metric]** Content optimized before publication ranks 68% faster than content retrofitted with SEO after launch. The first 48 hours of indexing establish signals that are expensive to overcome later.
- **[ai-handoff]** The AI handles the mechanical: keyword density, meta tag generation, schema markup, and internal link suggestions. The human ensures that optimization serves the reader — no keyword stuffing, no clickbait headings, no sacrificing narrative flow for search score.

### Step 11: quality-check
**Headline:** The Gate Where Technical Meets Editorial
**Lede:** An automated quality gate checks readability, factual accuracy, and SEO score. When all thresholds pass, the content flows through automatically. When they don't, a human editor steps in.
**Primary role:** editor

- **[decision-tree]** Auto-pass: Readability score above 70, SEO score above 85, zero factual flags. Content proceeds to brand compliance without human review. | Manual review: Any threshold missed triggers editor review. The most common failures: readability below threshold (jargon-heavy drafts) and factual flags (unsubstantiated claims).
- **[domino-effect]** A quality failure caught here costs one revision cycle. The same failure caught at stakeholder sign-off costs three cycles plus a trust deficit with the approver — they will scrutinize the next ten pieces more closely.

### Step 12: brand-compliance
**Headline:** Protecting the Brand Voice at Scale
**Lede:** The Content Writer agent scans the draft against brand guidelines — tone, terminology, messaging consistency, and visual identity markers — flagging violations before human review.
**Primary role:** brand-manager

- **[scenario]** Picture this: An agent-drafted blog post uses "cutting-edge" three times — a term the brand guide explicitly bans for being vague. Without automated compliance scanning, it reaches the Brand Manager who flags it manually. With it, the term is caught and suggested alternatives are offered before the draft leaves creation.
- **[metric]** Automated brand compliance scanning catches 92% of terminology violations and 78% of tone inconsistencies before human review, reducing Brand Manager review time by 60%.
- **[tip]** Maintain a living "banned terms" list alongside your brand guide. It is easier to check content against a prohibited list than against aspirational guidelines.

### Step 13: brand-review
**Headline:** Where Brand Judgment Cannot Be Automated
**Lede:** The Brand Manager reviews content that passed automated scanning but requires human judgment — cultural context, competitive positioning nuance, and brand evolution decisions.
**Primary role:** brand-manager

- **[tension]** Automated compliance catches rule violations. But brand is more than rules — it is how the audience feels about you. A piece can be 100% compliant and still feel off-brand because the cultural moment changed, a competitor shifted positioning, or the audience matured.
- **[before-after]** Before: The Brand Manager reviews every piece of content, spending 70% of their time on routine checks that surface no issues. | After: Automated scanning handles routine compliance. The Brand Manager only sees content that genuinely needs judgment — exception-based review instead of assembly-line review.

### Step 14: legal-review
**Headline:** The Line Between Marketing and Liability
**Lede:** Legal review screens content for regulatory compliance, IP risk, disclosure requirements, and claims substantiation — the stakes where "move fast" meets "move carefully."
**Primary role:** legal-counsel

- **[ai-handoff]** The Legal Screening Agent pre-scans for regulated terminology, unsubstantiated claims, missing disclosures, and competitor references. Legal Counsel reviews flagged items and genuine gray areas — the cases where precedent matters more than pattern matching.
- **[domino-effect]** A legal issue caught here pauses one content piece. The same issue published live triggers regulatory inquiry, PR crisis management, content takedown across all channels, and potential financial penalties. The asymmetry is extreme.
- **[scenario]** Picture this: A product comparison page implies competitor inferiority without substantiation. The Legal Screening Agent flags "market-leading" and "best-in-class" as unsubstantiated comparative claims. Legal Counsel reviews and requires either evidence or softer language. Total delay: 2 hours. Without this step? A competitor sends a cease-and-desist.

### Step 15: legal-compliance-gate
**Headline:** The Gate No Algorithm Can Override
**Lede:** Legal sign-off is the one checkpoint where human authority is absolute. No agent, no auto-pass threshold, no urgency overrides a legal hold.
**Primary role:** legal-counsel

- **[decision-tree]** Auto-pass: No flagged claims, no regulated terms detected, disclosure checklist 100% complete. Content proceeds to final edit. | Escalate: Any flagged regulatory term, unsubstantiated claim, or missing disclosure triggers Legal Counsel review. Escalation goes directly to stakeholder sign-off if risk is material.
- **[quote]** "No agent in this system has the authority to override a legal hold. That is by design, not by limitation." — Legal Counsel perspective

### Step 16: final-edit
**Headline:** The Last Human Touch Before the World Sees It
**Lede:** The Editor refines narrative flow, checks facts, ensures coherence, and polishes the draft to the standard the brand name demands. This is where taste lives.
**Primary role:** editor

- **[narrative]** Final edit is not proofreading — it is the step where a skilled editor asks: does this piece actually say something worth reading? Is the argument coherent? Does the opening earn the reader's next paragraph? Agents handle readability scores. Editors handle whether writing resonates.
- **[ai-handoff]** AI agents have already handled readability scoring, SEO optimization, and factual checking upstream. The editor focuses on what machines consistently fail at: narrative judgment, emotional resonance, and the ineffable quality that separates adequate content from memorable content.
- **[tip]** Read the piece aloud. If a sentence makes you pause to parse its structure, the reader will abandon it. The editor's job is to make every sentence earn its place.

### Step 17: accessibility-check
**Headline:** Content That Works for Everyone
**Lede:** The Accessibility Agent verifies WCAG compliance, inclusive language, alt-text coverage, and screen reader compatibility — because content that excludes audiences is content that fails.
**Primary role:** editor

- **[metric]** 15% of the global population experiences some form of disability. Content that fails accessibility standards loses that audience entirely — and increasingly faces legal exposure under ADA and European Accessibility Act requirements.
- **[before-after]** Before: Accessibility is an afterthought — alt-text is "image.png," color contrast fails, and screen readers choke on decorative elements. | After: Automated accessibility checking is a standard pipeline step. Alt-text is descriptive, contrast ratios pass WCAG AA, and every visual element has a text equivalent.

### Step 18: stakeholder-signoff
**Headline:** The Final Gate Before Content Goes Live
**Lede:** The VP Marketing or client gives final approval — checking strategic alignment, brand positioning, and whether this content represents the organization the way leadership intends.
**Primary role:** vp-marketing

- **[tension]** Stakeholder time is the scarcest resource in the pipeline. Every gate upstream exists to filter content so that only decisions requiring executive judgment reach this point. When upstream gates work, this is a 5-minute review. When they fail, this becomes a bottleneck that delays entire campaigns.
- **[decision-tree]** Auto-pass: All upstream gates passed, content sensitivity score below threshold, no legal flags. Content proceeds to publication without executive review. | Manual review: Content flagged as high-sensitivity, high-visibility, or involving new market positioning. The stakeholder reviews for strategic alignment — not editorial quality, which was settled upstream.
- **[tip]** If a stakeholder is consistently requesting editorial-level changes at this gate, the upstream quality and brand gates need recalibration. This gate is for strategy, not grammar.

### Step 19: localize-content
**Headline:** Same Message, Different Markets
**Lede:** Localization adapts approved content for target markets — translation, cultural nuance, regional regulatory differences, and local visual standards. It is adaptation, not translation.
**Primary role:** localization-manager

- **[scenario]** Picture this: A US-centric case study references baseball metaphors and dollar-denominated ROI figures. The Localization Agent adapts metaphors to locally resonant equivalents, converts currency, and flags that the regulatory disclosure valid in the US does not satisfy EU requirements. The Localization Manager reviews the cultural judgment calls.
- **[ai-handoff]** The AI handles mechanical translation, format adaptation, and regulatory checklist matching. The human reviews cultural subtleties — humor that does not translate, idioms that carry unintended meaning, and visual elements that require cultural sensitivity. This exception set is larger than most functions because cultural context is inherently ambiguous.

### Step 20: localization-quality-gate
**Headline:** Quality Control Across Every Market
**Lede:** The Localization Manager validates translation accuracy, cultural appropriateness, and local regulatory compliance before localized content enters the publication queue.
**Primary role:** localization-manager

- **[domino-effect]** A cultural misstep in one market does not stay in one market. Social media amplifies regional failures globally. This gate can escalate to legal compliance, meaning a cultural flag in one locale can trigger legal review across all markets — preventing regional problems from becoming global crises.
- **[metric]** Translation confidence score threshold: 90%. Below that, the Localization Manager conducts manual review. Above it, content auto-passes — but cultural sensitivity flags always require human judgment regardless of confidence score.

### Step 21: schedule-publish
**Headline:** Timing Is Half the Strategy
**Lede:** Setting the publication date, configuring the CMS, and pushing content live. When content publishes matters almost as much as what it says.
**Primary role:** marketing-ops

- **[narrative]** Schedule and publish coordinates the CMS configuration, publication timing, and channel-specific launch sequences. Cross-channel orchestration rules determine whether email goes before social, whether gated content precedes ungated, and when paid amplification triggers.
- **[tip]** Never publish on Friday afternoon. Your monitoring team is weakest when problems are most likely to go unnoticed. Tuesday and Wednesday mornings consistently show the highest engagement across B2B channels.
- **[metric]** Content published during optimal channel windows sees 23% higher first-48-hour engagement than identical content published off-schedule. The content is the same — only the timing changes.

### Step 22: distribute
**Headline:** Getting Content Where Audiences Actually Are
**Lede:** Distribution pushes content across social, email, syndication, and paid channels — each with its own format, timing, and audience expectations.
**Primary role:** marketing-ops

- **[before-after]** Before: The same blog link is shared identically on LinkedIn, Twitter, email, and Slack. One format, one message, every channel. | After: Each channel gets a native-feeling format — LinkedIn gets a thought-leadership hook, email gets a personalized subject line, social gets a visual-first treatment, and syndication gets an optimized excerpt.
- **[scenario]** Picture this: A product launch campaign distributes across six channels in a coordinated sequence: analyst-targeted email at 7 AM, LinkedIn thought leadership at 9 AM, blog publication at 10 AM, social promotion at noon, paid amplification starting at 2 PM, and sales enablement alert at 3 PM. Each channel builds on the previous one.

### Step 23: track-performance
**Headline:** The Feedback Loop That Makes the System Learn
**Lede:** Real-time performance monitoring tracks engagement, traffic, conversions, and social signals — turning every published piece into data that improves the next one.
**Primary role:** analytics-lead

- **[ai-handoff]** The Performance Analyst agent monitors metrics continuously and flags underperformers against defined thresholds. The human Analytics Lead interprets what the data means for strategy — why something underperformed matters more than the fact that it did.
- **[tension]** Without real-time tracking, you discover content failures in the monthly report — weeks after you could have acted. By then, the campaign window has closed and the budget is spent. Performance tracking exists to compress the time between signal and response.

### Step 24: generate-report
**Headline:** Data Becomes Decisions
**Lede:** The Performance Analyst agent compiles raw metrics into an actionable report — not just what happened, but what to do about it.
**Primary role:** analytics-lead

- **[narrative]** Report generation transforms continuous tracking data into structured recommendations. The output is not a dashboard — it is a prioritized action list: which content to boost, which to revise, which channels to reallocate budget toward, and which experiments to run next.
- **[metric]** Teams using AI-generated performance reports make optimization decisions 4x faster than teams relying on manual analysis. The speed advantage compounds — faster decisions mean more iteration cycles within the same campaign window.
- **[quote]** "A report that tells you what happened is journalism. A report that tells you what to do next is strategy." — Analytics Lead perspective

### Step 25: attribution-modeling
**Headline:** Tracing Revenue Back to Content
**Lede:** Multi-touch attribution models calculate content ROI by channel and segment, revealing which content actually drives pipeline — not just which content gets clicks.
**Primary role:** analytics-lead

- **[before-after]** Before: Attribution is last-touch — the final asset before conversion gets all the credit. Top-of-funnel content looks like a cost center. | After: Multi-touch attribution reveals that awareness-stage content influenced 60% of closed deals. The blog post that "never converted anyone" actually initiated the buying journey for your largest accounts.
- **[tension]** Attribution modeling is politically charged. It redistributes credit — and therefore budget — across the content portfolio. Teams that own high-attribution content gain resources. Teams that own low-attribution content face hard questions. The model must be defensible because it will be challenged.

### Step 26: executive-reporting
**Headline:** Speaking the Language of the C-Suite
**Lede:** Executive reporting synthesizes performance data, attribution results, and budget utilization into a dashboard designed for leadership — strategic recommendations, not operational details.
**Primary role:** analytics-lead

- **[scenario]** Picture this: The CMO has 10 minutes before a board meeting. The executive report shows three things: content-sourced pipeline is up 18%, cost-per-lead dropped 22% from the previous quarter, and two campaigns are underperforming their ROI targets with recommended reallocation. No jargon, no vanity metrics, no 40-slide deck.
- **[tip]** Lead with the number the executive cares about most — usually pipeline contribution or cost efficiency. Bury engagement metrics in the appendix. Executives fund outcomes, not impressions.
- **[domino-effect]** Executive reports that reach the CMO feed directly back into campaign planning — closing the largest feedback loop in the system. When this loop is tight, the pipeline becomes a learning system. When it is slow, you are always optimizing for last quarter's reality.

### Step 27: performance-review
**Headline:** The Gate That Closes the Loop
**Lede:** Performance review evaluates content against its original KPIs and decides the next action: optimize, iterate with a new brief, or archive. This is where the pipeline becomes a cycle.
**Primary role:** analytics-lead

- **[decision-tree]** Optimize: Content meets 60-80% of KPI targets. Tweak headlines, CTAs, or distribution mix. The asset is fundamentally sound — it needs refinement, not reinvention. | Iterate: Content misses KPI targets by a wide margin, but the topic has strategic value. Send back to brief stage with new data. Archive: Content has run its course — performance is declining and the topic is no longer strategic.
- **[narrative]** This gate can send content all the way back to a new brief — restarting the entire pipeline with updated data. That feedback loop is what makes the system learn. Without it, the pipeline is a conveyor belt: content goes in one end and comes out the other with no memory of what worked.

### Step 28: optimize
**Headline:** Making Good Content Better
**Lede:** Optimization updates headlines, CTAs, distribution mix, or repurposes content based on performance data. It is the most cost-effective step in the pipeline — improving existing assets costs a fraction of creating new ones.
**Primary role:** marketing-ops

- **[before-after]** Before: Content is "one and done" — published, promoted once, and forgotten. The team moves to the next brief. | After: Top-performing content gets optimized iteratively — updated headlines, refreshed CTAs, expanded distribution. A single optimized piece can outperform three new pieces in pipeline contribution.
- **[ai-handoff]** AI agents test headline variants, CTA alternatives, and distribution timing automatically. The human decides when to iterate versus start over — a system-level judgment call that requires understanding whether the problem is execution or strategy.
- **[metric]** Optimized content generates 2.5x the ROI of net-new content on a per-dollar basis. The research, brief, and approval work is already done. Optimization captures residual value at marginal cost.

### Step 29: archive-tag
**Headline:** Building the Content Library That Compounds
**Lede:** Archive and tag classifies content into the taxonomy for future discovery, reuse, and governance — turning individual assets into a searchable, composable knowledge base.
**Primary role:** context-engineer

- **[narrative]** Archiving is not retirement — it is curation. Properly tagged content becomes discoverable for future campaigns, repurposing, and governance reporting. The content taxonomy transforms a folder of files into a structured library where every asset is findable by topic, audience, journey stage, and performance tier.
- **[tension]** Most content teams create assets faster than they organize them. Within two years, the content library becomes a graveyard — thousands of assets, no one knows what exists, and new content is created because finding existing content takes longer than starting from scratch.

### Step 30: content-governance
**Headline:** Keeping Live Content Honest
**Lede:** Governance reviews live content for accuracy decay, regulatory currency, brand alignment drift, and performance decline — because content does not stay correct forever.
**Primary role:** context-engineer

- **[scenario]** Picture this: A "2024 compliance guide" is still live in 2025 with outdated regulatory references. A product comparison page references a competitor product that was discontinued. A case study quotes a client who is now in litigation with your company. Governance catches these before customers or regulators do.
- **[domino-effect]** Outdated content erodes trust silently. Prospects who encounter inaccurate content do not complain — they leave. The damage is invisible in analytics because you cannot measure the visits that never converted due to stale information.
- **[tip]** Set automated governance triggers: content older than 90 days gets flagged for review, content with declining traffic gets reviewed for relevance, and any regulatory change in a content category triggers immediate review of all assets in that category.

### Step 31: governance-gate
**Headline:** The System That Maintains Itself
**Lede:** The governance gate validates that all live content remains current, compliant, and brand-aligned — triggering refresh, retirement, or re-review cycles as needed.
**Primary role:** context-engineer

- **[decision-tree]** Auto-pass: Content is less than 90 days old, no regulatory changes detected in its category, and performance remains above decay threshold. | Flag for review: Content exceeds age threshold, regulatory landscape has shifted, or performance has declined below the minimum. Triggers re-entry into the pipeline at the appropriate stage — sometimes a quick refresh, sometimes a full re-brief.
- **[quote]** "This role does not exist in most organizations today. It emerges when you think about AI as a system that needs structured context to reason well." — Context Engineer perspective
- **[narrative]** The governance gate is what makes the content operation self-maintaining. Without it, the pipeline produces new content while old content quietly decays. With it, every asset in the library is continuously validated — and the system gets smarter with each governance cycle because it accumulates knowledge about what ages well and what does not.

---

## 10. Role Definitions (16 Roles)

Each role maps to specific nodes in the graph and carries a transformation narrative: what the role does today, how it changes with AI, what agents support it, and the key strategic insight.

### content-director — Content Director
- **Owns:** [receive-request], [write-brief], [content-governance], [content-scoring]
- **Reviews:** [brief-approval], [governance-gate]
- **Works with agents:** [research-agent], [writer-agent]
- **Depends on inputs:** [content-strategy], [audience-personas], [scoring-matrix]
- **Today:** You define content briefs, approve them, and hand off to creation. Your time goes into scoping requests and ensuring every piece traces back to a business objective.
- **Future:** You shift from writing briefs to approving AI-generated ones — evaluating strategic fit and audience alignment at a pace that was previously impossible. Your judgment on what to greenlight becomes the highest-leverage decision in the system.
- **Team support:** The Research Agent feeds you audience data before you ask. The Content Writer drafts briefs from your templates. You review, refine, and approve — everything downstream inherits the quality of that decision.
- **Key insight:** Your brief-approval checkpoint is where strategic judgment matters most. Organizations that try to automate this gate discover that strategic context and competitive intuition cannot be reduced to a scoring rubric.

### brand-manager — Brand Manager
- **Owns:** [brand-compliance]
- **Reviews:** [brand-review]
- **Works with agents:** [writer-agent]
- **Depends on inputs:** [brand-guide]
- **Today:** You check every piece of content against brand guidelines — tone, terminology, visual identity, messaging consistency. Much of your time goes to routine compliance reviews that rarely surface issues.
- **Future:** AI handles the compliance scan automatically. You only see content that fails the automated threshold — your reviews become exception-based, not routine.
- **Team support:** The Content Writer agent checks brand voice during drafting using your brand guide. By the time content reaches you, obvious violations are caught. You focus on nuanced calls requiring cultural awareness.
- **Key insight:** Your escalation to stakeholder sign-off is the safety valve. Brand risk is reputational risk, and no organization will delegate reputational judgment to an algorithm. Your role contracts in volume but expands in consequence.

### editor — Editor / Content Lead
- **Owns:** [final-edit]
- **Reviews:** [quality-check]
- **Works with agents:** [writer-agent], [seo-agent]
- **Depends on inputs:** [brand-guide], [seo-tools]
- **Today:** You are the last human to touch content before stakeholders. You refine narrative flow, check facts, ensure coherence, and polish the final draft.
- **Future:** AI agents handle readability scoring, SEO optimization, and factual checking. You focus on what machines consistently fail at — narrative judgment, emotional resonance, and whether a piece actually says something worth reading.
- **Key insight:** The irreducible human value here is taste — the ability to distinguish between content that is technically correct and content that is genuinely good.

### vp-marketing — VP Marketing / Stakeholder
- **Owns:** [schedule-publish], [distribute]
- **Reviews:** [stakeholder-signoff]
- **Today:** You approve high-visibility content and oversee the publication calendar.
- **Future:** Most content flows through without your sign-off. You shift from approving volume to governing the system itself.
- **Key insight:** Your time is the scarcest resource in the pipeline. You set the parameters within which agents and humans operate, and intervene only where strategic judgment is irreplaceable.

### analytics-lead — Analytics Lead
- **Owns:** [track-performance], [generate-report], [optimize], [attribution-modeling], [executive-reporting]
- **Reviews:** [performance-review]
- **Works with agents:** [performance-agent]
- **Depends on inputs:** [analytics-data], [cdp-profiles], [budget-allocation], [channel-benchmarks]
- **Today:** You monitor content performance, generate reports, and decide what happens next.
- **Future:** The Performance Analyst agent monitors in real time. You shift from data collection to decision-making.
- **Key insight:** Your performance-review gate can send content all the way back to a new brief. That feedback loop is what makes the system learn. You are the reason this is a cycle, not a conveyor belt.

### content-strategist — Content Strategist
- **Owns:** [research-insights]
- **Works with agents:** [research-agent]
- **Depends on inputs:** [content-strategy], [audience-personas], [analytics-data]
- **Today:** You maintain the content strategy, define audience personas, and ensure every brief is grounded in data.
- **Future:** AI agents use your strategy documents as their primary input. Instead of briefing one writer, your strategy guides every agent simultaneously.
- **Key insight:** You do not own a gate, but your influence is everywhere. One well-maintained strategy document silently improves the output of eleven agents and nine gates.

### marketing-ops — Marketing Ops
- **Owns:** [schedule-publish], [distribute], [optimize], [channel-orchestration]
- **Reviews:** [performance-review]
- **Works with agents:** [performance-agent], [personalization-agent]
- **Depends on inputs:** [analytics-data], [content-strategy], [orchestration-rules], [media-plan], [channel-benchmarks]
- **Today:** You keep the machine running — managing the publication calendar, coordinating distribution, closing the loop.
- **Future:** AI agents handle real-time distribution decisions. You shift from execution to orchestration — designing the operational rules agents follow.
- **Key insight:** Your optimize step is where you decide whether to tweak existing content or restart the pipeline. That judgment requires system-level awareness.

### consumer-insights — Consumer Insights
- **Owns:** [research-insights]
- **Works with agents:** [research-agent]
- **Depends on inputs:** [audience-personas], [analytics-data], [content-strategy]
- **Today:** You are the voice of the customer inside the content pipeline.
- **Future:** AI agents synthesize audience data at scale, but they still need your frameworks.
- **Key insight:** Your audience personas are the most-referenced input in the entire graph. When they are sharp, the whole system produces relevant content. When they drift, everything drifts.

### consulting-dd — Consulting (Due Diligence)
- **Reviews:** [quality-check], [brand-review], [stakeholder-signoff]
- **Today:** You provide an independent lens, reviewing content at multiple gates.
- **Future:** AI handles routine compliance checks. Your role sharpens to high-stakes reviews.
- **Key insight:** You sit across three gates — unusual in this system. Your cross-cutting view means you see patterns specialists miss.

### legal-counsel — Legal Counsel
- **Owns:** [legal-review]
- **Reviews:** [legal-compliance-gate]
- **Works with agents:** [legal-screening-agent]
- **Depends on inputs:** [legal-guidelines], [approval-matrix]
- **Today:** You review content for legal risk before stakeholder sign-off.
- **Future:** The Legal Screening Agent pre-scans content and flags genuine risks. You shift from reviewing everything to adjudicating exceptions.
- **Key insight:** Your legal-compliance-gate can escalate directly to stakeholder sign-off, pausing publication at the highest level. No agent overrides a legal hold.

### localization-manager — Localization Manager
- **Owns:** [localize-content]
- **Reviews:** [localization-quality-gate]
- **Works with agents:** [localization-agent]
- **Depends on inputs:** [localization-guides], [legal-guidelines]
- **Today:** You manage content adaptation across markets.
- **Future:** The Localization Agent handles translation and initial cultural adaptation. You shift from translating to curating.
- **Key insight:** Your localization-quality-gate can escalate to legal-compliance, meaning a cultural flag in one market can trigger legal review across all markets.

### creative-director — Creative Director
- **Owns:** [visual-asset-creation]
- **Reviews:** [quality-check]
- **Works with agents:** [writer-agent]
- **Depends on inputs:** [brand-guide], [asset-library]
- **Today:** You own the visual layer of every content piece.
- **Future:** AI-generated imagery handles routine visual assets. You shift from producing every graphic to art-directing the system.
- **Key insight:** The human value you protect is aesthetic judgment: the difference between visually compliant and visually compelling.

### growth-lead — Growth Lead
- **Owns:** [ab-variant-creation], [content-repurposing], [segment-mapping], [paid-creative-production], [sales-enablement]
- **Reviews:** [performance-review]
- **Works with agents:** [repurposing-agent], [performance-agent], [personalization-agent]
- **Depends on inputs:** [channel-benchmarks], [analytics-data], [content-strategy], [cdp-profiles], [personalization-rules], [media-plan], [sales-feedback-log]
- **Today:** You maximize return on every content asset through A/B tests, repurposing, and distribution optimization.
- **Future:** The Repurposing Agent generates variants automatically. You shift from producing variants to designing the experimentation framework.
- **Key insight:** Volume without strategy is noise. Your role ensures multiplication is strategic — each variant optimized for a specific channel, audience, and intent.

### privacy-officer — Privacy Officer
- **Owns:** [consent-check]
- **Reviews:** [personalization-qa]
- **Works with agents:** [privacy-agent], [personalization-agent]
- **Depends on inputs:** [privacy-regulations], [cdp-profiles]
- **Today:** You validate consent signals and ensure every segment activation complies with applicable privacy laws.
- **Future:** The Privacy Compliance Agent handles routine consent validation autonomously — one of the few agents with autonomous authority because privacy rules are binary.
- **Key insight:** Your role is the reason this system can personalize at scale without regulatory exposure. Privacy is not a constraint on personalization — it is the prerequisite.

### campaign-manager — Campaign Manager
- **Owns:** [campaign-planning], [journey-mapping]
- **Works with agents:** [performance-agent]
- **Depends on inputs:** [budget-allocation], [cdp-profiles], [channel-benchmarks], [content-strategy], [influencer-database]
- **Today:** You own the strategic layer above the content pipeline — campaign objectives, budget allocation, journey mapping.
- **Future:** AI agents surface campaign performance and attribution data in real time. You shift from manual budget tracking to real-time optimization.
- **Key insight:** You close the largest feedback loop in the system. Executive reporting flows back into campaign planning, which feeds everything downstream.

### partnerships-lead — Partnerships & Influencer Lead
- **Owns:** [influencer-brief], [ugc-moderation]
- **Reviews:** [brand-review]
- **Works with agents:** [writer-agent]
- **Depends on inputs:** [influencer-database], [brand-guide], [legal-guidelines]
- **Today:** You manage creator relationships, negotiate collaborations, and ensure influencer content meets brand and legal standards.
- **Future:** AI agents handle moderation screening and compliance checks at scale. You shift from reviewing every submission to designing the creator strategy.
- **Key insight:** Creator content flows through the same brand-review gate as internal content — same quality standard, no separate process.

### context-engineer — Context Engineer
- **Owns:** [content-governance], [archive-tag]
- **Reviews:** [governance-gate]
- **Works with agents:** [research-agent], [personalization-agent], [legal-screening-agent]
- **Depends on inputs:** [content-taxonomy], [scoring-matrix], [orchestration-rules], [personalization-rules], [approval-matrix]
- **Today:** You maintain the knowledge infrastructure every agent depends on — content taxonomy, scoring matrix, orchestration rules, and semantic relationships between inputs.
- **Future:** Your role is the most leveraged in the pipeline. You design the reasoning layer that makes agents effective. When agent performance drifts, you diagnose whether the problem is the agent or the context it was given.
- **Key insight:** This role does not exist in most organizations today. It emerges when you think about AI as a system that needs structured context to reason well. The knowledge graph, taxonomy, and orchestration rules are tribal knowledge made explicit, maintainable, and scalable. Every improvement silently improves every agent and every gate simultaneously.

---

## 11. Presentation Walkthrough (18 Slides)

The presentation is a guided narrative delivered through 18 slides. Each slide controls the 3D camera position, which nodes are visible, and which link types are highlighted. The slides build a progressive argument from simple pipeline → real complexity → strategic infrastructure → human elevation → investment thesis.

### Slide 1: "The Content Production Lifecycle" (act1-title)
- Narration: (none — title card)
- Graph state: linear | Action: show-title-slide

### Slide 2: "The Pipeline Everyone Draws" (act1-pipeline)
- Narration: Every marketing team draws the same pipeline: Strategy, Create, Review, Publish, Measure, Optimize. Six stages, left to right. Clean columns. This is the version that lives in your process documentation and gets presented to leadership when someone asks how content gets made.
- Graph state: linear | Action: show-linear-pipeline

### Slide 3: "The Teams Behind Each Phase" (act1-teams)
- Narration: Zoom into each phase and you find people. The Content Director owns the brief. Editors and brand managers own review. Marketing Ops runs distribution. Analytics closes the loop. Each phase has a team, and each team has a process. This is the organizational view — who does what, in what order.
- Graph state: linear | Shows: steps | Highlights: flows-to

### Slide 4: "The Work Inside Each Phase" (act1-sub-steps)
- Narration: Each phase contains multiple steps. Strategy alone has campaign planning, journey mapping, request intake, scoring, research, social listening, and the brief itself. Create includes drafting, SEO, visual assets, A/B variants, paid creative, and sales enablement. This is the operational reality — more complex than the six-stage slide, but still a left-to-right sequence.
- Graph state: linear | Shows: steps | Highlights: flows-to

### Slide 5: "Where AI Agents Fit Today" (act2-agents-appear)
- Narration: AI agents plug into specific steps. A Research Agent handles insights. A Content Writer drafts. An SEO Optimizer polishes for search. A Performance Analyst measures results. A Legal Screening Agent pre-checks compliance. A Localization Agent adapts for markets. A Repurposing Agent creates derivatives. A Personalization Agent maps variants to segments. A Privacy Agent validates consent. Eleven agents, each mapped to specific tasks. This is where most organizations stop — bolting AI onto existing human workflows to make each step a little faster.
- Graph state: linear | Shows: steps, agents | Highlights: performs

### Slide 6: "What Agents Actually Depend On" (act2-agent-grounding)
- Narration: Every organization has information like this: brand guidelines, audience personas, content strategy documents, legal frameworks, analytics data. Most teams treat these as reference material — documents that sit in a shared drive and get consulted when someone remembers they exist. But context is not the same as information. Context is how that information is actually used within the company — who applies it, when it triggers a decision, what happens when it changes, and which systems depend on it being current. That is a fundamentally different question. It goes beyond what your team knows and into how your team actually operates. Beyond skills and into the real how.
- Graph state: linear | Shows: inputs | Highlights: uses

### Slide 7: "The Pipeline Is a Fiction" (act3-reality)
- Narration: Now watch what happens when we add the real structure. Gates create checkpoints between phases. Feedback loops send work back for revision. Escalation paths route exceptions upward. Performance data triggers re-briefs. Governance audits live content months after publication. Competitive signals create fast-track paths that bypass the normal sequence. The neat columns dissolve. This is not a pipeline — it is a graph.
- **Graph state: full-graph** (THE REVEAL) | Action: explode-to-graph

### Slide 8: "Human Judgment at Every Gate" (act3-gates)
- Narration: Nine gates control the flow. Brief Approval checks strategic alignment. Quality Check validates readability and SEO. Brand Review catches tone drift. Legal Compliance gates regulatory risk. Stakeholder Sign-off is the final authority before publication. Personalization QA validates segment coverage. Localization Quality catches cultural misfires. Performance Review decides what gets optimized. Governance Gate audits live content for decay. Each gate has auto-pass criteria and escalation triggers. When the criteria are met, work flows. When they are not, humans intervene. That is the design — not human-in-the-loop for everything, but human-at-the-gate for what matters.
- Graph state: full-graph | Shows: gates, steps | Highlights: reviews, escalates-to, returns-to

### Slide 9: "The System That Learns" (act3-feedback-loops)
- Narration: The feedback loops are what make this a system, not a conveyor belt. Performance data flows back to campaign planning through executive reporting. Governance findings trigger new content requests. Competitive signals from sentiment monitoring fast-track response briefs. Optimization can restart at content repurposing, competitive response, or a full new request — the path depends on the data. These loops mean the system improves with every cycle. Content that underperforms teaches the system what to do differently. Content that overperforms gets repurposed and amplified. The graph learns.
- Graph state: full-graph | Shows: steps, gates | Highlights: returns-to, escalates-to, flows-to

### Slide 10: "The Infrastructure That Compounds" (act4-infrastructure)
- Narration: Look at the input layer. Twenty inputs — brand guides, legal guidelines, audience personas, CDP profiles, content taxonomy, scoring matrices, orchestration rules, personalization logic, privacy regulations, channel benchmarks. This is not supporting documentation. This is a knowledge graph. Every input is connected to multiple agents and steps. Every relationship is explicit. Every dependency is traceable. This is the semantic layer that makes the entire system possible — and it is the part that most organizations never build.
- Graph state: full-graph | Shows: inputs, agents | Highlights: uses

### Slide 11: "Agents Commoditize. Infrastructure Compounds." (act4-context-thesis)
- Narration: Here is the strategic insight. The agents are interchangeable. You can swap the Content Writer for a better model next quarter. You can replace the SEO Optimizer with a different tool. Agents are execution components — valuable, but not differentiating. The knowledge graph is what compounds. Every time you refine a persona, every agent that references it gets better. Every time you update a legal guideline, every compliance check becomes more accurate. Every time you add a new orchestration rule, the distribution engine gets smarter. The infrastructure improves the entire system simultaneously. The agents improve one step at a time. That asymmetry is your competitive advantage — and it is what makes this a strategic investment, not a technology experiment.
- Graph state: full-graph | Shows: inputs, agents | Highlights: uses, performs

### Slide 12: "Structuring Context for Agentic Reasoning" (act4-structuring-context)
- Narration: This graph is not just a process diagram. It is a specification. Every node has typed attributes. Every link has a semantic relationship. Every input has a source and a refresh rate. Every gate has pass criteria and escalation triggers. This structure is what allows an agentic team to reason over the workflow — to know which inputs are stale, which gates are bottlenecked, which feedback loops are firing, and which steps need human attention. Without this structure, you have agents doing tasks. With it, you have agents understanding context. That is the difference between automation and intelligence.
- Graph state: full-graph | Action: show-structured-context

### Slide 13: "Elevating Human Work" (act5-elevation)
- Narration: This is not about making each person twenty percent faster at their current job. That is the small thinking. This is about changing what the job is. When agents handle drafting, optimization, compliance screening, translation, variant creation, and performance monitoring — what is left for humans? Strategy. Creative direction. Judgment calls at gates. Relationship decisions with creators and partners. The design of the system itself. The humans in this graph do not do less. They do different work — higher-leverage work that agents cannot replicate because it requires taste, accountability, and strategic context that cannot be reduced to a prompt.
- Graph state: full-graph | Shows: steps, gates | Highlights: reviews, escalates-to

### Slide 14: "Roles That Do Not Exist Yet" (act5-new-roles)
- Narration: Some of the most important roles in this system do not exist in most marketing organizations today. The Context Engineer maintains the knowledge graph — the taxonomy, scoring matrices, orchestration rules, and semantic relationships that make agents effective. The Privacy Officer designs the consent framework that allows personalization at scale. The Growth Lead designs experimentation strategy rather than producing variants. These roles emerge when you stop thinking about AI as individual productivity tools and start thinking about it as a system that needs architectural governance. They are to agentic marketing what data engineers were to the analytics revolution — the roles that make everything else possible.
- Graph state: full-graph | Shows: steps, gates, inputs | Highlights: uses, reviews

### Slide 15: "Your Role in the System" (act5-role-explorer)
- Narration: Every role in this graph has a today story and a future story. The today story is the work you do now. The future story is the work you will do when agents handle the production layer. Click any role to see how your responsibilities shift — not what you lose, but what you gain. The steps you own today become the judgment calls that agents cannot make. The gates you review become the quality standards that define your expertise. The inputs you maintain become the infrastructure that scales your impact.
- Graph state: full-graph | Shows: steps, gates | Action: show-role-explorer

### Slide 16: "A Strategic Asset, Not a Cost Center" (act6-strategic-asset)
- Narration: This graph changes how you think about investment. You are not buying AI tools and hoping for ROI. You are building infrastructure that compounds. Every dollar spent structuring the knowledge graph — refining personas, documenting brand voice, mapping orchestration rules, building the content taxonomy — makes every agent in the system more effective simultaneously. The marginal cost of the next piece of content approaches zero. The marginal value of the next knowledge graph update increases with every agent that uses it. That is not a linear return. That is a platform investment.
- Graph state: full-graph | Shows: inputs, agents | Highlights: uses

### Slide 17: "A Different Way of Working" (act6-different-mentality)
- Narration: The question is not whether to adopt AI. The question is whether you treat it as a collection of productivity tools or as an operating system that requires a different way of working. The productivity tools approach gives you incremental gains — each person gets a little faster. The operating system approach gives you structural advantage — the system gets smarter, the humans do higher-leverage work, and the knowledge infrastructure becomes an asset that competitors cannot easily replicate. This graph is the blueprint for the second approach. Every node, every link, every gate, every input is a design decision about how human intelligence and machine capability combine. That combination — not the agents alone, not the humans alone — is the strategic asset.
- Graph state: full-graph | Action: show-operating-model

### Slide 18: "Explore the System" (act6-explore)
- Narration: This is the complete marketing operating system. Seventy-five nodes. Eleven agents. Nine gates. Twenty reference inputs. Every step has an owner. Every gate has criteria. Every agent is grounded in structured context. Every feedback loop is explicit. Click any node to explore its connections. Filter by role to see your view. Follow the links to understand how your work connects to everyone else. This is what it means to design AI into a workflow — not bolt it on.
- Graph state: full-graph | Action: full-explore

---

## 12. Side Branches and Parallel Paths

These nodes are visible in the full graph but are not part of the main 31-step campaign walkthrough path. They represent parallel activities that branch off from and rejoin the main spine.

### Social Listening → Competitive Response Branch
- [receive-request] → [social-listening] → [competitive-response] → [draft-content]
- Also: [social-listening] → [research-insights] (feeds back to main path)
- Purpose: Real-time competitive intelligence creates fast-track content paths

### Influencer & UGC Branch
- [campaign-planning] → [influencer-brief] → [ugc-moderation] → [brand-review]
- Purpose: Creator content flows through the same quality gates as internal content

### Personalization Branch
- [final-edit] → [ab-variant-creation] → [segment-mapping] → [personalization-qa] → [consent-check] → [dynamic-assembly] → [channel-orchestration] → [schedule-publish]
- Also: [final-edit] → [paid-creative-production] → [segment-mapping]
- Also: [final-edit] → [sales-enablement] → [segment-mapping]
- Purpose: Content variants are mapped to audience segments with privacy compliance before distribution

### Content Repurposing Branch
- [distribute] → [content-repurposing] → [track-performance]
- Purpose: Published content is immediately repurposed into derivative formats

### Sentiment Monitoring Branch
- [distribute] → [sentiment-monitoring] → [track-performance]
- Also: [sentiment-monitoring] → [competitive-response]
- Purpose: Real-time audience sentiment feeds back into performance tracking and competitive intelligence

---

## 13. Feedback Loops and Escalation Paths

### Major Feedback Loops

1. **The Strategic Loop:** [executive-reporting] → [campaign-planning]
   - Performance data and attribution results feed directly back into campaign planning. This is the largest loop and what makes the system learn at the strategic level.

2. **The Optimization Loop:** [performance-review] → [optimize] → [content-repurposing] / [competitive-response] / [receive-request]
   - Underperforming content can be optimized, repurposed, or trigger entirely new content requests.

3. **The Governance Loop:** [governance-gate] → [receive-request] / [archive-tag]
   - Live content that fails governance review re-enters the pipeline for refresh or gets archived.

4. **The Competitive Loop:** [sentiment-monitoring] → [competitive-response] → [draft-content]
   - Competitive signals from monitoring create fast-track content paths that bypass normal sequencing.

### Revision Paths (returns-to)

| Gate | Returns to | Meaning |
|------|-----------|---------|
| brief-approval | write-brief | Brief needs refinement |
| quality-check | draft-content | Draft needs rewriting |
| brand-review | brand-compliance | Brand issues need fixing |
| stakeholder-signoff | final-edit | Strategic misalignment |
| legal-compliance-gate | brand-compliance | Legal issues require content changes |
| localization-quality-gate | localize-content | Translation/cultural issues |
| personalization-qa | segment-mapping | Segment coverage gaps |
| performance-review | optimize | Content needs optimization |
| governance-gate | receive-request / archive-tag | Content needs refresh or retirement |

### Escalation Paths (escalates-to)

| Gate | Escalates to | Meaning |
|------|-------------|---------|
| quality-check | brand-review | Quality issues may be brand issues |
| brand-review | stakeholder-signoff | Brand risk requires executive attention |
| legal-compliance-gate | stakeholder-signoff | Legal risk requires executive authority |
| localization-quality-gate | legal-compliance-gate | Cultural issues may be legal issues |
| personalization-qa | stakeholder-signoff | Privacy/consent issues need executive oversight |
| performance-review | receive-request | Content failure requires strategic re-evaluation |
| governance-gate | stakeholder-signoff | Governance findings need executive decision |

---

## 14. The Knowledge Graph Layer

The 24 input nodes form a knowledge graph that is the project's central strategic argument. These are not passive reference documents — they are active infrastructure that every agent and many steps depend on.

### Input Connectivity (most connected to least)

| Input | Used by (count) | Key consumers |
|-------|-----------------|---------------|
| [brand-guide] | 10+ | draft-content, brand-compliance, visual-asset-creation, content-repurposing, dynamic-assembly, content-governance, localization-agent, writer-agent, repurposing-agent, localization-agent |
| [analytics-data] | 10+ | research-insights, seo-optimization, content-scoring, track-performance, ab-variant-creation, sentiment-monitoring, optimize, research-agent, seo-agent, performance-agent, social-listening-agent |
| [cdp-profiles] | 8+ | campaign-planning, journey-mapping, segment-mapping, dynamic-assembly, consent-check, attribution-modeling, track-performance, personalization-agent, privacy-agent |
| [content-strategy] | 7+ | campaign-planning, journey-mapping, research-insights, write-brief, generate-report, executive-reporting, content-repurposing, writer-agent, repurposing-agent |
| [channel-benchmarks] | 7+ | campaign-planning, ab-variant-creation, distribute, channel-orchestration, attribution-modeling, track-performance, optimize, repurposing-agent, performance-agent, personalization-agent |
| [audience-personas] | 5+ | journey-mapping, research-insights, draft-content, social-listening, influencer-brief, research-agent, social-listening-agent |
| [legal-guidelines] | 5+ | legal-review, localize-content, ugc-moderation, content-governance, legal-screening-agent, localization-agent |
| [approval-matrix] | 4+ | receive-request, legal-review, schedule-publish, stakeholder-signoff, legal-screening-agent |
| [budget-allocation] | 5+ | campaign-planning, content-scoring, paid-creative-production, attribution-modeling, generate-report, executive-reporting |
| [competitor-library] | 4+ | social-listening, competitive-response, sentiment-monitoring, sales-enablement, research-agent, social-listening-agent |

### The Compounding Argument

The strategic insight is that improving any single input improves every consumer of that input simultaneously:

- Update [brand-guide] → writer-agent, brand-compliance, visual-asset-creation, content-repurposing, dynamic-assembly, localization-agent, and content-governance all get better
- Update [audience-personas] → research-insights, draft-content, journey-mapping, and every agent that references personas produces more relevant output
- Update [orchestration-rules] → distribute, schedule-publish, and channel-orchestration all follow smarter sequencing

This is the multiplicative return that agents alone cannot provide. Agents improve linearly (one step at a time). Infrastructure improves multiplicatively (every consumer gets better).

---

## 15. Design Decisions and Architecture

### Why 4 Node Types (Not 8)

The original graph had 8 node types: person, task, process-step, decision, agent, data-source, knowledge-artifact, external-touchpoint. This was simplified to 4 because stakeholders need to answer four questions:
1. What steps happen? → `step`
2. Where do humans check? → `gate`
3. Where does AI work? → `agent`
4. What information feeds the system? → `input`

### Why 6 Link Types (Not 11)

Simplified from: reports-to, collaborates-with, depends-on, feeds-into, informed-by, monitors, manages, produces, consumes, and variations. Down to 6 clear verbs: flows-to, performs, uses, reviews, returns-to, escalates-to.

### Language Rules

- **Verbs for steps:** "Draft Content" not "Content Drafting"
- **Plain nouns for gates:** "Brand Review" not "Brand Voice Exception Evaluation"
- **No jargon in descriptions:** "Check if content matches brand rules" not "Ensure adherence to established brand identity parameters"
- **Agent names are job titles:** "Content Writer" not "Content Generation Agent"
- **Inputs are what they are:** "Brand Guide" not "Brand Guidelines Knowledge Artifact"

### Success Criteria

A stakeholder looks at this graph and can immediately answer:
- "Where does the AI do the work?"
- "Where does a human check the work?"
- "What happens when something fails a review?"
- "What information does the AI use to do its job?"

---

*End of document. This file contains every piece of text, narrative, relationship, and structural metadata in the Agentic project. Total: 75 nodes, 150+ links, 31 step narratives, 16 role definitions, 18 presentation slides, and the complete strategic argument for why structured context — not AI agents — is the compounding competitive advantage.*
