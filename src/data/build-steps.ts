// ─── Build Mode Content ──────────────────────────────────────
// All slide content for the "Build It" mode, extracted from the
// Context Engineering for Agentic Operations playbook.
// Each slide maps to a layout type rendered by BuildController.

// ─── Types ───────────────────────────────────────────────────

export interface InputCard {
  id: string;
  title: string;
  icon: string;            // emoji
  whatToExtract: string[];  // bullet points
  typicalSource: string;
  qualityGate: string;
  feedsLayer: string;      // which KG layer this populates
}

export interface CalloutBox {
  title: string;
  body: string;
  icon?: string;
}

export interface ProcessIssue {
  issue: string;
  action: string;
  rationale: string;
  actionType: 'fix-first' | 'encode-as-is' | 'must-add';
}

export interface DomainCard {
  id: string;
  name: string;
  icon: string;
  provides: string;
  dependencyType: 'blocking' | 'governing' | 'constraining' | 'informing' | 'enabling';
  autonomyImpact: string;
}

export interface TierCard {
  tier: string;
  behavior: string;
  examples: string[];
  kgDependency: string;
  color: string;           // hex
}

export interface PhaseCard {
  id: string;
  name: string;
  weeks: string;
  startWeek: number;
  endWeek: number;
  activities: string[];
  deliverables: string[];
  teamRoles: string[];
}

export interface ColumnData {
  title: string;
  icon: string;
  items: string[];
}

export interface ResistanceCard {
  name: string;
  says: string;
  means: string;
  address: string;
  icon: string;
}

export interface TeamRole {
  role: string;
  responsibility: string;
  allocation: string;
}

export interface MaturityLevel {
  level: string;
  name: string;
  kgCharacteristics: string;
  agentCapability: string;
  timeline: string;
  color: string;
}

export interface TimelinePhase {
  name: string;
  duration: string;
  description: string;
  humanRole: string;
  color: string;
}

export interface BuildStep {
  id: string;
  act: number;
  actLabel: string;
  title: string;
  subtitle: string;
  layout: 'title' | 'timeline' | 'layer-cards' | 'hub-spoke' | 'tier-stack' | 'gantt';
  themeColor: string;
  content: {
    headline?: string;
    tagline?: string;
    pipelineStages?: { label: string; icon: string }[];
    adoptionTimeline?: TimelinePhase[];
    columns?: ColumnData[];
    resistancePatterns?: ResistanceCard[];
    layerName?: string;
    layerDescription?: string;
    priorityBadge?: string;
    cards?: InputCard[];
    callout?: CalloutBox;
    processIssues?: ProcessIssue[];
    domains?: DomainCard[];
    tiers?: TierCard[];
    graduationCriteria?: string;
    phases?: PhaseCard[];
    teamRoles?: TeamRole[];
    maturityLevels?: MaturityLevel[];
  };
}

// ─── Slide Data ──────────────────────────────────────────────

