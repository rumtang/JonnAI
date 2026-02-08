/**
 * Export graph data to Excel for offline audit & re-import.
 *
 * Reads seed-graph.json, role-definitions.ts, and presentation-steps.json,
 * then writes a 4-sheet Excel workbook to data/agentic-graph-data.xlsx.
 *
 * Usage: npx tsx scripts/export-to-excel.ts
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const SEED_GRAPH_PATH = path.join(ROOT, 'src/data/seed-graph.json');
const PRESENTATION_PATH = path.join(ROOT, 'src/data/presentation-steps.json');
const ROLE_DEFS_PATH = path.join(ROOT, 'src/lib/roles/role-definitions.ts');
const OUTPUT_PATH = path.join(ROOT, 'data/agentic-graph-data.xlsx');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Join an array into a comma-separated string, or return empty string */
function joinArray(arr: unknown): string {
  if (Array.isArray(arr)) return arr.join(', ');
  return '';
}

// ---------------------------------------------------------------------------
// 1. Read seed-graph.json
// ---------------------------------------------------------------------------

interface NodeMeta {
  phase?: string;
  owner?: string;
  agentName?: string;
  estimatedTime?: string;
  inputs?: string[];
  outputs?: string[];
  gateType?: string;
  reviewer?: string;
  autoPassCriteria?: string;
  escalationTrigger?: string;
  decisions?: string[];
  capability?: string;
  autonomy?: string;
  tools?: string[];
  inputType?: string;
  source?: string;
  refreshRate?: string;
}

interface GraphNode {
  id: string;
  type: string;
  label: string;
  description: string;
  group: string;
  val: number;
  meta: NodeMeta;
}

interface GraphLink {
  source: string;
  target: string;
  type: string;
}

interface SeedGraph {
  nodes: GraphNode[];
  links: GraphLink[];
}

const seedGraph: SeedGraph = JSON.parse(fs.readFileSync(SEED_GRAPH_PATH, 'utf-8'));

// ---------------------------------------------------------------------------
// 2. Build Nodes sheet
// ---------------------------------------------------------------------------

function buildNodesRows(nodes: GraphNode[]) {
  return nodes.map(n => ({
    id: n.id,
    type: n.type,
    label: n.label,
    description: n.description,
    group: n.group,
    phase: n.meta.phase ?? '',
    owner: n.meta.owner ?? '',
    agentName: n.meta.agentName ?? '',
    estimatedTime: n.meta.estimatedTime ?? '',
    inputs: joinArray(n.meta.inputs),
    outputs: joinArray(n.meta.outputs),
    gateType: n.meta.gateType ?? '',
    reviewer: n.meta.reviewer ?? '',
    autoPassCriteria: n.meta.autoPassCriteria ?? '',
    escalationTrigger: n.meta.escalationTrigger ?? '',
    decisions: joinArray(n.meta.decisions),
    capability: n.meta.capability ?? '',
    autonomy: n.meta.autonomy ?? '',
    tools: joinArray(n.meta.tools),
    inputType: n.meta.inputType ?? '',
    source: n.meta.source ?? '',
    refreshRate: n.meta.refreshRate ?? '',
  }));
}

// ---------------------------------------------------------------------------
// 3. Build Links sheet
// ---------------------------------------------------------------------------

function buildLinksRows(links: GraphLink[]) {
  return links.map(l => ({
    source: l.source,
    target: l.target,
    type: l.type,
  }));
}

// ---------------------------------------------------------------------------
// 4. Parse role definitions from TypeScript source
// ---------------------------------------------------------------------------

interface RoleNarrative {
  today: string;
  future: string;
  teamSupport: string;
  keyInsight: string;
}

interface RoleDefinition {
  id: string;
  title: string;
  description: string;
  ownedSteps: string[];
  reviewedGates: string[];
  relatedAgents: string[];
  relatedInputs: string[];
  narrative: RoleNarrative;
}

