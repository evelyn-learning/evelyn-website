# Caption ↔ TTS Word-Sync + Render-Adjacency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The in-session caption strip reveals words in lockstep with the tutor's actual spoken audio (pausing/resuming/freezing with it), and whiteboard renders are emitted by the brain adjacent to their narrating sentence.

**Architecture:** Three additive layers — (1) a per-sentence playback clock in `useOpenAIRealtime.ts` exposed as `getSpokenProgress()`; (2) a pure registry/reveal module `src/lib/tutor/voice/caption-sync.ts` pairing display↔speech sentence forms; (3) a poll-driven `CaptionTicker` fed through the existing `RealtimeHandle`. Plus one generic system-prompt rule (Rule 15) making the brain emit render tool-calls adjacent to their introducing sentence. Spec: `docs/superpowers/specs/2026-07-04-caption-tts-word-sync-design.md`.

**Tech Stack:** Next.js 15 app router, React 19, TypeScript, WebAudio (`AudioBufferSourceNode`), ts-node test scripts (no jest — this repo uses plain assert scripts under `scripts/`).

## Global Constraints

- Flag: `NEXT_PUBLIC_TUTOR_CAPTION_SYNC`, default ON (`!== 'off'` pattern, same as `NEXT_PUBLIC_TUTOR_RENDER_SYNC` at `VoiceTutorRealtime.tsx:265`).
- Engine scope: claude-brain mode only. Native-realtime / Gemini / flag-OFF keep the existing 85 ms/char typewriter **byte-identical**.
- **Do-not-regress:** `getCurrentSentenceFraction()` and `currentSentencePlayedSecRef` accounting in `useOpenAIRealtime.ts` stay untouched (resume-from-cut P5 depends on them). `clearSpeechQueue`, kill/retry, perception verdict paths, and the render-sync buffer are NOT modified.
- Prompt rules must stay generic — no topic-specific examples (user feedback rule `feedback_generic_prompts`).
- All caption reveal math is monotonic within an attempt: the caption never moves backward mid-turn.
- Run `npx tsc --noEmit` after every code task; it must stay clean.

---

### Task 1: Pure module `caption-sync.ts` + unit test script (TDD)

**Files:**
- Create: `src/lib/tutor/voice/caption-sync.ts`
- Create: `scripts/test-caption-sync.ts`
- Modify: `package.json` (add `test:caption-sync` script next to `test:render-sync` at line ~44)

**Interfaces:**
- Consumes: nothing (pure, framework-free).
- Produces (used by Tasks 3–4):

```ts
export interface SpokenProgress {
  sentence: string | null;   // speech-form text of the sentence playing NOW (null = nothing playing)
  elapsedSec: number;        // seconds of that sentence already played
  arrivedTotalSec: number;   // elapsed + queued-but-unplayed seconds of the SAME sentence
  playing: boolean;
}
export interface SpokenCaption {
  turnKey: string;           // stable per-attempt key, `tutor-streaming-${t0}-${attempt}`
  text: string;              // display-form text revealed so far (word-boundary clamped)
  live: boolean;             // true while the attempt is still being spoken
}
export class CaptionSyncTracker {
  beginAttempt(turnKey: string): void;
  registerSentence(speech: string, display: string): void;
  markStreamEnd(): void;
  notifyDrain(): void;
  poll(progress: SpokenProgress | null): SpokenCaption;
}
export function stripMarkdownEmphasis(s: string): string;
```

- [ ] **Step 1: Write the failing test script**

Create `scripts/test-caption-sync.ts`. Follow the `scripts/test-render-sync.ts` house pattern: plain functions, a `check(name, cond)` helper, counters, `process.exit(1)` on failure.

