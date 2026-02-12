/**
 * Generate all missing journey entries for every role × every node.
 * Writes directly to role-definitions.ts.
 *
 * WHY: Each of 17 roles needs preAI/aiAgents/aiAgentic narratives for all 45 workflow nodes.
 * This script generates role-specific, contextual content for each missing entry.
 */
const fs = require('fs');

// Load graph nodes
const graph = JSON.parse(fs.readFileSync('src/data/seed-graph.json', 'utf-8'));
const workflowNodes = graph.nodes
  .filter(n => n.type === 'step' || n.type === 'gate')
  .map(n => ({ id: n.id, label: n.label, type: n.type, group: n.group, desc: n.description }));

console.log(`Found ${workflowNodes.length} workflow nodes`);

// Node metadata for generating contextual content
const nodeInfo = {};
workflowNodes.forEach(n => { nodeInfo[n.id] = n; });

// Role definitions with their perspective and concerns
const roleMeta = {
  'content-director': {
    title: 'Content Director',
    concern: 'editorial quality, team coordination, content strategy execution',
    verb: 'oversee',
    perspective: 'You manage the content pipeline end-to-end'
  },
  'brand-manager': {
    title: 'Brand Manager',
    concern: 'brand consistency, voice guidelines, visual identity',
    verb: 'protect',
    perspective: 'You guard brand integrity across all content'
  },
  'editor': {
    title: 'Editor / Content Lead',
    concern: 'writing quality, readability, editorial standards',
    verb: 'refine',
    perspective: 'You ensure every piece meets editorial standards'
  },
  'vp-marketing': {
    title: 'VP Marketing',
    concern: 'strategic alignment, budget ROI, executive visibility',
    verb: 'approve',
    perspective: 'You need content aligned with business objectives'
  },
  'analytics-lead': {
    title: 'Analytics Lead',
    concern: 'data accuracy, performance metrics, attribution models',
    verb: 'measure',
    perspective: 'You turn content performance into actionable insights'
  },
  'content-strategist': {
    title: 'Content Strategist',
    concern: 'audience alignment, content-market fit, strategic messaging',
    verb: 'plan',
    perspective: 'You shape the strategic direction of all content'
  },
  'marketing-ops': {
    title: 'Marketing Ops',
    concern: 'workflow automation, tech stack, operational efficiency',
    verb: 'automate',
    perspective: 'You keep the content machine running smoothly'
  },
  'consumer-insights': {
    title: 'Consumer Insights',
    concern: 'audience behavior, market trends, sentiment analysis',
    verb: 'analyze',
    perspective: 'You decode audience needs to inform content decisions'
  },
  'consulting-dd': {
    title: 'Consulting (Due Diligence)',
    concern: 'process maturity, risk assessment, capability benchmarking',
    verb: 'evaluate',
    perspective: 'You assess content operations for maturity and risk'
  },
  'legal-counsel': {
    title: 'Legal Counsel',
    concern: 'regulatory compliance, IP protection, liability mitigation',
    verb: 'review',
    perspective: 'You protect the organization from legal and regulatory risk'
  },
  'localization-manager': {
    title: 'Localization Manager',
    concern: 'translation accuracy, cultural adaptation, regional compliance',
    verb: 'adapt',
    perspective: 'You ensure content works across markets and languages'
  },
  'creative-director': {
    title: 'Creative Director',
    concern: 'visual excellence, creative consistency, design innovation',
    verb: 'direct',
    perspective: 'You set the creative vision for all content assets'
  },
  'growth-lead': {
    title: 'Growth Lead',
    concern: 'conversion optimization, channel performance, growth metrics',
    verb: 'optimize',
    perspective: 'You drive measurable growth through content experiments'
  },
  'privacy-officer': {
    title: 'Privacy Officer',
    concern: 'data protection, consent management, regulatory compliance',
    verb: 'safeguard',
    perspective: 'You ensure all content operations respect user privacy'
  },
  'campaign-manager': {
    title: 'Campaign Manager',
    concern: 'campaign execution, timeline management, cross-channel coordination',
    verb: 'orchestrate',
    perspective: 'You coordinate campaigns from planning through measurement'
  },
  'partnerships-lead': {
    title: 'Partnerships & Influencer Lead',
    concern: 'partner relationships, influencer alignment, co-creation quality',
    verb: 'collaborate',
    perspective: 'You manage external creative partnerships and influencer programs'
  },
  'context-engineer': {
    title: 'Context Engineer',
    concern: 'knowledge structure, taxonomy, AI prompt architecture',
    verb: 'structure',
    perspective: 'You design the knowledge architecture that powers AI content systems'
  }
};

// Phase-specific templates for generating contextual journey content
// Each node belongs to a phase (Plan, Create, Review, Publish, Measure, Optimize)
// and is either a step or a gate

function generateJourney(roleId, nodeId) {
  const role = roleMeta[roleId];
  const node = nodeInfo[nodeId];
  if (!role || !node) return null;

  const isGate = node.type === 'gate';
  const phase = node.group;

  // Generate role-specific, node-specific content
  return {
    preAI: generatePreAI(role, node, isGate, phase),
    aiAgents: generateAIAgents(role, node, isGate, phase),
    aiAgentic: generateAIAgentic(role, node, isGate, phase)
  };
}

