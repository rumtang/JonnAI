// ─────────────────────────────────────────────────────────────────────────────
// EXPANDED Role Definitions — Marketing Campaign Knowledge Graph
// ─────────────────────────────────────────────────────────────────────────────
// This file replaces role-definitions.ts with 8-10x richer content per role.
// Key changes:
//   1. JourneyStage expanded with optional painPoints, benchmarks, outcomes,
//      roleEvolution, and antiPatterns fields (backward compatible).
//   2. RoleNarrative expanded with optional stageOverviews per maturity stage.
//   3. All owned-step and reviewed-gate journeys rewritten with industry
//      benchmarks, specific scenarios, and role-appropriate voice.
//   4. Support node journeys (agents, inputs) added so "What Supports You"
//      section renders on stage slides.
//
// Sources cited in benchmarks:
//   - Gartner CMO Spend Survey 2024-2025
//   - Salesforce State of Marketing 2024
//   - McKinsey "The Value of Getting Personalization Right" (2023)
//   - Adobe Content Supply Chain Research (2024)
//   - Forrester Cross-Channel Attribution (2024)
//   - Nucleus Research Marketing Automation ROI (2024)
//   - Salesforce Agentforce deployment data (H1 2025)
//   - MarketingProfs B2B Content Benchmarks (2024)
//   - Content Marketing Institute / Orbit Media (2024)
//   - CSA Research / Nimdzi Localization (2025)
// ─────────────────────────────────────────────────────────────────────────────

export type RoleCategory = 'strategy' | 'creative' | 'governance' | 'operations' | 'growth';

export const ROLE_CATEGORIES: Record<RoleCategory, { label: string; subtitle: string; iconName: string }> = {
  strategy:   { label: 'Strategy',   subtitle: 'Set the direction',   iconName: 'Compass' },
  creative:   { label: 'Creative',   subtitle: 'Make the work',       iconName: 'Palette' },
  governance: { label: 'Governance', subtitle: 'Protect the brand',   iconName: 'Shield' },
  operations: { label: 'Operations', subtitle: 'Keep it running',     iconName: 'Settings' },
  growth:     { label: 'Growth',     subtitle: 'Multiply the impact', iconName: 'TrendingUp' },
};

// ─── Expanded Interfaces ────────────────────────────────────────────────────

export interface JourneyStage {
  summary: string;               // 2-3 sentence headline — vivid and specific
  detail: string;                // Rich paragraph with examples, mechanisms, and context

  // NEW — optional rich fields for deeper slide content
  painPoints?: string[];         // 2-4 specific, relatable challenges at this stage
  benchmarks?: string[];         // 2-3 industry data points with source attribution
  outcomes?: string[];           // 2-3 measurable results or expected changes
  roleEvolution?: string;        // How the person's day-to-day work shifts at this stage
  antiPatterns?: string[];       // 1-2 common mistakes or failure modes
}

export interface NodeJourney {
  preAI: JourneyStage;
  aiAgents: JourneyStage;
  aiAgentic: JourneyStage;
}

// Stage-level narrative overview — framing paragraph for each maturity stage
export interface StageOverview {
  narrative: string;             // 2-3 sentence framing of this stage for this role
  timeAllocation: string;        // How time is distributed, e.g. "60% admin, 25% reviews, 15% strategy"
  criticalMetrics: string[];     // 3-5 KPIs that matter most at this stage
  strategicOpportunity: string;  // The single biggest opportunity at this stage
}

export interface RoleNarrative {
  nodeJourneys: Record<string, NodeJourney>;
  keyInsight: string;

  // NEW — optional stage-level overviews for richer slide framing
  stageOverviews?: {
    preAI: StageOverview;
    aiAgents: StageOverview;
    aiAgentic: StageOverview;
  };
}

export interface RoleDefinition {
  id: string;
  title: string;
  description: string;
  tagline: string;
  iconName: string;
  category: RoleCategory;
  accentColor: string;
  ownedSteps: string[];
  reviewedGates: string[];
  relatedAgents: string[];
  relatedInputs: string[];
  narrative: RoleNarrative;
  painPoints?: string[];  // Optional — used by front office lens roles
}

export function computeRoleStats(role: RoleDefinition, totalGraphNodes: number) {
  const steps = role.ownedSteps.length;
  const gates = role.reviewedGates.length;
  const total = steps + gates + role.relatedAgents.length + role.relatedInputs.length;
  return { steps, gates, total, coveragePct: Math.round((total / totalGraphNodes) * 100) };
}

// ─── Role Definitions ───────────────────────────────────────────────────────

export const ROLE_DEFINITIONS: RoleDefinition[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // ROLE 1: CONTENT DIRECTOR
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'content-director',
    title: 'Content Director',
    description: 'Owns the brief phase and approves content briefs before creation begins. The strategic gatekeeper who determines what gets made, why it matters, and whether it meets the bar.',
    tagline: 'Scopes and approves every brief — the highest-leverage editorial decision in the pipeline.',
    iconName: 'FileText',
    category: 'strategy',
    accentColor: '#5B9ECF',
    ownedSteps: ['receive-request', 'write-brief', 'content-governance', 'content-scoring'],
    reviewedGates: ['brief-approval', 'governance-gate'],
    relatedAgents: ['research-agent', 'writer-agent'],
    relatedInputs: ['content-strategy', 'audience-personas', 'scoring-matrix'],
    narrative: {
      stageOverviews: {
        preAI: {
          narrative: 'Before AI, the Content Director is the bottleneck the organization cannot see. Every request flows through one person\'s judgment, one person\'s calendar, one person\'s bandwidth. The role is 70% administrative triage and 30% strategic thinking — an inversion of where value actually lives.',
          timeAllocation: '35% request triage and intake, 25% brief writing, 20% approval reviews, 10% governance checks, 10% strategic planning',
          criticalMetrics: ['Brief-to-approval cycle time', 'Request backlog depth', 'Brief revision rate', 'Stakeholder satisfaction score', 'Content calendar adherence'],
          strategicOpportunity: 'Most Content Directors spend the majority of their time on work any competent coordinator could do — the strategic judgment that justifies the role\'s seniority is exercised in the margins.',
        },
        aiAgents: {
          narrative: 'AI agents absorb the administrative layer: structuring requests, drafting briefs, pre-scoring priorities. The Content Director shifts from processing every item to reviewing exceptions and refining agent outputs. The transition feels like going from air traffic control to flight planning.',
          timeAllocation: '15% exception review, 25% brief refinement and strategic direction, 20% agent calibration, 25% strategic planning, 15% stakeholder alignment',
          criticalMetrics: ['Agent accuracy rate (brief quality)', 'Exception-to-total ratio', 'Strategic time recaptured', 'Brief approval speed', 'Scoring model precision'],
          strategicOpportunity: 'The 30-40% of time freed from administrative tasks creates space for the work that actually differentiates content: competitive intelligence, audience insight synthesis, and editorial vision.',
        },
        aiAgentic: {
          narrative: 'The Content Director becomes a system architect rather than a content processor. Routine work flows autonomously through scoring models, auto-generated briefs, and self-operating governance gates. Human judgment concentrates on the 15-20% of decisions where competitive intuition, organizational politics, and strategic ambiguity intersect.',
          timeAllocation: '5% system monitoring, 15% model calibration and rule updates, 30% strategic planning, 30% cross-functional leadership, 20% high-stakes editorial decisions',
          criticalMetrics: ['Autonomous completion rate', 'Model drift detection', 'Strategic content ROI', 'Escalation quality (false positive rate)', 'Pipeline velocity'],
          strategicOpportunity: 'The role\'s value proposition inverts: instead of being measured by throughput (briefs approved per week), the Content Director is measured by the quality of the system they\'ve built and the strategic bets they make on the content that only they can greenlight.',
        },
      },
      nodeJourneys: {
        // ── OWNED STEPS ──────────────────────────────────────────────────

        'receive-request': {
          preAI: {
            summary: 'Request intake consumes 6-8 hours weekly in manual triage — sorting stakeholder emails, Slack threads, meeting follow-ups, and project management tickets into a workable queue that no one else can decipher.',
            detail: 'Enterprise content requests arrive through at least four channels (email, Slack, PM tools, and verbal asks in meetings) with no standard format. The Content Director spends roughly 15% of each week normalizing these into structured briefs: extracting the actual ask from the stakeholder narrative, cross-referencing against the content calendar, checking for duplicates, and estimating resource requirements. The most common failure mode is scope ambiguity — stakeholders describe outcomes ("we need awareness content") without specifying audience, format, or success criteria, forcing 2-3 rounds of clarification before a brief can even be written. In enterprise environments, a single content request often involves 51-200 people across the creation and approval chain, which means intake errors compound exponentially downstream.',
            painPoints: [
              'Duplicate requests from different stakeholders for the same campaign surface only after work has started on both — wasting 10-15 hours of creative time per incident',
              'Priority shifts weekly as executives lobby; the "most urgent" request from Monday is deprioritized by Thursday, but the resources are already allocated',
              'Verbal requests in meetings bypass intake entirely, creating shadow work that never appears in capacity planning or pipeline reporting',
              'No single system of record means the Content Director IS the system of record — vacation or illness creates a complete pipeline stall',
            ],
            benchmarks: [
              '89% of enterprise marketing teams require 3+ approval stages per content piece — intake quality determines how many of those stages trigger rework (Adobe/Storyteq 2024)',
              '58% of marketers spend 40%+ of their time managing reviews and approvals rather than strategic work (Adobe Content Supply Chain Research)',
              '47% of enterprise marketers report 51-200 people involved in creating, reviewing, and approving a single content piece (MarketingProfs B2B Benchmarks 2024)',
            ],
            outcomes: [
              'Average request-to-brief cycle: 3-5 business days for standard requests, 7-10 for complex campaigns',
              'Rework caused by intake errors: estimated 20-30% of total content production time in organizations without standardized intake',
            ],
            roleEvolution: 'At this stage, the Content Director is fundamentally a traffic controller. The most valued skill is speed of triage, not strategic judgment. The role feels administrative even though the decisions are consequential — a misclassified request wastes weeks of downstream effort.',
          },
          aiAgents: {
            summary: 'An intake agent structures every request into a standard brief template before it reaches the queue — pre-categorized with audience data, strategic alignment scores, and duplicate flags. Triage drops from 6-8 hours to 1-2 hours weekly.',
            detail: 'AI intake agents parse requests from email, Slack, and project tools, extracting key fields (audience, format, deadline, strategic alignment) and pre-populating brief templates. The system cross-references incoming requests against the content calendar and flags duplicates or conflicts before they reach the Content Director. The human role shifts from assembling information to validating and prioritizing — reviewing pre-scored requests rather than manually classifying each one. The key risk at this stage is over-trust: agents are good at pattern-matching against historical requests but poor at detecting genuinely new strategic directions that do not fit existing scoring rubrics. Content Directors who delegate too much intake oversight lose the peripheral vision that lets them spot emerging themes before they become obvious.',
            painPoints: [
              'Agent scoring models require 3-6 months of historical data to calibrate — early outputs produce high false-positive rates for "strategic alignment" scoring',
              'Stakeholders who discover the scoring system learn to game intake forms by using keywords that artificially boost priority scores',
              'The transition period (weeks 4-12) often feels worse than manual intake because the Content Director is now reviewing agent outputs AND catching errors, not just doing it themselves',
            ],
            benchmarks: [
              'AI-assisted workflow tools deliver 30-40% reduction in coordination time within the first year (Salesforce State of Marketing 2024)',
              'Intake automation reduces request-to-brief cycle from 3-5 days to same-day for standard requests in mature implementations',
              'LinkedIn research: professionals using AI for research and intake tasks save an average of 1.5 hours per week (LinkedIn 2025)',
            ],
            outcomes: [
              'Content Director time on intake drops from 15% to 5% of weekly hours — freeing roughly 4-6 hours per week for brief quality and strategic oversight',
              'Duplicate request detection catches 60-70% of overlapping work before resources are allocated',
              'Stakeholder satisfaction with intake responsiveness typically improves 40-50% due to faster acknowledgment and structured status updates',
            ],
            roleEvolution: 'The Content Director transitions from traffic controller to editorial strategist. Instead of processing every request, the role focuses on the 20-30% of requests that require genuine strategic judgment — new audience segments, competitive responses, or cross-functional campaigns where automated scoring lacks context. The most important new skill is calibrating the intake agent\'s scoring model, not faster personal triage.',
          },
          aiAgentic: {
            summary: 'Requests auto-classify, score, and route end-to-end. The system handles 70-80% of intake volume autonomously — the Content Director intervenes only on strategic arbitration that scoring models cannot resolve.',
            detail: 'Fully agentic intake operates as a continuous triage system: requests are parsed, classified, scored against strategic criteria, checked for duplicates and calendar conflicts, and routed to the appropriate brief template — all without human intervention for standard categories. The Content Director defines scoring weights, strategic priorities, and escalation thresholds rather than processing individual requests. Mature deployments report 60%+ of incoming requests resolved autonomously. The main challenge shifts from intake efficiency to governance: ensuring the scoring model reflects current strategic priorities (not last quarter\'s), that escalation thresholds surface genuinely ambiguous cases without creating noise, and that the system captures weak signals about emerging market themes that autonomous routing would otherwise bury. The Content Director who succeeds at this stage treats the intake system as a product they maintain, not a tool they use.',
            painPoints: [
              'Scoring model drift: strategic priorities change quarterly but model recalibration is deprioritized as "operational maintenance" rather than recognized as strategic work',
              'Loss of peripheral awareness — the Content Director no longer sees every request, which means weak signals about emerging market themes or shifting stakeholder priorities can go undetected for weeks',
              'Organizational trust deficit: some stakeholders resist autonomous routing because they want a human to acknowledge their request, regardless of system efficiency',
            ],
            benchmarks: [
              '60% of incoming requests resolved autonomously in mature agentic deployments (Salesforce Agentforce case study: 1-800-Accountant, 2025)',
              'Agent creation surged 119% between January-June 2025, indicating rapid enterprise adoption of autonomous workflow agents (Salesforce H1 2025 Index)',
              'Agentic intake reduces average request latency to under 15 minutes for standard categories vs. 3-5 days manual (industry composite)',
            ],
            outcomes: [
              'Intake becomes a system property rather than a role responsibility — the Content Director\'s personal time allocation to routine intake approaches zero',
              'Pipeline predictability improves significantly because intake is no longer gated by one person\'s calendar or cognitive load',
              'The Content Director can run "what-if" analyses on intake patterns — surfacing which request types are growing, which stakeholders are overloading the system, and where strategic gaps exist',
            ],
            roleEvolution: 'The Content Director\'s relationship with intake inverts entirely. Instead of spending time processing requests, the role becomes a system designer: maintaining scoring models, defining escalation logic, and calibrating the boundary between "routine" and "strategic." The most critical skill is knowing when the model is wrong — recognizing that a request flagged as routine is actually a strategic signal, or that an escalated item is noise the model hasn\'t learned to filter yet.',
          },
        },

        'write-brief': {
          preAI: {
            summary: 'Every brief is written from scratch — translating stakeholder requests into structured creative direction through manual research, audience alignment, and iterative stakeholder negotiation.',
            detail: 'Brief writing is the Content Director\'s core craft, but it is also their primary bottleneck. Each brief requires synthesizing the stakeholder ask, audience data, competitive context, brand guidelines, and content calendar availability into a document that creative teams can execute against. In enterprise environments, the average blog post takes over 4 hours to produce from outline to publishable form (Orbit Media), and the brief itself consumes 30-60 minutes of that. The deeper problem is consistency: when one person writes all briefs, quality tracks their energy level and bandwidth. Friday afternoon briefs are measurably different from Tuesday morning briefs. Stakeholder negotiation adds another layer — the original request rarely matches what the organization actually needs, and the Content Director must navigate the gap without alienating the requester.',
            painPoints: [
              'Brief quality is directly correlated to the Content Director\'s bandwidth — when the queue is deep, briefs get thinner, and creative teams fill the gaps with assumptions that produce rework',
              'Stakeholders often conflate what they want (a blog post about their product) with what the audience needs (guidance on solving a specific problem), requiring diplomatic redirection',
              'Historical brief data lives in the Content Director\'s memory, not in a queryable system — lessons from past campaigns are not systematically applied to new briefs',
            ],
            benchmarks: [
              'Average blog post production time: 4 hours 10 minutes from outline to publishable form (Orbit Media / HubSpot 2024)',
              '41% of B2B marketers cite workflow and content approval as a top operational challenge (MarketingProfs 2024)',
              'Content production costs represent 10-15% of total marketing budget in enterprise organizations, with brief quality as the primary determinant of production efficiency',
            ],
            outcomes: [
              'Brief-to-creative handoff takes 1-3 days depending on complexity, with 20-30% of briefs requiring at least one revision before creative work begins',
              'The Content Director can produce 8-15 briefs per week at quality; beyond that, shortcuts appear as vague objectives, missing audience specifics, or recycled messaging frameworks',
            ],
            roleEvolution: 'Brief writing is where the Content Director\'s strategic judgment is most visible — a great brief compresses complex strategic intent into actionable creative direction. But at this stage, the volume of briefs crowds out the thinking time that makes each one good. The role feels like an assembly line with a quality-sensitive final station.',
          },
          aiAgents: {
            summary: 'AI drafts the brief from templates, audience data, and historical patterns — the Content Director reviews and refines instead of writing from scratch. Brief production shifts from creation to curation.',
            detail: 'The agent assembles audience data from the CDP, competitive context from research tools, and strategic guidelines from the content strategy into a structured first draft. The Content Director reshapes this draft rather than building it from nothing — adding strategic nuance, adjusting the audience framing, and sharpening the creative direction. First-draft quality is typically 60-70% of final, meaning the human contribution concentrates on the 30-40% that requires judgment: tone calibration, competitive positioning, and creative risk appetite. The danger at this stage is "default acceptance" — reviewing an AI-drafted brief is cognitively different from writing one, and Content Directors who do not actively challenge agent outputs find themselves approving mediocre briefs that technically meet criteria but lack strategic edge. The best practitioners develop a "red pen" discipline: reading agent-generated briefs with the assumption that the first draft is a starting point, not a suggestion.',
            painPoints: [
              'AI-drafted briefs tend toward the median — they match historical patterns well but rarely propose the contrarian angle or unexpected format that produces breakthrough content',
              'Review fatigue: approving 20 agent-drafted briefs feels less demanding than writing 10, but the cognitive cost of quality evaluation is high and the failure mode is subtle (approving "good enough" when "excellent" was achievable)',
              'Calibrating the agent requires explicit articulation of implicit editorial standards — knowledge the Content Director may not have documented or even consciously recognized',
            ],
            benchmarks: [
              'AI content tools reduce first-draft generation time by 40-60%, but total production cycle savings are 25-35% when review and refinement are included (composite from Jasper, Writer benchmarks)',
              'Organizations report 60-80% reduction in revision cycles when AI drafts embed brand voice features from the start (Jasper 2024)',
              'Total content production costs drop 30-40% with AI-assisted drafting at enterprise scale (industry composite)',
            ],
            outcomes: [
              'Brief production capacity doubles or triples without additional headcount — the Content Director can oversee 25-40 briefs per week with maintained quality',
              'Creative team satisfaction improves because briefs arrive with more complete context (audience data, competitive examples, performance benchmarks from similar past content)',
              'The Content Director\'s strategic contribution per brief increases because the administrative production work is absorbed by the agent',
            ],
            roleEvolution: 'The Content Director stops being a writer and becomes an editor — not of content, but of strategy. The daily rhythm shifts from "produce briefs" to "shape the editorial judgment that produces them." This is a genuine seniority gain, but it requires a different skill set: the ability to evaluate and improve someone else\'s work (even an AI\'s) rather than producing one\'s own.',
          },
          aiAgentic: {
            summary: 'Routine briefs auto-generate and route for approval without Content Director involvement. Direct writing drops to the 20% of briefs that genuinely require strategic authorship — competitive responses, new market entries, and crisis communications.',
            detail: 'The agentic brief system handles the full lifecycle for standard content types: pulling audience data, assembling the brief from templates and historical patterns, scoring it against strategic criteria, and routing it for creative execution — all autonomously. The Content Director intervenes only when the system detects strategic ambiguity (competing priorities, new audience segments, requests that do not match any historical pattern) or when the brief\'s risk score exceeds a defined threshold. The critical shift is from throughput to system quality: the Content Director\'s output is no longer "briefs written per week" but "brief system accuracy" — how often autonomous briefs produce content that meets strategic objectives without human correction. This requires a fundamentally different relationship with the work: monitoring aggregate outcomes rather than inspecting individual items, calibrating the system based on downstream performance data, and intervening only when the system cannot resolve ambiguity on its own.',
            painPoints: [
              'The Content Director must resist the urge to review every brief — selective intervention is harder than comprehensive review because it requires trusting the system while staying alert for drift',
              'Auto-generated briefs for genuinely novel content types (new product category, new audience segment, new competitive landscape) can be confidently wrong — they apply historical patterns to situations where those patterns do not apply',
              'Organizational power dynamics shift: if the Content Director no longer writes most briefs, some stakeholders question the role\'s necessity, requiring a visible demonstration of strategic value',
            ],
            benchmarks: [
              'Autonomous content workflows handle 70-80% of standard brief types without human intervention in mature deployments (industry composite from Salesforce, Adobe implementations)',
              'The 20% of briefs requiring human strategic authorship typically generate 60%+ of measured content ROI — confirming that the role\'s value concentrates in the long tail of high-stakes decisions',
              'Marketing automation returns $5.44 for every $1 spent over 3 years, with brief automation as a significant contributor to that ratio (Nucleus Research 2024)',
            ],
            outcomes: [
              'The Content Director\'s personal brief writing drops to 3-5 per week, but each one addresses the organization\'s highest-stakes content challenges',
              'Pipeline velocity for standard content increases 3-5x because there is no human gating on routine briefs',
              'Content quality becomes more consistent because the automated system applies the same standards to every brief, eliminating the variability inherent in human bandwidth fluctuations',
            ],
            roleEvolution: 'The Content Director becomes a strategic architect who designs the system that produces briefs, not the person who writes them. The most important activities at this stage are: (1) calibrating the brief-generation model quarterly to reflect evolving strategy, (2) authoring the high-stakes briefs that require competitive intuition no model can replicate, and (3) making the case to leadership for the editorial bets that only a human strategist would take.',
          },
        },

        'content-governance': {
          preAI: {
            summary: 'Governance policies are enforced manually — checking each content piece against taxonomy rules, compliance requirements, and quality standards scattered across multiple reference documents that different reviewers interpret differently.',
            detail: 'Content governance at the pre-AI stage is a consistency problem masquerading as a compliance problem. The rules exist (taxonomy standards, compliance requirements, quality thresholds), but they live in scattered documents, wiki pages, and institutional memory. Different reviewers interpret the same policy differently, producing inconsistent enforcement that frustrates both creators and stakeholders. The Content Director spends 10-15% of weekly time on governance activities — mostly checking whether content adheres to taxonomy, messaging architecture, and regulatory requirements. The deeper issue is that governance reviews happen late in the pipeline, meaning non-compliant content has already consumed creative resources by the time violations are caught. In regulated industries (financial services, healthcare, pharma), governance failures carry regulatory risk that goes far beyond editorial inconvenience.',
            painPoints: [
              'Governance rules are distributed across 5-10 reference documents with no single source of truth — reviewers waste time locating the relevant standard before they can evaluate content',
              'Inconsistent enforcement creates a credibility problem: creators learn that governance depends on which reviewer they get, not on the actual rules, eroding organizational trust in the process',
              'Late-stage governance catches force rework on content that has already been through creative production, review, and stakeholder approval — each rejection costs 2-3x the original production time',
            ],
            benchmarks: [
              '81% of companies struggle with maintaining brand consistency across channels — governance is the mechanism that is supposed to prevent this (Lucidpress/Marq State of Brand Consistency)',
              'Companies with high brand consistency achieve 2.4x higher average growth rates than inconsistent competitors (Marq 2021)',
              'Off-brand content contributes to 32% of customers leaving after a single bad brand experience (Marq Brand Consistency Report)',
            ],
            outcomes: [
              'Governance review adds 1-3 days to the content pipeline for each piece, with an estimated 15-20% rejection rate requiring revision cycles',
              'The Content Director\'s governance authority is diluted by inconsistent enforcement — the role becomes reactive (catching violations) rather than proactive (preventing them)',
            ],
            roleEvolution: 'Governance feels like policing rather than strategy. The Content Director knows that consistent governance drives brand value, but the daily reality is reviewing individual pieces against rules that should be self-enforcing. The highest-value governance work — evolving the taxonomy, updating standards for new content types, aligning governance with business strategy — gets deprioritized because the review queue never empties.',
          },
          aiAgents: {
            summary: 'A governance agent flags taxonomy mismatches, policy violations, and quality threshold failures before content reaches the Content Director — automated checks surface issues early so human review concentrates on judgment calls, not compliance scanning.',
            detail: 'AI governance agents encode the scattered policy documents into a unified rule set that is applied consistently across all content. Automated checks catch 70-80% of violations before human review: taxonomy misclassifications, missing metadata, messaging architecture deviations, and regulatory keyword triggers. The Content Director shifts from comprehensive compliance scanning to exception handling — reviewing items that the agent flags as ambiguous or that fall in the grey zone between compliant and non-compliant. The most impactful change is timing: governance checks move earlier in the pipeline, catching issues before creative production is complete rather than after. This prevents the costly late-stage rework that characterizes manual governance. The risk at this stage is over-reliance on automated rules for nuanced judgments — the agent can enforce explicit rules but cannot evaluate whether content is strategically appropriate, culturally sensitive, or reputationally sound.',
            painPoints: [
              'Agent governance rules must be explicitly codified — implicit standards ("we just know when something feels off-brand") cannot be automated without significant upfront documentation effort',
              'False positives in early months can undermine creator confidence in the governance system, producing workarounds that bypass automated checks entirely',
            ],
            benchmarks: [
              'AI brand compliance tools (Acrolinx, Writer, Grammarly Business) report 70-80% of routine compliance checks handled autonomously in mature implementations',
              'Early-stage governance checks reduce late-pipeline rejection rates by 40-60%, significantly reducing rework costs',
            ],
            outcomes: [
              'Content Director governance time drops from 10-15% to 3-5% of weekly hours, concentrated entirely on edge cases and policy evolution',
              'Pipeline rejection rates at the governance gate drop by half because violations are caught and corrected during creation, not after',
              'Governance consistency improves measurably because the agent applies the same rules to every piece — eliminating reviewer-dependent variation',
            ],
            roleEvolution: 'The Content Director transitions from governance enforcer to governance architect. The daily work shifts from "does this comply?" to "are our compliance rules still right?" — maintaining the rule set, adjudicating edge cases that the agent cannot resolve, and evolving standards as content types and regulatory landscapes change.',
          },
          aiAgentic: {
            summary: 'Governance is embedded in the creation process itself — violations are blocked or flagged during drafting, not discovered in review. The Content Director maintains the governance system and adjudicates the rare exceptions the system escalates.',
            detail: 'In the fully agentic model, governance rules are enforcement constraints within the content creation pipeline rather than a separate review step. The drafting agent, the brief generator, and the publishing system all reference the governance framework in real time, preventing non-compliant content from being produced in the first place. The Content Director\'s governance role becomes architectural: defining the rules, monitoring their effectiveness through compliance dashboards, and updating them as business strategy, regulatory requirements, and content types evolve. When exceptions arise — a new content type that does not fit existing taxonomy, a regulatory change that requires policy interpretation, a reputational risk scenario with no precedent — the Content Director makes the judgment call and codifies the decision as a new rule. This creates a self-improving governance loop: every exception resolved by a human becomes a rule that the system enforces automatically going forward.',
            painPoints: [
              'Governance system maintenance is invisible work that organizations undervalue — the system "just works" until it doesn\'t, and the Content Director must advocate for ongoing calibration resources',
              'Rule proliferation: as more edge cases are codified, the governance rule set grows in complexity, potentially creating contradictions or overly restrictive constraints that stifle creative work',
            ],
            benchmarks: [
              'Embedded governance (rules enforced during creation rather than in review) reduces compliance cycle time by 70-90% compared to batch review models',
              'Organizations with automated governance report 20% revenue growth potential from improved brand consistency across channels (Marq 2021)',
            ],
            outcomes: [
              'The governance gate becomes a verification checkpoint rather than a decision point — most content passes automatically because it was compliant by construction',
              'The Content Director\'s governance decisions carry disproportionate weight because each one becomes a system-wide precedent, not a one-off ruling',
              'Governance reporting shifts from "violation count" to "system health" — tracking rule coverage, exception rates, and compliance consistency across content types',
            ],
            roleEvolution: 'The Content Director becomes the governance system\'s product owner. The role\'s output is not "content reviewed" but "governance system effectiveness" — measured by how rarely exceptions occur, how quickly new content types are covered, and how consistently the organization\'s brand and compliance standards are maintained at scale.',
          },
        },

        'content-scoring': {
          preAI: {
            summary: 'Content requests are scored and prioritized against business objectives using spreadsheets and subjective judgment — criteria live in the Content Director\'s head or a reference document that nobody else consults consistently.',
            detail: 'Content scoring at this stage is part science, part politics. The Content Director maintains a mental model of organizational priorities — which business units need content, which campaigns are highest-impact, which stakeholder requests align with strategic goals — and applies this model to incoming requests through a combination of spreadsheet tracking and judgment calls. The problem is transparency: when priorities are not visible and objectively scored, stakeholders perceive the system as arbitrary. Requests from senior executives get fast-tracked regardless of strategic merit. Pet projects consume resources that should go to higher-impact work. The Content Director becomes a political buffer rather than a strategic allocator, spending more time justifying decisions than making them. In enterprises with 80+ monthly campaigns and 500+ content assets, manual scoring cannot operate at the speed or consistency the pipeline demands.',
            painPoints: [
              'Scoring criteria are implicit — when the Content Director is unavailable, no one else can prioritize the queue, creating single-point-of-failure risk for the entire content pipeline',
              'Political pressure overrides strategic scoring: a VP\'s request gets prioritized over a higher-ROI campaign because organizational dynamics trump analytical frameworks',
              'Prioritization changes weekly as business conditions shift, but the scoring model (if it exists) is not updated in real time — creating a lag between strategic reality and resource allocation',
              'There is no feedback loop between content performance and scoring — high-priority content that underperforms is not systematically analyzed to improve future prioritization',
            ],
            benchmarks: [
              '42% of marketers still rely on manual spreadsheet-based processes for critical workflow decisions like prioritization and attribution (RevSure State of Marketing Attribution 2024)',
              'Enterprise marketing teams produce 80+ campaigns and 500+ content assets monthly — manual scoring at this volume guarantees inconsistency and fatigue-driven errors',
              'Only 14% of companies have fully automated lead-to-revenue tracking, suggesting that content scoring against business outcomes remains largely manual and disconnected (RevSure 2024)',
            ],
            outcomes: [
              'Scoring decisions take 15-30 minutes per request for complex campaigns, compounding across 80+ monthly requests into a significant time investment',
              'An estimated 20-30% of content production resources are allocated to work that does not align with the organization\'s stated strategic priorities (industry estimate from marketing operations surveys)',
            ],
            roleEvolution: 'The Content Director at this stage is part strategist, part diplomat. The scoring function should be analytical, but it operates politically because the criteria are not transparent, the data is not systematic, and the feedback loop is absent. The role\'s authority depends on personal credibility rather than system-level rigor.',
          },
          aiAgents: {
            summary: 'A scoring agent applies the Content Director\'s rubric automatically — requests arrive pre-scored against strategic criteria, audience alignment, and historical performance. The Content Director reviews the ranked queue and adjusts edge cases rather than scoring each item individually.',
            detail: 'The AI scoring agent encodes the Content Director\'s prioritization criteria into a model that evaluates every incoming request against strategic alignment, audience value, resource requirements, and historical ROI for similar content types. Requests arrive in the queue pre-ranked with confidence scores, supporting data, and flags for items that fall near decision boundaries. The Content Director reviews the rankings, overrides scores where strategic context exceeds the model\'s knowledge, and adjusts scoring weights as priorities evolve. The most significant improvement is speed: scoring that took 15-30 minutes per complex request now takes 2-3 minutes of validation. The secondary improvement is transparency — when the scoring model is explicit and visible, stakeholders can see why their request was ranked where it was, reducing political friction by 40-50%. The risk is model ossification: if scoring weights are not updated quarterly, the model optimizes for last quarter\'s priorities.',
            painPoints: [
              'Stakeholders scrutinize automated scores more aggressively than they challenged manual prioritization — the explicitness of the model invites debate about individual scoring criteria',
              'The scoring model performs poorly on novel content types (new formats, new audiences, new competitive dynamics) because it lacks historical data for comparison',
            ],
            benchmarks: [
              'AI-assisted prioritization reduces scoring time per request from 15-30 minutes to 2-3 minutes of validation, a 5-10x efficiency gain',
              'Transparent scoring frameworks reduce stakeholder escalation requests by 40-50% because priorities are visible and evidence-based',
              'PathFactory and similar content intelligence platforms report that engagement-based scoring models predict content ROI with 60-70% accuracy (PathFactory analytics benchmarks)',
            ],
            outcomes: [
              'The Content Director can process the full weekly request volume in 2-3 hours instead of 8-12, freeing a full day per week for strategic work',
              'Resource allocation improves measurably because scoring decisions are consistent, transparent, and based on data rather than political dynamics',
              'A feedback loop emerges: content performance data feeds back into the scoring model, improving prediction accuracy over time',
            ],
            roleEvolution: 'The Content Director shifts from scorer to calibrator. The daily question changes from "what should we prioritize?" to "is our prioritization model reflecting current strategic reality?" This is a genuine seniority upgrade — the role moves from operational decision-making to system design.',
          },
          aiAgentic: {
            summary: 'Scoring runs continuously as requests enter the system. Low-priority items are routed automatically to standard production workflows. The Content Director\'s time shifts from scoring individual items to calibrating the scoring model itself and making the strategic bets the model cannot.',
            detail: 'The fully agentic scoring system operates as a continuous evaluation engine: every incoming request is scored, ranked, and routed based on strategic criteria, resource availability, and predicted ROI — without human intervention for standard categories. The Content Director defines scoring policy (weights, thresholds, routing rules) and monitors system performance through dashboards that track scoring accuracy, resource utilization, and content ROI by priority tier. Human intervention concentrates on two activities: (1) recalibrating the model quarterly to reflect strategic shifts, and (2) making allocation decisions for the 10-15% of requests where strategic ambiguity exceeds the model\'s resolution — competitive responses, executive-sponsored initiatives, and emerging opportunities that do not fit historical patterns. The system also generates strategic intelligence: patterns in request types, shifts in stakeholder priorities, and gaps between content production and business objectives that inform the Content Director\'s strategic planning.',
            painPoints: [
              'Autonomous scoring creates a "filter bubble" risk — the system optimizes for what has worked historically, potentially missing strategic pivots that require investing in unproven content types',
              'Quarterly model recalibration requires 4-8 hours of focused analysis that competes with other strategic responsibilities for calendar space',
            ],
            benchmarks: [
              'Autonomous scoring systems can evaluate and route 95%+ of standard content requests without human intervention, concentrating human judgment on the 5% where it has highest leverage',
              'Organizations with data-driven content prioritization report 15-25% improvement in content ROI compared to manual or politically-driven allocation (industry composite)',
            ],
            outcomes: [
              'Scoring becomes invisible to the Content Director for routine work — attention focuses entirely on strategic exceptions and model governance',
              'The organization gains a real-time view of content demand vs. supply, enabling proactive capacity planning rather than reactive fire-fighting',
              'The Content Director\'s strategic credibility increases because prioritization decisions are backed by transparent, data-driven models rather than perceived as subjective judgment calls',
            ],
            roleEvolution: 'The Content Director becomes a portfolio manager for content investments. The scoring system is the analytical engine; the human provides the strategic thesis that the engine cannot generate on its own. The role\'s value is measured not by throughput but by the quality of the strategic bets made on the content the model cannot score.',
          },
        },

        'brief-approval': {
          preAI: {
            summary: 'Every brief waits for the Content Director\'s personal review and approval before creative work begins — creating a bottleneck that adds 2-5 days to every campaign and forces rush requests to skip quality checks entirely.',
            detail: 'Brief approval is the pipeline\'s critical bottleneck because every brief must pass through one person\'s calendar. In a typical enterprise week, the Content Director reviews 15-25 briefs, each requiring 20-40 minutes of focused attention. The queue backs up predictably: Monday morning brings last week\'s carryover plus new requests, and by Wednesday the approval backlog has pushed campaign timelines by 2-3 days. Rush requests from senior stakeholders skip the queue entirely — producing a two-tier system where "important" briefs get fast-tracked without proper review and "normal" briefs wait. This two-tier dynamic erodes the quality function the gate is supposed to serve: the briefs most likely to need strategic scrutiny (high-visibility, politically sensitive, resource-intensive) are the ones most likely to bypass the review because of time pressure.',
            painPoints: [
              'The Content Director\'s PTO creates a complete pipeline stall — there is no backup approver with equivalent strategic context, so briefs either wait or get waved through by a proxy who cannot evaluate strategic alignment',
              'Rush approvals produce a false sense of speed: the brief gets approved in hours, but the downstream rework from missed issues costs 3-5x the time that proper review would have taken',
              'Approval fatigue is real — reviewing brief #20 of the week does not receive the same cognitive attention as brief #3, creating a quality gradient that correlates with queue position',
            ],
            benchmarks: [
              '80% of marketers experience delays getting timely feedback on content — brief approval is typically the first and most impactful delay point (Adobe Content Supply Chain Research)',
              'Each approval stage adds an average of 1+ business day to campaign timelines; with 3+ stages required, brief-to-launch cycles routinely exceed 2 weeks (WebRand 2024)',
              'Risk-based approval tiers (auto-approve low-risk, human-review high-risk) can reduce approval cycle time by 30-50% within 60-90 days of implementation (industry composite)',
            ],
            outcomes: [
              'Average brief approval time: 2-5 days in queue + 20-40 minutes of actual review — the waiting time dwarfs the review time by 10-50x',
              'Estimated 15-20% of approved briefs require revision after creative work begins, suggesting the approval review is not catching issues effectively under time pressure',
            ],
            roleEvolution: 'The Content Director at the approval gate is a bottleneck with a title. The role\'s strategic judgment is real and valuable, but the delivery mechanism (sequential personal review of every brief) ensures that judgment is diluted by volume and compressed by time pressure. The gate exists to protect quality, but its implementation actively undermines it.',
          },
          aiAgents: {
            summary: 'Pre-scored briefs arrive with risk flags, alignment scores, and historical comparisons — the Content Director approves faster because the analytical prep work is done. Approval speed doubles for standard briefs; attention concentrates on the flagged exceptions.',
            detail: 'The AI agent pre-processes each brief before it reaches the approval queue: scoring strategic alignment, flagging risk factors (regulatory exposure, brand voice deviations, resource conflicts), and attaching historical comparisons to similar past briefs (including their performance outcomes). The Content Director opens each brief with a structured summary rather than raw content, reducing review time from 20-40 minutes to 5-15 minutes for standard briefs. Flagged items receive deeper attention. The approval gate gains a data layer it previously lacked: the Content Director can see not just "what this brief proposes" but "how similar briefs have performed, what risks the model detects, and where this brief deviates from strategic guidelines." The result is faster approvals that are also better-informed — the traditional trade-off between speed and quality is partially resolved because the agent handles the analytical work that consumed most of the review time.',
            painPoints: [
              'The Content Director must learn to trust agent risk flags — early in the transition, the tendency is to duplicate the agent\'s analysis rather than building on it, negating the time savings',
              'Agent scoring can create anchoring bias: the Content Director\'s assessment of a brief is influenced by the agent\'s pre-score, potentially missing issues the agent was not trained to detect',
            ],
            benchmarks: [
              'AI-assisted approval reviews reduce per-brief review time by 50-70% for standard content types (composite from workflow automation implementations)',
              'Pre-scoring reduces approval bottleneck-induced delays from 2-5 days to same-day or next-day for 60-70% of briefs',
            ],
            outcomes: [
              'Content Director approval throughput increases 2-3x without quality degradation — the queue no longer backs up on a weekly cycle',
              'Rush requests decrease because standard approval is fast enough to meet most timelines — the two-tier system erodes',
              'Brief rejection quality improves because the Content Director can articulate specific data-backed reasons for revisions rather than general concerns',
            ],
            roleEvolution: 'The Content Director at this stage is a strategic reviewer, not a gatekeeper. The daily experience shifts from "clear the queue" to "evaluate the exceptions" — the briefs that reach focused review are genuinely ambiguous, not routine. This makes the approval function intellectually engaging again, which improves the quality of each decision.',
          },
          aiAgentic: {
            summary: 'Standard briefs auto-approve when they pass scoring thresholds. The Content Director reviews only flagged exceptions — typically 15-20% of volume — where competitive intuition, organizational politics, or strategic ambiguity exceed any scoring rubric.',
            detail: 'The fully agentic approval gate operates as a threshold-based system: briefs that score above defined thresholds on strategic alignment, brand compliance, audience fit, and resource feasibility are approved automatically and routed to creative production. The Content Director reviews only the briefs that the system flags — those below threshold, those with conflicting signals (high strategic alignment but high regulatory risk), and those involving novel content types the model has not seen before. This concentrates the Content Director\'s judgment on the decisions where human intuition has the highest marginal value over automated scoring. The critical governance challenge is threshold calibration: set them too low and the gate becomes meaningless; set them too high and the queue backs up again. Quarterly recalibration based on downstream content performance is essential.',
            painPoints: [
              'Auto-approved briefs that produce underperforming content create organizational anxiety about the gate\'s effectiveness — the Content Director must be able to demonstrate that system-approved briefs perform at least as well as manually-approved ones',
              'Some stakeholders perceive auto-approval as "no one reviewed this" rather than "the system reviewed this" — managing organizational trust in algorithmic gates requires active communication',
            ],
            benchmarks: [
              'Organizations implementing risk-based auto-approval report 30-50% reduction in total brief-to-launch cycle time (industry composite)',
              'The 15-20% of briefs requiring human review typically represent the highest-stakes content decisions — competitive responses, new market entries, executive-visibility campaigns',
            ],
            outcomes: [
              'The approval gate ceases to be a bottleneck — pipeline velocity for standard content is no longer constrained by one person\'s calendar',
              'Content Director strategic time increases dramatically because routine approvals are eliminated, not just accelerated',
              'The organization develops a data-driven understanding of what makes a brief "good" — the scoring model\'s criteria become a shared strategic vocabulary',
            ],
            roleEvolution: 'The Content Director\'s approval authority becomes more powerful by becoming more selective. Each approval decision carries more weight because it addresses a genuinely ambiguous scenario, not a routine checkpoint. The role\'s strategic credibility increases because the Content Director is visibly focused on the hardest problems, not buried in a queue.',
          },
        },

        'governance-gate': {
          preAI: {
            summary: 'The governance gate is staffed with manual reviews — checking taxonomy compliance, content standards, and regulatory requirements. Every review adds 1-3 days, and feedback arrives late enough to guarantee expensive rework.',
            detail: 'The governance gate at the pre-AI stage functions as a late-stage compliance checkpoint rather than a quality assurance mechanism. Content that has already been through creative production, editorial review, and stakeholder negotiation arrives at the gate for taxonomy and compliance verification. When issues are found — and they are found in an estimated 15-20% of submissions — the rework cost is significant: the content must cycle back through creation and review stages, consuming 2-3x the original production time. The fundamental design flaw is timing: governance catches problems too late for efficient correction. The Content Director staffs this gate with their own reviews or delegates to compliance reviewers who may not have the full strategic context, producing inconsistent enforcement.',
            painPoints: [
              'Late-stage rejections at the governance gate demoralize creative teams who invested significant effort in content that was "almost done" — the rejection feels punitive rather than protective',
              'Governance criteria are interpreted inconsistently by different reviewers, creating unpredictable outcomes that make pipeline planning unreliable',
              'The gate adds 1-3 days to the pipeline for EVERY content piece, regardless of risk level — low-risk content pays the same time tax as high-risk content',
            ],
            benchmarks: [
              'Content governance failures contribute to the 81% of companies that struggle with brand consistency across channels (Lucidpress/Marq)',
              'Late-stage compliance rejections cost 2-3x the original production time due to rework cascading through upstream stages',
              'Organizations with inconsistent governance enforcement report 20-30% higher content production costs than those with standardized, automated checks',
            ],
            outcomes: [
              'Governance adds an average of 2 days to campaign timelines — a fixed cost that applies to every piece regardless of actual risk',
              'The Content Director\'s authority at this gate is undermined by the perception that governance is a speed bump rather than a quality mechanism',
            ],
            roleEvolution: 'The Content Director at this gate feels more like a compliance officer than a strategist. The work is necessary but not intellectually engaging — it is pattern-matching against rules that should be self-enforcing, not judgment calls that require editorial expertise.',
          },
          aiAgents: {
            summary: 'Automated governance checks handle taxonomy, compliance, and standard quality criteria. The Content Director reviews only escalated exceptions — items the system flags as ambiguous or novel.',
            detail: 'AI governance agents apply the full rule set consistently to every piece of content, checking taxonomy classification, regulatory compliance, brand voice adherence, and quality thresholds before the content reaches the human gate. Most content passes automatically; the Content Director reviews only the flagged exceptions — typically 10-20% of volume — where the agent detects ambiguity, novelty, or conflicting signals. The gate becomes faster and more consistent: standard content clears in minutes rather than days, and the Content Director\'s reviews focus on items that genuinely require strategic judgment. The key improvement is not just speed but fairness — every content piece is evaluated against the same rules, eliminating the reviewer-dependent variation that characterized manual governance.',
            painPoints: [
              'False positives from the governance agent can create alert fatigue — if 30% of flags are wrong, the Content Director starts ignoring the system',
              'The transition requires comprehensive documentation of governance rules that may currently be implicit or informally understood',
            ],
            benchmarks: [
              'Automated governance checks reduce gate cycle time from 1-3 days to hours for standard content, with only flagged exceptions requiring multi-day review',
              'Consistent automated enforcement reduces late-stage rejection rates by 40-60% compared to manual review processes',
            ],
            outcomes: [
              'Governance gate throughput increases 5-10x for standard content without quality degradation',
              'The Content Director\'s governance time drops from a fixed cost per content piece to a variable cost that scales with the exception rate',
              'Creator confidence in the governance process improves because outcomes are predictable and consistent',
            ],
            roleEvolution: 'The Content Director at this gate becomes a judge rather than an inspector — handling the genuinely ambiguous cases where rules conflict, precedent is unclear, or strategic context overrides standard governance criteria.',
          },
          aiAgentic: {
            summary: 'The governance gate self-operates within defined parameters. The Content Director monitors system health and updates rules — every policy decision cascades automatically across all future content.',
            detail: 'The fully agentic governance gate is a self-operating system: content is evaluated, classified, and either cleared or flagged automatically based on the Content Director\'s codified rules. The human role is architectural — maintaining the rule set, monitoring compliance dashboards for drift (gradual degradation of governance effectiveness over time), and making precedent-setting decisions on novel scenarios that the system cannot resolve. The most powerful aspect of this model is the feedback loop: every human governance decision becomes a new rule in the system, meaning the Content Director\'s judgment compounds over time. Each exception resolved today prevents a category of similar issues from reaching the gate in the future.',
            painPoints: [
              'Rule set complexity can grow unchecked — without periodic simplification, governance rules accumulate contradictions and over-specificity that constrain creative work unnecessarily',
              'The Content Director must maintain deep familiarity with a system they rarely interact with directly — monitoring dashboards requires a different cognitive mode than hands-on review',
            ],
            benchmarks: [
              'Self-operating governance gates in mature implementations handle 90%+ of content autonomously, with human review reserved for precedent-setting decisions',
              'Rule-based governance systems that are recalibrated quarterly maintain 95%+ effectiveness; those left uncalibrated for 6+ months show measurable drift in compliance outcomes',
            ],
            outcomes: [
              'The governance gate effectively disappears from the pipeline timeline for standard content — compliance is a property of the system, not a stage in the process',
              'The Content Director\'s governance legacy is codified — their judgment lives in the system and continues to enforce standards even when they are not personally reviewing content',
            ],
            roleEvolution: 'The Content Director becomes the governance system\'s architect and custodian. The role\'s governance output is not "content reviewed" but "governance system health" — measured by exception rates, rule coverage, and the speed at which new content types are covered by the existing framework.',
          },
        },

        // ── SUPPORT NODES (agents + inputs) ─────────────────────────────

        'research-agent': {
          preAI: {
            summary: 'Research is a manual effort — the Content Director gathers audience data, competitive intelligence, and market context from multiple disconnected tools to inform brief quality.',
            detail: 'Without AI research support, the Content Director relies on marketing analytics dashboards, competitive monitoring services, social listening tools, and institutional knowledge to build the context layer for each brief. This research step is often abbreviated under time pressure, meaning briefs are written with incomplete audience data or stale competitive intelligence. The research burden falls disproportionately on the Content Director because they are the only person with enough strategic context to know what data matters.',
          },
          aiAgents: {
            summary: 'A research agent surfaces relevant audience data, competitive context, and trending topics automatically — delivering structured intelligence that the Content Director curates rather than assembles.',
            detail: 'The research agent pulls data from the CDP, competitive monitoring tools, search trend databases, and social listening platforms, delivering a structured intelligence brief for each content request. The Content Director reviews and interprets this data rather than gathering it — reducing research time from hours to minutes per brief while improving the depth and currency of the intelligence available.',
          },
          aiAgentic: {
            summary: 'Autonomous research agents continuously update the intelligence layer — the Content Director sets strategic research priorities rather than executing individual searches.',
            detail: 'Research agents proactively surface insights from market signals, audience behavior data, and competitive movements without being prompted. The Content Director defines what the system should monitor and how insights should be prioritized, then consumes structured intelligence feeds rather than conducting ad hoc research. The most valuable output at this stage is not individual data points but pattern detection: emerging topics, shifting audience needs, and competitive moves that create content opportunities.',
          },
        },

        'writer-agent': {
          preAI: {
            summary: 'Content creation depends entirely on human writers — the Content Director manages a team of writers whose output quality varies with bandwidth, expertise, and brief clarity.',
            detail: 'Without AI writing support, the Content Director oversees a team of human writers who produce all content from scratch. Output quality is directly correlated to brief quality and writer availability — when the team is stretched thin, quality drops. The Content Director spends significant time reviewing drafts, providing feedback, and managing revision cycles that stem from unclear briefs or writer-brief misalignment.',
          },
          aiAgents: {
            summary: 'AI writing agents produce first drafts with brand voice and audience alignment embedded, reducing the creative team\'s production burden and the Content Director\'s revision cycles.',
            detail: 'Writer agents generate first drafts that are 60-70% of final quality, allowing human writers to focus on strategic refinement, creative differentiation, and nuanced messaging rather than blank-page production. The Content Director\'s revision cycles decrease because AI-drafted content arrives pre-aligned with brand voice, audience data, and strategic guidelines. The human writer\'s role shifts from producer to editor and creative enhancer.',
          },
          aiAgentic: {
            summary: 'Autonomous writing agents handle routine content production end-to-end — human writers concentrate on high-stakes, creatively demanding content where AI output lacks the strategic edge or emotional nuance the brand requires.',
            detail: 'Writing agents produce publication-ready content for standard content types (social posts, email variations, SEO content, product descriptions) autonomously. Human writers are reserved for content that requires original thinking, emotional nuance, or strategic positioning that AI cannot reliably produce. The Content Director manages this human-AI workforce allocation as a strategic decision: which content types benefit from human authorship, and which are adequately served by AI production.',
          },
        },

        'content-strategy': {
          preAI: {
            summary: 'The content strategy document is a static artifact — updated quarterly at best, referenced inconsistently, and disconnected from day-to-day content production decisions.',
            detail: 'Content strategy exists as a PowerPoint deck or Google Doc that the Content Director updates periodically and references when writing briefs. It informs high-level direction but is rarely consulted by the broader team during production. The gap between strategic intent and execution widens throughout each quarter as market conditions change but the strategy document does not.',
          },
          aiAgents: {
            summary: 'AI tools surface strategy-relevant data (audience shifts, competitive moves, performance trends) that keep the content strategy current — the Content Director updates strategic direction based on live signals rather than quarterly reviews.',
            detail: 'The content strategy becomes a living document because AI tools continuously surface data that challenges or confirms strategic assumptions. The Content Director incorporates audience behavior shifts, competitive content analysis, and performance data into strategic updates at a much higher frequency — monthly or bi-weekly rather than quarterly. The strategy document becomes a dynamic artifact that the team references actively because it reflects current reality.',
          },
          aiAgentic: {
            summary: 'Autonomous strategy agents monitor market signals and recommend strategic adjustments — the Content Director curates strategic direction from AI-generated recommendations rather than building it from scratch.',
            detail: 'Strategy agents analyze audience data, competitive signals, and content performance to generate recommended strategic adjustments: emerging topics to pursue, declining themes to deprioritize, audience segments showing new patterns, and competitive gaps that represent content opportunities. The Content Director evaluates these recommendations against organizational priorities and competitive positioning to make strategic decisions that the AI cannot. The strategy document updates itself with AI-generated data and awaits the Content Director\'s strategic interpretation.',
          },
        },

        'audience-personas': {
          preAI: {
            summary: 'Audience personas are workshop artifacts — created during annual planning, based on assumptions and limited data, and increasingly disconnected from actual audience behavior as the year progresses.',
            detail: 'Personas were built during a strategy offsite using a mix of sales team anecdotes, survey data, and market research. They capture demographic and psychographic profiles but rarely reflect behavioral patterns or evolving needs. The Content Director references personas during brief writing but knows they are approximations — the real audience understanding lives in the Content Director\'s accumulated experience, not in the persona documents.',
          },
          aiAgents: {
            summary: 'AI-enriched personas incorporate CDP behavioral data and content engagement patterns — giving the Content Director evidence-based audience intelligence that updates with real usage data.',
            detail: 'Persona profiles are enriched by AI agents that analyze CDP data, content engagement patterns, search behavior, and conversion paths. The Content Director works with personas that reflect how the audience actually behaves, not how the organization assumed they would. This data-enriched view improves brief quality because audience needs are grounded in evidence rather than assumptions.',
          },
          aiAgentic: {
            summary: 'Autonomous persona agents maintain living audience models that update continuously from behavioral data — the Content Director sets segmentation strategy while the system maintains accuracy.',
            detail: 'Personas become living models that evolve with real-time behavioral data. Autonomous agents detect audience segment shifts (emerging needs, declining engagement, new behavioral patterns) and update persona profiles automatically. The Content Director curates the segmentation framework — defining which segments matter strategically and how content should be differentiated across them — while the system maintains the factual accuracy of each profile.',
          },
        },

        'scoring-matrix': {
          preAI: {
            summary: 'The scoring matrix is a spreadsheet with weighted criteria that the Content Director maintains manually — applied inconsistently and rarely updated to reflect changing strategic priorities.',
            detail: 'The scoring matrix defines the criteria by which content requests are prioritized: strategic alignment, audience value, resource requirements, and estimated ROI. It exists as a spreadsheet or document that the Content Director references during scoring, but its criteria are not systematically applied to every request, and updates happen reactively (when a high-profile misallocation is noticed) rather than proactively.',
          },
          aiAgents: {
            summary: 'AI operationalizes the scoring matrix — applying criteria consistently to every request and providing data-backed scoring that the Content Director validates rather than manually calculates.',
            detail: 'The scoring matrix becomes an automated evaluation engine that the AI agent applies to every incoming request. Criteria weights are explicit and visible, scoring is consistent across all requests, and the Content Director validates edge cases rather than manually calculating scores. The matrix also gains a feedback loop: content performance data is matched to initial scores, allowing the Content Director to see which scoring criteria actually predict success.',
          },
          aiAgentic: {
            summary: 'Autonomous scoring agents continuously optimize the matrix based on content performance data — the Content Director sets strategic priorities and the system learns which criteria best predict content ROI.',
            detail: 'The scoring matrix becomes a self-improving model that learns from content performance data. Autonomous agents adjust criteria weights based on what actually predicts content success, surfacing recommendations for the Content Director to approve. The Content Director\'s role shifts from maintaining the matrix to governing it — approving model changes, overriding recommendations when strategic context exceeds the model\'s data, and ensuring the scoring criteria reflect current organizational priorities.',
          },
        },
      },
      keyInsight: 'Brief approval is where strategic judgment has the highest leverage — and the highest bottleneck cost. Organizations that automate this gate discover that competitive intuition cannot be reduced to a scoring rubric, but 80% of the decisions that currently require it actually do not. The Content Director\'s value concentrates when volume disperses.',
    },
  },


  // ═══════════════════════════════════════════════════════════════════════════
  // ROLE 2: BRAND MANAGER
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'brand-manager',
    title: 'Brand Manager',
    description: 'Reviews content for brand compliance and can escalate to stakeholder sign-off. The immune system of organizational identity — catching inconsistencies before they reach the market.',
    tagline: 'Guards tone, voice, and identity — the 20% of decisions that require human expertise.',
    iconName: 'ShieldCheck',
    category: 'governance',
    accentColor: '#D4856A',
    ownedSteps: ['brand-compliance'],
    reviewedGates: ['brand-review'],
    relatedAgents: ['writer-agent'],
    relatedInputs: ['brand-guide'],
    narrative: {
      stageOverviews: {
        preAI: {
          narrative: 'Brand management is manual gatekeeping. A single person reviews every piece of copy, every design asset, every customer touchpoint. Speed is impossible; consistency is inconsistent because no human can hold 40 brand rules perfectly in working memory across dozens of reviews daily.',
          timeAllocation: '68% routine compliance checks, 20% exception handling, 8% strategic guidance, 4% training and escalation',
          criticalMetrics: ['Review turnaround time (currently 2-5 days)', 'Brand consistency score across digital properties (typically 45-60%)', 'Number of brand violations caught post-launch', 'Time spent on routine vs. strategic decisions', 'Stakeholder satisfaction with brand enforcement'],
          strategicOpportunity: 'Build a documented framework that captures what "brand compliance" actually means — not just the rules, but the judgment calls that separate "close enough" from "unacceptable." This framework becomes the blueprint for AI augmentation.',
        },
        aiAgents: {
          narrative: 'AI tools (Acrolinx, Writer, custom classifiers) take the rote work off the Brand Manager\'s desk. They flag tone violations, style drift, template misuse, and forbidden word lists. The Brand Manager reviews machine-flagged exceptions rather than everything. The tooling is competent but domain-naive: it catches what is easy to measure.',
          timeAllocation: '48% managing AI exceptions, 24% training and tuning models, 18% strategic guidance, 10% novel brand issues',
          criticalMetrics: ['AI precision on routine compliance (70-80% of checks automated)', 'False positive rate requiring manual review', 'Time savings per review cycle', 'Brand consistency improvement (typically 65-75%)', 'Cost per compliance check (down 40-60%)'],
          strategicOpportunity: 'Use the bandwidth freed by automation to build a brand context library — documented examples of cultural sensitivity, competitor positioning, and emerging trend response. This becomes institutional knowledge that survives team turnover.',
        },
        aiAgentic: {
          narrative: 'AI agents deeply understand brand context and can reason about ambiguity. They explain their decisions, suggest revisions, or escalate only when judgment calls require cultural or competitive sensitivity. The Brand Manager becomes a director of brand interpretation rather than an inspector of compliance.',
          timeAllocation: '15% reviewing escalated edge cases, 25% brand strategy evolution, 30% competitive brand analysis, 20% cultural sensitivity and trend monitoring, 10% system governance',
          criticalMetrics: ['Brand consistency score (target: 90%+)', 'Autonomous resolution rate (target: 85%+)', 'Time to market for brand-compliant content', 'Escalation quality (signal vs. noise)', 'Post-launch brand violation rate (target: <2%)'],
          strategicOpportunity: 'With operational brand enforcement automated, the Brand Manager\'s role evolves from defensive (preventing violations) to offensive (shaping brand evolution, monitoring competitive positioning, and building cultural relevance). This is the difference between brand management and brand leadership.',
        },
      },
      nodeJourneys: {
        'brand-compliance': {
          preAI: {
            summary: 'Every content piece is manually reviewed against brand guidelines for tone, terminology, visual consistency, and messaging alignment. The Brand Manager processes 20-40 reviews per week, with most surfacing no issues — the role is largely routine compliance checking that masks the 20% of decisions requiring genuine expertise.',
            detail: 'Brand compliance at scale is a consistency problem. The Brand Manager checks content against a brand guide that specifies tone, voice, visual standards, and messaging pillars. But "on-brand" is not binary — it is a spectrum of judgment calls that depend on audience, channel, context, and competitive positioning. A phrase that works on LinkedIn may violate brand voice on a product page. Visual consistency across 8+ channels requires pattern recognition that degrades with fatigue. The real cost is not the time spent reviewing — it is the inconsistency that results from human cognitive limits. Companies with high brand consistency achieve 2.4x higher average growth rates than inconsistent competitors, making the Brand Manager\'s accuracy directly tied to revenue.',
            painPoints: [
              'Brand guidelines live in a 50-100 page document that no one reads end-to-end; reviewers develop personal mental models that diverge from each other over time',
              'Review turnaround of 2-5 days creates scheduling bottlenecks that pressure teams to skip brand review on "low-risk" content — which is where brand drift actually starts',
              '81% of companies struggle with maintaining brand consistency across channels, suggesting the manual review model has structural limits (Lucidpress/Marq)',
              'Post-launch brand violations are 3-5x more expensive to fix than pre-launch catches due to audience exposure and coordination costs',
            ],
            benchmarks: [
              '81% of companies struggle with maintaining brand consistency across channels (Marq Brand Consistency Report)',
              'Companies with high brand consistency achieve 2.4x higher average growth rates (Marq 2021)',
              '32% of customers leave after a single bad brand experience (PwC / Marq composite)',
            ],
            outcomes: [
              'Brand consistency score across digital properties: typically 45-60% without AI augmentation',
              'Review cycle adds 2-5 business days to content timeline per piece',
              'Post-launch brand violations: 5-10% of published content (estimated, often uncaught)',
            ],
            roleEvolution: 'The Brand Manager is an inspector on an assembly line. Expertise is exercised in the margins between reviews, not during them. The most common failure mode is approval fatigue: after reviewing 30 pieces, the 31st gets less scrutiny regardless of its risk level.',
          },
          aiAgents: {
            summary: 'An AI agent pre-scans content for brand voice scores, terminology violations, and visual consistency before it reaches the Brand Manager. 70-80% of routine checks are automated, reducing the queue to exception-only reviews and cutting turnaround from days to hours.',
            detail: 'AI brand compliance tools (Acrolinx, Writer, custom classifiers) score content against brand guidelines in real-time. They check tone against a trained voice model, flag forbidden terminology, detect messaging drift from approved pillars, and validate visual assets against brand templates. The Brand Manager receives a pre-screened queue: content that passed automated checks moves forward without review; content flagged for exceptions requires human judgment. The critical shift is from "review everything" to "review the interesting cases." The Brand Manager\'s judgment concentrates on ambiguous situations: a campaign that deliberately pushes brand boundaries for a new audience, content that responds to a competitor\'s messaging in a way that requires tonal calibration, or culturally sensitive content where automated tools lack context.',
            painPoints: [
              'AI brand tools are competent at detecting what is easy to measure (word choice, tone score, template adherence) but blind to what is hard to measure (cultural appropriateness, competitive positioning, audience resonance)',
              'False positives consume Brand Manager time without adding value — flagging content as "off-brand" when it is deliberately pushing boundaries for strategic reasons',
              'Training the AI model requires explicit articulation of implicit brand rules — many Brand Managers discover they cannot document the judgment calls they make intuitively',
            ],
            benchmarks: [
              'AI brand compliance tools automate 70-80% of routine checks (Writer/Acrolinx benchmarks 2024)',
              'Brand consistency score improves to 65-75% with AI-augmented review (industry composite)',
              'Review turnaround drops from 2-5 days to same-day for AI-cleared content (Writer case studies)',
            ],
            outcomes: [
              'Brand Manager review queue drops by 70-80%, focusing on genuinely ambiguous cases',
              'Brand consistency improves to 65-75% as automated checks apply standards uniformly',
              'Cost per compliance check drops 40-60% while throughput increases 3-5x',
            ],
            roleEvolution: 'The Brand Manager shifts from inspector to calibrator. The daily work changes from "read everything and check" to "tune the model, review exceptions, and handle the judgment calls that AI cannot." The most important new skill is understanding what the AI gets wrong and why.',
          },
          aiAgentic: {
            summary: 'Brand compliance becomes a continuous system property, not a batch review step. Agents enforce brand rules during content creation, not after — catching violations before content is even drafted. The Brand Manager defines rules, handles edge cases involving cultural sensitivity and competitive positioning, and evolves the brand as a living system.',
            detail: 'Agentic brand compliance operates at the point of creation: when a writer or AI drafts content, brand agents evaluate it in real-time and suggest corrections before the draft is complete. Visual assets are checked against brand templates as they are created. The agentic layer understands context — a social media post for Gen Z can use casual tone that would violate brand guidelines for an enterprise whitepaper. The Brand Manager intervenes only on genuinely novel situations: a new market entry requiring brand voice adaptation, a crisis communication that demands tonal recalibration, or a competitive response where the brand\'s positioning relative to a rival must be hand-crafted. The key challenge at this stage is brand evolution: with compliance automated, the Brand Manager\'s value shifts from enforcement to strategy — shaping how the brand adapts to new audiences, cultural shifts, and competitive dynamics.',
            painPoints: [
              'Automated brand enforcement at the creation stage requires deep integration with content creation tools — many legacy workflows resist this integration',
              'The Brand Manager must resist the urge to review content that the system has already cleared — selective oversight requires trust',
              'Brand evolution (adapting the brand to new markets, audiences, or cultural contexts) requires strategic judgment that no model can replicate — if the Brand Manager focuses only on enforcement governance, the brand stagnates',
            ],
            benchmarks: [
              'Agentic brand enforcement achieves 90%+ consistency across channels (industry target for mature deployments)',
              'Post-launch brand violation rate drops to <2% (vs. 5-10% with manual review)',
              'Brand compliance cost per content piece approaches near-zero for standard content types (industry composite)',
            ],
            outcomes: [
              'Brand consistency reaches 90%+ across all channels and content types',
              'Content-to-market time for brand-compliant content drops by 60-70% vs. manual review',
              'Brand Manager time shifts from enforcement (was 68%) to strategic brand evolution (now 55%+)',
            ],
            roleEvolution: 'The Brand Manager becomes a brand strategist and cultural interpreter. Their most important activities are: (1) evolving the brand voice for new audiences and channels, (2) monitoring competitive brand positioning and recommending responses, (3) governing the agentic enforcement system to ensure it reflects current brand strategy, and (4) handling the genuinely novel edge cases where cultural sensitivity, competitive dynamics, or organizational politics require human judgment.',
          },
        },
        'brand-review': {
          preAI: {
            summary: 'Brand review is a formal gate where the Brand Manager evaluates content against brand standards before publication. Reviews are batched weekly, creating bottlenecks that pressure teams to submit late or skip review entirely on "safe" content.',
            detail: 'The brand review gate is where content quality is formally assessed against brand standards. The Brand Manager reads each piece, evaluates tone, messaging, visual consistency, and audience appropriateness. Feedback is delivered via comments in a shared document or approval tool. The gate adds 2-5 days to the content timeline and is often the single largest scheduling bottleneck in the pipeline.',
            painPoints: [
              'Batch review creates feast-or-famine cycles: nothing to review for days, then 15 pieces due Friday',
              'Feedback loops are slow; by the time revisions are made, the creator has moved on to other projects',
              'Teams learn to avoid the gate by classifying content as "low-risk" when it is not',
            ],
            benchmarks: [
              'Average brand review cycle: 2-5 business days (industry average)',
              'Content that bypasses brand review has 3x higher brand violation rate (industry estimate)',
            ],
            outcomes: [
              'Brand review catches 70-80% of violations before publication',
              'But review bottleneck causes 15-20% of content to skip the gate entirely',
            ],
            roleEvolution: 'The Brand Manager spends 60%+ of time on formal review activities that add days to the timeline. Strategic brand work (evolution, competitive positioning) is deferred to quarterly planning.',
          },
          aiAgents: {
            summary: 'AI pre-screening automates the brand review gate for routine content. Only flagged exceptions reach the Brand Manager, reducing the gate from a multi-day bottleneck to a same-day decision point for edge cases.',
            detail: 'The brand review gate splits into two lanes: AI-cleared content flows through automatically with a compliance score logged; AI-flagged content enters the Brand Manager\'s review queue with specific violation indicators. The Brand Manager reviews only the flagged items, focusing on the judgment calls the AI cannot make.',
            painPoints: [
              'Splitting the gate into two lanes requires clear thresholds — too strict and everything gets flagged; too lenient and violations pass through',
              'The Brand Manager must validate that AI-cleared content actually meets standards via periodic audits',
            ],
            benchmarks: [
              'AI-augmented brand review reduces gate time to same-day for 70-80% of content (Writer/Acrolinx)',
              'Flagged-exception review takes 5-10 minutes per item vs. 15-20 minutes for full review',
            ],
            outcomes: [
              'Brand review gate time drops from 2-5 days to same-day for most content',
              'No content bypasses the gate because automated review is instant and non-blocking',
              'Brand Manager reviews 5-10 escalated items per week instead of 20-40 full reviews',
            ],
            roleEvolution: 'The Brand Manager shifts from gate operator to gate architect. They define the scoring thresholds, audit AI decisions periodically, and handle the exception queue.',
          },
          aiAgentic: {
            summary: 'The brand review gate self-operates within Brand Manager-defined parameters. Content is evaluated during creation, not after — violations are prevented rather than caught. The Brand Manager monitors drift and updates rules as brand strategy evolves.',
            detail: 'Agentic brand review embeds in the content creation workflow. Brand agents evaluate content as it is being written, flagging issues in real-time and suggesting corrections. The formal gate becomes a verification step rather than a discovery step — most content arrives brand-compliant because violations were caught during creation. The Brand Manager sets the rules, monitors system performance, and handles the rare escalations where cultural or competitive context requires human judgment.',
            painPoints: [
              'Embedding brand review in the creation workflow requires content creators to accept real-time AI feedback — organizational change management is required',
              'The Brand Manager must balance enforcement rigor with creative freedom — too strict and the system kills creative risk-taking',
            ],
            benchmarks: [
              'Pre-creation brand enforcement prevents 90%+ of violations before the formal gate (industry composite)',
              'Brand review gate cycle time: near-zero for compliant content; <4 hours for escalated items (Salesforce Agentforce 2025)',
            ],
            outcomes: [
              'Brand violations at publication drop to <2% of all content',
              'Content-to-market time improves 60-70% as the brand gate is no longer a scheduling bottleneck',
              'Brand Manager spends <5 hours per week on formal review activities; remainder is strategic brand work',
            ],
            roleEvolution: 'The Brand Manager becomes a brand evolution strategist. Enforcement is automated; the human role concentrates on adapting the brand to new markets, audiences, and competitive dynamics.',
          },
        },

        // ── SUPPORT NODES ────────────────────────────────────────────────
        'writer-agent': {
          preAI: {
            summary: 'Content is created entirely by human writers with varying skill levels and brand familiarity.',
            detail: 'Writers produce drafts that the Brand Manager must review for brand compliance. Quality variance across writers is the primary driver of review volume.',
          },
          aiAgents: {
            summary: 'AI writing agents produce brand-voice-aligned first drafts, reducing the Brand Manager\'s review burden by 50-60%.',
            detail: 'Writer agents are trained on the brand guide and produce drafts that are pre-aligned with brand voice and style. This reduces brand review catch rates and allows the Brand Manager to focus on nuanced judgment calls.',
          },
          aiAgentic: {
            summary: 'Autonomous writing agents produce brand-compliant content end-to-end, with real-time brand enforcement during drafting.',
            detail: 'Writer agents integrate with brand compliance agents to produce content that meets brand standards by construction. The Brand Manager\'s review burden drops to near-zero for standard content types.',
          },
        },
        'brand-guide': {
          preAI: {
            summary: 'A static PDF or document that specifies brand voice, visual standards, and messaging pillars — referenced manually during reviews.',
            detail: 'The brand guide is a reference document that the Brand Manager consults during reviews. It is updated annually or less frequently, and may not reflect current brand evolution.',
          },
          aiAgents: {
            summary: 'The brand guide becomes a machine-readable asset that AI compliance tools reference during automated checks.',
            detail: 'Brand guidelines are encoded into AI compliance tools as scoring rubrics, word lists, and tone models. Updates to the guide are reflected in AI behavior within hours.',
          },
          aiAgentic: {
            summary: 'The brand guide evolves into a living system that updates based on brand performance data and competitive positioning.',
            detail: 'The brand guide is maintained as a dynamic knowledge base that agentic systems reference in real-time. Brand Manager updates are cascaded to all AI agents immediately.',
          },
        },

        'receive-request': {
          preAI: {
            summary: 'You protect incoming requests manually, sorting through emails and Slack messages for brand consistency.',
            detail: 'Requests arrive in inconsistent formats with no standard intake process. You spend hours triaging and clarifying scope before brand consistency can even begin.',
          },
          aiAgents: {
            summary: 'An AI intake agent structures requests and flags brand consistency implications before they reach your queue.',
            detail: 'Requests arrive pre-categorized with brand consistency signals highlighted. You validate and prioritize rather than manually parsing raw inputs.',
          },
          aiAgentic: {
            summary: 'Autonomous intake agents triage, validate, and route requests with brand consistency logic — you govern exceptions.',
            detail: 'Agentic intake handles end-to-end request processing with your brand consistency rules embedded. You set policies and review escalations while routine requests flow automatically.',
          },
        },
        'research-insights': {
          preAI: {
            summary: 'You gather audience and market research manually, compiling data from multiple sources for brand consistency.',
            detail: 'Research is scattered across tools, reports, and tribal knowledge. Building a complete picture for brand consistency takes days and the data is often stale by the time you use it.',
          },
          aiAgents: {
            summary: 'AI research tools surface audience and market data relevant to your brand consistency needs automatically.',
            detail: 'Research agents pull relevant data from multiple sources and present brand consistency insights in a structured format. You curate and interpret rather than gather.',
          },
          aiAgentic: {
            summary: 'Autonomous research agents continuously update brand consistency intelligence — you set the strategic lens.',
            detail: 'Research agents proactively surface brand consistency insights from market signals, audience data, and competitive movements. You shape research priorities, not execute searches.',
          },
        },
        'write-brief': {
          preAI: {
            summary: 'You wait for briefs written by hand, often lacking the brand consistency detail you need.',
            detail: 'Briefs arrive incomplete or misaligned with your brand consistency requirements. You spend cycles requesting revisions and clarifying expectations before work can proceed.',
          },
          aiAgents: {
            summary: 'AI drafts briefs with brand consistency requirements pre-populated from templates and past projects.',
            detail: 'Brief generation agents pull your brand consistency requirements into structured templates. You review and refine rather than starting from a blank page.',
          },
          aiAgentic: {
            summary: 'Autonomous agents generate complete briefs with brand consistency alignment built in — you approve strategy.',
            detail: 'Brief agents produce publication-ready briefs that embed your brand consistency requirements from historical patterns. You govern strategic direction rather than reviewing drafts.',
          },
        },
        'draft-content': {
          preAI: {
            summary: 'You review drafts created entirely by hand, checking each one for alignment with brand consistency.',
            detail: 'First drafts vary wildly in quality and brand consistency alignment. You often send content back for multiple revision cycles, creating bottlenecks in the pipeline.',
          },
          aiAgents: {
            summary: 'AI generates first drafts with brand consistency guidelines embedded, reducing your revision cycles.',
            detail: 'Drafting agents produce content aligned with your brand consistency standards from the start. You focus on strategic refinement rather than basic corrections.',
          },
          aiAgentic: {
            summary: 'Autonomous drafting agents produce content meeting brand consistency standards — you set creative direction.',
            detail: 'Drafting agents generate content that passes your brand consistency criteria automatically. You focus on strategic vision and creative differentiation rather than quality control.',
          },
        },
        'seo-optimization': {
          preAI: {
            summary: 'SEO optimization is manual and disconnected from your brand consistency priorities.',
            detail: 'Keyword research and meta optimization happen separately from your brand consistency workflow. You rarely see SEO data until after content is already in review.',
          },
          aiAgents: {
            summary: 'AI SEO tools optimize content while preserving your brand consistency priorities.',
            detail: 'SEO agents suggest keywords and meta improvements that align with your brand consistency goals. You approve optimizations rather than manually researching keywords.',
          },
          aiAgentic: {
            summary: 'Autonomous SEO agents optimize continuously within brand consistency boundaries — you define the strategy.',
            detail: 'SEO agents self-optimize content based on real-time search signals and your brand consistency guardrails. You set strategic keywords and constraints, not individual page optimizations.',
          },
        },
        'final-edit': {
          preAI: {
            summary: 'Final edits depend entirely on editor availability, blocking your brand consistency timelines.',
            detail: 'A single editor bottleneck means content waits in queue. Your brand consistency deadlines slip because there is no way to parallelize the final polish step.',
          },
          aiAgents: {
            summary: 'AI editing assistants handle mechanical fixes, freeing your brand consistency focus for strategic polish.',
            detail: 'Editing agents catch grammar, style, and consistency issues automatically. Your brand consistency perspective is reserved for nuance and narrative quality.',
          },
          aiAgentic: {
            summary: 'Autonomous editing agents polish content to publication standard — your brand consistency bar is encoded as policy.',
            detail: 'Editing agents handle all mechanical and stylistic refinement autonomously. Your brand consistency standards are embedded as editorial policies that improve with each iteration.',
          },
        },
        'schedule-publish': {
          preAI: {
            summary: 'Publishing is a manual CMS process with no connection to your brand consistency planning.',
            detail: 'Each piece requires manual scheduling, metadata entry, and CMS configuration. Your brand consistency goals are disconnected from the publish timeline.',
          },
          aiAgents: {
            summary: 'AI scheduling agents suggest optimal publish timing based on brand consistency data.',
            detail: 'Publishing agents recommend times and configurations informed by your brand consistency priorities. You approve the schedule rather than manually configuring CMS settings.',
          },
          aiAgentic: {
            summary: 'Autonomous publishing agents manage scheduling end-to-end using brand consistency optimization logic.',
            detail: 'Publishing agents handle CMS configuration, timing optimization, and deployment autonomously within your brand consistency constraints. You set publishing policies, not individual schedules.',
          },
        },
        'distribute': {
          preAI: {
            summary: 'Content distribution is manual channel-by-channel, with limited visibility into brand consistency.',
            detail: 'Each channel requires separate formatting, scheduling, and posting. There is no unified view of how distribution supports your brand consistency objectives.',
          },
          aiAgents: {
            summary: 'AI distribution agents adapt content per channel with brand consistency rules built in.',
            detail: 'Distribution agents format and deploy content across channels following your brand consistency guidelines. You monitor and adjust rather than manually posting to each platform.',
          },
          aiAgentic: {
            summary: 'Autonomous distribution agents manage all channels with brand consistency rules — you govern the playbook.',
            detail: 'Distribution agents deploy, adapt, and optimize content across every channel following your brand consistency playbook. You evolve distribution strategy, not execute individual channel posts.',
          },
        },
        'track-performance': {
          preAI: {
            summary: 'Performance tracking is fragmented across tools, making brand consistency assessment difficult.',
            detail: 'You pull data from analytics dashboards, social platforms, and CRM separately. Building a complete picture for brand consistency requires manual data stitching.',
          },
          aiAgents: {
            summary: 'AI dashboards surface brand consistency metrics in real time without manual data pulling.',
            detail: 'Performance agents aggregate data and highlight the brand consistency signals that matter to you. You analyze trends rather than building dashboards from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous tracking agents monitor brand consistency metrics continuously and trigger alerts and actions.',
            detail: 'Performance agents stream brand consistency data and automatically trigger optimization workflows when thresholds are breached. You define KPIs and review strategic implications.',
          },
        },
        'generate-report': {
          preAI: {
            summary: 'Reports are built manually in spreadsheets, often missing the brand consistency metrics you need.',
            detail: 'Report creation takes hours of data gathering and formatting. The metrics that matter for brand consistency are often buried or missing entirely from standard templates.',
          },
          aiAgents: {
            summary: 'AI generates reports with brand consistency metrics pre-formatted and insights highlighted.',
            detail: 'Reporting agents compile your brand consistency data into structured templates with automated analysis. You add strategic narrative rather than wrangling data.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce brand consistency reports on demand with strategic recommendations.',
            detail: 'Reporting agents generate brand consistency analyses with actionable recommendations automatically. You consume insights and set strategic direction rather than producing reports.',
          },
        },
        'optimize': {
          preAI: {
            summary: 'Content optimization is reactive and slow, with limited connection to brand consistency data.',
            detail: 'Optimization decisions rely on gut feel and delayed data. Your brand consistency insights rarely feed back into content updates in a timely way.',
          },
          aiAgents: {
            summary: 'AI recommends optimizations based on brand consistency signals and historical performance.',
            detail: 'Optimization agents suggest specific changes tied to your brand consistency metrics. You approve and prioritize recommendations rather than diagnosing issues manually.',
          },
          aiAgentic: {
            summary: 'Autonomous optimization agents improve content continuously using brand consistency signals — you set boundaries.',
            detail: 'Optimization agents test, iterate, and improve content based on brand consistency data within your guardrails. You define acceptable ranges and review significant changes.',
          },
        },
        'brief-approval': {
          preAI: {
            summary: 'Brief approvals are bottlenecked by manual review cycles that delay your brand consistency work.',
            detail: 'You wait for briefs to pass through approval chains before your brand consistency tasks can begin. Unclear approval criteria mean briefs bounce back and forth repeatedly.',
          },
          aiAgents: {
            summary: 'AI pre-screens briefs for brand consistency alignment, routing only exceptions to you.',
            detail: 'Approval agents check briefs against your brand consistency criteria and flag gaps. You review flagged items rather than reading every brief end to end.',
          },
          aiAgentic: {
            summary: 'Autonomous approval agents clear standard briefs and escalate only brand consistency exceptions to you.',
            detail: 'Approval agents validate briefs against your brand consistency criteria and auto-approve routine requests. You handle strategic exceptions and edge cases only.',
          },
        },
        'quality-check': {
          preAI: {
            summary: 'Quality checks are inconsistent manual reviews with no standard brand consistency criteria.',
            detail: 'Quality varies by reviewer and day. There is no automated baseline for readability, accuracy, or brand consistency alignment, leading to uneven content standards.',
          },
          aiAgents: {
            summary: 'AI quality gates enforce baseline standards, letting you focus on brand consistency nuance.',
            detail: 'Quality agents score readability, accuracy, and SEO automatically. Your brand consistency evaluation focuses on strategic alignment rather than mechanical checks.',
          },
          aiAgentic: {
            summary: 'Autonomous quality agents enforce standards continuously — brand consistency baselines are self-maintaining.',
            detail: 'Quality agents apply and evolve quality standards based on your brand consistency benchmarks. You set quality policies that the system enforces and improves over time.',
          },
        },
        'stakeholder-signoff': {
          preAI: {
            summary: 'Stakeholder sign-off is a bottleneck where executives delay your brand consistency timelines.',
            detail: 'Senior approvers are busy and unresponsive. Your brand consistency work stalls while waiting for sign-off, and last-minute changes create downstream chaos.',
          },
          aiAgents: {
            summary: 'AI prepares sign-off packages with brand consistency summaries for faster executive approval.',
            detail: 'Sign-off agents compile context, changes, and brand consistency impact assessments for approvers. Executives review structured summaries rather than raw content.',
          },
          aiAgentic: {
            summary: 'Autonomous agents handle routine sign-offs within brand consistency parameters — executives approve strategy only.',
            detail: 'Sign-off agents clear content that meets all brand consistency criteria automatically. Executives only review strategic pivots or high-risk content that breaches defined thresholds.',
          },
        },
        'performance-review': {
          preAI: {
            summary: 'Performance reviews are infrequent manual assessments that underserve your brand consistency needs.',
            detail: 'Reviews happen quarterly at best, using outdated data. Your brand consistency perspective is often missing from the evaluation criteria entirely.',
          },
          aiAgents: {
            summary: 'AI evaluates content against KPIs and highlights brand consistency trends for your review.',
            detail: 'Review agents surface performance data with brand consistency context pre-attached. You make optimize/archive decisions based on structured analysis rather than raw metrics.',
          },
          aiAgentic: {
            summary: 'Autonomous review agents evaluate and act on performance with brand consistency logic — you set the framework.',
            detail: 'Review agents continuously assess content against your brand consistency KPIs and trigger optimize/refresh/archive workflows automatically. You define the evaluation framework.',
          },
        },
        'social-listening': {
          preAI: {
            summary: 'Social listening is ad hoc keyword monitoring with no systematic link to brand consistency.',
            detail: 'You check social platforms manually for relevant conversations. Insights rarely reach your brand consistency workflow before they become stale or irrelevant.',
          },
          aiAgents: {
            summary: 'AI monitoring tools surface trending topics and sentiment relevant to brand consistency in real time.',
            detail: 'Listening agents track conversations and flag brand consistency signals across platforms. You act on curated insights rather than monitoring feeds manually.',
          },
          aiAgentic: {
            summary: 'Autonomous listening agents track and respond to brand consistency signals across all platforms in real time.',
            detail: 'Listening agents monitor social channels and proactively surface brand consistency opportunities and risks. You set monitoring priorities and review strategic findings.',
          },
        },
        'visual-asset-creation': {
          preAI: {
            summary: 'Visual asset creation is a slow design queue disconnected from your brand consistency needs.',
            detail: 'Design requests go into a backlog with unclear priorities. Your brand consistency requirements are often lost in translation between brief and final asset.',
          },
          aiAgents: {
            summary: 'AI design tools generate asset options aligned with brand consistency requirements.',
            detail: 'Design agents produce visual variants following your brand consistency guidelines. You select and refine from AI-generated options rather than directing from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous design agents produce visual assets within brand consistency guidelines — you set creative direction.',
            detail: 'Design agents generate publication-ready visuals following your brand consistency standards. You define the creative vision and approve hero assets while routine visuals ship autonomously.',
          },
        },
        'legal-review': {
          preAI: {
            summary: 'Legal review is an opaque process that creates unpredictable delays in your brand consistency work.',
            detail: 'Legal feedback arrives late with minimal context. You cannot predict how long review will take, making brand consistency planning unreliable.',
          },
          aiAgents: {
            summary: 'AI legal screening flags compliance risks early, reducing brand consistency surprises downstream.',
            detail: 'Legal agents pre-scan content for regulatory issues and brand consistency risks. You get early warnings rather than discovering problems at the sign-off stage.',
          },
          aiAgentic: {
            summary: 'Autonomous legal agents clear routine content and escalate only true brand consistency risks to human counsel.',
            detail: 'Legal agents scan and clear standard content autonomously using your brand consistency rule framework. Human lawyers handle novel risk scenarios and precedent-setting decisions only.',
          },
        },
        'accessibility-check': {
          preAI: {
            summary: 'Accessibility checking is a manual afterthought, rarely connected to your brand consistency process.',
            detail: 'WCAG compliance and inclusive language reviews happen late in the pipeline. Your brand consistency work is already done when accessibility issues force rework.',
          },
          aiAgents: {
            summary: 'AI accessibility tools catch WCAG violations automatically, protecting your brand consistency standards.',
            detail: 'Accessibility agents scan for inclusive language and alt-text compliance. Your brand consistency requirements benefit from automated baseline checks before human review.',
          },
          aiAgentic: {
            summary: 'Autonomous accessibility agents enforce WCAG and inclusive standards — brand consistency is guaranteed by default.',
            detail: 'Accessibility agents ensure all content meets compliance standards before publication. Your brand consistency benefits from guaranteed accessibility without manual checking overhead.',
          },
        },
        'localize-content': {
          preAI: {
            summary: 'Localization is a slow, manual translation process that delays your brand consistency for global markets.',
            detail: 'Each market requires separate translation, cultural review, and compliance checking. Your brand consistency suffers because localized versions lag weeks behind the original.',
          },
          aiAgents: {
            summary: 'AI translation agents accelerate localization while respecting brand consistency requirements.',
            detail: 'Localization agents produce initial translations with brand consistency context preserved. You review for cultural nuance rather than translating from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous localization agents adapt content for all markets simultaneously — your brand consistency scales globally.',
            detail: 'Localization agents handle translation, cultural adaptation, and regional compliance autonomously. Your brand consistency is maintained across markets without manual per-locale effort.',
          },
        },
        'ab-variant-creation': {
          preAI: {
            summary: 'A/B variants are created manually with limited connection to your brand consistency hypotheses.',
            detail: 'Test variants rely on guesswork rather than data. Your brand consistency insights rarely inform variant design, reducing the value of testing efforts.',
          },
          aiAgents: {
            summary: 'AI generates test variants informed by brand consistency data and historical performance.',
            detail: 'Variant agents create headlines, CTAs, and imagery options based on your brand consistency hypotheses. You select winning approaches rather than brainstorming from zero.',
          },
          aiAgentic: {
            summary: 'Autonomous variant agents design, deploy, and learn from tests using brand consistency hypotheses — you set the agenda.',
            detail: 'Variant agents run continuous testing experiments informed by your brand consistency objectives. You define what to test and review strategic learnings while the system iterates autonomously.',
          },
        },
        'content-repurposing': {
          preAI: {
            summary: 'Content repurposing is manual reformatting, disconnected from your brand consistency goals.',
            detail: 'Each derivative asset is created from scratch. Your brand consistency requirements are not systematically applied when repurposing content across formats.',
          },
          aiAgents: {
            summary: 'AI repurposing agents derive secondary assets with brand consistency consistency built in.',
            detail: 'Repurposing agents transform primary content into channel-specific formats following your brand consistency guidelines. You approve derivatives rather than recreating each manually.',
          },
          aiAgentic: {
            summary: 'Autonomous repurposing agents derive all secondary assets automatically within brand consistency guidelines.',
            detail: 'Repurposing agents transform primary content into every derivative format following your brand consistency rules. You set format strategy while the system handles production at scale.',
          },
        },
        'archive-tag': {
          preAI: {
            summary: 'Content archiving is inconsistent, making brand consistency-related retrieval nearly impossible.',
            detail: 'Tagging and taxonomy are applied inconsistently or not at all. Finding past content relevant to brand consistency requires searching through unstructured repositories.',
          },
          aiAgents: {
            summary: 'AI tagging agents classify content automatically, making brand consistency retrieval faster.',
            detail: 'Archive agents apply taxonomy and metadata based on your brand consistency categories. You validate classifications rather than manually tagging every asset.',
          },
          aiAgentic: {
            summary: 'Autonomous archive agents maintain perfect taxonomy — brand consistency retrieval is instant and reliable.',
            detail: 'Archive agents classify, tag, and organize all content using your brand consistency taxonomy automatically. You evolve the taxonomy structure while the system maintains it flawlessly.',
          },
        },
        'legal-compliance-gate': {
          preAI: {
            summary: 'Legal compliance gates create unpredictable holds that delay your brand consistency deadlines.',
            detail: 'Legal sign-off timing is opaque and variable. Your brand consistency timelines are at the mercy of legal review queues with no visibility into status.',
          },
          aiAgents: {
            summary: 'AI pre-screening reduces legal gate delays by resolving routine brand consistency checks automatically.',
            detail: 'Compliance agents handle standard checks and only escalate brand consistency edge cases to human lawyers. Your timelines are more predictable because routine items clear faster.',
          },
          aiAgentic: {
            summary: 'Autonomous compliance gates clear routine content instantly — only novel brand consistency risks reach human lawyers.',
            detail: 'Compliance agents handle standard legal checks autonomously using your brand consistency risk framework. Human review is reserved for unprecedented scenarios and policy updates.',
          },
        },
        'localization-quality-gate': {
          preAI: {
            summary: 'Localization quality gates are inconsistent, creating brand consistency risks in global markets.',
            detail: 'Quality checks for localized content vary by market and reviewer. Your brand consistency standards are unevenly applied across regions and languages.',
          },
          aiAgents: {
            summary: 'AI quality checks catch translation errors before they affect your brand consistency outcomes.',
            detail: 'Localization QA agents verify accuracy and cultural fit automatically. Your brand consistency standards are applied consistently across all target markets.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents ensure localization quality across all markets — brand consistency is guaranteed globally.',
            detail: 'Localization QA agents validate every market adaptation autonomously against your brand consistency standards. You set quality criteria while the system enforces them at scale.',
          },
        },
        'segment-mapping': {
          preAI: {
            summary: 'Segment mapping is manual spreadsheet work with limited visibility into brand consistency impact.',
            detail: 'Mapping content variants to audience segments is done in spreadsheets. Your brand consistency data is disconnected from the personalization logic.',
          },
          aiAgents: {
            summary: 'AI agents map variants to segments using brand consistency data from the CDP.',
            detail: 'Segment agents recommend variant-audience matches based on your brand consistency signals. You review the mapping rather than building it manually in spreadsheets.',
          },
          aiAgentic: {
            summary: 'Autonomous segment agents map and optimize variant-audience matches using live brand consistency signals.',
            detail: 'Segment agents continuously refine variant-audience mappings based on real-time brand consistency data. You define segmentation strategy while the system executes and optimizes automatically.',
          },
        },
        'dynamic-assembly': {
          preAI: {
            summary: 'Dynamic content assembly is rigid and template-bound, limiting your brand consistency options.',
            detail: 'Personalized experiences require engineering support for each variant. Your brand consistency vision is constrained by inflexible assembly templates.',
          },
          aiAgents: {
            summary: 'AI assembly agents construct personalized experiences informed by brand consistency rules.',
            detail: 'Assembly agents combine content components per segment following your brand consistency logic. You define rules and review outputs rather than manually configuring each variant.',
          },
          aiAgentic: {
            summary: 'Autonomous assembly agents construct personalized experiences in real time — brand consistency logic is self-optimizing.',
            detail: 'Assembly agents build dynamic experiences per segment using your brand consistency rules and real-time behavioral signals. You govern personalization policies, not individual assembly configurations.',
          },
        },
        'personalization-qa': {
          preAI: {
            summary: 'Personalization QA is manual spot-checking that misses brand consistency gaps.',
            detail: 'Testing every segment-variant combination is impossible manually. Your brand consistency concerns are only caught when users report issues post-launch.',
          },
          aiAgents: {
            summary: 'AI QA agents validate personalization coverage and flag brand consistency gaps before launch.',
            detail: 'QA agents test every segment-variant combination against your brand consistency requirements. You review exception reports rather than manually spot-checking combinations.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents validate every personalization scenario — brand consistency gaps are caught before launch.',
            detail: 'Personalization QA agents test all segment-variant combinations against your brand consistency requirements automatically. You set acceptance criteria while the system validates at scale.',
          },
        },
        'campaign-planning': {
          preAI: {
            summary: 'Campaign planning is a manual coordination effort with fragmented brand consistency inputs.',
            detail: 'Campaign plans are built in decks and spreadsheets with incomplete data. Your brand consistency perspective is often incorporated too late in the planning cycle.',
          },
          aiAgents: {
            summary: 'AI planning agents draft campaign frameworks with brand consistency data pre-integrated.',
            detail: 'Planning agents pull audience, budget, and performance data into campaign templates. Your brand consistency priorities shape the plan from the start rather than being retrofitted.',
          },
          aiAgentic: {
            summary: 'Autonomous planning agents generate campaign frameworks using brand consistency intelligence — you set objectives.',
            detail: 'Planning agents produce data-driven campaign plans with your brand consistency priorities embedded. You define strategic goals while the system optimizes tactics and resource allocation.',
          },
        },
        'consent-check': {
          preAI: {
            summary: 'Consent checking is a manual compliance step that adds friction to your brand consistency process.',
            detail: 'Verifying GDPR/CCPA consent for targeting requires manual cross-referencing. Your brand consistency work is delayed while compliance status is manually confirmed.',
          },
          aiAgents: {
            summary: 'AI consent agents verify targeting compliance automatically, reducing brand consistency friction.',
            detail: 'Consent agents cross-reference CDP signals against GDPR/CCPA rules for your brand consistency needs. You handle exceptions rather than manually verifying every segment.',
          },
          aiAgentic: {
            summary: 'Autonomous consent agents enforce privacy compliance at scale — brand consistency is guaranteed by architecture.',
            detail: 'Consent agents verify targeting compliance in real time across all segments using your brand consistency framework. You set privacy policies while the system enforces them automatically.',
          },
        },
        'paid-creative-production': {
          preAI: {
            summary: 'Paid creative production runs separately from organic, fragmenting your brand consistency oversight.',
            detail: 'Ad creative and organic content are produced in silos. Your brand consistency perspective is applied inconsistently between paid and organic channels.',
          },
          aiAgents: {
            summary: 'AI production agents generate paid variants from organic content with brand consistency consistency.',
            detail: 'Paid creative agents adapt organic content for ad platforms following your brand consistency guidelines. You approve and fine-tune rather than producing ad creative from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous production agents create paid variants at scale within brand consistency guardrails — you set the strategy.',
            detail: 'Paid creative agents generate ad variants from organic content following your brand consistency guidelines. You define creative strategy while the system produces and optimizes at scale.',
          },
        },
        'attribution-modeling': {
          preAI: {
            summary: 'Attribution modeling is manual and unreliable, undermining your brand consistency reporting.',
            detail: 'Last-click attribution dominates despite its flaws. Your brand consistency decisions lack the multi-touch perspective needed for accurate performance assessment.',
          },
          aiAgents: {
            summary: 'AI attribution models surface multi-touch insights relevant to your brand consistency priorities.',
            detail: 'Attribution agents calculate content ROI across channels using your brand consistency weightings. You interpret strategic implications rather than building models manually.',
          },
          aiAgentic: {
            summary: 'Autonomous attribution agents run multi-touch models continuously — brand consistency insights update in real time.',
            detail: 'Attribution agents calculate content ROI across all channels using your brand consistency framework. You interpret strategic implications while the system handles modeling complexity.',
          },
        },
        'executive-reporting': {
          preAI: {
            summary: 'Executive reports are manually assembled, often missing the brand consistency narrative you need.',
            detail: 'Building executive dashboards takes hours of data wrangling. The brand consistency story you want to tell is lost in generic reporting templates.',
          },
          aiAgents: {
            summary: 'AI builds executive dashboards with brand consistency narratives pre-drafted for leadership.',
            detail: 'Reporting agents synthesize data into executive formats with your brand consistency story embedded. You refine the narrative rather than assembling data from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce executive dashboards with brand consistency narratives — you add strategic context.',
            detail: 'Executive reporting agents synthesize all data into leadership-ready formats with your brand consistency story embedded. You provide strategic commentary on auto-generated insights.',
          },
        },
        'competitive-response': {
          preAI: {
            summary: 'Competitive response is slow and reactive, giving you no brand consistency advantage.',
            detail: 'By the time you spot a competitor move and respond, the moment has passed. Your brand consistency approach cannot adapt fast enough to real-time competitive signals.',
          },
          aiAgents: {
            summary: 'AI competitive agents surface signals and draft responses aligned with brand consistency strategy.',
            detail: 'Competitive agents monitor market moves and suggest brand consistency-aligned responses. You approve and refine reactive content rather than spotting threats manually.',
          },
          aiAgentic: {
            summary: 'Autonomous competitive agents detect and draft responses in real time — brand consistency moves are countered instantly.',
            detail: 'Competitive agents monitor signals, draft responses, and deploy within your brand consistency guardrails. You approve high-stakes responses while routine reactions ship autonomously.',
          },
        },
        'content-governance': {
          preAI: {
            summary: 'Content governance is periodic manual auditing that cannot keep pace with your brand consistency standards.',
            detail: 'Live content drifts out of compliance between infrequent reviews. Your brand consistency requirements are only enforced when someone manually checks.',
          },
          aiAgents: {
            summary: 'AI governance agents continuously audit live content against brand consistency standards.',
            detail: 'Governance agents flag content drift, compliance gaps, and brand consistency issues in real time. You review flagged items rather than conducting manual audits.',
          },
          aiAgentic: {
            summary: 'Autonomous governance agents audit all live content continuously — brand consistency compliance is always current.',
            detail: 'Governance agents monitor every published piece against your brand consistency standards in real time. You evolve governance policies while the system enforces them perpetually.',
          },
        },
        'governance-gate': {
          preAI: {
            summary: 'Governance gates are calendar-driven checkpoints disconnected from your brand consistency rhythm.',
            detail: 'Governance reviews happen on a fixed schedule regardless of content velocity. Your brand consistency concerns may not surface until the next quarterly review.',
          },
          aiAgents: {
            summary: 'AI governance gates run continuous checks, surfacing brand consistency issues between formal reviews.',
            detail: 'Governance agents validate live content against your brand consistency criteria on an ongoing basis. You act on exception alerts rather than waiting for quarterly reviews.',
          },
          aiAgentic: {
            summary: 'Autonomous governance gates run continuously — brand consistency violations trigger immediate remediation.',
            detail: 'Governance agents validate live content against your brand consistency criteria continuously and auto-trigger refresh or retirement workflows. You set policies, not review schedules.',
          },
        },
        'journey-mapping': {
          preAI: {
            summary: 'Journey mapping is a manual exercise that rarely reflects your brand consistency reality.',
            detail: 'Customer journey maps are created in workshops and quickly go stale. Your brand consistency perspective is a snapshot, not a living view of how content performs at each stage.',
          },
          aiAgents: {
            summary: 'AI journey agents map content to lifecycle stages using brand consistency data from the CDP.',
            detail: 'Journey agents dynamically map content to customer stages based on your brand consistency framework. You validate the mapping rather than building it manually in workshops.',
          },
          aiAgentic: {
            summary: 'Autonomous journey agents maintain living maps using real-time brand consistency data — you shape the strategy.',
            detail: 'Journey agents dynamically map content to lifecycle stages using live brand consistency signals. You define journey frameworks while the system optimizes content placement continuously.',
          },
        },
        'sentiment-monitoring': {
          preAI: {
            summary: 'Sentiment monitoring is sporadic manual checking with no systematic link to brand consistency.',
            detail: 'You check brand sentiment reactively rather than proactively. Your brand consistency decisions are made without real-time audience feedback signals.',
          },
          aiAgents: {
            summary: 'AI sentiment agents track brand reception in real time, alerting you to brand consistency risks.',
            detail: 'Sentiment agents analyze audience reactions and flag brand consistency concerns before they escalate. You respond to alerts rather than manually checking platforms.',
          },
          aiAgentic: {
            summary: 'Autonomous sentiment agents monitor and respond to brand consistency signals around the clock — you govern escalation.',
            detail: 'Sentiment agents track audience reactions and trigger brand consistency responses automatically. You set escalation thresholds and review strategic implications of sentiment shifts.',
          },
        },
        'sales-enablement': {
          preAI: {
            summary: 'Sales enablement content is created ad hoc, disconnected from your brand consistency strategy.',
            detail: 'Sales teams request materials outside the content pipeline. Your brand consistency standards are not applied to battle cards, decks, and one-pagers created in isolation.',
          },
          aiAgents: {
            summary: 'AI agents generate sales materials from marketing content with brand consistency alignment.',
            detail: 'Sales enablement agents transform marketing assets into battle cards and decks following your brand consistency standards. You approve rather than creating each piece manually.',
          },
          aiAgentic: {
            summary: 'Autonomous enablement agents keep sales materials current with brand consistency alignment — you set the playbook.',
            detail: 'Enablement agents automatically update battle cards, decks, and case studies as your brand consistency data evolves. You define the sales narrative while the system produces materials at scale.',
          },
        },
        'influencer-brief': {
          preAI: {
            summary: 'Influencer briefs are manual documents with limited brand consistency guardrails.',
            detail: 'Creator briefs are written from scratch each time. Your brand consistency guidelines are inconsistently communicated to external partners and influencers.',
          },
          aiAgents: {
            summary: 'AI agents draft influencer briefs with brand consistency guardrails embedded automatically.',
            detail: 'Brief agents generate creator guidelines from your brand consistency requirements and past successful collaborations. You customize rather than writing each brief from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous brief agents generate creator guidelines with brand consistency guardrails — you approve partnerships.',
            detail: 'Brief agents produce personalized influencer guidelines using your brand consistency framework and creator history. You focus on relationship strategy while briefs ship autonomously.',
          },
        },
        'ugc-moderation': {
          preAI: {
            summary: 'UGC moderation is manual screening that cannot scale to protect brand consistency.',
            detail: 'User-generated content is reviewed one piece at a time. Your brand consistency standards cannot be consistently enforced across the volume of submissions.',
          },
          aiAgents: {
            summary: 'AI moderation agents screen UGC for brand safety and brand consistency compliance at scale.',
            detail: 'Moderation agents filter user-generated content against your brand consistency criteria. You review borderline cases rather than manually screening every submission.',
          },
          aiAgentic: {
            summary: 'Autonomous moderation agents screen all UGC for brand consistency compliance at scale — you govern edge cases.',
            detail: 'Moderation agents filter user-generated content using your brand consistency rules continuously. You update moderation policies and review borderline cases that the system escalates.',
          },
        },
        'content-scoring': {
          preAI: {
            summary: 'Content scoring is subjective prioritization that underweights your brand consistency criteria.',
            detail: 'Requests are prioritized by loudest voice or executive fiat. Your brand consistency scoring criteria are rarely part of the formal prioritization framework.',
          },
          aiAgents: {
            summary: 'AI scoring agents rank requests using brand consistency criteria alongside strategic priority.',
            detail: 'Scoring agents weight your brand consistency factors into the prioritization algorithm. You adjust rankings rather than scoring each request manually.',
          },
          aiAgentic: {
            summary: 'Autonomous scoring agents prioritize the pipeline using brand consistency criteria — you set strategic weights.',
            detail: 'Scoring agents rank and route content requests using your brand consistency priorities in real time. You define scoring criteria and review the queue rather than manually triaging.',
          },
        },
        'channel-orchestration': {
          preAI: {
            summary: 'Channel orchestration is manual coordination with no systematic brand consistency integration.',
            detail: 'Cross-channel timing is managed in spreadsheets and Slack. Your brand consistency requirements for sequencing and coordination are often overridden by ad hoc changes.',
          },
          aiAgents: {
            summary: 'AI orchestration agents sequence distribution with brand consistency rules for timing and cadence.',
            detail: 'Orchestration agents coordinate cross-channel timing based on your brand consistency requirements. You set rules and review the sequence rather than managing each channel individually.',
          },
          aiAgentic: {
            summary: 'Autonomous orchestration agents manage all channel timing with brand consistency logic — you set the playbook.',
            detail: 'Orchestration agents handle cross-channel sequencing, timing, and coordination autonomously using your brand consistency rules. You evolve the orchestration strategy while the system executes.',
          },
        },
      },
      keyInsight: 'Brand managers are the immune system of organizational identity. In the preAI era, they performed exhausting, repetitive scrutiny that masked a deeper problem: they had no leverage over systemic quality. AI does not eliminate brand judgment — it exposes the 20% of decisions that actually require human expertise. The shift from "inspector of bad work" to "arbiter of ambiguous cases" is psychologically significant.',
    },
  },


  // ═══════════════════════════════════════════════════════════════════════════
  // ROLE 3: EDITOR / CONTENT LEAD
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'editor',
    title: 'Editor / Content Lead',
    description: 'Oversees content drafting, SEO optimization, final polish, and accessibility — the quality backbone of the content pipeline. The irreducible value is taste.',
    tagline: 'The irreducible value is taste — distinguishing technically correct from genuinely good.',
    iconName: 'Pencil',
    category: 'creative',
    accentColor: '#9B7ACC',
    ownedSteps: ['draft-content', 'seo-optimization', 'final-edit', 'accessibility-check'],
    reviewedGates: ['quality-check'],
    relatedAgents: ['writer-agent', 'seo-agent', 'accessibility-agent'],
    relatedInputs: ['brand-guide', 'seo-tools', 'accessibility-standards'],
    narrative: {
      stageOverviews: {
        preAI: {
          narrative: 'Hand-crafted workflows where the Editor bears full cognitive load for quality decisions, structural integrity, and voice consistency. Every piece flows through one person\'s editorial judgment — the quality floor is high but the throughput ceiling is low.',
          timeAllocation: '35% draft review and feedback, 20% SEO optimization, 20% final editing and polish, 15% accessibility checks, 10% strategic editorial planning',
          criticalMetrics: ['Draft revision cycles per piece', 'Time-to-publish from first draft', 'Content quality score', 'SEO ranking for target keywords', 'Accessibility compliance rate'],
          strategicOpportunity: 'Most editorial time is spent on mechanical quality (grammar, structure, keyword density) rather than strategic quality (narrative power, audience resonance, competitive differentiation). The ratio needs to invert.',
        },
        aiAgents: {
          narrative: 'Specialized agents handle mechanical tasks — grammar, keyword density, basic structure, accessibility compliance. The Editor pivots to higher-level guidance, refinement, and the judgment that transforms adequate into compelling.',
          timeAllocation: '15% agent output review, 25% strategic editorial guidance, 20% narrative refinement, 15% agent calibration, 25% editorial strategy',
          criticalMetrics: ['Agent-assisted draft quality on first pass', 'Editorial intervention rate', 'Time savings per piece', 'Content performance improvement', 'Voice consistency score'],
          strategicOpportunity: 'With mechanical quality automated, the Editor can focus on what AI cannot do: infusing content with strategic intent, emotional resonance, and the contrarian angles that produce breakthrough performance.',
        },
        aiAgentic: {
          narrative: 'Orchestrated agent ecosystem executes with autonomy; the Editor becomes architect of creative standards and arbiter of resonance in a system that increasingly self-corrects. The paradox: as AI eliminates mechanical work, the Editor\'s role becomes simultaneously less visible and more essential.',
          timeAllocation: '5% system monitoring, 15% quality standard governance, 30% high-stakes editorial decisions, 25% editorial strategy, 25% creative direction',
          criticalMetrics: ['Autonomous publishing rate', 'Content performance vs. benchmark', 'Editorial intervention quality (value-add per intervention)', 'System accuracy and consistency', 'Audience engagement trends'],
          strategicOpportunity: 'In a world where any system can produce technically correct content in minutes, the Editor\'s remaining superpower — taste, voice coherence, audience resonance — is what separates adequate from compelling. The hardest part is proving this value when the visible work disappears.',
        },
      },
      nodeJourneys: {
        'draft-content': {
          preAI: {
            summary: 'Editors work directly with writers in iterative cycles, reshaping rough drafts into publishable narratives. Structure, voice, and narrative flow are negotiated through multiple rounds of feedback that average 4+ hours per blog post from outline to publication.',
            detail: 'In traditional editorial workflows, the Editor receives drafts from writers at various skill levels, each with their own voice and structural tendencies. The Editor reads for wholeness: Does the opening command attention? Do ideas build logically? Does the voice stay consistent? This requires deep reading, marginal notes, sometimes radical restructuring. Writers at 25th percentile skill require 2-3x editorial intervention vs. 75th percentile peers, creating unpredictable workload.',
            painPoints: [
              'Multiple revision cycles delay publication and consume Editor time proportional to writer skill variance',
              'Extracting the kernel of a writer\'s intent from unclear initial drafts requires detective work and deep reading',
              'Voice consistency across multiple writers creates constant micro-corrections and brand drift',
              'Balancing directive feedback with collaborative tone is emotionally taxing and slows iteration',
            ],
            benchmarks: [
              'Average blog post production: 4 hours 10 minutes from outline to publishable form (Orbit Media/HubSpot 2024)',
              'Editorial revisions account for 20-30% of total production time in traditional workflows (industry composite)',
              'Writers at 25th percentile skill require 2-3x editorial intervention vs. 75th percentile peers (estimated)',
            ],
            outcomes: [
              'Published content reflects consistent brand voice and narrative standards',
              'Throughput limited by Editor bandwidth: typically 8-15 quality pieces per week',
              'Editor cognitive load peaks mid-week, creating quality variance across the publication calendar',
            ],
            roleEvolution: 'The Editor is simultaneously the quality floor and the throughput ceiling. Strategic editorial thinking is compressed into whatever time remains after production editing is complete.',
          },
          aiAgents: {
            summary: 'AI generates first drafts with brand voice features embedded, reducing revision cycles by 60-80%. The Editor\'s role shifts from rewriting prose to injecting strategic intent — taking technically solid drafts and infusing them with narrative momentum and audience resonance.',
            detail: 'AI writing agents produce drafts trained on the brand guide and audience data. First-draft quality is typically 60-70% of final, meaning the Editor concentrates on the 30-40% that requires judgment: tone calibration, competitive positioning, creative risk appetite, and narrative structure. The danger is "default acceptance" — reviewing AI drafts is cognitively different from writing, and Editors who do not actively challenge agent outputs find themselves approving mediocre content that technically meets criteria but lacks strategic edge.',
            painPoints: [
              'AI-drafted content tends toward the median — matching historical patterns well but rarely proposing contrarian angles or unexpected formats',
              'Review fatigue: approving 20 agent-drafted pieces feels less demanding than writing 10, but the cognitive cost of quality evaluation is high',
              'Calibrating the agent requires explicit articulation of implicit editorial standards that the Editor may not have documented',
            ],
            benchmarks: [
              'AI content tools reduce first-draft generation time by 40-60% (Jasper/Writer benchmarks 2024)',
              'Organizations report 60-80% reduction in revision cycles with AI-assisted drafting (Jasper 2024)',
              'Total content production costs drop 30-40% with AI-assisted drafting at scale (industry composite)',
            ],
            outcomes: [
              'Editorial throughput doubles or triples without additional headcount',
              'Creative team satisfaction improves because drafts arrive with more complete context',
              'Editor\'s strategic contribution per piece increases as administrative production work is absorbed',
            ],
            roleEvolution: 'The Editor stops being a rewriter and becomes a creative director — not of visuals, but of narrative strategy. The daily rhythm shifts from "fix drafts" to "shape the editorial judgment that produces them."',
          },
          aiAgentic: {
            summary: 'Autonomous drafting agents produce publication-ready content for standard types. The Editor intervenes only on high-stakes content where narrative power, competitive positioning, or audience resonance requires human taste — the 20% of content that generates 60%+ of measured performance.',
            detail: 'Agentic drafting handles the full lifecycle for standard content: assembling audience data, generating the draft, checking quality, and routing for publication. The Editor intervenes only when the system detects strategic ambiguity or when content risk exceeds a defined threshold. The critical shift is from content production to content system governance.',
            painPoints: [
              'The Editor must resist reviewing every piece — selective intervention requires trust in the system',
              'Auto-generated content for genuinely novel topics can be confidently wrong',
              'If the Editor no longer touches most content, some stakeholders question the role\'s necessity',
            ],
            benchmarks: [
              'Autonomous content workflows handle 70-80% of standard content types without editorial intervention (industry composite)',
              'The 20% of content requiring human editorial typically generates 60%+ of measured content ROI (industry estimate)',
            ],
            outcomes: [
              'Editor\'s personal content work drops to 5-10 pieces per week, each addressing highest-stakes challenges',
              'Pipeline velocity for standard content increases 3-5x',
              'Content quality becomes more consistent because the automated system applies the same standards uniformly',
            ],
            roleEvolution: 'The Editor becomes a creative standards architect. The most important activities: calibrating the quality model, authoring the content that requires human taste, and making the editorial bets that only a human would take.',
          },
        },
        'seo-optimization': {
          preAI: {
            summary: 'Editor manually researches keywords, optimizes titles and meta descriptions, checks density, and validates internal linking — adding 30-60 minutes of SEO work per content piece on top of editorial duties.',
            detail: 'SEO optimization is a manual, research-intensive process layered on top of editorial work. The Editor researches target keywords, analyzes competitor content for the same terms, optimizes headings and meta descriptions, checks keyword density, and validates internal linking structure. The work is mechanical but consequential — poor SEO optimization can render well-written content invisible.',
            painPoints: [
              'SEO work competes for Editor time with editorial quality — one typically suffers at the expense of the other',
              'Keyword research requires 15-30 minutes per piece; the data changes monthly as search patterns evolve',
              'Optimizing for SEO often conflicts with narrative quality — keyword-stuffed content reads poorly',
            ],
            benchmarks: [
              'SEO optimization adds 30-60 minutes per content piece to the editorial workflow (industry average)',
              'Content with optimized SEO outperforms unoptimized content by 2-5x in organic traffic (various sources)',
            ],
            outcomes: [
              'SEO-optimized content ranks for target keywords 60-70% of the time',
              'Editor bandwidth constrains the number of pieces that receive full SEO treatment',
            ],
            roleEvolution: 'SEO is treated as an editorial afterthought — applied after the content is "done" rather than integrated into the drafting process.',
          },
          aiAgents: {
            summary: 'AI SEO agents handle keyword research, competitor analysis, and on-page optimization automatically. The Editor reviews SEO recommendations alongside editorial decisions, reducing SEO time from 30-60 minutes to 5 minutes per piece.',
            detail: 'SEO agents analyze search intent, identify target keywords, and recommend optimizations (headings, meta descriptions, internal links) automatically. The Editor integrates SEO recommendations into the editorial workflow rather than treating them as a separate step.',
            painPoints: [
              'AI SEO tools can over-optimize for metrics at the expense of readability',
              'Search algorithm changes require model retraining; agents may optimize for last quarter\'s ranking signals',
            ],
            benchmarks: [
              'AI-assisted SEO reduces optimization time from 30-60 minutes to 5 minutes per piece (Surfer/Clearscope benchmarks)',
              'AI-optimized content achieves 20-30% higher organic traffic vs. manually optimized (industry composite)',
            ],
            outcomes: [
              'Every piece of content receives full SEO optimization (vs. selective treatment)',
              'Organic traffic improves 20-30% due to consistent, data-driven optimization',
            ],
            roleEvolution: 'SEO shifts from an editorial burden to an embedded system. The Editor focuses on the intersection of search intent and narrative quality.',
          },
          aiAgentic: {
            summary: 'Agentic SEO systems continuously optimize content for search performance — updating existing content, identifying keyword gaps, and recommending new content opportunities. SEO becomes a system property, not a per-piece task.',
            detail: 'SEO agents operate continuously: monitoring search rankings, updating existing content for freshness signals, identifying keyword gaps, and recommending new content opportunities. The Editor reviews SEO-driven content recommendations as part of editorial strategy.',
            painPoints: [
              'Continuous SEO optimization can conflict with content governance (who approves changes to published content?)',
              'Agents may recommend content topics that are SEO-optimal but strategically irrelevant',
            ],
            benchmarks: [
              'Agentic SEO maintains content freshness and ranking signals automatically (industry standard for enterprise)',
              'Continuous optimization drives 40-50% organic traffic improvement over 12 months (Clearscope/industry composite)',
            ],
            outcomes: [
              'SEO performance improves continuously without Editor intervention',
              'Content gap analysis surfaces strategic opportunities for new content',
            ],
            roleEvolution: 'The Editor delegates SEO execution entirely to the agentic layer and focuses on whether search-driven content serves the broader editorial strategy.',
          },
        },
        'final-edit': {
          preAI: {
            summary: 'The Editor performs a final quality pass on every content piece before publication — checking grammar, fact accuracy, voice consistency, and visual/text alignment. This is the last human checkpoint before content reaches the audience.',
            detail: 'Final editing is the quality backstop. The Editor reads the full piece one last time, checking for errors that survived previous rounds, verifying facts, ensuring voice consistency, and confirming that the piece delivers on the promise of its headline. This step adds 15-30 minutes per piece but catches issues that would damage credibility if published.',
            painPoints: [
              'Final edit is cognitively demanding after hours of earlier review work — fatigue-driven errors are the main risk',
              'No systematic checklist means different Editors catch different categories of issues',
            ],
            outcomes: [
              'Final edit catches 5-10% additional issues missed in earlier rounds',
              'Published error rate: 2-5% of content contains at least one error post-publication',
            ],
          },
          aiAgents: {
            summary: 'AI handles grammar, fact-checking, and style consistency in the final pass. The Editor\'s final review focuses on narrative quality, audience resonance, and the "does this land?" judgment that no algorithm can replicate.',
            detail: 'AI final-edit tools handle the mechanical quality checks: grammar, spelling, fact verification against source data, style guide compliance. The Editor\'s final pass concentrates on the qualitative assessment.',
            outcomes: [
              'Published error rate drops to <1% with AI-augmented final editing',
              'Editor\'s final review time drops from 15-30 minutes to 5 minutes for standard content',
            ],
          },
          aiAgentic: {
            summary: 'Agentic final-edit systems handle the complete quality pass for standard content. The Editor performs final review only on high-stakes or high-risk content where publication errors carry reputational cost.',
            detail: 'Final editing becomes fully automated for standard content types. The Editor reviews only content flagged for elevated risk.',
            outcomes: [
              'Final edit is automated for 80%+ of standard content',
              'Editor\'s personal final reviews reserved for high-stakes content',
            ],
          },
        },
        'accessibility-check': {
          preAI: {
            summary: 'Accessibility compliance is checked manually against WCAG guidelines — alt text, heading hierarchy, color contrast, link text. It is the most commonly skipped editorial step due to time pressure.',
            detail: 'Accessibility checking requires specialized knowledge of WCAG guidelines. The Editor or a dedicated QA reviewer checks alt text, heading structure, color contrast, link descriptiveness, and reading order. It is frequently deprioritized under deadline pressure.',
            painPoints: [
              'Accessibility is the first step skipped when deadlines tighten',
              'WCAG guidelines are complex; most Editors are not accessibility specialists',
            ],
            benchmarks: [
              'Only 3-5% of websites are WCAG 2.1 AA compliant (WebAIM Million survey)',
              'Accessibility-related lawsuits increased 300%+ in the past 5 years (UsableNet)',
            ],
          },
          aiAgents: {
            summary: 'AI accessibility agents automatically check alt text, heading hierarchy, contrast ratios, and link text. The Editor reviews flagged issues rather than performing manual audits.',
            detail: 'Accessibility agents scan content against WCAG standards automatically, flagging issues with recommended fixes. The Editor approves fixes and handles edge cases.',
            outcomes: [
              'Accessibility compliance rate improves from 30-40% to 80%+ with AI-assisted checking',
              'Accessibility checking no longer competes for Editor time with other editorial priorities',
            ],
          },
          aiAgentic: {
            summary: 'Agentic accessibility systems enforce WCAG compliance during content creation, preventing violations before they occur. Accessibility becomes a system guarantee rather than a review step.',
            detail: 'Accessibility compliance is enforced at the creation stage. Content that violates WCAG standards is corrected automatically or flagged before draft completion.',
            outcomes: [
              'WCAG compliance approaches 95%+ across all published content',
              'Accessibility-related legal risk drops significantly',
            ],
          },
        },
        'quality-check': {
          preAI: {
            summary: 'The Editor conducts quality reviews as a formal gate — assessing content against quality criteria before it moves to brand review and publication. The gate adds 1-3 days to the timeline.',
            detail: 'Quality check is a formal gate where the Editor assesses whether content meets the minimum quality bar for publication. This includes structural coherence, audience relevance, voice consistency, and factual accuracy.',
            painPoints: [
              'Quality criteria are subjective and vary by Editor',
              'The gate adds scheduling delay without a systematic checklist',
            ],
          },
          aiAgents: {
            summary: 'AI-assisted quality scoring pre-screens content against quality criteria. The Editor reviews only flagged items and borderline cases.',
            detail: 'Quality agents score content against defined criteria. Content that passes automatically moves forward; flagged content enters the Editor\'s review queue.',
            outcomes: [
              'Quality gate time drops from 1-3 days to same-day for AI-cleared content',
              'Quality consistency improves because the scoring model applies criteria uniformly',
            ],
          },
          aiAgentic: {
            summary: 'The quality gate self-operates within Editor-defined parameters. The Editor monitors quality trends and adjusts criteria as editorial standards evolve.',
            detail: 'Quality checking is continuous and embedded in the creation workflow. The formal gate becomes a verification step rather than a discovery step.',
            outcomes: [
              'Quality gate adds zero scheduling delay for standard content',
              'Editor focuses on evolving quality standards rather than enforcing them',
            ],
          },
        },

        // ── SUPPORT NODES ────────────────────────────────────────────────
        'writer-agent': {
          preAI: {
            summary: 'Content is created entirely by human writers whose skill levels and brand familiarity vary widely.',
            detail: 'Human writers produce all drafts. Quality variance creates unpredictable editorial workload.',
          },
          aiAgents: {
            summary: 'AI writing agents produce first drafts with embedded brand voice, reducing editorial revision cycles by 60-80%.',
            detail: 'Writer agents are trained on brand guidelines and audience data, producing drafts that arrive closer to publication quality.',
          },
          aiAgentic: {
            summary: 'Autonomous writing agents produce publication-ready content for standard types, with the Editor intervening only on high-stakes pieces.',
            detail: 'Writing agents handle the full drafting lifecycle for routine content. The Editor\'s involvement is reserved for content requiring human taste and strategic judgment.',
          },
        },
        'seo-agent': {
          preAI: {
            summary: 'SEO research and optimization is performed manually by the Editor or a dedicated SEO specialist.',
            detail: 'Keyword research, competitor analysis, and on-page optimization are manual tasks that add time to the editorial workflow.',
          },
          aiAgents: {
            summary: 'AI SEO agents handle keyword research, competitor analysis, and optimization recommendations automatically.',
            detail: 'SEO agents analyze search intent and recommend optimizations that the Editor integrates into the editorial workflow.',
          },
          aiAgentic: {
            summary: 'Autonomous SEO agents continuously optimize content for search performance, updating existing content and identifying new opportunities.',
            detail: 'SEO agents operate continuously, maintaining search rankings and surfacing strategic content opportunities for editorial review.',
          },
        },
        'accessibility-agent': {
          preAI: {
            summary: 'Accessibility checks are performed manually by the Editor or QA specialist against WCAG guidelines.',
            detail: 'Manual accessibility auditing is time-intensive and frequently deprioritized under deadline pressure.',
          },
          aiAgents: {
            summary: 'AI accessibility agents scan content against WCAG standards, flagging violations with recommended fixes.',
            detail: 'Automated accessibility checking ensures every piece of content is evaluated, regardless of deadline pressure.',
          },
          aiAgentic: {
            summary: 'Autonomous accessibility agents enforce WCAG compliance during creation, preventing violations before content is drafted.',
            detail: 'Accessibility compliance is embedded in the content creation workflow, ensuring compliance by construction.',
          },
        },
        'brand-guide': {
          preAI: {
            summary: 'A static brand guide document that the Editor references for voice and style decisions.',
            detail: 'The brand guide provides voice, tone, and style standards but is applied through the Editor\'s interpretation.',
          },
          aiAgents: {
            summary: 'The brand guide is encoded into AI tools, enabling automated voice scoring and style checks.',
            detail: 'Brand standards are operationalized as machine-readable rules that AI tools apply consistently.',
          },
          aiAgentic: {
            summary: 'The brand guide evolves into a living system that updates based on content performance data.',
            detail: 'Brand standards adapt continuously based on audience engagement and performance signals.',
          },
        },
        'seo-tools': {
          preAI: {
            summary: 'SEO tools (Ahrefs, SEMrush, etc.) are used manually by the Editor for keyword research and competitor analysis.',
            detail: 'Manual tool usage adds research time to the editorial workflow.',
          },
          aiAgents: {
            summary: 'SEO tools are integrated with AI agents for automated research and recommendation.',
            detail: 'Integration enables real-time SEO recommendations during the editorial process.',
          },
          aiAgentic: {
            summary: 'SEO tools are fully integrated into the agentic layer, providing continuous optimization and monitoring.',
            detail: 'SEO intelligence is available to all content creation agents in real-time.',
          },
        },
        'accessibility-standards': {
          preAI: {
            summary: 'WCAG guidelines referenced manually during accessibility checks.',
            detail: 'Accessibility standards are applied through manual review against published guidelines.',
          },
          aiAgents: {
            summary: 'WCAG standards are encoded into AI accessibility agents for automated compliance checking.',
            detail: 'Standards are operationalized as automated checks, ensuring consistent application.',
          },
          aiAgentic: {
            summary: 'Accessibility standards are enforced in real-time during content creation.',
            detail: 'Standards are embedded into the creation workflow, ensuring compliance by construction.',
          },
        },

        'receive-request': {
          preAI: {
            summary: 'You refine incoming requests manually, sorting through emails and Slack messages for writing quality.',
            detail: 'Requests arrive in inconsistent formats with no standard intake process. You spend hours triaging and clarifying scope before writing quality can even begin.',
          },
          aiAgents: {
            summary: 'An AI intake agent structures requests and flags writing quality implications before they reach your queue.',
            detail: 'Requests arrive pre-categorized with writing quality signals highlighted. You validate and prioritize rather than manually parsing raw inputs.',
          },
          aiAgentic: {
            summary: 'Autonomous intake agents triage, validate, and route requests with writing quality logic — you govern exceptions.',
            detail: 'Agentic intake handles end-to-end request processing with your writing quality rules embedded. You set policies and review escalations while routine requests flow automatically.',
          },
        },
        'research-insights': {
          preAI: {
            summary: 'You gather audience and market research manually, compiling data from multiple sources for writing quality.',
            detail: 'Research is scattered across tools, reports, and tribal knowledge. Building a complete picture for writing quality takes days and the data is often stale by the time you use it.',
          },
          aiAgents: {
            summary: 'AI research tools surface audience and market data relevant to your writing quality needs automatically.',
            detail: 'Research agents pull relevant data from multiple sources and present writing quality insights in a structured format. You curate and interpret rather than gather.',
          },
          aiAgentic: {
            summary: 'Autonomous research agents continuously update writing quality intelligence — you set the strategic lens.',
            detail: 'Research agents proactively surface writing quality insights from market signals, audience data, and competitive movements. You shape research priorities, not execute searches.',
          },
        },
        'write-brief': {
          preAI: {
            summary: 'You wait for briefs written by hand, often lacking the writing quality detail you need.',
            detail: 'Briefs arrive incomplete or misaligned with your writing quality requirements. You spend cycles requesting revisions and clarifying expectations before work can proceed.',
          },
          aiAgents: {
            summary: 'AI drafts briefs with writing quality requirements pre-populated from templates and past projects.',
            detail: 'Brief generation agents pull your writing quality requirements into structured templates. You review and refine rather than starting from a blank page.',
          },
          aiAgentic: {
            summary: 'Autonomous agents generate complete briefs with writing quality alignment built in — you approve strategy.',
            detail: 'Brief agents produce publication-ready briefs that embed your writing quality requirements from historical patterns. You govern strategic direction rather than reviewing drafts.',
          },
        },
        'brand-compliance': {
          preAI: {
            summary: 'Brand checks are subjective and slow, creating delays in your writing quality workflow.',
            detail: 'Brand reviewers interpret guidelines differently. Inconsistent enforcement of tone, terminology, and messaging means writing quality is harder to maintain at scale.',
          },
          aiAgents: {
            summary: 'AI brand checkers flag violations and score writing quality alignment before human review.',
            detail: 'Brand agents scan content against guidelines and highlight writing quality issues. You make judgment calls on edge cases rather than catching basic violations.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents enforce compliance at scale with writing quality rules — you update the rulebook.',
            detail: 'Brand agents apply and evolve compliance checks across all content automatically. Your writing quality standards are codified as machine-enforceable rules that you govern and refine.',
          },
        },
        'schedule-publish': {
          preAI: {
            summary: 'Publishing is a manual CMS process with no connection to your writing quality planning.',
            detail: 'Each piece requires manual scheduling, metadata entry, and CMS configuration. Your writing quality goals are disconnected from the publish timeline.',
          },
          aiAgents: {
            summary: 'AI scheduling agents suggest optimal publish timing based on writing quality data.',
            detail: 'Publishing agents recommend times and configurations informed by your writing quality priorities. You approve the schedule rather than manually configuring CMS settings.',
          },
          aiAgentic: {
            summary: 'Autonomous publishing agents manage scheduling end-to-end using writing quality optimization logic.',
            detail: 'Publishing agents handle CMS configuration, timing optimization, and deployment autonomously within your writing quality constraints. You set publishing policies, not individual schedules.',
          },
        },
        'distribute': {
          preAI: {
            summary: 'Content distribution is manual channel-by-channel, with limited visibility into writing quality.',
            detail: 'Each channel requires separate formatting, scheduling, and posting. There is no unified view of how distribution supports your writing quality objectives.',
          },
          aiAgents: {
            summary: 'AI distribution agents adapt content per channel with writing quality rules built in.',
            detail: 'Distribution agents format and deploy content across channels following your writing quality guidelines. You monitor and adjust rather than manually posting to each platform.',
          },
          aiAgentic: {
            summary: 'Autonomous distribution agents manage all channels with writing quality rules — you govern the playbook.',
            detail: 'Distribution agents deploy, adapt, and optimize content across every channel following your writing quality playbook. You evolve distribution strategy, not execute individual channel posts.',
          },
        },
        'track-performance': {
          preAI: {
            summary: 'Performance tracking is fragmented across tools, making writing quality assessment difficult.',
            detail: 'You pull data from analytics dashboards, social platforms, and CRM separately. Building a complete picture for writing quality requires manual data stitching.',
          },
          aiAgents: {
            summary: 'AI dashboards surface writing quality metrics in real time without manual data pulling.',
            detail: 'Performance agents aggregate data and highlight the writing quality signals that matter to you. You analyze trends rather than building dashboards from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous tracking agents monitor writing quality metrics continuously and trigger alerts and actions.',
            detail: 'Performance agents stream writing quality data and automatically trigger optimization workflows when thresholds are breached. You define KPIs and review strategic implications.',
          },
        },
        'generate-report': {
          preAI: {
            summary: 'Reports are built manually in spreadsheets, often missing the writing quality metrics you need.',
            detail: 'Report creation takes hours of data gathering and formatting. The metrics that matter for writing quality are often buried or missing entirely from standard templates.',
          },
          aiAgents: {
            summary: 'AI generates reports with writing quality metrics pre-formatted and insights highlighted.',
            detail: 'Reporting agents compile your writing quality data into structured templates with automated analysis. You add strategic narrative rather than wrangling data.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce writing quality reports on demand with strategic recommendations.',
            detail: 'Reporting agents generate writing quality analyses with actionable recommendations automatically. You consume insights and set strategic direction rather than producing reports.',
          },
        },
        'optimize': {
          preAI: {
            summary: 'Content optimization is reactive and slow, with limited connection to writing quality data.',
            detail: 'Optimization decisions rely on gut feel and delayed data. Your writing quality insights rarely feed back into content updates in a timely way.',
          },
          aiAgents: {
            summary: 'AI recommends optimizations based on writing quality signals and historical performance.',
            detail: 'Optimization agents suggest specific changes tied to your writing quality metrics. You approve and prioritize recommendations rather than diagnosing issues manually.',
          },
          aiAgentic: {
            summary: 'Autonomous optimization agents improve content continuously using writing quality signals — you set boundaries.',
            detail: 'Optimization agents test, iterate, and improve content based on writing quality data within your guardrails. You define acceptable ranges and review significant changes.',
          },
        },
        'brief-approval': {
          preAI: {
            summary: 'Brief approvals are bottlenecked by manual review cycles that delay your writing quality work.',
            detail: 'You wait for briefs to pass through approval chains before your writing quality tasks can begin. Unclear approval criteria mean briefs bounce back and forth repeatedly.',
          },
          aiAgents: {
            summary: 'AI pre-screens briefs for writing quality alignment, routing only exceptions to you.',
            detail: 'Approval agents check briefs against your writing quality criteria and flag gaps. You review flagged items rather than reading every brief end to end.',
          },
          aiAgentic: {
            summary: 'Autonomous approval agents clear standard briefs and escalate only writing quality exceptions to you.',
            detail: 'Approval agents validate briefs against your writing quality criteria and auto-approve routine requests. You handle strategic exceptions and edge cases only.',
          },
        },
        'brand-review': {
          preAI: {
            summary: 'Brand reviews are subjective gates that slow your writing quality pipeline.',
            detail: 'Reviewers apply brand guidelines inconsistently. What passes one review fails the next, creating unpredictable delays in your writing quality workflow.',
          },
          aiAgents: {
            summary: 'AI brand agents pre-score content, surfacing writing quality issues before your review.',
            detail: 'Brand review agents apply guidelines consistently and flag writing quality deviations. You handle exceptions and judgment calls rather than full content scans.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents review all content at scale — you govern writing quality policy evolution.',
            detail: 'Brand review agents handle all compliance checking autonomously with your writing quality rules. You update brand guidelines and review the rare edge case that requires human judgment.',
          },
        },
        'stakeholder-signoff': {
          preAI: {
            summary: 'Stakeholder sign-off is a bottleneck where executives delay your writing quality timelines.',
            detail: 'Senior approvers are busy and unresponsive. Your writing quality work stalls while waiting for sign-off, and last-minute changes create downstream chaos.',
          },
          aiAgents: {
            summary: 'AI prepares sign-off packages with writing quality summaries for faster executive approval.',
            detail: 'Sign-off agents compile context, changes, and writing quality impact assessments for approvers. Executives review structured summaries rather than raw content.',
          },
          aiAgentic: {
            summary: 'Autonomous agents handle routine sign-offs within writing quality parameters — executives approve strategy only.',
            detail: 'Sign-off agents clear content that meets all writing quality criteria automatically. Executives only review strategic pivots or high-risk content that breaches defined thresholds.',
          },
        },
        'performance-review': {
          preAI: {
            summary: 'Performance reviews are infrequent manual assessments that underserve your writing quality needs.',
            detail: 'Reviews happen quarterly at best, using outdated data. Your writing quality perspective is often missing from the evaluation criteria entirely.',
          },
          aiAgents: {
            summary: 'AI evaluates content against KPIs and highlights writing quality trends for your review.',
            detail: 'Review agents surface performance data with writing quality context pre-attached. You make optimize/archive decisions based on structured analysis rather than raw metrics.',
          },
          aiAgentic: {
            summary: 'Autonomous review agents evaluate and act on performance with writing quality logic — you set the framework.',
            detail: 'Review agents continuously assess content against your writing quality KPIs and trigger optimize/refresh/archive workflows automatically. You define the evaluation framework.',
          },
        },
        'social-listening': {
          preAI: {
            summary: 'Social listening is ad hoc keyword monitoring with no systematic link to writing quality.',
            detail: 'You check social platforms manually for relevant conversations. Insights rarely reach your writing quality workflow before they become stale or irrelevant.',
          },
          aiAgents: {
            summary: 'AI monitoring tools surface trending topics and sentiment relevant to writing quality in real time.',
            detail: 'Listening agents track conversations and flag writing quality signals across platforms. You act on curated insights rather than monitoring feeds manually.',
          },
          aiAgentic: {
            summary: 'Autonomous listening agents track and respond to writing quality signals across all platforms in real time.',
            detail: 'Listening agents monitor social channels and proactively surface writing quality opportunities and risks. You set monitoring priorities and review strategic findings.',
          },
        },
        'visual-asset-creation': {
          preAI: {
            summary: 'Visual asset creation is a slow design queue disconnected from your writing quality needs.',
            detail: 'Design requests go into a backlog with unclear priorities. Your writing quality requirements are often lost in translation between brief and final asset.',
          },
          aiAgents: {
            summary: 'AI design tools generate asset options aligned with writing quality requirements.',
            detail: 'Design agents produce visual variants following your writing quality guidelines. You select and refine from AI-generated options rather than directing from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous design agents produce visual assets within writing quality guidelines — you set creative direction.',
            detail: 'Design agents generate publication-ready visuals following your writing quality standards. You define the creative vision and approve hero assets while routine visuals ship autonomously.',
          },
        },
        'legal-review': {
          preAI: {
            summary: 'Legal review is an opaque process that creates unpredictable delays in your writing quality work.',
            detail: 'Legal feedback arrives late with minimal context. You cannot predict how long review will take, making writing quality planning unreliable.',
          },
          aiAgents: {
            summary: 'AI legal screening flags compliance risks early, reducing writing quality surprises downstream.',
            detail: 'Legal agents pre-scan content for regulatory issues and writing quality risks. You get early warnings rather than discovering problems at the sign-off stage.',
          },
          aiAgentic: {
            summary: 'Autonomous legal agents clear routine content and escalate only true writing quality risks to human counsel.',
            detail: 'Legal agents scan and clear standard content autonomously using your writing quality rule framework. Human lawyers handle novel risk scenarios and precedent-setting decisions only.',
          },
        },
        'localize-content': {
          preAI: {
            summary: 'Localization is a slow, manual translation process that delays your writing quality for global markets.',
            detail: 'Each market requires separate translation, cultural review, and compliance checking. Your writing quality suffers because localized versions lag weeks behind the original.',
          },
          aiAgents: {
            summary: 'AI translation agents accelerate localization while respecting writing quality requirements.',
            detail: 'Localization agents produce initial translations with writing quality context preserved. You review for cultural nuance rather than translating from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous localization agents adapt content for all markets simultaneously — your writing quality scales globally.',
            detail: 'Localization agents handle translation, cultural adaptation, and regional compliance autonomously. Your writing quality is maintained across markets without manual per-locale effort.',
          },
        },
        'ab-variant-creation': {
          preAI: {
            summary: 'A/B variants are created manually with limited connection to your writing quality hypotheses.',
            detail: 'Test variants rely on guesswork rather than data. Your writing quality insights rarely inform variant design, reducing the value of testing efforts.',
          },
          aiAgents: {
            summary: 'AI generates test variants informed by writing quality data and historical performance.',
            detail: 'Variant agents create headlines, CTAs, and imagery options based on your writing quality hypotheses. You select winning approaches rather than brainstorming from zero.',
          },
          aiAgentic: {
            summary: 'Autonomous variant agents design, deploy, and learn from tests using writing quality hypotheses — you set the agenda.',
            detail: 'Variant agents run continuous testing experiments informed by your writing quality objectives. You define what to test and review strategic learnings while the system iterates autonomously.',
          },
        },
        'content-repurposing': {
          preAI: {
            summary: 'Content repurposing is manual reformatting, disconnected from your writing quality goals.',
            detail: 'Each derivative asset is created from scratch. Your writing quality requirements are not systematically applied when repurposing content across formats.',
          },
          aiAgents: {
            summary: 'AI repurposing agents derive secondary assets with writing quality consistency built in.',
            detail: 'Repurposing agents transform primary content into channel-specific formats following your writing quality guidelines. You approve derivatives rather than recreating each manually.',
          },
          aiAgentic: {
            summary: 'Autonomous repurposing agents derive all secondary assets automatically within writing quality guidelines.',
            detail: 'Repurposing agents transform primary content into every derivative format following your writing quality rules. You set format strategy while the system handles production at scale.',
          },
        },
        'archive-tag': {
          preAI: {
            summary: 'Content archiving is inconsistent, making writing quality-related retrieval nearly impossible.',
            detail: 'Tagging and taxonomy are applied inconsistently or not at all. Finding past content relevant to writing quality requires searching through unstructured repositories.',
          },
          aiAgents: {
            summary: 'AI tagging agents classify content automatically, making writing quality retrieval faster.',
            detail: 'Archive agents apply taxonomy and metadata based on your writing quality categories. You validate classifications rather than manually tagging every asset.',
          },
          aiAgentic: {
            summary: 'Autonomous archive agents maintain perfect taxonomy — writing quality retrieval is instant and reliable.',
            detail: 'Archive agents classify, tag, and organize all content using your writing quality taxonomy automatically. You evolve the taxonomy structure while the system maintains it flawlessly.',
          },
        },
        'legal-compliance-gate': {
          preAI: {
            summary: 'Legal compliance gates create unpredictable holds that delay your writing quality deadlines.',
            detail: 'Legal sign-off timing is opaque and variable. Your writing quality timelines are at the mercy of legal review queues with no visibility into status.',
          },
          aiAgents: {
            summary: 'AI pre-screening reduces legal gate delays by resolving routine writing quality checks automatically.',
            detail: 'Compliance agents handle standard checks and only escalate writing quality edge cases to human lawyers. Your timelines are more predictable because routine items clear faster.',
          },
          aiAgentic: {
            summary: 'Autonomous compliance gates clear routine content instantly — only novel writing quality risks reach human lawyers.',
            detail: 'Compliance agents handle standard legal checks autonomously using your writing quality risk framework. Human review is reserved for unprecedented scenarios and policy updates.',
          },
        },
        'localization-quality-gate': {
          preAI: {
            summary: 'Localization quality gates are inconsistent, creating writing quality risks in global markets.',
            detail: 'Quality checks for localized content vary by market and reviewer. Your writing quality standards are unevenly applied across regions and languages.',
          },
          aiAgents: {
            summary: 'AI quality checks catch translation errors before they affect your writing quality outcomes.',
            detail: 'Localization QA agents verify accuracy and cultural fit automatically. Your writing quality standards are applied consistently across all target markets.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents ensure localization quality across all markets — writing quality is guaranteed globally.',
            detail: 'Localization QA agents validate every market adaptation autonomously against your writing quality standards. You set quality criteria while the system enforces them at scale.',
          },
        },
        'segment-mapping': {
          preAI: {
            summary: 'Segment mapping is manual spreadsheet work with limited visibility into writing quality impact.',
            detail: 'Mapping content variants to audience segments is done in spreadsheets. Your writing quality data is disconnected from the personalization logic.',
          },
          aiAgents: {
            summary: 'AI agents map variants to segments using writing quality data from the CDP.',
            detail: 'Segment agents recommend variant-audience matches based on your writing quality signals. You review the mapping rather than building it manually in spreadsheets.',
          },
          aiAgentic: {
            summary: 'Autonomous segment agents map and optimize variant-audience matches using live writing quality signals.',
            detail: 'Segment agents continuously refine variant-audience mappings based on real-time writing quality data. You define segmentation strategy while the system executes and optimizes automatically.',
          },
        },
        'dynamic-assembly': {
          preAI: {
            summary: 'Dynamic content assembly is rigid and template-bound, limiting your writing quality options.',
            detail: 'Personalized experiences require engineering support for each variant. Your writing quality vision is constrained by inflexible assembly templates.',
          },
          aiAgents: {
            summary: 'AI assembly agents construct personalized experiences informed by writing quality rules.',
            detail: 'Assembly agents combine content components per segment following your writing quality logic. You define rules and review outputs rather than manually configuring each variant.',
          },
          aiAgentic: {
            summary: 'Autonomous assembly agents construct personalized experiences in real time — writing quality logic is self-optimizing.',
            detail: 'Assembly agents build dynamic experiences per segment using your writing quality rules and real-time behavioral signals. You govern personalization policies, not individual assembly configurations.',
          },
        },
        'personalization-qa': {
          preAI: {
            summary: 'Personalization QA is manual spot-checking that misses writing quality gaps.',
            detail: 'Testing every segment-variant combination is impossible manually. Your writing quality concerns are only caught when users report issues post-launch.',
          },
          aiAgents: {
            summary: 'AI QA agents validate personalization coverage and flag writing quality gaps before launch.',
            detail: 'QA agents test every segment-variant combination against your writing quality requirements. You review exception reports rather than manually spot-checking combinations.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents validate every personalization scenario — writing quality gaps are caught before launch.',
            detail: 'Personalization QA agents test all segment-variant combinations against your writing quality requirements automatically. You set acceptance criteria while the system validates at scale.',
          },
        },
        'campaign-planning': {
          preAI: {
            summary: 'Campaign planning is a manual coordination effort with fragmented writing quality inputs.',
            detail: 'Campaign plans are built in decks and spreadsheets with incomplete data. Your writing quality perspective is often incorporated too late in the planning cycle.',
          },
          aiAgents: {
            summary: 'AI planning agents draft campaign frameworks with writing quality data pre-integrated.',
            detail: 'Planning agents pull audience, budget, and performance data into campaign templates. Your writing quality priorities shape the plan from the start rather than being retrofitted.',
          },
          aiAgentic: {
            summary: 'Autonomous planning agents generate campaign frameworks using writing quality intelligence — you set objectives.',
            detail: 'Planning agents produce data-driven campaign plans with your writing quality priorities embedded. You define strategic goals while the system optimizes tactics and resource allocation.',
          },
        },
        'consent-check': {
          preAI: {
            summary: 'Consent checking is a manual compliance step that adds friction to your writing quality process.',
            detail: 'Verifying GDPR/CCPA consent for targeting requires manual cross-referencing. Your writing quality work is delayed while compliance status is manually confirmed.',
          },
          aiAgents: {
            summary: 'AI consent agents verify targeting compliance automatically, reducing writing quality friction.',
            detail: 'Consent agents cross-reference CDP signals against GDPR/CCPA rules for your writing quality needs. You handle exceptions rather than manually verifying every segment.',
          },
          aiAgentic: {
            summary: 'Autonomous consent agents enforce privacy compliance at scale — writing quality is guaranteed by architecture.',
            detail: 'Consent agents verify targeting compliance in real time across all segments using your writing quality framework. You set privacy policies while the system enforces them automatically.',
          },
        },
        'paid-creative-production': {
          preAI: {
            summary: 'Paid creative production runs separately from organic, fragmenting your writing quality oversight.',
            detail: 'Ad creative and organic content are produced in silos. Your writing quality perspective is applied inconsistently between paid and organic channels.',
          },
          aiAgents: {
            summary: 'AI production agents generate paid variants from organic content with writing quality consistency.',
            detail: 'Paid creative agents adapt organic content for ad platforms following your writing quality guidelines. You approve and fine-tune rather than producing ad creative from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous production agents create paid variants at scale within writing quality guardrails — you set the strategy.',
            detail: 'Paid creative agents generate ad variants from organic content following your writing quality guidelines. You define creative strategy while the system produces and optimizes at scale.',
          },
        },
        'attribution-modeling': {
          preAI: {
            summary: 'Attribution modeling is manual and unreliable, undermining your writing quality reporting.',
            detail: 'Last-click attribution dominates despite its flaws. Your writing quality decisions lack the multi-touch perspective needed for accurate performance assessment.',
          },
          aiAgents: {
            summary: 'AI attribution models surface multi-touch insights relevant to your writing quality priorities.',
            detail: 'Attribution agents calculate content ROI across channels using your writing quality weightings. You interpret strategic implications rather than building models manually.',
          },
          aiAgentic: {
            summary: 'Autonomous attribution agents run multi-touch models continuously — writing quality insights update in real time.',
            detail: 'Attribution agents calculate content ROI across all channels using your writing quality framework. You interpret strategic implications while the system handles modeling complexity.',
          },
        },
        'executive-reporting': {
          preAI: {
            summary: 'Executive reports are manually assembled, often missing the writing quality narrative you need.',
            detail: 'Building executive dashboards takes hours of data wrangling. The writing quality story you want to tell is lost in generic reporting templates.',
          },
          aiAgents: {
            summary: 'AI builds executive dashboards with writing quality narratives pre-drafted for leadership.',
            detail: 'Reporting agents synthesize data into executive formats with your writing quality story embedded. You refine the narrative rather than assembling data from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce executive dashboards with writing quality narratives — you add strategic context.',
            detail: 'Executive reporting agents synthesize all data into leadership-ready formats with your writing quality story embedded. You provide strategic commentary on auto-generated insights.',
          },
        },
        'competitive-response': {
          preAI: {
            summary: 'Competitive response is slow and reactive, giving you no writing quality advantage.',
            detail: 'By the time you spot a competitor move and respond, the moment has passed. Your writing quality approach cannot adapt fast enough to real-time competitive signals.',
          },
          aiAgents: {
            summary: 'AI competitive agents surface signals and draft responses aligned with writing quality strategy.',
            detail: 'Competitive agents monitor market moves and suggest writing quality-aligned responses. You approve and refine reactive content rather than spotting threats manually.',
          },
          aiAgentic: {
            summary: 'Autonomous competitive agents detect and draft responses in real time — writing quality moves are countered instantly.',
            detail: 'Competitive agents monitor signals, draft responses, and deploy within your writing quality guardrails. You approve high-stakes responses while routine reactions ship autonomously.',
          },
        },
        'content-governance': {
          preAI: {
            summary: 'Content governance is periodic manual auditing that cannot keep pace with your writing quality standards.',
            detail: 'Live content drifts out of compliance between infrequent reviews. Your writing quality requirements are only enforced when someone manually checks.',
          },
          aiAgents: {
            summary: 'AI governance agents continuously audit live content against writing quality standards.',
            detail: 'Governance agents flag content drift, compliance gaps, and writing quality issues in real time. You review flagged items rather than conducting manual audits.',
          },
          aiAgentic: {
            summary: 'Autonomous governance agents audit all live content continuously — writing quality compliance is always current.',
            detail: 'Governance agents monitor every published piece against your writing quality standards in real time. You evolve governance policies while the system enforces them perpetually.',
          },
        },
        'governance-gate': {
          preAI: {
            summary: 'Governance gates are calendar-driven checkpoints disconnected from your writing quality rhythm.',
            detail: 'Governance reviews happen on a fixed schedule regardless of content velocity. Your writing quality concerns may not surface until the next quarterly review.',
          },
          aiAgents: {
            summary: 'AI governance gates run continuous checks, surfacing writing quality issues between formal reviews.',
            detail: 'Governance agents validate live content against your writing quality criteria on an ongoing basis. You act on exception alerts rather than waiting for quarterly reviews.',
          },
          aiAgentic: {
            summary: 'Autonomous governance gates run continuously — writing quality violations trigger immediate remediation.',
            detail: 'Governance agents validate live content against your writing quality criteria continuously and auto-trigger refresh or retirement workflows. You set policies, not review schedules.',
          },
        },
        'journey-mapping': {
          preAI: {
            summary: 'Journey mapping is a manual exercise that rarely reflects your writing quality reality.',
            detail: 'Customer journey maps are created in workshops and quickly go stale. Your writing quality perspective is a snapshot, not a living view of how content performs at each stage.',
          },
          aiAgents: {
            summary: 'AI journey agents map content to lifecycle stages using writing quality data from the CDP.',
            detail: 'Journey agents dynamically map content to customer stages based on your writing quality framework. You validate the mapping rather than building it manually in workshops.',
          },
          aiAgentic: {
            summary: 'Autonomous journey agents maintain living maps using real-time writing quality data — you shape the strategy.',
            detail: 'Journey agents dynamically map content to lifecycle stages using live writing quality signals. You define journey frameworks while the system optimizes content placement continuously.',
          },
        },
        'sentiment-monitoring': {
          preAI: {
            summary: 'Sentiment monitoring is sporadic manual checking with no systematic link to writing quality.',
            detail: 'You check brand sentiment reactively rather than proactively. Your writing quality decisions are made without real-time audience feedback signals.',
          },
          aiAgents: {
            summary: 'AI sentiment agents track brand reception in real time, alerting you to writing quality risks.',
            detail: 'Sentiment agents analyze audience reactions and flag writing quality concerns before they escalate. You respond to alerts rather than manually checking platforms.',
          },
          aiAgentic: {
            summary: 'Autonomous sentiment agents monitor and respond to writing quality signals around the clock — you govern escalation.',
            detail: 'Sentiment agents track audience reactions and trigger writing quality responses automatically. You set escalation thresholds and review strategic implications of sentiment shifts.',
          },
        },
        'sales-enablement': {
          preAI: {
            summary: 'Sales enablement content is created ad hoc, disconnected from your writing quality strategy.',
            detail: 'Sales teams request materials outside the content pipeline. Your writing quality standards are not applied to battle cards, decks, and one-pagers created in isolation.',
          },
          aiAgents: {
            summary: 'AI agents generate sales materials from marketing content with writing quality alignment.',
            detail: 'Sales enablement agents transform marketing assets into battle cards and decks following your writing quality standards. You approve rather than creating each piece manually.',
          },
          aiAgentic: {
            summary: 'Autonomous enablement agents keep sales materials current with writing quality alignment — you set the playbook.',
            detail: 'Enablement agents automatically update battle cards, decks, and case studies as your writing quality data evolves. You define the sales narrative while the system produces materials at scale.',
          },
        },
        'influencer-brief': {
          preAI: {
            summary: 'Influencer briefs are manual documents with limited writing quality guardrails.',
            detail: 'Creator briefs are written from scratch each time. Your writing quality guidelines are inconsistently communicated to external partners and influencers.',
          },
          aiAgents: {
            summary: 'AI agents draft influencer briefs with writing quality guardrails embedded automatically.',
            detail: 'Brief agents generate creator guidelines from your writing quality requirements and past successful collaborations. You customize rather than writing each brief from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous brief agents generate creator guidelines with writing quality guardrails — you approve partnerships.',
            detail: 'Brief agents produce personalized influencer guidelines using your writing quality framework and creator history. You focus on relationship strategy while briefs ship autonomously.',
          },
        },
        'ugc-moderation': {
          preAI: {
            summary: 'UGC moderation is manual screening that cannot scale to protect writing quality.',
            detail: 'User-generated content is reviewed one piece at a time. Your writing quality standards cannot be consistently enforced across the volume of submissions.',
          },
          aiAgents: {
            summary: 'AI moderation agents screen UGC for brand safety and writing quality compliance at scale.',
            detail: 'Moderation agents filter user-generated content against your writing quality criteria. You review borderline cases rather than manually screening every submission.',
          },
          aiAgentic: {
            summary: 'Autonomous moderation agents screen all UGC for writing quality compliance at scale — you govern edge cases.',
            detail: 'Moderation agents filter user-generated content using your writing quality rules continuously. You update moderation policies and review borderline cases that the system escalates.',
          },
        },
        'content-scoring': {
          preAI: {
            summary: 'Content scoring is subjective prioritization that underweights your writing quality criteria.',
            detail: 'Requests are prioritized by loudest voice or executive fiat. Your writing quality scoring criteria are rarely part of the formal prioritization framework.',
          },
          aiAgents: {
            summary: 'AI scoring agents rank requests using writing quality criteria alongside strategic priority.',
            detail: 'Scoring agents weight your writing quality factors into the prioritization algorithm. You adjust rankings rather than scoring each request manually.',
          },
          aiAgentic: {
            summary: 'Autonomous scoring agents prioritize the pipeline using writing quality criteria — you set strategic weights.',
            detail: 'Scoring agents rank and route content requests using your writing quality priorities in real time. You define scoring criteria and review the queue rather than manually triaging.',
          },
        },
        'channel-orchestration': {
          preAI: {
            summary: 'Channel orchestration is manual coordination with no systematic writing quality integration.',
            detail: 'Cross-channel timing is managed in spreadsheets and Slack. Your writing quality requirements for sequencing and coordination are often overridden by ad hoc changes.',
          },
          aiAgents: {
            summary: 'AI orchestration agents sequence distribution with writing quality rules for timing and cadence.',
            detail: 'Orchestration agents coordinate cross-channel timing based on your writing quality requirements. You set rules and review the sequence rather than managing each channel individually.',
          },
          aiAgentic: {
            summary: 'Autonomous orchestration agents manage all channel timing with writing quality logic — you set the playbook.',
            detail: 'Orchestration agents handle cross-channel sequencing, timing, and coordination autonomously using your writing quality rules. You evolve the orchestration strategy while the system executes.',
          },
        },
      },
      keyInsight: 'The Editor\'s paradox: as AI automation eliminates the mechanical work (grammar, keyword density, basic structure), the role becomes simultaneously less visible and more essential. The value shifts from "catching errors" to "defining excellence." In a world where any system can produce technically correct content in minutes, the Editor\'s remaining superpower — taste, voice coherence, audience resonance — is what separates adequate from compelling.',
    },
  },


  // ═══════════════════════════════════════════════════════════════════════════
  // ROLE 4: VP MARKETING / STAKEHOLDER
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'vp-marketing',
    title: 'VP Marketing / Stakeholder',
    description: 'The executive approver who controls publish timing, distribution, and strategic sign-off. The scarcest resource in the pipeline — every hour of VP Marketing time gates millions in downstream execution.',
    tagline: 'Your time is the scarcest resource — the system should protect it.',
    iconName: 'Award',
    category: 'strategy',
    accentColor: '#E6C84C',
    ownedSteps: ['schedule-publish', 'distribute'],
    reviewedGates: ['stakeholder-signoff'],
    relatedAgents: [],
    relatedInputs: ['content-strategy'],
    narrative: {
      stageOverviews: {
        preAI: {
          narrative: 'VP Marketing governance is a batched approval bottleneck. Every scheduling decision, distribution confirmation, and campaign sign-off flows through one person\'s calendar. The role is 60% coordination logistics and 40% strategic judgment — an inversion that wastes the organization\'s most expensive decision-maker on the organization\'s most automatable work.',
          timeAllocation: '40% scheduling and coordination, 25% stakeholder sign-off reviews, 20% distribution logistics, 15% strategic planning',
          criticalMetrics: ['Brief-to-launch cycle time', 'Approval queue depth', 'On-time launch rate', 'Time spent on routine vs. strategic approvals', 'Distribution synchronization accuracy'],
          strategicOpportunity: '61% of CMOs report plans driven by operational needs, not market opportunity. The VP Marketing role has the highest leverage for AI-driven time recovery — every hour freed from coordination is an hour available for market strategy.',
        },
        aiAgents: {
          narrative: 'AI agents absorb the coordination layer: modeling resource capacity, proposing publish windows, pre-screening briefs against decision frameworks. The VP Marketing shifts from scheduling coordinator to strategic decision-maker, reviewing exception cards rather than managing calendars.',
          timeAllocation: '10% scheduling oversight, 15% strategic brief review, 25% distribution monitoring, 30% strategic planning, 20% stakeholder alignment',
          criticalMetrics: ['Agent-recommended approval accuracy', 'Approval cycle time (target: 1-2 days)', 'On-time launch rate (target: 88-92%)', 'Time recaptured for strategic work', 'Distribution synchronization window'],
          strategicOpportunity: 'The 40-50% of time freed from coordination creates space for proactive market-oriented planning — responding to competitive moves, capitalizing on market shifts, and setting strategic direction rather than managing operational logistics.',
        },
        aiAgentic: {
          narrative: 'The VP Marketing becomes a policy governor and strategic override authority. Agentic systems autonomously optimize scheduling, distribution, and routine approvals within guardrails the VP sets quarterly. Human judgment concentrates on the 5-10 escalated decisions per week where market context, competitive dynamics, and organizational strategy intersect.',
          timeAllocation: '5% system monitoring, 15% guardrail updates, 10% escalated approvals, 40% strategic planning, 30% cross-functional leadership',
          criticalMetrics: ['Autonomous approval rate', 'Escalation quality (signal-to-noise ratio)', 'Portfolio compliance rate', 'Market response time', 'Strategic initiative velocity'],
          strategicOpportunity: 'The role\'s value proposition inverts: instead of being measured by approvals processed, the VP Marketing is measured by the quality of the strategic guardrails they set and the market opportunities they capture with the time freed from operational overhead.',
        },
      },
      nodeJourneys: {
        'schedule-publish': {
          preAI: {
            summary: 'Weekly edit calendar meetings where VP Marketing timestamps launch windows across 8-12 campaigns manually. Each meeting requires 60-90 minutes of debate over optimal timing, with decisions frequently reversed as new competitive or market signals surface mid-cycle.',
            detail: 'VP Marketing coordinates with product, sales, and regional teams to slot campaigns into publishing windows. The process relies on email chains, shared spreadsheets, and calendar conflicts. Timing decisions often reverse after campaigns are built because new competitive activity or market events surface mid-cycle. The actual approval takes 10 minutes; the coordination takes 2 weeks. Brief-to-launch for enterprise campaigns typically stretches 2+ weeks with this standard approval chain.',
            painPoints: [
              'Time zone and regional activation coordination introduces 3-5 day delays per iteration',
              'No visibility into downstream resource constraints (design queue, copy reviews, performance partner readiness)',
              'Changing one timestamp cascades across distribution partners, calendars, and vendor timelines',
              'Ad hoc timing decisions made after approval (sales pressure, competitive moves) undermine the schedule without formal re-review',
            ],
            benchmarks: [
              'Enterprise campaign brief-to-launch: typically 2+ weeks with standard approval chains',
              '40% of CMOs take proactive, market-oriented planning approach (Gartner 2024)',
            ],
            outcomes: [
              'Scheduled campaigns go live on the planned date 65-75% of the time',
              'Timing conflicts resolved via escalation, not prediction',
            ],
            roleEvolution: 'VP Marketing attends 3-4 scheduling sessions weekly, reads 40+ emails on timing disputes, and manually inputs final decisions into a spreadsheet. The role feels administrative despite the strategic seniority.',
          },
          aiAgents: {
            summary: 'AI agents model resource capacity, competitive intelligence, and regional performance patterns to propose optimal publish windows 48 hours before launch. VP Marketing approves or adjusts in 5 minutes via a visual approval card.',
            detail: 'Automated agents ingest design queue status, copy review bandwidth, performance partner capacity, and historical performance data for similar content. They cross-reference competitive activity feeds and sentiment trends. The system generates a ranked list of 3 optimal publish windows, each with predicted reach, engagement, and resource contention. VP Marketing sees a simple approval card and can approve with one click or drag-adjust the window with downstream impact simulation in 20 seconds.',
            painPoints: [
              'Agents must integrate with 4+ disparate scheduling and planning systems (campaign management, design tools, email providers, social platforms)',
              'Predicting optimal timing requires historical performance data that is often incomplete or siloed by channel',
              'VP Marketing still needs context on why the system recommends a specific window — black-box optimization breeds skepticism and ignores strategic nuance',
            ],
            benchmarks: [
              'Risk-based approval tiers reduce cycle time 30-50% (Salesforce State of Marketing 2024)',
              'AI-driven scheduling improves on-time delivery to 88-92% (industry composite)',
            ],
            outcomes: [
              'Schedule approval time drops from 60-90 minutes to 5 minutes per batch',
              'Campaigns launch on schedule 88-92% of the time (vs. 65-75%)',
              'Timing conflicts reduced by 70% via predictive resource modeling',
            ],
            roleEvolution: 'VP Marketing reviews a visual approval dashboard for 2-3 minutes daily. The role shifts from reactive scheduling coordinator to strategic decision-maker on outlier requests.',
          },
          aiAgentic: {
            summary: 'Agentic systems autonomously optimize publish windows within guardrails set by VP Marketing (brand sensitivity, earnings blackout periods, regional thresholds). VP Marketing intervenes only when market signals trigger a strategic override.',
            detail: 'The system owns schedule optimization end-to-end. It monitors real-time competitive activity, sentiment velocity, and performance partner capacity. It auto-adjusts windows for lower-priority campaigns when high-priority campaigns face resource contention. For high-stakes launches, the system flags timing decisions for VP Marketing review. VP Marketing sets policy once: "All earnings-period content requires approval. Regional campaigns auto-optimize. Product launches must clear the 72-hour pre-announcement blackout." When unexpected events occur, the system detects the signal, recalculates impact, and either auto-executes or escalates with a clear decision brief.',
            painPoints: [
              'Defining the guardrails is itself a strategic exercise — VP Marketing must codify judgment rules that usually live in their head',
              'The agentic layer must distinguish between "override the system" (market emergency) and "the system is wrong" (strategic blindness)',
              'Autonomous decision-making erodes accountability if the system makes a high-visibility mistake',
            ],
            benchmarks: [
              '78% of marketing leadership would delegate tactical scheduling if guardrails were transparent (Gartner 2024)',
              'Agentic systems reduce approval latency to <5 minutes for 95%+ of campaigns (industry composite)',
            ],
            outcomes: [
              'VP Marketing approval time drops to near-zero for routine campaigns; 15-minute deep reviews reserved for strategic decisions',
              'Schedule optimization runs continuously; timing decisions reflect real-time market conditions, not weekly snapshots',
              'On-time launch rate reaches 95%+; cascading delays eliminated via predictive rescheduling',
            ],
            roleEvolution: 'VP Marketing transitions to a "policy governor" and "tie-breaker" role. They set strategic guardrails once per quarter, review escalated decisions (5-10 per week), and intervene when market signals trigger override scenarios.',
          },
        },
        'distribute': {
          preAI: {
            summary: 'VP Marketing manually coordinates with 4-8 distribution partners (social, email, paid, affiliate, partner networks) to ensure campaigns launch synchronously. Confirmations and follow-ups consume 2-3 hours per campaign.',
            detail: 'Distribution is a manual relay race. VP Marketing approves content, then sends it to social media managers, email marketers, paid media buyers, affiliate leads, and partner network leads. Each partner has their own intake process. Follow-ups are constant. Partners often report ready-to-go but then hit resource constraints or platform outages at launch time. The actual distribution button is pressed by 6+ people, each adding 2-6 hours of latency.',
            painPoints: [
              'No single source of truth on distribution status across channels; VP Marketing manually tracks via email threads and Slack',
              'Partners queue campaigns manually, introducing data entry errors and priority misclassifications',
              'Platform outages and partner bandwidth constraints force last-minute delays without systematic contingency planning',
              'No coordination between channels leads to duplicate messaging or uneven reach',
            ],
            benchmarks: [
              '40% of multi-channel campaigns experience >4 hour delays between channels (industry composite)',
              'VP Marketing spends 2-3 hours per campaign on distribution logistics (Gartner CMO Survey)',
            ],
            outcomes: [
              'Campaigns distributed across channels within plus/minus 6 hour windows 70% of the time',
              'Campaign reach uneven across channels due to timing misalignment',
            ],
            roleEvolution: 'VP Marketing spends 10+ hours per week chasing distribution partners. The role is dominated by coordination, not strategy.',
          },
          aiAgents: {
            summary: 'AI agents ingest approved creative and automatically queue it across all distribution channels with real-time conflict detection. VP Marketing sees a unified distribution dashboard and only intervenes on partner bottlenecks.',
            detail: 'Once VP Marketing approves a campaign, the distribution layer automatically routes assets to all relevant channels. Agents connect to social platforms, email service providers, paid media networks, and affiliate systems via APIs. They resolve format differences and queue content at the optimal pre-scheduled time. Real-time checks detect platform outages, partner capacity constraints, and compliance issues. VP Marketing sees a visual status dashboard with issues surfaced as decision cards, not email threads.',
            painPoints: [
              'Integrating with legacy systems requires custom adapters and ongoing maintenance',
              'Format translation and creative optimization can break brand guidelines if not carefully parameterized',
              'Partner APIs change frequently; agents must be reconfigured when systems update',
            ],
            benchmarks: [
              'AI-driven distribution reduces VP Marketing time per campaign from 2-3 hours to 15 minutes (industry composite)',
              'Multi-channel synchronization improves to plus/minus 2 hour windows (Salesforce 2024)',
            ],
            outcomes: [
              'Distribution across 6+ channels happens in <30 minutes after approval',
              'Partner bottlenecks identified and escalated 24 hours before launch, not during',
              'Multi-channel reach aligned; consistent performance across all channels',
            ],
            roleEvolution: 'VP Marketing monitors a real-time distribution dashboard. Tactical work (queueing, format handling, partner coordination) disappears. The role refocuses on escalation decisions and performance accountability.',
          },
          aiAgentic: {
            summary: 'Agentic systems manage the entire distribution lifecycle — queueing, monitoring, contingency execution, and performance feedback. VP Marketing sees only summary status and intervenes only for strategic conflicts or performance anomalies.',
            detail: 'Distribution becomes a closed-loop system. Agents autonomously queue approved creative, monitor real-time delivery across all channels, and execute contingency plans if issues arise. The system learns which channels perform best for which content types and optimizes distribution weight dynamically. After distribution, agents track performance signals and feed learnings back to content and scheduling layers. VP Marketing sees a weekly summary and intervenes only when performance signals suggest a systematic issue or a strategic override is needed.',
            painPoints: [
              'Agentic distribution must distinguish between acceptable variance and genuine problems; false alarms erode trust',
              'Learning which channels to prioritize requires multivariate testing and sustained performance monitoring',
              'Autonomous distribution reduces human visibility into partner behavior; if a vendor degrades service, the agentic layer might mask the problem until it becomes critical',
            ],
            benchmarks: [
              '95%+ on-time delivery with agentic systems (Salesforce Agentforce 2025)',
              'Multi-channel coordination latency <2 minutes (industry composite)',
              'Partner bottleneck detection 72 hours in advance (industry composite)',
            ],
            outcomes: [
              'VP Marketing intervention time for distribution issues drops to <2 hours per month',
              'Campaigns reach all channels within 5-minute windows; synchronized messaging maximized',
              'Performance feedback flows back to content and strategy layers daily, enabling rapid iteration',
            ],
            roleEvolution: 'VP Marketing becomes a performance auditor and strategic override authority. They set distribution policies, review performance weekly, and intervene when the agentic layer flags anomalies or when market conditions demand tactical changes.',
          },
        },
        'stakeholder-signoff': {
          preAI: {
            summary: 'VP Marketing conducts async review of campaign briefs, creative concepts, and performance forecasts across email, Slack, and meetings. Approval cycles stretch 5-7 days with back-and-forth clarifications that add coordination cost without adding strategic value.',
            detail: 'Stakeholder signoff is the formal gating step before production begins. Campaign teams submit briefs for VP Marketing approval. The brief might arrive in a Google Doc, a Slack thread, or a dedicated approval tool. VP Marketing reads it, identifies risks, and either approves or requests revisions. The typical cycle: brief submitted Monday, VP reviews Tuesday, requests clarifications Wednesday, team revises Thursday, final approval Friday. The actual review takes 20-30 minutes; the coordination takes 5-7 days.',
            painPoints: [
              'VP Marketing must context-switch between 10+ concurrent review cycles; fatigue leads to approval delays or shallow reviews',
              'No systematic connection between approved campaigns and actual execution; deviations happen after approval without re-review',
              'Approval criteria are subjective and vary by VP; teams guess at what will pass',
              'Stakeholder sign-off is async and text-based; context is lost, leading to misalignment',
            ],
            benchmarks: [
              '61% of CMOs report plans driven by operational needs, not market opportunity (Gartner 2024)',
              'Average approval cycle: 5-7 days for enterprise campaigns (Adobe Content Supply Chain)',
            ],
            outcomes: [
              'Stakeholder sign-off rate on first submission: 45-55%',
              'Campaigns approved for production but later deviate from original strategy without re-review',
            ],
            roleEvolution: 'VP Marketing spends 5+ hours per week reviewing campaign briefs in fractured channels. Reviews are shallow due to context-switching and competing priorities.',
          },
          aiAgents: {
            summary: 'AI agents pre-screen campaign briefs against VP Marketing\'s decision framework, flag risks, and prepare decision packages with clear approval/rejection rationale. VP Marketing reviews in 5 minutes with full context.',
            detail: 'Campaign teams submit briefs to an intelligent intake system. AI agents analyze the brief against a learned decision framework: Does the strategy align with OKRs? Does the targeting overlap high-value segments? Is the budget allocation efficient? The system generates a decision package with approval recommendation, risk flags, and suggested revisions. VP Marketing sees a visual decision card, not a 5-page document. They can approve with one click, drill into details, or request revision with suggested edits.',
            painPoints: [
              'The decision framework must be explicit and updatable; VP Marketing must codify their judgment rules, which is non-trivial',
              'Agents can miss contextual nuance (e.g., a campaign that looks misaligned might actually be a tactical competitive response)',
              'False positives (flagging safe campaigns as risky) lead to approval delay; false negatives erode trust',
            ],
            benchmarks: [
              'AI-augmented review reduces approval time from 5-7 days to 1-2 days (industry composite)',
              'First-pass approval rate improves to 65-75% with agent-assisted pre-screening (Salesforce 2024)',
            ],
            outcomes: [
              'Stakeholder sign-off cycle collapses from 5-7 days to 1-2 days',
              'VP Marketing approval time per brief drops to 5 minutes average',
              'Risk flags surface early, reducing post-approval deviations',
            ],
            roleEvolution: 'VP Marketing shifts from detailed reviewer to decision-maker on flagged items. They spend 30 minutes per week on stakeholder sign-off, focused on judgment calls, not document reading.',
          },
          aiAgentic: {
            summary: 'Agentic systems autonomously approve routine campaigns within guardrails, escalate only strategic outliers or policy exceptions to VP Marketing. Approval happens within 2 hours, not 5-7 days.',
            detail: 'VP Marketing sets strategic guardrails: "Auto-approve campaigns that align with current OKRs, stay within budget allocation by plus/minus 10%, avoid competitors in top-5 threat list, use approved brand assets. Escalate: new competitor responses, spend >$50K, targeting outside core demographic, new channels." The agentic layer processes briefs against these guardrails. Routine campaigns (80%+ of submissions) are auto-approved within minutes. Escalated campaigns generate a decision brief for VP Marketing with context and recommendation.',
            painPoints: [
              'Guardrails are imperfect; edge cases will always require human judgment — the system must gracefully escalate without over-constraining teams',
              'Autonomous approval erodes VP\'s visibility into the portfolio; they must trust the guardrails and the agentic layer\'s enforcement',
              'If a routine campaign changes mid-execution, the agentic layer must re-evaluate and escalate if the change violates guardrails',
            ],
            benchmarks: [
              '80%+ of campaigns auto-approved within 2 hours in mature agentic deployments (Salesforce Agentforce 2025)',
              'Escalated decisions require <10 minutes of VP Marketing time (industry composite)',
              '95%+ approval rate on first submission with agentic pre-screening (industry composite)',
            ],
            outcomes: [
              'Stakeholder sign-off cycle collapses to <2 hours for routine campaigns',
              'VP Marketing intervention time drops to <5 hours per week',
              'Portfolio compliance reaches 98%+ (campaigns stay within approved strategy and budget)',
              'Faster execution enables more rapid response to competitive threats',
            ],
            roleEvolution: 'VP Marketing becomes a policy setter and exception handler. They define guardrails quarterly, review 2-5 escalated decisions per week, and trust the agentic layer to enforce them. Time saved from routine approvals is reinvested in market strategy.',
          },
        },

        // ── SUPPORT NODES ────────────────────────────────────────────────
        'content-strategy': {
          preAI: {
            summary: 'VP Marketing manually synthesizes market research, competitive analysis, sales feedback, and product roadmap into a 10-15 page quarterly strategy document that guides downstream campaign planning.',
            detail: 'Strategy development is a quarterly ritual. VP Marketing interviews product leads, sales directors, customer success, and marketing teams. They review competitive activity, market trends, analyst reports, and customer surveys. The process is static; feedback loops are slow (quarterly review cycles). If the strategy is wrong, all downstream campaigns are orphaned.',
          },
          aiAgents: {
            summary: 'AI agents continuously monitor competitive activity, market sentiment, and campaign performance data, surfacing strategic insights and revision recommendations to VP Marketing weekly.',
            detail: 'Agents ingest competitive intelligence feeds, social listening data, sales call transcripts, customer survey responses, and campaign performance metrics. VP Marketing receives a weekly strategic digest with recommended adjustments. No ad-hoc strategy revision required; the system keeps strategy aligned with market reality on a rolling basis.',
          },
          aiAgentic: {
            summary: 'Agentic systems continuously optimize content strategy against market signals, automatically cascade revisions to active campaigns, and surface only major strategic decision points to VP Marketing.',
            detail: 'Strategy becomes a dynamic entity, not a quarterly document. Agents monitor market signals and autonomously adjust strategy guidance when signal confidence exceeds a threshold. For major shifts, the agentic layer escalates to VP Marketing with context and recommendation. The system then cascades the revised strategy to all active campaigns.',
          },
        },

        // ── Non-rendered pipeline nodes (preserved for data completeness) ──

        'receive-request': {
          preAI: {
            summary: 'You approve incoming requests manually, sorting through emails and Slack messages for strategic alignment.',
            detail: 'Requests arrive in inconsistent formats with no standard intake process. You spend hours triaging and clarifying scope before strategic alignment can even begin.',
          },
          aiAgents: {
            summary: 'An AI intake agent structures requests and flags strategic alignment implications before they reach your queue.',
            detail: 'Requests arrive pre-categorized with strategic alignment signals highlighted. You validate and prioritize rather than manually parsing raw inputs.',
          },
          aiAgentic: {
            summary: 'Autonomous intake agents triage, validate, and route requests with strategic alignment logic — you govern exceptions.',
            detail: 'Agentic intake handles end-to-end request processing with your strategic alignment rules embedded. You set policies and review escalations while routine requests flow automatically.',
          },
        },
        'research-insights': {
          preAI: {
            summary: 'You gather audience and market research manually, compiling data from multiple sources for strategic alignment.',
            detail: 'Research is scattered across tools, reports, and tribal knowledge. Building a complete picture for strategic alignment takes days and the data is often stale by the time you use it.',
          },
          aiAgents: {
            summary: 'AI research tools surface audience and market data relevant to your strategic alignment needs automatically.',
            detail: 'Research agents pull relevant data from multiple sources and present strategic alignment insights in a structured format. You curate and interpret rather than gather.',
          },
          aiAgentic: {
            summary: 'Autonomous research agents continuously update strategic alignment intelligence — you set the strategic lens.',
            detail: 'Research agents proactively surface strategic alignment insights from market signals, audience data, and competitive movements. You shape research priorities, not execute searches.',
          },
        },
        'write-brief': {
          preAI: {
            summary: 'You wait for briefs written by hand, often lacking the strategic alignment detail you need.',
            detail: 'Briefs arrive incomplete or misaligned with your strategic alignment requirements. You spend cycles requesting revisions and clarifying expectations before work can proceed.',
          },
          aiAgents: {
            summary: 'AI drafts briefs with strategic alignment requirements pre-populated from templates and past projects.',
            detail: 'Brief generation agents pull your strategic alignment requirements into structured templates. You review and refine rather than starting from a blank page.',
          },
          aiAgentic: {
            summary: 'Autonomous agents generate complete briefs with strategic alignment alignment built in — you approve strategy.',
            detail: 'Brief agents produce publication-ready briefs that embed your strategic alignment requirements from historical patterns. You govern strategic direction rather than reviewing drafts.',
          },
        },
        'draft-content': {
          preAI: {
            summary: 'You review drafts created entirely by hand, checking each one for alignment with strategic alignment.',
            detail: 'First drafts vary wildly in quality and strategic alignment alignment. You often send content back for multiple revision cycles, creating bottlenecks in the pipeline.',
          },
          aiAgents: {
            summary: 'AI generates first drafts with strategic alignment guidelines embedded, reducing your revision cycles.',
            detail: 'Drafting agents produce content aligned with your strategic alignment standards from the start. You focus on strategic refinement rather than basic corrections.',
          },
          aiAgentic: {
            summary: 'Autonomous drafting agents produce content meeting strategic alignment standards — you set creative direction.',
            detail: 'Drafting agents generate content that passes your strategic alignment criteria automatically. You focus on strategic vision and creative differentiation rather than quality control.',
          },
        },
        'seo-optimization': {
          preAI: {
            summary: 'SEO optimization is manual and disconnected from your strategic alignment priorities.',
            detail: 'Keyword research and meta optimization happen separately from your strategic alignment workflow. You rarely see SEO data until after content is already in review.',
          },
          aiAgents: {
            summary: 'AI SEO tools optimize content while preserving your strategic alignment priorities.',
            detail: 'SEO agents suggest keywords and meta improvements that align with your strategic alignment goals. You approve optimizations rather than manually researching keywords.',
          },
          aiAgentic: {
            summary: 'Autonomous SEO agents optimize continuously within strategic alignment boundaries — you define the strategy.',
            detail: 'SEO agents self-optimize content based on real-time search signals and your strategic alignment guardrails. You set strategic keywords and constraints, not individual page optimizations.',
          },
        },
        'brand-compliance': {
          preAI: {
            summary: 'Brand checks are subjective and slow, creating delays in your strategic alignment workflow.',
            detail: 'Brand reviewers interpret guidelines differently. Inconsistent enforcement of tone, terminology, and messaging means strategic alignment is harder to maintain at scale.',
          },
          aiAgents: {
            summary: 'AI brand checkers flag violations and score strategic alignment alignment before human review.',
            detail: 'Brand agents scan content against guidelines and highlight strategic alignment issues. You make judgment calls on edge cases rather than catching basic violations.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents enforce compliance at scale with strategic alignment rules — you update the rulebook.',
            detail: 'Brand agents apply and evolve compliance checks across all content automatically. Your strategic alignment standards are codified as machine-enforceable rules that you govern and refine.',
          },
        },
        'final-edit': {
          preAI: {
            summary: 'Final edits depend entirely on editor availability, blocking your strategic alignment timelines.',
            detail: 'A single editor bottleneck means content waits in queue. Your strategic alignment deadlines slip because there is no way to parallelize the final polish step.',
          },
          aiAgents: {
            summary: 'AI editing assistants handle mechanical fixes, freeing your strategic alignment focus for strategic polish.',
            detail: 'Editing agents catch grammar, style, and consistency issues automatically. Your strategic alignment perspective is reserved for nuance and narrative quality.',
          },
          aiAgentic: {
            summary: 'Autonomous editing agents polish content to publication standard — your strategic alignment bar is encoded as policy.',
            detail: 'Editing agents handle all mechanical and stylistic refinement autonomously. Your strategic alignment standards are embedded as editorial policies that improve with each iteration.',
          },
        },
        'track-performance': {
          preAI: {
            summary: 'Performance tracking is fragmented across tools, making strategic alignment assessment difficult.',
            detail: 'You pull data from analytics dashboards, social platforms, and CRM separately. Building a complete picture for strategic alignment requires manual data stitching.',
          },
          aiAgents: {
            summary: 'AI dashboards surface strategic alignment metrics in real time without manual data pulling.',
            detail: 'Performance agents aggregate data and highlight the strategic alignment signals that matter to you. You analyze trends rather than building dashboards from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous tracking agents monitor strategic alignment metrics continuously and trigger alerts and actions.',
            detail: 'Performance agents stream strategic alignment data and automatically trigger optimization workflows when thresholds are breached. You define KPIs and review strategic implications.',
          },
        },
        'generate-report': {
          preAI: {
            summary: 'Reports are built manually in spreadsheets, often missing the strategic alignment metrics you need.',
            detail: 'Report creation takes hours of data gathering and formatting. The metrics that matter for strategic alignment are often buried or missing entirely from standard templates.',
          },
          aiAgents: {
            summary: 'AI generates reports with strategic alignment metrics pre-formatted and insights highlighted.',
            detail: 'Reporting agents compile your strategic alignment data into structured templates with automated analysis. You add strategic narrative rather than wrangling data.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce strategic alignment reports on demand with strategic recommendations.',
            detail: 'Reporting agents generate strategic alignment analyses with actionable recommendations automatically. You consume insights and set strategic direction rather than producing reports.',
          },
        },
        'optimize': {
          preAI: {
            summary: 'Content optimization is reactive and slow, with limited connection to strategic alignment data.',
            detail: 'Optimization decisions rely on gut feel and delayed data. Your strategic alignment insights rarely feed back into content updates in a timely way.',
          },
          aiAgents: {
            summary: 'AI recommends optimizations based on strategic alignment signals and historical performance.',
            detail: 'Optimization agents suggest specific changes tied to your strategic alignment metrics. You approve and prioritize recommendations rather than diagnosing issues manually.',
          },
          aiAgentic: {
            summary: 'Autonomous optimization agents improve content continuously using strategic alignment signals — you set boundaries.',
            detail: 'Optimization agents test, iterate, and improve content based on strategic alignment data within your guardrails. You define acceptable ranges and review significant changes.',
          },
        },
        'brief-approval': {
          preAI: {
            summary: 'Brief approvals are bottlenecked by manual review cycles that delay your strategic alignment work.',
            detail: 'You wait for briefs to pass through approval chains before your strategic alignment tasks can begin. Unclear approval criteria mean briefs bounce back and forth repeatedly.',
          },
          aiAgents: {
            summary: 'AI pre-screens briefs for strategic alignment alignment, routing only exceptions to you.',
            detail: 'Approval agents check briefs against your strategic alignment criteria and flag gaps. You review flagged items rather than reading every brief end to end.',
          },
          aiAgentic: {
            summary: 'Autonomous approval agents clear standard briefs and escalate only strategic alignment exceptions to you.',
            detail: 'Approval agents validate briefs against your strategic alignment criteria and auto-approve routine requests. You handle strategic exceptions and edge cases only.',
          },
        },
        'quality-check': {
          preAI: {
            summary: 'Quality checks are inconsistent manual reviews with no standard strategic alignment criteria.',
            detail: 'Quality varies by reviewer and day. There is no automated baseline for readability, accuracy, or strategic alignment alignment, leading to uneven content standards.',
          },
          aiAgents: {
            summary: 'AI quality gates enforce baseline standards, letting you focus on strategic alignment nuance.',
            detail: 'Quality agents score readability, accuracy, and SEO automatically. Your strategic alignment evaluation focuses on strategic alignment rather than mechanical checks.',
          },
          aiAgentic: {
            summary: 'Autonomous quality agents enforce standards continuously — strategic alignment baselines are self-maintaining.',
            detail: 'Quality agents apply and evolve quality standards based on your strategic alignment benchmarks. You set quality policies that the system enforces and improves over time.',
          },
        },
        'brand-review': {
          preAI: {
            summary: 'Brand reviews are subjective gates that slow your strategic alignment pipeline.',
            detail: 'Reviewers apply brand guidelines inconsistently. What passes one review fails the next, creating unpredictable delays in your strategic alignment workflow.',
          },
          aiAgents: {
            summary: 'AI brand agents pre-score content, surfacing strategic alignment issues before your review.',
            detail: 'Brand review agents apply guidelines consistently and flag strategic alignment deviations. You handle exceptions and judgment calls rather than full content scans.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents review all content at scale — you govern strategic alignment policy evolution.',
            detail: 'Brand review agents handle all compliance checking autonomously with your strategic alignment rules. You update brand guidelines and review the rare edge case that requires human judgment.',
          },
        },
        'performance-review': {
          preAI: {
            summary: 'Performance reviews are infrequent manual assessments that underserve your strategic alignment needs.',
            detail: 'Reviews happen quarterly at best, using outdated data. Your strategic alignment perspective is often missing from the evaluation criteria entirely.',
          },
          aiAgents: {
            summary: 'AI evaluates content against KPIs and highlights strategic alignment trends for your review.',
            detail: 'Review agents surface performance data with strategic alignment context pre-attached. You make optimize/archive decisions based on structured analysis rather than raw metrics.',
          },
          aiAgentic: {
            summary: 'Autonomous review agents evaluate and act on performance with strategic alignment logic — you set the framework.',
            detail: 'Review agents continuously assess content against your strategic alignment KPIs and trigger optimize/refresh/archive workflows automatically. You define the evaluation framework.',
          },
        },
        'social-listening': {
          preAI: {
            summary: 'Social listening is ad hoc keyword monitoring with no systematic link to strategic alignment.',
            detail: 'You check social platforms manually for relevant conversations. Insights rarely reach your strategic alignment workflow before they become stale or irrelevant.',
          },
          aiAgents: {
            summary: 'AI monitoring tools surface trending topics and sentiment relevant to strategic alignment in real time.',
            detail: 'Listening agents track conversations and flag strategic alignment signals across platforms. You act on curated insights rather than monitoring feeds manually.',
          },
          aiAgentic: {
            summary: 'Autonomous listening agents track and respond to strategic alignment signals across all platforms in real time.',
            detail: 'Listening agents monitor social channels and proactively surface strategic alignment opportunities and risks. You set monitoring priorities and review strategic findings.',
          },
        },
        'visual-asset-creation': {
          preAI: {
            summary: 'Visual asset creation is a slow design queue disconnected from your strategic alignment needs.',
            detail: 'Design requests go into a backlog with unclear priorities. Your strategic alignment requirements are often lost in translation between brief and final asset.',
          },
          aiAgents: {
            summary: 'AI design tools generate asset options aligned with strategic alignment requirements.',
            detail: 'Design agents produce visual variants following your strategic alignment guidelines. You select and refine from AI-generated options rather than directing from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous design agents produce visual assets within strategic alignment guidelines — you set creative direction.',
            detail: 'Design agents generate publication-ready visuals following your strategic alignment standards. You define the creative vision and approve hero assets while routine visuals ship autonomously.',
          },
        },
        'legal-review': {
          preAI: {
            summary: 'Legal review is an opaque process that creates unpredictable delays in your strategic alignment work.',
            detail: 'Legal feedback arrives late with minimal context. You cannot predict how long review will take, making strategic alignment planning unreliable.',
          },
          aiAgents: {
            summary: 'AI legal screening flags compliance risks early, reducing strategic alignment surprises downstream.',
            detail: 'Legal agents pre-scan content for regulatory issues and strategic alignment risks. You get early warnings rather than discovering problems at the sign-off stage.',
          },
          aiAgentic: {
            summary: 'Autonomous legal agents clear routine content and escalate only true strategic alignment risks to human counsel.',
            detail: 'Legal agents scan and clear standard content autonomously using your strategic alignment rule framework. Human lawyers handle novel risk scenarios and precedent-setting decisions only.',
          },
        },
        'accessibility-check': {
          preAI: {
            summary: 'Accessibility checking is a manual afterthought, rarely connected to your strategic alignment process.',
            detail: 'WCAG compliance and inclusive language reviews happen late in the pipeline. Your strategic alignment work is already done when accessibility issues force rework.',
          },
          aiAgents: {
            summary: 'AI accessibility tools catch WCAG violations automatically, protecting your strategic alignment standards.',
            detail: 'Accessibility agents scan for inclusive language and alt-text compliance. Your strategic alignment requirements benefit from automated baseline checks before human review.',
          },
          aiAgentic: {
            summary: 'Autonomous accessibility agents enforce WCAG and inclusive standards — strategic alignment is guaranteed by default.',
            detail: 'Accessibility agents ensure all content meets compliance standards before publication. Your strategic alignment benefits from guaranteed accessibility without manual checking overhead.',
          },
        },
        'localize-content': {
          preAI: {
            summary: 'Localization is a slow, manual translation process that delays your strategic alignment for global markets.',
            detail: 'Each market requires separate translation, cultural review, and compliance checking. Your strategic alignment suffers because localized versions lag weeks behind the original.',
          },
          aiAgents: {
            summary: 'AI translation agents accelerate localization while respecting strategic alignment requirements.',
            detail: 'Localization agents produce initial translations with strategic alignment context preserved. You review for cultural nuance rather than translating from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous localization agents adapt content for all markets simultaneously — your strategic alignment scales globally.',
            detail: 'Localization agents handle translation, cultural adaptation, and regional compliance autonomously. Your strategic alignment is maintained across markets without manual per-locale effort.',
          },
        },
        'ab-variant-creation': {
          preAI: {
            summary: 'A/B variants are created manually with limited connection to your strategic alignment hypotheses.',
            detail: 'Test variants rely on guesswork rather than data. Your strategic alignment insights rarely inform variant design, reducing the value of testing efforts.',
          },
          aiAgents: {
            summary: 'AI generates test variants informed by strategic alignment data and historical performance.',
            detail: 'Variant agents create headlines, CTAs, and imagery options based on your strategic alignment hypotheses. You select winning approaches rather than brainstorming from zero.',
          },
          aiAgentic: {
            summary: 'Autonomous variant agents design, deploy, and learn from tests using strategic alignment hypotheses — you set the agenda.',
            detail: 'Variant agents run continuous testing experiments informed by your strategic alignment objectives. You define what to test and review strategic learnings while the system iterates autonomously.',
          },
        },
        'content-repurposing': {
          preAI: {
            summary: 'Content repurposing is manual reformatting, disconnected from your strategic alignment goals.',
            detail: 'Each derivative asset is created from scratch. Your strategic alignment requirements are not systematically applied when repurposing content across formats.',
          },
          aiAgents: {
            summary: 'AI repurposing agents derive secondary assets with strategic alignment consistency built in.',
            detail: 'Repurposing agents transform primary content into channel-specific formats following your strategic alignment guidelines. You approve derivatives rather than recreating each manually.',
          },
          aiAgentic: {
            summary: 'Autonomous repurposing agents derive all secondary assets automatically within strategic alignment guidelines.',
            detail: 'Repurposing agents transform primary content into every derivative format following your strategic alignment rules. You set format strategy while the system handles production at scale.',
          },
        },
        'archive-tag': {
          preAI: {
            summary: 'Content archiving is inconsistent, making strategic alignment-related retrieval nearly impossible.',
            detail: 'Tagging and taxonomy are applied inconsistently or not at all. Finding past content relevant to strategic alignment requires searching through unstructured repositories.',
          },
          aiAgents: {
            summary: 'AI tagging agents classify content automatically, making strategic alignment retrieval faster.',
            detail: 'Archive agents apply taxonomy and metadata based on your strategic alignment categories. You validate classifications rather than manually tagging every asset.',
          },
          aiAgentic: {
            summary: 'Autonomous archive agents maintain perfect taxonomy — strategic alignment retrieval is instant and reliable.',
            detail: 'Archive agents classify, tag, and organize all content using your strategic alignment taxonomy automatically. You evolve the taxonomy structure while the system maintains it flawlessly.',
          },
        },
        'legal-compliance-gate': {
          preAI: {
            summary: 'Legal compliance gates create unpredictable holds that delay your strategic alignment deadlines.',
            detail: 'Legal sign-off timing is opaque and variable. Your strategic alignment timelines are at the mercy of legal review queues with no visibility into status.',
          },
          aiAgents: {
            summary: 'AI pre-screening reduces legal gate delays by resolving routine strategic alignment checks automatically.',
            detail: 'Compliance agents handle standard checks and only escalate strategic alignment edge cases to human lawyers. Your timelines are more predictable because routine items clear faster.',
          },
          aiAgentic: {
            summary: 'Autonomous compliance gates clear routine content instantly — only novel strategic alignment risks reach human lawyers.',
            detail: 'Compliance agents handle standard legal checks autonomously using your strategic alignment risk framework. Human review is reserved for unprecedented scenarios and policy updates.',
          },
        },
        'localization-quality-gate': {
          preAI: {
            summary: 'Localization quality gates are inconsistent, creating strategic alignment risks in global markets.',
            detail: 'Quality checks for localized content vary by market and reviewer. Your strategic alignment standards are unevenly applied across regions and languages.',
          },
          aiAgents: {
            summary: 'AI quality checks catch translation errors before they affect your strategic alignment outcomes.',
            detail: 'Localization QA agents verify accuracy and cultural fit automatically. Your strategic alignment standards are applied consistently across all target markets.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents ensure localization quality across all markets — strategic alignment is guaranteed globally.',
            detail: 'Localization QA agents validate every market adaptation autonomously against your strategic alignment standards. You set quality criteria while the system enforces them at scale.',
          },
        },
        'segment-mapping': {
          preAI: {
            summary: 'Segment mapping is manual spreadsheet work with limited visibility into strategic alignment impact.',
            detail: 'Mapping content variants to audience segments is done in spreadsheets. Your strategic alignment data is disconnected from the personalization logic.',
          },
          aiAgents: {
            summary: 'AI agents map variants to segments using strategic alignment data from the CDP.',
            detail: 'Segment agents recommend variant-audience matches based on your strategic alignment signals. You review the mapping rather than building it manually in spreadsheets.',
          },
          aiAgentic: {
            summary: 'Autonomous segment agents map and optimize variant-audience matches using live strategic alignment signals.',
            detail: 'Segment agents continuously refine variant-audience mappings based on real-time strategic alignment data. You define segmentation strategy while the system executes and optimizes automatically.',
          },
        },
        'dynamic-assembly': {
          preAI: {
            summary: 'Dynamic content assembly is rigid and template-bound, limiting your strategic alignment options.',
            detail: 'Personalized experiences require engineering support for each variant. Your strategic alignment vision is constrained by inflexible assembly templates.',
          },
          aiAgents: {
            summary: 'AI assembly agents construct personalized experiences informed by strategic alignment rules.',
            detail: 'Assembly agents combine content components per segment following your strategic alignment logic. You define rules and review outputs rather than manually configuring each variant.',
          },
          aiAgentic: {
            summary: 'Autonomous assembly agents construct personalized experiences in real time — strategic alignment logic is self-optimizing.',
            detail: 'Assembly agents build dynamic experiences per segment using your strategic alignment rules and real-time behavioral signals. You govern personalization policies, not individual assembly configurations.',
          },
        },
        'personalization-qa': {
          preAI: {
            summary: 'Personalization QA is manual spot-checking that misses strategic alignment gaps.',
            detail: 'Testing every segment-variant combination is impossible manually. Your strategic alignment concerns are only caught when users report issues post-launch.',
          },
          aiAgents: {
            summary: 'AI QA agents validate personalization coverage and flag strategic alignment gaps before launch.',
            detail: 'QA agents test every segment-variant combination against your strategic alignment requirements. You review exception reports rather than manually spot-checking combinations.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents validate every personalization scenario — strategic alignment gaps are caught before launch.',
            detail: 'Personalization QA agents test all segment-variant combinations against your strategic alignment requirements automatically. You set acceptance criteria while the system validates at scale.',
          },
        },
        'campaign-planning': {
          preAI: {
            summary: 'Campaign planning is a manual coordination effort with fragmented strategic alignment inputs.',
            detail: 'Campaign plans are built in decks and spreadsheets with incomplete data. Your strategic alignment perspective is often incorporated too late in the planning cycle.',
          },
          aiAgents: {
            summary: 'AI planning agents draft campaign frameworks with strategic alignment data pre-integrated.',
            detail: 'Planning agents pull audience, budget, and performance data into campaign templates. Your strategic alignment priorities shape the plan from the start rather than being retrofitted.',
          },
          aiAgentic: {
            summary: 'Autonomous planning agents generate campaign frameworks using strategic alignment intelligence — you set objectives.',
            detail: 'Planning agents produce data-driven campaign plans with your strategic alignment priorities embedded. You define strategic goals while the system optimizes tactics and resource allocation.',
          },
        },
        'consent-check': {
          preAI: {
            summary: 'Consent checking is a manual compliance step that adds friction to your strategic alignment process.',
            detail: 'Verifying GDPR/CCPA consent for targeting requires manual cross-referencing. Your strategic alignment work is delayed while compliance status is manually confirmed.',
          },
          aiAgents: {
            summary: 'AI consent agents verify targeting compliance automatically, reducing strategic alignment friction.',
            detail: 'Consent agents cross-reference CDP signals against GDPR/CCPA rules for your strategic alignment needs. You handle exceptions rather than manually verifying every segment.',
          },
          aiAgentic: {
            summary: 'Autonomous consent agents enforce privacy compliance at scale — strategic alignment is guaranteed by architecture.',
            detail: 'Consent agents verify targeting compliance in real time across all segments using your strategic alignment framework. You set privacy policies while the system enforces them automatically.',
          },
        },
        'paid-creative-production': {
          preAI: {
            summary: 'Paid creative production runs separately from organic, fragmenting your strategic alignment oversight.',
            detail: 'Ad creative and organic content are produced in silos. Your strategic alignment perspective is applied inconsistently between paid and organic channels.',
          },
          aiAgents: {
            summary: 'AI production agents generate paid variants from organic content with strategic alignment consistency.',
            detail: 'Paid creative agents adapt organic content for ad platforms following your strategic alignment guidelines. You approve and fine-tune rather than producing ad creative from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous production agents create paid variants at scale within strategic alignment guardrails — you set the strategy.',
            detail: 'Paid creative agents generate ad variants from organic content following your strategic alignment guidelines. You define creative strategy while the system produces and optimizes at scale.',
          },
        },
        'attribution-modeling': {
          preAI: {
            summary: 'Attribution modeling is manual and unreliable, undermining your strategic alignment reporting.',
            detail: 'Last-click attribution dominates despite its flaws. Your strategic alignment decisions lack the multi-touch perspective needed for accurate performance assessment.',
          },
          aiAgents: {
            summary: 'AI attribution models surface multi-touch insights relevant to your strategic alignment priorities.',
            detail: 'Attribution agents calculate content ROI across channels using your strategic alignment weightings. You interpret strategic implications rather than building models manually.',
          },
          aiAgentic: {
            summary: 'Autonomous attribution agents run multi-touch models continuously — strategic alignment insights update in real time.',
            detail: 'Attribution agents calculate content ROI across all channels using your strategic alignment framework. You interpret strategic implications while the system handles modeling complexity.',
          },
        },
        'executive-reporting': {
          preAI: {
            summary: 'Executive reports are manually assembled, often missing the strategic alignment narrative you need.',
            detail: 'Building executive dashboards takes hours of data wrangling. The strategic alignment story you want to tell is lost in generic reporting templates.',
          },
          aiAgents: {
            summary: 'AI builds executive dashboards with strategic alignment narratives pre-drafted for leadership.',
            detail: 'Reporting agents synthesize data into executive formats with your strategic alignment story embedded. You refine the narrative rather than assembling data from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce executive dashboards with strategic alignment narratives — you add strategic context.',
            detail: 'Executive reporting agents synthesize all data into leadership-ready formats with your strategic alignment story embedded. You provide strategic commentary on auto-generated insights.',
          },
        },
        'competitive-response': {
          preAI: {
            summary: 'Competitive response is slow and reactive, giving you no strategic alignment advantage.',
            detail: 'By the time you spot a competitor move and respond, the moment has passed. Your strategic alignment approach cannot adapt fast enough to real-time competitive signals.',
          },
          aiAgents: {
            summary: 'AI competitive agents surface signals and draft responses aligned with strategic alignment strategy.',
            detail: 'Competitive agents monitor market moves and suggest strategic alignment-aligned responses. You approve and refine reactive content rather than spotting threats manually.',
          },
          aiAgentic: {
            summary: 'Autonomous competitive agents detect and draft responses in real time — strategic alignment moves are countered instantly.',
            detail: 'Competitive agents monitor signals, draft responses, and deploy within your strategic alignment guardrails. You approve high-stakes responses while routine reactions ship autonomously.',
          },
        },
        'content-governance': {
          preAI: {
            summary: 'Content governance is periodic manual auditing that cannot keep pace with your strategic alignment standards.',
            detail: 'Live content drifts out of compliance between infrequent reviews. Your strategic alignment requirements are only enforced when someone manually checks.',
          },
          aiAgents: {
            summary: 'AI governance agents continuously audit live content against strategic alignment standards.',
            detail: 'Governance agents flag content drift, compliance gaps, and strategic alignment issues in real time. You review flagged items rather than conducting manual audits.',
          },
          aiAgentic: {
            summary: 'Autonomous governance agents audit all live content continuously — strategic alignment compliance is always current.',
            detail: 'Governance agents monitor every published piece against your strategic alignment standards in real time. You evolve governance policies while the system enforces them perpetually.',
          },
        },
        'governance-gate': {
          preAI: {
            summary: 'Governance gates are calendar-driven checkpoints disconnected from your strategic alignment rhythm.',
            detail: 'Governance reviews happen on a fixed schedule regardless of content velocity. Your strategic alignment concerns may not surface until the next quarterly review.',
          },
          aiAgents: {
            summary: 'AI governance gates run continuous checks, surfacing strategic alignment issues between formal reviews.',
            detail: 'Governance agents validate live content against your strategic alignment criteria on an ongoing basis. You act on exception alerts rather than waiting for quarterly reviews.',
          },
          aiAgentic: {
            summary: 'Autonomous governance gates run continuously — strategic alignment violations trigger immediate remediation.',
            detail: 'Governance agents validate live content against your strategic alignment criteria continuously and auto-trigger refresh or retirement workflows. You set policies, not review schedules.',
          },
        },
        'journey-mapping': {
          preAI: {
            summary: 'Journey mapping is a manual exercise that rarely reflects your strategic alignment reality.',
            detail: 'Customer journey maps are created in workshops and quickly go stale. Your strategic alignment perspective is a snapshot, not a living view of how content performs at each stage.',
          },
          aiAgents: {
            summary: 'AI journey agents map content to lifecycle stages using strategic alignment data from the CDP.',
            detail: 'Journey agents dynamically map content to customer stages based on your strategic alignment framework. You validate the mapping rather than building it manually in workshops.',
          },
          aiAgentic: {
            summary: 'Autonomous journey agents maintain living maps using real-time strategic alignment data — you shape the strategy.',
            detail: 'Journey agents dynamically map content to lifecycle stages using live strategic alignment signals. You define journey frameworks while the system optimizes content placement continuously.',
          },
        },
        'sentiment-monitoring': {
          preAI: {
            summary: 'Sentiment monitoring is sporadic manual checking with no systematic link to strategic alignment.',
            detail: 'You check brand sentiment reactively rather than proactively. Your strategic alignment decisions are made without real-time audience feedback signals.',
          },
          aiAgents: {
            summary: 'AI sentiment agents track brand reception in real time, alerting you to strategic alignment risks.',
            detail: 'Sentiment agents analyze audience reactions and flag strategic alignment concerns before they escalate. You respond to alerts rather than manually checking platforms.',
          },
          aiAgentic: {
            summary: 'Autonomous sentiment agents monitor and respond to strategic alignment signals around the clock — you govern escalation.',
            detail: 'Sentiment agents track audience reactions and trigger strategic alignment responses automatically. You set escalation thresholds and review strategic implications of sentiment shifts.',
          },
        },
        'sales-enablement': {
          preAI: {
            summary: 'Sales enablement content is created ad hoc, disconnected from your strategic alignment strategy.',
            detail: 'Sales teams request materials outside the content pipeline. Your strategic alignment standards are not applied to battle cards, decks, and one-pagers created in isolation.',
          },
          aiAgents: {
            summary: 'AI agents generate sales materials from marketing content with strategic alignment alignment.',
            detail: 'Sales enablement agents transform marketing assets into battle cards and decks following your strategic alignment standards. You approve rather than creating each piece manually.',
          },
          aiAgentic: {
            summary: 'Autonomous enablement agents keep sales materials current with strategic alignment alignment — you set the playbook.',
            detail: 'Enablement agents automatically update battle cards, decks, and case studies as your strategic alignment data evolves. You define the sales narrative while the system produces materials at scale.',
          },
        },
        'influencer-brief': {
          preAI: {
            summary: 'Influencer briefs are manual documents with limited strategic alignment guardrails.',
            detail: 'Creator briefs are written from scratch each time. Your strategic alignment guidelines are inconsistently communicated to external partners and influencers.',
          },
          aiAgents: {
            summary: 'AI agents draft influencer briefs with strategic alignment guardrails embedded automatically.',
            detail: 'Brief agents generate creator guidelines from your strategic alignment requirements and past successful collaborations. You customize rather than writing each brief from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous brief agents generate creator guidelines with strategic alignment guardrails — you approve partnerships.',
            detail: 'Brief agents produce personalized influencer guidelines using your strategic alignment framework and creator history. You focus on relationship strategy while briefs ship autonomously.',
          },
        },
        'ugc-moderation': {
          preAI: {
            summary: 'UGC moderation is manual screening that cannot scale to protect strategic alignment.',
            detail: 'User-generated content is reviewed one piece at a time. Your strategic alignment standards cannot be consistently enforced across the volume of submissions.',
          },
          aiAgents: {
            summary: 'AI moderation agents screen UGC for brand safety and strategic alignment compliance at scale.',
            detail: 'Moderation agents filter user-generated content against your strategic alignment criteria. You review borderline cases rather than manually screening every submission.',
          },
          aiAgentic: {
            summary: 'Autonomous moderation agents screen all UGC for strategic alignment compliance at scale — you govern edge cases.',
            detail: 'Moderation agents filter user-generated content using your strategic alignment rules continuously. You update moderation policies and review borderline cases that the system escalates.',
          },
        },
        'content-scoring': {
          preAI: {
            summary: 'Content scoring is subjective prioritization that underweights your strategic alignment criteria.',
            detail: 'Requests are prioritized by loudest voice or executive fiat. Your strategic alignment scoring criteria are rarely part of the formal prioritization framework.',
          },
          aiAgents: {
            summary: 'AI scoring agents rank requests using strategic alignment criteria alongside strategic priority.',
            detail: 'Scoring agents weight your strategic alignment factors into the prioritization algorithm. You adjust rankings rather than scoring each request manually.',
          },
          aiAgentic: {
            summary: 'Autonomous scoring agents prioritize the pipeline using strategic alignment criteria — you set strategic weights.',
            detail: 'Scoring agents rank and route content requests using your strategic alignment priorities in real time. You define scoring criteria and review the queue rather than manually triaging.',
          },
        },
        'channel-orchestration': {
          preAI: {
            summary: 'Channel orchestration is manual coordination with no systematic strategic alignment integration.',
            detail: 'Cross-channel timing is managed in spreadsheets and Slack. Your strategic alignment requirements for sequencing and coordination are often overridden by ad hoc changes.',
          },
          aiAgents: {
            summary: 'AI orchestration agents sequence distribution with strategic alignment rules for timing and cadence.',
            detail: 'Orchestration agents coordinate cross-channel timing based on your strategic alignment requirements. You set rules and review the sequence rather than managing each channel individually.',
          },
          aiAgentic: {
            summary: 'Autonomous orchestration agents manage all channel timing with strategic alignment logic — you set the playbook.',
            detail: 'Orchestration agents handle cross-channel sequencing, timing, and coordination autonomously using your strategic alignment rules. You evolve the orchestration strategy while the system executes.',
          },
        },
      },
      keyInsight: 'The pain point is not approval complexity — it\'s attention fragmentation. 61% of CMOs report plans driven by operational needs, not market opportunity. AI removes the busywork; judgment remains. The VP Marketing role has the highest leverage for AI-driven time recovery in the entire pipeline.',
    },
  },


  // ═══════════════════════════════════════════════════════════════════════════
  // ROLE 5: ANALYTICS LEAD
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'analytics-lead',
    title: 'Analytics Lead',
    description: 'Owns the measurement layer — tracking, reporting, attribution, optimization, and executive insights. The feedback loop that makes the entire pipeline a learning system.',
    tagline: 'The performance-review gate can restart the pipeline. That feedback loop makes this a learning system.',
    iconName: 'BarChart3',
    category: 'growth',
    accentColor: '#4CAF50',
    ownedSteps: ['track-performance', 'generate-report', 'optimize', 'attribution-modeling', 'executive-reporting'],
    reviewedGates: ['performance-review'],
    relatedAgents: ['performance-agent', 'optimization-agent'],
    relatedInputs: ['analytics-data', 'cdp-profiles', 'budget-allocation', 'channel-benchmarks'],
    narrative: {
      stageOverviews: {
        preAI: {
          narrative: 'Before AI, the Analytics Lead is a data plumber. 50%+ of weekly time is consumed by manual data consolidation and reconciliation across 8-12 platforms. Strategic analysis — the actual value of the role — is compressed into whatever time remains after the spreadsheet work is done.',
          timeAllocation: '50% data consolidation and reconciliation, 20% report creation, 15% attribution analysis, 10% optimization recommendations, 5% strategic forecasting',
          criticalMetrics: ['Data consolidation time', 'Report delivery lag', 'Attribution model accuracy', 'Optimization cycle time', 'Budget efficiency (ROAS)'],
          strategicOpportunity: '42% of marketers still rely on manual spreadsheet attribution. The AI opportunity is not just speed — it\'s accuracy. A 19% average improvement in ROI is not about working faster; it\'s about understanding which channels and touchpoints truly drive conversion.',
        },
        aiAgents: {
          narrative: 'AI agents absorb the data plumbing: automated ingestion, real-time dashboards, anomaly detection. The Analytics Lead transitions from data assembler to data strategist — spending time on analysis and interpretation rather than export and reconciliation.',
          timeAllocation: '10% data validation, 15% dashboard management, 25% analysis and interpretation, 25% optimization reviews, 25% strategic forecasting',
          criticalMetrics: ['Real-time dashboard availability', 'Anomaly detection accuracy', 'Multi-touch attribution coverage', 'Optimization recommendation adoption', 'Forecast accuracy'],
          strategicOpportunity: 'The 40-50% of time freed from data consolidation creates space for the analysis that actually drives budget efficiency — multi-touch attribution, channel interaction modeling, and predictive budget allocation.',
        },
        aiAgentic: {
          narrative: 'The Analytics Lead becomes a strategic advisor and guardrail architect. Agentic systems handle tracking, reporting, attribution, and tactical optimization autonomously. Human judgment concentrates on portfolio strategy, experimental design, and the causal inference that distinguishes correlation from contribution.',
          timeAllocation: '5% system monitoring, 15% guardrail management, 20% strategic analysis, 25% executive advising, 20% experimental design, 15% portfolio strategy',
          criticalMetrics: ['Autonomous optimization success rate', 'Causal attribution accuracy', 'Budget allocation efficiency', 'Experimentation velocity', 'Strategic forecast accuracy'],
          strategicOpportunity: 'The role\'s value proposition inverts: instead of being measured by reports produced, the Analytics Lead is measured by the quality of the optimization system they\'ve built and the strategic insights that only a human can derive from the data.',
        },
      },
      nodeJourneys: {
        'track-performance': {
          preAI: {
            summary: 'Analytics Lead manually exports data from 8-12 sources (GA, ad platforms, email providers, CRM, third-party trackers) and consolidates into spreadsheets for analysis. Weekly consolidation takes 6-8 hours, and insights are stale by 5-7 days.',
            detail: 'Performance tracking is fragmented. Each channel has its own platform. Analytics Lead exports reports from each, reconciles discrepancies (UTM parameter inconsistencies, timezone offsets, duplicate tracking), and consolidates into a master spreadsheet. Attribution is rudimentary: last-click or first-click only. Multi-touch attribution requires manual investigation. The result is a weekly performance report that VP Marketing adjusts strategy against.',
            painPoints: [
              'Data discrepancies across platforms require 2-3 hours of investigation and reconciliation per week',
              'Last-click attribution obscures the true contribution of awareness and consideration channels',
              'Manual data exports are error-prone; a single mistake invalidates the entire report',
              'Performance insights come 5-7 days after the reporting period ends; insights are stale by the time they influence decisions',
            ],
            benchmarks: [
              '42% of marketers rely on manual spreadsheet attribution (RevSure 2024)',
              'Analytics Lead spends 5-10 hours per week on manual reporting (industry survey)',
            ],
            outcomes: [
              'Weekly performance reports delivered 5-7 days post-period-end',
              'Attribution accuracy: 60-70% (unknown or miscredited conversions)',
              'Channel contribution estimates drive tactical budget reallocation quarterly, not continuously',
            ],
            roleEvolution: 'Analytics Lead spends 50%+ of their time on data consolidation and reconciliation. Strategic analysis is compressed into the remaining time.',
          },
          aiAgents: {
            summary: 'AI agents automatically pull data from all tracking sources, reconcile discrepancies, and surface real-time performance dashboards. Analytics Lead focuses on analysis and interpretation, not data plumbing.',
            detail: 'Agents connect to GA4, ad platforms, email providers, CRM, and custom tracking via APIs. They automatically map dimensions and metrics, resolve UTM inconsistencies, and reconcile timezone offsets. Data flows continuously into a centralized data warehouse. Real-time dashboards surface performance by channel, campaign, audience segment, and device. Anomaly detection flags unusual patterns. Analytics Lead spends 1-2 hours on analysis instead of 6-8 hours on consolidation.',
            painPoints: [
              'Agents must adapt to platform changes (API updates, schema changes); ongoing maintenance required',
              'Real-time data can be noisy; statistically insignificant spikes can trigger false escalations',
              'Historical data inconsistencies require manual cleanup before agents can synthesize reliable trends',
            ],
            benchmarks: [
              'AI-augmented tracking reduces manual data consolidation from 6-8 hours to 30 minutes per week (Salesforce 2024)',
              'Real-time dashboard availability enables daily tactical adjustments vs. weekly (industry composite)',
            ],
            outcomes: [
              'Performance data available in real-time (vs. 5-7 day lag)',
              'Analytics Lead spends 2-3 hours per week on analysis (vs. 6-8 hours on consolidation)',
              'Anomaly detection reduces surprise performance drops by 60-70%',
            ],
            roleEvolution: 'Analytics Lead transitions from data plumber to data strategist. Time freed from consolidation is reinvested in deeper analysis, audience segmentation, and strategic forecasting.',
          },
          aiAgentic: {
            summary: 'Agentic systems continuously track performance, auto-detect anomalies with causal analysis, and cascade alerts to downstream teams when action is needed. Analytics Lead reviews a daily digest of significant findings.',
            detail: 'Performance tracking becomes fully autonomous. Agents ingest data continuously, maintain a real-time data model, and automatically detect anomalies with causal inference. Alerts flow directly to responsible teams. Analytics Lead receives a daily digest of significant findings and digs into watchlisted items if needed.',
            painPoints: [
              'Causal inference requires robust experimentation and historical data; incomplete experiments lead to incorrect root cause attribution',
              'Alerts to downstream teams must be carefully calibrated to avoid alert fatigue',
              'Autonomous tracking removes Analytics Lead\'s direct visibility into data quality issues',
            ],
            benchmarks: [
              'Anomaly detection with <5% false positive rate (industry target)',
              'Root cause analysis available within 2 hours of detection (Salesforce Agentforce 2025)',
            ],
            outcomes: [
              'Performance anomalies detected and investigated within 4 hours (vs. 5-7 days)',
              'Tactical teams can respond in real-time to performance signals',
              'Analytics Lead spends <30 minutes per week on performance tracking; focus shifts to strategic forecasting',
            ],
            roleEvolution: 'Analytics Lead becomes a performance auditor and strategic advisor. They set KPI thresholds and alert criteria quarterly, review escalated investigations daily, and focus on forward-looking analysis.',
          },
        },
        'generate-report': {
          preAI: {
            summary: 'Analytics Lead manually crafts weekly and monthly reports: performance summaries, trend analysis, visual dashboards. Report creation takes 3-5 hours per week, and static reports cannot be explored by executives without requesting custom analyses.',
            detail: 'Report creation is manual and labor-intensive. Analytics Lead pulls data, creates visualizations, writes narrative analysis, and packages into PowerPoint or PDF. Reports are tailored by audience: executive summary for VP Marketing, detailed breakdowns for channel leads. Each report is static — if VP Marketing wants to drill down, they email Analytics Lead for a custom analysis.',
            painPoints: [
              'Report creation is repetitive; the same charts and analyses are remade weekly with updated numbers',
              'Report delivery is batched and async; insights are stale by the time they are read',
              'Custom analysis requests add 2-4 hours per week of unplanned work',
              'No direct interactivity; executives cannot drill down or filter data themselves',
            ],
            benchmarks: [
              'Manual reports require 5-10 hours per week of Analytics Lead time (industry survey)',
              '42% of reports are re-requested or modified post-delivery due to missing details (Gartner)',
            ],
            outcomes: [
              'Weekly reports delivered 2-3 days after period end',
              'Custom analysis requests add 2-4 hours per week of unplanned work',
              'Report utilization: 60-70% (some reports are created but not heavily used)',
            ],
            roleEvolution: 'Analytics Lead is a report factory. Large portion of time is spent on report design and presentation, not insight generation.',
          },
          aiAgents: {
            summary: 'AI agents auto-generate reports by template, populate with real-time data, and create interactive dashboards. Analytics Lead reviews, adds strategic narrative, and distributes in 30 minutes.',
            detail: 'Report generation is templated and automated. Agents know audience preferences and populate accordingly. Analytics Lead receives a draft report, spends 20 minutes adding strategic context, and sends. Interactive dashboards let executives self-serve drill-downs without waiting for custom analyses.',
            painPoints: [
              'Templates can be rigid; non-standard requests still require manual work',
              'Interactive dashboards require ongoing maintenance as metrics change',
              'Agents may surface statistically insignificant trends with high visual emphasis',
            ],
            benchmarks: [
              'Report generation time drops from 3-5 hours to 30 minutes per week (Salesforce 2024)',
              'Custom analysis requests drop 70% as executives self-serve via interactive dashboards (industry composite)',
            ],
            outcomes: [
              'Weekly reports available same-day or next-day',
              'Custom analysis turnaround: minutes (self-serve) vs. hours (email request)',
              'Report utilization increases to 85%+ as interactivity enables exploratory analysis',
            ],
            roleEvolution: 'Analytics Lead transitions from report writer to insight curator. They validate automated insights, add strategic narrative, and manage dashboard configuration.',
          },
          aiAgentic: {
            summary: 'Agentic systems auto-generate reports, distribute them proactively based on recipient preferences, and adjust report content based on what executives actually view. Reports become predictive, not historical.',
            detail: 'Report generation and distribution is fully autonomous. The agentic layer learns what executives actually read and prioritizes accordingly. Monthly reporting shifts from operational metrics to strategic reviews focused on opportunities, risks, and recommendations.',
            painPoints: [
              'Predictive reporting requires sufficient historical data on executive preferences; early outputs may be suboptimal',
              'Autonomous distribution can lead to report saturation if too aggressive with alerts',
              'Connecting reports to action via downstream agents introduces dependencies and risk',
            ],
            benchmarks: [
              'Report generation time: <10 minutes fully automated (industry composite)',
              'Executive report engagement: 90%+ vs. 60-70% with manual reports (Gartner)',
            ],
            outcomes: [
              'Executives access real-time insights within hours of period close',
              'Custom report requests drop to near-zero as agentic system predicts and surfaces needed analyses',
              'Report-to-action cycle time collapses; insights drive immediate tactical changes',
            ],
            roleEvolution: 'Analytics Lead becomes a strategic advisor and insight escalator. They set report strategy quarterly, review escalated anomalies daily, and focus on forward-looking strategy.',
          },
        },
        'optimize': {
          preAI: {
            summary: 'Analytics Lead reviews weekly performance and makes manual budget reallocation recommendations. Execution lags 3-5 days; optimization is quarterly, not continuous. Recommendations are heuristic, not model-driven.',
            detail: 'Optimization is a manual, batched process. Analytics Lead identifies underperforming and overperforming channels and recommends budget reallocation. The recommendation goes to VP Marketing, who approves it. Implementation takes 2-3 days. The optimization approach is heuristic without deeper analysis of audience saturation or channel synergies.',
            painPoints: [
              'Budget reallocation lags performance signal by 5-10 days; opportunities for rapid response are lost',
              'No systematic understanding of channel interactions; optimization assumes channel independence',
              'Quarterly budgeting locks resources for 3 months regardless of mid-quarter performance changes',
            ],
            benchmarks: [
              'Current optimization cycle: 5-10 days from signal to execution (industry average)',
              'Typical optimization impact: 5-12% improvement in overall ROAS vs. potential 20%+ with continuous optimization',
            ],
            outcomes: [
              'Budget reallocation happens 4x per year (quarterly reviews)',
              'Average time-to-impact: 2-3 weeks',
              'Optimization gains: 5-12% per quarter',
            ],
            roleEvolution: 'Analytics Lead spends 2-3 hours per week on optimization analysis. The role is reactive rather than proactive.',
          },
          aiAgents: {
            summary: 'AI agents model channel ROI, audience saturation, and budget elasticity, recommending daily optimization opportunities. Execution happens within 24 hours of recommendation.',
            detail: 'Agents continuously monitor performance data and model channel dynamics including saturation and halo effects. They generate daily optimization recommendations with expected impact. Analytics Lead reviews in 10 minutes and approves or overrides with strategic context.',
            painPoints: [
              'Elasticity and saturation models require sufficient historical data; weak data leads to poor recommendations',
              'Agents recommend based on ROI/ROAS but may not account for strategic brand-building objectives',
              'Continuous daily optimization can cause rapid budget fluctuations that confuse campaign managers',
            ],
            benchmarks: [
              'AI-augmented optimization cycle: 24 hours from signal to execution vs. 5-10 days (Salesforce 2024)',
              'Expected improvement: 15-25% ROAS improvement over 12 weeks (Forrester 2024)',
            ],
            outcomes: [
              'Budget reallocation executes within 24 hours of recommendation',
              'Optimization drives 15-25% ROAS improvement over 3 months',
              'Analytics Lead spends 30 minutes per week on optimization reviews',
            ],
            roleEvolution: 'Analytics Lead becomes an optimization auditor. They review daily recommendations, approve routine optimizations, and override when strategic factors suggest the agent\'s view is incomplete.',
          },
          aiAgentic: {
            summary: 'Agentic systems autonomously optimize budget allocation across channels in real-time, respecting strategic guardrails set by Analytics Lead. Optimization runs 24/7; human oversight is async.',
            detail: 'Budget optimization becomes a closed-loop system. Analytics Lead sets strategic guardrails. The agentic layer runs optimization algorithms continuously, monitoring channel interactions and macroeconomic factors. Analytics Lead receives a weekly optimization summary and adjusts guardrails if needed.',
            painPoints: [
              'Guardrails must balance constraint and flexibility — overly rigid guardrails hobble the system; too loose and it optimizes away strategic objectives',
              'Autonomous budget allocation removes Analytics Lead\'s direct control; mistakes can be substantial',
              'The agentic layer must balance short-term ROAS with longer-term strategic investments',
            ],
            benchmarks: [
              'Continuous optimization drives 25%+ ROAS improvement over 12 months (Forrester 2024)',
              'Channel experimentation increases 3x with autonomous testing (industry composite)',
            ],
            outcomes: [
              'ROAS improves 25%+ over 12 months vs. quarterly optimization baseline',
              'Analytics Lead intervention time on optimization: <2 hours per week',
              'Experimentation velocity increases; new tactics validated and scaled within days',
            ],
            roleEvolution: 'Analytics Lead becomes a guardrail architect and strategic capital allocator. The role transitions from tactical optimization to strategic capital allocation.',
          },
        },
        'attribution-modeling': {
          preAI: {
            summary: 'Analytics Lead manually traces customer journeys to assign credit to touchpoints. Multi-touch attribution requires 8-10 hours per week of manual investigation. Most brands default to last-click because anything better is too labor-intensive.',
            detail: 'Attribution is the holy grail: which touchpoints actually drove conversion? Last-click attribution is simple but wrong. Multi-touch attribution attempts to distribute credit across the journey but is manual and imprecise. Analytics Lead investigates 20-30 journeys per week to build intuition, then applies a heuristic model.',
            painPoints: [
              'Manual journey tracing is time-consuming and subjective; two analysts might assign credit differently',
              'Last-click severely misrepresents the value of awareness and consideration channels',
              'No systematic understanding of channel synergies; the model assumes channels operate independently',
            ],
            benchmarks: [
              '42% of marketers rely on manual spreadsheet attribution (RevSure 2024)',
              '19% average improvement in marketing ROI within first year of multi-touch attribution (Forrester)',
              '26% increase in ROAS for retailers using algorithmic vs. single-touch attribution (Google/industry)',
            ],
            outcomes: [
              'Attribution accuracy: 60-70% (many conversions remain uncredited or miscredited)',
              'Budget allocation based on flawed attribution; awareness channels may be systematically underfunded',
            ],
            roleEvolution: 'Analytics Lead spends 30-40% of their time on manual attribution analysis. Strategic insights are constrained by poor data.',
          },
          aiAgents: {
            summary: 'AI agents build multi-touch attribution models from historical journey data, assigning probabilistic credit to each touchpoint automatically. Accuracy improves to 85%+.',
            detail: 'Agents ingest all available journey data and build machine learning models to predict which touchpoints causally contributed to conversion. The agent assigns credit probabilistically. Analytics Lead validates the model against campaign performance and adjusts if needed.',
            painPoints: [
              'ML attribution models require large sample sizes and rich journey data',
              'Models can surface spurious correlations that mislead budget allocation',
              'Model maintenance is ongoing; must be retrained as channel mix evolves',
            ],
            benchmarks: [
              'AI-driven attribution accuracy: 85%+ vs. 60-70% with manual models (Forrester 2024)',
              '19% average ROI improvement within first year of multi-touch attribution (Forrester)',
            ],
            outcomes: [
              'Multi-touch attribution available weekly (not manual investigation)',
              'Attribution accuracy increases from 60-70% to 85%+',
              'Awareness and consideration channels receive appropriate credit for first time',
            ],
            roleEvolution: 'Analytics Lead transitions from attribution investigator to attribution validator. Time freed from manual attribution is reallocated to strategic analysis.',
          },
          aiAgentic: {
            summary: 'Agentic systems build and continuously refine multi-touch attribution models incorporating causal inference and channel synergies. Attribution becomes a strategic asset that drives autonomous budget optimization.',
            detail: 'Attribution modeling becomes fully automated and causally informed. The agentic layer accounts for channel synergies and uses causal inference techniques to estimate true contribution. It connects attribution to budget optimization, creating a closed loop.',
            painPoints: [
              'Causal inference requires robust experimentation and long observation windows',
              'Autonomous attribution-driven budget optimization can be destabilizing if the model is wrong',
              'The agentic layer must handle complex scenarios: long sales cycles, multiple products, channel cannibalization',
            ],
            benchmarks: [
              'Causal attribution accuracy: 90%+ (industry target)',
              'Budget reallocation driven by attribution: 30%+ ROAS improvement over 12 months (Forrester 2024)',
            ],
            outcomes: [
              'Multi-touch attribution integrated into real-time budget optimization',
              'ROAS improves 30%+ over 12 months as budget is reallocated from overcredited to undercredited channels',
            ],
            roleEvolution: 'Analytics Lead becomes an attribution strategist. Attribution becomes a closed-loop system: it measures true channel contribution, informs budget optimization, and validates predictions against outcomes.',
          },
        },
        'executive-reporting': {
          preAI: {
            summary: 'Analytics Lead prepares monthly executive reports for CMO and CFO with ROI analysis, budget efficiency metrics, and forecast updates. Report creation takes 6-8 hours; delivery lags month-end by 3-5 days.',
            detail: 'Executive reporting is high-stakes and time-consuming. CMO and CFO want to understand: Is marketing ROI improving? Are we on track? Where should we allocate next quarter? Analytics Lead gathers data, validates accuracy, creates visualizations, and writes narrative analysis. The report is 20-30 pages and takes 6-8 hours. It is delivered 3-5 days after month-end.',
            painPoints: [
              'Report preparation is labor-intensive; same analyses remade monthly',
              'Delivery lag means insights are stale by the time leadership reviews',
              'CFO and CMO have different information needs; multiple versions required',
              'Custom analysis requests add 2-4 hours per month of unplanned work',
            ],
            benchmarks: [
              'Marketing automation returns $5.44 for every $1 spent (Nucleus Research 2024)',
              'Manual executive report preparation: 6-8 hours per month (industry survey)',
            ],
            outcomes: [
              'Executive report delivered 3-5 days after month-end',
              'Custom analysis requests: 3-5 per month, each requiring 2-4 hours',
            ],
            roleEvolution: 'Analytics Lead spends 8-10 hours per month on executive reporting. The role is heavily weighted toward reporting rather than strategic analysis.',
          },
          aiAgents: {
            summary: 'AI agents auto-generate executive dashboards with ROI trends, budget efficiency metrics, forecast models, and scenario planning. Analytics Lead validates insights and adds strategic narrative. Report ready in 2 hours post-month-end.',
            detail: 'Agents automatically prepare executive reports from real-time data with interactive elements. Executives can run scenarios. Analytics Lead spends 30 minutes validating and adding strategic narrative.',
            painPoints: [
              'Forecast models require careful parameterization; unusual situations need manual adjustments',
              'Interactive dashboards can encourage increasingly detailed executive questions',
            ],
            benchmarks: [
              'Executive report generation time: 2 hours post-month-end vs. 6-8 hours (industry composite)',
              'Forecast accuracy: 80-85% within 12-month horizon (Gartner)',
            ],
            outcomes: [
              'Executive report available same-day post-month-end',
              'Scenario planning enables executives to test budget allocation hypotheses in minutes',
              'Custom analysis requests drop 70% via interactive dashboards',
            ],
            roleEvolution: 'Analytics Lead becomes a report curator and strategic advisor. Time freed from report creation is reinvested in strategic analysis and forecasting.',
          },
          aiAgentic: {
            summary: 'Agentic systems continuously generate executive dashboards, predict upcoming risks and opportunities, and recommend strategic actions. Monthly reports evolve into quarterly strategic reviews focused on forward-looking strategy.',
            detail: 'Executive reporting becomes real-time and proactive. The agentic layer maintains live dashboards, predicts risks and opportunities, and handles what-if scenarios automatically. Monthly reporting shifts to quarterly strategic reviews.',
            painPoints: [
              'Real-time dashboards can lead to over-reactive decision-making',
              'Predictive models must be accurate enough to be trustworthy',
              'Autonomous escalation can lead to alert fatigue',
            ],
            benchmarks: [
              'Real-time executive dashboards available 24/7 (industry standard for agentic deployments)',
              'Predictive alerts delivered within 1 hour of data anomaly detection (Salesforce Agentforce 2025)',
            ],
            outcomes: [
              'Executives access real-time performance data; no waiting for monthly reports',
              'Risk and opportunity prediction enables proactive decision-making',
              'Analytics Lead spends 4-6 hours per month on executive reporting vs. 8-10 hours',
            ],
            roleEvolution: 'Analytics Lead becomes a strategic advisor and chief analyst. The role transitions from reporting to strategy: identifying opportunities, forecasting impacts, and recommending capital allocation.',
          },
        },
        'performance-review': {
          preAI: {
            summary: 'Analytics Lead reviews campaign performance weekly against targets. Underperformance triggers investigation and recommendation for reallocation or strategy rework. This gate can restart the pipeline.',
            detail: 'The performance review gate is where campaigns are measured against expectations. Analytics Lead pulls campaign-level data and compares to targets. If a campaign underperforms, they investigate root cause and recommend actions. If multiple campaigns in a category underperform, the gate may restart the pipeline.',
            painPoints: [
              'Performance review is batched (weekly), creating lag between underperformance and action',
              'Determining root cause requires manual investigation and hypothesis testing',
              'No early warning system; campaigns must run for days before meaningful data accumulates',
            ],
            benchmarks: [
              'Typical campaign review cycle: weekly after launch (industry standard)',
              'Time-to-decision on campaign optimization: 3-5 days after underperformance detected',
            ],
            outcomes: [
              'Underperforming campaigns identified within 1 week',
              'Some campaigns allowed to run to completion despite poor performance due to late identification',
            ],
            roleEvolution: 'Analytics Lead spends 3-4 hours per week on performance review and investigation.',
          },
          aiAgents: {
            summary: 'AI agents continuously monitor campaign performance, flag underperformance with root cause analysis within 24 hours of launch, and recommend optimization or pause actions.',
            detail: 'Agents monitor campaign performance in real-time. Within 24 hours of launch, they assess trajectory and trigger root cause analysis if performance is significantly below expected. Analytics Lead reviews decision cards in 5 minutes and approves action.',
            painPoints: [
              'Early-stage data (first 24 hours) can be noisy; small sample sizes lead to false positives',
              'Root cause analysis with limited data requires careful statistical modeling',
              'Rapid optimization cycles can confuse campaign managers',
            ],
            benchmarks: [
              'Underperformance detection latency: <24 hours (Salesforce 2024)',
              'Campaign performance improvement through rapid early optimization: 15-20% (industry composite)',
            ],
            outcomes: [
              'Underperforming campaigns identified and optimized within 24 hours',
              'Early-stage optimization prevents wasted spend on doomed campaigns',
            ],
            roleEvolution: 'Analytics Lead reviews daily performance alerts. They approve or override optimization recommendations and focus on strategic investigation.',
          },
          aiAgentic: {
            summary: 'Agentic systems autonomously optimize underperforming campaigns within 24-48 hours of launch. Performance review becomes a strategic gate focused on portfolio-level decisions and feedback loops that restart the pipeline.',
            detail: 'Performance review becomes autonomous and strategic. The agentic layer monitors continuously and auto-optimizes underperformers. The strategic performance review gate focuses on portfolio-level decisions. The agentic layer escalates portfolio-level insights to Analytics Lead and VP Marketing.',
            painPoints: [
              'Autonomous optimization without human oversight can fix tactical issues but miss strategic problems',
              'Rapid changes can dilute learning and make it harder to understand what truly works',
              'The system must distinguish between "worth optimizing" and "time to stop"',
            ],
            benchmarks: [
              'Autonomous optimization success rate: 75%+ of campaigns brought to target (Salesforce Agentforce 2025)',
              'Portfolio-level ROAS stability: +2-5% quarter-over-quarter through continuous optimization (Forrester)',
            ],
            outcomes: [
              'Underperforming campaigns optimized within 24-48 hours; wasted spend reduced 40-50%',
              'Campaign success rate improves to 85-90% vs. 60-70% with manual review',
              'Analytics Lead focuses on portfolio strategy and campaign conceptualization',
            ],
            roleEvolution: 'Analytics Lead becomes a portfolio strategist and optimization auditor. The role transitions from campaign troubleshooting to strategic capital allocation.',
          },
        },

        // ── SUPPORT NODES ────────────────────────────────────────────────
        'performance-agent': {
          preAI: {
            summary: 'Manual performance tracking via dashboards; checks happen 1-2x daily.',
            detail: 'Analytics Lead manually monitors dashboards and pulls data for investigation when performance looks off.',
          },
          aiAgents: {
            summary: 'Continuous monitoring with real-time alerts; anomalies flagged within 1 hour.',
            detail: 'Performance agents monitor all channels continuously, detecting anomalies and alerting Analytics Lead when metrics deviate from expected ranges.',
          },
          aiAgentic: {
            summary: 'Fully autonomous monitoring and tactical optimization; escalates strategic decisions to Analytics Lead.',
            detail: 'Performance agents handle real-time monitoring, anomaly detection, and tactical optimization autonomously. They escalate only strategic decisions.',
          },
        },
        'optimization-agent': {
          preAI: {
            summary: 'Manual budget allocation quarterly; ad hoc optimization based on performance trends.',
            detail: 'Budget is allocated at the start of each quarter and adjusted infrequently based on manual analysis.',
          },
          aiAgents: {
            summary: 'Daily optimization recommendations; Analytics Lead approves budget reallocation.',
            detail: 'Optimization agents model channel elasticity and saturation, generating daily recommendations for Analytics Lead review.',
          },
          aiAgentic: {
            summary: 'Autonomous budget optimization within guardrails; escalates portfolio-level decisions to Analytics Lead.',
            detail: 'Optimization agents run continuous budget allocation algorithms within Analytics Lead-defined guardrails. Portfolio-level strategic decisions are escalated.',
          },
        },
        'analytics-data': {
          preAI: {
            summary: 'Manual data consolidation from 8-12 sources; takes 6-8 hours per week.',
            detail: 'Analytics Lead exports data from each platform, reconciles discrepancies, and consolidates into a master spreadsheet. Data lags by 5-7 days.',
          },
          aiAgents: {
            summary: 'Automated data ingestion via APIs; real-time dashboard available.',
            detail: 'Agents pull data continuously from all sources, reconcile automatically, and surface in unified dashboard.',
          },
          aiAgentic: {
            summary: 'Fully automated data pipeline with anomaly detection and validation.',
            detail: 'Agentic systems maintain a real-time data warehouse. Data quality is validated automatically; issues are flagged for review.',
          },
        },
        'cdp-profiles': {
          preAI: {
            summary: 'Audience segmentation done manually in email platform; limited integration with analytics.',
            detail: 'Segments are maintained in the email tool; sync to ad platforms is manual or via limited integration.',
          },
          aiAgents: {
            summary: 'CDP profiles automatically segmented by AI; synced to all channels.',
            detail: 'Agents build audience segments based on behavioral data and sync to email, ads, and social platforms.',
          },
          aiAgentic: {
            summary: 'Real-time audience segmentation with dynamic segments automatically managed.',
            detail: 'Agentic systems maintain real-time audience segments, adjust targeting based on behavior changes, and sync across all channels continuously.',
          },
        },
        'budget-allocation': {
          preAI: {
            summary: 'Manual quarterly budget planning driven by strategy, not data.',
            detail: 'VP Marketing and CFO allocate budget based on strategic priorities. Changes mid-quarter are rare.',
          },
          aiAgents: {
            summary: 'Budget recommendations informed by historical ROI; updated monthly.',
            detail: 'Agents analyze channel ROI and recommend reallocations. Analytics Lead reviews and approves changes.',
          },
          aiAgentic: {
            summary: 'Continuous budget optimization; recommendations updated daily within guardrails.',
            detail: 'Agentic systems continuously optimize budget allocation. Analytics Lead sets guardrails quarterly; system operates autonomously within them.',
          },
        },
        'channel-benchmarks': {
          preAI: {
            summary: 'Manual benchmark collection from industry reports; updated annually.',
            detail: 'Analytics Lead subscribes to industry research and maintains a benchmark spreadsheet. Benchmarks are static.',
          },
          aiAgents: {
            summary: 'Benchmarks automatically updated monthly from industry feeds; historical trends tracked.',
            detail: 'Agents ingest industry data feeds and maintain updated benchmarks with historical trend comparison.',
          },
          aiAgentic: {
            summary: 'Real-time benchmark tracking with predictive benchmarks based on market conditions.',
            detail: 'Agentic systems track industry benchmarks in real-time and adjust for seasonality and market conditions.',
          },
        },

        // ── Non-rendered pipeline nodes (preserved for data completeness) ──

        'receive-request': {
          preAI: {
            summary: 'You measure incoming requests manually, sorting through emails and Slack messages for data accuracy.',
            detail: 'Requests arrive in inconsistent formats with no standard intake process. You spend hours triaging and clarifying scope before data accuracy can even begin.',
          },
          aiAgents: {
            summary: 'An AI intake agent structures requests and flags data accuracy implications before they reach your queue.',
            detail: 'Requests arrive pre-categorized with data accuracy signals highlighted. You validate and prioritize rather than manually parsing raw inputs.',
          },
          aiAgentic: {
            summary: 'Autonomous intake agents triage, validate, and route requests with data accuracy logic — you govern exceptions.',
            detail: 'Agentic intake handles end-to-end request processing with your data accuracy rules embedded. You set policies and review escalations while routine requests flow automatically.',
          },
        },
        'research-insights': {
          preAI: {
            summary: 'You gather audience and market research manually, compiling data from multiple sources for data accuracy.',
            detail: 'Research is scattered across tools, reports, and tribal knowledge. Building a complete picture for data accuracy takes days and the data is often stale by the time you use it.',
          },
          aiAgents: {
            summary: 'AI research tools surface audience and market data relevant to your data accuracy needs automatically.',
            detail: 'Research agents pull relevant data from multiple sources and present data accuracy insights in a structured format. You curate and interpret rather than gather.',
          },
          aiAgentic: {
            summary: 'Autonomous research agents continuously update data accuracy intelligence — you set the strategic lens.',
            detail: 'Research agents proactively surface data accuracy insights from market signals, audience data, and competitive movements. You shape research priorities, not execute searches.',
          },
        },
        'write-brief': {
          preAI: {
            summary: 'You wait for briefs written by hand, often lacking the data accuracy detail you need.',
            detail: 'Briefs arrive incomplete or misaligned with your data accuracy requirements. You spend cycles requesting revisions and clarifying expectations before work can proceed.',
          },
          aiAgents: {
            summary: 'AI drafts briefs with data accuracy requirements pre-populated from templates and past projects.',
            detail: 'Brief generation agents pull your data accuracy requirements into structured templates. You review and refine rather than starting from a blank page.',
          },
          aiAgentic: {
            summary: 'Autonomous agents generate complete briefs with data accuracy alignment built in — you approve strategy.',
            detail: 'Brief agents produce publication-ready briefs that embed your data accuracy requirements from historical patterns. You govern strategic direction rather than reviewing drafts.',
          },
        },
        'draft-content': {
          preAI: {
            summary: 'You review drafts created entirely by hand, checking each one for alignment with data accuracy.',
            detail: 'First drafts vary wildly in quality and data accuracy alignment. You often send content back for multiple revision cycles, creating bottlenecks in the pipeline.',
          },
          aiAgents: {
            summary: 'AI generates first drafts with data accuracy guidelines embedded, reducing your revision cycles.',
            detail: 'Drafting agents produce content aligned with your data accuracy standards from the start. You focus on strategic refinement rather than basic corrections.',
          },
          aiAgentic: {
            summary: 'Autonomous drafting agents produce content meeting data accuracy standards — you set creative direction.',
            detail: 'Drafting agents generate content that passes your data accuracy criteria automatically. You focus on strategic vision and creative differentiation rather than quality control.',
          },
        },
        'seo-optimization': {
          preAI: {
            summary: 'SEO optimization is manual and disconnected from your data accuracy priorities.',
            detail: 'Keyword research and meta optimization happen separately from your data accuracy workflow. You rarely see SEO data until after content is already in review.',
          },
          aiAgents: {
            summary: 'AI SEO tools optimize content while preserving your data accuracy priorities.',
            detail: 'SEO agents suggest keywords and meta improvements that align with your data accuracy goals. You approve optimizations rather than manually researching keywords.',
          },
          aiAgentic: {
            summary: 'Autonomous SEO agents optimize continuously within data accuracy boundaries — you define the strategy.',
            detail: 'SEO agents self-optimize content based on real-time search signals and your data accuracy guardrails. You set strategic keywords and constraints, not individual page optimizations.',
          },
        },
        'brand-compliance': {
          preAI: {
            summary: 'Brand checks are subjective and slow, creating delays in your data accuracy workflow.',
            detail: 'Brand reviewers interpret guidelines differently. Inconsistent enforcement of tone, terminology, and messaging means data accuracy is harder to maintain at scale.',
          },
          aiAgents: {
            summary: 'AI brand checkers flag violations and score data accuracy alignment before human review.',
            detail: 'Brand agents scan content against guidelines and highlight data accuracy issues. You make judgment calls on edge cases rather than catching basic violations.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents enforce compliance at scale with data accuracy rules — you update the rulebook.',
            detail: 'Brand agents apply and evolve compliance checks across all content automatically. Your data accuracy standards are codified as machine-enforceable rules that you govern and refine.',
          },
        },
        'final-edit': {
          preAI: {
            summary: 'Final edits depend entirely on editor availability, blocking your data accuracy timelines.',
            detail: 'A single editor bottleneck means content waits in queue. Your data accuracy deadlines slip because there is no way to parallelize the final polish step.',
          },
          aiAgents: {
            summary: 'AI editing assistants handle mechanical fixes, freeing your data accuracy focus for strategic polish.',
            detail: 'Editing agents catch grammar, style, and consistency issues automatically. Your data accuracy perspective is reserved for nuance and narrative quality.',
          },
          aiAgentic: {
            summary: 'Autonomous editing agents polish content to publication standard — your data accuracy bar is encoded as policy.',
            detail: 'Editing agents handle all mechanical and stylistic refinement autonomously. Your data accuracy standards are embedded as editorial policies that improve with each iteration.',
          },
        },
        'schedule-publish': {
          preAI: {
            summary: 'Publishing is a manual CMS process with no connection to your data accuracy planning.',
            detail: 'Each piece requires manual scheduling, metadata entry, and CMS configuration. Your data accuracy goals are disconnected from the publish timeline.',
          },
          aiAgents: {
            summary: 'AI scheduling agents suggest optimal publish timing based on data accuracy data.',
            detail: 'Publishing agents recommend times and configurations informed by your data accuracy priorities. You approve the schedule rather than manually configuring CMS settings.',
          },
          aiAgentic: {
            summary: 'Autonomous publishing agents manage scheduling end-to-end using data accuracy optimization logic.',
            detail: 'Publishing agents handle CMS configuration, timing optimization, and deployment autonomously within your data accuracy constraints. You set publishing policies, not individual schedules.',
          },
        },
        'distribute': {
          preAI: {
            summary: 'Content distribution is manual channel-by-channel, with limited visibility into data accuracy.',
            detail: 'Each channel requires separate formatting, scheduling, and posting. There is no unified view of how distribution supports your data accuracy objectives.',
          },
          aiAgents: {
            summary: 'AI distribution agents adapt content per channel with data accuracy rules built in.',
            detail: 'Distribution agents format and deploy content across channels following your data accuracy guidelines. You monitor and adjust rather than manually posting to each platform.',
          },
          aiAgentic: {
            summary: 'Autonomous distribution agents manage all channels with data accuracy rules — you govern the playbook.',
            detail: 'Distribution agents deploy, adapt, and optimize content across every channel following your data accuracy playbook. You evolve distribution strategy, not execute individual channel posts.',
          },
        },
        'brief-approval': {
          preAI: {
            summary: 'Brief approvals are bottlenecked by manual review cycles that delay your data accuracy work.',
            detail: 'You wait for briefs to pass through approval chains before your data accuracy tasks can begin. Unclear approval criteria mean briefs bounce back and forth repeatedly.',
          },
          aiAgents: {
            summary: 'AI pre-screens briefs for data accuracy alignment, routing only exceptions to you.',
            detail: 'Approval agents check briefs against your data accuracy criteria and flag gaps. You review flagged items rather than reading every brief end to end.',
          },
          aiAgentic: {
            summary: 'Autonomous approval agents clear standard briefs and escalate only data accuracy exceptions to you.',
            detail: 'Approval agents validate briefs against your data accuracy criteria and auto-approve routine requests. You handle strategic exceptions and edge cases only.',
          },
        },
        'quality-check': {
          preAI: {
            summary: 'Quality checks are inconsistent manual reviews with no standard data accuracy criteria.',
            detail: 'Quality varies by reviewer and day. There is no automated baseline for readability, accuracy, or data accuracy alignment, leading to uneven content standards.',
          },
          aiAgents: {
            summary: 'AI quality gates enforce baseline standards, letting you focus on data accuracy nuance.',
            detail: 'Quality agents score readability, accuracy, and SEO automatically. Your data accuracy evaluation focuses on strategic alignment rather than mechanical checks.',
          },
          aiAgentic: {
            summary: 'Autonomous quality agents enforce standards continuously — data accuracy baselines are self-maintaining.',
            detail: 'Quality agents apply and evolve quality standards based on your data accuracy benchmarks. You set quality policies that the system enforces and improves over time.',
          },
        },
        'brand-review': {
          preAI: {
            summary: 'Brand reviews are subjective gates that slow your data accuracy pipeline.',
            detail: 'Reviewers apply brand guidelines inconsistently. What passes one review fails the next, creating unpredictable delays in your data accuracy workflow.',
          },
          aiAgents: {
            summary: 'AI brand agents pre-score content, surfacing data accuracy issues before your review.',
            detail: 'Brand review agents apply guidelines consistently and flag data accuracy deviations. You handle exceptions and judgment calls rather than full content scans.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents review all content at scale — you govern data accuracy policy evolution.',
            detail: 'Brand review agents handle all compliance checking autonomously with your data accuracy rules. You update brand guidelines and review the rare edge case that requires human judgment.',
          },
        },
        'stakeholder-signoff': {
          preAI: {
            summary: 'Stakeholder sign-off is a bottleneck where executives delay your data accuracy timelines.',
            detail: 'Senior approvers are busy and unresponsive. Your data accuracy work stalls while waiting for sign-off, and last-minute changes create downstream chaos.',
          },
          aiAgents: {
            summary: 'AI prepares sign-off packages with data accuracy summaries for faster executive approval.',
            detail: 'Sign-off agents compile context, changes, and data accuracy impact assessments for approvers. Executives review structured summaries rather than raw content.',
          },
          aiAgentic: {
            summary: 'Autonomous agents handle routine sign-offs within data accuracy parameters — executives approve strategy only.',
            detail: 'Sign-off agents clear content that meets all data accuracy criteria automatically. Executives only review strategic pivots or high-risk content that breaches defined thresholds.',
          },
        },
        'social-listening': {
          preAI: {
            summary: 'Social listening is ad hoc keyword monitoring with no systematic link to data accuracy.',
            detail: 'You check social platforms manually for relevant conversations. Insights rarely reach your data accuracy workflow before they become stale or irrelevant.',
          },
          aiAgents: {
            summary: 'AI monitoring tools surface trending topics and sentiment relevant to data accuracy in real time.',
            detail: 'Listening agents track conversations and flag data accuracy signals across platforms. You act on curated insights rather than monitoring feeds manually.',
          },
          aiAgentic: {
            summary: 'Autonomous listening agents track and respond to data accuracy signals across all platforms in real time.',
            detail: 'Listening agents monitor social channels and proactively surface data accuracy opportunities and risks. You set monitoring priorities and review strategic findings.',
          },
        },
        'visual-asset-creation': {
          preAI: {
            summary: 'Visual asset creation is a slow design queue disconnected from your data accuracy needs.',
            detail: 'Design requests go into a backlog with unclear priorities. Your data accuracy requirements are often lost in translation between brief and final asset.',
          },
          aiAgents: {
            summary: 'AI design tools generate asset options aligned with data accuracy requirements.',
            detail: 'Design agents produce visual variants following your data accuracy guidelines. You select and refine from AI-generated options rather than directing from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous design agents produce visual assets within data accuracy guidelines — you set creative direction.',
            detail: 'Design agents generate publication-ready visuals following your data accuracy standards. You define the creative vision and approve hero assets while routine visuals ship autonomously.',
          },
        },
        'legal-review': {
          preAI: {
            summary: 'Legal review is an opaque process that creates unpredictable delays in your data accuracy work.',
            detail: 'Legal feedback arrives late with minimal context. You cannot predict how long review will take, making data accuracy planning unreliable.',
          },
          aiAgents: {
            summary: 'AI legal screening flags compliance risks early, reducing data accuracy surprises downstream.',
            detail: 'Legal agents pre-scan content for regulatory issues and data accuracy risks. You get early warnings rather than discovering problems at the sign-off stage.',
          },
          aiAgentic: {
            summary: 'Autonomous legal agents clear routine content and escalate only true data accuracy risks to human counsel.',
            detail: 'Legal agents scan and clear standard content autonomously using your data accuracy rule framework. Human lawyers handle novel risk scenarios and precedent-setting decisions only.',
          },
        },
        'accessibility-check': {
          preAI: {
            summary: 'Accessibility checking is a manual afterthought, rarely connected to your data accuracy process.',
            detail: 'WCAG compliance and inclusive language reviews happen late in the pipeline. Your data accuracy work is already done when accessibility issues force rework.',
          },
          aiAgents: {
            summary: 'AI accessibility tools catch WCAG violations automatically, protecting your data accuracy standards.',
            detail: 'Accessibility agents scan for inclusive language and alt-text compliance. Your data accuracy requirements benefit from automated baseline checks before human review.',
          },
          aiAgentic: {
            summary: 'Autonomous accessibility agents enforce WCAG and inclusive standards — data accuracy is guaranteed by default.',
            detail: 'Accessibility agents ensure all content meets compliance standards before publication. Your data accuracy benefits from guaranteed accessibility without manual checking overhead.',
          },
        },
        'localize-content': {
          preAI: {
            summary: 'Localization is a slow, manual translation process that delays your data accuracy for global markets.',
            detail: 'Each market requires separate translation, cultural review, and compliance checking. Your data accuracy suffers because localized versions lag weeks behind the original.',
          },
          aiAgents: {
            summary: 'AI translation agents accelerate localization while respecting data accuracy requirements.',
            detail: 'Localization agents produce initial translations with data accuracy context preserved. You review for cultural nuance rather than translating from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous localization agents adapt content for all markets simultaneously — your data accuracy scales globally.',
            detail: 'Localization agents handle translation, cultural adaptation, and regional compliance autonomously. Your data accuracy is maintained across markets without manual per-locale effort.',
          },
        },
        'ab-variant-creation': {
          preAI: {
            summary: 'A/B variants are created manually with limited connection to your data accuracy hypotheses.',
            detail: 'Test variants rely on guesswork rather than data. Your data accuracy insights rarely inform variant design, reducing the value of testing efforts.',
          },
          aiAgents: {
            summary: 'AI generates test variants informed by data accuracy data and historical performance.',
            detail: 'Variant agents create headlines, CTAs, and imagery options based on your data accuracy hypotheses. You select winning approaches rather than brainstorming from zero.',
          },
          aiAgentic: {
            summary: 'Autonomous variant agents design, deploy, and learn from tests using data accuracy hypotheses — you set the agenda.',
            detail: 'Variant agents run continuous testing experiments informed by your data accuracy objectives. You define what to test and review strategic learnings while the system iterates autonomously.',
          },
        },
        'content-repurposing': {
          preAI: {
            summary: 'Content repurposing is manual reformatting, disconnected from your data accuracy goals.',
            detail: 'Each derivative asset is created from scratch. Your data accuracy requirements are not systematically applied when repurposing content across formats.',
          },
          aiAgents: {
            summary: 'AI repurposing agents derive secondary assets with data accuracy consistency built in.',
            detail: 'Repurposing agents transform primary content into channel-specific formats following your data accuracy guidelines. You approve derivatives rather than recreating each manually.',
          },
          aiAgentic: {
            summary: 'Autonomous repurposing agents derive all secondary assets automatically within data accuracy guidelines.',
            detail: 'Repurposing agents transform primary content into every derivative format following your data accuracy rules. You set format strategy while the system handles production at scale.',
          },
        },
        'archive-tag': {
          preAI: {
            summary: 'Content archiving is inconsistent, making data accuracy-related retrieval nearly impossible.',
            detail: 'Tagging and taxonomy are applied inconsistently or not at all. Finding past content relevant to data accuracy requires searching through unstructured repositories.',
          },
          aiAgents: {
            summary: 'AI tagging agents classify content automatically, making data accuracy retrieval faster.',
            detail: 'Archive agents apply taxonomy and metadata based on your data accuracy categories. You validate classifications rather than manually tagging every asset.',
          },
          aiAgentic: {
            summary: 'Autonomous archive agents maintain perfect taxonomy — data accuracy retrieval is instant and reliable.',
            detail: 'Archive agents classify, tag, and organize all content using your data accuracy taxonomy automatically. You evolve the taxonomy structure while the system maintains it flawlessly.',
          },
        },
        'legal-compliance-gate': {
          preAI: {
            summary: 'Legal compliance gates create unpredictable holds that delay your data accuracy deadlines.',
            detail: 'Legal sign-off timing is opaque and variable. Your data accuracy timelines are at the mercy of legal review queues with no visibility into status.',
          },
          aiAgents: {
            summary: 'AI pre-screening reduces legal gate delays by resolving routine data accuracy checks automatically.',
            detail: 'Compliance agents handle standard checks and only escalate data accuracy edge cases to human lawyers. Your timelines are more predictable because routine items clear faster.',
          },
          aiAgentic: {
            summary: 'Autonomous compliance gates clear routine content instantly — only novel data accuracy risks reach human lawyers.',
            detail: 'Compliance agents handle standard legal checks autonomously using your data accuracy risk framework. Human review is reserved for unprecedented scenarios and policy updates.',
          },
        },
        'localization-quality-gate': {
          preAI: {
            summary: 'Localization quality gates are inconsistent, creating data accuracy risks in global markets.',
            detail: 'Quality checks for localized content vary by market and reviewer. Your data accuracy standards are unevenly applied across regions and languages.',
          },
          aiAgents: {
            summary: 'AI quality checks catch translation errors before they affect your data accuracy outcomes.',
            detail: 'Localization QA agents verify accuracy and cultural fit automatically. Your data accuracy standards are applied consistently across all target markets.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents ensure localization quality across all markets — data accuracy is guaranteed globally.',
            detail: 'Localization QA agents validate every market adaptation autonomously against your data accuracy standards. You set quality criteria while the system enforces them at scale.',
          },
        },
        'segment-mapping': {
          preAI: {
            summary: 'Segment mapping is manual spreadsheet work with limited visibility into data accuracy impact.',
            detail: 'Mapping content variants to audience segments is done in spreadsheets. Your data accuracy data is disconnected from the personalization logic.',
          },
          aiAgents: {
            summary: 'AI agents map variants to segments using data accuracy data from the CDP.',
            detail: 'Segment agents recommend variant-audience matches based on your data accuracy signals. You review the mapping rather than building it manually in spreadsheets.',
          },
          aiAgentic: {
            summary: 'Autonomous segment agents map and optimize variant-audience matches using live data accuracy signals.',
            detail: 'Segment agents continuously refine variant-audience mappings based on real-time data accuracy data. You define segmentation strategy while the system executes and optimizes automatically.',
          },
        },
        'dynamic-assembly': {
          preAI: {
            summary: 'Dynamic content assembly is rigid and template-bound, limiting your data accuracy options.',
            detail: 'Personalized experiences require engineering support for each variant. Your data accuracy vision is constrained by inflexible assembly templates.',
          },
          aiAgents: {
            summary: 'AI assembly agents construct personalized experiences informed by data accuracy rules.',
            detail: 'Assembly agents combine content components per segment following your data accuracy logic. You define rules and review outputs rather than manually configuring each variant.',
          },
          aiAgentic: {
            summary: 'Autonomous assembly agents construct personalized experiences in real time — data accuracy logic is self-optimizing.',
            detail: 'Assembly agents build dynamic experiences per segment using your data accuracy rules and real-time behavioral signals. You govern personalization policies, not individual assembly configurations.',
          },
        },
        'personalization-qa': {
          preAI: {
            summary: 'Personalization QA is manual spot-checking that misses data accuracy gaps.',
            detail: 'Testing every segment-variant combination is impossible manually. Your data accuracy concerns are only caught when users report issues post-launch.',
          },
          aiAgents: {
            summary: 'AI QA agents validate personalization coverage and flag data accuracy gaps before launch.',
            detail: 'QA agents test every segment-variant combination against your data accuracy requirements. You review exception reports rather than manually spot-checking combinations.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents validate every personalization scenario — data accuracy gaps are caught before launch.',
            detail: 'Personalization QA agents test all segment-variant combinations against your data accuracy requirements automatically. You set acceptance criteria while the system validates at scale.',
          },
        },
        'campaign-planning': {
          preAI: {
            summary: 'Campaign planning is a manual coordination effort with fragmented data accuracy inputs.',
            detail: 'Campaign plans are built in decks and spreadsheets with incomplete data. Your data accuracy perspective is often incorporated too late in the planning cycle.',
          },
          aiAgents: {
            summary: 'AI planning agents draft campaign frameworks with data accuracy data pre-integrated.',
            detail: 'Planning agents pull audience, budget, and performance data into campaign templates. Your data accuracy priorities shape the plan from the start rather than being retrofitted.',
          },
          aiAgentic: {
            summary: 'Autonomous planning agents generate campaign frameworks using data accuracy intelligence — you set objectives.',
            detail: 'Planning agents produce data-driven campaign plans with your data accuracy priorities embedded. You define strategic goals while the system optimizes tactics and resource allocation.',
          },
        },
        'consent-check': {
          preAI: {
            summary: 'Consent checking is a manual compliance step that adds friction to your data accuracy process.',
            detail: 'Verifying GDPR/CCPA consent for targeting requires manual cross-referencing. Your data accuracy work is delayed while compliance status is manually confirmed.',
          },
          aiAgents: {
            summary: 'AI consent agents verify targeting compliance automatically, reducing data accuracy friction.',
            detail: 'Consent agents cross-reference CDP signals against GDPR/CCPA rules for your data accuracy needs. You handle exceptions rather than manually verifying every segment.',
          },
          aiAgentic: {
            summary: 'Autonomous consent agents enforce privacy compliance at scale — data accuracy is guaranteed by architecture.',
            detail: 'Consent agents verify targeting compliance in real time across all segments using your data accuracy framework. You set privacy policies while the system enforces them automatically.',
          },
        },
        'paid-creative-production': {
          preAI: {
            summary: 'Paid creative production runs separately from organic, fragmenting your data accuracy oversight.',
            detail: 'Ad creative and organic content are produced in silos. Your data accuracy perspective is applied inconsistently between paid and organic channels.',
          },
          aiAgents: {
            summary: 'AI production agents generate paid variants from organic content with data accuracy consistency.',
            detail: 'Paid creative agents adapt organic content for ad platforms following your data accuracy guidelines. You approve and fine-tune rather than producing ad creative from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous production agents create paid variants at scale within data accuracy guardrails — you set the strategy.',
            detail: 'Paid creative agents generate ad variants from organic content following your data accuracy guidelines. You define creative strategy while the system produces and optimizes at scale.',
          },
        },
        'competitive-response': {
          preAI: {
            summary: 'Competitive response is slow and reactive, giving you no data accuracy advantage.',
            detail: 'By the time you spot a competitor move and respond, the moment has passed. Your data accuracy approach cannot adapt fast enough to real-time competitive signals.',
          },
          aiAgents: {
            summary: 'AI competitive agents surface signals and draft responses aligned with data accuracy strategy.',
            detail: 'Competitive agents monitor market moves and suggest data accuracy-aligned responses. You approve and refine reactive content rather than spotting threats manually.',
          },
          aiAgentic: {
            summary: 'Autonomous competitive agents detect and draft responses in real time — data accuracy moves are countered instantly.',
            detail: 'Competitive agents monitor signals, draft responses, and deploy within your data accuracy guardrails. You approve high-stakes responses while routine reactions ship autonomously.',
          },
        },
        'content-governance': {
          preAI: {
            summary: 'Content governance is periodic manual auditing that cannot keep pace with your data accuracy standards.',
            detail: 'Live content drifts out of compliance between infrequent reviews. Your data accuracy requirements are only enforced when someone manually checks.',
          },
          aiAgents: {
            summary: 'AI governance agents continuously audit live content against data accuracy standards.',
            detail: 'Governance agents flag content drift, compliance gaps, and data accuracy issues in real time. You review flagged items rather than conducting manual audits.',
          },
          aiAgentic: {
            summary: 'Autonomous governance agents audit all live content continuously — data accuracy compliance is always current.',
            detail: 'Governance agents monitor every published piece against your data accuracy standards in real time. You evolve governance policies while the system enforces them perpetually.',
          },
        },
        'governance-gate': {
          preAI: {
            summary: 'Governance gates are calendar-driven checkpoints disconnected from your data accuracy rhythm.',
            detail: 'Governance reviews happen on a fixed schedule regardless of content velocity. Your data accuracy concerns may not surface until the next quarterly review.',
          },
          aiAgents: {
            summary: 'AI governance gates run continuous checks, surfacing data accuracy issues between formal reviews.',
            detail: 'Governance agents validate live content against your data accuracy criteria on an ongoing basis. You act on exception alerts rather than waiting for quarterly reviews.',
          },
          aiAgentic: {
            summary: 'Autonomous governance gates run continuously — data accuracy violations trigger immediate remediation.',
            detail: 'Governance agents validate live content against your data accuracy criteria continuously and auto-trigger refresh or retirement workflows. You set policies, not review schedules.',
          },
        },
        'journey-mapping': {
          preAI: {
            summary: 'Journey mapping is a manual exercise that rarely reflects your data accuracy reality.',
            detail: 'Customer journey maps are created in workshops and quickly go stale. Your data accuracy perspective is a snapshot, not a living view of how content performs at each stage.',
          },
          aiAgents: {
            summary: 'AI journey agents map content to lifecycle stages using data accuracy data from the CDP.',
            detail: 'Journey agents dynamically map content to customer stages based on your data accuracy framework. You validate the mapping rather than building it manually in workshops.',
          },
          aiAgentic: {
            summary: 'Autonomous journey agents maintain living maps using real-time data accuracy data — you shape the strategy.',
            detail: 'Journey agents dynamically map content to lifecycle stages using live data accuracy signals. You define journey frameworks while the system optimizes content placement continuously.',
          },
        },
        'sentiment-monitoring': {
          preAI: {
            summary: 'Sentiment monitoring is sporadic manual checking with no systematic link to data accuracy.',
            detail: 'You check brand sentiment reactively rather than proactively. Your data accuracy decisions are made without real-time audience feedback signals.',
          },
          aiAgents: {
            summary: 'AI sentiment agents track brand reception in real time, alerting you to data accuracy risks.',
            detail: 'Sentiment agents analyze audience reactions and flag data accuracy concerns before they escalate. You respond to alerts rather than manually checking platforms.',
          },
          aiAgentic: {
            summary: 'Autonomous sentiment agents monitor and respond to data accuracy signals around the clock — you govern escalation.',
            detail: 'Sentiment agents track audience reactions and trigger data accuracy responses automatically. You set escalation thresholds and review strategic implications of sentiment shifts.',
          },
        },
        'sales-enablement': {
          preAI: {
            summary: 'Sales enablement content is created ad hoc, disconnected from your data accuracy strategy.',
            detail: 'Sales teams request materials outside the content pipeline. Your data accuracy standards are not applied to battle cards, decks, and one-pagers created in isolation.',
          },
          aiAgents: {
            summary: 'AI agents generate sales materials from marketing content with data accuracy alignment.',
            detail: 'Sales enablement agents transform marketing assets into battle cards and decks following your data accuracy standards. You approve rather than creating each piece manually.',
          },
          aiAgentic: {
            summary: 'Autonomous enablement agents keep sales materials current with data accuracy alignment — you set the playbook.',
            detail: 'Enablement agents automatically update battle cards, decks, and case studies as your data accuracy data evolves. You define the sales narrative while the system produces materials at scale.',
          },
        },
        'influencer-brief': {
          preAI: {
            summary: 'Influencer briefs are manual documents with limited data accuracy guardrails.',
            detail: 'Creator briefs are written from scratch each time. Your data accuracy guidelines are inconsistently communicated to external partners and influencers.',
          },
          aiAgents: {
            summary: 'AI agents draft influencer briefs with data accuracy guardrails embedded automatically.',
            detail: 'Brief agents generate creator guidelines from your data accuracy requirements and past successful collaborations. You customize rather than writing each brief from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous brief agents generate creator guidelines with data accuracy guardrails — you approve partnerships.',
            detail: 'Brief agents produce personalized influencer guidelines using your data accuracy framework and creator history. You focus on relationship strategy while briefs ship autonomously.',
          },
        },
        'ugc-moderation': {
          preAI: {
            summary: 'UGC moderation is manual screening that cannot scale to protect data accuracy.',
            detail: 'User-generated content is reviewed one piece at a time. Your data accuracy standards cannot be consistently enforced across the volume of submissions.',
          },
          aiAgents: {
            summary: 'AI moderation agents screen UGC for brand safety and data accuracy compliance at scale.',
            detail: 'Moderation agents filter user-generated content against your data accuracy criteria. You review borderline cases rather than manually screening every submission.',
          },
          aiAgentic: {
            summary: 'Autonomous moderation agents screen all UGC for data accuracy compliance at scale — you govern edge cases.',
            detail: 'Moderation agents filter user-generated content using your data accuracy rules continuously. You update moderation policies and review borderline cases that the system escalates.',
          },
        },
        'content-scoring': {
          preAI: {
            summary: 'Content scoring is subjective prioritization that underweights your data accuracy criteria.',
            detail: 'Requests are prioritized by loudest voice or executive fiat. Your data accuracy scoring criteria are rarely part of the formal prioritization framework.',
          },
          aiAgents: {
            summary: 'AI scoring agents rank requests using data accuracy criteria alongside strategic priority.',
            detail: 'Scoring agents weight your data accuracy factors into the prioritization algorithm. You adjust rankings rather than scoring each request manually.',
          },
          aiAgentic: {
            summary: 'Autonomous scoring agents prioritize the pipeline using data accuracy criteria — you set strategic weights.',
            detail: 'Scoring agents rank and route content requests using your data accuracy priorities in real time. You define scoring criteria and review the queue rather than manually triaging.',
          },
        },
        'channel-orchestration': {
          preAI: {
            summary: 'Channel orchestration is manual coordination with no systematic data accuracy integration.',
            detail: 'Cross-channel timing is managed in spreadsheets and Slack. Your data accuracy requirements for sequencing and coordination are often overridden by ad hoc changes.',
          },
          aiAgents: {
            summary: 'AI orchestration agents sequence distribution with data accuracy rules for timing and cadence.',
            detail: 'Orchestration agents coordinate cross-channel timing based on your data accuracy requirements. You set rules and review the sequence rather than managing each channel individually.',
          },
          aiAgentic: {
            summary: 'Autonomous orchestration agents manage all channel timing with data accuracy logic — you set the playbook.',
            detail: 'Orchestration agents handle cross-channel sequencing, timing, and coordination autonomously using your data accuracy rules. You evolve the orchestration strategy while the system executes.',
          },
        },
      },
      keyInsight: 'The tension is acute: 42% of marketers still rely on manual spreadsheet attribution. The AI opportunity is not just speed — it\'s accuracy. A 19% average improvement in ROI is not about working faster; it\'s about understanding which channels and touchpoints truly drive conversion. The performance-review gate can restart the pipeline — that feedback loop makes this a learning system.',
    },
  },

  {
    id: 'content-strategist',
    title: 'Content Strategist',
    description: 'Drives the strategic inputs that ground every brief and agent decision.',
    tagline: 'Defines the strategy every brief follows.',
    iconName: 'Lightbulb',
    category: 'strategy',
    accentColor: '#6BAED6',
    ownedSteps: ['research-insights', 'competitive-response'],
    reviewedGates: [],
    relatedAgents: ['research-agent'],
    relatedInputs: ['content-strategy', 'audience-personas', 'analytics-data', 'competitor-library'],
    narrative: {
      nodeJourneys: {
        'research-insights': {
          preAI: {
            summary: 'You maintain the content strategy, define personas, and brief writers one at a time.',
            detail: 'Your frameworks live in documents that people reference inconsistently. Strategy quality depends on who remembers to check the deck.',
          },
          aiAgents: {
            summary: 'Your strategy documents become machine-readable inputs that agents reference on every task.',
            detail: 'Instead of briefing one writer, your personas and strategy guides feed every agent simultaneously. Consistency goes up because agents don\'t skip the brief.',
          },
          aiAgentic: {
            summary: 'Your strategy is the operating system — every agent decision traces back to your frameworks.',
            detail: 'One well-maintained strategy doc silently improves the output of every agent and every gate. The better your frameworks, the better the entire system performs.',
          },
        },
        'competitive-response': {
          preAI: {
            summary: 'You monitor competitors manually and decide when to create reactive content — usually days after the window closes.',
            detail: 'Competitive intelligence is ad hoc. By the time you spot a competitor move, brief a writer, and get through approvals, the moment has passed.',
          },
          aiAgents: {
            summary: 'A research agent surfaces competitive signals in real time — you decide which ones warrant a strategic response.',
            detail: 'Signals arrive pre-analyzed with context. You evaluate whether a competitor move deserves counter-messaging or whether silence is the better strategy.',
          },
          aiAgentic: {
            summary: 'Competitive signals auto-trigger response briefs within your strategic framework — you approve or kill, not create.',
            detail: 'The system generates draft response briefs for competitive moves that match your trigger criteria. You decide which responses to greenlight — the strategic filter no algorithm can replace.',
          },
        },
        'receive-request': {
          preAI: {
            summary: 'You plan incoming requests manually, sorting through emails and Slack messages for audience alignment.',
            detail: 'Requests arrive in inconsistent formats with no standard intake process. You spend hours triaging and clarifying scope before audience alignment can even begin.',
          },
          aiAgents: {
            summary: 'An AI intake agent structures requests and flags audience alignment implications before they reach your queue.',
            detail: 'Requests arrive pre-categorized with audience alignment signals highlighted. You validate and prioritize rather than manually parsing raw inputs.',
          },
          aiAgentic: {
            summary: 'Autonomous intake agents triage, validate, and route requests with audience alignment logic — you govern exceptions.',
            detail: 'Agentic intake handles end-to-end request processing with your audience alignment rules embedded. You set policies and review escalations while routine requests flow automatically.',
          },
        },
        'write-brief': {
          preAI: {
            summary: 'You wait for briefs written by hand, often lacking the audience alignment detail you need.',
            detail: 'Briefs arrive incomplete or misaligned with your audience alignment requirements. You spend cycles requesting revisions and clarifying expectations before work can proceed.',
          },
          aiAgents: {
            summary: 'AI drafts briefs with audience alignment requirements pre-populated from templates and past projects.',
            detail: 'Brief generation agents pull your audience alignment requirements into structured templates. You review and refine rather than starting from a blank page.',
          },
          aiAgentic: {
            summary: 'Autonomous agents generate complete briefs with audience alignment alignment built in — you approve strategy.',
            detail: 'Brief agents produce publication-ready briefs that embed your audience alignment requirements from historical patterns. You govern strategic direction rather than reviewing drafts.',
          },
        },
        'draft-content': {
          preAI: {
            summary: 'You review drafts created entirely by hand, checking each one for alignment with audience alignment.',
            detail: 'First drafts vary wildly in quality and audience alignment alignment. You often send content back for multiple revision cycles, creating bottlenecks in the pipeline.',
          },
          aiAgents: {
            summary: 'AI generates first drafts with audience alignment guidelines embedded, reducing your revision cycles.',
            detail: 'Drafting agents produce content aligned with your audience alignment standards from the start. You focus on strategic refinement rather than basic corrections.',
          },
          aiAgentic: {
            summary: 'Autonomous drafting agents produce content meeting audience alignment standards — you set creative direction.',
            detail: 'Drafting agents generate content that passes your audience alignment criteria automatically. You focus on strategic vision and creative differentiation rather than quality control.',
          },
        },
        'seo-optimization': {
          preAI: {
            summary: 'SEO optimization is manual and disconnected from your audience alignment priorities.',
            detail: 'Keyword research and meta optimization happen separately from your audience alignment workflow. You rarely see SEO data until after content is already in review.',
          },
          aiAgents: {
            summary: 'AI SEO tools optimize content while preserving your audience alignment priorities.',
            detail: 'SEO agents suggest keywords and meta improvements that align with your audience alignment goals. You approve optimizations rather than manually researching keywords.',
          },
          aiAgentic: {
            summary: 'Autonomous SEO agents optimize continuously within audience alignment boundaries — you define the strategy.',
            detail: 'SEO agents self-optimize content based on real-time search signals and your audience alignment guardrails. You set strategic keywords and constraints, not individual page optimizations.',
          },
        },
        'brand-compliance': {
          preAI: {
            summary: 'Brand checks are subjective and slow, creating delays in your audience alignment workflow.',
            detail: 'Brand reviewers interpret guidelines differently. Inconsistent enforcement of tone, terminology, and messaging means audience alignment is harder to maintain at scale.',
          },
          aiAgents: {
            summary: 'AI brand checkers flag violations and score audience alignment alignment before human review.',
            detail: 'Brand agents scan content against guidelines and highlight audience alignment issues. You make judgment calls on edge cases rather than catching basic violations.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents enforce compliance at scale with audience alignment rules — you update the rulebook.',
            detail: 'Brand agents apply and evolve compliance checks across all content automatically. Your audience alignment standards are codified as machine-enforceable rules that you govern and refine.',
          },
        },
        'final-edit': {
          preAI: {
            summary: 'Final edits depend entirely on editor availability, blocking your audience alignment timelines.',
            detail: 'A single editor bottleneck means content waits in queue. Your audience alignment deadlines slip because there is no way to parallelize the final polish step.',
          },
          aiAgents: {
            summary: 'AI editing assistants handle mechanical fixes, freeing your audience alignment focus for strategic polish.',
            detail: 'Editing agents catch grammar, style, and consistency issues automatically. Your audience alignment perspective is reserved for nuance and narrative quality.',
          },
          aiAgentic: {
            summary: 'Autonomous editing agents polish content to publication standard — your audience alignment bar is encoded as policy.',
            detail: 'Editing agents handle all mechanical and stylistic refinement autonomously. Your audience alignment standards are embedded as editorial policies that improve with each iteration.',
          },
        },
        'schedule-publish': {
          preAI: {
            summary: 'Publishing is a manual CMS process with no connection to your audience alignment planning.',
            detail: 'Each piece requires manual scheduling, metadata entry, and CMS configuration. Your audience alignment goals are disconnected from the publish timeline.',
          },
          aiAgents: {
            summary: 'AI scheduling agents suggest optimal publish timing based on audience alignment data.',
            detail: 'Publishing agents recommend times and configurations informed by your audience alignment priorities. You approve the schedule rather than manually configuring CMS settings.',
          },
          aiAgentic: {
            summary: 'Autonomous publishing agents manage scheduling end-to-end using audience alignment optimization logic.',
            detail: 'Publishing agents handle CMS configuration, timing optimization, and deployment autonomously within your audience alignment constraints. You set publishing policies, not individual schedules.',
          },
        },
        'distribute': {
          preAI: {
            summary: 'Content distribution is manual channel-by-channel, with limited visibility into audience alignment.',
            detail: 'Each channel requires separate formatting, scheduling, and posting. There is no unified view of how distribution supports your audience alignment objectives.',
          },
          aiAgents: {
            summary: 'AI distribution agents adapt content per channel with audience alignment rules built in.',
            detail: 'Distribution agents format and deploy content across channels following your audience alignment guidelines. You monitor and adjust rather than manually posting to each platform.',
          },
          aiAgentic: {
            summary: 'Autonomous distribution agents manage all channels with audience alignment rules — you govern the playbook.',
            detail: 'Distribution agents deploy, adapt, and optimize content across every channel following your audience alignment playbook. You evolve distribution strategy, not execute individual channel posts.',
          },
        },
        'track-performance': {
          preAI: {
            summary: 'Performance tracking is fragmented across tools, making audience alignment assessment difficult.',
            detail: 'You pull data from analytics dashboards, social platforms, and CRM separately. Building a complete picture for audience alignment requires manual data stitching.',
          },
          aiAgents: {
            summary: 'AI dashboards surface audience alignment metrics in real time without manual data pulling.',
            detail: 'Performance agents aggregate data and highlight the audience alignment signals that matter to you. You analyze trends rather than building dashboards from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous tracking agents monitor audience alignment metrics continuously and trigger alerts and actions.',
            detail: 'Performance agents stream audience alignment data and automatically trigger optimization workflows when thresholds are breached. You define KPIs and review strategic implications.',
          },
        },
        'generate-report': {
          preAI: {
            summary: 'Reports are built manually in spreadsheets, often missing the audience alignment metrics you need.',
            detail: 'Report creation takes hours of data gathering and formatting. The metrics that matter for audience alignment are often buried or missing entirely from standard templates.',
          },
          aiAgents: {
            summary: 'AI generates reports with audience alignment metrics pre-formatted and insights highlighted.',
            detail: 'Reporting agents compile your audience alignment data into structured templates with automated analysis. You add strategic narrative rather than wrangling data.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce audience alignment reports on demand with strategic recommendations.',
            detail: 'Reporting agents generate audience alignment analyses with actionable recommendations automatically. You consume insights and set strategic direction rather than producing reports.',
          },
        },
        'optimize': {
          preAI: {
            summary: 'Content optimization is reactive and slow, with limited connection to audience alignment data.',
            detail: 'Optimization decisions rely on gut feel and delayed data. Your audience alignment insights rarely feed back into content updates in a timely way.',
          },
          aiAgents: {
            summary: 'AI recommends optimizations based on audience alignment signals and historical performance.',
            detail: 'Optimization agents suggest specific changes tied to your audience alignment metrics. You approve and prioritize recommendations rather than diagnosing issues manually.',
          },
          aiAgentic: {
            summary: 'Autonomous optimization agents improve content continuously using audience alignment signals — you set boundaries.',
            detail: 'Optimization agents test, iterate, and improve content based on audience alignment data within your guardrails. You define acceptable ranges and review significant changes.',
          },
        },
        'brief-approval': {
          preAI: {
            summary: 'Brief approvals are bottlenecked by manual review cycles that delay your audience alignment work.',
            detail: 'You wait for briefs to pass through approval chains before your audience alignment tasks can begin. Unclear approval criteria mean briefs bounce back and forth repeatedly.',
          },
          aiAgents: {
            summary: 'AI pre-screens briefs for audience alignment alignment, routing only exceptions to you.',
            detail: 'Approval agents check briefs against your audience alignment criteria and flag gaps. You review flagged items rather than reading every brief end to end.',
          },
          aiAgentic: {
            summary: 'Autonomous approval agents clear standard briefs and escalate only audience alignment exceptions to you.',
            detail: 'Approval agents validate briefs against your audience alignment criteria and auto-approve routine requests. You handle strategic exceptions and edge cases only.',
          },
        },
        'quality-check': {
          preAI: {
            summary: 'Quality checks are inconsistent manual reviews with no standard audience alignment criteria.',
            detail: 'Quality varies by reviewer and day. There is no automated baseline for readability, accuracy, or audience alignment alignment, leading to uneven content standards.',
          },
          aiAgents: {
            summary: 'AI quality gates enforce baseline standards, letting you focus on audience alignment nuance.',
            detail: 'Quality agents score readability, accuracy, and SEO automatically. Your audience alignment evaluation focuses on strategic alignment rather than mechanical checks.',
          },
          aiAgentic: {
            summary: 'Autonomous quality agents enforce standards continuously — audience alignment baselines are self-maintaining.',
            detail: 'Quality agents apply and evolve quality standards based on your audience alignment benchmarks. You set quality policies that the system enforces and improves over time.',
          },
        },
        'brand-review': {
          preAI: {
            summary: 'Brand reviews are subjective gates that slow your audience alignment pipeline.',
            detail: 'Reviewers apply brand guidelines inconsistently. What passes one review fails the next, creating unpredictable delays in your audience alignment workflow.',
          },
          aiAgents: {
            summary: 'AI brand agents pre-score content, surfacing audience alignment issues before your review.',
            detail: 'Brand review agents apply guidelines consistently and flag audience alignment deviations. You handle exceptions and judgment calls rather than full content scans.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents review all content at scale — you govern audience alignment policy evolution.',
            detail: 'Brand review agents handle all compliance checking autonomously with your audience alignment rules. You update brand guidelines and review the rare edge case that requires human judgment.',
          },
        },
        'stakeholder-signoff': {
          preAI: {
            summary: 'Stakeholder sign-off is a bottleneck where executives delay your audience alignment timelines.',
            detail: 'Senior approvers are busy and unresponsive. Your audience alignment work stalls while waiting for sign-off, and last-minute changes create downstream chaos.',
          },
          aiAgents: {
            summary: 'AI prepares sign-off packages with audience alignment summaries for faster executive approval.',
            detail: 'Sign-off agents compile context, changes, and audience alignment impact assessments for approvers. Executives review structured summaries rather than raw content.',
          },
          aiAgentic: {
            summary: 'Autonomous agents handle routine sign-offs within audience alignment parameters — executives approve strategy only.',
            detail: 'Sign-off agents clear content that meets all audience alignment criteria automatically. Executives only review strategic pivots or high-risk content that breaches defined thresholds.',
          },
        },
        'performance-review': {
          preAI: {
            summary: 'Performance reviews are infrequent manual assessments that underserve your audience alignment needs.',
            detail: 'Reviews happen quarterly at best, using outdated data. Your audience alignment perspective is often missing from the evaluation criteria entirely.',
          },
          aiAgents: {
            summary: 'AI evaluates content against KPIs and highlights audience alignment trends for your review.',
            detail: 'Review agents surface performance data with audience alignment context pre-attached. You make optimize/archive decisions based on structured analysis rather than raw metrics.',
          },
          aiAgentic: {
            summary: 'Autonomous review agents evaluate and act on performance with audience alignment logic — you set the framework.',
            detail: 'Review agents continuously assess content against your audience alignment KPIs and trigger optimize/refresh/archive workflows automatically. You define the evaluation framework.',
          },
        },
        'social-listening': {
          preAI: {
            summary: 'Social listening is ad hoc keyword monitoring with no systematic link to audience alignment.',
            detail: 'You check social platforms manually for relevant conversations. Insights rarely reach your audience alignment workflow before they become stale or irrelevant.',
          },
          aiAgents: {
            summary: 'AI monitoring tools surface trending topics and sentiment relevant to audience alignment in real time.',
            detail: 'Listening agents track conversations and flag audience alignment signals across platforms. You act on curated insights rather than monitoring feeds manually.',
          },
          aiAgentic: {
            summary: 'Autonomous listening agents track and respond to audience alignment signals across all platforms in real time.',
            detail: 'Listening agents monitor social channels and proactively surface audience alignment opportunities and risks. You set monitoring priorities and review strategic findings.',
          },
        },
        'visual-asset-creation': {
          preAI: {
            summary: 'Visual asset creation is a slow design queue disconnected from your audience alignment needs.',
            detail: 'Design requests go into a backlog with unclear priorities. Your audience alignment requirements are often lost in translation between brief and final asset.',
          },
          aiAgents: {
            summary: 'AI design tools generate asset options aligned with audience alignment requirements.',
            detail: 'Design agents produce visual variants following your audience alignment guidelines. You select and refine from AI-generated options rather than directing from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous design agents produce visual assets within audience alignment guidelines — you set creative direction.',
            detail: 'Design agents generate publication-ready visuals following your audience alignment standards. You define the creative vision and approve hero assets while routine visuals ship autonomously.',
          },
        },
        'legal-review': {
          preAI: {
            summary: 'Legal review is an opaque process that creates unpredictable delays in your audience alignment work.',
            detail: 'Legal feedback arrives late with minimal context. You cannot predict how long review will take, making audience alignment planning unreliable.',
          },
          aiAgents: {
            summary: 'AI legal screening flags compliance risks early, reducing audience alignment surprises downstream.',
            detail: 'Legal agents pre-scan content for regulatory issues and audience alignment risks. You get early warnings rather than discovering problems at the sign-off stage.',
          },
          aiAgentic: {
            summary: 'Autonomous legal agents clear routine content and escalate only true audience alignment risks to human counsel.',
            detail: 'Legal agents scan and clear standard content autonomously using your audience alignment rule framework. Human lawyers handle novel risk scenarios and precedent-setting decisions only.',
          },
        },
        'accessibility-check': {
          preAI: {
            summary: 'Accessibility checking is a manual afterthought, rarely connected to your audience alignment process.',
            detail: 'WCAG compliance and inclusive language reviews happen late in the pipeline. Your audience alignment work is already done when accessibility issues force rework.',
          },
          aiAgents: {
            summary: 'AI accessibility tools catch WCAG violations automatically, protecting your audience alignment standards.',
            detail: 'Accessibility agents scan for inclusive language and alt-text compliance. Your audience alignment requirements benefit from automated baseline checks before human review.',
          },
          aiAgentic: {
            summary: 'Autonomous accessibility agents enforce WCAG and inclusive standards — audience alignment is guaranteed by default.',
            detail: 'Accessibility agents ensure all content meets compliance standards before publication. Your audience alignment benefits from guaranteed accessibility without manual checking overhead.',
          },
        },
        'localize-content': {
          preAI: {
            summary: 'Localization is a slow, manual translation process that delays your audience alignment for global markets.',
            detail: 'Each market requires separate translation, cultural review, and compliance checking. Your audience alignment suffers because localized versions lag weeks behind the original.',
          },
          aiAgents: {
            summary: 'AI translation agents accelerate localization while respecting audience alignment requirements.',
            detail: 'Localization agents produce initial translations with audience alignment context preserved. You review for cultural nuance rather than translating from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous localization agents adapt content for all markets simultaneously — your audience alignment scales globally.',
            detail: 'Localization agents handle translation, cultural adaptation, and regional compliance autonomously. Your audience alignment is maintained across markets without manual per-locale effort.',
          },
        },
        'ab-variant-creation': {
          preAI: {
            summary: 'A/B variants are created manually with limited connection to your audience alignment hypotheses.',
            detail: 'Test variants rely on guesswork rather than data. Your audience alignment insights rarely inform variant design, reducing the value of testing efforts.',
          },
          aiAgents: {
            summary: 'AI generates test variants informed by audience alignment data and historical performance.',
            detail: 'Variant agents create headlines, CTAs, and imagery options based on your audience alignment hypotheses. You select winning approaches rather than brainstorming from zero.',
          },
          aiAgentic: {
            summary: 'Autonomous variant agents design, deploy, and learn from tests using audience alignment hypotheses — you set the agenda.',
            detail: 'Variant agents run continuous testing experiments informed by your audience alignment objectives. You define what to test and review strategic learnings while the system iterates autonomously.',
          },
        },
        'content-repurposing': {
          preAI: {
            summary: 'Content repurposing is manual reformatting, disconnected from your audience alignment goals.',
            detail: 'Each derivative asset is created from scratch. Your audience alignment requirements are not systematically applied when repurposing content across formats.',
          },
          aiAgents: {
            summary: 'AI repurposing agents derive secondary assets with audience alignment consistency built in.',
            detail: 'Repurposing agents transform primary content into channel-specific formats following your audience alignment guidelines. You approve derivatives rather than recreating each manually.',
          },
          aiAgentic: {
            summary: 'Autonomous repurposing agents derive all secondary assets automatically within audience alignment guidelines.',
            detail: 'Repurposing agents transform primary content into every derivative format following your audience alignment rules. You set format strategy while the system handles production at scale.',
          },
        },
        'archive-tag': {
          preAI: {
            summary: 'Content archiving is inconsistent, making audience alignment-related retrieval nearly impossible.',
            detail: 'Tagging and taxonomy are applied inconsistently or not at all. Finding past content relevant to audience alignment requires searching through unstructured repositories.',
          },
          aiAgents: {
            summary: 'AI tagging agents classify content automatically, making audience alignment retrieval faster.',
            detail: 'Archive agents apply taxonomy and metadata based on your audience alignment categories. You validate classifications rather than manually tagging every asset.',
          },
          aiAgentic: {
            summary: 'Autonomous archive agents maintain perfect taxonomy — audience alignment retrieval is instant and reliable.',
            detail: 'Archive agents classify, tag, and organize all content using your audience alignment taxonomy automatically. You evolve the taxonomy structure while the system maintains it flawlessly.',
          },
        },
        'legal-compliance-gate': {
          preAI: {
            summary: 'Legal compliance gates create unpredictable holds that delay your audience alignment deadlines.',
            detail: 'Legal sign-off timing is opaque and variable. Your audience alignment timelines are at the mercy of legal review queues with no visibility into status.',
          },
          aiAgents: {
            summary: 'AI pre-screening reduces legal gate delays by resolving routine audience alignment checks automatically.',
            detail: 'Compliance agents handle standard checks and only escalate audience alignment edge cases to human lawyers. Your timelines are more predictable because routine items clear faster.',
          },
          aiAgentic: {
            summary: 'Autonomous compliance gates clear routine content instantly — only novel audience alignment risks reach human lawyers.',
            detail: 'Compliance agents handle standard legal checks autonomously using your audience alignment risk framework. Human review is reserved for unprecedented scenarios and policy updates.',
          },
        },
        'localization-quality-gate': {
          preAI: {
            summary: 'Localization quality gates are inconsistent, creating audience alignment risks in global markets.',
            detail: 'Quality checks for localized content vary by market and reviewer. Your audience alignment standards are unevenly applied across regions and languages.',
          },
          aiAgents: {
            summary: 'AI quality checks catch translation errors before they affect your audience alignment outcomes.',
            detail: 'Localization QA agents verify accuracy and cultural fit automatically. Your audience alignment standards are applied consistently across all target markets.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents ensure localization quality across all markets — audience alignment is guaranteed globally.',
            detail: 'Localization QA agents validate every market adaptation autonomously against your audience alignment standards. You set quality criteria while the system enforces them at scale.',
          },
        },
        'segment-mapping': {
          preAI: {
            summary: 'Segment mapping is manual spreadsheet work with limited visibility into audience alignment impact.',
            detail: 'Mapping content variants to audience segments is done in spreadsheets. Your audience alignment data is disconnected from the personalization logic.',
          },
          aiAgents: {
            summary: 'AI agents map variants to segments using audience alignment data from the CDP.',
            detail: 'Segment agents recommend variant-audience matches based on your audience alignment signals. You review the mapping rather than building it manually in spreadsheets.',
          },
          aiAgentic: {
            summary: 'Autonomous segment agents map and optimize variant-audience matches using live audience alignment signals.',
            detail: 'Segment agents continuously refine variant-audience mappings based on real-time audience alignment data. You define segmentation strategy while the system executes and optimizes automatically.',
          },
        },
        'dynamic-assembly': {
          preAI: {
            summary: 'Dynamic content assembly is rigid and template-bound, limiting your audience alignment options.',
            detail: 'Personalized experiences require engineering support for each variant. Your audience alignment vision is constrained by inflexible assembly templates.',
          },
          aiAgents: {
            summary: 'AI assembly agents construct personalized experiences informed by audience alignment rules.',
            detail: 'Assembly agents combine content components per segment following your audience alignment logic. You define rules and review outputs rather than manually configuring each variant.',
          },
          aiAgentic: {
            summary: 'Autonomous assembly agents construct personalized experiences in real time — audience alignment logic is self-optimizing.',
            detail: 'Assembly agents build dynamic experiences per segment using your audience alignment rules and real-time behavioral signals. You govern personalization policies, not individual assembly configurations.',
          },
        },
        'personalization-qa': {
          preAI: {
            summary: 'Personalization QA is manual spot-checking that misses audience alignment gaps.',
            detail: 'Testing every segment-variant combination is impossible manually. Your audience alignment concerns are only caught when users report issues post-launch.',
          },
          aiAgents: {
            summary: 'AI QA agents validate personalization coverage and flag audience alignment gaps before launch.',
            detail: 'QA agents test every segment-variant combination against your audience alignment requirements. You review exception reports rather than manually spot-checking combinations.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents validate every personalization scenario — audience alignment gaps are caught before launch.',
            detail: 'Personalization QA agents test all segment-variant combinations against your audience alignment requirements automatically. You set acceptance criteria while the system validates at scale.',
          },
        },
        'campaign-planning': {
          preAI: {
            summary: 'Campaign planning is a manual coordination effort with fragmented audience alignment inputs.',
            detail: 'Campaign plans are built in decks and spreadsheets with incomplete data. Your audience alignment perspective is often incorporated too late in the planning cycle.',
          },
          aiAgents: {
            summary: 'AI planning agents draft campaign frameworks with audience alignment data pre-integrated.',
            detail: 'Planning agents pull audience, budget, and performance data into campaign templates. Your audience alignment priorities shape the plan from the start rather than being retrofitted.',
          },
          aiAgentic: {
            summary: 'Autonomous planning agents generate campaign frameworks using audience alignment intelligence — you set objectives.',
            detail: 'Planning agents produce data-driven campaign plans with your audience alignment priorities embedded. You define strategic goals while the system optimizes tactics and resource allocation.',
          },
        },
        'consent-check': {
          preAI: {
            summary: 'Consent checking is a manual compliance step that adds friction to your audience alignment process.',
            detail: 'Verifying GDPR/CCPA consent for targeting requires manual cross-referencing. Your audience alignment work is delayed while compliance status is manually confirmed.',
          },
          aiAgents: {
            summary: 'AI consent agents verify targeting compliance automatically, reducing audience alignment friction.',
            detail: 'Consent agents cross-reference CDP signals against GDPR/CCPA rules for your audience alignment needs. You handle exceptions rather than manually verifying every segment.',
          },
          aiAgentic: {
            summary: 'Autonomous consent agents enforce privacy compliance at scale — audience alignment is guaranteed by architecture.',
            detail: 'Consent agents verify targeting compliance in real time across all segments using your audience alignment framework. You set privacy policies while the system enforces them automatically.',
          },
        },
        'paid-creative-production': {
          preAI: {
            summary: 'Paid creative production runs separately from organic, fragmenting your audience alignment oversight.',
            detail: 'Ad creative and organic content are produced in silos. Your audience alignment perspective is applied inconsistently between paid and organic channels.',
          },
          aiAgents: {
            summary: 'AI production agents generate paid variants from organic content with audience alignment consistency.',
            detail: 'Paid creative agents adapt organic content for ad platforms following your audience alignment guidelines. You approve and fine-tune rather than producing ad creative from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous production agents create paid variants at scale within audience alignment guardrails — you set the strategy.',
            detail: 'Paid creative agents generate ad variants from organic content following your audience alignment guidelines. You define creative strategy while the system produces and optimizes at scale.',
          },
        },
        'attribution-modeling': {
          preAI: {
            summary: 'Attribution modeling is manual and unreliable, undermining your audience alignment reporting.',
            detail: 'Last-click attribution dominates despite its flaws. Your audience alignment decisions lack the multi-touch perspective needed for accurate performance assessment.',
          },
          aiAgents: {
            summary: 'AI attribution models surface multi-touch insights relevant to your audience alignment priorities.',
            detail: 'Attribution agents calculate content ROI across channels using your audience alignment weightings. You interpret strategic implications rather than building models manually.',
          },
          aiAgentic: {
            summary: 'Autonomous attribution agents run multi-touch models continuously — audience alignment insights update in real time.',
            detail: 'Attribution agents calculate content ROI across all channels using your audience alignment framework. You interpret strategic implications while the system handles modeling complexity.',
          },
        },
        'executive-reporting': {
          preAI: {
            summary: 'Executive reports are manually assembled, often missing the audience alignment narrative you need.',
            detail: 'Building executive dashboards takes hours of data wrangling. The audience alignment story you want to tell is lost in generic reporting templates.',
          },
          aiAgents: {
            summary: 'AI builds executive dashboards with audience alignment narratives pre-drafted for leadership.',
            detail: 'Reporting agents synthesize data into executive formats with your audience alignment story embedded. You refine the narrative rather than assembling data from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce executive dashboards with audience alignment narratives — you add strategic context.',
            detail: 'Executive reporting agents synthesize all data into leadership-ready formats with your audience alignment story embedded. You provide strategic commentary on auto-generated insights.',
          },
        },
        'content-governance': {
          preAI: {
            summary: 'Content governance is periodic manual auditing that cannot keep pace with your audience alignment standards.',
            detail: 'Live content drifts out of compliance between infrequent reviews. Your audience alignment requirements are only enforced when someone manually checks.',
          },
          aiAgents: {
            summary: 'AI governance agents continuously audit live content against audience alignment standards.',
            detail: 'Governance agents flag content drift, compliance gaps, and audience alignment issues in real time. You review flagged items rather than conducting manual audits.',
          },
          aiAgentic: {
            summary: 'Autonomous governance agents audit all live content continuously — audience alignment compliance is always current.',
            detail: 'Governance agents monitor every published piece against your audience alignment standards in real time. You evolve governance policies while the system enforces them perpetually.',
          },
        },
        'governance-gate': {
          preAI: {
            summary: 'Governance gates are calendar-driven checkpoints disconnected from your audience alignment rhythm.',
            detail: 'Governance reviews happen on a fixed schedule regardless of content velocity. Your audience alignment concerns may not surface until the next quarterly review.',
          },
          aiAgents: {
            summary: 'AI governance gates run continuous checks, surfacing audience alignment issues between formal reviews.',
            detail: 'Governance agents validate live content against your audience alignment criteria on an ongoing basis. You act on exception alerts rather than waiting for quarterly reviews.',
          },
          aiAgentic: {
            summary: 'Autonomous governance gates run continuously — audience alignment violations trigger immediate remediation.',
            detail: 'Governance agents validate live content against your audience alignment criteria continuously and auto-trigger refresh or retirement workflows. You set policies, not review schedules.',
          },
        },
        'journey-mapping': {
          preAI: {
            summary: 'Journey mapping is a manual exercise that rarely reflects your audience alignment reality.',
            detail: 'Customer journey maps are created in workshops and quickly go stale. Your audience alignment perspective is a snapshot, not a living view of how content performs at each stage.',
          },
          aiAgents: {
            summary: 'AI journey agents map content to lifecycle stages using audience alignment data from the CDP.',
            detail: 'Journey agents dynamically map content to customer stages based on your audience alignment framework. You validate the mapping rather than building it manually in workshops.',
          },
          aiAgentic: {
            summary: 'Autonomous journey agents maintain living maps using real-time audience alignment data — you shape the strategy.',
            detail: 'Journey agents dynamically map content to lifecycle stages using live audience alignment signals. You define journey frameworks while the system optimizes content placement continuously.',
          },
        },
        'sentiment-monitoring': {
          preAI: {
            summary: 'Sentiment monitoring is sporadic manual checking with no systematic link to audience alignment.',
            detail: 'You check brand sentiment reactively rather than proactively. Your audience alignment decisions are made without real-time audience feedback signals.',
          },
          aiAgents: {
            summary: 'AI sentiment agents track brand reception in real time, alerting you to audience alignment risks.',
            detail: 'Sentiment agents analyze audience reactions and flag audience alignment concerns before they escalate. You respond to alerts rather than manually checking platforms.',
          },
          aiAgentic: {
            summary: 'Autonomous sentiment agents monitor and respond to audience alignment signals around the clock — you govern escalation.',
            detail: 'Sentiment agents track audience reactions and trigger audience alignment responses automatically. You set escalation thresholds and review strategic implications of sentiment shifts.',
          },
        },
        'sales-enablement': {
          preAI: {
            summary: 'Sales enablement content is created ad hoc, disconnected from your audience alignment strategy.',
            detail: 'Sales teams request materials outside the content pipeline. Your audience alignment standards are not applied to battle cards, decks, and one-pagers created in isolation.',
          },
          aiAgents: {
            summary: 'AI agents generate sales materials from marketing content with audience alignment alignment.',
            detail: 'Sales enablement agents transform marketing assets into battle cards and decks following your audience alignment standards. You approve rather than creating each piece manually.',
          },
          aiAgentic: {
            summary: 'Autonomous enablement agents keep sales materials current with audience alignment alignment — you set the playbook.',
            detail: 'Enablement agents automatically update battle cards, decks, and case studies as your audience alignment data evolves. You define the sales narrative while the system produces materials at scale.',
          },
        },
        'influencer-brief': {
          preAI: {
            summary: 'Influencer briefs are manual documents with limited audience alignment guardrails.',
            detail: 'Creator briefs are written from scratch each time. Your audience alignment guidelines are inconsistently communicated to external partners and influencers.',
          },
          aiAgents: {
            summary: 'AI agents draft influencer briefs with audience alignment guardrails embedded automatically.',
            detail: 'Brief agents generate creator guidelines from your audience alignment requirements and past successful collaborations. You customize rather than writing each brief from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous brief agents generate creator guidelines with audience alignment guardrails — you approve partnerships.',
            detail: 'Brief agents produce personalized influencer guidelines using your audience alignment framework and creator history. You focus on relationship strategy while briefs ship autonomously.',
          },
        },
        'ugc-moderation': {
          preAI: {
            summary: 'UGC moderation is manual screening that cannot scale to protect audience alignment.',
            detail: 'User-generated content is reviewed one piece at a time. Your audience alignment standards cannot be consistently enforced across the volume of submissions.',
          },
          aiAgents: {
            summary: 'AI moderation agents screen UGC for brand safety and audience alignment compliance at scale.',
            detail: 'Moderation agents filter user-generated content against your audience alignment criteria. You review borderline cases rather than manually screening every submission.',
          },
          aiAgentic: {
            summary: 'Autonomous moderation agents screen all UGC for audience alignment compliance at scale — you govern edge cases.',
            detail: 'Moderation agents filter user-generated content using your audience alignment rules continuously. You update moderation policies and review borderline cases that the system escalates.',
          },
        },
        'content-scoring': {
          preAI: {
            summary: 'Content scoring is subjective prioritization that underweights your audience alignment criteria.',
            detail: 'Requests are prioritized by loudest voice or executive fiat. Your audience alignment scoring criteria are rarely part of the formal prioritization framework.',
          },
          aiAgents: {
            summary: 'AI scoring agents rank requests using audience alignment criteria alongside strategic priority.',
            detail: 'Scoring agents weight your audience alignment factors into the prioritization algorithm. You adjust rankings rather than scoring each request manually.',
          },
          aiAgentic: {
            summary: 'Autonomous scoring agents prioritize the pipeline using audience alignment criteria — you set strategic weights.',
            detail: 'Scoring agents rank and route content requests using your audience alignment priorities in real time. You define scoring criteria and review the queue rather than manually triaging.',
          },
        },
        'channel-orchestration': {
          preAI: {
            summary: 'Channel orchestration is manual coordination with no systematic audience alignment integration.',
            detail: 'Cross-channel timing is managed in spreadsheets and Slack. Your audience alignment requirements for sequencing and coordination are often overridden by ad hoc changes.',
          },
          aiAgents: {
            summary: 'AI orchestration agents sequence distribution with audience alignment rules for timing and cadence.',
            detail: 'Orchestration agents coordinate cross-channel timing based on your audience alignment requirements. You set rules and review the sequence rather than managing each channel individually.',
          },
          aiAgentic: {
            summary: 'Autonomous orchestration agents manage all channel timing with audience alignment logic — you set the playbook.',
            detail: 'Orchestration agents handle cross-channel sequencing, timing, and coordination autonomously using your audience alignment rules. You evolve the orchestration strategy while the system executes.',
          },
        },
      },
      keyInsight: 'You don\'t own a gate, but your influence is everywhere. Strategy quality is the highest-leverage input in the graph.',
    },
  },
  {
    id: 'marketing-ops',
    title: 'Marketing Ops',
    description: 'Owns the operational backbone: scheduling, distribution, and the optimization feedback loop.',
    tagline: 'Connects strategy to execution.',
    iconName: 'Cog',
    category: 'operations',
    accentColor: '#C9A04E',
    ownedSteps: ['schedule-publish', 'distribute', 'optimize', 'channel-orchestration', 'dynamic-assembly'],
    reviewedGates: ['performance-review'],
    relatedAgents: ['performance-agent', 'personalization-agent', 'publishing-ops-agent'],
    relatedInputs: ['analytics-data', 'content-strategy', 'orchestration-rules', 'media-plan', 'channel-benchmarks', 'cdp-profiles', 'asset-library'],
    narrative: {
      nodeJourneys: {
        'schedule-publish': {
          preAI: {
            summary: 'You manage the publication calendar, coordinating timing and channel-specific requirements.',
            detail: 'Most of the work is operational — scheduling posts, updating spreadsheets, chasing approvals, and reconciling channel-specific formats.',
          },
          aiAgents: {
            summary: 'Scheduling agents handle calendar coordination and channel formatting based on your rules.',
            detail: 'You stop clicking buttons and start writing the rules agents follow. Scheduling becomes configuration rather than manual work.',
          },
          aiAgentic: {
            summary: 'Publication scheduling runs on your orchestration rules — content ships when conditions align.',
            detail: 'The system handles timing optimization, format conversion, and delivery sequencing. You update the rules when business context changes.',
          },
        },
        'distribute': {
          preAI: {
            summary: 'You coordinate multi-channel distribution, ensuring each asset reaches the right platform in the right format.',
            detail: 'Channel-specific formatting is tedious and error-prone. A blog post, email snippet, and social card each require manual adaptation.',
          },
          aiAgents: {
            summary: 'Distribution agents handle channel-specific formatting and delivery at scale.',
            detail: 'You define distribution rules; agents execute. Multi-channel launches that took a team now take a configuration change.',
          },
          aiAgentic: {
            summary: 'Distribution is a system operation — content flows across channels automatically based on your orchestration rules.',
            detail: 'Agents handle execution at a speed no manual process matches. You adjust parameters when performance data suggests a channel mix change.',
          },
        },
        'optimize': {
          preAI: {
            summary: 'You run optimization cycles manually — pulling data, identifying underperformers, and coordinating fixes.',
            detail: 'Optimization competes with day-to-day operations for your time. Many improvement opportunities expire before you can act on them.',
          },
          aiAgents: {
            summary: 'A performance agent surfaces optimization opportunities with recommended actions.',
            detail: 'You decide which optimizations are worth executing rather than hunting for them. Speed to optimization improves because the bottleneck moves from discovery to decision.',
          },
          aiAgentic: {
            summary: 'Optimization runs continuously within your guardrails — agents adjust targeting, refresh copy, and reallocate budget.',
            detail: 'You design the operational system rather than running it. When performance drifts, you adjust parameters — agents handle execution.',
          },
        },
        'channel-orchestration': {
          preAI: {
            summary: 'You coordinate how content moves across channels, managing dependencies and timing between platforms.',
            detail: 'Orchestration logic lives in your head and in scattered docs. Handoffs between channels depend on your personal availability.',
          },
          aiAgents: {
            summary: 'Orchestration rules you write determine how agents coordinate across channels.',
            detail: 'Dependencies between channels are codified. Agents follow your playbooks rather than waiting for your coordination.',
          },
          aiAgentic: {
            summary: 'Channel orchestration is a system capability — your rules govern multi-channel coordination at pipeline speed.',
            detail: 'Orchestration that required manual coordination now runs automatically. You maintain and evolve the rules as new channels emerge.',
          },
        },
        'dynamic-assembly': {
          preAI: {
            summary: 'You manually assemble each content experience — selecting the right hero image, headline, and CTA for each segment.',
            detail: 'Assembly is a bottleneck because every segment combination requires a manual build. Personalization is limited to what your team can physically produce.',
          },
          aiAgents: {
            summary: 'A personalization agent assembles segment-specific content experiences from your variant library and rules.',
            detail: 'Assembly scales because agents handle the combinatorics. You define which components are interchangeable and set the rules for how they combine.',
          },
          aiAgentic: {
            summary: 'Content experiences assemble dynamically at delivery time — every segment gets a tailored combination without manual production.',
            detail: 'The system constructs experiences per segment in real time using your rules, CDP signals, and the asset library. You maintain the assembly logic and troubleshoot when combinations produce unexpected results.',
          },
        },
        'performance-review': {
          preAI: {
            summary: 'You participate in performance reviews, providing operational context on what worked and what didn\'t.',
            detail: 'Your perspective bridges execution and strategy — you know which operational constraints affected outcomes.',
          },
          aiAgents: {
            summary: 'The agent pre-classifies performance data by operational factors — you add the context only ops can provide.',
            detail: 'Data arrives organized by your categories. You explain why certain channels underperformed due to operational constraints, not content quality.',
          },
          aiAgentic: {
            summary: 'Performance review feeds automatically into your orchestration rules — creating a continuous improvement loop.',
            detail: 'Knowing when to iterate on existing content versus restart the pipeline requires system-level awareness that agents don\'t have. That judgment is yours.',
          },
        },
        'receive-request': {
          preAI: {
            summary: 'You automate incoming requests manually, sorting through emails and Slack messages for workflow automation.',
            detail: 'Requests arrive in inconsistent formats with no standard intake process. You spend hours triaging and clarifying scope before workflow automation can even begin.',
          },
          aiAgents: {
            summary: 'An AI intake agent structures requests and flags workflow automation implications before they reach your queue.',
            detail: 'Requests arrive pre-categorized with workflow automation signals highlighted. You validate and prioritize rather than manually parsing raw inputs.',
          },
          aiAgentic: {
            summary: 'Autonomous intake agents triage, validate, and route requests with workflow automation logic — you govern exceptions.',
            detail: 'Agentic intake handles end-to-end request processing with your workflow automation rules embedded. You set policies and review escalations while routine requests flow automatically.',
          },
        },
        'research-insights': {
          preAI: {
            summary: 'You gather audience and market research manually, compiling data from multiple sources for workflow automation.',
            detail: 'Research is scattered across tools, reports, and tribal knowledge. Building a complete picture for workflow automation takes days and the data is often stale by the time you use it.',
          },
          aiAgents: {
            summary: 'AI research tools surface audience and market data relevant to your workflow automation needs automatically.',
            detail: 'Research agents pull relevant data from multiple sources and present workflow automation insights in a structured format. You curate and interpret rather than gather.',
          },
          aiAgentic: {
            summary: 'Autonomous research agents continuously update workflow automation intelligence — you set the strategic lens.',
            detail: 'Research agents proactively surface workflow automation insights from market signals, audience data, and competitive movements. You shape research priorities, not execute searches.',
          },
        },
        'write-brief': {
          preAI: {
            summary: 'You wait for briefs written by hand, often lacking the workflow automation detail you need.',
            detail: 'Briefs arrive incomplete or misaligned with your workflow automation requirements. You spend cycles requesting revisions and clarifying expectations before work can proceed.',
          },
          aiAgents: {
            summary: 'AI drafts briefs with workflow automation requirements pre-populated from templates and past projects.',
            detail: 'Brief generation agents pull your workflow automation requirements into structured templates. You review and refine rather than starting from a blank page.',
          },
          aiAgentic: {
            summary: 'Autonomous agents generate complete briefs with workflow automation alignment built in — you approve strategy.',
            detail: 'Brief agents produce publication-ready briefs that embed your workflow automation requirements from historical patterns. You govern strategic direction rather than reviewing drafts.',
          },
        },
        'draft-content': {
          preAI: {
            summary: 'You review drafts created entirely by hand, checking each one for alignment with workflow automation.',
            detail: 'First drafts vary wildly in quality and workflow automation alignment. You often send content back for multiple revision cycles, creating bottlenecks in the pipeline.',
          },
          aiAgents: {
            summary: 'AI generates first drafts with workflow automation guidelines embedded, reducing your revision cycles.',
            detail: 'Drafting agents produce content aligned with your workflow automation standards from the start. You focus on strategic refinement rather than basic corrections.',
          },
          aiAgentic: {
            summary: 'Autonomous drafting agents produce content meeting workflow automation standards — you set creative direction.',
            detail: 'Drafting agents generate content that passes your workflow automation criteria automatically. You focus on strategic vision and creative differentiation rather than quality control.',
          },
        },
        'seo-optimization': {
          preAI: {
            summary: 'SEO optimization is manual and disconnected from your workflow automation priorities.',
            detail: 'Keyword research and meta optimization happen separately from your workflow automation workflow. You rarely see SEO data until after content is already in review.',
          },
          aiAgents: {
            summary: 'AI SEO tools optimize content while preserving your workflow automation priorities.',
            detail: 'SEO agents suggest keywords and meta improvements that align with your workflow automation goals. You approve optimizations rather than manually researching keywords.',
          },
          aiAgentic: {
            summary: 'Autonomous SEO agents optimize continuously within workflow automation boundaries — you define the strategy.',
            detail: 'SEO agents self-optimize content based on real-time search signals and your workflow automation guardrails. You set strategic keywords and constraints, not individual page optimizations.',
          },
        },
        'brand-compliance': {
          preAI: {
            summary: 'Brand checks are subjective and slow, creating delays in your workflow automation workflow.',
            detail: 'Brand reviewers interpret guidelines differently. Inconsistent enforcement of tone, terminology, and messaging means workflow automation is harder to maintain at scale.',
          },
          aiAgents: {
            summary: 'AI brand checkers flag violations and score workflow automation alignment before human review.',
            detail: 'Brand agents scan content against guidelines and highlight workflow automation issues. You make judgment calls on edge cases rather than catching basic violations.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents enforce compliance at scale with workflow automation rules — you update the rulebook.',
            detail: 'Brand agents apply and evolve compliance checks across all content automatically. Your workflow automation standards are codified as machine-enforceable rules that you govern and refine.',
          },
        },
        'final-edit': {
          preAI: {
            summary: 'Final edits depend entirely on editor availability, blocking your workflow automation timelines.',
            detail: 'A single editor bottleneck means content waits in queue. Your workflow automation deadlines slip because there is no way to parallelize the final polish step.',
          },
          aiAgents: {
            summary: 'AI editing assistants handle mechanical fixes, freeing your workflow automation focus for strategic polish.',
            detail: 'Editing agents catch grammar, style, and consistency issues automatically. Your workflow automation perspective is reserved for nuance and narrative quality.',
          },
          aiAgentic: {
            summary: 'Autonomous editing agents polish content to publication standard — your workflow automation bar is encoded as policy.',
            detail: 'Editing agents handle all mechanical and stylistic refinement autonomously. Your workflow automation standards are embedded as editorial policies that improve with each iteration.',
          },
        },
        'track-performance': {
          preAI: {
            summary: 'Performance tracking is fragmented across tools, making workflow automation assessment difficult.',
            detail: 'You pull data from analytics dashboards, social platforms, and CRM separately. Building a complete picture for workflow automation requires manual data stitching.',
          },
          aiAgents: {
            summary: 'AI dashboards surface workflow automation metrics in real time without manual data pulling.',
            detail: 'Performance agents aggregate data and highlight the workflow automation signals that matter to you. You analyze trends rather than building dashboards from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous tracking agents monitor workflow automation metrics continuously and trigger alerts and actions.',
            detail: 'Performance agents stream workflow automation data and automatically trigger optimization workflows when thresholds are breached. You define KPIs and review strategic implications.',
          },
        },
        'generate-report': {
          preAI: {
            summary: 'Reports are built manually in spreadsheets, often missing the workflow automation metrics you need.',
            detail: 'Report creation takes hours of data gathering and formatting. The metrics that matter for workflow automation are often buried or missing entirely from standard templates.',
          },
          aiAgents: {
            summary: 'AI generates reports with workflow automation metrics pre-formatted and insights highlighted.',
            detail: 'Reporting agents compile your workflow automation data into structured templates with automated analysis. You add strategic narrative rather than wrangling data.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce workflow automation reports on demand with strategic recommendations.',
            detail: 'Reporting agents generate workflow automation analyses with actionable recommendations automatically. You consume insights and set strategic direction rather than producing reports.',
          },
        },
        'brief-approval': {
          preAI: {
            summary: 'Brief approvals are bottlenecked by manual review cycles that delay your workflow automation work.',
            detail: 'You wait for briefs to pass through approval chains before your workflow automation tasks can begin. Unclear approval criteria mean briefs bounce back and forth repeatedly.',
          },
          aiAgents: {
            summary: 'AI pre-screens briefs for workflow automation alignment, routing only exceptions to you.',
            detail: 'Approval agents check briefs against your workflow automation criteria and flag gaps. You review flagged items rather than reading every brief end to end.',
          },
          aiAgentic: {
            summary: 'Autonomous approval agents clear standard briefs and escalate only workflow automation exceptions to you.',
            detail: 'Approval agents validate briefs against your workflow automation criteria and auto-approve routine requests. You handle strategic exceptions and edge cases only.',
          },
        },
        'quality-check': {
          preAI: {
            summary: 'Quality checks are inconsistent manual reviews with no standard workflow automation criteria.',
            detail: 'Quality varies by reviewer and day. There is no automated baseline for readability, accuracy, or workflow automation alignment, leading to uneven content standards.',
          },
          aiAgents: {
            summary: 'AI quality gates enforce baseline standards, letting you focus on workflow automation nuance.',
            detail: 'Quality agents score readability, accuracy, and SEO automatically. Your workflow automation evaluation focuses on strategic alignment rather than mechanical checks.',
          },
          aiAgentic: {
            summary: 'Autonomous quality agents enforce standards continuously — workflow automation baselines are self-maintaining.',
            detail: 'Quality agents apply and evolve quality standards based on your workflow automation benchmarks. You set quality policies that the system enforces and improves over time.',
          },
        },
        'brand-review': {
          preAI: {
            summary: 'Brand reviews are subjective gates that slow your workflow automation pipeline.',
            detail: 'Reviewers apply brand guidelines inconsistently. What passes one review fails the next, creating unpredictable delays in your workflow automation workflow.',
          },
          aiAgents: {
            summary: 'AI brand agents pre-score content, surfacing workflow automation issues before your review.',
            detail: 'Brand review agents apply guidelines consistently and flag workflow automation deviations. You handle exceptions and judgment calls rather than full content scans.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents review all content at scale — you govern workflow automation policy evolution.',
            detail: 'Brand review agents handle all compliance checking autonomously with your workflow automation rules. You update brand guidelines and review the rare edge case that requires human judgment.',
          },
        },
        'stakeholder-signoff': {
          preAI: {
            summary: 'Stakeholder sign-off is a bottleneck where executives delay your workflow automation timelines.',
            detail: 'Senior approvers are busy and unresponsive. Your workflow automation work stalls while waiting for sign-off, and last-minute changes create downstream chaos.',
          },
          aiAgents: {
            summary: 'AI prepares sign-off packages with workflow automation summaries for faster executive approval.',
            detail: 'Sign-off agents compile context, changes, and workflow automation impact assessments for approvers. Executives review structured summaries rather than raw content.',
          },
          aiAgentic: {
            summary: 'Autonomous agents handle routine sign-offs within workflow automation parameters — executives approve strategy only.',
            detail: 'Sign-off agents clear content that meets all workflow automation criteria automatically. Executives only review strategic pivots or high-risk content that breaches defined thresholds.',
          },
        },
        'social-listening': {
          preAI: {
            summary: 'Social listening is ad hoc keyword monitoring with no systematic link to workflow automation.',
            detail: 'You check social platforms manually for relevant conversations. Insights rarely reach your workflow automation workflow before they become stale or irrelevant.',
          },
          aiAgents: {
            summary: 'AI monitoring tools surface trending topics and sentiment relevant to workflow automation in real time.',
            detail: 'Listening agents track conversations and flag workflow automation signals across platforms. You act on curated insights rather than monitoring feeds manually.',
          },
          aiAgentic: {
            summary: 'Autonomous listening agents track and respond to workflow automation signals across all platforms in real time.',
            detail: 'Listening agents monitor social channels and proactively surface workflow automation opportunities and risks. You set monitoring priorities and review strategic findings.',
          },
        },
        'visual-asset-creation': {
          preAI: {
            summary: 'Visual asset creation is a slow design queue disconnected from your workflow automation needs.',
            detail: 'Design requests go into a backlog with unclear priorities. Your workflow automation requirements are often lost in translation between brief and final asset.',
          },
          aiAgents: {
            summary: 'AI design tools generate asset options aligned with workflow automation requirements.',
            detail: 'Design agents produce visual variants following your workflow automation guidelines. You select and refine from AI-generated options rather than directing from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous design agents produce visual assets within workflow automation guidelines — you set creative direction.',
            detail: 'Design agents generate publication-ready visuals following your workflow automation standards. You define the creative vision and approve hero assets while routine visuals ship autonomously.',
          },
        },
        'legal-review': {
          preAI: {
            summary: 'Legal review is an opaque process that creates unpredictable delays in your workflow automation work.',
            detail: 'Legal feedback arrives late with minimal context. You cannot predict how long review will take, making workflow automation planning unreliable.',
          },
          aiAgents: {
            summary: 'AI legal screening flags compliance risks early, reducing workflow automation surprises downstream.',
            detail: 'Legal agents pre-scan content for regulatory issues and workflow automation risks. You get early warnings rather than discovering problems at the sign-off stage.',
          },
          aiAgentic: {
            summary: 'Autonomous legal agents clear routine content and escalate only true workflow automation risks to human counsel.',
            detail: 'Legal agents scan and clear standard content autonomously using your workflow automation rule framework. Human lawyers handle novel risk scenarios and precedent-setting decisions only.',
          },
        },
        'accessibility-check': {
          preAI: {
            summary: 'Accessibility checking is a manual afterthought, rarely connected to your workflow automation process.',
            detail: 'WCAG compliance and inclusive language reviews happen late in the pipeline. Your workflow automation work is already done when accessibility issues force rework.',
          },
          aiAgents: {
            summary: 'AI accessibility tools catch WCAG violations automatically, protecting your workflow automation standards.',
            detail: 'Accessibility agents scan for inclusive language and alt-text compliance. Your workflow automation requirements benefit from automated baseline checks before human review.',
          },
          aiAgentic: {
            summary: 'Autonomous accessibility agents enforce WCAG and inclusive standards — workflow automation is guaranteed by default.',
            detail: 'Accessibility agents ensure all content meets compliance standards before publication. Your workflow automation benefits from guaranteed accessibility without manual checking overhead.',
          },
        },
        'localize-content': {
          preAI: {
            summary: 'Localization is a slow, manual translation process that delays your workflow automation for global markets.',
            detail: 'Each market requires separate translation, cultural review, and compliance checking. Your workflow automation suffers because localized versions lag weeks behind the original.',
          },
          aiAgents: {
            summary: 'AI translation agents accelerate localization while respecting workflow automation requirements.',
            detail: 'Localization agents produce initial translations with workflow automation context preserved. You review for cultural nuance rather than translating from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous localization agents adapt content for all markets simultaneously — your workflow automation scales globally.',
            detail: 'Localization agents handle translation, cultural adaptation, and regional compliance autonomously. Your workflow automation is maintained across markets without manual per-locale effort.',
          },
        },
        'ab-variant-creation': {
          preAI: {
            summary: 'A/B variants are created manually with limited connection to your workflow automation hypotheses.',
            detail: 'Test variants rely on guesswork rather than data. Your workflow automation insights rarely inform variant design, reducing the value of testing efforts.',
          },
          aiAgents: {
            summary: 'AI generates test variants informed by workflow automation data and historical performance.',
            detail: 'Variant agents create headlines, CTAs, and imagery options based on your workflow automation hypotheses. You select winning approaches rather than brainstorming from zero.',
          },
          aiAgentic: {
            summary: 'Autonomous variant agents design, deploy, and learn from tests using workflow automation hypotheses — you set the agenda.',
            detail: 'Variant agents run continuous testing experiments informed by your workflow automation objectives. You define what to test and review strategic learnings while the system iterates autonomously.',
          },
        },
        'content-repurposing': {
          preAI: {
            summary: 'Content repurposing is manual reformatting, disconnected from your workflow automation goals.',
            detail: 'Each derivative asset is created from scratch. Your workflow automation requirements are not systematically applied when repurposing content across formats.',
          },
          aiAgents: {
            summary: 'AI repurposing agents derive secondary assets with workflow automation consistency built in.',
            detail: 'Repurposing agents transform primary content into channel-specific formats following your workflow automation guidelines. You approve derivatives rather than recreating each manually.',
          },
          aiAgentic: {
            summary: 'Autonomous repurposing agents derive all secondary assets automatically within workflow automation guidelines.',
            detail: 'Repurposing agents transform primary content into every derivative format following your workflow automation rules. You set format strategy while the system handles production at scale.',
          },
        },
        'archive-tag': {
          preAI: {
            summary: 'Content archiving is inconsistent, making workflow automation-related retrieval nearly impossible.',
            detail: 'Tagging and taxonomy are applied inconsistently or not at all. Finding past content relevant to workflow automation requires searching through unstructured repositories.',
          },
          aiAgents: {
            summary: 'AI tagging agents classify content automatically, making workflow automation retrieval faster.',
            detail: 'Archive agents apply taxonomy and metadata based on your workflow automation categories. You validate classifications rather than manually tagging every asset.',
          },
          aiAgentic: {
            summary: 'Autonomous archive agents maintain perfect taxonomy — workflow automation retrieval is instant and reliable.',
            detail: 'Archive agents classify, tag, and organize all content using your workflow automation taxonomy automatically. You evolve the taxonomy structure while the system maintains it flawlessly.',
          },
        },
        'legal-compliance-gate': {
          preAI: {
            summary: 'Legal compliance gates create unpredictable holds that delay your workflow automation deadlines.',
            detail: 'Legal sign-off timing is opaque and variable. Your workflow automation timelines are at the mercy of legal review queues with no visibility into status.',
          },
          aiAgents: {
            summary: 'AI pre-screening reduces legal gate delays by resolving routine workflow automation checks automatically.',
            detail: 'Compliance agents handle standard checks and only escalate workflow automation edge cases to human lawyers. Your timelines are more predictable because routine items clear faster.',
          },
          aiAgentic: {
            summary: 'Autonomous compliance gates clear routine content instantly — only novel workflow automation risks reach human lawyers.',
            detail: 'Compliance agents handle standard legal checks autonomously using your workflow automation risk framework. Human review is reserved for unprecedented scenarios and policy updates.',
          },
        },
        'localization-quality-gate': {
          preAI: {
            summary: 'Localization quality gates are inconsistent, creating workflow automation risks in global markets.',
            detail: 'Quality checks for localized content vary by market and reviewer. Your workflow automation standards are unevenly applied across regions and languages.',
          },
          aiAgents: {
            summary: 'AI quality checks catch translation errors before they affect your workflow automation outcomes.',
            detail: 'Localization QA agents verify accuracy and cultural fit automatically. Your workflow automation standards are applied consistently across all target markets.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents ensure localization quality across all markets — workflow automation is guaranteed globally.',
            detail: 'Localization QA agents validate every market adaptation autonomously against your workflow automation standards. You set quality criteria while the system enforces them at scale.',
          },
        },
        'segment-mapping': {
          preAI: {
            summary: 'Segment mapping is manual spreadsheet work with limited visibility into workflow automation impact.',
            detail: 'Mapping content variants to audience segments is done in spreadsheets. Your workflow automation data is disconnected from the personalization logic.',
          },
          aiAgents: {
            summary: 'AI agents map variants to segments using workflow automation data from the CDP.',
            detail: 'Segment agents recommend variant-audience matches based on your workflow automation signals. You review the mapping rather than building it manually in spreadsheets.',
          },
          aiAgentic: {
            summary: 'Autonomous segment agents map and optimize variant-audience matches using live workflow automation signals.',
            detail: 'Segment agents continuously refine variant-audience mappings based on real-time workflow automation data. You define segmentation strategy while the system executes and optimizes automatically.',
          },
        },
        'personalization-qa': {
          preAI: {
            summary: 'Personalization QA is manual spot-checking that misses workflow automation gaps.',
            detail: 'Testing every segment-variant combination is impossible manually. Your workflow automation concerns are only caught when users report issues post-launch.',
          },
          aiAgents: {
            summary: 'AI QA agents validate personalization coverage and flag workflow automation gaps before launch.',
            detail: 'QA agents test every segment-variant combination against your workflow automation requirements. You review exception reports rather than manually spot-checking combinations.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents validate every personalization scenario — workflow automation gaps are caught before launch.',
            detail: 'Personalization QA agents test all segment-variant combinations against your workflow automation requirements automatically. You set acceptance criteria while the system validates at scale.',
          },
        },
        'campaign-planning': {
          preAI: {
            summary: 'Campaign planning is a manual coordination effort with fragmented workflow automation inputs.',
            detail: 'Campaign plans are built in decks and spreadsheets with incomplete data. Your workflow automation perspective is often incorporated too late in the planning cycle.',
          },
          aiAgents: {
            summary: 'AI planning agents draft campaign frameworks with workflow automation data pre-integrated.',
            detail: 'Planning agents pull audience, budget, and performance data into campaign templates. Your workflow automation priorities shape the plan from the start rather than being retrofitted.',
          },
          aiAgentic: {
            summary: 'Autonomous planning agents generate campaign frameworks using workflow automation intelligence — you set objectives.',
            detail: 'Planning agents produce data-driven campaign plans with your workflow automation priorities embedded. You define strategic goals while the system optimizes tactics and resource allocation.',
          },
        },
        'consent-check': {
          preAI: {
            summary: 'Consent checking is a manual compliance step that adds friction to your workflow automation process.',
            detail: 'Verifying GDPR/CCPA consent for targeting requires manual cross-referencing. Your workflow automation work is delayed while compliance status is manually confirmed.',
          },
          aiAgents: {
            summary: 'AI consent agents verify targeting compliance automatically, reducing workflow automation friction.',
            detail: 'Consent agents cross-reference CDP signals against GDPR/CCPA rules for your workflow automation needs. You handle exceptions rather than manually verifying every segment.',
          },
          aiAgentic: {
            summary: 'Autonomous consent agents enforce privacy compliance at scale — workflow automation is guaranteed by architecture.',
            detail: 'Consent agents verify targeting compliance in real time across all segments using your workflow automation framework. You set privacy policies while the system enforces them automatically.',
          },
        },
        'paid-creative-production': {
          preAI: {
            summary: 'Paid creative production runs separately from organic, fragmenting your workflow automation oversight.',
            detail: 'Ad creative and organic content are produced in silos. Your workflow automation perspective is applied inconsistently between paid and organic channels.',
          },
          aiAgents: {
            summary: 'AI production agents generate paid variants from organic content with workflow automation consistency.',
            detail: 'Paid creative agents adapt organic content for ad platforms following your workflow automation guidelines. You approve and fine-tune rather than producing ad creative from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous production agents create paid variants at scale within workflow automation guardrails — you set the strategy.',
            detail: 'Paid creative agents generate ad variants from organic content following your workflow automation guidelines. You define creative strategy while the system produces and optimizes at scale.',
          },
        },
        'attribution-modeling': {
          preAI: {
            summary: 'Attribution modeling is manual and unreliable, undermining your workflow automation reporting.',
            detail: 'Last-click attribution dominates despite its flaws. Your workflow automation decisions lack the multi-touch perspective needed for accurate performance assessment.',
          },
          aiAgents: {
            summary: 'AI attribution models surface multi-touch insights relevant to your workflow automation priorities.',
            detail: 'Attribution agents calculate content ROI across channels using your workflow automation weightings. You interpret strategic implications rather than building models manually.',
          },
          aiAgentic: {
            summary: 'Autonomous attribution agents run multi-touch models continuously — workflow automation insights update in real time.',
            detail: 'Attribution agents calculate content ROI across all channels using your workflow automation framework. You interpret strategic implications while the system handles modeling complexity.',
          },
        },
        'executive-reporting': {
          preAI: {
            summary: 'Executive reports are manually assembled, often missing the workflow automation narrative you need.',
            detail: 'Building executive dashboards takes hours of data wrangling. The workflow automation story you want to tell is lost in generic reporting templates.',
          },
          aiAgents: {
            summary: 'AI builds executive dashboards with workflow automation narratives pre-drafted for leadership.',
            detail: 'Reporting agents synthesize data into executive formats with your workflow automation story embedded. You refine the narrative rather than assembling data from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce executive dashboards with workflow automation narratives — you add strategic context.',
            detail: 'Executive reporting agents synthesize all data into leadership-ready formats with your workflow automation story embedded. You provide strategic commentary on auto-generated insights.',
          },
        },
        'competitive-response': {
          preAI: {
            summary: 'Competitive response is slow and reactive, giving you no workflow automation advantage.',
            detail: 'By the time you spot a competitor move and respond, the moment has passed. Your workflow automation approach cannot adapt fast enough to real-time competitive signals.',
          },
          aiAgents: {
            summary: 'AI competitive agents surface signals and draft responses aligned with workflow automation strategy.',
            detail: 'Competitive agents monitor market moves and suggest workflow automation-aligned responses. You approve and refine reactive content rather than spotting threats manually.',
          },
          aiAgentic: {
            summary: 'Autonomous competitive agents detect and draft responses in real time — workflow automation moves are countered instantly.',
            detail: 'Competitive agents monitor signals, draft responses, and deploy within your workflow automation guardrails. You approve high-stakes responses while routine reactions ship autonomously.',
          },
        },
        'content-governance': {
          preAI: {
            summary: 'Content governance is periodic manual auditing that cannot keep pace with your workflow automation standards.',
            detail: 'Live content drifts out of compliance between infrequent reviews. Your workflow automation requirements are only enforced when someone manually checks.',
          },
          aiAgents: {
            summary: 'AI governance agents continuously audit live content against workflow automation standards.',
            detail: 'Governance agents flag content drift, compliance gaps, and workflow automation issues in real time. You review flagged items rather than conducting manual audits.',
          },
          aiAgentic: {
            summary: 'Autonomous governance agents audit all live content continuously — workflow automation compliance is always current.',
            detail: 'Governance agents monitor every published piece against your workflow automation standards in real time. You evolve governance policies while the system enforces them perpetually.',
          },
        },
        'governance-gate': {
          preAI: {
            summary: 'Governance gates are calendar-driven checkpoints disconnected from your workflow automation rhythm.',
            detail: 'Governance reviews happen on a fixed schedule regardless of content velocity. Your workflow automation concerns may not surface until the next quarterly review.',
          },
          aiAgents: {
            summary: 'AI governance gates run continuous checks, surfacing workflow automation issues between formal reviews.',
            detail: 'Governance agents validate live content against your workflow automation criteria on an ongoing basis. You act on exception alerts rather than waiting for quarterly reviews.',
          },
          aiAgentic: {
            summary: 'Autonomous governance gates run continuously — workflow automation violations trigger immediate remediation.',
            detail: 'Governance agents validate live content against your workflow automation criteria continuously and auto-trigger refresh or retirement workflows. You set policies, not review schedules.',
          },
        },
        'journey-mapping': {
          preAI: {
            summary: 'Journey mapping is a manual exercise that rarely reflects your workflow automation reality.',
            detail: 'Customer journey maps are created in workshops and quickly go stale. Your workflow automation perspective is a snapshot, not a living view of how content performs at each stage.',
          },
          aiAgents: {
            summary: 'AI journey agents map content to lifecycle stages using workflow automation data from the CDP.',
            detail: 'Journey agents dynamically map content to customer stages based on your workflow automation framework. You validate the mapping rather than building it manually in workshops.',
          },
          aiAgentic: {
            summary: 'Autonomous journey agents maintain living maps using real-time workflow automation data — you shape the strategy.',
            detail: 'Journey agents dynamically map content to lifecycle stages using live workflow automation signals. You define journey frameworks while the system optimizes content placement continuously.',
          },
        },
        'sentiment-monitoring': {
          preAI: {
            summary: 'Sentiment monitoring is sporadic manual checking with no systematic link to workflow automation.',
            detail: 'You check brand sentiment reactively rather than proactively. Your workflow automation decisions are made without real-time audience feedback signals.',
          },
          aiAgents: {
            summary: 'AI sentiment agents track brand reception in real time, alerting you to workflow automation risks.',
            detail: 'Sentiment agents analyze audience reactions and flag workflow automation concerns before they escalate. You respond to alerts rather than manually checking platforms.',
          },
          aiAgentic: {
            summary: 'Autonomous sentiment agents monitor and respond to workflow automation signals around the clock — you govern escalation.',
            detail: 'Sentiment agents track audience reactions and trigger workflow automation responses automatically. You set escalation thresholds and review strategic implications of sentiment shifts.',
          },
        },
        'sales-enablement': {
          preAI: {
            summary: 'Sales enablement content is created ad hoc, disconnected from your workflow automation strategy.',
            detail: 'Sales teams request materials outside the content pipeline. Your workflow automation standards are not applied to battle cards, decks, and one-pagers created in isolation.',
          },
          aiAgents: {
            summary: 'AI agents generate sales materials from marketing content with workflow automation alignment.',
            detail: 'Sales enablement agents transform marketing assets into battle cards and decks following your workflow automation standards. You approve rather than creating each piece manually.',
          },
          aiAgentic: {
            summary: 'Autonomous enablement agents keep sales materials current with workflow automation alignment — you set the playbook.',
            detail: 'Enablement agents automatically update battle cards, decks, and case studies as your workflow automation data evolves. You define the sales narrative while the system produces materials at scale.',
          },
        },
        'influencer-brief': {
          preAI: {
            summary: 'Influencer briefs are manual documents with limited workflow automation guardrails.',
            detail: 'Creator briefs are written from scratch each time. Your workflow automation guidelines are inconsistently communicated to external partners and influencers.',
          },
          aiAgents: {
            summary: 'AI agents draft influencer briefs with workflow automation guardrails embedded automatically.',
            detail: 'Brief agents generate creator guidelines from your workflow automation requirements and past successful collaborations. You customize rather than writing each brief from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous brief agents generate creator guidelines with workflow automation guardrails — you approve partnerships.',
            detail: 'Brief agents produce personalized influencer guidelines using your workflow automation framework and creator history. You focus on relationship strategy while briefs ship autonomously.',
          },
        },
        'ugc-moderation': {
          preAI: {
            summary: 'UGC moderation is manual screening that cannot scale to protect workflow automation.',
            detail: 'User-generated content is reviewed one piece at a time. Your workflow automation standards cannot be consistently enforced across the volume of submissions.',
          },
          aiAgents: {
            summary: 'AI moderation agents screen UGC for brand safety and workflow automation compliance at scale.',
            detail: 'Moderation agents filter user-generated content against your workflow automation criteria. You review borderline cases rather than manually screening every submission.',
          },
          aiAgentic: {
            summary: 'Autonomous moderation agents screen all UGC for workflow automation compliance at scale — you govern edge cases.',
            detail: 'Moderation agents filter user-generated content using your workflow automation rules continuously. You update moderation policies and review borderline cases that the system escalates.',
          },
        },
        'content-scoring': {
          preAI: {
            summary: 'Content scoring is subjective prioritization that underweights your workflow automation criteria.',
            detail: 'Requests are prioritized by loudest voice or executive fiat. Your workflow automation scoring criteria are rarely part of the formal prioritization framework.',
          },
          aiAgents: {
            summary: 'AI scoring agents rank requests using workflow automation criteria alongside strategic priority.',
            detail: 'Scoring agents weight your workflow automation factors into the prioritization algorithm. You adjust rankings rather than scoring each request manually.',
          },
          aiAgentic: {
            summary: 'Autonomous scoring agents prioritize the pipeline using workflow automation criteria — you set strategic weights.',
            detail: 'Scoring agents rank and route content requests using your workflow automation priorities in real time. You define scoring criteria and review the queue rather than manually triaging.',
          },
        },
      },
      keyInsight: 'Knowing when to iterate on existing content versus restart the pipeline requires system-level awareness that agents don\'t have.',
    },
  },
  {
    id: 'consumer-insights',
    title: 'Consumer Insights',
    description: 'Owns audience understanding and ensures every piece of content is grounded in real customer data.',
    tagline: 'Formalizes what customers actually need.',
    iconName: 'Users',
    category: 'operations',
    accentColor: '#B8943F',
    ownedSteps: ['research-insights', 'social-listening', 'sentiment-monitoring'],
    reviewedGates: [],
    relatedAgents: ['research-agent', 'social-listening-agent'],
    relatedInputs: ['audience-personas', 'analytics-data', 'content-strategy', 'competitor-library', 'cdp-profiles'],
    narrative: {
      nodeJourneys: {
        'research-insights': {
          preAI: {
            summary: 'You build audience personas, run surveys, and synthesize behavioral data into briefs.',
            detail: 'Insights are gathered periodically and distributed manually. By the time a persona update reaches the content team, some of it is already outdated.',
          },
          aiAgents: {
            summary: 'Research agents synthesize audience data continuously, using your persona frameworks as the structure.',
            detail: 'Data arrives faster, but it still needs your judgment to separate signal from noise. You curate which audience signals matter.',
          },
          aiAgentic: {
            summary: 'Your personas are live infrastructure — every agent queries them in real time before making content decisions.',
            detail: 'When personas are sharp, the whole system produces relevant content. When they drift, everything drifts. Your maintenance of this input has system-wide impact.',
          },
        },
        'social-listening': {
          preAI: {
            summary: 'You monitor social platforms manually, scanning for trending topics and audience sentiment shifts.',
            detail: 'Social monitoring is time-consuming and reactive. You catch trends after they peak because manual scanning can\'t keep pace with the volume of conversations.',
          },
          aiAgents: {
            summary: 'A social listening agent surfaces trending topics, sentiment shifts, and competitive signals in real time.',
            detail: 'You stop scanning and start interpreting. The agent handles volume; you decide which signals are meaningful enough to influence the content pipeline.',
          },
          aiAgentic: {
            summary: 'Social listening runs continuously and feeds signals directly into brief creation and competitive response workflows.',
            detail: 'The system detects, classifies, and routes social signals without your involvement. You calibrate what counts as a meaningful signal and review the edge cases where context matters.',
          },
        },
        'sentiment-monitoring': {
          preAI: {
            summary: 'You track audience reaction to published content by checking social comments, reviews, and support tickets manually.',
            detail: 'Sentiment data is fragmented across platforms. By the time you assemble a picture of how content landed, the window for course-correction has often closed.',
          },
          aiAgents: {
            summary: 'A sentiment agent aggregates brand mention tone and content reception signals across all channels in real time.',
            detail: 'Alerts surface when sentiment shifts negatively. You interpret whether a dip is noise, a content problem, or an emerging reputational risk.',
          },
          aiAgentic: {
            summary: 'Sentiment monitoring is continuous and auto-triggers escalation when brand health scores cross your thresholds.',
            detail: 'The system connects sentiment signals to downstream actions — pausing distribution, triggering competitive response, or flagging for stakeholder review. You design the thresholds and interpret ambiguous signals.',
          },
        },
        'receive-request': {
          preAI: {
            summary: 'You analyze incoming requests manually, sorting through emails and Slack messages for audience behavior.',
            detail: 'Requests arrive in inconsistent formats with no standard intake process. You spend hours triaging and clarifying scope before audience behavior can even begin.',
          },
          aiAgents: {
            summary: 'An AI intake agent structures requests and flags audience behavior implications before they reach your queue.',
            detail: 'Requests arrive pre-categorized with audience behavior signals highlighted. You validate and prioritize rather than manually parsing raw inputs.',
          },
          aiAgentic: {
            summary: 'Autonomous intake agents triage, validate, and route requests with audience behavior logic — you govern exceptions.',
            detail: 'Agentic intake handles end-to-end request processing with your audience behavior rules embedded. You set policies and review escalations while routine requests flow automatically.',
          },
        },
        'write-brief': {
          preAI: {
            summary: 'You wait for briefs written by hand, often lacking the audience behavior detail you need.',
            detail: 'Briefs arrive incomplete or misaligned with your audience behavior requirements. You spend cycles requesting revisions and clarifying expectations before work can proceed.',
          },
          aiAgents: {
            summary: 'AI drafts briefs with audience behavior requirements pre-populated from templates and past projects.',
            detail: 'Brief generation agents pull your audience behavior requirements into structured templates. You review and refine rather than starting from a blank page.',
          },
          aiAgentic: {
            summary: 'Autonomous agents generate complete briefs with audience behavior alignment built in — you approve strategy.',
            detail: 'Brief agents produce publication-ready briefs that embed your audience behavior requirements from historical patterns. You govern strategic direction rather than reviewing drafts.',
          },
        },
        'draft-content': {
          preAI: {
            summary: 'You review drafts created entirely by hand, checking each one for alignment with audience behavior.',
            detail: 'First drafts vary wildly in quality and audience behavior alignment. You often send content back for multiple revision cycles, creating bottlenecks in the pipeline.',
          },
          aiAgents: {
            summary: 'AI generates first drafts with audience behavior guidelines embedded, reducing your revision cycles.',
            detail: 'Drafting agents produce content aligned with your audience behavior standards from the start. You focus on strategic refinement rather than basic corrections.',
          },
          aiAgentic: {
            summary: 'Autonomous drafting agents produce content meeting audience behavior standards — you set creative direction.',
            detail: 'Drafting agents generate content that passes your audience behavior criteria automatically. You focus on strategic vision and creative differentiation rather than quality control.',
          },
        },
        'seo-optimization': {
          preAI: {
            summary: 'SEO optimization is manual and disconnected from your audience behavior priorities.',
            detail: 'Keyword research and meta optimization happen separately from your audience behavior workflow. You rarely see SEO data until after content is already in review.',
          },
          aiAgents: {
            summary: 'AI SEO tools optimize content while preserving your audience behavior priorities.',
            detail: 'SEO agents suggest keywords and meta improvements that align with your audience behavior goals. You approve optimizations rather than manually researching keywords.',
          },
          aiAgentic: {
            summary: 'Autonomous SEO agents optimize continuously within audience behavior boundaries — you define the strategy.',
            detail: 'SEO agents self-optimize content based on real-time search signals and your audience behavior guardrails. You set strategic keywords and constraints, not individual page optimizations.',
          },
        },
        'brand-compliance': {
          preAI: {
            summary: 'Brand checks are subjective and slow, creating delays in your audience behavior workflow.',
            detail: 'Brand reviewers interpret guidelines differently. Inconsistent enforcement of tone, terminology, and messaging means audience behavior is harder to maintain at scale.',
          },
          aiAgents: {
            summary: 'AI brand checkers flag violations and score audience behavior alignment before human review.',
            detail: 'Brand agents scan content against guidelines and highlight audience behavior issues. You make judgment calls on edge cases rather than catching basic violations.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents enforce compliance at scale with audience behavior rules — you update the rulebook.',
            detail: 'Brand agents apply and evolve compliance checks across all content automatically. Your audience behavior standards are codified as machine-enforceable rules that you govern and refine.',
          },
        },
        'final-edit': {
          preAI: {
            summary: 'Final edits depend entirely on editor availability, blocking your audience behavior timelines.',
            detail: 'A single editor bottleneck means content waits in queue. Your audience behavior deadlines slip because there is no way to parallelize the final polish step.',
          },
          aiAgents: {
            summary: 'AI editing assistants handle mechanical fixes, freeing your audience behavior focus for strategic polish.',
            detail: 'Editing agents catch grammar, style, and consistency issues automatically. Your audience behavior perspective is reserved for nuance and narrative quality.',
          },
          aiAgentic: {
            summary: 'Autonomous editing agents polish content to publication standard — your audience behavior bar is encoded as policy.',
            detail: 'Editing agents handle all mechanical and stylistic refinement autonomously. Your audience behavior standards are embedded as editorial policies that improve with each iteration.',
          },
        },
        'schedule-publish': {
          preAI: {
            summary: 'Publishing is a manual CMS process with no connection to your audience behavior planning.',
            detail: 'Each piece requires manual scheduling, metadata entry, and CMS configuration. Your audience behavior goals are disconnected from the publish timeline.',
          },
          aiAgents: {
            summary: 'AI scheduling agents suggest optimal publish timing based on audience behavior data.',
            detail: 'Publishing agents recommend times and configurations informed by your audience behavior priorities. You approve the schedule rather than manually configuring CMS settings.',
          },
          aiAgentic: {
            summary: 'Autonomous publishing agents manage scheduling end-to-end using audience behavior optimization logic.',
            detail: 'Publishing agents handle CMS configuration, timing optimization, and deployment autonomously within your audience behavior constraints. You set publishing policies, not individual schedules.',
          },
        },
        'distribute': {
          preAI: {
            summary: 'Content distribution is manual channel-by-channel, with limited visibility into audience behavior.',
            detail: 'Each channel requires separate formatting, scheduling, and posting. There is no unified view of how distribution supports your audience behavior objectives.',
          },
          aiAgents: {
            summary: 'AI distribution agents adapt content per channel with audience behavior rules built in.',
            detail: 'Distribution agents format and deploy content across channels following your audience behavior guidelines. You monitor and adjust rather than manually posting to each platform.',
          },
          aiAgentic: {
            summary: 'Autonomous distribution agents manage all channels with audience behavior rules — you govern the playbook.',
            detail: 'Distribution agents deploy, adapt, and optimize content across every channel following your audience behavior playbook. You evolve distribution strategy, not execute individual channel posts.',
          },
        },
        'track-performance': {
          preAI: {
            summary: 'Performance tracking is fragmented across tools, making audience behavior assessment difficult.',
            detail: 'You pull data from analytics dashboards, social platforms, and CRM separately. Building a complete picture for audience behavior requires manual data stitching.',
          },
          aiAgents: {
            summary: 'AI dashboards surface audience behavior metrics in real time without manual data pulling.',
            detail: 'Performance agents aggregate data and highlight the audience behavior signals that matter to you. You analyze trends rather than building dashboards from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous tracking agents monitor audience behavior metrics continuously and trigger alerts and actions.',
            detail: 'Performance agents stream audience behavior data and automatically trigger optimization workflows when thresholds are breached. You define KPIs and review strategic implications.',
          },
        },
        'generate-report': {
          preAI: {
            summary: 'Reports are built manually in spreadsheets, often missing the audience behavior metrics you need.',
            detail: 'Report creation takes hours of data gathering and formatting. The metrics that matter for audience behavior are often buried or missing entirely from standard templates.',
          },
          aiAgents: {
            summary: 'AI generates reports with audience behavior metrics pre-formatted and insights highlighted.',
            detail: 'Reporting agents compile your audience behavior data into structured templates with automated analysis. You add strategic narrative rather than wrangling data.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce audience behavior reports on demand with strategic recommendations.',
            detail: 'Reporting agents generate audience behavior analyses with actionable recommendations automatically. You consume insights and set strategic direction rather than producing reports.',
          },
        },
        'optimize': {
          preAI: {
            summary: 'Content optimization is reactive and slow, with limited connection to audience behavior data.',
            detail: 'Optimization decisions rely on gut feel and delayed data. Your audience behavior insights rarely feed back into content updates in a timely way.',
          },
          aiAgents: {
            summary: 'AI recommends optimizations based on audience behavior signals and historical performance.',
            detail: 'Optimization agents suggest specific changes tied to your audience behavior metrics. You approve and prioritize recommendations rather than diagnosing issues manually.',
          },
          aiAgentic: {
            summary: 'Autonomous optimization agents improve content continuously using audience behavior signals — you set boundaries.',
            detail: 'Optimization agents test, iterate, and improve content based on audience behavior data within your guardrails. You define acceptable ranges and review significant changes.',
          },
        },
        'brief-approval': {
          preAI: {
            summary: 'Brief approvals are bottlenecked by manual review cycles that delay your audience behavior work.',
            detail: 'You wait for briefs to pass through approval chains before your audience behavior tasks can begin. Unclear approval criteria mean briefs bounce back and forth repeatedly.',
          },
          aiAgents: {
            summary: 'AI pre-screens briefs for audience behavior alignment, routing only exceptions to you.',
            detail: 'Approval agents check briefs against your audience behavior criteria and flag gaps. You review flagged items rather than reading every brief end to end.',
          },
          aiAgentic: {
            summary: 'Autonomous approval agents clear standard briefs and escalate only audience behavior exceptions to you.',
            detail: 'Approval agents validate briefs against your audience behavior criteria and auto-approve routine requests. You handle strategic exceptions and edge cases only.',
          },
        },
        'quality-check': {
          preAI: {
            summary: 'Quality checks are inconsistent manual reviews with no standard audience behavior criteria.',
            detail: 'Quality varies by reviewer and day. There is no automated baseline for readability, accuracy, or audience behavior alignment, leading to uneven content standards.',
          },
          aiAgents: {
            summary: 'AI quality gates enforce baseline standards, letting you focus on audience behavior nuance.',
            detail: 'Quality agents score readability, accuracy, and SEO automatically. Your audience behavior evaluation focuses on strategic alignment rather than mechanical checks.',
          },
          aiAgentic: {
            summary: 'Autonomous quality agents enforce standards continuously — audience behavior baselines are self-maintaining.',
            detail: 'Quality agents apply and evolve quality standards based on your audience behavior benchmarks. You set quality policies that the system enforces and improves over time.',
          },
        },
        'brand-review': {
          preAI: {
            summary: 'Brand reviews are subjective gates that slow your audience behavior pipeline.',
            detail: 'Reviewers apply brand guidelines inconsistently. What passes one review fails the next, creating unpredictable delays in your audience behavior workflow.',
          },
          aiAgents: {
            summary: 'AI brand agents pre-score content, surfacing audience behavior issues before your review.',
            detail: 'Brand review agents apply guidelines consistently and flag audience behavior deviations. You handle exceptions and judgment calls rather than full content scans.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents review all content at scale — you govern audience behavior policy evolution.',
            detail: 'Brand review agents handle all compliance checking autonomously with your audience behavior rules. You update brand guidelines and review the rare edge case that requires human judgment.',
          },
        },
        'stakeholder-signoff': {
          preAI: {
            summary: 'Stakeholder sign-off is a bottleneck where executives delay your audience behavior timelines.',
            detail: 'Senior approvers are busy and unresponsive. Your audience behavior work stalls while waiting for sign-off, and last-minute changes create downstream chaos.',
          },
          aiAgents: {
            summary: 'AI prepares sign-off packages with audience behavior summaries for faster executive approval.',
            detail: 'Sign-off agents compile context, changes, and audience behavior impact assessments for approvers. Executives review structured summaries rather than raw content.',
          },
          aiAgentic: {
            summary: 'Autonomous agents handle routine sign-offs within audience behavior parameters — executives approve strategy only.',
            detail: 'Sign-off agents clear content that meets all audience behavior criteria automatically. Executives only review strategic pivots or high-risk content that breaches defined thresholds.',
          },
        },
        'performance-review': {
          preAI: {
            summary: 'Performance reviews are infrequent manual assessments that underserve your audience behavior needs.',
            detail: 'Reviews happen quarterly at best, using outdated data. Your audience behavior perspective is often missing from the evaluation criteria entirely.',
          },
          aiAgents: {
            summary: 'AI evaluates content against KPIs and highlights audience behavior trends for your review.',
            detail: 'Review agents surface performance data with audience behavior context pre-attached. You make optimize/archive decisions based on structured analysis rather than raw metrics.',
          },
          aiAgentic: {
            summary: 'Autonomous review agents evaluate and act on performance with audience behavior logic — you set the framework.',
            detail: 'Review agents continuously assess content against your audience behavior KPIs and trigger optimize/refresh/archive workflows automatically. You define the evaluation framework.',
          },
        },
        'visual-asset-creation': {
          preAI: {
            summary: 'Visual asset creation is a slow design queue disconnected from your audience behavior needs.',
            detail: 'Design requests go into a backlog with unclear priorities. Your audience behavior requirements are often lost in translation between brief and final asset.',
          },
          aiAgents: {
            summary: 'AI design tools generate asset options aligned with audience behavior requirements.',
            detail: 'Design agents produce visual variants following your audience behavior guidelines. You select and refine from AI-generated options rather than directing from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous design agents produce visual assets within audience behavior guidelines — you set creative direction.',
            detail: 'Design agents generate publication-ready visuals following your audience behavior standards. You define the creative vision and approve hero assets while routine visuals ship autonomously.',
          },
        },
        'legal-review': {
          preAI: {
            summary: 'Legal review is an opaque process that creates unpredictable delays in your audience behavior work.',
            detail: 'Legal feedback arrives late with minimal context. You cannot predict how long review will take, making audience behavior planning unreliable.',
          },
          aiAgents: {
            summary: 'AI legal screening flags compliance risks early, reducing audience behavior surprises downstream.',
            detail: 'Legal agents pre-scan content for regulatory issues and audience behavior risks. You get early warnings rather than discovering problems at the sign-off stage.',
          },
          aiAgentic: {
            summary: 'Autonomous legal agents clear routine content and escalate only true audience behavior risks to human counsel.',
            detail: 'Legal agents scan and clear standard content autonomously using your audience behavior rule framework. Human lawyers handle novel risk scenarios and precedent-setting decisions only.',
          },
        },
        'accessibility-check': {
          preAI: {
            summary: 'Accessibility checking is a manual afterthought, rarely connected to your audience behavior process.',
            detail: 'WCAG compliance and inclusive language reviews happen late in the pipeline. Your audience behavior work is already done when accessibility issues force rework.',
          },
          aiAgents: {
            summary: 'AI accessibility tools catch WCAG violations automatically, protecting your audience behavior standards.',
            detail: 'Accessibility agents scan for inclusive language and alt-text compliance. Your audience behavior requirements benefit from automated baseline checks before human review.',
          },
          aiAgentic: {
            summary: 'Autonomous accessibility agents enforce WCAG and inclusive standards — audience behavior is guaranteed by default.',
            detail: 'Accessibility agents ensure all content meets compliance standards before publication. Your audience behavior benefits from guaranteed accessibility without manual checking overhead.',
          },
        },
        'localize-content': {
          preAI: {
            summary: 'Localization is a slow, manual translation process that delays your audience behavior for global markets.',
            detail: 'Each market requires separate translation, cultural review, and compliance checking. Your audience behavior suffers because localized versions lag weeks behind the original.',
          },
          aiAgents: {
            summary: 'AI translation agents accelerate localization while respecting audience behavior requirements.',
            detail: 'Localization agents produce initial translations with audience behavior context preserved. You review for cultural nuance rather than translating from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous localization agents adapt content for all markets simultaneously — your audience behavior scales globally.',
            detail: 'Localization agents handle translation, cultural adaptation, and regional compliance autonomously. Your audience behavior is maintained across markets without manual per-locale effort.',
          },
        },
        'ab-variant-creation': {
          preAI: {
            summary: 'A/B variants are created manually with limited connection to your audience behavior hypotheses.',
            detail: 'Test variants rely on guesswork rather than data. Your audience behavior insights rarely inform variant design, reducing the value of testing efforts.',
          },
          aiAgents: {
            summary: 'AI generates test variants informed by audience behavior data and historical performance.',
            detail: 'Variant agents create headlines, CTAs, and imagery options based on your audience behavior hypotheses. You select winning approaches rather than brainstorming from zero.',
          },
          aiAgentic: {
            summary: 'Autonomous variant agents design, deploy, and learn from tests using audience behavior hypotheses — you set the agenda.',
            detail: 'Variant agents run continuous testing experiments informed by your audience behavior objectives. You define what to test and review strategic learnings while the system iterates autonomously.',
          },
        },
        'content-repurposing': {
          preAI: {
            summary: 'Content repurposing is manual reformatting, disconnected from your audience behavior goals.',
            detail: 'Each derivative asset is created from scratch. Your audience behavior requirements are not systematically applied when repurposing content across formats.',
          },
          aiAgents: {
            summary: 'AI repurposing agents derive secondary assets with audience behavior consistency built in.',
            detail: 'Repurposing agents transform primary content into channel-specific formats following your audience behavior guidelines. You approve derivatives rather than recreating each manually.',
          },
          aiAgentic: {
            summary: 'Autonomous repurposing agents derive all secondary assets automatically within audience behavior guidelines.',
            detail: 'Repurposing agents transform primary content into every derivative format following your audience behavior rules. You set format strategy while the system handles production at scale.',
          },
        },
        'archive-tag': {
          preAI: {
            summary: 'Content archiving is inconsistent, making audience behavior-related retrieval nearly impossible.',
            detail: 'Tagging and taxonomy are applied inconsistently or not at all. Finding past content relevant to audience behavior requires searching through unstructured repositories.',
          },
          aiAgents: {
            summary: 'AI tagging agents classify content automatically, making audience behavior retrieval faster.',
            detail: 'Archive agents apply taxonomy and metadata based on your audience behavior categories. You validate classifications rather than manually tagging every asset.',
          },
          aiAgentic: {
            summary: 'Autonomous archive agents maintain perfect taxonomy — audience behavior retrieval is instant and reliable.',
            detail: 'Archive agents classify, tag, and organize all content using your audience behavior taxonomy automatically. You evolve the taxonomy structure while the system maintains it flawlessly.',
          },
        },
        'legal-compliance-gate': {
          preAI: {
            summary: 'Legal compliance gates create unpredictable holds that delay your audience behavior deadlines.',
            detail: 'Legal sign-off timing is opaque and variable. Your audience behavior timelines are at the mercy of legal review queues with no visibility into status.',
          },
          aiAgents: {
            summary: 'AI pre-screening reduces legal gate delays by resolving routine audience behavior checks automatically.',
            detail: 'Compliance agents handle standard checks and only escalate audience behavior edge cases to human lawyers. Your timelines are more predictable because routine items clear faster.',
          },
          aiAgentic: {
            summary: 'Autonomous compliance gates clear routine content instantly — only novel audience behavior risks reach human lawyers.',
            detail: 'Compliance agents handle standard legal checks autonomously using your audience behavior risk framework. Human review is reserved for unprecedented scenarios and policy updates.',
          },
        },
        'localization-quality-gate': {
          preAI: {
            summary: 'Localization quality gates are inconsistent, creating audience behavior risks in global markets.',
            detail: 'Quality checks for localized content vary by market and reviewer. Your audience behavior standards are unevenly applied across regions and languages.',
          },
          aiAgents: {
            summary: 'AI quality checks catch translation errors before they affect your audience behavior outcomes.',
            detail: 'Localization QA agents verify accuracy and cultural fit automatically. Your audience behavior standards are applied consistently across all target markets.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents ensure localization quality across all markets — audience behavior is guaranteed globally.',
            detail: 'Localization QA agents validate every market adaptation autonomously against your audience behavior standards. You set quality criteria while the system enforces them at scale.',
          },
        },
        'segment-mapping': {
          preAI: {
            summary: 'Segment mapping is manual spreadsheet work with limited visibility into audience behavior impact.',
            detail: 'Mapping content variants to audience segments is done in spreadsheets. Your audience behavior data is disconnected from the personalization logic.',
          },
          aiAgents: {
            summary: 'AI agents map variants to segments using audience behavior data from the CDP.',
            detail: 'Segment agents recommend variant-audience matches based on your audience behavior signals. You review the mapping rather than building it manually in spreadsheets.',
          },
          aiAgentic: {
            summary: 'Autonomous segment agents map and optimize variant-audience matches using live audience behavior signals.',
            detail: 'Segment agents continuously refine variant-audience mappings based on real-time audience behavior data. You define segmentation strategy while the system executes and optimizes automatically.',
          },
        },
        'dynamic-assembly': {
          preAI: {
            summary: 'Dynamic content assembly is rigid and template-bound, limiting your audience behavior options.',
            detail: 'Personalized experiences require engineering support for each variant. Your audience behavior vision is constrained by inflexible assembly templates.',
          },
          aiAgents: {
            summary: 'AI assembly agents construct personalized experiences informed by audience behavior rules.',
            detail: 'Assembly agents combine content components per segment following your audience behavior logic. You define rules and review outputs rather than manually configuring each variant.',
          },
          aiAgentic: {
            summary: 'Autonomous assembly agents construct personalized experiences in real time — audience behavior logic is self-optimizing.',
            detail: 'Assembly agents build dynamic experiences per segment using your audience behavior rules and real-time behavioral signals. You govern personalization policies, not individual assembly configurations.',
          },
        },
        'personalization-qa': {
          preAI: {
            summary: 'Personalization QA is manual spot-checking that misses audience behavior gaps.',
            detail: 'Testing every segment-variant combination is impossible manually. Your audience behavior concerns are only caught when users report issues post-launch.',
          },
          aiAgents: {
            summary: 'AI QA agents validate personalization coverage and flag audience behavior gaps before launch.',
            detail: 'QA agents test every segment-variant combination against your audience behavior requirements. You review exception reports rather than manually spot-checking combinations.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents validate every personalization scenario — audience behavior gaps are caught before launch.',
            detail: 'Personalization QA agents test all segment-variant combinations against your audience behavior requirements automatically. You set acceptance criteria while the system validates at scale.',
          },
        },
        'campaign-planning': {
          preAI: {
            summary: 'Campaign planning is a manual coordination effort with fragmented audience behavior inputs.',
            detail: 'Campaign plans are built in decks and spreadsheets with incomplete data. Your audience behavior perspective is often incorporated too late in the planning cycle.',
          },
          aiAgents: {
            summary: 'AI planning agents draft campaign frameworks with audience behavior data pre-integrated.',
            detail: 'Planning agents pull audience, budget, and performance data into campaign templates. Your audience behavior priorities shape the plan from the start rather than being retrofitted.',
          },
          aiAgentic: {
            summary: 'Autonomous planning agents generate campaign frameworks using audience behavior intelligence — you set objectives.',
            detail: 'Planning agents produce data-driven campaign plans with your audience behavior priorities embedded. You define strategic goals while the system optimizes tactics and resource allocation.',
          },
        },
        'consent-check': {
          preAI: {
            summary: 'Consent checking is a manual compliance step that adds friction to your audience behavior process.',
            detail: 'Verifying GDPR/CCPA consent for targeting requires manual cross-referencing. Your audience behavior work is delayed while compliance status is manually confirmed.',
          },
          aiAgents: {
            summary: 'AI consent agents verify targeting compliance automatically, reducing audience behavior friction.',
            detail: 'Consent agents cross-reference CDP signals against GDPR/CCPA rules for your audience behavior needs. You handle exceptions rather than manually verifying every segment.',
          },
          aiAgentic: {
            summary: 'Autonomous consent agents enforce privacy compliance at scale — audience behavior is guaranteed by architecture.',
            detail: 'Consent agents verify targeting compliance in real time across all segments using your audience behavior framework. You set privacy policies while the system enforces them automatically.',
          },
        },
        'paid-creative-production': {
          preAI: {
            summary: 'Paid creative production runs separately from organic, fragmenting your audience behavior oversight.',
            detail: 'Ad creative and organic content are produced in silos. Your audience behavior perspective is applied inconsistently between paid and organic channels.',
          },
          aiAgents: {
            summary: 'AI production agents generate paid variants from organic content with audience behavior consistency.',
            detail: 'Paid creative agents adapt organic content for ad platforms following your audience behavior guidelines. You approve and fine-tune rather than producing ad creative from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous production agents create paid variants at scale within audience behavior guardrails — you set the strategy.',
            detail: 'Paid creative agents generate ad variants from organic content following your audience behavior guidelines. You define creative strategy while the system produces and optimizes at scale.',
          },
        },
        'attribution-modeling': {
          preAI: {
            summary: 'Attribution modeling is manual and unreliable, undermining your audience behavior reporting.',
            detail: 'Last-click attribution dominates despite its flaws. Your audience behavior decisions lack the multi-touch perspective needed for accurate performance assessment.',
          },
          aiAgents: {
            summary: 'AI attribution models surface multi-touch insights relevant to your audience behavior priorities.',
            detail: 'Attribution agents calculate content ROI across channels using your audience behavior weightings. You interpret strategic implications rather than building models manually.',
          },
          aiAgentic: {
            summary: 'Autonomous attribution agents run multi-touch models continuously — audience behavior insights update in real time.',
            detail: 'Attribution agents calculate content ROI across all channels using your audience behavior framework. You interpret strategic implications while the system handles modeling complexity.',
          },
        },
        'executive-reporting': {
          preAI: {
            summary: 'Executive reports are manually assembled, often missing the audience behavior narrative you need.',
            detail: 'Building executive dashboards takes hours of data wrangling. The audience behavior story you want to tell is lost in generic reporting templates.',
          },
          aiAgents: {
            summary: 'AI builds executive dashboards with audience behavior narratives pre-drafted for leadership.',
            detail: 'Reporting agents synthesize data into executive formats with your audience behavior story embedded. You refine the narrative rather than assembling data from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce executive dashboards with audience behavior narratives — you add strategic context.',
            detail: 'Executive reporting agents synthesize all data into leadership-ready formats with your audience behavior story embedded. You provide strategic commentary on auto-generated insights.',
          },
        },
        'competitive-response': {
          preAI: {
            summary: 'Competitive response is slow and reactive, giving you no audience behavior advantage.',
            detail: 'By the time you spot a competitor move and respond, the moment has passed. Your audience behavior approach cannot adapt fast enough to real-time competitive signals.',
          },
          aiAgents: {
            summary: 'AI competitive agents surface signals and draft responses aligned with audience behavior strategy.',
            detail: 'Competitive agents monitor market moves and suggest audience behavior-aligned responses. You approve and refine reactive content rather than spotting threats manually.',
          },
          aiAgentic: {
            summary: 'Autonomous competitive agents detect and draft responses in real time — audience behavior moves are countered instantly.',
            detail: 'Competitive agents monitor signals, draft responses, and deploy within your audience behavior guardrails. You approve high-stakes responses while routine reactions ship autonomously.',
          },
        },
        'content-governance': {
          preAI: {
            summary: 'Content governance is periodic manual auditing that cannot keep pace with your audience behavior standards.',
            detail: 'Live content drifts out of compliance between infrequent reviews. Your audience behavior requirements are only enforced when someone manually checks.',
          },
          aiAgents: {
            summary: 'AI governance agents continuously audit live content against audience behavior standards.',
            detail: 'Governance agents flag content drift, compliance gaps, and audience behavior issues in real time. You review flagged items rather than conducting manual audits.',
          },
          aiAgentic: {
            summary: 'Autonomous governance agents audit all live content continuously — audience behavior compliance is always current.',
            detail: 'Governance agents monitor every published piece against your audience behavior standards in real time. You evolve governance policies while the system enforces them perpetually.',
          },
        },
        'governance-gate': {
          preAI: {
            summary: 'Governance gates are calendar-driven checkpoints disconnected from your audience behavior rhythm.',
            detail: 'Governance reviews happen on a fixed schedule regardless of content velocity. Your audience behavior concerns may not surface until the next quarterly review.',
          },
          aiAgents: {
            summary: 'AI governance gates run continuous checks, surfacing audience behavior issues between formal reviews.',
            detail: 'Governance agents validate live content against your audience behavior criteria on an ongoing basis. You act on exception alerts rather than waiting for quarterly reviews.',
          },
          aiAgentic: {
            summary: 'Autonomous governance gates run continuously — audience behavior violations trigger immediate remediation.',
            detail: 'Governance agents validate live content against your audience behavior criteria continuously and auto-trigger refresh or retirement workflows. You set policies, not review schedules.',
          },
        },
        'journey-mapping': {
          preAI: {
            summary: 'Journey mapping is a manual exercise that rarely reflects your audience behavior reality.',
            detail: 'Customer journey maps are created in workshops and quickly go stale. Your audience behavior perspective is a snapshot, not a living view of how content performs at each stage.',
          },
          aiAgents: {
            summary: 'AI journey agents map content to lifecycle stages using audience behavior data from the CDP.',
            detail: 'Journey agents dynamically map content to customer stages based on your audience behavior framework. You validate the mapping rather than building it manually in workshops.',
          },
          aiAgentic: {
            summary: 'Autonomous journey agents maintain living maps using real-time audience behavior data — you shape the strategy.',
            detail: 'Journey agents dynamically map content to lifecycle stages using live audience behavior signals. You define journey frameworks while the system optimizes content placement continuously.',
          },
        },
        'sales-enablement': {
          preAI: {
            summary: 'Sales enablement content is created ad hoc, disconnected from your audience behavior strategy.',
            detail: 'Sales teams request materials outside the content pipeline. Your audience behavior standards are not applied to battle cards, decks, and one-pagers created in isolation.',
          },
          aiAgents: {
            summary: 'AI agents generate sales materials from marketing content with audience behavior alignment.',
            detail: 'Sales enablement agents transform marketing assets into battle cards and decks following your audience behavior standards. You approve rather than creating each piece manually.',
          },
          aiAgentic: {
            summary: 'Autonomous enablement agents keep sales materials current with audience behavior alignment — you set the playbook.',
            detail: 'Enablement agents automatically update battle cards, decks, and case studies as your audience behavior data evolves. You define the sales narrative while the system produces materials at scale.',
          },
        },
        'influencer-brief': {
          preAI: {
            summary: 'Influencer briefs are manual documents with limited audience behavior guardrails.',
            detail: 'Creator briefs are written from scratch each time. Your audience behavior guidelines are inconsistently communicated to external partners and influencers.',
          },
          aiAgents: {
            summary: 'AI agents draft influencer briefs with audience behavior guardrails embedded automatically.',
            detail: 'Brief agents generate creator guidelines from your audience behavior requirements and past successful collaborations. You customize rather than writing each brief from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous brief agents generate creator guidelines with audience behavior guardrails — you approve partnerships.',
            detail: 'Brief agents produce personalized influencer guidelines using your audience behavior framework and creator history. You focus on relationship strategy while briefs ship autonomously.',
          },
        },
        'ugc-moderation': {
          preAI: {
            summary: 'UGC moderation is manual screening that cannot scale to protect audience behavior.',
            detail: 'User-generated content is reviewed one piece at a time. Your audience behavior standards cannot be consistently enforced across the volume of submissions.',
          },
          aiAgents: {
            summary: 'AI moderation agents screen UGC for brand safety and audience behavior compliance at scale.',
            detail: 'Moderation agents filter user-generated content against your audience behavior criteria. You review borderline cases rather than manually screening every submission.',
          },
          aiAgentic: {
            summary: 'Autonomous moderation agents screen all UGC for audience behavior compliance at scale — you govern edge cases.',
            detail: 'Moderation agents filter user-generated content using your audience behavior rules continuously. You update moderation policies and review borderline cases that the system escalates.',
          },
        },
        'content-scoring': {
          preAI: {
            summary: 'Content scoring is subjective prioritization that underweights your audience behavior criteria.',
            detail: 'Requests are prioritized by loudest voice or executive fiat. Your audience behavior scoring criteria are rarely part of the formal prioritization framework.',
          },
          aiAgents: {
            summary: 'AI scoring agents rank requests using audience behavior criteria alongside strategic priority.',
            detail: 'Scoring agents weight your audience behavior factors into the prioritization algorithm. You adjust rankings rather than scoring each request manually.',
          },
          aiAgentic: {
            summary: 'Autonomous scoring agents prioritize the pipeline using audience behavior criteria — you set strategic weights.',
            detail: 'Scoring agents rank and route content requests using your audience behavior priorities in real time. You define scoring criteria and review the queue rather than manually triaging.',
          },
        },
        'channel-orchestration': {
          preAI: {
            summary: 'Channel orchestration is manual coordination with no systematic audience behavior integration.',
            detail: 'Cross-channel timing is managed in spreadsheets and Slack. Your audience behavior requirements for sequencing and coordination are often overridden by ad hoc changes.',
          },
          aiAgents: {
            summary: 'AI orchestration agents sequence distribution with audience behavior rules for timing and cadence.',
            detail: 'Orchestration agents coordinate cross-channel timing based on your audience behavior requirements. You set rules and review the sequence rather than managing each channel individually.',
          },
          aiAgentic: {
            summary: 'Autonomous orchestration agents manage all channel timing with audience behavior logic — you set the playbook.',
            detail: 'Orchestration agents handle cross-channel sequencing, timing, and coordination autonomously using your audience behavior rules. You evolve the orchestration strategy while the system executes.',
          },
        },
      },
      keyInsight: 'Audience personas are the most-referenced input in the entire graph. Keeping them accurate is the highest-leverage maintenance task in the system.',
    },
  },
  {
    id: 'consulting-dd',
    title: 'Consulting (Due Diligence)',
    description: 'External advisory role providing independent review across quality, brand, and strategic alignment gates.',
    tagline: 'Independent lens across three gates.',
    iconName: 'SearchCheck',
    category: 'growth',
    accentColor: '#3D9E42',
    ownedSteps: [],
    reviewedGates: ['quality-check', 'brand-review', 'stakeholder-signoff'],
    relatedAgents: ['writer-agent', 'seo-agent'],
    relatedInputs: ['brand-guide', 'content-strategy', 'audience-personas'],
    narrative: {
      nodeJourneys: {
        'quality-check': {
          preAI: {
            summary: 'You provide an independent quality assessment, checking whether internal standards are being applied consistently.',
            detail: 'Your reviews happen sequentially after internal quality checks. You catch patterns the internal team has normalized — quality blind spots.',
          },
          aiAgents: {
            summary: 'AI handles routine quality metrics — your review focuses on systemic quality trends invisible to individual reviewers.',
            detail: 'You spend less time on per-piece quality and more on whether the overall quality curve is improving or degrading.',
          },
          aiAgentic: {
            summary: 'Your cross-gate perspective catches quality drift that automated scores miss — trends only visible from outside.',
            detail: 'Internal teams optimize their own gate. You see whether "quality" means the same thing at the quality gate as it does at brand review. That cross-gate calibration is your unique value.',
          },
        },
        'brand-review': {
          preAI: {
            summary: 'You assess brand consistency from an external perspective, catching drift the internal team has grown accustomed to.',
            detail: 'Fresh eyes catch brand evolution that happens so gradually the internal team doesn\'t notice. Your periodic reviews provide a calibration checkpoint.',
          },
          aiAgents: {
            summary: 'Automated brand scoring handles consistency — you evaluate whether the brand is evolving in the right direction.',
            detail: 'Your reviews shift from compliance checking to strategic brand assessment. You answer whether the brand is growing or just staying consistent.',
          },
          aiAgentic: {
            summary: 'You audit the brand governance system itself, not individual content pieces.',
            detail: 'The system handles compliance. You evaluate whether the Brand Manager\'s rules still reflect market reality and competitive positioning.',
          },
        },
        'stakeholder-signoff': {
          preAI: {
            summary: 'You advise stakeholders on whether content aligns with strategic objectives, providing an independent sounding board.',
            detail: 'Stakeholder reviews benefit from your outsider perspective. You identify strategic gaps the internal team is too close to see.',
          },
          aiAgents: {
            summary: 'Pre-assembled strategic alignment data informs your advisory — you add judgment that requires cross-organizational context.',
            detail: 'Data makes your advice more precise. You see whether the content strategy actually connects to business outcomes, not just marketing metrics.',
          },
          aiAgentic: {
            summary: 'You sit across three gates, spotting systemic patterns that specialists in single gates miss entirely.',
            detail: 'You catch drift the Brand Manager normalized, quality trends the Editor overlooked, and strategic gaps the Content Director didn\'t flag. That cross-cutting view is irreplaceable.',
          },
        },
        'receive-request': {
          preAI: {
            summary: 'You evaluate incoming requests manually, sorting through emails and Slack messages for process maturity.',
            detail: 'Requests arrive in inconsistent formats with no standard intake process. You spend hours triaging and clarifying scope before process maturity can even begin.',
          },
          aiAgents: {
            summary: 'An AI intake agent structures requests and flags process maturity implications before they reach your queue.',
            detail: 'Requests arrive pre-categorized with process maturity signals highlighted. You validate and prioritize rather than manually parsing raw inputs.',
          },
          aiAgentic: {
            summary: 'Autonomous intake agents triage, validate, and route requests with process maturity logic — you govern exceptions.',
            detail: 'Agentic intake handles end-to-end request processing with your process maturity rules embedded. You set policies and review escalations while routine requests flow automatically.',
          },
        },
        'research-insights': {
          preAI: {
            summary: 'You gather audience and market research manually, compiling data from multiple sources for process maturity.',
            detail: 'Research is scattered across tools, reports, and tribal knowledge. Building a complete picture for process maturity takes days and the data is often stale by the time you use it.',
          },
          aiAgents: {
            summary: 'AI research tools surface audience and market data relevant to your process maturity needs automatically.',
            detail: 'Research agents pull relevant data from multiple sources and present process maturity insights in a structured format. You curate and interpret rather than gather.',
          },
          aiAgentic: {
            summary: 'Autonomous research agents continuously update process maturity intelligence — you set the strategic lens.',
            detail: 'Research agents proactively surface process maturity insights from market signals, audience data, and competitive movements. You shape research priorities, not execute searches.',
          },
        },
        'write-brief': {
          preAI: {
            summary: 'You wait for briefs written by hand, often lacking the process maturity detail you need.',
            detail: 'Briefs arrive incomplete or misaligned with your process maturity requirements. You spend cycles requesting revisions and clarifying expectations before work can proceed.',
          },
          aiAgents: {
            summary: 'AI drafts briefs with process maturity requirements pre-populated from templates and past projects.',
            detail: 'Brief generation agents pull your process maturity requirements into structured templates. You review and refine rather than starting from a blank page.',
          },
          aiAgentic: {
            summary: 'Autonomous agents generate complete briefs with process maturity alignment built in — you approve strategy.',
            detail: 'Brief agents produce publication-ready briefs that embed your process maturity requirements from historical patterns. You govern strategic direction rather than reviewing drafts.',
          },
        },
        'draft-content': {
          preAI: {
            summary: 'You review drafts created entirely by hand, checking each one for alignment with process maturity.',
            detail: 'First drafts vary wildly in quality and process maturity alignment. You often send content back for multiple revision cycles, creating bottlenecks in the pipeline.',
          },
          aiAgents: {
            summary: 'AI generates first drafts with process maturity guidelines embedded, reducing your revision cycles.',
            detail: 'Drafting agents produce content aligned with your process maturity standards from the start. You focus on strategic refinement rather than basic corrections.',
          },
          aiAgentic: {
            summary: 'Autonomous drafting agents produce content meeting process maturity standards — you set creative direction.',
            detail: 'Drafting agents generate content that passes your process maturity criteria automatically. You focus on strategic vision and creative differentiation rather than quality control.',
          },
        },
        'seo-optimization': {
          preAI: {
            summary: 'SEO optimization is manual and disconnected from your process maturity priorities.',
            detail: 'Keyword research and meta optimization happen separately from your process maturity workflow. You rarely see SEO data until after content is already in review.',
          },
          aiAgents: {
            summary: 'AI SEO tools optimize content while preserving your process maturity priorities.',
            detail: 'SEO agents suggest keywords and meta improvements that align with your process maturity goals. You approve optimizations rather than manually researching keywords.',
          },
          aiAgentic: {
            summary: 'Autonomous SEO agents optimize continuously within process maturity boundaries — you define the strategy.',
            detail: 'SEO agents self-optimize content based on real-time search signals and your process maturity guardrails. You set strategic keywords and constraints, not individual page optimizations.',
          },
        },
        'brand-compliance': {
          preAI: {
            summary: 'Brand checks are subjective and slow, creating delays in your process maturity workflow.',
            detail: 'Brand reviewers interpret guidelines differently. Inconsistent enforcement of tone, terminology, and messaging means process maturity is harder to maintain at scale.',
          },
          aiAgents: {
            summary: 'AI brand checkers flag violations and score process maturity alignment before human review.',
            detail: 'Brand agents scan content against guidelines and highlight process maturity issues. You make judgment calls on edge cases rather than catching basic violations.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents enforce compliance at scale with process maturity rules — you update the rulebook.',
            detail: 'Brand agents apply and evolve compliance checks across all content automatically. Your process maturity standards are codified as machine-enforceable rules that you govern and refine.',
          },
        },
        'final-edit': {
          preAI: {
            summary: 'Final edits depend entirely on editor availability, blocking your process maturity timelines.',
            detail: 'A single editor bottleneck means content waits in queue. Your process maturity deadlines slip because there is no way to parallelize the final polish step.',
          },
          aiAgents: {
            summary: 'AI editing assistants handle mechanical fixes, freeing your process maturity focus for strategic polish.',
            detail: 'Editing agents catch grammar, style, and consistency issues automatically. Your process maturity perspective is reserved for nuance and narrative quality.',
          },
          aiAgentic: {
            summary: 'Autonomous editing agents polish content to publication standard — your process maturity bar is encoded as policy.',
            detail: 'Editing agents handle all mechanical and stylistic refinement autonomously. Your process maturity standards are embedded as editorial policies that improve with each iteration.',
          },
        },
        'schedule-publish': {
          preAI: {
            summary: 'Publishing is a manual CMS process with no connection to your process maturity planning.',
            detail: 'Each piece requires manual scheduling, metadata entry, and CMS configuration. Your process maturity goals are disconnected from the publish timeline.',
          },
          aiAgents: {
            summary: 'AI scheduling agents suggest optimal publish timing based on process maturity data.',
            detail: 'Publishing agents recommend times and configurations informed by your process maturity priorities. You approve the schedule rather than manually configuring CMS settings.',
          },
          aiAgentic: {
            summary: 'Autonomous publishing agents manage scheduling end-to-end using process maturity optimization logic.',
            detail: 'Publishing agents handle CMS configuration, timing optimization, and deployment autonomously within your process maturity constraints. You set publishing policies, not individual schedules.',
          },
        },
        'distribute': {
          preAI: {
            summary: 'Content distribution is manual channel-by-channel, with limited visibility into process maturity.',
            detail: 'Each channel requires separate formatting, scheduling, and posting. There is no unified view of how distribution supports your process maturity objectives.',
          },
          aiAgents: {
            summary: 'AI distribution agents adapt content per channel with process maturity rules built in.',
            detail: 'Distribution agents format and deploy content across channels following your process maturity guidelines. You monitor and adjust rather than manually posting to each platform.',
          },
          aiAgentic: {
            summary: 'Autonomous distribution agents manage all channels with process maturity rules — you govern the playbook.',
            detail: 'Distribution agents deploy, adapt, and optimize content across every channel following your process maturity playbook. You evolve distribution strategy, not execute individual channel posts.',
          },
        },
        'track-performance': {
          preAI: {
            summary: 'Performance tracking is fragmented across tools, making process maturity assessment difficult.',
            detail: 'You pull data from analytics dashboards, social platforms, and CRM separately. Building a complete picture for process maturity requires manual data stitching.',
          },
          aiAgents: {
            summary: 'AI dashboards surface process maturity metrics in real time without manual data pulling.',
            detail: 'Performance agents aggregate data and highlight the process maturity signals that matter to you. You analyze trends rather than building dashboards from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous tracking agents monitor process maturity metrics continuously and trigger alerts and actions.',
            detail: 'Performance agents stream process maturity data and automatically trigger optimization workflows when thresholds are breached. You define KPIs and review strategic implications.',
          },
        },
        'generate-report': {
          preAI: {
            summary: 'Reports are built manually in spreadsheets, often missing the process maturity metrics you need.',
            detail: 'Report creation takes hours of data gathering and formatting. The metrics that matter for process maturity are often buried or missing entirely from standard templates.',
          },
          aiAgents: {
            summary: 'AI generates reports with process maturity metrics pre-formatted and insights highlighted.',
            detail: 'Reporting agents compile your process maturity data into structured templates with automated analysis. You add strategic narrative rather than wrangling data.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce process maturity reports on demand with strategic recommendations.',
            detail: 'Reporting agents generate process maturity analyses with actionable recommendations automatically. You consume insights and set strategic direction rather than producing reports.',
          },
        },
        'optimize': {
          preAI: {
            summary: 'Content optimization is reactive and slow, with limited connection to process maturity data.',
            detail: 'Optimization decisions rely on gut feel and delayed data. Your process maturity insights rarely feed back into content updates in a timely way.',
          },
          aiAgents: {
            summary: 'AI recommends optimizations based on process maturity signals and historical performance.',
            detail: 'Optimization agents suggest specific changes tied to your process maturity metrics. You approve and prioritize recommendations rather than diagnosing issues manually.',
          },
          aiAgentic: {
            summary: 'Autonomous optimization agents improve content continuously using process maturity signals — you set boundaries.',
            detail: 'Optimization agents test, iterate, and improve content based on process maturity data within your guardrails. You define acceptable ranges and review significant changes.',
          },
        },
        'brief-approval': {
          preAI: {
            summary: 'Brief approvals are bottlenecked by manual review cycles that delay your process maturity work.',
            detail: 'You wait for briefs to pass through approval chains before your process maturity tasks can begin. Unclear approval criteria mean briefs bounce back and forth repeatedly.',
          },
          aiAgents: {
            summary: 'AI pre-screens briefs for process maturity alignment, routing only exceptions to you.',
            detail: 'Approval agents check briefs against your process maturity criteria and flag gaps. You review flagged items rather than reading every brief end to end.',
          },
          aiAgentic: {
            summary: 'Autonomous approval agents clear standard briefs and escalate only process maturity exceptions to you.',
            detail: 'Approval agents validate briefs against your process maturity criteria and auto-approve routine requests. You handle strategic exceptions and edge cases only.',
          },
        },
        'performance-review': {
          preAI: {
            summary: 'Performance reviews are infrequent manual assessments that underserve your process maturity needs.',
            detail: 'Reviews happen quarterly at best, using outdated data. Your process maturity perspective is often missing from the evaluation criteria entirely.',
          },
          aiAgents: {
            summary: 'AI evaluates content against KPIs and highlights process maturity trends for your review.',
            detail: 'Review agents surface performance data with process maturity context pre-attached. You make optimize/archive decisions based on structured analysis rather than raw metrics.',
          },
          aiAgentic: {
            summary: 'Autonomous review agents evaluate and act on performance with process maturity logic — you set the framework.',
            detail: 'Review agents continuously assess content against your process maturity KPIs and trigger optimize/refresh/archive workflows automatically. You define the evaluation framework.',
          },
        },
        'social-listening': {
          preAI: {
            summary: 'Social listening is ad hoc keyword monitoring with no systematic link to process maturity.',
            detail: 'You check social platforms manually for relevant conversations. Insights rarely reach your process maturity workflow before they become stale or irrelevant.',
          },
          aiAgents: {
            summary: 'AI monitoring tools surface trending topics and sentiment relevant to process maturity in real time.',
            detail: 'Listening agents track conversations and flag process maturity signals across platforms. You act on curated insights rather than monitoring feeds manually.',
          },
          aiAgentic: {
            summary: 'Autonomous listening agents track and respond to process maturity signals across all platforms in real time.',
            detail: 'Listening agents monitor social channels and proactively surface process maturity opportunities and risks. You set monitoring priorities and review strategic findings.',
          },
        },
        'visual-asset-creation': {
          preAI: {
            summary: 'Visual asset creation is a slow design queue disconnected from your process maturity needs.',
            detail: 'Design requests go into a backlog with unclear priorities. Your process maturity requirements are often lost in translation between brief and final asset.',
          },
          aiAgents: {
            summary: 'AI design tools generate asset options aligned with process maturity requirements.',
            detail: 'Design agents produce visual variants following your process maturity guidelines. You select and refine from AI-generated options rather than directing from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous design agents produce visual assets within process maturity guidelines — you set creative direction.',
            detail: 'Design agents generate publication-ready visuals following your process maturity standards. You define the creative vision and approve hero assets while routine visuals ship autonomously.',
          },
        },
        'legal-review': {
          preAI: {
            summary: 'Legal review is an opaque process that creates unpredictable delays in your process maturity work.',
            detail: 'Legal feedback arrives late with minimal context. You cannot predict how long review will take, making process maturity planning unreliable.',
          },
          aiAgents: {
            summary: 'AI legal screening flags compliance risks early, reducing process maturity surprises downstream.',
            detail: 'Legal agents pre-scan content for regulatory issues and process maturity risks. You get early warnings rather than discovering problems at the sign-off stage.',
          },
          aiAgentic: {
            summary: 'Autonomous legal agents clear routine content and escalate only true process maturity risks to human counsel.',
            detail: 'Legal agents scan and clear standard content autonomously using your process maturity rule framework. Human lawyers handle novel risk scenarios and precedent-setting decisions only.',
          },
        },
        'accessibility-check': {
          preAI: {
            summary: 'Accessibility checking is a manual afterthought, rarely connected to your process maturity process.',
            detail: 'WCAG compliance and inclusive language reviews happen late in the pipeline. Your process maturity work is already done when accessibility issues force rework.',
          },
          aiAgents: {
            summary: 'AI accessibility tools catch WCAG violations automatically, protecting your process maturity standards.',
            detail: 'Accessibility agents scan for inclusive language and alt-text compliance. Your process maturity requirements benefit from automated baseline checks before human review.',
          },
          aiAgentic: {
            summary: 'Autonomous accessibility agents enforce WCAG and inclusive standards — process maturity is guaranteed by default.',
            detail: 'Accessibility agents ensure all content meets compliance standards before publication. Your process maturity benefits from guaranteed accessibility without manual checking overhead.',
          },
        },
        'localize-content': {
          preAI: {
            summary: 'Localization is a slow, manual translation process that delays your process maturity for global markets.',
            detail: 'Each market requires separate translation, cultural review, and compliance checking. Your process maturity suffers because localized versions lag weeks behind the original.',
          },
          aiAgents: {
            summary: 'AI translation agents accelerate localization while respecting process maturity requirements.',
            detail: 'Localization agents produce initial translations with process maturity context preserved. You review for cultural nuance rather than translating from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous localization agents adapt content for all markets simultaneously — your process maturity scales globally.',
            detail: 'Localization agents handle translation, cultural adaptation, and regional compliance autonomously. Your process maturity is maintained across markets without manual per-locale effort.',
          },
        },
        'ab-variant-creation': {
          preAI: {
            summary: 'A/B variants are created manually with limited connection to your process maturity hypotheses.',
            detail: 'Test variants rely on guesswork rather than data. Your process maturity insights rarely inform variant design, reducing the value of testing efforts.',
          },
          aiAgents: {
            summary: 'AI generates test variants informed by process maturity data and historical performance.',
            detail: 'Variant agents create headlines, CTAs, and imagery options based on your process maturity hypotheses. You select winning approaches rather than brainstorming from zero.',
          },
          aiAgentic: {
            summary: 'Autonomous variant agents design, deploy, and learn from tests using process maturity hypotheses — you set the agenda.',
            detail: 'Variant agents run continuous testing experiments informed by your process maturity objectives. You define what to test and review strategic learnings while the system iterates autonomously.',
          },
        },
        'content-repurposing': {
          preAI: {
            summary: 'Content repurposing is manual reformatting, disconnected from your process maturity goals.',
            detail: 'Each derivative asset is created from scratch. Your process maturity requirements are not systematically applied when repurposing content across formats.',
          },
          aiAgents: {
            summary: 'AI repurposing agents derive secondary assets with process maturity consistency built in.',
            detail: 'Repurposing agents transform primary content into channel-specific formats following your process maturity guidelines. You approve derivatives rather than recreating each manually.',
          },
          aiAgentic: {
            summary: 'Autonomous repurposing agents derive all secondary assets automatically within process maturity guidelines.',
            detail: 'Repurposing agents transform primary content into every derivative format following your process maturity rules. You set format strategy while the system handles production at scale.',
          },
        },
        'archive-tag': {
          preAI: {
            summary: 'Content archiving is inconsistent, making process maturity-related retrieval nearly impossible.',
            detail: 'Tagging and taxonomy are applied inconsistently or not at all. Finding past content relevant to process maturity requires searching through unstructured repositories.',
          },
          aiAgents: {
            summary: 'AI tagging agents classify content automatically, making process maturity retrieval faster.',
            detail: 'Archive agents apply taxonomy and metadata based on your process maturity categories. You validate classifications rather than manually tagging every asset.',
          },
          aiAgentic: {
            summary: 'Autonomous archive agents maintain perfect taxonomy — process maturity retrieval is instant and reliable.',
            detail: 'Archive agents classify, tag, and organize all content using your process maturity taxonomy automatically. You evolve the taxonomy structure while the system maintains it flawlessly.',
          },
        },
        'legal-compliance-gate': {
          preAI: {
            summary: 'Legal compliance gates create unpredictable holds that delay your process maturity deadlines.',
            detail: 'Legal sign-off timing is opaque and variable. Your process maturity timelines are at the mercy of legal review queues with no visibility into status.',
          },
          aiAgents: {
            summary: 'AI pre-screening reduces legal gate delays by resolving routine process maturity checks automatically.',
            detail: 'Compliance agents handle standard checks and only escalate process maturity edge cases to human lawyers. Your timelines are more predictable because routine items clear faster.',
          },
          aiAgentic: {
            summary: 'Autonomous compliance gates clear routine content instantly — only novel process maturity risks reach human lawyers.',
            detail: 'Compliance agents handle standard legal checks autonomously using your process maturity risk framework. Human review is reserved for unprecedented scenarios and policy updates.',
          },
        },
        'localization-quality-gate': {
          preAI: {
            summary: 'Localization quality gates are inconsistent, creating process maturity risks in global markets.',
            detail: 'Quality checks for localized content vary by market and reviewer. Your process maturity standards are unevenly applied across regions and languages.',
          },
          aiAgents: {
            summary: 'AI quality checks catch translation errors before they affect your process maturity outcomes.',
            detail: 'Localization QA agents verify accuracy and cultural fit automatically. Your process maturity standards are applied consistently across all target markets.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents ensure localization quality across all markets — process maturity is guaranteed globally.',
            detail: 'Localization QA agents validate every market adaptation autonomously against your process maturity standards. You set quality criteria while the system enforces them at scale.',
          },
        },
        'segment-mapping': {
          preAI: {
            summary: 'Segment mapping is manual spreadsheet work with limited visibility into process maturity impact.',
            detail: 'Mapping content variants to audience segments is done in spreadsheets. Your process maturity data is disconnected from the personalization logic.',
          },
          aiAgents: {
            summary: 'AI agents map variants to segments using process maturity data from the CDP.',
            detail: 'Segment agents recommend variant-audience matches based on your process maturity signals. You review the mapping rather than building it manually in spreadsheets.',
          },
          aiAgentic: {
            summary: 'Autonomous segment agents map and optimize variant-audience matches using live process maturity signals.',
            detail: 'Segment agents continuously refine variant-audience mappings based on real-time process maturity data. You define segmentation strategy while the system executes and optimizes automatically.',
          },
        },
        'dynamic-assembly': {
          preAI: {
            summary: 'Dynamic content assembly is rigid and template-bound, limiting your process maturity options.',
            detail: 'Personalized experiences require engineering support for each variant. Your process maturity vision is constrained by inflexible assembly templates.',
          },
          aiAgents: {
            summary: 'AI assembly agents construct personalized experiences informed by process maturity rules.',
            detail: 'Assembly agents combine content components per segment following your process maturity logic. You define rules and review outputs rather than manually configuring each variant.',
          },
          aiAgentic: {
            summary: 'Autonomous assembly agents construct personalized experiences in real time — process maturity logic is self-optimizing.',
            detail: 'Assembly agents build dynamic experiences per segment using your process maturity rules and real-time behavioral signals. You govern personalization policies, not individual assembly configurations.',
          },
        },
        'personalization-qa': {
          preAI: {
            summary: 'Personalization QA is manual spot-checking that misses process maturity gaps.',
            detail: 'Testing every segment-variant combination is impossible manually. Your process maturity concerns are only caught when users report issues post-launch.',
          },
          aiAgents: {
            summary: 'AI QA agents validate personalization coverage and flag process maturity gaps before launch.',
            detail: 'QA agents test every segment-variant combination against your process maturity requirements. You review exception reports rather than manually spot-checking combinations.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents validate every personalization scenario — process maturity gaps are caught before launch.',
            detail: 'Personalization QA agents test all segment-variant combinations against your process maturity requirements automatically. You set acceptance criteria while the system validates at scale.',
          },
        },
        'campaign-planning': {
          preAI: {
            summary: 'Campaign planning is a manual coordination effort with fragmented process maturity inputs.',
            detail: 'Campaign plans are built in decks and spreadsheets with incomplete data. Your process maturity perspective is often incorporated too late in the planning cycle.',
          },
          aiAgents: {
            summary: 'AI planning agents draft campaign frameworks with process maturity data pre-integrated.',
            detail: 'Planning agents pull audience, budget, and performance data into campaign templates. Your process maturity priorities shape the plan from the start rather than being retrofitted.',
          },
          aiAgentic: {
            summary: 'Autonomous planning agents generate campaign frameworks using process maturity intelligence — you set objectives.',
            detail: 'Planning agents produce data-driven campaign plans with your process maturity priorities embedded. You define strategic goals while the system optimizes tactics and resource allocation.',
          },
        },
        'consent-check': {
          preAI: {
            summary: 'Consent checking is a manual compliance step that adds friction to your process maturity process.',
            detail: 'Verifying GDPR/CCPA consent for targeting requires manual cross-referencing. Your process maturity work is delayed while compliance status is manually confirmed.',
          },
          aiAgents: {
            summary: 'AI consent agents verify targeting compliance automatically, reducing process maturity friction.',
            detail: 'Consent agents cross-reference CDP signals against GDPR/CCPA rules for your process maturity needs. You handle exceptions rather than manually verifying every segment.',
          },
          aiAgentic: {
            summary: 'Autonomous consent agents enforce privacy compliance at scale — process maturity is guaranteed by architecture.',
            detail: 'Consent agents verify targeting compliance in real time across all segments using your process maturity framework. You set privacy policies while the system enforces them automatically.',
          },
        },
        'paid-creative-production': {
          preAI: {
            summary: 'Paid creative production runs separately from organic, fragmenting your process maturity oversight.',
            detail: 'Ad creative and organic content are produced in silos. Your process maturity perspective is applied inconsistently between paid and organic channels.',
          },
          aiAgents: {
            summary: 'AI production agents generate paid variants from organic content with process maturity consistency.',
            detail: 'Paid creative agents adapt organic content for ad platforms following your process maturity guidelines. You approve and fine-tune rather than producing ad creative from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous production agents create paid variants at scale within process maturity guardrails — you set the strategy.',
            detail: 'Paid creative agents generate ad variants from organic content following your process maturity guidelines. You define creative strategy while the system produces and optimizes at scale.',
          },
        },
        'attribution-modeling': {
          preAI: {
            summary: 'Attribution modeling is manual and unreliable, undermining your process maturity reporting.',
            detail: 'Last-click attribution dominates despite its flaws. Your process maturity decisions lack the multi-touch perspective needed for accurate performance assessment.',
          },
          aiAgents: {
            summary: 'AI attribution models surface multi-touch insights relevant to your process maturity priorities.',
            detail: 'Attribution agents calculate content ROI across channels using your process maturity weightings. You interpret strategic implications rather than building models manually.',
          },
          aiAgentic: {
            summary: 'Autonomous attribution agents run multi-touch models continuously — process maturity insights update in real time.',
            detail: 'Attribution agents calculate content ROI across all channels using your process maturity framework. You interpret strategic implications while the system handles modeling complexity.',
          },
        },
        'executive-reporting': {
          preAI: {
            summary: 'Executive reports are manually assembled, often missing the process maturity narrative you need.',
            detail: 'Building executive dashboards takes hours of data wrangling. The process maturity story you want to tell is lost in generic reporting templates.',
          },
          aiAgents: {
            summary: 'AI builds executive dashboards with process maturity narratives pre-drafted for leadership.',
            detail: 'Reporting agents synthesize data into executive formats with your process maturity story embedded. You refine the narrative rather than assembling data from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce executive dashboards with process maturity narratives — you add strategic context.',
            detail: 'Executive reporting agents synthesize all data into leadership-ready formats with your process maturity story embedded. You provide strategic commentary on auto-generated insights.',
          },
        },
        'competitive-response': {
          preAI: {
            summary: 'Competitive response is slow and reactive, giving you no process maturity advantage.',
            detail: 'By the time you spot a competitor move and respond, the moment has passed. Your process maturity approach cannot adapt fast enough to real-time competitive signals.',
          },
          aiAgents: {
            summary: 'AI competitive agents surface signals and draft responses aligned with process maturity strategy.',
            detail: 'Competitive agents monitor market moves and suggest process maturity-aligned responses. You approve and refine reactive content rather than spotting threats manually.',
          },
          aiAgentic: {
            summary: 'Autonomous competitive agents detect and draft responses in real time — process maturity moves are countered instantly.',
            detail: 'Competitive agents monitor signals, draft responses, and deploy within your process maturity guardrails. You approve high-stakes responses while routine reactions ship autonomously.',
          },
        },
        'content-governance': {
          preAI: {
            summary: 'Content governance is periodic manual auditing that cannot keep pace with your process maturity standards.',
            detail: 'Live content drifts out of compliance between infrequent reviews. Your process maturity requirements are only enforced when someone manually checks.',
          },
          aiAgents: {
            summary: 'AI governance agents continuously audit live content against process maturity standards.',
            detail: 'Governance agents flag content drift, compliance gaps, and process maturity issues in real time. You review flagged items rather than conducting manual audits.',
          },
          aiAgentic: {
            summary: 'Autonomous governance agents audit all live content continuously — process maturity compliance is always current.',
            detail: 'Governance agents monitor every published piece against your process maturity standards in real time. You evolve governance policies while the system enforces them perpetually.',
          },
        },
        'governance-gate': {
          preAI: {
            summary: 'Governance gates are calendar-driven checkpoints disconnected from your process maturity rhythm.',
            detail: 'Governance reviews happen on a fixed schedule regardless of content velocity. Your process maturity concerns may not surface until the next quarterly review.',
          },
          aiAgents: {
            summary: 'AI governance gates run continuous checks, surfacing process maturity issues between formal reviews.',
            detail: 'Governance agents validate live content against your process maturity criteria on an ongoing basis. You act on exception alerts rather than waiting for quarterly reviews.',
          },
          aiAgentic: {
            summary: 'Autonomous governance gates run continuously — process maturity violations trigger immediate remediation.',
            detail: 'Governance agents validate live content against your process maturity criteria continuously and auto-trigger refresh or retirement workflows. You set policies, not review schedules.',
          },
        },
        'journey-mapping': {
          preAI: {
            summary: 'Journey mapping is a manual exercise that rarely reflects your process maturity reality.',
            detail: 'Customer journey maps are created in workshops and quickly go stale. Your process maturity perspective is a snapshot, not a living view of how content performs at each stage.',
          },
          aiAgents: {
            summary: 'AI journey agents map content to lifecycle stages using process maturity data from the CDP.',
            detail: 'Journey agents dynamically map content to customer stages based on your process maturity framework. You validate the mapping rather than building it manually in workshops.',
          },
          aiAgentic: {
            summary: 'Autonomous journey agents maintain living maps using real-time process maturity data — you shape the strategy.',
            detail: 'Journey agents dynamically map content to lifecycle stages using live process maturity signals. You define journey frameworks while the system optimizes content placement continuously.',
          },
        },
        'sentiment-monitoring': {
          preAI: {
            summary: 'Sentiment monitoring is sporadic manual checking with no systematic link to process maturity.',
            detail: 'You check brand sentiment reactively rather than proactively. Your process maturity decisions are made without real-time audience feedback signals.',
          },
          aiAgents: {
            summary: 'AI sentiment agents track brand reception in real time, alerting you to process maturity risks.',
            detail: 'Sentiment agents analyze audience reactions and flag process maturity concerns before they escalate. You respond to alerts rather than manually checking platforms.',
          },
          aiAgentic: {
            summary: 'Autonomous sentiment agents monitor and respond to process maturity signals around the clock — you govern escalation.',
            detail: 'Sentiment agents track audience reactions and trigger process maturity responses automatically. You set escalation thresholds and review strategic implications of sentiment shifts.',
          },
        },
        'sales-enablement': {
          preAI: {
            summary: 'Sales enablement content is created ad hoc, disconnected from your process maturity strategy.',
            detail: 'Sales teams request materials outside the content pipeline. Your process maturity standards are not applied to battle cards, decks, and one-pagers created in isolation.',
          },
          aiAgents: {
            summary: 'AI agents generate sales materials from marketing content with process maturity alignment.',
            detail: 'Sales enablement agents transform marketing assets into battle cards and decks following your process maturity standards. You approve rather than creating each piece manually.',
          },
          aiAgentic: {
            summary: 'Autonomous enablement agents keep sales materials current with process maturity alignment — you set the playbook.',
            detail: 'Enablement agents automatically update battle cards, decks, and case studies as your process maturity data evolves. You define the sales narrative while the system produces materials at scale.',
          },
        },
        'influencer-brief': {
          preAI: {
            summary: 'Influencer briefs are manual documents with limited process maturity guardrails.',
            detail: 'Creator briefs are written from scratch each time. Your process maturity guidelines are inconsistently communicated to external partners and influencers.',
          },
          aiAgents: {
            summary: 'AI agents draft influencer briefs with process maturity guardrails embedded automatically.',
            detail: 'Brief agents generate creator guidelines from your process maturity requirements and past successful collaborations. You customize rather than writing each brief from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous brief agents generate creator guidelines with process maturity guardrails — you approve partnerships.',
            detail: 'Brief agents produce personalized influencer guidelines using your process maturity framework and creator history. You focus on relationship strategy while briefs ship autonomously.',
          },
        },
        'ugc-moderation': {
          preAI: {
            summary: 'UGC moderation is manual screening that cannot scale to protect process maturity.',
            detail: 'User-generated content is reviewed one piece at a time. Your process maturity standards cannot be consistently enforced across the volume of submissions.',
          },
          aiAgents: {
            summary: 'AI moderation agents screen UGC for brand safety and process maturity compliance at scale.',
            detail: 'Moderation agents filter user-generated content against your process maturity criteria. You review borderline cases rather than manually screening every submission.',
          },
          aiAgentic: {
            summary: 'Autonomous moderation agents screen all UGC for process maturity compliance at scale — you govern edge cases.',
            detail: 'Moderation agents filter user-generated content using your process maturity rules continuously. You update moderation policies and review borderline cases that the system escalates.',
          },
        },
        'content-scoring': {
          preAI: {
            summary: 'Content scoring is subjective prioritization that underweights your process maturity criteria.',
            detail: 'Requests are prioritized by loudest voice or executive fiat. Your process maturity scoring criteria are rarely part of the formal prioritization framework.',
          },
          aiAgents: {
            summary: 'AI scoring agents rank requests using process maturity criteria alongside strategic priority.',
            detail: 'Scoring agents weight your process maturity factors into the prioritization algorithm. You adjust rankings rather than scoring each request manually.',
          },
          aiAgentic: {
            summary: 'Autonomous scoring agents prioritize the pipeline using process maturity criteria — you set strategic weights.',
            detail: 'Scoring agents rank and route content requests using your process maturity priorities in real time. You define scoring criteria and review the queue rather than manually triaging.',
          },
        },
        'channel-orchestration': {
          preAI: {
            summary: 'Channel orchestration is manual coordination with no systematic process maturity integration.',
            detail: 'Cross-channel timing is managed in spreadsheets and Slack. Your process maturity requirements for sequencing and coordination are often overridden by ad hoc changes.',
          },
          aiAgents: {
            summary: 'AI orchestration agents sequence distribution with process maturity rules for timing and cadence.',
            detail: 'Orchestration agents coordinate cross-channel timing based on your process maturity requirements. You set rules and review the sequence rather than managing each channel individually.',
          },
          aiAgentic: {
            summary: 'Autonomous orchestration agents manage all channel timing with process maturity logic — you set the playbook.',
            detail: 'Orchestration agents handle cross-channel sequencing, timing, and coordination autonomously using your process maturity rules. You evolve the orchestration strategy while the system executes.',
          },
        },
      },
      keyInsight: 'The independent, cross-cutting perspective is what makes this role valuable. Specialists optimize their gate; you optimize the system.',
    },
  },
  {
    id: 'legal-counsel',
    title: 'Legal Counsel',
    description: 'Owns the legal review step and approves content through the legal compliance gate. Responsible for regulatory risk, IP clearance, and disclosure requirements.',
    tagline: 'Clears legal risk before anything ships.',
    iconName: 'Scale',
    category: 'governance',
    accentColor: '#C97A5A',
    ownedSteps: ['legal-review'],
    reviewedGates: ['legal-compliance-gate'],
    relatedAgents: ['legal-screening-agent', 'governance-agent'],
    relatedInputs: ['legal-guidelines', 'approval-matrix'],
    narrative: {
      nodeJourneys: {
        'legal-review': {
          preAI: {
            summary: 'You review every content piece for claims, disclosures, competitor references, and regulated terminology.',
            detail: 'Most reviews are routine clearances that rarely surface issues. But skipping a review is never an option because the downside risk is regulatory.',
          },
          aiAgents: {
            summary: 'A legal screening agent pre-scans for regulated terms, unsubstantiated claims, and missing disclosures.',
            detail: 'Routine compliance is automated. You see only the content that fails the first pass — gray areas where legal precedent matters more than pattern matching.',
          },
          aiAgentic: {
            summary: 'Legal screening runs continuously during content creation — violations are flagged before a draft is even complete.',
            detail: 'The system catches issues upstream instead of at your gate. Your review time shifts from scanning for obvious violations to evaluating nuanced regulatory questions.',
          },
        },
        'legal-compliance-gate': {
          preAI: {
            summary: 'You staff the legal gate personally, clearing each piece before it can proceed to publication.',
            detail: 'Your availability is a hard constraint. No content publishes without your explicit approval, which makes your calendar a pipeline bottleneck.',
          },
          aiAgents: {
            summary: 'The gate auto-passes content that clears automated screening — you review only flagged items.',
            detail: 'Clear-cut compliance decisions happen without you. Your reviews focus on genuinely ambiguous cases where regulatory interpretation matters.',
          },
          aiAgentic: {
            summary: 'Legal compliance is a continuous system check — the agent blocks publication until cleared, no override possible.',
            detail: 'No agent in the system can override a legal hold. Your governance role is non-negotiable by design, and the system enforces that automatically.',
          },
        },
        'receive-request': {
          preAI: {
            summary: 'You review incoming requests manually, sorting through emails and Slack messages for regulatory compliance.',
            detail: 'Requests arrive in inconsistent formats with no standard intake process. You spend hours triaging and clarifying scope before regulatory compliance can even begin.',
          },
          aiAgents: {
            summary: 'An AI intake agent structures requests and flags regulatory compliance implications before they reach your queue.',
            detail: 'Requests arrive pre-categorized with regulatory compliance signals highlighted. You validate and prioritize rather than manually parsing raw inputs.',
          },
          aiAgentic: {
            summary: 'Autonomous intake agents triage, validate, and route requests with regulatory compliance logic — you govern exceptions.',
            detail: 'Agentic intake handles end-to-end request processing with your regulatory compliance rules embedded. You set policies and review escalations while routine requests flow automatically.',
          },
        },
        'research-insights': {
          preAI: {
            summary: 'You gather audience and market research manually, compiling data from multiple sources for regulatory compliance.',
            detail: 'Research is scattered across tools, reports, and tribal knowledge. Building a complete picture for regulatory compliance takes days and the data is often stale by the time you use it.',
          },
          aiAgents: {
            summary: 'AI research tools surface audience and market data relevant to your regulatory compliance needs automatically.',
            detail: 'Research agents pull relevant data from multiple sources and present regulatory compliance insights in a structured format. You curate and interpret rather than gather.',
          },
          aiAgentic: {
            summary: 'Autonomous research agents continuously update regulatory compliance intelligence — you set the strategic lens.',
            detail: 'Research agents proactively surface regulatory compliance insights from market signals, audience data, and competitive movements. You shape research priorities, not execute searches.',
          },
        },
        'write-brief': {
          preAI: {
            summary: 'You wait for briefs written by hand, often lacking the regulatory compliance detail you need.',
            detail: 'Briefs arrive incomplete or misaligned with your regulatory compliance requirements. You spend cycles requesting revisions and clarifying expectations before work can proceed.',
          },
          aiAgents: {
            summary: 'AI drafts briefs with regulatory compliance requirements pre-populated from templates and past projects.',
            detail: 'Brief generation agents pull your regulatory compliance requirements into structured templates. You review and refine rather than starting from a blank page.',
          },
          aiAgentic: {
            summary: 'Autonomous agents generate complete briefs with regulatory compliance alignment built in — you approve strategy.',
            detail: 'Brief agents produce publication-ready briefs that embed your regulatory compliance requirements from historical patterns. You govern strategic direction rather than reviewing drafts.',
          },
        },
        'draft-content': {
          preAI: {
            summary: 'You review drafts created entirely by hand, checking each one for alignment with regulatory compliance.',
            detail: 'First drafts vary wildly in quality and regulatory compliance alignment. You often send content back for multiple revision cycles, creating bottlenecks in the pipeline.',
          },
          aiAgents: {
            summary: 'AI generates first drafts with regulatory compliance guidelines embedded, reducing your revision cycles.',
            detail: 'Drafting agents produce content aligned with your regulatory compliance standards from the start. You focus on strategic refinement rather than basic corrections.',
          },
          aiAgentic: {
            summary: 'Autonomous drafting agents produce content meeting regulatory compliance standards — you set creative direction.',
            detail: 'Drafting agents generate content that passes your regulatory compliance criteria automatically. You focus on strategic vision and creative differentiation rather than quality control.',
          },
        },
        'seo-optimization': {
          preAI: {
            summary: 'SEO optimization is manual and disconnected from your regulatory compliance priorities.',
            detail: 'Keyword research and meta optimization happen separately from your regulatory compliance workflow. You rarely see SEO data until after content is already in review.',
          },
          aiAgents: {
            summary: 'AI SEO tools optimize content while preserving your regulatory compliance priorities.',
            detail: 'SEO agents suggest keywords and meta improvements that align with your regulatory compliance goals. You approve optimizations rather than manually researching keywords.',
          },
          aiAgentic: {
            summary: 'Autonomous SEO agents optimize continuously within regulatory compliance boundaries — you define the strategy.',
            detail: 'SEO agents self-optimize content based on real-time search signals and your regulatory compliance guardrails. You set strategic keywords and constraints, not individual page optimizations.',
          },
        },
        'brand-compliance': {
          preAI: {
            summary: 'Brand checks are subjective and slow, creating delays in your regulatory compliance workflow.',
            detail: 'Brand reviewers interpret guidelines differently. Inconsistent enforcement of tone, terminology, and messaging means regulatory compliance is harder to maintain at scale.',
          },
          aiAgents: {
            summary: 'AI brand checkers flag violations and score regulatory compliance alignment before human review.',
            detail: 'Brand agents scan content against guidelines and highlight regulatory compliance issues. You make judgment calls on edge cases rather than catching basic violations.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents enforce compliance at scale with regulatory compliance rules — you update the rulebook.',
            detail: 'Brand agents apply and evolve compliance checks across all content automatically. Your regulatory compliance standards are codified as machine-enforceable rules that you govern and refine.',
          },
        },
        'final-edit': {
          preAI: {
            summary: 'Final edits depend entirely on editor availability, blocking your regulatory compliance timelines.',
            detail: 'A single editor bottleneck means content waits in queue. Your regulatory compliance deadlines slip because there is no way to parallelize the final polish step.',
          },
          aiAgents: {
            summary: 'AI editing assistants handle mechanical fixes, freeing your regulatory compliance focus for strategic polish.',
            detail: 'Editing agents catch grammar, style, and consistency issues automatically. Your regulatory compliance perspective is reserved for nuance and narrative quality.',
          },
          aiAgentic: {
            summary: 'Autonomous editing agents polish content to publication standard — your regulatory compliance bar is encoded as policy.',
            detail: 'Editing agents handle all mechanical and stylistic refinement autonomously. Your regulatory compliance standards are embedded as editorial policies that improve with each iteration.',
          },
        },
        'schedule-publish': {
          preAI: {
            summary: 'Publishing is a manual CMS process with no connection to your regulatory compliance planning.',
            detail: 'Each piece requires manual scheduling, metadata entry, and CMS configuration. Your regulatory compliance goals are disconnected from the publish timeline.',
          },
          aiAgents: {
            summary: 'AI scheduling agents suggest optimal publish timing based on regulatory compliance data.',
            detail: 'Publishing agents recommend times and configurations informed by your regulatory compliance priorities. You approve the schedule rather than manually configuring CMS settings.',
          },
          aiAgentic: {
            summary: 'Autonomous publishing agents manage scheduling end-to-end using regulatory compliance optimization logic.',
            detail: 'Publishing agents handle CMS configuration, timing optimization, and deployment autonomously within your regulatory compliance constraints. You set publishing policies, not individual schedules.',
          },
        },
        'distribute': {
          preAI: {
            summary: 'Content distribution is manual channel-by-channel, with limited visibility into regulatory compliance.',
            detail: 'Each channel requires separate formatting, scheduling, and posting. There is no unified view of how distribution supports your regulatory compliance objectives.',
          },
          aiAgents: {
            summary: 'AI distribution agents adapt content per channel with regulatory compliance rules built in.',
            detail: 'Distribution agents format and deploy content across channels following your regulatory compliance guidelines. You monitor and adjust rather than manually posting to each platform.',
          },
          aiAgentic: {
            summary: 'Autonomous distribution agents manage all channels with regulatory compliance rules — you govern the playbook.',
            detail: 'Distribution agents deploy, adapt, and optimize content across every channel following your regulatory compliance playbook. You evolve distribution strategy, not execute individual channel posts.',
          },
        },
        'track-performance': {
          preAI: {
            summary: 'Performance tracking is fragmented across tools, making regulatory compliance assessment difficult.',
            detail: 'You pull data from analytics dashboards, social platforms, and CRM separately. Building a complete picture for regulatory compliance requires manual data stitching.',
          },
          aiAgents: {
            summary: 'AI dashboards surface regulatory compliance metrics in real time without manual data pulling.',
            detail: 'Performance agents aggregate data and highlight the regulatory compliance signals that matter to you. You analyze trends rather than building dashboards from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous tracking agents monitor regulatory compliance metrics continuously and trigger alerts and actions.',
            detail: 'Performance agents stream regulatory compliance data and automatically trigger optimization workflows when thresholds are breached. You define KPIs and review strategic implications.',
          },
        },
        'generate-report': {
          preAI: {
            summary: 'Reports are built manually in spreadsheets, often missing the regulatory compliance metrics you need.',
            detail: 'Report creation takes hours of data gathering and formatting. The metrics that matter for regulatory compliance are often buried or missing entirely from standard templates.',
          },
          aiAgents: {
            summary: 'AI generates reports with regulatory compliance metrics pre-formatted and insights highlighted.',
            detail: 'Reporting agents compile your regulatory compliance data into structured templates with automated analysis. You add strategic narrative rather than wrangling data.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce regulatory compliance reports on demand with strategic recommendations.',
            detail: 'Reporting agents generate regulatory compliance analyses with actionable recommendations automatically. You consume insights and set strategic direction rather than producing reports.',
          },
        },
        'optimize': {
          preAI: {
            summary: 'Content optimization is reactive and slow, with limited connection to regulatory compliance data.',
            detail: 'Optimization decisions rely on gut feel and delayed data. Your regulatory compliance insights rarely feed back into content updates in a timely way.',
          },
          aiAgents: {
            summary: 'AI recommends optimizations based on regulatory compliance signals and historical performance.',
            detail: 'Optimization agents suggest specific changes tied to your regulatory compliance metrics. You approve and prioritize recommendations rather than diagnosing issues manually.',
          },
          aiAgentic: {
            summary: 'Autonomous optimization agents improve content continuously using regulatory compliance signals — you set boundaries.',
            detail: 'Optimization agents test, iterate, and improve content based on regulatory compliance data within your guardrails. You define acceptable ranges and review significant changes.',
          },
        },
        'brief-approval': {
          preAI: {
            summary: 'Brief approvals are bottlenecked by manual review cycles that delay your regulatory compliance work.',
            detail: 'You wait for briefs to pass through approval chains before your regulatory compliance tasks can begin. Unclear approval criteria mean briefs bounce back and forth repeatedly.',
          },
          aiAgents: {
            summary: 'AI pre-screens briefs for regulatory compliance alignment, routing only exceptions to you.',
            detail: 'Approval agents check briefs against your regulatory compliance criteria and flag gaps. You review flagged items rather than reading every brief end to end.',
          },
          aiAgentic: {
            summary: 'Autonomous approval agents clear standard briefs and escalate only regulatory compliance exceptions to you.',
            detail: 'Approval agents validate briefs against your regulatory compliance criteria and auto-approve routine requests. You handle strategic exceptions and edge cases only.',
          },
        },
        'quality-check': {
          preAI: {
            summary: 'Quality checks are inconsistent manual reviews with no standard regulatory compliance criteria.',
            detail: 'Quality varies by reviewer and day. There is no automated baseline for readability, accuracy, or regulatory compliance alignment, leading to uneven content standards.',
          },
          aiAgents: {
            summary: 'AI quality gates enforce baseline standards, letting you focus on regulatory compliance nuance.',
            detail: 'Quality agents score readability, accuracy, and SEO automatically. Your regulatory compliance evaluation focuses on strategic alignment rather than mechanical checks.',
          },
          aiAgentic: {
            summary: 'Autonomous quality agents enforce standards continuously — regulatory compliance baselines are self-maintaining.',
            detail: 'Quality agents apply and evolve quality standards based on your regulatory compliance benchmarks. You set quality policies that the system enforces and improves over time.',
          },
        },
        'brand-review': {
          preAI: {
            summary: 'Brand reviews are subjective gates that slow your regulatory compliance pipeline.',
            detail: 'Reviewers apply brand guidelines inconsistently. What passes one review fails the next, creating unpredictable delays in your regulatory compliance workflow.',
          },
          aiAgents: {
            summary: 'AI brand agents pre-score content, surfacing regulatory compliance issues before your review.',
            detail: 'Brand review agents apply guidelines consistently and flag regulatory compliance deviations. You handle exceptions and judgment calls rather than full content scans.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents review all content at scale — you govern regulatory compliance policy evolution.',
            detail: 'Brand review agents handle all compliance checking autonomously with your regulatory compliance rules. You update brand guidelines and review the rare edge case that requires human judgment.',
          },
        },
        'stakeholder-signoff': {
          preAI: {
            summary: 'Stakeholder sign-off is a bottleneck where executives delay your regulatory compliance timelines.',
            detail: 'Senior approvers are busy and unresponsive. Your regulatory compliance work stalls while waiting for sign-off, and last-minute changes create downstream chaos.',
          },
          aiAgents: {
            summary: 'AI prepares sign-off packages with regulatory compliance summaries for faster executive approval.',
            detail: 'Sign-off agents compile context, changes, and regulatory compliance impact assessments for approvers. Executives review structured summaries rather than raw content.',
          },
          aiAgentic: {
            summary: 'Autonomous agents handle routine sign-offs within regulatory compliance parameters — executives approve strategy only.',
            detail: 'Sign-off agents clear content that meets all regulatory compliance criteria automatically. Executives only review strategic pivots or high-risk content that breaches defined thresholds.',
          },
        },
        'performance-review': {
          preAI: {
            summary: 'Performance reviews are infrequent manual assessments that underserve your regulatory compliance needs.',
            detail: 'Reviews happen quarterly at best, using outdated data. Your regulatory compliance perspective is often missing from the evaluation criteria entirely.',
          },
          aiAgents: {
            summary: 'AI evaluates content against KPIs and highlights regulatory compliance trends for your review.',
            detail: 'Review agents surface performance data with regulatory compliance context pre-attached. You make optimize/archive decisions based on structured analysis rather than raw metrics.',
          },
          aiAgentic: {
            summary: 'Autonomous review agents evaluate and act on performance with regulatory compliance logic — you set the framework.',
            detail: 'Review agents continuously assess content against your regulatory compliance KPIs and trigger optimize/refresh/archive workflows automatically. You define the evaluation framework.',
          },
        },
        'social-listening': {
          preAI: {
            summary: 'Social listening is ad hoc keyword monitoring with no systematic link to regulatory compliance.',
            detail: 'You check social platforms manually for relevant conversations. Insights rarely reach your regulatory compliance workflow before they become stale or irrelevant.',
          },
          aiAgents: {
            summary: 'AI monitoring tools surface trending topics and sentiment relevant to regulatory compliance in real time.',
            detail: 'Listening agents track conversations and flag regulatory compliance signals across platforms. You act on curated insights rather than monitoring feeds manually.',
          },
          aiAgentic: {
            summary: 'Autonomous listening agents track and respond to regulatory compliance signals across all platforms in real time.',
            detail: 'Listening agents monitor social channels and proactively surface regulatory compliance opportunities and risks. You set monitoring priorities and review strategic findings.',
          },
        },
        'visual-asset-creation': {
          preAI: {
            summary: 'Visual asset creation is a slow design queue disconnected from your regulatory compliance needs.',
            detail: 'Design requests go into a backlog with unclear priorities. Your regulatory compliance requirements are often lost in translation between brief and final asset.',
          },
          aiAgents: {
            summary: 'AI design tools generate asset options aligned with regulatory compliance requirements.',
            detail: 'Design agents produce visual variants following your regulatory compliance guidelines. You select and refine from AI-generated options rather than directing from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous design agents produce visual assets within regulatory compliance guidelines — you set creative direction.',
            detail: 'Design agents generate publication-ready visuals following your regulatory compliance standards. You define the creative vision and approve hero assets while routine visuals ship autonomously.',
          },
        },
        'accessibility-check': {
          preAI: {
            summary: 'Accessibility checking is a manual afterthought, rarely connected to your regulatory compliance process.',
            detail: 'WCAG compliance and inclusive language reviews happen late in the pipeline. Your regulatory compliance work is already done when accessibility issues force rework.',
          },
          aiAgents: {
            summary: 'AI accessibility tools catch WCAG violations automatically, protecting your regulatory compliance standards.',
            detail: 'Accessibility agents scan for inclusive language and alt-text compliance. Your regulatory compliance requirements benefit from automated baseline checks before human review.',
          },
          aiAgentic: {
            summary: 'Autonomous accessibility agents enforce WCAG and inclusive standards — regulatory compliance is guaranteed by default.',
            detail: 'Accessibility agents ensure all content meets compliance standards before publication. Your regulatory compliance benefits from guaranteed accessibility without manual checking overhead.',
          },
        },
        'localize-content': {
          preAI: {
            summary: 'Localization is a slow, manual translation process that delays your regulatory compliance for global markets.',
            detail: 'Each market requires separate translation, cultural review, and compliance checking. Your regulatory compliance suffers because localized versions lag weeks behind the original.',
          },
          aiAgents: {
            summary: 'AI translation agents accelerate localization while respecting regulatory compliance requirements.',
            detail: 'Localization agents produce initial translations with regulatory compliance context preserved. You review for cultural nuance rather than translating from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous localization agents adapt content for all markets simultaneously — your regulatory compliance scales globally.',
            detail: 'Localization agents handle translation, cultural adaptation, and regional compliance autonomously. Your regulatory compliance is maintained across markets without manual per-locale effort.',
          },
        },
        'ab-variant-creation': {
          preAI: {
            summary: 'A/B variants are created manually with limited connection to your regulatory compliance hypotheses.',
            detail: 'Test variants rely on guesswork rather than data. Your regulatory compliance insights rarely inform variant design, reducing the value of testing efforts.',
          },
          aiAgents: {
            summary: 'AI generates test variants informed by regulatory compliance data and historical performance.',
            detail: 'Variant agents create headlines, CTAs, and imagery options based on your regulatory compliance hypotheses. You select winning approaches rather than brainstorming from zero.',
          },
          aiAgentic: {
            summary: 'Autonomous variant agents design, deploy, and learn from tests using regulatory compliance hypotheses — you set the agenda.',
            detail: 'Variant agents run continuous testing experiments informed by your regulatory compliance objectives. You define what to test and review strategic learnings while the system iterates autonomously.',
          },
        },
        'content-repurposing': {
          preAI: {
            summary: 'Content repurposing is manual reformatting, disconnected from your regulatory compliance goals.',
            detail: 'Each derivative asset is created from scratch. Your regulatory compliance requirements are not systematically applied when repurposing content across formats.',
          },
          aiAgents: {
            summary: 'AI repurposing agents derive secondary assets with regulatory compliance consistency built in.',
            detail: 'Repurposing agents transform primary content into channel-specific formats following your regulatory compliance guidelines. You approve derivatives rather than recreating each manually.',
          },
          aiAgentic: {
            summary: 'Autonomous repurposing agents derive all secondary assets automatically within regulatory compliance guidelines.',
            detail: 'Repurposing agents transform primary content into every derivative format following your regulatory compliance rules. You set format strategy while the system handles production at scale.',
          },
        },
        'archive-tag': {
          preAI: {
            summary: 'Content archiving is inconsistent, making regulatory compliance-related retrieval nearly impossible.',
            detail: 'Tagging and taxonomy are applied inconsistently or not at all. Finding past content relevant to regulatory compliance requires searching through unstructured repositories.',
          },
          aiAgents: {
            summary: 'AI tagging agents classify content automatically, making regulatory compliance retrieval faster.',
            detail: 'Archive agents apply taxonomy and metadata based on your regulatory compliance categories. You validate classifications rather than manually tagging every asset.',
          },
          aiAgentic: {
            summary: 'Autonomous archive agents maintain perfect taxonomy — regulatory compliance retrieval is instant and reliable.',
            detail: 'Archive agents classify, tag, and organize all content using your regulatory compliance taxonomy automatically. You evolve the taxonomy structure while the system maintains it flawlessly.',
          },
        },
        'localization-quality-gate': {
          preAI: {
            summary: 'Localization quality gates are inconsistent, creating regulatory compliance risks in global markets.',
            detail: 'Quality checks for localized content vary by market and reviewer. Your regulatory compliance standards are unevenly applied across regions and languages.',
          },
          aiAgents: {
            summary: 'AI quality checks catch translation errors before they affect your regulatory compliance outcomes.',
            detail: 'Localization QA agents verify accuracy and cultural fit automatically. Your regulatory compliance standards are applied consistently across all target markets.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents ensure localization quality across all markets — regulatory compliance is guaranteed globally.',
            detail: 'Localization QA agents validate every market adaptation autonomously against your regulatory compliance standards. You set quality criteria while the system enforces them at scale.',
          },
        },
        'segment-mapping': {
          preAI: {
            summary: 'Segment mapping is manual spreadsheet work with limited visibility into regulatory compliance impact.',
            detail: 'Mapping content variants to audience segments is done in spreadsheets. Your regulatory compliance data is disconnected from the personalization logic.',
          },
          aiAgents: {
            summary: 'AI agents map variants to segments using regulatory compliance data from the CDP.',
            detail: 'Segment agents recommend variant-audience matches based on your regulatory compliance signals. You review the mapping rather than building it manually in spreadsheets.',
          },
          aiAgentic: {
            summary: 'Autonomous segment agents map and optimize variant-audience matches using live regulatory compliance signals.',
            detail: 'Segment agents continuously refine variant-audience mappings based on real-time regulatory compliance data. You define segmentation strategy while the system executes and optimizes automatically.',
          },
        },
        'dynamic-assembly': {
          preAI: {
            summary: 'Dynamic content assembly is rigid and template-bound, limiting your regulatory compliance options.',
            detail: 'Personalized experiences require engineering support for each variant. Your regulatory compliance vision is constrained by inflexible assembly templates.',
          },
          aiAgents: {
            summary: 'AI assembly agents construct personalized experiences informed by regulatory compliance rules.',
            detail: 'Assembly agents combine content components per segment following your regulatory compliance logic. You define rules and review outputs rather than manually configuring each variant.',
          },
          aiAgentic: {
            summary: 'Autonomous assembly agents construct personalized experiences in real time — regulatory compliance logic is self-optimizing.',
            detail: 'Assembly agents build dynamic experiences per segment using your regulatory compliance rules and real-time behavioral signals. You govern personalization policies, not individual assembly configurations.',
          },
        },
        'personalization-qa': {
          preAI: {
            summary: 'Personalization QA is manual spot-checking that misses regulatory compliance gaps.',
            detail: 'Testing every segment-variant combination is impossible manually. Your regulatory compliance concerns are only caught when users report issues post-launch.',
          },
          aiAgents: {
            summary: 'AI QA agents validate personalization coverage and flag regulatory compliance gaps before launch.',
            detail: 'QA agents test every segment-variant combination against your regulatory compliance requirements. You review exception reports rather than manually spot-checking combinations.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents validate every personalization scenario — regulatory compliance gaps are caught before launch.',
            detail: 'Personalization QA agents test all segment-variant combinations against your regulatory compliance requirements automatically. You set acceptance criteria while the system validates at scale.',
          },
        },
        'campaign-planning': {
          preAI: {
            summary: 'Campaign planning is a manual coordination effort with fragmented regulatory compliance inputs.',
            detail: 'Campaign plans are built in decks and spreadsheets with incomplete data. Your regulatory compliance perspective is often incorporated too late in the planning cycle.',
          },
          aiAgents: {
            summary: 'AI planning agents draft campaign frameworks with regulatory compliance data pre-integrated.',
            detail: 'Planning agents pull audience, budget, and performance data into campaign templates. Your regulatory compliance priorities shape the plan from the start rather than being retrofitted.',
          },
          aiAgentic: {
            summary: 'Autonomous planning agents generate campaign frameworks using regulatory compliance intelligence — you set objectives.',
            detail: 'Planning agents produce data-driven campaign plans with your regulatory compliance priorities embedded. You define strategic goals while the system optimizes tactics and resource allocation.',
          },
        },
        'consent-check': {
          preAI: {
            summary: 'Consent checking is a manual compliance step that adds friction to your regulatory compliance process.',
            detail: 'Verifying GDPR/CCPA consent for targeting requires manual cross-referencing. Your regulatory compliance work is delayed while compliance status is manually confirmed.',
          },
          aiAgents: {
            summary: 'AI consent agents verify targeting compliance automatically, reducing regulatory compliance friction.',
            detail: 'Consent agents cross-reference CDP signals against GDPR/CCPA rules for your regulatory compliance needs. You handle exceptions rather than manually verifying every segment.',
          },
          aiAgentic: {
            summary: 'Autonomous consent agents enforce privacy compliance at scale — regulatory compliance is guaranteed by architecture.',
            detail: 'Consent agents verify targeting compliance in real time across all segments using your regulatory compliance framework. You set privacy policies while the system enforces them automatically.',
          },
        },
        'paid-creative-production': {
          preAI: {
            summary: 'Paid creative production runs separately from organic, fragmenting your regulatory compliance oversight.',
            detail: 'Ad creative and organic content are produced in silos. Your regulatory compliance perspective is applied inconsistently between paid and organic channels.',
          },
          aiAgents: {
            summary: 'AI production agents generate paid variants from organic content with regulatory compliance consistency.',
            detail: 'Paid creative agents adapt organic content for ad platforms following your regulatory compliance guidelines. You approve and fine-tune rather than producing ad creative from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous production agents create paid variants at scale within regulatory compliance guardrails — you set the strategy.',
            detail: 'Paid creative agents generate ad variants from organic content following your regulatory compliance guidelines. You define creative strategy while the system produces and optimizes at scale.',
          },
        },
        'attribution-modeling': {
          preAI: {
            summary: 'Attribution modeling is manual and unreliable, undermining your regulatory compliance reporting.',
            detail: 'Last-click attribution dominates despite its flaws. Your regulatory compliance decisions lack the multi-touch perspective needed for accurate performance assessment.',
          },
          aiAgents: {
            summary: 'AI attribution models surface multi-touch insights relevant to your regulatory compliance priorities.',
            detail: 'Attribution agents calculate content ROI across channels using your regulatory compliance weightings. You interpret strategic implications rather than building models manually.',
          },
          aiAgentic: {
            summary: 'Autonomous attribution agents run multi-touch models continuously — regulatory compliance insights update in real time.',
            detail: 'Attribution agents calculate content ROI across all channels using your regulatory compliance framework. You interpret strategic implications while the system handles modeling complexity.',
          },
        },
        'executive-reporting': {
          preAI: {
            summary: 'Executive reports are manually assembled, often missing the regulatory compliance narrative you need.',
            detail: 'Building executive dashboards takes hours of data wrangling. The regulatory compliance story you want to tell is lost in generic reporting templates.',
          },
          aiAgents: {
            summary: 'AI builds executive dashboards with regulatory compliance narratives pre-drafted for leadership.',
            detail: 'Reporting agents synthesize data into executive formats with your regulatory compliance story embedded. You refine the narrative rather than assembling data from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce executive dashboards with regulatory compliance narratives — you add strategic context.',
            detail: 'Executive reporting agents synthesize all data into leadership-ready formats with your regulatory compliance story embedded. You provide strategic commentary on auto-generated insights.',
          },
        },
        'competitive-response': {
          preAI: {
            summary: 'Competitive response is slow and reactive, giving you no regulatory compliance advantage.',
            detail: 'By the time you spot a competitor move and respond, the moment has passed. Your regulatory compliance approach cannot adapt fast enough to real-time competitive signals.',
          },
          aiAgents: {
            summary: 'AI competitive agents surface signals and draft responses aligned with regulatory compliance strategy.',
            detail: 'Competitive agents monitor market moves and suggest regulatory compliance-aligned responses. You approve and refine reactive content rather than spotting threats manually.',
          },
          aiAgentic: {
            summary: 'Autonomous competitive agents detect and draft responses in real time — regulatory compliance moves are countered instantly.',
            detail: 'Competitive agents monitor signals, draft responses, and deploy within your regulatory compliance guardrails. You approve high-stakes responses while routine reactions ship autonomously.',
          },
        },
        'content-governance': {
          preAI: {
            summary: 'Content governance is periodic manual auditing that cannot keep pace with your regulatory compliance standards.',
            detail: 'Live content drifts out of compliance between infrequent reviews. Your regulatory compliance requirements are only enforced when someone manually checks.',
          },
          aiAgents: {
            summary: 'AI governance agents continuously audit live content against regulatory compliance standards.',
            detail: 'Governance agents flag content drift, compliance gaps, and regulatory compliance issues in real time. You review flagged items rather than conducting manual audits.',
          },
          aiAgentic: {
            summary: 'Autonomous governance agents audit all live content continuously — regulatory compliance compliance is always current.',
            detail: 'Governance agents monitor every published piece against your regulatory compliance standards in real time. You evolve governance policies while the system enforces them perpetually.',
          },
        },
        'governance-gate': {
          preAI: {
            summary: 'Governance gates are calendar-driven checkpoints disconnected from your regulatory compliance rhythm.',
            detail: 'Governance reviews happen on a fixed schedule regardless of content velocity. Your regulatory compliance concerns may not surface until the next quarterly review.',
          },
          aiAgents: {
            summary: 'AI governance gates run continuous checks, surfacing regulatory compliance issues between formal reviews.',
            detail: 'Governance agents validate live content against your regulatory compliance criteria on an ongoing basis. You act on exception alerts rather than waiting for quarterly reviews.',
          },
          aiAgentic: {
            summary: 'Autonomous governance gates run continuously — regulatory compliance violations trigger immediate remediation.',
            detail: 'Governance agents validate live content against your regulatory compliance criteria continuously and auto-trigger refresh or retirement workflows. You set policies, not review schedules.',
          },
        },
        'journey-mapping': {
          preAI: {
            summary: 'Journey mapping is a manual exercise that rarely reflects your regulatory compliance reality.',
            detail: 'Customer journey maps are created in workshops and quickly go stale. Your regulatory compliance perspective is a snapshot, not a living view of how content performs at each stage.',
          },
          aiAgents: {
            summary: 'AI journey agents map content to lifecycle stages using regulatory compliance data from the CDP.',
            detail: 'Journey agents dynamically map content to customer stages based on your regulatory compliance framework. You validate the mapping rather than building it manually in workshops.',
          },
          aiAgentic: {
            summary: 'Autonomous journey agents maintain living maps using real-time regulatory compliance data — you shape the strategy.',
            detail: 'Journey agents dynamically map content to lifecycle stages using live regulatory compliance signals. You define journey frameworks while the system optimizes content placement continuously.',
          },
        },
        'sentiment-monitoring': {
          preAI: {
            summary: 'Sentiment monitoring is sporadic manual checking with no systematic link to regulatory compliance.',
            detail: 'You check brand sentiment reactively rather than proactively. Your regulatory compliance decisions are made without real-time audience feedback signals.',
          },
          aiAgents: {
            summary: 'AI sentiment agents track brand reception in real time, alerting you to regulatory compliance risks.',
            detail: 'Sentiment agents analyze audience reactions and flag regulatory compliance concerns before they escalate. You respond to alerts rather than manually checking platforms.',
          },
          aiAgentic: {
            summary: 'Autonomous sentiment agents monitor and respond to regulatory compliance signals around the clock — you govern escalation.',
            detail: 'Sentiment agents track audience reactions and trigger regulatory compliance responses automatically. You set escalation thresholds and review strategic implications of sentiment shifts.',
          },
        },
        'sales-enablement': {
          preAI: {
            summary: 'Sales enablement content is created ad hoc, disconnected from your regulatory compliance strategy.',
            detail: 'Sales teams request materials outside the content pipeline. Your regulatory compliance standards are not applied to battle cards, decks, and one-pagers created in isolation.',
          },
          aiAgents: {
            summary: 'AI agents generate sales materials from marketing content with regulatory compliance alignment.',
            detail: 'Sales enablement agents transform marketing assets into battle cards and decks following your regulatory compliance standards. You approve rather than creating each piece manually.',
          },
          aiAgentic: {
            summary: 'Autonomous enablement agents keep sales materials current with regulatory compliance alignment — you set the playbook.',
            detail: 'Enablement agents automatically update battle cards, decks, and case studies as your regulatory compliance data evolves. You define the sales narrative while the system produces materials at scale.',
          },
        },
        'influencer-brief': {
          preAI: {
            summary: 'Influencer briefs are manual documents with limited regulatory compliance guardrails.',
            detail: 'Creator briefs are written from scratch each time. Your regulatory compliance guidelines are inconsistently communicated to external partners and influencers.',
          },
          aiAgents: {
            summary: 'AI agents draft influencer briefs with regulatory compliance guardrails embedded automatically.',
            detail: 'Brief agents generate creator guidelines from your regulatory compliance requirements and past successful collaborations. You customize rather than writing each brief from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous brief agents generate creator guidelines with regulatory compliance guardrails — you approve partnerships.',
            detail: 'Brief agents produce personalized influencer guidelines using your regulatory compliance framework and creator history. You focus on relationship strategy while briefs ship autonomously.',
          },
        },
        'ugc-moderation': {
          preAI: {
            summary: 'UGC moderation is manual screening that cannot scale to protect regulatory compliance.',
            detail: 'User-generated content is reviewed one piece at a time. Your regulatory compliance standards cannot be consistently enforced across the volume of submissions.',
          },
          aiAgents: {
            summary: 'AI moderation agents screen UGC for brand safety and regulatory compliance compliance at scale.',
            detail: 'Moderation agents filter user-generated content against your regulatory compliance criteria. You review borderline cases rather than manually screening every submission.',
          },
          aiAgentic: {
            summary: 'Autonomous moderation agents screen all UGC for regulatory compliance compliance at scale — you govern edge cases.',
            detail: 'Moderation agents filter user-generated content using your regulatory compliance rules continuously. You update moderation policies and review borderline cases that the system escalates.',
          },
        },
        'content-scoring': {
          preAI: {
            summary: 'Content scoring is subjective prioritization that underweights your regulatory compliance criteria.',
            detail: 'Requests are prioritized by loudest voice or executive fiat. Your regulatory compliance scoring criteria are rarely part of the formal prioritization framework.',
          },
          aiAgents: {
            summary: 'AI scoring agents rank requests using regulatory compliance criteria alongside strategic priority.',
            detail: 'Scoring agents weight your regulatory compliance factors into the prioritization algorithm. You adjust rankings rather than scoring each request manually.',
          },
          aiAgentic: {
            summary: 'Autonomous scoring agents prioritize the pipeline using regulatory compliance criteria — you set strategic weights.',
            detail: 'Scoring agents rank and route content requests using your regulatory compliance priorities in real time. You define scoring criteria and review the queue rather than manually triaging.',
          },
        },
        'channel-orchestration': {
          preAI: {
            summary: 'Channel orchestration is manual coordination with no systematic regulatory compliance integration.',
            detail: 'Cross-channel timing is managed in spreadsheets and Slack. Your regulatory compliance requirements for sequencing and coordination are often overridden by ad hoc changes.',
          },
          aiAgents: {
            summary: 'AI orchestration agents sequence distribution with regulatory compliance rules for timing and cadence.',
            detail: 'Orchestration agents coordinate cross-channel timing based on your regulatory compliance requirements. You set rules and review the sequence rather than managing each channel individually.',
          },
          aiAgentic: {
            summary: 'Autonomous orchestration agents manage all channel timing with regulatory compliance logic — you set the playbook.',
            detail: 'Orchestration agents handle cross-channel sequencing, timing, and coordination autonomously using your regulatory compliance rules. You evolve the orchestration strategy while the system executes.',
          },
        },
      },
      keyInsight: 'Legal compliance is the one gate where human authority is architecturally non-negotiable. The consequences are regulatory, not operational.',
    },
  },
  {
    id: 'localization-manager',
    title: 'Localization Manager',
    description: 'Owns the localization step and reviews localized content through the localization quality gate. Responsible for translation accuracy, cultural appropriateness, and regional compliance.',
    tagline: 'Makes one campaign work in every market.',
    iconName: 'Globe',
    category: 'governance',
    accentColor: '#BE6F4F',
    ownedSteps: ['localize-content'],
    reviewedGates: ['localization-quality-gate'],
    relatedAgents: ['localization-agent'],
    relatedInputs: ['localization-guides', 'legal-guidelines'],
    narrative: {
      nodeJourneys: {
        'localize-content': {
          preAI: {
            summary: 'You manage translation, cultural adaptation, and regional compliance for every market you serve.',
            detail: 'Each market has its own constraints — regulatory differences, cultural nuance, local brand voice. Adaptation is manual and market-by-market.',
          },
          aiAgents: {
            summary: 'A localization agent handles translation and initial cultural adaptation, flagging ambiguous cases for your review.',
            detail: 'You review agent output for cultural subtleties machines consistently miss. The exception set is larger than most functions because cultural context is inherently ambiguous.',
          },
          aiAgentic: {
            summary: 'One piece of content is adapted across all markets simultaneously — your quality gate catches cross-market conflicts.',
            detail: 'Speed increases dramatically, but so does the complexity of edge cases. You handle the cultural nuance that makes localization fundamentally different from translation.',
          },
        },
        'localization-quality-gate': {
          preAI: {
            summary: 'You review every localized variant for cultural appropriateness, translation accuracy, and regional regulatory compliance.',
            detail: 'Review volume scales with the number of markets. Each new market multiplies your workload linearly.',
          },
          aiAgents: {
            summary: 'Automated quality checks handle translation accuracy and terminology consistency — you review cultural appropriateness.',
            detail: 'Technical quality is automated. Your reviews concentrate on cultural judgment — whether a message lands differently in different contexts.',
          },
          aiAgentic: {
            summary: 'Localization quality runs continuously, with cross-market conflict detection triggering your review automatically.',
            detail: 'A cultural flag in one market can trigger legal review across all markets through cross-gate escalation. Your gate prevents regional problems from becoming global ones.',
          },
        },
        'receive-request': {
          preAI: {
            summary: 'You adapt incoming requests manually, sorting through emails and Slack messages for translation accuracy.',
            detail: 'Requests arrive in inconsistent formats with no standard intake process. You spend hours triaging and clarifying scope before translation accuracy can even begin.',
          },
          aiAgents: {
            summary: 'An AI intake agent structures requests and flags translation accuracy implications before they reach your queue.',
            detail: 'Requests arrive pre-categorized with translation accuracy signals highlighted. You validate and prioritize rather than manually parsing raw inputs.',
          },
          aiAgentic: {
            summary: 'Autonomous intake agents triage, validate, and route requests with translation accuracy logic — you govern exceptions.',
            detail: 'Agentic intake handles end-to-end request processing with your translation accuracy rules embedded. You set policies and review escalations while routine requests flow automatically.',
          },
        },
        'research-insights': {
          preAI: {
            summary: 'You gather audience and market research manually, compiling data from multiple sources for translation accuracy.',
            detail: 'Research is scattered across tools, reports, and tribal knowledge. Building a complete picture for translation accuracy takes days and the data is often stale by the time you use it.',
          },
          aiAgents: {
            summary: 'AI research tools surface audience and market data relevant to your translation accuracy needs automatically.',
            detail: 'Research agents pull relevant data from multiple sources and present translation accuracy insights in a structured format. You curate and interpret rather than gather.',
          },
          aiAgentic: {
            summary: 'Autonomous research agents continuously update translation accuracy intelligence — you set the strategic lens.',
            detail: 'Research agents proactively surface translation accuracy insights from market signals, audience data, and competitive movements. You shape research priorities, not execute searches.',
          },
        },
        'write-brief': {
          preAI: {
            summary: 'You wait for briefs written by hand, often lacking the translation accuracy detail you need.',
            detail: 'Briefs arrive incomplete or misaligned with your translation accuracy requirements. You spend cycles requesting revisions and clarifying expectations before work can proceed.',
          },
          aiAgents: {
            summary: 'AI drafts briefs with translation accuracy requirements pre-populated from templates and past projects.',
            detail: 'Brief generation agents pull your translation accuracy requirements into structured templates. You review and refine rather than starting from a blank page.',
          },
          aiAgentic: {
            summary: 'Autonomous agents generate complete briefs with translation accuracy alignment built in — you approve strategy.',
            detail: 'Brief agents produce publication-ready briefs that embed your translation accuracy requirements from historical patterns. You govern strategic direction rather than reviewing drafts.',
          },
        },
        'draft-content': {
          preAI: {
            summary: 'You review drafts created entirely by hand, checking each one for alignment with translation accuracy.',
            detail: 'First drafts vary wildly in quality and translation accuracy alignment. You often send content back for multiple revision cycles, creating bottlenecks in the pipeline.',
          },
          aiAgents: {
            summary: 'AI generates first drafts with translation accuracy guidelines embedded, reducing your revision cycles.',
            detail: 'Drafting agents produce content aligned with your translation accuracy standards from the start. You focus on strategic refinement rather than basic corrections.',
          },
          aiAgentic: {
            summary: 'Autonomous drafting agents produce content meeting translation accuracy standards — you set creative direction.',
            detail: 'Drafting agents generate content that passes your translation accuracy criteria automatically. You focus on strategic vision and creative differentiation rather than quality control.',
          },
        },
        'seo-optimization': {
          preAI: {
            summary: 'SEO optimization is manual and disconnected from your translation accuracy priorities.',
            detail: 'Keyword research and meta optimization happen separately from your translation accuracy workflow. You rarely see SEO data until after content is already in review.',
          },
          aiAgents: {
            summary: 'AI SEO tools optimize content while preserving your translation accuracy priorities.',
            detail: 'SEO agents suggest keywords and meta improvements that align with your translation accuracy goals. You approve optimizations rather than manually researching keywords.',
          },
          aiAgentic: {
            summary: 'Autonomous SEO agents optimize continuously within translation accuracy boundaries — you define the strategy.',
            detail: 'SEO agents self-optimize content based on real-time search signals and your translation accuracy guardrails. You set strategic keywords and constraints, not individual page optimizations.',
          },
        },
        'brand-compliance': {
          preAI: {
            summary: 'Brand checks are subjective and slow, creating delays in your translation accuracy workflow.',
            detail: 'Brand reviewers interpret guidelines differently. Inconsistent enforcement of tone, terminology, and messaging means translation accuracy is harder to maintain at scale.',
          },
          aiAgents: {
            summary: 'AI brand checkers flag violations and score translation accuracy alignment before human review.',
            detail: 'Brand agents scan content against guidelines and highlight translation accuracy issues. You make judgment calls on edge cases rather than catching basic violations.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents enforce compliance at scale with translation accuracy rules — you update the rulebook.',
            detail: 'Brand agents apply and evolve compliance checks across all content automatically. Your translation accuracy standards are codified as machine-enforceable rules that you govern and refine.',
          },
        },
        'final-edit': {
          preAI: {
            summary: 'Final edits depend entirely on editor availability, blocking your translation accuracy timelines.',
            detail: 'A single editor bottleneck means content waits in queue. Your translation accuracy deadlines slip because there is no way to parallelize the final polish step.',
          },
          aiAgents: {
            summary: 'AI editing assistants handle mechanical fixes, freeing your translation accuracy focus for strategic polish.',
            detail: 'Editing agents catch grammar, style, and consistency issues automatically. Your translation accuracy perspective is reserved for nuance and narrative quality.',
          },
          aiAgentic: {
            summary: 'Autonomous editing agents polish content to publication standard — your translation accuracy bar is encoded as policy.',
            detail: 'Editing agents handle all mechanical and stylistic refinement autonomously. Your translation accuracy standards are embedded as editorial policies that improve with each iteration.',
          },
        },
        'schedule-publish': {
          preAI: {
            summary: 'Publishing is a manual CMS process with no connection to your translation accuracy planning.',
            detail: 'Each piece requires manual scheduling, metadata entry, and CMS configuration. Your translation accuracy goals are disconnected from the publish timeline.',
          },
          aiAgents: {
            summary: 'AI scheduling agents suggest optimal publish timing based on translation accuracy data.',
            detail: 'Publishing agents recommend times and configurations informed by your translation accuracy priorities. You approve the schedule rather than manually configuring CMS settings.',
          },
          aiAgentic: {
            summary: 'Autonomous publishing agents manage scheduling end-to-end using translation accuracy optimization logic.',
            detail: 'Publishing agents handle CMS configuration, timing optimization, and deployment autonomously within your translation accuracy constraints. You set publishing policies, not individual schedules.',
          },
        },
        'distribute': {
          preAI: {
            summary: 'Content distribution is manual channel-by-channel, with limited visibility into translation accuracy.',
            detail: 'Each channel requires separate formatting, scheduling, and posting. There is no unified view of how distribution supports your translation accuracy objectives.',
          },
          aiAgents: {
            summary: 'AI distribution agents adapt content per channel with translation accuracy rules built in.',
            detail: 'Distribution agents format and deploy content across channels following your translation accuracy guidelines. You monitor and adjust rather than manually posting to each platform.',
          },
          aiAgentic: {
            summary: 'Autonomous distribution agents manage all channels with translation accuracy rules — you govern the playbook.',
            detail: 'Distribution agents deploy, adapt, and optimize content across every channel following your translation accuracy playbook. You evolve distribution strategy, not execute individual channel posts.',
          },
        },
        'track-performance': {
          preAI: {
            summary: 'Performance tracking is fragmented across tools, making translation accuracy assessment difficult.',
            detail: 'You pull data from analytics dashboards, social platforms, and CRM separately. Building a complete picture for translation accuracy requires manual data stitching.',
          },
          aiAgents: {
            summary: 'AI dashboards surface translation accuracy metrics in real time without manual data pulling.',
            detail: 'Performance agents aggregate data and highlight the translation accuracy signals that matter to you. You analyze trends rather than building dashboards from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous tracking agents monitor translation accuracy metrics continuously and trigger alerts and actions.',
            detail: 'Performance agents stream translation accuracy data and automatically trigger optimization workflows when thresholds are breached. You define KPIs and review strategic implications.',
          },
        },
        'generate-report': {
          preAI: {
            summary: 'Reports are built manually in spreadsheets, often missing the translation accuracy metrics you need.',
            detail: 'Report creation takes hours of data gathering and formatting. The metrics that matter for translation accuracy are often buried or missing entirely from standard templates.',
          },
          aiAgents: {
            summary: 'AI generates reports with translation accuracy metrics pre-formatted and insights highlighted.',
            detail: 'Reporting agents compile your translation accuracy data into structured templates with automated analysis. You add strategic narrative rather than wrangling data.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce translation accuracy reports on demand with strategic recommendations.',
            detail: 'Reporting agents generate translation accuracy analyses with actionable recommendations automatically. You consume insights and set strategic direction rather than producing reports.',
          },
        },
        'optimize': {
          preAI: {
            summary: 'Content optimization is reactive and slow, with limited connection to translation accuracy data.',
            detail: 'Optimization decisions rely on gut feel and delayed data. Your translation accuracy insights rarely feed back into content updates in a timely way.',
          },
          aiAgents: {
            summary: 'AI recommends optimizations based on translation accuracy signals and historical performance.',
            detail: 'Optimization agents suggest specific changes tied to your translation accuracy metrics. You approve and prioritize recommendations rather than diagnosing issues manually.',
          },
          aiAgentic: {
            summary: 'Autonomous optimization agents improve content continuously using translation accuracy signals — you set boundaries.',
            detail: 'Optimization agents test, iterate, and improve content based on translation accuracy data within your guardrails. You define acceptable ranges and review significant changes.',
          },
        },
        'brief-approval': {
          preAI: {
            summary: 'Brief approvals are bottlenecked by manual review cycles that delay your translation accuracy work.',
            detail: 'You wait for briefs to pass through approval chains before your translation accuracy tasks can begin. Unclear approval criteria mean briefs bounce back and forth repeatedly.',
          },
          aiAgents: {
            summary: 'AI pre-screens briefs for translation accuracy alignment, routing only exceptions to you.',
            detail: 'Approval agents check briefs against your translation accuracy criteria and flag gaps. You review flagged items rather than reading every brief end to end.',
          },
          aiAgentic: {
            summary: 'Autonomous approval agents clear standard briefs and escalate only translation accuracy exceptions to you.',
            detail: 'Approval agents validate briefs against your translation accuracy criteria and auto-approve routine requests. You handle strategic exceptions and edge cases only.',
          },
        },
        'quality-check': {
          preAI: {
            summary: 'Quality checks are inconsistent manual reviews with no standard translation accuracy criteria.',
            detail: 'Quality varies by reviewer and day. There is no automated baseline for readability, accuracy, or translation accuracy alignment, leading to uneven content standards.',
          },
          aiAgents: {
            summary: 'AI quality gates enforce baseline standards, letting you focus on translation accuracy nuance.',
            detail: 'Quality agents score readability, accuracy, and SEO automatically. Your translation accuracy evaluation focuses on strategic alignment rather than mechanical checks.',
          },
          aiAgentic: {
            summary: 'Autonomous quality agents enforce standards continuously — translation accuracy baselines are self-maintaining.',
            detail: 'Quality agents apply and evolve quality standards based on your translation accuracy benchmarks. You set quality policies that the system enforces and improves over time.',
          },
        },
        'brand-review': {
          preAI: {
            summary: 'Brand reviews are subjective gates that slow your translation accuracy pipeline.',
            detail: 'Reviewers apply brand guidelines inconsistently. What passes one review fails the next, creating unpredictable delays in your translation accuracy workflow.',
          },
          aiAgents: {
            summary: 'AI brand agents pre-score content, surfacing translation accuracy issues before your review.',
            detail: 'Brand review agents apply guidelines consistently and flag translation accuracy deviations. You handle exceptions and judgment calls rather than full content scans.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents review all content at scale — you govern translation accuracy policy evolution.',
            detail: 'Brand review agents handle all compliance checking autonomously with your translation accuracy rules. You update brand guidelines and review the rare edge case that requires human judgment.',
          },
        },
        'stakeholder-signoff': {
          preAI: {
            summary: 'Stakeholder sign-off is a bottleneck where executives delay your translation accuracy timelines.',
            detail: 'Senior approvers are busy and unresponsive. Your translation accuracy work stalls while waiting for sign-off, and last-minute changes create downstream chaos.',
          },
          aiAgents: {
            summary: 'AI prepares sign-off packages with translation accuracy summaries for faster executive approval.',
            detail: 'Sign-off agents compile context, changes, and translation accuracy impact assessments for approvers. Executives review structured summaries rather than raw content.',
          },
          aiAgentic: {
            summary: 'Autonomous agents handle routine sign-offs within translation accuracy parameters — executives approve strategy only.',
            detail: 'Sign-off agents clear content that meets all translation accuracy criteria automatically. Executives only review strategic pivots or high-risk content that breaches defined thresholds.',
          },
        },
        'performance-review': {
          preAI: {
            summary: 'Performance reviews are infrequent manual assessments that underserve your translation accuracy needs.',
            detail: 'Reviews happen quarterly at best, using outdated data. Your translation accuracy perspective is often missing from the evaluation criteria entirely.',
          },
          aiAgents: {
            summary: 'AI evaluates content against KPIs and highlights translation accuracy trends for your review.',
            detail: 'Review agents surface performance data with translation accuracy context pre-attached. You make optimize/archive decisions based on structured analysis rather than raw metrics.',
          },
          aiAgentic: {
            summary: 'Autonomous review agents evaluate and act on performance with translation accuracy logic — you set the framework.',
            detail: 'Review agents continuously assess content against your translation accuracy KPIs and trigger optimize/refresh/archive workflows automatically. You define the evaluation framework.',
          },
        },
        'social-listening': {
          preAI: {
            summary: 'Social listening is ad hoc keyword monitoring with no systematic link to translation accuracy.',
            detail: 'You check social platforms manually for relevant conversations. Insights rarely reach your translation accuracy workflow before they become stale or irrelevant.',
          },
          aiAgents: {
            summary: 'AI monitoring tools surface trending topics and sentiment relevant to translation accuracy in real time.',
            detail: 'Listening agents track conversations and flag translation accuracy signals across platforms. You act on curated insights rather than monitoring feeds manually.',
          },
          aiAgentic: {
            summary: 'Autonomous listening agents track and respond to translation accuracy signals across all platforms in real time.',
            detail: 'Listening agents monitor social channels and proactively surface translation accuracy opportunities and risks. You set monitoring priorities and review strategic findings.',
          },
        },
        'visual-asset-creation': {
          preAI: {
            summary: 'Visual asset creation is a slow design queue disconnected from your translation accuracy needs.',
            detail: 'Design requests go into a backlog with unclear priorities. Your translation accuracy requirements are often lost in translation between brief and final asset.',
          },
          aiAgents: {
            summary: 'AI design tools generate asset options aligned with translation accuracy requirements.',
            detail: 'Design agents produce visual variants following your translation accuracy guidelines. You select and refine from AI-generated options rather than directing from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous design agents produce visual assets within translation accuracy guidelines — you set creative direction.',
            detail: 'Design agents generate publication-ready visuals following your translation accuracy standards. You define the creative vision and approve hero assets while routine visuals ship autonomously.',
          },
        },
        'legal-review': {
          preAI: {
            summary: 'Legal review is an opaque process that creates unpredictable delays in your translation accuracy work.',
            detail: 'Legal feedback arrives late with minimal context. You cannot predict how long review will take, making translation accuracy planning unreliable.',
          },
          aiAgents: {
            summary: 'AI legal screening flags compliance risks early, reducing translation accuracy surprises downstream.',
            detail: 'Legal agents pre-scan content for regulatory issues and translation accuracy risks. You get early warnings rather than discovering problems at the sign-off stage.',
          },
          aiAgentic: {
            summary: 'Autonomous legal agents clear routine content and escalate only true translation accuracy risks to human counsel.',
            detail: 'Legal agents scan and clear standard content autonomously using your translation accuracy rule framework. Human lawyers handle novel risk scenarios and precedent-setting decisions only.',
          },
        },
        'accessibility-check': {
          preAI: {
            summary: 'Accessibility checking is a manual afterthought, rarely connected to your translation accuracy process.',
            detail: 'WCAG compliance and inclusive language reviews happen late in the pipeline. Your translation accuracy work is already done when accessibility issues force rework.',
          },
          aiAgents: {
            summary: 'AI accessibility tools catch WCAG violations automatically, protecting your translation accuracy standards.',
            detail: 'Accessibility agents scan for inclusive language and alt-text compliance. Your translation accuracy requirements benefit from automated baseline checks before human review.',
          },
          aiAgentic: {
            summary: 'Autonomous accessibility agents enforce WCAG and inclusive standards — translation accuracy is guaranteed by default.',
            detail: 'Accessibility agents ensure all content meets compliance standards before publication. Your translation accuracy benefits from guaranteed accessibility without manual checking overhead.',
          },
        },
        'ab-variant-creation': {
          preAI: {
            summary: 'A/B variants are created manually with limited connection to your translation accuracy hypotheses.',
            detail: 'Test variants rely on guesswork rather than data. Your translation accuracy insights rarely inform variant design, reducing the value of testing efforts.',
          },
          aiAgents: {
            summary: 'AI generates test variants informed by translation accuracy data and historical performance.',
            detail: 'Variant agents create headlines, CTAs, and imagery options based on your translation accuracy hypotheses. You select winning approaches rather than brainstorming from zero.',
          },
          aiAgentic: {
            summary: 'Autonomous variant agents design, deploy, and learn from tests using translation accuracy hypotheses — you set the agenda.',
            detail: 'Variant agents run continuous testing experiments informed by your translation accuracy objectives. You define what to test and review strategic learnings while the system iterates autonomously.',
          },
        },
        'content-repurposing': {
          preAI: {
            summary: 'Content repurposing is manual reformatting, disconnected from your translation accuracy goals.',
            detail: 'Each derivative asset is created from scratch. Your translation accuracy requirements are not systematically applied when repurposing content across formats.',
          },
          aiAgents: {
            summary: 'AI repurposing agents derive secondary assets with translation accuracy consistency built in.',
            detail: 'Repurposing agents transform primary content into channel-specific formats following your translation accuracy guidelines. You approve derivatives rather than recreating each manually.',
          },
          aiAgentic: {
            summary: 'Autonomous repurposing agents derive all secondary assets automatically within translation accuracy guidelines.',
            detail: 'Repurposing agents transform primary content into every derivative format following your translation accuracy rules. You set format strategy while the system handles production at scale.',
          },
        },
        'archive-tag': {
          preAI: {
            summary: 'Content archiving is inconsistent, making translation accuracy-related retrieval nearly impossible.',
            detail: 'Tagging and taxonomy are applied inconsistently or not at all. Finding past content relevant to translation accuracy requires searching through unstructured repositories.',
          },
          aiAgents: {
            summary: 'AI tagging agents classify content automatically, making translation accuracy retrieval faster.',
            detail: 'Archive agents apply taxonomy and metadata based on your translation accuracy categories. You validate classifications rather than manually tagging every asset.',
          },
          aiAgentic: {
            summary: 'Autonomous archive agents maintain perfect taxonomy — translation accuracy retrieval is instant and reliable.',
            detail: 'Archive agents classify, tag, and organize all content using your translation accuracy taxonomy automatically. You evolve the taxonomy structure while the system maintains it flawlessly.',
          },
        },
        'legal-compliance-gate': {
          preAI: {
            summary: 'Legal compliance gates create unpredictable holds that delay your translation accuracy deadlines.',
            detail: 'Legal sign-off timing is opaque and variable. Your translation accuracy timelines are at the mercy of legal review queues with no visibility into status.',
          },
          aiAgents: {
            summary: 'AI pre-screening reduces legal gate delays by resolving routine translation accuracy checks automatically.',
            detail: 'Compliance agents handle standard checks and only escalate translation accuracy edge cases to human lawyers. Your timelines are more predictable because routine items clear faster.',
          },
          aiAgentic: {
            summary: 'Autonomous compliance gates clear routine content instantly — only novel translation accuracy risks reach human lawyers.',
            detail: 'Compliance agents handle standard legal checks autonomously using your translation accuracy risk framework. Human review is reserved for unprecedented scenarios and policy updates.',
          },
        },
        'segment-mapping': {
          preAI: {
            summary: 'Segment mapping is manual spreadsheet work with limited visibility into translation accuracy impact.',
            detail: 'Mapping content variants to audience segments is done in spreadsheets. Your translation accuracy data is disconnected from the personalization logic.',
          },
          aiAgents: {
            summary: 'AI agents map variants to segments using translation accuracy data from the CDP.',
            detail: 'Segment agents recommend variant-audience matches based on your translation accuracy signals. You review the mapping rather than building it manually in spreadsheets.',
          },
          aiAgentic: {
            summary: 'Autonomous segment agents map and optimize variant-audience matches using live translation accuracy signals.',
            detail: 'Segment agents continuously refine variant-audience mappings based on real-time translation accuracy data. You define segmentation strategy while the system executes and optimizes automatically.',
          },
        },
        'dynamic-assembly': {
          preAI: {
            summary: 'Dynamic content assembly is rigid and template-bound, limiting your translation accuracy options.',
            detail: 'Personalized experiences require engineering support for each variant. Your translation accuracy vision is constrained by inflexible assembly templates.',
          },
          aiAgents: {
            summary: 'AI assembly agents construct personalized experiences informed by translation accuracy rules.',
            detail: 'Assembly agents combine content components per segment following your translation accuracy logic. You define rules and review outputs rather than manually configuring each variant.',
          },
          aiAgentic: {
            summary: 'Autonomous assembly agents construct personalized experiences in real time — translation accuracy logic is self-optimizing.',
            detail: 'Assembly agents build dynamic experiences per segment using your translation accuracy rules and real-time behavioral signals. You govern personalization policies, not individual assembly configurations.',
          },
        },
        'personalization-qa': {
          preAI: {
            summary: 'Personalization QA is manual spot-checking that misses translation accuracy gaps.',
            detail: 'Testing every segment-variant combination is impossible manually. Your translation accuracy concerns are only caught when users report issues post-launch.',
          },
          aiAgents: {
            summary: 'AI QA agents validate personalization coverage and flag translation accuracy gaps before launch.',
            detail: 'QA agents test every segment-variant combination against your translation accuracy requirements. You review exception reports rather than manually spot-checking combinations.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents validate every personalization scenario — translation accuracy gaps are caught before launch.',
            detail: 'Personalization QA agents test all segment-variant combinations against your translation accuracy requirements automatically. You set acceptance criteria while the system validates at scale.',
          },
        },
        'campaign-planning': {
          preAI: {
            summary: 'Campaign planning is a manual coordination effort with fragmented translation accuracy inputs.',
            detail: 'Campaign plans are built in decks and spreadsheets with incomplete data. Your translation accuracy perspective is often incorporated too late in the planning cycle.',
          },
          aiAgents: {
            summary: 'AI planning agents draft campaign frameworks with translation accuracy data pre-integrated.',
            detail: 'Planning agents pull audience, budget, and performance data into campaign templates. Your translation accuracy priorities shape the plan from the start rather than being retrofitted.',
          },
          aiAgentic: {
            summary: 'Autonomous planning agents generate campaign frameworks using translation accuracy intelligence — you set objectives.',
            detail: 'Planning agents produce data-driven campaign plans with your translation accuracy priorities embedded. You define strategic goals while the system optimizes tactics and resource allocation.',
          },
        },
        'consent-check': {
          preAI: {
            summary: 'Consent checking is a manual compliance step that adds friction to your translation accuracy process.',
            detail: 'Verifying GDPR/CCPA consent for targeting requires manual cross-referencing. Your translation accuracy work is delayed while compliance status is manually confirmed.',
          },
          aiAgents: {
            summary: 'AI consent agents verify targeting compliance automatically, reducing translation accuracy friction.',
            detail: 'Consent agents cross-reference CDP signals against GDPR/CCPA rules for your translation accuracy needs. You handle exceptions rather than manually verifying every segment.',
          },
          aiAgentic: {
            summary: 'Autonomous consent agents enforce privacy compliance at scale — translation accuracy is guaranteed by architecture.',
            detail: 'Consent agents verify targeting compliance in real time across all segments using your translation accuracy framework. You set privacy policies while the system enforces them automatically.',
          },
        },
        'paid-creative-production': {
          preAI: {
            summary: 'Paid creative production runs separately from organic, fragmenting your translation accuracy oversight.',
            detail: 'Ad creative and organic content are produced in silos. Your translation accuracy perspective is applied inconsistently between paid and organic channels.',
          },
          aiAgents: {
            summary: 'AI production agents generate paid variants from organic content with translation accuracy consistency.',
            detail: 'Paid creative agents adapt organic content for ad platforms following your translation accuracy guidelines. You approve and fine-tune rather than producing ad creative from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous production agents create paid variants at scale within translation accuracy guardrails — you set the strategy.',
            detail: 'Paid creative agents generate ad variants from organic content following your translation accuracy guidelines. You define creative strategy while the system produces and optimizes at scale.',
          },
        },
        'attribution-modeling': {
          preAI: {
            summary: 'Attribution modeling is manual and unreliable, undermining your translation accuracy reporting.',
            detail: 'Last-click attribution dominates despite its flaws. Your translation accuracy decisions lack the multi-touch perspective needed for accurate performance assessment.',
          },
          aiAgents: {
            summary: 'AI attribution models surface multi-touch insights relevant to your translation accuracy priorities.',
            detail: 'Attribution agents calculate content ROI across channels using your translation accuracy weightings. You interpret strategic implications rather than building models manually.',
          },
          aiAgentic: {
            summary: 'Autonomous attribution agents run multi-touch models continuously — translation accuracy insights update in real time.',
            detail: 'Attribution agents calculate content ROI across all channels using your translation accuracy framework. You interpret strategic implications while the system handles modeling complexity.',
          },
        },
        'executive-reporting': {
          preAI: {
            summary: 'Executive reports are manually assembled, often missing the translation accuracy narrative you need.',
            detail: 'Building executive dashboards takes hours of data wrangling. The translation accuracy story you want to tell is lost in generic reporting templates.',
          },
          aiAgents: {
            summary: 'AI builds executive dashboards with translation accuracy narratives pre-drafted for leadership.',
            detail: 'Reporting agents synthesize data into executive formats with your translation accuracy story embedded. You refine the narrative rather than assembling data from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce executive dashboards with translation accuracy narratives — you add strategic context.',
            detail: 'Executive reporting agents synthesize all data into leadership-ready formats with your translation accuracy story embedded. You provide strategic commentary on auto-generated insights.',
          },
        },
        'competitive-response': {
          preAI: {
            summary: 'Competitive response is slow and reactive, giving you no translation accuracy advantage.',
            detail: 'By the time you spot a competitor move and respond, the moment has passed. Your translation accuracy approach cannot adapt fast enough to real-time competitive signals.',
          },
          aiAgents: {
            summary: 'AI competitive agents surface signals and draft responses aligned with translation accuracy strategy.',
            detail: 'Competitive agents monitor market moves and suggest translation accuracy-aligned responses. You approve and refine reactive content rather than spotting threats manually.',
          },
          aiAgentic: {
            summary: 'Autonomous competitive agents detect and draft responses in real time — translation accuracy moves are countered instantly.',
            detail: 'Competitive agents monitor signals, draft responses, and deploy within your translation accuracy guardrails. You approve high-stakes responses while routine reactions ship autonomously.',
          },
        },
        'content-governance': {
          preAI: {
            summary: 'Content governance is periodic manual auditing that cannot keep pace with your translation accuracy standards.',
            detail: 'Live content drifts out of compliance between infrequent reviews. Your translation accuracy requirements are only enforced when someone manually checks.',
          },
          aiAgents: {
            summary: 'AI governance agents continuously audit live content against translation accuracy standards.',
            detail: 'Governance agents flag content drift, compliance gaps, and translation accuracy issues in real time. You review flagged items rather than conducting manual audits.',
          },
          aiAgentic: {
            summary: 'Autonomous governance agents audit all live content continuously — translation accuracy compliance is always current.',
            detail: 'Governance agents monitor every published piece against your translation accuracy standards in real time. You evolve governance policies while the system enforces them perpetually.',
          },
        },
        'governance-gate': {
          preAI: {
            summary: 'Governance gates are calendar-driven checkpoints disconnected from your translation accuracy rhythm.',
            detail: 'Governance reviews happen on a fixed schedule regardless of content velocity. Your translation accuracy concerns may not surface until the next quarterly review.',
          },
          aiAgents: {
            summary: 'AI governance gates run continuous checks, surfacing translation accuracy issues between formal reviews.',
            detail: 'Governance agents validate live content against your translation accuracy criteria on an ongoing basis. You act on exception alerts rather than waiting for quarterly reviews.',
          },
          aiAgentic: {
            summary: 'Autonomous governance gates run continuously — translation accuracy violations trigger immediate remediation.',
            detail: 'Governance agents validate live content against your translation accuracy criteria continuously and auto-trigger refresh or retirement workflows. You set policies, not review schedules.',
          },
        },
        'journey-mapping': {
          preAI: {
            summary: 'Journey mapping is a manual exercise that rarely reflects your translation accuracy reality.',
            detail: 'Customer journey maps are created in workshops and quickly go stale. Your translation accuracy perspective is a snapshot, not a living view of how content performs at each stage.',
          },
          aiAgents: {
            summary: 'AI journey agents map content to lifecycle stages using translation accuracy data from the CDP.',
            detail: 'Journey agents dynamically map content to customer stages based on your translation accuracy framework. You validate the mapping rather than building it manually in workshops.',
          },
          aiAgentic: {
            summary: 'Autonomous journey agents maintain living maps using real-time translation accuracy data — you shape the strategy.',
            detail: 'Journey agents dynamically map content to lifecycle stages using live translation accuracy signals. You define journey frameworks while the system optimizes content placement continuously.',
          },
        },
        'sentiment-monitoring': {
          preAI: {
            summary: 'Sentiment monitoring is sporadic manual checking with no systematic link to translation accuracy.',
            detail: 'You check brand sentiment reactively rather than proactively. Your translation accuracy decisions are made without real-time audience feedback signals.',
          },
          aiAgents: {
            summary: 'AI sentiment agents track brand reception in real time, alerting you to translation accuracy risks.',
            detail: 'Sentiment agents analyze audience reactions and flag translation accuracy concerns before they escalate. You respond to alerts rather than manually checking platforms.',
          },
          aiAgentic: {
            summary: 'Autonomous sentiment agents monitor and respond to translation accuracy signals around the clock — you govern escalation.',
            detail: 'Sentiment agents track audience reactions and trigger translation accuracy responses automatically. You set escalation thresholds and review strategic implications of sentiment shifts.',
          },
        },
        'sales-enablement': {
          preAI: {
            summary: 'Sales enablement content is created ad hoc, disconnected from your translation accuracy strategy.',
            detail: 'Sales teams request materials outside the content pipeline. Your translation accuracy standards are not applied to battle cards, decks, and one-pagers created in isolation.',
          },
          aiAgents: {
            summary: 'AI agents generate sales materials from marketing content with translation accuracy alignment.',
            detail: 'Sales enablement agents transform marketing assets into battle cards and decks following your translation accuracy standards. You approve rather than creating each piece manually.',
          },
          aiAgentic: {
            summary: 'Autonomous enablement agents keep sales materials current with translation accuracy alignment — you set the playbook.',
            detail: 'Enablement agents automatically update battle cards, decks, and case studies as your translation accuracy data evolves. You define the sales narrative while the system produces materials at scale.',
          },
        },
        'influencer-brief': {
          preAI: {
            summary: 'Influencer briefs are manual documents with limited translation accuracy guardrails.',
            detail: 'Creator briefs are written from scratch each time. Your translation accuracy guidelines are inconsistently communicated to external partners and influencers.',
          },
          aiAgents: {
            summary: 'AI agents draft influencer briefs with translation accuracy guardrails embedded automatically.',
            detail: 'Brief agents generate creator guidelines from your translation accuracy requirements and past successful collaborations. You customize rather than writing each brief from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous brief agents generate creator guidelines with translation accuracy guardrails — you approve partnerships.',
            detail: 'Brief agents produce personalized influencer guidelines using your translation accuracy framework and creator history. You focus on relationship strategy while briefs ship autonomously.',
          },
        },
        'ugc-moderation': {
          preAI: {
            summary: 'UGC moderation is manual screening that cannot scale to protect translation accuracy.',
            detail: 'User-generated content is reviewed one piece at a time. Your translation accuracy standards cannot be consistently enforced across the volume of submissions.',
          },
          aiAgents: {
            summary: 'AI moderation agents screen UGC for brand safety and translation accuracy compliance at scale.',
            detail: 'Moderation agents filter user-generated content against your translation accuracy criteria. You review borderline cases rather than manually screening every submission.',
          },
          aiAgentic: {
            summary: 'Autonomous moderation agents screen all UGC for translation accuracy compliance at scale — you govern edge cases.',
            detail: 'Moderation agents filter user-generated content using your translation accuracy rules continuously. You update moderation policies and review borderline cases that the system escalates.',
          },
        },
        'content-scoring': {
          preAI: {
            summary: 'Content scoring is subjective prioritization that underweights your translation accuracy criteria.',
            detail: 'Requests are prioritized by loudest voice or executive fiat. Your translation accuracy scoring criteria are rarely part of the formal prioritization framework.',
          },
          aiAgents: {
            summary: 'AI scoring agents rank requests using translation accuracy criteria alongside strategic priority.',
            detail: 'Scoring agents weight your translation accuracy factors into the prioritization algorithm. You adjust rankings rather than scoring each request manually.',
          },
          aiAgentic: {
            summary: 'Autonomous scoring agents prioritize the pipeline using translation accuracy criteria — you set strategic weights.',
            detail: 'Scoring agents rank and route content requests using your translation accuracy priorities in real time. You define scoring criteria and review the queue rather than manually triaging.',
          },
        },
        'channel-orchestration': {
          preAI: {
            summary: 'Channel orchestration is manual coordination with no systematic translation accuracy integration.',
            detail: 'Cross-channel timing is managed in spreadsheets and Slack. Your translation accuracy requirements for sequencing and coordination are often overridden by ad hoc changes.',
          },
          aiAgents: {
            summary: 'AI orchestration agents sequence distribution with translation accuracy rules for timing and cadence.',
            detail: 'Orchestration agents coordinate cross-channel timing based on your translation accuracy requirements. You set rules and review the sequence rather than managing each channel individually.',
          },
          aiAgentic: {
            summary: 'Autonomous orchestration agents manage all channel timing with translation accuracy logic — you set the playbook.',
            detail: 'Orchestration agents handle cross-channel sequencing, timing, and coordination autonomously using your translation accuracy rules. You evolve the orchestration strategy while the system executes.',
          },
        },
      },
      keyInsight: 'Cultural adaptation produces more exceptions than any other automated function. This role contracts less than others because ambiguity is the norm, not the exception.',
    },
  },
  {
    id: 'creative-director',
    title: 'Creative Director',
    description: 'Owns visual asset creation and ensures all imagery, graphics, and design elements align with the brand and content brief.',
    tagline: 'Owns the visual layer of every asset.',
    iconName: 'Paintbrush',
    category: 'creative',
    accentColor: '#B088DD',
    ownedSteps: ['visual-asset-creation'],
    reviewedGates: ['quality-check'],
    relatedAgents: ['writer-agent', 'visual-assets-agent'],
    relatedInputs: ['brand-guide', 'asset-library'],
    narrative: {
      nodeJourneys: {
        'visual-asset-creation': {
          preAI: {
            summary: 'You create every visual asset — hero images, graphics, infographics — working parallel to the writing pipeline.',
            detail: 'Visual work converges with copy at the quality gate. Timelines depend on your personal bandwidth because every asset requires your direct involvement.',
          },
          aiAgents: {
            summary: 'AI-generated imagery and template systems handle routine visual assets — you art-direct rather than produce.',
            detail: 'Routine graphics come from templates. You step in for high-impact creative and set the visual standards the system follows.',
          },
          aiAgentic: {
            summary: 'Visual production scales without you — you curate the asset library and define the system\'s aesthetic.',
            detail: 'Agents produce visually compliant assets at pipeline speed. You ensure they\'re visually compelling. That distinction is the human value this role protects.',
          },
        },
        'quality-check': {
          preAI: {
            summary: 'You assess visual quality alongside editorial quality, ensuring imagery meets creative standards.',
            detail: 'Visual review is subjective and time-consuming. Each asset requires your personal evaluation against brand and creative intent.',
          },
          aiAgents: {
            summary: 'Automated checks handle technical quality — resolution, format, brand palette adherence — while you evaluate creative impact.',
            detail: 'Technical compliance is automated. Your reviews focus on whether the visual work elevates the content or merely accompanies it.',
          },
          aiAgentic: {
            summary: 'Technically compliant visuals auto-pass — you review only assets where creative judgment determines the outcome.',
            detail: 'Aesthetic judgment — the gap between compliant and compelling — is the part of this gate that doesn\'t automate. You see fewer assets, but each review carries more creative weight.',
          },
        },
        'receive-request': {
          preAI: {
            summary: 'You direct incoming requests manually, sorting through emails and Slack messages for visual excellence.',
            detail: 'Requests arrive in inconsistent formats with no standard intake process. You spend hours triaging and clarifying scope before visual excellence can even begin.',
          },
          aiAgents: {
            summary: 'An AI intake agent structures requests and flags visual excellence implications before they reach your queue.',
            detail: 'Requests arrive pre-categorized with visual excellence signals highlighted. You validate and prioritize rather than manually parsing raw inputs.',
          },
          aiAgentic: {
            summary: 'Autonomous intake agents triage, validate, and route requests with visual excellence logic — you govern exceptions.',
            detail: 'Agentic intake handles end-to-end request processing with your visual excellence rules embedded. You set policies and review escalations while routine requests flow automatically.',
          },
        },
        'research-insights': {
          preAI: {
            summary: 'You gather audience and market research manually, compiling data from multiple sources for visual excellence.',
            detail: 'Research is scattered across tools, reports, and tribal knowledge. Building a complete picture for visual excellence takes days and the data is often stale by the time you use it.',
          },
          aiAgents: {
            summary: 'AI research tools surface audience and market data relevant to your visual excellence needs automatically.',
            detail: 'Research agents pull relevant data from multiple sources and present visual excellence insights in a structured format. You curate and interpret rather than gather.',
          },
          aiAgentic: {
            summary: 'Autonomous research agents continuously update visual excellence intelligence — you set the strategic lens.',
            detail: 'Research agents proactively surface visual excellence insights from market signals, audience data, and competitive movements. You shape research priorities, not execute searches.',
          },
        },
        'write-brief': {
          preAI: {
            summary: 'You wait for briefs written by hand, often lacking the visual excellence detail you need.',
            detail: 'Briefs arrive incomplete or misaligned with your visual excellence requirements. You spend cycles requesting revisions and clarifying expectations before work can proceed.',
          },
          aiAgents: {
            summary: 'AI drafts briefs with visual excellence requirements pre-populated from templates and past projects.',
            detail: 'Brief generation agents pull your visual excellence requirements into structured templates. You review and refine rather than starting from a blank page.',
          },
          aiAgentic: {
            summary: 'Autonomous agents generate complete briefs with visual excellence alignment built in — you approve strategy.',
            detail: 'Brief agents produce publication-ready briefs that embed your visual excellence requirements from historical patterns. You govern strategic direction rather than reviewing drafts.',
          },
        },
        'draft-content': {
          preAI: {
            summary: 'You review drafts created entirely by hand, checking each one for alignment with visual excellence.',
            detail: 'First drafts vary wildly in quality and visual excellence alignment. You often send content back for multiple revision cycles, creating bottlenecks in the pipeline.',
          },
          aiAgents: {
            summary: 'AI generates first drafts with visual excellence guidelines embedded, reducing your revision cycles.',
            detail: 'Drafting agents produce content aligned with your visual excellence standards from the start. You focus on strategic refinement rather than basic corrections.',
          },
          aiAgentic: {
            summary: 'Autonomous drafting agents produce content meeting visual excellence standards — you set creative direction.',
            detail: 'Drafting agents generate content that passes your visual excellence criteria automatically. You focus on strategic vision and creative differentiation rather than quality control.',
          },
        },
        'seo-optimization': {
          preAI: {
            summary: 'SEO optimization is manual and disconnected from your visual excellence priorities.',
            detail: 'Keyword research and meta optimization happen separately from your visual excellence workflow. You rarely see SEO data until after content is already in review.',
          },
          aiAgents: {
            summary: 'AI SEO tools optimize content while preserving your visual excellence priorities.',
            detail: 'SEO agents suggest keywords and meta improvements that align with your visual excellence goals. You approve optimizations rather than manually researching keywords.',
          },
          aiAgentic: {
            summary: 'Autonomous SEO agents optimize continuously within visual excellence boundaries — you define the strategy.',
            detail: 'SEO agents self-optimize content based on real-time search signals and your visual excellence guardrails. You set strategic keywords and constraints, not individual page optimizations.',
          },
        },
        'brand-compliance': {
          preAI: {
            summary: 'Brand checks are subjective and slow, creating delays in your visual excellence workflow.',
            detail: 'Brand reviewers interpret guidelines differently. Inconsistent enforcement of tone, terminology, and messaging means visual excellence is harder to maintain at scale.',
          },
          aiAgents: {
            summary: 'AI brand checkers flag violations and score visual excellence alignment before human review.',
            detail: 'Brand agents scan content against guidelines and highlight visual excellence issues. You make judgment calls on edge cases rather than catching basic violations.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents enforce compliance at scale with visual excellence rules — you update the rulebook.',
            detail: 'Brand agents apply and evolve compliance checks across all content automatically. Your visual excellence standards are codified as machine-enforceable rules that you govern and refine.',
          },
        },
        'final-edit': {
          preAI: {
            summary: 'Final edits depend entirely on editor availability, blocking your visual excellence timelines.',
            detail: 'A single editor bottleneck means content waits in queue. Your visual excellence deadlines slip because there is no way to parallelize the final polish step.',
          },
          aiAgents: {
            summary: 'AI editing assistants handle mechanical fixes, freeing your visual excellence focus for strategic polish.',
            detail: 'Editing agents catch grammar, style, and consistency issues automatically. Your visual excellence perspective is reserved for nuance and narrative quality.',
          },
          aiAgentic: {
            summary: 'Autonomous editing agents polish content to publication standard — your visual excellence bar is encoded as policy.',
            detail: 'Editing agents handle all mechanical and stylistic refinement autonomously. Your visual excellence standards are embedded as editorial policies that improve with each iteration.',
          },
        },
        'schedule-publish': {
          preAI: {
            summary: 'Publishing is a manual CMS process with no connection to your visual excellence planning.',
            detail: 'Each piece requires manual scheduling, metadata entry, and CMS configuration. Your visual excellence goals are disconnected from the publish timeline.',
          },
          aiAgents: {
            summary: 'AI scheduling agents suggest optimal publish timing based on visual excellence data.',
            detail: 'Publishing agents recommend times and configurations informed by your visual excellence priorities. You approve the schedule rather than manually configuring CMS settings.',
          },
          aiAgentic: {
            summary: 'Autonomous publishing agents manage scheduling end-to-end using visual excellence optimization logic.',
            detail: 'Publishing agents handle CMS configuration, timing optimization, and deployment autonomously within your visual excellence constraints. You set publishing policies, not individual schedules.',
          },
        },
        'distribute': {
          preAI: {
            summary: 'Content distribution is manual channel-by-channel, with limited visibility into visual excellence.',
            detail: 'Each channel requires separate formatting, scheduling, and posting. There is no unified view of how distribution supports your visual excellence objectives.',
          },
          aiAgents: {
            summary: 'AI distribution agents adapt content per channel with visual excellence rules built in.',
            detail: 'Distribution agents format and deploy content across channels following your visual excellence guidelines. You monitor and adjust rather than manually posting to each platform.',
          },
          aiAgentic: {
            summary: 'Autonomous distribution agents manage all channels with visual excellence rules — you govern the playbook.',
            detail: 'Distribution agents deploy, adapt, and optimize content across every channel following your visual excellence playbook. You evolve distribution strategy, not execute individual channel posts.',
          },
        },
        'track-performance': {
          preAI: {
            summary: 'Performance tracking is fragmented across tools, making visual excellence assessment difficult.',
            detail: 'You pull data from analytics dashboards, social platforms, and CRM separately. Building a complete picture for visual excellence requires manual data stitching.',
          },
          aiAgents: {
            summary: 'AI dashboards surface visual excellence metrics in real time without manual data pulling.',
            detail: 'Performance agents aggregate data and highlight the visual excellence signals that matter to you. You analyze trends rather than building dashboards from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous tracking agents monitor visual excellence metrics continuously and trigger alerts and actions.',
            detail: 'Performance agents stream visual excellence data and automatically trigger optimization workflows when thresholds are breached. You define KPIs and review strategic implications.',
          },
        },
        'generate-report': {
          preAI: {
            summary: 'Reports are built manually in spreadsheets, often missing the visual excellence metrics you need.',
            detail: 'Report creation takes hours of data gathering and formatting. The metrics that matter for visual excellence are often buried or missing entirely from standard templates.',
          },
          aiAgents: {
            summary: 'AI generates reports with visual excellence metrics pre-formatted and insights highlighted.',
            detail: 'Reporting agents compile your visual excellence data into structured templates with automated analysis. You add strategic narrative rather than wrangling data.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce visual excellence reports on demand with strategic recommendations.',
            detail: 'Reporting agents generate visual excellence analyses with actionable recommendations automatically. You consume insights and set strategic direction rather than producing reports.',
          },
        },
        'optimize': {
          preAI: {
            summary: 'Content optimization is reactive and slow, with limited connection to visual excellence data.',
            detail: 'Optimization decisions rely on gut feel and delayed data. Your visual excellence insights rarely feed back into content updates in a timely way.',
          },
          aiAgents: {
            summary: 'AI recommends optimizations based on visual excellence signals and historical performance.',
            detail: 'Optimization agents suggest specific changes tied to your visual excellence metrics. You approve and prioritize recommendations rather than diagnosing issues manually.',
          },
          aiAgentic: {
            summary: 'Autonomous optimization agents improve content continuously using visual excellence signals — you set boundaries.',
            detail: 'Optimization agents test, iterate, and improve content based on visual excellence data within your guardrails. You define acceptable ranges and review significant changes.',
          },
        },
        'brief-approval': {
          preAI: {
            summary: 'Brief approvals are bottlenecked by manual review cycles that delay your visual excellence work.',
            detail: 'You wait for briefs to pass through approval chains before your visual excellence tasks can begin. Unclear approval criteria mean briefs bounce back and forth repeatedly.',
          },
          aiAgents: {
            summary: 'AI pre-screens briefs for visual excellence alignment, routing only exceptions to you.',
            detail: 'Approval agents check briefs against your visual excellence criteria and flag gaps. You review flagged items rather than reading every brief end to end.',
          },
          aiAgentic: {
            summary: 'Autonomous approval agents clear standard briefs and escalate only visual excellence exceptions to you.',
            detail: 'Approval agents validate briefs against your visual excellence criteria and auto-approve routine requests. You handle strategic exceptions and edge cases only.',
          },
        },
        'brand-review': {
          preAI: {
            summary: 'Brand reviews are subjective gates that slow your visual excellence pipeline.',
            detail: 'Reviewers apply brand guidelines inconsistently. What passes one review fails the next, creating unpredictable delays in your visual excellence workflow.',
          },
          aiAgents: {
            summary: 'AI brand agents pre-score content, surfacing visual excellence issues before your review.',
            detail: 'Brand review agents apply guidelines consistently and flag visual excellence deviations. You handle exceptions and judgment calls rather than full content scans.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents review all content at scale — you govern visual excellence policy evolution.',
            detail: 'Brand review agents handle all compliance checking autonomously with your visual excellence rules. You update brand guidelines and review the rare edge case that requires human judgment.',
          },
        },
        'stakeholder-signoff': {
          preAI: {
            summary: 'Stakeholder sign-off is a bottleneck where executives delay your visual excellence timelines.',
            detail: 'Senior approvers are busy and unresponsive. Your visual excellence work stalls while waiting for sign-off, and last-minute changes create downstream chaos.',
          },
          aiAgents: {
            summary: 'AI prepares sign-off packages with visual excellence summaries for faster executive approval.',
            detail: 'Sign-off agents compile context, changes, and visual excellence impact assessments for approvers. Executives review structured summaries rather than raw content.',
          },
          aiAgentic: {
            summary: 'Autonomous agents handle routine sign-offs within visual excellence parameters — executives approve strategy only.',
            detail: 'Sign-off agents clear content that meets all visual excellence criteria automatically. Executives only review strategic pivots or high-risk content that breaches defined thresholds.',
          },
        },
        'performance-review': {
          preAI: {
            summary: 'Performance reviews are infrequent manual assessments that underserve your visual excellence needs.',
            detail: 'Reviews happen quarterly at best, using outdated data. Your visual excellence perspective is often missing from the evaluation criteria entirely.',
          },
          aiAgents: {
            summary: 'AI evaluates content against KPIs and highlights visual excellence trends for your review.',
            detail: 'Review agents surface performance data with visual excellence context pre-attached. You make optimize/archive decisions based on structured analysis rather than raw metrics.',
          },
          aiAgentic: {
            summary: 'Autonomous review agents evaluate and act on performance with visual excellence logic — you set the framework.',
            detail: 'Review agents continuously assess content against your visual excellence KPIs and trigger optimize/refresh/archive workflows automatically. You define the evaluation framework.',
          },
        },
        'social-listening': {
          preAI: {
            summary: 'Social listening is ad hoc keyword monitoring with no systematic link to visual excellence.',
            detail: 'You check social platforms manually for relevant conversations. Insights rarely reach your visual excellence workflow before they become stale or irrelevant.',
          },
          aiAgents: {
            summary: 'AI monitoring tools surface trending topics and sentiment relevant to visual excellence in real time.',
            detail: 'Listening agents track conversations and flag visual excellence signals across platforms. You act on curated insights rather than monitoring feeds manually.',
          },
          aiAgentic: {
            summary: 'Autonomous listening agents track and respond to visual excellence signals across all platforms in real time.',
            detail: 'Listening agents monitor social channels and proactively surface visual excellence opportunities and risks. You set monitoring priorities and review strategic findings.',
          },
        },
        'legal-review': {
          preAI: {
            summary: 'Legal review is an opaque process that creates unpredictable delays in your visual excellence work.',
            detail: 'Legal feedback arrives late with minimal context. You cannot predict how long review will take, making visual excellence planning unreliable.',
          },
          aiAgents: {
            summary: 'AI legal screening flags compliance risks early, reducing visual excellence surprises downstream.',
            detail: 'Legal agents pre-scan content for regulatory issues and visual excellence risks. You get early warnings rather than discovering problems at the sign-off stage.',
          },
          aiAgentic: {
            summary: 'Autonomous legal agents clear routine content and escalate only true visual excellence risks to human counsel.',
            detail: 'Legal agents scan and clear standard content autonomously using your visual excellence rule framework. Human lawyers handle novel risk scenarios and precedent-setting decisions only.',
          },
        },
        'accessibility-check': {
          preAI: {
            summary: 'Accessibility checking is a manual afterthought, rarely connected to your visual excellence process.',
            detail: 'WCAG compliance and inclusive language reviews happen late in the pipeline. Your visual excellence work is already done when accessibility issues force rework.',
          },
          aiAgents: {
            summary: 'AI accessibility tools catch WCAG violations automatically, protecting your visual excellence standards.',
            detail: 'Accessibility agents scan for inclusive language and alt-text compliance. Your visual excellence requirements benefit from automated baseline checks before human review.',
          },
          aiAgentic: {
            summary: 'Autonomous accessibility agents enforce WCAG and inclusive standards — visual excellence is guaranteed by default.',
            detail: 'Accessibility agents ensure all content meets compliance standards before publication. Your visual excellence benefits from guaranteed accessibility without manual checking overhead.',
          },
        },
        'localize-content': {
          preAI: {
            summary: 'Localization is a slow, manual translation process that delays your visual excellence for global markets.',
            detail: 'Each market requires separate translation, cultural review, and compliance checking. Your visual excellence suffers because localized versions lag weeks behind the original.',
          },
          aiAgents: {
            summary: 'AI translation agents accelerate localization while respecting visual excellence requirements.',
            detail: 'Localization agents produce initial translations with visual excellence context preserved. You review for cultural nuance rather than translating from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous localization agents adapt content for all markets simultaneously — your visual excellence scales globally.',
            detail: 'Localization agents handle translation, cultural adaptation, and regional compliance autonomously. Your visual excellence is maintained across markets without manual per-locale effort.',
          },
        },
        'ab-variant-creation': {
          preAI: {
            summary: 'A/B variants are created manually with limited connection to your visual excellence hypotheses.',
            detail: 'Test variants rely on guesswork rather than data. Your visual excellence insights rarely inform variant design, reducing the value of testing efforts.',
          },
          aiAgents: {
            summary: 'AI generates test variants informed by visual excellence data and historical performance.',
            detail: 'Variant agents create headlines, CTAs, and imagery options based on your visual excellence hypotheses. You select winning approaches rather than brainstorming from zero.',
          },
          aiAgentic: {
            summary: 'Autonomous variant agents design, deploy, and learn from tests using visual excellence hypotheses — you set the agenda.',
            detail: 'Variant agents run continuous testing experiments informed by your visual excellence objectives. You define what to test and review strategic learnings while the system iterates autonomously.',
          },
        },
        'content-repurposing': {
          preAI: {
            summary: 'Content repurposing is manual reformatting, disconnected from your visual excellence goals.',
            detail: 'Each derivative asset is created from scratch. Your visual excellence requirements are not systematically applied when repurposing content across formats.',
          },
          aiAgents: {
            summary: 'AI repurposing agents derive secondary assets with visual excellence consistency built in.',
            detail: 'Repurposing agents transform primary content into channel-specific formats following your visual excellence guidelines. You approve derivatives rather than recreating each manually.',
          },
          aiAgentic: {
            summary: 'Autonomous repurposing agents derive all secondary assets automatically within visual excellence guidelines.',
            detail: 'Repurposing agents transform primary content into every derivative format following your visual excellence rules. You set format strategy while the system handles production at scale.',
          },
        },
        'archive-tag': {
          preAI: {
            summary: 'Content archiving is inconsistent, making visual excellence-related retrieval nearly impossible.',
            detail: 'Tagging and taxonomy are applied inconsistently or not at all. Finding past content relevant to visual excellence requires searching through unstructured repositories.',
          },
          aiAgents: {
            summary: 'AI tagging agents classify content automatically, making visual excellence retrieval faster.',
            detail: 'Archive agents apply taxonomy and metadata based on your visual excellence categories. You validate classifications rather than manually tagging every asset.',
          },
          aiAgentic: {
            summary: 'Autonomous archive agents maintain perfect taxonomy — visual excellence retrieval is instant and reliable.',
            detail: 'Archive agents classify, tag, and organize all content using your visual excellence taxonomy automatically. You evolve the taxonomy structure while the system maintains it flawlessly.',
          },
        },
        'legal-compliance-gate': {
          preAI: {
            summary: 'Legal compliance gates create unpredictable holds that delay your visual excellence deadlines.',
            detail: 'Legal sign-off timing is opaque and variable. Your visual excellence timelines are at the mercy of legal review queues with no visibility into status.',
          },
          aiAgents: {
            summary: 'AI pre-screening reduces legal gate delays by resolving routine visual excellence checks automatically.',
            detail: 'Compliance agents handle standard checks and only escalate visual excellence edge cases to human lawyers. Your timelines are more predictable because routine items clear faster.',
          },
          aiAgentic: {
            summary: 'Autonomous compliance gates clear routine content instantly — only novel visual excellence risks reach human lawyers.',
            detail: 'Compliance agents handle standard legal checks autonomously using your visual excellence risk framework. Human review is reserved for unprecedented scenarios and policy updates.',
          },
        },
        'localization-quality-gate': {
          preAI: {
            summary: 'Localization quality gates are inconsistent, creating visual excellence risks in global markets.',
            detail: 'Quality checks for localized content vary by market and reviewer. Your visual excellence standards are unevenly applied across regions and languages.',
          },
          aiAgents: {
            summary: 'AI quality checks catch translation errors before they affect your visual excellence outcomes.',
            detail: 'Localization QA agents verify accuracy and cultural fit automatically. Your visual excellence standards are applied consistently across all target markets.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents ensure localization quality across all markets — visual excellence is guaranteed globally.',
            detail: 'Localization QA agents validate every market adaptation autonomously against your visual excellence standards. You set quality criteria while the system enforces them at scale.',
          },
        },
        'segment-mapping': {
          preAI: {
            summary: 'Segment mapping is manual spreadsheet work with limited visibility into visual excellence impact.',
            detail: 'Mapping content variants to audience segments is done in spreadsheets. Your visual excellence data is disconnected from the personalization logic.',
          },
          aiAgents: {
            summary: 'AI agents map variants to segments using visual excellence data from the CDP.',
            detail: 'Segment agents recommend variant-audience matches based on your visual excellence signals. You review the mapping rather than building it manually in spreadsheets.',
          },
          aiAgentic: {
            summary: 'Autonomous segment agents map and optimize variant-audience matches using live visual excellence signals.',
            detail: 'Segment agents continuously refine variant-audience mappings based on real-time visual excellence data. You define segmentation strategy while the system executes and optimizes automatically.',
          },
        },
        'dynamic-assembly': {
          preAI: {
            summary: 'Dynamic content assembly is rigid and template-bound, limiting your visual excellence options.',
            detail: 'Personalized experiences require engineering support for each variant. Your visual excellence vision is constrained by inflexible assembly templates.',
          },
          aiAgents: {
            summary: 'AI assembly agents construct personalized experiences informed by visual excellence rules.',
            detail: 'Assembly agents combine content components per segment following your visual excellence logic. You define rules and review outputs rather than manually configuring each variant.',
          },
          aiAgentic: {
            summary: 'Autonomous assembly agents construct personalized experiences in real time — visual excellence logic is self-optimizing.',
            detail: 'Assembly agents build dynamic experiences per segment using your visual excellence rules and real-time behavioral signals. You govern personalization policies, not individual assembly configurations.',
          },
        },
        'personalization-qa': {
          preAI: {
            summary: 'Personalization QA is manual spot-checking that misses visual excellence gaps.',
            detail: 'Testing every segment-variant combination is impossible manually. Your visual excellence concerns are only caught when users report issues post-launch.',
          },
          aiAgents: {
            summary: 'AI QA agents validate personalization coverage and flag visual excellence gaps before launch.',
            detail: 'QA agents test every segment-variant combination against your visual excellence requirements. You review exception reports rather than manually spot-checking combinations.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents validate every personalization scenario — visual excellence gaps are caught before launch.',
            detail: 'Personalization QA agents test all segment-variant combinations against your visual excellence requirements automatically. You set acceptance criteria while the system validates at scale.',
          },
        },
        'campaign-planning': {
          preAI: {
            summary: 'Campaign planning is a manual coordination effort with fragmented visual excellence inputs.',
            detail: 'Campaign plans are built in decks and spreadsheets with incomplete data. Your visual excellence perspective is often incorporated too late in the planning cycle.',
          },
          aiAgents: {
            summary: 'AI planning agents draft campaign frameworks with visual excellence data pre-integrated.',
            detail: 'Planning agents pull audience, budget, and performance data into campaign templates. Your visual excellence priorities shape the plan from the start rather than being retrofitted.',
          },
          aiAgentic: {
            summary: 'Autonomous planning agents generate campaign frameworks using visual excellence intelligence — you set objectives.',
            detail: 'Planning agents produce data-driven campaign plans with your visual excellence priorities embedded. You define strategic goals while the system optimizes tactics and resource allocation.',
          },
        },
        'consent-check': {
          preAI: {
            summary: 'Consent checking is a manual compliance step that adds friction to your visual excellence process.',
            detail: 'Verifying GDPR/CCPA consent for targeting requires manual cross-referencing. Your visual excellence work is delayed while compliance status is manually confirmed.',
          },
          aiAgents: {
            summary: 'AI consent agents verify targeting compliance automatically, reducing visual excellence friction.',
            detail: 'Consent agents cross-reference CDP signals against GDPR/CCPA rules for your visual excellence needs. You handle exceptions rather than manually verifying every segment.',
          },
          aiAgentic: {
            summary: 'Autonomous consent agents enforce privacy compliance at scale — visual excellence is guaranteed by architecture.',
            detail: 'Consent agents verify targeting compliance in real time across all segments using your visual excellence framework. You set privacy policies while the system enforces them automatically.',
          },
        },
        'paid-creative-production': {
          preAI: {
            summary: 'Paid creative production runs separately from organic, fragmenting your visual excellence oversight.',
            detail: 'Ad creative and organic content are produced in silos. Your visual excellence perspective is applied inconsistently between paid and organic channels.',
          },
          aiAgents: {
            summary: 'AI production agents generate paid variants from organic content with visual excellence consistency.',
            detail: 'Paid creative agents adapt organic content for ad platforms following your visual excellence guidelines. You approve and fine-tune rather than producing ad creative from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous production agents create paid variants at scale within visual excellence guardrails — you set the strategy.',
            detail: 'Paid creative agents generate ad variants from organic content following your visual excellence guidelines. You define creative strategy while the system produces and optimizes at scale.',
          },
        },
        'attribution-modeling': {
          preAI: {
            summary: 'Attribution modeling is manual and unreliable, undermining your visual excellence reporting.',
            detail: 'Last-click attribution dominates despite its flaws. Your visual excellence decisions lack the multi-touch perspective needed for accurate performance assessment.',
          },
          aiAgents: {
            summary: 'AI attribution models surface multi-touch insights relevant to your visual excellence priorities.',
            detail: 'Attribution agents calculate content ROI across channels using your visual excellence weightings. You interpret strategic implications rather than building models manually.',
          },
          aiAgentic: {
            summary: 'Autonomous attribution agents run multi-touch models continuously — visual excellence insights update in real time.',
            detail: 'Attribution agents calculate content ROI across all channels using your visual excellence framework. You interpret strategic implications while the system handles modeling complexity.',
          },
        },
        'executive-reporting': {
          preAI: {
            summary: 'Executive reports are manually assembled, often missing the visual excellence narrative you need.',
            detail: 'Building executive dashboards takes hours of data wrangling. The visual excellence story you want to tell is lost in generic reporting templates.',
          },
          aiAgents: {
            summary: 'AI builds executive dashboards with visual excellence narratives pre-drafted for leadership.',
            detail: 'Reporting agents synthesize data into executive formats with your visual excellence story embedded. You refine the narrative rather than assembling data from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce executive dashboards with visual excellence narratives — you add strategic context.',
            detail: 'Executive reporting agents synthesize all data into leadership-ready formats with your visual excellence story embedded. You provide strategic commentary on auto-generated insights.',
          },
        },
        'competitive-response': {
          preAI: {
            summary: 'Competitive response is slow and reactive, giving you no visual excellence advantage.',
            detail: 'By the time you spot a competitor move and respond, the moment has passed. Your visual excellence approach cannot adapt fast enough to real-time competitive signals.',
          },
          aiAgents: {
            summary: 'AI competitive agents surface signals and draft responses aligned with visual excellence strategy.',
            detail: 'Competitive agents monitor market moves and suggest visual excellence-aligned responses. You approve and refine reactive content rather than spotting threats manually.',
          },
          aiAgentic: {
            summary: 'Autonomous competitive agents detect and draft responses in real time — visual excellence moves are countered instantly.',
            detail: 'Competitive agents monitor signals, draft responses, and deploy within your visual excellence guardrails. You approve high-stakes responses while routine reactions ship autonomously.',
          },
        },
        'content-governance': {
          preAI: {
            summary: 'Content governance is periodic manual auditing that cannot keep pace with your visual excellence standards.',
            detail: 'Live content drifts out of compliance between infrequent reviews. Your visual excellence requirements are only enforced when someone manually checks.',
          },
          aiAgents: {
            summary: 'AI governance agents continuously audit live content against visual excellence standards.',
            detail: 'Governance agents flag content drift, compliance gaps, and visual excellence issues in real time. You review flagged items rather than conducting manual audits.',
          },
          aiAgentic: {
            summary: 'Autonomous governance agents audit all live content continuously — visual excellence compliance is always current.',
            detail: 'Governance agents monitor every published piece against your visual excellence standards in real time. You evolve governance policies while the system enforces them perpetually.',
          },
        },
        'governance-gate': {
          preAI: {
            summary: 'Governance gates are calendar-driven checkpoints disconnected from your visual excellence rhythm.',
            detail: 'Governance reviews happen on a fixed schedule regardless of content velocity. Your visual excellence concerns may not surface until the next quarterly review.',
          },
          aiAgents: {
            summary: 'AI governance gates run continuous checks, surfacing visual excellence issues between formal reviews.',
            detail: 'Governance agents validate live content against your visual excellence criteria on an ongoing basis. You act on exception alerts rather than waiting for quarterly reviews.',
          },
          aiAgentic: {
            summary: 'Autonomous governance gates run continuously — visual excellence violations trigger immediate remediation.',
            detail: 'Governance agents validate live content against your visual excellence criteria continuously and auto-trigger refresh or retirement workflows. You set policies, not review schedules.',
          },
        },
        'journey-mapping': {
          preAI: {
            summary: 'Journey mapping is a manual exercise that rarely reflects your visual excellence reality.',
            detail: 'Customer journey maps are created in workshops and quickly go stale. Your visual excellence perspective is a snapshot, not a living view of how content performs at each stage.',
          },
          aiAgents: {
            summary: 'AI journey agents map content to lifecycle stages using visual excellence data from the CDP.',
            detail: 'Journey agents dynamically map content to customer stages based on your visual excellence framework. You validate the mapping rather than building it manually in workshops.',
          },
          aiAgentic: {
            summary: 'Autonomous journey agents maintain living maps using real-time visual excellence data — you shape the strategy.',
            detail: 'Journey agents dynamically map content to lifecycle stages using live visual excellence signals. You define journey frameworks while the system optimizes content placement continuously.',
          },
        },
        'sentiment-monitoring': {
          preAI: {
            summary: 'Sentiment monitoring is sporadic manual checking with no systematic link to visual excellence.',
            detail: 'You check brand sentiment reactively rather than proactively. Your visual excellence decisions are made without real-time audience feedback signals.',
          },
          aiAgents: {
            summary: 'AI sentiment agents track brand reception in real time, alerting you to visual excellence risks.',
            detail: 'Sentiment agents analyze audience reactions and flag visual excellence concerns before they escalate. You respond to alerts rather than manually checking platforms.',
          },
          aiAgentic: {
            summary: 'Autonomous sentiment agents monitor and respond to visual excellence signals around the clock — you govern escalation.',
            detail: 'Sentiment agents track audience reactions and trigger visual excellence responses automatically. You set escalation thresholds and review strategic implications of sentiment shifts.',
          },
        },
        'sales-enablement': {
          preAI: {
            summary: 'Sales enablement content is created ad hoc, disconnected from your visual excellence strategy.',
            detail: 'Sales teams request materials outside the content pipeline. Your visual excellence standards are not applied to battle cards, decks, and one-pagers created in isolation.',
          },
          aiAgents: {
            summary: 'AI agents generate sales materials from marketing content with visual excellence alignment.',
            detail: 'Sales enablement agents transform marketing assets into battle cards and decks following your visual excellence standards. You approve rather than creating each piece manually.',
          },
          aiAgentic: {
            summary: 'Autonomous enablement agents keep sales materials current with visual excellence alignment — you set the playbook.',
            detail: 'Enablement agents automatically update battle cards, decks, and case studies as your visual excellence data evolves. You define the sales narrative while the system produces materials at scale.',
          },
        },
        'influencer-brief': {
          preAI: {
            summary: 'Influencer briefs are manual documents with limited visual excellence guardrails.',
            detail: 'Creator briefs are written from scratch each time. Your visual excellence guidelines are inconsistently communicated to external partners and influencers.',
          },
          aiAgents: {
            summary: 'AI agents draft influencer briefs with visual excellence guardrails embedded automatically.',
            detail: 'Brief agents generate creator guidelines from your visual excellence requirements and past successful collaborations. You customize rather than writing each brief from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous brief agents generate creator guidelines with visual excellence guardrails — you approve partnerships.',
            detail: 'Brief agents produce personalized influencer guidelines using your visual excellence framework and creator history. You focus on relationship strategy while briefs ship autonomously.',
          },
        },
        'ugc-moderation': {
          preAI: {
            summary: 'UGC moderation is manual screening that cannot scale to protect visual excellence.',
            detail: 'User-generated content is reviewed one piece at a time. Your visual excellence standards cannot be consistently enforced across the volume of submissions.',
          },
          aiAgents: {
            summary: 'AI moderation agents screen UGC for brand safety and visual excellence compliance at scale.',
            detail: 'Moderation agents filter user-generated content against your visual excellence criteria. You review borderline cases rather than manually screening every submission.',
          },
          aiAgentic: {
            summary: 'Autonomous moderation agents screen all UGC for visual excellence compliance at scale — you govern edge cases.',
            detail: 'Moderation agents filter user-generated content using your visual excellence rules continuously. You update moderation policies and review borderline cases that the system escalates.',
          },
        },
        'content-scoring': {
          preAI: {
            summary: 'Content scoring is subjective prioritization that underweights your visual excellence criteria.',
            detail: 'Requests are prioritized by loudest voice or executive fiat. Your visual excellence scoring criteria are rarely part of the formal prioritization framework.',
          },
          aiAgents: {
            summary: 'AI scoring agents rank requests using visual excellence criteria alongside strategic priority.',
            detail: 'Scoring agents weight your visual excellence factors into the prioritization algorithm. You adjust rankings rather than scoring each request manually.',
          },
          aiAgentic: {
            summary: 'Autonomous scoring agents prioritize the pipeline using visual excellence criteria — you set strategic weights.',
            detail: 'Scoring agents rank and route content requests using your visual excellence priorities in real time. You define scoring criteria and review the queue rather than manually triaging.',
          },
        },
        'channel-orchestration': {
          preAI: {
            summary: 'Channel orchestration is manual coordination with no systematic visual excellence integration.',
            detail: 'Cross-channel timing is managed in spreadsheets and Slack. Your visual excellence requirements for sequencing and coordination are often overridden by ad hoc changes.',
          },
          aiAgents: {
            summary: 'AI orchestration agents sequence distribution with visual excellence rules for timing and cadence.',
            detail: 'Orchestration agents coordinate cross-channel timing based on your visual excellence requirements. You set rules and review the sequence rather than managing each channel individually.',
          },
          aiAgentic: {
            summary: 'Autonomous orchestration agents manage all channel timing with visual excellence logic — you set the playbook.',
            detail: 'Orchestration agents handle cross-channel sequencing, timing, and coordination autonomously using your visual excellence rules. You evolve the orchestration strategy while the system executes.',
          },
        },
      },
      keyInsight: 'Aesthetic judgment — the gap between compliant and compelling — is the part of this role that doesn\'t automate.',
    },
  },
  {
    id: 'growth-lead',
    title: 'Growth Lead',
    description: 'Owns A/B testing strategy, content repurposing, and distribution optimization. Responsible for maximizing content reach and conversion through experimentation.',
    tagline: 'Turns one asset into a channel strategy.',
    iconName: 'Rocket',
    category: 'growth',
    accentColor: '#4CAF50',
    ownedSteps: ['ab-variant-creation', 'content-repurposing', 'segment-mapping', 'paid-creative-production', 'sales-enablement'],
    reviewedGates: ['performance-review'],
    relatedAgents: ['repurposing-agent', 'performance-agent', 'personalization-agent'],
    relatedInputs: ['channel-benchmarks', 'analytics-data', 'content-strategy', 'cdp-profiles', 'personalization-rules', 'media-plan', 'sales-feedback-log'],
    narrative: {
      nodeJourneys: {
        'ab-variant-creation': {
          preAI: {
            summary: 'You design A/B tests manually, creating each variant and defining the success criteria yourself.',
            detail: 'Testing velocity is limited by how fast you can create variants. Most tests are simple A/B splits because multivariate tests require too much production effort.',
          },
          aiAgents: {
            summary: 'An agent generates variant copy and creative from your test hypotheses — you design the experiment, not the assets.',
            detail: 'Variant production is handled. You focus on which hypotheses matter and how to structure tests that generate actionable learning.',
          },
          aiAgentic: {
            summary: 'Variant generation and test execution run continuously — you design the experimentation framework.',
            detail: 'The system creates, deploys, and evaluates variants at scale. Your value is experimental design — knowing which tests will produce learning, not just more data.',
          },
        },
        'content-repurposing': {
          preAI: {
            summary: 'You decide which content gets repurposed to which channels, then manage the adaptation for each format.',
            detail: 'Repurposing is manual — each channel variant is a separate production task. A single blog post might spawn five derivative pieces, each handcrafted.',
          },
          aiAgents: {
            summary: 'A repurposing agent generates channel variants automatically from your distribution strategy.',
            detail: 'Format conversion is handled. You focus on which channels to prioritize and whether the repurposed version actually fits the platform context.',
          },
          aiAgentic: {
            summary: 'Content multiplication happens at pipeline speed — one asset spawns channel-optimized variants automatically.',
            detail: 'The system generates and distributes repurposed content based on your rules. You evaluate whether the multiplication strategy is generating engagement or just volume.',
          },
        },
        'segment-mapping': {
          preAI: {
            summary: 'You map content to audience segments manually, matching assets to personas based on your knowledge of the audience.',
            detail: 'Segment mapping depends on your intuition about what resonates with each audience. Validation happens after publication, not before.',
          },
          aiAgents: {
            summary: 'Personalization agents recommend segment-content matches based on behavioral data and your targeting frameworks.',
            detail: 'Recommendations arrive data-informed. You validate the logic and override when your audience intuition sees something the data doesn\'t.',
          },
          aiAgentic: {
            summary: 'Content routes to segments automatically based on your personalization rules and real-time behavioral signals.',
            detail: 'Segment mapping runs continuously. You refine the rules and handle the segments where behavioral data is too sparse for automated targeting.',
          },
        },
        'paid-creative-production': {
          preAI: {
            summary: 'You produce paid media creative variants, adapting content for ad platforms with format-specific requirements.',
            detail: 'Each paid channel has its own specs, character limits, and creative constraints. Production is repetitive and time-sensitive.',
          },
          aiAgents: {
            summary: 'An agent generates paid creative variants from your campaign brief and performance benchmarks.',
            detail: 'Variant production is automated. You focus on creative strategy — which angles to test and how to allocate budget across variants.',
          },
          aiAgentic: {
            summary: 'Paid creative generation, testing, and budget reallocation run as a closed loop within your strategic guardrails.',
            detail: 'The system produces, tests, and optimizes paid creative continuously. You set the creative direction and budget boundaries; agents handle execution and optimization.',
          },
        },
        'sales-enablement': {
          preAI: {
            summary: 'You create sales-ready content — decks, one-pagers, battle cards — by manually adapting marketing assets.',
            detail: 'Sales content is often requested urgently and produced ad hoc. Quality varies because each piece is a custom job.',
          },
          aiAgents: {
            summary: 'An agent adapts marketing content into sales formats using your templates and sales feedback data.',
            detail: 'Sales enablement content generates from templates. You review for strategic accuracy and ensure the sales narrative aligns with the marketing story.',
          },
          aiAgentic: {
            summary: 'Sales content auto-generates when marketing assets publish — the sales team gets enablement materials without requesting them.',
            detail: 'The system closes the gap between marketing and sales content automatically. You maintain the bridge — ensuring the sales narrative evolves with the marketing strategy.',
          },
        },
        'performance-review': {
          preAI: {
            summary: 'You review content performance through a growth lens — which pieces drove acquisition, conversion, and pipeline.',
            detail: 'Growth metrics are different from brand metrics. You advocate for content that drives business outcomes, not just engagement.',
          },
          aiAgents: {
            summary: 'The agent surfaces growth-relevant metrics — CAC impact, pipeline contribution, conversion lift — alongside standard performance data.',
            detail: 'Growth data arrives pre-formatted. You decide which content deserves more investment and which experiments to scale.',
          },
          aiAgentic: {
            summary: 'Performance data feeds directly into your experimentation framework — successful tests auto-scale, failures auto-archive.',
            detail: 'The difference between noise and strategy is still your judgment about which variations generate learning, not just impressions. You design the framework; agents execute it.',
          },
        },
        'receive-request': {
          preAI: {
            summary: 'You optimize incoming requests manually, sorting through emails and Slack messages for conversion optimization.',
            detail: 'Requests arrive in inconsistent formats with no standard intake process. You spend hours triaging and clarifying scope before conversion optimization can even begin.',
          },
          aiAgents: {
            summary: 'An AI intake agent structures requests and flags conversion optimization implications before they reach your queue.',
            detail: 'Requests arrive pre-categorized with conversion optimization signals highlighted. You validate and prioritize rather than manually parsing raw inputs.',
          },
          aiAgentic: {
            summary: 'Autonomous intake agents triage, validate, and route requests with conversion optimization logic — you govern exceptions.',
            detail: 'Agentic intake handles end-to-end request processing with your conversion optimization rules embedded. You set policies and review escalations while routine requests flow automatically.',
          },
        },
        'research-insights': {
          preAI: {
            summary: 'You gather audience and market research manually, compiling data from multiple sources for conversion optimization.',
            detail: 'Research is scattered across tools, reports, and tribal knowledge. Building a complete picture for conversion optimization takes days and the data is often stale by the time you use it.',
          },
          aiAgents: {
            summary: 'AI research tools surface audience and market data relevant to your conversion optimization needs automatically.',
            detail: 'Research agents pull relevant data from multiple sources and present conversion optimization insights in a structured format. You curate and interpret rather than gather.',
          },
          aiAgentic: {
            summary: 'Autonomous research agents continuously update conversion optimization intelligence — you set the strategic lens.',
            detail: 'Research agents proactively surface conversion optimization insights from market signals, audience data, and competitive movements. You shape research priorities, not execute searches.',
          },
        },
        'write-brief': {
          preAI: {
            summary: 'You wait for briefs written by hand, often lacking the conversion optimization detail you need.',
            detail: 'Briefs arrive incomplete or misaligned with your conversion optimization requirements. You spend cycles requesting revisions and clarifying expectations before work can proceed.',
          },
          aiAgents: {
            summary: 'AI drafts briefs with conversion optimization requirements pre-populated from templates and past projects.',
            detail: 'Brief generation agents pull your conversion optimization requirements into structured templates. You review and refine rather than starting from a blank page.',
          },
          aiAgentic: {
            summary: 'Autonomous agents generate complete briefs with conversion optimization alignment built in — you approve strategy.',
            detail: 'Brief agents produce publication-ready briefs that embed your conversion optimization requirements from historical patterns. You govern strategic direction rather than reviewing drafts.',
          },
        },
        'draft-content': {
          preAI: {
            summary: 'You review drafts created entirely by hand, checking each one for alignment with conversion optimization.',
            detail: 'First drafts vary wildly in quality and conversion optimization alignment. You often send content back for multiple revision cycles, creating bottlenecks in the pipeline.',
          },
          aiAgents: {
            summary: 'AI generates first drafts with conversion optimization guidelines embedded, reducing your revision cycles.',
            detail: 'Drafting agents produce content aligned with your conversion optimization standards from the start. You focus on strategic refinement rather than basic corrections.',
          },
          aiAgentic: {
            summary: 'Autonomous drafting agents produce content meeting conversion optimization standards — you set creative direction.',
            detail: 'Drafting agents generate content that passes your conversion optimization criteria automatically. You focus on strategic vision and creative differentiation rather than quality control.',
          },
        },
        'seo-optimization': {
          preAI: {
            summary: 'SEO optimization is manual and disconnected from your conversion optimization priorities.',
            detail: 'Keyword research and meta optimization happen separately from your conversion optimization workflow. You rarely see SEO data until after content is already in review.',
          },
          aiAgents: {
            summary: 'AI SEO tools optimize content while preserving your conversion optimization priorities.',
            detail: 'SEO agents suggest keywords and meta improvements that align with your conversion optimization goals. You approve optimizations rather than manually researching keywords.',
          },
          aiAgentic: {
            summary: 'Autonomous SEO agents optimize continuously within conversion optimization boundaries — you define the strategy.',
            detail: 'SEO agents self-optimize content based on real-time search signals and your conversion optimization guardrails. You set strategic keywords and constraints, not individual page optimizations.',
          },
        },
        'brand-compliance': {
          preAI: {
            summary: 'Brand checks are subjective and slow, creating delays in your conversion optimization workflow.',
            detail: 'Brand reviewers interpret guidelines differently. Inconsistent enforcement of tone, terminology, and messaging means conversion optimization is harder to maintain at scale.',
          },
          aiAgents: {
            summary: 'AI brand checkers flag violations and score conversion optimization alignment before human review.',
            detail: 'Brand agents scan content against guidelines and highlight conversion optimization issues. You make judgment calls on edge cases rather than catching basic violations.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents enforce compliance at scale with conversion optimization rules — you update the rulebook.',
            detail: 'Brand agents apply and evolve compliance checks across all content automatically. Your conversion optimization standards are codified as machine-enforceable rules that you govern and refine.',
          },
        },
        'final-edit': {
          preAI: {
            summary: 'Final edits depend entirely on editor availability, blocking your conversion optimization timelines.',
            detail: 'A single editor bottleneck means content waits in queue. Your conversion optimization deadlines slip because there is no way to parallelize the final polish step.',
          },
          aiAgents: {
            summary: 'AI editing assistants handle mechanical fixes, freeing your conversion optimization focus for strategic polish.',
            detail: 'Editing agents catch grammar, style, and consistency issues automatically. Your conversion optimization perspective is reserved for nuance and narrative quality.',
          },
          aiAgentic: {
            summary: 'Autonomous editing agents polish content to publication standard — your conversion optimization bar is encoded as policy.',
            detail: 'Editing agents handle all mechanical and stylistic refinement autonomously. Your conversion optimization standards are embedded as editorial policies that improve with each iteration.',
          },
        },
        'schedule-publish': {
          preAI: {
            summary: 'Publishing is a manual CMS process with no connection to your conversion optimization planning.',
            detail: 'Each piece requires manual scheduling, metadata entry, and CMS configuration. Your conversion optimization goals are disconnected from the publish timeline.',
          },
          aiAgents: {
            summary: 'AI scheduling agents suggest optimal publish timing based on conversion optimization data.',
            detail: 'Publishing agents recommend times and configurations informed by your conversion optimization priorities. You approve the schedule rather than manually configuring CMS settings.',
          },
          aiAgentic: {
            summary: 'Autonomous publishing agents manage scheduling end-to-end using conversion optimization optimization logic.',
            detail: 'Publishing agents handle CMS configuration, timing optimization, and deployment autonomously within your conversion optimization constraints. You set publishing policies, not individual schedules.',
          },
        },
        'distribute': {
          preAI: {
            summary: 'Content distribution is manual channel-by-channel, with limited visibility into conversion optimization.',
            detail: 'Each channel requires separate formatting, scheduling, and posting. There is no unified view of how distribution supports your conversion optimization objectives.',
          },
          aiAgents: {
            summary: 'AI distribution agents adapt content per channel with conversion optimization rules built in.',
            detail: 'Distribution agents format and deploy content across channels following your conversion optimization guidelines. You monitor and adjust rather than manually posting to each platform.',
          },
          aiAgentic: {
            summary: 'Autonomous distribution agents manage all channels with conversion optimization rules — you govern the playbook.',
            detail: 'Distribution agents deploy, adapt, and optimize content across every channel following your conversion optimization playbook. You evolve distribution strategy, not execute individual channel posts.',
          },
        },
        'track-performance': {
          preAI: {
            summary: 'Performance tracking is fragmented across tools, making conversion optimization assessment difficult.',
            detail: 'You pull data from analytics dashboards, social platforms, and CRM separately. Building a complete picture for conversion optimization requires manual data stitching.',
          },
          aiAgents: {
            summary: 'AI dashboards surface conversion optimization metrics in real time without manual data pulling.',
            detail: 'Performance agents aggregate data and highlight the conversion optimization signals that matter to you. You analyze trends rather than building dashboards from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous tracking agents monitor conversion optimization metrics continuously and trigger alerts and actions.',
            detail: 'Performance agents stream conversion optimization data and automatically trigger optimization workflows when thresholds are breached. You define KPIs and review strategic implications.',
          },
        },
        'generate-report': {
          preAI: {
            summary: 'Reports are built manually in spreadsheets, often missing the conversion optimization metrics you need.',
            detail: 'Report creation takes hours of data gathering and formatting. The metrics that matter for conversion optimization are often buried or missing entirely from standard templates.',
          },
          aiAgents: {
            summary: 'AI generates reports with conversion optimization metrics pre-formatted and insights highlighted.',
            detail: 'Reporting agents compile your conversion optimization data into structured templates with automated analysis. You add strategic narrative rather than wrangling data.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce conversion optimization reports on demand with strategic recommendations.',
            detail: 'Reporting agents generate conversion optimization analyses with actionable recommendations automatically. You consume insights and set strategic direction rather than producing reports.',
          },
        },
        'optimize': {
          preAI: {
            summary: 'Content optimization is reactive and slow, with limited connection to conversion optimization data.',
            detail: 'Optimization decisions rely on gut feel and delayed data. Your conversion optimization insights rarely feed back into content updates in a timely way.',
          },
          aiAgents: {
            summary: 'AI recommends optimizations based on conversion optimization signals and historical performance.',
            detail: 'Optimization agents suggest specific changes tied to your conversion optimization metrics. You approve and prioritize recommendations rather than diagnosing issues manually.',
          },
          aiAgentic: {
            summary: 'Autonomous optimization agents improve content continuously using conversion optimization signals — you set boundaries.',
            detail: 'Optimization agents test, iterate, and improve content based on conversion optimization data within your guardrails. You define acceptable ranges and review significant changes.',
          },
        },
        'brief-approval': {
          preAI: {
            summary: 'Brief approvals are bottlenecked by manual review cycles that delay your conversion optimization work.',
            detail: 'You wait for briefs to pass through approval chains before your conversion optimization tasks can begin. Unclear approval criteria mean briefs bounce back and forth repeatedly.',
          },
          aiAgents: {
            summary: 'AI pre-screens briefs for conversion optimization alignment, routing only exceptions to you.',
            detail: 'Approval agents check briefs against your conversion optimization criteria and flag gaps. You review flagged items rather than reading every brief end to end.',
          },
          aiAgentic: {
            summary: 'Autonomous approval agents clear standard briefs and escalate only conversion optimization exceptions to you.',
            detail: 'Approval agents validate briefs against your conversion optimization criteria and auto-approve routine requests. You handle strategic exceptions and edge cases only.',
          },
        },
        'quality-check': {
          preAI: {
            summary: 'Quality checks are inconsistent manual reviews with no standard conversion optimization criteria.',
            detail: 'Quality varies by reviewer and day. There is no automated baseline for readability, accuracy, or conversion optimization alignment, leading to uneven content standards.',
          },
          aiAgents: {
            summary: 'AI quality gates enforce baseline standards, letting you focus on conversion optimization nuance.',
            detail: 'Quality agents score readability, accuracy, and SEO automatically. Your conversion optimization evaluation focuses on strategic alignment rather than mechanical checks.',
          },
          aiAgentic: {
            summary: 'Autonomous quality agents enforce standards continuously — conversion optimization baselines are self-maintaining.',
            detail: 'Quality agents apply and evolve quality standards based on your conversion optimization benchmarks. You set quality policies that the system enforces and improves over time.',
          },
        },
        'brand-review': {
          preAI: {
            summary: 'Brand reviews are subjective gates that slow your conversion optimization pipeline.',
            detail: 'Reviewers apply brand guidelines inconsistently. What passes one review fails the next, creating unpredictable delays in your conversion optimization workflow.',
          },
          aiAgents: {
            summary: 'AI brand agents pre-score content, surfacing conversion optimization issues before your review.',
            detail: 'Brand review agents apply guidelines consistently and flag conversion optimization deviations. You handle exceptions and judgment calls rather than full content scans.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents review all content at scale — you govern conversion optimization policy evolution.',
            detail: 'Brand review agents handle all compliance checking autonomously with your conversion optimization rules. You update brand guidelines and review the rare edge case that requires human judgment.',
          },
        },
        'stakeholder-signoff': {
          preAI: {
            summary: 'Stakeholder sign-off is a bottleneck where executives delay your conversion optimization timelines.',
            detail: 'Senior approvers are busy and unresponsive. Your conversion optimization work stalls while waiting for sign-off, and last-minute changes create downstream chaos.',
          },
          aiAgents: {
            summary: 'AI prepares sign-off packages with conversion optimization summaries for faster executive approval.',
            detail: 'Sign-off agents compile context, changes, and conversion optimization impact assessments for approvers. Executives review structured summaries rather than raw content.',
          },
          aiAgentic: {
            summary: 'Autonomous agents handle routine sign-offs within conversion optimization parameters — executives approve strategy only.',
            detail: 'Sign-off agents clear content that meets all conversion optimization criteria automatically. Executives only review strategic pivots or high-risk content that breaches defined thresholds.',
          },
        },
        'social-listening': {
          preAI: {
            summary: 'Social listening is ad hoc keyword monitoring with no systematic link to conversion optimization.',
            detail: 'You check social platforms manually for relevant conversations. Insights rarely reach your conversion optimization workflow before they become stale or irrelevant.',
          },
          aiAgents: {
            summary: 'AI monitoring tools surface trending topics and sentiment relevant to conversion optimization in real time.',
            detail: 'Listening agents track conversations and flag conversion optimization signals across platforms. You act on curated insights rather than monitoring feeds manually.',
          },
          aiAgentic: {
            summary: 'Autonomous listening agents track and respond to conversion optimization signals across all platforms in real time.',
            detail: 'Listening agents monitor social channels and proactively surface conversion optimization opportunities and risks. You set monitoring priorities and review strategic findings.',
          },
        },
        'visual-asset-creation': {
          preAI: {
            summary: 'Visual asset creation is a slow design queue disconnected from your conversion optimization needs.',
            detail: 'Design requests go into a backlog with unclear priorities. Your conversion optimization requirements are often lost in translation between brief and final asset.',
          },
          aiAgents: {
            summary: 'AI design tools generate asset options aligned with conversion optimization requirements.',
            detail: 'Design agents produce visual variants following your conversion optimization guidelines. You select and refine from AI-generated options rather than directing from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous design agents produce visual assets within conversion optimization guidelines — you set creative direction.',
            detail: 'Design agents generate publication-ready visuals following your conversion optimization standards. You define the creative vision and approve hero assets while routine visuals ship autonomously.',
          },
        },
        'legal-review': {
          preAI: {
            summary: 'Legal review is an opaque process that creates unpredictable delays in your conversion optimization work.',
            detail: 'Legal feedback arrives late with minimal context. You cannot predict how long review will take, making conversion optimization planning unreliable.',
          },
          aiAgents: {
            summary: 'AI legal screening flags compliance risks early, reducing conversion optimization surprises downstream.',
            detail: 'Legal agents pre-scan content for regulatory issues and conversion optimization risks. You get early warnings rather than discovering problems at the sign-off stage.',
          },
          aiAgentic: {
            summary: 'Autonomous legal agents clear routine content and escalate only true conversion optimization risks to human counsel.',
            detail: 'Legal agents scan and clear standard content autonomously using your conversion optimization rule framework. Human lawyers handle novel risk scenarios and precedent-setting decisions only.',
          },
        },
        'accessibility-check': {
          preAI: {
            summary: 'Accessibility checking is a manual afterthought, rarely connected to your conversion optimization process.',
            detail: 'WCAG compliance and inclusive language reviews happen late in the pipeline. Your conversion optimization work is already done when accessibility issues force rework.',
          },
          aiAgents: {
            summary: 'AI accessibility tools catch WCAG violations automatically, protecting your conversion optimization standards.',
            detail: 'Accessibility agents scan for inclusive language and alt-text compliance. Your conversion optimization requirements benefit from automated baseline checks before human review.',
          },
          aiAgentic: {
            summary: 'Autonomous accessibility agents enforce WCAG and inclusive standards — conversion optimization is guaranteed by default.',
            detail: 'Accessibility agents ensure all content meets compliance standards before publication. Your conversion optimization benefits from guaranteed accessibility without manual checking overhead.',
          },
        },
        'localize-content': {
          preAI: {
            summary: 'Localization is a slow, manual translation process that delays your conversion optimization for global markets.',
            detail: 'Each market requires separate translation, cultural review, and compliance checking. Your conversion optimization suffers because localized versions lag weeks behind the original.',
          },
          aiAgents: {
            summary: 'AI translation agents accelerate localization while respecting conversion optimization requirements.',
            detail: 'Localization agents produce initial translations with conversion optimization context preserved. You review for cultural nuance rather than translating from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous localization agents adapt content for all markets simultaneously — your conversion optimization scales globally.',
            detail: 'Localization agents handle translation, cultural adaptation, and regional compliance autonomously. Your conversion optimization is maintained across markets without manual per-locale effort.',
          },
        },
        'archive-tag': {
          preAI: {
            summary: 'Content archiving is inconsistent, making conversion optimization-related retrieval nearly impossible.',
            detail: 'Tagging and taxonomy are applied inconsistently or not at all. Finding past content relevant to conversion optimization requires searching through unstructured repositories.',
          },
          aiAgents: {
            summary: 'AI tagging agents classify content automatically, making conversion optimization retrieval faster.',
            detail: 'Archive agents apply taxonomy and metadata based on your conversion optimization categories. You validate classifications rather than manually tagging every asset.',
          },
          aiAgentic: {
            summary: 'Autonomous archive agents maintain perfect taxonomy — conversion optimization retrieval is instant and reliable.',
            detail: 'Archive agents classify, tag, and organize all content using your conversion optimization taxonomy automatically. You evolve the taxonomy structure while the system maintains it flawlessly.',
          },
        },
        'legal-compliance-gate': {
          preAI: {
            summary: 'Legal compliance gates create unpredictable holds that delay your conversion optimization deadlines.',
            detail: 'Legal sign-off timing is opaque and variable. Your conversion optimization timelines are at the mercy of legal review queues with no visibility into status.',
          },
          aiAgents: {
            summary: 'AI pre-screening reduces legal gate delays by resolving routine conversion optimization checks automatically.',
            detail: 'Compliance agents handle standard checks and only escalate conversion optimization edge cases to human lawyers. Your timelines are more predictable because routine items clear faster.',
          },
          aiAgentic: {
            summary: 'Autonomous compliance gates clear routine content instantly — only novel conversion optimization risks reach human lawyers.',
            detail: 'Compliance agents handle standard legal checks autonomously using your conversion optimization risk framework. Human review is reserved for unprecedented scenarios and policy updates.',
          },
        },
        'localization-quality-gate': {
          preAI: {
            summary: 'Localization quality gates are inconsistent, creating conversion optimization risks in global markets.',
            detail: 'Quality checks for localized content vary by market and reviewer. Your conversion optimization standards are unevenly applied across regions and languages.',
          },
          aiAgents: {
            summary: 'AI quality checks catch translation errors before they affect your conversion optimization outcomes.',
            detail: 'Localization QA agents verify accuracy and cultural fit automatically. Your conversion optimization standards are applied consistently across all target markets.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents ensure localization quality across all markets — conversion optimization is guaranteed globally.',
            detail: 'Localization QA agents validate every market adaptation autonomously against your conversion optimization standards. You set quality criteria while the system enforces them at scale.',
          },
        },
        'dynamic-assembly': {
          preAI: {
            summary: 'Dynamic content assembly is rigid and template-bound, limiting your conversion optimization options.',
            detail: 'Personalized experiences require engineering support for each variant. Your conversion optimization vision is constrained by inflexible assembly templates.',
          },
          aiAgents: {
            summary: 'AI assembly agents construct personalized experiences informed by conversion optimization rules.',
            detail: 'Assembly agents combine content components per segment following your conversion optimization logic. You define rules and review outputs rather than manually configuring each variant.',
          },
          aiAgentic: {
            summary: 'Autonomous assembly agents construct personalized experiences in real time — conversion optimization logic is self-optimizing.',
            detail: 'Assembly agents build dynamic experiences per segment using your conversion optimization rules and real-time behavioral signals. You govern personalization policies, not individual assembly configurations.',
          },
        },
        'personalization-qa': {
          preAI: {
            summary: 'Personalization QA is manual spot-checking that misses conversion optimization gaps.',
            detail: 'Testing every segment-variant combination is impossible manually. Your conversion optimization concerns are only caught when users report issues post-launch.',
          },
          aiAgents: {
            summary: 'AI QA agents validate personalization coverage and flag conversion optimization gaps before launch.',
            detail: 'QA agents test every segment-variant combination against your conversion optimization requirements. You review exception reports rather than manually spot-checking combinations.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents validate every personalization scenario — conversion optimization gaps are caught before launch.',
            detail: 'Personalization QA agents test all segment-variant combinations against your conversion optimization requirements automatically. You set acceptance criteria while the system validates at scale.',
          },
        },
        'campaign-planning': {
          preAI: {
            summary: 'Campaign planning is a manual coordination effort with fragmented conversion optimization inputs.',
            detail: 'Campaign plans are built in decks and spreadsheets with incomplete data. Your conversion optimization perspective is often incorporated too late in the planning cycle.',
          },
          aiAgents: {
            summary: 'AI planning agents draft campaign frameworks with conversion optimization data pre-integrated.',
            detail: 'Planning agents pull audience, budget, and performance data into campaign templates. Your conversion optimization priorities shape the plan from the start rather than being retrofitted.',
          },
          aiAgentic: {
            summary: 'Autonomous planning agents generate campaign frameworks using conversion optimization intelligence — you set objectives.',
            detail: 'Planning agents produce data-driven campaign plans with your conversion optimization priorities embedded. You define strategic goals while the system optimizes tactics and resource allocation.',
          },
        },
        'consent-check': {
          preAI: {
            summary: 'Consent checking is a manual compliance step that adds friction to your conversion optimization process.',
            detail: 'Verifying GDPR/CCPA consent for targeting requires manual cross-referencing. Your conversion optimization work is delayed while compliance status is manually confirmed.',
          },
          aiAgents: {
            summary: 'AI consent agents verify targeting compliance automatically, reducing conversion optimization friction.',
            detail: 'Consent agents cross-reference CDP signals against GDPR/CCPA rules for your conversion optimization needs. You handle exceptions rather than manually verifying every segment.',
          },
          aiAgentic: {
            summary: 'Autonomous consent agents enforce privacy compliance at scale — conversion optimization is guaranteed by architecture.',
            detail: 'Consent agents verify targeting compliance in real time across all segments using your conversion optimization framework. You set privacy policies while the system enforces them automatically.',
          },
        },
        'attribution-modeling': {
          preAI: {
            summary: 'Attribution modeling is manual and unreliable, undermining your conversion optimization reporting.',
            detail: 'Last-click attribution dominates despite its flaws. Your conversion optimization decisions lack the multi-touch perspective needed for accurate performance assessment.',
          },
          aiAgents: {
            summary: 'AI attribution models surface multi-touch insights relevant to your conversion optimization priorities.',
            detail: 'Attribution agents calculate content ROI across channels using your conversion optimization weightings. You interpret strategic implications rather than building models manually.',
          },
          aiAgentic: {
            summary: 'Autonomous attribution agents run multi-touch models continuously — conversion optimization insights update in real time.',
            detail: 'Attribution agents calculate content ROI across all channels using your conversion optimization framework. You interpret strategic implications while the system handles modeling complexity.',
          },
        },
        'executive-reporting': {
          preAI: {
            summary: 'Executive reports are manually assembled, often missing the conversion optimization narrative you need.',
            detail: 'Building executive dashboards takes hours of data wrangling. The conversion optimization story you want to tell is lost in generic reporting templates.',
          },
          aiAgents: {
            summary: 'AI builds executive dashboards with conversion optimization narratives pre-drafted for leadership.',
            detail: 'Reporting agents synthesize data into executive formats with your conversion optimization story embedded. You refine the narrative rather than assembling data from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce executive dashboards with conversion optimization narratives — you add strategic context.',
            detail: 'Executive reporting agents synthesize all data into leadership-ready formats with your conversion optimization story embedded. You provide strategic commentary on auto-generated insights.',
          },
        },
        'competitive-response': {
          preAI: {
            summary: 'Competitive response is slow and reactive, giving you no conversion optimization advantage.',
            detail: 'By the time you spot a competitor move and respond, the moment has passed. Your conversion optimization approach cannot adapt fast enough to real-time competitive signals.',
          },
          aiAgents: {
            summary: 'AI competitive agents surface signals and draft responses aligned with conversion optimization strategy.',
            detail: 'Competitive agents monitor market moves and suggest conversion optimization-aligned responses. You approve and refine reactive content rather than spotting threats manually.',
          },
          aiAgentic: {
            summary: 'Autonomous competitive agents detect and draft responses in real time — conversion optimization moves are countered instantly.',
            detail: 'Competitive agents monitor signals, draft responses, and deploy within your conversion optimization guardrails. You approve high-stakes responses while routine reactions ship autonomously.',
          },
        },
        'content-governance': {
          preAI: {
            summary: 'Content governance is periodic manual auditing that cannot keep pace with your conversion optimization standards.',
            detail: 'Live content drifts out of compliance between infrequent reviews. Your conversion optimization requirements are only enforced when someone manually checks.',
          },
          aiAgents: {
            summary: 'AI governance agents continuously audit live content against conversion optimization standards.',
            detail: 'Governance agents flag content drift, compliance gaps, and conversion optimization issues in real time. You review flagged items rather than conducting manual audits.',
          },
          aiAgentic: {
            summary: 'Autonomous governance agents audit all live content continuously — conversion optimization compliance is always current.',
            detail: 'Governance agents monitor every published piece against your conversion optimization standards in real time. You evolve governance policies while the system enforces them perpetually.',
          },
        },
        'governance-gate': {
          preAI: {
            summary: 'Governance gates are calendar-driven checkpoints disconnected from your conversion optimization rhythm.',
            detail: 'Governance reviews happen on a fixed schedule regardless of content velocity. Your conversion optimization concerns may not surface until the next quarterly review.',
          },
          aiAgents: {
            summary: 'AI governance gates run continuous checks, surfacing conversion optimization issues between formal reviews.',
            detail: 'Governance agents validate live content against your conversion optimization criteria on an ongoing basis. You act on exception alerts rather than waiting for quarterly reviews.',
          },
          aiAgentic: {
            summary: 'Autonomous governance gates run continuously — conversion optimization violations trigger immediate remediation.',
            detail: 'Governance agents validate live content against your conversion optimization criteria continuously and auto-trigger refresh or retirement workflows. You set policies, not review schedules.',
          },
        },
        'journey-mapping': {
          preAI: {
            summary: 'Journey mapping is a manual exercise that rarely reflects your conversion optimization reality.',
            detail: 'Customer journey maps are created in workshops and quickly go stale. Your conversion optimization perspective is a snapshot, not a living view of how content performs at each stage.',
          },
          aiAgents: {
            summary: 'AI journey agents map content to lifecycle stages using conversion optimization data from the CDP.',
            detail: 'Journey agents dynamically map content to customer stages based on your conversion optimization framework. You validate the mapping rather than building it manually in workshops.',
          },
          aiAgentic: {
            summary: 'Autonomous journey agents maintain living maps using real-time conversion optimization data — you shape the strategy.',
            detail: 'Journey agents dynamically map content to lifecycle stages using live conversion optimization signals. You define journey frameworks while the system optimizes content placement continuously.',
          },
        },
        'sentiment-monitoring': {
          preAI: {
            summary: 'Sentiment monitoring is sporadic manual checking with no systematic link to conversion optimization.',
            detail: 'You check brand sentiment reactively rather than proactively. Your conversion optimization decisions are made without real-time audience feedback signals.',
          },
          aiAgents: {
            summary: 'AI sentiment agents track brand reception in real time, alerting you to conversion optimization risks.',
            detail: 'Sentiment agents analyze audience reactions and flag conversion optimization concerns before they escalate. You respond to alerts rather than manually checking platforms.',
          },
          aiAgentic: {
            summary: 'Autonomous sentiment agents monitor and respond to conversion optimization signals around the clock — you govern escalation.',
            detail: 'Sentiment agents track audience reactions and trigger conversion optimization responses automatically. You set escalation thresholds and review strategic implications of sentiment shifts.',
          },
        },
        'influencer-brief': {
          preAI: {
            summary: 'Influencer briefs are manual documents with limited conversion optimization guardrails.',
            detail: 'Creator briefs are written from scratch each time. Your conversion optimization guidelines are inconsistently communicated to external partners and influencers.',
          },
          aiAgents: {
            summary: 'AI agents draft influencer briefs with conversion optimization guardrails embedded automatically.',
            detail: 'Brief agents generate creator guidelines from your conversion optimization requirements and past successful collaborations. You customize rather than writing each brief from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous brief agents generate creator guidelines with conversion optimization guardrails — you approve partnerships.',
            detail: 'Brief agents produce personalized influencer guidelines using your conversion optimization framework and creator history. You focus on relationship strategy while briefs ship autonomously.',
          },
        },
        'ugc-moderation': {
          preAI: {
            summary: 'UGC moderation is manual screening that cannot scale to protect conversion optimization.',
            detail: 'User-generated content is reviewed one piece at a time. Your conversion optimization standards cannot be consistently enforced across the volume of submissions.',
          },
          aiAgents: {
            summary: 'AI moderation agents screen UGC for brand safety and conversion optimization compliance at scale.',
            detail: 'Moderation agents filter user-generated content against your conversion optimization criteria. You review borderline cases rather than manually screening every submission.',
          },
          aiAgentic: {
            summary: 'Autonomous moderation agents screen all UGC for conversion optimization compliance at scale — you govern edge cases.',
            detail: 'Moderation agents filter user-generated content using your conversion optimization rules continuously. You update moderation policies and review borderline cases that the system escalates.',
          },
        },
        'content-scoring': {
          preAI: {
            summary: 'Content scoring is subjective prioritization that underweights your conversion optimization criteria.',
            detail: 'Requests are prioritized by loudest voice or executive fiat. Your conversion optimization scoring criteria are rarely part of the formal prioritization framework.',
          },
          aiAgents: {
            summary: 'AI scoring agents rank requests using conversion optimization criteria alongside strategic priority.',
            detail: 'Scoring agents weight your conversion optimization factors into the prioritization algorithm. You adjust rankings rather than scoring each request manually.',
          },
          aiAgentic: {
            summary: 'Autonomous scoring agents prioritize the pipeline using conversion optimization criteria — you set strategic weights.',
            detail: 'Scoring agents rank and route content requests using your conversion optimization priorities in real time. You define scoring criteria and review the queue rather than manually triaging.',
          },
        },
        'channel-orchestration': {
          preAI: {
            summary: 'Channel orchestration is manual coordination with no systematic conversion optimization integration.',
            detail: 'Cross-channel timing is managed in spreadsheets and Slack. Your conversion optimization requirements for sequencing and coordination are often overridden by ad hoc changes.',
          },
          aiAgents: {
            summary: 'AI orchestration agents sequence distribution with conversion optimization rules for timing and cadence.',
            detail: 'Orchestration agents coordinate cross-channel timing based on your conversion optimization requirements. You set rules and review the sequence rather than managing each channel individually.',
          },
          aiAgentic: {
            summary: 'Autonomous orchestration agents manage all channel timing with conversion optimization logic — you set the playbook.',
            detail: 'Orchestration agents handle cross-channel sequencing, timing, and coordination autonomously using your conversion optimization rules. You evolve the orchestration strategy while the system executes.',
          },
        },
      },
      keyInsight: 'Volume without strategy is noise. The human value here is experimental design — knowing which tests will produce learning, not just more content.',
    },
  },
  {
    id: 'privacy-officer',
    title: 'Privacy Officer',
    description: 'Owns consent compliance and privacy validation for all personalized content delivery. Ensures data usage aligns with jurisdictional privacy regulations.',
    tagline: 'Keeps personalization within legal bounds.',
    iconName: 'Lock',
    category: 'governance',
    accentColor: '#E09070',
    ownedSteps: ['consent-check'],
    reviewedGates: ['personalization-qa'],
    relatedAgents: ['privacy-agent', 'personalization-agent'],
    relatedInputs: ['privacy-regulations', 'cdp-profiles'],
    narrative: {
      nodeJourneys: {
        'consent-check': {
          preAI: {
            summary: 'You validate consent signals, check jurisdiction-specific rules, and approve every personalized content delivery.',
            detail: 'Every activation requires your sign-off. The volume of consent checks scales linearly with the number of segments and markets you serve.',
          },
          aiAgents: {
            summary: 'A privacy agent validates consent in real time using your regulatory documentation.',
            detail: 'Privacy rules are binary, which makes them well-suited for automation. The agent enforces your rules at speed no human team matches.',
          },
          aiAgentic: {
            summary: 'Consent compliance is embedded in the system — no segment activates without passing your automated framework.',
            detail: 'You shift from checking every activation to designing the consent framework and auditing agent decisions. Your role enables personalization at scale.',
          },
        },
        'personalization-qa': {
          preAI: {
            summary: 'You review every personalized variant to ensure data usage stays within consent boundaries.',
            detail: 'QA is manual and scales with personalization complexity. More segments and more markets mean more reviews.',
          },
          aiAgents: {
            summary: 'The agent validates personalization rules against consent status — you review edge cases where jurisdiction conflicts arise.',
            detail: 'Standard consent checks are automated. Your reviews focus on cross-jurisdictional conflicts where the rules genuinely require human interpretation.',
          },
          aiAgentic: {
            summary: 'Personalization QA runs continuously — variants that violate consent are blocked before they can be delivered.',
            detail: 'The gate is one of few with autonomous blocking authority. Your governance framework enables the business to personalize at scale rather than constraining it.',
          },
        },
        'receive-request': {
          preAI: {
            summary: 'You safeguard incoming requests manually, sorting through emails and Slack messages for data protection.',
            detail: 'Requests arrive in inconsistent formats with no standard intake process. You spend hours triaging and clarifying scope before data protection can even begin.',
          },
          aiAgents: {
            summary: 'An AI intake agent structures requests and flags data protection implications before they reach your queue.',
            detail: 'Requests arrive pre-categorized with data protection signals highlighted. You validate and prioritize rather than manually parsing raw inputs.',
          },
          aiAgentic: {
            summary: 'Autonomous intake agents triage, validate, and route requests with data protection logic — you govern exceptions.',
            detail: 'Agentic intake handles end-to-end request processing with your data protection rules embedded. You set policies and review escalations while routine requests flow automatically.',
          },
        },
        'research-insights': {
          preAI: {
            summary: 'You gather audience and market research manually, compiling data from multiple sources for data protection.',
            detail: 'Research is scattered across tools, reports, and tribal knowledge. Building a complete picture for data protection takes days and the data is often stale by the time you use it.',
          },
          aiAgents: {
            summary: 'AI research tools surface audience and market data relevant to your data protection needs automatically.',
            detail: 'Research agents pull relevant data from multiple sources and present data protection insights in a structured format. You curate and interpret rather than gather.',
          },
          aiAgentic: {
            summary: 'Autonomous research agents continuously update data protection intelligence — you set the strategic lens.',
            detail: 'Research agents proactively surface data protection insights from market signals, audience data, and competitive movements. You shape research priorities, not execute searches.',
          },
        },
        'write-brief': {
          preAI: {
            summary: 'You wait for briefs written by hand, often lacking the data protection detail you need.',
            detail: 'Briefs arrive incomplete or misaligned with your data protection requirements. You spend cycles requesting revisions and clarifying expectations before work can proceed.',
          },
          aiAgents: {
            summary: 'AI drafts briefs with data protection requirements pre-populated from templates and past projects.',
            detail: 'Brief generation agents pull your data protection requirements into structured templates. You review and refine rather than starting from a blank page.',
          },
          aiAgentic: {
            summary: 'Autonomous agents generate complete briefs with data protection alignment built in — you approve strategy.',
            detail: 'Brief agents produce publication-ready briefs that embed your data protection requirements from historical patterns. You govern strategic direction rather than reviewing drafts.',
          },
        },
        'draft-content': {
          preAI: {
            summary: 'You review drafts created entirely by hand, checking each one for alignment with data protection.',
            detail: 'First drafts vary wildly in quality and data protection alignment. You often send content back for multiple revision cycles, creating bottlenecks in the pipeline.',
          },
          aiAgents: {
            summary: 'AI generates first drafts with data protection guidelines embedded, reducing your revision cycles.',
            detail: 'Drafting agents produce content aligned with your data protection standards from the start. You focus on strategic refinement rather than basic corrections.',
          },
          aiAgentic: {
            summary: 'Autonomous drafting agents produce content meeting data protection standards — you set creative direction.',
            detail: 'Drafting agents generate content that passes your data protection criteria automatically. You focus on strategic vision and creative differentiation rather than quality control.',
          },
        },
        'seo-optimization': {
          preAI: {
            summary: 'SEO optimization is manual and disconnected from your data protection priorities.',
            detail: 'Keyword research and meta optimization happen separately from your data protection workflow. You rarely see SEO data until after content is already in review.',
          },
          aiAgents: {
            summary: 'AI SEO tools optimize content while preserving your data protection priorities.',
            detail: 'SEO agents suggest keywords and meta improvements that align with your data protection goals. You approve optimizations rather than manually researching keywords.',
          },
          aiAgentic: {
            summary: 'Autonomous SEO agents optimize continuously within data protection boundaries — you define the strategy.',
            detail: 'SEO agents self-optimize content based on real-time search signals and your data protection guardrails. You set strategic keywords and constraints, not individual page optimizations.',
          },
        },
        'brand-compliance': {
          preAI: {
            summary: 'Brand checks are subjective and slow, creating delays in your data protection workflow.',
            detail: 'Brand reviewers interpret guidelines differently. Inconsistent enforcement of tone, terminology, and messaging means data protection is harder to maintain at scale.',
          },
          aiAgents: {
            summary: 'AI brand checkers flag violations and score data protection alignment before human review.',
            detail: 'Brand agents scan content against guidelines and highlight data protection issues. You make judgment calls on edge cases rather than catching basic violations.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents enforce compliance at scale with data protection rules — you update the rulebook.',
            detail: 'Brand agents apply and evolve compliance checks across all content automatically. Your data protection standards are codified as machine-enforceable rules that you govern and refine.',
          },
        },
        'final-edit': {
          preAI: {
            summary: 'Final edits depend entirely on editor availability, blocking your data protection timelines.',
            detail: 'A single editor bottleneck means content waits in queue. Your data protection deadlines slip because there is no way to parallelize the final polish step.',
          },
          aiAgents: {
            summary: 'AI editing assistants handle mechanical fixes, freeing your data protection focus for strategic polish.',
            detail: 'Editing agents catch grammar, style, and consistency issues automatically. Your data protection perspective is reserved for nuance and narrative quality.',
          },
          aiAgentic: {
            summary: 'Autonomous editing agents polish content to publication standard — your data protection bar is encoded as policy.',
            detail: 'Editing agents handle all mechanical and stylistic refinement autonomously. Your data protection standards are embedded as editorial policies that improve with each iteration.',
          },
        },
        'schedule-publish': {
          preAI: {
            summary: 'Publishing is a manual CMS process with no connection to your data protection planning.',
            detail: 'Each piece requires manual scheduling, metadata entry, and CMS configuration. Your data protection goals are disconnected from the publish timeline.',
          },
          aiAgents: {
            summary: 'AI scheduling agents suggest optimal publish timing based on data protection data.',
            detail: 'Publishing agents recommend times and configurations informed by your data protection priorities. You approve the schedule rather than manually configuring CMS settings.',
          },
          aiAgentic: {
            summary: 'Autonomous publishing agents manage scheduling end-to-end using data protection optimization logic.',
            detail: 'Publishing agents handle CMS configuration, timing optimization, and deployment autonomously within your data protection constraints. You set publishing policies, not individual schedules.',
          },
        },
        'distribute': {
          preAI: {
            summary: 'Content distribution is manual channel-by-channel, with limited visibility into data protection.',
            detail: 'Each channel requires separate formatting, scheduling, and posting. There is no unified view of how distribution supports your data protection objectives.',
          },
          aiAgents: {
            summary: 'AI distribution agents adapt content per channel with data protection rules built in.',
            detail: 'Distribution agents format and deploy content across channels following your data protection guidelines. You monitor and adjust rather than manually posting to each platform.',
          },
          aiAgentic: {
            summary: 'Autonomous distribution agents manage all channels with data protection rules — you govern the playbook.',
            detail: 'Distribution agents deploy, adapt, and optimize content across every channel following your data protection playbook. You evolve distribution strategy, not execute individual channel posts.',
          },
        },
        'track-performance': {
          preAI: {
            summary: 'Performance tracking is fragmented across tools, making data protection assessment difficult.',
            detail: 'You pull data from analytics dashboards, social platforms, and CRM separately. Building a complete picture for data protection requires manual data stitching.',
          },
          aiAgents: {
            summary: 'AI dashboards surface data protection metrics in real time without manual data pulling.',
            detail: 'Performance agents aggregate data and highlight the data protection signals that matter to you. You analyze trends rather than building dashboards from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous tracking agents monitor data protection metrics continuously and trigger alerts and actions.',
            detail: 'Performance agents stream data protection data and automatically trigger optimization workflows when thresholds are breached. You define KPIs and review strategic implications.',
          },
        },
        'generate-report': {
          preAI: {
            summary: 'Reports are built manually in spreadsheets, often missing the data protection metrics you need.',
            detail: 'Report creation takes hours of data gathering and formatting. The metrics that matter for data protection are often buried or missing entirely from standard templates.',
          },
          aiAgents: {
            summary: 'AI generates reports with data protection metrics pre-formatted and insights highlighted.',
            detail: 'Reporting agents compile your data protection data into structured templates with automated analysis. You add strategic narrative rather than wrangling data.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce data protection reports on demand with strategic recommendations.',
            detail: 'Reporting agents generate data protection analyses with actionable recommendations automatically. You consume insights and set strategic direction rather than producing reports.',
          },
        },
        'optimize': {
          preAI: {
            summary: 'Content optimization is reactive and slow, with limited connection to data protection data.',
            detail: 'Optimization decisions rely on gut feel and delayed data. Your data protection insights rarely feed back into content updates in a timely way.',
          },
          aiAgents: {
            summary: 'AI recommends optimizations based on data protection signals and historical performance.',
            detail: 'Optimization agents suggest specific changes tied to your data protection metrics. You approve and prioritize recommendations rather than diagnosing issues manually.',
          },
          aiAgentic: {
            summary: 'Autonomous optimization agents improve content continuously using data protection signals — you set boundaries.',
            detail: 'Optimization agents test, iterate, and improve content based on data protection data within your guardrails. You define acceptable ranges and review significant changes.',
          },
        },
        'brief-approval': {
          preAI: {
            summary: 'Brief approvals are bottlenecked by manual review cycles that delay your data protection work.',
            detail: 'You wait for briefs to pass through approval chains before your data protection tasks can begin. Unclear approval criteria mean briefs bounce back and forth repeatedly.',
          },
          aiAgents: {
            summary: 'AI pre-screens briefs for data protection alignment, routing only exceptions to you.',
            detail: 'Approval agents check briefs against your data protection criteria and flag gaps. You review flagged items rather than reading every brief end to end.',
          },
          aiAgentic: {
            summary: 'Autonomous approval agents clear standard briefs and escalate only data protection exceptions to you.',
            detail: 'Approval agents validate briefs against your data protection criteria and auto-approve routine requests. You handle strategic exceptions and edge cases only.',
          },
        },
        'quality-check': {
          preAI: {
            summary: 'Quality checks are inconsistent manual reviews with no standard data protection criteria.',
            detail: 'Quality varies by reviewer and day. There is no automated baseline for readability, accuracy, or data protection alignment, leading to uneven content standards.',
          },
          aiAgents: {
            summary: 'AI quality gates enforce baseline standards, letting you focus on data protection nuance.',
            detail: 'Quality agents score readability, accuracy, and SEO automatically. Your data protection evaluation focuses on strategic alignment rather than mechanical checks.',
          },
          aiAgentic: {
            summary: 'Autonomous quality agents enforce standards continuously — data protection baselines are self-maintaining.',
            detail: 'Quality agents apply and evolve quality standards based on your data protection benchmarks. You set quality policies that the system enforces and improves over time.',
          },
        },
        'brand-review': {
          preAI: {
            summary: 'Brand reviews are subjective gates that slow your data protection pipeline.',
            detail: 'Reviewers apply brand guidelines inconsistently. What passes one review fails the next, creating unpredictable delays in your data protection workflow.',
          },
          aiAgents: {
            summary: 'AI brand agents pre-score content, surfacing data protection issues before your review.',
            detail: 'Brand review agents apply guidelines consistently and flag data protection deviations. You handle exceptions and judgment calls rather than full content scans.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents review all content at scale — you govern data protection policy evolution.',
            detail: 'Brand review agents handle all compliance checking autonomously with your data protection rules. You update brand guidelines and review the rare edge case that requires human judgment.',
          },
        },
        'stakeholder-signoff': {
          preAI: {
            summary: 'Stakeholder sign-off is a bottleneck where executives delay your data protection timelines.',
            detail: 'Senior approvers are busy and unresponsive. Your data protection work stalls while waiting for sign-off, and last-minute changes create downstream chaos.',
          },
          aiAgents: {
            summary: 'AI prepares sign-off packages with data protection summaries for faster executive approval.',
            detail: 'Sign-off agents compile context, changes, and data protection impact assessments for approvers. Executives review structured summaries rather than raw content.',
          },
          aiAgentic: {
            summary: 'Autonomous agents handle routine sign-offs within data protection parameters — executives approve strategy only.',
            detail: 'Sign-off agents clear content that meets all data protection criteria automatically. Executives only review strategic pivots or high-risk content that breaches defined thresholds.',
          },
        },
        'performance-review': {
          preAI: {
            summary: 'Performance reviews are infrequent manual assessments that underserve your data protection needs.',
            detail: 'Reviews happen quarterly at best, using outdated data. Your data protection perspective is often missing from the evaluation criteria entirely.',
          },
          aiAgents: {
            summary: 'AI evaluates content against KPIs and highlights data protection trends for your review.',
            detail: 'Review agents surface performance data with data protection context pre-attached. You make optimize/archive decisions based on structured analysis rather than raw metrics.',
          },
          aiAgentic: {
            summary: 'Autonomous review agents evaluate and act on performance with data protection logic — you set the framework.',
            detail: 'Review agents continuously assess content against your data protection KPIs and trigger optimize/refresh/archive workflows automatically. You define the evaluation framework.',
          },
        },
        'social-listening': {
          preAI: {
            summary: 'Social listening is ad hoc keyword monitoring with no systematic link to data protection.',
            detail: 'You check social platforms manually for relevant conversations. Insights rarely reach your data protection workflow before they become stale or irrelevant.',
          },
          aiAgents: {
            summary: 'AI monitoring tools surface trending topics and sentiment relevant to data protection in real time.',
            detail: 'Listening agents track conversations and flag data protection signals across platforms. You act on curated insights rather than monitoring feeds manually.',
          },
          aiAgentic: {
            summary: 'Autonomous listening agents track and respond to data protection signals across all platforms in real time.',
            detail: 'Listening agents monitor social channels and proactively surface data protection opportunities and risks. You set monitoring priorities and review strategic findings.',
          },
        },
        'visual-asset-creation': {
          preAI: {
            summary: 'Visual asset creation is a slow design queue disconnected from your data protection needs.',
            detail: 'Design requests go into a backlog with unclear priorities. Your data protection requirements are often lost in translation between brief and final asset.',
          },
          aiAgents: {
            summary: 'AI design tools generate asset options aligned with data protection requirements.',
            detail: 'Design agents produce visual variants following your data protection guidelines. You select and refine from AI-generated options rather than directing from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous design agents produce visual assets within data protection guidelines — you set creative direction.',
            detail: 'Design agents generate publication-ready visuals following your data protection standards. You define the creative vision and approve hero assets while routine visuals ship autonomously.',
          },
        },
        'legal-review': {
          preAI: {
            summary: 'Legal review is an opaque process that creates unpredictable delays in your data protection work.',
            detail: 'Legal feedback arrives late with minimal context. You cannot predict how long review will take, making data protection planning unreliable.',
          },
          aiAgents: {
            summary: 'AI legal screening flags compliance risks early, reducing data protection surprises downstream.',
            detail: 'Legal agents pre-scan content for regulatory issues and data protection risks. You get early warnings rather than discovering problems at the sign-off stage.',
          },
          aiAgentic: {
            summary: 'Autonomous legal agents clear routine content and escalate only true data protection risks to human counsel.',
            detail: 'Legal agents scan and clear standard content autonomously using your data protection rule framework. Human lawyers handle novel risk scenarios and precedent-setting decisions only.',
          },
        },
        'accessibility-check': {
          preAI: {
            summary: 'Accessibility checking is a manual afterthought, rarely connected to your data protection process.',
            detail: 'WCAG compliance and inclusive language reviews happen late in the pipeline. Your data protection work is already done when accessibility issues force rework.',
          },
          aiAgents: {
            summary: 'AI accessibility tools catch WCAG violations automatically, protecting your data protection standards.',
            detail: 'Accessibility agents scan for inclusive language and alt-text compliance. Your data protection requirements benefit from automated baseline checks before human review.',
          },
          aiAgentic: {
            summary: 'Autonomous accessibility agents enforce WCAG and inclusive standards — data protection is guaranteed by default.',
            detail: 'Accessibility agents ensure all content meets compliance standards before publication. Your data protection benefits from guaranteed accessibility without manual checking overhead.',
          },
        },
        'localize-content': {
          preAI: {
            summary: 'Localization is a slow, manual translation process that delays your data protection for global markets.',
            detail: 'Each market requires separate translation, cultural review, and compliance checking. Your data protection suffers because localized versions lag weeks behind the original.',
          },
          aiAgents: {
            summary: 'AI translation agents accelerate localization while respecting data protection requirements.',
            detail: 'Localization agents produce initial translations with data protection context preserved. You review for cultural nuance rather than translating from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous localization agents adapt content for all markets simultaneously — your data protection scales globally.',
            detail: 'Localization agents handle translation, cultural adaptation, and regional compliance autonomously. Your data protection is maintained across markets without manual per-locale effort.',
          },
        },
        'ab-variant-creation': {
          preAI: {
            summary: 'A/B variants are created manually with limited connection to your data protection hypotheses.',
            detail: 'Test variants rely on guesswork rather than data. Your data protection insights rarely inform variant design, reducing the value of testing efforts.',
          },
          aiAgents: {
            summary: 'AI generates test variants informed by data protection data and historical performance.',
            detail: 'Variant agents create headlines, CTAs, and imagery options based on your data protection hypotheses. You select winning approaches rather than brainstorming from zero.',
          },
          aiAgentic: {
            summary: 'Autonomous variant agents design, deploy, and learn from tests using data protection hypotheses — you set the agenda.',
            detail: 'Variant agents run continuous testing experiments informed by your data protection objectives. You define what to test and review strategic learnings while the system iterates autonomously.',
          },
        },
        'content-repurposing': {
          preAI: {
            summary: 'Content repurposing is manual reformatting, disconnected from your data protection goals.',
            detail: 'Each derivative asset is created from scratch. Your data protection requirements are not systematically applied when repurposing content across formats.',
          },
          aiAgents: {
            summary: 'AI repurposing agents derive secondary assets with data protection consistency built in.',
            detail: 'Repurposing agents transform primary content into channel-specific formats following your data protection guidelines. You approve derivatives rather than recreating each manually.',
          },
          aiAgentic: {
            summary: 'Autonomous repurposing agents derive all secondary assets automatically within data protection guidelines.',
            detail: 'Repurposing agents transform primary content into every derivative format following your data protection rules. You set format strategy while the system handles production at scale.',
          },
        },
        'archive-tag': {
          preAI: {
            summary: 'Content archiving is inconsistent, making data protection-related retrieval nearly impossible.',
            detail: 'Tagging and taxonomy are applied inconsistently or not at all. Finding past content relevant to data protection requires searching through unstructured repositories.',
          },
          aiAgents: {
            summary: 'AI tagging agents classify content automatically, making data protection retrieval faster.',
            detail: 'Archive agents apply taxonomy and metadata based on your data protection categories. You validate classifications rather than manually tagging every asset.',
          },
          aiAgentic: {
            summary: 'Autonomous archive agents maintain perfect taxonomy — data protection retrieval is instant and reliable.',
            detail: 'Archive agents classify, tag, and organize all content using your data protection taxonomy automatically. You evolve the taxonomy structure while the system maintains it flawlessly.',
          },
        },
        'legal-compliance-gate': {
          preAI: {
            summary: 'Legal compliance gates create unpredictable holds that delay your data protection deadlines.',
            detail: 'Legal sign-off timing is opaque and variable. Your data protection timelines are at the mercy of legal review queues with no visibility into status.',
          },
          aiAgents: {
            summary: 'AI pre-screening reduces legal gate delays by resolving routine data protection checks automatically.',
            detail: 'Compliance agents handle standard checks and only escalate data protection edge cases to human lawyers. Your timelines are more predictable because routine items clear faster.',
          },
          aiAgentic: {
            summary: 'Autonomous compliance gates clear routine content instantly — only novel data protection risks reach human lawyers.',
            detail: 'Compliance agents handle standard legal checks autonomously using your data protection risk framework. Human review is reserved for unprecedented scenarios and policy updates.',
          },
        },
        'localization-quality-gate': {
          preAI: {
            summary: 'Localization quality gates are inconsistent, creating data protection risks in global markets.',
            detail: 'Quality checks for localized content vary by market and reviewer. Your data protection standards are unevenly applied across regions and languages.',
          },
          aiAgents: {
            summary: 'AI quality checks catch translation errors before they affect your data protection outcomes.',
            detail: 'Localization QA agents verify accuracy and cultural fit automatically. Your data protection standards are applied consistently across all target markets.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents ensure localization quality across all markets — data protection is guaranteed globally.',
            detail: 'Localization QA agents validate every market adaptation autonomously against your data protection standards. You set quality criteria while the system enforces them at scale.',
          },
        },
        'segment-mapping': {
          preAI: {
            summary: 'Segment mapping is manual spreadsheet work with limited visibility into data protection impact.',
            detail: 'Mapping content variants to audience segments is done in spreadsheets. Your data protection data is disconnected from the personalization logic.',
          },
          aiAgents: {
            summary: 'AI agents map variants to segments using data protection data from the CDP.',
            detail: 'Segment agents recommend variant-audience matches based on your data protection signals. You review the mapping rather than building it manually in spreadsheets.',
          },
          aiAgentic: {
            summary: 'Autonomous segment agents map and optimize variant-audience matches using live data protection signals.',
            detail: 'Segment agents continuously refine variant-audience mappings based on real-time data protection data. You define segmentation strategy while the system executes and optimizes automatically.',
          },
        },
        'dynamic-assembly': {
          preAI: {
            summary: 'Dynamic content assembly is rigid and template-bound, limiting your data protection options.',
            detail: 'Personalized experiences require engineering support for each variant. Your data protection vision is constrained by inflexible assembly templates.',
          },
          aiAgents: {
            summary: 'AI assembly agents construct personalized experiences informed by data protection rules.',
            detail: 'Assembly agents combine content components per segment following your data protection logic. You define rules and review outputs rather than manually configuring each variant.',
          },
          aiAgentic: {
            summary: 'Autonomous assembly agents construct personalized experiences in real time — data protection logic is self-optimizing.',
            detail: 'Assembly agents build dynamic experiences per segment using your data protection rules and real-time behavioral signals. You govern personalization policies, not individual assembly configurations.',
          },
        },
        'campaign-planning': {
          preAI: {
            summary: 'Campaign planning is a manual coordination effort with fragmented data protection inputs.',
            detail: 'Campaign plans are built in decks and spreadsheets with incomplete data. Your data protection perspective is often incorporated too late in the planning cycle.',
          },
          aiAgents: {
            summary: 'AI planning agents draft campaign frameworks with data protection data pre-integrated.',
            detail: 'Planning agents pull audience, budget, and performance data into campaign templates. Your data protection priorities shape the plan from the start rather than being retrofitted.',
          },
          aiAgentic: {
            summary: 'Autonomous planning agents generate campaign frameworks using data protection intelligence — you set objectives.',
            detail: 'Planning agents produce data-driven campaign plans with your data protection priorities embedded. You define strategic goals while the system optimizes tactics and resource allocation.',
          },
        },
        'paid-creative-production': {
          preAI: {
            summary: 'Paid creative production runs separately from organic, fragmenting your data protection oversight.',
            detail: 'Ad creative and organic content are produced in silos. Your data protection perspective is applied inconsistently between paid and organic channels.',
          },
          aiAgents: {
            summary: 'AI production agents generate paid variants from organic content with data protection consistency.',
            detail: 'Paid creative agents adapt organic content for ad platforms following your data protection guidelines. You approve and fine-tune rather than producing ad creative from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous production agents create paid variants at scale within data protection guardrails — you set the strategy.',
            detail: 'Paid creative agents generate ad variants from organic content following your data protection guidelines. You define creative strategy while the system produces and optimizes at scale.',
          },
        },
        'attribution-modeling': {
          preAI: {
            summary: 'Attribution modeling is manual and unreliable, undermining your data protection reporting.',
            detail: 'Last-click attribution dominates despite its flaws. Your data protection decisions lack the multi-touch perspective needed for accurate performance assessment.',
          },
          aiAgents: {
            summary: 'AI attribution models surface multi-touch insights relevant to your data protection priorities.',
            detail: 'Attribution agents calculate content ROI across channels using your data protection weightings. You interpret strategic implications rather than building models manually.',
          },
          aiAgentic: {
            summary: 'Autonomous attribution agents run multi-touch models continuously — data protection insights update in real time.',
            detail: 'Attribution agents calculate content ROI across all channels using your data protection framework. You interpret strategic implications while the system handles modeling complexity.',
          },
        },
        'executive-reporting': {
          preAI: {
            summary: 'Executive reports are manually assembled, often missing the data protection narrative you need.',
            detail: 'Building executive dashboards takes hours of data wrangling. The data protection story you want to tell is lost in generic reporting templates.',
          },
          aiAgents: {
            summary: 'AI builds executive dashboards with data protection narratives pre-drafted for leadership.',
            detail: 'Reporting agents synthesize data into executive formats with your data protection story embedded. You refine the narrative rather than assembling data from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce executive dashboards with data protection narratives — you add strategic context.',
            detail: 'Executive reporting agents synthesize all data into leadership-ready formats with your data protection story embedded. You provide strategic commentary on auto-generated insights.',
          },
        },
        'competitive-response': {
          preAI: {
            summary: 'Competitive response is slow and reactive, giving you no data protection advantage.',
            detail: 'By the time you spot a competitor move and respond, the moment has passed. Your data protection approach cannot adapt fast enough to real-time competitive signals.',
          },
          aiAgents: {
            summary: 'AI competitive agents surface signals and draft responses aligned with data protection strategy.',
            detail: 'Competitive agents monitor market moves and suggest data protection-aligned responses. You approve and refine reactive content rather than spotting threats manually.',
          },
          aiAgentic: {
            summary: 'Autonomous competitive agents detect and draft responses in real time — data protection moves are countered instantly.',
            detail: 'Competitive agents monitor signals, draft responses, and deploy within your data protection guardrails. You approve high-stakes responses while routine reactions ship autonomously.',
          },
        },
        'content-governance': {
          preAI: {
            summary: 'Content governance is periodic manual auditing that cannot keep pace with your data protection standards.',
            detail: 'Live content drifts out of compliance between infrequent reviews. Your data protection requirements are only enforced when someone manually checks.',
          },
          aiAgents: {
            summary: 'AI governance agents continuously audit live content against data protection standards.',
            detail: 'Governance agents flag content drift, compliance gaps, and data protection issues in real time. You review flagged items rather than conducting manual audits.',
          },
          aiAgentic: {
            summary: 'Autonomous governance agents audit all live content continuously — data protection compliance is always current.',
            detail: 'Governance agents monitor every published piece against your data protection standards in real time. You evolve governance policies while the system enforces them perpetually.',
          },
        },
        'governance-gate': {
          preAI: {
            summary: 'Governance gates are calendar-driven checkpoints disconnected from your data protection rhythm.',
            detail: 'Governance reviews happen on a fixed schedule regardless of content velocity. Your data protection concerns may not surface until the next quarterly review.',
          },
          aiAgents: {
            summary: 'AI governance gates run continuous checks, surfacing data protection issues between formal reviews.',
            detail: 'Governance agents validate live content against your data protection criteria on an ongoing basis. You act on exception alerts rather than waiting for quarterly reviews.',
          },
          aiAgentic: {
            summary: 'Autonomous governance gates run continuously — data protection violations trigger immediate remediation.',
            detail: 'Governance agents validate live content against your data protection criteria continuously and auto-trigger refresh or retirement workflows. You set policies, not review schedules.',
          },
        },
        'journey-mapping': {
          preAI: {
            summary: 'Journey mapping is a manual exercise that rarely reflects your data protection reality.',
            detail: 'Customer journey maps are created in workshops and quickly go stale. Your data protection perspective is a snapshot, not a living view of how content performs at each stage.',
          },
          aiAgents: {
            summary: 'AI journey agents map content to lifecycle stages using data protection data from the CDP.',
            detail: 'Journey agents dynamically map content to customer stages based on your data protection framework. You validate the mapping rather than building it manually in workshops.',
          },
          aiAgentic: {
            summary: 'Autonomous journey agents maintain living maps using real-time data protection data — you shape the strategy.',
            detail: 'Journey agents dynamically map content to lifecycle stages using live data protection signals. You define journey frameworks while the system optimizes content placement continuously.',
          },
        },
        'sentiment-monitoring': {
          preAI: {
            summary: 'Sentiment monitoring is sporadic manual checking with no systematic link to data protection.',
            detail: 'You check brand sentiment reactively rather than proactively. Your data protection decisions are made without real-time audience feedback signals.',
          },
          aiAgents: {
            summary: 'AI sentiment agents track brand reception in real time, alerting you to data protection risks.',
            detail: 'Sentiment agents analyze audience reactions and flag data protection concerns before they escalate. You respond to alerts rather than manually checking platforms.',
          },
          aiAgentic: {
            summary: 'Autonomous sentiment agents monitor and respond to data protection signals around the clock — you govern escalation.',
            detail: 'Sentiment agents track audience reactions and trigger data protection responses automatically. You set escalation thresholds and review strategic implications of sentiment shifts.',
          },
        },
        'sales-enablement': {
          preAI: {
            summary: 'Sales enablement content is created ad hoc, disconnected from your data protection strategy.',
            detail: 'Sales teams request materials outside the content pipeline. Your data protection standards are not applied to battle cards, decks, and one-pagers created in isolation.',
          },
          aiAgents: {
            summary: 'AI agents generate sales materials from marketing content with data protection alignment.',
            detail: 'Sales enablement agents transform marketing assets into battle cards and decks following your data protection standards. You approve rather than creating each piece manually.',
          },
          aiAgentic: {
            summary: 'Autonomous enablement agents keep sales materials current with data protection alignment — you set the playbook.',
            detail: 'Enablement agents automatically update battle cards, decks, and case studies as your data protection data evolves. You define the sales narrative while the system produces materials at scale.',
          },
        },
        'influencer-brief': {
          preAI: {
            summary: 'Influencer briefs are manual documents with limited data protection guardrails.',
            detail: 'Creator briefs are written from scratch each time. Your data protection guidelines are inconsistently communicated to external partners and influencers.',
          },
          aiAgents: {
            summary: 'AI agents draft influencer briefs with data protection guardrails embedded automatically.',
            detail: 'Brief agents generate creator guidelines from your data protection requirements and past successful collaborations. You customize rather than writing each brief from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous brief agents generate creator guidelines with data protection guardrails — you approve partnerships.',
            detail: 'Brief agents produce personalized influencer guidelines using your data protection framework and creator history. You focus on relationship strategy while briefs ship autonomously.',
          },
        },
        'ugc-moderation': {
          preAI: {
            summary: 'UGC moderation is manual screening that cannot scale to protect data protection.',
            detail: 'User-generated content is reviewed one piece at a time. Your data protection standards cannot be consistently enforced across the volume of submissions.',
          },
          aiAgents: {
            summary: 'AI moderation agents screen UGC for brand safety and data protection compliance at scale.',
            detail: 'Moderation agents filter user-generated content against your data protection criteria. You review borderline cases rather than manually screening every submission.',
          },
          aiAgentic: {
            summary: 'Autonomous moderation agents screen all UGC for data protection compliance at scale — you govern edge cases.',
            detail: 'Moderation agents filter user-generated content using your data protection rules continuously. You update moderation policies and review borderline cases that the system escalates.',
          },
        },
        'content-scoring': {
          preAI: {
            summary: 'Content scoring is subjective prioritization that underweights your data protection criteria.',
            detail: 'Requests are prioritized by loudest voice or executive fiat. Your data protection scoring criteria are rarely part of the formal prioritization framework.',
          },
          aiAgents: {
            summary: 'AI scoring agents rank requests using data protection criteria alongside strategic priority.',
            detail: 'Scoring agents weight your data protection factors into the prioritization algorithm. You adjust rankings rather than scoring each request manually.',
          },
          aiAgentic: {
            summary: 'Autonomous scoring agents prioritize the pipeline using data protection criteria — you set strategic weights.',
            detail: 'Scoring agents rank and route content requests using your data protection priorities in real time. You define scoring criteria and review the queue rather than manually triaging.',
          },
        },
        'channel-orchestration': {
          preAI: {
            summary: 'Channel orchestration is manual coordination with no systematic data protection integration.',
            detail: 'Cross-channel timing is managed in spreadsheets and Slack. Your data protection requirements for sequencing and coordination are often overridden by ad hoc changes.',
          },
          aiAgents: {
            summary: 'AI orchestration agents sequence distribution with data protection rules for timing and cadence.',
            detail: 'Orchestration agents coordinate cross-channel timing based on your data protection requirements. You set rules and review the sequence rather than managing each channel individually.',
          },
          aiAgentic: {
            summary: 'Autonomous orchestration agents manage all channel timing with data protection logic — you set the playbook.',
            detail: 'Orchestration agents handle cross-channel sequencing, timing, and coordination autonomously using your data protection rules. You evolve the orchestration strategy while the system executes.',
          },
        },
      },
      keyInsight: 'Privacy governance enables business capability rather than restricting it. Without this role\'s framework, personalization at scale would be a regulatory liability.',
    },
  },
  {
    id: 'campaign-manager',
    title: 'Campaign Manager',
    description: 'Owns campaign planning, journey mapping, and budget allocation. Responsible for the strategic layer that generates content requests and measures campaign-level ROI.',
    tagline: 'Allocates budget and maps journeys.',
    iconName: 'Megaphone',
    category: 'strategy',
    accentColor: '#3D7AB0',
    ownedSteps: ['campaign-planning', 'journey-mapping'],
    reviewedGates: [],
    relatedAgents: ['performance-agent', 'journey-mapping-agent'],
    relatedInputs: ['budget-allocation', 'cdp-profiles', 'channel-benchmarks', 'content-strategy', 'influencer-database'],
    narrative: {
      nodeJourneys: {
        'campaign-planning': {
          preAI: {
            summary: 'You plan campaigns from scratch, allocating budget across channels and defining content requirements.',
            detail: 'Budget tracking is spreadsheet-based. Attribution is approximate. Campaign-level ROI is calculated after the fact, not during execution.',
          },
          aiAgents: {
            summary: 'Performance agents surface attribution data and budget efficiency scores to inform your planning.',
            detail: 'You stop tracking budget manually and start reallocating based on live data. Campaign adjustments that took weeks now happen in days.',
          },
          aiAgentic: {
            summary: 'Campaign planning becomes a continuous loop — performance data feeds back into allocation recommendations automatically.',
            detail: 'The feedback loop between results and planning runs without manual intervention. You design campaign strategy; the system handles tracking and reallocation.',
          },
        },
        'journey-mapping': {
          preAI: {
            summary: 'You map content to customer journey stages manually, defining touchpoints for each persona and channel.',
            detail: 'Journey maps are static documents updated quarterly. The gap between the map and reality widens between updates.',
          },
          aiAgents: {
            summary: 'Agents populate journey maps with real behavioral data, showing actual customer paths alongside your intended journeys.',
            detail: 'Your maps become living documents. You compare intended journeys with observed behavior and adjust the strategy accordingly.',
          },
          aiAgentic: {
            summary: 'Journey maps update dynamically as customer behavior changes — content routing adjusts in real time.',
            detail: 'The system adapts content delivery based on where customers actually are in their journey, not where your static map says they should be. You govern the strategy.',
          },
        },
        'receive-request': {
          preAI: {
            summary: 'You orchestrate incoming requests manually, sorting through emails and Slack messages for campaign execution.',
            detail: 'Requests arrive in inconsistent formats with no standard intake process. You spend hours triaging and clarifying scope before campaign execution can even begin.',
          },
          aiAgents: {
            summary: 'An AI intake agent structures requests and flags campaign execution implications before they reach your queue.',
            detail: 'Requests arrive pre-categorized with campaign execution signals highlighted. You validate and prioritize rather than manually parsing raw inputs.',
          },
          aiAgentic: {
            summary: 'Autonomous intake agents triage, validate, and route requests with campaign execution logic — you govern exceptions.',
            detail: 'Agentic intake handles end-to-end request processing with your campaign execution rules embedded. You set policies and review escalations while routine requests flow automatically.',
          },
        },
        'research-insights': {
          preAI: {
            summary: 'You gather audience and market research manually, compiling data from multiple sources for campaign execution.',
            detail: 'Research is scattered across tools, reports, and tribal knowledge. Building a complete picture for campaign execution takes days and the data is often stale by the time you use it.',
          },
          aiAgents: {
            summary: 'AI research tools surface audience and market data relevant to your campaign execution needs automatically.',
            detail: 'Research agents pull relevant data from multiple sources and present campaign execution insights in a structured format. You curate and interpret rather than gather.',
          },
          aiAgentic: {
            summary: 'Autonomous research agents continuously update campaign execution intelligence — you set the strategic lens.',
            detail: 'Research agents proactively surface campaign execution insights from market signals, audience data, and competitive movements. You shape research priorities, not execute searches.',
          },
        },
        'write-brief': {
          preAI: {
            summary: 'You wait for briefs written by hand, often lacking the campaign execution detail you need.',
            detail: 'Briefs arrive incomplete or misaligned with your campaign execution requirements. You spend cycles requesting revisions and clarifying expectations before work can proceed.',
          },
          aiAgents: {
            summary: 'AI drafts briefs with campaign execution requirements pre-populated from templates and past projects.',
            detail: 'Brief generation agents pull your campaign execution requirements into structured templates. You review and refine rather than starting from a blank page.',
          },
          aiAgentic: {
            summary: 'Autonomous agents generate complete briefs with campaign execution alignment built in — you approve strategy.',
            detail: 'Brief agents produce publication-ready briefs that embed your campaign execution requirements from historical patterns. You govern strategic direction rather than reviewing drafts.',
          },
        },
        'draft-content': {
          preAI: {
            summary: 'You review drafts created entirely by hand, checking each one for alignment with campaign execution.',
            detail: 'First drafts vary wildly in quality and campaign execution alignment. You often send content back for multiple revision cycles, creating bottlenecks in the pipeline.',
          },
          aiAgents: {
            summary: 'AI generates first drafts with campaign execution guidelines embedded, reducing your revision cycles.',
            detail: 'Drafting agents produce content aligned with your campaign execution standards from the start. You focus on strategic refinement rather than basic corrections.',
          },
          aiAgentic: {
            summary: 'Autonomous drafting agents produce content meeting campaign execution standards — you set creative direction.',
            detail: 'Drafting agents generate content that passes your campaign execution criteria automatically. You focus on strategic vision and creative differentiation rather than quality control.',
          },
        },
        'seo-optimization': {
          preAI: {
            summary: 'SEO optimization is manual and disconnected from your campaign execution priorities.',
            detail: 'Keyword research and meta optimization happen separately from your campaign execution workflow. You rarely see SEO data until after content is already in review.',
          },
          aiAgents: {
            summary: 'AI SEO tools optimize content while preserving your campaign execution priorities.',
            detail: 'SEO agents suggest keywords and meta improvements that align with your campaign execution goals. You approve optimizations rather than manually researching keywords.',
          },
          aiAgentic: {
            summary: 'Autonomous SEO agents optimize continuously within campaign execution boundaries — you define the strategy.',
            detail: 'SEO agents self-optimize content based on real-time search signals and your campaign execution guardrails. You set strategic keywords and constraints, not individual page optimizations.',
          },
        },
        'brand-compliance': {
          preAI: {
            summary: 'Brand checks are subjective and slow, creating delays in your campaign execution workflow.',
            detail: 'Brand reviewers interpret guidelines differently. Inconsistent enforcement of tone, terminology, and messaging means campaign execution is harder to maintain at scale.',
          },
          aiAgents: {
            summary: 'AI brand checkers flag violations and score campaign execution alignment before human review.',
            detail: 'Brand agents scan content against guidelines and highlight campaign execution issues. You make judgment calls on edge cases rather than catching basic violations.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents enforce compliance at scale with campaign execution rules — you update the rulebook.',
            detail: 'Brand agents apply and evolve compliance checks across all content automatically. Your campaign execution standards are codified as machine-enforceable rules that you govern and refine.',
          },
        },
        'final-edit': {
          preAI: {
            summary: 'Final edits depend entirely on editor availability, blocking your campaign execution timelines.',
            detail: 'A single editor bottleneck means content waits in queue. Your campaign execution deadlines slip because there is no way to parallelize the final polish step.',
          },
          aiAgents: {
            summary: 'AI editing assistants handle mechanical fixes, freeing your campaign execution focus for strategic polish.',
            detail: 'Editing agents catch grammar, style, and consistency issues automatically. Your campaign execution perspective is reserved for nuance and narrative quality.',
          },
          aiAgentic: {
            summary: 'Autonomous editing agents polish content to publication standard — your campaign execution bar is encoded as policy.',
            detail: 'Editing agents handle all mechanical and stylistic refinement autonomously. Your campaign execution standards are embedded as editorial policies that improve with each iteration.',
          },
        },
        'schedule-publish': {
          preAI: {
            summary: 'Publishing is a manual CMS process with no connection to your campaign execution planning.',
            detail: 'Each piece requires manual scheduling, metadata entry, and CMS configuration. Your campaign execution goals are disconnected from the publish timeline.',
          },
          aiAgents: {
            summary: 'AI scheduling agents suggest optimal publish timing based on campaign execution data.',
            detail: 'Publishing agents recommend times and configurations informed by your campaign execution priorities. You approve the schedule rather than manually configuring CMS settings.',
          },
          aiAgentic: {
            summary: 'Autonomous publishing agents manage scheduling end-to-end using campaign execution optimization logic.',
            detail: 'Publishing agents handle CMS configuration, timing optimization, and deployment autonomously within your campaign execution constraints. You set publishing policies, not individual schedules.',
          },
        },
        'distribute': {
          preAI: {
            summary: 'Content distribution is manual channel-by-channel, with limited visibility into campaign execution.',
            detail: 'Each channel requires separate formatting, scheduling, and posting. There is no unified view of how distribution supports your campaign execution objectives.',
          },
          aiAgents: {
            summary: 'AI distribution agents adapt content per channel with campaign execution rules built in.',
            detail: 'Distribution agents format and deploy content across channels following your campaign execution guidelines. You monitor and adjust rather than manually posting to each platform.',
          },
          aiAgentic: {
            summary: 'Autonomous distribution agents manage all channels with campaign execution rules — you govern the playbook.',
            detail: 'Distribution agents deploy, adapt, and optimize content across every channel following your campaign execution playbook. You evolve distribution strategy, not execute individual channel posts.',
          },
        },
        'track-performance': {
          preAI: {
            summary: 'Performance tracking is fragmented across tools, making campaign execution assessment difficult.',
            detail: 'You pull data from analytics dashboards, social platforms, and CRM separately. Building a complete picture for campaign execution requires manual data stitching.',
          },
          aiAgents: {
            summary: 'AI dashboards surface campaign execution metrics in real time without manual data pulling.',
            detail: 'Performance agents aggregate data and highlight the campaign execution signals that matter to you. You analyze trends rather than building dashboards from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous tracking agents monitor campaign execution metrics continuously and trigger alerts and actions.',
            detail: 'Performance agents stream campaign execution data and automatically trigger optimization workflows when thresholds are breached. You define KPIs and review strategic implications.',
          },
        },
        'generate-report': {
          preAI: {
            summary: 'Reports are built manually in spreadsheets, often missing the campaign execution metrics you need.',
            detail: 'Report creation takes hours of data gathering and formatting. The metrics that matter for campaign execution are often buried or missing entirely from standard templates.',
          },
          aiAgents: {
            summary: 'AI generates reports with campaign execution metrics pre-formatted and insights highlighted.',
            detail: 'Reporting agents compile your campaign execution data into structured templates with automated analysis. You add strategic narrative rather than wrangling data.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce campaign execution reports on demand with strategic recommendations.',
            detail: 'Reporting agents generate campaign execution analyses with actionable recommendations automatically. You consume insights and set strategic direction rather than producing reports.',
          },
        },
        'optimize': {
          preAI: {
            summary: 'Content optimization is reactive and slow, with limited connection to campaign execution data.',
            detail: 'Optimization decisions rely on gut feel and delayed data. Your campaign execution insights rarely feed back into content updates in a timely way.',
          },
          aiAgents: {
            summary: 'AI recommends optimizations based on campaign execution signals and historical performance.',
            detail: 'Optimization agents suggest specific changes tied to your campaign execution metrics. You approve and prioritize recommendations rather than diagnosing issues manually.',
          },
          aiAgentic: {
            summary: 'Autonomous optimization agents improve content continuously using campaign execution signals — you set boundaries.',
            detail: 'Optimization agents test, iterate, and improve content based on campaign execution data within your guardrails. You define acceptable ranges and review significant changes.',
          },
        },
        'brief-approval': {
          preAI: {
            summary: 'Brief approvals are bottlenecked by manual review cycles that delay your campaign execution work.',
            detail: 'You wait for briefs to pass through approval chains before your campaign execution tasks can begin. Unclear approval criteria mean briefs bounce back and forth repeatedly.',
          },
          aiAgents: {
            summary: 'AI pre-screens briefs for campaign execution alignment, routing only exceptions to you.',
            detail: 'Approval agents check briefs against your campaign execution criteria and flag gaps. You review flagged items rather than reading every brief end to end.',
          },
          aiAgentic: {
            summary: 'Autonomous approval agents clear standard briefs and escalate only campaign execution exceptions to you.',
            detail: 'Approval agents validate briefs against your campaign execution criteria and auto-approve routine requests. You handle strategic exceptions and edge cases only.',
          },
        },
        'quality-check': {
          preAI: {
            summary: 'Quality checks are inconsistent manual reviews with no standard campaign execution criteria.',
            detail: 'Quality varies by reviewer and day. There is no automated baseline for readability, accuracy, or campaign execution alignment, leading to uneven content standards.',
          },
          aiAgents: {
            summary: 'AI quality gates enforce baseline standards, letting you focus on campaign execution nuance.',
            detail: 'Quality agents score readability, accuracy, and SEO automatically. Your campaign execution evaluation focuses on strategic alignment rather than mechanical checks.',
          },
          aiAgentic: {
            summary: 'Autonomous quality agents enforce standards continuously — campaign execution baselines are self-maintaining.',
            detail: 'Quality agents apply and evolve quality standards based on your campaign execution benchmarks. You set quality policies that the system enforces and improves over time.',
          },
        },
        'brand-review': {
          preAI: {
            summary: 'Brand reviews are subjective gates that slow your campaign execution pipeline.',
            detail: 'Reviewers apply brand guidelines inconsistently. What passes one review fails the next, creating unpredictable delays in your campaign execution workflow.',
          },
          aiAgents: {
            summary: 'AI brand agents pre-score content, surfacing campaign execution issues before your review.',
            detail: 'Brand review agents apply guidelines consistently and flag campaign execution deviations. You handle exceptions and judgment calls rather than full content scans.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents review all content at scale — you govern campaign execution policy evolution.',
            detail: 'Brand review agents handle all compliance checking autonomously with your campaign execution rules. You update brand guidelines and review the rare edge case that requires human judgment.',
          },
        },
        'stakeholder-signoff': {
          preAI: {
            summary: 'Stakeholder sign-off is a bottleneck where executives delay your campaign execution timelines.',
            detail: 'Senior approvers are busy and unresponsive. Your campaign execution work stalls while waiting for sign-off, and last-minute changes create downstream chaos.',
          },
          aiAgents: {
            summary: 'AI prepares sign-off packages with campaign execution summaries for faster executive approval.',
            detail: 'Sign-off agents compile context, changes, and campaign execution impact assessments for approvers. Executives review structured summaries rather than raw content.',
          },
          aiAgentic: {
            summary: 'Autonomous agents handle routine sign-offs within campaign execution parameters — executives approve strategy only.',
            detail: 'Sign-off agents clear content that meets all campaign execution criteria automatically. Executives only review strategic pivots or high-risk content that breaches defined thresholds.',
          },
        },
        'performance-review': {
          preAI: {
            summary: 'Performance reviews are infrequent manual assessments that underserve your campaign execution needs.',
            detail: 'Reviews happen quarterly at best, using outdated data. Your campaign execution perspective is often missing from the evaluation criteria entirely.',
          },
          aiAgents: {
            summary: 'AI evaluates content against KPIs and highlights campaign execution trends for your review.',
            detail: 'Review agents surface performance data with campaign execution context pre-attached. You make optimize/archive decisions based on structured analysis rather than raw metrics.',
          },
          aiAgentic: {
            summary: 'Autonomous review agents evaluate and act on performance with campaign execution logic — you set the framework.',
            detail: 'Review agents continuously assess content against your campaign execution KPIs and trigger optimize/refresh/archive workflows automatically. You define the evaluation framework.',
          },
        },
        'social-listening': {
          preAI: {
            summary: 'Social listening is ad hoc keyword monitoring with no systematic link to campaign execution.',
            detail: 'You check social platforms manually for relevant conversations. Insights rarely reach your campaign execution workflow before they become stale or irrelevant.',
          },
          aiAgents: {
            summary: 'AI monitoring tools surface trending topics and sentiment relevant to campaign execution in real time.',
            detail: 'Listening agents track conversations and flag campaign execution signals across platforms. You act on curated insights rather than monitoring feeds manually.',
          },
          aiAgentic: {
            summary: 'Autonomous listening agents track and respond to campaign execution signals across all platforms in real time.',
            detail: 'Listening agents monitor social channels and proactively surface campaign execution opportunities and risks. You set monitoring priorities and review strategic findings.',
          },
        },
        'visual-asset-creation': {
          preAI: {
            summary: 'Visual asset creation is a slow design queue disconnected from your campaign execution needs.',
            detail: 'Design requests go into a backlog with unclear priorities. Your campaign execution requirements are often lost in translation between brief and final asset.',
          },
          aiAgents: {
            summary: 'AI design tools generate asset options aligned with campaign execution requirements.',
            detail: 'Design agents produce visual variants following your campaign execution guidelines. You select and refine from AI-generated options rather than directing from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous design agents produce visual assets within campaign execution guidelines — you set creative direction.',
            detail: 'Design agents generate publication-ready visuals following your campaign execution standards. You define the creative vision and approve hero assets while routine visuals ship autonomously.',
          },
        },
        'legal-review': {
          preAI: {
            summary: 'Legal review is an opaque process that creates unpredictable delays in your campaign execution work.',
            detail: 'Legal feedback arrives late with minimal context. You cannot predict how long review will take, making campaign execution planning unreliable.',
          },
          aiAgents: {
            summary: 'AI legal screening flags compliance risks early, reducing campaign execution surprises downstream.',
            detail: 'Legal agents pre-scan content for regulatory issues and campaign execution risks. You get early warnings rather than discovering problems at the sign-off stage.',
          },
          aiAgentic: {
            summary: 'Autonomous legal agents clear routine content and escalate only true campaign execution risks to human counsel.',
            detail: 'Legal agents scan and clear standard content autonomously using your campaign execution rule framework. Human lawyers handle novel risk scenarios and precedent-setting decisions only.',
          },
        },
        'accessibility-check': {
          preAI: {
            summary: 'Accessibility checking is a manual afterthought, rarely connected to your campaign execution process.',
            detail: 'WCAG compliance and inclusive language reviews happen late in the pipeline. Your campaign execution work is already done when accessibility issues force rework.',
          },
          aiAgents: {
            summary: 'AI accessibility tools catch WCAG violations automatically, protecting your campaign execution standards.',
            detail: 'Accessibility agents scan for inclusive language and alt-text compliance. Your campaign execution requirements benefit from automated baseline checks before human review.',
          },
          aiAgentic: {
            summary: 'Autonomous accessibility agents enforce WCAG and inclusive standards — campaign execution is guaranteed by default.',
            detail: 'Accessibility agents ensure all content meets compliance standards before publication. Your campaign execution benefits from guaranteed accessibility without manual checking overhead.',
          },
        },
        'localize-content': {
          preAI: {
            summary: 'Localization is a slow, manual translation process that delays your campaign execution for global markets.',
            detail: 'Each market requires separate translation, cultural review, and compliance checking. Your campaign execution suffers because localized versions lag weeks behind the original.',
          },
          aiAgents: {
            summary: 'AI translation agents accelerate localization while respecting campaign execution requirements.',
            detail: 'Localization agents produce initial translations with campaign execution context preserved. You review for cultural nuance rather than translating from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous localization agents adapt content for all markets simultaneously — your campaign execution scales globally.',
            detail: 'Localization agents handle translation, cultural adaptation, and regional compliance autonomously. Your campaign execution is maintained across markets without manual per-locale effort.',
          },
        },
        'ab-variant-creation': {
          preAI: {
            summary: 'A/B variants are created manually with limited connection to your campaign execution hypotheses.',
            detail: 'Test variants rely on guesswork rather than data. Your campaign execution insights rarely inform variant design, reducing the value of testing efforts.',
          },
          aiAgents: {
            summary: 'AI generates test variants informed by campaign execution data and historical performance.',
            detail: 'Variant agents create headlines, CTAs, and imagery options based on your campaign execution hypotheses. You select winning approaches rather than brainstorming from zero.',
          },
          aiAgentic: {
            summary: 'Autonomous variant agents design, deploy, and learn from tests using campaign execution hypotheses — you set the agenda.',
            detail: 'Variant agents run continuous testing experiments informed by your campaign execution objectives. You define what to test and review strategic learnings while the system iterates autonomously.',
          },
        },
        'content-repurposing': {
          preAI: {
            summary: 'Content repurposing is manual reformatting, disconnected from your campaign execution goals.',
            detail: 'Each derivative asset is created from scratch. Your campaign execution requirements are not systematically applied when repurposing content across formats.',
          },
          aiAgents: {
            summary: 'AI repurposing agents derive secondary assets with campaign execution consistency built in.',
            detail: 'Repurposing agents transform primary content into channel-specific formats following your campaign execution guidelines. You approve derivatives rather than recreating each manually.',
          },
          aiAgentic: {
            summary: 'Autonomous repurposing agents derive all secondary assets automatically within campaign execution guidelines.',
            detail: 'Repurposing agents transform primary content into every derivative format following your campaign execution rules. You set format strategy while the system handles production at scale.',
          },
        },
        'archive-tag': {
          preAI: {
            summary: 'Content archiving is inconsistent, making campaign execution-related retrieval nearly impossible.',
            detail: 'Tagging and taxonomy are applied inconsistently or not at all. Finding past content relevant to campaign execution requires searching through unstructured repositories.',
          },
          aiAgents: {
            summary: 'AI tagging agents classify content automatically, making campaign execution retrieval faster.',
            detail: 'Archive agents apply taxonomy and metadata based on your campaign execution categories. You validate classifications rather than manually tagging every asset.',
          },
          aiAgentic: {
            summary: 'Autonomous archive agents maintain perfect taxonomy — campaign execution retrieval is instant and reliable.',
            detail: 'Archive agents classify, tag, and organize all content using your campaign execution taxonomy automatically. You evolve the taxonomy structure while the system maintains it flawlessly.',
          },
        },
        'legal-compliance-gate': {
          preAI: {
            summary: 'Legal compliance gates create unpredictable holds that delay your campaign execution deadlines.',
            detail: 'Legal sign-off timing is opaque and variable. Your campaign execution timelines are at the mercy of legal review queues with no visibility into status.',
          },
          aiAgents: {
            summary: 'AI pre-screening reduces legal gate delays by resolving routine campaign execution checks automatically.',
            detail: 'Compliance agents handle standard checks and only escalate campaign execution edge cases to human lawyers. Your timelines are more predictable because routine items clear faster.',
          },
          aiAgentic: {
            summary: 'Autonomous compliance gates clear routine content instantly — only novel campaign execution risks reach human lawyers.',
            detail: 'Compliance agents handle standard legal checks autonomously using your campaign execution risk framework. Human review is reserved for unprecedented scenarios and policy updates.',
          },
        },
        'localization-quality-gate': {
          preAI: {
            summary: 'Localization quality gates are inconsistent, creating campaign execution risks in global markets.',
            detail: 'Quality checks for localized content vary by market and reviewer. Your campaign execution standards are unevenly applied across regions and languages.',
          },
          aiAgents: {
            summary: 'AI quality checks catch translation errors before they affect your campaign execution outcomes.',
            detail: 'Localization QA agents verify accuracy and cultural fit automatically. Your campaign execution standards are applied consistently across all target markets.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents ensure localization quality across all markets — campaign execution is guaranteed globally.',
            detail: 'Localization QA agents validate every market adaptation autonomously against your campaign execution standards. You set quality criteria while the system enforces them at scale.',
          },
        },
        'segment-mapping': {
          preAI: {
            summary: 'Segment mapping is manual spreadsheet work with limited visibility into campaign execution impact.',
            detail: 'Mapping content variants to audience segments is done in spreadsheets. Your campaign execution data is disconnected from the personalization logic.',
          },
          aiAgents: {
            summary: 'AI agents map variants to segments using campaign execution data from the CDP.',
            detail: 'Segment agents recommend variant-audience matches based on your campaign execution signals. You review the mapping rather than building it manually in spreadsheets.',
          },
          aiAgentic: {
            summary: 'Autonomous segment agents map and optimize variant-audience matches using live campaign execution signals.',
            detail: 'Segment agents continuously refine variant-audience mappings based on real-time campaign execution data. You define segmentation strategy while the system executes and optimizes automatically.',
          },
        },
        'dynamic-assembly': {
          preAI: {
            summary: 'Dynamic content assembly is rigid and template-bound, limiting your campaign execution options.',
            detail: 'Personalized experiences require engineering support for each variant. Your campaign execution vision is constrained by inflexible assembly templates.',
          },
          aiAgents: {
            summary: 'AI assembly agents construct personalized experiences informed by campaign execution rules.',
            detail: 'Assembly agents combine content components per segment following your campaign execution logic. You define rules and review outputs rather than manually configuring each variant.',
          },
          aiAgentic: {
            summary: 'Autonomous assembly agents construct personalized experiences in real time — campaign execution logic is self-optimizing.',
            detail: 'Assembly agents build dynamic experiences per segment using your campaign execution rules and real-time behavioral signals. You govern personalization policies, not individual assembly configurations.',
          },
        },
        'personalization-qa': {
          preAI: {
            summary: 'Personalization QA is manual spot-checking that misses campaign execution gaps.',
            detail: 'Testing every segment-variant combination is impossible manually. Your campaign execution concerns are only caught when users report issues post-launch.',
          },
          aiAgents: {
            summary: 'AI QA agents validate personalization coverage and flag campaign execution gaps before launch.',
            detail: 'QA agents test every segment-variant combination against your campaign execution requirements. You review exception reports rather than manually spot-checking combinations.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents validate every personalization scenario — campaign execution gaps are caught before launch.',
            detail: 'Personalization QA agents test all segment-variant combinations against your campaign execution requirements automatically. You set acceptance criteria while the system validates at scale.',
          },
        },
        'consent-check': {
          preAI: {
            summary: 'Consent checking is a manual compliance step that adds friction to your campaign execution process.',
            detail: 'Verifying GDPR/CCPA consent for targeting requires manual cross-referencing. Your campaign execution work is delayed while compliance status is manually confirmed.',
          },
          aiAgents: {
            summary: 'AI consent agents verify targeting compliance automatically, reducing campaign execution friction.',
            detail: 'Consent agents cross-reference CDP signals against GDPR/CCPA rules for your campaign execution needs. You handle exceptions rather than manually verifying every segment.',
          },
          aiAgentic: {
            summary: 'Autonomous consent agents enforce privacy compliance at scale — campaign execution is guaranteed by architecture.',
            detail: 'Consent agents verify targeting compliance in real time across all segments using your campaign execution framework. You set privacy policies while the system enforces them automatically.',
          },
        },
        'paid-creative-production': {
          preAI: {
            summary: 'Paid creative production runs separately from organic, fragmenting your campaign execution oversight.',
            detail: 'Ad creative and organic content are produced in silos. Your campaign execution perspective is applied inconsistently between paid and organic channels.',
          },
          aiAgents: {
            summary: 'AI production agents generate paid variants from organic content with campaign execution consistency.',
            detail: 'Paid creative agents adapt organic content for ad platforms following your campaign execution guidelines. You approve and fine-tune rather than producing ad creative from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous production agents create paid variants at scale within campaign execution guardrails — you set the strategy.',
            detail: 'Paid creative agents generate ad variants from organic content following your campaign execution guidelines. You define creative strategy while the system produces and optimizes at scale.',
          },
        },
        'attribution-modeling': {
          preAI: {
            summary: 'Attribution modeling is manual and unreliable, undermining your campaign execution reporting.',
            detail: 'Last-click attribution dominates despite its flaws. Your campaign execution decisions lack the multi-touch perspective needed for accurate performance assessment.',
          },
          aiAgents: {
            summary: 'AI attribution models surface multi-touch insights relevant to your campaign execution priorities.',
            detail: 'Attribution agents calculate content ROI across channels using your campaign execution weightings. You interpret strategic implications rather than building models manually.',
          },
          aiAgentic: {
            summary: 'Autonomous attribution agents run multi-touch models continuously — campaign execution insights update in real time.',
            detail: 'Attribution agents calculate content ROI across all channels using your campaign execution framework. You interpret strategic implications while the system handles modeling complexity.',
          },
        },
        'executive-reporting': {
          preAI: {
            summary: 'Executive reports are manually assembled, often missing the campaign execution narrative you need.',
            detail: 'Building executive dashboards takes hours of data wrangling. The campaign execution story you want to tell is lost in generic reporting templates.',
          },
          aiAgents: {
            summary: 'AI builds executive dashboards with campaign execution narratives pre-drafted for leadership.',
            detail: 'Reporting agents synthesize data into executive formats with your campaign execution story embedded. You refine the narrative rather than assembling data from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce executive dashboards with campaign execution narratives — you add strategic context.',
            detail: 'Executive reporting agents synthesize all data into leadership-ready formats with your campaign execution story embedded. You provide strategic commentary on auto-generated insights.',
          },
        },
        'competitive-response': {
          preAI: {
            summary: 'Competitive response is slow and reactive, giving you no campaign execution advantage.',
            detail: 'By the time you spot a competitor move and respond, the moment has passed. Your campaign execution approach cannot adapt fast enough to real-time competitive signals.',
          },
          aiAgents: {
            summary: 'AI competitive agents surface signals and draft responses aligned with campaign execution strategy.',
            detail: 'Competitive agents monitor market moves and suggest campaign execution-aligned responses. You approve and refine reactive content rather than spotting threats manually.',
          },
          aiAgentic: {
            summary: 'Autonomous competitive agents detect and draft responses in real time — campaign execution moves are countered instantly.',
            detail: 'Competitive agents monitor signals, draft responses, and deploy within your campaign execution guardrails. You approve high-stakes responses while routine reactions ship autonomously.',
          },
        },
        'content-governance': {
          preAI: {
            summary: 'Content governance is periodic manual auditing that cannot keep pace with your campaign execution standards.',
            detail: 'Live content drifts out of compliance between infrequent reviews. Your campaign execution requirements are only enforced when someone manually checks.',
          },
          aiAgents: {
            summary: 'AI governance agents continuously audit live content against campaign execution standards.',
            detail: 'Governance agents flag content drift, compliance gaps, and campaign execution issues in real time. You review flagged items rather than conducting manual audits.',
          },
          aiAgentic: {
            summary: 'Autonomous governance agents audit all live content continuously — campaign execution compliance is always current.',
            detail: 'Governance agents monitor every published piece against your campaign execution standards in real time. You evolve governance policies while the system enforces them perpetually.',
          },
        },
        'governance-gate': {
          preAI: {
            summary: 'Governance gates are calendar-driven checkpoints disconnected from your campaign execution rhythm.',
            detail: 'Governance reviews happen on a fixed schedule regardless of content velocity. Your campaign execution concerns may not surface until the next quarterly review.',
          },
          aiAgents: {
            summary: 'AI governance gates run continuous checks, surfacing campaign execution issues between formal reviews.',
            detail: 'Governance agents validate live content against your campaign execution criteria on an ongoing basis. You act on exception alerts rather than waiting for quarterly reviews.',
          },
          aiAgentic: {
            summary: 'Autonomous governance gates run continuously — campaign execution violations trigger immediate remediation.',
            detail: 'Governance agents validate live content against your campaign execution criteria continuously and auto-trigger refresh or retirement workflows. You set policies, not review schedules.',
          },
        },
        'sentiment-monitoring': {
          preAI: {
            summary: 'Sentiment monitoring is sporadic manual checking with no systematic link to campaign execution.',
            detail: 'You check brand sentiment reactively rather than proactively. Your campaign execution decisions are made without real-time audience feedback signals.',
          },
          aiAgents: {
            summary: 'AI sentiment agents track brand reception in real time, alerting you to campaign execution risks.',
            detail: 'Sentiment agents analyze audience reactions and flag campaign execution concerns before they escalate. You respond to alerts rather than manually checking platforms.',
          },
          aiAgentic: {
            summary: 'Autonomous sentiment agents monitor and respond to campaign execution signals around the clock — you govern escalation.',
            detail: 'Sentiment agents track audience reactions and trigger campaign execution responses automatically. You set escalation thresholds and review strategic implications of sentiment shifts.',
          },
        },
        'sales-enablement': {
          preAI: {
            summary: 'Sales enablement content is created ad hoc, disconnected from your campaign execution strategy.',
            detail: 'Sales teams request materials outside the content pipeline. Your campaign execution standards are not applied to battle cards, decks, and one-pagers created in isolation.',
          },
          aiAgents: {
            summary: 'AI agents generate sales materials from marketing content with campaign execution alignment.',
            detail: 'Sales enablement agents transform marketing assets into battle cards and decks following your campaign execution standards. You approve rather than creating each piece manually.',
          },
          aiAgentic: {
            summary: 'Autonomous enablement agents keep sales materials current with campaign execution alignment — you set the playbook.',
            detail: 'Enablement agents automatically update battle cards, decks, and case studies as your campaign execution data evolves. You define the sales narrative while the system produces materials at scale.',
          },
        },
        'influencer-brief': {
          preAI: {
            summary: 'Influencer briefs are manual documents with limited campaign execution guardrails.',
            detail: 'Creator briefs are written from scratch each time. Your campaign execution guidelines are inconsistently communicated to external partners and influencers.',
          },
          aiAgents: {
            summary: 'AI agents draft influencer briefs with campaign execution guardrails embedded automatically.',
            detail: 'Brief agents generate creator guidelines from your campaign execution requirements and past successful collaborations. You customize rather than writing each brief from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous brief agents generate creator guidelines with campaign execution guardrails — you approve partnerships.',
            detail: 'Brief agents produce personalized influencer guidelines using your campaign execution framework and creator history. You focus on relationship strategy while briefs ship autonomously.',
          },
        },
        'ugc-moderation': {
          preAI: {
            summary: 'UGC moderation is manual screening that cannot scale to protect campaign execution.',
            detail: 'User-generated content is reviewed one piece at a time. Your campaign execution standards cannot be consistently enforced across the volume of submissions.',
          },
          aiAgents: {
            summary: 'AI moderation agents screen UGC for brand safety and campaign execution compliance at scale.',
            detail: 'Moderation agents filter user-generated content against your campaign execution criteria. You review borderline cases rather than manually screening every submission.',
          },
          aiAgentic: {
            summary: 'Autonomous moderation agents screen all UGC for campaign execution compliance at scale — you govern edge cases.',
            detail: 'Moderation agents filter user-generated content using your campaign execution rules continuously. You update moderation policies and review borderline cases that the system escalates.',
          },
        },
        'content-scoring': {
          preAI: {
            summary: 'Content scoring is subjective prioritization that underweights your campaign execution criteria.',
            detail: 'Requests are prioritized by loudest voice or executive fiat. Your campaign execution scoring criteria are rarely part of the formal prioritization framework.',
          },
          aiAgents: {
            summary: 'AI scoring agents rank requests using campaign execution criteria alongside strategic priority.',
            detail: 'Scoring agents weight your campaign execution factors into the prioritization algorithm. You adjust rankings rather than scoring each request manually.',
          },
          aiAgentic: {
            summary: 'Autonomous scoring agents prioritize the pipeline using campaign execution criteria — you set strategic weights.',
            detail: 'Scoring agents rank and route content requests using your campaign execution priorities in real time. You define scoring criteria and review the queue rather than manually triaging.',
          },
        },
        'channel-orchestration': {
          preAI: {
            summary: 'Channel orchestration is manual coordination with no systematic campaign execution integration.',
            detail: 'Cross-channel timing is managed in spreadsheets and Slack. Your campaign execution requirements for sequencing and coordination are often overridden by ad hoc changes.',
          },
          aiAgents: {
            summary: 'AI orchestration agents sequence distribution with campaign execution rules for timing and cadence.',
            detail: 'Orchestration agents coordinate cross-channel timing based on your campaign execution requirements. You set rules and review the sequence rather than managing each channel individually.',
          },
          aiAgentic: {
            summary: 'Autonomous orchestration agents manage all channel timing with campaign execution logic — you set the playbook.',
            detail: 'Orchestration agents handle cross-channel sequencing, timing, and coordination autonomously using your campaign execution rules. You evolve the orchestration strategy while the system executes.',
          },
        },
      },
      keyInsight: 'Campaign planning is the largest feedback loop in the system. When it\'s tight, the whole pipeline learns faster.',
    },
  },
  {
    id: 'partnerships-lead',
    title: 'Partnerships & Influencer Lead',
    description: 'Owns influencer briefs, creator relationships, and UGC moderation. Responsible for the earned and co-created content layer of the content pipeline.',
    tagline: 'Bridges creators and brand standards.',
    iconName: 'Handshake',
    category: 'creative',
    accentColor: '#8A6ABB',
    ownedSteps: ['influencer-brief', 'ugc-moderation'],
    reviewedGates: ['brand-review'],
    relatedAgents: ['writer-agent'],
    relatedInputs: ['influencer-database', 'brand-guide', 'legal-guidelines'],
    narrative: {
      nodeJourneys: {
        'influencer-brief': {
          preAI: {
            summary: 'You write briefs for each creator collaboration, specifying brand requirements, deliverables, and disclosure rules.',
            detail: 'Each brief is custom because every creator relationship is different. Negotiation and alignment take as much time as the brief itself.',
          },
          aiAgents: {
            summary: 'An agent drafts creator briefs from your templates, pre-populated with campaign context and compliance requirements.',
            detail: 'Brief production is faster. You spend more time on relationship strategy — which creators to partner with and why — rather than brief writing.',
          },
          aiAgentic: {
            summary: 'Standard influencer briefs auto-generate when campaign plans are finalized — you customize only high-value partnerships.',
            detail: 'Routine collaborations brief themselves. Your time concentrates on strategic partnerships where the relationship matters more than the deliverable.',
          },
        },
        'ugc-moderation': {
          preAI: {
            summary: 'You manually review every creator submission for brand alignment, legal compliance, and quality standards.',
            detail: 'Each creator submission is reviewed individually. Rights clearance, disclosure checks, and brand alignment are all manual steps.',
          },
          aiAgents: {
            summary: 'Content moderation and compliance screening happen automatically — you review only flagged submissions.',
            detail: 'The agent handles first-pass moderation and disclosure checks. Your reviews focus on brand fit and relationship implications.',
          },
          aiAgentic: {
            summary: 'Creator content flows through the same quality and brand gates as internal content — one standard, no separate process.',
            detail: 'UGC and influencer content are treated as first-class inputs to the pipeline. Compliance is automated; relationship judgment stays with you.',
          },
        },
        'brand-review': {
          preAI: {
            summary: 'You ensure creator content meets brand standards, bridging the gap between external creative freedom and brand consistency.',
            detail: 'Creator content is inherently unpredictable. Your review balances brand protection with the authenticity that makes influencer content valuable.',
          },
          aiAgents: {
            summary: 'Automated brand scoring handles technical compliance — you evaluate whether creator content feels authentic within brand boundaries.',
            detail: 'The agent catches obvious brand violations. You focus on the harder question: does this content strengthen the brand relationship?',
          },
          aiAgentic: {
            summary: 'Brand compliance for creator content runs automatically — you focus on partnership strategy and brand evolution.',
            detail: 'Relationship judgment — knowing which creators strengthen the brand over time — is the part of this gate that doesn\'t scale through automation.',
          },
        },
        'receive-request': {
          preAI: {
            summary: 'You collaborate incoming requests manually, sorting through emails and Slack messages for partner relationships.',
            detail: 'Requests arrive in inconsistent formats with no standard intake process. You spend hours triaging and clarifying scope before partner relationships can even begin.',
          },
          aiAgents: {
            summary: 'An AI intake agent structures requests and flags partner relationships implications before they reach your queue.',
            detail: 'Requests arrive pre-categorized with partner relationships signals highlighted. You validate and prioritize rather than manually parsing raw inputs.',
          },
          aiAgentic: {
            summary: 'Autonomous intake agents triage, validate, and route requests with partner relationships logic — you govern exceptions.',
            detail: 'Agentic intake handles end-to-end request processing with your partner relationships rules embedded. You set policies and review escalations while routine requests flow automatically.',
          },
        },
        'research-insights': {
          preAI: {
            summary: 'You gather audience and market research manually, compiling data from multiple sources for partner relationships.',
            detail: 'Research is scattered across tools, reports, and tribal knowledge. Building a complete picture for partner relationships takes days and the data is often stale by the time you use it.',
          },
          aiAgents: {
            summary: 'AI research tools surface audience and market data relevant to your partner relationships needs automatically.',
            detail: 'Research agents pull relevant data from multiple sources and present partner relationships insights in a structured format. You curate and interpret rather than gather.',
          },
          aiAgentic: {
            summary: 'Autonomous research agents continuously update partner relationships intelligence — you set the strategic lens.',
            detail: 'Research agents proactively surface partner relationships insights from market signals, audience data, and competitive movements. You shape research priorities, not execute searches.',
          },
        },
        'write-brief': {
          preAI: {
            summary: 'You wait for briefs written by hand, often lacking the partner relationships detail you need.',
            detail: 'Briefs arrive incomplete or misaligned with your partner relationships requirements. You spend cycles requesting revisions and clarifying expectations before work can proceed.',
          },
          aiAgents: {
            summary: 'AI drafts briefs with partner relationships requirements pre-populated from templates and past projects.',
            detail: 'Brief generation agents pull your partner relationships requirements into structured templates. You review and refine rather than starting from a blank page.',
          },
          aiAgentic: {
            summary: 'Autonomous agents generate complete briefs with partner relationships alignment built in — you approve strategy.',
            detail: 'Brief agents produce publication-ready briefs that embed your partner relationships requirements from historical patterns. You govern strategic direction rather than reviewing drafts.',
          },
        },
        'draft-content': {
          preAI: {
            summary: 'You review drafts created entirely by hand, checking each one for alignment with partner relationships.',
            detail: 'First drafts vary wildly in quality and partner relationships alignment. You often send content back for multiple revision cycles, creating bottlenecks in the pipeline.',
          },
          aiAgents: {
            summary: 'AI generates first drafts with partner relationships guidelines embedded, reducing your revision cycles.',
            detail: 'Drafting agents produce content aligned with your partner relationships standards from the start. You focus on strategic refinement rather than basic corrections.',
          },
          aiAgentic: {
            summary: 'Autonomous drafting agents produce content meeting partner relationships standards — you set creative direction.',
            detail: 'Drafting agents generate content that passes your partner relationships criteria automatically. You focus on strategic vision and creative differentiation rather than quality control.',
          },
        },
        'seo-optimization': {
          preAI: {
            summary: 'SEO optimization is manual and disconnected from your partner relationships priorities.',
            detail: 'Keyword research and meta optimization happen separately from your partner relationships workflow. You rarely see SEO data until after content is already in review.',
          },
          aiAgents: {
            summary: 'AI SEO tools optimize content while preserving your partner relationships priorities.',
            detail: 'SEO agents suggest keywords and meta improvements that align with your partner relationships goals. You approve optimizations rather than manually researching keywords.',
          },
          aiAgentic: {
            summary: 'Autonomous SEO agents optimize continuously within partner relationships boundaries — you define the strategy.',
            detail: 'SEO agents self-optimize content based on real-time search signals and your partner relationships guardrails. You set strategic keywords and constraints, not individual page optimizations.',
          },
        },
        'brand-compliance': {
          preAI: {
            summary: 'Brand checks are subjective and slow, creating delays in your partner relationships workflow.',
            detail: 'Brand reviewers interpret guidelines differently. Inconsistent enforcement of tone, terminology, and messaging means partner relationships is harder to maintain at scale.',
          },
          aiAgents: {
            summary: 'AI brand checkers flag violations and score partner relationships alignment before human review.',
            detail: 'Brand agents scan content against guidelines and highlight partner relationships issues. You make judgment calls on edge cases rather than catching basic violations.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents enforce compliance at scale with partner relationships rules — you update the rulebook.',
            detail: 'Brand agents apply and evolve compliance checks across all content automatically. Your partner relationships standards are codified as machine-enforceable rules that you govern and refine.',
          },
        },
        'final-edit': {
          preAI: {
            summary: 'Final edits depend entirely on editor availability, blocking your partner relationships timelines.',
            detail: 'A single editor bottleneck means content waits in queue. Your partner relationships deadlines slip because there is no way to parallelize the final polish step.',
          },
          aiAgents: {
            summary: 'AI editing assistants handle mechanical fixes, freeing your partner relationships focus for strategic polish.',
            detail: 'Editing agents catch grammar, style, and consistency issues automatically. Your partner relationships perspective is reserved for nuance and narrative quality.',
          },
          aiAgentic: {
            summary: 'Autonomous editing agents polish content to publication standard — your partner relationships bar is encoded as policy.',
            detail: 'Editing agents handle all mechanical and stylistic refinement autonomously. Your partner relationships standards are embedded as editorial policies that improve with each iteration.',
          },
        },
        'schedule-publish': {
          preAI: {
            summary: 'Publishing is a manual CMS process with no connection to your partner relationships planning.',
            detail: 'Each piece requires manual scheduling, metadata entry, and CMS configuration. Your partner relationships goals are disconnected from the publish timeline.',
          },
          aiAgents: {
            summary: 'AI scheduling agents suggest optimal publish timing based on partner relationships data.',
            detail: 'Publishing agents recommend times and configurations informed by your partner relationships priorities. You approve the schedule rather than manually configuring CMS settings.',
          },
          aiAgentic: {
            summary: 'Autonomous publishing agents manage scheduling end-to-end using partner relationships optimization logic.',
            detail: 'Publishing agents handle CMS configuration, timing optimization, and deployment autonomously within your partner relationships constraints. You set publishing policies, not individual schedules.',
          },
        },
        'distribute': {
          preAI: {
            summary: 'Content distribution is manual channel-by-channel, with limited visibility into partner relationships.',
            detail: 'Each channel requires separate formatting, scheduling, and posting. There is no unified view of how distribution supports your partner relationships objectives.',
          },
          aiAgents: {
            summary: 'AI distribution agents adapt content per channel with partner relationships rules built in.',
            detail: 'Distribution agents format and deploy content across channels following your partner relationships guidelines. You monitor and adjust rather than manually posting to each platform.',
          },
          aiAgentic: {
            summary: 'Autonomous distribution agents manage all channels with partner relationships rules — you govern the playbook.',
            detail: 'Distribution agents deploy, adapt, and optimize content across every channel following your partner relationships playbook. You evolve distribution strategy, not execute individual channel posts.',
          },
        },
        'track-performance': {
          preAI: {
            summary: 'Performance tracking is fragmented across tools, making partner relationships assessment difficult.',
            detail: 'You pull data from analytics dashboards, social platforms, and CRM separately. Building a complete picture for partner relationships requires manual data stitching.',
          },
          aiAgents: {
            summary: 'AI dashboards surface partner relationships metrics in real time without manual data pulling.',
            detail: 'Performance agents aggregate data and highlight the partner relationships signals that matter to you. You analyze trends rather than building dashboards from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous tracking agents monitor partner relationships metrics continuously and trigger alerts and actions.',
            detail: 'Performance agents stream partner relationships data and automatically trigger optimization workflows when thresholds are breached. You define KPIs and review strategic implications.',
          },
        },
        'generate-report': {
          preAI: {
            summary: 'Reports are built manually in spreadsheets, often missing the partner relationships metrics you need.',
            detail: 'Report creation takes hours of data gathering and formatting. The metrics that matter for partner relationships are often buried or missing entirely from standard templates.',
          },
          aiAgents: {
            summary: 'AI generates reports with partner relationships metrics pre-formatted and insights highlighted.',
            detail: 'Reporting agents compile your partner relationships data into structured templates with automated analysis. You add strategic narrative rather than wrangling data.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce partner relationships reports on demand with strategic recommendations.',
            detail: 'Reporting agents generate partner relationships analyses with actionable recommendations automatically. You consume insights and set strategic direction rather than producing reports.',
          },
        },
        'optimize': {
          preAI: {
            summary: 'Content optimization is reactive and slow, with limited connection to partner relationships data.',
            detail: 'Optimization decisions rely on gut feel and delayed data. Your partner relationships insights rarely feed back into content updates in a timely way.',
          },
          aiAgents: {
            summary: 'AI recommends optimizations based on partner relationships signals and historical performance.',
            detail: 'Optimization agents suggest specific changes tied to your partner relationships metrics. You approve and prioritize recommendations rather than diagnosing issues manually.',
          },
          aiAgentic: {
            summary: 'Autonomous optimization agents improve content continuously using partner relationships signals — you set boundaries.',
            detail: 'Optimization agents test, iterate, and improve content based on partner relationships data within your guardrails. You define acceptable ranges and review significant changes.',
          },
        },
        'brief-approval': {
          preAI: {
            summary: 'Brief approvals are bottlenecked by manual review cycles that delay your partner relationships work.',
            detail: 'You wait for briefs to pass through approval chains before your partner relationships tasks can begin. Unclear approval criteria mean briefs bounce back and forth repeatedly.',
          },
          aiAgents: {
            summary: 'AI pre-screens briefs for partner relationships alignment, routing only exceptions to you.',
            detail: 'Approval agents check briefs against your partner relationships criteria and flag gaps. You review flagged items rather than reading every brief end to end.',
          },
          aiAgentic: {
            summary: 'Autonomous approval agents clear standard briefs and escalate only partner relationships exceptions to you.',
            detail: 'Approval agents validate briefs against your partner relationships criteria and auto-approve routine requests. You handle strategic exceptions and edge cases only.',
          },
        },
        'quality-check': {
          preAI: {
            summary: 'Quality checks are inconsistent manual reviews with no standard partner relationships criteria.',
            detail: 'Quality varies by reviewer and day. There is no automated baseline for readability, accuracy, or partner relationships alignment, leading to uneven content standards.',
          },
          aiAgents: {
            summary: 'AI quality gates enforce baseline standards, letting you focus on partner relationships nuance.',
            detail: 'Quality agents score readability, accuracy, and SEO automatically. Your partner relationships evaluation focuses on strategic alignment rather than mechanical checks.',
          },
          aiAgentic: {
            summary: 'Autonomous quality agents enforce standards continuously — partner relationships baselines are self-maintaining.',
            detail: 'Quality agents apply and evolve quality standards based on your partner relationships benchmarks. You set quality policies that the system enforces and improves over time.',
          },
        },
        'stakeholder-signoff': {
          preAI: {
            summary: 'Stakeholder sign-off is a bottleneck where executives delay your partner relationships timelines.',
            detail: 'Senior approvers are busy and unresponsive. Your partner relationships work stalls while waiting for sign-off, and last-minute changes create downstream chaos.',
          },
          aiAgents: {
            summary: 'AI prepares sign-off packages with partner relationships summaries for faster executive approval.',
            detail: 'Sign-off agents compile context, changes, and partner relationships impact assessments for approvers. Executives review structured summaries rather than raw content.',
          },
          aiAgentic: {
            summary: 'Autonomous agents handle routine sign-offs within partner relationships parameters — executives approve strategy only.',
            detail: 'Sign-off agents clear content that meets all partner relationships criteria automatically. Executives only review strategic pivots or high-risk content that breaches defined thresholds.',
          },
        },
        'performance-review': {
          preAI: {
            summary: 'Performance reviews are infrequent manual assessments that underserve your partner relationships needs.',
            detail: 'Reviews happen quarterly at best, using outdated data. Your partner relationships perspective is often missing from the evaluation criteria entirely.',
          },
          aiAgents: {
            summary: 'AI evaluates content against KPIs and highlights partner relationships trends for your review.',
            detail: 'Review agents surface performance data with partner relationships context pre-attached. You make optimize/archive decisions based on structured analysis rather than raw metrics.',
          },
          aiAgentic: {
            summary: 'Autonomous review agents evaluate and act on performance with partner relationships logic — you set the framework.',
            detail: 'Review agents continuously assess content against your partner relationships KPIs and trigger optimize/refresh/archive workflows automatically. You define the evaluation framework.',
          },
        },
        'social-listening': {
          preAI: {
            summary: 'Social listening is ad hoc keyword monitoring with no systematic link to partner relationships.',
            detail: 'You check social platforms manually for relevant conversations. Insights rarely reach your partner relationships workflow before they become stale or irrelevant.',
          },
          aiAgents: {
            summary: 'AI monitoring tools surface trending topics and sentiment relevant to partner relationships in real time.',
            detail: 'Listening agents track conversations and flag partner relationships signals across platforms. You act on curated insights rather than monitoring feeds manually.',
          },
          aiAgentic: {
            summary: 'Autonomous listening agents track and respond to partner relationships signals across all platforms in real time.',
            detail: 'Listening agents monitor social channels and proactively surface partner relationships opportunities and risks. You set monitoring priorities and review strategic findings.',
          },
        },
        'visual-asset-creation': {
          preAI: {
            summary: 'Visual asset creation is a slow design queue disconnected from your partner relationships needs.',
            detail: 'Design requests go into a backlog with unclear priorities. Your partner relationships requirements are often lost in translation between brief and final asset.',
          },
          aiAgents: {
            summary: 'AI design tools generate asset options aligned with partner relationships requirements.',
            detail: 'Design agents produce visual variants following your partner relationships guidelines. You select and refine from AI-generated options rather than directing from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous design agents produce visual assets within partner relationships guidelines — you set creative direction.',
            detail: 'Design agents generate publication-ready visuals following your partner relationships standards. You define the creative vision and approve hero assets while routine visuals ship autonomously.',
          },
        },
        'legal-review': {
          preAI: {
            summary: 'Legal review is an opaque process that creates unpredictable delays in your partner relationships work.',
            detail: 'Legal feedback arrives late with minimal context. You cannot predict how long review will take, making partner relationships planning unreliable.',
          },
          aiAgents: {
            summary: 'AI legal screening flags compliance risks early, reducing partner relationships surprises downstream.',
            detail: 'Legal agents pre-scan content for regulatory issues and partner relationships risks. You get early warnings rather than discovering problems at the sign-off stage.',
          },
          aiAgentic: {
            summary: 'Autonomous legal agents clear routine content and escalate only true partner relationships risks to human counsel.',
            detail: 'Legal agents scan and clear standard content autonomously using your partner relationships rule framework. Human lawyers handle novel risk scenarios and precedent-setting decisions only.',
          },
        },
        'accessibility-check': {
          preAI: {
            summary: 'Accessibility checking is a manual afterthought, rarely connected to your partner relationships process.',
            detail: 'WCAG compliance and inclusive language reviews happen late in the pipeline. Your partner relationships work is already done when accessibility issues force rework.',
          },
          aiAgents: {
            summary: 'AI accessibility tools catch WCAG violations automatically, protecting your partner relationships standards.',
            detail: 'Accessibility agents scan for inclusive language and alt-text compliance. Your partner relationships requirements benefit from automated baseline checks before human review.',
          },
          aiAgentic: {
            summary: 'Autonomous accessibility agents enforce WCAG and inclusive standards — partner relationships is guaranteed by default.',
            detail: 'Accessibility agents ensure all content meets compliance standards before publication. Your partner relationships benefits from guaranteed accessibility without manual checking overhead.',
          },
        },
        'localize-content': {
          preAI: {
            summary: 'Localization is a slow, manual translation process that delays your partner relationships for global markets.',
            detail: 'Each market requires separate translation, cultural review, and compliance checking. Your partner relationships suffers because localized versions lag weeks behind the original.',
          },
          aiAgents: {
            summary: 'AI translation agents accelerate localization while respecting partner relationships requirements.',
            detail: 'Localization agents produce initial translations with partner relationships context preserved. You review for cultural nuance rather than translating from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous localization agents adapt content for all markets simultaneously — your partner relationships scales globally.',
            detail: 'Localization agents handle translation, cultural adaptation, and regional compliance autonomously. Your partner relationships is maintained across markets without manual per-locale effort.',
          },
        },
        'ab-variant-creation': {
          preAI: {
            summary: 'A/B variants are created manually with limited connection to your partner relationships hypotheses.',
            detail: 'Test variants rely on guesswork rather than data. Your partner relationships insights rarely inform variant design, reducing the value of testing efforts.',
          },
          aiAgents: {
            summary: 'AI generates test variants informed by partner relationships data and historical performance.',
            detail: 'Variant agents create headlines, CTAs, and imagery options based on your partner relationships hypotheses. You select winning approaches rather than brainstorming from zero.',
          },
          aiAgentic: {
            summary: 'Autonomous variant agents design, deploy, and learn from tests using partner relationships hypotheses — you set the agenda.',
            detail: 'Variant agents run continuous testing experiments informed by your partner relationships objectives. You define what to test and review strategic learnings while the system iterates autonomously.',
          },
        },
        'content-repurposing': {
          preAI: {
            summary: 'Content repurposing is manual reformatting, disconnected from your partner relationships goals.',
            detail: 'Each derivative asset is created from scratch. Your partner relationships requirements are not systematically applied when repurposing content across formats.',
          },
          aiAgents: {
            summary: 'AI repurposing agents derive secondary assets with partner relationships consistency built in.',
            detail: 'Repurposing agents transform primary content into channel-specific formats following your partner relationships guidelines. You approve derivatives rather than recreating each manually.',
          },
          aiAgentic: {
            summary: 'Autonomous repurposing agents derive all secondary assets automatically within partner relationships guidelines.',
            detail: 'Repurposing agents transform primary content into every derivative format following your partner relationships rules. You set format strategy while the system handles production at scale.',
          },
        },
        'archive-tag': {
          preAI: {
            summary: 'Content archiving is inconsistent, making partner relationships-related retrieval nearly impossible.',
            detail: 'Tagging and taxonomy are applied inconsistently or not at all. Finding past content relevant to partner relationships requires searching through unstructured repositories.',
          },
          aiAgents: {
            summary: 'AI tagging agents classify content automatically, making partner relationships retrieval faster.',
            detail: 'Archive agents apply taxonomy and metadata based on your partner relationships categories. You validate classifications rather than manually tagging every asset.',
          },
          aiAgentic: {
            summary: 'Autonomous archive agents maintain perfect taxonomy — partner relationships retrieval is instant and reliable.',
            detail: 'Archive agents classify, tag, and organize all content using your partner relationships taxonomy automatically. You evolve the taxonomy structure while the system maintains it flawlessly.',
          },
        },
        'legal-compliance-gate': {
          preAI: {
            summary: 'Legal compliance gates create unpredictable holds that delay your partner relationships deadlines.',
            detail: 'Legal sign-off timing is opaque and variable. Your partner relationships timelines are at the mercy of legal review queues with no visibility into status.',
          },
          aiAgents: {
            summary: 'AI pre-screening reduces legal gate delays by resolving routine partner relationships checks automatically.',
            detail: 'Compliance agents handle standard checks and only escalate partner relationships edge cases to human lawyers. Your timelines are more predictable because routine items clear faster.',
          },
          aiAgentic: {
            summary: 'Autonomous compliance gates clear routine content instantly — only novel partner relationships risks reach human lawyers.',
            detail: 'Compliance agents handle standard legal checks autonomously using your partner relationships risk framework. Human review is reserved for unprecedented scenarios and policy updates.',
          },
        },
        'localization-quality-gate': {
          preAI: {
            summary: 'Localization quality gates are inconsistent, creating partner relationships risks in global markets.',
            detail: 'Quality checks for localized content vary by market and reviewer. Your partner relationships standards are unevenly applied across regions and languages.',
          },
          aiAgents: {
            summary: 'AI quality checks catch translation errors before they affect your partner relationships outcomes.',
            detail: 'Localization QA agents verify accuracy and cultural fit automatically. Your partner relationships standards are applied consistently across all target markets.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents ensure localization quality across all markets — partner relationships is guaranteed globally.',
            detail: 'Localization QA agents validate every market adaptation autonomously against your partner relationships standards. You set quality criteria while the system enforces them at scale.',
          },
        },
        'segment-mapping': {
          preAI: {
            summary: 'Segment mapping is manual spreadsheet work with limited visibility into partner relationships impact.',
            detail: 'Mapping content variants to audience segments is done in spreadsheets. Your partner relationships data is disconnected from the personalization logic.',
          },
          aiAgents: {
            summary: 'AI agents map variants to segments using partner relationships data from the CDP.',
            detail: 'Segment agents recommend variant-audience matches based on your partner relationships signals. You review the mapping rather than building it manually in spreadsheets.',
          },
          aiAgentic: {
            summary: 'Autonomous segment agents map and optimize variant-audience matches using live partner relationships signals.',
            detail: 'Segment agents continuously refine variant-audience mappings based on real-time partner relationships data. You define segmentation strategy while the system executes and optimizes automatically.',
          },
        },
        'dynamic-assembly': {
          preAI: {
            summary: 'Dynamic content assembly is rigid and template-bound, limiting your partner relationships options.',
            detail: 'Personalized experiences require engineering support for each variant. Your partner relationships vision is constrained by inflexible assembly templates.',
          },
          aiAgents: {
            summary: 'AI assembly agents construct personalized experiences informed by partner relationships rules.',
            detail: 'Assembly agents combine content components per segment following your partner relationships logic. You define rules and review outputs rather than manually configuring each variant.',
          },
          aiAgentic: {
            summary: 'Autonomous assembly agents construct personalized experiences in real time — partner relationships logic is self-optimizing.',
            detail: 'Assembly agents build dynamic experiences per segment using your partner relationships rules and real-time behavioral signals. You govern personalization policies, not individual assembly configurations.',
          },
        },
        'personalization-qa': {
          preAI: {
            summary: 'Personalization QA is manual spot-checking that misses partner relationships gaps.',
            detail: 'Testing every segment-variant combination is impossible manually. Your partner relationships concerns are only caught when users report issues post-launch.',
          },
          aiAgents: {
            summary: 'AI QA agents validate personalization coverage and flag partner relationships gaps before launch.',
            detail: 'QA agents test every segment-variant combination against your partner relationships requirements. You review exception reports rather than manually spot-checking combinations.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents validate every personalization scenario — partner relationships gaps are caught before launch.',
            detail: 'Personalization QA agents test all segment-variant combinations against your partner relationships requirements automatically. You set acceptance criteria while the system validates at scale.',
          },
        },
        'campaign-planning': {
          preAI: {
            summary: 'Campaign planning is a manual coordination effort with fragmented partner relationships inputs.',
            detail: 'Campaign plans are built in decks and spreadsheets with incomplete data. Your partner relationships perspective is often incorporated too late in the planning cycle.',
          },
          aiAgents: {
            summary: 'AI planning agents draft campaign frameworks with partner relationships data pre-integrated.',
            detail: 'Planning agents pull audience, budget, and performance data into campaign templates. Your partner relationships priorities shape the plan from the start rather than being retrofitted.',
          },
          aiAgentic: {
            summary: 'Autonomous planning agents generate campaign frameworks using partner relationships intelligence — you set objectives.',
            detail: 'Planning agents produce data-driven campaign plans with your partner relationships priorities embedded. You define strategic goals while the system optimizes tactics and resource allocation.',
          },
        },
        'consent-check': {
          preAI: {
            summary: 'Consent checking is a manual compliance step that adds friction to your partner relationships process.',
            detail: 'Verifying GDPR/CCPA consent for targeting requires manual cross-referencing. Your partner relationships work is delayed while compliance status is manually confirmed.',
          },
          aiAgents: {
            summary: 'AI consent agents verify targeting compliance automatically, reducing partner relationships friction.',
            detail: 'Consent agents cross-reference CDP signals against GDPR/CCPA rules for your partner relationships needs. You handle exceptions rather than manually verifying every segment.',
          },
          aiAgentic: {
            summary: 'Autonomous consent agents enforce privacy compliance at scale — partner relationships is guaranteed by architecture.',
            detail: 'Consent agents verify targeting compliance in real time across all segments using your partner relationships framework. You set privacy policies while the system enforces them automatically.',
          },
        },
        'paid-creative-production': {
          preAI: {
            summary: 'Paid creative production runs separately from organic, fragmenting your partner relationships oversight.',
            detail: 'Ad creative and organic content are produced in silos. Your partner relationships perspective is applied inconsistently between paid and organic channels.',
          },
          aiAgents: {
            summary: 'AI production agents generate paid variants from organic content with partner relationships consistency.',
            detail: 'Paid creative agents adapt organic content for ad platforms following your partner relationships guidelines. You approve and fine-tune rather than producing ad creative from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous production agents create paid variants at scale within partner relationships guardrails — you set the strategy.',
            detail: 'Paid creative agents generate ad variants from organic content following your partner relationships guidelines. You define creative strategy while the system produces and optimizes at scale.',
          },
        },
        'attribution-modeling': {
          preAI: {
            summary: 'Attribution modeling is manual and unreliable, undermining your partner relationships reporting.',
            detail: 'Last-click attribution dominates despite its flaws. Your partner relationships decisions lack the multi-touch perspective needed for accurate performance assessment.',
          },
          aiAgents: {
            summary: 'AI attribution models surface multi-touch insights relevant to your partner relationships priorities.',
            detail: 'Attribution agents calculate content ROI across channels using your partner relationships weightings. You interpret strategic implications rather than building models manually.',
          },
          aiAgentic: {
            summary: 'Autonomous attribution agents run multi-touch models continuously — partner relationships insights update in real time.',
            detail: 'Attribution agents calculate content ROI across all channels using your partner relationships framework. You interpret strategic implications while the system handles modeling complexity.',
          },
        },
        'executive-reporting': {
          preAI: {
            summary: 'Executive reports are manually assembled, often missing the partner relationships narrative you need.',
            detail: 'Building executive dashboards takes hours of data wrangling. The partner relationships story you want to tell is lost in generic reporting templates.',
          },
          aiAgents: {
            summary: 'AI builds executive dashboards with partner relationships narratives pre-drafted for leadership.',
            detail: 'Reporting agents synthesize data into executive formats with your partner relationships story embedded. You refine the narrative rather than assembling data from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce executive dashboards with partner relationships narratives — you add strategic context.',
            detail: 'Executive reporting agents synthesize all data into leadership-ready formats with your partner relationships story embedded. You provide strategic commentary on auto-generated insights.',
          },
        },
        'competitive-response': {
          preAI: {
            summary: 'Competitive response is slow and reactive, giving you no partner relationships advantage.',
            detail: 'By the time you spot a competitor move and respond, the moment has passed. Your partner relationships approach cannot adapt fast enough to real-time competitive signals.',
          },
          aiAgents: {
            summary: 'AI competitive agents surface signals and draft responses aligned with partner relationships strategy.',
            detail: 'Competitive agents monitor market moves and suggest partner relationships-aligned responses. You approve and refine reactive content rather than spotting threats manually.',
          },
          aiAgentic: {
            summary: 'Autonomous competitive agents detect and draft responses in real time — partner relationships moves are countered instantly.',
            detail: 'Competitive agents monitor signals, draft responses, and deploy within your partner relationships guardrails. You approve high-stakes responses while routine reactions ship autonomously.',
          },
        },
        'content-governance': {
          preAI: {
            summary: 'Content governance is periodic manual auditing that cannot keep pace with your partner relationships standards.',
            detail: 'Live content drifts out of compliance between infrequent reviews. Your partner relationships requirements are only enforced when someone manually checks.',
          },
          aiAgents: {
            summary: 'AI governance agents continuously audit live content against partner relationships standards.',
            detail: 'Governance agents flag content drift, compliance gaps, and partner relationships issues in real time. You review flagged items rather than conducting manual audits.',
          },
          aiAgentic: {
            summary: 'Autonomous governance agents audit all live content continuously — partner relationships compliance is always current.',
            detail: 'Governance agents monitor every published piece against your partner relationships standards in real time. You evolve governance policies while the system enforces them perpetually.',
          },
        },
        'governance-gate': {
          preAI: {
            summary: 'Governance gates are calendar-driven checkpoints disconnected from your partner relationships rhythm.',
            detail: 'Governance reviews happen on a fixed schedule regardless of content velocity. Your partner relationships concerns may not surface until the next quarterly review.',
          },
          aiAgents: {
            summary: 'AI governance gates run continuous checks, surfacing partner relationships issues between formal reviews.',
            detail: 'Governance agents validate live content against your partner relationships criteria on an ongoing basis. You act on exception alerts rather than waiting for quarterly reviews.',
          },
          aiAgentic: {
            summary: 'Autonomous governance gates run continuously — partner relationships violations trigger immediate remediation.',
            detail: 'Governance agents validate live content against your partner relationships criteria continuously and auto-trigger refresh or retirement workflows. You set policies, not review schedules.',
          },
        },
        'journey-mapping': {
          preAI: {
            summary: 'Journey mapping is a manual exercise that rarely reflects your partner relationships reality.',
            detail: 'Customer journey maps are created in workshops and quickly go stale. Your partner relationships perspective is a snapshot, not a living view of how content performs at each stage.',
          },
          aiAgents: {
            summary: 'AI journey agents map content to lifecycle stages using partner relationships data from the CDP.',
            detail: 'Journey agents dynamically map content to customer stages based on your partner relationships framework. You validate the mapping rather than building it manually in workshops.',
          },
          aiAgentic: {
            summary: 'Autonomous journey agents maintain living maps using real-time partner relationships data — you shape the strategy.',
            detail: 'Journey agents dynamically map content to lifecycle stages using live partner relationships signals. You define journey frameworks while the system optimizes content placement continuously.',
          },
        },
        'sentiment-monitoring': {
          preAI: {
            summary: 'Sentiment monitoring is sporadic manual checking with no systematic link to partner relationships.',
            detail: 'You check brand sentiment reactively rather than proactively. Your partner relationships decisions are made without real-time audience feedback signals.',
          },
          aiAgents: {
            summary: 'AI sentiment agents track brand reception in real time, alerting you to partner relationships risks.',
            detail: 'Sentiment agents analyze audience reactions and flag partner relationships concerns before they escalate. You respond to alerts rather than manually checking platforms.',
          },
          aiAgentic: {
            summary: 'Autonomous sentiment agents monitor and respond to partner relationships signals around the clock — you govern escalation.',
            detail: 'Sentiment agents track audience reactions and trigger partner relationships responses automatically. You set escalation thresholds and review strategic implications of sentiment shifts.',
          },
        },
        'sales-enablement': {
          preAI: {
            summary: 'Sales enablement content is created ad hoc, disconnected from your partner relationships strategy.',
            detail: 'Sales teams request materials outside the content pipeline. Your partner relationships standards are not applied to battle cards, decks, and one-pagers created in isolation.',
          },
          aiAgents: {
            summary: 'AI agents generate sales materials from marketing content with partner relationships alignment.',
            detail: 'Sales enablement agents transform marketing assets into battle cards and decks following your partner relationships standards. You approve rather than creating each piece manually.',
          },
          aiAgentic: {
            summary: 'Autonomous enablement agents keep sales materials current with partner relationships alignment — you set the playbook.',
            detail: 'Enablement agents automatically update battle cards, decks, and case studies as your partner relationships data evolves. You define the sales narrative while the system produces materials at scale.',
          },
        },
        'content-scoring': {
          preAI: {
            summary: 'Content scoring is subjective prioritization that underweights your partner relationships criteria.',
            detail: 'Requests are prioritized by loudest voice or executive fiat. Your partner relationships scoring criteria are rarely part of the formal prioritization framework.',
          },
          aiAgents: {
            summary: 'AI scoring agents rank requests using partner relationships criteria alongside strategic priority.',
            detail: 'Scoring agents weight your partner relationships factors into the prioritization algorithm. You adjust rankings rather than scoring each request manually.',
          },
          aiAgentic: {
            summary: 'Autonomous scoring agents prioritize the pipeline using partner relationships criteria — you set strategic weights.',
            detail: 'Scoring agents rank and route content requests using your partner relationships priorities in real time. You define scoring criteria and review the queue rather than manually triaging.',
          },
        },
        'channel-orchestration': {
          preAI: {
            summary: 'Channel orchestration is manual coordination with no systematic partner relationships integration.',
            detail: 'Cross-channel timing is managed in spreadsheets and Slack. Your partner relationships requirements for sequencing and coordination are often overridden by ad hoc changes.',
          },
          aiAgents: {
            summary: 'AI orchestration agents sequence distribution with partner relationships rules for timing and cadence.',
            detail: 'Orchestration agents coordinate cross-channel timing based on your partner relationships requirements. You set rules and review the sequence rather than managing each channel individually.',
          },
          aiAgentic: {
            summary: 'Autonomous orchestration agents manage all channel timing with partner relationships logic — you set the playbook.',
            detail: 'Orchestration agents handle cross-channel sequencing, timing, and coordination autonomously using your partner relationships rules. You evolve the orchestration strategy while the system executes.',
          },
        },
      },
      keyInsight: 'Relationship judgment — knowing which creators strengthen the brand over time — is the part of this role that doesn\'t scale through automation.',
    },
  },
  {
    id: 'context-engineer',
    title: 'Context Engineer',
    description: 'Owns the semantic infrastructure that grounds every agent in the system: knowledge graphs, content taxonomy, scoring matrices, orchestration rules, and the relationships between reference inputs. Responsible for making the system smarter over time.',
    tagline: 'Builds the infrastructure agents reason with.',
    iconName: 'Blocks',
    category: 'growth',
    accentColor: '#5BBD5F',
    ownedSteps: ['content-governance', 'archive-tag'],
    reviewedGates: ['governance-gate'],
    relatedAgents: ['research-agent', 'personalization-agent', 'legal-screening-agent'],
    relatedInputs: ['content-taxonomy', 'scoring-matrix', 'orchestration-rules', 'personalization-rules', 'approval-matrix'],
    narrative: {
      nodeJourneys: {
        'content-governance': {
          preAI: {
            summary: 'Governance rules are tribal knowledge — scattered across docs, email threads, and institutional memory.',
            detail: 'When someone leaves, the organization loses operational context. Governance consistency depends on who happens to be in the room.',
          },
          aiAgents: {
            summary: 'You formalize governance rules into structured inputs that agents can reason with consistently.',
            detail: 'Every good governance decision now traces back to your infrastructure. The difference between consistent and inconsistent enforcement is the context you provide.',
          },
          aiAgentic: {
            summary: 'Your governance framework runs the system — every content decision references your structured rules.',
            detail: 'When governance drifts, you diagnose whether the problem is the agent or its context. One rule update can improve thousands of downstream decisions.',
          },
        },
        'archive-tag': {
          preAI: {
            summary: 'Content archival and tagging are afterthoughts — assets disappear into folders nobody searches.',
            detail: 'Taxonomy is inconsistent because tagging standards are applied retroactively by whoever has time. Content reuse suffers because nothing is findable.',
          },
          aiAgents: {
            summary: 'An agent tags and archives content using your taxonomy framework — consistency improves because agents don\'t skip the tagging step.',
            detail: 'Every piece is tagged at creation using your taxonomy. The content library becomes searchable and reusable for the first time.',
          },
          aiAgentic: {
            summary: 'Archival and tagging happen automatically as content moves through the pipeline — your taxonomy is the organizing principle.',
            detail: 'Content is classified, tagged, and archived continuously. You maintain the taxonomy that makes the entire content library a strategic asset.',
          },
        },
        'governance-gate': {
          preAI: {
            summary: 'This role doesn\'t exist yet in most organizations. Governance gates are staffed by whoever is available.',
            detail: 'Taxonomy, scoring rules, and workflow logic are tribal knowledge. Gate decisions depend on who happens to be reviewing.',
          },
          aiAgents: {
            summary: 'You staff the governance gate with structured rules, replacing ad hoc judgment with codified standards.',
            detail: 'The gate evaluates content against your framework. Consistent governance becomes possible because the rules are explicit and machine-readable.',
          },
          aiAgentic: {
            summary: 'The governance gate self-operates on your framework — you maintain the reasoning layer every agent depends on.',
            detail: 'Every improvement you make silently improves every agent and every gate. This is the compounding asset — context infrastructure that gets better over time.',
          },
        },
        'receive-request': {
          preAI: {
            summary: 'You structure incoming requests manually, sorting through emails and Slack messages for knowledge structure.',
            detail: 'Requests arrive in inconsistent formats with no standard intake process. You spend hours triaging and clarifying scope before knowledge structure can even begin.',
          },
          aiAgents: {
            summary: 'An AI intake agent structures requests and flags knowledge structure implications before they reach your queue.',
            detail: 'Requests arrive pre-categorized with knowledge structure signals highlighted. You validate and prioritize rather than manually parsing raw inputs.',
          },
          aiAgentic: {
            summary: 'Autonomous intake agents triage, validate, and route requests with knowledge structure logic — you govern exceptions.',
            detail: 'Agentic intake handles end-to-end request processing with your knowledge structure rules embedded. You set policies and review escalations while routine requests flow automatically.',
          },
        },
        'research-insights': {
          preAI: {
            summary: 'You gather audience and market research manually, compiling data from multiple sources for knowledge structure.',
            detail: 'Research is scattered across tools, reports, and tribal knowledge. Building a complete picture for knowledge structure takes days and the data is often stale by the time you use it.',
          },
          aiAgents: {
            summary: 'AI research tools surface audience and market data relevant to your knowledge structure needs automatically.',
            detail: 'Research agents pull relevant data from multiple sources and present knowledge structure insights in a structured format. You curate and interpret rather than gather.',
          },
          aiAgentic: {
            summary: 'Autonomous research agents continuously update knowledge structure intelligence — you set the strategic lens.',
            detail: 'Research agents proactively surface knowledge structure insights from market signals, audience data, and competitive movements. You shape research priorities, not execute searches.',
          },
        },
        'write-brief': {
          preAI: {
            summary: 'You wait for briefs written by hand, often lacking the knowledge structure detail you need.',
            detail: 'Briefs arrive incomplete or misaligned with your knowledge structure requirements. You spend cycles requesting revisions and clarifying expectations before work can proceed.',
          },
          aiAgents: {
            summary: 'AI drafts briefs with knowledge structure requirements pre-populated from templates and past projects.',
            detail: 'Brief generation agents pull your knowledge structure requirements into structured templates. You review and refine rather than starting from a blank page.',
          },
          aiAgentic: {
            summary: 'Autonomous agents generate complete briefs with knowledge structure alignment built in — you approve strategy.',
            detail: 'Brief agents produce publication-ready briefs that embed your knowledge structure requirements from historical patterns. You govern strategic direction rather than reviewing drafts.',
          },
        },
        'draft-content': {
          preAI: {
            summary: 'You review drafts created entirely by hand, checking each one for alignment with knowledge structure.',
            detail: 'First drafts vary wildly in quality and knowledge structure alignment. You often send content back for multiple revision cycles, creating bottlenecks in the pipeline.',
          },
          aiAgents: {
            summary: 'AI generates first drafts with knowledge structure guidelines embedded, reducing your revision cycles.',
            detail: 'Drafting agents produce content aligned with your knowledge structure standards from the start. You focus on strategic refinement rather than basic corrections.',
          },
          aiAgentic: {
            summary: 'Autonomous drafting agents produce content meeting knowledge structure standards — you set creative direction.',
            detail: 'Drafting agents generate content that passes your knowledge structure criteria automatically. You focus on strategic vision and creative differentiation rather than quality control.',
          },
        },
        'seo-optimization': {
          preAI: {
            summary: 'SEO optimization is manual and disconnected from your knowledge structure priorities.',
            detail: 'Keyword research and meta optimization happen separately from your knowledge structure workflow. You rarely see SEO data until after content is already in review.',
          },
          aiAgents: {
            summary: 'AI SEO tools optimize content while preserving your knowledge structure priorities.',
            detail: 'SEO agents suggest keywords and meta improvements that align with your knowledge structure goals. You approve optimizations rather than manually researching keywords.',
          },
          aiAgentic: {
            summary: 'Autonomous SEO agents optimize continuously within knowledge structure boundaries — you define the strategy.',
            detail: 'SEO agents self-optimize content based on real-time search signals and your knowledge structure guardrails. You set strategic keywords and constraints, not individual page optimizations.',
          },
        },
        'brand-compliance': {
          preAI: {
            summary: 'Brand checks are subjective and slow, creating delays in your knowledge structure workflow.',
            detail: 'Brand reviewers interpret guidelines differently. Inconsistent enforcement of tone, terminology, and messaging means knowledge structure is harder to maintain at scale.',
          },
          aiAgents: {
            summary: 'AI brand checkers flag violations and score knowledge structure alignment before human review.',
            detail: 'Brand agents scan content against guidelines and highlight knowledge structure issues. You make judgment calls on edge cases rather than catching basic violations.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents enforce compliance at scale with knowledge structure rules — you update the rulebook.',
            detail: 'Brand agents apply and evolve compliance checks across all content automatically. Your knowledge structure standards are codified as machine-enforceable rules that you govern and refine.',
          },
        },
        'final-edit': {
          preAI: {
            summary: 'Final edits depend entirely on editor availability, blocking your knowledge structure timelines.',
            detail: 'A single editor bottleneck means content waits in queue. Your knowledge structure deadlines slip because there is no way to parallelize the final polish step.',
          },
          aiAgents: {
            summary: 'AI editing assistants handle mechanical fixes, freeing your knowledge structure focus for strategic polish.',
            detail: 'Editing agents catch grammar, style, and consistency issues automatically. Your knowledge structure perspective is reserved for nuance and narrative quality.',
          },
          aiAgentic: {
            summary: 'Autonomous editing agents polish content to publication standard — your knowledge structure bar is encoded as policy.',
            detail: 'Editing agents handle all mechanical and stylistic refinement autonomously. Your knowledge structure standards are embedded as editorial policies that improve with each iteration.',
          },
        },
        'schedule-publish': {
          preAI: {
            summary: 'Publishing is a manual CMS process with no connection to your knowledge structure planning.',
            detail: 'Each piece requires manual scheduling, metadata entry, and CMS configuration. Your knowledge structure goals are disconnected from the publish timeline.',
          },
          aiAgents: {
            summary: 'AI scheduling agents suggest optimal publish timing based on knowledge structure data.',
            detail: 'Publishing agents recommend times and configurations informed by your knowledge structure priorities. You approve the schedule rather than manually configuring CMS settings.',
          },
          aiAgentic: {
            summary: 'Autonomous publishing agents manage scheduling end-to-end using knowledge structure optimization logic.',
            detail: 'Publishing agents handle CMS configuration, timing optimization, and deployment autonomously within your knowledge structure constraints. You set publishing policies, not individual schedules.',
          },
        },
        'distribute': {
          preAI: {
            summary: 'Content distribution is manual channel-by-channel, with limited visibility into knowledge structure.',
            detail: 'Each channel requires separate formatting, scheduling, and posting. There is no unified view of how distribution supports your knowledge structure objectives.',
          },
          aiAgents: {
            summary: 'AI distribution agents adapt content per channel with knowledge structure rules built in.',
            detail: 'Distribution agents format and deploy content across channels following your knowledge structure guidelines. You monitor and adjust rather than manually posting to each platform.',
          },
          aiAgentic: {
            summary: 'Autonomous distribution agents manage all channels with knowledge structure rules — you govern the playbook.',
            detail: 'Distribution agents deploy, adapt, and optimize content across every channel following your knowledge structure playbook. You evolve distribution strategy, not execute individual channel posts.',
          },
        },
        'track-performance': {
          preAI: {
            summary: 'Performance tracking is fragmented across tools, making knowledge structure assessment difficult.',
            detail: 'You pull data from analytics dashboards, social platforms, and CRM separately. Building a complete picture for knowledge structure requires manual data stitching.',
          },
          aiAgents: {
            summary: 'AI dashboards surface knowledge structure metrics in real time without manual data pulling.',
            detail: 'Performance agents aggregate data and highlight the knowledge structure signals that matter to you. You analyze trends rather than building dashboards from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous tracking agents monitor knowledge structure metrics continuously and trigger alerts and actions.',
            detail: 'Performance agents stream knowledge structure data and automatically trigger optimization workflows when thresholds are breached. You define KPIs and review strategic implications.',
          },
        },
        'generate-report': {
          preAI: {
            summary: 'Reports are built manually in spreadsheets, often missing the knowledge structure metrics you need.',
            detail: 'Report creation takes hours of data gathering and formatting. The metrics that matter for knowledge structure are often buried or missing entirely from standard templates.',
          },
          aiAgents: {
            summary: 'AI generates reports with knowledge structure metrics pre-formatted and insights highlighted.',
            detail: 'Reporting agents compile your knowledge structure data into structured templates with automated analysis. You add strategic narrative rather than wrangling data.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce knowledge structure reports on demand with strategic recommendations.',
            detail: 'Reporting agents generate knowledge structure analyses with actionable recommendations automatically. You consume insights and set strategic direction rather than producing reports.',
          },
        },
        'optimize': {
          preAI: {
            summary: 'Content optimization is reactive and slow, with limited connection to knowledge structure data.',
            detail: 'Optimization decisions rely on gut feel and delayed data. Your knowledge structure insights rarely feed back into content updates in a timely way.',
          },
          aiAgents: {
            summary: 'AI recommends optimizations based on knowledge structure signals and historical performance.',
            detail: 'Optimization agents suggest specific changes tied to your knowledge structure metrics. You approve and prioritize recommendations rather than diagnosing issues manually.',
          },
          aiAgentic: {
            summary: 'Autonomous optimization agents improve content continuously using knowledge structure signals — you set boundaries.',
            detail: 'Optimization agents test, iterate, and improve content based on knowledge structure data within your guardrails. You define acceptable ranges and review significant changes.',
          },
        },
        'brief-approval': {
          preAI: {
            summary: 'Brief approvals are bottlenecked by manual review cycles that delay your knowledge structure work.',
            detail: 'You wait for briefs to pass through approval chains before your knowledge structure tasks can begin. Unclear approval criteria mean briefs bounce back and forth repeatedly.',
          },
          aiAgents: {
            summary: 'AI pre-screens briefs for knowledge structure alignment, routing only exceptions to you.',
            detail: 'Approval agents check briefs against your knowledge structure criteria and flag gaps. You review flagged items rather than reading every brief end to end.',
          },
          aiAgentic: {
            summary: 'Autonomous approval agents clear standard briefs and escalate only knowledge structure exceptions to you.',
            detail: 'Approval agents validate briefs against your knowledge structure criteria and auto-approve routine requests. You handle strategic exceptions and edge cases only.',
          },
        },
        'quality-check': {
          preAI: {
            summary: 'Quality checks are inconsistent manual reviews with no standard knowledge structure criteria.',
            detail: 'Quality varies by reviewer and day. There is no automated baseline for readability, accuracy, or knowledge structure alignment, leading to uneven content standards.',
          },
          aiAgents: {
            summary: 'AI quality gates enforce baseline standards, letting you focus on knowledge structure nuance.',
            detail: 'Quality agents score readability, accuracy, and SEO automatically. Your knowledge structure evaluation focuses on strategic alignment rather than mechanical checks.',
          },
          aiAgentic: {
            summary: 'Autonomous quality agents enforce standards continuously — knowledge structure baselines are self-maintaining.',
            detail: 'Quality agents apply and evolve quality standards based on your knowledge structure benchmarks. You set quality policies that the system enforces and improves over time.',
          },
        },
        'brand-review': {
          preAI: {
            summary: 'Brand reviews are subjective gates that slow your knowledge structure pipeline.',
            detail: 'Reviewers apply brand guidelines inconsistently. What passes one review fails the next, creating unpredictable delays in your knowledge structure workflow.',
          },
          aiAgents: {
            summary: 'AI brand agents pre-score content, surfacing knowledge structure issues before your review.',
            detail: 'Brand review agents apply guidelines consistently and flag knowledge structure deviations. You handle exceptions and judgment calls rather than full content scans.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents review all content at scale — you govern knowledge structure policy evolution.',
            detail: 'Brand review agents handle all compliance checking autonomously with your knowledge structure rules. You update brand guidelines and review the rare edge case that requires human judgment.',
          },
        },
        'stakeholder-signoff': {
          preAI: {
            summary: 'Stakeholder sign-off is a bottleneck where executives delay your knowledge structure timelines.',
            detail: 'Senior approvers are busy and unresponsive. Your knowledge structure work stalls while waiting for sign-off, and last-minute changes create downstream chaos.',
          },
          aiAgents: {
            summary: 'AI prepares sign-off packages with knowledge structure summaries for faster executive approval.',
            detail: 'Sign-off agents compile context, changes, and knowledge structure impact assessments for approvers. Executives review structured summaries rather than raw content.',
          },
          aiAgentic: {
            summary: 'Autonomous agents handle routine sign-offs within knowledge structure parameters — executives approve strategy only.',
            detail: 'Sign-off agents clear content that meets all knowledge structure criteria automatically. Executives only review strategic pivots or high-risk content that breaches defined thresholds.',
          },
        },
        'performance-review': {
          preAI: {
            summary: 'Performance reviews are infrequent manual assessments that underserve your knowledge structure needs.',
            detail: 'Reviews happen quarterly at best, using outdated data. Your knowledge structure perspective is often missing from the evaluation criteria entirely.',
          },
          aiAgents: {
            summary: 'AI evaluates content against KPIs and highlights knowledge structure trends for your review.',
            detail: 'Review agents surface performance data with knowledge structure context pre-attached. You make optimize/archive decisions based on structured analysis rather than raw metrics.',
          },
          aiAgentic: {
            summary: 'Autonomous review agents evaluate and act on performance with knowledge structure logic — you set the framework.',
            detail: 'Review agents continuously assess content against your knowledge structure KPIs and trigger optimize/refresh/archive workflows automatically. You define the evaluation framework.',
          },
        },
        'social-listening': {
          preAI: {
            summary: 'Social listening is ad hoc keyword monitoring with no systematic link to knowledge structure.',
            detail: 'You check social platforms manually for relevant conversations. Insights rarely reach your knowledge structure workflow before they become stale or irrelevant.',
          },
          aiAgents: {
            summary: 'AI monitoring tools surface trending topics and sentiment relevant to knowledge structure in real time.',
            detail: 'Listening agents track conversations and flag knowledge structure signals across platforms. You act on curated insights rather than monitoring feeds manually.',
          },
          aiAgentic: {
            summary: 'Autonomous listening agents track and respond to knowledge structure signals across all platforms in real time.',
            detail: 'Listening agents monitor social channels and proactively surface knowledge structure opportunities and risks. You set monitoring priorities and review strategic findings.',
          },
        },
        'visual-asset-creation': {
          preAI: {
            summary: 'Visual asset creation is a slow design queue disconnected from your knowledge structure needs.',
            detail: 'Design requests go into a backlog with unclear priorities. Your knowledge structure requirements are often lost in translation between brief and final asset.',
          },
          aiAgents: {
            summary: 'AI design tools generate asset options aligned with knowledge structure requirements.',
            detail: 'Design agents produce visual variants following your knowledge structure guidelines. You select and refine from AI-generated options rather than directing from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous design agents produce visual assets within knowledge structure guidelines — you set creative direction.',
            detail: 'Design agents generate publication-ready visuals following your knowledge structure standards. You define the creative vision and approve hero assets while routine visuals ship autonomously.',
          },
        },
        'legal-review': {
          preAI: {
            summary: 'Legal review is an opaque process that creates unpredictable delays in your knowledge structure work.',
            detail: 'Legal feedback arrives late with minimal context. You cannot predict how long review will take, making knowledge structure planning unreliable.',
          },
          aiAgents: {
            summary: 'AI legal screening flags compliance risks early, reducing knowledge structure surprises downstream.',
            detail: 'Legal agents pre-scan content for regulatory issues and knowledge structure risks. You get early warnings rather than discovering problems at the sign-off stage.',
          },
          aiAgentic: {
            summary: 'Autonomous legal agents clear routine content and escalate only true knowledge structure risks to human counsel.',
            detail: 'Legal agents scan and clear standard content autonomously using your knowledge structure rule framework. Human lawyers handle novel risk scenarios and precedent-setting decisions only.',
          },
        },
        'accessibility-check': {
          preAI: {
            summary: 'Accessibility checking is a manual afterthought, rarely connected to your knowledge structure process.',
            detail: 'WCAG compliance and inclusive language reviews happen late in the pipeline. Your knowledge structure work is already done when accessibility issues force rework.',
          },
          aiAgents: {
            summary: 'AI accessibility tools catch WCAG violations automatically, protecting your knowledge structure standards.',
            detail: 'Accessibility agents scan for inclusive language and alt-text compliance. Your knowledge structure requirements benefit from automated baseline checks before human review.',
          },
          aiAgentic: {
            summary: 'Autonomous accessibility agents enforce WCAG and inclusive standards — knowledge structure is guaranteed by default.',
            detail: 'Accessibility agents ensure all content meets compliance standards before publication. Your knowledge structure benefits from guaranteed accessibility without manual checking overhead.',
          },
        },
        'localize-content': {
          preAI: {
            summary: 'Localization is a slow, manual translation process that delays your knowledge structure for global markets.',
            detail: 'Each market requires separate translation, cultural review, and compliance checking. Your knowledge structure suffers because localized versions lag weeks behind the original.',
          },
          aiAgents: {
            summary: 'AI translation agents accelerate localization while respecting knowledge structure requirements.',
            detail: 'Localization agents produce initial translations with knowledge structure context preserved. You review for cultural nuance rather than translating from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous localization agents adapt content for all markets simultaneously — your knowledge structure scales globally.',
            detail: 'Localization agents handle translation, cultural adaptation, and regional compliance autonomously. Your knowledge structure is maintained across markets without manual per-locale effort.',
          },
        },
        'ab-variant-creation': {
          preAI: {
            summary: 'A/B variants are created manually with limited connection to your knowledge structure hypotheses.',
            detail: 'Test variants rely on guesswork rather than data. Your knowledge structure insights rarely inform variant design, reducing the value of testing efforts.',
          },
          aiAgents: {
            summary: 'AI generates test variants informed by knowledge structure data and historical performance.',
            detail: 'Variant agents create headlines, CTAs, and imagery options based on your knowledge structure hypotheses. You select winning approaches rather than brainstorming from zero.',
          },
          aiAgentic: {
            summary: 'Autonomous variant agents design, deploy, and learn from tests using knowledge structure hypotheses — you set the agenda.',
            detail: 'Variant agents run continuous testing experiments informed by your knowledge structure objectives. You define what to test and review strategic learnings while the system iterates autonomously.',
          },
        },
        'content-repurposing': {
          preAI: {
            summary: 'Content repurposing is manual reformatting, disconnected from your knowledge structure goals.',
            detail: 'Each derivative asset is created from scratch. Your knowledge structure requirements are not systematically applied when repurposing content across formats.',
          },
          aiAgents: {
            summary: 'AI repurposing agents derive secondary assets with knowledge structure consistency built in.',
            detail: 'Repurposing agents transform primary content into channel-specific formats following your knowledge structure guidelines. You approve derivatives rather than recreating each manually.',
          },
          aiAgentic: {
            summary: 'Autonomous repurposing agents derive all secondary assets automatically within knowledge structure guidelines.',
            detail: 'Repurposing agents transform primary content into every derivative format following your knowledge structure rules. You set format strategy while the system handles production at scale.',
          },
        },
        'legal-compliance-gate': {
          preAI: {
            summary: 'Legal compliance gates create unpredictable holds that delay your knowledge structure deadlines.',
            detail: 'Legal sign-off timing is opaque and variable. Your knowledge structure timelines are at the mercy of legal review queues with no visibility into status.',
          },
          aiAgents: {
            summary: 'AI pre-screening reduces legal gate delays by resolving routine knowledge structure checks automatically.',
            detail: 'Compliance agents handle standard checks and only escalate knowledge structure edge cases to human lawyers. Your timelines are more predictable because routine items clear faster.',
          },
          aiAgentic: {
            summary: 'Autonomous compliance gates clear routine content instantly — only novel knowledge structure risks reach human lawyers.',
            detail: 'Compliance agents handle standard legal checks autonomously using your knowledge structure risk framework. Human review is reserved for unprecedented scenarios and policy updates.',
          },
        },
        'localization-quality-gate': {
          preAI: {
            summary: 'Localization quality gates are inconsistent, creating knowledge structure risks in global markets.',
            detail: 'Quality checks for localized content vary by market and reviewer. Your knowledge structure standards are unevenly applied across regions and languages.',
          },
          aiAgents: {
            summary: 'AI quality checks catch translation errors before they affect your knowledge structure outcomes.',
            detail: 'Localization QA agents verify accuracy and cultural fit automatically. Your knowledge structure standards are applied consistently across all target markets.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents ensure localization quality across all markets — knowledge structure is guaranteed globally.',
            detail: 'Localization QA agents validate every market adaptation autonomously against your knowledge structure standards. You set quality criteria while the system enforces them at scale.',
          },
        },
        'segment-mapping': {
          preAI: {
            summary: 'Segment mapping is manual spreadsheet work with limited visibility into knowledge structure impact.',
            detail: 'Mapping content variants to audience segments is done in spreadsheets. Your knowledge structure data is disconnected from the personalization logic.',
          },
          aiAgents: {
            summary: 'AI agents map variants to segments using knowledge structure data from the CDP.',
            detail: 'Segment agents recommend variant-audience matches based on your knowledge structure signals. You review the mapping rather than building it manually in spreadsheets.',
          },
          aiAgentic: {
            summary: 'Autonomous segment agents map and optimize variant-audience matches using live knowledge structure signals.',
            detail: 'Segment agents continuously refine variant-audience mappings based on real-time knowledge structure data. You define segmentation strategy while the system executes and optimizes automatically.',
          },
        },
        'dynamic-assembly': {
          preAI: {
            summary: 'Dynamic content assembly is rigid and template-bound, limiting your knowledge structure options.',
            detail: 'Personalized experiences require engineering support for each variant. Your knowledge structure vision is constrained by inflexible assembly templates.',
          },
          aiAgents: {
            summary: 'AI assembly agents construct personalized experiences informed by knowledge structure rules.',
            detail: 'Assembly agents combine content components per segment following your knowledge structure logic. You define rules and review outputs rather than manually configuring each variant.',
          },
          aiAgentic: {
            summary: 'Autonomous assembly agents construct personalized experiences in real time — knowledge structure logic is self-optimizing.',
            detail: 'Assembly agents build dynamic experiences per segment using your knowledge structure rules and real-time behavioral signals. You govern personalization policies, not individual assembly configurations.',
          },
        },
        'personalization-qa': {
          preAI: {
            summary: 'Personalization QA is manual spot-checking that misses knowledge structure gaps.',
            detail: 'Testing every segment-variant combination is impossible manually. Your knowledge structure concerns are only caught when users report issues post-launch.',
          },
          aiAgents: {
            summary: 'AI QA agents validate personalization coverage and flag knowledge structure gaps before launch.',
            detail: 'QA agents test every segment-variant combination against your knowledge structure requirements. You review exception reports rather than manually spot-checking combinations.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents validate every personalization scenario — knowledge structure gaps are caught before launch.',
            detail: 'Personalization QA agents test all segment-variant combinations against your knowledge structure requirements automatically. You set acceptance criteria while the system validates at scale.',
          },
        },
        'campaign-planning': {
          preAI: {
            summary: 'Campaign planning is a manual coordination effort with fragmented knowledge structure inputs.',
            detail: 'Campaign plans are built in decks and spreadsheets with incomplete data. Your knowledge structure perspective is often incorporated too late in the planning cycle.',
          },
          aiAgents: {
            summary: 'AI planning agents draft campaign frameworks with knowledge structure data pre-integrated.',
            detail: 'Planning agents pull audience, budget, and performance data into campaign templates. Your knowledge structure priorities shape the plan from the start rather than being retrofitted.',
          },
          aiAgentic: {
            summary: 'Autonomous planning agents generate campaign frameworks using knowledge structure intelligence — you set objectives.',
            detail: 'Planning agents produce data-driven campaign plans with your knowledge structure priorities embedded. You define strategic goals while the system optimizes tactics and resource allocation.',
          },
        },
        'consent-check': {
          preAI: {
            summary: 'Consent checking is a manual compliance step that adds friction to your knowledge structure process.',
            detail: 'Verifying GDPR/CCPA consent for targeting requires manual cross-referencing. Your knowledge structure work is delayed while compliance status is manually confirmed.',
          },
          aiAgents: {
            summary: 'AI consent agents verify targeting compliance automatically, reducing knowledge structure friction.',
            detail: 'Consent agents cross-reference CDP signals against GDPR/CCPA rules for your knowledge structure needs. You handle exceptions rather than manually verifying every segment.',
          },
          aiAgentic: {
            summary: 'Autonomous consent agents enforce privacy compliance at scale — knowledge structure is guaranteed by architecture.',
            detail: 'Consent agents verify targeting compliance in real time across all segments using your knowledge structure framework. You set privacy policies while the system enforces them automatically.',
          },
        },
        'paid-creative-production': {
          preAI: {
            summary: 'Paid creative production runs separately from organic, fragmenting your knowledge structure oversight.',
            detail: 'Ad creative and organic content are produced in silos. Your knowledge structure perspective is applied inconsistently between paid and organic channels.',
          },
          aiAgents: {
            summary: 'AI production agents generate paid variants from organic content with knowledge structure consistency.',
            detail: 'Paid creative agents adapt organic content for ad platforms following your knowledge structure guidelines. You approve and fine-tune rather than producing ad creative from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous production agents create paid variants at scale within knowledge structure guardrails — you set the strategy.',
            detail: 'Paid creative agents generate ad variants from organic content following your knowledge structure guidelines. You define creative strategy while the system produces and optimizes at scale.',
          },
        },
        'attribution-modeling': {
          preAI: {
            summary: 'Attribution modeling is manual and unreliable, undermining your knowledge structure reporting.',
            detail: 'Last-click attribution dominates despite its flaws. Your knowledge structure decisions lack the multi-touch perspective needed for accurate performance assessment.',
          },
          aiAgents: {
            summary: 'AI attribution models surface multi-touch insights relevant to your knowledge structure priorities.',
            detail: 'Attribution agents calculate content ROI across channels using your knowledge structure weightings. You interpret strategic implications rather than building models manually.',
          },
          aiAgentic: {
            summary: 'Autonomous attribution agents run multi-touch models continuously — knowledge structure insights update in real time.',
            detail: 'Attribution agents calculate content ROI across all channels using your knowledge structure framework. You interpret strategic implications while the system handles modeling complexity.',
          },
        },
        'executive-reporting': {
          preAI: {
            summary: 'Executive reports are manually assembled, often missing the knowledge structure narrative you need.',
            detail: 'Building executive dashboards takes hours of data wrangling. The knowledge structure story you want to tell is lost in generic reporting templates.',
          },
          aiAgents: {
            summary: 'AI builds executive dashboards with knowledge structure narratives pre-drafted for leadership.',
            detail: 'Reporting agents synthesize data into executive formats with your knowledge structure story embedded. You refine the narrative rather than assembling data from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce executive dashboards with knowledge structure narratives — you add strategic context.',
            detail: 'Executive reporting agents synthesize all data into leadership-ready formats with your knowledge structure story embedded. You provide strategic commentary on auto-generated insights.',
          },
        },
        'competitive-response': {
          preAI: {
            summary: 'Competitive response is slow and reactive, giving you no knowledge structure advantage.',
            detail: 'By the time you spot a competitor move and respond, the moment has passed. Your knowledge structure approach cannot adapt fast enough to real-time competitive signals.',
          },
          aiAgents: {
            summary: 'AI competitive agents surface signals and draft responses aligned with knowledge structure strategy.',
            detail: 'Competitive agents monitor market moves and suggest knowledge structure-aligned responses. You approve and refine reactive content rather than spotting threats manually.',
          },
          aiAgentic: {
            summary: 'Autonomous competitive agents detect and draft responses in real time — knowledge structure moves are countered instantly.',
            detail: 'Competitive agents monitor signals, draft responses, and deploy within your knowledge structure guardrails. You approve high-stakes responses while routine reactions ship autonomously.',
          },
        },
        'journey-mapping': {
          preAI: {
            summary: 'Journey mapping is a manual exercise that rarely reflects your knowledge structure reality.',
            detail: 'Customer journey maps are created in workshops and quickly go stale. Your knowledge structure perspective is a snapshot, not a living view of how content performs at each stage.',
          },
          aiAgents: {
            summary: 'AI journey agents map content to lifecycle stages using knowledge structure data from the CDP.',
            detail: 'Journey agents dynamically map content to customer stages based on your knowledge structure framework. You validate the mapping rather than building it manually in workshops.',
          },
          aiAgentic: {
            summary: 'Autonomous journey agents maintain living maps using real-time knowledge structure data — you shape the strategy.',
            detail: 'Journey agents dynamically map content to lifecycle stages using live knowledge structure signals. You define journey frameworks while the system optimizes content placement continuously.',
          },
        },
        'sentiment-monitoring': {
          preAI: {
            summary: 'Sentiment monitoring is sporadic manual checking with no systematic link to knowledge structure.',
            detail: 'You check brand sentiment reactively rather than proactively. Your knowledge structure decisions are made without real-time audience feedback signals.',
          },
          aiAgents: {
            summary: 'AI sentiment agents track brand reception in real time, alerting you to knowledge structure risks.',
            detail: 'Sentiment agents analyze audience reactions and flag knowledge structure concerns before they escalate. You respond to alerts rather than manually checking platforms.',
          },
          aiAgentic: {
            summary: 'Autonomous sentiment agents monitor and respond to knowledge structure signals around the clock — you govern escalation.',
            detail: 'Sentiment agents track audience reactions and trigger knowledge structure responses automatically. You set escalation thresholds and review strategic implications of sentiment shifts.',
          },
        },
        'sales-enablement': {
          preAI: {
            summary: 'Sales enablement content is created ad hoc, disconnected from your knowledge structure strategy.',
            detail: 'Sales teams request materials outside the content pipeline. Your knowledge structure standards are not applied to battle cards, decks, and one-pagers created in isolation.',
          },
          aiAgents: {
            summary: 'AI agents generate sales materials from marketing content with knowledge structure alignment.',
            detail: 'Sales enablement agents transform marketing assets into battle cards and decks following your knowledge structure standards. You approve rather than creating each piece manually.',
          },
          aiAgentic: {
            summary: 'Autonomous enablement agents keep sales materials current with knowledge structure alignment — you set the playbook.',
            detail: 'Enablement agents automatically update battle cards, decks, and case studies as your knowledge structure data evolves. You define the sales narrative while the system produces materials at scale.',
          },
        },
        'influencer-brief': {
          preAI: {
            summary: 'Influencer briefs are manual documents with limited knowledge structure guardrails.',
            detail: 'Creator briefs are written from scratch each time. Your knowledge structure guidelines are inconsistently communicated to external partners and influencers.',
          },
          aiAgents: {
            summary: 'AI agents draft influencer briefs with knowledge structure guardrails embedded automatically.',
            detail: 'Brief agents generate creator guidelines from your knowledge structure requirements and past successful collaborations. You customize rather than writing each brief from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous brief agents generate creator guidelines with knowledge structure guardrails — you approve partnerships.',
            detail: 'Brief agents produce personalized influencer guidelines using your knowledge structure framework and creator history. You focus on relationship strategy while briefs ship autonomously.',
          },
        },
        'ugc-moderation': {
          preAI: {
            summary: 'UGC moderation is manual screening that cannot scale to protect knowledge structure.',
            detail: 'User-generated content is reviewed one piece at a time. Your knowledge structure standards cannot be consistently enforced across the volume of submissions.',
          },
          aiAgents: {
            summary: 'AI moderation agents screen UGC for brand safety and knowledge structure compliance at scale.',
            detail: 'Moderation agents filter user-generated content against your knowledge structure criteria. You review borderline cases rather than manually screening every submission.',
          },
          aiAgentic: {
            summary: 'Autonomous moderation agents screen all UGC for knowledge structure compliance at scale — you govern edge cases.',
            detail: 'Moderation agents filter user-generated content using your knowledge structure rules continuously. You update moderation policies and review borderline cases that the system escalates.',
          },
        },
        'content-scoring': {
          preAI: {
            summary: 'Content scoring is subjective prioritization that underweights your knowledge structure criteria.',
            detail: 'Requests are prioritized by loudest voice or executive fiat. Your knowledge structure scoring criteria are rarely part of the formal prioritization framework.',
          },
          aiAgents: {
            summary: 'AI scoring agents rank requests using knowledge structure criteria alongside strategic priority.',
            detail: 'Scoring agents weight your knowledge structure factors into the prioritization algorithm. You adjust rankings rather than scoring each request manually.',
          },
          aiAgentic: {
            summary: 'Autonomous scoring agents prioritize the pipeline using knowledge structure criteria — you set strategic weights.',
            detail: 'Scoring agents rank and route content requests using your knowledge structure priorities in real time. You define scoring criteria and review the queue rather than manually triaging.',
          },
        },
        'channel-orchestration': {
          preAI: {
            summary: 'Channel orchestration is manual coordination with no systematic knowledge structure integration.',
            detail: 'Cross-channel timing is managed in spreadsheets and Slack. Your knowledge structure requirements for sequencing and coordination are often overridden by ad hoc changes.',
          },
          aiAgents: {
            summary: 'AI orchestration agents sequence distribution with knowledge structure rules for timing and cadence.',
            detail: 'Orchestration agents coordinate cross-channel timing based on your knowledge structure requirements. You set rules and review the sequence rather than managing each channel individually.',
          },
          aiAgentic: {
            summary: 'Autonomous orchestration agents manage all channel timing with knowledge structure logic — you set the playbook.',
            detail: 'Orchestration agents handle cross-channel sequencing, timing, and coordination autonomously using your knowledge structure rules. You evolve the orchestration strategy while the system executes.',
          },
        },
      },
      keyInsight: 'This role emerges when you treat AI as a system that needs structured context to reason well. It\'s the most leveraged role in the pipeline because every change multiplies.',
    },
  },
];

// Quick lookup by role ID
export const ROLE_MAP = new Map(ROLE_DEFINITIONS.map(r => [r.id, r]));

// Get all node IDs associated with a role
export function getRoleNodeIds(role: RoleDefinition): string[] {
  return [
    ...role.ownedSteps,
    ...role.reviewedGates,
    ...role.relatedAgents,
    ...role.relatedInputs,
  ];
}
