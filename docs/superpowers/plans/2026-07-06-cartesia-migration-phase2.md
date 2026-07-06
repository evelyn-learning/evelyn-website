# Cartesia Migration (Phase 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Flag-gated swap of tutor TTS to Cartesia Sonic 3.5 and STT to Cartesia Ink 2, with a committed voice registry built from the round-1 listening verdicts (persona-authentic teacher mapping).

**Architecture:** Two independent flags. TTS: `NEXT_PUBLIC_TUTOR_TTS_ENGINE=cartesia` routes the existing HTTP-TTS path (the `openai-mini` template) to a new `/api/tutor/tts-cartesia` route; voiceId per teacher from a new registry module. STT: `NEXT_PUBLIC_TUTOR_STT_ENGINE=ink2` mounts a new `useCartesiaInkWS` hook in place of `usePerceptionWS` (same callback contract); Ink 2's built-in turn detection replaces server_vad. Flag-off = byte-identical behavior.

**Tech Stack:** Existing Next.js/React tutor stack; Cartesia REST + WS APIs (verified shapes in `scripts/tutor/voice-harness/README.md` — READ IT FIRST, it documents live-API landmines from Phase 1).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-06-voice-stack-cartesia-design.md` (Phase 2 section). Frozen-baseline discipline: every change flag-gated, default OFF, flag-off byte-identical; one flag flipped per live test.
- Audio contract: Float32 PCM @ 24kHz mono into `audioQueueRef` (TTS); the existing epoch/cancel (`speakEpochRef`), prefetch-cache, `onTutorAudioChunk`, and sentence-tagging (`audioQueueSentenceRef`) semantics MUST be preserved — the Cartesia TTS path reuses the `openai-mini` flow wholesale, only the fetch URL/body differ.
- Cartesia auth: server routes use header `X-API-Key: $CARTESIA_API_KEY` + `Cartesia-Version: 2026-03-01`; the BROWSER never sees the API key — the Ink hook authenticates with a short-lived access token minted by a server route.
- Models pinned: `sonic-3.5`, `ink-2`. Ink 2 is English-only: the ink2 flag path is for English sessions; `openai` remains default and the multilingual/rollback path.
- Verified live-API knowledge (Phase 1, do not re-discover): Ink 2 emits CUMULATIVE `transcript` on `turn.update` (delta-reconstruct per `turn_id`); end-of-audio control message is `{type:'done'}` NOT `finalize`; turn thresholds `turn_start_threshold` 0.8 / `turn_eager_end_threshold` 0.4 / `turn_end_threshold` 0.2 / `turn_end_timeout_ms` 5600 (defaults; expose as env). gpt-realtime-2 expects 24kHz input.
- New env flags: `NEXT_PUBLIC_TUTOR_TTS_ENGINE` (`realtime` default | `cartesia`), `NEXT_PUBLIC_TUTOR_STT_ENGINE` (`openai` default | `ink2`). Set in BOTH `.env.local` and `.env.local.production` (initially unset/default). `NEXT_PUBLIC_*` is build-time: dev-server restart required per flip.
- Do NOT touch: `transcript-filters.ts`, judge/validator code, VAD env knobs, `teacher-persona.ts` DEMO_TEACHERS voice fields (openai voices stay for flag-off; the Cartesia mapping lives in the NEW registry module).
- Every task ends with `npx tsc --noEmit` clean + the named tests green + a commit.

## Locked voice registry data (round-1 verdicts, `scripts/tutor/voice-harness/verdicts-round1.json`)

Teacher bases (persona-authentic): Elena=Katie `f786b574-daa5-4673-aa0c-cbe3e8534c02`; Dev Khanna=Amrit `97303aad-1a66-4edf-870a-58e6ba545005` (hi→en carryover — his base IS Indian English); Amara=Skylar `db6b0ed5-d5d3-463d-8123-...` — CORRECT ID: `db6b0ed5-d5d3-463d-ae85-518a07d3c2b4`; Sofia=Gemma `62ae83ad-4f6a-430b-af41-a9bede9286ca`.
Accent pool (passing only): en-us Katie/Skylar/Jameson `a5136bf9-224c-4d76-b823-52bd5efcffcc`; en-gb Gemma/Archie `ef191366-f52f-447a-a398-ed8c0f2943a1`; en-in Katie-localized `dc4725ab-a34f-4625-9ae3-e35296b456e2`, Amrit, Palak `28ca2041-5dda-42df-8123-f58ea9c3da00`; en-ar-gulf Youssef `9cbad5f7-fbf6-4416-a22f-1ecc75ad40a2`, Maryam `9825cf5f-6aff-412a-80c5-bc58a8d55bc4`; en-nl Anneliese `225ba8cf-9fc2-4371-a78c-fe38ba38898a`; en-de Jan `42f14755-88c3-4124-aae3-5cc3a9618e8f`, Jennifer `ac197a78-cec7-4c50-93e5-93bdc1910b11`. FAILED (never use): Gemma-localized `f0b06576-...`, Stjin, all realtime-2 voices as Cartesia targets.

---

### Task 1: Voice registry module

**Files:**
- Create: `src/lib/tutor/voice/cartesia-voice-registry.ts`
- Test: `scripts/test-cartesia-voice-registry.ts` (+ package.json script `test:cartesia-registry`: `npx tsx scripts/test-cartesia-voice-registry.ts`)

**Interfaces — Produces:** `CARTESIA_DEFAULT_VOICE_ID` (= Katie); `resolveCartesiaVoice(opts: { teacherId?: string; accent?: string }): { voiceId: string; label: string }`.

- [ ] Write failing test: assertions (node:assert, repo test-script idiom) — `resolveCartesiaVoice({teacherId:'elena'})` → Katie's id; `{teacherId:'dev'}` → Amrit; `{teacherId:'amara'}` → Skylar; `{teacherId:'sofia'}` → Gemma; `{teacherId:'elena', accent:'en-in'}` → Katie-localized `dc4725ab-...`; `{teacherId:'dev', accent:'en-in'}` → Amrit (already en-in); `{accent:'en-ar-gulf'}` → Maryam (female default) ; `{teacherId:'dev', accent:'en-de'}` → Jan (male pool match); unknown teacher/accent → `CARTESIA_DEFAULT_VOICE_ID`; no-args → default. **First check the real DEMO_TEACHERS ids in `src/lib/tutor/ai/teacher-persona.ts`** (they may be e.g. `elena-vasquez` — use the actual ids in both test and registry).
- [ ] Run → FAIL (module missing).
- [ ] Implement: a const map with the exact IDs from "Locked voice registry data" above, gender tag per teacher (elena/amara/sofia female, dev male), per-accent pools with gender-preferred pick (en-in female → Katie-localized, male → Amrit; en-ar-gulf F→Maryam M→Youssef; en-nl → Anneliese; en-de F→Jennifer M→Jan; en-us F→Katie M→Jameson; en-gb F→Gemma M→Archie), teacher-base map, fallback chain teacher+accent → teacher base → accent pool → default. Pure module, zero imports from React/hooks (server- and client-safe).
- [ ] Run → PASS. `npx tsc --noEmit`. Commit `feat(tutor): Cartesia voice registry from round-1 verdicts`.

### Task 2: `/api/tutor/tts-cartesia` route

**Files:**
- Create: `src/app/api/tutor/tts-cartesia/route.ts`
- Reference (read first, mirror exactly): `src/app/api/tutor/tts-openai/route.ts` — copy its request shape, `rewriteForTTS` placement (apply it exactly where that route does — if it doesn't, don't add it; the client's realtime path already applies it and the mini path's placement is the contract), response headers (`X-Audio-Encoding: pcm_f32le`, `X-Audio-Sample-Rate: 24000`), and error-handling structure.

**Interfaces — Produces:** `POST /api/tutor/tts-cartesia` body `{ text: string; voiceId?: string }` → binary Float32 PCM 24kHz mono (raw, NOT WAV), same headers as tts-openai.

- [ ] Implement: fetch `https://api.cartesia.ai/tts/bytes` with headers `X-API-Key: process.env.CARTESIA_API_KEY`, `Cartesia-Version: 2026-03-01`, body `{ model_id: 'sonic-3.5', transcript: <text after mirroring tts-openai's rewrite placement>, voice: { mode: 'id', id: voiceId ?? CARTESIA_DEFAULT_VOICE_ID }, language: 'en', output_format: { container: 'raw', encoding: 'pcm_f32le', sample_rate: 24000 } }`. Stream the response body through (pass-through ReadableStream, do not buffer) so first-byte latency is preserved. Non-OK → 502 with body text logged server-side. Missing key → 500 `{error}` like tts-openai.
- [ ] Live-verify: `curl -s -X POST localhost:3006/api/tutor/tts-cartesia -H 'Content-Type: application/json' -d '{"text":"The derivative of x squared is two x."}' -o /tmp/cart.f32 -D -` → 200, headers present, byte length divisible by 4 and >100KB; convert+play: `python3 -c` f32→wav or reuse harness `audio-util` via a 5-line tsx script; listen with `afplay`.
- [ ] `npx tsc --noEmit`. Commit `feat(tutor): Cartesia TTS route (sonic-3.5, raw f32 24k streaming)`.

