# Problem Bank Parity Extension — Design

**Date:** 2026-07-18
**Goal:** Bring every plan LO in all 9 bank-backed courses to a floor of 4 verified ProblemBank items, and merge the `ap-parity-gaps` worktree branch to main.

## Context (measured 2026-07-18, prod Mongo)

The bank holds 1,657 rows, all LO-tagged and verified, across 9 topics. Every bank
`loId` matches a lesson-plan `los[].id`, so practice-mode retrieval (voice
`queryBank` Layer 1/3 and portal `retrievePractice`) already works for all 9
courses. The gaps are coverage, not tagging:

| Course | Items | Plan LOs | LOs with 0 bank items | ~Items/covered LO |
|---|---|---|---|---|
| ap-calculus-bc | 422 | 80 | 10 | 6 |
| ap-macroeconomics | 252 | 48 | 6 | 6 |
| ap-statistics | 236 | 49 | 10 | 6 |
| ap-environmental-science | 216 | 45 | 9 | 6 |
| ap-psychology | 192 | 37 | 5 | 6 |
| ap-english-language | 99 | 43 | 4 | 2.5 |
| ap-world-history | 92 | 76 | 36 | 2.3 |
| ap-us-history | 86 | 79 | 38 | 2.1 |
| ap-us-government | 62 | 47 | 27 | 3.1 |

Additionally, the seed JSONs for ap-macroeconomics / ap-environmental-science /
ap-psychology exist only on the `worktree-ap-parity-gaps` branch (4 commits,
+18k lines, purely additive: bank seeds, FRQ rubrics, topic-notes baselines).
Their rows are already live in prod Mongo; git needs to catch up.

## Decisions (locked)

- **Scope:** all 9 courses.
- **Depth:** every plan LO gets ≥ 4 bank items (~800 new items). Existing LOs
  above the floor are untouched.
- **Formats:** humanities (APUSH, APWorld, APGov, EngLang) stay MCQ-only.
  STEM courses keep their existing mcq/numeric mix per course convention.
- **Approach:** merge first, then manifest-driven parallel authoring
  (approach A). Runtime brain-gen is unchanged and not a substitute.
- **FRQ-practice LOs excluded (amendment, 2026-07-18):** plan LOs that exist
  only in `*-frq-practice` / `*-saq-practice` / `*-dbq-practice` /
  `*-leq-practice` plans (e.g. `apush.u1-dbq-practice`) are essay-skill LOs
  and get no MCQ bank items; the manifest excludes them. This drops the true
  gap to ~450 items (measured: 97 of the ~104 "zero-item" LOs outside APGov
  are FRQ-practice LOs; APGov's 27 are genuine content gaps).

## Plan of record

### 1. Merge `ap-parity-gaps`

Merge `worktree-ap-parity-gaps` → main, run typecheck + test suite, push,
remove the worktree. No content changes on the branch; conflicts are not
expected (additive diff).

### 2. Gap manifest

New script `scripts/problem-bank-gap-manifest.ts`:

- Reads lesson-plan seeds (`src/lib/tutor/lesson-plan/seeds/`) for each
  course's plan LO ids + `standard` (CED code) + owning unit.
- Reads the bank seed JSONs (git source of truth, post-merge) for current
  per-LO counts and difficulty spread.
- Emits per-course JSON: `[{ loId, cedCode, unit, current, deficit,
  difficultyGaps }]` where `deficit = max(0, 4 - current)` and
  `difficultyGaps` steers new items toward a per-LO spread of roughly
  1 easy (d1) / 2 core (d2–3) / 1 stretch (d4).
- LO → unit mapping comes from the plan's unit; an LO with no derivable unit
  goes to the course's last unit file and is flagged in the manifest.

### 3. Authoring

One subagent per course (9, run in parallel batches), each given:

- its manifest slice,
- the course `_AUTHORING.md` where present (humanities + the three merged
  parity-gap courses); Calc/Stats have none and follow the conventions
  evident in their existing items,
- 3 existing items from the same course as style anchors.

Rules:

- Append to the existing `src/data/problem-bank/<course>/u<N>.json` arrays.
- Ids continue the existing per-LO sequence:
  `<prefix>.<lo-slug>.<mcq|numeric>.<NN>`.
- Original items only (`internal-original` license path in the seed script);
  AP-style, never transcribed from real exams.
- MCQ: 4 choices, single correct letter answer, plausible distractors keyed to
  known misconceptions. Numeric (STEM only): clean checkable value with units
  where natural. 1–3 hints per item, mirroring existing density.
- Passage-based LOs (EngLang, some APUSH/APWorld) reuse existing
  `passageId`s from `passages/store` where one fits; otherwise author
  passage-free items. No new passages this round.

### 4. Verify gate

Per course: `seed-problem-bank.ts --course=<c> --dry-run` (schema/id/dup
validation), then a full run with the independent Sonnet verify-at-ingest
solve. Items that fail verification get one repair pass by the authoring
agent; second failures are dropped and logged. A drop that pushes an LO back
under the 4-floor triggers one top-up authoring pass for that LO.

### 5. Ship + verify

- Seed to prod Mongo (same `.env.local.production` path used for prior
  rounds). Upserts are idempotent by stable id; existing rows untouched.
- Commit the new seed JSONs + manifest script to main, push.
- Re-run the coverage aggregation against prod: assert every plan LO in all
  9 courses has ≥ 4 items and 0 unverified rows.
- Spot-check retrieval per course: `retrievePractice` for one
  previously-zero LO returns bank items; voice-path `queryBank` filter
  matches (LO-tagged rows serve only when `loId` ∈ plan LOs — already
  verified to hold for all bank LOs).

## Error handling

- Verify-gate API failures: seed script already retries; a course run can be
  resumed (idempotent upserts).
- Authoring agent produces malformed JSON: dry-run catches it before any DB
  write; repair pass fixes or drops.
- Prod seeding is additive-only; rollback for a bad batch is a targeted
  `deleteMany({ id: /<prefix>.<lo-slug>/ })` — no existing rows are modified.

## Out of scope

- FRQ/free-response bank items, new stimulus passages, AP Biology (thin
  surface, parked), non-AP topics, portal-side changes (portal is read-only
  over the bank), brain-gen changes.
