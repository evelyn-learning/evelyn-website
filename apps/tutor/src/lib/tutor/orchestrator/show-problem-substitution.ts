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
 * Pure decision — no side effects, never throws. The two pre-existing skip
 * reasons are evaluated first so existing telemetry keeps its meaning.
 */
export type SubstitutionSkipReason =
  | 'targets-diverge'
  | 'new-page-in-turn'
  | 'generate-problem-in-turn'
  | 'segment-complete'
  | 'student-asked-for-another';

export interface SubstitutionDecision {
  substitute: boolean;
  skipReason?: SubstitutionSkipReason;
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
}): SubstitutionDecision {
  if (args.targetsDiverge) return { substitute: false, skipReason: 'targets-diverge' };
  if (args.newPageInTurn) return { substitute: false, skipReason: 'new-page-in-turn' };
  if (args.generateProblemInTurn) return { substitute: false, skipReason: 'generate-problem-in-turn' };
  if (args.segmentComplete) return { substitute: false, skipReason: 'segment-complete' };
  if (args.studentAskedForAnother) return { substitute: false, skipReason: 'student-asked-for-another' };
  return { substitute: true };
}
