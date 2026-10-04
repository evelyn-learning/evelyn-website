/**
 * Should a brain-emitted show_problem be rewritten into the current
 * segment's authored show_segment_card?
 *
 * The substitution exists so the brain cannot drift from the authored
 * script. portal-704e3e01 (2026-09-04) showed its two failure modes, both of
 * which end in the orchestrator killing the turn for its own override:
 *
 *   @1111.7s  substituted into a segment already marked COMPLETE, which the
 *             show_segment_card branch then blocks by design.
 *   @1021.1s  substituted while the student had just asked for a DIFFERENT
 *             problem ("let's see a different one"), so the authored card
 *             deduped against what was already on the board.
 *
 * Substitute-same-only round. The substitution was introduced for "a slight
 * rewording of the authored problem", but nothing checked that the brain's
 * statement WAS the authored problem (the only test upstream compares the noun
 * after find/calculate/how many). A brain problem about ticket resale
 * ("15n + 80 < 500") was replaced on the board by "Solve and graph:
 * 4x + 9 ≤ 33" while the speech described tickets — three times in one
 * session; on resume the substituted card then dedup'd against the board and
 * no problem card appeared at all. Two more reasons, evaluated AFTER the
 * existing ones:
 *
 *   different-problem          the brain's statement does not pose the
 *                              authored problem → its own card is dispatched.
 *   authored-already-on-board  it IS the authored problem and that card is
 *                              the tracked active card → the call is dropped
 *                              (`drop: true`): nothing is missing.
 *
 * Pure decisions — no side effects, never throw. The pre-existing skip
 * reasons are evaluated first so existing telemetry keeps its meaning.
 */
import { sameProblemStatement } from '../whiteboard/soft-rejections';

export type SubstitutionSkipReason =
  | 'targets-diverge'
  | 'new-page-in-turn'
  | 'generate-problem-in-turn'
  | 'segment-complete'
  | 'student-asked-for-another'
  | 'different-problem'
  | 'authored-already-on-board';

export interface SubstitutionDecision {
  substitute: boolean;
  skipReason?: SubstitutionSkipReason;
  /** True only for authored-already-on-board: drop the call (no dispatch, no
   *  rejection, no kill) instead of dispatching the brain's own card. */
  drop?: boolean;
}

export function shouldSubstituteShowProblem(args: {
  /** Brain's target word disagrees with the authored one — handled upstream. */
  targetsDiverge: boolean;
  /** new_page in this turn signals a deliberate fresh-context render. */
  newPageInTurn: boolean;
  /** generate_problem in this turn means the brain is building a new one. */
  generateProblemInTurn: boolean;
  /** Segment is in completedSegmentIdsRef — show_segment_card would be blocked. */
  segmentComplete: boolean;
  /** detectAnotherProblemRequest() on the latest student turn. */
  studentAskedForAnother: boolean;
  /** Kill switch (NEXT_PUBLIC_TUTOR_SUBSTITUTE_SAME_ONLY). Off ⇒ the two
   *  inputs below are ignored and the decision is exactly the pre-round one. */
  sameOnly: boolean;
  /** sameProblemStatement(brain statement, authored statement). */
  sameProblem: boolean;
  /** The authored statement is the tracked active card. */
  authoredOnBoard: boolean;
}): SubstitutionDecision {
  if (args.targetsDiverge) return { substitute: false, skipReason: 'targets-diverge' };
  if (args.newPageInTurn) return { substitute: false, skipReason: 'new-page-in-turn' };
  if (args.generateProblemInTurn) return { substitute: false, skipReason: 'generate-problem-in-turn' };
  if (args.segmentComplete) return { substitute: false, skipReason: 'segment-complete' };
  if (args.studentAskedForAnother) return { substitute: false, skipReason: 'student-asked-for-another' };
  if (!args.sameOnly) return { substitute: true };
  if (!args.sameProblem) return { substitute: false, skipReason: 'different-problem' };
  if (args.authoredOnBoard) return { substitute: false, skipReason: 'authored-already-on-board', drop: true };
  return { substitute: true };
}

/**
 * Companion 1 — the end-of-turn auto card (`auto_card_on_advance`) appends the
 * authored card for a segment the brain advanced into without rendering it.
 * In an attempt that painted the brain's OWN problem that would put a second,
 * different problem on the board under speech about the first: the mismatch
 * the gate above removes, back by another door. False ⇒ suppress.
 */
export function shouldAutoCardAfterOwnProblem(input: {
  enabled: boolean;
  ownProblemPaintedThisAttempt: boolean;
}): boolean {
  return !(input.enabled && input.ownProblemPaintedThisAttempt);
}

/**
 * Companion 2 — the dedup branch has three early silent drops ("student
 * verifying", "retry attempt", "duplicate of the active card") that run before
 * decideSubstitutedDuplicate and never ask whether the call was a runtime
 * substitution of a DIFFERENT problem. Silently dropping that leaves the
 * student with speech about a problem that is nowhere on the board. True ⇒
 * the silent drop must be refused (fall through to the rejection that guards
 * a missing problem card).
 */
export function refuseSilentDedupDrop(input: {
  enabled: boolean;
  /** The brain's statement when the RUNTIME rewrote the call; null otherwise. */
  substitutedBrainStatement: string | null;
  authoredStatement: string;
}): boolean {
  if (!input.enabled) return false;
  if (input.substitutedBrainStatement === null) return false;
  return !sameProblemStatement(input.substitutedBrainStatement, input.authoredStatement);
}
