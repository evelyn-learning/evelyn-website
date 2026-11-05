# GDI trial — Praveen's PROD run 5 (11-05) → fix wave 9 handoff

Session `embed-1793905969232`, student `gdi-trial-praveen-to0684` (the "praveen" home link), 19:12:53–19:30:20 UTC (17.5 min),
78 turns, build `3vktQDLiQmsPo0zzaT_H7` = `gdi-trial-lesson` 7b6dbc30 (docs 1f8b2282). Work in THIS worktree
(`/Users/luke/Dev/evelynlearning/.claude/worktrees/gdi-trial-lesson`, branch `gdi-trial-lesson`, not merged to main; `wt.sh finish`
not run). Read `2026-11-04-gdi-trial-day5-handoff.md` for the standing rules, mint recipe, dump recipe and gate. Evidence dump
(transcript + whiteboard + 1194 events + stored summary): `/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/d660ae27-507d-48cd-ab18-b308ae1bbf42/scratchpad/praveen/p8.txt`
(re-create with the day-5 dump recipe, `SID=embed-1793905969232`, plus the `=== SUMMARY` tail in `…/scratchpad/praveen/dump8.js`).

## What worked

- End-of-lesson panel + home: `learnerSummary.status=ready`, generated 19:30:21 (0.3 s after the final save), 6 corrections,
  4 recommendations, level `intermediate` from the profile ("Level set in your lesson on 2026-11-05."), EN + JA. Replay has audio.
- Typed turn: 39 turns, 1 refusal (the close, see C), no `illegal_kind`, no bridge-text failures except A.
- Praveen's "Move past simple." (321 s) and "move" (951 s) were honoured as orders; menu pick "uh complete sentence" resolved to 2.

## The three defects (Praveen's report, in his order)

### A — 101 s: correction and page flip in the same turn ("I tell my manager to help." → Part 4)

Transcript 7–8; events 100–103 s. Student "I uh tell manager to help." → brain returned `verdict=partly_correct`, a `correction`
card ("I tell my manager to help.", emphasis `my`) AND `next.kind=move` → `advance topic-intro→present-perfect`, `newPage "Part 4 ·
Present perfect"`, `showProblem "Have you worked for your current company…"` painted 0.2 s after the card; `typed_turn_bridge_missing`;
7 sentences / 59 words (`turn_cap_flagged`). The learner never said the corrected sentence. (He called the page "Past Perfect"; it is
Part 4 · Present perfect.)

Why: `topic-intro` has `metadata.maxTurns: 4` (`docs/whitelabel/gdi/plans/gdi-work-projects-v1.json`, laptop-only; the plan is
embedded in the token flow, not in `lessonplans`) and this was typed turn 4 of 4, so `budget_due=yes`; the prompt in
`apps/tutor/src/lib/tutor/voice/typed-turn.ts` ~130 explicitly allows it: "When next.kind is move right after the student's answer,
judge that answer first (verdict, verdict_say, a correction and board when it had a slip), then next.say = one bridge sentence + the
new part's opening ask." No gate refuses a `move` that carries a `correction`.

