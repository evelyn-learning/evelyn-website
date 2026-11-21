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
import { TUTOR_V2_PRON_ONSET_GRACE } from '../orchestrator/flags';

/** The assess route's request body for one clip (assess-request.ts parseAssessBody). */
export function v2AssessRequestBody(sessionId: string, clip: PronunciationClip): { sessionId: string; referenceText: string; audio: string } {
  return { sessionId, referenceText: clip.referenceText, audio: pcm16ToBase64(clip.pcm16) };
}

/** How long the assess call may take before the reply counts as unmeasured (v1's 15 s). */
const ASSESS_TIMEOUT_MS = 15000;
/** Task 8g (PRON_ONSET_GRACE): an onset heard while the tutor's voice plays is their attempt when the voice ends within this long after it
 *  (the model sentence was at its end). The capture's pre-roll (CLIP_PRE_ROLL_MS, longer than this) holds the onset. */
export const V2_PRON_ONSET_GRACE_MS = 500;
/** Task 8g fix round 1 (I3): a capture opened at the voice's end is kept only if their speech is still going this long after the end; a
 *  stop sooner is the tail of the tutor's own voice (an echo), and the clip is dropped unsent, the arm kept. */
export const V2_PRON_ONSET_CONFIRM_MS = 400;

export class V2PronunciationRecorder {
  private readonly capture = new ClipCapture({ maxMs: CLIP_MAX_MS, sampleRate: CLIP_SAMPLE_RATE, preRollMs: CLIP_PRE_ROLL_MS, minMs: CLIP_MIN_MS });
  private seq = -1;
  private armedAt = 0;
  private pending: Promise<void> | null = null;
  private ready: V2PronunciationHeard | null = null;
  /** Task 8g: when an onset was heard over the tutor's voice and their speech has not stopped since (null: none). */
  private onsetOverVoiceAt: number | null = null;
  /** Task 8g fix round 1 (I3): a capture opened at the voice's end is provisional until this time (null: none). */
  private provisionalUntil: number | null = null;
  private reference = '';
  private readonly fetchImpl: typeof fetch;
  private readonly now: () => number;
  private readonly log: (type: string, message: string) => void;

  constructor(private readonly opts: { sessionId: string; fetchImpl?: typeof fetch; now?: () => number; log?: (type: string, message: string) => void; onsetGrace?: boolean }) {
    this.fetchImpl = opts.fetchImpl ?? ((...a) => fetch(...a));
    this.now = opts.now ?? Date.now;
    this.log = opts.log ?? (() => {});
  }

  /** Arm the next utterance for arm `seq` (the state's). The same arm again changes nothing. */
  arm(seq: number, reference: string): void {
    if (seq === this.seq && this.capture.isArmed()) return;
    // A new arm starts a new clip: ClipCapture keeps buffered audio across a re-arm, which here belongs to the old item.
    this.capture.disarm();
    this.onsetOverVoiceAt = null; this.provisionalUntil = null; this.reference = reference;
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
    if (tutorSpeaking) {
      this.log('pronunciation_start_ignored_tutor_speaking', `#${this.seq} (v2)`);
      // Fix round 1 (I3): the earliest onset is kept (a recogniser that fires start again does not move it later).
      if ((this.opts.onsetGrace ?? TUTOR_V2_PRON_ONSET_GRACE) && this.onsetOverVoiceAt === null) this.onsetOverVoiceAt = this.now();
      return;
    }
    this.onsetOverVoiceAt = null;
    this.capture.onSpeechStart();
  }

  /** Task 8g (PRON_ONSET_GRACE; mic test 11, embed-1795220913119 16:52.59: he began about 50 ms before the voice ended and the attempt was
   *  never recorded): the tutor's voice has finished playing. An onset heard over it within V2_PRON_ONSET_GRACE_MS before now, their speech
   *  still going (no stop since), is their attempt: the capture opens now, its pre-roll holding the onset. An onset earlier in the
   *  sentence is left as before (an echo, or speech over the tutor): the capture waits for a new onset.
   *  Fix round 1 (I3): `final`: the reply has finished (its last sentence played), not a drain between streamed sentences of the same
   *  reply, which changes nothing. The capture opened here is provisional: kept only if their speech is still going
   *  V2_PRON_ONSET_CONFIRM_MS after the end (speechStop). */
  tutorVoiceEnded(final: boolean = true): void {
    if (!final) return;
    const at = this.onsetOverVoiceAt; this.onsetOverVoiceAt = null;
    if (at === null || !(this.opts.onsetGrace ?? TUTOR_V2_PRON_ONSET_GRACE) || !this.capture.isArmed() || this.capture.isCapturing()) return;
    const after = this.now() - at;
    if (after > V2_PRON_ONSET_GRACE_MS) return;
    this.capture.onSpeechStart();
    this.provisionalUntil = this.now() + V2_PRON_ONSET_CONFIRM_MS;
    this.log('pronunciation_start_at_voice_end', `#${this.seq} onset ${after} ms before the voice ended (v2)`);
  }

