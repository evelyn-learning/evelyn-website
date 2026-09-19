# Text-only tutor mode — design

**Date:** 2026-09-19 · **Owner:** tutor engine · **Status:** approved in chat by Praveen (Option C layout, partner-level, no mic, sentence-paced reveal, admin + demo reporting)
**Mockups:** https://claude.ai/artifact/2idTNK78vsGZz8ARFTA6re (Option C)

## 1. Why

Partners are sold a text-only mode today (`docs/whitelabel/02-technical-integration-spec.md` §token `input_mode`, `01-product-description.md`, the Kanzoo signer example) and the portal now lists it at $0.12/min. The engine accepts the claim and only forwards it to analytics: a partner signing `input_mode:'text'` silently gets voice. GreenApple Campus (Dee Guiney, 2026-09-19) asked for text/chat-based between-session support. No real partner signs the claim yet — the only two text-signed sessions in the last 30 days were our own QA probes (`qa-typed-a/b-2026-09-05`).

## 2. Scope

**In:** a partner-level text-only mode for the embed surface, selected by the signed token claim; Option C layout; sentence-paced reveal in step with board renders; mode persisted and reported (partner summary, admin sessions list, Demo Analytics); docs reconciled.
**Out:** a student-facing voice/text switch (no mic button — Praveen); retail `/tutor` text mode; a true "no audio engine" provider (silent TTS is v1); prompt re-authoring beyond one text-mode clause; Hungarian/i18n.

## 3. Mode resolution (partner-level)

- New `apps/tutor/src/lib/tutor/voice/resolve-session-mode.ts`: `resolveSessionMode({ tokenInputMode, killSwitch }) → 'voice' | 'text'`. Returns `'text'` **only** when the token claim is `'text'` **and** `NEXT_PUBLIC_TUTOR_TEXT_MODE !== 'off'`. Everything else is `'voice'`.
- Kill switch `NEXT_PUBLIC_TUTOR_TEXT_MODE` defaults ON (house rule: `!== 'off'`); `off` restores today's behaviour (claim inert). Because the gate is the claim, the flag being ON changes nothing for any token without it.
- Threaded exactly like `ttsProvider`: `embed/page.tsx:482` (`inputMode`) → `TutorSession` prop `sessionMode` → `VoiceTutorRealtime` prop. No URL-param override on the retail page in v1 (retail is public; a text switch there is a product decision, not a dev convenience). Local testing uses a minted token (§8).

## 4. Stage in text mode (Option C)

Files: `session/SessionStage.tsx`, `session/TutorSession.tsx`, `VoiceTutorRealtime.tsx` (composer block :22129–22167).

- **Transcript panel pinned open**: `drawerOpen` initial state = `true` when `sessionMode==='text'` (SessionStage :296); the close control collapses it to a tab, it never auto-closes. Bubbles = existing `TranscriptView`.
- **Composer replaces the dock**: the existing "Type here if you can't speak…" input becomes the primary composer (autofocus, Enter sends, Shift+Enter newline, camera button for homework photo). Rendered in the dock slot; the orb, mic meter, mute button and caption strip are not mounted (`showsDockMuteButton=false`, `CaptionTicker` not mounted, `liveCaption` unused). The `isConnected` gate on the input (VTR :22146) is relaxed in text mode to "brain route reachable" so the box is live immediately.
- **Board clearance**: today the board is deliberately unpadded and ink runs behind the 40%-translucent dock (SessionStage :786–795 comment). The composer is opaque, so in text mode the board column gets `pb-[<composer height>]` (measured via a ref, fallback 88px) and the whiteboard's scroll-to-bottom keeps the newest render above it. No change in voice mode.
- **No mic**: `startListening` is never called; perception WS (`usePerceptionWS` / `useCartesiaInkWS`, VTR :20102–20137) is not enabled; no `getUserMedia` prompt. `MicSilentWarning` / noise-floor nag suppressed. Warm-up overlay (`setShowWarmupOverlay`, VTR :21006, SessionStage :96) is not shown in text mode since only audio clears it.
- **Start**: reuse the typed-submit start parity (VTR :22113–22119); the first Enter is the start gesture. `unlockAudio()` still runs on that gesture so the silent clock (§5) has an AudioContext on iOS.
- **Top bar**: a small "Text session" chip next to End session (mockup).
- **Mobile**: same composition; the transcript panel becomes the bottom sheet the drawer already is on `<md` (SessionStage :1455), opened by default.

## 5. Reveal pacing (sentence by sentence, in step with the board)

