# GDI (Nagoya) voice English lessons on the v2 brain — plan

Written 2026-11-13 for a separate Claude Code session to execute. Research behind it: two read-only sweeps of the
code at main `04e67789` (file:line references are from that commit; re-check them). This is the larger of the two
ports: read the whole plan before starting.

## Decisions already made (Praveen, 2026-11-13)

- **No separate engine and no script mode.** GDI's own brief (`docs/whitelabel/gdi/samples/test-lesson-layout-and-requirements-2026-10-28.md`)
  asks for a lesson that is "adaptive, conversational, and student-centered", where "the conversation feels natural
  rather than scripted" and the AI "should prioritize learning outcomes over completing every planned activity within
  a rigid schedule". That is v2's plan-as-a-map, exactly as it teaches our own demo lessons. The v1 fixed-script /
  typed-turn engine was our October choice to hold a weaker voice brain in line; it is **not** carried over.
- What v2 needs is **general capability any language partner would use**, not GDI code: two teaching languages, a
  one-time level check remembered on the learner, measured pronunciation, and Japanese-aware voice handling.
- **Why: better teaching.** Where a tuned v1 behaviour is dropped, say so in the PR with the reason.
- **All GDI lessons move together**: the work-projects trial and the showcase lessons (`gdi.demo.english.*`).
- **Switch at once** when done: the `gdi-demo` row goes to v2 and :3009 is redeployed. v1 stays as the rollback.
- **No date.** Quality over speed. **Praveen will do the real-microphone test.**
- Automated runs never spend Cartesia: replays run text mode with `--no-speech`.

## Where things stand

- Brain choice: `apps/tutor/src/app/tutor-portal/embed/page.tsx:2556` + `v2CanRunSession`
  (`partner-session-options.ts:108-114`). GDI falls back to v1 **only** because its tokens carry
  `tutor_languages: ['en','ja']` (`:111` rejects any non-English language). Pinned by `test-brain-v2.ts:607, 622`
  and `test-partner-session-options.ts:70-91`.
- **Danger:** nothing checks the plan's `metadata.fixedScript`. Lifting only the language rule would run the GDI
  script as a free v2 "map": `plan-map.ts:17-27` drops `teacherNote`, `requiredPhrases`, `maxTurns`, labels and
  pronunciation targets, and the showcase's `is_trial` tells v2 it may leave the plan.
- GDI today does **not** run on ordinary v1 either: since 11-04 it runs on the **typed-turn engine**
  (`voice/typed-turn.ts`, `lesson-plan/typed-turn-rules.ts`; gate `VoiceTutorRealtime.tsx:13274`): the model
  returns JSON (ack / verdict / verdict_say / board / correction / support_ja / next) and the engine composes speech
  and cards, with ~40 `TUTOR_FIXED_SCRIPT_*` / `OFFER_*` / `MENU_*` switches tuned over 17 live waves
  (`flags.ts:930-1430`). The v2 design spec put fixed scripts explicitly out of scope
  (`docs/superpowers/specs/2026-11-09-tutor-brain-v2-design.md` §4.4). This plan brings them in.
- v2 already has for bilingual voice: Ink turn-end 3000 ms for bilingual sessions (`TutorVoiceV2.tsx:499`), per-sentence
  TTS language (`:434`), Japanese transcripts not filtered out. Everything else below is missing.
- The lesson: `docs/whitelabel/gdi/plans/gdi-work-projects-v1.json` (gitignored; also in DB `lessonplans`),
  `metadata.fixedScript: true`, 8 segments, each with `teacherNote`, `maxTurns`, `label` / `labelLocalized.ja`;
  segment 1 has a verbatim `script`; segment 2 is the level check (`skipWhenLevelKnown`); segment 7 has
  `metadata.pronunciation.words/sentences`; 1 and 8 have `requiredPhrases`. Showcase lessons `gdi.demo.english.*`
  live in the DB only. Trial links: `docs/whitelabel/gdi/demo/mint-demo-links.js` (gitignored, local).

