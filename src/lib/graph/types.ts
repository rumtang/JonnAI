// ─── Node Types ───────────────────────────────────────────────
// Simplified from 8 types to 4 for content-production focus.

export type NodeType =
  | 'step'     // Concrete action in the content production lifecycle
  | 'gate'     // Checkpoint where work is reviewed / approved / sent back
  | 'agent'    // AI agent that performs work
  | 'input';   // Data, document, or tool that feeds the process

// ─── Link Types ───────────────────────────────────────────────
// Simplified from 11 to 6 core + 1 presentation link.

export type LinkType =
  | 'flows-to'      // Step A leads to Step B (solid arrow, animated particles)
  | 'reviews'       // Gate checks the output of a step (red dashed arrow)
  | 'escalates-to'  // Gate sends work to a human reviewer (thick red arrow, fast particles)
  | 'uses'          // Step or Agent uses an input (thin dotted line)
  | 'performs'       // Agent performs a step (purple solid arrow)
  | 'returns-to'    // Gate sends work back for revision (orange arrow, reverse)
  | 'linear-flow';  // Presentation-mode linear pipeline connector

// ─── Node Metadata ────────────────────────────────────────────

export interface StepMeta {
  phase: string;                               // Brief | Creation | Review | Publish | Measure
  owner: 'agent' | 'human' | 'shared';        // Who does this work
  agentName?: string;                          // If agent-owned, which agent
  estimatedTime?: string;                      // How long this typically takes
  inputs: string[];                            // What this step needs
  outputs: string[];                           // What this step produces
}

export interface GateMeta {
  gateType: 'approval' | 'quality-check' | 'escalation';
  reviewer: string;                            // Who reviews at this gate
  autoPassCriteria?: string;                   // When the agent can auto-pass
  escalationTrigger: string;                   // When escalation fires
  decisions: string[];                         // Possible outcomes
}

export interface AgentMeta {
  capability: string;
  autonomy: 'full' | 'supervised' | 'assisted';
  tools: string[];
}

export interface InputMeta {
  inputType: 'reference' | 'data' | 'tool';
  source?: string;
  refreshRate?: string;
}

// ─── Graph Node ───────────────────────────────────────────────

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  group?: string;
  val?: number;
  color?: string;
  icon?: string;
  fx?: number | null;
  fy?: number | null;
  fz?: number | null;
  meta?: StepMeta | GateMeta | AgentMeta | InputMeta;
  // Runtime (not serialized)
  x?: number;
  y?: number;
  z?: number;
  _highlighted?: boolean;
  _dimmed?: boolean;
  _visible?: boolean;
}

// ─── Graph Link ───────────────────────────────────────────────

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: LinkType;
  label?: string;
  strength?: number;
  particles?: number;
  particleSpeed?: number;
  color?: string;
  _highlighted?: boolean;
  _dimmed?: boolean;
}

// ─── Composite Types ──────────────────────────────────────────

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// ─── Presentation ─────────────────────────────────────────────

export interface PresentationStep {
  id: string;
  title: string;
  narration: string;
  cameraPosition: { x: number; y: number; z: number };
  cameraLookAt?: { x: number; y: number; z: number };
  cameraTransitionMs: number;
  graphState: 'linear' | 'transitioning' | 'full-graph';
  highlightNodeIds?: string[];
  highlightLinkTypes?: LinkType[];
  filterNodeTypes?: NodeType[];
  action?: string;
  duration?: number;
}

// ─── Style Configs ────────────────────────────────────────────

export interface NodeStyleConfig {
  color: string;
  geometry: 'sphere' | 'octahedron' | 'box' | 'dodecahedron' | 'torus' | 'icosahedron' | 'cone' | 'cylinder';
  baseSize: number;
  emoji: string;
}

export interface LinkStyleConfig {
  color: string;
  particles: number;
  width: number;
  dashed: boolean;
}

export interface CameraConfig {
  pos: { x: number; y: number; z: number };
  lookAt: { x: number; y: number; z: number } | null;
  ms: number;
}

// ─── Contacts (legacy, kept for ContactImporter) ─────────────

export interface ParsedContact {
  name: string;
  email?: string;
  phone?: string;
  title?: string;
  company?: string;
}
