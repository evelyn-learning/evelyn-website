/** Round 4 (E3, 2026-09-24 live check): drafts were created only client-side,
 *  so swept, short, planless-evidence and homework sessions got no practice.
 *  A COMPLETED emit that names where practice lands (practiceLocator — only
 *  the host that renders it sends one) and carries a plan, with no assignment
 *  yet, gets an end-of-session draft here; session-result's finalize then
 *  promotes it. Kill switch: SESSION_RESULT_DRAFT=off. */
import type { PracticeItem, SessionEmitRequest } from '@evelyn/portal-contract/v1';
import { getLessonPlan } from '@/lib/tutor/lesson-plan/store';
import { homeworkProblemsOf, homeworkLoIdFor } from '@/lib/tutor/lesson-plan/homework';
import { findAssignmentBySession } from './store';
import { assignPractice } from './assign';

export const SESSION_END_REASON = 'Practice from your session.';
const DRAFT_LOS = 2;
const HOMEWORK_ANCHOR_MAX = 6;

export function shouldCreateDraftOnEmit(
  req: { status: string; lessonPlanId?: string; practiceLocator?: string },
  flag: string | undefined = process.env.SESSION_RESULT_DRAFT,
): boolean {
  return req.status === 'completed' && !!req.lessonPlanId && !!req.practiceLocator?.trim() && flag !== 'off';
}

type PlanLike = { id: string; los: Array<{ id: string }>; metadata?: Record<string, unknown> };

/** Homework plan → its wrapper LO; else touched plan LOs, else the first two. Pure. */
export function draftLoIdsForEmit(plan: PlanLike, losTouched: string[]): string[] {
  if (homeworkProblemsOf(plan)) return [homeworkLoIdFor(plan.id)];
  const planIds = new Set(plan.los.map((l) => l.id));
  const touched = [...new Set(losTouched)].filter((id) => planIds.has(id) && !id.startsWith('prereq:'));
  return (touched.length ? touched : plan.los.map((l) => l.id)).slice(0, DRAFT_LOS);
}

/** The worksheet's own problems as generation anchors (never served). Pure. */
export function homeworkAnchorItems(plan: { id: string; metadata?: Record<string, unknown> }): PracticeItem[] {
  return (homeworkProblemsOf(plan) ?? []).slice(0, HOMEWORK_ANCHOR_MAX).map((p) => ({
    id: `${plan.id}::homework-${p.n}`,
    source: 'plan-try-yourself' as const,
    problemText: p.text,
    loId: homeworkLoIdFor(plan.id),
  }));
}

export type EmitDraftOutcome = 'created' | 'exists' | 'no_plan' | 'empty';
export interface EmitDraftDeps {
  findAssignment: typeof findAssignmentBySession;
  getPlan: typeof getLessonPlan;
  assign: typeof assignPractice;
}
const DEFAULT_DEPS: EmitDraftDeps = { findAssignment: findAssignmentBySession, getPlan: getLessonPlan, assign: assignPractice };

export async function createDraftOnEmit(
  req: SessionEmitRequest,
  ctx: { profileId: string; partnerId: string },
  deps: EmitDraftDeps = DEFAULT_DEPS,
): Promise<EmitDraftOutcome> {
  if (await deps.findAssignment(req.sessionId)) return 'exists';
  const plan = req.lessonPlanId ? await deps.getPlan(req.lessonPlanId) : null;
  if (!plan) return 'no_plan';
  const loIds = draftLoIdsForEmit(plan, req.losTouched);
  if (loIds.length === 0) return 'empty';
  const wrapper = homeworkLoIdFor(plan.id);
  const anchors = homeworkAnchorItems(plan);
  const out = await deps.assign({
    profileId: ctx.profileId,
    partnerId: ctx.partnerId,
    externalStudentId: req.studentId,
    sessionId: req.sessionId,
    lessonPlanId: req.lessonPlanId,
    courseId: req.courseId,
    loIds,
    reason: SESSION_END_REASON,
    locator: req.practiceLocator,
    subject: req.subject,
    auto: true,
    status: 'draft',
    trigger: 'session_end',
    topUp: { studentId: ctx.profileId, topic: plan.topic || plan.title, anchorsFor: (loId) => (loId === wrapper ? anchors : []) },
  });
  return out ? 'created' : 'empty';
}