// Pre-AI stage content generators organized by node
const preAITemplates = {
  'receive-request': (r) => ({
    summary: `You ${r.verb} incoming requests manually, sorting through emails and Slack messages for ${r.concern.split(',')[0]}.`,
    detail: `Requests arrive in inconsistent formats with no standard intake process. You spend hours triaging and clarifying scope before ${r.concern.split(',')[0]} can even begin.`
  }),
  'research-insights': (r) => ({
    summary: `You gather audience and market research manually, compiling data from multiple sources for ${r.concern.split(',')[0]}.`,
    detail: `Research is scattered across tools, reports, and tribal knowledge. Building a complete picture for ${r.concern.split(',')[0]} takes days and the data is often stale by the time you use it.`
  }),
  'write-brief': (r) => ({
    summary: `You wait for briefs written by hand, often lacking the ${r.concern.split(',')[0]} detail you need.`,
    detail: `Briefs arrive incomplete or misaligned with your ${r.concern.split(',')[0]} requirements. You spend cycles requesting revisions and clarifying expectations before work can proceed.`
  }),
  'draft-content': (r) => ({
    summary: `You review drafts created entirely by hand, checking each one for alignment with ${r.concern.split(',')[0]}.`,
    detail: `First drafts vary wildly in quality and ${r.concern.split(',')[0]} alignment. You often send content back for multiple revision cycles, creating bottlenecks in the pipeline.`
  }),
  'seo-optimization': (r) => ({
    summary: `SEO optimization is manual and disconnected from your ${r.concern.split(',')[0]} priorities.`,
    detail: `Keyword research and meta optimization happen separately from your ${r.concern.split(',')[0]} workflow. You rarely see SEO data until after content is already in review.`
  }),
  'brand-compliance': (r) => ({
    summary: `Brand checks are subjective and slow, creating delays in your ${r.concern.split(',')[0]} workflow.`,
    detail: `Brand reviewers interpret guidelines differently. Inconsistent enforcement of tone, terminology, and messaging means ${r.concern.split(',')[0]} is harder to maintain at scale.`
  }),
  'final-edit': (r) => ({
    summary: `Final edits depend entirely on editor availability, blocking your ${r.concern.split(',')[0]} timelines.`,
    detail: `A single editor bottleneck means content waits in queue. Your ${r.concern.split(',')[0]} deadlines slip because there is no way to parallelize the final polish step.`
  }),
  'schedule-publish': (r) => ({
    summary: `Publishing is a manual CMS process with no connection to your ${r.concern.split(',')[0]} planning.`,
    detail: `Each piece requires manual scheduling, metadata entry, and CMS configuration. Your ${r.concern.split(',')[0]} goals are disconnected from the publish timeline.`
  }),
  'distribute': (r) => ({
    summary: `Content distribution is manual channel-by-channel, with limited visibility into ${r.concern.split(',')[0]}.`,
    detail: `Each channel requires separate formatting, scheduling, and posting. There is no unified view of how distribution supports your ${r.concern.split(',')[0]} objectives.`
  }),
  'track-performance': (r) => ({
    summary: `Performance tracking is fragmented across tools, making ${r.concern.split(',')[0]} assessment difficult.`,
    detail: `You pull data from analytics dashboards, social platforms, and CRM separately. Building a complete picture for ${r.concern.split(',')[0]} requires manual data stitching.`
  }),
  'generate-report': (r) => ({
    summary: `Reports are built manually in spreadsheets, often missing the ${r.concern.split(',')[0]} metrics you need.`,
    detail: `Report creation takes hours of data gathering and formatting. The metrics that matter for ${r.concern.split(',')[0]} are often buried or missing entirely from standard templates.`
  }),
  'optimize': (r) => ({
    summary: `Content optimization is reactive and slow, with limited connection to ${r.concern.split(',')[0]} data.`,
    detail: `Optimization decisions rely on gut feel and delayed data. Your ${r.concern.split(',')[0]} insights rarely feed back into content updates in a timely way.`
  }),
  'brief-approval': (r) => ({
    summary: `Brief approvals are bottlenecked by manual review cycles that delay your ${r.concern.split(',')[0]} work.`,
    detail: `You wait for briefs to pass through approval chains before your ${r.concern.split(',')[0]} tasks can begin. Unclear approval criteria mean briefs bounce back and forth repeatedly.`
  }),
  'quality-check': (r) => ({
    summary: `Quality checks are inconsistent manual reviews with no standard ${r.concern.split(',')[0]} criteria.`,
    detail: `Quality varies by reviewer and day. There is no automated baseline for readability, accuracy, or ${r.concern.split(',')[0]} alignment, leading to uneven content standards.`
  }),
  'brand-review': (r) => ({
    summary: `Brand reviews are subjective gates that slow your ${r.concern.split(',')[0]} pipeline.`,
    detail: `Reviewers apply brand guidelines inconsistently. What passes one review fails the next, creating unpredictable delays in your ${r.concern.split(',')[0]} workflow.`
  }),
  'stakeholder-signoff': (r) => ({
    summary: `Stakeholder sign-off is a bottleneck where executives delay your ${r.concern.split(',')[0]} timelines.`,
    detail: `Senior approvers are busy and unresponsive. Your ${r.concern.split(',')[0]} work stalls while waiting for sign-off, and last-minute changes create downstream chaos.`
  }),
  'performance-review': (r) => ({
    summary: `Performance reviews are infrequent manual assessments that underserve your ${r.concern.split(',')[0]} needs.`,
    detail: `Reviews happen quarterly at best, using outdated data. Your ${r.concern.split(',')[0]} perspective is often missing from the evaluation criteria entirely.`
  }),
  'social-listening': (r) => ({
    summary: `Social listening is ad hoc keyword monitoring with no systematic link to ${r.concern.split(',')[0]}.`,
    detail: `You check social platforms manually for relevant conversations. Insights rarely reach your ${r.concern.split(',')[0]} workflow before they become stale or irrelevant.`
  }),
  'visual-asset-creation': (r) => ({
    summary: `Visual asset creation is a slow design queue disconnected from your ${r.concern.split(',')[0]} needs.`,
    detail: `Design requests go into a backlog with unclear priorities. Your ${r.concern.split(',')[0]} requirements are often lost in translation between brief and final asset.`
  }),
  'legal-review': (r) => ({
    summary: `Legal review is an opaque process that creates unpredictable delays in your ${r.concern.split(',')[0]} work.`,
    detail: `Legal feedback arrives late with minimal context. You cannot predict how long review will take, making ${r.concern.split(',')[0]} planning unreliable.`
  }),
  'accessibility-check': (r) => ({
    summary: `Accessibility checking is a manual afterthought, rarely connected to your ${r.concern.split(',')[0]} process.`,
    detail: `WCAG compliance and inclusive language reviews happen late in the pipeline. Your ${r.concern.split(',')[0]} work is already done when accessibility issues force rework.`
  }),
  'localize-content': (r) => ({
    summary: `Localization is a slow, manual translation process that delays your ${r.concern.split(',')[0]} for global markets.`,
    detail: `Each market requires separate translation, cultural review, and compliance checking. Your ${r.concern.split(',')[0]} suffers because localized versions lag weeks behind the original.`
  }),
  'ab-variant-creation': (r) => ({
    summary: `A/B variants are created manually with limited connection to your ${r.concern.split(',')[0]} hypotheses.`,
    detail: `Test variants rely on guesswork rather than data. Your ${r.concern.split(',')[0]} insights rarely inform variant design, reducing the value of testing efforts.`
  }),
  'content-repurposing': (r) => ({
    summary: `Content repurposing is manual reformatting, disconnected from your ${r.concern.split(',')[0]} goals.`,
    detail: `Each derivative asset is created from scratch. Your ${r.concern.split(',')[0]} requirements are not systematically applied when repurposing content across formats.`
  }),
  'archive-tag': (r) => ({
    summary: `Content archiving is inconsistent, making ${r.concern.split(',')[0]}-related retrieval nearly impossible.`,
    detail: `Tagging and taxonomy are applied inconsistently or not at all. Finding past content relevant to ${r.concern.split(',')[0]} requires searching through unstructured repositories.`
  }),
  'legal-compliance-gate': (r) => ({
    summary: `Legal compliance gates create unpredictable holds that delay your ${r.concern.split(',')[0]} deadlines.`,
    detail: `Legal sign-off timing is opaque and variable. Your ${r.concern.split(',')[0]} timelines are at the mercy of legal review queues with no visibility into status.`
  }),
  'localization-quality-gate': (r) => ({
    summary: `Localization quality gates are inconsistent, creating ${r.concern.split(',')[0]} risks in global markets.`,
    detail: `Quality checks for localized content vary by market and reviewer. Your ${r.concern.split(',')[0]} standards are unevenly applied across regions and languages.`
  }),
  'segment-mapping': (r) => ({
    summary: `Segment mapping is manual spreadsheet work with limited visibility into ${r.concern.split(',')[0]} impact.`,
    detail: `Mapping content variants to audience segments is done in spreadsheets. Your ${r.concern.split(',')[0]} data is disconnected from the personalization logic.`
  }),
  'dynamic-assembly': (r) => ({
    summary: `Dynamic content assembly is rigid and template-bound, limiting your ${r.concern.split(',')[0]} options.`,
    detail: `Personalized experiences require engineering support for each variant. Your ${r.concern.split(',')[0]} vision is constrained by inflexible assembly templates.`
  }),
  'personalization-qa': (r) => ({
    summary: `Personalization QA is manual spot-checking that misses ${r.concern.split(',')[0]} gaps.`,
    detail: `Testing every segment-variant combination is impossible manually. Your ${r.concern.split(',')[0]} concerns are only caught when users report issues post-launch.`
  }),
  'campaign-planning': (r) => ({
    summary: `Campaign planning is a manual coordination effort with fragmented ${r.concern.split(',')[0]} inputs.`,
    detail: `Campaign plans are built in decks and spreadsheets with incomplete data. Your ${r.concern.split(',')[0]} perspective is often incorporated too late in the planning cycle.`
  }),
  'consent-check': (r) => ({
    summary: `Consent checking is a manual compliance step that adds friction to your ${r.concern.split(',')[0]} process.`,
    detail: `Verifying GDPR/CCPA consent for targeting requires manual cross-referencing. Your ${r.concern.split(',')[0]} work is delayed while compliance status is manually confirmed.`
  }),
  'paid-creative-production': (r) => ({
    summary: `Paid creative production runs separately from organic, fragmenting your ${r.concern.split(',')[0]} oversight.`,
    detail: `Ad creative and organic content are produced in silos. Your ${r.concern.split(',')[0]} perspective is applied inconsistently between paid and organic channels.`
  }),
  'attribution-modeling': (r) => ({
    summary: `Attribution modeling is manual and unreliable, undermining your ${r.concern.split(',')[0]} reporting.`,
    detail: `Last-click attribution dominates despite its flaws. Your ${r.concern.split(',')[0]} decisions lack the multi-touch perspective needed for accurate performance assessment.`
  }),
  'executive-reporting': (r) => ({
    summary: `Executive reports are manually assembled, often missing the ${r.concern.split(',')[0]} narrative you need.`,
    detail: `Building executive dashboards takes hours of data wrangling. The ${r.concern.split(',')[0]} story you want to tell is lost in generic reporting templates.`
  }),
  'competitive-response': (r) => ({
    summary: `Competitive response is slow and reactive, giving you no ${r.concern.split(',')[0]} advantage.`,
    detail: `By the time you spot a competitor move and respond, the moment has passed. Your ${r.concern.split(',')[0]} approach cannot adapt fast enough to real-time competitive signals.`
  }),
  'content-governance': (r) => ({
    summary: `Content governance is periodic manual auditing that cannot keep pace with your ${r.concern.split(',')[0]} standards.`,
    detail: `Live content drifts out of compliance between infrequent reviews. Your ${r.concern.split(',')[0]} requirements are only enforced when someone manually checks.`
  }),
  'governance-gate': (r) => ({
    summary: `Governance gates are calendar-driven checkpoints disconnected from your ${r.concern.split(',')[0]} rhythm.`,
    detail: `Governance reviews happen on a fixed schedule regardless of content velocity. Your ${r.concern.split(',')[0]} concerns may not surface until the next quarterly review.`
  }),
  'journey-mapping': (r) => ({
    summary: `Journey mapping is a manual exercise that rarely reflects your ${r.concern.split(',')[0]} reality.`,
    detail: `Customer journey maps are created in workshops and quickly go stale. Your ${r.concern.split(',')[0]} perspective is a snapshot, not a living view of how content performs at each stage.`
  }),
  'sentiment-monitoring': (r) => ({
    summary: `Sentiment monitoring is sporadic manual checking with no systematic link to ${r.concern.split(',')[0]}.`,
    detail: `You check brand sentiment reactively rather than proactively. Your ${r.concern.split(',')[0]} decisions are made without real-time audience feedback signals.`
  }),
  'sales-enablement': (r) => ({
    summary: `Sales enablement content is created ad hoc, disconnected from your ${r.concern.split(',')[0]} strategy.`,
    detail: `Sales teams request materials outside the content pipeline. Your ${r.concern.split(',')[0]} standards are not applied to battle cards, decks, and one-pagers created in isolation.`
  }),
  'influencer-brief': (r) => ({
    summary: `Influencer briefs are manual documents with limited ${r.concern.split(',')[0]} guardrails.`,
    detail: `Creator briefs are written from scratch each time. Your ${r.concern.split(',')[0]} guidelines are inconsistently communicated to external partners and influencers.`
  }),
  'ugc-moderation': (r) => ({
    summary: `UGC moderation is manual screening that cannot scale to protect ${r.concern.split(',')[0]}.`,
    detail: `User-generated content is reviewed one piece at a time. Your ${r.concern.split(',')[0]} standards cannot be consistently enforced across the volume of submissions.`
  }),
  'content-scoring': (r) => ({
    summary: `Content scoring is subjective prioritization that underweights your ${r.concern.split(',')[0]} criteria.`,
    detail: `Requests are prioritized by loudest voice or executive fiat. Your ${r.concern.split(',')[0]} scoring criteria are rarely part of the formal prioritization framework.`
  }),
  'channel-orchestration': (r) => ({
    summary: `Channel orchestration is manual coordination with no systematic ${r.concern.split(',')[0]} integration.`,
    detail: `Cross-channel timing is managed in spreadsheets and Slack. Your ${r.concern.split(',')[0]} requirements for sequencing and coordination are often overridden by ad hoc changes.`
  })
};

