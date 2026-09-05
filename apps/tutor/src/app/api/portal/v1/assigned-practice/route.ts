/** POST /api/portal/v1/assigned-practice — authoritative homework read (v1.15.0, spec §C.8). */
import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { AssignedPracticeRequestSchema, AssignedPracticeResponseSchema } from '@evelyn/portal-contract/v1';
import connectDB from '@core/db';
import { EvidenceEventModel, PracticeAssignmentModel } from '@/models';
import { resolveProfileIdOrRaw } from '@/lib/tutor/student-profile/store';
import { findOpenAssignments, courseIdFilter } from '@/lib/tutor/practice-assign/store';
import { computeHomeworkStatus } from '@/lib/tutor/practice-assign/status';

export const runtime = 'nodejs';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = AssignedPracticeRequestSchema.safeParse(auth.body);
  if (!parsed.success) return NextResponse.json({ error: 'invalid_request', issues: parsed.error.issues }, { status: 400 });
  const { studentId, courseId, includeAcknowledged } = parsed.data;
  const profileId = await resolveProfileIdOrRaw({ partnerId: auth.partnerId, externalStudentId: studentId });
  await connectDB();
  const records = includeAcknowledged
    ? await PracticeAssignmentModel.find({ studentId: profileId, locator: { $exists: true, $ne: '' }, ...(courseIdFilter(courseId) ?? {}) }).sort({ assignedAt: -1 }).limit(10).lean()
    : await findOpenAssignments(profileId, { withinDays: 21, requireLocator: true, courseId, ignoreAcknowledged: true });
  const itemIds = records.flatMap((a) => a.los.flatMap((l) => l.items.map((i) => i.id)));
  const rows = itemIds.length ? await EvidenceEventModel.find({ studentId: profileId, itemId: { $in: itemIds } }).select('itemId outcome occurredAt').lean() : [];
  const assignments = records.map((a) => {
    const st = computeHomeworkStatus(a, rows);
    return {
      assignmentId: a._id, sessionId: a.sessionId, assignedAt: a.assignedAt.toISOString(), ...(a.locator ? { locator: a.locator } : {}),
      los: a.los.map((l) => {
        const s = st.los.find((x) => x.loId === l.loId)!;
        return { loId: l.loId, title: l.title, reason: l.reason, items: l.items, status: { attempted: s.attempted, correct: s.correct, total: s.total, ...(s.lastAttemptAt ? { lastAttemptAt: s.lastAttemptAt } : {}) } };
      }),
    };
  });
  return NextResponse.json(AssignedPracticeResponseSchema.parse({ assignments }));
});
