# Handoff — live-check-3 fixes + homework drafts (2026-09-07)

Plan: `docs/superpowers/plans/2026-09-07-live-check-3-fixes-and-homework-drafts.md`
Ledger: `.superpowers/sdd/2026-09-07-live-check-3-fixes-and-homework-drafts/progress.md` (git-ignored; read for full task-by-task detail)

## Build under test

- Branch: `tutor-rounds`
- Worktree: `.claude/worktrees/tutor-rounds`
- HEAD: `2b0b5c84` (`fix(tutor): final-review wave — spoken locator, close-notes kill switch, wrap-gated struggles block, page-key reject guard, atomic draft upsert`); the task commits end at `56c4094d`, `307df0e0` adds the harness scenario + this doc.
- Plan base commit: `8ca33484`
- `origin/main`: unchanged since the branch base (0 behind) at the time of this task — no merge was needed.

## What shipped per task

1. **T1 — R1 fix.** `7d13224d` `fix(tutor): R1 — page-scoped, prior-on-board label-duplicate guard; reject with reason instead of silent drop`
2. **T2 — R1 telemetry.** `80e7956b` `fix(tutor): R1 telemetry — flush counts board renders, empty batches skip the buffer, Rule 8 ignores meta tools`
3. **T3 — F4.** `42f818ff` `fix(tutor): F4 — judge-advisory gate uses only a key whose problem is on the board and only for value-stating utterances`
4. **T4 — posed-computation guard.** `e7a7efa5` `fix(tutor): posed-computation guard covers 'distribute the N' (coefficient must sit before a parenthesis, sign-aware)`
5. **T5 — reversal-mention guard.** `86247354`..`5ce980bf` `fix(tutor): reversal guard skips explanatory/conditional mentions of the denied phrase` / `fix(tutor): narrow denied-answer-reversal mention regex, fix test exit gate`
6. **T6 — authored-ending guard.** `3725c0cb`..`f5da864f` `feat(tutor): authored-ending contradiction guard — kill+retry when the tutor's solution-count verdict contradicts the seed answer` (+2 review fix rounds)
7. **T7 — ledger blame on denial.** `b16d2049` `fix(tutor): withhold incorrect-streak + ledger event when the judge flagged the tutor's denial`
8. **T8 — judge sees authored truth.** `3120448b` `feat(tutor): judge receives the authored solution and treats it as outranking the board`
9. **T9 — self-correction retry.** `b6d1881a` `fix(tutor): self-correction retry restarts from the student's move and the current equation`
10. **T10 — practice draft lifecycle.** `4f493992`..`a4e83da4` `feat(tutor): PracticeAssignment draft lifecycle — status, merge, finalize patch, stale sweep; open reads exclude drafts` (+1 review fix)
11. **T11 — homework draft/finalize/state routes.** `1b68f285`..`675da815` `feat(tutor): homework draft/finalize/state routes; final profile commit finalizes drafts; lazy 2h sweep on reads` (+ IDOR/ownership fix round)
12. **T12 — draft-during-session triggers.** `cf8e0c0e`..`6c56b611` `feat(tutor): draft homework during the session on recurrence / still-struggling recap / incorrect streak` (+1 critical fix: un-gated from `TUTOR_RECAP_OFFER`)
13. **T13 — finalize + spoken pointer.** `20b3eff1`..`9050f670` `feat(tutor): finalize homework on close tool + every exit; announce only a finalized assignment; brain sees ledger flags` (+3 review fix rounds — synthetic tool-result problem on the Claude-brain path, duplicate-pointer suppression, classifier reword)
14. **T14 — resume rehydration.** `a1a716b1` `feat(tutor): resumed pages rehydrate homework drafts + ledger detections from the server`
15. **T15 — action pin (A4).** `3e2b2f47` `feat(tutor): homework action pin on the board when an assignment is finalized this session`
16. **T16 — pin stacking + A6 hook.** `56c4094d` `chore(tutor): resume-board seeding telemetry (A6 investigation hook); stack hiccup + homework pins`
17. **T17 (this task) — harness reproduction + final gate + handoff.** Scenario `scripts/tutor-e2e/scenarios/render-step-labels.ts`; this document.