// AI Agents stage content generators
const aiAgentsTemplates = {
  'receive-request': (r) => ({
    summary: `An AI intake agent structures requests and flags ${r.concern.split(',')[0]} implications before they reach your queue.`,
    detail: `Requests arrive pre-categorized with ${r.concern.split(',')[0]} signals highlighted. You validate and prioritize rather than manually parsing raw inputs.`
  }),
  'research-insights': (r) => ({
    summary: `AI research tools surface audience and market data relevant to your ${r.concern.split(',')[0]} needs automatically.`,
    detail: `Research agents pull relevant data from multiple sources and present ${r.concern.split(',')[0]} insights in a structured format. You curate and interpret rather than gather.`
  }),
  'write-brief': (r) => ({
    summary: `AI drafts briefs with ${r.concern.split(',')[0]} requirements pre-populated from templates and past projects.`,
    detail: `Brief generation agents pull your ${r.concern.split(',')[0]} requirements into structured templates. You review and refine rather than starting from a blank page.`
  }),
  'draft-content': (r) => ({
    summary: `AI generates first drafts with ${r.concern.split(',')[0]} guidelines embedded, reducing your revision cycles.`,
    detail: `Drafting agents produce content aligned with your ${r.concern.split(',')[0]} standards from the start. You focus on strategic refinement rather than basic corrections.`
  }),
  'seo-optimization': (r) => ({
    summary: `AI SEO tools optimize content while preserving your ${r.concern.split(',')[0]} priorities.`,
    detail: `SEO agents suggest keywords and meta improvements that align with your ${r.concern.split(',')[0]} goals. You approve optimizations rather than manually researching keywords.`
  }),
  'brand-compliance': (r) => ({
    summary: `AI brand checkers flag violations and score ${r.concern.split(',')[0]} alignment before human review.`,
    detail: `Brand agents scan content against guidelines and highlight ${r.concern.split(',')[0]} issues. You make judgment calls on edge cases rather than catching basic violations.`
  }),
  'final-edit': (r) => ({
    summary: `AI editing assistants handle mechanical fixes, freeing your ${r.concern.split(',')[0]} focus for strategic polish.`,
    detail: `Editing agents catch grammar, style, and consistency issues automatically. Your ${r.concern.split(',')[0]} perspective is reserved for nuance and narrative quality.`
  }),
  'schedule-publish': (r) => ({
    summary: `AI scheduling agents suggest optimal publish timing based on ${r.concern.split(',')[0]} data.`,
    detail: `Publishing agents recommend times and configurations informed by your ${r.concern.split(',')[0]} priorities. You approve the schedule rather than manually configuring CMS settings.`
  }),
  'distribute': (r) => ({
    summary: `AI distribution agents adapt content per channel with ${r.concern.split(',')[0]} rules built in.`,
    detail: `Distribution agents format and deploy content across channels following your ${r.concern.split(',')[0]} guidelines. You monitor and adjust rather than manually posting to each platform.`
  }),
  'track-performance': (r) => ({
    summary: `AI dashboards surface ${r.concern.split(',')[0]} metrics in real time without manual data pulling.`,
    detail: `Performance agents aggregate data and highlight the ${r.concern.split(',')[0]} signals that matter to you. You analyze trends rather than building dashboards from scratch.`
  }),
  'generate-report': (r) => ({
    summary: `AI generates reports with ${r.concern.split(',')[0]} metrics pre-formatted and insights highlighted.`,
    detail: `Reporting agents compile your ${r.concern.split(',')[0]} data into structured templates with automated analysis. You add strategic narrative rather than wrangling data.`
  }),
  'optimize': (r) => ({
    summary: `AI recommends optimizations based on ${r.concern.split(',')[0]} signals and historical performance.`,
    detail: `Optimization agents suggest specific changes tied to your ${r.concern.split(',')[0]} metrics. You approve and prioritize recommendations rather than diagnosing issues manually.`
  }),
  'brief-approval': (r) => ({
    summary: `AI pre-screens briefs for ${r.concern.split(',')[0]} alignment, routing only exceptions to you.`,
    detail: `Approval agents check briefs against your ${r.concern.split(',')[0]} criteria and flag gaps. You review flagged items rather than reading every brief end to end.`
  }),
  'quality-check': (r) => ({
    summary: `AI quality gates enforce baseline standards, letting you focus on ${r.concern.split(',')[0]} nuance.`,
    detail: `Quality agents score readability, accuracy, and SEO automatically. Your ${r.concern.split(',')[0]} evaluation focuses on strategic alignment rather than mechanical checks.`
  }),
  'brand-review': (r) => ({
    summary: `AI brand agents pre-score content, surfacing ${r.concern.split(',')[0]} issues before your review.`,
    detail: `Brand review agents apply guidelines consistently and flag ${r.concern.split(',')[0]} deviations. You handle exceptions and judgment calls rather than full content scans.`
  }),
  'stakeholder-signoff': (r) => ({
    summary: `AI prepares sign-off packages with ${r.concern.split(',')[0]} summaries for faster executive approval.`,
    detail: `Sign-off agents compile context, changes, and ${r.concern.split(',')[0]} impact assessments for approvers. Executives review structured summaries rather than raw content.`
  }),
  'performance-review': (r) => ({
    summary: `AI evaluates content against KPIs and highlights ${r.concern.split(',')[0]} trends for your review.`,
    detail: `Review agents surface performance data with ${r.concern.split(',')[0]} context pre-attached. You make optimize/archive decisions based on structured analysis rather than raw metrics.`
  }),
  'social-listening': (r) => ({
    summary: `AI monitoring tools surface trending topics and sentiment relevant to ${r.concern.split(',')[0]} in real time.`,
    detail: `Listening agents track conversations and flag ${r.concern.split(',')[0]} signals across platforms. You act on curated insights rather than monitoring feeds manually.`
  }),
  'visual-asset-creation': (r) => ({
    summary: `AI design tools generate asset options aligned with ${r.concern.split(',')[0]} requirements.`,
    detail: `Design agents produce visual variants following your ${r.concern.split(',')[0]} guidelines. You select and refine from AI-generated options rather than directing from scratch.`
  }),
  'legal-review': (r) => ({
    summary: `AI legal screening flags compliance risks early, reducing ${r.concern.split(',')[0]} surprises downstream.`,
    detail: `Legal agents pre-scan content for regulatory issues and ${r.concern.split(',')[0]} risks. You get early warnings rather than discovering problems at the sign-off stage.`
  }),
  'accessibility-check': (r) => ({
    summary: `AI accessibility tools catch WCAG violations automatically, protecting your ${r.concern.split(',')[0]} standards.`,
    detail: `Accessibility agents scan for inclusive language and alt-text compliance. Your ${r.concern.split(',')[0]} requirements benefit from automated baseline checks before human review.`
  }),
  'localize-content': (r) => ({
    summary: `AI translation agents accelerate localization while respecting ${r.concern.split(',')[0]} requirements.`,
    detail: `Localization agents produce initial translations with ${r.concern.split(',')[0]} context preserved. You review for cultural nuance rather than translating from scratch.`
  }),
  'ab-variant-creation': (r) => ({
    summary: `AI generates test variants informed by ${r.concern.split(',')[0]} data and historical performance.`,
    detail: `Variant agents create headlines, CTAs, and imagery options based on your ${r.concern.split(',')[0]} hypotheses. You select winning approaches rather than brainstorming from zero.`
  }),
  'content-repurposing': (r) => ({
    summary: `AI repurposing agents derive secondary assets with ${r.concern.split(',')[0]} consistency built in.`,
    detail: `Repurposing agents transform primary content into channel-specific formats following your ${r.concern.split(',')[0]} guidelines. You approve derivatives rather than recreating each manually.`
  }),
  'archive-tag': (r) => ({
    summary: `AI tagging agents classify content automatically, making ${r.concern.split(',')[0]} retrieval faster.`,
    detail: `Archive agents apply taxonomy and metadata based on your ${r.concern.split(',')[0]} categories. You validate classifications rather than manually tagging every asset.`
  }),
  'legal-compliance-gate': (r) => ({
    summary: `AI pre-screening reduces legal gate delays by resolving routine ${r.concern.split(',')[0]} checks automatically.`,
    detail: `Compliance agents handle standard checks and only escalate ${r.concern.split(',')[0]} edge cases to human lawyers. Your timelines are more predictable because routine items clear faster.`
  }),
  'localization-quality-gate': (r) => ({
    summary: `AI quality checks catch translation errors before they affect your ${r.concern.split(',')[0]} outcomes.`,
    detail: `Localization QA agents verify accuracy and cultural fit automatically. Your ${r.concern.split(',')[0]} standards are applied consistently across all target markets.`
  }),
  'segment-mapping': (r) => ({
    summary: `AI agents map variants to segments using ${r.concern.split(',')[0]} data from the CDP.`,
    detail: `Segment agents recommend variant-audience matches based on your ${r.concern.split(',')[0]} signals. You review the mapping rather than building it manually in spreadsheets.`
  }),
  'dynamic-assembly': (r) => ({
    summary: `AI assembly agents construct personalized experiences informed by ${r.concern.split(',')[0]} rules.`,
    detail: `Assembly agents combine content components per segment following your ${r.concern.split(',')[0]} logic. You define rules and review outputs rather than manually configuring each variant.`
  }),
  'personalization-qa': (r) => ({
    summary: `AI QA agents validate personalization coverage and flag ${r.concern.split(',')[0]} gaps before launch.`,
    detail: `QA agents test every segment-variant combination against your ${r.concern.split(',')[0]} requirements. You review exception reports rather than manually spot-checking combinations.`
  }),
  'campaign-planning': (r) => ({
    summary: `AI planning agents draft campaign frameworks with ${r.concern.split(',')[0]} data pre-integrated.`,
    detail: `Planning agents pull audience, budget, and performance data into campaign templates. Your ${r.concern.split(',')[0]} priorities shape the plan from the start rather than being retrofitted.`
  }),
  'consent-check': (r) => ({
    summary: `AI consent agents verify targeting compliance automatically, reducing ${r.concern.split(',')[0]} friction.`,
    detail: `Consent agents cross-reference CDP signals against GDPR/CCPA rules for your ${r.concern.split(',')[0]} needs. You handle exceptions rather than manually verifying every segment.`
  }),
  'paid-creative-production': (r) => ({
    summary: `AI production agents generate paid variants from organic content with ${r.concern.split(',')[0]} consistency.`,
    detail: `Paid creative agents adapt organic content for ad platforms following your ${r.concern.split(',')[0]} guidelines. You approve and fine-tune rather than producing ad creative from scratch.`
  }),
  'attribution-modeling': (r) => ({
    summary: `AI attribution models surface multi-touch insights relevant to your ${r.concern.split(',')[0]} priorities.`,
    detail: `Attribution agents calculate content ROI across channels using your ${r.concern.split(',')[0]} weightings. You interpret strategic implications rather than building models manually.`
  }),
  'executive-reporting': (r) => ({
    summary: `AI builds executive dashboards with ${r.concern.split(',')[0]} narratives pre-drafted for leadership.`,
    detail: `Reporting agents synthesize data into executive formats with your ${r.concern.split(',')[0]} story embedded. You refine the narrative rather than assembling data from scratch.`
  }),
  'competitive-response': (r) => ({
    summary: `AI competitive agents surface signals and draft responses aligned with ${r.concern.split(',')[0]} strategy.`,
    detail: `Competitive agents monitor market moves and suggest ${r.concern.split(',')[0]}-aligned responses. You approve and refine reactive content rather than spotting threats manually.`
  }),
  'content-governance': (r) => ({
    summary: `AI governance agents continuously audit live content against ${r.concern.split(',')[0]} standards.`,
    detail: `Governance agents flag content drift, compliance gaps, and ${r.concern.split(',')[0]} issues in real time. You review flagged items rather than conducting manual audits.`
  }),
  'governance-gate': (r) => ({
    summary: `AI governance gates run continuous checks, surfacing ${r.concern.split(',')[0]} issues between formal reviews.`,
    detail: `Governance agents validate live content against your ${r.concern.split(',')[0]} criteria on an ongoing basis. You act on exception alerts rather than waiting for quarterly reviews.`
  }),
  'journey-mapping': (r) => ({
    summary: `AI journey agents map content to lifecycle stages using ${r.concern.split(',')[0]} data from the CDP.`,
    detail: `Journey agents dynamically map content to customer stages based on your ${r.concern.split(',')[0]} framework. You validate the mapping rather than building it manually in workshops.`
  }),
  'sentiment-monitoring': (r) => ({
    summary: `AI sentiment agents track brand reception in real time, alerting you to ${r.concern.split(',')[0]} risks.`,
    detail: `Sentiment agents analyze audience reactions and flag ${r.concern.split(',')[0]} concerns before they escalate. You respond to alerts rather than manually checking platforms.`
  }),
  'sales-enablement': (r) => ({
    summary: `AI agents generate sales materials from marketing content with ${r.concern.split(',')[0]} alignment.`,
    detail: `Sales enablement agents transform marketing assets into battle cards and decks following your ${r.concern.split(',')[0]} standards. You approve rather than creating each piece manually.`
  }),
  'influencer-brief': (r) => ({
    summary: `AI agents draft influencer briefs with ${r.concern.split(',')[0]} guardrails embedded automatically.`,
    detail: `Brief agents generate creator guidelines from your ${r.concern.split(',')[0]} requirements and past successful collaborations. You customize rather than writing each brief from scratch.`
  }),
  'ugc-moderation': (r) => ({
    summary: `AI moderation agents screen UGC for brand safety and ${r.concern.split(',')[0]} compliance at scale.`,
    detail: `Moderation agents filter user-generated content against your ${r.concern.split(',')[0]} criteria. You review borderline cases rather than manually screening every submission.`
  }),
  'content-scoring': (r) => ({
    summary: `AI scoring agents rank requests using ${r.concern.split(',')[0]} criteria alongside strategic priority.`,
    detail: `Scoring agents weight your ${r.concern.split(',')[0]} factors into the prioritization algorithm. You adjust rankings rather than scoring each request manually.`
  }),
  'channel-orchestration': (r) => ({
    summary: `AI orchestration agents sequence distribution with ${r.concern.split(',')[0]} rules for timing and cadence.`,
    detail: `Orchestration agents coordinate cross-channel timing based on your ${r.concern.split(',')[0]} requirements. You set rules and review the sequence rather than managing each channel individually.`
  })
};