function parseRoleDefinitions(): RoleDefinition[] {
  const src = fs.readFileSync(ROLE_DEFS_PATH, 'utf-8');

  // Extract the array literal assigned to ROLE_DEFINITIONS
  const startMarker = 'export const ROLE_DEFINITIONS: RoleDefinition[] = ';
  const startIdx = src.indexOf(startMarker);
  if (startIdx === -1) throw new Error('Could not find ROLE_DEFINITIONS in role-definitions.ts');

  // Find the matching closing bracket by counting braces
  const arrayStart = src.indexOf('[', startIdx + startMarker.length);
  let depth = 0;
  let arrayEnd = -1;
  for (let i = arrayStart; i < src.length; i++) {
    if (src[i] === '[') depth++;
    if (src[i] === ']') {
      depth--;
      if (depth === 0) { arrayEnd = i + 1; break; }
    }
  }
  if (arrayEnd === -1) throw new Error('Could not parse ROLE_DEFINITIONS array');

  let arrayStr = src.slice(arrayStart, arrayEnd);

  // Convert TS object literal to valid JSON:
  // - Remove trailing commas before } or ]
  // - Wrap unquoted keys in double quotes
  // - Replace single quotes with double quotes (carefully)

  // Step 1: Replace single-quoted strings with double-quoted.
  // This regex finds single-quoted strings and converts them.
  arrayStr = arrayStr.replace(/'((?:[^'\\]|\\.)*)'/g, (_, content) => {
    // Escape any unescaped double quotes inside
    const escaped = content.replace(/(?<!\\)"/g, '\\"');
    return `"${escaped}"`;
  });

  // Step 2: Quote unquoted object keys
  arrayStr = arrayStr.replace(/(\{|,)\s*(\w+)\s*:/g, '$1 "$2":');

  // Step 3: Remove trailing commas
  arrayStr = arrayStr.replace(/,\s*([\]}])/g, '$1');

  try {
    return JSON.parse(arrayStr);
  } catch (e) {
    throw new Error(`Failed to parse ROLE_DEFINITIONS as JSON: ${(e as Error).message}`);
  }
}

function buildRolesRows(roles: RoleDefinition[]) {
  return roles.map(r => ({
    id: r.id,
    title: r.title,
    description: r.description,
    ownedSteps: r.ownedSteps.join(', '),
    reviewedGates: r.reviewedGates.join(', '),
    relatedAgents: r.relatedAgents.join(', '),
    relatedInputs: r.relatedInputs.join(', '),
    narrative_today: r.narrative.today,
    narrative_future: r.narrative.future,
    narrative_teamSupport: r.narrative.teamSupport,
    narrative_keyInsight: r.narrative.keyInsight,
  }));
}

// ---------------------------------------------------------------------------
// 5. Build Presentation sheet
// ---------------------------------------------------------------------------

interface PresentationStep {
  id: string;
  title: string;
  narration: string;
  cameraPosition: { x: number; y: number; z: number };
  cameraLookAt: { x: number; y: number; z: number };
  cameraTransitionMs: number;
  graphState: string;
  action: string;
  duration: number;
  filterNodeTypes?: string[];
  highlightLinkTypes?: string[];
}

function buildPresentationRows(steps: PresentationStep[]) {
  return steps.map(s => ({
    id: s.id,
    title: s.title,
    narration: s.narration,
    graphState: s.graphState,
    action: s.action,
    filterNodeTypes: joinArray(s.filterNodeTypes),
    highlightLinkTypes: joinArray(s.highlightLinkTypes),
  }));
}

// ---------------------------------------------------------------------------
// 6. Assemble workbook and write
// ---------------------------------------------------------------------------

function main() {
  console.log('Reading data sources...');

  const nodesRows = buildNodesRows(seedGraph.nodes);
  const linksRows = buildLinksRows(seedGraph.links);
  const roles = parseRoleDefinitions();
  const rolesRows = buildRolesRows(roles);
  const presentation: PresentationStep[] = JSON.parse(fs.readFileSync(PRESENTATION_PATH, 'utf-8'));
  const presentationRows = buildPresentationRows(presentation);

  console.log(`  Nodes: ${nodesRows.length} rows`);
  console.log(`  Links: ${linksRows.length} rows`);
  console.log(`  Roles: ${rolesRows.length} rows`);
  console.log(`  Presentation: ${presentationRows.length} rows`);

  const wb = XLSX.utils.book_new();

  const wsNodes = XLSX.utils.json_to_sheet(nodesRows);
  XLSX.utils.book_append_sheet(wb, wsNodes, 'Nodes');

  const wsLinks = XLSX.utils.json_to_sheet(linksRows);
  XLSX.utils.book_append_sheet(wb, wsLinks, 'Links');

  const wsRoles = XLSX.utils.json_to_sheet(rolesRows);
  XLSX.utils.book_append_sheet(wb, wsRoles, 'Roles');

  const wsPresentation = XLSX.utils.json_to_sheet(presentationRows);
  XLSX.utils.book_append_sheet(wb, wsPresentation, 'Presentation');

  // Set reasonable column widths
  const setWidths = (ws: XLSX.WorkSheet, widths: number[]) => {
    ws['!cols'] = widths.map(w => ({ wch: w }));
  };

  setWidths(wsNodes, [22, 8, 24, 60, 12, 12, 10, 18, 14, 40, 30, 14, 24, 40, 40, 30, 60, 14, 40, 12, 35, 12]);
  setWidths(wsLinks, [24, 24, 16]);
  setWidths(wsRoles, [20, 24, 60, 35, 25, 30, 35, 80, 80, 80, 80]);
  setWidths(wsPresentation, [24, 30, 80, 14, 28, 20, 28]);

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });

  XLSX.writeFile(wb, OUTPUT_PATH);
  console.log(`\nExported to: ${OUTPUT_PATH}`);
}

main();
