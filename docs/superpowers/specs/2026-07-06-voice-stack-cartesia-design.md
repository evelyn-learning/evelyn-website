# Voice Stack Overhaul — Cartesia Migration, Comparison Harnesses, Accent & Style Adaptation

**Date:** 2026-07-06
**Status:** Approved design (user-reviewed). Next: per-phase implementation plans via writing-plans.
**Scope:** 5 subsystems, built in phase order below. Each phase gets its own plan → build → verify cycle.

## Why

The tutor's voice layer runs on OpenAI Realtime (`realtime-2` voices + `gpt-realtime-2` transcription). Two limits drove this initiative:

1. **Accent/persona poverty.** One voice set for all geographies. Session recordings across Europe/Asia/Americas show students would be better served by locale-matched English accents (Indian English, Gulf-Arabic English, etc.). The 2026-05-07 accent-matching initiative was deferred on "wait for better TTS" — Cartesia Sonic 3.5 (sub-90ms TTFA, 42 languages, English accent localization, instant voice cloning) is that trigger.
2. **Humanlike adaptation.** The tutor should adapt conversation style to the student (pace, confidence, register, light code-switching) and remember it per student across sessions.

The brain stays Claude Sonnet + Haiku validators (S2S brain replacement evaluated and rejected 2026-07-03: no text seam for the judge, Flash-tier reasoning, tool-calling density).

## Verified platform facts (2026-07-06, docs.cartesia.ai)

- **Sonic 3.5** (`sonic-3.5`, stable snapshot `sonic-3.5-2026-05-04`): 42 languages, sub-90ms model latency, WebSocket with input continuations + contexts, SSE/WS **word + phoneme timestamps**, speed/emotion controls, `pcm_f32le` output support.
- **Ink 2** (`ink-2`, stable 2026-05-22): streaming STT, **English-only for now** (more languages promised). **Built-in turn detection** — `turn.start/update/eager_end/resume/end` events with configurable thresholds (`turn_start_threshold` 0.5–0.9 default 0.8, `turn_eager_end_threshold` 0.3–0.6 default 0.4, `turn_end_threshold` 0.05–0.5 default 0.2, `turn_end_timeout_ms` 640–11200 default 5600). Encodings incl. `pcm_s16le`/`pcm_f32le`; send ~100ms chunks. Manual (no-turn-detection) endpoint also exists.
- **Instant voice clone**: ≤10s clip, free, API (`POST /voices/clone`). Pro clone exists but **localization does NOT work on pro clones** — instant clones are the right tier for teacher voices.
- **Localize API** (`POST /voices/localize`): re-accent/re-language a voice preserving speaker identity. English dialect targets: **`us`, `uk`, `au`, `in`, `so` (Southern US) only.** Creates a new `voice_id` per variant.
- **Code-switching**: officially supported where natural — **Hinglish (hi/en)** and Taglish named.
- **Accent-carryover technique**: a voice used outside its native locale speaks with its L1 accent (documented behavior) — the candidate mechanism for Gulf-Arabic/Dutch/German-accented English via native ar/nl/de voices speaking English text.
- **No input-audio emotion analysis** anywhere in Cartesia's API. Hume has retired its standalone Expression Measurement API (docs now only EVI + Octave TTS). No credible dedicated voice-sentiment vendor remains → sentiment is built from brain inference + multimodal-LLM audio analysis.
- Browser access tokens exist (`POST /access-token`) if a client-direct WS is ever needed for latency.

## Locked decisions