// AI Agentic stage content generators
const aiAgenticTemplates = {
  'receive-request': (r) => ({
    summary: `Autonomous intake agents triage, validate, and route requests with ${r.concern.split(',')[0]} logic — you govern exceptions.`,
    detail: `Agentic intake handles end-to-end request processing with your ${r.concern.split(',')[0]} rules embedded. You set policies and review escalations while routine requests flow automatically.`
  }),
  'research-insights': (r) => ({
    summary: `Autonomous research agents continuously update ${r.concern.split(',')[0]} intelligence — you set the strategic lens.`,
    detail: `Research agents proactively surface ${r.concern.split(',')[0]} insights from market signals, audience data, and competitive movements. You shape research priorities, not execute searches.`
  }),
  'write-brief': (r) => ({
    summary: `Autonomous agents generate complete briefs with ${r.concern.split(',')[0]} alignment built in — you approve strategy.`,
    detail: `Brief agents produce publication-ready briefs that embed your ${r.concern.split(',')[0]} requirements from historical patterns. You govern strategic direction rather than reviewing drafts.`
  }),
  'draft-content': (r) => ({
    summary: `Autonomous drafting agents produce content meeting ${r.concern.split(',')[0]} standards — you set creative direction.`,
    detail: `Drafting agents generate content that passes your ${r.concern.split(',')[0]} criteria automatically. You focus on strategic vision and creative differentiation rather than quality control.`
  }),
  'seo-optimization': (r) => ({
    summary: `Autonomous SEO agents optimize continuously within ${r.concern.split(',')[0]} boundaries — you define the strategy.`,
    detail: `SEO agents self-optimize content based on real-time search signals and your ${r.concern.split(',')[0]} guardrails. You set strategic keywords and constraints, not individual page optimizations.`
  }),
  'brand-compliance': (r) => ({
    summary: `Autonomous brand agents enforce compliance at scale with ${r.concern.split(',')[0]} rules — you update the rulebook.`,
    detail: `Brand agents apply and evolve compliance checks across all content automatically. Your ${r.concern.split(',')[0]} standards are codified as machine-enforceable rules that you govern and refine.`
  }),
  'final-edit': (r) => ({
    summary: `Autonomous editing agents polish content to publication standard — your ${r.concern.split(',')[0]} bar is encoded as policy.`,
    detail: `Editing agents handle all mechanical and stylistic refinement autonomously. Your ${r.concern.split(',')[0]} standards are embedded as editorial policies that improve with each iteration.`
  }),
  'schedule-publish': (r) => ({
    summary: `Autonomous publishing agents manage scheduling end-to-end using ${r.concern.split(',')[0]} optimization logic.`,
    detail: `Publishing agents handle CMS configuration, timing optimization, and deployment autonomously within your ${r.concern.split(',')[0]} constraints. You set publishing policies, not individual schedules.`
  }),
  'distribute': (r) => ({
    summary: `Autonomous distribution agents manage all channels with ${r.concern.split(',')[0]} rules — you govern the playbook.`,
    detail: `Distribution agents deploy, adapt, and optimize content across every channel following your ${r.concern.split(',')[0]} playbook. You evolve distribution strategy, not execute individual channel posts.`
  }),
  'track-performance': (r) => ({
    summary: `Autonomous tracking agents monitor ${r.concern.split(',')[0]} metrics continuously and trigger alerts and actions.`,
    detail: `Performance agents stream ${r.concern.split(',')[0]} data and automatically trigger optimization workflows when thresholds are breached. You define KPIs and review strategic implications.`
  }),
  'generate-report': (r) => ({
    summary: `Autonomous reporting agents produce ${r.concern.split(',')[0]} reports on demand with strategic recommendations.`,
    detail: `Reporting agents generate ${r.concern.split(',')[0]} analyses with actionable recommendations automatically. You consume insights and set strategic direction rather than producing reports.`
  }),
  'optimize': (r) => ({
    summary: `Autonomous optimization agents improve content continuously using ${r.concern.split(',')[0]} signals — you set boundaries.`,
    detail: `Optimization agents test, iterate, and improve content based on ${r.concern.split(',')[0]} data within your guardrails. You define acceptable ranges and review significant changes.`
  }),
  'brief-approval': (r) => ({
    summary: `Autonomous approval agents clear standard briefs and escalate only ${r.concern.split(',')[0]} exceptions to you.`,
    detail: `Approval agents validate briefs against your ${r.concern.split(',')[0]} criteria and auto-approve routine requests. You handle strategic exceptions and edge cases only.`
  }),
  'quality-check': (r) => ({
    summary: `Autonomous quality agents enforce standards continuously — ${r.concern.split(',')[0]} baselines are self-maintaining.`,
    detail: `Quality agents apply and evolve quality standards based on your ${r.concern.split(',')[0]} benchmarks. You set quality policies that the system enforces and improves over time.`
  }),
  'brand-review': (r) => ({
    summary: `Autonomous brand agents review all content at scale — you govern ${r.concern.split(',')[0]} policy evolution.`,
    detail: `Brand review agents handle all compliance checking autonomously with your ${r.concern.split(',')[0]} rules. You update brand guidelines and review the rare edge case that requires human judgment.`
  }),
  'stakeholder-signoff': (r) => ({
    summary: `Autonomous agents handle routine sign-offs within ${r.concern.split(',')[0]} parameters — executives approve strategy only.`,
    detail: `Sign-off agents clear content that meets all ${r.concern.split(',')[0]} criteria automatically. Executives only review strategic pivots or high-risk content that breaches defined thresholds.`
  }),
  'performance-review': (r) => ({
    summary: `Autonomous review agents evaluate and act on performance with ${r.concern.split(',')[0]} logic — you set the framework.`,
    detail: `Review agents continuously assess content against your ${r.concern.split(',')[0]} KPIs and trigger optimize/refresh/archive workflows automatically. You define the evaluation framework.`
  }),
  'social-listening': (r) => ({
    summary: `Autonomous listening agents track and respond to ${r.concern.split(',')[0]} signals across all platforms in real time.`,
    detail: `Listening agents monitor social channels and proactively surface ${r.concern.split(',')[0]} opportunities and risks. You set monitoring priorities and review strategic findings.`
  }),
  'visual-asset-creation': (r) => ({
    summary: `Autonomous design agents produce visual assets within ${r.concern.split(',')[0]} guidelines — you set creative direction.`,
    detail: `Design agents generate publication-ready visuals following your ${r.concern.split(',')[0]} standards. You define the creative vision and approve hero assets while routine visuals ship autonomously.`
  }),
  'legal-review': (r) => ({
    summary: `Autonomous legal agents clear routine content and escalate only true ${r.concern.split(',')[0]} risks to human counsel.`,
    detail: `Legal agents scan and clear standard content autonomously using your ${r.concern.split(',')[0]} rule framework. Human lawyers handle novel risk scenarios and precedent-setting decisions only.`
  }),
  'accessibility-check': (r) => ({
    summary: `Autonomous accessibility agents enforce WCAG and inclusive standards — ${r.concern.split(',')[0]} is guaranteed by default.`,
    detail: `Accessibility agents ensure all content meets compliance standards before publication. Your ${r.concern.split(',')[0]} benefits from guaranteed accessibility without manual checking overhead.`
  }),
  'localize-content': (r) => ({
    summary: `Autonomous localization agents adapt content for all markets simultaneously — your ${r.concern.split(',')[0]} scales globally.`,
    detail: `Localization agents handle translation, cultural adaptation, and regional compliance autonomously. Your ${r.concern.split(',')[0]} is maintained across markets without manual per-locale effort.`
  }),
  'ab-variant-creation': (r) => ({
    summary: `Autonomous variant agents design, deploy, and learn from tests using ${r.concern.split(',')[0]} hypotheses — you set the agenda.`,
    detail: `Variant agents run continuous testing experiments informed by your ${r.concern.split(',')[0]} objectives. You define what to test and review strategic learnings while the system iterates autonomously.`
  }),
  'content-repurposing': (r) => ({
    summary: `Autonomous repurposing agents derive all secondary assets automatically within ${r.concern.split(',')[0]} guidelines.`,
    detail: `Repurposing agents transform primary content into every derivative format following your ${r.concern.split(',')[0]} rules. You set format strategy while the system handles production at scale.`
  }),
  'archive-tag': (r) => ({
    summary: `Autonomous archive agents maintain perfect taxonomy — ${r.concern.split(',')[0]} retrieval is instant and reliable.`,
    detail: `Archive agents classify, tag, and organize all content using your ${r.concern.split(',')[0]} taxonomy automatically. You evolve the taxonomy structure while the system maintains it flawlessly.`
  }),
  'legal-compliance-gate': (r) => ({
    summary: `Autonomous compliance gates clear routine content instantly — only novel ${r.concern.split(',')[0]} risks reach human lawyers.`,
    detail: `Compliance agents handle standard legal checks autonomously using your ${r.concern.split(',')[0]} risk framework. Human review is reserved for unprecedented scenarios and policy updates.`
  }),
  'localization-quality-gate': (r) => ({
    summary: `Autonomous QA agents ensure localization quality across all markets — ${r.concern.split(',')[0]} is guaranteed globally.`,
    detail: `Localization QA agents validate every market adaptation autonomously against your ${r.concern.split(',')[0]} standards. You set quality criteria while the system enforces them at scale.`
  }),
  'segment-mapping': (r) => ({
    summary: `Autonomous segment agents map and optimize variant-audience matches using live ${r.concern.split(',')[0]} signals.`,
    detail: `Segment agents continuously refine variant-audience mappings based on real-time ${r.concern.split(',')[0]} data. You define segmentation strategy while the system executes and optimizes automatically.`
  }),
  'dynamic-assembly': (r) => ({
    summary: `Autonomous assembly agents construct personalized experiences in real time — ${r.concern.split(',')[0]} logic is self-optimizing.`,
    detail: `Assembly agents build dynamic experiences per segment using your ${r.concern.split(',')[0]} rules and real-time behavioral signals. You govern personalization policies, not individual assembly configurations.`
  }),
  'personalization-qa': (r) => ({
    summary: `Autonomous QA agents validate every personalization scenario — ${r.concern.split(',')[0]} gaps are caught before launch.`,
    detail: `Personalization QA agents test all segment-variant combinations against your ${r.concern.split(',')[0]} requirements automatically. You set acceptance criteria while the system validates at scale.`
  }),
  'campaign-planning': (r) => ({
    summary: `Autonomous planning agents generate campaign frameworks using ${r.concern.split(',')[0]} intelligence — you set objectives.`,
    detail: `Planning agents produce data-driven campaign plans with your ${r.concern.split(',')[0]} priorities embedded. You define strategic goals while the system optimizes tactics and resource allocation.`
  }),
  'consent-check': (r) => ({
    summary: `Autonomous consent agents enforce privacy compliance at scale — ${r.concern.split(',')[0]} is guaranteed by architecture.`,
    detail: `Consent agents verify targeting compliance in real time across all segments using your ${r.concern.split(',')[0]} framework. You set privacy policies while the system enforces them automatically.`
  }),
  'paid-creative-production': (r) => ({
    summary: `Autonomous production agents create paid variants at scale within ${r.concern.split(',')[0]} guardrails — you set the strategy.`,
    detail: `Paid creative agents generate ad variants from organic content following your ${r.concern.split(',')[0]} guidelines. You define creative strategy while the system produces and optimizes at scale.`
  }),
  'attribution-modeling': (r) => ({
    summary: `Autonomous attribution agents run multi-touch models continuously — ${r.concern.split(',')[0]} insights update in real time.`,
    detail: `Attribution agents calculate content ROI across all channels using your ${r.concern.split(',')[0]} framework. You interpret strategic implications while the system handles modeling complexity.`
  }),
  'executive-reporting': (r) => ({
    summary: `Autonomous reporting agents produce executive dashboards with ${r.concern.split(',')[0]} narratives — you add strategic context.`,
    detail: `Executive reporting agents synthesize all data into leadership-ready formats with your ${r.concern.split(',')[0]} story embedded. You provide strategic commentary on auto-generated insights.`
  }),
  'competitive-response': (r) => ({
    summary: `Autonomous competitive agents detect and draft responses in real time — ${r.concern.split(',')[0]} moves are countered instantly.`,
    detail: `Competitive agents monitor signals, draft responses, and deploy within your ${r.concern.split(',')[0]} guardrails. You approve high-stakes responses while routine reactions ship autonomously.`
  }),
  'content-governance': (r) => ({
    summary: `Autonomous governance agents audit all live content continuously — ${r.concern.split(',')[0]} compliance is always current.`,
    detail: `Governance agents monitor every published piece against your ${r.concern.split(',')[0]} standards in real time. You evolve governance policies while the system enforces them perpetually.`
  }),
  'governance-gate': (r) => ({
    summary: `Autonomous governance gates run continuously — ${r.concern.split(',')[0]} violations trigger immediate remediation.`,
    detail: `Governance agents validate live content against your ${r.concern.split(',')[0]} criteria continuously and auto-trigger refresh or retirement workflows. You set policies, not review schedules.`
  }),
  'journey-mapping': (r) => ({
    summary: `Autonomous journey agents maintain living maps using real-time ${r.concern.split(',')[0]} data — you shape the strategy.`,
    detail: `Journey agents dynamically map content to lifecycle stages using live ${r.concern.split(',')[0]} signals. You define journey frameworks while the system optimizes content placement continuously.`
  }),
  'sentiment-monitoring': (r) => ({
    summary: `Autonomous sentiment agents monitor and respond to ${r.concern.split(',')[0]} signals around the clock — you govern escalation.`,
    detail: `Sentiment agents track audience reactions and trigger ${r.concern.split(',')[0]} responses automatically. You set escalation thresholds and review strategic implications of sentiment shifts.`
  }),
  'sales-enablement': (r) => ({
    summary: `Autonomous enablement agents keep sales materials current with ${r.concern.split(',')[0]} alignment — you set the playbook.`,
    detail: `Enablement agents automatically update battle cards, decks, and case studies as your ${r.concern.split(',')[0]} data evolves. You define the sales narrative while the system produces materials at scale.`
  }),
  'influencer-brief': (r) => ({
    summary: `Autonomous brief agents generate creator guidelines with ${r.concern.split(',')[0]} guardrails — you approve partnerships.`,
    detail: `Brief agents produce personalized influencer guidelines using your ${r.concern.split(',')[0]} framework and creator history. You focus on relationship strategy while briefs ship autonomously.`
  }),
  'ugc-moderation': (r) => ({
    summary: `Autonomous moderation agents screen all UGC for ${r.concern.split(',')[0]} compliance at scale — you govern edge cases.`,
    detail: `Moderation agents filter user-generated content using your ${r.concern.split(',')[0]} rules continuously. You update moderation policies and review borderline cases that the system escalates.`
  }),
  'content-scoring': (r) => ({
    summary: `Autonomous scoring agents prioritize the pipeline using ${r.concern.split(',')[0]} criteria — you set strategic weights.`,
    detail: `Scoring agents rank and route content requests using your ${r.concern.split(',')[0]} priorities in real time. You define scoring criteria and review the queue rather than manually triaging.`
  }),
  'channel-orchestration': (r) => ({
    summary: `Autonomous orchestration agents manage all channel timing with ${r.concern.split(',')[0]} logic — you set the playbook.`,
    detail: `Orchestration agents handle cross-channel sequencing, timing, and coordination autonomously using your ${r.concern.split(',')[0]} rules. You evolve the orchestration strategy while the system executes.`
  })
};

