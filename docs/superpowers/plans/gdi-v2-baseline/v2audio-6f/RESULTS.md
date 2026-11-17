# The four GDI learners' real voices on tutor v2, after Task 6f (b42428f7), 2026-11-17

## Setup
The setup is the same as `../v2audio-6e2/RESULTS.md`, which is the before for every check below:
- each learner's real recorded clips play through a fake microphone into the v2 voice client;
- Cartesia Ink 2 does the speech recognition (STT);
- the tutor's voice is silenced (no TTS);
- a Haiku clip picker chooses each next clip;
- dev server :3021 with `NEXT_PUBLIC_TUTOR_BRAIN_VERSIONS=gdi-demo=v2 NEXT_PUBLIC_TUTOR_TTS_WS=off`.

Two things are new in this round:
- **Pronunciation is really scored.** The worktree `.env.local` has `TUTOR_PRONUNCIATION_VENDOR=azure`.
- **The harness waits for the recogniser's final words.** It moves on only when what was heard holds at least half the
  clip's words and nothing new came for 2.5 s, or 30 s after the clip ended (`run-replay.ts`). The 6e2 Tester B shift by
  one clip did not recur: no clip's heard text belongs to another clip.

The harness stops at the tutor's goodbye only when the goodbye contains a farewell word. James's and Tester
B's closes had none ("Thank you for today's lesson, and well done!"), so those two runs ran on to their caps. That cost
about 1–2 pool min each. The goodbye pattern now also matches "thank you for today's lesson" and a closing
ありがとうございました, ready for the next round.

Per-turn transcripts are in `*-transcript.md`; the counted checks, including pronunciation events, are in each file's
JSON header.

## The 12 checks: after (6f) | before (6e2)

| | Josh | James | Tester A | Tester B |
|---|---|---|---|---|
| Session | embed-1794873082391 | embed-1794873556746 | embed-1794874440681 | embed-1794875473296 |
| Run / pool min | 7.2 / 7.1 \| 8.6 / 8.5 | 14.0 / 13.2 \| 14.2 / 14.1 | 16.5 / 16.4 \| 16.9 / 16.8 | 18.0 / 16.8 \| 18.1 / 18.1 |
| Summary or goodbye (min) | 6.7 (on his stop) \| 8.1 | review 11.0, goodbye 12.7 (on "I have to finish now") \| 13.8 | 16.1 \| 16.1 | 16.1 \| 17.5 |
| **1. Garbage transcript stored or sent to the brain** | 0 / 0 \| 0 / 0 | 0 / 0 \| 0 / 0 | 0 / 0 \| 0 / 0 | 0 / 0 \| 0 / 0. HEARD_NOISE still **not exercised**: 0 `v2_heard_noise` |
| **2. Corrected sentence spoken where it stands** | yes ("…with an s. I schedule classes for many teachers, and I also teach.") \| yes | yes. SAY_NOTE_SENTENCES speaks T18's four example sentences, but they come **before** their lead-in "Here are some examples". One glitch: "このthe文は" (T26) \| 1 gap | yes ("I have done accounting for ＿ years.") \| 1 gap | yes ("So the full sentence is: I have worked…") \| 1 gap |
| Board `show_sentence` now / held | 2 / 3 \| 4 / 0 | 4 / 2 \| 5 / 2 | 7 / 8 \| 7 / 4 | 9 / 4 \| 10 / 3 |
| **3. Part-change frame** (≤2, never two changes running) | 0 \| 1 | 2 (T24, T34), not running \| 2 | 2 (T26 English, T40 Japanese "次に進みますか、それとも先に質問がありますか？") **at two changes running** (job→PP, PP→PS) \| 2 | 2 (T14, T28), not running \| 2 |
| **4. Pronunciation offered, or named as next time** | **named** ("…and pronunciation") \| named | **offered and practised** (T42) \| offered | **offered 4×** (T58, T68, T72, T74), then **named**: "発音の練習は、次の機会にしましょう" \| offered + named | **neither offered nor named** \| offered + named |
| **5. Mishearing checks** (fit) | none needed \| none | none \| 1 fair | 3 asked again, all **fitted**: T36 "…もう一度ゆっくり言ってもらえますか", T56 "No, I didn't. は、どの文への答えですか？", T62. 2 guesses with a yes/no confirm: T64, T66 \| 1 fitted + 1 guess | "Sorry, I didn't catch that." after "and lady." **fitted**. T48 "Did you mean…?" **fitted**. T50 **guessed wrong without asking** (see e) \| 3 fitted |
| **6. Most tries on one sentence** (cap 2) | ≤2 ("have worked … 11 years": 1 try). "When did you become…" was asked 5× with 0 real tries (misfit clips) \| 2 | ≤2 \| 2 | 2 ("I successfully finished", then given). "I have done accounting for ＿ years" was asked 5× with 0 real tries before the model was given (T40); "I work in…" 5× with 0 tries \| 2 | 2 ("have worked", given at T28). "manage the members" 2 tries + 1 nudge \| 2 |
| **7. Wrong "correct" verdicts** | 0 \| 0 | 0 \| 0 | 1 borderline again: "I have worked for **the** current company…" → "その文は正しいです" (T26) \| 0 | 0. T22 says honestly that the form "did not appear" \| 1 borderline |
| **8. Double question before or after the summary** | none \| none | **yes, see (d)** \| none | none (one choice question per turn) \| none | **yes, see (d)** \| muddled lead-in |
| **9. Noise opening the next page** | none | none | none | none |
| **10. Abrupt part change** | none (bridges: "Now let's talk about the past.") | none | none | none |
| **11. Frame spent mid-part** | none | T34 asks a content question and the frame in one turn ("Is there a project…? … Next is conversation. Shall we go on…?") | none | none |
| **12. Stall / words-watch** | none (0 `v2_words_lost`) | none | none | none |
| Student turns / misfits | 15 / 6 | 29 / 3 | 38 / 10 | 28 / 10 |
| STT word error vs live | 0.7 % \| 0.7 | 4.9 % \| 4.3 | 1.3 % \| 4.8 | 5.8 % \| ~12 (6e2 was misaligned) |

