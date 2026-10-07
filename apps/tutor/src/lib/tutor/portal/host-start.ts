/**
 * Host-driven pre-load and start (GameClass spec v1.1 §3, "Drop 2"). Pure
 * helpers; the embed page (tutor-portal/embed) wires them to the `prewarm`
 * query flag, `window.message` and `window.parent.postMessage`.
 *
 * Why: the host used to create the frame on the "Ask Tutor" click, so every
 * second of setup (config, relay, prompt) landed after the click, and the
 * student then had to tap Start inside the frame as well. With `prewarm=1`
 * the host loads the frame hidden on page open — relay connected, prompt
 * built, but NO microphone prompt, nothing spoken, no brain call — and the
 * click posts `evelyn:start`, which runs the same path as the Start tap.
 */

/** A frame left warm but unstarted this long reloads itself, so a start
 *  never runs on connections or provider tokens that went stale meanwhile. */
export const PREWARM_IDLE_MS = 30 * 60 * 1000;

/** `prewarm=1` (or `true`) on the embed URL; anything else is a normal load. */
export function isPrewarmParam(value: string | null | undefined): boolean {
  return value === '1' || value === 'true';
}

/** Accepts only `{ type: 'evelyn:start' }` (extra keys ignored). */
export function parseHostStart(data: unknown): true | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  return (data as { type?: unknown }).type === 'evelyn:start' ? true : null;
}

export type HostStartDecision =
  | { accept: true }
  | { accept: false; why: 'already_started' | 'ending' | 'token_expired' };

/** One accepted start per frame. Ignored once the student started on their
 *  own (Start tap, typed first message) or an end has begun; refused when the
 *  token's `exp` has passed (the session's server calls would be rejected). */
export function decideHostStart(state: {
  hostStartAccepted: boolean;
  sessionStarted: boolean;
  ending: boolean;
  tokenExpSec?: number;
  nowMs: number;
}): HostStartDecision {
  if (state.hostStartAccepted || state.sessionStarted) return { accept: false, why: 'already_started' };
  if (state.ending) return { accept: false, why: 'ending' };
  if (isTokenExpired(state.tokenExpSec, state.nowMs)) return { accept: false, why: 'token_expired' };
  return { accept: true };
}

/** JWT `exp` (seconds). A missing or malformed exp is not expired — the
 *  server's own verification stays the authority. */
export function tokenExpSec(payload: unknown): number | undefined {
  if (!payload || typeof payload !== 'object') return undefined;
  const exp = (payload as { exp?: unknown }).exp;
  return typeof exp === 'number' && Number.isFinite(exp) && exp > 0 ? exp : undefined;
}

export function isTokenExpired(expSec: number | undefined, nowMs: number): boolean {
  return typeof expSec === 'number' && nowMs >= expSec * 1000;
}

/** What to do when the warm frame reaches PREWARM_IDLE_MS unstarted: reload
 *  to re-warm, unless the token has expired by then (a reload would only
 *  land on the invalid-token page; stay put and refuse the start instead). */
export function prewarmIdleAction(expSec: number | undefined, nowMs: number): 'reload' | 'expired' {
  return isTokenExpired(expSec, nowMs) ? 'expired' : 'reload';
}

/** The start runs inside the frame without a frame-local gesture. Chrome,
 *  Edge and Firefox honour the parent's click through `allow="autoplay"`;
 *  some Safari versions refuse. The caller resumes a probe AudioContext and
 *  passes its state: only 'running' means audio will be heard. */
export function isAutoplayBlocked(probeState: AudioContextState | 'unavailable'): boolean {
  return probeState !== 'running' && probeState !== 'unavailable';
}
