/**
 * "Tutor is thinking" cue — sound + stage state (GDI sessions 2026-10-15).
 *
 * The only sign that the tutor had taken a turn was the small caption
 * "Got that — one sec…", which a learner who isn't looking at the screen
 * never sees: they kept talking, or assumed the tutor had stalled. The
 * partner picked a sound cue plus a large on-stage state. This module is the
 * pure timing logic; the audio lives in thinking-cue-audio.ts and the visual
 * in SessionStage.
 *
 *   turn accepted ─▶ chime ─▶ (no tutor audio after CHIME_TO_PULSE_MS) ─▶
 *   soft pulse every PULSE_EVERY_MS ─▶ stops the moment the voice state
 *   leaves processing/thinking (tutor audio started, the student barged in,
 *   the turn was cancelled, the session ended).
 *
 * Off unless the embed token carries `thinking_cue: true`, so every other
 * partner's session is unchanged.
 */

export const CHIME_TO_PULSE_MS = 2000;
export const PULSE_EVERY_MS = 1200;
/** The accepted turn can land a beat before the coarse voice state flips to
 *  processing/thinking; don't read that beat as "the wait is over". */
export const ACCEPT_GRACE_MS = 600;

const WAITING_STATES = new Set(['processing', 'thinking']);

export type ThinkingCuePhase = 'idle' | 'waiting' | 'pulsing';
export interface ThinkingCueState {
  phase: ThinkingCuePhase;
  acceptedAt: number;
  lastPulseAt: number;
}
export type ThinkingCueSound = 'chime' | 'pulse' | null;

export function initialThinkingCue(): ThinkingCueState {
  return { phase: 'idle', acceptedAt: 0, lastPulseAt: 0 };
}

/** A real student turn was accepted for the brain: chime once, start waiting. */
export function cueTurnAccepted(_s: ThinkingCueState, now: number): { state: ThinkingCueState; play: ThinkingCueSound } {
  return { state: { phase: 'waiting', acceptedAt: now, lastPulseAt: 0 }, play: 'chime' };
}

/** Advance on a timer tick or a voice-state change. Returns the sound to play
 *  now, if any. Leaving processing/thinking (after the grace beat) ends the
 *  wait at once, so a pulse never plays over the tutor or the student. */
export function cueTick(s: ThinkingCueState, voiceState: string, now: number): { state: ThinkingCueState; play: ThinkingCueSound } {
  if (s.phase === 'idle') return { state: s, play: null };
  if (!WAITING_STATES.has(voiceState)) {
    if (now - s.acceptedAt < ACCEPT_GRACE_MS) return { state: s, play: null };
    return { state: initialThinkingCue(), play: null };
  }
  if (s.phase === 'waiting') {
    if (now - s.acceptedAt >= CHIME_TO_PULSE_MS) return { state: { ...s, phase: 'pulsing', lastPulseAt: now }, play: 'pulse' };
    return { state: s, play: null };
  }
  if (now - s.lastPulseAt >= PULSE_EVERY_MS) return { state: { ...s, lastPulseAt: now }, play: 'pulse' };
  return { state: s, play: null };
}

/** Stop now (session end, cancel, mute). */
export function cueStop(): ThinkingCueState {
  return initialThinkingCue();
}

/** Show the large "Thinking…" state on the stage. */
export function thinkingCueVisible(enabled: boolean, started: boolean, voiceState: string): boolean {
  return enabled && started && WAITING_STATES.has(voiceState);
}

export function thinkingCueLabel(lang: 'ja' | undefined): string {
  return lang === 'ja' ? '考えています…' : 'Thinking…';
}

/** `thinking_cue` embed claim: true / "true" / 1 / "1" / "on" ⇒ on; anything else off. */
export function parseThinkingCue(raw: unknown): boolean {
  if (raw === true || raw === 1) return true;
  if (typeof raw === 'string') return ['true', '1', 'on', 'yes'].includes(raw.trim().toLowerCase());
  return false;
}
