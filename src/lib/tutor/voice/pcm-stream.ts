/**
 * Streaming chunked reader for pcm_f32le TTS bodies — pure, no DOM.
 *
 * Task 1.1 (humanlike-latency plan): `fetchTTSPromise` used to
 * `await res.arrayBuffer()` — the full sentence had to finish synthesis
 * before a byte played. v1 of this module resolved a playable head and ONE
 * monolithic tail; live round 2026-07-22 showed that still gaps audibly at
 * the head boundary (the tail waits for the WHOLE remainder to synthesize).
 * v2 pumps follow-chunks incrementally (every `chunkSamples`) so playback
 * pipelines against synthesis — the playback queue already handles
 * multi-chunk sentences natively (realtime path).
 *
 * Contract:
 *  - `openPcmChunkStream` resolves `null` only for a truly empty body.
 *  - `head` is the first `headSamples` samples (or everything, if the
 *    stream ends sooner — then `done` is already true and pump is a no-op).
 *  - `pump(emit)` reads the remainder, calling `emit` once per accumulated
 *    `chunkSamples` (plus a final partial). It NEVER rejects: reader errors
 *    end the pump with whatever was already emitted (a truncated sentence,
 *    never an unhandled rejection). `emit` returning `false` aborts the
 *    pump and cancels the reader (kill/supersede).
 *  - HTTP chunks split Float32 samples at arbitrary byte offsets; a
 *    byte-remainder carry reassembles them (4 bytes per sample).
 */

export interface PcmChunkStream {
  head: Float32Array;
  /** True when the stream ended within the head — nothing left to pump. */
  done: boolean;
  pump(emit: (chunk: Float32Array) => boolean | void): Promise<void>;
}

function partsToF32(parts: Uint8Array[], totalBytes: number): Float32Array {
  // Whole samples only — a trailing partial sample is dropped by the caller
  // via the carry; at final flush it means a truncated stream.
  const usable = totalBytes - (totalBytes % 4);
  const buf = new Uint8Array(usable);
  let off = 0;
  for (const p of parts) {
    const take = Math.min(p.length, usable - off);
    if (take <= 0) break;
    buf.set(take === p.length ? p : p.slice(0, take), off);
    off += take;
  }
  return new Float32Array(buf.buffer, 0, usable / 4);
}

export async function openPcmChunkStream(
  body: ReadableStream<Uint8Array>,
  headSamples: number,
  chunkSamples: number,
): Promise<PcmChunkStream | null> {
  const reader = body.getReader();
  const headBytesTarget = headSamples * 4;

  const headParts: Uint8Array[] = [];
  let headBytes = 0;
  // Bytes beyond the head boundary read in the same chunk that crossed it.
  let spill: Uint8Array | null = null;
  let done = false;

  while (headBytes < headBytesTarget) {
    let res: ReadableStreamReadResult<Uint8Array>;
    try {
      res = await reader.read();
    } catch (err) {
      console.warn('[pcm-stream] head read error:', err);
      done = true;
      break;
    }
    if (res.done) { done = true; break; }
    const chunk = res.value;
    if (!chunk || chunk.length === 0) continue;
    const need = headBytesTarget - headBytes;
    if (chunk.length <= need) {
      headParts.push(chunk);
      headBytes += chunk.length;
    } else {
      headParts.push(chunk.slice(0, need));
      spill = chunk.slice(need);
      headBytes = headBytesTarget;
    }
  }

  if (headBytes === 0 && !spill) {
    if (!done) { try { reader.cancel().catch(() => {}); } catch {} }
    return null;
  }

  const head = partsToF32(headParts, headBytes);
  const chunkBytesTarget = chunkSamples * 4;

  const pump = async (emit: (chunk: Float32Array) => boolean | void): Promise<void> => {
    if (done) return;
    let parts: Uint8Array[] = spill ? [spill] : [];
    let bytes = spill ? spill.length : 0;

    const flush = (): boolean => {
      // Emit whole samples; carry the remainder bytes into the next window.
      const usable = bytes - (bytes % 4);
      if (usable === 0) return true;
      const out = partsToF32(parts, bytes);
      const carryBytes = bytes - usable;
      if (carryBytes > 0) {
        const last = parts[parts.length - 1];
        parts = [last.slice(last.length - carryBytes)];
      } else {
        parts = [];
      }
      bytes = carryBytes;
      return emit(out) !== false;
    };

    for (;;) {
      if (bytes >= chunkBytesTarget) {
        if (!flush()) { try { reader.cancel().catch(() => {}); } catch {} return; }
        continue;
      }
      let res: ReadableStreamReadResult<Uint8Array>;
      try {
        res = await reader.read();
      } catch (err) {
        console.warn('[pcm-stream] tail truncated:', err);
        break;
      }
      if (res.done) break;
      if (res.value && res.value.length > 0) {
        parts.push(res.value);
        bytes += res.value.length;
      }
    }
    flush(); // final partial window
  };

  return { head, done, pump };
}
