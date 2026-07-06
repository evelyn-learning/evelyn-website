# Voice Harness (Phase 1)

Comparison harness + dev-only dashboard for the voice-stack overhaul. Generates
TTS clips across candidate Cartesia voices (+ current OpenAI Realtime control
voices) and streams a reference-transcribed accent corpus through three STT
engines, so a human can listen/read the results and pick winners before any
production code changes.

Spec: `docs/superpowers/specs/2026-07-06-voice-stack-cartesia-design.md`,
**Phase 1 — TTS/STT comparison harnesses + listening dashboard**. Phases 2–5
(actual engine migration, teacher×accent matrix, adaptive style, voice
cloning) are not started; this harness's output (a listened-and-verdicted
`candidates.json` plus STT engine picks per accent) is Phase 2's input.

## Why this exists

Today the tutor's voice runs entirely on OpenAI Realtime (`realtime-2` voices
+ `gpt-realtime-2` transcription) — one voice set for every geography. This
harness evaluates Cartesia Sonic 3.5 (TTS) and Ink 2 (STT) as a locale-aware
replacement: native/localized/accent-carryover voice candidates for
en-US/en-GB/en-IN/en-AR-Gulf/en-NL/en-DE, and a 3-way STT engine bake-off
(Ink 2 vs Deepgram Nova-3 vs OpenAI realtime transcription) per accent.
Nothing here is wired into the live tutor session — it's Node scripts +
artifact JSON + a dashboard that only mounts in dev.

## npm scripts

All scripts live in `scripts/tutor/voice-harness/` and write into
`artifacts/voice-harness/` (gitignored — regenerate, don't expect it to
exist after a fresh clone).