## Target design: the GDI lesson as an ordinary v2 lesson plan

Nothing in this design names GDI. The constitution stays generic (`test-brain-v2.ts:64`).

1. **The plan as written.** The GDI plans are already lesson plans (ordered parts with goals, teacher notes, turn
   budgets, required phrases, pronunciation targets). Fix `v2/plan-map.ts:17-27` so the map keeps what it drops today:
   `teacherNote`, `requiredPhrases`, the singular `hint`, `responseFormat`, and the part's estimated minutes. The
   plan's `metadata.fixedScript` is ignored by v2 (v1 still reads it). `is_trial` (showcase links) must not make v2
   "leave the plan behind" for these lessons: decide whether `trial` should apply to any plan-led session at all.
2. **Two teaching languages.** `V2Session.languages` (`v2/types.ts:16-32`), carried through the brain-v2 route and
   `client.ts`. When a second language is present, the session part gets a short bilingual section built from the
   principles in `buildBilingualClause` (`ai/system-prompt-builder.ts:2226-2265`), cut to what matters, each line with
   the failure it prevents: English is the target and Japanese explains; how much Japanese follows the learner's
   level (GDI: beginner / lower intermediate get Japanese help, others little); polite です/ます; no romaji; the learner
   produces the English, not repeats it; after two tries give the answer and move on; one closing turn.
3. **One-time level check, remembered.** A general `set_working_level` control tool (reuse `level/working-level.ts`),
   stored on `StudentProfile.workingLevel`; the facts carry the known level on later sessions and the plan part
   marked `skipWhenLevelKnown` is skipped; the Haiku estimate fallback when the tool was never called. The working
   level goes into every turn's facts so the language, questions and corrections stay at that level (GDI's
   "adaptive learning" checkpoint). Gate by the partner option `levelCheck` (pass it to `TutorVoiceV2`;
   `TutorSession.tsx:1882-1886` passes it only to v1 today).
4. **Measured pronunciation.** Tap mic frames into `ClipCapture` (v2 taps them only for the recorder,
   `TutorVoiceV2.tsx:497`); a general control tool `practise_pronunciation({ items })` arms the next student turn for
   scoring through `/api/tutor/pronunciation/assess`; the score comes back in the next turn's facts ("'schedule'
   54/100, /ʃ/ heard as /s/"). Below 60 the facts ask for one more try. No comment on pronunciation without a
   measurement. Offered at the plan's pronunciation part and on request at any time (GDI's "optional pronunciation
   mode"). Gate by the partner option `pronunciation`.
5. **Sentence cards** for language lessons: an English sentence with optional stress marks and a gloss (v1:
   `voice/sentence-board.ts`), as an inline board kind; the learner's corrected sentences boarded in the summary.
6. **Japanese in the voice client** (must-have before any real call):
   - `v2/sentences.ts:61` cuts only at `[.!?。！？]` followed by whitespace: cut after 。！？ without a space.
   - `v2/own-voice.ts:10` splits on whitespace, so the tutor's own Japanese is never recognised as echo: make it
     CJK-aware.
   - Mixed-language TTS: reuse `tts-language.ts:83 splitSentenceForTts`.
   - Japanese end and stop signals and the firm stop (`lesson-close.ts`: `isSessionEndSignalJa`, `isPleasantryOnly`,
     `isFirmStop`).
7. **Time.** GDI sittings are 20 minutes (pool cap). The hard stop (`useV2Turns.ts:349-362`) ends without a goodbye:
   pass `sessionWrapMinutes` and say the wrap line and a goodbye. Pass `lessonCloseAutoEnd` through.
8. **Voice-client maturity** (needed for any real call): sustained-energy barge-in gate, mic re-acquire on
   `devicechange`, caption sync (`TutorVoiceV2.tsx:23-26` lists them; `getSpokenCaption` is a stub).
9. **Gate.** `v2CanRunSession` admits a second language once 2–8 are in. Then `gdi-demo: { brainVersion: 'v2', ... }`
   and update the pins (`test-brain-v2.ts:607, 622`, `test-partner-session-options.ts:70-91`).