### Task 3: TTS engine flag + hook branch + voice plumbing

**Files:**
- Modify: `src/app/tutor/hooks/useOpenAIRealtime.ts` — ONLY these three seams: (a) `fetchTTSPromise` (~line 2405): choose URL by a new `ttsProviderRef` value `'cartesia'` → `/api/tutor/tts-cartesia`, else `/api/tutor/tts-openai`; when cartesia, body is `{ text, voiceId: cartesiaVoiceIdRef.current }`. (b) `dispatchSpeakText` (~2482): condition becomes `isRelayRef.current && (ttsProviderRef.current === 'openai-mini' || ttsProviderRef.current === 'cartesia')` → `sendOneSpeakTextViaOpenAITTS` (the shared HTTP flow — rename NOTHING). (c) `speakText`'s `usingOpenAITTS` guard (~2495): same widened condition. Plus: accept new optional config `cartesiaVoiceId?: string` → `cartesiaVoiceIdRef`.
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` — pass through a new optional `cartesiaVoiceId` prop into the hook config; extend the `ttsProvider` prop type with `'cartesia'`.
- Modify: `src/app/tutor/page.tsx` — read `NEXT_PUBLIC_TUTOR_TTS_ENGINE` (module const, like `ENV_VOICE_ENGINE` at :63). Effective ttsProvider: URL `?tts=` param wins (existing :147 logic), else `cartesia` when env flag says so, else current default. Resolve `cartesiaVoiceId` via `resolveCartesiaVoice({ teacherId: selectedTeacherId ?? cfg.teacherId })` (import from Task 1) and pass as the new prop alongside the existing `voice=` prop (which stays untouched for flag-off).
- Test: `scripts/test-tts-engine-flag.ts` (+ script `test:tts-flag`) — pure-logic test of a small exported helper `resolveTtsProvider(urlParam: string|null, envFlag: string|undefined): 'realtime'|'openai-mini'|'cartesia'` that page.tsx uses (extract the decision into `src/lib/tutor/voice/resolve-tts-provider.ts` so it's testable): URL `mini` wins over env `cartesia`; env `cartesia` → cartesia; unset → realtime default; garbage env → realtime.

- [ ] Failing test for `resolveTtsProvider` → implement module → PASS.
- [ ] Wire the three hook seams + props + page plumbing exactly as above. The prefetch cache keys on text only — voiceId is session-static so no key change needed; note this in a comment.
- [ ] Flag-off verification: with env unset, `npm run test:tutor-e2e -- jee-conics-tangent` → passes as before (0 anomalies).
- [ ] Flag-on live-verify (dev): set `NEXT_PUBLIC_TUTOR_TTS_ENGINE=cartesia` in `.env.local`, restart dev server, run one real tutor session per teacher (at minimum Elena + Dev): tutor speaks in the Cartesia voice, captions + render-sync still work (buffer-and-flush flushes on sentence starts — the openai-mini path already drives these), barge-in kills audio cleanly, PDF export unaffected. Watch the dev console for `[Realtime] speakText skipped` regressions.
- [ ] `npx tsc --noEmit`. Commit `feat(tutor): NEXT_PUBLIC_TUTOR_TTS_ENGINE=cartesia flag — Cartesia TTS via shared HTTP path`.

### Task 4: `/api/tutor/cartesia-token` route

**Files:**
- Create: `src/app/api/tutor/cartesia-token/route.ts`
- Reference (mirror structure): `src/app/api/tutor/perception-token/route.ts` (POST mints, GET reports configured).

**Interfaces — Produces:** `POST /api/tutor/cartesia-token` → `{ token: string, expires_at?: number }`.

- [ ] Implement: POST `https://api.cartesia.ai/access-token` with `X-API-Key` + `Cartesia-Version: 2026-03-01`, body `{ grants: { stt: true }, expires_in: 3600 }` → return `{ token: data.token }`. LIVE-VERIFY the exact request/response field names against https://docs.cartesia.ai/api-reference/auth/access-token.md (curl the .md — Phase 1 established docs are fetchable) and fix to reality; document the verified shape in a comment.
- [ ] Verify: `curl -s -X POST localhost:3006/api/tutor/cartesia-token` → `{token: "..."}`. Commit `feat(tutor): Cartesia access-token route for browser STT`.

