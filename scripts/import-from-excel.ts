/**
 * Import graph data from Excel back into the app's JSON and TypeScript files.
 *
 * Reads data/agentic-graph-data.xlsx (edited by a human) and regenerates:
 *   - src/data/seed-graph.json  (nodes + links)
 *   - src/lib/roles/role-definitions.ts  (preserving TS interfaces and helpers)
 *   - src/data/presentation-steps.json  (preserving camera positions from original)
 *
 * Usage: npx tsx scripts/import-from-excel.ts
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const EXCEL_PATH = path.join(ROOT, 'data/agentic-graph-data.xlsx');
const SEED_GRAPH_PATH = path.join(ROOT, 'src/data/seed-graph.json');
const PRESENTATION_PATH = path.join(ROOT, 'src/data/presentation-steps.json');
const ROLE_DEFS_PATH = path.join(ROOT, 'src/lib/roles/role-definitions.ts');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Split a comma-separated string into a trimmed array, or return empty array */
function splitField(val: unknown): string[] {
  if (typeof val !== 'string' || val.trim() === '') return [];
  return val.split(',').map(s => s.trim()).filter(Boolean);
}

/** Safely read a string field, defaulting to empty string */
function str(val: unknown): string {
  if (val === null || val === undefined) return '';
  return String(val);
}

// ---------------------------------------------------------------------------
// Read Excel
// ---------------------------------------------------------------------------

if (!fs.existsSync(EXCEL_PATH)) {
  console.error(`Error: Excel file not found at ${EXCEL_PATH}`);
  console.error('Run "npm run export-data" first to generate the Excel file.');
  process.exit(1);
}

const wb = XLSX.readFile(EXCEL_PATH);

function readSheet<T>(name: string): T[] {
  const ws = wb.Sheets[name];
  if (!ws) {
    console.error(`Error: Sheet "${name}" not found in Excel file.`);
    console.error(`Available sheets: ${wb.SheetNames.join(', ')}`);
    process.exit(1);
  }
  return XLSX.utils.sheet_to_json<T>(ws);
}

const nodesSheet = readSheet<Record<string, unknown>>('Nodes');
const linksSheet = readSheet<Record<string, unknown>>('Links');
const rolesSheet = readSheet<Record<string, unknown>>('Roles');
const presentationSheet = readSheet<Record<string, unknown>>('Presentation');

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const errors: string[] = [];

// Validate nodes have required fields
const validNodeTypes = new Set(['step', 'gate', 'agent', 'input']);
const nodeIds = new Set<string>();

for (const row of nodesSheet) {
  const id = str(row.id);
  const type = str(row.type);

  if (!id) { errors.push('Nodes: found row with empty id'); continue; }
  if (nodeIds.has(id)) errors.push(`Nodes: duplicate id "${id}"`);
  nodeIds.add(id);

  if (!validNodeTypes.has(type)) {
    errors.push(`Nodes: "${id}" has invalid type "${type}" (expected: ${[...validNodeTypes].join(', ')})`);
  }
  if (!str(row.label)) errors.push(`Nodes: "${id}" is missing a label`);
  if (!str(row.group)) errors.push(`Nodes: "${id}" is missing a group`);
}

// Validate links reference existing node IDs
for (const row of linksSheet) {
  const source = str(row.source);
  const target = str(row.target);
  if (!source) { errors.push('Links: found row with empty source'); continue; }
  if (!target) { errors.push('Links: found row with empty target'); continue; }
  if (!nodeIds.has(source)) errors.push(`Links: source "${source}" does not match any node id`);
  if (!nodeIds.has(target)) errors.push(`Links: target "${target}" does not match any node id`);
}

// Validate roles have required fields
for (const row of rolesSheet) {
  const id = str(row.id);
  if (!id) { errors.push('Roles: found row with empty id'); continue; }
  if (!str(row.title)) errors.push(`Roles: "${id}" is missing a title`);
}

// Validate presentation has required fields
for (const row of presentationSheet) {
  const id = str(row.id);
  if (!id) { errors.push('Presentation: found row with empty id'); continue; }
  if (!str(row.action)) errors.push(`Presentation: "${id}" is missing an action`);
}

if (errors.length > 0) {
  console.error('Validation errors found:\n');
  for (const err of errors) console.error(`  - ${err}`);
  console.error(`\n${errors.length} error(s). Fix the Excel file and try again.`);
  process.exit(1);
}

console.log('Validation passed.');

// ---------------------------------------------------------------------------
// Build seed-graph.json
// ---------------------------------------------------------------------------

// Read existing graph to preserve `val` field (not in Excel)
interface ExistingNode { id: string; val: number; [key: string]: unknown }
const existingGraph = JSON.parse(fs.readFileSync(SEED_GRAPH_PATH, 'utf-8'));
const existingValMap = new Map<string, number>();
for (const n of existingGraph.nodes as ExistingNode[]) {
  existingValMap.set(n.id, n.val);
}

