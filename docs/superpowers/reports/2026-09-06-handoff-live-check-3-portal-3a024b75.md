# HANDOFF — live check 3, `portal-3a024b75-33f9-4672-9519-bb4dd9c1589f` (Praveen, Crimsora, Algebra 1 multi-step equations, 2026-09-06 17:20–17:54 UTC)

Build under test: engine `yo30yK6tGB4O3rLv8dSNr` (main `7125b190`), academy `c871a0f`. Voice input, 34 min, 77 messages, 40 board commands, $3.78. Plan `evelyn.hs.alg1.multi-step-equations.v1` (seed `src/lib/tutor/lesson-plan/seeds/alg1-u2-multi-step-equations.ts`). Evidence pulled to `scratchpad/live3/` (session.json = transcript + 714 debugEvents + whiteboardCommands; out.log lines 1133–1520 = brain.stream per turn).

**Status: INVESTIGATED ONLY. Nothing fixed. Praveen continues Plan 2 after these fixes.** Work in the `tutor-rounds` worktree; deploy/push are Praveen-gated as usual.

## The two root causes behind most of what Praveen saw

### R1 — Renders are silently dropped between the flush and the canvas (6 times in this session)
Signature, identical each time: `tool_call showEquation` → `render_sync_buffer anchor=N depth=1` → `render_sync_flush "1 render(s) painted"` **with no id in parentheses** → `rule8_client_repair sent=1 painted=0` → no entry in `whiteboardCommands`. Times: 17:27:07, 17:32:07, 17:38:24, 17:47:34 (advanceLesson), 17:49:56, 17:52:58.
- 17:27:07 = Image 2 ("spoke the whole derivation, wrote nothing"): the ×8 collection step was spoken, its equation never landed.
- 17:32:07 = "did not write out the final divide-by-2 / x = 11".
- 17:38:24 = "'a fresh one' showed no question": the brain emitted a new equation (its answer x = 7 was even verified: `[verify-answer] agree=true claimed="x=7"`), the render died, so the student saw nothing and the brain — believing the equation was on the board — asked about "distributing the 2"; on "where is the question?" it scrolled to the OLD equation (`scrollTo showEquation-12`) and re-taught 3(2x−4).
Where to look: `VoiceTutorRealtime.tsx` `flushReadyRenders` (~4350–4370): it dispatches `entry.processed` and logs "painted" even when `processed` carries no catalogued render (the ids list comes from `(c as any).id`; an entry with none means the command was rejected during processing but a buffer entry was still created). Rule 8's client repair then sees `painted=0` and asks the model to re-emit — which fails the same way. No `Dropped …` tool_call event fires, so the rejection is on a silent path in `handleWhiteboardCommand` (~4702–6100). **First step: add a `render_rejected_silent` debug event with the reason at every rejection return, redeploy, reproduce.** Suspects: duplicate-signature dedup against the previous step equation, the step-label collision guard, or the placeholder-latex guard misfiring on `\Rightarrow` chains.