### Task 5: `useCartesiaInkWS` hook + STT engine flag

**Files:**
- Create: `src/app/tutor/hooks/useCartesiaInkWS.ts`
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` — where `usePerceptionWS` is mounted/gated (~:10596-10704): read `NEXT_PUBLIC_TUTOR_STT_ENGINE` (module const); `'ink2'` → mount `useCartesiaInkWS` with THE SAME callback props and leave `usePerceptionWS` disabled (its `enabled` gate false); default → current behavior byte-identical.
- Reference (contract): READ `src/app/tutor/hooks/usePerceptionWS.ts` fully first — the new hook must export the same props/return surface (`onTranscript`, `onTranscriptionFailed`/failure signaling, speech-started signal used for barge-in/classifier timing, connection states incl. reconnect, `enabled` gating, own getUserMedia). Reference (event handling): `scripts/tutor/voice-harness/stt-clients.ts` ink2 client — port its delta-reconstruction (cumulative `transcript` per `turn_id`) and `{type:'done'}` handling verbatim.

- [ ] Implement the hook: mint token via `/api/tutor/cartesia-token`; connect `wss://api.cartesia.ai/stt/turns/websocket?model=ink-2&encoding=pcm_f32le&sample_rate=24000&cartesia_version=2026-03-01&<auth param>` — auth param name (`api_key` vs `access_token`) LIVE-VERIFIED in Task 4's docs fetch; mic capture mirrors usePerceptionWS's pipeline (own MediaStream, 24kHz, echoCancellation on) but sends raw Float32 binary frames (pcm_f32le — no base64, no resample); map turn events: `turn.start` → speech-started callback (barge-in timing), reconstructed final text on `turn.end` → `onTranscript` (the existing consumer runs `classifyTranscript` — unchanged); thresholds from env `NEXT_PUBLIC_TUTOR_INK_TURN_START/EAGER_END/END/END_TIMEOUT_MS` defaulting to 0.8/0.4/0.2/5600; reconnect ladder 0/1s/3s max 3 mirroring usePerceptionWS's; exhaustion → the same failure callback (existing banner path).
- [ ] Test: `scripts/test-ink-turn-reconstruct.ts` (+ script `test:ink-reconstruct`) — pure function `reconstructInkFinals(events: {type:string; turn_id?:string; transcript?:string}[]): string[]` extracted into the hook file (exported): feed the REAL event sequences recorded in Phase 1 (copy 2-3 sequences from `artifacts/voice-harness/stt/run-*/events/en-us__sample1__ink2.jsonl`) → expected finals; duplicate turn.end after eager_end yields no double text.
- [ ] Flag-off verification: env unset → `npm run test:tutor-e2e -- jee-conics-tangent` passes; grep the built page for zero behavioral diff (perception path untouched).
- [ ] Flag-on live-verify (dev, ONE flag only — TTS flag back off for this test per single-variable discipline): `NEXT_PUBLIC_TUTOR_STT_ENGINE=ink2`, restart, real mic session: speak naturally with mid-sentence pauses → no fragmentation (Ink turn detection), transcript reaches brain, barge-in interrupts TTS, idle 3+ min then resume still transcribes (reconnect), kill mic permission → graceful failure banner.
- [ ] `npx tsc --noEmit`. Commit `feat(tutor): NEXT_PUBLIC_TUTOR_STT_ENGINE=ink2 — Cartesia Ink 2 perception hook`.

