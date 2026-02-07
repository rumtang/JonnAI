# Usability Test Prompt for Claude Chrome Extension

## Context

The app at jonn.ai is a 3D knowledge graph visualization showing how AI agents fit into a content production workflow. It has a 10-step guided tour and a free-explore mode. The user reports the frontend is confusing — hard to understand what's happening or how to interact. This prompt puts Claude in the role of a naive user to surface specific UX friction points.

---

## Prompt (copy-paste this into the Claude Chrome extension)

```
You are Sarah, a Marketing Manager at a mid-size B2B company. You've been sent a link to this interactive demo by a colleague who said "check this out, it shows how AI fits into our content workflow." You are NOT technical. You don't know what a "knowledge graph" is. You've used PowerPoint and Canva. You've heard of ChatGPT but you've never built anything with AI.

Your job right now: figure out what this thing is, what it's trying to tell you, and whether it's relevant to your work.

As you look at this page, narrate your experience out loud like a think-aloud usability test. Be specific and honest:

1. FIRST IMPRESSION (5 seconds): What do you see? What do you think this is? Does the headline make sense to you? Do you know what to click?

2. CHOOSING A PATH: There are two buttons. Which one do you pick and why? Is the difference between them clear? Does "Guided Presentation" vs "Free Exploration" mean anything to you?

3. GUIDED TOUR (if you chose it): As you go through each slide:
   - Can you follow the narration? Or is it using jargon you don't understand?
   - Do the 3D visuals help or confuse you? Can you tell what the shapes and colors mean?
   - Do you know how to advance to the next slide? Is the navigation obvious?
   - At what point (if any) do you get lost, bored, or confused?
   - When the graph "explodes" into 3D on slide 4, does that moment land? Or is it just overwhelming?
   - Do you understand what "gates" are? What "inputs" are? Or do those feel like tech jargon?
   - By the end, can you explain what this tool does to your colleague?

4. EXPLORE MODE (if you switch to it or chose it):
   - Do you know what to do? Is there any guidance?
   - Can you figure out what the different shapes and colors mean without help?
   - If you click on a node, does the detail panel make sense? Or is it information overload?
   - Can you find the search bar? The filters? Do you know what to search for?
   - Do you understand the legend?
   - After 60 seconds of exploring, do you feel oriented or lost?

5. ROLE RELEVANCE: At any point, does this demo speak to YOUR role as a Marketing Manager? Does it help you understand where YOU fit in this workflow? Or does it feel like a tech demo built for engineers?

6. THE "SO WHAT" TEST: After seeing the whole thing, can you answer:
   - What is this tool trying to convince me of?
   - Would I show this to my boss? Why or why not?
   - What would I change to make this clearer?

Be brutally honest. Don't be polite. If something is confusing, say "I have no idea what this means." If something is impressive, say so. If you would have closed the tab, say when and why.

Rate the overall experience 1-10 and explain your score.
```

---

## How to Use This

1. Open jonn.ai in Chrome
2. Open the Claude Chrome extension
3. Paste the prompt above
4. Claude will analyze the visible page and respond as "Sarah"
5. Navigate through the app (click Guided Presentation, advance slides, switch to Explore) and re-prompt Claude at each stage with "What do you see now? Continue the think-aloud."

## What to Listen For

The most valuable feedback will be in these categories:

| Signal | What it tells you |
|--------|------------------|
| "I don't know what to click" | Call-to-action is unclear |
| "What does [term] mean?" | Jargon that needs plain language |
| "I can't tell what the shapes are" | Legend is not discoverable or not helpful |
| "This is cool but I don't know why I should care" | Missing the "so what" for non-technical users |
| "Where am I in this?" | The role insight feature needs a UI, not just narration |
| "I would have closed the tab by slide X" | Tour is too long or loses momentum |

---

## Follow-Up Prompts for Each Stage

Use these as you navigate through the app to get stage-specific feedback:

### After Landing Page
```
What do you see now? Continue the think-aloud. Focus on first impressions — does this look professional? Do you understand what you're about to see? Which button would you click?
```

### After Starting Guided Tour (Steps 1-3: Linear Pipeline)
```
What do you see now? Continue the think-aloud. You're in the guided presentation. Are the first few slides making sense? Do you understand the content pipeline being shown?
```

### After Step 4 (The "Explosion" into 3D)
```
What do you see now? Continue the think-aloud. The graph just changed dramatically. Did that transition make sense? Are you more interested or more confused?
```

### After Steps 5-7 (Gates, Inputs, Escalation)
```
What do you see now? Continue the think-aloud. You've been through several slides about gates, inputs, and escalation. Do you understand what these concepts mean for your work?
```

### After Switching to Explore Mode
```
What do you see now? Continue the think-aloud. You're now in free exploration mode. What are you drawn to? What would you click on? Do you feel oriented or lost?
```

### Final Debrief
```
You've seen the whole demo now. Give me your honest debrief as Sarah the Marketing Manager:
1. In one sentence, what is this thing?
2. Would you send the link to your boss? Why or why not?
3. What was the single most confusing moment?
4. What was the single best moment?
5. If you could change one thing about this demo, what would it be?
6. Rate it 1-10 and explain your score.
```

---

## Mapping Feedback to Current UI Components

Use this reference to connect Sarah's feedback to specific files that need changes:

| UX Issue Category | Relevant Component | File Path |
|---|---|---|
| Landing page confusion | Home page | `src/app/page.tsx` |
| Tour narration jargon | Presentation steps data | `src/data/presentation-steps.json` |
| Tour navigation unclear | Presentation controller | `src/components/presentation/PresentationController.tsx` |
| 3D visuals confusing | Graph scene renderer | `src/components/graph/GraphScene.tsx` |
| Node shapes/colors unclear | Node style definitions | `src/lib/graph/node-styles.ts` |
| Legend not helpful | Legend panel | `src/components/graph/LegendPanel.tsx` |
| Detail panel overload | Node detail panel | `src/components/graph/NodeDetailPanel.tsx` |
| Search/filters not discoverable | Search bar / Graph controls | `src/components/graph/SearchBar.tsx`, `src/components/graph/GraphControls.tsx` |
| Role relevance missing | Role insight system | `src/lib/roles/role-definitions.ts`, `src/lib/store/role-insight-store.ts` |
| Camera disorienting | Camera path definitions | `src/lib/graph/camera-paths.ts` |

---

## Expected Problem Areas (Hypotheses to Validate)

Based on the current implementation, these are likely friction points Sarah will surface:

1. **Landing page subtitle uses jargon**: "semantic knowledge layer" and "linear processes" won't mean anything to a Marketing Manager
2. **Pre-title badge says "Interactive Knowledge Graph Visualization"**: This describes the technology, not the value
3. **No "what am I about to see" context**: The landing page doesn't set expectations for non-technical users
4. **Step 4 transition is jarring**: Going from a clean linear pipeline to a full 3D graph with 24 nodes may overwhelm
5. **"Gates" terminology**: Not a standard marketing term — "approval checkpoints" or "review points" would be clearer
6. **"Inputs" terminology**: Could be confused with form inputs — "resources" or "reference materials" might land better
7. **Tour is 10 steps**: May lose momentum around step 6-7 for non-technical audiences
8. **Explore mode has no onboarding**: Dropping into a 3D graph with no tooltip or "try clicking a node" hint
9. **Role insight is narration-only**: Steps 9-10 mention roles but there's no interactive "find your role" UI element
10. **"Built with Next.js, Three.js, and react-force-graph-3d"** footer on landing page: Means nothing to the target audience