### R2 — The brain's algebra went wrong and the guards could not see it, because they trust the board and the board was wrong
Chain of errors (all the brain's own):
1. 17:22:51 **"105 = 105 → no solution"** — affirmed the student's wrong "no value". Authored truth says the opposite (`concept-routine` ENDING 2: true statement ⇒ infinitely many; `worked-fractions-identity` answer "Infinitely many solutions (identity)"). The judge flagged it (17:22:59) but the claim carried no math/denial ⇒ not "noteworthy" ⇒ no note. The session then contradicted itself at 17:35:39/17:36:11/17:51:12 ("infinite solutions only when the two sides were identical from the start, like our phone-bill trap"). The segment-truth block did not catch a contradiction of the authored ending.
2. 17:25:55 **"8 is the least common denominator of 2 and 4"** — affirmed; nothing flagged (judge grounded=true).
3. 17:30:37 → 17:30:45 (Image 3) student "take 4x to left" (correct). First attempt subtracted **2x** ("6x − 2x − 12 = 4x − 2x + 10", contamination from the previous problem), started to self-correct mid-turn ("Wait — let me match my board to your move exactly"), the `mid_turn_self_correction` validator killed it; the retry opened with **"Divide both sides by 2."** — a fragment out of order — then "Adding 12 … 2x = 22". The kill retraction (`reviseItems`) removed the card; the equation for "x = 11" at 17:32 then died to R1.
4. 17:42:52 student "take 4x to left" again (still correct) → **"Not quite. 4x is already on the left … we move the smaller one, 2x, off the right"** — nonsense against 6x − 12 = 4x + 10. At 17:44:37 the wrong derivation finally painted (`showEquation-17: 6x − 2x − 12 = 4x − 2x + 10`, Image 6), and from then on the judge grounded every claim against a wrong board: "4x − 12 = 2x + 10 simplifies to 4x − 12 = 10" (17:44:57), "Not quite" to the correct "4x = 2x + 22" (17:46:00), and **"x = 5.5"** (17:47:06; the answer is 11).
5. The ledger then counted the tutor's mis-gradings as the student's incorrect streak (`gap_inferred` 17:33:55, `gap_recurred` 17:46:06) and offered a recap with "You've hit a couple of bumps around this variables-on-both-sides move" — blaming the student for the tutor's confusion.

## Point-by-point answers to Praveen's list
| Praveen | What happened | Class |
|---|---|---|
| 105=105 → "no solution" | brain error affirming a wrong answer; judge flag not noteworthy; contradicts authored truth | R2 + note-planting policy gap |
| LCD of 2,4 is 8 | brain error; judge passed it | R2 (no deterministic check) |
| Image 2 spoke without writing | R1 render drop at 17:27:07 | R1 |
| Image 3 "divide by 2" out of order; x=11 not written | self-correction kill → garbled retry; then R1 drop at 17:32:07 | validator retry quality + R1 |
| Images 4/5 "5=−2 … Not quite" then "Actually hold on — exactly right" | false denial of a correct intermediate result. No verified key exists for a STEP ("5 = −2"), so only the judge saw it; the judge wanted a KILL (`judge_advisory_was_kill`) but kills are advisory-only by design (Pillar 2b), so the fix rode the 20-s note timeout → repaired 47 s later. This is "still happening" because step results are unverifiable by the deterministic guards. | judge advisory-only + step keys |
| 'no solution' turn contradiction / "you had it right the first time" | the denied-answer-reversal guard matched "infinite solutions" in an EXPLANATORY mention ("Right — no solution… infinite solutions only when…") as an assertion → false kill → the forced retry apologised about an answer the student never gave first ("you actually had it right the first time with no solution" — the student had said "infinite solutions") | reversal guard false positive |
| 'a fresh one' showed nothing; then pointed to the old question | R1 drop at 17:38:24 (x=7 problem never painted); brain believed it was on the board | R1 |
| Image 6 / everything after | R2 chain 3–5 above | R2 |

## A regression from my own last round (fix FIRST)
`judge_advisory_suppressed — "take 4x to left" vs x=7` (17:42:56) and again at 17:46:06 with `"it'll be 4x=2x+22" vs x=7`: the denial-advisory gate used `pendingGeneratedAnswerRef` (x = 7, the never-painted "fresh one") as the verified key for a DIFFERENT problem, and treated a verbal move ("take 4x to left") as an answer. It suppressed two judge flags that were RIGHT. Fix: (a) only use a key whose problem is actually on the board — invalidate `pendingGeneratedAnswerRef`/`currentProblemRef.expectedAnswer` when its render is dropped (ties into R1) and/or match the key to `currentProblemRef.statement`; (b) `studentDisagreesWithVerified` must return false for utterances with no numeric/expression content.

## Other observations
- Judge: ≥16 `grounded=false` verdicts in 34 minutes; 2 notes timed out and were "volunteered"; the volunteered turn at 17:45:23 repeated the wrong equation instead of correcting it.
- Error log during the session: three `Error: The Server Reference ID did not match the expected format. Received "x".` (a Next.js server-action call with id "x" — source unknown, worth a grep of the embed for a `formAction`/`action` misuse).
- `embed_config practice_locator=yes` — the Plan 2 locator IS minted for enrolled sessions now (first live confirmation). `goal_note=no` (no enrollment goal set).
- `recap_returned outcome=improved` after the reset; the recap itself was fine.

## Proposed fixes, ranked (for the fresh session)
1. **R1 telemetry then fix**: `render_rejected_silent {reason}` at every rejection return in `handleWhiteboardCommand`; make `render_sync_flush` say "painted" only for catalogued ids; find and fix the rejection that eats step equations. Verify with the typed harness: a session that walks 3–4 algebra steps must produce one board entry per step.
2. **F4 gate regression** (above).
3. **Board-truth independence for the judge**: when the tutor's card contradicts the authored segment steps (seed `steps`/`answer`), the judge must ground against the authored truth, not the tutor's own card; at minimum plant a note when a `worked_example` step result on the board disagrees with the seed's step text.
4. **Authored-ending contradiction guard**: when a segment's authored answer is a classification ("infinitely many" / "no solution") and the tutor states the other one, kill + retry with the authored ending (deterministic, subject-free: compare the tutor's classification sentence to `segment.answer`).
5. **Reversal guard**: the assertion regex must not match a mention inside a contrast/explanation ("… only when …", "unlike …", "not …"); require the phrase to be presented as THIS problem's answer.
6. **Step-result keys**: for worked examples, expose the seed's step results as verifiable keys so "5 = −2"-type intermediate answers can be checked deterministically (would have made Images 4/5 an instant kill instead of a 47-s note).
7. **Ledger blame**: do not count an incorrect-streak increment toward the struggle ledger when the judge flagged that denial (or retract it when the correction note fires).
8. Validator-retry quality: a retry after a mid-turn self-correction must restart from the student's move, not mid-routine (prompt the retry with the student's exact move and the current equation).

---

## Addendum — the session was RESUMED (18:13–18:23 UTC) and taken to the end to test homework

Same session id, fresh page load (`embed_config practice_locator=yes` re-fired at 18:13:02). Praveen's observations, with what the data says:

### A1 — "distribute the negative 3" while the problem has −2 (Image 7)
18:17:59: the brain marked the segment complete, advanced to `misconception-distribute-negative` (`10 − 2(x − 3)` simplified wrongly as `8(x − 3)`), rendered the check card, and asked "what happens when we distribute that negative 3 across both terms inside?" — the coefficient is −2. Q-pin captured the wrong question (18:18:10). Praveen answered correctly anyway (18:20:15 "10−2x+6 … −2x+16") and the brain praised "distributing that negative 2" — the −3 was never acknowledged as its own slip.
Not caught: the posed-computation guard (`findUngroundedComputation`) only covers `A × B` / `A ÷ B` with two numeric operands; "distribute the (negative) N" is a one-operand shape. **Fix: extend it with a DISTRIBUTE pattern — the named coefficient (sign-aware) must be the coefficient adjacent to a parenthesis in the active problem statement.** Same kill+retry path.

### A2 — No homework card anywhere (correct — none exists)
18:21:11 `practice_assign_skipped — no-lo-requested requested=[]`: the brain called `close_session_notes` with NO objectives for the second session running. The ledger-backed fallback shipped this morning (`practice_assign_fallback`, ≥2 detections) did not fire because **the struggle ledger is page memory (`ledgerRef = useRef(createLedger())`); this was a resumed page, so the 17:33/17:46 detections were gone.** The server-side auto-assign fallback also saw nothing: it reads only the final commit's gap DELTA, which was empty after the resume. Result: `practiceassignments` has no row for Praveen; the academy Session row carries no `assignedPractice`; no tutor-assigned PracticeSet.
**Fixes:** (a) the close-notes fallback must also read the PROFILE's gaps for this session (`recurrenceCount ≥ 1` on an LO of this plan, sessionIds includes this session) — or rehydrate the ledger from the profile on resume; (b) the server auto-assign fallback must consider the profile's session gaps, not just the delta; (c) tell the brain, in the close tool's description or a `<session_struggles>` line, which objectives the ledger flagged — it said "all locked in" twice while the ledger disagreed.

### A3 — The tutor announced a homework card that does not exist
18:21:02 "…a bit more practice on that classifying piece is waiting for you in Unit 2 Practice…" and 18:23:18 "The Unit 2 · Practice link on your homework card is the spot — clicking that opens the classifying-solutions problems waiting there." The `isHomeworkAnnouncement` guard only drops these sentences when there is NO locator (`if (!locatorForPrompt && …)`, VTR ~12122). Here the locator existed but nothing was assigned. **Fix: gate the announcement on an actual successful assignment this session (`assignedPracticeRef.current` set, or the practice-assign POST returned 200 with items), not on the locator alone; and the prompt's "tell the student where the practice is waiting" must be conditional on the tool having assigned something.**

### A4 — Praveen's UX ask: put the homework action item on the board
"The tutor did end talking about the unit practice; it would have been better to put that action item on the board, like the Q-pin (even though it's not a question)." **Feature: an "action pin" (next-step pin) rendered at close — `Homework: Unit 2 · Practice — 4 questions on classifying solutions` — driven by the assignment result, same pin primitive as the Q-pin.** Only when an assignment actually exists (A3).

### A5 — UI: lessons-tab progress chips collide with Resume/Discard (Image 8)
Academy web, course lessons list (`apps/web/components/CourseLessons.tsx` row): with 9+ segment chips the chip row runs under the Resume/Discard buttons. The row needs the actions in their own fixed-width column (`shrink-0`) and the chips in a wrapping or horizontally scrolling container with `min-w-0`. Also shown: "In progress — Recap · 0/5 practiced" — the lesson never reached the authored `recap` segment (the tutor wrapped from the misconception check), so the node stays in progress; and the academy Session row is `in_progress` after End by design (resumable), which is what the row reflects.

### A6 — Resume-specific breakage
18:13:10 `brain_validator_retry: tutor_scroll_whiteboard: No feature matching "Example: Solve: (1/2)(6x + 8) = 3x + 4"` then `rule8_client_repair sent=2 painted=0`: the resumed board did not restore the example card the brain remembered (the pre-resume render at 17:53:57 was `showProblem-4`), so its first move after resume was a scroll to a missing feature and another silent render drop (R1 again, on the resume path). **Add to R1's reproduction: resume a session after a `showProblem` and watch the first turn.**

## Updated ranked list (adds A-items)
1. R1 silent render drops (incl. the resume case A6) — telemetry first.
2. F4 judge-gate regression (stale key; verbal move treated as an answer).
3. Homework loop: ledger/profile-backed assignment on resume (A2) + announcement gated on a real assignment (A3) + brain told the ledger's flagged objectives.
4. Posed-computation guard: DISTRIBUTE shape (A1).
5. Judge grounds on authored truth; authored-ending contradiction guard; reversal-guard explanatory mention; step-result keys; ledger must not count judge-flagged denials; retry-after-self-correction restarts from the student's move (all from the main report).
6. Action pin at close (A4). 7. Lessons-tab chip overflow (A5, academy web).
