# Complete System Narrative — Agentic Marketing Campaign Graph

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
11. [Presentation Walkthrough (6 Slides)](#11-presentation-walkthrough)
12. [Side Branches and Parallel Paths](#12-side-branches)
13. [Feedback Loops and Escalation Paths](#13-feedback-loops)
14. [The Knowledge Graph Layer](#14-knowledge-graph-layer)
15. [Design Decisions and Architecture](#15-design-decisions)

---

## 1. System Overview

This project is a **3D interactive visualization** of a complete marketing campaign operating system for enterprise marketing. It renders 75 nodes and 150+ directed links as a force-directed 3D graph using Three.js and react-force-graph-3d inside a Next.js 16 application.

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

The marketing campaign lifecycle has 6 phases. These map to the `group` field on every step and gate node.

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
| ls-plan | Plan | Define scope, research audience, and write the content brief | x: -500 |
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

## 9. Step Narratives

Each of the 31 main workflow steps has a narrative entry with a headline, one-sentence lede, and one storytelling block. Block types are:

| Block Type | Purpose |
|------------|---------|
| `narrative` | Descriptive explanation of what happens and why |
| `scenario` | A concrete example |
| `tension` | The problem if this step is skipped or done poorly |
| `ai-handoff` | How AI and human divide the work at this step |
| `metric` | A data point about impact or improvement |
| `before-after` | Comparison showing how the step changes things |
| `decision-tree` | Gate decision options and criteria |
| `domino-effect` | Cascading consequences of failure |
| `tip` | Best practice advice |
| `quote` | Attributed perspective from a role |

### STRATEGY PHASE

### Step 1: campaign-planning
**Headline:** Campaign Planning
**Lede:** Translating business objectives into a campaign architecture with defined audiences, channels, budgets, and KPIs.
**Primary role:** campaign-manager

- **[scenario]** Q3 pipeline is 20% below target. The CMO needs a demand-gen campaign in four weeks. Without structured planning, the team scrambles — random assets, no journey logic, budget spread thin. With it, every downstream node inherits clear objectives.

### Step 2: journey-mapping
**Headline:** Journey Stage Mapping
**Lede:** Content that ignores journey stage talks to everyone and persuades no one.
**Primary role:** campaign-manager

- **[before-after]** Before: A blog post is published and promoted identically to cold prospects and existing customers. | After: The same topic spawns three assets — a thought-leadership piece for awareness, a comparison guide for consideration, and a case study for decision.

### Step 3: receive-request
**Headline:** Receive Request
**Lede:** Capturing who wants content, why, for whom, and by when — the front door of the pipeline.
**Primary role:** content-director

- **[tension]** Without structured intake, requests arrive via Slack, email, and hallway conversations — each with different levels of detail. The production team spends more time clarifying scope than creating content.

### Step 4: content-scoring
**Headline:** Content Scoring & Prioritization
**Lede:** Ranking requests against strategic priority, audience demand, and expected ROI before work begins.
**Primary role:** content-director

- **[domino-effect]** Skip scoring and low-impact content consumes the same resources as high-impact content. Your best writers spend cycles on a partner one-pager while a revenue-critical launch brief waits in the queue.

### Step 5: research-insights
**Headline:** Research & Insights
**Lede:** The Research Agent synthesizes audience signals, competitive intelligence, and trending topics into brief-ready insights.
**Primary role:** content-strategist

- **[ai-handoff]** The agent scans social listening feeds, SEO keyword trends, and competitor content in minutes. The human strategist interprets what the data means for positioning — which angle is differentiated, not just which keyword has volume.

### Step 6: write-brief
**Headline:** Write Brief
**Lede:** The single document that aligns writers, designers, reviewers, and agents on what "done" looks like.
**Primary role:** content-director

- **[tension]** The most expensive content failures trace back to briefs, not drafts. A well-written draft against a misaligned brief is still a failure — it just takes longer to discover.

### Step 7: brief-approval
**Headline:** Brief Approval
**Lede:** Approving a brief commits the pipeline to an objective — changing direction after drafting costs 5x more.
**Primary role:** content-director

- **[decision-tree]** Approve: Strategy score above threshold, required fields complete, audience clearly defined, success metrics measurable. | Revise: Missing audience specificity, unclear differentiation from existing content, or KPIs that cannot be tracked with current tooling.

### CREATE PHASE

### Step 8: draft-content
**Headline:** Draft Content
**Lede:** The Content Writer agent transforms an approved brief into a structured first draft.
**Primary role:** creative-director

- **[ai-handoff]** The agent generates the draft from the brief, brand guide, and audience persona. The human editor refines what no algorithm reliably produces: narrative judgment, emotional nuance, and whether the piece says something worth reading.

### Step 9: visual-asset-creation
**Headline:** Visual Asset Creation
**Lede:** Visual assets created alongside the draft — not bolted on at the end.
**Primary role:** creative-director

- **[tension]** When visual creation waits until after draft approval, it becomes the bottleneck. Last-minute design requests produce generic stock-photo solutions instead of purposeful visual storytelling.

### Step 10: seo-optimization
**Headline:** SEO Optimization
**Lede:** Search visibility built in, not bolted on — keywords, meta descriptions, heading structure, and internal linking.
**Primary role:** editor

- **[ai-handoff]** The agent handles keyword density, meta tags, schema markup, and internal link suggestions. The human ensures optimization serves the reader — no keyword stuffing, no clickbait headings, no sacrificing narrative flow for a search score.

### REVIEW PHASE

### Step 11: quality-check
**Headline:** Quality Check
**Lede:** Automated readability, factual accuracy, and SEO scoring — when thresholds pass, content flows through automatically.
**Primary role:** editor

- **[decision-tree]** Auto-pass: Readability above 70, SEO above 85, zero factual flags. Content proceeds without human review. | Manual review: Any threshold missed triggers editor review. Most common failures: jargon-heavy drafts and unsubstantiated claims.

### Step 12: brand-compliance
**Headline:** Brand Compliance
**Lede:** Automated scanning against brand guidelines — tone, terminology, messaging — flagging violations before human review.
**Primary role:** brand-manager

- **[scenario]** An agent-drafted blog post uses "cutting-edge" three times — a term the brand guide bans. Without automated scanning, the Brand Manager catches it manually. With it, the term is flagged and alternatives suggested before the draft ever leaves creation.

### Step 13: brand-review
**Headline:** Brand Review
**Lede:** The Brand Manager reviews content requiring human judgment — cultural context, competitive positioning, brand evolution.
**Primary role:** brand-manager

- **[tension]** A piece can be 100% compliant and still feel off-brand because the cultural moment changed, a competitor shifted positioning, or the audience matured. Brand is how the audience feels about you — that cannot be reduced to a checklist.

### Step 14: legal-review
**Headline:** Legal Review
**Lede:** Screening for regulatory compliance, IP risk, disclosure requirements, and claims substantiation.
**Primary role:** legal-counsel

- **[domino-effect]** A legal issue caught here pauses one content piece. The same issue published live triggers regulatory inquiry, PR crisis management, content takedown across all channels, and potential financial penalties.

### Step 15: legal-compliance-gate
**Headline:** Legal Compliance Gate
**Lede:** The one checkpoint where human authority is absolute — no agent overrides a legal hold.
**Primary role:** legal-counsel

- **[decision-tree]** Auto-pass: No flagged claims, no regulated terms, disclosure checklist complete. Content proceeds to final edit. | Escalate: Any regulatory flag triggers Legal Counsel review. Escalation goes directly to stakeholder sign-off if risk is material.

### Step 16: final-edit
**Headline:** Final Edit
**Lede:** The last human touch — narrative flow, coherence, and whether the piece says something worth reading.
**Primary role:** editor

- **[narrative]** Final edit is not proofreading. Agents handle readability scores, SEO, and factual checking upstream. The editor handles what machines consistently miss: whether the argument is coherent, the opening earns the next paragraph, and the writing resonates.

### Step 17: accessibility-check
**Headline:** Accessibility Check
**Lede:** WCAG compliance, inclusive language, alt-text coverage, and screen reader compatibility.
**Primary role:** editor

- **[before-after]** Before: Alt-text reads "image.png," color contrast fails, screen readers choke on decorative elements. | After: Alt-text is descriptive, contrast ratios pass WCAG AA, every visual element has a text equivalent.

### Step 18: stakeholder-signoff
**Headline:** Stakeholder Sign-off
**Lede:** Final approval from leadership — strategic alignment, not editorial quality.
**Primary role:** vp-marketing

- **[decision-tree]** Auto-pass: All upstream gates passed, content sensitivity below threshold, no legal flags. | Manual review: High-sensitivity, high-visibility, or new market positioning. The stakeholder reviews strategy — editorial quality was settled upstream.

### PUBLISH PHASE

### Step 19: localize-content
**Headline:** Localize Content
**Lede:** Adapting content for target markets — cultural nuance, regional regulatory differences, and local visual standards.
**Primary role:** localization-manager

- **[ai-handoff]** The agent handles translation, format adaptation, and regulatory checklist matching. The human reviews cultural subtleties — humor that misfires across borders, idioms with unintended meaning, and visual elements requiring cultural sensitivity.

### Step 20: localization-quality-gate
**Headline:** Localization Quality Gate
**Lede:** Validating translation accuracy, cultural appropriateness, and local regulatory compliance.
**Primary role:** localization-manager

- **[domino-effect]** A cultural misstep in one market does not stay in one market. Social media amplifies regional failures globally. This gate can escalate to legal — a cultural flag in one locale can trigger legal review across all markets.

### Step 21: schedule-publish
**Headline:** Schedule & Publish
**Lede:** When content publishes matters almost as much as what it says.
**Primary role:** marketing-ops

- **[narrative]** Cross-channel orchestration rules determine whether email goes before social, whether gated content precedes ungated, and when paid amplification triggers. The sequence is the strategy.

### Step 22: distribute
**Headline:** Distribute
**Lede:** Pushing content across social, email, syndication, and paid — each channel gets a native format.
**Primary role:** marketing-ops

- **[before-after]** Before: The same blog link shared identically on LinkedIn, Twitter, email, and Slack. | After: Each channel gets a native format — LinkedIn gets a thought-leadership hook, email gets a personalized subject line, social gets a visual-first treatment.

### MEASURE PHASE

### Step 23: track-performance
**Headline:** Track Performance
**Lede:** Real-time monitoring that compresses the time between signal and response.
**Primary role:** analytics-lead

- **[tension]** Without real-time tracking, content failures surface in the monthly report — weeks after you could have acted. By then, the campaign window has closed and the budget is spent.

### Step 24: generate-report
**Headline:** Generate Report
**Lede:** Raw metrics compiled into actionable recommendations — not what happened, but what to do next.
**Primary role:** analytics-lead

- **[quote]** "A report that tells you what happened is journalism. A report that tells you what to do next is strategy." — Analytics Lead

### Step 25: attribution-modeling
**Headline:** Attribution Modeling
**Lede:** Multi-touch attribution revealing which content drives pipeline — not just clicks.
**Primary role:** analytics-lead

- **[before-after]** Before: Last-touch attribution gives all credit to the final asset before conversion. Top-of-funnel content looks like a cost center. | After: Multi-touch attribution reveals awareness-stage content influenced the majority of closed deals. The blog post that "never converted" initiated the buying journey for your largest accounts.

### Step 26: executive-reporting
**Headline:** Executive Reporting
**Lede:** Performance data synthesized for leadership — strategic recommendations, not operational details.
**Primary role:** analytics-lead

- **[domino-effect]** Executive reports feed directly back into campaign planning — closing the largest feedback loop in the system. When this loop is tight, the pipeline becomes a learning system. When it is slow, you are optimizing for last quarter's reality.

### OPTIMIZE PHASE

### Step 27: performance-review
**Headline:** Performance Review
**Lede:** Evaluating content against original KPIs — optimize, iterate, or archive.
**Primary role:** analytics-lead

- **[decision-tree]** Optimize: Meets 60–80% of KPI targets. Tweak headlines, CTAs, or distribution. The asset is sound — it needs refinement, not reinvention. | Iterate: Misses targets widely but topic has strategic value — send back to brief with new data. Archive: Performance declining and topic no longer strategic.

### Step 28: optimize
**Headline:** Optimize
**Lede:** Improving existing assets at a fraction of the cost of creating new ones.
**Primary role:** marketing-ops

- **[before-after]** Before: Content is "one and done" — published, promoted once, forgotten. | After: Top-performing content gets optimized iteratively. A single optimized piece can outperform three new pieces in pipeline contribution.

### Step 29: archive-tag
**Headline:** Archive & Tag
**Lede:** Turning individual assets into a searchable, composable knowledge base.
**Primary role:** context-engineer

- **[tension]** Most content teams create assets faster than they organize them. Within two years, the library becomes a graveyard — thousands of assets, no one knows what exists, and new content is created because finding existing content takes longer than starting from scratch.

### Step 30: content-governance
**Headline:** Content Governance
**Lede:** Content does not stay correct forever — governance catches decay before customers or regulators do.
**Primary role:** context-engineer

- **[scenario]** A "2024 compliance guide" is still live in 2025 with outdated regulatory references. A product comparison references a discontinued competitor. A case study quotes a client now in litigation with your company.

### Step 31: governance-gate
**Headline:** Governance Gate
**Lede:** The gate that makes the content operation self-maintaining.
**Primary role:** context-engineer

- **[decision-tree]** Auto-pass: Content under 90 days old, no regulatory changes in its category, performance above decay threshold. | Flag for review: Age threshold exceeded, regulatory landscape shifted, or performance declined. Triggers re-entry into the pipeline at the appropriate stage.
- **[narrative]** This is where agents commoditize and infrastructure compounds. The governance knowledge that accrues here — what ages well, what decays, what triggers regulatory exposure — improves every agent's output simultaneously. The pipeline does not just produce content. It learns.

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

## 11. Presentation Walkthrough (6 Slides)

The presentation is a guided narrative delivered through 6 slides. Each slide controls the 3D camera position, which nodes are visible, and which link types are highlighted. The slides build a progressive argument from simple pipeline → real complexity → strategic infrastructure → human elevation → closing argument.

### Slide 1: "The Marketing Campaign Lifecycle" (act1-title)
- Narration: (none — title card)
- Graph state: linear | Action: show-title-slide

### Slide 2: "The Marketing Lifecycle" (act1-lifecycle)
- Narration: Every marketing team could draw a similar pipeline: Plan, Create, Review, Publish, Measure, Optimize. Six stages, left to right. Clean columns. But behind each stage are teams, handoffs, and dependencies — and the complexity compounds fast. 50+ steps, not six. This is the operational reality, and one we can encode.
- Graph state: linear | Shows: steps | Highlights: flows-to | Action: show-teams-by-phase
- *Merges former slides 2 (pipeline) + 3 (teams). show-teams-by-phase is a visual superset of show-linear-pipeline.*

### Slide 3: "Adding Agents — And What They Actually Need" (act2-agents-and-context)
- Narration: AI agents get overlaid on specific steps — research, drafting, optimization, performance analysis. That is the natural first move, and it works. But what this agent-first approach misses is that the real work depends on context: brand instincts, legal judgment calls, audience intuition that lives in your best people's heads. Most of that intelligence is mundane — routine decisions, everyday judgment calls. Codifying the mundane is exactly the point. When you make the routine explicit, agents can reason over it — and your people focus on work that actually requires them.
- Graph state: linear | Shows: inputs | Highlights: uses | Action: show-agent-dependencies
- *Merges former slides 4 (agents on pipeline) + 5 (agent dependencies). show-agent-dependencies shows agents AND their input dependencies.*

### Slide 4: "It's Not a Pipeline — It's a Graph" (act3-graph-reveal)
- Narration: Now add the real structure. Checkpoints. Feedback loops. Escalation paths. Fast-track bypasses. The neat columns dissolve. This is not a pipeline — it is a graph.
- **Graph state: full-graph** (THE REVEAL) | Action: explode-to-graph
- *Unchanged — the single most dramatic moment keeps its own slide.*

### Slide 5: "The Intelligence Layer" (act4-intelligence-layer)
- Narration: This is the intelligence layer. Twenty inputs capturing how your organization actually works — brand voice, audience understanding, legal frameworks, orchestration rules — each connected to every agent that depends on it. Update one input, and the entire system gets smarter. The agents will become interchangeable — you can swap models next quarter. But the knowledge graph compounds. Refine one input and every agent that touches it improves simultaneously. Agents commoditize. Infrastructure compounds. Your competitors can buy the same models. They cannot replicate the way your organization thinks.
- Graph state: full-graph | Shows: inputs, agents | Highlights: uses, performs | Action: show-infrastructure-vs-agents
- *Merges former slides 7 (intelligence layer) + 8 (thesis). show-infrastructure-vs-agents highlights both inputs and agents with all connecting links.*

### Slide 6: "A Different Way of Working" (act6-close)
- Narration: To take humans out of the loop on routine work, you first have to codify that routine — extract the patterns, the decision logic, the ways of working that nobody has ever written down. That is the unglamorous work. But once the mundane is structured, agents handle it — and humans move to strategy, creative direction, and judgment.
- Graph state: full-graph | Action: show-operating-model
- *Merges former slides 9 (elevation) + 10 (new roles) + 11 (close). show-operating-model clears all highlights showing the full graph — a "zoom out" close covering elevation, context engineer role, and the closing argument.*

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
