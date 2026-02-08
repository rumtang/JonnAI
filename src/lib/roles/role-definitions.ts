// Role definitions derived from the content production graph's gate reviewers
// and step owners. Each role maps to specific nodes and carries narrative insight.

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
  // Node IDs this role directly owns or reviews
  ownedSteps: string[];
  reviewedGates: string[];
  // Related agents and inputs the role depends on
  relatedAgents: string[];
  relatedInputs: string[];
  narrative: RoleNarrative;
}

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    id: 'content-director',
    title: 'Content Director',
    description: 'Owns the brief phase and approves content briefs before creation begins.',
    ownedSteps: ['receive-request', 'write-brief', 'content-governance', 'content-scoring'],
    reviewedGates: ['brief-approval', 'governance-gate'],
    relatedAgents: ['research-agent', 'writer-agent'],
    relatedInputs: ['content-strategy', 'audience-personas', 'scoring-matrix'],
    narrative: {
      today: 'You define content briefs, approve them, and hand off to creation. Most of your time goes into scoping requests, reviewing briefs for strategic alignment, and ensuring every piece of content traces back to a business objective. You are the primary quality gate before anything enters the production pipeline.',
      future: 'AI agents handle research synthesis and first-draft briefs. You shift from writing briefs to approving AI-generated ones - evaluating strategic fit, audience alignment, and competitive positioning at a pace that was previously impossible. The emerging pattern here is the M-shaped supervisor: a generalist who orchestrates multiple specialized agents rather than doing the specialized work yourself. Your judgment on what to greenlight becomes the highest-leverage decision in the system.',
      teamSupport: 'The Research Agent feeds you audience data and competitive insights before you ask. The Content Writer drafts briefs from your templates and strategy documents. You review, refine, and approve - operating as an agent boss who manages a constellation of AI workers rather than a team of humans. The brief-approval gate is your primary control point, and everything downstream inherits the quality of that decision.',
      keyInsight: 'Your role is evolving from producer to architect. The brief-approval checkpoint is where strategic judgment matters most - everything downstream depends on it. Organizations that try to automate this gate discover that strategic context, stakeholder awareness, and competitive intuition cannot be reduced to a scoring rubric. You are the reason content serves the business rather than just filling the calendar.',
    },
  },
  {
    id: 'brand-manager',
    title: 'Brand Manager',
    description: 'Reviews content for brand compliance and can escalate to stakeholder sign-off.',
    ownedSteps: ['brand-compliance'],
    reviewedGates: ['brand-review'],
    relatedAgents: ['writer-agent'],
    relatedInputs: ['brand-guide'],
    narrative: {
      today: 'You check every piece of content against brand guidelines - tone, terminology, visual identity, messaging consistency. When something is off, you send it back or escalate. Much of your time is spent on routine compliance reviews that rarely surface issues.',
      future: 'AI handles the compliance scan automatically, checking brand voice scores, terminology violations, and visual consistency against your codified guidelines. You only see content that fails the automated threshold - your reviews become exception-based, not routine. This mirrors the broader pattern of AI trust engineering: you are designing the trust framework, not manually enforcing it on every asset.',
      teamSupport: 'The Content Writer agent checks brand voice during drafting using your brand guide as its primary reference. By the time content reaches you, most obvious violations are already caught. The governance-gate pre-screens content against scoring criteria. You focus on the nuanced calls that require cultural awareness, competitive context, and the kind of brand intuition that cannot be codified.',
      keyInsight: 'Your escalation path to stakeholder sign-off is the safety valve for the entire system. When the brand score drops below threshold, you trigger human review at the highest level. That authority stays with you because brand risk is reputational risk - and no organization will delegate reputational judgment to an algorithm. Your role contracts in volume but expands in consequence.',
    },
  },
  {
    id: 'editor',
    title: 'Editor / Content Lead',
    description: 'Owns the final edit step and co-reviews the quality gate with AI assistance.',
    ownedSteps: ['final-edit'],
    reviewedGates: ['quality-check'],
    relatedAgents: ['writer-agent', 'seo-agent'],
    relatedInputs: ['brand-guide', 'seo-tools'],
    narrative: {
      today: 'You are the last human to touch content before it goes to stakeholders. You refine narrative flow, check facts, ensure coherence across sections, and polish the final draft. You hold the quality standard for everything that carries the brand name.',
      future: 'AI agents handle readability scoring, SEO optimization, factual checking, and structural consistency. You focus on what machines consistently fail at - narrative judgment, emotional resonance, tonal appropriateness, and the fundamental question of whether a piece actually says something worth reading. This is the T-shaped expert pattern: deep craft expertise applied to the exceptions that automated systems cannot resolve.',
      teamSupport: 'The SEO Optimizer ensures search performance. The Content Writer handles readability and structural formatting. The quality-check gate auto-passes when scores are high - you only review what needs a human eye. Your time shifts from line-editing to narrative direction, which is a higher-leverage use of editorial skill.',
      keyInsight: 'The quality-check gate is your early warning system. When it flags content, you know exactly what to focus on. Your editing time becomes more targeted, not more voluminous. The irreducible human value here is taste - the ability to distinguish between content that is technically correct and content that is genuinely good. No scoring rubric captures that, and your role exists to protect it.',
    },
  },
  {
    id: 'vp-marketing',
    title: 'VP Marketing / Stakeholder',
    description: 'Final sign-off authority before publication. Oversees scheduling and distribution.',
    ownedSteps: ['schedule-publish', 'distribute'],
    reviewedGates: ['stakeholder-signoff'],
    relatedAgents: [],
    relatedInputs: ['content-strategy'],
    narrative: {
      today: 'You approve high-visibility content, sign off on sensitive topics, and oversee the publication calendar. Your approval is the last gate before content goes live. You also own the strategic direction that generates the briefs feeding the entire pipeline.',
      future: 'Most content flows through without needing your sign-off - automated gates catch routine issues upstream. You only see content that is strategically sensitive, legally risky, or executive-visibility. Your role shifts from approving volume to governing the system itself: setting the thresholds, defining the escalation rules, and ensuring the agentic pipeline aligns with business strategy. This is the emerging Chief AI Revenue Officer pattern - an executive who ensures AI-driven operations translate directly to business outcomes.',
      teamSupport: 'Every gate upstream filters content so only decisions requiring your judgment reach you. The Brand Manager escalates brand issues. The quality-check catches technical problems. Legal compliance clears regulatory risk. By the time something lands on your desk, it has already passed multiple automated and human filters - which means when it does reach you, it genuinely needs your attention.',
      keyInsight: 'Your time is the scarcest resource in the pipeline. The system is designed to protect it. The executive insight is that this protection is not just operational efficiency - it is a model of how leadership works in an agentic organization. You do not manage agents directly. You set the parameters within which agents and humans operate, and you intervene only at the points where strategic judgment is irreplaceable.',
    },
  },
  {
    id: 'analytics-lead',
    title: 'Analytics Lead',
    description: 'Reviews performance data and decides whether content should be optimized, iterated, or archived.',
    ownedSteps: ['track-performance', 'generate-report', 'optimize', 'attribution-modeling', 'executive-reporting'],
    reviewedGates: ['performance-review'],
    relatedAgents: ['performance-agent'],
    relatedInputs: ['analytics-data', 'cdp-profiles', 'budget-allocation', 'channel-benchmarks'],
    narrative: {
      today: 'You monitor content performance, generate reports, and decide what happens next - optimize, iterate with a new brief, or archive. You close the feedback loop that makes the pipeline a learning system rather than a production line.',
      future: 'The Performance Analyst agent monitors in real time and generates reports automatically. You shift from data collection to decision-making - which content deserves another iteration, which channels are underperforming, and where budget reallocation would have the highest impact. Your role increasingly resembles what the industry calls an AI operations lead: someone who governs the feedback loops that make agentic systems improve over time.',
      teamSupport: 'The Performance Analyst agent tracks metrics continuously and flags underperformers against your defined thresholds. Analytics data feeds from GA4, HubSpot, and social APIs arrive pre-processed. Attribution models surface which touchpoints drive conversion. You interpret what the data means for strategy - agents handle what the data says.',
      keyInsight: 'Your performance-review gate can send content all the way back to a new brief - you have the power to restart the entire pipeline. That feedback loop is what makes the system learn. Without it, the pipeline produces content in a straight line. With it, every published asset generates intelligence that improves the next one. You are the reason this is a cycle, not a conveyor belt.',
    },
  },
  {
    id: 'content-strategist',
    title: 'Content Strategist',
    description: 'Drives the strategic inputs that ground every brief and agent decision.',
    ownedSteps: ['research-insights'],
    reviewedGates: [],
    relatedAgents: ['research-agent'],
    relatedInputs: ['content-strategy', 'audience-personas', 'analytics-data'],
    narrative: {
      today: 'You maintain the content strategy, define audience personas, and ensure every brief is grounded in data. You are the reason content exists for a purpose rather than just existing.',
      future: 'AI agents use your strategy documents as their primary input. Your work scales in a way that was previously impossible - instead of briefing one writer, your strategy guides every agent in the pipeline simultaneously. The emerging pattern here is infrastructure leverage: your strategic frameworks function like a knowledge graph that every downstream agent queries. The better your frameworks, the better every agent performs.',
      teamSupport: 'The Research Agent draws on your audience personas and content strategy to generate brief-ready insights. The Content Director uses your strategy to evaluate briefs. The Personalization Agent uses your frameworks to assemble audience-specific experiences. Your strategic documents are the shared context that prevents AI output from being generic.',
      keyInsight: 'You do not own a gate, but your influence is everywhere. Every agent that references Content Strategy or Audience Personas is executing your vision. This is the clearest example of how infrastructure compounds: one well-maintained strategy document silently improves the output of eleven agents and nine gates without appearing in any workflow step.',
    },
  },
  {
    id: 'marketing-ops',
    title: 'Marketing Ops',
    description: 'Owns the operational backbone: scheduling, distribution, and the optimization feedback loop.',
    ownedSteps: ['schedule-publish', 'distribute', 'optimize', 'channel-orchestration'],
    reviewedGates: ['performance-review'],
    relatedAgents: ['performance-agent', 'personalization-agent'],
    relatedInputs: ['analytics-data', 'content-strategy', 'orchestration-rules', 'media-plan', 'channel-benchmarks'],
    narrative: {
      today: 'You keep the machine running. You manage the publication calendar, coordinate distribution across channels, and close the loop when content underperforms. You are the connective tissue between strategy and results.',
      future: 'AI agents handle real-time distribution decisions, channel optimization, and performance monitoring. You shift from execution to orchestration - designing the operational rules that agents follow rather than clicking the buttons yourself. This mirrors the AI agent orchestrator role that is emerging across industries: someone who manages the agent stack end-to-end, from the models and data sources to the tools and APIs the agents use.',
      teamSupport: 'The Performance Analyst agent feeds you continuous data. The Personalization Agent handles segment-level delivery. Orchestration rules you maintain determine how agents coordinate across channels. You are designing a system, not running a checklist.',
      keyInsight: 'The optimize step is your superpower. When performance data triggers a re-brief, you decide whether to tweak existing content or restart the pipeline. That operational judgment - knowing when to iterate versus when to start over - is the kind of decision that requires system-level awareness. Agents optimize within parameters. You decide when the parameters themselves need to change.',
    },
  },
  {
    id: 'consumer-insights',
    title: 'Consumer Insights',
    description: 'Owns audience understanding and ensures every piece of content is grounded in real customer data.',
    ownedSteps: ['research-insights'],
    reviewedGates: [],
    relatedAgents: ['research-agent'],
    relatedInputs: ['audience-personas', 'analytics-data', 'content-strategy'],
    narrative: {
      today: 'You are the voice of the customer inside the content pipeline. You build audience personas, analyze behavioral data, and ensure briefs are grounded in what real people actually need and want.',
      future: 'AI agents synthesize audience data at scale, but they still need your frameworks. You shift from gathering insights to curating them - defining which audience signals matter and which are noise. The emerging industry pattern calls this the human-in-the-loop for AI judgment: machines process volume, but you define the interpretive lens that gives data meaning.',
      teamSupport: 'The Research Agent uses your personas and analytics data to generate brief-ready insights. The Content Strategist builds on your audience models. The Personalization Agent segments audiences using your frameworks. Every agent downstream inherits your understanding of the customer.',
      keyInsight: 'Your audience personas are the most-referenced input in the entire graph. Every agent and most human roles depend on them. When your personas are sharp, the whole system produces relevant content. When they drift, everything drifts. This is why KPMG identifies the formalization of tribal knowledge as the single biggest challenge in agentic transformation - your role is the one that does that formalization.',
    },
  },
  {
    id: 'consulting-dd',
    title: 'Consulting (Due Diligence)',
    description: 'External advisory role providing independent review across quality, brand, and strategic alignment gates.',
    ownedSteps: [],
    reviewedGates: ['quality-check', 'brand-review', 'stakeholder-signoff'],
    relatedAgents: ['writer-agent', 'seo-agent'],
    relatedInputs: ['brand-guide', 'content-strategy', 'audience-personas'],
    narrative: {
      today: 'You provide an independent lens. You review content at multiple gates - quality, brand, and stakeholder - to ensure nothing reaches market that could damage the brand or misalign with strategy. Your value is objectivity and cross-cutting perspective.',
      future: 'AI handles routine compliance checks. Your role sharpens to high-stakes reviews: sensitive topics, new market entries, brand pivots, and executive-visibility content. You become the trusted advisor for exceptions, not routine. The pattern here is what IDC calls the AI evaluation function - ensuring systems meet quality, safety, and strategic standards that automated checks cannot fully capture.',
      teamSupport: 'The Brand Manager flags issues before they reach you. The quality-check gate pre-screens for technical problems. The legal-compliance-gate clears regulatory risk. You see content that has already passed multiple filters - your time is spent on judgment calls, not catching errors that agents should have caught.',
      keyInsight: 'You sit across three gates - that is unusual in this system. Most roles own one gate. Your cross-cutting view means you see patterns that specialists miss: a brand drift that the Brand Manager normalized, a quality trend the Editor overlooked, a strategic misalignment the Content Director did not catch. That multi-gate perspective is an emerging organizational capability - the ability to evaluate agentic systems holistically rather than at individual checkpoints.',
    },
  },
  {
    id: 'legal-counsel',
    title: 'Legal Counsel',
    description: 'Owns the legal review step and approves content through the legal compliance gate. Responsible for regulatory risk, IP clearance, and disclosure requirements.',
    ownedSteps: ['legal-review'],
    reviewedGates: ['legal-compliance-gate'],
    relatedAgents: ['legal-screening-agent'],
    relatedInputs: ['legal-guidelines', 'approval-matrix'],
    narrative: {
      today: 'You review content for legal risk before it reaches stakeholder sign-off. You check claims substantiation, disclosure requirements, competitor references, and regulated terminology. Much of your time goes to routine clearances that rarely surface issues.',
      future: 'The Legal Screening Agent pre-scans content against your guidelines and flags only genuine risks. You shift from reviewing everything to adjudicating exceptions - the edge cases where legal judgment cannot be automated. Your throughput increases without your risk tolerance changing. This is the governance tier of an agentic system: the layer where human authority is non-negotiable because the consequences of error are regulatory, not operational.',
      teamSupport: 'The Legal Screening Agent handles the first pass, checking regulated terms, unsubstantiated claims, and missing disclosures. By the time content reaches you, routine compliance is done. You focus on the judgment calls that require legal expertise - the gray areas where precedent matters more than pattern matching.',
      keyInsight: 'The legal-compliance-gate can escalate directly to stakeholder sign-off, which means your flag can pause publication at the highest level. That escalation authority is what makes the system safe for regulated industries - and it is exclusively yours. No agent in this system has the authority to override a legal hold. That is by design, not by limitation.',
    },
  },
  {
    id: 'localization-manager',
    title: 'Localization Manager',
    description: 'Owns the localization step and reviews localized content through the localization quality gate. Responsible for translation accuracy, cultural appropriateness, and regional compliance.',
    ownedSteps: ['localize-content'],
    reviewedGates: ['localization-quality-gate'],
    relatedAgents: ['localization-agent'],
    relatedInputs: ['localization-guides', 'legal-guidelines'],
    narrative: {
      today: 'You manage content adaptation across markets - translation, cultural nuance, regional regulatory differences, and local brand voice. Each market has its own constraints and you are the person who knows them.',
      future: 'The Localization Agent handles translation and initial cultural adaptation at scale. You shift from translating to curating - reviewing agent output for the cultural subtleties and market-specific judgment calls that machines consistently miss. This is where AI reliability engineering meets cultural expertise: you are monitoring agent performance across markets and catching the failures that metrics alone would miss.',
      teamSupport: 'The Localization Agent uses your style guides as its primary reference and flags cultural sensitivities automatically. The Legal Screening Agent checks regional regulatory differences. You review what the agents cannot confidently resolve - which, in localization, is a larger set of exceptions than in most other functions because cultural context is inherently ambiguous.',
      keyInsight: 'Your localization-quality-gate can escalate to the legal-compliance-gate, which means a cultural or regulatory flag in one market can trigger legal review across all markets. That cross-gate escalation prevents regional problems from becoming global ones. It also illustrates a design principle of agentic systems: the most critical governance paths are the ones that connect specialized gates to enterprise-level authority.',
    },
  },
  {
    id: 'creative-director',
    title: 'Creative Director',
    description: 'Owns visual asset creation and ensures all imagery, graphics, and design elements align with the brand and content brief.',
    ownedSteps: ['visual-asset-creation'],
    reviewedGates: ['quality-check'],
    relatedAgents: ['writer-agent'],
    relatedInputs: ['brand-guide', 'asset-library'],
    narrative: {
      today: 'You own the visual layer of every content piece - hero images, supporting graphics, infographics, and video thumbnails. Your work runs parallel to the writing pipeline and converges at the quality gate.',
      future: 'AI-generated imagery and template-based design handle routine visual assets. You shift from producing every graphic to art-directing the system - setting visual standards, curating the asset library, and stepping in for high-impact creative that requires original thinking. The Autodesk AI Jobs Report found that design has overtaken technical expertise as the most in-demand skill in AI-related roles. That is not coincidental - as production becomes automated, the ability to direct what gets produced becomes the differentiator.',
      teamSupport: 'The Content Writer agent provides copy that informs your visual direction. The Brand Voice Guide keeps your visual language consistent. The Asset Library gives you a foundation of approved elements. You operate as a creative orchestrator - defining the system that produces visual assets rather than producing each one manually.',
      keyInsight: 'Visual assets are the most-shared element of any content piece, yet they are often the last step and the most rushed. Your parallel workflow means visuals are ready when copy is ready - not bolted on at the end. The human value you protect is aesthetic judgment: the difference between content that is visually compliant and content that is visually compelling. Agents can achieve the former. Only you can ensure the latter.',
    },
  },
  {
    id: 'growth-lead',
    title: 'Growth Lead',
    description: 'Owns A/B testing strategy, content repurposing, and distribution optimization. Responsible for maximizing content reach and conversion through experimentation.',
    ownedSteps: ['ab-variant-creation', 'content-repurposing', 'segment-mapping', 'paid-creative-production', 'sales-enablement'],
    reviewedGates: ['performance-review'],
    relatedAgents: ['repurposing-agent', 'performance-agent', 'personalization-agent'],
    relatedInputs: ['channel-benchmarks', 'analytics-data', 'content-strategy', 'cdp-profiles', 'personalization-rules', 'media-plan', 'sales-feedback-log'],
    narrative: {
      today: 'You maximize the return on every content asset. You design A/B tests, decide which content gets repurposed into which channels, and use performance data to optimize distribution strategy.',
      future: 'The Repurposing Agent generates variants and derivative content automatically. You shift from producing variants to designing the experimentation framework - which hypotheses to test, which channels to prioritize, and when to double down versus move on. This is where the economics of agentic content production become real: one approved asset becomes ten channel-specific variants, but only if someone designs the strategy behind the multiplication.',
      teamSupport: 'The Repurposing Agent handles format conversion and variant generation. The Performance Analyst feeds you real-time data on what is working. The Personalization Agent assembles segment-specific experiences from your variants. Channel Benchmarks give you the baseline to beat. You design the strategy; agents execute it at scale.',
      keyInsight: 'Content repurposing is where the volume leverage of AI becomes tangible. But volume without strategy is noise. Your role ensures that multiplication is strategic, not just volumetric - that each variant is optimized for a specific channel, audience, and intent. The human value here is experimental design: knowing which variations will generate learning, not just impressions.',
    },
  },
  {
    id: 'privacy-officer',
    title: 'Privacy Officer',
    description: 'Owns consent compliance and privacy validation for all personalized content delivery. Ensures data usage aligns with jurisdictional privacy regulations.',
    ownedSteps: ['consent-check'],
    reviewedGates: ['personalization-qa'],
    relatedAgents: ['privacy-agent', 'personalization-agent'],
    relatedInputs: ['privacy-regulations', 'cdp-profiles'],
    narrative: {
      today: 'You are the last line of defense before personalized content reaches a customer. You validate consent signals, check jurisdiction-specific rules, and ensure every segment activation complies with GDPR, CCPA, and applicable privacy laws.',
      future: 'The Privacy Compliance Agent handles routine consent validation autonomously - it is one of the few agents in the system with autonomous authority because privacy rules are binary. You shift from checking every activation to designing the consent framework and auditing agent decisions. This is the governance tier operating at its purest: clear rules, automated enforcement, human oversight of the system rather than every transaction.',
      teamSupport: 'The Privacy Agent validates consent signals in real time using your regulatory documentation. The Personalization Agent cannot activate a segment without passing your consent check. The CDP feeds you the consent state for every profile in every jurisdiction. You set the rules; agents enforce them at a speed and consistency no human team could match.',
      keyInsight: 'Your role is the reason this system can personalize at scale without regulatory exposure. Without your framework, the Growth Lead cannot activate segments and the Personalization Agent cannot assemble experiences. Privacy is not a constraint on personalization - it is the prerequisite. This pattern - where a governance role enables rather than restricts business capability - is the model for how compliance works in an agentic organization.',
    },
  },
  {
    id: 'campaign-manager',
    title: 'Campaign Manager',
    description: 'Owns campaign planning, journey mapping, and budget allocation. Responsible for the strategic layer that generates content requests and measures campaign-level ROI.',
    ownedSteps: ['campaign-planning', 'journey-mapping'],
    reviewedGates: [],
    relatedAgents: ['performance-agent'],
    relatedInputs: ['budget-allocation', 'cdp-profiles', 'channel-benchmarks', 'content-strategy', 'influencer-database'],
    narrative: {
      today: 'You own the strategic layer above the content pipeline. You define campaign objectives, allocate budget across channels, map content to journey stages, and generate the requests that feed the production system. Every piece of content exists because of a decision you made.',
      future: 'AI agents surface campaign performance and attribution data in real time. You shift from manual budget tracking to real-time optimization - reallocating spend based on live attribution models and AI-generated recommendations. Your role increasingly mirrors the M-shaped supervisor pattern: a generalist who orchestrates across channels, audiences, and budget levers rather than managing any single one in isolation.',
      teamSupport: 'The Performance Analyst agent feeds you attribution data and budget efficiency scores. The CDP gives you audience-level insight into campaign effectiveness. Channel Benchmarks provide the baseline against which you measure every decision. The Personalization Agent executes your segment strategy at the individual level.',
      keyInsight: 'You close the largest feedback loop in the system. Executive reporting flows back into campaign planning, which generates the requests that feed everything downstream. When that loop is tight, the entire system learns faster. When it is slow or broken, the pipeline produces content that is disconnected from business outcomes. Your role is the difference between a content operation and a revenue engine.',
    },
  },
  {
    id: 'partnerships-lead',
    title: 'Partnerships & Influencer Lead',
    description: 'Owns influencer briefs, creator relationships, and UGC moderation. Responsible for the earned and co-created content layer of the content pipeline.',
    ownedSteps: ['influencer-brief', 'ugc-moderation'],
    reviewedGates: ['brand-review'],
    relatedAgents: ['writer-agent'],
    relatedInputs: ['influencer-database', 'brand-guide', 'legal-guidelines'],
    narrative: {
      today: 'You manage creator relationships, negotiate collaborations, and ensure every piece of influencer or user-generated content meets brand and legal standards before it enters the pipeline. You bridge uncontrolled creator output and controlled brand messaging.',
      future: 'AI agents handle moderation screening and compliance checks on UGC at scale. You shift from reviewing every submission to designing the creator strategy - which voices amplify your brand, which partnerships drive measurable outcomes, and how to scale co-creation without losing brand integrity. The human judgment here is relational: understanding creator motivations, audience dynamics, and brand fit in ways that no scoring model captures.',
      teamSupport: 'The Content Writer agent handles initial moderation screening against brand guidelines. The Legal Screening Agent checks rights clearance and disclosure compliance. The Influencer Database gives you performance history and brand affinity scores. You make the partnership decisions; agents handle the compliance infrastructure around them.',
      keyInsight: 'Creator content flows through the same brand-review gate as internally produced content - which means it gets the same quality standard without a separate approval process. Your influencer briefs are the guardrails that make this possible. The human value you protect is relationship judgment: knowing which creators will strengthen the brand long-term, not just generate short-term reach.',
    },
  },
  {
    id: 'context-engineer',
    title: 'Context Engineer',
    description: 'Owns the semantic infrastructure that grounds every agent in the system: knowledge graphs, content taxonomy, scoring matrices, orchestration rules, and the relationships between reference inputs. Responsible for making the system smarter over time.',
    ownedSteps: ['content-governance', 'archive-tag'],
    reviewedGates: ['governance-gate'],
    relatedAgents: ['research-agent', 'personalization-agent', 'legal-screening-agent'],
    relatedInputs: ['content-taxonomy', 'scoring-matrix', 'orchestration-rules', 'personalization-rules', 'approval-matrix'],
    narrative: {
      today: 'You maintain the knowledge infrastructure that every agent depends on. You curate the content taxonomy, refine the scoring matrix, update orchestration rules, and ensure the semantic relationships between inputs remain accurate. Every time an agent makes a good decision, it is because your infrastructure made that decision possible.',
      future: 'As the system matures, your role becomes the most leveraged in the pipeline. You do not produce content or approve gates - you design the reasoning layer that makes agents effective. When a new channel launches, you update the orchestration rules. When a new market opens, you extend the taxonomy. When agent performance drifts, you diagnose whether the problem is the agent or the context it was given. This is the role that embodies the thesis that agents commoditize but infrastructure compounds - you are building the compounding asset.',
      teamSupport: 'Every agent in the system uses at least one input you maintain. The Research Agent draws on your scoring matrix. The Personalization Agent follows your orchestration rules. The Legal Screening Agent references your approval matrix. You do not appear in the production workflow, but your infrastructure is present in every decision. You are to this system what a database architect was to enterprise software: invisible, foundational, and the reason everything works.',
      keyInsight: 'This role does not exist in most organizations today. It emerges when you stop thinking about AI as a tool that speeds up individual tasks and start thinking about it as a system that needs structured context to reason well. KPMG identifies the formalization of tribal knowledge as the single biggest challenge in agentic transformation. That is precisely what this role does. The knowledge graph, the taxonomy, the orchestration rules - these are tribal knowledge made explicit, maintainable, and scalable. That is why this role compounds: every improvement to the infrastructure silently improves every agent and every gate simultaneously.',
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
