# The four GDI learners' real voices on tutor v2, after Task 7 (c0ee0314), 2026-11-17

Replay round 5. It checks the fixes from Praveen's mic test 1 (Tasks 7a–7d, findings A–G in
`../../2026-11-17-gdi-v2-mic-test-1-handoff.md`). The "before" is round 4, `../v2audio-6f/RESULTS.md`.

## Setup
The setup is the same as round 4:
- each learner's real recorded clips play through a fake microphone into the v2 voice client;
- Cartesia Ink 2 does the speech recognition;
- the tutor's voice is silenced (no TTS; every TTS request is answered with silence);
- a Haiku clip picker chooses each next clip;
- Azure scores pronunciation (worktree `.env.local`).

The dev server ran on :3021 from the worktree, with `NEXT_PUBLIC_TUTOR_BRAIN_VERSIONS=gdi-demo=v2 NEXT_PUBLIC_TUTOR_TTS_WS=off TUTOR_AUDIO_DIR=$HOME/.evelyn/local-audio`. It was stopped by PID when the runs finished. Student ids:
- `gdi-v2-replay-audio7-{josh,james,tester-2,tester-b}` for the voice runs;
- `gdi-v2-replay-r5-text-{josh,james,stop,t2,t3}` for the text runs.

There were no harness changes. Each learner ran once and nothing was re-run.

**Files in this folder:**
- `*-transcript.md`: per-turn transcripts made by `score-audio.ts`, with the counted checks in the JSON header.
- `*.log`, `*.json`, `*.score.json` and the final screenshot: the run itself.
- `boards/*.txt`: a read-only dump of each session row, giving the stored transcript numbered `T0…` with the board commands each reply carried (pages, sentence cards). **The turn numbers below are these `T` numbers.**
- `text/`: the text replays.

Chip state was read from the per-turn screenshots. These are kept out of git, as in earlier rounds.

**Two harness limits matter for this round:**
- **Tester B ran out of clips at 18.0 min,** before any summary (`endedBy student_end`, "no lines left"). Her close cannot be judged.
- **Known bad cuts in the clip set went unheard,** as in rounds 3–4: Tester A #39 "Skip and continue." (0.8 s) and Tester B #28 (0.7 s). Each was followed by a 75 s idle wait.

## The 12 checks: after (7) | before (6f)

Check 3 is replaced. It used to read "≤2 frames, never two running". The rule now is: ask before every part change, with varied wording, one line on what was just done, and the next part named.

