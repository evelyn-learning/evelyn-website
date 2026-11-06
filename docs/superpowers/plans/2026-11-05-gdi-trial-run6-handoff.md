# GDI trial — Praveen's PROD run 6 (11-05, on wave 9) → fix wave 10 handoff

> **STATUS 11-05 16:25 PST: WAVE 11 DEPLOYED to :3009** — build `kJmDelL9OkvaSsy7rMvFu` (worktree 2ae65463 + review fix e139301e;
> 76 s deploy, embed/home 200, :3007/:3008 untouched). From Praveen's RUN 7 on wave 10 (embed-1793919909341, 5.5 min: wave 10
> held — pick 1 armed the WORDS, menu barge-ins exempt): (A) scores 84/85/79/81/16 and the brain never had him repeat a word
> → `PRONUNCIATION_LOW_SCORE = 60` (`pronunciationLowScore`: a word or the overall below 60) ⇒ typed row `['retry']` once per
> item, `repeat_due="low_score"` (yields when the part's post-due holds are spent); (B) 187 s "Can you please talk in English?"
> → the exit row was `[move]` alone (items used up, offer made twice) → new `language-request.ts`: a clause-based detector
> (`languageRequestIn`; "How do you say it in English?" and other QUESTIONS about English never fire), the first note carries the
> previous tutor turn (≤700 chars) with the order to restate it in that language then re-ask, a sticky preference note on every
> later turn (+ "Leave support_ja empty" for English), typed row = re-ask of the open ask only (none ⇒ menu/question, item ⇒
> retry), the reducer counts nothing on that turn (no 3rd offer, no menu ask, no retry, open ask kept), say budget 4 on that turn
> (client+server via `TypedTurnRequest.languageRequest`), kill switch `NEXT_PUBLIC_TUTOR_LANGUAGE_REQUEST=off`. Gate: test:all
> 441/443 (baseline), tsc clean; fresh review (fable): 1 Critical (detector false positives) + 3 Important fixed; deferred
> minors: "move on, in English please" re-asks before moving (one turn); "Can you say that in Japanese?" may be a translation
> request (now excluded with the verb-object rule); recentTutorTurnsRef after a perception-cancelled turn not traced.
> NEXT: Praveen's run 8 → dump → check `repeat_due="low_score"` fires on a <60 word and the word is re-armed; `language_request`
> event + the restated explanation in English; no false fire on "how do you say … in English?".

> **STATUS 11-05 15:02 PST: WAVE 10 DEPLOYED to :3009** — build `ZvEYlFjmHglZHYMe3eD6a` (worktree HEAD ff417710, code 37b8d1cf; deploy 84 s; embed/home 200; :3007/:3008 untouched). Built on `gdi-trial-lesson`: Commits 5f9365ff (items follow the menu pick),
> 28b43f8b (pending-answer vocabulary from the numbered card), e9bfdfaa (retry/nudge rows + consumed-note re-plant),
> + the review fix pass (nudge retry not counted and keeps the item open; consumed record clears on a note-less turn and
> carries the typed state the cancelled call saw; pronunciation_rearmed / _note_redelivered / _note_replanted now persisted
> for embed dumps). Gate: `test:all` 440/442 (the 2 known baseline failures), `tsc` clean. Fresh review: 0 Critical, 3
> Important (all fixed), 5 Minor deferred (see the SDD ledger lines in the commit message of the fix pass / this doc's
> "Deferred" below). NEXT: Praveen's run 7 on the "praveen" home link →
> dump → check `pronunciation_armed` names the WORD after pick 1, option barge-ins during the menu read survive
> (`self_voice_exempt_pending_answer`), "say it in English" re-asks the same sentence, a nudge re-arms the same item,
> `pronunciation_note_replanted` after a stage-3 cancel.
>
> Deferred minors: correction-retry re-arm (rearm_item on an open retry assumes the item), loose re-pick mid-part flips the
> list (pre-existing false pick; one-turn delay only), Japanese pick keywords 単語/自然 only, Skip-marker turn skips the
> re-plant match, no pin for the one-word card. The 773 s unnumbered menu read (TT9) stays a brain-wording WARN — harmless now.

Session `embed-1793912673549`, student `gdi-trial-praveen-to0684`, 21:04:39–21:24:23 UTC (19.7 min), 79 turns, 1320 events,
build `Ip6w572mwJkelIwMui35u` (= `gdi-trial-lesson` 4946486d, wave 9). Dump: `scratchpad/praveen/p9.txt` of THIS session
(`/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/b3202479-a1e4-4b85-8840-ff7bd3b4bca0/scratchpad/praveen/`; recipe
`dump9.js` = day-5 recipe with SID swapped). Harness: 70 PASS / 3 FAIL / 2 WARN (FAILs: arm≠ask ×2 at 797/819 s; a re-asked
board question at 79 s; R2 offer-then-ask at 773 s). Wave 9 itself held: TT15 PASS (the check question was asked at 1096 s and
answered before the close), no correction+move turn, the cut-clip wording was used (never "cannot hear"), the forced retry fired
at 819 s.

## Praveen's three observations → root causes (all traced in events, none guessed)

### 1 — 796 s: picked "1" (words); the board showed a SENTENCE, the tutor said "responsibilities", no feedback the first time
- 797 s `pronunciation_armed typed "I have worked with international customers…"` + `arm_item` of that sentence while the
  brain's say was "Listen, then repeat after me: responsibilities." 816 s clip 2.5 s → `not_attempted recognized="several
  years" omitted=7/9` (the WORD was scored against the SENTENCE) → cut-clip note → wave-9 forced retry (819 s, same sentence
  armed again) → same result → 857 s brain moved to item 2 (a sentence).
