# GreenApple (GAC) 29 October release — plan

## ⚠️ UPDATE 14 Oct (evening): internal target is now MONDAY 19 OCT; three tracks added

Dee and Milo replied on 14 Oct: they hold their next testing round until the known **teaching, problem-tracking and
visual-practice gaps** are fixed. They also want the outstanding privacy safeguards clarified, and advance notice of
any hosting or service change. Praveen's rulings:
- We go back to GAC only when everything is 100% ready, with nothing left for them to find.
- **Internal target: finish and ship everything by Mon 19 Oct.** GAC is NOT told this date. The reply says only that
  their project is our priority and may ship sooner than 29 Oct. The reply is drafted at
  `docs/whitelabel/greenapple/integration/reply-2026-10-14-dee-hold/reply-PASTE.txt`.
- Scope agreed 14 Oct:
  - T1 and T3 in full; T5 in full.
  - T2: the 33 (a) objectives that fit existing kinds, the grid-polygon and stemplot kinds, and T1's 22 figure-needed
    objectives (all existing kinds).
  - T4: grid points/line and number-line intervals only. Marking a figure and 2-D shading come later.

Status at the end of 14 Oct (all unpushed, nothing in prod):
- T1: 93 items, engine `6cd7c380`. 22 figure-needed objectives moved to T2.
- T4: built end to end. Contract `7cdc204`, engine `ab721d7f`, academy `9941bbbf`.

### T6 — Teaching: no stated result after a wrong answer; correct stated misconceptions
- **Evidence:** 15 Oct release note §7/§8.
  - After a wrong answer the tutor sometimes states the correct result itself: 5 of the 13 sessions, see
    `integration/tutor-sessions-2026-10-14/`.
  - In Biology the student said enzymes are used up, and the tutor moved on without correcting it.
- **Fix:** structural, per the generic-prompts rule: no topic-specific examples. It sits in the answer-check /
  wrong-answer path, i.e. the check that went into `2c7e40ea` / `6b482b4a`.
- **Done when:** replaying the 13 transcripts offline at the turns where it went wrong no longer states the result,
  and unit tests pass.

### T7 — Problem tracking
- **Evidence:** in 6 of 13 sessions the tutor returned to or re-offered a problem already answered, or called a solved
  problem open at closing.
- **Fix:** a deterministic per-session problem ledger (open → solved) that the tutor's prompt and closing summary read
  from. The model's memory is not the source.
- **Done when:** the six transcripts replayed offline are clean, and there are unit tests on the ledger.

### T8 — Staff access log (privacy note §5)
- Record staff member, student record and time whenever a GAC tutor or admin opens a student record, in the academy
  `greenapple-pilot` app.
- Retention matches the student data.
- Admin-visible.
- Update the privacy note.
- Disk encryption is unchanged; the reply asks GAC to say if their policy requires it.

### Finish line for going back to GAC
- Every track is done and gated.
- Re-run the 13 subject sessions on the release build, with zero stated-result and zero lost-track cases. This is 13
  live runs; do them once, after offline replays pass.
- Fresh validation, plus the release note and package in the 15 Oct shape.
- Tell GAC before their build changes.

Written 15 Oct 2026, after the 15-Oct package was sent. Start a fresh session from this file plus the memory
`project_greenapple_handoff.md` (top blocks) and `reference_greenapple_pinned_engine.md`.

## What we promised GAC for 29 October (cover email, readiness §3, release note §8)

1. **Student-drawn answers**: plotting, drawing and shading the answer, graded. This was "option B" on 8 Oct.
2. **Graph and diagram items in the seven older subjects**: Algebra I, Geometry, Biology, Chemistry, AP Calculus BC,
   AP Statistics and APES. Today they have zero.
3. **At least five items on each of the 62 thin objectives** in the six newer subjects. Today they have 3–4.
4. **Longest-option rewrite**: in the older subjects' served multiple-choice items, the correct option is the longest
   in 47% (1,361 of 2,897), against 25% by chance. Bring that near chance, without changing any answer.