function buildNodeMeta(row: Record<string, unknown>, type: string): Record<string, unknown> {
  const meta: Record<string, unknown> = {};

  if (type === 'step') {
    if (str(row.phase)) meta.phase = str(row.phase);
    if (str(row.owner)) meta.owner = str(row.owner);
    if (str(row.agentName)) meta.agentName = str(row.agentName);
    if (str(row.estimatedTime)) meta.estimatedTime = str(row.estimatedTime);
    const inputs = splitField(row.inputs);
    if (inputs.length > 0) meta.inputs = inputs;
    const outputs = splitField(row.outputs);
    if (outputs.length > 0) meta.outputs = outputs;
  }

  if (type === 'gate') {
    if (str(row.gateType)) meta.gateType = str(row.gateType);
    if (str(row.reviewer)) meta.reviewer = str(row.reviewer);
    if (str(row.autoPassCriteria)) meta.autoPassCriteria = str(row.autoPassCriteria);
    if (str(row.escalationTrigger)) meta.escalationTrigger = str(row.escalationTrigger);
    const decisions = splitField(row.decisions);
    if (decisions.length > 0) meta.decisions = decisions;
  }

  if (type === 'agent') {
    if (str(row.capability)) meta.capability = str(row.capability);
    if (str(row.autonomy)) meta.autonomy = str(row.autonomy);
    const tools = splitField(row.tools);
    if (tools.length > 0) meta.tools = tools;
  }

  if (type === 'input') {
    if (str(row.inputType)) meta.inputType = str(row.inputType);
    if (str(row.source)) meta.source = str(row.source);
    if (str(row.refreshRate)) meta.refreshRate = str(row.refreshRate);
  }

  return meta;
}

const newNodes = nodesSheet.map(row => {
  const id = str(row.id);
  const type = str(row.type);
  // Default val based on type, or preserve original
  const defaultVal = type === 'gate' ? 6 : type === 'agent' ? 5 : type === 'input' ? 4 : 5;
  return {
    id,
    type,
    label: str(row.label),
    description: str(row.description),
    group: str(row.group),
    val: existingValMap.get(id) ?? defaultVal,
    meta: buildNodeMeta(row, type),
  };
});

const newLinks = linksSheet.map(row => ({
  source: str(row.source),
  target: str(row.target),
  type: str(row.type),
}));

const newSeedGraph = { nodes: newNodes, links: newLinks };

// ---------------------------------------------------------------------------
// Build role-definitions.ts
// ---------------------------------------------------------------------------

