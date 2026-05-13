# Handoff prompt — next Claude session

## Primary task

**Execute the scribble + handwrite redesign described in
`memory/project_tutor_scribble_redesign.md`.**

That memo is the canonical reference for what to build. Read it
first — every architectural decision is locked there (grilled
2026-05-13 across 11 questions). The memo lists files to touch,
diff size estimate, migration safety notes, and a validation
protocol.

## Why the redesign

After 8 live-test sessions, the recurring failure mode is that
the brain has no spatial awareness — every position-based
annotation (circle/oval/underline/box/anchored handwrite) eventually
collides with content. The redesign abandons position-based
emphasis on the diagram:

- All on-diagram emphasis collapses to a tiny ✓ **tick** + the
  existing **highlight** (cell/region fill).
- All textual annotation (scribble labels + handwrite text) moves
  to a per-page **annotation strip** below the rendered items.
- Strip resets on page nav.
- `tutor_handwrite` `near` / `position` / `margin` fields are
  dropped entirely; brain only emits self-contained text.

## Out of scope

All brain-side / judge-side / orchestrator issues listed in
`memory/project_tutor_whiteboard_open_issues.md` are **DEFERRED**.
Do NOT pick them up unless the user explicitly asks. Some have
become irrelevant after the redesign (flagged in the compendium).

Examples of what NOT to work on without explicit ask:
- Wrong-answer agreement (P0-1)
- Audio gibberish during retries (P0-2)
- Brain emits gov_branches wrong schema (P2-1)
- Brain re-narrates instead of advancing on "Yes" (P1-2)
- KWL double-emission in same turn (P4)

These are all available in the compendium for future pickup.

## Read first (in order)

1. `memory/project_tutor_scribble_redesign.md` — the locked design
   memo. This is the executable plan.
2. `memory/project_tutor_whiteboard_markup_audit.md` — what's
   already shipped (Phase 1, 1', 2a + counter-drift / oval /
   central-pin / dedup / t_chart-grid fixes). The CATALOG layer
   stays as-is. Only the RENDERING layer changes.
3. `memory/project_tutor_round7_architecture.md` — tutor
   architecture / orchestrator / judge invariants. Critical to not
   regress.

## Constraints / do-NOT-regress list

From the audit:

- **Counter-drift fix** (95e2743): any new non-render command type
  added to the orchestrator MUST be in `META_ACTIONS` if it's
  stripped before `whiteboardCommandsRef.current` is updated.
- **Cross-turn scribble dedup** (d5325ad): signature is
  `(itemId, feature, shape, color, label)`. The redesign changes
  `shape` to default `tick` — dedup signature still valid; same
  fingerprint = silent drop.
- **Newest-wins on ambiguous catalog** (d5325ad): kept.
- **Round-7 advisory judge mode**: kept.
- **T_chart grid DOM** (21b1ca7): left-column / right-column DOM
  markers exist. The new tick anchor MUST work against these.

## Validation protocol

1. `npx tsc --noEmit` clean.
2. Existing manifest tests still pass:
   - `scripts/test-comparison-table-manifest.ts`
   - `scripts/test-phase2a-organizers.ts`
3. New test: `scripts/test-tick-render.ts` — verifies tick SVG
   path renders at expected position relative to each organizer
   kind's feature.
4. Live-test `evelyn.test.g5.civics.phase2a.v1` (hard-refresh
   Cmd+Shift+R):
   - All 5 organizer kinds render with tick marks at right places.
   - Annotation strip populates with scribble labels +
     handwrites.
   - No overlap between strip and rendered items.
   - PDF export shows tick + strip on each page.
5. Spot-check an AP plan to confirm legacy shape mapping
   (`circle`/`underline`/etc. → tick, no error).

## Memory updates after shipping

After the redesign ships, update:
- `memory/project_tutor_whiteboard_markup_audit.md` — add the new
  commit to the shipped list.
- `MEMORY.md` index pointer for the audit.
- Move `project_tutor_scribble_redesign.md` to "SHIPPED" status
  or merge into the audit.