function generatePreAI(role, node, isGate, phase) {
  const template = preAITemplates[node.id];
  if (template) return template(role);
  // Fallback
  return {
    summary: `You handle ${node.label.toLowerCase()} manually, with no automation supporting your ${role.concern.split(',')[0]} needs.`,
    detail: `The ${node.label.toLowerCase()} process runs without any connection to your ${role.concern.split(',')[0]} workflow. You spend time tracking and coordinating this step through emails and meetings.`
  };
}

function generateAIAgents(role, node, isGate, phase) {
  const template = aiAgentsTemplates[node.id];
  if (template) return template(role);
  return {
    summary: `AI assistants support ${node.label.toLowerCase()} with ${role.concern.split(',')[0]} signals pre-surfaced for your review.`,
    detail: `AI agents handle routine aspects of ${node.label.toLowerCase()} and surface ${role.concern.split(',')[0]} issues. You validate and adjust rather than managing every detail manually.`
  };
}

function generateAIAgentic(role, node, isGate, phase) {
  const template = aiAgenticTemplates[node.id];
  if (template) return template(role);
  return {
    summary: `Autonomous agents handle ${node.label.toLowerCase()} end-to-end within ${role.concern.split(',')[0]} guardrails — you govern policy.`,
    detail: `Agentic systems manage ${node.label.toLowerCase()} autonomously using your ${role.concern.split(',')[0]} rules. You set policies and review escalations while routine work flows without intervention.`
  };
}