5. **The 41 AP humanities activities** that are unavailable. They are outside the priority subjects.

Also owed, but not part of the release:
- Delete the 13 `gac-tutor-20261014-*` test students when GAC's review ends. This needs Praveen's go-ahead.
- Retire the pinned engine once GAC accepts.

## Isolation rules: nothing here may disturb other sessions or GAC's frozen build

**Where things run now**

| Thing | Where | Who else uses it |
|---|---|---|
| GAC tutor engine (frozen) | pm2 `evelyn-tutor-gac` :3008, `/root/evelyn-tutor-gac`, build `8Z9Zj4O6mwpIs-oy8JWZ4` = `2c7e40ea`, via `session.evelynlearning.com` | GAC only |
| Shared tutor engine | pm2 `evelyn-tutor` :3007, `deploy-tutor.sh` | Crimsora, evelyntutor, GameClass, Kanzoo; other sessions deploy it |
| GAC web app | academy `greenapple-pilot` worktree, live `39d810cc` (pvhCg…), `deploy-greenapple.sh` | GAC only, but its deploy changes GAC immediately |
| Practice items, lessons, students | ONE shared Mongo (`evelyn.problembanks`, `lessonplans`, …) | every engine and every partner |

**Rules**

1. **Own worktrees, branched from origin/main.**
   - Engine: `/Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct`.
   - Academy: `/Users/luke/Dev/academy/.claude/worktrees/gac-29oct`, branched from `greenapple-pilot`.
   - Never work in `tutor-rounds`, `gameclass-*` or any other session's worktree.
   - Never `git stash`.
2. **No shared-engine deploys from this work** until the release step (C below).
   - Code is committed on the branch and pushed only as a branch, not to main, until release day.
   - Anything that reaches main must be inert for other partners. The default-ON flag rule still holds, so gate by
     partner, not by a global flag. Example: `PRACTICE_DRAWN_ANSWER_PARTNERS=greenapple`. Another session merging main
     and deploying the shared engine must then change nothing for Crimsora, GameClass or Kanzoo.
3. **No GAC deploys before release day.**
   - Nothing goes to :3008 or through `deploy-greenapple.sh` until 29 Oct.
   - GAC's freeze runs at least through 22 Oct, and longer if GAC asks.
   - Changing their build before 29 Oct needs Praveen to tell GAC first.
4. **Database writes are insert-only, gated by code, until release day.**
   - New practice items go in as generated rows, `practice-gen.<loId>.<hash>`, the same as the six-subject expansion.
   - GAC is an audited-only partner, so a generated row is served to it only once its id is on
     `apps/tutor/src/data/audited-generated-items.json`. The pinned build's list is frozen, so inserting rows changes
     nothing for GAC.
   - ⚠️ Check how other partners treat new generated rows before inserting: `apps/tutor/src/lib/tutor/portal/audited-items.ts`
     and `PRACTICE_GEN_AUDITED_ONLY_PARTNERS`. If non-audited partners would be served them at once, they appear for
     those partners immediately. Praveen decides whether that is fine.
   - ⚠️ **Never edit served rows in place before release day.** The older subjects' items are AUTHORED rows: repo JSON
     `apps/tutor/src/data/problem-bank/<subject>/uN.json`, seeded into `problembanks`, with ids like
     `alg1-absolute-value-001`. The audited list does not gate them, so an in-place DB edit reaches GAC's frozen build
     and every partner at once. That applies to the longest-option rewrite, task 4.
   - Every prod write needs Praveen's go-ahead, a backup of the affected docs first, a dry run and a read-back.
5. **Gate before anything ships.**
   - `npx tsc --noEmit` in `apps/tutor`.
   - `env -u MONGODB_URI npm run test:all`. Use `MONGODB_URI=""` where a test loads `.env.local`, because the laptop
     :2710 is the prod tunnel.
   - Plus the new tests for each track.
   - One deploy at a time, with the local lock.
   - The classifier blocks my deploys and nginx edits, so hand Praveen the exact line.
