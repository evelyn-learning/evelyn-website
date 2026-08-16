/**
 * POST /api/portal/v1/context — context ingest.
 *
 * Persists durable preferences (humorCeiling/pacing/modality/tone + interests
 * + socialMemoryLevel) to the student profile via the existing preference
 * path. Reads socialMemory threads for the session only — NEVER persisted
 * engine-side (echoed back as transient so the caller sees what was accepted).
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { StudentContextSchema } from '@evelyn/portal-contract/v1';
import {
  updateStudentPreferences,
  resolveProfileIdOrRaw,
} from '@/lib/tutor/student-profile/store';
import type { StudentPreferences } from '@/lib/tutor/student-profile/types';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = StudentContextSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'bad_request', issues: parsed.error.issues }, { status: 400 });
  }
  // M1c Task 5 (fix round 2, IMPORTANT D) — StudentContextSchema declares
  // `studentId: z.string()` with no `.min(1)`, so `""` parses successfully.
  // Reject it here with a clean 400 rather than letting it reach
  // resolveProfileIdOrRaw, whose ProfileIdentityError now stays loud
  // (a 500) instead of silently degrading.
  if (!parsed.data.studentId) {
    return NextResponse.json({ error: 'bad_request', reason: 'studentId required' }, { status: 400 });
  }
  const ctx = parsed.data;
  const p = ctx.preferences;

  // Only forward defined preference keys to the existing merge-update path.
  const patch: Partial<StudentPreferences> = {};
  if (p.humorCeiling !== undefined) patch.humorCeiling = p.humorCeiling;
  if (p.pacing !== undefined) patch.pacing = p.pacing;
  if (p.modality !== undefined) patch.modality = p.modality;
  if (p.tone !== undefined) patch.tone = p.tone;
  if (p.interests !== undefined) patch.interests = p.interests;
  // socialMemoryLevel has a schema default of 'off'; store it as the ceiling.
  patch.socialMemoryLevel = p.socialMemoryLevel;

  // M1c Task 5 (fix round 1, CRITICAL 1) — this call site was missed
  // entirely: the enumeration grep excluded student-profile/store.ts, and
  // updateStudentPreferences's own getOrCreateStudentProfile call lives
  // inside that excluded file, so "all accounted for" was wrong. Resolve
  // with the verified auth.partnerId, never the raw body.
  const profileId = await resolveProfileIdOrRaw({ partnerId: auth.partnerId, externalStudentId: ctx.studentId });
  await updateStudentPreferences(profileId, patch);

  return NextResponse.json({
    ok: true,
    // Echoed back exactly as the portal sent it — the portal has no concept
    // of our internal surrogate profile id.
    studentId: ctx.studentId,
    storedPreferenceKeys: Object.keys(patch),
    // Transient — read for the session, not persisted.
    transient: {
      socialMemory: ctx.socialMemory ?? [],
      socialMemoryLevel: p.socialMemoryLevel,
    },
  });
});
