# GDI (Nagoya) voice English lessons on the v2 brain — plan

Written 2026-11-13 for a separate Claude Code session to execute. Research behind it: two read-only sweeps of the
code at main `04e67789` (file:line references are from that commit; re-check them). This is the larger of the two
ports: read the whole plan before starting.

## Decisions already made (Praveen, 2026-11-13)

- **Keep the fixed trial-lesson script.** Same lesson, same ordered parts (overview → level check → topic → present
  perfect → past simple → open conversation → pronunciation → summary), same level check and pronunciation work.
  v2 delivers it.
- **Switch at once** when done: the `gdi-demo` row goes to v2 and :3009 is redeployed. v1 stays in the code as the
  rollback.
- **No date.** Quality over speed. **Praveen will do the real-microphone test** (v2 voice has never had a real mic,
  nor a Japanese speaker). Ask him when the build is ready for it.
- Automated runs must not spend Cartesia: replays run text mode with `--no-speech` (see
  `scripts/tutor/replay-harness/run-replay.ts`). Only Praveen's mic test uses real voice.

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

## Target design: a script mode in v2

The principle that keeps v2 v2: **the script is session data, not new constitution rules.** The constitution stays
generic (its test forbids partner names, `test-brain-v2.ts:64`); everything GDI-specific arrives as the plan, the
session part, facts and tools.

1. **Languages through the stack.** Add `languages` to `V2Session` (`v2/types.ts:16-32`), carry it through the
   brain-v2 route body and `client.ts`. In the session part (not the constitution), a bilingual section built from
   `buildBilingualClause` (`ai/system-prompt-builder.ts:2226-2265`): reuse its content, but cut it down to the
   principles (Japanese explains, English is the target; polite です/ます; no romaji; the learner produces, not
   repeats; stop hinting after two tries; say a closing in one turn). Each line kept must name the failure it
   prevents (the repo rule: rules carry their reason).
2. **Script mode, server-held.** When `plan.metadata.fixedScript`:
   - The plan map shows the **current part in full** (including `teacherNote`, `requiredPhrases`, the singular
     `hint`, pronunciation targets) and the remaining parts as a short outline. Fix `plan-map.ts` to keep those fields.
   - v2 state gains `script: { part, turnsInPart, skipped[] }`. A new control tool `next_part` (with a reason)
     moves on; the server also moves on by itself when `turnsInPart` reaches the part's `maxTurns`, and says so in the
     facts ("this part's turns are used: close it in this reply and move on").
   - Transitions: the part's `transition` (offer / bridge) becomes a fact for the reply that closes the part.
   - Required phrases: a check after the reply (like v2's existing board check) that a closing part's required phrase
     was said; if not, one regeneration with the reason. Same for the summary.
   - `is_trial` must not unlock "leave the plan" in script mode.
   - Rail labels: `labelLocalized.ja` drive the progress chips (`progress.ts`, `rail-labels.ts:107`).
   - Port the transition and close behaviours that the 17 waves tuned (`fixed-script.ts`, 1,421 lines): read it and
     the typed-turn rules; carry over every behaviour that has a named incident behind it, as facts or as server
     moves, not as prose rules. List what you deliberately drop in the PR.
3. **Spoken opener.** Segment 1's `script` is spoken verbatim by the client (as `lesson-plan/spoken-opener.ts` does for
   v1), then the brain's first turn starts at segment 2. Opener prefetch: wire `openerPrefetch` into `TutorVoiceV2`
   (today only the text client's `prewarm` exists) or drop it if the verbatim opener makes it moot (likely: the opener
   needs no model call).
4. **Level check.** A `set_working_level` control tool for v2 (reuse `level/working-level.ts`), stored on
   `StudentProfile.workingLevel`; the level-check part is skipped when a level is known (`skipWhenLevelKnown`); the
   Haiku estimate fallback (`/api/tutor/level/estimate`) when the tool was never called. Gate by the partner option
   `levelCheck`, passed to `TutorVoiceV2` (`TutorSession.tsx:1882-1886` passes it only to v1 today).
5. **Pronunciation.** Tap mic frames into `ClipCapture` (v2 taps them only for the recorder,
   `TutorVoiceV2.tsx:497`), call `/api/tutor/pronunciation/assess` (needs the live session row; check the route's
   gates), auto-arm from the part's `metadata.pronunciation` targets, and put the measured result in the next turn's
   facts ("'schedule': 54/100, the /ʃ/ was /s/"). Low score (<60) → the facts ask for one repeat. Gate by the
   partner option `pronunciation`. No praise of pronunciation without a measurement (v1 rule, keep it).
6. **Sentence cards.** A board kind for an English sentence with optional stress marks and a Japanese gloss (v1:
   `voice/sentence-board.ts`), and boarding the learner's good sentences at the summary.