export const BUILD_STEPS: BuildStep[] = [

  // ═══════════════════════════════════════════════════════════
  // ACT 1: THE VISION (Slides 1-2)
  // ═══════════════════════════════════════════════════════════

  {
    id: 'build-title',
    act: 1,
    actLabel: 'The Vision',
    title: 'Building the Organizational Intelligence Layer',
    subtitle: 'A 16-week engagement that transforms how marketing operations work',
    layout: 'title',
    themeColor: '#E88D67',
    content: {
      tagline: 'The gap is not the agent. The gap is the context the agent operates within.',
      headline: 'The knowledge graph is the operating system for agentic marketing. It encodes what the team does, what the brand requires, how performance is measured, and who owns what decisions.',
      pipelineStages: [
        { label: 'Plan', icon: '🎯' },
        { label: 'Create', icon: '✏️' },
        { label: 'Review', icon: '✔️' },
        { label: 'Publish', icon: '🚀' },
        { label: 'Measure', icon: '📊' },
        { label: 'Optimize', icon: '🔄' },
      ],
    },
  },

  {
    id: 'human-reality',
    act: 1,
    actLabel: 'The Vision',
    title: 'The Human Reality',
    subtitle: 'Why this takes years, not months',
    layout: 'timeline',
    themeColor: '#E88D67',
    content: {
      tagline: 'Fully agentic does not mean fully automated, and the path takes years, not months.',
      adoptionTimeline: [
        {
          name: 'Build',
          duration: 'Weeks 1-16',
          description: 'Knowledge graph built, validated, MCP servers configured, agent test suite passing.',
          humanRole: 'Humans doing 100% of the work. Consultants building, client SMEs validating.',
          color: '#E88D67',
        },
        {
          name: 'Supervised Launch',
          duration: 'Months 4-7',
          description: 'Agents making recommendations on live workflows. Every recommendation reviewed by a human before execution.',
          humanRole: 'Humans reviewing 100% of agent outputs. Agents functioning as smart recommendation engines.',
          color: '#5B9ECF',
        },
        {
          name: 'Graduated Autonomy',
          duration: 'Months 7-12',
          description: 'Low-risk workflows move to autonomous. Medium-risk to supervised. High-risk stays approval-gated.',
          humanRole: 'Humans reviewing 40-60% of decisions. Focus shifts to exceptions and high-stakes choices.',
          color: '#9B7ACC',
        },
        {
          name: 'Operational Maturity',
          duration: 'Months 12-18+',
          description: 'Agent handles 70-80% of operational decisions. Knowledge graph self-maintains via automated feeds.',
          humanRole: 'Humans reviewing 15-25% of decisions. Role has shifted to strategic oversight and creative direction.',
          color: '#4CAF50',
        },
      ],
      columns: [
        {
          title: 'Stays Human',
          icon: '👤',
          items: [
            'Campaign concepting & creative vision',
            'Brand voice & storytelling',
            'Strategic judgment calls',
            'Stakeholder relationship management',
            'Crisis response',
            'Creative production oversight',
          ],
        },
        {
          title: 'Agents Handle',
          icon: '🤖',
          items: [
            'Compliance checks & regulatory alignment',
            'Budget validation & spend tracking',
            'Workflow routing & approvals',
            'Audience targeting & optimization',
            'Performance monitoring & reporting',
            'Content repurposing & distribution',
          ],
        },
        {
          title: 'The Graph Enables',
          icon: '🧠',
          items: [
            'Cross-domain reasoning (budget + compliance + strategy)',
            'Graduated autonomy tiers',
            'Provenance tracking & audit trails',
            'Real-time constraint enforcement',
            'Edge case discovery & learning loops',
            'Organizational memory that compounds',
          ],
        },
      ],
      resistancePatterns: [
        {
          name: 'The Protectionist',
          says: '"Our processes are too complex to model."',
          means: 'My role becomes replaceable.',
          address: 'Reframe: the graph makes their expertise scalable and permanent, not redundant.',
          icon: '🛡️',
        },
        {
          name: 'The Skeptic',
          says: '"We tried AI before and it failed."',
          means: "I don't want to waste my time.",
          address: 'Show the HITL-heavy launch plan. This is their knowledge, structured, with them in control.',
          icon: '🤨',
        },
        {
          name: 'The Overenthusiast',
          says: '"Let\'s automate everything by Q2."',
          means: 'I want a headline win to justify the investment.',
          address: 'Push back with graduated autonomy. Show the risk of premature automation.',
          icon: '🚀',
        },
        {
          name: 'The Gatekeeper',
          says: '"Legal needs to review every agent decision."',
          means: "My department's authority is undermined.",
          address: "Encode their gate as a blocking dependency. Over time, the gatekeeper often relaxes it.",
          icon: '🔒',
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════
  // ACT 2: WHAT TO GATHER (Slides 3-7)
  // ═══════════════════════════════════════════════════════════

  {
    id: 'structural-layer',
    act: 2,
    actLabel: 'What to Gather',
    title: 'Structural Layer',
    subtitle: 'What exists — teams, systems, data assets, and their relationships',
    layout: 'layer-cards',
    themeColor: '#5B9ECF',
    content: {
      layerName: 'Structural',
      layerDescription: 'The fastest layer to populate because most organizations already have this information documented, if scattered. The challenge is reconciliation, not extraction.',
      priorityBadge: 'P0 — Start here',
      callout: {
        title: 'Why Start Here',
        body: 'The structural layer is the foundation for all queries. Without knowing what teams, systems, and data assets exist, agents cannot route work, check capabilities, or understand who owns what.',
        icon: '🏗️',
      },
      cards: [
        {
          id: 'org-charts',
          title: 'Org Charts',
          icon: '🏢',
          whatToExtract: [
            'Team topology and reporting lines',
            'Role definitions and headcount',
            'Cross-functional committees',
          ],
          typicalSource: 'HRIS (Workday, SAP SuccessFactors), SharePoint, VP of HR',
          qualityGate: 'Verify currency. Org charts are often 6-12 months stale.',
          feedsLayer: 'Structural: OrgUnit, Role, reportsTo',
        },
        {
          id: 'tech-stack',
          title: 'Tech Stack Inventory',
          icon: '💻',
          whatToExtract: [
            'All systems, platforms, and tools',
            'Vendor, contract status, owner, capabilities',
            'API availability and integration points',
          ],
          typicalSource: 'IT asset management, CTO/CIO office, vendor contracts, Martech audit',
          qualityGate: 'Cross-reference with actual usage. Many inventories list licensed but unused tools.',
          feedsLayer: 'Structural: System, dependsOn, syncsTo',
        },
        {
          id: 'system-integrations',
          title: 'System Integration Maps',
          icon: '🔗',
          whatToExtract: [
            'Data flows between systems',
            'Integration method (API, file transfer, manual)',
            'Direction, frequency, data types exchanged',
          ],
          typicalSource: 'Integration platform (MuleSoft, Informatica), IT architecture docs, middleware team',
          qualityGate: 'Test integrations are live. "Connected" on paper often means broken in practice.',
          feedsLayer: 'Structural: receivesDataFrom, sendsDataTo',
        },
        {
          id: 'data-catalogs',
          title: 'Data Catalogs / Dictionaries',
          icon: '📚',
          whatToExtract: [
            'Data assets and classification (public/internal/confidential/restricted)',
            'PII flags and retention policies',
            'Data lineage',
          ],
          typicalSource: 'Data governance team, data catalog tools (Collibra, Alation), CDO office',
          qualityGate: "Check classification accuracy. Many orgs haven't classified post-GDPR.",
          feedsLayer: 'Structural: DataAsset, classification, storesData',
        },
        {
          id: 'vendor-directory',
          title: 'Vendor / Partner Directory',
          icon: '🤝',
          whatToExtract: [
            'Agency relationships, SaaS vendors, media partners',
            'Contract terms, SLAs, primary contacts',
          ],
          typicalSource: 'Procurement, Marketing Ops, contract management system',
          qualityGate: "Include shadow vendors. Teams often engage agencies the org chart doesn't know about.",
          feedsLayer: 'Structural: ExternalEntity, contractedWith',
        },
      ],
    },
  },

  {
    id: 'process-layer',
    act: 2,
    actLabel: 'What to Gather',
    title: 'Process Layer',
    subtitle: 'How work flows — workflows, approvals, and the undocumented reality',
    layout: 'layer-cards',
    themeColor: '#5B9ECF',
    content: {
      layerName: 'Process',
      layerDescription: 'Where most discovery effort concentrates. Process documentation ranges from pristine Visio diagrams nobody follows to tribal knowledge in the heads of three people.',
      priorityBadge: 'P0 — Parallel with Structural',
      callout: {
        title: 'The AS-IS vs. TO-BE Decision',
        body: 'Every piece of process documentation raises the same question: encode what actually happens, or what should happen? The answer is both, explicitly separated. The AS-IS goes in first — agents need current reality to operate on day one.',
        icon: '⚖️',
      },
      processIssues: [
        {
          issue: 'References defunct teams or deprecated systems',
          action: 'FIX FIRST',
          rationale: 'Agent will attempt to route to a team that does not exist. Hard failure.',
          actionType: 'fix-first',
        },
        {
          issue: 'Redundant approval loops (3 people approve the same thing)',
          action: 'ENCODE AS-IS, FLAG',
          rationale: 'May exist for regulatory or political reasons the consultant cannot see from a process map alone.',
          actionType: 'encode-as-is',
        },
        {
          issue: 'Manual steps that could be automated',
          action: 'ENCODE AS-IS',
          rationale: 'Automating in the graph without automating in reality means the agent skips a step humans still perform.',
          actionType: 'encode-as-is',
        },
        {
          issue: 'Missing exception paths (happy path only)',
          action: 'MUST ADD',
          rationale: 'Agents encounter exceptions constantly. No exception paths = agents that freeze or fail silently.',
          actionType: 'must-add',
        },
        {
          issue: 'Circular dependencies (A waits for B waits for A)',
          action: 'FIX FIRST',
          rationale: 'Circular dependencies create infinite loops for agent reasoning. Must be resolved structurally.',
          actionType: 'fix-first',
        },
        {
          issue: 'Process is correct but inefficient',
          action: 'ENCODE AS-IS',
          rationale: 'Efficiency optimization is a Phase 4 activity, not a discovery deliverable.',
          actionType: 'encode-as-is',
        },
      ],
      cards: [
        {
          id: 'process-maps',
          title: 'Process Maps / Workflow Diagrams',
          icon: '🗺️',
          whatToExtract: [
            'End-to-end workflows with triggers, steps, decision points',
            'Handoffs, exception paths, system touchpoints per step',
            'Manual vs. automated designation',
          ],
          typicalSource: 'Visio/Lucidchart/Miro, BPM tools (Camunda, Bizagi), Ops leads',
          qualityGate: 'CRITICAL: Run through optimization assessment before encoding.',
          feedsLayer: 'Process: Workflow, steps, decision_point, actor, system',
        },
        {
          id: 'sops',
          title: 'SOPs (Standard Operating Procedures)',
          icon: '📋',
          whatToExtract: [
            'Step-by-step instructions for recurring tasks',
            'Who performs each step, what system is used',
            'What inputs required, what output produced, what triggers next step',
          ],
          typicalSource: 'SharePoint, Confluence, departmental wikis, onboarding materials',
          qualityGate: 'SOPs often describe the ideal, not the actual. Always cross-validate with practitioners.',
          feedsLayer: 'Process + Rules: steps, preconditions, constraints, actor',
        },
        {
          id: 'playbooks',
          title: 'Playbooks / Runbooks',
          icon: '📖',
          whatToExtract: [
            'Scenario-specific decision frameworks',
            'Decision trees, escalation criteria, response templates',
            'Campaign launch, crisis response, seasonal playbooks',
          ],
          typicalSource: 'Marketing Ops, Brand team, Communications, agency partners',
          qualityGate: 'Playbooks are high-value but often outdated. Check last revision date.',
          feedsLayer: 'Process + Rules: decision_point, branches, exception handling',
        },
        {
          id: 'shadow-processes',
          title: 'Shadow Processes (Undocumented)',
          icon: '👻',
          whatToExtract: [
            'Workarounds and informal approval shortcuts',
            'Tribal knowledge: "how we actually do it" vs. official process',
            'The most valuable and hardest to capture',
          ],
          typicalSource: 'Practitioner interviews, "walk me through your last campaign" sessions, Slack thread analysis',
          qualityGate: 'Always encode. These are the processes agents will actually need to follow.',
          feedsLayer: 'Process: shadow_workflow (tagged with provenance: implicit)',
        },
        {
          id: 'approval-workflows',
          title: 'Approval Workflows',
          icon: '✅',
          whatToExtract: [
            'Who approves what, at what threshold, with what SLA',
            'Through what channel (email, Slack, system)',
            'What happens when the approver is unavailable',
          ],
          typicalSource: 'Finance, Legal, Marketing leadership, project management tools',
          qualityGate: 'Approval workflows are the #1 bottleneck for agent autonomy. Map exhaustively.',
          feedsLayer: 'Process + Rules + HR: approval_matrix, threshold, escalation',
        },
      ],
    },
  },

  {
    id: 'rules-layer',
    act: 2,
    actLabel: 'What to Gather',
    title: 'Rules Layer',
    subtitle: 'What must happen, what must not, and what requires human judgment',
    layout: 'layer-cards',
    themeColor: '#D4856A',
    content: {
      layerName: 'Rules',
      layerDescription: 'The governance backbone. It spans legal compliance, brand governance, financial controls, and data privacy. Missing any creates agents that operate outside organizational guardrails.',
      priorityBadge: 'P1 — Critical path',
      callout: {
        title: 'Brand Decomposition: The Highest-Value Activity',
        body: 'A 60-page brand PDF is useless to an agent. You must decompose it into discrete, testable rules: subject line length limits, approved adjectives, tone score targets. Budget 2-3 days per brand. Requires senior brand practitioners, not just consultants.',
        icon: '🎨',
      },
      cards: [
        {
          id: 'brand-guidelines',
          title: 'Brand Guidelines',
          icon: '🎨',
          whatToExtract: [
            'Voice and tone rules, visual identity, messaging pillars',
            'Approved/prohibited terminology',
            'Channel-specific adaptations, co-branding rules',
          ],
          typicalSource: 'Brand team, CMO office, agency partners, brand portal',
          qualityGate: 'Must be decomposed into machine-readable rules, not ingested as a PDF.',
          feedsLayer: 'Rules: BrandRule (constraint type), applies_to: Creative',
        },
        {
          id: 'regulatory-docs',
          title: 'Regulatory / Compliance Docs',
          icon: '⚖️',
          whatToExtract: [
            'Regulation name, jurisdiction, applicable products/channels',
            'Specific requirements (consent, disclosure, opt-out)',
            'Enforcement body, penalty framework, audit trail requirements',
          ],
          typicalSource: 'General Counsel, Compliance team, regulatory filings, industry guidelines',
          qualityGate: '"GDPR-compliant" is not a rule. "Article 7 consent for EU email marketing" is.',
          feedsLayer: 'Rules: Regulation, requirement, jurisdiction, enforcement',
        },
        {
          id: 'consent-frameworks',
          title: 'Consent Frameworks',
          icon: '🔐',
          whatToExtract: [
            'Consent types by channel (opt-in, opt-out, double opt-in)',
            'Geographic variations, consent decay rules',
            'Suppression list management, preference center architecture',
          ],
          typicalSource: 'Privacy Officer, CMP vendor (OneTrust, TrustArc), legal team',
          qualityGate: 'Consent rules change frequently. Establish refresh cadence (monthly minimum).',
          feedsLayer: 'Rules: ConsentRule, requiresConsent, suppressionRules',
        },
        {
          id: 'financial-controls',
          title: 'Financial Controls / Approval Matrices',
          icon: '💰',
          whatToExtract: [
            'Spend thresholds by role ($10K vs. $100K vs. $1M)',
            'Budget allocation rules, fiscal period constraints',
            'Procurement requirements, PO/invoice workflows',
          ],
          typicalSource: 'CFO office, FP&A, Procurement, delegated authority policies',
          qualityGate: 'Non-negotiable for agent autonomy. This is the #1 blocking dependency.',
          feedsLayer: 'Rules: ApprovalMatrix, threshold, approver, escalation',
        },
        {
          id: 'claim-substantiation',
          title: 'Claim Substantiation Rules',
          icon: '📝',
          whatToExtract: [
            'What claims require evidence ("#1 rated", health claims, environmental)',
            'Substantiation standards, approved claim language',
            'Competitor comparison policies',
          ],
          typicalSource: 'Legal, Regulatory Affairs, product marketing, FTC/ASA guidance',
          qualityGate: 'Often undocumented as formal rules. Extract from legal review rejection patterns.',
          feedsLayer: 'Rules: ClaimRule, evidence_required, applies_to: Creative',
        },
        {
          id: 'data-governance',
          title: 'Data Governance Policies',
          icon: '🗄️',
          whatToExtract: [
            'PII handling rules, data retention schedules',
            'Cross-border transfer restrictions, anonymization requirements',
            'Data sharing agreements, breach notification procedures',
          ],
          typicalSource: 'DPO, CDO, IT Security, data governance committee minutes',
          qualityGate: 'Check enforcement reality. Many policies exist on paper but are not technically enforced.',
          feedsLayer: 'Rules: DataRule, classification, retention, applies_to: DataAsset',
        },
        {
          id: 'slas',
          title: 'SLAs and Commitments',
          icon: '⏱️',
          whatToExtract: [
            'Internal SLAs (creative review turnaround, legal approval windows)',
            'External SLAs (agency delivery, vendor response times)',
            'Penalty clauses, escalation triggers',
          ],
          typicalSource: 'Vendor contracts, internal service agreements, project management tools',
          qualityGate: 'Must include both target and actual performance. Critical for agent time-awareness.',
          feedsLayer: 'Rules + Metrics: SLA, commitment, measurement, penalty',
        },
      ],
    },
  },

  {
    id: 'metrics-layer',
    act: 2,
    actLabel: 'What to Gather',
    title: 'Metrics Layer',
    subtitle: 'How the organization measures itself — the feedback signal for optimization',
    layout: 'layer-cards',
    themeColor: '#C9A04E',
    content: {
      layerName: 'Metrics',
      layerDescription: 'Without a well-structured metrics layer, agents can execute workflows but cannot evaluate whether those workflows are succeeding. This is the feedback loop.',
      priorityBadge: 'P1 — After systems mapped',
      callout: {
        title: 'The ROAS Problem',
        body: '"ROAS" means different things to different teams. Ensure formulas are explicit and agreed. Dashboard ROAS may differ from finance ROAS. Map every dashboard metric back to its canonical KPI definition.',
        icon: '📊',
      },
      cards: [
        {
          id: 'kpi-frameworks',
          title: 'KPI Frameworks',
          icon: '🎯',
          whatToExtract: [
            'KPI name, formula/calculation, unit of measure',
            'Cadence, target, warning threshold, critical threshold',
            'Owner, data source, leading vs. lagging designation',
          ],
          typicalSource: 'Marketing leadership, BI/analytics team, board reporting decks',
          qualityGate: 'Ensure formulas are explicit and agreed across teams.',
          feedsLayer: 'Metrics: KPI, formula, target, threshold, owner',
        },
        {
          id: 'attribution-models',
          title: 'Attribution Models',
          icon: '🔀',
          whatToExtract: [
            'Model type (first-touch, last-touch, multi-touch, data-driven)',
            'Lookback window, channel weights, conversion events',
            'Touchpoint definitions',
          ],
          typicalSource: 'Analytics team, attribution platform (GA, Rockerbox), marketing science',
          qualityGate: 'Multiple models may coexist. Capture all, note which is official for budget decisions.',
          feedsLayer: 'Metrics: Attribution, model, touchpoints, confidence',
        },
        {
          id: 'dashboard-inventory',
          title: 'Dashboard Inventory',
          icon: '📈',
          whatToExtract: [
            'What dashboards exist, who sees them',
            'What KPIs they contain, refresh frequency',
            'Source system, known reliability issues',
          ],
          typicalSource: 'BI team (Tableau, Looker, Power BI), Marketing Ops, leadership',
          qualityGate: 'Map dashboard metrics back to KPI definitions. Dashboard figures may diverge.',
          feedsLayer: 'Metrics: Dashboard, audience, kpis, refresh_cadence',
        },
        {
          id: 'mmm-measurement',
          title: 'Measurement Frameworks / MMM',
          icon: '🔬',
          whatToExtract: [
            'Marketing mix models, incrementality test results',
            'Holdout test methodology, lift analysis',
            'Statistical significance standards',
          ],
          typicalSource: 'Marketing science team, analytics vendors, effectiveness consultants',
          qualityGate: 'Often the most sophisticated but least operationalized knowledge. Bridge to real-time decisions.',
          feedsLayer: 'Metrics + Context: MeasurementModel, methodology, confidence_interval',
        },
        {
          id: 'competitive-benchmarks',
          title: 'Competitive Benchmarks',
          icon: '🏆',
          whatToExtract: [
            'Industry benchmark data, competitive spend estimates',
            'Share of voice metrics, category performance benchmarks',
          ],
          typicalSource: 'Strategy team, media agency, competitive intelligence tools',
          qualityGate: 'Benchmark data is inherently lower-confidence. Tag provenance explicitly.',
          feedsLayer: 'Metrics: Benchmark, source, confidence: low',
        },
      ],
    },
  },

  {
    id: 'context-layer',
    act: 2,
    actLabel: 'What to Gather',
    title: 'Context Layer',
    subtitle: 'Cross-cutting strategic inputs that inform how agents reason across domains',
    layout: 'layer-cards',
    themeColor: '#9B7ACC',
    content: {
      layerName: 'Context',
      layerDescription: 'Synthesized from all other layers plus senior-level strategic inputs. These carry the highest strategic weight and are the most sensitive to change.',
      priorityBadge: 'P2 — Synthesize from all layers',
      callout: {
        title: 'The Highest-Authority Inputs',
        body: 'Strategy decks and OKRs are the most authoritative context in the graph — but they change quarterly. Build refresh triggers. Persona docs are often aspirational; cross-validate against actual behavioral data.',
        icon: '🧠',
      },
      cards: [
        {
          id: 'strategy-decks',
          title: 'Strategy Decks / Annual Plans',
          icon: '📑',
          whatToExtract: [
            'Strategic priorities and target markets',
            'Competitive positioning, growth targets',
            'Investment thesis, portfolio strategy',
          ],
          typicalSource: 'CEO/COO, strategy team, board materials, annual planning presentations',
          qualityGate: 'Strategy is the highest-authority input. But it changes quarterly. Build refresh triggers.',
          feedsLayer: 'Context + Strategy domain: Priority, alignsWith',
        },
        {
          id: 'okr-frameworks',
          title: 'OKR / Goal Frameworks',
          icon: '🎯',
          whatToExtract: [
            'Quarterly/annual objectives with measurable key results',
            'Ownership and dependencies between team OKRs',
            'Progress tracking methodology',
          ],
          typicalSource: 'OKR platform (Lattice, Ally.io), strategy team, department heads',
          qualityGate: 'OKRs bridge strategy and metrics. Ensure KG connects OKR key results to KPI definitions.',
          feedsLayer: 'Context: OKR, keyResult, linked_kpi, owner',
        },
        {
          id: 'customer-research',
          title: 'Customer / Audience Research',
          icon: '👥',
          whatToExtract: [
            'Persona definitions and journey maps',
            'Segmentation models, voice-of-customer data',
            'NPS drivers, churn analysis, lifetime value models',
          ],
          typicalSource: 'Insights team, CRM analytics, research vendors, customer success',
          qualityGate: 'Persona docs are often aspirational. Cross-validate against actual behavioral data from CDP/CRM.',
          feedsLayer: 'Context + Marketing: Persona, journeyStage, AudienceSegment',
        },
        {
          id: 'competitive-intel',
          title: 'Competitive Intelligence',
          icon: '🔍',
          whatToExtract: [
            'Competitor profiles and positioning maps',
            'Feature comparisons, messaging analysis',
            'Win/loss data, competitive response playbooks',
          ],
          typicalSource: 'Strategy team, sales enablement, competitive intelligence tools',
          qualityGate: 'Competitive intel decays fast. Tag with date and refresh quarterly at minimum.',
          feedsLayer: 'Context + Strategy: Competitor, positioning, threat_level',
        },
        {
          id: 'product-roadmaps',
          title: 'Product Roadmaps',
          icon: '🗓️',
          whatToExtract: [
            'Upcoming launches, feature releases, deprecation schedules',
            'Pricing changes, bundling strategy',
            'Beta programs',
          ],
          typicalSource: 'Product management, product marketing, CPO office',
          qualityGate: 'Roadmaps shift constantly. Encode with confidence levels and planned dates, not certainties.',
          feedsLayer: 'Context + Product: PlannedRelease, launch_date, confidence',
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════
  // ACT 3: THE ARCHITECTURE (Slides 8-9)
  // ═══════════════════════════════════════════════════════════

  {
    id: 'cross-domain',
    act: 3,
    actLabel: 'The Architecture',
    title: 'Cross-Domain Dependencies',
    subtitle: 'Seven interconnected domains required for high-autonomy marketing operations',
    layout: 'hub-spoke',
    themeColor: '#5B9ECF',
    content: {
      tagline: 'Marketing sits at the center of a web of dependencies. Each connected domain contributes knowledge primitives that agents require to operate autonomously.',
      domains: [
        {
          id: 'legal',
          name: 'Legal / Compliance',
          icon: '⚖️',
          provides: 'Approved messaging frameworks, consent rules (GDPR/CCPA), regulatory constraints by jurisdiction, claim substantiation requirements',
          dependencyType: 'blocking',
          autonomyImpact: 'Agent CANNOT launch without compliance clearance',
        },
        {
          id: 'finance',
          name: 'Finance',
          icon: '💰',
          provides: 'Budget allocations by cost center, approval thresholds by role/amount, spend velocity limits, ROI targets',
          dependencyType: 'blocking',
          autonomyImpact: 'Agent CANNOT commit spend without budget validation',
        },
        {
          id: 'strategy',
          name: 'Corporate Strategy',
          icon: '🧭',
          provides: 'Strategic priorities, target market definitions, competitive positioning, brand pillars, quarterly OKRs',
          dependencyType: 'governing',
          autonomyImpact: 'Agent decisions must align; misalignment triggers escalation',
        },
        {
          id: 'supply-chain',
          name: 'Supply Chain',
          icon: '📦',
          provides: 'Inventory levels by SKU/region, lead times, stockout risk, fulfillment capacity, promotional allocation limits',
          dependencyType: 'constraining',
          autonomyImpact: 'Agent must validate product availability before promotion',
        },
        {
          id: 'product',
          name: 'Product',
          icon: '🏷️',
          provides: 'Product catalog, pricing rules, feature specs, bundling logic, launch timelines, deprecation schedules',
          dependencyType: 'informing',
          autonomyImpact: 'Agent uses for content accuracy; errors trigger review',
        },
        {
          id: 'hr-org',
          name: 'HR / Org',
          icon: '👥',
          provides: 'Approval authority matrices, team capabilities, role hierarchies, escalation paths, capacity constraints',
          dependencyType: 'enabling',
          autonomyImpact: 'Agent routes decisions to correct approver based on threshold',
        },
        {
          id: 'data-it',
          name: 'Data / IT',
          icon: '🖥️',
          provides: 'System integrations, API capabilities, data classification rules, PII handling requirements, retention policies',
          dependencyType: 'enabling',
          autonomyImpact: 'Agent understands what systems can do and what data it can touch',
        },
      ],
    },
  },

  {
    id: 'autonomy-tiers',
    act: 3,
    actLabel: 'The Architecture',
    title: 'Autonomy Tiers',
    subtitle: 'Mapping every marketing workflow to the appropriate level of agent independence',
    layout: 'tier-stack',
    themeColor: '#4CAF50',
    content: {
      tagline: 'At launch, every workflow begins at Approval-Gated or Human-Only regardless of its eventual target tier. This is non-negotiable.',
      graduationCriteria: 'An agent must achieve 95%+ decision concordance with human reviewers over 30+ decisions before moving from Approval-Gated to Supervised. Track every human override as a training signal.',
      tiers: [
        {
          tier: 'Autonomous',
          behavior: 'Agent executes without human approval. Decisions logged for audit but not gated.',
          examples: [
            'Email send-time optimization',
            'A/B test variant selection',
            'Bid adjustments within daily cap',
            'Content rotation within approved library',
          ],
          kgDependency: 'Metrics Layer + Process Layer only. No cross-domain traversal required.',
          color: '#4CAF50',
        },
        {
          tier: 'Supervised',
          behavior: 'Agent recommends and executes after timeout (e.g., 4 hours). Human can intervene.',
          examples: [
            'Budget reallocation within campaign (<20% shift)',
            'Audience segment expansion',
            'Channel mix adjustment',
            'Dynamic pricing within bounds',
          ],
          kgDependency: 'Finance constraints + Strategy alignment. Requires governing dependency check.',
          color: '#5B9ECF',
        },
        {
          tier: 'Approval-Gated',
          behavior: 'Agent prepares recommendation with full rationale. Human must explicitly approve.',
          examples: [
            'New campaign launch',
            'Budget requests >$50K',
            'New audience targeting criteria',
            'Creative concept approval',
          ],
          kgDependency: 'All blocking dependencies (Legal, Finance). Requires HR approval matrix traversal.',
          color: '#C9A04E',
        },
        {
          tier: 'Human-Only',
          behavior: 'Agent provides analysis and options but cannot execute. Strategic and high-risk decisions.',
          examples: [
            'Annual planning',
            'Brand positioning changes',
            'Crisis response',
            'Major partnership commitments',
          ],
          kgDependency: 'Full cross-domain traversal. Strategy + Legal + Finance + HR + Product all consulted.',
          color: '#D4856A',
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════
  // ACT 4: THE BUILD (Slide 10)
  // ═══════════════════════════════════════════════════════════

  {
    id: 'build-timeline',
    act: 4,
    actLabel: 'The Build',
    title: 'The 16-Week Build',
    subtitle: 'From domain discovery to validated, agent-ready knowledge graph',
    layout: 'gantt',
    themeColor: '#E88D67',
    content: {
      tagline: 'The knowledge graph can be built in 16 weeks. Getting the organization to trust it, adopt it, and evolve with it takes 12-18 months beyond that.',
      phases: [
        {
          id: 'phase-1',
          name: 'Domain Discovery',
          weeks: 'Weeks 1-3',
          startWeek: 1,
          endWeek: 3,
          activities: [
            'Discovery across all 7 domains',
            'Stakeholder mapping and kickoff workshop',
            'Process walk-throughs for 3-5 core workflows',
          ],
          deliverables: [
            'Domain inventory (YAML)',
            'Stakeholder map',
            'Resistance mitigation plan',
            'AS-IS process maps',
          ],
          teamRoles: ['Context Engineer', 'Domain Analyst', 'Engagement Manager'],
        },
        {
          id: 'phase-2',
          name: 'Ontology Design',
          weeks: 'Weeks 3-5',
          startWeek: 3,
          endWeek: 5,
          activities: [
            'Cross-domain junction entity definition',
            'Brand and compliance rule decomposition',
            'Interview remaining domain SMEs',
          ],
          deliverables: [
            'Cross-domain ontology (YAML + TTL)',
            'Junction entity catalog',
            'Brand rule inventory',
          ],
          teamRoles: ['Context Engineer', 'Domain Analyst'],
        },
        {
          id: 'phase-3',
          name: 'KG Population',
          weeks: 'Weeks 5-8',
          startWeek: 5,
          endWeek: 8,
          activities: [
            'Population in dependency order: Structural → Process → Rules → Metrics',
            'Automated feeds where possible',
            'Provenance metadata for all assertions',
          ],
          deliverables: [
            'Populated KG (JSON-LD + graph DB)',
            'Provenance metadata',
          ],
          teamRoles: ['Graph Engineer', 'Context Engineer'],
        },
        {
          id: 'phase-4',
          name: 'Digital Twin Assembly',
          weeks: 'Weeks 8-12',
          startWeek: 8,
          endWeek: 12,
          activities: [
            'Agent affordance mapping per layer',
            'Autonomy tier assignment for every workflow',
            'MCP server configuration',
          ],
          deliverables: [
            'Digital twin architecture doc',
            'Autonomy tier matrix',
            'MCP server config',
            'Agent affordance map',
          ],
          teamRoles: ['Graph Engineer', 'Context Engineer', 'Engagement Manager'],
        },
        {
          id: 'phase-5',
          name: 'Validation & Testing',
          weeks: 'Weeks 12-16',
          startWeek: 12,
          endWeek: 16,
          activities: [
            'Ontology consistency checks',
            'Data freshness and cross-domain integrity',
            'Agent test suite (50+ scenarios)',
          ],
          deliverables: [
            'Agent test suite (YAML)',
            'Validation report',
            'Governance and maintenance playbook',
          ],
          teamRoles: ['Context Engineer', 'Graph Engineer', 'Engagement Manager'],
        },
      ],
      teamRoles: [
        {
          role: 'Context Engineer (Lead)',
          responsibility: 'Ontology design, cross-domain architecture, validation, agent affordance mapping',
          allocation: '100% — Weeks 1-16',
        },
        {
          role: 'Domain Analyst',
          responsibility: 'Discovery interviews, process mapping, document analysis, shadow process extraction',
          allocation: '100% — Weeks 1-8',
        },
        {
          role: 'Graph Engineer',
          responsibility: 'KG population, MCP server development, agent integration, test suite',
          allocation: '100% — Weeks 5-16',
        },
        {
          role: 'Engagement Manager',
          responsibility: 'Client relationship, cross-domain stakeholder coordination, scope management',
          allocation: '50% — Weeks 1-16',
        },
      ],
      maturityLevels: [
        {
          level: 'L1',
          name: 'Cataloged',
          kgCharacteristics: 'Structural layer populated. Systems, teams, and data assets inventoried.',
          agentCapability: 'Agent can answer "what exists" questions. Equivalent to a smart search tool.',
          timeline: 'Weeks 1-4',
          color: '#5B9ECF',
        },
        {
          level: 'L2',
          name: 'Mapped',
          kgCharacteristics: 'Structural + Process + Rules populated for primary domain. Cross-domain junctions designed.',
          agentCapability: 'Agent can walk through workflows and check constraints. Tier 1 decisions possible.',
          timeline: 'Weeks 4-10',
          color: '#9B7ACC',
        },
        {
          level: 'L3',
          name: 'Connected',
          kgCharacteristics: 'All five layers populated. Cross-domain dependencies active. Provenance tracked.',
          agentCapability: 'Cross-domain decisions (budget + compliance + strategy). Tiers 1-3 operational.',
          timeline: 'Weeks 10-16',
          color: '#C9A04E',
        },
        {
          level: 'L4',
          name: 'Autonomous',
          kgCharacteristics: 'KG self-maintaining via automated population. Ontology evolves with organizational change.',
          agentCapability: 'Full agentic operations. Tiers 1-3 independent. Continuous learning loop.',
          timeline: 'Months 6-12+',
          color: '#4CAF50',
        },
      ],
    },
  },
];
