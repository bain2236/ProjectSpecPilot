# SpecPilot — TDD + AI Kata Lab (Python, docs-only)

Demonstrate **Test-Driven Development (TDD)** and **AI‑assisted development** (with Cursor)

## Why this exists
- Show you can run a disciplined **red → green → refactor** workflow.
- Make your use of **AI tools explicit, ethical, and auditable** (via `agents.md` and logs).

## Project name
**SpecPilot** — because you “pilot” the work through tests/specs, and you pilot your AI assistant rather than the other way around.

## What you'll demo (at a glance)
- A small kata from Made Tech’s collection (we suggest **Mars Rover**) tackled with TDD.
- Tiny, high-signal commits labeled **Red / Green / Refactor**.
- Intentional AI use: prompts captured; your judgement is the gatekeeper.

> Katas: https://learn.madetech.com/technology/katas/ (pick one; Mars Rover is perfect for grid movement, wrapping, and obstacle rules).

## Suggested flow for the interview (no code yet)
1. **State the rules**: “I’ll write a failing test first, make it pass with the simplest code, then refactor. AI can scaffold, but tests lead.”
2. **Pick the smallest slice** of the kata (e.g., “turn left/right cycles through N/E/S/W”). Write a minimal failing test.
3. **Green it** with the simplest implementation (or a fake-it approach). Keep it tiny.
4. **Refactor safely**, leaning on tests for confidence.
5. **Repeat** for movement and wrapping; **defer obstacles** until the core loop is clear.
6. **Narrate your AI usage**: why you asked, what you accepted, how you verified.
 checklists.md
```

## Commit discipline (even in a demo)
- Prefix commits with **Red:** / **Green:** / **Refactor:**.
- Keep diffs tiny; narrate intent in the body.
- Avoid “sneaky refactors” inside Green; move them to explicit Refactor.

## What to say about Cursor/AI
- “I treat AI like a **junior pair**: helpful for scaffolds and reminders, never the source of truth.”
- “Nothing ships without a failing test first.”
- “I log prompts and my decisions in `docs/ai-notes.md` for auditability.”

## What *not* to do
- Let AI output skip straight to big implementations.
- Merge code without tests.
- Hide AI involvement—embrace transparency and control.
