# GDI on v2: Praveen's mic test 1 (2026-11-17), the findings and handoff

For a fresh Claude Code session. **Read this whole file first**, then the SDD ledger at
`.superpowers/sdd/2026-11-13-gdi-on-v2-plan/progress.md`, which is the history of this branch.

## Where things stand

- **Worktree:** `/Users/luke/Dev/evelynlearning/.claude/worktrees/gdi-v2`, branch `gdi-v2`.
  - HEAD: the commit that adds this file, on top of `9cca3a3c`.
  - Not pushed and not deployed.
  - `test:all` passes 455/457; the two failures are the known baseline (`embed-debug-coverage`, `portal-student-scoping`).
- **Plan:** `docs/superpowers/plans/2026-11-13-gdi-on-v2-plan.md`.
  - Tasks 0–6g are done and reviewed.
  - This mic test is **Task 7**.
  - Task 8 (`gdi-demo` row → v2, pins, `wt.sh finish`) and Task 9 (deploy) wait for Praveen's word, and come after the
    testers finish (Fri 11-20).
- **Replays:** four rounds of real-voice replays live in `docs/superpowers/plans/gdi-v2-baseline/v2audio*/RESULTS.md`.
  The comparison page is https://claude.ai/artifact/9nzLMTeeMWAh23FoR6aSvF.
- **Rules that still hold:**
  - Work in the worktree only, never in the root checkout.
  - GDI behaviour is general v2 capability behind default-ON `NEXT_PUBLIC_TUTOR_V2_*` flags. No tenant or learner names
    in prompts or engine code.
  - Do not regress the other v2 tenants: the maths and science voice demos, Crimsora, evelyntutor, and GAC text homework.
  - Port 2710 is the PROD Mongo: reads are fine, writes need Praveen.
  - Learner audio stays on the laptop.
  - No push or deploy without Praveen.

## The session

- **Student:** `gdi-trial-praveen-tomk3i`, session `embed-1794882458629`. It ran 17.6 min, work-projects lesson, Ryota.
- **Flags:** 12 flags and 16 shots in `apps/tutor/.v2-flags/gdi-trial-praveen-tomk3i/`. That folder is gitignored, so
  look there. `flags.jsonl` holds each note with the turn, the board and what was being spoken.
- **Session row:** a read-only copy of the transcript and debug events is in prod `evelyn.tutorsessions`
  (sessionId above).
- **Lesson progress at the end:** completed `overview, topic-intro, past-simple, open-conversation`. Level check and
  present perfect were **never** marked done.

**What worked:**
- The level check was conversational and simplified a question after a confused reply.
- `set_working_level` set the level to intermediate.
- Corrections came one at a time with a retry, and the two-try cap held.
- Pronunciation **was measured for real**: 59/100, then 66/100 (Azure). The comment matched the score ("was" dropped).
- The summary named his own sentences.
- One goodbye, and the time was respected.

## Findings (Praveen's flags first, then mine)

Each finding gives what he saw, the evidence, the cause where it is known, and the fix direction. **D** marks a product
decision Praveen made in his notes. It overrides earlier rulings.

### A. Part chips and pages do not follow the lesson (flags 1, 2, 3, 5, 9, 10, 11)

The chip strip and the board pages are the learner's map. In this session they disagreed with each other and with what
the tutor was doing:

- **3.76, flags 2–3.** The reply that ended the level check opened the "Your job" page and also marked a goal.
  "Your job" went green at once, the level check stayed grey, and the *Present perfect* chip lit up while the tutor was
  still asking about his job.
- **6.64 → 7.52, flag 5.** The present perfect page was held ("new_page → not opened yet: the student is asked first").
  He said "yes, we move on", and the page was **never opened**: there is no `new_page` at 7.52. Present perfect was
  taught on the "Your job" page.
- **9.17, flag 7.** A "Past simple" page opened in the same reply that praised his present perfect sentence. The tutor
  was still talking about present perfect when the board moved.
- **10.84, flag 9.** "Your project" (conversation) opened with no "shall we move on?". *Conversation* lit up, and his
  sentence went onto that page.