### Task 6: Rollout wiring + regression sweep + docs

**Files:**
- Modify: `.env.local` + `.env.local.production` (add both flags, values documented but commented/unset = default OFF; keep the two files in sync per repo convention).
- Modify: `scripts/tutor/voice-harness/README.md` — add a "Phase 2 shipped" section: the two flags, registry module path, token route, and the rollout order below.
- Create: nothing else.

- [ ] Full flag-off sweep: `npm run test:voice-harness && npm run test:cartesia-registry && npm run test:tts-flag && npm run test:ink-reconstruct && npx tsc --noEmit && npm run test:tutor-e2e -- jee-conics-tangent` — all green with both flags unset.
- [ ] Combined flag-on smoke (dev): BOTH flags on, one full lesson session end-to-end (Cartesia voice + Ink STT together): coherent turn-taking, render-sync, kill-recovery (`window.__tutorForceKill`), PDF export.
- [ ] Document rollout order in the README section: (1) dev TTS-only ≥2 sessions; (2) dev STT-only ≥2 sessions; (3) dev both; (4) prod TTS flag, watch a real session; (5) prod STT flag. Instant revert = unset flag + restart.
- [ ] Commit `feat(tutor): Cartesia migration flags wired + rollout runbook`. Do NOT enable anything in prod env in this task — prod flips are the user's call per the runbook.

---

## Self-Review Notes (applied)

- Spec coverage: TTS branch+route+flag (Tasks 2-3), STT hook+token+flag (Tasks 4-5), registry from verdicts w/ teacher mapping (Task 1), portal/EmbedConfig accent override + geo default are **Phase 3, deliberately out of scope**; word-timestamp caption upgrade explicitly deferred by spec.
- The one typo risk called out inline (Amara/Skylar id) is resolved: `db6b0ed5-d5d3-463d-ae85-518a07d3c2b4`.
- No placeholders: every seam has exact anchors/line refs from the 2026-07-06 recon; live-verify steps are explicit probe-and-fix protocol (established Phase 1 discipline), not TBDs.
- Type consistency: `resolveCartesiaVoice`/`CARTESIA_DEFAULT_VOICE_ID` (T1) consumed in T2/T3; `resolveTtsProvider` defined+consumed in T3; `reconstructInkFinals` defined+tested in T5.