## R1 root cause

(Copied verbatim from `task-1-brief.md`.)

> **Root cause (established 2026-09-07 from `scratchpad/live3/session.json`):** every "1 render(s) painted" with no id + `rule8_client_repair sent=1 painted=0` was a `showEquation` whose `label`, after normalization, matched a label used EARLIER IN THE SAME SEGMENT with different latex. VTR's flatMap guard (`Dropping label-duplicate equation`, ~line 5354–5370) then `return []`, emitted `show_equation_label_duplicate_silent` — a type NOT in `EMBED_DEBUG_EVENT_PREFIXES`, so embed sessions persist nothing — and the empty batch still entered the render-sync buffer, whose flush logs `${ready.length} render(s) painted` (batches, not commands). The map (`equationLabelsThisSessionRef`) is cleared only on segment advance (~line 4276); this session sat in one segment for 27 minutes across five problems, so "Collecting x terms", "Final answer", "Distribution first", "Fresh equation to solve" each recurred and each recurrence vanished. The advanceLesson-only "drops" (17:47:34, 17:51:13) were the same empty-batch artefact plus Rule 8 counting a meta tool as a render — instrument noise, not lost ink.

Fix (T1): a label collision is only rejected (with a reason the brain can act on, never a silent drop) when the prior equation is on the **same page** and **still on the board**; any other collision (different page, or the prior was killed/retracted) registers as a fresh artefact. T2 additionally made the flush counter count board renders (not batches), skip empty batches entirely, and made Rule 8 ignore meta tool calls.

## Rulings made during the round

(Every `Ruling:` line from the ledger, verbatim.)

