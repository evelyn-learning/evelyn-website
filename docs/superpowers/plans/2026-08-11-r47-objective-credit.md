# R47 Objective-Credit Round Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Board/detector-verified correct answers must credit the streak + demonstrated tracker, so a genuinely correct answer can never end a segment "visited, not mastered" with evidence outcome 0.5. Repro (prod session portal-d859df30, seg apcalcbc.ftc-try): student answered 69 correctly → the deterministic arithmetic-claim-check KILLED the brain's false denial ("72 minus 3 isn't 69") → the retry AFFIRMED — yet `streak-incorrect` fired because the pacing block's `brainCorrectionRegex` matched the retry's correction-narrative phrasing, so `demonstratedSegmentsRef` never got the segment, the C2 gate suppressed mastery, and the evidence row recorded 0.5/streak 0.

**Architecture:** A per-turn objective-correctness signal, stashed at the three deterministic false_denial kill sites (arithmetic-claim, simplification-verdict, inverse-verdict — each kill is machine proof the student's answer was RIGHT), consumed by the post-stream pacing block where it overrides the affirm/correction regex reading. Plus a supersede-revert for streak changes that fired on STAGE-3 fragment turns. The C2 completion gate and segment-evidence consumer are UNTOUCHED (constraint: fix the credit, don't loosen the gate).

## Global Constraints

- Base: branch `r47-credit` off engine main @ 6fd50ac8, worktree `/Users/luke/Dev/evelynlearning/.claude/worktrees/rail-bargein`. VTR is hot (phase-c evidence emission + R44-46 landed) — locate every site by SYMBOL/quoted code, never by line number.
- Do NOT modify `src/lib/tutor/ai/completion-gate.ts` or `src/lib/tutor/orchestrator/segment-evidence.ts` — the anti-brain-overclaim intent survives; only the CREDIT side changes.
- The objective signal must be machine-derived only (the three deterministic kills). The brain's markSegmentComplete claim and the LLM judge stay non-credit-bearing.
- Estimator thresholds only via TUNING (none should need changing — flag if a task seems to need one).
- All suites green; known pre-existing: verdict-guard 1 failure, lint broken.

---

### Task 1: Objective-correct signal → pacing credit

**Files:**
- Create: `src/lib/tutor/voice/objective-credit.ts` (+ test `scripts/test-objective-credit.ts`, register `test:objective-credit`)
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx`

**(a) Pure decision module** — keeps the policy testable:

```ts
export interface ObjectiveCorrectSignal { source: 'arith_false_denial' | 'simplification_false_denial' | 'inverse_false_denial'; segId: string; atMs: number }
export interface PacingCreditDecision { credit: 'correct' | 'incorrect' | 'none'; objective: boolean }
/** Decide the pacing-credit branch for a completed brain turn.
 *  An objective signal for THIS turn forces 'correct' regardless of the
 *  affirm/correction regex reading — the deterministic checker already
 *  proved the student's answer right; the regexes are only fallback
 *  heuristics over brain prose (they misread post-kill retries that
 *  NARRATE the correction, live incident portal-d859df30). */
