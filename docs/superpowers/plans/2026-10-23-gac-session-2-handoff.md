# GAC homework — handoff after session 2 (2026-10-23)

Supersedes the "State right now" table of `2026-10-23-gac-next-session-handoff.md` (its decisions, test-campaign table and rule reminders still stand).

## State

| Where | Head | Status |
|---|---|---|
| Engine `/Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct` | `gac-29oct` @ `53703521` (26 commits on `74ff16c0`) | gated: tsc clean, `test:all` minus `test:material-extract` = 385/387 (baseline 2 only); NOT deployed, NOT pushed |
| Academy `/Users/luke/Dev/academy/.claude/worktrees/gac-29oct` | `gac-29oct` @ `ea34a180` (4 commits on `bf7dadad`) | `npm test` 432 files / 7022 green at `1e9295b3`; later commits ran focused suites + typecheck:web; NOT deployed, NOT pushed |
| Local stack | still runs the OLD heads (engine `74ff16c0`, academy `bf7dadad`) | restart with `scripts/ops/gac-local.sh` to pick up this work |

## Done this session

- **A1** typed problem → homework set (academy `81b7de5c`, review fixes `a218c9bd`). Spec `docs/superpowers/specs/2026-10-23-gac-typed-problem-set-design.md`. Kill switch `HOMEWORK_TYPED_SET=off`.
- **A2** confirmed parts carry across sessions of one problem (engine `0919d861`, academy `1e9295b3`).
- **A5** figure vocabulary, all 13 kinds + arc-endpoint read rule (engine `c21170e6`, `1c59e6e0..53703521`; academy `ea34a180`). Plan `docs/superpowers/plans/2026-10-23-gac-figure-vocabulary-plan.md`; ledger with 26 rulings `.superpowers/sdd/2026-10-23-gac-figure-vocabulary-plan/progress.md` (engine worktree, kept). Kill switch `HOMEWORK_FIGURE_KINDS=geometry`.
- **B6** figure-hook opener rule `ea089ff5` · **B7** described-answer pre-check rule `2bf0c39e` (flag `NEXT_PUBLIC_TUTOR_PRECHECK_DESCRIBED_ANSWER`) · **B8** segment-intro rule `25d85fa3` · **B9** stepsTried `6abd40ae` + `1c072323`, 80 % upload warn email (academy `1e9295b3`).

## Owed

1. **Praveen decides A3** (5-minute minimum): no partner is marked self-serve (`Partner.metering.plan` unread; `kind` is partner/first-party/test) and no self-serve partner is pooled, so enforcement touches nobody today. Smallest design: `metering.plan: 'self-serve' | 'contract'` (missing = contract) + `max(300, wallSec)` at the completed/abandoned save in `chargeSitting` (main checkout `apps/tutor/src/lib/tutor/portal/partner-pool.ts`).
2. **A4** (other plangen-fast callers → Haiku 5.5): needs an OK for ≈ $5 API spend per caller.
3. Render-harness screenshots of the 17 new figure fixtures (`npm run test:render-tools -- homework`, needs a dev server — not in the gac-29oct worktree while the local stack runs from it). Watch `ProblemFigure`'s `[&_svg]:h-full` with a titled renderer.
4. Compare the hand-written cone fixture `HW910_P4` with the stored hw-9/10 p4 text (the read-only Mongo read was refused by the permission layer).
5. One live check on the local stack: a typed problem with a described figure → lands on the preview, key + steps + figure in `homeworkbuilds`.
6. Test campaign (handoff table) — add: a dot plot / box plot of raw data drawn as the student's construction (provenance is per number, not per source).
7. Deploy to the GAC sandbox only after telling GAC: `deploy-tutor-gac.sh` from the engine worktree, then `deploy-greenapple.sh` from the academy worktree, then push both branches.

## Session 2, part 2 (2026-10-23, later) — Praveen's answers + builds

Praveen: A3 minimum applies to ALL partners; typed sets billed like uploads = keep; A4 approved ("make these Haiku 5.5").

| Where | Head | What |
|---|---|---|
| Engine `gac-29oct` | `afbe9b91` | A4: enumerate / summary / rail labels / condense → Haiku 5.5 low (`e728683a`, `7460aace` summary level guard, `afbe9b91` review fixes: rail-label cache keyed by model + no cache on non-end_turn, condense max_tokens → fallback). Classify stays Haiku 4.5 (role `plangen-classify`; 5.5 broke its JSON). Rollback `TUTOR_MODEL_PLANGEN_FAST=claude-haiku-4-5-20251001` (BOTH GAC env files). Eval `docs/superpowers/evals/2026-10-23-plangen-fast-compare.md`. Enumerate now prefixes a sheet's shared instruction to each problem. |
| Engine `session-min-5` (off origin/main e6f7a1b7) | `ee6b9e40` | A3 pool side: per-session 300 s floor on terminal saves (completed/abandoned) in `chargeSitting`; terminal save retries a lost CAS once; `TUTOR_SESSION_MINIMUM=off` kill switch. Known: tab-hide sends 'abandoned' → floor billed early (total right; only bites a pool with <300 s left); two tabs ending at once can double-floor (rare). Deploy = main (merge origin/main first, `deploy-tutor.sh`). |
| Academy `gac-29oct` | `00ab3528` | A3 GAC side (`881a6946` + review `00ab3528`): ledger top-up to 300 s once at the terminal end (finish, idle sweep, discard, supersede; never pause), period = session's start month, bulk settle only for sessions ended <24 h; admin reads floor rows with `minBilledAt`. `SESSION_MINIMUM=off`. `cf296217` fixed the stale "Figure ready" test. `npm test` 433 files / 7043 green. |

Test checklist: page https://claude.ai/artifact/9AHRT2svqQQz4F2L9sdr17 (results saved in its db collection `results`, readable with ArtifactData) · markdown `docs/superpowers/plans/2026-10-23-gac-test-checklist.md`.

Before the GAC deploy, TELL GAC: every ended tutoring session now costs ≥ 5 min of the student's allowance and the pool (each homework-problem Start is a session).