7. **Japanese text handling in the voice client.**
   - `v2/sentences.ts:61` cuts only at `[.!?。！？]` followed by whitespace: Japanese has no space after 。, so a
     Japanese paragraph is spoken as one sentence. Cut after 。！？ without needing a space.
   - `v2/own-voice.ts:10` splits words on whitespace: Japanese echo is never caught (one "word" < `minWords=4`).
     Make it CJK-aware (characters or a tokenizer) — this is the echo risk on a real call.
   - Mixed-language TTS: reuse `tts-language.ts:83 splitSentenceForTts` so an English phrase quoted in a Japanese
     sentence is voiced in English.
   - Japanese end/stop signals (`lesson-close.ts:15-60, 279-282, 346`: `isSessionEndSignalJa`,
     `isPleasantryOnly`), firm stop (`isFirmStop` :209-238: "I have to finish now" closes at once), post-close
     silence.
8. **Close and time.** The time-limit hard stop (`useV2Turns.ts:349-362`) ends with no goodbye: add the wrap line
   (pass `sessionWrapMinutes`) and a goodbye. Decide the 45 s auto-end (`lessonCloseAutoEnd`) vs v2's 4 s close
   (`useV2Turns.ts:77, 263-274`): pass the option through and honour it.
9. **Voice-client maturity** (needed for any real call, GDI or not): `TutorVoiceV2.tsx:23-26` lists what is missing —
   a sustained-energy barge-in gate, mic re-acquire on `devicechange` (that bug came from GDI run 14), caption sync
   (`getSpokenCaption` is a stub, `TutorClientV2.tsx:29`). Fillers are optional.
10. **Gate.** `v2CanRunSession` admits `ja` only when the session's script mode and bilingual section are present
    (i.e. after 1–8); keep every other non-English language on v1. Then `gdi-demo: { brainVersion: 'v2', ... }`.
    Update the pins.

## Tasks (in order)

0. Worktree `scripts/ops/wt.sh new gdi-v2` off origin/main. Copy the gitignored GDI files the tests need
   (`docs/whitelabel/gdi/plans/*.json`, `docs/whitelabel/gdi/demo/*`) from the root checkout into the worktree.
1. **Baseline on v1.** A bilingual replay fixture in `scripts/tutor/replay-harness/fixtures/`: a Japanese adult learner,
   English B1, who answers partly in Japanese, makes a present-perfect error, mispronounces one target word, and
   later says 「ちょっと待ってください」 and finally "Sorry, I have to finish now". Run it on v1 (text mode,
   `--no-speech`; the typed-turn engine runs in text too — check) and keep the bundle. Also run
   `scripts/trial-text-session.mjs` on v1 and keep its check output: it is the existing GDI quality bar.
2. Languages + bilingual session section (1) + Japanese text handling (7). Unit tests.
3. Script mode (2) + spoken opener (3). Unit tests: part advance by tool and by budget; skipped level check; required
   phrase regenerated; `is_trial` does not unlock leaving the plan.
4. Level check (4), pronunciation (5), sentence cards (6). Tests reuse `test-working-level`, `test-pronunciation-*`
   inputs on the v2 path.
5. Close and time (8). Voice maturity (9).
6. **Run the fixture and `trial-text-session.mjs` on v2** locally with `NEXT_PUBLIC_TUTOR_BRAIN_VERSIONS=gdi-demo=v2`
   in the local env only. Every check that passed on v1 must pass on v2; list any that do not and why.
7. **Praveen's mic test** on the local build (he speaks; ask him for a time). Watch: echo of Japanese TTS, barge-in,
   long Japanese sentences, pronunciation scores arriving, the firm stop.
8. Gate (10) + pins. `npm run test:changed`, `npm run test:all` (baseline failures: `embed-debug-coverage`,
   `portal-student-scoping`). `wt.sh finish`.
9. Deploy `./deploy-tutor.sh` (:3007, shared code; GDI traffic is on :3009) then `./deploy-tutor-demo.sh` (:3009).
   One live check with a fresh `gdi-trial-N` link (mint with `mint-demo-links.js`), read its session row.

## Rollback

`gdi-demo` row back to v1 (or `NEXT_PUBLIC_TUTOR_BRAIN_VERSIONS=gdi-demo=v1` in the :3009 build env) and redeploy
:3009. The v1 typed-turn engine and its flags stay in the code untouched.

## Risks

- **Size.** ~9k lines of GDI modules and ~40 tuned switches on v1. Expect this to take several sessions; ship it in
  the order above with each step green, and do not flip the row until step 7 passes.
- **Echo on a real call** until own-voice is CJK-aware and the energy barge-in gate exists.
- **Prompt drift.** v1 GDI is held to a JSON schema with server refusals; v2 relies on the model. The required-phrase
  check and the facts are the substitutes; measure them in step 6.
- **Shared code and gitignored files.** The plan JSON and mint scripts are local only; the demo plans are DB-only.
- **Memory notes are partly stale** (e.g. wave 17 is on main). Trust the code.

## Open questions for Praveen

1. GDI already runs on a heavily tuned engine (typed turns, 17 waves, "READY" at run 15). What should v2 give GDI
   that it lacks today — better teaching quality, one brain to maintain, or something they asked for? The answer
   decides whether steps 2–3 port every v1 behaviour or only the ones that matter.
2. The showcase lessons (`gdi.demo.english.*`, starter / advanced / meeting): same script mode, or do they stay as
   they are?
