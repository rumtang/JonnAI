import {
  RoleCategory,
  RoleDefinition,
  RoleNarrative,
  NodeJourney,
  JourneyStage,
  StageOverview,
} from './role-definitions';

/**
 * Front Office Role Definitions
 * Covers: Marketing, Sales, Service, Customer Success, RevOps, and governance across customer-facing operations
 * 18 roles organized into 5 categories: Strategy, Revenue, Governance, Operations, Growth
 */

export const ROLE_CATEGORIES_FRONTOFFICE: Record<
  RoleCategory,
  { label: string; subtitle: string; iconName: string }
> = {
  strategy: {
    label: 'Strategy',
    subtitle: 'Set the direction',
    iconName: 'Compass',
  },
  creative: {
    label: 'Revenue',
    subtitle: 'Drive the pipeline',
    iconName: 'TrendingUp',
  },
  governance: {
    label: 'Governance',
    subtitle: 'Protect the customer',
    iconName: 'Shield',
  },
  operations: {
    label: 'Operations',
    subtitle: 'Keep it running',
    iconName: 'Settings',
  },
  growth: {
    label: 'Growth',
    subtitle: 'Expand the relationship',
    iconName: 'Zap',
  },
};

// ============================================================================
// STRATEGY ROLES (3)
// ============================================================================

const croPainPoints = [
  'Revenue silos: marketing, sales, and service operate independently, missing cross-functional optimization',
  'Forecast visibility: fragmented data across CRM, marketing automation, and support systems',
  'Executive accountability: CFO demands accuracy; reality is 70% of forecasts miss by >15%',
  'Talent bandwidth: most CROs manage 8-12 direct reports across 4+ functions',
  'Technology sprawl: average enterprise runs 40+ SaaS tools; integration debt kills agility',
];

const croNodeJourneys: Record<string, NodeJourney> = {
  'handoff-escalation-to-executive': {
    preAI: {
      summary:
        'Executive escalations bubble up via email and Slack. CRO learns about problems from customer complaints, not systematic review.',
      detail:
        'Today, account teams escalate issues haphazardly when a deal stalls, a renewal is at risk, or a customer is unhappy. The CRO finds out reactively—often 30+ days after the issue started. Without a structured intake, some escalations are handled by the wrong function, or bounce between teams. Response time is 3-5 days. The CRO has no centralized view of active escalations, their root causes, or resolution status. High-touch customers get attention; the long tail gets ignored.',
    },
    aiAgents: {
      summary:
        'AI detects churn signals and escalation triggers automatically. CRO reviews pre-prioritized escalations weekly, with context and recommended actions.',
      detail:
        'An escalation agent monitors customer health signals (declining usage, support tickets, renewal risk scores) and automatically routes critical issues to the CRO with context: customer LTV, account tenure, churn risk %, and recommended next step. The CRO no longer waits for humans to notice the problem. Escalations arrive within 2 hours of trigger detection. The CRO still makes the final call, but has 80% of the context upfront. This reduces CRO decision time from 2 hours to 15 minutes per escalation.',
    },
    aiAgentic: {
      summary:
        'CRO delegates escalation response to an autonomous agent that executes the playbook: notifies teams, schedules intervention, reports progress.',
      detail:
        'The escalation agent does not just alert—it acts. Once the CRO approves an escalation playbook (or designates "auto-approve for LTV >$500K"), the agent executes: it creates a cross-functional task, notifies the account team, schedules the intervention, and tracks resolution. The CRO gets a daily exception report (only escalations that deviate from plan or resolve unexpectedly). This transforms the CRO from a firefighter into a strategic reviewer. Time spent on escalations drops 70%; the team now proactively prevents churn instead of reacting to it.',
    },
  },
  'sales-deal-review-gate': {
    preAI: {
      summary:
        'Deal reviews happen in weekly sales calls. CRO reviews top 20-30 deals; the rest go unseen. Average deal slips 15-20 days undetected.',
      detail:
        'The sales team runs a weekly deal review call (often 1-2 hours) where the top 50 deals are discussed. The CRO attends but can only engage deeply on 20-30 of them. Deals stuck in early-stage discovery are barely mentioned. If a deal slips, the team usually doesn\'t notice until the forecast closes and revenue misses. Root-cause analysis is post-mortem, not preventive. Reps with struggling deals get coaching after the deal is already at risk.',
    },
    aiAgents: {
      summary:
        'AI flags deals by risk profile before the call. CRO spends 30 min reviewing 80+ deals, then 90 min on coaching calls for the 15 at-risk deals.',
      detail:
        'A deal risk agent scores every deal based on: days in stage, no recent activity, competitor mentioned, stakeholder engagement drop, quote expiry, or pricing outlier. The agent flags deals trending off forecast 5-7 days before they slip. CRO gets a pre-call summary: 80 deals in green, 12 in yellow (at-risk), 3 in red (save/lose decision needed). The CRO spends 30 min on the summary, then uses the 90 min call for deep dives on red and yellow deals. This increases CRO deal touch from 25% to 100%.',
    },
    aiAgentic: {
      summary:
        'Agent proactively coaches reps on at-risk deals, proposes next steps, and escalates only the 2-3 deals needing CRO intervention.',
      detail:
        'The deal agent doesn\'t wait for the CRO—it actively coaches each rep on their at-risk deals. It suggests next steps (e.g., "Get decision-maker on call this week" or "Negotiate discount, lock renewal 2 years"). It flags only 2-3 deals per week that truly need CRO arbitration (e.g., custom pricing, legal waiver, or customer waiving a contract term). The weekly call shrinks to 30 min for CRO decision-making on those 2-3 deals. Sales team gets autonomous, real-time coaching instead of weekly fire drills. Deal velocity improves 20%; forecast accuracy hits 95%+.',
    },
  },
};

const croStageOverviews: { preAI: StageOverview; aiAgents: StageOverview; aiAgentic: StageOverview } = {
  preAI: {
    narrative:
      'The CRO manages cross-functional revenue through reactive escalations and weekly deal reviews. Most of the time is spent firefighting escalations (35%), attending status calls (30%), and coaching reps (25%). Strategic planning gets the leftovers (10%).',
    timeAllocation:
      '35% escalation firefighting, 30% status meetings, 25% rep coaching, 10% strategic planning',
    criticalMetrics: [
      'Revenue forecast accuracy (target: >90%, current: 70-75%)',
      'Time-to-respond on escalations (target: <4 hours, current: 48-72 hours)',
      'Churn rate (target: <5%, current: 8-12%)',
      'Win rate (target: >40%, current: 25-30%)',
      'Deal cycle time (target: <6 weeks, current: 10-14 weeks)',
    ],
    strategicOpportunity:
      'Automate escalation triage and deal monitoring to reclaim 25+ hours/week for revenue strategy and cross-functional planning.',
  },
  aiAgents: {
    narrative:
      'With AI agents handling escalation detection and deal risk scoring, the CRO shifts from reactive to proactive. Escalations arrive pre-prioritized; deals at-risk are flagged days before they slip. The CRO now spends time on strategic coaching and preventing problems, not reacting to them.',
    timeAllocation:
      '20% escalation review, 15% status calls, 40% strategic coaching, 25% cross-functional planning',
    criticalMetrics: [
      'Forecast accuracy (improved to 88-92%)',
      'Escalation response time (reduced to <4 hours)',
      'Churn rate (improved to 6-8%)',
      'Win rate (improved to 32-35%)',
      'Deal velocity (improved 10-15%)',
    ],
    strategicOpportunity:
      'Partner AI agents with sales ops to build predictive coaching playbooks that prevent deals from stalling.',
  },
  aiAgentic: {
    narrative:
      'Autonomous agents execute escalation playbooks and rep coaching. The CRO reviews outcomes, not activities. Time is spent on strategic initiatives—designing new territories, launching adjacent products, or mergers.',
    timeAllocation:
      '10% exception review, 10% status calls, 20% strategic coaching, 60% strategic initiatives',
    criticalMetrics: [
      'Forecast accuracy (95%+)',
      'Escalation resolution time (<2 hours)',
      'Churn rate (<5%)',
      'Win rate (38-42%)',
      'Deal velocity (improved 25-30%)',
    ],
    strategicOpportunity:
      'CRO becomes a revenue architect—designing go-to-market models, territory structures, and customer acquisition strategies.',
  },
};

export const CHIEF_REVENUE_OFFICER: RoleDefinition = {
  id: 'chief-revenue-officer',
  title: 'Chief Revenue Officer',
  description:
    'Owns cross-functional revenue strategy, forecast accuracy, and executive escalations across marketing, sales, and customer success.',
  tagline: 'Revenue architect. Forecast owner. Escalation decider.',
  iconName: 'Crown',
  category: 'strategy',
  accentColor: '#C9A04E',
  ownedSteps: [],
  reviewedGates: ['handoff-escalation-to-executive', 'sales-deal-review-gate'],
  relatedAgents: ['agent-revenue-orchestrator', 'agent-forecast-engine'],
  relatedInputs: [
    'input-revenue-targets',
    'input-pipeline-data',
    'input-competitive-intel',
  ],
  narrative: {
    keyInsight:
      'CRO time shifts from firefighting escalations to architecting revenue strategy—AI handles triage, CRO owns outcomes.',
    nodeJourneys: croNodeJourneys,
    stageOverviews: croStageOverviews,
  },
  painPoints: croPainPoints,
};

// ============================================================================
// REVENUE OPS LEAD
// ============================================================================

const revopsNodeJourneys: Record<string, NodeJourney> = {
  'handoff-mql-to-sales': {
    preAI: {
      summary:
        'Marketing hands off MQLs via Salesforce report. Sales ops manually reviews, assigns 40-50% to reps. 15% of MQLs never get touched.',
      detail:
        'Marketing declares an MQL when a lead hits scoring threshold (typically 100 points: 50 for website visit + email open, 50 for demo request). Sales ops receives a weekly report of 200-300 MQLs. They manually review, deduplicate, and assign to reps based on territory and capacity. About 40-50% get assigned within 24 hours; others sit in queue. Reps often reject MQLs as low-quality, but there\'s no feedback loop to marketing. 87% of MQLs never convert—often because the handoff was bungled, not because the lead was bad.',
    },
    aiAgents: {
      summary:
        'Lead scoring agent re-scores MQLs before handoff, enriches context, and matches to rep. 90% of leads assigned within 2 hours.',
      detail:
        'An MQL scoring agent reviews each lead pre-handoff. It re-scores based on real-time signals: company size, industry, engagement momentum, and fit-to-ACV. It enriches context: company growth rate, recent funding, technology stack. It then matches to the best-fit rep based on territory, win rate on similar accounts, and current workload. The handoff is automatic and logged. If a rep doesn\'t touch a lead within 24 hours, the system notifies sales ops. This eliminates the manual review step and ensures high-quality leads get rep attention fast. MQL-to-SQL conversion improves 30-40%.',
    },
    aiAgentic: {
      summary:
        'Agent autonomously qualifies, enriches, and routes leads. Reps get pre-personalized outreach suggestions. Sales ops only intervenes on exceptions.',
      detail:
        'The agent doesn\'t just route—it prepares. For each MQL assigned to a rep, the agent generates a personalized outreach strategy: recommended talking points based on company stage and industry, competitor insights, and a suggested meeting type (call vs. email vs. LinkedIn). The agent also auto-creates a draft task in CRM, pre-fills the account with enriched data, and flags if the account is already in another deal or renewal. Reps spend 80% less time on admin and more time selling. Sales ops monitors only: leads rejected by reps (refining scoring) and leads that stall >3 days (intervention).',
    },
  },
  'handoff-win-loss-feedback': {
    preAI: {
      summary:
        'Sales ops manually sends win/loss surveys. 20-30% response rate. Feedback is anecdotal; patterns take weeks to identify.',
      detail:
        'After a deal closes (won or lost), sales ops manually emails a survey to the AE. Response rate hovers at 20-30%. The feedback is qualitative: "too expensive," "feature gap," "better support elsewhere." Even with responses, it takes 4-6 weeks to aggregate and spot patterns. Is price really the issue, or is it a discovery execution problem? Are we losing to a specific competitor repeatedly? Marketing doesn\'t get the feedback because it\'s buried in CRM notes. The loop is broken.',
    },
    aiAgents: {
      summary:
        'Win/loss agent conducts post-deal interviews within 48 hours. Patterns surface in real-time. Marketing and product get weekly insights.',
      detail:
        'A win/loss agent contacts customers within 48 hours of deal close (either via email survey or scheduled call for large deals). It asks standardized questions: decision criteria, competitive evaluation, pricing impact, timing constraints. It detects sentiment and flags key issues: "pricing too high," "feature gap: X," "sales experience rating 3/10." The agent aggregates daily and surfaces patterns in real-time: "Price is the stated reason for 60% of losses to Competitor X; our feature parity in Y is known to <30% of prospects." Marketing gets a weekly report and can adjust messaging. Sales can refine discovery. The feedback loop closes in days, not weeks.',
    },
    aiAgentic: {
      summary:
        'Agent conducts win/loss interviews, routes insights to marketing/product, and triggers coaching on reps with <40% win rate.',
      detail:
        'The agent runs the full win/loss program: it schedules calls, takes notes, synthesizes insights, and distributes them to stakeholders. It routes price feedback to deal desk (for pricing analysis), feature gaps to product (for roadmap planning), and sales execution feedback to sales coaching (for rep training). If a rep has a win rate <40% and the agent identifies a pattern (e.g., weak discovery, objection handling), it auto-enrolls the rep in a coaching sprint. This closes the loop on every deal. Marketing and product get real, recent data instead of hunches. Coaching is targeted and timely.',
    },
  },
  'sales-forecast-gate': {
    preAI: {
      summary:
        'Sales ops collects forecasts weekly via email/spreadsheet. Takes 4 hours to compile. Accuracy: 70-75%. Surprises happen on forecast close.',
      detail:
        'Weekly, sales ops emails reps asking for deal status, probability, and stage. Some reps reply promptly; others miss the deadline. Sales ops manually enters data into a spreadsheet or CRM report, reconciles duplicates, and aggregates by rep, territory, and segment. The process takes 4+ hours. Even after all that work, forecast misses by 15%+ because reps sandbagged, or deals stalled undetected. The CRO gets surprised on the last day of the month when deals don\'t close.',
    },
    aiAgents: {
      summary:
        'Forecast agent continuously monitors deal progression. Reps update status via CRM; agent validates and flags anomalies. Weekly forecast takes 30 min.',
      detail:
        'Instead of a weekly email request, the forecast agent continuously monitors CRM: it tracks each deal\'s stage progression, days-in-stage, activity cadence, and forecast date. It detects when a deal stalls (no activity for 5+ days) or when the forecast date slips. It nudges reps to update if the CRM is stale. The agent also detects sandbagging: if a rep has historically moved 80% of deals from stage 3 to stage 4 within 7 days, but a deal has been stuck for 10 days, the agent flags it. The weekly forecast compilation becomes a 30-min review of the agent\'s pre-built forecast, not a 4-hour manual effort. Accuracy improves to 88-92%.',
    },
    aiAgentic: {
      summary:
        'Agent predicts deal outcomes, auto-adjusts forecast based on historical patterns, and triggers escalations for at-risk deals.',
      detail:
        'The forecast agent doesn\'t just monitor—it predicts. Using historical deal progression patterns for each rep, it forecasts the probability that a deal will close on time. If the model predicts <50% for a high-value deal, it auto-escalates to sales ops for intervention. The agent also auto-adjusts forecast for seasonality and market conditions. The CRO gets a forecast that updates daily, not weekly. The forecast is backed by models, not opinions. Forecast accuracy hits 95%+.',
    },
  },
  'mktg-performance-gate': {
    preAI: {
      summary:
        'Marketing reports attribution once a month. Link between campaign and revenue is unclear. Budget allocation is guesswork.',
      detail:
        'At month-end, marketing ops pulls reports: how many leads from each campaign, cost per lead, MQL volume. But the link to revenue is fuzzy. Did the demand gen campaign from 3 months ago close deals this month? Did the webinar drive upgrades? Without clear attribution, marketing budgets are allocated based on gut feel, not ROI. The board asks "what\'s our payback period on demand gen?" Marketing doesn\'t have a clear answer.',
    },
    aiAgents: {
      summary:
        'Attribution agent traces every customer back to first campaign touch. Weekly reports show campaign ROI. Budget is allocated by predicted payback.',
      detail:
        'An attribution agent traces every closed deal back to the first touch: which campaign, which email, which webinar? It assigns fractional credit across the journey (first-touch 40%, last-touch 30%, middle 30%). It then calculates true campaign ROI: cost per deal closed and payback period. Weekly reports show which campaigns are profitable (webinar: 8-month payback) and which are money-losers (bottom-of-funnel retargeting: 14-month payback). Marketing can now reallocate budget to campaigns with faster payback. The board gets a clear answer on marketing ROI.',
    },
    aiAgentic: {
      summary:
        'Agent continuously optimizes budget allocation based on predicted ROI and payback. Campaigns underperforming vs. forecast get auto-throttled.',
      detail:
        'The attribution agent doesn\'t just report—it optimizes. It models campaign performance and predicts payback period for each cohort. If a campaign is tracking to a 12-month payback (vs. corporate target of 8 months), the agent recommends reducing spend and reallocating to faster-payback campaigns. The agent also tests: it runs cohort experiments (e.g., "what if we increase nurture emails for ABM targets from 2/week to 3/week?") and measures impact on conversion. Marketing ops uses these recommendations to auto-adjust campaigns in real-time. Budget becomes dynamic, not static.',
    },
  },
};

