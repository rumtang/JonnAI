const fs = require('fs');
const graph = JSON.parse(fs.readFileSync('src/data/seed-graph.json', 'utf-8'));
const roleDefs = fs.readFileSync('src/lib/roles/role-definitions.ts', 'utf-8');

// All step + gate nodes
const workflowNodes = graph.nodes
  .filter(n => n.type === 'step' || n.type === 'gate')
  .map(n => ({ id: n.id, label: n.label, type: n.type, group: n.group, desc: n.description }));

console.log('=== ALL WORKFLOW NODES (' + workflowNodes.length + ') ===');
for (const n of workflowNodes) {
  console.log(`  ${n.id} | ${n.label} | ${n.type} | ${n.group}`);
}

// Extract role IDs and their existing journey keys
const roleBlocks = roleDefs.split(/\{\s*\n\s*id:\s*'/);
roleBlocks.shift();

console.log('\n=== ROLES AND EXISTING JOURNEYS ===');
for (const block of roleBlocks) {
  const idMatch = block.match(/^([^']+)/);
  if (!idMatch) continue;
  const roleId = idMatch[1];

  const journeyKeys = [];
  const journeyRegex = /'([^']+)':\s*\{\s*\n\s*preAI:/g;
  let m;
  while ((m = journeyRegex.exec(block)) !== null) {
    journeyKeys.push(m[1]);
  }

  const missing = workflowNodes.filter(n => !journeyKeys.includes(n.id)).map(n => n.id);
  console.log(`\n${roleId}: ${journeyKeys.length}/${workflowNodes.length} covered`);
  if (missing.length > 0) {
    console.log(`  Missing (${missing.length}): ${missing.join(', ')}`);
  }
}