export function decidePacingCredit(args: {
  isVerification: boolean;
  isAffirm: boolean;      // brainAffirmationRegex on the head
  isCorrect: boolean;     // brainCorrectionRegex on fullText (misnomer kept: true = correction detected)
  objectiveSignal: ObjectiveCorrectSignal | null;  // stashed this turn, segId-matched by caller
}): PacingCreditDecision {
  if (args.objectiveSignal) return { credit: 'correct', objective: true };
  if (!args.isVerification) return { credit: 'none', objective: false };
  if (args.isAffirm && !args.isCorrect) return { credit: 'correct', objective: false };
  if (args.isCorrect) return { credit: 'incorrect', objective: false };
  return { credit: 'none', objective: false };
}
```

NOTE the one deliberate widening: an objective signal credits even when `isVerification` is false — the live repro's classifier reading of the messy utterance is exactly what's unreliable; the deterministic kill only fires when the student DID state an answer, which is a stronger version of the same evidence. Document this in the module header.

Tests: objective forces correct over isCorrect=true (the live shape); objective with isVerification=false still correct; no-objective paths byte-match today's behavior (affirm→correct, correction→incorrect, non-verification→none, affirm+correction→incorrect); null-signal + nothing → none.

**(b) Stash at the kill sites.** New ref `objectiveCorrectThisTurnRef: { signal: ObjectiveCorrectSignal } | null` (declare near `lastStudentVerificationRef` — grep it). At each of the three deterministic false-denial kill sites in `callBrainOnce` (locate by their debug events: `arith_claim_kill` where `arith.verdict === 'false_denial'` ONLY — the false_assertion branch is the brain being wrong about its OWN math, not proof the student was right; `simplification_verdict_kill` (its only verdict is false_denial); `inverse_verdict_kill`): set the ref with source + segId. For segId use the same segment attribution the streak uses: `lastStudentVerificationRef.current?.segId ?? currentSegmentIdRef.current` — read how ver.segId is populated and match it; state your choice in the report. Clear the ref at turn START (same place per-turn refs reset — find where `lastStudentVerificationRef` or attempt state resets per turn) AND in the catch/early-return exits (grep the R44-era clear sites for the pattern).

**(c) Consume in the post-stream pacing block.** Locate by `logPacing(\`streak-correct` — the `try { const ver = lastStudentVerificationRef.current; if (ver && ver.isVerification ...)` block. Restructure minimally: compute `const decision = decidePacingCredit({ isVerification: !!(ver?.isVerification && fullText.length > 0), isAffirm, isCorrect, objectiveSignal: objectiveCorrectThisTurnRef.current?.signal ?? null })` and branch on `decision.credit` instead of the raw regex conditions. The 'correct' branch must run ALL existing effects (streak increment keyed to the signal's/ver's segId, `demonstratedSegmentsRef.add` under the same `TUTOR_PEDAGOGY_OPENER` flag, incorrect-streak reset, practice-meter solve hash, booster late-fire, `pacing_streak` event) — when `decision.objective`, additionally emit `onDebugEvent?.('pacing_objective_credit', \`${signal.source} seg="${segId}"\`)` and use the signal's segId when `ver` is null (practice-meter solvedStmt: fall back to `currentProblemRef.current?.statement` as the block already does; if no statement ≥10 chars, skip the meter increment exactly as today). The 'incorrect' and 'none' branches: behavior byte-identical to today. Guard: fullText.length > 0 stays required for the REGEX paths but not the objective path (a killed-then-retried turn always has text anyway).

Gates: new harness + `npx tsc --noEmit`. Report: the three stash hunks, the reset/clear hunks, the pacing-block restructure, and a manual trace of the live repro (arith false_denial kill → retry affirms with correction-narrative → decision.objective=true → streak-correct + demonstrated + pacing_objective_credit; then markSegmentComplete → gate sees demonstrated → mastery recorded → evidence outcome 1).

- [ ] TDD module; implement + wire; run `npx tsx scripts/test-objective-credit.ts` + tsc; commit `feat(tutor): objective-correct signal — deterministic false-denial kills credit the streak and demonstrated tracker`.

---

### Task 2: STAGE-3 fragment revert for streak changes

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx`

The brief's second shape: a `streak-incorrect` fired on a garbled perception FRAGMENT whose turn STAGE-3 later re-cut/superseded. Design: snapshot-and-restore.

- (a) New ref `lastStreakChangeRef: { segId: string; prevCorrect: {segId,count}; prevIncorrect: {segId,count}; prevPracticeStreak: number; turnMarker: unknown } | null`. In the pacing block (Task 1's restructure), BEFORE applying a 'correct' or 'incorrect' branch, snapshot the three refs' current values plus a turn identity — read how STAGE-3 supersede identifies the turn it discards (the checkpoint machinery: grep `perception_stage3_fresh` / `stage3_retro_cancel` / `perceptionInterruptCheckpointRef` and find what identity ties a checkpoint to the brain turn it kills — likely the dispatch/transcript or a checkpoint object reference; pick what is actually comparable at the supersede seam and justify in the report).
- (b) At the supersede seam (where a STAGE-3 fresh/merge DISCARDS the prior turn's outcome and re-dispatches), when the discarded turn is the one `lastStreakChangeRef` recorded: restore all three refs to the snapshot, null the record, emit `onDebugEvent?.('pacing_streak_reverted', \`seg="${segId}" — superseded fragment turn\`)`. If reading the checkpoint flow shows there is NO clean identity linking a supersede to the specific brain turn (plausible — report honestly), implement the bounded fallback: revert only when the supersede fires within 15s of the snapshot AND the change was 'incorrect' (never revert a correct credit — losing one is worse than keeping a stale one is the WRONG bias; state it the other way: reverting a WRONG incorrect is safe, reverting a genuine incorrect just returns the streak to pre-answer state, recoverable) — and say which variant you shipped.
- (c) No revert once a `mark_segment_complete` consumed the streak (segmentMasteredFlagRef / evidence emission already read it) — check ordering and guard if reachable; state findings.

Gates: `npx tsc --noEmit`; no component harness — report carries the seam analysis + hunks + traces (fragment streak-incorrect → supersede → revert → real turn credits normally; normal turn → no revert).

- [ ] Implement; tsc; commit `fix(tutor): revert streak changes fired on STAGE-3-superseded fragment turns`.

---

### Task 3: ALL-CAPS emphasis words spoken, not spelled

**Files:**
- Modify: `src/lib/tutor/voice/tts-pronunciation.ts` (prose pass of `rewriteForTTS`)
- Modify: `src/lib/tutor/ai/system-prompt-builder.ts` (one emphasis-style sentence near the existing formatting rules; pin it)
- Tests: TTS pins in the math-coverage harness's curated section (or the tts-pronunciation suite if prose pins live there — follow where existing PROSE pins live, e.g. the vocative/name rules)

Live bug (session portal-1349716e): the brain emphasizes with ALL CAPS ("Whatever ELSE he could've done") and the voice SPELLS the capitalized word ("E-L-S-E") instead of stressing it.

**TTS normalization (prose only — never inside `$…$`/`\(...\)` spans; read the pipeline to place it in the prose pass, after span extraction):** lowercase all-caps tokens that are emphasis-style words, leave genuine initialisms spelled:
- Rule A: `/\b[A-Z]{4,}\b/` tokens containing ≥1 vowel (AEIOUY) and NOT in a small extendable blocklist (`USDA, NCAA, NAACP, NAEP` — spelled initialisms that happen to carry vowels) → lowercase. (Vowel-bearing ≥4-letter caps are near-always pronounceable words or word-acronyms: ELSE, WHATEVER, NASA, STEM, FAFSA — all correct lowercased.)
- Rule B: an explicit short-emphasis-word list for 2-3-letter caps (`NOT, ALL, ANY, WHY, HOW, YES, NO, IS, ARE, ONE, TWO, TEN, OFF, ON, UP, NOW, WHO, DID, CAN, MUST, EVERY` — trim to what you can defend) → lowercase. Everything else ≤3 letters (AP, SAT, ACT, FTC, FBI, CED, FRQ, MCQ, GDP) stays untouched → still spelled, today's correct behavior.
- Sentence-initial capitalized normal words ("ELSE" vs "Else") — the rules above only match FULL caps runs; single-capital words are untouched.

**Pins:** "Whatever ELSE he could've done with that same hour" → contains " else " and no single-letter spell-out; "That's NOT the same thing" → " not "; "AP Calc BC uses the FTC" → "AP" and "FTC" byte-untouched; "NASA launched" → " nasa "; "the USDA says" → USDA untouched; a `$…$` span containing caps (e.g. "$F$") untouched. Follow the harness's exact pin format.

**Prompt:** one sentence in the speech/formatting rule area (find where *emphasis*/italics guidance lives — R38 added inline-emphasis rendering): `For spoken emphasis use *asterisk emphasis*, never ALL CAPS — the voice spells capitalized words letter-by-letter.` Pin a distinctive phrase.

- [ ] TDD pins first; implement; run the FULL math battery (`npm run test:math-coverage` — curated + stress, 0 failures) + physics/chem/subject-notation suites + the prompt-pin harness + `npx tsc --noEmit`. Commit `fix(tts): ALL-CAPS emphasis words are spoken lowercase, not spelled — initialisms preserved`.

### Task 3b: Stray dollar glued to prose in problem statements

**Files:**
- Create: `src/lib/tutor/whiteboard/statement-dollar-sanitizer.ts` (pure; + `scripts/test-statement-dollar-sanitizer.ts`, register `test:statement-dollars`)
- Modify: the showProblem/showTryYourself statement render intake (locate where `problem.statement` reaches the renderer/InlineMathText — one choke point preferred; state which)
- Modify: `src/lib/tutor/ai/system-prompt-builder.ts` (one sentence near the currency/`$` formatting guidance if such a rule area exists — grep `currency` / `dollar`; pin it)

Live bug (session portal-1349716e, stored command verified): the brain emitted `"...You choose the movie ticket.$What is the opportunity cost of that choice?"` — a stray `$` glued to a prose word in a currency-laden statement; the card renders it literally.

**Sanitizer rule (deterministic, conservative):** in a statement string, remove a `$` when (a) it is immediately followed by a letter, (b) the text from it to the next `$`-or-end reads as PROSE (contains ≥2 spaces-separated alphabetic words and none of the math signals `^ _ \ =` or digit-adjacency within 2 chars), and (c) removing it leaves the remaining `$`s all currency-shaped (`$` followed by a digit) or absent. Anything else — untouched. Pins: the live statement → `$` dropped, currency `$20`s intact; `"solve $x+2$ please"` untouched; `"costs $20"` untouched; `"What is $f(3)$?"` untouched; `"$What"` alone (no other $s) → dropped.

- [ ] TDD; wire at the intake choke point; run the new harness + `npx tsx scripts/test-inline-math.ts` (82 — must not flip) + tsc. Commit `fix(whiteboard): strip brain-emitted stray $ glued to prose in problem statements`.

### Task 3c: Q-pin cleared on segment advance

**Files:**
- Modify: `src/lib/tutor/qpin-behavior.ts` if the policy lives there, else the pin state owner in `src/app/tutor/components/session/TutorSession.tsx` (locate by `questionPin` / `latestSubstantiveTutorEntry` — the R38 persist-until-replaced logic)
- Test: extend `test:qpin` (existing harness) if the change lands in the pure module; otherwise tsc + report hunks

Live bug (session portal-1349716e, ~22:37): the Q-pin "Ready for one with a billionaire in the mix?" — a question scoped to an earlier problem — was still pinned at the Recap segment several turns later. R38's persist-until-replaced deliberately keeps a pin until a NEW substantive question arrives, but has no staleness bound: a segment advance obsoletes the pinned question (its problem context is gone) yet nothing clears it.

**Fix:** clear the active Q-pin when the lesson cursor changes segment (the same signal the rail uses — `activeSegmentId`/`currentSegmentId` change, including seam-applied inferred advances). Keep persist-until-replaced semantics WITHIN a segment. Read how the pin component receives turn/pin state and add the clear at the cleanest owner (an effect keyed on the segment id, or a clear call in the advance path — mirror where other per-segment state resets). Do NOT clear on `to:'free'`-style cursor release alone if that would wipe a still-relevant pin mid-discussion — reason about it and state your call; default: clear on any segment CHANGE including to-free.

- [ ] Implement; extend the qpin harness if the decision is pure; `npx tsc --noEmit`; commit `fix(tutor): Q-pin clears on segment advance — stale questions no longer outlive their problem context`.

### Task 3d: No "repeat that?" after a partially-delivered turn

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (the `callBrainOnce` catch block's non-abort branch — locate by the literal `'Hmm, give me a moment — could you repeat that?'`)

Live bug (session portal-1349716e, 2:49 PM): the student's long answer got a correct spoken reply, then `ERR_NETWORK_CHANGED` killed the stream tail (`[brain-orchestrator] error: TypeError: network error`) and the catch's fallback asked "could you repeat that?" on top of the already-delivered answer.

**Fix:** gate the fallback line on delivery state: find the per-turn marker for sentences already dispatched to TTS in this turn (the same state the kill/judge machinery reads — e.g. the turn-sentence buffer behind `judge_kill_snapshot`'s "heard=N" or the TTS dispatch counter; name what you used). If ≥1 substantive sentence of THIS turn already reached TTS: skip `speakTextRef` entirely, emit `onDebugEvent?.('brain_error_after_partial', \`${sentencesDelivered} sentence(s) delivered — repeat-request suppressed\`)`, and keep all the existing cleanup (streaming-entry purge, flags). If 0 delivered: today's behavior unchanged. The `escalationGaveUpRef` short-circuit stays first.

- [ ] Implement; `npx tsc --noEmit`; report the hunk + both traces (late network error after delivered sentences → silent cleanup + event; error before any sentence → repeat-request as today). Commit `fix(tutor): suppress "repeat that?" fallback when the turn already delivered spoken content`.

### Task 4: Battery + repro trace

- [ ] Run: test:objective-credit, perception-classifier (109), utterance-answer-match (62), bargein-gate (45), student-jump-intent (36), rail-labels (43), cover-layer, arith-claim (77), simplification-verdict (28), inverse-verdict (10), praise-echo (16), full math battery + physics/chem/subject-notation, r33-prompt-rules, `npx tsc --noEmit`, `npm run build`.
- [ ] No merge/deploy — controller gates.