| script | flags | what it does |
|---|---|---|
| `npm run voice:discover` | — | Calls Cartesia's voice-list API for `en/hi/ar/nl/de`, writes `voices-catalog.json` (full catalog per language) and, **only if it doesn't already exist**, seeds `candidates.json` with 5 pinned native voices (Katie/Skylar/Jameson en-US, Gemma/Archie en-GB, all `enabled:true`) plus every `hi/ar/nl/de` voice as an `enabled:false` carryover candidate for `en-in`/`en-ar-gulf`/`en-nl`/`en-de`. Never overwrites an existing `candidates.json` — delete it first to regenerate from scratch. |
| `npm run voice:localize` | `-- <baseVoiceId> <male\|female> <label> [dialect=in]` | Calls Cartesia's `/voices/localize` on a base voice to mint an accented variant (`us`/`uk`/`au`/`in`/`so` supported), appends it to `candidates.json` with `technique:'localize'`, `enabled:true`. Example: `npm run voice:localize -- f786b574-daa5-4673-aa0c-cbe3e8534c02 female Katie` (en-IN by default). |
| `npm run voice:tts` | `[-- --run <runId>] [--provider cartesia\|openai-realtime] [--voice <substr>] [--utterance <id>]` | Full matrix: every `enabled:true` voice in `candidates.json` **plus** the 4 hardcoded OpenAI Realtime control voices (`coral`/`ash`/`sage`/`ballad`, current production `DEMO_TEACHERS` set) × the 12 authored utterances (`utterances.ts`, run through the real `rewriteForTTS`). Writes `artifacts/voice-harness/tts/<runId>/clips/*.wav` + `manifest.json` (per-clip `ttfaMs`/`totalMs`, errors inline). **Paid** — each run hits the Cartesia and OpenAI Realtime APIs for every clip. Requires `candidates.json` (run `voice:discover` first — a friendly error tells you if it's missing). |
| `npm run voice:corpus` | — | Reads `corpus/<accent>/clips.json`, resamples every listed source file to PCM16 mono 16kHz via ffmpeg into `<basename>.16k.wav`, validates the result. Run after adding new source clips to an accent directory. |
| `npm run voice:stt` | `[-- --engine ink2\|deepgram\|openai] [--accent en-us\|en-gb\|en-in\|en-ar-gulf\|en-nl\|en-de] [--fast] [--probe]` | Streams every clip in the selected accent(s)' `corpus/<accent>/clips.json` at real-time pace (unless `--fast`) into the selected engine(s), computes WER against the reference transcript and finalization latency, writes `artifacts/voice-harness/stt/<runId>/results.json` + raw per-clip event logs (`events/*.jsonl`). `--probe` runs only the first clip and prints raw events — use it before trusting a new engine's message shapes. Accents with no `corpus/<accent>/clips.json` are skipped with a log line, not an error. |
| `npm run test:voice-harness` | — | Unit gates (no network calls): `utterances.test.ts` (validates the 12 authored utterances + `rewriteForTTS` output), `wer.test.ts`, `audio-util.test.ts` (WAV/PCM helpers). Run this before any paid pipeline run. |

## `candidates.json` curation

`artifacts/voice-harness/candidates.json` is `{ "voices": VoiceCandidate[] }`
(shape in `types.ts`). Fields: `provider`, `voiceId`, `label`, `accent`
(`AccentKey`), `technique` (`'native' | 'localize' | 'carryover' | 'clone' |
'control'`), `language` (the Cartesia TTS `language` param — `'en'` even for
carryover voices, since we want English text spoken by an L1 voice), and
`enabled` — **this is the curation switch**. Only `enabled:true` voices go
into a `voice:tts` run (plus the always-on control voices).

Curation workflow after `voice:discover`:
1. Open `voices-catalog.json`, read each candidate voice's `description` for
   the language you're curating (`hi`/`ar`/`nl`/`de`).
2. Flip `enabled:true` for 2–3 per gap accent (`en-ar-gulf`, `en-nl`,
   `en-de`) and additional `en-in` carryover candidates, preferring adult,
   conversational/friendly/instructional voices — avoid ones described as
   character, narration, storytelling, or whisper/ASMR voices (teacher
   plausibility matters more than production polish for this listening
   round).
3. Run `voice:localize` for the en-IN variants of the shortlisted en-US/en-GB
   base voices you want to test as "same voice, IN accent" (as opposed to a
   different carryover voice entirely) — it appends directly, no manual
   edit needed.
4. `technique:'clone'` entries are supported by the type/schema for when
   accented clips are sourced for instant voice cloning, but there's no
   dedicated generation step in Phase 1 — add clone candidates by hand once
   clips exist (per the spec: "when/if sourced").

### Round-1 curation picks

The 8 carryover/localize voices enabled during the Task 9 pipeline run, and
why each was picked over the alternatives in `voices-catalog.json` (adult,
conversational/instructional, non-character voices preferred — see workflow
above):

| accent | voice | rationale |
|---|---|---|
| en-ar-gulf | Youssef - Clear Communicator | "Articulate delivery designed for seamless instructional content" — direct match for a tutor voice |
| en-ar-gulf | Maryam - Friendly Voice | "warm, conversational tone and natural rhythm, ideal for approachable conversations" — teacher-plausible warmth |
| en-nl | Stjin - Helpful Handler | "Approachable Dutch male for professional dialogue" — clean, non-character |
| en-nl | Anneliese - Methodical Guide | "Clear, articulate Dutch female for efficient professional assistance" — clarity-forward |
| en-de | Jan | "Clear adult male great for providing guidance and instruction" — closest to an explicit teaching descriptor |
| en-de | Jennifer | "Approachable adult female great for conversational support" — plain, non-character |
| en-in (carryover) | Palak - Presenter | catalog description literally says "Friendly female with a slight English accent for teaching use cases" |
| en-in (carryover) | Amrit - Helpful Guide | "Warm, conversational Hindi male voice for customer support, guided assistance" |

Skipped as not teacher-plausible: anything tagged storyteller/narrator/
whisperer/announcer/actor (Amira "Dreamy Whisperer", Hassan "Authoritative
Narrator", Rania "Spirited Storyteller", Klaus "Archivist", Andreas
"Recorder", Dieter "Commercial Man", Imran "Hindi Film Actor", etc.).

Plus 2 `en-in` `technique:'localize'` variants minted via `voice:localize`
(Katie and Gemma, the shortlisted en-US/en-GB native bases) — "same voice,
IN accent" as a direct comparison point against the carryover picks above.

## Corpus workflow (STT)

See `corpus/README.md` for full sourcing guidance (Common Voice, L2-ARCTIC,
VoxPopuli, EdAcc — license notes per source) and the `clips.json` schema.
Short version: one directory per accent under `corpus/<accent>/`, a
`clips.json` listing `{file, reference, source}`, then `npm run voice:corpus`
to resample everything to the 16kHz PCM16 the STT clients require. Only
`en-us` has a populated corpus in this repo today (one synthetic clip,
Task 5) — the other 5 accents (`en-gb`, `en-in`, `en-ar-gulf`, `en-nl`,
`en-de`) need real accented speech sourced by a human (registration walls on
L2-ARCTIC, accent filtering on Common Voice) before `voice:stt` can produce
results for them. `voice:stt` silently skips any accent with no corpus.

## Dashboard

`http://localhost:<port>/tutor/voice-harness` — **dev-only** (both the page
and its backing API route, `src/app/api/tutor/voice-harness/[...path]/`,
404 outside `NODE_ENV=development`; the API route also path-normalizes
against directory traversal). Two tabs:
- **TTS**: run selector → utterance × voice matrix (grouped by accent),
  per-cell playback, TTFA chip, pass/maybe/fail verdict (persisted to
  `localStorage`), JSON verdict export.
- **STT**: run selector → accent × engine WER/latency table, expandable
  per-clip transcript-vs-reference diff, source-audio playback.

Reads manifests via `GET /api/tutor/voice-harness/index` (lists available
run ids) and `GET /api/tutor/voice-harness/<kind>/<runId>/...` (serves the
JSON/WAV/JSONL files directly from `artifacts/voice-harness/`).

## Exit criteria (from the spec, Phase 1)

The user has listened/read the dashboard output and picked:
1. **One base Cartesia voice per teacher** (from the TTS tab's verdict
   export).
2. **Pass/fail per accent × technique** — e.g. "en-ar-gulf carryover: pass,
   ship it" vs "en-de carryover: fail, fall back to en-gb native" (spec's
   "test all, ship what passes, closest-native fallback for failures").
