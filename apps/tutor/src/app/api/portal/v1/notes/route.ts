/**
 * GET /api/portal/v1/notes?studentId=&baselineId= — resolved topic notes.
 * Reuses resolveTopicNotes (baseline + student overlays merged), including
 * the Phase 3(a) `sourceGapId` links.
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { resolveTopicNotes } from '@/lib/tutor/topic-notes/resolve';
import { resolveProfileIdOrRaw } from '@/lib/tutor/student-profile/store';

export const GET = withPortalAuth(async (req, auth) => {
  const sp = new URL(req.url).searchParams;
  const studentId = sp.get('studentId');
  const baselineId = sp.get('baselineId');
  if (!studentId || !baselineId) {
    return NextResponse.json({ error: 'bad_request', reason: 'studentId and baselineId required' }, { status: 400 });
  }
  // M1c Task 5 (fix round 1, CRITICAL 2) — StudentTopicNotes is a
  // student-keyed store (spec §4.1); this site was missed entirely in
  // round 1.
  const profileId = await resolveProfileIdOrRaw({ partnerId: auth.partnerId, externalStudentId: studentId });
  const notes = await resolveTopicNotes(profileId, baselineId);
  if (!notes) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json(notes);
});
