# Handoff prompt — next Claude session

## Read first

1. `memory/project_tutor_whiteboard_open_issues.md` — full P0/P1/P2/P3 backlog from the 2026-05-13 Phase 2a live-testing sessions. This is your canonical reference for what's open.
2. `memory/project_tutor_whiteboard_markup_audit.md` — what's shipped (Phase 1, 1', 2a, plus counter-drift / oval / central-pin / dedup fixes). Lists every load-bearing guardrail in scribble + handwrite. Do not regress these.
3. `memory/project_tutor_round7_architecture.md` — tutor architecture / orchestrator / judge invariants. Critical for the audio-cascade work.

## Scope for this session

Scribble + handwrite core code is **closed**. Commits on main:
- `95e2743` counter-drift + oval
- `cff62bf` central-pin escape
- `d5325ad` cross-turn dedup + verbose labels + newest-wins
- `21b1ca7` t_chart column DOM + paddingTop/Bottom for escaped/bottom handwrites

Two new code-level scribble/handwrite issues surfaced 2026-05-13 session #8 (see compendium "Additional issues" section) — they're optional pickup if you have bandwidth, but **prioritize brain / judge / orchestrator issues**.

Pick issues in priority order from the compendium.

## Issues in priority order

### P0-1 — Tutor confirms wrong student answer

**Repro**: try-yourself or show_problem with a known expected answer, student types a wrong answer, brain says "Exactly!" and proceeds. Observed verbatim on 2026-05-13 session #6: question "Which branch is the PRESIDENT the head of?", student typed `legislative`, brain narrated *"Exactly — the President heads the Executive branch!"*

**Two-pronged fix recommended:**

(a) **Judge-side, answer-correctness check.** Currently the judge only checks board-contradiction. Wire it with the last-shown problem's `expectedAnswer` (when present) and have it KILL turns that confirm a wrong answer. The judge prompt is in `src/app/api/tutor/judge/route.ts`; the orchestrator hands it the snapshot from `VoiceTutorRealtime.tsx` around line ~6100.

(b) **Brain prompt rule.** Add an explicit rule to the system-prompt builder (`src/lib/tutor/ai/system-prompt-builder.ts`) — *"After a show_problem turn, your first sentence MUST echo the student's actual answer text. Do NOT substitute the expected answer for what the student said. If wrong, name the wrong answer first, then correct it."*

Start with (a) — it's the structural fix. (b) is belt-and-suspenders.

### P0-2 — Audio gibberish during judge/orchestrator retries

**Repro**: any judge KILL or solver pre-check rejection mid-turn. The brain's audio chunk that was already mid-playback overlaps with the retry audio.

**Investigation needed before fix:**
- Read the audio-playback pipeline in `VoiceTutorRealtime.tsx` (search for `session-audio` POST endpoint usage and the play-queue logic).
- Find where the brain stream cancels on `judge KILL` — does it hard-stop the audio chunk or wait for the next boundary?
- Look at `[brain-orchestrator] judge KILL` log paths to map the cancel signal.

**Likely fix shape**: hard-cancel any in-flight audio chunks immediately when judge KILLs OR when the solver pre-check rejects, BEFORE starting the retry stream. May need a generation counter on audio chunks so stale ones can be dropped at play time.

### P1-1 — Brain emits same scribble with mismatched narration

Brain followed test-plan teacherNote verbatim (`scribble Legislative`) while narrating about a different branch (`Executive`, what the student named).

**Fix**: system-prompt rule in `src/lib/tutor/ai/system-prompt-builder.ts` — *"Scribble target MUST match the entity you just named in speech. If you say 'Executive', scribble 'Executive' (NOT 'Legislative'), even if the teacherNote says otherwise."*

Also tighten the test plan `src/lib/tutor/lesson-plan/seeds/test-g5-phase2a-organizers.ts` to say "circle the branch the student named" instead of hardcoding `target: "Legislative"`.

### P1-2 — Brain re-narrates instead of advancing on "Yes"

Brain asks *"Ready to move on?"* → student says `"Yes"` → brain re-emits the same scribble + re-narrates the same content instead of calling `mark_segment_complete` + `advance_lesson`.

**Fix**: system-prompt rule — *"When the student responds with 'Yes', 'Sure', 'OK', or 'Ready' after you asked 'ready to move on?'-style question, you MUST call `mark_segment_complete` + `advance_lesson` in the SAME turn. Do NOT re-emit visualizations on the segment you're leaving."*

Optional orchestrator fallback: detect this pattern in `VoiceTutorRealtime.tsx` and inject a synthetic `advance_lesson` if the brain didn't.

### P2-1 — Brain emits wrong `government_branches` schema on first try

Brain emits `params: {legislative: {name, body, role}, executive: {...}, judicial: {...}}` instead of `params: {branches: [{name, bodies, powers}, ...]}`. Solver rejects → validator feedback → retry. Costs ~5s and exposes the audio-cascade window.

