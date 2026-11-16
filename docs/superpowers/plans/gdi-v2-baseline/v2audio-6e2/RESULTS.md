# The four GDI learners' real voices on tutor v2, after the Task 6e fix rounds (9c5f8d0e), 2026-11-16

## Setup
The setup is the same as in `../v2audio-6e/RESULTS.md`, which is the "before" here (b89f7ef6):
- Real clips cut from each learner's recording, played through a fake microphone into the v2 voice client.
- Cartesia Ink 2 does the speech recognition.
- The tutor's voice is answered with silence, so no TTS is used.
- The Haiku clip picker chooses each next clip.
- Dev server on :3021 with `NEXT_PUBLIC_TUTOR_BRAIN_VERSIONS=gdi-demo=v2 NEXT_PUBLIC_TUTOR_TTS_WS=off`.
- Every run stops at the tutor's goodbye.

The engine is 9c5f8d0e: Task 6e plus fix rounds 1–3. Those rounds added:
- a part-change frame owned by the runtime;
- a per-sentence ask counter;
- naming an unreached part before the goodbye;
- one question per closing reply;
- cards spoken where they stand;
- the words-watch;
- the "say it again" mishearing check.

Per-turn transcripts are in `*-transcript.md`; the counted checks are in each file's JSON header. Bundles, logs and final screenshots are beside them.

## Per learner: after (6e2) | before (6e)

| | Josh | James | Tester A | Tester B |
|---|---|---|---|---|
| Session | embed-1794865760941 | embed-1794866319933 | embed-1794867209933 | embed-1794868263591 |
| Run / pool min | 8.6 / 8.5 \| 8.1 / 8.0 | 14.2 / 14.1 \| 11.5 / 11.9 | 16.9 / 16.8 \| 17.1 / 17.0 | 18.1 / 18.1 \| 17.3 / 17.2, plus a stalled first try of 8.4 |
| Summary or goodbye (min) | 8.1, on his stop \| 7.7 | 13.8, on "I have to finish now" \| 10.7 | 16.1 \| 16.5 | 17.5 \| 16.5 |
| **1. Garbage transcript stored or sent to the brain** | 0 / 0 \| 0 / 0 | 0 / 0 \| 0 / 0 | 0 / 0 \| 0 / 0 | 0 / 0 \| 0 / 0. Ink did not misfire again, so HEARD_NOISE was still **not exercised** (0 `v2_heard_noise`). |
| **2. Corrected sentence spoken where it stands** | all spoken in place, 0 gaps, board now 4 / held 0 \| 1 colon-less gap | 1 lead-in without its card ("Here is the form, and then I'll ask you a question.", T22); now 5 / held 2 \| 0 gaps | none read after the ask \| **4 read after the ask**. 1 lead-in points at the board ("ここにある文を…読んでみてください", T16); now 7 / held 4 | cards spoken in place ("We say: I have worked here for over 10 years. Can you say…", T20/T22/T24/T52). 1 colon-less gap ("Now let's look at the two tenses you just used.", T16) \| 1 gap + 1 after the ask + 1 read twice |
| **3. Part-change frame** (≤2 per lesson, never at two changes running) | **1** (T16) \| 2, in a row | **2** (T20, T64), not running \| 2, in a row. But T20 names the wrong part: "Next is your job", and T22 then starts the present perfect | **2** (T14, T28), not running \| 4, in a row | **2** (T24, T42), not running \| **5**. T26 re-asks at the same change after the mishearing "and lady" (see 5) |
| **4. Pronunciation offered, or named as next time** | **named**: "Next time … the past simple …, the open conversation … and pronunciation" \| no | **offered** (T58). After one word and "I said individual words": "I can't check the sound of your voice today, so I'll move on to the summary." \| offered | **offered** (T70: "optional pronunciation … or straight to the summary?") **and named**: "Pronunciation can wait for next time." \| named | **offered** on the summary page (T60) **and named**: "we can do the pronunciation practice we didn't reach today" \| partly |
| **5. "Did you say …?" and mishearing checks** (fit) | none needed; わかりません was heard right this time \| 1, wrong | 1: "Did you mean the future of technology and AI? Is that part of your project?", **fair** (an off-topic clip) \| 2 fair | 2: "Did you mean she helped you with the new system?" came after "Skip and continue." was heard as "new.", a **guess off a mishearing**. "Did you ask how to communicate with people who are not from Japan?" **fitted** \| 1 fitted, 1 fair | 3: "Sorry, I didn't catch that. Would you like to say the sentence … once more, or move on?" after "I'm ready." was heard as "and lady.", **fitted**. "Do you mean who makes the SNS content…?" **fitted**. "Do you mean one more try … or the final question?" after "one more again.", **fair** \| 2 fitted |
| **6. Most tries on one sentence** (cap 2) | 2: "have worked" asked twice (T30, T32), then the stop \| 2 | 2 attempts; "I have worked for my company for seven years" was given at T32 after 1 real try plus 2 off-topic clips; bare "Oh, yes." did not count \| 2 | 2: "I joined my company in…" was given at T40 after "Two." and one off-topic try; "We didn't have a manual…" given at T60 after 2 asks \| **~9 asks** | 2: "I have worked for our company…" given at T24 after 2 tries \| 2 |
| **7. Wrong "correct" verdicts** | 0 (the "11 years" slip was named, no retry) \| 0 | 0 \| 0 | 0; "for the current company" is now corrected to "at my current company" \| 1 borderline | 0 hard. 1 borderline: "'I have learned' is the right present perfect" (T44) credits a form the learner did not say ("what I have the learn") \| 0 |
| **8. Double question before / after the summary** | none; one closing reply, nothing after the goodbye \| n/a | none; the goodbye has nothing after it \| menu tacked on after the goodbye | none: T70 is one choice question, T72 one check \| double ask before the summary | **one muddled lead-in**: "Before we finish, here is a quick summary. Before the summary, there is still the pronunciation part. Would you like to do it now…?" (T60) is one question with two contradictory lead-ins; then a mishearing check (T62) \| double ask |
| **9. Noise opening the next page** | none | none | none | none |
| **10. Abrupt part change** (next part with no bridge or check) | none; every change has a bridge line | none; changes at "next" / "move on" come with "Right, let's move on." / "Okay, let's move on." | none; e.g. "That's the past simple done. Next is a longer conversation…" | none |
| **11. Frame spent mid-part ("Shall we continue…?")** | none | none (T64 frames the move to the summary) | none | none (T42 offers the move to the conversation at the end of the past simple) |
| **12. Stall / words-watch** | none (0 `v2_words_lost`, 0 `v2_transcription_failed`) | none | none | none. The 6e stall did not recur and the words-watch never fired |
| Student turns / misfits | 17 / 5 | 34 / 16 | 37 / 12 | 32 / 12 |
| STT word error vs live | 0.7 % \| 5.3 | 4.3 % \| 5.3 | 4.8 % \| 3.3 | about 12 % on clips heard as themselves \| 6.6 (see below) |