const revopsStageOverviews: { preAI: StageOverview; aiAgents: StageOverview; aiAgentic: StageOverview } = {
  preAI: {
    narrative:
      'Revenue ops spends 50% of time on manual data entry and reconciliation: compiling forecasts, assigning leads, tracking win/loss feedback. The other 50% is spent on strategy: territory planning, process design, and rep coaching.',
    timeAllocation:
      '30% forecast compilation, 20% lead assignment & deduplication, 15% win/loss tracking, 35% strategy & coaching',
    criticalMetrics: [
      'Forecast accuracy (target: >90%, current: 70-75%)',
      'MQL-to-SQL conversion (target: 25%, current: 13-15%)',
      'Lead response time (target: <4 hours, current: 18-24 hours)',
      'Win/loss feedback loop (target: <3 days, current: 21-28 days)',
      'Territory planning cycle (target: quarterly, current: annual)',
    ],
    strategicOpportunity:
      'Automate lead routing and forecast tracking to reclaim 20+ hours/week for process improvement and strategic planning.',
  },
  aiAgents: {
    narrative:
      'With agents handling lead routing and forecast monitoring, RevOps shifts focus to outcome optimization. Forecast is more accurate. Lead routing is faster. Win/loss feedback arrives in real-time, enabling rapid adjustments to strategy.',
    timeAllocation:
      '10% forecast review, 10% lead assignment exception, 15% win/loss analysis, 65% strategy & process optimization',
    criticalMetrics: [
      'Forecast accuracy (improved to 88-92%)',
      'MQL-to-SQL conversion (improved to 18-22%)',
      'Lead response time (reduced to 4-8 hours)',
      'Win/loss feedback loop (reduced to 2-3 days)',
      'Territory planning cycle (improved to quarterly)',
    ],
    strategicOpportunity:
      'Use real-time feedback to dynamically adjust territory assignments, pricing, and discovery playbooks.',
  },
  aiAgentic: {
    narrative:
      'Agents execute all operational tasks: lead routing, forecast building, and win/loss analysis. RevOps reviews outcomes and designs experiments. The role transforms from execution to experimentation and continuous improvement.',
    timeAllocation:
      '5% forecast review, 5% exception handling, 10% analysis, 80% strategy & experimentation',
    criticalMetrics: [
      'Forecast accuracy (95%+)',
      'MQL-to-SQL conversion (22-28%)',
      'Lead response time (<2 hours)',
      'Win/loss feedback loop (<24 hours)',
      'Territory planning cycle (continuous)',
    ],
    strategicOpportunity:
      'Partner with product and marketing on go-to-market innovation—new pricing models, new territories, new buyer personas.',
  },
};

export const REVENUE_OPS_LEAD: RoleDefinition = {
  id: 'revenue-ops-lead',
  title: 'VP Revenue Operations',
  description:
    'Orchestrates cross-functional operations: lead routing, sales forecast, win/loss feedback, and performance gates for marketing and sales.',
  tagline: 'Pipeline orchestrator. Forecast keeper. Process designer.',
  iconName: 'GitMerge',
  category: 'strategy',
  accentColor: '#E88D67',
  ownedSteps: ['handoff-mql-to-sales', 'handoff-win-loss-feedback'],
  reviewedGates: ['sales-forecast-gate', 'mktg-performance-gate'],
  relatedAgents: ['agent-revenue-orchestrator', 'agent-lead-scorer'],
  relatedInputs: [
    'input-crm-data',
    'input-pipeline-data',
    'input-revenue-targets',
  ],
  narrative: {
    keyInsight:
      'RevOps transforms from a process coordinator to a strategic optimizer—using AI to automate operations and focusing human effort on experimentation and improvement.',
    nodeJourneys: revopsNodeJourneys,
    stageOverviews: revopsStageOverviews,
  },
  painPoints: [
    'Manual lead assignment: deduplicate, enrich, route—takes hours, error-prone',
    'Forecast accuracy: 30% of forecasts miss by >15%; surprises on close day',
    'Win/loss loop broken: feedback arrives weeks late, patterns go undetected',
    'Marketing-sales misalignment: marketing doesn\'t know what sales thinks of their leads',
    'Territory sprawl: static territories miss growth opportunities',
  ],
};

// ============================================================================
// MARKETING OPS LEAD
// ============================================================================

const mktgopsNodeJourneys: Record<string, NodeJourney> = {
  'mktg-campaign-planning': {
    preAI: {
      summary:
        'Campaign planning is manual: target list built in Excel, messaging designed in docs, approval cycles are email chains. 4-6 weeks to launch.',
      detail:
        'Marketing starts with a target list (built manually or from a data dump), brainstorms messaging (in a Google doc), designs creative (in Figma), and sends around for approval (Slack loops). The process takes 4-6 weeks. By the time a campaign launches, the market window may have passed. Changes mid-campaign require a new approval cycle. There\'s no real-time visibility into which messaging resonates or which segments are most receptive.',
    },
    aiAgents: {
      summary:
        'Campaign agent suggests target list, generates messaging options, and auto-approves campaigns within brand guidelines. Launch in 1 week.',
      detail:
        'A campaign planning agent ingests the strategic brief (e.g., "grow adoption in mid-market tech"), and immediately suggests: top 500 accounts to target (by industry, company size, growth rate), messaging angles (3 options, each tailored to a buyer persona), and creative themes. The agent cross-references brand guidelines and compliance requirements. If the campaign fits brand and policy, it auto-approves the design phase. If there\'s a concern (e.g., messaging outside brand tone), it flags for human review with reasoning. Campaigns launch in 1 week instead of 6.',
    },
    aiAgentic: {
      summary:
        'Agent designs the full campaign: target list, messaging, creative, and cadence. It auto-executes A/B tests and adjusts based on early response.',
      detail:
        'The campaign agent owns end-to-end design. It segments targets by persona, generates personalized messaging for each, designs creative variations, and schedules the campaign cadence (email 1 on day 1, email 2 on day 4, etc.). It also runs built-in A/B tests: 50% of targets get messaging option A, 50% get option B. Based on open rates and click rates after 72 hours, the agent adjusts the remaining send cadence to the winning message. By week 2, the agent has optimized the campaign in real-time and knows which audience segment responds best. Marketing ops focuses on strategy, not execution.',
    },
  },
  'mktg-demand-gen': {
    preAI: {
      summary:
        'Demand gen runs campaigns based on last month\'s plan. No real-time optimization. If conversion drops 20%, it\'s discovered at month-end.',
      detail:
        'Marketing pre-plans campaigns for the month. Email sends follow a static schedule. If a segment underperforms (e.g., open rate drops from 25% to 12%), marketing doesn\'t notice until the month ends. By then, budget has been wasted on low-performing campaigns. There\'s no feedback loop to adjust mid-month. Marketers feel like they\'re throwing campaigns at the wall and hoping something sticks.',
    },
    aiAgents: {
      summary:
        'Demand gen agent monitors live campaign performance. If open rate drops below threshold, agent suggests pause or pivot. Weekly optimization.',
      detail:
        'A demand gen agent monitors every live campaign in real-time. It tracks email open rate, click rate, and conversion rate. If open rate drops more than 15% below historical average for that audience, the agent flags it and suggests: pause the segment (to stop wasting budget), test a new subject line (refresh the angle), or increase send frequency (maybe the message needs repetition). Marketing ops reviews the suggestion and approves/rejects in <1 hour. This prevents budget waste and keeps campaigns performing. Weekly performance reviews show which segments are hot and which are cooling.',
    },
    aiAgentic: {
      summary:
        'Agent autonomously adjusts campaign performance: pauses underperforming segments, increases frequency for winners, and reallocates budget.',
      detail:
        'The demand gen agent doesn\'t wait for approval—it auto-adjusts within guardrails. If a segment\'s open rate drops >15%, the agent pauses sends for 3 days, tests a new subject line with a 5% sample, and if the new line lifts, it resumes the segment with the new subject. If a segment is outperforming (>35% open rate), the agent increases send frequency from 2x/week to 3x/week. Budget reallocation happens automatically: spend flowing to winners, away from underperformers. At month-end, marketing has discovered which segments are most receptive and why. Future campaigns start with that intelligence built in.',
    },
  },
  'mktg-lead-scoring': {
    preAI: {
      summary:
        'Lead scoring is rule-based: email open = +10 points, demo request = +50, etc. No learning from won/lost deals. 87% of MQLs never convert.',
      detail:
        'Marketing ops sets up static scoring rules (e.g., firmographic score 50 + behavioral score 50 = MQL). These rules rarely change. Over time, the threshold drifts: what was a high-quality MQL in Q1 is a low-quality MQL in Q4, but the rules stay the same. There\'s no feedback loop from sales: which MQLs converted? Why? Marketing is flying blind. 87% of MQLs never convert, which means marketing is generating lots of noise.',
    },
    aiAgents: {
      summary:
        'Lead scoring agent learns from historical conversion data. Scores update based on what actually converted. Accuracy improves to 35-40% MQL-to-SQL.',
      detail:
        'A lead scoring agent ingests historical conversion data: for every customer that was won, what did their lead record look like when they first entered the system? (Company growth rate, website behavior, email engagement, etc.) The agent builds a model of "what converted." Then, it applies this model to new inbound leads. Leads that look like past winners get higher scores. Importantly, the agent updates the model monthly as new win/loss data arrives. Lead scoring becomes data-driven, not rule-driven. MQL quality improves significantly; Sales accepts a higher percentage of MQLs.',
    },
    aiAgentic: {
      summary:
        'Agent continuously learns from conversion patterns and auto-updates scoring weights. Proposes new scoring tiers and audience segments.',
      detail:
        'The lead scoring agent doesn\'t just update weights—it analyzes and proposes. Every month, it discovers patterns: "Leads from Series B software companies in the HR space have a 52% close rate, vs. 18% overall. Consider creating an HR-focused tier." It also discovers decaying segments: "Leads matching the old 2023 ideal customer profile now have a 12% close rate; recommend refreshing persona." Marketing ops uses these insights to redesign segments and campaigns. Lead scoring becomes dynamic, tied to market reality.',
    },
  },
  'mktg-lead-nurturing': {
    preAI: {
      summary:
        'Lead nurture is static: weekly email sequences based on segment. No personalization. 70% of leads drop because follow-up is inadequate.',
      detail:
        'Marketing sets up email sequences: 5 emails over 4 weeks, same for everyone in the segment. A VP at a large tech company gets the same sequence as a manager at a startup. Some leads unsubscribe by email 2; others re-engage after email 4 but marketing doesn\'t pivot. No personalization, no adaptation. 70% of leads that don\'t convert are lost to inadequate follow-up—they ghost, and marketing doesn\'t have a strategy to win them back.',
    },
    aiAgents: {
      summary:
        'Nurture agent personalizes sequences per lead: cadence, content, and next step. Monitors engagement; re-engages cold leads. Conversion improves 25-30%.',
      detail:
        'A nurture agent personalizes each lead\'s journey. It segments by: company growth stage, persona, past engagement, and industry. For each segment, it designs a tailored sequence (VP might get 1 email/week for 8 weeks; Manager might get 2 emails/week for 4 weeks). The agent monitors engagement: if a lead clicks, it increases frequency and personalizes the next email based on what they clicked. If a lead goes cold, the agent re-engages with a different angle (testimonial instead of product feature, ROI calculation instead of feature list). Some leads are routed to sales for a call attempt. Nurture becomes dynamic and conversational, not static and broadcast.',
    },
    aiAgentic: {
      summary:
        'Agent owns lead nurture end-to-end: personalizes, adapts, re-engages, and routes to sales at optimal moment. Hands off a 40%+ conversion rate.',
      detail:
        'The nurture agent is the lead\'s touchpoint owner. It personalizes based on signals: engagement level, company growth, deal cycle stage (e.g., if it\'s December, the lead is likely NOT buying until January, so the agent spaces out messages). It adapts in real-time: if a lead mentions "budget" in a reply, the agent shifts content to ROI and discount options. It also owns the "warm handoff" to sales: the agent signals sales when a lead shows buying intent (3+ opens, click, or explicit reply), and it pre-brief the AE with the lead\'s interests and concerns. Sales gets a warm lead, not a cold MQL. Conversion from nurture to SQL improves to 40%+.',
    },
  },
  'mktg-content-creation': {
    preAI: {
      summary:
        'Content is created in production cycles: quarterly planning, design in month 2, approval in month 3. Market feedback arrives after launch.',
      detail:
        'Marketing plans content quarterly. Writers draft articles/guides, designers create visuals, and approval loops happen over 4-8 weeks. By the time content launches, the news cycle has moved on. Feedback from sales (what customers actually care about) is ignored because there\'s no feedback mechanism. Marketing creates what they think the market wants, not what the market actually wants.',
    },
    aiAgents: {
      summary:
        'Content agent generates outlines and first drafts based on sales/support questions. Brand review happens async. Content ships in 1 week.',
      detail:
        'A content planning agent monitors: what questions do prospects ask during sales calls? What issues do customers report in support tickets? The agent identifies themes (e.g., "14 support tickets last week were about data privacy in AI deployments") and generates a content plan. It drafts an outline, maybe a first draft, and routes to brand review (which can happen async, not in a meeting). Editors refine, designers create visuals, and content ships in 1 week. Content is tied to real customer questions, not editorial hunches.',
    },
    aiAgentic: {
      summary:
        'Agent researches, writes, designs, and publishes content end-to-end. Measures performance; suggests topics based on competitor landscape and customer feedback.',
      detail:
        'The content agent owns the full content lifecycle. It researches industry trends and competitor content, drafts the article, generates images (using image AI), writes headlines (tests 5 options), and publishes. It measures performance: organic traffic, time-on-page, shareability. Based on performance, it recommends follow-up content or improvements to existing content. It also analyzes competitor content and suggests topics we\'re missing. Marketing becomes a data-driven publishing operation.',
    },
  },
};

