const fs = require('fs');
const graph = JSON.parse(fs.readFileSync('src/data/seed-graph.json', 'utf-8'));
const workflowNodes = graph.nodes.filter(n => n.type === 'step' || n.type === 'gate').map(n => n.id);

const MAIN_WORKFLOW_ORDER = [
  'campaign-planning','journey-mapping','receive-request','content-scoring','research-insights',
  'write-brief','brief-approval','draft-content','visual-asset-creation','seo-optimization',
  'quality-check','brand-compliance','brand-review','legal-review','legal-compliance-gate',
  'final-edit','accessibility-check','stakeholder-signoff','localize-content','localization-quality-gate',
  'schedule-publish','distribute','track-performance','generate-report','attribution-modeling',
  'executive-reporting','performance-review','optimize','archive-tag','content-governance','governance-gate'
];

const missing = workflowNodes.filter(n => MAIN_WORKFLOW_ORDER.indexOf(n) === -1);
console.log('Nodes NOT in MAIN_WORKFLOW_ORDER (' + missing.length + '):');
missing.forEach(n => {
  const node = graph.nodes.find(x => x.id === n);
  console.log('  ' + n + ' (' + node.group + ', ' + node.type + ')');
});

console.log('\nMAIN_WORKFLOW_ORDER has', MAIN_WORKFLOW_ORDER.length, 'nodes');
console.log('Total workflow nodes:', workflowNodes.length);

// For partnerships-lead, show what the walkthrough would look like
const partnershipsOwned = ['influencer-brief', 'ugc-moderation'];
const partnershipsGates = ['brand-review'];
const partnershipsAgents = ['ugc-moderation-agent']; // example
const partnershipsInputs = [];

const primaryIds = new Set([...partnershipsOwned, ...partnershipsGates]);
const orderedPrimary = MAIN_WORKFLOW_ORDER.filter(id => primaryIds.has(id));
for (const id of primaryIds) {
  if (orderedPrimary.indexOf(id) === -1) orderedPrimary.push(id);
}
console.log('\nPartnerships-lead walkthrough path (current):', orderedPrimary.length, 'nodes');
orderedPrimary.forEach(n => console.log('  ' + n));
