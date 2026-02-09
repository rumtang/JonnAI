// Narrative content for each of the 31 campaign walkthrough nodes.
// Each entry provides unique storytelling blocks so the walkthrough
// reads like successive chapters, not repeated spreadsheet rows.

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

export interface StepNarrative {
  headline: string;
  lede: string;
  blocks: ContentBlock[];
  roleId: string;
}

export const STEP_NARRATIVES: Record<string, StepNarrative> = {
  /* ── 1. campaign-planning ─────────────────────────────── */
  'campaign-planning': {
    headline: 'Where Revenue Targets Meet Content Strategy',
    lede: 'Every content operation begins here — translating business objectives into a campaign architecture with defined audiences, channels, budgets, and KPIs.',
    blocks: [
      {
        type: 'scenario',
        content: 'Picture this: Q3 pipeline is 20% below target. The CMO needs a demand-gen campaign in four weeks. Without a structured planning step, the team scrambles — random assets, no journey logic, budget spread thin. With it, every downstream node inherits clear objectives.',
      },
      {
        type: 'metric',
        content: 'Teams with documented campaign plans produce 3x more pipeline-attributed content than those running ad hoc requests.',
      },
      {
        type: 'tip',
        content: 'Define your primary KPI before choosing channels. The channel mix should serve the metric, not the other way around.',
      },
    ],
    roleId: 'campaign-manager',
  },

  /* ── 2. journey-mapping ───────────────────────────────── */
  'journey-mapping': {
    headline: 'Mapping Content to the Buyer\'s Path',
    lede: 'Content that ignores journey stage talks to everyone and persuades no one. This step maps each asset to awareness, consideration, decision, retention, or advocacy.',
    blocks: [
      {
        type: 'narrative',
        content: 'Journey mapping connects CDP lifecycle data with your content taxonomy. The output is a coverage matrix showing where you have strong content, where gaps exist, and which journey stages are over-served with redundant assets.',
      },
      {
        type: 'before-after',
        content: 'Before: A blog post is published and promoted identically to cold prospects and existing customers.',
        alt: 'After: The same topic spawns three assets — a thought-leadership piece for awareness, a comparison guide for consideration, and a case study for decision.',
      },
    ],
    roleId: 'campaign-manager',
  },

  /* ── 3. receive-request ───────────────────────────────── */
  'receive-request': {
    headline: 'The Front Door of the Content Pipeline',
    lede: 'Every piece of content starts as a request. This step captures who wants it, why, for whom, and by when — preventing the chaos of undocumented asks.',
    blocks: [
      {
        type: 'tension',
        content: 'Without a structured intake, requests arrive via Slack, email, hallway conversations, and shared docs — each with different levels of detail. The production team becomes a translation layer, spending more time clarifying scope than creating content.',
      },
      {
        type: 'ai-handoff',
        content: 'AI pre-fills request fields from historical patterns and similar past briefs. The human reviews and adjusts — turning a 30-minute scoping call into a 5-minute confirmation.',
      },
    ],
    roleId: 'content-director',
  },

  /* ── 4. content-scoring ───────────────────────────────── */
  'content-scoring': {
    headline: 'Not All Requests Deserve Resources',
    lede: 'Content scoring ranks every incoming request against strategic priority, audience demand, resource cost, and expected ROI — triaging the production queue before work begins.',
    blocks: [
      {
        type: 'scenario',
        content: 'Picture this: Twelve requests land in the same sprint. Three are strategic priorities, four are "nice to have," and five are repeats of content that already exists. Without scoring, the loudest stakeholder wins. With it, data decides.',
      },
      {
        type: 'domino-effect',
        content: 'Skip scoring and low-impact content consumes the same resources as high-impact content. The result: your best writers spend cycles on a partner one-pager while a revenue-critical product launch brief waits in the queue.',
      },
      {
        type: 'metric',
        content: 'Organizations using content scoring report 40% fewer "wasted" assets — content produced but never activated or measured.',
      },
    ],
    roleId: 'content-director',
  },

  /* ── 5. research-insights ─────────────────────────────── */
  'research-insights': {
    headline: 'Grounding Every Brief in Evidence',
    lede: 'Research turns assumptions into data. The Research Agent synthesizes audience signals, competitive intelligence, and trending topics into brief-ready insights.',
    blocks: [
      {
        type: 'ai-handoff',
        content: 'The AI scans social listening feeds, SEO keyword trends, and competitor content in minutes. The human strategist interprets what the data means for positioning — which angle is differentiated, not just which keyword has volume.',
      },
      {
        type: 'quote',
        content: '"Every brief that skips research is a bet placed without looking at the odds." — Content Strategist perspective',
      },
    ],
    roleId: 'content-strategist',
  },

  /* ── 6. write-brief ───────────────────────────────────── */
  'write-brief': {
    headline: 'The Blueprint That Governs Everything Downstream',
    lede: 'A brief is not paperwork — it is the single document that aligns writers, designers, reviewers, and agents on what "done" looks like.',
    blocks: [
      {
        type: 'narrative',
        content: 'The brief captures objectives, target audience, key messages, format, distribution channels, and success metrics. Every downstream node — from drafting to performance review — references this document. A vague brief creates revision cycles. A sharp brief creates velocity.',
      },
      {
        type: 'tension',
        content: 'The most expensive content failures trace back to briefs, not drafts. A well-written draft against a misaligned brief is still a failure — it just takes longer to discover.',
      },
      {
        type: 'tip',
        content: 'Include a "this piece is NOT about" section in every brief. Defining scope exclusions prevents the most common cause of revision: stakeholders expecting content the brief never promised.',
      },
    ],
    roleId: 'content-director',
  },

  /* ── 7. brief-approval ────────────────────────────────── */
  'brief-approval': {
    headline: 'The Highest-Leverage Decision in the System',
    lede: 'Approving a brief commits the entire pipeline to an objective. This gate exists because changing direction after drafting costs 5x more than refining the brief.',
    blocks: [
      {
        type: 'decision-tree',
        content: 'Approve: Strategy score above 80%, required fields complete, audience clearly defined, and success metrics are measurable.',
        alt: 'Revise: Missing audience specificity, unclear differentiation from existing content, or KPIs that cannot be tracked with current tooling.',
      },
      {
        type: 'before-after',
        content: 'Before: Briefs are approved in hallway conversations. Writers discover misalignment at the draft stage. Average revision cycles: 3.2 per piece.',
        alt: 'After: Structured brief approval catches 80% of alignment issues before a single word is written. Revision cycles drop to 1.1.',
      },
    ],
    roleId: 'content-director',
  },

  /* ── 8. draft-content ─────────────────────────────────── */
  'draft-content': {
    headline: 'Where the Blank Page Becomes a First Draft',
    lede: 'The Content Writer agent transforms an approved brief into a structured first draft — following brand voice, hitting key messages, and maintaining the narrative arc the brief defined.',
    blocks: [
      {
        type: 'ai-handoff',
        content: 'The AI generates the initial draft from the brief, brand guide, and audience persona. The human editor will later refine what no algorithm reliably produces: narrative judgment, emotional nuance, and whether the piece says something genuinely worth reading.',
      },
      {
        type: 'scenario',
        content: 'Picture this: The brief calls for a technical explainer targeting engineering leaders. The agent drafts 1,200 words in 90 seconds, pulling from the brand voice guide and research insights. Without the agent, a writer spends two hours on the same draft. The quality difference? Marginal for technical content. The time savings? Transformative for throughput.',
      },
    ],
    roleId: 'creative-director',
  },

  /* ── 9. visual-asset-creation ─────────────────────────── */
  'visual-asset-creation': {
    headline: 'Design That Runs Parallel, Not Sequential',
    lede: 'Visual assets are created alongside the draft — not bolted on at the end. This parallel workflow means imagery is ready when copy is ready.',
    blocks: [
      {
        type: 'narrative',
        content: 'The Creative Director commissions hero images, infographics, social graphics, and video thumbnails based on the content brief. Each asset is designed for its target channel: dimensions, accessibility requirements, and brand visual language are baked in from the start.',
      },
      {
        type: 'tension',
        content: 'When visual creation is sequential — waiting until after the draft is approved — it becomes the bottleneck. Last-minute design requests produce generic stock-photo solutions instead of purposeful visual storytelling.',
      },
      {
        type: 'quote',
        content: '"The difference between visually compliant and visually compelling is the difference between content people scroll past and content they stop for." — Creative Director perspective',
      },
    ],
    roleId: 'creative-director',
  },

  /* ── 10. seo-optimization ─────────────────────────────── */
  'seo-optimization': {
    headline: 'Search Visibility Built In, Not Bolted On',
    lede: 'The SEO Optimizer agent handles keywords, meta descriptions, heading structure, and internal linking — ensuring the content is discoverable without sacrificing readability.',
    blocks: [
      {
        type: 'metric',
        content: 'Content optimized before publication ranks 68% faster than content retrofitted with SEO after launch. The first 48 hours of indexing establish signals that are expensive to overcome later.',
      },
      {
        type: 'ai-handoff',
        content: 'The AI handles the mechanical: keyword density, meta tag generation, schema markup, and internal link suggestions. The human ensures that optimization serves the reader — no keyword stuffing, no clickbait headings, no sacrificing narrative flow for search score.',
      },
    ],
    roleId: 'editor',
  },

  /* ── 11. quality-check ────────────────────────────────── */
  'quality-check': {
    headline: 'The Gate Where Technical Meets Editorial',
    lede: 'An automated quality gate checks readability, factual accuracy, and SEO score. When all thresholds pass, the content flows through automatically. When they don\'t, a human editor steps in.',
    blocks: [
      {
        type: 'decision-tree',
        content: 'Auto-pass: Readability score above 70, SEO score above 85, zero factual flags. Content proceeds to brand compliance without human review.',
        alt: 'Manual review: Any threshold missed triggers editor review. The most common failures: readability below threshold (jargon-heavy drafts) and factual flags (unsubstantiated claims).',
      },
      {
        type: 'domino-effect',
        content: 'A quality failure caught here costs one revision cycle. The same failure caught at stakeholder sign-off costs three cycles plus a trust deficit with the approver — they will scrutinize the next ten pieces more closely.',
      },
    ],
    roleId: 'editor',
  },

  /* ── 12. brand-compliance ─────────────────────────────── */
  'brand-compliance': {
    headline: 'Protecting the Brand Voice at Scale',
    lede: 'The Content Writer agent scans the draft against brand guidelines — tone, terminology, messaging consistency, and visual identity markers — flagging violations before human review.',
    blocks: [
      {
        type: 'scenario',
        content: 'Picture this: An agent-drafted blog post uses "cutting-edge" three times — a term the brand guide explicitly bans for being vague. Without automated compliance scanning, it reaches the Brand Manager who flags it manually. With it, the term is caught and suggested alternatives are offered before the draft leaves creation.',
      },
      {
        type: 'metric',
        content: 'Automated brand compliance scanning catches 92% of terminology violations and 78% of tone inconsistencies before human review, reducing Brand Manager review time by 60%.',
      },
      {
        type: 'tip',
        content: 'Maintain a living "banned terms" list alongside your brand guide. It is easier to check content against a prohibited list than against aspirational guidelines.',
      },
    ],
    roleId: 'brand-manager',
  },

  /* ── 13. brand-review ─────────────────────────────────── */
  'brand-review': {
    headline: 'Where Brand Judgment Cannot Be Automated',
    lede: 'The Brand Manager reviews content that passed automated scanning but requires human judgment — cultural context, competitive positioning nuance, and brand evolution decisions.',
    blocks: [
      {
        type: 'tension',
        content: 'Automated compliance catches rule violations. But brand is more than rules — it is how the audience feels about you. A piece can be 100% compliant and still feel off-brand because the cultural moment changed, a competitor shifted positioning, or the audience matured.',
      },
      {
        type: 'before-after',
        content: 'Before: The Brand Manager reviews every piece of content, spending 70% of their time on routine checks that surface no issues.',
        alt: 'After: Automated scanning handles routine compliance. The Brand Manager only sees content that genuinely needs judgment — exception-based review instead of assembly-line review.',
      },
    ],
    roleId: 'brand-manager',
  },

  /* ── 14. legal-review ─────────────────────────────────── */
  'legal-review': {
    headline: 'The Line Between Marketing and Liability',
    lede: 'Legal review screens content for regulatory compliance, IP risk, disclosure requirements, and claims substantiation — the stakes where "move fast" meets "move carefully."',
    blocks: [
      {
        type: 'ai-handoff',
        content: 'The Legal Screening Agent pre-scans for regulated terminology, unsubstantiated claims, missing disclosures, and competitor references. Legal Counsel reviews flagged items and genuine gray areas — the cases where precedent matters more than pattern matching.',
      },
      {
        type: 'domino-effect',
        content: 'A legal issue caught here pauses one content piece. The same issue published live triggers regulatory inquiry, PR crisis management, content takedown across all channels, and potential financial penalties. The asymmetry is extreme.',
      },
      {
        type: 'scenario',
        content: 'Picture this: A product comparison page implies competitor inferiority without substantiation. The Legal Screening Agent flags "market-leading" and "best-in-class" as unsubstantiated comparative claims. Legal Counsel reviews and requires either evidence or softer language. Total delay: 2 hours. Without this step? A competitor sends a cease-and-desist.',
      },
    ],
    roleId: 'legal-counsel',
  },

  /* ── 15. legal-compliance-gate ─────────────────────────── */
  'legal-compliance-gate': {
    headline: 'The Gate No Algorithm Can Override',
    lede: 'Legal sign-off is the one checkpoint where human authority is absolute. No agent, no auto-pass threshold, no urgency overrides a legal hold.',
    blocks: [
      {
        type: 'decision-tree',
        content: 'Auto-pass: No flagged claims, no regulated terms detected, disclosure checklist 100% complete. Content proceeds to final edit.',
        alt: 'Escalate: Any flagged regulatory term, unsubstantiated claim, or missing disclosure triggers Legal Counsel review. Escalation goes directly to stakeholder sign-off if risk is material.',
      },
      {
        type: 'quote',
        content: '"No agent in this system has the authority to override a legal hold. That is by design, not by limitation." — Legal Counsel perspective',
      },
    ],
    roleId: 'legal-counsel',
  },

  /* ── 16. final-edit ───────────────────────────────────── */
  'final-edit': {
    headline: 'The Last Human Touch Before the World Sees It',
    lede: 'The Editor refines narrative flow, checks facts, ensures coherence, and polishes the draft to the standard the brand name demands. This is where taste lives.',
    blocks: [
      {
        type: 'narrative',
        content: 'Final edit is not proofreading — it is the step where a skilled editor asks: does this piece actually say something worth reading? Is the argument coherent? Does the opening earn the reader\'s next paragraph? Agents handle readability scores. Editors handle whether writing resonates.',
      },
      {
        type: 'ai-handoff',
        content: 'AI agents have already handled readability scoring, SEO optimization, and factual checking upstream. The editor focuses on what machines consistently fail at: narrative judgment, emotional resonance, and the ineffable quality that separates adequate content from memorable content.',
      },
      {
        type: 'tip',
        content: 'Read the piece aloud. If a sentence makes you pause to parse its structure, the reader will abandon it. The editor\'s job is to make every sentence earn its place.',
      },
    ],
    roleId: 'editor',
  },

  /* ── 17. accessibility-check ──────────────────────────── */
  'accessibility-check': {
    headline: 'Content That Works for Everyone',
    lede: 'The Accessibility Agent verifies WCAG compliance, inclusive language, alt-text coverage, and screen reader compatibility — because content that excludes audiences is content that fails.',
    blocks: [
      {
        type: 'metric',
        content: '15% of the global population experiences some form of disability. Content that fails accessibility standards loses that audience entirely — and increasingly faces legal exposure under ADA and European Accessibility Act requirements.',
      },
      {
        type: 'before-after',
        content: 'Before: Accessibility is an afterthought — alt-text is "image.png," color contrast fails, and screen readers choke on decorative elements.',
        alt: 'After: Automated accessibility checking is a standard pipeline step. Alt-text is descriptive, contrast ratios pass WCAG AA, and every visual element has a text equivalent.',
      },
    ],
    roleId: 'editor',
  },

  /* ── 18. stakeholder-signoff ──────────────────────────── */
  'stakeholder-signoff': {
    headline: 'The Final Gate Before Content Goes Live',
    lede: 'The VP Marketing or client gives final approval — checking strategic alignment, brand positioning, and whether this content represents the organization the way leadership intends.',
    blocks: [
      {
        type: 'tension',
        content: 'Stakeholder time is the scarcest resource in the pipeline. Every gate upstream exists to filter content so that only decisions requiring executive judgment reach this point. When upstream gates work, this is a 5-minute review. When they fail, this becomes a bottleneck that delays entire campaigns.',
      },
      {
        type: 'decision-tree',
        content: 'Auto-pass: All upstream gates passed, content sensitivity score below threshold, no legal flags. Content proceeds to publication without executive review.',
        alt: 'Manual review: Content flagged as high-sensitivity, high-visibility, or involving new market positioning. The stakeholder reviews for strategic alignment — not editorial quality, which was settled upstream.',
      },
      {
        type: 'tip',
        content: 'If a stakeholder is consistently requesting editorial-level changes at this gate, the upstream quality and brand gates need recalibration. This gate is for strategy, not grammar.',
      },
    ],
    roleId: 'vp-marketing',
  },

  /* ── 19. localize-content ─────────────────────────────── */
  'localize-content': {
    headline: 'Same Message, Different Markets',
    lede: 'Localization adapts approved content for target markets — translation, cultural nuance, regional regulatory differences, and local visual standards. It is adaptation, not translation.',
    blocks: [
      {
        type: 'scenario',
        content: 'Picture this: A US-centric case study references baseball metaphors and dollar-denominated ROI figures. The Localization Agent adapts metaphors to locally resonant equivalents, converts currency, and flags that the regulatory disclosure valid in the US does not satisfy EU requirements. The Localization Manager reviews the cultural judgment calls.',
      },
      {
        type: 'ai-handoff',
        content: 'The AI handles mechanical translation, format adaptation, and regulatory checklist matching. The human reviews cultural subtleties — humor that does not translate, idioms that carry unintended meaning, and visual elements that require cultural sensitivity. This exception set is larger than most functions because cultural context is inherently ambiguous.',
      },
    ],
    roleId: 'localization-manager',
  },

  /* ── 20. localization-quality-gate ─────────────────────── */
  'localization-quality-gate': {
    headline: 'Quality Control Across Every Market',
    lede: 'The Localization Manager validates translation accuracy, cultural appropriateness, and local regulatory compliance before localized content enters the publication queue.',
    blocks: [
      {
        type: 'domino-effect',
        content: 'A cultural misstep in one market does not stay in one market. Social media amplifies regional failures globally. This gate can escalate to legal compliance, meaning a cultural flag in one locale can trigger legal review across all markets — preventing regional problems from becoming global crises.',
      },
      {
        type: 'metric',
        content: 'Translation confidence score threshold: 90%. Below that, the Localization Manager conducts manual review. Above it, content auto-passes — but cultural sensitivity flags always require human judgment regardless of confidence score.',
      },
    ],
    roleId: 'localization-manager',
  },

  /* ── 21. schedule-publish ─────────────────────────────── */
  'schedule-publish': {
    headline: 'Timing Is Half the Strategy',
    lede: 'Setting the publication date, configuring the CMS, and pushing content live. When content publishes matters almost as much as what it says.',
    blocks: [
      {
        type: 'narrative',
        content: 'Schedule and publish coordinates the CMS configuration, publication timing, and channel-specific launch sequences. Cross-channel orchestration rules determine whether email goes before social, whether gated content precedes ungated, and when paid amplification triggers.',
      },
      {
        type: 'tip',
        content: 'Never publish on Friday afternoon. Your monitoring team is weakest when problems are most likely to go unnoticed. Tuesday and Wednesday mornings consistently show the highest engagement across B2B channels.',
      },
      {
        type: 'metric',
        content: 'Content published during optimal channel windows sees 23% higher first-48-hour engagement than identical content published off-schedule. The content is the same — only the timing changes.',
      },
    ],
    roleId: 'marketing-ops',
  },

  /* ── 22. distribute ───────────────────────────────────── */
  'distribute': {
    headline: 'Getting Content Where Audiences Actually Are',
    lede: 'Distribution pushes content across social, email, syndication, and paid channels — each with its own format, timing, and audience expectations.',
    blocks: [
      {
        type: 'before-after',
        content: 'Before: The same blog link is shared identically on LinkedIn, Twitter, email, and Slack. One format, one message, every channel.',
        alt: 'After: Each channel gets a native-feeling format — LinkedIn gets a thought-leadership hook, email gets a personalized subject line, social gets a visual-first treatment, and syndication gets an optimized excerpt.',
      },
      {
        type: 'scenario',
        content: 'Picture this: A product launch campaign distributes across six channels in a coordinated sequence: analyst-targeted email at 7 AM, LinkedIn thought leadership at 9 AM, blog publication at 10 AM, social promotion at noon, paid amplification starting at 2 PM, and sales enablement alert at 3 PM. Each channel builds on the previous one.',
      },
    ],
    roleId: 'marketing-ops',
  },

  /* ── 23. track-performance ────────────────────────────── */
  'track-performance': {
    headline: 'The Feedback Loop That Makes the System Learn',
    lede: 'Real-time performance monitoring tracks engagement, traffic, conversions, and social signals — turning every published piece into data that improves the next one.',
    blocks: [
      {
        type: 'ai-handoff',
        content: 'The Performance Analyst agent monitors metrics continuously and flags underperformers against defined thresholds. The human Analytics Lead interprets what the data means for strategy — why something underperformed matters more than the fact that it did.',
      },
      {
        type: 'tension',
        content: 'Without real-time tracking, you discover content failures in the monthly report — weeks after you could have acted. By then, the campaign window has closed and the budget is spent. Performance tracking exists to compress the time between signal and response.',
      },
    ],
    roleId: 'analytics-lead',
  },

  /* ── 24. generate-report ──────────────────────────────── */
  'generate-report': {
    headline: 'Data Becomes Decisions',
    lede: 'The Performance Analyst agent compiles raw metrics into an actionable report — not just what happened, but what to do about it.',
    blocks: [
      {
        type: 'narrative',
        content: 'Report generation transforms continuous tracking data into structured recommendations. The output is not a dashboard — it is a prioritized action list: which content to boost, which to revise, which channels to reallocate budget toward, and which experiments to run next.',
      },
      {
        type: 'metric',
        content: 'Teams using AI-generated performance reports make optimization decisions 4x faster than teams relying on manual analysis. The speed advantage compounds — faster decisions mean more iteration cycles within the same campaign window.',
      },
      {
        type: 'quote',
        content: '"A report that tells you what happened is journalism. A report that tells you what to do next is strategy." — Analytics Lead perspective',
      },
    ],
    roleId: 'analytics-lead',
  },

  /* ── 25. attribution-modeling ──────────────────────────── */
  'attribution-modeling': {
    headline: 'Tracing Revenue Back to Content',
    lede: 'Multi-touch attribution models calculate content ROI by channel and segment, revealing which content actually drives pipeline — not just which content gets clicks.',
    blocks: [
      {
        type: 'before-after',
        content: 'Before: Attribution is last-touch — the final asset before conversion gets all the credit. Top-of-funnel content looks like a cost center.',
        alt: 'After: Multi-touch attribution reveals that awareness-stage content influenced 60% of closed deals. The blog post that "never converted anyone" actually initiated the buying journey for your largest accounts.',
      },
      {
        type: 'tension',
        content: 'Attribution modeling is politically charged. It redistributes credit — and therefore budget — across the content portfolio. Teams that own high-attribution content gain resources. Teams that own low-attribution content face hard questions. The model must be defensible because it will be challenged.',
      },
    ],
    roleId: 'analytics-lead',
  },

  /* ── 26. executive-reporting ──────────────────────────── */
  'executive-reporting': {
    headline: 'Speaking the Language of the C-Suite',
    lede: 'Executive reporting synthesizes performance data, attribution results, and budget utilization into a dashboard designed for leadership — strategic recommendations, not operational details.',
    blocks: [
      {
        type: 'scenario',
        content: 'Picture this: The CMO has 10 minutes before a board meeting. The executive report shows three things: content-sourced pipeline is up 18%, cost-per-lead dropped 22% from the previous quarter, and two campaigns are underperforming their ROI targets with recommended reallocation. No jargon, no vanity metrics, no 40-slide deck.',
      },
      {
        type: 'tip',
        content: 'Lead with the number the executive cares about most — usually pipeline contribution or cost efficiency. Bury engagement metrics in the appendix. Executives fund outcomes, not impressions.',
      },
      {
        type: 'domino-effect',
        content: 'Executive reports that reach the CMO feed directly back into campaign planning — closing the largest feedback loop in the system. When this loop is tight, the pipeline becomes a learning system. When it is slow, you are always optimizing for last quarter\'s reality.',
      },
    ],
    roleId: 'analytics-lead',
  },

  /* ── 27. performance-review ───────────────────────────── */
  'performance-review': {
    headline: 'The Gate That Closes the Loop',
    lede: 'Performance review evaluates content against its original KPIs and decides the next action: optimize, iterate with a new brief, or archive. This is where the pipeline becomes a cycle.',
    blocks: [
      {
        type: 'decision-tree',
        content: 'Optimize: Content meets 60-80% of KPI targets. Tweak headlines, CTAs, or distribution mix. The asset is fundamentally sound — it needs refinement, not reinvention.',
        alt: 'Iterate: Content misses KPI targets by a wide margin, but the topic has strategic value. Send back to brief stage with new data. Archive: Content has run its course — performance is declining and the topic is no longer strategic.',
      },
      {
        type: 'narrative',
        content: 'This gate can send content all the way back to a new brief — restarting the entire pipeline with updated data. That feedback loop is what makes the system learn. Without it, the pipeline is a conveyor belt: content goes in one end and comes out the other with no memory of what worked.',
      },
    ],
    roleId: 'analytics-lead',
  },

  /* ── 28. optimize ─────────────────────────────────────── */
  'optimize': {
    headline: 'Making Good Content Better',
    lede: 'Optimization updates headlines, CTAs, distribution mix, or repurposes content based on performance data. It is the most cost-effective step in the pipeline — improving existing assets costs a fraction of creating new ones.',
    blocks: [
      {
        type: 'before-after',
        content: 'Before: Content is "one and done" — published, promoted once, and forgotten. The team moves to the next brief.',
        alt: 'After: Top-performing content gets optimized iteratively — updated headlines, refreshed CTAs, expanded distribution. A single optimized piece can outperform three new pieces in pipeline contribution.',
      },
      {
        type: 'ai-handoff',
        content: 'AI agents test headline variants, CTA alternatives, and distribution timing automatically. The human decides when to iterate versus start over — a system-level judgment call that requires understanding whether the problem is execution or strategy.',
      },
      {
        type: 'metric',
        content: 'Optimized content generates 2.5x the ROI of net-new content on a per-dollar basis. The research, brief, and approval work is already done. Optimization captures residual value at marginal cost.',
      },
    ],
    roleId: 'marketing-ops',
  },

  /* ── 29. archive-tag ──────────────────────────────────── */
  'archive-tag': {
    headline: 'Building the Content Library That Compounds',
    lede: 'Archive and tag classifies content into the taxonomy for future discovery, reuse, and governance — turning individual assets into a searchable, composable knowledge base.',
    blocks: [
      {
        type: 'narrative',
        content: 'Archiving is not retirement — it is curation. Properly tagged content becomes discoverable for future campaigns, repurposing, and governance reporting. The content taxonomy transforms a folder of files into a structured library where every asset is findable by topic, audience, journey stage, and performance tier.',
      },
      {
        type: 'tension',
        content: 'Most content teams create assets faster than they organize them. Within two years, the content library becomes a graveyard — thousands of assets, no one knows what exists, and new content is created because finding existing content takes longer than starting from scratch.',
      },
    ],
    roleId: 'context-engineer',
  },

  /* ── 30. content-governance ───────────────────────────── */
  'content-governance': {
    headline: 'Keeping Live Content Honest',
    lede: 'Governance reviews live content for accuracy decay, regulatory currency, brand alignment drift, and performance decline — because content does not stay correct forever.',
    blocks: [
      {
        type: 'scenario',
        content: 'Picture this: A "2024 compliance guide" is still live in 2025 with outdated regulatory references. A product comparison page references a competitor product that was discontinued. A case study quotes a client who is now in litigation with your company. Governance catches these before customers or regulators do.',
      },
      {
        type: 'domino-effect',
        content: 'Outdated content erodes trust silently. Prospects who encounter inaccurate content do not complain — they leave. The damage is invisible in analytics because you cannot measure the visits that never converted due to stale information.',
      },
      {
        type: 'tip',
        content: 'Set automated governance triggers: content older than 90 days gets flagged for review, content with declining traffic gets reviewed for relevance, and any regulatory change in a content category triggers immediate review of all assets in that category.',
      },
    ],
    roleId: 'context-engineer',
  },

  /* ── 31. governance-gate ──────────────────────────────── */
  'governance-gate': {
    headline: 'The System That Maintains Itself',
    lede: 'The governance gate validates that all live content remains current, compliant, and brand-aligned — triggering refresh, retirement, or re-review cycles as needed.',
    blocks: [
      {
        type: 'decision-tree',
        content: 'Auto-pass: Content is less than 90 days old, no regulatory changes detected in its category, and performance remains above decay threshold.',
        alt: 'Flag for review: Content exceeds age threshold, regulatory landscape has shifted, or performance has declined below the minimum. Triggers re-entry into the pipeline at the appropriate stage — sometimes a quick refresh, sometimes a full re-brief.',
      },
      {
        type: 'quote',
        content: '"This role does not exist in most organizations today. It emerges when you think about AI as a system that needs structured context to reason well." — Context Engineer perspective',
      },
      {
        type: 'narrative',
        content: 'The governance gate is what makes the content operation self-maintaining. Without it, the pipeline produces new content while old content quietly decays. With it, every asset in the library is continuously validated — and the system gets smarter with each governance cycle because it accumulates knowledge about what ages well and what does not.',
      },
    ],
    roleId: 'context-engineer',
  },
};
