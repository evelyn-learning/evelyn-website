/**
 * Pause-first barge-in (2026-10-17, GDI sessions embed-1792254012923,
 * -1792261973710, -1792271667337).
 *
 * WHAT WENT WRONG: the stage-3 kill during 'speaking' waited for proof that
 * the onset was not the tutor's own echo. The proof came from the energy gate
 * (BARGEIN_ENERGY_THRESHOLD ceiling 0.15 — saturated on a laptop whose mic
 * sits next to its speaker, so it never passed) or from the FINAL transcript
 * (Ink's turn.end, 1.5–2 s after the student began). Praveen, as a human,
 * said "Excuse me, can you stop for a moment?" six times; Ryota stopped each
 * time — 1.5–2 s later, after the whole phrase had been transcribed — and once
 * not at all (cancel-storm guard). That is what "barge-in doesn't work well"
 * is.
 *
 * THE SHAPE: pause first, decide second. On a speech onset while the tutor is
 * speaking, suspend the playback clock at once (the student hears Ryota stop
 * within a frame). Then decide, from whichever evidence arrives first:
 *   - the energy gate passes                      → kill (as today);
 *   - a partial transcript (Ink turn.update, ~300 ms cadence) with real
 *     content that does NOT match the tutor's own TTS script → kill;
 *     one that DOES match (self-voice)             → resume: it was echo;
 *   - the utterance stops before any words         → resume: a blip;
 *   - BARGEIN_PAUSE_MAX_MS with no evidence         → resume.
 * A false pause on an echo blip costs a sub-second hiccup, not a cut, so the
 * echo protection the gate was added for is kept; a real interruption stops
 * the tutor in ~0 ms and is confirmed in ~300–600 ms instead of ~2 s.
 *
 * Pure decision core; the pause/resume and the refs live in the realtime
 * hook (pauseSpeech / resumeSpeech) and VoiceTutorRealtime.
 */
import { scoreSelfVoice, SELF_VOICE_THRESHOLD, type RecentTtsScript } from './perception-classifier';

/** No evidence either way after this long → resume (Ink's first partial
 *  normally lands within ~600 ms of a real onset). */
export const BARGEIN_PAUSE_MAX_MS = 1500;
/** Letters / kana / kanji a partial needs before it counts as content. Four,
 *  because the CJK echo measure needs four characters to say anything. */
export const BARGEIN_PAUSE_MIN_PARTIAL_CHARS = 4;

export interface BargeInPauseState {
  onsetAt: number;
  speechStopped: boolean;
  partial: string | null;
  timer: ReturnType<typeof setTimeout> | null;
}

export type BargeInPauseDecision = 'kill' | 'resume' | 'wait';

export interface BargeInPauseInput {
  /** Production state now. Anything but 'speaking' means the turn ended on
   *  its own (or another path killed it): nothing left to protect. */
  state: string;
  elapsedMs: number;
  speechStopped: boolean;
  /** Latest cumulative partial transcript of this utterance, if any. */
  partial: string | null;
  /** scorePartialSelfVoice(partial), or null when there is no partial. */
  selfVoiceScore: number | null;
  energyGatePassed: boolean;
}

export function partialIsSubstantive(partial: string | null | undefined): boolean {
  const t = (partial ?? '').replace(/[^A-Za-z0-9ぁ-んァ-ヺ一-龯々]/g, '');
  return t.length >= BARGEIN_PAUSE_MIN_PARTIAL_CHARS;
}

export function decideBargeInPause(i: BargeInPauseInput): BargeInPauseDecision {
  if (i.state !== 'speaking') return 'resume';
  if (i.energyGatePassed) return 'kill';
  if (partialIsSubstantive(i.partial)) {
    if (i.selfVoiceScore != null && i.selfVoiceScore >= SELF_VOICE_THRESHOLD) return 'resume';
    return 'kill';
  }
  if (i.speechStopped) return 'resume';
  if (i.elapsedMs >= BARGEIN_PAUSE_MAX_MS) return 'resume';
  return 'wait';
}

/** The classifier's self-voice score for a partial, against the scripts that
 *  could still be in the speaker → mic loop. */
export function scorePartialSelfVoice(partial: string, scripts: readonly RecentTtsScript[], onsetAt: number, now: number): number {
  const recent = scripts.filter((s) => s.spokenStartedAt >= onsetAt - 30_000);
  return scoreSelfVoice(partial, recent, onsetAt, now);
}
