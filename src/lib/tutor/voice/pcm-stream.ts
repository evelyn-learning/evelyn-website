/**
 * Streaming head/tail reader for pcm_f32le TTS bodies — pure, no DOM.
 *
 * Task 1.1 (humanlike-latency plan): `fetchTTSPromise` used to
 * `await res.arrayBuffer()` — the full sentence had to finish synthesis
 * before a byte played, forfeiting the streaming pass-through the
 * tts-cartesia route deliberately preserves. This reader resolves a
 * playable `head` as soon as `headSamples` Float32 samples have arrived
 * and keeps reading the remainder into `tailPromise`.
 *
 * Contract:
 *  - Returns `null` only for a truly empty body (no samples at all).
 *  - `tailPromise` resolves `null` when the sentence fits in the head.
 *  - `tailPromise` NEVER rejects: reader errors resolve with whatever
 *    tail accumulated (or `null`) — a truncated tail degrades to a
 *    shorter sentence, never an unhandled rejection.
 *  - HTTP chunks split Float32 samples at arbitrary byte offsets; a
 *    byte-remainder carry reassembles them (4 bytes per sample).
 */

export interface StreamedPcm {
  head: Float32Array;
  tailPromise: Promise<Float32Array | null>;
}

export async function readPcmHeadTail(
  body: ReadableStream<Uint8Array>,
  headSamples: number,
): Promise<StreamedPcm | null> {
  const reader = body.getReader();
  const headBytesTarget = headSamples * 4;

  const headParts: Uint8Array[] = [];
  let headBytes = 0;
  // Bytes beyond the head boundary read in the same chunk that crossed it.
  let spill: Uint8Array | null = null;
  let done = false;
  let errored = false;

  while (headBytes < headBytesTarget) {
    let res: ReadableStreamReadResult<Uint8Array>;
    try {
      res = await reader.read();
    } catch (err) {
      console.warn('[pcm-stream] head read error:', err);
      errored = true;
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
    if (!done && !errored) { try { reader.cancel().catch(() => {}); } catch {} }
    return null;
  }

  const toF32 = (parts: Uint8Array[], totalBytes: number): Float32Array => {
    // Whole samples only — drop a trailing partial sample (truncated stream).
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
  };

  const head = toF32(headParts, headBytes);

  // Sentence fully arrived (or died) within the head window → no tail.
  if (done || errored) {
    return { head, tailPromise: Promise.resolve(null) };
  }

  const tailPromise: Promise<Float32Array | null> = (async () => {
    const tailParts: Uint8Array[] = spill ? [spill] : [];
    let tailBytes = spill ? spill.length : 0;
    for (;;) {
      let res: ReadableStreamReadResult<Uint8Array>;
      try {
        res = await reader.read();
      } catch (err) {
        console.warn('[pcm-stream] tail truncated:', err);
        break;
      }
      if (res.done) break;
      if (res.value && res.value.length > 0) {
        tailParts.push(res.value);
        tailBytes += res.value.length;
      }
    }
    if (tailBytes < 4) return null;
    return toF32(tailParts, tailBytes);
  })();

  return { head, tailPromise };
}