```ts
/**
 * Unit tests for the caption↔TTS word-sync tracker (caption-sync.ts).
 * Run: npm run test:caption-sync
 * Design: docs/superpowers/specs/2026-07-04-caption-tts-word-sync-design.md
 */
import { CaptionSyncTracker, stripMarkdownEmphasis, type SpokenProgress } from '../src/lib/tutor/voice/caption-sync';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}
function prog(sentence: string | null, elapsedSec: number, arrivedTotalSec: number, playing = true): SpokenProgress {
  return { sentence, elapsedSec, arrivedTotalSec, playing };
}

// ── 1. markdown strip ─────────────────────────────────────────────
check('strips **bold** and *italic*',
  stripMarkdownEmphasis('a **big** and *small* word') === 'a big and small word');

// ── 2. pre-begin poll → not live, empty text ──────────────────────
{
  const t = new CaptionSyncTracker();
  const c = t.poll(null);
  check('before any attempt: live=false, empty text', c.live === false && c.text === '');
}

// ── 3. basic proportional reveal, word-clamped ────────────────────
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-1-0');
  t.registerSentence('Alright, lets look at slope.', 'Alright, lets look at slope.');
  // half played (arrived total = full sentence duration)
  const c = t.poll(prog('Alright, lets look at slope.', 1.4, 2.8));
  check('mid-sentence reveal is a proper prefix', c.live === true && c.text.length > 0 && c.text.length < 28);
  check('reveal ends on a word boundary', !/\S/.test('Alright, lets look at slope.'.charAt(c.text.length)) || c.text.length === 0);
  const done = t.poll(prog('Alright, lets look at slope.', 2.8, 2.8));
  check('fully played sentence fully revealed', done.text === 'Alright, lets look at slope.');
}

// ── 4. multi-sentence: earlier sentences fully revealed ───────────
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-2-0');
  t.registerSentence('First one.', 'First one.');
  t.registerSentence('Second sentence here.', 'Second sentence here.');
  t.poll(prog('First one.', 1.0, 1.0));
  const c = t.poll(prog('Second sentence here.', 0.6, 1.2));
  check('sentence 1 fully revealed once sentence 2 plays', c.text.startsWith('First one.'));
  check('sentence 2 partially revealed', c.text.length > 'First one.'.length && c.text.length < 'First one. Second sentence here.'.length);
}

// ── 5. monotonic hold on pause / null progress ────────────────────
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-3-0');
  t.registerSentence('A fairly long sentence for the pause test.', 'A fairly long sentence for the pause test.');
  const before = t.poll(prog('A fairly long sentence for the pause test.', 2.0, 4.0));
  const held = t.poll(prog(null, 0, 0, false));       // clearSpeechQueue nulls the sentence
  check('pause holds the reveal (no regress)', held.text === before.text && held.live === true);
  const shrunk = t.poll(prog('A fairly long sentence for the pause test.', 0.5, 4.0));
  check('reveal never moves backward within an attempt', shrunk.text.length >= before.text.length);
}

// ── 6. display ≠ speech (TTS normalization) ───────────────────────
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-4-0');
  t.registerSentence('Great work. x bar is 6.', 'Great work! **x̄** is 6.');
  const c = t.poll(prog('Great work. x bar is 6.', 10, 10));
  check('caption shows display form (markdown stripped, punctuation kept)', c.text === 'Great work! x̄ is 6.');
}

// ── 7. clause-tail suffix fallback (resume-from-cut) ──────────────
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-5-0');
  t.registerSentence('The slope tells us the rate, so we rise over run.', 'The slope tells us the rate, so we rise over run.');
  // resume replays only the tail clause
  const c = t.poll(prog('so we rise over run.', 0.1, 1.0));
  check('clause-tail resume maps into the tail range', c.text.length >= 'The slope tells us the rate,'.length - 1);
  check('clause-tail resume still live', c.live === true);
}

// ── 8. unmatched sentence (e.g. kill-bridge) holds ────────────────
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-6-0');
  t.registerSentence('Original content.', 'Original content.');
  const before = t.poll(prog('Original content.', 1.0, 1.0));
  const c = t.poll(prog('Let me try that a different way.', 0.5, 1.0));
  check('unmatched sentence holds prior reveal', c.text === before.text);
}

// ── 9. duplicate short sentences resolve in order ─────────────────
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-7-0');
  t.registerSentence('Try it.', 'Try it.');
  t.registerSentence('Now expand.', 'Now expand.');
  t.registerSentence('Try it.', 'Try it.');
  t.poll(prog('Try it.', 1, 1));
  t.poll(prog('Now expand.', 1, 1));
  const c = t.poll(prog('Try it.', 1, 1));
  check('second duplicate matches the LATER pair', c.text === 'Try it. Now expand. Try it.');
}

// ── 10. skipped-over pair reveals when a later sentence matches ───
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-8-0');
  t.registerSentence('Held then dropped.', 'Held then dropped.');
  t.registerSentence('Actually spoken.', 'Actually spoken.');
  // elapsed comfortably past the char-rate estimate so frac reaches 1
  const c = t.poll(prog('Actually spoken.', 2, 2));
  check('cursor skips unplayed pair but reveals it (chat parity)', c.text === 'Held then dropped. Actually spoken.');
}

// ── 11. finalization: streamEnd + drain → full text, not live ─────
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-9-0');
  t.registerSentence('One.', 'One.');
  t.registerSentence('Two.', 'Two.');
  t.notifyDrain();                       // spurious mid-stream drain must NOT finalize
  const mid = t.poll(prog('One.', 0.2, 0.5));
  check('mid-stream drain does not finalize', mid.live === true);
  t.markStreamEnd();
  t.notifyDrain();
  const done = t.poll(null);
  check('streamEnd+drain finalizes to full text', done.live === false && done.text === 'One. Two.');
}

// ── 12. attempt reset (kill → retry) ──────────────────────────────
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-10-0');
  t.registerSentence('Doomed attempt text.', 'Doomed attempt text.');
  t.poll(prog('Doomed attempt text.', 1, 1));
  t.beginAttempt('turn-10-1');
  const c = t.poll(prog(null, 0, 0, false));
  check('retry attempt starts with a fresh empty reveal', c.text === '' && c.turnKey === 'turn-10-1' && c.live === true);
}

// ── 13. conservative denominator: short arrivedTotal cannot race ──
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-11-0');
  const s = 'A sentence of roughly sixty characters to exercise the estimate.';
  t.registerSentence(s, s);
  // Realtime path early in a sentence: only 0.3s of audio arrived so far.
  const c = t.poll(prog(s, 0.29, 0.3));
  check('char-estimate floor keeps early reveal small', c.text.length < s.length / 2);
}

// ── 14. silent-poll fallback: streamEnd + silence finalizes without drain ──
// (audio can fully drain BEFORE the brain stream ends — e.g. tool-heavy Skip
// turns with calls trailing the last sentence — so the post-stream 'drain'
// never fires; 5 consecutive silent polls after streamEnd must finalize.)
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-12-0');
  t.registerSentence('Short spoken bit.', 'Short spoken bit.');
  t.poll(prog('Short spoken bit.', 2, 2));
  t.markStreamEnd();
  let live4 = true;
  for (let i = 0; i < 4; i++) live4 = t.poll(prog(null, 0, 0, false)).live;
  check('4 silent polls after streamEnd: not yet finalized', live4 === true);
  const fifth = t.poll(prog(null, 0, 0, false));
  check('5th silent poll finalizes to full text', fifth.live === false && fifth.text === 'Short spoken bit.');
}

console.log(`\ncaption-sync: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Add the npm script and run the test to verify it fails**