**Fix**: improve the tool definition for `show_diagram(government_branches)` in `src/app/tutor/hooks/toolDefinitions.ts` — add an explicit example with the `branches: [...]` array shape. Brain consistently picks the wrong shape because the schema description doesn't show a concrete example.

### P2-2 — Brain emits verbose `near` strings for handwrites

Observed: `near: "term \"Democracy\" (center)"` repeatedly fails catalog resolution → margin fallback (works but loses anchor intent).

**Fix options** (pick one):
- Brain prompt: "near anchors should be SHORT — `term`, not `term \"Democracy\" (center)`."
- Catalog: relax `normalizeToken` to strip trailing parenthetical descriptors before matching.

The verbose-scribble-target variant of this issue was fixed for frayer + argument in commit `d5325ad`. Apply the same pattern for handwrite `near` if you want to mirror it.

### P3 — Multiple gov_branches diagrams with reordered branches

Brain emits gov_branches `branches: [Exec, Leg, Jud]`, judge kills audio mid-narration, brain retries with `branches: [Leg, Exec, Jud]`. Content-based dedup signature doesn't catch the reorder → two near-identical diagrams on consecutive pages.

**Fix**: in `structuralAxesFor` (or wherever the dedup signature for `government_branches` is computed), canonicalize the branches array by sorting on `name` before hashing.

### P4 — Brain emits same organizer kind TWICE in one turn

Observed session #8 Image #21: brain emitted `show_diagram(kwl_chart)` twice in the same turn with different content. Both rendered (different content signature). Result: two stacked KWL charts on the same page.

The existing `isOrganizerKind` dedup at `VoiceTutorRealtime.tsx:~3061` only fires cross-batch. Same-turn duplicate emissions of the same organizer kind aren't collapsed.

**Fix**: extend the dedup check — within a SINGLE turn, two show_diagrams of the same organizer kind dedup to the first one.

## Optional scribble/handwrite polish (low priority)

- **Scribble label clamp** — when label staggers ON TOP of the diagram title (Image #19, #22), flip to below the target instead of clamping to vbH * 0.04. `WhiteboardCanvas.tsx` case `'circle'` near line ~1394.
- **Underline shape feels like a CSS border** — user suggested adding a `check`/`tick` shape, or making the underline path zig-zag for a hand-drawn feel. PDF capture mirror at `whiteboard-capture.ts:~615`.
- **Handwrite `position: "right"` lands inside neighbor feature** — Image #22's "facts that back it up" handwrite was anchored to evidence with position:right and landed inside reasoning (side-by-side layout). Heuristic: check if proposed position rect overlaps a sibling `[data-feature]` element; if yes, fall back to margin-right.

## Constraints / do-NOT-regress list

From the compendium + audit:

- **Counter-drift fix** (95e2743): any new non-render command type added to the orchestrator MUST be in `META_ACTIONS` if it's stripped before `whiteboardCommandsRef.current` is updated. Otherwise the order counter drifts and scribbles silently lose `targetItemIndex`.
- **Central-pin escape** (cff62bf): the heuristic is `xOff < 15%, yOff < 20%, areaFrac < 6%`. Don't expand without checking the frayer-term + non-central anchors don't both trip it.
- **Cross-turn scribble dedup** (d5325ad): signature is `(itemId, feature, shape, color, label)`. Same fingerprint = silent drop. Don't add fields to the signature without checking it doesn't break the brain's legitimate re-emphasis path.
- **Newest-wins on ambiguous catalog** (d5325ad): scribbles no longer surface ambiguous errors. If you need to re-introduce them for a non-scribble use case, gate the change behind a per-call flag.
- **Round-7 advisory judge mode**: judge is advisory-only by default. KILLs are reserved for board-contradiction. Adding answer-correctness KILLs (P0-1) is a deliberate scope expansion — the judge prompt + threshold need careful tuning so it doesn't fire on valid free-response variations.

## Testing protocol

After each fix:
1. `npx tsc --noEmit` clean.
2. Re-run `scripts/test-comparison-table-manifest.ts` and `scripts/test-phase2a-organizers.ts` — both should still pass.
3. Live test the specific scenario in `evelyn.test.g5.civics.phase2a.v1` (hard-refresh Cmd+Shift+R) and capture the log + screenshots before claiming complete.
4. PDF parity: every visual change must look identical in `Tutor_Session_*.pdf` export. The capture utilities in `src/lib/utils/export/whiteboard-capture.ts` mirror the live overlay; keep them in sync.

## What's NOT in scope this session

- Phase 2b (SVG-coordinate organizers) — deferred to session evidence; don't start.
- Phase 2a renderer changes — solid, leave alone.
- Catalog resolution algorithm — solid, leave alone.
- Scribble / handwrite shape rendering — solid, leave alone.

If you find a NEW scribble/handwrite bug, log it in the compendium file rather than fixing immediately — verify it's a regression of the d5325ad work first.
