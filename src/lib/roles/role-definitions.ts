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

export interface JourneyStage {
  summary: string;  // 1 short sentence — the headline
  detail: string;   // 2-3 sentences with one concrete example or mechanism
}

export interface RoleNarrative {
  preAI: JourneyStage;       // "Before AI" — how this role works traditionally
  aiAgents: JourneyStage;    // "With AI Agents" — how individual AI tools change things
  aiAgentic: JourneyStage;   // "Agentic System" — how a full orchestrated system transforms the role
  keyInsight: string;         // Kept — shown on final walkthrough step
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
      preAI: {
        summary: 'You scope every brief by hand, cross-referencing strategy docs and stakeholder requests.',
        detail: 'Most time goes to reconciling conflicting priorities from sales, product, and brand teams. Briefs take days because each one requires manual alignment calls.',
      },
      aiAgents: {
        summary: 'Research agents draft briefs from your templates, pre-populated with audience data.',
        detail: 'You review AI-generated briefs instead of writing them from scratch. Approval decisions that took days now take hours because the strategic context is already assembled.',
      },
      aiAgentic: {
        summary: 'The system generates and routes briefs autonomously — you intervene only on high-stakes or ambiguous requests.',
        detail: 'Routine briefs pass through auto-approval when they meet your scoring thresholds. You spend your time on the 20% of requests where strategic judgment genuinely matters.',
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
        detail: 'Agents enforce brand rules during content creation, not after. You define the rules and handle the edge cases — cultural sensitivity, emerging trends, and reputational judgment calls no algorithm should make.',
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
    ownedSteps: ['final-edit'],
    reviewedGates: ['quality-check'],
    relatedAgents: ['writer-agent', 'seo-agent'],
    relatedInputs: ['brand-guide', 'seo-tools'],
    narrative: {
      preAI: {
        summary: 'You\'re the last person to touch every piece — refining narrative flow, checking facts, and polishing the final draft.',
        detail: 'Much of your time goes to fixing issues that could have been caught earlier: readability problems, SEO gaps, inconsistent structure.',
      },
      aiAgents: {
        summary: 'Writing assistants handle readability scoring, SEO optimization, and structural consistency before content reaches you.',
        detail: 'First drafts arrive cleaner. You spend less time on mechanics and more on whether the piece actually says something worth reading.',
      },
      aiAgentic: {
        summary: 'Quality gates auto-pass when AI scores are high — you only see content that needs editorial judgment.',
        detail: 'The system routes routine content past you entirely. Your reviews focus on narrative quality, emotional resonance, and strategic alignment — things no scoring rubric captures.',
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
      preAI: {
        summary: 'You approve content individually, manage the publication calendar, and sign off on high-visibility pieces.',
        detail: 'Your inbox is a bottleneck. Content waits for your review because every escalation lands at the same desk.',
      },
      aiAgents: {
        summary: 'Upstream gates filter routine issues so only content requiring strategic judgment reaches your inbox.',
        detail: 'Brand, legal, and quality checks happen before you see anything. Your approval queue shrinks to genuinely consequential decisions.',
      },
      aiAgentic: {
        summary: 'You govern the system rather than reviewing individual assets — setting thresholds, escalation rules, and strategic priorities.',
        detail: 'Most content flows through without your direct approval. You shift from output reviewer to system designer, intervening only where strategic direction is at stake.',
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
    relatedAgents: ['performance-agent'],
    relatedInputs: ['analytics-data', 'cdp-profiles', 'budget-allocation', 'channel-benchmarks'],
    narrative: {
      preAI: {
        summary: 'You pull performance reports manually, tag underperformers, and recommend next steps for each content piece.',
        detail: 'Report generation is time-consuming. By the time insights reach decision-makers, the data is already stale.',
      },
      aiAgents: {
        summary: 'A performance agent monitors metrics continuously and generates reports with recommendations automatically.',
        detail: 'You stop collecting data and start interpreting it. Reports arrive pre-built; your value shifts to deciding which content deserves another iteration.',
      },
      aiAgentic: {
        summary: 'Performance data feeds back into the pipeline automatically — triggering optimization, iteration, or archival without manual intervention.',
        detail: 'The feedback loop you used to manage by hand now runs continuously. You design the decision rules and handle the edge cases where data is ambiguous.',
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
    ownedSteps: ['research-insights'],
    reviewedGates: [],
    relatedAgents: ['research-agent'],
    relatedInputs: ['content-strategy', 'audience-personas', 'analytics-data'],
    narrative: {
      preAI: {
        summary: 'You maintain the content strategy, define personas, and brief writers one at a time.',
        detail: 'Your frameworks live in documents that people reference inconsistently. Strategy quality depends on who remembers to check the deck.',
      },
      aiAgents: {
        summary: 'Your strategy documents become machine-readable inputs that agents reference on every task.',
        detail: 'Instead of briefing one writer, your personas and strategy guides feed every agent simultaneously. Consistency goes up because agents don\'t skip the brief.',
      },
      aiAgentic: {
        summary: 'Your strategy is the operating system. Every agent decision traces back to your frameworks.',
        detail: 'One well-maintained strategy doc silently improves the output of every agent and every gate. The better your frameworks, the better the entire system performs.',
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
    ownedSteps: ['schedule-publish', 'distribute', 'optimize', 'channel-orchestration'],
    reviewedGates: ['performance-review'],
    relatedAgents: ['performance-agent', 'personalization-agent'],
    relatedInputs: ['analytics-data', 'content-strategy', 'orchestration-rules', 'media-plan', 'channel-benchmarks'],
    narrative: {
      preAI: {
        summary: 'You manage the publication calendar, coordinate distribution, and track what shipped where.',
        detail: 'Most of the work is operational — scheduling posts, updating spreadsheets, chasing approvals, and reconciling channel-specific formats.',
      },
      aiAgents: {
        summary: 'Distribution agents handle channel-specific formatting and scheduling based on your rules.',
        detail: 'You stop clicking buttons and start writing the rules agents follow. Channel coordination becomes configuration rather than manual work.',
      },
      aiAgentic: {
        summary: 'Orchestration rules you maintain determine how agents coordinate across the entire pipeline.',
        detail: 'You design the operational system rather than running it. When performance drifts, you adjust parameters — agents handle execution at a speed no manual process matches.',
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
    ownedSteps: ['research-insights'],
    reviewedGates: [],
    relatedAgents: ['research-agent'],
    relatedInputs: ['audience-personas', 'analytics-data', 'content-strategy'],
    narrative: {
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
      preAI: {
        summary: 'You provide external review across quality, brand, and strategic alignment — checking work after each major gate.',
        detail: 'Your reviews happen sequentially, adding calendar time at each checkpoint. Scheduling your availability often becomes a pipeline bottleneck.',
      },
      aiAgents: {
        summary: 'AI handles routine compliance screening, so your reviews focus on judgment calls and pattern recognition.',
        detail: 'You spend less time on checklists and more on spotting systemic issues — brand drift, quality trends, strategic misalignment.',
      },
      aiAgentic: {
        summary: 'Your cross-gate view becomes uniquely valuable — you see patterns that specialists in single gates miss.',
        detail: 'You sit across three gates, which means you catch drift the Brand Manager normalized, quality trends the Editor overlooked, and strategic gaps the Content Director didn\'t flag.',
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
    relatedAgents: ['legal-screening-agent'],
    relatedInputs: ['legal-guidelines', 'approval-matrix'],
    narrative: {
      preAI: {
        summary: 'You review every content piece for claims, disclosures, competitor references, and regulated terminology.',
        detail: 'Most reviews are routine clearances that rarely surface issues. But skipping a review is never an option because the downside risk is regulatory.',
      },
      aiAgents: {
        summary: 'A legal screening agent pre-scans for regulated terms, unsubstantiated claims, and missing disclosures.',
        detail: 'Routine compliance is automated. You see only the content that fails the first pass — gray areas where legal precedent matters more than pattern matching.',
      },
      aiAgentic: {
        summary: 'Legal compliance becomes a continuous check, not a batch review — the agent blocks publication until cleared.',
        detail: 'No agent in the system can override a legal hold. Your governance role is non-negotiable by design, and the system enforces that automatically.',
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
      preAI: {
        summary: 'You manage translation, cultural adaptation, and regional compliance for every market you serve.',
        detail: 'Each market has its own constraints — regulatory differences, cultural nuance, local brand voice. Adaptation is manual and market-by-market.',
      },
      aiAgents: {
        summary: 'A localization agent handles translation and initial cultural adaptation, flagging ambiguous cases for your review.',
        detail: 'You review agent output for cultural subtleties machines consistently miss. The exception set is larger than most functions because cultural context is inherently ambiguous.',
      },
      aiAgentic: {
        summary: 'One piece of content is adapted across all markets simultaneously, with your quality gate catching cross-market conflicts.',
        detail: 'A cultural flag in one market can trigger legal review across all markets through cross-gate escalation. Your gate prevents regional problems from becoming global ones.',
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
    relatedAgents: ['writer-agent'],
    relatedInputs: ['brand-guide', 'asset-library'],
    narrative: {
      preAI: {
        summary: 'You create every visual asset — hero images, graphics, infographics — working parallel to the writing pipeline.',
        detail: 'Visual work converges with copy at the quality gate. Timelines depend on your personal bandwidth because every asset requires your direct involvement.',
      },
      aiAgents: {
        summary: 'AI-generated imagery and template systems handle routine visual assets — you art-direct rather than produce.',
        detail: 'Routine graphics come from templates. You step in for high-impact creative and set the visual standards the system follows.',
      },
      aiAgentic: {
        summary: 'Visual production scales without you, but visual judgment doesn\'t — you curate the asset library and define the system\'s aesthetic.',
        detail: 'Agents produce visually compliant assets. You ensure they\'re visually compelling. That distinction is the human value this role protects.',
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
      preAI: {
        summary: 'You design A/B tests, decide which content gets repurposed to which channels, and track variant performance.',
        detail: 'Repurposing is manual — each channel variant is a separate production task. Testing velocity is limited by how fast you can create variants.',
      },
      aiAgents: {
        summary: 'A repurposing agent generates channel variants automatically — you design the experiments, not the assets.',
        detail: 'Format conversion is handled. You focus on which hypotheses to test and which channels to prioritize based on real performance data.',
      },
      aiAgentic: {
        summary: 'Content multiplication happens at pipeline speed — variants are generated, tested, and optimized without manual production.',
        detail: 'You design the experimentation framework. Agents execute at scale. The difference between noise and strategy is still your judgment about which variations generate learning, not just impressions.',
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
      preAI: {
        summary: 'You validate consent signals, check jurisdiction-specific rules, and approve every personalized content delivery.',
        detail: 'Every activation requires your sign-off. The volume of consent checks scales linearly with the number of segments and markets you serve.',
      },
      aiAgents: {
        summary: 'A privacy agent validates consent in real time using your regulatory documentation — one of few agents with autonomous authority.',
        detail: 'Privacy rules are binary, which makes them well-suited for automation. The agent enforces your rules at speed no human team matches.',
      },
      aiAgentic: {
        summary: 'Consent compliance is embedded in the system — no segment activates without passing your automated framework.',
        detail: 'You shift from checking every activation to designing the consent framework and auditing agent decisions. Your role enables personalization at scale rather than constraining it.',
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
    relatedAgents: ['performance-agent'],
    relatedInputs: ['budget-allocation', 'cdp-profiles', 'channel-benchmarks', 'content-strategy', 'influencer-database'],
    narrative: {
      preAI: {
        summary: 'You plan campaigns, allocate budget across channels, and map content to journey stages manually.',
        detail: 'Budget tracking is spreadsheet-based. Attribution is approximate. Campaign-level ROI is calculated after the fact, not during execution.',
      },
      aiAgents: {
        summary: 'Performance agents surface attribution data and budget efficiency scores in real time.',
        detail: 'You stop tracking budget manually and start reallocating based on live data. Campaign adjustments that took weeks now happen in days.',
      },
      aiAgentic: {
        summary: 'Executive reporting feeds directly back into campaign planning, creating a continuous optimization loop.',
        detail: 'The feedback loop between results and planning runs automatically. You design campaign strategy; the system handles tracking, attribution, and reallocation recommendations.',
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
      preAI: {
        summary: 'You manage creator relationships, negotiate collaborations, and manually review UGC for brand and legal compliance.',
        detail: 'Each creator submission is reviewed individually. Rights clearance, disclosure checks, and brand alignment are all manual steps.',
      },
      aiAgents: {
        summary: 'Content moderation and compliance screening happen automatically — you focus on partnership strategy.',
        detail: 'The agent handles first-pass moderation and disclosure checks. You spend more time on which creators strengthen the brand long-term.',
      },
      aiAgentic: {
        summary: 'Creator content flows through the same brand-review gate as internal content — same quality standard, no separate process.',
        detail: 'UGC and influencer content are treated as first-class inputs to the pipeline. Compliance is automated; relationship judgment stays with you.',
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
      preAI: {
        summary: 'This role doesn\'t exist yet in most organizations. Knowledge about how systems work lives in people\'s heads.',
        detail: 'Taxonomy, scoring rules, and workflow logic are tribal knowledge. When someone leaves, the organization loses operational context.',
      },
      aiAgents: {
        summary: 'You formalize tribal knowledge into structured inputs — taxonomy, scoring matrices, orchestration rules — that agents can reason with.',
        detail: 'Every good agent decision traces back to your infrastructure. The difference between a useful agent and a hallucinating one is the context you provide.',
      },
      aiAgentic: {
        summary: 'You maintain the reasoning layer of the entire system. Every improvement you make silently improves every agent and every gate.',
        detail: 'When a new channel launches, you update orchestration rules. When agent performance drifts, you diagnose whether the problem is the agent or its context. This is the compounding asset.',
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
