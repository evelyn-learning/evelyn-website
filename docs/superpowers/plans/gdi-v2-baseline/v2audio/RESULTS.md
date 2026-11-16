# The four GDI learners' real voices on tutor v2 (Task 6d), 2026-11-16

Engine: gdi-v2 HEAD 6aec719c (Task 6c: PRACTICE_VERDICT, PERSONA_CARD, PASSED_PART_FACT, opener-quote fix). Dev server
:3021, `NEXT_PUBLIC_TUTOR_BRAIN_VERSIONS=gdi-demo=v2 NEXT_PUBLIC_TUTOR_TTS_WS=off` in the process env only. Partner
gdi-demo, `input_mode: voice`, students `gdi-v2-audio-<who>`.

## How the runs were made
- **Real clips only.** Each learner's own turns were cut from the session recording (`student.pcm16`). The cut
  script is `apps/tutor/scripts/tutor/replay-harness/cut-clips.ts`; the clips stay on the laptop in `~/.evelyn/gdi-audio/<who>/clips`.
  - Audio second = transcript second + (createdAt − wallStartMs). Offsets: Josh 57.10 s, James 20.26 s,
    Tester A 18.93 s, Tester B 0.09 s.
  - Alignment check: in every clip the voiced span ends 0.3–2 s before the turn's transcript time. Speech rates are
    1–3.7 words/s.
  - Left out as `empty` (no speech at that time; each is the tail of the clip before): James #34, Tester A #6 and #20,
    Tester B #31.
- **Fake microphone.** The clips were played at real time into the page's `getUserMedia`, over a −61 dBFS noise
  floor. Everything after that is the real v2 voice client: energy gate, Cartesia Ink 2 STT, turn end, barge-in.
- **No tutor voice.** Every TTS request was answered with silence about as long as the reply would take (0.42 s/word),
  so the client's playback clock and turn-taking still ran. TTS was never called.
- **Clip picker.** One Haiku call per tutor turn picks the clip whose words best answer the tutor. Rules:
  - Take the first unused try for a question, mistakes included.
  - A short ack may repeat; a used long clip never does.
  - When no clip fits, play the closest one and mark it `misfit`. Misfits are mostly cases where v2 asked something
    the learner never answered on the day ("When did you last meet a customer?").
- **A misfit is the harness, not the tutor.** The tutor's replies to misfit clips are still real: it is hearing an
  off-topic answer.

Per-turn transcripts (clip, fit, live text, what STT heard, word errors) are in `josh-transcript.md`,
`james-transcript.md`, `tester-a-transcript.md` and `tester-b-transcript.md`. The bundles (`*.json`, with events and
the stored transcript), `*.log` and the final screenshots are beside them.

## Scores