3. **STT engine verdict per accent** — which of Ink 2 / Deepgram Nova-3 /
   OpenAI realtime transcription wins per accent (spec locks Ink 2 as the
   primary English candidate with OpenAI STT retained as the multilingual
   fallback/rollback path regardless of this harness's per-accent verdicts).

These verdicts are Phase 2's (Cartesia migration) direct input — nothing
here changes production behavior on its own.

## Verified live API knowledge (from building this harness)

Task 4 (TTS) and Task 6 (STT) hit real APIs and found the docs/brief
guesses wrong in a few load-bearing ways. Recorded here so Phase 2 doesn't
have to re-discover them:

- **OpenAI Realtime GA `session.update` audio format is a typed object, not
  a bare string.** `audio.output.format: 'pcm16'` is rejected
  (`invalid_type: expected an object, but got a string`). Correct GA shape:
  `audio: { output: { voice, format: { type: 'audio/pcm', rate: 24000 } } }`.
  This is a beta→GA breaking change; production's `useOpenAIRealtime.ts`
  hasn't hit it yet because it never sets an explicit `format` (relies on
  the default), but any future change that does will need this fix.
- **OpenAI Realtime's implicit input sample rate is 24kHz, not the corpus's
  native 16kHz.** Feeding 16kHz PCM16 with no explicit `session.update`
  input format lets VAD's `speech_started` still fire (energy-based) but
  `speech_stopped`/transcription never completes — it silently hangs to the
  no-progress timeout with no error. Fix: resample 16kHz → 24kHz before
  sending (matches production's `usePerceptionWS.ts` implicit 24kHz
  contract).
- **Ink 2 (Cartesia STT) turn events**: the end-of-turn control message is
  `{type:"done"}`, not `{type:"finalize"}` (`finalize` gets a 400 —
  `"Unrecognized message type"`). The `transcript` field on
  `turn.update`/`turn.eager_end`/`turn.end` is the **cumulative** text for
  the whole turn so far (strictly append-only in observed sessions), not a
  delta and not nested under `turn.text`. There is **no `is_final` boolean**
  anywhere in the Ink 2 stream.
