# Tutor Human-Like Latency & Board-Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cut student-stop → first-tutor-audio from ~2.3–5.4s to ~1.5–2.5s hard / ~0.5s perceived, make board ink co-occur with the words that describe it (word-level, not ±1 sentence), and drive "spoken but never written" content toward zero.

**Architecture:** Five phases, each independently shippable behind a flag and measured by Phase-0 instrumentation before the next begins. Phase 0 instruments the currently-invisible pre-brain stages; Phase 1 recovers free latency (streaming first-sentence TTS, fast-opener, Ink-2 threshold tuning); Phase 2 adds a guarded acknowledgment micro-turn (the "human reflex layer"); Phase 3 migrates TTS to Cartesia WebSocket with word timestamps and rebuilds render-sync on a word clock + audio-paced draw-on; Phase 4 adds a server-side Rule-8 repair pass and visible fallbacks for silently-dropped renders; Phase 5 is a data-gated decision on eager dispatch.

**Tech Stack:** Next.js (evelynlearning engine, this repo), Cartesia Ink-2 STT (`useCartesiaInkWS.ts`), Cartesia sonic-3.5 TTS (`/api/tutor/tts-cartesia`), Claude Sonnet brain (`/api/tutor/brain/stream` SSE), pure-module test scripts via `npx tsx scripts/test-*.ts`.

## Global Constraints

- Repo: `/Users/luke/Dev/evelynlearning`. Deploy to prod ONLY via `./deploy-update.sh` (NEVER `npm run deploy` — it ships to a dead dir). Prod pm2 app: `evelyn-website`, port 3001.
- Every behavioral change ships behind an env flag defined in `src/lib/tutor/orchestrator/flags.ts`, default OFF, following the existing `NEXT_PUBLIC_TUTOR_*` pattern. Enable in dev → e2e → live-test round → prod env.
- **Pre-audio safety invariants (must survive every task):** the LLM judge is ADVISORY-ONLY (Pillar 2b — `performKill` removed from judge path); pre-audio correctness rests on: server `validateToolCall` (`claude-brain.ts` ~1512), client per-tool validators (`process-tool-call.ts`), verdict-hold (`VERDICT_HOLD_CAP_MS=1500`, attempt-0 only), the 1s first-tool gate (`const gateTimer = setTimeout(openGate, skipTurnMarkerPresent ? 3_600_000 : 1000)` in `VoiceTutorRealtime.tsx`), validate-before-speak, dedup/supersede, perception + barge-in gates. **Never open the first-tool gate for content-bearing sentences** (500ms→1s revert history: "gibberish reports").
- **Retry cardinal rule:** never re-fire a brain turn once any event reached the client (`brain-retry.ts` `decideBrainRetry`, `emittedToClient>0`). No speculative brain calls that can emit server-resolved tools (`generate_problem` consumes bank problems + mutates difficulty bias irreversibly; `advance_lesson`/`mark_segment_complete` mutate lesson state).
- Ink-2 transcript semantics: cumulative per `turn_id`, strictly growing, never rewritten; `turn.eager_end` is provisional ("probably done"), `turn.end` is authoritative, `turn.resume` means the student kept talking. Thresholds are env-tunable connect params in `useCartesiaInkWS.ts` (~line 156): `NEXT_PUBLIC_TUTOR_INK_TURN_START` (0.8), `..._EAGER_END` (0.4), `..._END` (0.2), `..._END_TIMEOUT_MS` (5600).
- TTS pipeline invariants (openai-mini/Cartesia HTTP path in `useOpenAIRealtime.ts`): one sentence ↔ one playback accounting unit; `speakEpochRef` bump kills in-flight fetches; sentence-start stamp fires exactly once per sentence; sentence completion (drives render-sync `playbackStartedCount`) derives from the chunk `onended` chain; `silent` provider mode must keep firing identical events (e2e depends on it); ElevenLabs → captions fallback chain unchanged.
- Line numbers in this plan are anchors as of 2026-07-20 (commits near engine main 5e260ed5 + rounds 26–28b). Always locate by the quoted code, not the raw number.
- New pure logic gets a pure module + a `scripts/test-*.ts` script wired into `package.json` scripts (existing pattern: `test:render-sync`, `test:bargein-gate`, `test:brain-retry`).
- Test-runner note: `npx tsx scripts/test-<name>.ts` for new scripts; run existing suites before commit for touched areas (listed per task).

---

## Phase 0 — Instrument the invisible third

The server already logs `first_sentence / first_tool / total` per brain turn (`brain/stream/route.ts` ~800: `[brain.stream] student=… first_sentence=Xms…`), and the client emits `brain_turn` debug events. But nothing measures eager_end→turn.end, turn.end→brain-fetch, or TTS-fetch→first-audio. Every later phase is judged against this baseline.

### Task 0.1: Pure turn-latency ledger

