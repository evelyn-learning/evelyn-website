# Bilingual EN+JA lessons on tutor v2: replay results (Task 6), 2026-11-16

Local dev server from worktree gdi-v2 (base cbffbb49), port 3019, started with `NEXT_PUBLIC_TUTOR_BRAIN_VERSIONS=gdi-demo=v2` in the process env only (no .env file touched). PROD Mongo via the 2710 tunnel (session rows and the level/profile commit for `gdi-v2-replay-*` ids only). Text mode (`input_mode: "text"`) and `--no-speech` on every run; no speech request was attempted (no "speech refused" line in any log). Bundles, logs, score cards and the final screenshot of each run are in `v2/`; per-turn screenshots are kept out of git (SDD workspace).

**v2 confirmed**: every `brain_turn` event in every session ends `· v2`; sessions open with `start_v2: tutor opens (text)`; the harness tees `/api/tutor/brain-v2/turn`. Partner options for `gdi-demo` (resolved with the same env): `levelCheck: true, pronunciation: true, lessonCloseAutoEnd: true, trialKeepsPlan: false, brainVersion: v2`; `v2CanRunSession` admits en+ja lessons. The `gdi-demo` row has no `trialKeepsPlan` and there is no local override, so the showcase run (the only `is_trial` run) got the "leave the plan behind" line. Observed effect: none harmful. The brain still walked the showcase plan's parts in order (hook, four ways, misconception, verb chart, choose the form, role-play). Setting the option is Task 8.

Box: the pool caps sessions at 20 min, so v2's time box is 20 min with the wrap at 18 (v1's `poolTimeBox`). The fixtures ask for 30.

## Runs
| Run | Session | Min | Tutor turns | Ended | Level set |
|---|---|---|---|---|---|
| gdi-real-stop | embed-1794819411132 | 2.9 | 7 | tutor close (stop obeyed) | none (stopped in the check) |
| gdi-b1-mixed | embed-1794819690250 | 14.2 | 32 | tutor close | intermediate |
| gdi-real-t2 | embed-1794819709023 | 14.3 | 35 | student stop after the summary | beginner |
| gdi-upper-int (new) | embed-1794819728875 | 16.3 | 37 | tutor close | intermediate |
| gdi-real-josh | embed-1794820633195 | 9.0 | 22 | cap (22 student turns, same cap as v1) | intermediate |
| gdi-real-james | embed-1794820653759 | 10.9 | 30 | "Sorry, I have to finish now." -> goodbye | beginner |
| gdi-beginner-ja (new) | embed-1794820792637 | 15.1 | 40 | tutor close | beginner |
| gdi-showcase-advanced (new; `gdi.demo.english.experiences.advanced.v1`, is_trial) | embed-1794821260705 | 15.8 | 39 | **end_lesson without a summary (D1)** | intermediate (trial: level-only save) |
| trial-text-session straight | embed-1794821778369 | 17.2 | 41 | **end_lesson without a summary (D1)** | beginner |
| trial-text-session beginner | embed-1794822294129 | 17.6 | 42 | time-up closing summary | intermediate |
| gdi-real-stop on the b1 student id (case 11) | embed-1794822878220 | 4.6 | 11 | tutor close (stop obeyed) | remembered: intermediate |
| demo-forces (evelyn-marketing, regression) | embed-1794821389252 | 14.4 | 26 | student "have to go" -> close | n/a |

The `trial-text-session.mjs` learner is a keyword bot written for the fixed-script engine's wording. On v2's wording it misfires about one turn in three: off-topic answers such as "It took about three months." or "My boss helped me with it.". Its two runs measure robustness to a confused learner more than they measure the lesson.

## Checklist (PART 9) x run
✅ met, ⚠️ partly, ❌ not met; `tNN` = turn in the run's `.log` / console (numbered by `t6view`, tutor and student turns counted together).