## Findings

**A. The fix rounds hold on these four runs.** Each item, after → before:
- Part-change frames: at most 2 per lesson and never at two changes running (in 6e: up to 5, at consecutive changes).
- Cards: none read after the ask (Tester A had 4).
- Pronunciation: offered or named as next time in all four (6e: 2 of 4).
- Retry cap: held, and a bare "Yes." no longer counts as a try. Tester A's ~9-ask loop is gone.
- Closing: one question per reply, and nothing after the goodbye.
- Stalls: no stall, no garbage transcript.

**B. Still open, all small:**
- **Lead-ins without their sentences (3).** Each points at the board and its sentences are never spoken: James T22 "Here is the form", Tester A T16 "ここにある文を…", Tester B T16 "the two tenses you just used".
- **A frame that names the wrong part.** James T20: "Next is your job. Shall we go on…?" But the job part had just been done, and the next turn starts the present perfect.
- **Tester B's muddled close (T60).** It says "here is a quick summary", then "Before the summary, there is still the pronunciation part", then asks the question.
- **Pronunciation for James.** He asked for "individual words" twice. The tutor gave one word, then said "I can't check the sound of your voice today" and moved to the summary. The claim may come from the assess path having no clip, because the replay learner never repeats the word. Worth checking that this line is only said when assessment really is off.
- **Credit for a form the learner never said.** Tester B T44 credits "I have learned"; the learner said "what I have the learn".

**C. A mishearing chain caused by STT, not the tutor (Tester A).** "Skip and continue." (a 0.8 s clip) was heard as "new.". The tutor then guessed "she helped you with the new system", and later read its own guess back as a model sentence. The mishearing check fired, but guessed instead of asking the learner to say it again.

**D. Tester B's high word error is a harness timing artifact.**
- Clip #22 (18.8 s) was first heard as "Oh.". The harness took that fragment as the whole hearing and played the next clip.
- The rest of #22's transcript arrived about 20 s later, so for three clips the "heard" text belongs to the clip before.
- The tutor answered what it heard each time: "training for global staff", "a clear summary of your job", "learned to use your English with foreign colleagues".
- With those shifted clips and "and lady." left out, Tester B's word error is about 12 %.
- Fix for the next round: the harness should wait for the recogniser's final words, not the first fragment.

**E. HEARD_NOISE and the words-watch are still untested on real audio.** Neither the garbage transcript nor the empty-STT stall happened in this round. Their unit and regression tests are the only cover.

**F. Persona card.** Still not exercised: no learner line asks about the tutor. James's "How much longer is this lesson?" got "We have about seven minutes left", which is right (14 of 20 min).

## Budget
- **Pool (gdi-demo): 57.5 min**: 8.5 + 14.1 + 16.8 + 18.1. Remaining 910.8 min.
- **STT**: 55.7 min of Ink socket time.
- **TTS**: none.
- Dev server stopped by PID.
