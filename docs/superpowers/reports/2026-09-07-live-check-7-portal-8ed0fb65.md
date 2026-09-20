# Live check 7 — portal-8ed0fb65 (Praveen, multi-step equations, 2026-09-07 10:47–11:36Z) + fix round

Engine `NOvIuhB8GwctYDsynh36Z` (main `565236b6`, the live-check-6 round), crimsora embed, typed input. Evidence: `evelyn.tutorsessions` transcript (67 turns) / `whiteboardCommands` (51) / `debugEvents` (718), `evelyn-tutor-out.log` from line 1978. Plan `evelyn.hs.alg1.multi-step-equations.v1` (hook → concept-routine → worked-both-sides → …).

## Live-check-6 round: what the new nets did in this session

| Net | Fired | Verdict |
|---|---|---|
| `segment_overlong_note_planted` | 10:53:31Z, `concept-routine` after 6 turns | **Fired at the wrong moment** — see §1. Root cause of the worst chain in the session. |
| `judge_correction_note_timeout_held` | 6× (10:55:27 … 11:34:01) | Worked: no volunteered self-answers while a question was open. |
| `show_segment_card_resolved` (auto card / MCQ) | 10:53:54, 11:00:52, 11:36:22 | Cards rendered; MCQ choices not exercised (this plan's tries are free-response). |
| `false_praise_opener_kill` | 11:11:08 `student=2x+60 verified=10` | **Still a false kill** — a derivation step judged against the card's final key. §4. |
| `spoken_problem_boarded` / `active_problem_resolved` / `auto_card_on_advance` | 0 | Not exercised (no spoken word problems; keys were card-less). |

## Praveen's observations → mechanism

### 1. "When I said 12 it put up a new problem, then corrected itself, then put the 6 distribution under the new problem"

Chain, from `debugEvents`:

1. 10:53:25 T20: brain poses `x/2 + 3 = 2x/3 − 1` (still in `concept-routine`). 10:53:31 the **runtime overlong note** is planted (6 turns in concept).
2. 10:53:48 student "12". The note rides this turn. The brain obeys it literally: `mark_segment_complete + advance_lesson + show_segment_card(worked-both-sides)` — "Right… the LCD is 6… Let's put the full routine together on a fresh problem" — and the Example-1 card `Solve: 5(x−3) = 2x+9` lands at 10:53:55 while the fraction problem is unresolved.
3. 10:54:01 judge flags "the LCD is 6" (`judge_advisory_was_kill`) → note planted → student silent, no question open → 20 s timeout volunteers → 10:54:27 "Actually, hold on — you were right. Twelve works too" + `Clearing with the LCD (6)` painted **under the new card**.
4. From here every fraction-problem turn is judged against the authored 5(x−3)=2x+9 solution (`judge_authored_solution` on 12 turns): 10:54:37 "Twelve works too… contradicts authored solution", 10:56:54 "3x+3=4x−1 contradicts the authored solution's problem", 11:00:59 and 11:02:39 "x = 24 contradicts authored x = 8", 11:05:59 "5x − 15 contradicts…". Each planted a correction note; the notes made the brain hedge — **the false denial of the correct `3x+18 = 4x−6` at 10:57:33 ("Not quite yet… let's see what the actual right side should be") is the brain second-guessing itself under a bogus note**, then affirming the same right side one turn later.

Root causes: (a) my note had no sense of "mid-problem" and told the brain to advance *this turn*; (b) the judge's authored-solution anchor is keyed to the tracked problem card, which the premature advance had just made the authored card, so it stayed attached while the class was visibly on another equation.

### 2. Caption strip became an 8-line block (Image 1, 04:14)

`"$3 off *each* shirt" — … combine $-6$ and $4$`. The caption fitter treats every `$` as a math delimiter: the currency `$3` paired with the `$` before `-6` into one 150-character "math" span; the measure proxy strips span bodies, so the sentence measured short, the fitter decided it fit, and `InlineMathText`'s `whitespace-pre-wrap` (which overrides the ticker's `nowrap`) wrapped it. The stray literal `$4` is the same mis-pairing mid-reveal.

