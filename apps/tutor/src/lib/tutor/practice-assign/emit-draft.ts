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
import { logPracticeGenEvent } from '@/lib/tutor/portal/practice-gen';
import { loHasDrawingOnlyTask } from '@/lib/tutor/portal/practice';
import { losWithoutPractice, reportLosWithoutPractice } from './top-up';
import connectDB from '@core/db';
import { TutorSession } from '@/models/TutorSession';

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

/** `empty:<why>` (2026-10-02): `no_los` = the plan gave no LO to draft for;
 *  `no_items` = assignPractice returned null — almost always retrieval +
 *  generation produced nothing to assign (the `[practice-gen]
 *  practice_gen_empty` / `practice_gen_gate_failed` lines logged just before
 *  say why); assignPractice also returns null on a draft-upsert owner
 *  mismatch (a race: the common owner mismatch returns 'exists' above). session-result logs these as
 *  `outcome=empty why=<why>`. */
export type EmitDraftOutcome = 'created' | 'topped_up' | 'exists' | 'no_plan' | 'empty:no_los' | 'empty:no_items';
export interface EmitDraftDeps {
  findAssignment: typeof findAssignmentBySession;
  getPlan: typeof getLessonPlan;
  assign: typeof assignPractice;
  topUpDraft: typeof topUpDraft;
  topUpAssigned: typeof topUpAssigned;
  /** Appends the practice outcome events to the session's stored debug
   *  events. Optional: injected deps without it record nothing (tests).
   *  Called fire-and-forget (never awaited). `ctx.partnerId` is the emit's
   *  VERIFIED partner — what the stored session is matched on. */
  recordSessionEvents?: (session: { sessionId: string; studentId: string }, events: PracticeSessionEvent[], ctx?: { partnerId: string }) => Promise<void> | void;
}

/** A practice outcome worth keeping on the session (2026-10-04). Until now
 *  `practice_gen_empty` / `practice_gen_gate_failed` existed only as server
 *  log lines: the session's own debug events (what the admin replay and
 *  scripts/inspect-tutor-session.ts show) carried the client's mid-session
 *  `practice_draft_empty` and nothing about the end-of-session attempt. */
export interface PracticeSessionEvent { type: string; message: string }
export const PRACTICE_SESSION_EVENT_TYPES: ReadonlyArray<string> = ['practice_gen_empty', 'practice_gen_gate_failed', 'practice_draft_empty'];
const PRACTICE_SESSION_EVENT_MAX = 20;

/** A session never accumulates more than this many events of
 *  PRACTICE_SESSION_EVENT_TYPES from this path (repeated / swept emits). */
export const PRACTICE_SESSION_EVENTS_PER_SESSION_MAX = 40;

/**
 * The write that appends this emit's practice events to the session's stored
 * debug events — or null when there is nothing safe to write. Pure.
 *
 * MATCH: sessionId + the partner id the session itself stores
 * (`sourcePartnerId`, stamped on insert from the embed config; the same
 * tenancy key /api/portal/v1/sessions/summary uses). NOT the student id:
 * `TutorSession.studentId` is the embed token's `student_id` as the BROWSER
 * posted it (optional — absent on sessions whose page sent none, cut at 200
 * chars), while the emit's `studentId` is the external id the partner's
 * SERVER sent with session-result. Both normally name the same student, but
 * nothing guarantees it, and a mismatch silently dropped every event. Session
 * ids are known to collide across tenants, so sessionId alone is never
 * enough: no partner id ⇒ no write.
 *
 * CAP: the `$expr` makes the append conditional on the session holding fewer
 * than PRACTICE_SESSION_EVENTS_PER_SESSION_MAX events of these types — one
 * atomic update, no read.
 */
export function buildSessionEventsWrite(
  session: { sessionId: string; partnerId: string },
  events: PracticeSessionEvent[],
  now: Date = new Date(),
): {
  filter: { sessionId: string; sourcePartnerId: string; $expr: Record<string, unknown> };
  update: { $push: { debugEvents: { $each: Array<{ type: string; message: string; timestamp: Date }> } } };
} | null {
  if (!session?.sessionId || !session.partnerId || !Array.isArray(events) || events.length === 0) return null;
  return {
    filter: {
      sessionId: session.sessionId,
      sourcePartnerId: session.partnerId,
      $expr: {
        $lt: [
          { $size: { $filter: { input: { $ifNull: ['$debugEvents', []] }, as: 'e', cond: { $in: ['$$e.type', [...PRACTICE_SESSION_EVENT_TYPES]] } } } },
          PRACTICE_SESSION_EVENTS_PER_SESSION_MAX,
        ],
      },
    },
    update: { $push: { debugEvents: { $each: events.map((e) => ({ type: e.type, message: e.message.slice(0, 500), timestamp: now })) } } },
  };
}

