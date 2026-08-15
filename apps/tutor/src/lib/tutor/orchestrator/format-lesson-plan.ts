/**
 * Extracted verbatim from VoiceTutorRealtime.tsx (seam-extraction slice 1,
 * 2026-07-05). Pure module — no component state.
 */
import { getSegmentTruth } from '@/lib/tutor/lesson-plan/context';

/** Format a lesson plan + current segment into a compact context block
 *  for the realtime-2 engine. RT-2 has no brain orchestrator feeding it
 *  lessonPlanContext, so the plan is pushed straight into the session as
 *  a conversation item; this builds that item's text. Returns null when
 *  the segment id can't be resolved against the plan. */
export function formatLessonPlanForRealtime(
  plan: import('@/lib/tutor/lesson-plan/types').LessonPlan,
  currentSegmentId: string,
  completedSegmentIds: ReadonlyArray<string>,
): string | null {
  const seg = plan.segments.find((s) => s.id === currentSegmentId);
  if (!seg) return null;
  const lines: string[] = ['[ACTIVE LESSON PLAN]'];
  lines.push(`Title: ${plan.title} (grade ${plan.grade}, ~${plan.estimatedMinutes} min)`);
  if (plan.los.length > 0) {
    lines.push('Learning objectives:');
    for (const lo of plan.los) lines.push(`  - ${lo.id}: ${lo.description}`);
  }
  lines.push('Segments in order: ' + plan.segments.map((s) => `${s.id}(${s.kind})`).join(' → '));
  if (completedSegmentIds.length > 0) {
    lines.push(`Already completed: ${completedSegmentIds.join(', ')}`);
  }
  lines.push('');
  const segRec = seg as unknown as Record<string, unknown>;
  lines.push(`CURRENT SEGMENT: ${seg.id} (${seg.kind})`);
  if (typeof segRec.goal === 'string' && segRec.goal) lines.push(`Goal: ${segRec.goal}`);
  if (Array.isArray(segRec.keyIdeas) && segRec.keyIdeas.length > 0) {
    lines.push('Key ideas: ' + segRec.keyIdeas.map((k) => String(k)).join('; '));
  }
  const truth = getSegmentTruth(seg);
  if (truth?.problemText) lines.push(`Authored problem (render verbatim): ${truth.problemText}`);
  if (truth?.expectedAnswer) lines.push(`Expected answer: ${truth.expectedAnswer}`);
  lines.push('');
  lines.push(
    'Teach the CURRENT SEGMENT now. When the student finishes it, call ' +
      'mark_segment_complete for it and advance_lesson({to: "next"}) to move on. ' +
      'Do not skip ahead.',
  );
  return lines.join('\n');
}
