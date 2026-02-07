// Shared ref so ZoomControls can access the ForceGraph3D instance without prop drilling
let graphRef: any = null;

export function setGraphRef(ref: any) { graphRef = ref; }
export function getGraphRef(): any { return graphRef; }
