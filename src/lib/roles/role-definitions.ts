// Role definitions derived from the marketing campaign graph's gate reviewers
// and step owners. Each role maps to specific nodes and carries narrative insight.

export type RoleCategory = 'strategy' | 'creative' | 'governance' | 'operations' | 'growth';

export const ROLE_CATEGORIES: Record<RoleCategory, { label: string; subtitle: string; iconName: string }> = {
  strategy:   { label: 'Strategy',   subtitle: 'Set the direction',   iconName: 'Compass' },
  creative:   { label: 'Creative',   subtitle: 'Make the work',       iconName: 'Palette' },
  governance: { label: 'Governance', subtitle: 'Protect the brand',   iconName: 'Shield' },
  operations: { label: 'Operations', subtitle: 'Keep it running',     iconName: 'Settings' },
  growth:     { label: 'Growth',     subtitle: 'Multiply the impact', iconName: 'TrendingUp' },
};

export interface JourneyStage {
  summary: string;  // 1 short sentence — the headline
  detail: string;   // 2-3 sentences with one concrete example or mechanism
}

// 3-stage journey for a specific node within a role
export interface NodeJourney {
  preAI: JourneyStage;
  aiAgents: JourneyStage;
  aiAgentic: JourneyStage;
}

export interface RoleNarrative {
  nodeJourneys: Record<string, NodeJourney>;  // keyed by node ID — covers all steps and gates in the pipeline
  keyInsight: string;
}

export interface RoleDefinition {
  id: string;
  title: string;
  description: string;
  tagline: string;
  iconName: string;
  category: RoleCategory;
  accentColor: string;
  // Node IDs this role directly owns or reviews
  ownedSteps: string[];
  reviewedGates: string[];
  // Related agents and inputs the role depends on
  relatedAgents: string[];
  relatedInputs: string[];
  narrative: RoleNarrative;
}

