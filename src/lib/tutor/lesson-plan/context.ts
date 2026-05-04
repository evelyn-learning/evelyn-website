/**
 * Build the LessonPlanContext slice the brain sees on each turn from a
 * full LessonPlan + the active segment id. Lives separately from the
 * full plan so the brain's prompt stays bounded — only the *current*
 * segment is inlined; earlier/later segments are listed by id+kind.
 */

import type { LessonPlan, Segment } from './types';
import type { LessonPlanContext } from '@/lib/tutor/voice/claude-brain';

export function buildLessonPlanContext(
  plan: LessonPlan,
  currentSegmentId: string,
  completedSegmentIds?: ReadonlyArray<string>,
): LessonPlanContext | undefined {
  const seg: Segment | undefined = plan.segments.find((s) => s.id === currentSegmentId);
  if (!seg) return undefined;
  return {
    plan: {
      id: plan.id,
      title: plan.title,
      grade: plan.grade,
      subject: plan.subject,
      los: plan.los.map((lo) => ({ id: lo.id, description: lo.description })),
      estimatedMinutes: plan.estimatedMinutes,
    },
    currentSegmentId,
    currentSegment: seg,
    segmentIndex: plan.segments.map((s) => ({
      id: s.id,
      kind: s.kind,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      offTopic: (s as any).offTopic === true ? true : undefined,
    })),
    completedSegmentIds: completedSegmentIds ? [...completedSegmentIds] : undefined,
  };
}

/** Authored ground-truth fields the orchestrator can compare rendered
 *  tool calls against. Returned per segment when the segment kind has a
 *  canonical "this exact text MUST appear on the whiteboard" payload.
 *  Returns null for segments that are open-ended (concept, hook, recap)
 *  where there's no single correct rendering. */
export interface SegmentTruth {
  /** The authored problem / question text the brain MUST render verbatim. */
  problemText?: string;
  /** The expected final answer, when known. Used to verify the tutor's
   *  spoken claim and the rendered Final Answer card both line up. */
  expectedAnswer?: string;
  /** Segment kind, for the prompt + reject-message context. */
  kind: Segment['kind'];
}

export function getSegmentTruth(seg: Segment | undefined): SegmentTruth | null {
  if (!seg) return null;
  if (seg.kind === 'try_yourself' && typeof seg.problem === 'string' && seg.problem.length > 0) {
    return { problemText: seg.problem, expectedAnswer: seg.expectedAnswer, kind: seg.kind };
  }
  if (seg.kind === 'worked_example' && typeof seg.problem === 'string' && seg.problem.length > 0) {
    return { problemText: seg.problem, expectedAnswer: seg.answer, kind: seg.kind };
  }
  if (seg.kind === 'misconception_check' && typeof seg.question === 'string' && seg.question.length > 0) {
    return { problemText: seg.question, kind: seg.kind };
  }
  if (seg.kind === 'extension' && typeof seg.advancedQuestion === 'string' && seg.advancedQuestion.length > 0) {
    return { problemText: seg.advancedQuestion, kind: seg.kind };
  }
  return null;
}

/** Resolve an `advance_lesson` directive to the next segment id, or
 *  null when the directive can't be honored (already at start/end, or
 *  unknown id). */
export function resolveAdvanceTarget(
  plan: LessonPlan,
  currentSegmentId: string,
  to: string,
): string | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isOffTopic = (s: any): boolean => s?.offTopic === true;
  if (to === 'next') {
    const idx = plan.segments.findIndex((s) => s.id === currentSegmentId);
    if (idx < 0) return null;
    // Skip off-topic segments. They're bait / test-only segments —
    // the brain should never land on them via natural-flow advance.
    // Auto-skip past them; if no on-topic segment remains, return null
    // (treated as end-of-plan by the orchestrator).
    for (let j = idx + 1; j < plan.segments.length; j++) {
      if (!isOffTopic(plan.segments[j])) return plan.segments[j].id;
    }
    return null;
  }
  if (to === 'previous') {
    const idx = plan.segments.findIndex((s) => s.id === currentSegmentId);
    if (idx <= 0) return null;
    for (let j = idx - 1; j >= 0; j--) {
      if (!isOffTopic(plan.segments[j])) return plan.segments[j].id;
    }
    return null;
  }
  // Branch by explicit segment id — refuse if the explicit target is
  // off-topic. Brain should never explicitly request an off-topic
  // segment; if it does, treat as unresolvable.
  const target = plan.segments.find((s) => s.id === to);
  if (!target || isOffTopic(target)) return null;
  return target.id;
}
