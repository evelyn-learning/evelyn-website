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

/** The words and numbers of a problem, in order, without its typesetting. */
function problemTokens(text: string): string[] {
  return text.toLowerCase().replace(/[−–]/g, '-').replace(/\\[a-z]+|[$\\{}]/g, ' ').match(/[a-z]+|-?\d+(?:\.\d+)?/g) ?? [];
}
/** The part of the plan a problem on the board belongs to: the one whose authored problem (or common-mistake
 *  question) it shares most of its wording with, pair of words by pair of words, when that is most of the shorter
 *  of the two. A problem of the tutor's own making belongs to none. */
export function goalForProblem(plan: LessonPlan, statement: string): string | null {
  const pairs = (t: string[]) => new Set(t.slice(0, -1).map((w, i) => `${w} ${t[i + 1]}`));
  const mine = pairs(problemTokens(statement));
  if (mine.size < 4) return null;
  let best: { id: string; share: number } | null = null;
  for (const seg of plan.segments) {
    const s = seg as unknown as { problem?: unknown; question?: unknown };
    const authored = typeof s.problem === 'string' ? s.problem : typeof s.question === 'string' ? s.question : '';
    const theirs = pairs(problemTokens(authored));
    if (theirs.size < 4) continue;
    const both = [...mine].filter((x) => theirs.has(x)).length;
    const share = both / Math.min(mine.size, theirs.size);
    if (share >= 0.6 && (!best || share > best.share)) best = { id: seg.id, share };
  }
  return best?.id ?? null;
}

/** A plan problem in parts, "(a) … (b) … (c) …", is one problem: the student works down it with every part in
 *  view. Put up a part at a time, part (b) was asked aloud with only (a) on the board, and part (c), asked for
 *  again later, went up alone on the recap page (AP US Government, portal-ddf273bf). Given what the tutor is
 *  putting up, this is the whole authored problem it belongs to, or null when it belongs to none in parts. */
export function wholeProblem(plan: LessonPlan, statement: string): { goal: string; statement: string } | null {
  const goal = goalForProblem(plan, statement);
  if (!goal) return null;
  const seg = plan.segments.find((s) => s.id === goal) as unknown as { problem?: unknown } | undefined;
  const authored = typeof seg?.problem === 'string' ? seg.problem.trim() : '';
  return /\(a\)[\s\S]*\(b\)/.test(authored) ? { goal, statement: authored } : null;
}

export function v2Progress(plan: LessonPlan, goals: V2State['goals']): V2Progress {
  // A part that is only told has no moment at which the student finishes it, and a tutor that does not record it
  // leaves it open for the whole lesson. Once the lesson has reached a later part, it is behind the student.
  const reachedIdx = plan.segments.reduce((last, seg, i) => (goals[seg.id]?.status ? i : last), -1);
  const done = plan.segments.map((seg, i) => {
    const status = goals[seg.id]?.status;
    return status === 'demonstrated' || status === 'skipped' || (status === 'shown' && TOLD_ONLY.has(seg.kind)) || (!status && TOLD_ONLY.has(seg.kind) && i < reachedIdx);
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
  // A part taken out of order leaves one before it that was never started, and that one is still ahead of the
  // student, unlike a part opened and left. The plan ran practice problem, then common-mistake check; the tutor
  // took the check first, and Recap was shown as the part in hand all through the practice problem
  // (AP US Government, portal-1115afec).
  const passedOver = stamped && done[stamped.i] ? plan.segments.findIndex((seg, i) => i < stamped.i && !done[i] && !goals[seg.id]?.status && plan.segments.slice(0, i).some((s2, k) => done[k] || goals[s2.id]?.status)) : -1;
  const at = stamped ? (!done[stamped.i] ? stamped.i : passedOver >= 0 ? passedOver : after >= 0 ? after : stamped.i) : open >= 0 ? open : Math.max(0, next);
  const currentSegmentId = plan.segments[at]?.id ?? '';
  const reached = (kind: string, need: (status: string | undefined) => boolean) => plan.segments.some((seg) => seg.kind === kind && need(goals[seg.id]?.status));
  const milestone: TutorMilestone | null = reached('recap', (s) => s === 'shown' || s === 'demonstrated') ? 'recap_reached'
    : reached('try_yourself', (s) => s === 'demonstrated') ? 'first_try_yourself_success'
    : reached('concept', (s) => s === 'shown' || s === 'demonstrated') ? 'first_concept_complete'
    : null;
  return { currentSegmentId, completedSegmentIds, milestone };
}
