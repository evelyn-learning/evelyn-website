# SDD ledger — plan: docs/superpowers/plans/2026-09-04-tutor-verdict-layer-and-dead-starts.md

Worktree: .claude/worktrees/tutor-rounds (branch tutor-rounds)
Branch base (merge-base with origin/main at start): 51e8e9f4
Start HEAD: 47be7c03
Spec: the plan is self-contained; its evidence base is five live prod sessions (listed in the plan header). No separate spec doc — rulings are made against the plan text and the session evidence.

## Pre-flight conflict scan (run before Task 1)

### Shared-file / shared-interface pairs

| Tasks | Shared surface | What one produces vs the other consumes | Finding |
|---|---|---|---|
| 1 → 2 | `false-assertion-check.ts`, `test-false-assertion.ts` | T1 changes the extraction regex; T2 adds an optional `choices` arg to the same function | Clean — sequential, different lines. T2's tests depend on T1's `matchAll` change being in place. |
| 1,2 → 3 | false-assertion kill branch (`VoiceTutorRealtime.tsx` ~10871-10897) | T3 edits the `else` branch's `reason` string | Clean — T3 touches the rejection text, T1/T2 touch the detector. |
| 3 → 4 | `VoiceTutorRealtime.tsx` | T3 at ~10890 (kill branch), T4 at ~11705 (tool funnel) | Clean — different sites. |
| 5 → 6,7,8 | `spoken-numbers.ts` (`spokenNumbersToDigits`) | T5 produces; T6/T7/T8 consume | Clean — plan mandates T5 first; ordering is sequential. |
| 6 → 7 | `TUTOR_SPOKEN_NUMBER_GUARDS` | T6 defines the flag; T7's call site reads it | Clean — sequential. |
| 3,4,6,8,9,10,11,12,13 | `orchestrator/flags.ts` | Nine flags appended in task order | Clean — plan gives each an explicit append anchor (T3→T4→T6→T8→T9→T10→T11→T12→T13); verified the chain has no gaps. |
| 3,4,8,10,11 | `EMBED_DEBUG_EVENT_PREFIXES` (`embed/page.tsx`) | Each adds one exact event name | Clean — additive, distinct names. |
| **12 ↔ 13** | `embed/page.tsx` save path | **T12 exists to capture telemetry for sessions that never start; T13 blocks every write until the session starts** | **CONFLICT — see Ruling 1.** |
| 12 → 14 | session persistence | T14 409s a stale-id append; T12's flush then has nowhere to write | Real consequence — see Ruling 2. |
| 13 → 14 | doc creation vs append refusal | T13 defers creation, T14 refuses stale appends | Clean — independent conditions. |
| 3 ↔ 7 | verdict-word lists | T3 `VERDICT_WORD_RE` (verdict-preservation.ts), T7 `VERDICT_OPENER` (denied-answer-reversal.ts) | Duplication — see Ruling 3. |

### Per-task self-consistency

| Task | Own text agrees with itself? |
|---|---|
| 1 | Yes — tests reuse the harness's existing `STATEMENT`/`VERIFIED`; new `problemStatement` ends "What is x?" so `ANSWER_VAR_RE` resolves `x`. Regex replayed: all existing suite cases preserved, both live failures fixed. |
| 2 | Yes — the single-letter safety net sits before `extractAnswerVariable`, which is what makes the "no choices" test pass. |
| 3 | Yes — module exports exactly what the test imports (`hasVerdictOpener`, `VERDICT_REPLANT_CLAUSE`); replayed 11/11. |
| 4 | Yes — but carries a ⚠️ instructing the implementer to confirm `continue` targets the tool loop. Correct: that is a real uncertainty the implementer must resolve at the file. |
| 5 | Yes — replayed 19/19 including the fail-closed determiner cases. |
| 6 | Yes — replayed; both mixed-operator false-kill regressions confirmed `ok`. Harness names corrected to the on-disk `test-arithmetic-claim-check.ts` / `test:arith-claim`. |
| 7 | Yes — reads correctly against the shipped module (the `\b12\b` early-return was verified by reading `checkDeniedAnswerReversal`). |
| 8 | Step 3's code as written does NOT pass Step 4's first test; the plan flags this and gives the connector rule as a required addition. **Verified before dispatch: with the connector rule and the real T5 normalizer, all 8 test cases pass.** Not a defect — the instruction is correct and now proven. |
| 9,10,11 | Yes — replayed 28/28 across the three modules. |
| 12 | Yes internally; conflicts with 13 (Ruling 1). |
| 13 | Internally consistent, but its latch is wrong (Ruling 1). Carries a ⚠️ to verify `evelyn:session-started` timing — Ruling 1 supersedes it. |
| 14 | Yes — thresholds and fail-closed cases are coherent. |

## Rulings