| Item | b1-mixed | real-t2 | upper-int | beginner-ja | real-james | real-josh | showcase | trial straight | trial beginner |
|---|---|---|---|---|---|---|---|---|---|
| 1 Overview before the check | ✅ t1–t3 | ✅ t1–t3 | ⚠️ t1 topic + grammar only | ✅ t3, Japanese retell t5 | ⚠️ t1 topic + grammar only | ⚠️ t1 | ⚠️ t1 (plan hook) | ✅ t5 | ⚠️ t1 |
| 2 Three conversational level questions, sensible level | ✅ t5–t13, intermediate | ⚠️ 2 questions (t5, t11/t13), beginner | ✅ t3–t10, intermediate | ⚠️ job question only (t7–t14), beginner | ✅ t3–t13, beginner | ✅ t5–t10, intermediate (questions on the board only, D2) | ⚠️ warm-up t3–t11, intermediate | ⚠️ 2 questions, beginner | ⚠️ 2 questions, intermediate; level said aloud t15 |
| 3 Visibly different beginner vs advanced | ✅ English with Japanese glosses | ✅ Japanese explanations, starters | ✅ English only, longer, denser | ✅ corrections and grammar in Japanese (t19–t27) | ✅ Japanese part intros t23, t29 | ✅ English | ✅ harder content (4 past forms) | ✅ | ✅ |
| 4 Present perfect / past simple taught correctly | ✅ t19, t23, t27 | ✅ t21, t29 | ✅ t23, t35 | ✅ t25–t27, t35 | ✅ t23, t29 | ✅ t19, t27 | ✅ t17–t25 | ✅ | ✅ |
| 5 Natural follow-ups | ✅ t7, t41 | ✅ t41–t47 | ✅ t39, t51 | ⚠️ t47–t63 a run of "Start with…" prompts | ✅ t31–t43 | ✅ t29–t41 (t43 re-asks how long) | ✅ role-play t57–t67 | ⚠️ | ⚠️ |
| 6 Error -> correct -> explain -> retry -> continue | ⚠️ t15–t17 good; t21 accepts "eleven year" (D3) | ✅ t59–t61 | ⚠️ 4 tries on one sentence t13–t21 (D5) | ✅ t19–t23 in Japanese | ✅ t19–t21, t25–t27 | ⚠️ t19–t21 gives the fix, no retry, "that's right" | ✅ t5–t7 | ✅ t67–t69 | ✅ t23–t25 |
| 7 Student invited to ask questions | ✅ every part boundary | ✅ + t49 "ask me" | ✅ t55–t57 | ✅ | ✅ "how much longer" answered t47 | ✅ | ✅ been/gone answered t75 | ✅ | ✅ |
| 8 Pronunciation offered (measured: owed to T7 mic test) | ✅ t45–t55 (stress only, honest t55) | ✅ offered t53, skip honoured t55 | ⚠️ sentence pick became a grammar drill, then skipped t61–t69 | ⚠️ menu spoken t67; fake "you said it clearly" t71, t75 (D4) | ✅ t49–t55, pick heard at once | ❌ not reached (cap) | ❌ plan has no pronunciation part | ❌ not reached | ⚠️ offered at time-up t83 |
| 9 Summary reflects this learner | ✅ t57, t63 | ✅ t55 | ✅ t71–t73 | ✅ t77 | ✅ goodbye recap t59 | ❌ not reached (cap) | ❌ no summary (D1) | ❌ two sentences, then the session ended (D1) | ⚠️ spoken at time-up t85, summary page empty |
| 10 Pacing adapts, fits the box | ✅ summary 12.0 | ✅ pivot after "No", summary 11.2 | ⚠️ summary 15.2, correction chains | ✅ summary 14.0 | ✅ all parts by 10.7 | ✅ (cap) | ❌ ended without a summary | ⚠️ | ✅ cut practice, summary 16.1 |

Pass rate: 61 ✅ / 22 ⚠️ / 7 ❌ of 90 cells (68% ✅; 92% ✅ or ⚠️). The three PART 9 priorities:
- **Level understood**: yes. Beginners got Japanese and starters; upper-intermediate got English-only correction.
- **Teaches, not just chats**: yes. Correct, explain, retry, continue holds in 7 of 9 runs.
- **Moves between modes**: mostly. Pronunciation and back works when reached; it was not reached in 3 runs.