- **Preflight, T13 row:** close handler awaits draft+finalize fetches (≤4 s each) inside the async tool handler | Ruling: accept the bounded wait on the goodbye turn — the tool result must carry the truth; cost if wrong: ≤8 s pause before the goodbye finishes
- **Preflight, T5 row:** `not|never` in MENTION_BEFORE_RE can mask a real reversal preceded by an unrelated "not" in the same clause | Ruling: keep (conservative — a missed reversal is advisory-class, a false kill garbles the lesson); cost: rare missed reversal — **OVERTURNED, see Task 5 below.**
- **Preflight, T2 row:** unknown tool names count as renders | Ruling: fail toward repair (a real drop is worse than a spurious repair request)
- **Task 5:** review → 2 Important. Ruling (OVERTURNS preflight T5 ruling): MENTION_BEFORE_RE loses not|never|would|could|might — reviewer proved five genuine reversals ("That's not confusing, it's the X after all") now read ok; adjacent negation is already handled by the existing check. Cost if wrong: a mention like "not X but …" earlier in a clause could fire — the adjacent-negation check still covers the common shape. Second: move the test exit gate to end-of-file so the Noah block is gated.
- **Task 6:** review → 2 Important (plan-mandated). Ruling: the verdict cue must sit at the END of the pre-phrase text (adjacent, within the same clause), not anywhere in an 80-char window; MENTION_BEFORE_RE (shared with the reversal guard) gains generalization markers whenever|remember|recall|in general|generally|usually|typically|by definition; add the three false-kill sentences as null cases + a positive control that exercises isExplanatoryMention with mismatched classes. Why: false kills are the most expensive class here (2026-09-03 triage: guards killed two correct answers). Cost if wrong: a few real contradictions phrased with a non-adjacent cue are missed — the judge (Task 8) still sees them.
- **Task 11:** review → 2 Important: finalize/state (and draft-merge) keyed by sessionId with no rec.studentId === profileId check (a valid student could finalize/read another's record); state route lacks try/catch parity. Ruling: add ownership checks (mismatch ⇒ 204, never reveal existence) in all three routes and in the profile-commit finalize path — the brief omitted it, spec authority = student data separation.
- **Task 13 (pre-review):** on the Claude-brain path tool results are SYNTHETIC server acks (stream route toolResultProvider; body carries no studentId/sessionId) so the brain can never see the finalize outcome in the goodbye turn. Fix = the CLIENT speaks one deterministic pointer sentence via speakTextRef (same TTS queue as brain sentences ⇒ ordered after the sentences already dispatched, before the goodbye) after a finalize 200 with locator, appended to the transcript; prompt rule becomes "never state where practice is waiting yourself — the runtime announces it"; the tool-result note stays (harmless, OpenAI path). Why: server-side finalize needs identity+auth plumbing the stream route lacks; cost if wrong: a spoken sentence slightly out of phrase with the brain's goodbye. Also ruled: accept the finalizeHomework gating deviation (pagehide commits are not final); a pending draft must override the empty-accumulator early return.
- **Task 13 (fix round 2/5):** the isHomeworkAnnouncement widening (set|left near a practice noun) would drop in-session "I've set a practice problem on the board". Ruling: revert the widening; reword the runtime pointer to "…for you — they're waiting under <locator>." so the EXISTING noun-then-verb rule matches it. Cost if wrong: none beyond wording.
- **Task 15:** the plan-mandated pin overlap (actionPin + hiccupPin same offset) is fixed in Task 16 by rendering both pins in one bottom container as a vertical stack (small, same file).

## Final whole-branch review → one fix wave (`2b0b5c84`)

Reviewer (opus, range `9c401b91..307df0e0`): "Ready to merge: with fixes" — 1 Critical, 4 Important, 9 minor. Rulings and fixes, all in `2b0b5c84` (scoped re-review: all addressed, no new breakage):

- **Critical — the spoken pointer said "Unit 2 times Practice":** every TTS route runs `rewriteForTTS`, whose unconditional rule rewrites `·` as " times ". Fix: `buildHomeworkPointerSentence` normalises the SPOKEN locator (`·×÷|›»–—` → ", "); the action pin keeps the middot (rendered, not spoken); test asserts no such glyph survives.
- **Important — `TUTOR_CLOSE_NOTES` no longer killed homework:** drafting, exit finalize and resume rehydrate were gated only on `TUTOR_HOMEWORK_DRAFTS`. Ruling: `TUTOR_CLOSE_NOTES` stays the master switch; all three paths require it and `draftHomework` sends `locatorForPrompt`.
- **Important — `<session_struggles>` rode every turn from the first detection:** Ruling: attach only on a wrap signal (recap wrap/return active, current segment kind `recap`, elapsed ≥ 75 % of the session cap, or a goodbye-shaped utterance via `isWrapUtterance`); event `session_struggles_attached` carries the reason. Cost if wrong: the brain passes no LOs on an early goodbye — the evidence drafts still finalize on exit.
- **Important — label-dedup page key read before a same-batch synthetic newPage** ⇒ a false REJECT on a batch that opens a page. Fix: `decideLabelDuplicate({ pageOpenPending })` turns that reject into a register; VTR passes `pendingAdvanceNewPageRef` / the topic-shift next-batch flag.
- **Important — `upsertDraft` upserted on `{_id}`:** two concurrent drafts for one session minted two ids and the second hit the `sessionId` unique index (500). Fix: upsert on `{ sessionId }` with `$setOnInsert: { _id, createdAt }`.
- Minors folded in: prompt absolute scoped to "this session's practice"; sweep index `{ studentId, status, draftedAt }`; the assigned-case tool-result note is written only after the pointer null-check.
- Deferred by the reviewer's triage: `time_cap` is a dead enum value (no client caller); `\big(`-style delimiters in `parenthesisCoefficients`; the reversal/authored-ending guards share one marker list (comment it); route response keys differ (`los` vs `assigned`); legacy `upsertAssignment` unscoped by studentId (pre-existing write path); resume-rehydrate has no once-latch (safe: `resumeState` identity is stable); ownership behaviour has no Mongo-backed test; pin/pointer formatting duplicated.

### Live-check watch list (ruled-accepted behaviours with no live evidence yet)
1. Up to ~8 s of silence on the goodbye turn while the close handler awaits draft + finalize.
2. The runtime-spoken pointer: wording, and whether its transcript bubble lands after the goodbye text it was spoken before.
3. Premature wrap-up pressure from `<session_struggles>` (now wrap-gated).
4. The re-armed label-duplicate REJECTION cascade (the old code documented the brain misreading exactly this rejection) — and the harness never exercised the reject branch.
5. `resume_board_seed_mismatch` (A6) has not been observed live.

## Gate output (re-run after the fix wave, at `2b0b5c84`)

- `npx tsc --noEmit -p tsconfig.json` → **0 errors**.
- `npm run test:all` → **247/247 passed** (identical set to the pre-wave gate).
- `npm run build` → completed (route manifest printed, fresh `.next/BUILD_ID` `Evy38Gtp9iYTUkjGKiSjj` at 2026-09-07T01:09Z; no error lines in the log). Log: session scratchpad `gate2.log`.
- Scoped re-review of the fix wave (`307df0e0..2b0b5c84`): all 5 findings + 3 minors ADDRESSED, no new breakage.

## Gate output (at `307df0e0`, before the fix wave)

- `npx tsc --noEmit -p tsconfig.json` → **0 errors** (empty output).
- `npm run test:all` → **247/247 passed** (baseline was 237/237; +10 new batteries: `test:equation-label-dedup`, `test:rule8-client`, `test:judge-gate-key`, `test:authored-ending`, `test:judge-authored-solution`, `test:self-correction-retry`, `test:practice-assign-routes`, `test:session-struggles-block`, `test:homework-pointer`, `test:action-pin-text` — all confirmed PASS in the log, no reds).
- `npm run build` → **exit 0.** Last lines of output (route manifest tail):
  ```
  ├ ○ /tutor-portal/sandbox
  ├ ƒ /tutor-portal/replay
  ├ ○ /tutor/board-preview
  ├ ○ /tutor/dev/gaps
  ├ ○ /tutor/dev/notes
  ├ ○ /tutor/render-harness
  ├ ○ /tutor/settings
  └ ○ /tutor/voice-harness

  ƒ Proxy (Middleware)

  ○  (Static)   prerendered as static content
  ƒ  (Dynamic)  server-rendered on demand
  ```

## Harness numbers (R1 reproduction)

Scenario: `scripts/tutor-e2e/scenarios/render-step-labels.ts` — two multi-step equations solved in one segment, each with recurring step labels ("Collecting x terms" / "Final answer" style), driven against a real claude-brain session (dev server on :3007, `lessonPlanId: evelyn.hs.alg1.multi-step-equations.v1`, `level: '9-10'`).

Run: `TUTOR_E2E_URL=http://localhost:3007 npm run test:tutor-e2e -- render-step-labels`
Bundle: `apps/tutor/artifacts/tutor-e2e/render-step-labels-2026-09-06T22-51-31` (139 debug events, 3 non-fatal anomalies — all known-benign local HTTP 404/500 on `/api/demos/track`, `/api/tutor/session-audio`, `/api/demos/session`, unrelated to R1).

- `tool_call Whiteboard tool: showEquation` events: **4**
- `render_sync_flush` events naming a `showEquation-N` id: **4** (`showEquation-1`, `-2`, `-3`, `-4`) — **equal**, no drop.
- `rule8_client_repair … painted=0` following a showEquation: **0**
- `Dropped label-duplicate equation` / `show_equation_label_duplicate` events: **0**
- Cross-check against the persisted session (`session-1788735092047`, via `scripts/inspect-tutor-session.ts --json`, MongoDB): `whiteboardCommands` = 8 total (`newPage`×1, `showProblem`×3, `showEquation`×4) — the DB's `showEquation` count (4) matches both the tool-call count and the painted-id count exactly.
- Both problems reused a "final answer"-shaped label across pages (`x = 8` then `x = 11`) and both painted — this is precisely the live-check-3 (portal-3a024b75) failure class, now clean.

**Verdict: R1 does not reproduce on this branch.** No silent drop, no repair fallback, no rejection fired (the two equations landed on different pages, so T1's same-page-and-still-on-board gate never triggered a reject — the harness didn't exercise the reject path, only the no-longer-silently-dropped path; that's expected since the scenario's two problems open separate pages).

## Not verified

- **Live voice.** This round's verification is entirely typed-input harness + unit/integration tests; no real-microphone / real-TTS session has exercised R1, F4, the authored-ending guard, or the homework draft/finalize/announce flow end-to-end.
- **Academy Practice & Quizzes tab overhaul.** A4/A5 UI (session-customized practice surfacing) is a separate plan in the academy repo (`~/Dev/academy`, worktree `holistic-pedagogy-plan2`), written after this plan's gate is green — not part of this branch.
- **A6 mismatch event.** Task 16 added a log-only investigation hook for resume-board-seeding telemetry; the mismatch event it watches for has not yet been observed in a live session.
- **`time_cap` has no client caller.** Noted as a deferred minor under Task 13 — the End-of-session path covers the cap via source `end`, but no client code calls `time_cap` directly.

## Deploy checklist

Deploy and push are **Praveen-gated** — do not run these without his go-ahead.

1. From the worktree root: `cmp .env.local.production ../../../.env.local.production` — confirm no drift before deploying.
2. `./deploy-tutor.sh` (per the deploy-script-choice rule — tutor app only, never `./deploy-update.sh`).
3. `git push origin tutor-rounds:main`

## Deferred minors

(Every `minor (deferred)` line from the ledger, grouped by task.)

- **Task 1:** pass-branch leaves map entry unrefreshed (harmless — signature is content-pure); comment worth adding.
- **Task 2:** `boardRenders` reduce computed twice in `flushReadyRenders` (plan-mandated snippet); reuse the first.
- **Task 3:** new assertions in `test-false-praise-opener` use raw `assert` instead of the file's `check()` helper; judge-gate-key `norm()` strips only lowercase LaTeX commands.
- **Task 4:** sign-detection idiom duplicated between `numericTokens` and `parenthesisCoefficients` (plan-mandated snippet).
- **Task 6:** `problemMatchesAuthored` 12-char prefix fallback can cross-apply an authored answer to a different problem sharing an opening phrase.
- **Task 7:** a denial-kill on attempt 0 also withholds attempt 1 credit (inherited per-turn pattern); `pacing_credit` prefix redundant with `pacing_`.
- **Task 8:** `(judgeSeg as any).steps` instead of a kind narrow; `authoredSolution` recomputed per sentence (pure, cheap).
- **Task 10:** `upsertDraft` filter is `{_id}` only (plan-mandated) — two concurrent drafts can last-writer-win.
- **Task 11:** profile-commit §C.3 dedup `findAssignmentBySession` and `session-result.ts` remain unscoped by studentId (pre-existing); `resolveProfileIdOrRaw` raw-id degrade could hide a student's own draft (fails safe).
- **Task 12:** `draftHomeworkRef` assigned during render rather than in an effect.
- **Task 13:** transcript bubble order vs audio; locator middot spoken verbatim; legacy-path finalize=204 suffix; refs declared after the callback that reads them; note written before the pointer null-check (count 0 items ⇒ note claims spoken); `time_cap` has no client caller (End path covers the cap via source `end`).
- **Task 15:** the `{los, locator}` shape retyped inline three times.

## Deferred (recorded in the plan, not built here)

- **Step-result keys from seeds** (spec ranked item 5f): worked-example `steps` are prose; exposing intermediate results as verifiable keys needs seed authoring changes across 900+ plans. Deferred until the authored-ending guard (Task 6) and judge authored-solution (Task 8) have live evidence.
- **Contract `status` on `AssignedPracticeEntry` / `includeDrafts`**: not needed — the engine never returns drafts from the portal read. Add only if the academy wants to show "in progress" drafts.
- **Academy Practice & Quizzes tab overhaul + lessons-tab chip overflow (A4/A5 UI, design note 2):** separate plan in the academy repo (see Not verified above).