| | Josh | James | Tester A | Tester B |
|---|---|---|---|---|
| Session | embed-1794852141793 | embed-1794852787022 | embed-1794853728839 | embed-1794854909646 |
| Run / pool min | 10.0 / 8.7 | 15.0 / 13.6 | 19.0 / 18.8 | 19.6 / 19.5 |
| Summary reached (min) | yes, 8.2, on his stop | yes, 13.2, on "I have to finish now" | yes, 16.8, planned | yes, 17.6, "nearly out of time" |
| Live v1 summary (min) | none (stopped at 6.5) | 10.4 | 18.9 | none |
| Pronunciation offered | no (stopped first; same as live) | yes, on request; dropped after one word (see 3) | yes, at 15.2; skipped | **no**: time ran out, and the summary does not name it (see 4) |
| Most tries on one sentence | 2 ("…for eleven years"), then closed | 4 asks of "I have worked…" (misfit clips), then moved on | ~7 asks of "I met…" (no fitting clip exists), then took "No, I didn't." | 2 ("have worked"), then taught + moved on |
| Stop handling | honoured: summary + goodbye on the 2nd half of the split clip | honoured at once | n/a | n/a (tutor closed at 19.6) |
| Wrong "correct" verdicts | 0 hard; 1 soft ("Good, you used *have worked* correctly… We say *11 years*… present perfect is done", no retry) | 0 | 0 hard; 1 borderline ("…for **the** current company" → "Excellent, you said that correctly") | 1, STT-made: heard "I met some" (said "someone") → "*I met some* is correct" |
| Persona questions answered from the card | not exercised: no learner asked about the tutor | same ("How much longer is this lesson?" → "About eight minutes are left", correct) | not exercised | not exercised |
| Repeated openers / frames | "…, or do you have a question first?" ×2 | "Yes, that's right(!)" ×3; question-first frame ×2 | question-first frame ×3, asked twice in a row (turns 24 → 26) | question-first frame ×2 |
| Passed-over parts named | none passed | pronunciation dropped, not named | none (pronunciation offered, skipped) | **pronunciation not offered or named** |
| Idle nudges (75 s) | 0 | 1 | 2 (one after an unheard 0.8 s clip) | 2 |
| Student turns / misfits | 20 / 7 | 35 / 13 | 41 / 11 | 28 / 6 |
| STT word error vs the live transcript | **0.7 %** (153 words) | **3.9 %** (207) | **2.0 %** (252; #19 left out, a cut that holds two live turns) | **8.2 %** (464; #29 left out, a garbage transcript, see 1) |
| Clips not heard | 1 (after the tutor's goodbye) | 1 (after goodbye) | 2 ("Skip and continue." 0.8 s cut; the summary-time tail) | 1 ("I need to manage for the uh", a near-silent cut) |
| STT socket / clip audio (min) | 8.3 / 1.7 | 13.3 / 2.1 | 18.1 / 3.3 | 18.9 / 4.5 |

**What the word error compares.** The live sessions used the same recogniser (Cartesia Ink 2, prod
`NEXT_PUBLIC_TUTOR_STT_ENGINE=ink2`). "Word error vs the live transcript" is therefore v2-run Ink against v1-day Ink on
the same audio: the replay path versus the live mic path, not against a human transcript. Numbers and digits count as
the same word ("11" = "eleven"). Most remaining differences are fillers ("Oh" vs "Uh"), sentence splits, and Tester
B's long, hesitant turns.

## Findings

1. **Ink hallucination stored as a 5,000-character student turn (Tester B, clip #29 "I'm not sure about it.")**
   - The recogniser returned `I'`, then newlines and about 400 `、` / `号`. It went to the brain and into the stored
     transcript as one student line.
   - The tutor coped: "Sorry, I didn't catch that." Nothing caps or cleans such a transcript before it reaches the
     brain or the session row.
   - This is the clearest STT defect in the four runs. It never happened on the day; Tester B's live session heard
     this line fine.
2. **STT-made misreadings carry into the teaching (Tester B).**
   - "My role is to manage…" was heard as "my lover is the manage…". The tutor asked which was meant, then built "your
     manager creates the content" on it.
   - "I met someone" was heard as "I met some" and praised as correct.
   - Tester B (Japanese GM, long hesitant answers) is where Ink is weakest: 8.2 % here vs 0.7–3.9 % for the others.
3. **James: pronunciation dropped on a misunderstanding.**
   - He asked to move to pronunciation, then said "just a little bit of individual words". The tutor started on
     *responsibilities*.
   - His "I said individual words" was taken as "stop the word practice". The tutor went back to the project question
     without naming that pronunciation was cut short.
   - In live v1 the same words were a complaint about a re-asked menu, and v1 then went on with words. v2 instead
     reads them as "stop".
   - The other side: on "Sorry, I have to finish now." v1 answered "Let's finish with a short summary… Are you
     ready?" and then quizzed him, while v2 summed up and said goodbye in one turn.
4. **Tester B: pronunciation passed over silently.**
   - At about 17 min the tutor said "We're nearly out of time, so let's finish with a quick summary." Pronunciation was
     never offered.
   - The summary does not say it was skipped. The PASSED_PART_FACT path did not show in this run.
   - Tester B's live v1 session reached pronunciation at about 19 min and ran out there.
5. **Corrected sentence missing from the spoken words (Tester B, 6 tutor turns).**
   - Turns like "Please use *people* without *a*:  How long have you worked on this project?" have a gap where the
     sentence card goes. The sentence is on the board (`show_sentence`).
   - In 3 of the 6 the corrected sentence never appears in the spoken text, so a learner who is listening, not
     watching, hears "we say: …" and nothing.
   - The other runs had no such gaps. This is by design for cards under no ask (6b M6), but in voice it reads as a
     dropped sentence. Worth a look on the screenshot plus audio.
6. **The section hand-off frame repeats.**
   - "Next is X. Shall we go on, or do you have a question first?" appears 2–3× per run.
   - Tester A got it right after the tutor had just asked "Shall we go on to the present perfect now?" (turn 24 → 26):
     the same permission was asked twice in a row.
7. **The stop was handled well in voice.**
   - Josh's stop clip was split by STT into "Okay." + "Please, I would like to end the session for now." The tutor
     started answering "Okay." ("Please go ahead…"), the second half barged in (`v2_bargein`), and the tutor went
     straight to a short summary and goodbye.
   - James's "Sorry, I have to finish now." got an immediate summary and goodbye.
8. **A split clip keeps both halves.**
   - Tester A's "I want uh improve my speaking skill because I often attend a meeting… that use English." became two
     recogniser turns. The first request was superseded, but the session stored both lines and the tutor answered the
     whole.
   - The harness now reads "heard" from the stored transcript so this is not miscounted (`score-audio.ts`).
9. **Verdicts after Task 6c.**
   - The hard case from the live sessions (praising a sentence with a slip) appeared once, softly: Josh's "for 11 year"
     was named but the part closed without a retry.
   - Tester A's "the current company" passed as correct.
   - No sentence with a real verb error was called correct.

## Harness limits
- Misfit rate is 21–37 %. v2 asks questions the learners never answered on the day, so long stretches (Tester A's
  "I met…", Josh's "When did you last meet a customer?") test the tutor's handling of off-topic answers more than its
  teaching. Tries counts in those stretches are partly harness-made.
- The harness does not stop after the tutor's goodbye. It plays one more clip, which goes unheard because the session
  has closed, and Josh and James then ran on to their caps. That cost about 1–1.5 pool min each.
- Two clips are bad cuts: Tester A #39 (0.8 s, unheard) and #19 (holds two live turns).

## Budget
- **Pool (gdi-demo): 64.9 min**: smoke 2.9 + an aborted first Josh start 1.4 + 8.7 + 13.6 + 18.8 + 19.5. Remaining
  1030.9 min.
  - The Josh restart: the picker had skipped his first, wrong tries. The rule "first unused try, mistakes included" was
    added and the run started again.
- **STT (Cartesia Ink)**: about 62 min of socket time (smoke 2.6 + aborted about 1.3 + 8.3 + 13.3 + 18.1 + 18.9),
  carrying 11.7 min of learner audio.
- **TTS**: none.
- **Picker**: about 130 Haiku 4.5 calls.
