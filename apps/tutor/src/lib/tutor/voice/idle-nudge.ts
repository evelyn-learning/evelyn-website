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
  /** R58 student-declared hold ("wait until I say candle") — the student
   *  ASKED for the silence, so nudging is exactly what they asked us not
   *  to do. The hold's own single 5-minute check-in replaces it. */
  hold?: boolean;
  state: IdleNudgeState;
}): IdleNudgeDecision {
  if (args.wrapPhase) return 'stand-down';
  if (args.hold) return 'stand-down';
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

/**
 * R49b nudge directive v2 (live 2026-08-20, portal-2d53e403 at 1003.4s).
 *
 * The tutor asked "What's a common denominator for fourths and halves?" at
 * 911.2s. After 95 seconds of student silence the idle nudge fired and the
 * tutor said:
 *
 *   "Fourths — since half is just two fourths. No rush, Praveen — take a
 *    look at that. Once both sides speak 'fourths,' who's pulling harder —
 *    negative one fourth or positive two fourths?"
 *
 * It answered its own outstanding question and then advanced to the next
 * one. The student, who was still working on the first, was skipped
 * entirely — and this happened on a session with six nudges.
 *
 * What makes this worth a rule rather than a tweak: v1's intent was ALREADY
 * correct. It says "If your last turn asked a question, softly check in or
 * offer a choice — a hint, or more time." The brain read "a hint" as
 * licence to supply the answer, because a hint that gives the answer is
 * still, technically, a hint. The failure was not a missing instruction but
 * an under-specified one, so v2 states the prohibition directly instead of
 * relying on "hint" carrying it by implication.
 *
 * v2 also forbids advancing to a new question. A nudge that moves the
 * lesson forward is not a nudge — it is a turn the student never got to
 * take, and it converts their thinking time into a skipped question.
 */
export interface IdleNudgeDirectiveOpts {
  /** TUTOR_IDLE_NUDGE_V2. Absent/false ⇒ IDLE_NUDGE_DIRECTIVE verbatim. */
  v2?: boolean;
}

export function idleNudgeDirective(opts: IdleNudgeDirectiveOpts): string {
  if (!opts?.v2) return IDLE_NUDGE_DIRECTIVE;
  return (
    '[System note: the student has been quiet for a while since your last turn. ' +
    'Re-engage gently in ONE short sentence. The question you last asked is ' +
    'STILL OUTSTANDING and still theirs to answer — DO NOT ANSWER IT, and do not ' +
    'say the word, value, or term you asked them for. Silence means they are ' +
    'thinking, not that they have given up. Offer a choice: more time, or a hint. ' +
    'A hint must NARROW the search — point at what to look at, or rule something ' +
    'out — and must not give the answer inside it. Do not ask a NEW question and ' +
    'do not move on to the next step; this turn exists only to hand the same ' +
    'question back warmly. If your last turn handed them something to read or ' +
    "work through, ask how it's going. If it ended without a question, offer the " +
    'next small step. Do not repeat or summarize earlier content, and never scold ' +
    'the silence.]'
  );
}
