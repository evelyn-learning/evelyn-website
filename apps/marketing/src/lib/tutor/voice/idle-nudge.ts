/**
 * Idle re-engagement nudge (round-7g, session portal-b2fe010e 2026-07-28).
 *
 * THE HOLE THIS CLOSES: the tutor ended a full-correct confirmation turn
 * with no question and no next move ("Nailed it … between two beats.") —
 * a Rule-20 violation by the model — and NOTHING re-engaged: 7.7 minutes
 * of mutual silence until the student finally said "carry on". The prompt
 * already promises hands-off mode ends when "a long silence passes"
 * (system-prompt-builder Absorption/hands-off rules), but no client code
 * implemented it. This module is the timing/caps brain of that behavior.
 *
 * Shape: after a tutor turn is genuinely DELIVERED (left 'speaking' with
 * no recent barge-in kill — the cancel-storm recordDelivery predicate),
 * VTR arms a timer. Student activity (speech onset, a real dispatched
 * turn) restarts the clock. When it fires quiet, VTR dispatches a silent
 * bracketed directive (noise-nag precedent) so the tutor speaks ONE short
 * re-engagement line. The nudge's own delivery re-arms the timer at the
 * longer repeat gap; caps stop it from nagging a student who has walked
 * away.
 *
 * Pure decisions only — timers and refs live in VoiceTutorRealtime.
 */

/** Quiet time after a delivered tutor turn before the first nudge. Long
 *  enough for reading a dense render or working a step ("take a moment to
 *  look this over" hand-offs land well inside it); short enough that the
 *  b2fe010e 7.7-minute hole can't recur. */
export const IDLE_NUDGE_FIRST_MS = 75_000;
/** Gap before a second nudge in the SAME silence stretch. */
export const IDLE_NUDGE_REPEAT_MS = 120_000;
/** Re-poll delay when the fire moment lands busy (tutor talking, student
 *  mid-utterance/typing, brain in flight) or the tab is hidden. */
export const IDLE_NUDGE_RECHECK_MS = 15_000;
/** Nudges per silence stretch — after two unanswered check-ins, go quiet
 *  and wait for the student (nagging an empty room is worse than silence). */
export const IDLE_NUDGE_MAX_PER_STRETCH = 2;
/** Session-wide cap — a student who repeatedly goes long-quiet has a
 *  working style; stop policing it. */
export const IDLE_NUDGE_MAX_PER_SESSION = 6;

export interface IdleNudgeState {
  /** Nudges fired since the student last engaged. */
  stretchCount: number;
  /** Nudges fired this session (VTR remounts per session). */
  sessionCount: number;
}

export function createIdleNudgeState(): IdleNudgeState {
  return { stretchCount: 0, sessionCount: 0 };
}

/** Arm delay for the next timer: first nudge of a stretch waits the long
 *  threshold; follow-ups in the same stretch wait the repeat gap. */
export function idleNudgeArmDelayMs(state: IdleNudgeState): number {
  return state.stretchCount === 0 ? IDLE_NUDGE_FIRST_MS : IDLE_NUDGE_REPEAT_MS;
}

export type IdleNudgeDecision = 'fire' | 'recheck' | 'stand-down';

export function decideIdleNudge(args: {
  /** Tutor speaking / brain in flight / student mid-utterance or typing /
   *  a dispatch pending — the armStudentMarkIdleSend busy predicate. */
  busy: boolean;
  /** document.visibilityState === 'hidden' — don't speak into a
   *  backgrounded tab; re-check instead (foreground fires it). */
  hidden: boolean;
  /** R38: elapsed ≥ wrapAtMinutes on a time-boxed demo — the wrap
   *  directive owns the endgame; a nudge here collides with the one-
   *  sign-off rule. Never true for non-demo sessions. */
  wrapPhase: boolean;
  state: IdleNudgeState;
}): IdleNudgeDecision {
  if (args.wrapPhase) return 'stand-down';
  if (
    args.state.stretchCount >= IDLE_NUDGE_MAX_PER_STRETCH ||
    args.state.sessionCount >= IDLE_NUDGE_MAX_PER_SESSION
  ) {
    return 'stand-down';
  }
  if (args.busy || args.hidden) return 'recheck';
  return 'fire';
}

export function recordIdleNudgeFired(state: IdleNudgeState): void {
  state.stretchCount++;
  state.sessionCount++;
}

/** Any real student engagement (speech onset, a dispatched turn) ends the
 *  silence stretch — the next nudge waits the full first-threshold again. */
export function recordStudentEngagement(state: IdleNudgeState): void {
  state.stretchCount = 0;
}

/** Bracketed silent directive ([System note:] convention from
 *  tutor-reactions.ts): synthetic throughout the orchestrator — no student
 *  bubble, skips covers, never starts the session clock. */
export const IDLE_NUDGE_DIRECTIVE =
  '[System note: the student has been quiet for a while since your last turn. ' +
  'Re-engage gently in ONE short sentence. If your last turn asked a question, ' +
  "softly check in or offer a choice — a hint, or more time. If it handed them " +
  'time to read or work, ask how it\'s going. If it ended without a question, ' +
  'offer the next small step. Do not repeat or summarize earlier content, and ' +
  'never scold the silence.]';