## The 12 live cases: v1 baseline vs v2
| # | Case | v1 (baseline README) | v2 (this run) | Verdict |
|---|---|---|---|---|
| 1 | Confusion skips the question | t2 rephrased; James's "I don't understand" -> next question | t2 t7 rephrases the same question; t9 Japanese gloss of "admin"; James t9 same question in Japanese; beginner-ja t13 | improved |
| 2 | False "you already answered" | not reproduced in the replays | not seen; "already on the board" (trial-b t59, t63) was true | same (not seen) |
| 3 | Loop on short "No" | reproduced (~6 project questions) | t2 t13 -> t15 changes tack after two "No"s; t41 "one task you did last week"; beginner-ja t37 | improved |
| 4 | Stop means stop | obeyed (stop run) | obeyed at once: stop t21, shared-link t21, James "I have to finish" t59 (one goodbye) | same (both pass) |
| 5 | Menu pick not heard | menu re-read twice; "Skip and continue" needed repeating | James "just a little bit of individual words" heard at once t51; t2 "Skip and continue" honoured t55; beginner-ja t69 | improved |
| 6 | Praise stacking / double explanations | 21 turns with 2+ praise phrases in 6 runs | 5 such turns in 8 runs; but a stock "Yes, that's right." opens 50–70% of turns | improved (partly) |
| 7 | Wrong or contradictory corrections | weak instance (t2 "No, that's a clear answer") | b1 t21 "that's right" on "eleven year"; b1 t33 restates "That was" for "That is"; josh t31 credits "helped" he didn't say; t2 t23 accepts "the current company", then the summary flags it | same (still present) |
| 8 | Invented facts | not seen in the replays | t2 t51 tutor claims an office job, then retracts it in the same turn; upper-int t57 tutor invents its own projects; beginner-ja t75 "you said it clearly … sounds natural" in text mode after t69 said it cannot hear | worse |
| 9 | Timer line interrupts a menu | not seen | not seen; time lines came only inside end-of-lesson offers | same (not seen) |
| 10 | Resume promise | promised "pick up from here next time" | not testable: stop closes the session at once (auto-end), so the resume question is never asked; the stop goodbye says "Next time, we can pick up with your English for meetings" unasked (stop t13) | n/a |
| 11 | Shared link = inherited level | reproduced live | b1's id reused with a new learner name: level check skipped, no light re-confirm, straight into the job part (shared-link t3) | same (not fixed) |
| 12 | Over-correction eats the lesson; no summary | live: no summary by 20:00; replay b1 summary 17.0 | summaries at 11.2–15.2 in 5 runs; upper-int still chains 3–4 tries and corrects almost every answer; 2 runs lost the summary to D1 | improved (pacing) |

Count: improved 5 (1, 3, 5, 6, 12), same 5 (2, 4, 7, 9, 11), worse 1 (8), not testable 1 (10).

