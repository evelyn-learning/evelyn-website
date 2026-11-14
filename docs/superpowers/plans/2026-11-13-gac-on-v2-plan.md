# GAC (GreenApple) homework sessions on the v2 brain — plan

Written 2026-11-13 for a separate Claude Code session to execute. Research behind it: two read-only sweeps of the
code at main `04e67789` (file:line references below are from that commit; re-check them, the code moves).

## Decisions already made (Praveen, 2026-11-13)

- **Switch at once.** No partner-facing opt-in period: when the work is done and verified locally, the `greenapple`
  partner row goes to v2 and :3008 is redeployed. v1 stays in the code as the rollback (one row change + redeploy).
- **Keep GAC's hard rules only.** Carry over: no revealing the final answer, one problem per session with its
  outcome reported back (done / needs review), answer checking against the key, safeguarding and conduct rules,
  billing/minutes behaviour. Teaching style, pacing and board habits are v2's own.
- GAC is **text only**. No Cartesia anywhere in this work.
- :3008 is deployed **only via `deploy-tutor-gac.sh` and only when Praveen says GAC has been told**.

## Where things stand

- The choice of brain is made in one place: `apps/tutor/src/app/tutor-portal/embed/page.tsx:2556`. A session gets v2
  when its partner row says v2 (or the token claims it under `NEXT_PUBLIC_TUTOR_BRAIN_V2_CLAIM=on`) **and**
  `v2CanRunSession(...)` passes (`apps/tutor/src/lib/tutor/portal/partner-session-options.ts:108-114`).
- GAC is on v1 for two independent reasons: its row (`:81`) has no `brainVersion`, and every GAC session carries
  `session_goal: 'homework-help'`, which `v2CanRunSession` sends to v1. Pinned by `scripts/test-brain-v2.ts:607`.
- GAC flow (academy side, unchanged by this plan): student uploads or types a sheet → homework build (key solve,
  figures) → "Start tutoring" mints a one-problem plan through `POST /api/portal/v1/homework-problem-plan`
  (plan `metadata.kind === 'homework-problem'`, `homework-problem-meta.ts:10-50`) → embed token with
  `curriculum_module` = that plan, `session_goal: 'homework-help'`, `input_mode: 'text'` → session → on end the
  academy calls `GET /api/portal/v1/homework-problem-outcome` (`outcome.ts:97-131`), which classifies the
  session from **debug events** (`homework_problem_done`, `homework_keyed_verdict`) and the transcript.
- **v2 has none of the homework machinery.** v1 does it in: `voice/homework-problem-turn.ts` (key resolved
  server-side each turn), `voice/homework-problem-block.ts` (prompt rules: never state the final answer, prior-work
  note, "Back to your list", conduct/safeguarding), `voice/keyed-verdict.ts` (deterministic check against the key,
  890 lines), `voice/verdict-precheck.ts` (text pre-check), `voice/no-reveal-ledger-gate.ts` +
  `voice/whole-answer-reveal.ts` (reveal guards), and in `VoiceTutorRealtime.tsx` (problem panel, opener, pacing
  suppressions, SSE frames → debug events).
- Switching the row today would teach the problem as an ordinary lesson: no key, no reveal guard, no problem panel,
  no figure, and the outcome route would never see the events it reads (every problem would come back unfinished).

## Target design

A **homework mode inside v2**, switched on by the plan (`homeworkProblemOf(plan)` is non-null), not by partner
name. Partner-specific strictness (no-reveal) stays gated by `noRevealLedgerForPartner(partnerId)` as today.

