/**
 * POST /api/portal/v1/student-erase — irreversible learner-model erase for
 * one student (contract v1.12.0). Deletes the evidence log, projections,
 * snapshots, and per-subject Elo rows for `studentId` via
 * `deleteLearnerModelData` (src/lib/tutor/learner-model/store.ts) and reports
 * back the per-collection deleted-row counts.
 *
 * `trial:` ids are NOT special-cased here — deleteLearnerModelData runs for
 * them too. Nothing is ever written for a trial: student in the first place
 * (appendEvidence drops them before any write), so this is a harmless
 * all-zero-counts erase rather than a no-op branch.
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { StudentEraseRequestSchema, StudentEraseResponseSchema } from '@evelyn/portal-contract/v1';
import { deleteLearnerModelData } from '@/lib/tutor/learner-model/store';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = StudentEraseRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'bad_request', issues: parsed.error.issues }, { status: 400 });
  }

  const deleted = await deleteLearnerModelData(parsed.data.studentId);

  return NextResponse.json(StudentEraseResponseSchema.parse({ ok: true, deleted }));
});
