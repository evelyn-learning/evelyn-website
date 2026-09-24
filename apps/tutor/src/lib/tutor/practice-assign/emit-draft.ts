/** Round 4 (E3, 2026-09-24 live check): drafts were created only client-side,
 *  so swept, short, planless-evidence and homework sessions got no practice.
 *  A COMPLETED emit that names where practice lands (practiceLocator — only
 *  the host that renders it sends one) and carries a plan, with no assignment
 *  yet, gets an end-of-session draft here; session-result's finalize then
 *  promotes it. Final fix wave (I1): for such sessions the client's final
 *  commit defers its finalize to this emit (emitOwnsPractice), so an open
 *  draft is topped up here before the finalize. Kill switch:
 *  SESSION_RESULT_DRAFT=off. */
import type { PracticeItem, SessionEmitRequest } from '@evelyn/portal-contract/v1';
import { getLessonPlan } from '@/lib/tutor/lesson-plan/store';
import { homeworkProblemsOf, homeworkLoIdFor } from '@/lib/tutor/lesson-plan/homework';
import { findAssignmentBySession } from './store';
import { assignPractice, topUpDraft, topUpAssigned } from './assign';
import type { IPracticeAssignment } from '@/models';

export const SESSION_END_REASON = 'Practice from your session.';
const DRAFT_LOS = 2;
const HOMEWORK_ANCHOR_MAX = 6;

export function shouldCreateDraftOnEmit(
  req: { status: string; lessonPlanId?: string; practiceLocator?: string },
  flag: string | undefined = process.env.SESSION_RESULT_DRAFT,
): boolean {
  return req.status === 'completed' && !!req.lessonPlanId && !!req.practiceLocator?.trim() && flag !== 'off';
}

/** Final fix wave (I1): when the session's VERIFIED embed token carries a
 *  `practice_locator` claim, the host renders practice and sends a completed
 *  session-result emit — so the EMIT owns end-of-session practice (draft →
 *  top-up → finalize → echo). The client's final profile commit must then NOT
 *  finalize the draft or run the §C.3 auto-assign: it used to land first,
 *  leaving the emit an `assigned` record it could not top up. Keyed on the
 *  claim (never a partner key); follows the emit-draft kill switch, so with
 *  SESSION_RESULT_DRAFT=off the client finalizes exactly as before. Pure. */
export function emitOwnsPractice(
  claims: Record<string, unknown> | undefined,
  flag: string | undefined = process.env.SESSION_RESULT_DRAFT,
): boolean {
  const loc = claims?.practice_locator;
  return typeof loc === 'string' && !!loc.trim() && flag !== 'off';
}

/** Safety net for a client commit that finalized anyway (an older client, a
 *  token without the claim on that request): a record the CLIENT finalized
 *  (end / pagehide / time_cap) under 10 minutes ago, not yet acknowledged, is
 *  still this session's end-of-session homework and may be topped up — never
 *  re-opened. Pure. */
export const CLIENT_FINALIZE_SOURCES: ReadonlyArray<string> = ['end', 'pagehide', 'time_cap'];
export const CLIENT_FINALIZE_TOPUP_WINDOW_MS = 10 * 60_000;
export function isRecentClientFinalize(
  rec: Pick<IPracticeAssignment, 'status' | 'finalizeSource' | 'finalizedAt' | 'acknowledgedAt'>,
  now: number = Date.now(),
): boolean {
  if (rec.status !== 'assigned' || rec.acknowledgedAt) return false;
  if (!rec.finalizeSource || !CLIENT_FINALIZE_SOURCES.includes(rec.finalizeSource)) return false;
  const at = rec.finalizedAt ? new Date(rec.finalizedAt).getTime() : NaN;
  return Number.isFinite(at) && now - at >= 0 && now - at < CLIENT_FINALIZE_TOPUP_WINDOW_MS;
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

export type EmitDraftOutcome = 'created' | 'topped_up' | 'exists' | 'no_plan' | 'empty';
export interface EmitDraftDeps {
  findAssignment: typeof findAssignmentBySession;
  getPlan: typeof getLessonPlan;
  assign: typeof assignPractice;
  topUpDraft: typeof topUpDraft;
  topUpAssigned: typeof topUpAssigned;
}
const DEFAULT_DEPS: EmitDraftDeps = { findAssignment: findAssignmentBySession, getPlan: getLessonPlan, assign: assignPractice, topUpDraft, topUpAssigned };

/** Fix round 1 — in-flight guard: two concurrent completed emits for one
 *  session (the client's End and the academy sweep) share ONE create/top-up;
 *  the second awaits the first's outcome. Entry removed when it settles. */
const inFlight = new Map<string, Promise<EmitDraftOutcome>>();

export function createDraftOnEmit(
  req: SessionEmitRequest,
  ctx: { profileId: string; partnerId: string },
  deps: EmitDraftDeps = DEFAULT_DEPS,
): Promise<EmitDraftOutcome> {
  const pending = inFlight.get(req.sessionId);
  if (pending) return pending;
  const p = createOrTopUp(req, ctx, deps).finally(() => inFlight.delete(req.sessionId));
  inFlight.set(req.sessionId, p);
  return p;
}

async function createOrTopUp(
  req: SessionEmitRequest,
  ctx: { profileId: string; partnerId: string },
  deps: EmitDraftDeps,
): Promise<EmitDraftOutcome> {
  const existing = await deps.findAssignment(req.sessionId);
  // Another student's record under a colliding sessionId is never touched. An
  // assigned (or legacy, status-less) record is left alone too — except the
  // safety net: one the client's final commit finalized moments ago
  // (isRecentClientFinalize) is topped up in place, never re-opened.
  if (existing && existing.studentId !== ctx.profileId) return 'exists';
  const recentClientFinalize = !!existing && isRecentClientFinalize(existing);
  if (existing && existing.status !== 'draft' && !recentClientFinalize) return 'exists';
  const plan = req.lessonPlanId ? await deps.getPlan(req.lessonPlanId) : null;
  if (!plan) return existing ? 'exists' : 'no_plan';
  const wrapper = homeworkLoIdFor(plan.id);
  const anchors = homeworkAnchorItems(plan);
  const topUp = { studentId: ctx.profileId, topic: plan.topic || plan.title, anchorsFor: (loId: string) => (loId === wrapper ? anchors : []) };
  if (existing) {
    // A short client draft still open: top it up; the finalize promotes it.
    // A just-client-finalized record: top it up where it stands.
    const added = recentClientFinalize
      ? await deps.topUpAssigned(existing, { partnerId: ctx.partnerId, topUp })
      : await deps.topUpDraft(existing, { partnerId: ctx.partnerId, topUp });
    return added > 0 ? 'topped_up' : 'exists';
  }
  const loIds = draftLoIdsForEmit(plan, req.losTouched);
  if (loIds.length === 0) return 'empty';
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
    topUp,
  });
  return out ? 'created' : 'empty';
}
