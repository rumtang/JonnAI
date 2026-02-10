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

// 3-stage journey for a specific node within a role
export interface NodeJourney {
  preAI: JourneyStage;
  aiAgents: JourneyStage;
  aiAgentic: JourneyStage;
}

export interface RoleNarrative {
  nodeJourneys: Record<string, NodeJourney>;  // keyed by node ID (ownedSteps + reviewedGates only)
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
      nodeJourneys: {
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