| | Josh | James | Tester A | Tester B |
|---|---|---|---|---|
| Session | embed-1794904318081 | embed-1794904901890 | embed-1794905784740 | embed-1794906993296 |
| Run / pool min | 8.9 / 8.8 \| 7.2 / 7.1 | 13.9 / 13.8 \| 14.0 / 13.2 | 19.3 / 19.2 \| 16.5 / 16.4 | 18.0 / 18.4 \| 18.0 / 16.8 |
| Summary or goodbye (min) | 8.5, on his stop \| 6.7 | 13.5, on "I have to finish now" \| 12.7 | summary 18.4, goodbye 19.0 \| 16.1 | **not reached**: out of clips at 18.0 \| 16.1 |
| 1. Garbage transcript stored / sent | 0 / 0 \| 0 / 0 | 0 / 0 \| 0 / 0 | 0 / 0 \| 0 / 0 | 0 / 0 \| 0 / 0. "I'm not sure about it." was heard cleanly |
| 2. Corrected sentence spoken where it stands | yes (T14). **Two order glitches:** T12 speaks its two board sentences *before* "Here is a preview of the two sentences on the board"; T36 speaks "I attended an exhibition last year." **after** "Goodbye, and see you next time!" \| yes | yes (T43 "One small thing… There were about ten other engineers…") \| yes | yes \| yes | yes (T28, T57, T73) \| yes |
| Board `show_sentence` now / held | 4 / 0 \| 2 / 3 | 10 / 3 \| 4 / 2 | 9 / 6 \| 7 / 8 | 19 / 5 \| 9 / 4 |
| **3. Ask before every part change** (new rule) | 2 changes, 2 asks, both worded differently and naming the part, with a recap line ("That completes the part on your job") | 4 changes asked, 5 asks (T16, T25, T29, T31, T37), no wording repeated, all named; pronunciation opened on his own request (T62) | 5 changes, 7 asks. PS→conversation asked twice running (T54 Japanese, T56 English). **T78 names the wrong part** (see B) | 4 changes, 6 asks. Two re-asks after a non-answer (T12, T54), all named, none repeated |
| 4. Pronunciation offered, or named as next time | named next time (T36) \| named | practised on request (T63–T67) \| offered + practised | offered late (T85) + named next time \| offered 4× + named | **offered** (T71) \| neither |
| 5. Mishearing checks (fit) | none needed | T31, T55 asked again, both fitted | T40, T71 asked again, both fitted | T12 after "and lady.", T36 asked again; T20 "…と言いましたか？", T63 "…という意味で合っていますか？" all fitted |
| 6. Most tries on one sentence (cap 2) | 2 ("11 years", then given) | ≤2 | ≤2 real tries. "How long have you worked in accounting" was asked about 9× (T22–T42) on misfit clips before the model was given at T44 \| 5× | 2 ("manage the members") |
| 7. Wrong "correct" verdicts | 0 | 0 | 1 borderline again: "for **the** current company" accepted (T22) \| same | 0 |
| 8. Double question before or after the summary | none (stop) | none (firm stop) | none: summary + invitation, then the goodbye on her answer | invitation **before any summary** (T73), see G |
| 9. Noise opening the next page | none | none | none | none |
| 10. Abrupt part change | none | **present perfect taught on the "Your job" page** (T27), see A | none | none |
| 11. Ask spent mid-part | none | none | T78, on a 2 s silence turn, see B | none |
| 12. Stall / words-watch | none | none | none (a 75 s idle after the bad-cut clip) | none (a 75 s idle after the bad-cut clip) |
| Student turns / misfits | 17 / 7 \| 15 / 6 | 34 / 10 \| 29 / 3 | 42 / 14 \| 38 / 10 | 35 / 4 \| 28 / 10 |
| STT word error vs live | 0.7 % \| 0.7 | 3.4 % \| 4.9 | 5.4 % \| 1.3 | 5.7 % \| 5.8 |

## The mic-test checks, per learner

### A. Chip, page and part agree at every part change
- **Josh: holds.**
  - After "Do you want me to start now?" the "Talking about your job" page opened, the *Your job* chip lit, and Overview and Level check went green (shot t06).
  - During the T14 ask the chip stayed on *Your job*, and no chip lit for the part on offer (t07).
  - On "Yes." the Present perfect page opened. *Your job* went green and *Present perfect* lit (t08).
- **James: fails once. This is the flag-5 shape by another route.**
  - At T25 he was asked "Next is the present perfect… Do you have a question first, or shall we go on?". He answered with content, "I work here for 7 years." (a misfit clip). The held page rightly stayed shut.
  - The model then taught the present perfect anyway (T27–T29), on the **Your job page with the *Your job* chip lit** (shot t13: "I have worked here for seven years" carded under "Your job").
  - The Present perfect page opened only at 6.12, in the same reply that opened Past simple at 6.16 (T33, on "Uh, next.").
  - Afterwards *Present perfect* shows green and *Past simple* is lit (t16).
  - Elsewhere it holds:
    - the Japanese ask T16 → the Your job page on "Oh, yes.";
    - T37 → the Conversation page on "Uh, move on.";
    - pronunciation got its own page (T63).