## Pacing (box 20 min, wrap 18)
| Run | Summary started (min) | Session length |
|---|---|---|
| b1-mixed | 12.0 | 14.2 (v1: 17.0 / 18.8) |
| real-t2 | 11.2 | 14.3 (v1: 11.8 / 13.0) |
| upper-int | 15.2 | 16.3 |
| beginner-ja | 14.0 | 15.1 |
| real-james | 10.8 (goodbye recap at the learner's "finish") | 10.9 (v1: none by the 40-turn cap at 15.2) |
| real-josh | not reached: cap at 9.0, in the conversation part | 9.0 (v1: cap 9.1) |
| showcase | **none**: end_lesson at 16.1 with the summary page held | 15.8 |
| trial straight | **partial** at 15.7 (two sentences), session ended (D1) | 17.2 |
| trial beginner | 16.1 (time-up closing turn) | 17.6 |
| real-stop / shared link | goodbye recap at the stop, 2.4 / 4.1 | 2.9 / 4.6 |
| demo-forces | recap 13.8 | 14.4 |

Every run that reached its end did so inside the box. Two of nine full lessons ended without the summary (D1).

## Non-language regression (demo-forces, evelyn-marketing)
- The plan reached `recap` with all parts completed.
- At the recap (t49) the tutor offered more practice or stopping; it did not close by itself. end_lesson came only after the student said "I have to go" (t51).
- Nothing bilingual: 0 tutor turns with Japanese.
- The recap content was on the board only ("Here is the recap of today's main ideas."), the same pattern as D2.

## Retired trial-text-session checks (fixed-script assertions)
These are retired for v2 runs and stay as they are for v1:
- **TT1–TT15**: these read the typed-turn engine's events, which v2 does not have. The script now prints `typed turn: off`.
- **fixed_script_offer_unmade / _replanted, "every planted offer was spoken", "no readiness ask on a fixed-script plan"**: fixed-script offer planting.
- **R1–R3, 45 §1–§7, 46 §1–§5**: the v1 pointer, judge and offer rules (auto-advance, the judge's correction notes, the menu engine line).
- **"page … opens with its card — showProblem first", "one page per part reached", "part pages in plan order", "every part reached got its entry note"**: these depend on v1's authored "Part N · title · 日本語" pages and on `advance_lesson` progress. v2 names its pages itself, so these FAIL on v2 by construction (trial straight: "0 part pages").
- **"level-check cards are in first person"**: v1-authored level-check cards.
- **"pronunciation menu asked within 20 s of the page", "pronunciation arm matches the ask"**: these read the v1 menu engine and its arm events.
- **"summary page has its recap card"**: this reads the fixed-script summary card. On v2 the closing-turn summary (trial beginner) is spoken. A visible summary card is a product question, not a regression.
- **"Q-pin gists grounded in the turn"**: the gist heuristic is tuned to v1's question extraction. On v2 it scores the model's own verbatim questions at 0–20%.

Kept, but the hits were false positives on v2:
- "no narrated notes": at 53 s, "Sorry, I think my question didn't come through clearly" is a natural repair.
- "no Japanese-only turn after an English student turn": at 132 s the turn also carried the English question.

v2 results:
- straight: 3 FAIL / 51 PASS / 0 WARN (v1: 5 / 70 / 3).
- beginner: 4 FAIL / 52 PASS (v1: 3 / 73 / 1).
- Every FAIL is a retired or false-positive check.

## Defects (ranked)
1. **D1 (high): a self-made close in the last fifth drops the summary.**
   - showcase embed-1794821260705 (968 s, t77) and trial straight embed-1794821778369 (970 s, t83). In both, the brain opened the summary page and called end_lesson in the same reply.
   - The page was held for the offer (`new_page → not opened yet: the student is asked first`), so the reply was cut to "Next is summary. Shall we go on, or do you have a question first?". end_lesson still ran (`the session is ending`), so the session ended on a question with no summary.
   - Cause hypothesis: the end_lesson guard lets the tutor close once ≤20% of the box is left (`apps/tutor/src/lib/tutor/v2/turn.ts` ~:286). `closingTurn`, which un-holds the summary page, is true only for a stop request, time-up (≤1.5 min) or past the wrap minute (~:322).
   - Between 4 and 2 minutes left, a closing reply is cut at its page but its end_lesson still runs. Both hits were at 16.1–16.2 min.
   - Suspect: turn.ts (hold at ~:534 vs end_lesson handling); possibly the facts' "close is near" line.
2. **D2 (high for voice): the question or item exists only on the board.**
   - Examples: "Here is the first question." (josh t5, t7, t9); "Here is one you can use for your plans: Please say it back to me." with the sentence unsaid (upper-int t61, which drew complaint_lost); "Which one would you like? Just say the number." with the options unsaid (james t49); "Here is the correct sentence." (trial-b t83); "Here is the recap…" (demo-forces t49).
   - Text mode hides it because the board is visible. In voice the learner hears no question.
   - The constitution says "When you put a problem up, say so and say what it asks" (`v2/constitution.ts:63`), but nothing enforces it.
   - Owed: the T7 voice check of whether show_problem / show_sentence content is ever read out.
3. **D3 (medium): wrong verdicts and misquotes (case 7).**
   - Instances: b1 t21, b1 t33, josh t21, josh t31, t2 t23 (above).
   - The tutor says "that's right" and quotes the corrected sentence as if the learner had said it.
   - Suspect: the correction / verdict guidance in `v2/languages.ts` and the constitution.
4. **D4 (medium): invented facts (case 8, new on v2).**
   - The tutor invents a persona with a job and projects (t2 t51, upper-int t57).
   - In text mode it gives a pronunciation verdict it cannot have, contradicting itself (beginner-ja t69 vs t71, t75).
   - Suspect: the persona and teacher style lines; the text-mode facts in `v2/pronunciation.ts`.
5. **D5 (medium): over-correction chains (case 12, other half).**
   - upper-int t13–t21: four tries on one sentence across four different errors. t37–t45: three more. Nearly every answer gets a correction.
   - Rule wanted: correct the one error that matters most, at most two tries, then give the sentence and move on.
   - Suspect: `v2/languages.ts` correction lines.
6. **D6 (medium): shared link, remembered level (case 11).**
   - The level check is skipped with no re-confirmation, even under a different student_name (shared-link run).
   - Suspect: `v2/working-level.ts` (`v2MarkLevelKnownParts`).
7. **D7 (low–medium): the level check is often shorter than three questions.**
   - t2 had 2, beginner-ja asked about the job only, both trial runs had 2. The level is set after two "No"s.
   - In trial-b t15 the tutor said the level aloud although the tool result says not to.
   - Suspect: `v2/working-level.ts` facts.
8. **D8 (low): pronunciation in text mode drifts.**
   - The "sentence" pick turned into a meaning-and-grammar drill, then was skipped for time (upper-int t61–t69).
   - Suspect: `v2/pronunciation.ts` text path.
9. **D9 (low): lessonProgress lags the lesson.**
   - trial straight ended with only overview and level-check completed while the tutor had taught four parts. upper-int is missing topic-intro; t2 is missing level-check.
   - Suspect: v2 progress keyed to page opens (held pages, model-named pages).
10. **D10 (low): stock opener and repeated offers.**
    - "Yes, that's right." / "That's correct." opens most turns.
    - Offers repeat: b1 t21 "Here is a practice question for you. Shall we go on…?"; two to four "Shall we go on?" in a row when the learner's reply is off-target (t2 t37–t39, trial straight t35–t39).

Not measured here (owed to the T7 mic test): measured pronunciation scores, barge-in gate, mic re-acquire, captions, goodbye timing in voice.