## GDI's checklist is the acceptance test

Their PART 9 checklist (in the brief above) is what the runs in task 6 are scored against, item by item: overview
before the level check; three conversational level questions and a sensible level; visibly different beginner vs
advanced lessons; correct present perfect / past simple teaching; natural follow-ups; a corrected mistake with a
retry (Acknowledge → Correct → Explain → Practice → Continue); the student invited to ask questions; pronunciation
offered and measured; a summary that reflects this learner; pacing that adapts. Run the fixture twice: once as a
beginner who needs Japanese, once as an upper-intermediate speaker.

## Tasks (in order)

0. Worktree `scripts/ops/wt.sh new gdi-v2` off origin/main. Copy the gitignored GDI files the tests need
   (`docs/whitelabel/gdi/plans/*.json`, `docs/whitelabel/gdi/demo/*`) from the root checkout into the worktree.
1. **Baseline on v1.** A bilingual replay fixture in `scripts/tutor/replay-harness/fixtures/`: a Japanese adult learner,
   English B1, who answers partly in Japanese, makes a present-perfect error, mispronounces one target word, and
   later says 「ちょっと待ってください」 and finally "Sorry, I have to finish now". Run it on v1 (text mode,
   `--no-speech`; the typed-turn engine runs in text too — check) and keep the bundle. Also run
   `scripts/trial-text-session.mjs` on v1 and keep its check output: it is the existing GDI quality bar.
2. Languages + bilingual section (2) + Japanese voice handling (6). Unit tests.
3. Plan map fields (1) and the `trial` decision. Unit tests: teacher notes and required phrases reach the map.
4. Level check (3), pronunciation (4), sentence cards (5). Tests reuse `test-working-level`, `test-pronunciation-*`
   inputs on the v2 path.
5. Time (7). Voice maturity (8).
6. **Run the fixture (beginner and upper-intermediate) and `trial-text-session.mjs` on v2** locally with `NEXT_PUBLIC_TUTOR_BRAIN_VERSIONS=gdi-demo=v2`
   in the local env only. Score both against GDI's checklist. `trial-text-session.mjs` checks written for the fixed-script engine that no
   longer apply are listed and retired, not chased.
7. **Praveen's mic test** on the local build (he speaks; ask him for a time). Watch: echo of Japanese TTS, barge-in,
   long Japanese sentences, pronunciation scores arriving, the firm stop.
8. Gate (9) + pins. `npm run test:changed`, `npm run test:all` (baseline failures: `embed-debug-coverage`,
   `portal-student-scoping`). `wt.sh finish`.
9. Deploy `./deploy-tutor.sh` (:3007, shared code; GDI traffic is on :3009) then `./deploy-tutor-demo.sh` (:3009).
   One live check with a fresh `gdi-trial-N` link (mint with `mint-demo-links.js`), read its session row.

## Rollback

`gdi-demo` row back to v1 (or `NEXT_PUBLIC_TUTOR_BRAIN_VERSIONS=gdi-demo=v1` in the :3009 build env) and redeploy
:3009. The v1 typed-turn engine and its flags stay in the code untouched.

## Risks

- **Losing tuned behaviour.** v1's GDI engine was tuned over 17 live waves; some of what it fixed (menu picks,
  re-arming a word after a filler) will reappear in a different form. Praveen's mic test is where they show.
- **Echo on a real call** until own-voice is CJK-aware and the energy barge-in gate exists.
- **Time.** A plan-led lesson can overrun 20 minutes; the time facts and the wrap line hold it. Measure in step 6.
- **Shared code and gitignored files.** The plan JSON and mint scripts are local only; the demo plans are DB-only.
- **Memory notes are partly stale** (e.g. wave 17 is on main). Trust the code.

## Showcase lessons

The showcase lessons are DB-only plans (`apps/marketing/src/app/showcase/gdi-communications/_lib/lessons.ts:77-108`)
minted with `is_trial: true`. They run as ordinary v2 lesson plans like the trial; add one of them to the step-6 runs.
