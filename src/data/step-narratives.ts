// Narrative content for each of the 31 campaign walkthrough nodes.
// Each entry is deliberately concise: one-sentence lede + one block.
// The walkthrough should feel like scanning chapter titles, not reading chapters.

export type BlockType =
  | 'narrative'
  | 'scenario'
  | 'tension'
  | 'ai-handoff'
  | 'metric'
  | 'before-after'
  | 'decision-tree'
  | 'domino-effect'
  | 'tip'
  | 'quote';

export interface ContentBlock {
  type: BlockType;
  content: string;
  /** Optional second line for before-after or decision-tree blocks */
  alt?: string;
}

export interface CampaignJourneyStage {
  summary: string;
  detail: string;
}

export interface CampaignJourney {
  preAI: CampaignJourneyStage;
  aiAgents: CampaignJourneyStage;
  aiAgentic: CampaignJourneyStage;
}

export interface StepNarrative {
  headline: string;
  lede: string;
  blocks: ContentBlock[];
  roleId: string;
  /** Third-person journey describing how this step evolved — used in campaign walkthrough */
  campaignJourney?: CampaignJourney;
}

export const STEP_NARRATIVES: Record<string, StepNarrative> = {
  /* ── PLAN PHASE ────────────────────────────────────────── */

  'campaign-planning': {
    headline: 'Campaign Planning',
    lede: 'Translating business objectives into a campaign architecture with defined audiences, channels, budgets, and KPIs.',
    blocks: [
      {
        type: 'scenario',
        content: 'Q3 pipeline is 20% below target. The CMO needs a demand-gen campaign in four weeks. Without structured planning, the team scrambles — random assets, no journey logic, budget spread thin. With it, every downstream node inherits clear objectives.',
      },
    ],
    roleId: 'campaign-manager',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, campaign planning meant weeks of cross-team meetings, spreadsheet-based budget models, and manual audience sizing.',
        detail: 'Marketing ops, finance, analytics, and creative teams each contributed fragments. Consolidating inputs into a coherent plan was the campaign manager\'s full-time job for the first two weeks of every campaign.',
      },
      aiAgents: {
        summary: 'AI agents now pull historical performance data, audience sizing, and channel benchmarks into a draft plan that teams review and refine.',
        detail: 'Instead of building from a blank spreadsheet, the planning team starts with a data-backed draft. Budget allocation models run in minutes rather than days. Human judgment focuses on strategic trade-offs, not data assembly.',
      },
      aiAgentic: {
        summary: 'The agentic system generates complete campaign architectures — audiences, channels, budgets, and KPIs — from a business objective statement.',
        detail: 'Teams validate and adjust rather than build from scratch. The system incorporates learnings from every prior campaign, surfacing what worked for similar objectives and flagging budget patterns that underperformed.',
      },
    },
  },

  'journey-mapping': {
    headline: 'Journey Stage Mapping',
    lede: 'Content that ignores journey stage talks to everyone and persuades no one.',
    blocks: [
      {
        type: 'before-after',
        content: 'A blog post is published and promoted identically to cold prospects and existing customers.',
        alt: 'The same topic spawns three assets — a thought-leadership piece for awareness, a comparison guide for consideration, and a case study for decision.',
      },
    ],
    roleId: 'campaign-manager',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, marketing teams mapped content to journey stages manually — typically in annual planning sessions with limited data.',
        detail: 'Content strategists, product marketers, and demand-gen teams would debate which stage each asset served. Gap analysis was subjective, often driven by gut feeling rather than actual customer behavior data.',
      },
      aiAgents: {
        summary: 'AI agents now analyze CDP data and content taxonomy to produce a journey-content map with quantified coverage gaps.',
        detail: 'The agent cross-references lifecycle stage data with existing content tags, surfacing where prospects drop off and which stages lack supporting assets. Teams prioritize creation based on data instead of opinion.',
      },
      aiAgentic: {
        summary: 'The agentic system continuously maintains the journey map, auto-generating content requests when coverage gaps emerge.',
        detail: 'As customer behavior shifts and new segments appear, the system updates the map in real time and routes priority content requests into the pipeline — no quarterly review needed.',
      },
    },
  },

  'receive-request': {
    headline: 'Receive Request',
    lede: 'Capturing who wants content, why, for whom, and by when — the front door of the pipeline.',
    blocks: [
      {
        type: 'tension',
        content: 'Without structured intake, requests arrive via Slack, email, and hallway conversations — each with different levels of detail. The production team spends more time clarifying scope than creating content.',
      },
    ],
    roleId: 'content-director',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, content requests arrived from sales, product, executives, and partners through every channel imaginable — email, Slack, meetings, hallway conversations.',
        detail: 'The content team spent hours each week normalizing inconsistent requests into something actionable. Half the work was chasing stakeholders for missing details like audience, timeline, and success criteria.',
      },
      aiAgents: {
        summary: 'An intake agent now structures incoming requests into a standard format, pre-categorized with audience data and strategic alignment scores.',
        detail: 'Requestors interact with a structured form or conversational agent that asks the right questions upfront. The content team receives complete, normalized briefs instead of ambiguous asks.',
      },
      aiAgentic: {
        summary: 'Requests are auto-classified, scored, and routed end-to-end — the content team only sees those requiring strategic arbitration.',
        detail: 'The system handles routine intake autonomously, flagging only requests that involve competing priorities, new audience segments, or unplanned budget implications for human decision-making.',
      },
    },
  },

  'content-scoring': {
    headline: 'Content Scoring & Prioritization',
    lede: 'Ranking requests against strategic priority, audience demand, and expected ROI before work begins.',
    blocks: [
      {
        type: 'domino-effect',
        content: 'Skip scoring and low-impact content consumes the same resources as high-impact content. Your best writers spend cycles on a partner one-pager while a revenue-critical launch brief waits in the queue.',
      },
    ],
    roleId: 'content-director',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, prioritization was subjective — the loudest stakeholder or most senior executive determined what got produced first.',
        detail: 'Content teams maintained backlog spreadsheets with manual priority rankings. There was no systematic way to compare a partner request against a product launch against a competitive response. Resources were allocated by political weight, not strategic impact.',
      },
      aiAgents: {
        summary: 'AI agents now score every request against a weighted framework — strategic alignment, audience demand, competitive urgency, and expected ROI.',
        detail: 'The scoring agent pulls analytics data, budget constraints, and content strategy parameters to produce an objective ranking. Teams still make the final call, but they start with data-backed priority recommendations.',
      },
      aiAgentic: {
        summary: 'The agentic system continuously re-ranks the queue as new signals arrive — competitive moves, performance shifts, or budget changes trigger automatic reprioritization.',
        detail: 'Priority is no longer a point-in-time decision. The system adjusts rankings dynamically and surfaces when a high-scoring request should preempt work already in progress.',
      },
    },
  },

  'research-insights': {
    headline: 'Research & Insights',
    lede: 'The Research Agent synthesizes audience signals, competitive intelligence, and trending topics into brief-ready insights.',
    blocks: [
      {
        type: 'ai-handoff',
        content: 'The agent scans social listening feeds, SEO keyword trends, and competitor content in minutes. The human strategist interprets what the data means for positioning — which angle is differentiated, not just which keyword has volume.',
      },
    ],
    roleId: 'content-strategist',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, research teams manually compiled audience data, competitive intel, and trend reports from dozens of sources over days or weeks.',
        detail: 'Analysts, strategists, and subject-matter experts each contributed fragments — survey results, SEO keyword exports, competitive content audits. Synthesis was slow, and insights were often stale by the time they reached the brief.',
      },
      aiAgents: {
        summary: 'Research agents now scan social listening feeds, SEO trends, and competitor content in minutes, delivering a synthesized brief-ready summary.',
        detail: 'The agent aggregates data that previously required three separate tools and two team members. Human strategists focus on interpreting what the data means for positioning rather than assembling the data itself.',
      },
      aiAgentic: {
        summary: 'The agentic system continuously monitors signals and proactively surfaces insights before a brief is even requested.',
        detail: 'Research is no longer a discrete step — it runs as an ambient process. When a new content request enters the pipeline, relevant insights are already assembled and waiting, including competitive gaps that emerged overnight.',
      },
    },
  },

  'write-brief': {
    headline: 'Write Brief',
    lede: 'The single document that aligns writers, designers, reviewers, and agents on what "done" looks like.',
    blocks: [
      {
        type: 'tension',
        content: 'The most expensive content failures trace back to briefs, not drafts. A well-written draft against a misaligned brief is still a failure — it just takes longer to discover.',
      },
    ],
    roleId: 'content-director',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, content directors drafted every brief by hand, manually pulling together research, audience data, and stakeholder requirements.',
        detail: 'Each brief required negotiation across product marketing, sales enablement, and brand teams. Output quality depended entirely on the director\'s bandwidth, and bottlenecks here delayed the entire downstream pipeline.',
      },
      aiAgents: {
        summary: 'AI agents now assemble a first draft brief from research data, audience personas, and brand guidelines — the content team reviews and refines.',
        detail: 'The writing agent pulls structured inputs and produces a brief that meets template requirements. Teams reshape the draft rather than create from scratch, cutting brief turnaround from days to hours.',
      },
      aiAgentic: {
        summary: 'Routine briefs auto-generate and route for approval without human drafting — teams only write briefs for novel strategic territory.',
        detail: 'The system recognizes when a request matches proven patterns and generates the full brief autonomously. Human writing effort concentrates on the 20% of briefs that genuinely require creative or strategic judgment.',
      },
    },
  },

  'brief-approval': {
    headline: 'Brief Approval',
    lede: 'Approving a brief commits the pipeline to an objective — changing direction after drafting costs 5x more.',
    blocks: [
      {
        type: 'decision-tree',
        content: 'Approve: Strategy score above threshold, required fields complete, audience clearly defined, success metrics measurable.',
        alt: 'Revise: Missing audience specificity, unclear differentiation from existing content, or KPIs that cannot be tracked with current tooling.',
      },
    ],
    roleId: 'content-director',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, brief approval was a bottleneck — documents circulated via email and sat in inboxes for days waiting for the right stakeholder to review.',
        detail: 'Content directors, strategy leads, and sometimes executives each had to sign off. Conflicting feedback arrived asynchronously, and reconciling it added another round of delays.',
      },
      aiAgents: {
        summary: 'AI agents pre-validate briefs against scoring criteria and flag issues before the human reviewer sees them, reducing revision cycles.',
        detail: 'The agent checks required fields, strategic alignment scores, and audience clarity automatically. Reviewers receive a pre-screened brief with a confidence score, focusing their attention on genuine strategic gaps.',
      },
      aiAgentic: {
        summary: 'Briefs that meet all automated criteria auto-approve and proceed to drafting — human reviewers only see briefs that fail thresholds or raise strategic questions.',
        detail: 'The system distinguishes routine approvals from genuine decision points. Approval latency drops from days to minutes for standard briefs, while complex strategic decisions still get full human attention.',
      },
    },
  },

  /* ── CREATE PHASE ──────────────────────────────────────── */

  'draft-content': {
    headline: 'Draft Content',
    lede: 'The Content Writer agent transforms an approved brief into a structured first draft.',
    blocks: [
      {
        type: 'ai-handoff',
        content: 'The agent generates the draft from the brief, brand guide, and audience persona. The human editor refines what no algorithm reliably produces: narrative judgment, emotional nuance, and whether the piece says something worth reading.',
      },
    ],
    roleId: 'creative-director',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, writing teams produced every draft from scratch — writers, editors, and subject-matter experts collaborated over days to produce a single piece.',
        detail: 'Writers researched independently, editors corrected misalignment with the brief mid-draft, and subject-matter experts reviewed for accuracy. A single blog post could take a week from brief to first draft.',
      },
      aiAgents: {
        summary: 'AI writing agents now generate structured first drafts from approved briefs, brand guidelines, and audience personas in minutes.',
        detail: 'The writing team shifts from generation to refinement. Editors focus on narrative judgment, emotional nuance, and strategic positioning — the dimensions that agents consistently struggle with.',
      },
      aiAgentic: {
        summary: 'The agentic system produces publication-ready drafts for routine content types, with human writers reserved for high-stakes or novel creative territory.',
        detail: 'For standard formats like product updates, event recaps, and knowledge base articles, the system handles end-to-end drafting. Creative teams concentrate their effort where human voice genuinely differentiates.',
      },
    },
  },

  'visual-asset-creation': {
    headline: 'Visual Asset Creation',
    lede: 'Visual assets created alongside the draft — not bolted on at the end.',
    blocks: [
      {
        type: 'tension',
        content: 'When visual creation waits until after draft approval, it becomes the bottleneck. Last-minute design requests produce generic stock-photo solutions instead of purposeful visual storytelling.',
      },
    ],
    roleId: 'creative-director',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, creative teams designed every visual asset manually — hero images, infographics, social graphics — often as a separate workstream that ran behind the writing schedule.',
        detail: 'Design requests queued behind other projects. Writers and designers worked asynchronously, leading to visuals that felt disconnected from the content narrative. Last-minute stock photos were the norm.',
      },
      aiAgents: {
        summary: 'Visual asset agents now generate brand-compliant graphics, suggest imagery from the DAM, and produce alt text automatically alongside the draft.',
        detail: 'The agent works from the same brief as the writing agent, producing visuals in parallel. Design teams review and refine AI-generated assets rather than creating from scratch, cutting production time significantly.',
      },
      aiAgentic: {
        summary: 'The agentic system produces complete visual packages — hero images, supporting graphics, social crops, and alt text — that ship alongside the draft without a separate design queue.',
        detail: 'Visual creation is no longer a bottleneck. The system maintains brand consistency across hundreds of assets and only escalates to human designers for conceptual work, original illustration, or brand-defining creative.',
      },
    },
  },

  'seo-optimization': {
    headline: 'SEO Optimization',
    lede: 'Search visibility built in, not bolted on — keywords, meta descriptions, heading structure, and internal linking.',
    blocks: [
      {
        type: 'ai-handoff',
        content: 'The agent handles keyword density, meta tags, schema markup, and internal link suggestions. The human ensures optimization serves the reader — no keyword stuffing, no clickbait headings, no sacrificing narrative flow for a search score.',
      },
    ],
    roleId: 'editor',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, SEO was a manual, post-draft process — SEO specialists reviewed content after it was written and retrofitted keywords, meta tags, and heading structures.',
        detail: 'The SEO team maintained keyword research in separate spreadsheets. Writers often resisted SEO edits that disrupted narrative flow. The result was a constant tension between readability and search performance.',
      },
      aiAgents: {
        summary: 'SEO agents now optimize content during drafting — keyword placement, meta descriptions, schema markup, and internal links are applied automatically.',
        detail: 'The agent handles technical SEO mechanics in real time. Human editors review the result to ensure optimization serves the reader, catching keyword stuffing or clickbait headings that algorithms sometimes introduce.',
      },
      aiAgentic: {
        summary: 'The agentic system treats SEO as a continuous optimization loop — content is optimized at creation, re-optimized based on performance data, and adapted as search algorithms evolve.',
        detail: 'SEO is no longer a one-time step. The system monitors ranking changes and automatically suggests updates to published content, maintaining search visibility without manual re-audits.',
      },
    },
  },

  /* ── REVIEW PHASE ──────────────────────────────────────── */

  'quality-check': {
    headline: 'Quality Check',
    lede: 'Automated readability, factual accuracy, and SEO scoring — when thresholds pass, content flows through automatically.',
    blocks: [
      {
        type: 'decision-tree',
        content: 'Auto-pass: Readability above 70, SEO above 85, zero factual flags. Content proceeds without human review.',
        alt: 'Manual review: Any threshold missed triggers editor review. Most common failures: jargon-heavy drafts and unsubstantiated claims.',
      },
    ],
    roleId: 'editor',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, quality checks were entirely manual — editors reviewed every piece for readability, accuracy, and SEO compliance.',
        detail: 'The editorial team was the bottleneck. Every draft waited in queue for human review regardless of quality. Simple, well-written pieces waited as long as problematic ones, creating unnecessary delays.',
      },
      aiAgents: {
        summary: 'AI agents now score readability, factual claims, and SEO metrics automatically — content that meets thresholds passes without human review.',
        detail: 'The quality gate becomes selective rather than universal. Editors focus their attention on content that actually needs human judgment — flagged claims, jargon-heavy drafts, or pieces below readability thresholds.',
      },
      aiAgentic: {
        summary: 'The agentic system not only gates quality but actively fixes common issues before they reach review — auto-correcting readability, simplifying jargon, and verifying claims.',
        detail: 'Most content passes quality checks on the first attempt because the drafting agents learned from past quality failures. The quality gate catches the exceptions rather than processing the norm.',
      },
    },
  },

  'brand-compliance': {
    headline: 'Brand Compliance',
    lede: 'Automated scanning against brand guidelines — tone, terminology, messaging — flagging violations before human review.',
    blocks: [
      {
        type: 'scenario',
        content: 'An agent-drafted blog post uses "cutting-edge" three times — a term the brand guide bans. Without automated scanning, the Brand Manager catches it manually. With it, the term is flagged and alternatives suggested before the draft ever leaves creation.',
      },
    ],
    roleId: 'brand-manager',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, brand compliance depended on the brand team manually reviewing every piece — checking tone, terminology, and messaging against a PDF style guide.',
        detail: 'Brand managers, content editors, and sometimes legal teams each caught different issues. Inconsistencies slipped through when reviewers were overloaded. Different content types (blog, social, email) drifted apart in voice.',
      },
      aiAgents: {
        summary: 'Brand compliance agents now scan content against the brand guide automatically — flagging banned terms, tone mismatches, and messaging inconsistencies before human review.',
        detail: 'The agent catches mechanical brand violations instantly. Brand managers shift from policing terminology to making judgment calls — cultural context, competitive positioning, and whether the brand voice is evolving appropriately.',
      },
      aiAgentic: {
        summary: 'The agentic system enforces brand consistency across all content in real time and auto-corrects common violations during drafting — brand managers focus on strategic brand evolution.',
        detail: 'Brand compliance becomes ambient rather than gate-based. The system catches drift before it compounds, and surfaces patterns — like which content types or which agents most frequently trigger brand issues.',
      },
    },
  },

  'brand-review': {
    headline: 'Brand Review',
    lede: 'The Brand Manager reviews content requiring human judgment — cultural context, competitive positioning, brand evolution.',
    blocks: [
      {
        type: 'tension',
        content: 'A piece can be 100% compliant and still feel off-brand because the cultural moment changed, a competitor shifted positioning, or the audience matured. Brand is how the audience feels about you — that cannot be reduced to a checklist.',
      },
    ],
    roleId: 'brand-manager',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, brand review was a universal gate — the brand manager personally reviewed every piece of content regardless of risk or complexity.',
        detail: 'High-volume campaigns created overwhelming queues. Brand managers became bottlenecks, and under time pressure, reviews became cursory. The team had no way to distinguish routine compliance from content that genuinely needed brand judgment.',
      },
      aiAgents: {
        summary: 'AI agents pre-filter content so brand managers only review pieces that require genuine human judgment — cultural nuance, competitive positioning, or brand evolution decisions.',
        detail: 'Automated compliance checks handle the mechanical dimensions. Brand managers receive a curated queue of content that actually needs their expertise, with context about why each piece was flagged.',
      },
      aiAgentic: {
        summary: 'The agentic system handles brand compliance end-to-end for standard content — brand managers focus exclusively on strategic brand decisions and evolving the guidelines themselves.',
        detail: 'The system learns from past brand decisions, gradually handling more nuanced judgments autonomously. Brand managers shift from reviewing individual pieces to shaping the brand intelligence that all agents use.',
      },
    },
  },

  'legal-review': {
    headline: 'Legal Review',
    lede: 'Screening for regulatory compliance, IP risk, disclosure requirements, and claims substantiation.',
    blocks: [
      {
        type: 'domino-effect',
        content: 'A legal issue caught here pauses one content piece. The same issue published live triggers regulatory inquiry, PR crisis management, content takedown across all channels, and potential financial penalties.',
      },
    ],
    roleId: 'legal-counsel',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, legal review required in-house counsel or compliance officers to manually read every piece — a slow, expensive process that created major bottlenecks.',
        detail: 'Legal teams, marketing compliance, and sometimes external counsel each reviewed different risk dimensions. For regulated industries, a single blog post could take a week in legal review.',
      },
      aiAgents: {
        summary: 'Legal screening agents now pre-scan content for regulated terms, unsubstantiated claims, and missing disclosures — human counsel reviews only flagged issues.',
        detail: 'The agent catches the mechanical compliance issues that consumed most of legal\'s review time. Counsel focuses on genuine judgment calls — novel claims, regulatory gray areas, and strategic risk assessment.',
      },
      aiAgentic: {
        summary: 'The agentic system maintains a living regulatory model that auto-adapts to new regulations and flags content across the entire library when rules change — not just new content.',
        detail: 'Legal risk management becomes proactive rather than reactive. When a regulation changes, the system identifies all affected published content and queues updates before the compliance deadline.',
      },
    },
  },

  'legal-compliance-gate': {
    headline: 'Legal Compliance Gate',
    lede: 'The one checkpoint where human authority is absolute — no agent overrides a legal hold.',
    blocks: [
      {
        type: 'decision-tree',
        content: 'Auto-pass: No flagged claims, no regulated terms, disclosure checklist complete. Content proceeds to final edit.',
        alt: 'Escalate: Any regulatory flag triggers Legal Counsel review. Escalation goes directly to stakeholder sign-off if risk is material.',
      },
    ],
    roleId: 'legal-counsel',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, legal compliance gates were binary — counsel approved or rejected, with no gradation and no automation.',
        detail: 'Every piece waited in the legal queue regardless of risk level. Low-risk content (product updates, event recaps) waited alongside high-risk content (competitive claims, regulatory topics). The gate treated all content identically.',
      },
      aiAgents: {
        summary: 'AI agents now pre-validate compliance checklists automatically — content with no flags passes through, while genuinely risky content routes to human counsel.',
        detail: 'The legal gate becomes risk-proportionate. Routine content clears in seconds. Counsel\'s time is reserved for material risk — novel claims, regulated industry content, and strategic positioning that could attract regulatory attention.',
      },
      aiAgentic: {
        summary: 'The agentic system maintains real-time regulatory awareness — when rules change, it automatically re-evaluates all pending and published content against new requirements.',
        detail: 'Legal compliance becomes anticipatory. The system flags upcoming regulatory changes and their content implications before they take effect, giving teams time to update rather than scramble.',
      },
    },
  },

  'final-edit': {
    headline: 'Final Edit',
    lede: 'The last human touch — narrative flow, coherence, and whether the piece says something worth reading.',
    blocks: [
      {
        type: 'narrative',
        content: 'Final edit is not proofreading. Agents handle readability scores, SEO, and factual checking upstream. The editor handles what machines consistently miss: whether the argument is coherent, the opening earns the next paragraph, and the writing resonates.',
      },
    ],
    roleId: 'editor',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, editors handled everything — proofreading, fact-checking, readability, SEO adjustments, and narrative polish — in a single exhausting pass.',
        detail: 'Editing was the most overloaded step in the pipeline. Editors spent the majority of their time on mechanical corrections, leaving limited bandwidth for the high-judgment editorial work that actually differentiates content.',
      },
      aiAgents: {
        summary: 'AI agents now handle proofreading, readability scoring, and factual verification upstream — editors focus exclusively on narrative quality and strategic coherence.',
        detail: 'The editor\'s role elevates from line-editing to narrative architecture. Mechanical issues are resolved before content reaches this step, so editors invest their time in what machines consistently miss.',
      },
      aiAgentic: {
        summary: 'The agentic system handles all mechanical editing autonomously — human editors are reserved for high-stakes content where narrative judgment genuinely matters.',
        detail: 'For routine content types, the system produces publication-ready output. Editors focus on thought leadership, executive communications, and content that shapes brand perception — a fraction of total volume but the majority of strategic impact.',
      },
    },
  },

  'accessibility-check': {
    headline: 'Accessibility Check',
    lede: 'WCAG compliance, inclusive language, alt-text coverage, and screen reader compatibility.',
    blocks: [
      {
        type: 'before-after',
        content: 'Alt-text reads "image.png," color contrast fails, screen readers choke on decorative elements.',
        alt: 'Alt-text is descriptive, contrast ratios pass WCAG AA, every visual element has a text equivalent.',
      },
    ],
    roleId: 'editor',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, accessibility checks were often skipped entirely or performed inconsistently — design teams and editors lacked WCAG expertise.',
        detail: 'Alt-text was an afterthought, color contrast was eyeballed, and inclusive language reviews depended on individual awareness. Accessibility issues were typically discovered by users after publication, if at all.',
      },
      aiAgents: {
        summary: 'Accessibility agents now automatically scan for WCAG compliance, generate descriptive alt-text, and flag inclusive language issues.',
        detail: 'The agent handles technical accessibility requirements that most content teams lack specialized expertise for. Compliance becomes consistent rather than dependent on individual knowledge.',
      },
      aiAgentic: {
        summary: 'The agentic system builds accessibility into every upstream step — alt-text is generated during visual creation, inclusive language is enforced during drafting, and compliance is verified continuously.',
        detail: 'Accessibility is no longer a gate at the end of production but a quality woven throughout. The system catches issues at the point of creation, not after the content is otherwise complete.',
      },
    },
  },

  'stakeholder-signoff': {
    headline: 'Stakeholder Sign-off',
    lede: 'Final approval from leadership — strategic alignment, not editorial quality.',
    blocks: [
      {
        type: 'decision-tree',
        content: 'Auto-pass: All upstream gates passed, content sensitivity below threshold, no legal flags.',
        alt: 'Manual review: High-sensitivity, high-visibility, or new market positioning. The stakeholder reviews strategy — editorial quality was settled upstream.',
      },
    ],
    roleId: 'vp-marketing',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, executive sign-off was a universal requirement — every piece of content waited for VP or director approval regardless of risk level.',
        detail: 'Leadership teams reviewed content alongside dozens of other priorities. Approval latency was measured in days. Campaign timelines were built around executive availability rather than market timing.',
      },
      aiAgents: {
        summary: 'AI agents now pre-validate content against all upstream gates and sensitivity scoring — executives only review content that genuinely requires strategic judgment.',
        detail: 'The system provides a risk assessment summary so stakeholders can make faster, more informed decisions. Low-sensitivity content that passed all automated gates proceeds without executive review.',
      },
      aiAgentic: {
        summary: 'The agentic system handles routine approvals end-to-end — executive attention is reserved for high-visibility, strategically sensitive, or precedent-setting content.',
        detail: 'Stakeholder sign-off shifts from a bottleneck to a strategic checkpoint. Executives spend their limited content review time on decisions that genuinely need their authority and perspective.',
      },
    },
  },

  /* ── PUBLISH PHASE ─────────────────────────────────────── */

  'localize-content': {
    headline: 'Localize Content',
    lede: 'Adapting content for target markets — cultural nuance, regional regulatory differences, and local visual standards.',
    blocks: [
      {
        type: 'ai-handoff',
        content: 'The agent handles translation, format adaptation, and regulatory checklist matching. The human reviews cultural subtleties — humor that misfires across borders, idioms with unintended meaning, and visual elements requiring cultural sensitivity.',
      },
    ],
    roleId: 'localization-manager',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, localization required translation agencies, regional marketing teams, and local legal reviewers — a multi-week process for each market.',
        detail: 'Each locale needed a separate workflow with its own translators, cultural consultants, and compliance checks. Launching in five markets meant five parallel review cycles, each with potential delays.',
      },
      aiAgents: {
        summary: 'Localization agents now handle translation, format adaptation, and regulatory checklist matching — regional teams review cultural subtleties rather than performing full translations.',
        detail: 'The agent produces market-ready drafts for most content types. Human reviewers focus on cultural nuance — humor, idioms, and visual elements that require local sensitivity — rather than mechanical translation.',
      },
      aiAgentic: {
        summary: 'The agentic system localizes content across all target markets simultaneously and maintains locale-specific brand voices that evolve with each market.',
        detail: 'Multi-market launches that previously took weeks now happen in parallel. The system learns cultural preferences per locale, improving output quality with each piece and flagging when cultural or regulatory shifts require updated guidelines.',
      },
    },
  },

  'localization-quality-gate': {
    headline: 'Localization Quality Gate',
    lede: 'Validating translation accuracy, cultural appropriateness, and local regulatory compliance.',
    blocks: [
      {
        type: 'domino-effect',
        content: 'A cultural misstep in one market does not stay in one market. Social media amplifies regional failures globally. This gate can escalate to legal — a cultural flag in one locale can trigger legal review across all markets.',
      },
    ],
    roleId: 'localization-manager',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, localization quality depended entirely on native-speaker reviewers — quality was inconsistent across markets and proportional to reviewer availability.',
        detail: 'Regional marketing leads, local translators, and cultural consultants each provided partial coverage. Some markets received rigorous review while others were under-resourced, creating uneven brand quality globally.',
      },
      aiAgents: {
        summary: 'AI agents now verify translation confidence, cultural sensitivity flags, and local regulatory compliance automatically — reviewers focus on flagged items.',
        detail: 'The agent provides a quality score per locale with specific issues highlighted. Regional teams review exceptions rather than performing comprehensive re-reads, achieving consistent quality across all markets.',
      },
      aiAgentic: {
        summary: 'The agentic system maintains quality benchmarks per market and escalates cross-market issues when a cultural or regulatory flag in one locale affects others.',
        detail: 'Quality assurance becomes predictive. The system identifies patterns — which content types, topics, or source-language constructs consistently cause issues in specific markets — and adjusts upstream processes accordingly.',
      },
    },
  },

  'schedule-publish': {
    headline: 'Schedule & Publish',
    lede: 'When content publishes matters almost as much as what it says.',
    blocks: [
      {
        type: 'narrative',
        content: 'Cross-channel orchestration rules determine whether email goes before social, whether gated content precedes ungated, and when paid amplification triggers. The sequence is the strategy.',
      },
    ],
    roleId: 'marketing-ops',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, marketing ops teams manually scheduled publications in each CMS, email platform, and social tool — coordinating timing across channels by spreadsheet.',
        detail: 'Campaign managers, social media teams, email specialists, and web producers each published independently. Cross-channel timing was aspirational. Missed scheduling windows meant content launched at suboptimal times or out of sequence.',
      },
      aiAgents: {
        summary: 'Publishing agents now configure CMS settings, schedule across platforms, and sequence cross-channel launches based on orchestration rules.',
        detail: 'The agent handles the mechanical coordination that previously required multiple specialists. Teams set the strategy (email first, social follows 2 hours later) and the agent executes it precisely across all platforms.',
      },
      aiAgentic: {
        summary: 'The agentic system optimizes publication timing dynamically — adjusting schedules based on real-time audience activity, competitive signals, and cross-channel performance data.',
        detail: 'Publication timing becomes adaptive rather than predetermined. The system learns which times perform best per channel per audience segment and adjusts schedules accordingly, even shifting launch sequences mid-campaign based on early signals.',
      },
    },
  },

  'distribute': {
    headline: 'Distribute',
    lede: 'Pushing content across social, email, syndication, and paid — each channel gets a native format.',
    blocks: [
      {
        type: 'before-after',
        content: 'The same blog link shared identically on LinkedIn, Twitter, email, and Slack.',
        alt: 'Each channel gets a native format — LinkedIn gets a thought-leadership hook, email gets a personalized subject line, social gets a visual-first treatment.',
      },
    ],
    roleId: 'marketing-ops',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, distribution was manual and channel-siloed — social teams, email marketers, and syndication managers each pushed content through their own tools and timelines.',
        detail: 'The same blog link was shared identically across channels. There was no native formatting per platform, no sequencing logic, and no way to coordinate paid amplification with organic distribution in real time.',
      },
      aiAgents: {
        summary: 'Distribution agents now push content across all channels with native formatting — each platform receives a tailored version based on channel benchmarks and media plan rules.',
        detail: 'The agent adapts content format per channel automatically — LinkedIn gets a thought-leadership hook, email gets personalized subject lines, social gets visual-first treatments. Distribution becomes a single coordinated operation instead of parallel manual efforts.',
      },
      aiAgentic: {
        summary: 'The agentic system orchestrates cross-channel distribution dynamically — adjusting sequence, pacing, and paid amplification based on real-time engagement signals.',
        detail: 'Distribution becomes responsive. If a social post gains unexpected traction, the system can accelerate email distribution or trigger additional paid amplification. Channel teams monitor and intervene rather than operate.',
      },
    },
  },

  /* ── MEASURE PHASE ─────────────────────────────────────── */

  'track-performance': {
    headline: 'Track Performance',
    lede: 'Real-time monitoring that compresses the time between signal and response.',
    blocks: [
      {
        type: 'tension',
        content: 'Without real-time tracking, content failures surface in the monthly report — weeks after you could have acted. By then, the campaign window has closed and the budget is spent.',
      },
    ],
    roleId: 'analytics-lead',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, performance tracking was a monthly reporting cycle — analytics teams compiled data from multiple platforms into spreadsheets weeks after publication.',
        detail: 'Marketing ops pulled data from GA, social platforms, email tools, and CRMs manually. By the time the report was assembled, the campaign window had often closed. Teams optimized based on stale data.',
      },
      aiAgents: {
        summary: 'Performance agents now monitor engagement, traffic, conversions, and social signals in real time across all channels simultaneously.',
        detail: 'The agent consolidates data that previously lived in separate dashboards into a unified view. Teams see performance signals within hours of publication rather than weeks, enabling mid-campaign adjustments.',
      },
      aiAgentic: {
        summary: 'The agentic system detects performance anomalies in real time and triggers automated responses — scaling paid spend on winners, adjusting distribution for underperformers.',
        detail: 'Tracking becomes active rather than passive. The system doesn\'t just report what happened — it identifies what\'s happening now and initiates corrective actions before teams even see the data.',
      },
    },
  },

  'generate-report': {
    headline: 'Generate Report',
    lede: 'Raw metrics compiled into actionable recommendations — not what happened, but what to do next.',
    blocks: [
      {
        type: 'quote',
        content: '"A report that tells you what happened is journalism. A report that tells you what to do next is strategy." — Analytics Lead',
      },
    ],
    roleId: 'analytics-lead',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, report generation consumed days of analyst time — pulling data from multiple platforms, formatting charts, and writing narrative summaries.',
        detail: 'Analytics teams, marketing ops, and campaign managers each contributed data and context. Reports were static documents that aged immediately. By the time stakeholders read them, the data was already outdated.',
      },
      aiAgents: {
        summary: 'Reporting agents now compile cross-platform performance data into structured, actionable reports with recommendations — not just metrics, but what to do next.',
        detail: 'The agent generates reports that previously took analysts days to produce. Human analysts review the recommendations and add strategic context, spending their time on interpretation rather than data assembly.',
      },
      aiAgentic: {
        summary: 'The agentic system generates reports continuously and proactively — surfacing insights and recommendations as data changes rather than on a fixed reporting schedule.',
        detail: 'Reports become living documents that update in real time. The system identifies when a performance shift is significant enough to warrant attention and pushes insights to the right stakeholders automatically.',
      },
    },
  },

  'attribution-modeling': {
    headline: 'Attribution Modeling',
    lede: 'Multi-touch attribution revealing which content drives pipeline — not just clicks.',
    blocks: [
      {
        type: 'before-after',
        content: 'Last-touch attribution gives all credit to the final asset before conversion. Top-of-funnel content looks like a cost center.',
        alt: 'Multi-touch attribution reveals awareness-stage content influenced the majority of closed deals. The blog post that "never converted" initiated the buying journey for your largest accounts.',
      },
    ],
    roleId: 'analytics-lead',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, attribution was either last-touch (misleading) or required data science teams weeks to build multi-touch models from raw data.',
        detail: 'Marketing, analytics, and finance teams debated attribution methodology endlessly. Simple last-touch models were easy but wrong. Proper multi-touch models required custom engineering that most organizations couldn\'t sustain.',
      },
      aiAgents: {
        summary: 'Attribution agents now run multi-touch models automatically — calculating content ROI by channel and segment without custom data science projects.',
        detail: 'The agent processes cross-platform journey data and produces attribution reports that reveal how content at each funnel stage contributes to pipeline. Teams make budget decisions based on real influence, not click counts.',
      },
      aiAgentic: {
        summary: 'The agentic system runs attribution models continuously and feeds results directly into content scoring, budget allocation, and campaign planning decisions.',
        detail: 'Attribution becomes a real-time input to the system rather than a periodic report. Content that proves its pipeline influence automatically receives more distribution investment. The feedback loop tightens from quarterly to daily.',
      },
    },
  },

  'executive-reporting': {
    headline: 'Executive Reporting',
    lede: 'Performance data synthesized for leadership — strategic recommendations, not operational details.',
    blocks: [
      {
        type: 'domino-effect',
        content: 'Executive reports feed directly back into campaign planning — closing the largest feedback loop in the system. When this loop is tight, the pipeline becomes a learning system. When it is slow, you are optimizing for last quarter\'s reality.',
      },
    ],
    roleId: 'analytics-lead',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, executive reporting was a multi-team effort — analysts, campaign managers, and marketing leaders spent days assembling quarterly decks for the CMO.',
        detail: 'Data came from analytics, creative provided case studies, ops supplied budget utilization, and strategy added narrative. The finished deck was a political document as much as an analytical one — shaped by which team controlled the narrative.',
      },
      aiAgents: {
        summary: 'Reporting agents now synthesize performance data, attribution results, and budget utilization into executive-ready dashboards automatically.',
        detail: 'The agent produces the analytical backbone that previously consumed multiple team-weeks per quarter. Human strategists add the interpretive layer — what the data means for strategy, where to double down, and what to stop.',
      },
      aiAgentic: {
        summary: 'The agentic system generates executive intelligence continuously — feeding performance insights directly into the next planning cycle without waiting for quarterly reviews.',
        detail: 'The feedback loop from performance to planning tightens from quarterly to weekly. The system identifies strategic shifts as they happen, enabling leadership to adjust direction in near-real time rather than retrospectively.',
      },
    },
  },

  /* ── OPTIMIZE PHASE ────────────────────────────────────── */

  'performance-review': {
    headline: 'Performance Review',
    lede: 'Evaluating content against original KPIs — optimize, iterate, or archive.',
    blocks: [
      {
        type: 'decision-tree',
        content: 'Optimize: Meets 60–80% of KPI targets. Tweak headlines, CTAs, or distribution. The asset is sound — it needs refinement, not reinvention.',
        alt: 'Iterate: Misses targets widely but topic has strategic value — send back to brief with new data. Archive: Performance declining and topic no longer strategic.',
      },
    ],
    roleId: 'analytics-lead',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, performance reviews happened in monthly or quarterly meetings — by the time teams decided to optimize, the content\'s peak window had often passed.',
        detail: 'Analytics leads, campaign managers, and content strategists debated performance in scheduled reviews. Decisions were slow and subjective, driven by whoever presented the most compelling narrative rather than systematic evaluation.',
      },
      aiAgents: {
        summary: 'Performance review agents now evaluate content against KPI targets automatically and recommend specific actions — optimize, iterate, or archive — with supporting data.',
        detail: 'The agent provides a structured assessment that teams can act on immediately. Decisions that previously required multi-stakeholder meetings now come with clear data-backed recommendations.',
      },
      aiAgentic: {
        summary: 'The agentic system continuously evaluates performance and auto-routes content to the appropriate action — optimization, iteration, or archival — based on predefined thresholds.',
        detail: 'Performance review becomes a continuous process rather than a periodic gate. Content that underperforms is flagged for action within days rather than waiting for the next review cycle.',
      },
    },
  },

  'optimize': {
    headline: 'Optimize',
    lede: 'Improving existing assets at a fraction of the cost of creating new ones.',
    blocks: [
      {
        type: 'before-after',
        content: 'Content is "one and done" — published, promoted once, forgotten.',
        alt: 'Top-performing content gets optimized iteratively. A single optimized piece can outperform three new pieces in pipeline contribution.',
      },
    ],
    roleId: 'marketing-ops',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, optimization was rare — content teams were too busy creating new assets to revisit and improve existing ones.',
        detail: 'When optimization happened, it was ad hoc. A writer might update a headline, an SEO specialist might refresh keywords, but systematic optimization across the content library was practically impossible at scale.',
      },
      aiAgents: {
        summary: 'Optimization agents now analyze performance data and generate specific improvement recommendations — updated headlines, refined CTAs, adjusted distribution mix.',
        detail: 'The agent identifies which content elements underperform and proposes data-driven fixes. Teams review and approve optimizations that previously would never have been attempted due to bandwidth constraints.',
      },
      aiAgentic: {
        summary: 'The agentic system optimizes content continuously and autonomously — testing headline variants, adjusting CTAs, and reallocating distribution based on real-time performance signals.',
        detail: 'Optimization becomes an always-on process. The system treats every published asset as a living document, continuously refining elements that underperform and scaling what works — without competing with new content production for human bandwidth.',
      },
    },
  },

  'archive-tag': {
    headline: 'Archive & Tag',
    lede: 'Turning individual assets into a searchable, composable knowledge base.',
    blocks: [
      {
        type: 'tension',
        content: 'Most content teams create assets faster than they organize them. Within two years, the library becomes a graveyard — thousands of assets, no one knows what exists, and new content is created because finding existing content takes longer than starting from scratch.',
      },
    ],
    roleId: 'context-engineer',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, content archival and tagging was a manual, neglected task — teams created assets faster than they could organize them.',
        detail: 'Content ops, librarians, and marketing coordinators tagged content inconsistently when they tagged it at all. Within a year, the content library became a graveyard — thousands of assets that nobody could find, leading to redundant creation.',
      },
      aiAgents: {
        summary: 'Governance agents now classify, tag, and archive content automatically using the content taxonomy — maintaining a searchable, composable knowledge base.',
        detail: 'The agent applies consistent taxonomy tags, generates reuse metadata, and maintains archive records without human effort. Content becomes discoverable, reducing redundant creation and enabling systematic reuse.',
      },
      aiAgentic: {
        summary: 'The agentic system maintains the content library as a living knowledge base — auto-tagging, detecting duplicates, suggesting reuse opportunities, and flagging content for retirement.',
        detail: 'Archival is no longer a step performed after production but a continuous process. The system identifies when new content requests overlap with existing assets, preventing redundant creation before it starts.',
      },
    },
  },

  'content-governance': {
    headline: 'Content Governance',
    lede: 'Content does not stay correct forever — governance catches decay before customers or regulators do.',
    blocks: [
      {
        type: 'scenario',
        content: 'A "2024 compliance guide" is still live in 2025 with outdated regulatory references. A product comparison references a discontinued competitor. A case study quotes a client now in litigation with your company.',
      },
    ],
    roleId: 'context-engineer',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, content governance was a periodic audit — legal, compliance, and content teams reviewed published assets on a quarterly (or annual) basis, if at all.',
        detail: 'Governance fell to whichever team noticed a problem first. Outdated regulatory references, discontinued product mentions, and stale statistics lived on websites for months. The effort required to audit a large content library manually was prohibitive.',
      },
      aiAgents: {
        summary: 'Governance agents now audit live content continuously — checking for regulatory currency, brand alignment drift, factual accuracy decay, and performance decline.',
        detail: 'The agent monitors the entire content library rather than waiting for periodic reviews. It flags content for refresh, retirement, or re-review based on predefined governance criteria, ensuring nothing ages silently into compliance risk.',
      },
      aiAgentic: {
        summary: 'The agentic system makes governance self-maintaining — automatically detecting when regulatory changes, brand updates, or factual shifts affect published content and queuing corrections.',
        detail: 'Governance becomes anticipatory rather than reactive. When a regulation changes, the system identifies every affected piece across the library and initiates updates before the compliance deadline — a capability impossible with manual audits.',
      },
    },
  },

  'governance-gate': {
    headline: 'Governance Gate',
    lede: 'The gate that makes the content operation self-maintaining.',
    blocks: [
      {
        type: 'decision-tree',
        content: 'Auto-pass: Content under 90 days old, no regulatory changes in its category, performance above decay threshold.',
        alt: 'Flag for review: Age threshold exceeded, regulatory landscape shifted, or performance declined. Triggers re-entry into the pipeline at the appropriate stage.',
      },
      {
        type: 'narrative',
        content: 'This is where agents commoditize and infrastructure compounds. The governance knowledge that accrues here — what ages well, what decays, what triggers regulatory exposure — improves every agent\'s output simultaneously. The pipeline does not just produce content. It learns.',
      },
    ],
    roleId: 'context-engineer',
    campaignJourney: {
      preAI: {
        summary: 'Before AI, governance gates existed in policy documents but were rarely enforced — the effort to systematically audit content against evolving criteria was too great.',
        detail: 'Legal, compliance, and content strategy teams agreed on governance rules but lacked the operational capacity to enforce them. Content aged past thresholds undetected, and governance reviews happened only after an incident.',
      },
      aiAgents: {
        summary: 'Governance gate agents now evaluate every published asset against current criteria — age thresholds, regulatory changes, performance decay — and route content to the appropriate action.',
        detail: 'The gate operates continuously rather than periodically. Content that passes criteria remains live. Content that fails triggers specific actions — refresh, retirement, or escalation — with clear reasoning and recommended next steps.',
      },
      aiAgentic: {
        summary: 'The agentic system turns the governance gate into a learning system — the knowledge of what ages well, what decays, and what triggers regulatory exposure improves every agent upstream.',
        detail: 'Governance intelligence feeds back into drafting, compliance, and planning agents. The pipeline doesn\'t just produce content — it learns from how content ages and uses those patterns to produce more durable assets from the start.',
      },
    },
  },
};
