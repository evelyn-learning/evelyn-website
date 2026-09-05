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

/** Open = not acknowledged, assigned within `withinDays` (default 21). With
 *  `requireLocator` (default true) only records the academy can render. */
export async function findOpenAssignments(
  studentId: string,
  opts?: { withinDays?: number; requireLocator?: boolean },
): Promise<IPracticeAssignment[]> {
  await connectDB();
  const since = new Date(Date.now() - (opts?.withinDays ?? 21) * MS_PER_DAY);
  const q: Record<string, unknown> = { studentId, assignedAt: { $gte: since }, acknowledgedAt: { $exists: false } };
  if (opts?.requireLocator !== false) q.locator = { $exists: true, $ne: '' };
  return (await PracticeAssignmentModel.find(q).sort({ assignedAt: -1 }).limit(5).lean()) as IPracticeAssignment[];
}

export async function acknowledgeAssignments(ids: string[], at = new Date()): Promise<number> {
  if (ids.length === 0) return 0;
  await connectDB();
  const r = await PracticeAssignmentModel.updateMany({ _id: { $in: ids }, acknowledgedAt: { $exists: false } }, { $set: { acknowledgedAt: at } });
  return r.modifiedCount ?? 0;
}
