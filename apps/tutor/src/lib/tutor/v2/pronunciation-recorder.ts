/**
 * Tutor brain v2 — recording the armed reply for measured pronunciation (pronunciation.ts).
 *
 * The voice client (TutorVoiceV2) feeds this the recogniser's microphone frames (24 kHz float32, the tap v1 reads,
 * Task 24 §A1) and its speech start and stop. When the tutor's turn armed a reply (practise_pronunciation), the
 * student's next utterance is cut into one clip by v1's ClipCapture (600 ms pre-roll, a 400 ms blip ignored once,
 * 15 s cap) and posted to /api/tutor/pronunciation/assess. The next turn takes the score (waiting a bounded time for
 * one in flight) and puts it in the state. No React, no DOM: fetch and the clock are injected for tests.
 */
import {
  ClipCapture, CLIP_MAX_MS, CLIP_MIN_MS, CLIP_PRE_ROLL_MS, CLIP_SAMPLE_RATE, CLIP_SILENT_DBFS, PRONUNCIATION_ARM_MAX_MS,
  clipPeakDbfs, pcm16ToBase64, type PronunciationClip,
} from '../pronunciation/clip-capture';
import { v2PronunciationHeardOf, type V2PronunciationHeard } from './pronunciation';

/** The assess route's request body for one clip (assess-request.ts parseAssessBody). */
export function v2AssessRequestBody(sessionId: string, clip: PronunciationClip): { sessionId: string; referenceText: string; audio: string } {
  return { sessionId, referenceText: clip.referenceText, audio: pcm16ToBase64(clip.pcm16) };
}

/** How long the assess call may take before the reply counts as unmeasured (v1's 15 s). */
const ASSESS_TIMEOUT_MS = 15000;

export class V2PronunciationRecorder {
  private readonly capture = new ClipCapture({ maxMs: CLIP_MAX_MS, sampleRate: CLIP_SAMPLE_RATE, preRollMs: CLIP_PRE_ROLL_MS, minMs: CLIP_MIN_MS });
  private seq = -1;
  private armedAt = 0;
  private pending: Promise<void> | null = null;
  private ready: V2PronunciationHeard | null = null;
  private readonly fetchImpl: typeof fetch;
  private readonly now: () => number;
  private readonly log: (type: string, message: string) => void;

  constructor(private readonly opts: { sessionId: string; fetchImpl?: typeof fetch; now?: () => number; log?: (type: string, message: string) => void }) {
    this.fetchImpl = opts.fetchImpl ?? ((...a) => fetch(...a));
    this.now = opts.now ?? Date.now;
    this.log = opts.log ?? (() => {});
  }

  /** Arm the next utterance for arm `seq` (the state's). The same arm again changes nothing. */
  arm(seq: number, reference: string): void {
    if (seq === this.seq && this.capture.isArmed()) return;
    // A new arm starts a new clip: ClipCapture keeps buffered audio across a re-arm, which here belongs to the old item.
    this.capture.disarm();
    this.capture.arm(reference);
    this.seq = seq; this.armedAt = this.now();
    this.log('pronunciation_armed', `#${seq} "${reference.slice(0, 80)}" (v2)`);
  }

  disarm(): void { if (this.capture.isArmed()) this.log('pronunciation_disarmed', `#${this.seq} (v2)`); this.capture.disarm(); }
  isArmed(): boolean { return this.capture.isArmed(); }

  /** A microphone frame. A clip that reaches the 15 s cap is sent from here. */
  frame(float32: Float32Array): void {
    const clip = this.capture.push(float32);
    if (clip) this.send(clip);
  }

  /** The recogniser heard speech begin. `tutorSpeaking`: the tutor's voice is still playing. */
  speechStart(tutorSpeaking: boolean): void {
    if (!this.capture.isArmed() || this.capture.isCapturing()) return;
    // v1 (PRONUNCIATION_ARM_MAX_MS): a stale arm must never score some later, unrelated reply.
    if (this.now() - this.armedAt > PRONUNCIATION_ARM_MAX_MS) { this.capture.disarm(); this.log('pronunciation_unavailable', `arm_expired #${this.seq} (v2)`); return; }
    // v1: an onset while the model line plays is its echo, not the repeat; the capture stays armed for the real one.
    if (tutorSpeaking) { this.log('pronunciation_start_ignored_tutor_speaking', `#${this.seq} (v2)`); return; }
    this.capture.onSpeechStart();
  }

  /** The recogniser's speech stop (Ink's eager end): the clip, when one is open, is sent. */
  speechStop(): void {
    const clip = this.capture.onSpeechStop();
    if (clip) this.send(clip);
  }

  private send(clip: PronunciationClip): void {
    const seq = this.seq;
    const peak = clipPeakDbfs(clip.pcm16);
    const peakLabel = Number.isFinite(peak) ? peak.toFixed(1) : '-inf';
    this.log('pronunciation_clip_sent', `#${seq} ${clip.durationMs}ms peak=${peakLabel}dBFS "${clip.referenceText.slice(0, 80)}" (v2)`);
    // v1 Task 24 §A2: an all-zero clip reads to the vendor as "not attempted": it is not posted.
    if (!(peak >= CLIP_SILENT_DBFS)) { this.ready = { seq, status: 'unavailable', reason: 'clip_silent' }; return; }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ASSESS_TIMEOUT_MS);
    const run = this.fetchImpl('/api/tutor/pronunciation/assess', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v2AssessRequestBody(this.opts.sessionId, clip)), signal: ctrl.signal,
    })
      .then(async (res) => v2PronunciationHeardOf(seq, res.status, res.ok ? await res.json().catch(() => null) : null))
      .catch((e: unknown): V2PronunciationHeard => ({ seq, status: 'unavailable', reason: `fetch_failed: ${String((e as Error)?.message ?? e).slice(0, 60)}` }))
      .then((heard) => { this.ready = heard; this.log('pronunciation_scored', `#${seq} ${heard.status}${heard.overall !== undefined ? ` ${heard.overall}/100` : ''}${heard.reason ? ` ${heard.reason}` : ''} (v2)`); })
      .finally(() => { clearTimeout(timer); if (this.pending === run) this.pending = null; });
    this.pending = run;
  }

  /** The score for the turn about to run: waits at most `waitMs` for one in flight. Null when there is none. */
  async take(waitMs: number): Promise<V2PronunciationHeard | null> {
    if (this.pending) await Promise.race([this.pending, new Promise((r) => setTimeout(r, waitMs))]);
    const heard = this.ready; this.ready = null;
    return heard;
  }
}
