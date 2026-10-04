// src/lib/tutor/orchestrator/turn-shape.ts
/**
 * "Turn shape" — did a completed tutor turn give the student anything to do?
 *
 * WHY (15-minute trial, student left): the opening turn was one sentence,
 * zero tool calls, no question — it announced what the session would cover
 * and stopped. Then 59 s of silence. The opening directive already says to
 * act first and never end the turn with an empty board; nothing enforced it.
 *
 * The check is STRUCTURAL on purpose — no keyword lists, no attempt to
 * classify meaning. A turn is INCOMPLETE when all three hold:
 *   1. it made no board-writing tool call;
 *   2. it asked the student nothing (no question mark anywhere);
 *   3. it is no longer than an announcement (≤ ANNOUNCE_ONLY_MAX_SENTENCES).
 * (3) is the conservative stand-in for "delivers no content beyond announcing
 * what will be covered": a longer spoken turn may well have taught something
 * verbally, and this rule would rather miss that case than interrupt it.
 *
 * Known, accepted miss: a turn that re-recites the agenda and ends with a
 * question ("… Ready to start with the definition?") is COMPLETE by this
 * rule — it handed the floor over.
 */

export const ANNOUNCE_ONLY_MAX_SENTENCES = 3;
/** One continuation per turn … */
export const MAX_CONTINUATIONS_PER_TURN = 1;
/** … and this caps a session where the brain never paints. */
export const MAX_CONTINUATIONS_PER_SESSION = 2;

/** Count sentences by terminal punctuation followed by whitespace/end. A
 *  non-empty unterminated tail counts as one. "3.5" does not split. */
export function countSentences(text: string): number {
  const t = (text ?? '').trim();
  if (!t) return 0;
  return t
    .split(/[.!?]+(?=\s|$)/)
    .filter((s) => /[\p{L}\p{N}]/u.test(s))
    .length;
}

export type TurnShapeWhy = 'board-write' | 'question' | 'substantive-length' | 'empty' | 'announce-only';

export interface TurnShape {
  complete: boolean;
  why: TurnShapeWhy;
  sentenceCount: number;
  hasQuestion: boolean;
  boardWrites: number;
}

export function assessTurnShape(input: {
  /** The turn's spoken/written text (winning attempt). */
  text: string;
  /** Board-writing commands this turn dispatched (post-validation). */
  boardWrites: number;
}): TurnShape {
  const text = (input.text ?? '').trim();
  const sentenceCount = countSentences(text);
  const hasQuestion = /[?？]/.test(text);
  const boardWrites = Math.max(0, input.boardWrites || 0);
  const shape = (complete: boolean, why: TurnShapeWhy): TurnShape => ({ complete, why, sentenceCount, hasQuestion, boardWrites });
  if (boardWrites > 0) return shape(true, 'board-write');
  // A silent / tool-only turn is a different failure with its own guards.
  if (sentenceCount === 0) return shape(true, 'empty');
  if (hasQuestion) return shape(true, 'question');
  if (sentenceCount > ANNOUNCE_ONLY_MAX_SENTENCES) return shape(true, 'substantive-length');
  return shape(false, 'announce-only');
}

/** The reason handed to the brain (fills "Your last turn stopped too early: …"). */
export function describeIncompleteTurn(shape: TurnShape): string {
  return (
    `it made no whiteboard tool call, asked the student no question, and was only ` +
    `${shape.sentenceCount} sentence${shape.sentenceCount === 1 ? '' : 's'} long — ` +
    `the student now has nothing new on the board and nothing to respond to.`
  );
}

export type ContinuationReason =
  | 'opening-turn' | 'fallback-board'
  | 'flag-off' | 'turn-complete' | 'attempt-killed' | 'other-rejections' | 'no-retry-budget'
  | 'turn-budget-spent' | 'session-budget-spent' | 'student-input-pending' | 'not-eligible'
  // What the turn's SHAPE cannot see (review 2026-10-03):
  | 'tool-calls' | 'student-hold' | 'wrap-phase' | 'no-planned-item';

export type PlannedItemWhy =
  | 'planned' | 'no-plan' | 'no-current-segment' | 'picker-pending' | 'homework-help' | 'assessment';

/**
 * Does this session have an authored / planned first item the tutor is
 * supposed to TEACH? The continuation tells the brain to "put the first thing
 * you are teaching on the board" — that instruction only makes sense when the
 * plan supplies such a thing. Structural signals only (never the wording of
 * the turn):
 *  · no lesson plan loaded (free conversation; an open-scope session that
 *    carries no plan) ⇒ the student brings the content;
 *  · the current segment id does not resolve in the plan ⇒ nothing to point at;
 *  · a freestyle plan still waiting on the lesson picker ⇒ not expanded yet;
 *  · sessionGoal 'homework-help' ⇒ student-led even when a plan is attached
 *    (its opener invites the student's problem);
 *  · a diagnostic ⇒ it assesses, it does not teach a first item.
 * An open-scope session that DOES carry a plan (the timed demo) is a planned
 * lesson: open scope only means the student may steer away later.
 */