1. **Build order: harnesses first.** Evaluation gates migration; no voice ships unheard.
2. **Round-1 accents:** American, British, Indian English via native voices + localize; Gulf Arabic / Dutch / German English tested via BOTH accent-carryover and (when clips are sourced) instant clones. **Test all, ship what passes**; failures get a closest-native fallback (e.g. Gulf Arabic → British) until coverage improves.
3. **STT: Ink 2 + fallback.** Harness benchmarks Ink 2 vs current gpt-realtime-2 transcription vs Deepgram Nova-3. Ink 2 ships flag-gated for English sessions; OpenAI STT remains the multilingual path and instant rollback.
4. **Picker UX: teacher × accent matrix.** Teacher picker stays; each teacher gets one base Cartesia voice + localized accent variants (identity preserved). Accent defaults from ip-geo, visible selector to override.
5. **Sentiment v1: brain-inferred per-turn + multimodal audio-clip analysis at checkpoints** (session start ~60s + session end), from the session recordings already captured.
6. **Cloning: full plumbing + gated upload.** Academy admin record/upload → consent → clone → preview → attach flow, draft-by-default; academy NOT publicly deployed until the pre-existing admin-auth blocker is fixed (separate task).
7. **Harness shape: Node generation scripts + dev-only dashboard page** (`/tutor/voice-harness`, render-harness idiom).

## Current-stack seams (recon 2026-07-06; file:line valid at design time)

- Baseline engine is `claude-brain` (forced when a lesson plan is selected, `page.tsx:276-278`). OpenAI Realtime WS is **TTS transport only** in this mode (tools omitted; Stage-4 removed its STT).
- **STT authority is already a separate WS**: `usePerceptionWS.ts` (gpt-realtime-2 transcription, own getUserMedia @24kHz, server-VAD env knobs, `onTranscript` → `classifyTranscript` noise filter → barge-in/new-turn classifier → brain). STT swap = replace this hook, contract-compatible.
- **TTS seam**: `speakText` → `dispatchSpeakText` (`useOpenAIRealtime.ts:2482-2488`) already branches on `ttsProvider` (`'realtime'` | `'openai-mini'`); Cartesia = third branch. Hard contract: **Float32 PCM @ 24kHz mono** into `audioQueueRef`/`playNextAudio`; epoch/cancel semantics (`speakEpochRef`, `cancelledResponseIdsRef`, `clearSpeechQueue` promise); timing consumers = render-sync (`onTtsPlaybackProgress('sentence-start'|'drain')`), caption word-sync (`getSpokenProgress`), resume-from-cut (`peekSpeechQueue`/`resumeSpeakText`/`getCurrentSentenceFraction`). The `openai-mini` HTTP path (`sendOneSpeakTextViaOpenAITTS` + prefetch cache) is the closest template.
- **Pronunciation**: all TTS paths route text through `rewriteForTTS` (`src/lib/tutor/voice/tts-pronunciation.ts`) — harness must use it too.
- **Voices today**: 4 demo teachers (`DEMO_TEACHERS`, `teacher-persona.ts`) with `voice: {provider:'openai', voiceId: coral|ash|sage|ballad}`; the wire type already allows `provider:'cartesia'`. Portal embed uses `EmbedConfig.voice` (default `'coral'`). Dead Cartesia scaffolding with placeholder IDs exists (`src/lib/tutor/voice/cartesia-tts.ts`, `types.ts:151-179`) — replace, don't trust.
- **Session audio recorder**: student + tutor tracks, PCM16 @24kHz, 30s flushes to `/api/tutor/session-audio` → `TUTOR_AUDIO_DIR`, timeline-aligned. Feed for checkpoint sentiment analysis.
- **Per-student persistence**: `StudentProfile` (Mixed-typed sub-objects — additive fields need no migration) with `preferences` (pacing/modality/tone/interests/socialMemoryLevel), `gaps`, `planContentSeen`, `recentSessions`; store layer has `updateStudentPreferences` and session-end commit via `emitSessionResult`. Session-end Haiku extraction pattern: `extract-social-threads.ts` (injectable model call, never-throws, JSON+sanitize). Per-turn prompt injection pattern: suppress-when-empty formatter into `claude-brain.ts` userContent (NEVER the cached system prefix).
- **Geo**: ip-api.com lookup + 24h in-memory cache in `api/demos/track/route.ts:13-54`; `IGeoLocation` in `models/DemoInteraction.ts`.

---

## Phase 1 — TTS/STT comparison harnesses + listening dashboard

**Generation scripts** in `scripts/tutor/voice-harness/`:

- `utterances.ts` — ~12 authored tutor utterances through the real `rewriteForTTS`: KaTeX-bearing math narration (fractions, exponents, a derivative), alphanumerics (dates/equation refs), short encouragement, longer explanation (~3 sentences), a question with a natural pause. Authored, not DB-sourced (user preference).
- `tts-generate.ts` — matrix run: provider × voice × utterance → audio file + per-clip `ttfaMs`/`totalMs` into `artifacts/voice-harness/tts/<runId>/manifest.json`.
  - Candidates: Cartesia recommended (Katie en-US, Skylar en-US, Jameson en-US, Gemma en-GB, Archie en-GB) + localize variants (`in`; `uk`/`us` where a voice needs re-accenting) of shortlisted voices + native `hi`/`ar`/`nl`/`de` library voices speaking the English utterances (accent-carryover) + instant clones when/if accented clips are sourced. Control: the 4 current realtime-2 voices via an out-of-band Realtime `response.create` from Node (same mechanism the app uses).
- `stt-run.ts` — per accent (US, UK, Indian, Gulf-Arabic, Dutch, German English): 10–20 reference-transcribed clips streamed at real-time pace into Ink 2 WS (turn events logged), OpenAI realtime transcription WS (current config), Deepgram Nova-3 WS. Outputs WER, finalization latency, turn-detection quality per clip into `artifacts/voice-harness/stt/<runId>/results.json`.
  - Corpus sourcing (verify licenses at build): Mozilla Common Voice (CC0, accent-labeled), L2-ARCTIC (Hindi/Arabic-L1 English), VoxPopuli (Dutch/German-accented English), EdAcc as backup. Keep clips out of git (gitignored artifacts + a fetch script).
- Keys: `CARTESIA_API_KEY` (new, server-side only), `DEEPGRAM_API_KEY` (exists), OpenAI keys (exist).

