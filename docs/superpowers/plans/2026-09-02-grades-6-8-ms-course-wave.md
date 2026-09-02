# Grades 6 & 8 MS Course Wave Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This is a MULTI-SESSION wave — the per-course pipeline (Phase 1) repeats eight times; track completion per course in the ledger and resume from it.

**Goal:** Build and ship eight new Middle School courses — Grade 6 and Grade 8 × {Math, ELA, Science, Geography} — at the Grade-7 shape (per course: 40 lesson plans · 240 bank items · 40 notes baselines · 40 guides), shipped as two drops (all of Grade 6, then all of Grade 8).

**Architecture:** Parameterizes the shipped Grade-7 runbook (`academy/docs/superpowers/plans/2026-08-20-grade7-wave2-courses.md`, tracked — the authority for every mechanism this plan references). Praveen's ruled stack (2026-09-02): **lesson plans via Claude Code subagent fan-out** (subscription usage, the proven G7 contract mechanics); **bank items via `generate-bank-items.ts` on Haiku + the Sonnet verify gate**; **guides via `GUIDES_MODEL=claude-haiku-4-5`**; notes mechanical + Haiku pointer pass. All model choices are per-run script env — nothing changes in prod env files.

**Tech Stack:** Engine (worktree of /Users/luke/Dev/evelynlearning): lesson-plan seeds, topic-taxonomy, problem-bank JSON, topic-notes, lint gates, `generate-bank-items.ts`/`seed-problem-bank.ts`. Academy (/Users/luke/Dev/academy): `gen-seed.mjs`/`gen-taxonomy.mjs`, guides, courseMeta, seo tests, ingest + seed-teachers, `deploy-crimsora.sh`.

**Spec:** The Grade-7 runbook + `docs/superpowers/reports/2026-09-02-course-gen-pilot.md` (measured model choices) + Praveen's rulings recorded in memory `project_course_gen_model_routing.md`.

## Global Constraints