export function resolvePlannedFirstItem(input: {
  /** lessonPlanRef.current is non-null (the plan fetch resolved with segments). */
  planLoaded: boolean;
  /** currentSegmentIdRef names a segment of that plan. */
  currentSegmentInPlan: boolean;
  /** plan.metadata.pendingPicker === true. */
  pickerPending: boolean;
  sessionGoal: string;
  /** The session is a diagnostic / assessment (targetKind 'diagnostic'). */
  assessment: boolean;
}): { planned: boolean; why: PlannedItemWhy } {
  const no = (why: PlannedItemWhy) => ({ planned: false, why });
  if (input.sessionGoal === 'homework-help') return no('homework-help');
  if (input.assessment) return no('assessment');
  if (!input.planLoaded) return no('no-plan');
  if (input.pickerPending) return no('picker-pending');
  if (!input.currentSegmentInPlan) return no('no-current-segment');
  return { planned: true, why: 'planned' };
}

/**
 * Should the orchestrator ask the brain to CONTINUE this turn right now
 * (through the validator-retry loop), instead of going quiet?
 *
 * Eligible turns:
 *  · the session's OPENING turn, on a board with no real content (a resumed
 *    session restores its board — its pickup turn is left alone);
 *  · any later turn while the board still holds nothing but the opener
 *    fallback line.
 *
 * The shape test (no board write · no question · ≤ 3 sentences) is necessary,
 * not sufficient. A short turn with no question is the CORRECT turn when the
 * attempt acted through a non-render tool, when the student asked to be left
 * alone for a minute, when the session is wrapping up, or when there is no
 * planned item to teach — each has its own skip reason so the telemetry says
 * which one stood the continuation down.
 */
export function decideTurnContinuation(input: {
  /** Kill switch (NEXT_PUBLIC_TUTOR_TURN_CONTINUATION !== 'off'). */
  enabled: boolean;
  shape: TurnShape;
  isOpeningTurn: boolean;
  /** Board holds at least one render that is not the opener fallback. */
  boardHasRealContent: boolean;
  /** Board holds the opener fallback line and nothing else. */
  boardFallbackOnly: boolean;
  attemptKilled: boolean;
  /** Rejections already recorded for this attempt (they own the retry). */
  otherRejections: number;
  /** Another attempt is still allowed by the validator-retry cap. A granted
   *  continuation does not SPEND that budget (continuationAttemptCap), but it
   *  is never stacked on an attempt that was already the last one allowed. */
  retryBudgetLeft: boolean;
  continuationsThisTurn: number;
  continuationsThisSession: number;
  /** A student utterance is already queued behind this turn. */
  studentInputPending: boolean;
  /** Tool calls of ANY kind this attempt made — renders, generate_problem,
   *  advance_lesson, close/wrap tools, hold_for_student, server-rejected or
   *  server-dropped calls. The continuation requires ZERO. */
  toolCallsThisAttempt: number;
  /** A student hold is pending or active ("give me a minute"). */
  studentHoldArmed: boolean;
  /** resolvePlannedFirstItem(...).planned. */
  hasPlannedFirstItem: boolean;
  /** The turn carries a wrap signal / the session is in its closing phase. */
  inWrapPhase: boolean;
}): { continue: boolean; reason: ContinuationReason } {
  const no = (reason: ContinuationReason) => ({ continue: false, reason });
  if (!input.enabled) return no('flag-off');
  if (input.shape.complete) return no('turn-complete');
  if (input.attemptKilled) return no('attempt-killed');
  if (input.otherRejections > 0) return no('other-rejections');
  if ((input.toolCallsThisAttempt || 0) > 0) return no('tool-calls');
  if (input.studentHoldArmed) return no('student-hold');
  if (input.inWrapPhase) return no('wrap-phase');
  if (!input.hasPlannedFirstItem) return no('no-planned-item');
  if (!input.retryBudgetLeft) return no('no-retry-budget');
  if (input.continuationsThisTurn >= MAX_CONTINUATIONS_PER_TURN) return no('turn-budget-spent');
  if (input.studentInputPending) return no('student-input-pending');
  const opening = input.isOpeningTurn && !input.boardHasRealContent;
  const fallbackBoard = !input.isOpeningTurn && input.boardFallbackOnly;
  if (!opening && !fallbackBoard) return no('not-eligible');
  if (input.continuationsThisSession >= MAX_CONTINUATIONS_PER_SESSION) return no('session-budget-spent');
  return { continue: true, reason: opening ? 'opening-turn' : 'fallback-board' };
}

/**
 * The attempt-index cap of the validator-retry loop for this turn. A granted
 * continuation is NOT a correction, so it must not eat one of the validator
 * retries: the cap rises by the continuations granted (at most
 * MAX_CONTINUATIONS_PER_TURN), leaving the continued content the full
 * correction budget.
 */
export function continuationAttemptCap(input: { maxValidatorRetries: number; continuationsThisTurn: number }): number {
  const extra = Math.min(MAX_CONTINUATIONS_PER_TURN, Math.max(0, Math.floor(input.continuationsThisTurn || 0)));
  return input.maxValidatorRetries + extra;
}

/**
 * Chat-bubble text while a continuation streams: what was already delivered,
 * then the new text. Nothing is being revised, so the delivered part is never
 * dimmed, removed or rewritten.
 */
export function appendContinuationText(delivered: string, streamed: string): string {
  const a = (delivered ?? '').trim();
  const b = (streamed ?? '').trim();
  if (!a) return b;
  if (!b) return a;
  return `${a} ${b}`;
}
