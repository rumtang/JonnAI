// Role definitions derived from the content production graph's gate reviewers
// and step owners. Each role maps to specific nodes and carries narrative insight.

export type RoleCategory = 'strategy' | 'creative' | 'governance' | 'operations' | 'growth';

export const ROLE_CATEGORIES: Record<RoleCategory, { label: string; subtitle: string; iconName: string }> = {
  strategy:   { label: 'Strategy',   subtitle: 'Set the direction',   iconName: 'Compass' },
  creative:   { label: 'Creative',   subtitle: 'Make the work',       iconName: 'Palette' },
  governance: { label: 'Governance', subtitle: 'Protect the brand',   iconName: 'Shield' },
  operations: { label: 'Operations', subtitle: 'Keep it running',     iconName: 'Settings' },
  growth:     { label: 'Growth',     subtitle: 'Multiply the impact', iconName: 'TrendingUp' },
};

export interface RoleNarrative {
  today: string;
  future: string;
  teamSupport: string;
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
      today: 'You define content briefs, approve them, and hand off to creation. Your time goes into scoping requests and ensuring every piece traces back to a business objective.',
      future: 'You shift from writing briefs to approving AI-generated ones - evaluating strategic fit and audience alignment at a pace that was previously impossible. Your judgment on what to greenlight becomes the highest-leverage decision in the system.',
      teamSupport: 'The Research Agent feeds you audience data before you ask. The Content Writer drafts briefs from your templates. You review, refine, and approve - everything downstream inherits the quality of that decision.',
      keyInsight: 'Your brief-approval checkpoint is where strategic judgment matters most. Organizations that try to automate this gate discover that strategic context and competitive intuition cannot be reduced to a scoring rubric.',
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
      today: 'You check every piece of content against brand guidelines - tone, terminology, visual identity, messaging consistency. Much of your time goes to routine compliance reviews that rarely surface issues.',
      future: 'AI handles the compliance scan automatically, checking brand voice scores and terminology violations. You only see content that fails the automated threshold - your reviews become exception-based, not routine.',
      teamSupport: 'The Content Writer agent checks brand voice during drafting using your brand guide. By the time content reaches you, obvious violations are caught. You focus on nuanced calls requiring cultural awareness.',
      keyInsight: 'Your escalation to stakeholder sign-off is the safety valve. Brand risk is reputational risk, and no organization will delegate reputational judgment to an algorithm. Your role contracts in volume but expands in consequence.',
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
    ownedSteps: ['final-edit'],
    reviewedGates: ['quality-check'],
    relatedAgents: ['writer-agent', 'seo-agent'],
    relatedInputs: ['brand-guide', 'seo-tools'],
    narrative: {
      today: 'You are the last human to touch content before stakeholders. You refine narrative flow, check facts, ensure coherence, and polish the final draft to the standard the brand name demands.',
      future: 'AI agents handle readability scoring, SEO optimization, and factual checking. You focus on what machines consistently fail at - narrative judgment, emotional resonance, and whether a piece actually says something worth reading.',
      teamSupport: 'The SEO Optimizer ensures search performance. The Content Writer handles readability. The quality-check gate auto-passes when scores are high - you only review what needs a human eye.',
      keyInsight: 'The irreducible human value here is taste - the ability to distinguish between content that is technically correct and content that is genuinely good. No scoring rubric captures that, and your role exists to protect it.',
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
      today: 'You approve high-visibility content, sign off on sensitive topics, and oversee the publication calendar. Your approval is the last gate before content goes live.',
      future: 'Most content flows through without your sign-off - automated gates catch routine issues upstream. You shift from approving volume to governing the system itself: setting thresholds, defining escalation rules, and aligning the pipeline with business strategy.',
      teamSupport: 'Every gate upstream filters content so only decisions requiring your judgment reach you. Brand Manager escalates brand issues. Quality-check catches technical problems. Legal clears regulatory risk. When something reaches you, it genuinely needs your attention.',
      keyInsight: 'Your time is the scarcest resource in the pipeline. You do not manage agents directly. You set the parameters within which agents and humans operate, and intervene only where strategic judgment is irreplaceable.',
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
    relatedAgents: ['performance-agent'],
    relatedInputs: ['analytics-data', 'cdp-profiles', 'budget-allocation', 'channel-benchmarks'],
    narrative: {
      today: 'You monitor content performance, generate reports, and decide what happens next - optimize, iterate, or archive. You close the feedback loop that makes the pipeline a learning system.',
      future: 'The Performance Analyst agent monitors in real time and generates reports automatically. You shift from data collection to decision-making - which content deserves another iteration and where budget reallocation has the highest impact.',
      teamSupport: 'The Performance Analyst agent tracks metrics continuously and flags underperformers against your thresholds. Analytics data arrives pre-processed. You interpret what the data means for strategy - agents handle what the data says.',
      keyInsight: 'Your performance-review gate can send content all the way back to a new brief - restarting the entire pipeline. That feedback loop is what makes the system learn. You are the reason this is a cycle, not a conveyor belt.',
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
    ownedSteps: ['research-insights'],
    reviewedGates: [],
    relatedAgents: ['research-agent'],
    relatedInputs: ['content-strategy', 'audience-personas', 'analytics-data'],
    narrative: {
      today: 'You maintain the content strategy, define audience personas, and ensure every brief is grounded in data. You are the reason content exists for a purpose rather than just existing.',
      future: 'AI agents use your strategy documents as their primary input. Instead of briefing one writer, your strategy guides every agent simultaneously. The better your frameworks, the better every agent performs.',
      teamSupport: 'The Research Agent draws on your personas to generate insights. The Content Director uses your strategy to evaluate briefs. The Personalization Agent uses your frameworks for audience-specific experiences. Your documents are the shared context.',
      keyInsight: 'You do not own a gate, but your influence is everywhere. Every agent that references your strategy is executing your vision. One well-maintained strategy document silently improves the output of eleven agents and nine gates.',
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
    ownedSteps: ['schedule-publish', 'distribute', 'optimize', 'channel-orchestration'],
    reviewedGates: ['performance-review'],
    relatedAgents: ['performance-agent', 'personalization-agent'],
    relatedInputs: ['analytics-data', 'content-strategy', 'orchestration-rules', 'media-plan', 'channel-benchmarks'],
    narrative: {
      today: 'You keep the machine running - managing the publication calendar, coordinating distribution across channels, and closing the loop when content underperforms. You are the connective tissue between strategy and results.',
      future: 'AI agents handle real-time distribution decisions and performance monitoring. You shift from execution to orchestration - designing the operational rules agents follow rather than clicking the buttons yourself.',
      teamSupport: 'The Performance Analyst feeds you continuous data. The Personalization Agent handles segment-level delivery. Orchestration rules you maintain determine how agents coordinate. You are designing a system, not running a checklist.',
      keyInsight: 'Your optimize step is where you decide whether to tweak existing content or restart the pipeline. That judgment - knowing when to iterate versus start over - requires system-level awareness. Agents optimize within parameters. You decide when parameters change.',
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
    ownedSteps: ['research-insights'],
    reviewedGates: [],
    relatedAgents: ['research-agent'],
    relatedInputs: ['audience-personas', 'analytics-data', 'content-strategy'],
    narrative: {
      today: 'You are the voice of the customer inside the content pipeline. You build audience personas, analyze behavioral data, and ensure briefs are grounded in what real people actually need and want.',
      future: 'AI agents synthesize audience data at scale, but they still need your frameworks. You shift from gathering insights to curating them - defining which audience signals matter and which are noise.',
      teamSupport: 'The Research Agent uses your personas to generate brief-ready insights. The Content Strategist builds on your audience models. The Personalization Agent segments audiences using your frameworks. Every agent downstream inherits your understanding of the customer.',
      keyInsight: 'Your audience personas are the most-referenced input in the entire graph. When they are sharp, the whole system produces relevant content. When they drift, everything drifts. Your role formalizes tribal knowledge about customers into infrastructure every agent can use.',
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
      today: 'You provide an independent lens, reviewing content at multiple gates to ensure nothing reaches market that could damage the brand or misalign with strategy. Your value is objectivity.',
      future: 'AI handles routine compliance checks. Your role sharpens to high-stakes reviews: sensitive topics, new market entries, brand pivots, and executive-visibility content. You become the trusted advisor for exceptions, not routine.',
      teamSupport: 'The Brand Manager flags issues before they reach you. The quality-check gate pre-screens for technical problems. Legal clears regulatory risk. You see content that has already passed multiple filters - your time goes to judgment calls.',
      keyInsight: 'You sit across three gates - unusual in this system. Your cross-cutting view means you see patterns specialists miss: brand drift the Brand Manager normalized, quality trends the Editor overlooked, strategic misalignment the Content Director did not catch.',
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
    relatedAgents: ['legal-screening-agent'],
    relatedInputs: ['legal-guidelines', 'approval-matrix'],
    narrative: {
      today: 'You review content for legal risk before stakeholder sign-off - claims substantiation, disclosure requirements, competitor references, and regulated terminology. Much of your time goes to routine clearances.',
      future: 'The Legal Screening Agent pre-scans content and flags genuine risks. You shift from reviewing everything to adjudicating exceptions. This is the governance tier where human authority is non-negotiable because consequences are regulatory, not operational.',
      teamSupport: 'The Legal Screening Agent handles the first pass - regulated terms, unsubstantiated claims, missing disclosures. By the time content reaches you, routine compliance is done. You focus on the gray areas where precedent matters more than pattern matching.',
      keyInsight: 'Your legal-compliance-gate can escalate directly to stakeholder sign-off, pausing publication at the highest level. No agent in this system has the authority to override a legal hold. That is by design, not by limitation.',
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
      today: 'You manage content adaptation across markets - translation, cultural nuance, regional regulatory differences, and local brand voice. Each market has its own constraints and you are the person who knows them.',
      future: 'The Localization Agent handles translation and initial cultural adaptation at scale. You shift from translating to curating - reviewing agent output for cultural subtleties and market-specific judgment calls machines consistently miss.',
      teamSupport: 'The Localization Agent uses your style guides and flags cultural sensitivities automatically. The Legal Screening Agent checks regional regulations. You review what agents cannot confidently resolve - a larger exception set than most functions because cultural context is inherently ambiguous.',
      keyInsight: 'Your localization-quality-gate can escalate to legal-compliance, meaning a cultural flag in one market can trigger legal review across all markets. That cross-gate escalation prevents regional problems from becoming global ones.',
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
    relatedAgents: ['writer-agent'],
    relatedInputs: ['brand-guide', 'asset-library'],
    narrative: {
      today: 'You own the visual layer of every content piece - hero images, supporting graphics, infographics, and video thumbnails. Your work runs parallel to the writing pipeline and converges at the quality gate.',
      future: 'AI-generated imagery and template-based design handle routine visual assets. You shift from producing every graphic to art-directing the system - setting visual standards, curating the asset library, and stepping in for high-impact creative.',
      teamSupport: 'The Content Writer provides copy that informs your visual direction. The Brand Voice Guide keeps visual language consistent. The Asset Library gives you approved elements. You define the system that produces visual assets rather than producing each one.',
      keyInsight: 'Your parallel workflow means visuals are ready when copy is ready - not bolted on at the end. The human value you protect is aesthetic judgment: the difference between visually compliant and visually compelling. Agents achieve the former. Only you ensure the latter.',
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
      today: 'You maximize return on every content asset. You design A/B tests, decide which content gets repurposed into which channels, and use performance data to optimize distribution strategy.',
      future: 'The Repurposing Agent generates variants automatically. You shift from producing variants to designing the experimentation framework - which hypotheses to test, which channels to prioritize, and when to double down versus move on.',
      teamSupport: 'The Repurposing Agent handles format conversion. The Performance Analyst feeds you real-time data. The Personalization Agent assembles segment-specific experiences. Channel Benchmarks give you the baseline. You design the strategy; agents execute at scale.',
      keyInsight: 'Volume without strategy is noise. Your role ensures multiplication is strategic - each variant optimized for a specific channel, audience, and intent. The human value is experimental design: knowing which variations generate learning, not just impressions.',
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
      today: 'You are the last line of defense before personalized content reaches a customer. You validate consent signals, check jurisdiction-specific rules, and ensure every segment activation complies with applicable privacy laws.',
      future: 'The Privacy Compliance Agent handles routine consent validation autonomously - one of the few agents with autonomous authority because privacy rules are binary. You shift from checking every activation to designing the consent framework and auditing agent decisions.',
      teamSupport: 'The Privacy Agent validates consent in real time using your regulatory documentation. The Personalization Agent cannot activate a segment without passing your consent check. You set the rules; agents enforce them at speed and consistency no human team could match.',
      keyInsight: 'Your role is the reason this system can personalize at scale without regulatory exposure. Privacy is not a constraint on personalization - it is the prerequisite. Your governance role enables business capability rather than restricting it.',
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
    relatedAgents: ['performance-agent'],
    relatedInputs: ['budget-allocation', 'cdp-profiles', 'channel-benchmarks', 'content-strategy', 'influencer-database'],
    narrative: {
      today: 'You own the strategic layer above the content pipeline. You define campaign objectives, allocate budget across channels, map content to journey stages, and generate the requests that feed the production system.',
      future: 'AI agents surface campaign performance and attribution data in real time. You shift from manual budget tracking to real-time optimization - reallocating spend based on live attribution models and AI-generated recommendations.',
      teamSupport: 'The Performance Analyst feeds you attribution data and budget efficiency scores. The CDP gives you audience-level insight. Channel Benchmarks provide the baseline. The Personalization Agent executes your segment strategy at the individual level.',
      keyInsight: 'You close the largest feedback loop in the system. Executive reporting flows back into campaign planning, which feeds everything downstream. When that loop is tight, the system learns faster. Your role is the difference between a content operation and a revenue engine.',
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
      today: 'You manage creator relationships, negotiate collaborations, and ensure influencer or user-generated content meets brand and legal standards before entering the pipeline. You bridge uncontrolled creator output and controlled brand messaging.',
      future: 'AI agents handle moderation screening and compliance checks on UGC at scale. You shift from reviewing every submission to designing the creator strategy - which voices amplify your brand and which partnerships drive measurable outcomes.',
      teamSupport: 'The Content Writer agent handles initial moderation screening. The Legal Screening Agent checks rights clearance and disclosure compliance. The Influencer Database gives you performance history. You make partnership decisions; agents handle compliance.',
      keyInsight: 'Creator content flows through the same brand-review gate as internal content - same quality standard, no separate process. The human value you protect is relationship judgment: knowing which creators strengthen the brand long-term, not just short-term reach.',
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
      today: 'You maintain the knowledge infrastructure every agent depends on - content taxonomy, scoring matrix, orchestration rules, and semantic relationships between inputs. Every good agent decision traces back to your infrastructure.',
      future: 'Your role is the most leveraged in the pipeline. You design the reasoning layer that makes agents effective. When a new channel launches, you update orchestration rules. When agent performance drifts, you diagnose whether the problem is the agent or the context it was given. You are building the compounding asset.',
      teamSupport: 'Every agent uses at least one input you maintain. The Research Agent draws on your scoring matrix. The Personalization Agent follows your orchestration rules. You do not appear in the workflow, but your infrastructure is present in every decision - invisible, foundational, and the reason everything works.',
      keyInsight: 'This role does not exist in most organizations today. It emerges when you think about AI as a system that needs structured context to reason well. The knowledge graph, taxonomy, and orchestration rules are tribal knowledge made explicit, maintainable, and scalable. Every improvement silently improves every agent and every gate simultaneously.',
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