**Ruling 1 (T12 ↔ T13, load-bearing, made pre-flight).** T13 as written latches on `evelyn:session-started`, so a load where the student TRIED to start and it failed writes nothing — destroying exactly the diagnostic case T12 was built for, and the case all three dead-start sessions represent (loads 1 and 2 were the same module 9s apart = a retry, not navigation). **Decision: T13's latch is the first `start_tap` event, not `evelyn:session-started`.** A load with no tap = navigation, no row (T13's intent preserved). A tap that never became a session = a row with its telemetry (T12's intent preserved). `start_tap` fires on EVERY tap — that is exactly what the 2026-08-17 round added it for. T12's early-flush window is likewise measured from the first tap, not from mount; the backlog slice sends the pre-tap `perception_state`/`shared_mic` events with the first flush anyway. **Cost if wrong:** a student who taps once and leaves still mints a row, so the empty-row noise T13 removes is reduced rather than eliminated. That is the correct direction — a tap is intent.

**Ruling 2 (T14 data loss, made pre-flight).** After T14, a partner-reused session id produces NO record at all rather than corrupting an older document — the Sep-4 five-minute session that landed in `portal-85b2c632` would have been refused and lost. **Decision: ship T14 as written (refuse + 409 + loud log).** The alternative already loses the data (merged into an unattributable three-day document), and the loud log is the artifact that gets crimsora to fix the minting. **Cost if wrong:** a real session's transcript is lost instead of mis-filed. Follow-up worth considering next round: write to a derived id (`<id>#<date>`) to preserve the data without corrupting the original — needs partner coordination, out of scope here.

**Ruling 3 (T3/T7 verdict-word duplication, made pre-flight).** Two verdict-word lists will exist in two modules. **Decision: keep them separate.** They answer different questions — T3's asks "did this turn grade at all" over the opening two sentences; T7's matches an opener immediately followed by a specific value. Merging them couples two independent guards so that tuning one changes the other's kill behaviour. **Cost if wrong:** the two lists drift. Acceptable — each is pinned by its own tests. If a reviewer raises it, this ruling stands.

## Task log

## Environment facts (verified 2026-09-05 before Task 1 — hand these to every implementer)

- Run npm scripts from `apps/tutor/`. `apps/tutor/` has NO `node_modules`; `tsx` resolves from the
  repo-root `node_modules` (v4.23.13, node v23.7.0). **No `npm install` needed — do not run one.**
- `cd apps/tutor && npm run test:false-assertion` → `15 passed, 0 failed` at baseline.
- `cd apps/tutor && npx tsc --noEmit` → clean, **exit 0** at baseline (47be7c03). Any tsc error a
  task produces is that task's.
- `tsc --noEmit` does NOT cover `scripts/` — harnesses are verified by running them.
- `timeout` is not available in this shell (zsh on darwin); don't wrap commands in it.
- The arithmetic harness is `scripts/test-arithmetic-claim-check.ts`, registered as **`test:arith-claim`**
  (the script name does not match the filename).

## Task log

Task 1: implementer DONE (haiku) — commit 93d06cc4, 18/18 passing (15 pre-existing + 3 new); reviewer dispatched (sonnet), BASE 47be7c03
Task 1: review (sonnet) — spec ✅ verbatim, quality Approved; 1 Important (plan-mandated), 2 Minor.
Task 1: **Ruling 4** — the reviewer is right that no added test pins last-match selection: with the new
  boundary, test 3's `2x = 26` is excluded before the match array, so all three tests yield <=1 match and
  `all[all.length-1]` vs `all[0]` is unprotected. My own pre-flight replay showed `old=26 newLast=13` and I
  misread it as proving selection when it proved the boundary. Decision: FIX — add a two-assertion test.
  Load-bearing because Tasks 2 and 3 build on this same function and a silent revert to first-match would
  restore the production kill. Verified before dispatch: the reviewer's literal suggestion
  `"x = 5, no wait, x = 8."` yields only ONE match (trailing-period lookahead) and would NOT pin it;
  `"$x = 5$, no wait, $x = 8$."` yields ["5","8"]. Cost if wrong: one extra test.
Task 1: Minor (deferred): indentation of the third new test block's closing `});` is 2 spaces off (cosmetic, verbatim from brief).
Task 1: Minor (deferred): implementer report overstated test 3's coverage ("judges only the terminal value").
Task 1: fix round 1/5 — implementer added the two-direction selection pin + indent fix; 20/20 passing
  (commits 93d06cc4..122c80b0). Scoped re-review dispatched (haiku), FIX_BASE 93d06cc4.
Task 1: re-review (haiku) — Finding 1 ADDRESSED, Finding 2 ADDRESSED, no new breakage, false-assertion-check.ts untouched, output pristine.
Task 1: complete (commits 47be7c03..122c80b0, review clean)
Task 2: implementer DONE (haiku) — commit 5c5d67d5, RED 21/24 → GREEN 24/24; reviewer dispatched (sonnet), BASE 122c80b0
Task 2: review (sonnet) — spec ✅, quality Needs fixes; 1 Important, 2 Minor.
Task 2: **Ruling 5** — reviewer is right that the single-letter safety net (`false-assertion-check.ts:147`)
  fires BEFORE the choices passthrough, so all three MCQ tests are intercepted and the passthrough is
  untested. I checked further: with letters-only choice objects it is not merely untested but nearly
  unreachable — `resolveMcqLetter` resolves the expected side only for bare-letter or "(C)"/"Choice C"
  shapes, and the safety net already covers the bare letter. Verified empirically by running the real
  module across four verified shapes: ONLY `"C)"` discriminates (withChoices=ok, withoutChoices=
  false_assertion — i.e. without the passthrough that shape is a real FALSE KILL). Decision: FIX — add the
  `"C)"` test in both directions, and correct the comment that misattributes the coverage-cost test's `ok`
  to the resolveMcqLetter path when the safety net actually produced it. Load-bearing: an untested,
  near-inert passthrough would be silently deleted by a future cleanup, restoring the false kill for that
  shape. Cost if wrong: one extra test and a comment.
Task 2: reviewer ⚠️ (commit trailers) — RESOLVED by controller: `git log -1 --format=%B 5c5d67d5` shows both
  Co-Authored-By and Claude-Session trailers present. Not a finding.
Task 2: fix round 1/5 — passthrough pin ('C)' both directions) + both comment corrections; 26/26 passing,
  tsc clean (commits 5c5d67d5..7a07ee0b). Scoped re-review dispatched (haiku), FIX_BASE 5c5d67d5.
Task 2: re-review (haiku) — F1 ADDRESSED (pair genuinely discriminates), F2 ADDRESSED, F3 reported
  ADDRESSED but MIS-VERIFIED by the re-reviewer: it cited test-false-assertion.ts:44-48, whereas F3 was
  about the module comment. Controller checked false-assertion-check.ts:84-87 directly — it still reads
  "a bare single letter is an MCQ key" as fact, with no caveat. No behavioural change to the module; 26/26; output pristine.
Task 2: **Ruling 6** — F3 is a Minor and Minors never enter the fix loop. Decision: PARK, do not spend a
  round on a comment. The approximation IS now documented (in the test file), so the intent is captured;
  only its placement is wrong. Flagged to the final whole-branch review to triage.
  Cost if wrong: a module comment overstates its own precondition. Also noted: this re-reviewer verified a
  finding against the wrong file — weigh its verdicts accordingly on later tasks.
Task 2: minor (deferred): false-assertion-check.ts:84-87 safety-net comment states the single-letter
  assumption as fact; the accepted-approximation caveat sits in the test file instead.
Task 2: complete (commits 122c80b0..7a07ee0b, 1 parked)
Task 3: implementer DONE (haiku) — commit 95a6cefb; test:verdict-preservation 13/13, test:false-assertion 26/26 preserved, tsc clean. Controller pre-checked: flag is NEXT_PUBLIC_-prefixed + default-ON, verdict_replant_requested registered in EMBED_DEBUG_EVENT_PREFIXES. Reviewer dispatched (sonnet), BASE 7a07ee0b
Task 3: review (sonnet) — spec ✅ verbatim, quality APPROVED, 0 Critical, 0 Important, 3 Minor.
  Reviewer verified the two named hard risks by direct inspection: wiring landed in the correct `else`
  branch (stale-anchor sibling still advisory-only), and Tasks 1/2 files are byte-identical to base.
Task 3: minor (deferred): 'verdict_replant_requested' in EMBED_DEBUG_EVENT_PREFIXES is redundant — the
  pre-existing 'verdict_' prefix already matches it under startsWith. Harmless, brief-mandated.
Task 3: minor (deferred): the wiring-site ternary (carriedVerdict ? CLAUSE : '') is pinned only indirectly,
  via the boolean it consumes. Matches project convention (sibling detectors are pure-module-tested only).
Task 3: minor (deferred): VERDICT_WORD_RE includes common prose words (right/close/almost) that could set
  carriedVerdict on ordinary transitions. Direction of error is safe — it only appends an advisory clause
  to an already-firing kill, never creates one.
Task 3: complete (commits 7a07ee0b..95a6cefb, review clean)

## OVERNIGHT AUTHORIZATION (Praveen, before bed, 2026-09-05)
Chose option 2: finish all tasks + reviews, merge origin/main, run the full gate, and **IF THE GATE IS
FULLY GREEN**: run ./deploy-tutor.sh and push tutor-rounds:main per Rule 16 (merge -> gate -> deploy ->
push). Announce before/after here. If ANY gate step is red, DO NOT deploy and DO NOT push — leave the
branch green-pending and report. Live voice verification is Praveen's, on waking.

Task 4: implementer DONE (sonnet) — commit b51611dc; test:kill-scope 13/13, false-assertion 26/26, verdict-preservation 13/13, embed-debug-coverage 6/6, tsc clean. Implementer verified the `continue` targets the per-SSE-line loop `for (const line of block.split("\n"))` @10552, NOT a sentence loop; no if-wrapper needed. Reviewer dispatched (sonnet) with that as the named focus. BASE 95a6cefb
Task 4: review (sonnet) — spec ✅ verbatim, quality APPROVED, 0 Critical, 0 Important, 1 Minor.
  Reviewer independently verified THE risk by tracing brace depth from the loop header: enclosing loop is
  `for (const line of block.split('\n'))` @10554, body closes @12817, NO nested for/while between it and
  the insertion point @11733. It then enumerated everything after the insertion point (which the
  implementer's report did NOT do): only name-gated `if (name === ...)` blocks plus the single
  unconditional dispatch at 12530 — i.e. exactly the thing that must not run for a withheld tool. No
  universal counter, buffer flush or state update is skipped. `continue` is safe; no if-wrapper needed.
Task 4: DOCUMENTED CONSEQUENCE (reviewer-named, judged correct, not a defect): a withheld `advance_lesson`
  is also absent from `totalToolNamesSeen`, so stream-end logic (`skipNoAdvanceAtStreamEnd` @12844) treats
  it as never having happened, and the gate-open + `renderCountAtAdvance` snapshot don't fire either.
  Internally consistent with intent (the advance did not really occur). Recorded because it is a wider
  blast radius than "just the tool dispatch" and a future round should know.
Task 4: minor (deferred): task-4-report.md's continue-verification establishes loop identity but stops
  short of enumerating what the continue discards — conclusion right, reasoning incomplete.
Task 4: complete (commits 95a6cefb..b51611dc, review clean)
Task 5: dispatched (haiku — complete verified code in brief), BASE b51611dc
Task 5: implementer DONE (haiku) — commit fb8fe3a2, 18/18 passing, tsc clean.
Task 5: **Ruling 7 (plan defect, found by the test)** — the implementer deviated from the brief's verbatim
  module source, adding leading-"and" preservation. Controller verified this is CORRECT and not a
  deviation to reject: all 18 test NAMES and all 18 expected OUTPUT strings in the committed test file are
  byte-identical to the plan's, so no expectation was bent to fit the code. The plan's module source had a
  real bug — a LEADING "and" before a number run ("…is 24, and twenty-four over two…") was swallowed by
  parseRun's `filter(t => t !== 'and')`, because the trailing-and strip I wrote only handles a TRAILING
  one. The brief's own expected string (taken from the verified prototype output) exercised it, the test
  went red, and the implementer fixed the code — TDD working as designed. Cost if wrong: nil; the
  "hundreds with and" case (internal and, must be consumed → '144') still passes, so both directions hold.
Task 5: NOTE — my brief's Step 4 said "all 19 checks"; the actual specified count is 18. My miscount, not a
  dropped test. Verified by counting eq() calls in the committed file.
Task 5: reviewer dispatched (sonnet) with the module deviation as a named focus. BASE b51611dc
Task 5: review (sonnet) — spec ✅, contract/purity/fail-closed points all correct; quality Needs fixes:
  1 Important, 2 Minor. The Important is in the implementer's OWN added logic (not the adjudicated
  deviation): `spoken-numbers.ts:67` guards the leading-`and` strip on `!/hundred/i.test(core)`, testing
  the WHOLE run, so a leading prose "and" is dropped whenever a hundreds value appears later in the run.
  Controller reproduced it directly: "and one hundred is your answer" -> "100 is your answer";
  "She added ten, and one hundred is what's left." -> "She added 10, 100 is what's left.".
  The guard can never correctly fire (a genuine "N hundred and M" compound never has `and` as the run's
  first token), so the fix is to remove it. Fix round 1 dispatched with 3 covering tests.
Task 5: minor (deferred, INHERITED from the plan not the implementer): mid-run `and` between two
  independent numbers merges them — "twenty and forty" -> "60" — because parseRun filters all `and`
  tokens unconditionally. Explicitly told the implementer NOT to fix it. Worth a comment next round.
Task 5: minor (deferred): no test paired a leading `and` with a `hundred` later in the same run — the
  exact shape the broken guard referenced. Being added in fix round 1.
Task 5: re-review (haiku) — finding ADDRESSED (guard removed @65, comment corrected), all 3 covering tests
  present with the right expectations, deferred Minors respected, no breakage to parseRun/parseShorthand/
  lone-one/trailing-and/export/purity. 21/21, tsc clean, output pristine.
Task 5: controller ALSO verified independently: ran 7 shapes against the built module — all pass, incl. the
  discriminating mixed case "and one hundred and forty-four" -> "and 144".
Task 5: complete (commits b51611dc..b3df9ed9, review clean)
Task 6: implementer DONE (haiku) — commit fda93160; 87 arith checks + 21 spoken-numbers, tsc clean; both mixed-operator false-kill regressions confirmed at RED and GREEN. Controller independently re-verified 9 shapes incl. the live 451.1s sentence (now false_assertion), both mixed-op regressions (ok), and binary no-opts behaviour (unchanged). Reviewer dispatched (sonnet). BASE b3df9ed9
Task 6: review (sonnet) — spec ✅, quality APPROVED, 0 Critical, 0 Important, 4 Minor. Reviewer traced the
  \2 backreference through BOTH the chain path and the binary fallback for each mixed-operator regression
  (CHAIN_RE never matches; CLAIM_RE's pre-existing CONTEXT_OPS check also skips the fragment) — inert by
  construction, not merely test-asserted. Also hand-probed the chain's false_denial branch: correct both ways.
Task 6: minor (deferred): chain matcher's false_denial branch (arithmetic-claim-check.ts:80-83) has ZERO
  regression coverage — verified correct by probe, but a future edit could break it silently.
Task 6: minor (deferred): flag TUTOR_SPOKEN_NUMBER_GUARDS landed at end-of-file (flags.ts:648) instead of
  after the Task 4 flag as the brief said. Flat export list — no functional effect; my append-chain
  instruction was not followed but nothing depends on ordering.
Task 6: minor (deferred): extra section-header comment added to the test file beyond the verbatim block.
Task 6: minor (deferred): chain uses exact equality (fmt===fmt) with no rounding tolerance, unlike the
  binary path's roundedEqual — asymmetry if decimal-operand chains ever reach this guard.
Task 6: complete (commits b3df9ed9..fda93160, review clean)
Task 7: implementer DONE (haiku) — commit 0e02069b; denied-answer-reversal 21, spoken-numbers 21, arith-claim 87, tsc clean; 3 fail-closed cases ok at RED and GREEN. Controller re-verified 7 shapes independently incl. an extra mid-sentence-mention case (ok). Reviewer dispatched (sonnet). BASE fda93160
Task 7: review (sonnet) — spec ❌ / quality Needs fixes: 1 CRITICAL (plan-mandated), 2 Minor.
Task 7: **Ruling 8 (CRITICAL plan defect, mine)** — the verdict-opener alternative I wrote into the brief
  causes FALSE REVERSALS on ordinary teaching speech. I anchored the OPENER at sentence start but never
  constrained what follows the VALUE, and the opener->value gap `[\s.,!—-]*` admits only punctuation, so
  any sentence opening with a bare verdict word and mentioning the stashed number a few tokens later fires.
  Controller REPRODUCED all 5 of the reviewer's cases against the built module — 5/5 false `reversal`:
    "Right, 12 is a common denominator here…" / "Yes, 12 of the 15 students…" / "Nice, 12 minutes left…"
    / "Correct, 12 is divisible by 3 and 4." / "Right, twelve of the fifteen apples were rotten…"
  Decision: FIX, and fix it properly rather than narrowing the opener word list (the reviewer correctly
  noted the word list is not the real cause). The true signal is what FOLLOWS the value: in a genuine
  reversal the value TERMINATES the opening clause ("Right. Twelve — …"); in the false cases a predicate
  follows it ("12 is a common denominator"). `normalize()` strips the em-dash that carries this signal, so
  the opener check must run against a LIGHT normalization that preserves dashes and terminators.
  Controller prototyped and verified the corrected shape across 11 cases — 11/11 correct: live reversal
  and digit form still fire, all 5 false reversals eliminated, both fail-closed cases still ok.
  ACCEPTED COST: "Exactly. Twelve it is." no longer fires (a real reversal, now missed). Correct trade —
  guards must fail closed; a miss is acceptable, a false kill is not.
  Cost if wrong: some genuine cross-turn reversals go unflagged; the judge still sees them.
Task 7: minor (deferred): em-dash in the separator class `[\s.,!—-]*` is dead code under normalize().
Task 7: minor (deferred): VERDICT_OPENER contains bare common words (yes/right/nice) with no
  minimum-specificity requirement — contributing cause, not root cause.
Task 7: re-review (sonnet) — CRITICAL ADDRESSED. Old alternative fully removed from `assertion`; opener
  shape now standalone in OPENER_SHAPE_RE @85-86 tested against normalizeForOpener @118 (called exactly
  once, normalize() unchanged elsewhere); 3 reversal + 5 false-positive-regression tests present; the
  "Exactly. Twelve it is." expectation flipped to ok WITH the accepted-miss comment; stash normalization,
  containment test and negation guard all confirmed untouched. 28/28. No functional breakage.
Task 7: controller ALSO verified 12 shapes independently against the built module — all 5 former false
  reversals now ok, all 3 reversal forms fire, all 3 fail-closed cases ok, prose shape still fires.
Task 7: minor (deferred): the `assertion` regex's 'i' flag was dropped alongside the removed alternative —
  inert (normalize() lowercases both sides) but unrequested and unexplained.
Task 7: minor (deferred): opener-reversal detection is now gated on normalizeSpokenWords, so flipping
  TUTOR_SPOKEN_NUMBER_GUARDS off would ALSO disable opener-reversal detection, not just word conversion.
  Inert today (flag default ON) but a surprising coupling if that switch is ever used.
Task 7: minor (deferred): "Right, 12: that's the answer." (colon tail) is a silent miss — consistent with
  the fail-closed philosophy, adjacent to the accepted "Exactly. Twelve it is." miss.
Task 7: minor (deferred): normalizeForOpener's doc comment says normalize() "strips dashes"; it actually
  preserves ASCII '-' and strips em/en-dashes and !/? — practical point right, parenthetical imprecise.
Task 7: complete (commits fda93160..95dbe7d4, review clean)
Task 8: implementer DONE (haiku) — commit 4383d7c5; board-contradiction 8/8, spoken-numbers 21, arith-claim 87, denied-answer-reversal 28, tsc clean. Controller verified ADVISORY-ONLY by grepping the wiring diff (0 performKill, 0 rejection pushes) and re-verified all 8 detection shapes independently. Reviewer dispatched (sonnet). BASE 95dbe7d4
Task 8: review (sonnet) — spec ✅ byte-exact, advisory-only CONFIRMED, EQN_RE not loosened; quality
  Approved but with 2 Important + 1 Minor, so the fix loop triggers.
Task 8: **Ruling 9** — Important #1 (unanchored `is|gives|equals` in MY connector rule) is real and cheap:
  the reviewer could not construct an exploit because EQN_RE's adjacency absorbs it, but a detector
  documented "fail closed" must not depend on a downstream regex to compensate for an upstream one, and
  this detector is a candidate for promotion to KILL after one clean live session — at which point the
  looseness stops being free. Decision: FIX (add \b). Controller verified before dispatch: unanchored,
  flatten mangles "This is history" -> "Th = = h = tory"; with \b it yields "This = history", and all 8
  brief cases still pass either way. Cost if wrong: nil, it strictly narrows matching.
Task 8: **Ruling 10** — Important #2 (`\btimes\b` -> `*` conflates multiplication with a repetition count,
  e.g. "flip it 3 times, 4 times, 5 times") is PARKED, not fixed. It is already word-anchored; the defect
  is semantic, not lexical, and distinguishing the two needs context this pure module does not have. It is
  inherited verbatim from my brief, the reviewer could not exploit it, and the feature ships ADVISORY so
  the worst case is a noisy debug event. Cost if wrong: a spurious board_contradiction event in a session
  that says "times" as a count. **Carry this into the promotion decision — it must be resolved BEFORE this
  detector is ever allowed to kill.**
Task 8: minor (deferred): no regression test covers the is-as-substring or times-as-count shapes.
Task 8: re-review (haiku) — Important #1 ADDRESSED (\b on both ends of the alternation @57), regression
  test present and meaningful (proves only the CONNECTOR "is" rewrites, not the one inside "history"),
  parked `times` rule confirmed unchanged with no special case, no breakage: EQN_RE / flag / export /
  wiring all untouched, advisory-only intact. 9/9, tsc clean.
Task 8: complete (commits 95dbe7d4..144566f1, 1 parked [Ruling 10])
=== PHASE B COMPLETE (Tasks 5-8). Phase A complete (1-4). ===
Task 9: dispatched (haiku), BASE 144566f1
Task 9: **Ruling 11 (CRITICAL plan defect, mine — caught by controller pre-review)** — the live component's
  meta-narration filter had FOUR regexes, not the two my brief's module source contained. The implementer
  followed the brief's shape (2 phrase regexes) and SILENTLY DROPPED TWO WHOLE LEAK CLASSES:
    (3) /\bthe student\b|\bno verdict\b|\bisn'?t (?:quite )?an answer\b|\bnot an answer\b|\bmy (?:last|
        earlier|previous) correction\b|\bmy correction was\b|\bnothing to walk back\b|\bno correction
        (?:is )?needed\b|\brequest pattern\b|\bclassify (?:away|silently)\b|\bgive (?:her|him|them)
        (?:room|space)\b|\bautomated review\b/i
    (4) /^\s*i need to check\b|\blet me compute:\s|\bmy (?:prior|previous|last) turn\b|\bmy ["'""]?not
        quite["'""]? was\b/i   (added 2026-08-31, Haiku observation round)
  This is a REGRESSION IN THE WRONG DIRECTION: internal narration these caught would now reach students.
  ⚠️ Regex (3) is very likely what caught the 1254.7s live leak in portal-704e3e01 ("No verdict word …
  not an answer at…") — the exact incident this task cites. My brief gave conflicting instructions
  ("copy verbatim from the source file" AND a 2-regex module source); the implementer followed the source
  I wrote rather than the file. My defect, not theirs.
  Decision: FIX — restore both regexes verbatim, preserve regex (4)'s explanatory comment (the
  "compute:" colon is load-bearing), and add tests pinning both. Cost if wrong: nil; it restores
  pre-existing behaviour.
Task 9: review (sonnet) — spec ❌ / Needs fixes: 1 CRITICAL, 1 Important, 1 Minor.
Task 9: **Ruling 12 (CRITICAL, my regex)** — MARKUP_RE silently DROPS legitimate teaching sentences with
  two unspaced variable comparisons: "<n and n>" is structurally a valid tag (letter after '<', then a
  space-attribute run, then '>'). Controller reproduced: "Since 3<n and n>10 does not hold…",
  "x<y is bigger, so y>2 too.", "We need a<b and later on c>d to hold." — all three DROPPED. That is
  silent content loss to the student, the same failure this task fixes, in the other direction.
  Decision: FIX by requiring an '=' inside the attribute section:
    /<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s[^<>]*=[^<>]*)?>/
  Rationale: the real leak shapes are either attribute-free (<result>, </result>, <thinking>) or carry a
  genuine attribute (<span style="opacity:0">), whereas prose-between-angle-brackets never contains '='.
  Controller verified all 10 shapes: 3 false-drops now survive, all 4 leak shapes still dropped, spaced
  inequalities and LaTeX unaffected. Cost if wrong: an attribute-free markup leak with prose+'=' inside
  would slip — no such shape observed.
Task 9: **Ruling 13** — the "curly quotes" regression test does NOT contain curly quotes: both it and its
  sibling use ASCII 0x22, so SELF_AUDIT_RE's U+201C/U+201D class members are unexercised and could be
  dropped again undetected. Root cause is MY message channel mangling curly characters (it also caused
  fix round 2). Decision: FIX using “/” ESCAPE SEQUENCES rather than literal characters, which
  is transmission-safe. Cost if wrong: nil.
Task 9: minor -> folded into round 3: the retained provenance comment block had every ASCII quote silently
  converted to curly by a blanket smart-quote pass — a mutation of code the brief said to preserve.
  Comment-only, no semantic effect, but the same imprecise mechanism produced Ruling 13's defect.
Task 9: re-review round 3 (haiku) — Finding 1 (CRITICAL MARKUP_RE false-drops) ADDRESSED, all three new
  tests assert the SURVIVE direction (!isMetaNarration) and the comment explains the '=' requirement.
  Finding 2 (curly-quote coverage) ADDRESSED — two distinguishable tests, one genuinely carrying
  U+201C/U+201D. Finding 3 (comment restoration) NOT ADDRESSED: "Generic patterns only — no subject
  content." is duplicated at VoiceTutorRealtime.tsx:11210-11211.
Task 9: **Ruling 14** — Finding 3 is a cosmetic comment duplication, originally classed Minor, and Minors
  do not enter the fix loop. Spending a 4th dispatch+re-review cycle on one duplicated comment line is
  not proportionate. But controller fixes are forbidden, and Task 10 edits the SAME file — so the
  one-line deletion is FOLDED INTO TASK 10's dispatch instead. Cost if wrong: a duplicated comment
  survives one more task; the final whole-branch review sees it either way.
Task 9: complete (commits 144566f1..5eb293d3, 1 carried into Task 10)
Task 10: dispatched (haiku), BASE 5eb293d3 — carries the Task 9 comment cleanup
Task 10: review (sonnet) — spec ✅ byte-identical, quality APPROVED, 0 Critical, 0 Important, 2 Minor.
  Reviewer traced ALL FIVE branches' fall-through in the real file (not just the diff): none drops the
  tool call; the brain's own show_problem reaches the dispatcher in every skip case, and the downstream
  `if (name === 'show_segment_card')` block is correctly skipped. Confirmed detectAnotherProblemRequest
  uses the identical reverse-scan idiom as the pre-existing call site @12680. Flag correctly gates ONLY
  the two new conditions, so the kill switch reverts the new behaviour and not the whole mechanism.
  Carried Task 9 comment cleanup verified done.
Task 10: minor (deferred): commit body adds a paragraph beyond the brief's exact message (documents the
  carried cleanup — accurate, improves traceability).
