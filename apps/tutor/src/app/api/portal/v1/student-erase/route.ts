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
 * all-zero-counts erase rather than a no-op branch. M1c Task 5 (fix round
 * 2, IMPORTANT E): resolveProfileIdOrRaw never resolves a `trial:`-prefixed
 * id (flag on or off) — it stays that literal string all the way to
 * deleteLearnerModelData, which is what keeps this guarantee true post-M1c.
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { StudentEraseRequestSchema, StudentEraseResponseSchema } from '@evelyn/portal-contract/v1';
import { deleteLearnerModelData } from '@/lib/tutor/learner-model/store';
import { resolveProfileIdOrRaw } from '@/lib/tutor/student-profile/store';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = StudentEraseRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'bad_request', issues: parsed.error.issues }, { status: 400 });
  }

  // M1c final review (A-M5) — the same guard every sibling portal route
  // carries, for consistency and as a backstop.
  //
  // Correction to the review's premise, verified against the contract
  // package: unlike `SessionEmitRequestSchema` (`studentId: z.string()`,
  // where this guard is genuinely load-bearing), `StudentEraseRequestSchema`
  // is `z.object({ studentId: z.string().min(1) })` — so `""` is ALREADY a
  // clean 400 from `safeParse` above and never reaches
  // `resolveProfileIdOrRaw`'s deliberately-loud ProfileIdentityError. This
  // line is therefore unreachable today. It stays because the alternative
  // is a route whose safety depends on a `.min(1)` in a separately-versioned
  // package, and because a reader comparing these seven routes should not
  // have to re-derive which one is different and why.
  if (!parsed.data.studentId) {
    return NextResponse.json({ error: 'bad_request', reason: 'studentId required' }, { status: 400 });
  }

  // M1c Task 5 (fix round 1, CRITICAL 2) — must resolve to the SAME id the
  // data was written under, or an erase silently deletes nothing (a
  // freshly-minted, empty surrogate profile's evidence) while the
  // partner's actual data survives untouched — the opposite of what this
  // endpoint promises.
  const profileId = await resolveProfileIdOrRaw({ partnerId: auth.partnerId, externalStudentId: parsed.data.studentId });
  const deleted = await deleteLearnerModelData(profileId);

  return NextResponse.json(StudentEraseResponseSchema.parse({ ok: true, deleted }));
});