- **Tester A: holds at the four asked changes, then fails once.**
  - The job, present perfect, past simple and conversation pages each opened on her yes.
  - The level chip went green only when the level was set at 3.99, after two refusals ("answered 2 of 3"). By then the job part had already begun.
  - At T77 she asked for more past-simple examples, and `go_to_page` went back to the Past simple page.
  - The next reply's runtime ask (T78) then named the part after *that* page: "Next is Pronunciation, a short optional practice. **Next comes conversation.** Shall we move on…?".
  - Her later corrected sentence was carded on the Past simple page (T82, 16.95).
- **Tester B: holds.**
  - Your job (T14, on "I'm ready."), Present perfect (T26, on "Yes."), Past simple (T42, on "…move on to the next conversation.") and Conversation (T57) all opened with the chip.
  - The summary page was held at T71 and never opened, because the run ended first.
- **Pronunciation** got its own page whenever it was taken: James T63 (Tester A never reached it).
- **No page was titled "Level check" on the client.** The server stores the level-check page, but the client shows the overview page and then the job page.

### B. The ask at every part change
| Learner | Changes / asks | Wording repeated word for word | Ask without the part's name | Answers that did not open the page (and whether that was right) |
|---|---|---|---|---|
| Josh | 2 / 2 | none | none | none: "Do you want me to start now?" and "Yes." both opened |
| James | 4 / 5 | none | none | T26 "I work here for 7 years." (right not to open, but the model then taught the part anyway: A). T30 "Uh, time management." (right) |
| Tester A | 5 / 7 | none | **T78 names the wrong part** ("Next comes conversation" after the model said "Next is Pronunciation") | T55 "Yes." to T54 (it answered the trailing check-in "Is that clear…?", see D, so the ask was repeated at T56; right given the double question). T79 "I don't really know." (right) |
| Tester B | 4 / 6 | none | none | T11 "and lady." (misheard; right, re-asked in Japanese). T53 "We met a new business partner there." (content; right, re-asked) |

- Asks were made in Japanese where the learner was taught in Japanese (James T16; Tester B T12, T24, T40, T52), and in English elsewhere.
- **The recap line** was present at most changes ("That completes the part on your job", "Your job is done", "Present perfect is done", "Past simple はこれで終わりです", "これで「Your job」は終わりです"). The asks without one are James T25 and Tester A T12.
- **T78 (Tester A)** was a reply to a 2-second silence turn, sent as her clip started. It closed the conversation and offered pronunciation, and the runtime then appended a part ask naming conversation.
  - The cause, read from the code: `v2PartInHand` follows the page in view. After `go_to_page` back to Past simple, the "next part" is conversation again.
  - This is a code defect: going back to an earlier page for a learner's question moves the part in hand back.

### C. Learner sentences on the board
| Learner | Boarded / should-have-been | Misses | False cards |
|---|---|---|---|
| Josh | 5 / 7 | T22 (a recast, "So you schedule classes for many teachers"); T24 ("Your sentence about responsibilities is fine") | none |
| James | 12 / 13 | T59 ("attended… last year" called right; a near-duplicate card already stood) | **T55** "It definitely has helped me understand the speed of change.": he said "It definitely has. Um, I think less." and the tutor said it had not caught it |
| Tester A | 11 / 11 | none | none. T32 is the tutor's example with an invented number ("…for three years"), shown as an example, not as hers |
| Tester B | 19 / 19 | none | **T65** "Who makes the content?" and "Who makes the content in your project?": two cards from a misheard fragment ("who is making for the content") taken as her question. T48 is a borderline reconstruction from a fragment |

- **No cards during the level check** in any run (text runs included: Josh-stop T8 and Tester B-text T8 corrected without a card).
- **Tutor model cards:** Tester B T14 put three example sentences up as cards ("I work in sales." …). These are the tutor's own sentences, not labelled as hers.

