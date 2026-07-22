/**
 * Pure core of the Cartesia TTS WebSocket transport — Task 3.1 of
 * docs/superpowers/plans/2026-07-20-tutor-humanlike-latency-sync.md.
 * No DOM, no WebSocket — the hook (useCartesiaSonicWS.ts) owns the
 * connection; this module owns everything unit-testable:
 *
 *  - frame demux by `context_id` (one WS carries interleaved frames for
 *    every in-flight sentence; context_id = `<turnId>:<sentenceIdx>` per
 *    the plan),
 *  - base64 pcm_f32le → Float32Array decode,
 *  - the word-clock advance rule (`wordIndexAt`).
 *
 * Frame shapes verified against docs.cartesia.ai/api-reference/tts/tts.md
 * AND a live run (scripts/spike-cartesia-ws-tts.ts, 2026-07-22 — 22 chunk
 * frames + 12 timestamps frames + 1 done for a 15-word sentence):
 *   chunk       {type:'chunk', context_id, data:<b64>, done:false}
 *   timestamps  {type:'timestamps', context_id, word_timestamps:
 *                 {words:string[], start:number[], end:number[]}}  — words
 *                 arrive INCREMENTALLY across many frames; accumulate them.
 *   done        {type:'done', context_id, done:true}
 *   flush_done  recognized no-op (we never send flush)
 *   error       {type:'error', context_id, message}
 *
 * Timestamps are for the REWRITTEN transcript (rewriteForTTS output — what
 * is actually spoken), not the display sentence. Word-anchor matching in
 * Task 3.2 must match against these words.
 */

export interface SonicWordTimestamps {
  words: string[];
  start: number[];
  end: number[];
}

/** Raw parsed WS frame. Loose on purpose — the server owns the schema. */
export interface SonicFrame {
  type?: string;
  context_id?: string;
  data?: string;
  done?: boolean;
  word_timestamps?: SonicWordTimestamps;
  message?: string;
  [k: string]: unknown;
}

export interface SonicContextHandlers {
  onChunk(chunk: Float32Array): void;
  /** Incremental word timestamps — each call APPENDS to the sentence's
   *  word array; `startSec` offsets are relative to the sentence's own
   *  audio start (t=0 at its first sample). */
  onWords(words: string[], startSec: number[]): void;
  onDone(): void;
  onError(message: string): void;
}

/** base64 pcm_f32le → Float32Array. Works in browser (atob) and node
 *  (Buffer) so the demux is testable off-DOM. Trailing partial samples
 *  (never observed; defensive) are dropped. */
export function base64ToFloat32(b64: string): Float32Array {
  if (!b64) return new Float32Array(0);
  let bytes: Uint8Array;
  if (typeof atob === 'function') {
    const bin = atob(b64);
    bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  } else {
    bytes = Buffer.from(b64, 'base64');
  }
  const usable = bytes.byteLength - (bytes.byteLength % 4);
  if (usable === 0) return new Float32Array(0);
  // Copy into a fresh buffer: Buffer.from may return a view at a non-zero,
  // non-4-aligned offset into a shared pool, which Float32Array rejects.
  const out = new Uint8Array(usable);
  out.set(bytes.subarray(0, usable));
  return new Float32Array(out.buffer);
}

/**
 * Routes frames to the registered per-sentence handlers by `context_id`.
 * Unknown/stale contexts (cancelled sentences, late frames after done) are
 * silently dropped — kill/supersede simply unregisters, mirroring the
 * pendingTail token pattern on the HTTP streamed path. `done` and `error`
 * auto-unregister so a duplicate terminal frame can never double-fire.
 *
 * handleFrame returns true iff the frame was delivered to (or recognized
 * for) a live context — false means dropped. It never throws: a malformed
 * frame (bad base64, missing fields) is dropped or delivered-empty, never
 * an exception into the WS onmessage handler.
 */
export class SonicContextDemux {
  private contexts = new Map<string, SonicContextHandlers>();

  register(contextId: string, handlers: SonicContextHandlers): void {
    this.contexts.set(contextId, handlers);
  }

  unregister(contextId: string): void {
    this.contexts.delete(contextId);
  }

  get size(): number {
    return this.contexts.size;
  }

  handleFrame(frame: SonicFrame): boolean {
    const type = frame?.type;
    const contextId = frame?.context_id;
    if (!type || !contextId) return false;
    const h = this.contexts.get(contextId);
    if (!h) return false;
    switch (type) {
      case 'chunk': {
        let f32: Float32Array;
        try {
          f32 = base64ToFloat32(typeof frame.data === 'string' ? frame.data : '');
        } catch {
          return false;
        }
        if (f32.length > 0) {
          try { h.onChunk(f32); } catch {}
        }
        return true;
      }
      case 'timestamps': {
        const wt = frame.word_timestamps;
        if (
          !wt ||
          !Array.isArray(wt.words) ||
          !Array.isArray(wt.start) ||
          wt.words.length === 0 ||
          wt.words.length !== wt.start.length
        ) {
          return false;
        }
        try { h.onWords(wt.words, wt.start); } catch {}
        return true;
      }
      case 'done': {
        this.contexts.delete(contextId);
        try { h.onDone(); } catch {}
        return true;
      }
      case 'flush_done':
        // We never send flush; recognized so it doesn't read as unknown.
        return true;
      case 'error': {
        this.contexts.delete(contextId);
        const msg = typeof frame.message === 'string' ? frame.message : 'sonic-ws error frame';
        try { h.onError(msg); } catch {}
        return true;
      }
      default:
        return false;
    }
  }

  /** Connection-level failure: fail every in-flight sentence at once
   *  (WS closed mid-synthesis). Contexts are cleared first so a handler
   *  re-entering the demux can't double-fail. */
  failAll(message: string): void {
    const entries = [...this.contexts.values()];
    this.contexts.clear();
    for (const h of entries) {
      try { h.onError(message); } catch {}
    }
  }
}

/**
 * Word-clock advance: index of the last word whose start offset has been
 * reached at `elapsedSec` of the sentence's audio, scanning forward from
 * `fromIdx` (the previously reported index) so repeated calls are O(advance)
 * and the clock NEVER moves backward — a late/adjusted elapsedSec (e.g. an
 * AudioContext.currentTime wobble across a chunk boundary) can't retract an
 * already-announced word. Returns -1 while before the first word.
 */
export function wordIndexAt(starts: number[], elapsedSec: number, fromIdx: number): number {
  let i = Math.max(fromIdx, -1);
  while (i + 1 < starts.length && starts[i + 1] <= elapsedSec) i++;
  return i;
}