- **14.62, flag 10.** The tutor asked "practise pronunciation, or skip to the summary?". The *Pronunciation* chip was
  already lit, because the conversation goal had been marked done in that reply.
- **15.79, flag 11.** Pronunciation ran on the "Your project" page; no page was opened for it (shot-15).

**Cause, read from the code:**
- The chips come from `v2/progress.ts` `v2Progress`. "Current" is the part after the most recently marked goal, so
  marking a part done lights the **next** chip before that part has started.
- The goals themselves were marked loosely: level check never, present perfect never, `topic-intro` early.
- Pages are opened by the model, and a held page is dropped when the reply that opens the next part doesn't repeat the
  `<board page>`.

**Fix direction (structural, labelled plans):** one rule ties chip, page and part together.
- **A part starts with its own page.** When the lesson moves into a plan part, its page opens, titled by the part's
  label. That covers a held page released on the learner's yes, and pronunciation.
- **The lit chip is the part whose page is open,** not "the part after the last mark". Green means done. A part that
  was taught counts as done when the lesson moves past it, so present perfect turns green when past simple opens.
- **The level check is done when `set_working_level` is called.**
- Measure it from the bundle and test it on this session's shape: every part change shows the page, the chip and
  "Next is …" naming the same part.

### B. D: ask before every part change (flag 9)

Praveen: *"after your job is over, it should … ask should I move on to present perfect or do you have any questions?
… The same thing at past simple … rather than jumping on its own whim."*

- **This reverses the Task 6e rule** (`PART_OFFER_ONCE`: at most 2 frames per lesson, never two changes in a row). That
  rule came from replays where the frame was repeated word for word.
- **New rule:** ask at every part change, but never word for word. Vary the wording, and give one line on what was just
  done ("Good, that's your job covered. Next is the present perfect. Any questions first, or shall we go on?").
- **Keep:** the frame names the part actually opening; a "yes" opens that part's page (finding A); a question gets
  answered first.
- **Drop:** the 2-per-lesson budget and the "not twice running" rule.
- Check the Japanese frame matcher (Task 6g) still drops a *repeated identical* frame only.

### C. D: board every sentence the learner gets right (flags 4, 8)

Praveen: *"every time a corrected sentence is spoken by the learner, it should be written on the whiteboard, with the
corrections if needed."*

What happened:
- At 6.27 and 6.63 the tutor corrected him twice, and neither correction was boarded (flag 4).
- At 10.84 "Last year I went to Robotics Expo in Beijing" was praised and not boarded (flag 8).

Fix direction:
- After a practice or corrected sentence, the learner's sentence as it should be goes on the board as a sentence card:
  the corrected form, with the changed words stressed and a short Japanese gloss of the point.
- That covers both a sentence that was right first time and the corrected version after a retry.
- Not during the level check (flag 2 asked; Praveen is "fine either way"). Recommend no cards during the level check, so
  it stays a conversation. Say so in the report.

### D. Two questions in one reply (flag 6)

At 8.36 the tutor said "Please say that sentence again." and then "Does that make sense so far?". He couldn't tell which
to answer.
- The second question is the runtime's check-in. "Please say that sentence again" was not seen as handing the turn over,
  the same family as Task 6e F2 ("Now you say it").
- **Fix:** any imperative ask (please say / repeat / try / tell me) counts as an ask, and no check-in is ever added to
  a reply that already asks something.

### E. "/z/" read aloud as "slash z slash" (flag 12)

At 16.42 the tutor said "a buzzing /z/ sound, not /s/". The voice read the slashes.
- **Fix in the speech text only:** turn `/x/` into "the x sound" or "x", and keep the IPA on the board.
- Add one constitution line or language-section line: in speech, name a sound in words, never with phonetic symbols.

### F. Mine: level check ran long

- `segment_overlong` fired at 3.74: six tutor turns, five questions. The plan says three.
- "Have you ever worked with an international customer?" is fine as a question, but the check then asked follow-ups
  ("What do you sell to them?") before the third question.