const mktgopsStageOverviews: { preAI: StageOverview; aiAgents: StageOverview; aiAgentic: StageOverview } = {
  preAI: {
    narrative:
      'Marketing ops spends 40% of time on campaign execution: planning, building email sequences, managing approvals. 30% on lead scoring and management. 20% on content. 10% on strategy.',
    timeAllocation:
      '30% campaign planning & execution, 20% lead scoring, 15% nurturing, 15% content, 20% strategy',
    criticalMetrics: [
      'MQL volume (target: 500/mo, current: 300-400)',
      'MQL quality (target: 30% SQL conversion, current: 13-15%)',
      'Campaign launch time (target: 1 week, current: 4-6 weeks)',
      'Lead nurture conversion (target: 40%, current: 18-22%)',
      'Marketing ROI (target: 8:1, current: 4:1)',
    ],
    strategicOpportunity:
      'Automate campaign execution and lead nurturing to reclaim 30+ hours/week for audience strategy and market insights.',
  },
  aiAgents: {
    narrative:
      'With agents handling campaign execution and lead nurturing, Marketing Ops focuses on campaign optimization and audience strategy. Lead quality improves. Campaigns launch faster. Nurture becomes personalized.',
    timeAllocation:
      '10% campaign planning, 10% execution, 20% optimization, 15% lead scoring, 20% strategy, 25% audience insights',
    criticalMetrics: [
      'MQL volume (improved to 400-500/mo)',
      'MQL quality (improved to 25-30% SQL conversion)',
      'Campaign launch time (reduced to 1-2 weeks)',
      'Lead nurture conversion (improved to 30-35%)',
      'Marketing ROI (improved to 6:1)',
    ],
    strategicOpportunity:
      'Partner with sales to refine audience strategy and messaging based on real conversion data.',
  },
  aiAgentic: {
    narrative:
      'Agents execute campaigns, nurture leads, and generate content. Marketing Ops becomes a strategist: designing audience strategies, testing new channels, and measuring market trends.',
    timeAllocation:
      '5% campaign oversight, 5% exception handling, 15% optimization, 20% strategy, 25% audience insights, 30% experimentation',
    criticalMetrics: [
      'MQL volume (500+/mo)',
      'MQL quality (30-35% SQL conversion)',
      'Campaign launch time (<5 days)',
      'Lead nurture conversion (40%+)',
      'Marketing ROI (8:1+)',
    ],
    strategicOpportunity:
      'Shift to audience innovation: new segments, new channels, new positioning based on market dynamics.',
  },
};

export const MARKETING_OPS_LEAD: RoleDefinition = {
  id: 'marketing-ops-lead',
  title: 'VP Marketing Operations',
  description:
    'Owns marketing pipeline and demand generation: campaign planning, lead scoring, nurturing, and performance against revenue targets.',
  tagline: 'Demand architect. Lead quality owner. Campaign strategist.',
  iconName: 'Megaphone',
  category: 'strategy',
  accentColor: '#5B9ECF',
  ownedSteps: [
    'mktg-campaign-planning',
    'mktg-demand-gen',
    'mktg-lead-scoring',
    'mktg-lead-nurturing',
  ],
  reviewedGates: [
    'mktg-mql-qualification-gate',
    'mktg-budget-gate',
    'mktg-campaign-approval-gate',
  ],
  relatedAgents: [
    'agent-content-generator',
    'agent-lead-scorer',
    'agent-nurture-orchestrator',
  ],
  relatedInputs: [
    'input-cdp-profiles',
    'input-marketing-performance',
    'input-brand-guidelines',
  ],
  narrative: {
    keyInsight:
      'Marketing Ops transforms from a campaign coordinator to a demand architect—using AI to execute campaigns and focusing on audience strategy and ROI optimization.',
    nodeJourneys: mktgopsNodeJourneys,
    stageOverviews: mktgopsStageOverviews,
  },
  painPoints: [
    '87% of MQLs never convert; lead quality is poor',
    'Campaigns take 4-6 weeks to launch; market windows are missed',
    'Lead nurturing is static; 70% drop due to inadequate follow-up',
    'No real-time optimization; underperforming campaigns waste budget',
    'Marketing attribution is fuzzy; ROI is unclear',
  ],
};

// Continue in next part...

// ============================================================================
// REVENUE ROLES (3)
// ============================================================================

const salesopsNodeJourneys: Record<string, NodeJourney> = {
  'sales-lead-qualification': {
    preAI: {
      summary:
        'Sales ops manually qualifies leads: reviews company, reach-checks, assigns territory. 2-4 hours per 50 MQLs. Many leads are never touched.',
      detail:
        'When an MQL arrives, sales ops must: verify the company exists, check if it\'s in our territory, see if it\'s already a customer, look for existing contacts, and assign to the right rep. For a batch of 50 MQLs, this takes 2-4 hours of manual work. Many leads slip through cracks. Some reps get leads outside their territory and reject them. Others never get assigned at all.',
    },
    aiAgents: {
      summary:
        'Qualification agent enriches lead, verifies firmographics, checks territory and deduplication. 100% of leads qualify in <2 minutes.',
      detail:
        'A qualification agent auto-enriches each lead: looks up company in D&B database, checks revenue and employee count, identifies industry and growth rate. It cross-references our CRM: is this company already a customer? Do we have a contact there? Is it in an existing deal? It assigns to territory automatically. If there\'s a conflict (e.g., company overlaps two territories), it flags for sales ops review. 100% of leads are qualified within 2 minutes. None slip through cracks.',
    },
    aiAgentic: {
      summary:
        'Agent qualifies, enriches, and routes with context. Auto-creates CRM account and contact record. Assigns based on rep capacity and territory fit.',
      detail:
        'The qualification agent doesn\'t just check—it prepares. It enriches the lead, creates (or updates) the company account in CRM, creates the contact, and pre-populates fields: industry, company growth rate, employee count, technology stack (if available). It assigns to the rep with the best fit: territory match, win rate on similar accounts, and current workload capacity. The rep gets a warm, pre-populated account. No admin work needed.',
    },
  },
  'sales-discovery-call': {
    preAI: {
      summary:
        'AE prepares call manually: reads past emails, checks company news, makes notes. Takes 20-30 min prep per call. Discovery notes are messy; context is lost.',
      detail:
        'The AE has a discovery call scheduled with a prospect. The AE needs to prep: understand the prospect\'s company, industry context, competitive landscape, and what the prospect cares about. Today, this takes 20-30 min of manual research and note-taking. The AE digs through emails, reads recent news about the company, and jots down a call outline. Notes are scattered: email drafts, Google docs, CRM tasks. When the next AE (or the sales team) picks up the account, context is partially lost.',
    },
    aiAgents: {
      summary:
        'Discovery agent pre-briefs AE: company context, industry trends, competitor intelligence, suggested talking points. AE spends 5 min prepping, not 30.',
      detail:
        'Before the call, a discovery agent generates a pre-brief: company growth trajectory, recent funding/news, key executives and their backgrounds, competitive landscape (who are they comparing us to?), and suggested talking points based on company stage. The AE reads the pre-brief (5 min), gets on the call, and asks better questions because context is already loaded. Call prep time drops from 30 min to 5 min. Call quality improves because the AE is informed.',
    },
    aiAgentic: {
      summary:
        'Agent pre-briefs AE, takes live notes during call, suggests follow-up questions, and auto-drafts post-call email.',
      detail:
        'The discovery agent doesn\'t stop at prep. During the call, the agent listens (via call transcript or recording) and takes notes in real-time: pain points mentioned, budget timeline, decision criteria, competing priorities. It surfaces key insights to the AE in real-time (if the AE is in a second tab). After the call, the agent auto-drafts the follow-up email to the prospect, capturing what was discussed, next steps, and timeline. The AE doesn\'t have to recall and write—the agent has already captured it. Discovery conversations are well-documented, not buried in AE email drafts.',
    },
  },
  'sales-proposal-creation': {
    preAI: {
      summary:
        'AE writes proposals in Word/Slides: copy pricing from Excel, fill in customer name, add standard sections. Takes 3-6 hours. Content is boilerplate.',
      detail:
        'The AE has a qualified prospect and needs to send a proposal. The AE opens a proposal template in Word or Slides, manually fills in customer name, company, deal value, and pricing (copied from an Excel sheet). The AE adds standard sections: use cases, success stories, and timeline. The proposal is 80% boilerplate. Takes 3-6 hours. The proposal is generic; it doesn\'t reflect what the prospect said they care about during discovery.',
    },
    aiAgents: {
      summary:
        'Proposal agent generates proposal in 15 minutes: custom sections based on prospect pain points, relevant case studies, and configured pricing.',
      detail:
        'A proposal agent generates a proposal in 15 minutes. It pulls discovery notes: what pain points did the prospect mention? The agent includes case studies and use cases relevant to those pain points (not generic ones). It calculates pricing based on configured rules (company size, contract term, add-ons). The proposal is personalized, not boilerplate. The AE reviews, adjusts if needed, and sends. Proposal quality improves; sales cycles shorten because the AE spends more time selling, not writing.',
    },
    aiAgentic: {
      summary:
        'Agent generates proposals, customizes based on prospect context, runs competitive positioning, and tracks which sections resonate.',
      detail:
        'The proposal agent auto-generates fully personalized proposals. It knows the prospect\'s pain points (from discovery notes), company size (from enrichment), and what competitors they\'re evaluating. The agent auto-includes competitive positioning: how our solution addresses gaps in the competitor\'s offering. It also tracks: which proposal sections did the prospect view? Which pages got the most time? Based on that data, the agent suggests negotiation angles for the AE (e.g., "Prospect viewed the ROI section 3x; they care about payback period"). Proposals become strategic selling tools, not just documents.',
    },
  },
  'sales-sql-gate': {
    preAI: {
      summary:
        'Sales ops reviews MQL-to-SQL conversion weekly. Looks at volume, not quality. Little feedback to marketing on what makes a good SQL.',
      detail:
        'Weekly, sales ops reviews how many MQLs converted to SQL (moved to a qualified sales stage). The bar is: did we move it past discovery? If yes, it\'s an SQL. There\'s little rigor. An SQL might be a 10-person company with a $20K budget, or a 500-person company with a $500K budget—they\'re treated the same. Feedback to marketing is vague: "leads are low-quality" without specifics.',
    },
    aiAgents: {
      summary:
        'SQL gate agent validates quality: company fit, budget, timeline. Rejects poor-fit leads and routes feedback to marketing. 70%+ SQL conversion.',
      detail:
        'An SQL gate agent validates each converted lead against SQL criteria: company size within target range, industry match, decision timeline within 6 months, budget realistic. If a lead doesn\'t meet criteria, the agent rejects it and routes feedback to marketing: "wrong company size," "no stated budget," etc. Marketing learns what drives SQL conversion. Sales focuses on high-quality leads. SQL volume may drop, but SQL-to-deal conversion improves because deals are better-fit.',
    },
    aiAgentic: {
      summary:
        'Agent validates SQL quality and auto-routes back to marketing if it misses criteria. Proposes scoring updates to improve future lead quality.',
      detail:
        'The SQL gate agent validates and learns. It identifies patterns in rejected leads: "Leads from this industry have 40% rejection rate; update scoring weights for this industry." It auto-routes poor-fit leads back to marketing for nurturing or removal. It also suggests lead scoring updates to prevent future mis-qualifications. The feedback loop is tight: marketing immediately knows which lead profiles convert vs. don\'t.',
    },
  },
  'sales-deal-review-gate': {
    preAI: {
      summary:
        'Deal reviews in weekly sales calls. Limited time per deal. AE picks which deals to discuss. Deals stalling undetected.',
      detail:
        'In a weekly sales call, the AE presents top deals for review. If the pipeline is large, many deals don\'t get discussed. AE might avoid presenting a deal that\'s stuck because they don\'t want to be called out. Deals stall undetected until the forecast closes.',
    },
    aiAgents: {
      summary:
        'Deal gate agent flags all deals by risk: stuck in stage, stalled activity, timeline slip. Sales ops sees full pipeline. All deals get attention.',
      detail:
        'A deal risk agent monitors all deals (not just top 30). It flags by risk category: stuck in stage (>7 days), no recent activity, timeline slipped, pricing outlier. Sales ops sees the full picture: top 20 deals are healthy, 8 are at-risk, 2 need immediate intervention. All deals get attention based on risk, not AE comfort.',
    },
    aiAgentic: {
      summary:
        'Agent coaches AE on stuck deals, suggests next steps, and escalates only deals needing deal desk or CRO intervention.',
      detail:
        'The deal gate agent doesn\'t just flag—it coaches. It reviews each at-risk deal and suggests a next step: "Get on the phone with the champion," "Quantify ROI for this use case," "Schedule a demo with the technical buyer." The agent coaches the AE. Only 2-3 deals per week need escalation (legal issue, custom pricing, contract waiver). Weekly sales call shrinks to 30 min for those critical decisions.',
    },
  },
  'sales-pricing-gate': {
    preAI: {
      summary:
        'Deals negotiate pricing ad hoc. Deal desk gets involved only for large deals. Discounts are given away without guardrails.',
      detail:
        'An AE is negotiating with a prospect who wants a 20% discount. The AE either gives it (losing margin) or escalates to deal desk. Small deals (under $100K) are often discounted without review. Margin slowly erodes.',
    },
    aiAgents: {
      summary:
        'Pricing agent validates discount against rules: margin impact, competitive positioning. Auto-approves within guardrails. Flags exceptions.',
      detail:
        'A pricing agent validates discounts before the AE quotes. The agent checks: does this discount keep us above 60% gross margin? Is the discount in line with competitive positioning? Can we bundle in support to offset discount? The agent either auto-approves (if within guardrails) or flags for deal desk review (if it\'s an edge case). Discounts are strategic, not reflexive.',
    },
    aiAgentic: {
      summary:
        'Agent suggests optimal pricing for each deal based on prospect profile, market dynamics, and margin targets. Negotiates within rules.',
      detail:
        'The pricing agent doesn\'t just validate—it optimizes. For each deal, it calculates the optimal price that maximizes both close probability and margin. It factors in: competitor pricing, customer LTV, contract term. It can also suggest bundling (e.g., "offer 3-year discount in exchange for annual payment") to improve both close rate and cash flow. Pricing becomes strategic, not a fire drill.',
    },
  },
};

const salesopsStageOverviews: { preAI: StageOverview; aiAgents: StageOverview; aiAgentic: StageOverview } = {
  preAI: {
    narrative:
      'Sales ops manages the sales process end-to-end: lead qualification, SQL validation, deal review. 60% of time is process administration: moving leads, reviewing deals, handling exceptions. 40% is strategy.',
    timeAllocation:
      '30% lead qualification & assignment, 15% SQL validation, 20% deal review, 15% pricing negotiation, 20% process improvement',
    criticalMetrics: [
      'Lead-to-SQL conversion (target: 40-50%, current: 20-30%)',
      'SQL-to-deal conversion (target: 50%, current: 30-35%)',
      'Deal velocity (target: 6-8 weeks, current: 10-14 weeks)',
      'Win rate (target: 40%, current: 25-30%)',
      'Average deal discount (target: 5-8%, current: 15-20%)',
    ],
    strategicOpportunity:
      'Automate lead and deal management to reclaim 25+ hours/week for sales process design and competitive strategy.',
  },
  aiAgents: {
    narrative:
      'With agents handling qualification, routing, and deal review, Sales Ops focuses on sales process optimization and competitive strategy. Leads are pre-qualified. Deals are monitored in real-time. Pricing is strategic.',
    timeAllocation:
      '10% lead oversight, 10% SQL validation, 15% deal review, 15% pricing strategy, 50% process innovation',
    criticalMetrics: [
      'Lead-to-SQL conversion (improved to 40-50%)',
      'SQL-to-deal conversion (improved to 40-45%)',
      'Deal velocity (improved to 7-9 weeks)',
      'Win rate (improved to 32-35%)',
      'Average deal discount (improved to 8-12%)',
    ],
    strategicOpportunity:
      'Design competitive playbooks and discovery frameworks that improve deal velocity and win rate.',
  },
  aiAgentic: {
    narrative:
      'Agents execute sales operations: qualifying leads, validating SQLs, monitoring deals, and optimizing pricing. Sales Ops becomes a strategist: designing go-to-market plays and managing competitive threats.',
    timeAllocation:
      '5% agent oversight, 10% exception handling, 20% competitive strategy, 65% go-to-market innovation',
    criticalMetrics: [
      'Lead-to-SQL conversion (45-55%)',
      'SQL-to-deal conversion (45-50%)',
      'Deal velocity (6-8 weeks)',
      'Win rate (38-42%)',
      'Average deal discount (8-10%)',
    ],
    strategicOpportunity:
      'Partner with marketing and product on competitive positioning and market expansion.',
  },
};