**Files:**
- Create: `src/lib/tutor/voice/turn-latency.ts`
- Create: `scripts/test-turn-latency.ts`
- Modify: `package.json` (add `"test:turn-latency": "npx tsx scripts/test-turn-latency.ts"` next to `test:brain-retry`)

**Interfaces:**
- Produces: `createTurnLatencyLedger()`, `TurnLatencyLedger` with `mark(name, tMs)`, `summarize()` — consumed by Task 0.2.

- [ ] **Step 1: Write the failing test** — `scripts/test-turn-latency.ts`:

```ts
import { createTurnLatencyLedger } from '../src/lib/tutor/voice/turn-latency';

let failures = 0;
function check(name: string, cond: boolean) {
  if (!cond) { failures++; console.error(`FAIL ${name}`); } else console.log(`ok ${name}`);
}

// Happy path: all marks in order
const l1 = createTurnLatencyLedger();
l1.mark('eagerEnd', 1000);
l1.mark('turnEnd', 1400);
l1.mark('brainFetch', 1402);
l1.mark('firstSentence', 2900);
l1.mark('firstTtsFetch', 2905);
l1.mark('firstAudio', 3600);
const s1 = l1.summarize();
check('eagerToEnd', s1.eagerToEndMs === 400);
check('endToBrainFetch', s1.endToBrainFetchMs === 2);
check('brainFirstSentence', s1.brainFirstSentenceMs === 1498);
check('ttsToAudio', s1.ttsToFirstAudioMs === 695);
check('total', s1.totalMs === 2200); // turnEnd (1400) → firstAudio (3600)
check('complete', s1.complete === true);

// Missing eagerEnd (Ink can jump straight to turn.end): segments null, not NaN
const l2 = createTurnLatencyLedger();
l2.mark('turnEnd', 500);
l2.mark('brainFetch', 501);
l2.mark('firstSentence', 1700);
l2.mark('firstTtsFetch', 1701);
l2.mark('firstAudio', 2200);
const s2 = l2.summarize();
check('noEager', s2.eagerToEndMs === null && s2.totalMs === 1700 && s2.complete === true);

// Duplicate mark: first wins (turn.resume can re-fire eager_end)
const l3 = createTurnLatencyLedger();
l3.mark('eagerEnd', 100);
l3.mark('eagerEnd', 900);
l3.mark('turnEnd', 1000);
check('firstWins', l3.summarize().eagerToEndMs === 900);

// Incomplete turn (killed before audio): complete=false, no throw
const l4 = createTurnLatencyLedger();
l4.mark('turnEnd', 100);
l4.mark('brainFetch', 101);
check('incomplete', l4.summarize().complete === false && l4.summarize().totalMs === null);

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('test:turn-latency PASS');
```

- [ ] **Step 2: Run to verify it fails** — `npx tsx scripts/test-turn-latency.ts` → FAIL (module not found).
- [ ] **Step 3: Implement** — `src/lib/tutor/voice/turn-latency.ts`:

```ts
/**
 * Per-turn latency ledger — pure, side-effect-free.
 *
 * Fills the instrumentation gap in front of the brain: the server's
 * [brain.stream] line times first_sentence/first_tool/total from the brain
 * fetch onward, but eager_end→turn.end (Ink-2 semantic confirm),
 * turn.end→brain-fetch (client classify), and TTS-fetch→first-audio were
 * invisible. Marks are absolute ms timestamps supplied by the caller
 * (performance.now() or Date.now() — caller's choice, must be consistent
 * within a turn). First mark wins on duplicates: turn.resume can re-fire
 * eager_end, and we want the ORIGINAL provisional endpoint.
 */

export type TurnLatencyMark =
  | 'eagerEnd'     // Ink-2 turn.eager_end received (provisional endpoint)
  | 'turnEnd'      // Ink-2 turn.end received (authoritative transcript)
  | 'brainFetch'   // POST /api/tutor/brain/stream dispatched
  | 'firstSentence'// first `sentence` SSE event parsed
  | 'firstTtsFetch'// first sentence handed to fetchTTSPromise
  | 'firstAudio';  // first playback-start stamp of the turn

export interface TurnLatencySummary {
  eagerToEndMs: number | null;
  endToBrainFetchMs: number | null;
  brainFirstSentenceMs: number | null;
  ttsToFirstAudioMs: number | null;
  /** turnEnd → firstAudio: the number the student feels. */
  totalMs: number | null;
  complete: boolean;
}

export interface TurnLatencyLedger {
  mark(name: TurnLatencyMark, tMs: number): void;
  summarize(): TurnLatencySummary;
}

export function createTurnLatencyLedger(): TurnLatencyLedger {
  const marks = new Map<TurnLatencyMark, number>();
  const diff = (a: TurnLatencyMark, b: TurnLatencyMark): number | null => {
    const ta = marks.get(a); const tb = marks.get(b);
    return ta !== undefined && tb !== undefined ? tb - ta : null;
  };
  return {
    mark(name, tMs) { if (!marks.has(name)) marks.set(name, tMs); },
    summarize() {
      const totalMs = diff('turnEnd', 'firstAudio');
      return {
        eagerToEndMs: diff('eagerEnd', 'turnEnd'),
        endToBrainFetchMs: diff('turnEnd', 'brainFetch'),
        brainFirstSentenceMs: diff('brainFetch', 'firstSentence'),
        ttsToFirstAudioMs: diff('firstTtsFetch', 'firstAudio'),
        totalMs,
        complete: totalMs !== null,
      };
    },
  };
}
```

