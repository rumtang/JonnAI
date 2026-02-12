const fs = require('fs');
const content = fs.readFileSync('src/lib/roles/role-definitions.ts', 'utf-8');
const graph = JSON.parse(fs.readFileSync('src/data/seed-graph.json', 'utf-8'));

// All 45 workflow nodes
const workflowNodes = graph.nodes
  .filter(n => n.type === 'step' || n.type === 'gate')
  .map(n => ({ id: n.id, label: n.label, type: n.type, group: n.group, desc: n.description }));

console.log('WORKFLOW NODES (' + workflowNodes.length + '):');
for (const n of workflowNodes) {
  console.log(JSON.stringify(n));
}

// Extract roles
const roleBlocks = content.split(/\{\s*\n\s*id:\s*'/);
roleBlocks.shift();

console.log('\nROLES:');
for (const block of roleBlocks) {
  const idMatch = block.match(/^([^']+)/);
  if (!idMatch) continue;
  const roleId = idMatch[1];

  const titleMatch = block.match(/title:\s*'([^']+)'/);
  const deptMatch = block.match(/department:\s*'([^']+)'/);

  const journeyKeys = [];
  const journeyRegex = /'([^']+)':\s*\{\s*\n\s*preAI:/g;
  let m;
  while ((m = journeyRegex.exec(block)) !== null) {
    journeyKeys.push(m[1]);
  }

  const missing = workflowNodes.filter(n => !journeyKeys.includes(n.id)).map(n => n.id);

  console.log(JSON.stringify({
    id: roleId,
    title: titleMatch ? titleMatch[1] : '?',
    department: deptMatch ? deptMatch[1] : '?',
    existing: journeyKeys,
    missing: missing
  }));
}