// Generate all journeys as JSON
const allJourneys = {};

for (const roleId of Object.keys(roleMeta)) {
  allJourneys[roleId] = {};
  for (const node of workflowNodes) {
    allJourneys[roleId][node.id] = generateJourney(roleId, node.id);
  }
}

// Count total
let total = 0;
for (const roleId of Object.keys(allJourneys)) {
  total += Object.keys(allJourneys[roleId]).length;
}
console.log(`Generated ${total} journey entries (expected ${17 * 45} = 765)`);

// Now merge into the TS file - only add MISSING entries
let tsContent = fs.readFileSync('src/lib/roles/role-definitions.ts', 'utf-8');

// Find existing journey keys per role
const roleBlocks = tsContent.split(/\{\s*\n\s*id:\s*'/);
const existingJourneys = {};

for (let i = 1; i < roleBlocks.length; i++) {
  const idMatch = roleBlocks[i].match(/^([^']+)/);
  if (!idMatch) continue;
  const roleId = idMatch[1];

  const journeyKeys = [];
  const journeyRegex = /'([^']+)':\s*\{\s*\n\s*preAI:/g;
  let m;
  while ((m = journeyRegex.exec(roleBlocks[i])) !== null) {
    journeyKeys.push(m[1]);
  }
  existingJourneys[roleId] = journeyKeys;
}

// Helper: escape single quotes for TS
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

// Helper: convert a journey to TS string
function journeyToTS(nodeId, journey, indent = '        ') {
  return `${indent}'${nodeId}': {
${indent}  preAI: {
${indent}    summary: '${esc(journey.preAI.summary)}',
${indent}    detail: '${esc(journey.preAI.detail)}',
${indent}  },
${indent}  aiAgents: {
${indent}    summary: '${esc(journey.aiAgents.summary)}',
${indent}    detail: '${esc(journey.aiAgents.detail)}',
${indent}  },
${indent}  aiAgentic: {
${indent}    summary: '${esc(journey.aiAgentic.summary)}',
${indent}    detail: '${esc(journey.aiAgentic.detail)}',
${indent}  },
${indent}},`;
}

// For each role, find nodeJourneys block and insert missing entries
let insertedCount = 0;
for (const roleId of Object.keys(allJourneys)) {
  const existing = existingJourneys[roleId] || [];
  const missing = Object.keys(allJourneys[roleId]).filter(nid => !existing.includes(nid));

  if (missing.length === 0) {
    console.log(`${roleId}: already complete (${existing.length} entries)`);
    continue;
  }

  // Find the role block
  const roleIdPattern = `id: '${roleId}'`;
  const roleStart = tsContent.indexOf(roleIdPattern);
  if (roleStart === -1) {
    console.log(`ERROR: Could not find role ${roleId} in TS file`);
    continue;
  }

  // Find the keyInsight line after this role start
  const closingPattern = '      },\n      keyInsight:';
  const closingPos = tsContent.indexOf(closingPattern, roleStart);
  if (closingPos === -1) {
    console.log(`ERROR: Could not find nodeJourneys closing for role ${roleId}`);
    continue;
  }

  // Generate the new entries string
  const newEntriesStr = missing.map(nodeId => {
    return journeyToTS(nodeId, allJourneys[roleId][nodeId]);
  }).join('\n');

  // Insert before the closing `},` of nodeJourneys
  tsContent = tsContent.substring(0, closingPos) + newEntriesStr + '\n' + tsContent.substring(closingPos);

  console.log(`${roleId}: inserted ${missing.length} entries (had ${existing.length})`);
  insertedCount += missing.length;
}

// Write the updated TS file
fs.writeFileSync('src/lib/roles/role-definitions.ts', tsContent);
console.log(`\nDone! Inserted ${insertedCount} new entries.`);

// Verify: re-count journeys per role
const verifyContent = fs.readFileSync('src/lib/roles/role-definitions.ts', 'utf-8');
const verifyBlocks = verifyContent.split(/\{\s*\n\s*id:\s*'/);
let totalVerified = 0;
let allComplete = true;

for (let i = 1; i < verifyBlocks.length; i++) {
  const idMatch = verifyBlocks[i].match(/^([^']+)/);
  if (!idMatch) continue;
  const roleId = idMatch[1];

  const journeyRegex = /'([^']+)':\s*\{\s*\n\s*preAI:/g;
  let m;
  let count = 0;
  while ((m = journeyRegex.exec(verifyBlocks[i])) !== null) {
    count++;
  }
  totalVerified += count;
  if (count !== 45) {
    console.log(`WARNING: ${roleId} has ${count}/45 entries`);
    allComplete = false;
  }
}

console.log(`\nVerification: ${totalVerified} total entries (expected 765)`);
if (allComplete) {
  console.log('ALL ROLES COMPLETE - 45/45 entries each');
} else {
  console.log('SOME ROLES INCOMPLETE - see warnings above');
}