export function computeRoleStats(role: RoleDefinition, totalGraphNodes: number) {
  const steps = role.ownedSteps.length;
  const gates = role.reviewedGates.length;
  const total = steps + gates + role.relatedAgents.length + role.relatedInputs.length;
  return { steps, gates, total, coveragePct: Math.round((total / totalGraphNodes) * 100) };
}

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    id: 'content-director',
    title: 'Content Director',
    description: 'Owns the brief phase and approves content briefs before creation begins.',
    tagline: 'Scopes and approves every brief.',
    iconName: 'FileText',
    category: 'strategy',
    accentColor: '#5B9ECF',
    ownedSteps: ['receive-request', 'write-brief', 'content-governance', 'content-scoring'],
    reviewedGates: ['brief-approval', 'governance-gate'],
    relatedAgents: ['research-agent', 'writer-agent'],
    relatedInputs: ['content-strategy', 'audience-personas', 'scoring-matrix'],
    narrative: {
      nodeJourneys: {
        'receive-request': {
          preAI: {
            summary: 'You triage every incoming request by hand, sorting stakeholder asks into a spreadsheet queue.',
            detail: 'Requests arrive via email, Slack, and meetings in inconsistent formats. You spend hours each week normalizing them into something actionable.',
          },
          aiAgents: {
            summary: 'An intake agent structures requests into a standard format before they reach your queue.',
            detail: 'Requests arrive pre-categorized with audience data and strategic alignment scores. You validate priorities instead of assembling them.',
          },
          aiAgentic: {
            summary: 'Requests are auto-classified, scored, and routed — you only see those that need strategic arbitration.',
            detail: 'The system handles intake end-to-end for routine requests. Your involvement starts where automated scoring can\'t resolve competing priorities.',
          },
        },
        'write-brief': {
          preAI: {
            summary: 'You draft every brief yourself, translating stakeholder requests into structured creative direction.',
            detail: 'Each brief requires manual research, audience alignment, and stakeholder negotiation. Output quality depends entirely on your bandwidth.',
          },
          aiAgents: {
            summary: 'An AI drafts the brief from your templates — you review and refine instead of writing from scratch.',
            detail: 'The agent assembles audience data, competitive context, and strategic guidelines into a first draft. You reshape it rather than create it.',
          },
          aiAgentic: {
            summary: 'Routine briefs auto-generate and route for approval without your involvement.',
            detail: 'You only see briefs that fail scoring thresholds or involve ambiguous strategic calls. Your direct writing drops to the 20% that genuinely needs your hand.',
          },
        },
        'content-governance': {
          preAI: {
            summary: 'You enforce governance policies manually, checking each piece against taxonomy and compliance rules.',
            detail: 'Governance reviews are inconsistent because the rules live in scattered documents. Different reviewers interpret the same policy differently.',
          },
          aiAgents: {
            summary: 'A governance agent flags taxonomy mismatches and policy violations before content reaches you.',
            detail: 'Automated checks surface issues early. You focus on interpreting edge cases rather than scanning for obvious violations.',
          },
          aiAgentic: {
            summary: 'Governance is embedded in the creation process — violations are blocked before content is even drafted.',
            detail: 'The system enforces your governance framework at every step. You maintain the rules and adjudicate the rare exceptions.',
          },
        },
        'content-scoring': {
          preAI: {
            summary: 'You score and prioritize content requests against business objectives in a spreadsheet.',
            detail: 'Scoring criteria live in your head or a reference doc nobody else checks consistently. Prioritization changes weekly as stakeholders lobby.',
          },
          aiAgents: {
            summary: 'A scoring agent applies your rubric automatically — you review the ranked queue instead of building it.',
            detail: 'Requests arrive pre-scored against your criteria. You adjust weights and override edge cases rather than scoring each item.',
          },
          aiAgentic: {
            summary: 'Scoring runs continuously as requests enter the system — low-priority items never reach your queue.',
            detail: 'The system triages incoming requests before you see them. Your time shifts from scoring individual items to calibrating the scoring model itself.',
          },
        },
        'brief-approval': {
          preAI: {
            summary: 'You review and approve every brief personally before creative work begins.',
            detail: 'Approval bottlenecks are common because every brief waits for your calendar. Rush requests skip the queue, creating quality inconsistency.',
          },
          aiAgents: {
            summary: 'Pre-scored briefs arrive with risk flags, so you approve faster and catch problems earlier.',
            detail: 'The agent highlights strategic misalignment and missing context before you open the brief. Your approval speed doubles because prep work is done.',
          },
          aiAgentic: {
            summary: 'Standard briefs auto-approve when they pass scoring thresholds — you review only flagged exceptions.',
            detail: 'The gate becomes self-operating for routine work. You intervene on high-stakes briefs where competitive intuition outweighs any rubric.',
          },
        },
        'governance-gate': {
          preAI: {
            summary: 'You staff this gate with manual reviews, checking taxonomy compliance and content standards.',
            detail: 'Gate reviews add days to the timeline. Feedback loops are slow because issues are caught late in the process.',
          },
          aiAgents: {
            summary: 'Automated governance checks handle taxonomy and policy — you review only the escalated exceptions.',
            detail: 'Most content passes the gate automatically. Your reviews focus on novel content types or ambiguous policy interpretations.',
          },
          aiAgentic: {
            summary: 'The governance gate self-operates within your defined parameters — you monitor drift and update rules.',
            detail: 'You shift from gatekeeping individual pieces to maintaining the governance system itself. Updates you make cascade across all future content.',
          },
        },
        'research-insights': {
          preAI: {
            summary: 'You gather audience and market research manually, compiling data from multiple sources for editorial quality.',
            detail: 'Research is scattered across tools, reports, and tribal knowledge. Building a complete picture for editorial quality takes days and the data is often stale by the time you use it.',
          },
          aiAgents: {
            summary: 'AI research tools surface audience and market data relevant to your editorial quality needs automatically.',
            detail: 'Research agents pull relevant data from multiple sources and present editorial quality insights in a structured format. You curate and interpret rather than gather.',
          },
          aiAgentic: {
            summary: 'Autonomous research agents continuously update editorial quality intelligence — you set the strategic lens.',
            detail: 'Research agents proactively surface editorial quality insights from market signals, audience data, and competitive movements. You shape research priorities, not execute searches.',
          },
        },
        'draft-content': {
          preAI: {
            summary: 'You review drafts created entirely by hand, checking each one for alignment with editorial quality.',
            detail: 'First drafts vary wildly in quality and editorial quality alignment. You often send content back for multiple revision cycles, creating bottlenecks in the pipeline.',
          },
          aiAgents: {
            summary: 'AI generates first drafts with editorial quality guidelines embedded, reducing your revision cycles.',
            detail: 'Drafting agents produce content aligned with your editorial quality standards from the start. You focus on strategic refinement rather than basic corrections.',
          },
          aiAgentic: {
            summary: 'Autonomous drafting agents produce content meeting editorial quality standards — you set creative direction.',
            detail: 'Drafting agents generate content that passes your editorial quality criteria automatically. You focus on strategic vision and creative differentiation rather than quality control.',
          },
        },
        'seo-optimization': {
          preAI: {
            summary: 'SEO optimization is manual and disconnected from your editorial quality priorities.',
            detail: 'Keyword research and meta optimization happen separately from your editorial quality workflow. You rarely see SEO data until after content is already in review.',
          },
          aiAgents: {
            summary: 'AI SEO tools optimize content while preserving your editorial quality priorities.',
            detail: 'SEO agents suggest keywords and meta improvements that align with your editorial quality goals. You approve optimizations rather than manually researching keywords.',
          },
          aiAgentic: {
            summary: 'Autonomous SEO agents optimize continuously within editorial quality boundaries — you define the strategy.',
            detail: 'SEO agents self-optimize content based on real-time search signals and your editorial quality guardrails. You set strategic keywords and constraints, not individual page optimizations.',
          },
        },
        'brand-compliance': {
          preAI: {
            summary: 'Brand checks are subjective and slow, creating delays in your editorial quality workflow.',
            detail: 'Brand reviewers interpret guidelines differently. Inconsistent enforcement of tone, terminology, and messaging means editorial quality is harder to maintain at scale.',
          },
          aiAgents: {
            summary: 'AI brand checkers flag violations and score editorial quality alignment before human review.',
            detail: 'Brand agents scan content against guidelines and highlight editorial quality issues. You make judgment calls on edge cases rather than catching basic violations.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents enforce compliance at scale with editorial quality rules — you update the rulebook.',
            detail: 'Brand agents apply and evolve compliance checks across all content automatically. Your editorial quality standards are codified as machine-enforceable rules that you govern and refine.',
          },
        },
        'final-edit': {
          preAI: {
            summary: 'Final edits depend entirely on editor availability, blocking your editorial quality timelines.',
            detail: 'A single editor bottleneck means content waits in queue. Your editorial quality deadlines slip because there is no way to parallelize the final polish step.',
          },
          aiAgents: {
            summary: 'AI editing assistants handle mechanical fixes, freeing your editorial quality focus for strategic polish.',
            detail: 'Editing agents catch grammar, style, and consistency issues automatically. Your editorial quality perspective is reserved for nuance and narrative quality.',
          },
          aiAgentic: {
            summary: 'Autonomous editing agents polish content to publication standard — your editorial quality bar is encoded as policy.',
            detail: 'Editing agents handle all mechanical and stylistic refinement autonomously. Your editorial quality standards are embedded as editorial policies that improve with each iteration.',
          },
        },
        'schedule-publish': {
          preAI: {
            summary: 'Publishing is a manual CMS process with no connection to your editorial quality planning.',
            detail: 'Each piece requires manual scheduling, metadata entry, and CMS configuration. Your editorial quality goals are disconnected from the publish timeline.',
          },
          aiAgents: {
            summary: 'AI scheduling agents suggest optimal publish timing based on editorial quality data.',
            detail: 'Publishing agents recommend times and configurations informed by your editorial quality priorities. You approve the schedule rather than manually configuring CMS settings.',
          },
          aiAgentic: {
            summary: 'Autonomous publishing agents manage scheduling end-to-end using editorial quality optimization logic.',
            detail: 'Publishing agents handle CMS configuration, timing optimization, and deployment autonomously within your editorial quality constraints. You set publishing policies, not individual schedules.',
          },
        },
        'distribute': {
          preAI: {
            summary: 'Content distribution is manual channel-by-channel, with limited visibility into editorial quality.',
            detail: 'Each channel requires separate formatting, scheduling, and posting. There is no unified view of how distribution supports your editorial quality objectives.',
          },
          aiAgents: {
            summary: 'AI distribution agents adapt content per channel with editorial quality rules built in.',
            detail: 'Distribution agents format and deploy content across channels following your editorial quality guidelines. You monitor and adjust rather than manually posting to each platform.',
          },
          aiAgentic: {
            summary: 'Autonomous distribution agents manage all channels with editorial quality rules — you govern the playbook.',
            detail: 'Distribution agents deploy, adapt, and optimize content across every channel following your editorial quality playbook. You evolve distribution strategy, not execute individual channel posts.',
          },
        },
        'track-performance': {
          preAI: {
            summary: 'Performance tracking is fragmented across tools, making editorial quality assessment difficult.',
            detail: 'You pull data from analytics dashboards, social platforms, and CRM separately. Building a complete picture for editorial quality requires manual data stitching.',
          },
          aiAgents: {
            summary: 'AI dashboards surface editorial quality metrics in real time without manual data pulling.',
            detail: 'Performance agents aggregate data and highlight the editorial quality signals that matter to you. You analyze trends rather than building dashboards from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous tracking agents monitor editorial quality metrics continuously and trigger alerts and actions.',
            detail: 'Performance agents stream editorial quality data and automatically trigger optimization workflows when thresholds are breached. You define KPIs and review strategic implications.',
          },
        },
        'generate-report': {
          preAI: {
            summary: 'Reports are built manually in spreadsheets, often missing the editorial quality metrics you need.',
            detail: 'Report creation takes hours of data gathering and formatting. The metrics that matter for editorial quality are often buried or missing entirely from standard templates.',
          },
          aiAgents: {
            summary: 'AI generates reports with editorial quality metrics pre-formatted and insights highlighted.',
            detail: 'Reporting agents compile your editorial quality data into structured templates with automated analysis. You add strategic narrative rather than wrangling data.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce editorial quality reports on demand with strategic recommendations.',
            detail: 'Reporting agents generate editorial quality analyses with actionable recommendations automatically. You consume insights and set strategic direction rather than producing reports.',
          },
        },
        'optimize': {
          preAI: {
            summary: 'Content optimization is reactive and slow, with limited connection to editorial quality data.',
            detail: 'Optimization decisions rely on gut feel and delayed data. Your editorial quality insights rarely feed back into content updates in a timely way.',
          },
          aiAgents: {
            summary: 'AI recommends optimizations based on editorial quality signals and historical performance.',
            detail: 'Optimization agents suggest specific changes tied to your editorial quality metrics. You approve and prioritize recommendations rather than diagnosing issues manually.',
          },
          aiAgentic: {
            summary: 'Autonomous optimization agents improve content continuously using editorial quality signals — you set boundaries.',
            detail: 'Optimization agents test, iterate, and improve content based on editorial quality data within your guardrails. You define acceptable ranges and review significant changes.',
          },
        },
        'quality-check': {
          preAI: {
            summary: 'Quality checks are inconsistent manual reviews with no standard editorial quality criteria.',
            detail: 'Quality varies by reviewer and day. There is no automated baseline for readability, accuracy, or editorial quality alignment, leading to uneven content standards.',
          },
          aiAgents: {
            summary: 'AI quality gates enforce baseline standards, letting you focus on editorial quality nuance.',
            detail: 'Quality agents score readability, accuracy, and SEO automatically. Your editorial quality evaluation focuses on strategic alignment rather than mechanical checks.',
          },
          aiAgentic: {
            summary: 'Autonomous quality agents enforce standards continuously — editorial quality baselines are self-maintaining.',
            detail: 'Quality agents apply and evolve quality standards based on your editorial quality benchmarks. You set quality policies that the system enforces and improves over time.',
          },
        },
        'brand-review': {
          preAI: {
            summary: 'Brand reviews are subjective gates that slow your editorial quality pipeline.',
            detail: 'Reviewers apply brand guidelines inconsistently. What passes one review fails the next, creating unpredictable delays in your editorial quality workflow.',
          },
          aiAgents: {
            summary: 'AI brand agents pre-score content, surfacing editorial quality issues before your review.',
            detail: 'Brand review agents apply guidelines consistently and flag editorial quality deviations. You handle exceptions and judgment calls rather than full content scans.',
          },
          aiAgentic: {
            summary: 'Autonomous brand agents review all content at scale — you govern editorial quality policy evolution.',
            detail: 'Brand review agents handle all compliance checking autonomously with your editorial quality rules. You update brand guidelines and review the rare edge case that requires human judgment.',
          },
        },
        'stakeholder-signoff': {
          preAI: {
            summary: 'Stakeholder sign-off is a bottleneck where executives delay your editorial quality timelines.',
            detail: 'Senior approvers are busy and unresponsive. Your editorial quality work stalls while waiting for sign-off, and last-minute changes create downstream chaos.',
          },
          aiAgents: {
            summary: 'AI prepares sign-off packages with editorial quality summaries for faster executive approval.',
            detail: 'Sign-off agents compile context, changes, and editorial quality impact assessments for approvers. Executives review structured summaries rather than raw content.',
          },
          aiAgentic: {
            summary: 'Autonomous agents handle routine sign-offs within editorial quality parameters — executives approve strategy only.',
            detail: 'Sign-off agents clear content that meets all editorial quality criteria automatically. Executives only review strategic pivots or high-risk content that breaches defined thresholds.',
          },
        },
        'performance-review': {
          preAI: {
            summary: 'Performance reviews are infrequent manual assessments that underserve your editorial quality needs.',
            detail: 'Reviews happen quarterly at best, using outdated data. Your editorial quality perspective is often missing from the evaluation criteria entirely.',
          },
          aiAgents: {
            summary: 'AI evaluates content against KPIs and highlights editorial quality trends for your review.',
            detail: 'Review agents surface performance data with editorial quality context pre-attached. You make optimize/archive decisions based on structured analysis rather than raw metrics.',
          },
          aiAgentic: {
            summary: 'Autonomous review agents evaluate and act on performance with editorial quality logic — you set the framework.',
            detail: 'Review agents continuously assess content against your editorial quality KPIs and trigger optimize/refresh/archive workflows automatically. You define the evaluation framework.',
          },
        },
        'social-listening': {
          preAI: {
            summary: 'Social listening is ad hoc keyword monitoring with no systematic link to editorial quality.',
            detail: 'You check social platforms manually for relevant conversations. Insights rarely reach your editorial quality workflow before they become stale or irrelevant.',
          },
          aiAgents: {
            summary: 'AI monitoring tools surface trending topics and sentiment relevant to editorial quality in real time.',
            detail: 'Listening agents track conversations and flag editorial quality signals across platforms. You act on curated insights rather than monitoring feeds manually.',
          },
          aiAgentic: {
            summary: 'Autonomous listening agents track and respond to editorial quality signals across all platforms in real time.',
            detail: 'Listening agents monitor social channels and proactively surface editorial quality opportunities and risks. You set monitoring priorities and review strategic findings.',
          },
        },
        'visual-asset-creation': {
          preAI: {
            summary: 'Visual asset creation is a slow design queue disconnected from your editorial quality needs.',
            detail: 'Design requests go into a backlog with unclear priorities. Your editorial quality requirements are often lost in translation between brief and final asset.',
          },
          aiAgents: {
            summary: 'AI design tools generate asset options aligned with editorial quality requirements.',
            detail: 'Design agents produce visual variants following your editorial quality guidelines. You select and refine from AI-generated options rather than directing from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous design agents produce visual assets within editorial quality guidelines — you set creative direction.',
            detail: 'Design agents generate publication-ready visuals following your editorial quality standards. You define the creative vision and approve hero assets while routine visuals ship autonomously.',
          },
        },
        'legal-review': {
          preAI: {
            summary: 'Legal review is an opaque process that creates unpredictable delays in your editorial quality work.',
            detail: 'Legal feedback arrives late with minimal context. You cannot predict how long review will take, making editorial quality planning unreliable.',
          },
          aiAgents: {
            summary: 'AI legal screening flags compliance risks early, reducing editorial quality surprises downstream.',
            detail: 'Legal agents pre-scan content for regulatory issues and editorial quality risks. You get early warnings rather than discovering problems at the sign-off stage.',
          },
          aiAgentic: {
            summary: 'Autonomous legal agents clear routine content and escalate only true editorial quality risks to human counsel.',
            detail: 'Legal agents scan and clear standard content autonomously using your editorial quality rule framework. Human lawyers handle novel risk scenarios and precedent-setting decisions only.',
          },
        },
        'accessibility-check': {
          preAI: {
            summary: 'Accessibility checking is a manual afterthought, rarely connected to your editorial quality process.',
            detail: 'WCAG compliance and inclusive language reviews happen late in the pipeline. Your editorial quality work is already done when accessibility issues force rework.',
          },
          aiAgents: {
            summary: 'AI accessibility tools catch WCAG violations automatically, protecting your editorial quality standards.',
            detail: 'Accessibility agents scan for inclusive language and alt-text compliance. Your editorial quality requirements benefit from automated baseline checks before human review.',
          },
          aiAgentic: {
            summary: 'Autonomous accessibility agents enforce WCAG and inclusive standards — editorial quality is guaranteed by default.',
            detail: 'Accessibility agents ensure all content meets compliance standards before publication. Your editorial quality benefits from guaranteed accessibility without manual checking overhead.',
          },
        },
        'localize-content': {
          preAI: {
            summary: 'Localization is a slow, manual translation process that delays your editorial quality for global markets.',
            detail: 'Each market requires separate translation, cultural review, and compliance checking. Your editorial quality suffers because localized versions lag weeks behind the original.',
          },
          aiAgents: {
            summary: 'AI translation agents accelerate localization while respecting editorial quality requirements.',
            detail: 'Localization agents produce initial translations with editorial quality context preserved. You review for cultural nuance rather than translating from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous localization agents adapt content for all markets simultaneously — your editorial quality scales globally.',
            detail: 'Localization agents handle translation, cultural adaptation, and regional compliance autonomously. Your editorial quality is maintained across markets without manual per-locale effort.',
          },
        },
        'ab-variant-creation': {
          preAI: {
            summary: 'A/B variants are created manually with limited connection to your editorial quality hypotheses.',
            detail: 'Test variants rely on guesswork rather than data. Your editorial quality insights rarely inform variant design, reducing the value of testing efforts.',
          },
          aiAgents: {
            summary: 'AI generates test variants informed by editorial quality data and historical performance.',
            detail: 'Variant agents create headlines, CTAs, and imagery options based on your editorial quality hypotheses. You select winning approaches rather than brainstorming from zero.',
          },
          aiAgentic: {
            summary: 'Autonomous variant agents design, deploy, and learn from tests using editorial quality hypotheses — you set the agenda.',
            detail: 'Variant agents run continuous testing experiments informed by your editorial quality objectives. You define what to test and review strategic learnings while the system iterates autonomously.',
          },
        },
        'content-repurposing': {
          preAI: {
            summary: 'Content repurposing is manual reformatting, disconnected from your editorial quality goals.',
            detail: 'Each derivative asset is created from scratch. Your editorial quality requirements are not systematically applied when repurposing content across formats.',
          },
          aiAgents: {
            summary: 'AI repurposing agents derive secondary assets with editorial quality consistency built in.',
            detail: 'Repurposing agents transform primary content into channel-specific formats following your editorial quality guidelines. You approve derivatives rather than recreating each manually.',
          },
          aiAgentic: {
            summary: 'Autonomous repurposing agents derive all secondary assets automatically within editorial quality guidelines.',
            detail: 'Repurposing agents transform primary content into every derivative format following your editorial quality rules. You set format strategy while the system handles production at scale.',
          },
        },
        'archive-tag': {
          preAI: {
            summary: 'Content archiving is inconsistent, making editorial quality-related retrieval nearly impossible.',
            detail: 'Tagging and taxonomy are applied inconsistently or not at all. Finding past content relevant to editorial quality requires searching through unstructured repositories.',
          },
          aiAgents: {
            summary: 'AI tagging agents classify content automatically, making editorial quality retrieval faster.',
            detail: 'Archive agents apply taxonomy and metadata based on your editorial quality categories. You validate classifications rather than manually tagging every asset.',
          },
          aiAgentic: {
            summary: 'Autonomous archive agents maintain perfect taxonomy — editorial quality retrieval is instant and reliable.',
            detail: 'Archive agents classify, tag, and organize all content using your editorial quality taxonomy automatically. You evolve the taxonomy structure while the system maintains it flawlessly.',
          },
        },
        'legal-compliance-gate': {
          preAI: {
            summary: 'Legal compliance gates create unpredictable holds that delay your editorial quality deadlines.',
            detail: 'Legal sign-off timing is opaque and variable. Your editorial quality timelines are at the mercy of legal review queues with no visibility into status.',
          },
          aiAgents: {
            summary: 'AI pre-screening reduces legal gate delays by resolving routine editorial quality checks automatically.',
            detail: 'Compliance agents handle standard checks and only escalate editorial quality edge cases to human lawyers. Your timelines are more predictable because routine items clear faster.',
          },
          aiAgentic: {
            summary: 'Autonomous compliance gates clear routine content instantly — only novel editorial quality risks reach human lawyers.',
            detail: 'Compliance agents handle standard legal checks autonomously using your editorial quality risk framework. Human review is reserved for unprecedented scenarios and policy updates.',
          },
        },
        'localization-quality-gate': {
          preAI: {
            summary: 'Localization quality gates are inconsistent, creating editorial quality risks in global markets.',
            detail: 'Quality checks for localized content vary by market and reviewer. Your editorial quality standards are unevenly applied across regions and languages.',
          },
          aiAgents: {
            summary: 'AI quality checks catch translation errors before they affect your editorial quality outcomes.',
            detail: 'Localization QA agents verify accuracy and cultural fit automatically. Your editorial quality standards are applied consistently across all target markets.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents ensure localization quality across all markets — editorial quality is guaranteed globally.',
            detail: 'Localization QA agents validate every market adaptation autonomously against your editorial quality standards. You set quality criteria while the system enforces them at scale.',
          },
        },
        'segment-mapping': {
          preAI: {
            summary: 'Segment mapping is manual spreadsheet work with limited visibility into editorial quality impact.',
            detail: 'Mapping content variants to audience segments is done in spreadsheets. Your editorial quality data is disconnected from the personalization logic.',
          },
          aiAgents: {
            summary: 'AI agents map variants to segments using editorial quality data from the CDP.',
            detail: 'Segment agents recommend variant-audience matches based on your editorial quality signals. You review the mapping rather than building it manually in spreadsheets.',
          },
          aiAgentic: {
            summary: 'Autonomous segment agents map and optimize variant-audience matches using live editorial quality signals.',
            detail: 'Segment agents continuously refine variant-audience mappings based on real-time editorial quality data. You define segmentation strategy while the system executes and optimizes automatically.',
          },
        },
        'dynamic-assembly': {
          preAI: {
            summary: 'Dynamic content assembly is rigid and template-bound, limiting your editorial quality options.',
            detail: 'Personalized experiences require engineering support for each variant. Your editorial quality vision is constrained by inflexible assembly templates.',
          },
          aiAgents: {
            summary: 'AI assembly agents construct personalized experiences informed by editorial quality rules.',
            detail: 'Assembly agents combine content components per segment following your editorial quality logic. You define rules and review outputs rather than manually configuring each variant.',
          },
          aiAgentic: {
            summary: 'Autonomous assembly agents construct personalized experiences in real time — editorial quality logic is self-optimizing.',
            detail: 'Assembly agents build dynamic experiences per segment using your editorial quality rules and real-time behavioral signals. You govern personalization policies, not individual assembly configurations.',
          },
        },
        'personalization-qa': {
          preAI: {
            summary: 'Personalization QA is manual spot-checking that misses editorial quality gaps.',
            detail: 'Testing every segment-variant combination is impossible manually. Your editorial quality concerns are only caught when users report issues post-launch.',
          },
          aiAgents: {
            summary: 'AI QA agents validate personalization coverage and flag editorial quality gaps before launch.',
            detail: 'QA agents test every segment-variant combination against your editorial quality requirements. You review exception reports rather than manually spot-checking combinations.',
          },
          aiAgentic: {
            summary: 'Autonomous QA agents validate every personalization scenario — editorial quality gaps are caught before launch.',
            detail: 'Personalization QA agents test all segment-variant combinations against your editorial quality requirements automatically. You set acceptance criteria while the system validates at scale.',
          },
        },
        'campaign-planning': {
          preAI: {
            summary: 'Campaign planning is a manual coordination effort with fragmented editorial quality inputs.',
            detail: 'Campaign plans are built in decks and spreadsheets with incomplete data. Your editorial quality perspective is often incorporated too late in the planning cycle.',
          },
          aiAgents: {
            summary: 'AI planning agents draft campaign frameworks with editorial quality data pre-integrated.',
            detail: 'Planning agents pull audience, budget, and performance data into campaign templates. Your editorial quality priorities shape the plan from the start rather than being retrofitted.',
          },
          aiAgentic: {
            summary: 'Autonomous planning agents generate campaign frameworks using editorial quality intelligence — you set objectives.',
            detail: 'Planning agents produce data-driven campaign plans with your editorial quality priorities embedded. You define strategic goals while the system optimizes tactics and resource allocation.',
          },
        },
        'consent-check': {
          preAI: {
            summary: 'Consent checking is a manual compliance step that adds friction to your editorial quality process.',
            detail: 'Verifying GDPR/CCPA consent for targeting requires manual cross-referencing. Your editorial quality work is delayed while compliance status is manually confirmed.',
          },
          aiAgents: {
            summary: 'AI consent agents verify targeting compliance automatically, reducing editorial quality friction.',
            detail: 'Consent agents cross-reference CDP signals against GDPR/CCPA rules for your editorial quality needs. You handle exceptions rather than manually verifying every segment.',
          },
          aiAgentic: {
            summary: 'Autonomous consent agents enforce privacy compliance at scale — editorial quality is guaranteed by architecture.',
            detail: 'Consent agents verify targeting compliance in real time across all segments using your editorial quality framework. You set privacy policies while the system enforces them automatically.',
          },
        },
        'paid-creative-production': {
          preAI: {
            summary: 'Paid creative production runs separately from organic, fragmenting your editorial quality oversight.',
            detail: 'Ad creative and organic content are produced in silos. Your editorial quality perspective is applied inconsistently between paid and organic channels.',
          },
          aiAgents: {
            summary: 'AI production agents generate paid variants from organic content with editorial quality consistency.',
            detail: 'Paid creative agents adapt organic content for ad platforms following your editorial quality guidelines. You approve and fine-tune rather than producing ad creative from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous production agents create paid variants at scale within editorial quality guardrails — you set the strategy.',
            detail: 'Paid creative agents generate ad variants from organic content following your editorial quality guidelines. You define creative strategy while the system produces and optimizes at scale.',
          },
        },
        'attribution-modeling': {
          preAI: {
            summary: 'Attribution modeling is manual and unreliable, undermining your editorial quality reporting.',
            detail: 'Last-click attribution dominates despite its flaws. Your editorial quality decisions lack the multi-touch perspective needed for accurate performance assessment.',
          },
          aiAgents: {
            summary: 'AI attribution models surface multi-touch insights relevant to your editorial quality priorities.',
            detail: 'Attribution agents calculate content ROI across channels using your editorial quality weightings. You interpret strategic implications rather than building models manually.',
          },
          aiAgentic: {
            summary: 'Autonomous attribution agents run multi-touch models continuously — editorial quality insights update in real time.',
            detail: 'Attribution agents calculate content ROI across all channels using your editorial quality framework. You interpret strategic implications while the system handles modeling complexity.',
          },
        },
        'executive-reporting': {
          preAI: {
            summary: 'Executive reports are manually assembled, often missing the editorial quality narrative you need.',
            detail: 'Building executive dashboards takes hours of data wrangling. The editorial quality story you want to tell is lost in generic reporting templates.',
          },
          aiAgents: {
            summary: 'AI builds executive dashboards with editorial quality narratives pre-drafted for leadership.',
            detail: 'Reporting agents synthesize data into executive formats with your editorial quality story embedded. You refine the narrative rather than assembling data from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous reporting agents produce executive dashboards with editorial quality narratives — you add strategic context.',
            detail: 'Executive reporting agents synthesize all data into leadership-ready formats with your editorial quality story embedded. You provide strategic commentary on auto-generated insights.',
          },
        },
        'competitive-response': {
          preAI: {
            summary: 'Competitive response is slow and reactive, giving you no editorial quality advantage.',
            detail: 'By the time you spot a competitor move and respond, the moment has passed. Your editorial quality approach cannot adapt fast enough to real-time competitive signals.',
          },
          aiAgents: {
            summary: 'AI competitive agents surface signals and draft responses aligned with editorial quality strategy.',
            detail: 'Competitive agents monitor market moves and suggest editorial quality-aligned responses. You approve and refine reactive content rather than spotting threats manually.',
          },
          aiAgentic: {
            summary: 'Autonomous competitive agents detect and draft responses in real time — editorial quality moves are countered instantly.',
            detail: 'Competitive agents monitor signals, draft responses, and deploy within your editorial quality guardrails. You approve high-stakes responses while routine reactions ship autonomously.',
          },
        },
        'journey-mapping': {
          preAI: {
            summary: 'Journey mapping is a manual exercise that rarely reflects your editorial quality reality.',
            detail: 'Customer journey maps are created in workshops and quickly go stale. Your editorial quality perspective is a snapshot, not a living view of how content performs at each stage.',
          },
          aiAgents: {
            summary: 'AI journey agents map content to lifecycle stages using editorial quality data from the CDP.',
            detail: 'Journey agents dynamically map content to customer stages based on your editorial quality framework. You validate the mapping rather than building it manually in workshops.',
          },
          aiAgentic: {
            summary: 'Autonomous journey agents maintain living maps using real-time editorial quality data — you shape the strategy.',
            detail: 'Journey agents dynamically map content to lifecycle stages using live editorial quality signals. You define journey frameworks while the system optimizes content placement continuously.',
          },
        },
        'sentiment-monitoring': {
          preAI: {
            summary: 'Sentiment monitoring is sporadic manual checking with no systematic link to editorial quality.',
            detail: 'You check brand sentiment reactively rather than proactively. Your editorial quality decisions are made without real-time audience feedback signals.',
          },
          aiAgents: {
            summary: 'AI sentiment agents track brand reception in real time, alerting you to editorial quality risks.',
            detail: 'Sentiment agents analyze audience reactions and flag editorial quality concerns before they escalate. You respond to alerts rather than manually checking platforms.',
          },
          aiAgentic: {
            summary: 'Autonomous sentiment agents monitor and respond to editorial quality signals around the clock — you govern escalation.',
            detail: 'Sentiment agents track audience reactions and trigger editorial quality responses automatically. You set escalation thresholds and review strategic implications of sentiment shifts.',
          },
        },
        'sales-enablement': {
          preAI: {
            summary: 'Sales enablement content is created ad hoc, disconnected from your editorial quality strategy.',
            detail: 'Sales teams request materials outside the content pipeline. Your editorial quality standards are not applied to battle cards, decks, and one-pagers created in isolation.',
          },
          aiAgents: {
            summary: 'AI agents generate sales materials from marketing content with editorial quality alignment.',
            detail: 'Sales enablement agents transform marketing assets into battle cards and decks following your editorial quality standards. You approve rather than creating each piece manually.',
          },
          aiAgentic: {
            summary: 'Autonomous enablement agents keep sales materials current with editorial quality alignment — you set the playbook.',
            detail: 'Enablement agents automatically update battle cards, decks, and case studies as your editorial quality data evolves. You define the sales narrative while the system produces materials at scale.',
          },
        },
        'influencer-brief': {
          preAI: {
            summary: 'Influencer briefs are manual documents with limited editorial quality guardrails.',
            detail: 'Creator briefs are written from scratch each time. Your editorial quality guidelines are inconsistently communicated to external partners and influencers.',
          },
          aiAgents: {
            summary: 'AI agents draft influencer briefs with editorial quality guardrails embedded automatically.',
            detail: 'Brief agents generate creator guidelines from your editorial quality requirements and past successful collaborations. You customize rather than writing each brief from scratch.',
          },
          aiAgentic: {
            summary: 'Autonomous brief agents generate creator guidelines with editorial quality guardrails — you approve partnerships.',
            detail: 'Brief agents produce personalized influencer guidelines using your editorial quality framework and creator history. You focus on relationship strategy while briefs ship autonomously.',
          },
        },
        'ugc-moderation': {
          preAI: {
            summary: 'UGC moderation is manual screening that cannot scale to protect editorial quality.',
            detail: 'User-generated content is reviewed one piece at a time. Your editorial quality standards cannot be consistently enforced across the volume of submissions.',
          },
          aiAgents: {
            summary: 'AI moderation agents screen UGC for brand safety and editorial quality compliance at scale.',
            detail: 'Moderation agents filter user-generated content against your editorial quality criteria. You review borderline cases rather than manually screening every submission.',
          },
          aiAgentic: {
            summary: 'Autonomous moderation agents screen all UGC for editorial quality compliance at scale — you govern edge cases.',
            detail: 'Moderation agents filter user-generated content using your editorial quality rules continuously. You update moderation policies and review borderline cases that the system escalates.',
          },
        },
        'channel-orchestration': {
          preAI: {
            summary: 'Channel orchestration is manual coordination with no systematic editorial quality integration.',
            detail: 'Cross-channel timing is managed in spreadsheets and Slack. Your editorial quality requirements for sequencing and coordination are often overridden by ad hoc changes.',
          },
          aiAgents: {
            summary: 'AI orchestration agents sequence distribution with editorial quality rules for timing and cadence.',
            detail: 'Orchestration agents coordinate cross-channel timing based on your editorial quality requirements. You set rules and review the sequence rather than managing each channel individually.',
          },
          aiAgentic: {
            summary: 'Autonomous orchestration agents manage all channel timing with editorial quality logic — you set the playbook.',
            detail: 'Orchestration agents handle cross-channel sequencing, timing, and coordination autonomously using your editorial quality rules. You evolve the orchestration strategy while the system executes.',
          },
        },
      },
      keyInsight: 'Brief approval is where strategic judgment has the highest leverage. Organizations that automate this gate discover that competitive intuition can\'t be reduced to a scoring rubric.',
    },
  },
  {
    id: 'brand-manager',
    title: 'Brand Manager',
    description: 'Reviews content for brand compliance and can escalate to stakeholder sign-off.',
    tagline: 'Guards tone, voice, and identity.',
    iconName: 'ShieldCheck',
    category: 'governance',
    accentColor: '#D4856A',
    ownedSteps: ['brand-compliance'],
    reviewedGates: ['brand-review'],
    relatedAgents: ['writer-agent'],
    relatedInputs: ['brand-guide'],
    narrative: {
      nodeJourneys: {
        'brand-compliance': {
          preAI: {
            summary: 'You manually review every content piece against brand guidelines for tone, terminology, and visual consistency.',
            detail: 'Most reviews surface no issues — the role is largely routine compliance checking with occasional catches on messaging drift.',
          },
          aiAgents: {
            summary: 'An AI agent pre-scans content for brand voice scores and terminology violations before it reaches you.',
            detail: 'You stop reviewing everything and start reviewing exceptions. Automated checks catch 80% of issues, so your queue drops dramatically.',
          },
          aiAgentic: {
            summary: 'Brand compliance becomes a continuous system property, not a batch review step.',
            detail: 'Agents enforce brand rules during content creation, not after. You define the rules and handle edge cases — cultural sensitivity, emerging trends, reputational judgment.',
          },
        },
        'brand-review': {
          preAI: {
            summary: 'You are the final checkpoint ensuring no off-brand content reaches publication.',
            detail: 'Every piece queues for your review. Volume-driven fatigue means genuine issues occasionally slip through because you\'re reviewing dozens of items daily.',
          },
          aiAgents: {
            summary: 'The gate pre-filters content with brand scoring — only items below threshold reach your review queue.',
            detail: 'Your queue shrinks to items that genuinely need human judgment: tone nuance, cultural context, brand evolution decisions.',
          },
          aiAgentic: {
            summary: 'Brand-compliant content flows through automatically — you review only reputationally sensitive or novel content.',
            detail: 'The gate becomes self-operating for standard content. Your reviews carry more weight because each one involves genuine ambiguity.',
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
      keyInsight: 'Brand risk is reputational risk. The review volume shrinks but each decision carries more weight because only genuinely ambiguous cases reach you.',
    },
  },
  {
    id: 'editor',
    title: 'Editor / Content Lead',
    description: 'Owns the final edit step and co-reviews the quality gate with AI assistance.',
    tagline: 'Last human to touch the words.',
    iconName: 'PenTool',
    category: 'creative',
    accentColor: '#9B7ACC',
    ownedSteps: ['draft-content', 'seo-optimization', 'final-edit', 'accessibility-check'],
    reviewedGates: ['quality-check'],
    relatedAgents: ['writer-agent', 'seo-agent', 'accessibility-agent'],
    relatedInputs: ['brand-guide', 'seo-tools', 'accessibility-standards'],
    narrative: {
      nodeJourneys: {
        'draft-content': {
          preAI: {
            summary: 'You either write the first draft yourself or heavily rewrite whatever a junior writer produces.',
            detail: 'Drafting depends on your availability and expertise. Quality is inconsistent because different writers interpret the brief differently, and you catch problems only at final edit.',
          },
          aiAgents: {
            summary: 'An AI writer produces a structured first draft from the approved brief — you shape the narrative rather than starting from blank.',
            detail: 'Drafts arrive with correct structure, keyword integration, and brand voice applied. Your role shifts from generating words to evaluating whether the argument holds together.',
          },
          aiAgentic: {
            summary: 'Routine content drafts itself end-to-end — you engage only when the brief requires original thinking or creative risk.',
            detail: 'The system handles formulaic content autonomously. Your editorial involvement concentrates on the 20% of content where narrative craft genuinely differentiates the output.',
          },
        },
        'seo-optimization': {
          preAI: {
            summary: 'You or a specialist manually insert keywords, write meta descriptions, and restructure headings for search performance.',
            detail: 'SEO optimization is often an afterthought bolted onto finished drafts. It frequently conflicts with narrative flow, forcing trade-offs between readability and search ranking.',
          },
          aiAgents: {
            summary: 'An SEO agent optimizes keyword placement, meta tags, and heading structure automatically while preserving your editorial intent.',
            detail: 'SEO becomes a parallel process, not a sequential bottleneck. You review the agent\'s changes to ensure optimization hasn\'t flattened the voice or distorted the argument.',
          },
          aiAgentic: {
            summary: 'SEO optimization is embedded in the drafting process — content is born search-ready without a separate optimization step.',
            detail: 'The system integrates SEO constraints during creation rather than retrofitting them. You audit edge cases where search optimization and editorial quality genuinely conflict.',
          },
        },
        'final-edit': {
          preAI: {
            summary: 'You\'re the last person to touch every piece — refining narrative flow, checking facts, and polishing the final draft.',
            detail: 'Much of your time goes to fixing issues that could have been caught earlier: readability problems, SEO gaps, inconsistent structure.',
          },
          aiAgents: {
            summary: 'Writing assistants handle readability scoring, SEO optimization, and structural consistency before content reaches you.',
            detail: 'First drafts arrive cleaner. You spend less time on mechanics and more on whether the piece actually says something worth reading.',
          },
          aiAgentic: {
            summary: 'Routine content bypasses your desk entirely — you edit only pieces requiring narrative judgment.',
            detail: 'The system routes high-scoring content directly to quality check. Your editorial time concentrates on the work where human taste genuinely matters.',
          },
        },
        'quality-check': {
          preAI: {
            summary: 'You run the quality gate, checking every content piece against readability, accuracy, and brand standards.',
            detail: 'Quality reviews are thorough but slow. Each piece gets the same level of scrutiny regardless of complexity or risk.',
          },
          aiAgents: {
            summary: 'Automated quality scoring handles technical metrics — you evaluate narrative quality and editorial judgment.',
            detail: 'Readability, SEO, and structure are pre-scored. You focus on whether the piece achieves its strategic intent, not whether it hits a Flesch score.',
          },
          aiAgentic: {
            summary: 'High-scoring content auto-passes the quality gate — you review only pieces where automated scores diverge from editorial intuition.',
            detail: 'The gate self-operates for standard content. You engage when something scores well technically but feels wrong editorially — the gap no algorithm closes.',
          },
        },
        'accessibility-check': {
          preAI: {
            summary: 'You check alt text, heading hierarchy, and inclusive language manually — often as an afterthought before publication.',
            detail: 'Accessibility compliance is inconsistent because it depends on individual awareness. Issues are caught late, creating rework at the worst possible moment in the pipeline.',
          },
          aiAgents: {
            summary: 'An accessibility agent scans for WCAG violations, missing alt text, and non-inclusive language before content reaches your review.',
            detail: 'Technical compliance is pre-validated. You focus on whether the content genuinely communicates across ability levels, not whether it passes a checklist.',
          },
          aiAgentic: {
            summary: 'Accessibility compliance is built into the creation process — content that fails standards is blocked before it reaches your desk.',
            detail: 'The system enforces accessibility at every step. You engage only when inclusive communication requires editorial judgment — tone for sensitive audiences, language that respects without patronizing.',
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
      keyInsight: 'The irreducible value of this role is taste — the ability to distinguish between technically correct content and genuinely good content.',
    },
  },
  {
    id: 'vp-marketing',
    title: 'VP Marketing / Stakeholder',
    description: 'Final sign-off authority before publication. Oversees scheduling and distribution.',
    tagline: 'Final sign-off before anything ships.',
    iconName: 'Crown',
    category: 'strategy',
    accentColor: '#4A8CC0',
    ownedSteps: ['schedule-publish', 'distribute'],
    reviewedGates: ['stakeholder-signoff'],
    relatedAgents: [],
    relatedInputs: ['content-strategy'],
    narrative: {
      nodeJourneys: {
        'schedule-publish': {
          preAI: {
            summary: 'You manage the publication calendar, coordinating timing across channels and campaigns.',
            detail: 'Calendar conflicts are resolved manually. Scheduling decisions depend on your knowledge of competitive timing and campaign cadence.',
          },
          aiAgents: {
            summary: 'Scheduling agents optimize publication timing based on audience data and channel performance.',
            detail: 'You approve the schedule rather than building it. Agents recommend optimal windows; you override when strategic timing matters more than data.',
          },
          aiAgentic: {
            summary: 'Publication scheduling runs autonomously within your strategic parameters.',
            detail: 'Content publishes when conditions are optimal. You set the parameters and intervene only for high-visibility launches that require executive timing.',
          },
        },
        'distribute': {
          preAI: {
            summary: 'You oversee distribution across channels, ensuring each piece reaches the right audience at the right time.',
            detail: 'Distribution is manual and channel-by-channel. Coordinating multi-channel launches requires chasing teams across email, social, and paid.',
          },
          aiAgents: {
            summary: 'Distribution agents handle channel-specific formatting and delivery — you monitor performance rather than manage logistics.',
            detail: 'Multi-channel distribution happens simultaneously. You track whether the distribution strategy is working, not whether each post went live.',
          },
          aiAgentic: {
            summary: 'Distribution executes automatically across all channels — you govern the strategy, not the operations.',
            detail: 'The system distributes, monitors initial performance, and adjusts in real time. You engage when strategic reallocation is needed, not for execution.',
          },
        },
        'stakeholder-signoff': {
          preAI: {
            summary: 'You approve content individually, signing off on each high-visibility piece before publication.',
            detail: 'Your inbox is a bottleneck. Content waits for your review because every escalation lands at the same desk.',
          },
          aiAgents: {
            summary: 'Upstream gates filter routine issues so only content requiring strategic judgment reaches your inbox.',
            detail: 'Brand, legal, and quality checks happen before you see anything. Your approval queue shrinks to genuinely consequential decisions.',
          },
          aiAgentic: {
            summary: 'You govern the system rather than reviewing individual assets — setting thresholds and escalation rules.',
            detail: 'Most content flows through without your direct approval. You shift from output reviewer to system designer, intervening only where strategic direction is at stake.',
          },
        },
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
      keyInsight: 'Your time is the scarcest resource in the pipeline. The system should protect it by ensuring only irreplaceable decisions reach your desk.',
    },
  },
  {
    id: 'analytics-lead',
    title: 'Analytics Lead',
    description: 'Reviews performance data and decides whether content should be optimized, iterated, or archived.',
    tagline: 'Closes the feedback loop with data.',
    iconName: 'BarChart3',
    category: 'operations',
    accentColor: '#D4AD5E',
    ownedSteps: ['track-performance', 'generate-report', 'optimize', 'attribution-modeling', 'executive-reporting'],
    reviewedGates: ['performance-review'],
    relatedAgents: ['performance-agent', 'optimization-agent'],
    relatedInputs: ['analytics-data', 'cdp-profiles', 'budget-allocation', 'channel-benchmarks'],
    narrative: {
      nodeJourneys: {
        'track-performance': {
          preAI: {
            summary: 'You pull performance metrics manually from each platform and consolidate them into tracking dashboards.',
            detail: 'Data lives in silos — each channel has its own reporting format. Consolidation takes hours before you can even begin analysis.',
          },
          aiAgents: {
            summary: 'A performance agent aggregates metrics across platforms in real time and flags anomalies.',
            detail: 'You stop pulling data and start responding to it. Alerts surface underperformers before they become expensive failures.',
          },
          aiAgentic: {
            summary: 'Performance tracking is continuous and triggers downstream actions automatically.',
            detail: 'The system monitors, flags, and initiates optimization cycles without waiting for your manual review. You design the monitoring thresholds.',
          },
        },
        'generate-report': {
          preAI: {
            summary: 'You build performance reports from scratch for every reporting cycle, tailoring them to each stakeholder audience.',
            detail: 'Report generation is time-consuming and repetitive. By the time insights reach decision-makers, the data is often already stale.',
          },
          aiAgents: {
            summary: 'Reports auto-generate from templates with real-time data — you add narrative interpretation and strategic context.',
            detail: 'The agent handles data assembly and visualization. Your value shifts to explaining what the numbers mean and what should change.',
          },
          aiAgentic: {
            summary: 'Reports generate and distribute on schedule, with AI-written executive summaries you approve or override.',
            detail: 'Routine reporting runs without you. You focus on the interpretive layer — connecting performance data to strategic implications.',
          },
        },
        'optimize': {
          preAI: {
            summary: 'You recommend optimization actions based on performance data — adjusting copy, targeting, or channel mix manually.',
            detail: 'Optimization cycles are slow because each recommendation requires manual analysis, stakeholder alignment, and implementation.',
          },
          aiAgents: {
            summary: 'The agent recommends specific optimizations based on performance patterns — you approve and prioritize.',
            detail: 'Recommendations arrive with supporting data. You decide which optimizations are worth the effort rather than identifying them from raw metrics.',
          },
          aiAgentic: {
            summary: 'Routine optimizations execute automatically — you govern the optimization strategy and handle edge cases.',
            detail: 'The system adjusts targeting, refreshes underperforming copy, and reallocates budget within your guardrails. You intervene when optimization requires strategic judgment.',
          },
        },
        'attribution-modeling': {
          preAI: {
            summary: 'You build attribution models manually, mapping content touchpoints to conversion events across channels.',
            detail: 'Attribution accuracy depends on your modeling assumptions. Cross-channel attribution is approximated because data integration is incomplete.',
          },
          aiAgents: {
            summary: 'An agent runs multi-touch attribution models continuously, surfacing the highest-impact content paths.',
            detail: 'Models update in real time. You interpret results and challenge the model\'s assumptions rather than building the models yourself.',
          },
          aiAgentic: {
            summary: 'Attribution feeds directly into budget allocation and content prioritization — a closed loop you monitor.',
            detail: 'The system connects attribution insights to planning decisions automatically. You validate the model\'s conclusions and flag when business context the model can\'t see should override the data.',
          },
        },
        'executive-reporting': {
          preAI: {
            summary: 'You compile executive summaries by hand, distilling performance data into narratives leadership can act on.',
            detail: 'Executive reports require translating technical metrics into business language. The communication overhead is significant — you\'re an analyst and a storyteller.',
          },
          aiAgents: {
            summary: 'An agent drafts executive summaries from performance data — you refine the narrative and strategic framing.',
            detail: 'The first draft is assembled automatically. You shape the story leadership needs to hear, focusing on implications rather than data compilation.',
          },
          aiAgentic: {
            summary: 'Executive reports auto-generate and distribute on cadence — you review only when metrics cross strategic thresholds.',
            detail: 'Routine reporting reaches leadership without your involvement. You engage when the data tells a story that requires human judgment to interpret.',
          },
        },
        'performance-review': {
          preAI: {
            summary: 'You staff the performance gate, deciding whether each content piece should be optimized, iterated, or archived.',
            detail: 'Every piece queues for your review. Decisions are one-at-a-time, and the backlog grows faster than you can clear it.',
          },
          aiAgents: {
            summary: 'The agent pre-classifies content into optimize/iterate/archive buckets — you confirm or override the recommendation.',
            detail: 'Routine archival and optimization decisions are pre-made. You focus on the ambiguous cases where data supports multiple paths.',
          },
          aiAgentic: {
            summary: 'The performance gate self-operates for clear cases — archiving underperformers and restarting the pipeline for promising content.',
            detail: 'This gate can restart the entire pipeline. The feedback loop runs continuously; you design the decision rules and handle the edge cases where data is genuinely ambiguous.',
          },
        },
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
      keyInsight: 'The performance-review gate can restart the entire pipeline. That feedback loop is what makes this a learning system, not a conveyor belt.',
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