export const SALES_OPS_MANAGER: RoleDefinition = {
  id: 'sales-ops-manager',
  title: 'Sales Operations Manager',
  description:
    'Owns the sales process: lead qualification, SQL validation, deal review, and pricing guardrails. Ensures pipeline quality and deal velocity.',
  tagline: 'Pipeline quality owner. Deal velocity driver. Process designer.',
  iconName: 'Target',
  category: 'creative',
  accentColor: '#4CAF50',
  ownedSteps: [
    'sales-lead-qualification',
    'sales-discovery-call',
    'sales-proposal-creation',
  ],
  reviewedGates: [
    'sales-sql-gate',
    'sales-deal-review-gate',
    'sales-pricing-gate',
  ],
  relatedAgents: [
    'agent-sdr-outbound',
    'agent-proposal-builder',
    'agent-forecast-engine',
  ],
  relatedInputs: [
    'input-crm-data',
    'input-pricing-rules',
    'input-territory-model',
    'input-competitive-intel',
  ],
  narrative: {
    keyInsight:
      'Sales Ops transforms from a process administrator to a strategic enabler—using AI to automate qualification and deal management, freeing time to design winning sales strategies.',
    nodeJourneys: salesopsNodeJourneys,
    stageOverviews: salesopsStageOverviews,
  },
  painPoints: [
    'Manual lead qualification takes hours; many leads never assigned',
    'Deal reviews miss most of the pipeline; problems discovered late',
    'Pricing negotiations are ad hoc; margins erode',
    'Proposal creation is boilerplate; not personalized to prospect',
    'SQL quality is undefined; feedback loop to marketing is broken',
  ],
};

// ============================================================================
// DEAL DESK & ACCOUNT EXECUTIVE (continued in next section)
// ============================================================================

const dealDeskNodeJourneys: Record<string, NodeJourney> = {
  'sales-negotiation': {
    preAI: {
      summary:
        'Deal desk reviews deals manually: reads email threads, checks contract history, calculates margin impact. 2-4 hours per complex deal.',
      detail:
        'A complex deal comes to deal desk: prospect wants a 25% discount, a custom contract term, and bundled support. Deal desk must: calculate the margin impact of the discount, review historical precedent for similar discounts, check our contract templates, ensure legal language is sound, and then communicate back to the AE. This takes 2-4 hours. The AE waits, and the prospect gets impatient.',
    },
    aiAgents: {
      summary:
        'Deal desk agent analyzes deal: calculates margin impact, suggests bundling options, and proposes counter-offer. 30-min turnaround.',
      detail:
        'A deal desk agent ingests the deal: prospect discount request, contract terms, add-ons. It calculates margin impact (20% discount = 45% gross margin vs. target 60%). It suggests bundling options: "Offer 20% discount on Year 1 if prospect commits to 3 years; improves LTV." It compares to historical precedent: "Last 5 similar deals got 15% avg discount." It proposes a counter-offer to the AE: "Offer 15% discount, 3-year term, quarterly pricing adjustment." 30-min turnaround. The AE gets back to the prospect quickly with a strategic offer.',
    },
    aiAgentic: {
      summary:
        'Agent negotiates on behalf of deal desk: provides counter-offers, educates prospect on bundling, and escalates only if outside policy.',
      detail:
        'The deal desk agent doesn\'t just advise the AE—it can negotiate directly with the prospect. The agent educates the prospect on value bundling: "Instead of a discount, let\'s shift to a 3-year contract with annual pricing increases 3%; saves you cost, gives us predictability." It provides counter-offers autonomously, within deal desk guardrails. Only if the prospect wants something truly outside policy (e.g., waive our standard data protection SLA) does the agent escalate to deal desk for a human call. Negotiations move faster; deals close sooner.',
    },
  },
  'sales-close': {
    preAI: {
      summary:
        'Deal desk handles closing docs: generates contract, gets legal review (1-2 weeks), and coordinates signature. Deals slip 20-30 days at close.',
      detail:
        'Once a deal is agreed, deal desk must generate the contract. They pull from template, fill in customer name and terms, and send to legal for review. Legal takes 1-2 weeks. Turnaround to the customer: 3 weeks. Customer signatory changes, document gets lost in email, signature takes another week. Deals slip at the finish line.',
    },
    aiAgents: {
      summary:
        'Close agent generates contract in 2 hours: pre-fills terms, routes to legal, tracks signature. 5-day close timeline.',
      detail:
        'A close agent auto-generates the contract in 2 hours: pulls the agreed terms from the deal, fills in customer details, and creates the document. It identifies any custom terms and flags them for legal review (not all contracts need full legal review; standard deals can skip it). It routes to legal only if needed. Once drafted, the agent sends to the customer with an e-signature link. It tracks signature status and sends reminders. Close timeline: 5 days instead of 3-4 weeks.',
    },
    aiAgentic: {
      summary:
        'Agent generates, routes, and closes contracts autonomously. Auto-escalates only non-standard terms. Enables same-day signatures.',
      detail:
        'The close agent owns the full close workflow. It generates the contract, pre-reviews for standard terms, and routes to legal only if there\'s a non-standard item. It sends the e-signature request, tracks status, and escalates if the customer doesn\'t sign within 3 days (human team follows up). For standard deals, close can happen same day. For complex deals, it\'s 3-5 days. Deal desk time per close drops from 4 hours to 30 min of review.',
    },
  },
  'sales-legal-gate': {
    preAI: {
      summary:
        'Legal reviews all contracts: checks terms, flags risks, requests changes. 1-2 week turnaround. Many deals stalled waiting for legal.',
      detail:
        'Legal is a bottleneck. Every contract goes through legal review: data protection terms, liability limits, indemnification. Legal takes 1-2 weeks to review and mark up. Sales feels this is slow; legal feels sales is rushing them. Contracts get reviewed multiple times because of changes.',
    },
    aiAgents: {
      summary:
        'Legal agent pre-reviews contracts: flags risk areas, ensures standard terms are sound, routes to legal only for exceptions.',
      detail:
        'A legal agent (trained on your contract templates and legal preferences) pre-reviews contracts. It checks: are data protection terms standard? Liability limits within policy? Indemnification language sound? If the contract is standard (90% are), the agent auto-approves it for signature. Only 10% that have non-standard terms go to a human lawyer for review. Legal focus shifts from reviewing standard contracts (low-value work) to negotiating non-standard terms (high-value work). Contracts get approved in 2-3 days, not 2 weeks.',
    },
    aiAgentic: {
      summary:
        'Agent auto-approves standard contracts, negotiates non-standard terms within legal guardrails, and escalates only truly risky items.',
      detail:
        'The legal agent doesn\'t just screen—it negotiates non-standard terms. If a prospect requests a non-standard data retention clause, the agent can offer: "We\'ll retain data per GDPR (3 years); anything beyond requires legal review." It educates the customer on risk and offers compromises. Only genuinely risky terms (e.g., indemnification outside our insurance coverage) go to legal counsel for negotiation. Legal counsel focuses on $10M+ deals or truly novel terms. Standard contract review disappears as a bottleneck.',
    },
  },
};

const dealDeskStageOverviews: { preAI: StageOverview; aiAgents: StageOverview; aiAgentic: StageOverview } = {
  preAI: {
    narrative:
      'Deal desk is a bottleneck: 60% of time is spent reviewing deals (margin impact, precedent, bundling options). 30% on contract generation and legal coordination. 10% on strategy. Deals stall waiting for deal desk.',
    timeAllocation:
      '40% deal review & negotiation, 25% contract generation, 20% legal coordination, 15% strategy',
    criticalMetrics: [
      'Negotiation turnaround (target: 1 day, current: 3-5 days)',
      'Contract generation time (target: 1 day, current: 5-7 days)',
      'Legal review turnaround (target: 3 days, current: 10-14 days)',
      'Close-to-signature time (target: 5 days, current: 20-30 days)',
      'Margin impact of discounts (target: 60% gross margin, current: 50-55%)',
    ],
    strategicOpportunity:
      'Automate contract generation and legal pre-screening to reclaim 20+ hours/week for pricing strategy and customer negotiation.',
  },
  aiAgents: {
    narrative:
      'With agents handling contract generation and legal pre-screening, Deal Desk focuses on pricing strategy and complex negotiations. Deals close faster. Margins are protected. Legal is no longer a bottleneck.',
    timeAllocation:
      '20% deal review, 15% pricing strategy, 15% complex negotiation, 20% contract oversight, 30% revenue strategy',
    criticalMetrics: [
      'Negotiation turnaround (improved to 1 day)',
      'Contract generation time (improved to 1-2 days)',
      'Legal review turnaround (improved to 3-5 days)',
      'Close-to-signature time (improved to 10-15 days)',
      'Margin impact of discounts (improved to 58-62%)',
    ],
    strategicOpportunity:
      'Partner with sales and marketing on pricing models and packaging that improve deal quality.',
  },
  aiAgentic: {
    narrative:
      'Agents handle contracts, negotiate non-standard terms, and coordinate legal review. Deal Desk becomes a strategic partner: designing pricing models, managing portfolio risk, and driving margin.',
    timeAllocation:
      '5% deal review, 20% pricing model design, 30% portfolio strategy, 10% complex negotiation, 35% margin optimization',
    criticalMetrics: [
      'Negotiation turnaround (<1 day)',
      'Contract generation time (<1 day)',
      'Legal review turnaround (2-3 days)',
      'Close-to-signature time (5-10 days)',
      'Margin impact of discounts (60-65%)',
    ],
    strategicOpportunity:
      'Lead pricing innovation: new packaging, new contract models, new value bundling.',
  },
};

export const DEAL_DESK_MANAGER: RoleDefinition = {
  id: 'deal-desk-manager',
  title: 'Deal Desk Manager',
  description:
    'Owns pricing, contracts, and complex deal structures. Protects margin while enabling sales to close deals fast. Coordinates with legal.',
  tagline: 'Margin protector. Deal strategist. Contract accelerator.',
  iconName: 'FileSignature',
  category: 'creative',
  accentColor: '#14B8A6',
  ownedSteps: ['sales-negotiation', 'sales-close'],
  reviewedGates: ['sales-pricing-gate', 'sales-legal-gate'],
  relatedAgents: ['agent-proposal-builder'],
  relatedInputs: [
    'input-pricing-rules',
    'input-contract-data',
    'input-compliance-framework',
  ],
  narrative: {
    keyInsight:
      'Deal Desk transforms from a contract coordinator to a pricing architect—using AI to generate contracts and negotiate terms, focusing on margin protection and deal innovation.',
    nodeJourneys: dealDeskNodeJourneys,
    stageOverviews: dealDeskStageOverviews,
  },
  painPoints: [
    'Pricing negotiations are manual and slow; AEs wait for responses',
    'Contract generation is boilerplate; not customized',
    'Legal review is a 2-week bottleneck on most deals',
    'Discount decisions lack consistency; margins erode',
    'Deal desk is reactive to sales, not proactive with strategy',
  ],
};

const aeNodeJourneys: Record<string, NodeJourney> = {
  'sales-discovery-call': {
    preAI: {
      summary:
        'AE preps call manually: reads past emails, researches company. Call is exploratory; discovery notes are scattered.',
      detail:
        'The AE has a discovery call with a prospect. AE prepares by reading past emails and company news (20-30 min). During the call, AE asks open questions and takes notes in email/docs/CRM (inconsistent). After the call, AE has a fragmentary view of the prospect\'s needs. If the account gets transferred to another AE, context is partially lost.',
    },
    aiAgents: {
      summary:
        'Pre-call briefing with competitive context and suggested questions. Post-call, agent auto-drafts summary and follow-up. AE prep drops to 5 min.',
      detail:
        'Before the call, AE gets a pre-brief: company context, recent news, competitive landscape, and suggested discovery questions tailored to the prospect\'s stage. During the call, the AE focuses on listening (not note-taking). After the call, the agent takes the transcript (or AE\'s recording) and auto-generates a summary: pain points identified, budget mentioned, timeline, next steps. The agent also drafts the follow-up email. AE prep and post-call admin drops from 90 min to 15 min.',
    },
    aiAgentic: {
      summary:
        'Agent pre-briefs, takes live notes, suggests follow-up questions, and auto-creates next steps in CRM. AE focus: selling, not admin.',
      detail:
        'The agent is the AE\'s assistant during the call. It pre-briefs with context, listens to the call, takes real-time notes, and can whisper suggestions to the AE (if available). After the call, it creates the post-call summary, drafts a follow-up email, and creates tasks in CRM for the next steps. The AE spends 100% of the call on selling, not admin.',
    },
  },
  'sales-negotiation': {
    preAI: {
      summary:
        'AE negotiates price/terms with prospect. AE must loop in deal desk for approval. Prospect gets impatient during back-and-forth.',
      detail:
        'Prospect says "I like the solution, but your price is 30% higher than Competitor X." AE doesn\'t have authority to discount and must escalate to deal desk. Deal desk takes 2-4 hours to respond with a counter-offer. AE goes back to the prospect with the offer, prospect negotiates again, and the cycle repeats. Total negotiation time: 5-7 days. Prospect frustration: high.',
    },
    aiAgents: {
      summary:
        'Agent suggests negotiation strategy: bundling options, pricing adjustments, and counter-offers. AE negotiates with prospect armed with strategy.',
      detail:
        'When the prospect says "your price is too high," the agent immediately suggests negotiation options to the AE: "Offer 3-year contract at 15% discount; improves LTV and gives them certainty." It provides 2-3 options. AE picks the best fit and negotiates with the prospect. If the prospect agrees, great. If not, AE gets another set of options. Negotiation speed improves; AE feels empowered.',
    },
    aiAgentic: {
      summary:
        'Agent negotiates directly with prospect (within guardrails): offers bundling options, educates on value. AE observes. Only non-standard asks escalate.',
      detail:
        'The agent can negotiate on behalf of the AE. When the prospect opens a negotiation, the agent responds with strategic offers: bundling, terms, timelines. It educates the prospect: "A discount reduces our ability to invest in features you care about; instead, let\'s structure a multi-year deal with quarterly check-ins." Most negotiations close within 1-2 days. AE focus: building relationship, not haggling.',
    },
  },
  'sales-win-loss-gate': {
    preAI: {
      summary:
        'AE submits win/loss feedback manually (if they remember). Feedback is anecdotal. Patterns aren\'t analyzed; lessons aren\'t learned.',
      detail:
        'After a deal closes (won or lost), AE might send a note to sales ops (often they don\'t). Feedback is scattered: "customer wanted lower price," "competitor had better support." Management doesn\'t analyze patterns. Did we lose on price, or on discovery execution? Next quarter, the same mistakes repeat.',
    },
    aiAgents: {
      summary:
        'Agent collects win/loss insights from AE and customer interview. Identifies patterns and routes coaching to AE if needed.',
      detail:
        'After a deal closes, an agent interviews the AE: "What was the customer\'s main objection?" It also interviews the customer (if won, collect why they chose us; if lost, why they didn\'t). The agent aggregates and identifies patterns: "This AE loses deals on discovery—prospects cite \'didn\'t understand my business\' 60% of the time." The agent can recommend coaching: "AE should take Consultative Discovery training." Management gets visibility into AE strengths and development areas.',
    },
    aiAgentic: {
      summary:
        'Agent collects feedback and auto-enrolls AE in coaching for identified gaps. Routes insights to marketing and product for future strategy.',
      detail:
        'The win/loss agent not only collects feedback—it acts on it. If an AE has a weakness (e.g., closing skills), the agent auto-enrolls them in a coaching sprint. If a pattern emerges company-wide (e.g., "Prospect lost because we lack feature X"), the agent routes to product for roadmap consideration. Win/loss becomes a continuous learning loop, not a post-mortem.',
    },
  },
};