**Dashboard** `/tutor/voice-harness` (dev-only guard, render-harness idiom): TTS tab = utterance-rows × voice-columns matrix, per-cell play + latency chip + verdict toggle, exports a voice-selection JSON (feeds Phase 2's registry). STT tab = accent × engine table (WER, latency), clickable per-clip transcript diffs, source-audio playback. Reads manifests via a small dev API route.

**Exit criteria:** user has listened and picked (a) one base Cartesia voice per teacher, (b) pass/fail per accent per technique, (c) STT engine verdict per accent.

## Phase 2 — Cartesia migration (two independent flags)

**TTS (`NEXT_PUBLIC_TUTOR_TTS_ENGINE`, values `realtime` (default) | `cartesia`):**
- New branch in `dispatchSpeakText` → `sendOneSpeakTextViaCartesia`, modeled on the `openai-mini` HTTP path incl. prefetch cache: POST `/api/tutor/tts-cartesia` (new route) → Cartesia TTS (server-side; WS-with-context or bytes endpoint — decided in the plan by measured TTFA) → response streamed as `pcm_f32le` @24kHz with the existing `X-Audio-*` headers.
- Must preserve: epoch/cancel semantics, `onTtsPlaybackProgress` sentence boundaries, `getSpokenProgress` estimator, `rewriteForTTS`. Word-timestamp-driven caption sync is a later upgrade, NOT v1.
- Flag off ⇒ byte-identical behavior.

**STT (`NEXT_PUBLIC_TUTOR_STT_ENGINE`, values `openai` (default) | `ink2`):**
- New `useCartesiaInkWS` hook, callback-compatible with `usePerceptionWS` (`onTranscript`, speech-start signal for barge-in/classifier timing, reconnect states incl. `degraded`, watchdog). Auth via short-lived Cartesia access token minted by a new `/api/tutor/cartesia-token` route (pattern: existing `perception-token`).
- Ink 2 built-in turn detection replaces server-VAD; thresholds via new env knobs mapped in the plan from current VAD env. `classifyTranscript` filtering retained (hallucination classes differ but the seam stays).
- English sessions only; multilingual stays `openai`. Flag off ⇒ perception WS untouched.

**Voices:** replace placeholder Cartesia IDs; new voice registry module (single source: teacher base voices + accent variants + portal default). `DEMO_TEACHERS` gain `provider:'cartesia'` voiceIds (harness winners) while keeping OpenAI voiceIds for flag-off. Portal embed: additive `EmbedConfig` support for a Cartesia voice ref.

**Rollout:** one flag at a time, dev live-verify → prod env flip; unset = instant revert. Re-run `test:tutor-e2e` + pedagogy harness flag-on and flag-off.

## Phase 3 — Teacher × accent matrix + geo default

- Localized accent variants created once per teacher voice via localize API; stored in the voice registry (`teacherId × accent → voiceId`). Accents shipped = Phase-1 passes only; others map to closest-native fallback.
- Setup page: teacher picker unchanged + accent selector (listed per teacher, shows accent names); default accent resolved from ip-geo (reuse ip-api pattern via a small server helper; demo sessions localStorage the override, subscribed persist to `StudentProfile.preferences`).
- Portal: embed token may carry an accent override; otherwise geo default applies.

## Phase 4 — Adaptive style + per-student memory + sentiment

- **Data:** new bounded `StudentProfile.styleObservations` sub-object — communication level, preferred pace, confidence/anxiety, AI-skepticism, engagement, language-mixing preference, learning-style hint, accent/geo hint; each entry evidence-quoted + confidence-tagged + capped (FIFO), mirroring the gaps discipline.
- **Per-turn:** suppress-when-empty `<student_style>` block in brain userContent (pattern: `formatStudentStateBlock`) + prompt guidance: adapt tone/pace/register to observations; light code-switching when it helps and the student signals it (Hinglish etc.); never caricature. Flag-gated (new `NEXT_PUBLIC_TUTOR_STUDENT_STYLE`).
- **Brain-inferred affect v1:** the same block instructs the brain to weigh existing behavioral signals (pacing streaks, response latency, turn length already flowing) — no new realtime pipeline.
- **Checkpoint audio sentiment:** session-start (~first 60s of student track) + session-end clips from the existing recorder → multimodal LLM (Gemini vs GPT-4o-audio bake-off in the plan) → structured affect summary merged into `styleObservations`. Never blocks the session (never-throw, async).
- **Session-end extraction:** `extract-style-observations.ts` Haiku sweep (clone of social-threads extractor), committed engine-side via the profile store — no academy round-trip (style is pedagogical, unlike privacy-gated social memory). Demo sessions: in-context adaptation only, nothing persisted.

## Phase 5 — Teacher voice cloning (Academy, gated)

- Academy admin persona flow gains: record/upload step (Cartesia best-practice guidance: ≤10s, clean, target-energy script), **consent capture** (checkbox + stored consent text/timestamp; upload blocked without it), server-side `POST /voices/clone` (instant tier), preview player, attach (`voiceCloneRef` + `voice:{provider:'cartesia', voiceId}`), draft-by-default.
- Accent variants of a clone created on demand via localize (works on instant clones).
- Engine playback: nothing beyond Phase 2. **Blocker unchanged:** academy admin auth must land before public deploy / real onboarding.
- Out of scope here: teaching-style distillation from recordings (already designed separately in the teacher-personas work).

## Risks

- **Frozen-baseline discipline** (the 2026-05-17 STT revert lesson): every change flag-gated default-OFF; one variable per live test; confirm the dev server actually picked up env changes; multiple sessions before stacking.
- **Server-route TTS hop latency** vs current direct WS: measured in Phase 1; fallback lever = client-direct Cartesia WS with access tokens.
- **Ink 2 English-only** and Ink 2 hallucination profile differs from Whisper's: OpenAI path retained; `classifyTranscript` extended only on evidence.
- **Accent quality variance** (localize + carryover techniques unproven per voice): harness decides; fallback mapping ships for failures.
- **Voice-ID sprawl** (localize mints new IDs): single registry module owns all IDs.
- **Cloning consent/rights**: consent stored before any clone call; Cartesia ToS require voice rights.

## Testing

Unit suites per seam (TTS branch dispatch, Ink hook state machine, registry resolution, style extractor, geo→accent resolver); harness reruns (`test:tutor-e2e`, `test:pedagogy`) flag-off AND flag-on; live-session validation of winning voices (final Phase-2 gate) incl. barge-in, kill-recovery, render-sync, caption-sync; STT live A/B on real sessions before prod flip.
