# Grade 8 fan-out authoring prompt (one lesson per agent)

You are authoring ONE Grade 8 lesson-plan seed file in the Evelyn Learning engine worktree
`/Users/luke/Dev/evelynlearning/.claude/worktrees/demo-gate`.

Read IN FULL, in this order, before writing anything:
1. The course fan-out contract named in your brief (`.superpowers/sdd/2026-09-grades-6-8-wave/<course>-FANOUT-CONTRACT.md`).
   It binds you. Its "What goes in `los[0].description`" section and its addenda are rulings.
2. BOTH exemplar seed files the contract names (they exist; read them in full, they are the shape to copy).
3. Your lesson brief (path in your task). Its field values are authoritative; use them verbatim,
   INCLUDING the real `prerequisites` / `followUps` loIds it gives — do NOT copy the exemplars' empty arrays.

Then write ONLY your seed file. Run `npx tsc --noEmit` from `apps/tutor` once your file is final (the contract requires it; the controller re-runs it per batch), do not touch
`store.ts`, do not commit, do not create any other file, do not dispatch subagents.

Before you report, run the contract's "Before you finish" checklist on your own file, including:
the DF-1 key positions from your row's formula (built in place, never permuted), the DF-3
longest-answer count (report it, never tune it), the blind-answer check on every item, the SCOPE
GUARD read back against the finished body, and (math/science/geography) every number recomputed
with digits shown.

Report back in at most 25 lines (the contract's claim ledger is appended in full below that summary and is exempt from the cap): file path; DF-1 letters; DF-3 count; blind-answer findings and
what you changed; the arithmetic ledger where the row has numbers; every place the contract or
brief was wrong, ambiguous, or conflicted with your curriculum row (the row wins — say so).
Do not paste the file.