### D. Two asks in one reply
- **Josh:** none.
- **James:** 1. At T31, "…もう一度言ってもらえますか？" is followed by "Next is past simple. Shall we go on? Or do you have a question first?".
- **Tester A: 5. Each is an ask followed by the runtime's check-in:**
  - T26 "Start with: I have worked in accounting for…" + "Does that make sense so far?";
  - T34 "Please answer with a number: I have worked in accounting for…" + check-in;
  - T36, a Japanese 「…入れてください。例えば…」 + "Is that clear, or shall I go over it again?";
  - T54, the Japanese part ask 「質問がありますか、それとも次に進みますか。」 + "Is that clear, or shall I go over it again?";
  - T71 「もう一度言ってもらえますか。」 + an explanation + "Does that make sense so far?".
- **Cause, read from `v2/one-question.ts`:**
  - `HAND_OVER` has no "start with" or "answer with" (T26, T34).
  - `v2ReplyAsks` uses `asksAnywhere`, which splits only on `.?!` and does not see a Japanese question that ends in 「か。」 (T54, T71). `v2ReplyHandsOver` has the か-rule; `v2ReplyAsks` does not.
  - T36 is the accepted "last sentence only" ruling: an example after the ask.
- **Tester B:** 1. T59 "この文をもう一度言ってみてください。その後、このプロジェクトであなたの役割は何でしたか？": a retry and a new question, both from the model.
- **A reply handing over with no question at all:** none found.

### E. `/x/` phonetic notation in speech
None. No `/…/` and no bracketed IPA appear in any stored tutor reply, voice or text, and pronunciation in voice went only as far as "responsibilities" (James).

What this cannot show: the harness does not record the speech text sent to TTS, and no "/z/"-type comment came up. Whether the voice says "the z sound" needs a by-ear run.

### F. Level check
| Learner | Plan questions | Follow-ups | Re-asks of the same question | Level set | `segment_overlong` |
|---|---|---|---|---|---|
| Josh | 3 | 0 | 0 | after the 3rd answer (2.66) | none |
| James | 2 (the 3rd was never asked) | 1 (T6) | 3 (T10, T12, T14 after "sorry / don't understand / repeat") | 2.91, before his answer to the last re-ask | 1 (level-check, 3.27) |
| Tester A | 3 | 1 (T8) | 0 | refused twice ("answered 2 of 3"), set at 3.99 inside the job part | none |
| Tester B | 3 | 1 (T4 "Which products does your division sell?") | 0 | 3.14 | 1 (level-check, 3.75) |

- **Holds for Josh and Tester A.**
- **James: the cap holds,** since re-asks count as the same question. The check still ran 6 tutor turns (overlong).
- **Tester B: holds** (3 questions + 1 follow-up), but the check still ran long: the level was set at 3.14 and `segment_overlong` fired at 3.75, because her answers are long.
- **Tester A: the level chip went green 1.2 min late.** "No, I didn't." was not counted as an answer.

### G. The close
- **Josh** and **James:** each ended on a firm stop ("I would like to end the session", "I have to finish now"). Summary, next-time line and goodbye came in one reply. That is accepted for a stop, there was no invitation, and the next-time line was said once each.
- **Tester A: the invitation holds, but the next-time line was said twice.**
  - The summary (T86, 18.42) ends "Do you have any questions before we finish?". `end_lesson` was refused ("wait for their answer"), and the lesson ended on her answer (T88).
  - The next-time line came twice:
    - T86: "Pronunciation was not reached today; we can practise it next time. 発音は次回にしましょう。"
    - T88: "Next time we'll practise pronunciation and the present perfect with 'for' and 'since'. 次回は発音から始めましょう。"
  - 7d meant the line to wait for the closing reply.
- **Tester B: not judgeable.** The run ran out of clips at 18.0 min. Before that:
  - T71 offered "pronunciation now, or straight to the summary?", and the summary page was held.
  - Her answer was off-topic (a misfit clip).
  - The model then asked **"Do you have any questions before we finish?" with no summary given** (T73, 17.38).
  - The final review's I3 guard only stops the *runtime* recording such an invitation. Whether the lesson would have closed without a summary is unknown.

