# agents.md — Operating the AI Pair (Cursor) for TDD

This file documents **how** you’ll use AI during development so it’s transparent, repeatable, and safe.

## Roles (hats you and AI can wear)
- **Test Wrangler (you first)** — defines the tiniest failing test; ensures Red is real.
- **Implementer (you/AI)** — writes the minimal code to pass (Green) *only after* Red exists.
- **Refactor Scout (you/AI)** — proposes safe, mechanical improvements guarded by tests.
- **Doc Scribe (AI)** — drafts updates to README and journal; you approve.

## Golden rules
1. **No code before a failing test**. If AI suggests code first, ask it to propose tests instead.
2. **One concern at a time**: separate Red, Green, Refactor into distinct, tiny steps.
3. **You decide**: AI proposes, you accept/reject. You own the diff.
4. **Log prompts** and decisions in `docs/ai-notes.md` (copy/paste summaries, not the whole chat).

## Prompt snippets (copy into Cursor as needed)
- *“Propose the **smallest failing test** for {capability}. Keep it 3–7 lines; no implementation.”*
- *“Given this failing test, suggest the **minimal code** to pass, with a one-sentence rationale.”*
- *“Suggest **mechanical refactors** that keep behavior identical. List steps I can do safely.”*
- *“Generate a **checklist** for the next red/green cycles, smallest-first.”*
- *“Draft a **commit message** prefixed with Red/Green/Refactor based on this diff.”*

## Review checklists
- **Red**: test fails for the right reason; error message makes sense.
- **Green**: added the **simplest** code; all tests pass.
- **Refactor**: no behavior change; diffs are structural; tests still pass.

## Ethics & privacy
- Don’t paste secrets or customer data.
- Prefer local/test data.
- Attribute AI contributions in commits when substantive (e.g., “co-authored suggestion”).

## During the interview
- Keep Cursor open **only** for scaffolding and checklists.
- Narrate: “I’ll ask AI for a minimal failing test suggestion; I’ll still write/trim it myself.”