## The new checks (a)–(f)

**(a) Pronunciation attempts.** There were two, both James's, both target "responsibilities.":

| # | Clip played | Vendor result | Phoneme note | Tutor's comment |
|---|---|---|---|---|
| 1 | "Oh, yes." | `pronunciation_clip_sent` 2048 ms, peak −6.3 dBFS → `pronunciation_failed: cut not_attempted` | none | no comment on the sound; it asked again ("please say the word once more") |
| 2 | "I said individual words." | clip_sent 1536 ms, −8.6 dBFS → `failed: not_attempted` | none | "I don't have a score for that last try, so I'll just listen with you." This is PRONUNCIATION_FALLBACK, said once, and practice went on |

- **The tutor never claimed a measurement.** The only sound guidance was a model: "international, with the stress on
  NAT: in-ter-NAT-ion-al". That is a description, not a verdict. Matched: yes.
- **Azure was reached, and "not attempted" was the right answer.** Neither clip said the word.
- **No `pronunciation_scored` came back, and none can from this harness.** No learner recording contains a repetition of
  a practice word. A real score needs a live mic test.
- The other learners had no pronunciation attempts:
  - Josh stopped first.
  - Tester A's "Skip and continue." was not heard: the 0.8 s clip is a bad cut.
  - Tester B was never offered pronunciation.

**(b) Lead-ins whose sentences were never spoken.** None in 6f (6e2: 3). James T18 speaks the four sentences, but ahead
of "Here are some examples. Please listen…", so the lead-in follows them.

**(c) A frame naming a part other than the page that opened.** None.
- James T24 → present perfect; T34 → conversation.
- Tester A T26 → present perfect; T40 → 過去形 (past simple).
- Tester B T28 → past simple. Tester B T14 names no part ("…make your sentences about experience more accurate. Shall we
  go on…?"), and the job page opened.
- 6e2 had James "Next is your job".

**(d) Muddled closes: two, both new.**
- **James.** "Now let's finish with a short review. Well done… Before we [finish]…" (T50). Then "We have about eight
  minutes…" (T52). Then "about seven minutes left… one quick practice on 'there was / there were', or we can finish now.
  Which would you like?" (T54).
  - The review had begun, and the tutor then offered more practice. James had to say "I have to finish now".
  - The goodbye names the grammar points for next time, but not the pronunciation that was cut short.
- **Tester B.** The last turn (T54) asks "Please say this sentence once more", then goes straight into the summary and a
  thank-you in the same reply, so the retry can never be given.
  - It names the grammar for next time but not pronunciation, which was never reached.
  - The PASSED_PART_CLOSE line ("a summary that has begun names the unreached part as next time") did not fire here.

**(e) A mishearing guessed instead of asked.** One, Tester B T50. STT turned "one member is will leaving" into "is
we're leaving". The tutor stated "You are leaving the company…" as fact and gave a model sentence built on it, without
asking. Tester A's two guesses (T64, T66) each ended with "Is that what you meant? Please say yes or no.", which is a
check. 6e2 also had one guess (Tester A).

**(f) A noticeable pause before a part-change frame.** The measure is the time from clip end to the complete reply;
the median for ordinary turns is given beside each frame.

| Learner | Frame times | Median for other turns |
|---|---|---|
| James | 3.5 s, 5.1 s | 4.6 s |
| Tester A | 5.3 s | 4.3 s |
| Tester B | **11.1 s** (T14), 8.2 s (T28) | 6.0 s |

Tester B's first frame took about 5 s longer than its typical reply. That turn also opens the held page, which is
probably where the extra time goes. A learner would hear about 5 s more of thinking chime there.

## Findings, in order of weight
1. **Pronunciation for Tester B (check 4).** It was neither offered nor named, and the summary has begun without
   naming it.
2. **Muddled closes (d).** James: review, then an offer of more practice. Tester B: a retry request inside the summary
   turn.
3. **Frames at two part changes running (Tester A).** The second frame is Japanese, "次に進みますか、それとも先に質問がありますか？",
   which suggests the runtime's frame budget does not count a Japanese frame. The other three runs keep the rule.
4. **Repeated pronunciation offer (Tester A).** It was offered 4 times in 9 turns.
5. **Asks pile up when the learner never answers the sentence.** Tester A and Josh were asked 5× each. This is partly
   the harness's misfit clips; the tutor does give the model in the end.
6. **Small items:**
   - "このthe文" mixed-script glitch (James T26).
   - James T34 puts a content question and a frame in one turn.
   - Tester A's "the current company" passes as correct again.

**What holds compared with 6e2:**
- no lead-in without its sentences;
- no frame naming the wrong part;
- no garbage transcript;
- no stall;
- no abrupt part change;
- the cap of 2 real tries;
- the pronunciation fallback said once, with no comment without a measurement.

## Budget
- **Pool (gdi-demo): 53.5 min** (7.1 + 13.2 + 16.4 + 16.8); 857.4 min remain.
- **STT (Ink): 52.1 min.**
- **Pronunciation (Azure):** 2 assessment calls.
- **TTS:** none.
- **Dev server:** stopped by PID.
