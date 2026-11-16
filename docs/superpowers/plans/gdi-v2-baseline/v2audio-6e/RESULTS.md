# The four GDI learners' real voices on tutor v2, after Task 6e (b89f7ef6), 2026-11-16

These runs are set up exactly like `../v2audio/RESULTS.md` (the before runs, on 6aec719c):
- Real clips cut from each learner's recording, played through a fake microphone into the v2 voice client.
- Cartesia Ink 2 does the STT; the tutor's voice is answered with silence (no TTS).
- The Haiku clip picker chooses which recorded line plays next.
- Dev server :3021 with `NEXT_PUBLIC_TUTOR_BRAIN_VERSIONS=gdi-demo=v2 NEXT_PUBLIC_TUTOR_TTS_WS=off`.

The engine is b89f7ef6. Task 6e's flags (HEARD_NOISE, SAY_SENTENCE_CARD, PART_OFFER_ONCE, PASSED_PART_CLOSE,
CHECK_MISHEARD) are all on by default, and a6f57c6b put Ryota's background into `teachers.json`.

One change to the harness: an audio run now stops at the tutor's goodbye (`AUDIO_CLOSE_RE` in `run-replay.ts`), so no
clip plays into a closed session.

The per-turn transcripts are `*-transcript.md`, each with the counted checks in its JSON header. Bundles, logs and the
final screenshots are beside them. `stall/` holds Tester B's first attempt, which stalled (finding A).

## Per learner: after (6e) vs before (v2audio)

| | Josh | James | Tester A | Tester B |
|---|---|---|---|---|
| Session | embed-1794858327469 | embed-1794858856963 | embed-1794859585055 | embed-1794861248704 (rerun) |
| Run / pool min | 8.1 / 8.0 (before 10.0 / 8.7) | 11.5 / 11.9 (15.0 / 13.6) | 17.1 / 17.0 (19.0 / 18.8) | 17.3 / 17.2 (19.6 / 19.5); stalled 1st try 8.0 / 8.4 |
| Ended by | tutor goodbye after his stop | tutor goodbye after the summary | tutor goodbye | tutor goodbye |
| Summary reached (min) | 7.7, on his stop, in the goodbye (before 8.2) | 10.7 (13.2) | 16.5 (16.8) | 16.5 (17.6) |
| **1. Garbage transcript stored / sent to the brain** | 0 / 0 (0 / 0) | 0 / 0 (0 / 0) | 0 / 0 (0 / 0) | 0 / 0 (**1 / 1**); Ink did not misfire this time, so HEARD_NOISE was **not exercised** (0 `v2_heard_noise` events) |
| **2. Corrected sentence spoken / gaps** | 0 colon gaps (0); 1 lead-in without a colon, "Here are two sentences…", whose sentences are not spoken | 0 gaps (0); cards spoken in place ("Try starting with: I work in… I work in engineering.") | 0 colon gaps (0); **4 turns read an example card after the ask**, out of context (see B) | 1 gap (**6**); card spoken (T20 "The sentence should be: I have worked…"); 1 card read twice (T50); 1 read after the ask (T44); 1 lead-in without a colon unspoken (T26) |
| Board timing, `show_sentence` now / held | 2 / 2 (3 / 1) | 8 / 4 (8 / 1) | 10 / 7 (6 / 5) | 12 / 1 (8 / 0) |
| **3. "Shall we go on, or do you have a question first?"** (full phrase; short "Shall we go on?" too) | full ×2 at **two part changes in a row** (T12, T18) (×2) | full ×1 + short ×1 at **consecutive** part changes (T22, T26) (×2) | full ×1 + short ×3; **consecutive** at T28 → T32 (×3, twice in a row) | full **×5**, at every part change (×2) |
| **4. Pronunciation offered, or named as next time** | **no**: the stop goodbye names "past simple and the conversation practice" as next time, not pronunciation (before: no) | **yes**, offered at T50; one word practised, then the summary (before: yes) | **named**: "We didn't reach the pronunciation practice, so that's for next time." (before: offered at 15 min) | **partly**: mentioned once inside a two-part ask (T38 "…then we can practise pronunciation if you like"), then the summary was offered instead; **not named** in the summary (before: no) |
| **5. "Did you say …?" checks** (fit) | 1: "わかりません" heard as "Okarimasu." → "Did you mean you're ready…?" **wrong guess** | 2, both after off-topic (misfit) clips with correct STT: "Did you say 'time management'?…日本語で教えてください" and "Did you say 'the future of technology and AI'?" **fair** sense checks | 2: "Did you ask how to communicate with people who are not from Japan?" **fitted**; after the garbled "The year and tax system comparison": "…about the sentence, or about the project question?" **fair** | 2: "Did you say you were in charge of the people who made the content?" **fitted**; "Did you mean 'I have worked for our company for over ten years'?" **fitted** |
| **6. Most tries on one sentence (cap 2)** | 2 ("have worked here for 11 years"), then done (2) | 2 ("I have worked here for seven years") (4 asks, misfit-driven) | **~9 asks / 4 attempts** at "I didn't attend any exhibitions last year" (T48–T66): each "Does that make sense?" got "Yes." and a re-ask. Also "I studied at…" asked 5× with no attempt (before: ~7) | 2 on "have worked" (T18 → T20 gives the sentence and moves on). The verb blank was re-asked 3× later (T42–T46) after misfit clips (2) |
| **7. Wrong "correct" verdicts** | 0; T32 "Good, you used *have worked* correctly… we say *11 years*" names the slip with no retry (by design, a slip outside the target form) (1 soft) | 0 (0) | 0 hard; "…for **the** current company" → "Yes, that's right" again borderline (1 borderline) | 0; slips named ("customers with an s") (**1**, STT-made) |
| **8. Double question before the summary page** | n/a (stop) | **after** it: "See you next time!Would you like to do something harder, get more practice, ask me a question, or stop here?" is appended to the goodbye | yes: T80 "Please say the whole sentence once more. Is that clear, or shall I go over it again?" and then a summary inside a correction turn | **yes**: T48 "Next, you can ask me a question about work, and then we'll finish with a short summary. Shall we go on, or do you have a question first?" then T50 "Do you have a question about work for me, or shall we go to the summary?" |
| **9. Noise opening the next page** | none seen (0 noise events) | none | none | none in the rerun. The stalled first try (A) froze on a held page instead |
| Student turns / misfits | 17 / 8 (20 / 7) | 28 / 10 (35 / 13) | 41 / 13 (41 / 11) | 26 / 5 (28 / 6) |
| STT word error vs live | 5.3 % (0.7) | 5.3 % (3.9) | 3.3 % (2.0) | 6.6 % (8.2) |