- Cause: `typedItemsFor` (VoiceTutorRealtime.tsx ~15202) builds the typed item list from `metadata.pronunciation.sentences`
  ONLY; the plan's `pronunciation.words` (responsibilities, international, communicate, customers, developed) never reach
  `items` / `itemsLeft`. The brain's `next.item="responsibilities"` is not listed, so `resolveItem` (typed-turn-rules.ts)
  falls back to `nextItemFor` = the first sentence; the card and the clip reference text are that sentence.
- Fix (engine, generic): the item list follows the menu pick — pick 1 ⇒ `words`, pick 2 ⇒ `sentences`, pick 3 ⇒ learner's
  corrected sentences (V5 refill), so `itemsLeft`, W6's refusal, `resolveItem`, the card and the clip all agree with the
  spoken word. Pins: rules test (items per pick), client pin (`typedItemsFor(segId, pick)`), harness "arm matches the ask".
  Also: the cut-clip note is wrong wording when the learner said a different (shorter) text — fine once the arm is right.

### 2 — 782 / 786 s: barge-ins while the menu was read were ignored, even when they named an option
- Both barge-ins passed the gate (`perception_bargein_gate_passed`) and were then dropped as echo:
  `drop_self_voice: self-voice containment (2w) 0.90` and `onset-during-playback echo overlap 0.67`.
- The classifier has the exact exemption for this (`pendingAnswerExempt`, Task 30 §A1: a reply made of the pending menu's
  words stands down every echo gate), but `pendingAnswerVocabularyFor(lastTutorText)` (pending-answer.ts) returns null for
  the SPOKEN menu because `parseMenuOptions` needs numbered options: the brain's say was "Would you like to practice
  individual words, a complete sentence, speaking more naturally, or skip and continue? Please choose 1, 2, 3, or 4." (TT9
  WARN "menu read without numbers"). Probe (`scratchpad/praveen/vocab-probe.ts`): vocab(say)=null; vocab(card) accepts
  "complete sentence", "number two", "two", "individual words".
