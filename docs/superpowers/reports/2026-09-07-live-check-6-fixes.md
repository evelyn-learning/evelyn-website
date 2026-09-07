# Live check 6 fixes — engine round (2026-09-07)

Source: academy report `docs/superpowers/reports/2026-09-07-live-check-6-portal-63ee9f2c.md` (session portal-63ee9f2c, Praveen, proportions & percents, 06:46–07:10Z, engine `PRELvv_xeRCv8antXZIon` = `e3e82f21`). Built by the single combined session (academy + engine) on branch `tutor-rounds`, worktree `.claude/worktrees/tutor-rounds`, base `e3e82f21` = `origin/main`.

## Correction to the academy report's narrative (from the persisted session)

`debugEvents` show **no `advance_lesson` until 06:58:01Z**. The brain sat in `hook` for 12 minutes and six substantive turns (`segment_overlong` fired at 06:50:46Z with no consequence), improvised the jar / shots / jacket problems there, painted numberless templates, and then jumped `hook → try-cross-multiply`, auto-completing `concept-setup`, `worked-proportion` and `worked-reverse-percent`. The worked_example segments were never entered, so no card-on-advance mechanism could have saved them. The false-praise kill at 06:55:18Z happened because the recipe card (`showProblem-1`, answer 6) was the tracked problem and **no advance ever cleared it** — the normal advance path does clear `currentProblemRef`; it simply never ran. Also: `posed_problem_unboarded` (R51) is persisted in embed sessions and did not fire on any of the three turns — a template render satisfied it.

## What shipped (per root cause)

| Root cause | Mechanism | Event(s) | Flag |
|---|---|---|---|
| **R-A** spoken problem never on the board | `voice/spoken-problem-board.ts` `detectSpokenProblem` — pure: ask cue (what/which/how much/set up/find/solve…) + ≥2 numbers in the ask window, coverage against this turn's render payloads + the last 12 board payloads + the tracked problem; fires when ≥2 numbers are missing, or one distinctive (≥10 / decimal) number is missing from a two-number ask. The orchestrator's **synthetic tail** appends a runtime `show_problem` ("Question" card, no expectedAnswer) at stream end, processed by the same tool-call branch as brain calls. Never a kill. | `spoken_problem_boarded` | `NEXT_PUBLIC_TUTOR_SPOKEN_PROBLEM_BOARD` |
| **R-A(b)** brain camps in hook/concept | After 6 substantive turns in a `hook`/`concept` segment, one runtime note per segment tells the brain to `advance_lesson` + `show_segment_card` the next segment and never pose a problem in speech. Prepended like the cadence / board-anchor notes. | `segment_overlong_note_planted` / `_consumed` | `NEXT_PUBLIC_TUTOR_SEGMENT_OVERLONG_NOTE` |
| **R-B** stale key kills a correct answer | `checkFalsePraiseOpener` returns `agreed: true` when the opener praised and the utterance agrees with (or concludes with) the verified key; the orchestrator stamps `currentProblemRef.resolvedAtMs`, and every grading-key read (`false-praise`, `inverse-verdict`, `false-final-assertion`) goes through `liveCardKey()` / `liveUnverifiedKey()`, which return nothing for a settled problem. | `active_problem_resolved` | — |
| **R-C** `generate_problem` + authored card → whole-turn kill | When the turn rendered a problem card via `show_segment_card`, the unrendered-generated-problem guard drops the staged generated answer instead of killing. | `generate_problem_unused_dropped` | — |
| **R-D** advance without a card paints nothing | Synthetic tail (a): if this turn's `advance_lesson` landed on a segment with authored truth (`try_yourself` / `misconception_check` / `worked_example` / `extension`) and nothing rendered for it, append `show_segment_card({segmentId})` — which also fires the deferred new page. | `auto_card_on_advance` | `NEXT_PUBLIC_TUTOR_AUTO_SEGMENT_CARD` |
| **R-E** correction-note timeout volunteers into an open question | `openTutorQuestionRef` is set when a tutor turn ends on a question and cleared by the next real student turn; the deadline holds the note (no re-arm) while a question is open — the next real student turn consumes it. | `judge_correction_note_timeout_held` | (existing `TUTOR_CORRECTION_NOTE_TIMEOUT`) |
| **R-F** Q-pin renders `$120 … $100` as math | `inline-math.ts` `looksLikeCurrencySpan`: with `forceMath`, a span that opens with a bare amount, contains a real word and no LaTeX command stays text. `$2 - x$` and `$1.12p = 560$` still render as math. | — | — |
| MCQ segment cards without choices | `show_segment_card` for a `try_yourself` with `responseFormat: 'mcq'` carries `answerChoices` (letter = choice id, uppercased) and `format: 'multiple-choice'`; the tracked problem therefore gets `hasChoices` / `choiceLetters` and the MCQ-aware graders engage. | `show_segment_card_mcq_choices` | — |
| Goodbye "go crush that practice set" with nothing assigned | `isHomeworkAnnouncement` adds practice-noun-phrase **and** deferral ("whenever you're ready", "later", "tonight", "before next", "on your own"); in-session "let's do that practice set now" is untouched. | `homework_announce_dropped` (existing) | — |
| Judge false positives uncharacterisable | `judge_advisory_flag` now carries the judge's `why`. | — | — |

