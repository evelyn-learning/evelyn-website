# GAC homework — handoff for the next session (2026-10-23)

Owner: Praveen. Read this first in the fresh session, then `/Users/luke/.claude/projects/-Users-luke-Dev-evelynlearning/memory/project_gac_homework_per_problem_redesign.md`.

## State right now

| Where | Branch / head | Contents | Status |
|---|---|---|---|
| Engine worktree `/Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct` | `gac-29oct` @ `74ff16c0` | round 11 (verified solution path in the key + live frame, Q-pin in the board flow under the figure, pause path), hw-15 fixes (exact-form text keys, sector scaffold hidden), Haiku 5.5 `plangen` role, eval harness | gates green (test:all 385 + 2 baseline); NOT deployed, NOT pushed |
| Academy worktree `/Users/luke/Dev/academy/.claude/worktrees/gac-29oct` | `gac-29oct` @ `bf7dadad` | pause marks `checking` + list polls on `?paused=n`; preview-first "Start tutoring"; upload billed 1 min/problem into the fair-use ledger, pool, admin roster/cost, daily report, deletion snapshot | `npm test` 432 files / 7011 green; NOT deployed, NOT pushed |
| Main (prod engine) | `main` @ `e6f7a1b7`, pushed | dev-portal prices $0.20 voice / $0.16 text + 5-min minimum (deployed, live) and the Haiku 5.5 `plangen` role (NOT deployed — classifier refused the deploy) | run from the worktree that has env + Ketcher bundles: `cd /Users/luke/Dev/evelynlearning/.claude/worktrees/pricing-2026-10-22 && ./deploy-tutor.sh` |
| Local stack | `bash /Users/luke/Dev/evelynlearning/scripts/ops/gac-local.sh status` | engine :3007 on `74ff16c0`, api :4015 + web :3016 on `bf7dadad`, tunnel :2710 (LIVE DBs) | up at handoff time |
| GAC sandbox | engine `evelyn-tutor-gac` :3008 pinned (round-5 build), web DCrNX… | frozen since 22 Oct | deploy ONLY after telling GAC: `cd /Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct && ./deploy-tutor-gac.sh`, then `cd /Users/luke/Dev/academy/.claude/worktrees/gac-29oct && ./deploy-greenapple.sh` (api restarts before the web build — quiet moment), nginx `proxy_read_timeout 120s` by hand, then `git push origin gac-29oct` in both |

Ledgers (keep): `.superpowers/sdd/2026-10-22-gac-homework-round8-plan/progress.md` (rounds 8–10), `…/2026-10-22-gac-homework-round11-plan/progress.md`, `…/2026-10-22-gac-homework-preview-start-plan/progress.md`, `…/2026-10-22-gac-homework-upload-minutes-plan/progress.md`, all under the engine worktree. Eval: `docs/superpowers/evals/2026-10-23-plangen-model-compare.md`.

## Decisions taken 2026-10-22/23 (do not re-open)

- Sonnet 5.5 as the tutoring brain: NO (voice path sends `thinking: disabled`, forced tool choice in doodler/rule-8 repair, text between tool calls would move into thinking blocks and break render↔speech sync).
- Haiku 5.5 brain trial: PARKED.
- `plangen` role = Haiku 5.5 low effort for typed-topic plans (eval: 98.4 % verified keys, judge 7.20/8, $0.002/plan). `plangen-fast` stays Haiku 4.5 until each caller is evaluated.
- Upload billing = 1 tutoring minute per PROBLEM (not per sheet), charged once at build completion.
- Pricing: $0.20 voice / $0.16 text per minute, 5-minute minimum per session (page copy live; enforcement below).
- Q-pin lives in the board flow under the figure; never above the card, never floating over the drawing; no auto-collapse in one-problem sessions.
- GAC is text-only: no voice testing or voice work for GAC.

## Work approved for the next session ("ok to everything")

### A. Build items

1. **Ask a question with a typed PROBLEM → one-problem sheet.** Today a typed problem takes the homework-help plan path (Haiku 4.5 splitter, no key/path/figure, tutor derives live). Make it a HomeworkSet of one problem through the same build (two-solve key + steps + figure when described) and open the preview page. Entry points: academy `apps/api/src/http/routes/core.ts` `/learn/start` (~880–990, `goal === 'homework-help'`, `deps.engine.generatePlan`), the engine's `plan-generate` homework decision (`typedHomeworkPlanDecision` in `src/app/api/portal/v1/plan-generate/route.ts` ~119–260 — reuse its "is this a problem" verdict), set creation = `HomeworkSetService` upload path (`createHomeworkSet…` + `engine.homeworkBuild`). Typed TOPICS keep the lesson path. Spec first (brainstorm → spec → plan → SDD).
2. **Confirmed parts carry across sessions of one problem.** Engine `homework-problem-outcome` route returns `confirmed: string[]` (part labels / value names from `confirmedKeyParts`); academy stores it on `work.confirmedParts`; the next mint (`/homework-problem-plan`, body like `priorNote`) passes `priorConfirmed`; `homework-problem-turn.ts` + `claude-brain.ts` treat those as confirmed (`allKeyPartsConfirmed` unions them; the hpKey frame says which parts are already done). Evidence: hw-15 p2 (round-8 ledger "Round 10").
3. **5-minute minimum enforcement.** Session-usage billing bills `max(5 min, actual)` per session for self-serve partners (dev-portal pricing). Find the charge point in the engine's `session-usage` route / partner pool (`scripts/ops/partner-pool.sh`, `docs/superpowers/specs/2026-10-21-partner-minute-pool-design.md`) and the academy fair-use tick; GAC/GameClass contract rates are separate — confirm with Praveen which partners the minimum applies to before coding.
4. **Other `plangen-fast` callers → Haiku 5.5** (enumerate-problems, material-classify, material-summary, derive-rail-labels): drop `temperature: 0`, add effort low + thinking headroom, one eval pass each with the harness pattern (`apps/tutor/scripts/eval/plangen-model-compare.ts`). API spend ≈ $5 each; ask before each run.
5. **Figure vocabulary expansion** — spec `docs/superpowers/specs/2026-10-21-gac-homework-figure-vocabulary-design.md` (13 kinds; kill switch `HOMEWORK_FIGURE_KINDS`). Plus the vision read defect: hw-15 p4's read said the quarter circles were "centered at the top-left/top-right corner" (they are the bottom corners) — tighten `DIAGRAM_RULE` in `material-extract.ts` to describe arc endpoints, not inferred centres.