const aeStageOverviews: { preAI: StageOverview; aiAgents: StageOverview; aiAgentic: StageOverview } = {
  preAI: {
    narrative:
      'Account Executives spend 40% of time on selling (discovery, demos, negotiation). 35% on admin (prep, notes, proposals, follow-ups). 25% on meetings/calls with prospects and internal stakeholders.',
    timeAllocation:
      '40% selling activities, 35% admin, 25% meetings and internal coordination',
    criticalMetrics: [
      'Win rate (target: 40%, current: 25-30%)',
      'Deal velocity (target: 6-8 weeks, current: 10-14 weeks)',
      'Average deal size (target: $250K, current: $180K)',
      'Quota attainment (target: >90%, current: 70-80%)',
      'Calls/demos per week (target: 12-15, current: 8-10)',
    ],
    strategicOpportunity:
      'Automate call prep, note-taking, and proposal creation to reclaim 25+ hours/week for selling and relationship-building.',
  },
  aiAgents: {
    narrative:
      'With agents handling prep, notes, and proposals, AEs focus on selling. Call time increases. Negotiation is faster. Deals close 20-30% quicker because admin friction is removed.',
    timeAllocation:
      '55% selling activities, 15% admin, 30% meetings and internal coordination',
    criticalMetrics: [
      'Win rate (improved to 32-35%)',
      'Deal velocity (improved to 8-10 weeks)',
      'Average deal size (improved to $220K)',
      'Quota attainment (improved to 85-90%)',
      'Calls/demos per week (improved to 11-13)',
    ],
    strategicOpportunity:
      'With more selling time, AEs can focus on complex deals and relationship expansion.',
  },
  aiAgentic: {
    narrative:
      'Agents handle all admin: prep, notes, proposals, follow-ups, even negotiation on straightforward terms. AE is a relationship strategist: building trust, identifying upsell opportunities, and navigating complex deals.',
    timeAllocation:
      '65% selling activities, 5% admin, 30% meetings and account strategy',
    criticalMetrics: [
      'Win rate (38-42%)',
      'Deal velocity (6-8 weeks)',
      'Average deal size ($280K+)',
      'Quota attainment (95%+)',
      'Calls/demos per week (14-18)',
    ],
    strategicOpportunity:
      'AE becomes a trusted advisor and account strategist, not a transaction processor.',
  },
};

export const ACCOUNT_EXECUTIVE: RoleDefinition = {
  id: 'account-executive',
  title: 'Account Executive',
  description:
    'Owns customer relationships and deal closures. Discovers customer needs, negotiates terms, and closes deals. First line of customer trust.',
  tagline: 'Relationship builder. Deal closer. Customer voice.',
  iconName: 'Handshake',
  category: 'creative',
  accentColor: '#9B7ACC',
  ownedSteps: [
    'sales-discovery-call',
    'sales-negotiation',
    'sales-close',
  ],
  reviewedGates: ['sales-deal-review-gate', 'sales-win-loss-gate'],
  relatedAgents: ['agent-sdr-outbound', 'agent-proposal-builder'],
  relatedInputs: [
    'input-customer-360',
    'input-competitive-intel',
    'input-contract-data',
  ],
  narrative: {
    keyInsight:
      'AE transforms from a transaction processor to a relationship strategist—AI handles prep, notes, and proposals, freeing AE to focus on selling and building trust.',
    nodeJourneys: aeNodeJourneys,
    stageOverviews: aeStageOverviews,
  },
  painPoints: [
    '35% of time on admin (prep, notes, proposals); only 40% on actual selling',
    'Call prep is manual; context is incomplete',
    'Proposal generation is time-consuming; takes 3-6 hours',
    'Negotiation requires back-and-forth with deal desk; slow and frustrating',
    'Notes are scattered; context is lost if account transfers',
  ],
};

// ============================================================================
// GOVERNANCE ROLES (3)
// ============================================================================

const complianceOfficerNodeJourneys: Record<string, NodeJourney> = {
  'mktg-compliance-gate': {
    preAI: {
      summary:
        'Marketing campaigns are reviewed post-launch for compliance. Non-compliant content requires re-work. 2-3 week delay per campaign.',
      detail:
        'Marketing launches a campaign featuring a customer testimonial. A week later, compliance reviews and flags: "Testimonial lacks required disclaimers per FTC guidelines." Campaign must be paused, re-written, re-approved. 2-3 week delay. Opportunity is lost.',
    },
    aiAgents: {
      summary:
        'Compliance agent pre-reviews campaigns before launch: flags missing disclaimers, liability language, substantiation. Approves or rejects in 24 hours.',
      detail:
        'Before a campaign launches, a compliance agent reviews: Are testimonials properly disclaimed? Are health claims substantiated? Does pricing transparency meet regulations? Does privacy language comply with GDPR/CCPA? The agent auto-approves compliant campaigns. Non-compliant campaigns get flagged with specific issues and suggestions for remediation. Review turnaround: 24 hours. Campaigns launch on schedule.',
    },
    aiAgentic: {
      summary:
        'Agent reviews campaigns, identifies compliance issues, and auto-generates remediation language. Compliance review becomes a 2-hour process, not 2 weeks.',
      detail:
        'The compliance agent not only flags issues—it fixes them. For a testimonial missing FTC disclaimers, the agent generates the required language: "Results not typical. Individual experiences may vary." For health claims lacking substantiation, the agent generates disclaimers or suggests removing the claim. Marketing gets a pre-compliant draft. Compliance review becomes fast and collaborative, not a bottleneck.',
    },
  },
  'sales-legal-gate': {
    preAI: {
      summary:
        'Legal reviews contracts manually. 1-2 week turnaround. Sales feels blocked. Opportunities slip.',
      detail:
        'Deal is ready to close. Legal must review the contract. Turnaround: 1-2 weeks. During that time, the prospect is impatient. Deal slips.',
    },
    aiAgents: {
      summary:
        'Compliance agent pre-reviews contracts: checks regulatory language, flags non-standard terms, routes to legal only for exceptions.',
      detail:
        'A compliance agent trained on your legal policies pre-reviews contracts. It checks: Are data protection terms compliant? Liability language aligned with policy? Regulatory requirements met (e.g., anti-bribery, export controls)? Standard contracts get auto-approved (90%). Non-standard terms get flagged with reasoning and routed to legal. Legal focus shifts from standard contract review (low-value) to negotiation of non-standard terms (high-value). Contracts approved in 2-3 days, not 2 weeks.',
    },
    aiAgentic: {
      summary:
        'Agent pre-reviews, negotiates non-standard terms within policy guardrails, and escalates only genuinely risky items to legal counsel.',
      detail:
        'The compliance agent pre-reviews all contracts, flags issues, and negotiates non-standard terms within pre-defined guardrails. If a prospect requests a non-standard indemnification clause, the agent educates: "Our standard indemnification is unlimited for IP; capping it requires legal review." It offers compromises where possible. Legal counsel focuses only on truly novel or risky terms (e.g., customer wanting us to waive insurance requirements). Standard contract compliance becomes automatic.',
    },
  },
};

const complianceStageOverviews: { preAI: StageOverview; aiAgents: StageOverview; aiAgentic: StageOverview } = {
  preAI: {
    narrative:
      'Compliance Officer spends 70% of time on reactive reviews: marketing campaigns, contracts, and communications. Reviews are slow. Campaigns slip. Deals are delayed. 30% on strategy and policy development.',
    timeAllocation:
      '40% campaign compliance review, 30% contract review, 15% monitoring & audits, 15% policy development',
    criticalMetrics: [
      'Compliance review turnaround (target: 24 hours, current: 5-7 days)',
      'Campaign launch delays due to compliance (target: 0, current: 20-30%)',
      'Contract review turnaround (target: 2-3 days, current: 10-14 days)',
      'Compliance violations found post-launch (target: 0, current: 2-3 per quarter)',
      'Regulatory risk score (target: <2/10, current: 5-6/10)',
    ],
    strategicOpportunity:
      'Automate campaign and contract pre-screening to reclaim 20+ hours/week for policy design and risk management.',
  },
  aiAgents: {
    narrative:
      'With agents handling pre-screening and initial review, Compliance becomes a strategic partner. Campaigns launch on schedule. Contracts move fast. Focus shifts to policy innovation and risk mitigation.',
    timeAllocation:
      '20% campaign review, 15% contract review, 15% monitoring, 50% strategy & policy development',
    criticalMetrics: [
      'Compliance review turnaround (improved to 24 hours)',
      'Campaign launch delays (improved to <5%)',
      'Contract review turnaround (improved to 3-5 days)',
      'Compliance violations found (improved to 0-1 per quarter)',
      'Regulatory risk score (improved to 2-3/10)',
    ],
    strategicOpportunity:
      'Design compliance frameworks that enable business growth while protecting risk.',
  },
  aiAgentic: {
    narrative:
      'Agents handle all pre-screening, initial remediation, and non-standard term negotiation. Compliance Officer becomes a strategic advisor: designing policies, managing regulatory relationships, and driving compliance culture.',
    timeAllocation:
      '5% exception handling, 10% monitoring, 20% regulatory relations, 65% policy innovation & strategy',
    criticalMetrics: [
      'Compliance review turnaround (<24 hours)',
      'Campaign launch delays (<2%)',
      'Contract review turnaround (2-3 days)',
      'Compliance violations (0)',
      'Regulatory risk score (<1.5/10)',
    ],
    strategicOpportunity:
      'Lead compliance innovation: new policies, new risk frameworks, new regulatory relationships.',
  },
};

export const COMPLIANCE_OFFICER: RoleDefinition = {
  id: 'compliance-officer',
  title: 'Compliance Officer',
  description:
    'Owns regulatory compliance and data privacy across front office. Reviews marketing campaigns, contracts, and communications for regulatory adherence.',
  tagline: 'Risk guardian. Regulatory strategist. Compliance architect.',
  iconName: 'Shield',
  category: 'governance',
  accentColor: '#D4856A',
  ownedSteps: [],
  reviewedGates: ['mktg-compliance-gate', 'sales-legal-gate'],
  relatedAgents: [],
  relatedInputs: ['input-compliance-framework', 'input-contract-data'],
  narrative: {
    keyInsight:
      'Compliance transforms from a bottleneck to a strategic partner—AI pre-screens campaigns and contracts, freeing the Officer to focus on policy innovation and risk management.',
    nodeJourneys: complianceOfficerNodeJourneys,
    stageOverviews: complianceStageOverviews,
  },
  painPoints: [
    'Campaign review is slow; marketing campaigns are delayed waiting for approval',
    'Contract review is a bottleneck; deals slip waiting for legal review',
    'No pre-screening; issues discovered post-launch require re-work',
    'Reactive posture; compliance is a blocker, not an enabler',
    'Limited resources; manual review processes do not scale',
  ],
};

// ============================================================================
// DATA GOVERNANCE LEAD
// ============================================================================

const dataGovernanceNodeJourneys: Record<string, NodeJourney> = {
  // This role reviewed gates, not owned steps
};

const dataGovernanceStageOverviews: { preAI: StageOverview; aiAgents: StageOverview; aiAgentic: StageOverview } = {
  preAI: {
    narrative:
      'Data Governance Lead spends 60% of time on data quality issues: fixing CRM duplicates, reconciling CDP profiles, auditing data. 25% on privacy compliance. 15% on strategy.',
    timeAllocation:
      '35% CRM/CDP data quality, 20% privacy audit & compliance, 15% integrations, 30% strategy',
    criticalMetrics: [
      'CRM data quality score (target: 95%, current: 65-70%)',
      'Data breach risk (target: 0, current: 1-2 per year)',
      'GDPR request response time (target: <10 days, current: 15-30 days)',
      'Data lineage transparency (target: 100%, current: 40-50%)',
      'Cross-system data consistency (target: 99%, current: 70-75%)',
    ],
    strategicOpportunity:
      'Automate data quality monitoring to reclaim 20+ hours/week for data architecture and governance framework design.',
  },
  aiAgents: {
    narrative:
      'With agents monitoring data quality and flagging anomalies, Data Governance focuses on architecture and privacy strategy. Data consistency improves. Privacy risks are caught early. Cross-system integration is more robust.',
    timeAllocation:
      '10% data quality review, 15% privacy audit, 20% integrations, 55% strategy & architecture',
    criticalMetrics: [
      'CRM data quality score (improved to 85-90%)',
      'Data breach risk (improved to 0)',
      'GDPR request response time (improved to <5 days)',
      'Data lineage transparency (improved to 80-85%)',
      'Cross-system data consistency (improved to 95%)',
    ],
    strategicOpportunity:
      'Design data governance frameworks that enable real-time personalization while protecting privacy.',
  },
  aiAgentic: {
    narrative:
      'Agents monitor data quality, flag anomalies, enforce privacy rules, and maintain data lineage. Data Governance Lead becomes an architect: designing data platforms, managing privacy regulations, and enabling advanced analytics.',
    timeAllocation:
      '5% monitoring, 10% exception handling, 20% privacy strategy, 65% platform architecture & innovation',
    criticalMetrics: [
      'CRM data quality score (90-95%)',
      'Data breach risk (0)',
      'GDPR request response time (<24 hours)',
      'Data lineage transparency (98%+)',
      'Cross-system data consistency (98%+)',
    ],
    strategicOpportunity:
      'Lead data platform innovation: unified customer data, real-time intelligence, and privacy-by-design.',
  },
};

export const DATA_GOVERNANCE_LEAD: RoleDefinition = {
  id: 'data-governance-lead',
  title: 'Data Governance Lead',
  description:
    'Owns data quality, privacy compliance, and cross-system data integrity. Ensures CRM, CDP, and other systems stay in sync and compliant.',
  tagline: 'Data architect. Privacy guardian. Quality master.',
  iconName: 'Database',
  category: 'governance',
  accentColor: '#5B9ECF',
  ownedSteps: [],
  reviewedGates: [],
  relatedAgents: ['agent-customer-360-builder'],
  relatedInputs: [
    'input-crm-data',
    'input-cdp-profiles',
    'input-customer-360',
    'input-nps-csat-data',
  ],
  narrative: {
    keyInsight:
      'Data Governance transforms from a data janitor to an architect—AI monitors quality and privacy, freeing the Lead to design data platforms and enable intelligence.',
    nodeJourneys: dataGovernanceNodeJourneys,
    stageOverviews: dataGovernanceStageOverviews,
  },
  painPoints: [
    'Data quality is poor; CRM has 30-40% duplicates and stale records',
    'Privacy compliance is manual; GDPR/CCPA requests take weeks',
    'Cross-system integration is fragile; data drifts between CRM, CDP, and marketing automation',
    'No real-time data lineage; hard to debug data issues',
    'Privacy rules are hard to enforce; data leaks happen',
  ],
};

// ============================================================================
// BRAND MANAGER
// ============================================================================

