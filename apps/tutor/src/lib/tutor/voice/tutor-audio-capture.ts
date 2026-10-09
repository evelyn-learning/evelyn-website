/**
 * Whether the tutor's audio is recorded for this session — a pure decision.
 *
 * 2026-10-09 (local end-to-end run): every TEXT session uploaded an all-zero
 * `tutor.pcm16` (~2.9 MB per minute) and was flagged `hasAudio: true`. Text
 * mode resolves the TTS provider to `silent` (resolve-tts-provider.ts), whose
 * zero-filled buffers exist only to keep sentence-start / drain / render-sync
 * firing. They went through the playback queue like any audio, and the
 * recorder tap sits at the queue's dequeue (useOpenAIRealtime.ts), so each
 * one was recorded, silence-aligned to the wall clock, uploaded, and the
 * upload route set the flag on the first chunk.
 *
 * A tutor that makes no sound has no audio track: the tap is not attached.
 * Nothing reaches the recorder's tutor buffer, so nothing is uploaded, the
 * finalize signal finds no bytes on disk (recordings/finalize-audio.ts) and
 * `hasAudio` is never set. The student track is untouched — a text session
 * never opens the mic, and a voice session run with `?tts=silent` still
 * records the student.
 *
 * Exercised by `npx tsx scripts/test-tutor-audio-capture.ts`.
 */
import { TUTOR_NO_SILENT_AUDIO_CAPTURE } from '@/lib/tutor/orchestrator/turn-round-flags';

export interface TutorAudioCapture {
  capture: boolean;
  reason: 'recording-off' | 'text-mode' | 'silent-provider' | 'audible' | 'flag-off';
}

export function decideTutorAudioCapture(i: {
  /** Session recording is on at all (a session id, and not switched off). */
  recordEnabled: boolean;
  /** The session's input mode. */
  sessionMode: string;
  /** The resolved TTS provider. */
  ttsProvider: string | undefined;
  /** Unset ⇒ TUTOR_NO_SILENT_AUDIO_CAPTURE; false ⇒ every provider is
   *  recorded, as before. */
  enabled?: boolean;
}): TutorAudioCapture {
  if (!i.recordEnabled) return { capture: false, reason: 'recording-off' };
  if ((i.enabled ?? TUTOR_NO_SILENT_AUDIO_CAPTURE) !== true) return { capture: true, reason: 'flag-off' };
  if (i.sessionMode === 'text') return { capture: false, reason: 'text-mode' };
  if (i.ttsProvider === 'silent') return { capture: false, reason: 'silent-provider' };
  return { capture: true, reason: 'audible' };
}
