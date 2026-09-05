import { randomUUID } from 'node:crypto';
import connectDB from '@core/db';
import { PracticeAssignmentModel, type IPracticeAssignment } from '@/models';

const MS_PER_DAY = 86_400_000;

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
  const courseQ = courseIdFilter(opts?.courseId);
  if (courseQ) Object.assign(q, courseQ);
  return q;
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