const brandManagerNodeJourneys: Record<string, NodeJourney> = {
  'mktg-content-creation': {
    preAI: {
      summary:
        'Brand Manager approves content manually: reviews every piece for tone, visual consistency, messaging alignment. 3-5 hours per content piece.',
      detail:
        'Marketing creates an article. Brand Manager reads, checks tone against brand guidelines, ensures visuals align, verifies messaging is on-brand. Takes 3-5 hours. Content is often rejected for tone drift or messaging misalignment. Revision cycles add 2-3 days.',
    },
    aiAgents: {
      summary:
        'Brand agent pre-screens content: checks tone, visual consistency, messaging alignment. Auto-approves on-brand content. Flags drift in <30 min.',
      detail:
        'Before content goes to Brand Manager, a brand agent pre-screens: Is tone aligned with brand voice (pragmatic, not hype)? Are visuals consistent (color, typography, imagery style)? Is messaging aligned with approved positioning? The agent auto-approves on-brand content. Off-brand content gets flagged with specific deviations. Brand Manager only reviews flagged content, not everything. Review time drops from 3-5 hours per piece to 30 min on edge cases.',
    },
    aiAgentic: {
      summary:
        'Agent generates on-brand content end-to-end: writing, design, messaging. Auto-applies brand rules. Brand Manager reviews only novelty.',
      detail:
        'The brand agent doesn\'t just check—it generates. When marketing requests content (e.g., "Write an article about AI ROI for sales teams"), the agent auto-generates: draft article (in brand voice), suggested visuals (matching brand design system), and messaging angles (aligned with positioning). Brand Manager only reviews truly novel content that deviates from templates. Most content is auto-approved and published.',
    },
  },
  'mktg-content-review-gate': {
    preAI: {
      summary:
        'Brand Manager reviews all marketing content before launch. Review is manual. 1-2 week cycles. Content quality is inconsistent.',
      detail:
        'Every blog post, email, social post, ad copy goes to Brand Manager. Brand Manager reads, provides feedback, marketing revises, Brand Manager re-reviews. Typical cycle: 1-2 weeks. If tone is off, campaign messaging is muddled, or visuals don\'t align, content is rejected late in the process. Campaigns miss launch windows.',
    },
    aiAgents: {
      summary:
        'Content review agent auto-screens: brand consistency, tone, messaging clarity. Provides feedback and suggested edits in 2 hours. Escalates to Brand Manager only for edge cases.',
      detail:
        'A content review agent screens all marketing content before Brand Manager sees it. It checks: Is tone on-brand? Is messaging clear and aligned? Do visuals match brand guidelines? Are there compliance issues? The agent provides feedback: "Tone is too salesy; try a more pragmatic approach." It suggests edits. Marketing can iterate with the agent. Only truly edge-case content (completely new format, novel positioning) goes to Brand Manager for decision-making. Review cycle: 2 hours, not 2 weeks.',
    },
    aiAgentic: {
      summary:
        'Agent screens, provides feedback, and auto-approves on-brand content. Brand Manager focuses on brand strategy, not content review.',
      detail:
        'The content review agent not only screens—it approves. On-brand content gets auto-approved for launch. Off-brand content gets flagged with suggested edits; marketing can auto-iterate. Brand Manager is freed from content review and focuses on brand strategy: messaging hierarchy, positioning evolution, competitive differentiation. Content review becomes a non-blocking, autonomous process.',
    },
  },
};

const brandManagerStageOverviews: { preAI: StageOverview; aiAgents: StageOverview; aiAgentic: StageOverview } = {
  preAI: {
    narrative:
      'Brand Manager spends 60% of time on content approval: reviewing articles, emails, ads for tone and consistency. 20% on brand guidelines enforcement. 20% on brand strategy.',
    timeAllocation:
      '40% content review & approval, 20% brand guideline enforcement, 15% design oversight, 25% brand strategy',
    criticalMetrics: [
      'Content approval turnaround (target: 2 days, current: 7-14 days)',
      'Brand consistency score (target: 95%, current: 70-75%)',
      'Messaging clarity score (target: 90%, current: 65-70%)',
      'Content rework cycles (target: 1, current: 2-3)',
      'Brand voice drift incidents (target: 0, current: 3-5 per quarter)',
    ],
    strategicOpportunity:
      'Automate content pre-screening to reclaim 20+ hours/week for brand strategy and market positioning.',
  },
  aiAgents: {
    narrative:
      'With agents handling content screening and feedback, Brand Manager shifts to strategy. Content launches faster. Brand consistency improves. Content approval is no longer a bottleneck.',
    timeAllocation:
      '15% content review, 15% brand guideline updates, 20% design strategy, 50% brand strategy & positioning',
    criticalMetrics: [
      'Content approval turnaround (improved to 2 days)',
      'Brand consistency score (improved to 88-92%)',
      'Messaging clarity score (improved to 85-90%)',
      'Content rework cycles (improved to 1)',
      'Brand voice drift incidents (improved to 0-1 per quarter)',
    ],
    strategicOpportunity:
      'Design brand evolution: refreshing positioning, updating voice, expanding to new audiences.',
  },
  aiAgentic: {
    narrative:
      'Agents handle all content review and enforcement. Brand Manager becomes a strategist: evolving brand positioning, managing competitive differentiation, and driving brand innovation.',
    timeAllocation:
      '5% exception handling, 10% guideline updates, 20% design innovation, 65% brand strategy & transformation',
    criticalMetrics: [
      'Content approval turnaround (<24 hours)',
      'Brand consistency score (93-97%)',
      'Messaging clarity score (92-96%)',
      'Content rework cycles (<1)',
      'Brand voice drift incidents (0)',
    ],
    strategicOpportunity:
      'Lead brand transformation: new positioning, new voice, expansion into new markets.',
  },
};

export const BRAND_MANAGER: RoleDefinition = {
  id: 'brand-manager',
  title: 'Brand Manager',
  description:
    'Owns brand consistency across all front office touchpoints: marketing, sales, service. Ensures tone, messaging, and visuals align with brand guidelines.',
  tagline: 'Brand guardian. Voice keeper. Consistency driver.',
  iconName: 'Palette',
  category: 'governance',
  accentColor: '#C9A04E',
  ownedSteps: ['mktg-content-creation'],
  reviewedGates: ['mktg-content-review-gate'],
  relatedAgents: ['agent-content-generator'],
  relatedInputs: ['input-brand-guidelines', 'input-compliance-framework'],
  narrative: {
    keyInsight:
      'Brand Manager transforms from a content reviewer to a brand strategist—AI handles content screening and enforcement, freeing time to evolve positioning and voice.',
    nodeJourneys: brandManagerNodeJourneys,
    stageOverviews: brandManagerStageOverviews,
  },
  painPoints: [
    'Spend 60% of time reviewing content; approval cycles are slow',
    'Brand consistency is inconsistent; marketing tone drifts',
    'No clear enforcement of brand guidelines; visual inconsistencies slip through',
    'Brand strategy is neglected because of tactical review work',
    'Messaging is unclear; audience doesn\'t understand positioning',
  ],
};

// Continue to Operations roles in next section...

// ============================================================================
// OPERATIONS ROLES (6)
// ============================================================================

const serviceOpsNodeJourneys: Record<string, NodeJourney> = {
  'svc-ticket-creation': {
    preAI: {
      summary:
        'Support customers create tickets manually: email to support, phone call, or help desk form. Tickets arrive inconsistent in data quality. 20-30% are missing critical fields.',
      detail:
        'Customer emails support with an issue. Ticket is created manually by a support agent. Customer name, company, product version, issue description are gathered over multiple exchanges. 20-30% of tickets are missing critical context. Follow-up questions pile up.',
    },
    aiAgents: {
      summary:
        'Ticket agent auto-creates ticket from email: extracts customer, product, issue, priority, and severity. Flags missing info. 95% of tickets are complete on creation.',
      detail:
        'Customer emails support. A ticket agent parses the email: customer name, company, product, version, issue description, urgency. It auto-creates a complete ticket with all fields populated. If critical info is missing (e.g., product version), the agent auto-sends a clarification request to the customer. Tickets are actionable from day one.',
    },
    aiAgentic: {
      summary:
        'Agent auto-creates, enriches, and routes tickets to the most capable resolver. Tickets arrive ready for immediate resolution.',
      detail:
        'The ticket agent not only creates—it enriches and routes. It looks up the customer in your system: past issues, contract details, support tier. It assigns the ticket to the most capable resolver based on skill match and workload. High-priority tickets for important customers get priority routing. Tickets are resolved 20-30% faster because the resolver has full context and prioritization is smart.',
    },
  },
  'svc-triage': {
    preAI: {
      summary:
        'Support manager manually triages tickets: reads issue, determines priority and severity, assigns to resolver. Takes 30-60 min for 50 tickets daily.',
      detail:
        'Daily, support manager reviews new tickets and assigns priorities: P1 (critical), P2 (high), P3 (medium), P4 (low). For each ticket, the manager reads the issue description and makes a judgment call. Some tickets are mis-triaged (low-priority ticket marked P1; P1 ticket marked P2). Manual triage is slow.',
    },
    aiAgents: {
      summary:
        'Triage agent auto-prioritizes tickets based on: customer tier, issue type, business impact, SLA target. Suggests assignment to resolver. 5-min review cycle.',
      detail:
        'A triage agent auto-prioritizes each ticket: customer support tier (premium customers get priority), issue type (payment issue = priority; feature request = low priority), impact (customer down = P1; cosmetic bug = P4), SLA target. It assigns to the resolver with best fit and available capacity. Support manager reviews the agent\'s prioritization in 5 min (spot-check, not full review). Correct triage is faster and more consistent.',
    },
    aiAgentic: {
      summary:
        'Agent auto-triages and routes. Manager only reviews high-stakes tickets (escalations, VIP customers, unusual issues).',
      detail:
        'The triage agent auto-triages and routes 95% of tickets. Manager only reviews 5%: customer escalations, VIP accounts, edge-case issues. Daily triage work drops from 1 hour to 15 min.',
    },
  },
  'svc-resolution': {
    preAI: {
      summary:
        'Support agents resolve tickets manually: read issue, diagnose, implement fix, test, document. Average resolution time: 24-48 hours. 30% require knowledge lookup or escalation.',
      detail:
        'A support agent gets a ticket. They read the issue, try to remember (or look up) the solution, implement it, test, and document. If they don\'t know the answer, they ask colleagues or escalate to engineering. Average resolution time: 24-48 hours. Customer waits.',
    },
    aiAgents: {
      summary:
        'Resolution agent suggests fixes based on issue description, past tickets, and knowledge base. Agent implements if straightforward; escalates if complex. 8-hour average resolution.',
      detail:
        'A resolution agent reviews the ticket and immediately suggests fixes: "This is a password reset issue; common solution is to email customer a reset link." It searches past tickets for similar issues and their resolutions. It queries the knowledge base. If the suggested fix is straightforward, the agent can implement it directly (e.g., email reset link, update customer config). If it\'s complex, the agent escalates with full context. Support agents implement suggested fixes 80% of the time. Resolution time drops to 8 hours average.',
    },
    aiAgentic: {
      summary:
        'Agent resolves straightforward tickets end-to-end. Escalates only non-standard issues. Average resolution: 4-8 hours. 67% of tickets never touch a human.',
      detail:
        'The resolution agent can resolve simple issues independently: password resets, access requests, status checks, documentation queries. It implements the fix, confirms with the customer, closes the ticket. 67% of tickets are resolved autonomously. Complex issues (bugs, integration issues, architecture questions) are escalated to a human with full context. Support team focus shifts to complex problems. Average resolution time: 4-8 hours. Customer wait time: 80% lower.',
    },
  },
  'svc-knowledge-update': {
    preAI: {
      summary:
        'Support agents rarely update knowledge base. Knowledge base is stale. 30% of agent time is spent searching for past solutions instead of finding answers.',
      detail:
        'Support agents resolve issues but rarely document solutions. When a new agent encounters the same issue, they don\'t find the prior solution and re-solve it. Knowledge base grows slowly and becomes stale.',
    },
    aiAgents: {
      summary:
        'Knowledge agent auto-updates knowledge base after each ticket resolution: extracts solution, writes clear documentation, links related issues.',
      detail:
        'After a ticket is resolved, a knowledge agent auto-extracts the solution and writes a knowledge base article: "How to reset customer password," with steps and screenshots. It links related issues ("Also see: How to unlock account"). Support agents spend less time searching.',
    },
    aiAgentic: {
      summary:
        'Agent creates knowledge articles, links related issues, and auto-suggests articles to agents based on ticket content.',
      detail:
        'The knowledge agent updates the knowledge base, links related articles, and proactively suggests relevant articles to agents when they open a ticket. Over time, the knowledge base becomes comprehensive. First-contact resolution improves.',
    },
  },
};

const serviceOpsStageOverviews: { preAI: StageOverview; aiAgents: StageOverview; aiAgentic: StageOverview } = {
  preAI: {
    narrative:
      'Service Ops spends 40% of time on triage and routing (manual work). 30% on ticket oversight and escalation handling. 20% on knowledge base maintenance. 10% on strategy.',
    timeAllocation:
      '25% triage & routing, 20% ticket oversight, 20% escalation, 15% knowledge management, 20% process improvement',
    criticalMetrics: [
      'Average resolution time (target: 8-12 hours, current: 24-48 hours)',
      'First-contact resolution (target: 60%, current: 30-35%)',
      'Customer satisfaction (target: 90%, current: 65-70%)',
      'SLA compliance (target: >95%, current: 75-80%)',
      'Ticket backlog (target: <100, current: 300-500)',
    ],
    strategicOpportunity:
      'Automate triage and routing to reclaim 15+ hours/week for process design and team coaching.',
  },
  aiAgents: {
    narrative:
      'With agents handling triage, routing, and straightforward resolutions, Service Ops focuses on knowledge management and escalation strategy. Resolution time improves. Customer satisfaction increases.',
    timeAllocation:
      '10% triage oversight, 15% ticket oversight, 20% escalation, 25% knowledge strategy, 30% process innovation',
    criticalMetrics: [
      'Average resolution time (improved to 12-16 hours)',
      'First-contact resolution (improved to 45-50%)',
      'Customer satisfaction (improved to 78-82%)',
      'SLA compliance (improved to 92-95%)',
      'Ticket backlog (improved to 150-200)',
    ],
    strategicOpportunity:
      'Design knowledge strategies that make common issues self-resolvable for customers.',
  },
  aiAgentic: {
    narrative:
      'Agents handle triage, routing, straightforward resolutions, and knowledge updates. Service Ops becomes a strategist: designing support experiences, coaching teams, and managing customer satisfaction.',
    timeAllocation:
      '5% agent oversight, 10% exception handling, 20% escalation strategy, 65% support innovation & coaching',
    criticalMetrics: [
      'Average resolution time (8-12 hours)',
      'First-contact resolution (55-65%)',
      'Customer satisfaction (88-92%)',
      'SLA compliance (97%+)',
      'Ticket backlog (<50)',
    ],
    strategicOpportunity:
      'Transform support into a value-add function: proactive assistance, education, and retention.',
  },
};

export const SERVICE_OPS_MANAGER: RoleDefinition = {
  id: 'service-ops-manager',
  title: 'Service Operations Manager',
  description:
    'Owns ticket management, triage, resolution, and SLA compliance. Ensures customers are supported fast and knowledge is captured.',
  tagline: 'Support architect. Resolution driver. SLA guardian.',
  iconName: 'Headphones',
  category: 'operations',
  accentColor: '#D4856A',
  ownedSteps: [
    'svc-ticket-creation',
    'svc-triage',
    'svc-resolution',
    'svc-knowledge-update',
  ],
  reviewedGates: ['svc-priority-gate', 'svc-sla-gate', 'svc-quality-gate'],
  relatedAgents: [
    'agent-ticket-router',
    'agent-resolution-assistant',
    'agent-knowledge-miner',
  ],
  relatedInputs: [
    'input-support-history',
    'input-product-catalog',
    'input-customer-360',
  ],
  narrative: {
    keyInsight:
      'Service Ops transforms from a reactive firefighter to a proactive enabler—AI automates triage and resolution, freeing time to design support experiences and drive knowledge.',
    nodeJourneys: serviceOpsNodeJourneys,
    stageOverviews: serviceOpsStageOverviews,
  },
  painPoints: [
    'Manual triage takes 1 hour per 50 tickets; many are mis-prioritized',
    'Average resolution time: 24-48 hours (benchmark: 8 hours with AI routing)',
    'Knowledge base is stale; agents re-solve same issues repeatedly',
    'First-contact resolution: 30-35% (benchmark: 60%)',
    '67% of churn is preventable with better support, but teams are understaffed',
  ],
};