1. **Server: the problem and its key as facts, never as prose rules per case.** In
   `apps/tutor/src/app/api/tutor/brain-v2/turn/route.ts` + `src/lib/tutor/v2/turn.ts`: when the plan is a
   homework problem, call `resolveHomeworkProblemTurn` (reuse it, don't copy it) and add to the turn facts: the
   problem text, verified / unverified, whether the figure is already on screen, the prior-work note and the
   confirmed parts. The key itself goes only to the checker (step 2), not into the model's context.
2. **Answer checking feeds the existing empty slot.** `v2/facts.ts:23,47` has an `answerCheck` slot that nothing
   fills. Run `keyedVerdicts` (and, for prose answers, the text verdict pre-check) on the student's message before
   the model call; put the result in `answerCheck` ("part (b): matches the key" / "does not match" / "cannot tell").
   Track confirmed parts in v2 state (server-held, like v1's `homeworkConfirmed`, but in the v2 state object the
   browser already round-trips).
3. **Problem done is a tool, not a guess.** When every key part is confirmed (`allKeyPartsConfirmed`), the facts
   say so and the tutor offers "Back to your list" and calls `end_lesson`. Emit SSE frames `homework-keyed-verdict`
   and `homework-problem-done` from the v2 route (add them to `v2/client.ts:66-71`), and have `useV2Turns.ts` record
   the same debug events v1 records (`homework_keyed_verdict`, `homework_problem_done`, see
   `VoiceTutorRealtime.tsx:20553-20572`) so `classifyHomeworkProblemOutcome` works unchanged. Write a test that runs
   a v2 transcript + events through `outcome.ts` and gets `done` / `needs_review` exactly as for v1.
4. **No-reveal as a principle plus one guard.** v2's constitution must stay free of case-specific rules
   (`test-brain-v2.ts:64`, constitution header). So: (a) one general line in the homework session part (not the
   constitution): "This is the student's own homework: they must reach the final answer themselves; never state it,
   even when asked; when they are stuck, give the next smallest step"; this overrides constitution.ts:26 ("If two
   tries don't land, show the step and move on") for homework only; (b) one runtime guard, reusing
   `boardRevealsWithheldAnswer` / `wholeAnswerRevealGuardActive` from `whole-answer-reveal.ts`, applied to the v2
   reply text and board items before they are sent, for partners where `noRevealLedgerForPartner` is on. A reply
   that would reveal is regenerated once with a fact saying why; v1's fixed fallback tails are the last resort.
5. **Conduct and safeguarding** (crisis line, personal details, off-topic, extra problems) from
   `homework-problem-block.ts:55-59` / `homework-ledger.ts:161-344`: render them into the homework session part
   as plain session facts. Reuse the existing text; do not fork it.
6. **Opener and pacing.** Homework opener: one problem, pick up the prior note if there is one, never redraw a figure
   already on screen. Replace the facts line "the lesson is not at its close unless the student asks to stop"
   (`facts.ts:35-36`) with "the session ends when this problem is done" in homework mode, so a solved problem does
   not keep spending the student's minutes.
7. **UI.** `TutorClientV2` must report the problem the way VTR does (`onHomeworkProblem`, `TutorSession.tsx:1892`)
   so the `ProblemPanel` and the figure lead item render (`TutorSession.tsx:918-922, 965`). Check the question pin
   and "Question" cards do not double the panel. Typed-message hold (`text-kickoff.ts`) is not needed: the v2
   server loads the plan itself; verify the first student message cannot arrive before the opener in practice.
8. **Host pause.** `useV2Turns.ts:403` `end()` ignores the farewell argument, so the host's `paused` end loses
   "Saved — pick this up from your list…" (`host-end.ts:41`). Pass it through and show/say it.
9. **Writes.** v2 posts a profile commit and mastery at every non-trial session end (`useV2Turns.ts:301-326`) and can
   assign practice (`:332-347`). GAC runs with learner snapshots off (`ENABLE_LEARNER_MODEL_SNAPSHOT=false`). Gate
   both behind the same switch for GAC (see open question 1).
10. **Gate.** `v2CanRunSession` lets `homework-help` through **only** when the plan is a `homework-problem` plan
    (the embed knows the plan id; resolve the kind there or pass a flag). Keep `homework-help` with a whole-sheet
    plan on v1 (see open question 2). Then set `greenapple: { brainVersion: 'v2', ... }` in the partner rows.
    Note the risk from the research: today the fallback is keyed on goal only; after this change it must also
    refuse any `homework-problem` plan under a partner whose homework mode is not complete.

## Tasks (in order; each ends green before the next)

0. **Worktree** `scripts/ops/wt.sh new gac-v2` off origin/main. Read `docs/ops/WORKFLOW.md`, this plan, and
   `docs/superpowers/plans/2026-10-23-gac-session-2-handoff.md` (GAC per-problem background).
1. **Fixtures first.** Add 3 GAC fixtures to `scripts/tutor/replay-harness/fixtures/` (text mode,
   `session_goal: 'homework-help'`, a real homework-problem plan id minted on a local stack, partner `greenapple`):
   a student who solves it, one who asks for the answer outright twice, one who is wrong twice on part (b). Use
   `scripts/ops/gac-local.sh` for the local stack. Run each **on v1** first (`--no-speech --claims
   '{"input_mode":"text"}'` is irrelevant for text but keep the habit) and save the bundles + outcome classification
   as the baseline.
2. Server homework mode (design 1) + facts; unit tests in `scripts/test-brain-v2.ts` (homework facts present, key
   absent from model context).
3. Answer checking (design 2) + done (design 3) + SSE frames + client debug events; the outcome-route parity test.
4. No-reveal (design 4) + conduct (design 5); port the relevant cases of `test-no-reveal-ledger.ts`,
   `test-whole-answer-reveal.ts` to v2 (same inputs, v2 path, same verdicts).
5. Opener/pacing (6), UI panel (7), host pause (8), writes gate (9).
6. Gate + partner row (10). Update the pins: `test-brain-v2.ts:607`, `test-partner-session-options.ts`.
7. **Run the 3 fixtures on v2** locally (row flipped via `NEXT_PUBLIC_TUTOR_BRAIN_VERSIONS=greenapple=v2` in the local
   env only). Compare with the v1 baseline: outcome classification identical, no final answer stated in any turn
   (grep the transcripts for the key values), problem panel and figure visible in the screenshots, session ends
   after the problem is done.
8. Gate: `npm run test:changed`, then `npm run test:all` (this touches shared embed and session code; baseline
   failures are `embed-debug-coverage` and `portal-student-scoping` only). `wt.sh finish`.
9. **Deploy :3007 first** (`./deploy-tutor.sh`) — greenapple traffic does not touch :3007, but the shared code does.
10. **:3008 only when Praveen says GAC has been told:** `./deploy-tutor-gac.sh`. Then one live text session with a
    test student on GAC's sandbox; read its row (`homework_problem_done` present, outcome `done`).

## Rollback

Remove `brainVersion: 'v2'` from the `greenapple` row (or set `NEXT_PUBLIC_TUTOR_BRAIN_VERSIONS=greenapple=v1` in
the GAC build env) and redeploy :3008. Nothing in the data model changes, so no migration either way.

## Open questions for Praveen

1. Should v2's end-of-session writes (student profile, mastery, practice assignment) run for GAC students, given
   learner snapshots are off for GAC today?
2. Does the old whole-sheet homework path (academy `HOMEWORK_PER_PROBLEM=off`, `<homework_session>` with
   `set_current_problem`) still need to work? If not, it stays on v1 and is not ported.
3. Typed problem sets and uploads are built academy-side and need no brain change — confirm GAC has no in-session
   "upload a photo" flow (v2 hides the in-session upload).
