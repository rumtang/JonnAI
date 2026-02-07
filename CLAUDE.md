# Project Configuration

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