  /** The recogniser's speech stop (Ink's eager end): the clip, when one is open, is sent. */
  speechStop(): void {
    this.onsetOverVoiceAt = null;
    const provisional = this.provisionalUntil; this.provisionalUntil = null;
    // Fix round 1 (I3): their speech stopped within V2_PRON_ONSET_CONFIRM_MS of the voice's end: the tail of the tutor's voice. The clip
    // is dropped unsent; the arm stays for their real attempt (a fresh capture: its pre-roll held the tutor's voice).
    if (provisional !== null && this.now() < provisional && this.capture.isCapturing()) {
      this.capture.disarm(); this.capture.arm(this.reference);
      this.log('pronunciation_voice_end_echo_dropped', `#${this.seq} speech stopped within ${V2_PRON_ONSET_CONFIRM_MS} ms of the voice end (v2)`);
      return;
    }
    const clip = this.capture.onSpeechStop();
    if (clip) this.send(clip);
  }

  private send(clip: PronunciationClip): void {
    const seq = this.seq;
    const peak = clipPeakDbfs(clip.pcm16);
    const peakLabel = Number.isFinite(peak) ? peak.toFixed(1) : '-inf';
    this.log('pronunciation_clip_sent', `#${seq} ${clip.durationMs}ms peak=${peakLabel}dBFS "${clip.referenceText.slice(0, 80)}" (v2)`);
    // v1 Task 24 §A2: an all-zero clip reads to the vendor as "not attempted": it is not posted.
    if (!(peak >= CLIP_SILENT_DBFS)) { this.ready = { seq, status: 'unavailable', reason: 'clip_silent' }; this.log('pronunciation_failed', `#${seq} unavailable clip_silent (v2)`); return; }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ASSESS_TIMEOUT_MS);
    const run = this.fetchImpl('/api/tutor/pronunciation/assess', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v2AssessRequestBody(this.opts.sessionId, clip)), signal: ctrl.signal,
    })
      .then(async (res) => v2PronunciationHeardOf(seq, res.status, res.ok ? await res.json().catch(() => null) : null))
      .catch((e: unknown): V2PronunciationHeard => ({ seq, status: 'unavailable', reason: `fetch_failed: ${String((e as Error)?.message ?? e).slice(0, 60)}` }))
      // Task 6f: a measurement is pronunciation_scored, anything else pronunciation_failed with its reason, so a replay or a
      // session dump shows why no score reached the facts (the local replays ran with no vendor: no_vendor, never logged).
      .then((heard) => { this.ready = heard; this.log(heard.status === 'measured' ? 'pronunciation_scored' : 'pronunciation_failed', `#${seq} ${heard.status}${heard.overall !== undefined ? ` ${heard.overall}/100` : ''}${heard.reason ? ` ${heard.reason}` : ''} (v2)`); })
      .finally(() => { clearTimeout(timer); if (this.pending === run) this.pending = null; });
    this.pending = run;
  }

  /** The score for the turn about to run: waits at most `waitMs` for one in flight. Null when there is none. */
  async take(waitMs: number): Promise<V2PronunciationHeard | null> {
    if (this.pending) await Promise.race([this.pending, new Promise((r) => setTimeout(r, waitMs))]);
    const heard = this.ready; this.ready = null;
    // Still in flight when the turn has to run: this reply goes unmeasured (its result, when it comes, answers an arm
    // the turn has used up and is dropped).
    if (!heard && this.pending) this.log('pronunciation_failed', `#${this.seq} late: no result within ${waitMs}ms (v2)`);
    return heard;
  }
}