- **Deepgram** and **OpenAI realtime transcription** message shapes matched
  the design brief's guesses exactly (`{type:"Results", is_final,
  channel.alternatives[].transcript}` and
  `{type:"conversation.item.input_audio_transcription.completed",
  transcript}` respectively) — no surprises there.
- **TTS TTFA clock parity (OpenAI Realtime vs Cartesia).** `openai-realtime-tts.ts`'s
  `ttfaMs` is anchored to when `response.create` is actually sent, not to
  WebSocket construction — the latter bakes in TLS/WS handshake +
  `session.update` round-trip, which Cartesia's clock never pays (its TTFA
  starts at a bare HTTP request). **Caveat:** the `run-2026-07-06T16-14-19-090Z`
  TTS manifest (228/228 clips, referenced in Task 9's report) was generated
  *before* this fix — its `openai-realtime` TTFA values (median 785ms, p90
  1195ms) include ~200-500ms of connection setup and are overstated relative
  to Cartesia's numbers in that same manifest. Any run generated after this
  commit uses the request-anchored clock and is directly comparable;
  production itself is unaffected either way since it holds a persistent WS
  and only pays connection cost once per session, not once per utterance.
- **Honest latency anchoring matters for cross-engine comparison.** STT
  `finalLatencyMs` must be measured from the end of *real speech* being
  sent, not from the end of any padded trailing silence — anchoring to
  silence-end for OpenAI originally hid its ~1500ms mandatory
  `server_vad` silence wait (reported ~18ms instead of the honest number).
  On the single synthetic `en-us` clip used to shake this out (reference:
  *"So the derivative of x^2 is 2x — watch what happens when we apply the
  power rule to x^5."*), real-speech-anchored, real-time-paced results were:

  | engine | WER | finalLatencyMs |
  |---|---|---|
  | ink2 | 25.0% | 86 |
  | deepgram | 30.0% | 188 |
  | openai | 10.0% | 2034 (dominated by the 1500ms server_vad wait) |

  **This is one clip, not a benchmark** — WER here is mostly the synthetic
  TTS voice's ambiguous reading of caret notation (`x^2`) and digits, not a
  transcription defect. Treat it as "the harness works end-to-end and
  produces honest numbers," not as a verdict on engine quality. The real
  per-accent verdicts require the populated 6-accent corpus (see Corpus
  workflow above).
- Cartesia's WS/HTTP `tts/bytes` output is `pcm_f32le` (IEEE-float WAV,
  format tag 3) by design (Task 3), not `pcm_s16le` — this is why Python's
  stdlib `wave` module rejects Cartesia clips as "unknown format" while
  `ffprobe`/`afplay` play them fine; not a defect.

## Phase 2 shipped (Cartesia migration)

Phase 2 (`docs/superpowers/plans/2026-07-06-cartesia-migration-phase2.md`)
wires this harness's round-1 verdicts into the live tutor session behind two
independent, default-OFF flags. Flag-off is byte-identical to pre-migration
behavior — verified by the regression sweep below with both flags unset.

### Flags

- `NEXT_PUBLIC_TUTOR_TTS_ENGINE` — `realtime` (default) | `cartesia`. Routes
  the tutor's existing HTTP-TTS path (the `openai-mini` template) to
  Cartesia Sonic 3.5 (`/api/tutor/tts-cartesia`) instead of OpenAI TTS.
- `NEXT_PUBLIC_TUTOR_STT_ENGINE` — `openai` (default) | `ink2`. Swaps
  `usePerceptionWS` for `useCartesiaInkWS` (Cartesia Ink 2 turn-based STT,
  same callback contract). English-only — `openai` remains the
  multilingual/rollback path regardless of this harness's per-accent STT
  verdicts.

Both are `NEXT_PUBLIC_*` and therefore build-time inlined: flipping either
one requires a **dev-server restart** (or a redeploy in prod), not just a
page reload. Set in both `.env.local` and `.env.local.production` and keep
the two files in sync per repo convention — see "Prod flip" below for why
`.env.local.production` needs a manual step in this worktree.

### Where the pieces live

- Voice registry: `src/lib/tutor/voice/cartesia-voice-registry.ts` —
  `resolveCartesiaVoice({ teacherId, accent })`, `CARTESIA_DEFAULT_VOICE_ID`
  (Katie), built from the "Locked voice registry data" in the Phase 2 plan.
- TTS route: `src/app/api/tutor/tts-cartesia/route.ts` — raw `pcm_f32le`
  24kHz streaming pass-through from `sonic-3.5`, same response headers as
  `tts-openai/route.ts`.
- TTS provider decision: `src/lib/tutor/voice/resolve-tts-provider.ts` —
  `resolveTtsProvider(urlParam, envFlag)` (`?tts=` URL param still wins over
  the env flag, unchanged existing behavior).
- STT token route: `src/app/api/tutor/cartesia-token/route.ts` — mints a
  short-lived Cartesia access token (`grants:{stt:true}`) so the browser
  never sees `CARTESIA_API_KEY`; the WS auth param is `access_token` (not
  `api_key`) per the live-verified Cartesia docs, and the endpoint is
  `wss://api.cartesia.ai/stt/turns/websocket`.