Fix (engine, generic — Praveen's 10-30 pacing rule "a correction gets its retry"): in the `next` gate chain
(`apps/tutor/src/lib/tutor/voice/claude-brain.ts` ~3136–3152) add reason `correction_needs_retry`: `correction != null` and
`next.kind ∈ {move, close, question, offer, menu, item}` → refused before speech, one retry whose message says: the sentence was
corrected, so this turn's `next` is `retry` (the learner says the corrected sentence once); the move/question comes next turn, after
the retry is judged. Exempt: `turn_state` says the student asked to move (student stop/move request), `post_due ≥ 1` (the part has
already overrun once), and the level check (never corrects). `TypedRetryReason` gains the value; `typed-turn.ts` retry text ~444;
rewrite the prompt sentence above to "a correction is always followed by `retry`; the move waits one turn". Pins:
`scripts/test-typed-turn.ts` (predicate), `scripts/test-typed-turn-brain.ts` (first object correction+move → one retry → second
object `retry` spoken; correction+move with post_due=1 → not refused). Also check `budget_due`/`post_due` handling lets the part
overrun by exactly that one retry turn.

### B — 859–927 s: pronunciation never scored; tutor said it "cannot hear the sounds"

Two targets armed and both clips sent at exactly **9400 ms** (= `CLIP_MAX_MS` 10000 − `CLIP_PRE_ROLL_MS` 600,
`apps/tutor/src/lib/tutor/pronunciation/clip-capture.ts:34`): the capture hit its max before the last word. Server log
(`pm2 evelyn-tutor-demo`, standing permission):
```
[pronunciation] not_attempted display="I have worked with international customers for several." completeness=44 omitted=1/9 latency=2482ms
[pronunciation] not_attempted display="I was responsible for communicating with our." completeness=38 omitted=1/8 latency=2277ms
```
8/9 and 7/8 words were heard, but the vendor's `completeness` (44, 38) is below `MIN_COMPLETENESS = 50`
(`apps/tutor/src/lib/tutor/pronunciation/assessor.ts:73`), so `isMeasuredResult` (~80) returned false → `PRONUNCIATION_NOT_ATTEMPTED_NOTE`
("The learner did not say the target text; nothing was measured. Ask them to repeat it…") planted twice. The brain ignored the
"ask them to repeat" both times (`next=item`, then `next=offer`; said "Good, the words were all there" / "That matches the sentence")
and, asked "How was my pronunciation of these two sentences?" (925 s), answered 「音そのものは私には聞こえません」 — the worst possible
demo line. The stored summary then says "Pronunciation was not practised in this lesson." (facts come only from measured
`pronunciation_note_planted` events, `apps/tutor/src/lib/tutor/portal/learner-summary.ts:151–155, 273, 292`).

Fixes:
1. Clip length: the learner speaks at `speech_rate 0.7` with fillers; 9.4 s is too short for a 9-word sentence. Raise `CLIP_MAX_MS`
   to 15000 (the server's `MAX_CLIP_SECONDS` is 15; keep pre-roll inside it) AND end the clip on `turn.eager_end`/speech end as the
   capture already does — verify the max is only a backstop. Pin in `scripts/test-clip-capture*.ts` (or wherever `ClipCapture` is pinned).
2. Measured rule: when ≥ 75 % of reference words are present (word-level `omission` count), treat the result as measured even if the
   vendor `completeness` is lower, and append "(the last word was cut off)" to the note; the omitted word goes in `weak`. Pin in
   `scripts/test-pronunciation-assessor*.ts`. Keep the clip_too_short/silent paths as they are (Task 24 §A3).
3. Engine-enforced repeat: when the planted note is the not-attempted/unavailable note, the next typed turn's `allowed_next` is
   `retry` of the same item (once), with the note text telling the brain the recording was cut short — not that the learner failed.
   The brain must never claim it cannot hear: rewrite `PRONUNCIATION_NOT_ATTEMPTED_NOTE` (assessor.ts:70) and
   `PRONUNCIATION_UNAVAILABLE_NOTE` to "The recording of this sentence was cut short / could not be measured. Say so in one short
   sentence and ask for one more repeat; never say you cannot hear." Pin in `test-typed-turn-brain.ts`.
4. Summary facts: count `pronunciation_armed` events; when armed > 0 and measured = 0 the comment is "Two sentences were practised;
   no score could be measured this time." (+JA), not "not practised". Pin in `scripts/test-learner-summary.ts`.
5. Direct question "How was my pronunciation?": with measured scores in the notes the brain must quote the numbers (Task 25 §E
   bands); with none, the sentence from (3). Rule check only — the engine already plants the scores when they exist.

### C — 997 s: the tutor answered its own check question, then closed

Summary segment (`gdi-work-projects-v1.json`, `requiredPhrases: ["one thing you did well", "the difference between"]`, maxTurns 4,
teacherNote step 3 = ASK "can you explain the difference between… I have worked here for five years / I worked here five years ago"
and evaluate the answer). Events 997–1001 s: brain's first `next=close` refused `missing_required_phrase` (the X2 gate,
`claude-brain.ts` ~3142); the retry message (`typed-turn.ts` ~463: "the close must contain every required phrase verbatim… Write the
close again with each") made the brain stuff the phrase into the close as a statement: "Before we finish, the difference between … is
that the first still continues, while the second is finished." `typed_turn_close_phrases_in_say: "summary" [one thing you did well, the
difference between]` fired (advisory only) and `lesson_closed`. 7 sentences / 83 words. The learner was never asked.

Why: `requiredPhrases` enforces words, not acts. A phrase that is a check QUESTION is satisfied only when it was voiced in a
`question` turn and the student answered.

Fix (engine, generic): (1) in the close gate, a required phrase that has not been voiced in an earlier `question`/`retry` turn of this
part may not be satisfied by the close's own `say` — refuse `close` with reason `check_question_unasked` and a retry message "ask it
now as a `question` (one sentence + the two example sentences); the close comes next turn, after the answer"; make the existing
`typed_turn_close_phrases_in_say` the refusal path instead of an advisory. (2) `missing_required_phrase` retry text: drop "write the
close again with each"; say "say the missing phrase in the right place: a feedback phrase in this turn's `say`, a check question as a
`question` turn". (3) Plan side (laptop JSON, re-embed at mint): mark the check-question phrase explicitly, e.g.
`requiredPhrases: ["one thing you did well", {"ask": "the difference between"}]` — only if (1) cannot distinguish them generically;
prefer (1). Pins: `test-typed-turn.ts`, `test-typed-turn-brain.ts` (close with an unasked check phrase → one retry → `question`
spoken; next turn after the answer → close passes), `test-trial-checks-typed.mjs` adds a check "recap check question asked as a
question and answered before close" on the p8 transcript shape.

## Smaller things seen in the same run (park or fold in)

- Turn length: 5 `turn_cap_flagged` (7 sentences at 101 s and 1000 s). The correction turn (A) and the close (C) are the two long ones;
  both shrink with the fixes above.
- 101 s correction `explain` was vague ("The sentence needs a verb form that fits the situation") and the card emphasised only `my`
  while the real fix was `tell` → `tell my manager`; prompt asks for "the reason in at most 2 sentences" — consider requiring the
  explain to name the changed words.
- 584 s: "Sales with a Smile は プロジェクトの名前なので、a は要りません" contradicts the correction one turn earlier ("a before smile"). Model
  quality; no mechanism — note only.
- 280 s: "Quieter spot or turning down nearby sound would help me hear you clearly." — the noise advisory spoke mid-lesson; fine, but
  check it is once per session.
- 925 s "How was my pronunciation…" also tripped `correct_retry_note_planted: answered question re-asked` — the engine thought the
  tutor re-asked an answered question; harmless here.
- Summary `corrections` include the student's raw fillers ("I uh tell manager to help.") — intended (verbatim), but the PDF/home page
  may read better with the filler stripped; Praveen's call.

## Gate / deploy

`cd apps/tutor && npm run test:changed` (baseline failures allowed: `test:embed-debug-coverage`, `test:portal-student-scoping`),
`npx tsc --noEmit -p tsconfig.json`; merge origin/main first; deploy ONLY on Praveen's word with `./deploy-tutor-demo.sh` from the
worktree (:3007/:3008 untouched); then one live run by Praveen on the "praveen" home link. The GDI tester email
(`/Users/luke/.evelyn/partners/gdi-email-testers-2026-11-05.filled.md`) is still NOT SENT — Praveen decides whether it waits for wave 9.
