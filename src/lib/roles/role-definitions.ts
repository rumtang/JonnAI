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
    ownedSteps: ['receive-request', 'write-brief'],
    reviewedGates: ['brief-approval'],
    relatedAgents: ['research-agent', 'writer-agent'],
    relatedInputs: ['content-strategy', 'audience-personas'],
    narrative: {
      today: 'You define the brief, approve it, and hand off to creation. Most of your time goes into scoping requests and reviewing briefs for strategic alignment.',
      future: 'AI agents handle research and first-draft briefs. You shift from writing briefs to approving AI-generated ones — your judgment on strategic fit becomes the bottleneck worth protecting.',
      teamSupport: 'The Research Agent feeds you audience data and competitive insights before you even ask. The Content Writer drafts briefs from your templates. You review, refine, and approve.',
      keyInsight: 'Your role moves from producer to quality gate. The brief-approval checkpoint is where your strategic judgment matters most — everything downstream depends on it.',
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
      today: 'You check every piece of content against brand guidelines — tone, terminology, messaging consistency. When something is off, you send it back or escalate.',
      future: 'AI handles the compliance scan automatically. You only see content that fails the automated brand score threshold — your reviews become exception-based, not routine.',
      teamSupport: 'The Content Writer agent checks brand voice during drafting. By the time content reaches you, most obvious violations are already caught. You focus on the nuanced calls.',
      keyInsight: 'Your escalation path to Stakeholder Sign-off is the safety valve. When the brand score drops below 70%, you trigger human review at the highest level. That authority stays with you.',
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
      today: 'You are the last human to touch content before it goes to stakeholders. You refine narrative flow, check facts, and polish the final draft.',
      future: 'AI agents handle readability scoring, SEO optimization, and factual checking. You focus on what machines cannot — narrative judgment, emotional tone, and the "does this actually say something worth reading?" question.',
      teamSupport: 'The SEO Optimizer ensures search performance. The Content Writer handles readability. The quality-check gate auto-passes when scores are high — you only review what needs a human eye.',
      keyInsight: 'The quality-check gate is your early warning system. When it flags content, you know exactly what to focus on. Your editing time becomes more targeted, not more voluminous.',
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
      today: 'You approve high-visibility content, sign off on sensitive topics, and oversee the publication calendar. Your approval is the last gate before content goes live.',
      future: 'Most content flows through without needing your sign-off — the automated gates catch routine issues. You only see content that is strategically sensitive, legally risky, or executive-visibility.',
      teamSupport: 'Every gate upstream filters content so only the decisions that require your judgment reach you. The Brand Manager escalates brand issues. The quality-check catches technical problems.',
      keyInsight: 'Your time is the scarcest resource in the pipeline. The system is designed to protect it — you should see fewer pieces, but each one genuinely needs your input.',
    },
  },
  {
    id: 'analytics-lead',
    title: 'Analytics Lead',
    description: 'Reviews performance data and decides whether content should be optimized, iterated, or archived.',
    ownedSteps: ['track-performance', 'generate-report', 'optimize'],
    reviewedGates: ['performance-review'],
    relatedAgents: ['performance-agent'],
    relatedInputs: ['analytics-data'],
    narrative: {
      today: 'You monitor content performance, generate reports, and decide what happens next — optimize, iterate with a new brief, or archive. You close the feedback loop.',
      future: 'The Performance Analyst agent monitors in real time and generates reports automatically. You shift from data collection to decision-making — which content deserves another iteration?',
      teamSupport: 'The Performance Analyst agent tracks metrics continuously and flags underperformers. Analytics Data feeds from GA4, HubSpot, and social APIs arrive pre-processed.',
      keyInsight: 'Your performance-review gate can escalate all the way back to a new brief — you have the power to restart the entire pipeline. That feedback loop is what makes the system learn.',
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
      today: 'You maintain the content strategy, define audience personas, and ensure every brief is grounded in real data. You are the "why" behind every piece of content.',
      future: 'AI agents use your strategy documents as their primary input. Your work scales — instead of briefing one writer, your strategy guides every agent in the pipeline simultaneously.',
      teamSupport: 'The Research Agent draws on your audience personas and content strategy to generate insights. Your strategic documents are the foundation that prevents AI output from being generic.',
      keyInsight: 'You do not have a gate, but your influence is everywhere. Every agent that uses Content Strategy or Audience Personas is executing your vision. Your leverage is multiplicative.',
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
