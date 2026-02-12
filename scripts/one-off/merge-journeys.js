/**
 * Merge journey JSON batch files into role-definitions.ts
 *
 * Strategy: Parse the TS file, find each role's nodeJourneys block,
 * and insert the new entries before the closing brace.
 */
const fs = require('fs');

// Load all batch files
const batchFiles = ['journey-batch-1.json', 'journey-batch-2.json', 'journey-batch-3.json'];
const allNewJourneys = {};

for (const file of batchFiles) {
  if (!fs.existsSync(file)) {
    console.log(`WARNING: ${file} not found, skipping`);
    continue;
  }
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  for (const [roleId, nodes] of Object.entries(data)) {
    if (!allNewJourneys[roleId]) allNewJourneys[roleId] = {};
    Object.assign(allNewJourneys[roleId], nodes);
  }
}

console.log('Loaded new journeys for roles:', Object.keys(allNewJourneys).join(', '));
for (const [roleId, nodes] of Object.entries(allNewJourneys)) {
  console.log(`  ${roleId}: ${Object.keys(nodes).length} new entries`);
}

// Helper: convert a NodeJourney object to TypeScript string
function journeyToTS(nodeId, journey, indent = '        ') {
  const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `${indent}'${nodeId}': {
${indent}  preAI: {
${indent}    summary: '${esc(journey.preAI.summary)}',
${indent}    detail: '${esc(journey.preAI.detail)}',
${indent}  },
${indent}  aiAgents: {
${indent}    summary: '${esc(journey.aiAgents.summary)}',
${indent}    detail: '${esc(journey.aiAgents.detail)}',
${indent}  },
${indent}  aiAgentic: {
${indent}    summary: '${esc(journey.aiAgentic.summary)}',
${indent}    detail: '${esc(journey.aiAgentic.detail)}',
${indent}  },
${indent}},`;
}

// Read the TS file
let tsContent = fs.readFileSync('src/lib/roles/role-definitions.ts', 'utf-8');

// For each role with new journeys, find the nodeJourneys block and insert
for (const [roleId, nodes] of Object.entries(allNewJourneys)) {
  const nodeEntries = Object.entries(nodes);
  if (nodeEntries.length === 0) continue;

  // Find the role block - look for the keyInsight line as anchor
  // We'll insert new journey entries just before the closing `},` of nodeJourneys
  // Strategy: find `id: '${roleId}'` then find the `keyInsight:` line within that block
  // and insert before the `},` that precedes keyInsight

  // More robust: find the pattern `      },\n      keyInsight:` within the role block
  // and insert entries before it

  const roleIdPattern = `id: '${roleId}'`;
  const roleStart = tsContent.indexOf(roleIdPattern);
  if (roleStart === -1) {
    console.log(`ERROR: Could not find role ${roleId} in TS file`);
    continue;
  }

  // Find the keyInsight line after this role start
  const keyInsightPattern = '      keyInsight:';
  const keyInsightPos = tsContent.indexOf(keyInsightPattern, roleStart);
  if (keyInsightPos === -1) {
    console.log(`ERROR: Could not find keyInsight for role ${roleId}`);
    continue;
  }

  // The nodeJourneys closing `},` is right before keyInsight
  // Look backwards from keyInsightPos for the `},` + newline pattern
  const beforeKeyInsight = tsContent.substring(roleStart, keyInsightPos);
  // Find the last closing of a journey entry before keyInsight
  // We want to insert after the last `},` in nodeJourneys but before `},\n      keyInsight`

  // Actually, let's find the `      },\n      keyInsight` pattern and insert before the `},`
  // The `},` here closes the nodeJourneys object
  const closingPattern = '      },\n      keyInsight:';
  const closingPos = tsContent.indexOf(closingPattern, roleStart);
  if (closingPos === -1) {
    console.log(`ERROR: Could not find nodeJourneys closing for role ${roleId}`);
    continue;
  }

  // Generate the new entries string
  const newEntriesStr = nodeEntries.map(([nodeId, journey]) => {
    return journeyToTS(nodeId, journey);
  }).join('\n');

  // Insert before the closing `},` of nodeJourneys
  tsContent = tsContent.substring(0, closingPos) + newEntriesStr + '\n' + tsContent.substring(closingPos);

  console.log(`Inserted ${nodeEntries.length} entries for ${roleId}`);
}

// Write the updated TS file
fs.writeFileSync('src/lib/roles/role-definitions.ts', tsContent);
console.log('\nDone! Updated role-definitions.ts');

// Verify: re-count journeys
const journeyRegex = /'([^']+)':\s*\{\s*\n\s*preAI:/g;
let m;
let count = 0;
while ((m = journeyRegex.exec(tsContent)) !== null) {
  count++;
}
console.log(`Total journey entries in file: ${count}`);
console.log(`Expected: 765 (17 roles × 45 nodes)`);