### 3. After the detour the board did not return to `5(x−3) = 2x+9`; the spoken "full equation now reads 5x − 15 = 2x + 9" was never on the board (Images 2–4)

- 11:00:52 the brain re-issued `show_segment_card(worked-both-sides)` to return to the problem; the catalog dedup dropped it (already on the board) and the scroll-to-existing rule only scrolls for a *different page*. The card was on the same page, ten items up.
- 11:05:50 T39 "That matches the board. So the full equation now reads $5x − 15 = 2x + 9$" — no render carried that equation; the board showed only the distribution step. The judge flagged the turn (wrong reason: "contradicts authored").
- Also visible in Image 2: the page titled `Example: Solve: 5(x − 3) = 2x + 9` holds the *fraction* problem's steps — the premature page open from §1.

### 4. "Check the LCD-of-20 turns" (T46–T49)

Student "multiply by 20" (valid: any common multiple clears). The brain's first attempt said exactly that ("their LCD is 10, but any com[mon multiple]…") and was **killed by the label-duplicate guard**: its `Clearing with the LCD (10)` collided with the earlier `Clearing with the LCD (6)` — same page (generate_problem does not open a page), prior still on board → reject. The retry dropped the "any common multiple" sentence; the judge then flagged the retry for ignoring the 20 (`advisory_was_kill`), the note landed, and T49 opened "Actually, hold on — the LCD here is 10, not 20" — a correction of a correct method. Then 11:11:08 the student's correct step `2x+60` was killed by the false-praise guard against the generated card's final key `10`.

Pedagogy: 12 and 20 were both right; the tutor treated LCD as the only answer twice.

## Fixes (round 8, this branch)

| # | Fix | Test |
|---|---|---|
| F1 | Overlong note **delivery gate**: held while a tutor question was open at turn start unless the utterance is a bare ack/move-on; ≤3 turns; wording now "finish the problem in play first, then advance". Event `segment_overlong_note_held`. | — (orchestrator) |
| F2 | Judge prompt (1b) SCOPE caveat: the authored block applies only while the class is on that problem. | — (prompt) |
| F3 | Label-dedup: a label reused under a **newer problem card** on the same page registers instead of rejecting (`problemEpoch`). | `test:equation-label-dedup` +2 |
| F4 | False-praise: bare-number key vs algebraic step (`2x+60`, `x−.75x`) is advisory, never a kill (`step-expression`). | `test:false-praise-opener` +12 |
| F5 | Dedup scroll: same page but ≥2 later items ⇒ scroll to the re-shown item. | `test:dedup-scroll` +3 |
| F6 | Spoken **equation claim** boarded: "now reads / on the board / we have $…=…$" with the equation absent from the board ⇒ runtime `show_equation` labelled `Now: <equation>`. Prod control 9/1,603 turns (0.6%); hypothetical/wrong-formula foils excluded. | `test:spoken-problem-board` +8 |
| F7 | Caption fitter currency-aware (`scanMathSpans`): `$3 off` is money; tokens, proxy and hold-back share it; `InlineMathText nowrap` for the ticker. | new `test:caption-fit` (19) |
| F8 | Prompt: a valid common multiple (12, 20) is affirmed, never "corrected" to the LCD; same for any correct alternative route. | — (prompt) |

Gate at this commit: `tsc` 0 errors · `test:all` **249/249** · `next build` exit 0.

## Not fixed / watch

- The judge's false-positive rate under an authored anchor is prompt-mitigated, not structurally gated; if it recurs, gate the anchor on the last equation render sharing the authored problem's terms.
- The brain's own false denial at 10:57:33 had no deterministic guard (no verified key for an improvised equation); the note chain that induced it is closed by F1/F2.
- `spoken_problem_boarded` / `auto_card_on_advance` still have no live exercise.