- STT hook: `src/app/tutor/hooks/useCartesiaInkWS.ts` — drop-in replacement
  for `usePerceptionWS` with an identical callback surface (`onTranscript`,
  speech-start/stop, failure signaling, reconnect ladder). Exports
  `reconstructInkFinals`, used only as an empty-turn/duplicate-content
  filter — the transcript text actually delivered to the brain pipeline is
  always `turn.end`'s own cumulative `transcript` field (Cartesia
  reconstructs it server-side; see the hook's inline comments for why the
  delta-join approach isn't used for delivered text).

### Tests

Pure-logic, no network calls, safe to run anytime: `npm run
test:cartesia-registry`, `npm run test:tts-flag`, `npm run
test:ink-reconstruct` (plus the existing `npm run test:voice-harness`).

### Rollout order

**Every dev step below requires real-mic human verification, not just the
automated sweep.** Every "verified" claim made while building Tasks 1-6 used
either curl/paid-clip probes or Playwright's fake-mic Chromium flags
(`--use-fake-ui-for-media-stream --use-fake-device-for-media-stream
--use-file-for-fake-audio-capture=<24kHz wav>`), which prove the plumbing
works end-to-end (WS connects, turn events map, transcript reaches the
classifier, audio plays) but do **not** exercise real speech behavior:
natural mid-sentence pauses, ambient noise, real turn-taking cadence, or the
mic-permission-denied banner. Treat each "dev" step as incomplete until a
human has actually spoken to a live session.

1. **Dev, TTS-only, ≥2 sessions.** `NEXT_PUBLIC_TUTOR_TTS_ENGINE=cartesia`
   (STT flag unset), restart, a human runs ≥2 full sessions across teachers
   (at least Elena + Dev): correct voice, captions/render-sync timing intact,
   clean barge-in, PDF export unaffected.
2. **Dev, STT-only, ≥2 sessions.** Revert the TTS flag, set
   `NEXT_PUBLIC_TUTOR_STT_ENGINE=ink2`, restart, a human speaks naturally
   (mid-sentence pauses, an idle gap ≥3min to exercise reconnect, and a
   deliberate mic-permission denial) across ≥2 sessions.
3. **Dev, both flags on.** Both flags set, restart, ≥1 full real-mic session
   exercising the combined path. (Task 6 ran a fake-mic version of this step
   as an automated smoke test — see below — but a real-mic session is still
   outstanding before prod.)
4. **Prod, TTS flag.** Add `NEXT_PUBLIC_TUTOR_TTS_ENGINE=cartesia` to
   `.env.local.production` (main checkout only — see below), deploy, watch
   one real production session closely.
5. **Prod, STT flag.** Add `NEXT_PUBLIC_TUTOR_STT_ENGINE=ink2` to
   `.env.local.production`, deploy, watch one real production session
   closely.

Instant revert at any step: unset the flag (comment it back out) and
restart/redeploy — no other code changes needed, since flag-off is
byte-identical to pre-migration behavior by construction.

### Prod flip: `.env.local.production` lives outside this worktree

`.env.local.production` is gitignored and this worktree
(`/Users/luke/Dev/evelynlearning-cartesia`) doesn't have a copy — the only
copy lives in the main checkout at
`/Users/luke/Dev/evelynlearning/.env.local.production`. Both Phase 2 flags
are currently **absent** from it (not even commented). When it's time to run
rollout steps 4/5 above, add the same two commented (then, when flipping,
uncommented) lines there by hand, mirroring `.env.local`'s comments in this
worktree — this repo's convention is to keep the two files in sync manually
since one is gitignored and the other isn't tracked as a template either.
This task does not touch `.env.local.production` — prod flips are the
user's call, not automated by this migration.