In `package.json`, next to `test:render-sync` (~line 44), add (same ts-node incantation):

```json
"test:caption-sync": "TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register --compiler-options '{\"module\":\"commonjs\",\"baseUrl\":\"./\"}' scripts/test-caption-sync.ts",
```

Run: `npm run test:caption-sync`
Expected: FAIL — `Cannot find module '../src/lib/tutor/voice/caption-sync'`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/tutor/voice/caption-sync.ts`:

```ts
/**
 * Caption ↔ TTS word-sync tracker.
 *
 * Pairs each brain sentence's DISPLAY form (chat/caption text) with its
 * SPEECH form (TTS-normalized, what the audio layer reports), and converts
 * live playback progress into a word-boundary-clamped reveal of the display
 * text. Pure and framework-free so it unit-tests without audio.
 *
 * The reveal is MONOTONIC within an attempt: audio pauses (noise barge-in,
 * student interruption, TTS latency gap) freeze it; kills freeze it at the
 * voiced content; a retry attempt resets it via beginAttempt.
 *
 * Word-level timing is PROPORTIONAL (elapsed ÷ duration mapped onto chars) —
 * OpenAI TTS exposes no word timestamps. If a word-timestamp provider lands
 * (e.g. Cartesia sonic-3 add_timestamps), feed exact boundaries through the
 * same SpokenProgress shape.
 *
 * Design: docs/superpowers/specs/2026-07-04-caption-tts-word-sync-design.md
 */

export interface SpokenProgress {
  /** Speech-form text of the sentence playing NOW (null = nothing playing). */
  sentence: string | null;
  /** Seconds of that sentence already played. */
  elapsedSec: number;
  /** elapsed + queued-but-unplayed seconds of the SAME sentence (grows as
   *  chunks stream in on the Realtime path; exact on the openai-mini path). */
  arrivedTotalSec: number;
  playing: boolean;
}

export interface SpokenCaption {
  turnKey: string;
  text: string;
  live: boolean;
}

/** Seed ≈ the legacy 85 ms/char caption typewriter. Calibrated live via EMA. */
const DEFAULT_CHARS_PER_SEC = 11.8;
const EMA_ALPHA = 0.3;
/** Ignore absurd calibration samples (silence-trimmed stubs, stalls). */
const CPS_MIN = 3;
const CPS_MAX = 40;

export function stripMarkdownEmphasis(s: string): string {
  return s.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1');
}

/** Longest whole-word prefix of `s` with length ≤ chars. */
function wordClamp(s: string, chars: number): string {
  if (chars >= s.length) return s;
  if (chars <= 0) return '';
  const cut = s.slice(0, chars);
  const lastSpace = cut.lastIndexOf(' ');
  return lastSpace > 0 ? cut.slice(0, lastSpace) : '';
}

interface SentencePair {
  speech: string;
  display: string;
}

export class CaptionSyncTracker {
  private pairs: SentencePair[] = [];
  private turnKey = '';
  /** Index of the pair currently (or most recently) playing. */
  private cursor = 0;
  /** Monotonic reveal boundary, as a char index into the joined display text. */
  private revealedChars = 0;
  private streamEnded = false;
  private drainSeen = false;
  private everBegan = false;
  private charsPerSec = DEFAULT_CHARS_PER_SEC;
  /** Calibration bookkeeping: last-seen sentence + its latest known duration. */
  private lastSentence: string | null = null;
  private lastSentenceDur = 0;
  private lastSentenceSpeechLen = 0;
  /** Consecutive silent polls after streamEnd — fallback finalizer for turns
   *  whose audio drained BEFORE the stream ended (no post-stream 'drain'). */
  private silentPolls = 0;

  beginAttempt(turnKey: string): void {
    this.turnKey = turnKey;
    this.pairs = [];
    this.cursor = 0;
    this.revealedChars = 0;
    this.streamEnded = false;
    this.drainSeen = false;
    this.everBegan = true;
    this.lastSentence = null;
    this.lastSentenceDur = 0;
    this.lastSentenceSpeechLen = 0;
    this.silentPolls = 0;
  }

  registerSentence(speech: string, display: string): void {
    this.pairs.push({ speech, display: stripMarkdownEmphasis(display).trim() });
  }

  markStreamEnd(): void {
    this.streamEnded = true;
  }

  /** Only a drain AFTER the brain stream ended is a true turn-end — the
   *  Realtime path can starve the audio queue mid-turn between sentences. */
  notifyDrain(): void {
    if (this.streamEnded) this.drainSeen = true;
  }