- **Praveen gates every deploy** (both drops, both repos). Finishing a phase is not permission to ship it.
- Engine work in a linked worktree; academy work coordinates with the Crimsora lane (announce via ListAgents before touching academy; its ROOT's local `main` is STALE at `8c5876f` — always work from a fresh academy worktree cut from a fetched `origin/main`, never the root).
- Script model env per run, never in prod env: items `TUTOR_MODEL_CONTENT_GEN=claude-haiku-4-5`, verify default (Sonnet 5), notes pointers `TUTOR_MODEL_NOTES_POINTERS=claude-haiku-4-5`, guides `GUIDES_MODEL=claude-haiku-4-5`. **`--batch` verify is UNPROVEN — sequential only** until one small batch completes end-to-end.
- Verify bar per unit: **≥90% Sonnet solve-verify pass AND every LO retains ≥4 verified items**; hand-check every rejection before "fixing" (the gate is non-deterministic; G7 Math scored 238/240 live with both rejects hand-confirmed correct). Expect Geography to reject more (real-world factual claims).
- Fan-out discipline (G7-proven): one lesson per subagent, **≤8 concurrent** for plans; agents write ONLY their seed file — never `store.ts`, never commit/push/deploy/Mongo. Registration is always ONE batched controller edit after `ls | grep -c` confirms the file count. Controller spot-reads **6 plans per course** (weighted to that subject's error-prone units) + **≥3 guides per course**; Praveen signs off each course's curriculum table before its fan-out.
- Prompts/contracts pedagogically generic (house rule); course specifics enter via the identity table + curriculum rows.
- Naming (mirrors G7 exactly, `7`→`6`/`8`): seed files `m6math-uN-<slug>.ts` … `m8geo-uN-<slug>.ts`; plan ids `evelyn.ms.m6math.<slug>.v1`; export symbols `SEED_M6MATH_U<N>_<SLUG>`; cedCodes `M6MATH-<u>.<t>` (topic-indexed); bank dirs `grade-6-math` etc.; portal keys `GRADE_6_MATH` etc., `exam:'MS'`, `gradeLabel:'Grade 6'`/`'Grade 8'`; fixed 9-segment recipe (hook, concept, worked_example×2, try_yourself×3, misconception_check, recap), 1 LO/plan, `MS_SOURCE`, `MS_PACING_THRESHOLDS`; `tryFormat` two-mcq-one-numeric for math, three-mcq for ela/sci/geo; bank difficulty spread per LO exactly **1,2,2,3,3,4**; item ids `m6math-<slug>-NNN`, `answer` a LETTER, `hints` = 2 escalating.
- **Inherited traps (all live — from the G7 runbook §Known traps; re-read it before each phase):** COURSE_NAMES (seed-problem-bank) AND COURSE_PREFIX (gap-manifest) both need every course, silently; notes `course:` string must byte-match the portal `title`; `gen-seed.mjs`/`gen-taxonomy.mjs` need `ENGINE_REPO=<engine-worktree>/apps/tutor`; never a second `exam === 'HS'` predicate — use `isClassroomCourse`; exact-count seo pins are re-measured from a fresh build at merge, never delta'd; currency in guides escapes as `\$` (KaTeX segmenter); marketing grade-range claims checked against `seed/mappings.json` gradeLabels; legacy `g7-*`/`evelyn.g7.*` seeds are salvage-only; verify generated files PARSE (`tsc`) separately from meaning; ingest → seed-teachers ORDER on the server; two teacher maps (courseMeta display + seed-teachers DB) both updated; sitemap rebuild AFTER ingest.
- Gates before any deploy: engine `npx tsc --noEmit` + `npm run test:all` (4 known pre-existing failures only) + `npm run lint:ms-plans` at the pinned count + `npm run build:tutor`; academy `npm test` + guides/seo suites + funnel-brand sitemap re-pin by measurement.
- Budget expectation (measured pilot ÷ yields): ≈ $2.4/course scripted spend (~$19 for all 8); plans consume subscription usage (~5 fan-out batches/course). Every script prints usage/cost — record per-course actuals in the ledger.
- **Open inherited items — flag to Praveen at Drop 1, do not silently fix:** `MS_PACING_THRESHOLDS` is still an HS-copy placeholder (would then govern 3 grades); DF-1 (answer-position skew) and DF-2 (singular-"they" rule conflict) in the G7 deferred-fixes file.

---

## Phase 0 — Wave infrastructure (one-time, ~1 session)

### Task 0.1: MS-convention flags for generate-bank-items

**Files:**
- Modify: `apps/tutor/scripts/generate-bank-items.ts`
- Test: extend the script's dry CLI checks; verify via a 1-LO live run (~$0.01, Haiku)

**Interfaces:**
- Produces: `--difficulty-spread 1,2,2,3,3,4` (comma list, length must equal `--items-per-lo`; replaces the modulo cycle), `--id-template "<coursePrefix>-<slug>-NNN"` mode (matches G7 item-id convention; NNN = zero-padded per-LO ordinal), and topic-indexed cedCodes `<PREFIX>-<unit>.<topicIndex>` (topicIndex = the LO's position within its unit in the LOS file, matching G7's `M7ELA-<u>.<t>`), behind a `--ms-conventions` umbrella flag so existing behavior is untouched without it.

- [ ] **Step 1:** Read the current id/cedCode/difficulty assignment (the precomputed maps from the unfiltered LOS file — keep that stability property). Add the three behaviors under `--ms-conventions` + `--difficulty-spread`; validate the spread parses to integers 1-4 and matches `--items-per-lo`.
- [ ] **Step 2:** Live check: regenerate 1 Grade-7 Math LO with `--ms-conventions --difficulty-spread 1,2,2,3,3,4` and diff the output shape field-by-field against a real `grade-7-ela/u1.json` item (id pattern, cedCode pattern, difficulty sequence, answer-letter, 2 hints). Feed through `seed-problem-bank.ts --dry-run`.
- [ ] **Step 3:** `npx tsc --noEmit` clean → commit `feat(tutor): MS-convention output mode for generate-bank-items (difficulty spread, G7 id/cedCode templates)`.

### Task 0.2: Engine scaffolding for all 8 courses

**Files:**
- Modify: `apps/tutor/src/lib/tutor/topic-taxonomy.ts` (append to each subject's existing `'6-8'` array — math ~:188, science ~:259, ela ~:405, social-studies ~:461; re-grep)
- Modify: `apps/tutor/src/lib/tutor/lesson-plan/unit-titles.ts` (8 new `'grade-6-…'`/`'grade-8-…'` blocks — titles come from Phase 1 curriculum tables; scaffold with the keys + `TODO-curriculum` placeholders is NOT allowed — this task lands AFTER the first curriculum tables are signed off, per-course: do taxonomy+lint entries for all 8 now, unit-titles per course in Task 1.2)
- Modify: `apps/tutor/scripts/lint-ms-plans.ts` (8 new `COURSES` entries keyed `m6math`…`m8geo` with subject/topic/loPrefix/std/grade/tryFormat)
- Modify: `apps/tutor/scripts/seed-problem-bank.ts` `COURSE_NAMES` + `apps/tutor/scripts/problem-bank-gap-manifest.ts` `COURSE_PREFIX` (all 8, BOTH files — trap #1)
- Modify: `apps/tutor/scripts/gen-topic-notes-pointers.ts` `MS_SUBJECT_PHRASE` map (8 entries)

- [ ] **Step 1:** Add the 8 taxonomy entries, e.g. `{ id: 'grade-6-math', label: 'Grade 6 Math' }` … `{ id: 'grade-8-geography', label: 'Grade 8 Geography' }`, each appended to the END of its subject's `'6-8'` array (order is load-bearing for existing ids).
- [ ] **Step 2:** Add the 8 `COURSES` lint entries + the two problem-bank registries + the subject-phrase map, mirroring the m7 rows exactly with 6/8 substitutions.
- [ ] **Step 3:** `npx tsc --noEmit` + `npm run lint:ms-plans` (still passes at the current count — new entries with zero plans must not fail the selector; read how COURSE_SEL behaves with no matching plans and report). Commit `feat(tutor): grade 6/8 MS course scaffolding (taxonomy, lint, bank registries)`.

### Task 0.3: Wave workspace + fan-out contract templates

- [ ] **Step 1:** Create `.superpowers/sdd/2026-09-grades-6-8-wave/` with: `WAVE-LEDGER.md` (per-course status matrix: curriculum ✓ / exemplars ✓ / plans N/40 / lint ✓ / items ✓ / notes ✓ / guides ✓ / reviewed ✓), and `FANOUT-CONTRACT-TEMPLATE.md` cloned from the G7 wave's contract (find it via the G7 runbook; academy `.superpowers/sdd/2026-08-20-grade7-wave2/` may still hold the originals — if gone, reconstruct from the runbook's Task-3 spec) with `{{COURSE}}`/`{{TRY_FORMAT}}`/`{{SALVAGE}}` slots.
- [ ] **Step 2:** Record in the ledger the standing per-course command block (items/notes/guides invocations with the env vars from Global Constraints) so every course run is copy-paste identical.

## Phase 1 — Per-course pipeline (repeat ×8: m6math, m6ela, m6sci, m6geo, m8math, m8ela, m8sci, m8geo; Grade 6 first)

### Task 1.1: Curriculum table + sign-off

- [ ] **Step 1:** Author the course's 10-unit × 4-topic table (unit titles; per topic: slug, title, standard code, one-line scope, salvage pointer if a legacy `g7-*` seed covers adjacent ground) as `.superpowers/sdd/2026-09-grades-6-8-wave/<course>-CURRICULUM.md`. Standards-aligned for the grade (CCSS math/ELA, NGSS science, national geography themes); age-appropriate progression relative to the shipped Grade-7 course (Grade 6 feeds into it, Grade 8 builds on it — check the G7 course's units to avoid duplicate topics).
- [ ] **Step 2:** **Present the table to Praveen; proceed on his sign-off only.** Record sign-off in the ledger.

### Task 1.2: Unit titles + identity row

- [ ] **Step 1:** Add the course's `UNIT_TITLES` block (10 titles from the signed table) in `unit-titles.ts`; typecheck; commit with the curriculum file: `feat(tutor): <course> curriculum + unit titles`.

### Task 1.3: Exemplars + plan fan-out (subscription usage)

- [ ] **Step 1:** Controller hand-writes 2 exemplar seed files (one concept-led, one procedure-led) for this course; lint both (`npm run lint:ms-plans` count +2).
- [ ] **Step 2:** Instantiate the fan-out contract for the course; dispatch the remaining 38 plans, one lesson per subagent, batches ≤8, each brief = contract + its curriculum row + the closer exemplar's full text + prerequisite/followUp loIds. Agents write ONLY their seed file.
- [ ] **Step 3:** After each batch: `ls apps/tutor/src/lib/tutor/lesson-plan/seeds/<prefix>-* | wc -l` matches expectation; spot-fix stragglers.
- [ ] **Step 4:** Controller registers all 40 in `store.ts` in ONE edit; `npx tsc --noEmit` (catches parse-breaking output — trap #10); `npm run lint:ms-plans` → pinned count +40.
- [ ] **Step 5:** Controller reads 6 plans in full (weighted to the subject's error-prone units; note which). Fix findings via resumed authors. Commit `feat(tutor): <course> lesson plans (40) + registration`.

### Task 1.4: Bank items (Haiku gen + Sonnet verify)

- [ ] **Step 1:** Build the course LOS file from the registered plans (loId, planId, title, description, unit — 40 rows). Run per unit or whole-course: `TUTOR_MODEL_CONTENT_GEN=claude-haiku-4-5 npx tsx scripts/generate-bank-items.ts --los-file … --ms-conventions --difficulty-spread 1,2,2,3,3,4 --items-per-lo 6 --ced-prefix <M6MATH…> --subject-label "<Grade 6 Mathematics…>" --grounding-from-seeds --out-dir src/data/problem-bank/<bank-dir>/` (expect ~25-30% LO regen per the pilot; re-run failed LOs with `--only-lo`).
- [ ] **Step 2:** `npx tsx scripts/seed-problem-bank.ts --course <bank-dir> --dry-run` → ≥90%/unit + ≥4 verified/LO; hand-check every rejection; regenerate/repair; re-verify. Record yield + cost in the ledger.
- [ ] **Step 3:** `problem-bank-gap-manifest` → zero gaps. Commit `feat(tutor): <course> problem bank (240 items, verified)`.

### Task 1.5: Notes

- [ ] **Step 1:** `extract-topic-notes-baselines.ts` per plan (40); register in `topic-notes/store.ts` (one controller edit). **`course:` string byte-matches the portal title** (trap #12 — copy from the identity row, verify with a grep of both).
- [ ] **Step 2:** `TUTOR_MODEL_NOTES_POINTERS=claude-haiku-4-5 npx tsx scripts/gen-topic-notes-pointers.ts …` → human-merge via `merge-topic-notes-pointers.ts` (pointer drafts are advisory; Haiku quality unmeasured — skim 5, escalate to Sonnet for the course if weak). `topic-notes-smoke.ts <course name>` (never bare — trap #3). Commit.

### Task 1.6: Guides (academy)

- [ ] **Step 1:** Add the course's `buildCourse({...})` to `tools/gen-seed.mjs` + regenerate seeds/taxonomy: `ENGINE_REPO=<engine-worktree>/apps/tutor npm run seed:gen` + gen-taxonomy (trap #4). Add `COURSE_META[<KEY>]` blurb+teacher.
- [ ] **Step 2:** `GUIDES_MODEL=claude-haiku-4-5 ANTHROPIC_API_KEY=… npx tsx tools/generate-guides.ts --course <KEY>` (40 guides; currency as `\$` — trap #11). `npx vitest run tests/seo/guides.test.ts` + the loId set-difference check both directions (orphan guides are otherwise silent). ≥3 human spot-reviews. Commit in the academy worktree.
- [ ] **Step 3:** Update ledger matrix; course done.

## Phase 2 — Ship (repeat ×2: Grade 6 drop, then Grade 8 drop; each Praveen-gated)

### Task 2.1: Pre-drop reconciliation (academy)

- [ ] **Step 1:** `seed-teachers.ts` `COURSE_TEACHER` entries for the drop's 4 courses (the DB-writing map — trap #13; courseMeta alone is display-only).
- [ ] **Step 2:** Marketing-stats sync IN THIS DROP (house rule): bump `PRACTICE_QUESTIONS_CLAIM` (+960 verified items per grade — recompute per its own comment's arithmetic), check every grade-range claim against `seed/mappings.json` gradeLabels; `MOCK_COUNT_CLAIM` unchanged (no mocks in scope).
- [ ] **Step 3:** Re-pin exact-count seo tests from a FRESH funnel-brand build (`PUBLIC_CATALOG=1`, count served `<loc>` entries) — never hand-added deltas. Full academy test suite green.

### Task 2.2: Engine drop

- [ ] **Step 1:** Full engine gate (Global Constraints). **Ask Praveen; deploy on his go**: announce peers → merge origin/main → re-gate if non-noop → `./deploy-tutor.sh` → two-check verify (a drop-unique literal, e.g. one new plan id, in the served bundle + control; anchored env grep) → push `HEAD:main`.
- [ ] **Step 2:** Seed the drop's problem banks to prod Mongo per course (drop `--dry-run`; through the established tunnel pattern — `dotenv` is absent on the box).

### Task 2.3: Academy drop

- [ ] **Step 1:** **On Praveen's go**: announce → merge → gate → `./deploy-crimsora.sh` → server: `npm run ingest` THEN `seed-teachers` (order — trap; neither runs in the deploy script) → `rm -rf apps/web/.next/cache/fetch-cache && npm run build:web` + pm2 restart (sitemap picks up new URLs) → `ping-indexnow` → push academy main.
- [ ] **Step 2:** Data-layer verification by DIRECT prod Mongo query (never the seeder's printout): ProblemBank +960 exactly, per course 240/40 LOs/6-per-LO; courses +4, node counts, 0 pruned; sitemap +41 URLs/course from the live build; every new course has a `defaultTeacherId`.
- [ ] **Step 3:** Live spot-check one lesson per course in a real browser (plan loads, Notes tab resolves, guide page renders, bank items appear) — Praveen or controller-driven session.
- [ ] **Step 4:** Update memory (wave ledger summary + handoff section; actual costs vs the $19 estimate) and, per drop, the artifact if Praveen wants the economics page refreshed.

## Self-Review (2026-09-02)

- Coverage: Praveen's rulings all encoded (scope 8 courses/2 drops; Haiku-gen+Sonnet-verify via per-run env; plans via subscription fan-out; deploys his gate). Every G7 mechanism referenced is cited to the tracked runbook; all 13 extracted traps appear in Global Constraints or inline at their step. Format gap between generate-bank-items and G7 bank conventions closed by Task 0.1 before any course runs.
- Placeholders: none — steps carry exact names/commands or cite the precise G7 runbook mechanism to clone; curriculum content is deliberately a Phase-1 deliverable with a human sign-off gate, not plan text.
- Type consistency: naming grammar (m6*/m8*, GRADE_6_*/GRADE_8_*, cedCode prefixes, bank dirs) defined once in Global Constraints and used uniformly; `--ms-conventions` produced in 0.1, consumed in 1.4; ledger paths consistent across 0.3/1.x/2.3.
