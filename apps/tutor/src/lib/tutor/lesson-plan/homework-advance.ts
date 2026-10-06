/**
 * Homework-help plans: what an `advance_lesson` past the homework segment
 * means. Pure decision; exercised by scripts/test-homework-advance.ts.
 *
 * A homework plan is two segments — `homework` (ALL of the student's own
 * problems, worked one at a time) and `recap`. applyResolvedAdvance marks
 * every segment it moves past as completed, which is right for a taught
 * lesson (hook → concept → …) and wrong here: "past the homework segment" is
 * "past every problem".
 *
 * Live 2026-10-06 (portal-897212b5). At 6:31 the tutor accepted a recap
 * detour and called advance_lesson({to:"free"}) — as the recap prompt tells
 * it to — and at 9:15 it called advance_lesson({to:"next"}) to come back —
 * also as the prompt tells it to. "next" was resolved from the segment the
 * student had left (`homework`) to the plan's `recap` segment, `homework`
 * was auto-marked completed, and from then on progress read "homework
 * completed, recap current" with the one problem unsolved (the session ran
 * another thirteen minutes on it).
 *
 * Rules, for a homework plan only, when the advance would move PAST the
 * homework segment:
 *   • returning from a free-mode detour → RESUME the homework segment (that
 *     is what "return to the lesson" means when the lesson is one segment);
 *   • the brain has marked the homework segment complete (mark_segment_complete
 *     — its explicit claim that the problems' answers were reached) → allow;
 *   • the student asked to stop / skip / move on → allow, but the segment is
 *     NOT recorded as completed (the progress contract has no "skipped"
 *     status, so it is simply left incomplete and an event records the skip);
 *   • otherwise → soft-reject with what to do instead.
 * The session can always leave: the student's own request, or the brain's
 * explicit completion, both pass.
 */

export interface HomeworkAdvanceInput {
  /** The active plan is a homework-help plan (it carries homework problems). */
  isHomeworkPlan: boolean;
  /** Ordered segment ids of the plan. */
  segmentIds: ReadonlyArray<string>;
  /** Kind per segment id (to find the homework segment: the plan's first
   *  non-recap segment). */
  segmentKinds: Readonly<Record<string, string | undefined>>;
  /** Segment the advance resolves FROM (the cursor, or the stashed pre-free
   *  segment when the cursor is released). */
  fromSegId: string;
  /** Segment the advance resolved TO. */
  nextSegId: string;
  /** True when the plan cursor is currently released (free mode) — i.e. this
   *  advance is the return from a detour. */
  returningFromFree: boolean;
  completedSegmentIds: ReadonlySet<string> | ReadonlyArray<string>;
  /** Segment ids being marked complete in this same tool batch. */
  markedCompleteThisBatch?: ReadonlyArray<string>;
  /** The student's words for this turn (or the runtime marker). */
  studentText?: string | null;
  /** 1-based position / count of the homework problems, for the message. */
  current?: number;
  total?: number;
}

export type HomeworkAdvanceDecision =
  | { action: 'allow'; why: 'not_homework' | 'not_past_homework' | 'marked_complete' }
  | { action: 'allow_skipped'; homeworkSegId: string }
  | { action: 'resume'; homeworkSegId: string }
  | { action: 'reject'; homeworkSegId: string; reason: string };

/** The student asking to leave the problem / the homework / the session. A
 *  Skip-button marker counts. Narrow on purpose: "let's finish this one
 *  first" and "what's next in this step?" are not requests to move on. */
const MOVE_ON_RE = new RegExp(
  [
    '\\[Skip-button-clicked', 'clicked Skip-ahead',
    "\\b(?:let'?s|can we|could we|i want to|i'd like to|i would like to|please|just)\\s+(?:skip|move on|stop|wrap(?: it)? up|end|finish up|call it)\\b",
    '\\bskip (?:this|it|that|ahead|the (?:problem|question|rest))\\b',
    '\\bmove on\\b',
    '\\bnext (?:problem|question|one)\\b',
    "\\b(?:i'?m|we'?re|i am|we are) done\\b",
    "\\bthat'?s (?:enough|all|it) for (?:today|now)\\b",
    '\\b(?:stop|end|wrap up|finish) (?:here|now|for today|the session|the lesson)\\b',
    "\\bi (?:have|need|gotta|got) to (?:go|leave|stop)\\b",
    '\\b(?:bye|goodbye|good night|see you)\\b',
  ].join('|'),
  'i',
);

export function isMoveOnRequest(text: string | null | undefined): boolean {
  return !!text && MOVE_ON_RE.test(text);
}

export function decideHomeworkAdvance(input: HomeworkAdvanceInput): HomeworkAdvanceDecision {
  if (!input.isHomeworkPlan) return { action: 'allow', why: 'not_homework' };
  const ids = input.segmentIds;
  // The homework segment: the first segment that is not a recap.
  const homeworkSegId = ids.find((id) => input.segmentKinds[id] !== 'recap') ?? '';
  if (!homeworkSegId) return { action: 'allow', why: 'not_homework' };
  const homeworkIdx = ids.indexOf(homeworkSegId);
  const fromIdx = ids.indexOf(input.fromSegId);
  const nextIdx = ids.indexOf(input.nextSegId);
  // Only an advance that starts at (or before) the homework segment and lands
  // beyond it would complete it.
  if (nextIdx <= homeworkIdx || fromIdx > homeworkIdx) return { action: 'allow', why: 'not_past_homework' };

  const completed = input.completedSegmentIds instanceof Set
    ? input.completedSegmentIds as ReadonlySet<string>
    : new Set(input.completedSegmentIds as ReadonlyArray<string>);
  if (completed.has(homeworkSegId) || (input.markedCompleteThisBatch ?? []).includes(homeworkSegId)) {
    return { action: 'allow', why: 'marked_complete' };
  }
  if (isMoveOnRequest(input.studentText)) return { action: 'allow_skipped', homeworkSegId };
  if (input.returningFromFree) return { action: 'resume', homeworkSegId };

  const total = input.total ?? 0;
  const position = total > 0 && input.current ? ` (problem ${Math.min(Math.max(input.current, 1), total)} of ${total} is in play)` : '';
  return {
    action: 'reject',
    homeworkSegId,
    reason:
      `advance_lesson: this is a homework session and "${homeworkSegId}" is the segment that holds ALL of the student's problems${position}. ` +
      `Moving past it would record the homework as completed. The lesson position has NOT moved. ` +
      `If you only want to review an idea or take a short detour, do it here without advancing (or advance_lesson({to:"free"}) and later advance_lesson({to:"next"}), which returns to this segment). ` +
      `If every problem's final answer has been reached and confirmed with the student, call mark_segment_complete({segmentId:"${homeworkSegId}"}) and then advance_lesson again. ` +
      `If the student asks to stop or move on, advance on that turn and it will go through as a skip.`,
  };
}
