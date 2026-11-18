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
import { TUTOR_V2_CHIP_ON_PAINT, TUTOR_V2_PART_PAGE_CHIP } from '../orchestrator/flags';
import { v2PartInHand, v2PartViewed, v2PartsDone, v2PlanLabelled } from './part-flow';

export interface V2Progress { currentSegmentId: string; completedSegmentIds: string[]; milestone: TutorMilestone | null }

/** A goal is behind the student when they have shown they can do it, when it was skipped, or, for a part that
 *  is only told (an opening idea, a concept, a worked example, a recap), when it has been shown. A practice
 *  problem that has only been put up is still in front of them. */
const TOLD_ONLY = new Set(['hook', 'concept', 'worked_example', 'recap', 'extension']);

/** `view` (Task 7a, PART_PAGE_CHIP): the board, the working level and whether the lesson has closed. With it, a plan whose
 *  every part has a name reads the part in hand off the page in view and green off the lesson having moved past a part
 *  (part-flow.ts): "the part after the last goal marked" lit "Present perfect" while the job was still being talked about
 *  (mic test 1, embed-1794882458629). Other plans, and no view, as before. `enabled` is the kill switch.
 *  Task 7g (LEVEL_CHECK_CHIP): the view's history lights the level check while it runs (part-flow.ts v2PartInHand). */
export function v2Progress(plan: LessonPlan, goals: V2State['goals'], view?: Pick<V2State, 'board' | 'workingLevel' | 'closed'> & Partial<Pick<V2State, 'history' | 'practiceSaid' | 'timeFit' | 'summaryBegunAt'>>, enabled: boolean = TUTOR_V2_PART_PAGE_CHIP): V2Progress {
  if (view && enabled && v2PlanLabelled(plan) && view.board?.pages) {
    const state = { ...view, goals };
    const cur = v2PartInHand(plan, state);
    const doneNow = v2PartsDone(plan, state, cur);
    // Task 7k (PRACTICE_ON_PART_PAGE): the lit chip follows the page in view while it is another part's page (practice they
    // asked for of an earlier part); the position and green stay as the lesson's (mic test 3, embed-1794967959470: the
    // practice ran on the Conversation page with the chip on Summary).
    const viewing = v2PartViewed(plan, state);
    return { currentSegmentId: plan.segments[viewing >= 0 ? viewing : cur]?.id ?? '', completedSegmentIds: plan.segments.filter((_, i) => doneNow[i]).map((s) => s.id), milestone: v2Milestone(plan, goals) };
  }
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
  return { currentSegmentId, completedSegmentIds, milestone: v2Milestone(plan, goals) };
}

/** Task 7n (CHIP_ON_PAINT): the progress with the lit chip read off the board as painted (`painted`: the board shown while a page
 *  this reply turns to is still held for its sentence; null: all painted). Green and the milestone stay the lesson position's
 *  (the full state). Mic test 4 (embed-1795028886172, flag 7): the Summary chip lit while the correction was still being said
 *  on the Past simple page. */
export function v2ProgressAsPainted(plan: LessonPlan, goals: V2State['goals'], view: Parameters<typeof v2Progress>[2], painted: V2State['board'] | null, enabled: boolean = TUTOR_V2_CHIP_ON_PAINT): V2Progress {
  const full = v2Progress(plan, goals, view);
  if (!enabled || !painted || !view) return full;
  return { ...full, currentSegmentId: v2Progress(plan, goals, { ...view, board: painted }).currentSegmentId };
}

function v2Milestone(plan: LessonPlan, goals: V2State['goals']): TutorMilestone | null {
  const reached = (kind: string, need: (status: string | undefined) => boolean) => plan.segments.some((seg) => seg.kind === kind && need(goals[seg.id]?.status));
  return reached('recap', (s) => s === 'shown' || s === 'demonstrated') ? 'recap_reached'
    : reached('try_yourself', (s) => s === 'demonstrated') ? 'first_try_yourself_success'
    : reached('concept', (s) => s === 'shown' || s === 'demonstrated') ? 'first_concept_complete'
    : null;
}
