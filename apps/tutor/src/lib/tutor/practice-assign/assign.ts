/**
 * assignPractice — shared server helper for homework assignment (spec
 * §C.2-C.3). Used by BOTH the practice-assign route (brain-tool-driven,
 * `auto: false`) and the commit-time fallback in
 * student-profile/[id]/route.ts (`auto: true`). Resolves items via
 * `resolveAssignmentItems` (which never generates — see resolve.ts) and
 * upserts one PracticeAssignment record per session.
 */
import connectDB from '@core/db';
import { EvidenceEventModel } from '@/models';
import { getLessonPlan } from '@/lib/tutor/lesson-plan/store';
import { mongoPracticeSources } from '@/lib/tutor/portal/adapters';
import { getLearnerHints } from '@/lib/tutor/learner-model/hints';
import { resolveAssignmentItems } from './resolve';
import { upsertAssignment } from './store';

const MAX_LOS = 2;

export async function assignPractice(input: {
  profileId: string;
  partnerId: string;
  externalStudentId: string;
  sessionId: string;
  lessonPlanId?: string;
  courseId?: string;
  loIds: string[];
  reason: string;
  locator?: string;
  nextTimeIntent?: string;
  subject?: string;
  auto: boolean;
}): Promise<{ assigned: Array<{ loId: string; title: string; count: number }>; assignmentId: string } | null> {
  const plan = input.lessonPlanId ? await getLessonPlan(input.lessonPlanId) : null;
  const titleFor = (loId: string): string => {
    const lo = plan?.los.find((l) => l.id === loId);
    return lo?.shortTitle ?? lo?.description ?? loId;
  };
  const loIds = [...new Set(input.loIds.filter((id) => typeof id === 'string' && id.length > 0))].slice(0, MAX_LOS);
  if (loIds.length === 0) return null;
  await connectDB();
  const seen = await EvidenceEventModel.find({ studentId: input.profileId, loId: { $in: loIds }, itemId: { $exists: true } }).select('itemId').lean();
  const seenItemIds = [...new Set(seen.map((r) => r.itemId).filter((x): x is string => typeof x === 'string'))];
  const hints = await getLearnerHints(input.externalStudentId, input.subject, input.partnerId);
  const los = await resolveAssignmentItems(
    { los: loIds.map((loId) => ({ loId, title: titleFor(loId) })), band: hints.band, seenItemIds, studentId: input.profileId, courseId: input.courseId ?? plan?.topic ?? '' },
    mongoPracticeSources(),
  );
  if (los.length === 0) return null;
  const rec = await upsertAssignment({
    studentId: input.profileId,
    partnerId: input.partnerId,
    sessionId: input.sessionId,
    lessonPlanId: input.lessonPlanId,
    courseId: input.courseId,
    los: los.map((l) => ({ ...l, reason: input.reason })),
    nextTimeIntent: input.nextTimeIntent,
    locator: input.locator,
    auto: input.auto,
    assignedAt: new Date(),
  });
  return { assignmentId: rec._id, assigned: los.map((l) => ({ loId: l.loId, title: l.title, count: l.items.length })) };
}
