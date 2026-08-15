/**
 * GET /api/portal/v1/notes/unit?studentId=&course=&cedUnit= — a whole CED
 * unit's notes (v1.3.0). Composes every registered baseline for (course,
 * cedUnit), each resolved with the student's overlays, ordered by cedTopic.
 *
 * Returns 404 when the unit has no baselines yet. Like the per-topic /notes
 * route, this intentionally does NOT strip nulls: TheoryEntry.loId is a
 * required-but-nullable field, so a null there is contract-valid and must
 * survive serialization.
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { resolveUnitTopicNotes } from '@/lib/tutor/topic-notes/resolve';
import { resolveProfileIdOrRaw } from '@/lib/tutor/student-profile/store';

export const GET = withPortalAuth(async (req, auth) => {
  const sp = new URL(req.url).searchParams;
  const studentId = sp.get('studentId');
  const course = sp.get('course');
  const cedUnitRaw = sp.get('cedUnit');
  if (!studentId || !course || !cedUnitRaw) {
    return NextResponse.json(
      { error: 'bad_request', reason: 'studentId, course and cedUnit required' },
      { status: 400 },
    );
  }
  const cedUnit = Number(cedUnitRaw);
  if (!Number.isInteger(cedUnit)) {
    return NextResponse.json({ error: 'bad_request', reason: 'cedUnit must be an integer' }, { status: 400 });
  }
  // M1c Task 5 (fix round 1, CRITICAL 2) — see notes/route.ts's comment.
  const profileId = await resolveProfileIdOrRaw({ partnerId: auth.partnerId, externalStudentId: studentId });
  const notes = await resolveUnitTopicNotes(profileId, course, cedUnit);
  if (!notes) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json(notes);
});
