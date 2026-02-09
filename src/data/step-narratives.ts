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
    headline: 'Campaign Planning',
    lede: 'Where revenue targets meet content strategy. Every content operation begins here — translating business objectives into a campaign architecture with defined audiences, channels, budgets, and KPIs.',
    blocks: [
      {
        type: 'scenario',
        content: 'Q3 pipeline is 20% below target. The CMO needs a demand-gen campaign in four weeks. Without a structured planning step, the team scrambles — random assets, no journey logic, budget spread thin. With it, every downstream node inherits clear objectives.',
      },
      {
        type: 'metric',
        content: 'Teams with documented campaign plans produce significantly more pipeline-attributed content than those running ad hoc requests — the multiplier is typically 2–3x.',
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
    headline: 'Journey Stage Mapping',
    lede: 'Mapping content to the buyer\'s path. Content that ignores journey stage talks to everyone and persuades no one — this step maps each asset to awareness, consideration, decision, retention, or advocacy.',
    blocks: [
      {
        type: 'narrative',
        content: 'Journey mapping connects CDP lifecycle data with your content taxonomy. The output is a coverage matrix: where you have strong content, where gaps exist, and which stages are over-served with redundant assets.',
      },
      {
        type: 'before-after',
        content: 'A blog post is published and promoted identically to cold prospects and existing customers.',
        alt: 'The same topic spawns three assets — a thought-leadership piece for awareness, a comparison guide for consideration, and a case study for decision.',
      },
    ],
    roleId: 'campaign-manager',
  },

  /* ── 3. receive-request ───────────────────────────────── */
  'receive-request': {
    headline: 'Receive Request',
    lede: 'The front door of the content pipeline. Every piece of content starts as a request — this step captures who wants it, why, for whom, and by when, preventing the chaos of undocumented asks.',
    blocks: [
      {
        type: 'tension',
        content: 'Without structured intake, requests arrive via Slack, email, hallway conversations, and shared docs — each with different levels of detail. The production team becomes a translation layer, spending more time clarifying scope than creating content.',
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
    headline: 'Content Scoring & Prioritization',
    lede: 'Not all requests deserve resources. Scoring ranks every incoming request against strategic priority, audience demand, resource cost, and expected ROI — triaging the production queue before work begins.',
    blocks: [
      {
        type: 'scenario',
        content: 'Twelve requests land in the same sprint. Three are strategic priorities, four are nice-to-haves, and five are repeats of content that already exists. Without scoring, the loudest stakeholder wins. With it, data decides.',
      },
      {
        type: 'domino-effect',
        content: 'Skip scoring and low-impact content consumes the same resources as high-impact content. Your best writers spend cycles on a partner one-pager while a revenue-critical product launch brief waits in the queue.',
      },
    ],
    roleId: 'content-director',
  },

  /* ── 5. research-insights ─────────────────────────────── */
  'research-insights': {
    headline: 'Research & Insights',
    lede: 'Grounding every brief in evidence. Research turns assumptions into data — the Research Agent synthesizes audience signals, competitive intelligence, and trending topics into brief-ready insights.',
    blocks: [
      {
        type: 'ai-handoff',
        content: 'The Research Agent scans social listening feeds, SEO keyword trends, and competitor content in minutes. The human strategist interprets what the data means for positioning — which angle is differentiated, not just which keyword has volume.',
      },
      {
        type: 'quote',
        content: '"Every brief that skips research is a bet placed without looking at the odds." — Content Strategist',
      },
    ],
    roleId: 'content-strategist',
  },

  /* ── 6. write-brief ───────────────────────────────────── */
  'write-brief': {
    headline: 'Write Brief',
    lede: 'The blueprint that governs everything downstream. A brief is not paperwork — it is the single document that aligns writers, designers, reviewers, and agents on what "done" looks like.',
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
    headline: 'Brief Approval',
    lede: 'The highest-leverage decision in the system. Approving a brief commits the entire pipeline to an objective — changing direction after drafting costs 5x more than refining the brief.',
    blocks: [
      {
        type: 'decision-tree',
        content: 'Approve: Strategy score above threshold, required fields complete, audience clearly defined, success metrics measurable.',
        alt: 'Revise: Missing audience specificity, unclear differentiation from existing content, or KPIs that cannot be tracked with current tooling.',
      },
      {
        type: 'before-after',
        content: 'Briefs are approved in hallway conversations. Writers discover misalignment at the draft stage. Average revision cycles: 3+ per piece.',
        alt: 'Structured brief approval catches the majority of alignment issues before a single word is written. Revision cycles drop below 1.5.',
      },
    ],
    roleId: 'content-director',
  },

  /* ── 8. draft-content ─────────────────────────────────── */
  'draft-content': {
    headline: 'Draft Content',
    lede: 'Where the blank page becomes a first draft. The Content Writer agent transforms an approved brief into structured prose — following brand voice, hitting key messages, and maintaining the narrative arc the brief defined.',
    blocks: [
      {
        type: 'ai-handoff',
        content: 'The agent generates the initial draft from the brief, brand guide, and audience persona. The human editor refines what no algorithm reliably produces: narrative judgment, emotional nuance, and whether the piece says something genuinely worth reading.',
      },
      {
        type: 'scenario',
        content: 'The brief calls for a technical explainer targeting engineering leaders. The agent drafts 1,200 words in 90 seconds, pulling from the brand voice guide and research insights. A writer would spend two hours on the same draft. The quality difference on technical content is marginal. The throughput difference is transformative.',
      },
    ],
    roleId: 'creative-director',
  },

  /* ── 9. visual-asset-creation ─────────────────────────── */
  'visual-asset-creation': {
    headline: 'Visual Asset Creation',
    lede: 'Design that runs parallel, not sequential. Visual assets are created alongside the draft — not bolted on at the end — so imagery is ready when copy is ready.',
    blocks: [
      {
        type: 'narrative',
        content: 'The Creative Director commissions hero images, infographics, social graphics, and video thumbnails based on the content brief. Each asset is designed for its target channel: dimensions, accessibility requirements, and brand visual language are baked in from the start.',
      },
      {
        type: 'tension',
        content: 'When visual creation waits until after draft approval, it becomes the bottleneck. Last-minute design requests produce generic stock-photo solutions instead of purposeful visual storytelling.',
      },
    ],
    roleId: 'creative-director',
  },

  /* ── 10. seo-optimization ─────────────────────────────── */
  'seo-optimization': {
    headline: 'SEO Optimization',
    lede: 'Search visibility built in, not bolted on. The SEO Optimizer agent handles keywords, meta descriptions, heading structure, and internal linking — ensuring discoverability without sacrificing readability.',
    blocks: [
      {
        type: 'metric',
        content: 'Content optimized before publication ranks significantly faster than content retrofitted with SEO after launch. The first 48 hours of indexing establish signals that are expensive to overcome later.',
      },
      {
        type: 'ai-handoff',
        content: 'The agent handles keyword density, meta tag generation, schema markup, and internal link suggestions. The human ensures optimization serves the reader — no keyword stuffing, no clickbait headings, no sacrificing narrative flow for a search score.',
      },
    ],
    roleId: 'editor',
  },

  /* ── 11. quality-check ────────────────────────────────── */
  'quality-check': {
    headline: 'Quality Check',
    lede: 'The gate where technical meets editorial. An automated quality gate checks readability, factual accuracy, and SEO score — when all thresholds pass, content flows through automatically.',
    blocks: [
      {
        type: 'decision-tree',
        content: 'Auto-pass: Readability score above 70, SEO score above 85, zero factual flags. Content proceeds to brand compliance without human review.',
        alt: 'Manual review: Any threshold missed triggers editor review. Most common failures: readability below threshold (jargon-heavy drafts) and factual flags (unsubstantiated claims).',
      },
      {
        type: 'domino-effect',
        content: 'A quality failure caught here costs one revision cycle. The same failure caught at stakeholder sign-off costs three cycles plus a trust deficit — the approver will scrutinize the next ten pieces more closely.',
      },
    ],
    roleId: 'editor',
  },

  /* ── 12. brand-compliance ─────────────────────────────── */
  'brand-compliance': {
    headline: 'Brand Compliance',
    lede: 'Protecting the brand voice at scale. The Content Writer agent scans drafts against brand guidelines — tone, terminology, messaging consistency — flagging violations before human review.',
    blocks: [
      {
        type: 'scenario',
        content: 'An agent-drafted blog post uses "cutting-edge" three times — a term the brand guide explicitly bans for being vague. Without automated scanning, the Brand Manager catches it manually during review. With it, the term is flagged and alternatives suggested before the draft ever leaves creation.',
      },
      {
        type: 'tip',
        content: 'Maintain a living "banned terms" list alongside your brand guide. Checking content against a prohibited list is faster and more reliable than checking against aspirational guidelines.',
      },
    ],
    roleId: 'brand-manager',
  },

  /* ── 13. brand-review ─────────────────────────────────── */
  'brand-review': {
    headline: 'Brand Review',
    lede: 'Where brand judgment cannot be automated. The Brand Manager reviews content that requires human interpretation — cultural context, competitive positioning nuance, and brand evolution decisions that no rule set captures.',
    blocks: [
      {
        type: 'tension',
        content: 'A piece can be 100% compliant and still feel off-brand because the cultural moment changed, a competitor shifted positioning, or the audience matured. Brand is how the audience feels about you — and that cannot be reduced to a checklist.',
      },
      {
        type: 'before-after',
        content: 'The Brand Manager reviews every piece of content, spending 70% of their time on routine checks that surface no issues.',
        alt: 'Automated scanning upstream handles routine compliance. The Brand Manager only sees content that genuinely needs judgment — exception-based review instead of assembly-line review.',
      },
    ],
    roleId: 'brand-manager',
  },

  /* ── 14. legal-review ─────────────────────────────────── */
  'legal-review': {
    headline: 'Legal Review',
    lede: 'The line between marketing and liability. Legal review screens content for regulatory compliance, IP risk, disclosure requirements, and claims substantiation — where "move fast" meets "move carefully."',
    blocks: [
      {
        type: 'ai-handoff',
        content: 'The Legal Screening Agent pre-scans for regulated terminology, unsubstantiated claims, missing disclosures, and competitor references. Legal Counsel reviews the flagged items and genuine gray areas — cases where precedent matters more than pattern matching.',
      },
      {
        type: 'domino-effect',
        content: 'A legal issue caught here pauses one content piece. The same issue published live triggers regulatory inquiry, PR crisis management, content takedown across all channels, and potential financial penalties. The asymmetry is extreme.',
      },
    ],
    roleId: 'legal-counsel',
  },

  /* ── 15. legal-compliance-gate ─────────────────────────── */
  'legal-compliance-gate': {
    headline: 'Legal Compliance Gate',
    lede: 'The gate no algorithm can override. Legal sign-off is the one checkpoint where human authority is absolute — no agent, no auto-pass threshold, no urgency overrides a legal hold.',
    blocks: [
      {
        type: 'decision-tree',
        content: 'Auto-pass: No flagged claims, no regulated terms detected, disclosure checklist 100% complete. Content proceeds to final edit.',
        alt: 'Escalate: Any flagged regulatory term, unsubstantiated claim, or missing disclosure triggers Legal Counsel review. Escalation goes directly to stakeholder sign-off if risk is material.',
      },
      {
        type: 'quote',
        content: '"No agent in this system has the authority to override a legal hold. That is by design, not by limitation." — Legal Counsel',
      },
    ],
    roleId: 'legal-counsel',
  },

  /* ── 16. final-edit ───────────────────────────────────── */
  'final-edit': {
    headline: 'Final Edit',
    lede: 'The last human touch before the world sees it. The Editor refines narrative flow, checks facts, ensures coherence, and polishes the draft to the standard the brand demands. This is where taste lives.',
    blocks: [
      {
        type: 'narrative',
        content: 'Final edit is not proofreading. It is the step where a skilled editor asks: does this piece actually say something worth reading? Is the argument coherent? Does the opening earn the reader\'s next paragraph? Agents handle readability scores. Editors handle whether writing resonates.',
      },
      {
        type: 'ai-handoff',
        content: 'Readability scoring, SEO optimization, and factual checking are already handled upstream. The editor focuses on what machines consistently miss: narrative judgment, emotional resonance, and the ineffable quality that separates adequate content from memorable content.',
      },
    ],
    roleId: 'editor',
  },

  /* ── 17. accessibility-check ──────────────────────────── */
  'accessibility-check': {
    headline: 'Accessibility Check',
    lede: 'Content that works for everyone. The Accessibility Agent verifies WCAG compliance, inclusive language, alt-text coverage, and screen reader compatibility — because content that excludes audiences is content that fails.',
    blocks: [
      {
        type: 'metric',
        content: '15% of the global population experiences some form of disability. Content that fails accessibility standards loses that audience entirely — and increasingly faces legal exposure under ADA and European Accessibility Act requirements.',
      },
      {
        type: 'before-after',
        content: 'Accessibility is an afterthought — alt-text reads "image.png," color contrast fails, and screen readers choke on decorative elements.',
        alt: 'Automated accessibility checking is a standard pipeline step. Alt-text is descriptive, contrast ratios pass WCAG AA, and every visual element has a text equivalent.',
      },
    ],
    roleId: 'editor',
  },

  /* ── 18. stakeholder-signoff ──────────────────────────── */
  'stakeholder-signoff': {
    headline: 'Stakeholder Sign-off',
    lede: 'The final gate before content goes live. The VP Marketing or client gives final approval — checking strategic alignment, brand positioning, and whether this content represents the organization the way leadership intends.',
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
    ],
    roleId: 'vp-marketing',
  },

  /* ── 19. localize-content ─────────────────────────────── */
  'localize-content': {
    headline: 'Localize Content',
    lede: 'Same message, different markets. Localization adapts approved content for target markets — translation, cultural nuance, regional regulatory differences, and local visual standards. Adaptation, not translation.',
    blocks: [
      {
        type: 'scenario',
        content: 'A US-centric case study references baseball metaphors and dollar-denominated ROI figures. The Localization Agent adapts metaphors to locally resonant equivalents, converts currency, and flags that the US regulatory disclosure does not satisfy EU requirements. The Localization Manager reviews the cultural judgment calls.',
      },
      {
        type: 'ai-handoff',
        content: 'Mechanical translation, format adaptation, and regulatory checklist matching are handled by the agent. The human reviews cultural subtleties — humor that misfires across borders, idioms that carry unintended meaning, and visual elements that require cultural sensitivity.',
      },
    ],
    roleId: 'localization-manager',
  },

  /* ── 20. localization-quality-gate ─────────────────────── */
  'localization-quality-gate': {
    headline: 'Localization Quality Gate',
    lede: 'Quality control across every market. The Localization Manager validates translation accuracy, cultural appropriateness, and local regulatory compliance before localized content enters the publication queue.',
    blocks: [
      {
        type: 'domino-effect',
        content: 'A cultural misstep in one market does not stay in one market. Social media amplifies regional failures globally. This gate can escalate to legal compliance — a cultural flag in one locale can trigger legal review across all markets, preventing regional problems from becoming global crises.',
      },
      {
        type: 'metric',
        content: 'Below the translation confidence threshold, the Localization Manager conducts manual review. Above it, content auto-passes — but cultural sensitivity flags always require human judgment regardless of confidence score.',
      },
    ],
    roleId: 'localization-manager',
  },

  /* ── 21. schedule-publish ─────────────────────────────── */
  'schedule-publish': {
    headline: 'Schedule & Publish',
    lede: 'Timing is half the strategy. When content publishes matters almost as much as what it says — this step coordinates publication date, CMS configuration, and channel-specific launch sequences.',
    blocks: [
      {
        type: 'narrative',
        content: 'Cross-channel orchestration rules determine whether email goes before social, whether gated content precedes ungated, and when paid amplification triggers. The sequence is the strategy.',
      },
      {
        type: 'metric',
        content: 'Content published during optimal channel windows sees measurably higher first-48-hour engagement than identical content published off-schedule. The content is the same — only the timing changes.',
      },
    ],
    roleId: 'marketing-ops',
  },

  /* ── 22. distribute ───────────────────────────────────── */
  'distribute': {
    headline: 'Distribute',
    lede: 'Getting content where audiences actually are. Distribution pushes content across social, email, syndication, and paid channels — each with its own format, timing, and audience expectations.',
    blocks: [
      {
        type: 'before-after',
        content: 'The same blog link is shared identically on LinkedIn, Twitter, email, and Slack. One format, one message, every channel.',
        alt: 'Each channel gets a native-feeling format — LinkedIn gets a thought-leadership hook, email gets a personalized subject line, social gets a visual-first treatment, and syndication gets an optimized excerpt.',
      },
      {
        type: 'scenario',
        content: 'A product launch distributes across six channels in a coordinated sequence: analyst-targeted email at 7 AM, LinkedIn thought leadership at 9 AM, blog publication at 10 AM, social promotion at noon, paid amplification at 2 PM, sales enablement alert at 3 PM. Each channel builds on the previous.',
      },
    ],
    roleId: 'marketing-ops',
  },

  /* ── 23. track-performance ────────────────────────────── */
  'track-performance': {
    headline: 'Track Performance',
    lede: 'The feedback loop that makes the system learn. Real-time performance monitoring tracks engagement, traffic, conversions, and social signals — turning every published piece into data that improves the next one.',
    blocks: [
      {
        type: 'ai-handoff',
        content: 'The Performance Analyst agent monitors metrics continuously and flags underperformers against defined thresholds. The Analytics Lead interprets what the data means for strategy — why something underperformed matters more than the fact that it did.',
      },
      {
        type: 'tension',
        content: 'Without real-time tracking, content failures surface in the monthly report — weeks after you could have acted. By then, the campaign window has closed and the budget is spent. This step exists to compress the time between signal and response.',
      },
    ],
    roleId: 'analytics-lead',
  },

  /* ── 24. generate-report ──────────────────────────────── */
  'generate-report': {
    headline: 'Generate Report',
    lede: 'Data becomes decisions. The Performance Analyst agent compiles raw metrics into actionable recommendations — not just what happened, but what to do about it.',
    blocks: [
      {
        type: 'narrative',
        content: 'The output is not a dashboard — it is a prioritized action list: which content to boost, which to revise, which channels to reallocate budget toward, and which experiments to run next.',
      },
      {
        type: 'quote',
        content: '"A report that tells you what happened is journalism. A report that tells you what to do next is strategy." — Analytics Lead',
      },
    ],
    roleId: 'analytics-lead',
  },

  /* ── 25. attribution-modeling ──────────────────────────── */
  'attribution-modeling': {
    headline: 'Attribution Modeling',
    lede: 'Tracing revenue back to content. Multi-touch attribution calculates content ROI by channel and segment, revealing which content actually drives pipeline — not just which content gets clicks.',
    blocks: [
      {
        type: 'before-after',
        content: 'Attribution is last-touch — the final asset before conversion gets all the credit. Top-of-funnel content looks like a cost center.',
        alt: 'Multi-touch attribution reveals that awareness-stage content influenced the majority of closed deals. The blog post that "never converted anyone" actually initiated the buying journey for your largest accounts.',
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
    headline: 'Executive Reporting',
    lede: 'Speaking the language of the C-suite. Executive reporting synthesizes performance data, attribution results, and budget utilization into a view designed for leadership — strategic recommendations, not operational details.',
    blocks: [
      {
        type: 'scenario',
        content: 'The CMO has 10 minutes before a board meeting. The executive report shows three things: content-sourced pipeline is up, cost-per-lead dropped from the previous quarter, and two campaigns are underperforming their ROI targets with recommended reallocation. No jargon, no vanity metrics, no 40-slide deck.',
      },
      {
        type: 'domino-effect',
        content: 'Executive reports feed directly back into campaign planning — closing the largest feedback loop in the system. When this loop is tight, the pipeline becomes a learning system. When it is slow, you are always optimizing for last quarter\'s reality.',
      },
    ],
    roleId: 'analytics-lead',
  },

  /* ── 27. performance-review ───────────────────────────── */
  'performance-review': {
    headline: 'Performance Review',
    lede: 'The gate that closes the loop. Performance review evaluates content against its original KPIs and decides the next action: optimize, iterate with a new brief, or archive. This is where the pipeline becomes a cycle.',
    blocks: [
      {
        type: 'decision-tree',
        content: 'Optimize: Content meets 60–80% of KPI targets. Tweak headlines, CTAs, or distribution mix. The asset is fundamentally sound — it needs refinement, not reinvention.',
        alt: 'Iterate: Content misses KPI targets by a wide margin, but the topic has strategic value — send back to brief stage with new data. Archive: Performance is declining and the topic is no longer strategic.',
      },
      {
        type: 'narrative',
        content: 'This gate can send content all the way back to a new brief — restarting the pipeline with updated data. That feedback loop is what makes the system learn. Without it, you have a conveyor belt: content goes in one end and comes out the other with no memory of what worked.',
      },
    ],
    roleId: 'analytics-lead',
  },

  /* ── 28. optimize ─────────────────────────────────────── */
  'optimize': {
    headline: 'Optimize',
    lede: 'Making good content better. Optimization updates headlines, CTAs, distribution mix, or repurposes content based on performance data — the most cost-effective step in the pipeline.',
    blocks: [
      {
        type: 'before-after',
        content: 'Content is "one and done" — published, promoted once, and forgotten. The team moves to the next brief.',
        alt: 'Top-performing content gets optimized iteratively — updated headlines, refreshed CTAs, expanded distribution. A single optimized piece can outperform three new pieces in pipeline contribution.',
      },
      {
        type: 'ai-handoff',
        content: 'Agents test headline variants, CTA alternatives, and distribution timing automatically. The human decides when to iterate versus start over — a system-level judgment call that requires understanding whether the problem is execution or strategy.',
      },
    ],
    roleId: 'marketing-ops',
  },

  /* ── 29. archive-tag ──────────────────────────────────── */
  'archive-tag': {
    headline: 'Archive & Tag',
    lede: 'Building the content library that compounds. Archiving is not retirement — it is curation, turning individual assets into a searchable, composable knowledge base for future campaigns, repurposing, and governance.',
    blocks: [
      {
        type: 'narrative',
        content: 'The content taxonomy transforms a folder of files into a structured library where every asset is findable by topic, audience, journey stage, and performance tier. This is where the infrastructure thesis becomes tangible — every properly tagged asset makes the entire system smarter.',
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
    headline: 'Content Governance',
    lede: 'Keeping live content honest. Content does not stay correct forever — governance reviews live assets for accuracy decay, regulatory currency, brand alignment drift, and performance decline.',
    blocks: [
      {
        type: 'scenario',
        content: 'A "2024 compliance guide" is still live in 2025 with outdated regulatory references. A product comparison page references a discontinued competitor product. A case study quotes a client now in litigation with your company. Governance catches these before customers or regulators do.',
      },
      {
        type: 'domino-effect',
        content: 'Outdated content erodes trust silently. Prospects who encounter inaccurate content do not complain — they leave. The damage is invisible in analytics because you cannot measure the visits that never converted due to stale information.',
      },
    ],
    roleId: 'context-engineer',
  },

  /* ── 31. governance-gate ──────────────────────────────── */
  'governance-gate': {
    headline: 'Governance Gate',
    lede: 'The system that maintains itself. This gate validates that all live content remains current, compliant, and brand-aligned — triggering refresh, retirement, or re-review cycles as needed.',
    blocks: [
      {
        type: 'decision-tree',
        content: 'Auto-pass: Content is less than 90 days old, no regulatory changes detected in its category, performance remains above decay threshold.',
        alt: 'Flag for review: Content exceeds age threshold, regulatory landscape has shifted, or performance has declined below minimum. Triggers re-entry into the pipeline at the appropriate stage.',
      },
      {
        type: 'narrative',
        content: 'The governance gate is what makes the content operation self-maintaining. Without it, the pipeline produces new content while old content quietly decays. With it, every asset in the library is continuously validated — and the system accumulates knowledge about what ages well and what does not. This is where agents commoditize and infrastructure compounds: the governance knowledge that accrues here improves every agent\'s output simultaneously.',
      },
      {
        type: 'quote',
        content: '"This role does not exist in most organizations today. It emerges when you realize AI needs structured context to reason well — and someone has to maintain that context." — Context Engineer',
      },
    ],
    roleId: 'context-engineer',
  },
};
