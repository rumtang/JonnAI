const fs = require('fs');
const content = fs.readFileSync('src/lib/store/role-insight-store.ts', 'utf-8');
const match = content.match(/FULL_WORKFLOW_ORDER\s*=\s*\[([\s\S]*?)\];/);
if (match === null) { console.log('ERROR: not found'); process.exit(1); }
const entries = match[1].match(/'([^']+)'/g).map(s => s.replace(/'/g, ''));
console.log('FULL_WORKFLOW_ORDER entries:', entries.length);
const dupes = entries.filter((e, i) => entries.indexOf(e) !== i);
if (dupes.length) console.log('DUPLICATES:', dupes);
else console.log('No duplicates');

// Cross-check against graph
const graph = JSON.parse(fs.readFileSync('src/data/seed-graph.json', 'utf-8'));
const workflowIds = new Set(graph.nodes.filter(n => n.type === 'step' || n.type === 'gate').map(n => n.id));
const missing = [...workflowIds].filter(id => entries.indexOf(id) === -1);
const extra = entries.filter(id => !workflowIds.has(id));
console.log('Missing from order:', missing.length, missing);
console.log('Extra (not in graph):', extra.length, extra);
