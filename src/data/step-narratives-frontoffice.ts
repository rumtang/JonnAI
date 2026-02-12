import { BlockType, ContentBlock, CampaignJourney, CampaignJourneyStage, StepNarrative } from './step-narratives';

export const STEP_NARRATIVES_FRONTOFFICE: Record<string, StepNarrative> = {
  // ============================================================================
  // MARKETING (11 steps)
  // ============================================================================

  'mktg-campaign-planning': {
    headline: 'Campaign Planning: Setting the Strategic Foundation',
    lede: 'Planning defines the funnel shape — poor targeting early compounds through every downstream step.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'Teams often plan campaigns around annual budgets or arbitrary calendar dates rather than market timing and audience readiness. This creates misaligned messaging and wasted spend.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Campaigns with clear audience segments and explicit success metrics (CAC, conversion rate, velocity) outperform "broad reach" plans by 3-5x. The key is planning *backwards* from revenue targets.',
      },
    ],
    roleId: 'marketing-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Manual spreadsheet-driven planning with limited data',
        detail: 'Marketers build plans in Excel, often relying on historical campaign performance and intuition. Segmentation is basic (by company size, industry). Assumptions about conversion rates are rarely validated. Planning takes 2-3 weeks and revisions happen late.',
      },
      aiAgents: {
        summary: 'AI-assisted targeting and market analysis',
        detail: 'AI agents analyze historical campaign data, recommend audience segments based on lookalike modeling, and flag market timing risks. Planners still own decisions but move faster. Reduces planning time to 1 week.',
      },
      aiAgentic: {
        summary: 'Continuous campaign optimization against real-time signals',
        detail: 'AI systems monitor intent signals, competitive activity, and seasonal patterns. Campaigns auto-adjust targeting and messaging mid-flight based on early performance. Planning is continuous, not episodic.',
      },
    },
  },

  'mktg-content-creation': {
    headline: 'Content Creation: Fueling Demand at Scale',
    lede: 'Content quality and relevance determine whether leads engage or ignore — most teams create volume without targeting the right questions.',
    blocks: [
      {
        type: 'tension' as BlockType,
        content:
          'Marketing teams must balance speed (ship 10 pieces/month) with relevance (deep research into prospect pain). Most choose speed. Result: generic content that ranks poorly and converts worse.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Highly targeted content (e.g., industry-specific case studies, role-based guides) generates 5-10x engagement over generic "best practices" pieces. But it takes 3x longer to produce without AI.',
      },
    ],
    roleId: 'marketing-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Manual research and writing — slow, inconsistent voice',
        detail: 'Marketers research competitor messaging, interview customers, write drafts, edit. Each piece takes 10-15 hours. Voice and depth vary. SEO optimization is an afterthought.',
      },
      aiAgents: {
        summary: 'AI-assisted drafting and research',
        detail: 'AI agents analyze competitor content, trending topics, and audience intent keywords. Marketers provide outlines; AI generates first drafts. Editing and brand alignment remain manual. Output increases 2-3x.',
      },
      aiAgentic: {
        summary: 'Fully autonomous content generation with brand guardrails',
        detail: 'AI systems generate, test, and publish content autonomously (blogs, emails, social) within brand guidelines and compliance rules. Humans review only under-performing pieces. Content ships in hours, not days.',
      },
    },
  },

  'mktg-demand-gen': {
    headline: 'Demand Generation: Converting Awareness to Engagement',
    lede: 'Demand gen success depends on message-channel fit — blasting the same message across all channels guarantees waste.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'A SaaS company runs the same webinar invitation across LinkedIn, email, and direct outreach. LinkedIn gets 0.3% CTR (generic ad), email gets 2% (some urgency), and cold outreach gets 12% (personalized). But budgets are split equally.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Campaigns optimized for channel and audience typically generate 40-60% of revenue from 20% of channels. Most teams don\'t know which 20% because they don\'t segment results by intent signal and audience behavior.',
      },
    ],
    roleId: 'marketing-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Manual campaign setup with limited A/B testing',
        detail: 'Marketing deploys campaigns across email, paid ads, and events. A/B testing happens on subject lines or ad copy. No real-time budget reallocation. Results analyzed monthly.',
      },
      aiAgents: {
        summary: 'Real-time performance tracking and recommendation',
        detail: 'AI agents monitor campaign performance hourly, identify top-performing channels and messages, and recommend budget shifts. Marketers approve reallocation. Response time improves from monthly to daily.',
      },
      aiAgentic: {
        summary: 'Fully automated budget optimization and channel selection',
        detail: 'AI systems auto-reallocate budget to high-ROI channels in real time, select messaging and creative variants by audience, and spin up new campaigns based on emerging intent signals.',
      },
    },
  },

  'mktg-lead-scoring': {
    headline: 'Lead Scoring: Separating Signal from Noise',
    lede: 'Most lead scoring models are outdated within 3 months — they freeze behavior patterns that should adapt continuously.',
    blocks: [
      {
        type: 'tension' as BlockType,
        content:
          'A company builds a lead scoring model based on 12 months of historical data. It weights "attended webinar" heavily. Six months later, webinar attendance drops 40% due to market shift, but the model still prioritizes webinar leads. Sales gets flooded with low-quality leads.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Teams with dynamic scoring (updated weekly or monthly against win/loss data) see 30-40% fewer false positives than static models. But 70% of teams use models that haven\'t changed in over a year.',
      },
    ],
    roleId: 'marketing-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Static model built quarterly, rarely revised',
        detail: 'Marketing and Sales build a scoring rubric (interaction points, firmographic filters). Implemented in Marketing Automation platform. Reviewed quarterly. Weights are rarely adjusted.',
      },
      aiAgents: {
        summary: 'Weekly model refresh with win/loss feedback',
        detail: 'AI agents ingest sales win/loss data weekly and recalibrate weights. Marketing reviews monthly reports on model drift. Scoring accuracy improves to 75-80%.',
      },
      aiAgentic: {
        summary: 'Real-time adaptive scoring with behavioral signals',
        detail: 'Models update continuously against real-time pipeline and win/loss signals. Scoring is multivariate (intent, firmographics, engagement velocity, competitive signals). Adapts to market shifts within days.',
      },
    },
  },

  'mktg-lead-nurturing': {
    headline: 'Lead Nurturing: Engagement Over Time',
    lede: 'Nurturing sequences work only if they respond to where a lead is in their journey — one-size-fits-all sequences fail 70% of the time.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'A company sends a 7-email nurture sequence to all leads, regardless of engagement level. 3 of the 7 are case studies. A lead who already saw two case studies abandons. A truly early-stage lead gets hit with ROI math before learning the basics. Unsubscribe rate climbs to 15%.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Dynamic nurturing (adjusting content based on prior engagement and signals) generates 25-35% more conversions and reduces unsubscribe rates by 60%. Most nurturing is still static broadcast.',
      },
    ],
    roleId: 'marketing-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Fixed sequences triggered by list membership',
        detail: 'Marketing builds 3-5 fixed sequences (early stage, mid-funnel, late stage). Leads are placed based on source or score. Sequences play out the same for everyone. Engagement drops 50% by email 4.',
      },
      aiAgents: {
        summary: 'Adaptive sequencing with performance monitoring',
        detail: 'AI agents monitor open/click rates and skip content recipients already engaged with. Suggest sequence branching based on behavior. Marketing QA content and timing. Completion rates improve to 35-40%.',
      },
      aiAgentic: {
        summary: 'Continuous intelligent orchestration',
        detail: 'AI selects next-best content in real time for each lead based on interests, engagement, competitive pressures, and timing signals. Sequences are unique per lead. Conversion rates improve 40-60%.',
      },
    },
  },

  'mktg-content-review-gate': {
    headline: 'Content Review Gate: Quality vs. Velocity',
    lede: 'Content review delays compound — every week of review bottleneck costs a month of lost engagement opportunities.',
    blocks: [
      {
        type: 'decision-tree' as BlockType,
        content:
          'Does the content meet brand guidelines? (Y) → Does it contain compliant claims? (Y) → Can it be published within 2 days? (Y) Fast-track approval. (N) Send to legal review.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Teams with automated compliance scanning and brand-checking reduce review time from 5-7 days to 1-2 days. Fast publication accelerates lead velocity by 15-20%.',
      },
    ],
    roleId: 'marketing-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Manual compliance and brand review — 5-7 day wait',
        detail: 'Content sits in a review queue. One person checks compliance, one checks brand alignment. Bottleneck if either reviewer is on vacation. Average wait: 5-7 days.',
      },
      aiAgents: {
        summary: 'AI-assisted compliance with human brand review',
        detail: 'AI agents scan for claim compliance and brand voice issues, flag risks. Humans review flagged items and approve low-risk content. Wait reduces to 2-3 days.',
      },
      aiAgentic: {
        summary: 'Autonomous approval for compliant, on-brand content',
        detail: 'AI approves low-risk, compliant content automatically. Only escalates novel claims or brand edge cases. Most content publishes same day.',
      },
    },
  },

  'mktg-compliance-gate': {
    headline: 'Compliance Gate: Legal and Regulatory Clearance',
    lede: 'Compliance delays kill campaign momentum — delayed claims become irrelevant claims.',
    blocks: [
      {
        type: 'tension' as BlockType,
        content:
          'Marketing wants to run a campaign promoting cost savings. Legal requires 3 rounds of review to vet the benchmark data. By the time it\'s approved (3 weeks), the competitive environment has shifted and the claim is outdated.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Pre-approved claim templates and auto-compliance scanning reduce legal review from 3-4 weeks to 3-5 days. Templates that bundle claims with their supporting evidence ship immediately.',
      },
    ],
    roleId: 'marketing-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Sequential review with legal — 3-4 weeks typical',
        detail: 'Content goes to legal. Legal requests source documents for claims. Marketing finds sources. Legal reviews. Revisions requested. Repeat 2-3 times.',
      },
      aiAgents: {
        summary: 'Pre-approved templates and AI claim validation',
        detail: 'Marketing uses templates of pre-approved claims (with linked evidence). AI validates new claims against approved sources. Legal spot-checks only novel claims. Wait reduces to 5-7 days.',
      },
      aiAgentic: {
        summary: 'Real-time compliance checking against regulatory database',
        detail: 'AI validates claims instantly against approved sources and regulatory rules. Claims auto-approved if compliant. Humans only review edge cases.',
      },
    },
  },

  'mktg-campaign-approval-gate': {
    headline: 'Campaign Approval: Budget and Strategy Sign-Off',
    lede: 'Approval delays waste budget windows — campaigns that miss seasonal windows miss their audience.',
    blocks: [
      {
        type: 'decision-tree' as BlockType,
        content:
          'Campaign meets target customer profile? (Y) → ROI projection >3x? (Y) → Budget within limit? (Y) Auto-approve. (N) Escalate to executive review.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Campaigns approved within 3 days ship 40% more pipeline than those approved in 2+ weeks. The difference is often just signature delays.',
      },
    ],
    roleId: 'marketing-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Manual approval workflow with multiple sign-offs',
        detail: 'Campaign brief sent to marketing manager, director, and CFO. Each reviews independently. Average wait: 2-3 weeks.',
      },
      aiAgents: {
        summary: 'AI-assisted review with flagged risks',
        detail: 'AI agents review ROI, target fit, and budget alignment. Flag only high-risk campaigns for human review. Standard campaigns auto-approved. Wait reduces to 3-5 days.',
      },
      aiAgentic: {
        summary: 'Real-time approval based on policy guardrails',
        detail: 'AI auto-approves campaigns within policy guardrails (ROI, audience, budget). No human review for standard campaigns.',
      },
    },
  },

  'mktg-mql-qualification-gate': {
    headline: 'MQL Qualification Gate: Sales Handoff Readiness',
    lede: 'MQL quality determines sales efficiency — passing unqualified leads wastes 30% of sales time.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'Marketing passes a lead with a high score but the company is in a non-target vertical and the budget is too small. Sales discovers this on the second call. 45 minutes wasted.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Teams with clear MQL criteria (explicit minimum size, vertical, engagement level) and enforcement see 20-30% higher Sales acceptance rates and 15-20% faster conversion.',
      },
    ],
    roleId: 'marketing-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Score-based pass-through with high rejection',
        detail: 'Leads scoring above X are marked MQL and sent to sales. Sales often rejects them. Feedback is slow. Criteria rarely updated.',
      },
      aiAgents: {
        summary: 'AI-assisted qualification with sales feedback',
        detail: 'AI scores leads and checks against explicit MQL critera (size, vertical, intent). Rejected leads sent back to nurture. Feedback loop monthly. Acceptance improves to 60-70%.',
      },
      aiAgentic: {
        summary: 'Real-time qualification with continuous feedback',
        detail: 'AI qualifies against live criteria, adjusts weights daily based on sales feedback. Acceptance rates reach 80-85%.',
      },
    },
  },

  'mktg-budget-gate': {
    headline: 'Budget Gate: Spend Authorization and Allocation',
    lede: 'Budget decisions made once per quarter create missed opportunities and wasted contingency — dynamic allocation captures 15-20% more pipeline.',
    blocks: [
      {
        type: 'tension' as BlockType,
        content:
          'Q2 budget is allocated equally across channels based on historical averages. But by mid-May, one channel is outperforming 4x. Budget is exhausted. The company leaves money on the table.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Teams with monthly budget reviews and reallocation authority see 20-30% higher pipeline from same spend than those locked into quarterly plans.',
      },
    ],
    roleId: 'marketing-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Quarterly allocation, rarely revisited',
        detail: 'Budget allocated in Q planning meeting. Spend tracked monthly. Reallocation requires executive sign-off.',
      },
      aiAgents: {
        summary: 'Monthly review with reallocation recommendation',
        detail: 'AI analyzes performance monthly, recommends reallocation to top channels. Marketing manager approves or adjusts.',
      },
      aiAgentic: {
        summary: 'Continuous optimization within guardrails',
        detail: 'AI reallocates budget automatically within tolerance (e.g., no channel loses more than 15%). Monthly review for audit only.',
      },
    },
  },

  'mktg-performance-gate': {
    headline: 'Performance Gate: Campaign Viability Check',
    lede: 'Pausing campaigns early saves budget for winners — most teams let losers run the full course.',
    blocks: [
      {
        type: 'decision-tree' as BlockType,
        content:
          'Campaign has completed 25% of budget allocation? Check: cost-per-lead vs. target? If below threshold by 20%+, continue. If above 40%+, pause and reallocate.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Early pause discipline (stopping campaigns at 50% of planned spend if lagging 50%+ on key metric) recovers 15-25% of budget from losers and redirects it to winners.',
      },
    ],
    roleId: 'marketing-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Monthly review, campaigns run planned course',
        detail: 'Campaign performance reviewed monthly. Underperformers are often allowed to run because "we didn\'t give it enough time." Losing budget carries forward.',
      },
      aiAgents: {
        summary: 'Weekly performance monitoring with pause recommendations',
        detail: 'AI tracks weekly performance, flags campaigns off-track. Marketing director approves pause or reallocation. Disciplines improve to 60% of underperformers paused early.',
      },
      aiAgentic: {
        summary: 'Automated pause and reallocation',
        detail: 'AI pauses underperforming campaigns automatically (within pre-set thresholds) and reallocates to top performers.',
      },
    },
  },

  // ============================================================================
  // SALES (11 steps)
  // ============================================================================

  'sales-lead-qualification': {
    headline: 'Lead Qualification: Separating Real Opportunities from Noise',
    lede: 'Sales qualification is the first filter — bad qualification early wastes 20+ hours per false positive.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'Sales receives 50 MQLs per week. Without a clear qualification process, reps spend time on bad fits: small companies, wrong titles, long sales cycles. 30% of conversations end with "we\'re not in the market."',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Teams with clear BANT-style qualification criteria and enforced gatekeeping see 25-35% higher sales productivity (more SQLs per rep) and 10-15% faster cycles.',
      },
    ],
    roleId: 'sales-ops-manager',
    campaignJourney: {
      preAI: {
        summary: 'Reps qualify verbally with loose standards',
        detail: 'Each rep decides if a lead is worth pursuing. Criteria vary. Some reps chase unlikely deals for too long. Qualification is inconsistent.',
      },
      aiAgents: {
        summary: 'AI-assisted qualification before first call',
        detail: 'AI analyzes lead data against BANT criteria (Budget, Authority, Need, Timeline). Suggests qualification questions. Reps decide to pursue. Consistency improves.',
      },
      aiAgentic: {
        summary: 'Automated early-stage qualification',
        detail: 'AI qualifies leads before they reach reps. Only warm, viable leads routed to sales. False positives drop 50%+.',
      },
    },
  },

  'sales-discovery-call': {
    headline: 'Discovery Call: Uncover Real Needs and Competitive Pressure',
    lede: 'Discovery time directly correlates to deal size and close rate — reps rushing discovery skip the insights that matter.',
    blocks: [
      {
        type: 'tension' as BlockType,
        content:
          'A rep books a 30-minute discovery with a prospect. 10 minutes in, they sense budget and authority are there. They jump to the pitch. But they missed that the prospect has been evaluating a competitor for 2 months and is about to make a decision. By skipping discovery, the rep misses the narrow window.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Discovery calls focused on competitive positioning and timing (not just pain points) increase deal size by 20-30% and improve win rate by 15-20%.',
      },
    ],
    roleId: 'sales-ops-manager',
    campaignJourney: {
      preAI: {
        summary: 'Unstructured discovery based on rep experience',
        detail: 'Reps follow their own discovery approach. Some ask about pain. Some jump to product fit. Few probe timing and competitive context. Average discovery call: 30-45 minutes.',
      },
      aiAgents: {
        summary: 'AI-assisted discovery with real-time prompting',
        detail: 'AI listens to call and prompts reps on topics they\'re missing (budget, timeline, competitive status). Call transcript summarized. Deal intel captured. Discovery time increases to 45-60 minutes.',
      },
      aiAgentic: {
        summary: 'AI-conducted discovery with human rep present for relationship',
        detail: 'AI conducts discovery, captures detailed intel, flags risks and opportunities. Rep builds relationship and closes. Cycle time improves 30%.',
      },
    },
  },

  'sales-proposal-creation': {
    headline: 'Proposal Creation: Translating Discovery to Custom Fit',
    lede: 'Generic proposals are ignored — customized proposals that map to the prospect\'s stated needs convert 40-60% higher.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'A rep sends a standard proposal showing all product features. The prospect wanted a solution for their top 3 problems. The proposal buries those 3 in a sea of 20 other features. Prospect loses interest.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Proposals that lead with the prospect\'s stated problems and map your solution to those specific issues generate 25-35% more engagement and 20-25% higher close rates.',
      },
    ],
    roleId: 'sales-ops-manager',
    campaignJourney: {
      preAI: {
        summary: 'Manual document creation from templates',
        detail: 'Reps customize a base template with company name, features overview, and pricing. Customization is light. Takes 3-5 hours per proposal.',
      },
      aiAgents: {
        summary: 'AI-assisted customization and drafting',
        detail: 'AI generates first draft based on discovery notes and account context. Reps customize and personalize. Editing time: 1 hour. Personalization improves 3-5x.',
      },
      aiAgentic: {
        summary: 'Fully automated proposal generation and delivery',
        detail: 'AI creates custom proposal from discovery notes, maps to prospect\'s stated needs, embeds ROI calc, signs off. Proposals ship in minutes. Win rates improve 30-40%.',
      },
    },
  },

  'sales-negotiation': {
    headline: 'Negotiation: Defending Price and Terms',
    lede: 'Negotiation outcomes depend on preparation and understanding the prospect\'s constraints — most reps negotiate blind.',
    blocks: [
      {
        type: 'tension' as BlockType,
        content:
          'Prospect asks for a 20% discount. Rep doesn\'t know the prospect\'s budget constraints, what they\'re comparing against, or how badly they need the solution. Rep caves to 15%. Left $40K on the table.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Reps with real-time intelligence (budget indication, competitive status, decision urgency) defend price points 25-30% better and close 10-15% more deals at target price.',
      },
    ],
    roleId: 'sales-ops-manager',
    campaignJourney: {
      preAI: {
        summary: 'Reps negotiate with limited context',
        detail: 'Rep and prospect go back and forth on pricing. Reps lack data on prospect\'s budget, other options, or urgency. Discount rate often 15-20% below list.',
      },
      aiAgents: {
        summary: 'AI-provided negotiation intel and play guidance',
        detail: 'AI surfaces prospect\'s likely budget, competitor status, and timing signals. Suggests pricing strategies. Rep executes. Discount rate drops to 10-15%.',
      },
      aiAgentic: {
        summary: 'AI-augmented negotiation with guardrail protection',
        detail: 'AI participates in negotiations, suggests concessions and bundling to defend price. Final approval with human rep. Prices hold 90%+ at target.',
      },
    },
  },

  'sales-close': {
    headline: 'Close: Sealing the Deal',
    lede: 'Closing requires clear next steps and commitment — most reps let deals drift into indecision.',
    blocks: [
      {
        type: 'decision-tree' as BlockType,
        content:
          'Prospect has stated a problem you solve? (Y) → Confirmed budget and timeline? (Y) → Identified champion? (Y) → Ask for the deal. If any N, move to next objective before closing.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Reps with disciplined closing sequences (clear milestones, explicit next steps, committed dates) close 15-25% faster and lose fewer deals to "stalled" status.',
      },
    ],
    roleId: 'sales-ops-manager',
    campaignJourney: {
      preAI: {
        summary: 'Informal closing based on rep feel',
        detail: 'Rep decides when to ask for the deal. Timing is often late or premature. Deals linger without clear closure.',
      },
      aiAgents: {
        summary: 'AI surfaces closing readiness signals',
        detail: 'AI monitors deal signals and alerts rep when readiness threshold is met. Rep executes close. Cycle time improves 20%.',
      },
      aiAgentic: {
        summary: 'AI-driven closing workflow with human approval',
        detail: 'AI identifies closure-ready deals, drafts closing email or call script, schedules close meeting. Rep executes. Win rate improves 15-20%.',
      },
    },
  },

  'sales-sql-gate': {
    headline: 'SQL Gate: Sales Readiness Validation',
    lede: 'SQL quality determines sales productivity — bad SQLs tank rep morale and lower close rates 20-30%.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'Marketing marks a lead as SQL based on content engagement. Sales calls them and finds they\'re a student researching for a paper. Sales rejects the lead. But Marketing already counted it toward MQL quota.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Teams with joint Marketing-Sales SQL definition and enforcement see 30-40% fewer rejections and faster cycle time by not wasting reps on unqualified leads.',
      },
    ],
    roleId: 'sales-ops-manager',
    campaignJourney: {
      preAI: {
        summary: 'Marketing-defined SQL, Sales rarely rejects',
        detail: 'Marketing passes leads scoring above threshold. Sales works them but often rejects. No formalized feedback loop. Definition drifts.',
      },
      aiAgents: {
        summary: 'AI-validated SQL with feedback loop',
        detail: 'AI checks leads against SQL criteria before passing to sales. Sales provides feedback weekly. Criteria refined. Acceptance improves to 70-80%.',
      },
      aiAgentic: {
        summary: 'Real-time SQL validation with continuous refinement',
        detail: 'AI validates and gates SQLs daily, adjusts criteria based on win/loss feedback. Acceptance rates reach 85%+.',
      },
    },
  },

  'sales-deal-review-gate': {
    headline: 'Deal Review Gate: Pipeline Quality Assurance',
    lede: 'Deal reviews catch risks early — skipped reviews let bad deals hide in the pipeline until they collapse.',
    blocks: [
      {
        type: 'decision-tree' as BlockType,
        content:
          'Deal size >$50K? → Review with manager: Is there a champion? Is decision timeline confirmed? Is there active competition? If any unclear, deal stays in work column until clarity.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Teams with weekly deal reviews and clear credibility scoring see 30-40% fewer forecast misses and catch 60-70% of at-risk deals early.',
      },
    ],
    roleId: 'sales-ops-manager',
    campaignJourney: {
      preAI: {
        summary: 'Monthly forecasting with limited visibility',
        detail: 'Manager reviews deals once a month. Deep dive is rare. At-risk deals hidden until they slip or close unexpectedly.',
      },
      aiAgents: {
        summary: 'Weekly AI-flagged risk review',
        detail: 'AI identifies at-risk deals based on activity, timeline, and competitive signals. Manager reviews flagged deals weekly. Visibility improves 70%.',
      },
      aiAgentic: {
        summary: 'Real-time risk scoring and automatic escalation',
        detail: 'AI flags at-risk deals automatically, auto-escalates high-value deals, surfaces deals ready to close. Forecast accuracy improves 40%+.',
      },
    },
  },

  'sales-pricing-gate': {
    headline: 'Pricing Gate: Deal Structure and Economics Approval',
    lede: 'Pricing approval delays kill closing momentum — approval must happen in <48 hours or deals drift.',
    blocks: [
      {
        type: 'tension' as BlockType,
        content:
          'Rep and prospect agree on terms. Deal goes for pricing review. Finance approves in 5 days. Prospect\'s internal deadline passed. Deal dies.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Companies with pre-approved pricing bands and automated approval for standard deals close 20-30% faster. Deal desk approves 90% of deals same-day.',
      },
    ],
    roleId: 'deal-desk-manager',
    campaignJourney: {
      preAI: {
        summary: 'Deal desk review — 3-5 day wait',
        detail: 'Rep submits deal. Deal desk analyst reviews pricing, terms, and margins. Sends questions back. Average approval time: 3-5 days.',
      },
      aiAgents: {
        summary: 'AI-assisted deal validation with expedited review',
        detail: 'AI validates pricing against guidelines, flags non-standard terms, checks margins. Deal desk focuses on exceptions. Approval time: 1-2 days.',
      },
      aiAgentic: {
        summary: 'Automatic approval for standard deals',
        detail: 'AI approves deals within pricing bands and standard terms automatically. Only flagged deals require human review. Most deals approve same-day.',
      },
    },
  },

  'sales-forecast-gate': {
    headline: 'Forecast Gate: Deal Credibility and Stage Verification',
    lede: 'Forecast accuracy drives exec decision-making — inflated forecasts trigger bad company decisions.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'Sales forecasts $5M in deals for month. Half are in "proposal" stage with no confirmed decision date. Month ends with $2.5M close. CFO is blindsided and cuts hiring. By next month, the delay cascades.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Teams with clear stage definitions and credibility scoring (probability by stage based on actual close history) forecast 85-90% accurately. Most teams are 60-70% accurate.',
      },
    ],
    roleId: 'sales-ops-manager',
    campaignJourney: {
      preAI: {
        summary: 'Manager-assigned stage, subjective probability',
        detail: 'Manager reviews pipeline. Stage assignment varies by rep. Probability is often rep optimism. Forecast misses >30% typical.',
      },
      aiAgents: {
        summary: 'AI-recommended stage with manager validation',
        detail: 'AI assigns stage based on activity and signals. Manager reviews and confirms. Probability weighted by historical conversion. Accuracy improves to 75-80%.',
      },
      aiAgentic: {
        summary: 'Automated stage assignment with activity-based credibility',
        detail: 'AI assigns stage and probability based on activity and conversion history. Manager override capability. Forecast accuracy: 85%+.',
      },
    },
  },

  'sales-legal-gate': {
    headline: 'Legal Gate: Contract Review and Approval',
    lede: 'Legal delays are the last-mile killer — deals close but signature slips into next month.',
    blocks: [
      {
        type: 'tension' as BlockType,
        content:
          'Deal is ready to close. Contract sent to legal for review. Legal identifies non-standard term and requests negotiation. Prospect balks. Deal slips 30 days.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Pre-approved contract templates and streamlined legal review reduce signature time from 10-15 days to 3-5 days. Late-month closes that slip to next month drop 50%.',
      },
    ],
    roleId: 'sales-ops-manager',
    campaignJourney: {
      preAI: {
        summary: 'Full legal review for each contract — 2 week wait',
        detail: 'Sales submits contract. Legal reviews for compliance and risks. Requests changes. Rep and prospect negotiate. Legal approves.',
      },
      aiAgents: {
        summary: 'Pre-approved templates with AI review',
        detail: 'Reps use pre-approved templates with standard terms. AI checks for deviations. Non-standard terms flagged for legal review. Wait reduces to 5-7 days.',
      },
      aiAgentic: {
        summary: 'Automated approval for templated deals',
        detail: 'Contracts auto-approved if they match standard template. Only novel terms escalate to legal. Most deals sign in 2-3 days.',
      },
    },
  },

  'sales-win-loss-gate': {
    headline: 'Win-Loss Gate: Competitive and Deal Feedback Loop',
    lede: 'Win-loss data is the fastest feedback loop to sales strategy — teams that close it quickly adapt faster.',
    blocks: [
      {
        type: 'metric' as BlockType,
        content:
          'Teams that close the win-loss feedback loop within 1-2 weeks see 15-20% higher overall win rate because they adapt messaging faster. Delays beyond 3 weeks lose relevance.',
      },
      {
        type: 'scenario' as BlockType,
        content:
          'Competitor A wins 3 deals in a row against you in the same vertical. If feedback loops back to sales in 2 weeks, reps adjust positioning next week. If feedback takes 6 weeks, 15 more deals go to competitor first.',
      },
    ],
    roleId: 'sales-ops-manager',
    campaignJourney: {
      preAI: {
        summary: 'Quarterly win-loss analysis',
        detail: 'Lost deals reviewed once per quarter. Insights are backward-looking. Competitive patterns take months to emerge.',
      },
      aiAgents: {
        summary: 'Weekly win-loss trending and alert',
        detail: 'AI tracks wins and losses weekly, identifies emerging patterns. Sales manager reviews. Sales adapts messaging.',
      },
      aiAgentic: {
        summary: 'Real-time win-loss feedback with automated coaching',
        detail: 'AI analyzes each win/loss, identifies competitive or messaging factors, alerts sales manager immediately. Pattern-based coaching automated.',
      },
    },
  },

  // ============================================================================
  // SERVICE (10 steps)
  // ============================================================================

  'svc-ticket-creation': {
    headline: 'Ticket Creation: Capturing and Categorizing Requests',
    lede: 'Ticket creation quality determines routing and resolution speed — bad categorization adds 20-30% to resolution time.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'A customer submits "I can\'t log in." The ticket is categorized as billing. It goes to the billing queue. Billing sees it\'s not their problem and reassigns to technical support. 48 hours lost.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Accurate categorization on first submission reduces reassignment rate below 10% and improves first-response time by 25-30%.',
      },
    ],
    roleId: 'service-ops-manager',
    campaignJourney: {
      preAI: {
        summary: 'Manual ticket categorization by customer or intake',
        detail: 'Customer selects category, or intake agent reads and categorizes. Accuracy is 70-80%. Reassignments common.',
      },
      aiAgents: {
        summary: 'AI-assisted categorization with confidence scoring',
        detail: 'AI reads request and suggests category with confidence score. Intake agent confirms or corrects. Accuracy improves to 90%+.',
      },
      aiAgentic: {
        summary: 'Automatic categorization with self-correction',
        detail: 'AI categorizes tickets. Misrouted tickets are auto-detected from context and rerouted. Reassignment drops below 5%.',
      },
    },
  },

  'svc-triage': {
    headline: 'Triage: Urgency Assessment and Queue Management',
    lede: 'Triage speed determines SLA compliance — triage delays compound through the rest of the workflow.',
    blocks: [
      {
        type: 'decision-tree' as BlockType,
        content:
          'Is the customer unable to use core product? → Severity 1 (4-hour SLA). Is a feature broken but workaround exists? → Severity 2 (8-hour SLA). Is this a feature request? → Severity 3 (no SLA).',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Teams with clear triage criteria and automated priority assignment process P1 tickets 15 minutes faster and reduce SLA misses by 20-30%.',
      },
    ],
    roleId: 'service-ops-manager',
    campaignJourney: {
      preAI: {
        summary: 'Manual triage by supervisor — 30-60 min delay',
        detail: 'Tickets queue. Supervisor reviews in batches. Assigns priority and queue. Delay: 30-60 minutes. Urgent tickets may wait.',
      },
      aiAgents: {
        summary: 'AI-assigned priority with supervisor validation',
        detail: 'AI reads ticket and assigns priority based on keywords and history. Supervisor validates high-priority tickets. Triage time: <5 minutes.',
      },
      aiAgentic: {
        summary: 'Automatic priority assignment with escalation rules',
        detail: 'AI assigns priority automatically. Auto-escalates P1 to available agent immediately. Triage: <1 minute.',
      },
    },
  },

  'svc-resolution': {
    headline: 'Resolution: Finding and Implementing Answers',
    lede: 'Resolution speed depends on knowledge access and agent training — fragmented knowledge adds 30-40% to resolution time.',
    blocks: [
      {
        type: 'tension' as BlockType,
        content:
          'A customer reports a bug. The agent searches the knowledge base, finds 3 similar issues. One mentions a workaround. Agent has to read all 3 to find it. Another agent, newer, checks with a senior. Total time: 2.5 hours to resolve.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Teams with AI-powered knowledge synthesis and first-call resolution tooling achieve 70-80% first-contact resolution rates. Without AI, most teams average 40-50%.',
      },
    ],
    roleId: 'service-ops-manager',
    campaignJourney: {
      preAI: {
        summary: 'Manual knowledge search and expert consultation',
        detail: 'Agent searches KB or asks a senior. Time to resolution depends on agent experience. Average first-contact resolution: 45%.',
      },
      aiAgents: {
        summary: 'AI-synthesized solutions with agent approval',
        detail: 'AI searches KB, synthesizes solution, presents to agent with confidence score. Agent reviews and implements. FCR improves to 60-65%.',
      },
      aiAgentic: {
        summary: 'AI-assisted or fully AI-executed resolution',
        detail: 'AI provides or executes resolution directly (e.g., password reset, refund processing). Human-approved complex cases. FCR reaches 75-80%.',
      },
    },
  },

  'svc-knowledge-update': {
    headline: 'Knowledge Update: Closing the Learning Loop',
    lede: 'Knowledge bases decay within 3 months without continuous update — stale solutions frustrate customers and agents.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'A new feature ships. Support gets 50 tickets about it. Agents resolve them with workarounds. No one updates the KB. Next month, the same 50 tickets repeat.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Teams that update knowledge immediately after resolution (within 1 day) reduce repeat tickets 40-50%. Most teams update sporadically, if at all.',
      },
    ],
    roleId: 'service-ops-manager',
    campaignJourney: {
      preAI: {
        summary: 'Manual KB updates by specialists — low frequency',
        detail: 'Agents resolve issues. KB update is optional task. Update specialists work on backlog. Updates lag issues by weeks or months.',
      },
      aiAgents: {
        summary: 'AI-drafted KB entries for agent review',
        detail: 'AI drafts KB entry from ticket resolution. Agent reviews and approves. KB entry posted same day. Coverage improves 50%.',
      },
      aiAgentic: {
        summary: 'Auto-published KB entries with periodic review',
        detail: 'AI creates and publishes KB entries immediately. Auto-removed if marked obsolete. Quarterly review for quality. Knowledge stays current.',
      },
    },
  },

  'svc-escalation': {
    headline: 'Escalation: Routing Complex Issues to Specialists',
    lede: 'Escalation timing determines customer satisfaction — late escalations frustrate customers who\'ve been mishandled.',
    blocks: [
      {
        type: 'decision-tree' as BlockType,
        content:
          'Has agent attempted standard resolution? (Y) → Is issue still unresolved after 2 hours? (Y) → Escalate to specialist team. No point delaying further.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Teams with clear escalation criteria and fast specialist access see 20-25% faster MTTR on complex issues and higher CSAT.',
      },
    ],
    roleId: 'service-ops-manager',
    campaignJourney: {
      preAI: {
        summary: 'Agent-initiated escalation via manual process',
        detail: 'Agent decides to escalate. Sends ticket to specialist queue. Delay while specialist becomes available: 1-4 hours.',
      },
      aiAgents: {
        summary: 'AI-recommended escalation with agent approval',
        detail: 'AI identifies unresolvable issues early and recommends escalation. Agent confirms. Specialist notified immediately.',
      },
      aiAgentic: {
        summary: 'Automatic escalation based on resolution failure',
        detail: 'AI escalates automatically if resolution attempts fail. Specialist assigned immediately. MTTR improves 30-40%.',
      },
    },
  },

  'svc-priority-gate': {
    headline: 'Priority Gate: Workload Balancing and SLA Management',
    lede: 'Priority discipline prevents high-priority work from getting buried — without it, P2s and P3s consume 40% of P1 time.',
    blocks: [
      {
        type: 'metric' as BlockType,
        content:
          'Teams that enforce priority discipline (all available reps work P1s until clear, then move to P2) hit SLA targets 85-90% of the time. Without discipline: 60-65%.',
      },
      {
        type: 'scenario' as BlockType,
        content:
          'A P1 and a P3 both need attention. The P3 is a regular customer and the rep feels obligated. P1 SLA misses by 15 minutes.',
      },
    ],
    roleId: 'service-ops-manager',
    campaignJourney: {
      preAI: {
        summary: 'Manual workload assignment by supervisor',
        detail: 'Supervisor assigns tickets. Enforcement depends on rep discipline. P1s often delayed by P2/P3 work.',
      },
      aiAgents: {
        summary: 'AI-recommended assignment with dashboard visibility',
        detail: 'AI recommends ticket assignment based on priority and agent load. Supervisor monitors. SLA compliance improves to 75-80%.',
      },
      aiAgentic: {
        summary: 'Automatic assignment with escalation and override tracking',
        detail: 'AI assigns tickets automatically by priority. Override tracking for transparency. SLA compliance reaches 90%+.',
      },
    },
  },

  'svc-sla-gate': {
    headline: 'SLA Gate: Service Level Compliance Monitoring',
    lede: 'SLA breaches damage customer trust — 80% of customers switch providers after missed commitments.',
    blocks: [
      {
        type: 'tension' as BlockType,
        content:
          'A ticket is 1 hour from SLA miss. No one noticed because it\'s buried in a queue. It misses by 45 minutes. Customer escalates to vendor leadership.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Teams with real-time SLA monitoring and escalation at 30-60 min window achieve 95%+ SLA compliance. Most teams monitor only at the breach point.',
      },
    ],
    roleId: 'service-ops-manager',
    campaignJourney: {
      preAI: {
        summary: 'Daily SLA reporting, reactive responses',
        detail: 'SLAs reported daily. By then, breaches already happened. Reactive recovery mode.',
      },
      aiAgents: {
        summary: 'Real-time SLA monitoring with 1-hour warning',
        detail: 'AI monitors all tickets. Alerts supervisor 1 hour before breach. Manual intervention. Compliance improves to 85-90%.',
      },
      aiAgentic: {
        summary: 'Automatic pre-emptive escalation and override',
        detail: 'AI escalates at-risk tickets automatically to speed resolution. Human-in-loop for approval. Compliance: 95%+.',
      },
    },
  },

  'svc-escalation-gate': {
    headline: 'Escalation Gate: Executive and Premium-Track Routing',
    lede: 'Executive escalations must be fast and visible — slow escalations damage strategic relationships.',
    blocks: [
      {
        type: 'decision-tree' as BlockType,
        content:
          'Is customer a strategic account or contract is $1M+? → Fast-track to escalation manager. Is this a public complaint or security issue? → Immediate executive notification.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Strategic account escalations resolved in 4 hours average (with executive involvement) see 90% retained contracts. Standard escalations resolved in 24 hours see 70% retention.',
      },
    ],
    roleId: 'service-ops-manager',
    campaignJourney: {
      preAI: {
        summary: 'Escalation manager manually identifies and routes',
        detail: 'Escalation manager reads notes and decides if executive escalation warranted. Manual process. Delay: 1-4 hours.',
      },
      aiAgents: {
        summary: 'AI flags escalation needs with confidence score',
        detail: 'AI identifies escalation triggers (contract size, account status, complaint severity). Manager reviews and escalates.',
      },
      aiAgentic: {
        summary: 'Automatic executive routing for high-impact issues',
        detail: 'AI auto-escalates strategic and high-risk issues to executive team. Response time improves 50%+.',
      },
    },
  },

  'svc-quality-gate': {
    headline: 'Quality Gate: Interaction Quality Review and Coaching',
    lede: 'Quality decay happens within 3-6 months without active coaching — most teams don\'t audit until CSAT drops.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'An agent\'s CSAT slides from 4.2 to 3.8 over 2 months. No one notices until the monthly report. By then, 100 customers have had poor experiences.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Teams with continuous quality monitoring and real-time coaching see consistent CSAT 4.5+ and 20-30% lower repeat issues. Most teams monitor monthly.',
      },
    ],
    roleId: 'service-ops-manager',
    campaignJourney: {
      preAI: {
        summary: 'Monthly quality review by QA team',
        detail: 'QA samples calls monthly. Feedback lags. Coaching is batch-based. Quality issues persist.',
      },
      aiAgents: {
        summary: 'AI-scored interactions with priority coaching',
        detail: 'AI scores each interaction on tone, resolution, clarity. Flags low-quality interactions for coaching. Coaching becomes targeted and timely.',
      },
      aiAgentic: {
        summary: 'Real-time quality coaching and automated feedback',
        detail: 'AI monitors interactions live and provides immediate coaching (soft prompts to agent). Escalates to manager for follow-up. Quality improves 25-30%.',
      },
    },
  },

  'svc-csat-gate': {
    headline: 'CSAT Gate: Customer Satisfaction and Trend Monitoring',
    lede: 'CSAT trends predict churn 60 days in advance — most teams react only after trends turn negative.',
    blocks: [
      {
        type: 'metric' as BlockType,
        content:
          'A 0.3-point drop in CSAT correlates to 5-10% churn 90 days later. Teams that catch this early and intervene see 60-70% churn prevention. Most teams notice at month 3.',
      },
      {
        type: 'tension' as BlockType,
        content:
          'CSAT for a major product is slowly declining (4.5 → 4.2 → 3.9). By the time the trend is obvious, customer support is overloaded and leadership is in reaction mode.',
      },
    ],
    roleId: 'service-ops-manager',
    campaignJourney: {
      preAI: {
        summary: 'Weekly CSAT reporting, monthly review meetings',
        detail: 'CSAT reported weekly. Trends analyzed monthly. Action plans created. Response lag: 2-4 weeks.',
      },
      aiAgents: {
        summary: 'AI-flagged CSAT declines with root cause analysis',
        detail: 'AI alerts manager if CSAT drops below threshold or trend is negative. Suggests root causes. Manager initiates action.',
      },
      aiAgentic: {
        summary: 'Predictive CSAT with automatic intervention triggers',
        detail: 'AI predicts CSAT decline based on interaction patterns and early signals. Auto-triggers coaching, escalation, or account health review.',
      },
    },
  },

  // ============================================================================
  // CUSTOMER SUCCESS (8 steps)
  // ============================================================================

  'cs-onboarding': {
    headline: 'Onboarding: Getting Customers to Value Quickly',
    lede: 'Time-to-value directly predicts retention — 30-day onboarding beats 60-day 3-to-1 on year-2 renewal rates.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'A customer buys on day 1. Onboarding plan says they\'ll see value by day 45. On day 30, they still haven\'t used core features. By day 45, they\'ve already decided to look for alternatives.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Fast onboarding (value visible by day 14) predicts 85-90% year-1 retention. Standard onboarding (day 30-45) sees 65-75%. Slow onboarding drops to 40-50%.',
      },
    ],
    roleId: 'cs-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Standard playbook-based onboarding',
        detail: 'CSM follows playbook: data migration, setup, training. Fixed timeline. Pace doesn\'t adjust to customer. Value realization: 30-45 days.',
      },
      aiAgents: {
        summary: 'AI-assisted pacing and milestone tracking',
        detail: 'AI monitors progress against milestones. Alerts CSM if pace is slow. Recommends adjustments. Value realization: 20-30 days.',
      },
      aiAgentic: {
        summary: 'Continuous optimization with predictive intervention',
        detail: 'AI optimizes onboarding path based on customer profile and engagement. Auto-adjusts pacing and content. Value visible day 10-14.',
      },
    },
  },

  'cs-health-monitoring': {
    headline: 'Health Monitoring: Predicting Risk and Opportunity',
    lede: 'Health scoring must be dynamic — static annual health checks miss 60-70% of at-risk accounts.',
    blocks: [
      {
        type: 'tension' as BlockType,
        content:
          'An account has a static health score of 7/10 from last quarterly review. But in the past month, they\'ve stopped using 3 features and their login frequency dropped 50%. The old score doesn\'t capture this.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Dynamic health scoring (updated weekly based on usage, support tickets, and sentiment) catches 75-85% of accounts at churn risk before they disengage. Static scores catch only 30-40%.',
      },
    ],
    roleId: 'cs-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Quarterly health review based on metrics snapshot',
        detail: 'CSM reviews account metrics quarterly. Health status assigned. Risk assessment is backward-looking. Intervention is reactive.',
      },
      aiAgents: {
        summary: 'Weekly health scoring with real-time alerts',
        detail: 'AI scores health weekly based on usage, support, and sentiment. Flags declining accounts. CSM intervenes proactively.',
      },
      aiAgentic: {
        summary: 'Real-time health with predictive intervention',
        detail: 'AI continuously monitors health and predicts churn risk with 70%+ accuracy. Auto-triggers intervention workflows.',
      },
    },
  },

  'cs-qbr-preparation': {
    headline: 'QBR Preparation: Data Assembly and Talking-Point Creation',
    lede: 'QBR quality depends on prep — badly prepared QBRs waste 60+ minutes and deliver no insights.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'CSM has 2 hours to prepare a QBR. Pulls usage data (20 min), exports from 3 systems (30 min), builds slides (60 min). Slides lack executive insight. Value-add: minimal.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Well-prepared QBRs (with exec insights, benchmarking, expansion opportunity identification) see 60-70% expansion sell success. Poorly prepared QBRs: 15-20%.',
      },
    ],
    roleId: 'cs-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Manual data compilation and slide building',
        detail: 'CSM manually collects usage data, builds business impact story, creates deck. 4-6 hours prep. Breadth limited.',
      },
      aiAgents: {
        summary: 'AI-assembled data with CSM narrative',
        detail: 'AI pulls data from all sources, auto-builds slides with charts and insights. CSM customizes narrative. Prep time: 1-2 hours. Insights improve 3x.',
      },
      aiAgentic: {
        summary: 'Fully assembled QBR with talking points and opportunity detection',
        detail: 'AI assembles complete QBR (data, benchmarks, opportunity recommendations). CSM only adds executive relationship gloss. Prep time: 30 min.',
      },
    },
  },

  'cs-renewal-management': {
    headline: 'Renewal Management: Retention and Upsell at Renewal Window',
    lede: 'Renewal conversations started 90 days early close 40-50% higher than those started 30 days out.',
    blocks: [
      {
        type: 'decision-tree' as BlockType,
        content:
          'Contract expiration <120 days? → CSM should have had business review by day 90. → Have you identified expansion needs? (Y) → Plan upsell conversation. (N) → Schedule discovery.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Renewal conversations initiated by day 90 achieve 70-80% renewal + expansion rate. Conversations initiated at 45 days or less see 50-60% rate. Every week counts.',
      },
    ],
    roleId: 'cs-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'CSM-driven manual outreach at day 60',
        detail: 'CSM identifies upcoming renewals 60 days out. Reaches out manually. Success depends on CSM proactivity. Expansion rate: 40-50%.',
      },
      aiAgents: {
        summary: 'AI-flagged renewals with prep kit',
        detail: 'AI flags renewals 120 days out. Provides CSM with talking points, expansion recommendations, pricing options. Outreach earlier.',
      },
      aiAgentic: {
        summary: 'Automated renewal workflow with opportunity triggers',
        detail: 'AI manages renewal timeline, sends auto-reminders, identifies upsell/cross-sell triggers, surfaces decision-makers. Renewal + expansion rates: 75-85%.',
      },
    },
  },

  'cs-expansion': {
    headline: 'Expansion: Cross-Sell and Upsell Opportunity Capture',
    lede: 'Expansion revenue is the highest-margin business — most companies leave 30-40% of expansion potential on the table.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'A customer is using Product A heavily. They have clear need for Product B (adjacent tool). But CSM and Sales haven\'t talked. Customer never hears about it. Competitor sells them B.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Systematic expansion programs (CS identifies opportunity, Sales executes) generate 20-30% expansion revenue from existing book. Most companies achieve 5-10%.',
      },
    ],
    roleId: 'cs-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Ad hoc expansion identification and handoff',
        detail: 'CSM occasionally identifies expansion need. Manual handoff to Sales. Follow-through inconsistent. Expansion rate: 8-12%.',
      },
      aiAgents: {
        summary: 'AI-identified opportunities with Sales enablement',
        detail: 'AI analyzes usage and identifies expansion opportunities. CSM gets confidence score. Warm handoff to Sales with playbook. Rate improves to 20-25%.',
      },
      aiAgentic: {
        summary: 'Automated opportunity identification and sales workflow',
        detail: 'AI identifies expansion opportunities, auto-routes to Sales with full context. Sales executes. Follow-through improves 90%+.',
      },
    },
  },

  'cs-health-gate': {
    headline: 'Health Gate: Churn Risk Prevention and Escalation',
    lede: 'Churn risk detected and addressed within 10 days has 70-80% prevention rate. After 30 days, prevention rate drops to 20-30%.',
    blocks: [
      {
        type: 'decision-tree' as BlockType,
        content:
          'Account health score declined 30%+ in past month? (Y) → Is it due to product issue, adoption gap, or poor fit? (Product issue) → Escalate to product/support. (Adoption gap) → CSM intervention. (Poor fit) → Executive conversation.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Fast triage of health declines (within 5 days of detection) and appropriate intervention improves churn prevention 3x over delayed response.',
      },
    ],
    roleId: 'cs-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Monthly health review, reactive escalation',
        detail: 'Health declines reviewed monthly. Escalation manually decided. Response lag: 2-4 weeks.',
      },
      aiAgents: {
        summary: 'Real-time alert with recommended action',
        detail: 'AI alerts CSM immediately on health decline. Recommends action (product issue, adoption gap, exec conversation). CSM decides.',
      },
      aiAgentic: {
        summary: 'Automatic escalation with pre-built intervention',
        detail: 'AI escalates to appropriate team with full context. Pre-built response playbook. Executive escalations auto-notified.',
      },
    },
  },

  'cs-renewal-gate': {
    headline: 'Renewal Gate: Contract Economics and Win/Loss Closure',
    lede: 'Renewal economics review catches non-viable accounts before they renew — canceling early costs less than servicing low-margin renewals.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'A customer renews at deep discount. Economics go negative (support cost exceeds margin). Company keeps servicing them for 2 years. Loses $50K cumulatively.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Teams with explicit economics review at renewal time often decline 5-10% of potential renewals to protect unit economics. Cumulative profitability improves 15-20%.',
      },
    ],
    roleId: 'cs-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Renewal assumed, economics rarely reviewed',
        detail: 'All customers are assumed to renew at some price. Economics review inconsistent. Non-viable accounts renew anyway.',
      },
      aiAgents: {
        summary: 'AI-flagged economics review for marginal accounts',
        detail: 'AI identifies low-margin or negative-margin renewals. Flags for leadership review. Some declines negotiated.',
      },
      aiAgentic: {
        summary: 'Automatic decline recommendation for non-viable accounts',
        detail: 'AI recommends decline for accounts below profitability threshold. Leadership approves or overrides.',
      },
    },
  },

  'cs-churn-risk-gate': {
    headline: 'Churn Risk Gate: Intervention Trigger and Workflow',
    lede: 'Churn prediction accuracy is 80%+ with modern signals — most companies don\'t act until account is already leaving.',
    blocks: [
      {
        type: 'metric' as BlockType,
        content:
          'Accounts identified as high churn risk 60 days before announced churn have 60-70% save rate with intervention. Identified 30 days out: 40-50%. Identified at announcement: 10-15%.',
      },
      {
        type: 'scenario' as BlockType,
        content:
          'Customer goes quiet for 3 weeks. Usage drops 60%. AI flags as 80% churn risk. CSM reaches out. Discovers they\'re evaluating competitors. Immediate exec conversation. Deal saved.',
      },
    ],
    roleId: 'cs-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Churn discovery at resignation announcement',
        detail: 'Company learns customer is churning when they announce it. Saves are reactive and rare.',
      },
      aiAgents: {
        summary: 'AI-predicted churn risk with intervention kit',
        detail: 'AI predicts churn risk based on usage and engagement trends. CSM gets intervention playbook. 40-50% save rate.',
      },
      aiAgentic: {
        summary: 'Predictive intervention with automated escalation',
        detail: 'AI predicts churn risk and auto-escalates to executive team if high-value account. Save rate: 60-70%.',
      },
    },
  },

  // ============================================================================
  // CROSS-DOMAIN HANDOFFS (8 steps)
  // ============================================================================

  'handoff-mql-to-sales': {
    headline: 'MQL-to-Sales Handoff: Lead Acceptance and Engagement Start',
    lede: 'Sales accepts only 30-40% of MQLs — the gap is usually because MQL and SQL criteria don\'t align.',
    blocks: [
      {
        type: 'tension' as BlockType,
        content:
          'Marketing passes 100 MQLs. Sales calls 30. Rejects 70 as not sales-ready. Both teams blame the other. Revenue is the casualty.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Teams with joint definition of MQL criteria (not just score, but explicit firmographic and behavioral gates) see 60-70% Sales acceptance rate and 3-5x better pipeline-to-close efficiency.',
      },
    ],
    roleId: 'revenue-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Score-based handoff with high rejection',
        detail: 'Marketing passes leads scoring >X. Sales rejects many. No formalized feedback. Tension remains.',
      },
      aiAgents: {
        summary: 'AI-qualified handoff with feedback loop',
        detail: 'AI validates leads against joint MQL/SQL criteria. Rejects fail to nurture. Feedback loop monthly. Acceptance improves to 50-60%.',
      },
      aiAgentic: {
        summary: 'Real-time validation and closed-loop feedback',
        detail: 'AI enforces MQL criteria and adjusts daily based on Sales win/loss feedback. Acceptance reaches 70-80%.',
      },
    },
  },

  'handoff-sales-to-service': {
    headline: 'Sales-to-Service Handoff: Post-Sale Knowledge Transfer',
    lede: 'Poor handoff creates support friction — 40% of early support tickets are because Service doesn\'t know deal context.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'Customer calls Support 3 days after implementation. "Why isn\'t X feature working?" Support doesn\'t know: customer bought the contract without X because they negotiated it out at a discount. Service CSM didn\'t get that note.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Complete deal and deployment handoffs (with explicit SLAs, feature set, custom configs documented) reduce first-week support tickets 30-40% and improve CSAT.',
      },
    ],
    roleId: 'revenue-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Manual handoff with incomplete notes',
        detail: 'Sales passes customer. Service gets basic contract info. Deal nuances often missing. Support has to rediscover context.',
      },
      aiAgents: {
        summary: 'AI-synthesized handoff summary',
        detail: 'AI compiles deal context (negotiated terms, feature exclusions, deployment plan, known issues). CSM reviews before first engagement. Friction reduces 20%.',
      },
      aiAgentic: {
        summary: 'Automated handoff with pre-populated onboarding',
        detail: 'AI auto-creates support profile with all deal context. Onboarding plan pre-built. CSM only customizes. Handoff friction: <5%.',
      },
    },
  },

  'handoff-service-to-cs': {
    headline: 'Service-to-CS Handoff: Account Insights and Health Escalation',
    lede: 'Service is closest to customer problems — Service insights routed to CS enable 15-20% higher retention.',
    blocks: [
      {
        type: 'decision-tree' as BlockType,
        content:
          'Support identifies customer pain point? → Route to CS health model. → CS reviews in next account review. → If adoption blocker, CS prioritizes remediation. → If product issue, escalate.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Service-identified health signals that reach CS within 48 hours trigger intervention that prevents churn 40-50% of the time. Delayed signals (week+) prevent only 15-20%.',
      },
    ],
    roleId: 'revenue-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Manual insights shared in monthly meeting',
        detail: 'Service and CS meet monthly. Service shares learned issues. Insights are stale and hard to act on.',
      },
      aiAgents: {
        summary: 'Real-time insight routing with prioritization',
        detail: 'AI flags health-relevant support insights and routes to CS immediately. CS integrates into health model and action planning.',
      },
      aiAgentic: {
        summary: 'Automatic health model update from support signals',
        detail: 'AI updates account health model in real-time based on support signals. CS interventions auto-triggered if thresholds hit.',
      },
    },
  },

  'handoff-cs-to-marketing': {
    headline: 'CS-to-Marketing Handoff: Customer Insights and Reference Programs',
    lede: 'CS knows customer results — forwarding those to Marketing enables 2-3x more effective case study and reference programs.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'A customer achieves 40% efficiency gain from the product. CS knows it. Marketing doesn\'t. They miss that opportunity for a case study or reference call.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Companies with systematic CS-to-Marketing insight flow see 20-30% higher case study production and 15-20% more qualified reference customers.',
      },
    ],
    roleId: 'revenue-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Ad hoc case study requests, CS reluctant to share',
        detail: 'Marketing asks CS for customer wins. CSM is protective. Few references sourced. Program limited.',
      },
      aiAgents: {
        summary: 'AI-identified win profile with reference recommendation',
        detail: 'AI identifies high-win customers. Recommends for case study or reference. CSM decides to participate. Program improves 50%.',
      },
      aiAgentic: {
        summary: 'Automated reference and case study sourcing',
        detail: 'AI identifies ideal reference customers, routes to Marketing with context. Marketing reaches out with warm intro.',
      },
    },
  },

  'handoff-escalation-to-executive': {
    headline: 'Escalation to Executive: High-Priority Issues and Relationship Preservation',
    lede: 'Executive escalations must be visible and rapid — delayed executive response damages trust.',
    blocks: [
      {
        type: 'metric' as BlockType,
        content:
          'Strategic customer escalations resolved with executive involvement within 24 hours result in 85-90% account retention. Without executive attention: 50-60%.',
      },
      {
        type: 'tension' as BlockType,
        content:
          'A strategic customer\'s critical issue is escalated. It sits in an email for 3 days because the executive is traveling. Customer escalates publicly. Damage control mode.',
      },
    ],
    roleId: 'executive-sponsor',
    campaignJourney: {
      preAI: {
        summary: 'Manual email escalation with irregular response',
        detail: 'Escalation sent via email. Executive response depends on their current load. SLA not formalized.',
      },
      aiAgents: {
        summary: 'AI-routed escalation with guaranteed routing',
        detail: 'AI routes to highest-available executive for that customer. Auto-escalates if no response in 4 hours.',
      },
      aiAgentic: {
        summary: 'Automated executive routing with SLA enforcement',
        detail: 'AI assigns escalations based on account and issue. Enforces 2-4 hour response SLA. Tracking public.',
      },
    },
  },

  'handoff-cross-sell-trigger': {
    headline: 'Cross-Sell Trigger: Expansion Opportunity Identification and Routing',
    lede: 'Cross-sell efficiency depends on lead quality — 70% of cross-sell leads don\'t convert because they\'re not actually ready.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'A customer looks ready for Product B based on usage. But they\'re mid-implementation and their budget is tight. Sales wastes effort. Conversion fails.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'High-quality cross-sell leads (identified from usage + budget availability + strategic fit) convert 25-30%. Low-quality leads: 8-10%.',
      },
    ],
    roleId: 'revenue-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Manual cross-sell identification',
        detail: 'CSM or Sales occasionally spot cross-sell need. Handoff ad hoc. Many opportunities missed.',
      },
      aiAgents: {
        summary: 'AI-identified opportunities with readiness scoring',
        detail: 'AI identifies cross-sell candidates and scores readiness. Routes high-confidence leads to Sales with playbook.',
      },
      aiAgentic: {
        summary: 'Continuous opportunity identification and sales routing',
        detail: 'AI continuously scans for cross-sell triggers and routes warm leads to Sales. Conversion rate: 25-30%.',
      },
    },
  },

  'handoff-churn-save': {
    headline: 'Churn Save Handoff: At-Risk Account Recovery Program',
    lede: 'Churn saves initiated by executives close 50-60% when done early — 80% of churn saves fail due to poor execution.',
    blocks: [
      {
        type: 'decision-tree' as BlockType,
        content:
          'Customer at churn risk? → Immediate executive outreach. → Root cause: product issue, adoption gap, or poor fit? → Route to appropriate team (product, CS, account lead) for recovery plan.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Structured churn save workflows with clear escalation and root-cause remediation achieve 55-65% save rate. Ad hoc save attempts: 20-30%.',
      },
    ],
    roleId: 'executive-sponsor',
    campaignJourney: {
      preAI: {
        summary: 'Reactive save attempt after customer announces churn',
        detail: 'Customer announces cancellation. Executive calls. Often too late. Save attempts are last-minute discounts.',
      },
      aiAgents: {
        summary: 'Proactive escalation with remediation plan',
        detail: 'AI flags at-risk accounts 60 days early. Executive calls with remediation options. Save rate improves to 40-50%.',
      },
      aiAgentic: {
        summary: 'Automated churn save workflow with resource allocation',
        detail: 'AI pre-stages save plan (product fix, implementation support, etc.). Executive escalates with concrete remediation. Save rate: 55-65%.',
      },
    },
  },

  'handoff-win-loss-feedback': {
    headline: 'Win-Loss Feedback Loop: Competitive and Deal Intel to Product/Sales',
    lede: 'Win-loss feedback closed within 2 weeks drives product and messaging changes — delayed feedback loses context.',
    blocks: [
      {
        type: 'metric' as BlockType,
        content:
          'Competitor A wins 3 deals in a row and product/Sales respond in 2 weeks. Next 5 deals: 2 wins (40% win rate vs. competitor). If feedback lag is 6 weeks: 1 win (20% win rate).',
      },
      {
        type: 'scenario' as BlockType,
        content:
          'A deal is lost to a competitor. Feedback is collected 3 weeks later. By then, Sales has moved to new deals. The insight is filed but not acted on.',
      },
    ],
    roleId: 'revenue-ops-lead',
    campaignJourney: {
      preAI: {
        summary: 'Quarterly win-loss review meetings',
        detail: 'Deals reviewed every quarter. Insights compiled then. Response lag: 4-6 weeks. Patterns take months to emerge.',
      },
      aiAgents: {
        summary: 'Weekly win-loss analysis and alert',
        detail: 'AI analyzes wins and losses weekly. Flags competitive patterns. Sales and Product review and respond.',
      },
      aiAgentic: {
        summary: 'Real-time feedback with automated playbook updates',
        detail: 'AI analyzes each win/loss immediately. Updates sales playbooks and competitive messaging automatically. Response lag: <48 hours.',
      },
    },
  },

  // ============================================================================
  // AI AGENTS (14 entries)
  // ============================================================================

  'agent-content-generator': {
    headline: 'Content Generator Agent: Autonomous Content Production',
    lede: 'AI agents reduce content creation time from 10-15 hours per piece to 2-3 hours with quality parity.',
    blocks: [
      {
        type: 'ai-handoff' as BlockType,
        content:
          'Agent generates blog posts, email sequences, LinkedIn copy, and webinar scripts from outlines and company voice guidelines. Human editor reviews for brand alignment and factual accuracy.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Content generation agents, fully trained on brand voice and industry context, produce publication-ready content 60% of the time. Remaining 40% need 30-45 min of editing.',
      },
    ],
    roleId: 'marketing-ops-lead',
  },

  'agent-lead-scorer': {
    headline: 'Lead Scoring Agent: Dynamic Real-Time Qualification',
    lede: 'Lead scoring agents update hourly based on behavior, improving accuracy 20-30% vs. static models.',
    blocks: [
      {
        type: 'ai-handoff' as BlockType,
        content:
          'Agent ingests lead behavior (visits, clicks, email opens), firmographic data (company size, industry), and intent signals (job changes, account movement). Outputs probabilistic score with explainability.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Dynamic scoring agents achieve 78-82% accuracy on MQL qualification. Static models: 65-70%. Main advantage: adapts in real-time to market and product changes.',
      },
    ],
    roleId: 'marketing-ops-lead',
  },

  'agent-nurture-orchestrator': {
    headline: 'Nurture Orchestration Agent: Personalized Multi-Channel Sequences',
    lede: 'Orchestration agents select next-best content and channel for each lead, improving engagement 35-45%.',
    blocks: [
      {
        type: 'ai-handoff' as BlockType,
        content:
          'Agent monitors lead engagement (opens, clicks, time on page), sends content via preferred channel, adjusts sequence based on response. Learns from engagement patterns to improve selection.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Orchestrated sequences with AI-selected content and timing achieve 25-30% conversion vs. 8-12% for fixed sequences. Channel selection improves engagement 40%.',
      },
    ],
    roleId: 'marketing-ops-lead',
  },

  'agent-sdr-outbound': {
    headline: 'SDR Outbound Agent: AI-Augmented Prospecting',
    lede: 'SDR agents handle initial outreach and qualification, freeing human SDRs for relationship building.',
    blocks: [
      {
        type: 'ai-handoff' as BlockType,
        content:
          'Agent personalizes cold outreach based on target profile and recent activity. Qualifies responses. Hands off qualified prospects to human SDR with full context.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'AI SDR agents achieve 8-12% response rate on cold outreach (vs. 3-5% average). Human SDRs focus on 1-on-1 relationship building, improving conversion 25-30%.',
      },
    ],
    roleId: 'sales-ops-manager',
  },

  'agent-proposal-builder': {
    headline: 'Proposal Builder Agent: Custom Deal Document Generation',
    lede: 'Proposal agents generate custom proposals in minutes vs. hours, improving deal velocity 30-40%.',
    blocks: [
      {
        type: 'ai-handoff' as BlockType,
        content:
          'Agent ingests discovery notes and account context, generates custom proposal with ROI calculations, pricing, and legal terms. Sales rep reviews and sends.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'AI-generated proposals achieve 70-80% acceptance on first pass (vs. 50-60% for template-based). Custom mapping to customer needs improves close rates 20-25%.',
      },
    ],
    roleId: 'sales-ops-manager',
  },

  'agent-forecast-engine': {
    headline: 'Forecast Engine Agent: Predictive Deal and Revenue Forecasting',
    lede: 'Forecast agents predict close likelihood and timing with 75-85% accuracy.',
    blocks: [
      {
        type: 'ai-handoff' as BlockType,
        content:
          'Agent analyzes deal activity, stage, buyer engagement, and competitive context. Outputs probability of close and predicted close date with confidence intervals.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'AI-driven forecasting improves accuracy to 80-85% vs. 60-70% for manager-adjusted forecasts. Reduces forecast surprises by 50-60%.',
      },
    ],
    roleId: 'sales-ops-manager',
  },

  'agent-ticket-router': {
    headline: 'Ticket Router Agent: Intelligent Request Routing and Triage',
    lede: 'Routing agents categorize and assign tickets to correct queue first time, reducing reassignment 70%+.',
    blocks: [
      {
        type: 'ai-handoff' as BlockType,
        content:
          'Agent reads ticket content and assigns category, priority, and best-fit agent/team. Learns from reassignment and misrouting.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'AI routing achieves 92-95% first-time correct categorization. Reassignment rate drops below 5%. First-response time improves 20-30%.',
      },
    ],
    roleId: 'service-ops-manager',
  },

  'agent-resolution-assistant': {
    headline: 'Resolution Assistant Agent: Knowledge Synthesis and Solution Recommendation',
    lede: 'Resolution agents synthesize solutions from KB and past tickets, improving first-contact resolution 25-30%.',
    blocks: [
      {
        type: 'ai-handoff' as BlockType,
        content:
          'Agent searches knowledge base, analyzes similar past tickets, synthesizes recommendation for agent. Agent reviews, customizes, and delivers to customer.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'AI-assisted resolution improves FCR to 70-75% vs. 45-50% without. Agent time-to-resolution improves 30-40% from faster solution identification.',
      },
    ],
    roleId: 'service-ops-manager',
  },

  'agent-knowledge-miner': {
    headline: 'Knowledge Miner Agent: KB Article Creation from Support Interactions',
    lede: 'Knowledge agents auto-extract and publish KB articles from support interactions, keeping knowledge current.',
    blocks: [
      {
        type: 'ai-handoff' as BlockType,
        content:
          'Agent monitors support tickets, identifies resolutions that should be in KB, drafts articles with source links. Support manager reviews and publishes.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'AI-extracted KB articles reduce repeat tickets 30-40%. Knowledge base grows faster and stays more current. Manual KB update burden drops 50%+.',
      },
    ],
    roleId: 'service-ops-manager',
  },

  'agent-health-scorer': {
    headline: 'Health Scorer Agent: Real-Time Account Health Monitoring',
    lede: 'Health agents monitor 50+ signals and predict account risk with 75-85% accuracy.',
    blocks: [
      {
        type: 'ai-handoff' as BlockType,
        content:
          'Agent ingests usage data, support tickets, NPS, engagement, feature adoption, and competitive intelligence. Outputs health score, trend, and risk level.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'AI health scoring catches at-risk accounts 45+ days before churn announcement. CSM intervention in this window achieves 60-70% save rate.',
      },
    ],
    roleId: 'cs-ops-lead',
  },

  'agent-renewal-predictor': {
    headline: 'Renewal Predictor Agent: Renewal Likelihood and Expansion Forecasting',
    lede: 'Renewal agents predict renewal likelihood with 80%+ accuracy and identify upsell/expansion opportunities.',
    blocks: [
      {
        type: 'ai-handoff' as BlockType,
        content:
          'Agent analyzes account health, product usage, support history, and contract terms. Outputs renewal probability and expansion opportunity recommendations.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Renewal predictions with 80%+ accuracy enable CSMs to focus effort on genuine risk. Expansion recommendations help close 25-30% more expansion deals.',
      },
    ],
    roleId: 'cs-ops-lead',
  },

  'agent-expansion-detector': {
    headline: 'Expansion Detector Agent: Cross-Sell and Upsell Opportunity Identification',
    lede: 'Expansion agents identify expansion opportunities 2-3 months before customer self-discovers need.',
    blocks: [
      {
        type: 'ai-handoff' as BlockType,
        content:
          'Agent monitors feature usage patterns, product adoption velocity, and industry benchmarks. Identifies accounts ready for additional products or seat expansion.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'AI-identified expansion opportunities convert 25-30% when routed to Sales. Opportunity volume increases 3-5x vs. manual identification.',
      },
    ],
    roleId: 'cs-ops-lead',
  },

  'agent-revenue-orchestrator': {
    headline: 'Revenue Orchestrator Agent: Cross-Functional Workflow Automation',
    lede: 'Orchestrator agents coordinate handoffs between Sales, CS, Marketing, and Finance, reducing manual coordination 60%+.',
    blocks: [
      {
        type: 'ai-handoff' as BlockType,
        content:
          'Agent manages workflows: MQL-to-SQL handoff, SQL-to-opportunity-to-deal progression, renewal reminders, churn save escalation. Logs actions, escalates blockers.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Orchestrated workflows reduce sales cycle time 15-20% and increase productivity 20-30% by eliminating manual handoffs and follow-ups.',
      },
    ],
    roleId: 'revenue-ops-lead',
  },

  'agent-customer-360-builder': {
    headline: 'Customer 360 Agent: Unified Customer Profile Synthesis',
    lede: 'Customer 360 agents aggregate data from 10+ systems into a single actionable customer profile.',
    blocks: [
      {
        type: 'ai-handoff' as BlockType,
        content:
          'Agent pulls data from CRM, support platform, product analytics, billing, and market intelligence. Synthesizes into profile visible to all teams.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Unified customer profiles reduce context-switching and information gaps. Sales productivity improves 15-20%. Support efficiency improves 20-30%.',
      },
    ],
    roleId: 'data-engineer',
  },

  // ============================================================================
  // SHARED INFRASTRUCTURE / INPUTS (16 entries)
  // ============================================================================

  'input-crm-data': {
    headline: 'CRM Data: Source of Truth for Customer and Deal Information',
    lede: 'CRM data quality directly impacts every downstream process — 60-70% of data issues trace back to CRM entry discipline.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'A deal has incomplete contact info, no decision timeline recorded, and budget is marked "TBD." Sales manager tries to forecast. Garbage in, garbage out.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Organizations with documented CRM entry standards and weekly data audits see 85-90% data quality and enable accurate forecasting. Without discipline: 50-60% quality.',
      },
    ],
    roleId: 'data-engineer',
  },

  'input-cdp-profiles': {
    headline: 'CDP Profiles: Unified Lead and Account Data for Targeting',
    lede: 'CDP data enables targeted marketing and sales outreach — siloed CDP data reduces effectiveness 50%+.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'Marketing has lead engagement data. Sales has account data. Finance has contract data. None talk. Marketing sends email to a contact at a company that just renewed. Friction.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Unified CDP profiles with real-time sync enable 20-30% better targeting accuracy and 15-20% higher conversion rates.',
      },
    ],
    roleId: 'data-engineer',
  },

  'input-product-catalog': {
    headline: 'Product Catalog: SKU and Feature Reference for Quoting and Sales',
    lede: 'Catalog accuracy determines quote speed and accuracy — outdated catalogs create quote errors and slowdowns.',
    blocks: [
      {
        type: 'tension' as BlockType,
        content:
          'Sales quotes based on old pricing. Product launches new tier. Quote template hasn\'t been updated. Sales and Finance fight about pricing.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Real-time product catalog sync with sales systems reduces quote errors 70% and improves quote-to-close velocity 15-20%.',
      },
    ],
    roleId: 'data-engineer',
  },

  'input-pricing-rules': {
    headline: 'Pricing Rules: Guardrails for Deal Pricing and Discounting',
    lede: 'Pricing rule enforcement prevents margin erosion — lack of enforcement costs 5-10% of revenue.',
    blocks: [
      {
        type: 'metric' as BlockType,
        content:
          'Companies with enforced pricing rules (list price, approved discount tiers, volume discounts) achieve 15-20% higher realized pricing. Without enforcement: 5-10% average discount erosion.',
      },
      {
        type: 'scenario' as BlockType,
        content:
          'Rep A offers 30% discount on a small deal. Rep B offers 10% on the same size deal to a peer company. No guardrails. Customers compare notes. Pricing chaos.',
      },
    ],
    roleId: 'deal-desk-manager',
  },

  'input-territory-model': {
    headline: 'Territory Model: Sales Coverage and Account Assignment',
    lede: 'Territory model accuracy determines rep productivity — bad territory design creates competition or gaps.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'Territory is assigned by geography but customer base is industry-focused. Reps optimize for the wrong thing. Account coverage is spotty.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Territory models aligned with customer base structure and rep capacity see 15-25% higher productivity than misaligned models.',
      },
    ],
    roleId: 'sales-ops-manager',
  },

  'input-competitive-intel': {
    headline: 'Competitive Intelligence: Market and Competitor Context for Sales',
    lede: 'Fresh competitive intelligence improves win rates 20-30% — stale intel hurts.',
    blocks: [
      {
        type: 'metric' as BlockType,
        content:
          'Sales teams with access to current competitive positioning, win-loss trends, and competitor pricing win 25-30% more deals. Without current intel: average rates.',
      },
      {
        type: 'scenario' as BlockType,
        content:
          'Sales doesn\'t know competitor A just released a feature that closes a key gap. Customer mentions it. Rep is surprised. Deal momentum lost.',
      },
    ],
    roleId: 'data-engineer',
  },

  'input-compliance-framework': {
    headline: 'Compliance Framework: Regulatory and Legal Content Constraints',
    lede: 'Clear compliance framework enables faster marketing and sales — unclear rules slow everything down.',
    blocks: [
      {
        type: 'tension' as BlockType,
        content:
          'Marketing wants to make a benefit claim. Legal says it needs 3 sources. Markup says it has sources, but legal wants different ones. Approval delays 5 days.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Pre-approved claim templates and clear source libraries reduce compliance review time 70% and enable faster campaign deployment.',
      },
    ],
    roleId: 'context-engineer',
  },

  'input-brand-guidelines': {
    headline: 'Brand Guidelines: Voice, Design, and Messaging Standards',
    lede: 'Brand consistency improves recall 15-20% — inconsistent brand confuses customers.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'Marketing uses three different taglines across the same campaign. Sales deck uses different colors than website. Customer sees disjointed brand.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Strong brand consistency improves recall 15-20% and boosts brand preference 10-15%. Enforcement through templates and reviews needed.',
      },
    ],
    roleId: 'context-engineer',
  },

  'input-customer-360': {
    headline: 'Customer 360 Profile: Unified Single Source of Truth',
    lede: 'A single customer view enables better personalization and faster service — multiple customer views create friction.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'Customer calls with question about renewal timing. Support checks ticket system (no recent activity). CSM system shows they\'re at-risk. Neither system talked to the other. Slow response.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Unified customer profiles enable 20-30% faster service, 15-20% better personalization, and 10-15% higher CSAT.',
      },
    ],
    roleId: 'data-engineer',
  },

  'input-pipeline-data': {
    headline: 'Pipeline Data: Deal Progression and Forecast Input',
    lede: 'Accurate, timely pipeline data is the foundation of sales forecasting — stale data destroys forecast confidence.',
    blocks: [
      {
        type: 'metric' as BlockType,
        content:
          'Updated pipeline data (refreshed daily, not weekly) improves forecast accuracy 20-30% and enables faster response to pipeline trends.',
      },
      {
        type: 'tension' as BlockType,
        content:
          'Sales manager reviews pipeline every Monday. Data is from Friday. By Monday, 3 deals have moved. Forecast doesn\'t reflect reality.',
      },
    ],
    roleId: 'data-engineer',
  },

  'input-support-history': {
    headline: 'Support History: Customer Issues and Interaction Record',
    lede: 'Complete support history informs health scoring and upsell — fragmented history misses signals.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'A customer has had 15 support tickets over 6 months (trend: adoption blockers). CS doesn\'t see the pattern because tickets are in a different system. Retention looks fine until they churn.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Complete support history analysis improves health scoring accuracy 25-30% and churn prediction accuracy by similar margin.',
      },
    ],
    roleId: 'data-engineer',
  },

  'input-nps-csat-data': {
    headline: 'NPS/CSAT Data: Customer Satisfaction and Sentiment Tracking',
    lede: 'Real-time NPS/CSAT enables early intervention — lagged data misses the window.',
    blocks: [
      {
        type: 'metric' as BlockType,
        content:
          'Real-time CSAT decline detection (day of, not month later) enables intervention that prevents 60-70% of churn. Month-late detection prevents 20-30%.',
      },
      {
        type: 'scenario' as BlockType,
        content:
          'CSAT drops from 4.5 to 3.8 over 2 weeks. If detected immediately, intervention starts fast. If detected at monthly review, 50+ customers have experienced poor service.',
      },
    ],
    roleId: 'data-engineer',
  },

  'input-usage-telemetry': {
    headline: 'Usage Telemetry: Feature Adoption and Engagement Signals',
    lede: 'Usage signals predict expansion and churn — companies missing this data lack visibility.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'Customer logins drop 60%. Feature X usage goes to zero. These are churn signals, but no one is watching. Customer churns 90 days later.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Usage-driven health scoring catches at-risk accounts 60+ days early. Enables 60-70% churn prevention. Without usage data: 20-30% prevention rate.',
      },
    ],
    roleId: 'data-engineer',
  },

  'input-contract-data': {
    headline: 'Contract Data: Terms, Pricing, and Renewal Dates',
    lede: 'Accurate contract data enables renewal forecasting and compliance — errors delay collections and create disputes.',
    blocks: [
      {
        type: 'metric' as BlockType,
        content:
          'Accurate contract records improve renewal forecasting 20-25% and reduce disputes 30-40%. Common issues: wrong renewal date, missing price adjustments, incorrect seat counts.',
      },
      {
        type: 'scenario' as BlockType,
        content:
          'Contract shows price of $X but billing system has $2X. Renewal comes due. Customer is shocked. Support case, delay, and churn risk.',
      },
    ],
    roleId: 'data-engineer',
  },

  'input-marketing-performance': {
    headline: 'Marketing Performance Data: Campaign Results and Attribution',
    lede: 'Marketing attribution data enables budget reallocation — without it, budget goes to historical channels, not best performers.',
    blocks: [
      {
        type: 'tension' as BlockType,
        content:
          'Marketing splits budget equally across email, ads, and events. Ads drive 60% of pipeline but email gets the same budget. Inefficiency.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Marketing performance tracking by channel enables 20-30% higher pipeline from same spend through optimal channel allocation.',
      },
    ],
    roleId: 'data-engineer',
  },

  'input-revenue-targets': {
    headline: 'Revenue Targets: Sales Goals and Territory Allocation',
    lede: 'Clear targets aligned with capacity enable credible forecasting — arbitrary targets destroy morale and forecast quality.',
    blocks: [
      {
        type: 'scenario' as BlockType,
        content:
          'Territory A gets $5M target (reasonable, based on pipeline history). Territory B gets $5M target (no pipeline, unfair). Rep B sandbagging. Forecast unreliable.',
      },
      {
        type: 'metric' as BlockType,
        content:
          'Targets set based on territory capacity and historical close rates enable accurate forecasting (85%+ accuracy). Arbitrary targets destroy forecast quality (50-60% accuracy).',
      },
    ],
    roleId: 'data-engineer',
  },
};
