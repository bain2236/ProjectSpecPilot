# Kata brief — Mars Rover (recommended)

**Goal:** Practice TDD on a well-scoped problem. You can swap to any kata from Made Tech’s list; this brief matches a common version of **Mars Rover**.

## Problem outline
- A rover sits on a grid with coordinates (x, y) and a facing (N/E/S/W).
- It accepts a command string like `fflbr`:
  - `f`/**forward**, `b`/**backward** move one cell relative to facing.
  - `l`/**left**, `r`/**right** rotate 90°.
- The grid **wraps** at edges (torus).
- Some cells contain **obstacles**; moving into one should be reported and the rover should remain in place.

## Constraints for TDD practice
- Start with the **smallest** behavior (turning) before movement.
- Prove wrapping with one edge case first, then generalize.
- Add obstacles last; keep the exception/reporting mechanism simple.

## Out-of-scope (for the short demo)
- CLI/HTTP UI
- Persistence
- Complex parsing or validation beyond what tests need