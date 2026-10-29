/**
 * One-turn pronunciation clip (GDI trial, 2026-10-28, design §3).
 *
 * The tutor models a word or sentence, asks the learner to repeat it, and
 * calls `request_pronunciation_check`. That ARMS this capture. The learner's
 * next turn — from the next speech start to the speech stop (Ink's
 * `turn.eager_end`), or `maxMs` after the first buffered sample, whichever
 * comes first — is buffered from the mic tap as PCM16 and handed back once.
 * The runtime POSTs it to /api/tutor/pronunciation/assess and plants the
 * returned note for the next brain turn.
 *
 * State machine:
 *   idle ──arm──▶ armed ──onSpeechStart──▶ capturing
 *   capturing ──onSpeechStop (≥1 sample)──▶ clip, idle
 *   capturing ──push reaches maxMs──▶ clip (returned by push), idle
 *   capturing ──onSpeechStop (0 samples)──▶ armed (wait for the real turn)
 *   any ──disarm──▶ idle
 * One clip per arm: after the clip the capture is idle, so a `turn.resume`
 * (re-fires onSpeechStart) does not re-open it. A second `arm` before the
 * clip replaces the reference text and keeps any audio already buffered.
 * A clip shorter than the server's 0.4 s minimum is still returned: the
 * server answers `clip_too_short` and the runtime plants the unavailable note.
 *
 * Pure: no React, no DOM, no env.
 */

export const CLIP_MAX_MS = 10000;
export const CLIP_SAMPLE_RATE = 24000;
/** Armed with nothing buffered this long ⇒ the runtime disarms and plants
 *  the unavailable note, so the tutor never waits on a clip that never came. */
export const CLIP_NO_SPEECH_TIMEOUT_MS = 20000;
/** How long a brain turn waits for an assessment already in flight before
 *  it goes without the note (the note then rides the turn after). */
export const PRONUNCIATION_NOTE_WAIT_MS = 4000;

/** Same sentence as assessor.ts PRONUNCIATION_UNAVAILABLE_NOTE (pinned equal
 *  in scripts/test-clip-capture.ts) — kept here so the client never imports
 *  the server's vendor clients. Planted on fetch failure / 404 / 429 / no clip. */
export const PRONUNCIATION_UNAVAILABLE_NOTE =
  'No measured result: coach stress and linking from your model; do not describe sounds.';

/** The planted note as the brain sees it, in the runtime-note convention
 *  ("[… — not from the student]") the other per-turn notes use. */
export function pronunciationNoteForBrain(note: string): string {
  return `[pronunciation check result — not from the student] ${note}`;
}

export interface PronunciationClip {
  referenceText: string;
  pcm16: Int16Array;
  durationMs: number;
}

/** Float32 [-1, 1] → Int16, clamped; NaN ⇒ 0. Always a copy. */
export function float32ToPcm16(input: Float32Array): Int16Array {
  const out = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const v = input[i];
    if (!(v === v)) { out[i] = 0; continue; } // NaN
    const s = v > 1 ? 1 : v < -1 ? -1 : v;
    out[i] = s < 0 ? Math.round(s * 32768) : Math.round(s * 32767);
  }
  return out;
}

/** PCM16 → base64 of its little-endian bytes (the route's `audio` field).
 *  Browser-safe (btoa), chunked so a 10 s clip never overflows the call stack. */
export function pcm16ToBase64(pcm: Int16Array): string {
  const bytes = new Uint8Array(pcm.length * 2);
  const view = new DataView(bytes.buffer);
  for (let i = 0; i < pcm.length; i++) view.setInt16(i * 2, pcm[i], true);
  let bin = '';
  const STEP = 0x8000;
  for (let i = 0; i < bytes.length; i += STEP) {
    bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + STEP)));
  }
  return btoa(bin);
}

export class ClipCapture {
  private readonly maxSamples: number;
  private readonly sampleRate: number;
  private referenceText: string | null = null;
  private capturing = false;
  private chunks: Int16Array[] = [];
  private samples = 0;

  constructor(opts: { maxMs: number; sampleRate: number }) {
    this.sampleRate = opts.sampleRate;
    this.maxSamples = Math.floor((opts.maxMs / 1000) * opts.sampleRate);
  }

  /** Arm for the next learner turn. Re-arming before the clip replaces the text. */
  arm(referenceText: string): void {
    this.referenceText = referenceText;
  }

  /** Drop everything (session end, no-speech timeout). */
  disarm(): void {
    this.referenceText = null;
    this.capturing = false;
    this.chunks = [];
    this.samples = 0;
  }

  isArmed(): boolean {
    return this.referenceText !== null;
  }

  isCapturing(): boolean {
    return this.capturing;
  }

  /** Speech start (Ink turn.start / turn.resume). Opens the clip only when armed. */
  onSpeechStart(): void {
    if (this.referenceText !== null) this.capturing = true;
  }

  /** A mic-tap chunk (float32, `sampleRate`). Ignored unless capturing.
   *  Returns the clip when this chunk reaches `maxMs` (the capture is then
   *  idle); otherwise null. */
  push(float32: Float32Array): PronunciationClip | null {
    if (!this.capturing || this.referenceText === null) return null;
    const room = this.maxSamples - this.samples;
    const take = float32.length > room ? float32.subarray(0, room) : float32;
    if (take.length > 0) {
      this.chunks.push(float32ToPcm16(take));
      this.samples += take.length;
    }
    return this.samples >= this.maxSamples ? this.finish() : null;
  }

  /** Speech stop (Ink turn.eager_end). The clip when anything was buffered. */
  onSpeechStop(): PronunciationClip | null {
    if (!this.capturing || this.referenceText === null) return null;
    if (this.samples === 0) {
      this.capturing = false; // stay armed: the learner's real turn is still to come
      return null;
    }
    return this.finish();
  }

  private finish(): PronunciationClip {
    const pcm16 = new Int16Array(this.samples);
    let o = 0;
    for (const c of this.chunks) { pcm16.set(c, o); o += c.length; }
    const clip: PronunciationClip = {
      referenceText: this.referenceText ?? '',
      pcm16,
      durationMs: Math.round((this.samples / this.sampleRate) * 1000),
    };
    this.disarm();
    return clip;
  }
}
