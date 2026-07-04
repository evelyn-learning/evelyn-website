# Caption ↔ TTS Word-Sync + Render-Timing Fix — Design

**Date:** 2026-07-04
**Status:** Approved (user-grilled, 5 decisions locked)
**Queue:** User-ordered fixes queue 2026-07-04, item 1
**Supersedes:** the deferred caption↔audio-sync memo (2026-06-24, ear-test #15)

## Problem

1. **Captions race the audio.** The in-session caption strip (`CaptionTicker` in
   `SessionStage.tsx`) reveals the brain's full turn text with a fixed 85 ms/char
   typewriter. The TTS audio plays slower and can pause mid-turn (TTS latency
   gaps, noise barge-in, student interruption, kill/retry). The caption is not
   tied to playback: it streams ahead, keeps typing through audio pauses, and on
   a page reload re-typewriters the last (already-spoken) turn from scratch.
   Requirement: captions follow tutor speech word-for-word in every situation —
   reload, pause on interruption, pause on noise, resume.

2. **Renders can surface away from their narrating sentence.** Render↔speech
   sync (buffer-and-flush, `NEXT_PUBLIC_TUTOR_RENDER_SYNC`, ON in both envs) is
   shipped and flushes each render when its anchor (preceding) sentence's audio
   completes. The remaining gap is **Bug 4 (announce-then-delayed-emit)**,
   live-confirmed 2026-06-21: the brain announces a visual early in a turn but
   emits the tool-call several sentences later in the stream; the buffer flushes
   it at its stream position, so it surfaces during unrelated narration.
   Requirement: the render lands when its corresponding text is spoken.

## Decisions locked (user-confirmed 2026-07-04)

1. **Timing source: proportional audio-clock mapping.** No TTS vendor change.
   Per-sentence elapsed-played-seconds ÷ sentence-duration → whole-word reveal.
   Sentence boundaries are exact; within-sentence accuracy ±1–2 words. The
   spoken-progress API is designed so true word timestamps (e.g. Cartesia
   sonic-3 `add_timestamps`, already a teacher-personas follow-up) can slot in
   later without rework.
2. **Reload/session-resume: show the last turn fully, instantly.** The caption
   only "types" while audio is actually playing. Finalized turns render fully
   revealed, no typewriter.
3. **Engine scope: claude-brain only** (both TTS providers: Realtime voice and
   openai-mini). Native OpenAI-Realtime and Gemini Live engines keep the
   current typewriter. Same precedent as render-sync.
4. **Surface scope: caption strip only.** The transcript drawer keeps its
   sentence-level streaming reveal.
5. **Render timing in scope: captions + Bug-4 fix + render-sync re-verify.**
   Prompt-side adjacency rule (generalize the existing board-anchored-speech
   "appears as you speak it" placement rule to all `show_*` calls); client-side
   re-anchoring by text-matching was considered and rejected (fragile matching,
   explicitly rejected in the render-sync design too).

## Architecture

Three additive layers for captions, one prompt rule for renders. No changes to
`clearSpeechQueue`, kill/retry, perception verdicts, or the render-sync buffer.
Old typewriter remains as the flag-off / non-claude-brain fallback.

### Layer 1 — playback clock in `useOpenAIRealtime.ts`: `getSpokenProgress()`

The hook already labels every audio chunk with its sentence
(`audioQueueSentenceRef`), knows the currently-heard sentence
(`currentSpeakTextRef`), and fires `onTtsPlaybackProgress('sentence-start'|'drain')`.

Add a per-sentence playback clock, read-only alongside the existing refs:

- On chunk dequeue in `playNextAudio`: record `chunkStartCtxTime =
  ctx.currentTime` and the chunk's duration; on a sentence transition reset
  `playedBeforeChunkSec = 0`, else accumulate the previous chunk's duration.
- New getter:

  ```ts
  getSpokenProgress(): {
    sentence: string | null;   // speech-form text of the sentence playing now
    elapsedSec: number;        // playedBeforeChunkSec + min(ctx.currentTime − chunkStartCtxTime, chunkDur)
    arrivedTotalSec: number;   // elapsed + queued-but-unplayed seconds of the SAME sentence
    playing: boolean;
  }
  ```

- **Do-not-regress:** `getCurrentSentenceFraction()` (resume-from-cut P5) and
  its accounting (`currentSentencePlayedSecRef`) stay byte-for-byte untouched.
  This is a parallel read.

Duration denominator: the openai-mini path pushes a whole sentence as one chunk,
so `arrivedTotalSec` is exact. The Realtime path streams chunks during playback,
so arrived-total undercounts early in a sentence; the consumer uses
`max(arrivedTotalSec, chars ÷ calibratedCharsPerSec)` — an EMA calibrated from
completed sentences, seeded at the current typewriter rate (~85 ms/char ≈ 11.8
chars/s) — so the reveal fraction is conservative: the caption may trail by a
beat and catch up at the sentence boundary, never race ahead.

### Layer 2 — pure module `src/lib/tutor/voice/caption-sync.ts`

Registry + reveal computation, no React, unit-testable without audio.

- **Registry:** ordered `{speech, display}` sentence pairs per attempt, recorded
  in the orchestrator's sentence-event handler — the one place both forms exist
  (`trimmedSentence` display-form vs `sentenceForSpeech` TTS-normalized).
  Display form is stored markdown-stripped (the caption strips `*`/`**` today)
  so char proportions track the spoken text. Reset at attempt start; post-kill
  sentences are never dispatched to TTS and never registered, so a killed
  attempt's caption freezes at voiced content (matches chat semantics); a retry
  is a new attempt → fresh registry → caption follows the retry's audio.
- **Reveal:** `revealFor(progress, registry, prevReveal)` = joined display text
  of fully-played sentences + word-clamped proportional prefix of the
  currently-playing sentence. **Monotonic within a turn** (never regresses; an
  audio pause freezes it; `sentence:null` after a cancel holds `prevReveal`).
- **Matching:** cursor scans forward from the last matched index (so verbatim
  short duplicates within a turn resolve in order). Resume-after-noise replays
  full speech strings via `resumeSpeakText` → exact match. The resume-from-cut
  clause-tail partial (`clauseTailFromFraction` replaces the cut sentence with
  its tail) gets a suffix-match fallback: find the registry entry whose speech
  form ends with the replayed text, and map the fraction onto the tail's char
  range (`revealedChars = displayLen × (cutOffset + frac × (1 − cutOffset))`).
  Unmatched sentence (defensive): reveal through the end of the previous
  matched sentence and let the next boundary re-sync.
- **Turn finalization:** on `drain`/turn-end the full display text reveals.

### Layer 3 — surface: imperative getter + `CaptionTicker` poll

- `VoiceTutorRealtime` exposes `getSpokenCaption(): { turnKey: string; text:
  string; live: boolean }` on its existing imperative handle (`RealtimeHandle`,
  already held by `page.tsx`). It composes Layer 1's progress with Layer 2's
  registry. `live:false` when no attempt is actively speaking.
- `page.tsx` → `TutorSession` → `SessionStage` pass the getter down as an
  optional prop alongside the existing `liveCaption` string.
- `CaptionTicker`: when the getter is present and the flag is ON, a ~12 Hz rAF
  poll drives the reveal; the existing width-fit trailing-words rendering is
  unchanged. `live:false` → render the full text instantly (covers reload,
  session resume, finalized turns). Getter absent or flag OFF → today's 85
  ms/char typewriter, untouched.
- If the empty-board "presence caption" in `SessionStage` renders `liveCaption`
  too, it gets the same source (confirm during implementation).

Why polling an imperative getter: pushing a caption string up through React
state re-renders the page tree ~10×/s; per-word `setTimeout` schedules drift
and need cancel bookkeeping in every kill/barge-in path. The poll touches zero
fragile code.

### Render timing — Bug-4 fix + re-verify

- **Prompt rule (generic, no topic-specific examples):** generalize the
  board-anchored-speech placement rule ("the anchor APPEARS as you speak it",
  `system-prompt-builder.ts` ~line 318, currently scoped to flag-gated
  improvised anchors) to ALL render tool-calls: emit each `show_*`/scribble
  call immediately adjacent to the sentence that introduces it — not
  front-loaded before the narration reaches it, not parked at turn end. Spliced
  as a new always-on rule near the existing whiteboard rules (subject to the
  BASE_PROMPT cache-safety conventions: build-time constant, stable across
  sessions).
- **Measurement:** harness/session-log check — for each render, the distance
  (in sentences) between the tool-call's stream position and its announcing
  sentence; before/after comparison over a scripted session.
- **Re-verify render-sync live** while testing captions (same sessions): render
  surfaces as its narrating sentence begins; Skip/formula-dump turns
  stall-release rather than dumping; barge-in drops/flushes per verdict.

## Edge-case ledger

| Case | Behavior |
| --- | --- |
| TTS latency gap mid-turn | `playing:false`, elapsed frozen → caption freezes mid-sentence at a word boundary; resumes with audio |
| Noise barge-in / student interruption (`clearSpeechQueue`) | sentence nulls → poll holds `prevReveal`; perception resume replays tail → matching continues |
| Resume-from-cut clause tail | suffix-match fallback maps fraction onto tail char range |
| Judge/validator kill + retry | registry per attempt: killed caption freezes at voiced content; retry = new turnKey, fresh reveal |
| Page reload / session resume | no active attempt → `live:false` → full last entry shown instantly, no typewriter |
| Verbatim duplicate short sentences in one turn | forward-scanning cursor matches in order |
| Realtime path: duration unknown early in sentence | conservative denominator (char-estimate floor) — caption trails, never races |
| Fast-opener (bypasses TTS gate) | dispatched through `speakText` like any sentence; registered normally |
| Native-realtime / Gemini engines, flag OFF | current typewriter, byte-identical behavior |

## Gate & rollback

`NEXT_PUBLIC_TUTOR_CAPTION_SYNC`, **default ON** (render-sync precedent), OFF →
legacy typewriter. Engine-gated to claude-brain by construction. Prompt rule is
a separate server-side change; rollback = revert the prompt splice.

## Testing

- **Unit:** `scripts/test-caption-sync.ts` (`npm run test:caption-sync`) —
  registry matching, word-boundary reveal, monotonic clamp, clause-tail
  suffix fallback, duplicate-sentence cursor, denominator estimation, turn
  finalization, attempt reset.
- **Live checklist:** (1) normal turn — words appear as spoken, both TTS
  providers; (2) noise barge-in → caption freezes, resume → continues;
  (3) `__tutorForceKill` → caption freezes at voiced content, retry re-types;
  (4) reload mid-session → last turn shown fully, no typewriter; (5) render
  lands with its announcing sentence (Bug-4 prompt rule + render-sync
  re-verify); (6) flag OFF → old behavior.