- `ttsProvider` forced to `'silent'` in text mode (`resolve-tts-provider.ts` gains a `mode` input). The silent provider (`useOpenAIRealtime.ts:3040–3057`) plays zero-filled buffers so sentence-start, drain and `TUTOR_RENDER_SYNC` all keep working — this is the same path the typed e2e harness uses.
- Pacing: `SILENT_TTS_SECONDS_PER_WORD` (:42) becomes a per-mode value: harness keeps 0.15 s/word; text mode uses `TEXT_MODE_SECONDS_PER_WORD = 0.35` (reading pace, close to speech). Exposed as `NEXT_PUBLIC_TUTOR_TEXT_MODE_SPW` for tuning.
- The bubble reveals per sentence as each silent "sentence" completes (the transcript already appends `attemptText` per sentence; the pinned panel renders it). Board renders keep their introducing-sentence anchor. No caption strip.
- Idle nudge (`decideIdleNudge`, VTR :18212–18250) is reset on every keystroke in the composer; `STUCK_SPEAKING_WATCHDOG_MS` is untouched because the silent path still drains audio.

## 6. Prompt

`system-prompt-builder.ts`: when mode is text, append one clause: the student is typing and reading, so write rather than narrate ("write" not "say"), keep the same `$…$` math delimiters so bubbles and board render identically, and keep turns short. No other prompt change; all guards stay on (they parse the same text).

## 7. Persistence, billing, reporting

- **Session doc**: `TutorSession.inputMode` already exists (`models/TutorSession.ts:56/245`) and is written by the embed page and `session-usage/route.ts`. Text mode writes `'text'` (already does via `inputMode`); v1 adds nothing to the schema. `resume.ts` carries it through resume.
- **Partner summary**: `lib/tutor/portal/session-summary.ts` output gains `mode: 'voice'|'text'`; `durationSec` is already transcript-based (no audio dependency). Contract bump: portal-contract minor (`mode` optional). Rate: `data/pricing.ts` `rateFor(mode)` already exists.
- **Admin sessions list** (`app/admin/tutor-sessions/page.tsx`): small tag inside the existing **Status** cell under the status pill, where `voiceEngine` already prints in 10px grey (:378–380): `voice` / `text` (text in indigo so it is scannable). Filter: `SessionFilterParams.mode` (`lib/tutor/recordings/filters.ts`) with a `mode=text|voice` query param and a select next to the existing source/partner filters. Detail page already shows Mode (:126–127).
- **Demo Analytics** (`app/admin/demos/*`, reads `DemoInteraction`/`DemoSession`, not tutor sessions): the live tutor demos (`VoiceTutorLiveDemo`, marketing product pages) record `mode` in the demo-tracker metadata on `trackTry`/`trackComplete`; `DemoSession.summary.mode` is set from it; the sessions table shows a small `voice`/`text` tag in the **Product** cell and the Top Demos table gains a "text share" column (tries in text mode / tries). Demos without a mode show nothing.

## 8. Local testing (before any deploy)

1. Dev server from the worktree (`apps/tutor`, :3007, `.env.local`).
2. Mint two embed tokens against the local partner secret with `docs/whitelabel/kanzoo/examples/sign-embed-token.js`: one with `input_mode:'text'`, one without. Praveen opens both in a browser. The second must look exactly like today.
3. Typed e2e harness bundle in text mode (`npm run test:tutor-e2e`, `TUTOR_E2E_URL`, real brain): asserts sentence-by-sentence transcript growth, board renders anchored to sentences, no mic acquisition, no warm-up overlay, session doc `inputMode:'text'`, summary `mode:'text'`.
4. Playwright screenshot pass of both tokens at 1280 and 390 px, delivered to Praveen.
5. Full gate on the merged tree: `tsc`, `test:all`, `next build`, plus the existing voice e2e bundles.

## 9. Non-disturbance (two mechanisms that fail differently)

1. **Structural**: every text-mode branch is guarded by `sessionMode==='text'`; the mode is `'voice'` for any token without the claim and for the retail page. Grep gate: no unguarded reference to `sessionMode` outside the resolver and the guarded sites.
2. **Measured**: the voice e2e bundle's event stream (`debugEvents` names in order) is captured before the change and compared after; the deploy uses the same before/after tutor probe as the 2026-09-18/19 pricing deploys (BUILD_ID + pm2 + served HTML). Kill switch `NEXT_PUBLIC_TUTOR_TEXT_MODE=off` is the rollback without a redeploy of code (it is a build-time flag: it must be in the env AT BUILD TIME to take effect — house note from the verdict-layer round).

## 10. Docs reconciled in the same change

- `01-product-description.md:22-23`: text-only is $0.12/min (currently says $0.02).
- `02-technical-integration-spec.md`: `input_mode` is now honoured; describe the text layout and the `mode` field in `sessions/summary`.
- Retire or clearly exclude the two dead legacy text paths (`page.tsx:3115` → `/api/tutor/chat`; `VoiceInterface.tsx` `useTextMode`) so nobody wires the new mode into them: v1 leaves them in place, adds a comment pointing at the new resolver, and files a follow-up.

## 11. Risks and decisions taken

- Silent TTS needs an unlocked AudioContext (iOS): covered by keeping `unlockAudio()` on the first Enter.
- Reading pace vs speech pace: 0.35 s/word chosen; tunable by env.
- Honouring the claim changes behaviour for anyone already signing `'text'`: verified none in 30 days except our QA probes.
- Text turns may run long: the prompt clause asks for short turns; `ACTIVE_GAP_CAP_SEC=600` already caps billing gaps.