**Reading the word error.** The STT word error compares this run's Ink output with the live day's Ink output on the same
audio; numbers and words count as the same word. Josh's rise comes from "わかりません" heard as "Okarimasu." and from
"eleven year" heard as "11 years": Ink corrected his mistake, so the tutor never saw it. James's rise is fillers
("Oh" / "Uh").

## Findings

**A. Tester B's first attempt stalled (`stall/`, embed-1794860652224, 8.4 pool min, still "active" in the pool).**
- What happened:
  - Turn 12 opened a held page (`new_page → not opened yet: the student is asked first`) and a `show_table` held to
    sentence 3 of 3. It ended "Next is present perfect. Shall we go on, or do you have a question first?"
  - The learner's "I'm ready." then played, but Ink logged no transcript, and the client showed "Thinking…" with
    "One moment…" in the input (screenshot).
  - No idle nudge came. Nothing was sent for 4 min, and the harness gave up.
- The rerun passed the same point. This fits a client hang on the held page plus the part-change ask (PART_OFFER_ONCE /
  board hold), but it did not reproduce once.
- Worth a look before a live session: if it happens live, the learner's words are lost with no recovery.

**B. SAY_SENTENCE_CARD reads example cards after the ask (Tester A, 4 turns; Tester B T44).**
- The card is spoken, but at the end of the turn, after the instruction. For example, T24: "Please say one sentence
  about your job, starting with 'I work in…'. **I joined my company three years ago.**"
- The same happens in T30, T34 and T70. Several of these cards are unrelated model sentences, so the spoken result
  sounds like a non-sequitur.
- Colon lead-ins are now always followed by the sentence: 0 colon gaps in all four runs, against 6 before in Tester B.
  Lead-ins without a colon still drop the sentence: "Here are two sentences that look similar…" (Josh T10, Tester B
  1st try T12) and "I'll put your idea into one sentence…" (Tester B T26).

**C. The part-change ask still fires at consecutive part changes in all four runs; PART_OFFER_ONCE did not hold.**
- Josh: the full phrase at two part changes in a row.
- James and Tester A: the full phrase once, then "Shall we go on?" at the next change.
- Tester B: the full phrase 5× (×2 before).

**D. Pronunciation (check 4) passes in 2 of 4.**
- James: offered. Tester A: "that's for next time".
- Josh: the stop goodbye names the other parts as next time, not pronunciation.
- Tester B: pronunciation only appears inside a two-part ask at T38, and the summary page offers "a question or the
  summary", not pronunciation.

**E. The retry cap fails when the tutor's own check question is answered "Yes." (Tester A).**
- The tutor ends almost every request with "Does that make sense?" / "Are you with me so far?". A "Yes." to that is not
  an attempt, so the request is repeated.
- "I didn't attend any exhibitions last year" was asked about 9 times before the tutor gave it and moved on (T66).
- Partly harness-made: the learner has no recorded "I didn't attend…". But the double ask (request + check) is the
  tutor's.

**F. Double question around the summary.**
- Tester B asks "a question first?" and then "a question for me, or the summary?" in consecutive turns.
- James's goodbye ends "See you next time!" with the next-steps menu appended: "Would you like to do something
  harder…, or stop here?"

**G. CHECK_MISHEARD.** 7 checks across the runs:
- 3 fitted: Tester A ×1, Tester B ×2.
- 3 were fair sense checks after off-topic or garbled clips: James ×2, Tester A ×1.
- 1 guessed wrong: Josh's "Okarimasu." (わかりません) → "Did you mean you're ready?".

**H. Stop handling held in voice.**
- Josh's split "Okay." / "Please, I would like to end the session" reached the goodbye. The first half got "Take your
  time" and was cut by the second.

**I. Persona card.** Not exercised: no learner line asks about the tutor.

## Budget
- **Pool (gdi-demo): 62.5 min** = 8.0 + 11.9 + 17.0 + 8.4 (stalled B) + 17.2 (B rerun); remaining 968.3 min.
- **STT**: about 60 min of Ink socket time.
- **TTS**: none.
- **Dev server** stopped by PID.