- **Fix direction:** follow-ups don't count as questions, but the check closes after three answers plus at most one
  follow-up.

### G. Mine: the lesson ended in the summary reply

At 17.57 the summary, the goodbye and `end_lesson` all came in one reply, with 2.4 min left. He got no chance to ask a
question or say goodbye.
- Probably fine for a 20-min trial, but GDI's checklist has "the student invited to ask questions".
- **Fix:** before the summary, or in it, ask once "any questions before we finish?" when time allows. End on the
  learner's answer.

### H. Mine: the local test setup lost every audio chunk

- The server log has 107 × `EACCES: permission denied, mkdir '/var/data'`. These are the "96 Issues" badge in the
  shots.
- The worktree `.env.local` has no `TUTOR_AUDIO_DIR`, so the session recording was not saved.
- `docs/whitelabel/gdi/demo/run-local.sh` sets `TUTOR_AUDIO_DIR=$HOME/.evelyn/local-audio`. Do the same when starting
  the local server (below).
- This is a test-setup problem only; prod is unaffected.

## Suggested order

1. **A + B together.** They share the part-change path in `turn.ts` / `part-close.ts` / `plan-map.ts` / `progress.ts`.
   This is the biggest item and the one Praveen noticed most. Check the maths and science demos are unchanged: their
   plans carry no labels, so gate on labelled plans as earlier tasks did.
2. **C.** Sentence cards after a practice sentence.
3. **D, E.** Both small.
4. **F, G.** Prompt or facts level; check them in a replay.
5. Then a text replay of `gdi-real-*` and one real-voice round (`run-replay.ts --audio-student`, ~55 pool min). Then
   hand Praveen the local test page again for the rest of his mic tests.

Process:
- Subagent-driven, like Tasks 6c–6g: brief → implementer → task review → fix loop ≤5 → ledger.
- Use the same ledger.
- `npm run test:changed` per task; `test:all` before handing back.

## Running the local test page again

```bash
cd /Users/luke/Dev/evelynlearning/.claude/worktrees/gdi-v2/apps/tutor
NEXT_PUBLIC_TUTOR_BRAIN_VERSIONS=gdi-demo=v2 TUTOR_AUDIO_DIR=$HOME/.evelyn/local-audio \
  nohup node ../../node_modules/.bin/next dev --turbopack -p 3019 > /tmp/gdi-local-3019.log 2>&1 &   # note the PID; stop it by PID
cd ../../docs/whitelabel/gdi/demo
PARTNER_SECRET="$(cat ~/.evelyn/partners/gdi-demo.secret)" PORT=3019 node mint-demo-links.js trial --testers 0 --ttl_hours 72 --local
PARTNER_SECRET="$(cat ~/.evelyn/partners/gdi-demo.secret)" PORT=3019 node mint-demo-links.js --ttl_hours 72 --local   # starter / advanced / meeting
```

**What a local session does:**
- Uses the real tutor voice (Cartesia) and real pronunciation scoring: the worktree `.env.local` has
  `TUTOR_PRONUNCIATION_VENDOR=azure`.
- Charges the gdi-demo pool (about 855 min left on 11-17).
- Writes its session row to prod.
- Starts the app's cron, so stop the server when done.

**Links:**
- Never use the `gdi-trial-1..N` ids: those are the real testers' learner rows.
- The "praveen" link is a fresh learner. Opened again, it is a returning learner, and the level check is skipped.

**Flag and Shot:**
- Flag (`` ` ``) and Shot (`\`) are on automatically in `next dev` (`V2FlagBar.tsx`).
- Notes save to `apps/tutor/.v2-flags/<student>/`.
- Last time the page with these links and instructions was a scratch HTML file. Rebuild it the same way: links,
  Flag/Shot help, a "listen for" list.

**Still to test** (Praveen, on the rest of the links):
- the returning learner (level confirm only);
- a beginner who needs Japanese (the starter showcase);
- the advanced and meeting showcases (Jameson has no `background` in `teachers.json` yet, so he won't talk about himself);
- Japanese echo and barge-in;
- the firm stop ("Sorry, I have to finish now").