6. **Live test budget.** Every live session costs money and writes prod rows. Run unit and local checks first, and at
   most one live check per track, batched at the end.

## Tracks (independent; run them in parallel where it helps)

### T1 — 62 thin objectives to at least five items (smallest, start first)
- **Pipeline:** same as the 10-13 expansion, under `docs/whitelabel/greenapple/integration/practice-expand-2026-10-12/`.
  It runs writer brief → ingest/blind solve → readers → finalize → import rows.
  - Writers run as in-session sub-agents on the subscription, not the API.
  - The DeepSeek blind solve costs about $1.
- **List of objectives:** recompute from prod read-only, as objectives in the six subjects with 3–4 served items
  (withdrawn and misfiled excluded). Expect about 62.
- **Output:**
  - an insert-only import file;
  - audited-list ids added with `apps/tutor/scripts/audit/build-audited-generated-list.ts`, committed on `gac-29oct`.
- **Done when:** every one of the 1,390 objectives has at least five served items in a local count against the new
  list.

### T2 — Figure items for the seven older subjects
- **Kinds that exist:** `apps/tutor/src/lib/tutor/practice-figure/kinds/`, with authoring scripts in
  `apps/tutor/scripts/practice-extend/` (`figure-core.ts`, `author-batch*-figure-items.ts`). They cover function
  graphs, geometric figures and solids, distributions/box plots/scatter plots, number lines, energy profiles, Lewis
  structures, Punnett squares, cells, energy flow, maps and data tables.
- **Step 1, survey:** per objective in the 333 older skills (Alg I 40, Geo 40, Bio 40, Chem 40, BC 80, Stats 48,
  APES 45), classify the figure need:
  - (a) cannot be practised without a figure;
  - (b) a figure helps;
  - (c) none.
  Find the kinds that are missing, e.g. a two-column proof layout, transformations on a grid, a polar or parametric
  curve for BC, a residual plot, food webs or climate graphs for APES.
- **Step 2:** build the missing kinds with checkers, the way rounds 3–5 were built.
- **Step 3:** write the items, have independent readers check the keys, render each figure, check the alt text, then
  build the insert-only rows.
- **Target:** every (a) objective has figure items, like the 105 of 105 in the six subjects, plus a reasonable share
  of (b).
- **Note:** these older subjects use objective ids from their own course plans. Confirm that generated-row scoping
  (skill scope and the objective attribution in `practice.ts`) works for them before writing. Run one local
  end-to-end serve.
- **Done when:** the survey's (a) list is fully covered, keys are read independently, and figures render at phone and
  desktop width.

### T3 — Longest-option rewrite
- **Re-measure on the served set**, older subjects, multiple choice, withdrawn and misfiled excluded. The 10-14 figure
  was 1,361 of 2,897. List the items where the correct option is clearly the longest.
- **Rewrite distractors, not keys,** to comparable length: lengthen distractors or trim the key without changing what
  it means.
  - Readers confirm the key is unchanged and still the only correct option.
  - Re-measure afterwards. Target: close to 25%, and no "clear give-away" items left.
- **Ship as data:**
  - patch the repo JSON (`problem-bank/<subject>/uN.json`);
  - write a prod update script with backup and revert, and dry-run it against prod read-only.
- **Apply only in the release window (C), with Praveen's go.** The rows are shared, so Crimsora and evelyntutor get the
  improvement too. Tell Praveen that before applying.

### T4 — Student-drawn answers (option B; biggest engineering risk, start early)
- **Context:** partly built earlier as a tutor-whiteboard interaction, currently commented out. Find it first, e.g. the
  `SessionStage.tsx` "Overlay drawing pad" and older git history.