### B. Defects (all approved)

6. **Opener describes a picture with no board** (`exercise_no_board`, session portal-8e7849a0: "Picture a graph…" → "i dont see the graph"). Rule in the opener/hook frame: a hook that narrates a figure must board it in the same turn, or not narrate it. `claude-brain.ts` opener directive + the `exercise_no_board` detector (grep it).
7. **Pre-check false denial on a descriptive answer** ("they stay above the line" judged incorrect/high; judge flagged `false_denial` but `judge_precheck_disagreement` is advisory when the pre-check agrees with the tutor). Options: the judge's false-denial finding overrides a high-confidence pre-check on `open_question` answers that are descriptions, not values; or the pre-check prompt treats a geometrically correct description as correct. `verdict-precheck.ts`, `judge` decision path in `brain/stream/route.ts`.
8. **Thin turn after tool calls** ("Here we go." + 3 silent tool calls, 7.8 s): when a turn's tools include `advance_lesson`/`show_segment_card`, require the spoken text to introduce the next segment (frame rule) — see `cadence note` / `nextMoveAfterConfirm` precedent in `claude-brain.ts`.
9. **Upload billing follow-ups:** 80 % warn email when an upload charge crosses the threshold (`UsageLedgerService` warn path is tick-only); a `stepsTried` marker so a key whose path failed reachability is not re-solved on every cache hit (`runner.ts` keyStale).

## Testing campaign — automated vs human

Scope rule (Praveen 2026-10-23): GAC is text-only. Test nothing voice-related for GAC — no voice sessions, no TTS/STT, no turn-taking; every session in the campaign is a text session.

Run after the sandbox deploy; the written record goes to GAC ("tested with …, works all the way").

| Area | Automated (build these) | Human (Praveen / a tester) |
|---|---|---|
| Uploads | Playwright on the local stack: upload the 4 fixture sheets (`/Users/luke/Downloads/worksheet5_clean.png`, `worksheet5_photo.jpg`, `worksheet6_clean.png`, `worksheet7_clean.png`), wait for every card ready, assert thumbnail present for every `[Figure:]` problem, keys + `steps` present in `homeworkbuilds`, open each preview, Start → embed mounts, Back to list → status settles; billing row = problems × 60 s | figure FIDELITY against the sheet (angles on the right side, shading, labels), key correctness spot-check (keys are machine-verified; a 10 % human sample), tutor explanation quality (the p3/p6-style slips) |
| Ask a question | the eval harness for typed topics (keys verified + judge) — 20 topics; typed problems through the new one-problem path: assert key/figure/path built; scripted text sessions via `npm run test:tutor-e2e` answering from the key — assert keyed verdicts, done outcome | conversational quality on 5 sessions; off-plan questions; the opener |
| Self-study / pool | academy integration tests already cover gate, pool, 30-min cap, exhaustion; add an e2e for the exhaustion message and the teacher view | none beyond a glance |
| Billing reconciliation | a script: one student, N uploads + M sessions → assert admin Usage roster == Students roster == daily report == ledger; deletion keeps the month's cost | read the admin pages once |
| Voice | — | — GAC is TEXT ONLY (Praveen 2026-10-23): no voice testing for GAC at all |
| Teacher/admin | existing greenapple e2e (homework, copy, admin-round4) | one pass through the teacher view |
| Resilience | engine restart mid-session (restore path), pause/finish races (integration tests exist), 409 checking on fast reopen (e2e) | none |

Rule reminders: live sessions cost money and write prod rows (local stack uses LIVE DBs) — unit/e2e first, minimum live runs; no API spend without asking; never two deploy scripts in parallel; merge origin/main before any main deploy.

## Opening checklist for the fresh session

1. `git -C /Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct log --oneline -3` and the academy equivalent — confirm `74ff16c0` / `bf7dadad`.
2. `bash /Users/luke/Dev/evelynlearning/scripts/ops/gac-local.sh status` (tunnel must be up: `scripts/ops/mongo-tunnel.sh start`).
3. Ask Praveen: has GAC been told about the sandbox deploy? Has the main deploy line been run?
4. Start with A1 (typed problem → one-problem sheet) via brainstorming → spec → plan → SDD; batch B6–B9 as one small engine round.
