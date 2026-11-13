/**
 * Tutor brain v2 — where the lesson stands, in the terms a partner's portal already reads.
 *
 * v1 reports the current segment, the completed segments and three milestones; the academy shows them as the
 * lesson's phases, marks a lesson done and decides when a trial has earned its paywall. v2 keeps a status for
 * each of the plan's goals under the same segment ids (plan-map.ts), so the same report is read off that.
 */
import type { LessonPlan } from '../lesson-plan/types';
import type { TutorMilestone } from '../orchestrator/types';
import type { V2State } from './types';

export interface V2Progress { currentSegmentId: string; completedSegmentIds: string[]; milestone: TutorMilestone | null }

/** A goal is behind the student when they have shown they can do it, when it was skipped, or, for a part that
 *  is only told (an opening idea, a concept, a worked example, a recap), when it has been shown. A practice
 *  problem that has only been put up is still in front of them. */
const TOLD_ONLY = new Set(['hook', 'concept', 'worked_example', 'recap', 'extension']);

export function v2Progress(plan: LessonPlan, goals: V2State['goals']): V2Progress {
  const done = plan.segments.map((seg) => {
    const status = goals[seg.id]?.status;
    return status === 'demonstrated' || status === 'skipped' || (status === 'shown' && TOLD_ONLY.has(seg.kind));
  });
  const completedSegmentIds = plan.segments.filter((_, i) => done[i]).map((s) => s.id);
  // The part in hand: one the tutor has opened and not finished, else the one after the furthest finished.
  // The part in hand is where the tutor last was: the goal marked most recently when it is still open, else the
  // first open one after it, else that goal itself. Read as "the first part opened and not finished", a problem
  // left half-done at minute 5 was still shown as the part in hand at the recap (algebra, embed-1794595194384).
  const stamped = plan.segments.map((seg, i) => ({ i, at: goals[seg.id]?.at ?? 0 })).filter((x) => x.at > 0).sort((a, b) => b.at - a.at || b.i - a.i)[0];
  const open = plan.segments.findIndex((seg, i) => !done[i] && goals[seg.id]?.status === 'shown');
  const next = Math.min(done.lastIndexOf(true) + 1, plan.segments.length - 1);
  const after = stamped ? done.findIndex((d, i) => i > stamped.i && !d) : -1;
  const at = stamped ? (!done[stamped.i] ? stamped.i : after >= 0 ? after : stamped.i) : open >= 0 ? open : Math.max(0, next);
  const currentSegmentId = plan.segments[at]?.id ?? '';
  const reached = (kind: string, need: (status: string | undefined) => boolean) => plan.segments.some((seg) => seg.kind === kind && need(goals[seg.id]?.status));
  const milestone: TutorMilestone | null = reached('recap', (s) => s === 'shown' || s === 'demonstrated') ? 'recap_reached'
    : reached('try_yourself', (s) => s === 'demonstrated') ? 'first_try_yourself_success'
    : reached('concept', (s) => s === 'shown' || s === 'demonstrated') ? 'first_concept_complete'
    : null;
  return { currentSegmentId, completedSegmentIds, milestone };
}