  private fullText(): string {
    return this.pairs.map((p) => p.display).join(' ');
  }

  private joinedDisplayLen(upTo: number): number {
    let len = 0;
    for (let i = 0; i < upTo; i++) {
      len += this.pairs[i].display.length + (i > 0 ? 1 : 0);
    }
    return len;
  }

  poll(progress: SpokenProgress | null): SpokenCaption {
    if (!this.everBegan || (this.streamEnded && this.drainSeen)) {
      return { turnKey: this.turnKey, text: this.fullText(), live: false };
    }
    const full = this.fullText();
    const s = progress?.sentence ?? null;
    if (!s && this.streamEnded && !progress?.playing) {
      // Stream over, nothing playing. The primary finalizer is a post-stream
      // 'drain', but audio that fully drained BEFORE the stream ended (e.g. a
      // tool-heavy turn with calls trailing the last sentence) never gets one
      // — finalize after ~500ms of confirmed silence instead. Inter-sentence
      // gaps reset via the s branch below, and the count restarts each poll
      // cycle, so a genuine pending sentence isn't cut off.
      this.silentPolls++;
      if (this.silentPolls >= 5) {
        this.drainSeen = true;
        return { turnKey: this.turnKey, text: full, live: false };
      }
    }
    if (s) {
      this.silentPolls = 0;
      // Exact match scanning forward from the cursor (duplicates resolve in
      // order); suffix fallback for resume-from-cut clause tails.
      let idx = -1;
      let tailOffset = 0;
      for (let i = this.cursor; i < this.pairs.length; i++) {
        if (this.pairs[i].speech === s) { idx = i; break; }
      }
      if (idx < 0) {
        for (let i = this.cursor; i < this.pairs.length; i++) {
          const sp = this.pairs[i].speech;
          if (s.length < sp.length && sp.endsWith(s)) {
            idx = i;
            tailOffset = 1 - s.length / sp.length;
            break;
          }
        }
      }
      if (idx >= 0) {
        // EMA speaking-rate calibration on sentence transitions: the previous
        // sentence's last-known arrivedTotal ≈ its true duration.
        if (this.lastSentence !== null && this.lastSentence !== s
          && this.lastSentenceDur > 0.3 && this.lastSentenceSpeechLen > 0) {
          const cps = this.lastSentenceSpeechLen / this.lastSentenceDur;
          if (cps > CPS_MIN && cps < CPS_MAX) {
            this.charsPerSec = this.charsPerSec * (1 - EMA_ALPHA) + cps * EMA_ALPHA;
          }
        }
        this.lastSentence = s;
        this.lastSentenceDur = progress!.arrivedTotalSec;
        this.lastSentenceSpeechLen = this.pairs[idx].speech.length;
        this.cursor = idx;
        const pair = this.pairs[idx];
        // Conservative denominator: arrived audio may undercount a sentence
        // still streaming in (Realtime path) — floor it with a char estimate
        // so the caption can trail and catch up, never race ahead.
        const estimate = pair.speech.length / this.charsPerSec;
        const total = Math.max(progress!.arrivedTotalSec, estimate);
        let frac = total > 0 ? Math.min(1, progress!.elapsedSec / total) : 0;
        frac = tailOffset + frac * (1 - tailOffset);
        const within = wordClamp(pair.display, Math.round(pair.display.length * frac));
        const before = this.joinedDisplayLen(idx);
        const candidate = idx > 0
          ? before + (within ? 1 + within.length : 0)
          : within.length;
        if (candidate > this.revealedChars) this.revealedChars = candidate;
      }
      // Unmatched sentence (kill-bridge, diverged resume): hold.
    }
    // No sentence playing (pause / gap / cancel): hold the monotonic boundary.
    return { turnKey: this.turnKey, text: full.slice(0, this.revealedChars), live: true };
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:caption-sync`
Expected: `caption-sync: 21 passed, 0 failed` (14 blocks, several with multiple checks). Also run `npx tsc --noEmit` — clean.

If test 3's word-boundary check or test 13's estimate check fails, debug the math — do not loosen the assertions.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tutor/voice/caption-sync.ts scripts/test-caption-sync.ts package.json
git commit -m "feat(tutor): caption-sync tracker — display↔speech registry + proportional word reveal"
```

---

### Task 2: Playback clock in `useOpenAIRealtime.ts` — `getSpokenProgress()`

**Files:**
- Modify: `src/app/tutor/hooks/useOpenAIRealtime.ts` (refs near line ~715; `playNextAudio` at ~807; `RealtimeResult` interface near `getCurrentSentenceFraction` at ~289; return object at ~2756)

**Interfaces:**
- Consumes: `SpokenProgress` type from Task 1 (`@/lib/tutor/voice/caption-sync`).
- Produces: `getSpokenProgress(): SpokenProgress` on the hook's result — consumed by Task 3.

**CRITICAL do-not-regress:** do not touch `currentSentencePlayedSecRef`, `getCurrentSentenceFraction`, `clearSpeechQueue`, or the `onTtsPlaybackProgress` firing logic. All additions are parallel reads.

- [ ] **Step 1: Add the import and the clock refs**

Add to the imports:

```ts
import type { SpokenProgress } from '@/lib/tutor/voice/caption-sync';
```

Next to `currentSentencePlayedSecRef` (~line 715), add:

```ts
  // Caption word-sync: live playback clock for the CURRENT sentence, read by
  // getSpokenProgress(). Parallel to (never replacing) the resume-from-cut
  // accounting above: playedBeforeChunkSecRef counts COMPLETED chunks of the
  // current sentence; the in-flight chunk's progress is derived from
  // AudioContext.currentTime at read time.
  const chunkStartCtxTimeRef = useRef(0);
  const currentChunkDurSecRef = useRef(0);
  const playedBeforeChunkSecRef = useRef(0);
```

- [ ] **Step 2: Feed the clock in `playNextAudio`**

In the empty-queue branch (~line 808, right after `currentSentencePlayedSecRef.current = 0;`), add:

```ts
      playedBeforeChunkSecRef.current = 0;
      currentChunkDurSecRef.current = 0;
```

In the dequeue path, the existing block reads:

```ts
    const chunkSec = chunk.length / 24000;
    if (sentText) {
      if (sentText !== currentSpeakTextRef.current) {
        onTtsPlaybackProgressRef.current?.('sentence-start');
        currentSentencePlayedSecRef.current = chunkSec;
      } else {
        currentSentencePlayedSecRef.current += chunkSec;
      }
      currentSpeakTextRef.current = sentText;
    } else {
      currentSentencePlayedSecRef.current += chunkSec;
    }
```

Extend it (adding ONLY the marked lines — the existing lines stay identical):

```ts
    const chunkSec = chunk.length / 24000;
    if (sentText) {
      if (sentText !== currentSpeakTextRef.current) {
        onTtsPlaybackProgressRef.current?.('sentence-start');
        currentSentencePlayedSecRef.current = chunkSec;
        playedBeforeChunkSecRef.current = 0;                                  // caption clock: new sentence
      } else {
        currentSentencePlayedSecRef.current += chunkSec;
        playedBeforeChunkSecRef.current += currentChunkDurSecRef.current;     // caption clock: prior chunk done
      }
      currentSpeakTextRef.current = sentText;
    } else {
      currentSentencePlayedSecRef.current += chunkSec;
      playedBeforeChunkSecRef.current += currentChunkDurSecRef.current;       // caption clock: unlabeled chunk
    }
    currentChunkDurSecRef.current = chunkSec;                                 // caption clock
    chunkStartCtxTimeRef.current = ctx.currentTime;                          // caption clock
```

Note: `ctx` is already in scope (`const ctx = getAudioContext();` a few lines above).

- [ ] **Step 3: Add the getter and export it**

Next to `getCurrentSentenceFraction` (~line 2700), add:

```ts
  // Caption word-sync: live progress of the sentence the student is hearing
  // RIGHT NOW. elapsed = completed chunks + the in-flight chunk's wall-clock
  // progress (capped at its duration). arrivedTotal additionally counts
  // queued-but-unplayed chunks of the SAME sentence — exact on the
  // openai-mini path (one chunk = one sentence), a growing lower bound on
  // the Realtime path (the consumer floors it with a char-rate estimate).
  const getSpokenProgress = useCallback((): SpokenProgress => {
    const sentence = currentSpeakTextRef.current;
    if (!sentence || !isPlayingRef.current) {
      return { sentence: null, elapsedSec: 0, arrivedTotalSec: 0, playing: false };
    }
    let inFlight = 0;
    try {
      const ctx = getAudioContext();
      inFlight = Math.max(0, Math.min(
        ctx.currentTime - chunkStartCtxTimeRef.current,
        currentChunkDurSecRef.current,
      ));
    } catch {
      inFlight = currentChunkDurSecRef.current;
    }
    const elapsedSec = playedBeforeChunkSecRef.current + inFlight;
    let queuedSec = 0;
    const q = audioQueueRef.current;
    const labels = audioQueueSentenceRef.current;
    for (let i = 0; i < q.length; i++) {
      if (labels[i] === sentence) queuedSec += q[i].length / 24000;
    }
    const remainingInChunk = currentChunkDurSecRef.current - inFlight;
    return {
      sentence,
      elapsedSec,
      arrivedTotalSec: elapsedSec + remainingInChunk + queuedSec,
      playing: true,
    };
  }, []);
```

Add `getSpokenProgress: () => SpokenProgress;` to the `RealtimeResult` interface (next to `getCurrentSentenceFraction: () => number;` at ~line 289) and `getSpokenProgress,` to the returned object (~line 2756).

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean. (No unit test possible — WebAudio; covered by Task 6 live verify.)

- [ ] **Step 5: Commit**

```bash
git add src/app/tutor/hooks/useOpenAIRealtime.ts
git commit -m "feat(tutor): per-sentence playback clock — getSpokenProgress() on useOpenAIRealtime"
```

---

### Task 3: Orchestrator wiring — registry, lifecycle, `getSpokenCaption` on the handle

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx`:
  - import block (top of file)
  - `RealtimeHandle` interface (line ~146)
  - attempt-scope reset (where `let chatRevealText = '';` is declared, ~line 7198)
  - sentence registration (the `chatRevealText +=` line inside `if (!attemptKilled)`, ~line 7912)
  - stream-end (the `finally` that sets `renderSyncActiveRef.current = false` — grep `renderSyncActiveRef.current = false`)
  - `onTtsPlaybackProgress` config callback (~line 10833)
  - handle population `useEffect` (~line 11666)

**Interfaces:**
- Consumes: `CaptionSyncTracker`, `SpokenCaption` (Task 1); `realtime.getSpokenProgress()` (Task 2); existing `claudeBrainMode` boolean and `t0`/`attempt` variables in the orchestrator scope.
- Produces: `getSpokenCaption: () => SpokenCaption | null` on `RealtimeHandle` — consumed by Task 4. **`null` means "unsupported here" (non-claude-brain engine) → caller falls back to the legacy typewriter. `live:false` means "supported, nothing being spoken" → caller shows the full text instantly.**

- [ ] **Step 1: Import + tracker ref**

```ts
import { CaptionSyncTracker, type SpokenCaption } from '@/lib/tutor/voice/caption-sync';
```

Near the other orchestrator refs (e.g. next to `renderBufferRef` at ~1191):

```ts
  // Caption word-sync: display↔speech sentence registry + reveal state.
  // Fed per-attempt from the brain stream loop; read via the handle's
  // getSpokenCaption poll. See caption-sync.ts.
  const captionSyncRef = useRef(new CaptionSyncTracker());
```

- [ ] **Step 2: Attempt begin/reset**

Immediately after `let chatRevealText = '';` (~7198):

```ts
        // Caption word-sync: fresh registry per attempt. Same key as the
        // streaming chat entry so a kill→retry naturally re-keys the caption.
        captionSyncRef.current.beginAttempt(`tutor-streaming-${t0}-${attempt}`);
```

- [ ] **Step 3: Register each voiced sentence**

Immediately after `chatRevealText += (chatRevealText ? ' ' : '') + trimmedSentence;` (~7912):

```ts
                    // Caption word-sync: pair the display form with the speech
                    // form the audio layer will report back. Registered only
                    // while the attempt is alive — post-kill sentences never
                    // reach TTS, so the caption freezes at voiced content.
                    captionSyncRef.current.registerSentence(sentenceForSpeech, trimmedSentence);
```

- [ ] **Step 4: Stream end**

In the `finally` block that sets `renderSyncActiveRef.current = false` (the brain-call teardown), add alongside it:

```ts
        captionSyncRef.current.markStreamEnd();
```

- [ ] **Step 5: Drain notification**

Replace the `onTtsPlaybackProgress` config value (~10833). It is currently gated entirely on `TUTOR_RENDER_SYNC`; make the callback unconditional, keep the render-sync behavior inside the gate, add the caption notification:

```ts
    onTtsPlaybackProgress: (event) => {
      // Caption word-sync: a drain AFTER stream-end finalizes the caption
      // (the tracker ignores mid-stream drains itself).
      if (event === 'drain') captionSyncRef.current.notifyDrain();
      if (!TUTOR_RENDER_SYNC) return;
      if (event === 'sentence-start') {
        ttsPlaybackStartedCountRef.current++;
        // Progress happened → reset the stall timer so it can't fire
        // while sentences are steadily playing toward an anchor.
        if (renderBufferRef.current.length > 0) armRenderStall();
        flushReadyRenders();
      } else {
        // Turn audio drained → release the tail; no stall re-arm needed.
        flushReadyRenders({ drainAll: true });
      }
    },
```

- [ ] **Step 6: Handle method**

Add to the `RealtimeHandle` interface (~146):

```ts
  /** Caption word-sync: poll the audio-locked caption reveal. Returns null
   *  when unsupported (non-claude-brain engines) — caller falls back to the
   *  legacy typewriter. live:false = supported but nothing being spoken
   *  (finalized turn / reload) — caller shows the full text instantly. */
  getSpokenCaption: () => SpokenCaption | null;
```

Add to the handle object in the population `useEffect` (~11666):

```ts
        getSpokenCaption: () => {
          if (!claudeBrainMode) return null;
          return captionSyncRef.current.poll(realtime.getSpokenProgress());
        },
```

(`claudeBrainMode` is already in scope — it configures `relayMode` at ~10792. If the effect's dependency array does not already cover it, add `claudeBrainMode`.)

- [ ] **Step 7: Typecheck + regression tests**

Run: `npx tsc --noEmit` — clean.
Run: `npm run test:render-sync` — 11/11 (the callback refactor in Step 5 must not change render-sync behavior).
Run: `npm run test:caption-sync` — still green.

- [ ] **Step 8: Commit**

```bash
git add src/app/tutor/components/VoiceTutorRealtime.tsx
git commit -m "feat(tutor): caption word-sync registry + getSpokenCaption on RealtimeHandle"
```

---

### Task 4: Surface — flag, prop threading, polling `CaptionTicker`

**Files:**
- Modify: `src/app/tutor/components/session/TutorSession.tsx` (flag const; pass getter to `SessionStage`, ~line 542)
- Modify: `src/app/tutor/components/session/SessionStage.tsx` (prop plumbing ~55/94; `CaptionTicker` at ~485)
- Modify: `.env.local` and `.env.local.production` (add `NEXT_PUBLIC_TUTOR_CAPTION_SYNC=true` next to `NEXT_PUBLIC_TUTOR_RENDER_SYNC=true`)

**Interfaces:**
- Consumes: `RealtimeHandle.getSpokenCaption` (Task 3) via `realtimeHandleRef` (already local to `TutorSession`, line ~185); `SpokenCaption` type (Task 1).
- Produces: user-visible behavior only.

- [ ] **Step 1: Flag + getter in `TutorSession`**

Top of `TutorSession.tsx`, next to the other module-level consts:

```ts
// Caption ↔ TTS word-sync (2026-07-04): audio-locked caption reveal.
// Default ON; 'off' restores the legacy fixed-rate typewriter. claude-brain
// only by construction (the handle returns null on other engines).
const TUTOR_CAPTION_SYNC = process.env.NEXT_PUBLIC_TUTOR_CAPTION_SYNC !== 'off';
```

Import the type:

```ts
import type { SpokenCaption } from '@/lib/tutor/voice/caption-sync';
```

Inside the component (near the `liveCaption` derivation at ~489):

```ts
  // Caption word-sync: stable poll getter for the CaptionTicker. Reads the
  // engine handle imperatively — no React state churn at poll frequency.
  const getSpokenCaption = useCallback((): SpokenCaption | null => {
    return realtimeHandleRef.current?.getSpokenCaption?.() ?? null;
  }, [realtimeHandleRef]);
```

Pass it to `SessionStage` (next to `liveCaption={liveCaption}` at ~542):

```tsx
        getSpokenCaption={TUTOR_CAPTION_SYNC ? getSpokenCaption : undefined}
```

- [ ] **Step 2: Prop plumbing in `SessionStage`**

Add to the props interface (next to `liveCaption?: string;` at ~55):

```ts
  /** Caption word-sync: poll getter for the audio-locked reveal. Absent →
   *  legacy typewriter. Returns null → engine unsupported → legacy typewriter.
   *  live:false → show the full caption instantly (finalized / reload). */
  getSpokenCaption?: () => SpokenCaption | null;
```

Import the type, destructure `getSpokenCaption` in the component signature (~94), and forward it at the render site (~405):

```tsx
              <CaptionTicker text={liveCaption} getSpoken={getSpokenCaption} />
```

- [ ] **Step 3: `CaptionTicker` poll mode**

Replace the `CaptionTicker` function (~485). The width-fit second effect and the returned JSX stay EXACTLY as they are; only the reveal-driving effect changes and one state value is added:

```tsx
function CaptionTicker({ text, getSpoken }: { text: string; getSpoken?: () => SpokenCaption | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState('');
  const [revealed, setRevealed] = useState(0);
  // Poll mode substitutes the revealed string wholesale (the tracker's text
  // may differ slightly from `text` mid-turn); typewriter mode reveals a
  // prefix of `text`. `shown` unifies the two for the width-fit effect.
  const [polled, setPolled] = useState<string | null>(null);
  const revealedRef = useRef(0);
  const prevTextRef = useRef('');

  // ── Audio-locked poll mode ────────────────────────────────────────
  // `polling` is STATE (not a ref) so the typewriter effect below re-runs
  // and shuts off as soon as the probe succeeds — a ref read during render
  // would leave both reveal drivers running for a frame.
  const [polling, setPolling] = useState(false);
  useEffect(() => {
    if (!getSpoken) { setPolling(false); return; }
    // Probe once: null = unsupported engine → typewriter path below.
    if (getSpoken() === null) { setPolling(false); setPolled(null); return; }
    setPolling(true);
    const id = setInterval(() => {
      const c = getSpoken();
      if (c === null) return; // engine flipped mid-session — hold last
      // live: show the tracker's reveal. Not live (finalized turn, page
      // reload, between turns): show the full caption text instantly.
      setPolled(c.live ? c.text : null);
      if (!c.live) { revealedRef.current = 0; }
    }, 100);
    return () => clearInterval(id);
  }, [getSpoken]);

  // ── Legacy typewriter (flag off / unsupported engine) ─────────────
  useEffect(() => {
    if (polling) return;
    const prev = prevTextRef.current;
    prevTextRef.current = text;
    let common = 0;
    const n = Math.min(prev.length, text.length);
    while (common < n && prev.charCodeAt(common) === text.charCodeAt(common)) common++;
    const newTurn = prev.length > 8 && common < 8;
    let start = newTurn ? 0 : revealedRef.current;
    if (start > text.length) start = text.length;
    revealedRef.current = start;
    setRevealed(start);
    if (start >= text.length) return;
    const id = setInterval(() => {
      const next = Math.min(text.length, revealedRef.current + 1);
      revealedRef.current = next;
      setRevealed(next);
      if (next >= text.length) clearInterval(id);
    }, 85);
    return () => clearInterval(id);
  }, [text, polling]);

  const shown = polling ? (polled ?? text) : text.slice(0, revealed);

  // ── Width-fit trailing words (UNCHANGED except reading `shown`) ────
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof document === 'undefined') { setDisplay(shown); return; }
    const width = el.clientWidth;
    if (!width) { setDisplay(shown); return; }
    const cs = window.getComputedStyle(el);
    const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    _capMeasureCanvas ||= document.createElement('canvas');
    const ctx = _capMeasureCanvas.getContext('2d');
    if (!ctx) { setDisplay(shown); return; }
    ctx.font = font;
    if (ctx.measureText(shown).width <= width) { setDisplay(shown); return; }
    const words = shown.split(/\s+/).filter(Boolean);
    const ell = '… ';
    let tail = '';
    for (let i = words.length - 1; i >= 0; i--) {
      const cand = words[i] + (tail ? ' ' + tail : '');
      if (ctx.measureText(ell + cand).width > width) break;
      tail = cand;
    }
    setDisplay(tail ? ell + tail : ell + (words[words.length - 1] ?? shown));
  }, [shown]);

