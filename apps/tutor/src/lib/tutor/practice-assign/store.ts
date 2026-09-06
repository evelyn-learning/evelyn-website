import { randomUUID } from 'node:crypto';
import connectDB from '@core/db';
import { PracticeAssignmentModel, type IPracticeAssignment, type IPracticeAssignmentLo } from '@/models';

const MS_PER_DAY = 86_400_000;

export type FinalizeSource = 'close_tool' | 'end' | 'pagehide' | 'time_cap' | 'sweep';
export const DRAFT_MAX_LOS = 2;

export async function upsertAssignment(
  a: Omit<IPracticeAssignment, '_id' | 'createdAt'> & { _id?: string },
): Promise<IPracticeAssignment> {
  await connectDB();
  const existing = await PracticeAssignmentModel.findOne({ sessionId: a.sessionId }).lean();
  const _id = existing?._id ?? a._id ?? randomUUID();
  await PracticeAssignmentModel.updateOne(
    { _id },
    { $set: { ...a, _id }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true },
  );
  return (await PracticeAssignmentModel.findById(_id).lean()) as IPracticeAssignment;
}

export async function findAssignmentBySession(sessionId: string): Promise<IPracticeAssignment | null> {
  await connectDB();
  return (await PracticeAssignmentModel.findOne({ sessionId }).lean()) as IPracticeAssignment | null;
}

/**
 * Fix round 1 (Critical C1) — course-id wildcard for the assigned-practice
 * read. Neither author path (tool-time `practice-assign` route, commit-time
 * fallback) currently stamps `courseId` on every record, so a strict-equals
 * `courseId` filter would return `[]` for every unstamped assignment even
 * though the academy BFF always supplies one. An unstamped (or empty-
 * string) `courseId` therefore matches ANY requested courseId; a stamped
 * record matches only its own. Exported as a pure function (rather than
 * inlined) so the exact match semantics are unit-testable without a live
 * Mongo connection — see `scripts/test-practice-assign.ts`, which evaluates
 * this `$or` clause against representative documents.
 */
export function courseIdFilter(courseId?: string): { $or: Array<Record<string, unknown>> } | undefined {
  if (!courseId) return undefined;
  return { $or: [{ courseId }, { courseId: { $exists: false } }, { courseId: '' }] };
}

/**
 * Query shape for `findOpenAssignments`, factored out (like `courseIdFilter`)
 * so it is unit-testable without a live Mongo connection — see
 * `scripts/test-practice-assign.ts`.
 *
 * `ignoreAcknowledged` (fix round 2, Critical C1) drops the
 * `acknowledgedAt: { $exists: false }` clause. `acknowledgedAt` is the
 * TUTOR's "have I mentioned this yet" bookkeeping — set the moment the
 * opener's continuity clause is *spoken*, not when the student actually
 * does the homework (see `learner-model/context-block.ts`'s caller, which
 * leaves this option unset on purpose). The student-facing read
 * (`assigned-practice` route) has a different notion of "open": within the
 * window and has a locator, full stop — a card the tutor already mentioned
 * must not vanish from the student's own Practice tab before it's done.
 */
export function openAssignmentsQuery(
  studentId: string,
  opts?: { withinDays?: number; requireLocator?: boolean; courseId?: string; ignoreAcknowledged?: boolean },
): Record<string, unknown> {
  const since = new Date(Date.now() - (opts?.withinDays ?? 21) * MS_PER_DAY);
  const q: Record<string, unknown> = { studentId, assignedAt: { $gte: since } };
  if (!opts?.ignoreAcknowledged) q.acknowledgedAt = { $exists: false };
  if (opts?.requireLocator !== false) q.locator = { $exists: true, $ne: '' };
  Object.assign(q, draftStatusClause());
  const courseQ = courseIdFilter(opts?.courseId);
  if (courseQ) Object.assign(q, courseQ);
  return q;
}

/** Query clause excluding drafted-but-not-finalized records from any
 *  student-facing or continuity read. A draft is provisional — evidence
 *  from LATER in the same session can still change which LOs it names —
 *  so it must never appear on the Practice tab or in the opener's
 *  continuity clause until `finalizeDraft` promotes it. */
export function draftStatusClause(): { status: { $ne: 'draft' } } {
  return { status: { $ne: 'draft' } };
}

/** Open = not acknowledged (unless `ignoreAcknowledged`), assigned within
 *  `withinDays` (default 21). With `requireLocator` (default true) only
 *  records the academy can render. `courseId` (fix round 1, Important I2)
 *  is applied INSIDE the query so Mongo filters before `.limit()` — a JS
 *  post-filter after `.limit(5)` could silently drop a matching assignment
 *  that didn't make the cut. See `openAssignmentsQuery` for the query shape
 *  itself and `ignoreAcknowledged`'s semantics (fix round 2, Critical C1). */
export async function findOpenAssignments(
  studentId: string,
  opts?: { withinDays?: number; requireLocator?: boolean; courseId?: string; ignoreAcknowledged?: boolean },
): Promise<IPracticeAssignment[]> {
  await connectDB();
  const q = openAssignmentsQuery(studentId, opts);
  return (await PracticeAssignmentModel.find(q).sort({ assignedAt: -1 }).limit(5).lean()) as IPracticeAssignment[];
}

export async function acknowledgeAssignments(ids: string[], at = new Date()): Promise<number> {
  if (ids.length === 0) return 0;
  await connectDB();
  const r = await PracticeAssignmentModel.updateMany({ _id: { $in: ids }, acknowledgedAt: { $exists: false } }, { $set: { acknowledgedAt: at } });
  return r.modifiedCount ?? 0;
}

