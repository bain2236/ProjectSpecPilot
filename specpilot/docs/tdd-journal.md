# TDD journal (lightweight log)

Keep 1–3 lines per cycle. Example:

| Time | Phase | Intent | Notes |
|------|------|--------|-------|
| 09:05 | Red | Turning left from N -> W | Expect failure with clear message |
| 09:08 | Green | Implement minimal turn map | All tests pass |
| 09:10 | Refactor | Extract direction list | No behavior change |

Tips:
- If a refactor feels risky, split it or defer.
- If a test fails for the wrong reason, fix the test first.