// Continue with more Operations roles...
const csOpsNodeJourneys: Record<string, NodeJourney> = {
  'cs-onboarding': {
    preAI: {
      summary:
        'Customer onboarding is manual: CSM sends email, schedules calls, tracks progress. No automation. Takes 4-6 weeks. Adoption lags.',
      detail:
        'New customer is signed. CSM manually schedules onboarding calls, sends training materials, follows up. No centralized tracking. Some customers get thorough onboarding; others get minimal. Adoption is inconsistent.',
    },
    aiAgents: {
      summary:
        'Onboarding agent auto-creates onboarding plan, sends materials, schedules calls, tracks progress. Standardized and personalized. 2 weeks to productive.',
      detail:
        'New customer is signed. An onboarding agent auto-creates a customized onboarding plan based on product complexity and customer industry. It sends training materials, schedules calls with SME experts, tracks completion milestones. CSM gets alerts if customer stalls. Onboarding is standardized, tracked, and faster.',
    },
    aiAgentic: {
      summary:
        'Agent owns onboarding end-to-end: creates plan, sends materials, runs training calls (with AI), tracks milestones, adjusts pace based on progress.',
      detail:
        'The onboarding agent owns the full customer onboarding journey. It creates a customized plan, sends materials, conducts training (using conversational AI, not just videos), tracks progress, and adjusts pacing based on customer adoption speed. CSM is looped in only if customer stalls or needs high-touch help. Onboarding is faster, more personalized, and more effective.',
    },
  },
};

const csOpsStageOverviews: { preAI: StageOverview; aiAgents: StageOverview; aiAgentic: StageOverview } = {
  preAI: {
    narrative:
      'CS Ops spends 50% of time on onboarding: scheduling calls, sending materials, following up. 25% on health monitoring (manual check-ins). 20% on renewals. 5% on strategy.',
    timeAllocation:
      '25% onboarding, 20% health monitoring, 15% renewal management, 15% expansion, 25% strategy & process',
    criticalMetrics: [
      'Time to productivity (target: 2 weeks, current: 4-6 weeks)',
      'Onboarding completion rate (target: 95%, current: 60-65%)',
      'NPS score (target: 50+, current: 35-40%)',
      'Churn rate (target: <5%, current: 8-12%)',
      'Expansion revenue (target: 20-25% of ARR, current: 8-12%)',
    ],
    strategicOpportunity:
      'Automate onboarding and health monitoring to reclaim 20+ hours/week for retention strategy.',
  },
  aiAgents: {
    narrative:
      'With agents handling onboarding and health monitoring, CS Ops focuses on renewal and expansion strategy. Customer adoption improves. Churn drops.',
    timeAllocation:
      '10% onboarding oversight, 15% health monitoring, 20% renewal management, 20% expansion, 35% strategy & coaching',
    criticalMetrics: [
      'Time to productivity (improved to 2-3 weeks)',
      'Onboarding completion rate (improved to 80-85%)',
      'NPS score (improved to 45-50)',
      'Churn rate (improved to 5-7%)',
      'Expansion revenue (improved to 15-18%)',
    ],
    strategicOpportunity:
      'Partner with product on feature adoption and engagement strategies.',
  },
  aiAgentic: {
    narrative:
      'Agents handle onboarding, health monitoring, renewal, and expansion outreach. CS Ops becomes a strategist: designing retention models, managing strategic accounts, and driving customer lifetime value.',
    timeAllocation:
      '5% agent oversight, 10% exception handling, 20% strategic account management, 65% retention strategy & innovation',
    criticalMetrics: [
      'Time to productivity (2 weeks)',
      'Onboarding completion rate (92-96%)',
      'NPS score (52-58)',
      'Churn rate (<4%)',
      'Expansion revenue (22-28% of ARR)',
    ],
    strategicOpportunity:
      'Transform CS into a growth engine: retention, expansion, and upsell.',
  },
};

export const CS_OPS_LEAD: RoleDefinition = {
  id: 'cs-ops-lead',
  title: 'Customer Success Operations Lead',
  description:
    'Owns customer onboarding, health monitoring, renewals, and expansion. Drives customer retention and revenue growth post-sale.',
  tagline: 'Retention architect. Growth driver. Customer strategist.',
  iconName: 'Heart',
  category: 'operations',
  accentColor: '#9B7ACC',
  ownedSteps: [
    'cs-onboarding',
    'cs-health-monitoring',
    'cs-qbr-preparation',
    'cs-renewal-management',
    'cs-expansion',
  ],
  reviewedGates: ['cs-health-gate', 'cs-renewal-gate', 'cs-churn-risk-gate'],
  relatedAgents: [
    'agent-health-scorer',
    'agent-renewal-predictor',
    'agent-expansion-detector',
  ],
  relatedInputs: [
    'input-customer-360',
    'input-usage-telemetry',
    'input-nps-csat-data',
    'input-contract-data',
  ],
  narrative: {
    keyInsight:
      'CS Ops transforms from a manual executor to a strategic leader—AI automates onboarding and health monitoring, freeing time to design retention and expansion strategies.',
    nodeJourneys: csOpsNodeJourneys,
    stageOverviews: csOpsStageOverviews,
  },
  painPoints: [
    'Onboarding is manual and slow; 4-6 weeks to productivity',
    'Health monitoring is reactive; churn is discovered too late',
    'Renewals require manual forecasting; often missed',
    'Expansion opportunities are hidden in usage data',
    '67% of churn is preventable, but teams lack predictive visibility',
  ],
};

// Continue with remaining Operations roles...
export const ESCALATION_MANAGER: RoleDefinition = {
  id: 'escalation-manager',
  title: 'Escalation Manager',
  description:
    'Owns cross-functional escalations: customer complaints, churn risk, executive issues. Coordinates resolution and drives root cause analysis.',
  tagline: 'Escalation strategist. Fire fighter. Risk mitigator.',
  iconName: 'AlertTriangle',
  category: 'operations',
  accentColor: '#E88D67',
  ownedSteps: ['svc-escalation', 'handoff-escalation-to-executive', 'handoff-churn-save'],
  reviewedGates: ['svc-escalation-gate'],
  relatedAgents: ['agent-health-scorer', 'agent-revenue-orchestrator'],
  relatedInputs: [
    'input-customer-360',
    'input-support-history',
    'input-contract-data',
  ],
  narrative: {
    keyInsight:
      'Escalation Manager owns the most critical moments: when customers are unhappy, at risk of churn, or demanding executive action. AI detects and routes escalations; Escalation Manager strategizes resolution.',
    nodeJourneys: {},
    stageOverviews: {
      preAI: {
        narrative:
          'Escalation Manager handles escalations reactively: customer complaint arrives, discovers the issue, assembles team, executes fix. 40% of escalations result in churn.',
        timeAllocation:
          '40% escalation triage & resolution, 30% root cause analysis, 20% team coordination, 10% strategy',
        criticalMetrics: [
          'Escalation response time (target: <4 hours, current: 48-72 hours)',
          'Escalation resolution rate (target: 85%, current: 60%)',
          'Escalation-to-churn rate (target: <15%, current: 35-40%)',
          'Executive escalation frequency (target: <5/month, current: 15-20)',
          'Customer satisfaction post-escalation (target: 80%, current: 50%)',
        ],
        strategicOpportunity:
          'Detect and prevent escalations before they occur; shift from reactive to proactive.',
      },
      aiAgents: {
        narrative:
          'With agents detecting escalation signals early, Escalation Manager becomes proactive. Issues are caught before they become customer complaints. Resolution is strategic, not firefighting.',
        timeAllocation:
          '15% escalation oversight, 25% root cause analysis, 25% prevention strategy, 35% strategic partnerships',
        criticalMetrics: [
          'Escalation response time (improved to <4 hours)',
          'Escalation resolution rate (improved to 80%)',
          'Escalation-to-churn rate (improved to 15-20%)',
          'Executive escalation frequency (improved to 5-8)',
          'Customer satisfaction post-escalation (improved to 75%)',
        ],
        strategicOpportunity:
          'Design escalation prevention strategies: early warning systems, proactive outreach, strategic partnerships.',
      },
      aiAgentic: {
        narrative:
          'Agents detect escalation signals, route to appropriate teams, execute interventions. Escalation Manager focuses on strategic prevention and executive relationships.',
        timeAllocation:
          '5% agent oversight, 20% prevention strategy, 30% executive relationships, 45% strategic risk mitigation',
        criticalMetrics: [
          'Escalation response time (<2 hours)',
          'Escalation resolution rate (85%+)',
          'Escalation-to-churn rate (<10%)',
          'Executive escalation frequency (<3/month)',
          'Customer satisfaction post-escalation (85-90%)',
        ],
        strategicOpportunity:
          'Lead escalation prevention: predictive health models, proactive engagement, and strategic customer partnerships.',
      },
    },
  },
  painPoints: [
    'Escalations are discovered reactively; response time 48-72 hours',
    'No predictive signal; escalations cascade to executive level',
    '35-40% of escalations result in churn',
    'Root cause analysis is manual; same issues repeat',
    'Team is reactive firefighters, not strategic problem-solvers',
  ],
};

export const KNOWLEDGE_MANAGER: RoleDefinition = {
  id: 'knowledge-manager',
  title: 'Knowledge Manager',
  description:
    'Owns knowledge base: content creation, organization, accuracy, and discoverability. Enables self-service and reduces support burden.',
  tagline: 'Knowledge architect. Self-service enabler. Efficiency driver.',
  iconName: 'BookOpen',
  category: 'operations',
  accentColor: '#4CAF50',
  ownedSteps: ['svc-knowledge-update'],
  reviewedGates: ['svc-quality-gate'],
  relatedAgents: ['agent-knowledge-miner', 'agent-resolution-assistant'],
  relatedInputs: ['input-product-catalog', 'input-support-history'],
  narrative: {
    keyInsight:
      'Knowledge Manager transforms from a documentation coordinator to a self-service architect—AI auto-generates knowledge articles, freeing time to design knowledge strategy.',
    nodeJourneys: {},
    stageOverviews: {
      preAI: {
        narrative:
          'Knowledge Manager manually creates and maintains knowledge base. Articles are written infrequently. Search is poor. 70% of support tickets repeat.',
        timeAllocation:
          '40% knowledge creation, 30% knowledge maintenance, 15% search optimization, 15% strategy',
        criticalMetrics: [
          'Knowledge base coverage (target: 80%, current: 40-45%)',
          'Self-service resolution rate (target: 50%, current: 15-20%)',
          'Article accuracy (target: 95%, current: 65-70%)',
          'Search success rate (target: 80%, current: 40%)',
          'Repeat ticket rate (target: <30%, current: 65-70%)',
        ],
        strategicOpportunity:
          'Automate knowledge creation to enable true self-service.',
      },
      aiAgents: {
        narrative:
          'With agents auto-generating knowledge articles, Knowledge Manager focuses on knowledge architecture and search optimization. Coverage improves. Self-service increases.',
        timeAllocation:
          '15% content creation oversight, 20% maintenance, 25% search strategy, 40% knowledge architecture',
        criticalMetrics: [
          'Knowledge base coverage (improved to 70-75%)',
          'Self-service resolution rate (improved to 35-40%)',
          'Article accuracy (improved to 85-90%)',
          'Search success rate (improved to 65-70%)',
          'Repeat ticket rate (improved to 35-40%)',
        ],
        strategicOpportunity:
          'Design knowledge strategy: taxonomy, discoverability, and multi-channel publishing.',
      },
      aiAgentic: {
        narrative:
          'Agents auto-generate, maintain, and optimize knowledge articles. Knowledge Manager becomes an architect: designing knowledge systems and enabling scalable self-service.',
        timeAllocation:
          '5% content oversight, 10% maintenance, 20% knowledge strategy, 65% knowledge innovation',
        criticalMetrics: [
          'Knowledge base coverage (88-92%)',
          'Self-service resolution rate (60-65%)',
          'Article accuracy (96-98%)',
          'Search success rate (85-90%)',
          'Repeat ticket rate (<20%)',
        ],
        strategicOpportunity:
          'Build AI-powered self-service: conversational knowledge assistant that resolves issues without human touch.',
      },
    },
  },
  painPoints: [
    'Knowledge base is incomplete; 40-45% coverage vs. 80% target',
    'Articles are stale; written infrequently, rarely updated',
    'Search is poor; customers can\'t find answers',
    'Support resolves same issues repeatedly; 70% of tickets repeat',
    'Self-service resolution is low; 15-20% vs. 50% target',
  ],
};

export const TERRITORY_PLANNING_LEAD: RoleDefinition = {
  id: 'territory-planning-lead',
  title: 'Territory & Lead Routing Lead',
  description:
    'Owns territory design, lead distribution models, and routing optimization. Ensures fair and efficient allocation of leads to sales team.',
  tagline: 'Territory architect. Routing optimizer. Fairness enforcer.',
  iconName: 'Map',
  category: 'operations',
  accentColor: '#14B8A6',
  ownedSteps: [],
  reviewedGates: ['sales-forecast-gate'],
  relatedAgents: ['agent-lead-scorer', 'agent-forecast-engine'],
  relatedInputs: [
    'input-territory-model',
    'input-revenue-targets',
    'input-pipeline-data',
  ],
  narrative: {
    keyInsight:
      'Territory Lead optimizes allocation models—ensuring leads flow to the best-fit reps while maintaining team morale and growth opportunity.',
    nodeJourneys: {},
    stageOverviews: {
      preAI: {
        narrative:
          'Territory models are static, reviewed annually. Lead distribution is manual. Inequity is discovered too late. Top reps get inundated; struggling reps get nothing.',
        timeAllocation:
          '30% territory planning, 25% lead distribution, 20% fairness & equity oversight, 25% strategy',
        criticalMetrics: [
          'Territory planning cycle (target: quarterly, current: annual)',
          'Lead distribution consistency (target: 90%, current: 60-65%)',
          'Quota parity (target: equal opportunity, current: 2:1 variance)',
          'New rep ramp time (target: 6 months, current: 12-18 months)',
          'Win rate variance by rep (target: <10%, current: 25-35%)',
        ],
        strategicOpportunity:
          'Automate lead routing to enable dynamic, data-driven territory models.',
      },
      aiAgents: {
        narrative:
          'With agents optimizing lead routing in real-time, Territory Lead shifts to strategy. Territory models adapt quarterly. Lead distribution is dynamic and fair.',
        timeAllocation:
          '15% territory planning, 15% routing oversight, 25% equity monitoring, 45% territory strategy',
        criticalMetrics: [
          'Territory planning cycle (improved to quarterly)',
          'Lead distribution consistency (improved to 85-90%)',
          'Quota parity (improved to 1.3:1 variance)',
          'New rep ramp time (improved to 9 months)',
          'Win rate variance (improved to 12-18%)',
        ],
        strategicOpportunity:
          'Design dynamic territory models that adapt to market and team changes.',
      },
      aiAgentic: {
        narrative:
          'Agents optimize lead routing continuously, adjust territory models based on performance, and flag equity issues. Territory Lead focuses on long-term strategy.',
        timeAllocation:
          '5% routing oversight, 10% territory refinement, 25% strategic planning, 60% market & growth strategy',
        criticalMetrics: [
          'Territory planning cycle (<30 days)',
          'Lead distribution consistency (95%+)',
          'Quota parity (<10% variance)',
          'New rep ramp time (6-8 months)',
          'Win rate variance (<8%)',
        ],
        strategicOpportunity:
          'Lead market expansion: new territories, new customer segments, new go-to-market models.',
      },
    },
  },
  painPoints: [
    'Territory models are static, reviewed once per year',
    'Lead distribution is inequitable; top reps get 2x more leads than struggling reps',
    'New reps struggle to ramp; takes 12-18 months to productivity',
    'No dynamic optimization; territories don\'t adapt to market changes',
    'Sales management spends 25% of time on fairness complaints',
  ],
};