### Latency around part changes
The measures are clip end → first words (from `brain_turn` first-sentence times) and clip end → reply complete (log). For Tester A the brain events cannot be matched turn by turn, so only her model times are given.

| Learner | Asks | Page openings | Median, other turns |
|---|---|---|---|
| Josh | T10 2.3 / 8.1 s; T14 4.2 / 6.3 s | T12 1.5 / 4.5 s; T16 1.0 / 3.2 s | 1.7 / 4.3 s |
| James | T16 2.4 / 2.6; T25 5.2 / 8.0; T29 1.1 / 2.1; T37 4.1 / 6.5 | T18 4.4 / 7.6; T33 (two pages) 2.7 / 8.9; T39 2.1 / 2.6 | 2.1 / 4.2 |
| Tester A | T12: model first sentence 4.4 s (Brain 10.4 s, 1,938 output tokens), reply complete **10.7 s**; T18 1.8 s model | T14: model 5.6 s (Brain 10.3 s), complete **11.0 s** after a 1-s "Yes."; T20 2.1 s model | complete 5.0 s |
| Tester B | T10 4.6 / 9.3; T24 2.0 / 4.2; T40 6.0 / 10.0; T52 3.8 / 6.1 | T14 2.4 / 5.0; T26 2.5 / 6.8; T42 3.2 / 5.5 | 3.3 / 5.8 |

- Part-change turns are slower than ordinary turns by roughly 1–3 s to first words.
- **Tester A's first ask and first page opening** took about 11 s from the end of her clip to a complete reply. The model wrote around 1,900 output tokens there. This is the round-4 Tester B pattern (11.1 s).
- James T25 and Tester B T40 also came in at 5–6 s to first words.

## Text replays (`text/`, `gdi-real-*`, `--no-speech`)
| Fixture | Session | Min | Ended |
|---|---|---|---|
| gdi-real-stop | embed-1794903282717 | 2.8 | stop obeyed, one summary + goodbye |
| gdi-real-josh | embed-1794903243930 | 9.4 | cap (22 student turns) |
| gdi-real-james | embed-1794903262612 | 14.6 | time cap |
| gdi-real-t2 | embed-1794903377755 | 12.9 | tutor close |
| gdi-real-t3 | embed-1794903397327 | 13.8 | tutor close |

**Task 7's part-flow, ask-every and close-invitation rules are gated to voice sessions** (`session.mode === 'voice'` in `v2AskEveryOn`, the `partFlow` line in turn.ts, and `v2CloseInviteOn`). The text replays therefore show the older text path:
- The asks are the model's own, and the same line, "Shall we go on, or do you have a question first?", ends 4–5 asks per run (James, t2, t3).
- Josh T22 and t3 T24 change part with no ask.
- t3 T16 asks without naming the part.
- An unnamed page is not retitled: James T40 "Project I'm proud of" left the *Past simple* chip lit.

None of this is in GDI's voice product. It is listed so nobody reads the text runs as a check of Task 7.

**What the text runs do check:**
- **Level check (F):**
  - Josh: 3 questions, 0 follow-ups.
  - t2: 3 questions + 1 follow-up; the level was estimated after a refusal.
  - t3: 3 questions, 0 follow-ups.
  - stop: 3 questions, 0 follow-ups.
  - James: 2 questions, 1 follow-up and 2 re-asks; `segment_overlong` fired at 2.64.
- **No cards during the level check.**
- **Learner cards are uneven in text:**
  - every correction was boarded;
  - sentences called right first time were rarely boarded: Josh 0/8, t2 0/12, James 5/8, t3 good.
- **No `/x/` notation, no stall, no PAGEERROR.**
- **A text-only regression against v2final:** in t2 (T52) and t3 (T52), the summary reply says "Thank you, and see you next time!" and then the next-steps menu ("Would you like something harder, more practice, to ask me a question of your own, or stop here?"). This comes from `end_lesson` being refused with "whether to stop is the student's choice". The v2final text runs ended cleanly.