/** Merge incoming drafted LOs into the existing draft's LOs: earlier LOs
 *  are kept (the session's evidence arrived first), duplicates by `loId`
 *  are dropped, and the result is capped at `max` (default `DRAFT_MAX_LOS`)
 *  so a long session doesn't balloon the homework card. Pure. */
export function mergeDraftLos(
  existing: IPracticeAssignmentLo[],
  incoming: IPracticeAssignmentLo[],
  max = DRAFT_MAX_LOS,
): IPracticeAssignmentLo[] {
  const out = [...existing];
  for (const lo of incoming) {
    if (out.length >= max) break;
    if (!out.some((e) => e.loId === lo.loId)) out.push(lo);
  }
  return out;
}

/** Patch that promotes a draft to 'assigned' at finalize time (any exit —
 *  the close tool, page-hide, the time cap, or a lazy sweep). Pure: the
 *  brain's own closing `reason` (when given) overwrites every LO's
 *  drafted-at-the-time reason uniformly, since it reflects the FULL
 *  session's evidence, not just the moment the LO was first drafted.
 *  `auto` follows the source — only an explicit close-tool call is
 *  non-auto, matching `assignPractice`'s existing convention. */
export function finalizePatch(
  rec: IPracticeAssignment,
  p: { reason?: string; nextTimeIntent?: string; locator?: string; source: FinalizeSource; now?: Date },
): Partial<IPracticeAssignment> {
  const now = p.now ?? new Date();
  const reason = p.reason?.trim().slice(0, 240);
  return {
    status: 'assigned',
    assignedAt: now,
    finalizedAt: now,
    finalizeSource: p.source,
    auto: p.source !== 'close_tool',
    los: reason ? rec.los.map((l) => ({ ...l, reason })) : rec.los,
    ...(p.nextTimeIntent?.trim() ? { nextTimeIntent: p.nextTimeIntent.trim().slice(0, 200) } : {}),
    ...(p.locator?.trim() ? { locator: p.locator.trim().slice(0, 80) } : {}),
  };
}

export async function findDraftBySession(sessionId: string): Promise<IPracticeAssignment | null> {
  await connectDB();
  return (await PracticeAssignmentModel.findOne({ sessionId, status: 'draft' }).lean()) as IPracticeAssignment | null;
}

export async function finalizeDraft(
  sessionId: string,
  p: { reason?: string; nextTimeIntent?: string; locator?: string; source: FinalizeSource },
): Promise<IPracticeAssignment | null> {
  await connectDB();
  const rec = await findDraftBySession(sessionId);
  if (!rec) return null;
  await PracticeAssignmentModel.updateOne({ _id: rec._id, status: 'draft' }, { $set: finalizePatch(rec, p) });
  return (await PracticeAssignmentModel.findById(rec._id).lean()) as IPracticeAssignment;
}

/** Drafts the session never finalized (tab killed, network gone): promote
 *  after `olderThanMs` with the draft's default reason. Called lazily from
 *  the student-facing reads, so "nightly" is whenever the student next looks. */
export async function sweepStaleDrafts(studentId: string, olderThanMs: number): Promise<number> {
  await connectDB();
  const cutoff = new Date(Date.now() - olderThanMs);
  const stale = (await PracticeAssignmentModel.find({ studentId, status: 'draft', draftedAt: { $lte: cutoff } }).lean()) as IPracticeAssignment[];
  for (const rec of stale) {
    await PracticeAssignmentModel.updateOne({ _id: rec._id, status: 'draft' }, { $set: finalizePatch(rec, { source: 'sweep' }) });
  }
  return stale.length;
}

/** Upsert a DRAFT keyed by `sessionId` (like `upsertAssignment`, but never
 *  demotes). If a record for this session already exists and is not a
 *  draft (i.e. it's 'assigned', or legacy status-less — which counts as
 *  assigned), the finalize already happened (or this is a legacy path):
 *  return the existing record untouched rather than overwriting it. When
 *  merging into an existing draft, LOs are combined via `mergeDraftLos`
 *  and triggers are unioned; `draftedAt`/`assignedAt` are pinned to the
 *  FIRST draft write so the sweep's staleness clock starts there. */
export async function upsertDraft(
  a: Omit<IPracticeAssignment, '_id' | 'createdAt' | 'assignedAt'> & { _id?: string },
): Promise<{ rec: IPracticeAssignment; alreadyAssigned: boolean }> {
  await connectDB();
  const existing = (await PracticeAssignmentModel.findOne({ sessionId: a.sessionId }).lean()) as IPracticeAssignment | null;
  if (existing && existing.status !== 'draft') return { rec: existing, alreadyAssigned: true }; // never demote (legacy = assigned)
  const _id = existing?._id ?? a._id ?? randomUUID();
  const los = existing ? mergeDraftLos(existing.los, a.los) : a.los.slice(0, DRAFT_MAX_LOS);
  const triggers = [...new Set([...(existing?.triggers ?? []), ...(a.triggers ?? [])])];
  await PracticeAssignmentModel.updateOne(
    { _id },
    {
      $set: { ...a, _id, los, triggers, status: 'draft', draftedAt: existing?.draftedAt ?? new Date(), assignedAt: existing?.assignedAt ?? new Date() },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );
  return { rec: (await PracticeAssignmentModel.findById(_id).lean()) as IPracticeAssignment, alreadyAssigned: false };
}