  return (
    <div ref={ref} className="flex-1 min-w-0 overflow-hidden whitespace-nowrap text-sm text-slate-700">
      {display}
    </div>
  );
}
```

Preserve the existing comments above the function (the batch-4 / 85 ms history notes) — move the typewriter-specific ones onto the typewriter effect.

- [ ] **Step 4: Env flag entries**

In `.env.local` and `.env.local.production`, directly below `NEXT_PUBLIC_TUTOR_RENDER_SYNC=true`, add:

```
NEXT_PUBLIC_TUTOR_CAPTION_SYNC=true
```

(Both files are gitignored — this step has no commit footprint; note it in the commit message body instead.)

- [ ] **Step 5: Typecheck + regression**

Run: `npx tsc --noEmit` — clean.
Run: `npm run test:caption-sync && npm run test:render-sync` — green.

- [ ] **Step 6: Commit**

```bash
git add src/app/tutor/components/session/TutorSession.tsx src/app/tutor/components/session/SessionStage.tsx
git commit -m "feat(tutor): audio-locked CaptionTicker — poll getSpokenCaption, flag NEXT_PUBLIC_TUTOR_CAPTION_SYNC

Env flag added to .env.local + .env.local.production (gitignored)."
```

---

### Task 5: Prompt Rule 15 — render tool-call adjacency (Bug-4 fix)

**Files:**
- Modify: `src/lib/tutor/ai/system-prompt-builder.ts` (insert between Rule 14 at ~392 and Rule 16 at ~394 — the Rule 15 slot is vacant)

**Interfaces:**
- Consumes: nothing.
- Produces: prompt behavior only. MUST be generic — no topic-specific examples (`feedback_generic_prompts`).

- [ ] **Step 1: Insert the rule**

Between the Rule 14 paragraph and the Rule 16 paragraph, add:

```
**Rule 15 — Emit each render's tool call adjacent to the sentence that introduces it.** The board and your voice are one synchronized channel: the runtime surfaces each visual in step with the sentence emitted immediately before it. So place every render tool call (show_*, tutor_scribble, tutor_handwrite) DIRECTLY after the sentence that presents that visual — never front-loaded at the start of the turn before your narration reaches it, never parked at the end of the turn after the narration has moved past it, and never separated from its introducing sentence by other sentences. If your narration builds toward a visual across several sentences, the call goes right after the sentence that finally presents it, even if the board sits unchanged through the earlier sentences. Emitting the call away from its sentence makes the visual surface while you are talking about something else.
```

- [ ] **Step 2: Consistency check (read, no code)**

Confirm no contradiction with: Rule 9 (speak when you act — compatible: the acknowledgment IS the introducing sentence), Rule 13 (never announce an already-boarded render — compatible: Rule 15 governs placement of calls you DO emit), the board-anchored-speech placement rule (~line 318 — Rule 15 is its generalization; they agree), and the turn-opener rule (~286 — opener precedes any tool call; Rule 15's "never front-loaded" reinforces it).

- [ ] **Step 3: Typecheck + commit**

Run: `npx tsc --noEmit` — clean.

```bash
git add src/lib/tutor/ai/system-prompt-builder.ts
git commit -m "feat(tutor): Rule 15 — emit render tool calls adjacent to their introducing sentence (Bug-4)"
```

---

### Task 6: Verification — unit, typecheck, live checklist

**Files:** none created; this task gates completion.

- [ ] **Step 1: Full local gate**

Run: `npm run test:caption-sync && npm run test:render-sync && npx tsc --noEmit`
Expected: all green.

- [ ] **Step 2: Live verify (dev server, claude-brain engine)**

Start the dev server (port 3001 per project convention; the user may prefer their running instance). In a claude-brain session:

1. **Word pacing:** ask for an explanation; caption words appear in step with the voice (not racing ahead). Repeat with `ttsProvider` openai-mini AND realtime.
2. **Pause/resume:** trigger a noise barge-in (or `__tutorForceFalseBargein`); the caption freezes mid-sentence at a word boundary; on resume it continues from where it froze.
3. **Kill/retry:** `__tutorForceKill`; the caption freezes at voiced content; the retry re-reveals from the start of the new attempt.
4. **Reload:** reload mid-session; the last tutor turn shows fully and instantly — no typewriter.
5. **Render adjacency (Rule 15 + render-sync re-verify):** ask for content that draws 2–3 visuals; each render surfaces as its introducing sentence is being spoken. Compare the brain stream logs (`render_sync_buffer` anchor/depth) — tool calls should sit adjacent to their announcing sentence, not sentences later.
6. **Fallback:** set `NEXT_PUBLIC_TUTOR_CAPTION_SYNC=off`, restart — legacy typewriter behavior returns.

- [ ] **Step 3: Report results honestly**

Any live-verify failure goes back to the relevant task; do not mark this plan complete with failing or unverified boxes silently checked.
