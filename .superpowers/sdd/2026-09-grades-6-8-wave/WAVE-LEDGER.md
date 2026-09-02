# Grades 6/8 MS Course Wave — Ledger

Plan: docs/superpowers/plans/2026-09-02-grades-6-8-ms-course-wave.md (main e78c09f2). Read the plan + its Global Constraints before acting; this ledger is the resume point across sessions.

## Course status matrix

| Course | Curriculum | Sign-off | Exemplars | Plans /40 | Lint+reg | Items | Notes | Guides | Reviewed | Cost actuals |
|---|---|---|---|---|---|---|---|---|---|---|
| m6math | ✓ (m6math-CURRICULUM.md) | ✓ 2026-09-02 | ✓ 2 (reviewed) | 40/40 | ✓ 200 OK | – | – | – | – | – |
| m6ela | ✓ (m6ela-CURRICULUM.md) | ✓ 2026-09-02 | ✓ 2 (repaired) | 40/40 | ✓ 244 OK | – | – | – | – | – |
| m6sci | ✓ (m6sci-CURRICULUM.md) | ✓ 2026-09-02 | ✓ 2 (repaired) | 40/40 | ✓ 282 OK | – | – | – | – | – |
| m6geo | ✓ (m6geo-CURRICULUM.md) | ✓ 2026-09-02 | ✓ 2 + contract | 33/40 | – | – | – | – | – | – |
| m8math | – | – | – | 0 | – | – | – | – | – | – |
| m8ela | – | – | – | 0 | – | – | – | – | – | – |
| m8sci | – | – | – | 0 | – | – | – | – | – | – |
| m8geo | – | – | – | 0 | – | – | – | – | – | – |

## Contract sources (Task 0.3)

G7 ORIGINALS copied here from `/Users/luke/Dev/academy/.superpowers/sdd/2026-08-20-grade7-wave2/`: `ELA-FANOUT-CONTRACT.md`, `ELA-BANK-CONTRACT.md`, `DEFERRED-FIXES.md` (GEO/SCI variants remain in the academy dir — copy per course as needed). ⚠️ The Grade-7 MATH fan-out contract no longer exists on disk; for m6math/m8math derive from the ELA contract + the math differences it itself documents (tryFormat two-mcq-one-numeric; numeric third try_yourself) + the m7math exemplar seeds. Bank contracts are reference-only for item STYLE — item GENERATION is scripted this wave (generate-bank-items, not agent-authored).

Per-course instantiation: clone the nearest subject contract, substitute grade/audience-age/naming block (grammar in the plan's Global Constraints), the exemplar paths (this course's two, from Task 1.3 Step 1), and the worktree path CURRENT AT EXECUTION TIME (the G7 contracts hardcode a dead worktree path — always update it).

## Standing per-course command block (Task 1.4-1.6; run from the engine worktree unless noted)

```
# items (after plans registered + LOS file built)
TUTOR_MODEL_CONTENT_GEN=claude-haiku-4-5 npx tsx scripts/generate-bank-items.ts \
  --los-file <wave-dir>/<course>-los.json --ms-conventions --difficulty-spread 1,2,2,3,3,4 \
  --items-per-lo 6 --ced-prefix <M6MATH…> --subject-label "<Grade 6 Mathematics…>" \
  --grounding-from-seeds --out-dir src/data/problem-bank/<bank-dir>/
# verify (sequential — --batch is UNPROVEN, do not use)
npx tsx scripts/seed-problem-bank.ts --course <bank-dir> --dry-run
# notes
npx tsx scripts/extract-topic-notes-baselines.ts <planId>   # ×40, then ONE controller store.ts edit
TUTOR_MODEL_NOTES_POINTERS=claude-haiku-4-5 npx tsx scripts/gen-topic-notes-pointers.ts …
npx tsx scripts/topic-notes-smoke.ts "<portal course title>"  # NEVER bare (defaults to Algebra 1)
# guides (from an academy WORKTREE cut from fetched origin/main — root main is STALE)
GUIDES_MODEL=claude-haiku-4-5 npx tsx tools/generate-guides.ts --course <KEY>
```

## Decisions / rulings log

- 2026-09-02: m6math curriculum drafted; flag for Praveen: topics 1.2/1.3 share 6.RP.A.3a and 9.1 splits 6.G.A.1 by pedagogical stage rather than one-code-per-topic.
- 2026-09-02: Task 0.1 shipped `--ms-conventions` + `--difficulty-spread` (commit 920eff7a); known stricter behavior: a model-dropped item leaves a difficulty gap rather than repacking (regen the LO instead).
- 2026-09-02: Controller-model ruling (Praveen): wave execution continues in an OPUS 5 session; this Fable session lands Phase 0 + m6math curriculum only.
- 2026-09-02 (Opus session): m6math curriculum SIGNED OFF as drafted, both flags accepted. Science taxonomy ids ruled NGSS-rotation: `grade-6-earth-space-science` / `grade-8-physical-science` (landed, commit 21a5c321). Curriculum sign-off batched per DROP (4 tables at a time), not per course.
- 2026-09-02: `extract-topic-notes-baselines.ts` holds a THIRD `MS_COURSE_NAMES` registry beyond the plan's trap-#1 pair — now carries all 8 grade-6/8 rows (commit 21a5c321). Add it to the trap list for the Grade 8 drop.
- 2026-09-02: the `\$` currency-escape rule applies to GUIDES ONLY, never to lesson seeds — shipped `m7math-u4-percent-increase-decrease.ts` uses bare `$12` in prod. Struck from the m6math fan-out contract.

