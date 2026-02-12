# Agentic -- Knowledge Graph Visualization

Interactive 3D visualization of AI-powered content production workflows. Built to demonstrate
how AI agents, human-in-the-loop gates, and knowledge inputs work together in a marketing
content lifecycle.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Modes

- **Guided Presentation** -- Narrated walkthrough of the content production lifecycle, from linear pipeline to full knowledge graph
- **Free Exploration** -- Interactive 3D graph with search, filtering, and node inspection
- **Campaign Walkthrough** -- Step through the workflow node-by-node, making gate decisions at each checkpoint
- **Build Mode** -- Watch the graph construct itself node by node
- **ROI Calculator** -- Model the business impact of agentic operations
- **Role Impact** -- See the graph from a specific team role's perspective

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5
- **3D Visualization:** react-force-graph-3d + Three.js + three-spritetext
- **State Management:** Zustand 5
- **UI:** shadcn/ui + Tailwind CSS 4 + Framer Motion
- **Icons:** Lucide React

## Project Structure

```
src/
├── app/            # Next.js pages and API routes
├── components/     # React components (graph, presentation, campaign, build, roi, role, UI)
├── lib/            # Stores, graph utilities, types, styling configs
└── data/           # Graph data (seed-graph.json), presentation steps
```

## Data Model

- **4 Node Types:** step (actions), gate (checkpoints), agent (AI), input (data/references)
- **7 Link Types:** flows-to, reviews, escalates-to, uses, performs, returns-to, linear-flow
- **5 Lifecycle Phases:** Brief, Creation, Review, Publish, Measure

## Development

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
```