- **Scope for 29 Oct, Self Study only.** Item types:
  - plot points or a line on a grid, graded by coordinates within a tolerance;
  - shade a region or an interval on a number line, graded by the boundary and its inclusive/exclusive state;
  - mark a point or region on a figure, graded by hit areas.
  Each is graded deterministically, with no runtime model tokens, matching Praveen's 8 Oct rule for option A. Leave
  freehand Lewis and diagram drawing out unless it can be graded deterministically.
- **Engine:**
  - item schema plus a grader in the portal practice adapters;
  - the Learning Data Feed must record these items like any other. Spec 1.3.2 is frozen, so check that no new feed
    field is needed; if one is, it's a spec change GAC must be told about.
- **Academy, `greenapple-pilot` branch:** the answer UI in Self Study, working by touch and mouse, at phone width,
  with an accessible fallback such as typing the coordinates.
- **Partner-gated** as in rule 2.
- **Items:** a first set on the objectives that are naturally "draw/plot/shade" in Alg I/II, Precalc, Geometry, AP
  Calc and AP Stats. Survey them alongside T2.
- **Done when:** unit tests for each grader, an academy component test, and one local end-to-end run (engine + academy
  on local DBs) pass.

### T5 — The 41 AP humanities activities
- **Step 0, find out what they are.** No local doc lists them; GAC's 8 Oct email only says "41 unavailable
  AP-humanities activities".
  - Search Gmail for Milo and Dee's 8 Oct message.
  - Check GAC's course catalogue in the GAC DB, read-only, for activities with no content or no plan. Their sandbox
    student `stu005` is the one they used.
- **Then:** list them by course and say why each is unavailable: no lesson plan, no practice, disabled, or a missing
  plan id. Give Praveen the fix and its size before building. They are outside the priority subjects, so if the fix is
  large, agree the scope with Praveen.

## Release (C) — target: everything ready 27 Oct, live 29 Oct

1. **About 22 Oct:** a mid-point check with Praveen on what is on track. Anything that will miss 29 Oct is said early.
2. **Merge and gate.**
   - Merge `gac-29oct` with origin/main. Main will have moved, e.g. GameClass work.
   - Run the full gate.
   - Run the shared-Mongo schema check: `git diff 2c7e40ea..HEAD -- apps/tutor/src/models packages/core/src`. This
     matters because the pinned GAC build reads the same DB.
3. **Imports and updates,** with Praveen's go: T1/T2/T4 rows (insert-only), then T3 updates (backup first).
4. **Deploy the GAC engine to :3008.**
   - Use a copy of `deploy-tutor.sh` with REMOTE_DIR=/root/evelyn-tutor-gac, PM2_NAME=evelyn-tutor-gac,
     PM2_PORT=3008, TMP_TAG=tutor-gac.
   - It must keep `ENABLE_LEARNER_MODEL_SNAPSHOT=false` in that env. The script uploads `.env.local.production`, which
     says true, so patch it after upload. `TUTOR_PARTNER_BRAIN_FALLBACK=on` is already in every worktree's file.
   - The US box now has a GitHub deploy key, so `npm ci` works.
   - Verify with `curl -s https://session.evelynlearning.com/tutor | grep -o <new BUILD_ID>`.
5. **Deploy the GAC web app** with `deploy-greenapple.sh` from the academy `gac-29oct` branch. Never run it alongside
   another deploy.
6. **Push to main, partner-gated,** so the shared engine catches up without changing anything for other partners.
7. **Package for GAC:** release note in the same shape as the 15 Oct one, readiness table counts, PDFs, and a new
   freeze statement. Tell GAC before the build changes.

## First moves for the fresh session
1. Read this file, the top of `project_greenapple_handoff.md` and `reference_greenapple_pinned_engine.md`.
2. Create the two `gac-29oct` worktrees.
3. Do T5 step 0, a quick read, and the T1 recount. Both are read-only and give Praveen numbers on day one.
4. Start T4 discovery (find the commented-out code) and the T2 survey in parallel, then report the scope and dates to
   Praveen before building.