/** Best-effort `$push` onto TutorSession.debugEvents — the same array the
 *  client's debug events land in (session-usage route). See
 *  buildSessionEventsWrite for the match and the cap. Never an upsert, never
 *  throws. */
async function mongoRecordSessionEvents(session: { sessionId: string; studentId: string }, events: PracticeSessionEvent[], ctx?: { partnerId: string }): Promise<void> {
  const write = buildSessionEventsWrite({ sessionId: session.sessionId, partnerId: ctx?.partnerId ?? '' }, events);
  if (!write) return;
  try {
    await connectDB();
    await TutorSession.updateOne(write.filter, write.update);
  } catch (err) {
    console.warn('[practice-emit] could not record practice events on the session:', (err as Error)?.message ?? err);
  }
}

const DEFAULT_DEPS: EmitDraftDeps = {
  findAssignment: findAssignmentBySession, getPlan: getLessonPlan, assign: assignPractice, topUpDraft, topUpAssigned,
  recordSessionEvents: mongoRecordSessionEvents,
};

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
  // Practice outcomes of THIS emit: logged as before, and kept so they can be
  // stored on the session once the attempt is over. That write is
  // FIRE-AND-FORGET: this runs on the session-result request path, and a
  // slow or failing debug-event append must neither delay nor fail the emit.
  const events: PracticeSessionEvent[] = [];
  const onDebugEvent = (type: string, message: string): void => {
    if (type.startsWith('practice_gen')) logPracticeGenEvent(type, message);
    if (PRACTICE_SESSION_EVENT_TYPES.includes(type) && events.length < PRACTICE_SESSION_EVENT_MAX) events.push({ type, message });
  };
  try {
    return await createOrTopUpInner(req, ctx, deps, onDebugEvent);
  } finally {
    if (events.length > 0 && deps.recordSessionEvents) {
      const logFailure = (err: unknown): void => {
        console.warn('[practice-emit] session-event write failed:', (err as Error)?.message ?? err);
      };
      try {
        void Promise.resolve(deps.recordSessionEvents({ sessionId: req.sessionId, studentId: req.studentId }, events, { partnerId: ctx.partnerId }))
          .catch(logFailure);
      } catch (err) {
        logFailure(err);
      }
    }
  }
}

async function createOrTopUpInner(
  req: SessionEmitRequest,
  ctx: { profileId: string; partnerId: string },
  deps: EmitDraftDeps,
  onDebugEvent: (type: string, message: string) => void,
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
  const topUp = {
    studentId: ctx.profileId, topic: plan.topic || plan.title, anchorsFor: (loId: string) => (loId === wrapper ? anchors : []),
    onDebugEvent,
    // The plan's try-yourselves for an LO that are pure drawing tasks are never
    // served and never anchors; say so, so the generator writes a typed/choice
    // question on the same skill (practice-gen.ts drawing-LO branch).
    drawingTasksFor: (loId: string) => loHasDrawingOnlyTask(plan, loId),
  };
  if (existing) {
    // A short client draft still open: top it up; the finalize promotes it.
    // A just-client-finalized record: top it up where it stands.
    const added = recentClientFinalize
      ? await deps.topUpAssigned(existing, { partnerId: ctx.partnerId, topUp })
      : await deps.topUpDraft(existing, { partnerId: ctx.partnerId, topUp });
    // The record only lists LOs that HAVE items, and the top-up only adds to
    // its first one: a touched LO that is not in it ended with no practice.
    const planLoIds = new Set(plan.los.map((l) => l.id));
    if (req.losTouched.some((id) => planLoIds.has(id))) {
      const titleOf = (loId: string): string => {
        const lo = plan.los.find((l) => l.id === loId);
        return lo?.shortTitle ?? lo?.description ?? loId;
      };
      reportLosWithoutPractice(
        losWithoutPractice(draftLoIdsForEmit(plan, req.losTouched).map((loId) => ({ loId, title: titleOf(loId) })), existing.los),
        { sessionId: req.sessionId, why: 'not in the existing assignment; no bank items' },
        onDebugEvent,
      );
    }
    return added > 0 ? 'topped_up' : 'exists';
  }
  const loIds = draftLoIdsForEmit(plan, req.losTouched);
  if (loIds.length === 0) return 'empty:no_los';
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
  return out ? 'created' : 'empty:no_items';
}