## Findings, in order of weight
1. **Code: two asks in one reply (D), 5 times for Tester A.**
   - The runtime check-in follows asks that `one-question.ts` does not see: "Start with: …" and "Please answer with…" are missing from `HAND_OVER`, and `v2ReplyAsks` misses Japanese questions ending 「か。」.
   - One of these (T54) turned a part ask into a double question, and the ask had to be repeated.
2. **Code: going back to an earlier page moves the part in hand back (A/B).** Tester A T77–T78: the runtime ask named "conversation" right after the model offered pronunciation, and a conversation sentence was carded on the Past simple page.
3. **A content answer to a part ask leaves the page shut, but the model teaches the next part anyway (A).** James T25–T33: the present perfect was taught on the job page with the job chip lit. The page opened only with the next part's page, which is the mic test's flag 5 by another route. Fixing this needs either the page to open when the next part is taught, or the model to be held to the part in hand.
4. **The next-time line was said twice in the close (G).** Tester A T86 + T88.
5. **An invitation with no summary (G).** Tester B T73 is model wording. Whether it would have closed without a summary could not be seen, because the run ran out of clips.
6. **False learner cards (C).** James T55 boards a sentence he did not say, after "I didn't catch it". Tester B T65 boards a misheard fragment as her question.
7. **Latency at the first part change (Tester A, about 11 s to a complete reply).** The model wrote about 1,900 output tokens there.
8. **Small items:**
   - Josh T36 speaks a sentence after "Goodbye, and see you next time!".
   - Josh T12 speaks its two board sentences before their lead-in.
   - James T29/T31 asks twice running.
   - Tester A's "the current company" is accepted again.

**What holds compared with round 4:**
- asks at every part change in voice, never word for word;
- the chip stays on the part in hand during an ask;
- a held page opens on the learner's yes, in English and Japanese;
- pronunciation gets its own page;
- the level check is green once the level is set;
- no cards during the level check;
- most corrections and right sentences are carded (47 of 50 across the four voice runs);
- no `/x/` notation;
- the invitation is asked once and the lesson ends on the answer (Tester A);
- pronunciation was offered to Tester B, who in round 4 was neither offered it nor told it was for next time;
- no garbage transcripts, no stalls, and the retry cap of 2 holds.

**Regressions against round 4:**
- In voice: none clear-cut. The double questions (D) existed before, and were hidden by the old frame budget.
- Tester A's first-ask latency matches round 4's Tester B pattern (11.1 s) rather than being new.
- In text: the goodbye + menu close (t2, t3).

## What replays cannot show
- **Pronunciation scores:** no learner recording repeats a practice word. James's two Azure attempts came back `not_attempted`, which is correct.
- **How it sounds:** the tutor voice was silenced, so these runs cannot show:
  - whether "the z sound" is spoken in place of "/z/";
  - the pacing;
  - echo and barge-in.
- **Real learners' answers to the asks:** the clips answer the 11-16 live lessons, not v2's questions. Misfits were 7, 10, 14 and 4 per run. Some content answers to part asks (James T26, Tester B T53) and the long retry chains (Tester A) are harness-made.

## Budget
- **Pool (gdi-demo): 117.4 min** (839.2 → 721.8 remaining):
  - voice 60.2 min (8.8 + 13.8 + 19.2 + 18.4);
  - text 57.2 min.
- **STT (Ink):** 58.9 min of socket time, carrying 12.8 min of learner audio.
- **Pronunciation (Azure):** 2 calls (James).
- **TTS:** none.
- **Prod writes:** only the app's own session, profile and level rows for the `gdi-v2-replay-*` ids. Nothing else was written; the session rows were read only.
- **Dev server:** :3021, PIDs 48967 and 48977, stopped by PID. Port 3019 (PID 38221) was not touched.