- Fix (engine): on a typed `menu` turn, derive the pending-answer vocabulary from the segment CARD (numbered) — or from the
  typed menu effect (`menu_asked`) — not from the spoken say; keep the say-based path for prose. Pin in the classifier/pending-
  answer tests ("spoken unnumbered menu + numbered card ⇒ option words exempt").

### 3 — 914 s "Can you please talk in English?" → a NEW sentence; 990 s another new sentence unprompted; 1049 s Beijing cut → summary
- 914 s: open ask was `retry` (896 s weakest-word repeat). The pronunciation row drops `retry` unless the open ask is `item`
  (typed-turn-rules.ts `ask === 'item' ? row : row.filter(k !== 'retry')`), so the brain's English re-ask of the same sentence
  was refused `illegal_kind` (917 s retries=1) and the retry call could only pick `item` → "I spoke with the CEO…" (new
  sentence; the Q-pin kept the 896 s text until `qpin_stale_cleared` at 1016 s).
- 958 s mic muted → 978 s `no_speech_60s` → 987 s idle nudge, typed `nudge` row = `[item, wait]` → the brain's first next
  refused (`illegal_kind`) → retry = `item` with ANOTHER unpractised sentence ("I attended ABC Corporation's booth", 990 s).
  The nudge row lets a nudge change the item (the reviewer's declined-to-judge line in wave 9).
- 1048 s: clip 7.7 s ended at the speech stop after "exhibition" (he paused), `omitted=4/10` → cut-clip note planted at
  1050 s and consumed by the FIRST brain call (1049 s). 1053 s perception judged "in Beijing. last year." a continuation →
  `perception_stage3_cancel` + MERGE re-dispatch (`handleStudentTranscriptForBrain`, a fresh `callBrainOnce`): the note had
  been consumed (`pronunciationResultNoteRef` cleared), `pronunciationNoteForRetry` re-delivers MEASURED notes only, so
  `pronunciationRepeatDue` was false on the merged call → the row allowed `move` → 1055 s `advance pronunciation→summary`
  with "Thanks for trying that sentence again. その録音は途中で切れて…" and no word about Beijing.
- Fixes (engine): (a) pronunciation row: keep `retry` while the LAST item is still the subject (`openAsk` retry on a
  pronunciation part, `retriesInARow < 2`), so "say it in English" can repeat the same sentence; (b) nudge row on an open item
  ⇒ `[retry, wait]` (re-ask the SAME item), never a new item; (c) an unmeasured note consumed by an attempt that is then
  cancelled/merged is re-planted for the re-dispatch (extend `pronunciationNoteForRetry` to carry unmeasured notes with the
  `pronunciationRepeatDue` flag, or re-plant on `perception_stage3_cancel`); (d) a continuation after a pronunciation clip
  should re-open the clip (the capture is idle after one clip per arm) — at minimum, re-arm on MERGE so the merged utterance
  is measured next time. Pins: rules tests (a)(b), client pin + auto-arm test (c), clip-capture/VTR pin (d).

## Smaller things seen
- 773 s R2 FAIL: the move say ended with an ask after the menu ("Please choose 1, 2, 3, or 4.") — fold into (2): the typed menu
  say should read the numbered options verbatim from the card (TT9 WARN).
- 79 s: an answered board question re-asked (engine detected, still spoke) — pre-existing re-ask gate item (10-30 rules).
- 896 s turn: 7 sentences / 47 words (`turn_cap_flagged`); 1097 s recap 7/76 — the recap is allowed 7.
- 1137 s close: 83-word close again; "Not quite" evaluation then the goodbye — fine per plan step 3/4.

## Gate / deploy
As wave 9: `cd apps/tutor && npm run test:changed` (+ `test:all` when it says so; 2 known baseline failures), `npx tsc --noEmit
-p tsconfig.json`, merge origin/main, `./deploy-tutor-demo.sh` from the worktree on Praveen's word; then his run on the
"praveen" home link. `wt.sh finish` still NOT run; the GDI tester email still NOT SENT.
