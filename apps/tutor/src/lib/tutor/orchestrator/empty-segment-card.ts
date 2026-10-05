// src/lib/tutor/orchestrator/empty-segment-card.ts
/**
 * show_segment_card on a segment that has NO authored card.
 *
 * WHY (live): "Next up: graphing boundary lines properly, with a problem of
 * your own to try." The brain called show_segment_card on a hook segment
 * whose `script` is null (generated plan). The runtime logged "no renderable
 * content; ignoring", the brain got no feedback, nothing was boarded and no
 * question was asked — 48 s of silence.
 *
 * Two pure decisions:
 *  (a) resolveEmptySegmentCard — what to show instead of nothing;
 *  (b) decideEmptyCardContinuation — one more trigger for the turn
 *      continuation of turn-shape.ts (same mechanism, same budget).
 */
import { MAX_CONTINUATIONS_PER_SESSION, MAX_CONTINUATIONS_PER_TURN } from './turn-shape';

export const EMPTY_CARD_BODY_MAX = 200;

export type EmptyCardSource = 'lo-description' | 'segment-title';

const clean = (s: unknown): string => (typeof s === 'string' ? s.replace(/\s+/g, ' ').trim() : '');
const clip = (s: string): string => {
  if (s.length <= EMPTY_CARD_BODY_MAX) return s;
  const cut = s.slice(0, EMPTY_CARD_BODY_MAX);
  const at = cut.lastIndexOf(' ');
  return `${(at > EMPTY_CARD_BODY_MAX * 0.6 ? cut.slice(0, at) : cut).replace(/[\s,;:—–-]+$/, '')}…`;
};

/**
 * A compact card for a segment with no authored card. Preference order:
 *  1. the description of the learning objective the segment belongs to —
 *     written for the student ("Graph linear inequalities on a coordinate
 *     plane…");
 *  2. the segment's own title;
 * The segment's `goal` is NEVER a source: a goal is a note TO the tutor
 * ("Get the student curious; do NOT reveal the rule yet. Ask what they
 * notice.") at any length, so a length cap cannot tell a presentable one
 * from a stage direction. `goal` stays in the input type so callers need not
 * change; it is ignored.
 * null ⇒ nothing presentable; the caller keeps the old ignore-and-log.
 *
 * The caller must board this as a NON-problem card (it is prose about the
 * lesson, not a problem to answer) — see the show_segment_card site.
 */
export function resolveEmptySegmentCard(input: {
  /** Kill switch (NEXT_PUBLIC_TUTOR_EMPTY_SEGMENT_CARD_FALLBACK !== 'off'). */
  enabled: boolean;
  kind: string;
  goal?: unknown;
  title?: unknown;
  /** Description of the plan LO whose id prefixes the segment id. */
  loDescription?: unknown;
}): { title: string; body: string; source: EmptyCardSource } | null {
  if (!input.enabled) return null;
  const lo = clean(input.loDescription);
  if (lo) return { title: 'Objective', body: clip(lo), source: 'lo-description' };
  const segTitle = clean(input.title);
  if (segTitle) return { title: 'Up next', body: clip(segTitle), source: 'segment-title' };
  return null;
}

/**
 * The board command for the fallback card. It reuses the problem-card
 * renderer (so it still counts as board content everywhere a rendered card
 * does) but is TAGGED: it is prose about the lesson, not a problem, and the
 * live problem tracker and the resume rehydrator must skip it — otherwise
 * the objective text becomes the active problem the answer guards and the
 * grounding gate work from.
 */
export function buildObjectiveCardCommand(card: { title: string }, statement: string): {
  action: 'showProblem';
  problem: { statement: string; format: 'free-response'; title: string };
  meta: { objectiveCard: true };
} {
  return {
    action: 'showProblem',
    problem: { statement, format: 'free-response', title: card.title },
    meta: { objectiveCard: true },
  };
}

/** True for a command built by buildObjectiveCardCommand (live or restored). */
export function isObjectiveCardCommand(cmd: unknown): boolean {
  if (!cmd || typeof cmd !== 'object') return false;
  const meta = (cmd as { meta?: unknown }).meta;
  return !!meta && typeof meta === 'object' && (meta as { objectiveCard?: unknown }).objectiveCard === true;
}

export type EmptyCardContinuationReason =
  | 'empty-segment-card'
  | 'flag-off' | 'no-empty-card' | 'turn-has-question' | 'problem-on-board'
  | 'attempt-killed' | 'other-rejections' | 'student-hold' | 'wrap-phase'
  | 'no-retry-budget' | 'turn-budget-spent' | 'student-input-pending' | 'session-budget-spent';

/**
 * Continue the turn when a segment card with no renderable content was
 * requested in this attempt and the turn ends handing the student nothing:
 * no question, no problem card. (The compact objective card of
 * resolveEmptySegmentCard is not something to respond to, so it does not
 * count.) Skip reasons and caps mirror decideTurnContinuation; the budget
 * counters are the SAME counters.
 */
export function decideEmptyCardContinuation(input: {
  /** Kill switch (NEXT_PUBLIC_TUTOR_EMPTY_SEGMENT_CARD_CONTINUE !== 'off'). */
  enabled: boolean;
  /** show_segment_card hit a segment with no authored card in this attempt. */
  emptyCardRequested: boolean;
  /** The attempt's text contains a question. */
  turnHasQuestion: boolean;
  /** A problem card (authored or the brain's own) was put up in this attempt. */
  problemPaintedThisAttempt: boolean;
  attemptKilled: boolean;
  otherRejections: number;
  retryBudgetLeft: boolean;
  continuationsThisTurn: number;
  continuationsThisSession: number;
  studentInputPending: boolean;
  studentHoldArmed: boolean;
  inWrapPhase: boolean;
}): { continue: boolean; reason: EmptyCardContinuationReason } {
  const no = (reason: EmptyCardContinuationReason) => ({ continue: false, reason });
  if (!input.enabled) return no('flag-off');
  if (!input.emptyCardRequested) return no('no-empty-card');
  if (input.attemptKilled) return no('attempt-killed');
  if (input.otherRejections > 0) return no('other-rejections');
  if (input.turnHasQuestion) return no('turn-has-question');
  if (input.problemPaintedThisAttempt) return no('problem-on-board');
  if (input.studentHoldArmed) return no('student-hold');
  if (input.inWrapPhase) return no('wrap-phase');
  if (!input.retryBudgetLeft) return no('no-retry-budget');
  if (input.continuationsThisTurn >= MAX_CONTINUATIONS_PER_TURN) return no('turn-budget-spent');
  if (input.studentInputPending) return no('student-input-pending');
  if (input.continuationsThisSession >= MAX_CONTINUATIONS_PER_SESSION) return no('session-budget-spent');
  return { continue: true, reason: 'empty-segment-card' };
}

/** Fills "Your last turn stopped too early: …" (validator-feedback.ts). */
export function describeEmptySegmentCardTurn(segmentId: string): string {
  return (
    `you called show_segment_card for segment "${segmentId}", which has no authored card — ` +
    `so no question or problem reached the board, and you ended the turn without asking the student anything. ` +
    `Do not call show_segment_card for that segment again: pose the first concrete question or problem for this ` +
    `segment yourself and put it on the board with show_problem.`
  );
}