function escapeTs(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatStringArray(items: string[]): string {
  if (items.length === 0) return '[]';
  return `[${items.map(i => `'${escapeTs(i)}'`).join(', ')}]`;
}

function buildRoleDefinitionsTs(roles: Record<string, unknown>[]): string {
  const defs = roles.map(r => {
    const id = str(r.id);
    const title = str(r.title);
    const description = str(r.description);
    const ownedSteps = splitField(r.ownedSteps);
    const reviewedGates = splitField(r.reviewedGates);
    const relatedAgents = splitField(r.relatedAgents);
    const relatedInputs = splitField(r.relatedInputs);

    return `  {
    id: '${escapeTs(id)}',
    title: '${escapeTs(title)}',
    description: '${escapeTs(description)}',
    ownedSteps: ${formatStringArray(ownedSteps)},
    reviewedGates: ${formatStringArray(reviewedGates)},
    relatedAgents: ${formatStringArray(relatedAgents)},
    relatedInputs: ${formatStringArray(relatedInputs)},
    narrative: {
      today: '${escapeTs(str(r.narrative_today))}',
      future: '${escapeTs(str(r.narrative_future))}',
      teamSupport: '${escapeTs(str(r.narrative_teamSupport))}',
      keyInsight: '${escapeTs(str(r.narrative_keyInsight))}',
    },
  }`;
  });

  return `// Role definitions derived from the content production graph's gate reviewers
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
${defs.join(',\n')},
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
`;
}

// ---------------------------------------------------------------------------
// Build presentation-steps.json (preserve camera data from original)
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

// Camera data is preserved from the existing file — not included in Excel
const existingPresentation: PresentationStep[] = JSON.parse(
  fs.readFileSync(PRESENTATION_PATH, 'utf-8')
);
const existingPresentationMap = new Map<string, PresentationStep>();
for (const step of existingPresentation) {
  existingPresentationMap.set(step.id, step);
}

const newPresentation: PresentationStep[] = presentationSheet.map(row => {
  const id = str(row.id);
  const existing = existingPresentationMap.get(id);

  // Camera defaults for new slides
  const defaultCamera = { x: 0, y: 0, z: 800 };

  // Build object preserving original key order: camera fields, then graphState,
  // action, then optional filterNodeTypes/highlightLinkTypes, then duration last
  const step: Record<string, unknown> = {
    id,
    title: str(row.title),
    narration: str(row.narration),
    cameraPosition: existing?.cameraPosition ?? defaultCamera,
    cameraLookAt: existing?.cameraLookAt ?? { x: 0, y: 0, z: 0 },
    cameraTransitionMs: existing?.cameraTransitionMs ?? 2000,
    graphState: str(row.graphState),
    action: str(row.action),
  };

  const filterNodeTypes = splitField(row.filterNodeTypes);
  if (filterNodeTypes.length > 0) step.filterNodeTypes = filterNodeTypes;

  const highlightLinkTypes = splitField(row.highlightLinkTypes);
  if (highlightLinkTypes.length > 0) step.highlightLinkTypes = highlightLinkTypes;

  step.duration = existing?.duration ?? 0;

  return step as unknown as PresentationStep;
});

// ---------------------------------------------------------------------------
// Diff reporting
// ---------------------------------------------------------------------------

function diffReport() {
  const oldGraph = existingGraph;
  const oldNodeIds = new Set((oldGraph.nodes as ExistingNode[]).map(n => n.id));
  const newNodeIds = new Set(newNodes.map(n => n.id));

  const addedNodes = [...newNodeIds].filter(id => !oldNodeIds.has(id));
  const removedNodes = [...oldNodeIds].filter(id => !newNodeIds.has(id));
  const keptNodes = [...newNodeIds].filter(id => oldNodeIds.has(id));

  // Count modified nodes (compare JSON of flattened fields)
  const oldNodeMap = new Map((oldGraph.nodes as ExistingNode[]).map(n => [n.id, n]));
  let modifiedNodeCount = 0;
  for (const id of keptNodes) {
    const oldN = oldNodeMap.get(id)!;
    const newN = newNodes.find(n => n.id === id)!;
    // Compare label, description, group, and meta
    if (
      oldN.label !== newN.label ||
      oldN.description !== newN.description ||
      oldN.group !== newN.group ||
      JSON.stringify(oldN.meta) !== JSON.stringify(newN.meta)
    ) {
      modifiedNodeCount++;
    }
  }

  const oldLinkCount = (oldGraph.links as unknown[]).length;
  const newLinkCount = newLinks.length;

  const oldPresentationIds = new Set(existingPresentation.map(s => s.id));
  const newPresentationIds = new Set(newPresentation.map(s => s.id));
  const addedSlides = [...newPresentationIds].filter(id => !oldPresentationIds.has(id));
  const removedSlides = [...oldPresentationIds].filter(id => !newPresentationIds.has(id));

  console.log('\n--- Change Report ---');
  console.log(`Nodes: ${newNodes.length} total (${addedNodes.length} added, ${removedNodes.length} removed, ${modifiedNodeCount} modified)`);
  if (addedNodes.length > 0) console.log(`  Added: ${addedNodes.join(', ')}`);
  if (removedNodes.length > 0) console.log(`  Removed: ${removedNodes.join(', ')}`);

  console.log(`Links: ${newLinks.length} total (was ${oldLinkCount})`);
  console.log(`Roles: ${rolesSheet.length} total`);
  console.log(`Presentation: ${newPresentation.length} total (${addedSlides.length} added, ${removedSlides.length} removed)`);
  if (addedSlides.length > 0) console.log(`  Added slides: ${addedSlides.join(', ')}`);
  if (removedSlides.length > 0) console.log(`  Removed slides: ${removedSlides.join(', ')}`);
}

// ---------------------------------------------------------------------------
// Write files
// ---------------------------------------------------------------------------

function main() {
  console.log('Importing from Excel...');
  console.log(`  Nodes: ${nodesSheet.length} rows`);
  console.log(`  Links: ${linksSheet.length} rows`);
  console.log(`  Roles: ${rolesSheet.length} rows`);
  console.log(`  Presentation: ${presentationSheet.length} rows`);

  // Write seed-graph.json
  fs.writeFileSync(SEED_GRAPH_PATH, JSON.stringify(newSeedGraph, null, 2) + '\n');
  console.log(`\nWrote: ${SEED_GRAPH_PATH}`);

  // Write role-definitions.ts
  const roleTsContent = buildRoleDefinitionsTs(rolesSheet);
  fs.writeFileSync(ROLE_DEFS_PATH, roleTsContent);
  console.log(`Wrote: ${ROLE_DEFS_PATH}`);

  // Write presentation-steps.json
  fs.writeFileSync(PRESENTATION_PATH, JSON.stringify(newPresentation, null, 2) + '\n');
  console.log(`Wrote: ${PRESENTATION_PATH}`);

  diffReport();

  console.log('\nImport complete.');
}

main();