All new events are in the embed persistence allowlist (`tutor-portal/embed/page.tsx`). Prompt (`system-prompt-builder.ts`, Problem Display): every numeric problem must be on the board the same turn; hook/concept ≤ 4 turns and never the place to improvise worked examples.

## Evidence

- `npx tsc --noEmit -p tsconfig.json` → 0 errors.
- `npm run test:all` → **248/248** (baseline 247; new battery `test:spoken-problem-board`, 26 cases; `test:inline-math` +7, `test:homework-announce` +6, `test:false-praise-opener` +12).
- `npm run build` → exit 0, BUILD_ID `EmH-bg4Lqp6DlQEHffEnJ` (local).
- **Prod-corpus control for the spoken-problem net** (the instrument that had to be able to say "no"): 60 most recent sessions with ≥20 transcript turns, 1,603 tutor turns, each paired with its own turn's render payloads + the previous 12. Iterations: 23 hits (1.4%) with a bare-`?` ask and statement/latex-only board text → 8 hits (0.5%) with cue-required asks and full render payloads (diagram labels) → **10 hits (0.6%)** after the coverage rule was changed to "≥2 missing numbers, or one distinctive number missing from a two-number ask" so a coincidental board `18` (the recipe's `3x = 18`) no longer masked "18 out of 24". All three LC6 turns fire; the other seven read as genuine spoken-only problems (80/30% discount part; 315 mi at 70 mph; phone-plan 3(35+4g); profit peak 5,000 units/$12,000; playlist 10→14, 30→34; balance 12 − 4.50; counting by 16s to 64 — the last is a hint, boarded under the neutral "Question" title). Two genuine problems are missed by design (asks with no compute cue: "want to take a crack at that one?", "who wins, and by how much?").
- The control's sentence splitter is an approximation of the runtime's segmenter (it initially split on decimals and hid two LC6 turns); the unit tests use runtime-shaped sentences.

## Not verified

- No live voice session has exercised any of this. The re-check is the next step (below).
- The synthetic tail processes runtime frames AFTER the brain's `done` frame through the same branch; validators on `show_problem` (R33 divergence, prescribed-render mismatch, substitution) apply to the runtime card too. Unit-tested indirectly (tsc + build), not harness-driven.
- `auto_card_on_advance` has no corpus control (it needs the advance + render pairing that only the runtime sees).

## Re-check recipe (with Praveen)

Proportions & percents (`evelyn.hs.alg1.proportions-percents.v1`) or any worked-example-bearing plan. Confirm from `debugEvents`: (1) a `Question` card or the authored card lands whenever a numeric problem is spoken (`spoken_problem_boarded` / `show_segment_card`); (2) `segment_overlong_note_planted` if the hook runs long, followed by an advance; (3) no `false_praise_opener_kill` against an earlier card's key after `active_problem_resolved`; (4) `auto_card_on_advance` on any advance without a card; (5) `judge_correction_note_timeout_held` instead of `_timeout` while a question is open; (6) the Q-pin shows `$120` as text; (7) MCQ try cards show their choices; (8) goodbye silent about practice when nothing is assigned.

## Deploy checklist (Praveen-gated)

From the worktree root: `cmp .env.local.production ../../../.env.local.production` → `./deploy-tutor.sh` → verify BUILD_ID + pm2 → `git push origin tutor-rounds:main`.
