/**
 * Tutor brain v2 — the sustained-energy gate on a pause for a sound (v1's barge-in gate, voice/bargein-gate.ts).
 *
 * The v2 voice client pauses the tutor when the recogniser hears speech begin while the tutor is speaking, before any
 * words arrive (TutorVoiceV2 onSpeechStart). The tutor's own voice from the speakers also makes the recogniser hear
 * speech begin: each such sound cost a 2.5 s hole in the tutor's sentence, and after two of them the client stopped
 * pausing on sounds for the rest of the session, so a real interruption waited for words again. v1 met the same echo
 * with this gate (Task V1, portal-81f2b582; adaptive bar, round 5): the sound pauses the tutor only once the
 * microphone has carried energy above the bar for v1's sustain (350 ms, accumulated over 700 ms). Echo stays near the
 * level the microphone carried just before the onset; a learner talking over the tutor is far above it.
 *
 * The bar is v1's: the level before the onset × 2.5, between 0.03 and 0.15 (the levels are the recogniser's own
 * 0..1 microphone levels, read from its energy window, so the frames are tapped once). Words that are not the tutor's
 * still pause it at once, gate or not; the gate is only about a sound with no words yet.
 */
import { resolveBargeInEnergyThreshold, shouldFireBargeInKill, type BargeInFrame } from '../voice/bargein-gate';
import { BARGEIN_BASELINE_LOOKBACK_MS, BARGEIN_ECHO_MARGIN, BARGEIN_ENERGY_FLOOR, BARGEIN_ENERGY_THRESHOLD, BARGEIN_GATE_MAX_MS, BARGEIN_SUSTAIN_MS } from '../orchestrator/flags';

export interface V2SoundGate { onsetMs: number; threshold: number }

/** A gate for a sound heard at `onsetMs`, or null when the recogniser reports no levels at all (then the sound pauses
 *  the tutor at once, as before: no evidence is not a reason to talk over the student). */
export function armV2SoundGate(frames: readonly BargeInFrame[], onsetMs: number): V2SoundGate | null {
  if (!frames.length) return null;
  return {
    onsetMs,
    threshold: resolveBargeInEnergyThreshold({ frames: [...frames], fromMs: onsetMs - BARGEIN_BASELINE_LOOKBACK_MS, toMs: onsetMs, floor: BARGEIN_ENERGY_FLOOR, ceiling: BARGEIN_ENERGY_THRESHOLD, margin: BARGEIN_ECHO_MARGIN }),
  };
}

/** 'pause': the sound is sustained, pause the tutor. 'wait': not yet. 'drop': the tutor has stopped speaking, or v1's
 *  longest wait has passed; the gate ends without a pause. */
export function stepV2SoundGate(gate: V2SoundGate, frames: readonly BargeInFrame[], nowMs: number, tutorSpeaking: boolean): 'pause' | 'wait' | 'drop' {
  if (!tutorSpeaking || nowMs - gate.onsetMs > BARGEIN_GATE_MAX_MS) return 'drop';
  return shouldFireBargeInKill({ state: 'speaking', speechStartMs: gate.onsetMs, nowMs, frames: [...frames], energyThreshold: gate.threshold, sustainMs: BARGEIN_SUSTAIN_MS }) ? 'pause' : 'wait';
}
