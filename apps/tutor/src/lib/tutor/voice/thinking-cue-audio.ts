/**
 * Synthesized sounds for the thinking cue (thinking-cue.ts). Web Audio only —
 * no asset files, no TTS. Kept quiet (peak gain ≈ 0.06) and short so echo
 * cancellation removes it and the perception mic never hears it as speech.
 *
 * Own AudioContext, created and resumed on the session's start tap (a user
 * gesture — Safari keeps a context made outside one suspended).
 */

let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    try { ctx = new Ctor(); } catch { return null; }
  }
  if (ctx.state === 'suspended') void ctx.resume().catch(() => { /* resumed on the next gesture */ });
  return ctx;
}

/** Call from the start tap so the context exists inside a user gesture. */
export function primeThinkingCueAudio(): void {
  context();
}

function tone(c: AudioContext, freq: number, start: number, dur: number, peak: number): void {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(start);
  osc.stop(start + dur + 0.02);
}

/** "Got your turn": two soft rising notes, ~220 ms in all. */
export function playTurnChime(): void {
  const c = context();
  if (!c) return;
  const t = c.currentTime + 0.01;
  tone(c, 660, t, 0.11, 0.06);
  tone(c, 990, t + 0.09, 0.13, 0.05);
}

/** "Still thinking": one very soft low note. */
export function playThinkingPulse(): void {
  const c = context();
  if (!c) return;
  tone(c, 440, c.currentTime + 0.01, 0.18, 0.025);
}