- [ ] **Step 4: Run to verify pass** — `npx tsx scripts/test-turn-latency.ts` → `test:turn-latency PASS`.
- [ ] **Step 5: Add the package.json script and commit**

```bash
git add src/lib/tutor/voice/turn-latency.ts scripts/test-turn-latency.ts package.json
git commit -m "feat(tutor): pure per-turn latency ledger (phase 0, humanlike-latency plan)"
```

### Task 0.2: Wire the ledger into VoiceTutorRealtime + emit `turn_latency` debug event

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (5 small insertions at existing anchors)

**Interfaces:**
- Consumes: `createTurnLatencyLedger` from Task 0.1.
- Produces: `turn_latency` debug event (`onDebugEvent`) — lands in `TutorSession.debugEvents` (Mongo) and `artifacts/tutor-e2e/*/debug-events.json` automatically via the existing debug-event plumbing. Consumed by every later phase's before/after measurement.

- [ ] **Step 1: Add a per-turn ledger ref** near the other per-turn refs (search anchor: `let firstSentenceMs` / `ttsDispatchedCountRef`): `const turnLatencyRef = useRef<TurnLatencyLedger | null>(null);`
- [ ] **Step 2: Mark at the five anchors** (locate each by the quoted code, all already exist):
  - `eagerEnd`: inside the Ink-2 `onSpeechStop` callback (the hook fires it on `turn.eager_end`) — create the ledger here if null: `turnLatencyRef.current ??= createTurnLatencyLedger(); turnLatencyRef.current.mark('eagerEnd', performance.now());`
  - `turnEnd`: top of `perceptionOnTranscript` (anchor: the Ink-2 `onTranscript` handler, ~12064).
  - `brainFetch`: in `handleStudentTranscriptForBrain` immediately before `callBrainOnce` (anchor ~11294).
  - `firstSentence`: beside the existing `if (firstSentenceMs === null) firstSentenceMs = Date.now() - t0;` (anchor ~8481).
  - `firstTtsFetch` + `firstAudio`: `firstTtsFetch` where the first sentence of the turn is dispatched to `speakText`; `firstAudio` in the `onTtsPlaybackProgress('sentence-start')` handler, first occurrence per turn (guard with the ledger's first-wins semantics — just call `mark` unconditionally).
- [ ] **Step 3: Emit + reset at turn completion** — in the same place the existing `brain_turn` debug event is emitted (anchor ~10587):

```ts
const lat = turnLatencyRef.current?.summarize();
if (lat) {
  onDebugEvent?.('turn_latency',
    `eager→end=${lat.eagerToEndMs}ms end→fetch=${lat.endToBrainFetchMs}ms ` +
    `brain_first=${lat.brainFirstSentenceMs}ms tts→audio=${lat.ttsToFirstAudioMs}ms ` +
    `TOTAL=${lat.totalMs}ms complete=${lat.complete}`);
}
turnLatencyRef.current = null;
```

- [ ] **Step 4: Verify** — `npm run build` clean; then run one e2e scenario (`npm run test:tutor-e2e` with the smallest scenario, or a manual `/tutor` session with `silent` TTS) and confirm `turn_latency` lines appear in `debug-events.json` with non-null `TOTAL` on normal turns.
- [ ] **Step 5: Commit** — `git commit -m "feat(tutor): turn_latency debug event — instrument eager_end→turn.end→brain→first-audio (phase 0)"`

### Task 0.3: Baseline capture

- [ ] Run 3+ live sessions (dev, real Cartesia + real brain) across a math and a history course; export the `turn_latency` numbers; write medians into `docs/superpowers/plans/2026-07-20-latency-baseline.md`. **Every later phase's success criterion references this file.**
- [ ] Commit the baseline doc.

---

## Phase 1 — Free latency (no behavior change)

### Task 1.1: Streaming first-audio for Cartesia sentences (head/tail split)

Today `fetchTTSPromise` does `const buf = await res.arrayBuffer();` (`useOpenAIRealtime.ts` ~2727) — the full sentence is synthesized before a byte plays, forfeiting the streaming pass-through the route deliberately preserves (`tts-cartesia/route.ts:124-127`). Fix: start playback once ~0.4s of PCM has arrived; deliver the remainder as a continuation chunk. **Flag:** `NEXT_PUBLIC_TUTOR_TTS_STREAM_HEAD=on` → `export const TUTOR_TTS_STREAM_HEAD` in `flags.ts`, default off.

**Files:**
- Create: `src/lib/tutor/voice/pcm-stream.ts` (pure head/tail reader)
- Create: `scripts/test-pcm-stream.ts`; add `"test:pcm-stream"` to package.json
- Modify: `src/app/tutor/hooks/useOpenAIRealtime.ts` (`fetchTTSPromise`, `sendOneSpeakTextViaOpenAITTS`, `playNextAudio` continuation handling)
- Modify: `src/lib/tutor/orchestrator/flags.ts`

**Interfaces:**
- Produces: `readPcmHeadTail(body: ReadableStream<Uint8Array>, headSamples: number): Promise<{ head: Float32Array; tailPromise: Promise<Float32Array | null> } | null>` — `null` on empty body; `tailPromise` resolves `null` when there is no tail (short sentence) and NEVER rejects.

**Invariants this task must preserve (verify each explicitly in review):**
1. Exactly ONE sentence-start playback stamp per sentence — the tail chunk must NOT re-stamp (`emitPlaybackStamp`) or re-push sentence text.
2. Sentence completion (render-sync `playbackStartedCount`, drain) fires only when the LAST chunk of the sentence ends — the head chunk's `onended` must not advance the sentence queue while a tail is pending/queued.
3. `speakEpochRef` kill drops the tail: check `dispatchEpoch !== speakEpochRef.current` again when `tailPromise` resolves, mirroring the existing orphaned-fetch logic (X3 wedge comment block ~2801-2841).
4. `silent` provider mode and the ElevenLabs/captions fallback paths are untouched (they stay whole-buffer; the flag branches only the Cartesia-success path).
5. Prefetch cache: cache entries for NEXT sentences may stay whole-buffer (prefetched bytes are ready before playback anyway) — only the *cache-miss, first-dispatch* path streams. This confines the change to the cold first sentence, which is the only one that pays synthesis serially.

- [ ] **Step 1: Write the failing pure test** — `scripts/test-pcm-stream.ts`: build a `ReadableStream` from 3 Uint8Array chunks that deliberately split a Float32 sample across a chunk boundary (e.g. 6 bytes + 7 bytes + rest of 24000 samples); assert head length === requested headSamples, `head` + `tail` concatenated byte-equal to the source, misaligned boundaries carried correctly, empty stream → `null`, stream shorter than headSamples → whole audio in `head`, `tailPromise` resolves `null`.
- [ ] **Step 2: Run to fail** — `npx tsx scripts/test-pcm-stream.ts` → FAIL.
- [ ] **Step 3: Implement `readPcmHeadTail`** — accumulate `Uint8Array`s with a byte-remainder carry (Float32 = 4 bytes; `res.body` chunks split mid-sample); resolve head at `headSamples * 4` bytes; keep reading into the tail; wrap all reader errors → `tailPromise` resolves with whatever accumulated so far (or `null` if nothing) and logs `console.warn('[pcm-stream] tail truncated:', err)` — a truncated tail degrades to a shorter sentence, never a rejection.
- [ ] **Step 4: Pass** — `npx tsx scripts/test-pcm-stream.ts`.
- [ ] **Step 5: Integrate.** In `fetchTTSPromise`'s Cartesia success branch (replacing the `await res.arrayBuffer()` at anchor `const buf = await res.arrayBuffer();`), behind `TUTOR_TTS_STREAM_HEAD` and only when `useCartesia && attempt-path succeeded`: return a discriminated result `{ kind: 'streamed', head, tailPromise }` vs the existing `Float32Array` (`kind: 'whole'` conceptually). Keep the declared return type additive: `Promise<Float32Array | StreamedSentence | null>`. In `sendOneSpeakTextViaOpenAITTS`: on `streamed`, push `head` exactly as today (text + scriptId into the parallel arrays `audioQueueSentenceRef` / `audioQueueScriptIdRef`), then on `tailPromise` resolution (epoch re-checked, invariant 3) push the tail with a continuation marker — add a parallel `audioQueueContinuationRef: boolean[]` pushed alongside the other two arrays everywhere they are pushed/shifted. In `playNextAudio`: a chunk whose continuation flag is true skips the sentence-start stamp and skips sentence-queue advance bookkeeping on the *previous* chunk's end (invariants 1–2). **Edge case:** tail not yet arrived when head's `onended` fires → treat as the existing inter-sentence-gap path (queue empty, `isPlaying=false`); when the tail lands it re-enters via the normal push + `if (!isPlayingRef.current) playNextAudio()` — a ≤100ms intra-sentence gap in the worst case, acceptable and flag-revertible.
- [ ] **Step 6: Verify** — `npm run test:tts-recovery && npm run test:render-sync && npm run test:resume-cut && npm run test:cancel-storm`; then a live dev session with the flag on: confirm `turn_latency` `tts→audio` drops vs baseline (expect −200–500ms on turn-1 sentences), audio has no audible seam, barge-in mid-first-sentence still kills cleanly.
- [ ] **Step 7: Commit** — `git commit -m "feat(tutor): stream Cartesia first-sentence audio (head/tail) behind TUTOR_TTS_STREAM_HEAD (phase 1)"`

### Task 1.2: Fast opener on the embed — VERIFY ONLY (already live)

`TUTOR_BRAIN_FAST_OPENER` (`flags.ts:36-37`, `NEXT_PUBLIC_TUTOR_BRAIN_FAST_OPENER === 'true'`) already voices a content-free brain sentence-0 ungated (bypasses the 1s first-tool gate without opening it, pushes to the perception self-voice buffer via `pushTtsScriptForPeception`, `isSafeOpener` re-gates content-bearing openers).

- [x] Confirm current prod/embed env state — **checked 2026-07-21: already `true` in prod `.env.local:104` (build-time baked)**. Task reduces to verification + measurement.
- [ ] Verify in dev: run `npm run test:pedagogy-b3` (opener fallback) + one e2e scenario; verify sentence-0 speaks before the first tool verdict and no content-bearing sentence leaks pre-gate (`isSafeOpener` behavior). Include one **mock-review agenda session** (new dispatch path, commits 09314ccd–0564374d) — confirm opener/greeting-guard exemption doesn't double-speak.
- [ ] Measure: `turn_latency` TOTAL on turn 1 vs baseline. Document result in the baseline doc.

### Task 1.3: Ink-2 endpoint threshold tuning (data-driven, env-only)

- [ ] From Phase-0 baseline, read the median `eager→end` gap. If ≥300ms, trial-tune via env (no code): raise `NEXT_PUBLIC_TUTOR_INK_TURN_EAGER_END` (e.g. 0.4→0.5) and/or `..._END` (0.2→0.3) so Cartesia confirms turns sooner. **Do NOT cut `..._END_TIMEOUT_MS` below 4000** — truncating a mid-thought student produces a partial transcript the brain will confidently mis-answer; the perception `continuation` verdict layer exists because short pauses are not turn-ends.
- [ ] Validate each candidate with `npm run test:voice-harness` + 2 live dev sessions listening for premature cut-offs (student mid-sentence → tutor starts).
- [ ] Record chosen values + measured `eager→end` delta in the baseline doc; set in prod env.

---

## Phase 2 — Acknowledgment micro-turn (perceived latency → ~0.5s)

A neutral, non-evaluative vocal acknowledgment ("Hmm, let me think about that—", "Okay, let's see—") spoken ~450ms after `turn.end` **iff** the brain's sentence-0 hasn't arrived yet. Built on the fast-opener mechanics (the sanctioned ungated-speak pattern), NOT a new speech path. **Flag:** `NEXT_PUBLIC_TUTOR_ACK_LAYER=on` → `TUTOR_ACK_LAYER` in `flags.ts`.

**Hard guards (each traces to a mapped failure mode):**
- Fires only AFTER `classifyTranscript` returns non-noise (never acknowledge a passing train — classification is sync regex, already done before `handleStudentTranscriptForBrain`).
- Phrases must be judgment-free: at ack time we don't know if the student was right; "Okay!" before "Not quite…" reads as approval. Pool is "thinking" noises only.
- Ack audio is pushed to the perception self-voice buffer (same call the fast opener uses, `pushTtsScriptForPeception`) so its own audio can't read as student speech / false barge-in.
- Excluded from turn accounting: no sentence-start stamp for render-sync (`anchorM` must not shift), excluded from the Stage-3.1 unplayed-tail snapshot, not counted in `audibleSentenceCount` — mirror exactly how the fast opener is excluded (verify at its call site before writing code).
- Skipped when: fast opener already spoke this turn, skip-turn marker present, attempt > 0 (retries), state not in the normal dispatch path, or brain sentence-0 already dispatched.
- Frequency damping: never on consecutive turns twice in a row with the same phrase; at most ~80% of eligible turns via deterministic parity (`turnIndex % 5 !== 0`) — humans don't backchannel every single time. (Resolved 2026-07-21: 80%, matching the `AckInput.turnParity` contract.)

### Task 2.1: Pure ack module

**Files:** Create `src/lib/tutor/voice/ack-layer.ts` + `scripts/test-ack-layer.ts`; add `"test:ack-layer"` script.

**Interfaces:**
- Produces: `shouldSpeakAck(input: AckInput): boolean` and `pickAck(turnIndex: number, lastAckIndex: number | null): { text: string; index: number }` — deterministic (index-based rotation, no `Math.random` so tests are exact).

```ts
export interface AckInput {
  classification: 'clean' | 'uncertain' | 'noise';
  attempt: number;             // 0 = first attempt
  skipTurn: boolean;
  fastOpenerSpoken: boolean;
  brainSentence0Dispatched: boolean;
  msSinceTurnEnd: number;      // fire window: >= 450
  ackSpokeLastTurn: boolean;   // damping
  turnParity: number;          // turnIndex % 5 !== 0 → ~80% cap, deterministic
}
```

- [ ] **Step 1: failing test** — exact-value tests: fires on the happy path; refuses on each guard individually (noise, attempt>0, skipTurn, fastOpenerSpoken, sentence0 dispatched, <450ms, damping); `pickAck` never repeats `lastAckIndex` and only returns phrases from the neutral pool: `["Hmm, let me think—", "Okay, let's see—", "Right, so—", "Mm, one moment—", "Let's look at that—"]`.
- [ ] **Step 2:** run → FAIL. **Step 3:** implement (pure boolean AND of the guards + rotation). **Step 4:** pass. **Step 5:** commit `feat(tutor): pure ack-layer decision + phrase rotation (phase 2)`.

### Task 2.2: Wire the ack timer

**Files:** Modify `VoiceTutorRealtime.tsx`; modify `flags.ts` (add `TUTOR_ACK_LAYER`).

- [ ] In `handleStudentTranscriptForBrain`, after the classify/heuristic block and alongside the `brainFetch` latency mark: arm `ackTimerRef = setTimeout(tryAck, 450)`. `tryAck` builds `AckInput` from live refs, and if `shouldSpeakAck`, speaks via the **fast-opener speak call** (same function, same self-voice push, same exclusion bookkeeping — copy its call shape verbatim from the fast-opener site, anchor ~8540-8600).
- [ ] Clear `ackTimerRef` at: first `sentence` SSE arrival, `performKill`, `closeGate`, perception cancel (`applyPerceptionVerdict` FRESH/RESTORE paths), and component teardown.
- [ ] Debug event `ack_spoken` / `ack_suppressed(reason)` for telemetry.
- [ ] **Verify:** `npm run test:ack-layer`; live dev session — ack plays within ~0.5s on slow turns, never on noise, never doubles with fast opener, barge-in during ack cleanly kills (perception treats ack audio as self-voice); killed turns after an ack don't break Stage-3.1 resume (`npm run test:resume-cut`).
- [ ] Commit `feat(tutor): acknowledgment micro-turn behind TUTOR_ACK_LAYER (phase 2)`.

### Task 2.3: Live-test round + prod

- [ ] Standard live-test round protocol (rounds ledger style): 2+ full lessons, math + humanities, **plus one mock-review agenda session** (new dispatch path since 2026-07-21 — verify ack guards hold there); check `turn_latency` + `ack_*` events; specifically hunt: ack talking over a `turn.resume` continuation, ack before a wrong-answer verdict feeling approving. Ship via `./deploy-update.sh`; record in the baseline doc + live-test ledger.

---

## Phase 3 — Word-level board↔speech sync

Three sub-flags so each layer can revert independently: `TUTOR_TTS_WS` (WebSocket TTS w/ timestamps), `TUTOR_RENDER_WORD_ANCHOR` (word-clock flush), draw-on pacing rides the existing `NEXT_PUBLIC_TUTOR_DRAW_ON`.

### Task 3.1: Cartesia WebSocket TTS transport with word timestamps

**Files:** Create `src/app/tutor/hooks/useCartesiaSonicWS.ts` (modeled on `useCartesiaInkWS.ts`); modify `flags.ts`; modify `useOpenAIRealtime.ts` (provider branch); possibly extend `/api/tutor/cartesia-token` grants.

- [ ] Spike first (timeboxed): confirm with a standalone script (`scripts/spike-cartesia-ws-tts.ts`) that `wss://api.cartesia.ai/tts/websocket` + `add_timestamps: true` returns word-timestamp frames alongside pcm_f32le audio for a sonic-3.5 voice using a token minted by the existing `/api/tutor/cartesia-token` route (the route may need a `tts` grant added — check Cartesia docs `2026-03-01` version). **Docs check 2026-07-21: API reference lists `add_timestamps` + word-level timing response frames for sonic-3.5/sonic-3/sonic-latest — the spike validates it works on OUR plan/token specifically.** **If word timestamps are unavailable on this plan/model, STOP this task** and fall back to Task 3.2's estimator-only mode (design below works with either).
- [ ] Implement the hook: per-sentence `send({transcript, voice, output_format, add_timestamps: true, context_id: <turnId:sentenceIdx>})`; emit `onAudioChunk(Float32Array)` (feeds the same playback queue as Task 1.1's streamed head/tail — WS chunks ARE the stream) and `onWordTimestamps(sentenceIdx, words: {word, startSec}[])`.
- [ ] Maintain a **word clock** in `VoiceTutorRealtime`: `wordClockRef = { sentenceIdx, wordIdx }`, advanced by a `requestAnimationFrame`-driven comparison of `AudioContext.currentTime` against each chunk's scheduled start + word offsets. Emit `onTtsPlaybackProgress('word', {sentenceIdx, wordIdx})` at word boundaries (throttled to ~10/s).
- [ ] Keep the entire HTTP path untouched as fallback; the ElevenLabs/captions chain still hangs off HTTP-path failure (WS failure → revert to HTTP for the session, debug event `tts_ws_fallback`).
- [ ] Verify: side-by-side dev session WS vs HTTP — identical audio, `word` progress events monotonic; `npm run test:render-sync` untouched-green.
- [ ] Commit.

### Task 3.2: Word-anchored render flush (pure core first)

**Files:** Modify `src/lib/tutor/whiteboard/render-sync.ts`; extend the existing suite run by `npm run test:render-sync`; modify `VoiceTutorRealtime.tsx` buffer/flush sites; modify `flags.ts`.

**Interfaces (pure core change — additive, existing callers unaffected):**

```ts
export interface RenderSyncEntry {
  anchorM: number;
  capExpired?: boolean;
  pendingReanchor?: boolean;
  pendingAsync?: boolean;
  /** NEW: word-level anchor within sentence anchorM (index of the referring
   *  word). When set and a word clock is available, the entry is flushable
   *  as soon as playback reaches this word — no longer waits for
   *  anchorM+1's sentence-start. Falls back to sentence semantics when the
   *  clock is absent (HTTP TTS path). */
  anchorWord?: number;
}
export interface FlushOpts {
  drainAll?: boolean;
  paused?: boolean;
  /** NEW: current playback word position from the word clock. */
  wordPos?: { sentenceIdx: number; wordIdx: number };
}
```

- [ ] **Step 1: failing tests** in the render-sync suite: entry `{anchorM: 2, anchorWord: 4}` is NOT flushable at `wordPos {2,3}`, IS at `{2,4}` and `{3,0}`; without `wordPos` it degrades to the existing `playbackStartedCount >= anchorM+1` rule; FIFO-prefix ordering, `pendingAsync`/`pendingReanchor`/`drainAll`/`capExpired` behavior all unchanged (run the whole existing suite).
- [ ] **Step 2-4:** fail → implement in `flushableCount` (one added condition beside `anchorReady`) → pass (`npm run test:render-sync`).
- [ ] **Step 5: integration** behind `TUTOR_RENDER_WORD_ANCHOR`: at buffer time, when the tool call's introducing sentence text is known, compute `anchorWord` by matching tool content tokens (equation LHS tokens, title words) against the sentence's word array (reuse/extend the matching in board-anchor-assist — `scripts/test-board-anchor-assist.ts` covers it); flush on `word` progress events in addition to `sentence-start`. **Stall-timer fix folded in (mapped failure mode):** the shared `RENDER_SYNC_STALL_MS=6000` timer currently resets only on sentence progress (`VoiceTutorRealtime.tsx` ~2565-2574) — reset it on `word` ticks too, or a mid-sentence-anchored render in a long sentence false-triggers `drainAll`.
- [ ] **Step 6:** e2e + live session: renders visibly land as the referring words are spoken; `npm run test:board-anchor-assist && npm run test:render-sync && npm run test:kill-keep` green (buffered-not-painted retraction on kill unchanged — word anchoring never paints earlier than validation allows, it only re-times the paint).
- [ ] Commit.

### Task 3.3: Audio-paced draw-on

**Files:** Modify `src/app/tutor/components/whiteboard/useDrawOn.ts` (+ its planner `draw-on.ts`); `scripts/test-draw-on.ts` extension.

- [ ] Pass the anchor sentence's audio duration (known exactly: `float32.length / 24000` on the HTTP path; sum of chunk durations on WS) into the draw-on timeline in place of the fixed durations, clamped to `[0.6s, 4s]`; keep `MAX_QUEUE_DELAY_MS=2000` backlog bail and `prefers-reduced-motion` behavior.
- [ ] Extend `test:draw-on` with duration-mapping cases; enable `NEXT_PUBLIC_TUTOR_DRAW_ON=true` in dev; visual check: ink write-on finishes with (not after) the sentence.
- [ ] Live-test round for Phase 3 as a unit; ship; record in ledger.

---

## Phase 4 — Never-idle pen (coverage)

### Task 4.1: Rule-8 repair pass (server-side, post-narration)

Today `RULE8_VIOLATION` (anchor: `brain/stream/route.ts` ~797-799 — narration promised a visual, `toolNames.length === 0`) is logged and dropped. Convert detection → repair. **Flag:** `TUTOR_RULE8_REPAIR=on` (server env, `flags.ts`).

**Files:** Create `src/lib/tutor/voice/rule8-repair.ts` + `scripts/test-rule8-repair.ts`; modify `src/app/api/tutor/brain/stream/route.ts` (after the turn's `done`, before stream close).

**Design (respects every mapped invariant):**
- Trigger: end of a brain turn where (a) the RULE8 regex fired, OR (b) any sentence contains spoken math (`inline-math` segmenter detects `$…$`-worthy content — reuse `src/lib/…/inline-math` used by `test:inline-math`) or a definition pattern (`"X is defined as"`, `"we call this X"`) with no tool call in the same turn.
- One Haiku call (`claude-haiku-4-5-20251001`), structured output: `{repairs: [{kind: 'show_equation'|'handwrite', anchorSentence: number, args: {...}}]}`, max 3, prompt instructs: transcribe ONLY what was literally spoken (no new content), prefer `handwrite` for terms/labels, `show_equation` for relations.
- Each repair is emitted as a normal `tool-call` SSE frame **plus a new optional field `anchorSentence`** — client buffers it with `anchorM = anchorSentence` (and Task 3.2 `anchorWord` when resolvable) instead of `ttsDispatchedCountRef.current`, so late-arriving repairs still sync to their sentence (or paint on `drainAll` if that sentence already played — late ink beats no ink).
- Repairs flow through `validateToolCall` server-side and the client validator/dedup stack **unchanged** — if the brain already drew it, dedup drops the repair (that is the desired resolution of the double-draw hazard; the brain remains the authority).

- [ ] **Step 1:** pure test for the detector + repair-schema validation (feed transcripts with spoken-undrawn equations / definitions / neither; assert detection set and that malformed model output is rejected wholesale — fail-to-nothing, never partial garbage).
- [ ] **Steps 2-4:** fail → implement pure module → pass.
- [ ] **Step 5:** wire into the stream route behind the flag; add `[rule8.repair]` server log line with count + `repaired`/`deduped`/`rejected` outcomes.
- [ ] **Step 6:** client: honor `anchorSentence` on incoming tool-call frames (small change at the buffer site where `anchorM` is assigned, anchor ~2702).
- [ ] **Step 7:** verify — e2e scenario with a scripted spoken-formula-no-tool turn (the 2026-07-18 live failure class that motivated Rule 3a) now paints the equation; `npm run test:process-tool-call && npm run test:dispatch-dedupe` green; measure RULE8_VIOLATION rate across 3 live sessions vs baseline → target: near zero net-of-dedup.
- [ ] Commit; live-test round; ship.

### Task 4.2: Visible fallback for validator-dropped content + drop telemetry

**Files:** Modify `src/lib/tutor/whiteboard/process-tool-call.ts` (client validators) and the `tool-rejected` handling; reuse the existing `SketchFallbackCard` pattern.

- [ ] Add a debug event at EVERY silent drop site (client validator reject, dedup drop, kill retraction, doodler timeout, image-URL drop): `render_dropped(action, reason)` — one sweep, telemetry only, no behavior change. Commit separately.
- [ ] For content-bearing rejects only (equation/table/definition with well-formed text but failed structural validation — NOT duplicates, NOT broken geometry), render a plain fallback card (title + raw LaTeX/text via the existing KaTeX inline path) instead of nothing, tagged so the brain's board snapshot sees it (preventing a blind re-emit loop). Behind `TUTOR_RENDER_FALLBACK_CARD=on`.
- [ ] Verify with `npm run test:process-tool-call`; e2e; commit.

---

## Phase 5 — GATED DECISION: eager dispatch at `turn.eager_end`

**Do not implement in the first pass.** After Phases 0–2 have shipped, read the baseline doc: if median `eager→end` ≥ ~500ms across real sessions, write a follow-up plan for: dispatch the brain at `eager_end` with (a) a server-side hold barrier on ALL side-effectful tools (`generate_problem`, `advance_lesson`, `mark_segment_complete`, bank mutations) until the client confirms `turn.end` with an unchanged transcript, (b) abort-and-refire on `turn.resume` or transcript growth, honoring the `emittedToClient>0` no-retry rule by keeping the speculative stream fully server-buffered until confirm. If the median gap is <500ms, close this phase as not-worth-it.

---

## Success metrics (all from Phase-0 instrumentation)

| Metric | Baseline (fill from Task 0.3) | Target |
|---|---|---|
| `turn_latency` TOTAL median (turn.end→first audio) | ~2.3–5.4s est. | ≤1.8s |
| Perceived first sound (ack/opener) after turn.end | = TOTAL today | ≤0.6s |
| Render↔referring-phrase offset (debug-events reconstruction) | ±1 sentence (~2–6s) | ≤0.7s |
| RULE8_VIOLATION rate per session | measure | ~0 net-of-dedup |

## Self-review notes

- Spec coverage: latency (Tasks 1.1–1.3, 2.x, 5), sync (3.1–3.3), coverage (4.1–4.2), measurement (0.x) — all four user complaints mapped.
- Every task is flag-gated and separately revertible; no task opens the first-tool gate for content, touches judge/kill semantics, or fires the brain speculatively.
- Line numbers are anchors, not gospel — each integration step names the exact code string to locate.
