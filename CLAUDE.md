# Project Configuration

Always consider using agents, sub agents and skills. 

## Who I Am
I'm a strategist and architect, not a daily coder. I understand APIs, Python, JS, and system
design at a conceptual level. I need working code, not lessons. Make architecture decisions for
me and explain them briefly. If something will break or be hard to maintain, tell me before
building it.

## How to Work With Me
- **Interview me before coding.** My first description is always incomplete. Ask the hard
  questions I haven't thought about — edge cases, data flow, what "done" looks like.
- **Write a SPEC.md before building.** I want to approve the plan before you execute it.
- **Build incrementally.** Show me something working at each step, not a big reveal at the end.
- **Explain what you built.** After each phase, tell me: what it does, how to run it, what's next.
  Use plain language. I'll ask if I want the technical details.
- **Make good defaults.** Pick the right tool for the job. Don't ask me to choose between
  libraries unless the choice genuinely depends on my preference.
- **Handle errors for humans.** Every error message should tell me what went wrong and what to do.
  Never let me see a raw stack trace as the only output.

## Code Quality Rules
- Comment the WHY, not the WHAT
- Every external API call gets error handling with human-readable messages
- No hardcoded secrets — use .env files
- Write tests for anything with logic
- Lock dependencies (requirements.txt or package-lock.json)
- Git commit after every meaningful change with clear messages

## When I Say "Build This"
Follow the idea-to-code skill workflow:
1. Interview → 2. Spec (SPEC.md) → 3. Build incrementally → 4. Polish and ship

## When I Say "Fix This" or "It's Not Working"
1. Ask me what I expected vs what happened
2. Check logs and error output
3. Explain what went wrong in plain language
4. Fix it and verify the fix works before telling me it's done

## Preferences
- Python over Node unless the project specifically needs JS
- FastAPI for web APIs
- SQLite for simple storage, Supabase for anything multi-user
- Minimal dependencies — standard library when it's 80% as good
- No over-engineering. I want tools that work, not production SaaS architecture

---

## 3D Graph Guardrails (Hard-Won Rules)

These rules exist because each one was violated, broke something, and had to be fixed —
some of them multiple times. **Read these before touching GraphScene.tsx, link-styles.ts,
globals.css, or any Zustand store that feeds the graph.**

### Graph Visibility — DO NOT break these invariants
1. **Dimmed node opacity must be >= 0.35.** Lower values make nodes invisible against the
   dark background. (Fixed in 59a41f6, broke again, fixed again.)
2. **Never restart the force simulation on navigation or mode switch.** Use a ref to track
   whether the graph has already settled. Re-running the sim scatters all nodes. (Fixed in fb069c6.)
3. **Zustand selectors for graph state must be granular.** Selecting entire store objects
   causes re-render cascades that destroy the ForceGraph3D canvas. Always use `useShallow`
   or individual selectors. (Fixed in 8530558.)
4. **The graph container must be `absolute inset-0 z-10`.** ForceGraph3D auto-sizes to its
   parent — if the parent has wrong sizing or stacking, the canvas collapses. (Fixed in bae2d83.)

### Camera Navigation — ONE pattern, not three
- **Always use `navigateToNode()` from `src/lib/utils/camera-navigation.ts`** for flying
  the camera to a node. It uses a fixed distance offset (120 units) from the target.
- **Do NOT compute camera positions inline** with ratio-based calculations. Nodes near the
  origin cause division-by-near-zero, sending the camera to infinity. (Fixed in 90d4218.)
- `handleNodeClick` in GraphScene.tsx currently has an inline camera calc that duplicates
  `navigateToNode()` — this is legacy but works; do not change it to a ratio-based approach.

### Performance Budget
The target device is a MacBook running a live presentation (possibly on battery,
possibly screen-sharing). Frame drops during a demo are worse than missing a visual effect.

- **Link particles: keep total under ~200.** The `uses` link type has 0 particles (it has
  ~150 links — even 1 particle each = 150 GPU sprites per frame). Don't increase it.
- **`backdrop-filter: blur()` is banned on the graph page.** The `.graph-page .glass-panel`
  override in globals.css uses a solid 92% opacity background instead. Do NOT add blur()
  to any element that sits over the WebGL canvas.
- **nodeThreeObject must use the cache.** The `nodeGroupCache` in GraphScene.tsx avoids
  recreating THREE.Group objects on every render. New visual properties must be added to the
  update path (mutate cached objects), not the create path.
- **No new `requestAnimationFrame` loops.** The rotation loop auto-stops after 30s idle.
  Adding another RAF loop re-introduces the continuous GPU wake problem.
- **Dispose Three.js resources.** Any new geometry, material, or texture must either be
  cached (shared across nodes) or disposed in a cleanup function. Check the unmount useEffect.

### Narration Tone
The guided tour narration has been rewritten 7+ times. The settled tone is:
- **Pragmatic and understated.** No hype, no rhetorical questions, no exclamation marks.
- **Practitioner-grade.** Write for a senior marketing ops leader, not a sales prospect.
- **Factual observations over claims.** "This reflects how enterprise content production
  actually works" — not "This will transform your organization."
- **Short.** If a narration paragraph is over 3 sentences, it's too long.
- Do NOT rewrite narrations unless the user specifically asks. Tone drift is cumulative.

### Explore Mode — Settled Decisions
These were toggled back and forth multiple times. The current state is final:
- **All nodes visible by default.** No progressive reveal, no welcome overlay.
- **Filter panel shown by default on desktop.** Users can toggle it closed.
- **No discovery prompts for first-time users.** The graph speaks for itself.
- Do NOT re-introduce progressive reveal, welcome overlays, or onboarding flows
  without explicit user request.

### Mode System
7 modes: `guided` | `explore` | `campaign` | `build` | `roi` | `role` | (landing page)
- The mode lives in `presentation-store.ts` as `mode`
- When switching modes: reset presentation step index, campaign state, and graph selection
- Physics (`d3AlphaDecay`) is 0.08 in explore/guided, 0.5 in other modes (freezes layout fast)
  - Guided mode needs 0.08 because the full graph (83 nodes) loads fresh at step 6 and needs ~100 ticks to spread
- Node drag is only enabled in explore mode when campaign is not active

### Role Definitions — Keep Verbose
The `src/lib/roles/role-definitions.ts` file (11,900+ lines) is intentionally detailed.
Each role has rich content: painPoints, benchmarks, outcomes, roleEvolution, antiPatterns,
stageOverviews with timeAllocation and criticalMetrics. **Do NOT abbreviate, summarize,
or strip this content.** This is where detail matters — every field is rendered in the
RoleSlide UI. The `role-definitions.original.ts` is the pre-expansion backup for reference.