Task 10: minor (deferred): tests pin only `targets-diverge` outranking `segment-complete`; precedence of
  the other pre-existing reasons over the new ones, and between the two new ones, is unpinned. Inherent
  to the brief's exact test content, not an implementer shortcut.
Task 10: complete (commits 5eb293d3..380ce13f, review clean)
Task 11: implementer DONE (haiku) — commit 475b25ed; test:page-title 11, prior suites green, tsc clean. Controller verified BOTH wiring sites present (slice(0,70) gone; retitleFromBatch @6700) and ran the live case: retitled=true, stage prefix kept, names the rendered problem, no churn when the authored card renders, truncation leaves no dangling operator. Reviewer dispatched (sonnet). BASE 380ce13f
Task 11: review (sonnet) — spec ✅ verbatim; title-consistency risk CLOSED (one `pageTitle` local feeds
  the synthetic newPage, openPage, setCurrentPage, the log and the flushed event — no divergence);
  truncation correctly NOT gated behind the retitle flag. Quality Needs fixes: 2 Important, 1 Minor.
Task 11: **Ruling 15** — Important #1 is real and I reproduced it: `comparable()` strips [\s$\\{}] but NOT
  the ellipsis that `truncatePageTitle` appends, so ANY authored title long enough to be truncated (the
  common case — the original bug's own title was) fails the containment check and fires a spurious
  retitle even when the identical authored card renders. Probe: deferred
  "Try: Solve for x and show each step of your working clearly: 2(x…" vs the same authored statement ->
  retitled=true (want false). Breaks the brief's explicit "must NOT retitle when the authored card
  renders" invariant and emits false auto_newpage_retitled_from_render telemetry a later triage would
  trust. Decision: FIX by adding the ellipsis to comparable()'s strip class. Verified across 3 shapes:
  truncated-same -> false, short-same -> false, LIVE substitution -> still true. Cost if wrong: nil.
Task 11: **Ruling 16** — Important #2 (`processed.find` takes the FIRST showProblem, not the last) is
  brief-mandated and the reviewer could not rule out a multi-showProblem batch. Decision: FIX to
  last-match. One line, strictly safer, identical when a batch holds exactly one showProblem — costs
  nothing if the invariant holds and prevents a within-flush repeat of this very bug if it does not.
  Cost if wrong: nil.
Task 11: re-review (haiku) — both Important findings ADDRESSED (ellipsis stripped in comparable() with an
  accurate comment; last-match wiring with its rationale). Both new tests correctly directed, and the
  reworded-limit test carries a comment marking it a deliberate accepted limitation. No collapse risk
  from stripping the ellipsis. Title-consistency wiring, flag and event names all untouched. 13/13.
Task 11: complete (commits 380ce13f..8071e882, review clean)
=== PHASE C COMPLETE (Tasks 9-11). Phases A (1-4) and B (5-8) complete. ===
Task 12: dispatched (sonnet — Ruling 1 changes the brief's latch), BASE 8071e882
Task 12: implementer DONE (sonnet) — commit 149bb2dc; flush-policy 8/8 + earlier suites green, tsc clean.
  Ruling 1 applied: early-flush window is tap-relative. Latch = `addDebugEvent` in embed/page.tsx keying
  on type === 'start_tap'. Controller verified the latch sits BEFORE the EMBED_DEBUG_EVENT_PREFIXES
  filter (embed/page.tsx:502-505), so it fires even if start_tap were dropped from the allowlist.
  Controller verified the IDEMPOTENCY claim against the server route: transcript + whiteboardCommands go
  into `$set` (full replacement, idempotent); debugEvents are `$push`/`$each` BUT the client sends only
  the unsent delta and advances lastSavedDebugCountRef synchronously, returning {} when the delta is
  empty — so a second 'abandoned' call cannot double-append. No didFinalSaveRef latch needed.
  Reviewer dispatched (sonnet). BASE 8071e882
Task 12: review (sonnet) — spec ✅ (as amended by Ruling 1), quality APPROVED, 0 Critical, 0 Important,
  3 Minor. Reviewer independently traced start_tap's emission (VoiceTutorRealtime.tsx:19205-19225) and
  confirmed it fires unconditionally on EVERY tap, including the dead-tap `tapAction === 'none'` case —
  so the latch genuinely captures "tried to start and it failed", which is what Ruling 1 requires.
  Also confirmed `eventCount` is cumulative, so pre-tap mount events (perception_state, shared_mic) ride
  along in the first post-tap flush — the original diagnostic data is preserved, just gated on a tap.
  Null-guard before the tap-relative subtraction is explicit (page.tsx:222-223), so the Date.now()-null
  trap cannot occur. visibilitychange correctly bound to document; nothing fires on a visible transition.
  Pre-existing 30s interval untouched and separate.
Task 12: minor (deferred): cleanup removes pagehide/visibilitychange unconditionally even when the flag
  gated them out of being added (harmless no-op removal, asymmetric style).
Task 12: minor (deferred): the 2s poller keeps ticking as a no-op after the 10s window closes rather than
  self-cancelling (zero traffic cost; shape inherited from the brief).
Task 12: minor (deferred): no wiring-level test for the tap latch / no-tap guard / flag-off fallback —
  only the pure module is tested. Consistent with the brief's scope and codebase convention.
Task 12: complete (commits 8071e882..149bb2dc, review clean)
Task 13: dispatched (sonnet — Ruling 1 changes the latch), BASE 149bb2dc
Task 13: implementer DONE (sonnet) — commit fb9c903e; tsc clean, flush-policy 8, page-title 13,
  false-assertion 26. Reused Task 12's firstStartTapAtRef per Ruling 1 (brief's Step 2 deliberately
  skipped — no second latch, no evelyn:session-started listener).
Task 13: **PLAN GAP FOUND BY THE IMPLEMENTER (credit where due)** — `emitProgress` performs its OWN
  independent session-usage write, unreachable through saveSession, and fires on mount whenever the
  partner config sets `curriculum_module` (plan-preload path, VoiceTutorRealtime.tsx:8483). My brief
  gated only saveSession, so a partner sending curriculum_module would have kept minting a row per page
  load and the task would have silently achieved nothing for exactly the crimsora sessions in evidence.
  Implementer applied the identical gate there. Controller verified: gates at page.tsx:629 (covers every
  write inside saveSession, lines 620-750) and :858 (covers emitProgress's write at :864); the only other
  session-usage reference, :535, is a GET (resume read), correctly ungated.
Task 13: reviewer dispatched (sonnet). BASE 149bb2dc
Task 13: review (sonnet) — spec ❌ / Needs fixes: 1 CRITICAL, 1 Minor. The emitProgress gap-fix and the
  gate placement are sound; the write-path audit is complete and correct.
Task 13: **Ruling 17 (CRITICAL — my Ruling 1 traded one gap for another)** — `start_tap` is emitted from
  EXACTLY ONE site (VoiceTutorRealtime.tsx:19226, inside handleMicClick). The "Continue lesson" overlay
  (TutorSession.tsx:676) calls `resumeContinue()` DIRECTLY, and resumeContinue contains zero start_tap
  emissions — controller verified both by grep. So a session resumed via that button sets hasStarted,
  unlocks audio and dispatches a real brain turn, but never latches firstStartTapAtRef: every gated write
  (30s interval, early-flush poller, final completed/abandoned save, every emitProgress checkpoint) stays
  shut for the whole session. A REAL resumed session with transcript and cost would persist NOTHING.
  ⚠️ Honest note: `resumeContinue` DOES call `onSessionStarted?.()`, so the brief's ORIGINAL
  `evelyn:session-started` latch would have caught this path. Ruling 1 fixed the dead-tap case and opened
  the resume case. The correct latch is BOTH signals, not either alone:
    - dead tap        -> start_tap fires, session-started does not
    - overlay resume  -> session-started fires, start_tap does not
    - normal start    -> both fire
  Controller verified both signals reach embed/page.tsx (start_tap via addDebugEvent:502; session-started
  via the window listener at :983). Decision: latch on EITHER. Cost if wrong: a load that neither taps nor
  starts still mints no row — unchanged.
Task 13: minor -> folded into the fix: the 3-line gate is duplicated verbatim at :629 and :858; extract a
  single helper so the latch has one definition.
Task 13: re-review round 1 (sonnet) — CRITICAL **NOT ADDRESSED**. The listener wiring is correct, but the
  `evelyn:session-started` event is NEVER DISPATCHED on the resume path: TutorSession.tsx:385 seeds
  `sessionStartedDispatchedRef = useRef(Boolean(resumeState))` — i.e. TRUE whenever resuming — and the
  dispatch at :1278-1289 is guarded on it. Controller verified both lines directly.
Task 13: **Ruling 18 (my Ruling 17 was ALSO insufficient)** — I checked that the session-started LISTENER
  existed but never checked that the event actually DISPATCHES on resume. It does not. So both latches
  fail on the resume path and the Critical bug was still live after fix round 1.
  The correct fix is the one the FIRST reviewer proposed and I passed over: emit `start_tap` from
  `resumeContinue()` itself. Chosen over changing the dispatch guard because that guard carries a
  deliberate reason ("resumed mounts must not re-emit — don't re-anchor the parent's demo clock"), and
  touching it would alter the parent-frame postMessage contract for a telemetry fix.
  ⚠️ KEEP the session-started latch from round 1 — the entry-point enumeration shows the gesture-start
  paths (typed first message, agenda pick; VoiceTutorRealtime.tsx:18673, 20365) reach session-started
  ONLY and never tap, so that latch is load-bearing for them. Both latches are needed; neither alone
  covers all four entry points.
  Cost if wrong: a resume emits one extra start_tap debug event — semantically honest (a resume IS a
  start action) and harmless to the allowlist.
Task 13: minor -> folded in: TUTOR_TELEMETRY_SURVIVAL's JSDoc still says the early-flush window is
  measured from start_tap only, now stale given the second latch signal.
Task 13: re-review round 2 (sonnet) — the two named entry points ARE fixed, but the enumeration (the most
  thorough of the three) found a THIRD unclosed path. During `resumeAwaitingFirstTap` the student-tools
  cluster (Draw/Text/Camera, SessionStage.tsx:1119-1185) and a restored try-yourself card are fully
  interactive and gated on nothing. Touching either fires a real, costed brain turn while BOTH latches
  stay untouched: `runGestureSessionStart` calls onSessionStartedRef unconditionally (swallowed by the
  seeded dispatch guard) but gates hasStarted/resumeContinue on `!resumeState`, so start_tap never fires;
  and handleTryYourselfAnswer's marker doesn't even match isStudentBoardAction, so it skips
  runGestureSessionStart entirely yet still dispatches to the brain.
Task 13: **Ruling 19 (stop patching entry points; latch on the invariant)** — three rounds have each
  closed a named path and found another. The reviewer's own deferred observation names the root cause as
  architectural (runGestureSessionStart's split guard). Rather than patch a fourth caller, latch on what
  actually defines a session: **the transcript becoming non-empty**. Every path that costs money produces
  a brain turn, and every brain turn produces transcript — so this closes all present AND future entry
  points without enumerating them.
  Controller verified the precondition that makes this safe: embed `transcript` state starts [] (page.tsx:470)
  and is only ever populated via onTranscriptUpdate from the LIVE session (:1177) — a resume restores
  lesson position, NOT transcript — so a pure page load of a resumable session still has length 0 and
  still mints no row. Cost if wrong: a session whose very first brain turn fails before any transcript
  entry lands would still not latch; the two explicit latches already cover the tap/start cases.
Task 13: also folding in the ref rename (firstStartTapAtRef -> sessionEngagedAtRef) since it now has three
  latch sources and the old name is actively misleading, plus the stale comment at page.tsx:988-990.
Task 13: re-review round 3 (sonnet) — the two named entry points ARE closed by the transcript backstop
  (both traced to onTranscriptUpdate). BUT it disproved MY OWN safety precondition and found a new
  false-latch regression.
Task 13: **Ruling 20 (I claimed a verification I had not actually performed — correcting it)** — I asserted
  "a resume restores lesson position, NOT transcript" after grepping `setTranscript` in embed/page.tsx and
  seeing only `onTranscriptUpdate={setTranscript}`. I never traced WHO CALLS onTranscriptUpdate in the
  engine. VoiceTutorRealtime.tsx:8345-8353 is a mount-time effect keyed on [resumeState] that does
  `transcriptRef.current = [...resumeState.transcript]; onTranscriptUpdate([...])` — unconditionally, with
  no gesture. resume.ts:buildResumeState maps the persisted transcript in. So merely LOADING a resumable
  session latches the transcript backstop at mount, and a preview-and-close then overwrites the real prior
  session's duration/endedAt/status via saveSession('abandoned'). That is the exact hole this task exists
  to close, reopened for resumes — a FALSE POSITIVE where rounds 1-3 fought false negatives.
  ⚠️ Lesson: grepping the consumer proves nothing about the producer. I verified one side of a two-sided
  claim and reported it as verified.
  Decision: keep the backstop but measure it against an EXACT BASELINE. The embed already holds
  `resumeState` in state (page.tsx:549) and it is resolved BEFORE VTR mounts, so the baseline
  `resumeState?.transcript.length ?? 0` is known and race-free. Latch only when transcript.length exceeds
  it. Pure load of a resumable session -> seeded to exactly the baseline -> no latch. Any live turn ->
  exceeds it -> latch. Fresh session -> baseline 0 -> first turn latches.
  Cost if wrong: if a resume seed ever delivered FEWER entries than the checkpoint held, the first live
  turn might not exceed the baseline; bounded by the two explicit latches, which still cover tap/start.
Task 13: fix round 4/5 — escalating per process: FRESH implementer, more capable model (opus).
Task 13: re-review round 4 (sonnet) — CRITICAL ADDRESSED. Baseline/seed equality is not merely equal but
  the SAME OBJECT REFERENCE end to end (resume.ts:52-57 maps 1:1 -> setResumeState -> prop -> prop -> VTR
  seed reads the same object), so divergence is structurally impossible. Reviewer also checked ALL 20
  onTranscriptUpdate call sites in VTR: every one passes the full cumulative transcriptRef, never a delta,
  so a live turn always pushes length strictly above baseline. All four scenarios traced correct. Race
  freedom independently re-verified (no await between setResumeState and setResumeReady). All 4 comment
  sites + 2 flag JSDocs corrected; grepped for residual false claims and bare `transcript.length > 0` in
  the gate — none. Dependency array correct. No new breakage.
Task 13: complete (commits 149bb2dc..28e121f9, review clean after 4 fix rounds)
Task 13: deferred (out of scope, recorded): /tutor/page.tsx has no analogous engagement gate — embed-only
  by design, not a regression.
Task 13: FOLLOW-UP FOR A LATER ROUND (reviewer-identified architectural root cause, deliberately NOT fixed
  here per Ruling 19): runGestureSessionStart's split guard fires onSessionStartedRef unconditionally but
  gates hasStarted/resumeContinue on !resumeState; and SessionStage.tsx's student-tools cluster is not
  gated on awaitingResume, so a student can draw on / upload to a board the brain has not resumed into.
  That is a PRODUCT question, not a telemetry one.
=== PHASE D: Tasks 12, 13 complete. Task 14 remains. ===
Task 14: implementer DONE (sonnet) — commit 849bbc9a; session-id-reuse 10/10 + Phase D suites green, tsc clean. Controller INDEPENDENTLY audited all six session-usage POST callers (embed 742/767/774/780/902, tutor 818): every one ends .catch(() => {}); the lone "status ===" grep hit is the local `status === "abandoned"`, not an HTTP check. 409 is genuinely inert — no log-and-allow fallback needed. Reviewer dispatched (sonnet). BASE 28e121f9
Task 14: review (sonnet) — spec ✅, quality APPROVED, 0 Critical, 1 Important, 2 Minor. Reviewer probed
  the shipped module across 11 boundary cases incl. the exact 12h edge (exclusive, conservative) and all
  four fail-closed shapes; confirmed the 409 leaves the doc untouched (refusal precedes findOneAndUpdate),
  the log carries sessionId + createdAt + partnerId at console.error, the non-stale upsert path is
  byte-identical, and sessionId is a unique index so the added lookup is a point lookup not a scan.
Task 14: **Ruling 21** — the Important (a second Mongo round-trip duplicating the pre-existing
  `TutorSession.exists({ sessionId })` at route.ts:142) is real. Controller checked the blast radius
  before deciding: `isNewSession` feeds ONLY clientIp capture (:143, :149), NOT the demo-grant path, so
  merging the two queries is a safe 3-line change rather than a security-adjacent one. Decision: FIX.
  The saving is small on a local mongod, but shipping a knowingly redundant query to a per-30s endpoint
  when the fix is trivial and the risk is understood is not worth carrying. Cost if wrong: clientIp
  capture regresses on inserts — pinned by having the implementer confirm the derivation is equivalent.
Task 14: folding in the Minor null-safety inconsistency at route.ts:297 (cast without `| null` and
  without `?.` on `existing`, unreachable today but fragile under refactor).
Task 14: re-review (haiku) — both findings ADDRESSED. Equivalence argument sound (findOne always projects
  _id unless excluded, so an existing doc is truthy regardless of createdAt); clientIp flow intact; both
  log sites now derive from one safely-optional-chained `existingCreatedAt`; threshold/409/upsert/module
  all unchanged; no new breakage.
Task 14: deferred observation (already covered): isStaleSessionReuse receives `undefined` when a legacy doc
  has no createdAt and returns false (never refuses) — that is its documented fail-closed contract and is
  pinned by test:session-id-reuse.
Task 14: complete (commits 28e121f9..83ab54b7, review clean)

=== ALL 14 TASKS COMPLETE. Phases A(1-4) B(5-8) C(9-11) D(12-14). ===
Branch: 27 commits over base 47be7c03. Next: whole-branch review -> merge origin/main -> full gate ->
deploy ONLY if fully green -> push. Praveen's overnight authorization is option 2 (deploy if green).

=== FINAL WHOLE-BRANCH REVIEW (opus) — NOT READY. 1 Critical, 3 Important, 4 Minor. ===
Cross-task check found no guard-vs-guard interference (every kill-capable check is gated on
  !attemptKilled and does performKill()+continue, so the first kill wins), Task 3's attemptText has no
  off-by-one, Phase D's three embed edits compose correctly, all 9 flags present/default-ON/NEXT_PUBLIC_,
  all 5 new debug types allowlisted, scope clean.
**Ruling 2 OVERTURNED — my error, confirmed by the controller.** I weighed only "refuse the write" vs
  "corrupt an older document" and never checked whether a multi-day document could be LEGITIMATE. It can:
  RESUME_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000 (30 DAYS) in @evelyn/portal-contract/v1/schemas.ts:416,
  enforced at resume.ts:41 — verified directly. Resume is a first-class documented feature that writes
  back to the SAME sessionId, posting the full merged transcript into $set. So a document spanning three
  days is what a WORKING RESUME produces, not proof of corruption. My 12h refusal would silently destroy
  a resumed student's entire sitting — transcript, whiteboard, cost, and critically the lessonProgress
  CHECKPOINT, so the next resume drops them back to yesterday's position and they redo the work.
  test-session-id-reuse.ts cannot catch this: its "legitimate resume" cases top out at 4h, inside the
  window by construction.
**Ruling 22 (supersedes Ruling 2)** — keep the detection and the loud console.error, DROP the 409 and let
  the write proceed. Ruling 2's own stated value was that the loud log gets the partner's minting fixed;
  the log delivers that with zero data loss. A refusal, if ever wanted, must be gated on a client-supplied
  `resume` discriminator (which exists — config.resume) so only a FRESH sitting on a reused id is refused.
  Cost if wrong: the merged-document condition persists until the partner fixes minting — which was
  always true; we only lose the (harmful) refusal.
FIX WAVE dispatched (one subagent, complete findings list) — Critical #1, Important #2/#3/#4, Minor #5.
  Minors #6 (residual MARKUP_RE false-drop with '=' between brackets), #7 (opener-shape coincidence —
  watch item for the first live session), #8 (msSinceMount param name stale) DEFERRED.
FIX WAVE re-review (sonnet) — ALL FIVE ADDRESSED, no new breakage. Independently re-derived rather than
  trusted: F2's loop-target verified by grep over 10500-12280 (only the per-SSE-line loop at 10585, two
  outer whiles above, none between) and gate 2 @12290 sits after all four rewrite sites and before the
  show_segment_card resolution @12303; no double-emit possible because gate 1 only withholds names
  already in LESSON_STATE_TOOLS and continues immediately. F4's four-path trace found NO loss and NO
  duplication path; lastSavedDebugCountRef is mutated in exactly one place (commitDebugEvents).
  F5 genuinely discriminates (with \b the "4is" boundary fails so no equation forms; without it "is"
  rewrites inside "4is" and manufactures 16+9+9+4=38 vs board 182). Ship judgement: safe.
Deferred (recorded, not blocking): F1's trade — a genuinely mis-minted partner token now merges sittings
  again rather than being refused; the console.error is the signal. F4 has no automated regression
  coverage (typecheck + manual branch audit only) — a future saveSession refactor could reintroduce it.

=== GATE: merging origin/main, then tsc + test:all + build + flag-inlining proof. ===
GATE 1/4 tsc: exit 0. GATE 2/4 test:all: 215 PASS / 4 FAIL — exactly {embed-token, verdict-guard,
  pedagogy-posed-problem, pedagogy-d1}, the four known pre-existing reds; no fifth. GATE 3/4 build: exit 0.
GATE 4/4 flag-inlining: all nine new flags show ONE bare-name hit, not the 0 my plan predicted.
**Ruling 23 (gate step 4's expectation was wrong; the flags are LIVE)** — the chunk reads
  `"off"!==r.default.env.NEXT_PUBLIC_TUTOR_SUBSTITUTE_GATE`: not inlined because the var is absent from
  the build env, so at runtime it is `undefined`, and `"off" !== undefined` is TRUE → flag ON. Correct
  default-ON semantics for every `!== 'off'` flag. CONTROL: pre-existing R58 flags
  TUTOR_FALSE_ASSERTION_KILL / TUTOR_FA_STALE_ANCHOR_DOWNGRADE show the IDENTICAL pattern and are PROVEN
  live — false_assertion_kill fired in portal-704e3e01. The 0-hit flags are older value-typed/`=== 'on'`
  flags. The 2026-08-18 incident behind "expect 0" was a VALUE flag (PERCEPTION_STAGE, parseInt default
  "4") where un-inlined undefined → -1 → broken; for a boolean `!== 'off'` flag, undefined → ON → correct.
  Decision: GATE 4 PASSES. Recorded consequence: a kill switch takes effect only if the var is in the env
  AT BUILD TIME (deploy-tutor.sh builds on the prod box with the prod env) — same as every existing
  `!== 'off'` flag. Plan's Task 15 Step 5 text should be corrected next round. Cost if wrong: nil.
=== GATE FULLY GREEN. Praveen's authorization (option 2) applies: deploy, then push. ===
Pre-deploy prod: BUILD_ID O02vRlqH34mLt6PMxDrhT, pm2 evelyn-tutor online, restarts=0, pm_uptime 1788418560207.
Preflight: .env.local symlink OK, ketcher bundle.js (26MB) + bundle.css OK, .env.local.production OK,
  no deploy lock, deploy-tutor.sh executable.
DEPLOY ANNOUNCED 2026-09-04T23:09:01Z: ./deploy-tutor.sh from worktree tutor-rounds @ a05d804f. Expected ~8-9 min.
DEPLOY COMPLETED 2026-09-04T23:23:21Z: exit 0. Prod verified by controller: BUILD_ID O02vRlqH34mLt6PMxDrhT ->
  CY9o_EE7tVunN9DgSvMxy; pm2 evelyn-tutor online, restarts=0, pm_uptime=1788564147340; new client
  source (kill_withheld_lesson_tool) in 2 chunks and new server source (stale session-id reuse) in 2
  server files; /tutor HTTP 200; error log shows only the pre-existing middlewareClientMaxBodySize
  deprecation. Banner stamps IST (04:52 local = 23:22Z).
PUSH: git push origin tutor-rounds:main (Rule 16 — after deploy).