export const MARKETING_ANALYST: RoleDefinition = {
  id: 'marketing-analyst',
  title: 'Marketing Analyst',
  description:
    'Owns marketing performance analysis: campaign ROI, lead quality, attribution, and performance optimization. Provides insights for strategy.',
  tagline: 'Data analyst. Performance optimizer. Attribution expert.',
  iconName: 'BarChart3',
  category: 'operations',
  accentColor: '#5B9ECF',
  ownedSteps: ['mktg-lead-scoring'],
  reviewedGates: ['mktg-performance-gate'],
  relatedAgents: ['agent-lead-scorer', 'agent-nurture-orchestrator'],
  relatedInputs: ['input-marketing-performance', 'input-cdp-profiles'],
  narrative: {
    keyInsight:
      'Marketing Analyst transforms from a report generator to a strategic optimizer—using AI-driven insights to continuously improve campaign performance and ROI.',
    nodeJourneys: {},
    stageOverviews: {
      preAI: {
        narrative:
          'Marketing Analyst spends 60% of time on manual reporting: compiling data, building dashboards. Limited time for optimization and strategic insights.',
        timeAllocation:
          '35% reporting & dashboards, 25% analysis, 20% optimization, 20% strategy',
        criticalMetrics: [
          'Campaign ROI visibility (target: 100%, current: 40-50%)',
          'Attribution accuracy (target: 95%, current: 50-60%)',
          'Lead scoring model accuracy (target: 90%, current: 60-65%)',
          'Time to insight (target: <24 hours, current: 5-7 days)',
          'Marketing ROI (target: 8:1, current: 3:1)',
        ],
        strategicOpportunity:
          'Automate reporting to focus on optimization and strategic insights.',
      },
      aiAgents: {
        narrative:
          'With agents handling reporting and analysis, Analyst focuses on optimization and strategic recommendations. Insights are real-time. Campaign performance improves.',
        timeAllocation:
          '10% reporting, 30% analysis, 35% optimization, 25% strategic insights',
        criticalMetrics: [
          'Campaign ROI visibility (improved to 85-90%)',
          'Attribution accuracy (improved to 80-85%)',
          'Lead scoring model accuracy (improved to 78-82%)',
          'Time to insight (improved to 2-4 hours)',
          'Marketing ROI (improved to 5:1)',
        ],
        strategicOpportunity:
          'Design continuous optimization experiments: test messaging, audiences, channels.',
      },
      aiAgentic: {
        narrative:
          'Agents handle all reporting, analysis, and optimization recommendations. Analyst becomes a strategist: designing growth experiments, testing channels, and driving market insights.',
        timeAllocation:
          '5% reporting oversight, 20% strategic analysis, 75% growth experimentation & innovation',
        criticalMetrics: [
          'Campaign ROI visibility (100%)',
          'Attribution accuracy (94-98%)',
          'Lead scoring model accuracy (90%+)',
          'Time to insight (<1 hour)',
          'Marketing ROI (8:1+)',
        ],
        strategicOpportunity:
          'Lead marketing innovation: new channels, new messaging, new audience segments.',
      },
    },
  },
  painPoints: [
    'Spend 60% of time on reporting; insights are delayed',
    'Attribution is fuzzy; hard to trace lead to revenue',
    'Lead scoring models are static; don\'t adapt to market',
    'No real-time optimization; underperforming campaigns waste budget',
    'ROI is unclear; marketing value is questioned',
  ],
};

// ============================================================================
// GROWTH ROLES (3)
// ============================================================================

export const CUSTOMER_ADVOCATE: RoleDefinition = {
  id: 'customer-advocate',
  title: 'Customer Advocate',
  description:
    'Owns voice of customer: feedback loops, win/loss analysis, and customer insights. Ensures customer perspective drives product and go-to-market decisions.',
  tagline: 'Voice of customer. Feedback champion. Insight driver.',
  iconName: 'MessageCircle',
  category: 'growth',
  accentColor: '#C9A04E',
  ownedSteps: ['handoff-win-loss-feedback', 'handoff-cs-to-marketing'],
  reviewedGates: ['svc-csat-gate', 'sales-win-loss-gate'],
  relatedAgents: ['agent-customer-360-builder'],
  relatedInputs: ['input-nps-csat-data', 'input-customer-360'],
  narrative: {
    keyInsight:
      'Customer Advocate owns the voice of customer—using AI to collect feedback at scale and synthesize insights that drive product and go-to-market strategy.',
    nodeJourneys: {},
    stageOverviews: {
      preAI: {
        narrative:
          'Advocate manually collects feedback: surveys, interviews, support ticket analysis. Feedback is anecdotal. Patterns are missed. Product strategy is based on hunches.',
        timeAllocation:
          '40% feedback collection, 30% analysis, 20% stakeholder communication, 10% strategy',
        criticalMetrics: [
          'Feedback collection rate (target: 60%, current: 20-25%)',
          'NPS score (target: 50+, current: 35-40%)',
          'Time to insight (target: <1 week, current: 4-6 weeks)',
          'Product adoption (target: 70%, current: 40-50%)',
          'Customer-driven features (target: 40%, current: 10-15%)',
        ],
        strategicOpportunity:
          'Automate feedback collection to enable continuous customer intelligence.',
      },
      aiAgents: {
        narrative:
          'With agents collecting feedback at scale, Advocate focuses on synthesis and strategy. Feedback is comprehensive. Insights are timely. Product decisions are customer-driven.',
        timeAllocation:
          '15% feedback collection oversight, 30% analysis, 25% stakeholder communication, 30% strategy',
        criticalMetrics: [
          'Feedback collection rate (improved to 45-50%)',
          'NPS score (improved to 45-50)',
          'Time to insight (improved to 1-2 weeks)',
          'Product adoption (improved to 60-65%)',
          'Customer-driven features (improved to 25-30%)',
        ],
        strategicOpportunity:
          'Design feedback loops that drive continuous product and go-to-market improvement.',
      },
      aiAgentic: {
        narrative:
          'Agents collect feedback, synthesize insights, and route recommendations to stakeholders. Advocate becomes a strategist: designing feedback systems and driving customer-centric decision-making.',
        timeAllocation:
          '5% feedback oversight, 15% analysis, 20% stakeholder communication, 60% strategic customer intelligence',
        criticalMetrics: [
          'Feedback collection rate (60-70%)',
          'NPS score (52-60)',
          'Time to insight (<3 days)',
          'Product adoption (75-80%)',
          'Customer-driven features (50%+)',
        ],
        strategicOpportunity:
          'Lead customer-driven innovation: product roadmap, go-to-market strategy, competitive positioning.',
      },
    },
  },
  painPoints: [
    'Feedback collection is manual; only 20-25% response rate',
    'Feedback arrives weeks late; insights are stale',
    'No clear voice of customer; product decisions are based on internal hunches',
    'Win/loss feedback is rarely shared across organization',
    'Customer insights don\'t drive product or marketing strategy',
  ],
};

export const EXPANSION_REVENUE_LEAD: RoleDefinition = {
  id: 'expansion-revenue-lead',
  title: 'Expansion Revenue Lead',
  description:
    'Owns cross-sell and upsell: identifying expansion opportunities, managing expansion campaigns, and driving account growth. Grows revenue per customer.',
  tagline: 'Growth engineer. Account expander. Upsell strategist.',
  iconName: 'Rocket',
  category: 'growth',
  accentColor: '#4CAF50',
  ownedSteps: ['cs-expansion', 'handoff-cross-sell-trigger'],
  reviewedGates: ['cs-renewal-gate'],
  relatedAgents: ['agent-expansion-detector', 'agent-renewal-predictor'],
  relatedInputs: [
    'input-usage-telemetry',
    'input-product-catalog',
    'input-contract-data',
    'input-customer-360',
  ],
  narrative: {
    keyInsight:
      'Expansion Lead drives account growth—using AI to identify upsell/cross-sell opportunities and systematizing expansion motion to grow revenue per customer.',
    nodeJourneys: {},
    stageOverviews: {
      preAI: {
        narrative:
          'Expansion opportunities are discovered haphazardly. Sales and CS have weak alignment. 80% of expansion potential is left on the table. Cross-sell: 8-12% of ARR growth.',
        timeAllocation:
          '40% opportunity discovery, 30% expansion campaign mgmt, 20% sales/CS coordination, 10% strategy',
        criticalMetrics: [
          'Expansion revenue (target: 20-25% of ARR, current: 8-12%)',
          'Upsell win rate (target: 30%, current: 15-18%)',
          'Cross-sell win rate (target: 25%, current: 8-10%)',
          'Time to expand per customer (target: 6 months, current: 12-18 months)',
          'Revenue per customer (target: grow 30%, current: grow 8-10%)',
        ],
        strategicOpportunity:
          'Systematize expansion motion: identify opportunities, qualify, sell, expand.',
      },
      aiAgents: {
        narrative:
          'With agents identifying expansion opportunities and automating outreach, Expansion Lead focuses on strategy and complex deals. Expansion revenue grows 15-20%.',
        timeAllocation:
          '15% opportunity oversight, 25% campaign management, 25% sales/CS coordination, 35% expansion strategy',
        criticalMetrics: [
          'Expansion revenue (improved to 15-18%)',
          'Upsell win rate (improved to 22-25%)',
          'Cross-sell win rate (improved to 15-18%)',
          'Time to expand (improved to 8-10 months)',
          'Revenue per customer (improved 15-20%)',
        ],
        strategicOpportunity:
          'Design expansion packages and motion that align to customer journey.',
      },
      aiAgentic: {
        narrative:
          'Agents identify opportunities, run expansion campaigns, and execute close-close. Expansion Lead becomes a strategist: designing expansion packages, managing strategic accounts, and driving GTM innovation.',
        timeAllocation:
          '5% agent oversight, 15% complex deal management, 80% expansion strategy & account ownership',
        criticalMetrics: [
          'Expansion revenue (22-28% of ARR)',
          'Upsell win rate (35-40%)',
          'Cross-sell win rate (28-32%)',
          'Time to expand (4-6 months)',
          'Revenue per customer (grow 25-30%)',
        ],
        strategicOpportunity:
          'Lead expansion innovation: new packages, new motion, new customer segments.',
      },
    },
  },
  painPoints: [
    'Expansion opportunities are hidden in usage data',
    'Sales and CS don\'t share expansion leads; misalignment',
    'No systematic upsell/cross-sell motion; left on the table',
    'Expansion revenue: 8-12% vs. 20-25% benchmark',
    'Revenue per customer grows slowly; 8-10% vs. 25-30% potential',
  ],
};

export const CONTEXT_ENGINEER: RoleDefinition = {
  id: 'context-engineer',
  title: 'Context Engineer',
  description:
    'The organizational intelligence architect. Owns unified customer context: assembling data from CRM, CDP, usage, support, and product to create a single source of truth. Enables AI agents and smart systems.',
  tagline: 'Data architect. Context builder. Intelligence enabler.',
  iconName: 'Brain',
  category: 'growth',
  accentColor: '#9B7ACC',
  ownedSteps: [],
  reviewedGates: [],
  relatedAgents: ['agent-customer-360-builder', 'agent-revenue-orchestrator'],
  relatedInputs: [
    'input-crm-data',
    'input-cdp-profiles',
    'input-customer-360',
    'input-product-catalog',
  ],
  narrative: {
    keyInsight:
      'Context Engineer is the invisible foundation—building unified customer intelligence that powers all front office agents and enables smarter decisions across every function.',
    nodeJourneys: {},
    stageOverviews: {
      preAI: {
        narrative:
          'Customer data lives in silos: CRM, CDP, support system, product, etc. No unified view. Inconsistencies and duplicates. Each system has partial truth.',
        timeAllocation:
          '50% data integration, 30% data quality, 15% platform maintenance, 5% strategy',
        criticalMetrics: [
          'Data unification (target: 100%, current: 30-40%)',
          'Customer 360 completeness (target: 95%, current: 50-60%)',
          'Data freshness (target: real-time, current: 24 hours)',
          'Cross-system consistency (target: 99%, current: 60-70%)',
          'Data-driven decision rate (target: 80%, current: 20-30%)',
        ],
        strategicOpportunity:
          'Build unified customer intelligence platform.',
      },
      aiAgents: {
        narrative:
          'With agents maintaining data integrity and keeping systems in sync, Context Engineer can focus on architecture. Data is unified. Systems are in sync. AI agents have complete context.',
        timeAllocation:
          '20% data integration, 20% data quality, 25% platform ops, 35% architecture & innovation',
        criticalMetrics: [
          'Data unification (improved to 75-80%)',
          'Customer 360 completeness (improved to 85-90%)',
          'Data freshness (improved to 4-8 hours)',
          'Cross-system consistency (improved to 90-95%)',
          'Data-driven decision rate (improved to 50-60%)',
        ],
        strategicOpportunity:
          'Design real-time customer intelligence platform.',
      },
      aiAgentic: {
        narrative:
          'Agents maintain data integrity, sync systems, and surface insights. Context Engineer becomes a platform architect: designing unified intelligence systems, enabling AI agents, and driving data-driven culture.',
        timeAllocation:
          '5% data ops oversight, 10% exception handling, 85% platform architecture & AI enablement',
        criticalMetrics: [
          'Data unification (95%+)',
          'Customer 360 completeness (96%+)',
          'Data freshness (real-time)',
          'Cross-system consistency (98%+)',
          'Data-driven decision rate (80%+)',
        ],
        strategicOpportunity:
          'Lead organizational intelligence: unified customer data, predictive models, AI-powered automation.',
      },
    },
  },
  painPoints: [
    'Customer data is fragmented: CRM, CDP, support, product have different views',
    'No unified customer 360; each system has incomplete picture',
    'Data quality is poor: duplicates, stale records, missing fields',
    'Systems are out of sync; changes in one don\'t flow to others',
    'AI agents can\'t act confidently; context is incomplete',
  ],
};

// Export all role definitions as array
export const ROLE_DEFINITIONS_FRONTOFFICE: RoleDefinition[] = [
  // Strategy
  CHIEF_REVENUE_OFFICER,
  REVENUE_OPS_LEAD,
  MARKETING_OPS_LEAD,
  // Revenue
  SALES_OPS_MANAGER,
  DEAL_DESK_MANAGER,
  ACCOUNT_EXECUTIVE,
  // Governance
  COMPLIANCE_OFFICER,
  DATA_GOVERNANCE_LEAD,
  BRAND_MANAGER,
  // Operations
  SERVICE_OPS_MANAGER,
  CS_OPS_LEAD,
  ESCALATION_MANAGER,
  KNOWLEDGE_MANAGER,
  TERRITORY_PLANNING_LEAD,
  MARKETING_ANALYST,
  // Growth
  CUSTOMER_ADVOCATE,
  EXPANSION_REVENUE_LEAD,
  CONTEXT_ENGINEER,
];

// Lookup map by role ID — mirrors ROLE_MAP from role-definitions.ts
export const ROLE_MAP_FRONTOFFICE = new Map<string, RoleDefinition>(
  ROLE_DEFINITIONS_FRONTOFFICE.map(r => [r.id, r])
);

// Re-use the same stats computation logic (it's structure-agnostic)
export { computeRoleStats } from './role-definitions';
