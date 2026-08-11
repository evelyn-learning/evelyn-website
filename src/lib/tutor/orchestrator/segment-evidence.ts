/**
 * Task Phase-C fix (live-verify round) — segment-level evidence for the
 * learner model, computed identically regardless of HOW a segment became
 * "done": an explicit mark_segment_complete tool call, or the brain
 * advancing PAST it (applyResolvedAdvance's auto-mark-visited loop).
 *
 * Root cause this module fixes: before this round, evidence only emitted
 * on the explicit-complete path. A student who cleanly answered a
 * try_yourself that the tutor then advanced past (via advance_lesson, a
 * Skip-button advance, or the R44 student-jump seam) produced ZERO
 * evidence — the auto-mark-visited loop updated the progress strip but
 * never pushed a segmentOutcomes entry.
 *
 * Also root-causes the LO-attribution gate: the pre-fix caller only
 * resolved loGroupOf(segmentId) when isGeneratedPlan(plan) was true.
 * Review plans (`rev-…`, metadata.reviewPlan) follow the SAME
 * "<loId>-hook/-concept/-worked/-try" id convention as generated plans but
 * are not "generated", so their multi-LO sessions fell through to the
 * los[0] fallback and misattributed every non-first-LO outcome. This
 * module takes no isGeneratedPlan input at all — LO attribution here works
 * for ANY plan whose segment ids follow the convention (generated, review,
 * or a future kind), because the caller is the one that computes
 * loGroupId and hands it in; this module only decides whether that id is
 * USABLE (present in the plan's own LO list).
 *
 * Pure — no refs, no React, no I/O. The caller (VoiceTutorRealtime) is
 * responsible for assembling the SegmentEvidenceSignal from its own refs
 * and for the sessionAccumRef dedupe-by-segmentId + scheduleProfileFlush
 * side effects.
 */

/** Segment kinds that carry an actual assessed outcome (the student did
 *  something gradeable) vs. pure exposure. Single source for the VTR
 *  client-side gate — the server route (student-profile/[id]/route.ts)
 *  keeps its OWN copy as defense-in-depth hardening against malformed/
 *  replayed evidence; that copy is intentionally not consolidated here. */
export const EVALUATIVE_SEGMENT_KINDS: ReadonlySet<string> = new Set<string>([
  'try_yourself',
  'misconception_check',
]);

export interface SegmentEvidenceSignal {
  segmentId: string;
  /** Plan segment's `kind`, if resolvable. */
  segmentKind: string | undefined;
  /** plan.los ids, in plan order. */
  planLoIds: string[];
  /** loGroupOf(segmentId) — the CALLER computes this; this module never
   *  parses segment ids itself. */
  loGroupId: string | null;
  /** 'complete' = explicit mark_segment_complete. 'advance' = auto-marked
   *  visited by applyResolvedAdvance's skip-over loop. */
  source: 'complete' | 'advance';
  /** Streak count on THIS segment at the moment of completion/advance.
   *  undefined if the streak ref points at a different segment. */
  streakAtComplete: number | undefined;
  /** demonstratedSegmentsRef.has(segmentId) — student produced an
   *  affirmed genuine attempt on this segment (any turn, not necessarily
   *  the one that resolved the streak). */
  demonstrated: boolean;
}

export interface SegmentEvidenceOutcome {
  loId: string;
  outcome: number;
  streakAtComplete?: number;
}

export function resolveSegmentEvidence(s: SegmentEvidenceSignal): SegmentEvidenceOutcome | null {
  if (!s.segmentKind || !EVALUATIVE_SEGMENT_KINDS.has(s.segmentKind)) return null;

  // LO attribution: prefer the segment's own LO group when it resolves to
  // one of the plan's actual LOs (works for generated AND review plans —
  // both mint ids on the same "<loId>-suffix" convention). Curated
  // single-LO plans have no such convention (loGroupId will either be
  // null or an id that isn't in planLoIds); their single entry in
  // planLoIds IS the correct attribution, not a compromise. Anything else
  // (multi-LO plan, unresolvable id) is unattributable — emitting would
  // misattribute the outcome to the wrong LO, so we decline instead.
  let loId: string | null = null;
  if (s.loGroupId !== null && s.planLoIds.includes(s.loGroupId)) {
    loId = s.loGroupId;
  } else if (s.planLoIds.length === 1) {
    loId = s.planLoIds[0];
  }
  if (!loId) return null;

  const streakHit = typeof s.streakAtComplete === 'number' && s.streakAtComplete >= 1;

  if (s.source === 'complete') {
    // An explicitly-completed evaluative segment is an assessed event —
    // always emits. 1 when the deciding attempt's streak was >= 1, else
    // 0.5 ("attempted, not clearly mastered") — exactly today's
    // mark_segment_complete handler behavior, never a hardcoded 1.
    return { loId, outcome: streakHit ? 1 : 0.5, streakAtComplete: s.streakAtComplete };
  }

  // source === 'advance': the brain skipped past this segment without an
  // explicit completion call. Require attempt evidence before emitting —
  // fabricating evidence for a never-attempted skip would be exactly the
  // failure mode the auto-visit loop's progress-strip bookkeeping must
  // NOT bleed into the learner model.
  if (streakHit) {
    return { loId, outcome: 1, streakAtComplete: s.streakAtComplete };
  }
  if (s.demonstrated) {
    return { loId, outcome: 0.5, streakAtComplete: s.streakAtComplete };
  }
  return null;
}
