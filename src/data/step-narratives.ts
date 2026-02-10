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

export interface StepNarrative {
  headline: string;
  lede: string;
  blocks: ContentBlock[];
  roleId: string;
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
  },
};
